sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub01_Form_18", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub01_Form_18
	*/
	 
	createContent : function(oController) {
        var oCell = null, oRow = null;
        
        var oPersonalLayout = new sap.ui.commons.layout.MatrixLayout({
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
        
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
	/////// 영문 이름
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("VORNA"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oVorna = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Vorna", {
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
		
/////// 영문 성
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NACHN"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oNachn = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Nachn", {
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
		
	/////// Birth Name
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NAME2_18")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oName2 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Name2", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Name2"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oName2
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
	/////// 생일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GBDAT"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGbdat = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_18_Gbdat", {
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
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// Birth ID
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PERID_18"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oPerid = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Perid", {
			type : "Number",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Perid"),
			liveChange : oController.checkNumber,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oPerid
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 성별
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GESCH"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGesch1 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_18_Gesch1", {
			groupName : "Gesch",
			select : oController.changeModifyContent,
			text : oBundleText.getText("MALE")
		});
		var oGesch2 = new sap.m.RadioButton(oController.PAGEID + "_Sub01_Form_18_Gesch2", {
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
		
	/////// Academic title 1
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TITEL")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTitel = new sap.m.Select(oController.PAGEID + "_Sub01_Form_18_Titel", {
     	    width : "95%",
     	    change : oController.changeModifyContent,
     	    enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font"); //.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		//oTitel.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Anred")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oTitel
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
	/////// Academic title 2
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TITL2")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTitl2 = new sap.m.Select(oController.PAGEID + "_Sub01_Form_18_Titl2", {
     	    width : "95%",
     	    change : oController.changeModifyContent,
     	    enabled : !oController._DISABLED
        }).addStyleClass("L2P13Font"); //.setModel(sap.ui.getCore().getModel("EmpCodeList"));
		//oTitl2.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Anred")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oTitl2
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
	/////// Country of Birth
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GBLND"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGblnd = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Gblnd", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchNatioDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({key : "Gblnd", value : ""})
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oGblnd
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 국적
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("NATIO_10"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oNatio = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Natio", {
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
		
		oPersonalLayout.addRow(oRow);		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
	/////// Region of Birth
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GBDEP")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGbdep = new sap.m.Select(oController.PAGEID + "_Sub01_Form_18_Gbdep", {
	     	   width : "95%",
	     	   enabled : !oController._DISABLED,
	     	  change : oController.changeModifyContent,
	    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oGbdep
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);			
		
/////// 결혼여부
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ZZFAMST"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oFamst = new sap.m.Select(oController.PAGEID + "_Sub01_Form_18_Famst", {
     	   width : "50%",
     	   enabled : !oController._DISABLED,
     	   change : oController.onChangeFamst
        }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oFamst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Famst")]);
		
		var oFamdt = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_18_Famdt", {
			width : "50%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	change : oController.changeModifyDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oFamst
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

		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();		
		
	/////// Place of Birth
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("GBORT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oGbort = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Gbort", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Gbort"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oGbort
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
	/////// Number of Children's
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ANZKD")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oAnzkd = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Anzkd", {
			type : "Number",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Anzkd"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oAnzkd
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();		
		
///// 이메일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("EMAIL_18"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oEmail = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Email", {
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
		
	///// Personal Phone Number
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TELNO_18"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTelno = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Telno", {
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
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();		
		
/////// Pay slip Email
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("EMAILPS"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oEmail2 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Email2", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Email2"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oEmail2
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);	
		
	/////// Health Insurance
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("KVSFR"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oKvsfr = new sap.m.Select(oController.PAGEID + "_Sub01_Form_18_Kvsfr", {
	     	   width : "95%",
	     	   enabled : !oController._DISABLED,
	     	  change : oController.changeModifyContent,
	    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oKvsfr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Kvsfr")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oKvsfr
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();	
		
	/////// National ID
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ICNUM_18"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oIcnum = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Icnum", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Icnum"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oIcnum
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);	
		
	/////// Social Insurance
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RVKZ1"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oRvkz1 = new sap.m.Select(oController.PAGEID + "_Sub01_Form_18_Rvkz1", {
	     	   width : "95%",
	     	   enabled : !oController._DISABLED,
	     	  change : oController.changeModifyContent,
	    }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oRvkz1.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Rvkz1")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oRvkz1
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
	/////// ID Issued by
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("AUTH1"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oAuth1 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Auth1", {
			type : "Text",
			width : "95%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Auth1"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oAuth1
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);	
		
	/////// ID Valid to
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("EXPID"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oExpid = new sap.m.DatePicker(oController.PAGEID + "_Sub01_Form_18_Expid", {
			width : "95%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	change : oController.changeModifyDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oExpid
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oPersonalLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();	
		
////////////////////////		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();	
		
/////// 상세주소 -> 상세주소 및 번지
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "Street/H.num/Or.num", required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oStras = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Stras", {
			type : "Text",
			width : "45%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Stras"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		var oHsnmr = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Hsnmr", {
			type : "Text",
			width : "25%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Hsnmr"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		var oPosta = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Posta", {
			type : "Text",
			width : "25%",
			maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Posta"),
			liveChange : oController.changeModifyContent,
			enabled : !oController._DISABLED
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : oStras
			content : new sap.m.Toolbar({
				width : "95%",
				content : [
				           oStras,
				           new sap.m.Label({text : " / "}),
				           oHsnmr,
				           new sap.m.Label({text : " / "}),
				           oPosta
				          ]
			   }).addStyleClass("L2PToolbarNoBottomLine") 
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 지역 -> 주
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "Region", required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oState = new sap.m.Select(oController.PAGEID + "_Sub01_Form_18_State", {
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
			content : [new sap.m.Label({text: "Address supplement", required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oLocat = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Locat", {
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
			content : [new sap.m.Label({text: oBundleText.getText("PSTLZ_10"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oPstlz = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Pstlz", {
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
			content : [new sap.m.Label({text: oBundleText.getText("ORT01_10"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oOrt01 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Ort01", {
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
			content : [new sap.m.Label({text: oBundleText.getText("LAND1_10"), required : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oLand1 = new sap.m.Input(oController.PAGEID + "_Sub01_Form_18_Land1", {
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
			           oAddressPanel]
		}).addStyleClass("");
		oRow.addCell(oCell);
		
		oLayout.addRow(oRow);
		
		return oLayout;
	}

});