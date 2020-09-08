jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actpayscale.IncreateEmployeeList", {
	PAGEID : "IncreateEmployeeList",
	
	BusyDialog : null,
	_SortDialog : null,
	_ErrorMessagePopover : null,
	_SearchCond : "" ,
	_vMolga : "",

	oBundleText : jQuery.sap.resources({
		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	
	vColumns : [ {id : "Numbr",      label : oBundleText.getText("NUMBER_2"), control : "Text", hidden : 0, width : "60" },
	             {id : "Uptyp_Html", label : oBundleText.getText("MSG"),      control : "Html", hidden : 0, width : "60"}, 
	             {id : "Uptyp",      label : oBundleText.getText("MSG"),      control : "Text", hidden : 1, width : "60"},
	             {id : "ApstaImg",   label : oBundleText.getText("STATU"),    control : "Html", hidden : 0, width : "60"},
	             {id : "Apsta",      label : oBundleText.getText("STATU"),    control : "Text", hidden : 1, width : "60"},
	             {id : "Pernr",      label : oBundleText.getText("PERNR"),    control : "Text", hidden : 0, width : "70"},
	             {id : "Ename",      label : oBundleText.getText("ENAME"),    control : "Text", hidden : 0, width : "*"},
	             {id : "ZzjobgrTx",  label : oBundleText.getText("ZZJOBGR"),  control : "Text", hidden : 0, width : "*"},
	             {id : "ZzjobsrTx",  label : oBundleText.getText("ZZJOBSR"),  control : "Text", hidden : 0, width : "*"},
	             {id : "ZzcaltltxTx",label : oBundleText.getText("ZZCALTL"),  control : "Text", hidden : 0, width : "*"},
	             {id : "ZzpsgrpTx",  label : oBundleText.getText("ZZPSGRP"),  control : "Text", hidden : 0, width : "*"},
	             {id : "OrgehTx",    label : oBundleText.getText("ORGEH2"),   control : "Text", hidden : 0, width : "*"},
	             {id : "Cutrfst",    label : oBundleText.getText("CURTRFST"), control : "Text", hidden : 0, width : "60" },
	             {id : "Creda",      label : oBundleText.getText("DATLO"),    control : "Text", hidden : 0, width : "60"},
	             {id : "Entdt",      label : oBundleText.getText("ENTDT"),    control : "Text", hidden : 0, width : "80"},
	             {id : "Predt",      label : oBundleText.getText("PREDT"),    control : "Text", hidden : 0, width : "80"},
	             {id : "Zztrfst",    label : oBundleText.getText("ZZTRFST"),  control : "Text", hidden : 0, width : "80"},
	             {id : "Stvor",      label : oBundleText.getText("STVOR"),    control : "Text", hidden : 0, width : "80"},
	             {id : "Insyn",      label : oBundleText.getText("INSYN"),    control : "Text", hidden : 0, width : "60"},
	             {id : "Insdt",      label : oBundleText.getText("INSDT"),    control : "Text", hidden : 1, width : "60"},
	             {id : "Zztrfgr",    label : oBundleText.getText("TRFGR"),    control : "Text", hidden : 1, width : "60"},
	             {id : "Werks",      label : oBundleText.getText("PERSA"),    control : "Text", hidden : 1, width : "60"},
	             {id : "Zzjobgr",    label : oBundleText.getText("ZZJOBGR"),  control : "Text", hidden : 1, width : "*"}, 
	             {id : "Zzjobsr",    label : oBundleText.getText("ZZJOBSR"),  control : "Text", hidden : 1, width : "*"},
	             {id : "Zzcaltl",    label : oBundleText.getText("ZZCALTL"),  control : "Text", hidden : 1, width : "*"}, 
	             {id : "Zzpsgrp",    label : oBundleText.getText("ZZPSGRP"),  control : "Text", hidden : 1, width : "*"}],
	            	
             
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		//};
		
		var oEmpLoginInfoModel = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfoData = oEmpLoginInfoModel.getProperty("/EmpLoginInfoSet");
		var oWerks = sap.ui.getCore().byId(this.PAGEID + "_Werks");
		var oIconTabbar = sap.ui.getCore().byId(this.PAGEID + "_ICONBAR");
		var skey = jQuery.sap.getUriParameters().get("skey");
		try {
				oWerks.addItem(
					new sap.ui.core.Item({
						key : vEmpLoginInfoData[0].Persa, 
						text : vEmpLoginInfoData[0].Pbtxt
					})
				);
				oWerks.setSelectedKey(vEmpLoginInfoData[0].Persa);
				this._vMolga = vEmpLoginInfoData[0].Molga ;
			
			if(skey && skey != "") {
				oIconTabbar.setSelectedKey(skey);
			}
			
			
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var oEmpCodeModel = sap.ui.getCore().getModel("EmpCodeList");
		var vEmpCodeData = oEmpCodeModel.getProperty("/EmpCodeListSet");
		var oZzjobgr = sap.ui.getCore().byId(this.PAGEID + "_Zzjobgr");
		var oZzjobsr = sap.ui.getCore().byId(this.PAGEID + "_Zzjobsr");
		var oZzcaltl = sap.ui.getCore().byId(this.PAGEID + "_Zzcaltl");
		oZzcaltl.addItem(
				new sap.ui.core.Item({
					key : "00", 
					text : oBundleText.getText("SELECTDATA")
				})
			);	
		try {
			for(var i=0; i<vEmpCodeData.length; i++) {
				if(vEmpCodeData[i].Field == "Zzjobgr"){
					oZzjobgr.addItem(
						new sap.ui.core.Item({
							key : vEmpCodeData[i].Ecode, 
							text : vEmpCodeData[i].Etext
						})
					);
				}else if(vEmpCodeData[i].Field == "Zzjobsr"){
					oZzjobsr.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeData[i].Ecode, 
								text : vEmpCodeData[i].Etext
							})
						);	
				}else if(vEmpCodeData[i].Field == "Zzcaltl"){
					oZzcaltl.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeData[i].Ecode, 
								text : vEmpCodeData[i].Etext
							})
						);	
				}
			};
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var oInsyn = sap.ui.getCore().byId(this.PAGEID + "_Insyn");
		oInsyn.addItem(
				new sap.ui.core.Item({
					key : "", 
					text : oBundleText.getText("ALL_ENTRY")
				})
			);	
		oInsyn.addItem(
				new sap.ui.core.Item({
					key : "Y", 
					text : oBundleText.getText("INS")
				})
			);	
		oInsyn.addItem(
				new sap.ui.core.Item({
					key : "N", 
					text : oBundleText.getText("LIMIT")
				})
			);	
		
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				//common.Common.log("onAfterShow " + new Date());
				this.onAfterShow(evt);
			}, this),
		});
		
		sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf epmproductapp.EPMProductApp
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf epmproductapp.EPMProductApp
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf epmproductapp.EPMProductApp
*/
//	onExit: function() {
//
//	}
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_IncreateEmpList").css("height", window.innerHeight - 360);
		$("#" + this.PAGEID + "_IncreateEmpList").css("width", "100%");
	},	
	/*
	 * 페이지가 표시되기전에 수행한다.
	 * 바인딩 전에 안내메세지 출력 후 바인딩이 완료되면 메세지 창을 닫는다.
	 */
	onBeforeShow: function(evt) {
		this.onInitCode();
		this.onChangeData();
	},
	
	onAfterShow : function(oEvent) {
		this.onInitCode();
		this.onAfterRenderingTableLayout();
		this.setBtnVisible(this , false);
	},
	
	onAfterRenderingTableLayout : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		
		$("#" + oController.PAGEID + "_IncreateEmpList").css("height", window.innerHeight - 360);
		if(typeof IncEmpListDataSheet == "undefined") {
			var vWidth = window.innerWidth + "px" ;
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_IncreateEmpList"), "IncEmpListDataSheet", vWidth,  (window.innerHeight - 360) + "px", vLang);
		}	
		
		IncEmpListDataSheet.Reset();
		
		var initdata = {};
		
		initdata.Cfg = {SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1};  //MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:1,ColMove:0,ColResize:1,HeaderCheck:1};
		
		initdata.Cols = [];
		
		initdata.Cols.push({
			Header : "", 
			Width : 30,
			Type : "CheckBox", 
			Edit : 1, 
			SaveName : "Ichek", 
			Align : "Center"});
		
		for(var i=0; i<oController.vColumns.length; i++) {
			var oneCol = {};
			oneCol.Header = oController.vColumns[i].label;
			oneCol.Type = oController.vColumns[i].control;
			oneCol.Edit = 0;
			oneCol.SaveName = oController.vColumns[i].id;
			oneCol.Align = "Center";			
			oneCol.Hidden = oController.vColumns[i].hidden;
			
			initdata.Cols.push(oneCol);
		}
		
		IBS_InitSheet(IncEmpListDataSheet, initdata);
		IncEmpListDataSheet.FitColWidth();
		IncEmpListDataSheet.SetSelectionMode(1);
		
		IncEmpListDataSheet.SetCellFont("FontSize", 0, "Ichek", IncEmpListDataSheet.HeaderRows(),  "Zztrfgr", 13);
		IncEmpListDataSheet.SetCellFont("FontName", 0, "Ichek", IncEmpListDataSheet.HeaderRows(),  "Zztrfgr", "Malgun Gothic");
		IncEmpListDataSheet.SetHeaderRowHeight(32);
		IncEmpListDataSheet.SetDataRowHeight(32);
	},
	
	onInitCode :function(oEvent){
		var oZzjobgr = sap.ui.getCore().byId(this.PAGEID + "_Zzjobgr");
		var oZzjobsr = sap.ui.getCore().byId(this.PAGEID + "_Zzjobsr");
		var oZzcaltl = sap.ui.getCore().byId(this.PAGEID + "_Zzcaltl");
		var oSwitch = sap.ui.getCore().byId(this.PAGEID + "_Input_Switch");
		var oZzjobgrCnt = oZzjobgr.getItems();
		if(oZzjobgrCnt.length > 0){
			oZzjobgr.setSelectedKey("32"); // 기술직 Setting
		}
		var oZzjobsrCnt = oZzjobsr.getItems();
		if(oZzjobsrCnt.length > 0){
			oZzjobsr.setSelectedItem(oZzjobsr.getFirstItem()); // Default 첫번째
		}
		var oZzcaltlCnt = oZzcaltl.getItems();
		if(oZzcaltlCnt.length > 0){
			oZzcaltl.setSelectedItem(oZzcaltl.getFirstItem()); // Default 첫번째 
		}
		oSwitch.setState(false);
		this.onChangeSwitch();
		
	},
	
	handleIconTabBarSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
	
		var sKey = oIconTabbar.getSelectedKey();
		var vApsta = "00";
		if (sKey === "creation") {
			vApsta = "10";
	    } else if (sKey === "complete") {
	    	vApsta = "20";
	    } else if( sKey === "search"){
	    	vApsta = "";
	    }
		var IncreasetListData = {data : []};
		var mPayscaleIncreaseList = sap.ui.getCore().getModel("PayscaleIncreaseList");
		var vPayscaleIncreaseList = mPayscaleIncreaseList.getProperty("/PayscaleIncreaseListSet");
		if(!vPayscaleIncreaseList) return ;
		var vRowCnt = 0;
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/increate00.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/increate10.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/increate20.png'>";
		
		for(var i=0; i< vPayscaleIncreaseList.length; i++) {
			
			if( vPayscaleIncreaseList[i].Apsta == vApsta || vApsta == "00"){
				var oneDataSheet = vPayscaleIncreaseList[i];
				oneDataSheet.Ichek = false ;
				oneDataSheet.Numbr = i+1 ;
				if(vPayscaleIncreaseList[i].Apsta == "10"){
					oneDataSheet.ApstaImg = icon2;
				}else if(vPayscaleIncreaseList[i].Apsta == "20"){
					oneDataSheet.ApstaImg = icon3;
				}else{
					oneDataSheet.ApstaImg = icon1;
				}
				oneDataSheet.Uptyp_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent;'><td style='padding-left:5px; border:0px;'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:red; cursor:pointer; text-align : center;' onclick='onInfoViewPopup(" + (i+1) + ")'>" + vPayscaleIncreaseList[i].Uptyp + "</div></td></tr></table>";
				if(vPayscaleIncreaseList[i].Entdt != null && vPayscaleIncreaseList[i].Entdt != "" ){
					if(oEvent) oneDataSheet.Entdt = vPayscaleIncreaseList[i].Entdt;
					else oneDataSheet.Entdt = dateFormat.format(new Date(common.Common.setTime(new Date(vPayscaleIncreaseList[i].Entdt))));
				}else{
					oneDataSheet.Entdt = "";
				}
				if(vPayscaleIncreaseList[i].Predt != null && vPayscaleIncreaseList[i].Predt != "" ){
					if(oEvent) oneDataSheet.Predt = vPayscaleIncreaseList[i].Predt;
					else oneDataSheet.Predt = dateFormat.format(new Date(common.Common.setTime(new Date(vPayscaleIncreaseList[i].Predt))));
				}else{
					oneDataSheet.Predt = "";
				}
				if(vPayscaleIncreaseList[i].Stvor != null && vPayscaleIncreaseList[i].Stvor != "" ){
					if(oEvent) oneDataSheet.Stvor = vPayscaleIncreaseList[i].Stvor;
					else oneDataSheet.Stvor = dateFormat.format(new Date(common.Common.setTime(new Date(vPayscaleIncreaseList[i].Stvor))));
				}else{
					oneDataSheet.Stvor = "";
				}
				if(vPayscaleIncreaseList[i].Creda != null && vPayscaleIncreaseList[i].Creda != "" ){
					if(oEvent) oneDataSheet.Creda = vPayscaleIncreaseList[i].Creda;
					else oneDataSheet.Creda = dateFormat.format(new Date(common.Common.setTime(new Date(vPayscaleIncreaseList[i].Creda))));
				}else{
					oneDataSheet.Creda = "";
				}
				IncreasetListData.data.push(oneDataSheet);
				vRowCnt++;
			}
		}

		IncEmpListDataSheet.LoadSearchData(IncreasetListData);
		
		if(vRowCnt == 0) oController.setBtnVisible(oController, false);
		else oController.setBtnVisible(oController, true);
			
		if(!oEvent){
			oIconTabbar.setExpanded(true);
		}
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var oInsdt = sap.ui.getCore().byId(oController.PAGEID + "_Insdt");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_Zzjobgr");
		var oZzjobsr = sap.ui.getCore().byId(oController.PAGEID + "_Zzjobsr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_Zzcaltl");
		var oInsyn = sap.ui.getCore().byId(oController.PAGEID + "_Insyn");
		var vSwitch = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch").getState();
		var filterString = "";
	    
	    
	    if(oInsdt.getValue() == "" || oInsdt.getValue() == null){
			sap.m.MessageBox.alert(oBundleText.getText( "MSG_INPUT_INSDT"));
			return ;
		}
	    
	    var oControl = this;
		var oCustomData = oControl.getCustomData();
		var vStep = oCustomData[0].getValue();
		oController._SearchCond = vStep ; 
		if(vSwitch == true){
		    filterString += "/?$filter=Werks%20eq%20%27" + oWerks.getSelectedKey() + "%27";  
		    filterString += "%20and%20";  
		    filterString += "(Insdt%20eq%20datetime%27" + oInsdt.getValue() + "T00%3a00%3a00%27)";
		    filterString += "%20and%20";  
		    filterString += "Step%20eq%20%27" + "10" + "%27";  
	    }else{
		    filterString += "/?$filter=Werks%20eq%20%27" + oWerks.getSelectedKey() + "%27";  
		    filterString += "%20and%20";  
		    filterString += "Zzjobgr%20eq%20%27" + oZzjobgr.getSelectedKey() + "%27";  
		    filterString += "%20and%20";  
		    filterString += "Zzjobsr%20eq%20%27" + oZzjobsr.getSelectedKey() + "%27";  
		    filterString += "%20and%20"; 
		    if(oZzcaltl.getSelectedKey() != "" && oZzcaltl.getSelectedKey() != "00"){
			    filterString += "Zzcaltl%20eq%20%27" + oZzcaltl.getSelectedKey() + "%27";  
			    filterString += "%20and%20"; 
		    }
		    filterString += "(Insdt%20eq%20datetime%27" + oInsdt.getValue() + "T00%3a00%3a00%27)";
		    
		  
			if(vStep == "10" && oInsyn.getSelectedKey()){
				filterString += "%20and%20";  
			    filterString += "Insyn%20eq%20%27" + oInsyn.getSelectedKey() + "%27";  
			}
			filterString += "%20and%20";  
		    filterString += "Step%20eq%20%27" + vStep + "%27";  
		}
		
		

		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			if(vStep == "10"){
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			}else{
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PERNR_SELECT_WAIT")}));
			}
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			if(vStep == "10"){
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			}else{
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PERNR_SELECT_WAIT")}));
			}
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mPayscaleIncreaseList = sap.ui.getCore().getModel("PayscaleIncreaseList");
		var vPayscaleIncreaseList = {PayscaleIncreaseListSet : []};
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt5 = 0;
		
		var readAfterProcess = function() {
			var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
			var oFilterSearch = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_SEARCH");
			var oFilterCreate = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CRETAE");
			var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
			
			oFilterAll.setCount(vReqCntAll);
			oFilterSearch.setCount(vReqCnt1);
			oFilterCreate.setCount(vReqCnt2);
			oFilterCompalte.setCount(vReqCnt5);
			oController.handleIconTabBarSelect();
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
		};

		var oModel = sap.ui.getCore().getModel("ZHRXX_PAYSCALE_SRV");
		oModel.read("/PayscaleIncreaseListSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vPayscaleIncreaseList.PayscaleIncreaseListSet.push(oData.results[i]);
								vPayscaleIncreaseList.PayscaleIncreaseListSet[i].Numbr = i + 1 ;
								if(oData.results[i].Apsta == "10") vReqCnt2++;
								else if(oData.results[i].Apsta == "20") vReqCnt5++;
								else vReqCnt1 ++ ;
							}
							vReqCntAll = oData.results.length;
							mPayscaleIncreaseList.setData(vPayscaleIncreaseList);
							readAfterProcess();
						}
					},
					function(oError) {
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
						
						var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(oError);
						}

					}
		);
	},
	
	onChangeData : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var oInsdt = sap.ui.getCore().byId(oController.PAGEID + "_Insdt");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_Zzjobgr");
		var oZzjobsr = sap.ui.getCore().byId(oController.PAGEID + "_Zzjobsr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_Zzcaltl");
		var oInsyn   = sap.ui.getCore().byId(oController.PAGEID + "_Insyn");
		var oSwitch   = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		
		
		var vWerks  = oWerks.getSelectedItem();
		var vInsdt  = "" ;
		if(oInsdt.getValue() != "" && oInsdt.getValue() != null ){
			console.log(oInsdt.getValue());
			vInsdt = dateFormat.format(new Date(common.Common.setTime(new Date(oInsdt.getValue()))));
		}
		var vZzjobgr  = oZzjobgr.getSelectedItem();
		var vZzjobsr  = oZzjobsr.getSelectedItem();
		var vZzcaltl  = oZzcaltl.getSelectedItem();
		var vInsyn    = oInsyn.getSelectedItem();
		
		var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Pbtxt");
		var vFilterInfo = "";
		
		if(oControl) {			
			if(vWerks && vWerks != "") {
				vFilterInfo += vWerks.getText() + ", ";
			}
			if(vInsdt && vInsdt != "") {
				vFilterInfo += vInsdt + ", ";
			}
			if(oSwitch.getState() == false){
				if(vZzjobgr && vZzjobgr != "") {
					vFilterInfo += vZzjobgr.getText()  + ", ";
				}
				if(vZzjobsr && vZzjobsr != "") {
					vFilterInfo += vZzjobsr.getText()  + ", ";
				}
				if(vZzcaltl && vZzcaltl != "" && vZzcaltl.getKey() !="00") {
					vFilterInfo += vZzcaltl.getText()  + ", ";
				}
				if(vInsyn && vInsyn != "") {
					vFilterInfo += vInsyn.getText()  + ", ";
				}
			}
			oControl.setText(vFilterInfo);
		}
		
	},
	
	onPressDel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();	
		var oModel = sap.ui.getCore().getModel("ZHRXX_PAYSCALE_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var vSwitch = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch").getState();
		var vInsdt = "";
		var vApsta = "";
		var vWerks  = "";
		var vPernr   = "";
		var process_result = true;
		
		var vRowCount = IncEmpListDataSheet.RowCount();
		var vHeaderCount = IncEmpListDataSheet.HeaderRows();
		var vSelectCnt = 0;
		var checkRow = {};
		for(var i = 0; i < vRowCount ; i++){
			checkRow = IncEmpListDataSheet.GetRowJson(i + vHeaderCount); 
			if(checkRow.Ichek == true){
				if(checkRow.Uptyp == "E"){
					sap.m.MessageBox.alert(oBundleText.getText( "MSG_INCLUDE_ERROR2"));
					return ; 
				}
				
				if(checkRow.Apsta == "20"){
					sap.m.MessageBox.alert(oBundleText.getText( "MSG_FAMILY_DELETE_INVALID_DOCUMENT"));
					return ;
				}
				vSelectCnt ++;
			}
		}
		
		if(vSelectCnt == 0){
			sap.m.MessageBox.alert(oBundleText.getText( "MSG_DELETE_TARGET"));
			return ;				
		}
		var deleteProcess = function() {
			for(var  i = 0 ; i< vRowCount  ; i++){
				if(IncEmpListDataSheet.GetCellValue(i + vHeaderCount, "Ichek") == 0){
					continue ;
				}
				vInsdt = IncEmpListDataSheet.GetCellValue(i+ vHeaderCount, "Insdt"); 
				vWerks = IncEmpListDataSheet.GetCellValue(i+ vHeaderCount, "Werks"); 
				vPernr = IncEmpListDataSheet.GetCellValue(i+ vHeaderCount, "Pernr"); 
				vApsta = IncEmpListDataSheet.GetCellValue(i+ vHeaderCount, "Apsta"); 
				
				var oPath = "/PayscaleIncreaseListSet(Pernr='" + vPernr + "'," +
				"Werks='" + vWerks +"'," +
				"Apsta='" + vApsta +"'," +
			    "Insdt="  + "datetime%27" + dateFormat.format( new Date(vInsdt)) + "T00%3a00%3a00%27" + ")";
				
				
				oModel.remove( oPath ,
						null,
					    function (oData, response) {
							common.Common.log("Sucess PayscaleIncreaseListSet Delete !!!");
					    },
					    function (oError) {
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
							process_result = false;
					    }
						
				);
			};
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			if(process_result){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
				 	icon: sap.m.MessageBox.Icon.INFORMATION,
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						var oSearch_Btn ;
						if(oController._SearchCond == "10" || vSwitch == true){ // 검색
							oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_10");
						}else{  //대상자 선정
							oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_20");
						}
						oSearch_Btn.firePress();
					}
				});
			}else{
				var oSearch_Btn ;
				if(oController._SearchCond == "10" || vSwitch == true){ // 검색
					oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_10");
				}else{  //대상자 선정
					oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_20");
				}
				oSearch_Btn.firePress();
			}
		};
		
		var totalCntSearch = {};
		var confirmMsg = "";
		if( vSwitch == true ){
			totalCntSearch = oController.onSearchCnt(oController);
			confirmMsg = oBundleText.getText("MSG_INC_DELETE_CONFIRM");
			var cnt = parseInt(totalCntSearch.Count);
			confirmMsg = confirmMsg.replace("%cnt1", cnt);
			confirmMsg = confirmMsg.replace("%cnt2", vSelectCnt);
			
		}else{
			confirmMsg = oBundleText.getText("MSG_DELETE_CONFIRM");
		}
		
		
		sap.m.MessageBox.show(confirmMsg, {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("INFORMATION"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: function(oAction) { 
	        	if ( oAction === sap.m.MessageBox.Action.YES ) {
	        		if(!oController.BusyDialog) {
	    				oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
	    				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETING_WAIT")}));
	    				oController.getView().addDependent(oController.BusyDialog);
	    			} else {
	    				oController.BusyDialog.removeAllContent();
	    				oController.BusyDialog.destroyContent();
	    				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETING_WAIT")}));
	    				
	    			}
	    			oController.BusyDialog.open();
	        		setTimeout(deleteProcess, 300);
	        	}else{
	        		
	        	}
	        }
		});
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();	
		var oModel = sap.ui.getCore().getModel("ZHRXX_PAYSCALE_SRV");
		var oControl = this;
		var oCustomData = oControl.getCustomData();
		var vApsta = oCustomData[0].getValue();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var vSwitch = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch").getState();
		var vInsdt = "", vWerks  = "" , vPernr   = "", vFilerInst   = "";
		var process_result = true;
	    var updateData = {};
		
		var vRowCount = IncEmpListDataSheet.RowCount();
		var vHeaderCount = IncEmpListDataSheet.HeaderRows();
		var vSelectCnt = 0;
		var checkRow = {};
		for(var i = 0; i < vRowCount ; i++){
			checkRow = IncEmpListDataSheet.GetRowJson(i + vHeaderCount); 
			if(checkRow.Ichek == true){
				if(checkRow.Uptyp == "E"){
					sap.m.MessageBox.alert(oBundleText.getText( "MSG_INCLUDE_ERROR2"));
					return ; 
				}
				
				if(checkRow.Apsta == "20"){
					sap.m.MessageBox.alert(oBundleText.getText( "MSG_RETIRE_ALREADY_ACTION"));
					return ;
				}
				if(vApsta == "20"){ // 발령확정일 경우 
					if(checkRow.Apsta != "10"){
						sap.m.MessageBox.alert(oBundleText.getText( "MSG_ASTAT_LIMIT"));
						return ;
					}
				}
				if(vSelectCnt==0){
					vFilerInst = checkRow.Insdt;
					vInsdt = "\/Date(" + common.Common.getTime(vFilerInst) + ")\/";
					vZzjobgr = checkRow.Zzjobgr; 
					vZzjobsr = checkRow.Zzjobsr;
//					vZzcaltl = checkRow.Zzcaltl;
					vInsyn   = checkRow.Insyn;
					vWerks   = checkRow.Werks;
					vPernr   = checkRow.Pernr;
					vUpdatePernrs = vPernr;
				}else{
					vUpdatePernrs += "|" + checkRow.Pernr;
				}
				vSelectCnt ++;
			}
		}
		
		if(vSelectCnt == 0){
			sap.m.MessageBox.alert(oBundleText.getText( "MSG_NO_SELECT"));
			return ;				
		}
		
		var saveProcess = function() {
				updateData.PernrL = vUpdatePernrs ;
				updateData.Insdt = vInsdt ;
				updateData.Zzjobgr = vZzjobgr ;
				updateData.Zzjobsr = vZzjobsr ;
//				updateData.Zzcaltl = vZzcaltl ;
				updateData.Insyn =  vInsyn ;
				updateData.Werks =  vWerks ;
				updateData.Apsta = vApsta ;
				
				try {
					var oPath = "/PayscaleIncreaseListSet(Pernr='" + vPernr + "'," +
								"Werks='" + vWerks +"'," +
								"Apsta='" + vApsta +"'," +
							    "Insdt="  + "datetime%27" + dateFormat.format( new Date(vFilerInst)) + "T00%3a00%3a00%27" + ")";
					oModel.update(
							oPath, 
							updateData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess PayscaleIncreaseList Update !!!");
						    },
						    function (oError) {
						    	var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									common.Common.showErrorMessage(oError);
								}
								process_result = false;
						    }
				    );
					if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
					if(!process_result) {
						
						if (oController._SearchCond == "10"  || vSwitch == true){ // 검색
							var oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_10");
							oSearch_Btn.firePress();
						}else{  // 대상자 선정
							var oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_20");
							oSearch_Btn.firePress();
						}
						return;
					}else{
						if (vApsta == "10"){ //저장
							sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
							 	icon: sap.m.MessageBox.Icon.INFORMATION,
								title: oBundleText.getText("INFORMATION"),
								onClose : function() {
									var oSearch_Btn ;
									if(oController._SearchCond == "10"  || vSwitch == true){ // 검색
										oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_10");
									}else{  //대상자 선정
										oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_20");
									}
									oSearch_Btn.firePress();
								}
							});
						}else{ // 발령확정
							sap.m.MessageBox.alert(oBundleText.getText("MSG_LOA_COMPLETE"), {
							 	icon: sap.m.MessageBox.Icon.INFORMATION,
								title: oBundleText.getText("INFORMATION"),
								onClose : function() {
									var oSearch_Btn ;
									if(oController._SearchCond == "10"  || vSwitch == true){ // 검색
										oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_10");
									}else{  //대상자 선정
										oSearch_Btn = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_20");
									}
									oSearch_Btn.firePress();
								}
							});
						}
						
					}
				}catch(Ex) {
					common.Common.log(Ex);
				} finally {
					if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
				}
		};
				
		var totalCntSearch = {};
		var confirmMsg = "";
		if( vSwitch == true ){
			totalCntSearch = oController.onSearchCnt(oController);
			if( vApsta== "10")	confirmMsg = oBundleText.getText("MSG_INC_SAVE_CONFIRM");
			else	confirmMsg = oBundleText.getText("MSG_INC_REQUEST_CONFIRM");
			var cnt = parseInt(totalCntSearch.Count);
			confirmMsg = confirmMsg.replace("%cnt1", cnt);
			confirmMsg = confirmMsg.replace("%cnt2", vSelectCnt);
			
		}else{
			if( vApsta== "10")	confirmMsg = oBundleText.getText("MSG_SAVE_QUESTION");
			else	confirmMsg = oBundleText.getText("MSG_PAYSCALE_QUESTION");
		}
		
		
		sap.m.MessageBox.show(confirmMsg, {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("INFORMATION"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: function(oAction) { 
	        	if ( oAction === sap.m.MessageBox.Action.YES ) {
	        		if(!oController.BusyDialog) {
	    				oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
	    				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
	    				oController.getView().addDependent(oController.BusyDialog);
	    			} else {
	    				oController.BusyDialog.removeAllContent();
	    				oController.BusyDialog.destroyContent();
	    				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
	    				
	    			}
	    			oController.BusyDialog.open();
	        		setTimeout(saveProcess, 300);
	        	}else{
	        		
	        	}
	        }
		});
	},
	
	setBtnVisible : function(oController, visibleYn){
		var oDelBtn = sap.ui.getCore().byId(oController.PAGEID + "_DEL_BTN");
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		var oRequstBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		oDelBtn.setVisible(visibleYn);
		oSaveBtn.setVisible(visibleYn);
		oRequstBtn.setVisible(visibleYn);
	},
	
	onPressDownload : function(oEvent) {
		var params = { FileName : "IncreateEmployeeList.xls",  SheetName : "Sheet", 
					   HiddenColumn : 0,
				       DownCols:'1|3|5|6|7|8|9|10|11|12|13|14|15|16|17|18',
				       } ;
		if(typeof IncEmpListDataSheet == "object") {

				
			IncEmpListDataSheet.Down2Excel(params);
		}
		
	},
	
	downloadExcelFormat : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		if(oController._vMolga == "41")
			document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actpayscale/excelfile/Excel_Style_Ko.xls";
		else if(oController._vMolga == "28")
			document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actpayscale/excelfile/Excel_Style_Cn.xls";
		else 
			document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actpayscale/excelfile/Excel_Style_En.xls";
	},
	
	onChangeSwitch : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		
		var oSwitch = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_Zzjobgr_Layout");
		var oZzjobsr = sap.ui.getCore().byId(oController.PAGEID + "_Zzjobsr_Layout");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_Zzcaltl_Layout");
		var oInsyn = sap.ui.getCore().byId(oController.PAGEID + "_Insyn_Layout");
		var oSEARCH_10 = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_10");
		var oSEARCH_20 = sap.ui.getCore().byId(oController.PAGEID + "_SEARCH_20");
		var oUploadBtn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
		
		if(oSwitch.getState() == false) {
			oZzjobgr.removeStyleClass("L2PDisplayNone");  
			oZzjobsr.removeStyleClass("L2PDisplayNone");  
			oZzcaltl.removeStyleClass("L2PDisplayNone");  
			oInsyn.removeStyleClass("L2PDisplayNone");  
			oSEARCH_10.setVisible(true);
			oSEARCH_20.setVisible(true);
			oUploadBtn.setVisible(false);
		}else{
			oZzjobgr.addStyleClass("L2PDisplayNone");
			oZzjobsr.addStyleClass("L2PDisplayNone");
			oZzcaltl.addStyleClass("L2PDisplayNone");
			oInsyn.addStyleClass("L2PDisplayNone");
			oSEARCH_10.setVisible(false);
			oSEARCH_20.setVisible(false);
			oUploadBtn.setVisible(true);
		}
		oController.onChangeData();
		
		if(oEvent){
			var mPayscaleIncreaseList = sap.ui.getCore().getModel("PayscaleIncreaseList");
			var vPayscaleIncreaseList = {PayscaleIncreaseListSet : []};
			mPayscaleIncreaseList.setData(vPayscaleIncreaseList);
			var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
			var oFilterSearch = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_SEARCH");
			var oFilterCreate = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CRETAE");
			var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
			oFilterAll.setCount(0);
			oFilterSearch.setCount(0);
			oFilterCreate.setCount(0);
			oFilterCompalte.setCount(0);
			oController.handleIconTabBarSelect();
		}
	},
	
	onPressUpload : function(oEvent) {
//		var params = { Mode : "HeaderMatch" } ;
		var params = { ColumnMapping : ' | | | | | |1| | | | | | | | | | |4|5| |2|3'	} ;
		if(typeof IncEmpListDataSheet == "object") {
			IncEmpListDataSheet.LoadExcel(params);
		}
	},
	
	validData : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PAYSCALE_SRV");
		if(typeof IncEmpListDataSheet != "object") {
			return;
		}
		
		oController._vVilidData = [];
		
		var vRowCount = IncEmpListDataSheet.RowCount();
		var vHeaderCount = IncEmpListDataSheet.HeaderRows();
		IncEmpListDataSheet.SetCellFont("FontSize", 0, "Numbr", (vRowCount + vHeaderCount), "Insyn", 13);
		IncEmpListDataSheet.SetCellFont("FontName", 0, "Numbr", (vRowCount + vHeaderCount), "Insyn", "Malgun Gothic");
		
		var idx = 0;
		var success_cnt = 0;
		var fail_cnt = 0;
		
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var vWerks  = oWerks.getSelectedKey();
		var oInsdt = sap.ui.getCore().byId(oController.PAGEID + "_Insdt");
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt5 = 0;
		
		var mPayscaleIncreaseList = sap.ui.getCore().getModel("PayscaleIncreaseList");
		var vPayscaleIncreaseList = {PayscaleIncreaseListSet : []};
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterSearch = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_SEARCH");
		var oFilterCreate = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CRETAE");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
		
		
		var readAfterProcess = function() {
			mPayscaleIncreaseList.setData(vPayscaleIncreaseList);
			oFilterAll.setCount(vReqCntAll);
			oFilterSearch.setCount(vReqCnt1);
			oFilterCreate.setCount(vReqCnt2);
			oFilterCompalte.setCount(vReqCnt5);
			var oIconbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			oIconbar.setSelectedKey("All");
			oController.handleIconTabBarSelect();
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
		};
		
		var validProcess = function() {	
			if(idx >= vRowCount) {
				vReqCntAll = fail_cnt + success_cnt ;
				readAfterProcess();
				return;
			}	
		
			var createData = IncEmpListDataSheet.GetRowJson(idx + vHeaderCount); 
			if(createData.Pernr == ""){
				readAfterProcess();
				return;
			}
			
			var controlData = {}; 
			
			if(createData.Stvor != null && createData.Stvor != "") {
				var vDate = new Date();
				vDate.setUTCFullYear(parseInt(createData.Stvor.substring(0,4)));
				vDate.setUTCMonth(parseInt(createData.Stvor.substring(4,6)) - 1);
				vDate.setUTCDate(parseInt(createData.Stvor.substring(6,8)));
				controlData.Stvor = "\/Date(" + common.Common.getTime(vDate) + ")\/";
				console.log(new Date(Date.parse(vDate)));
			} else {
				controlData.Stvor = "";
			} 
				
			if(createData.Insdt != null && createData.Insdt != "") {
				var vDate = new Date();
				vDate.setUTCFullYear(parseInt(createData.Insdt.substring(0,4)));
				vDate.setUTCMonth(parseInt(createData.Insdt.substring(4,6)) - 1);
				vDate.setUTCDate(parseInt(createData.Insdt.substring(6,8)));
//				controlData.Insdt = "\/Date(" + vDate.getTime() + ")\/";
				controlData.Insdt = "\/Date(" + common.Common.getTime(vDate) + ")\/";
			} else {
				controlData.Insdt = "";
			} 
			controlData.Pernr = createData.Pernr;
			controlData.Zztrfgr = createData.Zztrfgr;
			controlData.Zztrfst = createData.Zztrfst;
			controlData.Actty = "E" ;  // Excel Upload
			controlData.Apsta = "10";
			controlData.Werks = vWerks;
//			controlData.Insdt2 = "\/Date(" + new Date(oInsdt.getValue()).getTime() + ")\/";
			controlData.Insdt2 = "\/Date(" +common.Common.getTime(oInsdt.getValue()) + ")\/";
			idx++;
			var oPath = "/PayscaleIncreaseListSet";
			try {
				oModel.create(
						oPath, 
						controlData, 
						null,
					    function (oData, response) {
							if(oData) {
								if(oData.Apsta == "10") vReqCnt2++;
								else if(oData.Apsta == "20") vReqCnt5++;
								else vReqCnt1 ++ ;
								
								vPayscaleIncreaseList.PayscaleIncreaseListSet.push(oData);
								
								if(oData.Uptyp == "E") fail_cnt ++;
								else success_cnt ++;
								
							}
					    },
					    function (oError) {
					    	var Err = {};
					    	var vMsg = "";
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
									vMsg = Err.error.innererror.errordetails[0].message;
								} else {
									vMsg = Err.error.message.value;
								}
							} else {
								vMsg = oError.toString();
							}
							fail_cnt++;
							vReqCnt1 ++ ;
							if(createData.Stvor != null && createData.Stvor != "") {
								var vDate = new Date();
								vDate.setUTCFullYear(parseInt(createData.Stvor.substring(0,4)));
								vDate.setUTCMonth(parseInt(createData.Stvor.substring(4,6)) - 1);
								vDate.setUTCDate(parseInt(createData.Stvor.substring(6,8)));
								controlData.Stvor = new Date(Date.parse(vDate));
							} else {
								controlData.Stvor = "";
							} 
							
							if(createData.Insdt != null && createData.Insdt != "") {
								var vDate = new Date();
								vDate.setUTCFullYear(parseInt(createData.Insdt.substring(0,4)));
								vDate.setUTCMonth(parseInt(createData.Insdt.substring(4,6)) - 1);
								vDate.setUTCDate(parseInt(createData.Insdt.substring(6,8)));
								controlData.Insdt = vDate;
							} else {
								controlData.Insdt = "";
							} 
							controlData.Apsta = "";
							controlData.Uptyp = "E" ;
							controlData.Messge = vMsg;
							vPayscaleIncreaseList.	PayscaleIncreaseListSet.push(controlData);
							
					    }
			    );
			}catch (Ex) {
				common.Common.log(Ex);
			}
			
			setTimeout(validProcess, 300);
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_VALID_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_VALID_PROCESSING_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(validProcess, 300);
	},
	
	onSearchCnt : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHRXX_PAYSCALE_SRV");
		var readData = {};
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var oInsdt = sap.ui.getCore().byId(oController.PAGEID + "_Insdt");
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oWerks.getSelectedKey() + "%27";  
		    filterString += "%20and%20";  
		    filterString += "(Insdt%20eq%20datetime%27" + oInsdt.getValue() + "T00%3a00%3a00%27)";
		    
		try {                
			oModel.read("/PayscalecountSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							readData = oData.results[0];
						}
					},
					function(oError) {
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
						
						var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(oError);
						}

					}
			);
		}catch (Ex) {
			common.Common.log(Ex);
		}
		console.log(readData);
		return readData;
		
	},
	
	onChangeDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			oControl.setValue("");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{});
		}
		oController.onChangeData();
	}
});


function IncEmpListDataSheet_OnSearchEnd(result) {
//	IncEmpListDataSheet.FitColWidth();
	IncEmpListDataSheet.SetRangeFontColor(1, "Uptyp", IncEmpListDataSheet.RowCount(), "Uptyp", "red");
}


function onInfoViewPopup(rowId) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
	var oController = oView.getController();
	var mPayscaleIncreaseList = sap.ui.getCore().getModel("PayscaleIncreaseList");
	var vPayscaleIncreaseList = mPayscaleIncreaseList.getProperty("/PayscaleIncreaseListSet");
	if(!oController._ErrorMessagePopover) {
		oController._ErrorMessagePopover = sap.ui.jsfragment("zui5_hrxx_actpayscale.fragment.ErrorMessagePopover", oController);
		oView.addDependent(oController._ErrorMessagePopover);
	}
	var oErrorText = sap.ui.getCore().byId(oController.PAGEID + "_ERROR_POPOVER");
	oErrorText.setText(vPayscaleIncreaseList[rowId - 1].Messge);
	var oControl = $("#" + oController.PAGEID + "_row_name_" + rowId);
	oController._ErrorMessagePopover.openBy(oControl);
	
}

function IncEmpListDataSheet_OnLoadExcel(result) {
	if(result) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actpayscale.IncreateEmployeeList");
		var oController = oView.getController();
		oController.validData();
	}
}