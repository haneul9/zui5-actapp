jQuery.sap.require("control.ODataFileUploader");

sap.ui.jsview("zui5_hrxx_actapp2.ActAppUpload", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp2.ActAppUpload
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActAppUpload";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp2.ActAppUpload
	*/ 
	createContent : function(oController) {
		
		var icon1 = "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/OK.png";
		var icon2 = "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/No-entry.png";
		
		var oCell1, oRow1;
		var vMASSN = ["1st 발령유형","2nd 발령유형","3rd 발령유형","4th 발령유형","5th 발령유형"];
		var vMASSG = ["1st 발령사유","2nd 발령사유","3rd 발령사유","4th 발령사유","5th 발령사유"];
		
		var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		}); 
		
		var oIssuedTypeMatrix2 = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_IssuedTypeMatrix2",{
			width : "100%",
			layoutFixed : true,
			columns : 4,
			visible : false,
			widths: ["15%","35%","15%","35%"],
		});
		
		for(var i=0; i<1; i++) {
			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSN[i]}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massn" + (i+1), {
				        	   width : "95%",
				        	   change : oController.onChangeMassn
				           })
				           ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSG[i]}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massg" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassg
				           })
				           ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oIssuedTypeMatrix.addRow(oRow1);
		}
		
		for(var i=1; i<5; i++) {
			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSN[i]})]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massn" + (i+1), {
				        	   width : "95%",
				        	   change : oController.onChangeMassn
				           })
				           ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSG[i]})]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massg" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassg
				           })
				           ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oIssuedTypeMatrix2.addRow(oRow1);
		}
		
		var oActTypeReasonPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
						   new sap.ui.core.Icon({src: "sap-icon://open-command-field", 
								 size : "1.0rem" ,}),       
						   new sap.m.Label({text : "발령유형/사유"}).addStyleClass("L2PFontFamilyBold"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Label({text : "추가발령", visible : true}).addStyleClass("L2PFontFamily"),
				           new sap.m.Switch(oController.PAGEID + "_Reason_Switch", {visible : true, enabled : true, state : false, change : oController.onChangeReasonSwitch}),
				           new sap.m.ToolbarSpacer({width: "10px"}),	
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedTypeMatrix,
			           oIssuedTypeMatrix2]
		});
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID+"_EXCEL_UPLOAD_BTN",{
			name : "UploadFile",
			slug : "",
			maximumFileSize: 1,
			multiple : false,
			uploadOnChange: false,
			mimeType: [],
			fileType: ["csv","xls","xlsx"],
			buttonText : "엑셀업로드",
			width : "150px",
		    icon : "sap-icon://upload",
			buttonOnly : true,
			change : oController.changeFile
		}).addStyleClass("L2PPaddingLeft1rem");
		
		var oButtonBar1 = new sap.m.Panel({
			visible : true,
			expandable : false,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
		                   new sap.m.ToolbarSpacer(),
		                   new sap.m.Button(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN",{
				        	    icon : "sap-icon://download",
				        	    width : "200px",
				        	    text : "업로드 양식 다운로드",
		 	                	press : oController.onPressDownload
		 	               }),
		                   oFileUploader,
		                   ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		});
		
		
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
			content : [new sap.m.Text({text : "모든 열에는 텍스트 값을 입력합니다."}).addStyleClass("L2PFontFamily")]
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
			content : [new sap.m.Text({text : "열에 아무것도 넣지 않으면 저장시 이전 값을 자동으로 가지고 옵니다."}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow1.addCell(oCell1);
		
		oSwitchBar1.addRow(oRow1);
		
		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text : "공백 값을 입력하려면 특수기호 #을 입력해 주시기 바랍니다."}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow1.addCell(oCell1);
		
		oSwitchBar1.addRow(oRow1);
		
		var oListTable = new sap.ui.table.Table(oController.PAGEID + "_TABLE", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
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
				content : [new sap.ui.core.Icon({src: "sap-icon://open-command-field", 
								 size : "1.0rem" ,}),       
						   new sap.m.Label({text : "발령대상자"}).addStyleClass("L2PFontFamilyBold"),
				           new sap.m.ToolbarSpacer({width: "5px"}),
				           new sap.m.Label({text : "("}).addStyleClass("L2PFontFamily L2PLabelMinWidth"),
				           new sap.m.Image({src : icon1, height: "16px", width : "16px"}),
				           new sap.m.Label({text : "Ready" + ","}).addStyleClass("L2PFontFamily"),
				           new sap.m.Image({src : icon2, height: "16px", width : "16px"}),
				           new sap.m.Label({text : "Error" + ", * " + "필수입력" + " )"}).addStyleClass("L2PFontFamily"),
				           new sap.m.ToolbarSpacer(), //
				           new sap.m.Label({text : "Mass upload template", visible : true}).addStyleClass("L2PFontFamily"),
				           new sap.m.Switch(oController.PAGEID + "_Input_Switch", {visible : true, enabled : false, change : oController.onChangeSwitch}),
				           new sap.m.ToolbarSpacer({width: "10px"}),				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oSwitchBar1, oListTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:15px;'> </div>",	preferDOM : false}),
				       oActTypeReasonPanel, 
				       oActdHistoryPanel]
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
								}).addStyleClass("TitleFont"),
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