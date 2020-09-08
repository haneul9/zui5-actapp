sap.ui.jsfragment("fragment.IconTab", {
	
	createContent : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 1,
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : [ 
												new sap.m.Text({
													text : {
														parts : [ {path : "CountAll"}, {path : "click0"}],
														formatter : function(fVal1, fVal2){
															this.removeStyleClass("FontColor3");
															this.removeStyleClass("FontColor9");
															if(fVal2 == "Y") {
																this.addStyleClass("FontColor3");
															} else {
																this.addStyleClass("FontColor9");
															}
															return fVal1;
														}
													},
													textAlign : "Right"
											})
											.attachBrowserEvent("click", function() {
												oController.handleIconTabBarSelect(oController, "0");
											}).addStyleClass("Font60px FontColor3 paddingBottom5px CursorPointer PaddingRight10"),
											new sap.m.Text({
												text : oBundleText.getText("LABEL_0001"),	// 건
												textAlign : "Left"
											}).addStyleClass("Font12px FontColor6 MarginTop40px") ],
											hAlign : "Center",
											vAlign : "Middle"
										})
									]
								})
							]
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.core.HTML({
							content : "<div style='height : 60px; border-left : 1px solid #a6a6a6;'/>"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click1",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_01_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_01.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "1");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom"
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count1}",
												textAlign : "Left"
											}).addStyleClass("Font30px FontColorIconTab1"),
											hAlign : "Left",
											vAlign : "Middle" 
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content :  new sap.m.Text({
												text : oBundleText.getText("LABEL_0059"),	// 59:작성중
												textAlign : "Left"
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left",
											vAlign : "Middle" 
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_00.png"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({ 
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click2",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_02_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_02.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "2");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom" 
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count2}"
											}).addStyleClass("Font30px FontColorIconTab2"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : oBundleText.getText("LABEL_0044")	// 44:신청
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_00.png"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click3",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_03_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_03.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "3");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom" 
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count3}"
											}).addStyleClass("Font30px FontColorIconTab3"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells: [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : oBundleText.getText("LABEL_0068")	// 68:진행중
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_00.png"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click4",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_04_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_04.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "4");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom" 
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count4}"
											}).addStyleClass("Font30px FontColorIconTab4"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : oBundleText.getText("LABEL_0041"),	// 41:승인
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left" ,
											vAlign : "Middle"
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/ic_or.png"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click5",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_05_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_05.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "5");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom"
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count5}"
											}).addStyleClass("Font30px FontColorIconTab5"),
											hAlign : "Left" ,
											vAlign : "Middle"
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : oBundleText.getText("LABEL_0024")	// 0024: 반려
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left" ,
											vAlign : "Middle"
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 11,
			widths : ["16.7%", "5px", "16.6%", "35px","16.6%", "35px","16.6%", "35px", "16.6%", "35px", "16.6%"],
			width : "100%",
			height : "115px",
			rows : aRows
		})
		.setModel(oController._IconTabBarJSonModel)
		.bindElement("/Data")
		.addStyleClass("icontabbar");
		
	}
	
});