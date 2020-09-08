sap.ui.jsfragment("fragment.Password", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Password");
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['5px', '35%','65%','5px']
		});
		
		var oSecpw = new sap.m.Input(oController.PAGEID + "_Secpw",{
			type : sap.m.InputType.Password,
//			change :  function(oEvent){
//				common.Password.onCheckPassword(oController, oEvent);
//			},
			width : "100%"
		}).addStyleClass("FontFamily");
		
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content :  new sap.m.Button({
						text : "비밀번호 변경", 
						press : function(oEvent) {
							common.Password.openPasswordChange(oController, oEvent);
			            },
					}),
			   	    colSpan : 4,
			   	    hAlign : "End"
				}),
			],
		   
		});
		oMatrix.addRow(oRow);
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : ""
					}).addStyleClass("FontFamily")
				}),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : "비밀번호"
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
						oSecpw
					]
				}).addStyleClass("MatrixData"),
			]
		});
		oMatrix.addRow(oRow);
		
		var vInfo = "     ► 본 정보는 본인 이외에 접근이 제한되어 있습니다.\n" +
			        "     ► 본인 확인을 위해 비밀번호를 입력하여 주십시오.\n" +
			        "         (초기 비밀번호는 주민등록번호 뒷 7자리)";
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : ""
					}).addStyleClass("FontFamily")
				}),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
					   new sap.m.TextArea({
							value : vInfo ,
							rows : 2 ,
							growing : true,
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					],
					colSpan : 2,
					hAlign : "Center"
				}),
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
			showHeader : true,
			title : "2차 로그인",
			buttons : [ 
				new sap.m.Button({
					text : "로그인", 
					press :  function(oEvent) {
		                common.Password.onCheckPassword(oController, oEvent);
		            }, 
				}),
			    new sap.m.Button({
					text : "닫기", 
					press : function(oEvent){
						oDialog.close();
					}
				}) 
			]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	}
	
});