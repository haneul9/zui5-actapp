//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail
	 */

	PAGEID : "ZUI5_HR_LicensePayDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vFromPage : "",
	_vEnamefg : "",
	
	_vZworktyp : "HR27",
	///// 결재자 지정 /////
	_CertificatePay : [],
	
	BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function() {

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

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
		bus.subscribe("app", "OpenWindow", this.SmartSizing,
				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
				this);
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		
		oController._vAppno = "";
		var vFromPageId = "";
		var vZappStatAl = "";
		if(oEvent) {
			oController._vAppno = vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		var oDetailData = {Data : {}};
		if(oController._vAppno != ""){
			var oModel = sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV");
			var vErrorMessage = "", vError = "";
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var oPath = "/CertificatePaySet?$filter=Appno eq '" + oController._vAppno + "' and Prcty eq 'D'";
			oModel.read(oPath, null, null, false,
					function(data, res){
						data.results[0].Ctpay = common.Common.numberWithCommas(data.results[0].Ctpay);
						data.results[0].Prdat = dateFormat.format(data.results[0].Prdat); // 선/해임일
						data.results[0].Preda = data.results[0].Preda != null ? dateFormat.format(data.results[0].Preda) : null; // 선임일
						// 상태
						vZappStatAl = data.results[0].ZappStatAl;
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
		// 공통적용사항 Start
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
		// 공통적용사항 End
		
		//신청구분 List 조회
		oController.onChangePregb();
		//자격면허증 List 조회
		oController.onSearchCttyp();
		//자격면허 등급 List 조회
		oController.onSearhCtgrd(oController);

		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl){
//			sap.ui.getCore().byId(oController.PAGEID + "_NoticePanel").setExpanded(true);
			oPortalTitle.setText(oBundleText.getText("LABEL_1337") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1337:자격면허수당 신청
		} else if(vZappStatAl == "10"){
//			sap.ui.getCore().byId(oController.PAGEID + "_NoticePanel").setExpanded(false);
			oPortalTitle.setText(oBundleText.getText("LABEL_1337") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1337:자격면허수당 신청
		} else {
//			sap.ui.getCore().byId(oController.PAGEID + "_NoticePanel").setExpanded(false);
			oPortalTitle.setText(oBundleText.getText("LABEL_1337") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1337:자격면허수당 신청
		}
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		
		
		oController.BusyDialog.close();
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
		var oRow, oCell;
		var oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0090")}).addStyleClass("FontFamilyBold")	// 90:입사일
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Entda}",
				}).addStyleClass("FontFamily")]
			}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : ""}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Text({	}).addStyleClass("FontFamily")]
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oTargetMatrix.addRow(oRow);
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_LicensePay.ZUI5_HR_LicensePayList",
			      data : { }
				}
			);	
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController , "A");
		// 신청대상
		oController.onChangePregb();
		
	},
	
	// 신청구분 변경시 처리
	onChangePregb : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
		if(oEvent){
			// 신청구분 Text 저장
			oController._DetailJSonModel.setProperty("/Data/Pregbt", oEvent.getSource()._getSelectedItemText());
			// 신청구분 변경으로 나머지 Field 초기화
			oController.onResetDetail(oController, "B");
		}
		
		var oCtqua = sap.ui.getCore().byId(oController.PAGEID + "_Ctqua");
		if(oCtqua.getItems()) oCtqua.destroyItems();
		var oModel = sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV");
		oController._CertificatePay = []; 
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		if(!vEncid || vEncid == "") return ;
		
		var vPregb = oController._DetailJSonModel.getProperty("/Data/Pregb");
		if(vPregb && vPregb != ""){
			if(vPregb == "A"){ // 선임일 경우 ALL
				var oPath = "/CtquaCodeListSet";
				
				oModel.read(oPath, null, null, false, 
						function(data,res){
							if(data && data.results.length){
								for(var i=0; i<data.results.length; i++){
									oCtqua.addItem(new sap.ui.core.Item({key : data.results[i].Ctqua, text : data.results[i].Ctquat})
														.addCustomData(new sap.ui.core.CustomData({key : "Ctrsn", value : data.results[i].Ctrsn}))
														.addCustomData(new sap.ui.core.CustomData({key : "Ctrsnt", value : data.results[i].Ctrsnt})));
								}	
							}
						}, function(Res){
							if(Res.response.body){
								ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}
								console.log(ErrorMessage);
							}
						}
				);
			}else if(vPregb == "B"){
				var oPath = "/CertificatePaySet?$filter=Encid eq '" + encodeURIComponent(vEncid)  + "' and Prcty eq 'I'";
				
				oModel.read(oPath, null, null, false, 
						function(data,res){
							if(data && data.results.length){
								for(var i=0; i<data.results.length; i++){
									oCtqua.addItem(new sap.ui.core.Item({key : data.results[i].Ctqua, text : data.results[i].Ctquat}));
									oController._CertificatePay.push(data.results[i]);
								}	
							}
						}, function(Res){
							if(Res.response.body){
								ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}
								console.log(ErrorMessage);
							}
						}
				);
			}
		}
	},
	
	// 선임일 변경 시 자격면허증 List 조회
	onSearchCttyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV");
		
		var oCttyp = sap.ui.getCore().byId(oController.PAGEID + "_Cttyp"),
		oPrdat = sap.ui.getCore().byId(oController.PAGEID + "_Prdat");
		oCttyp.destroyItems();
		
		if(!common.Common.checkNull(oPrdat.getValue()) && !common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Ctgrd"))){
			var aFilters = [];
				aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")));
				aFilters.push(new sap.ui.model.Filter('Prdat', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Prdat").getDateValue())));
				aFilters.push(new sap.ui.model.Filter('Ctgrd', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Ctgrd")));
				
			var errData = {};
			oModel.read("/CttypCodeListSet",{ 
					filters : aFilters,
					async : false,
					success : function(data, res) {
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){
								oCttyp.addItem(new sap.ui.core.Item({key : data.results[i].Cttyp, text : data.results[i].Cttypt}));
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
	},
	
	// 자격선임 유형 변경 시 처리
	onchangeCtqua : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
		
		var vPregb = oController._DetailJSonModel.getProperty("/Data/Pregb");
		var oCtqua = sap.ui.getCore().byId(oController.PAGEID + "_Ctqua");
		var vCtqua = oController._DetailJSonModel.getProperty("/Data/Ctqua");
		
		//자격면허 등급 리스트 초기화
		var oCtgrd = sap.ui.getCore().byId(oController.PAGEID + "_Ctgrd");
		if(oCtgrd.getItems()) oCtgrd.destroyItems();
		
		//자격 면허증 리스트 초기화
		var oCttyp = sap.ui.getCore().byId(oController.PAGEID + "_Cttyp");
		if(oCttyp.getItems()) oCttyp.destroyItems();
		
		//자격선임 유형 변경 시 자격면허 등급, 자격수당 금액, 자격 면허증 초기화
		if(oEvent){
			oController._DetailJSonModel.setProperty("/Data/Ctgrd", "");  
			oController._DetailJSonModel.setProperty("/Data/Ctpay", ""); 
			oController._DetailJSonModel.setProperty("/Data/Cttyp", ""); 
		}
		// 자격면허 등급 List 조회
		oController.onSearhCtgrd(oController);
		
		if(vPregb == "A"){
			var vCtrsn = oCtqua.getSelectedItem().getCustomData()[0].getValue();
			var vCtrsnt = oCtqua.getSelectedItem().getCustomData()[1].getValue();
			vCtrsn = vCtrsn == null || typeof(vCtrsn) == undefined ? "" : vCtrsn ;
			vCtrsnt = vCtrsnt == null || typeof(vCtrsnt) == undefined ? "" : vCtrsnt ;
			oController._DetailJSonModel.setProperty("/Data/Ctrsn", vCtrsn);
			oController._DetailJSonModel.setProperty("/Data/Ctrsnt", vCtrsnt);
			oController._DetailJSonModel.setProperty("/Data/Preda", ""); // 자격선임일
			
		}else if(vPregb == "B"){
			var vSelectedData = "";
			for(var i = 0; i < oController._CertificatePay.length ; i++){
				if(oController._CertificatePay[i].Ctqua == vCtqua){
					vSelectedData = oController._CertificatePay[i];
					break;
				}
			}
			if(vSelectedData != ""){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
				oController._DetailJSonModel.setProperty("/Data/Ctgrd", vSelectedData.Ctgrd); //자격등급
				oController._DetailJSonModel.setProperty("/Data/Ctpay", common.Common.numberWithCommas(vSelectedData.Ctpay)); // 자격수당
				oController._DetailJSonModel.setProperty("/Data/Ctrsn", vSelectedData.Ctrsn); // 수당사유 코드
				oController._DetailJSonModel.setProperty("/Data/Ctrsnt", vSelectedData.Ctrsnt); // 수당사유 Text
				oController._DetailJSonModel.setProperty("/Data/Cttyp", vSelectedData.Cttyp); // 자격증코드
				oController._DetailJSonModel.setProperty("/Data/Cttypt", vSelectedData.Cttypt); // 자격증 text
				oController._DetailJSonModel.setProperty("/Data/Zregi", vSelectedData.Zregi); // 등록처
				oController._DetailJSonModel.setProperty("/Data/Zbigo", vSelectedData.Zbigo); // 비고
				vSelectedData.Preda = vSelectedData.Preda != null ? dateFormat.format(vSelectedData.Preda) : null; // 선임일
				oController._DetailJSonModel.setProperty("/Data/Preda", vSelectedData.Preda); // 자격선임일
			}
		}
	},
	
	// 자격면허 등급 List 조회
	onSearhCtgrd : function(oController){
		var oCtgrd = sap.ui.getCore().byId(oController.PAGEID + "_Ctgrd");
		if(oCtgrd.getItems()) oCtgrd.destroyItems();
		
		var vCtqua = oController._DetailJSonModel.getProperty("/Data/Ctqua");
		
		if(vCtqua && vCtqua != ""){
			
			var oModel = sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV");
			var oPath = "/CtgrdCodeListSet?$filter=Ctqua eq '" + vCtqua + "'";
			
			oModel.read(oPath, null, null, false, 
					function(data,res){
						if(data && data.results.length){
							for(var i=0; i<data.results.length; i++){
								oCtgrd.addItem(new sap.ui.core.Item({key : data.results[i].Ctgrd, text : data.results[i].Ctgrdt})
													.addCustomData(new sap.ui.core.CustomData({key : "Ctpay", value : data.results[i].Ctpay})));
							}	
						}
					}, function(Res){
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
							console.log(ErrorMessage);
						}
					}
			);
		}
		
	},
	
	//자격면허 등급 변경 처리
	onChangeCtgrd : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
		var vCtgrd = oController._DetailJSonModel.getProperty("/Data/Ctgrd");
		var oCtgrd = sap.ui.getCore().byId(oController.PAGEID + "_Ctgrd");
		
		if(vCtgrd && vCtgrd != ""){
			var vCtpay = oCtgrd.getSelectedItem().getCustomData()[0].getValue();
			vCtpay = common.Common.numberWithCommas(vCtpay);
			oController._DetailJSonModel.setProperty("/Data/Ctpay",vCtpay);
		}
		
		// 자격면허증 초기화
		oController._DetailJSonModel.setProperty("/Data/Cttyp","");
		// 자격면허 리스트 조회
		oController.onSearchCttyp();
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController, vType){
		// A : 대상자를 선택하여 전체 Data 를 초기화 
		// B : 신청구분을 변경하여 나머지 Data 를 초기화
		if(vType == "A"){
			oController._DetailJSonModel.setProperty("/Data/Pregb", "");   // 신청구분
		}
		
		oController._DetailJSonModel.setProperty("/Data/Prdat", "");   // 선/해임일
		oController._DetailJSonModel.setProperty("/Data/Ctqua", "");   // 자격선임 유형
		oController._DetailJSonModel.setProperty("/Data/Ctgrd", "");   // 자격면허 등급
		oController._DetailJSonModel.setProperty("/Data/Ctpay", "");   // 자격수당 금액
		oController._DetailJSonModel.setProperty("/Data/Ctrsnt", "");  // 자격수당 사유
		oController._DetailJSonModel.setProperty("/Data/Cttyp", "");   // 자격면허증
		oController._DetailJSonModel.setProperty("/Data/Preda", "");   // 선임일
		oController._DetailJSonModel.setProperty("/Data/Zregi", "");   // 등록처
		oController._DetailJSonModel.setProperty("/Data/Zbigo", "");   // 비고
	},	
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty){
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			var vErrorMessage = "", vError = "";
			
			var oModel = sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			createData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV"), "CertificatePay", oneData);
			
			createData.Appno = oController._vAppno;
			createData.Prdat = typeof(createData.Prdat) == undefined || createData.Prdat == "" ? "" : "\/Date("+ common.Common.getTime(createData.Prdat)+")\/";	// 선/해임일
			if(typeof(createData.Preda) == "undefined" || createData.Preda == ""){
				delete createData.Preda;
			}else{
				createData.Preda = "\/Date("+ common.Common.getTime(createData.Preda)+")\/";	// 자격선임일
			}
			createData.Ctpay = common.Common.removeComma(createData.Ctpay);
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			createData.Waers = "KRW";
			
			oModel.create("/CertificatePaySet", createData, null,
					function(data,res){
						if(data) {
							if(data){
								oController._vAppno = data.Appno ;
							}
						} 
					},
					function (oError) {
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
			);
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				sap.m.MessageBox.error(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			
			// 첨부파일 업로드
			common.AttachFileAction.uploadFile(oController);
			
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
		var vData = oController._DetailJSonModel.getProperty("/Data");

		var oneData = oController._DetailJSonModel.getProperty("/Data");		
		if(!oneData.Pernr){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		} else if(!oneData.Pregb){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0349"), {title : oBundleText.getText("LABEL_0053")});	// 349:신청구분을 선택하여 주십시오.
			return false;
		} else if(!oneData.Prdat){
			if(oneData.Pregb == "A") sap.m.MessageBox.error(oBundleText.getText("LABEL_1348"), {title : oBundleText.getText("LABEL_0053")});	// 1348:선임일을 선택하여 주십시오.
			else if(oneData.Pregb == "B" ) sap.m.MessageBox.error(oBundleText.getText("LABEL_1349"), {title : oBundleText.getText("LABEL_0053")});	// 1349:해임일을 선택하여 주십시오.
			return false;
		}  else if(!oneData.Ctqua){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1350"), {title : oBundleText.getText("LABEL_0053")});	// 1350:자격선임 유형을 선택하여 주십시오.
			
			return false;
		} else if(vPrcty == "C" && oneData.Pregb == "A"){
			var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			var vData = oAttachFileList.getModel().getProperty("/Data");
			if(!vData || vData.length < 1){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
				return false;
			}
		}
	},
	
	

	onDelete : function(oController){ 
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail");
		var oController = oView.getController();
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV");
				var oPath = "/CertificatePaySet(Appno='" + vDetailData.Appno + "')";
				oModel.remove(
						oPath,
						null,
						function(data,res){
						},
						function(Res){
							if(Res.response.body){
								var ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								oController.Error = "E"; 
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}else{
									oController.ErrorMessage =ErrorMessage ;
								}
							}
							
						}
				);
				oController.BusyDialog.close();
				
				if(oController.Error =="E"){
					sap.m.MessageBox.show(oController.ErrorMessage,{
					});
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
	},
});