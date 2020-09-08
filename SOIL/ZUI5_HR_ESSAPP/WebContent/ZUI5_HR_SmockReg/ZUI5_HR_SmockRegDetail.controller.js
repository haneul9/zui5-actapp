jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_SmockReg.ZUI5_HR_SmockRegDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_SmockReg.ZUI5_HR_SmockRegDetail
	 */

	PAGEID : "ZUI5_HR_SmockRegDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vApdoc : "",
	_vSgubn : "",
	_vEnamefg : "",
	_vZworktyp : "BE13",
	_ObjList : [],
	BusyDialog : new sap.m.BusyDialog(),
	
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
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			oDetailData = {Data : {}},
			vFromPageId = "",
			vApdoc = "",
			vSgubn = "";
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			if(oEvent.data.FromPage && oEvent.data.FromPage != "") {
				vFromPageId = oEvent.data.FromPage;
				vApdoc = oEvent.data.Apdoc;
				vSgubn = oEvent.data.Sgubn;
			}
		}
		oController._vFromPage = vFromPageId;
		oController._vApdoc = vApdoc;
		oController._vSgubn = vSgubn;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "A");
		}
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 상세조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.FromPage = vFromPageId;
		oController._DetailJSonModel.setData(oDetailData);
		
		// Build combobox
		oController.buildCombo(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SmockReg.ZUI5_HR_SmockRegDetail"),
			oController = oView.getController();
	},
	
	commonAction : function(oController, oDetailData) {
		// 초기화
		oController._DetailJSonModel.setData(oDetailData);
		
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		
		// HASS용 변수지정
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", "");
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
	},
	
	buildCombo : function(oController) {
		// 하계(호수)
		oController.onSetSuitsm(oController);

		// 동계(호수)
		oController.onSetSuitwr(oController);
	},
	
	onSetSuitwr : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV"),
			oSuitwr = sap.ui.getCore().byId(oController.PAGEID + "_Suitwr");
		
		if(oSuitwr.getItems()) oSuitwr.destroyItems();
		
		oModel.read("/SuitWrCodeSet", {
			async : false,
			success : function(data, res) {
				if(data && data.results.length) {
					// Code 숫자 오름차순 정렬
					data.results.sort(function(a, b) {
						return Number(a.Code) - Number(b.Code);
					});
					
					data.results.forEach(function(elem) {
						oSuitwr.addItem(new sap.ui.core.Item({
							key : elem.Code,
							text : elem.Text
						}));
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
	},

	onSetSuitsm : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV"),
			oSuitsm = sap.ui.getCore().byId(oController.PAGEID + "_Suitsm");
		
		if(oSuitsm.getItems()) oSuitsm.destroyItems();
		
		oModel.read("/SuitSmCodeSet", {
			async : false,
			success : function(data, res) {
				if(data && data.results.length) {
					// Code 숫자 오름차순 정렬
					data.results.sort(function(a, b) {
						return Number(a.Code) - Number(b.Code);
					});
					
					data.results.forEach(function(elem) {
						oSuitsm.addItem(new sap.ui.core.Item({
							key : elem.Code,
							text : elem.Text
						}));
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
	},
	
	retrieveDetail : function(oController, oDetailData) {
		var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			errData = {};

		if(!vEncid) return;
		
		oModel.read("/BsuitSizeRegistSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.Encid = vEncid;
				oDetailData.Data.Height = (!oDetailData.Data.Height || oDetailData.Data.Height == "0.00") ? undefined : oDetailData.Data.Height;
				oDetailData.Data.Weight = (!oDetailData.Data.Weight || oDetailData.Data.Weight == "0.00") ? undefined : oDetailData.Data.Weight;
				oDetailData.Data.Shldr = (!oDetailData.Data.Shldr || oDetailData.Data.Shldr == "0") ? undefined : oDetailData.Data.Shldr;
				oDetailData.Data.Arm = (!oDetailData.Data.Arm || oDetailData.Data.Arm == "0") ? undefined : oDetailData.Data.Arm;
				oDetailData.Data.Backl = (!oDetailData.Data.Backl || oDetailData.Data.Backl == "0") ? undefined : oDetailData.Data.Backl;
				oDetailData.Data.Bust = (!oDetailData.Data.Bust || oDetailData.Data.Bust == "0") ? undefined : oDetailData.Data.Bust;
				oDetailData.Data.Waist = (!oDetailData.Data.Waist || oDetailData.Data.Waist == "0") ? undefined : oDetailData.Data.Waist;
				oDetailData.Data.Hip = (!oDetailData.Data.Hip || oDetailData.Data.Hip == "0") ? undefined : oDetailData.Data.Hip;
				oDetailData.Data.Cline = (!oDetailData.Data.Cline || oDetailData.Data.Cline == "0") ? undefined : oDetailData.Data.Cline;
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E") {
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}
	},
	
//	limit3NumberLength : function(oEvent) {
//		var value = oEvent.getSource().getValue();
//		
//		value = value.replace(/[^\d]/g, '');
//		
//		oEvent.getSource().setValue(value);
//		if(Number(value) > 999) oEvent.getSource().setValue(value.substr(0, 3));
//	},
	limit3NumberLength : function(oEvent) {
		var value = oEvent.getSource().getValue();
		
		if(!isNaN(value)) {
			value = Number(value);
			value = value > 999 ? 0 : value;
			oEvent.getSource().setValue(parseFloat(value).toFixed(1));
		} else {
			oEvent.getSource().setValue();
		}
	},
	
	limitForWHeight : function(oEvent) {
		var value = oEvent.getSource().getValue();
		
		value = value.replace(/[^\.0-9]/g, '');
		
		oEvent.getSource().setValue(value);
		if(Number(value) > 999) oEvent.getSource().setValue(value.substr(0, 3));
	},

	onAfterSelectPernr : function(oController) {
		var oDetailData = {Data : {}};
		
		// 상세조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Binding
		oDetailData.Data.Auth = _gAuth;
		oController._DetailJSonModel.setData(oDetailData);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_SmockReg.ZUI5_HR_SmockRegDetail"),
			oController = oView.getController();
	
		if(oController._vFromPage) {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
				id : oController._vFromPage || "ZUI5_HR_Smock.ZUI5_HR_SmockList",
				data : {
					Apdoc : oController._vApdoc,
					Sgubn : oController._vSgubn
				}
			});
		}
	},
	
	// 저장
	onPressSave : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SmockReg.ZUI5_HR_SmockRegDetail"),
			oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function() {
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {},
				errData = {};
			
			createData = common.Common.copyByMetadata(oModel, "BsuitSizeRegist", oneData);
			
			createData.Height = (createData.Height) ? Number(createData.Height).toFixed(2) : createData.Height;
			createData.Weight = (createData.Weight) ? Number(createData.Weight).toFixed(2) : createData.Weight;
			
			oModel.create("/BsuitSizeRegistSet", createData, {
				success : function(data, res) {
					if(data) {
					} 
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E") {
				if(errData.ErrorMessage.indexOf('Property') > -1) {
					errData.ErrorMessage = common.Common.convertSAPPropertyErrorMessage(oModel, 'BsuitSizeRegist', errData.ErrorMessage);
				}
				
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			} else {
				oController._DetailJSonModel.setProperty("/Data/Height", createData.Height);
				oController._DetailJSonModel.setProperty("/Data/Weight", createData.Weight);
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
		
		var vInfoTxt = oBundleText.getText("LABEL_0061"), 	// 61:저장하시겠습니까?
		vCompTxt = oBundleText.getText("LABEL_0060");	// 60:저장이 완료되었습니다.
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){		
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		
		if(!vPernr){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
	}
	
});