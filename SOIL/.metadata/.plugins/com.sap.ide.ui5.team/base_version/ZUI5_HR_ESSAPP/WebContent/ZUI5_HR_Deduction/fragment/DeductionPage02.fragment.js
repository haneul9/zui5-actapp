jQuery.sap.require("control.ODataFileUploader");

sap.ui.jsfragment("ZUI5_HR_Deduction.fragment.DeductionPage02", {
	
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
			this.getApplyInfoRender(oController),									// 신청항목
			this.getDeatilTableRender(oController),									// 상세내역 테이블
			sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),			// 첨부파일
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController),	// 결재내역
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
									text : oBundleText.getText("LABEL_0485")	// 485:[공장]고정공제 신청
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0005"), 	// 결재지정
										press : common.ApprovalLineAction.onApprovalLine,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
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
										press : oController.onPreSaveOpenDialog,
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
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 고정공제
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0472"), 	// 472:고정공제
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input(oController.PAGEID + "_Dedtx", {
									width : "45%",
									showValueHelp: true,
									valueHelpOnly: false,
									value : "{Dedtx}",
									change : oController.DedtxSearchInput,
									valueHelpRequest: oController.displayDedgbDialog,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : "{Dedcd}"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 동호회 여부
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0445")	// 445:동호회 여부
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.CheckBox({
							selected : "{Dmemyn}",
							editable : false
						})
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 공제인원
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0476")	// 476:공제인원
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "45%",
									value : "{Percnt}",
									editable : false
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 공제금액
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0474")	// 474:공제금액
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "45%",
									value : "{Reqamt}",
									editable : false
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 입금계좌정보
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0454")	// 454:입금계좌정보
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "45%",
									value : "{Bankn}",
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : "{Bankctx}"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 예금주
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0450")	// 450:예금주
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "45%",
									value : "{Emftx}",
									editable : false
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 공제예정월
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0441")	// 441:공제예정월
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "45%",
									value : "{Reqym}",
									editable : false
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 비고
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "100%",
									value : "{Zbigo}",
									maxLength : common.Common.getODataPropertyLength("ZHR_DEDUCT_FIX_SRV", "DeductFixAppl", "Zbigo"),
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0047") 	// 47:신청내역
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				})
			]
		});
	},
	
	/**
	 * 상세테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getDeatilTableRender : function(oController) {
		
		var _colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", width : "5%"},
			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", width : "8%" }, //  sort : true},	// 31:사번
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", width : "14%"},	// 38:성명
			{id: "Orgtx", label : oBundleText.getText("LABEL_0479"), plabel : "", span : 0, type : "string", width : "20%", align : sap.ui.core.TextAlign.Begin},	// 479:소속
			{id: "Betrg", label : oBundleText.getText("LABEL_0474"), plabel : "", span : 0, type : "string", width : "16%"},	// 474:공제금액
			{id: "Chrsn", label : oBundleText.getText("LABEL_0478"), plabel : "", span : 0, type : "string", width : "16%"},	// 478:변경사유
			{id: "Message", label : oBundleText.getText("LABEL_0477"), plabel : "", span : 0, type : "string", width : "26%", align : sap.ui.core.TextAlign.Begin}	// 477:메세지
		];
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID+"_EXCEL_UPLOAD_BTN", {
			name : "UploadFile",
			slug : "",
			maximumFileSize: 1,
			multiple : false,
			uploadOnChange: false,
			mimeType: [],
			fileType: ["csv","xls","xlsx"],
			buttonText : oBundleText.getText("LABEL_0481") + " ▲",	// 481:엑셀
			buttonOnly : true,
			change : oController.changeFile,
			visible : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2) {
					return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
				}
			}
		}).addStyleClass("L2PPaddingLeft1rem");
		
		oFileUploader.addDelegate({
			onAfterRendering: function() {
				$("#" + oController.PAGEID + "_EXCEL_UPLOAD_BTN").find('BUTTON > span')
					.removeClass('sapMBtnDefault sapMBtnHoverable')
					.addClass('sapMBtnGhost');
			}
		});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedBottomRowCount : 1,
			extension : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text : oBundleText.getText("LABEL_0064"),	// 64:조회
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressRetrieve,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					}),
					new sap.m.Button({
						text : oBundleText.getText("LABEL_0482"),	// 482:추가
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressAdd,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					}),
					new sap.m.Button({
						text : oBundleText.getText("LABEL_0026"),	// 26:복사
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressCopy,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					}),
					new sap.m.Button({
						text : oBundleText.getText("LABEL_0033"),	// 33:삭제
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressDelRecord,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					}),
					new sap.m.Button({
						text : oBundleText.getText("LABEL_0480"),	// 480:업로드 양식 다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressFormExcelDown,
						visible : {
							path : "ZappStatAl",
							formatter : function(fVal){
								if(fVal == "" || fVal == "10") return true;
								else return false;
							}
						}
					}),
					oFileUploader,
					new sap.m.Button({
						text : oBundleText.getText("LABEL_0481") + " ▼",	// 481:엑셀
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressExcelDown,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					}),
					new sap.m.Button({
						text : oBundleText.getText("LABEL_2944"),	// 2944:정렬(사번)
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSort,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					}),
				]
			})
			.addStyleClass("ToolbarNoBottomLine")
			.setModel(oController._DetailJSonModel)
			.bindElement("/Data")
		})
		.setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		/*oTable.addEventDelegate({
			onAfterRendering : function() {
				oController.onSetTotalRowColor(oController);
			}
		});*/
		
		common.ZHR_TABLES.makeColumn(oController, oTable, _colModel);

		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(_colModel);
		
		// Ename
		oTable.getColumns()[2].setTemplate(new sap.m.Toolbar({
			content : [
				new sap.m.Text({
					text : "{Ename}",
					width : "100%",
					visible : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == undefined) return true;
							else return false;
						}
					}
				}).addStyleClass("Font14px FontColor3 totalRowAlignCenter"),
				new sap.m.Input({
					value : "{Ename}",
					showValueHelp: true,
					valueHelpOnly: false,
					change : oController.onRowPernrEnterChange,
					valueHelpRequest: oController.onRowPernrChange,
					customData : [
						new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"}),
						new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"})
					],
					visible : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == undefined) return false;
							else return true;
						}
					},
					editable : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == "" || fVal1 == "10") return true;
							else return false;
						}
					}
				}).addStyleClass("Font14px FontBold FontColor3")
			]
		}));
		
		// Betrg
		oTable.getColumns()[4].setTemplate(new sap.m.Toolbar({
			content : [
				new sap.m.Text({ 
					text : "{Betrg}",
					width : "100%",
					visible : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == undefined) return true;
							else return false;
						}
					}
				}).addStyleClass("Font14px FontColor3 totalRowAlignCenter"),
				new sap.m.Input({ 
					value : "{Betrg}",
					textAlign : sap.ui.core.TextAlign.Right,
					change : oController.onChangeAmt,
					visible : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == undefined) return false;
							else return true;
						}
					},
					editable : {
						parts : [{path : "ZappStatAl"}, {path : "Chrsn"}],
						formatter : function(fVal1, fVal2){
							return ((fVal1 == "" || fVal1 == "10") && fVal2 != "1") ? true : false;
						}
					}
				}).addStyleClass("Font14px FontColor3 Number")
			]
		}));

		// Chrsn
		oTable.getColumns()[5].setTemplate(new sap.m.ComboBox({
			selectedKey : "{Chrsn}",
			change : oController.onChangeChrsn,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					if(fVal1 == "" || fVal1 == "10") return true;
					else return false;
				}
			},
			visible : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					if(fVal1 == undefined) return false;
					else return true;
				}
			},
			items : {
				path: "ZHR_DEDUCT_FIX_SRV>/DeductChrsnSet",
				template: new sap.ui.core.ListItem({
					key: "{ZHR_DEDUCT_FIX_SRV>Chrsn}",
					text: "{ZHR_DEDUCT_FIX_SRV>Chrsntx}"
				}),
				templateShareable : true
			}
		}).addStyleClass("Font14px FontColor3"));

		// Message
		oTable.getColumns()[6].setTemplate(new sap.m.Text({ text : "{Message}" }).addStyleClass("FontFamilyRed"));
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oTable
						})
					]
				})
			]
		}).addStyleClass("marginTop20px marginBottom10px");
	}
});