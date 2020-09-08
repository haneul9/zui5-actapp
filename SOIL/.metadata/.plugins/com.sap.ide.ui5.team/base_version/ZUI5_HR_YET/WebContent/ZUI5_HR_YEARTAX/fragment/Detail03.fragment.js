sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail03", {
	/** 국세청자료 **/
	createContent : function(oController) {
		jQuery.sap.require("sap.ui.unified.FileUploader");
		jQuery.sap.require("control.ODataFileUploader");
		jQuery.sap.require("common.YeaAttachFileAction");
		
		var oFileUploader = new control.ODataFileUploader("yeaUploader", {
			name : "upload2",
			modelName : "ZHR_YEARTAX_SRV",
			slug : "",
			maximumFileSize: 3,
			multiple : false,
			width : "80%",
			uploadOnChange: true,
	//		mimeType: "application",
			fileType: ["pdf"],
			buttonText : "첨부파일",
			uploadUrl : "/sap/opu/odata/sap/ZHR_YEARTAX_SRV/YeartaxFile/",
			uploadComplete: common.YeaAttachFileAction.uploadComplete,
			uploadAborted : common.YeaAttachFileAction.uploadAborted,
			fileSizeExceed: common.YeaAttachFileAction.fileSizeExceed,
			typeMissmatch: common.YeaAttachFileAction.typeMissmatch,
			change : common.YeaAttachFileAction.onFileChange
		});
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["90%", "10%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.ui.layout.HorizontalLayout({
													allowWrapping : true,
													content : [
														new sap.m.Link({
															text : {
																parts : [{path : "Fname"}, {path : "Ftype"}],
																formatter : function(fVal1, fVal2) {
																	return "첨부파일 : " + decodeURI(fVal1) + "." + decodeURI(fVal2).toLowerCase();
																}
															},
															press : oController.onDownloadAttachFile,
														}).addStyleClass("Font14 helpText PaddingRight10 PaddingTop1"),
														new sap.ui.commons.Button("yeaUploader_AttachFileDelete", {
															text : "파일삭제",
															icon : "sap-icon://delete",
															press : common.YeaAttachFileAction.onDeleteAttachFile,
															visible : {
																parts : [{path : "Fname"}, {path : "Ftype"}],
																formatter : function(fVal1, fVal2) {
																	if(fVal1 && fVal2) return true;
																	else return false;
																}
															}
														})
													]
												})]
								 })]
					})]
		});
		
		var oAttachFileInfo = new sap.m.CustomListItem("yeaUploader_AttachFileInfo",{			
			content : [oMatrix]
		});
		
		var oAttachFileList = new sap.m.List("yeaUploader_AttachFileList", {
			showSeparators : sap.m.ListSeparators.None,
			showNoData : false,
			updateFinished : oController.onSetView,
			width : "80%"
		});
		
		oAttachFileList.setModel(sap.ui.getCore().getModel("ZHR_YEARTAX_SRV"));
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			content : [new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
					   new sap.ui.layout.HorizontalLayout({
						   content : [new sap.ui.core.Icon({src : "sap-icon://message-information", color : "#0a6ed1", size : "17px"}).addStyleClass("PaddingTop1 PaddingRight10"),
							   		  new sap.m.Text({text : "국세청 PDF자료 업로드 시 기존에 입력된 데이터가 삭제될 수 있습니다." +
							   		  						 "\n국세청 PDF자료는 한 개의 파일만 업로드 할 수 있습니다. 국세청 홈페이지에서 PDF 다운로드 시 모든 항목을 한 개의 파일로 다운로드하시기 바랍니다."})]
					   }).addStyleClass("MessageStrip_Information")]
		});
		
		var oPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "첨부파일"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [oFileUploader, oAttachFileList, oLayout]
		});
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["2rem", "", "2rem"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oPanel]
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					})]
		});
		
		return oContent;
	}

});
