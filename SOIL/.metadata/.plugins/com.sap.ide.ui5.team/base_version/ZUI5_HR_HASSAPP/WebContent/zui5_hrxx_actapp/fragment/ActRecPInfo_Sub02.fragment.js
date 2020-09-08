sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub02
	*/
	
	createContent : function(oController) {
		//Global 일자 관련하여 소스 수정함. 2015.10.19
		jQuery.sap.require("common.Common");
		//수정완료
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub02_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
						//Global 일자 관련하여 소스 수정함. 2015.10.19
						new sap.m.Text({
					    	text : {path : "Begda", formatter : common.Common.DateFormatter}
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : {path : "Endda", formatter : common.Common.DateFormatter}
						}).addStyleClass("L2P13Font"),
						//수정완료
					    new sap.m.Text({
					    	text : "{Sltxt}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Stext}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Landx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Insti}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Ftxt1}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Ftxt2}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text(oController.PAGEID + "_Sub02_List_Anzkl", {
					    	text : "{Anzkl}"
						}).addStyleClass("L2P13Font"), 
					    new sap.ui.core.Icon({
					    	src: "sap-icon://accept", 
							size: "15px",
							visible: {path: 'Zzfmark', formatter: function(fVal){return fVal == "X" ? true : false;}}
						}), 
					    new sap.ui.core.Icon({
					    	src: "sap-icon://accept", 
							size: "15px",
							visible: {path: 'Zzacksl', formatter: function(fVal){return fVal == "X" ? true : false;}}
						})
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_Sub02_TABLE", {
			inset : false,
			fixedLayout : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "해당하는 데이터가 없습니다.",
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "입학일"}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "졸업일"}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "교육기관"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : "학위"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "국가"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "학교명"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "전공"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "부전공"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column(oController.PAGEID + "_Sub02_Column_Anzkl", {
		        		  header: new sap.m.Label({text : "기간(년제)"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "최종학력"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "인정학력"}).addStyleClass("L2P13Font"),
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
				content : [new sap.m.Label({text : "학력사항", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.Label({text : "(" + "만약 입학년월과 졸업년월만 알고 있는 경우 해당년월의 1일자로 입력하여 주시기 바랍니다." + ")"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub02_LAYOUT",  {
			width : "100%",
			content : [ 
			            oTablePanel
			           ]
		});
		
		return oLayout;
		
	}

});