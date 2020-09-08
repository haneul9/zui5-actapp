sap.ui.jsfragment("ZUI5_HR_Medical.fragment.MedicalPage02", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
			.setModel(oController._DetailJSonModel)
			.bindElement("/Data")
		];
	},
	
	/**
	 * 페이지 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getPageAllContentRender : function(oController) {
		
		var oContents = [
			new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
			this.getTitleRender(oController),										// 타이틀
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyInfoRender(oController),									// 신청내역
			this.getApplyTableInfoRender(oController),									// 신청내역
			sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),			// 첨부
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController), 	// 결재내역
			sap.ui.jsfragment("fragment.Comments", oController)						// 승인/반려 
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "100%",
			rows : $.map(oContents, function(rowData, k) {
				return new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : rowData
						}),
						new sap.ui.commons.layout.MatrixLayoutCell()
					]
				})
			})
		});
	},
	
	/**
	 * 제목 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png",}),
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {
									text : oBundleText.getText("LABEL_0077")	// 77:생활안정자금 신청
								}).addStyleClass("Font18px FontColor0"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "45px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						vAlign : "Bottom",
						content : 
							new sap.m.Toolbar({
								content : [
									new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar",{}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
									new sap.m.ToolbarSpacer(),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0022"), // 22:뒤로
										press : oController.onBack,
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0058"), // 58:임시저장
										press : oController.onPressSaveT,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0033"), // 33:삭제
										press : oController.onDelete,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0044"),	// 44:신청
										press : oController.onPressSaveC,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_1907"),	// 1907:회수
										press : function() {
											common.Common.onPressApprovalCancel(oController);
										},
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "20") ? true : false;
											}
										}
									})
								]
						}).addStyleClass("ToolbarNoBottomLine NoMarginLeft")
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : aRows
		});
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		var oRow, oCell;
		
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0125"), required : true}).addStyleClass("FontFamilyBold"),	// 125:신청대상
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.ComboBox(oController.PAGEID + "_Famgb",{
				width : "95%" ,
				change : oController.onChangeFamgb,
//				enabled : "{EnableYn}",
				editable : {
  		    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
  					formatter : function(fVal1, fVal2){
  						return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
  					}
				},
				selectedKey : "{Regno}"
			})
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1106") , required : true}).addStyleClass("FontFamilyBold"),	// 1106:진료기간
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Mdprd}"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1105") , required : true}).addStyleClass("FontFamilyBold"),	// 1105:진료건수
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ApamtT}"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0108")}).addStyleClass("FontFamilyBold"),	// 108:급여반영월
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Payym}"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1112"), required : true}).addStyleClass("FontFamilyBold"),	// 1112:합계(신청합계 / 지원금액)
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : {
					parts : [{path : "Apamt"}, {path : "Pyamt"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == undefined || fVal1 == 0 ) return "";
						
						return common.Common.numberWithCommas(fVal1) + " / " + common.Common.numberWithCommas(fVal2)
					}
				}
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1101")}).addStyleClass("FontFamilyBold"),	// 1101:일반 신청가능 ( 신청중/잔여/한도 )
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Poamt1T}"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1090")}).addStyleClass("FontFamilyBold"),	// 1090:미혼여부(자녀)
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "30px",
				content : [new sap.m.CheckBox({
								width : "200px",
								selected : "{Wedyn}",
								editable : "{WedynV}",
							}).addStyleClass("FontFamily")
					      ]
			}).addStyleClass("ToolbarNoBottomLine")],
		}).addStyleClass("MatrixData");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1103")}).addStyleClass("FontFamilyBold"),	// 1103:중증 신청가능 ( 신청중/잔여/한도 )
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Poamt2T}"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1083")}).addStyleClass("FontFamilyBold"),	// 1083:건강보험 피부양자 여부
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : 
				[ new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "30px",
					content : [new sap.m.CheckBox({
									width : "200px",
									selected : "{Depyn}",
									editable : "{DepynV}",
								}).addStyleClass("FontFamily"),
							    new sap.m.Text({text : "{AgeC}"}).addStyleClass("FontFamily"),
						      ]
				}).addStyleClass("ToolbarNoBottomLine")],
		}).addStyleClass("MatrixData");
		
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1111")}).addStyleClass("FontFamilyBold"),	// 1111:치과 신청가능 ( 신청중/잔여/한도 )
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Poamt3T}"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
				    new sap.m.ToolbarSpacer({width: "5px"}),
			        new sap.m.Text({text : oBundleText.getText("LABEL_0047") }).addStyleClass("MiddleTitle"),	// 47:신청내역
			        new sap.m.ToolbarSpacer({width: "15px"}),
			        new sap.m.MessageStrip({
				  	      text : oBundleText.getText("LABEL_1082"),
					      type : "Success",
					      showIcon : true,
					      customIcon : "sap-icon://message-information", 
					      showCloseButton : false,
				    }),
			        new sap.m.ToolbarSpacer({}),
			        new sap.m.Button({
						text: oBundleText.getText("LABEL_0137"),	// 137:지급내역보기
						type : "Ghost",
						press : oController.onPressHistory ,
						visible : { path : "Pernr",
								    formatter : function(fVal){
								    	if(fVal && fVal != "") return true;
								    	else return false;
								    }
						}
				     }).addStyleClass("FontFamily"),
				     new sap.m.ToolbarSpacer({width: "5px"}),
			      ]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
			oApplyInfoMatrix ],
		});
		
	},
	
	getApplyTableInfoRender : function(oController){
		jQuery.sap.require("common.ZHR_TABLES");
		
		return new sap.m.Panel(oController.PAGEID + "_DetailPanel",{
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
//				height : "30px",
				design : sap.m.ToolbarDesign.Auto,
				content : [					       
						   new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						   new sap.m.ToolbarSpacer({width: "5px"}),
						   new sap.m.Text({text : oBundleText.getText("LABEL_0117") }).addStyleClass("MiddleTitle"),	// 117:상세내역
			    		   new sap.m.ToolbarSpacer(),
			    		   new sap.m.Button({
			    			   text : oBundleText.getText("LABEL_0482"),	// 482:추가
			    			   press : oController.onPressNewRecord,
			    			   type : "Ghost",
			    			   enabled : {
				   		    		parts : [ {path : "ZappStatAl"},{path : "Pernr"},{path : "Regno"} ],
				   					formatter : function(fVal1, fVal2, fVal3){
				   						return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
				   					}
			   					},
						   }),
			    		   
			    		   new sap.m.Button({
			    			   text : oBundleText.getText("LABEL_0033"),	// 33:삭제
			    			   type : "Ghost",
			    			   press : oController.onPressDelRecord,
			    			   enabled : {
				   		    		parts : [ {path : "ZappStatAl"},{path : "Pernr"},{path : "Regno"} ],
				   					formatter : function(fVal1, fVal2, fVal3){
				   						return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
				   					}
			   					},
			    		   }),
		    		   
	    		   		]
					}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
			content :  [ sap.ui.jsfragment("ZUI5_HR_Medical.fragment.DetailTable",oController) ]
		});
	},
});