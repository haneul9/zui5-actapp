jQuery.sap.require("ZUI5_HR_Atworg.MyControl.OrgChart");
jQuery.sap.require("control.TalentSearchPersonCard");

sap.ui.controller("ZUI5_HR_Atworg.Ac1", {

	org_chart : null,
	PAGEID : "Ac1",
	_SelectedObjid : "",
	_vSubOrgPersonList :new sap.ui.model.json.JSONModel(),
	_vOrgPersonList : new sap.ui.model.json.JSONModel(), 
	BusyDialog : new sap.m.BusyDialog(),
	
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Atworg.Ac1
	 */
	onInit : function() {

		this.getView().addStyleClass("sapUiSizeCompact");
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
	},

	onBeforeShow : function(oEvent) {
		this.onSearch();
	},
	
	_ResizeWindow : function(evt, evtId, data) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();
		var oRGCHART = sap.ui.getCore().byId(oController.PAGEID + "_myOrg");
		oRGCHART.setWidth(window.innerWidth);
		oRGCHART.setHeight(window.innerHeight-130);
	},
	
	onAfterRender : function(oEvent){
		
	},
	
	onSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();
		oController.makeTree();
	} ,
	
	makeTree : function(vOrgId){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();
		
		var OrgChart = sap.ui.getCore().byId(oController.PAGEID + "_myOrg" );
		
		var dateFormat = sap.ui.core.format.DateFormat
		.getDateTimeInstance({
			pattern : "yyyy-MM-dd"
		});

		var oModel = sap.ui.getCore().getModel("EIS");
		
		var jData = {
				tData : []
			};
			var oJSON = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oJSON, "MyModel");
			var myPath = "/EmployeeOrgTreeSet?$filter=";
			myPath += "Actty eq '" + _gAuth + "'";
			if(vOrgId && vOrgId != "" && vOrgId != "10000001" ){
				myPath += " and Objid eq '"+ vOrgId + "'";
			}
			
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});
			oModel.read(myPath, null, null, false, function(data,
					res) {
				if (data && data.results.length) {
					for (var i = 0; i < data.results.length; i++) {
						var oneData = data.results[i];
						if(data.results[i].Ipdat == null || data.results[i].Ipdat == ""){
							oneData.Ipdat = ""
						}else{
							oneData.Ipdat = dateFormat.format(new Date(data.results[i].Ipdat)); 
						}
						jData.tData.push(oneData);
					}
					
					oJSON.setData(jData);
				}
			}, function(res) {
				console.log(res);
			});
			var wData = [];
			var oPro = oJSON.getProperty("/tData");
			var viceChair = [] ;
			if (oPro && oPro.length) {
				var oLevelLength1 = [];
				var oLevelLength2 = [];
				var oLevelLength3 = [];
				var oLevelLength4 = [];
				
				for(var a = 0; a < oPro.length ; a++){
					if(oPro[a].Level.trim() == "1"){
						oLevelLength1.push(oPro[i]);
					}else if(oPro[a].Level.trim()=="2"){
						oLevelLength2.push(oPro[i]);
					}else if(oPro[a].Level.trim()=="3"){
						oLevelLength3.push(oPro[i]);
					}else if(oPro[a].Level.trim()=="4"){
						oLevelLength4.push(oPro[i]);
					}
					
					if(oPro[a].ZzLevel == "150" && oPro[a].Objid != "10000033"){
						viceChair = oPro[a];
					}
				}
				
				
				for (var i = 0; i < oPro.length; i++) {
					oPro[i].Myid = oPro[i].Myid.trim();
					oPro[i].Upid = oPro[i].Upid.trim();
					oPro[i].Level = oPro[i].Level.trim();
					oPro[i].Color = "#FFF";
					
					var vColor = "" ;
					oPro[i].Width = 250;
					oPro[i].Height = 130;
					var vColorTx = "" ;
					if(parseInt(oPro[i].ZzLevel) == 100){
						vColorTx = "#0093D0"; // rgb(65, 105, 225)";
					}else if(parseInt(oPro[i].ZzLevel) == 200){
						vColorTx = "rgb(50, 205, 50)";
					}else if(parseInt(oPro[i].ZzLevel) == 300){
						vColorTx = "rgb(0, 139, 139)";
					}
//					else if(parseInt(oPro[i].ZzLevel) == 250){
//						vColorTx = "rgb(197, 127, 127)";
//					}else if(parseInt(oPro[i].ZzLevel) == 350){
//						vColorTx = "rgb(184, 0, 204)";
//					}
					else if(parseInt(oPro[i].ZzLevel) == 400){
						vColorTx = "#083B82";   //"rgb(230, 72, 72)";
					}
					if(oPro[i].Objid == "99999999"){
						//네모1 
						oPro[i].rectid1="countrect"+i;
						oPro[i].rWidth1 = "250";
						oPro[i].rHeight1= "130";
						oPro[i].stroke1 = "";
						oPro[i].strokeW1 = "";
						oPro[i].style1="fill:none;";
						oPro[i].rX1="2";
						oPro[i].rY1="0";
					//네모2
						oPro[i].rectid2="headerrec";
						oPro[i].rWidth2= "250";
						oPro[i].rHeight2= "30";
						//oPro[i].stroke2= "#aaaaaa";   // 선이 겹쳐져 주석처리
						//oPro[i].strokeW2= "0.3";
						oPro[i].style2="fill:none;";
						oPro[i].rX2="2";
						oPro[i].rY2="0";
						
					//텍스트1
						oPro[i].tWidth="250";
						oPro[i].tHeight="30";
						oPro[i].tX="125";
						oPro[i].tY="21";
						oPro[i].Middle="middle";
						oPro[i].tClass = "header";
						oPro[i].tFill="fill:#ffffff;";
						
					//이미지1
						oPro[i].iX1="225";
						oPro[i].iY1="6";
						oPro[i].iId1="";
					    oPro[i].xlink1="";
						oPro[i].href1="";
						
					//이미지2
						oPro[i].iId2="";
						oPro[i].href2="";
						
					//이미지3
						oPro[i].iId3="";
						oPro[i].href3="";
						oPro[i].pX="5";
						oPro[i].pY="35";
						oPro[i].pWidth="80";
						oPro[i].pHeight="90";
					
					//이름
						oPro[i].nX="95";
						oPro[i].nY="50";
						oPro[i].Left="left";
						oPro[i].nClass="ename";
					//직급호칭
						oPro[i].jX="95";
						oPro[i].jY="75";
						oPro[i].jClass="mytext";
					//입사일자
						oPro[i].dX="95";
						oPro[i].dY="95";
						oPro[i].tr="auto";
					//재임기간
						oPro[i].jaX="95";
						oPro[i].jaY="115";
					//Line
						oPro[i].lineX1="125";
						oPro[i].lineY1="0";
						oPro[i].lineX2="125";
						oPro[i].lineY2="130";
						oPro[i].lineStyle="stroke:#f0f0f0;stroke-width:1.5";
					}else{
						if(oPro[i].ZzLevel == "150"){
							if(oPro[i].Objid == "10000033"){
								var vDoInfo = oPro[i];
								oPro[i].AObjid=vDoInfo.Objid;
								oPro[i].Objid=viceChair.Objid;
								
							 //네모1 
								oPro[i].rectid1="countrect"+i;
								oPro[i].rWidth1 = "500";
								oPro[i].rHeight1= "130";
								oPro[i].stroke1 = "#aaaaaa";
								oPro[i].strokeW1 = "0.3";
								oPro[i].style1="fill:#fafafa;";
								oPro[i].rX1="-125";
								oPro[i].rY1="0";
							//네모2
								oPro[i].rectid2="headerrec";
								oPro[i].rWidth2= "500";
								oPro[i].rHeight2= "30";
								oPro[i].style2="fill:"+vColorTx+";";
								oPro[i].rX2="-125";
								oPro[i].rY2="0";
								oPro[i].clickAction=oPro[i].Objid;
							//텍스트1
								oPro[i].tWidth="500";
								oPro[i].tHeight="30";
								oPro[i].tX="125";
								oPro[i].tY="21";
								oPro[i].Middle="middle";
								oPro[i].tClass = "header";
								oPro[i].tFill="fill:#ffffff;";
							//이미지1
								oPro[i].iX1="350";
								oPro[i].iY1="6";
								oPro[i].iId1="childexist";
							    oPro[i].xlink1="http://www.w3.org/1999/xlink";
								oPro[i].href1="/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_Atworg/img/icon_24_plus.png";
								
							//이미지2
								oPro[i].iId2="childexist2";
								oPro[i].href2="/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_Atworg/img/icon_24_minus.png";
							//이미지3
								oPro[i].iId3="oPhoto_"+i;
								oPro[i].href3=viceChair.Photo;
								oPro[i].pX="-120";
								oPro[i].pY="35";
								oPro[i].pWidth="80";
								oPro[i].pHeight="90";
							//이미지4
								oPro[i].iId4="oPhoto"+i;
								oPro[i].href4=oPro[i].Photo;
								oPro[i].pX2="125";
								oPro[i].pY2="35";
								oPro[i].pWidth2="80";
								oPro[i].pHeight2="90";	
							//이름1
								oPro[i].nX="-25";
								oPro[i].nY="50";
								oPro[i].Left="left";
								oPro[i].nClass="ename";
								oPro[i].AEname = vDoInfo.Ename;
								oPro[i].Ename = viceChair.Ename;
								oPro[i].AZzjikcht = oPro[i].Zzjikcht;
								oPro[i].Zzjikcht = viceChair.Zzjikcht;			
							//이름2
								oPro[i].nX2="220";
								oPro[i].nY2="50";
							//직급호칭
								oPro[i].jX="-25";
								oPro[i].jY="75";
								oPro[i].jClass="mytext";
								oPro[i].AJikgbtl = oPro[i].Jikgbtl;
								oPro[i].Jikgbtl = viceChair.Jikgbtl;
								
							//직급호칭2
								oPro[i].jX2="220";
								oPro[i].jY2="75";
							//입사일자
								oPro[i].dX="-25";
								oPro[i].dY="95";
								oPro[i].tr="auto";
								oPro[i].AIpdat = oPro[i].Ipdat;
								oPro[i].Ipdat = viceChair.Ipdat;
							//입사일자2
								oPro[i].dX2="220";
								oPro[i].dY2="95";
							//재임기간
								oPro[i].jaX="-25";
								oPro[i].jaY="115";
								oPro[i].ATenure = oPro[i].Tenure;
								oPro[i].Tenure = viceChair.Tenure;
							//재임기간2
								oPro[i].jaX2="220";
								oPro[i].jaY2="115";
							//Line
								oPro[i].lineX1="0";
								oPro[i].lineY1="0";
								oPro[i].lineX2="0";
								oPro[i].lineY2="0";
								oPro[i].lineStyle="";
							}else{
								viceChair = oPro[i];
								continue;
							}
						}else{
							//네모1 
							oPro[i].rectid1="countrect"+i;
							oPro[i].rWidth1 = "250";
							oPro[i].rHeight1= "130";
							oPro[i].stroke1 = "#aaaaaa";
							oPro[i].strokeW1 = "0.3";
							oPro[i].style1="fill:#fafafa;";
							oPro[i].rX1="2";
							oPro[i].rY1="0";
						//네모2
							oPro[i].rectid2="headerrec";
							oPro[i].rWidth2= "250";
							oPro[i].rHeight2= "30";
							//oPro[i].stroke2= "#aaaaaa";   // 선이 겹쳐져 주석처리
							//oPro[i].strokeW2= "0.3";
							oPro[i].style2="fill:"+vColorTx+";";
							oPro[i].rX2="2";
							oPro[i].rY2="0";
							oPro[i].clickAction=oPro[i].Objid;
							
						//텍스트1
							oPro[i].tWidth="250";
							oPro[i].tHeight="30";
							oPro[i].tX="125";
							oPro[i].tY="21";
							oPro[i].Middle="middle";
							oPro[i].tClass = "header";
							oPro[i].tFill="fill:#ffffff;";
							
						//이미지1
							oPro[i].iX1="225";
							oPro[i].iY1="6";
							oPro[i].iId1="childexist";
						    oPro[i].xlink1="http://www.w3.org/1999/xlink";
							oPro[i].href1="/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_Atworg/img/icon_24_plus.png";
							
						//이미지2
							oPro[i].iId2="childexist2";
							oPro[i].href2="/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_Atworg/img/icon_24_minus.png";
							
						//이미지3
							oPro[i].iId3="oPhoto"+i;
							oPro[i].href3=oPro[i].Photo;
							oPro[i].pX="5";
							oPro[i].pY="35";
							oPro[i].pWidth="80";
							oPro[i].pHeight="90";
						
						//이름
							oPro[i].nX="95";
							oPro[i].nY="50";
							oPro[i].Left="left";
							oPro[i].nClass="ename";
						
						//사원프로파일 이동
							oPro[i].pX5="225";
							oPro[i].pY5="37";	
							oPro[i].Id5="oIcon"+i;
							oPro[i].href5=(oPro[i].Pernr != "" ? "/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_Atworg/img/chief3.png" : "");
							oPro[i].pWidth5="20";
							oPro[i].pHeight5="17";
							oPro[i].pPernr=oPro[i].Pernr;
							
						//직급호칭
							oPro[i].jX="95";
							oPro[i].jY="75";
							oPro[i].jClass="mytext";
						//입사일자
							oPro[i].dX="95";
							oPro[i].dY="95";
							oPro[i].tr="auto";
						//재임기간
							oPro[i].jaX="95";
							oPro[i].jaY="115";
							
						//Line
							oPro[i].lineX1="0";
							oPro[i].lineY1="0";
							oPro[i].lineX2="0";
							oPro[i].lineY2="0";
							oPro[i].lineStyle="";
						}
					}
			
					wData.push(oPro[i]);						
				}
			}
					
			var dataMap = wData.reduce(function(map, node) {
				map[node.Myid] = node;
				return map;
			}, {});
			var treeData = [];
			wData.forEach(function(node) {
				var parent = dataMap[node.Upid];
				if (parent) {
					(parent.children || (parent.children = []))
							.push(node);
				} else {
					treeData.push(node);
				}
			});
			if(treeData[0]){
				OrgChart.setRoot(treeData[0]);
				OrgChart.onAfterRendering();
			}
	},
	
	// 이름 옆의 아이콘 클릭 시 사원프로파일로 이동
	onEmpProfile : function(oPernr){
		if(!oPernr || oPernr == "") return;
		
		window.open("/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/emplyeeprofile.html?_gAuth=" + _gAuth + "&_inPerer=" + oPernr);
	},
	
	clickImage : function(vObjid , vObjnm){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();
		
		if(vObjid == "99999999") return;
		
		var vText = encodeURIComponent(vObjnm) ;
			
		if(_gAuth == "E") {
			oController.onOpenPersonCard(vObjid);
		} else {
//			var vUri = "/sap/bc/ui5_ui5/sap/zui5_hr_eis/topteam.html?_gAuth=M&_gInType=Org&_gOrgid=" + vObjid + "&_gOrgnm=" + vText  ;
//			window.open(vUri);
			oController.onOpenPersonCard(vObjid);
		}
	},
	
	onOpenPersonCard : function(vObjid) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();
		
		oController._SelectedObjid = vObjid;
		
		if(!oController._PersonCardDialog) {
			oController._PersonCardDialog = sap.ui.jsfragment("ZUI5_HR_Atworg.fragment.PersonCard", oController);
			oView.addDependent(oController._PersonCardDialog);
		}
		
		oController._PersonCardDialog.open();
	},
	
	beforeOpenPersonCardDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();

		oController.getPersonsData(oController._SelectedObjid);
	},
	
	afterClosePersonCardDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();
		
		oController._SelectedObjid = "";
		
		sap.ui.getCore().byId(oController.PAGEID + "_ChiefLayout").destroyContent();
		sap.ui.getCore().byId(oController.PAGEID + "_PersonLayout").destroyContent();
//		sap.ui.getCore().byId(oController.PAGEID + "_SubPersonLayout").destroyContent();
	},
	
	displayPersonList : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();

		var oChiefLayout = sap.ui.getCore().byId(oController.PAGEID + "_ChiefLayout");
		var oPersonLayout = sap.ui.getCore().byId(oController.PAGEID + "_PersonLayout");
//		var oSubPersonLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubPersonLayout");	
		
		for(var i=0; i<oController._vOrgPersonList.length; i++) {
			
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});
			vZjktt = oBundleText.getText("LABEL_2189") + " : ";	// 2189:직책
			vIpdat = oBundleText.getText("LABEL_2073") + " : ";	// 2073:입사일자
			vOrgtx = oBundleText.getText("LABEL_0028") + " : ";	// 28:부서
			if(oController._vOrgPersonList[i].Ipdat != null && oController._vOrgPersonList[i].Ipdat != ""){
				vIpdat += dateFormat.format(new Date(oController._vOrgPersonList[i].Ipdat));
			}
			
			if(oController._vOrgPersonList[i].Zjktt != null && oController._vOrgPersonList[i].Zjktt != ""){
				vZjktt += oController._vOrgPersonList[i].Zjktt;
			}
			
			if(oController._vOrgPersonList[i].Orgtx != null && oController._vOrgPersonList[i].Orgtx != ""){
				vOrgtx += oController._vOrgPersonList[i].Orgtx;
			}
			
			if(oController._vOrgPersonList[i].Chief != "X") {
				oPersonLayout.addContent(
						new sap.ui.layout.VerticalLayout({
							content : new control.TalentSearchPersonCard({
								pernr : oController._vOrgPersonList[i].Pernr,
								name :  oController._vOrgPersonList[i].Ename,
								fid009 : oController._vOrgPersonList[i].Ztext,
								fid013 : oController._vOrgPersonList[i].Fid013,
								pictureUrl : oController._vOrgPersonList[i].Photo,
								item : [oController._vOrgPersonList[i].Ename +" "+oController._vOrgPersonList[i].Ztext,
									    vOrgtx ,
									    vZjktt ,
								     	vIpdat],
								event : "control.TalentSearchPersonCard.onPressPerson(" + oController._vOrgPersonList[i].Pernr + ")"
//								event : "oController.onPressPerson(" + oController._vOrgPersonList[i].Pernr +"," + oController._vOrgPersonList[i].Ename +")"
//								press : oController.onPressPerson(oController._vOrgPersonList[i].Pernr, oController._vOrgPersonList[i].Ename)
							})
					    }).addStyleClass("L2PPaddingLeft10")
				);
			} else {
				oChiefLayout.addContent(
						new sap.ui.layout.VerticalLayout({
							content : new control.TalentSearchPersonCard({
								pernr : oController._vOrgPersonList[i].Pernr,
								name :  oController._vOrgPersonList[i].Ename,
								fid009 : oController._vOrgPersonList[i].Ztext,
								fid013 : oController._vOrgPersonList[i].Fid013,
								pictureUrl : oController._vOrgPersonList[i].Photo,
								item : [oController._vOrgPersonList[i].Ename +" "+oController._vOrgPersonList[i].Ztext,
									    vZjktt ,
								     	vIpdat],
								event : "control.TalentSearchPersonCard.onPressPerson(" + oController._vOrgPersonList[i].Pernr + ")"
//								event : "oController.onPressPerson(" + oController._vOrgPersonList[i].Pernr +"," + oController._vOrgPersonList[i].Ename +")"
//					        	press : oController.onPressPerson(oController._vOrgPersonList[i].Pernr, oController._vOrgPersonList[i].Ename)
							})
					    }).addStyleClass("L2PPaddingLeft10")
				);
			}							
		}
		
//		if(oController._vSubOrgPersonList.length < 1){
//			var searchFunction = function(){
//				var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
//				
//				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
//				var vDatum = dateFormat.format(new Date());
//				
//				oModel.read (
//						"/OrgChartEmpListSet/?$filter=Orgeh eq '" + Orgeh + "'" 
//						+ " and Datum eq datetime'" + vDatum + "T00:00:00'"
//						+ " and Dchif eq 'X'"
//						+ " and Vwtyp eq '30'"
//						+ " and Subty eq '3010'",
//						null, 
//						null, 
//						false, 
//						function(oData, oResponse) {
//							if(oData && oData.results.length) {
//								for(var i=0; i<oData.results.length; i++) {
//									oController._vSubOrgPersonList.push(oData.results[i]); 
//								}
//							}
//						},
//						function(oError) {
//							common.Common.log(oError);
//						}
//				);
//				
//				SubOrgPersonList();
//				//oController.BusyDialog.close();
//			}
//			
//			//oController.BusyDialog.open();
//			setTimeout(searchFunction, 300);
//		}else{
//			SubOrgPersonList();
//		}
	},
	
	getPersonsData : function(Orgeh) {		
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();
		
		oController._vOrgPersonList = [];
		
		var oModel = sap.ui.getCore().getModel("EIS");
		
		oModel.read (
			"/OrgTreeEmployeeListSet/?$filter=Orgeh eq '" + Orgeh + "'",
			null, 
			null, 
			false, 
			function(oData, oResponse) {
				if(oData && oData.results.length) {
					for(var i=0; i<oData.results.length; i++) {
						oController._vOrgPersonList.push(oData.results[i]);
					}
				}
			},
			function(oError) {
				common.Common.log(oError);
			}
		);
		
		oController.displayPersonList();
	},
	
	onPressPerson : function(vPernr, vEname){
		var vUri = "/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/EmployeeProfile.html?_gAuth=M&_gPernr=" + vPernr + "&_gEname=" + vEname  ;
		window.open(vUri);
	}
});