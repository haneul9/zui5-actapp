sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub02
	*/
	 
	createContent : function(oController) {
		//Global 일자 관련하여 소스 수정함. 2015.10.19
		jQuery.sap.require("common.Common");
		//수정완료
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Sub02_TABLE", {
//			enableColumnReordering : false,
//			enableColumnFreeze : false,
//			columnHeaderHeight  : 35,
//			showNoData : true,
//			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
//			showOverlay : false,
//			enableBusyIndicator : true,
			noData : "No data found",
//			visibleRowCount : 1
			enableColumnReordering : false,
			enableColumnFreeze : false,
			visibleRowCount : 1,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
		}).setModel(oController._Sub02TableJson)
		.bindRows("/Data");
		
		var vColumnInfo = [{id: "Begda", label : "입학일", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "90px"},
						 {id: "Endda", label : "졸업일", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "90px"},
						 {id: "Sltxt", label : "학력", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "90px"},
						 {id: "Stext", label : "학위", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Landx", label : "국가", plabel : "", span : 0, type : "string", sort : true, filter : true, width : ""},
						 {id: "Schtx", label : "학교명", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px"},
						 {id: "Zzcolnm", label : "단과대명", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Zzmajg1tx", label : "전공그룹", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Zzmajo1tx", label : "전공", plabel : "", span : 0, type : "string", sort : true, filter : true, width : ""},
						 {id: "Zzmajg2tx", label : "복수전공그룹", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Zzmajo2tx", label : "복수전공", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Zzmajg3tx", label : "부전공그룹", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Zzmajo3tx", label : "부전공", plabel : "", span : 0, type : "string", sort : true, filter : true, width : ""},
						 {id: "Zzrecab", label : "인정", plabel : "", span : 0, type : "icon", sort : true, filter : true, width : "50px"},
						 {id: "Zzfinyn", label : "최종", plabel : "", span : 0, type : "icon", sort : true, filter : true, width : "50px"}
						 ];
		
		
		for(var i=0; i<vColumnInfo.length; i++) {
			var oColumn = new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
	        	autoResizable : true,
	        	resizable : false,
				showFilterMenuEntry : false
			});
			
			oColumn.setLabel(new sap.ui.commons.TextView({text : vColumnInfo[i].label, textAlign : "Center", width : "100%"}).addStyleClass("L2PFontFamily"));
			if(vColumnInfo[i].width && vColumnInfo[i].width != "") {
				oColumn.setWidth(vColumnInfo[i].width);
			}
			if(vColumnInfo[i].filter == true) {
				oColumn.setFilterProperty(vColumnInfo[i].id);
			}
			
			if(vColumnInfo[i].sort == true) {
				oColumn.setSortProperty(vColumnInfo[i].id);
			}
			if(vColumnInfo[i].type == "string") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumnInfo[i].id + "}", 
					textAlign : "Center"}).addStyleClass("L2PFontFamily"));
			}else if(vColumnInfo[i].type == "date") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : {
						path : vColumnInfo[i].id, 
						type : new sap.ui.model.type.Date({pattern: "yyyy.MM.dd"})
					},
					textAlign : "Center"}).addStyleClass("L2PFontFamily"));
			}else if(vColumnInfo[i].type =="icon"){
					oColumn.setTemplate(new sap.ui.core.Icon({src : "sap-icon://accept", visible :{path: vColumnInfo[i].id, formatter : function(fVal){
						if(fVal== "X" || fVal==true){
							return true;
						}else{
							return false;
						}
					}}}));
			}
			oTable.addColumn(oColumn);
		};
		
		
		
		
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