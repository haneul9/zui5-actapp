sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub24_10", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* 
	* 은행 정보
	* 
	* @memberOf fragment.ActRecPInfo_Sub24_10
	*/
	 
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub24_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
					    new sap.m.Text({
					    	text : "{Bnksatx}" //은행유형
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Emftx}" //예금주
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : {
								parts : [{path : "Bkplz"}, {path : "Bkort"}],
								formatter : function(f1, f2) {
									return f1 + " / " + f2;
								} //우편번호/도시 Bkort
					    	}
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Bankstx}" //은행 국가명
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Bankltx}" //은행 코드
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Bankn}" //계좌번호
						}).addStyleClass("L2P13Font"), 
						new sap.m.Text({
							text : {
								path : "Bkont",
								formatter : function(f1) {
									if(f1 == "01") return "Checking Account";
									else if(f1 == "02") return "Savings  Account";
									else return "";
								}
					    	},
//					    	text : "{Bkont}" //은행 관리 키
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
					    	text : "{Zlschtx}" //지급방법명
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
					    	text : "{Waers}" //지급 통화
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
					    	text : "{Betrg}" //표준 값
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
					    	text : "{Anzhl}" //표준 백분율
						}).addStyleClass("L2P13Font")
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_Sub24_TABLE", {
			inset : false,
			fixedLayout : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "SBTTX")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "EMFTX")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "BLPLZ")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "LANDX24")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "BANKL")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "BANKN")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "BKONT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "TEXT2")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "WAERS24")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "BETRG")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "ANZHL")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true})
			          ]
			          
		});
		oTable.setModel(sap.ui.getCore().getModel("ZL2P01GW0001_SRV"));
		
//		var oTablePanel = new sap.m.Panel({
//			expandable : false, 
//			expanded : false,
//			headerToolbar : new sap.m.Toolbar({
//				design : sap.m.ToolbarDesign.Auto,
//				content : [new sap.m.Label({text : oBundleText.getText("TSUB24F"), design : "Bold"}).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PToolbarNoBottomLine"),
//			content : [oTable]
//		});
		
//		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub24_LAYOUT",  {
//			width : "100%",
//			content : oTablePanel
//		});
		
		return oTable;
		
	}

});