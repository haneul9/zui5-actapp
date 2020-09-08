sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", {

	createContent : function(oController) {	
		
		jQuery.sap.require("common.AttachFileAction");
		jQuery.sap.require("sap.ui.unified.FileUploader");
		jQuery.sap.require("control.ODataFileUploader");
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name : oController.PAGEID + "UploadFile",
			modelName : "ZL2P01GW0001_SRV",
			slug : "",
			maximumFileSize: 10,
			multiple : true,
			width : "300px",
			uploadOnChange: false,
			mimeType: [], //["image","text","application"],
			fileType: [],
			buttonText : oBundleText.getText("FILE_BTN"),
			icon : "sap-icon://attachment",
			buttonOnly : false,
			//uploadUrl : "/sap/opu/odata/sap/ZL2P01GW0001_SRV/FileSet/",
			uploadComplete: common.AttachFileAction.uploadComplete,
			uploadAborted : common.AttachFileAction.uploadAborted,
			fileSizeExceed: common.AttachFileAction.fileSizeExceed,
			typeMissmatch: common.AttachFileAction.typeMissmatch,
			change : common.AttachFileAction.onFileChange
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
		
		oAttachFileList.setModel(sap.ui.getCore().getModel("ZL2P01GW9000_SRV"));
		
		var oAttachingFileList = new sap.m.List(oController.PAGEID + "_CAF_List", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData : false,
		});
		
		var oAttachFilePanel = new sap.m.Panel(oController.PAGEID + "_ATTACHFILE_PANEL", {
			visible : true,
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
//				           new sap.ui.core.Icon({src : "sap-icon://excel-attachment", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ATTACHFILE"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width : "10px"}),
//		                   new sap.m.Label({text : oBundleText.getText("MSG_FILEHELP")}).addStyleClass("L2PHelpfont12"),
		                   new sap.m.ToolbarSpacer(),
		                   oFileUploader,
		                   new sap.m.Button(oController.PAGEID + "_ATTACHFILE_DELETE_BTN", {
		                	   text : oBundleText.getText("TITLE_FILE_DELETE"), 
		                	   icon : "sap-icon://delete", press : common.AttachFileAction.onDeleteAttachFile})
				           ]
			}),
			content : [oAttachFileList]
		});
		
		return oAttachFilePanel;
	}

});