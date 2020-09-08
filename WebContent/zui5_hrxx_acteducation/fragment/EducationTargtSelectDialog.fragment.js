sap.ui.jsfragment("zui5_hrxx_acteducation.fragment.EducationTargtSelectDialog", {

	createContent : function(oController) {	
		
		var oEducationTargetPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://person-placeholder", size : "0.9rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ENAME_3"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.Input(oController.PAGEID + "_ETS_Rpern", {
								width: "200px",
								showValueHelp: true,
								valueHelpRequest: oController.displaySearchUserDialog
							   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : []
		});
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_ETS_ColumnList", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({
			    	text : {path : "Begda", formatter : common.Common.DateFormatter}
				}).addStyleClass("L2P13Font"), 
			    new sap.m.Text({
			    	text : {path : "Endda", formatter : common.Common.DateFormatter}
				}).addStyleClass("L2P13Font"), 
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
			    new sap.m.Text({
			    	text : "{Anzkl}"
				}).addStyleClass("L2P13Font")
			]
		});  
		
		var oEducationList = new sap.m.Table(oController.PAGEID + "_ETS_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData : false,
			fixedLayout : false,
			mode : sap.m.ListMode.SingleSelectLeft,
			columns : [
			        	  new sap.m.Column({
			        		  header: new sap.m.Label({text : oBundleText.getText( "EBEGDA")}).addStyleClass("L2P13Font"), 			        	  
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
					          minScreenWidth: "tablet"}),
			        	  new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "EENDDA")}).addStyleClass("L2P13Font"), 			        	  
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  minScreenWidth: "tablet"}),  	  
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "SLART")}).addStyleClass("L2P13Font"),
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  minScreenWidth: "tablet"}),
			        	  new sap.m.Column({
				        	  header: new sap.m.Text({text : oBundleText.getText( "SLABS")}).addStyleClass("L2P13Font"),
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  minScreenWidth: "tablet"}),  	  
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "SLAND")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "SCHCDNM")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "SLTP1")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),
			        	  new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "SLTP2")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),
			        	  new sap.m.Column({
			        		  header: new sap.m.Label({text : oBundleText.getText( "ANZKL")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true})
			        ]
		});
		oEducationList.setModel(sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV"));
		oEducationList.attachUpdateStarted(function() {
			if(!oController.BusyDialog) {
				oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
				oController.getView().addDependent(oController.BusyDialog);
			} 
			if(!oController.BusyDialog.isOpen()) {
				oController.BusyDialog.open();
			}
		});
		oEducationList.attachUpdateFinished(function() {
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
		});
		
		var oEducationListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [ new sap.ui.core.Icon({src : "sap-icon://education", size : "1.0rem", color : "#666666"}),
				            new sap.m.Label({text : oBundleText.getText("PANEL_EDUCATION_LIST"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oEducationList]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_FCL_Dialog",{
			content :[oEducationTargetPanel,
			          new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			          oEducationListPanel] ,
			contentWidth : "950px",
			contentHeight : "400px",
			showHeader : true,
			title : oBundleText.getText("TITLE_EDUCATION_CHANGE_LIST"),
			beforeOpen : oController.onBeforeOpenEducationTargtSelectDialog,
			buttons : [new sap.m.Button({text : oBundleText.getText("NEW_EDUCATION_BTN"), press : oController.onCreateEducation}),
			           new sap.m.Button({text : oBundleText.getText("UPD_EDUCATION_BTN"), press : oController.onUpdateEducation}),
			           new sap.m.Button({text : oBundleText.getText("DEL_EDUCATION_BTN"), press : oController.onDeleteEducation}),
			           new sap.m.Button({text : oBundleText.getText("CLOSE_BTN"), press : oController.onETSClose})],
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});