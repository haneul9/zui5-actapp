sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04_P088101", {
	/** 세액감면 및 세액공제 - 보험료 **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_P088101Table", {
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
												oController.onAddLine(oEvent, "P088101");
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
												oController.onDeleteLine(oEvent, "P088101");
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
		
		var col_info = [{id: "Deptx", label : "관계", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true},
			 			{id: "Emnam", label : "성명", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true},
			 			{id: "Regnr", label : "주민등록번호", plabel : "", span : 0, type : "regnr", editable : true, sort : true, filter : true},
//			 			{id: "Haned", label : "장애인여부", plabel : "", span : 0, type : "checkbox2", editable : false, sort : true, filter : true},
			 			{id: "Handi", label : "장애인보험", plabel : "", span : 0, type : "checkbox", editable : true, sort : true, filter : true},
			 			{id: "Ntsam", label : "국세청금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Otham", label : "기타금액", plabel : "", span : 0, type : "input", editable : true, sort : true, filter : true},
			 			{id: "Zflnts", label : "", plabel : "", span : 0, type : "pdf", editable : true, sort : true, filter : true, width : "40px"}];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			contentHeight : "750px",
			draggable : false,
			content : [oTable],
			title : "세액감면 및 세액공제(보험료)",
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
									oController.onPressSaveSubty(oEvent, "P088101");
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
