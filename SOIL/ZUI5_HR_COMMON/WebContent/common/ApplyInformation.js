jQuery.sap.declare("common.ApplyInformation");
jQuery.sap.require("common.Common");
/** 
* 신청안내 Layout 위한 JS 이다.
* @Create By 강연준
*/

common.ApplyInformation = {
	/** 
	* @memberOf common.ApplyInformation
	*/	
	
	oController : null,
	
	onSetApplyInformation : function(oController){
		
		var vApplyInformationData = {Data : {}};
		var vApplyInformation = "";
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var Datas = {Data : {}} ;
		var oNoticePanel = sap.ui.getCore().byId(oController.PAGEID + "_NoticePanel");
		var oTargetToolbar = sap.ui.getCore().byId(oController.PAGEID + "_TargetToolbar");
		
		if(!oController._vInfoImage.getProperty("/Data") || oController._vInfoImage.getProperty("/Data").length < 1){
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
			try{
				var oPath = "/AppNoticeSet?$filter=ZreqForm eq '"+ oController._vZworktyp  + "'";
				oModel.read(
						oPath,
						null,
						null,
						false,
						function(data,res){
							if(data && data.results.length){
								Datas.Data = data.results[0] ;
//								Datas.Data.Notice = "<div><pre class='L2PFontFamily'>" + Datas.Data.Notice + "</pre></div>";
							}
						},
						function(res){console.log(res);}
				);	
			}catch(Ex){
				
			}
			oController._vInfoImage.setData(Datas);
		} else {
			Datas.Data = oController._vInfoImage.getProperty("/Data");
		}
		
		// 안내 문구 여부에 따라 visible 및 padding 설정
		if(!common.Common.checkNull(Datas.Data.Image) || !common.Common.checkNull(Datas.Data.Notice)){
			oNoticePanel.setVisible(true);
			if(oTargetToolbar) oTargetToolbar.addStyleClass("marginTop20px");
		}else{
			oNoticePanel.setVisible(false);
			if(oTargetToolbar) oTargetToolbar.removeStyleClass("marginTop20px");
		}
	},
};