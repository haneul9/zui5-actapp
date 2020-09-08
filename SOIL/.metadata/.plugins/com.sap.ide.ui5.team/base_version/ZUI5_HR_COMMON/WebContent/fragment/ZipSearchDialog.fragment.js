sap.ui.jsfragment("fragment.ZipSearchDialog", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf TargetLayout
	*/
	
	createContent : function(oController) {
		
		// 화면 Layout 그리기
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_ZipLayout",{
			columns : 5,
			widths : [ "20px","50px","", "50px","20px"],
		}).setModel(new sap.ui.model.json.JSONModel());
		oContentMatrix.bindElement("/Data");
		var oRow , oCell ;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.HTML({
				content : "<div style='height : 10px;'/>"
			})
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text  : "",
			}),
			colSpan : 2
		});
		oRow.addCell(oCell);
		
		var oAddInput =  new sap.m.Input(oController.PAGEID +"_Filter",{ 
			placeholder : oBundleText.getText("LABEL_2791"),	// 2791:도로명 주소, 건물명 또는 지번입력
			change : function(){
				common.ZipSearch.getAddr();	
			},
		}); 
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ oAddInput , 
				   new sap.m.Button({
						icon : "sap-icon://search",
						type : sap.m.ButtonType.Emphasized,
						press : common.ZipSearch.getAddr ,
				   }).addStyleClass("PSNCFontFamily"),
				   new sap.m.Button({
						icon : "sap-icon://decline",
						type : sap.m.ButtonType.Emphasized,
						press : function(){
							oAddInput.setValue("");	
						},
				   }).addStyleClass("PSNCFontFamily"),
					],
				}).addStyleClass("PSNCToolbarNoBottomLine")
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text  : ""
			}),
			colSpan : 2
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text  : oBundleText.getText("LABEL_2792")	// 2792:검색어 예 : 도로명(반포대로 58), 건물명(독립기념관), 지번(삼성동 25)
			}).addStyleClass("PSNCFontFamily")
		}).addStyleClass("PSNCPaddingLeft10px");
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text  : ""
			})
		});
		oRow.addCell(oCell);
		
		var oResult = new sap.m.Text(oController.PAGEID + "_Result",{
			text  : "",
		}).addStyleClass("PSNCFontFamily");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oResult,
			colSpan : 4
		}).addStyleClass("PSNCPaddingLeft10px");
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		
		
		var oColumnList = new sap.m.ColumnListItem({
			counter : 10,
			cells : [
				new sap.m.Text({
				     text : "{Idx}" 
				}).addStyleClass("PSNCFontFamily"),
			    new sap.m.ObjectIdentifier({
			    	title : "{roadAddr}",
					text :  { path : "jibunAddr",
							  formatter : function(fVal){
								  return "["+oBundleText.getText("LABEL_2793")+"] " + fVal ;	// 2793:지번
							  }	
					}
			    }).addStyleClass("PSNCFontFamily"),
			    new sap.m.Text({
				     text : "{zipNo}",
				     textAlign : sap.ui.core.TextAlign.Begin,
				}).addStyleClass("PSNCFontFamily"),
			    
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_ZipTable",{
			mode : "SingleSelectLeft",
			inset : false,
			columns : [
		          new sap.m.Column({
		        	  header: new sap.m.Label({text : "No."}).addStyleClass("PSNCFontFamily"),
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : "40px",
		        	  minScreenWidth: "tablet"}),
		          new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_2794")}).addStyleClass("PSNCFontFamily"),	// 2794:도로명 주소
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Begin,
		        	  styleClass : "cellBorderRight",
		        	  minScreenWidth: "tablet"}),
	        	  new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_2795")}).addStyleClass("PSNCFontFamily"),	// 2795:우편번호
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight",
		        	  width : "100px",
		        	  minScreenWidth: "tablet"}) ],
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindItems("/Data", oColumnList);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text  : ""
			})
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oTable,
			colSpan : 3
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		
		var oLayout = new sap.ui.layout.HorizontalLayout(oController.PAGEID +"_ZipButtonLayout",{
			allowWrapping :true,
			visible : false
		});
		
		var oButton0 = new sap.m.Button(oController.PAGEID +  "_Button0",{ 
			icon : "sap-icon://navigation-left-arrow",
			press : common.ZipSearch.clickPreBtn,
		});
		
		oLayout.addContent(oButton0);
		
		for(var i = 1; i <= 10; i++){
//			eval("var oButton" + i + " = new sap.m.Button(" + oController.PAGEID + "_Button" +i+ ",{ press : clickBtnIdx});");
//			eval("oLayout.addContent(oButton" +i+")");
			var oButton = new sap.m.Button(oController.PAGEID +  "_Button" +i ,{ 
				press : common.ZipSearch.clickBtnIdx
			});
			oLayout.addContent(oButton);
		}
		
		var oButton11 = new sap.m.Button(oController.PAGEID +  "_Button11",{ 
			icon : "sap-icon://navigation-right-arrow",
			press :  common.ZipSearch.clickNextBtn}) ;
		oLayout.addContent(oButton11);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text  : ""
			})
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oLayout,
			colSpan : 3,
			vAlign : "Middle",
			hAlign : "Center",
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_ZipSearchDialog", {
			content :[oContentMatrix] ,
			contentWidth : "700px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2796"),	// 2796:주소 검색
			buttons : [ new sap.m.Button({text : oBundleText.getText("LABEL_0037"), press : common.ZipSearch.onSelectAddress}),	// 37:선택
						new sap.m.Button({text : oBundleText.getText("LABEL_0071"), press : common.ZipSearch.onClearAddress}),	// 71:취소
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0017"), 	// 17:닫기
							press : function(oEvent){oDialog.close();}
						})],
			beforeOpen : common.ZipSearch.onInit			
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		
		return oDialog;
	}

});
