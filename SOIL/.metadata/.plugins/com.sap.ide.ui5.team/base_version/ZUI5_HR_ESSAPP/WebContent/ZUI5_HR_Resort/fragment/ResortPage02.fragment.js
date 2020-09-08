sap.ui.jsfragment("ZUI5_HR_Resort.fragment.ResortPage02", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
		];
	},
	
	/**
	 * 페이지 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getPageAllContentRender : function(oController) {
		
		var oContents = [
			new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
			this.getTitleRender(oController),			
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyAInfoRender(oController),									// 신청내역
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "100%",
			rows : $.map(oContents, function(rowData, k) {
				return new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : rowData
						}),
						new sap.ui.commons.layout.MatrixLayoutCell()
					]
				})
			})
		});
	},
	
	/**
	 * 제목 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png",}),
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {
									text : oBundleText.getText("LABEL_0077")	// 77:생활안정자금 신청
								}).addStyleClass("Font18px FontColor0"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "45px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						vAlign : "Bottom",
						content : 
							new sap.m.Toolbar({
								content : [
									new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar",{}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
									new sap.m.ToolbarSpacer(),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0022"), // 22:뒤로
										press : oController.onBack,
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0044"),	// 44:신청
										press : oController.onPressSaveC,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									})
								]
						}).addStyleClass("ToolbarNoBottomLine NoMarginLeft")
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : aRows
		});
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyAInfoRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1884"),	// 1884:시설구분/지망
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Classtxt}",
									width : "150px",
									editable : false,
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "/" , textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "0.25rem"
								}),
								new sap.m.Input({
									value : "{Placetxt}",
									width : "200px",
									editable : false,
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2020"),	// 2020:이용희망장소/ 휴양소/ 일자
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Zareatxt}",
									width : "150px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.onPressArea,
									customData : new sap.ui.core.CustomData({key : "Idx", value : "0"}),
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "10px"
								}),
								new sap.m.Input({
									value : "{Zrttt}",
									width : "200px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Zarea"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.onPressZrest,
									customData : new sap.ui.core.CustomData({key : "Idx", value : "0"}),
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "10px"
								}),
								new sap.m.ComboBox(oController.PAGEID + "_Zznum0",{
						            editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"},{path : "Zrest"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									visible : {
										path : "ZappStatAl",
										formatter : function(fVal) {
											return fVal == "" || fVal == "10";
										}
									},
									change : oController.onChangeZznum,
									customData : new sap.ui.core.CustomData({key : "Idx", value : "0"}),
						            selectedKey: "{Zznum}",
									width : "100%",
									maxWidth : "700px"
								}).addStyleClass("FontFamily"),
								new sap.m.Input({
						            editable : false,
						            value : "{Ztext}",
									width : "100%",
									visible : {
										path : "ZappStatAl",
										formatter : function(fVal) {
											return fVal == "50";
										}
									},
								}).addStyleClass("FontFamily PSNCMaxWidth700"),
							]
						}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2019")	// 2019:이용희망기간/ 신청인원
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Begda}",
							    	width : "150px",
							    	editable : false
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "0.25rem"
								}),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Endda}",
							    	width : "150px",
							    	editable : false
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width : "10px"}),
								new sap.m.Input({
									value : "{Night}",
									width : "50px",
									editable : false,
								}).addStyleClass("FontFamily"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1726")	// 1726:박
								}).addStyleClass("FontFamily"),
								new sap.m.Input({
									value : "{Zdays}",
									width : "50px",
									editable : false,
								}).addStyleClass("FontFamily"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_2052")	// 2052:일
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "/" , textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.Input({
									value : "{Applc}",
									width : "50px",
									editable : false,
								}).addStyleClass("FontFamily"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1719")	// 1719:명
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID +"_OnlyReadRow1",{
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1662")	// 1662:당첨여부/ 예약번호/ 변경사유
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "30px",
							content : [new sap.m.Input({
											value : "{Zzwintxt}",
											width : "200px",
											editable : false,
										}).addStyleClass("FontFamily"),
										new sap.m.Text({text : "/" , textAlign : "Center"}).addStyleClass("FontFamily"),
										new sap.m.ToolbarSpacer({
											width : "0.25rem"
										}),
										new sap.m.Input({
											value : "{Resnr}",
											width : "200px",
											editable : false,
										}).addStyleClass("FontFamily"),
										new sap.m.Text({text : "/" , textAlign : "Center"}).addStyleClass("FontFamily"),
										new sap.m.ToolbarSpacer({
											width : "0.25rem"
										}),
										new sap.m.Input({
											value : "{Reason}",
											width : "98%",
											editable : false,
										}).addStyleClass("FontFamily"),
								
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
		];
		
		//////////////////////2지망
		
		var aRows2 = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1884"),	// 1884:시설구분/지망
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Classtxt}",
									width : "150px",
									editable : false,
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "/ " , textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "0.25rem"
								}),
								new sap.m.Input({
									value : "{Placetxt}",
									width : "200px",
									editable : false,
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2020"),	// 2020:이용희망장소/ 휴양소/ 일자
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Zareatxt}",
									width : "150px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.onPressArea,
									customData : new sap.ui.core.CustomData({key : "Idx", value : "1"}),
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "10px"
								}),
								new sap.m.Input({
									value : "{Zrttt}",
									width : "200px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Zarea"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.onPressZrest,
									customData : new sap.ui.core.CustomData({key : "Idx", value : "1"}),
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "10px"
								}),
								new sap.m.ComboBox(oController.PAGEID + "_Zznum1",{
						            editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"},{path : "Zrest"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									change : oController.onChangeZznum,
								    selectedKey: "{Zznum}",
									width : "100%",
									maxWidth : "700px",
									visible : {
										path : "ZappStatAl",
										formatter : function(fVal) {
											return fVal == "" || fVal == "10";
										}
									},
								}).addStyleClass("FontFamily"),
								new sap.m.Input({
						            editable : false,
						            value : "{Ztext}",
									width : "100%",
									visible : {
										path : "ZappStatAl",
										formatter : function(fVal) {
											return fVal == "50";
										}
									},
								}).addStyleClass("FontFamily PSNCMaxWidth700"),
								
							]
						}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2019")	// 2019:이용희망기간/ 신청인원
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Begda}",
							    	width : "150px",
							    	editable : false
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "0.25rem"
								}),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Endda}",
							    	width : "150px",
							    	editable : false
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width : "10px"}),
								new sap.m.Input({
									value : "{Night}",
									width : "50px",
									editable : false,
								}).addStyleClass("FontFamily"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1726")	// 1726:박
								}).addStyleClass("FontFamily"),
								new sap.m.Input({
									value : "{Zdays}",
									width : "50px",
									editable : false,
								}).addStyleClass("FontFamily"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_2052")	// 2052:일
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "/" , textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.Input({
									value : "{Applc}",
									width : "50px",
									editable : false,
								}).addStyleClass("FontFamily"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1719")	// 1719:명
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID +"_OnlyReadRow2",{
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1662")	// 1662:당첨여부/ 예약번호/ 변경사유
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "30px",
							content : [new sap.m.Input({
											value : "{Zzwin}",
											width : "200px",
											editable : false,
										}).addStyleClass("FontFamily"),
										new sap.m.Text({text : "/" , textAlign : "Center"}).addStyleClass("FontFamily"),
										new sap.m.ToolbarSpacer({
											width : "0.25rem"
										}),
										new sap.m.Input({
											value : "{Resnr}",
											width : "200px",
											editable : false,
										}).addStyleClass("FontFamily"),
										new sap.m.Text({text : "/" , textAlign : "Center"}).addStyleClass("FontFamily"),
										new sap.m.ToolbarSpacer({
											width : "0.25rem"
										}),
										new sap.m.Input({
											value : "{Reason}",
											width : "98%",
											editable : false,
										}).addStyleClass("FontFamily"),
								
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0047") 	// 47:신청내역
						}).addStyleClass("MiddleTitle"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 2,
					widths : ['20%', '80%'],
					rows : aRows
				}).setModel(oController._DetailTableJSonModel)
				.bindElement("/Data/0"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 1,
					widths : ['100%'],
					rows : new sap.ui.commons.layout.MatrixLayoutRow({
						height : "15px"
					}),
					visible : {
						path : "Place",
						formatter : function(fVal){
							return !common.Common.checkNull(fVal);
						}
					}
				}).setModel(oController._DetailTableJSonModel)
				.bindElement("/Data/1"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 2,
					widths : ['20%', '80%'],
					rows : aRows2,
					visible : {
						path : "Place",
						formatter : function(fVal){
							return !common.Common.checkNull(fVal);
						}
					}
				}).setModel(oController._DetailTableJSonModel)
				.bindElement("/Data/1"),
			]
		});
	},
});