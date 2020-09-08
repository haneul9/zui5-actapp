jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actcertisupport.FeeManagement", {
	PAGEID : "FeeManagement",
	
	BusyDialog : null,
	_SortDialog : null,
	
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
				//this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				//common.Common.log("onAfterShow " + new Date());
				this.onBeforeShow(evt);
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
	onBeforeShow: function(evt) {
		this.onPressSearch();
	},
	/* IconTabFilter의 Icon을 선택할 시 발생되는 Event 
	 * Filter를 걸어준다
	 */
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.FeeManagement");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
	    if (sKey === "creation") {
	      oFilters.push(new sap.ui.model.Filter("Reqst", "EQ", "10"));
	    } else if (sKey === "approval") {
	    	oFilters.push(new sap.ui.model.Filter("Reqst", "EQ", "20"));
	    } else if (sKey === "reject") {
	    	oFilters.push(new sap.ui.model.Filter("Reqst", "EQ", "40"));
	    } else if (sKey === "complete") {
	    	oFilters.push(new sap.ui.model.Filter("Reqst", "EQ", "30"));	      
	    }
	    oBinding.filter(oFilters);
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.FeeManagement");
		var oController = oView.getController();

		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterCreate = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CREATE");
		var oFilterApproval = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPROVAL");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
		
		var o_Appld_From = sap.ui.getCore().byId(oController.PAGEID + "_Appld_From");
		var o_Appld_To = sap.ui.getCore().byId(oController.PAGEID + "_Appld_To");
		
		var filterString = "/?$filter=";  
		filterString += "(Appld%20ge%20datetime%27" + o_Appld_From.getValue() + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" + o_Appld_To.getValue() + "T00%3a00%3a00%27)";
		
		
				
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mCertiFeeSupport = sap.ui.getCore().getModel("CertiFeeSupport");
		var vCertiFeeSupport = {CertiFeeSupportSet : []};
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt4 = 0, vReqCnt3 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterCreate.setCount(vReqCnt1);
			oFilterApproval.setCount(vReqCnt2);
			oFilterReject.setCount(vReqCnt4);
			oFilterCompalte.setCount(vReqCnt3);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mCertiFeeSupport);
			oTable.bindItems("/CertiFeeSupportSet", oColumnList);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if (sKey === "creation") {
		      oFilters.push(new sap.ui.model.Filter("Reqst", "EQ", "10"));
		    } else if (sKey === "approval") {
		    	oFilters.push(new sap.ui.model.Filter("Reqst", "EQ", "20"));
		    } else if (sKey === "reject") {
		    	oFilters.push(new sap.ui.model.Filter("Reqst", "EQ", "40"));
		    } else if (sKey === "complete") {
		    	oFilters.push(new sap.ui.model.Filter("Reqst", "EQ", "30"));	      
		    }
		    oBinding.filter(oFilters);
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_CERTI_SRV");
		oModel.read("/CertiFeeSupportSet" + filterString , 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vCertiFeeSupport.CertiFeeSupportSet.push(oData.results[i]);
								if(oData.results[i].Reqst == "10") vReqCnt1++;
								else if(oData.results[i].Reqst == "20") vReqCnt2++;
								else if(oData.results[i].Reqst == "40") vReqCnt4++;
								else if(oData.results[i].Reqst == "30") vReqCnt3++;
							}
							vReqCntAll = oData.results.length;
						}
						mCertiFeeSupport.setData(vCertiFeeSupport);
						readAfterProcess();
					},
					function(oResponse) {
						common.Common.log(oResponse);
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
					}
		);
	},
	
	onPressCreate : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actcertisupport.RequestManagement",
		      data : {
		    	  Appno2 : "",
		    	  Reqst : "",
		    	  FromPageType : "F" ,
		    	  Title : "",
		    	  ContsT : "" , 
		    	  ContsB : "" , 
		      }
		});
	},	
	
	onSelectRow : function(oEvent){
		var oContext = oEvent.getSource().getBindingContext();

		var mCertiFeeSupport = sap.ui.getCore().getModel("CertiFeeSupport");		
		
		var vAppno2 = mCertiFeeSupport.getProperty(oContext + "/Appno");
		var vReqst = mCertiFeeSupport.getProperty(oContext + "/Reqst");
		var vAppld = mCertiFeeSupport.getProperty(oContext + "/Appld");
		var vTitle = mCertiFeeSupport.getProperty(oContext + "/Title");
		var vContsT = mCertiFeeSupport.getProperty(oContext + "/ContsT");
		var vContsB = mCertiFeeSupport.getProperty(oContext + "/ContsB");
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actcertisupport.RequestManagement",
		      data : {
		    	  Appno2 : vAppno2,
		    	  Reqst : vReqst,
		    	  Appld : vAppld,
		    	  FromPageType : "F" ,
		    	  Title : vTitle ,
		    	  ContsT : vContsT , 
		    	  ContsB : vContsB , 
		      }
		});
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.FeeManagement");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actcertisupport.fragment.FeeManagementListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.FeeManagement");
		var oController = oView.getController();	
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oBinding = oTable.getBinding("items");
		
		var mParams = oEvent.getParameters();
		
		var aSorters = [];
	    var sPath = mParams.sortItem.getKey();
	    var bDescending = mParams.sortDescending;
	    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	    oBinding.sort(aSorters);
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.FeeManagement");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
});