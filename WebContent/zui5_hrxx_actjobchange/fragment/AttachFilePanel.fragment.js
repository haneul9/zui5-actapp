sap.ui.jsfragment("zui5_hrxx_mat_protection.fragment.AttachFilePanel", {

	createContent : function(oController) {	
		
		jQuery.sap.require("control.ODataFileUploader");
		jQuery.sap.require("zui5_hrxx_mat_protection.fragment.AttachFileAction");
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name : oController.PAGEID + "UploadFile",
			modelName : "ZHRXX_LOA_APPLICATION_SRV",
			slug : "",
			maximumFileSize: 10,
			multiple : true,
			uploadOnChange: false,
			mimeType: [], //["image","text","application"],
			fileType: [],
			buttonText : oBundleText.getText("FILE_BTN"),
			icon : "sap-icon://attachment",
			buttonOnly : true,
			width : "0px",
			uploadComplete: zui5_hrxx_mat_protection.fragment.AttachFileAction.uploadComplete,
			uploadAborted : zui5_hrxx_mat_protection.fragment.AttachFileAction.uploadAborted,
			fileSizeExceed: zui5_hrxx_mat_protection.fragment.AttachFileAction.fileSizeExceed,
			typeMissmatch: zui5_hrxx_mat_protection.fragment.AttachFileAction.typeMissmatch,
			change : zui5_hrxx_mat_protection.fragment.AttachFileAction.onFileChange
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
		}).addStyleClass("L2PBackgroundWhite");
		
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
				           new sap.m.Label({text : oBundleText.getText("ATTACHFILE_MP"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
		                   new sap.m.Text(oController.PAGEID + "_ATTACHFILE_FILELIST", {
		                   }).addStyleClass("L2P13FontShadow"),
		                   oFileUploader,
		                   new sap.m.Button(oController.PAGEID + "_ATTACHFILE_DELETE_BTN", {
		                	   text : oBundleText.getText("DELETE_BTN"), 
		                	   icon : "sap-icon://delete", press : zui5_hrxx_mat_protection.fragment.AttachFileAction.onDeleteAttachFile})
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [
//			           oAttachingFileList, 
			           oAttachFileList]
		});
		
		return oAttachFilePanel;
	}

});