jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actloa.LoaAppMain", {
	PAGEID : "LoaAppMain",
	
	BusyDialog : null,
	_SortDialog : null,
	_FilterDialog : null,
	_vDocty : "10",
	_vPersa : "",
	_vPernr : "",
	_InfoEnterDialog : null,
	_SelectDoctypeDialog : null,
	
	oBundleText : jQuery.sap.resources({
		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		//};
		
		var oPersaModel = sap.ui.getCore().getModel("PersaModel");
		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
		var oControl = sap.ui.getCore().byId(this.PAGEID + "_Pbtxt");
		
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		var oMassg = sap.ui.getCore().byId(this.PAGEID + "_Massg");
		var oIconTabbar = sap.ui.getCore().byId(this.PAGEID + "_ICONBAR");
		
		var oCompleteBtn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN"); 
		var skey = jQuery.sap.getUriParameters().get("skey");
		var sRole = jQuery.sap.getUriParameters().get("role");
		
		if(sRole == "admin"){
			oCompleteBtn.setVisible(false);
		}else{
			oCompleteBtn.setVisible(true);
		}
		
		
		try {
			for(var i=0; i<vPersaData.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			if(skey && skey != "") {
				oIconTabbar.setSelectedKey(skey);
			} else {
				oPersa.addSelectedKeys([vPersaData[0].Persa]);
				oControl.setText(vPersaData[0].Pbtxt);				
			}
			
		} catch(ex) {
			common.Common.log(ex);
		}
		
		oMassg.bindItems("/LoaTypeReasonSet",new sap.ui.core.Item({key : "{Massg}", text : "{Mgtxt}"}),null, null);
	    
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				//this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				//common.Common.log("onAfterShow " + new Date());
				this.onBeforeShow(evt);
			}, this),
		});
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
		this.onPressSearch();
	},
	
	/* IconTabFilter의 Icon을 선택할 시 발생되는 Event 
	 * Filter를 걸어준다
	 */
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
	    if (sKey === "creation") {
	      oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "10"));
	    } else if (sKey === "approval") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
	    } else if (sKey === "confirmation") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "30"));
	    } else if (sKey === "reject") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "40"));
	    } else if (sKey === "complete") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "50"));	      
	    }
	    oBinding.filter(oFilters);
	},
	
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
			var oController = oView.getController();
			oController.onPressSearch();
		}
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();

		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		var oLatyp = sap.ui.getCore().byId(oController.PAGEID + "_Latyp");
		var oBegda_From = sap.ui.getCore().byId(oController.PAGEID + "_Begda_From");
		var oBegda_To = sap.ui.getCore().byId(oController.PAGEID + "_Begda_To");
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterCreate = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CRETAE");
		var oFilterApproval = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPROVAL");
		var oFilterConfirm = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CONFIRM");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		// 사번 및 인사영역 가져오기 
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		if(vEmpLoginInfo.length > 0){
			oController._vPersa = vEmpLoginInfo[0].Persa ; 
			oController._vPernr = vEmpLoginInfo[0].Pernr ; 
		}
	    var oFilters = [];	
	    var filterString = "";
	    
	    filterString += "/?$filter=";  
		filterString += "(Begda%20ge%20datetime%27" + oBegda_From.getValue() + "T00%3a00%3a00%27%20and%20Begda%20le%20datetime%27" + oBegda_To.getValue() + "T00%3a00%3a00%27)";
		
		oFilters.push(new sap.ui.model.Filter("Begda", sap.ui.model.FilterOperator.BT, oBegda_From.getValue(), oBegda_To.getValue()));
		filterString += "%20and%20Actty%20eq%20%27H%27";
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
		
		filterString += "%20and%20Ename%20eq%20%27" + encodeURI(oEname.getValue()) +  "%27";
		
		var vLatypString = "";
		var vLatypData = oLatyp.getSelectedKeys();
		if(vLatypData && vLatypData.length) {
			for(var i=0; i<vLatypData.length; i++) {
				oFilters.push(new sap.ui.model.Filter("Latyp", sap.ui.model.FilterOperator.EQ, vLatypData[i]));
				if(vLatypString != "") {
					vLatypString += "%20or%20";
				}
				vLatypString += "Latyp%20eq%20%27" + vLatypData[i] + "%27";
			}
		}
		if(vLatypString != "") {
			filterString += "%20and%20(" + vLatypString +  ")";
		}
		
		var vMassgString = "";
		var vMassgData = oMassg.getSelectedKeys();
		if(vMassgData && vMassgData.length) {
			for(var i=0; i<vMassgData.length; i++) {
				oFilters.push(new sap.ui.model.Filter("Massg", sap.ui.model.FilterOperator.EQ, vMassgData[i]));
				if(vMassgString != "") {
					vMassgString += "%20or%20";
				}
				vMassgString += "Massg%20eq%20%27" + vMassgData[i] + "%27";
			}
		}
		if(vMassgString != "") {
			filterString += "%20and%20(" + vMassgString +  ")";
		}
		
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			
		}
		
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_Ename"); 
	    var oApern = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_Apern"); 
	    var oFromBakda = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_FromBakda"); 
	    var oToBakda = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_ToBakda"); 
	    
	    if(oEname != undefined){
	    	oEname.setValue("");
	    	oApern.setValue("");
	    	oFromBakda.setValue("");
	    	oToBakda.setValue("");
	    }
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mEtcLoaApplicationList = sap.ui.getCore().getModel("EtcLoaApplicationList");
		var vEtcLoaApplicationList = {EtcLoaApplicationListSet : []};
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterCreate.setCount(vReqCnt1);
			oFilterApproval.setCount(vReqCnt2);
			oFilterConfirm.setCount(vReqCnt3);
			oFilterReject.setCount(vReqCnt4);
			oFilterCompalte.setCount(vReqCnt5);
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mEtcLoaApplicationList);
			oTable.bindItems("/EtcLoaApplicationListSet", oColumnList);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if (sKey === "creation") {
		      oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "10"));
		    } else if (sKey === "approval") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
		    } else if (sKey === "confirmation") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "30"));
		    } else if (sKey === "reject") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "40"));
		    } else if (sKey === "complete") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "50"));	      
		    }
		    oBinding.filter(oFilters);
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};

		var oModel = sap.ui.getCore().getModel("ZHRXX_LOA_APPLICATION_SRV");
		oModel.read("/EtcLoaApplicationSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vEtcLoaApplicationList.EtcLoaApplicationListSet.push(oData.results[i]);
								vEtcLoaApplicationList.EtcLoaApplicationListSet[i].Numbr = i + 1 ;
								vEtcLoaApplicationList.EtcLoaApplicationListSet[i].Period = 
									dateFormat.format(new Date(common.Common.setTime(new Date(oData.results[i].Begda)))) + " ~ " +
									dateFormat.format(new Date(common.Common.setTime(new Date(oData.results[i].Endda)))) ;
								if(oData.results[i].Astat == "10") vReqCnt1++;
								else if(oData.results[i].Astat == "20") vReqCnt2++;
								else if(oData.results[i].Astat == "30") vReqCnt3++;
								else if(oData.results[i].Astat == "40") vReqCnt4++;
								else if(oData.results[i].Astat == "50") vReqCnt5++;
							}
							vReqCntAll = oData.results.length;
							mEtcLoaApplicationList.setData(vEtcLoaApplicationList);
							readAfterProcess();
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
					}
		);
	},
	
	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oLatyp = sap.ui.getCore().byId(oController.PAGEID + "_Latyp");
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		
		var vPersas  = oPersa.getSelectedItems();
		var vLatyps  = oLatyp.getSelectedItems();
		var vMassgs  = oMassg.getSelectedItems();
		
		var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Pbtxt");
		var vFilterInfo = "";
		
		if(oControl) {			
			if(vPersas && vPersas.length) {
				for(var i=0; i<vPersas.length; i++) {
					vFilterInfo += vPersas[i].getText() + ", ";
				}
			}
			if(vLatyps && vLatyps.length) {
				for(var i=0; i<vLatyps.length; i++) {
					vFilterInfo += vLatyps[i].getText() + ", ";
				}
			}
			if(vMassgs && vMassgs.length) {
				for(var i=0; i<vMassgs.length; i++) {
					vFilterInfo += vMassgs[i].getText() + ", ";
				}
			}
			oControl.setText(vFilterInfo);
		}
		
	},
	
	onSelectRow : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();
		var mEtcLoaApplicationList = sap.ui.getCore().getModel("EtcLoaApplicationList");
		var vAstat = mEtcLoaApplicationList.getProperty(oContext + "/Astat");
		var vLatyp = mEtcLoaApplicationList.getProperty(oContext + "/Latyp");
		
		if(vLatyp == "L" || vLatyp == "LE" || vLatyp == "M" || vLatyp == "ME" || 
			vLatyp == "N" || vLatyp == "NE" || vLatyp == "P" || vLatyp == "PE" ){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "zui5_hrxx_mat_protection.MatProtectionRequest",
			      data : {
			    	  context : mEtcLoaApplicationList.getProperty(oContext.sPath),
			    	  Astat : vAstat,
			    	  Docno : mEtcLoaApplicationList.getProperty(oContext + "/Docno"),
			    	  Persa : mEtcLoaApplicationList.getProperty(oContext + "/Persa"),
			    	  Pernr : mEtcLoaApplicationList.getProperty(oContext + "/Pernr"),
			    	  Appno : mEtcLoaApplicationList.getProperty(oContext + "/Appno"),
			    	  Actty  : "H",
			    	  FromPageId : "zui5_hrxx_actloa.LoaAppMain"
			      }
			});
		}else{
			
			if(vAstat == "" || vAstat == "10" ){
				sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : "zui5_hrxx_loa_application.LoaAppRequest",
				      data : {
				    	  context : mEtcLoaApplicationList.getProperty(oContext.sPath),
				    	  Astat : vAstat,
				    	  Docno : mEtcLoaApplicationList.getProperty(oContext + "/Docno"),
				    	  Persa : mEtcLoaApplicationList.getProperty(oContext + "/Persa"),
				    	  Pernr : mEtcLoaApplicationList.getProperty(oContext + "/Pernr"),
				    	  Appno : mEtcLoaApplicationList.getProperty(oContext + "/Appno"),
				    	  Actty  : "H",
				    	  FromPageId : "zui5_hrxx_actloa.LoaAppMain"
				      }
				});
			}else{
				sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : "zui5_hrxx_loa_application.LoaAppDocument",
				      data : {
				    	  context : mEtcLoaApplicationList.getProperty(oContext.sPath),
				    	  Astat : vAstat,
				    	  Docno : mEtcLoaApplicationList.getProperty(oContext + "/Docno"),
				    	  Persa : mEtcLoaApplicationList.getProperty(oContext + "/Persa"),
				    	  Pernr : mEtcLoaApplicationList.getProperty(oContext + "/Pernr"),
				    	  Appno : mEtcLoaApplicationList.getProperty(oContext + "/Appno"),
				    	  Actty  : "H",
				    	  FromPageId : "zui5_hrxx_actloa.LoaAppMain"
				      }
				});
			}
		}
		
	},
	
	onPressComplete : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var vLatyp = vContexts[0].getProperty("Latyp");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var vLatypCheck1 = true ;
		var vLatypCheck2 = true ;
		var vLatypLoop = "";
		var vFirstBeginDate = "";
		var vTemp1 = "";
		
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_SELECT_PERSON"));
			return ;
		}
		// 발령품의를 하는 것과 일반 확정하는 것은 같이 선택할 수 없음
		if(vLatyp == "A" || vLatyp == "B" || vLatyp == "C" || vLatyp == "N" || vLatyp == "NE"){
			vLatypCheck1 = true ;
			vLatypCheck2 = true ;
		}else{
			vLatypCheck1 = false;
			vLatypCheck2 = false;
		}
		for(var i = 0; i< vContexts.length; i++ ){
			vLatypLoop = vContexts[i].getProperty("Latyp");
			if(i == 0) vFirstBeginDate = dateFormat.format(new Date(vContexts[i].getProperty("Begda")));
			
			vTemp1 = dateFormat.format(new Date(vContexts[i].getProperty("Begda")));
			
			if(vFirstBeginDate > vTemp1 ) vFirstBeginDate = vTemp1 ;
			
			if(vLatypLoop == "A" || vLatypLoop == "B" || vLatypLoop == "C" || vLatypLoop == "N" || vLatypLoop == "NE"){
				vLatypCheck2 = true ;
			}else{
				vLatypCheck2 = false;
			}
			if(vLatypCheck1 != vLatypCheck2){
				common.Common.showErrorMessage(oBundleText.getText( "MSG_LATYP_APP_LIMIT"));
				return ;
			}
			if(vContexts[i].getProperty("Astat") != "30"){
				common.Common.showErrorMessage(oBundleText.getText( "MSG_ASTST_APP_LIMIT"));
				return ;
			}
		}
		
		if(vLatyp == "A" || vLatyp == "B" || vLatyp == "C" || vLatyp == "N" || vLatyp == "NE"){
			if(!oController._InfoEnterDialog) {
					oController._InfoEnterDialog = sap.ui.jsfragment("zui5_hrxx_actloa.fragment.LoaAppInfoEnter", oController);
					oView.addDependent(oController._InfoEnterDialog);
				}
			oController._InfoEnterDialog.open();
		}else{
			oController.onPressActRequest();
		}
	} , 
	
	onPressActRequest : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var sAppno = "";
		var vLatyp = vContexts[0].getProperty("Latyp") ;
		var oModel = sap.ui.getCore().getModel("ZHRXX_LOA_APPLICATION_SRV");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Actda");
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Orgeh");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Title");
		var oDocno = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Docno");
		var updateData = {};
		
		updateData.Persa = oController._vPersa;
		updateData.Appno = oController._vAppno;
		updateData.Actty = "A"; // 발령품의 확정
		updateData.Latyp = vLatyp ;
//		if(oDocno.getSelectedKey() != "00" && oDocno.getSelectedKey() != ""){
//			updateData.Docno = oDocno.getSelectedKey();
//		}
		updateData.Appno = vContexts[0].getProperty("Appno") ;
		var process_result = false;
		
		var AfterProcess = function() {
			var oAction = sap.ui.getCore().byId(oController.PAGEID + "_RA_Action");
			oController.onLAEClose();
			if(oAction && oAction.getSelected()) {
				document.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/ActionApp.html?Persa=" + vContexts[0].getProperty("Persa");
				return;
			}else{
				oController.onPressSearch();
			}
		};		
		
		var updateProcess = function() {
			vLatyp = vContexts[0].getProperty("Latyp") ;
			var vMpYn = false ; // 모성보호 여부
			if(vLatyp == "L" || vLatyp == "LE" || vLatyp == "M" || 
			   vLatyp == "ME" || vLatyp == "P" || vLatyp == "PE"){
				vMpYn = true;
				updateData.Actty = "C" ; // 모성보호 확정
				try {
					var oPath = "(Appno='" + updateData.Appno + "',Persa='" + oController._vPersa +"',Pernr='" + oController._vPernr +"')";
					oModel.update(
							"/MaternityProtectionApplicationSet"+oPath, 
							updateData ,
							null,
							function(oData, oResponse) {
								process_result = true;
							},
						    function (oError) {
						    	var Err = {};
								var ErrMsg = "";
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									var msg1 = Err.error.innererror.errordetails;
									if(msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
									else ErrMsg = Err.error.message.value;
								} else {
									ErrMsg = oError.toString();
								}
								
								common.Common.showErrorMessage(ErrMsg);
								return;
							}
						);	
					
					if(!process_result) {
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						}
						return;
					}
				}catch(Ex) {
					common.Common.log(Ex);
				} finally {
					if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
				}
			}else{
				if(vLatyp == "A" || vLatyp == "B" || vLatyp == "C" || vLatyp == "N" || vLatyp == "NE"){
					if(oDocno.getSelectedKey() != "00" && oDocno.getSelectedKey() != ""){
						updateData.Docno = oDocno.getSelectedKey();
					}
					
					if(oActda.getValue()){
						vTmp1 = oActda.getValue();
						vTmp2 = "\/Date(" + common.Common.getTime(vTmp1) + ")\/";
						updateData.Actda = vTmp2;
						
						if(oOrgeh.getSelectedKey()){
							updateData.Orgeh = oOrgeh.getSelectedKey();
						}
						updateData.Title = oTitle.getValue();
						
						for(var i = 0; i < vContexts.length; i++) {
							if( i== 0 ) sAppno = vContexts[i].getProperty("Appno") ;
							else sAppno += "|" +vContexts[i].getProperty("Appno") ;
						}
						updateData.AppnoS = sAppno ;
						
					}
					// 기타 휴직
					try {
						var oPath = "(Appno='" + vContexts[0].getProperty("Appno") + "',Persa='" + vContexts[0].getProperty("Persa") +"')";
						oModel.update(
								"/EtcLoaApplicationSet"+oPath, 
								updateData, 
								null,
							    function (oData, response) {
									process_result = true;
									common.Common.log("Sucess ActionReqListSet Update !!!");
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
						
						if(!process_result) {
							if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
								oController.BusyDialog.close();
							}
							return;
						}
					}catch(Ex) {
						common.Common.log(Ex);
					} finally {
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						}
					}
				}
				
			}
			
			if(process_result){
				if(vMpYn){
					sap.m.MessageBox.alert(oBundleText.getText("MSG_MPAPP_COMPLETE"), {
					 	icon: sap.m.MessageBox.Icon.INFORMATION,
						title: oBundleText.getText("INFORMATION"),
						onClose : function() {
							oController.onPressSearch();
						}
					});
				}else{
					sap.m.MessageBox.alert(oBundleText.getText("MSG_LOA_COMPLETE"), {
					 	icon: sap.m.MessageBox.Icon.INFORMATION,
						title: oBundleText.getText("INFORMATION"),
						onClose : function() {
							AfterProcess();
						}
					});
				}
				
			}
		};
		
		if(vLatyp == "L" || vLatyp == "LE" || vLatyp == "M" || 
				   vLatyp == "ME" || vLatyp == "P" || vLatyp == "PE"){
		}else{
			//발령품의
			if(!oActda.getValue()){
				common.Common.showErrorMessage(oBundleText.getText( "MSG_LOA_INFO_INPUT"));
				return ;
			}
			if(!oOrgeh.getSelectedKey()){
				common.Common.showErrorMessage(oBundleText.getText( "MSG_INPUT_ORGEH"));
				return ;
			}
			if(!oTitle.getValue()){
				common.Common.showErrorMessage(oBundleText.getText( "MSG_INPUT_LOA_TITLE"));
				return ;
			}
		}
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		}else{
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(updateProcess, 300);

	},
	
	onLAEClose : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();
		if(oController._InfoEnterDialog && oController._InfoEnterDialog.isOpen()) {
			oController._InfoEnterDialog.close();
		}
	},
	
	onPressNewApply : function(oEvnet){
		
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();		
		
		if(!oController._SelectDoctypeDialog) {
			oController._SelectDoctypeDialog = sap.ui.jsfragment("zui5_hrxx_actloa.fragment.SelectDoctype", oController);
			oView.addDependent(oController._SelectDoctypeDialog);
		}
		
		oController._SelectDoctypeDialog.open();
	},
	
	
	onSMSelectType : function(oEvent){
		
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();
		var toPageId = "";
		var vLeaveType = "";
		
		for(var i=1; i<=6; i++) {
			var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SM_RadioButton" + i);
			if(oControl) {
				if(oControl.getSelected()) {
					var vCustomData = oControl.getCustomData();
					if(vCustomData && vCustomData.length) {
						for(var j=0; j<vCustomData.length; j++) {
							if(vCustomData[j].getKey() == "PageId") {
								toPageId = vCustomData[j].getValue();
							} else if(vCustomData[j].getKey() == "LeaveType") {
								vLeaveType = vCustomData[j].getValue();
							}
						}
					}
					break;
				}
			}
		}
		
		if(toPageId != "") {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : toPageId, //"zui5_hrxx_actapp.ActAppDocument",
			      data : {
		    	     Astat : "00",
			    	 Persa : oController._vPersa,
			    	 Pernr : "",
			    	 Reqno : "",
			    	 Docno : "",
			    	 Actty : "H",
			    	 FromPageId : "zui5_hrxx_actloa.LoaAppMain"
			      }
			});
		}

		oController.onSMClose();
		
	},
	
	
	onSMClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();
		
		if(oController._SelectDoctypeDialog && oController._SelectDoctypeDialog.isOpen()) {
			oController._SelectDoctypeDialog.close();
		}
	},
	
	onBeforeOpenInfoEnterDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();
		oController.setDialogSelectBox(oController);
		var oDoc  = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Docno");
		oDoc.setSelectedItem(oDoc.getFirstItem());
		oController.onChangeDocno();

		
	},
	
	setDialogSelectBox : function(oController){
		var oDocSelectBox = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Docno");
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var filterString = "";
		    filterString += "/?$filter=";  
		    filterString += "Persa%20eq%20%27" + oController._vPersa + "%27"; 
		    /* 20160216 KYJ
		     * Filter Docty 추가 
		     */ 
		    filterString += "%20and%20"; 
		    filterString += "Docty%20eq%20%27" + oController._vDocty + "%27"; 
		    
	    oDocSelectBox.removeAllItems();    
	    oDocSelectBox.addItem(
	    	new sap.ui.core.Item({
						key : "00", 
						text : oBundleText.getText("SELECTDATA")
					})
	    );
		oModel.read("/DraftActionApprovalRequestSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
							    oDocSelectBox.addItem(
								    	new sap.ui.core.Item({
													key : oData.results[i].Docno, 
													text : oData.results[i].Doctx,
													customData : [ new sap.ui.core.CustomData({key : "Title", value : oData.results[i].Title}),
													               new sap.ui.core.CustomData({key : "Orgeh", value : oData.results[i].Orgeh}),
													               new sap.ui.core.CustomData({key : "Actda", value : oData.results[i].Actda})]
												})
							    );
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		var oOrgehSelectBox = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Orgeh");
		filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		oOrgehSelectBox.removeAllItems();    
		oOrgehSelectBox.addItem(
	    	new sap.ui.core.Item({
						key : "00", 
						text : oBundleText.getText("SELECTDATA")
					})
	    );
		oModel.read("/AppReqDepListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oOrgehSelectBox.addItem(
								    	new sap.ui.core.Item({
													key : oData.results[i].Orgeh, 
													text : oData.results[i].Orgtx,
												})
							    );
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	
	onChangeDocno : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();		
		var oDocSelect = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Docno");
		var vDocKey = oDocSelect.getSelectedKey();
		var vDocItem = oDocSelect.getSelectedItem();
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Actda");
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Orgeh");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_LAE_Title");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		if(vDocKey == "00" || vDocKey == ""){
			oActda.setValue("");
			oOrgeh.setSelectedItem(oOrgeh.getFirstItem());
			oTitle.setValue("");
			oActda.setEnabled(true);
			oOrgeh.setEnabled(true);
			oTitle.setEnabled(true);
		}else{
			
			var vCustomData = vDocItem.getCustomData();
			if(vCustomData && vCustomData.length) {
				oTitle.setValue( vCustomData[0].getValue());
				oOrgeh.setSelectedKey( vCustomData[1].getValue());
				oActda.setValue( dateFormat.format(vCustomData[2].getValue()));
			}
			oActda.setEnabled(false);
			oOrgeh.setEnabled(false);
			oTitle.setEnabled(false);
		}
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actloa.fragment.LoaAppListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();	
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oBinding = oTable.getBinding("items");
		
		var mParams = oEvent.getParameters();
		
		var aSorters = [];
	    var sPath = mParams.sortItem.getKey();
	    var bDescending = mParams.sortDescending;
	    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	    oBinding.sort(aSorters);
	},
	
	onPressFilter : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();		
		
		if(!oController._FilterDialog) {
			oController._FilterDialog = sap.ui.jsfragment("zui5_hrxx_actloa.fragment.LoaAppListFilter", oController);
			oView.addDependent(oController._FilterDialog);
		}
		
		oController._FilterDialog.open();
		
	},
	
	onConfirmFilterDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();	
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oBinding = oTable.getBinding("items");
		var oIconbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
		var sKey = oIconbar.getSelectedKey();
	    var oFilters = [];
	    if (sKey === "creation") {
	      oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "10"));
	    } else if (sKey === "approval") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
	    } else if (sKey === "confirmation") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "30"));
	    } else if (sKey === "reject") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "40"));
	    } else if (sKey === "complete") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "50"));	      
	    }
	    var oEname = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_Ename"); 
	    var oApern = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_Apern"); 
	    var oFromBakda = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_FromBakda"); 
	    var oToBakda = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_ToBakda"); 
	    
	    if(oEname != undefined){
		    if(oEname.getValue() != "")
		    	oFilters.push(new sap.ui.model.Filter("Ename", "Contains", oEname.getValue()));	
		    if(oApern.getValue() != "")
		    	oFilters.push(new sap.ui.model.Filter("Aprnm", "Contains", oApern.getValue()));	
		    if(oFromBakda.getValue() != "" && oToBakda.getValue() != ""){
		    	oFilters.push(new sap.ui.model.Filter("Bakda", sap.ui.model.FilterOperator.BT , new Date(oFromBakda.getValue()) ,new Date(oToBakda.getValue())));	
		    }
		    else if(oFromBakda.getValue() != ""){
		    	oFilters.push(new sap.ui.model.Filter("Bakda", sap.ui.model.FilterOperator.EQ , new Date(oFromBakda.getValue())));	
		    }
		    else if(oToBakda.getValue() != ""){
		    	oFilters.push(new sap.ui.model.Filter("Bakda", sap.ui.model.FilterOperator.EQ , new Date(oToBakda.getValue())));	
		    }
	    }
	    
	    oBinding.filter(oFilters);
	    oController.onFilterClose();
//		var mParams = oEvent.getParameters();
//		
//		var aSorters = [];
//	    var sPath = mParams.sortItem.getKey();
//	    var bDescending = mParams.sortDescending;
//	    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
//	    oBinding.sort(aSorters);
	},
	
	onFilterClose : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
		var oController = oView.getController();
		
		if(oController._FilterDialog && oController._FilterDialog.isOpen()) {
			oController._FilterDialog.close();
		}
	},
	
//	setSearchFields : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actloa.LoaAppMain");
//		var oController = oView.getController();	
//		
//		var searchFields = oController.vSearchFields;
//		var oContainer = null;
//		var oFilter = null;
//		var oControl = null;
//		var tmpControl = null;
//	
//		var oContainer = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_Layout");
//			
//		
//		var oAdminControl = new sap.m.Label({text : "대상자" ,
//											 width : "310px"}).addStyleClass("L2P13Font");
//		oContainer.addContent(oAdminControl);
//		
//		for(var j=1; j<=5; j++) {
//			var vVisible = false;
//			if(j == 1) vVisible = true;
//			oControl = new sap.m.Toolbar(oController.PAGEID + "_" + j + "_Ename" + "_Toolbar", {
//				width : "310px",
//				design : sap.m.ToolbarDesign.Auto,
//				visible : vVisible,
//				content : [
//				           	new sap.m.Input(oController.PAGEID + "__" + j + "_Ename", {
//								width: "215px",
//							}).addStyleClass("L2P13Font"),
//							new sap.m.ToolbarSpacer(),
//							new sap.m.Input(oController.PAGEID + "__" + j + "_" + searchFields[i].id + "_T", {
//								width: "35px",
//								maxLength: 2
//							}).addStyleClass("L2P13Font"),
//							new sap.m.Label({text : oBundleText.getText("GEYEAR"), width:"16px", textAlign:"Right"})
//				          ]
//			}).addStyleClass("L2PToolbarNoBottomLine");
//			if(j == 1) {
//				oControl.addContent(
//					new sap.m.Image({
//						src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_plus.png",
//						press : oController.addItem,
//						customData: {key:"id",value:searchFields[i].id}
//					})
//				);
//			} else {
//				oControl.addContent(
//					new sap.m.Image({
//						src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_minus.png",
//						press : oController.removeItem,
//						customData: [{key:"id",value:searchFields[i].id},
//		        	                 {key:"type",value:searchFields[i].control},
//		        	                 {key:"andOr",value:searchFields[i].andOr},
//		        	                 {key:"seqnr",value:j}]
//					})
//				);
//			}
//			oFilter.addContent(oControl);
//		}
//		
//			
//			if(searchFields[i].control != "P2") {
//				if(searchFields[i].andOr == "X") {
//					oControl = new sap.m.Toolbar({
//						width : "310px",
//						design : sap.m.ToolbarDesign.Auto,
//						content : [new sap.m.Label({text : searchFields[i].label}).addStyleClass("L2P13Font"),
//						           new sap.m.ToolbarSpacer(),
////						           new sap.m.Switch(oController.PAGEID + "_" + searchFields[i].id + "_ANDOR", {
////						        	   customTextOn : "Or",
////						        	   customTextOff : "And",
////						        	   type : sap.m.SwitchType.Default,
////						        	   state : true
////						           }),
//						           new control.L2PSwitch(oController.PAGEID + "_" + searchFields[i].id + "_ANDOR", {
//						        	   onText : "Or",
//						        	   offText : "And",
//									   cssPath: "/sap/bc/ui5_ui5/sap/zhrxx_common/css/",
//									})]
//					}).addStyleClass("L2PToolbarNoBottomLine");
//					oFilter.addContent(oControl);
//				} else {					
//					oControl = new sap.m.Toolbar({
//						width : "310px",
//						design : sap.m.ToolbarDesign.Auto,
//						content : [new sap.m.Label({text : searchFields[i].label}).addStyleClass("L2P13Font")]
//					}).addStyleClass("L2PToolbarNoBottomLine");
//					oFilter.addContent(oControl);
//				}
//			}				
//			
//			if(searchFields[i].andOr == "X") {
////				oControl = new sap.m.Toolbar({
////					width : "310px",
////					design : sap.m.ToolbarDesign.Auto,
////					content : [
////								new sap.m.RadioButton(oController.PAGEID + "_" + searchFields[i].id + "_OR", {
////									groupName : oController.PAGEID + "_" + searchFields[i].id + "_ANDOR",
////									text : "Or",
////									selected : true
////								}).addStyleClass("L2P13Font"),
////								new sap.m.RadioButton(oController.PAGEID + "_" + searchFields[i].id + "_AND", {
////									groupName : oController.PAGEID + "_" + searchFields[i].id + "_ANDOR",
////									text : "And"
////								}).addStyleClass("L2P13Font"),
////								new sap.m.ToolbarSpacer(),
////								new sap.m.Button({
////					        	    icon : "sap-icon://add",
////					        	    type:sap.m.ButtonType.Transparent,
////			 	                	press : oController.addItem,
////			 	                	customData: {key:"id",value:searchFields[i].id}
////			 	               	}),
////								new sap.m.Button({
////					        	    icon : "sap-icon://less",
////					        	    type:sap.m.ButtonType.Transparent,
////			 	                	press : oController.removeItem,
////					        	    customData: [{key:"id",value:searchFields[i].id},
////					        	                 {key:"type",value:searchFields[i].control},
////					        	                 {key:"andOr",value:searchFields[i].andOr}]
////			 	               	}),
////					          ]
////				}).addStyleClass("L2PToolbarNoBottomLine");
////				oFilter.addContent(oControl);
//			}
//			
//			switch(searchFields[i].control){
//				case "P" :
//					var vHelpMethod = "";
//					if(searchFields[i].job == "X") vHelpMethod = oController.onOpenSearchJobDialog;
//					else if(searchFields[i].noPersa == "X") vHelpMethod = oController.onOpenSearchNoPersaDialog;
//					else if(searchFields[i].bgbu == "X") vHelpMethod = oController.onOpenSearchBgBuDialog;
//					else vHelpMethod = oController.onOpenSearchDialog;
//					
//					if(searchFields[i].andOr == "X" && searchFields[i].tYear == "X") {
//						for(var j=1; j<=5; j++) {
//							var vVisible = false;
//							if(j == 1) vVisible = true;
//							oControl = new sap.m.Toolbar(oController.PAGEID + "_" + j + "_" + searchFields[i].id + "_Toolbar", {
//								width : "310px",
//								design : sap.m.ToolbarDesign.Auto,
//								visible : vVisible,
//								content : [
//								           	new sap.m.Input(oController.PAGEID + "__" + j + "_" + searchFields[i].id, {
//												width: "215px",
//												showValueHelp: true,
//												valueHelpRequest: vHelpMethod,
//												liveChange: oController.onCheckValue,
//												customData: [{key:"id",value:searchFields[i].id},
//												             {key:"label",value:searchFields[i].label},
//												             {key:"code",value:""}]
//											}).addStyleClass("L2P13Font"),
//											new sap.m.ToolbarSpacer(),
//											new sap.m.Input(oController.PAGEID + "__" + j + "_" + searchFields[i].id + "_T", {
//												width: "35px",
//												maxLength: 2
//											}).addStyleClass("L2P13Font"),
//											new sap.m.Label({text : oBundleText.getText("GEYEAR"), width:"16px", textAlign:"Right"})
//								          ]
//							}).addStyleClass("L2PToolbarNoBottomLine");
//							if(j == 1) {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_plus.png",
//										press : oController.addItem,
//										customData: {key:"id",value:searchFields[i].id}
//									})
//								);
//							} else {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_minus.png",
//										press : oController.removeItem,
//										customData: [{key:"id",value:searchFields[i].id},
//						        	                 {key:"type",value:searchFields[i].control},
//						        	                 {key:"andOr",value:searchFields[i].andOr},
//						        	                 {key:"seqnr",value:j}]
//									})
//								);
//							}
//							oFilter.addContent(oControl);
//						}
//					} else if(searchFields[i].andOr == "X") {
//						for(var j=1; j<=5; j++) {
//							var vVisible = false;
//							if(j == 1) vVisible = true;
//							oControl = new sap.m.Toolbar(oController.PAGEID + "_" + j + "_" + searchFields[i].id + "_Toolbar", {
//								width : "310px",
//								design : sap.m.ToolbarDesign.Auto,
//								visible : vVisible,
//								content : [
//								           	new sap.m.Input(oController.PAGEID + "__" + j + "_" + searchFields[i].id, {
//												width: "285px",
//												showValueHelp: true,
//												valueHelpRequest: vHelpMethod,
//												liveChange: oController.onCheckValue,
//												customData: [{key:"id",value:searchFields[i].id},
//												             {key:"label",value:searchFields[i].label},
//												             {key:"code",value:""}]
//											}).addStyleClass("L2P13Font")
//								          ]
//							}).addStyleClass("L2PToolbarNoBottomLine");
//							if(j == 1) {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_plus.png",
//										press : oController.addItem,
//										customData: {key:"id",value:searchFields[i].id}
//									})
//								);
//							} else {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_minus.png",
//										press : oController.removeItem,
//										customData: [{key:"id",value:searchFields[i].id},
//						        	                 {key:"type",value:searchFields[i].control},
//						        	                 {key:"andOr",value:searchFields[i].andOr},
//						        	                 {key:"seqnr",value:j}]
//									})
//								);
//							}
//							oFilter.addContent(oControl);
//						}
//					} else if(searchFields[i].tYear == "X") {
//						tmpControl = new sap.m.MultiInput(oController.PAGEID + "_" + searchFields[i].id, {
//			           		width: "235px",
//							valueHelpRequest: vHelpMethod,
//							customData: [{key:"id",value:searchFields[i].id},
//							             {key:"label",value:searchFields[i].label}]
//						}).addStyleClass("L2P13Font");
//						tmpControl.addValidator(function(args){
//							var text = args.text;
//							return new sap.m.Token({key: "", text: text});
//						});
//						tmpControl.addValidator(function(args){
//							args.asyncCallback(args.suggestedToken);
//							return sap.m.MultiInput.WaitForAsyncValidation;
//						});
//						oControl = new sap.m.Toolbar({
//							width : "310px",
//							design : sap.m.ToolbarDesign.Auto,
//							content : [
//							           	tmpControl,
//										new sap.m.ToolbarSpacer(),
//										new sap.m.Input(oController.PAGEID + "_" + searchFields[i].id + "_T", {
//											width: "35px",
//											maxLength: 2
//										}).addStyleClass("L2P13Font"),
//										new sap.m.Label({text : oBundleText.getText("GEYEAR"), width:"16px", textAlign:"Right"})
//							          ]
//						}).addStyleClass("L2PToolbarNoBottomLine");
//						oFilter.addContent(oControl);
//					} else {
//						oControl = new sap.m.MultiInput(oController.PAGEID + "_" + searchFields[i].id, {
//							width: "310px",
//							valueHelpRequest: vHelpMethod,
//							customData: [{key:"id",value:searchFields[i].id},
//							             {key:"label",value:searchFields[i].label}]
//						}).addStyleClass("L2P13Font");
//						
//						if(searchFields[i].helpOnly == "X") {
//							oControl.attachLiveChange(function(args) {
//								args.getSource().setValue("");
//							});
//						}
//						
//						oControl.addValidator(function(args){
//							var text = args.text;
//							return new sap.m.Token({key: "", text: text});
//						});
//						oControl.addValidator(function(args){
//							args.asyncCallback(args.suggestedToken);
//							return sap.m.MultiInput.WaitForAsyncValidation;
//						});
//						
//						oFilter.addContent(oControl);
//					} 
//					break;
//
//				case "D" :
//					if(searchFields[i].andOr == "X" && searchFields[i].tYear == "X") {
//						for(var j=1; j<=5; j++) {
//							var vVisible = false;
//							if(j == 1) vVisible = true;
//							
//							tmpControl = new sap.m.Select(oController.PAGEID + "__" + j + "_" + searchFields[i].id, {
//								width: "215px"
//							}).addStyleClass("L2P13Font");
//							tmpControl.addItem(new sap.ui.core.Item({key : "", text : ""}));
////							var vData = oDDLBModel.getProperty("/" + searchFields[i].id);
////							for(var k=0; k<vData.length; k++) {
////								tmpControl.addItem(new sap.ui.core.Item({key : vData[k].Zcode, text : vData[k].Ztext}));
////							}
//							
//							oControl = new sap.m.Toolbar(oController.PAGEID + "_" + j + "_" + searchFields[i].id + "_Toolbar", {
//								width : "310px",
//								design : sap.m.ToolbarDesign.Auto,
//								visible : vVisible,
//								content : [
//								           	tmpControl,
//											new sap.m.ToolbarSpacer(),
//											new sap.m.Input(oController.PAGEID + "__" + j + "_" + searchFields[i].id + "_T", {
//												width: "35px",
//												maxLength: 2
//											}).addStyleClass("L2P13Font"),
//											new sap.m.Label({text : oBundleText.getText("GEYEAR"), width:"16px", textAlign:"Right"})
//								          ]
//							}).addStyleClass("L2PToolbarNoBottomLine");
//							
//							if(j == 1) {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_plus.png",
//										press : oController.addItem,
//										customData: {key:"id",value:searchFields[i].id}
//									})
//								);
//							} else {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_minus.png",
//										press : oController.removeItem,
//										customData: [{key:"id",value:searchFields[i].id},
//						        	                 {key:"type",value:searchFields[i].control},
//						        	                 {key:"andOr",value:searchFields[i].andOr},
//						        	                 {key:"seqnr",value:j}]
//									})
//								);
//							}
//							oFilter.addContent(oControl);
//						}
//					} else if(searchFields[i].andOr == "X") {
//						for(var j=1; j<=5; j++) {
//							var vVisible = false;
//							if(j == 1) vVisible = true;
//							
//							tmpControl = new sap.m.Select(oController.PAGEID + "__" + j + "_" + searchFields[i].id, {
//								width: "285px"
//							}).addStyleClass("L2P13Font");
//							tmpControl.addItem(new sap.ui.core.Item({key : "", text : ""}));
////							var vData = oDDLBModel.getProperty("/" + searchFields[i].id);
////							for(var k=0; k<vData.length; k++) {
////								tmpControl.addItem(new sap.ui.core.Item({key : vData[k].Zcode, text : vData[k].Ztext}));
////							}
//							
//							oControl = new sap.m.Toolbar(oController.PAGEID + "_" + j + "_" + searchFields[i].id + "_Toolbar", {
//								width : "310px",
//								design : sap.m.ToolbarDesign.Auto,
//								visible : vVisible,
//								content : tmpControl
//							}).addStyleClass("L2PToolbarNoBottomLine");
//							
//							if(j == 1) {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_plus.png",
//										press : oController.addItem,
//										customData: {key:"id",value:searchFields[i].id}
//									})
//								);
//							} else {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_minus.png",
//										press : oController.removeItem,
//										customData: [{key:"id",value:searchFields[i].id},
//						        	                 {key:"type",value:searchFields[i].control},
//						        	                 {key:"andOr",value:searchFields[i].andOr},
//						        	                 {key:"seqnr",value:j}]
//									})
//								);
//							}
//							
//							oFilter.addContent(oControl);
//						}
//					} else if(searchFields[i].tYear == "X") {
//						
//						if(searchFields[i].multi == "X") {
//							tmpControl = new sap.m.MultiComboBox(oController.PAGEID + "_" + searchFields[i].id, {
//								width: "235px",
//							}).addStyleClass("L2P13Font");
//						} else {
//							tmpControl = new sap.m.Select(oController.PAGEID + "_" + searchFields[i].id, {
//								width: "235px",
//							}).addStyleClass("L2P13Font");
//							tmpControl.addItem(new sap.ui.core.Item({key : "", text : ""}));
//						}
////						var vData = oDDLBModel.getProperty("/" + searchFields[i].id);
////						for(var k=0; k<vData.length; k++) {
////							tmpControl.addItem(new sap.ui.core.Item({key : vData[k].Zcode, text : vData[k].Ztext}));
////						}
//						
//						oControl = new sap.m.Toolbar({
//							width : "310px",
//							design : sap.m.ToolbarDesign.Auto,
//							content : [
//							           	tmpControl,
//										new sap.m.ToolbarSpacer(),
//										new sap.m.Input(oController.PAGEID + "_" + searchFields[i].id + "_T", {
//											width: "35px",
//											maxLength: 2
//										}).addStyleClass("L2P13Font"),
//										new sap.m.Label({text : oBundleText.getText("GEYEAR"), width:"16px", textAlign:"Right"})
//							          ]
//						}).addStyleClass("L2PToolbarNoBottomLine");
//						oFilter.addContent(oControl);
//					} else {
//						if(searchFields[i].multi == "X") {
//							oControl = new sap.m.MultiComboBox(oController.PAGEID + "_" + searchFields[i].id, {
//								width: "310px",
//							}).addStyleClass("L2P13Font");
//						} else {
//							oControl = new sap.m.Select(oController.PAGEID + "_" + searchFields[i].id, {
//								width: "310px",
//							}).addStyleClass("L2P13Font");
//							oControl.addItem(new sap.ui.core.Item({key : "", text : ""}));
//						}
////						var vData = oDDLBModel.getProperty("/" + searchFields[i].id);
////						for(var j=0; j<vData.length; j++) {
////							oControl.addItem(new sap.ui.core.Item({key : vData[j].Zcode, text : vData[j].Ztext}));
////						}
//						oFilter.addContent(oControl);
//					}
//					break;
//				case "FT" :
//					oControl = new sap.m.Toolbar({
//						width : "310px",
//						design : sap.m.ToolbarDesign.Auto,
//						content : [
//						           	new sap.m.Input(oController.PAGEID + "_" + searchFields[i].id + "_FROM", {
//										width: "125px",
//										maxLength: 15
//									}).addStyleClass("L2P13Font"),
//									new sap.m.ToolbarSpacer(),
//									new sap.m.Label({text : "~", width:"15px", textAlign:sap.ui.core.TextAlign.Center}),
//									new sap.m.ToolbarSpacer(),
//									new sap.m.Input(oController.PAGEID + "_" + searchFields[i].id + "_TO", {
//										width: "125px",
//										maxLength: 15
//									}).addStyleClass("L2P13Font")
//						          ]
//					}).addStyleClass("L2PToolbarNoBottomLine");
//					oFilter.addContent(oControl);
//					break;
//				case "P2" :
//					var vHelpMethod = oController.onDisplaySearchEmpCodeDialog;
//
//					oControl = new sap.m.Toolbar({
//						width : "310px",
//						design : sap.m.ToolbarDesign.Auto,
//						content : [
//						           	new sap.m.ToolbarSpacer(),
//						           	new sap.m.Label({text : searchFields[i].label + " :"}).addStyleClass("L2P13Font"),
//									new sap.m.Input(oController.PAGEID + "_" + searchFields[i].id, {
//										width: "125px",
//										showValueHelp : true,
//										valueHelpRequest: vHelpMethod,
//										customData: [{key:"id",value:searchFields[i].id},
//										             {key:"label",value:searchFields[i].label}]
//									}).addStyleClass("L2P13Font")
//						          ]
//					}).addStyleClass("L2PToolbarNoBottomLine");
//					oFilter.addContent(oControl);
//					break;
//				case "I" :
//					if(searchFields[i].andOr == "X" && searchFields[i].tYear == "X") {
//						for(var j=1; j<=5; j++) {
//							var vVisible = false;
//							if(j == 1) vVisible = true;
//							
//							oControl = new sap.m.Toolbar(oController.PAGEID + "_" + j + "_" + searchFields[i].id + "_Toolbar", {
//								width : "310px",
//								design : sap.m.ToolbarDesign.Auto,
//								visible : vVisible,
//								content : [
//								           	new sap.m.Input(oController.PAGEID + "__" + j + "_" + searchFields[i].id, {
//												width: "215px"
//											}).addStyleClass("L2P13Font"),
//											new sap.m.ToolbarSpacer(),
//											new sap.m.Input(oController.PAGEID + "__" + j + "_" + searchFields[i].id + "_T", {
//												width: "35px",
//												maxLength: 2
//											}).addStyleClass("L2P13Font"),
//											new sap.m.Label({text : oBundleText.getText("GEYEAR"), width:"16px", textAlign:"Right"})
//								          ]
//							}).addStyleClass("L2PToolbarNoBottomLine");
//							
//							if(j == 1) {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_plus.png",
//										press : oController.addItem,
//										customData: {key:"id",value:searchFields[i].id}
//									})
//								);
//							} else {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_minus.png",
//										press : oController.removeItem,
//										customData: [{key:"id",value:searchFields[i].id},
//						        	                 {key:"type",value:searchFields[i].control},
//						        	                 {key:"andOr",value:searchFields[i].andOr},
//						        	                 {key:"seqnr",value:j}]
//									})
//								);
//							}
//							
//							oFilter.addContent(oControl); 
//						}
//					} else if(searchFields[i].andOr == "X") {
//						for(var j=1; j<=5; j++) {
//							var vVisible = false;
//							if(j == 1) vVisible = true;
//							
//							oControl = new sap.m.Toolbar(oController.PAGEID + "_" + j + "_" + searchFields[i].id + "_Toolbar", {
//								width : "310px",
//								design : sap.m.ToolbarDesign.Auto,
//								visible : vVisible,
//								content : new sap.m.Input(oController.PAGEID + "__" + j + "_" + searchFields[i].id, {
//									width: "285px"
//								}).addStyleClass("L2P13Font")
//							}).addStyleClass("L2PToolbarNoBottomLine");
//							
//							if(j == 1) {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_plus.png",
//										press : oController.addItem,
//										customData: {key:"id",value:searchFields[i].id}
//									})
//								);
//							} else {
//								oControl.addContent(
//									new sap.m.Image({
//										src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/icon16_minus.png",
//										press : oController.removeItem,
//										customData: [{key:"id",value:searchFields[i].id},
//						        	                 {key:"type",value:searchFields[i].control},
//						        	                 {key:"andOr",value:searchFields[i].andOr},
//						        	                 {key:"seqnr",value:j}]
//									})
//								);
//							}
//							
//							oFilter.addContent(oControl);
//						}
//					} else if(searchFields[i].tYear == "X") {
//						
//						oControl = new sap.m.Toolbar({
//							width : "310px",
//							design : sap.m.ToolbarDesign.Auto,
//							content : [
//							           	new sap.m.Input(oController.PAGEID + "_" + searchFields[i].id, {
//											width: "235px",
//										}).addStyleClass("L2P13Font"),
//										new sap.m.ToolbarSpacer(),
//										new sap.m.Input(oController.PAGEID + "_" + searchFields[i].id + "_T", {
//											width: "35px",
//											maxLength: 2
//										}).addStyleClass("L2P13Font"),
//										new sap.m.Label({text : oBundleText.getText("GEYEAR"), width:"16px", textAlign:"Right"})
//							          ]
//						}).addStyleClass("L2PToolbarNoBottomLine");
//						oFilter.addContent(oControl);
//					} else {
//						oControl = new sap.m.Input(oController.PAGEID + "_" + searchFields[i].id, {
//							width: "310px",
//						}).addStyleClass("L2P13Font");
//						oFilter.addContent(oControl);
//					}
//					break;
//				default:
//			}
//			
//			oContainer.addContent(oFilter);
//		}
//		
//	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	}
});