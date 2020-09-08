jQuery.sap.declare("zui5_hrxx_projectprocess.javascript.SearchStell");
jQuery.sap.require("common.Common");

var StellTree = null;

/** 
* 직무검색의 Dialog를 위한 JS 이다.
* @Create By 정명구
*/

zui5_hrxx_projectprocess.javascript.SearchStell = {
	/** 
	* @memberOf zui5_hrxx_projectprocess.javascript.SearchStell
	*/	
	
	oController : null,
	vActionType : "Multi",
	vCallControlId : "",
	vCallControlType : "MultiInput",
	
	handleIconTabBarSelect : function(oEvent) {
		
	    var sKey = oEvent.getParameter("selectedKey");
	    var oNextBtn = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_NextButton");
		var oPrevBtn = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_PrevButton");
		
	    if (sKey === "1") {	    	
			oNextBtn.setEnabled(false);
			oPrevBtn.setEnabled(false);
	    } else {
	    	oNextBtn.setEnabled(false);
			oPrevBtn.setEnabled(false);
	    }
	},

	/*
	 * dhtmlXTreeObject 를 이용하여 직무 Tree를 생성한다.
	 * "StellTree" EntitySet을 Read하여 직무에 대한 Tree를 생성하고
	 * 직무을 클릭하면 "PernrInfo" EntitySet을 Read하여 조작에 속한 사원 Tree를 생성한다.
	 */
	createStellTree : function() {
		
		StellTree = new dhtmlXTreeObject(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_StellTree", "100%", "100%", 0);

		StellTree.setSkin('dhx_skyblue');
		StellTree.setImagePath("/sap/bc/ui5_ui5/sap/zhrxx_common/css/imgs/dhxtree_skyblue/");
		
		if(zui5_hrxx_projectprocess.javascript.SearchStell.vActionType == "Single") {
			StellTree.enableRadioButtons(true);
			StellTree.enableSingleRadioMode(true);
			StellTree.attachEvent("onDblClick", function(id){
				StellTree.setCheck(id, 1);
			    zui5_hrxx_projectprocess.javascript.SearchStell.onConfirm();
			});
		} else {
			StellTree.enableCheckBoxes(true);
		}
		
		
		//직무 전체 대이터를 가져와서 Tree를 생성한다. 
		var vStype = "2";
		var vPersa = zui5_hrxx_projectprocess.javascript.SearchStell.oController._vPersa;
		var vDatum = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Datum").getValue();
		
		var oMultiInput = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlId);
		var oMulti_Tokens = oMultiInput.getTokens();
		var vSelectedSubjobList = [] ;
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		oModel.read (
				"/JoblistSet/?$filter=Stype%20eq%20%27" + vStype + "%27" 
				+ "%20and%20Persa%20eq%20%27" + vPersa + "%27"
				+ "%20and%20Datum%20eq%20datetime%27" + vDatum + "T00%3a00%3a00%27",
				null, 
				null, 
				false, 
				function(oData, oResponse) {
					var i;
//					var vExist = false;
					if(oData) {
						for(i=0; i<oData.results.length; i++) {
							if(oData.results[i].Otype == "C") chkCheckbox = true;
							
							if(oData.results[i].Stell_up === "00000000") {
								StellTree.insertNewItem("0", oData.results[i].Stell, oData.results[i].Stext);
							} else {
								StellTree.insertNewChild(oData.results[i].Stell_up, oData.results[i].Stell, oData.results[i].Stext);
							}
							
							StellTree.showItemCheckbox(oData.results[i].Stell, true);
							StellTree.setUserData(oData.results[i].Stell,"Otype", oData.results[i].Otype) ;
							StellTree.setItemStyle(oData.results[i].Stell, "font-size:13px;font-family: 'Malgun Gothic'");
							
							// Job MultiInput Box 에 Data가 존재시에는 Check
							for(var j=0; j < oMulti_Tokens.length ; j++){
								if(oData.results[i].Stell == oMulti_Tokens[j].getKey()){
									StellTree.setCheck(oData.results[i].Stell,1);
									vSelectedSubjobList[j] = oData.results[i].Subjfid ;
									break;
								}
							}
						}
						
						for(i=0; i<oData.results.length; i++) {
							var nodeid = oData.results[i].Stell;
							if(parseInt(oData.results[i].Level) > 2) {
								StellTree.closeItem(nodeid);
							}
							for(var j=0; j < vSelectedSubjobList.length ; j++){
								if(oData.results[i].Stell == vSelectedSubjobList[j]){
									StellTree.openItem(nodeid);
									break;
								}
							}
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);	
	},
	
	/*
	 * 검색어를 이용하여 직무를 검색
	 * 검색 대상은 직무명 이다.
	 */
	searchStell : function(oEvent) {
		
		var oIconTabbar = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_ICONTABBAR");
		var vSelectedTabKey = oIconTabbar.getSelectedKey();
		
		var oFilters = [];
		
		var oDatum = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Datum");
		var oStext = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Stext");
		
		var vPersa = zui5_hrxx_projectprocess.javascript.SearchStell.oController._vPersa;
		
		if(vSelectedTabKey == "1") {
			oFilters.push(new sap.ui.model.Filter("Stype", sap.ui.model.FilterOperator.EQ, "1"));
			oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersa));
			
			if(oDatum.getValue() != "") {
				oFilters.push(new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, oDatum.getValue()));
			}
			
			if(oStext.getValue() != "") {
				oFilters.push(new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.EQ, oStext.getValue()));
			}
			
			var oTable = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
			var oColumnList = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_COLUMNLIST");
			common.Common.log("oColumnList : " + oColumnList);
			oTable.bindItems("/JoblistSet", oColumnList, null, oFilters);
		} else {	
			if(oStext.getValue() != "") {
				StellTree.findItem(oStext.getValue(), 0, 1);
				
				var oNextBtn = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_NextButton");
				var oPrevBtn = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_PrevButton");
				oNextBtn.setEnabled(true);
				oPrevBtn.setEnabled(true);
			}
		}	
	},
	
	searchStellNext : function(oEvent) {
		var oStext = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Stext");
		if(oStext.getValue() != "") {
			StellTree.findItem(oStext.getValue(), 0);
		}
	},
	
	searchStellPrev : function(oEvent) {
		var oStext = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Stext");
		if(oStext.getValue() != "") {
			StellTree.findItem(oStext.getValue(), 1);
		}
	},
	
	/*
	 * 직무검색 Dialog를 Close한다.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Dialog");
		if(oDialog) oDialog.close();
	},
	
	/*
	 * 검색어를 입력하고 Enter 키를 클릭했을때 처리하는 내용
	 */
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			zui5_hrxx_projectprocess.javascript.SearchStell.searchStell();
		}
	},
	
	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onConfirm : function(oEvent) {
		var oIconTabBar = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_ICONTABBAR");
		var TABID = oIconTabBar.getSelectedKey();
		var vSelectedStell = [];
		
		
		//직무 Tree에서 선택된 경우
		if(TABID == "2") {
			var checked_nodes_str =	StellTree.getAllChecked();
			if(checked_nodes_str != "") {			
				var checked_nodes = checked_nodes_str.split(",");
				
				for(var i=0; i<checked_nodes.length; i++) {
					var vStext = StellTree.getItemText(checked_nodes[i]);
					
					var vStellInfo = {};
					vStellInfo.Stell = checked_nodes[i];
					vStellInfo.Stext = vStext.replace("&amp;", "&");
					vStellInfo.Otype = StellTree.getUserData(checked_nodes[i],"Otype");
					
					vSelectedStell.push(vStellInfo);
				}
			} else {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_STELL"));
				return;
			}
		//검색한 후 선택한 경우
		} else if(TABID == "1") {
			var oTable = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
			var vContexts = oTable.getSelectedContexts(true);
			
			if(vContexts && vContexts.length) {
				for(var i=0; i<vContexts.length; i++) {
					var vStellInfo = {};
					vStellInfo.Stell = vContexts[i].getProperty("Stell");
					vStellInfo.Stext = vContexts[i].getProperty("Stext");
					
					vSelectedStell.push(vStellInfo);
				}				
			} else {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_STELL"));
				return;
			}
		}
		
		if(zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlType == "MultiInput") {
			var oMultiInput = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlId);
			if(oMultiInput) {
				oMultiInput.removeAllTokens();
				for(var i=0; i<vSelectedStell.length; i++) {
					oMultiInput.addToken(new sap.m.Token({
						key : vSelectedStell[i].Stell,
						text : vSelectedStell[i].Stext,
						customData :  new sap.ui.core.CustomData({
				        	key : "Otype",
				        	value : vSelectedStell[i].Otype
				        })
					}));
				}
			}
		} else if(zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlType == "Input") {
			var oInput = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlId);
			if(oInput) {
				if(vSelectedStell && vSelectedStell.length) {
					oInput.setValue(vSelectedStell[0].Stext);
					oInput.removeAllCustomData();
					var vTmp = zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlId.split("_");
					//var vTmpId = vTmp[vTmp.length - 1];
					var vTmpId = zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlId.replace(vTmp[0]+ "_", "");
					common.Common.log("ID : " + vTmpId + ", " + vSelectedStell[0].Stell);
					oInput.addCustomData(new sap.ui.core.CustomData({key : vTmpId, value : vSelectedStell[0].Stell}));
				}
			}
		}
		
		
		//직무검색 Dialog를 Close한다.
		var oDialog = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onBeforeOpenSearchStellDialog : function(oEvent) {
		var oTable = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
		var oStext = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Stext");
		var oIconTabbar = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_ICONTABBAR");
		
		var oDatum = sap.ui.getCore().byId(zui5_hrxx_projectprocess.javascript.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Datum");
		if(zui5_hrxx_projectprocess.javascript.SearchStell.oController._vActda != null) {
			oDatum.setValue(zui5_hrxx_projectprocess.javascript.SearchStell.oController._vActda);
		}
		
		if(zui5_hrxx_projectprocess.javascript.SearchStell.vActionType == "Single") {
			oTable.setMode(sap.m.ListMode.SingleSelectLeft);
		} else {
			oTable.setMode(sap.m.ListMode.MultiSelect );
		}
		oTable.unbindItems();
		oStext.setValue("");
		var sKey = oIconTabbar.getSelectedKey();
		if(sKey != "2")
			oIconTabbar.setSelectedKey("2");
	}
	
};