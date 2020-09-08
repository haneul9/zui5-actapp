sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub23_10", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* 
	* 개인 추가 정보
	* 
	* @memberOf fragment.ActRecPInfo_Sub23_10
	*/
	 
	createContent : function(oController) {
        var oCell = null, oRow = null;
        
        var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 민족(인종)
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "민족유형", required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oRacky = new sap.m.Select(oController.PAGEID + "_Sub23_Racky", {
     	   width : "95%",
     	   change : oController.changeModifyContent,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oRacky.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Racky")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oRacky
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 병역상태
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "병역상태", required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oMilsa = new sap.m.Select(oController.PAGEID + "_Sub23_Milsa", {
     	   width : "95%",
     	   change : oController.changeModifyContent,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oMilsa.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Milsa")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oMilsa
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 장애여부 상태
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "장애유형", required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oDisab = new sap.m.Select(oController.PAGEID + "_Sub23_Disab", {
     	   width : "95%",
     	   change : oController.changeModifyContent,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oDisab.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Disab")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oDisab]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
/////// 보훈 유형  -- 미국만
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "보훈유형", required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oVets1 = new sap.m.RadioButton(oController.PAGEID + "_Sub23_Vets1", {
     	   text : "Protected Veterans",
     	   groupName : "Vets",
     	   select : oController.onSelectVetsRadio,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font");
		
		var oVets2 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets2", {
     	   text : "Special Disabled Veteran",
     	   select : oController.onSelectVetsCheckbox,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font L2PPaddingLeft10");
		
		var oVets3 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets3", {
     	   text : "Vietnam Era Veteran",
     	   select : oController.onSelectVetsCheckbox,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font L2PPaddingLeft10");
		
		var oVets4 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets4", {
     	   text : "Active Duty Wartime or Campaign B",
     	   select : oController.onSelectVetsCheckbox,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font L2PPaddingLeft10");
		
		var oVets5 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets5", {
     	   text : "Recently Separated Veteran",
     	   select : oController.onSelectVetsCheckbox,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font L2PPaddingLeft10");
		
		var oVets6 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets6", {
     	   text : "Armed Forces Service Medal Vetera",
     	   select : oController.onSelectVetsCheckbox,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font L2PPaddingLeft10");
		
		var oVets7 = new sap.m.CheckBox(oController.PAGEID + "_Sub23_Vets7", {
     	   text : "Disabled Veteran",
     	   select : oController.onSelectVetsCheckbox,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font L2PPaddingLeft10");
		
		var oVets8 = new sap.m.RadioButton(oController.PAGEID + "_Sub23_Vets8", {
     	   text : "Not a Protected Veteran",
     	   groupName : "Vets",
     	   select : oController.onSelectVetsRadio,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font");
		
		var oVets9 = new sap.m.RadioButton(oController.PAGEID + "_Sub23_Vets9", {
     	   text : "Prefers Not to Answer",
     	   groupName : "Vets",
     	   select : oController.onSelectVetsRadio,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font");
		
		var oVets10 = new sap.m.RadioButton(oController.PAGEID + "_Sub23_Vets10", {
     	   text : "Non Veteran",
     	   groupName : "Vets",
     	   select : oController.onSelectVetsRadio,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font");
		
		var oDcrdt = new sap.m.DatePicker(oController.PAGEID + "_Sub23_Dcrdt", {
			width : "200px",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	visibale : false,
	    	change : oController.changeModifyDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		var oVetsLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oVetsLayout.createRow(oVets1);
		oVetsLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oVets2
		}).addStyleClass("L2PPaddingLeft20"));
		oVetsLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oVets3
		}).addStyleClass("L2PPaddingLeft20"));
		oVetsLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oVets4
		}).addStyleClass("L2PPaddingLeft20"));
		oVetsLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [oVets5, 
				           new sap.m.ToolbarSpacer({width : "50px"}),
				           new sap.m.Label(oController.PAGEID + "_Sub23_Dcrdt_Label", {text : "Discharge Date", visibale : false}),
				           new sap.m.ToolbarSpacer({width : "10px"}),
				           oDcrdt]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PPaddingLeft20"));
		oVetsLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oVets6
		}).addStyleClass("L2PPaddingLeft20"));
		oVetsLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oVets7
		}).addStyleClass("L2PPaddingLeft20"));
		oVetsLayout.createRow(oVets8);
		oVetsLayout.createRow(oVets9);
		oVetsLayout.createRow(oVets10);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : oVetsLayout
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
	
		oRequestLayout.addRow(oRow);
		
		return oRequestLayout;
		
	}

});