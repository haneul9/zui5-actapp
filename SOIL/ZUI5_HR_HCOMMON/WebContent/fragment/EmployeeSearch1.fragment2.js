sap.ui.jsfragment("fragment.EmployeeSearch1", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.EmployeeSearch
	*/
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.SearchUser");
		
        var oStat1 = new sap.m.Select(oController.PAGEID + "_ES_Stat1", {
			width : "200px"
        }).addStyleClass("L2P13Font");
		
		var oToolbarLayout = new sap.ui.commons.layout.VerticalLayout({
			width: "100%",
			height : "40px",
			horizontal : false,
			vertical : false ,
			content : [ oToolbar = new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.ui.core.Icon({src : "sap-icon://filter", size : "1.0rem", color : "#666666"}),
			           new sap.m.Label({text : "검색조건" , design : "Bold"}).addStyleClass("L2PFontFamily"),
			           new sap.m.ToolbarSpacer(),
			           new sap.m.Button({
							text: "검색",
							type : sap.m.ButtonType.Emphasized,
							icon : "sap-icon://search",
							press : common.SearchUser1.searchFilterBar
					   }).addStyleClass("L2PFontFamily"),
					   new sap.m.ToolbarSpacer({width: "10px"})]
						}).addStyleClass("L2PToolbarNoBottomLine")]	
			});
	
//	var oToolbar = new sap.m.Toolbar({
//		design : sap.m.ToolbarDesign.Auto,
//		content : [new sap.ui.core.Icon({src : "sap-icon://filter", size : "1.0rem", color : "#666666"}),
//		           new sap.m.Label({text : oBundleText.getText("FILINFO"), design : "Bold"}).addStyleClass("L2P13Font"),
//		           new sap.m.ToolbarSpacer(),
//		           new sap.m.Button({
//						text: oBundleText.getText("SEARCH_BTN"),
//						type : sap.m.ButtonType.Emphasized,
//						press : common.SearchUser1.searchFilterBar
//				   }).addStyleClass("L2PFontFamily"),
//				   new sap.m.ToolbarSpacer({width: "10px"})]
//	});
	
		
		var oFilterLayout = new sap.m.ScrollContainer(oController.PAGEID + "_ES_LeftScrollContainer", {
			width: "100%",
			height : "500px",
			horizontal : false,
			vertical : true
		}).addStyleClass("");		
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter1", {
				content : [new sap.m.Label({text : "인사영역 :"}),
				           new sap.m.Select(oController.PAGEID + "_ES_Persa", {
								width: "200px",
								change : common.SearchUser1.onChangePersa
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter2", {
				content : [new sap.m.Label({text : "성명 또는 사번 :"}),
				           new sap.m.Input(oController.PAGEID + "_ES_Ename", {
								width: "200px"
							}).addStyleClass("L2P13Font").attachBrowserEvent("keyup", common.SearchUser1.onKeyUp)]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter3", {
				content : [new sap.m.Label({text : oBundleText.getText("FULLN") + ":"}),
				           new sap.m.MultiInput(oController.PAGEID + "_ES_Fulln", {
								width: "200px",
								showValueHelp: true,
								enableMultiLineMode :true,
								valueHelpRequest: oController.displayMultiOrgSearchDialog
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("STATX") + ":"}),
				           oStat1]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter4", {
				visible : false,
				content : [new sap.m.Label({text : oBundleText.getText("ZZJOBGRTX") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_ES_Zzjobgr", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter5", {
				content : [new sap.m.Label({text  : "사원그룹 :" }),
				           new sap.m.Select(oController.PAGEID + "_ES_Persg", {
						 		width : "200px",
						 		change : common.SearchUser1.onChangePersg
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter6", {
				visible : true,
				content : [new sap.m.Label({text : "사원하위그룹 :"}),
				           new sap.m.Select(oController.PAGEID + "_ES_Persk", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter7", {
				visible : false,
				content : [new sap.m.Label({text : oBundleText.getText("ZZROLLVTX") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_ES_Zzrollv", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter8", {
				visible : false,
				content : [new sap.m.Label({text : oBundleText.getText("ZZCALTLTX") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_ES_Zzcaltl", {
						 		width : "200px",						 		
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter9", {
				visible : false,
				content : [new sap.m.Label({text : "사원하위그룹 :"}),
				           new sap.m.Select(oController.PAGEID + "_ES_Zzpsgrp", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
//		var oFilterPanel = new sap.m.Panel({
//			expandable : false,
//			expanded : false,
//			headerToolbar : new sap.m.Toolbar({
//				design : sap.m.ToolbarDesign.Auto,
//				content : [new sap.ui.core.Icon({src : "sap-icon://filter", size : "1.0rem", color : "#666666"}),
//				           new sap.m.Label({text : oBundleText.getText("FILINFO"), design : "Bold"}).addStyleClass("L2P13Font"),
//				           new sap.m.ToolbarSpacer(),
//				           new sap.m.Button({
//								text: oBundleText.getText("SEARCH_BTN"),
//								type : sap.m.ButtonType.Emphasized,
//								press : common.SearchUser1.searchFilterBar
//						   }).addStyleClass("L2PFontFamily"),
//						   new sap.m.ToolbarSpacer({width: "10px"}),]
//			}).addStyleClass("L2PToolbarNoBottomLine"),
//			content : [oFilterLayout]
//		});
		
		 var oTable = new sap.ui.table.Table(oController.PAGEID + "_EmpSearchResult_Table", {
	        	width : "100%",
				visibleRowCount: 10,
//				firstVisibleRow: 1,
//			    selectionMode: sap.ui.table.SelectionMode.None, //Use Singe or Multi
				electionMode: sap.ui.table.SelectionMode.Single, //Use Singe or Multi
//				navigationMode: sap.ui.table.NavigationMode.Scrollbar, //Paginator or Scrollbar
				fixedColumnCount: 0,
				showNoData : true
			});
			
	    oTable.setModel(sap.ui.getCore().getModel("EmpSearchResult"));
	    
	    oTable.bindRows("/EmpSearchResultSet");
	    
	    
//	    oTable.bindAggregation("columns", {
//
//	    path : "/EmpSearchResultSet",
//
//	    template : temaplteObject,
//
//	    events : {
//
//	         dataReceived : function(oEvent){
//	        	 alert("asdfasdfasdf");
//	         }
//	    }});
	    
//	    oTable.bindRows("/EmpSearchResultSet");
		 var vColumns = [ {id : "Ename", label : "성명", control : "txt", width : "100px", align : "left"}, //성명
		 	             {id : "Fulln", label : "소속부서", control : "txt", width : "180px", change : "OrgehC", align : "left"}, //소속
		                 {id : "Zzjiklnt", label : "직위", control : "txt", width : "150px", change : "", align : "left"}, //직위
		                 {id : "Zzjikgbt", label : "직군", control : "txt", width : "80px", change : "", align : "left"}, //직군
		                 {id : "Zzjiktlt", label : "호칭", control : "txt", width : "150px", change : "", align : "left"}, //호칭
		                 {id : "Zzjikcht", label : "직책", control : "txt", width : "80px", change : "", align : "left"}, //w직책
		                 {id : "Btrtx", label : "사업장", control : "txt", width : "100px", change : "", align : "left"}, //사업장		                 
		                 {id : "Statx", label : "재직구분", control : "txt", width : "80px", change : "PersgC", align : "left"}, //재직구분
		                 {id : "Entda", label : "입사일" , control : "date", width : "100px", align : "left"}, //입사일
		                 {id : "Retda", label : "퇴사일", control : "date", width : "100px", align : "left"}, //퇴사일
		                ];
		 var oControl = new sap.ui.commons.TextView().bindProperty("text", "lastName");
		 var oColumn = new sap.ui.table.Column({label: new sap.ui.commons.Label({text: "Last Name"}), template: oControl, sortProperty: "lastName", filterProperty: "lastName", width: "200px"});

		 
		 
//		oTable.addColumn(new sap.ui.table.Column({
//			 label: new sap.ui.commons.CheckBox(oController.PAGEID + "_ES_CheckHeader",{
//				 change : common.SearchUser1.onChangeCheckHeader
//			 }), 
//			 template: new sap.ui.commons.CheckBox({
//				 checked : {
//					 path : "Chck",
//				 }
//			 }),
//			 width: "30px" 
//		}));
				
		for(var i=0; i< vColumns.length; i++) {
			if(vColumns[i].control == "date"){
				oTable.addColumn(new sap.ui.table.Column({
					 label: new sap.ui.commons.Label({text: vColumns[i].label}).addStyleClass("L2PFontFamily"), 
					 template: new sap.ui.commons.TextView({ text : {path : vColumns[i].id, 
						                                     type :  new sap.ui.model.type.Date({pattern : "yyyy.MM.dd"}) }
					 }).addStyleClass("L2PFontFamily"),
					 width :  vColumns[i].width,
				     sortProperty: vColumns[i].id,
				     filterProperty: vColumns[i].id,
				}));
			}else{
				oTable.addColumn(new sap.ui.table.Column({
					 label: new sap.ui.commons.Label({text: vColumns[i].label}).addStyleClass("L2PFontFamily"), 
					 template: new sap.ui.commons.TextView().bindProperty("text", vColumns[i].id).addStyleClass("L2PFontFamily"),
					 width :  vColumns[i].width,
				     sortProperty: vColumns[i].id,
				     filterProperty: vColumns[i].id,
				}));
			}
			
		}

		//사원검색결과 리스트 Object (DHtmlx 사용을 위해 추가)
		var oPersonList = new sap.m.ScrollContainer(oController.PAGEID + "_ES_Table",  {
			width : "1015px",
			height : "520px",
			content : [oTable],
			horizontal : true,
			vertical : false
		});
		
	   
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://table-chart", size : "1.2rem", color : "#666666"}),
				           new sap.m.Label({text : "검색결과", design : "Bold"}).addStyleClass("L2PFontFamily"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oPersonList]
		});
		
		var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths : ["270px", "930px"]
		});
		
		var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oToolbarLayout , 
					   new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"}),
					   oFilterLayout]
		}).addStyleClass("");
		
		var oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oResultPanel]
		}).addStyleClass("");
		
		oMainLayout.createRow(oCell1, oCell2);
		
//		var vContentHeight = window.innerHeight - 200;
//		
//		oFilterLayout.setHeight((vContentHeight - 90) + "px");
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_ES_Dialog",{
			content :[oMainLayout] ,
			contentWidth : "1350px",
			contentHeight : "550px",
			showHeader : true,
			title : "사원 검색",
			afterOpen : common.SearchUser1.onAfterOpenSearchDialog,
			beforeClose : common.SearchUser1.onBeforeOpenSearchDialog,
			beginButton : new sap.m.Button({text : "선택", 
				icon : "sap-icon://accept",
				press : oController.onESSelectPerson }), //
//			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : common.SearchUser1.onClose}),
			endButton : new sap.m.Button({text : "취소", icon: "sap-icon://sys-cancel-2", press : common.SearchUser.onClose }),
		});
		
//		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };	

		return oDialog;
	}

});
