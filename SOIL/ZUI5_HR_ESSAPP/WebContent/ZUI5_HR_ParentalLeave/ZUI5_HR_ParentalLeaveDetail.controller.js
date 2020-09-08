jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail
	 */

	PAGEID : "ZUI5_HR_ParentalLeaveDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel: new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM31",
	BusyDialog : new sap.m.BusyDialog(),
	
	_vOrgeh : "",
	_vOrgtx : "",
	_vSpath : "",
	_useCustomPernrSelection : "", 
	
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
			vPernr = "",
			vFromPageId = "",
			oDetailData = {Data : {}};
		
		oController.BusyDialog.open();
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		common.MandateAction.oController = oController;
		
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
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		// 위임자 조회
		common.MandateAction.onSearchMandate(oController);
		
		// 신청유형에 따른 화면 UI 설정
		oController.onChangeAptyp();
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamilyBold")	// 결재선
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Text({
								text : "{ApprEnames}"
							}).addStyleClass("FontFamily")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail");
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
		
		// 결재내역 
		common.ApprovalInformation.onSetApprovalInformation(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/MaternityLeaveDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'),
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				oDetailData.Data.Befday = "" + (data.results[0].Befday * 1).toFixed(0);
				oDetailData.Data.Useday = "" + (data.results[0].Useday * 1).toFixed(0);
				oDetailData.Data.Aftday = "" + (data.results[0].Aftday * 1).toFixed(0);
				oDetailData.Data.Begda = dateFormat.format(new Date(common.Common.setTime(data.results[0].Begda)));
				oDetailData.Data.Endda = dateFormat.format(new Date(common.Common.setTime(data.results[0].Endda)));
				oDetailData.Data.Dlvda = common.Common.checkNull(oDetailData.Data.Dlvda) ? undefined : dateFormat.format(new Date(common.Common.setTime(data.results[0].Dlvda)));
//				oDetailData.Data.Gbdat = common.Common.checkNull(oDetailData.Data.Gbdat) ? undefined : dateFormat.format(new Date(common.Common.setTime(data.results[0].Gbdat)));
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
	
	retrieveDetailTable : function(oController, vZappStatAl) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel();
		
		oModel.read("/LeaveAppDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "H"),
			],
			success : function(data, res) {
				if(data && data.results){
					for(var i = 0; i < data.results.length; i++){
						data.results[i].Datum = dateFormat.format(new Date(common.Common.setTime(data.results[i].Datum)));
						data.results[i].ZappStatAl = vZappStatAl;
						oTableData.Data.push(data.results[i]);
					}
				}
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
		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			errData = {};
		
		oModel.read("/MaternityLeaveDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I'),
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
		// 휴가자/대근자 정보
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailJSonModel.setProperty("/Data/Appno" , oController._vAppno);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2240") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 2240:출산휴가/육아휴직 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2240") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 2240:출산휴가/육아휴직 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_2240") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 2240:출산휴가/육아휴직 신청
		}
	},
	
	
	// 신청내역 초기화
	onResetDetail : function(oController, isDelHstyp) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		if(isDelHstyp) delete detailData.Hstyp;		// 신청구분
		delete detailData.Nhsyn;		// 통근지역내 무주택
		delete detailData.Hslyn;		// 주택자금대출 여부
		delete detailData.Tpern;		// 인계자
		delete detailData.Tpernnm;		// 인계자 이름
		delete detailData.Tperncongb;	// 계약기간 시작
		delete detailData.Tpernconed;	// 계약기간 종료
		delete detailData.Aprsn;		// 신청사유
		delete detailData.Mvtyp;		// 부임형태
		delete detailData.Hoshp;		// 주택형태
		delete detailData.Fsize;		// 전용면적
		delete detailData.FsizeP;		// 전용면적 평
		delete detailData.Psize;		// 공급면적
		delete detailData.PsizeP;		// 공급면적 평
		delete detailData.Pstlz;		// 주소 우편번호
		delete detailData.Addr1;		// 주소 주소1
		delete detailData.Addr2;		// 주소 주소2
		delete detailData.Owner;		// 소유자
		delete detailData.Lotyp;		// 임차형태
		delete detailData.Warfe;		// 임차조건 보증금
		delete detailData.Monfe;		// 임차조건 월세
		delete detailData.Warst;		// 임차시세현황
		delete detailData.Conbg;		// 계약기간 시작
		delete detailData.Coned;		// 계약기간 종료
		delete detailData.Motyp;		// 담보형태
		delete detailData.Moseq;		// 담보순위
		delete detailData.Mosel;		// 담보설정 매매가
		delete detailData.Mopri;		// 담보설정 선순위 담보설정금액
		delete detailData.Moasr;		// 담보설정 보증금
		delete detailData.Morat;		// 담보설정 담보비율
		delete detailData.Mbfee;		// 부대비용 중개수수료
		delete detailData.Mlfee;		// 부대비용 전세권관련 수수료
		delete detailData.Zbigo;		// 비고
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},	
	
	onAfterSelectPernr : function(oController) {
		oController.onSearchHistory();
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			var vSuccessyn = common.MandateAction.onSaveMandate(oController);
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 결재라인 저장
			vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "MaternityLeaveDetail", oneData));
			
			createData.Begda = (createData.Begda) ? "\/Date("+ common.Common.getTime(createData.Begda)+")\/" : undefined;
			createData.Endda = (createData.Endda) ? "\/Date("+ common.Common.getTime(createData.Endda)+")\/" : undefined;
			createData.Dlvda = (createData.Dlvda) ? "\/Date("+ common.Common.getTime(createData.Dlvda)+")\/" : undefined;
			
			createData.Befday = createData.Befday == "" ? "0" : createData.Befday;
			createData.Aftday = createData.Aftday == "" ? "0" : createData.Aftday;
			
			delete createData.Gbdat;
			createData.Prcty = vPrcty;
			createData.Pernr = oneData.Pernr ;
			
			oModel.create("/MaternityLeaveDetailSet", createData, {
				success : function(data, res) {
					if(data) {
					} 
				},
				error : function (Res) {
					var errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			
			
			oController.BusyDialog.close();
			
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
	
	onValidationData : function(oController, vPrcty){		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(oneData.Pernr)) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(oneData.Aptyp)) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2537"), {title : oBundleText.getText("LABEL_0053")});	// 2537:신청유형를 선택하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(oneData.Begda)) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1219"), {title : oBundleText.getText("LABEL_0053")});	// 1219:시작일자를 입력하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(oneData.Endda)) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1220"), {title : oBundleText.getText("LABEL_0053")});	// 1220:종료일자를 입력하여 주십시오.
			return false;
		}
		if(common.Common.checkDate(oneData.Begda, oneData.Endda) == false) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2526"), {title : oBundleText.getText("LABEL_0053")});	// 2526:시작일자가 종료일자를 보다 큽니다.\n 확인하여 정확하게 입력하여 주십시오.
			return false;
		}
		
		if(oneData.Aptyp == "2010"){
			if(common.Common.checkNull(oneData.Dlvda)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2493"), {title : oBundleText.getText("LABEL_0053")});	// 2493:분만예정일을 입력하여 주십시오.
				return false;
			}
			
			if(common.Common.checkNull(oneData.Twins)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2448"), {title : oBundleText.getText("LABEL_0053")});	// 2448:다태아 구분을 선택하여 주십시오.
				return false;
			}
		} else if(oneData.Aptyp == "2025") {
			if(common.Common.checkNull(oneData.Pregwks)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2890"), {title : oBundleText.getText("LABEL_0053")});	// 2890:주수를 선택하여 주십시오.
				return false;
			}
			
			if(common.Common.checkNull(oneData.Pregdays)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2891"), {title : oBundleText.getText("LABEL_0053")});	// 2891:일수를 선택하여 주십시오.
				return false;
			}
		}else if(oneData.Aptyp == "3010"){
			if(common.Common.checkNull(oneData.Regno)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2575"), {title : oBundleText.getText("LABEL_0053")});	// 2575:자녀명을 선택하여 주십시오.
				return false;
			}
		}
		
		if(vPrcty == "C") {
			if((oneData.Aptyp == "2010" || 	oneData.Aptyp == "2025") && !oneData.Docyn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0284"));	// 284:증빙자료를 첨부하세요.
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
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
				
				oModel.remove("/MaternityLeaveDetailSet(Appno='" + oController._vAppno + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						var errData = common.Common.parseError(Res);
						vErrorMessage = errData.ErrorMessage;
					}
				});
				
				oController.BusyDialog.close();
								
				if(vErrorMessage != ""){
					sap.m.MessageBox.error(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
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
	
	onChangeDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
		    oController = oView.getController(),
		    vData = oController._DetailJSonModel.getProperty("/Data"),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		
		if(common.Common.checkNull(vData.Aptyp) || common.Common.checkNull(vData.Begda) || common.Common.checkNull(vData.Endda)) return ;
		var aFilters = [], rData = {}, errData ={};
		
		aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vData.Aptyp ));
		aFilters.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, vData.Begda ));
		aFilters.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, vData.Endda ));
	
		if(!common.Common.checkNull(vData.Dlvda))
			aFilters.push(new sap.ui.model.Filter('Dlvda', sap.ui.model.FilterOperator.EQ, vData.Dlvda ));
		
		if(!common.Common.checkNull(vData.Twins))
			aFilters.push(new sap.ui.model.Filter('Twins', sap.ui.model.FilterOperator.EQ, vData.Twins ));
		
		oModel.read("/MaternityLeaveCalcSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					rData = data.results[0];
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
				}
			});
		}
		
		if(common.Common.checkNull(rData)) return;
		
		oController._DetailJSonModel.setProperty("/Data/Useday", "" + (rData.Useday * 1).toFixed(0)); //사용일수
		if(vData.Aptyp == "2010"){ // 출산휴가
			oController._DetailJSonModel.setProperty("/Data/Befday", rData.Befday * 1 == 0 ? "" : "" + (rData.Befday * 1).toFixed(0)); //출산전일수
			oController._DetailJSonModel.setProperty("/Data/Aftday", rData.Aftday * 1 == 0 ? "" : "" + (rData.Aftday * 1).toFixed(0)); //출산후일수
		}
	},
	
	onChangeAptyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
			oController = oView.getController(),
			oTypeARow1 = sap.ui.getCore().byId(oController.PAGEID + "_TypeARow1"),
			oTypeARow2 = sap.ui.getCore().byId(oController.PAGEID + "_TypeARow2"),
			oTypeBRow1 = sap.ui.getCore().byId(oController.PAGEID + "_TypeBRow1"),
			oTypeCRow1 = sap.ui.getCore().byId(oController.PAGEID + "_TypeCRow1"),
			oHistoryTable1 = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable1"),
			oHistoryTable2 = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable2"),
			vAptyp = oController._DetailJSonModel.getProperty("/Data/Aptyp");
		
		if(oEvent){
			// Data 초기화 
			oController._DetailJSonModel.setProperty("/Data/Begda", ""); // 기간
			oController._DetailJSonModel.setProperty("/Data/Endda", "");
			oController._DetailJSonModel.setProperty("/Data/Useday", ""); // 사용일수
			oController._DetailJSonModel.setProperty("/Data/Dlvda", ""); // 분만예정일
			oController._DetailJSonModel.setProperty("/Data/Twins", ""); // 다태아
			oController._DetailJSonModel.setProperty("/Data/Regno", ""); // 자녀명
			oController._DetailJSonModel.setProperty("/Data/Gbdat", ""); // 생년월일
			oController._DetailJSonModel.setProperty("/Data/GbdatX", ""); // 생년월일
			oController._DetailJSonModel.setProperty("/Data/Befday", ""); // 출산전일수
			oController._DetailJSonModel.setProperty("/Data/Aftday", ""); // 출산후일수
		}
		
		if(vAptyp=="2010"){ // 출산휴가
			oTypeARow1.removeStyleClass("DisplayNone");
			oTypeARow2.removeStyleClass("DisplayNone");
			oTypeBRow1.addStyleClass("DisplayNone");
			oTypeCRow1.addStyleClass("DisplayNone");
			oHistoryTable1.setVisible(true);
			oHistoryTable2.setVisible(false);
		}else if(vAptyp =="2025"){ // 유사산휴가
			oTypeARow1.addStyleClass("DisplayNone");
			oTypeARow2.addStyleClass("DisplayNone");
			oTypeBRow1.addStyleClass("DisplayNone");
			oTypeCRow1.removeStyleClass("DisplayNone");
			oHistoryTable1.setVisible(false);
			oHistoryTable2.setVisible(true);
		}else if(vAptyp =="3010"){ // 육아휴직
			oTypeARow1.addStyleClass("DisplayNone");
			oTypeARow2.addStyleClass("DisplayNone");
			oTypeBRow1.removeStyleClass("DisplayNone");
			oTypeCRow1.addStyleClass("DisplayNone");
			oHistoryTable1.setVisible(false);
			oHistoryTable2.setVisible(true);
			// 자녀 조회
			oController.onSetFamily(oController);
			
		}else{
			oTypeARow1.addStyleClass("DisplayNone");
			oTypeARow2.addStyleClass("DisplayNone");
			oTypeBRow1.addStyleClass("DisplayNone");
			oTypeCRow1.addStyleClass("DisplayNone");
			oHistoryTable1.setVisible(false);
			oHistoryTable2.setVisible(false);
		}
		
		// 신청이력 조회
		oController.onSearchHistory(oController);
	},
	
	onSearchHistory : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
	    oController = oView.getController(),
	    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
	    oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable1"),
	    oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable2"),
	    oJSonModel1 = oTable1.getModel(),
	    oJSonModel2 = oTable2.getModel(),
	    vData = { Data : []},
	    aFilters = [], errData = {},
	    vAptyp = oController._DetailJSonModel.getProperty("/Data/Aptyp"),
	    vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
	    vRegno = oController._DetailJSonModel.getProperty("/Data/Regno"),
		vEncid = oController._TargetJSonModel.getProperty("/Data/Encid");
		
		if(common.Common.checkNull(vAptyp)){
			
		}else if(common.Common.checkNull(vPernr)){
			
		}else if(vAptyp == "3010" && common.Common.checkNull(vRegno)){
			
		}else{
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Aptyp")));
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Appno")));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._TargetJSonModel.getProperty("/Data/Encid")));
			
			if(vAptyp == "3010")
				aFilters.push(new sap.ui.model.Filter('Regno', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Regno")));	
			
			oModel.read("/MaternityLeaveLogSet", { 
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						for(var i = 0; i < data.results.length; i++){
							vData.Data.push(data.results[i]);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
			}
		}
		
		oJSonModel1.setData(vData);
		oJSonModel2.setData(vData);
		oTable1.setVisibleRowCount(vData.Data.length);
		oTable2.setVisibleRowCount(vData.Data.length);
	},
	
	onSetFamily : function(oController){
		var oFamily = sap.ui.getCore().byId(oController.PAGEID + "_Family"),
	    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
	    errData = {},
	    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
	    aFilters = [];
		oFamily.destroyItems();
		
		if(common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Pernr"))) return ;
		
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._TargetJSonModel.getProperty("/Data/Encid")));
		
		oModel.read("/MaternityLeaveFamSet", { 
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i = 0; i < data.results.length; i++){
						oFamily.addItem(
								new sap.ui.core.Item({ 
									key: data.results[i].Regno, 
									text: data.results[i].Fname,
									customData : new sap.ui.core.CustomData({
										key : "Gbdatx", 
										value : data.results[i].Gbdatx
//										common.Common.checkNull(data.results[i].Gbdat) ? "" : 
//											    dateFormat.format(new Date(common.Common.setTime(data.results[i].Gbdatx)))
									
								})
							})
						)
					}
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
				}
			});
		}
		
	},
	
	onChangeFamily : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
	    oController = oView.getController(),
	    oFamily = sap.ui.getCore().byId(oController.PAGEID + "_Family"),
		vGbdatx = oFamily.getSelectedItem().getCustomData()[0].getValue();
		
		oController._DetailJSonModel.setProperty("/Data/Gbdatx",vGbdatx);
		
//		vGbdat = oFamily.getSelectedItem().getCustomData()[0].getValue();
//		
//		oController._DetailJSonModel.setProperty("/Data/Gbdat",vGbdat);
		
		// 신청이력 조회
		oController.onSearchHistory(oController);
	},
	
	onSearchDetail : function(oController, vPrcty){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = {Data : []},
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		    errData = {};
	
		if(!common.Common.checkNull(vHeader.Pernr) && !common.Common.checkNull(vHeader.Vcbeg) && 
		   !common.Common.checkNull(vHeader.Vcend) && !common.Common.checkNull(vHeader.Aptyp)){
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, vPrcty));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vHeader.Encid ));
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vHeader.Aptyp ));
			aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vHeader.Vcbeg ));
			aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vHeader.Vcend ));
			
			oModel.read("/LeaveAppDetailSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						for(var i = 0; i < data.results.length; i++){
							data.results[i].Datum = dateFormat.format(new Date(common.Common.setTime(data.results[i].Datum)));
							data.results[i].ZappStatAl = vHeader.ZappStatAl;
							oTableData.Data.push(data.results[i]);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
			}
		}
		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
	},
	
	onSearchDetailTable : function(oController, _sPath){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
	    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
	    oJSonModel = oTable.getModel(),
	    oTableData = {Data : []},
	    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
	    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
	    errData = {};

		oModel.read("/LeaveAppDetailSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i = 0; i < data.results.length; i++){
						data.results[i].Datum = dateFormat.format(new Date(common.Common.setTime(data.results[i].Datum)));
						data.results[i].ZappStatAl = vHeader.ZappStatAl;
						oTableData.Data.push(data.results[i]);
					}
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
				}
			});
		}
	},
	
	onSearchHeader : function(oController, vPrcty){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		
		var aFilters = [ new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
						 new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, vPrcty)];
		
		var vData = {}, errData = {}; 
		if(!common.Common.checkNull(vHeader.Vcbeg) && !common.Common.checkNull(vHeader.Vcend) && !common.Common.checkNull(vHeader.Awart)){
			oModel.read("/MaternityLeaveListSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					vHeader.Ttext = data.results[0].Ttext;
					vHeader.Posday = "" + (data.results[0].Posday * 1).toFixed(1);
					vHeader.Useday = "" + (data.results[0].Useday * 1).toFixed(1);
					vHeader.Balday = "" + (data.results[0].Balday * 1).toFixed(1);
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
				return ;
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data", vHeader);
	},
	
	onCheckWorkSchedule : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Begda")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0063"), {title : oBundleText.getText("LABEL_0053")});	// 63:적용일을 선택하여 주십시오.
			return;
		}
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._PernrTprogDialog) {
			oController._PernrTprogDialog = sap.ui.jsfragment("ZUI5_HR_ParentalLeave.fragment.PernrTprog", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TprogTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vData = {Data : []};
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
			new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Begda"))
		];
		
		oModel.read("/PernrTprogListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				// 기준일, 근무형태
				var headerData = {Data : {}};
				headerData.Data.Datum = oController._DetailJSonModel.getProperty("/Data/Begda");
				
				if(data.results && data.results.length > 0) {
					headerData.Data.Rtext = data.results[0].Rtext;
					
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						vData.Data.push(data.results[i]);
					}
					
					oController._TprogTableJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length);
				}
				
				oController._TprogJSonModel.setData(headerData);
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController._PernrTprogDialog.open();
		
	},
});
