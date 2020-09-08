jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail
	 */

	PAGEID : "ZUI5_HR_PregnancyRegistrationDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_ErrorTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vPITButtonCYn : "",
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "HR32",
	_ObjList : [],
	_vOrgeh : "",
	_vOrgtx : "",
	_useCustomPernrSelection : "",
	_selectionRowIdx : null,
	BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function() {

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		
		var vAppno ="" , vZappStatAl = "", vRegno = "";
		oController._vAppno = "";
		
		oController._ApprovalLineModel.setData(null);
		
		common.ApprovalLineAction.oController = oController;
		common.MandateAction.oController = oController;
		
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		// 전자 증빙 버튼 클릭 여부
		oController._vPITButtonCYn = "";
		
		var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_REGI_SRV");
		var oDetailData = {Data : {}};
		var vZappStatAl = "";
		var errData = {};
		
		if(vAppno != "") { // 수정 및 조회
			oController.BusyDialog.open();
			
			oModel.read("/PregnantRegiRequestApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
				],
				success : function(data, res) {
					oDetailData.Data = data.results[0];
					oDetailData.Data.Zdate = dateFormat.format(oDetailData.Data.Zdate);
					oDetailData.Data.Zhear = oDetailData.Data.Zhear || false;
					oController._DetailJSonModel.setData(oDetailData);
					
					oController._TargetJSonModel.setData({Data : {Pernr : oDetailData.Data.Pernr}});
					vZappStatAl = oDetailData.Data.ZappStatAl;
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
		
		/****************************************************/
		/*********** 공통적용사항 Start 			 ************/
		/****************************************************/
		// 상세화면 Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = vZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", vZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", vZappStatAl);
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		// 결재내역 
		common.ApprovalInformation.onSetApprovalInformation(oController);
		/****************************************************/
		/*********** 공통적용사항 End	 			 ************/
		/****************************************************/
		
		// 신규 결재번호 채번
		if(vAppno == "") {
			oController.BusyDialog.open();
			
			oModel.read("/PregnantRegiRequestApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I')
				],
				success : function(data, res) {
					oController._vAppno = data.results[0].Appno ;
					oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
					
					oController.BusyDialog.close();
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
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl) {
			oPortalTitle.setText(oBundleText.getText("LABEL_0146") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 146:임신직원 등록 신청	
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText(oBundleText.getText("LABEL_0146") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 146:임신직원 등록 신청	
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_0146") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 146:임신직원 등록 신청	
		}

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix");
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
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
							}).addStyleClass("Font14px FontColor6")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail"),
			oController = oView.getController();
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		oController._DetailJSonModel.setProperty("/Data/Zdate", "");   // 사용일
		oController._DetailJSonModel.setProperty("/Data/Zhear", false);   // 건강관리 서비스 신청
		oController._DetailJSonModel.setProperty("/Data/Zbigo", "");   // 비고
	},	
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 결재라인 초기화
		oController._ApprovalLineModel.setData({Data : []});
	},
	
	// 임시저장
	onPressSaveT : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail"),
			oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var errData = {};
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 근무편제변경 저장
			var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_REGI_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "PregnantRegiRequestAppl", oneData);
			createData.Zdate = "\/Date("+ common.Common.getTime(createData.Zdate)+")\/";
			createData.Zhear = createData.Zhear || false;
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			console.log(createData);
			
			oModel.create("/PregnantRegiRequestApplSet", createData, {
				success : function(data, res) {
					if(data) {
					} 
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E') {
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}

			oController.BusyDialog.close();

			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});
		};
		
		var CreateProcess = function(fVal) {
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
		
		if(!oneData.Zdate){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0151"), {title : oBundleText.getText("LABEL_0053")});	// 151:출산예정일을 선택하여 주십시오.
			return false;
		}
		
		if(vPrcty == "C"){
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
			
			// 전자증빙 확인
			if(!oneData.Docyn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0284"));	// 284:증빙자료를 첨부하세요.
				return "";
			}
		}
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail"),
			oController = oView.getController(),
			errData = {};
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_REGI_SRV");
				
				oModel.remove("/PregnantRegiRequestApplSet(Appno='" + oController._vAppno + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				
				oController.BusyDialog.close();
								
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.error(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
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