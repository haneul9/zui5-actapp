jQuery.sap.declare("zui5_hrxx_actapp2.common.Common");

jQuery.sap.require("sap.ui.commons.layout.HorizontalLayout");
jQuery.sap.require("sap.ui.commons.layout.VerticalLayout");
jQuery.sap.require("sap.suite.ui.commons.BusinessCard");

zui5_hrxx_actapp2.common.Common = {
		
		/** 
		* @memberOf zui5_hrxx_actapp2.common.Common
		*/
		
	oSubjectList : new sap.m.ColumnListItem({ }),
		
	onAfterOpenDetailViewPopover : function(oController) {
        var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var filterString = ""; //"/?$filter=Reqno%20eq%20%27" + encodeURI(oController._vSelected_Reqno) + "%27";
		filterString += "/?$filter=Docno%20eq%20%27" + oController._vSelected_Docno + "%27";
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
		
//		common.GoogleMap.setMap(vBeforeData.Gps, vBeforeData.Zzempwp_Tx, vAfterData.Gps, vAfterData.Zzempwp_Tx);
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Actda");
		oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));
		
		var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_IssuedTyp");
		oIssuedTypeMatrix.removeAllRows();
		
		var oCell, oRow;
		
		var vMassLabels = ["1st 발령유형 / 사유", "2nd 발령유형 / 사유",
		                   "3rd 발령유형 / 사유", "4th 발령유형 / 사유",
		                   "5th 발령유형 / 사유",];
		
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
					content : [new sap.m.Label({text : vMassLabels[i]}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : new sap.m.Text({text : vMntxt + " / " + vMgtxt}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
				oRow.addCell(oCell);
				
				oIssuedTypeMatrix.addRow(oRow);
			}
		}
		
		var filterString = "/?$filter=Docno%20eq%20%27" + oController._vDocno + "%27";
		
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
			content : [new sap.m.Label({text : "발령 항목"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : "발령이전 데이터"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : "발령이후 데이터"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oMatrixLayout.addRow(oRow);
		
		for(var i=0; i<vDisplayControl.length; i++) {
			var Fieldname = vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			var ChangeFieldname = Fieldname + "C";
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			
			var vHeaderText = "";
			if(vDisplayControl[i].Label && vDisplayControl[i].Label != "") {
				vHeaderText = vDisplayControl[i].Label;
			} else {
				vHeaderText = vDisplayControl[i].Label;
			}
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vHeaderText}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow.addCell(oCell);
			
			var oAfterControl = new sap.m.Text().addStyleClass("L2PFontFamily");
			var oBeforeControl = new sap.m.Text().addStyleClass("L2PFontFamily");
			
			eval("oAfterControl.setText(vAfterData." + TextFieldname + ");" );
			eval("oBeforeControl.setText(vBeforeData." + TextFieldname + ");" );
			
			var vTmp = eval("vAfterData." + ChangeFieldname);
			if(vTmp == "X") {
				oAfterControl.addStyleClass("L2PFontColorBlue L2PFontFamilyBold");
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
        var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var filterString = ""; //"/?$filter=Reqno%20eq%20%27" + encodeURI(oController._vSelected_Reqno) + "%27";
		filterString += "/?$filter=Docno%20eq%20%27" + oController._vSelected_Docno + "%27";
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
		
//		common.GoogleMap.setMap(vAfterData.Gps, vAfterData.Zzempwp_Tx, "", "");
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Rec_Actda");
		oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));
		
		var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_Rec_IssuedTyp");
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
					content : [new sap.m.Label({text : vMassLabels[i]}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : new sap.m.Text({text : vMassn + " / " + vMassg}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
				oRow.addCell(oCell);
				
				oIssuedTypeMatrix.addRow(oRow);
			}
		}
		
		var oCell = null, oRow = null;
		
		var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_AD_Rec_MatrixLayout");
		if(oMatrixLayout) {
			oMatrixLayout.removeAllRows();
			oMatrixLayout.destroyRows();
		}
		
		for(var i=0; i<vDisplayControl.length; i++) {
			var Fieldname = vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			
			if (i % 2 == 0)	oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			
			var vHeaderText = "";
			if(vDisplayControl[i].Label && vDisplayControl[i].Label != "") {
				vHeaderText = vDisplayControl[i].Label;
			} else {
				vHeaderText = vDisplayControl[i].Label;
			}
			
			var oLabel = new sap.m.Label({text : vHeaderText}).addStyleClass("L2PFontFamily");
			oLabel.setTooltip(vHeaderText);
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [oLabel]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow.addCell(oCell);
			
			var oAfterControl = new sap.m.Text().addStyleClass("L2PFontFamily");
			eval("oAfterControl.setText(vAfterData." + TextFieldname + ");" );
			eval("oAfterControl.setTooltip(vAfterData." + TextFieldname + ");" );
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : oAfterControl
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow.addCell(oCell);
			
			if (i % 2 == 1)	{
				oMatrixLayout.addRow(oRow);
			}
		}
	},
	
	setSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.png'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Radiation.png'>";
		
		oController.vDisplayControl = [];
		oController.vExcelDownControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oController.vDisplayControl.push(oData.results[i]);
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
		
		if(oController.oSubjectList.getCells().length > 0){
			oController.oSubjectList.destroyCells();
		}
		var vColumns = [ {id : "Ename", label : "성명", control : "ro", width : "150", align : "left"},
		                 {id : "Acttx", label : "발령유형", control : "txt", width : "150", align : "left"},
		                 {id : "Actda1", label : "발령일", control : "ro", width : "100", align : "center"},
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
			oController.oSubjectList.insertCell(
				    new sap.m.Text({
				    	text : "{" + vColumns[i].label + "}"
					}).addStyleClass("L2PFontFamily")	
			);
			var oneData = { id : vColumns[i].id , label : vColumns[i].label , control : "text"  } ;
			oController.vExcelDownControl.push(oneData);
			c_idx++;			
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<oController.vDisplayControl.length; i++) {
				var Fieldname = oController.vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var vHeaderText = "";
				if(oController.vDisplayControl[i].Label && oController.vDisplayControl[i].Label != "") {
					vHeaderText = oController.vDisplayControl[i].Label;
				} else {
					vHeaderText = oController.vDisplayControl[i].Label;
				}
				
				oController.oSubjectList.insertCell(
					    new sap.m.Text({
					    	text : "{" + TextFieldname + "}"
						}).addStyleClass("L2PFontFamily")	
				);
				c_idx++;
				
				var oneData = { id : TextFieldname , label : vHeaderText , control : "text"  } ;
				oController.vExcelDownControl.push(oneData);
			}
		}
//		var vTTableWidth = $("#" + oController.PAGEID + "_SubjectList").width();
//		var vTColumnWidth = 0 ;
//		for(var i=0; i < oController.oSubjectList.getColumnsNum(); i++) {
//			vTColumnWidth += oController.oSubjectList.getColWidth(i);
//		}
//		// dummy Field
//		if( vTTableWidth >  vTColumnWidth ){
//			oController.oSubjectList.insertColumn(c_idx, "",'ro', vTTableWidth - vTColumnWidth, 'na','left','middle');
//			c_idx++;
//		}
//	
		if(oController._vStatu == "00") {			
			return;
		}

		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27";
//        		  + "%20and%20Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		
		var SubjectListData = {data : []};
		//DHMTLX Grid 부분을 적용한다.
		oController.oSubjectList.startFastOperations();
		
		oModel.read(oPath + oController.ListFilter, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						var oneData = null;
						
						for(var i=0; i<oData.results.length; i++) {
							
							if(oData.results[i].Cfmyn == "X") {
								fCompleteCount = true; 
							}
							
							if(oData.results[i].Batyp == "A") {
								oneData = {};
								oneData.Pchk = oController.ListSelected;
								oneData.ProcessStatus = "W";
								oneData.ProcessStatusText = "대기중";
								oneData.ProcessMsg = "";
								
								for(var j=1; j<vColumns.length; j++) {
									eval("oneData." + vColumns[j].id + " = oData.results[i]." + vColumns[j].id + ";");
								}
								for(var j=0; j<vAdd_Columns.length; j++) {
									eval("oneData." + vAdd_Columns[j].id + " = oData.results[i]." + vAdd_Columns[j].id + ";");
								}
								
								//Global 일자 관련하여 소스 수정함. 2015.10.19
								var vActda = new Date(oData.results[i].Actda);
								oneData.Actda = new Date(common.Common.setTime(vActda));
								oneData.Actda1 = dateFormat.format(new Date(oData.results[i].Actda));
								oneData.Ename = oData.results[i].Ename;
								//수정완료
								oneData.Batyp = "After";
//								oneData.A_Batyp = oData.results[i].Batyp;
								
								for(var j=0; j<oController.vDisplayControl.length; j++) {
									var Fieldname = oController.vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.A_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.A_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.A_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
									eval("oneData." + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData." + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData." + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
								
								vActionSubjectList.ActionSubjectListSet.push(oneData);
							} else {
								oneData = {};
//								oneData.B_Batyp = oData.results[i].Batyp;
								oneData.Batyp = "Before";
								for(var j=0; j<oController.vDisplayControl.length; j++) {
									var Fieldname = oController.vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.B_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.B_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.B_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
									eval("oneData." + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData." + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData." + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
								vActionSubjectList.ActionSubjectListSet.push(oneData);
							}
							
							

							//DHMTLX Grid 부분을 적용한다.
							var SubjectListOneData = {id : (i+1), data : [], userdata : null};
							SubjectListOneData.data.push(oController.ListSelected);
							
							var icon_src = "";
							if(oData.results[i].Cfmyn == "X") icon_src = icon1;
							else if(oData.results[i].Cfmyn == "E") icon_src = icon2;
							else if(oData.results[i].Cfmyn == "L") icon_src = icon3;
							else icon_src = "";
							
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								icon_src += icon_retro;
							}
							
							var vEname_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'>"
							                        + "<tr><td style='border:0px; width:16px'>" + icon_src + "</td>"
							                        + "<td style='padding-left:5px; border:0px'>"
							                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2PFontFamily' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup3(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>"
							                        + "<div class='L2PFontFamily'>(" + oData.results[i].Pernr + ")</div>";
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								vEname_Html += "<div class='L2PFontFamily'>" + dateFormat.format(new Date(oData.results[i].Movda)) + " " + "부서이동" + "</div>";
							}							
							vEname_Html += "</td></tr></table>";
							
							SubjectListOneData.data.push(vEname_Html);
							SubjectListOneData.data.push(oData.results[i].Acttx + "&nbsp;&nbsp;&nbsp;");
							SubjectListOneData.data.push(dateFormat.format(new Date(oData.results[i].Actda)));
							if(oData.results[i].Batyp == "A") SubjectListOneData.data.push("<span style='font-size:13px; font-weight:bold; color:blue'>After</span>");
							else SubjectListOneData.data.push("<span style='font-size:13px; font-weight:bold; color:black'>Before</span>");
							
							for(var j=0; j<oController.vDisplayControl.length; j++) {
								var Fieldname = oController.vDisplayControl[j].Fieldname;
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
							
							SubjectListData.data.push(SubjectListOneData);
							
//							if(oController.oSubjectList) {
//								console.log("Data : " + oData.results[i].Ename);
//								oController.oSubjectList.addRow((i+1), SubjectListOneData.data);
//								oController.oSubjectList.setUserData((i+1), "Pernr", oData.results[i].Pernr);
//								oController.oSubjectList.setUserData((i+1), "Reqno", oData.results[i].Reqno);
//								oController.oSubjectList.setUserData((i+1), "Actda", oData.results[i].Actda);
//								oController.oSubjectList.setUserData((i+1), "Docno", oData.results[i].Docno);
//								oController.oSubjectList.setUserData((i+1), "VoltId", oData.results[i].VoltId);
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
	
		oController.oSubjectList.stopFastOperations();
		console.log("Row Length : " + SubjectListData.data.length);
		
		if(oController.oSubjectList && SubjectListData.data.length > 0) {
	//		zui5_hrxx_actapp2.common.Common.oSubjectList.parse(SubjectListData,"json");	
			
//			for(var i=1; i<oController.oSubjectList.getColumnsNum(); i++) {
//				oController.oSubjectList.adjustColumnSize(i);	
//			}

			for(var r=0; r<oController.oSubjectList.getRowsNum(); r++) {
				if((r % 2) == 0) {
					oController.oSubjectList.setRowspan((r+1),0,2);
					oController.oSubjectList.setRowspan((r+1),1,2);
					oController.oSubjectList.setRowspan((r+1),2,2);
					oController.oSubjectList.setRowspan((r+1),3,2);
				}
			}
			oController._vListLength = SubjectListData.data.length;
		}
				
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	setRecSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.png'>";
		var icon4 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/check-icon.png'>";
		
		oController.vDisplayControl = [];
		oController.vExcelDownControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oController.vDisplayControl.push(oData.results[i]);
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
		
		if(oController.oSubjectList) {
			var vColNum = oController.oSubjectList.getColumnsNum();
			for(var i=1; i<vColNum; i++) {
				oController.oSubjectList.deleteColumn(1);
			}
			oController.oSubjectList.clearAll(false);
		}
			
		var vColumns = [ {id : "Ename", label : "성명", control : "ro", width : "150", align : "left"},
		                 {id : "Acttx", label : "발령유형", control : "ro", width : "150", align : "left"},
		                 {id : "Actda1", label : "발령일", control : "ro", width : "100", align : "center"},
		               ];
		
		if(oController._vDocty == "20") {
			for(var i=0; i<oController._vActiveTabNames.length; i++) {
				var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
				var vTabLabel = oController._vActiveTabNames[i].Tabtl;
				vColumns.push({id : vTabId, data : vTabId, label : vTabLabel, control : "img", width : "80", align: "Center"});
			}
			vColumns.push({id : "Sub08", data : "Sub08", label : "재입사", control : "img", width : "80", align: "Center"});
		} else {
			for(var i=0; i<1; i++) {
				var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
				var vTabLabel = oController._vActiveTabNames[i].Tabtl;
				vColumns.push({id : vTabId , data : vTabId, label : vTabLabel, control : "img", width : "80", align: "Center"});
			}
		}	
			
		var c_idx = 1;
		for(var i=0; i<vColumns.length; i++) {
			oController.oSubjectList.insertColumn(c_idx, vColumns[i].label, "ro", vColumns[i].width, 'na', vColumns[i].align,'middle');
			var oneData = { id : vColumns[i].id , label : vColumns[i].label , control : "text"  } ;
			oController.vExcelDownControl.push(oneData);
			c_idx++;			
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<oController.vDisplayControl.length; i++) {
				var Fieldname = oController.vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var vHeaderText = "";
				if(oController.vDisplayControl[i].Label && oController.vDisplayControl[i].Label != "") {
					vHeaderText = oController.vDisplayControl[i].Label;
				} else {
					vHeaderText = oController.vDisplayControl[i].Label;
				}
				oController.oSubjectList.insertColumn(c_idx, vHeaderText,'ro', "150", 'na','left','middle');
				c_idx++;
				
				var oneData = { id : TextFieldname , label : vHeaderText , control : "ro"  } ;
				oController.vExcelDownControl.push(oneData);
			}
		}
		
		var vTTableWidth = $("#" + oController.PAGEID + "_SubjectList").width();
		var vTColumnWidth = 0 ;
		for(var i=0; i < oController.oSubjectList.getColumnsNum(); i++) {
			vTColumnWidth += oController.oSubjectList.getColWidth(i);
		}
		// dummy Field
		if( vTTableWidth >  vTColumnWidth ){
			oController.oSubjectList.insertColumn(c_idx, "",'ro', vTTableWidth - vTColumnWidth, 'na','left','middle');
			c_idx++;
		}
		
		if(oController._vStatu == "00") {			
			return;
		}
	
		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27";
		
		var SubjectListData = {rows : []};
		//DHMTLX Grid 부분을 적용한다.
		oController.oSubjectList.startFastOperations();
		
		oController._vActionCount = 0;
		oController._vRehireCount = 0;
		
		oModel.read(oPath + oController.ListFilter, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						if(oData.results.length < 2) {
							oController.ListSelected = true;
						} else {
							oController.ListSelected = false;
						}
						
						for(var i=0; i<oData.results.length; i++) {
							
							if(oData.results[i].Cfmyn == "X") {
								fCompleteCount = true; 
							}
							
							var oneData = oData.results[i];
							oneData.Pchk = oController.ListSelected;
							oneData.ProcessStatus = "W";
							oneData.ProcessStatusText = "대기중";
							oneData.ProcessMsg = "";
							var vActda = new Date(oData.results[i].Actda);
							oneData.Actda = new Date(common.Common.setTime(vActda));
							oneData.Actda1 = dateFormat.format(new Date(oData.results[i].Actda));
							//수정완료

							vActionSubjectList.ActionSubjectListSet.push(oneData);			
							
							if(oneData.Massn1 != "") {
								oController._vActionCount++;
							}
							
							if(oneData.Sub08 != "") {
								oController._vRehireCount++;
							}
							
							var oneDataSheet = oData.results[i];
							
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							//oneDataSheet.Actda = new Date(common.Common.setTime(vActda));
//							if(oneDataSheet.Actda != null) {
//								oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
//							} else {
//								oneDataSheet.Actda1 = "";
//							}
							//수정완료
							
							
							//DHMTLX Grid 부분을 적용한다.
							var SubjectListOneData = {id : (i+1), data : [], userdata : null};
							SubjectListOneData.data.push(oController.ListSelected);
							
							var icon_src = "";
							if(oData.results[i].Cfmyn == "X") icon_src = icon1;
							else if(oData.results[i].Cfmyn == "E") icon_src = icon2;
							else if(oData.results[i].Cfmyn == "L") icon_src = icon3;
							else icon_src = "";
							
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								icon_src += icon_retro;
							}
							
							var vEname_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'>"
							                        + "<tr>"
							                        + "<td style='border:0px; width:16px'>" + icon_src + "</td>"
							                        + "<td style='padding-left:5px; border:0px; text-Align :center;'>"
							                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2PFontFamily' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup3("  +(i + 1)  +")'>" + oData.results[i].Ename + "</div>"
							                        + "<div class='L2PFontFamily'>(" + oData.results[i].Pernr + ")</div>";   
							
							
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								vEname_Html += "<div class='L2PFontFamily'>" + dateFormat.format(new Date(oData.results[i].Movda)) + " " + "부서이동" + "</div>";
							}							
							vEname_Html += "</td></tr></table>";
							
							SubjectListOneData.data.push(vEname_Html);
							SubjectListOneData.data.push(oData.results[i].Acttx + "&nbsp;&nbsp;&nbsp;");
							SubjectListOneData.data.push(dateFormat.format(new Date(oData.results[i].Actda)));
							
					
							for(var j=0; j<vColumns.length; j++) {
								if(vColumns[j].control == "img") {
									var val = eval("oData.results[i]." + vColumns[j].data + ";");
									var ImgVal = "";
									if(parseInt(val) > 0) {
										ImgVal = icon4;
									}
//									eval("oneDataSheet." + vColumns[j].id.substring(0, vColumns[j].id.indexOf("_")) + " = val;");
									var value = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'>"
				                        + "<tr><td style='border:0px; width:80px; text-align:center'>" + ImgVal + "</td></tr></table>";
									SubjectListOneData.data.push(value);
								}	
							}
							
							for(var j=0; j<oController.vDisplayControl.length; j++) {
								var Fieldname = oController.vDisplayControl[j].Fieldname;
								Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
								var TextFieldname = Fieldname + "_Tx";
								
								var val = eval("oData.results[i]." + TextFieldname + ";");
								SubjectListOneData.data.push(val + "&nbsp;&nbsp;&nbsp;");
							}
							
							SubjectListOneData.userdata = {"Pernr" : oData.results[i].Pernr};
							
							SubjectListData.rows.push(SubjectListOneData);
							
							if(oController.oSubjectList) {
								console.log("Data : " + oData.results[i].Ename);
								oController.oSubjectList.addRow((i+1), SubjectListOneData.data);
								oController.oSubjectList.setUserData((i+1), "Pernr", oData.results[i].Pernr);
								oController.oSubjectList.setUserData((i+1), "Reqno", oData.results[i].Reqno);
								oController.oSubjectList.setUserData((i+1), "Actda", oData.results[i].Actda);
								oController.oSubjectList.setUserData((i+1), "Docno", oData.results[i].Docno);
								oController.oSubjectList.setUserData((i+1), "VoltId", oData.results[i].VoltId);
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
		oController.oSubjectList.stopFastOperations();
		
		if(oController.oSubjectList && SubjectListData.rows.length > 0) {
//			oController.oSubjectList.parse(SubjectListData,"json");	
			
//			for(var i=1; i< oController.oSubjectList.getColumnsNum(); i++) {
//				oController.oSubjectList.adjustColumnSize(i);	
//			}			
			oController._vListLength = SubjectListData.rows.length;
		}
		
		console.log("Common setRecSubjectListColumn End");
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	onAfterRenderingTable : function(oController) {
		console.log("onAfterRenderingTable !!!");
		if(oController.PAGEID == "ActAppDocument")
			$("#" + oController.PAGEID + "_SubjectList").css("height", window.innerHeight - 370);
		else if(oController.PAGEID == "ActRecDocument"){
			$("#" + oController.PAGEID + "_SubjectList").css("height", window.innerHeight - 380);
		}else if(oController.PAGEID == "ActAppComplete"){
			$("#" + oController.PAGEID + "_SubjectList").css("height", window.innerHeight - 100);
		}
		else{
			$("#" + oController.PAGEID + "_SubjectList").css("height", window.innerHeight - 330);
		}
		
		$("#" + oController.PAGEID + "_SubjectList").empty();
		
		oController.oSubjectList = new dhtmlXGridObject(oController.PAGEID + "_SubjectList");
		oController.oSubjectList.setImagePath("/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/css/imgs/dhxgrid_web/");
		
		var header = "#master_checkbox,";
		var InitWidths = "40,";
		var ColTypes = "ch,";
		var ColAlign = "center,";
		var ColVlign = "middle,";
		
		oController.oSubjectList.setHeader(header.substring(0, header.length - 1),null,["height:35px"]);
		oController.oSubjectList.setInitWidths(InitWidths.substring(0, InitWidths.length - 1));
		oController.oSubjectList.setColAlign(ColAlign.substring(0, ColAlign.length - 1));
		oController.oSubjectList.setColVAlign(ColVlign.substring(0, ColVlign.length - 1));
		oController.oSubjectList.setColTypes(ColTypes.substring(0, ColTypes.length - 1));
		oController.oSubjectList.setAwaitedRowHeight(35);
		oController.oSubjectList.setStyle(
				"min-height : 35px !important; font-size : 15px; text-align : center;  border-left : 1px solid #dddddd; border-bottom : 1px solid #dddddd; vertical-align : middle; background-color : #f7f7f7;",
				"height : 35px !important; font-size : 15px; text-align : center;  border-left : 1px solid #dddddd; border-bottom : 1px solid #dddddd; vertical-align : middle; background-color:rgb(255,255,255);",
				"", "");
		oController.oSubjectList.attachEvent("onCheckbox", oController.doOnCheck);
		oController.oSubjectList.init();
		
		oController.oSubjectList.enableSmartRendering(true);
	},
	
//	doOnCheck : function(rowId, cellInd, state) {
//		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
//		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
//		var vPernr = "";
//		if(zui5_hrxx_actapp2.common.Common.oSubjectList) {
//			vPernr = zui5_hrxx_actapp2.common.Common.oSubjectList.getUserData(rowId, "Pernr");
//		}
//		if(vPernr == "") return;
//		
//		var r_idx = -1;
//		for(var i=0; i<vActionSubjectList.length; i++) {
//			if(vPernr == vActionSubjectList[i].Pernr) {
//				r_idx = i;
//				break;
//			}
//		}
//		if(r_idx != -1) {
//			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", state);
//		}
//	},
	
	doOnCheck : function(rowId, cellInd, state) {
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var vPernr = "";
		if(oController.oSubjectList) {
			vPernr = oController.oSubjectList.getUserData(rowId, "Pernr");
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
	
	onInfoViewPopup2 : function(rowId) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
//		var oController = oView.getController();
		
		oController._vSelected_Pernr = null;
		oController._vSelected_Reqno = null;
		oController._vSelected_Actda = null;
		oController._vSelected_Docno = null;
		
		if(oController.oSubjectList) {
			oController._vSelected_Pernr = oController.oSubjectList.getUserData(rowId,"Pernr");
			oController._vSelected_Reqno = oController.oSubjectList.getUserData(rowId, "Reqno");
			oController._vSelected_Actda = oController.oSubjectList.getUserData(rowId, "Actda");
			oController._vSelected_Docno = oController.oSubjectList.getUserData(rowId, "Docno");
			oController._vSelected_VoltId = oController.oSubjectList.getUserData(rowId, "VoltId");
		}
		
		if(!oController._DetailViewPopover) {
			if(oController._vDocty == "20" || oController._vDocty == "50") {
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
			} else {
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
			}
			oView.addDependent(oController._DetailViewPopover);
		}
		
		var oControl = $("#" + oController.PAGEID + "_row_name_" + rowId);
		oController._DetailViewPopover.openBy(oControl);
		
	},
};