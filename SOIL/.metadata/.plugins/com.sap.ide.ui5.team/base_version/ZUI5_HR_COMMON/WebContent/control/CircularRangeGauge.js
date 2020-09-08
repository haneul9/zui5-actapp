/**
 * 
 */
jQuery.sap.declare("control.CircularRangeGauge");

sap.ui.core.Control.extend('control.CircularRangeGauge',
				{
					metadata : {
						properties : {
							lowest : {
								type : 'int',
								defaultValue : 0
							},
							highest : {
								type : 'int',
								defaultValue : 100
							},
							value : {
								type : 'int',
								defaultValue : 0
							},
							displayValue : {
								type : 'string'
							},
							width           : {type : "sap.ui.core.CSSSize", defaultValue : "100%"},
			                height          : {type : "sap.ui.core.CSSSize", defaultValue : "50px"}
						}
					},

					renderer : function(oRm, oControl) {
						oRm.write("<div align='center' ");
						oRm.writeControlData(oControl);
						oRm.addStyle("width", oControl.getWidth());
			            oRm.addStyle("height", oControl.getHeight());
			            oRm.writeStyles();
						oRm.write('>');
						
						oRm.write("<div style='width:50px;height:50px;'>");

						var val = oControl.getNormalizedValue();
						var displayVal = oControl.getDisplayValue();
						if(!displayVal || displayVal == "") displayVal = val;
						oRm.write('<canvas id="'
										+ oControl.getId()
										+ '_canvas" width="50" height="50" style="position:absolute"></canvas>');
						oRm.write('<input class="l2p_circular_range-guage-input" value="'
										+ displayVal + '" />');
						oRm.write("</div>");
						oRm.write("</div>");
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

					drawArc : function() {
						var val = this.getNormalizedValue();
						var strokeStyle = 'red';
						if (val > 94) {
							strokeStyle = 'blue';
						} else if (val > 84) {
							strokeStyle = 'green';
						} else if (val > 74) {
							strokeStyle = 'orange';
						} else if (val > 64) {
							strokeStyle = 'pink';
						}

						var c = this.$().find('canvas')[0];
						var ctx = c.getContext("2d");
						ctx.clearRect(0, 0, 50, 50);
						ctx.beginPath();
						ctx.arc(25, 25, 20, 0, 2 * Math.PI);
						ctx.lineWidth = 10;
						ctx.strokeStyle = '#ccc';
						ctx.globalAlpha = 0.4;
						ctx.stroke();
						ctx.beginPath();
						ctx.arc(25, 25, 20, 0, (val / this.getHighest()) * 2
								* Math.PI);
						ctx.lineWidth = 10;
						ctx.strokeStyle = strokeStyle;
						ctx.globalAlpha = 0.7;
						ctx.stroke();
					},

					onAfterRendering : function() {

						this.drawArc();

						var that = this;

						this.$().find('input').change(function() {
							if (isNaN(this.value)) {
								this.value = that.getLowest();
							}
							var val = that.getNormalizedValue(this.value);
							that.setValue(val);
							that.drawArc();
						});
					}
				});

control.CircularRangeGauge.prototype.setValue = function (sVal) {
    if (sVal) {
    	if(sVal == "") sVal = "0.0";
        this.setProperty("value", sVal, /*suppressInvalidate*/ true);     //do not re-render
        var c = this.$().find('input')[0];
        if(c) {
        	c.value = sVal;
        	this.drawArc();
        }
    } else {
    	this.setProperty("value", 0, /*suppressInvalidate*/ true);     //do not re-render
        var c = this.$().find('input')[0];
        if(c) {
        	c.value = 0;
        	this.drawArc();
        }
    }
};

control.CircularRangeGauge.prototype.setDisplayValue = function (sVal) {
    if (sVal) {
        this.setProperty("displayValue", sVal, /*suppressInvalidate*/ true);     //do not re-render
        var c = this.$().find('input')[0];
        if(c) {
        	c.value = sVal;
        }
		
    }
};