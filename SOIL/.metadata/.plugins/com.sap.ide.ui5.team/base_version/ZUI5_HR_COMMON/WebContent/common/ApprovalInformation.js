jQuery.sap.declare("common.ApprovalInformation");
jQuery.sap.require("common.Common");
/** 
* 결재내역 Layout 위한 JS 이다.
* @Create By 강연준
*/

common.ApprovalInformation = {
	/** 
	* @memberOf common.ApprovalInformation
	*/	
	
	oController : null,
	
	onSetApprovalInformation : function(oController){
		
		var vApprovalInformationData = {Data : {}};
		var vApprovalInformation = "";
		
		var vData = oController._DetailJSonModel.getProperty("/Data");
		var vAppdtm1 = "", vAppdtm2 = "" ,vZappStxtAl = "" ;  // 담당자 결재일시 , 주관부서장 결재일시 , 결재상태
		if(vData.ZappStatAl != "" && vData.ZappStatAl != "10"){
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
			var Datas = {Data : {}} ;
			try{
				var oPath = "/ApprovalInfoSet?$filter=Appno eq '"+ vData.Appno  + "'";
				oModel.read(
						oPath,
						null,
						null,
						false,
						function(data,res){
							if(data && data.results.length){
								vAppdtm1= data.results[0].Appdtm1 ;
								vAppdtm2= data.results[0].Appdtm2 ;
								vZappStxtAl= data.results[0].ZappStxtAl ;
							}
						},
						function(res){console.log(res);}
				);	
			}catch(Ex){
				
			}
		}
		oController._DetailJSonModel.setProperty("/Data/Appdtm1",vAppdtm1);
		oController._DetailJSonModel.setProperty("/Data/Appdtm2",vAppdtm2);
		oController._DetailJSonModel.setProperty("/Data/ZappStxtAl",vZappStxtAl);
	},
};