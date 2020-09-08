sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.MilitaryModDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
// 가족사항
		var oModel = sap.ui.getCore().getModel("ZHR_PINFO_SRV");
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1542"), required : true}).addStyleClass("FontFamilyBold"),	// 1542:군필여부
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oZzrespn = new sap.m.ComboBox({
			width : "95%" ,
			selectedKey : "{Zzrespn}",
			change : oController.onChangeZzrespn
		});

		oModel.read("/MilRespnCodeSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oZzrespn.addItem(new sap.ui.core.Item({key : data.results[i].Value, text : data.results[i].Text}));
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oZzrespn
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1934") , 	// 1934:역종
									   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oZzclass = new sap.m.ComboBox({
			width : "95%" ,
			selectedKey : "{Zzclass}",
		});

		oModel.read("/MilClassCodeSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oZzclass.addItem(new sap.ui.core.Item({key : data.results[i].Value, text : data.results[i].Text}));
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oZzclass
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1541") , 	// 1541:군별
									   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		
		var oSerty = new sap.m.ComboBox({
			width : "95%" ,
			selectedKey : "{Serty}",
		});

		oModel.read("/MilSertyCodeSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oSerty.addItem(new sap.ui.core.Item({key : data.results[i].Value, text : data.results[i].Text}));
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oSerty
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1485") , 	// 1485:계급
									   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oMrank = new sap.m.ComboBox({
			width : "95%" ,
			selectedKey : "{Mrank}",
		});

		oModel.read("/MilRankCodeSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oMrank.addItem(new sap.ui.core.Item({key : data.results[i].Value, text : data.results[i].Text}));
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oMrank
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1754") , 	// 1754:병과
									   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oJobcl = new sap.m.ComboBox({
			width : "95%" ,
			selectedKey : "{Jobcl}",
		});

		oModel.read("/MilJobclCodeSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oJobcl.addItem(new sap.ui.core.Item({key : data.results[i].Value, text : data.results[i].Text}));
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oJobcl
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1540") , 	// 1540:군번
									   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Idnum}",
				maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "MilDataList", "Idnum"),
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : oBundleText.getText("LABEL_2072"), 	// 2072:입대일
				required : true
		    }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker({
						valueFormat : "yyyy-MM-dd",
			            displayFormat : "yyyy.MM.dd",
			            value : "{Begda}",
						width : "95%",
					}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : oBundleText.getText("LABEL_2118") , 	// 2118:제대일
				required : true
			}).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker({
						valueFormat : "yyyy-MM-dd",
			            displayFormat : "yyyy.MM.dd",
			            value : "{Endda}",
						width : "95%",
					}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2117") , 	// 2117:제대구분
									   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oEarrt = new sap.m.ComboBox({
			width : "95%" ,
			selectedKey : "{Earrt}",
		});

		oModel.read("/MilEarrtCodeSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oEarrt.addItem(new sap.ui.core.Item({key : data.results[i].Value, text : data.results[i].Text}));
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oEarrt
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2283") , 	// 2283:특별전역사유
									   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Serut}",
				maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "MilDataList", "Serut"),
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1725") , 	// 1725:미필사유
									   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "98%",
				value : "{Rsexp}",
				maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "MilDataList", "Rsexp"),
			}).addStyleClass("FontFamily"),
			colSpan : 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oCloseButton = new sap.m.Button({
			text : oBundleText.getText("LABEL_0071"),	// 71:취소
			icon :"sap-icon://decline" ,
			press : function(oEvent){
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_MilitaryDialog",{
			content :[oApplyInfoMatrix],
			contentWidth : "1070px",
			showHeader : true,
			buttons : [ new sap.m.Button({text : oBundleText.getText("LABEL_0177"),  icon :"sap-icon://save", press : oController.onSaveMilitary}),	// 177:저장 
				        new sap.m.Button(oController.PAGEID + "_MilitaryDeleteBtn",{text : oBundleText.getText("LABEL_0033"),  icon :"sap-icon://save", press : oController.onDeleteMilitary}),	// 33:삭제 
				        oCloseButton],
	        beforeOpen : oController.afterOpenMilitaryDialog
		});
		oDialog.setModel(oController._MilitaryDialogJsonModel);
		oDialog.bindElement("/Data"); 
		
		oDialog.addStyleClass("sapUiSizeCompact");
		

		return oDialog;
	}

});
