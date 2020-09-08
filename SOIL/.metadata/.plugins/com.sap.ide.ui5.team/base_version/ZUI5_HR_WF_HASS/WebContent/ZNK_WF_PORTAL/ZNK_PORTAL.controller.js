jQuery.sap.require("control.BusyIndicator");
jQuery.sap.require("common.TooltipProfile");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("control.ZNK_BusyAccessor");
//jQuery.sap.require("common.ZNK_MBOLayout");
//jQuery.sap.require("control.ZNK_MBOController");
$.sap.require("control.ZNK_Valid");
$.sap.require("common.ZNK_TABLES");
$.sap.require("common.Common");
$.sap.require("common.ZNK_MyValue");
$.sap.require("control.ZNK_Length");
$.sap.require("common.ZNK_OrgTree");
$.sap.require("common.ZNK_PerInfo");
sap.ui
		.controller(
				"ZNK_WF_PORTAL.ZNK_PORTAL",
				{
					/**
					 * Is initially called once after the Controller has been
					 * instantiated. It is the place where the UI is
					 * constructed. Since the Controller is given to this
					 * method, its event handlers can be attached right away.
					 * 
					 * @memberOf ZNK_WF_PORTAL.ZNK_PORTAL
					 */

					PAGEID : "ZNK_PORTAL",
					_Auth : "",
					_Ename : "",
					oLoadGui : "",
					currentKey : "",    
					vStats : "",
					oPageTitles : [],
					oSideKeys : [],
					oPageURLs : [],
					oParams : [],
					oBackyn : [],
					oPrgtp : [],
					onInit : function() {

//						if (!jQuery.support.touch) {
//							this.getView().addStyleClass("sapUiSizeCompact");
//						};

						this.getView().addEventDelegate({
							onBeforeShow : jQuery.proxy(function(evt) {
								this.onBeforeShow(evt);
							}, this)
						});

						this.getView().addEventDelegate({
							onAfterRendering : jQuery.proxy(function(evt) {
								this.onAfterRender(evt);
							}, this),
						});
						
						var bus = sap.ui.getCore().getEventBus();
						bus.subscribe("app", "OpenWindow", this.SmartSizing,
								this);

						var bus2 = sap.ui.getCore().getEventBus();
						bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
								this);
						
						var myPage = sap.ui.getCore().byId(this.PAGEID+"_notUnifiedSpllit");
						myPage.addDetailPage(sap.ui.jsview("ZNK_WF_PORTAL.ZNK_MAIN", "ZNK_WF_PORTAL.ZNK_MAIN"));
						myPage.addDetailPage(sap.ui.jsview("ZNK_WF_DUMMY.ZNK_WF_DUMMY", "ZNK_WF_DUMMY.ZNK_WF_DUMMY"));
					},
					
					SmartSizing : function(oEvent){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
					},

					onBeforeShow : function(oEvent) {
						this.loadProfile(oEvent);
						this.loadMenu(oEvent);
						var oTitle = sap.ui.getCore().byId(this.PAGEID + "_MyTitle");
						oTitle.setText("복리 후생");
						
						var myPage = sap.ui.getCore().byId(this.PAGEID+"_notUnifiedSpllit");
						myPage.toDetail("ZNK_WF_PORTAL.ZNK_MAIN");
						
					},

					onAfterRender : function(oEvent) {},
					
					loadProfile : function(oEvent){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var oModel = sap.ui.getCore().getModel("ZNK_COMMON");
						var oPath = "/GetLoginInfoSet";

//						var oWelcomeName = sap.ui.getCore().byId(oController.PAGEID + "_WelcomeName");
//						if(gLoginInfo && gLoginInfo.Jikwinm){
//							if(gLoginInfo.Jikch == "37"){
//								oWelcomeName.setText(gEname + " "+ gLoginInfo.Jikwinm + "님 환영합니다.");
//							} else {
//								oWelcomeName.setText(gEname + " "+ gLoginInfo.Jikchnm + "님 환영합니다.");
//							}
//						} else {
//							oWelcomeName.setText(gEname + "님 환영합니다.");
//						}
						oController.itemCase();
					},
					onBackHome : function(oEvent){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var myPage = sap.ui.getCore().byId(oController.PAGEID+"_notUnifiedSpllit");
						oController.onPressHome(oEvent);
					},
					onFullScreen : function(oEvent){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var oToolPage = sap.ui.getCore().byId(
								oController.PAGEID + "_toolPage");
						var sideExpanded = oToolPage.getSideExpanded();
						oController._setToggleButtonTooltip(sideExpanded);
						oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
						oController.itemCase();
						oController.SmartSizing();
						
					},
					
					SmartSizing : function(oEvent){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController(); 
						var oDetailPages = sap.ui.getCore().byId(oController.PAGEID+"_notUnifiedSpllit")._aDetailPages ;
						if(!oDetailPages) return;
						var oDetailView = oDetailPages[oDetailPages.length-1];
						if(oDetailView){
							var oDetailController = oDetailView.getController();
							if(oDetailController)	oDetailController.SmartSizing();
						}

					},
					
					onExpanding : function(oEvent) {
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var oToolPage = sap.ui.getCore().byId(
								oController.PAGEID + "_toolPage");
						var sideExpanded = oToolPage.getSideExpanded();
						oController._setToggleButtonTooltip(sideExpanded);
						oToolPage.setSideExpanded(false);
						oController.itemCase();
					},

					_setToggleButtonTooltip : function(bLarge) {
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var toggleButton = sap.ui.getCore().byId(
								oController.PAGEID+"_FullScreenBtn");
						if (bLarge) {
							toggleButton.setTooltip('누르면 작아집니다.');
							toggleButton.setIcon("sap-icon://exit-full-screen");
						} else {
							toggleButton.setTooltip('누르면 커집니다.');
							toggleButton.setIcon("sap-icon://full-screen");
						}
					},
					
					itemCase : function() {
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var oToolPage = sap.ui.getCore().byId(
								oController.PAGEID + "_toolPage");
						setTimeout(
								function() {
									for (var i = 0; i < 50; i++) {
										eval('$("#__item'
												+ i
												+ ' > span").css("font-weight", "normal");');
									}
								}, 1);
					},
					
					loadMenu : function(oEvent){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var oModel = sap.ui.getCore().getModel("ZNK_COMMON");
//						var oPath = "/GetMenuInfoSet";
//						oPath += "?$filter=Mtype%20eq%20%27" + "06" + "%27";
//						for(var i=0; i<gAuth.length; i++){
//							if(i == 0){
//								oPath += "%20and%20(";
//							}
//							
//							if(i == gAuth.length-1){
//								oPath += "Auth%20eq%20%27" + gAuth[i] + "%27" + ")";
//							}
//							else oPath += "Auth%20eq%20%27" + gAuth[i] + "%27%20or%20";
//							
//						}
						var vGetMenuInfoSet = [{ Auth : "E" , Backyn : "X", Icon : "hr-approval", Menuid :"60000000" , 
							                     Mname : "복리후생 신청관리",  Mtype : "06", Param : "", Prgtp : "1" , Upmid : "",  Url : ""},
						                       { Auth : "E" , Backyn : "X", Icon : "collaborate", Menuid :"60000001" , 
							                     Mname : "의료비 신청",  Mtype : "06", Param : "", Prgtp : "1" , Upmid : "60000000",  Url : "ZUI5_HR_Medical.ZUI5_HR_MedicalList"},
							                    { Auth : "E" , Backyn : "X", Icon : "collaborate", Menuid :"60000002" , 
								                Mname : "의료비 신청관리",  Mtype : "06", Param : "", Prgtp : "1" , Upmid : "60000000",  Url : "ZUI5_HR_MedicalHA.ZUI5_HR_MedicalList"},
								                { Auth : "E" , Backyn : "X", Icon : "collaborate", Menuid :"60000003" , 
							                     Mname : "학자금 신청",  Mtype : "06", Param : "", Prgtp : "1" , Upmid : "60000000",  Url : "ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipList"}, 
								                 { Auth : "E" , Backyn : "X", Icon : "collaborate", Menuid :"60000004" , 
							                     Mname : "학자금 신청관리",  Mtype : "06", Param : "", Prgtp : "1" , Upmid : "60000000",  Url : "ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList"} 
							                   ];
						
						oController.oSideMenus = new Array();
						oController.oSideIcons = new Array();
						oController.oSideKeys = new Array();
						oController.oParentIds = new Array();
						oController.oPrgtp = new Array();
						
						var oCheckIds = new Array();
						var oCheckNotIds = new Array();
						for(var i = 0; i < vGetMenuInfoSet.length; i++){
							oController.oSideMenus.push(vGetMenuInfoSet[i].Mname);
							oController.oSideIcons.push("sap-icon://" + vGetMenuInfoSet[i].Icon);
							oController.oSideKeys.push(vGetMenuInfoSet[i].Menuid);
							oController.oParentIds.push(vGetMenuInfoSet[i].Upmid);
							oController.oPageURLs.push(vGetMenuInfoSet[i].Url);
							oController.oParams.push(vGetMenuInfoSet[i].Param);
							oController.oBackyn.push(vGetMenuInfoSet[i].Backyn);
							oController.oPrgtp.push(vGetMenuInfoSet[i].Prgtp);
							
						}
//						oModel.read(oPath,null,null,false,function(Data,Res){
//							if(Data && Data.results.length){
//								oController.Error = "";
//								for(var i=0; i<Data.results.length;i++){
//									oController.oSideMenus.push(Data.results[i].Mname);
//									oController.oSideIcons.push("sap-icon://" + Data.results[i].Icon);
//									oController.oSideKeys.push(Data.results[i].Menuid);
//									oController.oParentIds.push(Data.results[i].Upmid);
//									oController.oPageURLs.push(Data.results[i].Url);
//									oController.oParams.push(Data.results[i].Param);
//									oController.oBackyn.push(Data.results[i].Backyn);
//									oController.oPrgtp.push(Data.results[i].Prgtp);
//								}
//								oController.oPageURLs.push("ZNK_WF_DUMMY.ZNK_WF_DUMMY");
//							}
//						},function(Res){
//							console.log(Res);
//							if(Res.response.body){
//								var ErrorMessage = Res.response.body;
//								var ErrorJSON = JSON.parse(ErrorMessage);
//								oController.Error = "E"; 
//								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
//									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
//								}
//							}
//							return;
//						});
						var oNumb = 0;
						var oParentGroup = oController.oParentIds;
						if(oParentGroup && oParentGroup.length){
							for(var i=0;i<oParentGroup.length;i++){
								if(oParentGroup[i] !=""){
									oCheckIds.push(oNumb);
								}else{
									oCheckNotIds.push(oNumb);
								}
								oNumb++;
							}
						}
						var oIdentities = 0;
						var oCustomDatas = new Array();
						var oSideLists = sap.ui.getCore().byId(oController.PAGEID + "_sideNaviList");
//						// Main Text 구현 
//						var oSideItems = new sap.tnt.NavigationListItem(oController.PAGEID
//								+ "_MainItem",{
//							text : "복리후생",
//							key :  "Top"
//						}).addStyleClass("L2P26Font");
//						oSideLists.addItem(oSideItems);
						
						if(oController.oSideMenus && oController.oSideMenus.length){
							for(var i=0;i<oController.oSideMenus.length;i++){
								if(oCheckNotIds && oCheckNotIds.length){
									for(var a=0;a<oCheckNotIds.length;a++){
										if(oCheckNotIds[a] == i){
											oIdentities++;
											var oSideItems = new sap.tnt.NavigationListItem(oController.PAGEID
													+ "_Item" + oIdentities,{
												text : oController.oSideMenus[i],
												key :  oController.oSideKeys[i],
												icon : oController.oSideIcons[i],
											}).addCustomData(new sap.ui.core.CustomData({key : "Uri", value : oController.oPageURLs[i]}))
											.addCustomData(new sap.ui.core.CustomData({key : "Name", value : oController.oSideMenus[i]}));
											if(oIdentities==1)
												oSideItems.setExpanded(true);
											else
												oSideItems.setExpanded(false);
																						
											for(var b=0;b<oCheckIds.length;b++){
												if(oSideItems.getKey()== oParentGroup[oCheckIds[b]]){
													oSideItems.addItem(new sap.tnt.NavigationListItem({
														text : oController.oSideMenus[oCheckIds[b]],
														key :  oController.oSideKeys[oCheckIds[b]]
													}).addCustomData(new sap.ui.core.CustomData({key : "Uri", value : oController.oPageURLs[oCheckIds[b]]}))
													.addCustomData(new sap.ui.core.CustomData({key : "Name", value : oController.oSideMenus[oCheckIds[b]]})));
												}
											}
										}
										oSideLists.addItem(oSideItems);
										}							
								}							
							}									
						}
		//				control.ZNK_BusyAccessor.onBusy(oEvent, oController);
						var oContent = sap.ui.getCore().byId(oController.PAGEID+"_notUnifiedSpllit");
						for(var i=0;i<oController.oPageURLs.length;i++){
							if(oController.oPageURLs[i]!=""){
								try {
//									oContent.addDetailPage(sap.ui.jsview(oController.oPageURLs[i], oController.oPageURLs[i]));
								} catch (e) {
									console.log(e);
									sap.m.MessageBox.alert("메뉴셋팅에 이상이 있습니다.",{title : "안내"});
								}
							}
						}			 					
					},
					
					onGotoBaseScreen : function(oEvent) {
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var oToolPage = sap.ui.getCore().byId(
								oController.PAGEID + "_toolPage");
						oToolPage.removeAllMainContents();			
						oController.oLoadGui = "";
						if(oController.currentKey == "H"){
							oController.onSelectSideTab(null, oController.pastKey);
						}else{
							//oController.pastKey = oController.currentKey;
							oController.pastKey = "H";
							oController.currentKey = "H";
							oController.onSelectSideTab(null, oController.currentKey);
						}
					},

					onRefresh : function(oKey){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_MyTitle");
						var myPage = sap.ui.getCore().byId(oController.PAGEID+"_notUnifiedSpllit");
						
					},
					
					onPressHome : function(oEvent){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						
						var myPage = sap.ui.getCore().byId(oController.PAGEID + "_notUnifiedSpllit");
//						myPage.addDetailPage(sap.ui.jsview("ZNK_WF_PORTAL.ZNK_MAIN", "ZNK_WF_PORTAL.ZNK_MAIN"));
						myPage.toDetail("ZNK_WF_PORTAL.ZNK_MAIN");
						
						var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_MyTitle");
						oTitle.setText("복리 후생");	
					},
					
					onSelectSideTab : function(oEvent, oRepeatedKey) {
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_PORTAL");
						var oController = oView.getController();
						
//						common.Common.setMessage("ZNK_PORTAL", ""); 
						
						oController.No++;
						var dataCount = 0;
						oController.oLoadGui = "";
						var oToolPage = sap.ui.getCore().byId(
								oController.PAGEID + "_toolPage");
						var oSideNavi = sap.ui.getCore().byId(
								oController.PAGEID + "_sideNavi");
						var oItem1 = sap.ui.getCore().byId(
								oController.PAGEID + "_Item1");
						var oItem2 = sap.ui.getCore().byId(
								oController.PAGEID + "_Item2");
						var oPages = sap.ui.getCore().byId(
								oController.PAGEID + "_navPAGES");
						var oTitle = sap.ui.getCore().byId(
								oController.PAGEID + "_MyTitle");
						var oControllers = ["ZNK_APFTF.ZNK_FTF","ZNK_MSSGOAL.ZNK_Ourgoal","ZNK_APMBO.ZNK_MBO"];
						for(var i=0;i<oControllers.length;i++){
							var oViews = sap.ui.getCore().byId(oControllers[i]);
							if(oViews){
								var oControllers = oViews.getController();
								oControllers._Atopen = false;
							}
						}						
						if(oEvent){
							var oKey = oEvent.getParameter("item").getKey();							
							var oKey2 = oEvent.getParameter("item").getCustomData()[0].getValue("Uri");
							var oKey3 = oEvent.getParameter("item").getCustomData()[1].getValue("Name");
						}
						if(oRepeatedKey){
							var oKey = oRepeatedKey;
						}
						var oMainContent = new sap.m.Image(
								{
									src : "/sap/bc/ui5_ui5/sap/ZNK_COMMON_UI5/images/main01.png",
								});
						
						var oMainMatrix = new sap.ui.commons.layout.MatrixLayout({
							columns : 1,
							width : "100%",
							height : "800px"
						});
						var oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
						var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : oMainContent,
							hAlign : sap.ui.commons.layout.HAlign.Center,
							vAlign : sap.ui.commons.layout.VAlign.Middle
						});
						oRow.addCell(oCell);
						oMainMatrix.addRow(oRow);
						oController.currentKey = oKey;
						var myPage = sap.ui.getCore().byId(oController.PAGEID+"_notUnifiedSpllit");
						var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_MyTitle");	
						
						function onBack(nos){
							var oView = sap.ui.getCore().byId(oController.oPageURLs[nos]);
							var myController = oView.getController();
							myController.onBack();
						};
///////////////////////////////ADD PAGE LOGICS /////////////////////////////////////						
						for(var i=0;i<oController.oSideKeys.length;i++){
							if(oKey==oController.oSideKeys[i]){	
								oTitle.setText(oController.oSideMenus[i]);
								var nowAvail = true;
								for(var a=0;a<myPage.getDetailPages().length;a++){
									if(myPage.getDetailPages()[a].sId==oController.oPageURLs[i]){
										nowAvail = true;
										break;
									}else if(oController.oPageURLs[i]==""){
										nowAvail = true;
									}else{
										nowAvail = false;
									}
								}
								if(!nowAvail){
									myPage.addDetailPage(sap.ui.jsview(oController.oPageURLs[i], oController.oPageURLs[i]));
								}								
//////////////////////////////////////////////////////////////////////////////////////								
								if(oController.oPrgtp[i] == "1") {
									
									if(oController.oParentIds[i] == "" && oController.oPageURLs[i] == ""){
										
										var oIdentities = [];
										var oCheckNotIds = [];
										var oNumb = 0;
										var oNum = 1;
										var oParentGroup = oController.oParentIds;
										if(oParentGroup && oParentGroup.length){
											for(var a=0;a<oParentGroup.length;a++){
												if(oParentGroup[a] ==""){
													oCheckNotIds.push(oNumb);
													oIdentities.push(oNum);
													oNum++;
												}
												oNumb++;
											}
										}
										
										for(var b=0; b<oCheckNotIds.length; b++){
											if(oCheckNotIds[b] == i){
												var oSideItem = sap.ui.getCore().byId(oController.PAGEID + "_Item" + oIdentities[b]);
												if(oSideItem.getExpanded() == true){
													oSideItem.setExpanded(false);
												} else oSideItem.setExpanded(true);
											}
										}
										oTitle.setText("");
										break;
										
									}
									
									if(oController.oBackyn[i]=="X" && oController.oParams[i]==""){
										onBack(i);
									}
									if(oController.oParams[i]!="" && oController.oBackyn[i]=="X"){
										var oParam = oController.oParams[i];
										for(var a=0;a<oParam;a++){
											if((oParam-1)==a){
												onBack(i-a);
												myPage.toDetail(oController.oPageURLs[oController.oPageURLs.length-1]);
												myPage.toDetail(oController.oPageURLs[i-a],{Seqno : oParam});
												break;
											}
										}
									}else if(oController.oParams[i]!="" && oController.oBackyn[i]!="X"){
										var oParam = oController.oParams[i];
										for(var a=0;a<oParam;a++){
											if((oParam-1)==a){
												myPage.toDetail(oController.oPageURLs[oController.oPageURLs.length-1]);
//												myPage.toDetail(oController.oPageURLs[i-a],{Seqno : oParam});
												myPage.toDetail(oController.oPageURLs[i],{Seqno : oParam});
												break;
											}
										}
									}else{
										myPage.toDetail(oController.oPageURLs[i]);
										document.title = oController.oSideMenus[i];
										oTitle.setText(oController.oSideMenus[i]);
									}	
//									강연준
//									control.ZNK_Valid.ZNK_Valid(oKey2,oKey3,gPernr,"R","");
									break;
								} else {									
									var url = "http://" + location.hostname + ":" + location.port;
									
									var gui_url = url + "/sap/bc/gui/sap/its/webgui?~transaction=smen&~okcode=zhr_ap&~nosplash=1&sap-theme=sap_bluecrystal";
									
									//window.open(gui_url, "_blank", "fullscreen=yes,location=no", true);
									window.open(gui_url);
									break;
								}
							}
						}						
						oController.itemCase();
					},				
				});