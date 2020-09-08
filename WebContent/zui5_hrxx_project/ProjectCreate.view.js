sap.ui.jsview("zui5_hrxx_project.ProjectCreate", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.CreateView
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_project.ProjectCreate";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.CreateView
	*/ 
	createContent : function(oController) {
		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
        
        var oCell = null, oRow = null;
        
        var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths : ["15%", "35%", "15%", "35%"]
		});
        
        // 첫번째 Row
        oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_0", {}).addStyleClass("L2PMatrixRow L2PMatrixRowTop");
	        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PBTXT"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				colSpan : 3,
				content : new sap.m.Select(oController.PAGEID + "_Werks", {
					change : oController.onChangeWerks,
					customData : new sap.ui.core.CustomData({key : "Pjtrg", value : ""})
				}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
        oMatrix.addRow(oRow);
        
        // 두번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_1", {}).addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTNM"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Input(oController.PAGEID + "_Pjtnm", {
					width : "100%"
				}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTID")}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label(oController.PAGEID + "_Pjtid", {
					width : "100%"
				})
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		// 세번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_2", {}).addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("FROMTO"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Toolbar({
					width : "100%",
					design : sap.m.ToolbarDesign.Auto,
					content : [
					           new sap.m.DatePicker(oController.PAGEID + "_Pjtbd", {
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
									width : "45%",
									change : oController.onChangePjtbd
							   }).addStyleClass("L2P13Font"),
							   new sap.m.Label({text:"~", width:"10%", textAlign:"Center"}),
							   new sap.m.DatePicker(oController.PAGEID + "_Pjted", {
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
									width : "45%",
									change : oController.onChangeDate
							   }).addStyleClass("L2P13Font")
							   ]
				}).addStyleClass("L2PToolbarNoBottomLine")
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTPD"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           	new sap.m.Select(oController.PAGEID + "_Pjtpd", {
								width : "100%"
							}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList")),
							new sap.m.Label(oController.PAGEID + "_Pjtpdx", {
								width : "100%",
								textAlign : "Right"
							}).addStyleClass("L2P13Font")
						]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		// 네번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_3", {}).addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTTY"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           	new sap.m.Select(oController.PAGEID + "_Pjtty", {
				           		change : oController.onChangePjtty,
								width : "100%"
							}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList")),
							new sap.m.Label(oController.PAGEID + "_Pjttyx", {
								width : "100%",
								textAlign : "Right"
							}).addStyleClass("L2P13Font")
						 ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				colSpan : 2
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		// 다섯번째 Row
        oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_4").addStyleClass("L2PDisplayNone").addStyleClass("L2PMatrixRow");
	        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("CTTYP4")}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           	new sap.m.Select(oController.PAGEID + "_Pjtct", {
								width : "100%"
							}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList")),
							new sap.m.Label(oController.PAGEID + "_Pjtctx", {
								width : "100%",
								textAlign : "Right"
							}).addStyleClass("L2P13Font")
						]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("SLAND"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           	new sap.m.Input(oController.PAGEID + "_Pjtcy", {
								width : "100%",
								customData : new sap.ui.core.CustomData({key : "Pjtcy", value : ""}),
								showValueHelp: true,
								valueHelpOnly: true,
								valueHelpRequest: oController.onDisplaySearchPjtcyDialog,
							}).addStyleClass("L2P13Font"),
							new sap.m.Label(oController.PAGEID + "_Pjtcyx", {
								width : "100%",
								textAlign : "Right"
							}).addStyleClass("L2P13Font")
						]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
        oMatrix.addRow(oRow);
		
		// 여섯번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_5", {}).addStyleClass("L2PDisplayNone").addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTAM")}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Toolbar({
					width : "100%",
					design : sap.m.ToolbarDesign.Auto,
					content : [
					           new sap.m.Input(oController.PAGEID + "_Pjtam", {
									width : "70%",
									textAlign : "Right"
							   }).addStyleClass("L2P13Font")
							   .attachBrowserEvent("keypress",oController.onNumberKeypress)
							   .attachBrowserEvent("keyup",oController.onNumberKeyup),
							   new sap.m.ToolbarSpacer(),
//							   new sap.m.Select(oController.PAGEID + "_Pjtck", {
//									width : "30%"
//							   }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"))
							   new sap.m.Input(oController.PAGEID + "_Pjtck", {
									width: "30%",
									showValueHelp : true,
									valueHelpOnly : true,
									valueHelpRequest: oController.onDisplaySearchEmpCodeDialog,
									customData: [{key:"id",value:"PJTCK"},
									             {key:"label",value:oBundleText.getText("WAERS")}]
								}).addStyleClass("L2P13Font")
							   ]
				}).addStyleClass("L2PToolbarNoBottomLine")
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTCU"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           	new sap.m.Input(oController.PAGEID + "_Pjtcu", {
								width : "100%",
								customData : new sap.ui.core.CustomData({key : "Pjtcu", value : ""}),
								showValueHelp: true,
								valueHelpOnly: true,
								valueHelpRequest: oController.onDisplaySearchPjtcuDialog,
							}).addStyleClass("L2P13Font"),
							new sap.m.Label(oController.PAGEID + "_Pjtcux", {
								width : "100%",
								textAlign : "Right"
							}).addStyleClass("L2P13Font")
						]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		// 일곱번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_6", {}).addStyleClass("L2PDisplayNone").addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTSZ")}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           	new sap.m.Toolbar({
								width : "100%",
								design : sap.m.ToolbarDesign.Auto,
								content : [
								           new sap.m.Input(oController.PAGEID + "_Pjtsz", {
												width : "70%",
												textAlign : "Right"
										   }).addStyleClass("L2P13Font")
								           .attachBrowserEvent("keypress",oController.onNumberKeypress)
										   .attachBrowserEvent("keyup",oController.onNumberKeyup),
										   new sap.m.ToolbarSpacer(),
//										   new sap.m.Select(oController.PAGEID + "_Pjtun", {
//												width : "30%"
//										   }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"))
										   new sap.m.Input(oController.PAGEID + "_Pjtun", {
												width: "30%",
												showValueHelp : true,
												valueHelpOnly : true,
												valueHelpRequest: oController.onDisplaySearchEmpCodeDialog,
												customData: [{key:"id",value:"PJTUN"},
												             {key:"label",value:oBundleText.getText("PJTUN")}]
											}).addStyleClass("L2P13Font")
										   ]
							}).addStyleClass("L2PToolbarNoBottomLine"),
							new sap.m.Label(oController.PAGEID + "_Pjtunx", {
								width : "100%",
								textAlign : "Right"
							}).addStyleClass("L2P13Font")
						]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				colSpan : 2
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		// 여덟번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_7", {}).addStyleClass("L2PDisplayNone").addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTMA"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Select(oController.PAGEID + "_Pjtma", {
					width : "100%"
				}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"))
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTMC"), required : true}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Input(oController.PAGEID + "_Pjtmc", {
					width : "100%"
				}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		// 아홉번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"80px"}).addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTDS")}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				colSpan : 3,
				content : new sap.m.TextArea(oController.PAGEID + "_Pjtds", {
					width : "100%",
					rows : 3,
					maxLength : 60
				}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		// 열번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({}).addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : new sap.m.Label({text: oBundleText.getText("PJTRG") + " / " + oBundleText.getText("PJTRD")}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				colSpan : 3,
				content : new sap.m.Label(oController.PAGEID + "_Unametx", {
					width : "100%"
				})
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
			oRow.addCell(oCell);		
		oMatrix.addRow(oRow);
        
		// 열한번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({}).addStyleClass("L2PMatrixRow");
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				colSpan : 4,
				content : new sap.m.Label({text: oBundleText.getText("MSG_REQUIRED")}).addStyleClass("L2P13Font")
			}).addStyleClass("L2PPaddingLeft10");
			oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("PROJECT"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oMatrix]
		});
	
//		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
//			width : "100%",
//			content : [ oMatrix
//			           ]
//		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [
			                new sap.m.Button(oController.PAGEID + "_CONFIRM_BTN", {
				             	text : oBundleText.getText( "PROJECT_STATUS_C"),
				             	press : oController.onConfirm
				            }),
				            new sap.m.Button(oController.PAGEID + "_REQUEST_BTN", {
				             	text : oBundleText.getText( "PROJECT_STATUS_R"),
				             	press : oController.onRequest
				            })
			                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oPanel],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_PROJECT_CREATE")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	
	}
});