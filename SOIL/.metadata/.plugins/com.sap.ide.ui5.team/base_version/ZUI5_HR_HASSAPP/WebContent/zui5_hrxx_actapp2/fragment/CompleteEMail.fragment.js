sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.CompleteEMail", {
	
	createContent : function(oController) { 
		
        var oToolbar = new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [
			           new sap.m.Label({text : "발령확정이 완료되었습니다. 아래 수신처를 기준으로 확정메일이 발송됩니다. 수신처를 다시 한번 확인해"}).addStyleClass("L2P13Font"),
					  ]
		}).addStyleClass("L2PPaddingLeft10"); 
        
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CE_ColumnList", {
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{Numbr}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Maltytx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Rcvidtx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Zzcaltltx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Stext}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Rnoyn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Pnryn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Payyn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.Link({
					text : "{Autho}",
					customData : [{key : "Persa", value : "{Persa}"},
					              {key : "Rcvid", value : "{Rcvid}"},
					              {key : "Malty", value : "{Malty}"}]
				}).addStyleClass("L2P13Font")
				.attachBrowserEvent("click", oController.displayReceiveAuth)
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_CE_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "해당하는 데이터가 없습니다.",
			showNoData : true,
			mode : "MultiSelect",
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "30px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "수신구분"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "메일수신자"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "직위"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Begin}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "소속"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "주민번호 표시"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "사번 표시"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),	 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "호봉 표시"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : " "}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}) 
		        	  ] ,       
		});		
		oTable.setModel(sap.ui.getCore().getModel("ActionMailRecipientList"));
		oTable.bindItems("/ActionMailRecipientListSet", oColumnList, null, []);
		
		oTable.attachUpdateFinished(function() {
			oTable.selectAll();
		});
		
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
				           new sap.ui.core.Icon({src : "sap-icon://table-chart", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "메일수신자 리스트", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button({text: "삭제", icon : "sap-icon://delete", press : oController.deletePerson})
						  ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CE_Dialog",{
			content : [oToolbar, oResultPanel],
			contentWidth : "1200px",
			contentHeight : "600px",
			showHeader : true,
			title : "발령확정 메일 발송",
			beforeOpen : oController.onBeforeOpenCompleteEMailDialog,
			beginButton : new sap.m.Button({text : "메일발송", icon: "sap-icon://email", press : oController.onSendMail}), //
			endButton : new sap.m.Button({text : "취소", icon: "sap-icon://sys-cancel-2", press : oController.onCEClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    }; 
	     
		return oDialog;
	}

});
