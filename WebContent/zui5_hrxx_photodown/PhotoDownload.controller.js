jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchUser1");

sap.ui.controller("zui5_hrxx_photodown.PhotoDownload", {
	PAGEID : "PhotoDownload",
	oJSON : null ,
	
	_AddPersonDialog : null,

	_vPersa : '7700', 
	_vActda : null, 
	_oNum : 0,
	
	_vdateFormat : sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
	_vActiveControl : '',
	
	//Language 및 Properties를 가져온다.
	oBundleText : jQuery.sap.resources({
		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_photodown.PhotoDownload
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),

			
		});  
	},
	
	onBeforeShow : function(oEvent) {
		this._vActda = this._vdateFormat.format(new Date());
		var oEmpInfoModel = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpInfoData = oEmpInfoModel.getProperty("/EmpLoginInfoSet");
		this._vPersa  =  vEmpInfoData[0].Persa;
		
	}, 
	
	StatusColor : function(fVal) {
		if (fVal == "S") {
			return "#1DDB16";
		} else if(fVal == "E"){
			return "#FF0000";
		}
	},
	
	onDownloadPic : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_photodown.PhotoDownload");
		var oController = oView.getController();

		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PHOTO_SRV");
		var oTableDownload = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTableDownload.getModel();
		var JSONData = oJSONModel.getProperty("/ActionDownloadPicList");
		var vContexts = oTableDownload.getSelectedContexts(true);
		var tData = {};
		var vPernr = null ;
		
		if(JSONData && JSONData.length) {
			if(vContexts && vContexts.length) {
				vPernr = vContexts[0].getProperty("Pernr");
				for(var i = 1; i < vContexts.length; i++) {
					vPernr = vPernr + '|' + vContexts[i].getProperty("Pernr");
				}
			} else {
				common.Common.showErrorMessage(oBundleText.getText("MSG_WARN_NON_DOWN_TARGET"));
				return;
			}
		} else {
			common.Common.showErrorMessage(oBundleText.getText("MSG_WARN_NODATA"));
			return;
		}
		
//		oModel.read("/PhotoUploadSet(IPernr='"+vPernr+"',IFname='')/$value", null, null, false,
////		oModel.read("/PhotoUploadSet(IPernr='"+vPernr+"',IFname='')", null, null, false,
//				function(oData, oResponse) {
////					tData = oData.results;
////					oResponse.setHeader("Content-Disposition", "attachment; filename=\"PicFile.zip\"");
////					console.log(oResponse.requestUri);
//					console.log(oData);
//					console.log(oResponse);
//				});
		
		
		document.IFRAMEDOWNLOAD.location.href = "/sap/opu/odata/sap/ZHRXX_EMP_PHOTO_SRV/PhotoUploadSet(IPernr='" + vPernr + "',IFname='')/$value";
	//	console.log("document.IFRAMEDOWNLOAD.location.href_"+document.IFRAMEDOWNLOAD.location.href);
	},
	// 직원검색 POPUP창을 연다 .
	onAddPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_photodown.PhotoDownload");
		var oController = oView.getController();
		common.SearchUser1.oController = oController;
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		oController._AddPersonDialog.open();
	},
	
	// 메일수신자 삭제
	onDelPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_photodown.PhotoDownload");
		var oController = oView.getController();
		
		var oTableDownload = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var vContexts = oTableDownload.getSelectedContexts(true);
		var oJSONModel = oTableDownload.getModel();
		var JSONData = oJSONModel.getProperty("/ActionDownloadPicList");
		var vTmp = {ActionDownloadPicList:[]};
		
		var vNumbr = 1;
		
		if(JSONData && JSONData.length) {
			if(vContexts && vContexts.length) {
				for(var i = 0; i < JSONData.length; i++) {
					var checkDel = false;
					for(var j = 0; j < vContexts.length; j++) {
						if(JSONData[i].Pernr == vContexts[j].getProperty("Pernr")) {
							checkDel = true;
							break;
						}
					}
					if(checkDel) continue;
					JSONData[i].Numbr = vNumbr++;
					vTmp.ActionDownloadPicList.push(JSONData[i]);
				}
				oJSONModel.setData(vTmp);
			} else {
				common.Common.showErrorMessage(oBundleText.getText("MSG_WARN_NON_DEL_TARGET"));
				return;
			}
		} else {
			common.Common.showErrorMessage(oBundleText.getText("MSG_WARN_NODATA"));
			return;
		}
	},
	
	// 검색된 사원  리스트에 추가
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_photodown.PhotoDownload");
		var oController = oView.getController();
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var oTableDownload = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTableDownload.getModel();
		
		var JSONData = oJSONModel.getProperty("/ActionDownloadPicList");
		var vTmp = {ActionDownloadPicList:[]};
		
		var vNumbr = 1;
		var vNoData = true;
		
		if(vEmpSearchResult && vEmpSearchResult.length) {
			// 기존데이타
			if(JSONData && JSONData.length) {
				for(var i = 0; i < JSONData.length; i++) {
					JSONData[i].Numbr = vNumbr++;
					vTmp.ActionDownloadPicList.push(JSONData[i]);
				}
			}
			
			// 신규추가 데이타
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					var checkDup = false;
					vNoData = false;

					for(var j = 0; j < vTmp.ActionDownloadPicList.length; j++){
						if(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr") == vTmp.ActionDownloadPicList[j].Pernr) {
							checkDup = true;
							break;
						}
					}
					if(checkDup) continue;
					
					vTmp.ActionDownloadPicList.push({
						Numbr : vNumbr++,
						Persa : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Persa"),
						Piurl : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Photo"),
						Pernr : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr"),
						Ename : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"), 
						Fulln : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln"),
						Pbtxt : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pbtxt"),
						Statx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Statx"),
						Zzjobgrtx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzjobgrtx"),
//						Rnoyn : false,
//						Pnryn : false,
//						Payyn : false
					});
				} 
			}
			
			if(vNoData) {
				common.Common.showErrorMessage(oBundleText.getText("MSG_SELECT_PERSON"));
				return;
			} else {
				oJSONModel.setData(vTmp);
			}
		} else {
			common.Common.showErrorMessage(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		
		common.SearchUser1.onClose();
	},
	
//	// 검색된 사원  리스트에 추가
//	onESSelectPerson : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_photodown.PhotoDownload");
//		var oController = oView.getController();
//		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
//		var mEmpSearchResult = oTable.getModel();
//		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
//		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
//		var oTableDownload = sap.ui.getCore().byId(oController.PAGEID + "_Table");
//		var oJSONModel = oTableDownload.getModel();
//		
//		var JSONData = oJSONModel.getProperty("/ActionDownloadPicList");
//		var vTmp = {ActionDownloadPicList:[]};
//		
//		var vNumbr = 1;
//		var vNoData = true;
//		
//		if(vEmpSearchResult && vEmpSearchResult.length) {
//			// 기존데이타
//			if(JSONData && JSONData.length) {
//				for(var i = 0; i < JSONData.length; i++) {
//					JSONData[i].Numbr = vNumbr++;
//					vTmp.ActionDownloadPicList.push(JSONData[i]);
//				}
//			}
//			
//			// 신규추가 데이타
//			for(var i=0; i<vEmpSearchResult.length; i++) {
//				if(vEmpSearchResult[i].Chck == true) {
//					var checkDup = false;
//					vNoData = false;
//
//					for(var j = 0; j < vTmp.ActionDownloadPicList.length; j++){
//						if(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr") == vTmp.ActionDownloadPicList[j].Pernr) {
//							checkDup = true;
//							break;
//						}
//					}
//					if(checkDup) continue;
//					
//					vTmp.ActionDownloadPicList.push({
//						Numbr : vNumbr++,
//						Persa : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Persa"),
//						Piurl : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Photo"),
//						Pernr : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr"),
//						Ename : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"), 
//						Fulln : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln"),
//						Pbtxt : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pbtxt"),
//						Statx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Statx"),
//						Zzjobgrtx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzjobgrtx"),
////						Rnoyn : false,
////						Pnryn : false,
////						Payyn : false
//					});
//				} 
//			}
//			
//			if(vNoData) {
//				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//				return;
//			} else {
//				oJSONModel.setData(vTmp);
//			}
//		} else {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//			return;
//		}
//		
//		
//		common.SearchUser1.onClose();
//	},
	
	// 조직검색 POPUP 창을 연다
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_photodown.PhotoDownload");
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
	
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_photodown.PhotoDownload
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_photodown.PhotoDownload
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_photodown.PhotoDownload
*/
//	onExit: function() {
//
//	}

});