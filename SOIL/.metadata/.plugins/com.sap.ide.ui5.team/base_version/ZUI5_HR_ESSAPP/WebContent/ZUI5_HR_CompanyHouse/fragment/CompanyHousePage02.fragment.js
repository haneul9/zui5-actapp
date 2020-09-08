sap.ui.jsfragment("ZUI5_HR_CompanyHouse.fragment.CompanyHousePage02", {
	
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
			this.getDeatilInfoRender(oController),
			this.getAgreeInfoRender(oController),									// 상세내역 테이블
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
				
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "60px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content :   new sap.m.Toolbar({
//							content : new sap.m.MessageStrip({
//					    	   text : oBundleText.getText("LABEL_2609"),	// 2609:차량이 없는 경우 차량번호에 차량없음으로 입력바랍니다.\n 2대이상 차량번호 등록이 필요한 경우 차량번호 및 차종모델명에 연속적으로 기입바랍니다.  ex) 12라 1234, 13나 1234, 차종모델명 : 그랜저, 싼타페, 아우디, 벤츠
//				        	   type : "Success",
//							   showIcon : false ,
//							   customIcon : "sap-icon://message-information", 
//							   showCloseButton : false,
//							}).addStyleClass("FontFamily"),
//						}),
//			colSpan: 2
//		}); 
//		oRow.addCell(oCell);	
//		oApplyInfoMatrix.addRow(oRow);		
		
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
			            editable : { path : "ZappStatAl" ,
							  formatter : function(fVal){
								 if(fVal == "" || fVal == "1") return true ;
								  else return false;
							  }
				         },
						selectedKey : "{Dong}"
					}).addStyleClass("MarginRight10"),
					new sap.m.Input(oController.PAGEID + "_Ho",{
						value: "{Ho}",
						type: "Number",
						width: "150px",
			            editable : { path : "ZappStatAl" ,
							  formatter : function(fVal){
								 if(fVal == "" || fVal == "1") return true ;
								  else return false;
							  }
				         },
					})
				]
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2196") , required : false}).addStyleClass("FontFamilyBold"),	// 2196:차량번호
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input(oController.PAGEID + "_Cnumber",{
				value : "{Cnumber}",
	            editable : { path : "ZappStatAl" ,
					  formatter : function(fVal){
						 if(fVal == "" || fVal == "1") return true ;
						  else return false;
					  }
		         },
		         width : "230px"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2078") , required : true}).addStyleClass("FontFamilyBold"),	// 2078:입주희망일
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.DatePicker(oController.PAGEID + "_Indt",{
				valueFormat : "yyyy-MM-dd",
				displayFormat : "yyyy.MM.dd",
				value : "{Indt}",
	            editable : { path : "ZappStatAl" ,
					  formatter : function(fVal){
						 if(fVal == "" || fVal == "1") return true ;
						  else return false;
					  }
		         },
		         width : "150px"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2202")}).addStyleClass("FontFamilyBold"),	// 2202:차종모델명
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input(oController.PAGEID + "_Cmodel",{
				value : "{Cmodel}",
	            editable : { path : "ZappStatAl" ,
					  formatter : function(fVal){
						 if(fVal == "" || fVal == "1") return true ;
						  else return false;
					  }
		         },
		         width : "230px"
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
	
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0047") 	// 47:신청내역
					}).addStyleClass("MiddleTitle")
					      ]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 

			new sap.m.Toolbar({
				height : "60px",
				content : new sap.m.MessageStrip({
		    	   text : oBundleText.getText("LABEL_2609"),	// 2609:차량이 없는 경우 차량번호에 차량없음으로 입력바랍니다.\n 2대이상 차량번호 등록이 필요한 경우 차량번호 및 차종모델명에 연속적으로 기입바랍니다.  ex) 12라 1234, 13나 1234, 차종모델명 : 그랜저, 싼타페, 아우디, 벤츠
	        	   type : "Success",
				   showIcon : true ,
				   customIcon : "sap-icon://message-information", 
				   showCloseButton : false,
				}).addStyleClass("FontFamily"),
			}),
			oApplyInfoMatrix
		    ]

		});
	},
	
	/**
	 * 상세테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getDeatilInfoRender : function(oController) {
		
		return new sap.m.Panel(oController.PAGEID + "_DetailPanel",{
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				content : [					       
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						   new sap.m.ToolbarSpacer({width: "5px"}),
						   new sap.m.Text({text : oBundleText.getText("LABEL_1709") }).addStyleClass("MiddleTitle"),	// 1709:동거인
			    		   new sap.m.ToolbarSpacer(),
			    		   new sap.m.Button(oController.PAGEID +"_Btn1",{
			    			   text : oBundleText.getText("LABEL_0023"),	// 23:등록
			    			   press : oController.onPressNewRecord,
			    			   visible : { path : "ZappStatAl" ,
									  formatter : function(fVal){
										 if(fVal == "" || fVal == "1") return true ;
										  else return false;
									  }
						       },
						       type : "Ghost"
			    		   }),
			    		   new sap.m.Button(oController.PAGEID +"_Btn3",{
			    			   text : oBundleText.getText("LABEL_0033"),	// 33:삭제
			    			   press : oController.onPressDelRecord,
			    			   visible : { path : "ZappStatAl" ,
									  formatter : function(fVal){
										 if(fVal == "" || fVal == "1") return true ;
										  else return false;
									  }
						        },
						        type : "Ghost"
			    		   }),
		    		   
	    		   		]
					}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
			sap.ui.jsfragment("ZUI5_HR_CompanyHouse.fragment.DetailTable",oController),]			   
		});
	},
	
	/**
	 * 상세테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getAgreeInfoRender : function(oController) {
		return new sap.m.Panel(oController.PAGEID + "_AgreePanel",{
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					content : [					       
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					    new sap.m.ToolbarSpacer({width: "5px"}),
					    new sap.m.Text({text : oBundleText.getText("LABEL_1855") }).addStyleClass("MiddleTitle"),	// 1855:서약서
		    		    new sap.m.ToolbarSpacer()]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
				new sap.m.Toolbar({
					height : "60px",
					content : new sap.m.MessageStrip({
				    	   text : oBundleText.getText("LABEL_2559"),	// 2559:위의 본인은 금번 숙소에 입주함에 있어 입주기간 중 선량한 관리자로서 사택관리내규 및 회사의 제반 지시사항을 성실히 \n준수 이행하겠으며 이를 위반할 시에는 회사의 어떠한 처분도 이의없이 감수할 것을 서약합니다.
			        	   type : "Information" ,
						   showIcon : false ,
						   customIcon : "sap-icon://message-information", 
						   showCloseButton : false,
			       }).addStyleClass("FontFamily")
				}),
				new sap.m.Toolbar({
					content :  new sap.m.CheckBox({
				    	   text: oBundleText.getText("LABEL_2507"),	// 2507:서약서 내용에 대해 동의합니다.
				    	   selected: "{Agree}",
				            editable : { path : "ZappStatAl" ,
								  formatter : function(fVal){
									 if(fVal == "" || fVal == "1") return true ;
									  else return false;
								  }
					         },
				       })
				})
		      
//				new sap.ui.layout.VerticalLayout({
//					width: "100%",
//					content:[
//						new sap.m.MessageStrip({
//					    	   text : oBundleText.getText("LABEL_2559"),	// 2559:위의 본인은 금번 숙소에 입주함에 있어 입주기간 중 선량한 관리자로서 사택관리내규 및 회사의 제반 지시사항을 성실히 \n준수 이행하겠으며 이를 위반할 시에는 회사의 어떠한 처분도 이의없이 감수할 것을 서약합니다.
//				        	   type : "Information" ,
//							   showIcon : false ,
//							   customIcon : "sap-icon://message-information", 
//							   showCloseButton : false,
//				       }).addStyleClass("FontFamily"),
//				       new sap.m.CheckBox({
//				    	   text: oBundleText.getText("LABEL_2507"),	// 2507:서약서 내용에 대해 동의합니다.
//				    	   selected: "{Agree}",
//				            editable : { path : "ZappStatAl" ,
//								  formatter : function(fVal){
//									 if(fVal == "" || fVal == "1") return true ;
//									  else return false;
//								  }
//					         },
//				       })
//					]
//				})
			]
		});		
	}
//	
//	
//	
//	createContent : function(oController) {
//		jQuery.sap.require("common.ZNK_TABLES");
//		
//		var oRow, oCell;
//		
//		// 신청내역
//		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 4,
//			widths : ['20%','30%','20%','30%']
//		});
//				
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "60px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content :   new sap.m.MessageStrip({
//					    	   text : oBundleText.getText("LABEL_2609"),	// 2609:차량이 없는 경우 차량번호에 차량없음으로 입력바랍니다.\n 2대이상 차량번호 등록이 필요한 경우 차량번호 및 차종모델명에 연속적으로 기입바랍니다.  ex) 12라 1234, 13나 1234, 차종모델명 : 그랜저, 싼타페, 아우디, 벤츠
//				        	   type : "Success",
//							   showIcon : true ,
//							   customIcon : "sap-icon://message-information", 
//							   showCloseButton : false,
//				       }).addStyleClass("FontFamily"),
//			colSpan: 4
//		}); 
//		oRow.addCell(oCell);	
//		oApplyInfoMatrix.addRow(oRow);		
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Label({text : oBundleText.getText("LABEL_1707"), required : true}).addStyleClass("FontFamily"),	// 1707:동/호
//		}).addStyleClass("MatrixLabel"); 
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : [
//					new sap.m.ComboBox(oController.PAGEID + "_Dong",{
//						width : "55%" ,
//						items:{
//							path: "ZHR_COMPANYHOUSE_SRV>/DongCodeListSet",
//							template: new sap.ui.core.ListItem({
//								key: "{ZHR_COMPANYHOUSE_SRV>Key}",
//								text: "{ZHR_COMPANYHOUSE_SRV>Value}"
//							})
//						},
////						change : oController.onChangeDong,
//			            editable : { path : "ZappStatAl" ,
//							  formatter : function(fVal){
//								 if(fVal == "" || fVal == "1") return true ;
//								  else return false;
//							  }
//				         },
//						selectedKey : "{Dong}"
//					}),
//					new sap.m.Input(oController.PAGEID + "_Ho",{
//						value: "{Ho}",
//						type: "Number",
//						width: "40%",
//			            editable : { path : "ZappStatAl" ,
//							  formatter : function(fVal){
//								 if(fVal == "" || fVal == "1") return true ;
//								  else return false;
//							  }
//				         },
//					}).addStyleClass("PaddingLeft10")
//				]
//		}).addStyleClass("MatrixData");
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Label({text : oBundleText.getText("LABEL_2196") , required : false}).addStyleClass("FontFamily"),	// 2196:차량번호
//		}).addStyleClass("MatrixLabel"); 
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Input(oController.PAGEID + "_Cnumber",{
//				value : "{Cnumber}",
//	            editable : { path : "ZappStatAl" ,
//					  formatter : function(fVal){
//						 if(fVal == "" || fVal == "1") return true ;
//						  else return false;
//					  }
//		         },
//		         width : "100%"
//			}).addStyleClass("FontFamily"),
//		}).addStyleClass("MatrixData");
//		oRow.addCell(oCell);
//		oApplyInfoMatrix.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Label({text : oBundleText.getText("LABEL_2078") , required : true}).addStyleClass("FontFamily"),	// 2078:입주희망일
//		}).addStyleClass("MatrixLabel"); 
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.DatePicker(oController.PAGEID + "_Indt",{
//				valueFormat : "yyyy-MM-dd",
//				displayFormat : "yyyy.MM.dd",
//				value : "{Indt}",
//	            editable : { path : "ZappStatAl" ,
//					  formatter : function(fVal){
//						 if(fVal == "" || fVal == "1") return true ;
//						  else return false;
//					  }
//		         },
//		         width : "100%"
//			}).addStyleClass("FontFamily"),
//		}).addStyleClass("MatrixData");
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Label({text : oBundleText.getText("LABEL_2202")}).addStyleClass("FontFamily"),	// 2202:차종모델명
//		}).addStyleClass("MatrixLabel"); 
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Input(oController.PAGEID + "_Cmodel",{
//				value : "{Cmodel}",
//	            editable : { path : "ZappStatAl" ,
//					  formatter : function(fVal){
//						 if(fVal == "" || fVal == "1") return true ;
//						  else return false;
//					  }
//		         },
//		         width : "100%"
//			}).addStyleClass("FontFamily"),
//		}).addStyleClass("MatrixData");
//		oRow.addCell(oCell);
//		oApplyInfoMatrix.addRow(oRow);
//		
//	
//		var oApplyInfoPanel = new sap.m.Panel({
//			expandable : false,
//			expanded : false,
//			content : [  new sap.m.Toolbar({
//				design : sap.m.ToolbarDesign.Auto,
//				height : "30px",
//				content : [new sap.ui.core.Icon({
//								src: "sap-icon://open-command-field", 
//								size : "1.0rem"
//							}),
//						   new sap.m.ToolbarSpacer({width: "5px"}),
//					       new sap.m.Text({text : oBundleText.getText("LABEL_0047") }).addStyleClass("FontFamilyBold"),	// 47:신청내역
//					       new sap.m.ToolbarSpacer({width: "15px"})
//					       
//					      ]
//			}).addStyleClass("ToolbarNoBottomLine"),
//			oApplyInfoMatrix ]
//
//		});
//		
//
//		
//		
//		var oDetailPanel = new sap.m.Panel(oController.PAGEID + "_DetailPanel",{
//			expandable : false,
//			expanded : false,
//			headerToolbar : new sap.m.Toolbar({
//				height : "30px",
//				content : [					       
//					       new sap.ui.core.Icon({
//								src: "sap-icon://open-command-field", 
//								size : "1.0rem"
//							}),
//						   new sap.m.ToolbarSpacer({width: "5px"}),
//						   new sap.m.Text({text : oBundleText.getText("LABEL_1709") }).addStyleClass("FontFamilyBold"),	// 1709:동거인
//			    		   new sap.m.ToolbarSpacer(),
//			    		   new sap.m.Button(oController.PAGEID +"_Btn1",{
//			    			   text : oBundleText.getText("LABEL_0023"),	// 23:등록
//			    			   press : oController.onPressNewRecord,
//			    			   icon : "sap-icon://create",
//					            visible : { path : "ZappStatAl" ,
//									  formatter : function(fVal){
//										 if(fVal == "" || fVal == "1") return true ;
//										  else return false;
//									  }
//						         },
//			    		   }).addStyleClass("FontFamily"),
//			    		   new sap.m.Button(oController.PAGEID +"_Btn3",{
//			    			   text : oBundleText.getText("LABEL_0033"),	// 33:삭제
//			    			   icon : "sap-icon://delete",
//			    			   press : oController.onPressDelRecord,
//			    			   visible : { path : "ZappStatAl" ,
//									  formatter : function(fVal){
//										 if(fVal == "" || fVal == "1") return true ;
//										  else return false;
//									  }
//						         },
//			    		   }).addStyleClass("FontFamily"),
//		    		   
//	    		   		]
//					}).addStyleClass("ToolbarNoBottomLine"),
//					
//			content :  [  
//						sap.ui.jsfragment("ZUI5_HR_CompanyHouse.fragment.DetailTable",oController),
//						]
//		});
//		
//		var oAgreePanel = new sap.m.Panel(oController.PAGEID + "_AgreePanel",{
//			expandable : false,
//			expanded : false,
//			headerToolbar : new sap.m.Toolbar({
//				height : "30px",
//				content : [					       
//					       new sap.ui.core.Icon({
//								src: "sap-icon://open-command-field", 
//								size : "1.0rem"
//							}),
//						   new sap.m.ToolbarSpacer({width: "5px"}),
//						   new sap.m.Text({text : oBundleText.getText("LABEL_1855") }).addStyleClass("FontFamilyBold"),	// 1855:서약서
//			    		   new sap.m.ToolbarSpacer(),
//		    		   
//	    		   		]
//					}).addStyleClass("ToolbarNoBottomLine"),
//					
//					content :  [  
//						new sap.ui.layout.VerticalLayout({
//							width: "100%",
//							content:[
//								new sap.m.MessageStrip({
//							    	   text : oBundleText.getText("LABEL_2559"),	// 2559:위의 본인은 금번 숙소에 입주함에 있어 입주기간 중 선량한 관리자로서 사택관리내규 및 회사의 제반 지시사항을 성실히 \n준수 이행하겠으며 이를 위반할 시에는 회사의 어떠한 처분도 이의없이 감수할 것을 서약합니다.
//						        	   type : "Information" ,
//									   showIcon : false ,
//									   customIcon : "sap-icon://message-information", 
//									   showCloseButton : false,
//									   width: "100%"
//						       }).addStyleClass("FontFamily"),
//						       new sap.m.CheckBox({
//						    	   text: oBundleText.getText("LABEL_2507"),	// 2507:서약서 내용에 대해 동의합니다.
//						    	   selected: "{Agree}",
//						            editable : { path : "ZappStatAl" ,
//										  formatter : function(fVal){
//											 if(fVal == "" || fVal == "1") return true ;
//											  else return false;
//										  }
//							         },
//						       })
//							]
//						})
//					]
//		});		
//					
//		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 3,
//			widths : ["20px","","20px"],
//			width : "100%"
//		});
//		
//		var oContents = [
//					     	sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),
//				       	    sap.ui.jsfragment("fragment.TargetLayout", oController),
//							oApplyInfoPanel, 
//							oDetailPanel, 
//							//sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController), 
//							sap.ui.jsfragment("fragment.ApplyLayout", oController),
//							oAgreePanel
//						];
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell(); 
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"})
//		});
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
//		oRow.addCell(oCell);
//		oContentMatrix.addRow(oRow);
//		
//		for(var i=0;i<oContents.length;i++){
//			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
//			oRow.addCell(oCell);
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				content : oContents[i]
//			});
//			oRow.addCell(oCell);
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
//			oRow.addCell(oCell);
//			oContentMatrix.addRow(oRow);
//		}
//		
//					
//		var oLayout = new sap.ui.commons.layout.VerticalLayout({
//			width : "100%",
//			content : [
//				oContentMatrix 
//			           ]
//		}).setModel(oController._DetailJSonModel)
//		.bindElement("/Data");
//		
//
//		oLayout.addStyleClass("sapUiSizeCompact");
//
//		return oLayout;
//
//	
//	}
});