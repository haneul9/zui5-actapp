jQuery.sap.declare("common.ApplyUser");
jQuery.sap.require("common.Common");
/** 
* 신청자 Layout 위한 JS 이다.
* @Create By 강연준
*/

common.ApplyUser = {
	/** 
	* @memberOf common.ApplyUser
	*/	
	
	oController : null,
	
	onSetApplicant : function(oController){
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		var vData = oController._DetailJSonModel.getProperty("/Data");
		var vApplyUserData = {Data : {}};
		var vApplyUser = "";
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		if(oController._vAppno == ""){ // 신규신청
			if(vEmpLoginInfo.length > 0){
				// 신청자
				vApplyUserData.Data.Ename = vEmpLoginInfo[0].Ename ;
				vApplyUserData.Data.Appernr = vEmpLoginInfo[0].Pernr ;
				vApplyUserData.Data.Orgtx = vEmpLoginInfo[0].Stext ;
				vApplyUserData.Data.Zzjikgbt = vEmpLoginInfo[0].Zzjikgbt; // 직군
				vApplyUserData.Data.Zzjiklnt = vEmpLoginInfo[0].Zzjiklnt; // 직위
				vApplyUserData.Data.Appdt = "";
				vApplyUser = vEmpLoginInfo[0].Pernr ;
			}else{
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_1011"), {	// 1011:로그인 정보가 존재하지 않습니다.
				 	icon: sap.m.MessageBox.Icon.INFORMATION,
				 	title : oBundleText.getText("LABEL_0053"),	// 53:오류
					onClose : function() {
						oController.onBack();
					}
				});
				return;
			}	
		} else if(oController._vAppno != ""){ // 수정 및 조회
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
			var vData = oController._DetailJSonModel.getProperty("/Data");
			oDetailData = {Data : vData };
			var vErrorMessage = "", vError = "";
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
			var oPath = "/ReqPernrInfoSet?$filter=Appno eq '" + oController._vAppno + "'";
			oModel.read(oPath, null, null, false,
					function(data, res){
						// 신청자
						vApplyUserData.Data.Ename = data.results[0].Ename ;
						vApplyUserData.Data.Appernr = data.results[0].Pernr ;
						vApplyUserData.Data.Orgtx = data.results[0].Orgtx ;
						vApplyUserData.Data.Zzjikgbt = data.results[0].Zzjikgbt ;
						vApplyUserData.Data.Zzjiklnt = data.results[0].Zzjiklnt ;
						vApplyUserData.Data.Appdt = data.results[0].Reqdtm ;
						vApplyUser = data.results[0].Pernr ;

					}, function(Res){
						vError = "E";
						if(Res.response.body){
							vErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(vErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
					}
			);
						
			if(vError == "E"){
				sap.m.MessageBox.alert(vErrorMessage, {
					onClose : function() {
						oController.onBack();
					}
				});
				return ;
			}
		}
		oController._ApplyJSonModel.setData(vApplyUserData);
		oController._DetailJSonModel.setProperty("/Data/Appernr",vApplyUser);
	},
};