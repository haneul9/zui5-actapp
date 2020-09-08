sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04_P0858List", {
	/** 세액감면 및 세액공제(기부금) **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_P0858ListTable", {
			enableColumnReordering : false,
			enableGrouping : false,
			enableColumnFreeze : false,
			enableBusyIndicator : true,
			showOverlay : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: "MultiToggle",
			visibleRowCount : 1,
			extension : [new sap.m.Toolbar({
							content : [new sap.m.Button({
											icon : "sap-icon://add",
											text : "라인추가",
											visible : {
												parts : [{path : "Pystat"}, {path : "Yestat"}],
												formatter : function(fVal1, fVal2){
													return fVal1 == "1" && fVal2 == "1" ? true : false;
												}
											},
											press : function(oEvent){
												oController.onAddLine(oEvent, "P0858List");
											}
									   }),
									   new sap.m.Button({
										    icon : "sap-icon://less",
										    text : "라인삭제",
											visible : {
												parts : [{path : "Pystat"}, {path : "Yestat"}],
												formatter : function(fVal1, fVal2){
													return fVal1 == "1" && fVal2 == "1" ? true : false;
												}
											},
											press : function(oEvent){
												oController.onDeleteLine(oEvent, "P0858List");
											}
									   }),
									   new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
										   text : "데이터(라인 추가/삭제) 수정 후 반드시 저장버튼을 클릭해야 데이터가 반영됩니다."
									   }).addStyleClass("colorBlue Font14")]
						 }).addStyleClass("ToolbarNoBottomLine")
						   .setModel(oController._DetailJSonModel)
						   .bindElement("/Data")]
		}).addStyleClass("FontFamily");
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [{id: "Deptx", label : "관계", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true, width : "85px"},
			 			{id: "Emnam", label : "성명", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true, width : "100px"},
			 			{id: "Regnr", label : "주민등록번호", plabel : "", span : 0, type : "regnr", editable : true, sort : true, filter : true, width : "130px"}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	resizable : true,
			showFilterMenuEntry : true,
			multiLabels : [new sap.ui.commons.TextView({text : "기부금유형", textAlign : "Center"}).addStyleClass("FontFamily")],
			width : "200px",
			template : [new sap.m.ComboBox({
							items : { 
								path : "ZHR_YEARTAX_SRV>/DocodCode",
								template: new sap.ui.core.ListItem({
					                          key: "{ZHR_YEARTAX_SRV>Zcode}",
					                          text: "{ZHR_YEARTAX_SRV>Ztext}"
					                      }),
					            templateShareable : false
				            },       
				            selectedKey : "{Docod}",
				            width : "100%"
						}).addStyleClass("FontFamily")]
		});		
		oTable.addColumn(oColumn);
	
		var col_info = [{id: "Donum", label : "사업자등록번호", plabel : "", span : 0, type : "inputtext", editable : true, sort : true, filter : true},
			 			{id: "Donam", label : "기부처명", plabel : "", span : 0, type : "inputtext", editable : true, sort : true, filter : true},
			 			{id: "Doamt", label : "금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true, width : "130px"},
			 			{id: "Flnts", label : "국세청자료", plabel : "", span : 0, type : "checkbox", editable : true, sort : true, filter : true, width : "105px"},
			 			{id: "Zflnts", label : "", plabel : "", span : 0, type : "pdf", editable : true, sort : true, filter : true, width : "40px"}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			contentHeight : "750px",
			draggable : false,
			content : [oTable],
			title : "세액감면 및 세액공제(기부금)",
			beginButton : [new sap.m.Button({
								icon : "sap-icon://save", 
								text : "저장",
								visible : {
									parts : [{path : "Pystat"}, {path : "Yestat"}],
									formatter : function(fVal1, fVal2){
										return fVal1 == "1" && fVal2 == "1" ? true : false;
									}
								},
								press : function(oEvent){
									oController.onPressSaveSubty(oEvent, "P0858List");
								}
						   })],			
			endButton : [new sap.m.Button({icon: "sap-icon://decline", text : "닫기", press : function(oEvent){oDialog.close();}})]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		oDialog.setModel(oController._DetailJSonModel);
		oDialog.bindElement("/Data");
		
		return oDialog;
	}

});
