jQuery.sap.declare("control.MessageStrip");

control.MessageStrip = {
	setText : function(type, iconPath, text ){
		
		var oIcon = new sap.ui.core.Icon({
			size : "1.1rem",
			src : iconPath,
			color : {
				path : type,
				formatter : function(fVal){
					if(fVal == "Error") return "#ee0000";
					else if(fVal == "Warning") return "#ee0000";
					else if(fVal == "Information") return "#ee0000";
				}
			}
		});
		
		if(color == "" ){
			
		}
		
		
		var oToolbar = new sap.m.Toolbar({
			height : "20px",
			content : [
				new sap.m.ToolbarSpacer({
					width : "10px"
				}),

//				new sap.m.Text({
//					text : 
//					maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_DOM_SRV", "BusitripDomAppl", "Zbigo"),
//				}).addStyleClass("Font14px FontColor6 PaddingRight10px"),
			]
		});
		
		
		return sap.m.MessageBox.error(ErrorMessage,{title : "오류"});
	},
}
