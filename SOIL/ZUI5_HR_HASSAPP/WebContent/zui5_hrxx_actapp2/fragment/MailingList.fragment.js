sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.MailingList", {
	 
	createContent : function(oController) {
		
		var oColumnList = new sap.m.ColumnListItem("MailligList_ColumnList", {
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{Numbr}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Ename}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Zzjiktlt}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Fulln}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Rnoyn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Pnryn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Payyn}",
				}).addStyleClass("L2P13Font")
			]
		});  
		
		var oTable = new sap.m.Table("MailingList_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "해당하는 데이터가 없습니다.",
			showNoData : false,
			mode : "MultiSelect",
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "30px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "성명"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "150px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "직급"}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Begin}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "소속"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width: "200px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "주민등록번호"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "사번"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),	 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "기본급"}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true})     
		        	  ] ,       
		});		
		oTable.setModel(sap.ui.getCore().getModel("ActionMailingList"));
		oTable.bindItems("/ActionMailingList", oColumnList, null, []);
		
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://table-chart", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "메일수신자 리스트", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button({text: "추가", icon : "sap-icon://add", press : oController.addPerson}),
				           new sap.m.Button({text: "삭제", icon : "sap-icon://delete", press : oController.delPerson})
						]
			}),
			content : [oTable]
		});
		
		var oDialog = new sap.m.Dialog("MailingList_Dialog",{
			content : oResultPanel,
			contentWidth : "1000px",
			contentHeight : "600px",
			showHeader : true,
			title : "메일발송",
			beforeClose : oController.onBeforeCloseMailingListDialog,
		//	beforeOpen : oController.onBeforeOpenMailingListDialog,
			beginButton : new sap.m.Button({text : "메일발송", icon: "sap-icon://email", press : oController.onSendMail}), //
			endButton : new sap.m.Button({text : "취소", icon: "sap-icon://sys-cancel-2", press : oController.onSendEmailClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
