sap.ui.jsfragment("zui5_hrxx_imagetile.fragment.PasswordChange", {
	
	createContent : function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['5px', '30%','70%','5px']
		});
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : ""
					}).addStyleClass("L2PFontFamily")
				}),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : "◈기존비밀번호"
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input(oController.PAGEID + "_CSecpw",{
						type : sap.m.InputType.Password,
						width : "95%"
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixData"),
			]
		});
		oMatrix.addRow(oRow);
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : ""
					}).addStyleClass("L2PFontFamily")
				}),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : "◈변경할 비밀번호"
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input(oController.PAGEID + "_CSecpw2",{
						type : sap.m.InputType.Password,
						width : "95%"
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixData"),
			]
		});
		oMatrix.addRow(oRow);
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : ""
					}).addStyleClass("L2PFontFamily")
				}),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : "◈변경할 비밀번호확인"
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input(oController.PAGEID + "_CSecpw3",{
						type : sap.m.InputType.Password,
						width : "95%"
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixData"),
			]
		});
		oMatrix.addRow(oRow);
		
		var oDialog = new sap.m.Dialog({
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 5px;'/>"
				}),
				oMatrix,
			],
			contentWidth : "600px",
			showHeader : true,
			title : "비밀번호 변경",
			buttons : [ new sap.m.Button({
							text : "초기화", 
							press : oController.onInitPassword,
							press :  function(oEvent) {
				                oController.onInitPassword(oController, oEvent);
				            },
						}),
						new sap.m.Button({
							text : "저장", 
							press :  function(oEvent) {
				                oController.onChangePassword(oController, oEvent);
				            }, 
						}),
						new sap.m.Button({
							text : "닫기", 
							press : function(oEvent){
								oDialog.close();
							}
						})]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	}
	
});