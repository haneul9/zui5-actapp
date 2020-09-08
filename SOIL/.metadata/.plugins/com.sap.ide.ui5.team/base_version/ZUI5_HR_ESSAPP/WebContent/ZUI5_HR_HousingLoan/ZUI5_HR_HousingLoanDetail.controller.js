jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail
	 */

	PAGEID : "ZUI5_HR_HousingLoanDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR25',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",

	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
	onInit : function() {
		this.getView().addStyleClass("sapUiSizeCompact");

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this),
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vFromPageId = "";
		
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		var vZappStatAl = "" , vRegno = "",
			oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle"),
			oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oDetailData = {Data : {}};

		oController.BusyDialog.open();
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			vEncid = vEmpLoginInfo[0].Encid,
			vErrorMessage = "", vError = "",
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});				
		
		var filters = [];
		if(_gAuth == 'E' && oController._vAppno == "") {
			filters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'N'));
			filters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			filters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid));
		} else if(oController._vAppno && oController._vAppno != "") {
			filters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'));
			filters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			filters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno));
		}
		
		if(filters && filters.length) {
			oModel.read("/HousingFundLoanSet", {
				async: false,
				filters: filters,
				success: function(data,res) {
					if(data && data.results.length) {
						var OneData = data.results[0];							
						OneData.Apamt = (OneData.Apamt == '0') ? "" : common.Common.numberWithCommas(OneData.Apamt);
						OneData.Lnhym = (OneData.Lnhym == '000000') ? "" : OneData.Lnhym;
						OneData.Lnrte = (OneData.Lnrte == '0.00') ? "0" : OneData.Lnrte;
						
						vZappStatAl = OneData.ZappStatAl ;
						oDetailData.Data = OneData;
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					vError = errData.Error;
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vError == "E") {
				sap.m.MessageBox.alert(vErrorMessage, {
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
		
		// 결재 상태에 따라 Page Header Text 수정		
		if( vZappStatAl == "" ) {
			// 통화키 Default는 한화 
			oController._DetailJSonModel.setProperty("/Data/Waers", "KRW");
			oDetailTitle.setText(oBundleText.getText("LABEL_0103") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 103:주택자금 신청	
		}else if(vZappStatAl == "10"){
			oDetailTitle.setText(oBundleText.getText("LABEL_0103") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 103:주택자금 신청
		}else{
			oDetailTitle.setText(oBundleText.getText("LABEL_0103") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 103:주택자금 신청
		}
		
		oController.buildCombo(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail"),
			oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		}else{
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanList",
			      data : {}
			});	
		}
	},
	
	buildCombo : function(oController) {
		oController.onSetLouse(oController);
		
		// 융자희망월
		oController.onSetLnhym(oController);
	},
	
	onSetLouse : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oLouse = sap.ui.getCore().byId(oController.PAGEID + "_Louse"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		
		if(!vPernr) return;
		
		if(oLouse.getItems()) oLouse.destroyItems();
		
		oModel.read("/HousingLouseCodeSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oLouse.addItem(new sap.ui.core.Item({
							key : elem.Comcd,
							text : elem.Comcdt
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

	onSetLnhym : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oLnhym = sap.ui.getCore().byId(oController.PAGEID + "_Lnhym"),
			vZreqDate = oController._DetailJSonModel.getProperty("/Data/ZreqDate"),
			aFilters = [];
		
		if(oLnhym.getItems()) oLnhym.destroyItems();
		
		if(vZreqDate) {
			aFilters.push(new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(vZreqDate)));
		}
		
		oModel.read("/LnhymListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oLnhym.addItem(new sap.ui.core.Item({
							key : elem.Lnhym,
							text : elem.Lnhymt
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

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"), {	// 55:유효하지 않은 날짜형식입니다.
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	addZero : function(d) {
		if(d < 10) return "0" + d;
		else return "" + d;
	},
	
	removeZero : function(d) {
		return "" + d * 1;  
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail");
		var oController = oView.getController();
	},
	
	onChangeLouse : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail");
		var oController = oView.getController();
		
		oController._DetailJSonModel.setProperty("/Data/Louset", oEvent.getSource().getSelectedItem().getText());
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 신청금액 한도체크
	onCheckLimitApamt : function(oController, vOData) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
		var errData = {};
		var pOdata = {};
		pOdata.Pernr = vOData.Pernr;
		pOdata.Apamt = vOData.Apamt;
		pOdata.Waers = vOData.Waers;
		
		oModel.create("/HousingLoanLimitSet", pOdata, {
			success : function(data, res) {
				// pass
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		return errData;
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "" , vErrorMessage = "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		vOData.Waers = "KRW";
		
		// 신청금액 한도체크
		var limitReturnData = oController.onCheckLimitApamt(oController, vOData);
		if(limitReturnData.Error && limitReturnData.Error == 'E') {
			new control.ZNK_SapBusy.oErrorMessage(limitReturnData.ErrorMessage);
			return;
		}
		
		var onProcess = function(){
			var vDetailData = oController._DetailJSonModel.getProperty("/Data");
			var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
			
			oModel.create("/HousingFundLoanSet", vOData, {
				success: function(data,res) {
					if(data) {
						oController._vAppno = data.Appno;
						oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
						oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
						vZappStatAl = data.ZappStatAl;
					} 
				},
				error: function (oError) {
			    	var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
						else vErrorMessage = Err.error.message.value;
					} else {
						vErrorMessage = oError.toString();
					}
				}
			});
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
				return ;
			}
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});

		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
//				control.ZNKBusyAccessor.onBusy("S",oController);
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		} else {
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},	
	
	onValidationData : function(oController, vPrtcy){
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		vData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Louse) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0088"));	// 88:용도가 선택되지 않았습니다.
			return "";
		}
		if(!vData.Apamt) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0082"));	// 82:신청금액이 선택되지 않았습니다.
			return "";
		}
		if(!vData.Lnhym) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0100"));	// 100:융자희망월이 선택되지 않았습니다.
			return "";
		}
		
		try {
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"), "HousingFundLoan", vData);
			rData.Apamt = common.Common.removeComma(rData.Apamt);
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
				
				oModel.remove("/HousingFundLoanSet(Appno='" + vDetailData.Appno + "')", {
					success: function(data,res) {
					},
					error: function(Res) {
						if(Res.response.body){
							var ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							vError = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}else{
								vErrorMessage =ErrorMessage ;
							}
						}
					}
				});
				oController.BusyDialog.close();
				
				if(vError == "E") {
					sap.m.MessageBox.show(vErrorMessage, {});
					return;
				} 
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					actions: [
						sap.m.MessageBox.Action.CLOSE
					],
			        onClose: oController.onBack
				});
				
		};
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
//				control.ZNKBusyAccessor.onBusy("S",oController);
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
	
	onAfterSelectPernr : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oDetailData = {Data : {}},
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vError = "", vErrorMessage = "";
		
		if(!vEncid || vEncid == '00000000') {
			return false;
		}
		
		oController.onSetLouse(oController);
		
		oModel.read("/HousingFundLoanSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'N'),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
			],
			success: function(data,res) {
				if(data && data.results.length) {
					var OneData = data.results[0];
					OneData.Apamt = (OneData.Apamt == '0') ? "" : common.Common.numberWithCommas(OneData.Apamt);
					OneData.Lnhym = (OneData.Lnhym == '000000') ? "" : OneData.Lnhym;
					OneData.Lnrte = (OneData.Lnrte == '0.00') ? "0" : OneData.Lnrte;
					
					oDetailData.Data = OneData;
					oDetailData.Data.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
					oDetailData.Data.Encid = oController._DetailJSonModel.getProperty("/Data/Encid");
					oDetailData.Data.Auth = _gAuth;
					oDetailData.Data.ZappStatAl = OneData.ZappStatAl;
					
					oController._DetailJSonModel.setData(oDetailData);
				}
			},
			error: function(Res) {
				var errData = common.Common.parseError(Res);
				vError = errData.Error;
				vErrorMessage = errData.ErrorMessage;
			}
		});
	
		if(vError == "E") {
			sap.m.MessageBox.show(vErrorMessage, {});
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanList",
			      data : { Appno : "" }
			});
		}
	},
	
	openDocno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});