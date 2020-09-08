sap.ui.jsfragment("ZUI5_HR_BookRequest.fragment.BookPage01", {
	
	_colModel : [
		 {id: "Zbkid", label : oBundleText.getText("LABEL_2872"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"}, // 2872:도서ID
		 {id: "Zbkdt", label : oBundleText.getText("LABEL_1701"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "7%"},	// 1701:도서구분
		 {id: "Zbname", label : oBundleText.getText("LABEL_1703"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "12%", align : "Begin"},	// 1703:도서명
		 {id: "Zurl", label : oBundleText.getText("LABEL_0117"), plabel : "", span : 0, type : "bookbutton", sort : true, filter : true, width: "6%"},	// 117:상세내역
		 {id: "Bkcase", label : oBundleText.getText("LABEL_1854"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "8%"},	// 1854:서가번호
		 {id: "Zbkkt", label : oBundleText.getText("LABEL_1787"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "5%"},	// 1787:분류명
		 {id: "Zbkdet", label : oBundleText.getText("LABEL_1785"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "7%"},	// 1785:분류 세부명
		 {id: "Zbauthor", label : oBundleText.getText("LABEL_2095"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%", align : "Begin"},	// 2095:저자명
		 {id: "Zbpub", label : oBundleText.getText("LABEL_2244"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%", align : "Begin"},	// 2244:출판사
		 {id: "Zbyear", label : oBundleText.getText("LABEL_2243"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},	// 2243:출판년도
		 {id: "Zbrental", label : oBundleText.getText("LABEL_1692"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "4%"},	// 1692:대출여부
		 {id: "ZBook", label : oBundleText.getText("LABEL_1704"), plabel : "", span : 0, type : "DocIcon1", sort : true, filter : true, width: "4%"},	// 1704:도서신청
		 {id: "Begda", label : oBundleText.getText("LABEL_1691"), plabel : "", span : 0, type : "date", sort : true, filter : true, width: "5%"},	// 1691:대출시작일
		 {id: "Endda", label : oBundleText.getText("LABEL_1695"), plabel : "", span : 0, type : "date", sort : true, filter : true, width: "5%"},	// 1695:대출종료일
		 {id: "Zbcount", label : oBundleText.getText("LABEL_1975"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "5%"}	// 1975:예약대기현황
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			columns : 3,
			widths : ["20px", "",  "20px"],
			width : "100%",
			rows : [
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.commons.layout.VerticalLayout({
								width : "100%",
								content : [ 
									new sap.ui.core.HTML({ content : "<div style='height : 20px;'/>" }),
									this.getTitleLayoutRender(oController),
									this.getFilterLayoutRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getListTableRender(oController)
								]
							})
							.addStyleClass("sapUiSizeCompact")
						})
					]
				})
			]
		});
	},
	
	/**
	 * 타이틀 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleLayoutRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1699")	// 1699:도서 조회 및 예약
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
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar", {}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
								new sap.m.ToolbarSpacer(),
							]
						}).addStyleClass("ToolbarNoBottomLine NoMarginLeft")
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%",
			rows : aRows
		});
	},
	
	/**
	 * 검색필터 rendering
	 * 
	 * @param oController
	 * @return sap.ui.layout.HorizontalLayout
	 */
	getFilterLayoutRender : function(oController) {
		
		var oData = oController._ListCondJSonModel.getData();
		var errData = {};
		var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
		var oBkdi = new sap.m.ComboBox(oController.PAGEID+"_Bkdi",{
				width : "100%",
				change: oController.onChangeBkdi
		   }).addStyleClass("FontFamily");
		
		
		oModel.read("/BkdiCodeListSet", {
			async : false,
			success : function(data, res) {
				data.results.forEach(function(element){
					oBkdi.addItem(new sap.ui.core.Item({key : element.Zbkdi, text : element.Zbkdit }));
				});
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		oBkdi.setSelectedKey(oBkdi.getFirstItem().getKey());
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage);
		}
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :new sap.m.Text({text : oBundleText.getText("LABEL_1701")})
												.addStyleClass("Font14px FontBold"),	// 1701:도서구분
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : oBkdi
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text : oBundleText.getText("LABEL_1784")})
												.addStyleClass("Font14px FontBold"),// 1784:분류
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.MultiInput(oController.PAGEID+"_Bkkd",{
													width : "100%",
													showValueHelp: true,
													enableMultiLineMode :true,
													valueHelpOnly : true,
													tokenChange : oController.onChangeBkkd,
													valueHelpRequest: oController.displayBkkdSearchDialog
											    }).addStyleClass("Font14px FontColor6")
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text: oBundleText.getText("LABEL_1703")})
												.addStyleClass("Font14px FontBold"),	// 1703:도서명
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input(oController.PAGEID + "_Bname",{
							value: "{Bname}",
							width : "100%",
							submit: oController.onPressSearch
						}).addStyleClass("Font14px FontColor6"),
					})	
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text: oBundleText.getText("LABEL_2094")})
												.addStyleClass("Font14px FontBold"),	// 2094:저자
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input(oController.PAGEID + "_Author",{
													value: "{Author}",
													width : "100%",
													submit: oController.onPressSearch
												}).addStyleClass("Font14px FontColor6"),
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text : oBundleText.getText("LABEL_1864")})
												.addStyleClass("Font14px FontBold"),	// 1864:세부분류
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.MultiInput(oController.PAGEID+"_Bkde",{
													width : "100%",
													showValueHelp: true,
													enableMultiLineMode :true,
													valueHelpOnly : true,
													valueHelpRequest: oController.displayBkdeSearchDialog
											    }).addStyleClass("Font14px FontColor6"),
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text: oBundleText.getText("LABEL_2244")})
												.addStyleClass("Font14px FontBold"),	// 2244:출판사
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input(oController.PAGEID + "_Pub",{
													value: "{Pub}",
													width : "100%",
													submit: oController.onPressSearch
												}).addStyleClass("Font14px FontColor6"), 
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Button({
												text: oBundleText.getText("LABEL_0002"),	// 2:검색
												icon : "sap-icon://search",
												type : sap.m.ButtonType.Emphasized,
												press : oController.onPressSearch
											}),
						hAlign : "End" ,
					}).addStyleClass("PaddingRight20"),
				]
			}),
			
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 7,
			width : "100%",
			widths : ["100px", "150px", "100px", "300px", "100px","150px", ""],
			rows : aRows
		}).setModel(oController._ListCondJSonModel)
		.bindElement("/Data")
		.addStyleClass("FilterLayout");
		
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.IconTabBar
	 */
	getListTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			rowActionCount : 1,
			extension : new sap.m.Toolbar({ 
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_1702")	// 1702:도서내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
			rowSettingsTemplate : new sap.ui.table.RowSettings({
				highlight : {
					path : "Zbrental",
					//Information : 파란색 , Warning : 주황색,  Success : 초록색
					formatter : function(fVal) {
						switch(fVal) {
							case "N":
								return sap.ui.core.ValueState.Information;
							case "Y":
								return sap.ui.core.ValueState.Error;
						}
					}
				}
			})
		}).setModel(oController._ListJSonModel)
		.bindRows("/Data")	
		.attachCellClick(oController.onSelectRow);
	
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();

					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 15 ? 15 : oLength);
				});
			}
		}, oTable);
		
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
		});
	},
});