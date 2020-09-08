sap.ui.jsview("zui5_hrxx_actapp.ActAppRequest", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp.ActAppRequest
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp.ActAppRequest";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp.ActAppRequest
	*/ 
	createContent : function(oController) {
		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
        
        var oCell = null, oRow = null;
		
        //발령품의
		var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQNO")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Reqno", {}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TITLE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Title", {}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQDP")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new  sap.m.Text(oController.PAGEID + "_Orgeh", {}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Reqda", {}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_REQUEST"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		});
		
		//추가내용
		var oAddInfoLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["15%","85%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NOTET")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new  sap.m.TextArea(oController.PAGEID + "_Notet", {
				width : "100%",
				cols : 100,
				rows : 4,
				liveChange : oController.onChangeData,
				placeholder : oBundleText.getText("MSG_ADDINFO1")
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oAddInfoLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NOTEB")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new  sap.m.TextArea(oController.PAGEID + "_Noteb", {
				width : "100%",
				cols : 100,
				rows : 4,
				liveChange : oController.onChangeData,
				placeholder : oBundleText.getText("MSG_ADDINFO2")
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oAddInfoLayout.addRow(oRow);
		
		var oAddInfoPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://add-contact", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ADDINFO"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oAddInfoLayout]
		});
		
		//정렬순서
		var oSortLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SORTINFO") + " 1"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSortControl1 = new sap.ui.commons.layout.HorizontalLayout({
			content : [
			    new sap.m.Select(oController.PAGEID + "_Srtf1", {
			    	width : "250px",
			    	change : oController.onChangeData,
			    	items : {
			    		path : "/ActionAppReqSortSet",
			    		template : new sap.ui.core.Item({key : "{Srtfc}", text : "{Srtft}"})
			    	}
			    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ActionAppReqSort")),
			    new sap.ui.core.HTML({content : "<div style='width:10px'></div>",	preferDOM : false}),
			    new sap.m.Select(oController.PAGEID + "_Srtt1", {
			    	width : "130px",
			    	change : oController.onChangeData,
			    	items : {
			    		path : "/ActionAppReqSortTypeSet",
			    		template : new sap.ui.core.Item({key : "{Srttc}", text : "{Srttt}"})
			    	}
			    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ActionAppReqSortType"))
			]
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oSortControl1
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SORTINFO") + " 2"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSortControl2 = new sap.ui.commons.layout.HorizontalLayout({
			content : [
			    new sap.m.Select(oController.PAGEID + "_Srtf2", {
			    	width : "250px",
			    	change : oController.onChangeData,
			    	items : {
			    		path : "/ActionAppReqSortSet",
			    		template : new sap.ui.core.Item({key : "{Srtfc}", text : "{Srtft}"})
			    	}
			    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ActionAppReqSort")),
			    new sap.ui.core.HTML({content : "<div style='width:10px'></div>",	preferDOM : false}),
			    new sap.m.Select(oController.PAGEID + "_Srtt2", {
			    	width : "130px",
			    	change : oController.onChangeData,
			    	items : {
			    		path : "/ActionAppReqSortTypeSet",
			    		template : new sap.ui.core.Item({key : "{Srttc}", text : "{Srttt}"})
			    	}
			    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ActionAppReqSortType"))
			]
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oSortControl2]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oSortLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SORTINFO") + " 3"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSortControl3 = new sap.ui.commons.layout.HorizontalLayout({
			content : [
			    new sap.m.Select(oController.PAGEID + "_Srtf3", {
			    	width : "250px",
			    	change : oController.onChangeData,
			    	items : {
			    		path : "/ActionAppReqSortSet",
			    		template : new sap.ui.core.Item({key : "{Srtfc}", text : "{Srtft}"})
			    	}
			    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ActionAppReqSort")),
			    new sap.ui.core.HTML({content : "<div style='width:10px'></div>",	preferDOM : false}),
			    new sap.m.Select(oController.PAGEID + "_Srtt3", {
			    	width : "130px",
			    	change : oController.onChangeData,
			    	items : {
			    		path : "/ActionAppReqSortTypeSet",
			    		template : new sap.ui.core.Item({key : "{Srttc}", text : "{Srttt}"})
			    	}
			    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ActionAppReqSortType"))
			]
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oSortControl3]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SORTINFO") + " 4"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSortControl4 = new sap.ui.commons.layout.HorizontalLayout({
			content : [
			    new sap.m.Select(oController.PAGEID + "_Srtf4", {
			    	width : "250px",
			    	change : oController.onChangeData,
			    	items : {
			    		path : "/ActionAppReqSortSet",
			    		template : new sap.ui.core.Item({key : "{Srtfc}", text : "{Srtft}"})
			    	}
			    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ActionAppReqSort")),
			    new sap.ui.core.HTML({content : "<div style='width:10px'></div>",	preferDOM : false}),
			    new sap.m.Select(oController.PAGEID + "_Srtt4", {
			    	width : "130px",
			    	change : oController.onChangeData,
			    	items : {
			    		path : "/ActionAppReqSortTypeSet",
			    		template : new sap.ui.core.Item({key : "{Srttc}", text : "{Srttt}"})
			    	}
			    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ActionAppReqSortType"))
			]
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oSortControl4]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oSortLayout.addRow(oRow);
		
		var oSortPanel = new sap.m.Panel({
			expandable : true,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://sorting-ranking", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("SORTINFO"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oSortLayout]
		});
		
		//발령유형/사유 그룹핑
		var oMajorGroup = new sap.m.Select({
			selectedKey : "{Grpn1}",
			change : oController.onChangeGrpn1
		}).addStyleClass("L2P13Font");
		oMajorGroup.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
		
		var oMinorGroup = new sap.m.Select({
			selectedKey : "{Grpn2}",
			enabled : {
				parts : [{path : "Farea"}, {path : "Posgr"}],
				formatter : function(f1, f2) {
					if(f1 == true || f2 == true) {
						return false;
					} else {
						return true;
					}
				}
			},
			change : oController.onChangeGrpn2
		}).addStyleClass("L2P13Font");
		oMinorGroup.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
		
		for(var i=1; i<10; i++) {
			oMajorGroup.addItem(new sap.ui.core.Item({key : i, text : i}));
			oMinorGroup.addItem(new sap.ui.core.Item({key : i, text : i}));
		}
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_ColumnList", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({
			    	text : "{Acttx}",
			    	textAlign : "Begin"
				}).addStyleClass("L2P13Font"), 
				oMajorGroup,
				oMinorGroup,
				new sap.m.Input({
					width : "99%",
				    value : "{Grpt1}" ,	
				    enabled : "{Grpt1E}",
				    liveChange : oController.onChangeData
				}).addStyleClass("L2P13Font"),
				new sap.m.Input({
					width : "99%",
				    value : "{Grpt2}",
				    enabled : {
						parts : [{path : "Farea"}, {path : "Posgr"}],
						formatter : function(f1, f2) {
							if(f1 == true || f2 == true) {
								return false;
							} else {
								return true;
							}
						}
					},
					liveChange : oController.onChangeData
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Farea}",
					enabled : {
						parts : [{path : "Grpn2"}, {path : "Posgr"}],
						formatter : function(f1, f2) {
							if((f1 != "" && f1 != "0000") || f2 == true) {
								return false;
							} else {
								return true;
							}
						}
					},
					select : oController.onChangeData
				}).addStyleClass("L2P13Font"), 
				new sap.m.CheckBox({
					selected : "{Posgr}",
					enabled : {
						parts : [{path : "Grpn2"}, {path : "Farea"}],
						formatter : function(f1, f2) {
							if((f1 != "" && f1 != "0000") || f2 == true) {
								return false;
							} else {
								return true;
							}
						}
					},
					select : oController.onChangeData
				}).addStyleClass("L2P13Font"), 
			]
		});  
		var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData : false,
			//mode : sap.m.ListMode.SingleSelectLeft,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "ACT_TYPE_REASON")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "40%",
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "GRPN1")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width : "120px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "GRPN2")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width : "120px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "GRPT1")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  //width: "150px",
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "GRPT2")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  //width: "80px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "FAREA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "100px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "POSGR")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "100px",
			        	  demandPopin: true})
			          ],
			 items : {
				 path : "/ActionAppGroupingSet",
				 template : oColumnList
			 }        
		});
		oTable.setModel(sap.ui.getCore().getModel("ActionAppGrouping"));
		
		var oActTypePanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://group-2", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_TYPE_REASON_GRP"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oAddInfoPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oSortPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oActTypePanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            sap.ui.jsfragment("zui5_hrxx_actapp.fragment.AttachFilePanel", oController),
			           ]
		});		
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
		 	                	text : oBundleText.getText( "SAVE_BTN"),
		 	                	press : oController.onPressSave
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_PREVIEW_BTN", {
		 	                	text : oBundleText.getText( "PREVIEW_BTN"),
		 	                	press : oController.onPressPreview
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_REQUEST_BTN", {
		 	                	text : oBundleText.getText( "REQUEST_BTN"),
		 	                	press : oController.onPressRequest
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_CANCEL_BTN", {
		 	                	text : oBundleText.getText( "CANCEL_BTN"),
		 	                	press : oController.navToBack
		 	                }),
		 	                ]
		});
        
        var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_ACTREQ_APPROVAL")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});