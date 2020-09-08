/**
 * 
 */
jQuery.sap.declare("control.CircularRangeGauge1");

sap.ui.core.Control.extend('control.CircularRangeGauge1', {
	_strokeStyle : "red",
	_finalVal : 0,
    _Size : 0,
    _LineWidth : 0,
    _Highest : 100,
    _Lowest : 0,
	
					metadata : {
						properties : {
							lowest : {	type : 'int', defaultValue : 0 },
							highest : { type : 'int', defaultValue : 100 },
							size : { type : 'int', defaultValue : 50 },
							value : { type : 'int', defaultValue : 0 	},
//							title : { type : 'string', defaultValue : '' },
//							titlePosition : { type : 'string', defaultValue : 'Bottom' },
							lineWidth : { type : 'int', defaultValue : 10}
						}
					},

					renderer : function(oRm, oControl) {
						oRm.write("<div align='center' ");
						oRm.writeControlData(oControl);
						oRm.addStyle("width", oControl.getSize() + "px");
			            oRm.addStyle("height", oControl.getSize() + "px");
			            oRm.writeStyles();
						oRm.write('>');

						oRm.write('<canvas id="' + oControl.getId()  + '_canvas" width="' + oControl.getSize() + '" height="' + oControl.getSize() + '" style=""></canvas>');
						oRm.write("</div>");
						
						oControl._finalVal = oControl.getNormalizedValue();
						oControl._strokeStyle = 'red';
						if (oControl._finalVal > 89) {
							oControl._strokeStyle = 'blue';
						} else if (oControl._finalVal > 74) {
							oControl._strokeStyle = 'green';
						} else if (oControl._finalVal > 50) {
							oControl._strokeStyle = 'orange';
						} 
						oControl._Size = oControl.getSize();
						oControl._LineWidth = oControl.getLineWidth();
						oControl._Highest = oControl.getHighest();
						oControl._Lowest = oControl.getLowest();
					},

					getNormalizedValue : function(val) {
						val = (val === undefined) ? this.getValue()
								: parseInt(val);
						if (val > this.getHighest()) {
							val = this.getHighest();
						} else if (val < this.getLowest()) {
							val = this.getLowest();
						}
						return val;
					},
					
				    animate : function() {	
						var canvas = this._canvas;
						var finalval = this._finalVal;
						var size = this._Size;
						var linewidth = this._LineWidth;
						var highest = this._Highest;
						var stokestyle = this._strokeStyle;
						
						var start_val = 1;
						
					    var drawArc1 = function(canvas, val, size, lineWidth, Highest, strokeStyle) {
					    	var ret = true;
							var dw = size;
							var dh = size;
							
							var arcSize = dw;
							
							var arcCenterX = (dw / 2);
							var arcCenterY = arcSize / 2;
							
							var arcDiameter =  (arcSize / 2) - (lineWidth / 2);
							
							//console.log("Dimension : " +arcCenterX + ", " +  arcCenterY + ", " + arcSize + ", " + arcDiameter);
							
							var c = canvas; //this.$().find('canvas')[0];
							if(c) {
								var ctx = c.getContext("2d");
								ctx.clearRect(0, 0, dw, dh);
								
								ctx.fillStyle = '#000';
								ctx.globalAlpha = 0.8;
								ctx.font="20px Verdana";
								ctx.fillText(val, arcCenterX-12, arcCenterY + 8);
								
								ctx.beginPath();
								ctx.arc(arcCenterX, arcCenterY, arcDiameter, 0, 2 * Math.PI);
								ctx.lineWidth = lineWidth;
								ctx.strokeStyle = '#ccc';
								ctx.globalAlpha = 0.4;
								ctx.stroke();
								ctx.beginPath();
								
								if(start_val > val) {
									start_val = val;
									ret = false;
								} 
								
								var partLength = ( (start_val / Highest) * 2 * Math.PI) / 2;
						        var start = 0;
						        var xStart = arcCenterX + Math.cos(start) * arcDiameter;
					            var xEnd = arcCenterX + Math.cos(start + partLength) * arcDiameter;
					            // y start / end of the next arc to draw
					            var yStart = arcCenterY + Math.sin(start) * arcDiameter;
					            var yEnd = arcCenterY + Math.sin(start + partLength) * arcDiameter;
								
								var gradient1 = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
								gradient1.addColorStop("0","blueviolet");
								gradient1.addColorStop("1.0","blue");
								
								var gradient2 = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
								gradient2.addColorStop("0","greenyellow");
								gradient2.addColorStop("1.0","green");
								
								var gradient3 = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
								gradient3.addColorStop("0","orangered");
								gradient3.addColorStop("1.0","orange");
								
								ctx.arc(arcCenterX, arcCenterY, arcDiameter, 0, (start_val / Highest) * 2
										* Math.PI);
								ctx.lineWidth = lineWidth;
								if(strokeStyle == "blue") {
									ctx.strokeStyle = gradient1;
								} else if(strokeStyle == "green") {
									ctx.strokeStyle = gradient2;
								} else if(strokeStyle == "orange") {
									ctx.strokeStyle = gradient3;
								} 
								
								ctx.globalAlpha = 0.8;
								ctx.stroke();
								
								start_val += 3;
								
								return ret;
							}
					    };
					    
					    var ani = function() {
					    	var time1;
					    	var finstatus = drawArc1(canvas, finalval, size, linewidth, highest, stokestyle);
					    	if(finstatus) {
					    		clearTimeout(time1);
					    		time1 = setTimeout(ani, 40);
					    	}					    	
					    };
					    //setTimeout(ani, 10);
					    ani();
					},

					onAfterRendering : function() {
						this._canvas = this.$().find('canvas')[0];
						this.animate();
					}
});

control.CircularRangeGauge1.prototype.setValue = function (sVal) {
    if (sVal) {
    	if(sVal == "") sVal = "0.0";
        this.setProperty("value", sVal, /*suppressInvalidate*/ true);     //do not re-render        
    } else {
    	this.setProperty("value", 0, /*suppressInvalidate*/ true);     //do not re-render
    }
};
