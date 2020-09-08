sap.ui.jsfragment("ZUI5_HR_CompanyHouse.fragment.CompanyHousePage03", {
	
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
			this.getApplyInfoRender(oController),									// 신청항목
			sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),			// 첨부파일
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController),	// 결재내역
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
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0058"), // 58:임시저장
										press : oController.onPressSaveT,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "1") ? true : false;
											}
										}
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0044"),	// 44:신청
										  press : oController.onPressSaveC ,
										  visible : {
											  path : "ZappStatAl",
											  formatter : function(fVal){
												  if(fVal == "" || fVal == "1") return true;
												  else return false;
											  }
										  }
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0033"),	// 33:삭제
										  press : oController.onDelete ,
										  visible : {
											  path : "ZappStatAl",
											  formatter : function(fVal){
												  if(fVal == "1" ) return true;
												  else return false;
											  }
										  }
									}),
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
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1707"), required : true}).addStyleClass("FontFamilyBold"),	// 1707:동/호
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.ComboBox(oController.PAGEID + "_Dong",{
					width : "150px" ,
					items:{
						path: "ZHR_COMPANYHOUSE_SRV>/DongCodeListSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_COMPANYHOUSE_SRV>Key}",
							text: "{ZHR_COMPANYHOUSE_SRV>Value}"
						})
					},
					editable : false,
					selectedKey : "{Dong}"
				}),
				new sap.m.Input(oController.PAGEID + "_Ho",{
					value: "{Ho}",
					type: "Number",
					width: "150px",
					editable : false,
				}).addStyleClass("PaddingLeft10")
			]
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2275") , required : true}).addStyleClass("FontFamilyBold"),	// 2275:퇴거희망일
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker(oController.PAGEID + "_Indt",{
				valueFormat : "yyyy-MM-dd",
				displayFormat : "yyyy.MM.dd",
				value : "{Outdt}",
				width : "150px",
	            editable : { path : "ZappStatAl" ,
					  formatter : function(fVal){
						 if(fVal == "" || fVal == "1") return true ;
						  else return false;
					  }
		         },
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2272") , required : true}).addStyleClass("FontFamilyBold"),	// 2272:퇴거사유
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input(oController.PAGEID + "_Outrsn",{
				value : "{Outrsn}",
				width : "100%",
	            editable : { path : "ZappStatAl" ,
					  formatter : function(fVal){
						 if(fVal == "" || fVal == "1") return true ;
						  else return false;
					  }
		         },
			}).addStyleClass("FontFamily"),
			colSpan: 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2271")}).addStyleClass("FontFamilyBold"),	// 2271:퇴거기준일
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker(oController.PAGEID + "_Outkeydt",{
				valueFormat : "yyyy-MM-dd",
				displayFormat : "yyyy.MM.dd",
				value : "{Outkeydt}",
				width : "150px",
	            editable : false
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2274")}).addStyleClass("FontFamilyBold"),	// 2274:퇴거처리완료
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected: "{Outcmpl}",
				editable: false
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell)		
				
		oApplyInfoMatrix.addRow(oRow);
		
		return  new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "30px",
				content : [
					   new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					   new sap.m.ToolbarSpacer({width: "5px"}),
				       new sap.m.Text({text : oBundleText.getText("LABEL_0047") }).addStyleClass("MiddleTitle"),	// 47:신청내역
				          ]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
			oApplyInfoMatrix ]

		});
		
	},
});