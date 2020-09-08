jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

/**
 * 발령품의서 리스트를 표시하는 프로그램
 * 검색조건으로는 인사영역, 품의서번호, 발령유형, 발령일자 이다.
 * 발령품의서를 클릭하면 품의서 유형 및 품의서 상태에 따라 수정/조회 할 수 있다.
 * 신규 발령품의서를 작성하는 경우에는 "New" 버튼을 클릭하고 품의유형을 선택하면 신규 품의서를 작성할 수 있다. 
 * 
 * @memberOf zui5_hrxx_actapp2.ActAppMain
 * @constructor Jeong Myung Koo
 * @date	2016. 05. 17
 */

sap.ui.controller("zui5_hrxx_actapp2.ActAppMain", {
	PAGEID : "ActAppMain",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	_ActPersonPopover : null,
	_ActTimelinePopover : null,
	_EmpProfilePopover : null,
	_SortDialog : null,
	_MassnDialog : null,
	
	_vSelectedReqnoActPerson : "",
	_vSelectedDocnoActPerson : "",
	_vSelectedReqnoActTimeline : "",
	_vSelectedDocnoActTimeline : "",
	_vSelectedPernr : "",
	 
/**
* @memberOf zui5_hrxx_actapp2.ActAppMain
*/
	onInit: function() {
//			if (!jQuery.support.touch) { // apply compact mode if touch is not supported
		         this.getView().addStyleClass("sapUiSizeCompact");
//			};
		
	        var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
	 		var oControl = sap.ui.getCore().byId(this.PAGEID + "_Pbtxt");
	 		var oIconTabbar = sap.ui.getCore().byId(this.PAGEID + "_ICONBAR");
	 		
	 		var skey = jQuery.sap.getUriParameters().get("skey");
	 		var vPersa = jQuery.sap.getUriParameters().get("Persa");
	 		var vPersa_Txt = "";
	 		
	 		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
			var oSelectedPersaModel = sap.ui.getCore().getModel("SelectedPersaJSONModel");
			var vSelectedPersaData = oSelectedPersaModel.getProperty("/SelectedPersAreaListSet");
			var vPersaList = [];
			var vPersaList_Txt = "";
			
	 		try {
	 			var PersaJSONModel =  new sap.ui.model.json.JSONModel();
	 			var vPersaDatas = {PersAreaListSet : []};
	 			sap.ui.getCore().setModel(PersaJSONModel, "PersaModel");
	 			
	 			var modifyPersaData = function() {
	 				if(skey && skey != "") {
 						oIconTabbar.setSelectedKey(skey);
 					}
//	 				else {
// 						oPersa.addSelectedKeys([vPersaDatas.PersAreaListSet[0].Persa]);
// 						oControl.setText(vPersaDatas.PersAreaListSet[0].Compatx);				
// 					}
// 					
// 					if(vPersa != "" && vPersa != vPersaDatas.PersAreaListSet[0].Persa) {
// 						oPersa.addSelectedKeys([vPersa]);
// 						oControl.setText(oControl.getText() + "," + vPersa_Txt);
// 					}
	 				if(vSelectedPersaData.length > 0){
//	 					for(var i=0; i<vSelectedPersaData.length; i++){
//	 						vPersaList[i] = vSelectedPersaData[i].Werks;
//	 						if(vPersaList_Txt == "") vPersaList_Txt = vSelectedPersaData[i].Werkstx;
//	 						else vPersaList_Txt = vPersaList_Txt + ", " + vSelectedPersaData[i].Werkstx;
//	 					}
//	 					oPersa.setSelectedKeys(vPersaList);
//	 					oControl.setText(vPersaList_Txt);
	 					var vCnt = 0;
	 					for(var i=0; i<vSelectedPersaData.length;i++){
	 						for(var j=0; j< vPersaDatas.PersAreaListSet.length ; j++){
	 							if(vSelectedPersaData[i].Werks == vPersaDatas.PersAreaListSet[j].Persa){
	 								vPersaList[vCnt] = vSelectedPersaData[i].Werks;
	 								if(vCnt == 0)  vPersaList_Txt = vPersaDatas.PersAreaListSet[j].Compatx;
	 								else  vPersaList_Txt = vPersaList_Txt + ", " + vPersaDatas.PersAreaListSet[j].Compatx;
	 								
	 								vCnt++;
	 								continue;
	 							}
	 						}
	 					}
	 					
	 					if(vCnt == 0){
		 					oPersa.setSelectedKeys([vPersaDatas.PersAreaListSet[0].Persa]);
		 					oControl.setText(vPersaDatas.PersAreaListSet[0].Compatx);
	 					}else{
	 						oPersa.setSelectedKeys(vPersaList);
		 					oControl.setText(vPersaList_Txt);
	 					}
	 				}else{
	 					oPersa.setSelectedKeys([vPersaDatas.PersAreaListSet[0].Persa]);
	 					oControl.setText(vPersaDatas.PersAreaListSet[0].Compatx);
	 				}
	 			};
	 			
	 			var setPersaData = function() {
	 				oPersa.destroyItems();
	 				
//	 				if(vPersaDatas.PersAreaListSet.length < 1) {
//	 					document.location.href = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/NoSAuth.html";
//	 		    		return;
//	 				}
	 				
	 				for(var i=0; i<vPersaDatas.PersAreaListSet.length; i++) {
	 					oPersa.addItem(
	 						new sap.ui.core.Item({
	 							key : vPersaDatas.PersAreaListSet[i].Persa, 
	 							text : vPersaDatas.PersAreaListSet[i].Compatx
	 						})	 						
	 					);
	 					if(vPersa == vPersaDatas.PersAreaListSet[i].Persa) {
	 						vPersa_Txt = vPersaDatas.PersAreaListSet[i].Compatx;
	 					}
	 				};
	 				
	 				setTimeout(modifyPersaData, 50);
	 			};
	 				
	 			oModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27 and Wave eq '2'", 
	 					null, 
	 					null, 
	 					false,
	 					function(oData, oResponse) {					
	 						if(oData && oData.results.length) {
	 							for(var i=0; i<oData.results.length; i++) {
	 								vPersaDatas.PersAreaListSet.push(oData.results[i]);
	 							}
	 							PersaJSONModel.setData(vPersaDatas);
	 							setPersaData();
	 						}
	 					},
	 					function(oResponse) {
	 						common.Common.log(oResponse);
//	 						document.location.href = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/NoSAuth.html";
		 		    		return;
	 					}
	 			);	
	 		} catch(ex) {
	 			common.Common.log(ex);
	 		}
		
	    this.getView().addEventDelegate({
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
		});
	},	
	
	/*
	 * 페이지가 표시되기전에 수행한다.
	 * 바인딩 전에 안내메세지 출력 후 바인딩이 완료되면 메세지 창을 닫는다.
	 */
	onAfterShow: function(evt) {
		setTimeout(this.onPressSearch, 300);
		//this.onPressSearch();
	},
	
	/* IconTabFilter의 Icon을 선택할 시 발생되는 Event 
	 * Filter를 걸어준다
	 */
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
		
	    if (sKey === "creation") {
	      oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "10"));
	    } else if (sKey === "approval") {
	    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "20"));
	    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "25"));
	    } else if (sKey === "confirmation") {
	    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "30"));
	    } else if (sKey === "reject") {
	    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "40"));
	    } else if (sKey === "complete") {
	    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "50"));	      
	    }
	    oBinding.filter(oFilters);
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn");
		var oActda_From = sap.ui.getCore().byId(oController.PAGEID + "_Actda_From");
		var oActda_To = sap.ui.getCore().byId(oController.PAGEID + "_Actda_To");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterCreate = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CRETAE");
		var oFilterApproval = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPROVAL");
		var oFilterConfirm = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CONFIRM");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
		
		if(oActda_From.getValue() == "" || oActda_To.getValue() == "") {
			return;
		}
	
	    var oFilters = [];	
	    var filterString = "";
	    
	    filterString += "/?$filter=";  
	    filterString += "Wave eq '2' and "
		filterString += "(Actda%20ge%20datetime%27" + oActda_From.getValue() + "T00%3a00%3a00%27%20and%20Actda%20le%20datetime%27" + oActda_To.getValue() + "T00%3a00%3a00%27)";
		
		oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.BT, oActda_From.getValue(), oActda_To.getValue()));
		
		if(oReqno.getValue() != "") {
			oFilters.push(new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oReqno.getValue()));
			filterString += "%20and%20(Reqno%20eq%20%27" + encodeURIComponent(oReqno.getValue()) + "%27)";
		}
		
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
		
		var vMassnString = "";
		var vMassnData = oMassn.getSelectedKeys();
		if(vMassnData && vMassnData.length) {
			for(var i=0; i<vMassnData.length; i++) {
				oFilters.push(new sap.ui.model.Filter("Massn", sap.ui.model.FilterOperator.EQ, vMassnData[i]));
				if(vMassnString != "") {
					vMassnString += "%20or%20";
				}
				vMassnString += "Massn%20eq%20%27" + vMassnData[i] + "%27";
			}
		}
		if(vMassnString != "") {
			filterString += "%20and%20(" + vMassnString +  ")";
		}
		
		oController.BusyDialog.open();
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		var vActionReqList = {ActionReqListSet : []};
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			if(oFilterCreate) oFilterCreate.setCount(vReqCnt1);
			if(oFilterApproval) oFilterApproval.setCount(vReqCnt2);
			if(oFilterConfirm) oFilterConfirm.setCount(vReqCnt3);
			if(oFilterReject) oFilterReject.setCount(vReqCnt4);
			if(oFilterCompalte) oFilterCompalte.setCount(vReqCnt5);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mActionReqList);
			oTable.bindItems("/ActionReqListSet", oColumnList);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if (sKey === "creation") {
		      oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "10"));
		    } else if (sKey === "approval") {
		    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "20"));
		    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "25"));
		    } else if (sKey === "confirmation") {
		    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "30"));
		    } else if (sKey === "reject") {
		    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "40"));
		    } else if (sKey === "complete") {
		    	oFilters.push(new sap.ui.model.Filter("Statu", "EQ", "50"));	      
		    }
		    oBinding.filter(oFilters);
		    
		    oController.BusyDialog.close();
		};
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		oModel.read("/ActionReqListSet" + filterString, 
					null, 
					null,  
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {								
								var oneData = oData.results[i];
								
//								var vActda = new Date(oData.results[i].Actda);
//								oneData.Actda = new Date(common.Common.setTime(vActda));
////								
////								oneData.Actda = dateFormat.format(new Date(oData.results[i].Actda));
//								var vReqda = new Date(oData.results[i].Reqda);
//								oneData.Reqda = new Date(common.Common.setTime(vReqda));
////								oneData.Reqda = dateFormat.format(new Date(oData.results[i].Reqda));
								
//								var vActda = new Date(oData.results[i].Actda);
//								oneData.Actda = new Date(common.Common.setTime(vActda));
//								
//								var vReqda = new Date(oData.results[i].Reqda);
//								oneData.Reqda = new Date(common.Common.setTime(vReqda));
								
//								oneData.Actda = common.Common.setFormatTime(oData.results[i].Actda);
//								var a1 = new Date();
//								
//								console.log(a1.getTime());
								vActionReqList.ActionReqListSet.push(oneData);
								
								if(oData.results[i].Statu == "10") vReqCnt1++;
								else if(oData.results[i].Statu == "20" || oData.results[i].Statu == "25") vReqCnt2++;
								else if(oData.results[i].Statu == "30") vReqCnt3++;
								else if(oData.results[i].Statu == "40") vReqCnt4++;
								else if(oData.results[i].Statu == "50") vReqCnt5++;
							}
							vReqCntAll = oData.results.length;
							mActionReqList.setData(vActionReqList);
							
							readAfterProcess();							
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
						oController.BusyDialog.close();
					}
		);
	},
	
	onChnageComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn");
		
		var vPersas  = oPersa.getSelectedItems();
		var vMassns  = oMassn.getSelectedItems();
		
		var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Pbtxt");
		var vFilterInfo = "";
		
		if(oControl) {			
			if(vPersas && vPersas.length) {
				for(var i=0; i<vPersas.length; i++) {
					vFilterInfo += vPersas[i].getText() + ", ";
				}
			}
			if(vMassns && vMassns.length) {
				for(var i=0; i<vMassns.length; i++) {
					vFilterInfo += vMassns[i].getText() + ", ";
				}
			}
			oControl.setText(vFilterInfo);
		}
		
	},
	
	createAction : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();		
		
		if(!oController._MassnDialog) {
			oController._MassnDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.SelectDoctype", oController);
			oView.addDependent(oController._MassnDialog);
		}
		
		oController._MassnDialog.open();
	},	
	
	onSMClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		if(oController._MassnDialog && oController._MassnDialog.isOpen()) {
			oController._MassnDialog.close();
		}
	},	
	
	onSMSelectType : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		var toPageId = "";
		var vDocty = "";
		
		for(var i=1; i<=6; i++) {
			var oControl = sap.ui.getCore().byId(oController.PAGEID + "_SM_RadioButton" + i);
			if(oControl) {
				if(oControl.getSelected()) {
					var vCustomData = oControl.getCustomData();
					if(vCustomData && vCustomData.length) {
						for(var j=0; j<vCustomData.length; j++) {
							if(vCustomData[j].getKey() == "PageId") {
								toPageId = vCustomData[j].getValue();
							} else if(vCustomData[j].getKey() == "Docty") {
								vDocty = vCustomData[j].getValue();
							}
						}
					}
					break;
				}
			}
		}
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var vPersaString = "";
		var vPersaData = oPersa.getSelectedKeys();
		if(vPersaData && vPersaData.length) {
			vPersaString = vPersaData[0];
		}
		
		if(toPageId != "") {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : toPageId, 
			      data : {
			    	 Statu : "00",
			    	 Reqno : "",
			    	 Docno : "",
			    	 Docty : vDocty,
			    	 SelectedPersa : vPersaString
			      }
			});
		} else {
			sap.m.MessageBox.alert("Invalid Action Document Type");
		}
		
		oController.onSMClose();
	},
	
	onSelectRow : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();

		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		
		var vStatu = mActionReqList.getProperty(oContext + "/Statu");
		if(vStatu == "10") {
			var mDocTypeList = sap.ui.getCore().getModel("DocTypeList");
	        var vDocTypeList = mDocTypeList.getProperty("/DocTypeListSet");
	        var vToPage = "";
	        for(var i=0; i<vDocTypeList.length; i++) {
	        	if(vDocTypeList[i].Docty == mActionReqList.getProperty(oContext + "/Docty")) {
	        		vToPage = vDocTypeList[i].PageId;
	        		break;
	        	}
	        }
	        if(vToPage != "") {
	        	sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : vToPage,
				      data : {
				    	  context : oContext,
				    	  Statu : vStatu,
				    	  Reqno : mActionReqList.getProperty(oContext + "/Reqno"),
				    	  Docno : mActionReqList.getProperty(oContext + "/Docno"),
				    	  Docty : mActionReqList.getProperty(oContext + "/Docty"),
				    	  Entrs : mActionReqList.getProperty(oContext + "/Entrs"),
				      }
				});
	        } else {
	        	sap.m.MessageBox.alert("Invalid Action Document Type");
	        }
			
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "zui5_hrxx_actapp2.ActAppDocumentView",
			      data : {
			    	  context : oContext,
			    	  Statu : vStatu,
			    	  Reqno : mActionReqList.getProperty(oContext + "/Reqno"),
			    	  Docno : mActionReqList.getProperty(oContext + "/Docno"),
			    	  Docty : mActionReqList.getProperty(oContext + "/Docty"),
			      }
			});
		}
	},
	
	displayPopoverEmpProfile : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		var oControl = this;
		
		var oCustomData = oControl.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Pernr") {
					oController._vSelectedPernr = oCustomData[i].getValue();
					break;
				}
			}
		}
		
		if(!oController._EmpProfilePopover) {
			oController._EmpProfilePopover = sap.ui.jsfragment("fragment.EmpProfilePopover", oController);
			oView.addDependent(oController._EmpProfilePopover);
		}
		
		oController._EmpProfilePopover.openBy(oControl);
	}, 
	
	onBeforeOpenPopoverEmpProfile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_EP_ENAME");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_EP_FULLN");
		var oPhoto = sap.ui.getCore().byId(oController.PAGEID + "_EP_PHOTO");
		var oCelno = sap.ui.getCore().byId(oController.PAGEID + "_EP_CELNO");
		var oTelno = sap.ui.getCore().byId(oController.PAGEID + "_EP_TELNO");
		var oEmail = sap.ui.getCore().byId(oController.PAGEID + "_EP_EMAIL");
		var oPbtxt = sap.ui.getCore().byId(oController.PAGEID + "_EP_PBTXT");
		var oZzempwptx = sap.ui.getCore().byId(oController.PAGEID + "_EP_ZZEMPWPTX");
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		try {
			oModel.read(
					"/EmpQuickProfileSet('" + oController._vSelectedPernr + "')",
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData) {
							oEname.setText(oData.Ename);
							oFulln.setText(oData.Fulln);
							oCelno.setText(oData.Celno);
							oCelno.setHref("tel:" + oData.Celno);
							oTelno.setText(oData.Telno);
							oEmail.setText(oData.Email);
							oEmail.setHref("mailto://" + oData.Email);
							oPbtxt.setText(oData.Pbtxt);
							oZzempwptx.setText(oData.Zzempwptx);
							oPhoto.setSrc(oData.Photo);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
	},
	
	displayPopoverActPerson : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		var oControl = this;
		
		var oCustomData = oControl.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Reqno") {
					oController._vSelectedReqnoActPerson = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Docno") {
					oController._vSelectedDocnoActPerson = oCustomData[i].getValue();
				} 
			}
		}
		
		if(!oController._ActPersonPopover) {
			oController._ActPersonPopover = sap.ui.jsfragment("fragment.ActPersonPopover", oController);
			oView.addDependent(oController._ActPersonPopover);
		}
		
		oController._ActPersonPopover.openBy(oControl);
	}, 
	
	onBeforeOpenPopoverActPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_AP_List");
		var oListItem = sap.ui.getCore().byId(oController.PAGEID + "_AP_ListItem");
		
		var filterString = ""; 
		filterString += "?$filter=Docno%20eq%20%27" + oController._vSelectedDocnoActPerson + "%27";
		
		oList.bindItems("/ActionEmpSummaryListSet/" + filterString, oListItem);
	},
	
	displayPopoverActTimeline : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		var oControl = this;
		
		var oCustomData = oControl.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Reqno") {
					oController._vSelectedReqnoActTimeline = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Docno") {
					oController._vSelectedDocnoActTimeline = oCustomData[i].getValue();
				} 
			}
		}
		
		if(!oController._ActTimelinePopover) {
			oController._ActTimelinePopover = sap.ui.jsfragment("fragment.ActTimelinePopover", oController);
			oView.addDependent(oController._ActTimelinePopover);
		}
		
		oController._ActTimelinePopover.openBy(oControl);
	}, 
	
	onBeforeOpenPopoverActTimeline : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		
		var oTimeline = sap.ui.getCore().byId(oController.PAGEID + "_AT_Timeline");
		var oTimeItem = sap.ui.getCore().byId(oController.PAGEID + "_AT_TimeItem");
		
		var filterString = ""; 
		filterString += "?$filter=Docno%20eq%20%27" + oController._vSelectedDocnoActTimeline + "%27";
		
		oTimeline.bindAggregation("content", {
			path : "/ActionReqChangeHistorySet/" + filterString,
			template : oTimeItem
		});
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionReqListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		var oDatas = mActionReqList.getProperty("/ActionReqListSet");
		
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
	    
	    var vNewDatas = {ActionReqListSet : []};
	    
	    for(var i=0; i<oDatas.length; i++) {
	    	oDatas[i].Numbr = (i+1) + "";
	    	vNewDatas.ActionReqListSet.push(oDatas[i]);
	    }
	    
	    mActionReqList.setData(vNewDatas);
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert("잘못된 일자형식 입니다.",{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	/*
	 * Excel download
	 */
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppMain");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
});