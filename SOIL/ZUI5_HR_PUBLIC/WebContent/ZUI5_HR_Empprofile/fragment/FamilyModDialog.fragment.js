sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.FamilyModDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
// 가족사항
		var oModel = sap.ui.getCore().getModel("ZHR_FAMILY_SRV");
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "가족관계", required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		var oKdsvh = new sap.m.ComboBox(oController.PAGEID + "_Kdsvh",{
			width : "95%" ,
			selectedKey : "{Kdsvh}",
			change : oController.onChangeKbsvh
		});

		oController._KdsvhList = [];
		oModel.read("/FamilyRelationSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oKdsvh.addItem(new sap.ui.core.Item({key : data.results[i].Kdsvh, text : data.results[i].Atext}));
							oController._KdsvhList.push(data.results[i]);
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oKdsvh
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "등록(변경)사유" , required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		var oCombo2 = new sap.m.ComboBox({
			width : "95%" ,
			selectedKey : "{Zzrgrsn}",
		});

		oModel.read("/FamilyReqlistSet?$filter=Gubun eq '1'", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oCombo2.addItem(new sap.ui.core.Item({key : data.results[i].Zresn, text : data.results[i].Rsntx}));
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oCombo2
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "성" , required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Lnmhg}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Lnmhg"),
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "이름", required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Fnmhg}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Fnmhg"),
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "주민등록번호", required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Regno}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Regno")
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "생년월일", required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker({
				valueFormat : "yyyy-MM-dd",
	            displayFormat : "yyyy.MM.dd",
	            value : "{Fgbdt}",
				width : "95%",
			})
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "국적"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				valueHelpOnly : true,
	            value : "{Nattx}",
				width : "95%",
				showValueHelp : true,
				valueHelpRequest: oController.onDisplaySearchNatioDialog,
			})
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "동거여부"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Livid}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "직장/학교명", required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Zzfamwk}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Zzfamwk")
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "계열/학년", required : true}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "95%",
				value : "{Fasin}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Fasin")
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "가족유형"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);

		var oFamsa = new sap.m.Input({
			width : "95%" ,
			editable : false,
			value : "{Stext}"
		});
				
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oFamsa
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "부양가족관계"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		
		var oDptyp = new sap.m.Input({
			width : "95%" ,
			editable : false,
			value : "{Dptyx}",
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oDptyp
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oApplyInfoMatrix.addRow(oRow);
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "40px",
				content : [new sap.ui.core.Icon({
								src: "sap-icon://open-command-field", 
								size : "1.0rem"
							}),
						   new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : "가족사항"}).addStyleClass("L2PFontFamilyBold"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			oApplyInfoMatrix ],
		});

		
		// 연말정산
		var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "부양가족여부"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Dptid}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "장애여부"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Hndid}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "기초 수급자"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Balid}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "건강보험산정특례자"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Pptid}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "입양자녀"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.CheckBox({
					selected : "{Adcid}",
				}).addStyleClass("L2PFontFamily")
			],
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "입양/위탁일자"}).addStyleClass("L2PFontFamily"),
			hAlign : "Center"
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Adpdt}",
					width : "95%",
				})
			],
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		

		var oPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "40px",
				content : [new sap.ui.core.Icon({
								src: "sap-icon://open-command-field", 
								size : "1.0rem"
							}),
							new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : "연말정산"}).addStyleClass("L2PFontFamilyBold"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			oMatrix3],
		});
		
		
		
		
		var oCloseButton = new sap.m.Button({
			text : "취소",
			icon :"sap-icon://decline" ,
			press : function(oEvent){
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_FamilyDialog",{
			content :[oApplyInfoPanel, 
				      new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
				      sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.AttachFile", oController),
				      oPanel] ,
			contentWidth : "1070px",
			showHeader : true,
			title : "가족등록",
			buttons : [ new sap.m.Button({text : "저장",  icon :"sap-icon://save", press : oController.onSaveFamily}), 
				        new sap.m.Button(oController.PAGEID + "_FamilyEnd",{text : "가족관계종료",  icon :"sap-icon://save", press : oController.onCloseFamily}), 
				        oCloseButton],
	        beforeOpen : oController.afterOpenFamilyDialog
		});
		oDialog.setModel(oController._FamilyDialogJsonModel);
		oDialog.bindElement("/Data"); 
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
