    jQuery.sap.declare("control.HorizontalStackChart");
    
//    jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/horiprogress.css");
    
    jQuery.sap.require("sap.ui.core.Control");
      
    sap.ui.core.Control.extend("control.HorizontalStackChart", {
    	/**
    	 * @MemberOf control.HorizontalStackChart
    	 */
    	
    	metadata : {
    		properties : {
    			color    : {type : "string"},
    			min: {type : "int", defaultValue : 0},
    			max: {type : "int", defaultValue : 100},
    			label  : {type : "string"},
    			label2  : {type : "string"},
	   			bgColor: {type : "sap.ui.core.CSSColor", defaultValue : "#FFFFFF"},
				barColor: {type : "sap.ui.core.CSSColor", defaultValue : "#2E8AE8"},
    			width           : {type : "sap.ui.core.CSSSize", defaultValue : "100%"},
    			height          : {type : "sap.ui.core.CSSSize", defaultValue : "100%"}
    		},
    		aggregations : {
    		},
            
            associations: {
            },
            
            events : {            	
            }
    		
    	},
    	
    	init : function(){
//    		sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.resizeView, this);
//    		sap.ui.getCore().getEventBus().subscribe("HelpWindow", "onPresscollapseIcon", this.onPresscollapseIcon, this);
        },
    	
        onAfterRendering: function () {
        },
        
        renderer : {
        	
            render : function(oRm, oControl) {
            	
            	//jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE_LIST/css/progress-bars.less");
            	oRm.write("<div ");
            	oRm.writeControlData(oControl);
//            	oRm.addClass("L2PWindowContainer");
            	oRm.writeClasses();
            	oRm.addStyle("width", oControl.getWidth());
            	oRm.addStyle("height", oControl.getHeight());
                oRm.writeStyles();            	
            	oRm.write(">");
            	
            	
            	oRm.write("<div style='width:100%'>");
            	oRm.write("<span class='L2PLabelBegin'>" + oControl.getLabel() + "</span>");
            	oRm.write("<span class='L2PLabelEnd'>" + oControl.getLabel2() +"</span>");
            	 
            	oRm.write("<div class='L2PProgressBase'");
//                oRm.addStyle("width", oControl.getWidth());
            	oRm.addStyle("width", "100%");
                oRm.addStyle("height", "15px");
                oRm.addStyle("background-color", oControl.getBgColor());
                oRm.writeStyles();
                oRm.write(">");
 
                
                oRm.write("<div class='L2PProgressBar ");
                oRm.write("' ");
                var max = parseFloat(oControl.getMax());
                var min = parseFloat(oControl.getMin());
                var p = min / max * 100;
                
                oRm.write("<div class='L2PProgressBar ");
                oRm.write("' ");
                oRm.addStyle("width", p + "%");
                oRm.addStyle("height", "15px");
                oRm.addStyle("background-color", oControl.getBarColor());
                oRm.writeStyles();
                oRm.write(">"); 
                oRm.write("</div>"); 
                oRm.write("</div>"); 
            	
            }
        },
      
    });
    
    control.HorizontalStackChart.prototype.exit = function () {
        
    };

           