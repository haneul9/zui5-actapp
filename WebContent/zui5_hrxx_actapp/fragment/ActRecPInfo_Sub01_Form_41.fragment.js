sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub01_Form_41", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub01_Form_41
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
		
/////// 한글 성
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("LNMHG"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oLnmhg = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Lnmhg", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oLnmhg
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 한글 이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("FNMHG"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oFnmhg = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Fnmhg", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oFnmhg
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 영문 성
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NACHN"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oNachn = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Nachn", {
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
		
/////// 영문 이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("VORNA"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oVorna = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Vorna", {
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
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 한자 성
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("LNMCH"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oLnmch = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Lnmch", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oLnmch
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 한자 이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("FNMCH"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oFnmch = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Fnmch", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oFnmch
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 주민등록번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REGNO"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oRegno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Regno", {
			type : "Text",
			width : "95%",
			maxLength : 13,
			liveChange : oController.setFromRegno,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oRegno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 성별
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GESCH"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGesch1 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_41_Gesch1", {
			groupName : "Gesch",
			select : oController.changeModifyContent,
			text : oBundleText.getText("MALE")
		});
		var oGesch2 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_41_Gesch2", {
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
		
		var oNatio = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Natio", {
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
		
		var oFamst = new sap.m.Select(oController.PAGEID + "_Sub01_Form_41_Famst", {
     	   width : "50%",
     	   enabled : !oController._DISABLED,
     	   change : oController.onChangeFamst
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oFamst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Famst")]);
		
		var oFamdt = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_41_Famdt", {
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
		
/////// 생일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ZZGBDAT"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oZzgbdat = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_41_Zzgbdat", {
			width : "95%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	change : oController.changeModifyDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oZzgbdat
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 양력/음력
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ZZGBDTY"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oZzgbdty1 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_41_Zzgbdty1", {
			groupName : "Zzgbdty",
			select : oController.changeModifyContent,
			text : oBundleText.getText("SOLARC")
		});
		var oZzgbdty2 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_41_Zzgbdty2", {
			groupName : "Zzgbdty",
			select : oController.changeModifyContent,
			text : oBundleText.getText("LUNARC")
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [oZzgbdty1, new sap.m.ToolbarSpacer({width : "5px"}), oZzgbdty2]
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
		
		var oHndno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Hndno", {
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
			content : [new sap.m.Label({text: oBundleText.getText("TELNO2")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTelno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Telno", {
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
		
/////// 주소-국가
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("LAND1"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oLand1 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Land1", {
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
		
/////// 우편번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PSTLZ"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oPstlz = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Pstlz", {
			type : "Text",
			width : "95%",
			showValueHelp: false,
			valueHelpRequest: oController.onDisplaySearchZipcodeDialog,
			liveChange : oController.changeModifyContent,
			change : oController.changeModifyContent,
			enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oPstlz
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 지역 -> 시/도
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("STATE_41"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oState = new sap.m.Select(oController.PAGEID + "_Sub01_Form_41_State", {
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
		
/////// 주소1 -> 시/구/군/읍/면
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ORT01_41"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oOrt01 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Ort01", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oOrt01
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 주소2 -> 도로/건물 번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ORT02_41"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oOrt02 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Ort02", {
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
		
/////// 상세주소 -> 주소(동/호)
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("STRAS_41"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oStras = new sap.m.Input(oController.PAGEID + "_Sub01_Form_41_Stras", {
			type : "Text",
			width : "95%",
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : oStras
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		return oRequestLayout;
	}

});