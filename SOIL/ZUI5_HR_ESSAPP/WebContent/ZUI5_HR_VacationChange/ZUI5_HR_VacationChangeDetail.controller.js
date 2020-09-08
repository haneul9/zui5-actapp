jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail", {
	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail
	 */

	PAGEID : "ZUI5_HR_VacationChangeDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyTableJSonModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	
	_Columns : "",
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM06",
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
			vEncid = "",
			vPernr = "",
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
		
		// 상세 조회
		oController.retrieveDetail(oController, oDetailData);
		// 상세조회 신청내역 Table
		var vShiftYn = oController.retrieveApplyTable(oController, oDetailData.Data.ZappStatAl, oDetailData.Data.Chtyp); 
		// 상세 조회 대상자 Detail
		oController.retrieveDetailTable(oController, oDetailData.Data.ZappStatAl);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		
		oDetailData.Data.ShiftYn = vShiftYn;
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
		
		sap.ui.getCore().byId(oController.PAGEID + "_checkAll").setSelected(false);
		
		var oAptypC = sap.ui.getCore().byId(oController.PAGEID +"_AptypC");
		
		// 휴가 combo
		if(!oController._Aptyp){
			oController._Aptyp = new sap.m.ComboBox({ 
				selectedKey : "{Aptyp}",
				editable : {
					parts : [{path : "ZappStatAl"}, {path : "Chtyp"}],
					formatter : function(fVal1, fVal2){
						if((fVal1 == "" || fVal1 == "10" ) && fVal2 == "A" ) return true;
						else return false;
					}
				},
				change : oController.onChangeTableAptyp,
				width : "98%",
			}).addStyleClass("FontFamily");
			var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
			oModel.read("/AptypCodeListSet", {
				async: false,
				filters : [
					new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
				],
				success: function(data,res){
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							oController._Aptyp.addItem(
								new sap.ui.core.Item({ 
									key: data.results[i].Aptyp, 
									text: data.results[i].Aptxt,
									customData : [new sap.ui.core.CustomData({ key : "Awart", value : data.results[i].Awart})], // 근무/휴무
																																// 유형
								})
							);
						}
					}
				},
				error: function(res){console.log(res);}
			});
		}
		
			
		if(oDetailData.Data.ZappStatAl == "" || oDetailData.Data.ZappStatAl == "10"){
			oAptypC.setTemplate(oController._Aptyp);
		}else{
			oAptypC.setTemplate(new sap.m.Text({
								text : "{Aptxt}"
								}).addStyleClass("Font14px FontColor6"));
		}
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		this.onSetRowSpan();
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamilyBold")	// 결재선
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Text({
								text : "{ApprEnames}"
							}).addStyleClass("FontFamily")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail");
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
		
		oModel.read("/ChangeLeaveAppSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'),
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				oDetailData.Data.Pernr = oDetailData.Data.Zpernr ;
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
	
	retrieveApplyTable : function(oController, vZappStatAl, vChtyp) {
// if(!oController._vAppno) return "";
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
			oJSonModel = oTable.getModel(),
			vShiftYn = "";
		
		if(oController._vAppno != ""){
			oModel.read("/ChangeLeaveAppDetailSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "G"),
				],
				success : function(data, res) {
					if(data && data.results){
						for(var i = 0; i < data.results.length; i++){
							data.results[i].Idx = i +1;
							data.results[i].ZappStatAl = vZappStatAl;
							data.results[i].Ovcbeg = dateFormat.format(new Date(common.Common.setTime(data.results[i].Ovcbeg)));
							data.results[i].Ovcend = dateFormat.format(new Date(common.Common.setTime(data.results[i].Ovcend)));
							data.results[i].Vcbeg = dateFormat.format(new Date(common.Common.setTime(data.results[i].Vcbeg)));
							data.results[i].Vcend = dateFormat.format(new Date(common.Common.setTime(data.results[i].Vcend)));
							data.results[i].Useday = (data.results[i].Useday * 1).toFixed(1);	
							data.results[i].Ouseday = (data.results[i].Ouseday * 1).toFixed(1);	
							data.results[i].Chtyp = vChtyp;
							if(data.results[i].ShiftYn == "Y") vShiftYn = "Y";
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
		}
		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
		
		return vShiftYn;
	},
	
	retrieveDetailTable : function(oController, vZappStatAl) {
// if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel();
		
		if(oController._vAppno != ""){
			oModel.read("/ChangeLeaveAppSspnrSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "H"),
				],
				success : function(data, res) {
					if(data && data.results){
						for(var i = 0; i < data.results.length; i++){
							data.results[i].ZappStatAl = vZappStatAl;
							data.results[i].Perid = data.results[i].Sperid;
							data.results[i].Ovcbeg = dateFormat.format(new Date(common.Common.setTime(data.results[i].Ovcbeg)));
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
		}
		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			errData = {};
		
		oModel.read("/ChangeLeaveAppSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_2357") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록,
																												// 2357:휴가
																												// 변경/취소
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2357") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정,
																												// 2357:휴가
																												// 변경/취소
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_2357") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회,
																												// 2357:휴가
																												// 변경/취소
		}
	},
	
	onSetRowSpan : function(oEvent){
		 var oTds = $("td[colspan]");
         for(i=0; i<oTds.length; i++) {
            if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
         }   
         
         common.Common.generateForceRowspan({
 			selector : '#ZUI5_HR_VacationChangeDetail_ApplyTable-header > tbody',
 			colIndexes : [0, 1, 8, 9, 10, 11, 12]
// colIndexes : [0, 1, 9, 10, 11, 12, 13]
 		});
         
 		// Table Header 높이 설정
 		var $target = $('#ZUI5_HR_VacationChangeDetail_ApplyTable-header > tbody> tr');
 		
 		$target.each(function() {
 			$(this).css('height', '33px');
 		});
	},
	
	// 등록
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
		    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를
																													// 선택하여
																													// 주십시오.
			return;
		}
		
		oController._vOrgeh = oController._TargetJSonModel.getProperty("/Data/Orgeh");
		oController._vOrgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx");
		oController._vSpath = oEvent.getSource().getBindingContext().sPath;
		oController._useCustomPernrSelection = "X";
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
			oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(oController._selectionRowIdx != null && vIDXs.length > 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는
																			// 한명만
																			// 선택이
																			// 가능합니다.
				return;
			} else if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를
																			// 선택하여
																			// 주십시오.
				return;
			}
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath,
			svPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr"),
			svPerid = mEmpSearchResult.getProperty(_selPath + "/Perid"),
			svEname = mEmpSearchResult.getProperty(_selPath + "/Ename"),
			svEncid = mEmpSearchResult.getProperty(_selPath + "/Encid");
		
			if(svPernr == oController._DetailJSonModel.getProperty("/Data/Pernr")){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2454"), {title : oBundleText.getText("LABEL_0053")});	// 2454:대상자와
																														// 동일한
																														// 대근자를
																														// 입력할
																														// 수는
																														// 없습니다.
				return;
			}
			
			var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			oDetailTable.getModel().setProperty(oController._vSpath + "/Pernr", oController._DetailJSonModel.getProperty("/Data/Pernr"));
			oDetailTable.getModel().setProperty(oController._vSpath + "/Sspnr", svPernr);
			oDetailTable.getModel().setProperty(oController._vSpath + "/Sperid", svPerid);
			oDetailTable.getModel().setProperty(oController._vSpath + "/Encid", svEncid);
			oDetailTable.getModel().setProperty(oController._vSpath + "/Ename", svEname);
			oDetailTable.getModel().setProperty(oController._vSpath + "/ZappStatAl", "");
			
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data")
			// 대근자 근태정보 조회
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		    errData = {},
			oneData = oController._DetailJSonModel.getProperty("/Data"),
			createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "LeaveAppList", oneData));
			
			createData.Vcbeg = (createData.Vcbeg) ? "\/Date("+ common.Common.getTime(createData.Vcbeg)+")\/" : undefined;
			createData.Vcend = (createData.Vcend) ? "\/Date("+ common.Common.getTime(createData.Vcend)+")\/" : undefined;
			createData.Prcty = "O";
			createData.Zpernr = oneData.Pernr ;
			createData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
			
			// 출산휴가일 경우
			if(createData.Aptyp == "2030"){
				createData.Babduda = (createData.Babduda) ? "\/Date("+ common.Common.getTime(createData.Babduda)+")\/" : undefined;
				createData.MatleavCnt = "" + (createData.MatleavCnt + 1);
			}else{
				delete createData.MatleavCnt;
				delete createData.Babduda;
			}
			
			var oTableData = [];
			for(var i = 0; i < vTableData.length; i++){
				var vTemp = {};
				Object.assign(vTemp, common.Common.copyByMetadata(oModel, "LeaveAppDetail", vTableData[i]));
				vTemp.Datum = (vTemp.Datum) ? "\/Date("+ common.Common.getTime(vTemp.Datum)+")\/" : undefined;
				vTemp.Ovcbeg = (vTemp.Ovcbeg) ? "\/Date("+ common.Common.getTime(vTemp.Ovcbeg)+")\/" : undefined;
				
				oTableData.push(vTemp);
			}
			createData.LeaveAppNav = oTableData;
			
			var newTableData = {Data : []};
			oModel.create("/LeaveAppListSet", createData, {
				success : function(data, res) {
					if(data) {
						if(data.LeaveAppNav.results && data.LeaveAppNav.results.length){
							for(var i =0; i <data.LeaveAppNav.results.length; i++){
								data.LeaveAppNav.results[i].ZappStatAl = createData.ZappStatAl;
								data.LeaveAppNav.results[i].Ovcbeg = data.LeaveAppNav.results[i].Ovcbeg == data.LeaveAppNav.results[i].Ovcbeg ? 
										dateFormat.format(new Date(common.Common.setTime(data.LeaveAppNav.results[i].Ovcbeg))):
										"";
								newTableData.Data.push(data.LeaveAppNav.results[i]);
							}
						}
					} 
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
			}
			
			oController._DetailTableJSonModel.setData(newTableData);
			

			
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를
																													// 선택하여
																													// 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail");
		var oController = oView.getController(),
		oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		// 선택한 값 Clear
		oDetailTable.getModel().setProperty(oController._vSpath + "/Encid", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Pernr", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Perid", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Ename", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/ZappStatAl", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Sttext", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/TwrktmDat", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/TwrktmWek", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/RestmTre", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Zstat", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Confchk", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Stprog", "");
		
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._vOrgeh = '';
		oController._vOrgtx = '';
		oController._useCustomPernrSelection = '';
		oController._vSpath = '';
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController, isDelHstyp) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		detailData.Aptyp = ""; // 신청유형
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},	
	
	onResetDetailTable : function(oController) {
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		oDetailTableModel = oDetailTable.getModel();
		
		oDetailTable.setVisibleRowCount(1);
		oDetailTableModel.setData({Data : []});
		if(oApplyTable){
			oApplyTable.setVisibleRowCount(1);
			oApplyTable.getModel().setData({Data : []});
		}
	},
	
	onAfterSelectPernr : function(oController) {
		if(oController._MandateDialog && oController._MandateDialog.isOpen()){
			
		}else{
			oController.onResetDetail(oController);
			oController.onResetDetailTable(oController);
		}
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		var vRet = oController.onValidationData(oController, vPrcty);
		if(vRet == false) return;
		
		var onProcess = function(){
			// 위임여부 저장
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
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "ChangeLeaveApp", oneData));
			
			createData.Prcty = vPrcty;
			createData.Zpernr = oneData.Pernr ;
			createData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename") ;
			if(createData.Chtyp == "A") createData.Chtxt = oBundleText.getText("LABEL_0751");	// 751:변경
			else createData.Chtxt = oBundleText.getText("LABEL_0071");	// 71:취소
				
			// 신청내역
			var vApplyData = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable").getModel().getProperty("/Data");
			var oApplyData = [];
			for(var i = 0; i < vApplyData.length; i++){
				var vTemp = {};
				Object.assign(vTemp, common.Common.copyByMetadata(oModel, "ChangeLeaveAppDetail", vApplyData[i]));
				vTemp.Vcbeg = (vTemp.Vcbeg) ? "\/Date("+ common.Common.getTime(vTemp.Vcbeg)+")\/" : undefined;
				vTemp.Vcend = (vTemp.Vcend) ? "\/Date("+ common.Common.getTime(vTemp.Vcend)+")\/" : undefined;
				vTemp.Ovcbeg = (vTemp.Ovcbeg) ? "\/Date("+ common.Common.getTime(vTemp.Ovcbeg)+")\/" : undefined;
				vTemp.Ovcend = (vTemp.Ovcend) ? "\/Date("+ common.Common.getTime(vTemp.Ovcend)+")\/" : undefined;
				vTemp.Appno = oneData.Appno;
				oApplyData.push(vTemp);
			}
			createData.ChangeLeaveNav1 = oApplyData; 
			
			// 변경일 때만 대근자 정보 전송
			if(createData.Chtyp == "A"){
				// 대근자
				var vPernrData = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable").getModel().getProperty("/Data");
				var oPernrData = [];
				for(var i = 0; i < vPernrData.length; i++){
					var vTemp = {};
					Object.assign(vTemp, common.Common.copyByMetadata(oModel, "ChangeLeaveAppSspnr", vPernrData[i]));
					vTemp.Datum = (vTemp.Datum) ? "\/Date("+ common.Common.getTime(vTemp.Datum)+")\/" : undefined;
					vTemp.Ovcbeg = (vTemp.Ovcbeg) ? "\/Date("+ common.Common.getTime(vTemp.Ovcbeg)+")\/" : undefined;
					
					vTemp.Appno = oneData.Appno;
					oPernrData.push(vTemp);
				}
				createData.ChangeLeaveNav2 = oPernrData;
			}
			
			
			oModel.create("/ChangeLeaveAppSet", createData, {
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
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		}else {
			var vPersk = oController._TargetJSonModel.getProperty("/Data/Persk");
			if(vPersk != "23" && vPersk != "33"){ // 생산직 일 경우
				if(oController._DetailJSonModel.getProperty("/Data/Chtyp") == "A"){ // 변경 일
																					// 경우
					vInfoTxt = oBundleText.getText("LABEL_2929");	// LABEL_2929=휴가
																	// 변경 신청시
																	// 결재선은
																	// 팀리더>부문장
																	// 입니다.
				}else{ // 취소 일 경우
					vInfoTxt = oBundleText.getText("LABEL_2930");	// LABEL_2930=휴가
																	// 변경 신청시
																	// 결재선은
																	// 팀리더>부문장>본부장
																	// 이상 전결
																	// 입니다.
				}
			}else{
				vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			}
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		var vMeesageFunc = function(){
			sap.m.MessageBox.show(vInfoTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose : CreateProcess
			});
		}
		

		if(vRet == "W"){ 
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2479"), {	// 2479:변경
																		// 후
																		// 휴가일수가
																		// 줄었습니다.
																		// \n
																		// 추가로
																		// 휴가신청서를
																		// 작성하세요.
				title : oBundleText.getText("LABEL_1484"),	// 1484:경고
				onClose : vMeesageFunc
			});
		}else if(vRet == "Z"){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2479") + "\n" + oBundleText.getText("LABEL_2931"), {	// 2479:변경
																													// 후
																													// 휴가일수가
																													// 줄었습니다.
																													// \n
																													// 추가로
																													// 휴가신청서를
																													// 작성하세요.
				title : oBundleText.getText("LABEL_1484"),	// 1484:경고
				onClose : vMeesageFunc
			});
		}else if(vRet == "V"){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2931"), {	// 2479:변경
																		// 후
																		// 휴가일수가
																		// 줄었습니다.
																		// \n
																		// 추가로
																		// 휴가신청서를
																		// 작성하세요.
				title : oBundleText.getText("LABEL_0052"),	// LABEL_0052:안내
				onClose : vMeesageFunc
			});
		}else{
			vMeesageFunc();
		}
	},
	
	onValidationData : function(oController, vPrcty){		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!oneData.Pernr) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를
																													// 선택하여
																													// 주십시오.
			return false;
		}
		if(!oneData.Chtyp) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2531"), {title : oBundleText.getText("LABEL_0053")});	// 2531:신청
																													// 유형을
																													// 선택하여
																													// 주십시오.
			return false;
		}
		
		var vApplyData = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable").getModel().getData();
		var minusValYear = "";
		// 신청유형이 변경일 경우
		if(oneData.Chtyp == "A"){
			if(common.Common.checkNull(vApplyData.Data)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2480"), {title : oBundleText.getText("LABEL_0053")});	// 2480:변경할
																														// Data를
																														// 선택하여
																														// 주십시오.
				return false;
			}
			var vTotal = 0, vOldTotal = 0;
			for(var i=0; i<vApplyData.Data.length; i++){
				var vIdx = i + 1, element = vApplyData.Data[i];
				if(common.Common.checkNull(element.Aptyp)){
					sap.m.MessageBox.error(vIdx +" " + oBundleText.getText("LABEL_2718"), {title : oBundleText.getText("LABEL_0053")});	// 2718:번째
																																		// 신청내역의
																																		// 휴가
																																		// 정보가
																																		// 입력되지
																																		// 않았습니다.
					return false;
				}
				
				if(common.Common.checkNull(element.Vcbeg)){
					sap.m.MessageBox.error(vIdx +" " + oBundleText.getText("LABEL_2719"), {title : oBundleText.getText("LABEL_0053")});	// 2719:번째
																																		// 신청내역의
																																		// 시작일자가
																																		// 입력되지
																																		// 않았습니다.
					return false;
				}
				
				if(common.Common.checkNull(element.Vcend)){
					sap.m.MessageBox.error(vIdx +" " + oBundleText.getText("LABEL_2720"), {title : oBundleText.getText("LABEL_0053")});	// 2720:번째
																																		// 신청내역의
																																		// 종료일자가
																																		// 입력되지
																																		// 않았습니다.
					return false;
				}
				
				if(common.Common.checkNull(element.Reasn)){
					sap.m.MessageBox.error(vIdx +" " + oBundleText.getText("LABEL_2868"), {title : oBundleText.getText("LABEL_0053")});	// 2720:번째
																																		// 신청내역의
																																		// 사유가
																																		// 입력되지
																																		// 않았습니다.
					return false;
				}
				
				if(common.Common.checkDate(element.Vcbeg, element.Vcend) == false) {
					sap.m.MessageBox.error(vIdx +" " + oBundleText.getText("LABEL_2721"), {title : oBundleText.getText("LABEL_0053")});	// 2721:번째
																																		// 신청내역의
																																		// 시작일자가
																																		// 종료일자보다
																																		// 큽니다.
					return false ;
				}
				
				if(element.Useday * 1 == 0){
					sap.m.MessageBox.error(vIdx +" " + oBundleText.getText("LABEL_2722"), {title : oBundleText.getText("LABEL_0053")});	// 2722:번째
																																		// 신청내역의
																																		// 휴가일수가
																																		// 0
																																		// 입니다.
					return false;
				}
				
				if(element.BaldayYea * 1 < 0){
					if(element.Aptyp == "1000" || element.Aptyp == "1010" || 
					   element.Aptyp == "1020" || element.Aptyp == "1030"){
						minusValYear = "X";
					}
				}
				
				vTotal = vTotal + (element.Useday * 1);
				vOldTotal = vOldTotal + (element.Ouseday * 1);
				
				for(var j=0; j<vApplyData.Data.length; j++){
					if(i == j) continue;
					var element2 = vApplyData.Data[j]; 
					if(element.Awart == element2.Awart && 
					   element.Vcbeg == element2.Vcbeg && 
					   element.Vcend == element2.Vcend){
						sap.m.MessageBox.error(oBundleText.getText("LABEL_2998"), {title : oBundleText.getText("LABEL_0053")});	// 2998 : 동일한 휴가 내용이 입력되어 있습니다. 확인하시기 바랍니다. .
						return false;
					}
				
				}
			}
			
		}else{
			if(common.Common.checkNull(vApplyData.Data)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2620"), {title : oBundleText.getText("LABEL_0053")});	// 2620:취소할
																														// Data를
																														// 선택하여
																														// 주십시오.
				return false;
			}
		}
		
		if(vPrcty == "C") {
			// 2030 배우자출산휴가 2040 난임치료휴가(유급) 2050 난임치료휴가(무급)
			if(oneData.Aptyp =="2030" || oneData.Aptyp =="2040" || oneData.Aptyp =="2050"){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0284"));	// 284:증빙자료를
																							// 첨부하세요.
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
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0004"), {title : oBundleText.getText("LABEL_0053")});	// 결재자를
																														// 반드시
																														// 지정하시기
																														// 바랍니다.
				return false;
			}
			
			// Persg = 2(정규직), Persk = 23(생산직) 제외
			// Persg = 3(계약직), Persk = 33(생산직) 제외
			var vPersg = oController._TargetJSonModel.getProperty("/Data/Persg"),
				vPersk = oController._TargetJSonModel.getProperty("/Data/Persk");
			
			if(!(vPersg == "2" && vPersk == "23") && !(vPersg == "3" && vPersk == "33")) {
				if(vOldTotal > vTotal) {
					if(minusValYear == "X") return "Z";
					else return "W";
				} else if(minusValYear == "X") {
					return "V";
				}
			}
		}
		
		return true;
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
				
				oModel.remove("/ChangeLeaveAppSet(Appno='" + oController._vAppno + "')", {
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
					return;
				} 				
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가
																			// 완료되었습니다.
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
	
	onChangeChtyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
	    oController = oView.getController(),
	    oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
	    oApplyModel = oApplyTable.getModel(),
	    vApplyData = oApplyModel.getData(),
	    vChtyp = oController._DetailJSonModel.getProperty("/Data/Chtyp");
		
		if(common.Common.checkNull(vApplyData.Data)) return;
		
		vApplyData.Data.forEach(function(element){
			element.Chtyp = vChtyp ;
			if(vChtyp == "B"){
				element.Vcbeg = element.Ovcbeg;
				element.Vcend = element.Ovcend;
				element.Useday = element.Ouseday;
				element.Offdut = element.Ooffdut;
				element.Conchk = element.Oconchk;
				element.Mrdchk = element.Omrdchk;
				element.Beguz  = element.Obeguz;
				element.Enduz  = element.Oenduz;
				element.Aptyp  = element.Oaptyp;
				element.Aptxt  = element.Oaptxt;
				element.Awart  = element.Oawart;
			}
		})
		oApplyModel.setData(vApplyData);
	},
	
	onSearchApplyDetail : function(oController, vPrcty){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
	    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
	    oJSonModel = oTable.getModel(),
	    oTableData = {Data : []},
	    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
	    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
	    errData = {};
	
		if(!common.Common.checkNull(vHeader.Encid) && !common.Common.checkNull(vHeader.Vcbeg) && 
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
		var vData = {}, errData = {}; 
		
		if(!common.Common.checkNull(vHeader.Encid) && !common.Common.checkNull(vHeader.Vcbeg) && 
				   !common.Common.checkNull(vHeader.Vcend) && !common.Common.checkNull(vHeader.Aptyp)){
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, vPrcty));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vHeader.Encid ));
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vHeader.Aptyp ));
			aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vHeader.Vcbeg ));
			aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vHeader.Vcend ));
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno ));			
		
			oModel.read("/ChangeLeaveAppSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					vHeader.Ttext = data.results[0].Ttext;
					vHeader.Posday = "" + (data.results[0].Posday * 1).toFixed(1);
					vHeader.Useday = "" + (data.results[0].Useday * 1).toFixed(1);
					vHeader.Balday = "" + (data.results[0].Balday * 1).toFixed(1);
					vHeader.ShiftYn = data.results[0].ShiftYn ;
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
				return "X";
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data", vHeader);
		return "";
	},
	
	onCheckWorkSchedule : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를
																													// 선택하여
																													// 주십시오.
			return;
		}
		
		var oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		oApplyModel = oApplyTable.getModel(),
		vApplyData = oApplyModel.getData(),
		vIDXs = [];
		
	
		if(!vApplyData || !vApplyData.Data){
			return;
		} 
	
		for(var i =0; i < vApplyData.Data.length ; i++){
			if(vApplyData.Data[i].Check == true) vIDXs.push(vApplyData.Data[i]);
			
		}
	
		if(vIDXs.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2598"));	// 2598:조회할
																		// 신청건을
																		// 선택하여
																		// 주십시오.
			return;
		}else if(vIDXs.length > 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2723"));	// 2723:1건의
																		// 신청에
																		// 해당하는
																		// 근무일정만
																		// 조회할 수
																		// 있습니다.
			return;
		}
		
		
		if(!oController._PernrTprogDialog) {
			oController._PernrTprogDialog = sap.ui.jsfragment("ZUI5_HR_VacationChange.fragment.PernrTprog", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TprogTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vData = {Data : []};
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
			new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, vIDXs[0].Vcbeg)
		];
		
		oModel.read("/PernrTprogListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				// 기준일, 근무형태
				var headerData = {Data : {}};
				headerData.Data.Datum = vIDXs[0].Vcbeg;
				
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
	
	CheckAll : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail");
		var oController = oView.getController();
		var vSelected = oEvent.getParameters().selected,
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		    oModel = oTable.getModel(),
		    vTableData = oModel.getProperty("/Data");
		for(var i = 0; i <vTableData.length; i++){
			oModel.setProperty("/Data/" + i + "/Check", vSelected);
		}
	},
	
	openHistoryDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를
																													// 선택하여
																													// 주십시오.
			return;
		}
		
		if(!oController._HistoryDialog) {
			oController._HistoryDialog = sap.ui.jsfragment("ZUI5_HR_VacationChange.fragment.ApplyHistory", oController);
			oView.addDependent(oController._HistoryDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
		oModel = oTable.getModel(),
		oHistoryMatrix = sap.ui.getCore().byId(oController.PAGEID + "_HistoryMatrix"),
		oHisotryModel = oHistoryMatrix.getModel(),
		curDate = new Date(),
		prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 3,  curDate.getDate()),
		nextDate = new Date(curDate.getFullYear(), 11, 31),
		dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
		vNewSystemDate = new Date(2020,0,1);
		
		if(prevDate < vNewSystemDate){
			prevDate = vNewSystemDate;
		}
		
		var JSonData = { Data : { Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(nextDate) ,
			         Pernr : oController._DetailJSonModel.getProperty("/Data/Pernr"), Ename : oController._TargetJSonModel.getProperty("/Data/Ename") }};
		
		oTable.clearSelection();
		oTable.setVisibleRowCount(1);
		oModel.setData({Data : []});
		oHisotryModel.setData(JSonData);
		
		oController._HistoryDialog.open();
	},
	
	onChangeApplyHisotryApbeg : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
	    oController = oView.getController();
		var curDate = new Date(),
			maxDate = new Date( curDate.getFullYear(), curDate.getMonth()-3, curDate.getDate()),
			vInputApbeg = common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID +"_ApplyHisotryApbeg").getDateValue());
		
		var vNewSystemDate = new Date(2020,0,1);
		
		if(vInputApbeg < maxDate){
			sap.ui.getCore().byId(oController.PAGEID +"_ApplyHisotryApbeg").setValue("");
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2615"), {title : oBundleText.getText("LABEL_0053")});	// 2615:최대
																													// 3개월
																													// 전의
																													// 신청
																													// 건만
																													// 수정이
																													// 가능합니다.
			return;
		}else if(vInputApbeg < vNewSystemDate){
			sap.ui.getCore().byId(oController.PAGEID +"_ApplyHisotryApbeg").setDateValue(vNewSystemDate);
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2942"), {title : oBundleText.getText("LABEL_0053")});	// 2942:2020년
																													// 1월
																													// 1일
																													// 이전의
																													// 신청문서는
																													// 조회할
																													// 수
																													// 없습니다.
			return;
		}
	},
	
	onPressSearchHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
	    oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
		oHistoryMatrix = sap.ui.getCore().byId(oController.PAGEID + "_HistoryMatrix");
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vData = {Data : []}, errData = {},
			oHistoryTableModel = oTable.getModel(),
			oHisotryModel = oHistoryMatrix.getModel(),
			sData = oHisotryModel.getProperty("/Data");
		
		if(common.Common.checkNull(sData.Apbeg) || common.Common.checkNull(sData.Apend)){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2593"), {title : oBundleText.getText("LABEL_0053")});	// 2593:조회기간을
																													// 정확하게
																													// 입력하여
																													// 주십시오.
			return;
		}
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
			new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, sData.Apbeg),
			new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, sData.Apend),
		];
		
		var onProcess = function(){
			oModel.read("/OriginLeaveAppListSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						data.results[i].Useday = ( data.results[i].Useday * 1 ).toFixed(1);
						vData.Data.push(data.results[i]);
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oHistoryTableModel.setData(vData);
			oTable.setVisibleRowCount(vData.Data.length);
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage)
				return ;
			}
		}
		oController.BusyDialog.open();		
		setTimeout(onProcess, 100);
		

	},
	
	onSelectHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail");
		    oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
		    oModel = oTable.getModel(),
		    vResult = oModel.getProperty("/Data"),
		    vIDXs = oTable.getSelectedIndices(),
		    seqNo = 0,
		    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		    
		if(vIDXs.length > 5){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2616"));	// 2616:최대
																		// 5건을
																		// 선택할 수
																		// 있습니다.
			return;
		}else if(vIDXs.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2483"));	// 2483:변경할
																		// 신청건을
																		// 선택하여
																		// 주십시오.
			return;
		}

		var oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
			oApplyModel = oApplyTable.getModel(),
			vTableData = oApplyModel.getData();
		
		var vShiftYn = "";
		for(var i = 0; i < vIDXs.length; i++ ){
			vShiftYn = oModel.getProperty(oTable.getContextByIndex(vIDXs[i]).sPath +"/ShiftYn");
			if(vShiftYn == "Y") break;
		}
		
		if(vShiftYn == "Y"){
			if((vIDXs.length > 1) || (vTableData.Data && vTableData.Data.length > 0) ){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2420"));	// 2420:교대조가
																			// 포함된
																			// 신청
																			// 건은
																			// 1건만
																			// 신청이
																			// 가능합니다.
				return;
			}
		}
		
		// 중복체크
		vShiftYn = "";
		if(vTableData.Data && vTableData.Data.length) {
			try {
				vTableData.Data.forEach(function(prop, index, array) {
					vIDXs.forEach(function(element) {
						if(prop.ShiftYn == "Y") {
							throw new Error(oBundleText.getText("LABEL_2421"));	// 2421:교대조가
																				// 포함된
																				// 신청
																				// 건이
																				// 추가된
																				// 경우
																				// 더이상의
																				// 신청건을
																				// 포함시킬
																				// 수
																				// 없습니다.
						}
						
						if(prop.Oappno == oModel.getProperty(oTable.getContextByIndex(element).sPath +"/Appno") && 
						   prop.Ovcbeg == dateFormat.format(oModel.getProperty(oTable.getContextByIndex(element).sPath +"/Vcbeg"))){
						   throw new Error(oBundleText.getText("LABEL_2564"));	// 2564:이미
																				// 추가된
																				// 휴가신청입니다.
						}
					});
				});
			} catch(ex) {
				sap.m.MessageBox.alert(ex.message);
				return;
			}
			
			seqNo = vTableData.Data.length;
		}else{
			vTableData = { Data : []};
		}
		
		var addData = {}, temp = {},
		vChtyp = oController._DetailJSonModel.getProperty("/Data/Chtyp");
		
		vIDXs.forEach(function(element) {
			addData = {} ,  temp = {}, vResult = {};
			vResult = oModel.getProperty(oTable.getContextByIndex(element).sPath);
			vResult.sPath = "/Data/" + seqNo ;
			
			Object.assign(addData, vResult);
			Object.assign(temp, vResult);

			seqNo = seqNo + 1;
			addData.Idx = seqNo;
			addData.ZappStatAl = "";
			addData.Oappno = vResult.Appno;
			addData.Oseqnr = vResult.Zseqnr;
			addData.Ovcbeg = dateFormat.format(vResult.Vcbeg); 
			addData.Ovcend = dateFormat.format(vResult.Vcend);
			delete addData.Vcbeg;
			delete addData.Vcend;	
			addData.Obeguz = vResult.Beguz;
			addData.Oenduz = vResult.Enduz;
			addData.Oaptyp = vResult.Aptyp;
			addData.Oaptxt = vResult.Aptxt;
			addData.Oawart = vResult.Awart;
			addData.Ouseday = vResult.Useday;
			addData.Ooffdut = vResult.Offdut;
			addData.Oconchk = vResult.Conchk;
			addData.Omrdchk = vResult.Mrdchk;
			addData.Chtyp = vChtyp;
			addData.Check = false;
			// 집중휴가일 경우 집중휴가 선택 (변경 못함)
//			addData.Aptyp = vResult.Aptyp == "1000" ? "1000" : "";
//			addData.Aptxt = vResult.Aptyp == "1000" ? vResult.Aptxt : "";
//			addData.Aptyp = vResult.Aptyp == "1000" ? vResult.Awart : "";
			vTableData.Data.push(addData);
		});
		
		var vShiftYn = "";
		for(var i = 0; i <vTableData.Data.length; i++){
			if(vTableData.Data[i].ShiftYn == "Y"){
				vShiftYn = "Y";
				break;
			}
		}
		oController._DetailJSonModel.setProperty("/Data/ShiftYn", vShiftYn);
		
		oApplyModel.setData(vTableData);
		oApplyTable.setVisibleRowCount(vTableData.Data.length);
		oApplyModel.refresh();
		
		// 대근자 입력 생성
		vIDXs.forEach(function(element) {
			oController.onCheckPernrList(oController, oModel.getProperty(oTable.getContextByIndex(element).sPath+"/sPath"));
		});
		
		oController._HistoryDialog.close();
	
	},
	
	onChangeTableAptyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
	    oController = oView.getController(),
	    oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
	    oApplyModel = oApplyTable.getModel(),
	    vAwart = "", vAptxt = "";
		
		if(oEvent.getSource().getSelectedItem()){
			vAwart = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
			vAptxt = oEvent.getSource().getSelectedItem().getText();
		}
		oApplyModel.setProperty(oEvent.getSource().getBindingContext().sPath + "/Awart", vAwart);
		oApplyModel.setProperty(oEvent.getSource().getBindingContext().sPath + "/Aptxt", vAptxt);
		oController.onCheckApply(oController, oEvent.getSource().getBindingContext().sPath);
		oController.onCheckPernrList(oController, oEvent.getSource().getBindingContext().sPath);

	},
	
	onChangeBegda : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
		    oController = oView.getController(),
		    sPath = oEvent.getSource().getBindingContext().sPath,
			vBegda = oEvent.getSource().getValue(),
			vYear  = vBegda.split("-")[0],
			vMonth  = vBegda.split("-")[1],
			vDay  = vBegda.split("-")[2],
			vBegdaDate = new Date(vYear * 1, (vMonth - 1) * 1, vDay * 1),
			vOBegda = oController._ApplyTableJSonModel.getProperty(sPath +"/Ovcbeg"),
			vOyear = vOBegda.split("-")[0],
			vOMonth = vOBegda.split("-")[1],
			vODay = vOBegda.split("-")[2],
			vOBegdaDate = new Date(vOyear * 1, (vOMonth * 1) + 2, vODay * 1);
		if(vYear != vOyear ){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2724"),{	// 2724:당해년도만
																		// 수정이
																		// 가능합니다.
				onClose : function() {
					oController._ApplyTableJSonModel.setProperty(sPath + "/Vcbeg","");
					oController._ApplyTableJSonModel.setProperty(sPath + "/Vcend","");
					oController.onCheckApply(oController, sPath);
					oController.onCheckPernrList(oController, sPath);
				}
			});
		}else if(vOBegdaDate.getTime() <  vBegdaDate.getTime()){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2725"), {	// 2725:기신청
																		// 시작일자
																		// 기준으로
																		// 미래로는
																		// 최대
																		// 3개월까지
																		// 수정이
																		// 가능합니다.
				onClose : function() {
					oController._ApplyTableJSonModel.setProperty(sPath + "/Vcbeg","");
					oController._ApplyTableJSonModel.setProperty(sPath + "/Vcend","");
					oController.onCheckApply(oController, sPath);
					oController.onCheckPernrList(oController, sPath);
				}
			});
		}else{
			oController.onCheckApply(oController, sPath);
			oController.onCheckPernrList(oController, sPath);
		}
	},
	
	onChangeDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail"),
		    oController = oView.getController();
		
		oController.onCheckApply(oController, oEvent.getSource().getBindingContext().sPath);
		oController.onCheckPernrList(oController, oEvent.getSource().getBindingContext().sPath);
	},
	
	// 기 신청된 내역 유무 조회
	onCheckApply : function(oController, sPath){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = {Data : []},
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		    errData = {};
		
		if(common.Common.checkNull(sPath)) return;
		
		var vChangeData = oJSonModel.getProperty(sPath);
		
		if(!common.Common.checkNull(vChangeData.Aptyp) && !common.Common.checkNull(vChangeData.Vcbeg) && 
		   !common.Common.checkNull(vChangeData.Vcend)){
			var aFilters = [], vResData = {};
			aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "N"));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vHeader.Encid ));
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vHeader.Appno ));
			aFilters.push(new sap.ui.model.Filter('Oappno', sap.ui.model.FilterOperator.EQ, vChangeData.Oappno ));
			aFilters.push(new sap.ui.model.Filter('Oseqnr', sap.ui.model.FilterOperator.EQ, vChangeData.Oseqnr ));
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vChangeData.Aptyp ));
			aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vChangeData.Vcbeg ));
			aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vChangeData.Vcend ));
			
			oModel.read("/ChangeLeaveAppDetailSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						
						vChangeData.Useday = ( data.results[0].Useday * 1 ).toFixed(1);
						vChangeData.CredayYea = data.results[0].CredayYea;
						vChangeData.Offdut = data.results[0].Offdut;
						vChangeData.Conchk = data.results[0].Conchk;
						vChangeData.ShiftYn = data.results[0].ShiftYn;
						vChangeData.Beguz = data.results[0].Beguz;
						vChangeData.Enduz = data.results[0].Enduz;
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
					// Error 발생시 날짜 Clear
					vChangeData.Vcbeg = "";
					vChangeData.Vcend = "";
					oJSonModel.setProperty(sPath, vChangeData);
					oJSonModel.refresh();
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return;
			}
			oJSonModel.setProperty(sPath, vChangeData);
			oJSonModel.refresh();
		}
	},
	
	// 대근자 조회
	onCheckPernrList : function(oController, sPath){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		    oJSonModel = oTable.getModel(),
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		    errData = {};
		
		if(common.Common.checkNull(sPath)) return;
		
		var vChangeData = oJSonModel.getProperty(sPath),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel(),
			vTableData = oJSonModel.getData();
		
		if(vTableData.Data && vTableData.Data.length > 0){
			// 변경한 신청에 해당하는 대근자 List 삭제

			for(var i = vTableData.Data.length -1 ; i >= 0; i--){
				if(vTableData.Data[i].Oappno == vChangeData.Oappno && vTableData.Data[i].Ovcbeg ==  vChangeData.Ovcbeg ){
					vTableData.Data.splice(i, 1);
				}
			}
		}else{
			vTableData = {Data : []};
		}
		
		
		if(!common.Common.checkNull(vChangeData.Aptyp) && !common.Common.checkNull(vChangeData.Vcbeg) && 
		   !common.Common.checkNull(vChangeData.Vcend)){
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "M"));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vHeader.Encid ));
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vChangeData.Aptyp ));
			aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vChangeData.Vcbeg ));
			aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vChangeData.Vcend ));
			aFilters.push(new sap.ui.model.Filter('Oappno', sap.ui.model.FilterOperator.EQ, vChangeData.Oappno ));
			
			oModel.read("/ChangeLeaveAppSspnrSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						for(var i=0; i <data.results.length; i++){
							data.results[i].Oappno = vChangeData.Oappno;
							data.results[i].Ovcbeg = vChangeData.Ovcbeg;
							data.results[i].ZappStatAl = vHeader.ZappStatAl;
							vTableData.Data.push(data.results[i]);
						}
						
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return;
			}
			oTable.setVisibleRowCount(vTableData.Data.length);
			
			vTableData.Data.sort(function(a, b) { return a.Datum - b.Datum });
			
			oJSonModel.setData(vTableData);
			oJSonModel.refresh();
		}
	},
	
	onDeleteHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail");
		var oController = oView.getController();
		var oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		oApplyModel = oApplyTable.getModel(),
		vApplyData = oApplyModel.getData(),
		vIDXs = [];
		
	
		if(!vApplyData || !vApplyData.Data){
			return;
		} 
	
		for(var i =0; i < vApplyData.Data.length ; i++){
			if(vApplyData.Data[i].Check == true) vIDXs.push(i);
			
		}
	
		if(vIDXs.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2504"));	// 2504:삭제할
																		// 신청건을
																		// 선택하여
																		// 주십시오.
			return;
		}
		
		var oPernrTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		oPernrModel = oPernrTable.getModel(),
		vPernrData = oPernrModel.getData(),
		vDelyn = "";
		
		// 휴가자/ 대근자 정보 삭제
		if(vPernrData.Data && vPernrData.Data.length) {
			for(var i = vPernrData.Data.length - 1 ; i >= 0; i--){
				for(var j = 0; j < vIDXs.length; j++ ){
					if(vPernrData.Data[i].Oappno == vApplyData.Data[vIDXs[j]].Oappno && vPernrData.Data[i].Ovcbeg ==  vApplyData.Data[vIDXs[j]].Ovcbeg){
						vPernrData.Data.splice(i, 1);
						break;
					}
				}
			}
		}else{
			vPernrData = { Data : []};
		}
		
		oPernrTable.setVisibleRowCount(vPernrData.Data.length);
		vPernrData.Data = common.Common.reIndexODataArray(vPernrData.Data);
		oPernrModel.setData(vPernrData);
		
		// 신청내역 삭제
		for(var i = vIDXs.length; i>0; i--){
			vApplyData.Data.splice(vIDXs[i-1], 1);
		}
		
		oApplyTable.setVisibleRowCount(vApplyData.Data.length);
		vApplyData.Data = common.Common.reIndexODataArray(vApplyData.Data);
		oApplyModel.setData(vApplyData);
		sap.ui.getCore().byId(oController.PAGEID + "_checkAll").setSelected(false);
	},
	
	onHistoryExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are
								// using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_2362") + "-" + dateFormat.format(curDate) + ".xlsx"	// 2362:휴가
																											// 신청서
																											// 내역조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}
});
