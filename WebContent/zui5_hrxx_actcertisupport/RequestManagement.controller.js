jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actcertisupport.RequestManagement", {
	PAGEID : "RequestManagement",
	
	BusyDialog : null,
	_vAppno2 : "",
	_vReqst : "",
	_vPersa : "",
	_vAppld : "",
	FromPageType : "", // S : 대상자 선택 화면 , F : 자격증 응시료 지원 관리 Main 화면
	vContext : null,
	_InfoEnterDialog : null,
	_SelectDoctypeDialog : null,
	
	oBundleText : jQuery.sap.resources({
		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		//};
		
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				//common.Common.log("onAfterShow " + new Date());
//				this.onBeforeShow(evt);
			}, this),
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf epmproductapp.EPMProductApp
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf epmproductapp.EPMProductApp
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf epmproductapp.EPMProductApp
*/
//	onExit: function() {
//
//	}
	
	
	/*
	 * 페이지가 표시되기전에 수행한다.
	 * 바인딩 전에 안내메세지 출력 후 바인딩이 완료되면 메세지 창을 닫는다.
	 */
	onBeforeShow: function(oEvent) {
		var oController = this ;
		var oTitle = sap.ui.getCore().byId( oController.PAGEID + "_Title");
		var oAppld = sap.ui.getCore().byId( oController.PAGEID + "_APPLD");
		var oNotet = sap.ui.getCore().byId(oController.PAGEID + "_Notet");
		var oNoteb = sap.ui.getCore().byId(oController.PAGEID + "_Noteb");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var vAppld = "";
		oController.FromPageType = oEvent.data.FromPageType ;
		// 신규 등록이나 LIST 를 선택하여 들어올 경우
		if(oController.FromPageType == "F"){
			oController._vAppno2 = oEvent.data.Appno2 ;
			oController._vReqst = oEvent.data.Reqst;
			oTitle.setValue(oEvent.data.Title);
			oNotet.setValue(oEvent.data.ContsT);
			oNoteb.setValue(oEvent.data.ContsB);
			vAppld = oEvent.data.Appld;
			if(vAppld == "" || vAppld == null ){
				oAppld.setText("");
			}else{
				oAppld.setText(dateFormat.format(new Date(common.Common.setTime(new Date(vAppld)))));
			}
		}else if(oController.FromPageType == "S"){
		  // 대상자 선택 화면에서 이동한 경우	
		}

		var oEmpInfoModel = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpInfoData = oEmpInfoModel.getProperty("/EmpLoginInfoSet");
	
		var oAinct = sap.ui.getCore().byId( oController.PAGEID + "_AINCT_COLUMN");
		
		if(vEmpInfoData.length > 0) {
			oController._vPersa  =  vEmpInfoData[0].Persa;
		}else{
			return ;
		}
		if(oController._vPersa == "7700"){
			oAinct.setVisible(true);
		}else{
			oAinct.setVisible(false);
		}
		
		oController.onPressSearch();
		
	},
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
		var oController = oView.getController();
		oController.initControl(oController);
		oController.initData(oController);
		
	},
	/*
	 *  진행상태에 따라 버튼의 활성화 여부를 설정
	 */
	initControl : function(oController){
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title"); 
		var oAddPersonbtn = sap.ui.getCore().byId(oController.PAGEID + "_ADD_PERSON_BTN"); 
		var oDelPersonbtn = sap.ui.getCore().byId(oController.PAGEID + "_DEL_PERSON_BTN");
		var oSavebtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		var oPreviewbtn = sap.ui.getCore().byId(oController.PAGEID + "_PREVIEW_BTN");
		var oRequestbtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		var oDeletebtn = sap.ui.getCore().byId(oController.PAGEID + "_DELETE_BTN");
		var oApprovalPanel = sap.ui.getCore().byId(oController.PAGEID + "_APPROVAL_PANEL");
		var oNotet = sap.ui.getCore().byId(oController.PAGEID + "_Notet");
		var oNoteb = sap.ui.getCore().byId(oController.PAGEID + "_Noteb");
		
		
		if( oController._vReqst == "" ||
			oController._vReqst == "10" ){
			oTitle.setEditable(true);
			oAddPersonbtn.setVisible(true);
			oDelPersonbtn.setVisible(true);
			oSavebtn.setVisible(true);
			oNotet.setEnabled(true);
			oNoteb.setEnabled(true);
			if(oController._vReqst == ""){
				oPreviewbtn.setVisible(false);
				oRequestbtn.setVisible(false);
				oDeletebtn.setVisible(false);
				oApprovalPanel.setVisible(false);
			}else{
				oPreviewbtn.setVisible(true);
				oRequestbtn.setVisible(true);
				oDeletebtn.setVisible(true);
				oApprovalPanel.setVisible(true);
			}
		}else{
			oTitle.setEditable(false);
			oAddPersonbtn.setVisible(false);
			oDelPersonbtn.setVisible(false);
			oSavebtn.setVisible(false);
			oPreviewbtn.setVisible(false);
			oRequestbtn.setVisible(false);
			oDeletebtn.setVisible(false);
			oApprovalPanel.setVisible(true);
			oNotet.setEnabled(false);
			oNoteb.setEnabled(false);
		}
	},
	
	initData : function(oController){
		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
		var vCertiFee = {CertiFeeSet : []}; 
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
		var oModel = sap.ui.getCore().getModel("ZHRXX_CERTI_SRV");
		
		if(oController._vReqst == "" ){
			if(oController.FromPageType == "F"){
				// 초기화
				mCertiFee.setData(vCertiFee);
			}
		}else if(oController._vReqst != "" && oController._vAppno2 != "" ){
			if(oController.FromPageType == "F"){
				var filterString = "/CertiFeeSet/?$filter=Appno2%20eq%20%27" + oController._vAppno2 +"%27";
				filterString += "%20and%20";
				filterString += "Actty%20eq%20%27" + "H" +"%27";
				oModel.read(filterString,
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									vCertiFee.CertiFeeSet.push(oData.results[i]);
								}
								mCertiFee.setData(vCertiFee);
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
			}
			
			// Ess 지원 신청 상세 내역을 조회하기 위한 index 추가
			var CertiFeeData = mCertiFee.getProperty("/CertiFeeSet");
			vCertiFee = {CertiFeeSet : []}; 
			for(var i = 0; i <CertiFeeData.length ; i++){
				CertiFeeData[i].Index = i ;
				vCertiFee.CertiFeeSet.push(CertiFeeData[i]);
			}
			mCertiFee.setData(vCertiFee);
		}		
		oTable.setModel(mCertiFee);
		oTable.bindItems("/CertiFeeSet", oColumnList);
		
		oController.onSetCntandSum(oController);
	},
	
	onSetCntandSum : function(oController){
		// 지원 건수와 지원 금액 Set 
		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
		var CertiFeeData = mCertiFee.getProperty("/CertiFeeSet");
		var cnt = 0 , sum = 0; 
		var oSupportCnt = sap.ui.getCore().byId(oController.PAGEID + "_SUPPORT_CNT");
		var oSupportSum = sap.ui.getCore().byId(oController.PAGEID + "_SUPPORT_SUM");
		
		cnt = CertiFeeData.length ;
		for(var i=0; i< CertiFeeData.length ; i++){
			sum += parseInt(CertiFeeData[i].Ctcfe) ;
			sum += parseInt(CertiFeeData[i].Ainct);
		}
		oSupportCnt.setText( cnt + " " + oBundleText.getText("APPLY_CNT") );
		oSupportSum.setText( oController.comma(sum) + " 원" );
	},
	
	
	onSelectRow : function(oEvent) {
		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
		var vContext = {};
		var oContext = oEvent.getSource().getBindingContext();
		vContext = mCertiFee.getProperty(oContext.sPath);
		
		if(vContext == null || vContext == {}){
			return ;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_certi_support.CertiSupportRequest",
		      data : {
		    	  Contexts : vContext,
		    	  Appno : vContext.Appno,
		    	  FromPageId : "zui5_hrxx_actcertisupport.RequestManagement"
		      }
		});
	},
	
	onPressPreview : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
		var oController = oView.getController();

		if(!oController._PreviewDialog) {
			oController._PreviewDialog = sap.ui.jsfragment("zui5_hrxx_actcertisupport.fragment.RequestPreview", oController);
			oView.addDependent(oController._PreviewDialog);
		}
		oController._PreviewDialog.open();
	
	},
	
	onBeforeOpenHtmlDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
		var oController = oView.getController();
		var oHTMLPanel = sap.ui.getCore().byId(oController.PAGEID + "_LAP_HtmlPanel");
		var tHtml = oController.makeEmailHtml(oEvent);
		var oHtml = new sap.ui.core.HTML({preferDOM : true, sanitizeContent : false});
	
		oHTMLPanel.removeAllContent();
		oHTMLPanel.destroyContent();
		oHtml.setContent(tHtml);
		oHTMLPanel.addContent(oHtml);
	
	},
	
	makeEmailHtml : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
		var oController = oView.getController();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
		var vCertiFee = mCertiFee.getProperty("/CertiFeeSet");
		var vPersa = "";

		vPersa = oController._vPersa;
		var data_start = "[DATA_START]";
		var data_end = "[DATA_END]";
		var infra_label_start = "[INFRA_LABEL_START]";
		var infra_label_end = "[INFRA_LABEL_END]";
		var infra_data_start = "[INFRA_DATA_START]";
		var infra_data_end = "[INFRA_DATA_END]";
		var infra_data_start2 = "[INFRA_DATA_START2]";
		var infra_data_end2 = "[INFRA_DATA_END2]";
		var html_url ;
		html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/supportrequest_email.html";		
		
		var tHtml = "";
		var request = $.ajax({ 
			  url: html_url,
			  cache: false,
			  async: false
		});
		
		request.done(function( html ) {
			tHtml = html;
		});
			 
		request.fail(function( jqXHR, textStatus ) {
			
		});
		
		if(tHtml == "") {
			common.Common.showErrorMessage(oBundleText.getText("NO_HTML_FILE"));
			return "";
		}
		var data_html = tHtml.substring(tHtml.indexOf(data_start) + data_start.length, tHtml.indexOf(data_end));
		var infra_label_html = tHtml.substring(tHtml.indexOf(infra_label_start) + infra_label_start.length, tHtml.indexOf(infra_label_end));
		var infra_data_html = tHtml.substring(tHtml.indexOf(infra_data_start) + infra_data_start.length, tHtml.indexOf(infra_data_end));
		var infra_data_html2 = tHtml.substring(tHtml.indexOf(infra_data_start2) + infra_data_start2.length, tHtml.indexOf(infra_data_end2));
		var vCtbeg = ""; 
		var item_data = "";
		var infra_item_data = "";
		var tmp_item_html ="";
		var item_replace = "";
		tHtml = tHtml.replace("[ITEM_LABEL1]", oBundleText.getText("NUMBER_2"));
		tHtml = tHtml.replace("[ITEM_LABEL2]", oBundleText.getText("PERNR"));
		tHtml = tHtml.replace("[ITEM_LABEL3]", oBundleText.getText("ENAME"));
		tHtml = tHtml.replace("[ITEM_LABEL4]", oBundleText.getText("QUALI_PROOF"));
		tHtml = tHtml.replace("[ITEM_LABEL5]", oBundleText.getText("ISAUT"));
		tHtml = tHtml.replace("[ITEM_LABEL6]", oBundleText.getText("CERDA"));
		tHtml = tHtml.replace("[ITEM_LABEL7]", oBundleText.getText("CTCFE"));
		if(vPersa == "7700"){
			tmp_item_html = infra_label_html ;
			tmp_item_html = tmp_item_html.replace("[ITEM_LABEL8]", oBundleText.getText("AINCT"));
			item_data += tmp_item_html;
		}
		item_replace = tHtml.substring(tHtml.indexOf(infra_label_start), tHtml.indexOf(infra_label_end) + infra_label_end.length);
		tHtml = tHtml.replace(item_replace, item_data);
		tHtml = tHtml.replace("[ITEM_LABEL9]", oBundleText.getText("TOTAL_SUPPORT_FUND"));
		
		item_data = "";
		tmp_item_html ="";
		item_replace = "";
		var tmp_infra_html = "";
		var vAinct ;
		var vTotal_Price = 0;
	    var vTotal_support_price = 0;
	    var item_cnt = vCertiFee.length ;
		for(var i=0 ; i< item_cnt ; i++ ) {
			tmp_item_html = data_html;
			tmp_item_html = tmp_item_html.replace("[ITEM_DATA1]", i+1);
			tmp_item_html = tmp_item_html.replace("[ITEM_DATA2]", vCertiFee[i].Rpers);
			tmp_item_html = tmp_item_html.replace("[ITEM_DATA3]", vCertiFee[i].Rpern);
			tmp_item_html = tmp_item_html.replace("[ITEM_DATA4]", vCertiFee[i].Cttyptx);
			tmp_item_html = tmp_item_html.replace("[ITEM_DATA5]", vCertiFee[i].Isaut);
			vCtbeg = "";
			if ( vCertiFee[i].Ctbeg != null &&  vCertiFee[i].Ctbeg){
				vCtbeg = dateFormat.format(new Date(common.Common.setTime(new Date(vCertiFee[i].Ctbeg))));
			}
			tmp_item_html = tmp_item_html.replace("[ITEM_DATA6]", vCtbeg);
			tmp_item_html = tmp_item_html.replace("[ITEM_DATA7]", oController.comma(vCertiFee[i].Ctcfe));
			infra_item_data ="";
			vTotal_Price = 0;
			if(vPersa == "7700"){
				tmp_infra_html = infra_data_html ;
				if(vCertiFee[i].Ainct != "" && vCertiFee[i].Ainct > 0 ){
					vAinct = oController.comma(vCertiFee[i].Ainct);
					vTotal_Price = parseInt(vCertiFee[i].Ainct);
				}else{
					vAinct = '-';
				}
				tmp_infra_html = tmp_infra_html.replace("[ITEM_DATA8]", vAinct);
				infra_item_data += tmp_infra_html;
			}
			item_replace = tmp_item_html.substring(tmp_item_html.indexOf(infra_data_start), tmp_item_html.indexOf(infra_data_end) + infra_data_end.length);
			tmp_item_html = tmp_item_html.replace(item_replace, infra_item_data);
			
			if(vCertiFee[i].Ctcfe != "" && vCertiFee[i].Ctcfe > 0 ){
				vTotal_Price += parseInt(vCertiFee[i].Ctcfe);
			}
			tmp_item_html = tmp_item_html.replace("[ITEM_DATA9]", oController.comma(vTotal_Price));
			vTotal_support_price += vTotal_Price ;
			item_data += tmp_item_html;
		}
		item_replace = tHtml.substring(tHtml.indexOf(data_start), tHtml.indexOf(data_end) + data_end.length);
		tHtml = tHtml.replace(item_replace, item_data);
		
		tmp_infra_data = "";
		if(vPersa == "7700"){
			tmp_infra_data = infra_data_html2 ;
		}
		item_replace = tHtml.substring(tHtml.indexOf(infra_data_start2), tHtml.indexOf(infra_data_end2) + infra_data_end2.length);
		tHtml = tHtml.replace(item_replace, tmp_infra_data);
		tHtml = tHtml.replace("[ITEM_DATA10]", oController.comma(vTotal_support_price));
		
		var oNotet = sap.ui.getCore().byId(oController.PAGEID + "_Notet"); 
		var oNoteb = sap.ui.getCore().byId(oController.PAGEID + "_Noteb");
		
		tHtml = tHtml.replace("[CONTST]", oNotet.getValue()); 
		tHtml = tHtml.replace("[CONTSB]", oNoteb.getValue()); 
		
		return tHtml;
		
		
	} , 
	
	onPressDelete : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHRXX_CERTI_SRV");
		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
		var vCertiFee = mCertiFee.getProperty("/CertiFeeSet");
		var process_result = false;
		
		var onProcessing = function(){
		
			if(!oController.BusyDialog) {			
				oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETING_WAIT")}));
				oController.getView().addDependent(oController.BusyDialog);
			}else{
				oController.BusyDialog.removeAllContent();
				oController.BusyDialog.destroyContent();
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETING_WAIT")}));
			}
			if(!oController.BusyDialog.isOpen()) {
				oController.BusyDialog.open();
			}
			
			oModel.remove(
					"/CertiFeeSupportSet(Appno='" + oController._vAppno2 +"')",
					null,
				    function (oData, response) {
						process_result = true;
				    },
				    function (oError) {
				    	var Err = {};
				    	if(oError.response) {
					        Err = window.JSON.parse(oError.response.body);
					        common.Common.showErrorMessage(Err.error.message.value);
				    	} else {
				    		common.Common.showErrorMessage(rError2);
				    	}
				    	rError = oError;
				    }
			);
			
			if(!process_result ){
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
			}
			if( process_result ){ 
				var updateData = {};
				updateData.Actty = "H";
				updateData.Appno2 =  oController._vAppno2;
					// key 를 무조건 입력 
				var oPath = "(Appno='" + "0000000000" + "')";
				
				oModel.create(
						"/CertiFeeSet", 
						updateData ,
						null,
						function(oData, oResponse) {
							process_result = true;
						},
					    function (oError) {
					    	var Err = {};
							var ErrMsg = "";
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
								else ErrMsg = Err.error.message.value;
							} else {
								ErrMsg = oError.toString();
							}
							common.Common.showErrorMessage(ErrMsg);
							return;
						}
				);	
			}
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			if(process_result){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
				 	icon: sap.m.MessageBox.Icon.INFORMATION,
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.navToBack();
					}
				});
			}
		};
		
		sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("PROJECT_STATUS_D"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: function(oAction){
	        	if(oAction === sap.m.MessageBox.Action.YES ) {
	        		onProcessing() ;
	        	}
	        }
		});
	},
//	onPressDelete : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
//		var oController = oView.getController();
//		var oModel = sap.ui.getCore().getModel("ZHRXX_CERTI_SRV");
//		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
//		var vCertiFee = mCertiFee.getProperty("/CertiFeeSet");
//		var process_result = false;
//		
//		var onProcessing = function(){
//		
//			if(!oController.BusyDialog) {			
//				oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
//				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETING_WAIT")}));
//				oController.getView().addDependent(oController.BusyDialog);
//			}else{
//				oController.BusyDialog.removeAllContent();
//				oController.BusyDialog.destroyContent();
//				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETING_WAIT")}));
//			}
//			if(!oController.BusyDialog.isOpen()) {
//				oController.BusyDialog.open();
//			}
//			
//			oModel.remove(
//					"/CertiFeeSupportSet(Appno='" + oController._vAppno2 +"')",
//					null,
//				    function (oData, response) {
//						process_result = true;
//				    },
//				    function (oError) {
//				    	var Err = {};
//				    	if(oError.response) {
//					        Err = window.JSON.parse(oError.response.body);
//					        common.Common.showErrorMessage(Err.error.message.value);
//				    	} else {
//				    		common.Common.showErrorMessage(rError2);
//				    	}
//				    	rError = oError;
//				    }
//			);
//			
//			if(!process_result ){
//				if(oController.BusyDialog.isOpen()) {
//					oController.BusyDialog.close();
//				}
//			}
//			if( process_result ){ 
//				var updateData = {};
//				updateData.Actty = "H";
//				updateData.Appno2 =  oController._vAppno2;
//					// key 를 무조건 입력 
//				var oPath = "(Appno='" + "0000000000" + "')";
//				oModel.update(
//						"/CertiFeeSet"+oPath, 
//						updateData ,
//						null,
//						function(oData, oResponse) {
//							process_result = true;
//						},
//					    function (oError) {
//							process_result = false;
//					    	var Err = {};
//							var ErrMsg = "";
//							if (oError.response) {
//								Err = window.JSON.parse(oError.response.body);
//								var msg1 = Err.error.innererror.errordetails;
//								if(msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
//								else ErrMsg = Err.error.message.value;
//							} else {
//								ErrMsg = oError.toString();
//							}
//							
//							common.Common.showErrorMessage(ErrMsg);
//							return;
//						}
//				);	
//			}
//			if(oController.BusyDialog.isOpen()) {
//				oController.BusyDialog.close();
//			}
//			if(process_result){
//				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
//				 	icon: sap.m.MessageBox.Icon.INFORMATION,
//					title: oBundleText.getText("INFORMATION"),
//					onClose : function() {
//						oController.navToBack();
//					}
//				});
//			}
//		};
//		
//		sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_CONFIRM"), {
//			icon: sap.m.MessageBox.Icon.INFORMATION,
//			title: oBundleText.getText("PROJECT_STATUS_D"),
//			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
//	        onClose: function(oAction){
//	        	if(oAction === sap.m.MessageBox.Action.YES ) {
//	        		onProcessing() ;
//	        	}
//	        }
//		});
//	},
	
	// 금액에 콤마를 찍는 함수
	comma : function(n) { 
	    return (!n||n==Infinity||n=='NaN')?0:String(n).replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,'); 
	} ,
	
	// 금액에 콤마를 지우고 숫자만 돌려받는 함수
	getNumber : function(data) { 
	    return data.replace(/[^0-9]/g,"") || 0; 
	},
	
	onAAPClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
		var oController = oView.getController();
		
		if(oController._PreviewDialog && oController._PreviewDialog.isOpen()) {
			oController._PreviewDialog.close();
		}
	},
	
	onPressAddPerson : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			  id : "zui5_hrxx_actcertisupport.SelectPerson",
		      data : {
		    	  
		      }
		});
	},
	
	onPressDelPerson : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var vAppno = "";
		var vCompareResult = true;
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_SELECT_PERSON"));
			return ;
		}
		
		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
		var vCertiFee = mCertiFee.getProperty("/CertiFeeSet");
		var vCertiFee2 = {CertiFeeSet : []}; 
		
		for(var i = 0; i < vCertiFee.length ; i++){
			vAppno = vCertiFee[i].Appno;
			vCompareResult = true;
			for(var j = 0; j < vContexts.length ; j++){
				if(vAppno == vContexts[j].getProperty("Appno")){
					vCompareResult = false;
					break;
				}
			}
			if(vCompareResult == true){
				var temp_data = {};
				temp_data = vCertiFee[i];
				vCertiFee2.CertiFeeSet.push(temp_data);
			}
		}
		mCertiFee.setData(vCertiFee2);
		oTable.removeSelections(true);
		
		oController.onSetCntandSum(oController);
	},
	
	onPressSave : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.RequestManagement");
		var oController = oView.getController();		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var oAppld = sap.ui.getCore().byId( oController.PAGEID + "_APPLD");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title"); 
		var oApprovalPanel = sap.ui.getCore().byId(oController.PAGEID + "_APPROVAL_PANEL");
		var oNotet = sap.ui.getCore().byId(oController.PAGEID + "_Notet"); 
		var oNoteb = sap.ui.getCore().byId(oController.PAGEID + "_Noteb"); 
		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
		var vCertiFee = mCertiFee.getProperty("/CertiFeeSet");
		var process_result = false;
		var oControl = this;
		var oCustomData = oControl.getCustomData();
		var vReqst =  oCustomData[0].getValue();
		var controlData = {};
		var vUrl = "";
		if(oTitle.getValue() == "" || oTitle.getValue() == null){
			common.Common.showErrorMessage(oBundleText.getText("MSG_INPUT_HRDOC_TITLE"));
			return;
		}
		// 결재 상신일 경우에만 list 에 대상자 여부를 체크 한다.
		if(vCertiFee.length < 1 && vReqst == "20"){
			common.Common.showErrorMessage(oBundleText.getText("MSG_SUPPORT_NOPERSON"));
			return;
		}
		
		var SaveProcess = function(){
			controlData.Title = oTitle.getValue();
			controlData.Reqst = vReqst ;
			if(oApprovalPanel.getVisible()){
				controlData.ContsT = oNotet.getValue();
				controlData.ContsB = oNoteb.getValue();			
			}
			if(oController._vAppno2 != "") controlData.Appno = oController._vAppno2 ; 
			if(vReqst == "20"){
				controlData.Html = oController.makeEmailHtml();
			}
			
			var oModel = sap.ui.getCore().getModel("ZHRXX_CERTI_SRV");
			oModel.create(
					"/CertiFeeSupportSet", 
					controlData ,
					null,
					function(oData, oResponse) {
						oController._vAppno2 = oData.Appno;
						oController._vReqst = controlData.Reqst;
						vUrl = oData.Url ;
						if(oData.Appld == "" || oData.Appld == null ){
							oAppld.setText("");
						}else{
							oAppld.setText(dateFormat.format(new Date(common.Common.setTime(new Date(oData.Appld)))));
						}
						process_result = true;
					},
				    function (oError) {
				    	var Err = {};
						var ErrMsg = "";
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
							else ErrMsg = Err.error.message.value;
						} else {
							ErrMsg = oError.toString();
						}
						common.Common.showErrorMessage(ErrMsg);
						return;
					}
			);	
			if(!process_result) {
				if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				return;
			}
			
			if(oController._vAppno2 != "" && vReqst == "10"){
				process_result = false;
				// 진도 코드 update
				controlData = {};
				controlData.Reqst = vReqst;
				controlData.Actty = "H" ;
				controlData.Appno2 = oController._vAppno2 ;
				for(var i = 0; i< vCertiFee.length ; i++ ){
					if(i == 0) controlData.Pernrl = vCertiFee[i].Appno ;
					else controlData.Pernrl += "|" + vCertiFee[i].Appno ;
				}
				oModel.create(
						"/CertiFeeSet", 
						controlData ,
						null,
						function(oData, oResponse) {
							process_result = true;
						},
					    function (oError) {
					    	var Err = {};
							var ErrMsg = "";
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
								else ErrMsg = Err.error.message.value;
							} else {
								ErrMsg = oError.toString();
							}
							common.Common.showErrorMessage(ErrMsg);
							return;
						}
				);	
			}
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(process_result && vReqst == "10"){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.onPressSearch();
					}
				});
			}else if(process_result && vReqst == "20"){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_REQUEST_SUPPORT_COMPLETE"), {
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.onOpenUrl(vUrl);
						oController.navToBack();
					}
				});
			}
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			if(vReqst == "10")
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SAVING_WAIT")}));
			if(vReqst == "20")
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_REQUEST_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			if(vReqst == "10")
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SAVING_WAIT")}));
			if(vReqst == "20")
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_REQUEST_WAIT")}));
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(SaveProcess, 300);
		
	},
	
	onOpenUrl : function(vDocUri){
		if(vDocUri == "") return ;
		var newwindow = window.open(vDocUri, 'SettleDoc', 'height=500,width=850');
		if(window.focus) { newwindow.focus(); }
		
	},
	
	navToBack : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			  id : "zui5_hrxx_actcertisupport.FeeManagement",
		      data : {
		    	  
		      }
		});
	},
});