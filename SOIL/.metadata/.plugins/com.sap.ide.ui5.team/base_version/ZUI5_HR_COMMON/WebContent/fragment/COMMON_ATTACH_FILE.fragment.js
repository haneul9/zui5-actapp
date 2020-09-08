sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", {

	createContent : function(oController) {	
		
		jQuery.sap.require("common.AttachFileAction");
		jQuery.sap.require("sap.ui.unified.FileUploader");
		jQuery.sap.require("control.ODataFileUploader");
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", { //new sap.ui.unified.FileUploader(oController.PAGEID + "_ATTACHFILE_BTN", { //new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name : oController.PAGEID + "_ATTACHFILE_BTN",
			modelName : "ZHR_COMMON_SRV",
			slug : "",
			maximumFileSize: 20,
			multiple : true,
//			width : "300px",
			uploadOnChange: false,
			mimeType: [], //["image","text","application"],
			fileType: ["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf"],
			buttonText : oBundleText.getText("LABEL_1928"),	// 1928:업로드
//			icon : "sap-icon://upload",
			buttonOnly : true,
			//uploadUrl : "/sap/opu/odata/sap/Z01GW0001_SRV/FileSet/",
			uploadComplete: common.AttachFileAction.uploadComplete,
			uploadAborted : common.AttachFileAction.uploadAborted,
			fileSizeExceed: common.AttachFileAction.fileSizeExceed,
			typeMissmatch: common.AttachFileAction.typeMissmatch,
			change : common.AttachFileAction.onFileChange
		});
		
		oFileUploader.addDelegate({
			onAfterRendering: function() {
				$("#" + oController.PAGEID + "_ATTACHFILE_BTN").find('BUTTON > span').removeClass('sapMBtnDefault sapMBtnHoverable').addClass('sapMBtnGhost')
			}
		});
		 
		
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ["5px", "20px", "" , "50px"],
			width : "100%",
			rows : [
				 new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							
						}),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.core.Icon({
								size : "1.0rem",
								src : {path : "Zfiletype",
									formatter : function(fVal) {
										if(common.Common.checkNull(fVal)){
											return "sap-icon://document";
										}else{
											var vTemp = fVal.toUpperCase();
											if(fVal.toUpperCase().indexOf("JPG") != -1  || fVal.toUpperCase().indexOf("JPEG") != -1 ){
												return "sap-icon://card";
											}else if(fVal.toUpperCase().indexOf("PRESENTATION") != -1 || fVal.toUpperCase().indexOf("PPT") != -1 || fVal.toUpperCase().indexOf("PPTX") != -1){
												return "sap-icon://ppt-attachment";
											}else if(fVal.toUpperCase().indexOf("EXCEL") != -1  || fVal.toUpperCase().indexOf("SPREADSHEET") != -1 || fVal.toUpperCase().indexOf("XLS") != -1 || fVal.toUpperCase().indexOf("XLSX") != -1){
												return "sap-icon://excel-attachment";
											}else if(fVal.toUpperCase().indexOf("DOC") != -1 || fVal.toUpperCase().indexOf("WORDPROCESSINGML") != -1 ){
												return "sap-icon://doc-attachment";
											}else if(fVal.toUpperCase().indexOf("PDF") != -1){
												return "sap-icon://pdf-attachment";
											}else{
												return "sap-icon://document";
											}
										}
									}
								},
								color : {
									path : "ZappStatAl",
									formatter : function(fVal){
										console.log(fVal);
//										if(fVal =="" || fVal == "10") return "#0854a0";
//										else return "#6a6d70";
										return "#005f28";
										
									}
								}
							}),
							hAlign : "Begin"
						}),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content :  new sap.m.Toolbar({
//							 	height : "40px",
								design : sap.m.ToolbarDesign.Auto,
								content : [
										   new sap.m.Link({
											    text : "{Zfilename}",
											    href : "{Fileuri}",
											    textAlign : "Begin",
											    target : "_new"
											}).addStyleClass("Font14px FontColor6 PaddingLeft3"),
										   new sap.m.ToolbarSpacer({width: "5px"}),
										   new sap.m.Text({text: "Update by :"}).addStyleClass("Font14px FontColor6"), 
										   new sap.m.Text({text: "{Ename}"}).addStyleClass("Font14px FontColor6"), 
									 	   new sap.m.ToolbarSpacer({width: "5px"}),
									 	   new sap.m.Text({text: "/ Update on :"}).addStyleClass("Font14px FontColor6"), 
									 	   new sap.m.Text({text: "{Aedtm}"}).addStyleClass("Font14px FontColor6"), 
										   new sap.m.ToolbarSpacer({width: "5px"}),
									 	   new sap.m.Text({text: "/ File Size :"}).addStyleClass("Font14px FontColor6"), 
										   new sap.m.Text({text: "{Zfilesize}"}).addStyleClass("Font14px FontColor6"), 
								           ]
							}).addStyleClass("ToolbarNoBottomLine")
						}),
					]
				}), 
			]
		})
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CAF_ColumnList", {
			counter : 10,
			cells : [ 
				oMatrix,
				new sap.m.Button({
					icon : "sap-icon://sys-cancel", 
					type : "Ghost",
					visible : {
						path : "ZappStatAl",
						formatter : function(fVal){
							if(fVal =="" || fVal == "10") return true;
							else return false;
						}
					},
					press : common.AttachFileAction.onDeleteAttachFile2
				}),
				
			]
		});  
		
		var oAttachFileList = new sap.m.Table(oController.PAGEID + "_CAF_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData : true,
			noDataText : " ",
			mode : sap.m.ListMode.MultiSelect,
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_2208")}).addStyleClass("Font14px FontBold FontColor3"),	// 2208:첨부파일
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderLeft",
			        	  minScreenWidth: "tablet"}),
			        	  
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : ""}).addStyleClass("Font14px FontColor6"), 			        	  
			        	  demandPopin: true,
			        	  width : "50px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          ]
		}).addStyleClass("borderTop2");
		
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
//					 	height : "20px",
						design : sap.m.ToolbarDesign.Auto,
						content : [new sap.m.Image({
									src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
								   }),
								   new sap.m.ToolbarSpacer({width: "5px"}),
								   new sap.m.Text({text : oBundleText.getText("LABEL_2157")}).addStyleClass("MiddleTitle"),	// 2157:증빙 첨부
						           new sap.m.ToolbarSpacer({width : "10px"}),
						           new sap.m.MessageStrip({
							    	   text : oBundleText.getText("LABEL_2603"),	// 2603:증빙첨부 파일은 Scan파일 및 사진파일 모두 가능합니다.
						        	   type : "Success",
									   showIcon : false,
									   customIcon : "sap-icon://message-information", 
									   showCloseButton : false,
									   visible : displayYn
						           }),
				                   new sap.m.ToolbarSpacer(),
				                   oFileUploader,
				                   new sap.m.Button(oController.PAGEID + "_ATTACHFILE_DELETE_BTN", {
				                	   text : oBundleText.getText("LABEL_0033"), 	// 33:삭제
//				                	   icon : "sap-icon://delete", 
				                	   type : "Ghost",
				                	   press : common.AttachFileAction.onDeleteAttachFile})
						           ]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), oAttachFileList]
		});
		
		return oAttachFilePanel;
	}

});