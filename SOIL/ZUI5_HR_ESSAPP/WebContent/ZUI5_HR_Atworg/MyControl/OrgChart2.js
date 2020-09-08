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

	onAfterRendering : function() {
		var root = this.root;
		var firstTime = this.firstTime;
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
		
		
//������Ƽ �޴� �κ�
		d3.select("#" + this.getId()).select("svg").remove();
		var svg = d3.select("#" + this.getId()).append("svg").attr("width",
				this.getWidth()).
				attr("height", this.getHeight()).call(
				zm = d3.behavior.zoom().scaleExtent([ 0.3, 3 ])
						.on("zoom", redraw)).append("g").attr("transform",
				"translate(" + (this.getWidth() / 2) + "," + 20 + ")");
//		 var svg = d3.select("#" + this.getId())
//	        .append("svg")
//	        .attr("width", this.getWidth())
//	        .attr("height", this.getHeight())
//	        .call(d3.behavior.zoom().on("zoom", function () {
//	            svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
//	        }))
//	        .append("g")
		
//		var vWidth = this.getWidth(); 
//	     var svg = d3.select("#" + this.getId())
//	        .append("svg")
//	        .attr("width", this.getWidth())
//	        .attr("height", this.getHeight())
//	        .call(d3.behavior.zoom().on("zoom", function () {
//	            svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
//	        }))
//	        .append("g")
		
		
		
		//necessary so that zoom knows where to zoom and unzoom from
		console.log(window.innerWidth);
		zm.translate([window.innerWidth/2, 20]);
//		root.x0 = 0;
//		root.y0 = height / 2;	
		
		root.x0 = this.getWidth() / 2;
		root.y0 = 20;	

//���� ���� �κ�      
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
		/* 최초 접근시 모두 expand */
		expandAll();
		
		function update(source) {				
//			var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);
			var nodes = tree.nodes(source).reverse(), links = tree.links(nodes);
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
							}).html(function(d){
								return d.cHTML;
							})
							
			var rectors1 = svg.selectAll("#childexist").on("click", dblclick);
			var rectors2 = svg.selectAll("#childexist2").on("click", dblclick);
			
			var nodeUpdate = node.transition().duration(duration).attr(
					"transform", function(d) {
//						var tmTpOrg = tpOrg ;
//						if(parseInt(d.ZorgLevl) == 350){
//							if(d.Objid == "99999999"){
////								d.x = d.x - 130 ;
//								tpOrg++;
//							}
//							
//						}else if(parseInt(d.ZorgLevl) == 400){
//							if(d.Upobjid == "99999999"){
////								d.x = d.x - 130 ;
//								tpOrg++;
//							}
//						}
//						if(tmTpOrg !=  tpOrg){
//							d.x = d.x - ( 130 * tpOrg);
//						}
//						if(d.x < 0 ){
//							d.x = d.x + ( 130 * tpOrg);
//						}else{
//							d.x = d.x - ( 130 * tpOrg);
//						}
						
//						if(d.Objid == "99999999"){
//							tpOrg++;
//						}
//							
//						d.x = d.x + ( 130 * tpOrg);
							
							
							
//						alert(d.Stext + "_" + d.x);
//						if(parseInt(d.ZorgLevl) == 100){
//							d.y = 100 ;
//						}else if(parseInt(d.ZorgLevl) == 150){
//							d.y = 300 ;
//						}else if(parseInt(d.ZorgLevl) == 200){
//							d.y = 500 ;
//						}else if(parseInt(d.ZorgLevl) == 250){
//							d.y = 700 ;
//						}else if(parseInt(d.ZorgLevl) == 350){
//							d.y = 900 ;
//						}else if(parseInt(d.ZorgLevl) == 400){
//							d.y = 1100 ;
//						}
						
//						if(d.Objid == "10000148" || d.Objid == "10000161" ){
//							d.y = 800;
//						}
						return "translate(" + d.x  * 2 + "," + d.y  + ")";
					});
//�簢�� ������ ���� ��ȭ
			
			nodeUpdate.select("#multirect").attr("width", function(d){return d.Width})
			.attr("height", function(d){return d.Height})
			
//				.style("fill",function(d){return d.Color})
					
					.style("fill", function(d) {
				return d._children ? "#D5D5D5" : "#fff";
			});

//			nodeUpdate.select("#countrect").attr("width", function(d){
//					return d.Width
//				}).attr("height", function(d){
//					return d.Height
//				})
		
//			nodeUpdate.select("#headerrec").attr("width", function(d){
//				return "250"
//			}).attr("height", function(d){
//				return "30"
//			});
			
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

//��� �������� ���� ���� �ö󰡴� ��
			var nodeExit = node.exit().transition().duration(duration).attr(
					"transform", function(d) { 
						return "translate(" + source.x  + "," + source.y + ")";
					}).remove();
	
			var link = svg.selectAll("path.link").data(links, function(d) {
				return d.target.id;
			});
	
			//���μ�Ʈ
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
//			link.exit().transition().duration(duration).attr("d", function(d) {
//				var o = {
//						x : source.x0,
//						y : source.y0
//					};
//					return twLine({
//						source : o,
//						target : o
//					});
//				}).remove();			
			
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
	
	    // ��� ������
//			nodes.forEach(function(d) {
//				d.x0 = d.x ;
//				d.y0 = d.y ;
//			});		
	
			
		}		//��� ����Ŭ��������
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
//				if(d._children.length>5){
//				root.children.forEach(collapse);
//				}
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
//						if(d._children.length>5){
//						root.children.forEach(collapse);
//						}
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


		//�� ������
		function redraw() {
//			if(this.firstTime == undefined || this.firstTime < 5){
//				d3.event.translate[0] = parseInt(window.innerWidth / 2) ;
//				d3.event.translate[1] = 10 ;
//			}
			svg.attr("transform", "translate(" + d3.event.translate + ")"
					+ " scale(" + d3.event.scale + ")"
					);
//			if(this.firstTime == undefined){
//				this.firstTime = 0;
//			}else{
//				this.firstTime++;
//			}
		}
		// ���� Ŀ���͸���¡	
		function twLine(d, i) {
			return "M" + parseFloat(d.source.x * 2 + rectW/2) + "," + parseFloat(d.source.y + rectH) + "L" + parseFloat(d.source.x * 2 + rectW/2) + "," +  parseFloat(d.source.y + rectH + (rectH/3)) + "M" + parseFloat(d.source.x * 2+ rectW/2) + "," + parseFloat(d.source.y + rectH + (rectH/3)) + "H" + (rectW/2 + d.target.x * 2) +"V" + parseFloat(d.target.y);
		}
		
	}
});