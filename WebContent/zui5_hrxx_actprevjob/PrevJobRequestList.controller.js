jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actprevjob.PrevJobRequestList", {
	PAGEID : "PrevJobRequestList",
	oBundleText : jQuery.sap.resources({
		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	BusyDialog : null,
	_CcommDilaog : null,
	_vPersa : "",
	_vPernr : "",
	_SortDialog : null,
	_vActty : "H" ,  //HASS 에서 호출

	
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
		var oIconTabbar = sap.ui.getCore().byId(this.PAGEID + "_ICONBAR");
		
		var skey = jQuery.sap.getUriParameters().get("skey");
		
		if(skey && skey != "") {
			oIconTabbar.setSelectedKey(skey);
		}
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
//				this.onBeforeShow(evt);
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
	    if (sKey === "approval") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
	    } else if (sKey === "reject") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "40"));
	    } else if (sKey === "complete") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "50"));	      
	    }
	    oBinding.filter(oFilters);
	},
	
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
			var oController = oView.getController();
			oController.onPressSearch();
		}

	},
	
	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();
		var oAppld_From = sap.ui.getCore().byId(oController.PAGEID + "_Appld_From");
		var oAppld_To = sap.ui.getCore().byId(oController.PAGEID + "_Appld_To");
		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_Rpern");
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");  
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterApproval = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPROVAL");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
	
	    var filterString = "";
	    
	    filterString += "/?$filter=Actty%20eq%20%27" + oController._vActty + "%27";  
		//filterString += "%20and%20";
		//filterString += "Persa%20eq%20%27" + oPersaSelect.getSelectedKey() + "%27";
	    filterString += "%20and%20";
	    filterString += "(Appld%20ge%20datetime%27" + oAppld_From.getValue() + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" 
	    			  + oAppld_To.getValue() + "T00%3a00%3a00%27)";
	    filterString += "%20and%20Rpern%20eq%20%27" + encodeURI(oRpern.getValue()) +  "%27";
	    
	  //추가	
	    var oFilters = [];
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
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT") }));
			oController.getView().addDependent(oController.BusyDialog);
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mPrevJobChangeList = sap.ui.getCore().getModel("PrevJobChangeList");
		var vPrevJobChangeList = {PrevJobChangeListSet : []};
		
		var vReqCntAll = 0, vReqCnt2 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterApproval.setCount(vReqCnt2);
			oFilterReject.setCount(vReqCnt4);
			oFilterCompalte.setCount(vReqCnt5);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mPrevJobChangeList);
			oTable.bindItems("/PrevJobChangeListSet", oColumnList);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if (sKey === "approval") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
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
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_JOBCHANGE_SRV");
		oModel.read("/PrevJobChangeListSet" + filterString ,
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								if(oData.results[i].Astat == "20") vReqCnt2++;
								else if(oData.results[i].Astat == "40") vReqCnt4++;
								else if(oData.results[i].Astat == "50") vReqCnt5++;
								vPrevJobChangeList.PrevJobChangeListSet.push(oData.results[i]);
							}
							vReqCntAll = oData.results.length;
						}
						mPrevJobChangeList.setData(vPrevJobChangeList);
						readAfterProcess();
					},
					function(oResponse) {
						common.Common.log(oResponse);
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
					}
		);
	},
	
	onPressExcute : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var mPrevJobChangeList = sap.ui.getCore().getModel("PrevJobChangeList");
		var vContexts = oTable.getSelectedContexts(true);
		var oControl = this;
		var oCustomData = oControl.getCustomData();
		var vAstat = oCustomData[0].getValue();
		
		for(var i = 0; i < vContexts.length ; i++ ){
			console.log(mPrevJobChangeList.getProperty(vContexts[i]+"/Astat") );
			 if(mPrevJobChangeList.getProperty(vContexts[i]+"/Astat") != "20"){
				 if(vAstat == "40"){
					 sap.m.MessageBox.alert(oBundleText.getText( "MSG_FAMILY_REJECT_INVALID_DOCUMENT"));
				 }else{
					 sap.m.MessageBox.alert(oBundleText.getText( "MSG_FAMILY_COMPLETE_INVALID_DOCUMENT"));
				 }
				 return ;
			 }	
		 }
		
		if(vAstat == "40"){
			// 반려
			if(vContexts.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText( "MSG_REJECT_TARGET"));
				return ;
			}
			
			if(!oController._CcommDilaog) {
				oController._CcommDilaog = sap.ui.jsfragment("zui5_hrxx_actprevjob.fragment.Comment", oController);
				oView.addDependent(oController._CcommDilaog);
			}
			oController._CcommDilaog.open();
			var oCcomment = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm"); 
			oCcomment.setValue("");
		}else if(vAstat == "50"){
			// 승인
			if(vContexts.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText( "MSG_COMPETE_TARGET"));
				return ;
			}
			oController.onPressSave(vAstat, "C", "");
		}
		
	},
	
	onPressConfirm : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();		
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm");
		var vComment = oComment.getValue();
		if(vComment == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_REJECT_COMMENT"));
			return;
		}
		oController.onPressSave("40", "R",  vComment );
		oController.onCOClose();
		
	},
	
	onCOClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();		
		
		if(oController._CcommDilaog.isOpen()) {
			oController._CcommDilaog.close();
		}
	},
	
	onPressSave : function(vAstat , vActty1, vCcomm) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var oModel = sap.ui.getCore().getModel("ZHRXX_JOBCHANGE_SRV");
		var process_result = false;
		var mPrevJobChangeList = sap.ui.getCore().getModel("PrevJobChangeList");
		
		var oDataProcess = function(){
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
			var oData = {};
			for(var i = 0; i < vContexts.length ; i++ ){
				oData.Appno = mPrevJobChangeList.getProperty(vContexts+"/Appno");
				oData.Rpers = mPrevJobChangeList.getProperty(vContexts+"/Rpers");
				oData.Persa = mPrevJobChangeList.getProperty(vContexts+"/Persa");
				oData.Ccomm = vCcomm;
				oData.Astat = vAstat;
				oData.Actty = oController._vActty ; 
				oData.Actty1 = vActty1 ;
				var oPath = "(Appno='" + oData.Appno + "')";
				oModel.update(
						"/PrevJobChangeListSet"+oPath, 
						oData ,
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
							
							sap.m.MessageBox.alert(ErrMsg);
							process_result = false;
							return;
						}
					);	
			
			}
			
			
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			if(!process_result) {
				return;
			}
			
			sap.m.MessageBox.alert(vRmsg, {
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						 oController.onPressSearch();
					}
			});
		};
		
		var vQmsg = "";
		var vRmsg = "";
		if (vAstat == "40") {
			vQmsg = oBundleText.getText("MSG_REJECT_QUESTION");
			vRmsg = oBundleText.getText("MSG_REJECT");
		}else if(vAstat == "50"){
			vQmsg = oBundleText.getText("MSG_CONFIRM_QUESTION");
			vRmsg = oBundleText.getText("MSG_SAVE_REQ"); 
		}
		
		sap.m.MessageBox.show(vQmsg, {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("INFORMATION"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: function(oAction) { 
	        	if ( oAction === sap.m.MessageBox.Action.YES ) {
	        		oDataProcess();
	        	}
	        }
		});
	},
	onSelectRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();	
		var oContext = oEvent.getSource().getBindingContext();
		var mPrevJobChangeList = sap.ui.getCore().getModel("PrevJobChangeList");
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_prevjobchange2.PrevJobChangeRequest",
		      data : {
		    	  context : mPrevJobChangeList.getProperty(oContext.sPath),
		    	  Astat : mPrevJobChangeList.getProperty(oContext + "/Astat"),
		    	  Persa : mPrevJobChangeList.getProperty(oContext + "/Persa"),
		    	  Pernr : mPrevJobChangeList.getProperty(oContext + "/Rpers"),
		    	  Rpern : mPrevJobChangeList.getProperty(oContext + "/Rpern"),
		    	  Appno : mPrevJobChangeList.getProperty(oContext + "/Appno"),
		    	  Rorgt : mPrevJobChangeList.getProperty(oContext + "/Rorgt"),
		    	  Actty : oController._vActty,
		    	  FromPageId : "zui5_hrxx_actprevjob.PrevJobRequestList"
		    	  
		      }
		});
	
	},
	
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actprevjob.fragment.ActPrevJobSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actprevjob.PrevJobRequestList");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
});