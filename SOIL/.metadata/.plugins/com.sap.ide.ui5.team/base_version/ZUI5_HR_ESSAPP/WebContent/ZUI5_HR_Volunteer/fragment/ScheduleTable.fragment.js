sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.ScheduleTable", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_ScheduleLayout",{
				width : "100%",
				content : [
					this.getScheduleLayoutInfoRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
//			.setModel(new sap.ui.model.json.JSONModel())
//			.bindElement("/Data")
		];
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getScheduleLayoutInfoRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_ScheduleTable",{
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
			width : "160px",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_2318"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 2318:행사일자
			template : [new sap.m.DatePicker({
		    	valueFormat : "yyyy-MM-dd",
		    	displayFormat : "yyyy.MM.dd",
		    	value : "{Zdate}",
		    	width : "130px",
		    	editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
		    	change : oController.onChangeDate
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
			width : "160px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_2311"), 	// 2311:행사 시작시간
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.TimePicker(
						{
							valueFormat : "HHmm",
							displayFormat : "HH:mm",
				            textAlign : sap.ui.core.TextAlign.Begin,
							value : "{Beguz}",
					    	editable : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
							change : oController.onChangeTime,
							customData : [
								new sap.ui.core.CustomData({
									key : "Type", value : "Beguz"
								})
							],
							width : "130px"
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
			width : "160px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_2312"), 	// 2312:행사 종료시간
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.TimePicker(
						{
							valueFormat : "HHmm",
							displayFormat : "HH:mm",
				            textAlign : sap.ui.core.TextAlign.Begin,
							value : "{Enduz}",
					    	editable : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
							change : oController.onChangeTime,
							customData : [
								new sap.ui.core.CustomData({
									key : "Type", value : "Enduz"
								})
							],
							width : "130px"
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
			width : "110px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_1777"), 	// 1777:봉사시간
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.Input(
						{
							textAlign : sap.ui.core.TextAlign.End,
							value : "{Zhour}",
					    	editable : false,
					    width : "90px"
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
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.Input({
							width : "100%",
							value : "{Zbigo}",
							editable : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerApplDate", "Zbigo"),
						}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column(oController.PAGEID +"_DelCol1",{
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "130px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0033"), 	// 33:삭제
										   textAlign : "Center"}).addStyleClass("FontFamily"),
			template : [new sap.m.Button({
							text: oBundleText.getText("LABEL_0033"),	// 33:삭제
							type : "Ghost",
							press : oController.onDeleteScheduleLine ,
					    	visible : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
						}).addStyleClass("FontFamily")],
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
							text : oBundleText.getText("LABEL_2319") 	// 2319:행사일정
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button({
							text: oBundleText.getText("LABEL_2068"),	// 2068:일정추가
							type : "Ghost",
							press : oController.onNewScheduleLine ,
							visible : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal1){
									if(fVal1 == "" || fVal1 == "10") return true;
									else return false;
								}
							},
						})
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				oTable
			],
	  }).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	}
});