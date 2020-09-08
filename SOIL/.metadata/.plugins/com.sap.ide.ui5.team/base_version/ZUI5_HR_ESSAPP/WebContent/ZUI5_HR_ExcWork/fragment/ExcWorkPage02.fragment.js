jQuery.sap.require("control.ODataFileUploader");

sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.ExcWorkPage02", {
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
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
			this.getTitleRender(oController),
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyInfoRender(oController),									// 신청내역
			this.getDetailTable(oController),										// 
			sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController),			// 첨부
		    sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController), 	// 결재내역
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
	 * 타이틀 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleRender : function(oController){
		var oCell, oRow;	
		var oTitleMatrix = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%"
		});		 
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				height : "20px",
				content : [ new sap.m.Image({
								src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png",
							}),
							new sap.m.Text(oController.PAGEID + "_DetailTitle").addStyleClass("Font18px FontColor0"),
						    new sap.m.ToolbarSpacer(),
						  ]
				}).addStyleClass("ToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oTitleMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({	
				content : [ new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar",{	
							}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
							new sap.m.ToolbarSpacer(),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0022"), 	// 22:뒤로
								press : oController.onBack
							}),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0005"), 	// 결재지정
								press : common.ApprovalLineAction.onApprovalLine,
								visible : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "" || fVal == "10") return true;
										else return false;
									}
								}
							}),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0058"), 	// 58:임시저장
								press : oController.onPressSaveT,
								visible : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "" || fVal == "10") return true;
										else return false;
									}
								}
							}),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0044"), 	// 44:신청
								press : oController.onPressSaveC ,
								visible : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "" || fVal == "10") return true;
										else return false;
									}
								}
							}),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0033"), 	// 33:삭제
								press : oController.onDelete ,
								visible : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "10") return true;
										else return false;
									}
								}
							})
						]
				}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
		});
		oRow.addCell(oCell);
		oTitleMatrix.addRow(oRow);
		
		return oTitleMatrix;
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		var oRow, oCell;
		
		// 예외근무 신청
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		
		var oExcwrk =  new sap.m.ComboBox({
		    selectedKey : "{Excwrk}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					if(fVal1 == "" || fVal1 == "10") return true;
					else return false;
				}
			},
			width : "100%"
		}).addStyleClass("FontFamily");
		
		oModel.read("/ExcwrkCodeListSet", {
			async: false,
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oExcwrk.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Comcd, 
								text: data.results[i].Comcdt
							})
						);
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		var curdate = new Date();
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px",
			cells : [
				// 적용일
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1984"), 	// 1984:예외특근 유형
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : oExcwrk
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1979")}).addStyleClass("FontFamilyBold")	// 1979:예외근무 신청기간
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [
								 new sap.ui.layout.HorizontalLayout({
									allowWrapping :true,
									content : [  new sap.m.DatePicker(oController.PAGEID + "_Wkbeg",{
														valueFormat : "yyyy-MM-dd",
											            displayFormat : "yyyy.MM.dd",
											            value : "{Wkbeg}",
											            width : "150px",
														editable : {
															parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
															formatter : function(fVal1, fVal2){
																if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
																else return false;
															}
														},
														change : oController.onChangeBegda
												   }).addStyleClass("FontFamily"),
												   new sap.m.Text({text : "~"}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10 PaddingTop5"),
												   new sap.m.DatePicker({
														valueFormat : "yyyy-MM-dd",
											            displayFormat : "yyyy.MM.dd",
											            value : "{Wkend}",
														width : "150px",
														editable : false
												   }).addStyleClass("FontFamily"),
										   ]
					
									})
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px",
			cells : [
				// 적용일
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1980"), 	// 1980:예외근무 신청사유
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
							    value : "{Excren}",
								editable : {
									parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1){
										if(fVal1 == "" || fVal1 == "10") return true;
										else return false;
									}
								},
								maxLength : common.Common.getODataPropertyLength("ZHR_WORKSCHDULE_SRV", "ExceptionWorkList", "Excren"),
								width : "100%"
							}).addStyleClass("FontFamily"),
					colSpan : 3		
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
						new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
					    }),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({text : oBundleText.getText("LABEL_1978")}).addStyleClass("MiddleTitle"),	// 1978:예외근무 신청
				]}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				oApplyInfoMatrix
			]
		});
	},
	
	/**
	 * 상세내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getDetailTable : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		
		var oTableExcwrk =  new sap.m.ComboBox({
		    selectedKey : "{Excwrk2}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					if(fVal1 == "" || fVal1 == "10") return true;
					else return false;
				}
			},
			width : "100%"
		}).addStyleClass("FontFamily");
		
		oModel.read("/ExcwrkCodeListSet", {
			async: false,
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oTableExcwrk.addItem(
								new sap.ui.core.Item({ 
									key: data.results[i].Comcd, 
									text: data.results[i].Comcdt
								})
							);
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		// 근무일정규칙 combo
		var oSchkz = new sap.m.ComboBox(oController.PAGEID + "_Schkz", {
			items : {
				path : "/Schkzs",
				template : new sap.ui.core.ListItem({
					key : "{key}",
					text : "{text}"
				})
			},
			selectedKey : "{Schkz}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					if(fVal1 == "" || fVal1 == "10") return true;
					else return false;
				}
			}
		}).addStyleClass("FontFamily");
		
		// 근무직 combo
		var oWrkjob = new sap.m.ComboBox({ 
			selectedKey : "{Wrkjob}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					if(fVal1 == "" || fVal1 == "10") return true;
					else return false;
				}
			}
		}).addStyleClass("FontFamily");
		oModel.read("/WrkjobCodeListSet", {
			async: false,
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oWrkjob.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Comcd, 
								text: data.results[i].Comcdt
							})
						);
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			noData : "No data found",
//			columnHeaderHeight : 35,
//			rowHeight  : 30,
			showNoData : true,
			showOverlay : false,
			enableBusyIndicator : true,
			
			
			selectionMode : sap.ui.table.SelectionMode.MultiToggle,
			visibleRowCount : 1
		});
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "50px"},
			 			 {id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "65px"}];	// 31:사번
			common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);

		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : false,
			width : "8%",
//			width : "120px",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0038"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 38:성명
			template : [new sap.m.Input({ 
							value : "{Ename}",
							showValueHelp: true,
			        	    valueHelpOnly: true,
							valueHelpRequest: oController.onRowPernrChange,
							editable : {
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
							customData : [
								new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"}),
								new sap.ui.core.CustomData({key : "Pernr", value : "{Reqpnr}"})
							]
						}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
//			width : "145px",
			width : "8%",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_1983"), 	// 1983:예외적용일
										   required : true , 
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Datum}",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Reqpnr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							change : oController.onChangeDatum,
							customData : [
								new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"}),
								new sap.ui.core.CustomData({key : "Pernr", value : "{Reqpnr}"}),
								new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"})
							]
					   }).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "11%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_1995"),	// 1995:원근무일정 정보
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0006"),	// 근무일정
							   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
					     ],
	        headerSpan : [2,1],
			template : new sap.m.Text({
							text : "{Rtext}"
						}).addStyleClass("FontFamily")
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "11%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_1995"),	// 1995:원근무일정 정보
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0671"),	// 671:근무시간
							   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
					     ],
	        headerSpan : [2,1],
			template : new sap.m.Text({
							text : "{Ottext}"
						}).addStyleClass("FontFamily")
		}));
		
		
		
		var oTprog =  new sap.m.ComboBox({
		    selectedKey : "{Tprog}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					if(fVal1 == "" || fVal1 == "10") return true;
					else return false;
				}
			},
			width : "100%"
		}).addStyleClass("FontFamily");
		
		oModel.read("/TprogCodeListSet", {
			async: false,
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oTprog.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Tprog, 
								text: data.results[i].Ttext
							})
						);
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "13%",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_1982"),	// 1982:예외적용근무시간
										    required : true,	
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : oTprog
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "13%",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_1985"),	// 1985:예외특근유형
										    required : true,	
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : oTableExcwrk
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "5%",
			multiLabels : new sap.m.Text({text : oBundleText.getText("LABEL_2694"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 2694:OFF \n 대체
			template : new sap.m.CheckBox({
				selected : "{Offsup}",
				editable : {
					parts : [{path : "ZappStatAl"}, {path : "Otprog"} ],
					formatter : function(fVal1, fVal2){
						if((fVal1 == "" || fVal1 == "10") && (fVal2 == "OFF" || fVal2 == "HOL")) return true;
						else return false;
					}
				},
			}).addStyleClass("FontFamily")
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : false,
//			width : "15%",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0032"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 32:사유
			template : [new sap.m.Input({ 
							value : "{Linrs}",
							editable : {
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_WORKSCHDULE_SRV", "ExceptionWorkDetail", "Linrs")
						}).addStyleClass("FontFamilyBold")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "8%",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0007"),	// 근무일정 확인
										    required : true,	
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : new sap.m.Button({
		 			   text : oBundleText.getText("LABEL_0879"),	// 879:근무일
					   type : "Ghost",
					   press : oController.onCheckWorkSchedule,
					   enabled : { parts : [{path : "Reqpnr"}, {path : "Datum"}],
						           formatter : function(fVal1, fVal2){
						        	   if(!fVal1 || fVal1 == "" || !fVal2 || fVal2 == "" ) return false;
						        	   else return true;
						           }  
					   },
					   customData : [ new sap.ui.core.CustomData({key : "Pernr", value : "{Reqpnr}"}),
						   			  new sap.ui.core.CustomData({key : "Datum", value : "{Datum}"}),
						   			  new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"})]
			}) 
		}));
	
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.bindRows("/Data");
		
		oTable.addEventDelegate({
	           onAfterRendering: function() {
	                var oTds = $("td[colspan]");
	                for(i=0; i<oTds.length; i++) {
	                   if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
	                }
	                
	        		common.Common.generateForceRowspan({
	        			selector : '#ZUI5_HR_ExcWorkDetail_DetailTable-header > tbody',
	        			colIndexes : [0, 1, 2, 3, 6, 7, 8, 9, 10]
	        		});
	           }
	      });
		
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [
				new sap.m.Toolbar({
					content : [
				    	new sap.m.ToolbarSpacer(),
				    	new sap.m.Button({
		    			   text : oBundleText.getText("LABEL_0620"),	// 620:개인별근로시간조회 후 추가
		    			   type : "Ghost",
		    			   press : oController.onPressSelectByWorktime,
		    			   visible : {
		    				   path : "ZappStatAl",
		    				   formatter : function(fVal){
		    					   if(fVal == "" || fVal == "10") return true;
		    					   else return false;
		    				   }
		    			   }
				    	}),
		    		   new sap.m.Button({
		    			   text : oBundleText.getText("LABEL_0026"),	// 26:복사
		    			   type : "Ghost",
		    			   press : oController.onPressCopy,
		    			   visible : {
		    				   path : "ZappStatAl",
		    				   formatter : function(fVal){
		    					   if(fVal == "" || fVal == "10") return true;
		    					   else return false;
		    				   }
		    			   }
		    		   }),
		    		   new sap.m.Button({
		    			   text : oBundleText.getText("LABEL_0033"),	// 33:삭제
		    			   type : "Ghost",
		    			   press : oController.onPressDelRecord,
		    			   visible : {
		    				   path : "ZappStatAl",
		    				   formatter : function(fVal){
		    					   if(fVal == "" || fVal == "10") return true;
		    					   else return false;
		    				   }
		    			   }
		    		   }),
		    		  new control.ODataFileUploader(oController.PAGEID+"_EXCEL_UPLOAD_BTN", {
		    				name : "UploadFile",
		    				slug : "",
		    				maximumFileSize: 1,
		    				multiple : false,
		    				uploadOnChange: false,
		    				mimeType: [],
		    				fileType: ["csv","xls","xlsx"],
		    				buttonText : oBundleText.getText("LABEL_0481") + " ▲",	// 481:엑셀
		    				buttonOnly : true,
		    				change : oController.changeFile,
		    				visible : {
		    					parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Excwrk"}, {path : "Wkbeg"}],
		    					formatter : function(fVal1, fVal2, fVal3, fVal4) {
		    						 if((fVal1 == "" || fVal1 == "10") && fVal2 && !common.Common.checkNull(fVal3) && !common.Common.checkNull(fVal4)){
		    							 return true
		    						 }else return false;
		    					}
		    				}
		    			}).addDelegate({
		    				onAfterRendering: function() {
		    					$("#" + oController.PAGEID + "_EXCEL_UPLOAD_BTN").find('BUTTON > span')
		    					.removeClass('sapMBtnDefault sapMBtnHoverable')
		    					.addClass('sapMBtnGhost');
		    				}
		    			}).addStyleClass("PaddingLeft1rem"),
		    			
		    			new sap.m.Button({
							text : oBundleText.getText("LABEL_0481") + " ▼",	// 481:엑셀
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressExcelDown,
							visible : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
								}
							}
						})
				   ]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
				oTable
			]
		});
	}
});