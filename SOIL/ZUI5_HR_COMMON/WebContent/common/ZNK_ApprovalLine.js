jQuery.sap.declare("common.ZNK_ApprovalLine");
jQuery.sap.require("common.Common");

/** 
 * 결재자 지정
 * (신청서유형, 신청자사번, Appno)
*/

common.ZNK_ApprovalLine = {
	/** 
	* @memberOf common.ZNK_ApprovalLine
	*/	
	
	oController : null,
	
	onAfterOpen : function(oEvent){
		var oController = common.ZNK_ApprovalLine.oController;
		
		console.log("Reqform : " + oController._vReqForm + " / Pernr : " + oController._vReqPernr + " / Appno : " + oController._vAppno);
		
		// 발신라인 테이블
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable.getModel();
		var vData;
		
		if(oController._ApprovalLineModel.getProperty("/Data") != undefined){
			vData = oController._ApprovalLineModel.getData();
		} else {
			vData = {Data : []};
			
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
			var oPath = "/ApprovalLineApplSet?$filter=ZreqForm eq '" + oController._vReqForm + "' and ZreqPernr2 eq '" + oController._vReqPernr + "'";
			
			if(oController._vAppno != "") oPath += "and Appno eq '" + oController._vAppno + "'";
			
			oModel.read(oPath, null, null, false, 
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){							
								data.results[i].Idx = i+1;
								vData.Data.push(data.results[i]);
							}
							
							if(data.results.length < oTable.getVisibleRowCount()){
								for(var i=data.results.length; i<oTable.getVisibleRowCount(); i++){
									var blankData = {Idx : i+1};		
									vData.Data.push(blankData);
								}
							}
							
						} else {
							for(var i=0; i<oTable.getVisibleRowCount(); i++){
								var blankData = {Idx : i+1};		
								vData.Data.push(blankData);
							}	
						}
					}, function(Res){
						if(Res.response.body){
							var ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							vError = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}else{
								vErrorMessage =ErrorMessage ;
							}
						}
					}
			);
		}
			
		oJSONModel.setData(vData);
		oTable.bindRows("/Data");
	},
	
	onBeforeClose : function(oEvent){
		var oController = common.ZNK_ApprovalLine.oController;
		
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalEname").setValue();
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalOrgtx").setValue();
		
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1").unbindRows();
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2").unbindRows();		
	},
	
	onSearch : function(oEvent){
		var oController = common.ZNK_ApprovalLine.oController;
		
		if(!oController._vReqForm) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		
		var vSename = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalEname").getValue();
		var vSorgtx = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalOrgtx").getValue();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		function Search(){
			var vErrorMessage = "", vError = "";
			var oPath = "/ApprovalLineApplSet?$filter=Sename eq '" + encodeURIComponent(vSename) + "'";
				oPath += " and Sorgtx eq '" + encodeURIComponent(vSorgtx) + "'";
			
			oModel.read(oPath, null, null, false, 
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){							
								data.results[i].Idx = i+1;
								vData.Data.push(data.results[i]);
							}
						}
					}, function(Res){
						if(Res.response.body){
							var ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							vError = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}else{
								vErrorMessage =ErrorMessage ;
							}
						}
					}
			);
			
			if(vError == "E"){
				oController.BusyDialog.close();
				vError = "";
				sap.m.MessageBox.show(vErrorMessage);
			}
			
			oJSONModel.setData(vData);
			oTable.bindRows("/Data");
						
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},	
	
	// 이동버튼으로 발신라인 테이블에 추가
	onAddLine : function(oEvent){
		var oController = common.ZNK_ApprovalLine.oController;
		
		var vSeq = oEvent.getSource().getCustomData()[0].getValue();
		
		// 결재자 검색테이블
		var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1"); 
		var vIndex = oTable1.getSelectedIndex();
		
		if(vIndex == -1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2797"), {title : oBundleText.getText("LABEL_0053")});	// 53:오류, 2797:결재자를 선택하여 주십시오.
			return;
		}
		
		var selectData = oTable1.getModel().getProperty("/Data/" + vIndex);
		
		// 발신라인 테이블
		var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable2.getModel();
		var vData = oJSONModel.getData();
		var vApprovalData = vData.Data;
		
		// 중복데이터 체크
		for(var i=0; i<vApprovalData.length; i++){
			if(vApprovalData[i].Pernr == selectData.Pernr){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2798") + " (" + selectData.Ename + ")", {title : oBundleText.getText("LABEL_0053")});	// 53:오류, 2798:중복 선택된 사번이 존재합니다.
				sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1").clearSelection();
				return;
			}
		}
		
		vData.Data = [];
		oJSONModel.setData(vData);
		
		var vIdx = 0;
		
		for(var i=0; i<vApprovalData.length; i++){
			if(i == vSeq-1){
				vIdx = vIdx + 1;
				selectData.Tmp = "X";
				selectData.Idx = vIdx;
				vData.Data.push(selectData);
			} else {
				vIdx = vIdx + 1;
				vApprovalData[i].Idx = vIdx;
				vData.Data.push(vApprovalData[i]);
			}
		}
		oJSONModel.setData(vData);
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1").clearSelection();
	},
	
	// 삭제
	onDeleteLine : function(oEvent){
		var oController = common.ZNK_ApprovalLine.oController;
		
		var vIdx = oEvent.getSource().getCustomData()[0].getValue();
		
		var deleteRecord = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES){
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
				var oJSONModel = oTable.getModel();
				
				var vData = oTable.getModel().getData();
				var vApprovalData = vData.Data;
				
				var seq = 0;
				
				vData.Data = [];
				oJSONModel.setData(vData);
				
				// 삭제
				for(var i=0; i<vApprovalData.length; i++){
					if(i == vIdx-1) {
						seq = seq + 1;
						var blankData = {Idx : seq};
						vData.Data.push(blankData);
					} else {
						seq = seq + 1;
						vApprovalData[i].Idx = seq;
						vData.Data.push(vApprovalData[i]);
					}
				}
				
				oJSONModel.setData(vData);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : deleteRecord
		});
		
	},
	
	// 적용 버튼 선택 시
	onSaveApproval : function(oEvent){
		var oController = common.ZNK_ApprovalLine.oController;
		
		oController.onSetAppl(oEvent);
		
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalDialog").close();
	},
	
	// 취소 버튼 선택 시
	onClose : function(oEvent){
		var oController = common.ZNK_ApprovalLine.oController;
		
//		vData = {Data : []};
//		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
//		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
//		var oPath = "/ApprovalLineApplSet?$filter=ZreqForm eq '" + oController._vReqForm + "' and ZreqPernr2 eq '" + oController._vReqPernr + "'";
//		
//		if(oController._vAppno != "") oPath += "and Appno eq '" + oController._vAppno + "'";
//		
//		oModel.read(oPath, null, null, false, 
//				function(data,res){
//					if(data && data.results.length){
//						for(var i=0;i<data.results.length;i++){							
//							data.results[i].Idx = i+1;
//							vData.Data.push(data.results[i]);
//						}
//						
//						if(data.results.length < oTable.getVisibleRowCount()){
//							for(var i=data.results.length; i<oTable.getVisibleRowCount(); i++){
//								var blankData = {Idx : i+1};		
//								vData.Data.push(blankData);
//							}
//						}
//						
//					} else {
//						for(var i=0; i<oTable.getVisibleRowCount(); i++){
//							var blankData = {Idx : i+1};		
//							vData.Data.push(blankData);
//						}	
//					}
//				}, function(Res){
//					if(Res.response.body){
//						var ErrorMessage = Res.response.body;
//						var ErrorJSON = JSON.parse(ErrorMessage);
//						vError = "E"; 
//						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
//							vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
//						}else{
//							vErrorMessage =ErrorMessage ;
//						}
//					}
//				}
//		);
//		
//		oController._ApprovalLineModel.setData(vData);
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalDialog").close();
	},
	
	// 결재자를 지정한 경우 저장
	onSaveApprovalLine : function(oController){
		var vErrorMessage;
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		
		var vData = oController._ApprovalLineModel.getProperty("/Data");
		var vTotalData = [];
		for(var i=0; i<vData.length; i++){
			if(vData[i].Pernr){
				var createData = {};
					createData.Appno = oController._vAppno;
					createData.ZreqPernr2 = oController._vReqPernr;
					createData.ZreqForm = oController._vReqForm;
					createData.Pernr = vData[i].Pernr;
				vTotalData.push(createData);
			}
		}
		
		var requestsBody = {};
			requestsBody.Appno = oController._vAppno;
			requestsBody.ZreqPernr2 = oController._vReqPernr;
			requestsBody.ZreqForm = oController._vReqForm;
			requestsBody.ApprovalLineApplNav = vTotalData;
		
		oModel.create("/ApprovalLineApplSet", requestsBody, null,
				function(data,res){
					if(data) {}												
				},
				function (oError) {
			    	var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
						else vErrorMessage = Err.error.message.value;
					} else {
						vErrorMessage = oError.toString();
					}
					
					sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});	// 53:오류
				}
		);
	},

	
};