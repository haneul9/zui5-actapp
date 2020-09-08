sap.ui.jsfragment("ZUI5_HR_VacationDispatchChange.fragment.VacationDispatchChangePage02", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
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
			this.getApplyTable(oController),									// 신청내역
			sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController),			// 첨부
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
									text : oBundleText.getText("LABEL_2291")	// 2291:파견직 근태 변경/취소 신청
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0759"),	// 759:위임지정
										press : common.MandateAction.onMandate,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal){
												if(fVal == "" || fVal == "10") return true;
												else return false;
											}
										}
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0005"),	// 5:결재지정
										press : common.ApprovalLineAction.onApprovalLine,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal){
												if(fVal == "" || fVal == "10") return true;
												else return false;
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
										press : oController.onPressSaveC,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
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
					// 통근지역내 무주택
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1896"),	// 1896:신청 유형
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "200px",
									selectedKey : "{Chtyp}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									items : [new sap.ui.core.Item({key: "A", text: oBundleText.getText("LABEL_0751")}),	// 751:변경
									         new sap.ui.core.Item({key: "B", text: oBundleText.getText("LABEL_0071")})],	// 71:취소
									change : oController.onChangeChtyp
								}).addStyleClass("Font14px FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine"),
						colSpan : 3
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 집중휴가중 직무인수인
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0762")	// 762:집중휴가중 직무인수인
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Takper}",
									width : "300px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "LeaveAppList", "Takper"),
								}).addStyleClass("Font14px FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
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
							text : oBundleText.getText("LABEL_2291") 	// 2291:파견직 근태 변경/취소 신청
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data"),
			]
		});
	},
	
	/**
	 * 신청내역 Table rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyTable : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_ApplyTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
//			selectionMode : sap.ui.table.SelectionMode.Multitoggle,
			visibleRowCount : 1
		});
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "250px",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0749"),	// 749:기신청
											textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0578"),	// 578:근태유형
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [new sap.m.Text({
							text : "{Oaptxt}"
						}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "10%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0749"),	// 749:기신청
				   							textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0042"),	// 42:시작일
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Ovcbeg}",
					editable : false
			   }).addStyleClass("FontFamily")
			]
		}));	
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "10%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0749"),	// 749:기신청
				   							textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0065"),	// 65:종료일
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Ovcend}",
					editable : false
			   }).addStyleClass("FontFamily")
			]
		}));
		
		// 휴가 combo
		var oAptyp = new sap.m.ComboBox({ 
			selectedKey : "{Aptyp}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Chtyp"}],
				formatter : function(fVal1, fVal2){
					if((fVal1 == "" || fVal1 == "10" ) && fVal2 == "A" ) return true;
					else return false;
				}
			},
			change : oController.onChangeTableAptyp,
			width : "250px"
		}).addStyleClass("FontFamily");
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		oModel.read("/AptypCodeListSet", {
			async: false,
			filters : [
				new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oAptyp.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Aptyp, 
								text: data.results[i].Aptxt,
								customData : [new sap.ui.core.CustomData({ key : "Awart", value : data.results[i].Awart})], // 근무/휴무 유형  
							})
						);
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "18%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0751"),	// 751:변경
											textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0578"),	// 578:근태유형
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						  ],
			headerSpan : [3,1],
			template : oAptyp
		}));
		
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "10%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0751"),	// 751:변경
				   							textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0042"),	// 42:시작일
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Begda}",
		            editable : {
			    		parts : [ {path : "ZappStatAl"}, {path : "Chtyp"}],
						formatter : function(fVal1, fVal2){ // 변경 일 경우에만 Data 변경가능 
							if((fVal1 == "" || fVal1 == "10" ) && fVal2 == "A" ) return true;
							else return false;
						}
					},
					change : oController.onChangeDate
			   }).addStyleClass("FontFamily")
			]
		}));	
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "10%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0751"),	// 751:변경
				   							textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0065"),	// 65:종료일
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Endda}",
		            editable : {
			    		parts : [ {path : "ZappStatAl"}, {path : "Chtyp"}],
						formatter : function(fVal1, fVal2){ // 변경 일 경우에만 Data 변경가능 
							if((fVal1 == "" || fVal1 == "10" ) && fVal2 == "A" ) return true;
							else return false;
						}
					},
					change : oController.onChangeDate
			   }).addStyleClass("FontFamily")
			]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "6%",
			multiLabels :new sap.m.Label({text : oBundleText.getText("LABEL_2369"),	// 2369:휴가일수
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
	        template : new sap.m.Text({
							text : "{Useday}"
						}).addStyleClass("FontFamily")
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
//			width : "25%",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0032"),	// 32:사유
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : new sap.m.Input({
							value  : "{Reasn}",
							editable : {
					    		parts : [ {path : "ZappStatAl"} ],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10" )) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "ChangeLeaveAppDetail", "Reasn"),
						}).addStyleClass("FontFamily")
		}));
		
		oTable.setModel(oController._ApplyTableJSonModel);
		oTable.bindRows("/Data");
		
		oTable.addEventDelegate({
	           onAfterRendering: function() {
	        	   oController.onSetRowSpan();
	           }
	      });
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0016") 	// 16:내역
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						// Buttons
						new sap.m.Button({
							text : oBundleText.getText("LABEL_1229"),	// 1229:신청내역 조회
							type : "Ghost",
							press : oController.openHistoryDialog,
						}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0006"),	// 6:근무일정
							type : "Ghost",
							press : oController.onCheckWorkSchedule,
						}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0033"),	// 33:삭제
							type : "Ghost",
							press : oController.onDeleteHistory,
						})
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				oTable
			],
			visible : {
				path : "Chtyp",
				formatter : function(fVal){
					return !common.Common.checkNull(fVal) ;
				}
			}
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	}

});