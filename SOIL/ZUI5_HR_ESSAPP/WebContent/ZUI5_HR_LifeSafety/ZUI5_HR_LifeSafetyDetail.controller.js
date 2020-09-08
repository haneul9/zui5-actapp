jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail
	 */

	PAGEID : "ZUI5_HR_LifeSafetyDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR23',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",
	_vZappStatAl : "",

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
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
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
		} else {
			filters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'));
			filters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			filters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno));
		}
		
		if(filters && filters.length) {
			oModel.read("/LifeStableLoanSet", {
				async: false,
				filters: filters,
				success: function(data,res) {
					if(data && data.results.length) {
						var OneData = data.results[0];							
						OneData.Loblc = (!OneData.Loblc || OneData.Loblc == "0.00") ? "0" : common.Common.numberWithCommas(OneData.Loblc);
						
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
			
			if(vError == "E"){
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
		oController._vZappStatAl = vZappStatAl;
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
			// 통화키 Default는 한화 
			oController._DetailJSonModel.setProperty("/Data/Waers", "KRW");
			oDetailTitle.setText(oBundleText.getText("LABEL_0077") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 77:생활안정자금 신청	
		}else if(vZappStatAl == "10"){
			oDetailTitle.setText(oBundleText.getText("LABEL_0077") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 77:생활안정자금 신청
		}else{
			oDetailTitle.setText(oBundleText.getText("LABEL_0077") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 77:생활안정자금 신청
		}
		
		// 세부사유 조회
		oController.onSetLorsn(oController);
		// 신청금액 조회
		oController.onSetApamt(oController);
		// 약정 월상환액 조회
		oController.onSetRpamtMon(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		
		var oRowA = sap.ui.getCore().byId(this.PAGEID + "_RowA");
		if(this._vZappStatAl == "" || this._vZappStatAl == "10") {
			$('#__row6').hide();
			oRowA.addStyleClass("DisplayNone");
		} else {
			oRowA.removeStyleClass("DisplayNone");
		}
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells: [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0090")	// 90:입사일
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Entda}",
						}).addStyleClass("Font14px FontColor6")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : ""
					}).addStyleClass("Font14px FontColor6")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Text({
						text : ""
					}).addStyleClass("Font14px FontColor6")]
				}).addStyleClass("MatrixData")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail"),
			oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		}else{
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyList",
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
	
	addZero : function(d) {
		if(d < 10) return "0" + d;
		else return "" + d;
	},
	
	removeZero : function(d) {
		return "" + d * 1;  
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail");
		var oController = oView.getController();
	},
	
	// 용도 변경 Event
	onChangeLouse : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail");
		var oController = oView.getController();
		
		// 세부사유 조회
		oController.onSetLorsn(oController);
	},
	
	// 세부사유 조회
	onSetLorsn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oLorsn = sap.ui.getCore().byId(oController.PAGEID + "_Lorsn"),
			vLouse = oController._DetailJSonModel.getProperty("/Data/Louse"),
			vLorsn = oController._DetailJSonModel.getProperty("/Data/Lorsn"),
			aFilters = [],
			veqyn = "";
		
		if(common.Common.isNull(vLouse)) return;
		
		oLorsn.destroyItems();
		
		aFilters.push(new sap.ui.model.Filter('Louse', sap.ui.model.FilterOperator.EQ, vLouse));
		
		oModel.read("/LorsnCodeSet", {
			async: false,
			filters: aFilters,
			success: function(data,res){
				if(data && data.results.length) {
					// Code 숫자 오름차순 정렬
					data.results.sort(function(a, b) {
						return Number(a.Lorsn.replace("B", "")) - Number(b.Lorsn.replace("B", ""));
					});
					
					for(var i=0; i<data.results.length; i++) {
						if(vLorsn == data.results[i].Lorsn) veqyn = "X" ;
						
						oLorsn.addItem(new sap.ui.core.Item({ key: data.results[i].Lorsn, text: data.results[i].Lorsnt }));
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		// 기존입력값과 동일한 값이 존재하지 않을 시 처리
		if(veqyn == "") oController._DetailJSonModel.setProperty("/Data/Lorsn","");
	},

	// 신청금액 조회
	onSetApamt : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oApamt = sap.ui.getCore().byId(oController.PAGEID + "_Apamt"),
			vApamt = oController._DetailJSonModel.getProperty("/Data/Apamt"),
			vSezck = oController._DetailJSonModel.getProperty("/Data/Sezck"),
			vSlgbn = oController._DetailJSonModel.getProperty("/Data/Slgbn"),
			vLoblc = oController._DetailJSonModel.getProperty("/Data/Loblc"),
			vAschk = oController._DetailJSonModel.getProperty("/Data/Aschk"),
			veqyn = "";
		
		if(common.Common.isNull(vSlgbn) || common.Common.isNull(vSezck)) return; 
		
		oApamt.destroyItems();
		
		oModel.read("/ApamtListSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Slgbn', sap.ui.model.FilterOperator.EQ, vSlgbn),
				new sap.ui.model.Filter('Sezck', sap.ui.model.FilterOperator.EQ, vSezck),
				new sap.ui.model.Filter('Aschk', sap.ui.model.FilterOperator.EQ, vAschk),
				new sap.ui.model.Filter('Loblc', sap.ui.model.FilterOperator.EQ, common.Common.removeComma(vLoblc))
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						if(vApamt == data.results[i].Apamt) veqyn = "X" ;
						
						oApamt.addItem(new sap.ui.core.Item({ key: data.results[i].Apamt, text: common.Common.numberWithCommas(data.results[i].Apamt) }));
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		// 기존입력값과 동일한 값이 존재하지 않을 시 처리
		if(veqyn == "") oController._DetailJSonModel.setProperty("/Data/Apamt","");
	},

	// 약정 월상환액 조회
	onSetRpamtMon : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oRpamtMon = sap.ui.getCore().byId(oController.PAGEID + "_RpamtMon"),
			vRpamtMon = oController._DetailJSonModel.getProperty("/Data/RpamtMon"),
			vSezck = oController._DetailJSonModel.getProperty("/Data/Sezck"),
			veqyn = "";
		
		oRpamtMon.destroyItems();
		
		if(vSezck == 'X') {
			var optValue = 100000;
			if(vRpamtMon == optValue) veqyn = "X";
			oRpamtMon.addItem(new sap.ui.core.Item({ key: optValue, text: common.Common.numberWithCommas(optValue) }));
		} else {
			var optArrays = [200000, 300000, 400000];
			for(var i=0; i<optArrays.length; i++) {
				if(vRpamtMon == optArrays[i]) veqyn = "X";
				
				oRpamtMon.addItem(new sap.ui.core.Item({ key: optArrays[i], text: common.Common.numberWithCommas(optArrays[i]) }));
			}
		}
		
		// 기존입력값과 동일한 값이 존재하지 않을 시 처리
		if(veqyn == "") oController._DetailJSonModel.setProperty("/Data/RpamtMon","");
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "" , vErrorMessage = "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		vOData.Prcty = vPrcty ; 
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
				
				oModel.create("/LifeStableLoanSet", vOData, {
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
	
	onValidationData : function(oController, vPrtcy){
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		
		var oLouse = sap.ui.getCore().byId(oController.PAGEID + "_Louse"); 
		var oLorsn = sap.ui.getCore().byId(oController.PAGEID + "_Lorsn");  
		var oApamt = sap.ui.getCore().byId(oController.PAGEID + "_Apamt");
		var oRpamtMon = sap.ui.getCore().byId(oController.PAGEID + "_RpamtMon");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Louse) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0088"));	// 88:용도가 선택되지 않았습니다.
//			oLouse.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(!vData.Lorsn) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0079"));	// 79:세부사유가 선택되지 않았습니다.
//			oLorsn.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(!vData.Apamt) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0082"));	// 82:신청금액이 선택되지 않았습니다.
//			oApamt.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(!vData.RpamtMon) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0086"));	// 86:약정 월상환액이 선택되지 않았습니다.
//			oRpamtMon.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		
		if(vPrtcy == "C") {
			if(vData.Louse != "B1") {
				var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
				var vFileData = oAttachFileList.getModel().getProperty("/Data");
				if(!vFileData || vFileData.length < 1) {
					sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
					return false;
				}
			}
		}
		
		try {
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"), "LifeStableLoan", vData);
			rData.Loblc = common.Common.removeComma(rData.Loblc);
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
				
				oModel.remove("/LifeStableLoanSet(Appno='" + vDetailData.Appno + "')", {
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
		
		oModel.read("/LifeStableLoanSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'N'),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
			],
			success: function(data,res) {
				if(data && data.results.length) {
					var OneData = data.results[0];							
					OneData.Loblc = (!OneData.Loblc || OneData.Loblc == "0.00") ? "0" : common.Common.numberWithCommas(OneData.Loblc);
					
					oDetailData.Data = OneData;
					oDetailData.Data.Auth = _gAuth;
					oDetailData.Data.ZappStatAl = OneData.ZappStatAl;
					
					oController._DetailJSonModel.setData(oDetailData);
					
					// 신청금액 조회
					oController.onSetApamt(oController);
					// 약정 월상환액 조회
					oController.onSetRpamtMon(oController);
				}
			},
			error: function(Res) {
				var errData = common.Common.parseError(Res);
				vError = errData.Error;
				vErrorMessage = errData.ErrorMessage;
			}
		});
	
		if(vError == "E"){
			sap.m.MessageBox.show(vErrorMessage, {});
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyList",
			      data : { Appno : "" }
			});
		}
	},
	
	openDocno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});