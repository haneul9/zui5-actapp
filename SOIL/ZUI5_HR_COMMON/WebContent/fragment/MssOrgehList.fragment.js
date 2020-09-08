sap.ui.jsfragment("fragment.MssOrgehList", {

	createContent : function(oController) {	
		
		var beforeOpenDialog = function(oEvent){
					
			oSearchField.setValue("");
			oList.removeSelections(true);
			
			onSearch();
		};

		var onSearch = function(oEvent) {
			var vText = oSearchField.getValue();
			
			var oFilters = [];
			oFilters.push(new sap.ui.model.Filter("Orgtx", sap.ui.model.FilterOperator.Contains, vText));
		    
			oList.getBinding("items").filter(oFilters);
		};
		
		var onCancle = function(oEvent) {
			var oBinding = oList.getBinding("items");
		    oBinding.filter([]);
		    
		    oList.setSelectedItemById(null);
		};
		
		var onSelect = function(oEvent){
			var vContext = oList.getSelectedContexts()[0];
			
			if(!vContext){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0650"), {title : oBundleText.getText("LABEL_0053")});	// 650:부서를 선택하여 주십시오., 53:오류
				return;
			}
					
			oDialog.close();
			
			switch(oController.PAGEID){
				case "ZUI5_HR_CardDetail" :		// 법인카드신청
					oController._DetailJSonModel.setProperty("/Data/Orgtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._DetailJSonModel.setProperty("/Data/Orgeh", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
					
					oController.onChangeDetail();
					break;
				case "ZUI5_HR_EmpChartList" : 	 // 인원현황
					oController._ListCondJSonModel.setProperty("/Data/Orgtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._ListCondJSonModel.setProperty("/Data/Orgeh", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
					
					oController.checkOrgeh(oController);
					break;
				case "ZUI5_HR_EmpAgeChartList" : // 평균근속,연령현황
					oController._ListCondJSonModel.setProperty("/Data/Orgtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._ListCondJSonModel.setProperty("/Data/Orgeh", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
					
					oController.checkOrgeh(oController);
					break;
				case "ZUI5_HR_KpiChartList" : 	 // KPI
					oController._ListCondJSonModel.setProperty("/Data/Orgtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._ListCondJSonModel.setProperty("/Data/Orgeh", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
					
					oController.checkOrgeh(oController);
					break;
				case "ZUI5_HR_VacationChartList" : 	 // 휴가사용현황
					oController._ListCondJSonModel.setProperty("/Data/Orgtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._ListCondJSonModel.setProperty("/Data/Orgeh", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
					
					oController.checkOrgeh(oController);
					break;
				case "ZUI5_HR_OtPayChartList" : 	 // 가산급률현황
					oController._ListCondJSonModel.setProperty("/Data/Orgtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._ListCondJSonModel.setProperty("/Data/Orgeh", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
					
					oController.checkOrgeh(oController);
					break;
				case "ZUI5_HR_FlexWorkRewardList" :		// 유연근무 초과보상신청(리스트)
					oController._ListCondJSonModel.setProperty("/Data/Zzorgidtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._ListCondJSonModel.setProperty("/Data/Zzorgid", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
					
					oController.onPressSearch();
					break;
				case "ZUI5_HR_FlexWorkRewardDetail" :	// 유연근무 초과보상신청(디테일)
					oController._DetailJSonModel.setProperty("/Data/Zzorgidtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._DetailJSonModel.setProperty("/Data/Zzorgid", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
								
					oController.onSetAppl();
					oController.onSearch();
					break;
				default :
					oController._ListCondJSonModel.setProperty("/Data/Orgtx", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgtx"));
					oController._ListCondJSonModel.setProperty("/Data/Orgeh", oController._OrgehJSONModel.getProperty(vContext.sPath + "/Orgeh"));
										
					oController.onPressSearch();
			}
		};
		
		var oList = new sap.m.List({
			items : {
				path : "/Data",
				template  : new sap.m.StandardListItem({
					title : "{Orgtx}"
				})
			},
			growing : true,
			growingScrollToLoad : true,
			rememberSelections : false,
			mode : "SingleSelectMaster"
		});
		
		oList.setModel(oController._OrgehJSONModel);
		oList.attachBrowserEvent("dblclick", onSelect);
		
		var oListScroll = new sap.m.ScrollContainer({
			width : "100%",
			height : "450px",
			horizontal : false,
			vertical : true,
			content : [oList]
		});

		var oSearchField = new sap.m.SearchField({
			showSearchButton : true,
			width : "100%",
			liveChange : onSearch,
			search : onSearch
		});		
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_MssOrgehDialog", {
			contentWidth : "400px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2787"),	// 2787:부서검색
			verticalScrolling:false,
			beforeOpen : beforeOpenDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : onSelect
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://decline",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : function(oEvent){
					oDialog.close();
				}
			}),
			content : [oSearchField, oListScroll]
		});	
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});