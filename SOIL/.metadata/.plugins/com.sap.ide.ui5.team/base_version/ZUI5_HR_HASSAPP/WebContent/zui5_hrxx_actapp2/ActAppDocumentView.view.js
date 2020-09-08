sap.ui.jsview("zui5_hrxx_actapp2.ActAppDocumentView", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.CreateView
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActAppDocumentView";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.CreateView
	*/ 
	createContent : function(oController) {
		jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

        var oProcessFlow = new sap.suite.ui.commons.ProcessFlow(oController.PAGEID + "_ProcessFlow", {
        	foldedCorners : true,
        	scrollable : false,
        	wheelZoomable : false
        }); 
        
        var oPFLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_PFLAYOUT",  {
        	width : "100%",
        	content : [oProcessFlow]
        });
        
        var oStatusPanel = new sap.m.Panel(oController.PAGEID + "_StatusPanel", {
			expandable : true,
			expanded : false,
//			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://shipping-status", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label(oController.PAGEID + "_StatusPanel_Title", {text : "진행상태"}).addStyleClass("L2PFontFamilyBold"),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oPFLayout]
		});
        
        var oCell = null, oRow = null;
		
		var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "회사명"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Persa", {
						width : "95%"
					}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "품의부서"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new  sap.m.Text(oController.PAGEID + "_Orgeh", {
						width : "95%"
					}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
		
		var oReqno = new sap.m.Text(oController.PAGEID + "_Reqno", {
			width : "95%",
		}).addStyleClass("L2PFontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "게시번호"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oReqno
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTitle = new sap.m.Text(oController.PAGEID + "_Title", {
			width : "95%",
		}).addStyleClass("L2PFontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "품의서 제목"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oTitle
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
		
		var oActda = new sap.m.Text(oController.PAGEID + "_Actda", {
			width : "95%",
		}).addStyleClass("L2PFontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "발령일"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oActda
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oUnote = new sap.m.Text(oController.PAGEID + "_Notes", {
			width : "95%",
		}).addStyleClass("L2PFontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "Remarks"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oUnote
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);

		
		var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [	new sap.ui.core.Icon({src: "sap-icon://open-command-field", 
							size : "1.0rem" ,}),
				           new sap.m.Label({text : "발령품의" }).addStyleClass("L2PFontFamilyBold"),
				           new sap.m.ToolbarSpacer(),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		});
				
        var oSubjectList = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_SubjectList", {
        	width : "100%",
		}).addStyleClass("L2PGRID");
        
        oSubjectList.addDelegate({
			onAfterRendering: function() {
//				oController.onAfterRenderingTable(oController);
//				zui5_hrxx_actapp2.common.Common.onAfterRenderingTable(oController);
			}
		});
		
		
		var oListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
						  new sap.ui.core.Icon({src: "sap-icon://open-command-field", 
								 size : "1.0rem" ,}),
				           new sap.m.Label({text : "발령대상자"}).addStyleClass("L2PFontFamilyBold"),
				           new sap.m.ToolbarSpacer({width : "15px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.jpg" , width : "15px"}),
				           new sap.m.Label({text : "완료"}).addStyleClass("L2PFontFamily"),
				           new sap.m.ToolbarSpacer({width : "10px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.jpg"  , width : "15px"}),
				           new sap.m.Label({text : "오류"}).addStyleClass("L2PFontFamily"),
				           new sap.m.ToolbarSpacer({width : "10px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.jpg"  , width : "15px" }),
				           new sap.m.Label({text : "잠금"}).addStyleClass("L2PFontFamily"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_View_Rec_Btn",{text: "입사자정보조회", icon : "sap-icon://personnel-view", press : oController.viewRecPerson, visible : false}),
				           new sap.m.Button(oController.PAGEID + "_Add_Btn",{text: "엑셀다운로드", icon : "sap-icon://excel-attachment", press : oController.downloadExcel}),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oSubjectList]
//			content : [sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActtionSubjectList", oController)]
		});	
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:15px'> </div>",	preferDOM : false}),
			            oStatusPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentLeft : [new sap.m.Button(oController.PAGEID + "_STATUS_BTN", {
				             	text : "상태변경",
				              	press : oController.onChangeStatus
				           })
						   ],
			contentRight : [
			                new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
				             	text : "발령확정",
				             	press : oController.onPressCompelte
				            }),
				            new sap.m.Button(oController.PAGEID + "_ANNOUNCE_BTN", {
				             	text : "발령게시",
				             	press : oController.onPressAnnounce
				            }),
				            new sap.m.Button(oController.PAGEID + "_SENDMAIL_BTN", {
				             	text : "메일발송",
				             	press : oController.onPressSendEmail
				            })
				            ]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
//								contentLeft : new sap.m.Button({
//												icon : "sap-icon://nav-back" ,
//												press: oController.navToBack
//											}),
								contentLeft : new sap.m.Button({type : "Back", press : oController.navToBack}),
								contentMiddle : new sap.m.Text({
									   			text : "발령품의서 상세보기"
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeader L2pHeaderPadding") ,
			footer : oFooterBar 
		}).addStyleClass("WhiteBackground") ;
		return oPage ;
	
	}
});