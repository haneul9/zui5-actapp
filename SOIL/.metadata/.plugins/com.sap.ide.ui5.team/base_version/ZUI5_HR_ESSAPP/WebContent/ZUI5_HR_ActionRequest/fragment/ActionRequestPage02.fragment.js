sap.ui.jsfragment("ZUI5_HR_ActionRequest.fragment.ActionRequestPage02", {
	
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
			this.getTargetInfoRender(oController),
			this.getApplyInfoRender(oController),									// 신청내역
			this.getEmpListInfoRender(oController),									// 신청내역
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
										text : oBundleText.getText("LABEL_0005"), 
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
	
	getTargetInfoRender : function(oController){
		var oRow, oCell;
		// 대상자
		var oTargetMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_TargetMatrix",{
			columns : 6,
			widths : ['10%','23.3%','10%','23.3%','10%','23.3%']
		});
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamilyBold")	// 결재선
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 5,
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({text : "{ApprEnames}"}).addStyleClass("FontFamily")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							height : "30px",
							design : sap.m.ToolbarDesign.Auto,
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
							    new sap.m.ToolbarSpacer({width: "5px"}),
						        new sap.m.Text({text : oBundleText.getText("LABEL_1018") }).addStyleClass("MiddleTitle")]	// 1018:결재정보
						}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
						oTargetMatrix ]
		}).setModel(oController._TargetJSonModel)
		.bindElement("/Data");
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		var oRow, oCell;
		
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['10%','70%','10%','10%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0761"),	// 761:제목
						required : true,
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
							    value : "{Title}",
							    editable : {
									parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1){
										if((fVal1 == "" || fVal1 == "10")) return true;
										else return false;
									}
								},
								maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "MoveApply", "Title"),
								width : "100%"
							}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0208"), 	// 208:신청일자
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content :  new sap.m.DatePicker({
						valueFormat : "yyyy-MM-dd",
			            displayFormat : "yyyy.MM.dd",
			            value : "{ZreqDate}",
						width : "100%",
						editable : false,
					}).addStyleClass("FontFamily"),
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0323"),	// 323:신청사유
						required : true,
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
						width : "100%",
						value : "{Reason}",
						rows : 3,
						editable : {
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10")) return true;
									else return false;
								}
							},
						maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "MoveApply", "Reason"),
					    growing : true
					}).addStyleClass("FontFamily"),
					colSpan : 3
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_1021")}).addStyleClass("MiddleTitle"),	// 1021:내신서 신청 내용
				]}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
				oApplyInfoMatrix
			]
		});
	},
	
	
	getEmpListInfoRender : function(oController){
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 30,
			rowHeight : 35,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 0,
			showNoData : false,
			fixedColumnCount : 5
		})
		.setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "38px",
			multiLabels : [ new sap.m.CheckBox(oController.PAGEID + "_checkAll",{
								select : oController.CheckAll}),
				            new sap.m.CheckBox({select : oController.CheckAll}) ],
			template : [new sap.m.CheckBox({
						selected  : "{Check}",
						editable : { parts : [{path : "ZappStatAl"}],
									 formatter : function(fVal1){
										 if(fVal1 != "" && fVal1 != "10") return false; 
										 else return true;
									 }
								}
							})]
		}));

		var colModel = [
			{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : false, filter : false, width : "50px"},
		];
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "120px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0031"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 31:사번
				           new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0031"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],
			template : [new sap.m.Input({ 
							showValueHelp: true,
			        	    valueHelpOnly: true,
			        	    value : "{Perid}",
			        	    valueHelpRequest: oController.displayEmpSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10")) return true;
									else return false;
								}
							},
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		var colModel = [
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "150px"},	// 38:성명
			{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : oBundleText.getText("LABEL_0770"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "150px"},	// 770:직급
			{id: "Ztypetx", label : oBundleText.getText("LABEL_0300"), plabel : oBundleText.getText("LABEL_0300"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "60px"},	// 300:구분
		];
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0381"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 381:조직
				           new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0381"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 381:조직
			template : [new sap.m.Input({ 
							value : "{Orgtx}",
							showValueHelp: true,
			        	    valueHelpOnly: false,
							valueHelpRequest: oController.displayOrgSearchDialog,
							change : function(evt){
								console.log("adfasdf");
							},
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : new sap.ui.core.CustomData({key : "Type", value : "Orgeh"})
							
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1031"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1031:직무
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1031"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1031:직무
			template : [new sap.m.Input({ 
							value : "{Zzjobrlt}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
			        	    valueHelpRequest: oController.openZzjobrlSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : [
								new sap.ui.core.CustomData({key : "Type", value : "Zzjobrl"})
							]
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1030"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1030:직군
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1030"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1030:직군
			template : [new sap.m.Input({ 
							value : "{Zzjikgbt}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
							valueHelpRequest: oController.openSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData :new sap.ui.core.CustomData({key : "Type", value : "Zzjikgb"})
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0067"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 67:직위
				   		   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0067"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 67:직위
			template : [new sap.m.Input({ 
							value : "{Zzjiklnt}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
			        	    valueHelpRequest: oController.openSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : new sap.ui.core.CustomData({key : "type", value : "Zzjikln"})
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1007"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1007:직책
				   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1007"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1007:직책

			template : [new sap.m.Input({ 
							value : "{Zzjikcht}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
			        	    valueHelpRequest: oController.openSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : new sap.ui.core.CustomData({key : "type", value : "Zzjikch"})
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			headerSpan : [2,1],
			multiLabels :[ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1019"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1019:겸직
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0381"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 381:조직
			],
			template : [new sap.m.Input({ 
							value : "{Zzconorg1t}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
							valueHelpRequest: oController.displayOrgSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : new sap.ui.core.CustomData({key : "type", value : "Zzconorg"})
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			headerSpan : [2,1],
			multiLabels :[ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1019"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1019:겸직
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1007"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1007:직책
			],
			template : [new sap.m.Input({ 
							value : "{Zzconjik1t}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
			        	    valueHelpRequest: oController.openSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : new sap.ui.core.CustomData({key : "type", value : "Zzconjik1"})
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			headerSpan : [2,1],
			multiLabels :[ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1035"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1035:파견
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1026"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1026:사내
			],
			template : [new sap.m.Input({ 
							value : "{Zzidsorgt}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
							valueHelpRequest: oController.displayOrgSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : new sap.ui.core.CustomData({key : "type", value : "Zzidsorg"})
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			headerSpan : [2,1],
			multiLabels :[ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1035"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1035:파견
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1027"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1027:사외
			],
			template : [new sap.m.Input({ 
							value : "{Zzodsorgt}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
							valueHelpRequest: oController.displayOrgSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : new sap.ui.core.CustomData({key : "type", value : "Zzodsorg"})
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1020"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1020:기타직무
				   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1020"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1020:기타직무
			template : [new sap.m.Input({ 
							value : "{Zzstellt}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
							valueHelpRequest: oController.openSearchDialog,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							},
							customData : new sap.ui.core.CustomData({key : "type", value : "Zzstell"})
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5 PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1029"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1029:요청일자
				           new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1029"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1029:요청일자
			template : [  new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Reqdt}",
							width : "100%",
							editable : {
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10")) return true;
									else return false;
								}
							},
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "300px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0096"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 96:비고
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0096"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 96:비고
			template : [new sap.m.TextArea({ 
							value : "{Znote}",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Ztype"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "") return true;
									else return false;
								}
							},
							growing : true,
							rows : 1,
							width : "100%"
						}).addStyleClass("FontFamily PaddingLeft5 PaddingRight5")]
		}));
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				oController.onSetRowSpan(oController);
			}
		});
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							content : [
									   new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : oBundleText.getText("LABEL_0018") }).addStyleClass("MiddleTitle"),	// 대상인원
								       new sap.m.ToolbarSpacer({}),
								       new sap.m.Button({
						    			   text : oBundleText.getText("LABEL_1023"),	// 1023:대상추가
						    			   press : oController.onPressNewRecord,
						    			   type : "Ghost",
						    			   visible : {
												parts : [{path : "ZappStatAl"}],
												formatter : function(fVal1){
													if((fVal1 == "" || fVal1 == "10")) return true;
													else return false;
												}
											},
						    		   }).addStyleClass("FontFamily"),
						    		   new sap.m.Button({
						    			   text : oBundleText.getText("LABEL_1022"),	// 1022:대상삭제
						    			   press : oController.onPressDelRecord,
						    			   type : "Ghost",
						    			   visible : {
												parts : [{path : "ZappStatAl"}],
												formatter : function(fVal1){
													if((fVal1 == "" || fVal1 == "10")) return true;
													else return false;
												}
											},
						    		   }).addStyleClass("FontFamily"),
								       
								       
								       ]
						}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), oTable ]
		});
		
	},
	
	
	
	
	
	
	
	
//	createContent : function(oController) {
//		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
//		var oRow, oCell;
//		
//		// 대상자
//		var oTargetMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_TargetMatrix",{
//			columns : 6,
//			widths : ['10%','23.3%','10%','23.3%','10%','23.3%']
//		});
//		
//		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
//			height : "30px",
//			cells : [
//				new sap.ui.commons.layout.MatrixLayoutCell({
//					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamily")	// 결재선
//				}).addStyleClass("MatrixLabel"),
//				new sap.ui.commons.layout.MatrixLayoutCell({
//					colSpan : 5,
//					content : new sap.m.Toolbar({
//						content : [new sap.m.Text({text : "{ApprEnames}"}).addStyleClass("FontFamily")]
//					}).addStyleClass("ToolbarNoBottomLine")
//				}).addStyleClass("MatrixData")
//				.setModel(oController._DetailJSonModel).bindElement("/Data")
//			]
//		});
//		
//		oTargetMatrix.addRow(oRow);
//		
//		var oTargetPanel = new sap.m.Panel({
//			expandable : false,
//			expanded : false,
//			content : [new sap.m.Toolbar({
//							height : "30px",
//							design : sap.m.ToolbarDesign.Auto,
//							content : [new sap.ui.core.Icon({
//											src: "sap-icon://open-command-field", 
//											size : "1.0rem"
//										}),
//									   new sap.m.ToolbarSpacer({width: "5px"}),
//								       new sap.m.Text({text : oBundleText.getText("LABEL_1018") }).addStyleClass("FontFamilyBold")]	// 1018:결재정보
//						}).addStyleClass("ToolbarNoBottomLine"), oTargetMatrix ]
//		}).setModel(oController._TargetJSonModel)
//		.bindElement("/Data");
//		
//		
//		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 4,
//			widths : ['10%','70%','10%','10%']
//		});
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
//			height : "30px",
//			cells : [
//				new sap.ui.commons.layout.MatrixLayoutCell({
//					content : new sap.m.Label({
//						text : oBundleText.getText("LABEL_0761"),	// 761:제목
//						required : true,
//					}).addStyleClass("FontFamily")
//				}).addStyleClass("MatrixLabel"),
//				new sap.ui.commons.layout.MatrixLayoutCell({
//					content : new sap.m.Input({
//							    value : "{Title}",
//							    editable : {
//									parts : [{path : "ZappStatAl"}],
//									formatter : function(fVal1){
//										if((fVal1 == "" || fVal1 == "10")) return true;
//										else return false;
//									}
//								},
//								maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "MoveApply", "Title"),
//								width : "95%"
//							}).addStyleClass("FontFamily")
//				}).addStyleClass("MatrixData"),
//				new sap.ui.commons.layout.MatrixLayoutCell({
//					content : new sap.m.Label({
//						text : oBundleText.getText("LABEL_0208"), 	// 208:신청일자
//						required : true
//					}).addStyleClass("FontFamily")
//				}).addStyleClass("MatrixLabel"),
//				new sap.ui.commons.layout.MatrixLayoutCell({
//					content :  new sap.m.DatePicker({
//						valueFormat : "yyyy-MM-dd",
//			            displayFormat : "yyyy.MM.dd",
//			            value : "{ZreqDate}",
//						width : "150px",
//						editable : false,
//					}).addStyleClass("FontFamily"),
//				}).addStyleClass("MatrixData"),
//			]
//		});
//		oApplyInfoMatrix.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
//			cells : [
//				new sap.ui.commons.layout.MatrixLayoutCell({
//					content : new sap.m.Label({
//						text : oBundleText.getText("LABEL_0323"),	// 323:신청사유
//						required : true,
//					}).addStyleClass("FontFamily")
//				}).addStyleClass("MatrixLabel"),
//				new sap.ui.commons.layout.MatrixLayoutCell({
//					content : new sap.m.TextArea({
//						width : "99%",
//						value : "{Reason}",
//						rows : 3,
//						editable : {
//								parts : [{path : "ZappStatAl"}],
//								formatter : function(fVal1){
//									if((fVal1 == "" || fVal1 == "10")) return true;
//									else return false;
//								}
//							},
//						maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "MoveApply", "Reason"),
//					    growing : true
//					}).addStyleClass("FontFamily"),
//					colSpan : 3
//				}).addStyleClass("MatrixData"),
//			]
//		});
//		oApplyInfoMatrix.addRow(oRow);
//		
//		var oApplyInfoPanel = new sap.m.Panel({
//			expandable : false,
//			expanded : false,
//			content : [
//				new sap.m.Toolbar({
//					design : sap.m.ToolbarDesign.Auto,
//					height : "30px",
//					content : [new sap.ui.core.Icon({
//						src: "sap-icon://open-command-field", 
//						size : "1.0rem"
//					}),
//					new sap.m.ToolbarSpacer({width: "5px"}),
//					new sap.m.Text({text : oBundleText.getText("LABEL_1021")}).addStyleClass("FontFamilyBold"),	// 1021:내신서 신청 내용
//				]}).addStyleClass("ToolbarNoBottomLine"),
//				oApplyInfoMatrix
//			]
//		});
//		
//		
//		
//		
//		
//	
//		/////////////////////////////////////////////////////////////		
//		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 3,
//			widths : ["20px","","20px"],
//			width : "100%"
//		});
//		
//		var oContents = [
//			new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}), 
//			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),
//			oTargetPanel,
//			oApplyInfoPanel,
//			oTablePanel,
//			sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController), 
//		    sap.ui.jsfragment("fragment.ApplyLayout", oController),
//			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController), // 결재내역
//			sap.ui.jsfragment("fragment.Comments", oController)	// 승인 / 반려 
//		];
//		
//		for(var i=0;i<oContents.length;i++){
//			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
//			oRow.addCell(oCell);
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				content : oContents[i]
//			});
//			oRow.addCell(oCell);
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
//			oRow.addCell(oCell);
//			oContentMatrix.addRow(oRow);
//		}
//		
//		var oLayout = new sap.ui.commons.layout.VerticalLayout({
//			width : "100%",
//			content : [oContentMatrix]
//		}).setModel(oController._DetailJSonModel);
//		
//		oLayout.bindElement("/Data");
//		oLayout.addStyleClass("sapUiSizeCompact");
//
//		return oLayout;
//
//	
//	}
});