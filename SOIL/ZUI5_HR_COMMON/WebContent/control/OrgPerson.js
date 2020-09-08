    jQuery.sap.declare("control.OrgPerson");
    
    sap.ui.core.Control.extend("control.OrgPerson", {
    	
    	metadata : {
    		properties : {
    			title                : {type : "string"},
    			sabun                : {type : "string"},
    			name                 : {type : "string"},
    			picUrl               : {type : "string"},
    			chief				 : {type : "string", defaultValue : ""},
                width                : {type : "sap.ui.core.CSSSize", defaultValue : "120px"},
    		},
    		aggregations : {
            },
            
            associations: {
            },
            
            events : {
            	press : {}
            }
    		
    	},
    	
    	init : function(){
            

        },
        
        onAfterRendering: function (){
            //called after instance has been rendered (it's in the DOM)
        },
        
        UrlExists : function(url)
        {
        	var http = null;
        	var r_code = 0;
        	try {
        		http = new XMLHttpRequest();
        		http.setRequestHeader('X-Custom-Header', 'pingpong');    // Ŀ???? ???? ????
        		http.setRequestHeader('Content-Type', 'image/jpeg');
    	        http.open('HEAD', url, false);
    	        http.send();
    	        r_code = http.status;
        	} catch(ex) {
        		console.log(ex);
        		r_code = 404;
        	}
        	return r_code;
        },
        
        renderer : {
        	 
            render : function(oRm, oControl) {
            	var vImage = oControl.getPicUrl();
//            	if($.browser.msie) {
//            		var rCode = oControl.UrlExists(vImage);
//                	if(rCode == 404) {
//                		vImage = "/sap/bc/ui5_ui5/sap/Z_HR_CHIPPOOL/images/no_image.png";
//                	}
//            	}
            	
            	oRm.write("<div ");
            	oRm.writeControlData(oControl);
            	oRm.addStyle("width", oControl.getWidth());
            	oRm.writeStyles();
            	if(oControl.getChief() == "X") {
            		oRm.addClass("L2POrgChartChief");
            	} else {
            		oRm.addClass("L2POrgChartPerson");
            	} 
            	oRm.writeClasses();
            	oRm.write(">");
            	 
                oRm.write("<table align='center' style='width:100%' ");
                oRm.write(">");
                oRm.write("<tr>");
                oRm.write("<td style='padding-left:3px; padding-top:3px; color:blue'>" + oControl.getTitle() + "</td>");
                oRm.write("</tr>");
                
                oRm.write("<tr>");
                oRm.write("<td align=center><div><img class='L2POrgChartImage' src='"  + vImage + "'></div></td>");
                oRm.write("</tr>");
                
                oRm.write("<tr>");
                oRm.write("<td style='padding-left:3px; font-size:13px'>???? : " + oControl.getSabun() + "</td>");
                oRm.write("</tr>");
                
                oRm.write("<tr>");
                oRm.write("<td style='padding-left:3px; padding-bottom:3px; font-size:13px'>???? : " + oControl.getName() + "</td>");
                oRm.write("</tr>");
               
                oRm.write("</table>");
                oRm.write("</div>");
            }
        }
    });
    
    control.OrgPerson.M_EVENTS={'press':'press'};
    
    /**
     * Function is called when button is clicked. 
     */
    control.OrgPerson.prototype.onclick = function(oBrowserEvent) {
      //if (this.getEnabled()) {
        this.firePress({id:this.getId()});
      //}
    }; 
    
    control.OrgPerson.prototype.exit = function () {
        
    };
           