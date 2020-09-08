jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.PersonCard");
jQuery.sap.require("control.BusyIndicator");
jQuery.sap.require("common.Common");
jQuery.sap.require("ZUI5_HR_Empprofile.common.EmployeeProfile");
jQuery.sap.require("ZUI5_HR_Empprofile.common.AttachFileAction");
jQuery.sap.require("common.ZipSearch");


//jQuery.sap.require("common.EmployeeProfile");

sap.ui.controller("ZUI5_HR_Empprofile.EmployeeProfile", {
	PAGEID : "EmployeeProfile",
	
	OrgTree : null,
	
	_vMasterTabs : [],
	_vSubTabs : [],
	
	_vSelectedPernr : "",
	_vSelectedEncid : "",
	_vSelectedEname : "",
	_vSCreenType : "",
	_vSearchword : "",
	
	oDetailInfoGrid : null,
	
	_vPersas : [],
	
	_vRootOrgeh : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	oActionSheet : null,
	
	_vBasicHeight : 188,
	_vTabHeight : 34,
	_vFullBtnHeight : 32,
	_vDummyHeight : 45,
	_vEmpProfileResultSwitch : "",
	
	HeaderModel : new sap.ui.model.json.JSONModel(),
	_DialogJsonModel : new sap.ui.model.json.JSONModel(),
	_FamilyDialogJsonModel : new sap.ui.model.json.JSONModel(),
	_MilitaryDialogJsonModel : new sap.ui.model.json.JSONModel(),
	_FamilyMode : "",
	_MilitaryMode : "" ,
	_KdsvhList : [],
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ZUI5_HR_Empprofile.EmployeeProfile
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		//};
		
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
		});
		
		sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
		sap.ui.getCore().getEventBus().subscribe("EmpolyeeProfile", "FinishWork", this.onFinishWork, this);
	},
	
	onBeforeShow : function(oEvent) {
		this.onInitPersonInfo(this);
		
		this._vSearchword = jQuery.sap.getUriParameters().get("searchword");
		if(!this._vSearchword) this._vSearchword = "";
		
		// ESS 일 경우 조직도 숨김
		if(_gAuth == "E"){
			var oLeftLayout = sap.ui.getCore().byId(this.PAGEID + "_LeftLayout");
			oLeftLayout.setVisible(false);
		}		
	},

	onAfterShow : function(oEvent) {
		$("#" + this.PAGEID + "_SplitContainer").height(window.innerHeight - 130);
		$("#" + this.PAGEID + "_OrgChart").height(window.innerHeight - 230);
		$("#" + this.PAGEID + "_LeftScrollContainer").height(window.innerHeight - 230);
		
		if(_gInPerer && _gInPerer != ""){
			this._vSearchword = _gInPerer ;
		}else if(_gAuth == "E"){
			this._vSearchword = gPernr ;
			this._vSearchword = gPerid ;
		}
		
		var oStat2 = sap.ui.getCore().byId(this.PAGEID + "_Stat2");
		if(_gAuth == "H"){
			oStat2.setEditable(true);
		}else{
			oStat2.setEditable(false);
		}
		
		this.setSelectData(gPersa);
		
		if(_gAuth != "E") {
			this.createOrgTree();
		}
		
		if(this._vSearchword != "") {
			var oKeyword = sap.ui.getCore().byId(this.PAGEID + "_Keyword");
			oKeyword.setValue(decodeURI(this._vSearchword));
			
			this.onSearchPerson();
		} 
		
		if(_gAuth == "E"){
			var oToogleBtn = sap.ui.getCore().byId(this.PAGEID + "_ToogleBtn");
			if(oToogleBtn) oToogleBtn.setVisible(false);
			var oSplitContainer = sap.ui.getCore().byId(this.PAGEID + "_SplitContainer");
				oSplitContainer.setShowSecondaryContent(false);
		}	
		
		this.onResizeWindow(oEvent);
	},
	
	onResizeWindow : function(oEvent) {
		if(_gAuth == "E"){
			$("#" + this.PAGEID + "_SplitContainer").height(window.innerHeight - 90);
			
			$("#" + this.PAGEID + "_OrgChart").height(window.innerHeight - 253);
			$("#" + this.PAGEID + "_LeftScrollContainer").height(window.innerHeight - 221);
		} else {
			$("#" + this.PAGEID + "_SplitContainer").height(window.innerHeight - 78);
			
			$("#" + this.PAGEID + "_OrgChart").height(window.innerHeight - 213);
			$("#" + this.PAGEID + "_LeftScrollContainer").height(window.innerHeight - 181);
		}
	},
	
	onFinishWork : function(oEvent) {
		this.BusyDialog.close();
	},
	
	createOrgTree : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		if(oController.OrgTree == null) {
			oController.OrgTree = new dhtmlXTreeObject(oController.PAGEID + "_OrgChart", "100%", "100%", 0);

			oController.OrgTree.setSkin('dhx_skyblue');
			oController.OrgTree.enableAutoTooltips(true);
			oController.OrgTree.setImagePath("/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/css/imgs/dhxtree_skyblue/");
			
			oController.OrgTree.attachEvent("onSelect", oController.onSelectOrg);
			
			console.log("TREE => ", oController.OrgTree);
			
			oController.repalceOrgTreeData();
		}		
	},
	
	onSelectOrg : function(id) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var vSplit = id.split("_");
		if(vSplit.length > 1){
			id = vSplit[0];
		}
		
		var vOtype = oController.OrgTree.getUserData(id, "Otype");
		var vRooto = oController.OrgTree.getUserData(id, "Rooto");
		if(vOtype != "O") {
//			var vPernr = oController.OrgTree.getUserData(id, "Objid");
//			oController._vSelectedPernr = vPernr;
			var vEncid = oController.OrgTree.getUserData(id, "Objid");
			oController._vSelectedEncid = vEncid;
			oController._vSelectedEname = oController.OrgTree.getItemText(id);
			oController.makePersonInfo(oController, vEncid);
			return;
		}
		
		oController.onInitPersonInfo(oController);
		
		var vSubItems = oController.OrgTree.getSubItems(id);
		// - 는 사원번호로 판단 , 사원번호가 있을 시 return 사원번호가 없을 시 진행
		if(vSubItems != "") {
			return;
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var vDatum = dateFormat.format(new Date());
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oPath = "/OrgTreeSet/?$filter=Actty eq '" + "DN" + "'" 
                  + " and Xpern eq '" + "X" + "'"
                  + " and Otype eq '" + vOtype + "'"
  				  + " and Rooto eq '" + vRooto + "'"
  				  + " and Objid eq '" + id + "'"
                  + " and Datum eq datetime'" + vDatum + "T00:00:00'";
		
		oModel.read (
				oPath,
				null, 
				null, 
				true, 
				function(oData, oResponse) {
					var i;
					if(oData) {
						for(i=0; i<oData.results.length; i++) {
							var OrgText = oData.results[i].Stext;
							var vImage = "";
							var vObjid = "";
							if(oData.results[i].Hasdn == "X") {
								vImage = "folderClosed.gif";
							} else {
								if(oData.results[i].Otype == "O") {
									vImage = "folderClosed.gif";
								} else {
									if(oData.results[i].Xchif == "X" && oData.results[i].Addis == "") {
										vImage = "chief1.png";
									} else if(oData.results[i].Xchif == "X" && oData.results[i].Addis == "1") {
										vImage = "chief2.png";
									} else if(oData.results[i].Xchif == "X" && oData.results[i].Addis == "2") {
										vImage = "chief3.png";
									} else if(oData.results[i].Xchif == "" && oData.results[i].Addis == "") {
										vImage = "person1.png";
									} else if(oData.results[i].Xchif == "" && oData.results[i].Addis == "1") {
										vImage = "person2.png";
									} else if(oData.results[i].Xchif == "" && oData.results[i].Addis == "3") {
										vImage = "person3.png";
									}   
									
								}
							}
							if(oData.results[i].Otype == "O") {
								vObjid = oData.results[i].Objid;
							} else {
								vObjid = oData.results[i].Objid + "-" + oData.results[i].ObjidUp;
							}
							if(oData.results[i].ObjidUp === "00000000" || oData.results[i].ObjidUp === "") {
								oController.OrgTree.insertNewItem("0", oData.results[i].Objid, OrgText, null, vImage);
							} else {
								oController.OrgTree.insertNewChild(oData.results[i].ObjidUp, vObjid, OrgText, null, vImage);
							}
							oController.OrgTree.setUserData(vObjid, "Otype", oData.results[i].Otype);
							oController.OrgTree.setUserData(vObjid, "Rooto", oData.results[i].Rooto);
							oController.OrgTree.setUserData(vObjid, "Objid", oData.results[i].Objid);
							oController.OrgTree.setItemStyle(vObjid, "font-size:13px;font-family: 'Malgun Gothic'");
						}
					}
				},
				function(oError) {
					common.Common.log(oError);
				}
		);
	},	
	
	repalceOrgTreeData : function() {
		
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		if(oController.OrgTree == null) return;
		
		var vNode = oController.OrgTree.getAllItemsWithKids();
		if(vNode && vNode != "") {
			var vNodes = vNode.split(",");
			if(vNodes && vNodes.length) {
				for(var i=0; i<vNodes.length; i++) {
					oController.OrgTree.deleteItem(vNodes[i], true);
				}
			}
		}
		
		vNode = oController.OrgTree.getAllChildless();
		if(vNode && vNode != "") {
			var vNodes = vNode.split(",");
			if(vNodes && vNodes.length) {
				for(var i=0; i<vNodes.length; i++) {
					oController.OrgTree.deleteItem(vNodes[i], true);
				}
			}
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var vRootOrgeh = oController._vRootOrgeh;
		var vDatum = dateFormat.format(new Date());
		
		var vRootNodeId = vRootOrgeh;
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var oOpenObjid = [];	// 임원인 경우 조직도 조정 : 열린 상태로 있어야 하는 조직코드

		var oPath = "/AuthOrgTreeSet/?$filter=Xpern eq 'X' and Datum eq datetime'" + vDatum + "T00:00:00'";
		if(_gAuth == "H" || _gAuth == "M"){
			oPath +=" and Autyp eq '" + _gAuth + "'";
		} 
		
		oController.BusyDialog.open();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		setTimeout(function(){oModel.read (
				oPath,
				null, 
				null, 
				true, 
				function(oData, oResponse) {
					var i;
					if(oData) {
						for(i=0; i<oData.results.length; i++) {
							if(i== 0) {
								vRootNodeId = oData.results[i].Objid;	
							}
							var OrgText = oData.results[i].Stext;
							var vImage = "";
							if(oData.results[i].Hasdn == "X") {
								vImage = "folderClosed.gif";
							} else {
								if(oData.results[i].Otype == "O") {
									vImage = "folderClosed.gif";
								} else {
									vImage = "leaf.gif";
									if(oData.results[i].Xchif == "X" && oData.results[i].Addis == "") {
										vImage = "chief1.png";
									} else if(oData.results[i].Xchif == "X" && oData.results[i].Addis == "1") {
										vImage = "chief2.png";
									} else if(oData.results[i].Xchif == "X" && oData.results[i].Addis == "2") {
										vImage = "chief3.png";
									} else if(oData.results[i].Xchif == "" && oData.results[i].Addis == "") {
										vImage = "person1.png";
									} else if(oData.results[i].Xchif == "" && oData.results[i].Addis == "1") {
										vImage = "person2.png";
									} else if(oData.results[i].Xchif == "" && oData.results[i].Addis == "3") {
										vImage = "person3.png";
									}
								}
							}
							
							if(oData.results[i].ObjidUp === "00000000" || oData.results[i].ObjidUp === "") {
								oController.OrgTree.insertNewItem("0", oData.results[i].Objid, OrgText, null, vImage);
							} else {
								oController.OrgTree.insertNewChild(oData.results[i].ObjidUp, oData.results[i].Objid, OrgText, null, vImage);
							}
							
							oController.OrgTree.setUserData(oData.results[i].Objid, "Otype", oData.results[i].Otype);
							oController.OrgTree.setUserData(oData.results[i].Objid, "Rooto", oData.results[i].Rooto);
							oController.OrgTree.setUserData(oData.results[i].Objid, "Objid", oData.results[i].Objid);
							oController.OrgTree.setItemStyle(oData.results[i].Objid, "font-size:13px;font-family: 'Malgun Gothic'");
							
						}
						
						if(oOpenObjid.length != 0){
							oController.OrgTree.closeAllItems();
							var uniqueObjid = [];

							$.each(oOpenObjid, function(i, el){
								if($.inArray(el, uniqueObjid) === -1) uniqueObjid.push(el);
							});
							
							for(var a=0; a<uniqueObjid.length; a++){
								oController.OrgTree.openItem(uniqueObjid[a]);
							}
						}
						
						oController.OrgTree.selectItem(vRootNodeId);
						oController.BusyDialog.close();
					}
				},
				function(oError) {
					oController.BusyDialog.close();
					common.Common.log(oError);
				}
		), 100});
	},
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ZUI5_HR_Empprofile.EmployeeProfile
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ZUI5_HR_Empprofile.EmployeeProfile
*/

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ZUI5_HR_Empprofile.EmployeeProfile
*/
	onSelectTab : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var oResultList = sap.ui.getCore().byId(oController.PAGEID + "_LeftScrollContainer");
		
		oController.onInitPersonInfo(oController);
		
		var oControlId = oEvent.getSource().getId();
		if(oControlId.indexOf("_OrgChart_") != -1) {
			$("#" + oController.PAGEID + "_OrgChartLayout").css("display", "");
			oResultList.setVisible(false);
		} else {
			$("#" + oController.PAGEID + "_OrgChartLayout").css("display", "none");
			oResultList.setVisible(true);
			oResultList.setHeight((window.innerHeight - 230) + "px");
		}
		
	},
	
	onSearchOrg : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		if(oController.OrgTree == null) return;
		
		var sValue = oEvent.getParameter("query");
		if(sValue != "") {
			oController.OrgTree.findItem(sValue, 0, 1);
		}
	},
	
	searchOrgPrev : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		if(oController.OrgTree == null) return;
		
		var oStext = sap.ui.getCore().byId(oController.PAGEID + "_SearchTree");
		if(oStext.getValue() != "") {
			oController.OrgTree.findItem(oStext.getValue(), 1);
		}
	},
	
	searchOrgNext : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		if(oController.OrgTree == null) return;
		
		var oStext = sap.ui.getCore().byId(oController.PAGEID + "_SearchTree");
		if(oStext.getValue() != "") {
			oController.OrgTree.findItem(oStext.getValue(), 0);
		}
	},
	
	onSearchPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		if(oEvent && oEvent.getParameter("refreshButtonPressed") == undefined) {
			return;
		}
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oKeyword = sap.ui.getCore().byId(oController.PAGEID + "_Keyword");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var vActda = dateFormat.format(new Date());
		
		var filterString = "/?$filter=Actda eq datetime'" + vActda + "T00:00:00'";
		filterString += " and Actty eq '"+ _gAuth +"'" ;
		
		var vReqAuth = "1";
		if(_gAuth == "M")  vReqAuth = "2";
		else if(_gAuth == "H")  vReqAuth = "3";
		filterString += " and ReqAuth eq '"+ vReqAuth +"'" ;
		
		if(oKeyword.getValue() != "") {
			if(oKeyword.getValue().length < 2) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2515"));	// 2515:성명은 2자 이상이어야 합니다.
				return;
			}
			
			if(oKeyword.getValue().indexOf("%") != -1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2410"));	// 2410:검색어에 허용되지 않은 문자(%, &)가 있습니다.
				return;
			}
			filterString += " and Ename eq '" + encodeURI(oKeyword.getValue()) + "'";
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2515"));	// 2515:성명은 2자 이상이어야 합니다.
			return;
		}
		
		var oStat2 = sap.ui.getCore().byId(oController.PAGEID + "_Stat2");
		var vStat2String = "";
		var vStat2Data = oStat2.getSelectedKeys();
		if(vStat2Data && vStat2Data.length) {
			for(var i=0; i<vStat2Data.length; i++) {
				if(vStat2String != "") {
					vStat2String += " or ";
				}
				vStat2String += "Stat2 eq '" + vStat2Data[i] + "'";
			}
		}
		if(vStat2String != "") {
			filterString += " and (" + vStat2String +  ")";
		}
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		
		oController.BusyDialog.open();
		
		setTimeout(function(){
			oModel.read (
					"/EmpSearchResultSet" + filterString,
					null, 
					null, 
					false, 
					function(oData, oResponse) {
						var i;
						if(oData && oData.results) {
							for(i=0; i<oData.results.length; i++) {
								vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
							}
						}
						oController.BusyDialog.close();
					},
					function(oError) {
						oController.BusyDialog.close();
						common.Common.log(oError);
						
						if(oError.response.body){
							var ErrorMessage = oError.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							oController.Error = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}else{
								oController.ErrorMessage = ErrorMessage ;
							}
						}
						
						if(oController.Error == "E"){
							oController.Error = "";
							sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
						}
					}
			);
			mEmpSearchResult.setData(vEmpSearchResult);
			var oResultBtn = sap.ui.getCore().byId(oController.PAGEID + "_Result_Btn");
					
			oResultBtn.setText(oBundleText.getText("LABEL_1467") + " (" + vEmpSearchResult.EmpSearchResultSet.length + ")");	// 1467:검색결과
			
			oController.onInitPersonInfo(oController);
			
			var showPersonInfo = function() {
				oController._vSelectedPernr = vEmpSearchResult.EmpSearchResultSet[0].Pernr;
				oController._vSelectedEname = vEmpSearchResult.EmpSearchResultSet[0].Ename;
				oController._vSelectedEncid = vEmpSearchResult.EmpSearchResultSet[0].Encid;
				
				oController.makePersonInfo(oController, vEmpSearchResult.EmpSearchResultSet[0].Encid);
			};
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1) {
				setTimeout(showPersonInfo, 200);
			}else{
				var oResultList = sap.ui.getCore().byId(oController.PAGEID + "_LeftScrollContainer");
				$("#" + oController.PAGEID + "_OrgChartLayout").css("display", "none");
				oResultList.setVisible(true);
				oResultList.setHeight((window.innerHeight - 230) + "px");
			}
		},100);
	},
	
	onInitPersonInfo : function(oController) {
		var oBasicInfoLayout = sap.ui.getCore().byId(oController.PAGEID + "_BasicInfoLayout");
		var oMasterTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_MasterTabMenuLayout");
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		var oSectionLayout = sap.ui.getCore().byId(oController.PAGEID + "_SectionLayout");
		oSectionLayout.setVisible(false);	
	},
	
	onFullScreen : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var vIcon = oControl.getIcon();
		
		var oBasicInfoLayout = $("#" + oController.PAGEID + "_BasicInfoLayout"); 
		var oMasterTabMenuLayout = $("#" + oController.PAGEID + "_MasterTabMenuLayout"); 
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		var oSplitContainer = sap.ui.getCore().byId(oController.PAGEID + "_SplitContainer");
		
		var oToogleBtn = sap.ui.getCore().byId(oController.PAGEID + "_ToogleBtn");
		var oConcurrentPerson = sap.ui.getCore().byId(oController.PAGEID + "_ConcurrentPerson");
		
		if(vIcon == "sap-icon://full-screen") {
			oBasicInfoLayout.css("display", "none"); 
			oMasterTabMenuLayout.css("display", "none"); 
			oMasterTabMenuLayout.removeClass("L2PDisplayBlock");
			
			$("#" + oController.PAGEID + "_SubTabMenuLayout").css("display", "none");
			
			oToogleBtn.setVisible(false);
			oConcurrentPerson.setVisible(false);
			
			oSplitContainer.setShowSecondaryContent(false);
			
			
			$("#" + oController.PAGEID + "_DHtmlxTable").css("height", window.innerHeight - 230);
			
			oControl.setIcon("sap-icon://exit-full-screen");
		} else {
			oBasicInfoLayout.css("display", "block"); 
			oMasterTabMenuLayout.css("display", "block");
			oMasterTabMenuLayout.addClass("L2PDisplayBlock");
			$("#" + oController.PAGEID + "_SubTabMenuLayout").css("display", "block"); 
			
			var vItems = oConcurrentPerson.getItems();
			if(vItems && vItems.length > 1) oConcurrentPerson.setVisible(true);
			else oConcurrentPerson.setVisible(false);
			oPersonTitle.setText("");
			
			
			if(oController._vSCreenType != "ess") {
				oSplitContainer.setShowSecondaryContent(true);
				oToogleBtn.setVisible(true);
			}
			
			var vTableHeight = window.innerHeight - 426;
			if(oSubTabMenuLayout.getVisible()) {
				vTableHeight = window.innerHeight - 460;
			} else {
				vTableHeight = window.innerHeight - 426;
			}		
			vTableHeight = vTableHeight + 32;
			$("#" + oController.PAGEID + "_DHtmlxTable").css("height", vTableHeight);
			
			oControl.setIcon("sap-icon://full-screen");
		}
	},
	
	onExcelDownload : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		ZUI5_HR_Empprofile.common.EmployeeProfile.onPressExcelDown(oController);
	
	},
	
	onChangedAddPsg : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var vPernr = oController._vSelectedPernr;
		
		ZUI5_HR_Empprofile.common.EmployeeProfile.makeListData(oController, vPernr, 'SHACS', '8', '0');
		
	},
	
	onChangedReOrg : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var vPernr = oController._vSelectedPernr;
		
		ZUI5_HR_Empprofile.common.EmployeeProfile.makeListData(oController, vPernr, 'SHACS', '8', '0');
	},
	
	onKeyUp : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		if(oEvent.which == 13) {
			oController.onSearchPerson();
		}
	},
	 
	onSelectBusinessaCard : function(evt) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var vEname = "";
		var vPernr = "";
		var vWave = "1";
		var vEncid = "";
		
		var oCustomData = this.getCustomData();
		for(var i=0; i<oCustomData.length; i++) {
			if(oCustomData[i].getKey() == "Pernr") {
				vPernr = oCustomData[i].getValue();
			}else if(oCustomData[i].getKey() == "Wave") {
					vWave = oCustomData[i].getValue();
			}else if(oCustomData[i].getKey() == "Ename") {
				vEname = oCustomData[i].getValue();
			}else if(oCustomData[i].getKey() == "Encid") {
				vEncid = oCustomData[i].getValue();
			}
		}
		oController._vSelectedPernr = vPernr;
		oController._vSelectedEname = vEname;
		oController._vSelectedWave = vWave;
		oController._vSelectedEncid = vEncid;
		
		oController.onInitPersonInfo(oController);
		oController.makePersonInfo(oController, vEncid);
	},
	
	makePersonInfo : function(oController, Encid) {
		var Process1 = function() {
			ZUI5_HR_Empprofile.common.EmployeeProfile.makeBasicProfile(oController, Encid);
			ZUI5_HR_Empprofile.common.EmployeeProfile.makeDetailInfo(oController, Encid);

			var oSectionLayout = sap.ui.getCore().byId(oController.PAGEID + "_SectionLayout");
			oSectionLayout.setVisible(true);
			oController.BusyDialog.close();
		};

		oController.BusyDialog.open();
		setTimeout(Process1, 300);
		
	},
	 
	getConcurrentPerson : function(oController, Pernr) {
		var oConcurrentPerson = sap.ui.getCore().byId(oController.PAGEID + "_ConcurrentPerson");
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		var vConcurrentPerson = [];
		var setConcurrentPerson = function() {
			if(oConcurrentPerson) {
				if(vConcurrentPerson.length > 1) {
					oConcurrentPerson.setVisible(true);
				} else {
					oConcurrentPerson.setVisible(false);
				}
				oConcurrentPerson.destroyItems();
				var oItems = [];
				for(var i=0; i<vConcurrentPerson.length; i++) {
					var oItem = new sap.ui.core.Item({
						key : vConcurrentPerson[i].Pernr, 
						text : vConcurrentPerson[i].Prtxt,
					});
					oItem.addCustomData(new sap.ui.core.CustomData({key : "Ccntr", value : vConcurrentPerson[i].Ccntr}));
					
					oConcurrentPerson.addItem(oItem);
					oItems.push(oItem);
				}
				oConcurrentPerson.setSelectedItem(oItems[oItems.length - 1]);
			}
		};
		
		oModel.read("/ConcurrentEmploymentSet/?$filter=Pernr eq '" + Pernr + "'", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							vConcurrentPerson.push(oData.results[i]);
						}
						
						setConcurrentPerson();
					}
				},
				function(oResponse) {
					vConcurrentPerson = null;
					common.Common.log(oResponse);
				}
		);
	},
	
	onChangeConcurrentPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();		
		
		var oConcurrentPerson = sap.ui.getCore().byId(oController.PAGEID + "_ConcurrentPerson");
		
		ZUI5_HR_Empprofile.common.EmployeeProfile.makeBasicProfile(oController, oConcurrentPerson.getSelectedKey());
		ZUI5_HR_Empprofile.common.EmployeeProfile.makeDetailInfo(oController, oConcurrentPerson.getSelectedKey());
	},
	
	setSelectData : function(Persa) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oStat2 = sap.ui.getCore().byId(oController.PAGEID + "_Stat2");	
		
		oStat2.destroyItems();
		
		var vActda = "";
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		vActda = dateFormat.format(curDate);
		
		var filterString = "/?$filter=Persa eq '" + Persa + "'";
		filterString += " and Actda eq datetime'" + vActda + "T00:00:00'";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		
		var vControls = ["Stat2"];
		
		filterString += " and (";
		for(var i=0; i<vControls.length; i++) {			
			filterString += "Field eq '" + vControls[i] + "'";
			if(i != (vControls.length - 1)) {
				filterString += " or ";
			}
		}
		filterString += ")";
		
		var setSelectControlData = function() {
			var oController = oView.getController();
			
			var oControls = [oStat2];
			console.log("screen type : " + oController._vSCreenType);
			
			for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
				for(var j=0; j<vControls.length; j++) {
					if(vEmpCodeList.EmpCodeListSet[i].Field == vControls[j]) {
						if(oControls[j]) {
							if(oController._vSCreenType == "mss") { //Employee Profile(MSS)로 들어왔을 때에는 퇴직과 연금퇴직 코드를 보이지 않게 처리
								console.log("mss");
								if(vEmpCodeList.EmpCodeListSet[i].Ecode != "0" && vEmpCodeList.EmpCodeListSet[i].Ecode != "2"){
									oControls[j].addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
								}
							}else{
								console.log("else mss");
									oControls[j].addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
							}
						}
					}
				}
			}
				oStat2.setSelectedKeys(["3"]);
		};
		
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
							
							setSelectControlData();
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	onPressAPdfButton : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHR_EMP_HRCARD_SRV");
		oModel.read("/HrCardSet?$filter=Encid eq '" + encodeURIComponent(oController._vSelectedEncid) + "' and Pernrcode eq 'F' and Langu eq '" + _gLangu +"'" , 
				null, 
				null, 
				false,
				function(oData, oResponse) {
					if(oData && oData.results) {
						 window.open(oData.results[0].Zurl);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},
	
	onPressSPdfButton : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHR_EMP_HRCARD_SRV");
		oModel.read("/HrCardSet?$filter=Encid eq '" + encodeURIComponent(oController._vSelectedEncid) + "' and Pernrcode eq 'S' and Langu eq '" + _gLangu +"'" , 
				null, 
				null, 
				false,
				function(oData, oResponse) {
					if(oData && oData.results) {
						window.open(oData.results[0].Zurl);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},
	
	onPressProfileButton : function(oEvent) {
		window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchPad.html#ZHR_TALENT_PROFILE-display");
	},
	
	_InfoModDialog  : null,
	onPressModifyButton : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		if(oController._vSelectedPernr == "") return ;
		if(!oController._InfoModDialog) {
			oController._InfoModDialog = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.InfoModDialog", oController);
			oView.addDependent(oController._InfoModDialog);
		}
		oController._InfoModDialog.open();
	},
	
	afterOpenInfoModDial :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var oModel =  sap.ui.getCore().getModel("ZHR_PINFO_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var Datas = { Data : {}};
		var oPath = "/PersonInfoApplSet/?$filter=Encid eq '" + encodeURIComponent(oController._vSelectedEncid) +"'";
		oModel.read (
				oPath,
				null, 
				null, 
				false, 
				function(oData, oResponse) {
					if(oData) {
						var oneData = oData.results[0];
						 Datas.Data = oneData ;
					}
				},
				function(oError) {
					common.Common.log(oError);
				}
		);
		oController._DialogJsonModel.setData(Datas);
		
	},
	
	onDisplaySearchZipcodeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		common.ZipSearch.oController = oController ;
		if(oController._vSelectedPernr == "") return ;
		if(!oController._ZipSearchDialog) {
			oController._ZipSearchDialog = sap.ui.jsfragment("fragment.ZipSearchDialog", oController);
			oView.addDependent(oController._ZipSearchDialog);
		}
		oController._ZipMode = "1" ; // 현 거주지
		oController._ZipSearchDialog.open();
	},
	
	onDisplaySearchZipcodeDialog2 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		common.ZipSearch.oController = oController ;
		if(oController._vSelectedPernr == "") return ;
		if(!oController._ZipSearchDialog) {
			oController._ZipSearchDialog = sap.ui.jsfragment("fragment.ZipSearchDialog", oController);
			oView.addDependent(oController._ZipSearchDialog);
		}
		oController._ZipMode = "2" ; // 주민등록지
		oController._ZipSearchDialog.open();
	},
	
	onSelectAddress : function(zipNo, roadAddr, siNm, engAddr){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();	
		
		oController._DialogJsonModel.setProperty("/Data/Pstlz1" , zipNo);
		oController._DialogJsonModel.setProperty("/Data/Zzaddr1Kr1" , roadAddr);
		oController._DialogJsonModel.setProperty("/Data/Zzaddr2Kr1" , "");
		oController._DialogJsonModel.setProperty("/Data/State1" , siNm);
		oController._DialogJsonModel.setProperty("/Data/Zzaddr1En1" , engAddr);
		oController._DialogJsonModel.setProperty("/Data/Zzaddr2En1" , "");
	},
	
	onSelectAddress2 : function(zipNo, roadAddr, siNm, engAddr){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();	
		
		oController._DialogJsonModel.setProperty("/Data/Pstlz2" , zipNo);
		oController._DialogJsonModel.setProperty("/Data/Zzaddr1Kr2" , roadAddr);
		oController._DialogJsonModel.setProperty("/Data/Zzaddr2Kr2" , "");
		oController._DialogJsonModel.setProperty("/Data/State2" , siNm);
		oController._DialogJsonModel.setProperty("/Data/Zzaddr1En2" , engAddr);
		oController._DialogJsonModel.setProperty("/Data/Zzaddr2En2" , "");
	},	
	
	onSaveDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var oKonfe = sap.ui.getCore().byId(oController.PAGEID + "_Konfe"); 
		var oModel =  sap.ui.getCore().getModel("ZHR_PINFO_SRV");
		
		var OneData = {};
		OneData.Pernr      = oController._vSelectedPernr ;
		OneData.Pstlz1     = oController._DialogJsonModel.getProperty("/Data/Pstlz1");
		OneData.Zzaddr1Kr1 = oController._DialogJsonModel.getProperty("/Data/Zzaddr1Kr1");
		OneData.Zzaddr2Kr1 = oController._DialogJsonModel.getProperty("/Data/Zzaddr2Kr1");
		OneData.Zzaddr1En1 = oController._DialogJsonModel.getProperty("/Data/Zzaddr1En1");
		OneData.Zzaddr2En1 = oController._DialogJsonModel.getProperty("/Data/Zzaddr2En1");
		OneData.Pstlz2     = oController._DialogJsonModel.getProperty("/Data/Pstlz2");
		OneData.Zzaddr1Kr2 = oController._DialogJsonModel.getProperty("/Data/Zzaddr1Kr2");
		OneData.Zzaddr2Kr2 = oController._DialogJsonModel.getProperty("/Data/Zzaddr2Kr2");
		OneData.Zzaddr1En2 = oController._DialogJsonModel.getProperty("/Data/Zzaddr1En2");
		OneData.Zzaddr2En2 = oController._DialogJsonModel.getProperty("/Data/Zzaddr2En2");
		OneData.State1   = oController._DialogJsonModel.getProperty("/Data/State1");
		OneData.State2   =  oController._DialogJsonModel.getProperty("/Data/State2");
		OneData.Bizpno    =  oController._DialogJsonModel.getProperty("/Data/Bizpno");
		OneData.Cellpno   =  oController._DialogJsonModel.getProperty("/Data/Cellpno");
		OneData.Homepno   = oController._DialogJsonModel.getProperty("/Data/Homepno");
		OneData.Faxno     = oController._DialogJsonModel.getProperty("/Data/Faxno");
		OneData.Empno     = oController._DialogJsonModel.getProperty("/Data/Empno");
//		OneData.Email     = oController._DialogJsonModel.getProperty("/Data/Email");

		var onProcess = function(){
				var vErrorMessage = "";
				var oPath = "/PersonInfoApplSet";
				oModel.create(
						oPath,
						OneData,
						null,
						function(data,res){
						
						},
						function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
								else vErrorMessage = Err.error.message.value;
							} else {
								vErrorMessage = oError.toString();
							}
					}
				);
				
				oController.BusyDialog.close();
				if(vErrorMessage != ""){
					sap.m.MessageBox.alert(vErrorMessage);
					return ;
				}
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_2579"), {	// 2579:저장완료 되었습니다.
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					onClose : function(){
						oController.makePersonInfo(oController, oController._vSelectedEncid);
						oController._InfoModDialog.close();
						
					}
				});
			};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0061"), {	// 61:저장하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
		
	},
	/* 가족 수정 변경 */
	_FamilyModDialog  : null,
	onPressFamilyCreate : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		if(oController._vSelectedPernr == "") return ;
		if(!oController._FamilyModDialog) {
			oController._FamilyModDialog = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.FamilyModDialog", oController);
			oView.addDependent(oController._FamilyModDialog);
		}
		oController._FamilyMode = "N" ; // 신규등록
		oController._FamilyModDialog.open();
	},
	
	onPressFamilyModify : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		if(oController._vSelectedPernr == "") return ;
		if(!oController._FamilyModDialog) {
			oController._FamilyModDialog = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.FamilyModDialog", oController);
			oView.addDependent(oController._FamilyModDialog);
		}
		
		var o0021Table = sap.ui.getCore().byId(oController.PAGEID + "_0021Table");
		var vContexts = o0021Table.getSelectedContexts(true);
		if(!vContexts || vContexts.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2481"));	// 2481:변경할 가족을 선택하여 주세요.
			return;
		}
		oController._FamilyMode = "C" ; // 변경
		oController._FamilyModDialog.open();
	},
	
	/*가족 등록  변경 Dialog open */
	afterOpenFamilyDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var vData = { Data : {} };
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oJSonModel =oTable.getModel();
		var vData = { Data : []};
		oJSonModel.setData(vData);
		
		var oFamilyEndBtn = sap.ui.getCore().byId(oController.PAGEID + "_FamilyEnd");
		var oFamilyDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_FamilyDelete");
		var oFamilyDialog = sap.ui.getCore().byId(oController.PAGEID + "_FamilyDialog"); 
		var oKdsvh = sap.ui.getCore().byId(oController.PAGEID + "_Kdsvh"); 
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		oFamilyDeleteBtn.setVisible(false);
		
		if(oController._FamilyMode == "N"){
			oFamilyEndBtn.setVisible(false);
			oFamilyDialog.setTitle(oBundleText.getText("LABEL_1447"));	// 1447:가족등록
			oKdsvh.setEditable(true);
			vData.Data.Nattx = oBundleText.getText("LABEL_1696");	// 1696:대한민국
			vData.Data.Fanat = "KR";
		}else{
			oFamilyEndBtn.setVisible(true);
			oFamilyDialog.setTitle(oBundleText.getText("LABEL_1448"));	// 1448:가족변경
			oKdsvh.setEditable(false);
			
			var o0021Table = sap.ui.getCore().byId(oController.PAGEID + "_0021Table");
			var vContexts = o0021Table.getSelectedContexts(true);
			
			var vSelectedData = o0021Table.getModel().getProperty(vContexts[0].sPath);
			var vBegda = vSelectedData.Value13.replace(".","-");
			vBegda = vBegda.replace(".","-");
			var vEndda = vSelectedData.Value14.replace(".","-");
			vEndda = vEndda.replace(".","-");
			
			var oPath = "/FamilyRegistSet/?$filter=Encid eq '" + encodeURIComponent(oController._vSelectedEncid) +"'" ;
			oPath += " and Begda eq datetime'" + vBegda + "T00:00:00'";
			oPath += " and Endda eq datetime'" + vEndda + "T00:00:00'";
			oPath += " and Famsa eq '" + vSelectedData.Value15 + "'";
			oPath += " and Objps eq '" + vSelectedData.Value16 + "'";
		
			var oModel = sap.ui.getCore().getModel("ZHR_FAMILY_SRV");
			oModel.read (
					oPath,
					null, 
					null, 
					false, 
					function(oData, oResponse) {
						if(oData) {
							vData.Data = oData.results[0];
							vData.Data.Adcid = vData.Data.Adcid == "X" ? true : false;
							vData.Data.Balid = vData.Data.Balid == "X" ? true : false;
							vData.Data.Pptid = vData.Data.Pptid == "X" ? true : false;
							vData.Data.Dptid = vData.Data.Dptid == "X" ? true : false;
							vData.Data.Hndid = vData.Data.Hndid == "X" ? true : false;
							vData.Data.Livid = vData.Data.Livid == "X" ? true : false;
							vData.Data.Fgbdt = dateFormat.format(new Date(common.Common.setTime(new Date(vData.Data.Fgbdt))));
							if(vData.Data.Adpdt && vData.Data.Adpdt != ""){
								vData.Data.Adpdt = dateFormat.format(new Date(common.Common.setTime(new Date(vData.Data.Adpdt))));
							}	
							
							if(vData.Data.Begda && vData.Data.Begda != ""){
								vData.Data.Begda = dateFormat.format(new Date(common.Common.setTime(new Date(vData.Data.Begda))));
							}	
						}
					},
					function(oError) {
						common.Common.log(oError);
					}
			)
		}
		
		oController._FamilyDialogJsonModel.setData(vData);
		
		
		var curDate = new Date();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		var vBegda = dateFormat.format(new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()));
		
		if(vBegda == vData.Data.Begda){
			oFamilyDeleteBtn.setVisible(true);
		}
		
		ZUI5_HR_Empprofile.common.AttachFileAction.oController = oController;
		ZUI5_HR_Empprofile.common.AttachFileAction.refreshAttachFileList(oController);
	
	},
	
	onChangeRegno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var vRegno = oController._FamilyDialogJsonModel.getProperty("/Data/Regno"),
		    vFgbdt = oController._FamilyDialogJsonModel.getProperty("/Data/Fgbdt"),
		    vDate = "", vSeven = "" ;
		
		// 생년월일이 빈값일 경우 주민등록 번호로 Defalut 설정
		if(common.Common.checkNull(vFgbdt) && vRegno.length > 12){
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			vDate = vRegno.substring(0,6);
			
			if(vRegno.length == 13){
				vSeven = vRegno.substring(6,7);
			}else if(vRegno.length == 14){
				vSeven = vRegno.substring(7,7);
			}

			if(vSeven == "1" || vSeven == "2" ) vDate = "19" + vDate ;
			else if(vSeven == "3" || vSeven == "4") vDate = "20" + vDate ;
			else return;
			
			vFgbdt = dateFormat.format(new Date(vDate.substring(0,4), (vDate.substring(4,6) * 1 ) - 1 , vDate.substring(6,8)));
			oController._FamilyDialogJsonModel.setProperty("/Data/Fgbdt", vFgbdt);
		}
	},
	
	onChangeKbsvh : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var vKdsvh = oController._FamilyDialogJsonModel.getProperty("/Data/Kdsvh");
		var vDptyx = "", vStext = "" , vFamsa = "", vDptyp = "";
		for(var i =0; i < oController._KdsvhList.length ; i++){
			if(vKdsvh == oController._KdsvhList[i].Kdsvh){
				vDptyx = oController._KdsvhList[i].Dptyx;
				vStext = oController._KdsvhList[i].Stext;
				vDptyp = oController._KdsvhList[i].Dptyp;
				vFamsa = oController._KdsvhList[i].Famsa;
				break;
			}
		}
		oController._FamilyDialogJsonModel.setProperty("/Data/Dptyp",vDptyp);
		oController._FamilyDialogJsonModel.setProperty("/Data/Famsa",vFamsa);
		oController._FamilyDialogJsonModel.setProperty("/Data/Dptyx",vDptyx);
		oController._FamilyDialogJsonModel.setProperty("/Data/Stext",vStext);
	},
	
	_NatioDailog : null,
	onDisplaySearchNatioDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		if(oController._vSelectedPernr == "") return ;
		if(!oController._NatioDailog) {
			oController._NatioDailog = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.NatioDialog", oController);
			oView.addDependent(oController._NatioDailog);
		}
		oController._NatioDailog.open();
	},
	
	onSearchNatio : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Natio"));
		oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
	
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},
	
	onConfirmNatio : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
		
	    var vFanat = "" , vFanattx = "";
		
		if (aContexts.length) {
			vFanat = aContexts[0].getProperty("Ecode");
	    	vFanattx = aContexts[0].getProperty("Etext");
	    }
		
		oController._FamilyDialogJsonModel.setProperty("/Data/Fanat",vFanat);
		oController._FamilyDialogJsonModel.setProperty("/Data/Nattx",vFanattx);
		
		
		oController.onCancelNatio(oEvent);
	},
		
	onCancelNatio : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
	
	onSaveFamily : function(vType){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		var oModel =  sap.ui.getCore().getModel("ZHR_FAMILY_SRV");
		
		if(common.Common.checkNull(oController._FamilyDialogJsonModel.getProperty("/Data/Kdsvh"))){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2405"));	// 2405:가족관계는 필수 입력 입니다.
			return ;
		}else if(common.Common.checkNull(oController._FamilyDialogJsonModel.getProperty("/Data/Zzrgrsn"))){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2467"));	// 2467:등록(변경)사유는 필수 입력 입니다.
			return ;
		}else if(common.Common.checkNull(oController._FamilyDialogJsonModel.getProperty("/Data/Lnmhg"))){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2517"));	// 2517:성은 필수 입력 입니다.
			return ;
		}else if(common.Common.checkNull(oController._FamilyDialogJsonModel.getProperty("/Data/Fnmhg"))){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2563"));	// 2563:이름은 필수 입력 입니다.
			return ;
		}else if(common.Common.checkNull(oController._FamilyDialogJsonModel.getProperty("/Data/Regno"))){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2600"));	// 2600:주민등록번호은 필수 입력 입니다.
			return ;
		}else if(common.Common.checkNull(oController._FamilyDialogJsonModel.getProperty("/Data/Fgbdt"))){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2506"));	// 2506:생년월일은 필수 입력 입니다.
			return ;
		}
		
		var OneData = {};
		
		OneData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_FAMILY_SRV"), "FamilyRegist", oController._FamilyDialogJsonModel.getProperty("/Data"));
		OneData.Pernr      = oController._vSelectedPernr ;
		OneData.Adcid = OneData.Adcid == true ? "X" : "";
		OneData.Balid = OneData.Balid == true ? "X" : "";
		OneData.Pptid = OneData.Pptid == true ? "X" : "";
		OneData.Dptid = OneData.Dptid == true ? "X" : "";
		OneData.Hndid = OneData.Hndid == true ? "X" : "";
		OneData.Livid = OneData.Livid == true ? "X" : "";
		OneData.Fgbdt  = "\/Date("+ common.Common.getTime(OneData.Fgbdt)+")\/";	// 생년월일
		if(OneData.Adpdt && OneData.Adpdt != "" ){
			OneData.Adpdt = "\/Date("+ common.Common.getTime(OneData.Adpdt)+")\/" ; // 입얍/위탁일자
		}else{
			delete OneData.Adpdt;
		}
		
		if(OneData.Begda && OneData.Begda != ""){
			OneData.Begda = "\/Date("+ common.Common.getTime(OneData.Begda)+")\/" ; // 시작일자
		}else if(oController._FamilyMode != "N"){
//			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2506"));	// 2506:생년월일은 필수 입력 입니다.
			return ;
		}
		
		OneData.Trtyp      = oController._FamilyMode ;
		if(vType == "E" || vType == "D"){
			OneData.Trtyp = vType;
		}
		
		if(OneData.Trtyp == "N"){ // 신규등록일 경우
			var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			if(oFileList.getItems().length < 1){ // 첨부파일 필수
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_1174")); // 1174:첨부파일은 필수 입니다.
				return "";
			}
		}	
		if(OneData.Regno.indexOf("*") > -1){
			OneData.Regno = "" ;
		}

		var onProcess = function(){
			var vErrorMessage = "";
			var oPath = "/FamilyRegistSet";
			oModel.create(
					oPath,
					OneData,
					null,
					function(data,res){
						if(data){
							
							oController._FamilyDialogJsonModel.setProperty("/Data/Objps",data.Objps);
						}
						// 첨부파일 업로드
						ZUI5_HR_Empprofile.common.AttachFileAction.uploadFile(oController);
					},
					function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
							else vErrorMessage = Err.error.message.value;
						} else {
							vErrorMessage = oError.toString();
						}
				}
			);
			
			oController.BusyDialog.close();
			if(vErrorMessage != ""){
				sap.m.MessageBox.alert(vErrorMessage);
				return ;
			}
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2579"), {	// 2579:저장완료 되었습니다.
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : function(){
					oController.makePersonInfo(oController, oController._vSelectedEncid);
					oController._FamilyModDialog.close();
					
				}
			});
		};
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	onCloseFamily : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		oController.onSaveFamily("E");
	},
	
	onDeleteFamily : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		oController.onSaveFamily("D");
	},
	
	
	_MilitaryModDialog  : null,
	 afterOpenMilitaryDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var oMilitaryDialog = sap.ui.getCore().byId(oController.PAGEID + "_MilitaryDialog");
		var oMilitaryDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_MilitaryDeleteBtn");
		var vData = { Data : {} };
		
		if(oController._MilitaryMode == "N"){
			oMilitaryDeleteBtn.setVisible(false);
			oMilitaryDialog.setTitle(oBundleText.getText("LABEL_1755"));	// 1755:병역등록
		}else{
			oMilitaryDeleteBtn.setVisible(true);
			oMilitaryDialog.setTitle(oBundleText.getText("LABEL_1756"));	// 1756:병역변경
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			
			var o0555Table = sap.ui.getCore().byId(oController.PAGEID + "_0555Table");
			var vContexts = o0555Table.getSelectedContexts(true);
			
			if(vContexts && vContexts.length > 0){
				var vSelectedData = o0555Table.getModel().getProperty(vContexts[0].sPath);
				var vBegda = vSelectedData.Value07.replace(".","-");
				vBegda = vBegda.replace(".","-");
				var vEndda = vSelectedData.Value08.replace(".","-");
				vEndda = vEndda.replace(".","-");
				var oPath = "/MilDataListSet/?$filter=Encid eq '" + encodeURIComponent(oController._vSelectedEncid) +"'" ;
				oPath += " and Begda eq datetime'" + vBegda + "T00:00:00'";
				oPath += " and Endda eq datetime'" + vEndda + "T00:00:00'";
				
				var oModel = sap.ui.getCore().getModel("ZHR_PINFO_SRV");
				oModel.read (
						oPath,
						null, 
						null, 
						false, 
						function(oData, oResponse) {
							if(oData) {
								vData.Data = oData.results[0];
								if(vData.Data.Begda && vData.Data.Begda != ""){
									vData.Data.Begda = dateFormat.format(new Date(common.Common.setTime(new Date(vData.Data.Begda))));
								}
								if(vData.Data.Endda && vData.Data.Endda != ""){
									vData.Data.Endda = dateFormat.format(new Date(common.Common.setTime(new Date(vData.Data.Endda))));
								}
							}
						},
						function(oError) {
							common.Common.log(oError);
						}
				)
				
			}
		}
		oController._MilitaryDialogJsonModel.setData(vData);
	},
	
	onPressMilitaryCreate : function(oEvnet){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		if(oController._vSelectedPernr == "") return ;
		if(!oController._MilitaryModDialog) {
			oController._MilitaryModDialog = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.MilitaryModDialog", oController);
			oView.addDependent(oController._MilitaryModDialog);
		}
		oController._MilitaryMode = "N" ; // 신규등록
		oController._MilitaryModDialog.open();
	},
	
	onPressMilitaryModify : function(oEvnet){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		if(oController._vSelectedPernr == "") return ;
		if(!oController._MilitaryModDialog) {
			oController._MilitaryModDialog = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.MilitaryModDialog", oController);
			oView.addDependent(oController._MilitaryModDialog);
		}
		
		var o0555Table = sap.ui.getCore().byId(oController.PAGEID + "_0555Table");
		var vContexts = o0555Table.getSelectedContexts(true);
		if(!vContexts || vContexts.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2482"));	// 2482:변경할 병역을 선택하여 주세요.
			return;
		}
		oController._MilitaryMode = "C" ; // 변경
		oController._MilitaryModDialog.open();
	},
	
	onChangeZzrespn : function(oEvent){
		
		
	},
	
	onDeleteMilitary : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		oController.onSaveMilitary("E");
		
	},
	 
	onSaveMilitary : function(vType){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		var oController = oView.getController();
		
		var oModel =  sap.ui.getCore().getModel("ZHR_PINFO_SRV");
		
		if(oController._MilitaryDialogJsonModel.getProperty("/Data/Zzrespn") == ""){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2490"));	// 2490:병역여부는 필수 입력 입니다.
			return ;
		}
		
		var OneData = {};
		
		Object.assign(OneData, oController._MilitaryDialogJsonModel.getProperty("/Data"));
		
		if(OneData.Begda && OneData.Begda != "" ){
			OneData.Begda = "\/Date("+ common.Common.getTime(OneData.Begda)+")\/" ; // 입대일자
		}else{
			if(oController._MilitaryMode != "E" ){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2925"));	// LABEL_2925=입대일자를 입력하여 주십시오.
				return ;
			}	
		}
		if(OneData.Endda && OneData.Endda != "" ){
			OneData.Endda = "\/Date("+ common.Common.getTime(OneData.Endda)+")\/" ; // 제대일자
		}else{
			if(oController._MilitaryMode != "E" ){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2926"));	// LABEL_2926=제대일자를 입력하여 주십시오.
				return ;
			}	
		}
		
		OneData.Trtyp = oController._MilitaryMode ;
		if(vType == "E"){
			OneData.Trtyp = "E";
		}
		

		var onProcess = function(){
			var vErrorMessage = "";
			var oPath = "/MilDataListSet";
			oModel.create(
					oPath,
					OneData,
					null,
					function(data,res){
					
					},
					function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
							else vErrorMessage = Err.error.message.value;
						} else {
							vErrorMessage = oError.toString();
						}
				}
			);
			
			oController.BusyDialog.close();
			if(vErrorMessage != ""){
				sap.m.MessageBox.alert(vErrorMessage);
				return ;
			}
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2579"), {	// 2579:저장완료 되었습니다.
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : function(){
					oController.makePersonInfo(oController, oController._vSelectedEncid);
					oController._MilitaryModDialog.close();
					
				}
			});
		};
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
		
		
		
	},
	
	
});


function fn_SetAddr(Zip ,Addr1,Addr2,EnAddr) {
	var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
	var oController = oView.getController();	
	
	oController._DialogJsonModel.setProperty("/Data/Pstlz1" , Zip);
	oController._DialogJsonModel.setProperty("/Data/Zzaddr1Kr1" , Addr1);
	oController._DialogJsonModel.setProperty("/Data/Zzaddr2Kr1" , "");
	oController._DialogJsonModel.setProperty("/Data/State1" , Addr2);
	oController._DialogJsonModel.setProperty("/Data/Zzaddr1En1" , EnAddr);
	oController._DialogJsonModel.setProperty("/Data/Zzaddr2En1" , "");
	
};

function fn_SetAddr2(Zip ,Addr1,Addr2,EnAddr) {
	var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
	var oController = oView.getController();	

	oController._DialogJsonModel.setProperty("/Data/Pstlz2" , Zip);
	oController._DialogJsonModel.setProperty("/Data/Zzaddr1Kr2" , Addr1);
	oController._DialogJsonModel.setProperty("/Data/Zzaddr2Kr2" , "");
	oController._DialogJsonModel.setProperty("/Data/State2" , Addr2);
	oController._DialogJsonModel.setProperty("/Data/Zzaddr1En2" , EnAddr);
	oController._DialogJsonModel.setProperty("/Data/Zzaddr2En2" , "");
};