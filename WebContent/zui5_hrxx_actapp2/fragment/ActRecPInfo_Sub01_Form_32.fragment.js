sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub01_Form_32", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub01_Form_32
	*/
	 
	createContent : function(oController) {
        var oCell = null, oRow = null;
        
        var oPersonalLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
        
        var oContactLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
        
        var oAddressLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
        
//        var oEmergencyLayout = new sap.ui.commons.layout.MatrixLayout({
//			width : "100%",
//			layoutFixed : false,
//			columns : 4,
//			widths: ["15%","35%","15%","35%"],
//		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
///// TITLE
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ANRED"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oAnred = new sap.m.Select(oController.PAGEID + "_Sub01_Form_32_Anred", {
     	    width : "95%",
     	    change : oController.changeModifyContent,
     	    enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oAnred.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Anred")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oAnred
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);		
		
	/////// 영문 이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("VORNA"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oVorna = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Vorna", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Vorna"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oVorna
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 영문 중간이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("MIDNM")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oMidnm = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Midnm", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Midnm"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oMidnm
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);		
		
/////// 영문 성
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NACHN"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oNachn = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Nachn", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Nachn"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oNachn
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// Known As
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RUFNM")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oRufnm = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Rufnm", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Rufnm"), //40,
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oRufnm
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 성별
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GESCH"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGesch1 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_32_Gesch1", {
			groupName : "Gesch",
			select : oController.changeModifyContent,
			text : oBundleText.getText("MALE")
		});
		var oGesch2 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_32_Gesch2", {
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
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

/////// 생일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GBDAT"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGbdat = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_32_Gbdat", {
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
		
/////// 국적
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NATIO_10"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oNatio = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Natio", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.displayCodeSearchDialog,
			enabled: !oController._DISABLED,
		}).addStyleClass("L2P13Font");
		oNatio.addCustomData(new sap.ui.core.CustomData({key : "Natio", value : ""}));
		oNatio.addCustomData(new sap.ui.core.CustomData({key : "Title", value : oBundleText.getText("NATIO_10")}));
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oNatio
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oPersonalLayout.addRow(oRow);		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
///// 신분증번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PERID_32"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oPerid = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Perid", {
			type : "Text",
			width : "95%",
			maxLength : 18,
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oPerid
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 결혼여부
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ZZFAMST"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oFamst = new sap.m.Select(oController.PAGEID + "_Sub01_Form_32_Famst", {
     	   width : "95%",
     	   enabled : !oController._DISABLED,
     	   change : oController.onChangeFamst
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oFamst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Famst")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oFamst
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oPersonalLayout.addRow(oRow);
		
/////////////////////////		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
///// Primary 휴대폰번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TELNO_10"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTelno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Telno", {
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
		
	/////// 전화번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("HNDNO_10")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);		
		
		var oHndno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Hndno", {
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
		
		oContactLayout.addRow(oRow);		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
///// 이메일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("EMAIL_10"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oEmail = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Email", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Email"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oEmail
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// Communication Language
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SPRSL"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSprsl = new sap.m.Select(oController.PAGEID + "_Sub01_Form_32_Sprsl", {
     	   width : "95%",
     	   enabled : !oController._DISABLED,
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oSprsl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Sprsl")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oSprsl
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);		
		
		oContactLayout.addRow(oRow);	
		
////////////////////////		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();	
		
/////// 상세주소 -> 상세주소 및 번지
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("STRAS_10"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oStras = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Stras", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Stras"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oStras
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 지역 -> 주
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("STATE_10"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oState = new sap.m.Select(oController.PAGEID + "_Sub01_Form_32_State", {
     	   width : "95%",
     	   change : oController.changeModifyContent,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oState
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oAddressLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 상세주소2 -> 상세주소 및 번지
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("LOCAT_10"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oLocat = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Locat", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Locat"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oLocat
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 우편번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PSTLZ_10"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oPstlz = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Pstlz", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Pstlz"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oPstlz
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);	
		
		oAddressLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 주소2 -> 시
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ORT01_10"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oOrt01 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Ort01", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Ort01"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oOrt01
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 주소-국가
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("LAND1_10"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oLand1 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Land1", {
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
		
		oAddressLayout.addRow(oRow);
		
/////////////////////////////////////////////
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//	    /////// 긴급주소 - 이름
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("EMECNAME2"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmecname2 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Emecname2", {
//			type : "Text",
//			width : "95%",
//			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Emecname2"),
//			liveChange : oController.changeModifyContent,
//			enabled : !oController._DISABLED
//		});
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oEmecname2
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		/////// 긴급주소 - 관계
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("EMECRELAT"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmecrelat = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Emecrelat", {
//			type : "Text",
//			width : "95%",
//			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Emecrelat"),
//			liveChange : oController.changeModifyContent,
//			enabled : !oController._DISABLED
//		});
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oEmecrelat
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oEmergencyLayout.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//	    /////// 긴급주소 - 전화번호
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("EMECTELNR"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmectelnr = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Emectelnr", {
//			type : "Text",
//			width : "38.6%",
//			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Emectelnr"),
//			liveChange : oController.changeModifyContent,
//			enabled : !oController._DISABLED
//		});
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			colSpan : 3,
//			content : oEmectelnr
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oEmergencyLayout.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		/////// 긴급주소 - 상세주소1
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("STRAS_10"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmecstras = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Emecstras", {
//			type : "Text",
//			width : "95%",
//			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Emecstras"),
//			liveChange : oController.changeModifyContent,
//			enabled : !oController._DISABLED
//		});
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oEmecstras
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		/////// 긴급주소 지역 -> 주
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("STATE_10"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmecstate = new sap.m.Select(oController.PAGEID + "_Sub01_Form_32_Emecstate", {
//     	   width : "95%",
//     	   change : oController.changeModifyContent,
//     	   enabled : !oController._DISABLED
//        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oEmecstate
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oEmergencyLayout.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		/////// 긴급주소 상세주소2 -> 상세주소 및 번지
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("LOCAT_10"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmeclocat = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Emeclocat", {
//			type : "Text",
//			width : "95%",
//			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Emeclocat"),
//			liveChange : oController.changeModifyContent,
//			enabled : !oController._DISABLED
//		});
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oEmeclocat
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		/////// 긴급주소 우편번호
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("PSTLZ_10"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmecpstlz = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Emecpsltz", {
//			type : "Text",
//			width : "95%",
//			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Emecpsltz"),
//			liveChange : oController.changeModifyContent,
//			enabled : !oController._DISABLED
//		});
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oEmecpstlz
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);	
//		
//		oEmergencyLayout.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		/////// 긴급주소 주소2 -> 시
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("ORT01_10"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmecort01 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Emecort01", {
//			type : "Text",
//			width : "95%",
//			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Emecort01"),
//			liveChange : oController.changeModifyContent,
//			enabled : !oController._DISABLED
//		});
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oEmecort01
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		/////// 긴급주소 주소-국가
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: oBundleText.getText("LAND1_10"), required : false}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		var oEmecland1 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_32_Emecland1", {
//			width : "95%",
//			showValueHelp: true,
//			valueHelpOnly: true,
//			valueHelpRequest: oController.onDisplaySearchNatioDialog,
//			enabled: !oController._DISABLED,
//			customData: new sap.ui.core.CustomData({key : "Emecland1", value : ""})
//		}).addStyleClass("L2P13Font");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oEmecland1
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow.addCell(oCell);		
//		
//		oEmergencyLayout.addRow(oRow);
		
		var oPersonalPanel = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"2rem"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Middle,
				vAlign : sap.ui.commons.layout.VAlign.Bottom,
				content : new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [new sap.m.Label({text : oBundleText.getText("TSUB01F"), design : "Bold"}).addStyleClass("L2P13Font"),
				               new sap.m.ToolbarSpacer() ,
				               new sap.m.Text({text : oBundleText.getText("REHIRE_NOTICE")}).addStyleClass("L2P13Font L2PFontColorLightRed L2P13FontBold")]
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PPaddingLeft1rem");
		oRow.addCell(oCell);
		oPersonalPanel.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Top,
				content : oPersonalLayout
		}).addStyleClass("L2PPaddingLeft05rem");
		oRow.addCell(oCell);
		oPersonalPanel.addRow(oRow);
		
		var oContactPanel = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"2rem"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Middle,
				vAlign : sap.ui.commons.layout.VAlign.Bottom,
				content : new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : new sap.m.Label({text : oBundleText.getText("TSUB01F_01"), design : "Bold"}).addStyleClass("L2P13Font")
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PPaddingLeft1rem");
		oRow.addCell(oCell);
		oContactPanel.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Top,
				content : oContactLayout
		}).addStyleClass("L2PPaddingLeft05rem");
		oRow.addCell(oCell);
		oContactPanel.addRow(oRow);
		
		var oAddressPanel = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"2rem"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Middle,
				vAlign : sap.ui.commons.layout.VAlign.Bottom,
				content : new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : new sap.m.Label({text : oBundleText.getText("TSUB01F_02"), design : "Bold"}).addStyleClass("L2P13Font")
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PPaddingLeft1rem");
		oRow.addCell(oCell);
		oAddressPanel.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Top,
				content : oAddressLayout
		}).addStyleClass("L2PPaddingLeft05rem");
		oRow.addCell(oCell);
		oAddressPanel.addRow(oRow);
		
//		var oEmergencyPanel = new sap.ui.commons.layout.MatrixLayout({
//			width : "100%",
//			layoutFixed : false,
//			columns : 1
//		});
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"2rem"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Middle,
//				vAlign : sap.ui.commons.layout.VAlign.Bottom,
//				content : new sap.m.Toolbar({
//					design : sap.m.ToolbarDesign.Auto,
//					content : new sap.m.Label({text : oBundleText.getText("TSUB01F_03"), design : "Bold"}).addStyleClass("L2P13Font")
//				}).addStyleClass("L2PToolbarNoBottomLine")
//		}).addStyleClass("L2PPaddingLeft1rem");
//		oRow.addCell(oCell);
//		oEmergencyPanel.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Top,
//				content : oEmergencyLayout
//		}).addStyleClass("L2PPaddingLeft05rem");
//		oRow.addCell(oCell);
//		oEmergencyPanel.addRow(oRow);
		
		var oLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oPersonalPanel,
			           oContactPanel,
			           oAddressPanel] //,			           oEmergencyPanel]
		}).addStyleClass("");
		oRow.addCell(oCell);
		
		oLayout.addRow(oRow);
		
		return oLayout;
	}

});