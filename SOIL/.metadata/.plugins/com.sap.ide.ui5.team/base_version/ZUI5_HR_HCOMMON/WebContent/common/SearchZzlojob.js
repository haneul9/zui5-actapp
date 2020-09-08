jQuery.sap.declare("common.SearchZzlojob");
jQuery.sap.require("common.Common");

/** 
* 직무검색의 Dialog를 위한 JS 이다.
* @Create By 정명구
*/

common.SearchZzlojob = {
	/** 
	* @memberOf common.SearchZzlojob
	*/	
	
	oController : null,
	vActionType : "Multi",
	vCallControlId : "",
	vCallControlType : "MultiInput",
	
	/*
	 * 검색어를 이용하여 직무를 검색
	 * 검색 대상은 직무명 이다.
	 */
	SearchZzlojob : function(oEvent) {
		
		var oFilters = [];
		
		var oDatum = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Datum");
		var oStext = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Stext");
		
		var vPersa = common.SearchZzlojob.oController._vPersa;		
		
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersa));
		
		if(oDatum.getValue() != "") {
			oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, oDatum.getValue()));
		}
		
		if(oStext.getValue() != "") {
			oFilters.push(new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.EQ, oStext.getValue()));
		}
		
		var oTable = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_TABLE");
		var oColumnList = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_COLUMNLIST");
		oTable.bindItems("/LocalJobCodeListSet", oColumnList, null, oFilters);

	},
	
	/*
	 * 직무검색 Dialog를 Close한다.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Dialog");
		if(oDialog) oDialog.close();
	},
	
	/*
	 * 검색어를 입력하고 Enter 키를 클릭했을때 처리하는 내용
	 */
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			common.SearchZzlojob.SearchZzlojob();
		}
	},
	
	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onConfirm : function(oEvent) {
		var vSelectedZzlojob = [];
		
		var oTable = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts && vContexts.length) {
			for(var i=0; i<vContexts.length; i++) {
				var vZzlojobInfo = {};
				vZzlojobInfo.Objid = vContexts[i].getProperty("Objid");
				vZzlojobInfo.Stext = vContexts[i].getProperty("Stext");
				vZzlojobInfo.StextEn = vContexts[i].getProperty("StextEn");
				
				vZzlojobInfo.Stell = vContexts[i].getProperty("STELL");
				vZzlojobInfo.Stltx = vContexts[i].getProperty("STLTX");
				
				vSelectedZzlojob.push(vZzlojobInfo);
			}				
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_ZZLOJOB"));
			return;
		}
		
		if(common.SearchZzlojob.vCallControlType == "MultiInput") {
			var oMultiInput = sap.ui.getCore().byId(common.SearchZzlojob.vCallControlId);
			if(oMultiInput) {
				for(var i=0; i<vSelectedZzlojob.length; i++) {
					oMultiInput.addToken(new sap.m.Token({
						key : vSelectedZzlojob[i].Objid,
						text : vSelectedZzlojob[i].Stext,
						editable  : false
					}));
				}
			}
		} else if(common.SearchZzlojob.vCallControlType == "Input") {
			var oInput = sap.ui.getCore().byId(common.SearchZzlojob.vCallControlId);
			if(oInput) {
				if(vSelectedZzlojob && vSelectedZzlojob.length) {
					oInput.setValue(vSelectedZzlojob[0].Stext);
					
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
			    		
		    			oInput.addCustomData(new sap.ui.core.CustomData({key : vKey, value : vSelectedZzlojob[0].Objid}));
				    	for(var i=1; i<oCustomData.length; i++) {
				    		oInput.addCustomData(oCustomData[i]);
				    	}
				    	
				    	common.SearchZzlojob.setStellValue(vSelectedZzlojob[0].Stell, vSelectedZzlojob[0].Stltx);
		    		} else {
		    			var oModel = sap.ui.getCore().getModel("JSON_" + vItgrp);
		    			var pos1 = common.SearchZzlojob.vCallControlId.lastIndexOf("-");
		    			var idx = common.SearchZzlojob.vCallControlId.substring(pos1 + 1);
		    			oModel.setProperty("/TableDataList/" + idx + "/" + vKey, vSelectedZzlojob[0].Objid);
		    		}
				}
			}
		}		
		
		var oPostitle = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_Pos_title");
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		var vPositionnocopy =  common.SearchZzlojob.oController._vPositionnocopy;
		
		if(oPostitle && vPositionnocopy != "X" ) { //common.SearchZzlojob.oController._vMolga != "08") {
			oPostitle.setValue(vSelectedZzlojob[0].Stext);
		}
		
		var oPostitle2 = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_Pos_title2");
		if(oPostitle2 && vPositionnocopy != 'X' ) { //common.SearchZzlojob.oController._vMolga != "08") {
			oPostitle2.setValue(vSelectedZzlojob[0].StextEn);
		}
		
		//직무검색 Dialog를 Close한다.
		var oDialog = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onBeforeOpenSearchZzlojobDialog : function(oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_TABLE");
		var oStext = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Stext");
		
		var oDatum = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Datum");
		if(common.SearchZzlojob.oController._vActda != null) {
			oDatum.setValue(common.SearchZzlojob.oController._vActda);
		}
		
		if(common.SearchZzlojob.vActionType == "Single") {
			oTable.setMode(sap.m.ListMode.SingleSelectLeft);
		} else {
			oTable.setMode(sap.m.ListMode.MultiSelect );
		}
		oTable.unbindItems();
		oStext.setValue("");
	},
	
	setStellValue : function(vCode, vText) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		if(vCode == "" || vCode == "00000000") return;
		
		var oStell = sap.ui.getCore().byId(common.SearchZzlojob.oController.PAGEID + "_Stell");
		if(oStell) {
			console.log(vCode + ", " + vText);
			oStell.setValue(vText);
			
			var oCustomData = oStell.getCustomData();
    		
    		var vKey = oCustomData[0].getKey();	
    		
    		oStell.removeAllCustomData();
    		oStell.destroyCustomData();
    		
    		oStell.addCustomData(new sap.ui.core.CustomData({key : vKey, value : vCode}));
	    	for(var i=1; i<oCustomData.length; i++) {
	    		oStell.addCustomData(oCustomData[i]);
	    	}
		}
	}
	
};