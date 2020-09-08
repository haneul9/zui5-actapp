jQuery.sap.declare("common.CCSInformation");
jQuery.sap.require("common.Common");
/** 
* 신청안내 Layout 위한 JS 이다.
* @Create By 강연준
*/

common.CCSInformation = {
	/** 
	* @memberOf common.CCSInformation
	*/	
	
	oController : null,
	openCCS : function(oEvent){
		var oController = common.CCSInformation.oController;
		
		if(!oController._CCSDialog) {
			oController._CCSDialog = sap.ui.jsfragment("fragment.CCSInformationDialog", oController);
		}
		
		var oModel = sap.ui.getCore().getModel("ZHR_BIZ_CARD_SRV");
		var items = [];
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		
		oModel.read("/BizCardListSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Empno', sap.ui.model.FilterOperator.EQ, vEmpLoginInfo[0].Perid)
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						items.push({
							key : data.results[i].Cardno,
							text : data.results[i].Owner + " " +  data.results[i].Cardno 
						});
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		var oCSSDialog = sap.ui.getCore().byId(oController.PAGEID + "_CCSDialog");
		var vCSSData = oCSSDialog.getModel().getData();
		vCSSData.CardList = items;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-2 , 1);
		vCSSData.Data = { Cardno : "" , Begda : dateFormat.format(prevDate), Endda : dateFormat.format(curDate), Mergetype : vCSSData.Data.Mergetype };
		oCSSDialog.getModel().setData(vCSSData);
		
		// 검색 Table 초기화
		var vData = { Data : []};
		sap.ui.getCore().byId(oController.PAGEID + "_CCSTable").getModel().setData(vData);
	
		// Page 의 법인카드 정산 내역을 Popup 으로 복사
		var oCCSDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable"),
		    oCCSDetailModel = sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable").getModel(),
		    vCCSPageTableData = sap.ui.getCore().byId(oController.PAGEID + "_CCSPageTable").getModel().getData();
		    
		oCCSDetailModel.setData(vCCSPageTableData);
		oController._CCSDialog.open();
	},
	
	onSearch : function(oEvent){
		var oController = common.CCSInformation.oController;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oModel = sap.ui.getCore().getModel("ZHR_BIZ_CARD_SRV");
		var oCSSDialog = sap.ui.getCore().byId(oController.PAGEID + "_CCSDialog");
		var vCSSData = oCSSDialog.getModel().getProperty("/Data");
		var oCCSTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSTable");
		var oCCSJSonModel = oCCSTable.getModel(),
			oCCSDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable"),
			vDetailData = oCCSDetailTable.getModel().getData(),
			vLength = 0 ;
		
		if(common.Common.isNull(vDetailData.Data)){
			vDetailData.Data = [];
		}else{
			vLength = vDetailData.Data.length;
		}
		
		var oJSonModel = oCCSTable.getModel();
		var vData = { Data : []};
		
		if(vCSSData.Cardno == ""){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2804"));	// 2804:카드를 선택하여 주십시오.
			return ;
		}
		if(vCSSData.Begda == "" || vCSSData.Endda == ""  ){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1404"));	// 1404:사용기간을 입력하여 주십시오.
			return ;
		}
		
		var onProcess = function(){	
			var errData = {};
			oModel.read("/BizCardUseListSet", {
				async: false,
				filters: [
					new sap.ui.model.Filter('Cardno', sap.ui.model.FilterOperator.EQ, vCSSData.Cardno),
					new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vCSSData.Begda)),
					new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vCSSData.Endda)),
				],
				success: function(data,res){
					if(data && data.results.length) {
						var vIndex = 1;
						for(var i=0; i<data.results.length; i++) {
							var vAData = data.results[i];
							var xSame = "";
							for(var j=0; j < vLength ; j ++){
								if(vAData.IfKey == vDetailData.Data[j].IfKey && vAData.TrnxId == vDetailData.Data[j].TrnxId){
									xSame = "X";
									break;
								}
							}
							// 정산(마킹) 목록에 존재 시  미정산 리스트에 추가하지 않는다. 
							if(xSame != "X"){
								vAData.Idx = vIndex ++;
								vData.Data.push(vAData);
							}
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oJSonModel.setData(vData);
//			oCCSTable.setVisibleRowCount(vData.Data.length);	
			
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return ;
			}			
		}
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	onSearchUsebyPopup : function(oEvent){
		var oController = common.CCSInformation.oController;
		common.CCSInformation.onSearchUse(sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable"));
	},
	
	onSearchUsebyPage : function(oEvent){
		var oController = common.CCSInformation.oController;
		common.CCSInformation.onSearchUse(sap.ui.getCore().byId(oController.PAGEID + "_CCSPageTable"));
	},
	
	onSearchUse : function(oTable){
		var oController = common.CCSInformation.oController;
		var oModel = sap.ui.getCore().getModel("ZHR_BIZ_CARD_SRV");

		var oJSonModel = oTable.getModel(),
		    vData = { Data : []};
		
		var onProcess = function(){	
			if(oController._vAppno != ""){
				var errData = {};
				oModel.read("/BizCardAppDetailSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
						new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp)
					],
					success: function(data,res){
						if(data && data.results.length) {
							for(var i=0; i<data.results.length; i++) {
								data.results[i].Idx = i + 1;
								vData.Data.push(data.results[i]);
							}
						}
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				
				oController.BusyDialog.close();
				if(errData.Error && errData.Error == "E"){
					sap.m.MessageBox.alert(errData.ErrorMessage);
				}
			}	
			oJSonModel.setData(vData);
			oTable.setVisibleRowCount(vData.Data.length);	
		}
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	onDown : function(oEvent){
		var oController = common.CCSInformation.oController;
		common.CCSInformation.onSetTable(sap.ui.getCore().byId(oController.PAGEID + "_CCSTable"),
										 sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable"));
	},
	
	onUp : function(oEvent){
		var oController = common.CCSInformation.oController;
		common.CCSInformation.onSetTable(sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable"),
										 sap.ui.getCore().byId(oController.PAGEID + "_CCSTable"));
	},
	
	onSetTable : function( SourceTable, TargetTable ){
		var oController = common.CCSInformation.oController;
		var oSourceModel = SourceTable.getModel(),
		    oSourceData = SourceTable.getModel().getData(),
		    oTargetModel = TargetTable.getModel(),
		    oTargetData = TargetTable.getModel().getData(),
		    vIDXs = SourceTable.getSelectedIndices();
		var vMergetype = "" , vMergetypetx = "" ;
		var oMergetype = sap.ui.getCore().byId(oController.PAGEID + "_CCSDialog").getModel().getProperty("/Data/Mergetype"); 
		if(oMergetype && oMergetype.length == 1){
			vMergetype = oMergetype[0].Mergetype;
			vMergetypetx = oMergetype[0].Mergetypetx;
		}
		// Target Table 에 Data 추가
		for(var i = 0; i < vIDXs.length; i++){
			var vContext = SourceTable.getContextByIndex(vIDXs[i]).sPath;
			var vData = oSourceModel.getProperty(vContext);
			vData.Mergetype = vMergetype;
			vData.Mergetypetx = vMergetypetx;
			oTargetData.Data.push(vData);
		}
		common.Common.reIndexODataArray(oTargetData.Data);
		oTargetModel.setData(oTargetData);
		
		var newData = { Data : []};
		for(var i = 0; i < oSourceData.Data.length; i++) {
			var vCheck = "";
			for(var j =0 ; j < vIDXs.length; j++  ){ 
				var _selPath = SourceTable.getContextByIndex(vIDXs[j]).sPath;
				var vSelData = oSourceModel.getProperty(_selPath);
				if(oSourceData.Data[i].IfKey == vSelData.IfKey && oSourceData.Data[i].TrnxId == vSelData.TrnxId){
					vCheck = "X";
				}
			}
			if(vCheck == "") newData.Data.push(oSourceData.Data[i]);
		}
		common.Common.reIndexODataArray(newData.Data);
		oSourceModel.setData(newData);
		
//		SourceTable.setVisibleRowCount(newData.Data.length);
		SourceTable.clearSelection();
//		TargetTable.setVisibleRowCount(oTargetData.Data.length);
		TargetTable.clearSelection();
	},
	
	onChangeMergetype : function(oEvent){
		var oController = common.CCSInformation.oController;
		var vIdx = oEvent.getSource().getCustomData()[0].getValue();
		var oModel = sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable").getModel();
		var vTmp = vIdx *1 -1 ;
		oModel.setProperty("/Data/" + vTmp +"/Mergetypetx", oEvent.getParameters().value);
	},
	
	// 확인
	onSave : function(oEvent){
		var oController = common.CCSInformation.oController;
		var oModel = sap.ui.getCore().getModel("ZHR_BIZ_CARD_SRV");
		// Popup 정산 Table -> Page 정산 Table 
		var oCCSDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable");
		var oCCSPageTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSPageTable");
		var vCCSDetailData = oCCSDetailTable.getModel().getData();
		var oCCSPageTableModel = oCCSPageTable.getModel();
		// 구분 필드가 존재 시에는 
		if(oCCSPageTable.getColumns().length > 8){
			for(var i =0; i < vCCSDetailData.Data.length ; i++ ){
				if(common.Common.checkNull(vCCSDetailData.Data[i].Mergetype)){
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_2805"));	// 2805:구분은 필수 선택입니다.
					return ; 
				}
			}
		}
	
		oCCSPageTableModel.setData(vCCSDetailData);
		oCCSPageTable.setVisibleRowCount(vCCSDetailData.Data.length);	
		
		//확인 후 Controller 추가 Action
		oController.onAfterBizCard(oController);
		
		oCCSDetailTable.clearSelection();
		var oCCSTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSTable");
		oCCSTable.clearSelection();
		
		oController._CCSDialog.close();
	},
	
	onSavePage : function(oEvent){
		var oController = common.CCSInformation.oController;
		var oModel = sap.ui.getCore().getModel("ZHR_BIZ_CARD_SRV");

		var oCCSDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSPageTable");
		var vCCSDetailData = oCCSDetailTable.getModel().getProperty("/Data");
		var errData = {}, createData = {}, vDetailDataList = [], vDetailData = {};
		createData.Appno = oController._vAppno ;
		createData.ZreqForm = oController._vZworktyp;
		createData.Empno =oController._TargetJSonModel.getProperty("/Data/Perid");
	
		vCCSDetailData.forEach(function(element) {
			vDetailData = common.Common.copyByMetadata(oModel, "BizCardAppDetail", element);
			vDetailData.Amount = common.Common.removeComma(vDetailData.Amount);
			vDetailDataList.push(vDetailData);
		});
		
		createData.BizCardAppDetailNav = vDetailDataList;
	
		oModel.create("/BizCardAppSet", createData, {
			success : function(data, res) {
		
			},
			error : function (Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		return errData;
	
	},
	// 초기화
	onInit : function(oEvent){
		var oController = common.CCSInformation.oController;
		// 선택 사용 리스트 초기화 
		var oCCSDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable");
		if(!common.Common.checkNull(oCCSDetailTable)){
			var oJSonModel = oCCSDetailTable.getModel();
			var vData = { Data : []};
			oJSonModel.setData(vData);
		}
		
		// 상세 페이지의 리스트 초기화 
		var oCCSPageTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSPageTable");
		if(!common.Common.checkNull(oCCSPageTable)){
			var oJSonModel = oCCSPageTable.getModel();
			var vData = { Data : []};
			oJSonModel.setData(vData);
			oCCSPageTable.setVisibleRowCount(1);
		}
		
		oController.onInitBizCard(oController);
	},
	
	onClose : function(oEvent){
		var oController = common.CCSInformation.oController;
		var oCSSDialog = sap.ui.getCore().byId(oController.PAGEID + "_CCSDialog");
		
		oCSSDialog.close();
	}
};