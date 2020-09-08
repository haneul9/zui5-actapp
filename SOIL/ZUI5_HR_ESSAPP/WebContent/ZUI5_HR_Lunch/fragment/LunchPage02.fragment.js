sap.ui.jsfragment("ZUI5_HR_Lunch.fragment.LunchPage02", {
	
	_colModel : [
		 {id: "No", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},
		 {id: "Reqdt", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "10%"} ,	// 57:일자
		 {id: "Dayweek", label : oBundleText.getText("LABEL_0054"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 54:요일
		 {id: "Holiday", label : oBundleText.getText("LABEL_0504"), plabel : "", span : 0, type : "Checkbox2", sort : true, filter : false, width : "150px"},	// 504:휴일여부
		 {id: "Atext", label : oBundleText.getText("LABEL_0672"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : "Begin"}	// 672:근태
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
		var oRow, oCell;
		
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1382"), required : true}).addStyleClass("FontFamilyBold"),	// 1382:신청년월
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker({
				valueFormat : "yyyy-MM-dd",
				displayFormat : "yyyy.MM",
				value : "{Reqym}",
				width : "150px",
				change : oController.onChangeZreqym,
				editable : {
		    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
					formatter : function(fVal1, fVal2){
						return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
					}
				},
			}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1384"), required : true}).addStyleClass("FontFamilyBold"),	// 1384:중식비 유형
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.ComboBox({
	            items : {                        
	            	path: "ZHR_LUNCH_FEE_SRV>/LunchFeeTypeSet",
	            	template: new sap.ui.core.ListItem({
	            		key: "{ZHR_LUNCH_FEE_SRV>Lnfty}",
	            		text: "{ZHR_LUNCH_FEE_SRV>Lnftytx}"
	            	})
	            },
	            selectedKey: "{Lnfty}",
				width : "200px",
				editable : {
		    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
					formatter : function(fVal1, fVal2){
						return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
					}
				},
		   }).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1386") }).addStyleClass("FontFamilyBold"),	// 1386:지급일수
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Reqdays}"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1194")}).addStyleClass("FontFamilyBold"),	// 1194:지급금액
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Reqamt}"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			width : "60%",
			noData : "No data found",
		});
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.bindRows("/Data");	

	
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_1385"), 	// 1385:지급선택
				   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.CheckBox({
						selected  : "{Payok}",
						editable : { parts : [{path : "Readonly"},{path : "ZappStatAl"},{path : "Pernr"}],
									 formatter : function(fVal1, fVal2, fVal3){
										 if(!fVal3 || fVal3 == "") return false ;
										 else if(fVal2 != "" && fVal2 != "10") return false; 
										 else if(fVal1 && fVal1 == true) return false ;
										 else return true;
									 }
								},
						select : oController.onCheckPayok
							})]
		}));
		
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "20px",
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.ToolbarSpacer({width: "5px"}),
			        new sap.m.Text({text : oBundleText.getText("LABEL_0047") }).addStyleClass("MiddleTitle"),	// 47:신청내역
				]}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
			oApplyInfoMatrix, 
			new sap.ui.core.HTML({ content : "<div style='height : 20px;'/>" }),
			oTable
			]
		});
	},
});