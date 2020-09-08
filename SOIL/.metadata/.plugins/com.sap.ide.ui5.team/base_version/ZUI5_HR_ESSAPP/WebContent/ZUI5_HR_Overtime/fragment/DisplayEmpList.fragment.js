sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.DisplayEmpList", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oList = new sap.m.List({
			items : {
				path : "/Data",
				template  : new sap.m.StandardListItem({
					icon : "{Photo}",
					iconDensityAware : false,
					iconInset : false,
					title : {
						parts : [{path : "Ename"}, {path : "Perid"}], 
						formatter : function(fVal1, fVal2) {
							if(fVal1 != null && fVal2 != null) return fVal1 + " (" + fVal2 + ")";
							else return "";
						}},
					description : "{Zzjikgbtx}" + " / " + "{Zzjiktltx}" + ", " + "{Orgtx}"
				})  // 직군 / 직급, 부서
			}
		});
		
		/////////////////////////////////////////////////////////////////////////////////////////////////		
		var oPopover = new sap.m.Popover(oController.PAGEID + "_EmpListPopover", {
			content :[oList] ,
			contentWidth : "350px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0111"),	// 111:대상자
			placement : "Right",
			beforeOpen : oController.beforeOpenPopover,
			endButton : new sap.m.Button({icon :"sap-icon://decline", press : function(oEvent){oPopover.close();}})
		});
		
		
		oPopover.addStyleClass("sapUiSizeCompact");
		

		return oPopover;
	}

});
