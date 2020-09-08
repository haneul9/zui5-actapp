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
			content : new sap.m.Label({text : "군필여부", required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		var oZzrespn = new sap.m.ComboBox({
			width : "95%" ,
			selectedKey : "{Zzrespn}",
			change : oController.onChangeZzrespn
		});

		oController._KdsvhList = [];
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
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "역종" , 
//									   required : {
//										   path : "Zzclass",
//										   formatter : function(fVal){
//											   if(fVal == "X") return true;
//											   else return false;
//										   }}
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
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
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "군별" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
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
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "계급" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
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
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "병과" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
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
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "군번" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Idnum}",
				maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "MilDataList", "Idnum"),
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "입대일" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker({
						valueFormat : "yyyy-MM-dd",
			            displayFormat : "yyyy.MM.dd",
			            value : "{Begda}",
						width : "95%",
					}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "제대일" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker({
						valueFormat : "yyyy-MM-dd",
			            displayFormat : "yyyy.MM.dd",
			            value : "{Endda}",
						width : "95%",
					}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "제대구분" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
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
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "특별전역사유" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Serut}",
				maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "MilDataList", "Serut"),
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "미필사유" , 
									   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center" 
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "98%",
				value : "{Rsexp}",
				maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "MilDataList", "Rsexp"),
			}).addStyleClass("L2PFontFamily"),
			colSpan : 3
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oCloseButton = new sap.m.Button({
			text : "취소",
			icon :"sap-icon://decline" ,
			press : function(oEvent){
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_MilitaryDialog",{
			content :[oApplyInfoMatrix],
			contentWidth : "1070px",
			showHeader : true,
			buttons : [ new sap.m.Button({text : "저장",  icon :"sap-icon://save", press : oController.onSaveMilitary}), 
				        new sap.m.Button(oController.PAGEID + "_MilitaryDeleteBtn",{text : "삭제",  icon :"sap-icon://save", press : oController.onDeleteMilitary}), 
				        oCloseButton],
	        beforeOpen : oController.afterOpenMilitaryDialog
		});
		oDialog.setModel(oController._MilitaryDialogJsonModel);
		oDialog.bindElement("/Data"); 
		
		oDialog.addStyleClass("sapUiSizeCompact");
		

		return oDialog;
	}

});
