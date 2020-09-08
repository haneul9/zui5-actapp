jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail
	 */

	PAGEID : "ZUI5_HR_LifeStableRepaymentDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR24',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",

	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
	onInit : function() {
		this.getView()
			.addEventDelegate({
				onBeforeShow : jQuery.proxy(function(evt) {
					this.onBeforeShow(evt);
				}, this),
				onAfterShow : jQuery.proxy(function(evt) {
					this.onAfterShow(evt);
				}, this)
			})
			.addStyleClass("sapUiSizeCompact");
		
		sap.ui.getCore().getEventBus()
			.subscribe("app", "OpenWindow", this.SmartSizing, this)
			.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vFromPageId = "",
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []};
		
		oController.BusyDialog.open();

		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno || '';
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세 조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 선택 가능한 상환일자
		oController.setLmdatRange(oController);
		
		// 대출정보 조회
		oController.retrieveFundInfo(oController);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		oController.BusyDialog.close();
	},
	
	setLmdatRange : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oLmdat = sap.ui.getCore().byId(oController.PAGEID + "_Lmdat");
		
		oModel.read("/LoanLmdatListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oLmdat.setMinDate(data.results[0].Begda);
					oLmdat.setMaxDate(data.results[0].Endda);
				}
			},
			error : function(Res) {}
		});
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : oController._vFromPage || "ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentList",
		      data : {}
		});
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"), {	// 55:유효하지 않은 날짜형식입니다.
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail");
		var oController = oView.getController();
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			dateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			errData = {};
		
		oModel.read("/LifeStableLoanRepaySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.Lmdat = dateFormat.format(oDetailData.Data.Lmdat);
				oDetailData.Data.Paymm = dateFormat2.format(oDetailData.Data.Paymm);
				oDetailData.Data.PaymmAdd = dateFormat2.format(oDetailData.Data.PaymmAdd);
				oDetailData.Data.Lnamt = common.Common.numberWithCommas(oDetailData.Data.Lnamt);
				oDetailData.Data.LnamtAdd = common.Common.numberWithCommas(oDetailData.Data.LnamtAdd);
				oDetailData.Data.LmamtSum = common.Common.numberWithCommas(oDetailData.Data.LmamtSum);
				oDetailData.Data.RpamtSum = common.Common.numberWithCommas(oDetailData.Data.RpamtSum);
				oDetailData.Data.LmamtPri = common.Common.numberWithCommas(oDetailData.Data.LmamtPri);
				oDetailData.Data.LmamtInt = common.Common.numberWithCommas(oDetailData.Data.LmamtInt);
				oDetailData.Data.LmamtTot = common.Common.numberWithCommas(oDetailData.Data.LmamtTot);
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
	},
	
	commonAction : function(oController, oDetailData) {
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		
		// 결재내역 
		common.ApprovalInformation.onSetApprovalInformation(oController);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0431") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 431:생활안정자금 중도상환 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0431") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 431:생활안정자금 중도상환 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0431") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 431:생활안정자금 중도상환 신청
		}
	},
	
	resetFundInfo : function(oController) {
		oController._DetailJSonModel.setProperty("/Data/Lonid", undefined);
		oController._DetailJSonModel.setProperty("/Data/Lmdat", undefined);
		oController._DetailJSonModel.setProperty("/Data/Paymm", undefined);
		oController._DetailJSonModel.setProperty("/Data/Lnamt", undefined);
		oController._DetailJSonModel.setProperty("/Data/PaymmAdd", undefined);
		oController._DetailJSonModel.setProperty("/Data/LnamtAdd", undefined);
	},

	resetRepayInfo : function(oController) {
		oController._DetailJSonModel.setProperty("/Data/Lmtyp", undefined);
		oController._DetailJSonModel.setProperty("/Data/Inbeg", undefined);
		oController._DetailJSonModel.setProperty("/Data/Inend", undefined);
		oController._DetailJSonModel.setProperty("/Data/LmamtSum", undefined);
		oController._DetailJSonModel.setProperty("/Data/RpamtSum", undefined);
		oController._DetailJSonModel.setProperty("/Data/LmamtPri", undefined);
		oController._DetailJSonModel.setProperty("/Data/LmamtInt", undefined);
		oController._DetailJSonModel.setProperty("/Data/LmamtTot", undefined);
	},
	
	retrieveFundInfo : function(oController) {
		if(oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			dateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			errData = {};
		
		// 대출정보 초기화
		oController.resetFundInfo(oController);
		
		if(!vEncid) return;
		
		oModel.read("/LifeStableLoanRepaySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "N"),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					var vData = data.results[0];
					
					oController._DetailJSonModel.setProperty("/Data/Lonid", vData.Lonid);
					oController._DetailJSonModel.setProperty("/Data/Paymm", dateFormat2.format(vData.Paymm));
					oController._DetailJSonModel.setProperty("/Data/Lnamt", common.Common.numberWithCommas(vData.Lnamt));
					oController._DetailJSonModel.setProperty("/Data/PaymmAdd", dateFormat2.format(vData.PaymmAdd));
					oController._DetailJSonModel.setProperty("/Data/LnamtAdd", common.Common.numberWithCommas(vData.LnamtAdd));
					oController._DetailJSonModel.setProperty("/Data/Entinfo", vData.Entinfo);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E") {
			sap.m.MessageBox.show(errData.ErrorMessage, {
				onClose : function() {
					if(_gAuth == "E") oController.onBack();
				}
			});
			return;
		}
	},
	
	onChangeLmdat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			vLmdat = oEvent.getSource().getDateValue(),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vLonid = oController._DetailJSonModel.getProperty("/Data/Lonid");
			
		// 상환정보 초기화
		oController.resetRepayInfo(oController);
		
		oModel.read("/LifeStableLoanRepaySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "I"),
				new sap.ui.model.Filter('Lonid', sap.ui.model.FilterOperator.EQ, vLonid),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Lmdat', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(vLmdat))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					var vData = data.results[0];
					
					oController._DetailJSonModel.setProperty("/Data/Lmtyp", vData.Lmtyp);
					oController._DetailJSonModel.setProperty("/Data/Inbeg", dateFormat.format(vData.Inbeg));
					oController._DetailJSonModel.setProperty("/Data/Inend", dateFormat.format(vData.Inend));
					oController._DetailJSonModel.setProperty("/Data/LmamtSum", common.Common.numberWithCommas(vData.LmamtSum));
					oController._DetailJSonModel.setProperty("/Data/RpamtSum", common.Common.numberWithCommas(vData.RpamtSum));
					oController._DetailJSonModel.setProperty("/Data/LmamtPri", common.Common.numberWithCommas(vData.LmamtPri));
					oController._DetailJSonModel.setProperty("/Data/LmamtInt", common.Common.numberWithCommas(vData.LmamtInt));
					oController._DetailJSonModel.setProperty("/Data/LmamtTot", common.Common.numberWithCommas(vData.LmamtTot));
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController.onValidationData(oController, vPrcty);
		
		if(vOData == "") return;
		
		vOData.Actty = _gAuth;
		vOData.Prcty = vPrcty;
		vOData.Waers = "KRW";
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
			
			oModel.create("/LifeStableLoanRepaySet", vOData, {
				success: function(data,res) {
					if(data) {
					}
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E'){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(errData.ErrorMessage);
				return ;
			}
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});

		};
		
		var CreateProcess = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		} else {
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [
				sap.m.MessageBox.Action.YES, 
				sap.m.MessageBox.Action.NO
			],
			onClose : CreateProcess
		});
	},	
	
	onValidationData : function(oController, vPrtcy) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			rData = {},
			vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Lmdat) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0426"));	// 426:상환일자가 선택되지 않았습니다.
			return "";
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "LifeStableLoanRepay", vData);
			
			rData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
			rData.Lmdat = "\/Date("+ common.Common.getTime(rData.Lmdat)+")\/";
			rData.Paymm = "\/Date("+ common.Common.getTime(rData.Paymm)+")\/";
			rData.PaymmAdd = (rData.PaymmAdd) ? "\/Date("+ common.Common.getTime(rData.PaymmAdd)+")\/" : undefined;
			rData.Inbeg = "\/Date("+ common.Common.getTime(rData.Inbeg)+")\/";
			rData.Inend = "\/Date("+ common.Common.getTime(rData.Inend)+")\/";
			rData.Lnamt = common.Common.removeComma(rData.Lnamt);
			rData.LnamtAdd = common.Common.removeComma(rData.LnamtAdd);
			rData.LmamtSum = common.Common.removeComma(rData.LmamtSum);
			rData.RpamtSum = common.Common.removeComma(rData.RpamtSum);
			rData.LmamtPri = common.Common.removeComma(rData.LmamtPri);
			rData.LmamtInt = common.Common.removeComma(rData.LmamtInt);
			rData.LmamtTot = common.Common.removeComma(rData.LmamtTot);
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
			
			oModel.remove("/LifeStableLoanRepaySet(Appno='" + vDetailData.Appno + "')", {
				success: function(data,res) {
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.show(errData.ErrorMessage, {});
				return;
			} 
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions: [
					sap.m.MessageBox.Action.CLOSE
					],
					onClose: oController.onBack
			});
			
		};
		
		var DeleteProcess = function(fVal) {
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
	
	// 신청내역 초기화
	onResetDetail : function(oController) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Lonid;	// 대출번호
		delete detailData.Lmdat;	// 상환일자
		delete detailData.Paymm;	// 대출지급일
		delete detailData.Lnamt;	// 대출원금
		delete detailData.PaymmAdd;	// 추가대출 지급일
		delete detailData.LnamtAdd;	// 추가대출 원금
		delete detailData.LmamtSum;	// 대출금액 합계
		delete detailData.RpamtSum;	// 상환 누계액
		delete detailData.LmamtPri;	// 상환금액 원금
		delete detailData.LmamtInt;	// 상환금액 이자
		delete detailData.LmamtTot;	// 상환금액 계
		delete detailData.Entinfo;	// 입금처
		delete detailData.Lmtyp;	// 일시상환 유형
		delete detailData.Inbeg;	// 이자계산 시작일
		delete detailData.Inend;	// 이자계산 종료일
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 대출정보
		oController.retrieveFundInfo(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});
