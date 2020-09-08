sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_WorkGroupInquiry.fragment.WorkGroupInquiryPage01", {
	
	_colModel1 : [
		{id: "Number", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Perid01", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 31:사번
		{id: "Ename01", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "14%"},	// 38:성명
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "17%", align : sap.ui.core.TextAlign.Begin},	// 근무직
		{id: "Begda01", label : oBundleText.getText("LABEL_0042"), plabel : "", span : 0, type : "date", sort : false, filter : false, width : "15%"},	// 42:시작일
		{id: "Zsctytx", label : oBundleText.getText("LABEL_0013"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%"},	// 근무형태
		{id: "Ztext", label : oBundleText.getText("LABEL_0624"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "20%", align : sap.ui.core.TextAlign.Begin}	// 624:근무조
	],
	
	_colModel2 : [
		{id: "Number", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 근무직
		{id: "Perid01", label : oBundleText.getText("LABEL_0658"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "7%"},	// 31:사번, 658:A조
		{id: "Ename01", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 38:성명
		{id: "Begda01", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "7%"},	// 42:시작일
		{id: "Perid02", label : oBundleText.getText("LABEL_0659"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "7%"},	// 31:사번, 659:B조
		{id: "Ename02", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 38:성명
		{id: "Begda02", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "7%"},	// 42:시작일
		{id: "Perid03", label : oBundleText.getText("LABEL_0660"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "7%"},	// 31:사번, 660:C조
		{id: "Ename03", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 38:성명
		{id: "Begda03", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "7%"},	// 42:시작일
		{id: "Perid04", label : oBundleText.getText("LABEL_0661"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "7%"},	// 31:사번, 661:D조
		{id: "Ename04", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 38:성명
		{id: "Begda04", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "7%"}	// 42:시작일
	],
	
	_colModel2_1 : [
		{id: "Number", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 근무직
		{id: "Perid01", label : oBundleText.getText("LABEL_0658"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "7%"},	// 31:사번, 658:A조
		{id: "Ename01", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 38:성명
		{id: "Begda01", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "7%"},	// 42:시작일
		{id: "Perid02", label : oBundleText.getText("LABEL_0659"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "7%"},	// 31:사번, 659:B조
		{id: "Ename02", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 38:성명
		{id: "Begda02", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "7%"},	// 42:시작일
		{id: "Perid03", label : oBundleText.getText("LABEL_0660"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "7%"},	// 31:사번, 660:C조
		{id: "Ename03", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 38:성명
		{id: "Begda03", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "7%"},	// 42:시작일
		{id: "Perid04", label : oBundleText.getText("LABEL_0661"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "7%"},	// 31:사번, 661:D조
		{id: "Ename04", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 38:성명
		{id: "Begda04", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "7%"}	// 42:시작일
	],

	_colModel3 : [
		{id: "Number", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "15%"},	// 근무직
		{id: "Perid01", label : oBundleText.getText("LABEL_0658"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "9%"},	// 31:사번, 658:A조
		{id: "Ename01", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "9%"},	// 38:성명
		{id: "Begda01", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "9%"},	// 42:시작일
		{id: "Perid02", label : oBundleText.getText("LABEL_0659"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "9%"},	// 31:사번, 659:B조
		{id: "Ename02", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "9%"},	// 38:성명
		{id: "Begda02", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "9%"},	// 42:시작일
		{id: "Perid03", label : oBundleText.getText("LABEL_0660"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "9%"},	// 31:사번, 660:C조
		{id: "Ename03", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "9%"},	// 38:성명
		{id: "Begda03", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "9%"}	// 42:시작일
	],

	_colModel4 : [
		{id: "Number", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "18%"},	// 근무직
		{id: "Perid01", label : oBundleText.getText("LABEL_0658"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "13%"},	// 31:사번, 658:A조
		{id: "Ename01", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "13%"},	// 38:성명
		{id: "Begda01", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "13%"},	// 42:시작일
		{id: "Perid02", label : oBundleText.getText("LABEL_0659"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "13%"},	// 31:사번, 659:B조
		{id: "Ename02", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "13%"},	// 38:성명
		{id: "Begda02", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : false, filter : false, width : "13%"}	// 42:시작일
	],
	
	_colModel5 : [
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 38:성명
		{id: "Owrkjobt", label : oBundleText.getText("LABEL_1024"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 3, type : "string", sort : false, filter : false, width : "10%"},	// 근무직, 1024:변경전
		{id: "Ozsctytx", label : "", plabel : oBundleText.getText("LABEL_0013"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 근무형태
		{id: "Ortext", label : "", plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 624:근무조
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_1025"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 3, type : "string", sort : false, filter : false, width : "10%"},	// 근무직, 1025:변경후
		{id: "Zsctytx", label : "", plabel : oBundleText.getText("LABEL_0013"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 근무형태
		{id: "Rtext", label : "", plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 624:근무조
		{id: "Reasn", label : oBundleText.getText("LABEL_0032"), plabel : oBundleText.getText("LABEL_0032"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "16%"},	// 32:사유
		{id: "Docno", label : oBundleText.getText("LABEL_0607"), plabel : oBundleText.getText("LABEL_0607"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 607:문서번호
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns1 = common.Common.convertColumnArrayForExcel(this._colModel1);
		oController._Columns2 = common.Common.convertColumnArrayForExcel(this._colModel2);
		oController._Columns2_1 = common.Common.convertColumnArrayForExcel(this._colModel2_1);
		oController._Columns3 = common.Common.convertColumnArrayForExcel(this._colModel3);
		oController._Columns4 = common.Common.convertColumnArrayForExcel(this._colModel4);
		oController._Columns5 = common.Common.convertColumnArrayForExcel(this._colModel5);
		
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
									this.getTitleLayoutRender(oController),									// 타이틀
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
									this.getFilterLayoutRender(oController),								// 검색필터
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getListTableRender(oController),									// 목록
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"})
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
				height : "20px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0667")	// 667:부서별근무편제표조회
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
								new sap.m.ToolbarSpacer()
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
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0028")	// 28:부서
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input({
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: true,
					value : "{Orgtx}",
					valueHelpRequest: oController.displayOrgSearchDialog,
					editable : {
						path : "Auth",
						formatter : function(fVal) {
							return fVal != "E" ? true : false;
						}
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0015")	// 15:기준일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Datum", {
					width : "150px",
					selectedKey : "{Datum}",
					editable : true
				}).addStyleClass("Font14px FontColor6"),
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
		.addStyleClass("FilterLayout")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.IconTabBar
	 */
	getListTableRender : function(oController) {
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"}),
			dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
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
						text : oBundleText.getText("LABEL_0668")	// 668:주간근무자
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport1
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				if(!oController._ListJSonModel.getData().Data || oController._ListJSonModel.getData().Data.constructor !== Array || !oController._ListJSonModel.getData().Data.length) {
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(0).hide();
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(1).hide();
				}
				
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();
	
					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oTable);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel1);
		
		this._colModel1.forEach(function(element, index, array) {
			oTable.getColumns()[index].setTemplate(new sap.ui.commons.TextView({
				text : element.type == "date" ? 
				{
					path : element.id, 
					formatter : function(fVal){
						if(!fVal) return '';
						return dateFormat.format(new Date(common.Common.setTime(fVal)));
					}
				}
				: "{" + element.id + "}",
				textAlign : "Center",
				semanticColor : {
					parts : [{path : "Begda01"}, {path : "Datum"}],
					formatter : function(fVal1, fVal2) {
						if(!fVal1) return sap.ui.commons.TextViewColor.Default;
						return dateFormat2.format(fVal1) == fVal2 ? sap.ui.commons.TextViewColor.Critical : sap.ui.commons.TextViewColor.Default; 
					}
				}
			}).addStyleClass("FontFamilyNoColor"));
		});
		
		var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_Table2", {
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
						text : oBundleText.getText("LABEL_0665")	// 665:교대근무자(4조3교대)
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer({width: "15px"}),
					new sap.tnt.InfoLabel(oController.PAGEID + "_TableTxt2", {
						colorScheme : 8,
						visible : false
					}),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport2
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._List2JSonModel)
		.bindRows("/Data");
		
		oTable2.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorkGroupInquiryList_Table2-header > tbody',
					colIndexes : [0, 1]
				});
				
				if(!oController._List2JSonModel.getData().Data || oController._List2JSonModel.getData().Data.constructor !== Array || !oController._List2JSonModel.getData().Data.length) {
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(2).hide();
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(3).hide();
				}
				
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();
	
					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oTable2);
		
		common.ZHR_TABLES.makeColumn(oController, oTable2, this._colModel2);
		
		this._colModel2.forEach(function(element, index, array) {
			if(index > 1) {
				oTable2.getColumns()[index].setTemplate(new sap.ui.commons.TextView({
					text : element.type == "date" ? 
					{
						path : element.id, 
						formatter : function(fVal){
							if(!fVal) return '';
							return dateFormat.format(new Date(common.Common.setTime(fVal)));
						}
					}
					: "{" + element.id + "}",
					textAlign : "Center",
					semanticColor : {
						parts : [{path : "Begda0" + (parseInt((index - 2) / 3) + 1)}, {path : "Datum"}],
						formatter : function(fVal1, fVal2) {
							if(!fVal1) return sap.ui.commons.TextViewColor.Default;
							return dateFormat2.format(fVal1) == fVal2 ? sap.ui.commons.TextViewColor.Critical : sap.ui.commons.TextViewColor.Default; 
						}
					}
				}).addStyleClass("FontFamilyNoColor"));
			}
		});
		
		var oTable2_1 = new sap.ui.table.Table(oController.PAGEID + "_Table2_1", {
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
						text : oBundleText.getText("LABEL_2901")	// 2901:교대근무자(4조2교대)
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer({width: "15px"}),
					new sap.tnt.InfoLabel(oController.PAGEID + "_TableTxt2_1", {
						colorScheme : 8,
						visible : false
					}),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport2_1
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._List2_1JSonModel)
		.bindRows("/Data");
		
		oTable2_1.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorkGroupInquiryList_Table2_1-header > tbody',
					colIndexes : [0, 1]
				});
				
				if(!oController._List2_1JSonModel.getData().Data || oController._List2_1JSonModel.getData().Data.constructor !== Array || !oController._List2_1JSonModel.getData().Data.length) {
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(4).hide();
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(5).hide();
				}
				
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();
	
					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oTable2_1);
		
		common.ZHR_TABLES.makeColumn(oController, oTable2_1, this._colModel2_1);
		
		this._colModel2_1.forEach(function(element, index, array) {
			if(index > 1) {
				oTable2_1.getColumns()[index].setTemplate(new sap.ui.commons.TextView({
					text : element.type == "date" ? 
					{
						path : element.id, 
						formatter : function(fVal){
							if(!fVal) return '';
							return dateFormat.format(new Date(common.Common.setTime(fVal)));
						}
					}
					: "{" + element.id + "}",
					textAlign : "Center",
					semanticColor : {
						parts : [{path : "Begda0" + (parseInt((index - 2) / 3) + 1)}, {path : "Datum"}],
						formatter : function(fVal1, fVal2) {
							if(!fVal1) return sap.ui.commons.TextViewColor.Default;
							return dateFormat2.format(fVal1) == fVal2 ? sap.ui.commons.TextViewColor.Critical : sap.ui.commons.TextViewColor.Default; 
						}
					}
				}).addStyleClass("FontFamilyNoColor"));
			}
		});
		
		var oTable3 = new sap.ui.table.Table(oController.PAGEID + "_Table3", {
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
						text : oBundleText.getText("LABEL_0664")	// 664:교대근무자(3조2교대)
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer({width: "15px"}),
					new sap.tnt.InfoLabel(oController.PAGEID + "_TableTxt3", {
						colorScheme : 8,
						visible : false
					}),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport3
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._List3JSonModel)
		.bindRows("/Data");
		
		oTable3.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorkGroupInquiryList_Table3-header > tbody',
					colIndexes : [0, 1]
				});
				
				if(!oController._List3JSonModel.getData().Data || oController._List3JSonModel.getData().Data.constructor !== Array || !oController._List3JSonModel.getData().Data.length) {
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(6).hide();
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(7).hide();
				}
				
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();
	
					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oTable3);
		
		common.ZHR_TABLES.makeColumn(oController, oTable3, this._colModel3);
		
		this._colModel3.forEach(function(element, index, array) {
			if(index > 1) {
				oTable3.getColumns()[index].setTemplate(new sap.ui.commons.TextView({
					text : element.type == "date" ? 
					{
						path : element.id, 
						formatter : function(fVal){
							if(!fVal) return '';
							return dateFormat.format(new Date(common.Common.setTime(fVal)));
						}
					}
					: "{" + element.id + "}",
					textAlign : "Center",
					semanticColor : {
						parts : [{path : "Begda0" + (parseInt((index - 2) / 3) + 1)}, {path : "Datum"}],
						formatter : function(fVal1, fVal2) {
							if(!fVal1) return sap.ui.commons.TextViewColor.Default;
							return dateFormat2.format(fVal1) == fVal2 ? sap.ui.commons.TextViewColor.Critical : sap.ui.commons.TextViewColor.Default; 
						}
					}
				}).addStyleClass("FontFamilyNoColor"));
			}
		});
		
		var oTable4 = new sap.ui.table.Table(oController.PAGEID + "_Table4", {
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
						text : oBundleText.getText("LABEL_0663")	// 663:교대근무자(2조2교대)
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer({width: "15px"}),
					new sap.tnt.InfoLabel(oController.PAGEID + "_TableTxt4", {
						colorScheme : 8,
						visible : false
					}),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport4
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._List4JSonModel)
		.bindRows("/Data");
		
		oTable4.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorkGroupInquiryList_Table4-header > tbody',
					colIndexes : [0, 1]
				});
				
				if(!oController._List4JSonModel.getData().Data || oController._List4JSonModel.getData().Data.constructor !== Array || !oController._List4JSonModel.getData().Data.length) {
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(8).hide();
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(9).hide();
				}
				
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();
	
					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oTable4);
		
		common.ZHR_TABLES.makeColumn(oController, oTable4, this._colModel4);
		
		this._colModel4.forEach(function(element, index, array) {
			if(index > 1) {
				oTable4.getColumns()[index].setTemplate(new sap.ui.commons.TextView({
					text : element.type == "date" ? 
					{
						path : element.id, 
						formatter : function(fVal){
							if(!fVal) return '';
							return dateFormat.format(new Date(common.Common.setTime(fVal)));
						}
					}
					: "{" + element.id + "}",
					textAlign : "Center",
					semanticColor : {
						parts : [{path : "Begda0" + (parseInt((index - 2) / 3) + 1)}, {path : "Datum"}],
						formatter : function(fVal1, fVal2) {
							if(!fVal1) return sap.ui.commons.TextViewColor.Default;
							return dateFormat2.format(fVal1) == fVal2 ? sap.ui.commons.TextViewColor.Critical : sap.ui.commons.TextViewColor.Default; 
						}
					}
				}).addStyleClass("FontFamilyNoColor"));
			}
		});
		
		var oTable5 = new sap.ui.table.Table(oController.PAGEID + "_Table5", {
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
					new sap.m.Text(oController.PAGEID + "_Table5Subject", {
						text : "yyyy.mm.dd " + oBundleText.getText("LABEL_0666")	// 666:변경내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport5
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._List5JSonModel)
		.bindRows("/Data");
		
		oTable5.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorkGroupInquiryList_Table5-header > tbody',
					colIndexes : [0, 1, 8, 9]
				});
				
				if(!oController._List5JSonModel.getData().Data || oController._List5JSonModel.getData().Data.constructor !== Array || !oController._List5JSonModel.getData().Data.length) {
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(10).hide();
					$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(11).hide();
				}
				
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();
	
					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oTable5);
		
		common.ZHR_TABLES.makeColumn(oController, oTable5, this._colModel5);
		
		return new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_ListLayout", {
			columns : 1,
			width : "100%",
			rows : [
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"})
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oTable
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"})
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oTable2
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"})
						})
						]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oTable2_1
						})
						]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"})
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oTable3
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"})
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oTable4
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"})
						})
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oTable5
						})
					]
				})
			]
		});
	}
});