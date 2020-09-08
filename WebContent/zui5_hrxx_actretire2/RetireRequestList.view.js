sap.ui.jsview("zui5_hrxx_actretire2.RetireRequestList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actfamily.FamilyRequestList
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actretire2.RetireRequestList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actfamily.FamilyRequestList
	*/ 
	createContent : function(oController) {
		
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
		var nextDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_Persa", {
								width: "300px",
								change : oController.onChangePersa
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("RETIRE_ENAME") + ":"}),
					           new sap.m.Input(oController.PAGEID + "_Ename", {
									width: "150px",
								}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("RETDATES") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Retda_From", {
								value: dateFormat.format(prevDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "200px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("RETDATEE") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Retda_To", {
								value: dateFormat.format(nextDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "200px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Button({
								text: oBundleText.getText("SEARCH_BTN"),
								type : sap.m.ButtonType.Emphasized,
								press : oController.onPressSearch
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		var vCells , vColumns ;
		var oCell1 = new sap.m.Text({  //No
		    text : "{Numbr}" 
		}).addStyleClass("L2P13Font"); 
		var oCell2 = new sap.m.Text({  //Pers. No.
		     text : "{Pernr}" 
		}).addStyleClass("L2P13Font"); 
		var oCell3 = new sap.m.Text({  //Name
		     text : "{Ename}" 
		}).addStyleClass("L2P13Font"); 
		var oCell4 = new sap.m.Text({  // Job group
		     text : "{Zzjobgrtx}" ,	 
		}).addStyleClass("L2P13Font");
		var oCell5 = new sap.m.Text({ // Title
		     text : "{Zzcaltltx}" ,	 
		}).addStyleClass("L2P13Font"); 
		var oCell6 = new sap.m.Text({ // Name of org.
		     text : "{Stext}" ,
	    }).addStyleClass("L2P13Font");
		var oCell7 = new sap.m.Text({ // Join date
		     text : {path : "Entda",
		    	 formatter : common.Common.DateFormatter
		     }
		}).addStyleClass("L2P13Font"); 
		var oCell8 = new sap.m.Text({ // Termination date
		     text : {path : "Retda",
			 	 formatter : common.Common.DateFormatter
		     },
		}).addStyleClass("L2P13Font");
		var oCell9 = new sap.ui.core.Icon({ //HR interview
			size : "13px",
			color : "#666666",
			src: {
				parts : [{path : "Hrtyn"}, {path : "Extyn"}],
				formatter : function(fVal1, fVal2) {
					if(fVal2 == "X") return "sap-icon://decline";
					return fVal1 == "X" ? "sap-icon://bo-strategy-management" : ""; 
				}},					
		}); 
		var oCell10 = new sap.ui.core.Icon({  //Check List	
			size : "13px",
			color : "#666666",
			src: {
				parts : [{path : "Setyn"}, {path : "Extyn"}, {path : "Seexp"}],
				formatter : function(fVal1, fVal2, fVal3) {
					if(fVal2 == "X") return "sap-icon://decline";
					if(fVal3 == "X") return "sap-icon://less";
					return fVal1 == "X" ? "sap-icon://bo-strategy-management" : ""; 
				}},					
		});
		var oCell11 = new sap.ui.core.Icon({ // Check complete
			size : "13px",
			color : "#666666",
			src: {
				parts : [{path : "Stend"}, {path : "Extyn"}, {path : "Seexp"}],
				formatter : function(fVal1, fVal2, fVal3) {
					if(fVal2 == "X") return "sap-icon://decline";
					if(fVal3 == "X") return "sap-icon://less";
					return fVal1 == "X" ? "sap-icon://bo-strategy-management" : ""; 
				}}					
		});
		var oCell12 = new sap.ui.core.Icon({ // Documents
			size : "13px",
			color : "#666666",
			src: {
				parts : [{path : "Docyn"}, {path : "Extyn"}],
				formatter : function(fVal1, fVal2) {
					if(fVal2 == "X") return "sap-icon://decline";
					return fVal1 == "X" ? "sap-icon://bo-strategy-management" : ""; 
				}}					
		});
		var oCell13 = new sap.ui.core.Icon({ // Act. approval
			size : "13px",
			color : "#666666",
			src: {
				parts : [{path : "Actrq"}, {path : "Extyn"}],
				formatter : function(fVal1, fVal2) {
					if(fVal2 == "X") return "sap-icon://decline";
					return fVal1 == "X" ? "sap-icon://bo-strategy-management" : ""; 
				}}
		});
		var oCell14 = new sap.ui.core.Icon({ // Act. Confirm
			size : "13px",
			color : "#666666",
			src: {
				parts : [{path : "Actda"}, {path : "Extyn"}],
				formatter : function(fVal1, fVal2) {
					if(fVal2 == "X") return "sap-icon://decline";
					return fVal1 != null ? "sap-icon://bo-strategy-management" : ""; 
				}}
		});
		var oCell15 = new sap.ui.commons.TextView({ //Check status
			text : "{Adcnt}",
//			semanticColor : {path : "Stend",
//			 	 formatter : function(fVal) {return fVal == "N" ? sap.ui.commons.TextViewColor.Critical  : sap.ui.commons.TextViewColor.Positive;}
//		     },
        }).addStyleClass("L2P13Font");
		var oCell16 = new sap.m.Text({ // 인사영역
		     text : "{Pbtxt}" ,
	    }).addStyleClass("L2P13Font");
		var oCell17 = new sap.m.Text({ // 인사하위영역
		     text : "{Btext}" ,
	    }).addStyleClass("L2P13Font");		
		var oCell18 = new sap.m.Text({ // Local Job
		     text : "{Zzlojobtx}" ,
	    }).addStyleClass("L2P13Font");	
		var oCell19 = new sap.m.Text({ // Position
		     text : "{Planstx}" ,
	    }).addStyleClass("L2P13Font");	
		var oColmn1 = new sap.m.Column({
				  		  header: new sap.m.Label({text : oBundleText.getText( "NUMBER")}).addStyleClass("L2P13Font"), 			        	  
				      	  demandPopin: true,
				      	  width: "40px",
				      	  hAlign : sap.ui.core.TextAlign.Center,
			      	  	  minScreenWidth: "tablet"});
		var oColmn2 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "PERNR")}).addStyleClass("L2P13Font"), 			        	  
				      	  demandPopin: true,
				      	  width: "80px",
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  minScreenWidth: "tablet"});
		var oColmn3 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "ENAME")}).addStyleClass("L2P13Font"), 			        	  
				      	  demandPopin: true,
				      	  hAlign : sap.ui.core.TextAlign.Begin,
				      	  minScreenWidth: "tablet"}); 
		var oColmn4 = new sap.m.Column({
				      	  header: new sap.m.Text({text : oBundleText.getText( "ZZJOBGR")}).addStyleClass("L2P13Font"),
				      	  demandPopin: true,
				      	  hAlign : sap.ui.core.TextAlign.Begin,
				      	  minScreenWidth: "tablet"});  	 
		var oColmn5 = new sap.m.Column({
				      	  header: new sap.m.Text({text : oBundleText.getText( "ZZCALTL")}).addStyleClass("L2P13Font"),
				      	  demandPopin: true,
				      	  hAlign : sap.ui.core.TextAlign.Begin,
				      	  minScreenWidth: "tablet"});	 
		var oColmn6 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "FULLN")}).addStyleClass("L2P13Font"),
				      	  demandPopin: true,
				      	  hAlign : sap.ui.core.TextAlign.Begin,
				      	  minScreenWidth: "tablet"});
		var oColmn7 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "ENTDA")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	 //width: "6%",
				      	  demandPopin: true});
		var oColmn8 =  new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "RETDA")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  //width: "6%",
				      	  demandPopin: true});
		var oColmn9 =  new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_HASS_STATUS3")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  //width : "5%",
				      	  demandPopin: true});
		var oColmn10 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_HASS_STATUS4")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  //width : "5%",
				      	  demandPopin: true});
		var oColmn11 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_HASS_STATUS5")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  //width : "5%",
				      	  demandPopin: true});
		var oColmn12 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_HASS_STATUS6")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  //width : "5%",
				      	  demandPopin: true});
		var oColmn13 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_HASS_STATUS7")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  //width : "5%",
				      	  demandPopin: true});
		var oColmn14 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_HASS_STATUS8")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  //width : "5%",
				      	  demandPopin: true});
		var oColmn15 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_HASS_STATUS9")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Center,
				      	  //width : "5%",
				      	  demandPopin: true});
		var oColmn16 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "PBTXT")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Begin,
				      	  //width : "5%",
				      	  demandPopin: true});
		var oColmn17 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "BTRTL")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Begin,
				      	  //width : "5%",
				      	  demandPopin: true});		
		var oColmn18 = new sap.m.Column({
				      	  header: new sap.m.Label({text : "Local Job" }).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Begin,
				      	  //width : "5%",S
				      	  demandPopin: true});	
		var oColmn19 = new sap.m.Column({
				      	  header: new sap.m.Label({text : oBundleText.getText( "PLANS")}).addStyleClass("L2P13Font"),
				      	  hAlign : sap.ui.core.TextAlign.Begin,
				      	  //width : "5%",
				      	  demandPopin: true});		
		
//		if(gMolga =="08"){ // 영국
//			vCell = [ oCell1, oCell2, oCell3, oCell4, oCell5, oCell6, oCell7, oCell8,
//			          oCell16, oCell17, oCell18, oCell19,
//			          oCell9,  oCell12, oCell13, oCell14 ] ;
//			vColumns  = [ oColmn1, oColmn2, oColmn3, oColmn4, oColmn5, oColmn6, oColmn7, oColmn8,
//			              oColmn16, oColmn17, oColmn18, oColmn19,
//			              oColmn9, oColmn12, oColmn13, oColmn14 ] ;
//		}else if(gMolga == "18"){ // 체코
//			vCell = [ oCell1, oCell2, oCell3, oCell4, oCell5, oCell6, oCell7,oCell8,
//			          oCell13, oCell14 ] ;
//			vColumns = [ oColmn1, oColmn2, oColmn3, oColmn4, oColmn5, oColmn6, oColmn7, oColmn8,
//			             oColmn13, oColmn14 ] ;
//		}else{ // 미국 외 
//			vCell = [ oCell1, oCell2, oCell3, oCell4, oCell5, oCell6, oCell7, oCell8,
//			          oCell9, oCell10, oCell11, oCell12, oCell13, oCell14, oCell15 ] ;
//			vColumns  = [ oColmn1, oColmn2, oColmn3, oColmn4, oColmn5, oColmn6, oColmn7, oColmn8,
//			              oColmn9, oColmn10, oColmn11, oColmn12, oColmn13, oColmn14, oColmn15 ] ;
//		}
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			type : sap.m.ListType.Navigation,
			press : oController.onSelectRow ,
			counter : 10,
//			cells : vCell
		});
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			mode : sap.m.ListMode.MultiSelect,
			fixedLayout : false,
//			columns : vColumns
		}).addStyleClass("L2PBackgroundWhite");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oFilterLayout,
			            oTable
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
					 new sap.m.Button({
						 text : oBundleText.getText( "SORT_BTN"),
						 press : oController.onPressSort}),
					 new sap.m.Button(oController.PAGEID + "_Excel_Btn",{
		            	   text: oBundleText.getText("EXCEL_BTN"), 
		            	   visible : true,
		            	   press : oController.downloadExcel})
					 	],
			 	contentRight : [         
 	                new sap.m.Button(oController.PAGEID + "_New_Btn",{
						 text : oBundleText.getText( "NEW_REGIST_BTN"),
						 press : oController.onPressNew
 	                }),
 	                new sap.m.Button(oController.PAGEID + "_Age_Btn",{
						 text : oBundleText.getText( "AGE_RETIRE_BTN"),
						 press : oController.onPressRegularRetire
	                }),
	                new sap.m.Button(oController.PAGEID + "_Act_Btn",{
						 text : oBundleText.getText( "ACT_RETIRE_BTN"),
						 press : oController.onPressAction
	                }),
	                new sap.m.Button(oController.PAGEID + "_Cancel_Btn",{
						 text : oBundleText.getText( "CANCEL_RETIRE_BTN"),
						 press : oController.onPressCancelRetire
	                }),
	                ]
		});		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_RERIRE_ADMIN")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible : false ,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});