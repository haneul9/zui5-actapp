jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.CCSInformation");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail
	 */

	PAGEID : "ZUI5_HR_EmTransportDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
//	_TestModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "HR35",
	_Aptyp : [],
	BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function() {

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		
		var vAppno ="" , vZappStatAl = "", vRegno = "";
		oController._vAppno = "";
		
		oController._ApprovalLineModel.setData(null);
		
		common.ApprovalLineAction.oController = oController;
		
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		// 초기화
		var Datas = { Data : []} ;
		oController._DetailTableJSonModel.setData(Datas);
		
		var oModel = sap.ui.getCore().getModel("ZHR_UGRTRANS_FEE_SRV");
		var oDetailData = {Data : {}};
		var oDetailTableData = {Data : []};
		var vZappStatAl = "";
		var errData = {};
		
		if(vAppno != "") { // 수정 및 조회
			oController.BusyDialog.open();
			
			oModel.read("/UgrtransFeeApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
				],
				success : function(data, res) {
					oDetailData.Data = data.results[0];
					oDetailData.Data.Betrg = common.Common.numberWithCommas(oDetailData.Data.Betrg * 1);
					oDetailData.Data.Datbd = dateFormat.format(new Date(common.Common.setTime(data.results[0].Datbd)));
					oDetailData.Data.Dated = dateFormat.format(new Date(common.Common.setTime(data.results[0].Dated)));
					oController._DetailJSonModel.setData(oDetailData);
					
					vZappStatAl = oDetailData.Data.ZappStatAl;
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});
				return ;
			}
		}
		
		/****************************************************/
		/*********** 공통적용사항 Start 			 ************/
		/****************************************************/
		// 상세화면 Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = vZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", vZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", vZappStatAl);
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		// 결재내역 
		common.ApprovalInformation.onSetApprovalInformation(oController);
		/****************************************************/
		/*********** 공통적용사항 End	 			 ************/
		/****************************************************/
		// 법인카드 시스템 
		common.CCSInformation.oController = oController ;
		// 법인카드시스템 마킹 내역 조회
		common.CCSInformation.onSearchUsebyPage();
//		// 법인카드시스템 마킹 내역 조회
//		common.CCSInformation.onSearchUsebyPopup();
		
		
		// 신규 결재번호 채번
		if(vAppno == "") {
			oModel.read("/UgrtransFeeApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I')
				],
				success : function(data, res) {
					oController._vAppno = data.results[0].Appno ;
					oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
						oController.onBack();
					}
				});
				return ;
			}
			
			if(_gAuth == "E"){
//				oController.onSetDefault(oController);
				
				oController.onAfterSelectPernr(oController);
			}
		}
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl) {
			oPortalTitle.setText(oBundleText.getText("LABEL_1391") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1391:긴급업무 수행교통비 신청
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText(oBundleText.getText("LABEL_1391") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1391:긴급업무 수행교통비 신청
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_1391") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1391:긴급업무 수행교통비 신청
		}

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_EmTransport.ZUI5_HR_EmTransportList",
			      data : { }
				}
			);	
		}
		
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		var oController = oView.getController();
		var oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix");
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamilyBold")	// 결재선
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({text : "{ApprEnames}"}).addStyleClass("FontFamily")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},

	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		var oController = oView.getController();
	},
	
	onSetDefault : function(oController){
		// 사용년도 현재년도 Default
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var curDate = new Date();
		
		var vStDate = new Date(curDate.getFullYear(), curDate.getMonth() , curDate.getDate()-1);
		
		
		oController._DetailJSonModel.setProperty("/Data/Datbd", dateFormat.format(vStDate));
		oController._DetailJSonModel.setProperty("/Data/Dated", dateFormat.format(vStDate));
		// 도착지 설정
		oController._DetailJSonModel.setProperty("/Data/Moved", oBundleText.getText("LABEL_1389"));	// 1389:(공장) 울산광역시 울주군 온산읍
		// 출발지역 설정
		oController._DetailJSonModel.setProperty("/Data/Locst", "");
		oController.onChangeLocst();
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		
		oController.onSetDefault(oController);
		
	},	
	
	onAfterSelectPernr : function(oController) {
		// Default 설정
		oController.onSetDefault(oController);
		// 신청내역 초기화
		oController.onSearchPerWork(oController);
		// 법인카드 Clear
		common.CCSInformation.onInit();
	},
	
	onChangeLocst : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		var oController = oView.getController();
		var oLocst = sap.ui.getCore().byId(oController.PAGEID + "_Locst");
		var vAmount = ""; 
		if(oLocst.getSelectedItem()) vAmount = oLocst.getSelectedItem().getCustomData()[0].getValue();
		
		oController._DetailJSonModel.setProperty("/Data/Betrg",vAmount);
	},
	
	onAfterBizCard : function(oController){
	
	},
	
	onInitBizCard : function(oController){
		oController._DetailJSonModel.setProperty("/Data/Betrg", 0);
	},
	
	onChangeDatbd : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		var oController = oView.getController();
		// 신청내역 초기화
		oController.onSearchPerWork(oController);
	},
	
	onSearchPerWork :function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_UGRTRANS_FEE_SRV");
		var errData = {};
		var vSchkz = "", vSchkztx = "", vTprog = "", vTprogtx = "", 
		    vKostl = "" , vLtext = "", vAufnr = "", vAufnrtx = "" ,
		    vBudge = "", vBudgetx = "" ;

		oModel.read("/UgrtransFeePerWorkSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Pernr")),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(oController._DetailJSonModel.getProperty("/Data/Datbd")))
			],
			success : function(data, res) {
				vSchkz = data.results[0].Schkz;
				vSchkztx = data.results[0].Schkztx;
				vTprog = data.results[0].Tprog;
				vTprogtx = data.results[0].Tprogtx;
				vKostl = data.results[0].Kostl;
				vLtext = data.results[0].Ltext;
				vAufnr = data.results[0].Aufnr;
				vAufnrtx = data.results[0].Aufnrtx;
				vBudge = data.results[0].Budge; 
				vBudgetx = data.results[0].Budgetx;
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage);
		}		
		
		oController._DetailJSonModel.setProperty("/Data/Schkz",vSchkz);
		oController._DetailJSonModel.setProperty("/Data/Schkztx",vSchkztx);
		oController._DetailJSonModel.setProperty("/Data/Tprog",vTprog);
		oController._DetailJSonModel.setProperty("/Data/Tprogtx",vTprogtx);
		oController._DetailJSonModel.setProperty("/Data/Kostl",vKostl);
		oController._DetailJSonModel.setProperty("/Data/Ltext",vLtext);
		oController._DetailJSonModel.setProperty("/Data/Aufnr",vAufnr);
		oController._DetailJSonModel.setProperty("/Data/Aufnrtx",vAufnrtx);
		oController._DetailJSonModel.setProperty("/Data/Budge",vBudge);
		oController._DetailJSonModel.setProperty("/Data/Budgetx",vBudgetx);
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_UGRTRANS_FEE_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "UgrtransFeeAppl", oneData);
			createData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
			createData.Datbd = "\/Date("+ common.Common.getTime(createData.Datbd)+")\/";
			createData.Dated = "\/Date("+ common.Common.getTime(createData.Dated)+")\/";
			createData.Betrg = common.Common.removeComma(createData.Betrg);
			createData.Waers = "KRW";
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			var errData = {};
			oModel.create("/UgrtransFeeApplSet", createData, {
				success : function(data, res) {
			
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			
			oController.BusyDialog.close();
			// 법인카드 시스템 사용내역 마킹(정산)
			var error = common.CCSInformation.onSavePage();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return ;
			}
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});
		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		}else {
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	callSaveErrorDialog : function(oController, errorList) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		
		if(!oController._ErrorDialog) {
			oController._ErrorDialog = sap.ui.jsfragment("ZUI5_HR_EmTransport.fragment.SaveError", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var vIdx = 1;
		errorList.forEach(function(elem) {
			elem.Idx = vIdx++;
		});
		
		oController._ErrorTableJSonModel.setData({Data : errorList});
		oController._ErrorTableJSonModel.refresh();
		
		oController._ErrorDialog.open();
	},
	
	onValidationData : function(oController, vPrcty){		
		var vData = oController._DetailJSonModel.getProperty("/Data");
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		if(!oneData.Pernr){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}else if(!oneData.Betrg){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1402"), {title : oBundleText.getText("LABEL_0053")});	// 1402:법인카드 시스템에서 사용내용을 선택하여 주십시오.
			return false;
		}else if(!oneData.Locst){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1403"), {title : oBundleText.getText("LABEL_0053")});	// 1403:출발지역을 선택하여 주십시오.
			return false;
		}else if(common.Common.checkNull(oneData.Datbd) ||common.Common.checkNull(oneData.Dated) ||common.Common.checkNull(oneData.TimbdC) ||common.Common.checkNull(oneData.TimedC)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1404"), {title : oBundleText.getText("LABEL_0053")});	// 1404:사용기간을 입력하여 주십시오.
			return false;
		}else if(common.Common.checkNull(oneData.Movbd)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1405"), {title : oBundleText.getText("LABEL_0053")});	// 1405:이동경로를 입력하여 주십시오.
			return false;
		}else if(common.Common.checkDate(oneData.Datbd, oneData.Dated) == false){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1128"), {title : oBundleText.getText("LABEL_0053")});	// 1128:시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요.
			return false;
		}else if(oneData.Datbd == oneData.Dated){
			if(common.Common.checkTimeCompare(oneData.TimbdC, oneData.TimedC) == false){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1406"), {title : oBundleText.getText("LABEL_0053")});	// 1406:시작시간이 종료시간보다 큽니다.\n시간을 확인하세요.
				return false;
			}
		}
		
		
		
		
		if(vPrcty == "C"){
			// 결재자 지정여부 확인
			var oData = oController._ApprovalLineModel.getProperty("/Data");
			var vApprovalCheck = "";
			if(oData && oData.length > 0){
				for(var i=0; i <oData.length ; i++ ){
					if(oData[i].Aprtype == "A03001"){
						vApprovalCheck = "X";
						break;
					}
				}	
			}
			if(vApprovalCheck == ""){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0004"), {title : oBundleText.getText("LABEL_0053")});	// 결재자를 반드시 지정하시기 바랍니다.
				return false;
			}	
		}
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail");
		var oController = oView.getController();
		var errData = {};	
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_UGRTRANS_FEE_SRV");
				
				oModel.remove("/UgrtransFeeApplSet(Appno='" + oController._vAppno + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				
				oController.BusyDialog.close();
								
				if(errData.Error == "E"){
					sap.m.MessageBox.error(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					return;
				} 				
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					actions: [sap.m.MessageBox.Action.CLOSE],
			        onClose: oController.onBack
				});
		};
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}; 
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : DeleteProcess
		});
	},
});