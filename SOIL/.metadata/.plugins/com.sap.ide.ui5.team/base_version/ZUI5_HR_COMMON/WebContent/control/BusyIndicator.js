/**
 * CapaPersonCard
 * 
 * Create Date : 2015. 04. 14
 * Version : 1.0
 */

    jQuery.sap.declare("control.BusyIndicator");    
    
    sap.ui.core.Control.extend("control.BusyIndicator", {			
    	
    	metadata : {
    		properties : {
    			 text            : {type : "string"},
                 width           : {type : "sap.ui.core.CSSSize", defaultValue : "300px"},
                 title           : {type : "string"}
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
            	
            	
            	oRm.write("<div style='background : white !important; height : 170px; margin : 0px; padding : 0px;'");
                oRm.writeControlData(oControl); 
                oRm.addStyle("width", oControl.getWidth());
                oRm.writeStyles();
                oRm.write(">");
                
                oRm.write("<table style='width : 100%;'>");
//                oRm.write("<tr>");
//                oRm.write("<td style='width : 100%; text-align : center;'>");
//                oRm.write("<span style='color : black; font-family : Nanum Gothic; font-weight : bold; font-size : 20px;'>");
//                oRm.write(oControl.getTitle());
//                oRm.write("</span>");
//                oRm.write("</td>");
//                oRm.write("</tr>");
                oRm.write("<tr>");
                oRm.write("<td style='text-align : center;'>");
                oRm.write("<image src='/sap/bc/ui5_ui5/sap/ZNKCOMMON_UI5/images/loading.gif' style='width:100%; height:100%'>");
                oRm.write("</td>");
                oRm.write("</tr>");
                oRm.write("<tr style='height : 15px;'>");
                oRm.write("</tr>");
                oRm.write("<tr>");
                oRm.write("<td style='text-align : center !important;'>");
                oRm.write("<span style='font-weight : bold; font-family : Nanum Gothic; font-weight : bold; font-size : 15px;'>");
                oRm.write(oControl.getText());
                oRm.write("</span>");
                oRm.write("</td>");
                oRm.write("</tr>");
                oRm.write("</table>");
                oRm.write("</div>");
            }
        }
    	
    });
    
    control.BusyIndicator.prototype.exit = function () {
        
    };
           
    
    