sap.ui.jsfragment("ZUI5_HR_TaxAdjustment.fragment.TaxAdjustmentPage02", {
	
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
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0044"),	// 44:신청
										press : oController.onPressSave,
										visible : {
											  path : "ZappStatAl",
											  formatter : function(fVal){
												  if(fVal == "" || fVal == "10") return true;
												  else return false;
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
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1318")}).addStyleClass("FontFamilyBold")	// 1318:신청일 현재 원천징수방식
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
						new sap.m.Toolbar({
							content : [new sap.m.Input({
								width : "150px",
								value : "{ItpctOtx}",
								editable :false,
						   }).addStyleClass("FontFamily")]
					    	}).addStyleClass("ToolbarNoBottomLine") ],
			colSpan : 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1324"), required : true}).addStyleClass("FontFamilyBold")	// 1324:조정하고자 하는 원천징수방식
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		
		var oItpct =  new sap.m.ComboBox({
			width : "150px",
			selectedKey : "{Itpct}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if(fVal1 == "" && fVal2) return true;
					else return false;
				}
			},
	   }).addStyleClass("FontFamily")
	   
		var oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV");
		var oPath = "/IptctListSet";
		oModel.read(oPath, null, null, false,
				function(data, res){
					// 조정하고자 하는 시기 & 신청일 현재 원천징수방식
					if(data && data.results.length > 0){
						for(var i =0; i <data.results.length; i++){
							oItpct.addItem(new sap.ui.core.Item({ key : data.results[i].Itpct, text : data.results[i].Itpctx}))
						}
					}
				}, function(Res){
					
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
					       new sap.m.Toolbar({
							content : [	oItpct,
						   new sap.m.ToolbarSpacer({width : "20px"}),
						   new sap.m.Text({text : oBundleText.getText("LABEL_1326")}).addStyleClass("FontFamilyBold")	// 1326:소득세법 시행령 별표2 근로소득간이세액표에 따른 세액의 120%, 100% 또는 80% 중에 선택합니다.
						   
						   ]
					    	}).addStyleClass("ToolbarNoBottomLine") 
					],
				   colSpan : 3
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
	
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_MultipleBirthLine",{height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1323"), required : true}).addStyleClass("FontFamilyBold")	// 1323:조정하고자 하는 시기
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		
		
		// 조정하고자 하는 시기 설정
		var oApstm =   new sap.m.ComboBox(oController.PAGEID + "_Apstm",{
			   width : "150px",
				selectedKey : "{Apstm}",  
				editable : {
					parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" && fVal2) return true;
						else return false;
					}
				}, 
	   }).addStyleClass("FontFamily");
		
	   oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [  new sap.m.Toolbar({
				content : [	new sap.m.Input({
								value : "{Apsty}",
								width : "150px",
								editable : false
							}).addStyleClass("FontFamily"),
						   new sap.m.ToolbarSpacer({width : "20px"}),
						   oApstm
						 ]
		    	}).addStyleClass("ToolbarNoBottomLine")],
		   colSpan : 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);		
		oApplyInfoMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
							    new sap.m.ToolbarSpacer({width: "5px"}),
						        new sap.m.Text({text : oBundleText.getText("LABEL_0047")}).addStyleClass("MiddleTitle"),	// 47:신청내역
						]}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
						oApplyInfoMatrix]
		});
	}
});