jQuery.sap.declare("zui5_hrxx_actapp.common.Common");

jQuery.sap.require("sap.ui.commons.layout.HorizontalLayout");
jQuery.sap.require("sap.ui.commons.layout.VerticalLayout");
jQuery.sap.require("sap.suite.ui.commons.BusinessCard");

zui5_hrxx_actapp.common.Common = {
		
		/** 
		* @memberOf zui5_hrxx_actapp.common.Common
		*/
		
	oSubjectList : null,
		
	onAfterOpenDetailViewPopover : function(oController) {
        var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var filterString = "/?$filter=Reqno%20eq%20%27" + encodeURIComponent(oController._vSelected_Reqno) + "%27";
		filterString += "%20and%20Docno%20eq%20%27" + oController._vSelected_Docno + "%27";
		filterString += "%20and%20Pernr%20eq%20%27" + oController._vSelected_Pernr + "%27";
		filterString += "%20and%20VoltId%20eq%20%27" + oController._vSelected_VoltId + "%27";
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
		} catch(ex) {
			common.Common.log(ex);
		}
		
		common.GoogleMap.createMap(oController.PAGEID, vBeforeData.Gps);
		
		common.GoogleMap.setMap(vBeforeData.Gps, vBeforeData.Zzempwp_Tx, vAfterData.Gps, vAfterData.Zzempwp_Tx);
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Actda");
		oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));
		
		var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_IssuedTyp");
		oIssuedTypeMatrix.removeAllRows();
		
		var oCell, oRow;
		
		var vMassLabels = ["1st 발령유형 / 사유", "2nd 발령유형 / 사유",
		                   "3rd 발령유형 / 사유", "4th 발령유형 / 사유",
		                   "5th 발령유형 / 사유"];
		
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
			content : [new sap.m.Label({text : "발령 항목"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : "발령이전 데이터"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : "발령이후 데이터"}).addStyleClass("L2P13Font")]
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
				content : [new sap.m.Label({text : vDisplayControl[i].Label}).addStyleClass("L2P13Font")]
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
		filterString += "%20and%20VoltId%20eq%20%27" + oController._vSelected_VoltId + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + dateFormat1.format(new Date(oController._vSelected_Actda)) + "T00%3a00%3a00%27";
		
		var vAfterData = {};
		var vDisplayControl = [];
		
		try {
			oModel.read("/ActionSubjectListSet"  + filterString, 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							vAfterData = oData.results[0];
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
		
		common.GoogleMap.createMap(oController.PAGEID, vAfterData.Gps);
		
		common.GoogleMap.setMap(vAfterData.Gps, vAfterData.Zzempwp_Tx, "", "");
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Actda");
		oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));
		
		var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_IssuedTyp");
		oIssuedTypeMatrix.removeAllRows();
		
		var oCell, oRow;
		
		var vMassLabels = ["발령유형/사유"]; //["1st 발령유형 / 사유","2nd 발령유형 / 사유","3rd 발령유형 / 사유","4th 발령유형 / 사유","5th 발령유형 / 사유",];
		
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
			
			if (i % 2 == 0)	oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vDisplayControl[i].Label}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow.addCell(oCell);
			
			var oAfterControl = new sap.m.Text().addStyleClass("L2P13Font");
			
			eval("oAfterControl.setText(vAfterData." + TextFieldname + ");" );
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : oAfterControl
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			if (i % 2 == 1)	oMatrixLayout.addRow(oRow);
		}
	},
	
	setSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/action1.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/action2.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/action3.png'>";
		
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
		
		if(zui5_hrxx_actapp.common.Common.oSubjectList) {
			var vColNum = zui5_hrxx_actapp.common.Common.oSubjectList.getColumnsNum();
			for(var i=1; i<vColNum; i++) {
				zui5_hrxx_actapp.common.Common.oSubjectList.deleteColumn(1);
			}
			zui5_hrxx_actapp.common.Common.oSubjectList.clearAll(false);
		}
		
		var vColumns = [ {id : "Ename", label : "성명", control : "ro", width : "150", align : "left"},
		                 {id : "Acttx", label : "발령유형", control : "txt", width : "150", align : "left"},
		                 {id : "Actda", label : "발령일", control : "ro", width : "100", align : "center"},
		                 {id : "Batyp", label : "구분", control : "ro", width : "70", align : "center"},
		               ];
		
		var vAdd_Columns = [{id : "Docno", label : "", control : "", width : ""},
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
		               ];
		
		var c_idx = 1;
		for(var i=0; i<vColumns.length; i++) {
			zui5_hrxx_actapp.common.Common.oSubjectList.insertColumn(c_idx, vColumns[i].label, vColumns[i].control, vColumns[i].width, 'na', vColumns[i].align,'middle');
			c_idx++;			
		}
		
		if(oController._vStatu == "00") {
			return;
		}
		
		for(var i=0; i<vDisplayControl.length; i++) {
			var Fieldname = vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			
			zui5_hrxx_actapp.common.Common.oSubjectList.insertColumn(c_idx, vDisplayControl[i].Label, 'ro', "150", 'na','left','middle');
			c_idx++;
		}
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURIComponent(oController._vReqno) + "%27";
		
		//DHMTLX Grid 부분을 적용한다.
		var SubjectListData = {rows : []};
		zui5_hrxx_actapp.common.Common.oSubjectList.startFastOperations();
		
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
								for(var j=1; j<vAdd_Columns.length - 1; j++) {
									eval("oneData." + vAdd_Columns[j].id + " = oData.results[i]." + vAdd_Columns[j].id + ";");
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
							
							//DHMTLX Grid 부분을 적용한다.
							var SubjectListOneData = {id : (i+1), data : [], userdata : null};
							SubjectListOneData.data.push(false);
							
							if(oData.results[i].Cfmyn == "X") SubjectListOneData.data.push("<table cellpadding=0 cellspacing=0 border=0 style='background-color:white'><tr><td style='border:0px'>" + icon1 + "</td><td style='padding-left:5px; border:0px'><div style='color:blue; cursor:pointer;' onclick='onPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div></td></tr></table>");
							else if(oData.results[i].Cfmyn == "E") SubjectListOneData.data.push("<table cellpadding=0 cellspacing=0 border=0 style='background-color:white'><tr><td style='border:0px'>" + icon2 + "</td><td style='padding-left:5px; border:0px'><div style='color:blue; cursor:pointer;' onclick='onPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div></td></tr></table>");
							else if(oData.results[i].Cfmyn == "L") SubjectListOneData.data.push("<table cellpadding=0 cellspacing=0 border=0 style='background-color:white'><tr><td style='border:0px'>" + icon3 + "</td><td style='padding-left:5px; border:0px'><div style='color:blue; cursor:pointer;' onclick='onPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div></td></tr></table>");
							else SubjectListOneData.data.push("<table cellpadding=0 cellspacing=0 border=0 style='background-color:white'><tr><td style='border:0px'><div style='color:blue; cursor:pointer;' onclick='onPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div></td></tr></table>");
							
							SubjectListOneData.data.push(oData.results[i].Acttx + "&nbsp;&nbsp;&nbsp;");
							SubjectListOneData.data.push(dateFormat.format(new Date(oData.results[i].Actda)));
							if(oData.results[i].Batyp == "A") SubjectListOneData.data.push("<span style='font-size:13px; font-weight:bold; color:blue'>After</span>");
							else SubjectListOneData.data.push("<span style='font-size:13px; font-weight:bold; color:black'>Before</span>");
							
							for(var j=0; j<vDisplayControl.length; j++) {
								var Fieldname = vDisplayControl[j].Fieldname;
								Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
								var TextFieldname = Fieldname + "_Tx";
								var ChangeFieldname = Fieldname + "C";
								
								var fChange = eval("oData.results[i]." + ChangeFieldname + ";");
								
								var val = eval("oData.results[i]." + TextFieldname + ";");
								if(oData.results[i].Batyp == "A" && fChange == "X") {
									SubjectListOneData.data.push("<span style='color:blue; font-weight:bold'>" + val + "&nbsp;&nbsp;&nbsp;</span>");	
								} else {
									SubjectListOneData.data.push(val + "&nbsp;&nbsp;&nbsp;");	
								}
							}
							
							SubjectListOneData.userdata = {"Pernr" : oData.results[i].Pernr};
							
							SubjectListData.rows.push(SubjectListOneData);
							
							if(zui5_hrxx_actapp.common.Common.oSubjectList) {
								console.log("Data : " + oData.results[i].Ename);
								zui5_hrxx_actapp.common.Common.oSubjectList.addRow((i+1), SubjectListOneData.data);
								zui5_hrxx_actapp.common.Common.oSubjectList.setUserData((i+1), "Pernr", oData.results[i].Pernr);
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

		mActionSubjectList.setData(vActionSubjectList);	
		zui5_hrxx_actapp.common.Common.oSubjectList.stopFastOperations();
		console.log("Row Length : " + SubjectListData.rows.length);
		
		if(zui5_hrxx_actapp.common.Common.oSubjectList && SubjectListData.rows.length > 0) {
	//		zui5_hrxx_actapp.common.Common.oSubjectList.parse(SubjectListData,"json");	
			
			for(var i=1; i<zui5_hrxx_actapp.common.Common.oSubjectList.getColumnsNum(); i++) {
				zui5_hrxx_actapp.common.Common.oSubjectList.adjustColumnSize(i);	
			}

			for(var r=0; r<zui5_hrxx_actapp.common.Common.oSubjectList.getRowsNum(); r++) {
				if((r % 2) == 0) {
					zui5_hrxx_actapp.common.Common.oSubjectList.setRowspan((r+1),0,2);
					zui5_hrxx_actapp.common.Common.oSubjectList.setRowspan((r+1),1,2);
					zui5_hrxx_actapp.common.Common.oSubjectList.setRowspan((r+1),2,2);
					zui5_hrxx_actapp.common.Common.oSubjectList.setRowspan((r+1),3,2);
				}
			}
			oController._vListLength = SubjectListData.rows.length;
		}
	},
	
	setRecSubjectListColumn : function(oController) {
		console.log("Common setRecSubjectListColumn Start");
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/action1.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/action2.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/action3.png'>";
		
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
		
		var vColumns = [ 
		                 {id : "Ename", label : "성명", control : "link", width : "150px"},		//성명
		                 {id : "Acttx", label : "발령유형", control : "text", width : "250px"},		//발령유형
		                 {id : "Actda", label : "발령일", control : "date", width : "100px"},		//발령일
		                 {id : "Sub01", label : "인적", control : "icon", width : "50px"},		//인적
		                 {id : "Sub02", label : "학력", control : "icon", width : "50px"},		//학력
		                 {id : "Sub03", label : "경력", control : "icon", width : "50px"},		//경력
		                 {id : "Sub04", label : "어학", control : "icon", width : "50px"},		//어학
//		                 {id : "Sub05", label : "해외", control : "icon", width : "50px"},		//해외
		                 {id : "Sub06", label : "자격", control : "icon", width : "50px"},		//자격
		                 {id : "Sub07", label : "병역", control : "icon", width : "50px"},		//병역
		                ];
		
		var vAdd_Columns = [ 
		                 {id : "Batyp", label : "", control : "", width : ""},		//발령구분
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
		                ];
		
		var c_idx = 1; 
		var vColLength = vColumns.length;
		if(oController._vMolga != "41") vColLength--;
		
		console.log("Molga : " + oController._vMolga);
		console.log("Columns.length : " + vColLength);
		
		for(var i=0; i<vColLength; i++) {
			zui5_hrxx_actapp.common.Common.oSubjectList.insertColumn(c_idx, vColumns[i].label, vColumns[i].control, vColumns[i].width, 'na', vColumns[i].align,'middle');
			c_idx++;			
		}
		
		if(oController._vStatu == "00") {
			return;
		}
		
		for(var i=0; i<vDisplayControl.length; i++) {
			var Fieldname = vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			
			zui5_hrxx_actapp.common.Common.oSubjectList.insertColumn(c_idx, vDisplayControl[i].Label, 'ro', "150", 'na','left','middle');
			c_idx++;
		}
		
		console.log("여기부터 oData(/ActionSubjectListSet) 호출");
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURIComponent(oController._vReqno) + "%27";
		
		//DHMTLX Grid 부분을 적용한다.
		var SubjectListData = {rows : []};
		zui5_hrxx_actapp.common.Common.oSubjectList.startFastOperations();
		
		oModel.read(oPath + oController.ListFilter,  
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						var oneData = null;
						console.log(oData.results.length + "건의 데이타가지고 옴!!!");
						for(var i=0; i<oData.results.length; i++) {
							
							oneData = {};
							oneData.Pchk = oController.ListSelected;
							oneData.ProcessStatus = "W";
							oneData.ProcessStatusText = "대기중";
							oneData.ProcessMsg = "";
							
							for(var j=0; j<vColLength; j++) {
								eval("oneData." + vColumns[j].id + " = oData.results[i]." + vColumns[j].id + ";");
							}
							
							for(var j=0; j<vAdd_Columns.length; j++) {
								eval("oneData." + vAdd_Columns[j].id + " = oData.results[i]." + vAdd_Columns[j].id + ";");
							}
							
							for(var j=0; j<vDisplayControl.length; j++) {
								var Fieldname = vDisplayControl[j].Fieldname;
								Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
								var TextFieldname = Fieldname + "_Tx";
								var ChangeFieldname = Fieldname + "C";
								
								eval("oneData." + Fieldname + " = oData.results[i]." + Fieldname + ";");
								eval("oneData." + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
								eval("oneData." + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
							}
							vActionSubjectList.ActionSubjectListSet.push(oneData);
							
							//DHMTLX Grid 부분을 적용한다.
							var SubjectListOneData = {id : (i+1), data : [], userdata : null};
							SubjectListOneData.data.push(false);
							
							if(oData.results[i].Cfmyn == "X") SubjectListOneData.data.push("<table cellpadding=0 cellspacing=0 border=0 style='background-color:white'><tr><td style='border:0px'>" + icon1 + "</td><td style='padding-left:5px; border:0px'><div style='color:blue; cursor:pointer;' onclick='onPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div></td></tr></table>");
							else if(oData.results[i].Cfmyn == "E") SubjectListOneData.data.push("<table cellpadding=0 cellspacing=0 border=0 style='background-color:white'><tr><td style='border:0px'>" + icon2 + "</td><td style='padding-left:5px; border:0px'><div style='color:blue; cursor:pointer;' onclick='onPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div></td></tr></table>");
							else if(oData.results[i].Cfmyn == "L") SubjectListOneData.data.push("<table cellpadding=0 cellspacing=0 border=0 style='background-color:white'><tr><td style='border:0px'>" + icon3 + "</td><td style='padding-left:5px; border:0px'><div style='color:blue; cursor:pointer;' onclick='onPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div></td></tr></table>");
							else SubjectListOneData.data.push("<table cellpadding=0 cellspacing=0 border=0 style='background-color:white'><tr><td style='border:0px'><div style='color:blue; cursor:pointer;' onclick='onPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div></td></tr></table>");
							
							SubjectListOneData.data.push(oData.results[i].Acttx + "&nbsp;&nbsp;&nbsp;");
							SubjectListOneData.data.push(dateFormat.format(new Date(oData.results[i].Actda)));
							
							for(var j=3; j<vColLength; j++) {
								var val = eval("oData.results[i]." + vColumns[j].id + ";");
								SubjectListOneData.data.push(val + "&nbsp;&nbsp;&nbsp;");	
							}
							
							for(var j=0; j<vDisplayControl.length; j++) {
								var Fieldname = vDisplayControl[j].Fieldname;
								Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
								var TextFieldname = Fieldname + "_Tx";
								
								var val = eval("oData.results[i]." + TextFieldname + ";");
								SubjectListOneData.data.push(val + "&nbsp;&nbsp;&nbsp;");
							}
							
							SubjectListOneData.userdata = {"Pernr" : oData.results[i].Pernr};
							
							SubjectListData.rows.push(SubjectListOneData);
							
//							if(zui5_hrxx_actapp.common.Common.oSubjectList) {
//								zui5_hrxx_actapp.common.Common.oSubjectList.addRow((i+1), SubjectListOneData.data);
//								zui5_hrxx_actapp.common.Common.oSubjectList.setUserData((i+1), "Pernr", oData.results[i].Pernr);
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

		mActionSubjectList.setData(vActionSubjectList);	
		zui5_hrxx_actapp.common.Common.oSubjectList.stopFastOperations();
		
		if(zui5_hrxx_actapp.common.Common.oSubjectList && SubjectListData.rows.length > 0) {
			zui5_hrxx_actapp.common.Common.oSubjectList.parse(SubjectListData,"json");	
			
			for(var i=1; i<zui5_hrxx_actapp.common.Common.oSubjectList.getColumnsNum(); i++) {
				zui5_hrxx_actapp.common.Common.oSubjectList.adjustColumnSize(i);	
			}			
			oController._vListLength = SubjectListData.rows.length;
		}
		
		console.log("Common setRecSubjectListColumn End");
	},
	
	onAfterRenderingTable : function(oController) {
		console.log("onAfterRenderingTable !!!");
		
		$("#" + oController.PAGEID + "_SubjectList").css("height", 400);
		
		$("#" + oController.PAGEID + "_SubjectList").empty();
		
		zui5_hrxx_actapp.common.Common.oSubjectList = new dhtmlXGridObject(oController.PAGEID + "_SubjectList");
		zui5_hrxx_actapp.common.Common.oSubjectList.setImagePath("/sap/bc/ui5_ui5/sap/zhrxx_common/css/imgs/dhxgrid_web/");
		
		var header = "#master_checkbox,";
		var InitWidths = "40,";
		var ColTypes = "ch,";
		var ColAlign = "center,";
		var ColVlign = "middle,";
		
		zui5_hrxx_actapp.common.Common.oSubjectList.setHeader(header.substring(0, header.length - 1));
		zui5_hrxx_actapp.common.Common.oSubjectList.setInitWidths(InitWidths.substring(0, InitWidths.length - 1));
		zui5_hrxx_actapp.common.Common.oSubjectList.setColAlign(ColAlign.substring(0, ColAlign.length - 1));
		zui5_hrxx_actapp.common.Common.oSubjectList.setColVAlign(ColVlign.substring(0, ColVlign.length - 1));
		zui5_hrxx_actapp.common.Common.oSubjectList.setColTypes(ColTypes.substring(0, ColTypes.length - 1));
		
		zui5_hrxx_actapp.common.Common.oSubjectList.attachEvent("onCheckbox", zui5_hrxx_actapp.common.Common.doOnCheck);
		
		zui5_hrxx_actapp.common.Common.oSubjectList.init();
		
		zui5_hrxx_actapp.common.Common.oSubjectList.enableSmartRendering(true);
	},
	
	doOnCheck : function(rowId, cellInd, state) {
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var vPernr = "";
		if(zui5_hrxx_actapp.common.Common.oSubjectList) {
			vPernr = zui5_hrxx_actapp.common.Common.oSubjectList.getUserData(rowId, "Pernr");
		}
		if(vPernr == "") return;
		
		var r_idx = -1;
		for(var i=0; i<vActionSubjectList.length; i++) {
			if(vPernr == vActionSubjectList[i].Pernr) {
				r_idx = i;
				break;
			}
		}
		if(r_idx != -1) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", state);
		}
	},
};