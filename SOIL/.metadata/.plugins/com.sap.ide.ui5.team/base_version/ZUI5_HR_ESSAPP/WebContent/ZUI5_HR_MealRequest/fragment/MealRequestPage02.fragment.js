sap.ui.jsfragment("ZUI5_HR_MealRequest.fragment.MealRequestPage02", {
	
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
//			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyInfoRender(oController),									// 신청내역
			this.getDetailInfoRender(oController),									// 신청내역
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0177"),  // 177:저장
										
										  press : oController.onPressSaveT ,
										  visible : "{Editable}"
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0033"),  // 33:삭제
										  press : oController.onDelete ,
										  visible : {
											  path : "Mode",
											  formatter : function(fVal){
												  if(fVal == "U" ) return true;
												  else return false;
											  }
										  }
									}),								
									new sap.m.Button({text : oBundleText.getText("LABEL_0022"), // 22:뒤로
										  press : oController.onBack,
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
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0208"), required : true}).addStyleClass("FontFamilyBold"),	// 208:신청일자
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker(oController.PAGEID + "_Reqdt",{
				valueFormat : "yyyy-MM-dd",
				displayFormat : "yyyy.MM.dd",
				value : "{Reqdt}",
	            editable : false,
	            width : "150px"
			}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1888") , required : false}).addStyleClass("FontFamilyBold"),	// 1888:식사구분
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.ComboBox(oController.PAGEID+"_Mealtp",{
	            items : {
	            	path: "ZHR_MEALREQUEST_SRV>/MealTypeCodeListSet",
	            	template: new sap.ui.core.ListItem({
	            		key: "{ZHR_MEALREQUEST_SRV>Key}",
	            		text: "{ZHR_MEALREQUEST_SRV>Value}"
	            	})
	            },
	            selectedKey: "{Mealtp}",
	            editable: false,
				width : "150px",
		   }).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2184") }).addStyleClass("FontFamilyBold"),	// 2184:직원인원
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input(oController.PAGEID + "_Inemp",{
				value : "{Inemp}",
				type: "Number",
	            editable : false,
	            width : "150px"
			}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1718")}).addStyleClass("FontFamilyBold"),	// 1718:메모
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input(oController.PAGEID + "_Zbigo",{
				value : "{Zbigo}",
	            editable : "{Editable}",
	            width : "98%"
			}).addStyleClass("FontFamily"),
			colSpan: 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);	
		
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
				       new sap.m.ToolbarSpacer({width: "15px"})
					   ]
			}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
			oApplyInfoMatrix ]

		});
		
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getDetailInfoRender : function(oController) {
		return new sap.m.Panel(oController.PAGEID + "_DetailPanel",{
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				content : [					       
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						   new sap.m.ToolbarSpacer({width: "5px"}),
						   new sap.m.Text({text : oBundleText.getText("LABEL_2182") }).addStyleClass("MiddleTitle"),	// 2182:직원
			    		   new sap.m.ToolbarSpacer(),
			    		   new sap.m.Button(oController.PAGEID +"_Btn1",{
			    			   text : oBundleText.getText("LABEL_2040"),	// 2040:인원추가
			    			   press : oController.onPressNewRecord,
			    			   type : "Ghost",
			    			   visible : "{Editable}"
			    		   }).addStyleClass("FontFamily"),
			    		   new sap.m.Button(oController.PAGEID +"_Btn3",{
			    			   text : oBundleText.getText("LABEL_2038"),	// 2038:인원삭제
			    			   type : "Ghost",
			    			   press : oController.onPressDelRecord,
			    			   visible : "{Editable}"
			    		   }).addStyleClass("FontFamily"),
		    		   
	    		   		]
					}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
					
					content :  [  
						sap.ui.jsfragment("ZUI5_HR_MealRequest.fragment.DetailTable",oController),
					]
		});
	},	
});