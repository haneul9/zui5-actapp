jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail
	 */

	PAGEID : "ZUI5_HR_ResignationInterviewDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
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
		 
		// 반려사유
		oController.setRejectRow(oController);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail"),
			oController = oView.getController();

		if(oController._vFromPage != "") {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewList",
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ApprLineRow", {
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
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail");
		var oController = oView.getController();
	},
	
	setRejectRow : function(oController) {
		var oApplyMatrix = sap.ui.getCore().byId(oController.PAGEID + "_ApplyMatrix"),
			oMgrwd = sap.ui.getCore().byId(oController.PAGEID + "_Mgrwd"),
			vMgrwd = oController._DetailJSonModel.getProperty("/Data/Mgrwd"),
			oRow;
		
		if(oMgrwd) oMgrwd.destroy();
		if(!vMgrwd) return;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Mgrwd", {
			height : "30px",
			cells : [
				// 면접자 반려사유
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0374")	// 374:면접자 반려사유
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Text({
						text : "{Mgrwd}"
					}).addStyleClass("Font14px FontColor3")
				}).addStyleClass("MatrixData")
			]
		});
		
		oApplyMatrix.addRow(oRow);
	},
	
	commonAction : function(oController, oDetailData) {
		// 대상자 조회
		common.TargetUser.oController = oController;
		
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.Zrest);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
	
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			dateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			targetData = {Data: {}},
			errData = {};
		
		oModel.read("/RetireInterviewSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Reret = dateFormat.format(oDetailData.Data.Reret);
					oDetailData.Data.Entdt = dateFormat2.format(oDetailData.Data.Entdt);
					oDetailData.Data.Mgrdt = (!oDetailData.Data.Mgrdt) ? dateFormat.format(new Date()) : dateFormat.format(oDetailData.Data.Mgrdt);
					
					targetData.Data.Auth = _gAuth;
					targetData.Data.Pernr = oDetailData.Data.Pernr;
					targetData.Data.Perid = oDetailData.Data.Perid;
					targetData.Data.Encid = oDetailData.Data.Encid;
					targetData.Data.Ename = oDetailData.Data.Ename;
					targetData.Data.Orgeh = oDetailData.Data.Orgeh;
					targetData.Data.Orgtx = oDetailData.Data.Orgtx;
					targetData.Data.Zzjiktl = oDetailData.Data.Zzjiktl;
					targetData.Data.Zzjiktlt = oDetailData.Data.Zzjiktlt;
					targetData.Data.Btrtx = oDetailData.Data.Btext;
					targetData.Data.Zzjikgb = oDetailData.Data.Zzjikgb;
					targetData.Data.Zzjikgbt = oDetailData.Data.Zzjikgbt;
					targetData.Data.Zzjikch = oDetailData.Data.Zzjikch;
					targetData.Data.Zzjikcht = oDetailData.Data.Zzjikcht;
					targetData.Data.Zzjikch = oDetailData.Data.Zzjikln;
					targetData.Data.Zzjiklnt = oDetailData.Data.Zzjiklnt;
					
					oController._TargetJSonModel.setData(targetData);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0393"));		// 393:퇴직자 면접표 작성
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0393") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 393:퇴직자 면접표 작성
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0393") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 393:퇴직자 면접표 작성
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
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
			
			var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
				errData = {};
				
			oModel.create("/RetireInterviewSet", vOData, {
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
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(!vData.Mgrdt) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0402"));	// 402:작성일이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Reas1) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0404"));	// 404:퇴직사유(표면적인 사유)가 입력되지 않았습니다.
				return "";
			}
			if(!vData.Reas2) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0403"));	// 403:퇴직사유(실질적인 사유)가 입력되지 않았습니다.
				return "";
			}
			if(!vData.Suppt) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0401"));	// 401:설득 과정이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Depsu) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0400"));	// 400:부서가 취해야 할 대책이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Consu) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0405"));	// 405:회사가 취해야 할 대책이 입력되지 않았습니다.
				return "";
			}
		
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
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_ACTION_SRV"), "RetireInterview", vData);
			rData.Mgrdt = "\/Date("+ common.Common.getTime(rData.Mgrdt)+")\/";
			rData.Reret = "\/Date("+ common.Common.getTime(rData.Reret)+")\/";
			rData.Entdt = "\/Date("+ common.Common.getTime(rData.Entdt)+")\/";
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 반려 Process
	onReject : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail"),
			oController = oView.getController();
		
		if(!oController._RejectDialog) {
			oController._RejectDialog = sap.ui.jsfragment("ZUI5_HR_ResignationInterview.fragment.Reject", oController);
			oView.addDependent(oController._RejectDialog);
		}
		
		oController._RejectDialog.open();
	},
	
	onRejectProcess : function(oController) {
		var vMgrwd = oController._DetailJSonModel.getProperty("/Data/Mgrwd");
		
		if(!vMgrwd) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0398"));	// 398:반려사유가 입력되지 않았습니다.
			return "";
		}
		
		oController._RejectDialog.close();
		oController.BusyDialog.close();
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
				vOData = {},
				errData = {};
			
			vOData.Appno = vDetailData.Appno;
			vOData.Prcty = "R";
			vOData.Mgrwd = vDetailData.Mgrwd;
			
			oModel.create("/RetireInterviewSet", vOData, {
				success: function(data,res) {
					if(data) {
					} 
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.show(errData.ErrorMessage, {});
				return;
			} 
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0397"), {	// 397:반려되었습니다.
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions: [
					sap.m.MessageBox.Action.CLOSE
				],
		        onClose: oController.onBack
			});
		};
		
		var RejectProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0399"), {	// 399:반려하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : RejectProcess
		});
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Mgrdt;	// 작성일
		delete detailData.Reas1;	// 퇴직사유(표면적인 사유)
		delete detailData.Reas2;	// 퇴직사유(실질적인 사유)
		delete detailData.Suppt;	// 설득 과정
		delete detailData.Depsu;	// 부서가 취해야 할 대책
		delete detailData.Consu;	// 회사가 취해야 할 대책
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
	}
});