sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub01", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub01
	*/
	
	createContent : function(oController) {
		var oCell = null, oRow = null;
        
		var oRequestPanel = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"2rem"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [ new sap.m.Label({text : "인적사항", design : "Bold"}).addStyleClass("L2P13Font"),
				            new sap.m.ToolbarSpacer() ,
				            new sap.m.Label({text : "※ 재입사의 경우 인적사항을 제외한 모든 정보 ( 학력, 경력 등)는 기본적으로 발령확정 시 이전 사번의 정보가 자동 저장됩니다.", design : "Bold"}).addStyleClass("L2P13Font L2PFontColorLightRed")
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine L2PPaddingLeft1rem")
		});

		oRow.addCell(oCell);
		oRequestPanel.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Sub01_RequestPanel", {
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : []
		}).addStyleClass("L2PPadding05remLR");
		oRow.addCell(oCell);
		oRequestPanel.addRow(oRow);

		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub01_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
					    new sap.m.Text({
					    	text : {path : "Entda", formatter : common.Common.DateFormatter}
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : {path : "Retda", formatter : common.Common.DateFormatter}
//					    	text : "{Retda}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Pbtxt}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Orgehtx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Zzcaltltx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Stetx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Zzjobgrtx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Pgtxt}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({ 
					    	text : "{Pktxt}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Zzautyptx}"
						}).addStyleClass("L2P13Font"), 
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_Sub01_TABLE", {
			inset : false,
			fixedLayout : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			//showSeparators: sap.m.ListSeparators.All,
			noDataText : "해당하는 데이터가 없습니다.",
			mode : sap.m.ListMode.None,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "입사일"}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "퇴사일"}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "인사영역"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : "최종소속"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "최종직위"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "최종직무"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "최종직군"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "사원유형"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "사원하위그룹"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "권한그룹"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true})
			          ]
			          
		});
		oTable.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"));
		
		var oTablePanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : "과거 그룹근무이력", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub01_LAYOUT",  {
			width : "100%",
			content : [ 
			           	oRequestPanel,
			           	new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oTablePanel
			           ]
		});
		
		return oLayout;
		
	}

});