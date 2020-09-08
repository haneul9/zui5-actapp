sap.ui.jsfragment("ZUI5_HR_EmployeeList.fragment.EmployeeListPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		
		var oListItemMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 7,
			widths: ["150px","13%","20%","13%","20%","13%","20%"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"});
		oListItemMatrix.addRow(oRow);
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Image({
					src : "{Zurl}" ,
					height : "60px" ,
					visible : { path : "Zurl" , formatter : function(fVal){
						                             if(fVal && fVal != "") return true ;
						                             else return false;
					                               }
					}
				}),
				hAlign : "Center" ,
				rowSpan : 5 ,
				vAlign : "Middle" ,
		}); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "사 번"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : { path : "Userid", 
						 formatter : function(fVal1, fVal2){
							 return fVal1 + " " + fVal2 ;
						 }
				}
			
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "성 명"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : { path : "{Ename}"}
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "생년월일"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : {path : "Zzbirdt",  type :  new sap.ui.model.type.Date({pattern : "yyyy.MM.dd"}) }
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oListItemMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "사업장"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : { path : "Btext", 
						 formatter : function(fVal1, fVal2){
							 return fVal1 + " " + fVal2 ;
						 }
				}
			
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "소 속"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : { path : "{Zzorgtx}"}
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "소속배치일"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : {path : "Orgdt",  type :  new sap.ui.model.type.Date({pattern : "yyyy.MM.dd"}) }
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oListItemMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "직군/직급"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Zzjiktltx}"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "직 책"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Zzjikchtx}"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "재급년수"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : {path : "Jgyear",  formatter :  function(fVal){
					if(fVal && fVal != "") return fVal + " 년" ;
					else return "" ;
				} }
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oListItemMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "CarrerField"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Stfjx}"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "직 무"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Stext}"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "최종학력/학위"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : {part : [{path : "Slartfltx"}, {path : "Slabsfltx" }],  formatter :  function(fVal1 , fVal2){
					return fVal1 + " / " + fVal2 ;
				} }
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oListItemMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "재직구분"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Stxt2}"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "입사일"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : {path : "Entdt",  type :  new sap.ui.model.type.Date({pattern : "yyyy.MM.dd"}) }
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text :  "전공"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Text({
				text : "{Major}"
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData")
		oRow.addCell(oCell);
		oListItemMatrix.addRow(oRow);
		
		var oListItemLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem = new sap.m.CustomListItem({
			content : oListItemLayout
		});
		
		var oResultList = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem
			}
		});
		oResultList.setModel(oController.ResultModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ oResultList]
		});
		
		oLayout.addStyleClass("sapUiSizeCompact");
		
		return oLayout;

	
	}
});