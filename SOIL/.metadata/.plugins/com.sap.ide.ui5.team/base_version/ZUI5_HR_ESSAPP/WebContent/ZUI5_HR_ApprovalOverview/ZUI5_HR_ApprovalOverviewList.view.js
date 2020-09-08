
sap.ui.jsview("ZUI5_HR_ApprovalOverview.ZUI5_HR_ApprovalOverviewList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_ApprovalOverview.ZUI5_HR_ApprovalOverviewList
	 */
	getControllerName : function() {
		return "ZUI5_HR_ApprovalOverview.ZUI5_HR_ApprovalOverviewList";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ApprovalOverview.ZUI5_HR_ApprovalOverviewList
	 */
	createContent : function(oController) {

		// 근태신청
		var oListItemMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths: ["80%","20%"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({
						text : "{Title}",
					}).addStyleClass("L2PFontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "{ApprovalCount}"
			}).addStyleClass("L2PFontFamily")
		});
		oRow.addCell(oCell);
		oListItemMatrix1.addRow(oRow);
		
		oListItemMatrix1.addStyleClass("L2PCursorPointer");
		
		// 1Layout
		var oListItemLayout1 = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix1 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem1 = new sap.m.CustomListItem({
			content : oListItemLayout1,
			type : sap.m.ListType.Active,
			press : oController.onSelectRow
		});
		
		var oResultList1 = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem1
			}
		});
		oResultList1.setModel(oController._ResultModel1);
		oResultList1.attachEvent("cellClick", function(oEvent) {
			console.log(oEvent);
		})
		
		// 출장신청
		var oListItemMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths: ["80%","20%"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({
						text : "{Title}",
					}).addStyleClass("L2PFontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "{ApprovalCount}"
			}).addStyleClass("L2PFontFamily")
		});
		oRow.addCell(oCell);
		oListItemMatrix2.addRow(oRow);
		
		var oListItemLayout2 = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix2 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem2 = new sap.m.CustomListItem({
			content : oListItemLayout2,
			type : sap.m.ListType.Active,
			press : oController.onSelectRow
		});
		
		var oResultList2 = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem2
			}
		});
		oResultList2.setModel(oController._ResultModel2);
		
		// 안사행정 신청
		var oListItemMatrix3 = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths: ["80%","20%"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({
						text : "{Title}",
					}).addStyleClass("L2PFontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "{ApprovalCount}"
			}).addStyleClass("L2PFontFamily")
		});
		oRow.addCell(oCell);
		oListItemMatrix3.addRow(oRow);
		
		var oListItemLayout3 = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix3 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem3 = new sap.m.CustomListItem({
			content : oListItemLayout3,
			type : sap.m.ListType.Active,
			press : oController.onSelectRow
		});
		
		var oResultList3 = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem3
			}
		});
		oResultList3.setModel(oController._ResultModel3);
		
		// 사회봉사
		
		var oListItemMatrix4 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths: ["80%","20%"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({
						text : "{Title}",
					}).addStyleClass("L2PFontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "{ApprovalCount}"
			}).addStyleClass("L2PFontFamily")
		});
		oRow.addCell(oCell);
		oListItemMatrix4.addRow(oRow);
		
		var oListItemLayout4 = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix4 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem4 = new sap.m.CustomListItem({
			content : oListItemLayout4,
			type : sap.m.ListType.Active,
			press : oController.onSelectRow
		});
		
		var oResultList4 = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem4
			}
		});
		oResultList4.setModel(oController._ResultModel4);
		
		// 도서신청
		var oListItemMatrix5 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths: ["80%","20%"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({
						text : "{Title}",
					}).addStyleClass("L2PFontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "{ApprovalCount}"
			}).addStyleClass("L2PFontFamily")
		});
		oRow.addCell(oCell);
		oListItemMatrix5.addRow(oRow);
		
		var oListItemLayout5 = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix5 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem5 = new sap.m.CustomListItem({
			content : oListItemLayout5,
			type : sap.m.ListType.Active,
			press : oController.onSelectRow
		});
		
		var oResultList5 = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem5
			}
		});
		oResultList5.setModel(oController._ResultModel5);
		
		// 복리후생 신청
		var oListItemMatrix6 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths: ["80%","20%"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({
						text : "{Title}",
					}).addStyleClass("L2PFontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "{ApprovalCount}"
			}).addStyleClass("L2PFontFamily")
		});
		oRow.addCell(oCell);
		oListItemMatrix6.addRow(oRow);
		
		var oListItemLayout6 = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix6 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem6 = new sap.m.CustomListItem({
			content : oListItemLayout6,
			type : sap.m.ListType.Active,
			press : oController.onSelectRow
		});
		
		var oResultList6 = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem6
			}
		});
		oResultList6.setModel(oController._ResultModel6);
		
		// 급여
		var oListItemMatrix7 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths: ["80%","20%"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer({width : "10px"}),
					new sap.m.Text({
						text : "{Title}",
					}).addStyleClass("L2PFontFamily"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "{ApprovalCount}"
			}).addStyleClass("L2PFontFamily")
		});
		oRow.addCell(oCell);
		oListItemMatrix7.addRow(oRow);
		
		oListItemMatrix7.addStyleClass("L2PCursorPointer");
		
		// 7Layout
		var oListItemLayout7 = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix7 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem7 = new sap.m.CustomListItem({
			content : oListItemLayout7,
			type : sap.m.ListType.Active,
			press : oController.onSelectRow
		});
		
		var oResultList7 = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem7
			}
		});
		oResultList7.setModel(oController._ResultModel7);
		oResultList7.attachEvent("cellClick", function(oEvent) {
			console.log(oEvent);
		})
		
		var oResultListPanel1 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer(),
					       new sap.m.Text({text : oBundleText.getText("LABEL_1572") }).addStyleClass("L2PFontFamilyBold"),	// 1572:근태신청
					       new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PMatrixLabel10"),
			content : oResultList1 ,
		});
		
		var oResultListPanel7 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer(),
					       new sap.m.Text({text : oBundleText.getText("LABEL_1588") }).addStyleClass("L2PFontFamilyBold"),	// 1588:급여
					       new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PMatrixLabel10"),
			content : oResultList7 ,
		});
		
		
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : new sap.ui.commons.layout.MatrixLayoutCell({
				content : oResultListPanel1
			})
		});
		
		oMatrix1.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : new sap.ui.commons.layout.MatrixLayoutCell({
				content : oResultListPanel7
			})
		});
		
		oMatrix1.addRow(oRow);
		
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
		});
		
		var oResultListPanel2 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer(),
					       new sap.m.Text({text : oBundleText.getText("LABEL_2242") }).addStyleClass("L2PFontFamilyBold"),	// 2242:출장신청
					       new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PMatrixLabel10"),
			content : oResultList2 ,
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : new sap.ui.commons.layout.MatrixLayoutCell({
				content : oResultListPanel2
			})
		});
		oMatrix2.addRow(oRow);
		
		var oResultListPanel3 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer(),
					       new sap.m.Text({text : oBundleText.getText("LABEL_2030") }).addStyleClass("L2PFontFamilyBold"),	// 2030:인사행정
					       new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PMatrixLabel10"),
			content : oResultList3 ,
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : new sap.ui.commons.layout.MatrixLayoutCell({
				content : oResultListPanel3
			})
		});
		oMatrix2.addRow(oRow);
		
		var oResultListPanel4 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer(),
					       new sap.m.Text({text : oBundleText.getText("LABEL_1834") }).addStyleClass("L2PFontFamilyBold"),	// 1834:사회봉사
					       new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PMatrixLabel10"),
			content : oResultList4 ,
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : new sap.ui.commons.layout.MatrixLayoutCell({
				content : oResultListPanel4
			})
		});
		oMatrix2.addRow(oRow);
		
		var oResultListPanel5 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer(),
					       new sap.m.Text({text : oBundleText.getText("LABEL_1704") }).addStyleClass("L2PFontFamilyBold"),	// 1704:도서신청
					       new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PMatrixLabel10"),
			content : oResultList5 ,
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : new sap.ui.commons.layout.MatrixLayoutCell({
				content : oResultListPanel5
			})
		});
		oMatrix2.addRow(oRow);
		
		var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
		});
		
		var oResultListPanel6 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer(),
					       new sap.m.Text({text : oBundleText.getText("LABEL_1768") }).addStyleClass("L2PFontFamilyBold"),	// 1768:복리후생
					       new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PMatrixLabel10"),
			content : oResultList6 ,
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : new sap.ui.commons.layout.MatrixLayoutCell({
				content : oResultListPanel6
			})
		});
		oMatrix3.addRow(oRow);
		
//		var oSplitter = new sap.ui.layout.Splitter({
//			contentAreas : [ new sap.ui.layout.SplitterLayoutData({
//								resizable : false,
//								layoutData : oResultList1
//						    }),
////						   new sap.ui.layout.SplitterLayoutData({
////							   layoutData : [ oResultList2,
////											  oResultList3,
////											  oResultList4,
////											  oResultList5]
////						   }),
//						   new sap.ui.layout.SplitterLayoutData({
//							   layoutData : oResultList2
//						   }),
//						   new sap.ui.layout.SplitterLayoutData({
//							   layoutData : oResultList6
//						   }),
//			]
//		});
		
		var oSplitter = new sap.ui.layout.Splitter({
			contentAreas : [ oMatrix1,
  							 oMatrix2,
							 oMatrix3
			]
		});
		
//		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 3,
//		});
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
//			cells : [new sap.ui.commons.layout.MatrixLayoutCell({
//							content : oMatrix1,
//							hAlign : "Center"
//					 }),
//					 new sap.ui.commons.layout.MatrixLayoutCell({
//							content : oMatrix2,
//							hAlign : "Center"
//					 }),
//					 new sap.ui.commons.layout.MatrixLayoutCell({
//							content : oMatrix3,
//							hAlign : "Center"
//					 })]
//		});
//		oMatrix.addRow(oRow);
		
		
//		var oSplitter = new sap.ui.layout.Splitter({
//		contentAreas : [ oResultList1,
//					     oResultList2,
//					     oResultList6,
//		]
//	});
		
//		var oSplitter = new sap.ui.layout.Splitter("mySplitter", {
//			contentAreas: [
//				createExampleContent(), createExampleContent(),
//				sap.ui.layout.Splitter("nestedSplitter", {
//					contentAreas: [new sap.m.Button(), new sap.m.Button()],
//					orientation: "Vertical"
//				})
//			]
//		});

		
	var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oSplitter],
//			content : [oMatrix],
			showHeader : true,
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("LABEL_1897")	// 1897:신청문서 Overview
								}).addStyleClass("TitleFont"),
							}).addStyleClass("PSNCHeader L2pHeaderPadding"),
		}).addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});