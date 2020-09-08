sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.ChartTestPage04", {
	
	createContent : function(oController) {
		var oSuggestionListItemTemplate = new sap.m.SuggestionItem({
			text : "{text}",
//			description : "{description}",
			key: "{key}",
			icon: "{icon}"
		});
		
		var dialogSearchField = new sap.m.SearchField("SFDialog", {
			placeholder: "search for...",
			width : "60%",
			enableSuggestions: true, 
			search:  oController.onSearch,
			suggest: oController.doSuggest
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindAggregation("suggestionItems", "/", oSuggestionListItemTemplate);
		
		var oRow , oCell ;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths: ["50px","","","50px"]
		});
		
		//.addStyleClass("LaunchpadBackground");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({}); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Image({
//				src : "{Zurl}" ,
				src : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/zui5_hr_charttest4/images/goodoil.jpg",
				height : "200px",
				visible : false
			}),
			hAlign : "Center" ,
			colSpan : 2 ,
			vAlign : "Middle" ,
		}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({}); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : dialogSearchField,
			hAlign : "Center",
			vAlign : "Middle",
			colSpan : 2
		}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oBlockLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true,
			content :  [ 
							new sap.ui.layout.VerticalLayout({
								content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Employee",oController)
							              ]
							}).addStyleClass("PSNCPaddingLeft"),
							new sap.ui.layout.VerticalLayout({
								content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Apply",oController)
							              ]
							}).addStyleClass("PSNCPaddingLeft"),
							new sap.ui.layout.VerticalLayout({
								content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Sign",oController)
							              ]
							}).addStyleClass("PSNCPaddingLeft"),
							new sap.ui.layout.VerticalLayout({
								content : [
											new sap.m.CustomTile({ 
												  content : [
													  new sap.ui.commons.layout.MatrixLayout({
															layoutFixed : false,
															width : "100%",
															columns : 1,
															rows : new sap.ui.commons.layout.MatrixLayoutRow({
																cells : [
																	 new sap.ui.commons.layout.MatrixLayoutCell({
																			content : new sap.ui.commons.TextView({text : "급상여명세서"}).addStyleClass("L2PTitle1")
																	  })
																]
															})
														}).addStyleClass("L2PTilePadding")
												  ],
												  press: function(oEvent){
													  window.open("/sap/bc/ui5_ui5/sap/zui5_hr_essapp/ApprovalBox.html?_gAuth=E");
												  }
											}).addStyleClass("TileLayout backgroundImage1")
										  ]
							}).addStyleClass("PSNCPaddingLeft"),
//							new sap.ui.layout.VerticalLayout({
//								content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Employee",oController)
//							              ]
//							}).addStyleClass("PSNCPaddingLeft"),
//							new sap.ui.layout.VerticalLayout({
//								content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Employee",oController)
//							              ]
//							}).addStyleClass("PSNCPaddingLeft"),
//							new sap.ui.layout.VerticalLayout({
//								content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Employee",oController)
//							              ]
//							}).addStyleClass("PSNCPaddingLeft"),
//							new sap.ui.layout.VerticalLayout({
//								content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Employee",oController)
//							              ]
//							}).addStyleClass("PSNCPaddingLeft"),
							
		         ],
		}).addStyleClass("LeftAlign");
		
		var oFavoriteLayout = new sap.ui.layout.HorizontalLayout(oController.PAGEID + "_FavoriteLayout",{
//		var oFavoriteLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true,
		}).addStyleClass("LeftAlign favoriteLayout");
		
		oFavoriteLayout.bindAggregation("content",{
			path: "/Data",
			template: new sap.ui.layout.VerticalLayout({
				width : "300px",
				content : [ new sap.m.Toolbar({
					content : [
						new sap.m.ToolbarSpacer({width : "10px"}),
						new sap.m.Link({
							text : "{Title}",
							target : "{Url}"
						}).addStyleClass("L2PFontFamily"),
					]
				}).addStyleClass("L2PToolbarNoBottomLine")
				]
			}).addStyleClass("PSNCPaddingLeft10px")
		});
		oFavoriteLayout.setModel(oController._FavoriteJSonModel);
		
		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height : window.innerHeight-350+"px"});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({}); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ oBlockLayout, 
				        new sap.ui.core.HTML({ content : "<div style='height : 10px;'/>" }),
						oFavoriteLayout ],
//			content : oTileMatrix,
			hAlign : "Center",
			vAlign : "Bottom",
			colSpan : 2
		}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		return oMatrix;
//		return oBlockLayout;

	
	}
});