jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail
	 */

	PAGEID : "ZUI5_HR_ConGoodsDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vZworktyp : 'HR28',
	_vEnamefg : "",
	
	
	_ConGoodsFamilyList : new sap.ui.model.json.JSONModel(), 
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
		bus.subscribe("app", "OpenWindow", this.SmartSizing,
				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
				this);
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		var vZappStatAl = "" , vRegno = "";
		var oDetailTitle = "" ;
		oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var oModel = sap.ui.getCore().getModel("ZHR_CON_GOODS_SRV");
		var oDetailData = {Data : {}};

	
		// 경조유형 List Item 조회 및 binding
		var oConcode = sap.ui.getCore().byId(oController.PAGEID + "_Concode"); 
		if(oConcode.getItems().length < 1){
			oModel.read("/CondolenceTypeListSet", 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							for(var i = 0; i < data.results.length; i++){
								oConcode.addItem(new sap.ui.core.Item ({key :  data.results[i].Concode, text : data.results[i].Context}));
							}
						}
					},
					function(Res){
					}
				);
		}
		
		if(oController._vAppno != ""){  // 수정 및 조회
			oController.BusyDialog.open();
			var vErrorMessage = "", vError = "";
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});				
			var oPath = "/ConGoodsRequestApplSet/?$filter=Appno eq '" + oController._vAppno + "'";	
			oModel.read(oPath, 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							var OneData = data.results[0];		

							vZappStatAl = OneData.ZappStatAl ;
							
							if (OneData.Actdt != null && OneData.Actdt != ""){
								OneData.Actdt = dateFormat.format(new Date(OneData.Actdt)); // 조치일자.								
							}

							
							oDetailData.Data = OneData;
						}
					},
					function(Res){
						vError = "E";
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
								vErrorMessage = ErrorMessage;
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
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		// 공통적용사항 End
				
	
		// 경조유형 List 조회 및 binding
		oController.onSetConcode(oController);
		
		// 관계자 조회
		oController.onSetConresn(oController);
			
		// 경조상품 조회
		oController.onSetCongoods(oController);	

		
		// 결재 상태에 따라 Page Header Text 수정		
		if( vZappStatAl == "" ){
			oDetailTitle.setText(oBundleText.getText("LABEL_1351") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1351:경조화환 신청
		}else if(vZappStatAl == "10"){
			oDetailTitle.setText(oBundleText.getText("LABEL_1351") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1351:경조화환 신청
		}else{
			oDetailTitle.setText(oBundleText.getText("LABEL_1351") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1351:경조화환 신청
		}
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		}else{
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsList",
			      data : {
			    	 
			      }
				});	
		}
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"),{	// 55:유효하지 않은 날짜형식입니다.
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
	},
	// 경조유형 조회 및 binding
	onSetConcode : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		var DetailData = oController._DetailJSonModel.getProperty("/Data");
		var oConcode = sap.ui.getCore().byId(oController.PAGEID + "_Concode");
		oConcode.destroyItems();
	
		var oModel = sap.ui.getCore().getModel("ZHR_CON_GOODS_SRV");
		
		if(DetailData && DetailData.Pernr != undefined && DetailData.Pernr != ""){
			var oPath = "/CondolenceTypeListSet";
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){
								oConcode.addItem(new sap.ui.core.Item({key: data.results[i].Concode, text: data.results[i].Context}));
							}
						}
					},
					function(res){console.log(res);}
			);	
		}
	},
	
	// 관계자 조회
	onSetConresn : function(oController){
		var oConresn = sap.ui.getCore().byId(oController.PAGEID + "_Conresn");
		oConresn.destroyItems();
		var oModel = sap.ui.getCore().getModel("ZHR_CON_GOODS_SRV");
		var vConcode = oController._DetailJSonModel.getProperty("/Data/Concode"); 
		var vConresn = oController._DetailJSonModel.getProperty("/Data/Conresn");
		var veqyn = "";
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"); // 대상자		
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"); // 대상자	
		
		if(vConcode && vConcode != ""){
//			var oPath = "/ConGoodsPersonListSet?$filter=Encid eq '" + encodeURIComponent(vEncid) + "' and Concode eq '" + vConcode + "'" ;
			var oPath = "/ConGoodsPersonListSet?$filter=Pernr eq '" + vPernr + "' and Concode eq '" + vConcode + "'" ;
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){
								if(vConresn == data.results[i].Conresn) veqyn = "X" ;
								
								oConresn.addItem(new sap.ui.core.Item({key: data.results[i].Conresn, text: data.results[i].Conretx,
									customData : [ 
												   new sap.ui.core.CustomData({key : "Cname", value : data.results[i].Cname}), 
												   new sap.ui.core.CustomData({key : "Congoods", value : data.results[i].Congoods}),	
												 ]
								}));
								
							}
						}
					},
					function(res){console.log(res);}
			);
		}
		
		// 기존입력값과 동일한 값이 존재하지 않을 시 처리
		if(veqyn == "") oController._DetailJSonModel.setProperty("/Data/Conresn","");
	},
	
	// 상품명 조회
	onSetCongoods : function(oController){
		var oCongoods = sap.ui.getCore().byId(oController.PAGEID + "_Congoods");
		oCongoods.destroyItems();
		var oModel = sap.ui.getCore().getModel("ZHR_CON_GOODS_SRV");
		var vConcode = oController._DetailJSonModel.getProperty("/Data/Concode"); 
		var vCongoods = oController._DetailJSonModel.getProperty("/Data/Congoods");
		var veqyn = "";
		if(vConcode && vConcode != ""){
			var oPath = "/ConGoodsListSet?$filter=Concode eq '" + vConcode+ "'" ;
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){
								if(vCongoods == data.results[i].Congoods) veqyn = "X" ;
									
								oCongoods.addItem(new sap.ui.core.Item({key: data.results[i].Congoods, text: data.results[i].Congoodstx }));
							}
						}
					},
					function(res){console.log(res);}
			);
		}
		
		// 기존입력값과 동일한 값이 존재하지 않을 시 처리
		if(veqyn == "") oController._DetailJSonModel.setProperty("/Data/Congoods","");
	},	


	
	// 경조유형 변경 Event
	onChangeConcode : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();

		oController._DetailJSonModel.setProperty("/Data/Conresn", "");  // 관계자
		oController._DetailJSonModel.setProperty("/Data/Cname","");     // 관계자명
		oController._DetailJSonModel.setProperty("/Data/Congoods", ""); // 상품
		oController._DetailJSonModel.setProperty("/Data/Conadd", false);   // 추가
		oController._DetailJSonModel.setProperty("/Data/Actdt",null);   // 신청일자.
		oController._DetailJSonModel.setProperty("/Data/Acttm","");   // 신청시간.
		oController._DetailJSonModel.setProperty("/Data/ActtmT","");   // 신청시간.  
		
		// 관계자 조회.
		oController.onSetConresn(oController);

		// 상품 조회.
		oController.onSetCongoods(oController);
	},
	
	// 관계자 변경 Event
	onChangeConresn : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		var oConresn = sap.ui.getCore().byId(oController.PAGEID + "_Conresn");		
		var vConresn = oController._DetailJSonModel.getProperty("/Data/Conresn");

		oController._DetailJSonModel.setProperty("/Data/Congoods", ""); // 상품		
		
		oConresn.getItems();
		var vCname = ""; 
		var vCongoods = "";
		
		for(var i =0; i < oConresn.getItems().length; i++){
			if(oConresn.getItems()[i].getKey() == vConresn){
				vCname = oConresn.getItems()[i].getCustomData()[0].getValue();
				vCongoods = oConresn.getItems()[i].getCustomData()[1].getValue();
				break;
			}
		}
		

		if(vConresn == "010"){ // 본인
			oController._DetailJSonModel.setProperty("/Data/Cname",vCname);     // 관계자명		
		}else{			
			oController._DetailJSonModel.setProperty("/Data/Cname","");     // 관계자명			
		}
		
		// Default 상품
		oController._DetailJSonModel.setProperty("/Data/Congoods",vCongoods);		
		
		// 상품 조회
		oController.onSetCongoods(oController);
		
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "" , vErrorMessage = "", vImessage = "";
		var vOData = oController.onValidationData(oController, vPrcty, "X");
		if( vOData == "") return ;
		vOData.Prcty = vPrcty ; 
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_CON_GOODS_SRV");
				var oPath = "/ConGoodsRequestApplSet";
				oModel.create(
						oPath,
						vOData,
						null,
						function(data,res){
							if(data) {
								oController._vAppno = data.Appno;
								oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
								oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
								vZappStatAl = data.ZappStatAl;
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
					new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
					return ;
				}
				
				common.AttachFileAction.uploadFile(oController);
				
				oController.BusyDialog.close();
				
				if(vImessage != ""){
					vImessage = vCompTxt + "\n" +  vImessage;
					sap.m.MessageBox.alert(vImessage , {
						title : oBundleText.getText("LABEL_0052"),	// 52:안내
						onClose : oController.onBack
					});
				}else{
					sap.m.MessageBox.show(vCompTxt, {
						title : oBundleText.getText("LABEL_0052"),	// 52:안내
						onClose : oController.onBack
					});
				}
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
	
	onValidationData : function(oController, vPrtcy , vCheck){
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		
		var oConcode = sap.ui.getCore().byId(oController.PAGEID + "_Concode"); 
		var oConresn = sap.ui.getCore().byId(oController.PAGEID + "_Conresn");  
		var oCname = sap.ui.getCore().byId(oController.PAGEID + "_Cname");
		var oCongoods = sap.ui.getCore().byId(oController.PAGEID + "_Congoods");
		var oAddre = sap.ui.getCore().byId(oController.PAGEID + "_Addre");
		var oTelno = sap.ui.getCore().byId(oController.PAGEID + "_Telno");
		
//		oConcode.setValueState(sap.ui.core.ValueState.None);
//		oConresn.setValueState(sap.ui.core.ValueState.None);
//		oGrdsp.setValueState(sap.ui.core.ValueState.None);
//		oDivcd.setValueState(sap.ui.core.ValueState.None);
//		oSchtx.setValueState(sap.ui.core.ValueState.None);
//		oZbetTotl.setValueState(sap.ui.core.ValueState.None);
//		oZyear.setValueState(sap.ui.core.ValueState.None);
		if(vCheck == "X"){
			if(vData.Pernr == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
				return "";
			}
			if(vData.Concode == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1361"));	// 1361:경조유형이 선택되지 않았습니다.
//				oConcode.setValueState(sap.ui.core.ValueState.Error);
				return "";
			}
			
			if(vPrtcy == "C"){			
			
				if(vData.Conresn == ""){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1362"));	// 1362:관계가 선택되지 않았습니다.
//					oConresn.setValueState(sap.ui.core.ValueState.Error);
					return "";
				}

				if(vData.Cname == ""){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1363"));	// 1363:대상자 성명이 입력되지 않았습니다.
//					oConresn.setValueState(sap.ui.core.ValueState.Error);
					return "";
				}
				
				// 결혼일 경우!.
				if(vData.Concode == "110"){
					
					if(vData.Actdt == null || vData.ActtmT == ""){
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1364"));	// 1364:조치일자/시간이 입력되지 않았습니다.
//						oConresn.setValueState(sap.ui.core.ValueState.Error);
						return "";
					}
					
				}
				
				if(vData.Addre == ""){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1365"));	// 1365:배송주소가 입력되지 않았습니다.
	//				oGrdsp.setValueState(sap.ui.core.ValueState.Error);
					return "";
				}
			
				if(vData.Telno == ""){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1366"));	// 1366:받는분 연락처가 입력되지 않았습니다.
	//				oGrdsp.setValueState(sap.ui.core.ValueState.Error);
					return "";
				}				
			}
		}
		
		Object.assign(rData, common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_CON_GOODS_SRV"), "ConGoodsRequestAppl", vData));
		rData.Acttm = undefined;
		
		if(vData.Actdt != null){
			rData.Actdt =   "\/Date("+ common.Common.getTime(vData.Actdt)+")\/"; // 조치일자						
		}else{
			rData.Actdt = null; // 조치일자			
		};			
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_CON_GOODS_SRV");
				var oPath = "/ConGoodsRequestApplSet(Appno='" + vDetailData.Appno + "')";
				oModel.remove(
						oPath,
						null,
						function(data,res){
						},
						function(Res){
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
				);
				oController.BusyDialog.close();
				
				
				if(vError =="E"){
					sap.m.MessageBox.show(vErrorMessage,{
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
	
	onCalTotal : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		// 입력값 Comma 부여
		var vData = common.Common.numberWithCommas(oEvent.getParameters().value);
		var oControl = sap.ui.getCore().byId(oEvent.getParameters().id); 
		oControl.setValue(vData);
		// 합계 계산
		
		var vEntr = common.Common.removeComma(oController._DetailJSonModel.getProperty("/Data/ZbetEntr"));
		var vClas = common.Common.removeComma(oController._DetailJSonModel.getProperty("/Data/ZbetClas"));
		var vOper = common.Common.removeComma(oController._DetailJSonModel.getProperty("/Data/ZbetOper"));
		var vEtc = common.Common.removeComma(oController._DetailJSonModel.getProperty("/Data/ZbetEtc"));
		var vTotal = "";
		
		vTotal = vEntr * 1 + vClas * 1 + vOper * 1 + vEtc * 1;
		
		oController._DetailJSonModel.setProperty("/Data/ZbetTotl",common.Common.numberWithCommas(vTotal));
	},
	
	onCancelConGoods : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
	
	
	onAfterSelectPernr : function(oController){
		// 경조유형 조회
		oController.onSetConcode(oController);

		// 관계자 조회	
		oController.onSetConresn(oController);
		
		// 관계자 상품조회	
		oController.onSetCongoods(oController);		
	},
	
	openDocno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		var vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		if(vUri && vUri != "")  window.open(vUri);
	},

	onDisplaySearchZipcodeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();
		common.ZipSearch.oController = oController ;
		if(oController._vSelectedPernr == "") return ;
		if(!oController._ZipSearchDialog) {
			oController._ZipSearchDialog = sap.ui.jsfragment("fragment.ZipSearchDialog", oController);
			oView.addDependent(oController._ZipSearchDialog);
		}
		oController._ZipMode = "1" ; // 현 거주지
		oController._ZipSearchDialog.open();
	},
	
	onSelectAddress : function(zipNo, roadAddr, siNm, engAddr){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
		var oController = oView.getController();	
		
		oController._DetailJSonModel.setProperty("/Data/Addre" , roadAddr);
		
	},
	
	
});
function jusoCallBack(Zip,Addr1,Addr2,EnAddr) {
	var oView = sap.ui.getCore().byId("ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail");
	var oController = oView.getController();
	oController._DetailJSonModel.setProperty("/Data/Addre", Addr1 );
};
