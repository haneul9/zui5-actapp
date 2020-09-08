    jQuery.sap.declare("control.PersonInfo");
    
    sap.ui.core.Control.extend("control.PersonInfo", {
    	
    	metadata : {
    		properties : {
    			backgroundColor      : {type : "sap.ui.core.CSSColor", defaultValue : "#FFFFFF"},
    			picUrl               : {type : "string", defaultValue : ""},
    			ename                : {type : "string", defaultValue : ""},
    			chnam                : {type : "string", defaultValue : ""},
    			engnam                : {type : "string", defaultValue : ""},
    			
    			stat2t                : {type : "string", defaultValue : ""},
    			zentdt                : {type : "string", defaultValue : ""},
    			
    			orgtx                 : {type : "string", defaultValue : ""},
    			dat01                : {type : "string", defaultValue : ""},
    			
    			jikgNm                 : {type : "string", defaultValue : ""},
    			dat02                : {type : "string", defaultValue : ""},
    			
    			jikcNm                 : {type : "string", defaultValue : ""},
    			dat03                : {type : "string", defaultValue : ""},
    			
    			regno                 : {type : "string", defaultValue : ""},
    			gbdat                : {type : "string", defaultValue : ""},
    			birtx                : {type : "string", defaultValue : ""},
    			
    			fatxt                 : {type : "string", defaultValue : ""},
    			famdt                : {type : "string", defaultValue : ""},
    			
    			sltxt                 : {type : "string", defaultValue : ""},
    			graNm                : {type : "string", defaultValue : ""},
    			hakNm                 : {type : "string", defaultValue : ""},
    			frtxt                : {type : "string", defaultValue : ""},
    			
    			mancnt                 : {type : "string", defaultValue : ""},
    			womcnt                : {type : "string", defaultValue : ""},
    			
    			comtel                 : {type : "string", defaultValue : ""},
    			mobile                : {type : "string", defaultValue : ""},
    			
    			addr                : {type : "string", defaultValue : ""},
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
        
        UrlExists : function(url)
        {
        	var http = null;
        	var r_code = 0;
        	try {
        		http = new XMLHttpRequest();
    	        http.open('HEAD', url, false);
    	        http.send();
    	        r_code = http.status;
        	} catch(ex) {
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
            	oRm.write(">");
            	 
            	oRm.write("<table style='background-color:#F9F9F9; dispaly:table; color: #000000;padding-top:5px;padding-bottom:5px' >");
    			oRm.write("<tr>");
    				oRm.write("<td align='center' rowSpan='10' style='width:120px; vertical-align:top;'>");
    					oRm.write("<img src='" + vImage + "' style='width:110px; height:140px'>");
    					oRm.write("<div class='L2Pfont12' style='text-align:center;padding-top:3px'>" + oControl.getEname() + "</div>");
    					oRm.write("<div class='L2Pfont12' style='text-align:center;padding-top:3px'>" + oControl.getChnam() + "</div>");
    					oRm.write("<div class='L2Pfont12' style='text-align:center;padding-top:3px'>" + oControl.getEngnam() + "</div>");
    				oRm.write("</td>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; width:60px;'>????????</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px; width:130px;'>" + oControl.getStat2t() + "</td>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; width:60px;'>?Ի?????</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px; width:140px;'>" + oControl.getZentdt() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>??&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;??</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getOrgtx() + "</td>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>?߷?????</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getDat01() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>??&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;??</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getJikgNm() + "</td>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>?°?????</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getDat02() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>??&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;å</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getJikcNm() + "</td>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>??å????</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getDat03() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>?ֹι?ȣ</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getRegno() + "</td>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>????????</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getGbdat() + " (" + oControl.getBirtx() + ")</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>ȥ?ο???</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getFatxt() + "</td>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>??ȥ????</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getFamdt() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>??&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;??</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px' colSpan='3'>" + oControl.getSltxt() + "&nbsp;&nbsp;" + oControl.getGraNm() + "&nbsp;&nbsp;" + oControl.getHakNm() + "/" + oControl.getFrtxt() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>????????</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px' colSpan='3'>?ڳ? ?? " + oControl.getMancnt() + " ?? " + oControl.getWomcnt() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>??ȭ??ȣ</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getComtel() + "</td>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;'>Mobile</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px'>" + oControl.getMobile() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("<tr>");
    				oRm.write("<td class='L2Pfont12bold' style='text-align:center; color:#000000;vertical-align:top;'>??&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;??</td>");
    				oRm.write("<td class='L2Pfont12' style='text-align:left; padding-left:3px' colSpan='3'>" + oControl.getAddr() + "</td>");
    			oRm.write("</tr>");
    			oRm.write("</table>");
                oRm.write("</div>");
            }
        }
    });
    
    control.PersonInfo.prototype.exit = function () {
        
    };
           