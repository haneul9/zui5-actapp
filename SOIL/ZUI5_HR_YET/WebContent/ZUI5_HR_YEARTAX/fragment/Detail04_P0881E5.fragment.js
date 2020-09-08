sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04_P0881E5", {
	/** 특별소득공제(월세임대계약) **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_P0881E5Table", {
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
												oController.onAddLine2(oEvent, "P0881E5");
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
												oController.onDeleteLine(oEvent, "P0881E5");
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
		
		// 유형
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	resizable : true,
			showFilterMenuEntry : true,
			multiLabels : [new sap.ui.commons.TextView({text : "유형", textAlign : "Center"}).addStyleClass("FontFamily")],
			width : "100px",
			template : [new sap.m.ComboBox({
							items : { 
								path : "ZHR_YEARTAX_SRV>/PnstyCode/?$filter=Subty%20eq%20%27E5%27",
								template: new sap.ui.core.ListItem({
					                          key: "{ZHR_YEARTAX_SRV>Pnsty}",
					                          text: "{ZHR_YEARTAX_SRV>Pnstx}"
					                      }),
					            templateShareable : false
				            },       
				            selectedKey : "{Pnsty}",
				            width : "100%"
						}).addStyleClass("FontFamily")]
		});		
		oTable.addColumn(oColumn);
				
		var col_info = [{id: "Ldnam", label : "임대인성명", plabel : "", span : 0, type : "inputtext", editable : true, sort : true, filter : true},
			 			{id: "Regnr", label : "주민/사업자 등록번호", plabel : "", span : 0, type : "inputregnr2", editable : true, sort : true, filter : true, width : "170px"}];
		oController.makeTable(oController, oTable, col_info);
		
		// 주택유형
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	resizable : true,
			showFilterMenuEntry : true,
			multiLabels : [new sap.ui.commons.TextView({text : "주택유형", textAlign : "Center"}).addStyleClass("FontFamily")],
			width : "150px",
			template : [new sap.m.ComboBox({
							items : { 
								path : "ZHR_YEARTAX_SRV>/HoutyCodeSet",
								template: new sap.ui.core.ListItem({
					                          key: "{ZHR_YEARTAX_SRV>Zcode}",
					                          text: "{ZHR_YEARTAX_SRV>Ztext}"
					                      }),
					            templateShareable : false
				            },       
				            selectedKey : "{Houty}",
				            width : "100%"
						}).addStyleClass("FontFamily")]
		});		
		oTable.addColumn(oColumn);
		
		var col_info = [{id: "Flrar", label : "주택계약면적(㎡)", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Addre", label : "임대차 계약주소", plabel : "", span : 0, type : "inputtext", editable : true, sort : true, filter : true, width : "300px"},
			 			{id: "Rcbeg", label : "계약시작일", plabel : "", span : 0, type : "datepicker", editable : true, sort : true, filter : true},
			 			{id: "Rcend", label : "계약종료일", plabel : "", span : 0, type : "datepicker", editable : true, sort : true, filter : true},
			 			{id: "Monrt", label : "총금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Zflnts", label : "", plabel : "", span : 0, type : "pdf", editable : true, sort : true, filter : true, width : "40px"}];
		oController.makeTable(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1500px",
			contentHeight : "750px",
			draggable : false,
			content : [oTable],
			title : "특별소득공제(월세임대계약)",
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
									oController.onPressSaveSubty(oEvent, "P0881E5");
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
