sap.ui.jsview("zui5_hrxx_projectprocess.RegistParticipant", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_projectprocess.RegistParticipant
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_projectprocess.RegistParticipant";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_projectprocess.RegistParticipant
	*/ 
	createContent : function(oController) {
//		//필요한 CSS 파일을 Include 한다.
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2P2SAP1.css");
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2PBasic.css");
		
//		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });  
		
		jQuery.sap.require("control.ODataFileUploader");
		// uploader 생성		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name : oController.PAGEID + "UploadFile",
			modelName : "ZHRXX_COMMON_SRV",
			slug : "",
			maximumFileSize: 1,
			multiple : false,
			uploadOnChange: false,
			mimeType: [],
			fileType: ["xls","xlsx"],
			buttonText : oBundleText.getText("EMP_EXCEL_UPLOAD"),
			icon :"",
			buttonOnly : true,
			upload : oController.uploadFile,
			change : oController.onFileChange
		});
		
        var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT")}),
				           new sap.m.Select(oController.PAGEID + "_Persa", {
								width: "300px",
								change : oController.onPressSearch
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			counter : 10,
			cells : [
				new sap.m.Text({
					 text : {path : "Pjtbd",
						 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
					 text : {path : "Pjted",
						 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"),     
				new sap.m.Text({
				   	text: {path  : 'Sign',  formatter : function(fVal){ return fVal == 'E' ? "V" : ""; } } 
				}).addStyleClass("L2P13Font"), 
				new sap.m.Text({
				     text : "{Fielt01}" 
				}).addStyleClass("L2P13Font"), 

				new sap.m.Text({
				    text : "{Fielt02}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				    text : "{Fielt03}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				    text : "{Fielt04}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				    text : "{Fielt05}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				    text : "{Fielt06}" 
				}).addStyleClass("L2P13Font"),
//				new sap.m.Text({
//				    text : "{totalContext}" 
//				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				   	text: {
				   		parts : [{path : 'Field07'}, {path : 'Fielt08'}, {path : 'Fielt09'}], 
				   		formatter : oController.makeContext } 
				}).addStyleClass("L2P13Font"), 
//				new sap.m.Text({
//				    text : "{Fielt08}" 
//				}).addStyleClass("L2P13Font"),
//				new sap.m.Text({
//				    text : "{Fielt09}" 
//				}).addStyleClass("L2P13Font")
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			mode : sap.m.ListMode.MultiSelect,
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "BEGDA")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width : "80px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),	
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENDDA")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width : "80px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}), 
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "EXCEPT")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width : "40px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ORG_UNITS")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PERSG")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	 		
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ZZJOBGR")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "FAREA")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "SFAREA")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "JOB")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENAME")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "ENAME")}).addStyleClass("L2P13Font"), 			        	  
//			        	  demandPopin: true,
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  minScreenWidth: "tablet"}),  	
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "ORGEH2")}).addStyleClass("L2P13Font"), 			        	  
//			        	  demandPopin: true,
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  minScreenWidth: "tablet"}),  	 	  
			          ]
		});
		
		var oExcelColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_EXCEL_COLUMNLIST", {
			counter : 10,
			cells : [
				new sap.m.Text({
					 text : {path : "Pjtbd",
						 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
					 text : {path : "Pjted",
						 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"),     
				new sap.m.Text({
				   	text: {path  : 'Sign',  formatter : function(fVal){ return fVal == 'E' ? "V" : ""; } } 
				}).addStyleClass("L2P13Font"), 
				new sap.m.Text({
				    text : "{Field07}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				    text : "{Type}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				    text : "{Message}" 
				}).addStyleClass("L2P13Font"),
			]
		});  
		
		var oExcelTable = new sap.m.Table(oController.PAGEID + "_EXCEL_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
//			mode : sap.m.ListMode.MultiSelect,
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "BEGDA")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),	
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENDDA")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}), 
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "EXCEPT")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENAME")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "MSG")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "MSG_2")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"})
		        	  ]
		});
		
		var oStatementPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("TITLE_PROJECT_PROCESS40"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.ui.core.Icon({src : "sap-icon://upload", size : "1.0rem"}),
				           oFileUploader,
				           new sap.m.Button(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN",{
				        	    icon : "sap-icon://download",
		 	                	text : oBundleText.getText("EXCEL_FORMAT_BTN"),
		 	                	press : oController.onPressDownload
		 	               }),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable , oExcelTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ 
			            oFilterLayout,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oStatementPanel
			           ]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : oLayout,
			customHeader : new sap.m.Bar({
				contentMiddle : new sap.m.Text({
					text : oBundleText.getText("TITLE_PROJECT_PROCESS")
				}).addStyleClass("L2PPageTitle")
			}).addStyleClass("L2PHeaderBar"),
			footer : new sap.m.Bar({
				contentRight : [
								new sap.m.Button(oController.PAGEID + "_CREATE_BTN",{text : oBundleText.getText("CREATE_BTN"), press : oController.onPressCreate}),
								new sap.m.Button(oController.PAGEID + "_MODIFY_BTN",{text : oBundleText.getText("MODIFY_BTN"), press : oController.onPressModify}),
								new sap.m.Button(oController.PAGEID + "_COPY_BTN",{text : oBundleText.getText("COPY_BTN"),   press : oController.onPressCopy}),
								new sap.m.Button(oController.PAGEID + "_DELETE_BTN",{text : oBundleText.getText("DELETE_BTN"), press : oController.onPressDelete}),
								new sap.m.Button(oController.PAGEID + "_EXCEL_SAVE_BTN",{text : oBundleText.getText("CREATE_BTN"), press : oController.onPressExcelSave}),
//								oFileUploader
				                ]
			}) 
		}) ;
		
		return oPage ;
	}

});