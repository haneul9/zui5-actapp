jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.AttachPicFileAction");

sap.ui.controller("zui5_hrxx_photoup.PhotoUpload", {
	PAGEID : "PhotoUpload",
	
	//Language 및 Properties를 가져온다.
	oBundleText : jQuery.sap.resources({
		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_photoup.PhotoUpload
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
			
		});  
	},
	
	onBeforeShow : function(oEvent) {
		if(oEvent) {
			common.AttachPicFileAction.oController = this;
		}
	}, 
	
	onAfterShow : function(oEvent){
		this.UploadExecute(oEvent);
	},
	
	StatusColor : function(fVal) {
		if (fVal == "S") {
			return "#1DDB16";
		} else if(fVal == "E"){
			return "#FF0000";
		}
	},
		
	UploadExecute : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_photoup.PhotoUpload");
		var oController = oView.getController();
		$("#" + oController.PAGEID + "_ATTACHFILE_BTN-fu").trigger('click');
	},

	onPressFilter : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_photoup.PhotoUpload");
		var oController = oView.getController();		
		
		if(!oController._FilterDialog) {
			oController._FilterDialog = sap.ui.jsfragment("zui5_hrxx_photoup.fragment.FilterinSearchResult", oController);
			oView.addDependent(oController._FilterDialog);
		}
		
		oController._FilterDialog.open();
		
	},
	
	onPressOK : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_photoup.PhotoUpload");
		var oController = oView.getController();
		
		var oFilters = [];
		
//		for(var i=1; i<4; i++) {
//			var oColumn = sap.ui.getCore().byId (oController.PAGEID + "_FSR_Column" + i);
//			var oValue = sap.ui.getCore().byId(oController.PAGEID + "_FSR_Value" + i);
//			
//			if(oValue.getSelectedKey() != "") {
//				oFilters.push(new sap.ui.model.Filter(oColumn.getSelectedKey(), sap.ui.model.FilterOperator.Contains, oValue.getSelectedKey()));
//			}
//		}
		
		var oColumn = sap.ui.getCore().byId(oController.PAGEID + "_FSR_Column1");
		
		if(oColumn.getSelectedKey() != "0") {
			oFilters.push(new sap.ui.model.Filter("Mtype", "EQ", oColumn.getSelectedKey()));
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");		
		console.log(oFilters);
		var oBinding = oTable.getBinding("items");
		oBinding.filter(oFilters);
		
		oController.onFSRClose();
	},
	
	onFSRClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_photoup.PhotoUpload");
		var oController = oView.getController();
		
		if(oController._FilterDialog.isOpen()) {
			oController._FilterDialog.close();
		}
	},
	
	downloadExcel : sap.m.Table.prototype.exportData || function(oEvent) {
		jQuery.sap.require("sap.ui.core.util.Export");
		jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
		
		var mPhotoUploadResult = sap.ui.getCore().getModel("PhotoUploadResult");
//		var mPhotoUploadResult = sap.ui.getCore().getModel("ZHRXX_EMP_PHOTO_SRV");
		
		var oExport = new sap.ui.core.util.Export({
			exportType : new sap.ui.core.util.ExportTypeCSV(), //new sap.ui.core.util.ExportType({fileExtension : "xls", mimeType : "application/xls"}),//
			models : mPhotoUploadResult,
			rows : { path : "/PhotoUploadResultSet" }
		});
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  //상태
			name : oBundleText.getText("MTYPE"),
			template : {content : {path : "Mtype"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // No.
			name : oBundleText.getText("NUMBER_2"),
			template : {content : {path : "Numbr"}}
		}));
		
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 사진
			name : oBundleText.getText("PIURL"),
			template : {content : {path : "Piurl"}}
		}));

		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 사번
			name : oBundleText.getText("PERNR"),
			template : {content : {path : "Pernr"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 이름
			name : oBundleText.getText("ENAME_2"),
			template : {content : {path : "Ename"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 인사영역
			name : oBundleText.getText("PBTXT"),
			template : {content : {path : "Pbtxt"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 소속부서
			name : oBundleText.getText("ORGTX_2"),
			template : {content : {path : "Orgtx"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 파일명
			name : oBundleText.getText("FILENAME"),
			template : {content : {path : "Filename"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 처리결과
			name : oBundleText.getText("MSG"),
			template : {content : {path : "Msg"}}
		}));
		
	    // download exported file
	    oExport.saveFile().always(function() {
	      this.destroy();
	    });
		
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_photoup.PhotoUpload
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_photoup.PhotoUpload
*/
//	onAfterRendering: function() {
//	},
	

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_photoup.PhotoUpload
*/
//	onExit: function() {
//
//	}

});