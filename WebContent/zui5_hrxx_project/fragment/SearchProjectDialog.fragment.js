sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchProjectDialog", {
	
	createContent : function(oController) {
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear() - 1, curDate.getMonth(), curDate.getDate());
		var nextDate = new Date(curDate.getFullYear() + 1, curDate.getMonth(), curDate.getDate());
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PJTNM") + ":"}),
				           new sap.m.Input(oController.PAGEID + "_PS_Pjtnmst", {
								width : "180px"
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PJTID") + ":"}),
				           new sap.m.Input(oController.PAGEID + "_PS_Pjtid", {
								width : "180px"
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("BEGDA") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_PS_Pjtbd_From", {
								value: dateFormat.format(prevDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "180px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("ENDDA") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_PS_Pjtbd_To", {
								value: dateFormat.format(nextDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "180px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PJTTY") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_PS_Pjtty", {
							   width : "180px"
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Button({
								text: oBundleText.getText("SEARCH_BTN"),
								type : sap.m.ButtonType.Emphasized,
								press : oController.onPressProjectSearch
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_PS_COLUMNLIST", {
			type : sap.m.ListType.None,
			//press : oController.onSelectRow ,
			counter : 10,
			cells : [ 
						new sap.m.Text({
							text : "{Pjtnm}",	
							wrapping : false
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							text : "{Pjtid}",	 
							wrapping : false
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							text : {path : "Pjtbd", formatter: common.Common.DateFormatter},
							wrapping : false
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							text : {path : "Pjted", formatter: common.Common.DateFormatter},
							wrapping : false
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							text : "{Pjttytx}",
							wrapping : false
						}).addStyleClass("L2P13Font"), 
						new sap.m.Text({
							text : "{Pjtcytx}",
							wrapping : false
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							text : "{Pjtcutx}",
							wrapping : false
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							text : "{Pjtmatx}",
							wrapping : false
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							text : "{Pjtmc}",
							wrapping : false
						}).addStyleClass("L2P13Font")
			]
		});  
		var oTable = new sap.m.Table(oController.PAGEID + "_PS_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			fixedLayout : false,
			mode : sap.m.ListMode.SingleSelectLeft,
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTNM")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTID")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "100px",
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "BEGDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "80px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENDDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "80px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTTY")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "50px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "SLAND")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "130px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTCU")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "160px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTMA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "80px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTMC")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "120px",
			        	  demandPopin: true})
			        ]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ oFilterLayout,
			            new sap.ui.core.HTML({content : "<div style='height:15px'> </div>",	preferDOM : false}),
			            oTable
			           ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_SearchProject_Dialog",{
			content : [ oLayout ],
			contentWidth : "1300px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("TITLE_PROJECT_SEARCH"),
			beforeOpen : oController.setDDLBPjtty,
			buttons : [ new sap.m.Button(oController.PAGEID + "_PS_SAVE",{
										text : oBundleText.getText("SELECT_BTN"), 
										width : "100px" ,
			            				press : oController.onProjectSelect
						}),
			            new sap.m.Button({
			            				text : oBundleText.getText("CANCEL_BTN"), 
			            				width : "100px" , 
			            				press : oController.onCloseSearchProject 
			            }).addStyleClass("L2PPaddingRight20"),
			            ]
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}

});
