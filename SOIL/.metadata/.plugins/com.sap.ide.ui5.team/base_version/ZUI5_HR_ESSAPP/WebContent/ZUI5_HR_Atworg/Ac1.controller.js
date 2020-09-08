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
						if(data.results[i].Entda == null || data.results[i].Entda == ""){
							oneData.Entda = ""
						}else{
							oneData.Entda = dateFormat.format(new Date(data.results[i].Entda)); 
						}
						
						if(data.results[i].Orgda == null || data.results[i].Orgda == ""){
							oneData.Orgda = ""
						}else{
							oneData.Orgda = dateFormat.format(new Date(data.results[i].Orgda)); 
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
					
					if(oPro[a].ZorgLevl == "150" && oPro[a].Objid != "10000033"){
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
					oPro[i].Height = 150;
					var vColorTx = "" ;
					if(parseInt(oPro[i].ZorgLevl) == 100){
						vColorTx = "#0093D0"; // rgb(65, 105, 225)";
					}else if(parseInt(oPro[i].ZorgLevl) == 200){
						vColorTx = "rgb(50, 205, 50)";
					}else if(parseInt(oPro[i].ZorgLevl) == 300){
						vColorTx = "rgb(0, 139, 139)";
					}else if(parseInt(oPro[i].ZorgLevl) == 400){
						vColorTx = "rgb(197, 127, 127)";
					}else if(parseInt(oPro[i].ZorgLevl) == 500){
						vColorTx = "rgb(184, 0, 204)";
					}else if(parseInt(oPro[i].ZorgLevl) == 600){
						vColorTx = "#083B82";   //"rgb(230, 72, 72)";
					}else if(parseInt(oPro[i].ZorgLevl) == 700){
						vColorTx = "#000000";   //"rgb(230, 72, 72)";
					}
					if(oPro[i].Objid == "99999999"){
						//네모1 
						oPro[i].rectid1="countrect"+i;
						oPro[i].rWidth1 = "250";
						oPro[i].rHeight1= "150";
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
						oPro[i].nX="10";
						oPro[i].nY="140";
						oPro[i].Left="left";
						oPro[i].nClass="ename";
					//직위
						oPro[i].zX="95";
						oPro[i].zY="55";
						oPro[i].jClass="mytext";	
					//직책
						oPro[i].jX="95";
						oPro[i].jY="75";
						oPro[i].jClass="mytext";
					//입사일자(선임일자)
						oPro[i].dX="95";
						oPro[i].dY="95";
						oPro[i].tr="auto";
					//현부서 근무일자
						oPro[i].jaX="95";
						oPro[i].jaY="115";
					//Line
						oPro[i].lineX1="125";
						oPro[i].lineY1="0";
						oPro[i].lineX2="125";
						oPro[i].lineY2="150";
						oPro[i].lineStyle="stroke:#f0f0f0;stroke-width:1.5";
					}else{
					//네모1 
						oPro[i].rectid1="countrect"+i;
						oPro[i].rWidth1 = "250";
						oPro[i].rHeight1= "150";
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
//						oPro[i].nX="95";
//						oPro[i].nY="50";
						oPro[i].nX="10";
						oPro[i].nY="140";
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
						
					//이름
						oPro[i].nX="10";
						oPro[i].nY="140";
						oPro[i].Left="left";
						oPro[i].nClass="ename";
					//직위
						oPro[i].zX="95";
						oPro[i].zY="55";
						oPro[i].jClass="mytext";	
					//직책
						oPro[i].jX="95";
						oPro[i].jY="75";
						oPro[i].jClass="mytext";
					//입사일자(선임일자)
						oPro[i].dX="95";
						oPro[i].dY="95";
						oPro[i].tr="auto";
					//현부서 근무일자
						oPro[i].jaX="95";
						oPro[i].jaY="115";
						
					//Line
						oPro[i].lineX1="0";
						oPro[i].lineY1="0";
						oPro[i].lineX2="0";
						oPro[i].lineY2="0";
						oPro[i].lineStyle="";
		
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
		
		window.open("/sap/bc/ui5_ui5/sap/zui5_hr_essapp/EmployeeProfile.html?_gAuth=" + _gAuth + "&_inPerer=" + oPernr);
	},
	
	clickImage : function(vObjid , vObjnm){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();
		
		if(vObjid == "99999999") return;
		
		var vText = encodeURIComponent(vObjnm) ;
			
		if(_gAuth == "E") {
			oController.onOpenPersonCard(vObjid);
		} else {
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
	},
	
	displayPersonList : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
		var oController = oView.getController();

		var oChiefLayout = sap.ui.getCore().byId(oController.PAGEID + "_ChiefLayout");
		var oPersonLayout = sap.ui.getCore().byId(oController.PAGEID + "_PersonLayout");
		
		for(var i=0; i<oController._vOrgPersonList.length; i++) {
			
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});
			vZjktt = oBundleText.getText("LABEL_0067") + " : ";	// 67:직위
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
								item : [oController._vOrgPersonList[i].Ename,
										vZjktt ,    
										vOrgtx ,
								     	vIpdat],
								event : "control.TalentSearchPersonCard.onPressPerson(" + oController._vOrgPersonList[i].Pernr + ")"
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
							})
					    }).addStyleClass("L2PPaddingLeft10")
				);
			}							
		}
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
		var vUri = "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/EmployeeProfile.html?_gAuth=M&_gPernr=" + vPernr + "&_gEname=" + vEname  ;
		window.open(vUri);
	}
});