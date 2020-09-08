jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail
	 */

	PAGEID : "ZUI5_HR_FamilyCareLeaveDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel: new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM35",
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
		
		// 이력조회
		oController.searchHistory(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail");
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
		
		oModel.read("/FamilyCareLeaveDetailSet", {
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
	
	searchHistory : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable1"),
			vData = { Data : []},
			aFilters = [], errData = {},
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		
		if(!vEncid || vEncid == "") return;
		
		aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno));
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid));
		
		oModel.read("/FamilyCareLeaveLogSet", { 
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i = 0; i < data.results.length; i++){
						vData.Data.push(data.results[i]);
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
		
		oController._DetailTableJSonModel.setData(vData);
		oTable.setVisibleRowCount(vData.Data.length > 5 ? 5 : vData.Data.length);
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			errData = {};
		
		oModel.read("/FamilyCareLeaveDetailSet", {
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
		
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailJSonModel.setProperty("/Data/Appno" , oController._vAppno);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2970") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 2970:가족돌봄휴직 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2970") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 2970:가족돌봄휴직 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_2970") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 2970:가족돌봄휴직 신청
		}
	},
	
	onChangeDayDiff : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail"),
			oController = oView.getController(),
			vBegda = oController._DetailJSonModel.getProperty("/Data/Begda"),
			vEndda = oController._DetailJSonModel.getProperty("/Data/Endda"),
			vUseday = 0;
		
		if(!vBegda || !vEndda) {
			oController._DetailJSonModel.setProperty("/Data/Useday", "0");
			
			return; 
		}
		
		vBegda = moment(vBegda.split(".").join("-"));
		vEndda = moment(vEndda.split(".").join("-"));
		vUseday = vEndda.diff(vBegda, 'days');

		if(vUseday < 0) {
			oController._DetailJSonModel.setProperty("/Data/Useday", "0");
			oEvent.getSource().setValue(undefined);
			
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2985"), {title : oBundleText.getText("LABEL_0053")});	// 2985:시작일이 종료일 이후입니다.
			return false;
		} else if(vUseday < 30) {
			oController._DetailJSonModel.setProperty("/Data/Useday", "0");
			oEvent.getSource().setValue(undefined);
			
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2983"), {title : oBundleText.getText("LABEL_0053")});	// 2983:30일 이상 신청해야 합니다.
			return false;
		} else if(vUseday > 90) {
			oController._DetailJSonModel.setProperty("/Data/Useday", "0");
			oEvent.getSource().setValue(undefined);
			
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2984"), {title : oBundleText.getText("LABEL_0053")});	// 2984:신청기간을 초과했습니다.
			return false;
		} else {
			oController._DetailJSonModel.setProperty("/Data/Useday", String(vUseday));
		}
	},
	
	onlyNumber : function(oEvent) {
		var value = oEvent.getSource().getValue();
		
		if(!value) return;
		
		value = value.replace(/[^\d]/g, '');
		
		if(Number(value) > 99) value = "0";
		
		oEvent.getSource().setValue(value);
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Begda;		// 휴직기간 시작일
		delete detailData.Endda;		// 휴직기간 종료일
		delete detailData.Useday;		// 사용일수
		delete detailData.Fname;		// 돌봄대상자 성명
		delete detailData.Frela;		// 신청자와의 가족관계
		delete detailData.Typrs;		// 신청유형
		delete detailData.Num01;		// 부,모
		delete detailData.Num02;		// 배우자
		delete detailData.Num03;		// 형제,자매
		delete detailData.Num04;		// 배우자의 부모
		delete detailData.Num05;		// 자녀
		delete detailData.Reasn;		// 비고
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},	
	
	onAfterSelectPernr : function(oController) {
		oController.onResetDetail(oController);
		
		// 이력조회
		oController.searchHistory(oController);
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail"),
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
			vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "FamilyCareLeaveDetail", oneData));
			
			createData.Begda = (createData.Begda) ? "\/Date("+ common.Common.getTime(createData.Begda)+")\/" : undefined;
			createData.Endda = (createData.Endda) ? "\/Date("+ common.Common.getTime(createData.Endda)+")\/" : undefined;
			
			createData.Useday = createData.Useday == "" ? "0" : createData.Useday;
			
			createData.Prcty = vPrcty;
			
			oModel.create("/FamilyCareLeaveDetailSet", createData, {
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
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(oneData.Pernr)) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(oneData.Begda)) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1219"), {title : oBundleText.getText("LABEL_0053")});	// 1219:시작일자를 입력하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(oneData.Endda)) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1220"), {title : oBundleText.getText("LABEL_0053")});	// 1220:종료일자를 입력하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(oneData.Fname)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2980"), {title : oBundleText.getText("LABEL_0053")});	// 2980:돌봄대상자(성명)을 입력하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(oneData.Frela)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2981"), {title : oBundleText.getText("LABEL_0053")});	// 2981:신청자와의 가족관계를 선택하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(oneData.Typrs)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2982"), {title : oBundleText.getText("LABEL_0053")});	// 2982:신청유형을 선택하여 주십시오.
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_FamilyCareLeave.ZUI5_HR_FamilyCareLeaveDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
				
				oModel.remove("/FamilyCareLeaveDetailSet(Appno='" + oController._vAppno + "')", {
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
	}
});
