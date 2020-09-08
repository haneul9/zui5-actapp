sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_DeviceCertTime.fragment.DeviceCertTimePage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 39:소속부서
		{id: "Schkztx", label : oBundleText.getText("LABEL_0008"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "170px"},	// 근무일정규칙
		{id: "Tprogtx", label : oBundleText.getText("LABEL_0565"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 565:일일근무일정
		{id: "Datum", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 57:일자
		{id: "Awarttx", label : oBundleText.getText("LABEL_0562"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "110px"},	// 562:근태/휴가
		{id: "Intim01", label : oBundleText.getText("LABEL_0566") + "1", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 566:출근시간
		{id: "Inplc01", label : oBundleText.getText("LABEL_0567") + "1", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 567:출근장소
		{id: "Outim01", label : oBundleText.getText("LABEL_0568") + "1", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 568:퇴근시간
		{id: "Ouplc01", label : oBundleText.getText("LABEL_0570") + "1", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 570:퇴근장소
		{id: "Oudat01", label : oBundleText.getText("LABEL_0569") + "1", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 569:퇴근일
		{id: "Intim02", label : oBundleText.getText("LABEL_0566") + "2", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 566:출근시간
		{id: "Inplc02", label : oBundleText.getText("LABEL_0567") + "2", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 567:출근장소
		{id: "Outim02", label : oBundleText.getText("LABEL_0568") + "2", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 568:퇴근시간
		{id: "Ouplc02", label : oBundleText.getText("LABEL_0570") + "2", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 570:퇴근장소
		{id: "Oudat02", label : oBundleText.getText("LABEL_0569") + "2", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 569:퇴근일
		{id: "Intim03", label : oBundleText.getText("LABEL_0566") + "3", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 566:출근시간
		{id: "Inplc03", label : oBundleText.getText("LABEL_0567") + "3", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 567:출근장소
		{id: "Outim03", label : oBundleText.getText("LABEL_0568") + "3", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 568:퇴근시간
		{id: "Ouplc03", label : oBundleText.getText("LABEL_0570") + "3", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 570:퇴근장소
		{id: "Oudat03", label : oBundleText.getText("LABEL_0569") + "3", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 569:퇴근일
		{id: "Intim04", label : oBundleText.getText("LABEL_0566") + "4", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 566:출근시간
		{id: "Inplc04", label : oBundleText.getText("LABEL_0567") + "4", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 567:출근장소
		{id: "Outim04", label : oBundleText.getText("LABEL_0568") + "4", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 568:퇴근시간
		{id: "Ouplc04", label : oBundleText.getText("LABEL_0570") + "4", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 570:퇴근장소
		{id: "Oudat04", label : oBundleText.getText("LABEL_0569") + "4", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 569:퇴근일
		{id: "Intim05", label : oBundleText.getText("LABEL_0566") + "5", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 566:출근시간
		{id: "Inplc05", label : oBundleText.getText("LABEL_0567") + "5", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 567:출근장소
		{id: "Outim05", label : oBundleText.getText("LABEL_0568") + "5", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 568:퇴근시간
		{id: "Ouplc05", label : oBundleText.getText("LABEL_0570") + "5", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px", align : sap.ui.core.TextAlign.Begin},	// 570:퇴근장소
		{id: "Oudat05", label : oBundleText.getText("LABEL_0569") + "5", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 569:퇴근일
		{id: "Excep", label : oBundleText.getText("LABEL_0564"), plabel : "", span : 0, type : "Checkbox", sort : true, filter : true, width : "120px"},	// 564:예외
		{id: "Modyn", label : oBundleText.getText("LABEL_0040"), plabel : "", span : 0, type : "Checkbox2", sort : true, filter : true, width : "100px"}	// 40:수정
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
									this.getTitleLayoutRender(oController),									// 타이틀
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
									this.getFilterLayoutRender(oController),								// 검색필터
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getListTableRender(oController)									// 목록
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
									text : oBundleText.getText("LABEL_0571")	// 571:단말기 인증시간 조회
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
						})
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
					text : oBundleText.getText("LABEL_0502")	// 502:조회 시작일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Cbegda", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Cbegda}",
					width : "150px",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0503")	// 503:조회 종료일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Cendda", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "150px",
					value : "{Cendda}",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0563"),	// 563:사업장
					visible : displayYn
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Cwerks", {
					width : "150px",
					editable : true,
					selectedKey : "{Cwerks}",
					items : {
						path: "ZHR_TIME_RECORDER_SRV>/WerksListSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_TIME_RECORDER_SRV>Werks}",
							text: "{ZHR_TIME_RECORDER_SRV>Werkstx}"
						})
					},
					visible : displayYn
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0028"),	// 28:부서
					visible : displayYn
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Corgtx", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Corgtx}",
					customData : new sap.ui.core.CustomData({key : "Type", value : "Orgeh"}),
					valueHelpRequest: oController.displayOrgehSearchDialog,
					visible : displayYn
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0019"),	// 19:대상자 성명
					visible : displayYn
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Ename", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Ename}",
					customData : new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}),
					change : oController.EmpSearchByTx,
					valueHelpRequest: oController.displayEmpSearchDialog,
					visible : displayYn
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
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getListTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 8,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0047")	// 47:신청내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button(oController.PAGEID + "_ExcSave", {
						text: oBundleText.getText("LABEL_0177"),	// 177:저장
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSave,
						visible : false
					}),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data");
		
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
	}
});