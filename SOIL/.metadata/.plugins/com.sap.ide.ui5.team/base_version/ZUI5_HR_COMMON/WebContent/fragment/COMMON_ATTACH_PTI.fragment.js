sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", {

	createContent : function(oController) {	
		var oPTIButton = new sap.m.Button(oController.PAGEID + "_PTIButton",{
			text : oBundleText.getText("LABEL_2772"),	// 2772:전자증빙
			type : "Ghost",
			press : function(){
				var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
				var vOrgeh = "" , vOrgtx = "", vPerid ="" , vEname = "";
				var vAppno = oController._DetailJSonModel.getProperty("/Data/Appno");
				var vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
				var vUrl = "/sap/bc/ui5_ui5/sap/zui5_hr_common/pti.html?";

				var vMode = "VIEW";
				if(vZappStatAl == "" || vZappStatAl == "10") vMode = "EDIT" ;
				
				if(!common.Common.checkNull(vAppno)){
					var aFilters = []
					aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vAppno));
					
				    oModel.read("/PtiPinfoSet",
							null, 
							null, 
							false, 
							function(oData, oResponse) {
								if(oData) {
									var oneData = oData.results[0] ;
									vOrgeh = oneData.OrgClass;
									vOrgtx = oneData.OrgNm;
									vPerid = oneData.EmpId;
									vEname = oneData.EmpNm;
								}
							},
							function(oResponse) {
								console.log(oResponse);
							}
					  );
				    	
					  try {
		 					var vHostName = location.hostname;
		 					if(vHostName.indexOf("hcm.") > -1) {
		 						
		 					}else{
		 						 vAppno = "T"+ vAppno;
		 					} 
		 				} catch(ex) {
		 					console.log(ex);
		 				}
		 				
					  if(common.Common.checkNull(vOrgeh)){
						  sap.m.MessageBox.alert(oBundleText.getText("LABEL_2902")); //LABEL_2927=신청자 조직코드를 조회하지 못하였습니다. 
						  return;
					  }else if(common.Common.checkNull(vOrgtx)){
						  sap.m.MessageBox.alert(oBundleText.getText("LABEL_2902")); //LABEL_2927=신청자 조직코드를 조회하지 못하였습니다. 
						  return;
					  }else if(common.Common.checkNull(vPerid)){ // LABEL_2901=신청자 사번을 조회하지 못하였습니다.
						  sap.m.MessageBox.alert(oBundleText.getText("LABEL_2901")); 
						  return;
					  }else if(common.Common.checkNull(vEname)){
						  sap.m.MessageBox.alert(oBundleText.getText("LABEL_2928")); // LABEL_2903=신청자 성명을 조회하지 못하였습니다.
						  return;
					  }
					  vUrl += "PartNo=" + vOrgeh;
					  vUrl += "&PartName=" + vOrgtx;
					  vUrl += "&UserID=" + vPerid;
					  vUrl += "&UserName=" + vEname;
					  vUrl += "&ApplID=" + vAppno;
					  vUrl += "&Mode=" + vMode;
					  
					  
					  oController._DetailJSonModel.setProperty("/Data/Docyn", "Y"); 
					  window.open(vUrl,"",'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=600');
				}else{
					  sap.m.MessageBox.alert("신청문서 번호를 조회하지 못하였습니다");
				}
			}
		});
		
		var oAttachFilePanel = new sap.m.Panel(oController.PAGEID + "_ATTACHFILE_PANEL", {
			visible : true,
			expandable : false,
			expanded : true,
			content : [   
				 new sap.m.Toolbar({
//					 	height : "20px",
						design : sap.m.ToolbarDesign.Auto,
						content : [new sap.m.Image({
									src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
								   }),
								   new sap.m.ToolbarSpacer({width: "5px"}),
								   new sap.m.Text({text : {
									    path : "Ename",
								   		formatter : function(fVal){
											if(oController._vLangu && oController._vLangu == "E") return "Attachment File";
											else return oBundleText.getText("LABEL_2157");	// 2157:증빙 첨부
								   }}}).addStyleClass("MiddleTitle"),
				                   new sap.m.ToolbarSpacer(),
				                   oPTIButton,
				  
						           ]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px")]
		});
		
		return oAttachFilePanel;
	}

});