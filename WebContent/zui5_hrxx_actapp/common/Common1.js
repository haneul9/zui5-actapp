jQuery.sap.declare("zui5_hrxx_actapp.common.Common");

jQuery.sap.require("sap.ui.commons.layout.HorizontalLayout");
jQuery.sap.require("sap.ui.commons.layout.VerticalLayout");
jQuery.sap.require("sap.suite.ui.commons.BusinessCard");

zui5_hrxx_actapp.common.Common = {
		
		/** 
		* @memberOf zui5_hrxx_actapp.common.Common
		*/
	
	onAfterOpenDetailViewPopover : function(oController) {
        var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var filterString = "/?$filter=Reqno%20eq%20%27" + encodeURIComponent(oController._vSelected_Reqno) + "%27";
		filterString += "%20and%20Docno%20eq%20%27" + oController._vSelected_Docno + "%27";
		filterString += "%20and%20Pernr%20eq%20%27" + oController._vSelected_Pernr + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + dateFormat1.format(new Date(oController._vSelected_Actda)) + "T00%3a00%3a00%27";
		
		var vAfterData = {};
		var vBeforeData = {};
		var vDisplayControl = [];
		try {
			oModel.read("/ActionSubjectListSet"  + filterString, 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							vAfterData = oData.results[0];
							vBeforeData = oData.results[1];
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			
//			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vSelected_Docno) + "%27", 
//					null, 
//					null, 
//					false, 
//					function(oData, oResponse) {					
//						if(oData.results && oData.results.length) {
//							for(var i=0; i<oData.results.length; i++) {
//								vDisplayControl.push(oData.results[i]);
//							}
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
		} catch(ex) {
			common.Common.log(ex);
		}
		console.log("Data : " + vBeforeData.Gps + ", " + vBeforeData.Zzempwp_Tx + ", " +  vAfterData.Gps + ", " +  vAfterData.Zzempwp_Tx);
		common.GoogleMap.setMap(vBeforeData.Gps, vBeforeData.Zzempwp_Tx, vAfterData.Gps, vAfterData.Zzempwp_Tx);
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Actda");
		oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));
		
		var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_IssuedTyp");
		oIssuedTypeMatrix.removeAllRows();
		
		var oCell, oRow;
		
		var vMassLabels = ["1st 발령유형 / 사유","2nd 발령유형 / 사유","3rd 발령유형 / 사유","4th 발령유형 / 사유","5th 발령유형 / 사유",];
		
		for(var i=0; i<vMassLabels.length; i++) {
			var vMntxt = eval("vAfterData.Mntxt" + (i+1));
			var vMgtxt = eval("vAfterData.Mgtxt" + (i+1));
			
			var vMassn = eval("vAfterData.Massn" + (i+1));
			var vMassg = eval("vAfterData.Massg" + (i+1));
			
			if(vMassn != "" && vMassg != "") {
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [new sap.m.Label({text : vMassLabels[i]}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : new sap.m.Text({text : vMntxt + " / " + vMgtxt}).addStyleClass("L2P13Font")
				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
				oRow.addCell(oCell);
				
				oIssuedTypeMatrix.addRow(oRow);
			}
		}
		
		var filterString = "/?$filter=Docno%20eq%20%27" + oController._vDocno + "%27";
//		filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
//		filterString += "%20and%20Massn%20eq%20%27" + vMassn + "%27";
//		filterString += "%20and%20Massg%20eq%20%27" + vMassg + "%27";
		
		oModel.read("/ActionDisplayFieldSet"  + filterString, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var isExists = false;
							if(vDisplayControl) {
								for(var j=0; j<vDisplayControl.length; j++) {
									if(vDisplayControl[j].Fieldname == oData.results[i].Fieldname) {
										isExists = true;
										break;
									}
								}
							}
							
							if(isExists == false) {
								vDisplayControl.push(oData.results[i]);
							}
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		var oCell = null, oRow = null;
		
		var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_AD_MatrixLayout");
		if(oMatrixLayout) {
			oMatrixLayout.removeAllRows();
			oMatrixLayout.destroyRows();
		}
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : oBundleText.getText("ACTITEMS")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : oBundleText.getText("BACTDATAS")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : oBundleText.getText("AACTDATAS")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oMatrixLayout.addRow(oRow);
		
		for(var i=0; i<vDisplayControl.length; i++) {
			var Fieldname = vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			var ChangeFieldname = Fieldname + "C";
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : oBundleText.getText(vDisplayControl[i].Fieldname)}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow.addCell(oCell);
			
			var oAfterControl = new sap.m.Text().addStyleClass("L2P13Font");
			var oBeforeControl = new sap.m.Text().addStyleClass("L2P13Font");
			
			eval("oAfterControl.setText(vAfterData." + TextFieldname + ");" );
			eval("oBeforeControl.setText(vBeforeData." + TextFieldname + ");" );
			
			var vTmp = eval("vAfterData." + ChangeFieldname);
			if(vTmp == "X") {
				oAfterControl.addStyleClass("L2PFontColorBlue L2P13FontBold");
			}
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : oBeforeControl
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : oAfterControl
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			oMatrixLayout.addRow(oRow);
		}
	},
	
	onAfterOpenRecDetailViewPopover : function(oController) {
        var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var filterString = "/?$filter=Reqno%20eq%20%27" + encodeURIComponent(oController._vSelected_Reqno) + "%27";
		filterString += "%20and%20Docno%20eq%20%27" + oController._vSelected_Docno + "%27";
		filterString += "%20and%20Pernr%20eq%20%27" + oController._vSelected_Pernr + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + dateFormat1.format(new Date(oController._vSelected_Actda)) + "T00%3a00%3a00%27";
		
		var vAfterData = {};
		var vBeforeData = {};
		var vDisplayControl = [];
		try {
			oModel.read("/ActionSubjectListSet"  + filterString, 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							vAfterData = oData.results[0];
							//vBeforeData = oData.results[1];
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vSelected_Docno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vDisplayControl.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
		console.log("Data : " + vAfterData.Gps + ", " +  vAfterData.Zzempwp_Tx);
		common.GoogleMap.setMap(vAfterData.Gps, vAfterData.Zzempwp_Tx, "", "");
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Actda");
		oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));
		
		var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_IssuedTyp");
		oIssuedTypeMatrix.removeAllRows();
		
		var oCell, oRow;
		
		var vMassLabels = ["발령유형 / 사유"]; //["1st 발령유형 / 사유","2nd 발령유형 / 사유","3rd 발령유형 / 사유","4th 발령유형 / 사유","5th 발령유형 / 사유",];
		
		for(var i=0; i<vMassLabels.length; i++) {
			var vMassn = eval("vAfterData.Mntxt" + (i+1));
			var vMassg = eval("vAfterData.Mgtxt" + (i+1));
			
			if(vMassn != "" && vMassg != "") {
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [new sap.m.Label({text : vMassLabels[i]}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : new sap.m.Text({text : vMassn + " / " + vMassg}).addStyleClass("L2P13Font")
				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
				oRow.addCell(oCell);
				
				oIssuedTypeMatrix.addRow(oRow);
			}
		}
		
		var oCell = null, oRow = null;
		
		var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_AD_MatrixLayout");
		if(oMatrixLayout) {
			oMatrixLayout.removeAllRows();
			oMatrixLayout.destroyRows();
		}
		
		for(var i=0; i<vDisplayControl.length; i++) {
			var Fieldname = vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
//			var ChangeFieldname = Fieldname + "C";
			
			if (i % 2 == 0)	oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : oBundleText.getText(vDisplayControl[i].Fieldname)}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow.addCell(oCell);
			
			var oAfterControl = new sap.m.Text().addStyleClass("L2P13Font");
//			var oBeforeControl = new sap.m.Text().addStyleClass("L2P13Font");
			
			eval("oAfterControl.setText(vAfterData." + TextFieldname + ");" );
//			eval("oBeforeControl.setText(vBeforeData." + TextFieldname + ");" );
			
//			var vTmp = eval("vAfterData." + ChangeFieldname);
//			if(vTmp == "X") {
//				oAfterControl.addStyleClass("L2PFontColorRed");
//			}
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : oAfterControl
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);
			
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Middle,
//				content : oBeforeControl
//			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//			oRow.addCell(oCell);
			
			if (i % 2 == 1)	oMatrixLayout.addRow(oRow);
		}
	},
	
	setSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var vDisplayControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vDisplayControl.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var oAllCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_All_CheckBox");
		if(oAllCheckbox) oAllCheckbox.destroy(true);
		
		var oSubjectList = sap.ui.getCore().byId(oController.PAGEID + "_SubjectList");
		oSubjectList.removeAllColumns();
		oSubjectList.destroyColumns();
		
		if(oController.ListSelectionType == "Multiple") {
        	var oColumn0 = new sap.ui.table.Column();
    		oColumn0.setLabel(new sap.ui.commons.CheckBox(oController.PAGEID + "_All_CheckBox", {
    			change: oController.onChangeCheckBox,
    		}));
    		oColumn0.setHAlign(sap.ui.core.HorizontalAlign.Center);
    		oColumn0.setWidth("40px");
    		oColumn0.setTemplate(new sap.ui.commons.CheckBox({
    			checked : "{Pchk}",
    		}).addStyleClass("L2P13Font"));
    		oSubjectList.addColumn(oColumn0);
    		oSubjectList.setFixedColumnCount(5);
        } else {
        	oSubjectList.setFixedColumnCount(4);
        }
		
		var vColumns = [ {id : "Photo", label : "", control : "image", width : "40px"},
		                 {id : "Ename", label : oBundleText.getText("ENAME"), control : "link", width : "150px"},
		                 {id : "Acttx", label : oBundleText.getText("ACTTX"), control : "textarea", width : "150px"},
		                 {id : "Actda", label : oBundleText.getText("ACTDA"), control : "date", width : "100px"},
		                 {id : "Batyp", label : oBundleText.getText("BATYP"), control : "Batyp", width : "70px"},
		                 {id : "Docno", label : "", control : "", width : ""},
		                 {id : "Pernr", label : "", control : "", width : ""},
		                 {id : "Docty", label : "", control : "", width : ""},
		                 {id : "Docno", label : "", control : "", width : ""},
		                 {id : "Reqno", label : "", control : "", width : ""},
		                 {id : "Persa", label : "", control : "", width : ""},
		                 {id : "Pbtxt", label : "", control : "", width : ""},
		                 {id : "Cfmyn", label : "", control : "", width : ""},
		                 {id : "Shayn", label : "", control : "", width : ""},
		                 {id : "Regno", label : "", control : "", width : ""},
		                 {id : "Massn1", label : "", control : "", width : ""},
		                 {id : "Massg1", label : "", control : "", width : ""},
		                 {id : "Massn2", label : "", control : "", width : ""},
		                 {id : "Massg2", label : "", control : "", width : ""},
		                 {id : "Massn3", label : "", control : "", width : ""},
		                 {id : "Massg3", label : "", control : "", width : ""},
		                 {id : "Massn4", label : "", control : "", width : ""},
		                 {id : "Massg4", label : "", control : "", width : ""},
		                 {id : "Massn5", label : "", control : "", width : ""},
		                 {id : "Massg5", label : "", control : "", width : ""},
		                 {id : "Mntxt1", label : "", control : "", width : ""},
		                 {id : "Mgtxt1", label : "", control : "", width : ""},
		                 {id : "Mntxt2", label : "", control : "", width : ""},
		                 {id : "Mgtxt2", label : "", control : "", width : ""},
		                 {id : "Mntxt3", label : "", control : "", width : ""},
		                 {id : "Mgtxt3", label : "", control : "", width : ""},
		                 {id : "Mntxt4", label : "", control : "", width : ""},
		                 {id : "Mgtxt4", label : "", control : "", width : ""},
		                 {id : "Mntxt5", label : "", control : "", width : ""},
		                 {id : "Mgtxt5", label : "", control : "", width : ""},
		                 {id : "Actty", label : "", control : "", width : ""},
		                 {id : "CfmLast", label : "", control : "", width : ""},
//		                 {id : "Gps", label : "", control : "", width : ""},
//		                 {id : "Zzempwp_Tx", label : "", control : "", width : ""}
		                ];
		
		for(var i=1; i<5; i++) {
			var oColumn = new sap.ui.table.Column();
			oColumn.setLabel(new sap.ui.commons.TextView({text: vColumns[i].label, textAlign : "Left", wrapping : true}).addStyleClass("L2P13Font"));
			oColumn.setHAlign(sap.ui.core.HorizontalAlign.Left);
			oColumn.setWidth(vColumns[i].width);			
			
			if(vColumns[i].control == "text") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumns[i].id + "}",
					textAlign : "Left"}).addStyleClass("L2P13Font"));
			} else if(vColumns[i].control == "textarea") {
				oColumn.setTemplate(new sap.ui.core.HTML({
					content : {
						path :vColumns[i].id,
						formatter : function(fVal) {
							if(fVal == null) return;
							return "<pre class='L2P13Font'>" + fVal.replace("$", "\r\n") + "</pre>";
						}
					},
					width : "100%",
					preferDOM : true}).addStyleClass("L2P13Font"));
			} else if(vColumns[i].control == "date") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : {path : vColumns[i].id, formatter : common.Common.DateFormatter},
					textAlign : "Left"}).addStyleClass("L2P13Font"));
			} else if(vColumns[i].control == "image") {
				oColumn.setTemplate(new sap.ui.commons.Image({
					src : "{" + vColumns[i].id + "}",
					width : "30px",
					height: "30px"}).addStyleClass("L2P13Font"));
			} else if(vColumns[i].control == "link") {
				var oLinkLayout = new sap.ui.commons.layout.HorizontalLayout();
				
				oLinkLayout.addContent(new sap.ui.core.Icon({
					src : {path : "Cfmyn", formatter : function(fVal) {
						var vRet = "";
						if(fVal == "X") vRet = "sap-icon://status-positive";
						else if(fVal == "L") vRet = "sap-icon://locked";
						else if(fVal == "E") vRet = "sap-icon://decline";
						return vRet; 
					}},
					visible : {path : "Cfmyn", formatter : function(fVal) {
						var vRet = false;
						if(fVal == "X") vRet = true;
						else if(fVal == "L") vRet = true;
						else if(fVal == "E") vRet = true;
						return vRet;  
					}},
					size : "1.0rem", 
					color : {path : "Cfmyn", formatter : function(fVal) {
						var vRet = "#FFFFFF";
						if(fVal == "X") vRet = "green";
						else if(fVal == "L") vRet = "orange";
						else if(fVal == "E") vRet = "red";
						return vRet; 
					}}
					}) //.addStyleClass("L2PPaddingLeft10")
				);
				
				oLinkLayout.addContent(
						new sap.ui.core.HTML({
							preferDOM : true, 
							content : "<span style='padding-left:5px;'><span>",
							visible : {path : "Cfmyn", formatter : function(fVal) {
								var vRet = false;
								if(fVal == "X") vRet = true;
								else if(fVal == "L") vRet = true;
								else if(fVal == "E") vRet = true;
								return vRet;  
							}},})
				);
				
				oLinkLayout.addContent(new sap.m.Link({
					text : { path : vColumns[i].id },
					grouped : true,
					press : oController.displayDetailView,
					customData : [{key : "Reqno", value : "{Reqno}"},
					              {key : "Pernr", value : "{Pernr}"},
					              {key : "Actda", value : "{Actda}"},
					              {key : "Docno", value : "{Docno}"}]
					}).addStyleClass("L2P13Font L2PFontColorBlue")
				);
				
				var oCell = null, oRow = null;
				var oCellLayout = new sap.ui.commons.layout.MatrixLayout({
					width : "100%",
					layoutFixed : false,
					columns : 1
				});
				oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Bottom,
					content : [oLinkLayout]
				}).addStyleClass("L2PPaddingTop4");
				oRow.addCell(oCell);
				oCellLayout.addRow(oRow);
				
				oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Top,
					content : [new sap.m.Text({
						text : {path : "Pernr", formatter : function(fVal) {return "(" + fVal + ")"; }},
						width : "100%"}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PPaddingTop4");
				oRow.addCell(oCell);
				oCellLayout.addRow(oRow);
				
				oColumn.setTemplate(oCellLayout);
			} else if(vColumns[i].control == "Batyp") {
				var oCell = null, oRow = null;
				
				var oCellLayout = new sap.ui.commons.layout.MatrixLayout({
					width : "100%",
					layoutFixed : false,
					columns : 1
				});
				oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [new sap.ui.commons.TextView({
						text : "AFTER",
						semanticColor : sap.ui.commons.TextViewColor.Positive,
						textAlign : "Left"}).addStyleClass("L2P13Font L2P13FontBold")]
				}).addStyleClass("L2PPaddingTop4 L2PBottomLine");
				oRow.addCell(oCell);
				oCellLayout.addRow(oRow);
				
				oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [new sap.ui.commons.TextView({
						text : "BEFORE",
						semanticColor : sap.ui.commons.TextViewColor.Default,
						textAlign : "Left"}).addStyleClass("L2P13Font L2P13FontBold")]
				}).addStyleClass("L2PPaddingTop4");
				oRow.addCell(oCell);
				oCellLayout.addRow(oRow);
				
				oColumn.setTemplate(oCellLayout);
			}
			oSubjectList.addColumn(oColumn);			
		}
		
		for(var i=0; i<vDisplayControl.length; i++) {
			var Fieldname = vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			var ChangeFieldname = Fieldname + "C";
			
			var oColumn = new sap.ui.table.Column();
			oColumn.setLabel(new sap.ui.commons.TextView({text: oBundleText.getText(vDisplayControl[i].Fieldname), textAlign : "Left", wrapping : true}).addStyleClass("L2P13Font"));
			oColumn.setHAlign(sap.ui.core.HorizontalAlign.Left);
			oColumn.setWidth("150px");
			oColumn.setFlexible(false);
			oColumn.setAutoResizable(true);
			
			var oCell = null, oRow = null;
			
			var oCellLayout = new sap.ui.commons.layout.MatrixLayout({
				width : "100%",
				layoutFixed : false,
				columns : 1
			});
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.ui.commons.TextView({
					text : "{A_" + TextFieldname + "}",
					width : "100%",
					design : {
						path : "A_" + ChangeFieldname, 
						formatter : function(fVal) {
							return fVal == "X" ? sap.ui.commons.TextViewDesign.Bold : undefined;
						}
					},
					semanticColor : {
						path : "A_" + ChangeFieldname, 
						formatter : function(fVal) {
							return fVal == "X" ? sap.ui.commons.TextViewColor.Positive : sap.ui.commons.TextViewColor.Default;
						}
					},
					textAlign : "Left"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PPaddingTop4 L2PBottomLine");
			oRow.addCell(oCell);
			oCellLayout.addRow(oRow);
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.ui.commons.TextView({
					text : "{B_" + TextFieldname + "}",
					width : "100%",
					semanticColor : sap.ui.commons.TextViewColor.Default,
					textAlign : "Left"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PPaddingTop4");
			oRow.addCell(oCell);
			oCellLayout.addRow(oRow);
			
			oColumn.setTemplate(oCellLayout);
			
			oSubjectList.addColumn(oColumn);
		}
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURIComponent(oController._vReqno) + "%27";
		oModel.read(oPath + oController.ListFilter, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						var oneData = null;
						for(var i=0; i<oData.results.length; i++) {
							
							if(oData.results[i].Batyp == "A") {
								oneData = {};
								oneData.Pchk = oController.ListSelected;
								oneData.ProcessStatus = "W";
								oneData.ProcessStatusText = "대기중";
								oneData.ProcessMsg = "";
								
								for(var j=1; j<vColumns.length - 1; j++) {
									eval("oneData." + vColumns[j].id + " = oData.results[i]." + vColumns[j].id + ";");
								}
								oneData.A_Batyp = oData.results[i].Batyp;
								
								for(var j=0; j<vDisplayControl.length; j++) {
									var Fieldname = vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.A_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.A_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.A_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
							} else {
								oneData.B_Batyp = oData.results[i].Batyp;
								for(var j=0; j<vDisplayControl.length; j++) {
									var Fieldname = vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.B_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.B_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.B_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
								vActionSubjectList.ActionSubjectListSet.push(oneData);
							}
						}
					}
				},
				function(oError) {
					common.Common.log(oError);
					var Err = {};					    	 
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						if(Err.error.innererror.errordetails) {
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(Err.error.message.value);
						}
						
					} else {
						common.Common.showErrorMessage(oError);
					}
				}
		);

		if(oController._vRecordCount < vActionSubjectList.ActionSubjectListSet.length) {
			oSubjectList.setVisibleRowCount(oController._vRecordCount);
		} else {
			oSubjectList.setVisibleRowCount(vActionSubjectList.ActionSubjectListSet.length);
		}
		oController._vListLength = vActionSubjectList.ActionSubjectListSet.length;
		mActionSubjectList.setData(vActionSubjectList);	
	},
	
	setRecSubjectListColumn : function(oController) {
		console.log("Common setRecSubjectListColumn Start");
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var vDisplayControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vDisplayControl.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var oAllCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_All_CheckBox");
		if(oAllCheckbox) oAllCheckbox.destroy(true);
		
		var oSubjectList = sap.ui.getCore().byId(oController.PAGEID + "_SubjectList");
		oSubjectList.removeAllColumns();
		oSubjectList.destroyColumns();
		
		if(oController.ListSelectionType == "Multiple") {
        	var oColumn0 = new sap.ui.table.Column();
    		oColumn0.setLabel(new sap.ui.commons.CheckBox(oController.PAGEID + "_All_CheckBox", {
    			change: oController.onChangeCheckBox,
    		}));
    		oColumn0.setHAlign(sap.ui.core.HorizontalAlign.Center);
    		oColumn0.setWidth("40px");
    		oColumn0.setTemplate(new sap.ui.commons.CheckBox({
    			checked : "{Pchk}",
    		}).addStyleClass("L2P13Font"));
    		oSubjectList.addColumn(oColumn0);
    		oSubjectList.setFixedColumnCount(4);
        } else {
        	oSubjectList.setFixedColumnCount(3);
        }
		
		var vColumns = [ {id : "Photo", label : "", control : "image", width : "40px"},
		                 {id : "Ename", label : oBundleText.getText("ENAME"), control : "link", width : "150px"},		//성명
		                 {id : "Acttx", label : oBundleText.getText("ACTTX"), control : "text", width : "250px"},		//발령유형
		                 {id : "Actda", label : oBundleText.getText("ACTDA"), control : "date", width : "100px"},		//발령일
		                 {id : "Sub01", label : oBundleText.getText("TSUB01"), control : "icon", width : "50px"},		//인적
		                 {id : "Sub02", label : oBundleText.getText("TSUB02"), control : "icon", width : "50px"},		//학력
		                 {id : "Sub03", label : oBundleText.getText("TSUB03"), control : "icon", width : "50px"},		//경력
		                 {id : "Sub04", label : oBundleText.getText("TSUB04"), control : "icon", width : "50px"},		//어학
//		                 {id : "Sub05", label : oBundleText.getText("TSUB05"), control : "icon", width : "50px"},		//해외
		                 {id : "Sub06", label : oBundleText.getText("TSUB06"), control : "icon", width : "50px"},		//자격
		                 {id : "Sub07", label : oBundleText.getText("TSUB07"), control : "icon", width : "50px"},		//병역
		                 {id : "Batyp", label : oBundleText.getText("BATYP"), control : "Batyp", width : "70px"},		//발령구분
		                 {id : "Docno", label : "", control : "", width : ""},
		                 {id : "Pernr", label : "", control : "", width : ""},
		                 {id : "Docty", label : "", control : "", width : ""},
		                 {id : "VoltId", label : "", control : "", width : ""},
		                 {id : "Docno", label : "", control : "", width : ""},
		                 {id : "Reqno", label : "", control : "", width : ""},
		                 {id : "Persa", label : "", control : "", width : ""},
		                 {id : "Pbtxt", label : "", control : "", width : ""},
		                 {id : "Cfmyn", label : "", control : "", width : ""},
		                 {id : "Shayn", label : "", control : "", width : ""},
		                 {id : "Regno", label : "", control : "", width : ""},
		                 {id : "Massn1", label : "", control : "", width : ""},
		                 {id : "Massg1", label : "", control : "", width : ""},
		                 {id : "Massn2", label : "", control : "", width : ""},
		                 {id : "Massg2", label : "", control : "", width : ""},
		                 {id : "Massn3", label : "", control : "", width : ""},
		                 {id : "Massg3", label : "", control : "", width : ""},
		                 {id : "Massn4", label : "", control : "", width : ""},
		                 {id : "Massg4", label : "", control : "", width : ""},
		                 {id : "Massn5", label : "", control : "", width : ""},
		                 {id : "Massg5", label : "", control : "", width : ""},
		                 {id : "Mntxt1", label : "", control : "", width : ""},
		                 {id : "Mgtxt1", label : "", control : "", width : ""},
		                 {id : "Mntxt2", label : "", control : "", width : ""},
		                 {id : "Mgtxt2", label : "", control : "", width : ""},
		                 {id : "Mntxt3", label : "", control : "", width : ""},
		                 {id : "Mgtxt3", label : "", control : "", width : ""},
		                 {id : "Mntxt4", label : "", control : "", width : ""},
		                 {id : "Mgtxt4", label : "", control : "", width : ""},
		                 {id : "Mntxt5", label : "", control : "", width : ""},
		                 {id : "Mgtxt5", label : "", control : "", width : ""},
		                 {id : "Actty", label : "", control : "", width : ""},
		                 {id : "CfmLast", label : "", control : "", width : ""},
//		                 {id : "Gps", label : "", control : "", width : ""},
//		                 {id : "Zzempwp_Tx", label : "", control : "", width : ""}
		                ];
		
		for(var i=1; i<10; i++) {
			var oColumn = new sap.ui.table.Column();
			oColumn.setLabel(new sap.ui.commons.TextView({text: vColumns[i].label, textAlign : "Left", wrapping : true}).addStyleClass("L2P13Font"));
			oColumn.setHAlign(sap.ui.core.HorizontalAlign.Left);
			oColumn.setWidth(vColumns[i].width);			
			
			if(vColumns[i].control == "text") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : "{" + vColumns[i].id + "}",
					textAlign : "Left"}).addStyleClass("L2P13Font"));
			} else if(vColumns[i].control == "textarea") {
				oColumn.setTemplate(new sap.ui.core.HTML({
					content : {
						path :vColumns[i].id,
						formatter : function(fVal) {
							if(fVal == null) return;
							return "<pre class='L2P13Font'>" + fVal.replace("$", "\r\n") + "</pre>";
						}
					},
					width : "100%",
					preferDOM : true}).addStyleClass("L2P13Font"));
			} else if(vColumns[i].control == "date") {
				oColumn.setTemplate(new sap.ui.commons.TextView({
					text : {path : vColumns[i].id, formatter : common.Common.DateFormatter},
					textAlign : "Left"}).addStyleClass("L2P13Font"));
			} else if(vColumns[i].control == "image") {
				oColumn.setTemplate(new sap.ui.commons.Image({
					src : "{" + vColumns[i].id + "}",
					width : "30px",
					height: "30px"}).addStyleClass("L2P13Font"));
			} else if(vColumns[i].control == "link") {
				var oLinkLayout = new sap.ui.commons.layout.HorizontalLayout();
				
				oLinkLayout.addContent(new sap.ui.core.Icon({
					src : {path : "Cfmyn", formatter : function(fVal) {
						var vRet = "";
						if(fVal == "X") vRet = "sap-icon://status-positive";
						else if(fVal == "L") vRet = "sap-icon://locked";
						else if(fVal == "E") vRet = "sap-icon://decline";
						return vRet; 
					}},
					visible : {path : "Cfmyn", formatter : function(fVal) {
						var vRet = false;
						if(fVal == "X") vRet = true;
						else if(fVal == "L") vRet = true;
						else if(fVal == "E") vRet = true;
						return vRet;  
					}},
					size : "1.0rem", 
					color : {path : "Cfmyn", formatter : function(fVal) {
						var vRet = "#FFFFFF";
						if(fVal == "X") vRet = "green";
						else if(fVal == "L") vRet = "orange";
						else if(fVal == "E") vRet = "red";
						return vRet; 
					}}
					}) //.addStyleClass("L2PPaddingLeft10")
				);
				
				oLinkLayout.addContent(
						new sap.ui.core.HTML({
							preferDOM : true, 
							content : "<span style='padding-left:5px;'><span>",
							visible : {path : "Cfmyn", formatter : function(fVal) {
								var vRet = false;
								if(fVal == "X") vRet = true;
								else if(fVal == "L") vRet = true;
								else if(fVal == "E") vRet = true;
								return vRet;  
							}},})
				);
				
				oLinkLayout.addContent(new sap.m.Link({
					text : { path : vColumns[i].id },
					grouped : true,
					press : oController.displayDetailView,
					customData : [{key : "Reqno", value : "{Reqno}"},
					              {key : "Pernr", value : "{Pernr}"},
					              {key : "Actda", value : "{Actda}"},
					              {key : "Docno", value : "{Docno}"}]
					}).addStyleClass("L2P13Font L2PFontColorBlue")
				);
				
//				oLinkLayout.addContent(new sap.ui.core.Icon({
//					src : {path : "Cfmyn", formatter : function(fVal) {
//						var vRet = "";
//						if(fVal == "X") vRet = "sap-icon://accept";
//						else if(fVal == "L") vRet = "sap-icon://locked";
//						else if(fVal == "E") vRet = "sap-icon://status-error";
//						return vRet; 
//					}},
//					size : "1.0rem", 
//					color : {path : "Cfmyn", formatter : function(fVal) {
//						var vRet = "#FFFFFF";
//						if(fVal == "X") vRet = "#666666";
//						else if(fVal == "L") vRet = "#cc1919";
//						else if(fVal == "E") vRet = "#cc1919";
//						return vRet; 
//					}}
//					}).addStyleClass("L2PPaddingLeft10")
//				);
				oColumn.setTemplate(oLinkLayout);
			} else if(vColumns[i].control == "Batyp") {
				var oCell = null, oRow = null;
				
				var oCellLayout = new sap.ui.commons.layout.MatrixLayout({
					width : "100%",
					layoutFixed : false,
					columns : 1
				});
				oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [new sap.ui.commons.TextView({
						text : "AFTER",
						semanticColor : sap.ui.commons.TextViewColor.Positive,
						textAlign : "Left"}).addStyleClass("L2P13Font L2P13FontBold")]
				}).addStyleClass("L2PPaddingTop4 L2PBottomLine");
				oRow.addCell(oCell);
				oCellLayout.addRow(oRow);
				
				oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [new sap.ui.commons.TextView({
						text : "BEFORE",
						semanticColor : sap.ui.commons.TextViewColor.Default,
						textAlign : "Left"}).addStyleClass("L2P13Font L2P13FontBold")]
				}).addStyleClass("L2PPaddingTop4");
				oRow.addCell(oCell);
				oCellLayout.addRow(oRow);
				
				oColumn.setTemplate(oCellLayout);
			} else if(vColumns[i].control == "icon") {
				oColumn.setTemplate(new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: vColumns[i].id, formatter: function(fVal){return fVal >= "1" ? true : false;}}
				}));
				oColumn.setHAlign(sap.ui.core.HorizontalAlign.Center);
			}
			oSubjectList.addColumn(oColumn);			
		}
		
		for(var i=0; i<vDisplayControl.length; i++) {
			
			var Fieldname = vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			
			//console.log((i+1) + " Fieldname : " + Fieldname);
			var TextFieldname = Fieldname + "_Tx";
			var ChangeFieldname = Fieldname + "C";
			
			var oColumn = new sap.ui.table.Column();
			oColumn.setLabel(new sap.ui.commons.TextView({text: oBundleText.getText(vDisplayControl[i].Fieldname), textAlign : "Left", wrapping : true}).addStyleClass("L2P13Font"));
			oColumn.setHAlign(sap.ui.core.HorizontalAlign.Left);
			oColumn.setWidth("150px");
			oColumn.setTemplate(new sap.ui.commons.TextView({
				text : "{" + TextFieldname + "}",
				textAlign : "Left"}).addStyleClass("L2P13Font"));
			
//			var oCell = null, oRow = null;
//			
//			var oCellLayout = new sap.ui.commons.layout.MatrixLayout({
//				width : "100%",
//				layoutFixed : false,
//				columns : 1
//			});
//			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Middle,
//				content : [new sap.ui.commons.TextView({
//					text : "{A_" + TextFieldname + "}",
//					width : "100%",
//					semanticColor : {
//						path : "A_" + ChangeFieldname, 
//						formatter : function(fVal) {
//							return fVal == "X" ? sap.ui.commons.TextViewColor.Negative : sap.ui.commons.TextViewColor.Default;
//						}
//					},
//					textAlign : "Left"}).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PPaddingTop4 L2PBottomLine");
//			oRow.addCell(oCell);
//			oCellLayout.addRow(oRow);
//			
//			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "25px"});
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Middle,
//				content : [new sap.ui.commons.TextView({
//					text : "{B_" + TextFieldname + "}",
//					width : "100%",
//					semanticColor : sap.ui.commons.TextViewColor.Default,
//					textAlign : "Left"}).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PPaddingTop4");
//			oRow.addCell(oCell);
//			oCellLayout.addRow(oRow);
//			
//			oColumn.setTemplate(oCellLayout);
			
			oSubjectList.addColumn(oColumn);
		}
		
		console.log("여기부터 oData(/ActionSubjectListSet) 호출");
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURIComponent(oController._vReqno) + "%27";
		console.log("oController.ListFilter : " + oController.ListFilter);
		oModel.read(oPath + oController.ListFilter,  
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						var oneData = null;
						console.log(oData.results.length + "건의 데이타가지고 옴!!!");
						for(var i=0; i<oData.results.length; i++) {
							
//							if(oData.results[i].Batyp == "A") {
								oneData = {};
								oneData.Pchk = oController.ListSelected;
								oneData.ProcessStatus = "W";
								oneData.ProcessStatusText = "대기중";
								oneData.ProcessMsg = "";
								
								for(var j=1; j<vColumns.length - 1; j++) {
									eval("oneData." + vColumns[j].id + " = oData.results[i]." + vColumns[j].id + ";");
								}
//								oneData.A_Batyp = oData.results[i].Batyp;
								
								for(var j=0; j<vDisplayControl.length; j++) {
									var Fieldname = vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData." + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData." + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData." + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
//							} else {
//								oneData.B_Batyp = oData.results[i].Batyp;
//								for(var j=0; j<vDisplayControl.length; j++) {
//									var Fieldname = vDisplayControl[j].Fieldname;
//									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
//									var TextFieldname = Fieldname + "_Tx";
//									var ChangeFieldname = Fieldname + "C";
//									
//									eval("oneData.B_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
//									eval("oneData.B_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
//									eval("oneData.B_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
//								}
								vActionSubjectList.ActionSubjectListSet.push(oneData);
//							}
						}
					}
				},
				function(oError) {
					common.Common.log(oError);
					var Err = {};					    	 
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						if(Err.error.innererror.errordetails) {
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(Err.error.message.value);
						}
						
					} else {
						common.Common.showErrorMessage(oError);
					}
				}
		);

		if(oController._vRecordCount < vActionSubjectList.ActionSubjectListSet.length) {
			oSubjectList.setVisibleRowCount(oController._vRecordCount);
		} else {
			oSubjectList.setVisibleRowCount(vActionSubjectList.ActionSubjectListSet.length);
		}
		oController._vListLength = vActionSubjectList.ActionSubjectListSet.length;
		mActionSubjectList.setData(vActionSubjectList);	
		
		console.log("Common setRecSubjectListColumn End");
	},
};