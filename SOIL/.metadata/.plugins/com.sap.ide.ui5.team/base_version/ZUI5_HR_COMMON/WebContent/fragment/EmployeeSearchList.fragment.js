sap.ui.jsfragment("fragment.EmployeeSearchList", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.EmployeeSearch
	*/
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.SearchUserList");
		
        var oStat1 = new sap.m.Select(oController.PAGEID + "_ES_Stat1", {
			width : "200px"
        }).addStyleClass("L2P13Font");
		
		var oToolbarLayout = new sap.ui.commons.layout.VerticalLayout({
			width: "100%",
			content : [ oToolbar = new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.ui.core.Icon({src : "sap-icon://filter", size : "1.0rem", color : "#666666"}),
			           new sap.m.Label({text : oBundleText.getText("LABEL_2774") , design : "Bold"}).addStyleClass("FontFamilyBold"),	// 2774:검색조건
			           new sap.m.ToolbarSpacer(),
			           new sap.m.Button({
							text: oBundleText.getText("LABEL_0002"),	// 2:검색
							type : sap.m.ButtonType.Emphasized,
							icon : "sap-icon://search",
							press : common.SearchUserList.searchFilterBar
					   }),
					   new sap.m.ToolbarSpacer({width: "10px"})]
						}).addStyleClass("ToolbarNoBottomLine")]	
			});
	

		var oFilterLayout = new sap.m.ScrollContainer(oController.PAGEID + "_ES_LeftScrollContainer", {
			width: "100%",
			horizontal : false,
			vertical : false
		}).addStyleClass("");		
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter1", {
				content : [new sap.m.Label({text : oBundleText.getText("LABEL_0563") + " :"}),	// LABEL_0563:사업장
				           new sap.m.Select(oController.PAGEID + "_ES_Persa", {
								width: "200px",
								change : common.SearchUserList.onChangePersa
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("FilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter2", {
				content : [new sap.m.Label({text : oBundleText.getText("LABEL_2775") + ": "}),	// 2775:성명 또는 사번
				           new sap.m.Input(oController.PAGEID + "_ES_Ename", {
								width: "200px"
							}).addStyleClass("L2P13Font").attachBrowserEvent("keyup", common.SearchUserList.onKeyUp)]
			}).addStyleClass("FilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter3", {
				content : [new sap.m.Label({text : oBundleText.getText("LABEL_0479") + ": "}),	// 479:소속
				           new sap.m.MultiInput(oController.PAGEID + "_ES_Fulln", {
								width: "200px",
								showValueHelp: true,
								enableMultiLineMode :true,
								valueHelpOnly: true,
								valueHelpRequest: oController.displayMultiOrgSearchDialog
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("FilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("LABEL_2091") + ":"}),	// 2091:재직구분
				           oStat1]
			}).addStyleClass("FilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter5", {
				content : [new sap.m.Label({text  : oBundleText.getText("LABEL_2776") + " :" }),	// 2776:사원그룹
				           new sap.m.Select(oController.PAGEID + "_ES_Persg", {
						 		width : "200px",
						 		change : common.SearchUserList.onChangePersg
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("FilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter6", {
				visible : true,
				content : [new sap.m.Label({text : oBundleText.getText("LABEL_2777") + " :"}),	// 2777:사원하위그룹
				           new sap.m.Select(oController.PAGEID + "_ES_Persk", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("FilterItem")
		);
		
		 var oTable = new sap.ui.table.Table(oController.PAGEID + "_EmpSearchResult_Table", {
	        	width : "100%",
				visibleRowCount: 10,
				selectionMode: sap.ui.table.SelectionMode.MultiToggle, //Use Singe or Multi
				fixedColumnCount: 0,
				showNoData : true
			});
			
	    oTable.setModel(sap.ui.getCore().getModel("EmpSearchResult"));    
	    oTable.bindRows("/EmpSearchResultSet");
		oTable.attachCellClick(common.SearchUserList.onClick);
		oTable.attachBrowserEvent("dblclick", common.SearchUserList.onDblClick );
	    
		var vColumns = [
			{id : "Perid", label : oBundleText.getText("LABEL_0031"), control : "txt", width : "100px", align : "left"},	// 31:사번
			{id : "Ename", label : oBundleText.getText("LABEL_0038"), control : "txt", width : "100px", align : "left"},	// 38:성명
			{id : "Fulln", label : oBundleText.getText("LABEL_0039"), control : "txt", width : "180px", change : "OrgehC", align : "left"},	// 39:소속부서
			{id : "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), control : "txt", width : "150px", change : "", align : "left"},	// 67:직위
			{id : "Zzjikcht", label : oBundleText.getText("LABEL_1007"), control : "txt", width : "80px", change : "", align : "left"},	// 1007:직책
			{id : "Pbtxt", label : oBundleText.getText("LABEL_0563"), control : "txt", width : "120px", change : "", align : "left"},	// LABEL_0563:사업장
			{id : "Zscshtx", label : oBundleText.getText("LABEL_0624"), control : "txt", width : "120px", change : "", align : "left"},	// 624:근무조
			{id : "Statx", label : oBundleText.getText("LABEL_2091"), control : "txt", width : "80px", change : "PersgC", align : "left"},	// 2091:재직구분
		];
		
		 var oControl = new sap.ui.commons.TextView().bindProperty("text", "lastName");
		 var oColumn = new sap.ui.table.Column({label: new sap.ui.commons.Label({text: "Last Name"}), template: oControl, sortProperty: "lastName", filterProperty: "lastName", width: "200px"});

				
		for(var i=0; i< vColumns.length; i++) {
			if(vColumns[i].control == "date"){
				oTable.addColumn(new sap.ui.table.Column({
					 label: new sap.ui.commons.Label({text: vColumns[i].label, textAlign : "Center"}).addStyleClass("FontFamilyBold"), 
					 template: new sap.ui.commons.TextView({ text : {path : vColumns[i].id, 
						                                     type :  new sap.ui.model.type.Date({pattern : "yyyy.MM.dd"}) }
					 }).addStyleClass("FontFamily"),
					 width :  vColumns[i].width,
				     sortProperty: vColumns[i].id,
				     filterProperty: vColumns[i].id,
				}));
			}else{
				oTable.addColumn(new sap.ui.table.Column({
					 label: new sap.ui.commons.Label({text: vColumns[i].label, textAlign : "Center"}).addStyleClass("FontFamilyBold"), 
					 template: new sap.ui.commons.TextView().bindProperty("text", vColumns[i].id).addStyleClass("FontFamily"),
					 width :  vColumns[i].width,
				     sortProperty: vColumns[i].id,
				     filterProperty: vColumns[i].id,
				}));
			}
			
		}

		//사원검색결과 리스트 Object (DHtmlx 사용을 위해 추가)
		var oPersonList = new sap.m.ScrollContainer(oController.PAGEID + "_ES_Table",  {
//			width : "1138px",
//			height : "320px",
			content : [oTable],
			horizontal : false,
			vertical : true
		});
		
	   
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://table-chart", size : "1.2rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("LABEL_1467"), design : "Bold"}).addStyleClass("FontFamilyBold"),	// 1467:검색결과
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("ToolbarNoBottomLine"),
			content : [oPersonList]
		});
		
		var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths : ["200px", ""]
		});
		
		var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oToolbarLayout , 
					   new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}),
					   oFilterLayout]
		}).addStyleClass("");
		
		var oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oResultPanel]
		}).addStyleClass("");
		
		oMainLayout.createRow(oCell1, oCell2);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_ES_Dialog",{
			content :[oMainLayout] ,
//			contentWidth : "1400px",
//			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2779"),	// 2779:사원 검색
			afterOpen : common.SearchUserList.onAfterOpenSearchDialog,
			beforeClose : common.SearchUserList.onBeforeOpenSearchDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("LABEL_0037"), 	// 37:선택
				icon : "sap-icon://accept",
				press : oController.onESSelectPerson }),
			endButton : new sap.m.Button({text : oBundleText.getText("LABEL_0071"), icon: "sap-icon://sys-cancel-2", press : oController.onESSClose}),	// 71:취소
		});
		
//		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };	

		return oDialog;
	}

});
