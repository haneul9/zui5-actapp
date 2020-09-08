jQuery.sap.declare("common.SearchKostl");
jQuery.sap.require("common.Common");

/** 
* 직무검색의 Dialog를 위한 JS 이다.
* @Create By 정명구
*/

common.SearchKostl = {
	/** 
	* @memberOf common.SearchKostl
	*/	
	
	oController : null,
	vActionType : "Multi",
	vCallControlId : "",
	vCallControlType : "MultiInput",
	vCompany : "",
	 
	/*
	 * 검색어를 이용하여 직무를 검색
	 * 검색 대상은 직무명 이다.
	 */
	SearchKostl : function(oEvent) {
		
		var oFilters = [];
		
		var oDatum = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_Datum");
		var oStext = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_Stext");
		
		var vPersa = common.SearchKostl.oController._vPersa;		
		
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersa));
		
		if(oDatum.getValue() != "") {
			oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, oDatum.getValue()));
		}
		
		if(oStext.getValue() != "") {
			oFilters.push(new sap.ui.model.Filter("Ltext", sap.ui.model.FilterOperator.EQ, oStext.getValue()));
		}
		
		if(common.SearchKostl.vCompany != "") {
			oFilters.push(new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, common.SearchKostl.vCompany));
		}
		
		var oTable = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_TABLE");
		var oColumnList = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_COLUMNLIST");
		oTable.bindItems("/KOSTLCodeListSet", oColumnList, null, oFilters);

	},
	
	/*
	 * 직무검색 Dialog를 Close한다.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_Dialog");
		if(oDialog) oDialog.close();
	},
	
	/*
	 * 검색어를 입력하고 Enter 키를 클릭했을때 처리하는 내용
	 */
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			common.SearchKostl.SearchKostl();
		}
	},
	
	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onConfirm : function(oEvent) {
		var vSelectedKostl = [];
		
		var oTable = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts && vContexts.length) {
			for(var i=0; i<vContexts.length; i++) {
				var vKostlInfo = {};
				vKostlInfo.Kostl = vContexts[i].getProperty("Kostl");
				vKostlInfo.Ltext = vContexts[i].getProperty("Ltext");
				
				vSelectedKostl.push(vKostlInfo);
			}				
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_KOSTL"));
			return;
		}
		
		if(common.SearchKostl.vCallControlType == "MultiInput") {
			var oMultiInput = sap.ui.getCore().byId(common.SearchKostl.vCallControlId);
			if(oMultiInput) {
				for(var i=0; i<vSelectedKostl.length; i++) {
					oMultiInput.addToken(new sap.m.Token({
						key : vSelectedKostl[i].Kostl,
						text : vSelectedKostl[i].Ltext,
						editable  : false
					}));
				}
			}
		} else if(common.SearchKostl.vCallControlType == "Input") {
			var oInput = sap.ui.getCore().byId(common.SearchKostl.vCallControlId);
			if(oInput) {
				if(vSelectedKostl && vSelectedKostl.length) {
					oInput.setValue(vSelectedKostl[0].Ltext);
					
					var oCustomData = oInput.getCustomData();
		    		
		    		var vItgrp = "";
		    		for(var i=0; i<oCustomData.length; i++) {
		    			if(oCustomData[i].getKey() == "Itgrp") {
		    				vItgrp = oCustomData[i].getValue();
		    				break;
		    			}
		    		}
		    		var vKey = oCustomData[0].getKey();	
		    		
		    		if(vItgrp ==  "") {
		    			oInput.removeAllCustomData();
		    			oInput.destroyCustomData();
			    		
		    			oInput.addCustomData(new sap.ui.core.CustomData({key : vKey, value : vSelectedKostl[0].Kostl}));
				    	for(var i=1; i<oCustomData.length; i++) {
				    		oInput.addCustomData(oCustomData[i]);
				    	}
		    		} else {
		    			var oModel = sap.ui.getCore().getModel("JSON_" + vItgrp);
		    			var pos1 = common.SearchKostl.vCallControlId.lastIndexOf("-");
		    			var idx = common.SearchKostl.vCallControlId.substring(pos1 + 1);
		    			oModel.setProperty("/TableDataList/" + idx + "/" + vKey, vSelectedKostl[0].Kostl);
		    		}
				}
			}
		}		
		
		//직무검색 Dialog를 Close한다.
		var oDialog = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onBeforeOpenSearchKostlDialog : function(oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_TABLE");
		var oStext = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_Stext");
		
		var oDatum = sap.ui.getCore().byId(common.SearchKostl.oController.PAGEID + "_COMMON_SEARCH_KOSTL_Datum");
		if(common.SearchKostl.oController._vActda != null) {
			oDatum.setValue(common.SearchKostl.oController._vActda);
		}
		
		if(common.SearchKostl.vActionType == "Single") {
			oTable.setMode(sap.m.ListMode.SingleSelectLeft);
		} else {
			oTable.setMode(sap.m.ListMode.MultiSelect );
		}
		oTable.unbindItems();
		oStext.setValue("");
	}
	
};