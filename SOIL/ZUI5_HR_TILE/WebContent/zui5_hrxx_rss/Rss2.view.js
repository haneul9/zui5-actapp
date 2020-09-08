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
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZHRXX_TMAPP/css/L2PBasic.css");
		
		var that=this;
        this.setHeight('100%');
        var vPersa = "";
        var oCommonModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRXX_TMCOMMON_SRV/", true, undefined, undefined,
															{"Cache-Control": "max-age=0"}, undefined, undefined, true);
        oCommonModel.read("/TMEmpLoginInfoSet", null, null, false,
				function(data, Res) {					
					if(data && data.results.length) {
						if(data.results[0].Dtfmt != "") {
							data.results[0].Dtfmt = data.results[0].Dtfmt.replace("YYYY", "yyyy");
							data.results[0].Dtfmt = data.results[0].Dtfmt.replace("DD", "dd");
							 
							oController._Dtfmt = data.results[0].Dtfmt;								
						}
						vPersa = data.results[0].Persa ;
						vRatnyn = data.results[0].Ratnyn ;
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
        
//        var oImage = ["/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/zui5_hrxx_rss/image/NewsImage1.png"];

		var vData = {items : []};
		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRXX_HRSCHEDULE_SRV/", true, undefined, undefined,
				 										{"Cache-Control": "max-age=0"}, undefined, undefined, true);
		
	    oModel.read("/NoticeListSet", null, null, false,
				function(data, Res) {					
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++){
							var oneData = data.results[i];
							oneData.Image = "/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/zui5_hrxx_rss/image/NewsImage1.png";
							vData.items.push(data.results[i]);
						}
					} else {
						var oneData = {};
						oneData.Image = "/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/zui5_hrxx_rss/image/NewsImage1.png";
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
		
//		this._newsTile.getModel().setData(vData );
        
        var oNewsTileContent = new sap.suite.ui.commons.TileContent({
            footer : "{Footer}"
//                path : "pubDate",
//                formatter: function(date){
//                    return  newstile.NewsTileUtils.calculateFeedItemAge(date);
//                }
            	
            ,
            frameType : "TwoByOne",
            content : new sap.suite.ui.commons.NewsContent({
		                    contentText: "{Source}",
		                    subheader: "{Title}"
			          })
        });
	   
	    
	    this.oNewsTile = new sap.suite.ui.commons.GenericTile({
            frameType: "TwoByOne",
//            header: "{header}",
            size: "Auto",
            backgroundImage : "{Image}",
            tileContent: [oNewsTileContent],
            press : function(oEvent) {
                oController.onPress(oController, oEvent);
            },
        }).addCustomData(new sap.ui.core.CustomData({key : "Zyear", value : "{Zyear}"}))
          .addCustomData(new sap.ui.core.CustomData({key : "Notno", value : "{Notno}"}));
	    
        this._newsTile = new sap.suite.ui.commons.DynamicContainer({
            displayTime:  5000,
            transitionTime: 500,
            
            tiles: {
                    template: that.oNewsTile,
                    path: "/items"
            },

        }).setModel(oJSonModel).addStyleClass("newsTileStyle");
        
        var oPageModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/UI2/PAGE_BUILDER_PERS/", true, undefined, undefined,
				{"Cache-Control": "max-age=0"}, undefined, undefined, true);
        
        
        oModel.read("/LaunchPadResetSet", null, null, true,
				function(data, Res) {					
					if(data && data.results.length) {
						if(data.results[0].Reset == "X"){
							/*
							 * 홈페이지 조회 모드 : 한번에 한 개의 권한 그룹만 보이도록 설정
							 */
							
							var oInteropModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/UI2/INTEROP/", true, undefined, undefined,
									{"Cache-Control": "max-age=0"}, undefined, undefined, true);
					        
					        var oneData = {PersContainerItems:[]}, oneData2 ={};
					        
					        oneData2.category = "I";
					        oneData2.containerCategory = "P";
					        oneData2.containerId = "flp.settings.FlpSettings";
					        oneData2.id = "homePageGroupDisplay";
					        oneData2.value = '"' +'tabs' + '"';
					        
					        oneData.PersContainerItems.push(oneData2);
					        
					        oneData.appName = "sap.ushell.renderers.fiori2";
					        oneData.category = "P";
					        oneData.id = "flp.settings.FlpSettings";
					        
					        
							oInteropModel.create(
									"/PersContainers",
									oneData,
									null,
								    function (oData, response) {
										
								    },
								    function (Res) {
								    	var ErrorMessage = Res.response.body;
										var ErrorJSON = JSON.parse(ErrorMessage);								
										if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
											oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
										}
								    }
							);
							
							var vObject = ["ZHR_TM_ESS", "ZHR_TM_MSS", "ZHR_TM_HASS"];
							for(i=0; i<vObject.length;i++){	
								
//								var oUrl = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Pages('" + vObject[i] + "')";
								
								var oPath = "/Pages('" + vObject[i] + "')";
								oPageModel.remove(oPath, null,
										function(data,res){
										},
										function(Res){
											if(Res.response.body){
												var ErrorMessage = Res.response.body;
												var ErrorJSON = JSON.parse(ErrorMessage);
												
												if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
													vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
												}else{
													vErrorMessage = ErrorMessage ;
												}
											}
										}
								);
							} 
														
							/* 권한에 맞게 메뉴 삭제 */
							var oPath = [];
							// 인프라코어,산차,밥캣,DBKR
							if(vPersa == "7700" || vPersa == "AT00" || vPersa == "BR00" || vPersa == "C100"){
								oPath = ["/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XJWX84QSKZXMV48')",	// 팀휴가신청(ESS)
										 "/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XJWX85KM058KUOI')", // 팀휴가신청(HASS)
										 "/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XLNMV9LQAE4MZH4')",	// 직원용 Manual(ESS) > ZHR_MANUAL2(JVUI)
										 "/PageChipInstances(pageId='ZHR_TM_MSS',instanceId='00O2TFK3A3XLNMVAAQSAWMKIP')",	// 관리자용 Manual(MSS) > ZHR_MANUAL2(ZUC7)
										 "/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XLNMVAO6T0VC67X')"];// 담당자용 Manual(HASS) > ZHR_MANUAL2(ZOFS)
								
							} else if(vPersa == "0112" || vPersa == "0300") {
								
								oPath = ["/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XJWX84QSKZXMV48')",	// 팀휴가신청(ESS)
										 "/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XJWX85KM058KUOI')", // 팀휴가신청(HASS)
										 "/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XLNLH3727VJBXZP')",	// 해외출장신청(ESS)
										 "/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XLNLH37273ZVYL1')",	// 경조휴가확인서(ESS)
										 "/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XLNLGWORE9K2HH8')",	// 직원용 Manual(ESS) > ZHR_MANUAL(7QWP)
										 "/PageChipInstances(pageId='ZHR_TM_MSS',instanceId='00O2TFK3A3XLNLGXIGURYLOIB')",	// 관리자용 Manual(MSS) > ZHR_MANUAL(0FWO)
										 "/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XLNLGXM5NB7WSX5')"];// 담당자용 Manual(HASS) > ZHR_MANUAL(GDWL)
								
								
							} else{
								oPath = ["/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XLNLH3727VJBXZP')",	// 해외출장신청(ESS)
										 "/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XLNLH37273ZVYL1')",	// 경조휴가확인서(ESS)
										 "/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XLNLGWORE9K2HH8')",	// 직원용 Manual(ESS) > ZHR_MANUAL(7QWP)
										 "/PageChipInstances(pageId='ZHR_TM_MSS',instanceId='00O2TFK3A3XLNLGXIGURYLOIB')",	// 관리자용 Manual(MSS) > ZHR_MANUAL(0FWO)
										 "/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XLNLGXM5NB7WSX5')"];// 담당자용 Manual(HASS) > ZHR_MANUAL(GDWL)
							}
							
							if(vPersa != "7700"){
								oPath.push("/PageChipInstances(pageId='ZHR_TM_MSS',instanceId='00O2TFK3A3XLNLGEL0ZR7YVHK')"); // 보전휴가현황(MSS)
								oPath.push("/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XLNLGF1FDP1CH75')"); // 보전휴가현황(HASS)
							}
							
							// 근태소명
							if(vRatnyn == "Y"){
								
							} else {
								oPath.push("/PageChipInstances(pageId='ZHR_TM_ESS',instanceId='00O2TFK3A3XLQOFEVNUXKS5UU')"); // pc on/off 소명현황
								/*oPath.push("/PageChipInstances(pageId='ZHR_TM_MSS',instanceId='00O2TFK3A3XLQOFEX2NJZK1PJ')");
								oPath.push("/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XLQOFEY6U53O4OA')");
								oPath.push("/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XLQOFEZ2Y112GFE')"); // pc on,off 예외처리
								oPath.push("/PageChipInstances(pageId='ZHR_TM_MSS',instanceId='00O2TFK3A3XLQOFEX2MTNAI07')"); // idle time (비업무시간)
								oPath.push("/PageChipInstances(pageId='ZHR_TM_HASS',instanceId='00O2TFK3A3XLQOFEY6U53Q27E')"); // 비업무시간
*/							}

							for(var i=0; i<oPath.length; i++){
								oPageModel.remove(oPath[i], null,
										function(data,res){
										},
										function(Res){
											if(Res.response.body){
												var ErrorMessage = Res.response.body;
												var ErrorJSON = JSON.parse(ErrorMessage);
												
												if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
													vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
												}else{
													vErrorMessage = ErrorMessage ;
												}
											}
										},
										null,
										null,
										true
								);
							}
															
							setTimeout(location.reload(), 500);
								
						}
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
       
		
        return this._newsTile;
	}

});