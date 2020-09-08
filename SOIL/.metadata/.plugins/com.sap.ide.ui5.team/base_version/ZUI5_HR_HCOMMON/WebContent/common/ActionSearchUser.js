jQuery.sap.declare("common.ActionSearchUser");
jQuery.sap.require("common.Common");
/** 
* 사원검색의 Dialog를 위한 JS 이다.
* @Create By 정명구
*/

common.ActionSearchUser = {
	/** 
	* @memberOf common.ActionSearchUser
	*/	
	
	oController : null,
	vCallControlId : "",
	oPersonSearchGrid : null,
	
	vHeight : 330,
	
	vColumns : [ {id : "Ename", label : oBundleText.getText("ENAME"), control : "Text", width : "180", align : "left"}, //성명
	             {id : "Pernr", label : oBundleText.getText("PERNR"), control : "Text", width : "80", align : "left"}, //사번
                 {id : "Fulln", label : oBundleText.getText("FULLN"), control : "Text", width : "180", change : "OrgehC", align : "left"}, //소속
                 {id : "Pgtxt", label : oBundleText.getText("PGTXT"), control : "Text", width : "100", change : "PersgC", align : "left"}, //사원그룹
                 {id : "Pktxt", label : oBundleText.getText("PKTXT"), control : "Text", width : "100", change : "PersgC", align : "left"}, //사원하위그룹
                 
                 {id : "Zzjobgrtx", label : oBundleText.getText("ZZJOBGRTX"), control : "Text", width : "80", change : "ZzjobgrC", align : "left"}, //직군
                 {id : "Zzrollvtx", label : oBundleText.getText("ZZROLLVTX"), control : "Text", width : "80", change : "ZzjobgrC", align : "left"}, //Role Level
                 {id : "Zzcaltltx", label : oBundleText.getText("ZZCALTLTX"), control : "Text", width : "80", change : "ZzcaltlC", align : "left"}, //직위
                 {id : "Zzpsgrptx", label : oBundleText.getText("ZZPSGRPTX"), control : "Text", width : "80", change : "ZzpsgrpC", align : "left"}, //직책
                 
                 {id : "Statx", label : oBundleText.getText("STATX"), control : "Text", width : "80", change : "PersgC", align : "left"}, //재직구분
                 {id : "Btrtx", label : oBundleText.getText("BTRTX"), control : "Text", width : "100", change : "BtrtlC", align : "left"}, //인사 하위 영역
                 {id : "Gbdat", label : oBundleText.getText("GBDAT"), control : "Text", width : "80", align : "left"}, //생년월일
                 {id : "Geschtx", label : oBundleText.getText("GESCH"), control : "Text", width : "60", align : "left"}, //성별
                 {id : "Adid", label : oBundleText.getText("ADID"), control : "Text", width : "80", align : "left"}, //AD 계정
                 
                 {id : "Entda", label : oBundleText.getText("ENTDA"), control : "Text", width : "80", align : "left"}, //입사일
                 {id : "Retda", label : oBundleText.getText("RETDA"), control : "Text", width : "80", align : "left"}, //퇴사일
                ],
	
	searchFilterBar: function(oEvent) {
		var oController = common.ActionSearchUser.oController;
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persa");
		
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_AES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_AES_Fulln");
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_AES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persk");
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var oFilters = [];
		var filterString = "/?$filter=Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Accty%20eq%20%27" + "Y" + "%27";
		
		oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, vActda));
		
		if(oPersa.getSelectedKey() != ""){
			filterString += "%20and%20Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey()));
		}
		
		if(oEname.getValue() != "") {
			if(oEname.getValue().length < 2) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SEARCH_NAME"));
				return;
			}
			filterString += "%20and%20Ename%20eq%20%27" + encodeURI(oEname.getValue()) + "%27";
			oFilters.push(new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.EQ, encodeURI(oEname.getValue())));
		}
		
		var oFulln_Tokens = oFulln.getTokens();
		if(oFulln_Tokens && oFulln_Tokens.length) {
			var oFulln_filterString = "";
			for(var i=0; i<oFulln_Tokens.length; i++) {
				if(oFulln_filterString == "") oFulln_filterString = "%20and%20(";
				else oFulln_filterString += "%20or%20";
				oFulln_filterString += "Orgeh%20eq%20%27" + oFulln_Tokens[i].getKey() + "%27";
				oFilters.push(new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, oFulln_Tokens[i].getKey()));
			}
			if(oFulln_filterString != "") filterString += oFulln_filterString + ")";
		}
		
		if(oStat1.getSelectedKey() != "0000") {
			filterString += "%20and%20Stat1%20eq%20%27" + oStat1.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Stat1", sap.ui.model.FilterOperator.EQ, oStat1.getSelectedKey()));
		}
		
		if(oZzjobgr.getSelectedKey() != "0000" && oZzjobgr.getSelectedKey() != "0") {
			filterString += "%20and%20Zzjobgr%20eq%20%27" + oZzjobgr.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzjobgr", sap.ui.model.FilterOperator.EQ, oZzjobgr.getSelectedKey()));
		}
		
		if(oZzcaltl.getSelectedKey() != "0000" && oZzcaltl.getSelectedKey() != "0"  && oZzcaltl.getSelectedKey() != "") {
			filterString += "%20and%20Zzcaltl%20eq%20%27" + oZzcaltl.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzcaltl", sap.ui.model.FilterOperator.EQ, oZzcaltl.getSelectedKey()));
		}
		
		if(oZzpsgrp.getSelectedKey() != "0000" && oZzpsgrp.getSelectedKey() != "0" && oZzpsgrp.getSelectedKey() != "") {
			filterString += "%20and%20Zzpsgrp%20eq%20%27" + oZzpsgrp.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzpsgrp", sap.ui.model.FilterOperator.EQ, oZzpsgrp.getSelectedKey()));
		}
		
		if(oZzrollv.getSelectedKey() != "0000" && oZzrollv.getSelectedKey() != "0" && oZzrollv.getSelectedKey() != "") {
			filterString += "%20and%20Zzrollv%20eq%20%27" + oZzrollv.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzrollv", sap.ui.model.FilterOperator.EQ, oZzrollv.getSelectedKey()));
		}
		
		if(oPersg.getSelectedKey() != "0000" && oPersg.getSelectedKey() != "0") {
			filterString += "%20and%20Persg%20eq%20%27" + oPersg.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persg", sap.ui.model.FilterOperator.EQ, oPersg.getSelectedKey()));
		}
		
		if(oPersk.getSelectedKey() != "0000" && oPersk.getSelectedKey() != "0" && oPersk.getSelectedKey() != "") {
			filterString += "%20and%20Persk%20eq%20%27" + oPersk.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persk", sap.ui.model.FilterOperator.EQ, oPersk.getSelectedKey()));
		}

		if(oFilters.length < 3) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_FILTER"));
			return;
		}
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var mEmpSearchResult = sap.ui.getCore().getModel("ActionEmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		
		oCommonModel.read("/EmpSearchResultSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
//							if(common.ActionSearchUser.oPersonSearchGrid) {
//								common.ActionSearchUser.oPersonSearchGrid.clearAll(false);
//								common.ActionSearchUser.oPersonSearchGrid.startFastOperations();
//							}
							
							var gridData = {data : []};
							
							for(var i=0; i<oData.results.length; i++) {								
								var oneData = oData.results[i];
								
								oneData.Chck = 0;
								if(oneData.Entda != null) {
									oneData.Entda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Entda))));
								} else {
									oneData.Entda = "";
								}
								if(oneData.Retda != null) {
									oneData.Retda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Retda))));
								} else {
									oneData.Retda = "";
								}
								gridData.data.push(oneData);
								
								vEmpSearchResult.EmpSearchResultSet.push(oneData);
								
//								var gridOneData = {id : (i+1), data : []};
//								gridOneData.data.push(false);
//								for(var j=0; j<common.ActionSearchUser.vColumns.length; j++) {
//									var val = eval("oData.results[i]." + common.ActionSearchUser.vColumns[j].id + ";");
//									if(common.ActionSearchUser.vColumns[j].id == "Entda" || 
//											common.ActionSearchUser.vColumns[j].id == "Retda") {
//										if(val != null) gridOneData.data.push("<span class='L2P13Font'>" + dateFormat1.format(new Date(val)) + "</span>");
//										else gridOneData.data.push("<span class='L2P13Font'>&nbsp;</span>");
//									} else {
//										if(common.ActionSearchUser.vColumns[j].align == "left") {
//											gridOneData.data.push("<span class='L2P13Font'>" + val + "&nbsp;</span>");
//										} else {
//											gridOneData.data.push("<span class='L2P13Font'>" + val + "</span>");
//										}
//									}
//								}
//								gridData.rows.push(gridOneData);
//								if(common.ActionSearchUser.oPersonSearchGrid) {
//									common.ActionSearchUser.oPersonSearchGrid.addRow((i+1), gridOneData.data);
//									common.ActionSearchUser.oPersonSearchGrid.setUserData((i+1), "Pernr", oneDate.Pernr);
//								}
							}
							
//							if(common.ActionSearchUser.oPersonSearchGrid) {
//								common.ActionSearchUser.oPersonSearchGrid.stopFastOperations();
//								//console.log(gridData);
//								//common.ActionSearchUser.oPersonSearchGrid.clearAll(false);
//								//common.ActionSearchUser.oPersonSearchGrid.parse(gridData,"json");
//								
//								if(oData.results.length > 0) {
//									for(var i=1; i<(common.ActionSearchUser.vColumns.length + 1); i++) {
//										common.ActionSearchUser.oPersonSearchGrid.adjustColumnSize(i);	
//									}
//								}
//							}
							
							if(vEmpSearchResult.EmpSearchResultSet.length > 0) {
								mEmpSearchResult.setData(vEmpSearchResult);	
							}		
							
							ActionEmpSearchSheet.LoadSearchData(gridData);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	onAfterOpenSearchDialog : function(oEvent) {
		var oController = common.ActionSearchUser.oController;
		
		common.ActionSearchUser.onAfterRendering();
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_AES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzpsgrp");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persg");		
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persa");
//		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persk");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzrollv");
		
		oStat1.removeAllItems();
		oStat1.destroyItems();
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		try {
			oCommonModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oPersa.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Persa, 
											text : oData.results[i].Pbtxt}));
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
		
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Host_werks");
		if(oWerks) {
			oPersa.setSelectedKey(oWerks.getSelectedKey());
		} else {
			oPersa.setSelectedKey(oController._vPersa);
		}
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		
		var vControls = ["Stat1", "Zzjobgr", "Zzcaltl", "Zzpsgrp", "Persg", "Zzrollv"];
		
		filterString += "%20and%20(";
		for(var i=0; i<vControls.length; i++) {			
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if(i != (vControls.length - 1)) {
				filterString += "%20or%20";
			}
//			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext : oBundleText.getText("SELECTDATA")});
			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext : "선택"});
		}
		filterString += ")";
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vEmpCodeList.EmpCodeListSet.push(oData.results[i]);
							}
							mEmpCodeList.setData(vEmpCodeList);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		var oControls = [oStat1, oZzjobgr, oZzcaltl, oZzpsgrp, oPersg , oZzrollv];
		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
			for(var j=0; j<vControls.length; j++) {
				if(vEmpCodeList.EmpCodeListSet[i].Field == vControls[j]) {
					oControls[j].addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
				}
			}
		}
		oStat1.setSelectedKey("3");
	},
	
	onBeforeOpenSearchDialog : function(oEvent) {
		var oController = common.ActionSearchUser.oController;
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persa");
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_AES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_AES_Fulln");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_AES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persk");
		
		oEname.setValue("");
		oFulln.removeAllTokens();
		oFulln.destroyTokens();
		
		oStat1.removeAllItems();
		oZzjobgr.removeAllItems();
		oZzcaltl.removeAllItems();
		oZzpsgrp.removeAllItems();
		oPersg.removeAllItems();
		
		oStat1.destroyItems();
		oZzjobgr.destroyItems();
		oZzcaltl.destroyItems();
		oZzpsgrp.destroyItems();
		oPersg.destroyItems();
		
		oPersa.destroyItems();
		oZzrollv.destroyItems();
		oPersk.destroyItems();
		
		var mEmpSearchResult = sap.ui.getCore().getModel("ActionEmpSearchResult");
		mEmpSearchResult.setData(null);
	},
	
	/*
	 * 사원검색 Dialog를 Close한다.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(common.ActionSearchUser.oController.PAGEID + "_AES_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onExpandFilter : function(oEvent) {
		var oController = common.ActionSearchUser.oController;
		var fExpand = oEvent.getParameter("expand");

		if(fExpand) {
			$("#" + oController.PAGEID + "_AES_Table").css("height", common.ActionSearchUser.vHeight);
		} else {
			$("#" + oController.PAGEID + "_AES_Table").css("height", common.ActionSearchUser.vHeight + 160);
		}
//		oController.oPersonSearchGrid.setSizes();
	},
	
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			common.ActionSearchUser.searchFilterBar();
		}
	},
	
	onAfterRendering : function() { 
		var oController = common.ActionSearchUser.oController;
		
		common.ActionSearchUser.vHeight = window.innerHeight - 300;
		
		$("#" + oController.PAGEID + "_AES_Table").css("height", common.ActionSearchUser.vHeight);
		
		var IBSHeet_Locale = "";
		var vLocale = sap.ui.getCore().getConfiguration().getLanguage().toUpperCase();
		if(vLocale.indexOf("KO") != -1 || vLocale.indexOf("KR") != -1) {
			IBSHeet_Locale = "";
		} else {
			IBSHeet_Locale = "en";
		}
		
		if(typeof ActionEmpSearchSheet == "undefined") {
			createIBSheet2(document.getElementById(oController.PAGEID + "_AES_Table"), "ActionEmpSearchSheet", "100%",  (common.ActionSearchUser.vHeight) + "px", IBSHeet_Locale);
		}	
		
		ActionEmpSearchSheet.Reset();
		
		var initdata = {};
		
		//initdata.Cfg = {SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1, MergeSheet:msHeaderOnly};  //MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:1,ColMove:0,ColResize:1,HeaderCheck:0};
		
		initdata.Cols = [];
		
		initdata.Cols.push({
			Header : oBundleText.getText("LABEL_SELECT"), 
			Width : 30,
			Type : "CheckBox", 
			Edit : 1, 
			SaveName : "Chck", 
			Align : "Center"});
		
		for(var i=0; i<common.ActionSearchUser.vColumns.length; i++) {
			var oneCol = {};
			oneCol.Header = common.ActionSearchUser.vColumns[i].label;
			oneCol.Type = common.ActionSearchUser.vColumns[i].control;
			oneCol.Edit = 0;
			oneCol.SaveName = common.ActionSearchUser.vColumns[i].id;
			oneCol.Align = "Left";
			if(common.ActionSearchUser.vColumns[i].control ==  "Hidden") {
				oneCol.Hidden = true;
			}
			initdata.Cols.push(oneCol);
		}
		
		IBS_InitSheet(ActionEmpSearchSheet, initdata);
		ActionEmpSearchSheet.FitColWidth();
		ActionEmpSearchSheet.SetSelectionMode(0);
		
		ActionEmpSearchSheet.SetCellFont("FontSize", 0, "Chck", ActionEmpSearchSheet.HeaderRows(),  "Retda", 13);
		ActionEmpSearchSheet.SetCellFont("FontName", 0, "Chck", ActionEmpSearchSheet.HeaderRows(),  "Retda", "Malgun Gothic");
		ActionEmpSearchSheet.SetHeaderRowHeight(32);
		ActionEmpSearchSheet.SetDataRowHeight(32);
		
//		$("#" + oController.PAGEID + "_AES_Table").css("height", common.ActionSearchUser.vHeight);
//		
//		common.ActionSearchUser.oPersonSearchGrid = new dhtmlXGridObject(oController.PAGEID + "_AES_Table");
//		common.ActionSearchUser.oPersonSearchGrid.setImagePath("/sap/bc/ui5_ui5/sap/ZL2P01UI59000/css/imgs/dhxgrid_web/");
//		
//		var header = "#master_checkbox,";
//		var InitWidths = "40,";
//		var ColTypes = "ch,";
//		var ColAlign = "center,";
//		var ColVlign = "middle,";
//		var ColSorting = "na,";
//		for(var i=0; i<common.ActionSearchUser.vColumns.length; i++) {
//			header += "<span class='L2P13Font' style='white-space:nowrap;'>" + common.ActionSearchUser.vColumns[i].label + "</span>,";
//			InitWidths += common.ActionSearchUser.vColumns[i].width + ",";
//			ColTypes += common.ActionSearchUser.vColumns[i].control + ",";
//			ColAlign += common.ActionSearchUser.vColumns[i].align + ",";
//			ColVlign += "middle,";
//			ColSorting += "str,";
//		}
//		
//		common.ActionSearchUser.oPersonSearchGrid.setHeader(header.substring(0, header.length - 1));
//		common.ActionSearchUser.oPersonSearchGrid.setInitWidths(InitWidths.substring(0, InitWidths.length - 1));
//		common.ActionSearchUser.oPersonSearchGrid.setColAlign(ColAlign.substring(0, ColAlign.length - 1));
//		common.ActionSearchUser.oPersonSearchGrid.setColVAlign(ColVlign.substring(0, ColVlign.length - 1));
//		common.ActionSearchUser.oPersonSearchGrid.setColTypes(ColTypes.substring(0, ColTypes.length - 1));
//		common.ActionSearchUser.oPersonSearchGrid.setColSorting(ColSorting.substring(0, ColSorting.length - 1));
//		
//		common.ActionSearchUser.oPersonSearchGrid.attachEvent("onCheckbox",common.ActionSearchUser.doOnCheck);
//		
//		common.ActionSearchUser.oPersonSearchGrid.init();
//		
//		common.ActionSearchUser.oPersonSearchGrid.enableSmartRendering(true);
	},
	
//	doOnCheck : function(rowId, cellInd, state) {
//		var mEmpSearchResult = sap.ui.getCore().getModel("ActionEmpSearchResult");
//		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
//		var vPernr = "";
//		if(common.ActionSearchUser.oPersonSearchGrid) {
//			vPernr = common.ActionSearchUser.oPersonSearchGrid.getUserData(rowId, "Pernr");
//		}
//		if(vPernr == "") return;
//		
//		var r_idx = -1;
//		for(var i=0; i<vEmpSearchResult.length; i++) {
//			if(vPernr == vEmpSearchResult[i].Pernr) {
//				r_idx = i;
//				break;
//			}
//		}
//		if(r_idx != -1) {
//			mEmpSearchResult.setProperty("/EmpSearchResultSet/" + r_idx + "/Chck", state);
//		}
//	},
	
	onChangePersa : function(oEvent) {
		var oController = common.ActionSearchUser.oController;
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oItem = oEvent.getParameter("selectedItem");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_AES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_AES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persk");
		
		oStat1.removeAllItems();
		oZzjobgr.removeAllItems();
		oZzcaltl.removeAllItems();
		oZzpsgrp.removeAllItems();
		oPersg.removeAllItems();
		
		oStat1.destroyItems();
		oZzjobgr.destroyItems();
		oZzcaltl.destroyItems();
		oZzpsgrp.destroyItems();
		oPersg.destroyItems();
		
		oZzrollv.destroyItems();
		oPersk.destroyItems();
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oItem.getKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		
		var vControls = ["Stat1", "Zzjobgr", "Zzcaltl", "Zzpsgrp", "Persg", "Zzrollv"];
		
		filterString += "%20and%20(";
		for(var i=0; i<vControls.length; i++) {			
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if(i != (vControls.length - 1)) {
				filterString += "%20or%20";
			}
//			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext : oBundleText.getText("SELECTDATA")});
			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext : "선택"});
		}
		filterString += ")";
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vEmpCodeList.EmpCodeListSet.push(oData.results[i]);
							}
							mEmpCodeList.setData(vEmpCodeList);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		var oControls = [oStat1, oZzjobgr, oZzcaltl, oZzpsgrp, oPersg , oZzrollv];
		
		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
			for(var j=0; j<vControls.length; j++) {
				if(vEmpCodeList.EmpCodeListSet[i].Field == vControls[j]) {
					oControls[j].addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
				}
			}
		}
		oStat1.setSelectedKey("3");
	},
	
	onChangePersg : function(oEvent) {
		var oController = common.ActionSearchUser.oController;
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oItem = oEvent.getParameter("selectedItem");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persa");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_AES_Persk");
		
		oPersk.destroyItems();
		
		if(oItem.getKey() == "0000") return;
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Field%20eq%20%27" + "Persk" + "%27";
		filterString += "%20and%20Excod%20eq%20%27" + oItem.getKey() + "%27";
		
//		oPersk.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
		oPersk.addItem(new sap.ui.core.Item({key : "0000", text : "선택"}));
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oPersk.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode, 
											text : oData.results[i].Etext}));
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	onClickMore : function(oEvent) {
		var oController = common.ActionSearchUser.oController;
		
		var oControl = oEvent.getSource();
		var vText = oControl.getText();
		
		
		var oFilter6 = sap.ui.getCore().byId(oController.PAGEID + "_AES_Filter6");
		var oFilter7 = sap.ui.getCore().byId(oController.PAGEID + "_AES_Filter7");
		var oFilter8 = sap.ui.getCore().byId(oController.PAGEID + "_AES_Filter8");
		var oFilter9 = sap.ui.getCore().byId(oController.PAGEID + "_AES_Filter9");
		
		if(vText == "More" ) {
			oFilter6.setVisible(true);
			oFilter7.setVisible(true);
			oFilter8.setVisible(true);
			oFilter9.setVisible(true);
			oControl.setText("Hide");
		} else {
			oFilter6.setVisible(false);
			oFilter7.setVisible(false);
			oFilter8.setVisible(false);
			oFilter9.setVisible(false);
			oControl.setText("More");
		}
	},
	
	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onAESSelectPerson : function(oEvent) {
		var mEmpSearchResult = sap.ui.getCore().getModel("ActionEmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var vEname = "";
		var vPernr = "";
		var check_cnt = 0;
		
		if(vEmpSearchResult && vEmpSearchResult.length) {
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					vEname = vEmpSearchResult[i].Ename;
					vPernr = vEmpSearchResult[i].Pernr;
					check_cnt++;
				}				
			}
		}
		if(check_cnt == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON")); 
			return;
		} else if(check_cnt > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON_ONLYONE")); 
			return;
		}
		
		if(vEname == "" || vPernr =="") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var oInput = sap.ui.getCore().byId(common.ActionSearchUser.vCallControlId);
		if(oInput) {
			oInput.setValue(vEname);
			oInput.removeAllCustomData();
			var vTmp = common.ActionSearchUser.vCallControlId.split("_");
			var vTmpId = common.ActionSearchUser.vCallControlId.replace(vTmp[0]+ "_", "");
			oInput.addCustomData(new sap.ui.core.CustomData({key : vTmpId, value :vPernr}));
		}
		
		//Dialog를 Close한다.
		common.ActionSearchUser.onClose();
	},
};

function ActionEmpSearchSheet_OnSearchEnd(result) {
//	if(result) {
	ActionEmpSearchSheet.FitSize(1, 1);
	
	ActionEmpSearchSheet.SetCellFont("FontSize", 0, "Chck", ActionEmpSearchSheet.RowCount() + ActionEmpSearchSheet.HeaderRows(),  "Retda", 13);
	ActionEmpSearchSheet.SetCellFont("FontName", 0, "Chck", ActionEmpSearchSheet.RowCount() + ActionEmpSearchSheet.HeaderRows(),  "Retda", "Malgun Gothic");
//	}
}

function ActionEmpSearchSheet_OnBeforeCheck(Row, Col) {
	var mEmpSearchResult = sap.ui.getCore().getModel("ActionEmpSearchResult");
	var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
	
	var vPernr = ActionEmpSearchSheet.GetCellValue(Row, "Pernr");
	if(vPernr == "") return;
		
	var r_idx = -1;
	for(var i=0; i<vEmpSearchResult.length; i++) {
		if(vPernr == vEmpSearchResult[i].Pernr) {
			r_idx = i;
			break;
		}
	}
	
	if(r_idx != -1) {
		if(ActionEmpSearchSheet.GetCellValue(Row, "Chck") == 0) {
			mEmpSearchResult.setProperty("/EmpSearchResultSet/" + r_idx + "/Chck", true);
		} else {
			mEmpSearchResult.setProperty("/EmpSearchResultSet/" + r_idx + "/Chck", false);
		}
	}
}
