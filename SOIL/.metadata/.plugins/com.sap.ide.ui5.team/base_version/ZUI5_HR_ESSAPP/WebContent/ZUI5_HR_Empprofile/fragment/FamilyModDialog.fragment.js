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
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1445"), required : true}).addStyleClass("FontFamilyBold"),	// 1445:가족관계
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oKdsvh = new sap.m.ComboBox(oController.PAGEID + "_Kdsvh",{
			width : "100%" ,
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
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1713") , required : true}).addStyleClass("FontFamilyBold"),	// 1713:등록(변경)사유
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oCombo2 = new sap.m.ComboBox({
			width : "100%" ,
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
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1861") , required : true}).addStyleClass("FontFamilyBold"),	// 1861:성
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "100%",
				value : "{Lnmhg}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Lnmhg"),
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2014"), required : true}).addStyleClass("FontFamilyBold"),	// 2014:이름
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "100%",
				value : "{Fnmhg}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Fnmhg"),
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2140"), required : true}).addStyleClass("FontFamilyBold"),	// 2140:주민등록번호
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "100%",
				value : "{Regno}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Regno"),
				change : oController.onChangeRegno
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0121"), required : true}).addStyleClass("FontFamilyBold"),	// 121:생년월일
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker({
				valueFormat : "yyyy-MM-dd",
	            displayFormat : "yyyy.MM.dd",
	            value : "{Fgbdt}",
				width : "100%",
			})
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1539")}).addStyleClass("FontFamilyBold"),	// 1539:국적
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				valueHelpOnly : true,
	            value : "{Nattx}",
				width : "100%",
				showValueHelp : true,
				valueHelpRequest: oController.onDisplaySearchNatioDialog,
			})
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1708")}).addStyleClass("FontFamilyBold"),	// 1708:동거여부
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Livid}",
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2188")}).addStyleClass("FontFamilyBold"),	// 2188:직장/학교명
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "100%",
				value : "{Zzfamwk}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Zzfamwk")
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1489")}).addStyleClass("FontFamilyBold"),	// 1489:계열/학년
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "100%",
				value : "{Fasin}",
				maxLength : common.Common.getODataPropertyLength("ZHR_FAMILY_SRV", "FamilyAppl", "Fasin")
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1450")}).addStyleClass("FontFamilyBold"),	// 1450:가족유형
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);

		var oFamsa = new sap.m.Input({
			width : "100%" ,
			editable : false,
			value : "{Stext}"
		});
				
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oFamsa
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1781")}).addStyleClass("FontFamilyBold"),	// 1781:부양가족관계
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		
		var oDptyp = new sap.m.Input({
			width : "100%" ,
			editable : false,
			value : "{Dptyx}",
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oDptyp
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oApplyInfoMatrix.addRow(oRow);
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						   new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : oBundleText.getText("LABEL_1449")}).addStyleClass("MiddleTitle"),	// 1449:가족사항
				]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
			oApplyInfoMatrix ],
		});

		
		// 연말정산
		var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1782")}).addStyleClass("FontFamilyBold"),	// 1782:부양가족여부
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Dptid}",
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2086")}).addStyleClass("FontFamilyBold"),	// 2086:장애여부
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Hndid}",
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1613")}).addStyleClass("FontFamilyBold"),	// 1613:기초 수급자
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Balid}",
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1465")}).addStyleClass("FontFamilyBold"),	// 1465:건강보험산정특례자
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Pptid}",
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2075")}).addStyleClass("FontFamilyBold"),	// 2075:입양자녀
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.CheckBox({
					selected : "{Adcid}",
				}).addStyleClass("FontFamily")
			],
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2074")}).addStyleClass("FontFamilyBold"),	// 2074:입양/위탁일자
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Adpdt}",
					width : "150px",
				})
			],
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		

		var oPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
							new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
							new sap.m.ToolbarSpacer({width: "5px"}),
					        new sap.m.Text({text : oBundleText.getText("LABEL_1945")}).addStyleClass("MiddleTitle"),	// 1945:연말정산
				]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
			oMatrix3],
		});
		
		
		
		
		var oCloseButton = new sap.m.Button({
			text : oBundleText.getText("LABEL_0071"),	// 71:취소
			press : function(oEvent){
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_FamilyDialog",{
			content :[oApplyInfoPanel, 
				      sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.AttachFile", oController),
				      oPanel] ,
			contentWidth : "1070px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1447"),	// 1447:가족등록
			buttons : [ new sap.m.Button({text : oBundleText.getText("LABEL_0177"),  press : oController.onSaveFamily}),	// 177:저장 
				        new sap.m.Button(oController.PAGEID + "_FamilyEnd",{text : oBundleText.getText("LABEL_1446"),  press : oController.onCloseFamily}),	// 1446:가족관계종료 
		        		new sap.m.Button(oController.PAGEID + "_FamilyDelete",{text : oBundleText.getText("DELETION"),  press : oController.onDeleteFamily}),	// DELETION:삭제
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
