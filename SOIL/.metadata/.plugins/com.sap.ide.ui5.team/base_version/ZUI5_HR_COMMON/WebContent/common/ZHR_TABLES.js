jQuery.sap.declare("common.ZHR_TABLES");
//CREATED BY TWKIM ()
common.ZHR_TABLES = {
		//각 셀의 내용, 컬럼 수, 셀 넓이
	autoMatrix : function(oController,TableNo,Contents,Columns,Widths){
		/*
			Contents: {Data : [
				{Control : [],HAlign : [],VAlign:[],ColSpan:[],RowSpan:[],Style:[]},		
				{Control : [],HAlign : [],VAlign:[],ColSpan:[],RowSpan:[],Style:[]},
				{Control : [],HAlign : [],VAlign:[],ColSpan:[],RowSpan:[],Style:[]}
			]}
		*/
		var c = sap.ui.commons;
		var oRow,oCell;
		var oMatrix = new c.layout.MatrixLayout();
		if(Widths){
			oMatrix.setWidths(Widths);
		}
		if(!Columns){
			oMatrix.setColumns(1);
		}else{
			oMatrix.setColumns(Columns);
		}
		for(var i=0;i<Contents.Data.length;i++){
			if(oController.PAGEID=="ZNK_ED_Sc"){
				if(i==1){
					oRow = new c.layout.MatrixLayoutRow();
				}else{
					oRow = new c.layout.MatrixLayoutRow({height : "33px"});
				}
				
			}else{
				oRow = new c.layout.MatrixLayoutRow();
			}			
			for(var j=0;j<Contents.Data[i].Control.length;j++){
				oCell = new c.layout.MatrixLayoutCell();
				oCell.addContent(Contents.Data[i].Control[j]).addStyleClass(Contents.Data[i].Style[j]);
				oCell.setHAlign(Contents.Data[i].HAlign[j]);
				oCell.setVAlign(Contents.Data[i].VAlign[j]);
				oCell.setColSpan(Contents.Data[i].ColSpan[j]);
				oCell.setRowSpan(Contents.Data[i].RowSpan[j]);
				oRow.addCell(oCell);
			}
			oMatrix.addRow(oRow);
		}
		return oMatrix;
	},
		
	cTable : function(oController, TableNo){
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_cTable" + TableNo,{
			enableColumnReordering : false,
			width : "100%",
			enableColumnFreeze : false,
			columnHeaderHeight  : 48,
			rowHeight : 48,
			selectionMode : sap.ui.table.SelectionMode.None,
			visibleRowCount : 10,
			minAutoRowCount : 5,
			visibleRowCountMode : sap.ui.table.VisibleRowCountMode.Interactive
		}); 

		return oTable;
	},
	
	mTable : function(oController, TableNo){
		var oTable = new sap.m.Table(oController.PAGEID + "_mTable" + TableNo,{
//			inset : false,
			backgroundDesign : sap.m.BackgroundDesign.Translucent,
			showSeparators : sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("LABEL_2458"),	// 2458:데이터가 없습니다.
//			width : "99%",
			fixedLayout : true});
		if(TableNo=="FTF"){
			oTable.setMode(sap.m.ListMode.SingleSelectLeft);
		}
		
		return oTable
	},
	
	cColumn : function(oController, oField){
		var oColumnList = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
//        	vAlign : "Middle",
        	sortProperty : oField,
//        	filtered : true,
        	autoResizable : true,
        	filterProperty : oField,
        	resizable : true,
			showFilterMenuEntry : true
		});
		
		return oColumnList;
	},
	
	/*
	 * 
	 */	
	makeColumn : function(oController, oTable, vColumnInfo){
		if(!oTable) return;
		if(!vColumnInfo || !vColumnInfo.length) return;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"});
		var oTableModel = oTable.getModel();
		
		var oColumns =oTable.getColumns();
		if(oColumns && oColumns.length && oColumns.length > 0) {
			
		} else{
			oTable.destroyColumns();
		}
		
		for(var i=0; i<vColumnInfo.length; i++) {
			var oColumn = new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
//	        	vAlign : "Middle",
	        	autoResizable : true,
	        	resizable : ("resize" in vColumnInfo[i] && vColumnInfo[i].resize === false) ? false : true,
				showFilterMenuEntry : true
			});			
			
			if(vColumnInfo[i].filter) {
				oColumn.setFilterProperty(vColumnInfo[i].type.indexOf("date") > -1 ? vColumnInfo[i].id + "Txt" : vColumnInfo[i].id);
			}
			
			if(vColumnInfo[i].sort) {
				oColumn.setSortProperty(vColumnInfo[i].id);
			}
			oColumn.addMultiLabel(new sap.ui.commons.TextView({text : vColumnInfo[i].label, textAlign : "Center", width : "100%"}).addStyleClass("FontFamilyBold"));
			if(vColumnInfo[i].plabel != "") {
				oColumn.addMultiLabel(new sap.ui.commons.TextView({text : vColumnInfo[i].plabel, textAlign : "Center", width : "100%"}).addStyleClass("FontFamilyBold"));
			}

			if(vColumnInfo[i].span > 0) {
				oColumn.setHeaderSpan([vColumnInfo[i].span, 1]);
			}
			
			if(vColumnInfo[i].width && vColumnInfo[i].width != "") {
				oColumn.setWidth(vColumnInfo[i].width);
			}
			
			if(vColumnInfo[i].align && vColumnInfo[i].align != "") {
				oColumn.setHAlign(vColumnInfo[i].align);
			}
			
			switch(vColumnInfo[i].type) {
				case "link" :
					oColumn.setTemplate(
						new sap.m.Link({
							text : "{" + vColumnInfo[i].id + "}", 
							press : oController.PressLink,
							customData : new sap.ui.core.CustomData({key : "Seqno",value : "{Seqno}"})
						})
					);
					
					break;
				case "string" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align
					}).addStyleClass("FontFamily"));
					
					break;
				case "string2" :
//					oColumn.setTemplate(new sap.m.FormattedText({
//						htmlText : "{" + vColumnInfo[i].id + "}", 
//						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align
//					}).addStyleClass("FontFamily"));
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : { parts : [ { path : vColumnInfo[i].id },{ path : "Tltype" }],
								 formatter: function(fVal1, fVal2) {
//									var pId = this.getParent().sId ;
									var pId = sap.ui.getCore().byId(this.getParent().sId);
									
//				 			        if (common.Common.checkNull(fVal2)){
//				 			        	$("#"+pId).css("background-color","#ffffff"); // white
//				 			        }else if(fVal2 == "X"){
//				 			        	$("#"+pId).css("background-color","#66CCFF"); // 하늘색
//				 			        }else if(fVal2 == "A"){
//				 			        	$("#"+pId).css("background-color","#2F75B5"); //파란색
//				 			        }
									if(fVal2 == "X"){
										this.addCustomData(new sap.ui.core.CustomData({key : "A", value : "ABC" , writeToDom : true}));
									}
									
									return fVal1;
							   }
						},
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
						
					}).addStyleClass("FontFamily"));
					break;	
				case "stringT" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
						customData : [new sap.ui.core.CustomData({key : "A", value : "{" + vColumnInfo[i].tooltip + "}"}),
						              new sap.ui.core.CustomData({key : "A", value : vColumnInfo[i].tooltipTitle }),
							],
						press : common.ZHR_TABLES.onOpenTooltip,
					}).addStyleClass("FontFamily"));
					break;
				case "string4" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : "Begin"}).addStyleClass("FontFamily"));
					
					break;
				case "string5" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : { parts : [ { path : vColumnInfo[i].id },{ path : "Total" }],
								 formatter: function(fVal1, fVal2) {
									var pId = sap.ui.getCore().byId(this.getParent().sId);
				 			        if (common.Common.checkNull(fVal2)){
				 			        	$("#"+pId).css("background-color","#ffffff"); // white
				 			        }else if(fVal2 == "X"){
				 			        	$("#"+pId).css("background-color","#66CCFF"); // 하늘색
				 			        }
									return fVal1;
							   }
						},
						textAlign : "Center",
					}).addStyleClass("FontFamily"));
					break;	
				case "stringtotal" :
//					oColumn.setTemplate(new sap.ui.commons.TextView({
//						text : { parts : [ { path : vColumnInfo[i].id },{ path : vColumnInfo[i].id + "Avg" }],
//								 formatter: function(fVal1, fVal2) {
//									return fVal1 + "\n" + "(" + fVal2 + ")";
//							   }
//						},
//						textAlign : vColumnInfo[i].align,
//					}).addStyleClass("FontFamily"));
					oColumn.setTemplate(new sap.m.Link({
						text : { parts : [ { path : vColumnInfo[i].id },{ path : vColumnInfo[i].id + "Avg" }],
							 formatter: function(fVal1, fVal2) {
								return fVal1 + "\n" + "(" + fVal2 + ")";
						   }
						},
						textAlign : vColumnInfo[i].align,
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
//						press : oController.onPressRow
					}).addStyleClass("FontFamily"));
					break;	
				case "listText" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
//						textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
						press : oController.onPressRow
					}).addStyleClass("FontFamily"));
					
					break;
				case "listText8" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
//						textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
						press : oController.onPressStep
					}).addStyleClass("FontFamily"));
					
					break;
				case "listText7" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
//						textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
						press : oController.onPressRow
					}).addStyleClass("FontFamily2"));
					oColumn.removeAllMultiLabels();
					oColumn.addMultiLabel(new sap.ui.commons.TextView({text : vColumnInfo[i].label, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily2"));
					
					break;
				case "listText2" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Perid", value : "{Perid}"}),
						press : oController.onSelectList2
					}).addStyleClass("FontFamily"));
					
					break;
				case "listText3" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Perno", value : "{Perno}"}),
						press : oController.onSelectList2
					}).addStyleClass("FontFamily"));
					
					break;
				case "listText4" :
					oColumn.setTemplate(new sap.m.Link({
						//text : "{" + vColumnInfo[i].id + "}", 
						textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
						press : oController.onPressRow,
						text: {
							path: vColumnInfo[i].id,
							formatter: function(fVal){
								if(fVal){
									return fVal.replace(/^0+/, ''); 
								}
							}						
						}
					}).addStyleClass("FontFamily"));
					
					break;
				case "listText5" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : "Center",
						customData : [
							new sap.ui.core.CustomData({ key : "Apdoc", value : "{Apdoc}" }),
							new sap.ui.core.CustomData({ key : "Sgubn", value : "{Sgubn}" })
						],
						press : oController.onPressRow
					}).addStyleClass("FontFamily"));
					
					break;
				case "listText6" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
						press : oController.onPressRow
					}).addStyleClass("FontFamily PaddingLeft10"));
					
					break;
				case "listText8" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
						customData : new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"}),
						press : oController.onPressRow
					}).addStyleClass("FontFamily PaddingLeft10"));
					
					break;
				case "listText9" :
					oColumn.setTemplate(new sap.m.Link({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
						customData : [
							new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
							new sap.ui.core.CustomData({key : "Ename", value : "{Ename}"})
						],
						press : oController.onSelectRow
					}).addStyleClass("FontFamily PaddingLeft10"));
					
					break;
				case "cnumber" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
	//					text : "{" + vColumnInfo[i].id + "}", 
						text : {
							path : vColumnInfo[i].id,
							formatter : function(fVal){
								if(fVal) return parseInt(fVal);
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "cnumber2" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : vColumnInfo[i].id,
							formatter : function(fVal){
								if(fVal) return "" + parseInt(fVal);
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "listcert" :
					oColumn.setTemplate(new sap.ui.core.Icon({
						size : "1.1rem",
	//					src : "sap-icon://print",
						src : {path : "Certy",
							formatter : function(fVal) {
								if(fVal == "B3" ||fVal == "B4") return "sap-icon://message-information";
								else return "sap-icon://print";
							}
						},
						tooltip : {
							path : "Certy",
							formatter : function(fVal) {
								if(fVal == "B3" ||fVal == "B4") return oBundleText.getText("LABEL_2846");	// 2846:담당자 방문
								else return "";
							}
						},
						visible: {
							parts : [{ path : vColumnInfo[i].id }, { path : "ZappStatAl"}], 
							formatter : function(fVal1, fVal2) {
								if(fVal1 == "" && fVal2 == "50") return true;
								else return false;
							}
						},
						press : oController.onPrintCert,
						customData : [new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
							          new sap.ui.core.CustomData({key : "Certy", value : "{Certy}"}),
							          new sap.ui.core.CustomData({key : "Prcty", value : "Z"})]
					}));
					
					break;
					
				case "listcert2" :
					oColumn.setTemplate(new sap.ui.core.Icon({
						size : "1.1rem",
	//					src : "sap-icon://print",
						src : {path : "Certy",
							formatter : function(fVal) {
								if(fVal == "B3" ||fVal == "B4") return "sap-icon://message-information";
								else return "sap-icon://print";
							}
						},
						tooltip : {
							path : "Certy",
							formatter : function(fVal) {
								if(fVal == "B3" ||fVal == "B4") return oBundleText.getText("LABEL_2846");	// 2846:담당자 방문
								else return "";
							}
						},
						visible: {
							parts : [{ path : vColumnInfo[i].id }, { path : "ZappStatAl"}], 
							formatter : function(fVal1, fVal2) {
								if(fVal1 == "" && fVal2 == "50") return true;
								else return false;
							}
						},
						press : oController.onPrintCert,
						customData : [new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
							          new sap.ui.core.CustomData({key : "Certy", value : "{Certy}"}),
							          new sap.ui.core.CustomData({key : "Prcty", value : "V"})]
					}));
					
					break;
					
					
				case "listloan" :
					oColumn.setTemplate(new sap.ui.core.Icon({
						size : "1.1rem",
						src : "sap-icon://print",
						visible: {
							parts : [
								{ path : "Lnprt" }, 
								{ path : "Lonid" }, 
								{ path : "ZappStatAl"}
							], 
							formatter : function(fVal1, fVal2, fVal3) {
								if(fVal1 != "Y" && fVal2 != "" && fVal3 == "50") return true;
								else return false;
							}
						},
						press : oController.onPrintLoan,
						customData : [
							new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"})
						]
					}));
					
					break;
				case "listloan2" :
					oColumn.setTemplate(new sap.ui.core.Icon({
						size : "1.1rem",
						src : "sap-icon://print",
						visible: {
							parts : [
								{ path : "Zform" }
							], 
							formatter : function(fVal1) {
								if(fVal1 == "X") return true;
								else return false;
							}
						},
						press : oController.onPrintLoan2,
						customData : [
							new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"})
						]
					}));
					
					break;
				case "listcnumber" :
					oColumn.setTemplate(new sap.m.Link({
						text : {
							path : vColumnInfo[i].id,
							formatter : function(fVal){
								if(fVal) return parseInt(fVal);
							}
						},
						textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
						press : oController.onPressRow
					}).addStyleClass("FontFamily"));
					
					break;
				case "DeptListString" :
					oColumn.setTemplate(						
							new sap.m.Link({
								text : "{" + vColumnInfo[i].id + "}", 
								textAlign : "Center",
								customData : [new sap.ui.core.CustomData({key : "Gubun", value : "{Gubun}"}),
									  		  new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"})],
								press : oController.onPressDeptList
							}).addStyleClass("FontFamily")					
					);
					
					break;
				case "time" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : { 
							path : vColumnInfo[i].id,
						    formatter : function(fVal){
//						    	if(fVal && fVal != "0000"){
						    	if(fVal){
						    		return fVal.substring(0,2) + ":" + fVal.substring(2,4) ; 
						    	}
						    }
						},
					    textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "listtime" :
					oColumn.setTemplate(new sap.m.Link({
						text : { 
							path : vColumnInfo[i].id,
						    formatter : function(fVal){
//						    	if(fVal && fVal != "0000"){
					    		if(fVal){
						    		return fVal.substring(0,2) + ":" + fVal.substring(2,4) ; 
						    	}
						    }
						},
					    textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
						press : oController.onPressRow}).addStyleClass("FontFamily"));
					
					break;
				case "listmoney" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [ new sap.m.ToolbarSpacer(),
											new sap.m.Link({
												textAlign : "End",
												text : {path : vColumnInfo[i].id,
														formatter : function(x){
															 if(x == null || x == "") return "";
															 return (x*1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
														}
												},
												customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
												press : oController.onPressRow
											}).addStyleClass("FontFamily")]
							})
					);
					
					break;
				case "Zpayym" :
					oColumn.setTemplate(new sap.m.Text({
						text : { 
							path : vColumnInfo[i].id,
						    formatter : function(fVal){
						    	if(fVal && fVal != "" && fVal * 1 != 0){
						    		return fVal.substring(0,4) + "." + fVal.substring(4,6) ; 
						    	}else return "";
						    }
						},
					    textAlign : "Center",
					}).addStyleClass("FontFamily"));
					
					break;
				case "money" :
					oColumn.setTemplate(
							new sap.ui.commons.TextView({
								textAlign : "End",
								text : {path : vColumnInfo[i].id,
										formatter : function(x){
											 if(x == null || x == "") return "";
											 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
										}
								}
							}).addStyleClass("FontFamily")
					);
					
					break;
				case "money2" :
					oColumn.setTemplate(
							new sap.ui.commons.TextView({
								textAlign : "End",
								text : {path : vColumnInfo[i].id,
										formatter : function(x){
											 if(x == null || x == "") return "";
											 x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
											 return x.substring(0,x.length-3); 
										}
								}
							}).addStyleClass("FontFamily")
					);
					
					break;
				case "moneyColor" :
					oColumn.setTemplate(
						new sap.ui.commons.TextView({
							textAlign : "End",
							text : {path : vColumnInfo[i].id,
									formatter : function(x){
										 if(x == null || x == ""){
											 return "";
										 }else{
											 if(x * 1 < 0){
												 this.removeStyleClass("FontFamily");
												 this.addStyleClass("FontFamilyRed"); 
											 }else{
												 this.removeStyleClass("FontFamilyRed");
												 this.addStyleClass("FontFamily");
											 }
											 return (x*1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
										 }
									}
							}
						})
					);
					
					break;
				case "number" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : "Right"}).addStyleClass("FontFamily"));
					
					break;
				case "onlyNumber" :
					oColumn.setTemplate(
							new sap.m.Input({liveChange : common.ZHR_TABLES.onlyNumber, value : "{" + vColumnInfo[i].id + "}"}).addStyleClass("FontFamily")					
					);
					
					break;
				case "Checkbox" :
					oColumn.setTemplate(new sap.m.CheckBox({
						selected  : "{" + vColumnInfo[i].id + "}" 
							}).addStyleClass("FontFamily"));
					oColumn.setWidth("50px");
					oColumn.setSorted(false);
					
					break;
				case "Checkbox2" :
					oColumn.setTemplate(new sap.m.CheckBox({
						selected  : "{" + vColumnInfo[i].id + "}",
						editable : false
							}).addStyleClass("FontFamily"));
					
					break;
				case "Checkbox3" :
					oColumn.setTemplate(new sap.m.CheckBox({
						selected  : "{" + vColumnInfo[i].id + "}",
						editable : {
							parts : [{path : "ZappStatAl"}],
							formatter : function(fVal1){
								if(fVal1 == "" || fVal1 == "10" ){
									return true;
								} else {
									return false;
								}
							}
						},
						select : oController.selectCheckBox,
						customData : new sap.ui.core.CustomData({key : vColumnInfo[i].id,value : vColumnInfo[i].id})
					}).addStyleClass("FontFamily"));
					
					break;
				case "Checkbox4" :
					oColumn.setTemplate(new sap.m.CheckBox({
						selected  : { path : vColumnInfo[i].id, 
							formatter : function(fVal){
								return fVal == "X" ? true : false ;
							}
						},
						editable : false
					}).addStyleClass("FontFamily"));
					
					break;
				case "Checkbox5" :
					oColumn.setTemplate(new sap.m.CheckBox({
						selected  : "{" + vColumnInfo[i].id + "}" ,
						editable : false
							}).addStyleClass("FontFamily"));
					//oColumn.setWidth("40px");
					oColumn.setSorted(false);
					
					break;
				case "Checkbox6" :
					oColumn.setTemplate(new sap.m.CheckBox({
						selected  : { path : vColumnInfo[i].id, 
							formatter : function(fVal){
								return fVal == "Y";
							}
						},
						editable : false
							}).addStyleClass("FontFamily"));
					oColumn.setSorted(false);
					
					break;
				case "date" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal){
								if(!fVal) return '';
								return dateFormat.format(new Date(common.Common.setTime(fVal)));
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "listdate" :
					oColumn.setTemplate(new sap.m.Link({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal){
								if(!fVal) return '';
								return dateFormat.format(new Date(common.Common.setTime(fVal)));
							}
						},
						textAlign : "Center",
						customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
						press : oController.onPressRow}).addStyleClass("FontFamily"));
					
					break;
				case "listdate2" :
					oColumn.setTemplate(new sap.m.Link({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal){
								if(!fVal) return '';
								return dateFormat.format(new Date(common.Common.setTime(fVal)));
							}
						},
						textAlign : "Center",
						customData : [
							new sap.ui.core.CustomData({ key : "Apdoc", value : "{Apdoc}" }),
							new sap.ui.core.CustomData({ key : "Sgubn", value : "{Sgubn}" })
						],
						press : oController.onPressRow}).addStyleClass("FontFamily"));
					
					break;
				case "listdate3" :
					oColumn.setTemplate(new sap.m.Link({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal){
								if(!fVal) return '';
								return dateFormat.format(new Date(common.Common.setTime(fVal)));
							}
						},
						textAlign : "Center",
						customData : [
							new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
							new sap.ui.core.CustomData({key : "Ename", value : "{Ename}"})
						],
						press : oController.onSelectRow
					}).addStyleClass("FontFamily"));
					
					break;
				case "date2" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal){
								if(!fVal) return '';
								return dateFormat.format(new Date(common.Common.setTime(fVal)));
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "date3" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							parts : [{path : vColumnInfo[i].id.split(",")[0]},{path : vColumnInfo[i].id.split(",")[1]}],formatter : function(fVal1,fVal2){
								if(fVal1&&fVal2){
									return fVal1 + "-" + fVal2;
								}else{
									return "";
								}
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "date4" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal){
								var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
								console.log(fVal);
								if (!fVal) return ""; 
								else if(fVal.indexOf("-") > 0) return dateFormat.format(new Date(fVal));
								else return fVal;
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "button" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal){
								if(!fVal) return '';
								return dateFormat.format(new Date(common.Common.setTime(fVal)));
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "bookbutton" :
					oColumn.setTemplate(new sap.m.Button({
						text : oBundleText.getText("LABEL_2847"),	// 2847:보기
						visible : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal){
								if(!common.Common.checkNull(fVal)) return true;
								else return false;
							}
						},
						press : function(evt){
							var vUrl = evt.getSource().getCustomData()[0].getValue();
							if(!common.Common.checkNull(vUrl)){
								window.open(vUrl);	
							}
							
						}
					}).addCustomData(new sap.ui.core.CustomData({key : "Zurl", value : "{"+vColumnInfo[i].id + "}"}))
					.addStyleClass("FontFamily"));
	
					break;	
				case "radio" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal) {
								if (fVal == "X") {
									return "O";
								} else {
									return "X";
								}
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "radio2" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : vColumnInfo[i].id, 
							formatter : function(fVal) {
								if (fVal == "X") {
									return "Y";
								} else {
									return "N";
								}
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily"));
					
					break;
				case "note" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : "Begin"}).addStyleClass("FontFamily"));
					
					break;
				case "listnote" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [ new sap.m.Link({
												text : "{" + vColumnInfo[i].id + "}", 
												textAlign : "Begin",
												customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
												press : oController.onPressRow}).addStyleClass("FontFamily"),
											new sap.m.ToolbarSpacer()]
							})	
						);
					
					break;
				case "listnoteC" :
					oColumn.setTemplate(
							new sap.m.Link({
										text : "{" + vColumnInfo[i].id + "}", 
										textAlign : "Center",
										customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
										press : oController.onPressRow}).addStyleClass("FontFamily")
					);
					
					break;
				case "popover" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [new sap.m.Link({
												text : "{" + vColumnInfo[i].id + "}",
												textAlign : "Begin",
												press : oController.onEmpListPopover,
												customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"})
											}).addStyleClass("FontFamily")]
							})					
					);
					
					break;
				case "commentpopover" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [new sap.m.ToolbarSpacer(),
										   new sap.ui.core.Icon({
											size : "1rem",
											src : "sap-icon://document-text",
											visible : {
												parts : [ {path : "Symptn"},  {path : "ZappResn"} ],
												formatter : function(fVal1, fVal2) {
													if((fVal1 && fVal1 != "" ) || (fVal2 && fVal2 != "" )) return true;
													else return false;
												}
											},
											press : common.ZHR_TABLES.onOpenZappResn,
											customData : [new sap.ui.core.CustomData({key : "Symptn", value : "{Symptn}"}),
										              	 new sap.ui.core.CustomData({key : "ZappResn", value : "{ZappResn}"})]
										  }),
										  new sap.m.ToolbarSpacer()]
							})					
					);
					
					break;
				case "commentpopover2" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [new sap.m.ToolbarSpacer(),
										   new sap.ui.core.Icon({
											size : "1rem",
											src : "sap-icon://document-text",
											visible : {
												parts : [ {path : "Zbigo"},  {path : "ZappResn"} ],
												formatter : function(fVal1, fVal2) {
													if((fVal1 && fVal1 != "" ) || (fVal2 && fVal2 != "" )) return true;
													else return false;
												}
											},
											press : common.ZHR_TABLES.onOpenZappResn,
											customData : [new sap.ui.core.CustomData({key : "Zbigo", value : "{Zbigo}"}),
										              	 new sap.ui.core.CustomData({key : "ZappResn", value : "{ZappResn}"})]
										  }),
										  new sap.m.ToolbarSpacer()]
							})					
					);
					
					break;
				case "commentpopover3" :
					oColumn.setTemplate(
							new sap.m.Link({
								text : {
									parts : [ {path : "Symptn"},  {path : "ZappResn"} ],
									formatter : function(fVal1, fVal2) {
										var txt1 = common.Common.checkNull(fVal1) ? "" : fVal1 ;
										var txt2 = common.Common.checkNull(fVal2) ? "" : fVal2 ;
										return txt1 +" "+ txt2;
									}
								},
//								text : "{Symptn}",
								textAlign : "Begin",
								press : common.ZHR_TABLES.onOpenZappResn,
								customData : [new sap.ui.core.CustomData({key : "Symptn", value : "{Symptn}"}),
							              	 new sap.ui.core.CustomData({key : "ZappResn", value : "{ZappResn}"})]
							}).addStyleClass("FontFamily")			
					);	
					break;
				
				case "popoverC" :
					oColumn.setTemplate(
							new sap.m.Link({
								text : "{" + vColumnInfo[i].id + "}",
								textAlign : "Center",
								press : oController.onEmpListPopover,
								customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"})
							}).addStyleClass("FontFamily")
					);
					
					break;
				case "popover2" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [new sap.m.ToolbarSpacer(),
											new sap.m.Link({
												text : "{" + vColumnInfo[i].id + "}",
												press : oController.onEmpListPopover,
												customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"})
											}).addStyleClass("FontFamily"),
											new sap.m.ToolbarSpacer()]
							})					
					);
					
					break;
				case "popover3" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [new sap.m.ToolbarSpacer(),
										   new sap.ui.core.Icon({
												size : "0.875rem",
												src : "sap-icon://puzzle",
												visible: {
													path : vColumnInfo[i].id,
													formatter : function(fVal) {
														if(fVal && fVal != "") return true;
														else return false;
													}
												},
												press : oController.onPopover,
												customData : new sap.ui.core.CustomData({key : "ZappResn", value : "{ZappResn}"})
											}),
											new sap.m.ToolbarSpacer()]
							})					
					);
					
					break;
				case "Calrsn" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [new sap.m.ToolbarSpacer(),
										   new sap.ui.core.Icon({
												size : "0.875rem",
												src : "sap-icon://display",
												press : oController.onCalrsn,
												customData : new sap.ui.core.CustomData({key : "Calrsn", value : "{Calrsn}"})
											}),
											new sap.m.ToolbarSpacer()]
							})					
					);
					
					break;
				case "Zschedule" :
					oColumn.setTemplate(
							new sap.m.Toolbar({
								content : [new sap.m.ToolbarSpacer(),
										   new sap.ui.core.Icon({
												size : "0.875rem",
												src : "sap-icon://display",
												press : oController.onZschedule,
												customData : new sap.ui.core.CustomData({key : "Zschedule", value : "{Zschedule}"})
											}),
											new sap.m.ToolbarSpacer()]
							})					
					);
					
					break;
				case "image" :
					oColumn.setTemplate(
						new sap.m.Image({
							width : "42px",
							height : "54px",
							src : "{" + vColumnInfo[i].id + "}"
						}).addStyleClass("PaddingTop3")
					);
					
					break;
				case "file" :
					oColumn.setTemplate(
							new sap.ui.core.Icon({
								size : "15px",
								src : "sap-icon://attachment",
								press :common.ZHR_TABLES.onOpenAttachList,
								customData : [new sap.ui.core.CustomData({key : "Controller",value:oController}),
									          new sap.ui.core.CustomData({key : "Appno",value:"{Appno}"})],
								visible: {
									path : vColumnInfo[i].id,
									formatter : function(fVal) {
										if(fVal && fVal == "Y") return true;
										else return false;
									}
								},
							})
					);
					
					break;
				case "ptifile" :
					oColumn.setTemplate(
							new sap.ui.core.Icon({
								size : "15px",
								src : "sap-icon://attachment",
								press :common.ZHR_TABLES.onOpenPTIAttachList,
								customData : [new sap.ui.core.CustomData({key : "Appno",value:"{Appno}"}),
									          new sap.ui.core.CustomData({key : "Orgeh",value:"{Orgeh}"}),
									          new sap.ui.core.CustomData({key : "Orgtx",value:"{Orgtx}"}),
									          new sap.ui.core.CustomData({key : "Perid",value:"{Perid}"}),
									          new sap.ui.core.CustomData({key : "Ename",value:"{Ename}"}),
									],
								visible: {
									path : vColumnInfo[i].id,
									formatter : function(fVal) {
										if(fVal && fVal == "Y") return true;
										else return false;
									}
								},
							})
					);
					
					break;
				case "StatusIcon" :
					oColumn.setTemplate(
						new sap.ui.core.Icon({
							size : "1rem",
							src : "sap-icon://circle-task-2",
							color: {
								path : vColumnInfo[i].id,
								formatter : function(fVal) {
									var vColor = "";
									switch (fVal) {
										case "1" : 
											vColor = sap.ui.core.IconColor.Negative;
											break;
										case "2" :
											vColor = sap.ui.core.IconColor.Critical;
											break;
										case "3" :
											vColor = "#f5f242";
											break;
										case "4" :
											vColor = sap.ui.core.IconColor.Positive;
											break;
										default : 
											vColor = sap.ui.core.IconColor.Contrast;
											break;
									}
									return vColor;
								}
							},
							visible : {
								path : vColumnInfo[i].id,
								formatter : function(fVal) {
									return (fVal && fVal != "") ? true : false;
								}
							}
						})
					);
					
					break;
				case "CheckIcon" :
					oColumn.setTemplate(
						new sap.ui.core.Icon({
							size : "0.875rem",
							src : "sap-icon://accept",
							visible: {
								path : vColumnInfo[i].id,
								formatter : function(fVal) {
									return fVal == "X" ? true : false;
								}
							}
						})
					);
					
					break;
				case "DocIcon" :
					oColumn.setTemplate(
							new sap.ui.core.Icon({
								size : "0.875rem",
								src : "sap-icon://document-text",
								visible: {
									path : vColumnInfo[i].id,
									formatter : function(fVal) {
										return fVal ? true : false;
									}
								},
								customData : [new sap.ui.core.CustomData({key : "Url", value:"{ZappUrl}"})],
								press : oController.openZappUrl
							})
						);
					
					break;
				case "DocIcon1" :
					oColumn.setTemplate(
							new sap.ui.core.Icon({
								size : "0.875rem",
								src : "sap-icon://document-text",
								customData : [new sap.ui.core.CustomData({key : "Url", value:"{ZappUrl}"}),
									new sap.ui.core.CustomData({key : "Idx", value:"{Idx}"})
									],
								press : oController.openZappUrl
							})
						);
					
					break;
				case "formatter" :
					if(vColumnInfo[i].id == "Apprvyn") {
						oColumn.setTemplate(new sap.ui.commons.TextView({
							text : {
								path : vColumnInfo[i].id, 
								formatter : function(fVal){
									if(fVal){
										if(fVal=="1"){
											return oBundleText.getText("LABEL_0041");	// 41:승인
										}else if(fVal=="9"){
											return oBundleText.getText("LABEL_0024");	// 24:반려
										} else return "";
									}
								}
							},
							textAlign : "Center"}).addStyleClass("FontFamily"));
					} else if(vColumnInfo[i].id == "Ghchk" || vColumnInfo[i].id == "Lhchk") {
						oColumn.setTemplate(new sap.ui.commons.TextView({
							text : {
								path : vColumnInfo[i].id, 
								formatter : function(fVal) {
									if (fVal == "Y" || fVal == "X") {
										return oBundleText.getText("LABEL_2848");	// 2848:검진대상
									} else {
										return "";
									}
								}
							},
							textAlign : "Center"}).addStyleClass("FontFamily"));
					} else if(vColumnInfo[i].id == "ZappStatAl") {
						oColumn.setTemplate(
								new sap.ui.commons.TextView({
									textAlign : "Center",
									text:{
										path : "ZappStatAl" ,
										formatter : function(fVal){
											if(fVal == "10") return oBundleText.getText("LABEL_0059");	// 59:작성중
											else if(fVal == "20") return oBundleText.getText("LABEL_2849");	// 2849:신청
											else if(fVal == "30") return oBundleText.getText("LABEL_1648");	// 1648:담당자승인
											else if(fVal == "35") return oBundleText.getText("LABEL_1647");	// 1647:담당자반려
											else if(fVal == "40") return oBundleText.getText("LABEL_0997");	// 997:기안
											else if(fVal == "50") return oBundleText.getText("LABEL_0041");	// 41:승인
											else if(fVal == "55") return oBundleText.getText("LABEL_0024");	// 24:반려
											else if(fVal == "90") return oBundleText.getText("LABEL_0071");	// 71:취소
										}
										
									},
									semanticColor: {
										path : "ZappStatAl", 
										formatter : function(fVal) {
											if(fVal == "10") return "Default";
											else if(fVal == "20"){
												if(_gAuth && _gAuth == "H") return "Default";
												else							return "Critical";
											}
											else if(fVal == "30") return "Positive";
											else if(fVal == "35") return "Negative";
											else if(fVal == "40") return "Critical";
											else if(fVal == "50") return "Default";
											else if(fVal == "55") return "Negative";
											else if(fVal == "90") return "Negative";
											
										}
									},
								}).addStyleClass("15Font")
							);
					} else if(vColumnInfo[i].id == "Zrest") {
						oColumn.setTemplate(
								new sap.ui.commons.TextView({
									textAlign : "Center",
									text:{
										path : "Zrest" ,
										formatter : function(fVal){
											if(fVal == "10") return oBundleText.getText("LABEL_0059");	// 59:작성중
											else if(fVal == "11") return oBundleText.getText("LABEL_2850");	// 2850:면접자반려
											else if(fVal == "20") return oBundleText.getText("LABEL_2849");	// 2849:신청
											else if(fVal == "30") return oBundleText.getText("LABEL_1648");	// 1648:담당자승인
											else if(fVal == "50") return oBundleText.getText("LABEL_0041");	// 41:승인
											else if(fVal == "55") return oBundleText.getText("LABEL_0024");	// 24:반려
											else if(fVal == "90") return oBundleText.getText("LABEL_0071");	// 71:취소
										}
										
									},
									semanticColor: {
										path : "Zrest", 
										formatter : function(fVal) {
											if(fVal == "10") return "Default";
											else if(fVal == "20"){
												if(_gAuth && _gAuth == "H") return "Default";
												else	return "Critical";
											}
											else if(fVal == "30") return "Positive";
											else if(fVal == "50") return "Default";
											else if(fVal == "11" || fVal == "55") return "Negative";
											else if(fVal == "90") return "Negative";
											
										}
									},
								}).addStyleClass("15Font")
							);
					} else if(vColumnInfo[i].id == "Statx") {
						oColumn.setTemplate(
								new sap.ui.commons.TextView({
									textAlign : "Center",
									text : {
										parts : [{path : "Statx"}, {path : "Stacd"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 && fVal2 == "0"){
												this.addStyleClass("colorOrange");
											} else if(fVal1 && fVal2 == "1"){
												this.addStyleClass("colorGreen2");
											} else if(fVal1 && fVal2 == "2"){
												this.addStyleClass("colorBlue");
											} else if(fVal1 && fVal2 == "3"){
												this.addStyleClass("colorRed");
											}
											return fVal1;
										}
									}
								}).addStyleClass("15FontBold")
							);
					} else if(vColumnInfo[i].id == "Sstat") {
						oColumn.setTemplate(
								new sap.ui.commons.TextView({
									textAlign : "Center",
									text : "{Sstatt}",
									semanticColor: {
										path : "Sstat", 
										formatter : function(fVal) {
											if(fVal == "1") return "Default";
											else if(fVal == "2"){
												if(_gAuth && _gAuth == "H") return "Default";
												else							return "Critical";
											}
											else if(fVal == "3") return "Default";
										}
									}
								}).addStyleClass("15FontBold")
						);
					} else if(vColumnInfo[i].id == "Aprtype") {
						oColumn.setTemplate(
								new sap.ui.commons.TextView({
									textAlign : "Center",
									text: {
										path : "Aprtype", 
										formatter : function(fVal) {
											if(fVal == "A03001") return oBundleText.getText("LABEL_1471");	// 1471:결재
											else if(fVal == "A03008") return oBundleText.getText("LABEL_2757");	// 2757:협조
											else if(fVal == "A03015") return oBundleText.getText("LABEL_2758");	// 2758:후열
										}
									},
								}).addStyleClass("15FontBold")
							);
					} 
					
					break;
				default :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : "{" + vColumnInfo[i].id + "}", 
						textAlign : "Center"
					}).addStyleClass("FontFamily"));
				
					break;
			}
			
			oTable.addColumn(oColumn);
		}
		
	},
	
	/*
	 * 
	 */	
	makeColumn2 : function(oController, oTable, vColumnInfo){
		if(!oTable) return;
		if(!vColumnInfo || !vColumnInfo.length) return;
		
		var oColumns =oTable.getColumns();
		if(oColumns && oColumns.length && oColumns.length > 0) {
			
		} else{
			oTable.destroyColumns();
		}		
		
		for(var i=0; i<vColumnInfo.length; i++) {
			var oColumn = new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
//	        	vAlign : "Middle",
	        	autoResizable : true,
	        	resizable : false,
				showFilterMenuEntry : true
			});			
			
			if(vColumnInfo[i].filter) {
				oColumn.setFilterProperty(vColumnInfo[i].id);
//				oColumn.setShowFilterMenuEntry(true);
			}
			
			if(vColumnInfo[i].sort) {
				oColumn.setSortProperty(vColumnInfo[i].id);
//				oColumn.setShowSortMenuEntry(false);
			}
			oColumn.addMultiLabel(new sap.m.Text({text : vColumnInfo[i].label, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
			if(vColumnInfo[i].plabel != "") {
				oColumn.addMultiLabel(new sap.m.Text({text : vColumnInfo[i].plabel, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
			}
			if(vColumnInfo[i].plabel2 && vColumnInfo[i].plabel2 != "") {
				oColumn.addMultiLabel(new sap.m.Text({text : vColumnInfo[i].plabel2, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
			}
//			oColumn.addMultiLabel(new sap.ui.commons.TextView({text : vColumnInfo[i].label, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
			
			if(vColumnInfo[i].span > 0) {
				if(vColumnInfo[i].multispan && vColumnInfo[i].multispan > 0) oColumn.setHeaderSpan([vColumnInfo[i].span, vColumnInfo[i].multispan, 1]);
				else oColumn.setHeaderSpan([vColumnInfo[i].span, 1]);
			}
			
			if(vColumnInfo[i].width && vColumnInfo[i].width != "") {
				oColumn.setWidth(vColumnInfo[i].width);
			}
			
			if(vColumnInfo[i].align && vColumnInfo[i].align != "") {
				oColumn.setHAlign(vColumnInfo[i].align);
			}
			
			if(vColumnInfo[i].type=="link"){
				oColumn.setTemplate(
						new sap.m.Link({
							text : "{" + vColumnInfo[i].id + "}", 
							press : oController.PressLink,
							customData : new sap.ui.core.CustomData({key : "Seqno",value : "{Seqno}"})
						})
				);
			} else if(vColumnInfo[i].type == "string") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
					}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "string2") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : "End"}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "string3") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : {
						path : vColumnInfo[i].id,
						formatter : function(fVal){
							return common.Common.numberWithCommas(fVal);
						}
					},
					textAlign : "End"}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "string4") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : "Begin"}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listText") {
				oColumn.setTemplate(new sap.m.Link({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : "Center",
					customData : [new sap.ui.core.CustomData({key : vColumnInfo[i].id, value : vColumnInfo[i].id}),
								  new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
								  new sap.ui.core.CustomData({key : "Check", value : "{Check}"})],
					press : oController.onPressRow
				}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listText2") {
				oColumn.setTemplate(new sap.m.Link({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : "Center",
					customData : [new sap.ui.core.CustomData({key : vColumnInfo[i].id, value : vColumnInfo[i].id}),
								  new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})],
					press : oController.onPressRow1
				}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listText3") { 
				oColumn.setHAlign("End");
//				oColumn.setTemplate(
//						new sap.m.Toolbar({
//							content : [ new sap.m.ToolbarSpacer(),
//										new sap.m.Link({
//											textAlign : "End",
//											text : "{" + vColumnInfo[i].id + "}", 
//											customData : [new sap.ui.core.CustomData({key : vColumnInfo[i].id, value : vColumnInfo[i].id}),
//														  new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
//														  new sap.ui.core.CustomData({key : "Check", value : "{Check}"})],
//											press : oController.onPressRow
//										}).addStyleClass("FontFamily")]
//						}).addStyleClass("noPadding") 
//				);
				oColumn.setTemplate(new sap.m.Link({
					text : "{" + vColumnInfo[i].id + "}", 
					customData : [new sap.ui.core.CustomData({key : vColumnInfo[i].id, value : vColumnInfo[i].id}),
								  new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
								  new sap.ui.core.CustomData({key : "Check", value : "{Check}"})],
					press : oController.onPressRow
				}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listAmt") { 
				oColumn.setHAlign("End");
				oColumn.setTemplate(new sap.m.Link({
					text : {
						path : vColumnInfo[i].id,
						formatter : function(fVal){
							return common.Common.numberWithCommas(fVal);
						}
					},
					customData : [new sap.ui.core.CustomData({key : vColumnInfo[i].id, value : vColumnInfo[i].id}),
								  new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
								  new sap.ui.core.CustomData({key : "Check", value : "{Check}"})],
					press : oController.onPressRow
				}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "cnumber") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
//					text : "{" + vColumnInfo[i].id + "}", 
					text : {
						path : vColumnInfo[i].id,
						formatter : function(fVal){
							if(fVal) return parseInt(fVal);
						}
					},
					textAlign : "Center"}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listcnumber") {
				oColumn.setTemplate(new sap.m.Link({
					text : {
						path : vColumnInfo[i].id,
						formatter : function(fVal){
							if(fVal) return parseInt(fVal);
						}
					},
					textAlign : "Center",
					customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
					press : oController.onPressRow
				}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "time"){
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : { 
						path : vColumnInfo[i].id,
					    formatter : function(fVal){
					    	if(fVal && fVal != "0000"){
					    		return fVal.substring(0,2) + ":" + fVal.substring(2,4) ; 
					    	}
//					    	else{
//					    		return "00:00";
//					    	}
					    }
					},
				    textAlign : "Center"}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listtime"){
				oColumn.setTemplate(new sap.m.Link({
					text : { 
						path : vColumnInfo[i].id,
					    formatter : function(fVal){
					    	if(fVal && fVal != "0000"){
					    		return fVal.substring(0,2) + ":" + fVal.substring(2,4) ; 
					    	}
					    }
					},
				    textAlign : "Center",
					customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
					press : oController.onPressRow}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listmoney") {
				oColumn.setTemplate(
						new sap.m.Toolbar({
							content : [ new sap.m.ToolbarSpacer(),
										new sap.m.Link({
											textAlign : "End",
											text : {path : vColumnInfo[i].id,
													formatter : function(x){
														 if(x == null || x == "") return "";
														 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
													}
											},
											customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
											press : oController.onPressRow
										}).addStyleClass("FontFamily")]
						})
				);
			}else if(vColumnInfo[i].type == "money") {
				oColumn.setTemplate(
						new sap.ui.commons.TextView({
							textAlign : "End",
							text : {path : vColumnInfo[i].id,
									formatter : function(x){
										 if(x == null || x == "") return "";
										 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
									}
							}
						}).addStyleClass("FontFamily")
				);
			}else if(vColumnInfo[i].type == "listmoney2") {
				oColumn.setTemplate(
						new sap.m.Link({
							text : {path : vColumnInfo[i].id,
									formatter : function(x){
										 if(x == null || x == "") return "";
										 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
									}
							},
							customData : new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
							press : oController.onPressRow
						}).addStyleClass("FontFamily")
				);
				oColumn.setHAlign("End");
			}else if(vColumnInfo[i].type == "number") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : "Right"}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "date") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : {
						path : vColumnInfo[i].id, 
						type : new sap.ui.model.type.Date({pattern: "yyyy.MM.dd"})
					},
					textAlign : "Center"}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listdate") {
				oColumn.setTemplate(new sap.m.Link({
					text : {
						path : vColumnInfo[i].id, 
						type : new sap.ui.model.type.Date({pattern: "yyyy.MM.dd"})
					},
					textAlign : "Center",
					customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
					press : oController.onPressRow}).addStyleClass("FontFamily"));
			} else if(vColumnInfo[i].type == "listdate2") {
				oColumn.setTemplate(new sap.m.Link({
					text : {
						path : vColumnInfo[i].id, 
						type : new sap.ui.model.type.Date({pattern: "yyyy.MM.dd"})
					},
					textAlign : "Center",
					customData : [
						new sap.ui.core.CustomData({ key : "Apdoc", value : "{Apdoc}" }),
						new sap.ui.core.CustomData({ key : "Sgubn", value : "{Sgubn}" })
					],
					press : oController.onPressRow}).addStyleClass("FontFamily"));
			}else if(vColumnInfo[i].type == "Zpayym"){
				oColumn.setTemplate(new sap.m.Text({
					text : { 
						path : vColumnInfo[i].id,
					    formatter : function(fVal){
					    	if(fVal && fVal != "" && fVal * 1 != 0){
					    		return fVal.substring(0,4) + "." + fVal.substring(4,6) ; 
					    	}else return "";
					    }
					},
				    textAlign : "Center",
				}).addStyleClass("FontFamily")); 
			}else if(vColumnInfo[i].type == "bp"){
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : {
						parts : [{path : vColumnInfo[i].id.split(",")[0]},{path : vColumnInfo[i].id.split(",")[1]}],formatter : function(fVal1,fVal2){
							if(fVal1 || fVal2){
								return fVal1 + " / " + fVal2;
							}
						}
					},
					textAlign : "Center"}).addStyleClass("FontFamily"));			
			} else if(vColumnInfo[i].type == "note"){
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : "Begin"}).addStyleClass("FontFamily"));	
			} else if(vColumnInfo[i].type == "listnote"){
				oColumn.setTemplate(
					new sap.m.Toolbar({
						content : [ new sap.m.Link({
										text : "{" + vColumnInfo[i].id + "}", 
										textAlign : "Begin",
										customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}),
										press : oController.onPressRow}).addStyleClass("FontFamily"),
									new sap.m.ToolbarSpacer()]
					})	
				);	
			}else if(vColumnInfo[i].type == "file") {
				oColumn.setTemplate(
						new sap.ui.core.Icon({
							size : "15px",
							src : "sap-icon://attachment",
							press :common.ZHR_TABLES.onOpenAttachList,
							customData : [new sap.ui.core.CustomData({key : "Controller",value:oController}),
								          new sap.ui.core.CustomData({key : "Appno",value:"{Appno}"})],
							visible: true
						})
				);
			} else if(vColumnInfo[i].type == "cntPer") {
				oColumn.setTemplate(
						new sap.ui.layout.HorizontalLayout({
							allowWrapping : true,
							content : [
								new sap.ui.layout.VerticalLayout({
									content : [
										new sap.m.Text({
											text : {
												path : vColumnInfo[i].id,
												formatter : function(fVal){
													this.removeStyleClass("colorBlue colorRed");
													
													if(parseFloat(fVal) > 0){
														this.addStyleClass("colorRed");
														return "▲";
													} else if(parseFloat(fVal) < 0){
														this.addStyleClass("colorBlue");
														return "▼";
													} else return "";
											}
										}}).addStyleClass("FontFamily")
									]
								}).addStyleClass("PaddingRightRem"),
								new sap.ui.layout.VerticalLayout({
									content : [
										new sap.m.Link({
											text : {
												path : vColumnInfo[i].id,
												formatter : function(fVal){
													if(fVal && parseFloat(fVal) == 0) return "";
													else if(fVal) return Math.abs(parseFloat(fVal));
													else return "";
												}
											}
										}).addStyleClass("FontFamily")
									]
								})
							]
						})
				);
			} else if(vColumnInfo[i].type == "cntAmt") {
				oColumn.setHAlign("End");
				oColumn.setTemplate(
						new sap.ui.layout.HorizontalLayout({
							allowWrapping : true,
							content : [
								new sap.ui.layout.VerticalLayout({
									content : [
										new sap.m.Text({
											text : {
												path : vColumnInfo[i].id,
												formatter : function(fVal){
													this.removeStyleClass("colorBlue colorRed");
													
													if(parseFloat(fVal) > 0){
														this.addStyleClass("colorRed");
														return "▲";
													} else if(parseFloat(fVal) < 0){
														this.addStyleClass("colorBlue");
														return "▼";
													} else return "";
											}
										}}).addStyleClass("FontFamily")
									]
								}).addStyleClass("PaddingRightRem"),
								new sap.ui.layout.VerticalLayout({
									content : [
										new sap.m.Link({
											text : {
												path : vColumnInfo[i].id,
												formatter : function(fVal){
													if(fVal && parseFloat(fVal) == 0) return "";
													else if(fVal) return common.Common.numberWithCommas(Math.abs(parseFloat(fVal)));
													else return "";
												}
											}
										}).addStyleClass("FontFamily")
									]
								})
							]
						})
				);
			} else {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : "Center"}).addStyleClass("FontFamily"));
			}
			oTable.addColumn(oColumn);
		}
		
	},
	
	//컨트롤러,테이블,헤더,타입,필드명,건수,필드사이즈,정렬,텍스트정렬
	autoColumn : function(oController,oTable,oHeaders,oTypes,oFields,rowLength,oSizes,oAligns,mLabel){	
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});
		oTable.removeAllColumns();
		if(oHeaders&&oHeaders.length){
			for(var i=0;i<oHeaders.length;i++){
				var cColumn = common.ZHR_TABLES.cColumn(oController , oFields[i]);
				if(oHeaders[i]!="checkbox"){
					if(mLabel){
						cColumn.addMultiLabel(new sap.ui.commons.TextView({text : mLabel[i].split(";;")[0]}).addStyleClass("FontFamilyBold"));
						cColumn.setHeaderSpan([parseInt(mLabel[i].split(";;")[1]),1]);
					}				
					cColumn.addMultiLabel(new sap.ui.commons.TextView({text : oHeaders[i]}).addStyleClass("FontFamilyBold"));
//					cColumn.addMultiLabel(new sap.m.Text({text : "gg \n gg"}).addStyleClass("FontFamily"));
					if(oAligns){
						cColumn.setHAlign("Center");
					}
					if(oSizes){
						cColumn.setWidth(oSizes[i]);
					} 
					if(oTypes[i]=="string"){
						if(oAligns){
							cColumn.setTemplate(new sap.ui.commons.TextView({text : "{"+oFields[i]+"}", textAlign : oAligns[i]}).addStyleClass("FontFamily"));
						}else{
							cColumn.setTemplate(new sap.ui.commons.TextView({text : "{"+oFields[i]+"}", textAlign : "Center"}).addStyleClass("FontFamily"));
						}
					}else if(oTypes[i]=="double"){
						if(oAligns){
							cColumn.setTemplate(new sap.ui.commons.TextView({text :{parts:[{path:oFields[i].split(",")[0]},{path:oFields[i].split(",")[1]}],formatter:function(fVal1,fVal2){if(fVal1&&fVal2){
								return fVal1 + fVal2;
							}}}, textAlign : oAligns[i]}).addStyleClass("FontFamily WhiteSpace"));
						}else{
							cColumn.setTemplate(new sap.ui.commons.TextView({text :{parts:[{path:oFields[i].split(",")[0]},{path:oFields[i].split(",")[1]}],formatter:function(fVal1,fVal2){if(fVal1&&fVal2){
								return fVal1 + fVal2;
							}}}, textAlign : "Center"}).addStyleClass("FontFamily WhiteSpace"));
						}
					}else if(oTypes[i]=="string1"){
						if(oAligns){
							cColumn.setTemplate(new sap.ui.commons.TextView({text : "{"+oFields[i]+"}", textAlign : oAligns[i]}).addStyleClass("FontFamily WhiteSpace"));
						}else{
							cColumn.setTemplate(new sap.ui.commons.TextView({text : "{"+oFields[i]+"}", textAlign : "Center"}).addStyleClass("FontFamily WhiteSpace"));
						}
					}else if(oTypes[i]=="year"){
						if(oAligns){
							cColumn.setTemplate(new sap.ui.commons.TextView({text : "{"+oFields[i]+"} " + oBundleText.getText("LABEL_1623"), textAlign : oAligns[i]}).addStyleClass("FontFamily WhiteSpace"));	// 1623:년
						}else{
							cColumn.setTemplate(new sap.ui.commons.TextView({text : "{"+oFields[i]+"} " + oBundleText.getText("LABEL_1623"), textAlign : "Center"}).addStyleClass("FontFamily WhiteSpace"));	// 1623:년
						}
					}else if(oTypes[i]=="date"){
						cColumn.setTemplate(new sap.ui.commons.TextView({text : {path : oFields[i], type :  new sap.ui.model.type.Date({pattern : "yyyy.MM.dd"})}, textAlign : "Center"}).addStyleClass("FontFamily"));
					}else if(oTypes[i]=="radio"){
						cColumn.setWidth("35px");
						cColumn.setTemplate(
							new sap.m.RadioButton({groupName : "{Seqno}"}).addCustomData(new sap.ui.core.CustomData({key : "Seqno", value : "{Seqno}"}))
						);
					}else if(oTypes[i]=="check"){
						cColumn.setTemplate(new sap.m.CheckBox({
							selected  : "{" + oFields[i] + "}",
							select : oController.onCheckboxSelect
								}).addStyleClass("FontFamily"));
					}else if(oTypes[i] == "formatter") {
						if(oFields[i] == "ZappStxtAl") {
							cColumn.setTemplate(
									new sap.ui.commons.TextView({
										textAlign : "Center",
										text: "{ZappStxtAl}",
//										semanticColor: {
//											parts : [{path : "ZappStatAl"},{path : "ZappDate"}],
//											//Information : 파란색 , Warning : 주황색,  Success : 초록색, 											
//											formatter : function(fVal1,fVal2){
//												if(fVal1 == "20" ) return "Warning"; 
//												else if((fVal1 == "30" || fVal1 == "35" || fVal1 == "40" || fVal1 == "50") && ( fVal2 == null || fVal2 == "" )) return "Success"; //초록색 
//												else if((fVal1 == "30" || fVal1 == "35" || fVal1 == "40" || fVal1 == "50") && ( fVal2 != null && fVal2 != "" )) return "Information"; // 파란색
//												else if(fVal1 == "31" || fVal1 == "36" || fVal1 == "45" || fVal1 == "55") return "Error";
//												else return "None"; // 없음
//											}
//										},
									}).addStyleClass("FontFamily")
								);
						}
					}else if(oTypes[i]=="yn"){
						cColumn.setTemplate(
							new sap.m.Text({text : {path : oFields[i],formatter : function(fVal){
								if(fVal=="X"){
									return oBundleText.getText("LABEL_2851");	// 2851:예
								}else{
									return oBundleText.getText("LABEL_2852");	// 2852:아니오
								}
							}}})
						);
					} else if(oTypes[i] == "image") {
						cColumn.setTemplate(
							new sap.m.Image({src : "{"+oFields[i]+"}"})
						);
					}else if(oTypes[i] == "checkicon"){
						cColumn.setTemplate(
							new sap.ui.core.Icon({src : "sap-icon://accept",color:{path: oFields[i],formatter : function(fVal){
								if(fVal=="X" || fVal=="Y"){
									return "Red";
								}else{
									return "White";
								}
							}}})
						);
					}else if(oTypes[i] == "checkiconReverse"){
						cColumn.setTemplate(
								new sap.ui.core.Icon({src : "sap-icon://accept",color:{path: oFields[i],formatter : function(fVal){
									if(fVal=="X" || fVal=="Y"){
										return "White";
									}else{
										return "Red";
									}
								}}})
							);		
					}else if(oTypes[i] == "CheckboxIcon"){
						cColumn.setTemplate(
							new sap.ui.core.Icon({
								src : "sap-icon://accept",
								color : "Red",
								visible : {path:oFields[i], formatter:function(fVal){return fVal == "X" || fVal == "Y" ? true : false;}}
							})
						);
					}else if(oTypes[i] == "Checkbox") {
						cColumn.setTemplate(new sap.m.CheckBox({
							selected  : "{" + oFields[i] + "}" 
								}).addStyleClass("FontFamily"));
					}else if(oTypes[i]=="textArea"){
						cColumn.setTemplate(
								new sap.m.TextArea({text : {path : oFields[i]},
													rows : 2 }).addStyleClass("FontFamily")
							);
					}else if(oTypes[i]=="link"){
						cColumn.setTemplate(
								new sap.m.Link({
									text : "{" + oFields[i] + "}", 
									href : "{Uri}",
								    target : "_new"
	//								customData : new sap.ui.core.CustomData({key : "Seqno",value : i})
								}).addStyleClass("FontFamily")					
							);
					}else if(oTypes[i]=="time"){
						cColumn.setTemplate(new sap.ui.commons.TextView({
							text : { 
								path : oFields[i] ,
							    formatter : function(fVal){
							    	if(fVal && fVal != "0000"){
							    		return fVal.substring(0,2) + ":" + fVal.substring(2,4) ; 
							    	}
							    }
							},
						    textAlign : "Center"}).addStyleClass("FontFamily"));
					}else if(oTypes[i]=="datepicker"){
						cColumn.setTemplate(
								new sap.m.DatePicker({
									   width:"100%",
					            	   valueFormat : "yyyy.MM.dd",
					            	   displayFormat :				            		   
					            		   "long",
					            	   dateValue : "{"+oFields[i]+"}"
					           })
						);
					}else if(oTypes[i]=="input"){
						cColumn.setTemplate(
								new sap.m.Link({
									text : "{" + oFields[i] + "}", 
									href : "{Uri}",
								    target : "_new"
	//								customData : new sap.ui.core.CustomData({key : "Seqno",value : i})
								}).addStyleClass("FontFamily")					
							);
					}else if(oTypes[i]=="inputer"){
						cColumn.setTemplate(
								new sap.m.Input({
									width:"100%",
									value : "{" + oFields[i] + "}"
								}).addStyleClass("FontFamily")					
							);
					}else if(oTypes[i]=="inputerC"){
						cColumn.setTemplate(
								new sap.m.Input({
									editable : false,
									value : "{" + oFields[i] + "}"
								}).addStyleClass("FontFamily")					
						);
					}else if(oTypes[i]=="inputPernr"){
						cColumn.setTemplate(
								new sap.m.Input({
									width : "100%",
									valueHelpOnly : true,
									value : "{"+oFields[i]+"}",
									showValueHelp : true,
									editable : {path : "Stats",formatter : function(fVal){
										if(fVal=="B" || fVal==""){
											return true;
										}else{
											return false;
										}
									}},
									valueHelpRequest : oController.OpenPerson,
									customData : new sap.ui.core.CustomData({value : "{Seqno}",key : "Key"})}).addStyleClass("FontFamily")					
						);
					}else if(oTypes[i]=="onlyNumber"){
						cColumn.setTemplate(
								new sap.m.Input({liveChange : oController.onlyNum, value : "{"+oFields[i]+"}"}).addStyleClass("FontFamily")					
						);
					} else if(oTypes[i] == "popover3"){
						cColumn.setTemplate(
								new sap.m.Toolbar({
									content : [new sap.m.ToolbarSpacer(),
											   new sap.ui.core.Icon({
													size : "0.875rem",
													src : "sap-icon://puzzle",
													visible: {
														path : oFields[i],
														formatter : function(fVal) {
															if(fVal && fVal != "") return true;
															else return false;
														}
													},
													press : oController.onPopover,
													customData : new sap.ui.core.CustomData({key : "ZappResn", value : "{ZappResn}"})
												}),
												new sap.m.ToolbarSpacer()]
								})					
						);	
					}else if(oTypes[i]=="money"){
						cColumn.setTemplate(
								new sap.ui.commons.TextView({
									textAlign : "End",
									text : { path : oFields[i],
											 formatter : function(x){
												 if(x == null || x == "") return "";
												 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
											 }
											}
								}).addStyleClass("FontFamily")					
						);
					}else if(oTypes[i]=="shapeSelector"){
						var oSelector = new sap.m.Select({width : "100%", 
								selectedKey : "{"+oFields[i]+"}"
							});
						if(oData&&oData.Data.length){
							for(var a=0;a<oData.Data.length;a++){
								oSelector.addItem(new sap.ui.core.Item({text : oData.Data[a].Ztext, key : oData.Data[a].Zcode}));
							}						
						}
						cColumn.setTemplate(
								oSelector				
						);
					}else if(oTypes[i]=="formatter"){
						cColumn.setTemplate(
							new sap.ui.core.Icon({
								src: "sap-icon://status-completed", 
								color: {
									path : oFields[i],
									formatter : function(fVal) {
										if (fVal == "1") {
											return "#00FF00";
										} else {
											return "#FF0000";
										}
									}
								} 
							})
						);				
					}else if(oTypes[i]=="DoubleDate"){
	//					var vA = new sap.ui.commons.layout.MatrixLayout();
						var oRow,oCell;
						var vT = oFields[i].split("//");
						var vW = new sap.m.Text({text : {textAlign : "Center",path : vT[0], type :  new sap.ui.model.type.Date({pattern : "yyyy.MM.dd"})}, textAlign : "Center"});
						var vW2 = new sap.m.Text({text : {textAlign : "Center",path : vT[1], type :  new sap.ui.model.type.Date({pattern : "yyyy.MM.dd"})}, textAlign : "Center"});
						var oCon=[vW,new sap.ui.core.HTML({content : "<span style='font-family:Malgun Gothic;'>&nbsp;~&nbsp;</span>"}),vW2];					
						var vA = new sap.ui.commons.layout.HorizontalLayout({
							content : oCon
						});					
	//					for(var a=0;a<3;a++){
	//						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"14px"});
	//						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
	//							hAlign : "Center",
	//							content : oCon[a]
	//						});
	//						oRow.addCell(oCell);
	//						vA.addRow(oRow);
	//					}					
						cColumn.setTemplate(vA);						
					}else if(oTypes[i]=="DoubleReader"){
						cColumn.setTemplate(
						new sap.ui.commons.Button({styled:false,icon:"sap-icon://approvals",
							visible : {
								parts : [{path : oFields[i].split("//")[0]},{path : oFields[i].split("//")[1]}],
								formatter : function(fVal1,fVal2){
									if(fVal1==""&&fVal2==""){
										return false;
									}else{
										return true;
									}
								}
							},
							customData : [new sap.ui.core.CustomData({key : "Key1",value:"{"+oFields[i].split("//")[0]+"}"}),
							              new sap.ui.core.CustomData({key : "Key2",value:"{"+oFields[i].split("//")[1]+"}"})],
							press : oController.openPilyo
						}).addStyleClass("DailySearchedBox")
						);						
					}else if(oTypes[i]=="FileReader"){
						cColumn.setTemplate(
								new sap.ui.commons.Button({styled:false,icon:"sap-icon://attachment",
									visible : {
										path : oFields[i],
										formatter : function(fVal){
											if(fVal=="Y"){
												return true;
											}else if(fVal=="N"){
												return false;
											}
										}
									},
									customData : [new sap.ui.core.CustomData({key : "Key1",value:"{Reqid}"})],
									press : oController.openFileList
								}).addStyleClass("DailySearchedBox")
								);						
					}else if(oTypes[i]=="file"){
						cColumn.setTemplate(
							new sap.ui.core.Icon({
								size : "15px",
								src : "sap-icon://attachment",
								press :common.ZHR_TABLES.onOpenAttachList,
								customData : [new sap.ui.core.CustomData({key : "Controller",value:oController}),
									          new sap.ui.core.CustomData({key : "Appno",value:"{Appno}"})],
								visible: {
									path : oFields[i],
									formatter : function(fVal) {
										return fVal == "Y" ? true : false;
									}
								}
							})
						)
					}else if(vColumnInfo[i].type == "Zpayym"){
						oColumn.setTemplate(new sap.m.Text({
							text : { 
								path : vColumnInfo[i].id,
							    formatter : function(fVal){
							    	if(fVal && fVal != "" && fVal * 1 != 0){
							    		return fVal.substring(0,4) + "." + fVal.substring(4,6) ; 
							    	}else return "";
							    }
							},
						    textAlign : "Center",
						}).addStyleClass("FontFamily")); 
					}else if(oTypes[i] =="dateConvert"){
						cColumn.setTemplate(
								new sap.ui.commons.TextView({
									textAlign : "Begin",
									text : { path : oFields[i],
											 formatter : function(x){
												 if(!x || x == null || x == "") return "";
												 var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
												 console.log(x);
												 
												 return dateFormat.format(new Date(x)); 
											 }
										}
								}).addStyleClass("FontFamily")	
						);
					}
					oTable.addColumn(cColumn);
				}else{
					if(mLabel){
						cColumn.addMultiLabel(new sap.ui.commons.TextView({text : mLabel[i].split(";;")[0]}).addStyleClass("FontFamily"));
						cColumn.setHeaderSpan([parseInt(mLabel[i].split(";;")[1]),1]);
					}				
					cColumn.setLabel(new sap.ui.commons.CheckBox({change : oController.CheckAll}));
					if(oAligns){
						cColumn.setHAlign(oAligns[i]);
					}
					if(oSizes){
						cColumn.setWidth(oSizes[i]);
					}
					cColumn.setHAlign("Center");
					cColumn.setTemplate(new sap.ui.commons.CheckBox({checked : "{"+oFields[i]+"}", customData : new sap.ui.core.CustomData({
						key : "check",value : "{Seqno}"
					})}));
					oTable.addColumn(cColumn);
				}
			}			
			if(isNaN(rowLength)){
//				oTable.setVisibleRowCountMode(rowLength);
//				oTable.setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Interactive);
			}else{
				oTable.setVisibleRowCount(rowLength);				
			}
		}
	},
	
	onOpenAttachList : function(oEvent){
		//jQuery.sap.require("fragment.ActPersonPopover");
		var oControl = this;
		var vAppno = "" , _ActPersonPopover = null, oController = null ;
		var oCustomData = oControl.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Appno") {
					vAppno = oCustomData[i].getValue();
				}else if(oCustomData[i].getKey() == "Controller"){
					oController = oCustomData[i].getValue();
				}
			}
		}
		

		if(!oController._AttachFilePopover) {
			oController._AttachFilePopover = sap.ui.jsfragment("fragment.AttachFilePopover", oController);
			oController.getView().addDependent(oController._AttachFilePopover);
		}
		oController._AttachFilePopover.removeAllCustomData();
		oController._AttachFilePopover.addCustomData(new sap.ui.core.CustomData({key : "Controller", value : oController}));
		oController._AttachFilePopover.addCustomData(new sap.ui.core.CustomData({key : "Appno", value : vAppno}));
		oController._AttachFilePopover.openBy(oControl);
		
	},
	
	onOpenPTIAttachList : function(oEvent){
		var oControl = this;
		var vAppno = "" , vOrgeh = "" , vPerid = "",  vEname = "", vOrgtx = "";
		var oCustomData = oControl.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Appno") {
					vAppno = oCustomData[i].getValue();
				}
			}
		}
		
	    var vUrl = "/sap/bc/ui5_ui5/sap/zui5_hr_common/pti.html?";
	    var vMode = "VIEW";
	    var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
	    
	    if(!common.Common.checkNull(vAppno)){
			var aFilters = []
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vAppno));
			
		    oModel.read("/PtiPinfoSet",
					null, 
					null, 
					false, 
					function(oData, oResponse) {
						if(oData) {
							var oneData = oData.results[0] ;
							vOrgeh = oneData.OrgClass;
							vOrgtx = oneData.OrgNm;
							vPerid = oneData.EmpId;
							vEname = oneData.EmpNm;
						}
					},
					function(oResponse) {
						console.log(oResponse);
					}
			  );
			  
			  try{
					var vHostName = location.hostname;
					if(vHostName.indexOf("hcm.") > -1) {
						
					}else{
						 vAppno = "T"+ vAppno;
					} 
				} catch(ex) {
					console.log(ex);
			  }
				
			  if(common.Common.checkNull(vOrgeh)){
				  sap.m.MessageBox.alert(oBundleText.getText("LABEL_2902")); //LABEL_2902=신청자 조직코드를 조회하지 못하였습니다. 
				  return;
			  }else if(common.Common.checkNull(vOrgtx)){
				  sap.m.MessageBox.alert(oBundleText.getText("LABEL_2902")); //LABEL_2902=신청자 조직코드를 조회하지 못하였습니다. 
				  return;
			  }else if(common.Common.checkNull(vPerid)){ // LABEL_2901=신청자 사번을 조회하지 못하였습니다.
				  sap.m.MessageBox.alert(oBundleText.getText("LABEL_2901")); 
				  return;
			  }else if(common.Common.checkNull(vEname)){
				  sap.m.MessageBox.alert(oBundleText.getText("LABEL_2903")); // LABEL_2903=신청자 성명을 조회하지 못하였습니다.
				  return;
			  }
			  vUrl += "PartNo=" + vOrgeh;
			  vUrl += "&PartName=" + vOrgtx;
			  vUrl += "&UserID=" + vPerid;
			  vUrl += "&UserName=" + vEname;
			  vUrl += "&ApplID=" + vAppno;
			  vUrl += "&Mode=" + vMode;
			  window.open(vUrl,"",'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=600');
		}else{
			  sap.m.MessageBox.alert("신청문서 번호를 조회하지 못하였습니다");
		} 
	},
	
	onBeforeOpenFile : function(oEvent){
		var oControl = this;
		var vAppno = "" , oController = null ;
		var oCustomData = oControl.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Appno") {
					vAppno = oCustomData[i].getValue();
				}else if(oCustomData[i].getKey() == "Controller"){
					oController = oCustomData[i].getValue();
				}
			}
		}
		 var oFilePopColumn = sap.ui.getCore().byId(oController.PAGEID + "_FilePopColumn");
		 var oFilePopList = sap.ui.getCore().byId(oController.PAGEID + "_FilePopList");
		 var oFilters = [];
		 oFilters.push(new sap.ui.model.Filter("Appno", sap.ui.model.FilterOperator.EQ, vAppno ));
		 oFilters.push(new sap.ui.model.Filter("Zworktyp", sap.ui.model.FilterOperator.EQ, oController._vZworktyp));
		
		 oFilePopList.bindItems("/FileListSet", oFilePopColumn, null, oFilters);
	},
	
	onDownloadFile : function(oEvent){
		var vAttachid = oEvent.getSource().getCustomData()[0].getValue("Fileuri");
		document.iWorker.location.href = vAttachid;
		
	},
	
	onOpenZappResn : function(oEvent){
		if(oEvent.getSource().getCustomData() && oEvent.getSource().getCustomData().length > 0){
			var vSymptn = oEvent.getSource().getCustomData()[0].getValue(); 
			var vZappResn = oEvent.getSource().getCustomData()[1].getValue(); 
			var vHeight = "120px";
			
			var oRow, oCell;
			
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				columns : 3,
				widths : ['10px','','10px']
			});
			
			if(!common.Common.checkNull(vSymptn)){
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({})
				}); 
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1086")}).addStyleClass("FontFamilyBold"),	// 1086:담당자 의견
				}); 
				oRow.addCell(oCell);
				oMatrix.addRow(oRow);
				
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({})
				}); 
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
				 		editable : false ,
				 		value : vSymptn,
				 		growing : true,
				 		width : "100%",
				 		rows : 3,
				 	}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}); 
				oRow.addCell(oCell);
				oMatrix.addRow(oRow);
			}
					
			if(!common.Common.checkNull(vZappResn)){
				if(!common.Common.checkNull(vSymptn)){
					oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"10px"});
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({text : ""}).addStyleClass("FontFamilyBold"),
					}); 
					oRow.addCell(oCell);
					oMatrix.addRow(oRow);
					vHeight = "200px";
				}
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : ""}),
				}); 
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1075")}).addStyleClass("FontFamilyBold"),	// 1075:반려사유
				}); 
				oRow.addCell(oCell);
				oMatrix.addRow(oRow);
				
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({})
				}); 
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
				 		editable : false ,
				 		value : vZappResn,
				 		growing : true,
				 		width : "100%",
				 		rows : 3,
				 	}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}); 
				oRow.addCell(oCell);
				oMatrix.addRow(oRow);
			}
			
			var oPopover = new sap.m.Popover({
				contentWidth : "500px",
				contentHeight : vHeight,
				placement : sap.m.PlacementType.Top,
				content : oMatrix ,
				title : "의견"
			}).addStyleClass("FontFamilyBold");
			
			oPopover.openBy(oEvent.getSource());
			
		}
	},
	
	onOpenTooltip : function(oEvent){
		if(oEvent.getSource().getCustomData() && oEvent.getSource().getCustomData().length > 0){
			var vTooltipText = oEvent.getSource().getCustomData()[0].getValue(); 
			var vTooltipTitle = oEvent.getSource().getCustomData()[1].getValue(); 
			var vHeight = "110px";
			
			var oRow, oCell;
			
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				columns : 3,
				widths : ['10px','','10px']
			});
			
			if(vTooltipText && vTooltipText != ""){
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({})
				}); 
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
				 		editable : false ,
				 		value : vTooltipText,
				 		growing : true,
				 		width : "100%",
				 		rows : 3,
				 	}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}); 
				oRow.addCell(oCell);
				oMatrix.addRow(oRow);
				
				var oPopover = new sap.m.Popover({
					contentWidth : "500px",
					contentHeight : vHeight,
					placement : sap.m.PlacementType.Top,
					content : oMatrix ,
					title : vTooltipTitle
				});
				
				oPopover.openBy(oEvent.getSource());
			}
		}
	},
};