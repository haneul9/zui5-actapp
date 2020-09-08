sap.ui.jsfragment("ZUI5_HR_MedicalReport.fragment.MedicalReportPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "listText", sort : true, filter : true, width : "40px"},
		{id: "Fname", label : oBundleText.getText("LABEL_2339"), plabel : oBundleText.getText("LABEL_2339"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 2339:환자성명
		{id: "Famgbtx", label : oBundleText.getText("LABEL_1085"), plabel : oBundleText.getText("LABEL_1085"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 1085:관계
		{id: "Medtytx", label : oBundleText.getText("LABEL_2193"), plabel : oBundleText.getText("LABEL_1110"), resize : false, span : 6, type : "listText", sort : true, filter : true, width : "100px"},	// 1110:질병유형, 2193:진료내역
		{id: "Disenm", label : "", plabel : oBundleText.getText("LABEL_1092"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "200px"},	// 1092:병명
		{id: "Samyn", label : "", plabel : oBundleText.getText("LABEL_1711"), resize : false, span : 0, type : "Checkbox2", sort : true, filter : true, width : "130px"},	// 1711:동일병명여부
		{id: "Medorg", label : "", plabel : oBundleText.getText("LABEL_1107"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "150px"},	// 1107:진료기관
		{id: "Begda", label : "", plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 42:시작일
		{id: "Endda", label : "", plabel : oBundleText.getText("LABEL_0065"), resize : false, span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 65:종료일
		{id: "Pyamt", label : oBundleText.getText("LABEL_0139"), plabel : oBundleText.getText("LABEL_0139"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 139:지원금액
		{id: "Apamt", label : oBundleText.getText("LABEL_0081"), plabel : oBundleText.getText("LABEL_0081"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 81:신청금액
		{id: "Deamt", label : oBundleText.getText("LABEL_0474"), plabel : oBundleText.getText("LABEL_0474"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "100px"},	// LABEL_0474:공제금액
		{id: "Etcamt", label : oBundleText.getText("LABEL_0109"), plabel : oBundleText.getText("LABEL_0109"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 109:기타
		{id: "Exuamt", label : oBundleText.getText("LABEL_2119"), plabel : oBundleText.getText("LABEL_2119"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 2119:제외금액
		{id: "ZreqDate", label : oBundleText.getText("LABEL_0049"), plabel : oBundleText.getText("LABEL_0049"), resize : false, span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 49:신청일
		{id: "Appno", label : oBundleText.getText("LABEL_0127"), plabel : oBundleText.getText("LABEL_0127"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "130px"},	// 127:신청번호
		{id: "ZappDate", label : oBundleText.getText("LABEL_2229"), plabel : oBundleText.getText("LABEL_2229"), resize : false, span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 2229:최종승인일
		{id: "Payym", label : oBundleText.getText("LABEL_0108"), plabel : oBundleText.getText("LABEL_0108"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 108:급여반영월
		{id: "Belnr", label : oBundleText.getText("LABEL_2111"), plabel : oBundleText.getText("LABEL_2111"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 2111:전표번호
		{id: "Usrid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "150px"},	// 28:부서
		{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : oBundleText.getText("LABEL_0067"), resize : false, span : 0, type : "listText", sort : true, filter : true, width : "150px"}	// 67:직위
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
									text : oBundleText.getText("LABEL_2011")	// 2011:의료비 현황 조회
								}).addStyleClass("Font18px FontColor0"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
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
	 * @return sap.m.Toolbar
	 */
	getFilterLayoutRender : function(oController) {
		var displayYn = (_gAuth == 'E') ? false : true;
		
		return new sap.m.Toolbar({
			height : "45px",
			content : [
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_2877")	// 2877:진료 시작일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Begda", {
			    	valueFormat : "yyyy-MM-dd",
			    	displayFormat : "yyyy.MM.dd",
			    	value : "{Begda}",
			    	width : "150px",
			    	change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_2878")	// 2878:진료 종료일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Endda", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "150px",
					value : "{Endda}",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_1110")	// LABEL_1110:질병유형
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox({
				   items : { path : "ZHR_MEDICAL_REP_SRV>/MedicalTypeListSet",
						 template: new sap.ui.core.ListItem({
		            		key: "{ZHR_MEDICAL_REP_SRV>Medty}",
		            		text: "{ZHR_MEDICAL_REP_SRV>Medtytx}"
		            	 })
					},
		            selectedKey: "{Medty}",
					width : "200px",
			    }).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px", visible : (_gAuth == 'E') ? false : true}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0111"), 	// 111:대상자
					visible : (_gAuth == 'E') ? false : true
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px", visible : (_gAuth == 'E') ? false : true}),
				new sap.m.Input(oController.PAGEID + "_Ename", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Ename}",
					visible : (_gAuth == 'E') ? false : true,
					customData : new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}),
					change : oController.EmpSearchByTx,
					valueHelpRequest: oController.displayEmpSearchDialog
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px", visible : (_gAuth == 'E') ? false : true}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_2029"), 	// 2029:인사영역
					visible : (_gAuth == 'E') ? false : true
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px", visible : (_gAuth == 'E') ? false : true}),
				new sap.m.MultiComboBox({
					visible : (_gAuth == 'E') ? false : true,
					items : { path : "ZL2P01GW9000_SRV>/PersAreaListSet/?$filter=Actty%20eq%20%271%27",
						 template: new sap.ui.core.ListItem({
		            		key: "{ZL2P01GW9000_SRV>Persa}",
		            		text: "{ZL2P01GW9000_SRV>Pbtxt}"
		            	 })
					},		 
		            selectedKeys: "{Persa}",
					width : "200px",
			   }).addStyleClass("Font14px FontColor6"),
			   new sap.m.ToolbarSpacer({width : "20px", visible : (_gAuth == 'E') ? false : true}),
			   new sap.m.Text({
				  text : oBundleText.getText("LABEL_1030"), 	// 1030:직군
				  visible : (_gAuth == 'E') ? false : true
			   }).addStyleClass("Font14px FontBold"),
			   new sap.m.ToolbarSpacer({width : "10px", visible : (_gAuth == 'E') ? false : true }),
			   new sap.m.ComboBox({
				    visible : (_gAuth == 'E') ? false : true,
					items : { path : "ZHR_MEDICAL_REP_SRV>/MedicalZzjikgbListSet",
						 template: new sap.ui.core.ListItem({
		            		key: "{ZHR_MEDICAL_REP_SRV>Zzjikgb}",
		            		text: "{ZHR_MEDICAL_REP_SRV>Zzjikgbt}"
		            	 })
					},
		            selectedKey: "{Zzjikgb}",
					width : "200px",
			   }).addStyleClass("Font14px FontColor6"),
			   new sap.m.ToolbarSpacer({width : "20px"}),
			   new sap.m.Text({
					text : oBundleText.getText("LABEL_1445") 	// 1445:가족관계
			   }).addStyleClass("Font14px FontBold"),
			   new sap.m.ToolbarSpacer({width : "10px"}),
			   new sap.m.ComboBox({
					items : { path : "ZHR_MEDICAL_REP_SRV>/MedicalFamgbListSet",
							 template: new sap.ui.core.ListItem({
			            		key: "{ZHR_MEDICAL_REP_SRV>Famgb}",
			            		text: "{ZHR_MEDICAL_REP_SRV>Famgbtx}"
			            	 })
					},
		            selectedKey: "{Famgb}",
					width : "200px",
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
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data")
		.addStyleClass("FilterLayout");
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
//			columnHeaderHeight : 30,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
//			fixedColumnCount : 9,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0047")	// 47:신청내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data")
		.attachCellClick(oController.onSelectRow);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
//				common.Common.generateRowspan({
//					selector : '#ZUI5_HR_MedicalReportList_Table-header-fixed-fixrow > tbody',
//					colIndexes : [0, 1, 2]
//				});
//
//				common.Common.generateRowspan({
//					selector : '#ZUI5_HR_MedicalReportList_Table-header > tbody',
//					colIndexes : [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
//				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_MedicalReportList_Table-header > tbody',
					colIndexes : [0, 1, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
				});
				
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();
	
					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 15 ? 15 : oLength);
				});
			}
		}, oTable);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
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