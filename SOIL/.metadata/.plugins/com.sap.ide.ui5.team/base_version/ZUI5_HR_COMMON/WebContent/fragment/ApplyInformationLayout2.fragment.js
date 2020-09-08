sap.ui.jsfragment("fragment.ApplyInformationLayout2", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ApplyLayout
	*/
	
	createContent : function(oController) {
		jQuery.sap.require("common.ApplyInformation2");
		
		var oImage = new sap.m.Image({
		    src :  "{Image}" ,
		    visible : { path : "Image",
					formatter : function(fVal){
						if(!fVal || fVal == "" ) return false ;
						else return true;
					}
		    }
	 	});
		
	 	var oTextArea = new sap.m.TextArea({
	 		editable : false ,
	 		value : "{Notice}",
	 		growing : true,
	 		width : "100%",
	 		visible : { path : "Notice",
	 					formatter : function(fVal){
	 						if(!fVal || fVal == "" ) return false ;
	 						else return true;
	 					}
	 		}
	 	}).addStyleClass("Font14px FontColor6");

		// 신청안내
		var oNoticePanel = new sap.m.Panel(oController.PAGEID + "_NoticePanel",{
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [
						   new sap.m.Image({
								src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
						   }),
					       new sap.m.Text({text : {
					    	   		path : "Ename",
					    	   		formatter : function(fVal){
										if(oController._vLangu && oController._vLangu == "E") return "Information";
										else return oBundleText.getText("LABEL_1335");	// 1335:신청안내
									}
								}}).addStyleClass("MiddleTitle"),
						   ]
			}).addStyleClass("ToolbarNoBottomLine"),
			content : [ oTextArea , 
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
				        oImage]
		}).setModel(oController._vInfoImage)
		.bindElement("/Data");
		
		
		return oNoticePanel;
	}

});
