sap.ui.jsfragment("ZUI5_HR_EMPPROFILE.fragment.EmployeeProfile", {
	
	createContent : function(oController) {

		// 기본 정보
		var oHeaderMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			widths : ['180px','15px','30%','30%','40%'],
			width : "100%",
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"});
		oHeaderMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Image({
				src : "{Ephotourl}" ,
				height : "150px" ,
				 	visible : { path : "Ephotourl" , formatter : function(fVal){
					                             if(fVal && fVal != "") return true ;
					                             else return false;
				                               }
				}
			}).addStyleClass("L2PEmployeePic"),
			hAlign : "Center" ,
			rowSpan : 4 ,
			vAlign : "Top" ,
		}); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text:"",width:"15px"}),
			hAlign : "Center" ,
			rowSpan : 4 ,
			vAlign : "Top" ,
		}); 
		oRow.addCell(oCell);
		
		var oHorizontalLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		});
		
		oHorizontalLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "{Head1}"}).addStyleClass("L2P18FontBold L2PFontFamily")]
				})//.addStyleClass("L2PFilterItem")
		);
		
		oHorizontalLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [ new sap.m.Text({text : "{Head2}"}).addStyleClass("L2P15Font L2PFontFamily")]
				}).addStyleClass("VerticalBottm L2PPaddingLeft10")//.addStyleClass("L2PFilterItem")
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oHorizontalLayout,
			vAlign : "Middle" ,
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Line1" ,
					formatter : function(fVal){
						return "소속부서 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily"),
			vAlign : "Middle" ,
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datt1" ,
					formatter : function(fVal){
						return "입사일 : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily"),
			vAlign : "Middle" ,
		});
		oRow.addCell(oCell);
		
		oHeaderMatrix.addRow(oRow) ;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datl1" ,
					formatter : function(fVal){
						return fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Line2" ,
					formatter : function(fVal){
						return "직군/직급 : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily"),
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datt2" ,
					formatter : function(fVal){
						return "승진일 : " + fVal ;
					}
				} 
			}).addStyleClass("L2P15Font L2PFontFamily")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow) ;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datl2" ,
					formatter : function(fVal){
						return fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Line3" ,
					formatter : function(fVal){
						return "직위 : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily")
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datt3" ,
					formatter : function(fVal){
						return "승호일 : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow) ;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datl3" ,
					formatter : function(fVal){
						return fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Line4" ,
					formatter : function(fVal){
						return "직책 : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily")
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datt4" ,
					formatter : function(fVal){
						return "직책선임일 : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontFamily")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow) ;
		oHeaderMatrix.setModel(oController.HeaderModel)
	       .bindElement("/Data");
	
		var oHeaderContent = new sap.uxap.ObjectPageHeaderContent({
			content : oHeaderMatrix,
		}).addStyleClass("Width95");
	
		var oSectionLayout = new sap.uxap.ObjectPageLayout(oController.PAGEID + "_SectionLayout", {
			enableLazyLoading : false,
			showTitleInHeaderContent : false,
			alwaysShowContentHeader : true,
			headerContent : oHeaderContent,
			sections : []
		});
		oSectionLayout.addStyleClass("sapUiSizeCompact");
		return oSectionLayout;
		
	}

});
