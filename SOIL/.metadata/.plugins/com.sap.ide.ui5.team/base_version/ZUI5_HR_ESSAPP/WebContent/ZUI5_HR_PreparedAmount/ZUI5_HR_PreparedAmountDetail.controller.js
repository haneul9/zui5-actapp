jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail
	 */

	PAGEID : "ZUI5_HR_PreparedAmountDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	// TODO: _vZworktyp 변경
	_vZworktyp : 'HR29',
	_vEnamefg : "",
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
			oModel = sap.ui.getCore().getModel("ZHR_BEF_MOVING_SRV"),
			oDetailData = {Data : {}};

		oController.BusyDialog.open();
		
		var vErrorMessage = "", vError = "",
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});				
		
		var oDetailData = {Data : {}};
		if(oController._vAppno != ""){ // 수정 및 조회
			oController.BusyDialog.open();
			var oModel = sap.ui.getCore().getModel("ZHR_BEF_MOVING_SRV");
			var vErrorMessage = "", vError = "";
			
			var oPath = "/BefMovingRequestApplSet?$filter=Appno eq '" + oController._vAppno + "' and Prcty eq 'D'";
			oModel.read(oPath, null, null, false,
					function(data, res){
						
						if(data.results[0].Reqamt * 1 == 0){
							data.results[0].Reqamt = "";
						}else{
							data.results[0].Reqamt = common.Common.numberWithCommas(data.results[0].Reqamt);
						}
						
						if(data.results[0].Aplamt * 1 == 0){
							data.results[0].Aplamt = "";
						}else{
							data.results[0].Aplamt = common.Common.numberWithCommas(data.results[0].Aplamt);
						}
						
						data.results[0].Payym = data.results[0].Payym == "000000" ? "" :  data.results[0].Payym.substring(0,4) + "." + data.results[0].Payym.substring(4,6) ; 
						// 상태
						vZappStatAl = data.results[0].ZappStatAl;
						data.results[0].Movdt =  dateFormat.format(new Date(common.Common.setTime(data.results[0].Movdt)));
						oDetailData.Data = data.results[0];	

					}, function(Res){
						vError = "E";
						if(Res.response.body){
							vErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(vErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
					}
			);
			
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
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		/****************************************************/
		/*********** 공통적용사항 End	 			 ************/
		/****************************************************/
		
		// 결재 상태에 따라 Page Header Text 수정		
		if( vZappStatAl == "" ) {
			oDetailTitle.setText(oBundleText.getText("LABEL_1372") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1372:부임/귀임 준비금 신청
			// 국내로 고정
			oController._DetailJSonModel.setProperty("/Data/Ovrseayn", "1");
			// 통화키 Default는 한화 
			oController._DetailJSonModel.setProperty("/Data/Waers", "KRW");
			
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_1372") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1372:부임/귀임 준비금 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_1372") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1372:부임/귀임 준비금 신청
		}
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail"),
			oController = oView.getController();

		if(oController._vFromPage != "") {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountList",
			      data : {}
			});	
		}
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
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail");
		var oController = oView.getController();
	},
	
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "" , vErrorMessage = "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_BEF_MOVING_SRV");
				
				oModel.create("/BefMovingRequestApplSet", vOData, {
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
				
				common.AttachFileAction.uploadFile(oController);
				
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
	
	onValidationData : function(oController, vPrcty){
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Movdt) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1375"));	// 1375:발령일이 선택되지 않았습니다.
			return "";
		}
		if(!vData.Ovrseayn) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1376"));	// 1376:국내외 구분이 선택되지 않았습니다.
			return "";
		}
		if(!vData.Comyn) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1377"));	// 1377:사택지원여부가 선택되지 않았습니다.
			return "";
		}
		if(!vData.Zzwork1) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1378"));	// 1378:발령전 부서가 선택되지 않았습니다.
			return "";
		}
		if(!vData.Zzwork2) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1379"));	// 1379:발령후 부서가 선택되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			var vFileData = oAttachFileList.getModel().getProperty("/Data");
			if(!vFileData || vFileData.length < 1){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
				return false;
			}
		}
		
		try {
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_BEF_MOVING_SRV"), "BefMovingRequestAppl", vData);
			rData.Reqamt = common.Common.removeComma(rData.Reqamt);
			rData.Aplamt = common.Common.removeComma(rData.Aplamt);
			console.log(rData.Movdt);
			rData.Movdt = "\/Date("+ common.Common.getTime(rData.Movdt)+")\/"; 
			rData.Prcty = vPrcty;
			rData.Payym = rData.Payym == undefined ? "" :  rData.Payym.replace(".", "");

		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_BEF_MOVING_SRV");
				
				oModel.remove("/BefMovingRequestApplSet(Appno='" + vDetailData.Appno + "')", {
					success: function(data,res) {
					},
					error: function(Res) {
						if(Res.response.body){
							var ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							vError = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
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
		// 신청금액 조회
		oController.onSearchReqamt();
		// 발령전/후 조회
		oController.onSearchFromTo();
	},
	
	onChangeMovdt : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail");
		var oController = oView.getController();
		// 신청금액 조회
		oController.onSearchReqamt();
		// 발령전/후 조회
		oController.onSearchFromTo();
	},
	
	onSearchFromTo : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHR_BEF_MOVING_SRV");
		var vMovdt = oController._DetailJSonModel.getProperty("/Data/Movdt");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vZzwork1 = "", vZzwork1T = "", vOrgeh1 = "", vZzwork2 = "", vOrgtx1 ="", vZzwork2T = "", vOrgeh2 = "", vOrgtx2 = "" ;
		
		if(common.Common.checkNull(vMovdt)|| common.Common.checkNull(vEncid)) return ;
		
		var dataProcess = function(){
		  var oFilters = [];
		  var vErrorMessage = "", vError = "";
			oFilters.push(new sap.ui.model.Filter('Movdt', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Movdt")));
			oFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")));
			
			oModel.read("/BefMovingOrgFromToSet", {
				async: false,
				filters: oFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						vZzwork1 = data.results[0].Zzwork1 ;
						vZzwork1T = data.results[0].Zzwork1T ;
						vOrgeh1 = data.results[0].Orgeh1 ;
						vOrgtx1 = data.results[0].Orgtx1 ;
						vZzwork2 = data.results[0].Zzwork2 ;
						vZzwork2T = data.results[0].Zzwork2T ;
						vOrgeh2 = data.results[0].Orgeh2 ;
						vOrgtx2 = data.results[0].Orgtx2 ;
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					vError = errData.Error;
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			oController._DetailJSonModel.setProperty("/Data/Zzwork1", vZzwork1);
			oController._DetailJSonModel.setProperty("/Data/Zzwork1T", vZzwork1T );
			oController._DetailJSonModel.setProperty("/Data/Orgeh1", vOrgeh1);
			oController._DetailJSonModel.setProperty("/Data/Orgtx1", vOrgtx1);
			oController._DetailJSonModel.setProperty("/Data/Zzwork2", vZzwork2);
			oController._DetailJSonModel.setProperty("/Data/Zzwork2T", vZzwork2T );
			oController._DetailJSonModel.setProperty("/Data/Orgeh2", vOrgeh2);
			oController._DetailJSonModel.setProperty("/Data/Orgtx2", vOrgtx2);
			
			if(vError == "E") {
				sap.m.MessageBox.alert(vErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
					}
				});
				return ;
			}
			oController.BusyDialog.close();
		};
		
		oController.BusyDialog.open();
		setTimeout(dataProcess, 300);
		
	},
	
	// 신청금액 조회 및 Binding
	onSearchReqamt : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail");
		var oController = oView.getController();
		var oData = oController._DetailJSonModel.getProperty("/Data");
		var vReqamt = "", vWaers = "KRW";
		// 지원 금액
		if(!common.Common.checkNull(oData.Comyn) && !common.Common.checkNull(oData.Movdt) && !common.Common.checkNull(oData.Encid)){
			var oModel = sap.ui.getCore().getModel("ZHR_BEF_MOVING_SRV");
		
			var oFilters = [];
			var vErrorMessage = "", vError = "";
			oFilters.push(new sap.ui.model.Filter("Comyn", sap.ui.model.FilterOperator.EQ, oData.Comyn));
			oFilters.push(new sap.ui.model.Filter('Movdt', sap.ui.model.FilterOperator.EQ, common.Common.getTime(oData.Movdt)));
			oFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oData.Encid));
			
			oModel.read("/BefMovingReqamtSet", {
				async: false,
				filters: oFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						vReqamt = data.results[0].Reqamt ;
						vWaers = data.results[0].Waers ;
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
					}
				});
				return ;
			}
			
			oController.BusyDialog.close();
		};
		
		oController._DetailJSonModel.setProperty("/Data/Reqamt", common.Common.numberWithCommas(vReqamt));
		oController._DetailJSonModel.setProperty("/Data/Waers", vWaers);
	},
});