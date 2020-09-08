sap.ui.jsfragment("fragment.ActPersonPopover", {
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
//		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_AP_ListItem", {
//			title: "{Ename}",
//		    description : "{Fulln}",
//		    icon : "{Photo}", 
//		    info : "●",
//		    infoState : {
//		    	path : "Cfmyn",
//		    	formatter : function(fVal) {
//		    		var vRet = "None";
//					if(fVal == "X") vRet = "Success";
//					else if(fVal == "L") vRet = "Error";
//					else if(fVal == "E") vRet = "Error";
//					return vRet;  
//		    	}
//		    },
//		    iconDensityAware : false,
//		    iconInset : false,
//		});
		
//		var oCustomListItem = new sap.m.CustomListItem(oController.PAGEID + "_AP_ListItem", {
//			content : new sap.m.Toolbar({
//				height : "50px",
//				design : sap.m.ToolbarDesign.Auto,
//				content : [new sap.m.ToolbarSpacer({width : "10px"}),
//				           new sap.m.Label({text : "{Ename}"}).addStyleClass("L2P13Font"),
//				           new sap.m.ToolbarSpacer(),
//				           new sap.ui.core.Icon({
//				        	   src : {path : "Cfmyn", formatter : function(fVal) {
//									var vRet = "";
//									if(fVal == "X") vRet = "sap-icon://status-positive";
//									else if(fVal == "L") vRet = "sap-icon://locked";
//									else if(fVal == "E") vRet = "sap-icon://decline";
//									return vRet; 
//								}},
//								visible : {path : "Cfmyn", formatter : function(fVal) {
//									var vRet = false;
//									if(fVal == "X") vRet = true;
//									else if(fVal == "L") vRet = true;
//									else if(fVal == "E") vRet = true;
//									return vRet;  
//								}},
//								tooltip : {path : "Cfmyn", formatter : function(fVal) {
//									var vRet = "";
//									if(fVal == "X") vRet = oBundleText.getText("STATUSC");
//									else if(fVal == "L") vRet = oBundleText.getText("STATUSE");
//									else if(fVal == "E") vRet = oBundleText.getText("STATUSL");
//									return vRet;  
//								}},
//								size : "1.0rem", 
//								color : {path : "Cfmyn", formatter : function(fVal) {
//									var vRet = "#FFFFFF";
//									if(fVal == "X") vRet = "green";
//									else if(fVal == "L") vRet = "orange";
//									else if(fVal == "E") vRet = "red";
//									return vRet; 
//								}}}),
//							new sap.m.ToolbarSpacer({width : "10px"}),
//				]
//			}).addStyleClass("L2PToolbarNoBottomLine")
//		});
		
		var oList = new sap.m.List(oController.PAGEID + "_AP_List",{
			items : {
				path : "/ActionEmpSummaryListSet",
				template  : 
					new sap.m.StandardListItem(oController.PAGEID + "_AP_ListItem",{
						icon : "{Photo}",
						iconDensityAware : false,
						iconInset : false,
						title : {
							parts : [{path : "Ename"}, {path : "Perid"}], 
							formatter : function(fVal1, fVal2) {
								if(fVal1 != null && fVal2 != null) return fVal1 + " (" + fVal2 + ")";
								else return "";
							}},
						description : "{Zzjikgbt}" + " / " + "{Zzjiktlt}" + "," + "{Orgtx}" 
					})
			}
		});
		oList.setModel(sap.ui.getCore().getModel("ZL2P01GW0001_SRV"));
		
		var oPopover = new sap.m.Popover(oController.PAGEID + "_AP_Popover", {
			title : oBundleText.getText("TITLE_ACT_PERSONS"),
			placement : sap.m.PlacementType.Auto,
			content : oList,
			contentWidth : "300px",
			beforeOpen : oController.onBeforeOpenPopoverActPerson,
			endButton : new sap.m.Button({
							icon : "sap-icon://sys-cancel-2",
							press : function(oEvent) {
								oEvent.getSource().getParent().getParent().close();
							}})
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
	    };

		return oPopover;
	}

});
