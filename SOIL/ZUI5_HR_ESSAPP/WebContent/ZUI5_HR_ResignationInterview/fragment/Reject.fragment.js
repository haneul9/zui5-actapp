sap.ui.jsfragment("ZUI5_HR_ResignationInterview.fragment.Reject", {
	
	createContent : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					// 반려 사유
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0387"), 	// 387:반려 사유
							required : true
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Mgrwd}",
							width : "98%",
							editable : true
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixData")
				]
			})
		];
		
		var oRejectDialog = new sap.m.Dialog(oController.PAGEID + "_RejectDialog", {
			title : oBundleText.getText("LABEL_0024"),	// 24:반려
			showHeader : true,
			contentWidth : "600px",
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 2,
					widths : ['30%', '70%'],
					rows : aRows
				})
			],
			beginButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0395"), 	// 395:확인
				press : function(oEvent){
					oController.onRejectProcess(oController);
				}
			}),
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0017"),  // 17:닫기
				press : function(oEvent){
					oRejectDialog.close();
					oController.BusyDialog.close();
				}
			})
		});
		
		oRejectDialog
			.setModel(oController._DetailJSonModel)
			.bindElement("/Data")
			.addStyleClass("sapUiSizeCompact");
		
		return oRejectDialog;
		
	}
	
});