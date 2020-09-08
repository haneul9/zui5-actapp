sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/RatingIndicator",
	"sap/tnt/NavigationListItem",
], function (Control, RatingIndicator, NavigationListItem) {
	"use strict";
	return Control.extend("control.NavigationListItem", {
		metadata : {
			properties : {
				value: 	{type : "float", defaultValue : 0},
				text: {type : "string"},
				key: {type : "string"},
			},
//			aggregations : {
//				_rating : {type : "sap.m.RatingIndicator", multiple: false, visibility : "hidden"},
//				_nav : {type : "sap.tnt.NavigationListItem", multiple: false, visibility : "hidden"}
//			},
            defaultAggregation: "rows",
            aggregations: {
                rows: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "row"
                }
            },
			events : {
				change : {
					parameters : {
						value : {type : "int"}
					}
				}
			}
		},
		init : function () {
			this.setAggregation("_rating", new RatingIndicator({
				value: this.getValue(),
				iconSize: "2rem",
				visualMode: "Half",
				liveChange: this._onRate.bind(this)
			}));
			
			this.setAggregation("_nav", new NavigationListItem({
				text : this.getText(),
				key : this.getKey()
			
			}));
		},

		setValue: function (iValue) {
			this.setProperty("value", iValue, true);
			this.getAggregation("_rating").setValue(iValue);
		},

		_onRate : function (oEvent) {
//			var oRessourceBundle = this.getModel("i18n").getResourceBundle();
//			var fValue = oEvent.getParameter("value");
//
//			this.setValue(fValue);
		},

		renderer : function (oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("myAppDemoWTProductRating");
			oRM.writeClasses();
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_rating"));
			oRM.renderControl(oControl.getAggregation("_nav"));
			oRM.write("</div>");
		}
	});
});