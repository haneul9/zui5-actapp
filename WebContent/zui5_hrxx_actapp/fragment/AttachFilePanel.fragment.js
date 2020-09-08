sap.ui.jsfragment("zui5_hrxx_actapp.fragment.AttachFilePanel", {

	createContent : function(oController) {	
		
		jQuery.sap.require("zui5_hrxx_actapp.fragment.AttachFileAction");
		jQuery.sap.require("sap.ui.unified.FileUploader");
		jQuery.sap.require("control.ODataFileUploader");
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name : oController.PAGEID + "UploadFile",
			modelName : "ZHRXX_ACTIONAPP_SRV",
			slug : "",
			maximumFileSize: 10,
			multiple : false,
			width : "100px",
			uploadOnChange: true,
			mimeType: [],
			fileType: [],
			buttonText : oBundleText.getText("UPLOAD_BTN"),
			icon : "sap-icon://upload",
			buttonOnly : true,
			uploadUrl : "/sap/opu/odata/sap/ZHRXX_ACTIONAPP_SRV/FileSet/",
			uploadComplete: zui5_hrxx_actapp.fragment.AttachFileAction.uploadComplete,
			uploadAborted : zui5_hrxx_actapp.fragment.AttachFileAction.uploadAborted,
			fileSizeExceed: zui5_hrxx_actapp.fragment.AttachFileAction.fileSizeExceed,
			typeMissmatch: zui5_hrxx_actapp.fragment.AttachFileAction.typeMissmatch,
			change : zui5_hrxx_actapp.fragment.AttachFileAction.onFileChange
		});
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CAF_ColumnList", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({
			    	text : "{Numbr}"
				}).addStyleClass("L2P13Font"), 
				new sap.m.Link({
				    text : "{Fname}",
				    href : "{Uri}",
				    target : "_new"
				}).addStyleClass("L2P13Font")
			]
		});  
		
		var oAttachFileList = new sap.m.Table(oController.PAGEID + "_CAF_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData : false,
			mode : sap.m.ListMode.MultiSelect,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "No."}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "50px",
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ATTACHFILE")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"})
			          ]
		});
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa));
		oFilters.push(new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vReqno));
		
		oAttachFileList.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"));
		
		var oAttachFilePanel = new sap.m.Panel(oController.PAGEID + "_ATTACHFILE_PANEL", {
			visible : true,
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://excel-attachment", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ATTACHFILE"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width : "10px"}),
		                   new sap.m.Label({text : oBundleText.getText("MSG_FILEHELP")}).addStyleClass("L2PHelpfont12"),
		                   new sap.m.ToolbarSpacer(),
		                   oFileUploader,
		                   new sap.m.Button({text : oBundleText.getText("DELETE_BTN"), icon : "sap-icon://delete", press : zui5_hrxx_actapp.fragment.AttachFileAction.onDeleteAttachFile})
				           ]
			}),
			content : [oAttachFileList]
		});
		
		return oAttachFilePanel;
	}

});