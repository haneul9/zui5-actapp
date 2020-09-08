jQuery.sap.declare("plugin.PersonnelStatus");    

sap.ui.core.Control.extend("plugin.PersonnelStatus", {
	
	metadata : {
		properties : {
			pstyp			: {type : "string", defaultValue:""},
			pstyptx			: {type : "string", defaultValue:""},
			pscnt1          : {type : "string", defaultValue:"0"},
			pscnt2      	: {type : "string", defaultValue:"0"},
			excnt1      	: {type : "string", defaultValue:"0"},
			excnt2      	: {type : "string", defaultValue:"0"},
			excnt3      	: {type : "string", defaultValue:"0"},
			excnt4      	: {type : "string", defaultValue:"0"},
			date1			: {type : "string", defaultValue:""},
			date2			: {type : "string", defaultValue:""},
			psdes			: {type : "string", defaultValue:""},
			psico           : {type : "string", defaultValue:""},
			psicocnt		: {type : "string", defaultValue:"0"},
		},
		
		aggregations : {
        },
        
        associations: {
        },
        
        events : {
        }
		
	},
	
	init : function(){
    },
    
    onAfterRendering: function (){
        //called after instance has been rendered (it's in the DOM)
    },
    
    renderer : {
    	 
        render : function(oRm, oControl) {
        	var locale = sap.ui.getCore().getConfiguration().getLocale();
    		if(locale==undefined) {
    			locale =  sap.ui.getCore().getConfiguration().getLanguage();
    		}
    		
    		var oBundle = jQuery.sap.resources({	     		
    			url: "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties",
    			locale: locale
    		});
    		
        	oRm.write("<table class='hcmMssKPIBox hcmMssPrevbox'");
        	if(oControl.getPstyp() == "01") oRm.write(" style='width:140px; max-width: 140px !important; height:150px; max-height: 145px !important;'>");
        	else oRm.write("style='width:85px; max-width: 85px !important; height:60px; max-height: 60px !important;'>");
    		oRm.write("<tr><td>");
    		oRm.write("<table cellpadding='0' cellspacing='0' border='0' style=''>");
    		if(oControl.getPstyp() == "01") oRm.write("<tr style='height:24px; vertical-align:top;'>");
        	else oRm.write("<tr style='height:18px; vertical-align:top;'>");
    		oRm.write("<td>");
    		oRm.write("<label style='direction:inherit;text-align:left' class='hcmMssPrevdescr'>");
    		oRm.write(oControl.getPstyptx());
    		oRm.write("</label>");
    		oRm.write("</td>");
    		oRm.write("</tr>");
    		oRm.write("<tr>");
    		if(oControl.getPstyp() == "01") oRm.write("<td style='height:90px; vertical-align:top;'>");
    		else oRm.write("<td style='height:45px; vertical-align:top;'>");
    			
        	var vColorClass = "";
        	switch(oControl.getPstyp()) {
	        	case "01" :
	        		vColorClass = "hcmMssKPIValueGreen";
	        		break;
	        	case "02" :
	        		vColorClass = "hcmMssKPIValueBlue";
	        		break;
	        	case "03" :
	        		vColorClass = "hcmMssKPIValueRed";
	        		break;
	        	case "04" :
	        		vColorClass = "hcmMssKPIValueYellow";
	        		break;
	        	case "05" :
	        		vColorClass = "hcmMssKPIValueGray";
        	}
        	
    		switch(oControl.getPstyp()) {
        	case "01" :
        		oRm.write("<table cellpadding='0' cellspacing='0' border='0'>");
        		oRm.write("  <tr>");
        		oRm.write("    <td style='width:80px; vertical-align: bottom;'>");
        		oRm.write("      <table cellpadding='0' cellspacing='0' border='0'>");
        		oRm.write("        <tr>");
        		oRm.write("          <td colspan='2' style='text-align:right; padding-right:5px;'>");
        		oRm.write("            <span style='direction:inherit;' class='" + vColorClass + " hcmMssPrevchanged'>");
        		oRm.write(oControl.getPscnt1());
        		oRm.write("            </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='width:63px; height:31px; padding-left:5px; vertical-align: bottom;'>");
        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>");
        		oRm.write(oControl.getPsdes());
        		oRm.write("            </span>");
        		oRm.write("          </td>");
        		oRm.write("          <td style='width:48px; text-align:right; padding-right:10px; vertical-align: bottom;'>");
        		if(oControl.getPsico() != "") {
	    			oRm.write("        <img src='/sap/bc/ui5_ui5/sap/ZHRXX_CHIP/images/" + oControl.getPsico() + ".png' border='0' class='hcmMssImage2'>");
	        		oRm.write("        <span class='hcmMssTrendValue" + oControl.getPsico() + "' style='direction:inherit'>");
	        		oRm.write(oControl.getPsicocnt());
	        		oRm.write("        </span>");
	    		}
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("      </table>");
        		oRm.write("    </td>");
        		oRm.write("    <td style='width:80px;'>");
        		oRm.write("      <table cellpadding='0' cellspacing='0' border='0'>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='width:43px; height:18px; padding-left:5px;'>");
        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>" + oBundle.getText("NAME_EXEC") + "</span>");
        		oRm.write("          </td>");
        		oRm.write("          <td style='width:70px; text-align:right; padding-right:5px;'>");
        		oRm.write("      <span style='direction:inherit; font-size:15px !important;' class='hcmMssKPIValueGray hcmMssPrevchanged'>");
        		oRm.write(oControl.getExcnt1());
        		oRm.write("      </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='height:18px; padding-left:5px;'>");
        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>" + oBundle.getText("NAME_FT") + "</span>");
        		oRm.write("          </td>");
        		oRm.write("          <td style='text-align:right; padding-right:5px;'>");
        		oRm.write("      <span style='direction:inherit; font-size:15px !important;' class='hcmMssKPIValueGray hcmMssPrevchanged'>");
        		oRm.write(oControl.getExcnt2());
        		oRm.write("      </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='height:18px; padding-left:5px;'>");
        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>" + oBundle.getText("NAME_PT") + "</span>");
        		oRm.write("          </td>");
        		oRm.write("          <td style='text-align:right; padding-right:5px;'>");
        		oRm.write("      <span style='direction:inherit; font-size:15px !important;' class='hcmMssKPIValueGray hcmMssPrevchanged'>");
        		oRm.write(oControl.getExcnt3());
        		oRm.write("      </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='height:18px; padding-left:5px;'>");
        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>" + oBundle.getText("NAME_3RD") + "</span>");
        		oRm.write("          </td>");
        		oRm.write("          <td style='text-align:right; padding-right:5px;'>");
        		oRm.write("      <span style='direction:inherit; font-size:15px !important;' class='hcmMssKPIValueGray hcmMssPrevchanged'>");
        		oRm.write(oControl.getExcnt4());
        		oRm.write("      </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='height:18px'></td><td style=''></td>");
        		oRm.write("        </tr>");
        		oRm.write("      </table>");
        		oRm.write("    </td>");
        		oRm.write("  </tr>");
        		oRm.write("</table>");
        		break;
        	case "02" :
        	case "03" :
        	case "04" :
        		oRm.write("<table cellpadding='0' cellspacing='0' border='0'>");
        		oRm.write("  <tr>");
        		oRm.write("    <td style='width:113px; height:35px; vertical-align: bottom;'>");
        		oRm.write("      <table cellpadding='0' cellspacing='0' border='0'>");
        		oRm.write("        <tr>");
        		oRm.write("          <td colspan='2' style='text-align:right; width:100px;'>");
        		oRm.write("            <span style='direction:inherit;' class='" + vColorClass + " hcmMssPrevchanged'>");
//        		oRm.write(oControl.getPscnt1());
        		oRm.write("333");
        		oRm.write("            </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("        <tr>");
//        		oRm.write("          <td style='width:100px; height:20px; padding-left:5px; vertical-align: top;'>");
//        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>");
////        		oRm.write(oControl.getPsdes());
//        		oRm.write("123123123");
//        		oRm.write("            </span>");
//        		oRm.write("          </td>");
//        		oRm.write("          <td style='width:48px; text-align:right; vertical-align: bottom;'>");
//        		if(oControl.getPsico() != "") {
//	    			oRm.write("        <img src='/sap/bc/ui5_ui5/sap/ZHRXX_CHIP/images/" + oControl.getPsico() + ".png' border='0' class='hcmMssImage2'>");
//	        		oRm.write("        <span class='hcmMssTrendValue" + oControl.getPsico() + "' style='direction:inherit'>");
//	        		oRm.write(oControl.getPsicocnt());
//	        		oRm.write("        </span>");
//	    		}
//        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("      </table>");
        		oRm.write("    </td>");
        		oRm.write("  </tr>");
        		oRm.write("</table>");
        		break;

        	case "05" :
        		oRm.write("<table cellpadding='0' cellspacing='0' border='0'>");
        		oRm.write("  <tr>");
        		oRm.write("    <td style='width:113px; height:45px; vertical-align: bottom;'>");
        		oRm.write("      <table cellpadding='0' cellspacing='0' border='0'>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='width:43px; height:15px; padding-left:5px;'>");
        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>LTA</span>");
        		oRm.write("          </td>");
        		oRm.write("          <td style='width:100px; text-align:right; '>");
        		oRm.write("            <span style='direction:inherit;' class='" + vColorClass + " hcmMssPrevchanged'>");
        		oRm.write(oControl.getExcnt1());
        		oRm.write("            </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='width:43px; height:15px; padding-left:5px;'>");
        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>STA</span>");
        		oRm.write("          </td>");
        		oRm.write("          <td style='width:100px; text-align:right; '>");
        		oRm.write("            <span style='direction:inherit;' class='" + vColorClass + " hcmMssPrevchanged'>");
        		oRm.write(oControl.getExcnt2());
        		oRm.write("            </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("        <tr>");
        		oRm.write("          <td style='width:43px; height:15px; padding-left:5px;'>");
        		oRm.write("            <span style='direction:inherit;' class='hcmMssPrevsubbox2'>IN</span>");
        		oRm.write("          </td>");
        		oRm.write("          <td style='width:100px; text-align:right; '>");
        		oRm.write("            <span style='direction:inherit;' class='" + vColorClass + " hcmMssPrevchanged'>");
        		oRm.write(oControl.getExcnt3());
        		oRm.write("            </span>");
        		oRm.write("          </td>");
        		oRm.write("        </tr>");
        		oRm.write("      </table>");
        		oRm.write("    </td>");
        		oRm.write("  </tr>");
        		oRm.write("</table>");
        		break;

            default :
        	}
        	
    		oRm.write("</td>");
    		oRm.write("</tr>");
    		oRm.write("</table>");
    		oRm.write("</td></tr>");
    		oRm.write("</table>");

        	
        }
    }
	
});

plugin.PersonnelStatus.prototype.onclick = function(oBrowserEvent) {    
}; 

plugin.PersonnelStatus.prototype.exit = function () {
};