jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail
	 */

	PAGEID : "ZUI5_HR_MoveAmountDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR30',
	_vEnamefg : "",
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
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vFromPageId = "",
			oDetailData = {Data : {}};
		
		oController.BusyDialog.open();
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail"),
			oController = oView.getController();

		if(oController._vFromPage != "") {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountList",
			      data : {}
			});	
		}
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
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0003")	// 3:결재선
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Text({
								text : "{ApprEnames}"
							}).addStyleClass("Font14px FontColor3")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail");
		var oController = oView.getController();
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
	
		// 위임자 조회
		common.MandateAction.onSearchMandate(oController);
		
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_MOVING_FEE_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/MovingFreeRequestApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Movdt = dateFormat.format(oDetailData.Data.Movdt);
					oDetailData.Data.Movedate = dateFormat.format(oDetailData.Data.Movedate);
					oDetailData.Data.Aplamt = common.Common.numberWithCommas(oDetailData.Data.Aplamt);
					oDetailData.Data.Reqamt = common.Common.numberWithCommas(oDetailData.Data.Reqamt);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_MOVING_FEE_SRV"),
			errData = {};
		
		oModel.read("/MovingFreeRequestApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I')
			],
			success : function(data, res) {
				oController._vAppno = data.results[0].Appno;
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
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0278") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 278:이사비 신청
			
			// 국내로 고정
			oController._DetailJSonModel.setProperty("/Data/Ovryn", "1");
			
			// 통화키 Default는 한화 
			oController._DetailJSonModel.setProperty("/Data/Waers", "KRW");
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0278") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 278:이사비 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0278") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 278:이사비 신청
		}
	},
	
	onMovdtChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_MOVING_FEE_SRV"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vMovdt = oEvent.getSource().getValue()
			errData = {};
		
		oController._DetailJSonModel.setProperty("/Data/Orgeh1", "");
		oController._DetailJSonModel.setProperty("/Data/Orgtx1", "");
		oController._DetailJSonModel.setProperty("/Data/Zzwork1", "");
		oController._DetailJSonModel.setProperty("/Data/Zzwork1T", "");
		oController._DetailJSonModel.setProperty("/Data/Orgeh2", "");
		oController._DetailJSonModel.setProperty("/Data/Orgtx2", "");
		oController._DetailJSonModel.setProperty("/Data/Zzwork2", "");
		oController._DetailJSonModel.setProperty("/Data/Zzwork2T", "");
		oController._DetailJSonModel.setProperty("/Data/Dista", "");
		
		if(common.Common.checkNull(vEncid) || common.Common.checkNull(vMovdt)) return;
		
		oModel.read("/MovingFeeOrgFromToSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Movdt', sap.ui.model.FilterOperator.EQ, vMovdt)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					var resData = data.results[0];
					
					oController._DetailJSonModel.setProperty("/Data/Orgeh1", resData.Orgeh1);
					oController._DetailJSonModel.setProperty("/Data/Orgtx1", resData.Orgtx1);
					oController._DetailJSonModel.setProperty("/Data/Zzwork1", resData.Zzwork1);
					oController._DetailJSonModel.setProperty("/Data/Zzwork1T", resData.Zzwork1T);
					oController._DetailJSonModel.setProperty("/Data/Orgeh2", resData.Orgeh2);
					oController._DetailJSonModel.setProperty("/Data/Orgtx2", resData.Orgtx2);
					oController._DetailJSonModel.setProperty("/Data/Zzwork2", resData.Zzwork2);
					oController._DetailJSonModel.setProperty("/Data/Zzwork2T", resData.Zzwork2T);
					oController._DetailJSonModel.setProperty("/Data/Dista", resData.Dista);
					
					// 한도금액 조회
					oController.retrieveMovingFeeLimit(oController);
					
					// 한도액 체크
					oController.checkFeeLimit(oController);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E") {
			sap.m.MessageBox.alert(errData.ErrorMessage, {});
			return ;
		}
	},
	
	checkFeeLimit : function(oController) {
		var vLtamt = oController._DetailJSonModel.getProperty("/Data/Ltamt"),
			vReqamt = oController._DetailJSonModel.getProperty("/Data/Reqamt") || "0";
		
		if(!vLtamt) return false;
		
		if(Number(common.Common.removeComma(vReqamt)) > Number(vLtamt)) {
			oController._DetailJSonModel.setProperty("/Data/Reqamt", common.Common.numberWithCommas(vLtamt));
			
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0288"), {});	// 288:거리에 따른 한도액을 초과하였습니다.
			return false;
		}
		
		return true;
	},
	
	onOvrseaynChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail"),
			oController = oView.getController();
		
		// 한도금액 조회
		oController.retrieveMovingFeeLimit(oController);
		
		// 한도액 체크
		oController.checkFeeLimit(oController);
	},
	
	retrieveMovingFeeLimit : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_MOVING_FEE_SRV"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vMovdt = oController._DetailJSonModel.getProperty("/Data/Movdt"),
			vOvrseayn = oController._DetailJSonModel.getProperty("/Data/Ovrseayn"),
			vDista = oController._DetailJSonModel.getProperty("/Data/Dista"),
			errData = {};
		
		if(!vEncid || !vMovdt || !vOvrseayn || !vDista) return;
		
		oModel.read("/MovingFeeLimitSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Movdt', sap.ui.model.FilterOperator.EQ, vMovdt),
				new sap.ui.model.Filter('Ovrseayn', sap.ui.model.FilterOperator.EQ, vOvrseayn),
				new sap.ui.model.Filter('Dista', sap.ui.model.FilterOperator.EQ, vDista)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oController._DetailJSonModel.setProperty("/Data/Ltamt", data.results[0].Ltamt);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {});
			return ;
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vOData = oController.onValidationData(oController, vPrcty);
		
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		vOData.Actty = _gAuth;
		
		var onProcess = function() {
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			var oModel = sap.ui.getCore().getModel("ZHR_MOVING_FEE_SRV"),
				errData = {};
				
			oModel.create("/MovingFreeRequestApplSet", vOData, {
				success: function(data,res) {
					if(data) {
					} 
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E') {
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
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
//				control.ZNKBusyAccessor.onBusy("S",oController);
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
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},	
	
	onValidationData : function(oController, vPrcty){
		var vData = oController._DetailJSonModel.getProperty("/Data"),
			rData = {},
			vLtamt,
			vReqamt;
		
		if(common.Common.checkNull(vData.Pernr)) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Movedate)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0282"));	// 282:이사일이 입력되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Ovrseayn)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0290"));	// 290:국내외구분이 선택되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Movdt)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0293"));	// 293:발령일이 입력되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Zzwork1)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0295"));	// 295:발령전이 입력되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Zzwork2)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0297"));	// 297:발령후가 입력되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Dista)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0287"));	// 287:거리가 선택되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Lifnr)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0280"));	// 280:이사업체가 선택되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Reqamt)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0255"));	// 255:신청금액이 입력되지 않았습니다.
			return "";
		}
		if(common.Common.checkNull(vData.Docyn)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0284"));	// 284:증빙자료를 첨부하세요.
			return "";
		}
		
		if(!vData.Ltamt) {
			// 한도금액 조회
			oController.retrieveMovingFeeLimit(oController);
		}
		
		// 한도액 체크
		if(!oController.checkFeeLimit(oController)) {
			return "";
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
		
		try {
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_MOVING_FEE_SRV"), "MovingFreeRequestAppl", vData);
			rData.Reqamt = common.Common.removeComma(rData.Reqamt);
			rData.Aplamt = common.Common.removeComma(rData.Aplamt);
			rData.Movedate = "\/Date("+ common.Common.getTime(rData.Movedate)+")\/";
			rData.Movdt = "\/Date("+ common.Common.getTime(rData.Movdt)+")\/";
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_MOVING_FEE_SRV");
				
				oModel.remove("/MovingFreeRequestApplSet(Appno='" + vDetailData.Appno + "')", {
					success: function(data,res) {
					},
					error: function(Res) {
						if(Res.response.body){
							var ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							vError = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
								vErrorMessage =ErrorMessage ;
							}
						}
					}
				});
				oController.BusyDialog.close();
				
				if(vError == "E") {
					sap.m.MessageBox.show(vErrorMessage, {});
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
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
//				control.ZNKBusyAccessor.onBusy("S",oController);
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
	onResetDetail : function(oController){
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Movedate;	// 이사일
		delete detailData.Ovrseayn;	// 국내외구분
		delete detailData.Movdt;	// 발령일
		delete detailData.Orgeh1;	// 발령전-조직코드
		delete detailData.Orgtx1;	// 발령전-조직명
		delete detailData.Zzwork1;	// 발령전-근무지코드
		delete detailData.Zzwork1T;	// 발령전-근무지명
		delete detailData.Orgeh2;	// 발령후-조직코드
		delete detailData.Orgtx2;	// 발령후-조직명
		delete detailData.Zzwork2;	// 발령후-근무지코드
		delete detailData.Zzwork2T;	// 발령후-근무지명
		delete detailData.Dista;	// 거리
		delete detailData.Lifnr;	// 이사업체코드
		delete detailData.Name1;	// 이사업체명
		delete detailData.Reqamt;	// 신청금액
		delete detailData.Aplamt;	// 지원금액
		delete detailData.Ltamt;	// 한도
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
	},
	
	_SearchCompanyDialog : null ,
	openCompanyDailog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail");
		var oController = oView.getController();
		if(!oController._SearchCompanyDialog) {
			oController._SearchCompanyDialog = sap.ui.jsfragment("ZUI5_HR_MoveAmount.fragment.MoveCompanyDialog", oController);
			oView.addDependent(oController._SearchCompanyDialog);
		}
		
		oController._SearchCompanyDialog.open();
	},
	
	beforeOpenDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail");
		var oController = oView.getController();
		var oDatas = {Data : []};
		var oDialogModel = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable").getModel();
		oDialogModel.setData(oDatas);
		sap.ui.getCore().byId(oController.PAGEID + "_Filter").setValue("");
	},
	
	onPressFilter : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail");
		var oController = oView.getController();
		var vFilter = sap.ui.getCore().byId(oController.PAGEID + "_Filter").getValue();
		var oDialogTable = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable");
		var oDialogModel = oDialogTable.getModel();
		oDialogTable.removeSelections(true);
		
//		oDialogTable.setMode(sap.m.ListMode.Delete); // Delete mode selection
//		oDialogTable.setMode(sap.m.ListMode.SingleSelectLeft); // Put it back.
	     
		
		var oModel = sap.ui.getCore().getModel("ZHR_MOVING_FEE_SRV");
		var vDatas = { Data : [] };
		var oFilters = [];
		var vErrorMessage = "", vError = "";
		oFilters.push(new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.EQ, vFilter));
		
		oController.BusyDialog.open();
		var onProcess = function(){
			oModel.read("/MovingFeeRemovalComSet", {
				async: false,
				filters: oFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i =0; i < data.results.length; i++){
							vDatas.Data.push(data.results[i]);
						}
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					vError = errData.Error;
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			oDialogModel.setData(vDatas);
			if(vError == "E") {
				sap.m.MessageBox.alert(vErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
					}
				});
				return ;
			}
			oController.BusyDialog.close();
		}
		setTimeout(onProcess, 100);	
	},
	
	onSelectCompany : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail");
		var oController = oView.getController();
		var oDialogTable = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable");
		var oDialogModel = oDialogTable.getModel();
		var vLifnr = "", vName1 = "";
		
		if(oDialogTable.getSelectedContexts() && oDialogTable.getSelectedContexts()[0].sPath ){ 
			var selectedData = oDialogModel.getProperty(oDialogTable.getSelectedContexts()[0].sPath);
			vLifnr = selectedData.Lifnr; 
			vName1 = selectedData.Name1; 
		}
		
		oController._DetailJSonModel.setProperty("/Data/Lifnr", vLifnr);  // 업체코드
		oController._DetailJSonModel.setProperty("/Data/Name1", vName1);  // 업체명
		
		oController._SearchCompanyDialog.close();
	},
});