sap.ui.jsfragment("zui5_hrxx_rss.fragment.Holdover", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var oCell, oRow;
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_HoldoverMatrix", {
			columns : 1,
			width : "100%"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		var oText1 = "에쓰-오일(주)(이하 \"회사\"라 합니다)은 근로기준법 등 관련 법령상의 규정을 준수하며 직원들의 일-가정 양립 및 휴식/재충전을" +
        			 " 통한 업무 몰입도 향상에 실질적인 도움을  드리기 위하여 최선을 다하고 있습니다. \n" +
					 "회사는 다음과 같이 연차유급휴가 이월과 관련하여 귀하의 동의를 받고자 하며, 귀하는 아래 제안에 동의하지 않을 수 있습니다.";
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.MessageStrip({text : oText1, 
						type: "Information",
						showIcon: true,
						showCloseButton: false,
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.CheckBox({text : "전체 약관에 동의합니다.", 
							selected : "{checkAll}",
							select : oController.onCheckBox
						}).addStyleClass("FontFamily FontBold")]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("TopBorder");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [
							new sap.m.ToolbarSpacer(),
							new sap.m.Button({text : "제출",
								type : "Default", 
								icon :"sap-icon://accept",
								press : function(){
									oController.onSave(oController);
								}
							}).addStyleClass("FontFamily"),
							new sap.m.Button({text : "닫기",
								type : "Default", 
								icon :"sap-icon://decline",
								press : function(){
									oController.onClose(oController);
								}
							}).addStyleClass("FontFamily"),
							new sap.m.ToolbarSpacer(),
							]
					}).addStyleClass("L2PToolbarNoBottomLine")
				});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "1.연차유급휴가 이월 사용에 관한 사항"}).addStyleClass("FontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		var oText2 = "연차유급휴가를 사용하지 못한 경우 휴가청구권 발생일로부터 1 년이 지나면 소멸됨이 원칙이나, 귀하와 회사의 동의를 통해 차년도로 이월할 수 있습니다.\n" +
					 "작년도 미사용 휴가에 대해 이월하여 사용하는 것에 동의하십니까.";
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.MessageStrip({text : oText2, 
						type: "Information",
						showIcon: true,
						showCloseButton: false,
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [
							new sap.m.ToolbarSpacer(),
							new sap.m.RadioButtonGroup({
								columns : 2,
								buttons : [new sap.m.RadioButton({text: "동의함"}).addStyleClass("FontFamily"), 
								           new sap.m.RadioButton({text: "동의하지 않음" }).addStyleClass("FontFamily")], 
					            selectedIndex : "{Val1}",
					            select : function(oEvent){
					            	var oModel = oEvent.oSource.mBindingInfos.selectedIndex.binding.oContext.oModel;
					            	oModel.setProperty("/Data/Val1",oEvent.mParameters.selectedIndex );
					            }
							}),
							new sap.m.ToolbarSpacer(),
						]
					}).addStyleClass("L2PToolbarNoBottomLine")
				});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oDaysMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ["80%", "20%"],
			width : "300px"
		});
		oDaysMatrix.setModel(oJSonModel);
		oDaysMatrix.bindElement("/Data");
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({text : "귀하의 작년 연차휴가 발생일"}).addStyleClass("FontFamily"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Text({text : ":"}).addStyleClass("FontFamily"),
					new sap.m.ToolbarSpacer({width : "10px"}),
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("TopBorder LeftBorder");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({text : "{Dayen}"}).addStyleClass("FontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("TopBorder RightBorder");
		oRow.addCell(oCell);
		oDaysMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({text : "귀하의 작년 연차휴가 사용일"}).addStyleClass("FontFamily"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Text({text : ":"}).addStyleClass("FontFamily"),
					new sap.m.ToolbarSpacer({width : "10px"}),
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("LeftBorder");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({text : "{Dayus}"}).addStyleClass("FontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("RightBorder");
		oRow.addCell(oCell);
		oDaysMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({text : "이월 대상 연차휴가"}).addStyleClass("FontFamily"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Text({text : ":"}).addStyleClass("FontFamily"),
					new sap.m.ToolbarSpacer({width : "10px"}),
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("BottomBorder LeftBorder");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({text : "{Dayco}"}).addStyleClass("FontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("BottomBorder RightBorder");
		oRow.addCell(oCell);
		oDaysMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : oDaysMatrix,
					hAlign : "Center"
				}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"});
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "2. 중도 퇴직할 경우 연차유급휴가 사용에 관한 사항"}).addStyleClass("FontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		var oText3 = "귀하는 본 합의를 체결한 년도에 귀하의 개인사정 및 여하한 사유로 중도 퇴직할 경우 퇴직일 전에 발생(이월)된 연차유급휴가를 모두 사용하는 것에 동의합니다.";
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.MessageStrip({text : oText3, 
						type: "Information",
						showIcon: true,
						showCloseButton: false,
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [
							new sap.m.ToolbarSpacer(),
							new sap.m.RadioButtonGroup({
								columns : 2,
								buttons : [new sap.m.RadioButton({text: "동의함"}).addStyleClass("FontFamily"), 
								           new sap.m.RadioButton({text: "동의하지 않음" }).addStyleClass("FontFamily")], 
					            selectedIndex : "{Val2}",
					            select : function(oEvent){
					            	var oModel = oEvent.oSource.mBindingInfos.selectedIndex.binding.oContext.oModel;
					            	oModel.setProperty("/Data/Val2",oEvent.mParameters.selectedIndex );
					            }
							}),
							new sap.m.ToolbarSpacer(),
						]
					}).addStyleClass("L2PToolbarNoBottomLine")
				});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oMatrix.setModel(oJSonModel);
		oMatrix.bindElement("/Data");
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_Holdover", {
			content : [oMatrix],
			contentWidth : "1000px",
			showHeader : true,
			title : "연차유급휴가 이월 사용동의서",
			endButton : new sap.m.Button({text : "닫기", press : function(oEvent){oDialog.close();}})
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});
