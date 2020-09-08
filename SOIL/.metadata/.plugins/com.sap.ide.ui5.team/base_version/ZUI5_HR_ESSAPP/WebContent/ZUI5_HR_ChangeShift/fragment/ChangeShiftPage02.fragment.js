sap.ui.jsfragment("ZUI5_HR_ChangeShift.fragment.ChangeShiftPage02", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "3%"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 38:성명
		{id: "Schkz", label : oBundleText.getText("LABEL_0008"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "15%"},	// 8:근무일정규칙
		{id: "Wrkjob", label : oBundleText.getText("LABEL_0010"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "15%"},	// 10:근무직
		{id: "Reasn", label : oBundleText.getText("LABEL_0032"), plabel : "", span : 0, type : "string", sort : false, filter : false},	// 32:사유
		{id: "BtnWrk", label : oBundleText.getText("LABEL_0007"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 7:근무일정 확인
	],
	
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
			this.getEmpTableRender(oController),									// 신청대상자 테이블
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
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {text : oBundleText.getText("LABEL_0011") }).addStyleClass("Font18px FontColor0"),	// 11:근무편제변경 신청
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0005"),	// 5:결재지정
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
					// 적용일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0062"), 	// 62:적용일
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker(oController.PAGEID + "_Datum", {
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Datum}",
									width : "150px",
									change : oController.onChangeDatum,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
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
							text : oBundleText.getText("LABEL_0011") 	// 11:근무편제변경 신청
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
	 * 신청대상자테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getEmpTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			extension : new sap.m.Toolbar({
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0016")	// 16:내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0030"),	// 30:부서별근무조현황에서 추가
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSelectByOrg,
						visible : {
							path : "ZappStatAl",
							formatter : function(fVal) {
								return (fVal == "" || fVal == "10") ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data"),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0023"),	// 23:등록
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressAdd,
						visible : {
							path : "ZappStatAl",
							formatter : function(fVal) {
								return (fVal == "" || fVal == "10") ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data"),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0026"),	// 26:복사
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressCopy,
						visible : {
							path : "ZappStatAl",
							formatter : function(fVal) {
								return (fVal == "" || fVal == "10") ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data"),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0033"),	// 33:삭제
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressDelRecord,
						visible : {
							path : "ZappStatAl",
							formatter : function(fVal) {
								return (fVal == "" || fVal == "10") ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data")
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		// Ename
		oTable.getColumns()[2].setTemplate(new sap.m.Input({ 
			value : "{Ename}",
			showValueHelp: true,
			valueHelpOnly: false,
			valueHelpRequest: oController.onRowPernrChange,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			},
			customData : [
				new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"}),
				new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"})
			]
		}).addStyleClass("Font14px FontColor3"));
		
		// Schkz
		oTable.getColumns()[3].setTemplate(new sap.m.ComboBox(oController.PAGEID + "_Schkz", {
			items : {
				path : "/Schkzs",
				template : new sap.ui.core.ListItem({
					key : "{key}",
					text : "{text}"
				}),
				templateShareable : true
			},
			selectedKey : "{Schkz}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// Wrkjob
		oTable.getColumns()[4].setTemplate(new sap.m.ComboBox({ 
			selectedKey : "{Wrkjob}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			},
			items : {
				path: "ZHR_WORKSCHDULE_SRV>/WrkjobCodeListSet",
				template: new sap.ui.core.ListItem({
					key: "{ZHR_WORKSCHDULE_SRV>Comcd}",
					text: "{ZHR_WORKSCHDULE_SRV>Comcdt}",
				}),
				templateShareable : true
			}
		}).addStyleClass("Font14px FontColor3"));

		// Reasn
		oTable.getColumns()[5].setTemplate(new sap.m.Input({
			value : "{Reasn}" , 
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			},
			maxLength : common.Common.getODataPropertyLength("ZHR_WORKSCHDULE_SRV", "ChangeSchkzDetail", "Reasn"),
		}).addStyleClass("Font14px FontColor3"));

		// BtnWrk
		oTable.getColumns()[6].setTemplate(new sap.m.Button({
			text : oBundleText.getText("LABEL_0007"),	// 근무일정 확인
			type : sap.m.ButtonType.Ghost,
			press : oController.onCheckWorkSchedule,
			customData : [new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"})]
		}).addStyleClass("Font14px FontColor3"));
		
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