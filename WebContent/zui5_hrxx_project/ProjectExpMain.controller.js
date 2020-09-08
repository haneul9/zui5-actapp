jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.SearchUser2");

sap.ui.controller("zui5_hrxx_project.ProjectExpMain", {
	PAGEID : "ProjectExpMain",
	
	BusyDialog : null,
	
	_SortDialog : null,
	
	_vPersa : "",
	
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
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

		var oWerks = sap.ui.getCore().byId(this.PAGEID + "_Werks");
		
		try {
			for(var i=0; i<vPersaData.length; i++) {
				oWerks.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			oWerks.setSelectedKeys(vPersaData[0].Persa);
			this._vPersa = vPersaData[0].Persa;
		} catch(ex) {
			common.Common.log(ex);
		}
		
	    this.getView().addEventDelegate({
	    	onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
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
	onAfterShow: function(evt) {
//		this.onChangePersa();
		this.onPressSearch();
	},
	
	/* IconTabFilter의 Icon을 선택할 시 발생되는 Event 
	 * Filter를 걸어준다
	 */
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
		
		if(sKey != "All") 
			oFilters.push(new sap.ui.model.Filter("Aprst", "EQ", sKey));
	    
		oBinding.filter(oFilters);
	},
	
	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Werks");	
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Endda");
		var oPjtnmst = sap.ui.getCore().byId(oController.PAGEID + "_Pjtnmst");
		var oPernrtx = sap.ui.getCore().byId(oController.PAGEID + "_Pernrtx");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilter1 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_1");
		var oFilter2 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_2");
		var oFilter4 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_4");
		var oFilter3 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_3");
	
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mProjectList = sap.ui.getCore().getModel("ProjectList");
		var vProjectList = {ProjectExpRegisterSet : []};
		
		var vCntAll = 0, vCnt1 = 0, vCnt2 = 0, vCnt4 = 0, vCnt3 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vCntAll);
			oFilter1.setCount(vCnt1);
			oFilter2.setCount(vCnt2);
			oFilter4.setCount(vCnt4);
			oFilter3.setCount(vCnt3);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mProjectList);
			oTable.bindItems("/ProjectExpRegisterSet", oColumnList);

			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if(sKey != "All") oFilters.push(new sap.ui.model.Filter("Aprst", "EQ", sKey));
		    oBinding.filter(oFilters);

		    if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};

		//추가	
		var oFilters = [];	
		var filterString = "";
		var vPersaString = "";
		var vPersaData = oWerks.getSelectedKeys();
		if(vPersaData && vPersaData.length) {
			for(var i=0; i<vPersaData.length; i++) {
				oFilters.push(new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, vPersaData[i]));
				if(vPersaString != "") {
					vPersaString += "%20or%20";
				}
				vPersaString += "Werks%20eq%20%27" + vPersaData[i] + "%27";
			}
		}
		if(vPersaString != "") {
			filterString += "%20and%20(" + vPersaString +  ")";
		}
		//추가 끝
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		var oPath = "/ProjectExpRegisterSet/?$filter=" +
					"Begda%20eq%20datetime%27" + oBegda.getValue() + "T00%3a00%3a00%27%20and%20Endda%20eq%20datetime%27" + oEndda.getValue() + "T00%3a00%3a00%27" +
					" and Pjtnmst eq '" + encodeURI(oPjtnmst.getValue()) + "'" +
					" and Actty eq 'H'" + filterString;
		if(oPernrtx.getCustomData()[0].getValue("Pernr") != "") oPath += " and Pernr eq '" + oPernrtx.getCustomData()[0].getValue("Pernr") + "'";
		
		oModel.read(oPath,
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vProjectList.ProjectExpRegisterSet.push(oData.results[i]);
								
								switch(oData.results[i].Aprst) {
									case "1" :
										vCnt1++;
										break;
									case "2" :
										vCnt2++;
										break;
									case "4" :
										vCnt4++;
										break;
									case "3" :
										vCnt3++;
								}
							}
							vCntAll = oData.results.length;
							mProjectList.setData(vProjectList);
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
	
	onChangeWerks : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
				
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		oController._vPersa = oPersa.getSelectedKey();
	},
	
//	onAddProject : function(oEvent) {
////		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
////		var oController = oView.getController();		
//		
//		sap.ui.getCore().getEventBus().publish("nav", "to", {
//		      id : "zui5_hrxx_project.ProjectCreate",
//		      data : {
//		    	  mode : "C",
//		    	  context : null
//		      }
//		});
//	},	
	
//	onModProject : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
//		var oController = oView.getController();		
//		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
//		var oContext = oTable.getSelectedContexts();
//		if(oContext.length == 0) {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_UPDATE_TARGET"));
//			return;
//		};
//		
//		if(oContext.length > 1) {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_UPDATE2"));
//			return;
//		};
//		
//		if(oContext[0].getProperty("Aprst") == "D") {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET3"));
//			return;
//		}
//		
//		sap.ui.getCore().getEventBus().publish("nav", "to", {
//		      id : "zui5_hrxx_project.ProjectCreate",
//		      data : {
//		    	  mode : "M",
//		    	  context : oContext[0]
//		      }
//		});
//	},	
	
//	onDelProject : function(oEvent) {
//		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
//		var oController = oView.getController();
//		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
//		var oContext = oTable.getSelectedContexts();
//		if(oContext.length == 0) {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET"));
//			return;
//		};
//		
////		for(var i = 0; i < oContext.length; i++) {
////			if(oContext[i].getProperty("Aprst") == "D") {
////				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET2"));
////				return;
////			}
////		}
//		
//		var process_result = false;
//		var oPath = "";
//		var onProcessDelete = function(fVal) {
//			if(fVal && fVal == "OK") {
//				
//				for(var i = 0; i < oContext.length; i++) {
//					oPath = "/ProjectExpRegisterSet(Regno='" + oContext[i].getProperty("Regno") + "')",
//					oModel.remove(
//							oPath, 
//							null,
//						    function (oData, response) {
//								process_result = true;
//						    },
//						    function (oError) {
//						    	var Err = {};					    	 
//								if (oError.response) {
//									Err = window.JSON.parse(oError.response.body);
//									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//										common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//									} else {
//										common.Common.showErrorMessage(Err.error.message.value);
//									}
//									
//								} else {
//									common.Common.showErrorMessage(oError);
//								}
//								process_result = false;
//						    }
//					);
//				}
//				if(process_result) {
//					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
//						title: oBundleText.getText("MSG_TITLE_GUIDE"),
//						onClose : function() {
//							oController.onPressSearch(oEvent);
//						}
//					});
//				}
//			}
//		};
//		
//		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
//			title : oBundleText.getText("CONFIRM_BTN"),
//			onClose : onProcessDelete
//		});
//	
//	},
	
	onSelectRow : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_project.ProjectExpView",
		      data : {
		    	  mode : "V",
		    	  context : oContext
		      }
		});
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectExpListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
//		var oController = oView.getController();	
		
	    var mProjectList = sap.ui.getCore().getModel("ProjectList");
		var oDatas = mProjectList.getProperty("/ProjectExpRegisterSet");
		
		var mParams = oEvent.getParameters();
	    var sKey = mParams.sortItem.getKey();
	    var bDescending = mParams.sortDescending;
	    
	    if(bDescending) {
	    	oDatas.sort(function(a, b) {
				var a1 = eval("a." + sKey);
				var b1 = eval("b." + sKey);
				return a1 < b1 ? 1 : a1 > b1 ? -1 : 0;  
			});
	    } else {
	    	oDatas.sort(function(a, b) {
				var a1 = eval("a." + sKey);
				var b1 = eval("b." + sKey);
				return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;  
			});
	    }
	    
	    var vNewDatas = {ProjectExpRegisterSet : []};
	    
	    for(var i=0; i<oDatas.length; i++) {
	    	oDatas[i].Numbr = (i+1) + "";
	    	vNewDatas.ProjectExpRegisterSet.push(oDatas[i]);
	    }
	    
	    mProjectList.setData(vNewDatas);
	},

/////////////////////////////////////////////////////////////////////////////////////////////
// 수행자 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
	_vEmployeeSearchID : "",
	_EmpSearchDialog : null,
	
	onEmployeeSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
//			var oControl = this; 
//			var oCustomData = oControl.getCustomData();
//			oController._vEmployeeSearchID = oCustomData[0].getValue();
		common.SearchUser1.oController = oController;
		
		var oPjtrg = sap.ui.getCore().byId(oController.PAGEID + "_Pernrtx");
		oPjtrg.setValue("");
		oPjtrg.removeAllCustomData();
		oPjtrg.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : ""}));
		
		if(!oController._EmpSearchDialog) {
			oController._EmpSearchDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._EmpSearchDialog);
		}
		oController._EmpSearchDialog.open();
	},
	
	// 조직검색 POPUP 창을 연다
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		//var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
		//var mEmpSearchResult = oTable.getModel();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var vEmpSearchCnt = 0;
		var vPernr = "";
		var vEname = "";
		for(var i=0; i<vEmpSearchResult.length; i++) {
			if(vEmpSearchResult[i].Chck == true) {
				vEmpSearchCnt++;
				vPernr =  vEmpSearchResult[i].Pernr;
				vEname =  vEmpSearchResult[i].Ename;
			}				
		}

		if(vEmpSearchCnt > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON_ONLYONE"));
			return;
		} else if(vEmpSearchCnt < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var oPjtrg = sap.ui.getCore().byId(oController.PAGEID + "_Pernrtx");
		oPjtrg.setValue(vEname);
		oPjtrg.removeAllCustomData();
		oPjtrg.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : vPernr}));
		
		common.SearchUser1.onClose();
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
	downloadExcel : sap.m.Table.prototype.exportData || function(oEvent) {
		jQuery.sap.require("sap.ui.core.util.Export");
		jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
		
		var mProjectList = sap.ui.getCore().getModel("ProjectList");
		
		var oExport = new sap.ui.core.util.Export({
			exportType : new sap.ui.core.util.ExportTypeCSV(), //new sap.ui.core.util.ExportType({fileExtension : "xls", mimeType : "application/xls"}),//
			models : mProjectList,
			rows : { path : "/ProjectExpRegisterSet" }
		});
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 사번
			name : oBundleText.getText("PERNR"),
			template : {content : {path : "Pernr"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 성명
			name : oBundleText.getText("ENAME"),
			template : {content : {path : "Pernrtx"}}
		}));
		
//		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 직위
//			name : oBundleText.getText("ZZCALTL"),
//			template : {content : {path : "Pernrctx"}}
//		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 조직
			name : oBundleText.getText("ORGEH2"),
			template : {content : {path : "Pernrotx"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 프로젝트명
			name : oBundleText.getText("PJTNM"),
			template : {content : {path : "Pjtnm"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 시작일
			name : oBundleText.getText("EXPBD"),
			template : {content : {path : "Begda", formatter: common.Common.DateFormatter}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 종료일
			name : oBundleText.getText("EXPED"),
			template : {content : {path : "Endda", formatter: common.Common.DateFormatter}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 투입형태
			name : oBundleText.getText("PJTAT"),
			template : {content : {path : "Pjtattx"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 역할
			name : oBundleText.getText("PJTRL"),
			template : {content : {path : "Pjtrltx"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 상세업무
			name : oBundleText.getText("PJTRP"),
			template : {content : {path : "Pjtrp"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 승인자
			name : oBundleText.getText("APRNR"),
			template : {content : {path : "Aprnrtx"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 등록요청일
			name : oBundleText.getText("REQDA2"),
			template : {content : {path : "Recda", formatter: common.Common.DateFormatter}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 신청일
			name : oBundleText.getText("RECDA"),
			template : {content : {path : "Reqda", formatter: common.Common.DateFormatter}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 결재일
			name : oBundleText.getText("SGNDA"),
			template : {content : {path : "Aprda", formatter: common.Common.DateFormatter}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 상태
			name : oBundleText.getText("ASTAT"),
			template : {content : {path : "Aprsttx"}}
		}));
		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({  // 반려사유
			name : oBundleText.getText("TITLE_REJECT_COMMENT"),
			template : {content : {path : "Aprrj"}}
		}));
		
		
	    // download exported file
	    oExport.saveFile().always(function() {
	      this.destroy();
	    });
	},
	
	_vValidData : [],
	_UploadControl : [
		                 {label : oBundleText.getText("FPERNR"), id : "Pernr", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("ENAME"), id : "Pernrtx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PBTXT"), id : "Pbtxt", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PJTNM"), id : "Pjtnm", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PJTID"), id : "Pjtid", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("EXPBD"), id : "Begda", Type : "Date", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("EXPED"), id : "Endda", Type : "Date", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PJTAT"), id : "Pjtattx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PJTRL")+"1", id : "Pjtr1tx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PJTRL")+"2", id : "Pjtr2tx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PJTRL")+"3", id : "Pjtr3tx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PJTRL")+"4", id : "Pjtr4tx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("MSG"), id : "Upbigo", Type : "Text", Align : "Left", Width : 0, Hidden : 0},
		                 {label : oBundleText.getText("PBTXT")+"(Code)", id : "Werks", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
		                 {label : oBundleText.getText("PJTAT")+"(Code)", id : "Pjtat", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
		                 {label : oBundleText.getText("PJTRL")+"1(Code)", id : "Pjtr1", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
		                 {label : oBundleText.getText("PJTRL")+"2(Code)", id : "Pjtr2", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
		                 {label : oBundleText.getText("PJTRL")+"3(Code)", id : "Pjtr3", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
		                 {label : oBundleText.getText("PJTRL")+"4(Code)", id : "Pjtr4", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
		                 {label : oBundleText.getText("PJTRP"), id : "Pjtrp", Type : "Text", Align : "Left", Width : 0, Hidden : 1}
	                 ],
	                 	
	_ExcelUploadDialog : null,
	uploadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();		
		
		if(!oController._ExcelUploadDialog) {
			oController._ExcelUploadDialog = sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectExpExcel", oController);
			oView.addDependent(oController._ExcelUploadDialog);
		}
		
		oController._ExcelUploadDialog.open();
	},
	
	onAfterOpenDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var vLang = "";
		if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
		
		if(typeof UploadProjectExpSheet == "undefined") {
			createIBSheet2(document.getElementById(oController.PAGEID + "_IBSHEET1"), "UploadProjectExpSheet", "100%",  "550px", vLang);
		} else {
			$("#" + oController.PAGEID + "_IBSHEET1").css("height", "550px");
		}
		
		UploadProjectExpSheet.Reset();
		UploadProjectExpSheet.SetTheme("DS","GhrisMain");
		
		var initdata = {};
		
		initdata.Cfg = {SearchMode:smLazyLoad, SizeMode:0, SmartResize:1};  //MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:1,ColMove:1,ColResize:1,HeaderCheck:1};
		
		initdata.Cols = [];
		for(var i=0; i<oController._UploadControl.length; i++) {
			var oneCol = {};
			oneCol.Header = oController._UploadControl[i].label;
			oneCol.Type = oController._UploadControl[i].Type;
			if(oController._UploadControl[i].Width != 0) oneCol.Width = oController._UploadControl[i].Width;
			oneCol.SaveName = oController._UploadControl[i].id;
			oneCol.Align = oController._UploadControl[i].Align;
			oneCol.Hidden = oController._UploadControl[i].Hidden;
			oneCol.Edit = 0;
			
			initdata.Cols.push(oneCol);
		}
		
		IBS_InitSheet(UploadProjectExpSheet, initdata);
		UploadProjectExpSheet.FitSize(0,1);
		UploadProjectExpSheet.SetExtendLastCol(1);
		UploadProjectExpSheet.SetSelectionMode(0);
		UploadProjectExpSheet.SetFocusAfterProcess(0);
	},
	
	onPressCancel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		if(oController._ExcelUploadDialog && oController._ExcelUploadDialog.isOpen()) {
			oController._ExcelUploadDialog.close();
		};
	},
	
	onPressDownload : function(oEvent) {
		var fileName = "Project.xls";
		var params = { FileName : fileName,  SheetName : "Sheet", DownCols:'0|13|4|5|6|14|15|16|17|18|19'} ;

		UploadProjectExpSheet.Down2Excel(params);
	},
	
	onPressUpload: function(oEvent) {
		var params = { Mode : "HeaderMatch" } ;
		if(typeof UploadProjectExpSheet == "object") {
			UploadProjectExpSheet.LoadExcel(params);
		}
	},
	
	validData : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		if(typeof UploadProjectExpSheet != "object") {
			return;
		}
		
		oController._vValidData = [];
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		
		var vRowCount = UploadProjectExpSheet.RowCount();
		var vHeaderCount = UploadProjectExpSheet.HeaderRows();
		
		UploadProjectExpSheet.SetCellFont("FontSize", 0, "Numbr", (vRowCount + vHeaderCount), "Upbigo", 13);
		UploadProjectExpSheet.SetCellFont("FontName", 0, "Numbr", (vRowCount + vHeaderCount), "Upbigo", "Malgun Gothic");
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		
		var idx = 0;
		var s_cnt = 0;
		var f_cnt = 0;
		
		var vilidProcess = function() {	
			if(idx >= vRowCount) {
				UploadProjectExpSheet.FitSize(0,1);
				
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				if(f_cnt == 0 && s_cnt > 0) {					
					oSaveBtn.setVisible(true);
				} else {
					oSaveBtn.setVisible(false);
				}
				return;
			}	
			
			var createData = UploadProjectExpSheet.GetRowJson(idx + vHeaderCount);
			
			createData.Actty = "V";
			
			if(createData.Begda != null && createData.Begda != "") {
				var vDate = new Date();
				vDate.setUTCFullYear(parseInt(createData.Begda.substring(0,4)));
				vDate.setUTCMonth(parseInt(createData.Begda.substring(4,6)) - 1);
				vDate.setUTCDate(parseInt(createData.Begda.substring(6,8)));
				
				createData.Begda = "\/Date(" + vDate.getTime() + ")\/";
			} else {
				createData.Begda = null;
			} 
				
			if(createData.Endda != null && createData.Endda != "") {
				var vDate = new Date();
				vDate.setUTCFullYear(parseInt(createData.Endda.substring(0,4)));
				vDate.setUTCMonth(parseInt(createData.Endda.substring(4,6)) - 1);
				vDate.setUTCDate(parseInt(createData.Endda.substring(6,8)));

				createData.Endda = "\/Date(" + vDate.getTime() + ")\/";
			} else {
				createData.Endda = null;
			} 
				
			oModel.create(
					"/ProjectExpRegisterSet", 
					createData, 
					null,
				    function (oData, response) {
						if(oData) {
							if(oData.Upstat == "S") {
								UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Upbigo", "Success", 0);
								UploadProjectExpSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "black");
								s_cnt++;
							} else {
								UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Upbigo", oData.Upbigo, 0);
								UploadProjectExpSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "red");
								f_cnt++;
							}
							
							UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Pernrtx", oData.Pernrtx, 0);
							UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Pbtxt", oData.Pbtxt, 0);
							UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Pjtnm", oData.Pjtnm, 0);
							UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Pjtattx", oData.Pjtattx, 0);
							UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Pjtr1tx", oData.Pjtr1tx, 0);
							UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Pjtr2tx", oData.Pjtr2tx, 0);
							UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Pjtr3tx", oData.Pjtr3tx, 0);
							UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Pjtr4tx", oData.Pjtr4tx, 0);
							
							oController._vValidData.push(oData);
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
						UploadProjectExpSheet.SetCellValue(idx + vHeaderCount, "Upbigo", vMsg, 0);
						UploadProjectExpSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "red");
						f_cnt++;
				    }
		    );
			
			idx++;
			
			setTimeout(vilidProcess, 300);
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
		
		setTimeout(vilidProcess, 300);
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		if(typeof UploadProjectExpSheet != "object") {
			return;
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		var saveProcess = function() {	
			for(var idx = 0; idx<oController._vValidData.length; idx++) {
				var createData = oController._vValidData[idx]; 
				
				createData.Actty = "U";
				createData.Begda = "\/Date(" + new Date(createData.Begda).getTime() + ")\/";
				createData.Endda = "\/Date(" + new Date(createData.Endda).getTime() + ")\/";
								
				var fProcess_flag = false;
				oModel.create(
						"/ProjectExpRegisterSet", 
						createData, 
						null,
					    function (oData, response) {
							if(oData) {
								fProcess_flag = true;
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
							sap.m.MessageBox.alert(vMsg);
							fProcess_flag = false;
					    }
			    );
				
				if(fProcess_flag == false) {
					if(oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
					return;
				}
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title : oBundleText.getText("INFORMATION"),
				onClose : function(oEvent) {
					oController.onPressSearch();
					oController.onPressCancel();
				}
			});
		};
		
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
		
		setTimeout(saveProcess, 300);
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 프로젝트 검색
/////////////////////////////////////////////////////////////////////////////////////////////
	_SearchProjectDialog : null, 
	onSearchProject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		if(!oController._SearchProjectDialog) {
			oController._SearchProjectDialog = sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchProjectDialog", oController);
			oView.addDependent(oController._SearchProjectDialog);
		}
		oController._SearchProjectDialog.open();
		//oController.onPressProjectSearch();
	},
	
	onCloseSearchProject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		if(oController._SearchProjectDialog.isOpen()) {
			oController._SearchProjectDialog.close();
		}
	},
	
	onPressProjectSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oPjtbd_Fr = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtbd_From");
		var oPjtbd_To = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtbd_To");
		var oPjtnmst = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtnmst");
		var oPjtid = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtid");
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtty");
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mProjectList = sap.ui.getCore().getModel("ProjectSearchList");
		var vProjectList = {ProjectSearchListSet : []};
		
		var readAfterProcess = function() {
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_PS_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_PS_COLUMNLIST");
			oTable.setModel(mProjectList);
			oTable.bindItems("/ProjectSearchListSet", oColumnList);

			var oBinding = oTable.getBinding("items");
			oBinding.filter([]);

		    if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};

		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		var filterStr = "Pjtbd%20eq%20datetime%27" + oPjtbd_Fr.getValue() + "T00%3a00%3a00%27%20and%20Pjted%20eq%20datetime%27" + oPjtbd_To.getValue() + "T00%3a00%3a00%27";
		if(oPjtnmst.getValue().trim() != "") filterStr += " and Pjtnm eq '" + encodeURI(oPjtnmst.getValue().trim()) + "'";
		if(oPjtid.getValue().trim() != "") filterStr += " and Pjtid eq '" + encodeURI(oPjtid.getValue().trim()) + "'";
		if(oPjtty.getSelectedKey() != "") filterStr += " and Pjtty eq '" + oPjtty.getSelectedKey() + "'";
		
		oModel.read("/ProjectSearchResultSet/?$filter=" + filterStr,
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vProjectList.ProjectSearchListSet.push(oData.results[i]);
							}
							mProjectList.setData(vProjectList);
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
	
	onProjectSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_PS_TABLE");
		var oContext = oTable.getSelectedContexts();
		
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PROJECT_TARGET"));
			return;
		};
		
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		oPjtnm.setValue(oContext[0].getProperty("Pjtnm"));
		oPjtnm.removeAllCustomData();
		oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Pjtid", value : oContext[0].getProperty("Pjtid")}));
		oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Werks", value : oContext[0].getProperty("Werks")}));
		
		oController.onChangeValue();
		oController.onCloseSearchProject();
	},
	
	onChangeValue : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();

		oController.setDDLBPjtat("");
		oController.setDDLBPjtrl("","","","");
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
	onPressSaveReg : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_POP_SAVE");
		var vMode = oSaveBtn.getCustomData()[0].getValue("Mode");
		var vRegno = oSaveBtn.getCustomData()[1].getValue("Regno");
		
		var oneData = {};
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda");
		var oPjtat = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtat");
		var oPjtr1 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr1");
		var oPjtr2 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr2");
		var oPjtr3 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr3");
		var oPjtr4 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr4");
		var oPjtrp = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtrp");
		var oAprnrtx = sap.ui.getCore().byId(oController.PAGEID + "_POP_Aprnrtx");
		
		oPjtnm.setValueState(sap.ui.core.ValueState.None);
		oBegda.setValueState(sap.ui.core.ValueState.None);
		oEndda.setValueState(sap.ui.core.ValueState.None);
		oPjtat.removeStyleClass("L2PSelectInvalidBorder");
		oPjtr1.removeStyleClass("L2PSelectInvalidBorder");
		oPjtrp.setValueState(sap.ui.core.ValueState.None);
		
		oneData.Actty = "H";
		
		// Project ID / 인사영역
		oneData.Pjtid = oPjtnm.getCustomData()[0].getValue("Pjtid");
		oneData.Werks = oPjtnm.getCustomData()[1].getValue("Werks");
		if(oneData.Pjtid == "" || oneData.Werks == "") {
			oPjtnm.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PROJECT_TARGET"));
			return;
		}
		
		// 수행시작일
		oneData.Begda = oBegda.getValue() == "" || oBegda.getValue() == "0NaN-NaN-NaN" ? null : "\/Date(" + new Date(oBegda.getValue()).getTime() + ")\/";
		if(oneData.Begda == null) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_EXPBD_INPUT"));
			return;
		}
		
		// 수행 종료일
		oneData.Endda = oEndda.getValue() == "" || oEndda.getValue() == "0NaN-NaN-NaN" ? null : "\/Date(" + new Date(oEndda.getValue()).getTime() + ")\/";
		if(oneData.Endda == null) {
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_EXPED_INPUT"));
			return;
		}
		
		if(new Date(oBegda.getValue()) > new Date(oEndda.getValue())) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_PJTEDATE"));
			return;
		}
		
		oneData.Pjtat = oPjtat.getSelectedKey();
		if(oneData.Pjtat == "") {
			oPjtat.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PJTAT_INPUT"));
			return;
		}
		
		oneData.Pjtr1 = oPjtr1.getSelectedKey();
		if(oneData.Pjtr1 == "") {
			oPjtr1.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PJTRL_INPUT"));
			return;
		}
		oneData.Pjtr2 = oPjtr2.getSelectedKey();
		oneData.Pjtr3 = oPjtr3.getSelectedKey();
		oneData.Pjtr4 = oPjtr4.getSelectedKey();
		
		oneData.Pjtrp = oPjtrp.getValue();
		if(oneData.Pjtrp == "") {
			oPjtrp.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PJTRP_INPUT"));
			return;
		}
		
		oneData.Aprnr = oAprnrtx.getCustomData()[0].getValue("Aprnr");
		if(oneData.Aprnr == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_APRNR"));
			return;
		}
		
		var process_result = false;
		var oPath = "/ProjectExpRegisterSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");

		if(vMode == "C") {
			oModel.create(
					oPath, 
					oneData, 
					null,
				    function (oData, response) {
						if(oData) {
							
						}
						process_result = true;
				    },
				    function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
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
		} else {
			oneData.Regno = vRegno;
			oneData.Aprty = "U";
			
			oPath += "(Regno='" + oneData.Regno + "')";
			
		    oModel.update(
				oPath, 
				oneData, 
				null,
			    function (oData, response) {
					process_result = true;
			    },
			    function (oError) {
			    	var Err = {};					    	 
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
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
		}
		if(process_result) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.onPressSearch();
					//oController.onCloseProjectReg(); 
				}
			});
		}
	},
	
//	_ProjectExpDialog : null,
//	onOpenProjectReg : function(){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
//		var oController = oView.getController();
//		
//		if(!oController._ProjectExpDialog) {
//			oController._ProjectExpDialog = sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectRegistDialog", oController);
//			oView.addDependent(oController._ProjectExpDialog);
//		}
//		oController._ProjectExpDialog.open();
//	},
	
//	onCloseProjectReg : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
//		var oController = oView.getController();
//		
//		if(oController._ProjectExpDialog.isOpen()) {
//			oController._ProjectExpDialog.close();
//		}
//	},
	
	onAddProjectExp : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
//		oController.onOpenProjectReg();
//		oController.setProjectExp(null);
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_project.ProjectExpView",
		      data : {
		    	  mode : "C",
		    	  context : null
		      }
		});
	},	
	
	onModProjectExp : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();		
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContext = oTable.getSelectedContexts();
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_UPDATE_TARGET"));
			return;
		};
		
		if(oContext.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_UPDATE2"));
			return;
		};
		
		if(oContext[0].getProperty("Aprst") == "2") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_MODIFY_TARGET"));
			return;
		}
		
//		oController.onOpenProjectReg();
//		oController.setProjectExp(oContext[0]);
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_project.ProjectExpView",
		      data : {
		    	  mode : "M",
		    	  context : oContext[0]
		      }
		});
	},	
	
	onDelProjectExp : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContext = oTable.getSelectedContexts();
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET"));
			return;
		};
		
		for(var i = 0; i < oContext.length; i++) {
			if(oContext[i].getProperty("Aprst") == "2") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET2"));
				return;
			}
		}
		
		var process_result = false;
		var oPath = "";
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				
				for(var i = 0; i < oContext.length; i++) {
					oPath = "/ProjectExpRegisterSet(Regno='" + oContext[i].getProperty("Regno") + "')",
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
						    },
						    function (oError) {
						    	var Err = {};					    	 
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
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
				}
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("MSG_TITLE_GUIDE"),
						onClose : function() {
							oController.onPressSearch(oEvent);
						}
					});
				}
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : onProcessDelete
		});
	
	},
	
	setProjectExp : function(oContext) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda");
		var oPjtat = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtat");
		var oPjtr1 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr1");
		var oPjtr2 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr2");
		var oPjtr3 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr3");
		var oPjtr4 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr4");
		var oPjtrp = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtrp");
		var oAprnrtx = sap.ui.getCore().byId(oController.PAGEID + "_POP_Aprnrtx");
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_POP_SAVE");
		var vAprnrtx = "";
		
		if(oContext == null) {
			oPjtnm.setEnabled(true);
			
			oPjtnm.setValue("");
			oPjtnm.removeAllCustomData();
			oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Pjtid", value : ""}));
			oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Werks", value : ""}));
			oBegda.setValue(null);
			oEndda.setValue(null);
			oPjtat.setSelectedKey("");
			oPjtr1.setSelectedKey("");
			oPjtr2.setSelectedKey("");
			oPjtr3.setSelectedKey("");
			oPjtr4.setSelectedKey("");
			oPjtrp.setValue("");
			
			oSaveBtn.removeAllCustomData();
			oSaveBtn.addCustomData(new sap.ui.core.CustomData({key : "Mode", value : "C"}));
			oSaveBtn.addCustomData(new sap.ui.core.CustomData({key : "Regno", value : ""}));
			
			var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
			oModel.read("/ProjectApproverSet",
						null, 
						null, 
						true,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oAprnrtx.setText(oData.results[i].Aprnrtx + " / " + oData.results[i].Aprnrotx);
									oAprnrtx.removeAllCustomData();
									oAprnrtx.addCustomData(new sap.ui.core.CustomData({key : "Aprnr", value : oData.results[i].Aprnr}));
									oController._vPersa = oData.results[i].Werks;
									break;
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
							if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
								oController.BusyDialog.close();
							};
						}
			);
			
			
			
		} else {
			oPjtnm.setEnabled(false);
			
			oPjtnm.setValue(oContext.getProperty("Pjtnm"));
			oPjtnm.removeAllCustomData();
			oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Pjtid", value : oContext.getProperty("Pjtid")}));
			oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Werks", value : oContext.getProperty("Werks")}));
			oBegda.setValue(oContext.getProperty("Begda") == null ? null : dateFormat.format(new Date(common.Common.setTime(new Date(oContext.getProperty("Begda"))))));
			oEndda.setValue(oContext.getProperty("Endda") == null ? null : dateFormat.format(new Date(common.Common.setTime(new Date(oContext.getProperty("Endda"))))));
			oPjtat.setSelectedKey(oContext.getProperty("Pjtat"));
			oPjtr1.setSelectedKey(oContext.getProperty("Pjtr1"));
			oPjtr2.setSelectedKey(oContext.getProperty("Pjtr2"));
			oPjtr3.setSelectedKey(oContext.getProperty("Pjtr3"));
			oPjtr4.setSelectedKey(oContext.getProperty("Pjtr4"));
			oPjtrp.setValue(oContext.getProperty("Pjtrp"));
			oAprnrtx.setText(oContext.getProperty("Aprnrtx"));
			oAprnrtx.removeAllCustomData();
			oAprnrtx.addCustomData(new sap.ui.core.CustomData({key : "Aprnr", value : oContext.getProperty("Aprnr")}));
			
			oSaveBtn.removeAllCustomData();
			oSaveBtn.addCustomData(new sap.ui.core.CustomData({key : "Mode", value : "M"}));
			oSaveBtn.addCustomData(new sap.ui.core.CustomData({key : "Regno", value : oContext.getProperty("Regno")}));
			
			oController.setDDLBPjtat(oContext.getProperty("Pjtat"));
			oController.setDDLBPjtrl(oContext.getProperty("Pjtr1"),
									 oContext.getProperty("Pjtr2"),
									 oContext.getProperty("Pjtr3"),
									 oContext.getProperty("Pjtr4"));
			
			oController._vPersa = oContext.getProperty("Werks");
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 투입형태 DDLB (Pjtat)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBPjtat : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oPjtat = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtat");
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var vWerks = oPjtnm.getCustomData()[1].getValue("Werks");
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var vBegda = oBegda.getValue() == "" || oBegda.getValue() == null ? "" : oBegda.getValue();
		
		oPjtat.removeAllItems();

		if(vWerks != "" && vBegda != "") {
			oPjtat.addItem(
				new sap.ui.core.Item({
					key : "", 
					text : oBundleText.getText("SELECTDATA")
				})
			);
				
			var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
			var oPath = "/EmpCodeListSet/?$filter=Field eq 'Pjtat' and Persa eq '" + vWerks + "' and Actda eq datetime'" + vBegda + "T00:00:00'";
			
			oCommonModel.read(
						oPath,
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oPjtat.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode, 
											text : oData.results[i].Etext
										})
									);
								}
								if(vSelectedKey != "") oPjtat.setSelectedKey(vSelectedKey);
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
			);
		}
	},	
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 역할 DDLB (Pjtr1, Pjtr2, Pjtr3, Pjtr4)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBPjtrl : function(vSelectedKey1, vSelectedKey2, vSelectedKey3, vSelectedKey4) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oPjtr1 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr1");
		var oPjtr2 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr2");
		var oPjtr3 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr3");
		var oPjtr4 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr4");
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var vWerks = oPjtnm.getCustomData()[1].getValue("Werks");
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var vBegda = oBegda.getValue() == "" || oBegda.getValue() == null ? "" : oBegda.getValue();
		
		if(vWerks != "" && vBegda != "") {
			var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
			var oPath = "/EmpCodeListSet/?$filter=Field eq 'Pjtrl' and Persa eq '" + vWerks + "' and Actda eq datetime'" + vBegda + "T00:00:00'";
			var oDDLBData = [];
			oCommonModel.read(
						oPath,
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oDDLBData.push(oData.results[i]);
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
			);
			
			if(oDDLBData.length > 0) {
				var oControl = null;
				var vSKey = "";
				for(var i=1; i<5; i++) {
					eval("oControl = oPjtr" + i);
					eval("vSKey = vSelectedKey" + i);
					
					oControl.removeAllItems();
					oControl.addItem(
						new sap.ui.core.Item({
							key : "", 
							text : oBundleText.getText("SELECTDATA")
						})
					);
					
					for(var j=0; j<oDDLBData.length; j++) {
						oControl.addItem(
							new sap.ui.core.Item({
								key : oDDLBData[j].Ecode, 
								text : oDDLBData[j].Etext
							})
						);
					}
					
					if(vSKey != "") oControl.setSelectedKey(vSKey);
				}
			}
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 유형 DDLB (Pjtty)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBPjtty : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		
		var oDDLBModel = sap.ui.getCore().getModel("EmpCodeList2");
		var oDDLBData = oDDLBModel.getProperty("/PJTTY");
		
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtty");
		
		oPjtty.removeAllItems();
		oPjtty.addItem(
			new sap.ui.core.Item({
				key : "", 
				text : ""
			})
		);

		for(var i=0; i<oDDLBData.length; i++) {
			oPjtty.addItem(
				new sap.ui.core.Item({
					key : oDDLBData[i].Ecode, 
					text : oDDLBData[i].Etext
				})
			);
		}
		if(vSelectedKey != "") oPjtty.setSelectedKey(vSelectedKey);
		
//		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtty");
//		
//		oPjtty.removeAllItems();
//		oPjtty.addItem(
//			new sap.ui.core.Item({
//				key : "", 
//				text : ""
//			})
//		);
//
//		var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
//		var oPath = "/EmpCodeListSet/?$filter=Field eq 'Pjtty' and PersaNc eq 'X'";
//			
//		oCommonModel.read(
//					oPath,
//					null, 
//					null, 
//					false,
//					function(oData, oResponse) {
//						if(oData && oData.results) {
//							for(var i=0; i<oData.results.length; i++) {
//								oPjtty.addItem(
//									new sap.ui.core.Item({
//										key : oData.results[i].Ecode, 
//										text : oData.results[i].Etext
//									})
//								);
//							}
//							if(vSelectedKey != "") oPjtty.setSelectedKey(vSelectedKey);
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
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
	}
});

function UploadProjectExpSheet_OnSearchEnd(code, message) {
	UploadProjectExpSheet.FitSize(0,1);
}

function UploadProjectExpSheet_OnLoadExcel(result) {
	if(result) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpMain");
		var oController = oView.getController();
		oController.validData();
		
		//UploadProjectExpSheet.FitSize(0,1);
	}
}