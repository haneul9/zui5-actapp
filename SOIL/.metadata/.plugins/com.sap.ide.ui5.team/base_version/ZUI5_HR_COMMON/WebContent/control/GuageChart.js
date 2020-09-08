/**
 * ?Ϲ????? ?????? ?????? ǥ???ϴ? Name Card
 * 
 * Create Date : 2014. 05. 08
 * Version : 1.0
 */

    jQuery.sap.declare("control.GuageChart");
    
    jQuery.sap.require("sap.ui.commons.Image"); 
    
    sap.ui.core.Control.extend("control.GuageChart", {
    	
    	_Domid : "",
    	_GuageValue : 0,
    	
    	metadata : {
    		properties : {
    			 id            : {type : "string"},
    			 guagevalue    : {type : "string", defaultValue : "0"},
                 width           : {type : "sap.ui.core.CSSSize", defaultValue : "90px"},
                 height          : {type : "sap.ui.core.CSSSize", defaultValue : "38px"},
                 visible       : {type : "boolean", defaultValue : true}
    		},
    		aggregations : {
    			guageChart     : {type : "JustGage", multiple : false, visibility: "public"}
            },
            
            associations: {
            },
            
            events : {
            }
    		
    	},
    	
    	init : function(){

        },
        
        onAfterRendering: function () {
        	
        	var oControl = this;
        	
            var _GuageChart = null;

        	_GuageChart = new JustGage({
                id: oControl._Domid, 
            	title: " ",
                value: oControl.getGuagevalue(), 
                min: 0,
                max: 100,
                gaugeWidthScale: 0.8,
                levelColors: ["#ff0000", "#00ff00", "#0000ff"], 
                levelColorsGradient : true,
                startAnimationTime: 2000,
                startAnimationType: ">",
                refreshAnimationTime: 1000,
                refreshAnimationType: "bounce",
            	showMinMax: false           
              });
        	
        	oControl.setGuageChart(_GuageChart);
        },
        
        renderer : {
        	 
            render : function(oRm, oControl) {
            	
            	oControl._Domid = oControl.getId();
            	if(!oControl._Domid || oControl._Domid == "") {
            		oControl._Domid = "_l2p_guage_chart_" + new Date().getTime();
            	}
            	
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addStyle("width", oControl.getWidth());
                oRm.addStyle("height", oControl.getHeight());
                oRm.writeStyles();
                oRm.write(">");
                
                oRm.write("</div>");
            } 
        },
        
        refresh : function(sVal) {
        	if(sVal) {
        		this.setProperty("guagevalue", sVal, /*suppressInvalidate*/ true);     //do not re-render
        	}
        }
    	
    });
    
  //overwrite setter
    control.GuageChart.prototype.setVisible = function (sVal) {
    	this.setProperty("visible", sVal, /*suppressInvalidate*/ true);
    };
    
    control.GuageChart.prototype.setVisible = function (sVal) {
    	this.setProperty("guagevalue", parseInt(sVal), /*suppressInvalidate*/ true);
    };
    
    control.GuageChart.prototype.exit = function () {
        
    };
           