/**
 * L2PDataSet
 * 
 * @memberOf control.L2PDataSet
 * 
 * Create Date : 2015. 03. 27
 * Version : 1.0
 */

   jQuery.sap.declare("control.L2PEmpBasic");
    
   sap.ui.core.Control.extend("control.L2PEmpBasic", {
    	/*
    	 * @memberOf control.L2PEmpBasic
    	 */
    	metadata : {
    		properties : {
    			 empData              : {type : "any"},
    			 labels               : {type : "any[]"},
    			 mobile               : {type : "boolean", defaultValue : false},
                 width                : {type : "sap.ui.core.CSSSize", defaultValue : "100%"},
    		},
    		aggregations : {
            },
            
            associations: {
            },
            
            events : {
            	select : {},
            }
    		
    	},
    	
    	init : function(){

        },
        
        onBeforeRendering : function() {
        	
        },
        
        onAfterRendering: function () {        	
        	
        },
        
        renderer : {
        	 
            render : function(oRm, oControl) {
            	var vEmpData = oControl.getEmpData();
            	var vLabels = oControl.getLabels();
            	
            	oRm.write("<div ");
                oRm.writeControlData(oControl);
                oRm.addStyle("width", oControl.getWidth());
                oRm.write(">");
                
                oRm.write("<div class='ep-user-detail-info1'>");
                oRm.write("<table class='pe-photo-box1'>");
                oRm.write("	<tr>");
                oRm.write("		<td class='pe-td-photo-set' rowspan='2'><div class='pe-photo'><img src='" + vEmpData.Ephotourl + "' alt='' style='width:100%; height:100%' /></div></td>");
                oRm.write("		<td class='pe-td-name'><div class='pe-top-txt-name'>" + vEmpData.Head1 + "</div></td>");
                oRm.write("	</tr>");
                oRm.write("	<tr>");
                oRm.write("		<td>");
                oRm.write("			<table cellpadding='0' cellspacing='0' border='0' width='100%'><tr><td class='pe-td-width1'>");
                oRm.write("				<ul style='text-align:right'>");
                oRm.write("					<li>사번 :</li>");
                oRm.write("					<li>부서 :</li>");
                oRm.write("					<li>직급 :</li>");
                oRm.write("					<li>직책 :</li>");
                oRm.write("					<li>직무 :</li>");
                oRm.write("				</ul>");
                oRm.write("				<ul class='pe-txt-upda1'>");
                oRm.write("					<li title='사번 : " + vEmpData.Pernr + "'>" + vEmpData.Pernr + "</li>");
                oRm.write("					<li title='부서 : " + vEmpData.Line1 + "'>" + vEmpData.Line1 + "</li>");
                oRm.write("					<li title='직급 : " + vEmpData.Line2 + "'>" + vEmpData.Line2 + "</li>");
                oRm.write("					<li title='직책 : " + vEmpData.Line3 + "'>" + vEmpData.Line3 + "</li>");
                oRm.write("					<li title='직무 : " + vEmpData.Line4 + "'>" + vEmpData.Line4 + "</li>");
                oRm.write("				</ul>");
                oRm.write("			</td><td class='pe-td-width2'");
                if(oControl.getMobile()) oRm.write(" style='display:none'");
                oRm.write(" id='" + oControl.getId() + "-inner-Date" + "'>");
                oRm.write("				<ul style='text-align:right'>");
                oRm.write("					<li></li>");
                oRm.write("					<li>" + vLabels[0].label + " :</li>");
                oRm.write("					<li>" + vLabels[1].label + " :</li>");
                oRm.write("					<li>" + vLabels[2].label + " :</li>");
                oRm.write("					<li>" + vLabels[3].label + " :</li>");
                oRm.write("				</ul>");
                oRm.write("				<ul class='pe-txt-upda1'>");
                oRm.write("					<li title=''></li>");
                oRm.write("					<li title='" + vEmpData.Datt1 + "'>" + vEmpData.Datt1 + "</li>");
                oRm.write("					<li title='" + vEmpData.Datt2 + "'>" + vEmpData.Datt2 + "</li>");
                oRm.write("					<li title='" + vEmpData.Datt3 + "'>" + vEmpData.Datt3 + "</li>");
                oRm.write("					<li title='" + vEmpData.Datt4 + "'>" + vEmpData.Datt4 + "</li>");
                oRm.write("				</ul>");
                oRm.write("			</td></tr></table>");
                oRm.write("		</td>");
                oRm.write("	</tr>");
                oRm.write("</table>");
                oRm.write("</div>");
                oRm.write("</div>");
            	
            }
        },
        
        
    });
    
    control.L2PEmpBasic.prototype.exit = function () {
        
    };