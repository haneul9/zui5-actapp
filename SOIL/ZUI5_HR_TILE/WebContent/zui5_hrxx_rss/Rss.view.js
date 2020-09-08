sap.ui.jsview("zui5_hrxx_rss.Rss", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_rss.Rss
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_rss.Rss";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_rss.Rss
	*/ 
	createContent : function(oController) {
		jQuery.sap.require('sap.suite.ui.commons.GenericTile');
		jQuery.sap.require('sap.suite.ui.commons.NewsContent');
		jQuery.sap.require('sap.suite.ui.commons.TileContent');
		jQuery.sap.require('sap.suite.ui.commons.DynamicContainer');
		jQuery.sap.require('sap.ui.table.Table');
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/news_tile.css");
		
		var that=this;
        this.setHeight('100%');

		var vData = {items : []};
		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_HRSCHEDULE_SRV/", true, undefined, undefined,
				 										{"Cache-Control": "max-age=0"}, undefined, undefined, true);
		
//		var Image = ["/sap/bc/ui5_ui5/sap/zui5_hr_tile/zui5_hrxx_rss/image/gnb_img_01.png",
//			 		 "/sap/bc/ui5_ui5/sap/zui5_hr_tile/zui5_hrxx_rss/image/gnb_img_02.jpg",
//					 "/sap/bc/ui5_ui5/sap/zui5_hr_tile/zui5_hrxx_rss/image/gnb_img_03.jpg",
//					 "/sap/bc/ui5_ui5/sap/zui5_hr_tile/zui5_hrxx_rss/image/gnb_img_04.jpg"];
        
//		var Image = ["/sap/bc/ui5_ui5/sap/zui5_hr_tile/zui5_hrxx_rss/image/NewsImage1.png"];
		
//        var Image = ["/sap/bc/ui5_ui5/sap/zui5_hr_tile/zui5_hrxx_rss/image/s-oil2.jpg"];
        var Image = ["/sap/bc/ui5_ui5/sap/zui5_hr_tile/zui5_hrxx_rss/image/NewsImage1.png"];
       
		
	    oModel.read("/NoticeListSet", null, null, false,
				function(data, Res) {					
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++){
							var oneData = data.results[i];
//							oneData.Image = Image[i%4];
							oneData.Image = Image[i];
							vData.items.push(data.results[i]);
						}
					} else {
						var oneData = {};
						oneData.Image = Image[1];
						vData.items.push(oneData);
					}
				},
				function(Res) {
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}
						console.log(ErrorMessage);
					}
				}
		);
		
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setData(vData);

        var oNewsTileContent = new sap.suite.ui.commons.TileContent({
            frameType : "TwoByOne",
            content : new sap.suite.ui.commons.NewsContent({
		                    contentText: "{Source}",
			          })
        });
	   
	    
	    this.oNewsTile = new sap.suite.ui.commons.GenericTile({
            frameType: "TwoByOne",
            size: "Auto",
            backgroundImage : "{Image}",
            tileContent: [oNewsTileContent],
            press : function(oEvent) {
//                oController.onPress(oController, oEvent);
            },
        }).addCustomData(new sap.ui.core.CustomData({key : "Notty", value : "{Notty}"}))
          .addCustomData(new sap.ui.core.CustomData({key : "Schno", value : "{Schno}"}));
	    
        this._newsTile = new sap.suite.ui.commons.DynamicContainer({
            displayTime:  5000,
            transitionTime: 500,
            
            tiles: {
                    template: that.oNewsTile,
                    path: "/items"
            },

        }).setModel(oJSonModel).addStyleClass("newsTileStyle TileLayout2");
        
        return this._newsTile;

	}

});