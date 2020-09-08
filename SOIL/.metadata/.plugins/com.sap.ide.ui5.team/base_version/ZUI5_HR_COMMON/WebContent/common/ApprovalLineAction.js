jQuery.sap.declare("common.ApprovalLineAction");
jQuery.sap.require("common.Common");

/** 
 * 결재자 지정
 * (신청서유형, 신청자사번, Appno)
*/

common.ApprovalLineAction = {
	/** 
	* @memberOf common.ApprovalLineAction
	*/	
	
	oController : null,
	
	onAfterOpen : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		// 발신라인 테이블
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable.getModel();
		var vData = { Data : [] };
		
		if(!common.Common.checkNull(oController._ApprovalLineModel.getProperty("/Data"))){
			var oData = oController._ApprovalLineModel.getProperty("/Data") ;
			for(var i = 0; i < oData.length; i++ ){
				var vTemp = {};
				Object.assign(vTemp, oData[i]);
				vData.Data.push(vTemp);
			}
		} else {
			if(oController._vAppno && oController._vAppno != ""){
				var oPath = "/ApprovalLineApplSet?$filter=Appno eq '" + oController._vAppno + 
				            "' and ZreqForm eq '" + oController._vZworktyp + 
				            "' and Werks eq '" + oController._TargetJSonModel.getProperty("/Data/Persa") +"'";
				var errData = {};
				// 기본 결재자 검색 List
				oModel.read(oPath, null, null, false, 
						function(data,res){
							if(data && data.results.length){
								for(var i=0;i<data.results.length;i++){							
									data.results[i].Idx = i+1;
									vData.Data.push(data.results[i]);
								}	
							}
						}, function(Res){
							errData = common.Common.parseError(Res);
						}
				);
			
				if(errData.Error && errData.Error == "E"){
					sap.m.MessageBox.alert(errData.ErrorMessage)
					return ;
				}
			}
		}
			
		oJSONModel.setData(vData);
		oTable.bindRows("/Data");
		// 검색라인 테이블  
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		function Search(){
			var vErrorMessage = "", vError = "";
			var vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
			// 대상자 기준
			var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
			if(!vPernr || vPernr == "") // 대상자가 없다면 신청자 기준
				vPernr = 	oController._ApplyJSonModel.getProperty("/Data/Appernr");
			
			if(vZappStatAl == "" || vZappStatAl == "10"){
				var oPath = "/ApprovalLineApplSet?$filter=Pernr eq '" + vPernr + "'";
				
				oModel.read(oPath, null, null, false, 
						function(data,res){
							if(data && data.results.length){
								var vIndex = 1;
								for(var i=data.results.length-1;i>=0;i--){							
									data.results[i].Idx = vIndex;
									vData.Data.push(data.results[i]);
									vIndex++;
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
			}
			
			oJSONModel.setData(vData);
			oTable.bindRows("/Data");
						
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
		
	},
	
	onBeforeClose : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalEname").setValue();
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalOrgtx").setValue();
		
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1").unbindRows();
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2").unbindRows();		
	},
	
	onSearch : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		
		if(!oController._vZworktyp) return;
		
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
	
	onAddLine1 : function(oEvent){ // 결재
		common.ApprovalLineAction.onAddLine("A03001");
	},
	
	onAddLine2 : function(oEvent){
		common.ApprovalLineAction.onAddLine("A03008");
	},
	
	onAddLine3 : function(oEvent){
		common.ApprovalLineAction.onAddLine("A03015");
	},
	
	// 이동버튼으로 발신라인 테이블에 추가
	onAddLine : function(vAprtype){
		var oController = common.ApprovalLineAction.oController;
		
		// 결재자 검색테이블
		var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1"); 
		var oTable1JSonModel = oTable1.getModel();
		var vIndex = oTable1.getSelectedIndices();
		
		if(!vIndex || vIndex.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2797"), {title : oBundleText.getText("LABEL_0053")});	// 53:오류, 2797:결재자를 선택하여 주십시오.
			return;
		}
		
		// 발신라인 테이블
		var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable2.getModel();
		var vData = oJSONModel.getData();
		var vApprovalData = vData.Data;
			
		// 중복데이터 체크
		for(var i=0; i<vApprovalData.length; i++){
			for(var j=0; j<vIndex.length; j++){
				var vContext = oTable1.getContextByIndex(vIndex[j]).sPath;
				var AddData = oTable1JSonModel.getProperty(vContext);

				if(vApprovalData[i].Pernr == AddData.Pernr && vAprtype == vApprovalData[i].Aprtype ){
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_2798") + " (" + AddData.Ename + ")", {title : oBundleText.getText("LABEL_0053")});	// 53:오류, 2798:중복 선택된 사번이 존재합니다.
					sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1").clearSelection();
					return;
				}
			}
			
		}
		
		var oJSONModel = oTable2.getModel();
		var vData = oJSONModel.getData();
		
		// 발신 테이블로 이동
		for(var i=0; i <vIndex.length; i++){
			var vContent = oTable1.getModel().getProperty("/Data/" + vIndex[i]);
			var selectData = {};
			Object.assign(selectData, vContent);
			selectData.Aprtype = vAprtype ;
			selectData.Idx = vApprovalData.length + 1;
			selectData.Nochg = false;
			vData.Data.push(selectData);
		}
		
		oJSONModel.setData(vData);
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable1").clearSelection();
	},
	
	// 삭제
	onDeleteLine : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		
		var vIdx = oEvent.getSource().getCustomData()[0].getValue();
		
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
				
			} else {
				seq = seq + 1;
				vApprovalData[i].Idx = seq;
				vData.Data.push(vApprovalData[i]);
			}
		}
		
		oJSONModel.setData(vData);
	},
	
	onPressUp : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable.getModel();
		var oData = oJSONModel.getProperty("/Data");
		var oNewData = {Data : []};
		var vIndex = oTable.getSelectedIndex();
		
		if(vIndex == -1){
			return;
		}else if(vIndex == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2799"), {	// 2799:최상위 정보는 더이상 위로 올릴 수 없습니다.
			 	icon: sap.m.MessageBox.Icon.INFORMATION,
			 	title : oBundleText.getText("LABEL_0053"),	// 53:오류
			});
			return;
		}
		
		var vData1 = oData[vIndex-1];
		var vData2 = oData[vIndex];
		
		if(vData1.Nochg == true || vData2.Nochg == true){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2800"), {	// 2800:기본으로 지정된 발신라인은 순서 변경이 불가능 합니다.
			 	icon: sap.m.MessageBox.Icon.INFORMATION,
			 	title : oBundleText.getText("LABEL_0053"),	// 53:오류
			});
			return;
		}
		
		vData1.Idx = vData1.Idx+ 1;
		vData2.Idx = vData2.Idx- 1;
		
		for(var i = 0 ; i < oData.length; i++){
			if(vIndex -1 == i){
				oNewData.Data.push(vData2);
			}else if(vIndex == i){
				oNewData.Data.push(vData1);
			}else{
				oNewData.Data.push(oData[i]); 
			}
		}
		
		oJSONModel.setData(oNewData);
		oTable.bindRows("/Data");
	},
	
	onPressDown : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable.getModel();
		var oData = oJSONModel.getProperty("/Data");
		var oNewData = {Data : []};
		var vIndex = oTable.getSelectedIndex();
		
		if(vIndex == -1){
			return;
		}else if(vIndex == oData.length -1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2801"), {	// 2801:최하위 정보는 더이상 아래로 내릴 수 없습니다.
			 	icon: sap.m.MessageBox.Icon.INFORMATION,
			 	title : oBundleText.getText("LABEL_0053"),	// 53:오류
			});
			return;
		}
	
		var vData1 = oData[vIndex+1];
		var vData2 = oData[vIndex];
		
		if(vData1.Nochg == true || vData2.Nochg == true){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2800"), {	// 2800:기본으로 지정된 발신라인은 순서 변경이 불가능 합니다.
			 	icon: sap.m.MessageBox.Icon.INFORMATION,
			 	title : oBundleText.getText("LABEL_0053"),	// 53:오류
			});
			return;
		}
		
		vData1.Idx = vData1.Idx - 1;
		vData2.Idx = vData2.Idx + 1;
		
		for(var i = 0 ; i < oData.length; i++){
			if(vIndex +1 == i){
				oNewData.Data.push(vData2);
			}else if(vIndex == i){
				oNewData.Data.push(vData1);
			}else{
				oNewData.Data.push(oData[i]); 
			}
		}

		oJSONModel.setData(oNewData);
		oTable.bindRows("/Data");
		
	},
	// 적용 버튼 선택 시
	onSave : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable.getModel();
		var oData = oJSONModel.getProperty("/Data");
		var Datas = { Data : []} ;
		var vSename = "";
		if(oData && oData.length > 0){
			for(var i =0; i < oData.length ; i++){
				var vTemp = {} ; 
				Object.assign(vTemp, oData[i]);
				Datas.Data.push(vTemp);	
				if(vTemp.Aprtype == "A03001"){
					if(vSename == "") vSename = vTemp.Ename;
					else vSename += ", " + vTemp.Ename;
				}
			}
		}
		
		oController._ApprovalLineModel.setData(Datas);
		oController._DetailJSonModel.setProperty("/Data/ApprEnames", vSename);
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalDialog").close();
	},
	
	// 결재자를 지정한 경우 저장
	onSaveApprovalLine : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		var vErrorMessage, vSuccessyn = "";
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		
		var vData = oController._ApprovalLineModel.getProperty("/Data");
		
		var vTotalData = [];
//		if(!vData || vData.length < 1){
//			return "";			
//		}
		
		for(var i=0; i<vData.length; i++){
			if(vData[i].Pernr){
				var createData = {};
					createData.Appno = oController._vAppno;
					createData.Pernr = vData[i].Pernr;
					createData.Aprtype = vData[i].Aprtype;
					createData.Nochg = vData[i].Nochg;
				vTotalData.push(createData);
			}
		}
		
		var requestsBody = {};
			requestsBody.Appno = oController._vAppno;
			requestsBody.ApprovalLineApplNav = vTotalData;
		
		oModel.create("/ApprovalLineApplSet", requestsBody, null,
				function(data,res){
					if(data) {}												
				},
				function (oError) {
			    	var Err = {};
			    	vSuccessyn = "X";
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
		
		/*
		 *  전자증빙 첨부 
		 */
		if( vSuccessyn == "" && 
			common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Docyn")) == false &&
			oController._DetailJSonModel.getProperty("/Data/Docyn") == "Y"){
			
			var createDocyn = {};
			createDocyn.Appno = oController._vAppno;
			createDocyn.Docyn = "Y";
			
			oModel.create("/CpFileCheckSet", createDocyn, null,
				function(data,res){
					if(data) {}												
				},
				function (oError) {
			    	var Err = {};
			    	vSuccessyn = "X";
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
		}
		
		return vSuccessyn;
	},
	
	
	// 취소 버튼 선택 시
	onClose : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		sap.ui.getCore().byId(oController.PAGEID + "_ApprovalDialog").close();
	},
	
	onApprovalLine : function(oEvent){
		var oController = common.ApprovalLineAction.oController;
		var oView = oController.getView();
		
		if(!oController._ApprovalLineDialog) {
			oController._ApprovalLineDialog = sap.ui.jsfragment("fragment.ApprovalLine", oController);
			oView.addDependent(oController._ApprovalLineDialog);
		}
		
		oController._ApprovalLineDialog.open();	
	},
	
	setApprovalLineModel : function(oController){
		oView = oController.getView();
		if(!oController._ApprovalLineDialog) {
			oController._ApprovalLineDialog = sap.ui.jsfragment("fragment.ApprovalLine", oController);
			oView.addDependent(oController._ApprovalLineDialog);
		}		

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable.getModel();	// oController._ApprovalLineModel
		var vData = {Data : []};
		var vAppernr = oController._DetailJSonModel.getProperty("/Data/Appernr");
		var vSename = ""; 
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		if(vAppernr && vAppernr != "" && oController._vAppno && oController._vAppno != ""){
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno));
//			if(vAppernr != "") aFilters.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vAppernr));
			
			oModel.read("/ApprovalLineApplSet", {
				async : false,
				filters : aFilters,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){							
							data.results[i].Idx = i+1;
							vData.Data.push(data.results[i]);
							
							if(data.results[i].Aprtype == "A03001"){
								if(vSename == "") vSename = data.results[i].Ename;
								else vSename += ", " + data.results[i].Ename;
							}
						}
					}
				},
				error : function(Res){
					if(Res.response.body){
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						vError = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							vErrorMessage = ErrorMessage ;
						}
					}
				}
			});
		}
		
		/*
		 * 전자증빙 첨부 여부 조회
		 */
		var vError = {};
		var vDocyn = "";
		var oPath = "/CpFileCheckSet?$filter=Appno eq '" + oController._vAppno + "'";
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						vDocyn = data.results[0].Docyn ;
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
		oController._DetailJSonModel.setProperty("/Data/Docyn",vDocyn);
		
		oJSONModel.setData(vData);
		oController._ApprovalLineModel.setData(vData); 
		oController._DetailJSonModel.setProperty("/Data/ApprEnames", vSename);
	},	
		
};