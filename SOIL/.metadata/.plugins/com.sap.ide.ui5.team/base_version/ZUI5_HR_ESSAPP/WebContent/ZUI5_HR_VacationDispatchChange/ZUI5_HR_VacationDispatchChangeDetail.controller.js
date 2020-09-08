jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail", {
	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail
	 */

	PAGEID : "ZUI5_HR_VacationDispatchChangeDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyTableJSonModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	
	_Columns : "",
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM22",
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
		// 상세조회 신청내역 Table
		oController.retrieveApplyTable(oController, oDetailData.Data); 
		
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
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		this.onSetRowSpan();
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
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
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail");
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
		
		oModel.read("/ChangeDispatchLeaveDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'),
			],
			success : function(data, res) {
				var oneData = {};
				Object.assign(oneData, data.results[0]);
				oDetailData.Data = data.results[0];
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
	
	retrieveApplyTable : function(oController, vData) {
		var oTableData = {Data : []},
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		oJSonModel = oTable.getModel(),
		oneData = {},
		dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		if(oController._vAppno && oController._vAppno != ""){
			
			Object.assign(oneData, vData);
			oneData.Ovcbeg = dateFormat.format(new Date(common.Common.setTime(oneData.Ovcbeg)));
			oneData.Ovcend = dateFormat.format(new Date(common.Common.setTime(oneData.Ovcend)));
			oneData.Begda = oneData.Begda ? dateFormat.format(new Date(common.Common.setTime(oneData.Begda))) : "";
			oneData.Endda = oneData.Endda ? dateFormat.format(new Date(common.Common.setTime(oneData.Endda))) : "";
			oneData.Useday = (oneData.Useday * 1).toFixed(1);
			oTableData.Data.push(oneData);
		}		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			errData = {};
		
		oModel.read("/ChangeDispatchLeaveDetailSet", {
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
		oController._DetailJSonModel.setProperty("/Data/Appno" , oController._vAppno);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2291") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 2291:파견직 근태 변경/취소 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2291") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 2291:파견직 근태 변경/취소 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_2291") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 2291:파견직 근태 변경/취소 신청
		}
	},
	
	onSetRowSpan : function(oEvent){
		 var oTds = $("td[colspan]");
         for(i=0; i<oTds.length; i++) {
            if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
         }   
         
         common.Common.generateForceRowspan({
 			selector : '#ZUI5_HR_VacationDispatchChangeDetail_ApplyTable-header > tbody',
 			colIndexes : [6, 7]
 		});
         
 		// Table Header 높이 설정
 		var $target = $('#ZUI5_HR_VacationDispatchChangeDetail_ApplyTable-header > tbody> tr');
 		
 		$target.each(function() {
 			$(this).css('height', '33px');
 		});
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController, isDelHstyp) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		detailData.Aptyp = ""; // 신청유형
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},	
	
	onResetDetailTable : function(oController) {
		var oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable");

		if(oApplyTable){
			oApplyTable.setVisibleRowCount(1);
			oApplyTable.getModel().setData({Data : []});
		}
	},
	
	onAfterSelectPernr : function(oController) {
		if(oController._MandateDialog && oController._MandateDialog.isOpen()){
			
		}else{
			oController.onResetDetail(oController);
			oController.onResetDetailTable(oController);
		}
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		var vRet = oController.onValidationData(oController, vPrcty);
		if(vRet == false) return;
		
		var onProcess = function(){
			// 위임여부 저장
			var vSuccessyn = common.MandateAction.onSaveMandate(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
				oneData2 = oController._ApplyTableJSonModel.getProperty("/Data/0"),
				oneData = {}, 
				createData = {};
			Object.assign(oneData, oneData2),
			
			oneData.Begda = (oneData.Begda) ? "\/Date("+ common.Common.getTime(oneData.Begda)+")\/" : undefined;
			oneData.Endda = (oneData.Endda) ? "\/Date("+ common.Common.getTime(oneData.Endda)+")\/" : undefined;
			oneData.Ovcbeg = (oneData.Ovcbeg) ? "\/Date("+ common.Common.getTime(oneData.Ovcbeg)+")\/" : undefined;
			oneData.Ovcend = (oneData.Ovcend) ? "\/Date("+ common.Common.getTime(oneData.Ovcend)+")\/" : undefined;
			oneData.Appno = oController._DetailJSonModel.getProperty("/Data/Appno");
			Object.assign(createData, common.Common.copyByMetadata(oModel, "ChangeDispatchLeaveDetail", oneData));
			
			createData.Prcty = vPrcty;
			createData.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr") ;
			createData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename") ;
			createData.Takper = oController._DetailJSonModel.getProperty("/Data/Takper") ;
			if(createData.Chtyp == "A") createData.Chtxt = oBundleText.getText("LABEL_0751");	// 751:변경
			else createData.Chtxt = oBundleText.getText("LABEL_0071");	// 71:취소
			
			oModel.create("/ChangeDispatchLeaveDetailSet", createData, {
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
		var vMeesageFunc = function(){
			sap.m.MessageBox.show(vInfoTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose : CreateProcess
			});
		}
		
		if(vRet == "W"){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2479"), {	// 2479:변경 후 휴가일수가 줄었습니다. \n 추가로 휴가신청서를 작성하세요.
				title : oBundleText.getText("LABEL_1484"),	// 1484:경고
				onClose : vMeesageFunc
			});
		}else{
			vMeesageFunc();
		}
		
	},
	
	onValidationData : function(oController, vPrcty){		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!oneData.Pernr) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		if(!oneData.Chtyp) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2531"), {title : oBundleText.getText("LABEL_0053")});	// 2531:신청 유형을 선택하여 주십시오.
			return false;
		}
		
		var vApplyData = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable").getModel().getData();
		
		// 신청유형이 변경일 경우
		if(oneData.Chtyp == "A"){
			if(common.Common.checkNull(vApplyData.Data)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2480"), {title : oBundleText.getText("LABEL_0053")});	// 2480:변경할 Data를 선택하여 주십시오.
				return false;
			}
			var vTotal = 0, vOldTotal = 0;
			for(var i=0; i<vApplyData.Data.length; i++){
				var vIdx = i + 1, element = vApplyData.Data[i];
				if(common.Common.checkNull(element.Aptyp)){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2536"), {title : oBundleText.getText("LABEL_0053")});	// 2536:신청내역의 휴가 정보가 입력되지 않았습니다.
					return false;
				}
				
				if(common.Common.checkNull(element.Begda)){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2533"), {title : oBundleText.getText("LABEL_0053")});	// 2533:신청내역의 시작일자가 입력되지 않았습니다.
					return false;
				}
				
				if(common.Common.checkNull(element.Endda)){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2535"), {title : oBundleText.getText("LABEL_0053")});	// 2535:신청내역의 종료일자가 입력되지 않았습니다.
					return false;
				}
				
				if(common.Common.checkDate(element.Begda, element.Endda) == false) {
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2534"), {title : oBundleText.getText("LABEL_0053")});	// 2534:신청내역의 시작일자가 종료일자보다 큽니다.
					return false ;
				}
				
				if(element.Useday * 1 == 0){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2474"), {title : oBundleText.getText("LABEL_0053")});	// 2474:번째 신청내역의 휴가일수가 0 입니다.
					return false;
				}
				vTotal = vTotal + (element.Useday * 1);
				vOldTotal = vOldTotal + (element.Ouseday * 1);
			}
			
		}else{
			if(common.Common.checkNull(vApplyData.Data)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2620"), {title : oBundleText.getText("LABEL_0053")});	// 2620:취소할 Data를 선택하여 주십시오.
				return false;
			}
		}
		
		if(vPrcty == "C") {
			if(!oneData.Docyn) {
				// 1510     경조휴가 1520     업무외병가(유급) 1530     업무외병가(무급) 1540     업무상병가
				if(oneData.Aptyp =="1510" || oneData.Aptyp =="1520" || oneData.Aptyp =="1530" || oneData.Aptyp =="1540"){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0284"));	// 284:증빙자료를 첨부하세요.
					return "";
				}
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
		
		if(vOldTotal > vTotal){
			return "W";
		}
		return true;
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
				
				oModel.remove("/ChangeDispatchLeaveDetailSet(Appno='" + oController._vAppno + "')", {
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
	
	onChangeChtyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
	    oController = oView.getController(),
	    oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
	    oApplyModel = oApplyTable.getModel(),
	    vApplyData = oApplyModel.getData(),
	    vChtyp = oController._DetailJSonModel.getProperty("/Data/Chtyp");
		
		if(common.Common.checkNull(vApplyData.Data)) return;
		
		vApplyData.Data.forEach(function(element){
			element.Chtyp = vChtyp ;
			if(vChtyp == "B"){
				element.Begda = element.Ovcbeg;
				element.Endda = element.Ovcend;
				element.Useday = element.Ouseday;
			}
		})
		oApplyModel.setData(vApplyData);
	},
	
	onCheckWorkSchedule : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		var oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		oApplyModel = oApplyTable.getModel(),
		vApplyData = oApplyModel.getData();
		
	
		if(!vApplyData || !vApplyData.Data || vApplyData.Data.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2598"));	// 2598:조회할 신청건을 선택하여 주십시오.
			return;
		} 
	
		if(!oController._PernrTprogDialog) {
			oController._PernrTprogDialog = sap.ui.jsfragment("ZUI5_HR_VacationDispatchChange.fragment.PernrTprog", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TprogTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vData = {Data : []};
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr),
			new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, vApplyData.Data[0].Begda)
		];
		
		oModel.read("/PernrTprogListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				// 기준일, 근무형태
				var headerData = {Data : {}};
				headerData.Data.Datum = vApplyData.Data[0].Begda;
				
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
	
	openHistoryDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._HistoryDialog) {
			oController._HistoryDialog = sap.ui.jsfragment("ZUI5_HR_VacationDispatchChange.fragment.ApplyHistory", oController);
			oView.addDependent(oController._HistoryDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
		oModel = oTable.getModel(),
		oHistoryMatrix = sap.ui.getCore().byId(oController.PAGEID + "_HistoryMatrix"),
		oHisotryModel = oHistoryMatrix.getModel(),
		curDate = new Date(),
		prevDate = new Date(curDate.getFullYear(), 0, 1),
		nextDate = new Date(curDate.getFullYear(), 11, 31),
		dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
		JSonData = { Data : { Begda : dateFormat.format(prevDate) , Endda : dateFormat.format(nextDate) ,
			         Pernr : oController._DetailJSonModel.getProperty("/Data/Pernr"), Ename : oController._TargetJSonModel.getProperty("/Data/Ename") }};
		
		oTable.clearSelection();
		oTable.setVisibleRowCount(1);
		oModel.setData({Data : []});
		oHisotryModel.setData(JSonData);
		
		oController._HistoryDialog.open();
	},
	
	onPressSearchHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
	    oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
		oHistoryMatrix = sap.ui.getCore().byId(oController.PAGEID + "_HistoryMatrix");
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vData = {Data : []}, errData = {},
			oHistoryTableModel = oTable.getModel(),
			oHisotryModel = oHistoryMatrix.getModel(),
			sData = oHisotryModel.getProperty("/Data");
		
		if(common.Common.checkNull(sData.Begda) || common.Common.checkNull(sData.Endda)){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2592"), {title : oBundleText.getText("LABEL_0053")});	// 2592:조회기간을 정확하게 입력하여 주십시오
			return;
		}
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr),
			new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, sData.Begda),
			new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, sData.Endda),
			new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "O"), 
		];
		
		var onProcess = function(){
			oModel.read("/ChangeDispatchLeaveDetailSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						data.results[i].Useday = ( data.results[i].Useday * 1 ).toFixed(1);
						vData.Data.push(data.results[i]);
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oHistoryTableModel.setData(vData);
			oTable.setVisibleRowCount(vData.Data.length);
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage)
				return ;
			}
		}
		oController.BusyDialog.open();		
		setTimeout(onProcess, 100);
		

	},
	
	onSelectHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail");
		    oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
		    oModel = oTable.getModel(),
		    vResult = oModel.getProperty("/Data"),
		    vIDXs = oTable.getSelectedIndices(),
		    seqNo = 0,
		    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		    
		if(vIDXs.length > 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2393"));	// 2393:1건을 선택할 수 있습니다.
			return;
		}else if(vIDXs.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2483"));	// 2483:변경할 신청건을 선택하여 주십시오.
			return;
		}

		var oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
			oApplyModel = oApplyTable.getModel(),
			vTableData = oApplyModel.getData();
		
		if(vTableData.Data && vTableData.Data.length > 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2632"));	// 2632:한 건의 신청만 변경/취소가 가능합니다.
			return;
		}
		
		// 중복체크
		vShiftYn = "";
		vChtyp = oController._DetailJSonModel.getProperty("/Data/Chtyp");
		vChtyp = oController._DetailJSonModel.getProperty("/Data/Chtyp");
		
		var addData = {} ,  temp = {}, vResult = {};
		vResult = oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
	
		Object.assign(addData, vResult);
		Object.assign(temp, vResult);

		addData.ZappStatAl = "";
		addData.Oappno = vResult.Appno;
		addData.Ovcbeg = dateFormat.format(vResult.Begda); 
		addData.Ovcend = dateFormat.format(vResult.Endda);
		addData.Begda = dateFormat.format(temp.Begda); 
		addData.Endda = dateFormat.format(temp.Endda);	
		addData.Obeguz = vResult.Beguz;
		addData.Oenduz = vResult.Enduz;
		addData.Oaptyp = vResult.Aptyp;
		addData.Oaptxt = vResult.Aptxt;
		addData.Oawart = vResult.Awart;
		addData.Ouseday = vResult.Useday;
		addData.Takper = vResult.Takper;
		addData.Chtyp = oController._DetailJSonModel.getProperty("/Data/Chtyp");
		addData.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		vTableData.Data.push(addData);
		oController._DetailJSonModel.setProperty("/Data/ShiftYn", addData.ShiftYn);
		oController._DetailJSonModel.getProperty("/Data/Takper", vResult.Takper);
		
		oApplyModel.setData(vTableData);
		oApplyTable.setVisibleRowCount(vTableData.Data.length);
		oApplyModel.refresh();
		
		oController._HistoryDialog.close();
	
	},
	
	onChangeTableAptyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
	    oController = oView.getController(),
	    oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
	    oApplyModel = oApplyTable.getModel(),
	    vAwart = "", vAptxt = "";
		
		if(oEvent.getSource().getSelectedItem()){
			vAwart = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
			vAptxt = oEvent.getSource().getSelectedItem().getText();
		}
		oApplyModel.setProperty(oEvent.getSource().getBindingContext().sPath + "/Awart", vAwart);
		oApplyModel.setProperty(oEvent.getSource().getBindingContext().sPath + "/Aptxt", vAptxt);
		
		oController.onCheckApply(oController, oEvent.getSource().getBindingContext().sPath);
	},
	
	onChangeDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail"),
		    oController = oView.getController();
		
		oController.onCheckApply(oController, oEvent.getSource().getBindingContext().sPath);
	},
	
	onCheckApply : function(oController, sPath){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = {Data : []},
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		    errData = {};
		
		if(common.Common.checkNull(sPath)) return;
		
		var vChangeData = oJSonModel.getProperty(sPath);
		
//		if(!common.Common.checkNull(vChangeData.Aptyp) && !common.Common.checkNull(vChangeData.Begda) && 
//		   !common.Common.checkNull(vChangeData.Endda)){
//			var aFilters = [], vResData = {};
//			aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "N"));
//			aFilters.push(new sap.ui.model.Filter('Zpernr', sap.ui.model.FilterOperator.EQ, vHeader.Pernr ));
//			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vHeader.Appno ));
////			aFilters.push(new sap.ui.model.Filter('Oappno', sap.ui.model.FilterOperator.EQ, vChangeData.Oappno ));
//			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vChangeData.Aptyp ));
//			aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vChangeData.Begda ));
//			aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vChangeData.Endda ));
//			aFilters.push(new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp ));
//			
//			oModel.read("/LeaveAppListSet", {
//				async : false,
//				filters : aFilters,
//				success : function(data, res) {
//					if(data.results && data.results.length) {
//						vChangeData.Useday = ( data.results[0].Useday * 1 ).toFixed(1);
//						vChangeData.CredayYea = data.results[0].CredayYea;
//						vChangeData.ShiftYn = data.results[0].ShiftYn;
//					}
//				},
//				error : function(Res) {
//					errData = common.Common.parseError(Res);
//					// Error 발생시 날짜 Clear
//					vChangeData.Begda = "";
//					vChangeData.Endda = "";
//					vChangeData.Useday = "";
//					oJSonModel.setProperty(sPath, vChangeData);
//					oJSonModel.refresh();
//				}
//			});
//			
//			if(errData.Error && errData.Error == "E"){
//				sap.m.MessageBox.alert(errData.ErrorMessage);
//				return;
//			}
//			oJSonModel.setProperty(sPath, vChangeData);
//			oJSonModel.refresh();
		if(!common.Common.checkNull(vChangeData.Aptyp) && !common.Common.checkNull(vChangeData.Begda) && 
		   !common.Common.checkNull(vChangeData.Endda)){
			var aFilters = [], vResData = {};
			aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "N"));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vHeader.Encid ));
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vHeader.Appno ));
			aFilters.push(new sap.ui.model.Filter('Oappno', sap.ui.model.FilterOperator.EQ, vChangeData.Oappno ));
			aFilters.push(new sap.ui.model.Filter('Oseqnr', sap.ui.model.FilterOperator.EQ, vChangeData.Oseqnr ));
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vChangeData.Aptyp ));
			aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vChangeData.Begda ));
			aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vChangeData.Endda ));
			
			oModel.read("/ChangeLeaveAppDetailSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						
						vChangeData.Useday = ( data.results[0].Useday * 1 ).toFixed(1);
						vChangeData.CredayYea = data.results[0].CredayYea;
						vChangeData.Offdut = data.results[0].Offdut;
						vChangeData.Conchk = data.results[0].Conchk;
						vChangeData.ShiftYn = data.results[0].ShiftYn;
						vChangeData.Beguz = data.results[0].Beguz;
						vChangeData.Enduz = data.results[0].Enduz;
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
					// Error 발생시 날짜 Clear
					vChangeData.Begda = "";
					vChangeData.Endda = "";
					vChangeData.Useday = "";
					oJSonModel.setProperty(sPath, vChangeData);
					oJSonModel.refresh();
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return;
			}
			oJSonModel.setProperty(sPath, vChangeData);
			oJSonModel.refresh();
			
		}else if(!common.Common.checkNull(vChangeData)){
			vChangeData.Useday = "";
			oJSonModel.setProperty(sPath, vChangeData);
		}
	},
	
	onDeleteHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail");
		var oController = oView.getController();
		var oApplyTable = sap.ui.getCore().byId(oController.PAGEID + "_ApplyTable"),
		oApplyModel = oApplyTable.getModel().setData({Data : []});
	},
	
	onHistoryExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are
								// using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_2292") + "-" + dateFormat.format(curDate) + ".xlsx"	// 2292:파견직 근태 변경/취소 신청 내역조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}
});
