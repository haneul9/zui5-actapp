sap.ui.jsfragment("zui5_hrxx_imagetile.fragment.Password", {
	
	createContent : function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['5px', '30%','70%','5px']
		});
		
		var oSecpw = new sap.m.Input(oController.PAGEID + "_Secpw",{
			type : sap.m.InputType.Password,
			width : "95%"
		}).addStyleClass("L2PFontFamily");
		
		
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
						text : "비밀번호"
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
						oSecpw
					]
				}).addStyleClass("L2PMatrixData"),
			]
		});
		oMatrix.addRow(oRow);
		
		var vInfo = "     ► 본 정보는 본인 이외에 접근이 제한되어 있습니다.\n" +
			        "     ► 본인 확인을 위해 비밀번호를 입력하여 주십시오." ;
//			        "         1)비밀번호 초기값 : 주민번호 뒤 7자리\n" +
//		            "         2)비밀번호는 e-HR Main화면(좌 하단 비밀번호 변경)에서 변경 가능합니다.";
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : ""
					}).addStyleClass("L2PFontFamily")
				}),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
					   new sap.m.TextArea({
							value : vInfo ,
							rows : 2 ,
							growing : true,
							editable : false,
							width : "95%"
						}).addStyleClass("L2PFontFamily")
					],
					colSpan : 2,
					hAlign : "Center"
				}).addStyleClass("L2PMatrixData2"),
			],
		
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
//			contentHeight : "200px",
			showHeader : true,
			title : "2차 로그인",
			buttons : [ new sap.m.Button({
							text : "비밀번호 변경", 
							press : function(oEvent) {
				                oController.openPasswordChange(oController, oEvent);
				            },
						}),
						new sap.m.Button({
							text : "로그인", 
							press :  function(oEvent) {
				                oController.onCheckPassword(oController, oEvent);
				            }, 
						}),
						new sap.m.Button({
							text : "닫기", 
							press : function(oEvent){
								oDialog.close();
							}
						}) ]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	}
	
});