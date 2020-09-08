sap.ui.jsfragment("ZUI5_HR_MealRequest.fragment.DetailTable", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.m.Table(oController.PAGEID + "_DetailTable", {
			inset : false,
			mode : "MultiSelect",
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			//mode : "MultiSelect",
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("FontFamilyBold"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight cellBorderLeft",
			        	  width : "3%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0031")}).addStyleClass("FontFamilyBold"),	// 31:사번
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "80px",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0038")}).addStyleClass("FontFamilyBold"),	// 38:성명
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "120px",
			        	  minScreenWidth: "tablet"}), 
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0067")}).addStyleClass("FontFamilyBold"),	// 67:직위
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "8%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0815")}).addStyleClass("FontFamilyBold"),	// 815:부서명
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "12%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1553")}).addStyleClass("FontFamilyBold"),	// 1553:근무스케줄
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "10%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0577")}).addStyleClass("FontFamilyBold"),	// 577:근무시작시간
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "10%",
			        	  minScreenWidth: "tablet"}),	
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1560")}).addStyleClass("FontFamilyBold"),	// 1560:근무종료시간
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "10%",
			        	  minScreenWidth: "tablet"}),	
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1574")}).addStyleClass("FontFamilyBold"),	// 1574:근태정보
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "10%",
			        	  minScreenWidth: "tablet"}),			
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0477")}).addStyleClass("FontFamilyBold"),	// 477:메세지
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "15%",
			        	  minScreenWidth: "tablet"}),						        	  
					        	  
			          ],
			items: {
				path: "/Data",
				templateShareable:true,
				template: new sap.m.ColumnListItem({
//					counter : 10,
					cells : [
						new sap.m.Text({
						     text : "{Idx}" 
						}).addStyleClass("FontFamily"),
						new sap.m.Text({
					     text : "{Usrid}" , 
					    }).addStyleClass("FontFamily"),
						new sap.m.Text({
						     text : "{Ename}" , 
						    }).addStyleClass("FontFamily"),
						new sap.m.Text({
						     text : "{Zzjiklnt}" , 
						    }).addStyleClass("FontFamily"),	
					    new sap.m.Text({
						     text : "{Orgtx}" , 
						    }).addStyleClass("FontFamily"),	
					    new sap.m.Text({
						     text : "{Tprogt}" , 
						    }).addStyleClass("FontFamily"),							    
					    new sap.m.Text({
						     text : {
						    	 path: "Sobeg",
						    	 formatter: oController.formatTime
						     }  
						    }).addStyleClass("FontFamily"),		
					    new sap.m.Text({
						     text : {
						    	 path: "Soend",
						    	 formatter: oController.formatTime
						     } 
						    }).addStyleClass("FontFamily"),		
					    new sap.m.Text({
						     text : "{Attinfo}" , 
						    }).addStyleClass("FontFamily"),					
					    new sap.m.Text({
						     text : "{Msg}" , 
						    }).addStyleClass("FontFamily"),								    
					]
				})
			}
		});
		
		oTable.setModel(oController._DetailTableJSonModel);
		//oTable.bindItems({path:"/Data", template:oColumnList, templateShareable:false});
		//oTable.setKeyboardMode("Edit");	
		
		return oTable;
		
	
	}
});