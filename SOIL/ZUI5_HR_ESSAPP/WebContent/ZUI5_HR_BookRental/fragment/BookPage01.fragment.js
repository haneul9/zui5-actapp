sap.ui.jsfragment("ZUI5_HR_BookRental.fragment.BookPage01", {
	
	_colModel : [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "30px"},
		 {id: "Zbkdt", label : oBundleText.getText("LABEL_1701"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "7%"},	// 1701:도서구분
		 {id: "Zbname", label : oBundleText.getText("LABEL_1703"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "10%", align : "Begin"},	// 1703:도서명
		 {id: "Zbkkt", label : oBundleText.getText("LABEL_1787"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "5%"},	// 1787:분류명
		 {id: "Zbkdet", label : oBundleText.getText("LABEL_1785"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "7%"},	// 1785:분류 세부명
		 {id: "Zbauthor", label : oBundleText.getText("LABEL_2095"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%", align : "Begin"},	// 2095:저자명
		 {id: "Zbpub", label : oBundleText.getText("LABEL_2244"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%", align : "Begin"},	// 2244:출판사
		 {id: "Begda", label : oBundleText.getText("LABEL_1694"), plabel : "", span : 0, type : "date", sort : true, filter : true, width: "100px"},	// 1694:대출일
		 {id: "Endda", label : oBundleText.getText("LABEL_1727"), plabel : "", span : 0, type : "date", sort : true, filter : true, width: "100px"},	// 1727:반납예정일
		 {id: "Retdt", label : oBundleText.getText("LABEL_1728"), plabel : "", span : 0, type : "date", sort : true, filter : true, width: "100px"},	// 1728:반납일
		 {id: "Overdays", label : oBundleText.getText("LABEL_2213"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "70px"},	// 2213:초과일
		 {id: "Visible", label : oBundleText.getText("LABEL_1693"), plabel : "", span : 0, type : "DocIcon", sort : true, filter : true, width: "70px"},	// 1693:대출연장
		 {id: "Mas", label : oBundleText.getText("LABEL_0477"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "5%"}],	// 477:메세지
	
	 createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
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
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
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
									text : oBundleText.getText("LABEL_1618")	// 1618:나의 대출 현황
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
		var displayYn = (_gAuth == 'E') ? false : true;
		
		return new sap.m.Toolbar({
			height : "45px",
			content : [
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text: oBundleText.getText("LABEL_0864")})	// 0864=조회 시작년도
									.addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_YearFr",{
					value: "{YearFr}",
					width : "100px",
					placeholder : "YYYY",
					submit: oController.onPressSearch
				}).addStyleClass("FontFamily"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text: oBundleText.getText("LABEL_0865")})	// 0865=조회 종료년도
									.addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_YearTo",{
					value: "{YearTo}",
					width : "100px",
					submit: oController.onPressSearch
				}).addStyleClass("FontFamily"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text : oBundleText.getText("LABEL_1690")}).addStyleClass("FontFamilyBold"),	// 1690:대출상태
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID+"_Bstatus",{
					selectedKey: "{selectKeyStatus}",
					width : "200px",
					items : {
						path: "ZHR_BOOK_SRV>/BstatusCodeListSet",
						filters : [
							{
								aFilters : [
									{sPath : 'Key', sOperator : 'EQ', oValue1 : 'A'},
									{sPath : 'Key', sOperator : 'EQ', oValue1 : '20'},
									{sPath : 'Key', sOperator : 'EQ', oValue1 : '30'}
								],
								bAnd : false
							}
						],
						template: new sap.ui.core.ListItem({
							key: "{ZHR_BOOK_SRV>Key}",
							text: "{ZHR_BOOK_SRV>Value}"
						})
					}
				}).addStyleClass("FontFamily"),
				new sap.m.ToolbarSpacer(),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0002"),	// 2:검색
					icon : "sap-icon://search",
					type : sap.m.ButtonType.Emphasized,
					press : oController.onPressSearch
				}),
				new sap.m.ToolbarSpacer({width : "20px"})
			]
		})
		.setModel(oController._ListCondJSonModel)
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
//			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			extension : new sap.m.Toolbar({ 
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_1688")	// 1688:대출내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer({width : "20px"}),
					new sap.m.MessageStrip({
			    	   text : "{StatusText1} " + oBundleText.getText("LABEL_2675"),	// 2675:미반납 건수
		        	   type : "Error",
					   showIcon : false ,
					   customIcon : "sap-icon://message-information", 
					   showCloseButton : false,
			       }).addStyleClass("FontFamily"),
			       new sap.m.ToolbarSpacer({width : "10px"}),
			       new sap.m.MessageStrip({
			    	   text : "{StatusText2} " + oBundleText.getText("LABEL_2676"),	// 2676:전체대여건수
		        	   type : "Success",
					   showIcon : false ,
					   customIcon : "sap-icon://message-information", 
					   showCloseButton : false,
			       }).addStyleClass("FontFamily"),
			       new sap.m.ToolbarSpacer({width : "10px"}),
			       new sap.m.MessageStrip({
			    	   text : "{StatusText3} " + oBundleText.getText("LABEL_2677"),	// 2677:반납건수
		        	   type : "Success",
					   showIcon : false ,
					   customIcon : "sap-icon://message-information", 
					   showCloseButton : false,
			       }).addStyleClass("FontFamily"),
				   new sap.m.ToolbarSpacer(),
				   new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
				   })
				]
			})
			.setModel(oController._ListCondJSonModel)
			.bindElement("/Data")
			.addStyleClass("ToolbarNoBottomLine"),
			rowActionCount : 1,
			rowSettingsTemplate : new sap.ui.table.RowSettings({
				highlight : {
					path : "Overdays",
					//Information : 파란색 , Warning : 주황색,  Success : 초록색
					formatter : function(fVal) {
						if(fVal * 1 > 0) return sap.ui.core.ValueState.Error;
						else sap.ui.core.ValueState.None;
					}
				}
			})
		});
		oTable.setModel(oController._ListJSonModel);
//		oTable.bindRows("ZHR_BOOK_SRV>/BookRentalListSet");	
		oTable.bindRows("/Data");	
		
		oTable.attachCellClick(oController.onSelectRow);
		
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
		
		return oTable;
		
	},
});