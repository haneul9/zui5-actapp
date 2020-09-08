sap.ui.jsfragment("ZUI5_HR_CommuteRecordGroupMng.fragment.MailForm", {
	
	createContent : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0761"), 	// 761:제목
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "100%",
									value : "{Title}"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2904"), 	// 2904:본문
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "314px",
							content : [ 
								new sap.m.TextArea({
									value : "{Content}",
									height : "314px",
									width : "100%",
									rows : 15,
									growing : false,
									maxLength : 9999
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		var oMailDialog = new sap.m.Dialog(oController.PAGEID + "_MailDialog", {
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_ApplyMatrix", {
					columns : 2,
					widths : ['15%', '85%'],
					rows : aRows
				})
				.setModel(oController._DetailMailJSonModel)
				.bindElement("/Data")
			],
			contentWidth : "900px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2903"),	// 2903:메일발송
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_2905"),	// 2905:발송
				press : function() {
					oController.onSendMail(oController);
				}
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0017"),	// 17:닫기
				press : function() {
					oMailDialog.close();
					oController.BusyDialog.close();
				}
			}),
			beforeOpen : oController.beforeOpenMailDialog
		});
		
		oMailDialog.bindElement("/Data");
		oMailDialog.addStyleClass("sapUiSizeCompact");
		
		return oMailDialog;
		
	}
	
});