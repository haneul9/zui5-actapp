jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_Smock.ZUI5_HR_SmockDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Smock.ZUI5_HR_SmockDetail
	 */

	PAGEID : "ZUI5_HR_SmockDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_SizeJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'BE13',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",
	_vApdoc : "",
	_vSgubn : "",
	
	_isPossibleApply : false,

	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
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
			vFromPageId = "",
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			oDetailData = {Data : {}},
			oSizeData = {Data : {}};
		
		oController.BusyDialog.open();
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vApdoc = oEvent.data.Apdoc || '';
			oController._vAppno = oEvent.data.Appno || '';
			if(oController._vApdoc == "" && oController._vAppno != "") {
				oController._vApdoc = oController._vAppno;
			} else {
				oController._vAppno = oController._vApdoc;
			}
			
			oController._vSgubn = oEvent.data.Sgubn || '10';
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage;
			if(oEvent.data.Sgubn && oEvent.data.Sgubn != "") oController._vSgubn = oEvent.data.Sgubn;
			if(oEvent.data.Apdoc && oEvent.data.Apdoc != "") {
				oController._vApdoc = oEvent.data.Apdoc;
				oController._vAppno = oEvent.data.Apdoc;
			}
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Apdoc = oDetailData.Data.Apdoc || oController._vApdoc;
		oDetailData.Data.Appno = oDetailData.Data.Apdoc || oController._vAppno;
		oDetailData.Data.Sgubn = oDetailData.Data.Sgubn || oController._vSgubn;
		oDetailData.Data.Sstat = oDetailData.Data.Sstat || '';
		oDetailData.Data.Apdat = oDetailData.Data.Apdat || dateFormat.format(new Date());
		
		switch(oDetailData.Data.Sstat) {
			case '1' : 
				_isPossibleApply = true;
				oDetailData.Data.ZappStatAl = '10';		// 작성중
				break;
			case '2' : 
				oDetailData.Data.ZappStatAl = '20';		// 신청중
				break;
			case '3' :
				oDetailData.Data.ZappStatAl = '40';		// 확인
				break;
			default : 
				oDetailData.Data.ZappStatAl = '';
				break;
		};
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 사이즈정보 조회
		oController.retrieveSize(oController, oSizeData);
		
		// 사이즈정보 Binding
		oController._SizeJSonModel.setData(oSizeData);
		if(!oController._vApdoc) {
			oController._DetailJSonModel.setProperty("/Data/SuitwrW", oSizeData.Data.Waist);
			oController._DetailJSonModel.setProperty("/Data/SuitwrH", oSizeData.Data.Hip);
			oController._DetailJSonModel.setProperty("/Data/SuitwrL", oSizeData.Data.Cline);
			oController._DetailJSonModel.setProperty("/Data/SuitsmW", oSizeData.Data.Waist);
			oController._DetailJSonModel.setProperty("/Data/SuitsmH", oSizeData.Data.Hip);
			oController._DetailJSonModel.setProperty("/Data/SuitsmL", oSizeData.Data.Cline);
			oController._DetailJSonModel.setProperty("/Data/PantwrW", oSizeData.Data.Waist);
			oController._DetailJSonModel.setProperty("/Data/PantwrH", oSizeData.Data.Hip);
			oController._DetailJSonModel.setProperty("/Data/PantwrL", oSizeData.Data.Cline);
			oController._DetailJSonModel.setProperty("/Data/Ringck", oSizeData.Data.Ringck);
			oController._DetailJSonModel.setProperty("/Data/Stylsm", oSizeData.Data.Stylsm);
			oController._DetailJSonModel.setProperty("/Data/Suitsm", oSizeData.Data.Suitsm);
			oController._DetailJSonModel.setProperty("/Data/Suitwr", oSizeData.Data.Suitwr);
			oController._DetailJSonModel.setProperty("/Data/Jmprwr", oSizeData.Data.Jmprwr);
		}
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.Sstat);
		
		// Build combo
		oController.buildCombo(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : oController._vFromPage || "ZUI5_HR_Smock.ZUI5_HR_SmockList",
		      data : {}
		});
	},
	
	commonAction : function(oController, oDetailData) {
		// 대상자 조회
		if(oController._vApdoc == '') {
			common.TargetUser.oController = oController;
			common.TargetUser.onSetTarget(oController);
		}
		
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vApdoc) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			targetData = {Data: {}},
			errData = {};
		
		oModel.read("/BsuitApplySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Apdoc', sap.ui.model.FilterOperator.EQ, oController._vApdoc),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				oDetailData.Data.Apdat = dateFormat.format(new Date(common.Common.setTime(oDetailData.Data.Apdat)));
				oDetailData.Data.SuitwrW = (oDetailData.Data.SuitwrW == "0.0") ? undefined : oDetailData.Data.SuitwrW;
				oDetailData.Data.SuitwrH = (oDetailData.Data.SuitwrH == "0.0") ? undefined : oDetailData.Data.SuitwrH;
				oDetailData.Data.SuitwrL = (oDetailData.Data.SuitwrL == "0.0") ? undefined : oDetailData.Data.SuitwrL;
				oDetailData.Data.PantwrW = (oDetailData.Data.PantwrW == "0.0") ? undefined : oDetailData.Data.PantwrW;
				oDetailData.Data.PantwrH = (oDetailData.Data.PantwrH == "0.0") ? undefined : oDetailData.Data.PantwrH;
				oDetailData.Data.PantwrL = (oDetailData.Data.PantwrL == "0.0") ? undefined : oDetailData.Data.PantwrL;
				oDetailData.Data.SuitsmW = (oDetailData.Data.SuitsmW == "0.0") ? undefined : oDetailData.Data.SuitsmW;
				oDetailData.Data.SuitsmH = (oDetailData.Data.SuitsmH == "0.0") ? undefined : oDetailData.Data.SuitsmH;
				oDetailData.Data.SuitsmL = (oDetailData.Data.SuitsmL == "0.0") ? undefined : oDetailData.Data.SuitsmL;
				
				targetData.Data.Pernr = oDetailData.Data.Pernr;
				targetData.Data.Perid = oDetailData.Data.Perid;
				targetData.Data.Ename = oDetailData.Data.Ename;
				targetData.Data.Orgeh = oDetailData.Data.Orgeh;
				targetData.Data.Orgtx = oDetailData.Data.Orgtx;
				targetData.Data.Zzjiktl = oDetailData.Data.Zzjiktl;
				targetData.Data.Zzjiktlt = oDetailData.Data.Zzjiktlt;
				targetData.Data.Btrtl = oDetailData.Data.Btrtl;
				targetData.Data.Btrtx = oDetailData.Data.Btext;
				targetData.Data.Zzjikgb = oDetailData.Data.Zzjikgb;
				targetData.Data.Zzjikgbt = oDetailData.Data.Zzjikgbt;
				targetData.Data.Zzjikch = oDetailData.Data.Zzjikch;
				targetData.Data.Zzjikcht = oDetailData.Data.Zzjikcht;
				
				oController._TargetJSonModel.setData(targetData);
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
	
	retrieveSize : function(oController, oSizeData) {
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
				oSizeData.Data = data.results[0];
				oSizeData.Data.Encid = vEncid;
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
	
	setPageHeader : function(oController, Sstat) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(Sstat == "" || Sstat == "1") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0194") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 194:방염 작업복 신청	
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0194") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 194:방염 작업복 신청	
		}
	},
	
	buildCombo : function(oController) {
		if(oController._vSgubn == '10') {	// 동계
			// 동복상의
			oController.onSetSuitwr(oController);
		} else {				// 하계
			// 하복상의
			oController.onSetSuitsm(oController);
		}
	},
	
	onResetUpperLine : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail"),
			oController = oView.getController();
		
		oController._DetailJSonModel.setProperty("/Data/Suitwr", undefined);
		oController._DetailJSonModel.setProperty("/Data/SuitwrW", undefined);
		oController._DetailJSonModel.setProperty("/Data/SuitwrH", undefined);
		oController._DetailJSonModel.setProperty("/Data/SuitwrL", undefined);
		oController._DetailJSonModel.setProperty("/Data/Ringck", undefined);
	},

	onResetDownLine : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail"),
			oController = oView.getController();
		
//		oController._DetailJSonModel.setProperty("/Data/Jmprwr", undefined);
		oController._DetailJSonModel.setProperty("/Data/PantwrW", undefined);
		oController._DetailJSonModel.setProperty("/Data/PantwrH", undefined);
		oController._DetailJSonModel.setProperty("/Data/PantwrL", undefined);
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
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail");
		var oController = oView.getController();
	},
	
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
	
	onPressSizeChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail"),
			oController = oView.getController();
		
		var moveReg = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id : "ZUI5_HR_SmockReg.ZUI5_HR_SmockRegDetail",
					data : {
						FromPage : "ZUI5_HR_Smock.ZUI5_HR_SmockDetail",
						Apdoc : oController._vApdoc,
						Sgubn : oController._vSgubn
					}
				});
			}
		}
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0196"), {	// 196:사이즈 등록관리 화면으로 이동하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [
				sap.m.MessageBox.Action.YES, 
				sap.m.MessageBox.Action.NO
			],
			onClose : moveReg
		});
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController.onValidationData(oController, vPrcty);
		
		if(vOData == "") return;
		
		vOData.Actty = _gAuth;
		vOData.Prcty = vPrcty;
		
		var onProcess = function() {
			var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV");
			
			// 신청시 솜바지와 동복을 함께 신청시 동복 필드 삭제
			if(vPrcty == "C" && oController._vSgubn == '10' && (vOData.SuitwrH && vOData.PantwrW)) {
				delete vOData.Suitwr;
				delete vOData.SuitwrW;
				delete vOData.SuitwrH;
				delete vOData.SuitwrL;
			}
			
			oModel.create("/BsuitApplySet", vOData, {
				success: function(data,res) {
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E') {
				if(errData.ErrorMessage.indexOf('Property') > -1) {
					errData.ErrorMessage = common.Common.convertSAPPropertyErrorMessage(oModel, 'BsuitApply', errData.ErrorMessage);
				}
				
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(errData.ErrorMessage);
				return ;
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
		} else {
			// 동복하의와 솜바지 함께 신청시
			if(oController._vSgubn == '10' && (vOData.SuitwrH && vOData.PantwrW)) {
				vInfoTxt = oBundleText.getText("LABEL_0206");	// 206:솜바지와 동복을 함께 신청시 동복은 미지급됩니다.\n솜바지를 신청하지 않을 경우 '아니오' 버튼을 클릭하여 솜바지 치수를 삭제한 후 동복만 신청하세요!
			} else {
				vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			}
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [
				sap.m.MessageBox.Action.YES, 
				sap.m.MessageBox.Action.NO
			],
			onClose : CreateProcess
		});
	},	
	
	onValidationData : function(oController, vPrtcy) {
		var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV"),
			rData = {},
			vData = oController._DetailJSonModel.getProperty("/Data"),
			vDetailData = {},
			vDetailDataList = [];
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(_gAuth == 'H' && !_isPossibleApply) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0207"));	// 207:신청 하실수 없습니다.
			return "";
		}
		if(!vData.Apdat) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0209"));	// 209:신청일자가 입력되지 않았습니다.
			return "";
		}
		
		if(oController._vSgubn == '10') {
			if(vData.SuitwrW || vData.SuitwrH || vData.SuitwrL || vData.Ringck) {
				if(!vData.SuitwrW) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0192"));	// 192:동복하의(허리)가 입력되지 않았습니다.
					return "";
				}
				if(!vData.SuitwrH) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0193"));	// 193:동복하의(힙)가 입력되지 않았습니다.
					return "";
				}
				if(!vData.SuitwrL) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0190"));	// 190:동복하의(기장)가 입력되지 않았습니다.
					return "";
				}
				if(!vData.Ringck) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0184"));	// 184:고리부착여부가 선택되지 않았습니다.
					return "";
				}
			}
			if(vData.PantwrW || vData.PantwrH || vData.PantwrL) {
				if(!vData.PantwrW) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0203"));	// 203:솜바지(허리)가 입력되지 않았습니다.
					return "";
				}
				if(!vData.PantwrH) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0204"));	// 204:솜바지(힙)가 입력되지 않았습니다.
					return "";
				}
				if(!vData.PantwrL) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0201"));	// 201:솜바지(기장)가 입력되지 않았습니다.
					return "";
				}
			}
			if(!vData.Suitwr && !vData.SuitwrW  && !vData.Jmprwr && !vData.PantwrW) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0211"));	// 211:신청항목이 입력되지 않았습니다.
				return "";
			}
			
			// 하계 항목 삭제
			delete vData.Suitsm;
			delete vData.SuitsmW;
			delete vData.SuitsmH;
			delete vData.SuitsmL;
			delete vData.Stylsm;
		} else {
			if(!vData.Suitsm) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0215"));	// 215:하복상의가 선택되지 않았습니다.
				return "";
			}
			if(!vData.SuitsmW) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0218"));	// 218:하복하의(허리)가 입력되지 않았습니다.
				return "";
			}
			if(!vData.SuitsmH) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0219"));	// 219:하복하의(힙)가 입력되지 않았습니다.
				return "";
			}
			if(!vData.SuitsmL) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0216"));	// 216:하복하의(기장)가 입력되지 않았습니다.
				return "";
			}
			if(!vData.Stylsm) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0200"));	// 200:선호스타일이 선택되지 않았습니다.
				return "";
			}
			if(!vData.Ringck) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0184"));	// 184:고리부착여부가 선택되지 않았습니다.
				return "";
			}
			
			// 동계 항목 삭제
			delete vData.Suitwr;
			delete vData.SuitwrW;
			delete vData.SuitwrH;
			delete vData.SuitwrL;
			delete vData.PantwrW;
			delete vData.PantwrH;
			delete vData.PantwrL;
			delete vData.Jmprwr;
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "BsuitApply", vData);
			rData.Apdat = "\/Date("+ common.Common.getTime(rData.Apdat)+")\/";
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV"),
				vApdoc = oController._DetailJSonModel.getProperty("/Data/Apdoc");
			
			oModel.remove("/BsuitApplySet(Apdoc='" + vApdoc + "')", {
				success: function(data,res) {
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.show(errData.ErrorMessage, {});
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
		
		var DeleteProcess = function(fVal) {
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
	
	preRegCheck : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_BSUIT_SRV"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			isValid = false,
			errData = {};
		
		if(!vEncid) return true;
		
		oModel.read("/BsuitApplySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'N'),
				new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Sgubn', sap.ui.model.FilterOperator.EQ, oController._vSgubn)
			],
			success : function(data, res) {
				isValid = true;
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData && errData.Error == "E") {
			sap.m.MessageBox.show(errData.ErrorMessage, {});
		}
		
		return isValid;
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Suitsm;	// 하복상의
		delete detailData.SuitsmW;	// 하복하의-허리
		delete detailData.SuitsmH;	// 하복하의-힙
		delete detailData.SuitsmL;	// 하복하의-기장
		delete detailData.Stylsm;	// 선호스타일
		delete detailData.Ringck;	// 선호스타일
		delete detailData.Suitwr;	// 동복상의
		delete detailData.SuitwrW;	// 동복하의-허리
		delete detailData.SuitwrH;	// 동복하의-힙
		delete detailData.SuitwrL;	// 동복하의-기장
		delete detailData.Jmprwr;	// 방한점퍼
		delete detailData.PantwrW;	// 솜바지-허리
		delete detailData.PantwrH;	// 솜바지-힙
		delete detailData.PantwrL;	// 솜바지-기장
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		var oSizeData = {Data : {}};
		
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 신청전 체크
		if(oController.preRegCheck(oController)) {
			_isPossibleApply = true;

			// 사이즈정보 조회
			oController.retrieveSize(oController, oSizeData);
		} else {
			_isPossibleApply = false;
		}
		
		// 사이즈정보 Binding
		oController._SizeJSonModel.setData(oSizeData);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Smock.ZUI5_HR_SmockDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});