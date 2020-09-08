sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.RetireCheck", {
	
	createContent : function(oController) {
		
		var oCell = null, oRow = null;
		
		var oSettleAreaLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_SettleAreaLayout", {
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["15%","85%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RETIRE_SETTLE_AREA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Select(oController.PAGEID + "_Adjrg", {
							width: "200px",
							change : oController.onChangeAdjrg
					   }).setModel(sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV")),
					   new sap.m.Text(oController.PAGEID + "_Adjrgtx", {
						    width: "200px",
							visible : false
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oSettleAreaLayout.addRow(oRow);
		
			
		var oCheckColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Check_COLUMNLIST", {
			counter : 10,
			cells : [
				new sap.m.Text({
				    text : "{Seqnr}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.m.Text({
				     text : "{Adjsttx}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.m.Text({
					text : "{Adjrgtx}" ,		 
				}).addStyleClass("L2P13Font"), //성
				new sap.m.Text({
				     text : "{Stext}" ,	 
				}).addStyleClass("L2P13Font"), 
				new sap.m.Input({
					value : "{Ename}",
					enabled : {
						path : "Stfyn",
						formatter : function(fval) {return fval == "X" ? true : false;}
					},
					showValueHelp : {
						path : "Stfyn",
						formatter : function(fval) {return fval == "X" ? true : false;}
					},
					valueHelpRequest : oController.onSelectStaff,
					liveChange : oController.onChangeStaff,
				}).addStyleClass("L2P13Font")
				.addCustomData(new sap.ui.core.CustomData({key : "Persa", value : "{Persa}"}))
				.addCustomData(new sap.ui.core.CustomData({key : "Adjrg", value : "{Adjrg}"}))
				.addCustomData(new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"}))
				.addCustomData(new sap.ui.core.CustomData({key : "Adjst", value : "{Adjst}"})), //성
				new sap.m.Text({
				     text : "{Adjdatim}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Comnt}" ,	 
				}).addStyleClass("L2P13Font")
			]
		});
		
		var oCheckTable = new sap.m.Table(oController.PAGEID + "_Check_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "NUMBER")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ADJST")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ADJRGTX")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "RETIRE_STEXT")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "RETIRE_MANAGER")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "RETIRE_ADJTM")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "RETIRE_COMMENT")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"})
			          ]
		});		
//		oCheckTable.setModel(sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV"));
		
		var oLayout1 = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_RetireCheck_LAYOUT1",  {
			width : "100%",
			content : [ oSettleAreaLayout,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oCheckTable
			           ]
		});
		
		var oLayout2 = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_RetireCheck_LAYOUT2",  {
			visible : false,
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            new sap.m.Text({text : oBundleText.getText( "MSG_RETIRE_SURVEY_REQUIRED")}).addStyleClass("L2PWarningMessage")
			           ]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_RetireCheck_LAYOUT",  {
			width : "100%",
			content : [ oLayout1, oLayout2]
		});

		return oLayout;
	}

});