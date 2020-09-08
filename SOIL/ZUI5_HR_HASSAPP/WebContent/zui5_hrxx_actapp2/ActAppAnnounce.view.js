sap.ui.jsview("zui5_hrxx_actapp2.ActAppAnnounce", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp2.ActAppAnnounce
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActAppAnnounce";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp2.ActAppAnnounce
	*/ 
	createContent : function(oController) {
      //발령유형/사유 그룹핑
		var oMajorGroup = new sap.m.Select({
			selectedKey : "{Grpn1}",
			change : oController.onChangeGrpn1
		}).addStyleClass("L2P13Font");
		oMajorGroup.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
		
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
		oMinorGroup.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
		
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
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "발령유형/사유"}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "40%",
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "대그룹핑"}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width : "120px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "소그룹핑"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width : "120px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "대그룹핑명"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  //width: "150px",
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "소그룹핑명"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  //width: "80px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "Main Job"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "100px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "직책코드"}).addStyleClass("L2P13Font"),
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
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://group-2", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "발령유형/사유 그룹핑", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oRow, oCell;
		
		var oAttchFileExpLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["40%","60%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "첨부파일게시 제외"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.CheckBox(oController.PAGEID + "_Attyn").addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oAttchFileExpLayout.addRow(oRow);
		
		var oAttchFileExpPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://attachment", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "첨부파일게시", design : "Bold"}).addStyleClass("L2P13Font"),
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oAttchFileExpLayout]
		});
		
		var oListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "발령게시 처리할 대상자를 선택한 다음 발령게시 버튼을 클릭해 주십시오."}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width : "15px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.jpg"}),
				           new sap.m.Label({text : "완료"}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.jpg"}),
				           new sap.m.Label({text : "오류"}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.jpg"}),
				           new sap.m.Label({text : "잠금"}).addStyleClass("L2P13Font"),
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActtionSubjectList", oController)]
		});
        
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:15px'> </div>",	preferDOM : false}),
			            oActTypePanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oAttchFileExpPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});		
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
		 	                	text : "저장",
		 	                	press : oController.onPressSave
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_PREVIEW_BTN", {
		 	                	text : "미리보기",
		 	                	press : oController.onPressPreview
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_ANNOUNCE_BTN", {
		 	                	text : "발령게시",
		 	                	press : oController.onPressAnnounce
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_CANCEL_BTN", {
		 	                	text : "취소",
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
									   			text : "발령품의서 게시"
								}).addStyleClass("TitleFont"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeader L2pHeaderPadding") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});