jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail
	 */

	PAGEID : "ZUI5_HR_SickLeaveDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM11",
	BusyDialog : new sap.m.BusyDialog(),
	
	_vOrgeh : "",
	_vOrgtx : "",
	_vSpath : "",
	_useCustomPernrSelection : "", 
	
	onInit : function() {

		this.getView()
			.addEventDelegate({
				onBeforeShow : jQuery.proxy(function(evt) {
					this.onBeforeShow(evt);
				}, this),
				onAfterShow : jQuery.proxy(function(evt) {
					this.onAfterShow(evt);
				}, this)
			})
			.addStyleClass("sapUiSizeCompact");
		
		sap.ui.getCore().getEventBus()
			.subscribe("app", "OpenWindow", this.SmartSizing, this)
			.subscribe("app", "ResizeWindow", this.SmartSizing, this);
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vPernr = "",
			vEncid = "",
			vFromPageId = "",
			oDetailData = {Data : {}};
		
		oController.BusyDialog.open();
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		common.MandateAction.oController = oController;
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno || '';
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세 조회
		oController.retrieveDetail(oController, oDetailData);
//		// 상세 조회 Detail
//		oController.retrieveDetailTable(oController, oDetailData.Data.ZappStatAl);
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		// 위임자 조회
		common.MandateAction.onSearchMandate(oController);
		
		// 신청이력
		oController.searchHistory(oController);
		
		// 병가 combo
		oController.onSetAptyp(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onSetAptyp : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl"),
			oAptyp = sap.ui.getCore().byId(oController.PAGEID + "_Aptyp"),
			dIndex = 0;
		
		if(oAptyp) oAptyp.destroyItems();
		
		oModel.read("/AptypCodeListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						// 신규, 임시저장의 경우 9920 Item 삭제
						if(vZappStatAl == "" || vZappStatAl == "10") {
							if(data.results[i].Aptyp != "9920") {
								oAptyp.addItem(
										new sap.ui.core.Item({ 
											key: data.results[i].Aptyp, 
											text: data.results[i].Atext,
										})
								);
							}
						} else {
							oAptyp.addItem(
									new sap.ui.core.Item({ 
										key: data.results[i].Aptyp, 
										text: data.results[i].Atext,
									})
							);
						}
					}
				}
			},
			error : function(Res) {console.log(Res);}
		});
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0003")	// 3:결재선
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Text({
								text : "{ApprEnames}"
							}).addStyleClass("Font14px FontColor3")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail");
		var oController = oView.getController();
	},
	
	commonAction : function(oController, oDetailData) {
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		
		// 결재내역 
		common.ApprovalInformation.onSetApprovalInformation(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/SickLeaveDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'),
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				oDetailData.Data.Useday = "" + (data.results[0].Useday * 1).toFixed(0);
				oDetailData.Data.Begda = dateFormat.format(new Date(common.Common.setTime(data.results[0].Begda)));
				oDetailData.Data.Endda = dateFormat.format(new Date(common.Common.setTime(data.results[0].Endda)));
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}
	},
	
	retrieveDetailTable : function(oController, vZappStatAl) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel();
		
		oModel.read("/LeaveAppDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "H"),
			],
			success : function(data, res) {
				if(data && data.results){
					for(var i = 0; i < data.results.length; i++){
						data.results[i].Datum = dateFormat.format(new Date(common.Common.setTime(data.results[i].Datum)));
						data.results[i].ZappStatAl = vZappStatAl;
						oTableData.Data.push(data.results[i]);
					}
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}
		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
	},
	
	searchHistory : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			aFilters = [],
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
			oJSonModel = oTable.getModel(),
	        vAptyp = "1520",
	        vAppno = oController._DetailJSonModel.getProperty("/Data/Appno"),
		    vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vEncid = oController._TargetJSonModel.getProperty("/Data/Encid");
		
		if(common.Common.checkNull(vAptyp)){
			
		}else if(common.Common.checkNull(vPernr)){
			
		}else{
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vAptyp));
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vAppno));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid));
			
			oModel.read("/MaternityLeaveLogSet", { 
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						for(var i = 0; i < data.results.length; i++){
							oTableData.Data.push(data.results[i]);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
			}
		}
		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			errData = {};
		
		oModel.read("/SickLeaveDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I'),
			],
			success : function(data, res) {
				oController._vAppno = data.results[0].Appno;
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}
		// 휴가자/대근자 정보
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailJSonModel.setProperty("/Data/Appno" , oController._vAppno);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_1751") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1751:병가 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_1751") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1751:병가 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_1751") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1751:병가 신청
		}
	},
	
	onAfterSelectPernr : function(oController) {
		// Header 조회
//		oController.onSearchHeader(oController, "N");
//		oController.onSearchDetail(oController, "M");
		
		
		oController.searchHistory(oController);
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			var vSuccessyn = common.MandateAction.onSaveMandate(oController);
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "SickLeaveDetail", oneData));
			
			createData.Begda = (createData.Begda) ? "\/Date("+ common.Common.getTime(createData.Begda)+")\/" : undefined;
			createData.Endda = (createData.Endda) ? "\/Date("+ common.Common.getTime(createData.Endda)+")\/" : undefined;
			createData.Prcty = vPrcty;
			
			oModel.create("/SickLeaveDetailSet", createData, {
				success : function(data, res) {
					if(data) {
					} 
				},
				error : function (Res) {
					var errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});
		};
		
		// 신청 전 체크
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			oneData = oController._DetailJSonModel.getProperty("/Data"),
			vMtype = "",
			vMtext = "",
			vInfoTxt = "" , vCompTxt = "";
		
		oModel.read("/SickLeaveCheckSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter("Encid", sap.ui.model.FilterOperator.EQ, oneData.Encid),
				new sap.ui.model.Filter("Aptyp", sap.ui.model.FilterOperator.EQ, oneData.Aptyp),
				new sap.ui.model.Filter("Begda", sap.ui.model.FilterOperator.EQ, common.Common.getTime(oneData.Begda)),
				new sap.ui.model.Filter("Endda", sap.ui.model.FilterOperator.EQ, common.Common.getTime(oneData.Endda))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					vMtype = data.results[0].Mtype;
					vMtext = data.results[0].Mtext;
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				if(errData.Error && errData.Error == "E"){
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
		
		var confirmDialog = function() {
			var CreateProcess = function(fVal){
				if(fVal && fVal == sap.m.MessageBox.Action.YES) {
					oController.BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			if(vPrcty == "T"){
				vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
				vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
			}else {
				vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
				vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
			}
			
			sap.m.MessageBox.show(vInfoTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose : CreateProcess
			});
		}
		
		if(vMtype == "W") {
			sap.m.MessageBox.warning(vMtext, {
				onClose : confirmDialog
			});
		} else {
			confirmDialog();
		}
	},
	
	onValidationData : function(oController, vPrcty){		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!oneData.Pernr) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		if(!oneData.Aptyp) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2489"), {title : oBundleText.getText("LABEL_0053")});	// 2489:병가를 선택하여 주십시오.
			return false;
		}
		if(!oneData.Begda || !oneData.Endda) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2444"), {title : oBundleText.getText("LABEL_0053")});	// 2444:기간을 입력하여 주십시오.
			return false;
		}
		
		if(vPrcty == "C") {
			if(!oneData.Docyn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0284"));	// 284:증빙자료를 첨부하세요.
				return "";
			}
			
			// 결재자 지정여부 확인
			var oData = oController._ApprovalLineModel.getProperty("/Data");
			var vApprovalCheck = "";
			if(oData && oData.length > 0){
				for(var i=0; i <oData.length ; i++ ){
					if(oData[i].Aprtype == "A03001"){
						vApprovalCheck = "X";
						break;
					}
				}	
			}
			if(vApprovalCheck == ""){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0004"), {title : oBundleText.getText("LABEL_0053")});	// 결재자를 반드시 지정하시기 바랍니다.
				return false;
			}
		}
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
				
				oModel.remove("/SickLeaveDetailSet(Appno='" + oController._vAppno + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						var errData = common.Common.parseError(Res);
						vErrorMessage = errData.ErrorMessage;
					}
				});
				
				oController.BusyDialog.close();
								
				if(vErrorMessage != ""){
					sap.m.MessageBox.error(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				} 				
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					actions: [sap.m.MessageBox.Action.CLOSE],
			        onClose: oController.onBack
				});
		};
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}; 
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : DeleteProcess
		});
	},
	
	onChangeDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail"),
		    oController = oView.getController(),
		    vData = oController._DetailJSonModel.getProperty("/Data"),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		
		if(common.Common.checkNull(vData.Begda) || common.Common.checkNull(vData.Endda)) return ;
		var aFilters = [], rUseday = "", errData ={};
		
		aFilters.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, vData.Begda ));
		aFilters.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, vData.Endda ));
		
		// 적용일자 계산
		oModel.read("/MaternityLeaveCalcSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					rUseday = "" + (data.results[0].Useday * 1).toFixed(0);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
				}
			});
		}
		
		oController._DetailJSonModel.setProperty("/Data/Useday", rUseday); //적용 일수
	},
	
	onChangeAptyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail"),
	    oController = oView.getController();
	},
	
	onSearchDetail : function(oController, vPrcty){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = {Data : []},
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		    errData = {};
	
		if(!common.Common.checkNull(vHeader.Pernr) && !common.Common.checkNull(vHeader.Vcbeg) && 
		   !common.Common.checkNull(vHeader.Vcend) && !common.Common.checkNull(vHeader.Aptyp)){
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, vPrcty));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vHeader.Encid ));
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vHeader.Aptyp ));
			aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vHeader.Vcbeg ));
			aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vHeader.Vcend ));
			
			oModel.read("/LeaveAppDetailSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						for(var i = 0; i < data.results.length; i++){
							data.results[i].Datum = dateFormat.format(new Date(common.Common.setTime(data.results[i].Datum)));
							data.results[i].ZappStatAl = vHeader.ZappStatAl;
							oTableData.Data.push(data.results[i]);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
			}
		}
		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
	},
	
	onSearchDetailTable : function(oController, _sPath){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
	    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
	    oJSonModel = oTable.getModel(),
	    oTableData = {Data : []},
	    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
	    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
	    errData = {};

		oModel.read("/LeaveAppDetailSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i = 0; i < data.results.length; i++){
						data.results[i].Datum = dateFormat.format(new Date(common.Common.setTime(data.results[i].Datum)));
						data.results[i].ZappStatAl = vHeader.ZappStatAl;
						oTableData.Data.push(data.results[i]);
					}
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
				}
			});
		}
	},
	
	onSearchHeader : function(oController, vPrcty){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = {Data : []},
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		
		var aFilters = [ new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
						 new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, vPrcty)];
		
		var vData = {}, errData = {}; 
		if(!common.Common.checkNull(vHeader.Vcbeg) && !common.Common.checkNull(vHeader.Vcend) && !common.Common.checkNull(vHeader.Awart)){
			oModel.read("/SickLeaveDetailSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					vHeader.Ttext = data.results[0].Ttext;
					vHeader.Posday = "" + (data.results[0].Posday * 1).toFixed(1);
					vHeader.Useday = "" + (data.results[0].Useday * 1).toFixed(1);
					vHeader.Balday = "" + (data.results[0].Balday * 1).toFixed(1);
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
				return ;
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data", vHeader);
	},
	
	onCheckWorkSchedule : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Begda")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0063"), {title : oBundleText.getText("LABEL_0053")});	// 63:적용일을 선택하여 주십시오.
			return;
		}
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._PernrTprogDialog) {
			oController._PernrTprogDialog = sap.ui.jsfragment("ZUI5_HR_SickLeave.fragment.PernrTprog", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TprogTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vData = {Data : []};
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
			new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Begda"))
		];
		
		oModel.read("/PernrTprogListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				// 기준일, 근무형태
				var headerData = {Data : {}};
				headerData.Data.Datum = oController._DetailJSonModel.getProperty("/Data/Begda");
				
				if(data.results && data.results.length > 0) {
					headerData.Data.Rtext = data.results[0].Rtext;
					
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						vData.Data.push(data.results[i]);
					}
					
					oController._TprogTableJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length);
				}
				
				oController._TprogJSonModel.setData(headerData);
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController._PernrTprogDialog.open();
		
	},
	
});
