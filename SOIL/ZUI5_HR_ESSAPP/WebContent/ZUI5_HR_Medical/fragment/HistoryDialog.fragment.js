sap.ui.jsfragment("ZUI5_HR_Medical.fragment.HistoryDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oColumnList = new sap.m.ColumnListItem({
			counter : 10,
			cells : [
				new sap.m.Text({
				     text : "{Idx}" 
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text : "{Begda}" , 
				}).addStyleClass("L2PFontFamily"),
			    new sap.m.Text({
					text : "{Endda}" , 
				}).addStyleClass("L2PFontFamily"),
				 new sap.m.Text({
					text : "{Medtytx}" , 
				}).addStyleClass("L2PFontFamily"),
			    new sap.m.Text({
			    	text : "{Disenm}" , 
				}).addStyleClass("L2PFontFamily"),
			    new sap.m.Text({
			    	text : "{Medorg}" , 
				}).addStyleClass("L2PFontFamily"),
			    new sap.m.Text({
			    	text : "{Foryntx}" , 
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
			    	text : "{Recpgbtx}" , 
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
			    	text : { path : "Apamt",
						formatter : function(fVal){
							return common.Common.numberWithCommas(fVal);
						}
			    	},
				}).addStyleClass("L2PFontFamily"),
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_HistoryTable", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			mode : "SingleSelectLeft",
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight cellBorderLeft",
			        	  width : "30px",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1108")}).addStyleClass("L2PFontFamily"),	// 1108:진료시작일
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "120px",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1109")}).addStyleClass("L2PFontFamily"),	// 1109:진료종료일
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "120px",
			        	  minScreenWidth: "tablet"}), 
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1110")}).addStyleClass("L2PFontFamily"),	// 1110:질병유형
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "8%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1092")}).addStyleClass("L2PFontFamily"),	// 1092:병명
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1107")}).addStyleClass("L2PFontFamily"),	// 1107:진료기관
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "15%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1102")}).addStyleClass("L2PFontFamily"),	// 1102:입원/외래
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "8%",
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}), 
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1096")}).addStyleClass("L2PFontFamily"),	// 1096:영수증구분
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "8%",
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0081")}).addStyleClass("L2PFontFamily"),	// 81:신청금액
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Right,
			        	  width : "7%",
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}), 	  
			          ]
		});
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindItems("/Data", oColumnList); 
		
		var oDialog = new sap.m.Dialog({
			content :[oTable] ,
			contentWidth : "1300px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1099"),	// 1099:의료비 신청내역
			beginButton : new sap.m.Button({text : oBundleText.getText("LABEL_0037"), press : oController.onSelectHistory}),	// 37:선택
			endButton :   new sap.m.Button({text : oBundleText.getText("LABEL_0017"), press : oController.onCloseHistory}), 	// 17:닫기
			afterOpen : oController.afterOpenHistoryDial
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		

		return oDialog;
	}

});
