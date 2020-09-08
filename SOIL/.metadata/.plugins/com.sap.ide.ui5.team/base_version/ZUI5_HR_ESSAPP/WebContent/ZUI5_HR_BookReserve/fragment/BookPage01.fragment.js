sap.ui.jsfragment("ZUI5_HR_BookReserve.fragment.BookPage01", {
	 _colModel : [
			 {id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
			 {id: "Zbkdt", label : oBundleText.getText("LABEL_1701"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "7%"},	// 1701:도서구분
			 {id: "Zbname", label : oBundleText.getText("LABEL_1703"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "12%", align : "Begin"},	// 1703:도서명
			 {id: "Bkcase", label : oBundleText.getText("LABEL_1854"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "7%"},	// 1854:서가번호
			 {id: "Zbkkt", label : oBundleText.getText("LABEL_1787"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "5%"},	// 1787:분류명
			 {id: "Zbkdet", label : oBundleText.getText("LABEL_1785"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "7%"},	// 1785:분류 세부명
			 {id: "Zbauthor", label : oBundleText.getText("LABEL_2095"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%", align : "Begin"},	// 2095:저자명
			 {id: "Zbpub", label : oBundleText.getText("LABEL_2244"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%", align : "Begin"},	// 2244:출판사
			 {id: "Regdt", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "date", sort : true, filter : true, width: "90px"},	// 49:신청일
			 {id: "Zbrevtpt", label : oBundleText.getText("LABEL_0157"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "80px"},	// 157:신청유형
			 {id:  "Cancelled", label : oBundleText.getText("LABEL_2968"), plabel : "", span : 0, type : "DocIcon", sort : true, filter : true, width: "70px"},	// 2968:신청취소
			 {id: "Msg", label : oBundleText.getText("LABEL_0477"), plabel : "", span : 0, type : "string", sort : true, filter : true, width: "5%", align : "Begin"}	// 477:메세지
			 ],
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
									text : oBundleText.getText("LABEL_1619")	// 1619:나의 예약 도서
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
		
		return new sap.m.Toolbar({
			height : "45px",
			content : [ new sap.m.MessageStrip(oController.PAGEID +"_11",{
				    	   text : "{StatusText1}" + " 예약도서 건수" , // oBundleText.getText("LABEL_2678"),	// 2678:예약도서 건수
//			        	   text : "예약도서 건수",
						   type : "Success",
						   showIcon : false ,
						   customIcon : "sap-icon://message-information", 
						   showCloseButton : false,
						}).setModel(oController._ListCondJSonModel)
						.bindElement("/Data")
			]
		});
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
					new sap.m.Text({
						text : oBundleText.getText("LABEL_1974")	// 1974:예약 리스트
					}).addStyleClass("FontFamilyBold"),
					new sap.m.ToolbarSpacer(),
				    new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
				    })
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		});
		oTable.setModel(oController._ListJSonModel);
		oTable.bindRows("/Data");	
		
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
	}
});