    jQuery.sap.declare("control.ReortType1");
    
    jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/z_hr_ui5/css/L2PList.css");
    jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/z_hr_ui5/css/jquery.jscrollpane.css");
    
    sap.ui.localResources("plugin");
	
	jQuery.sap.require("plugin.jquery_jscrollpane_min");
	jQuery.sap.require("plugin.jquery_mousewheel");
    
    
    jQuery.sap.require("sap.ui.core.format.DateFormat");
    
    sap.ui.core.Control.extend("control.ReportType1", {
    	
    	/**
    	 * @MemberOf control.ReportType1
    	 */
    	
    	_columnCount : 0,
    	_startTop : 10,
    	_eventCount : 0,
    	_oModel : null,
    	_vList : [],
    	_vItemWidths : [],
    	
    	
    	metadata : {
    		properties : {
    			modelName       : {type : "string", defaultValue : ""},
    			path            : {type : "string", defaultValue : ""},
    			headers         : {type : "string[]"},
    			items           : {type : "string[]"},
    			itemWidths      : {type : "string[]"},
    			
    			grouping        : {type : "boolean", defaultValue : false},
    			groupIndex      : {type : "int", defaultValue : 0},
    			
    			headerHeight    : {type : "int", defaultValue : 35},
    			dataHeight      : {type : "int", defaultValue : 35},
    			
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
    		sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.resizeView, this);
    		console.log("[control.ReportType1] init");
        },
    	
        onAfterRendering: function () {
        	var oControl = this;
        	
        	setTimeout(function(){
        		oControl.resizeView();}, 100);
        	
        	console.log("[control.ReportType1] onAfterRendering");
        },
        
        getData : function(oControl) {
        	oControl._oModel = sap.ui.getCore().getModel(this.getModelName());
        	oControl._vList = [];
        	if(oControl.getPath() != "") {
        		if(oControl._oModel) {
            		oControl._oModel.read(
            				oControl.getPath(),
            				null, 
        					null, 
        					false, 
        					function(oData, oResponse) {
        						var i;
        						if(oData && oData.results.length) {
        							for(i=0; i<oData.results.length; i++) {
        								oControl._vList.push(oData.results[i]);
        							}
        						}
        					},
        					function(oResponse) {
        						console.log(oResponse);
        					}
            		);
            	}
        	}
        	
        	console.log("[control.ReportType1] getData");
        	
        },
        
        renderer : {
        	
            render : function(oRm, oControl) {
            	
            	if(!oControl.getHeaders()) {
            		throw "[control.ReportType1] ????Ʈ?? Header ?????? ?????ϴ?.";
            		return;
            	}
            	
            	if(!oControl.getItems()) {
            		throw "[control.ReportType1] ????Ʈ?? Item ?????? ?????ϴ?.";
            		return;
            	}
            	
            	if(!oControl.getItemWidths()) {
            		throw "[control.ReportType1] ????Ʈ?? Item?? Width ?????? ?????ϴ?.";
            		return;
            	}
            	
            	oControl._columnCount = oControl.getHeaders().length;
            	oControl._vItemWidths = oControl.getItemWidths();
            	
            	oControl.getData(oControl);
            	
//            	if(oControl._vList == false || oControl._vList.length < 1) {
//            		console.log("[control.ReportType1] ????Ʈ?? ?????? ?????Ͱ? ?????ϴ?. Model or Path ?????? Ȯ?? ?ٶ??ϴ?.");
//            	}
            	
            	oRm.write("<div ");
            	oRm.writeControlData(oControl);
            	oRm.addClass("L2PListContainer");
            	oRm.writeClasses();
            	oRm.addStyle("width", oControl.getWidth());
            	oRm.addStyle("height", oControl.getHeight());
                oRm.writeStyles();            	
            	oRm.write(">");
            	
            	var vHtml2 = oControl.createView(oControl);
            	oRm.write(vHtml2);
            	
            	var vHtml3 = oControl.createDataView(oControl);
            	oRm.write(vHtml3);
            	
                oRm.write("</div>");
                
                console.log("[control.ReportType1] renderer");
            }
        },

        createView : function(oControl) {
        	var innerHtml = "";
        	
        	var t_w = oControl.getContainerWidth(oControl);
        	var vHeaders = oControl.getHeaders();
        	
        	//Calendar Header Area
        	innerHtml += "<div ";
        	innerHtml += "class='L2PListHeader' ";
        	innerHtml += "style='";
        	innerHtml += "width:" + (t_w) + "px;";
        	innerHtml += "left: 10px;";
        	innerHtml += "height:" + oControl.getHeaderHeight() + "px;";
        	innerHtml += "top:" + oControl._startTop + "px;";
        	innerHtml += "' >";
        	
            var sum_d_w = 0;
            //Column Header
            for(var i=0; i<oControl._columnCount; i++) {
            	
            	var d_w = oControl.getColumnWidth(t_w, oControl._vItemWidths[i]);
            	
                innerHtml += "<div id='ColumnHeader_" + i + "' ";  
                if(i != (oControl._columnCount - 1))
                	innerHtml += "class='L2PColumnHeader' ";
                else 
                	innerHtml += "class='L2PColumnHeaderLast' ";
                
            	innerHtml += "style='";
            	innerHtml += "width:" + (d_w) + "px;";
            	innerHtml += "top:0px;";
            	innerHtml += "left:" + (sum_d_w) + "px;";
            	innerHtml += "height:" + oControl.getHeaderHeight() + "px;";
            	innerHtml += "line-height:" + oControl.getHeaderHeight() + "px;";
            	innerHtml += "' >";
            	innerHtml += vHeaders[i];
                innerHtml += "</div>";
                
                sum_d_w = sum_d_w + d_w + 1; 
                
            }
            innerHtml += "</div>";
            
            console.log("[control.ReportType1] createView");
            
            return innerHtml;
        },
        
        createDataView : function(oControl) {
        	var innerHtml = "";
        	
        	var t_w = oControl.getContainerWidth(oControl);
        	var t_h = oControl.getCalDataHeight(oControl);
        	
        	var vItems = oControl.getItems();
        	
        	//Calendar Header Area
        	innerHtml += "<div ";
        	innerHtml += "class='L2PListData' ";
        	innerHtml += "style='";
        	innerHtml += "width:" + (t_w) + "px;";
        	innerHtml += "left:10px;";
        	innerHtml += "top:" + (oControl._startTop + oControl.getHeaderHeight() + 2) + "px;";
       		innerHtml += "height: " + t_h + "px;";
        	innerHtml += "' >";
            
        	innerHtml += "<table cellspacing='0' cellpadding='0'>";
        	
        	var groupidx = oControl.getGroupIndex();
        	
        	var old_value = "";
        	var new_value = "";
        	
        	if(oControl._vList != false && oControl._vList.length > 0) {
        		for(var i=0; i<oControl._vList.length; i++) {
            		
    	        	innerHtml += "<tr>";
    	        	
    	        	eval("new_value = oControl._vList[i]."  + vItems[groupidx]);
    	        	
    	            //Day Header
    	            for(var j=0; j<oControl._columnCount; j++) { 
    	            	
    	            	var d_w = oControl.getColumnWidth(t_w, oControl._vItemWidths[j]);	            	
    	            	
    	                innerHtml += "<td><div ";
    	                innerHtml += "id='ListCell-row" + i + "-col" + j + "' ";
    	                
    	                if(oControl.getGrouping()) {
    	                	if(j == groupidx) {
    		                	if(old_value != "" && old_value == new_value) {
    		                		innerHtml += "class='L2PListCellGroup  L2PBorderRight' ";
    		                		
    		                		innerHtml += "style='";
    		    	            	innerHtml += "width:" + (d_w) + "px;";
    		    	            	innerHtml += "height:" + oControl.getDataHeight() + "px;";
    		    	            	innerHtml += "line-height:" + oControl.getDataHeight() + "px;";
    		    	            	innerHtml += "' >";
    		    	            	innerHtml += "&nbsp;</div></td>";
    		                	} else {
    		                		innerHtml += "class='L2PListCell  L2PBorderRight' ";
    					            
    		                		innerHtml += "style='";
    		    	            	innerHtml += "width:" + (d_w) + "px;";
    		    	            	innerHtml += "height:" + oControl.getDataHeight() + "px;";
    		    	            	innerHtml += "line-height:" + oControl.getDataHeight() + "px;";
    		    	            	innerHtml += "' >";
    		    	            	eval("innerHtml += oControl._vList[i]." + vItems[j]);
    		    	            	innerHtml += "</div></td>";
    		                	}
    		                } else {
    		                	if((i % 2) == 0) {
    		                		if(j == (oControl._columnCount - 1)) {
    			                		innerHtml += "class='L2PListCell' ";
    				                } else {
    			                		innerHtml += "class='L2PListCell  L2PBorderRight' ";
    				                }	
    			                } else {
    			                	if(j == (oControl._columnCount - 1)) {
    			                		innerHtml += "class='L2PListCell1' ";
    				                } else {
    			                		innerHtml += "class='L2PListCell1  L2PBorderRight' ";
    				                }
    			                }
    		                	innerHtml += "style='";
    			            	innerHtml += "width:" + (d_w) + "px;";
    			            	innerHtml += "height:" + oControl.getDataHeight() + "px;";
    			            	innerHtml += "line-height:" + oControl.getDataHeight() + "px;";
    			            	innerHtml += "' >";
    			            	eval("innerHtml += oControl._vList[i]." + vItems[j]);
    			            	innerHtml += "</div></td>";
    		                }
    	                } else {
    	                	if((i % 2) == 0) {
    	                		if(j == (oControl._columnCount - 1)) {
    		                		innerHtml += "class='L2PListCell' ";
    			                } else {
    		                		innerHtml += "class='L2PListCell  L2PBorderRight' ";
    			                }	
    		                } else {
    		                	if(j == (oControl._columnCount - 1)) {
    		                		innerHtml += "class='L2PListCell1' ";
    			                } else {
    		                		innerHtml += "class='L2PListCell1  L2PBorderRight' ";
    			                }
    		                }
    	                	innerHtml += "style='";
    		            	innerHtml += "width:" + (d_w) + "px;";
    		            	innerHtml += "height:" + oControl.getDataHeight() + "px;";
    		            	innerHtml += "line-height:" + oControl.getDataHeight() + "px;";
    		            	innerHtml += "' >";
    		            	eval("innerHtml += oControl._vList[i]." + vItems[j]);
    		            	innerHtml += "</div></td>";
    	                }
    	                
    	            }
    	            innerHtml += "</tr>";
    	            
    	            old_value = new_value;
            	}
        	} else {
        		innerHtml += "<tr>";
        		innerHtml += "<td class='L2PListNoData' style=' ";
        		innerHtml += "width:" + (t_w) + "px;";
        		innerHtml += "height:" + oControl.getHeaderHeight() + "px;'>";
        		innerHtml += "?ش??ϴ? ?????Ͱ? ?????ϴ?.";
        		innerHtml += "<td></tr>";
        	}
        	
        	innerHtml += "</table>";
            innerHtml += "</div>";
            
            console.log("[control.ReportType1] createDataView");

            return innerHtml;
        },
        
        resizeView : function() {
        	var oControl = this;
        	
        	var t_w = oControl.getContainerWidth(oControl);

        	var t_h = oControl.getCalDataHeight(oControl);
        	
        	var t_i_w = 0;
        	for(var i=0; i<this._columnCount; i++) {
        		var d_w = oControl.getColumnWidth(t_w, oControl._vItemWidths[i]);
        		
        		$("#ColumnHeader_" + i).css("width", d_w + "px");
        		$("#ColumnHeader_" + i).css("left", t_i_w + "px");
        		
        		t_i_w = t_i_w + d_w + 1;
        	}
        	
        	//t_w = t_i_w;        	
        	
        	$(".L2PListHeader").css("width", t_w + "px");
        	$(".L2PListData").css("width", (t_w) + "px");
        	$(".L2PListData").css("height", (t_h) + "px");
        	
        	for(var i=0; i<oControl._vList.length; i++) {
        		for(var j=0; j<oControl._columnCount; j++) {
        			var d_w1 = oControl.getColumnWidth(t_w, oControl._vItemWidths[j]);
        		
        			$("#ListCell-row" + i + "-col" + j).css("width", d_w1 + "px");
        		
        		}
        	}
        	
        	$('.L2PListData').jScrollPane({
				autoReinitialise: true,
				mouseWheelSpeed : 1,
			});						
			$('.L2PListData').hover(function() {
				$('.L2PListData .jspVerticalBar').animate({
					opacity : 1
				}, 200);
			}, function() {
				$('.L2PListData .jspVerticalBar').animate({
					opacity : 0
				}, 200);
			});
			
			$(".jspPane").css("width", (t_w+8) + "px");
			$(".jspContainer").css("width", (t_w+8) + "px");
        },
        
        getContainerWidth : function(oControl) {
        	var r_w = 0;
			var c_w = oControl.getWidth();
			
			if(c_w.toLowerCase().indexOf("px") != -1 ) {
				r_w = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("px"))) - 20;
			} else if(c_w.toLowerCase().indexOf("%") != -1 ) {
				var p1 = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("%")));
				
				var oParent_width = window.innerWidth;
				
				if( $( ".L2PCalContainer" ).parent().width() != null) {
					oParent_width = $( ".L2PCalContainer" ).parent().width();
				}
				r_w = Math.floor((oParent_width * p1) / 100) - 20;
			}
			return r_w;
		},
		
		getColumnWidth : function(t_w, c_w) {
        	var r_w = 0;
			
			if(c_w.toLowerCase().indexOf("px") != -1 ) r_w = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("px")));
			else if(c_w.toLowerCase().indexOf("%") != -1 ) {
				var p1 = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("%")));
				r_w = Math.round((t_w * p1) / 100);
			}
			return r_w - 1;
		},
		
		getCalDataHeight : function(oControl) {
        	var t_h = 0;
			var c_h = oControl.getHeight();
			
			if(c_h.toLowerCase().indexOf("px") != -1 ) {
				var c_h_i = parseInt(c_h.substring(0, c_h.toLowerCase().indexOf("px")));
				t_h = c_h_i - oControl._startTop - oControl.getHeaderHeight() - 20;
			} else if(c_h.toLowerCase().indexOf("%") != -1 ) {
				var p1 = parseInt(c_h.substring(0, c_h.toLowerCase().indexOf("%")));
				
				var oParent_height = window.innerHeight;
				var p_h = $( ".L2PListContainer" ).parent().height();
				if( p_h != null && p_h > 0) {
					oParent_height = p_h;
				}
				var c_h_i = Math.floor((oParent_height * p1) / 100);
				t_h = c_h_i - oControl._startTop - oControl.getHeaderHeight() - 20;
			}
			return t_h - 50;
		},
    });
    
    control.ReportType1.prototype.exit = function () {
        
    };
    
    control.ReportType1.prototype.setPath = function (vPath) {
    	this.setProperty("path", vPath, /*suppressInvalidate*/ true);
    };
    
    control.ReportType1.prototype.refresh = function () {
    	
    	this.getData(this);
    	
    	var vHtml2 = this.createView(this);        	
    	var vHtml3 = this.createDataView(this);
    	
    	$( vHtml2 ).replaceAll( ".L2PListHeader" );
    	$( vHtml3 ).replaceAll( ".L2PListData" );
    	
    	this.resizeView();
    };
           