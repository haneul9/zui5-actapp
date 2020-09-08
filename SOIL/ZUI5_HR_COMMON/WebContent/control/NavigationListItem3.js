sap.ui.define(["sap/ui/core/Control",
               "sap/tnt/NavigationListItem",
           	   "sap/m/RatingIndicator",],
    function(Control, NavigationListItem, RatingIndicator) {
    "use strict";
    return NavigationListItem.extend("control.NavigationListItem", {
        metadata: {
            properties: {
            },
            defaultAggregation: "rows",
            aggregations: {
                rows: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "row"
                }
            }
        },
        
		init : function () {
//			this.setAggregation("_rating", new RatingIndicator({
//				value: this.getValue(),
//				iconSize: "2rem",
//				visualMode: "Half",
//				liveChange: this._onRate.bind(this)
//			}));
			
//			this.setAggregation("_nav", new NavigationListItem({
//				text : this.getText(),
//				key : this.getKey()
//			}));
		},
		
//        renderer : function (oRM, oControl) {
//			oRM.write("<div");
//			oRM.writeControlData(oControl);
//			oRM.addClass("myAppDemoWTProductRating");
//			oRM.writeClasses();
//			oRM.write(">");
////			oRM.renderControl(oControl.getAggregation("_rating"));
////			oRM.renderControl(oControl.getAggregation("_nav"));
//			oRM.write("</div>");
//		}
    });
});