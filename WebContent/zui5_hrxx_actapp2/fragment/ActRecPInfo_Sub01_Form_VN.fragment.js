sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub01_Form_VN", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub01_Form_VN
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
		
/////// 영문 이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("VORNA"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oVorna = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Vorna", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oVorna
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

/////// 영문 성
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NACHN"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oNachn = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Nachn", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oNachn
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// Citizen No.
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("CTZNO"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oCtzno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Ctzno", {
			type : "Text",
			width : "95%",
			maxLength : 13,
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oCtzno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 성별
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GESCH"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGesch1 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_VN_Gesch1", {
			groupName : "Gesch",
			select : oController.changeModifyContent,
			text : oBundleText.getText("MALE")
		});
		var oGesch2 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_VN_Gesch2", {
			groupName : "Gesch",
			select : oController.changeModifyContent,
			text : oBundleText.getText("FEMALE")
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [oGesch1, new sap.m.ToolbarSpacer({width : "10px"}), oGesch2]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 국적
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NATIO"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oNatio = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Natio", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchNatioDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({key : "Natio", value : ""})
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oNatio
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

/////// 결혼여부
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ZZFAMST"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oFamst = new sap.m.Select(oController.PAGEID + "_Sub01_Form_VN_Famst", {
     	   width : "50%",
     	   enabled : !oController._DISABLED,
     	   change : oController.onChangeFamst
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oFamst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Famst")]);
		
		var oFamdt = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_VN_Famdt", {
			width : "50%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	change : oController.changeModifyDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				width : "95%",
				content : [
				           oFamst,
				           new sap.m.ToolbarSpacer(),
				           oFamdt
				          ]
			   }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
	
		oRequestLayout.addRow(oRow);		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 휴대폰번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("HNDNO"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oHndno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Hndno", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oHndno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 전화번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TELNO")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTelno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Telno", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oTelno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 생일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GBDAT"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGbdat = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_VN_Gbdat", {
			width : "95%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	change : oController.changeModifyDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oGbdat
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

/////// 실제생일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ZZGBDAT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oZzgbdty1 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_VN_Zzgbdty1", {
			groupName : "Zzgbdty",
			select : oController.changeModifyContent,
			text : oBundleText.getText("SOLARC")
		});
		var oZzgbdty2 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_VN_Zzgbdty2", {
			groupName : "Zzgbdty",
			select : oController.changeModifyContent,
			text : oBundleText.getText("LUNARC")
		});
		
		var oZzgbdat = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_VN_Zzgbdat", {
			width : "70%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	change : oController.changeModifyDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				width : "95%",
				content : [
				           oZzgbdty1, 
				           new sap.m.ToolbarSpacer({width : "5px"}), 
				           oZzgbdty2,
				           new sap.m.ToolbarSpacer(),
				           oZzgbdat
				          ]
			   }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);				
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 우편번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PSTLZ"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oPstlz = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Pstlz", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oPstlz
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

/////// 주소-국가
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("LAND1"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oLand1 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Land1", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchNatioDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({key : "Land1", value : ""})
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oLand1
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

/////// 상세주소 -> 상세주소 및 번지
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("STRAS_40")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oStras = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Stras", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oStras
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 주소1 -> 시 -> 시/지역
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ORT01_VN"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oOrt02 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_VN_Ort02", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oOrt02
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);		

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 지역 -> 주
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("STATE_40"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oState = new sap.m.Select(oController.PAGEID + "_Sub01_Form_VN_State", {
     	   width : "95%",
     	   change : oController.changeModifyContent,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		//oState.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "State")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oState
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 종교
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("KONFE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oKonfe = new sap.m.Select(oController.PAGEID + "_Sub01_Form_VN_Konfe", {
     	   width : "95%",
     	   change : oController.changeModifyContent,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oKonfe.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Konfe")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oKonfe
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);

		return oRequestLayout;
	}

});