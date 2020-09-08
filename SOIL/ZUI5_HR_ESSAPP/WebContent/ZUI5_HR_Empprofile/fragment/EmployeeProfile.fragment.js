sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfile", {
	
	createContent : function(oController) {

		// 기본 정보
		var oHeaderMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID +"_HeaderMatrix",{
			columns : 6,
			widths : ['200px','25%', '10%', '25%', '10%', '25%',],
			width : "100%",
			layoutFixed : false
		}); //.addStyleClass("EmployeeProfileHeader");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"});
		oHeaderMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
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
			hAlign : "Left" ,
			rowSpan : 4 ,
			vAlign : "Top" ,
		}); 
		oRow.addCell(oCell);
		
		var oHorizontalLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		});
		
		oHorizontalLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "{Head1}"}).addStyleClass("L2P18FontBold L2PFontWhite")]
				})
		);
		
		oHorizontalLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [ new sap.m.Text({text : "{Head2}"}).addStyleClass("L2P15Font L2PFontWhite")]
				}).addStyleClass("L2PPaddingLeft20")
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oHorizontalLayout,
			vAlign : "Middle" ,
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_0039"),	// 39:소속부서
				width : "120px"
			}).addStyleClass("L2P15Font L2PFontWhite"),
			vAlign : "Middle" ,
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Line1" ,
					formatter : function(fVal){
						return " : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite"),
			vAlign : "Middle" ,
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("ENT_DATE"),
				width : "120px"
			}).addStyleClass("L2P15Font L2PFontWhite"),
			vAlign : "Middle" ,
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datt1" ,
					formatter : function(fVal){
						return " : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite"),
			vAlign : "Middle" ,
		});
		oRow.addCell(oCell);
		
		oHeaderMatrix.addRow(oRow) ;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height :"40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datl1" ,
					formatter : function(fVal){
						return fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_2176")	// 2176:직군/직급
			}).addStyleClass("L2P15Font L2PFontWhite"),
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Line2" ,
					formatter : function(fVal){
						return " : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite"),
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_0949")	// 949:승진일
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datt2" ,
					formatter : function(fVal){
						return " : " + fVal ;
					}
				} 
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow) ;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height :"40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datl2" ,
					formatter : function(fVal){
						return fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_0067")	// 67:직위
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Line3" ,
					formatter : function(fVal){
						return " : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1878")	// 1878:승호일
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datt3" ,
					formatter : function(fVal){
						return " : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow) ;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height :"40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datl3" ,
					formatter : function(fVal){
						return fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1007")	// 1007:직책
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Line4" ,
					formatter : function(fVal){
						return " : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell)

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text :oBundleText.getText("LABEL_2192")	// 2192:직책선임일
			}).addStyleClass("L2P15Font L2PFontWhite")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : { path : "Datt4" ,
					formatter : function(fVal){
						return " : " + fVal ;
					}
				}
			}).addStyleClass("L2P15Font L2PFontWhite")
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
		
		oSectionLayout.addDelegate({
			onAfterRendering: function() {
				$('div[id^="EmployeeProfile_HeaderSection_"].sapUxAPObjectPageSectionTitle').each(function() { 
					$(this)
						.html("<img src='/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png' /> " + $(this).html()); 
				});
			}
		});
		
		return oSectionLayout;
	}

});
