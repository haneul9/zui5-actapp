sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_TaxDataInquiry.fragment.TaxDataInquiryPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModelClub);
		
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
									text : oBundleText.getText("LABEL_1863")	// 1863:세무자료 조회
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
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text : oBundleText.getText("LABEL_0614")})	// 614:조회년도
										.addStyleClass("Font14px FontBold"),
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Zyear}",
							width : "150px",
							type : sap.m.InputType.Number,
							maxLength : 4,
							change : oController.onChangeCondition
							}).addStyleClass("Font14px FontColor6"),
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text : oBundleText.getText("LABEL_2007")})	// 2007:유형구분
										.addStyleClass("Font14px FontBold"),
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.ComboBox({
							selectedKey : "{Gubun}",
							items : {
									path: "ZHR_PAYSLIP_SRV>/PerTypeCodeListSet",
									template: new sap.ui.core.ListItem({
									key: "{ZHR_PAYSLIP_SRV>Code}",
									text: "{ZHR_PAYSLIP_SRV>Text}"
								})
							},
							width : "200px"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text : oBundleText.getText("LABEL_0557")})	// 557:근무지역
									.addStyleClass("Font14px FontBold"),
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.ComboBox({
							selectedKey : "{Zzwork}",
							items : {
								path: "ZHR_PAYSLIP_SRV>/WorkAreaCodeListSet",
								template: new sap.ui.core.ListItem({
								key: "{ZHR_PAYSLIP_SRV>Zzwork}",
								text: "{ZHR_PAYSLIP_SRV>Zzworkt}"
								})
							},
							width : "150px"
						}),
					}).addStyleClass("PaddingLeft20"),
			
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text : oBundleText.getText("LABEL_1596")})	// 1596:급여영역
											.addStyleClass("Font14px FontBold"),
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :new sap.m.ComboBox({
					            items : {
					            	path: "ZHR_PAYSLIP_SRV>/AbkrsCodeListSet",
					            	template: new sap.ui.core.ListItem({
					            		key: "{ZHR_PAYSLIP_SRV>Code}",
					            		text: "{ZHR_PAYSLIP_SRV>Text}"
					            	})
					            },
					            selectedKey: "{Abkrs}",
								width : "150px",
								change : oController.onChangeCondition
						   }).addStyleClass("Font14px FontColor6"),
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({text : oBundleText.getText("LABEL_1586")})	// 1586:급/상여	
													.addStyleClass("Font14px FontBold"),
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :new sap.m.ComboBox(oController.PAGEID + "_PayType",{
							            selectedKey: "{Pycno}",
							            width : "100%"
								  }).addStyleClass("Font14px FontColor6"),
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Text({text : oBundleText.getText("LABEL_2277")})	// 2277:퇴직급여
												.addStyleClass("Font14px FontBold"),
					}).addStyleClass("PaddingLeft20"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.ComboBox(oController.PAGEID +"_RetirePay",{
								            selectedKey: "{Datum}",
											width : "150px"
									   }).addStyleClass("Font14px FontColor6"),
					}).addStyleClass("PaddingLeft20"),
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
			widths : ["100px", "150px", "100px", "250px", "100px","150px", ""],
			rows : aRows
		}).setModel(oController._ListCondJSonModel)
		.bindElement("/Data")
		.addStyleClass("FilterLayout");
	},
	/**
	 * 인원 목록 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getListTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_1863")}).addStyleClass("MiddleTitle"),	// 1863:세무자료 조회
					new sap.m.ToolbarSpacer({}),
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
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				$target = $('#ZUI5_HR_TaxDataInquiryList_DetailTable-table > tbody');
				$target.each(function() {
					$('tr', this).each(function(row) {
						var Tltype = oTable.getModel().getProperty("/Data/"+ row+"/Total");
						if(Tltype == "X") $(this).css("background-color","#66CCFF"); // 하늘색
						else $(this).css("background-color","#ffffff"); //흰색
					});
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