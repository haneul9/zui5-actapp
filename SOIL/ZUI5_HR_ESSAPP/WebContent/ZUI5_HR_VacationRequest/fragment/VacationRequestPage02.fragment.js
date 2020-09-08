sap.ui.jsfragment("ZUI5_HR_VacationRequest.fragment.VacationRequestPage02", {
	
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
			this.getTitleRender(oController),	
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyInfoRender(oController),									// 신청내역
			this.getEmpList(oController),								// 휴가자/대근자 정보
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
								new sap.m.Text(oController.PAGEID + "_DetailTitle").addStyleClass("Font18px FontColor0"),	
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0759"), // 759:위임지정
										  press : common.MandateAction.onMandate,
										  visible : {
											  path : "ZappStatAl",
											  formatter : function(fVal){
												  if(fVal == "" || fVal == "10") return true;
												  else return false;
											  }
										  }
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
						}).addStyleClass("ToolbarNoBottomLine")
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
				height : "35px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0763"),	// 763:휴가
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
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
											text: "{ZHR_LEAVEAPPL_SRV>Aptxt}",
											customData : [new sap.ui.core.CustomData({ key : "Awart", value : "{ZHR_LEAVEAPPL_SRV>Awart}"})], // 근무/휴무 유형      
										})
									},
									change : oController.onChangeAptyp,
									visible : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "" || fVal == "10") return true;
											else return false;
										}
									}
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({
									text : "{Aptxt}",
									visible : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal != "" && fVal != "10") return true;
											else return false;
										}
									}
								}).addStyleClass("Font14px FontColor6"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 기간
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
							    	value : "{Vcbeg}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									change : function(event){
							    		oController._DetailJSonModel.setProperty("/Data/Vcend", event.getSource().getValue());
							    		oController.onChangeDate()
							    	}
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("Font14px FontColor6"),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Vcend}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("Font14px FontColor6"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ChildBirthRow",{
				height : "35px",
				cells : [
					// 배우자 출산휴가 횟수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1741"),	// 1741:배우자 출산휴가 횟수
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.RadioButtonGroup({
									columns : 2,
									buttons : [new sap.m.RadioButton({text: oBundleText.getText("LABEL_2232")}).addStyleClass("Font14px FontColor6"), 	// 2232:최초
									           new sap.m.RadioButton({text: oBundleText.getText("LABEL_1416")}).addStyleClass("Font14px FontColor6")],	// 1416:2회차 분할사용
						            selectedIndex : "{MatleavCnt}",
						            editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
											else return false;
										}
									},
									select : oController.onCheckBabduda
//									select : function(){
//										oController.onCheckBabduda();
//									}
							   })
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2235"),	// 2235:출산일
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Babduda}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "MatleavCnt"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == 0 ) ? true : false;
										}
									},
							    	change : oController.onCheckBabduda
								}).addStyleClass("Font14px FontColor6"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "35px",
				cells : [
					// 구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0006"), 
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({ 
									text : "{Ttext}",
								}).addStyleClass("Font14px FontColor6")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "35px",
				cells : [
					// 사용가능일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1824"), 	// 1824:사용가능일수
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Posday}",
								}).addStyleClass("Font14px FontColor6")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 적용일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2099"), 	// 2099:적용일수
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Useday}",
								}).addStyleClass("Font14px FontColor6")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "35px",
				cells : [
					// 사용 후 잔여일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1823"), 	// 1823:사용 후 잔여일수
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Balday}",
								}).addStyleClass("Font14px FontColor6")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// MRD
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "MRD", 
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.CheckBox({
									selected : "{Mrdchk}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Awart"}, {path : "CredayYea"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4) {
											if((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)){
												if(fVal3 == "1010" ) return true;
											}
											return false;
										}
									}
								}).addStyleClass("Font14px FontColor6")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "35px",
				cells : [
					// 비고
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096"), 	// 96:비고
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Zbigo}",
									width : "100%",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "LeaveAppList", "Zbigo"),
								}).addStyleClass("Font14px FontColor6"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "35px",
				cells : [
					// 집중휴가중 직무인수인
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0762")	// 762:집중휴가중 직무인수인
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
								}).addStyleClass("Font14px FontColor6"),
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
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_2359") 	// 47:신청내역
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button({
			    			   text : oBundleText.getText("LABEL_0006"),
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
	 * 휴가자/대근자 정보 rendering
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
			columnHeaderHeight : 35,
			visibleRowCount : 1
		}).setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		var col_info1 = [
			{id: "Datum", label : oBundleText.getText("LABEL_2371"), plabel : oBundleText.getText("LABEL_0057"), span : 4, type : "date", sort : false, filter : false, width : "100px"},	// 57:일자, 2371:휴가자
			 {id: "Week", label : "", plabel : oBundleText.getText("LABEL_0054"), span : 0, type : "string", sort : false, filter : false, width : "50px"},	// 54:요일
			 {id: "Rtext", label : "", plabel : oBundleText.getText("LABEL_0006"), span : 0, type : "string", sort : false, filter : false, width : "200px"},
			 {id: "Ttext", label : "", plabel : oBundleText.getText("LABEL_0671"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 671:근무시간
			 {id: "Sperid", label : oBundleText.getText("LABEL_1669"), plabel : oBundleText.getText("LABEL_0031"), span : 9, type : "string", sort : false, filter : false, width : "80px"},	// 31:사번, 1669:대근자(대근일 포함)
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
			multiLabels : [ new sap.ui.commons.TextView({text : "", textAlign : "Center"}).addStyleClass("Font14px FontColor6"),
				            new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0038"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 38:성명
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
			}).addStyleClass("Font14px FontColor6")]
		}));
		
		col_info1 = [{id: "Sttext", label : "", plabel : oBundleText.getText("LABEL_0671"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 671:근무시간
			 {id: "TwrktmDat", label : "", plabel : oBundleText.getText("LABEL_1668"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 1668:대근일 총근로
			 {id: "TwrktmWek", label : "", plabel : oBundleText.getText("LABEL_2139"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 2139:주당 총근로
			 {id: "RestmTre", label : "", plabel : oBundleText.getText("LABEL_1417"), span : 0, type : "string", sort : false, filter : false, width : "80px"},	// 1417:3개월 특근가능 잔여시간
//			 {id: "RestmTre", label : "", plabel : "3개월 특근가능\n 잔여시간", span : 0, type : "string", sort : false, filter : false, width : "80px"},	// 1417: 3개월 특근가능 잔여시간
			 {id: "Zstat", label : "", plabel : oBundleText.getText("LABEL_0036"), span : 0, type : "StatusIcon", sort : false, filter : false, width : "50px"},	// 36:상태
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
        	multiLabels : [ new sap.ui.commons.TextView({text : "", textAlign : "Center"}).addStyleClass("Font14px FontColor6"),
        					new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0096"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 96:비고
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
			}).addStyleClass("Font14px FontColor6")]
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
					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_2372") 	// 2372:휴가자/대근자 정보
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				oTable,
			],
			visible : {
				path : "ShiftYn",
				formatter : function(fVal){
					return fVal == "Y" ? true : false ; 
				}
			}
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	},
});