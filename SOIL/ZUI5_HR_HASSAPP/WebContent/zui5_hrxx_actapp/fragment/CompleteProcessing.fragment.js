jQuery.sap.require("common.Common");

sap.ui.jsfragment("zui5_hrxx_actapp.fragment.CompleteProcessing", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.CompleteProcessing
	*/
	
	createContent : function(oController) {
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CP_ColumnList", {
			//type : sap.m.ListType.Navigation, 
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{Ename}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.ui.commons.TextView({
				     text : "{ProcessStatusText}",
				     semanticColor: {path : "ProcessStatus",
				    	 formatter : function(fVal) {
				    		 if(fVal == "W") {
				    			 return sap.ui.commons.TextViewColor.Default;
				    		 } else if(fVal == "P") {
				    			 return sap.ui.commons.TextViewColor.Positive;
				    		 } else if(fVal == "S") {
				    			 return sap.ui.commons.TextViewColor.Positive;
				    		 } else if(fVal == "F") {
				    			 return sap.ui.commons.TextViewColor.Critical;
				    		 } 
				    		 
				    	 }
				     }
				}).addStyleClass("L2P13Font"),
				new sap.ui.commons.TextView({
				     text : "{ProcessMsg}",
				     semanticColor: sap.ui.commons.TextViewColor.Critical,
				}).addStyleClass("L2P13Font")
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_CP_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "해당하는 데이터가 없습니다.",
			showNoData : false,
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "성명"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "150px",
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "처리 상태"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width : "150px",
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "메세지"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width : "250px",
			        	  demandPopin: true})
		        	  ] ,       
		});		
		oTable.setModel(sap.ui.getCore().getModel("ActionSubjectList"));
		oTable.bindItems("/ActionSubjectListSet", oColumnList, null,
				[//new sap.ui.model.Filter("Batyp", sap.ui.model.FilterOperator.EQ, "A"),
				 new sap.ui.model.Filter("Pchk", sap.ui.model.FilterOperator.EQ, true)]);
		
		var oProgressIndicator = new sap.m.ProgressIndicator(oController.PAGEID + "_CP_MESSAGE", {width : "100%", showValue : true});
		var oMesasge = new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.m.Label({text : "채용 및 사간발령시 권한재조정 작업으로 10 ~ 20초 정도 추가 소요됩니다."}).addStyleClass("L2P13Font L2PFontColorBlue")]
		}).addStyleClass("L2PToolbarNoBottomLine");
//		var oPanel = new sap.m.Panel(oController.PAGEID + "_ATTACHFILE_PANEL", {
//			visible : true,
//			expandable : false,
//			expanded : false,
//			headerToolbar : new sap.m.Toolbar({
//				design : sap.m.ToolbarDesign.Auto,
//				content : [
//				           //new sap.ui.core.Icon({src : "sap-icon://process", size : "1.0rem", color : "#666666"}),
//				           //new sap.m.ProgressIndicator(oController.PAGEID + "_CP_MESSAGE", {width : "100%", showValue : true})
//				           //new sap.m.Label(oController.PAGEID + "_CP_MESSAGE", {text : ""}).addStyleClass("L2P13Font"),
//			              ]
//			}).addStyleClass("L2PToolbarNoBottomLine"),
//			content : [oTable]
//		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CP_Dialog",{
			content :[oMesasge,
			          new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			          oProgressIndicator,
			          new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			          oTable] ,
			contentWidth : "700px",
			contentHeight : "400px",
			showHeader : true,
			title : "발령품의서 확정처리",
			endButton : new sap.m.Button(oController.PAGEID + "_CP_ConfirmBtn", {text : "확인", icon: "sap-icon://accept", press : oController.onCPClose, enabled : false})
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}

});
