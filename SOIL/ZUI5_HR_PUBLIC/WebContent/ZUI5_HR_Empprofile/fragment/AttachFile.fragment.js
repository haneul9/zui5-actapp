sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.AttachFile", {

	createContent : function(oController) {	
		
		jQuery.sap.require("ZUI5_HR_Empprofile.common.AttachFileAction");
		jQuery.sap.require("sap.ui.unified.FileUploader");
		jQuery.sap.require("control.ODataFileUploader");
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", { //new sap.ui.unified.FileUploader(oController.PAGEID + "_ATTACHFILE_BTN", { //new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name : oController.PAGEID + "_ATTACHFILE_BTN",
			modelName : "ZHR_COMMON_SRV",
			slug : "",
			maximumFileSize: 10,
			multiple : true,
//			width : "300px",
			uploadOnChange: false,
			mimeType: [], //["image","text","application"],
			fileType: [],
			buttonText : "업로드",
			icon : "sap-icon://upload",
			buttonOnly : true,
			//uploadUrl : "/sap/opu/odata/sap/ZL2P01GW0001_SRV/FileSet/",
			uploadComplete: ZUI5_HR_Empprofile.common.AttachFileAction.uploadComplete,
			uploadAborted : ZUI5_HR_Empprofile.common.AttachFileAction.uploadAborted,
			fileSizeExceed: ZUI5_HR_Empprofile.common.AttachFileAction.fileSizeExceed,
			typeMissmatch: ZUI5_HR_Empprofile.common.AttachFileAction.typeMissmatch,
			change : ZUI5_HR_Empprofile.common.AttachFileAction.onFileChange
		});
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CAF_ColumnList", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({
			    	text : "{Seqnr}" ,
			    	textAlign : "Begin"
				}).addStyleClass("L2PFontFamily"), 
				new sap.m.Link({
				    text : "{Zfilename}",
				    href : "{Fileuri}",
				    textAlign : "Begin",
				    target : "_new"
				}).addStyleClass("L2PFontFamily")
			]
		});  
		
		var oAttachFileList = new sap.m.Table(oController.PAGEID + "_CAF_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData : true,
			noDataText : "No data found",
			mode : sap.m.ListMode.MultiSelect,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "No."}).addStyleClass("L2PFontFamily"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "50px",
			        	  styleClass : "cellBorderRight cellBorderLeft",
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "첨부파일"}).addStyleClass("L2PFontFamily"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"})
			          ]
		});
		var oJSonModel = new sap.ui.model.json.JSONModel() ;
		var Datas = { Data : []};
		oJSonModel.setData(Datas);
		oAttachFileList.setModel(oJSonModel);
		oAttachFileList.bindItems("/Data", oColumnList);
		
		var displayYn = false;
		if(oController.PAGEID == "ZUI5_HR_ScholarshipDetail") displayYn = true;
		
		var oAttachFilePanel = new sap.m.Panel(oController.PAGEID + "_ATTACHFILE_PANEL", {
			visible : true,
			expandable : false,
			expanded : true,
			content : [   
				 new sap.m.Toolbar({
					 	height : "40px",
						design : sap.m.ToolbarDesign.Auto,
						content : [new sap.ui.core.Icon({
									src: "sap-icon://open-command-field", 
									size : "1.0rem"
								   }),
								   new sap.m.ToolbarSpacer({width: "5px"}),
								   new sap.m.Text({text : "증빙 첨부"}).addStyleClass("L2PFontFamilyBold"),
						           new sap.m.ToolbarSpacer({width : "10px"}),
						           new sap.m.MessageStrip({
							    	   text : "증빙첨부 파일은 Scan파일 및 사진파일 모두 가능합니다.",
						        	   type : "Success",
									   showIcon : false,
									   customIcon : "sap-icon://message-information", 
									   showCloseButton : false,
									   visible : displayYn
						           }),
				                   new sap.m.ToolbarSpacer(),
				                   oFileUploader,
				                   new sap.m.Button({
				                	   text : "삭제", 
				                	   icon : "sap-icon://delete", press : ZUI5_HR_Empprofile.common.AttachFileAction.onDeleteAttachFile})
						           ]
			}).addStyleClass("L2PToolbarNoBottomLine"), oAttachFileList]
		});
		
		return oAttachFilePanel;
	}

});