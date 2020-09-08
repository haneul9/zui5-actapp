sap.ui.jsfragment("ZUI5_HR_ParentalLeave.fragment.ParentalLeavePage02", {
	
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
			this.getTitleRender(oController),	
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyInfoRender(oController),									// 신청내역
			this.getHistoryInfoRender(oController),						// 휴가자/대근자 정보
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
					// 구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0157"), 	// 157:신청유형
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "150px",
									selectedKey : "{Aptyp}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									items : {
										path: "ZHR_LEAVEAPPL_SRV>/AptypCodeListSet",
										filters : [
											{sPath : 'ZreqForm', sOperator : 'EQ', oValue1 : oController._vZworktyp}
										],
										template: new sap.ui.core.ListItem({
											key: "{ZHR_LEAVEAPPL_SRV>Aptyp}",
											text: "{ZHR_LEAVEAPPL_SRV>Atext}",
										})
									},
									change : oController.onChangeAptyp
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2897"), 	// 2897:분할사용
							visible : {
								path : "Aptyp",
								formatter : function(fVal){
									return fVal == "2010" ? true : false;
								}
							}
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.CheckBox({
									selected : "{Divyn}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									visible : {
										path : "Aptyp",
										formatter : function(fVal){
											return fVal == "2010" ? true : false;
										}
									},
									select : function(evt){
										if(evt.mParameters.selected == true){
											sap.m.MessageBox.information(oBundleText.getText("LABEL_2898"), {title : oBundleText.getText("LABEL_0052")});	// 2898:유산의 경험,고위험산모, 조산 및 유산의 우려가 있는 진단서 첨부 시에만 신청가능
										}
									}
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 통근지역내 무주택
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1204"),	// 1204:기간
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Begda}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Endda}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0918"),	// 918:사용일수
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "150px",
									value : "{Useday}",
							    	editable : false,
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_TypeARow1",{
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0755"),	// 755:분만예정일
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Dlvda}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1635"),	// 1635:다태아 구분
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "150px",
									selectedKey : "{Twins}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									items : [new sap.ui.core.Item({key: "1", text: oBundleText.getText("LABEL_1190")}),	// 1190:단태아
										     new sap.ui.core.Item({key: "2", text: oBundleText.getText("LABEL_1189")})],	// 1189:다태아
									change : oController.onChangeDate
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_TypeARow2",{
				height : "30px",
				cells : [
					// 구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2237"), 	// 2237:출산전일수
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({ 
									value : "{Befday}",
									width : "150px",
									editable : false
								}).addStyleClass("FontFamily")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2239"), 	// 2239:출산후일수
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({ 
									value : "{Aftday}",
									width : "150px",
									editable : false
								}).addStyleClass("FontFamily")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID +"_TypeBRow1",{
				height : "30px",
				cells : [
					// 자녀명
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0760"), 	// 760:자녀명
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID +"_Family",{
									width : "300px",
									selectedKey : "{Regno}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									change : oController.onChangeFamily
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// MRD
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0121"), 	// 121:생년월일
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
							    	value : "{Gbdatx}",
							    	width : "150px",
							    	editable : false
								}).addStyleClass("FontFamily"),
								
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID +"_TypeCRow1",{
				height : "30px",
				cells : [
					// 주수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2889"), 	// 2889:주수
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "300px",
									selectedKey : "{Pregwks}",
									editable : {
										parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									items : {
										path: "ZHR_LEAVEAPPL_SRV>/PregwkCodeListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_LEAVEAPPL_SRV>Pregwks}",
											text: "{ZHR_LEAVEAPPL_SRV>Pregwkx}"
										})
									}
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0159"), 	// 159:일수
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "300px",
									selectedKey : "{Pregdays}",
									editable : {
										parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									items : {
										path: "ZHR_LEAVEAPPL_SRV>/PregdayCodeListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_LEAVEAPPL_SRV>Pregdays}",
											text: "{ZHR_LEAVEAPPL_SRV>Pregdayx}"
										})
									}
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 비고
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0323"), 	// 323:신청사유
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Reasn}",
									width : "95%",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "MaternityLeaveDetail", "Reasn"),
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2180")	// 2180:직무인수인
						}).addStyleClass("FontFamilyBold")
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
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
//					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1895") 	// 1895:신청 내역
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button({
			    			   text : oBundleText.getText("LABEL_0006"),	// 근무일정
			    			   type : "Ghost",
			    			   press : oController.onCheckWorkSchedule,
		    		   })
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
	
	/**
	 * 신청 이력  rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getHistoryInfoRender : function(oController){
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable1",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
			columnHeaderHeight : 35,
			visibleRowCount : 1,
			width : "1055px"
		}).setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		var col_info1 = [
			{id: "ZreqDate", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "date", sort : false, filter : false, width : "10%"},	// 49:신청일
			 {id: "Dlvda", label : oBundleText.getText("LABEL_0755"), plabel : "", span : 0, type : "date", sort : false, filter : false, width : "10%"},	// 755:분만예정일
			 {id: "TwinType", label : oBundleText.getText("LABEL_0300"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 300:구분
			 {id: "Period", label : oBundleText.getText("LABEL_1204"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "30%"},	// 1204:기간
			 {id: "Useday", label : oBundleText.getText("LABEL_0159"), plabel : "", span : 0, type : "cnumber2", sort : false, filter : false, width : "10%"},	// 159:일수
			 {id: "Befday", label : oBundleText.getText("LABEL_2236"), plabel : "", span : 0, type : "cnumber2", sort : false, filter : false, width : "8%"},	// 2236:출산전
			 {id: "Aftday", label : oBundleText.getText("LABEL_2238"), plabel : "", span : 0, type : "cnumber2", sort : false, filter : false, width : "8%"},	// 2238:출산후
			];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable2",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
			columnHeaderHeight : 35,
			visibleRowCount : 1,
			width : "855px"
		}).setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		var col_info2 = [{id: "ZreqDate", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "date", sort : false, filter : false, width : "10%"},	// 49:신청일
						 {id: "Fname", label : oBundleText.getText("LABEL_0760"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "20%"},	// 760:자녀명
						 {id: "Period", label : oBundleText.getText("LABEL_1204"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "30%"},	// 1204:기간
						 {id: "Useday", label : oBundleText.getText("LABEL_0159"), plabel : "", span : 0, type : "cnumber2", sort : false, filter : false, width : "10%"},	// 159:일수
						 {id: "Sumday", label : oBundleText.getText("LABEL_1633"), plabel : "", span : 0, type : "cnumber2", sort : false, filter : false, width : "10%"},	// 1633:누적일수
						];
		common.ZHR_TABLES.makeColumn(oController, oTable2, col_info2);
		
		return new sap.m.Panel(oController.PAGEID + "_HistoryPanel",{
			expandable : false,
			expanded : false,
			width : "70%",
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1901") 	// 1901:신청이력
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				oTable,
				oTable2
			],
		});
	},
	
	/**
	 * 신청 이력  rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getHistoryInfoRender2 : function(oController){
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable2",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
//			columnHeaderHeight : 35,
			visibleRowCount : 1
		}).setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		var col_info1 = [{id: "Datum", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "150px"},	// 49:신청일
						 {id: "Week", label : oBundleText.getText("LABEL_0760"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "200px"},	// 760:자녀명
						 {id: "Rtext", label : oBundleText.getText("LABEL_1204"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "300px"},	// 1204:기간
						 {id: "Ttext", label : oBundleText.getText("LABEL_0159"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 159:일수
						 {id: "Perid", label : oBundleText.getText("LABEL_1633"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 1633:누적일수
						];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		return new sap.m.Panel(oController.PAGEID +"_History2",{
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1901") 	// 1901:신청이력
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				oTable,
			]
		});
	},
	
	/**
	 * 연차 현황, 휴가신청 내역  rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getEmpList : function(oController){
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
//			columnHeaderHeight : 35,
			visibleRowCount : 1
		}).setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		var col_info1 = [
			{id: "Datum", label : oBundleText.getText("LABEL_2371"), plabel : oBundleText.getText("LABEL_0057"), span : 4, type : "string", sort : false, filter : false, width : "100px"},	// 57:일자, 2371:휴가자
			 {id: "Week", label : "", plabel : oBundleText.getText("LABEL_0054"), span : 0, type : "string", sort : false, filter : false, width : "50px"},	// 54:요일
			 {id: "Rtext", label : "", plabel : oBundleText.getText("LABEL_0006"), span : 0, type : "string", sort : false, filter : false, width : "200px"},	// 근무일정
			 {id: "Ttext", label : "", plabel : oBundleText.getText("LABEL_0671"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 671:근무시간
			 {id: "Perid", label : oBundleText.getText("LABEL_1669"), plabel : oBundleText.getText("LABEL_0031"), span : 9, type : "string", sort : false, filter : false, width : "80px"},	// 31:사번, 1669:대근자(대근일 포함)
			];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "120px",
			multiLabels : [ new sap.ui.commons.TextView({text : "", textAlign : "Center"}).addStyleClass("FontFamily"),
				            new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0038"), textAlign : "Center"}).addStyleClass("FontFamily")],	// 38:성명
			template : [new sap.m.Input({
				value : "{Ename}",
		    	editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
				textAlign : "Center",
				valueHelpOnly : true,
				showValueHelp : true,
				valueHelpRequest: oController.onPressAdd,
			}).addStyleClass("FontFamily")]
		}));
		
		col_info1 = [{id: "Sttext", label : "", plabel : oBundleText.getText("LABEL_0671"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 671:근무시간
			 {id: "TwrktmDat", label : "", plabel : oBundleText.getText("LABEL_1668"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 1668:대근일 총근로
			 {id: "TwrktmWek", label : "", plabel : oBundleText.getText("LABEL_2139"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 2139:주당 총근로
			 {id: "RestmTre", label : "", plabel : oBundleText.getText("LABEL_1417"), span : 0, type : "string", sort : false, filter : false, width : "80px"},	// 1417:3개월 특근가능 잔여시간
			 {id: "Zstat", label : "", plabel : oBundleText.getText("LABEL_0036"), span : 0, type : "string", sort : false, filter : false, width : "50px"},	// 36:상태
			 {id: "Confchk", label : "", plabel : oBundleText.getText("LABEL_1672"), span : 0, type : "string", sort : false, filter : false, width : "50px"},	// 1672:대근지정 적합여부
			];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
        	multiLabels : [ new sap.ui.commons.TextView({text : "", textAlign : "Center"}).addStyleClass("FontFamily"),
        					new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0096"), textAlign : "Center"}).addStyleClass("FontFamily")],	// 96:비고
			showFilterMenuEntry : true,
			width : "8%",
			template : [new sap.m.Input({
				value : "{Zbigo}",
		    	editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
				maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "LeaveAppDetail", "Zbigo"),
				textAlign : "Begin",
			}).addStyleClass("FontFamily")]
		});
		oTable.addColumn(oColumn);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
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
							text : oBundleText.getText("LABEL_2372") 	// 2372:휴가자/대근자 정보
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				oTable,
			]
		});
	},
});