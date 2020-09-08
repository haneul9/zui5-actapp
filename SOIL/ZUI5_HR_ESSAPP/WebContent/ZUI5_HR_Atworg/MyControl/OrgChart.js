jQuery.sap.declare("ZUI5_HR_Atworg.MyControl.OrgChart");

sap.ui.core.Control.extend('ZUI5_HR_Atworg.MyControl.OrgChart', {
		metadata : {
		properties : {
			width : {
				type : 'int',
				defaultValue : 600
			},
			height : {
				type : 'int',
				defaultValue : 500
			}
		} 
	},

	init : function() {
		this.root = {};
	},

	setRoot : function(root) {
		this.root = root;
	},
	
	renderer : function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sap-dennisseah-orgchart");
		oRm.writeClasses();
		oRm.write('>');
		oRm.write("</div>");
	},

	onAfterRendering : function(myD) {
		var root = this.root;
		if(root.Ename == null) return ;
		var margin = {
			top : 0,
			right : 0,
			bottom : 0,
			left : 0
		};
		
		var width = this.getWidth() - margin.right - margin.left;
		var height = this.getHeight() - margin.top - margin.bottom;

		var i = 0, duration = 750, rectW = 250, rectH = 130;

		var tree = d3.layout.tree().nodeSize([ 140 ]);
		var diagonal = d3.svg.diagonal().projection(function(d) {
			return [(d.x + rectW / 2) , ( d.y + rectH / 2 ) ];
		});
		
		
		d3.select("#" + this.getId()).select("svg").remove();
		var svg = d3.select("#" + this.getId()).append("svg").attr("width",
				this.getWidth()).
				attr("height", this.getHeight()).call(
				zm = d3.behavior.zoom().scaleExtent([ 0.3, 3 ])
						.on("zoom", redraw)).append("g").attr("transform",
				"translate(" + (this.getWidth() / 2) + "," + 20 + ")");
		
		//necessary so that zoom knows where to zoom and unzoom from
		zm.translate([window.innerWidth/2, 20]);
		root.x0 = 0;
		root.y0 = height / 2;	
  
		function collapse(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}
		if(root.children){
			root.children.forEach(collapse);
			update(root);
		}
		/* expand */
		expandAll();
		function update(source) {			
			var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);
			nodes.forEach(function(d) {
				d.y = d.depth * 200;
			});
			
			var node = svg.selectAll("g.node").data(nodes, function(d) {
				return d.id || (d.id = ++i);
			});
			var nodeEnter = node.enter().append("g").attr("class", "node")
			.attr(
					"transform",
					function(d) { 
						return "translate(" + source.x0 + ","
								+ source.y0 + ")";
					});
			
			
			nodeEnter.append("rect")
	        .attr("width", function(d){return d.rWidth1;})
	        .attr("height", function(d){return d.rHeight1;})
	        .attr("stroke", function(d){return d.stroke1;})
	        .attr("stroke-width", function(d){return d.strokeW1;})
//	        .attr("style",function(d){return d.style1})
	        .attr("x",function(d){return d.rX1})
	        .attr("y",function(d){return d.rY1})
	        .attr("name",function(d){return d.rName})
	        .attr("id",function(d){return d.rectid1})
	        .attr("style", function(d){ if(d.Objid == "99999999") return "fill:none" 
	        						    else return d.style1});
		
		nodeEnter.append("rect")
	        .attr("width", function(d){return d.rWidth2;})
	        .attr("height", function(d){return d.rHeight2;})
	        .attr("stroke", function(d){return d.stroke2;})
	        .attr("stroke-width", function(d){return d.Middle;})
	        .attr("style",function(d){return d.style2})
	        .attr("x",function(d){return d.rX2})
	        .attr("y",function(d){return d.rY2})
	        .attr("id",function(d){return d.rectid2})
	        .on("click",function(d){
	        	var oCon = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1").getController();
	        	oCon.makeTree(d.Objid);
	        });
		
		nodeEnter.append("text")
	        .attr("width", function(d){return d.tWidth;})
	        .attr("height", function(d){return d.tHeight;})
	        .attr("x", function(d){return d.tX;})
	        .attr("y", function(d){return d.tY;})
	        .attr("text-anchor", function(d){return d.Middle;})
	        .attr("class", function(d){return d.tClass;})
	        .attr("style", function(d){return d.tFill;})
	        .text(function(d){return d.Stext;})
	        .on("click",function(d){
	        	var oCon = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1").getController();
	        	oCon.makeTree(d.Objid);
	        });
		
		nodeEnter.append("image")
	        .attr("x", function(d){return d.iX1;})
	        .attr("y", function(d){return d.iY1;})
	        .attr("id", function(d){return d.iId1;})
	        .attr("xmlns:xlink", function(d){return d.xlink1;})
	        .attr("xlink:href", function(d){return d.href1;})
			.attr("width","18")
			.attr("height","18");
		
		nodeEnter.append("image")
	        .attr("x", function(d){return d.iX1;})
	        .attr("y", function(d){return d.iY1;})
	        .attr("id", function(d){return d.iId2;})
	        .attr("xmlns:xlink", function(d){return d.xlink1;})
	        .attr("xlink:href", function(d){return d.href2;})
	        .attr("width","18")
			.attr("height","18");
		
		nodeEnter.append("image")
	        .attr("x", function(d){return d.pX;})
	        .attr("y", function(d){return d.pY;})
	        .attr("id", function(d){return d.iId3;})
	        .attr("xmlns:xlink", function(d){return d.xlink3;})
	        .attr("xlink:href", function(d){return d.href3;})
	        .attr("width", function(d){return d.pWidth;})
	        .attr("height", function(d){return d.pHeight;})
	        .attr("text-anchor", function(d){return d.Middle;})
	        .on("click",function(d){var oCon = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1").getController();
	        	oCon.clickImage(d.Objid,d.Zjktt);});
		
		nodeEnter.append("image")
	        .attr("x", function(d){if(d.pX2) return d.pX2; else return "";})
	        .attr("y", function(d){if(d.pY2) return d.pY2; else return "";})
	        .attr("id", function(d){if(d.Id4) return d.Id4; else return "";})
	        .attr("xlink:href", function(d){if(d.href4) return d.href4; else return "";})
	        .attr("width", function(d){if(d.pWidth2) return d.pWidth2; else return "";})
	        .attr("height", function(d){if(d.pHeight2) return d.pHeight2; else return "";})
	        .attr("text-anchor", function(d){return d.Middle;})
	        .on("click",function(d){var oCon = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1").getController();
	        	oCon.clickImage(d.AObjid,d.AZzjikcht);});
		
		// 사원프로파일 이동
		nodeEnter.append("image")
	        .attr("x", function(d){if(d.pX5) return d.pX5; else return "";})
	        .attr("y", function(d){if(d.pY5) return d.pY5; else return "";})
	        .attr("id", function(d){if(d.Id5) return d.Id5; else return "";})
	        .attr("xlink:href", function(d){if(d.href5) return d.href5; else return "";})
	        .attr("width", function(d){if(d.pWidth5) return d.pWidth5; else return "";})
	        .attr("height", function(d){if(d.pHeight5) return d.pHeight5; else return "";})
	        .attr("text-anchor", function(d){return d.Middle;})
	        .on("click",function(d){var oCon = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1").getController();
	        							oCon.onEmpProfile(d.pPernr);});
		
		nodeEnter.append("text")
	        .attr("x", function(d){return d.nX;})
	        .attr("y", function(d){return d.nY;})
	        .attr("class", function(d){return d.nClass;})
	        .attr("text-anchor", function(d){return d.Left;})
	        .text(function(d){if(d.Objid == "99999999") return ""; 
	              else return d.Ename ; });
		
		nodeEnter.append("text")
	        .attr("x", function(d){return d.zX;})
	        .attr("y", function(d){return d.zY;})
	        .attr("class", function(d){return d.jClass;})
	        .attr("text-anchor", function(d){return d.Left;})
	        .text(function(d){if(d.Objid == "99999999") return ""; 
	 			              else return oBundleText.getText("LABEL_0067") + " : " + d.Zzjiklnt;	// 67:직위
	 			              });
		
		nodeEnter.append("text")
	        .attr("x", function(d){return d.jX;})
	        .attr("y", function(d){return d.jY;})
	        .attr("class", function(d){return d.jClass;})
	        .attr("text-anchor", function(d){return d.Left;})
	        .text(function(d){if(d.Objid == "99999999") return ""; 
	 			              else return oBundleText.getText("LABEL_2189") + " : " + d.Zzjikcht;	// 2189:직책
	 			              });
		
		nodeEnter.append("text")
	        .attr("x", function(d){return d.dX;})
	        .attr("y", function(d){return d.dY;})
	        .attr("class", function(d){return d.jClass;})
	        .attr("text-anchor", function(d){return d.Left;})
	        .attr("text-rendering", function(d){return d.tr;})
	        .text(function(d){if(d.Objid == "99999999") return ""; 
				 			  else if(d.Entda && d.Entda != null) return oBundleText.getText("LABEL_2073") + " : " + d.Entda;	// 2073:입사일자
				 			  else return  oBundleText.getText("LABEL_2073") + " : " });	// 2073:입사일자
		
		nodeEnter.append("text")
	        .attr("x", function(d){return d.jaX;})
	        .attr("y", function(d){return d.jaY;})
	        .attr("class", function(d){return d.jClass;})
	        .attr("text-rendering", function(d){return d.tr;})
	        .text(function(d){if(d.Objid == "99999999") return ""; 
				 			  else if(d.Orgda && d.Orgda != null) return oBundleText.getText("LABEL_2330") + " : " + d.Orgda;	// 2330:현부서 근무일자
				 			  else return  oBundleText.getText("LABEL_2330") + " : " });	// 2330:현부서 근무일자
		
		nodeEnter.append("line")
        .attr("x1", function(d){return d.lineX1;})
        .attr("y1", function(d){return d.lineY1;})
        .attr("x2", function(d){return d.lineX2;})
        .attr("y2", function(d){return d.lineY2;})
		.attr("style", function(d){return d.lineStyle;});
		
			var rectors1 = svg.selectAll("#childexist").on("click", dblclick);
			var rectors2 = svg.selectAll("#childexist2").on("click", dblclick);
			
			var nodeUpdate = node.transition().duration(duration).attr(
					"transform", function(d) {
						return "translate(" + d.x  * 2 + "," + d.y  + ")";
					});
			
			nodeUpdate.select("#multirect").attr("width", function(d){return d.Width})
			.attr("height", function(d){return d.Height}).style("fill", function(d) {
				return d._children ? "#D5D5D5" : "#fff";
			});

			
				
//			for(var a=0;a<3000;a++){
//				nodeUpdate.select("#countrect"+a).attr("width", function(d){
//					return d.Width
//				}).attr("height", function(d){
//					return d.Height
//				});
//			}
		
			nodeUpdate.select("#headerrec").attr("width", function(d){
				return  d.rWidth2 //"250" //d.width;
			}).attr("height", function(d){
				return d.rHeight2 //"30" //d.height;
			});
			
			nodeUpdate.select("#childexist").style("display", function(d){
				return d._children ? "block" : "none";
			});
			
			nodeUpdate.select("#childexist2").style("display", function(d){
				var vRet = "none";
				if(d.children){
					vRet = "block";
				}				
				return vRet;
			});
			nodeUpdate.select("text").style("fill-opacity", 1);

			var nodeExit = node.exit().transition().duration(duration).attr(
					"transform", function(d) { 
						return "translate(" + source.x  + "," + source.y + ")";
					}).remove();
	
			var link = svg.selectAll("path.link").data(links, function(d) {
				return d.target.id;
			});
	
			link.enter().insert("path", "g").attr("class", "link").attr("x",
					rectW ).attr("y", rectH / 2).attr("d", function(d) {
				var o = {
					x : source.x0,
					y : source.y0
				};
				return diagonal({
					source : o,
					target : o
				});
			});
			link.transition().duration(duration).attr("d", twLine);

			link.exit().transition().duration(duration).attr("d", function(d) {
				var o = {
						x : source.x0,
						y : source.y0
					};
					return twLine({
						source : o,
						target : o
					});
				}).remove();	

			nodes.forEach(function(d) {
				d.x0 = d.x ;
				d.y0 = d.y ;
			});			
		}	
		function dblclick(d) {
			console.log(d.Level);
			if(d.Level==1){
				if (d.children) {
					d._children = d.children;
					d.children = null;
				} else {
					d.children = d._children;
					d._children = null;
				}
			}else if(d.Level==2){
			  if(d._children&&d._children.length){
				if (d.children) {
					d._children = d.children;
					d.children = null;
				} else {
					d.children = d._children;
					d._children = null;
				}
			  }else{
				  if (d.children) {
						d._children = d.children;
						d.children = null;
					} else {
						d.children = d._children;
						d._children = null;
					}				  
			  }
			}else{
				  if(d._children&&d._children.length){
						if (d.children) {
							d._children = d.children;
							d.children = null;
						} else {
							d.children = d._children;
							d._children = null;
						}
					  }else{
						  console.log("here");
						  if (d.children) {
								d._children = d.children;
								d.children = null;
							} else {
								d.children = d._children;
								d._children = null;
							}				  
					  }				
			}
			update(d);
		}
		
		function expandAll(){
		    expand(root); 
		    update(root);
		}
		
		function expand(d){   
		    var children = (d.children)?d.children:d._children;
		    if (d._children) {        
		        d.children = d._children;
		        d._children = null;       
		    }
		    if(children){
		    	children.forEach(expand);
		    }
		      
		}

		function redraw() {
			svg.attr("transform", "translate(" + d3.event.translate + ")"
					+ " scale(" + d3.event.scale + ")"
					);
		}

		function twLine(d, i) {
			return "M" + parseFloat(d.source.x * 2 + rectW/2) + "," + parseFloat(d.source.y + rectH) + "L" + parseFloat(d.source.x * 2 + rectW/2) + "," +  parseFloat(d.source.y + rectH + (rectH/3)) + "M" + parseFloat(d.source.x * 2+ rectW/2) + "," + parseFloat(d.source.y + rectH + (rectH/3)) + "H" + (rectW/2 + d.target.x * 2) +"V" + parseFloat(d.target.y);
		}		
	},
	
	Zoomin : function(){
		
	},
	
	Zoomout : function(){
		
	}
});