sap.ui.jsfragment("ZUI5_HR_MedicalHA.fragment.MedicalPage02", {
	
	createContent : function(oController) {
		var oRow, oCell;
		// EnableYn ZappStatAl == "20" 신청 또는 ZappStatAl == "30" 승인일 경우 true 그외에는 false
		var oApplyInfo = new sap.m.Panel({
			expandable : true,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer({width: "10px"}),
					       new sap.m.Text({text : "신청안내" }).addStyleClass("L2PFontFamilyBold"),
				           
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : new sap.m.TextArea({
				rows : 5 ,
				value : "{Notice}",
				width : "100%",
				editable : false
			}),
			visible : "{EnableYn}"
		});
		
		// 기본 정보
		var oPaymentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "성명" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({ 
//				text : "{Ename}",
					text : {
						parts : [{path : "Ename"}, {path : "Perid"}],
						formatter : function(fVal1, fVal2){
							if(fVal1 || fVal2) return fVal1 + " (" + fVal2 + ")"
						}
					}
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "사업장 / 소속부서"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : new sap.m.Text({
					text : "{BOrgtx}",
					width : "95%",
				}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PToolbarNoBottomLine"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "직군 / 직급"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ZzjikgbtxT}",
					width : "95%",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "직책"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Zzjikchtx}",
					width : "95%",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "참조선"}).addStyleClass("L2PFontFamily"),
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				colSpan : 3,
				content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{Aprnm}"}).addStyleClass("L2PFontFamily"),
									   new sap.m.ToolbarSpacer(),
									   new sap.m.CheckBox(oController.PAGEID + "_Prvline",{
								        	selected : "{Prvline}",
								        	text : "개인 참조선 적용",
								        	editable : false,
								        }),
								        new sap.m.ToolbarSpacer({width : "20px"})]
						 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);
		
		var oPaymentPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({
								src: "sap-icon://open-command-field", 
								size : "1.0rem"
							}),
							new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : "대상자" }).addStyleClass("L2PFontFamilyBold"),
				           
				]
			}).addStyleClass("L2PToolbarNoBottomLine"), oPaymentMatrix ]
		});
		
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신청대상" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.ComboBox(oController.PAGEID + "_Famgb",{
				width : "95%" ,
				change : oController.onChangeFamgb,
				enabled : false,
				selectedKey : "{Regno}"
			})
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "진료기간"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Mdprd}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "진료건수 / 납부금합계" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ApamtT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "지급년월"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Payym}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신규/추가 구분"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Text({
//				text : "{Newyntx}",
//			}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixData");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.ComboBox(oController.PAGEID + "_Newyn", {
				selectedKey : "{Newyn}",
				editable : "{EnableYn}",
				width : "95%",
				change : function(oEvent){
					oController._DetailJSonModel.setProperty("/Data/Newyntx", oEvent.getSource().getSelectedItem().getText());
				}
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신청가능액( 신청중 / 잔여 / 한도 )"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{PoamtT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "부모 건강보험 피부양자 여부"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				width : "95%",
				selected : "{Depyn}",
				editable : "{DepynV}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "자녀 미혼여부"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
//				value : "{Disenm}",
				selected : "{Wedyn}",
				width : "95%",
				editable : "{WedynV}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_PyamtRow",{height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "지원금액 합계" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Pyamt}"
			}).addStyleClass("L2PFontFamily"),
			colSpan : 3,
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "병명" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input(oController.PAGEID + "_Disenm",{
				value : "{Disenm}",
				width : "95%",
				editable : "{EnableYn}",
				maxLength : common.Common.getODataPropertyLength("ZHR_MEDICAL_SRV", "MedicalExpenseAppl", "Disenm"),
			}).addStyleClass("L2PFontFamily"),
			colSpan : 3,
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "구체적 증상"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.TextArea({
				value : "{Symptn}",
				rows : 3,
				width : "95%",
				editable : "{EnableYn}",
			}).addStyleClass("L2PFontFamily L2PWidth100"),
			colSpan : 3,
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "질병분류 1" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		var oSerids1 = new sap.m.ComboBox(oController.PAGEID + "_Serids1",{
			width : "95%" ,
			selectedKey : "{Serids1}" ,
			textAlign : sap.ui.core.TextAlign.Begin
	    });
		var oSerids2 = new sap.m.ComboBox(oController.PAGEID + "_Serids2",{
			width : "95%" ,
			selectedKey : "{Serids2}" ,
			textAlign : sap.ui.core.TextAlign.Begin
	    });
		oSerids1.addItem(new sap.ui.core.Item ({key : "", text : "" }));
		oSerids2.addItem(new sap.ui.core.Item ({key : "", text : "" }));
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV") ;
		
		var oPath = "/MedicalDiseaseListSet";	
		oModel.read(oPath, 
		    null, null, false, 
			function(data,res){
				if(data && data.results.length){
					for(var i = 0; i < data.results.length ; i ++){
						oSerids1.addItem(new sap.ui.core.Item ({key : data.results[i].Serids, text : data.results[i].Seridstx }));
						oSerids2.addItem(new sap.ui.core.Item ({key : data.results[i].Serids, text : data.results[i].Seridstx }));
					}
				}
			},
			function(Res){	
			}
		);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  oSerids1
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		

		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "질병분류 2"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  oSerids2
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "40px",
				content : [new sap.ui.core.Icon({
								src: "sap-icon://open-command-field", 
								size : "1.0rem"
							}),
							new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : "신청내역" }).addStyleClass("L2PFontFamilyBold"),
					       new sap.m.ToolbarSpacer(),
					       new sap.m.MessageStrip({
					    	   text : "신청가능액은 가족 의료비 신청인 경우 한도액을 체크하기 위하여 조회됩니다. ( 본인의 경우 조회안됨 )",
							   type : "Success" ,
							   showIcon : true ,
							   customIcon : "sap-icon://message-information", 
							   showCloseButton : false,
					       }),
						   new sap.m.ToolbarSpacer({width: "5px"}),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"), oApplyInfoMatrix ],
			visible : "{EnableYn}"
		});
		
		
		// 신청내역 ( 조회  )
		var oApplyInfoMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신청대상" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{FamgbT}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "진료기간" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Mdprd}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "진료건수 / 신청금합계" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ApamtT}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "지급년월"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Payym}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신규/추가 구분"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Newyntx}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신청가능액( 신청중 / 잔여 / 한도 )"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{PoamtT}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "부모 건강보험 피부양자 여부"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Depyn}",
				editable : false,
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "자녀 미혼여부"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Wedyn}",
				editable : false,
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "지원금액 합계" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Pyamt}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			colSpan : 3,
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "병명"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Disenm}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			colSpan : 3,
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "구체적 증상"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.TextArea({
				value : "{Symptn}",
				rows : 3,
				width : "95%",
				editable : false
			}).addStyleClass("L2PFontFamily L2PWidth100"),
			colSpan : 3,
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "질병분류 1" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Serids1tx}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "질병분류 2"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Serids2tx}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		var oApplyInfoPanel2 = new sap.m.Panel({
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
					        new sap.m.Text({text : "신청내역" }).addStyleClass("L2PFontFamilyBold"),
					        new sap.m.ToolbarSpacer(),
					        new sap.m.MessageStrip({
					    	   text : "신청가능액은 가족 의료비 신청인 경우 한도액을 체크하기 위하여 조회됩니다. ( 본인의 경우 조회안됨 )",
							   type : "Success" ,
							   showIcon : true ,
							   customIcon : "sap-icon://message-information", 
							   showCloseButton : false,
					        }),
						    new sap.m.ToolbarSpacer({width: "5px"}),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			oApplyInfoMatrix2 ],
			visible : {
				path : "EnableYn" ,
				formatter : function(fVal){
					return !fVal;
				}
			}
		});
		
		var oRecpgb  = new sap.m.ComboBox({
			selectedKey : "{Recpgb}",
			enabled : { path : "ZappStatAl" ,
				  formatter : function(fVal){
					 if(fVal == "20" || fVal == "30") return true ;
					  else return false;
				  }
            },
            change : function(oEvent){
            	var vIdx = parseInt(oEvent.getSource().getCustomData()[0].getValue()) - 1;
            	oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Recpgbtx", oEvent.getSource().getSelectedItem().getText())
            },
	        customData : new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})
		});
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		var oPath = "/MedicalReceiptListSet";
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						for(var i = 0 ; i < data.results.length; i++){
							oRecpgb.addItem(new sap.ui.core.Item({key: data.results[i].Recpgb, text: data.results[i].Recpgbtx}));	
						}
					}
				},
				function(res){console.log(res);}
		);	
		
		var oForyn  = new sap.m.ComboBox({
			selectedKey : "{Foryn}",
			enabled : { path : "ZappStatAl" ,
				  formatter : function(fVal){
					 if(fVal == "20" || fVal == "30") return true ;
					  else return false;
				  }
            },
            change : function(oEvent){
            	var vIdx = parseInt(oEvent.getSource().getCustomData()[0].getValue()) - 1;
            	oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Foryntx", oEvent.getSource().getSelectedItem().getText())
            },
	        customData : new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})
		});
		
		var oPath = "/MedicalMothodListSet";
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						for(var i = 0 ; i < data.results.length; i++){
							oForyn.addItem(new sap.ui.core.Item({key: data.results[i].Foryn, text: data.results[i].Foryntx}));	
						}
					}
				},
				function(res){console.log(res);}
		);	
		
		var oColumnList = new sap.m.ColumnListItem({
			type : sap.m.ListType.Active,
			cells : [
				new sap.m.Text({
				     text : "{Idx}" 
				}).addStyleClass("L2PFontFamily"),
			    new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Begda}",
		            change : oController.onChangeTableDate,
		            editable : { path : "ZappStatAl" ,
					  formatter : function(fVal){
						  if(fVal == "20" || fVal == "30") return true ;
						  else return false;
					  }
		            }
			    }).addStyleClass("L2PFontFamily"),
			    new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Endda}",
		            change : oController.onChangeTableDate,
		            editable : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							  if(fVal == "20" || fVal == "30") return true ;
							  else return false;
						  }
			            }
			    }).addStyleClass("L2PFontFamily"),
				new sap.m.Input({
			     value : "{Disenm}" , 
	             editable : { path : "ZappStatAl" ,
					  formatter : function(fVal){
						  if(fVal == "20" || fVal == "30") return true ;
						  else return false;
					  }
		            },
		         maxLength : common.Common.getODataPropertyLength("ZHR_MEDICAL_SRV", "MedicalExpenseAppl", "Disenm"),
			    }).addStyleClass("L2PFontFamily"),
				new sap.m.Input({
					value : "{Medorg}" , 
		            editable : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							  if(fVal == "20" || fVal == "30") return true ;
							  else return false;
						  }
			            },
		            maxLength : common.Common.getODataPropertyLength("ZHR_MEDICAL_SRV", "MedicalExpenseAppl", "Medorg"),
				}).addStyleClass("L2PFontFamily"),
				oForyn,
				oRecpgb,
				new sap.m.Input({
				     value : "{Apamt}",
				     textAlign : "End", 
				     change : oController.onChangeApamt,
		             editable : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							  if(fVal == "20" || fVal == "30") return true ;
							  else return false;
						  }
			            },
		            maxLength : 14,
				}).addStyleClass("L2PFontFamily Number"),
				new sap.m.Input({
				     value : "{Pyamt}", 
				     textAlign : "End", 
				     change : oController.onChangePyamt ,
		             editable : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							  if(fVal == "20" || fVal == "30") return true ;
							  else return false;
						  }
			            },
		            maxLength : 14,
				}).addStyleClass("L2PFontFamily Number"),
				new sap.m.CheckBox({
				     selected : "{EviynT}" ,
		             enabled : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							  if(fVal == "20" || fVal == "30") return true ;
							  else return false;
						  }
			            }
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Input({
				     value : "{Notes}" ,
				     enabled : { path : "ZappStatAl" ,
						  formatter : function(fVal){
								 if(fVal == "20" || fVal == "30") return true ;
								  else return false;
							  }
				            },
				    maxLength : common.Common.getODataPropertyLength("ZHR_MEDICAL_SRV", "MedicalExpenseAppl", "Notes"),
				}).addStyleClass("L2PFontFamily"),
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_DetailTable", {
			inset : false,
			mode : "MultiSelect",
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			//mode : "MultiSelect",
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight cellBorderLeft",
//			        	  footer : new sap.m.Text({text : "합계"}),
			        	  width : "5%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "진료시작일"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "120px",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "진료종료일"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "120px",
			        	  minScreenWidth: "tablet"}), 
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "병명"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "15%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "의료기관"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "15%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "입원/외래"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}), 
			        	//  width : "10%",
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "영수증구분"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "신청금액"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Right,
//				        	  footer : new sap.m.Text({text :"123,123"}),
//			        	  footer : new sap.m.Text({text : "{TotalApamt}"}).setModel(oController._DetailJSonModel)
//			        	  												  .bindElement("/Data"),
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "지원금액"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.End,
//			        	  footer : new sap.m.Text({text : "{TotalPyamt}"}).setModel(oController._DetailJSonModel)
//							  .bindElement("/Data"),
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "추가증빙"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "비고"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "10%",
			        	  minScreenWidth: "tablet"}),

			          ]
		});
		
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.bindItems("/Data", oColumnList);
		oTable.setKeyboardMode("Edit");	
			
		var oDetailPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
						content : [					       
							       new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
								   new sap.m.ToolbarSpacer({width: "5px"}),
								   new sap.m.Text({text : "상세내역" }).addStyleClass("L2PFontFamilyBold"),
					    		   new sap.m.ToolbarSpacer(),
					    		   new sap.m.Button(oController.PAGEID +"_Btn1",{
					    			   text : "등록",
//					    			   type : "Emphasized",
					    			   press : oController.onPressNewRecord,
					    			   icon : "sap-icon://create",
					    			   visible : "{EnableYn}"
					    		   }).addStyleClass("L2PFontFamily"),
					    		   new sap.m.Button(oController.PAGEID +"_Btn3",{
					    			   text : "삭제",
//					    			   type : sap.m.ButtonType.Emphasized,
					    			   icon : "sap-icon://delete",
					    			   press : oController.onPressDelRecord,
					    			   visible : "{EnableYn}"
					    		   }).addStyleClass("L2PFontFamily"),
				    		   
			    		   		]
							}).addStyleClass("L2PToolbarNoBottomLine"),
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						oTable	
						]
		});
		
		var oApplicantMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "성명"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Apename}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "사업장 / 소속부서"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ApbrgtxT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplicantMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "직군 / 직급"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ApzzjikgbtxT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신청일시"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Appdt}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplicantMatrix.addRow(oRow);
		
		var oApplicantPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
						content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : "신청자" }).addStyleClass("L2PFontFamilyBold")]
					    	}).addStyleClass("L2PToolbarNoBottomLine") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						oApplicantMatrix	
						],
		});
		
		var oApprovalMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "결재문서번호"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Link({
				text : { path : "Docno" , formatter : function(fVal){
											if(parseInt(fVal) > 0) return fVal ;
											else "";
										  }
					     
				},
				press : oController.openDocno
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "결재상태"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ZappStxtAl}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApprovalMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "담당자결재일시"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Stfdt}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "주관부서팀장결재일시"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Sgndt}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApprovalMatrix.addRow(oRow);
		
		var oApprovalPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
						content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : "결재내역" }).addStyleClass("L2PFontFamilyBold")]
					    	}).addStyleClass("L2PToolbarNoBottomLine") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						oApprovalMatrix	
						],
			visible : {
				path : "ZappStatAl" ,
				formatter : function(fVal){
					if( fVal == "20" ) return false;
					else return true;
				}
			}
		});
		
		var oRejectPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
						content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : "반려사유" }).addStyleClass("L2PFontFamilyBold")]
					    	}).addStyleClass("L2PToolbarNoBottomLine") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						new sap.m.TextArea({
							value : "{ZappResn}",
							rows : 4,
							width : "100%",
							enabled :  "{EnableYn}"
						}).addStyleClass("L2PFontFamily"),
						],
			visible : { path : "ZappStatAl" ,
				        formatter : function(fVal){
				    	   if(fVal && ( fVal == "20" || fVal == "30" || fVal == "35" || fVal == "55" || fVal == "90" ) ){
				    		   return true;
				    	   }else return false;
				       }}
		});
				
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px","","20px"],
			width : "100%"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"})
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
			
		var oContents = [oApplyInfo,oPaymentPanel,oApplyInfoPanel, oApplyInfoPanel2 ,oDetailPanel, oApplicantPanel,oApprovalPanel, oRejectPanel ];
		
		for(var i=0;i<oContents.length;i++){
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
			oRow.addCell(oCell);
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : oContents[i]
			});
			oRow.addCell(oCell);
			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
			oRow.addCell(oCell);
			oContentMatrix.addRow(oRow);
		}
		
					
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [
				oContentMatrix 
			           ]
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
		
//		if (!jQuery.support.touch) {
			oLayout.addStyleClass("sapUiSizeCompact");
//		};

		return oLayout;

	
	}
});