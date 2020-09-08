// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){
	"use strict";
	sap.ui.getCore().loadLibrary("sap.m");
	jQuery.sap.require("sap.ui.core.IconPool");
	jQuery.sap.require("sap.ui.thirdparty.datajs");
	jQuery.sap.require("sap.ushell.components.tiles.utils");
	jQuery.sap.require("sap.ushell.components.tiles.utilsRT");
	jQuery.sap.require("sap.m.MessageBox");
	
	
	sap.ui.controller("zui5_hrxx_imagetile.Imagetile",{
//	sap.ui.controller("sap.ushell.components.tiles.zui5_hrxx_imagetile.Imagetile",{
		timer:null,
		oDataRequest:null,
		_JSonModel : new sap.ui.model.json.JSONModel(),
		obusyIndicatorNormalId : null, 
		PAGEID : "zui5_hrxx_imagetile",
		
		onInit:function(){
			var v=this.getView(),
			V=v.getViewData(),
			t=V.chip,
			c=sap.ushell.components.tiles.utilsRT.getConfiguration(t,t.configurationUi.isEnabled(),false),
//			c=sap.ushell.components.tiles.utilsRT.getConfiguration(t,true,false),
			m,k,K,a=this,N=c.navigation_target_url,s;
			
			// 시맨틱오브젝트 별로 타일 background image 설정
			var oObject = c.navigation_semantic_object;
			/* 
			 * 같은 시맨틱 오브젝트 내에서 권한별로 이미지가 달라져야한다면 c.navigation_semantic_action 으로 권한 체크해야함
			 * ESS : display
			 * MSS : manage
			 * HASS : approve
			 * */
			
			switch (oObject){
				//////////////////////////////////////	
				case "ZHR_PAYSTUB": // 급상여명세서
					v.addStyleClass("backgroundImage1");
					jQuery(v.sId).css({"background":"url(/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/image/payroll.jpg)", 'background-repeat' : 'no-repeat', 'background-position':'center center'});
					break;	
				case "ZHR_ORGCHART": // 화상조직도
					v.addStyleClass("backgroundImage2");
					break;	
				case "ZHR_EMPPROFILE" : // 사원프로파일 (HASS)
				case "ZHR_PERSON": // 사원프로파일 (MSS)
					v.addStyleClass("backgroundImage3");
					break;	
				case "ZHR_OVERVIEW": // 신청문서 Overview
					v.addStyleClass("backgroundImage4");
					break;	
				case "ZHR_MANPOWER": // Manpower Report
					v.addStyleClass("backgroundImage5");
					break;
				case "ZHR_PROD_EVALUATION_ADJUST": // 생산직 평가점수 조정
					v.addStyleClass("backgroundImage6");
					break;
				default :
					v.addStyleClass("backgroundImage1");
					break;
			}
			
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
			
			var oController = this.getView().getController(); 
			if(t == "#ZHR_PAYSTUB-display" || t == "#ZHR_PROD_EVALUATION_ADJUST-manage" ||  t == "#ZHR_PROD_PROMOTION_EVALUATION-manage" ){
				if(!oController._Password){
					oController._Password = sap.ui.jsfragment("zui5_hrxx_imagetile.fragment.Password", oController);
				}
				sap.ui.getCore().byId(oController.PAGEID + "_Secpw").setValue("");
				oController._Password.open();
			}else{
				T.configurationUi.display();
				hasher.setHash(t);
			}
		},
		
		
		SHA256 : function(s){
		      
	        var chrsz   = 8;
	        var hexcase = 0;
	      
	        function safe_add (x, y) {
	            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	            return (msw << 16) | (lsw & 0xFFFF);
	        }
	      
	        function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
	        function R (X, n) { return ( X >>> n ); }
	        function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	        function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	        function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	        function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	        function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	        function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
	      
	        function core_sha256 (m, l) {
	             
	            var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
	                0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	                0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
	                0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	                0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
	                0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	                0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
	                0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	                0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
	                0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	                0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
	 
	            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 
	                       0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
	 
	            var W = new Array(64);
	            var a, b, c, d, e, f, g, h, i, j;
	            var T1, T2;
	      
	            m[l >> 5] |= 0x80 << (24 - l % 32);
	            m[((l + 64 >> 9) << 4) + 15] = l;
	      
	            for ( var i = 0; i<m.length; i+=16 ) {
	                a = HASH[0];
	                b = HASH[1];
	                c = HASH[2];
	                d = HASH[3];
	                e = HASH[4];
	                f = HASH[5];
	                g = HASH[6];
	                h = HASH[7];
	      
	                for ( var j = 0; j<64; j++) {
	                    if (j < 16) W[j] = m[j + i];
	                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
	      
	                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
	                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));
	      
	                    h = g;
	                    g = f;
	                    f = e;
	                    e = safe_add(d, T1);
	                    d = c;
	                    c = b;
	                    b = a;
	                    a = safe_add(T1, T2);
	                }
	      
	                HASH[0] = safe_add(a, HASH[0]);
	                HASH[1] = safe_add(b, HASH[1]);
	                HASH[2] = safe_add(c, HASH[2]);
	                HASH[3] = safe_add(d, HASH[3]);
	                HASH[4] = safe_add(e, HASH[4]);
	                HASH[5] = safe_add(f, HASH[5]);
	                HASH[6] = safe_add(g, HASH[6]);
	                HASH[7] = safe_add(h, HASH[7]);
	            }
	            return HASH;
	        }
	      
	        function str2binb (str) {
	            var bin = Array();
	            var mask = (1 << chrsz) - 1;
	            for(var i = 0; i < str.length * chrsz; i += chrsz) {
	                bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
	            }
	            return bin;
	        }
	      
	        function Utf8Encode(string) {
	            string = string.replace(/\r\n/g,"\n");
	            var utftext = "";
	      
	            for (var n = 0; n < string.length; n++) {
	      
	                var c = string.charCodeAt(n);
	      
	                if (c < 128) {
	                    utftext += String.fromCharCode(c);
	                }
	                else if((c > 127) && (c < 2048)) {
	                    utftext += String.fromCharCode((c >> 6) | 192);
	                    utftext += String.fromCharCode((c & 63) | 128);
	                }
	                else {
	                    utftext += String.fromCharCode((c >> 12) | 224);
	                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                    utftext += String.fromCharCode((c & 63) | 128);
	                }
	      
	            }
	      
	            return utftext;
	        }
	      
	        function binb2hex (binarray) {
	            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	            var str = "";
	            for(var i = 0; i < binarray.length * 4; i++) {
	                str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
	                hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
	            }
	            return str;
	        }
	      
	        s = Utf8Encode(s);
	        return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
	      
	    },
		
		onCheckPassword  : function(oController, oEvent){
			var pw = sap.ui.getCore().byId(oController.PAGEID + "_Secpw").getValue();
			
			var createData = { "Prcty" : "C" , "Secpw" :  oController.SHA256(pw) };
			
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_PAYSLIP_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"}, undefined, undefined, true);
			oModel.create("/PaySlipPasswordSet", createData, {
				success : function(data, res) {
					oController.onMovePaystub(oController);
				},
				error : function (Res) {
					if(!Res || !Res.response || !Res.response.body) return null;
					
					var errData = {}, 
						errorJSON = null;
					
					errData.Error = "E";
					
					try {
						errorJSON = JSON.parse(Res.response.body);
						
						if(errorJSON.error.innererror.errordetails && errorJSON.error.innererror.errordetails.length) {
							errData.ErrorMessage = errorJSON.error.innererror.errordetails[0].message;
						} else if(errorJSON.error.message) {
								errData.ErrorMessage = errorJSON.error.message.value;
						} else {
							errData.ErrorMessage = "Error 발생." ;
						}
					} catch(ex) {
						errData.ErrorMessage = Res.message;
					}
					
					sap.m.MessageBox.error(errData.ErrorMessage,"오류");
				}
			});
		},
		
		onMovePaystub:function(oController){
			console.log(oController);
			var v=this.getView(),
			V=v.getViewData(),
			m=v.getModel(),
			t=m.getProperty("/nav/navigation_target_url"),
			T=V.chip;
			T.configurationUi.display();
			hasher.setHash(t);
			
			var oController = this.getView().getController(); 
			oController._Password.close();
			
		},
		
		onInitPassword  : function(oController, oEvent){
			var createData = { "Prcty" : "N"};
			
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_PAYSLIP_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"}, undefined, undefined, true);
			oModel.create("/PaySlipPasswordSet", createData, {
				success : function(data, res) {
					sap.m.MessageBox.success("비밀번호 초기화를 완료하였습니다.", {
						title : "성공",
						onClose : function(){
							oController._PasswordChange.close();
						}
					});
				},
				error : function (Res) {
					if(!Res || !Res.response || !Res.response.body) return null;
					
					var errData = {}, 
						errorJSON = null;
					
					errData.Error = "E";
					
					try {
						errorJSON = JSON.parse(Res.response.body);
						
						if(errorJSON.error.innererror.errordetails && errorJSON.error.innererror.errordetails.length) {
							errData.ErrorMessage = errorJSON.error.innererror.errordetails[0].message;
						} else if(errorJSON.error.message) {
								errData.ErrorMessage = errorJSON.error.message.value;
						} else {
							errData.ErrorMessage = "Error 발생." ;
						}
					} catch(ex) {
						errData.ErrorMessage = Res.message;
					}
					
					sap.m.MessageBox.error(errData.ErrorMessage,"오류");
				}
			});
		},
		
		openPasswordChange : function(oController, oEvent){
			if(!oController._PasswordChange){
				oController._PasswordChange = sap.ui.jsfragment("zui5_hrxx_imagetile.fragment.PasswordChange", oController);
			}
			sap.ui.getCore().byId(oController.PAGEID + "_CSecpw").setValue("");
			sap.ui.getCore().byId(oController.PAGEID + "_CSecpw2").setValue("");
			sap.ui.getCore().byId(oController.PAGEID + "_CSecpw3").setValue("");
			oController._PasswordChange.open();
		},
		
		onChangePassword  : function(oController, oEvent){
			var pw = sap.ui.getCore().byId(oController.PAGEID + "_CSecpw").getValue(),
				pw2 = sap.ui.getCore().byId(oController.PAGEID + "_CSecpw2").getValue(),
				pw3 = sap.ui.getCore().byId(oController.PAGEID + "_CSecpw3").getValue();
			
			var createData = { "Prcty" : "S" , "SecpwOrg" :  oController.SHA256(pw), "SecpwChg1" :  oController.SHA256(pw2), "SecpwChg2" :  oController.SHA256(pw3) };
			
			
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_PAYSLIP_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"}, undefined, undefined, true);
			oModel.create("/PaySlipPasswordSet", createData, {
				success : function(data, res) {
					sap.m.MessageBox.success("비밀번호 변경을 완료하였습니다.", {
						title : "성공",
						onClose : function(){
							oController._PasswordChange.close();
						}
					});		
				},
				error : function (Res) {
					if(!Res || !Res.response || !Res.response.body) return null;
					
					var errData = {}, 
						errorJSON = null;
					
					errData.Error = "E";
					
					try {
						errorJSON = JSON.parse(Res.response.body);
						
						if(errorJSON.error.innererror.errordetails && errorJSON.error.innererror.errordetails.length) {
							errData.ErrorMessage = errorJSON.error.innererror.errordetails[0].message;
						} else if(errorJSON.error.message) {
								errData.ErrorMessage = errorJSON.error.message.value;
						} else {
							errData.ErrorMessage = "Error 발생." ;
						}
					} catch(ex) {
						errData.ErrorMessage = Res.message;
					}
					
					sap.m.MessageBox.error(errData.ErrorMessage,"오류");
				}
			});
		},
		
		onUpdateDynamicData:function(){
			var v=this.getView(),
			c=v.getModel().getProperty("/config"),
			n=c.service_refresh_interval;
			if(!n){n=0;}
			else if(n<10){
				jQuery.sap.log.warning("Refresh Interval "+n+" seconds for service URL "+c.service_url+" is less than 10 seconds, which is not supported. "+"Increased to 10 seconds automatically.",null,"zui5_hrxx_imagetile.Imagetile.controller");
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
                jQuery.sap.log.error(oError, null, "zui5_hrxx_imagetile.Imagetile.controller");
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
                jQuery.sap.log.error(oError, null, "zui5_hrxx_imagetile.Imagetile.controller");
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
//            oDataToDisplay.display_number_value = oData.number ;
            // url
            
            
            
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
                "zui5_hrxx_imagetile.Imagetile"
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
                    "zui5_hrxx_imagetile.Imagetile.controller"
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
