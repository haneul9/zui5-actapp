sap.ui.controller("zui5_hrxx_actdoc.HRDocList", {
	
	PAGEID : "HRDocList",
	
	BusyDialog: null,
	
	_SortDialog : null,

	
	/**
	 * 페이지를 초기화 한다.
	 * 페이지를 Open 한 후에 수행할 Method를 정의한다.
	 * 인사영역, 문서종류 리스트를 해당 Control에 할당한다.
	 * 
	 * @memberOf zui5_hrxx_actdoc.HRDocList
	 */
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		};
	
	    this.getView().addEventDelegate({
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
		});
	     
	    var mPersAreaListSet = sap.ui.getCore().getModel("PersAreaListSet");
		var vPersAreaListSet = mPersAreaListSet.getProperty("/PersAreaListSet");
		var oFilterInfo = sap.ui.getCore().byId(this.PAGEID + "_FilterInfo");
		
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");		
		try {
			for(var i=0; i<vPersAreaListSet.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersAreaListSet[i].Persa, 
						text : vPersAreaListSet[i].Pbtxt
					})
				);
				
				oPersa.addSelectedKeys([vPersAreaListSet[0].Persa]);
				oFilterInfo.setText(vPersAreaListSet[0].Pbtxt);
			};
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var oHrdoc = sap.ui.getCore().byId(this.PAGEID + "_Hrdoc");
		var mHrDocumentTYpeSet = sap.ui.getCore().getModel("HrDocumentTYpeSet");
		var vHrDocumentTYpeSet = mHrDocumentTYpeSet.getProperty("/HrDocumentTYpeSet");
		try {
			for(var i=0; i<vHrDocumentTYpeSet.length; i++) {
				oHrdoc.addItem(
					new sap.ui.core.Item({
						key : vHrDocumentTYpeSet[i].Hrdoc, 
						text : vHrDocumentTYpeSet[i].Hrdoctx
					})
				);
			};
		} catch(ex) {
			common.Common.log(ex);
		}
	},
	
	/**
	 * 페이지 Open 이후에 수행된다.
	 * 검색 Method를 호출한다.
	 * @param evt
	 */
	onAfterShow: function(evt) {
		this.onPressSearch();
	},
	
	/**
	 * 인사영역, 문서종류를 선택하면 검색조건을 표시한다.
	 * @param oEvent
	 */
	onChnageComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocList");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		
		var vPersas  = oPersa.getSelectedItems();
		var vHrdocs  = oHrdoc.getSelectedItems();
		
		var oFilterInfo = sap.ui.getCore().byId(oController.PAGEID + "_FilterInfo");
		var vFilterInfo = "";
		
		if(oFilterInfo) {			
			if(vPersas && vPersas.length) {
				for(var i=0; i<vPersas.length; i++) {
					vFilterInfo += vPersas[i].getText() + ", ";
				}
			}
			if(vHrdocs && vHrdocs.length) {
				for(var i=0; i<vHrdocs.length; i++) {
					vFilterInfo += vHrdocs[i].getText() + ", ";
				}
			}
			oFilterInfo.setText(vFilterInfo);
		}
	},
	
	/**
	 * 메일발송한 인사서류 건에 대한 검색을 수행한다.
	 * 검색조건은 인사영역, 문서종류, 발송일 이다.
	 * @param oEvent
	 */
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocList");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oDoctl = sap.ui.getCore().byId(oController.PAGEID + "_Doctl");
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		var oReqdq_From = sap.ui.getCore().byId(oController.PAGEID + "_Reqdq_From");
		var oReqdq_To = sap.ui.getCore().byId(oController.PAGEID + "_Reqdq_To");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterHrDoc1 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_HRDOC1");
		var oFilterHrDoc2 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_HRDOC2");
		var oFilterHrDoc3 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_HRDOC3");
		var oFilterHrDoc4 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_HRDOC4");
		
		if(oReqdq_From.getValue() == "" || oReqdq_To.getValue() == "") {
			return;
		}
	
	    var filterString = "";
	    
	    filterString += "/?$filter=(Actty%20eq%20%27H%27)";  
		filterString += "%20and%20(Reqdq%20ge%20datetime%27" + oReqdq_From.getValue() + "T00%3a00%3a00%27%20and%20Reqdq%20le%20datetime%27" + oReqdq_To.getValue() + "T00%3a00%3a00%27)";
		
		if(oDoctl.getValue() != "") {
			filterString += "%20and%20(Doctl%20eq%20%27" + encodeURI(oDoctl.getValue()) + "%27)";
		}


		var vPersaString = "";
		var vPersaData = oPersa.getSelectedKeys();
		if(vPersaData && vPersaData.length) {
			for(var i=0; i<vPersaData.length; i++) {
				if(vPersaString != "") {
					vPersaString += "%20or%20";
				}
				vPersaString += "Persa%20eq%20%27" + vPersaData[i] + "%27";
			}
		}
		if(vPersaString != "") {
			filterString += "%20and%20(" + vPersaString +  ")";
		}
		
		var vHrdocString = "";
		var vHrdocData = oHrdoc.getSelectedKeys();
		if(vHrdocData && vHrdocData.length) {
			for(var i=0; i<vHrdocData.length; i++) {
				if(vHrdocString != "") {
					vHrdocString += "%20or%20";
				}
				vHrdocString += "Hrdoc%20eq%20%27" + vHrdocData[i] + "%27";
			}
		}
		if(vHrdocString != "") {
			filterString += "%20and%20(" + vHrdocString +  ")";
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
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mHrDocumentsSet = sap.ui.getCore().getModel("HrDocumentsSet");
		var vHrDocumentsSet = {HrDocumentsSet : []};
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterHrDoc1.setCount(vReqCnt1);
			oFilterHrDoc2.setCount(vReqCnt2);
			oFilterHrDoc3.setCount(vReqCnt3);
			oFilterHrDoc4.setCount(vReqCnt4);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mHrDocumentsSet);
			oTable.bindItems("/HrDocumentsSet", oColumnList);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if (sKey === "1") {
		      oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "10"));
		    } else if (sKey === "2") {
		    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "20"));
		    } else if (sKey === "3") {
		    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "25"));
		    } else if (sKey === "4") {
		    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "30"));
		    }
		    oBinding.filter(oFilters);
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		oModel.read("/HrDocumentsSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								var oneData = oData.results[i];
								oneData.Numbr = (i+1);
								vHrDocumentsSet.HrDocumentsSet.push(oneData);
								
								if(oData.results[i].Docst == "10") vReqCnt1++;
								else if(oData.results[i].Docst == "20") vReqCnt2++;
								else if(oData.results[i].Docst == "25") vReqCnt3++;
								else if(oData.results[i].Docst == "30") vReqCnt4++;
							}
							vReqCntAll = oData.results.length;
							mHrDocumentsSet.setData(vHrDocumentsSet);
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
	
	/**
	 * 상태에 따른 IconTabbar의 탭을 선택시에 수행한다.
	 * 조건을 상태값으로 재 설정한다.
	 * @param oEvent
	 */
	handleIconTabBarSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocList");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
	    if (sKey === "1") {
	      oFilters.push(new sap.ui.model.Filter("Docst", "EQ", "10"));
	    } else if (sKey === "2") {
	    	oFilters.push(new sap.ui.model.Filter("Docst", "EQ", "20"));
	    } else if (sKey === "3") {
	    	oFilters.push(new sap.ui.model.Filter("Docst", "EQ", "25"));
	    } else if (sKey === "4") {
	    	oFilters.push(new sap.ui.model.Filter("Docst", "EQ", "30"));
	    }
	    oBinding.filter(oFilters);
	},
	
	/**
	 * 리스트 정렬을 위한 Dialog를 Open 한다.
	 * @param oEvent
	 */
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocList");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actdoc.fragment.HRDocListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	/**
	 * 리스트의 정렬을 수행한다.
	 * @param oEvent
	 */
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocList");
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
	
	/**
	 * 신규 인사서류 메일발송을 생성하는 페이지로 이동한다.(HRDocDetail)
	 * @param oEvent
	 */
	onPressRequest : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actdoc.HRDocDetail",
		      data : {
		    	  Docst : "00",
		      }
		});
	},
	
	/**
	 * 특정 문서를 클릭하면 선택된 문서의 상세정보 페이지로 이동한다. (HRDocDetail)
	 * @param oEvent
	 */
	onSelectRow : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();

		var mHrDocumentsSet = sap.ui.getCore().getModel("HrDocumentsSet");
		
		var vDocst = mHrDocumentsSet.getProperty(oContext + "/Docst");
		if(vDocst == "10") {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "zui5_hrxx_actdoc.HRDocDetail",
			      data : {
			    	  Context : oContext,
			    	  Docst : mHrDocumentsSet.getProperty(oContext + "/Docst"),
			    	  Persa : mHrDocumentsSet.getProperty(oContext + "/Persa"),
			    	  Hrdno : mHrDocumentsSet.getProperty(oContext + "/Hrdno"),
			      }
			});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "zui5_hrxx_actdoc.HrDocView",
			      data : {
			    	  Context : oContext,
			    	  Docst : mHrDocumentsSet.getProperty(oContext + "/Docst"),
			    	  Persa : mHrDocumentsSet.getProperty(oContext + "/Persa"),
			    	  Hrdno : mHrDocumentsSet.getProperty(oContext + "/Hrdno"),
			    	  Hrdoc : mHrDocumentsSet.getProperty(oContext + "/Hrdoc"),
			      }
			});
		}
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocList");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
});