sap.ui.jsfragment("ZUI5_HR_Portal.fragment.HoldoverReader", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var oCell, oRow;
		
		var oText1 = "에쓰-오일(주)(이하 \"회사\"라 합니다)은 근로기준법 등 관련 법령상의 규정을 준수하며 직원들의 일-가정 양립 및 휴식/재충전을" +
		 " 통한 업무 몰입도 향상에 실질적인 도움을  드리기 위하여 최선을 다하고 있습니다. \n" +
		 "회사는 다음과 같이 연차유급휴가 이월과 관련하여 귀하의 동의를 받고자 하며, 귀하는 아래 제안에 동의하지 않을 수 있습니다.";
		
		var oText2 = "연차유급휴가를 사용하지 못한 경우 휴가청구권 발생일로부터 1 년이 지나면 소멸됨이 원칙이나, 귀하와 회사의 동의를 통해 차년도로 이월할 수 있습니다.\n" +
		 "작년도 미사용 휴가에 대해 이월하여 사용하는 것에 동의하십니까.";
		
		var oText3 = "귀하는 본 합의를 체결한 년도에 귀하의 개인사정 및 여하한 사유로 중도 퇴직할 경우 퇴직일 전에 발생(이월)된 연차유급휴가를 모두 사용하는 것에 동의합니다.";
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.core.Icon({ 
							src: "sap-icon://message-information",
							size : "1.0rem",
						}).addStyleClass("PaddingTop2"),
						vAlign : "Top",
					}).addStyleClass("MatrixData3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : oText1, 
						}).addStyleClass("FontFamily"),
						colSpan : 2
					}).addStyleClass("MatrixData2")
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [new sap.m.CheckBox({text : "전체 약관에 동의합니다.", 
								selected : "{checkAll}",
								select : ZUI5_HR_Portal.common.HoldoverController.onCheckBox
							}).addStyleClass("FontFamily")]
						}).addStyleClass("ToolbarNoBottomLine"),
						colSpan : 2
					}).addStyleClass("PaddingTop10 PaddingBottom10"),
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({text : "1.연차유급휴가 이월 사용에 관한 사항"}).addStyleClass("FontFamilyBold"),
						hAlign : "Center",
						vAlign : "Middle",
						colSpan : 3
					}).addStyleClass("MatrixData5")
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.core.Icon({ 
							src: "sap-icon://message-information",
							size : "1.0rem",
						}).addStyleClass("PaddingTop2"),
						vAlign : "Top",
					}).addStyleClass("MatrixData3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : oText2, 
						}).addStyleClass("FontFamily"),
						colSpan : 2
					}).addStyleClass("MatrixData2")
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
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
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
							content :  new sap.m.Toolbar({
								content : [
									new sap.m.ToolbarSpacer(),
									new sap.m.Text({text : "귀하의 작년 연차휴가 발생일 : " + "{Dayen}"}).addStyleClass("FontFamily"),
									new sap.m.ToolbarSpacer(),
									new sap.m.Text({text : "|", textAlign : "Center"}).addStyleClass("FontFamily"),
									new sap.m.ToolbarSpacer(),
									new sap.m.Text({text : "귀하의 작년 연차휴가 사용일 : " + "{Dayus}"}).addStyleClass("FontFamily"),
									new sap.m.ToolbarSpacer(),
								],
								width : "500px"
							}).addStyleClass("ToolbarNoBottomLine MatrixData6"),
							colSpan : 2,
							hAlign : "Center"
					})
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Toolbar({
							content : [
								new sap.m.ToolbarSpacer(),
								new sap.m.Text({text : "이월 대상 연차휴가 : " + "{Dayco}"}).addStyleClass("FontFamilyBold"),
								new sap.m.ToolbarSpacer()
							],
							width : "500px"
						}).addStyleClass("ToolbarNoBottomLine MatrixData7"),
						hAlign : "Center",
						vAlign : "Middle",
						colSpan : 2
					})
			    ]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Toolbar({
							content : [
								new sap.m.ToolbarSpacer(),
								new sap.m.Text({text : "(총 누적 이월 연차휴가 : " + "{Daycc}" + ")"}).addStyleClass("FontFamilyBold"),
								new sap.m.ToolbarSpacer()
							],
							width : "500px"
						}).addStyleClass("ToolbarNoBottomLine MatrixData7"),
						hAlign : "Center",
						vAlign : "Middle",
						colSpan : 2
					})
			    ]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ToolbarSpacer(),
								new sap.m.RadioButtonGroup({
									columns : 2,
									buttons : [new sap.m.RadioButton({text: "동의함"}).addStyleClass("FontFamily"), 
									           new sap.m.RadioButton({text: "동의하지 않음" }).addStyleClass("FontFamily")], 
						            selectedIndex : "{Val3}",
						            select : function(oEvent){
						            	var oModel = oEvent.oSource.mBindingInfos.selectedIndex.binding.oContext.oModel;
						            	oModel.setProperty("/Data/Val3",oEvent.mParameters.selectedIndex );
						            }
								}),
								new sap.m.ToolbarSpacer(),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({text : "2. 중도 퇴직할 경우 연차유급휴가 사용에 관한 사항"}).addStyleClass("FontFamilyBold"),
						hAlign : "Center",
						vAlign : "Middle",
						colSpan : 3
					}).addStyleClass("MatrixData5")
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.core.Icon({ 
							src: "sap-icon://message-information",
							size : "1.0rem",
						}).addStyleClass("PaddingTop2"),
						vAlign : "Top",
					}).addStyleClass("MatrixData3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : oText3, 
						}).addStyleClass("FontFamily"),
						colSpan : 2
					}).addStyleClass("MatrixData2")
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
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
						}).addStyleClass("ToolbarNoBottomLine"),
						colSpan : 2
					})
				]
			})
		];
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_HoldoverMatrix", {
			widths : ["40px" , "" ,"20px"],
			columns : 3,
			rows : aRows,
			width : "100%"
		});
		oMatrix.setModel(oJSonModel);
		oMatrix.bindElement("/Data");
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_Holdover", {
			content : [oMatrix],
			contentWidth : "1000px",
			showHeader : true,
			title : "연차유급휴가 이월 사용동의서",
			buttons : [ new sap.m.Button({text : "제출",
							type : "Default", 
							icon :"sap-icon://accept",
							press : function(){
								ZUI5_HR_Portal.common.HoldoverController.onSave(oController);
							}
						}).addStyleClass("FontFamily"),
						new sap.m.Button({text : "닫기",
							type : "Default", 
							icon :"sap-icon://decline",
							press : function(){
								oDialog.close();
							}
						}).addStyleClass("FontFamily")]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});
