// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){
	"use strict";
	sap.ui.getCore().loadLibrary("sap.m");
	jQuery.sap.require("sap.ui.core.IconPool");
	jQuery.sap.require("sap.ui.thirdparty.datajs");
	jQuery.sap.require("sap.ushell.components.tiles.utils");
	jQuery.sap.require("sap.ushell.components.tiles.utilsRT");
	
	
	sap.ui.controller("zui5_hrxx_graph.Graph",{
//	sap.ui.controller("sap.ushell.components.tiles.zui5_hrxx_graph.DynamicTile",{
		timer:null,
		oDataRequest:null,
		_JSonModel : new sap.ui.model.json.JSONModel(),
		obusyIndicatorNormalId : null, 
		
		onInit:function(){
			var v=this.getView(),
			V=v.getViewData(),
			t=V.chip,
			c=sap.ushell.components.tiles.utilsRT.getConfiguration(t,t.configurationUi.isEnabled(),false),
//			c=sap.ushell.components.tiles.utilsRT.getConfiguration(t,true,false),
			m,k,K,a=this,N=c.navigation_target_url,s;
			this.bIsDataRequested=false;
			s=t.url.getApplicationSystem();
			if(s){
				N+=((N.indexOf("?")<0)?"?":"&")+"sap-system="+s;
			}
			this.navigationTargetUrl=N;
			m=new sap.ui.model.json.JSONModel({
				config:c,
				data:sap.ushell.components.tiles.utilsRT.getDataToDisplay(c,{number:(t.configurationUi.isEnabled()?1234:"...")}),
				nav:{navigation_target_url:(t.configurationUi&&t.configurationUi.isEnabled()?"":N)},
				search:{display_highlight_terms:[]}});
			v.setModel(m);
			var T=this.getView().getTileControl();
			this.getView().addContent(T);
			if(t.types){
				t.types.attachSetType(function(d){
					if(d==='link'){
						a.getView().removeAllContent();
						var l=a.getView().getLinkControl();
						a.getView().addContent(l);
					}else{
//						a.getView().removeAllContent();
//						var T=a.getView().getTileControl();
//						a.getView().addContent(T);
					}
				});
			}
			
			if(t.search){
				k=v.getModel().getProperty("/config/display_search_keywords");
				K=jQuery.grep(k.split(/[, ]+/),function(n,i){return n&&n!=="";});
				
				if(c.display_title_text&&c.display_title_text!==""&&K.indexOf(c.display_title_text)===-1){
					K.push(c.display_title_text);
				}
				if(c.display_subtitle_text&&c.display_subtitle_text!==""&&K.indexOf(c.display_subtitle_text)===-1){
					K.push(c.display_subtitle_text);
				}
				if(c.display_info_text&&c.display_info_text!==""&&K.indexOf(c.display_info_text)===-1){
					K.push(c.display_info_text);
				}
				t.search.setKeywords(K);
				t.search.attachHighlight(function(h){ v.getModel().setProperty("/search/display_highlight_terms",h);});
			}
			if(t.bag&&t.bag.attachBagsUpdated){
				t.bag.attachBagsUpdated(function(u){
					if(u.indexOf("tileProperties")>-1){
						sap.ushell.components.tiles.utils._updateTilePropertiesTexts(v,t.bag.getBag('tileProperties'));
					}
				});
			}
			if(t.preview){
				t.preview.setTargetUrl(N);
				t.preview.setPreviewIcon(c.display_icon_url);
				t.preview.setPreviewTitle(c.display_title_text);
			}
			if(t.refresh){
				t.refresh.attachRefresh(this.refreshHandler.bind(null,this));
			}
			if(t.visible){t.visible.attachVisible(this.visibleHandler.bind(this));}
			if(t.configurationUi.isEnabled()){
				t.configurationUi.setUiProvider(function(){
						var C=sap.ushell.components.tiles.utils.getConfigurationUi(v,"sap.ushell.components.tiles.applauncherdynamic.Configuration");
						t.configurationUi.attachCancel(a.onCancelConfiguration.bind(null,C));
						t.configurationUi.attachSave(a.onSaveConfiguration.bind(null,C));
						return C;
				});
				this.getView().getContent()[0].setTooltip(
						sap.ushell.components.tiles.utils.getResourceBundleModel().getResourceBundle().getText("edit_configuration.tooltip"));
			}else{
				if(!t.preview||!t.preview.isEnabled()){
					if(!s){
						sap.ushell.Container.addRemoteSystemForServiceUrl(c.service_url);
					}
					this.onUpdateDynamicData();
				}
			}
			if(t.actions){
				this.setData(this);
				
				var A=c.actions,e;
				if(A){e=A.slice();}
				else{e=[];}
				var b=sap.ushell.components.tiles.utilsRT.getTileSettingsAction(m,this.onSaveRuntimeSettings.bind(this));
				e.push(b);
				t.actions.setActionsProvider(function(){return e;});
				
			}
		},
		
		onAfterRendering: function() { 

		},
		
		setData : function(oController){
			  var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRXX_LANCHPADSTATUS_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"}, undefined, undefined, true);
			  var vData = {results : {
					Text1 : "",
					Text2 : "",
					Text3 : "",
					Cntc1 : 0,
					Cntc2 : 0,
					Cntc3 : 0,
					Cntu1 : 0,
					Cntu2 : 0,
					Cntu3 : 0,
					Row1 : 0,
					Row2 : 0
			  }};
			    
			  var oView = oController.getView();
				  
			  oModel.read("/HolPlanStatusSet(Cntc1='1')", null, null, true, 
					function(oData, oResponse) {
						if(oData) {
							vData.results = oData ;
							
							vData.results.Row1 = vData.results.Cntc2;
							vData.results.Row2 = vData.results.Cntc3;
							
							vData.results.Cntc1 = parseInt(vData.results.Cntc1);
							vData.results.Cntc2 = parseInt(vData.results.Cntc2);
							vData.results.Cntc3 = parseInt(vData.results.Cntc3);
							vData.results.Cntu1 = parseInt(vData.results.Cntu1);
							vData.results.Cntu2 = parseInt(vData.results.Cntu2);
							vData.results.Cntu3 = parseInt(vData.results.Cntu3);	
							  
							oController._JSonModel.setData(vData);						
						}
					},
					function(oResponse) {
						console.log(oResponse);

						oController._JSonModel.setData(vData);
					}
			  );  
			
		},
		
		setControls : function(){
			if(this.busyIndicator_Normal == null ||  this.busyIndicator_Normal == ""){
				this.busyIndicator_Normal = new sap.ui.commons.Image(obusyIndicatorNormalId,{
					src: "/sap/bc/ui5_ui5/sap/hrpao_common_js/img/busyIndicatorLane.gif",
					width: "100%",
					visible:false
				});
				this.busyIndicator_Normal.addStyleClass("busyIndicator");
			}
			
			console.log(this.busyIndicator_Normal);
			
		},
		
		stopRequests:function(){
			if(this.timer){
				clearTimeout(this.timer);
			}
			if(this.oDataRequest){
				try{
					this.oDataRequest.abort();
				}catch(e){
					jQuery.sap.log.warning(e.name,e.message);
				}
			}
		},
		
		onExit:function(){
			this.stopRequests();
		},
		
		onPress:function(){
			var v=this.getView(),
			V=v.getViewData(),
			m=v.getModel(),
			t=m.getProperty("/nav/navigation_target_url"),
			T=V.chip;
			T.configurationUi.display();
			hasher.setHash(t);
//			if(T.configurationUi.isEnabled()){
//				T.configurationUi.display();
//				console.log("onPressA");
//			}else if(t){
//				if(t[0]==='#'){
//					hasher.setHash(t);
//					console.log("onPressB");
//				}else{
//					window.open(t,'_blank');
//					console.log("onPressC");
//				}
//			}
		},
		
		onUpdateDynamicData:function(){
			var v=this.getView(),
			c=v.getModel().getProperty("/config"),
			n=c.service_refresh_interval;
			if(!n){n=0;}
			else if(n<10){
				jQuery.sap.log.warning("Refresh Interval "+n+" seconds for service URL "+c.service_url+" is less than 10 seconds, which is not supported. "+"Increased to 10 seconds automatically.",null,"zui5_hrxx_graph.Graph.controller");
				n=10;
			}
			if(c.service_url){
				this.loadData(n);
			}
		},
		
		extractData:function(d){
			var n,k=["results","icon","title","number","numberUnit",
			         "info","infoState","infoStatus","targetParams",
			         "subtitle","stateArrow","numberState",
			         "numberDigits","numberFactor"];
			if(typeof d==="object"&&Object.keys(d).length===1){
				n=Object.keys(d)[0];if(jQuery.inArray(n,k)===-1){
					return d[n];
			}
			}return d;
		},
 
		// tile settings action UI save handler
        onSaveRuntimeSettings: function (oSettingsView) {
            var
                oViewModel = oSettingsView.getModel(),
                oTileApi = this.getView().getViewData().chip,
                oConfigToSave = this.getView().getModel().getProperty("/config");

            oConfigToSave.display_title_text = oViewModel.getProperty('/title');
            oConfigToSave.display_subtitle_text = oViewModel.getProperty('/subtitle');
            oConfigToSave.display_info_text = oViewModel.getProperty('/info');
            oConfigToSave.display_search_keywords = oViewModel.getProperty('/keywords');

            // use bag contract in order to store translatable properties
            var tilePropertiesBag = oTileApi.bag.getBag('tileProperties');
            tilePropertiesBag.setText('display_title_text',       oConfigToSave.display_title_text);
            tilePropertiesBag.setText('display_subtitle_text',    oConfigToSave.display_subtitle_text);
            tilePropertiesBag.setText('display_info_text',        oConfigToSave.display_info_text);
            tilePropertiesBag.setText('display_search_keywords',  oConfigToSave.display_search_keywords);

            function logErrorAndReject(oError) {
                jQuery.sap.log.error(oError, null, "zui5_hrxx_graph.Graph.controller");
            }

            // saving the relevant properteis
            tilePropertiesBag.save(
                // success handler
                function () {
                    jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");

                    // update the local tile's config - saving changes on the Model
                    this.getView().getModel().setProperty("/config", oConfigToSave);

                    // update tile's model for changes to appear immediately
                    // (and not wait for the refresh handler which happens every 10 seconds)
                    this.getView().getModel().setProperty('/data/display_title_text',     oConfigToSave.display_title_text);
                    this.getView().getModel().setProperty('/data/display_subtitle_text',  oConfigToSave.display_subtitle_text);
                    this.getView().getModel().setProperty('/data/display_info_text',      oConfigToSave.display_info_text);

                    // call to refresh model which (due to the binding) will refresh the tile
                    this.getView().getModel().refresh();
                }.bind(this),
                logErrorAndReject // error handler
            );
        },
        // configuration save handler
        onSaveConfiguration: function (oConfigurationView) {
            var
            // the deferred object required from the configurationUi contract
                oDeferred = jQuery.Deferred(),
                oModel = oConfigurationView.getModel(),
            // tile model placed into configuration model by getConfigurationUi
                oTileModel = oModel.getProperty("/tileModel"),
                oTileApi = oConfigurationView.getViewData().chip,
                aTileNavigationActions = sap.ushell.components.tiles.utils.tileActionsRows2TileActionsArray(oModel.getProperty("/config/tile_actions_rows")),
            // get the configuration to save from the model
                configToSave = {
                    display_icon_url : oModel.getProperty("/config/display_icon_url"),
                    display_number_unit : oModel.getProperty("/config/display_number_unit"),
                    service_url: oModel.getProperty("/config/service_url"),
                    service_refresh_interval: oModel.getProperty("/config/service_refresh_interval"),
                    navigation_use_semantic_object : oModel.getProperty("/config/navigation_use_semantic_object"),
                    navigation_target_url : oModel.getProperty("/config/navigation_target_url"),
                    navigation_semantic_object : jQuery.trim(oModel.getProperty("/config/navigation_semantic_object")) || "",
                    navigation_semantic_action : jQuery.trim(oModel.getProperty("/config/navigation_semantic_action")) || "",
                    navigation_semantic_parameters : jQuery.trim(oModel.getProperty("/config/navigation_semantic_parameters")),
                    display_search_keywords: oModel.getProperty("/config/display_search_keywords")
                };
            //If the input fields icon, semantic object and action are failing the input validations, then through an error message requesting the user to enter/correct those fields
            var bReject = sap.ushell.components.tiles.utils.checkInputOnSaveConfig(oConfigurationView);
            if (!bReject) {
                bReject = sap.ushell.components.tiles.utils.checkTileActions(oConfigurationView);
            }
            if (bReject) {
                oDeferred.reject("mandatory_fields_missing");
                return oDeferred.promise();
            }
            // overwrite target URL in case of semantic object navigation
            if (configToSave.navigation_use_semantic_object) {
                configToSave.navigation_target_url = sap.ushell.components.tiles.utilsRT.getSemanticNavigationUrl(configToSave);
                oModel.setProperty("/config/navigation_target_url", configToSave.navigation_target_url);
            }

            // use bag contract in order to store translatable properties
            var tilePropertiesBag = oTileApi.bag.getBag('tileProperties');
            tilePropertiesBag.setText('display_title_text', oModel.getProperty("/config/display_title_text"));
            tilePropertiesBag.setText('display_subtitle_text', oModel.getProperty("/config/display_subtitle_text"));
            tilePropertiesBag.setText('display_info_text', oModel.getProperty("/config/display_info_text"));
            tilePropertiesBag.setText('display_search_keywords', configToSave.display_search_keywords);

            var tileNavigationActionsBag = oTileApi.bag.getBag('tileNavigationActions');
            //forward populating of tile navigation actions array into the bag, to Utils
            sap.ushell.components.tiles.utils.populateTileNavigationActionsBag(tileNavigationActionsBag, aTileNavigationActions);

            function logErrorAndReject(oError, oErrorInfo) {
                jQuery.sap.log.error(oError, null, "zui5_hrxx_graph.Graph.controller");
                oDeferred.reject(oError, oErrorInfo);
            }

            // use configuration contract to write parameter values
            oTileApi.writeConfiguration.setParameterValues(
                {tileConfiguration : JSON.stringify(configToSave)},
                // success handler
                function () {
                    var oConfigurationConfig = sap.ushell.components.tiles.utilsRT.getConfiguration(oTileApi, false, false),
                    // get tile config data in admin mode
                        oTileConfig = sap.ushell.components.tiles.utilsRT.getConfiguration(oTileApi, true, false),
                    // switching the model under the tile -> keep the tile model
                        oModel = new sap.ui.model.json.JSONModel({
                            config: oConfigurationConfig,
                            // keep tile model
                            tileModel: oTileModel
                        });
                    oConfigurationView.setModel(oModel);
                    console.log(oConfigurationConfig);

                    // update tile model
                    oTileModel.setData({data: oTileConfig, nav: {navigation_target_url: ""}}, false);
                    if (oTileApi.preview) {
                        oTileApi.preview.setTargetUrl(oConfigurationConfig.navigation_target_url);
                        oTileApi.preview.setPreviewIcon(oConfigurationConfig.display_icon_url);
                        oTileApi.preview.setPreviewTitle(oConfigurationConfig.display_title_text);
                    }

                    tilePropertiesBag.save(
                        // success handler
                        function () {
                            jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");
                            // update possibly changed values via contracts
                            if (oTileApi.title) {
                                oTileApi.title.setTitle(
                                    configToSave.display_title_text,
                                    // success handler
                                    function () {
                                        oDeferred.resolve();
                                    },
                                    logErrorAndReject // error handler
                                );
                            } else {
                                oDeferred.resolve();
                            }
                        },
                        logErrorAndReject // error handler
                    );

                    tileNavigationActionsBag.save(
                        // success handler
                        function () {
                            jQuery.sap.log.debug("property bag 'navigationProperties' saved successfully");
                        },
                        logErrorAndReject // error handler
                    );
                },
                logErrorAndReject // error handler
            );

            return oDeferred.promise();
        },

        successHandleFn: function (oResult) {
            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var oData = oResult,
                oDataToDisplay;
            if (typeof oResult === "object") {
                var uriParamInlinecount = jQuery.sap.getUriParameters(oConfig.service_url).get("$inlinecount");
                if (uriParamInlinecount && uriParamInlinecount === "allpages") {
                    oData = {number: oResult.__count};
                } else {
                    oData = this.extractData(oData);
                }
            } else if (typeof oResult === "string") {
                oData = {number: oResult};
            }
            oDataToDisplay = sap.ushell.components.tiles.utilsRT.getDataToDisplay(oConfig, oData);
            
            // Number -> String 으로 변환
            oDataToDisplay.display_number_value = oData.number ;
            
            
            // set data to display
            this.getView().getModel().setProperty("/data", oDataToDisplay);

            // rewrite target URL
            this.getView().getModel().setProperty("/nav/navigation_target_url",
                sap.ushell.components.tiles.utilsRT.addParamsToUrl(
                    this.navigationTargetUrl,
                    oDataToDisplay
                ));
        },

        // error handler
        errorHandlerFn: function (oMessage) {
            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var sMessage = oMessage && oMessage.message ? oMessage.message : oMessage,
                oResourceBundle = sap.ushell.components.tiles.utils.getResourceBundleModel()
                    .getResourceBundle();
            if (oMessage.response) {
                sMessage += " - " + oMessage.response.statusCode + " "
                    + oMessage.response.statusText;
            }
            // log in English only
            jQuery.sap.log.error(
                "Failed to update data via service "
                    + oConfig.service_url
                    + ": " + sMessage,
                null,
                "zui5_hrxx_graph.Graph"
            );
            this.getView().getModel().setProperty("/data",
                sap.ushell.components.tiles.utilsRT.getDataToDisplay(oConfig, {
                    number: "???",
                    info: oResourceBundle.getText("dynamic_data.error"),
                    infoState: "Critical"
                })
            );
        },

        // configuration cancel handler
        onCancelConfiguration: function (oConfigurationView, successHandler, errorHandle) {
            // re-load old configuration and display
            var oViewData = oConfigurationView.getViewData(),
                oModel = oConfigurationView.getModel(),
            // tile model placed into configuration model by getConfigurationUi
                oTileModel = oModel.getProperty("/tileModel"),
                oTileApi = oViewData.chip,
                oCurrentConfig = sap.ushell.components.tiles.utilsRT.getConfiguration(oTileApi, false, false);
            oConfigurationView.getModel().setData({config: oCurrentConfig, tileModel: oTileModel}, false);
        },
        // loads data from backend service
        loadData: function (nservice_refresh_interval) {
            var oDynamicTileView = this.getView(),
                oConfig = oDynamicTileView.getModel().getProperty("/config"),
                sUrl = oConfig.service_url,
                that = this;
            var oTileApi = this.getView().getViewData().chip;
            if (!sUrl) {
                return;
            }
            if (/;o=([;\/?]|$)/.test(sUrl)) { // URL has placeholder segment parameter ;o=
                sUrl = oTileApi.url.addSystemToServiceUrl(sUrl);
            }
            //set the timer if required
            if (nservice_refresh_interval > 0) {
                // log in English only
                jQuery.sap.log.info(
                    "Wait " + nservice_refresh_interval + " seconds before calling "
                    + oConfig.service_url + " again",
                    null,
                    "zui5_hrxx_graph.Graph.controller"
                );
                // call again later
                this.timer = setTimeout(that.loadData.bind(that, nservice_refresh_interval, false), (nservice_refresh_interval * 1000));
            }

            // Verify the the Tile visibility is "true" in order to issue an oData request
            if (oTileApi.visible.isVisible() && !that.oDataRequest) {
                this.bIsDataRequested = true;
                that.oDataRequest = OData.read(
                    {
                        requestUri: sUrl,
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            "Pragma": "no-cache",
                            "Expires": "0"
                        }
                    },
                    // sucess handler
                    this.successHandleFn.bind(this),
                    this.errorHandlerFn.bind(this)
                ); // End of oData.read
            }
        },
        // loads data once if not in configuration mode
        refreshHandler: function (oDynamicTileController) {
            var oTileApi = oDynamicTileController.getView().getViewData().chip;
            if (!oTileApi.configurationUi.isEnabled()) {
                oDynamicTileController.loadData(0);
            } else {
                oDynamicTileController.stopRequests();
            }
        },

        // load data in place in case setting visibility from false to true
        // with no additional timer registered
        visibleHandler: function (isVisible) {
            var oView = this.getView(),
                oConfig = oView.getModel().getProperty("/config"),
                nservice_refresh_interval = oConfig.service_refresh_interval;
//            if (isVisible) {
//                if (!this.bIsDataRequested) {
//                    //tile is visible and data wasn't requested yet
//                    this.refreshHandler(this);
//                }
//                if (nservice_refresh_interval) {
//                    //tile is visible and the refresh interval isn't set to 0
//                    this.refreshHandler(this);
//                }
//            } else {
//                this.stopRequests();
//            }
            if (!this.bIsDataRequested) {
              //tile is visible and data wasn't requested yet
              this.refreshHandler(this);
            }
            if (nservice_refresh_interval) {
              //tile is visible and the refresh interval isn't set to 0
              this.refreshHandler(this);
            }
        }

    });
}());
