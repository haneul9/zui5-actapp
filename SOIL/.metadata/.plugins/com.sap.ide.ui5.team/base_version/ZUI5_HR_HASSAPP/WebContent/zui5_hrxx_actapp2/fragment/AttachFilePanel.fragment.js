sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.AttachFilePanel", {

	createContent : function(oController) {	
		
		jQuery.sap.require("zui5_hrxx_actapp2.fragment.AttachFileAction");
		jQuery.sap.require("sap.ui.unified.FileUploader");
		jQuery.sap.require("control.ODataFileUploader");
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name : oController.PAGEID + "UploadFile",
			modelName : "ZL2P01GW0001_SRV",
			slug : "",
			maximumFileSize: 10,
			multiple : false,
			width : "100px",
			uploadOnChange: true,
			mimeType: [],
			fileType: [],
			buttonText : "업로드",
			icon : "sap-icon://upload",
			buttonOnly : true,
			uploadUrl : "/sap/opu/odata/sap/ZL2P01GW0001_SRV/FileSet/",
			uploadComplete: zui5_hrxx_actapp2.fragment.AttachFileAction.uploadComplete,
			uploadAborted : zui5_hrxx_actapp2.fragment.AttachFileAction.uploadAborted,
			fileSizeExceed: zui5_hrxx_actapp2.fragment.AttachFileAction.fileSizeExceed,
			typeMissmatch: zui5_hrxx_actapp2.fragment.AttachFileAction.typeMissmatch,
			change : zui5_hrxx_actapp2.fragment.AttachFileAction.onFileChange
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
			        	  header: new sap.m.Label({text : "첨부파일"}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"})
			          ]
		});
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa));
		oFilters.push(new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vReqno));
		
		oAttachFileList.setModel(sap.ui.getCore().getModel("ZL2P01GW0001_SRV"));
		
		var oAttachFilePanel = new sap.m.Panel(oController.PAGEID + "_ATTACHFILE_PANEL", {
			visible : true,
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://excel-attachment", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "첨부파일", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width : "10px"}),
		                   new sap.m.Label({text : "파일을 클릭하시면 다운로드 할 수 있습니다."}).addStyleClass("L2PHelpfont12"),
		                   new sap.m.ToolbarSpacer(),
		                   oFileUploader,
		                   new sap.m.Button({text : "삭제", icon : "sap-icon://delete", press : zui5_hrxx_actapp2.fragment.AttachFileAction.onDeleteAttachFile})
				           ]
			}),
			content : [oAttachFileList]
		});
		
		return oAttachFilePanel;
	}

});