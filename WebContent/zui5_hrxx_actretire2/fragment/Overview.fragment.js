sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.Overview", {
	
	createContent : function(oController) {
		
		var oCell = null, oRow = null;
		
		var oRetireOptionLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_RetireOptionLayout",{
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Label_Massg",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RETRS"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Input_Massg",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_Massg", {
							width : "100%",
							showValueHelp: true,
							liveChange : oController.onLiveChange,
							valueHelpRequest: oController.displayCodeSearchDialog
					   }).addCustomData(new sap.ui.core.CustomData({
							key : "RETRS",
							value : ""
						}))]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Label_Reexp",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REEXP")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Input_Reexp",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.CheckBox(oController.PAGEID + "_Reexp", {text: "", selected : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Label_Stpnr",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RETIRE_AD_AGENT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Input_Stpnr",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_Stpnr", {
				width: "100%",
				showValueHelp: true,
				valueHelpRequest: oController.displaySearchUserDialog
			   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Label_Seexp",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SEEXP")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Input_Seexp",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.CheckBox(oController.PAGEID + "_Seexp", {text: "", selected : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		var oRetireOptionPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://process", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_PROCESS"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRetireOptionLayout]
		});
		
		var oHistoryColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_History_COLUMNLIST", {
			counter : 10,
			cells : [
				new sap.m.Text({
				    text : "{Seqnr}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.m.Text({
				     text : "{Retsttx}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.m.Text({
					text : "{Datim}" ,		 
				}).addStyleClass("L2P13Font"), //성
				new sap.m.Text({
				     text : "{Pernrtx}" ,	 
				}).addStyleClass("L2P13Font")
			]
		});
		
		var oHistoryTable = new sap.m.Table(oController.PAGEID + "_History_TABLE", {
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
			        	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_PROCESS_TASK")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_DATLO")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "RETIRE_EXECUTOR")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"})
			          ]
		});
		
		oHistoryTable.setModel(sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV"));
		
		
//		oHistoryTable.attachUpdateFinished(function() {
//			oController.setIconDate
//		});
		
		var oRetireHistoryPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://work-history", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_PROCESS_STATUS"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oHistoryTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_OverView_LAYOUT",  {
			width : "100%",
			content : [ oRetireOptionPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRetireHistoryPanel
			           ]
		});

		return oLayout;
	}

});