jQuery.sap.require("control.ODataFileUploader");

sap.ui.jsview("zui5_hrxx_actapp2.ActAppRetireUpload", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp2.ActAppRetireUpload
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActAppRetireUpload";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp2.ActAppRetireUpload
	*/ 
	createContent : function(oController) {
		
		var icon1 = "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/OK.png";
		var icon2 = "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/No-entry.png";
		
		var oCell1, oRow1;
		
		var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		}); 
		
		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : "퇴직사유"})]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow1.addCell(oCell1);
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [
			           new sap.m.Input(oController.PAGEID + "_Massg", {
			        	   width : "95%",
			        	   enabled : true,
			        	   showValueHelp: true,
			   			   valueHelpOnly: true,
			   			   valueHelpRequest: oController.onDisplaySearchRetrsDialog,
			   			   customData: new sap.ui.core.CustomData({key : "Massg", value : ""})
			           })
			           ]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow1.addCell(oCell1);
		
		oIssuedTypeMatrix.addRow(oRow1);
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID+"_EXCEL_UPLOAD_BTN",{
			name : "UploadFile",
			slug : "",
			maximumFileSize: 1,
			multiple : false,
			uploadOnChange: false,
			mimeType: [],
			fileType: ["xls","xlsx"],
			buttonText : "엑셀업로드",
			width : "150px",
		    icon : "sap-icon://upload",
			buttonOnly : true,
			change : oController.changeFile
		}).addStyleClass("L2PPaddingLeft1rem");
		
		var oButtonBar1 = new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.m.ToolbarSpacer(),
			           new sap.m.Button(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN",{
			        	    icon : "sap-icon://download",
			        	    type : "Transparent",
	 	                	text : "엑셀다운로드",
	 	                	press : oController.onPressDownload
	 	               }),
	 	               oFileUploader,
			           new sap.m.ToolbarSpacer({width: "10px"})
			           ]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oSwitchBar1 = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_UploadNoticeBar1", {
			width : "100%",
			layoutFixed : true,
			columns : 2,
			widths: ["75%","25%"],
		}); 
		
		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text : "! With the columns of yellow (with red letters), please enter the code values. As for the rest, please enter the text value."}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow1.addCell(oCell1);
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			rowSpan : 3,
			content : [oButtonBar1]
		}).addStyleClass("L2PPaddingLeft10");
		oRow1.addCell(oCell1);
		
		oSwitchBar1.addRow(oRow1);
		
		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text : "! If you don’t enter any values in the columns of data, previous values will automatically be defaulted when hit save."}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow1.addCell(oCell1);
		
		oSwitchBar1.addRow(oRow1);
		
		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text : "! Please enter # for blank value."}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow1.addCell(oCell1);
		
		oSwitchBar1.addRow(oRow1);
		
		var oActTypeReasonPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : "퇴직사유", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
						   new sap.m.ToolbarSpacer({width : "10px"}),]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedTypeMatrix]
		});
		
		var oListTable = new sap.ui.table.Table(oController.PAGEID + "_TABLE", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 40,
//			rowHeight : 48,
			visibleRowCount : 14,
			selectionMode : sap.ui.table.SelectionMode.None
		});
		
		var oActdHistoryPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : "발령대상자", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width: "5px"}),
				           new sap.m.Label({text : "("}).addStyleClass("L2P13Font L2PLabelMinWidth"),
				           new sap.m.Image({src : icon1, height: "16px", width : "16px"}),
				           new sap.m.Label({text : "Ready,"}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : icon2, height: "16px", width : "16px"}),
				           new sap.m.Label({text : "Error, * " + "필수입력" + " )"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Label({text : "Mass upload template", visible : true}).addStyleClass("L2P13Font"),
				           new sap.m.Switch(oController.PAGEID + "_Input_Switch", {visible : true, enabled : false, change : oController.onChangeSwitch}),
				           new sap.m.ToolbarSpacer({width: "10px"}),				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oSwitchBar1, oListTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ oActTypeReasonPanel, oActdHistoryPanel]
		});
		
		var oFooterBar = new sap.m.Bar({
		 	contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
		 	                	text : "저장",
		 	                	press : oController.onPressSave
		 	                }),
		 	                new sap.m.Button({
		 	                	text : "취소",
		 	                	press : oController.navToBack
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
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
									   			text : "발령대상자 Upload"
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}).addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});