jQuery.sap.require("common.Common");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("zui5_hrxx_actann.AnnounceList", {
	PAGEID : "AnnounceList",
	
	BusyDialog : null,
	
	_ActPersonPopover : null,
	_ActTimelinePopover : null,
	_EmpProfilePopover : null,
	_SortDialog : null,
	
	_vSelectedReqnoActPerson : "",
	_vSelectedDocnoActPerson : "",
	_vSelectedReqnoActTimeline : "",
	_vSelectedDocnoActTimeline : "",
	_vSelectedPernr : "",
	
	/**
	 * 페이지를 초기화한다.
	 * 인사영역 리스트를 해당 Control에 할당한다.
	 * 페이지 Open 후에 수행할 Method를 정의한다.
	 * @memberOf zui5_hrxx_actann.AnnounceList 
	 */
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
		var oPersaModel = sap.ui.getCore().getModel("PersaModel");
		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
		
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		try {
			for(var i=0; i<vPersaData.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			oPersa.addSelectedKeys([vPersaData[0].Persa]);
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var oControl = sap.ui.getCore().byId(this.PAGEID + "_Pbtxt");
		var mPersaModel = sap.ui.getCore().getModel("PersaModel");
		oControl.setText(mPersaModel.getProperty("/PersAreaListSet/0/Pbtxt"));	
		
	    this.getView().addEventDelegate({
	    	onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
		});
	},
	
	onBeforeShow: function(evt) {

	},
	
	/**
	 * 페이지가 Open후에 수행된다.
	 * 검색을 수행하는 Method를 호출한다.
	 * @param evt
	 */
	onAfterShow: function(evt) {
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
		var nextDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
		
		var lang1 = jQuery.sap.getUriParameters().get("sap-ui-language");
		var lang2 = jQuery.sap.getUriParameters().get("sap-language");

		var lang = "";
		if(lang2 && lang2 != "") lang = lang2;
		else if(lang1 && lang1 != "") lang = lang1;
		else lang = "KO";
		
		var oFromDateControl = $("#" + this.PAGEID + "_Annda_From-inner");
		if(oFromDateControl) {
			oFromDateControl.css("width", "180px");
			oFromDateControl.datepicker({
				changeMonth: true,
			    changeYear: true,
			    dateFormat: gDtfmt.replace("yyyy", "yy").replace("MM", "mm"),
			    yearSuffix : "",
			    navigationAsDateFormat: true,
			    showOn: "both",
			    buttonImage: "/sap/bc/ui5_ui5/sap/zhrxx_common/images/calendar.png",
			    buttonImageOnly: true,
			    buttonText: "",
			    showWeek : true,
			    weekHeader : ""
			});
			oFromDateControl.datepicker( "setDate", prevDate );
			if(lang.toUpperCase() == "KO") {
				oFromDateControl.datepicker( "option", "monthNames",  [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ]);
				oFromDateControl.datepicker( "option", "monthNamesShort",  [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ]);
				
				oFromDateControl.datepicker( "option", "dayNames",  [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ]);
				oFromDateControl.datepicker( "option", "dayNamesMin",  [ "일", "월", "화", "수", "목", "금", "토" ]);
				oFromDateControl.datepicker( "option", "dayNamesShort",  [ "일", "월", "화", "수", "목", "금", "토" ]);
			}
		}
		
		var oToDateControl = $("#" + this.PAGEID + "_Annda_To-inner");
		if(oToDateControl) {
			oToDateControl.css("width", "180px");
			oToDateControl.datepicker({
				changeMonth: true,
			    changeYear: true,
			    dateFormat: gDtfmt.replace("yyyy", "yy").replace("MM", "mm"),
			    yearSuffix : "",
			    navigationAsDateFormat: true,
			    showOn: "both",
			    buttonImage: "/sap/bc/ui5_ui5/sap/zhrxx_common/images/Calendar.png",
			    buttonImageOnly: true,
			    buttonText: "",
			    showWeek : true,
			    weekHeader : ""
			});
			oToDateControl.datepicker( "setDate", nextDate );
			if(lang.toUpperCase() == "KO") {
				oToDateControl.datepicker( "option", "monthNames",  [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ]);
				oToDateControl.datepicker( "option", "monthNamesShort",  [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ]);
				
				oToDateControl.datepicker( "option", "dayNames",  [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ]);
				oToDateControl.datepicker( "option", "dayNamesMin",  [ "일", "월", "화", "수", "목", "금", "토" ]);
				oToDateControl.datepicker( "option", "dayNamesShort",  [ "일", "월", "화", "수", "목", "금", "토" ]);
			}
		}
		this.onPressSearch();
	},
	
	/**
	 * 발려품의서 게시 리스트를 검색한다.
	 * 검색기준은 인사영역, 발령일, 품의번호, 발령유형 이다.
	 * @param oEvent
	 */
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var oFromDateControl = $("#" + oController.PAGEID + "_Annda_From-inner");
		var oToDateControl = $("#" + oController.PAGEID + "_Annda_To-inner");
		var vFromDate = "";
		var vToDate = "";
		if(oFromDateControl) {
			vFromDate = dateFormat.format(oFromDateControl.datepicker("getDate"));
		}
		if(oToDateControl) {
			vToDate = dateFormat.format(oToDateControl.datepicker("getDate"));
		}
	    var filterString = "";
	    
	    filterString += "/?$filter=";  
		filterString += "(Annda%20ge%20datetime%27" + vFromDate + "T00%3a00%3a00%27%20and%20Annda%20le%20datetime%27" + vToDate + "T00%3a00%3a00%27)";
		
		if(oTitle.getValue() != "") {
			filterString += "%20and%20(Title%20eq%20%27" + encodeURI(oTitle.getValue()) + "%27)";
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
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		var vActionReqList = {ActionReqListSet : []};
		
		var readAfterProcess = function() {			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mActionReqList);
			oTable.bindItems("/ActionReqListSet", oColumnList);
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		oModel.read("/ActionRequestAnnouncementSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oData.results[i].Numbr = i+1;
								vActionReqList.ActionReqListSet.push(oData.results[i]);
							}
							mActionReqList.setData(vActionReqList);
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
	 * 발령유형, 인사영역이 선택되면 검색조건에 해당값을 표시한다.
	 * @param oEvent
	 */
	onChnageComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
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
	
	/**
	 * 게시된 리스트에서 특정 발령품의서를 클릭하면 상세정보를 조회하는 페이지로 이동한다.(AnnounceDetail)
	 * @param oEvent
	 */
	onSelectRow : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		
//		sap.ui.getCore().getEventBus().publish("nav", "to", {
//		      id : "zui5_hrxx_actann.AnnounceDetail",
//		      data : {
//		    	  context : oContext,
//		    	  Reqno : mActionReqList.getProperty(oContext + "/Reqno"),
//		    	  Docno : mActionReqList.getProperty(oContext + "/Docno"),
//		      }
//		});
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actann.AnnounceContent",
		      data : {
		    	  Docst : "300",
		    	  Annno : mActionReqList.getProperty(oContext + "/Annno"),
		    	  Persa : mActionReqList.getProperty(oContext + "/Persa"),
		    	  Context : oContext
		      }
		});
	},
	
	/**
	 * 리스트에서 기안자를 클릭하면 기안자 정보를 표시하는 Popover를 Open 한다.
	 */
	displayPopoverEmpProfile : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
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
	
	/**
	 * 리스트에서 기안자를 클릭하면 기안자 정보를 표시하는 Popover이 Open 하기전에 정보를 설정한다.
	 * @param oEvent
	 */
	onBeforeOpenPopoverEmpProfile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
		var oController = oView.getController();
		
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_EP_ENAME");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_EP_FULLN");
		var oPhoto = sap.ui.getCore().byId(oController.PAGEID + "_EP_PHOTO");
		var oCelno = sap.ui.getCore().byId(oController.PAGEID + "_EP_CELNO");
		var oTelno = sap.ui.getCore().byId(oController.PAGEID + "_EP_TELNO");
		var oEmail = sap.ui.getCore().byId(oController.PAGEID + "_EP_EMAIL");
		var oPbtxt = sap.ui.getCore().byId(oController.PAGEID + "_EP_PBTXT");
		var oZzempwptx = sap.ui.getCore().byId(oController.PAGEID + "_EP_ZZEMPWPTX");
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		
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
	
	/**
	 * 리스트에서 인원수를 클릭하면 발령대상자 정보를 표시하는 Popover를 Open 한다.
	 */
	displayPopoverActPerson : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
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
	
	/**
	 * 리스트에서 인원수를 클릭하면 발령대상자 정보를 표시하는 Popover를 Open 하기전에 발려대상자 정보를 설정한다.
	 * @param oEvent
	 */
	onBeforeOpenPopoverActPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
		var oController = oView.getController();
		
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_AP_List");
		var oListItem = sap.ui.getCore().byId(oController.PAGEID + "_AP_ListItem");
		
		var filterString = "?$filter=Reqno%20eq%20%27" + encodeURI(oController._vSelectedReqnoActPerson) + "%27";
		filterString += "%20and%20Docno%20eq%20%27" + oController._vSelectedDocnoActPerson + "%27";
		
		oList.bindItems("/ActionEmpSummaryListSet/" + filterString, oListItem);
	},
	
	/**
	 * 리스트에서 변경일을 클릭하면 품의서 상태변화 리스트를 표시하는 Popover를 Open 한다.
	 */
	displayPopoverActTimeline : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
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
	
	/**
	 * 리스트에서 변경일을 클릭하면 품의서 상태변화 리스트를 표시하는 Popover를 Open 하기전에 상태변화 리스트 정보를 설정한다.
	 * @param oEvent
	 */
	onBeforeOpenPopoverActTimeline : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
		var oController = oView.getController();
		
		var oTimeline = sap.ui.getCore().byId(oController.PAGEID + "_AT_Timeline");
		var oTimeItem = sap.ui.getCore().byId(oController.PAGEID + "_AT_TimeItem");
		
		var filterString = "?$filter=Reqno%20eq%20%27" + encodeURI(oController._vSelectedReqnoActTimeline) + "%27";
		filterString += "%20and%20Docno%20eq%20%27" + oController._vSelectedDocnoActTimeline + "%27";
		
		oTimeline.bindAggregation("content", {
			path : "/ActionReqChangeHistorySet/" + filterString,
			template : oTimeItem
		});
	},
	
	/**
	 * 리스트의 정렬를 위한 Dialog를 Open 한다.
	 * @param oEvent
	 */
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("fragment.ActionReqListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	/**
	 * 리스트의 정렬를 수행한다.
	 * @param oEvent
	 */
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
	
	onCreateAnnouce : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actann.AnnounceContent",
		      data : {
		    	  Docst : "100",
		    	  Persa : gPersa
		      }
		});
	},
	
	onModifyAnnouce : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContexts = oTable.getSelectedContexts();
		
		var mAnnounceList = oTable.getModel();
		
		if(oContexts && oContexts.length) {
			if(oContexts.length != 1) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_UPDATE2"));
				return;
			}
			
			if(gPernr != mAnnounceList.getProperty(oContexts[0] + "/Pernr")) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_ANNOUNCE3"));
				return;
			}
			
			var vAnnno = mAnnounceList.getProperty(oContexts[0] + "/Annno");
			var vPersa = mAnnounceList.getProperty(oContexts[0] + "/Persa");
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "zui5_hrxx_actann.AnnounceContent",
			      data : {
			    	  Docst : "200",
			    	  Annno : vAnnno,
			    	  Persa : vPersa,
			    	  Context : oContexts[0]
			      }
			});
		}
	},
	
	onDeleteAnnouce : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContexts = oTable.getSelectedContexts();
		
		var mAnnounceList = oTable.getModel();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		if(oContexts && oContexts.length < 1) {
			return;
		}
		
		if(oContexts && oContexts.length) {
			for(var i=0; i<oContexts.length; i++) {
				if(gPernr != mAnnounceList.getProperty(oContexts[i] + "/Pernr")) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_ANNOUNCE4"));
					return;
				}
			}
		}
		
		var onDeleteAction = function() {
			if(oContexts && oContexts.length) {
				var process_result = false;
				for(var i=0; i<oContexts.length; i++) {
					var vAnnno = mAnnounceList.getProperty(oContexts[i] + "/Annno");
					var vPersa = mAnnounceList.getProperty(oContexts[i] + "/Persa");
					
					var oPath = "/ActionRequestAnnouncementSet(Annno='" + vAnnno + "',Persa='" + vPersa + "')";
					
					process_result = false;
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess ActionRequestAnnouncementSet Delete !!!");
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
					
					if(process_result == false) {
						break;
					}
				}
				
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("INFORMATION"),
						onClose : function() {
							oController.onPressSearch();
						}
					});
				}
			}
		};
		
		
		var onProcessing = function(oAction){
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
				
				setTimeout(onDeleteAction, 300);
				
        	}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_ACT_ANNOUNCE"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},

});

