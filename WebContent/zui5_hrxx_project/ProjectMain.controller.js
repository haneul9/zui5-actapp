jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_project.ProjectMain", {
	PAGEID : "ProjectMain",
	
	BusyDialog : null,
	
	_SortDialog : null,
	_DataTransferDialog : null,
	
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
		} catch(ex) {
			common.Common.log(ex);
		}
		
	    this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
		});
	    
	    this.setDDLBPjtty(this);
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
		console.log(evt);
		this.onPressSearch();
	},
	
	/* IconTabFilter의 Icon을 선택할 시 발생되는 Event 
	 * Filter를 걸어준다
	 */
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		var oResBtn = sap.ui.getCore().byId(oController.PAGEID + "_RES_BTN");
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
		
		if(sKey != "All") 
			oFilters.push(new sap.ui.model.Filter("Pjtst", "EQ", sKey));
		
		if(sKey == "D") oResBtn.setVisible(true);
		else oResBtn.setVisible(false);
	    
		oBinding.filter(oFilters);
	},
	
	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var oPjtbd_Fr = sap.ui.getCore().byId(oController.PAGEID + "_Pjtbd_From");
		var oPjtbd_To = sap.ui.getCore().byId(oController.PAGEID + "_Pjtbd_To");
		var oPjtnmst = sap.ui.getCore().byId(oController.PAGEID + "_Pjtnmst");
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_Pjtty");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterN = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_N");
		var oFilterR = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_R");
		var oFilterC = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_C");
		var oFilterD = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_D");
	
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mProjectList = sap.ui.getCore().getModel("ProjectList");
		var vProjectList = {ProjectRegisterSet : []};
		
		var vCntAll = 0, vCntN = 0, vCntR = 0, vCntC = 0, vCntD = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vCntAll);
			oFilterN.setCount(vCntN);
			oFilterR.setCount(vCntR);
			oFilterC.setCount(vCntC);
			oFilterD.setCount(vCntD);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mProjectList);
			oTable.bindItems("/ProjectRegisterSet", oColumnList);

			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if(sKey != "All") oFilters.push(new sap.ui.model.Filter("Pjtst", "EQ", sKey));
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
		oModel.read("/ProjectRegisterSet/?$filter=" +
					"Pjtbd%20eq%20datetime%27" + oPjtbd_Fr.getValue() + "T00%3a00%3a00%27%20and%20Pjted%20eq%20datetime%27" + oPjtbd_To.getValue() + "T00%3a00%3a00%27" +
					" and Pjtnmst eq '" + encodeURI(oPjtnmst.getValue()) + "'" +
					" and Actty eq 'H'" +
					" and Pjtty eq '" + oPjtty.getSelectedKey() + "'" + filterString,
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vProjectList.ProjectRegisterSet.push(oData.results[i]);
								
								switch(oData.results[i].Pjtst) {
									case "N" :
										vCntN++;
										break;
									case "R" :
										vCntR++;
										break;
									case "C" :
										vCntC++;
										break;
									case "D" :
										vCntD++;
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
	

	
//	onChangePersa : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
//		var oController = oView.getController();
//		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
//		
//		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
//		var oRecYy = sap.ui.getCore().byId(oController.PAGEID + "_RecYy");
//		
//		if(oPersa.getSelectedKey() != "" && oPersa.getSelectedKey() != "0000") {
//			oRecYy.removeAllItems();
//			oModel.read(
//					"/RecruitingYearSet?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27",
//					null, 
//					null, 
//					false,
//					function(oData, oResponse) {	
//						if(oData && oData.results) {
//							for(var i=0; i<oData.results.length; i++) {
//								oRecYy.addItem(new sap.ui.core.Item({key : oData.results[i].RecYy, text : oData.results[i].RecYy}));
//							}
//							if(oData.results.length != 0) oRecYy.setSelectedKey(oData.results[0].RecYy);
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
//		}
//	},
	
	onAddProject : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
//		var oController = oView.getController();		
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_project.ProjectCreate",
		      data : {
		    	  mode : "C",
		    	  context : null
		      }
		});
	},	
	
	onModProject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
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
		
		if(oContext[0].getProperty("Pjtst") == "D") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET3"));
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_project.ProjectCreate",
		      data : {
		    	  mode : "M",
		    	  context : oContext[0]
		      }
		});
	},	
	
	onDelProject : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContext = oTable.getSelectedContexts();
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET"));
			return;
		};
		
		for(var i = 0; i < oContext.length; i++) {
			if(oContext[i].getProperty("Pjtst") == "D") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET5"));
				return;
			}
		}
		
		var process_result = false;
		var oPath = "";
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				
				for(var i = 0; i < oContext.length; i++) {
					oPath = "/ProjectRegisterSet(Werks='" + oContext[i].getProperty("Werks") + "',"
            				+ "Pjtid='" +  oContext[i].getProperty("Pjtid") + "')",
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
	
	onResProject : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContext = oTable.getSelectedContexts();
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_RESTORE_TARGET"));
			return;
		};
		
		for(var i = 0; i < oContext.length; i++) {
			if(oContext[i].getProperty("Pjtst") != "D") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RESTORE_TARGET2"));
				return;
			}
		}
		
		var process_result = false;
		var onProcessRestore = function(fVal) {
			if(fVal && fVal == "OK") {
				
				for(var i = 0; i < oContext.length; i++) {
					var oPath = "/ProjectRegisterSet(Werks='" + oContext[i].getProperty("Werks") + "',"
            				+ "Pjtid='" +  oContext[i].getProperty("Pjtid") + "')";
    				var oneData = {
    					Werks : oContext[i].getProperty("Werks"),
    					Pjtid : oContext[i].getProperty("Pjtid"),
    					Pjtst : "9"
					};
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
					sap.m.MessageBox.alert(oBundleText.getText("MSG_RESTORE"), {
						title: oBundleText.getText("MSG_TITLE_GUIDE"),
						onClose : function() {
							oController.onPressSearch(oEvent);
						}
					});
				}
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_RESTORE_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : onProcessRestore
		});
	
	},
	
	onSelectRow : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_project.ProjectView",
		      data : {
		    	  mode : "V",
		    	  context : oContext
		      }
		});
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
//		var oController = oView.getController();	
		
	    var mProjectList = sap.ui.getCore().getModel("ProjectList");
		var oDatas = mProjectList.getProperty("/ProjectRegisterSet");
		
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
	    
	    var vNewDatas = {ProjectRegisterSet : []};
	    
	    for(var i=0; i<oDatas.length; i++) {
	    	oDatas[i].Numbr = (i+1) + "";
	    	vNewDatas.ProjectRegisterSet.push(oDatas[i]);
	    }
	    
	    mProjectList.setData(vNewDatas);
	},
	
	downloadExcel : sap.m.Table.prototype.exportData || function(oEvent) {
		jQuery.sap.require("sap.ui.core.util.Export");
		jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
		
		var mProjectList = sap.ui.getCore().getModel("ProjectList");
		
		var oExport = new sap.ui.core.util.Export({
			exportType : new sap.ui.core.util.ExportTypeCSV(), //new sap.ui.core.util.ExportType({fileExtension : "xls", mimeType : "application/xls"}),//
			models : mProjectList,
			rows : { path : "/ProjectRegisterSet" }
		});
		
//		인사영역		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PBTXT"),
			template : {content : {path : "Pbtxt"}}
		}));
		
//		프로젝트명		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTNM"),
			template : {content : {path : "Pjtnm"}}
		}));
		
//		프로젝트ID		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTID"),
			template : {content : {path : "Pjtid"}}
		}));
		
//		시작일		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({
			name : oBundleText.getText("BEGDA"),
			template : {content : {path : "Pjtbd", formatter : common.Common.DateFormatter}}
		}));
		
//		종료일		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({
			name : oBundleText.getText("ENDDA"),
			template : {content : {path : "Pjted", formatter : common.Common.DateFormatter}}
		}));
		
//		국가		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("SLAND"),
			template : {content : {path : "Landx"}}
		}));
		
//		유형		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTTY"),
			template : {content : {path : "Pjttytx"}}
		}));
		
//		고객		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTCU"),
			template : {content : {path : "Pjtcutx"}}
		}));
		
//		개요		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTDS"),
			template : {content : {path : "Pjtds", formatter : function(fval){
				console.log('"' + fval+ '"');
				return '"' + fval + '"';
			}}}
		}));
		
//		규모(Size)		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTSZ"),
			template : {content : {path : "Pjtszu"}}
		}));
		
//		단위		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("UNIT"),
			template : {content : {path : "Pjtun"}}
		}));
		
//		규모(금액)		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTAM"),
			template : {content : {path : "Pjtamc"}}
		}));
		
//		통화		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("WAERS"),
			template : {content : {path : "Pjtck"}}
		}));
		
//		제품		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTPD"),
			template : {content : {path : "Pjtpdtx"}}
		}));
		
//		계약유형		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("CTTYP4"),
			template : {content : {path : "Pjtcttx"}}
		}));
		
//		등록요청대상자		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
			name : oBundleText.getText("PJTRG"),
			template : {content : {path : "Pjtrgtx"}}
		}));
		
//		요청일		
		oExport.addColumn(new sap.ui.core.util.ExportColumn({
			name : oBundleText.getText("PJTRD"),
			template : {content : {path : "Pjtrd", formatter : common.Common.DateFormatter}}
		}));
		
	    // download exported file
	    oExport.saveFile().always(function() {
	      this.destroy();
	    });
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 유형 DDLB (Pjtty)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBPjtty : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		
		var oDDLBModel = sap.ui.getCore().getModel("EmpCodeList2");
		var oDDLBData = oDDLBModel.getProperty("/PJTTY");
		
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_Pjtty");
		
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
	},
	
	_vValidData : [],
	_UploadControl : [
		                {label : oBundleText.getText("PBTXT"), id : "Pbtxt", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PBTXT") + "(Code)", id : "Werks", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("PJTID"), id : "Pjtid", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTNM"), id : "Pjtnm", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTTY"), id : "Pjttytx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTTY") + "(Code)", id : "Pjtty", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("BEGDA"), id : "Pjtbd", Type : "Date", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("ENDDA"), id : "Pjted", Type : "Date", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTPD"), id : "Pjtpdtx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTPD") + "(Code)", id : "Pjtpd", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("PJTCU"), id : "Pjtcutx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTCU") + "(Code)", id : "Pjtcu", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("SLAND"), id : "Landx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("SLAND") + "(Code)", id : "Pjtcy", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("PJTSZ"), id : "Pjtsz", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("PJTSZ"), id : "Pjtszu", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTUN"), id : "Pjtun", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTAM"), id : "Pjtam", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("PJTAM"), id : "Pjtamc", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("WAERS"), id : "Pjtck", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("CTTYP4"), id : "Pjtcttx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("CTTYP4") + "(Code)", id : "Pjtct", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("PJTMA"), id : "Pjtmatx", Type : "Text", Align : "Center", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTMA") + "(Code)", id : "Pjtma", Type : "Text", Align : "Center", Width : 0, Hidden : 1},
						{label : oBundleText.getText("PJTMC"), id : "Pjtmc", Type : "Text", Align : "Left", Width : 0, Hidden : 0},
						{label : oBundleText.getText("PJTDS"), id : "Pjtds", Type : "Text", Align : "Left", Width : 0, Hidden : 0},
						{label : oBundleText.getText("MSG"), id : "Upbigo", Type : "Text", Align : "Left", Width : 0, Hidden : 0}
	                 ],
	                 	
	_ExcelUploadDialog : null,
	uploadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();		
		
		if(!oController._ExcelUploadDialog) {
			oController._ExcelUploadDialog = sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectExcel", oController);
			oView.addDependent(oController._ExcelUploadDialog);
		}
		
		oController._ExcelUploadDialog.open();
	},
	
	onAfterOpenDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		
		var vLang = "";
		if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
		
		if(typeof UploadProjectSheet == "undefined") {
			createIBSheet2(document.getElementById(oController.PAGEID + "_IBSHEET1"), "UploadProjectSheet", "100%",  "550px", vLang);
		} else {
			$("#" + oController.PAGEID + "_IBSHEET1").css("height", "550px");
		}
		
		UploadProjectSheet.Reset();
		UploadProjectSheet.SetTheme("DS","GhrisMain");
		
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
		
		IBS_InitSheet(UploadProjectSheet, initdata);
		UploadProjectSheet.FitSize(0,1);
		UploadProjectSheet.SetExtendLastCol(1);
		UploadProjectSheet.SetSelectionMode(0);
		UploadProjectSheet.SetFocusAfterProcess(0);
	},
	
	onPressCancel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		if(oController._ExcelUploadDialog && oController._ExcelUploadDialog.isOpen()) {
			oController._ExcelUploadDialog.close();
		};
	},
	
	onPressDownload : function(oEvent) {
		var fileName = "Project.xls";
		var params = { FileName : fileName,  SheetName : "Sheet", DownCols:'1|2|3|5|6|7|9|11|13|15|16|18|19|21|23|24|25'} ;

		UploadProjectSheet.Down2Excel(params);
	},
	
	onPressUpload: function(oEvent) {
		var params = { Mode : "HeaderMatch" } ;
		if(typeof UploadProjectSheet == "object") {
			UploadProjectSheet.LoadExcel(params);
		}
	},
	
	validData : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		
		if(typeof UploadProjectSheet != "object") {
			return;
		}
		
		oController._vValidData = [];
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		
		var vRowCount = UploadProjectSheet.RowCount();
		var vHeaderCount = UploadProjectSheet.HeaderRows();
		
		UploadProjectSheet.SetCellFont("FontSize", 0, "Numbr", (vRowCount + vHeaderCount), "Upbigo", 13);
		UploadProjectSheet.SetCellFont("FontName", 0, "Numbr", (vRowCount + vHeaderCount), "Upbigo", "Malgun Gothic");
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		
		var idx = 0;
		var s_cnt = 0;
		var f_cnt = 0;
		
		var vilidProcess = function() {	
			if(idx >= vRowCount) {
				UploadProjectSheet.FitSize(0,1);
				
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
			
			var createData = UploadProjectSheet.GetRowJson(idx + vHeaderCount);

			createData.Actty = "V";
			
			if(createData.Pjtbd != null && createData.Pjtbd != "") {
				var vDate = new Date();
				vDate.setUTCFullYear(parseInt(createData.Pjtbd.substring(0,4)));
				vDate.setUTCMonth(parseInt(createData.Pjtbd.substring(4,6)) - 1);
				vDate.setUTCDate(parseInt(createData.Pjtbd.substring(6,8)));
				
				createData.Pjtbd = "\/Date(" + vDate.getTime() + ")\/";
			} else {
				createData.Pjtbd = null;
			} 
				
			if(createData.Pjted != null && createData.Pjted != "") {
				var vDate = new Date();
				vDate.setUTCFullYear(parseInt(createData.Pjted.substring(0,4)));
				vDate.setUTCMonth(parseInt(createData.Pjted.substring(4,6)) - 1);
				vDate.setUTCDate(parseInt(createData.Pjted.substring(6,8)));

				createData.Pjted = "\/Date(" + vDate.getTime() + ")\/";
			} else {
				createData.Pjted = null;
			} 
			// KYJ 2016-02-03
			// 필드 속성이 Decimal이며 값이 없을 경우에는  0 을 기입
			if(createData.Pjtsz == null || createData.Pjtsz == ""){
				createData.Pjtsz = 0;
			}
			if(createData.Pjtam == null || createData.Pjtam == ""){
				createData.Pjtam = 0;
			}
			
				
			oModel.create(
					"/ProjectRegisterSet", 
					createData, 
					null,
				    function (oData, response) {
						if(oData) {
							if(oData.Upstat == "S") {
								UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Upbigo", "Success", 0);
								UploadProjectSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "black");
								s_cnt++;
							} else {
								UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Upbigo", oData.Upbigo, 0);
								UploadProjectSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "red");
								f_cnt++;
							}
							
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Pbtxt", oData.Pbtxt, 0);
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Pjttytx", oData.Pjttytx, 0);
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Pjtpdtx", oData.Pjtpdtx, 0);
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Landx", oData.Landx, 0);
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Pjtszu", oData.Pjtszu, 0);
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Pjtamc", oData.Pjtamc, 0);
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Pjtcttx", oData.Pjtcttx, 0);
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Pjtmatx", oData.Pjtmatx, 0);
							UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Pjtcutx", oData.Pjtcutx, 0);
							
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
						UploadProjectSheet.SetCellValue(idx + vHeaderCount, "Upbigo", vMsg, 0);
						UploadProjectSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "red");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		
		if(typeof UploadProjectSheet != "object") {
			return;
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		var saveProcess = function() {	
			for(var idx = 0; idx<oController._vValidData.length; idx++) {
				var createData = oController._vValidData[idx]; 
				
				createData.Actty = "U";
				createData.Pjtbd = "\/Date(" + new Date(createData.Pjtbd).getTime() + ")\/";
				createData.Pjted = "\/Date(" + new Date(createData.Pjted).getTime() + ")\/";
								
				var fProcess_flag = false;
				oModel.create(
						"/ProjectRegisterSet", 
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

function UploadProjectSheet_OnSearchEnd(code, message) {
	UploadProjectSheet.FitSize(0,1);
}

function UploadProjectSheet_OnLoadExcel(result) {
	if(result) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectMain");
		var oController = oView.getController();
		oController.validData();
		
		//UploadProjectSheet.FitSize(0,1);
	}
}