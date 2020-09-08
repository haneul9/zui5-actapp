sap.ui.jsview("zui5_hrxx_actapp.ActRecDocument", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp.ActRecDocument
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp.ActRecDocument";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp.ActRecDocument
	*/ 
	createContent : function(oController) {
        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
        
        var oCell = null, oRow = null;
		
		var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "인사영역", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_Persa", {
						width : "300px",
						change : oController.onChangePersa,
					}).addStyleClass("L2P13Font") //.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"))
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "기안부서", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new  sap.m.Select(oController.PAGEID + "_Orgeh", {
						width : "300px",
						change : oController.onChangeOrgeh,
					}).addStyleClass("L2P13Font") //.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"))
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		var oReqno = new sap.m.Input(oController.PAGEID + "_Reqno", {
			type : "Text",
			width : "300px",
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "품의번호", required : true, labelFor : oReqno}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oReqno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTitle = new sap.m.Input(oController.PAGEID + "_Title", {
			width : "300px",
			valueStateText : "Required Field",
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "품의서 제목", required : true, labelFor : oTitle}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oTitle
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		var oActda = new sap.m.DatePicker(oController.PAGEID + "_Actda", {
			width : "300px",
			value: dateFormat.format(curDate), 
			valueFormat : "yyyy-MM-dd",
        	displayFormat : gDtfmt,
        	change : oController.onChangeDate,
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "발령일", required : true, labelFor : oActda}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oActda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oUnote = new sap.m.Input(oController.PAGEID + "_Notes", {
			width : "90%",
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "Remarks"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oUnote
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		
		var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "발령품의", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_Save_Btn",{
				        	   text: "저장", 
				        	   icon : "sap-icon://save", 
				        	   press : oController.onPressSave
				           })]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		});
		
		var oListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "발령대상자", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width : "15px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/Apply.png"}),
				           new sap.m.Label({text : "완료"}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/Error.png"}),
				           new sap.m.Label({text : "오류"}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/Lock.png"}),
				           new sap.m.Label({text : "잠금"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_Add_Rec_Btn",{text: "입사자정보등록", icon : "sap-icon://add-contact", press : oController.addRecPerson, visible : false}),
				           new sap.m.Button(oController.PAGEID + "_Mod_Rec_Btn",{text: "입사자정보수정", icon : "sap-icon://edit", press : oController.modifyRecPerson, visible : false}),
				           new sap.m.Button(oController.PAGEID + "_View_Rec_Btn",{text: "입사자정보조회", icon : "sap-icon://personnel-view", press : oController.viewRecPerson, visible : false}),
				           new sap.m.Button(oController.PAGEID + "_Add_Btn",{text: "발령내역등록", icon : "sap-icon://add", press : oController.addPerson, visible : false}),
				           new sap.m.Button(oController.PAGEID + "_Mod_Btn",{text: "발령내역수정", icon : "sap-icon://edit", press : oController.modifyPerson, visible : false}),
				           new sap.m.Button(oController.PAGEID + "_Del_Btn",{text: "발령내역삭제", icon : "sap-icon://delete", press : oController.deletePerson, visible : false})]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActtionSubjectList", oController)]
		});
		
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentLeft : [
			               new sap.m.Button(oController.PAGEID + "_Excel_Btn",{
			            	   text: "엑셀다운로드", 
			            	   visible : false,
			            	   press : oController.downloadExcel})
			              ],
			contentRight : [         
			                new sap.m.Button(oController.PAGEID + "_UPLOAD_BTN", {
		 	                	text : "발령대상자 Upload",
		 	                	press : oController.onPressUpload
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_REQUEST_BTN", {
		 	                	text : "결재상신",
		 	                 	press : oController.onPressRequest
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
				             	text : "발령확정",
				             	press : oController.onPressComplete
				            }),
		 	                new sap.m.Button(oController.PAGEID + "_REQUESTDELETE_BTN", {
		 	                	text : "품의삭제",
		 	                	press : oController.onPressDelete
		 	                })
		 	                ]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text({
									   			text : "채용 발령품의서 등록"
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