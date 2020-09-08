    jQuery.sap.declare("control.VerticalStackChart");
    
    jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/vertiprogress.css");
    
    jQuery.sap.require("sap.ui.core.Control");
      
    sap.ui.core.Control.extend("control.VerticalStackChart", {
    	/**
    	 * @MemberOf control.VerticalStackChart
    	 */
    	
    	metadata : {
    		properties : {
    			contexts  : {type : "any[]"},
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
            	var vData = oControl.getContexts();
            	
            	oRm.write("<div ");
            	oRm.writeControlData(oControl);
            	oRm.writeClasses();
            	
            	oRm.addStyle("padding-left", "8px");	// 그래프 4개로 수정해서 간격 조정
            	oRm.addStyle("width", oControl.getWidth());
            	oRm.addStyle("height", oControl.getHeight());
            	oRm.writeStyles();            	
            	oRm.write(">");
            	
            	oRm.write("<div ");                  //progress-bar
            	oRm.addStyle("float", "left");
            	oRm.addStyle("height", "100px");
            	oRm.addStyle("width", vData[0].width);
            	oRm.writeStyles();            	
            	oRm.write(">");
            	
            	oRm.write("<div ");                  // progress-track
            	oRm.addStyle("position", "relative");
            	oRm.addStyle("width", vData[0].width);
            	oRm.addStyle("height", "100%");
            	oRm.writeStyles();            	
            	oRm.write(">");
            	
            	oRm.write("<div class='L2PTooltip'");                  // progress-fill
            	//oRm.write("<div");                  // progress-fill
            	oRm.addStyle("position", "relative");
            	oRm.addStyle("background", vData[0].color);
            	oRm.addStyle("height", vData[0].vHeight);
            	oRm.addStyle("top", vData[0].top);
            	oRm.addStyle("width", vData[0].width);
            	
            	oRm.writeStyles();            	
            	oRm.write(">");
            	if( vData[0].vHeight == "3%") oRm.write("<span class='tooltiptextVal0'>" + vData[0].label + "</span>" );
            	else oRm.write("<span class='tooltiptext'>" + vData[0].label + "</span>" );
            	oRm.write("</div>"); 
            	oRm.write("</div>"); 
            	oRm.write("</div>"); 
            	
        	    for(var i = 1; i <vData.length ; i++){
//                	oRm.write("<div ");                  //progress-bar
        	    	oRm.write("<div class='L2PTooltip'"); 
                	oRm.addStyle("float", "left");
                	oRm.addStyle("height", "100px");
                	oRm.addStyle("width", vData[i].width);
                	oRm.addStyle("margin-left", "5px");
                	oRm.addStyle("padding-left", "5px");
                	oRm.writeStyles();            	
                	oRm.write(">");
                	
                	oRm.write("<div ");                  // progress-track
//                	oRm.write("<div class='L2PTooltip'"); 
                	oRm.addStyle("position", "relative");
                	oRm.addStyle("width", vData[i].width);
                	oRm.addStyle("height", "100%");
                	oRm.writeStyles();            	
                	oRm.write(">");
                	
                	oRm.write("<div ");                  // progress-fill
//                	oRm.write("<div class='L2PTooltip'");                  // progress-fill
                	oRm.addStyle("position", "relative");
                	oRm.addStyle("background", vData[i].color);
                	oRm.addStyle("height", vData[i].vHeight);
                	oRm.addStyle("top", vData[i].top);
                	oRm.addStyle("width", vData[i].width);
                	
                	
                	
                	oRm.writeStyles();            	
                	oRm.write(">");
//                	if(i < 3){
//                		if( vData[i].vHeight == "3%") oRm.write("<span class='tooltiptextVal0'>" + vData[i].label + "</span>" );
//                    	else oRm.write("<span class='tooltiptext'>" + vData[i].label + "</span>" );
//                	}
//                	else {
//                		if( vData[i].vHeight == "3%") oRm.write("<span class='tooltiptextLeftVal0'>" + vData[i].label + "</span>" );
//                		else oRm.write("<span class='tooltiptextLeft'>" + vData[i].label + "</span>" ); 
//                	}
                	
                	if(i < 2){
                		if( vData[i].vHeight == "3%") oRm.write("<span class='tooltiptextVal0'>" + vData[i].label + "</span>" );
                    	else oRm.write("<span class='tooltiptext'>" + vData[i].label + "</span>" );
                	}
                	else {
//                		if( vData[i].vHeight == "3%") oRm.write("<span class='tooltiptextLeftVal0'>" + vData[i].label + "</span>" );
                		if( parseFloat(vData[i].vHeight) <= 50 ) oRm.write("<span class='tooltiptextLeftVal0'>" + vData[i].label + "</span>" );
                		else oRm.write("<span class='tooltiptextLeft'>" + vData[i].label + "</span>" ); 
                	}
                	
                	oRm.write("</div>"); 
                	oRm.write("</div>"); 
                	oRm.write("</div>"); 
        	    }
            	oRm.write("</div>"); 
            	
            }
        },
      
    });
    
    control.VerticalStackChart.prototype.exit = function () {
        
    };

           