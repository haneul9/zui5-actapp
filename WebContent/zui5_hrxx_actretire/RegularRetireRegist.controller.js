sap.ui.controller("zui5_hrxx_actretire.RegularRetireRegist", {
	
	PAGEID : "RegularRetireRegist",
	
	_vFromPageId : "",
	
	BusyDialog : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actretire.RegularRetireRegist
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		};
	
	    this.getView().addEventDelegate({
			onBeforeShow  : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
		});
	    
	    var oPersaModel = sap.ui.getCore().getModel("PersAreaListSet");
		var vPersAreaListSet = oPersaModel.getProperty("/PersAreaListSet");
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		
		try {
			for(var i=0; i<vPersAreaListSet.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersAreaListSet[i].Persa, 
						text : vPersAreaListSet[i].Pbtxt
					})
				);
			};
		} catch(ex) {
			common.Common.log(ex);
		}
	},
	
	onBeforeShow: function(oEvent) {
		
		this._vFromPageId = oEvent.data.FromPageId;
		

	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actretire.RegularRetireRegist
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actretire.RegularRetireRegist
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actretire.RegularRetireRegist
*/
//	onExit: function() {
//
//	}
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RegularRetireRegist");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		
		var oRetda_From = sap.ui.getCore().byId(oController.PAGEID + "_Retda_From");
		var oRetda_To = sap.ui.getCore().byId(oController.PAGEID + "_Retda_To");
		
	    var filterString = "";
	    
	    filterString += "/?$filter=";
	    filterString += "(Retda%20ge%20datetime%27" + oRetda_From.getValue() + "T00%3a00%3a00%27%20and%20Retda%20le%20datetime%27" + oRetda_To.getValue() + "T00%3a00%3a00%27)";
	    if(oPersa.getSelectedKey() != "" && oPersa.getSelectedKey() != "0000") {
	    	filterString += "%20and%20(Persa%20ge%20%27" + oPersa.getSelectedKey() + "%27)";
	    }	    
				
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		}  else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mRetirementList = sap.ui.getCore().getModel("RetirementList");
		var vRetirementList = {RetirementListSet : []};
		
		var readAfterProcess = function() {
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mRetirementList);
			oTable.bindItems("/RetirementListSet", oColumnList);
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		oModel.read("/RetirementListSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								var oneData = oData.results[i];
								oneData.Numbr = (i+1);
								if(oData.results[i].Reexp == "X") {
									oneData.Reexp = true;
								} else {
									oneData.Reexp = false;
								}
								if(oData.results[i].Seexp == "X") {
									oneData.Seexp = true;
								} else {
									oneData.Seexp = false;
								}
								vRetirementList.RetirementListSet.push(oneData);
							}
							mRetirementList.setData(vRetirementList);
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
	
	navToBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RegularRetireRegist");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : oController._vFromPageId,
		      data : {
		    	  
		      }
		});
	},
	
	onPressRetireStart : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RegularRetireRegist");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(!vContexts || vContexts.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var mRetirementList = oTable.getModel();
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var RequestProcess = function() {
			var process_result = false;
			for(var i=0; i<vContexts.length; i++) {
				try {
					var oPath = "/RetirementApplicationAdministrationSet";
					createData = {};
					createData.Persa = mRetirementList.getProperty(vContexts[i] + "/Persa");
					createData.Appno = mRetirementList.getProperty(vContexts[i] + "/Appno");
					createData.Pernr = mRetirementList.getProperty(vContexts[i] + "/Pernr");
					createData.Retda = mRetirementList.getProperty(vContexts[i] + "/Retda");
					createData.Massg = "51";
					
					if(mRetirementList.getProperty(vContexts[i] + "/Reexp") == true) {
						createData.Reexp = "X";
					} else {
						createData.Reexp = "";
					}
					if(mRetirementList.getProperty(vContexts[i] + "/Seexp") == true) {
						createData.Seexp = "X";
					} else {
						createData.Seexp = "";
					}					
					createData.Mailc = oController.makeEmailHtml(oController, mRetirementList, vContexts[i]);

					oModel.create(
							oPath, 
							createData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess RetirementApplicationAdministrationSet Create !!!");
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
					
					if(!process_result) break;
				} catch(ex) {
					process_result = false;
					common.Common.log(ex);
				}
			}
				
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(!process_result) return;
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_BATCH_START"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.onPressSearch();
				}
			});
		};
		
		var onProcessing = function(oAction) {
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
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				
				setTimeout(RequestProcess, 300);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_RETIRE_REGULAR_START"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_RETIRE_BATCH"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	makeEmailHtml : function(oController, model, context) {
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var info_tr_start = "[INFO_START]";
		var info_tr_end = "[INFO_END]";
		
		var html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/retire_strart_email.html";
		
		var tHtml = "";
		var request = $.ajax({ 
			  url: html_url,
			  cache: false,
			  async: false
		});
		
		request.done(function( html ) {
			tHtml = html;
		});
			 
		request.fail(function( jqXHR, textStatus ) {
			
		});
		
		if(tHtml == "") {
			console.log("Email HTML 파일이 없습니다.");
			return "";
		}
		
		var info_html = tHtml.substring(tHtml.indexOf(info_tr_start) + info_tr_start.length, tHtml.indexOf(info_tr_end));
		
		tHtml = tHtml.replace("[RETIRE_COMMENT]", oBundleText.getText("MSG_RETIRE_START_EMAIL_COMMENT"));
		tHtml = tHtml.replace("[RETIRE_PERSON_TITLE]", oBundleText.getText("PANEL_RETIRE_TARGET"));
		
		var vGotoUrl = "http://hr.doosan.com/irj/servlet/prt/portal/prtroot/pcd!3aportal_content!2fDoosanGHRIS!2fiViews!2fESS!2fResignation_process?sap-config-mode=true";
		var vLink = "<a href='" + vGotoUrl + "' target='_new'>" + oBundleText.getText("GOTO_BTN") + "</a>";
		tHtml = tHtml.replace("[LINK]", vLink);
		
		var info_data = "";
		var tmp_info_html ="";
		
		//성명
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ENAME"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", model.getProperty(context + "/Ename"));
		info_data += tmp_info_html;
		
		//직위/직책
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ZZCALPSG"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", model.getProperty(context + "/Zzcaltltx") + " / " + model.getProperty(context + "/Zzpsgrptx"));
		info_data += tmp_info_html;
		
		//소속부서
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("STEXT"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", model.getProperty(context + "/Fulln"));
		info_data += tmp_info_html;
		
		//퇴직일
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("SCHE_RETDA"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", dateFormat.format(new Date(common.Common.setTime(new Date(model.getProperty(context + "/Retda"))))));
		info_data += tmp_info_html;
		
		var info_replace = tHtml.substring(tHtml.indexOf(info_tr_start), tHtml.indexOf(info_tr_end) + info_tr_end.length);
		tHtml = tHtml.replace(info_replace, info_data);
	
		return tHtml;
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