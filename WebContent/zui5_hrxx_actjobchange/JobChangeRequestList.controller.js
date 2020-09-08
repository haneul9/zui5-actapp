jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actjobchange.JobChangeRequestList", {
	PAGEID : "JobChangeRequestList",
	
	BusyDialog : null,
	_SortDialog : null,
	_vType : "" ,
	
	oBundleText : jQuery.sap.resources({
		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	
	vColumns : [ {id : "Numbr",      label : oBundleText.getText("NUMBR"),    	control : "Text", hidden : 0, width : 40 , Align : "Right"},
	             {id : "Astat_Imag",      label : oBundleText.getText("STATU"), control : "Html", hidden : 0, width : 40 },
	             {id : "Actda",      label : oBundleText.getText("ACTDA"),    	control : "Text", hidden : 0, width : 80 },
	             {id : "Rpers",      label : oBundleText.getText("PERNR"),    	control : "Text", hidden : 0, width : 80 },
	             {id : "Rpern",  	 label : oBundleText.getText("ENAME"),  	control : "Text", hidden : 0, width : 200, Align : "Left"},
	             {id : "Zzjobgrtx",  	 label : oBundleText.getText("ZZJOBGR"),  	control : "Text", hidden : 0, width : 150, Align : "Left"},
	             {id : "Zzcaltltx",  	 label : oBundleText.getText("ZZCALTL"),  	control : "Text", hidden : 0, width : 150, Align : "Left"},
	             {id : "Rorgt",  	 label : oBundleText.getText("FULLN"),  	control : "Text", hidden : 0, width : 150, Align : "Left"},
	             {id : "Batyp", 	 label : oBundleText.getText("BATYP"),      control : "Html", hidden : 0, width : 60, Align : "Left"}, 
	             {id : "vStellTx",    label : oBundleText.getText("STELL"),      control : "Text", hidden : 0, width : 450, Align : "Left"},
	             {id : "vZzprdctTx",  label : oBundleText.getText("ZZPRDCT"),    control : "Html", hidden : 0, width : 150, Align : "Left"},
	             {id : "vZzprdarTx",  label : oBundleText.getText("ZZPRDAR"),    control : "Text", hidden : 0, width : 150, Align : "Left"},
	             {id : "vZzprdar2Tx", label : oBundleText.getText("ZZPRDAR2"),   control : "Text", hidden : 0, width : 150, Align : "Left"},
	             {id : "Appld",  	 label : oBundleText.getText("APPLD"),  	control : "Text", hidden : 0, width : 80 },
	             {id : "Cpern",  	 label : oBundleText.getText("CPERN"),  	control : "Text", hidden : 0, width : 150, Align : "Left"},
	             {id : "Confd",  	 label : oBundleText.getText("CONFD"),  	control : "Text", hidden : 0, width : 80},
	             {id : "Astat",      label : oBundleText.getText("ASTAT"), 		control : "Text", hidden : 1, width : 0 },
	             {id : "Appno",      label : oBundleText.getText("APPNO"), 		control : "Text", hidden : 1, width : 0 },
	             {id : "Persa",      label : oBundleText.getText("PERSA"), 		control : "Text", hidden : 1, width : 0 }],
	             
	             
	             
	            
	             

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		//};
	    var oPersaSelect = sap.ui.getCore().byId(this.PAGEID + "_Persa");  
	    var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
        var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
     	var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
     	if(vEmpLoginInfo.length > 0){
     		vPersa = vEmpLoginInfo[0].Persa ; 
     	}
     	//인사영역 리스트
     	try {
     		oModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27", 
     				null, 
     				null, 
     				false,
     				function(oData, oResponse) {					
     					if(oData && oData.results.length) {
     						for(var i=0; i<oData.results.length; i++) {
     							oPersaSelect.addItem(new sap.ui.core.Item({
     								key : oData.results[i].Persa, 
     								text : oData.results[i].Pbtxt
     							}));
     						}
     						oPersaSelect.setSelectedKeys(vPersa);
     					}
     				},
     				function(oResponse) {
     					common.Common.log(oResponse);
     				}
     		);
     	} catch(ex) {
     		common.Common.log(ex);
     	}     
		
		var skey = jQuery.sap.getUriParameters().get("skey");
		if(skey && skey != "") {
			oIconTabbar.setSelectedKey(skey);
		}
		
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
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
	
	
	/*
	 * 페이지가 표시되기전에 수행한다.
	 * 바인딩 전에 안내메세지 출력 후 바인딩이 완료되면 메세지 창을 닫는다.
	 */
	onBeforeShow: function(evt) {
		this._vType = evt.data.Type;
		if(this._vType == "B"){
			this.onPressSearch();
		}
	},
	
	onAfterShow : function(evt){
		// 상세 화면에서 다시 List 화면으로 전환 했을 경우에는 rendering 을 하지 않는다.
		//		this._vType = evt.data.Type;
//		if(this._vType == "B"){
//			return;
//		}
		this.onAfterRenderingTableLayout();
		this.onPressSearch();
		
	},
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actjobchange.JobChangeRequestList");
			var oController = oView.getController();
			oController.onPressSearch();
		}
	},

	onResizeWindow : function(oEvent, oEventId, data) {
		var filterHeight = $("#" + this.PAGEID + "_FILTERBAR").height();
		$("#" + this.PAGEID + "_Ibsheet").css("height", window.innerHeight - (178 + filterHeight) + "px");
		JobChangeRequestListDataSheet.FitColWidth();
	},	
	
	onAfterRenderingTableLayout : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actjobchange.JobChangeRequestList");
		var oController = oView.getController();
		
		var filterHeight = $("#" + oController.PAGEID + "_FILTERBAR").height();
		
		if(typeof JobChangeRequestListDataSheet == "undefined") {
			var vWidth = window.innerWidth + "px";
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_Ibsheet"), "JobChangeRequestListDataSheet", "100%",  window.innerHeight - (178 + filterHeight) + "px", vLang);
		} else {
			$("#" + oController.PAGEID + "_Ibsheet").css("height", window.innerHeight - (178 + filterHeight) + "px");
			return ;
		}
		
		JobChangeRequestListDataSheet.Reset();
		
		JobChangeRequestListDataSheet.SetTheme("DS","GhrisMain");
	
		
		var initdata = {};
		
		initdata.Cfg = {SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1};//MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:0,ColMove:0,ColResize:1,HeaderCheck:1};
		
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
			if(oController.vColumns[i].Align){
				oneCol.Align = oController.vColumns[i].Align ;		
			}
			else oneCol.Align = "Center";
			oneCol.Hidden = oController.vColumns[i].hidden;
			oneCol.Width = oController.vColumns[i].width;
			initdata.Cols.push(oneCol);
		}
		
		IBS_InitSheet(JobChangeRequestListDataSheet, initdata);
//		JobChangeRequestListDataSheet.FitColWidth();
		JobChangeRequestListDataSheet.SetSelectionMode(0);
		
		JobChangeRequestListDataSheet.SetCellFont("FontSize", 0, "Astat_Html", JobChangeRequestListDataSheet.HeaderRows(),  "Astat", 13);
		JobChangeRequestListDataSheet.SetCellFont("FontName", 0, "Astat_Html", JobChangeRequestListDataSheet.HeaderRows(),  "Astat", "Malgun Gothic");
		JobChangeRequestListDataSheet.SetHeaderRowHeight(32);
		JobChangeRequestListDataSheet.SetDataRowHeight(32);
		JobChangeRequestListDataSheet.SetFocusAfterProcess(0);
		JobChangeRequestListDataSheet.HideProcessDlg(); 
	},
	
	handleIconTabBarSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actjobchange.JobChangeRequestList");
		var oController = oView.getController();
	    var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
	
		var sKey = oIconTabbar.getSelectedKey();
		var vAstat = "00";
		if (sKey === "creation") {
			vAstat = "10";
	    }else if (sKey === "approval") {
	    	vAstat = "20";
	    }else if( sKey === "confirmation"){
	    	vAstat = "30";
	    }else if( sKey === "reject"){
	    	vAstat = "40";
	    }else if( sKey === "complete"){
	    	vAstat = "50";
	    }
		
		var JobChangeRequestListData = {data : []};
		var mJobChangeList = sap.ui.getCore().getModel("JobChangeList");
		var vJobChangeList = mJobChangeList.getProperty("/JobChangeListSet");
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actjobchange/img/JobChangeStatus10.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actjobchange/img/JobChangeStatus20.gif'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actjobchange/img/JobChangeStatus30.png'>";
		var icon4 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actjobchange/img/JobChangeStatus40.gif'>";
		var icon5 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actjobchange/img/JobChangeStatus50.gif'>";
		
		if(!vJobChangeList) return;
		
		for(var i=0; i< vJobChangeList.length; i++) {
			if( vJobChangeList[i].Astat == vAstat || vAstat == "00"){
				for(var j=0 ; j < 2 ; j++){
					var oneDataSheet = {};
					if(j == 0){
						oneDataSheet.Batyp = "After"; 
						oneDataSheet.vStellTx = vJobChangeList[i].StellTx ;
						oneDataSheet.vZzprdctTx = vJobChangeList[i].ZzprdctTx ;
						oneDataSheet.vZzprdarTx = vJobChangeList[i].ZzprdarTx ;
						oneDataSheet.vZzprdar2Tx = vJobChangeList[i].Zzprdar2Tx ;
						oneDataSheet.Rorgt = vJobChangeList[i].Rorgt;
						oneDataSheet.Rpern = vJobChangeList[i].Rpern;
						oneDataSheet.Apern = vJobChangeList[i].Apern;
						oneDataSheet.Astat = vJobChangeList[i].Astat;
						oneDataSheet.Appno = vJobChangeList[i].Appno;
						oneDataSheet.Persa = vJobChangeList[i].Persa;
						oneDataSheet.Numbr = vJobChangeList[i].Numbr;
						oneDataSheet.Rpers = vJobChangeList[i].Rpers;
						oneDataSheet.Cpern = vJobChangeList[i].Cpern;
						oneDataSheet.Zzcaltltx = vJobChangeList[i].Zzcaltltx;
						oneDataSheet.Zzjobgrtx = vJobChangeList[i].Zzjobgrtx;
						
						if(vJobChangeList[i].Astat == "10"){
							oneDataSheet.Astat_Imag = icon1;
						}else if(vJobChangeList[i].Astat == "20"){
							oneDataSheet.Astat_Imag = icon2;
						}else if(vJobChangeList[i].Astat == "30"){
							oneDataSheet.Astat_Imag = icon3;
						}else if(vJobChangeList[i].Astat == "40"){
							oneDataSheet.Astat_Imag = icon4;
						}else if(vJobChangeList[i].Astat == "50"){
							oneDataSheet.Astat_Imag = icon5;
						}
						if(vJobChangeList[i].Actda != null && vJobChangeList[i].Actda != "" ){
							oneDataSheet.Actda = vJobChangeList[i].ActdaT;
						}else{
							oneDataSheet.Actda = "";
						}
						if(vJobChangeList[i].Appld != null && vJobChangeList[i].Appld != "" ){
							oneDataSheet.Appld = vJobChangeList[i].AppldT;
						}else{
							oneDataSheet.Appld = "";
						}
						if(vJobChangeList[i].Confd != null && vJobChangeList[i].Confd != "" ){
							oneDataSheet.Confd = vJobChangeList[i].ConfdT;
						}else{
							oneDataSheet.Confd = "";
						}
					}else{
						oneDataSheet.Batyp = "Before"; 
						oneDataSheet.vStellTx = vJobChangeList[i].OldStellTx ;
						oneDataSheet.vZzprdctTx = vJobChangeList[i].OldZzprdctTx ;
						oneDataSheet.vZzprdarTx = vJobChangeList[i].OldZzprdarTx ;
						oneDataSheet.vZzprdar2Tx = vJobChangeList[i].OldZzprdar2Tx ;
					}
					JobChangeRequestListData.data.push(oneDataSheet);
				
				}
			}
		};
		JobChangeRequestListDataSheet.LoadSearchData(JobChangeRequestListData);
	},
	
	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actjobchange.JobChangeRequestList");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");	
		var vPersas  = oPersa.getSelectedItems();
		
		var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Pbtxt");
		var vFilterInfo = "";
		
		if(oControl) {			
			if(vPersas && vPersas.length) {
				for(var i=0; i<vPersas.length; i++) {
					vFilterInfo += vPersas[i].getText() + ", ";
				}
			}
			oControl.setText(vFilterInfo);
		}
		
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actjobchange.JobChangeRequestList");
		var oController = oView.getController();
		var oAppld_From = sap.ui.getCore().byId(oController.PAGEID + "_Appld_From");
		var oAppld_To = sap.ui.getCore().byId(oController.PAGEID + "_Appld_To");
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_Rpern");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterApproval = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPROVAL");
		var oFilterConfirm = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CONFIRM");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
	    var filterString = "";
	    var oFilters = [];	
	    filterString += "/?$filter=Actty%20eq%20%27" + "H" + "%27";  
		//filterString += "%20and%20";
		//filterString += "Persa%20eq%20%27" + oPersaSelect.getSelectedKey() + "%27";
	    filterString += "%20and%20";
	    filterString += "(Appld%20ge%20datetime%27" + oAppld_From.getValue() + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" 
	    			  + oAppld_To.getValue() + "T00%3a00%3a00%27)";
	    filterString += "%20and%20Rpern%20eq%20%27" + encodeURI(oRpern.getValue()) +  "%27";
		
		//추가	
		var vPersaString = "";
		var vPersaData = oPersa.getSelectedKeys();
		if(vPersaData && vPersaData.length) {
			for(var i=0; i<vPersaData.length; i++) {
				oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersaData[i]));
				if(vPersaString != "") {
					vPersaString += "%20or%20";
				}
				vPersaString += "Persa%20eq%20%27" + vPersaData[i] + "%27";
			}
		}
		if(vPersaString != "") {
			filterString += "%20and%20(" + vPersaString +  ")";
		}
		//추가 끝
	    if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mJobChangeList = sap.ui.getCore().getModel("JobChangeList");
		var vJobChangeList = {JobChangeListSet : []};
		
		var vReqCntAll = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterApproval.setCount(vReqCnt2);
			oFilterConfirm.setCount(vReqCnt3);
			oFilterReject.setCount(vReqCnt4);
			oFilterCompalte.setCount(vReqCnt5);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			oIconTabbar.setExpanded(true);
			oController.handleIconTabBarSelect();
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};

		var oModel = sap.ui.getCore().getModel("ZHRXX_JOBCHANGE_SRV");
		oModel.read("/JobChangeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								var oneData = oData.results[i];
								
								if(oData.results[i].Astat == "20") vReqCnt2++;
								else if(oData.results[i].Astat == "30") vReqCnt3++;
								else if(oData.results[i].Astat == "40") vReqCnt4++;
								else if(oData.results[i].Astat == "50") vReqCnt5++;
								
								oneData.ActdaT = oneData.Actda == null ? "" : dateFormat.format(new Date(common.Common.setTime(new Date(oneData.Actda))));
								oneData.AppldT = oneData.Appld == null ? "" : dateFormat.format(new Date(common.Common.setTime(new Date(oneData.Appld))));
								oneData.ConfdT = oneData.Confd == null ? "" : dateFormat.format(new Date(common.Common.setTime(new Date(oneData.Confd))));
								vJobChangeList.JobChangeListSet.push(oneData);
							}
							vReqCntAll = oData.results.length;
							mJobChangeList.setData(vJobChangeList);
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
	
	onPressComplete : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actjobchange.JobChangeRequestList");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHRXX_JOBCHANGE_SRV");
		var process_result = true;
	    var vRowCount = JobChangeRequestListDataSheet.RowCount();
		var vHeaderCount = JobChangeRequestListDataSheet.HeaderRows();
		var vSelectCnt = 0;
		for(var i = 0; i < vRowCount ; ){
			if(JobChangeRequestListDataSheet.GetCellValue(i + vHeaderCount, "Ichek") == 1){
				if(JobChangeRequestListDataSheet.GetCellValue(i + vHeaderCount, "Astat") != "30"){
					common.Common.showErrorMessage(oBundleText.getText( "MSG_FAMILY_COMPLETE_INVALID_DOCUMENT"));
					return ;
				}
				vSelectCnt ++;
			}
			i += 2;
		}
		
		if(vSelectCnt == 0){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_NO_SELECT"));
			return ;				
		}
	    var completeProcess = function(oAction) { 
			for(var i = 0; i < vRowCount;) {
				if(JobChangeRequestListDataSheet.GetCellValue(i + vHeaderCount, "Ichek") == 1){
					var oPath = "/JobChangeListSet";
					oPath += "(Appno='" + JobChangeRequestListDataSheet.GetCellValue(i + vHeaderCount, "Appno") + "')";
					
					var updateData = {};
					
					updateData.Persa = JobChangeRequestListDataSheet.GetCellValue(i + vHeaderCount, "Persa");
					updateData.Appno = JobChangeRequestListDataSheet.GetCellValue(i + vHeaderCount, "Appno");
					updateData.Astat = "50";
					updateData.Actty = "H";
					updateData.Actty1 = "C";
					
					oModel.update(
							oPath, 
							updateData,
							null,
						    function (oData, response) {
								process_result = true;
								oController.onPressSearch();
								common.Common.log("Sucess LanguageRegister Update !!!");
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
					
					if(!process_result){
						break;
					}
				}
				i += 2;
			}
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			if(process_result){
				sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMILY_COMPLETE_FINISHED"), {
				 	icon: sap.m.MessageBox.Icon.INFORMATION,
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.onPressSearch();
					}
				});
			}
	
	    };
	    
	    

		
		 var onProcessing = function(oAction) {
				if(!oController.BusyDialog) {			
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
				}
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				
				setTimeout(completeProcess, 300);
				
			};
			
		 sap.m.MessageBox.alert(oBundleText.getText("MSG_JOBCHANGE_COMPLETE_CONFIRM"), {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: oBundleText.getText("APPLY_COMPLETE"),
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		        onClose: function(oAction){
		        	if(oAction === sap.m.MessageBox.Action.YES ) {
		        		onProcessing() ;
		        	}
		        }
		 });
		
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actjobchange.JobChangeRequestList");
		var oController = oView.getController();
		
//		var vCols = "Ename|Acttx|Actda1|Batyp|Sub01|Sub02|Sub03|Sub04|Sub05|Sub06|Sub07|Sub08|";
//		for(var i=0; i<oController.vDisplayControl.length; i++) {
//			var Fieldname = oController.vDisplayControl[i].Fieldname;
//			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
//			var TextFieldname = Fieldname + "_Tx";
//			vCols += TextFieldname + "_Hidden|";
//		}
//		
//		var params = { FileName : "ActionJobChange.xls",  SheetName : "Sheet", Merge : 1, HiddenColumn : 0, DownCols : vCols} ;
//		if(typeof ActAppDocumentSubject == "object") {
//			ActAppDocumentSubject.Down2Excel(params);
//		}
		
		var params = { FileName : "ActionJobChange.xls",  SheetName : "Sheet", 
				   Merge : 1 ,
				   HiddenColumn : 0,
//			       DownCols:'13|2|3|4|5|6|7|8|9|10|11|12',
			       DownCols:'1|17|3|4|5|6|7|8|9|10|11|12|13|14|15|16',
			       } ;
		
//		var params = { FileName : "ActionJobChange.xls",  SheetName : "Sheet", Merge : 1, HiddenColumn : 1} ;
		if(typeof JobChangeRequestListDataSheet == "object") {
			JobChangeRequestListDataSheet.Down2Excel(params);
		}
	},
	
});

function JobChangeRequestListDataSheet_OnSearchEnd(result) {
	var vHeaderRows = JobChangeRequestListDataSheet.HeaderRows();
	for(var r=0; r<JobChangeRequestListDataSheet.RowCount(); r++) {
		if((r % 2) == 0) {
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),0,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),1,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),2,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),3,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),4,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),5,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),6,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),7,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),8,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),14,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),15,2,1);
			JobChangeRequestListDataSheet.SetMergeCell((r+vHeaderRows),16,2,1);
		}
	}
	JobChangeRequestListDataSheet.FitColWidth();
}

function JobChangeRequestListDataSheet_OnClick(Row, Col, Value, CellX, CellY, CellW, CellH) {
	var vHeaderRows = JobChangeRequestListDataSheet.HeaderRows();
	if(Row >= vHeaderRows && Col != 0){
		var vIdx = parseInt((Row - vHeaderRows) / 2); 
		var mJobChangeList = sap.ui.getCore().getModel("JobChangeList");
		var vJobChangeList = mJobChangeList.getProperty("/JobChangeListSet");
		var vContext = vJobChangeList[vIdx];
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	      	  id : "zui5_hrxx_job_change.JobChangeRequest" ,
	    	  data : {
	    		  Rcontext : vContext,
		    	  Appno : vJobChangeList[vIdx].Appno,
		    	  Astat : vJobChangeList[vIdx].Astat,
		    	  Persa : vJobChangeList[vIdx].Persa,
		    	  Pbtxt :  vJobChangeList[vIdx].Pbtxt,
		    	  Pernr : vJobChangeList[vIdx].Rpers,
		    	  Rpern : vJobChangeList[vIdx].Rpern,
		    	  Rorgt : vJobChangeList[vIdx].Rorgt,
		    	  Zzcaltltx : vJobChangeList[vIdx].Zzcaltltx,
		    	  Zzjobgrtx : vJobChangeList[vIdx].Zzjobgrtx,
		    	  Actty : "H",
		    	  FromPageId : "zui5_hrxx_actjobchange.JobChangeRequestList"
		      }
			});			
	}
}

//function JobChangeRequestListDataSheet_OnResize(Width, Height) {
//	console.log("JobChangeRequestListDataSheet_OnResize");
//	JobChangeRequestListDataSheet.FitColWidth();
//}