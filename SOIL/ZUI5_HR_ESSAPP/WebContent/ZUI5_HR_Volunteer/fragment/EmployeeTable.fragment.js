sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.EmployeeTable", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getScheduleLayoutInfoRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
		];
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getScheduleLayoutInfoRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_EmployeeTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
			columnHeaderHeight : 35,
			visibleRowCount : 1
		}).setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "50px"}];
			common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "6%",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1317"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1317:사원번호
			template : [new sap.m.Input({
				value : "{Perid}",
				editable : false,
				textAlign : "Center",
				valueHelpOnly : true,
				showValueHelp : true,
			}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "165px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0038"), 	// 38:성명
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
		    template : [new sap.m.Input({
		    	value : "{Ename}",
		    	textAlign : "Center",
		    	editable : false,
			}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "10%",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0815"), 	// 815:부서명
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
		    template : [new sap.m.Input({
		    	value : "{Orgtx}",
		    	textAlign : "Begin",
		    	editable : false,
			}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "9%",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0067"), 	// 67:직위
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
		    template : [new sap.m.Input({
		    	value : "{Zzjiklnt}", 
		    	textAlign : "Begin",
		    	editable : false,
			}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0096"), 	// 96:비고
										   textAlign : "Center"}).addStyleClass("FontFamily"),
			template : [new sap.m.Input({
				width : "98%",
				value : "{Zbigo}",
				editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
				maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerApplPernr", "Zbigo"),
			}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column(oController.PAGEID + "_DelCol2",{
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "140px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0033"), 	// 33:삭제
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.Button({
							text: oBundleText.getText("LABEL_0033"),	// 33:삭제
							icon : "sap-icon://delete",
							press : oController.onDeleteEmployeeLine ,
							visible : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
						}).addStyleClass("FontFamily")]
		}));
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_2185") 	// 2185:직원정보
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button({
							text: oBundleText.getText("LABEL_2040"),	// 2040:인원추가
							press : oController.onNewEmployeeLine ,
							type : "Ghost",
							visible : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
						}),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				oTable
			],
		  visible : { path : "ZreqForm",
			formatter : function(fVal){
				if(fVal == "GA02") return true;  
				else return false;
			}
		}
	  }).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	}
});