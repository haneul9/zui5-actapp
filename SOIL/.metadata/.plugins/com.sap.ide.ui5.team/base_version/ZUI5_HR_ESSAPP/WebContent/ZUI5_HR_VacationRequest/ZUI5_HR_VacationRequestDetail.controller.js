jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail
	 */

	PAGEID : "ZUI5_HR_VacationRequestDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM04",
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
			vEncid = "",
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
		// 상세 조회 Detail
		oController.retrieveDetailTable(oController, oDetailData.Data.ZappStatAl);
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
		// 휴가 유형에 따른 필드 활성화
		oController.onSetVisibleRow(oController);
		
		// 대상자 검색시 Default 조직을 설정
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		oController._vOrgeh = vEmpLoginInfo[0].Orgeh;
		oController._vOrgtx = vEmpLoginInfo[0].Stext;
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail");
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
		
		oModel.read("/LeaveAppListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'),
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				oDetailData.Data.Pernr = oDetailData.Data.Zpernr ;
				oDetailData.Data.Encid = oDetailData.Data.Encid ;
				oDetailData.Data.Posday = "" + (data.results[0].Posday * 1).toFixed(1);
				oDetailData.Data.Useday = "" + (data.results[0].Useday * 1).toFixed(1);
				oDetailData.Data.Balday = "" + (data.results[0].Balday * 1).toFixed(1);
				oDetailData.Data.Vcbeg = dateFormat.format(new Date(common.Common.setTime(data.results[0].Vcbeg)));
				oDetailData.Data.Vcend = dateFormat.format(new Date(common.Common.setTime(data.results[0].Vcend)));
				oDetailData.Data.Babduda = common.Common.checkNull(oDetailData.Data.Babduda) ? "" : dateFormat.format(new Date(common.Common.setTime(data.results[0].Babduda)));
				oDetailData.Data.Mrdchk = oDetailData.Data.Mrdchk || false;
				oDetailData.Data.MatleavCnt = common.Common.checkNull(oDetailData.Data.MatleavCnt) ? 2 : (oDetailData.Data.MatleavCnt * 1) - 1; 
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
//						data.results[i].Datum = dateFormat.format(new Date(common.Common.setTime(data.results[i].Datum)));
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
		
		oModel.read("/LeaveAppListSet", {
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
		oController._DetailJSonModel.setProperty("/Data/MatleavCnt" , undefined);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2359") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 2359:휴가 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2359") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 2359:휴가 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_2359") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 2359:휴가 신청
		}
	},
	
	
	// 등록
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
		    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._vOrgeh = oController._TargetJSonModel.getProperty("/Data/Orgeh");
		oController._vOrgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx");
		oController._vSpath = oEvent.getSource().getBindingContext().sPath;
		oController._useCustomPernrSelection = "X";
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
			oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(oController._selectionRowIdx != null && vIDXs.length > 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			} else if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath,
			svPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr"),
			svPerid = mEmpSearchResult.getProperty(_selPath + "/Perid"),
			svEname = mEmpSearchResult.getProperty(_selPath + "/Ename"),
			svEncid = mEmpSearchResult.getProperty(_selPath + "/Encid");
		
			if(svPernr == oController._DetailJSonModel.getProperty("/Data/Pernr")){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2454"), {title : oBundleText.getText("LABEL_0053")});	// 2454:대상자와 동일한 대근자를 입력할 수는 없습니다.
				return;
			}
			
			var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			oDetailTable.getModel().setProperty(oController._vSpath + "/Pernr", oController._DetailJSonModel.getProperty("/Data/Pernr"));
			oDetailTable.getModel().setProperty(oController._vSpath + "/Sspnr", svPernr);
			oDetailTable.getModel().setProperty(oController._vSpath + "/Sperid", svPerid);
			oDetailTable.getModel().setProperty(oController._vSpath + "/Encid", svEncid);
			oDetailTable.getModel().setProperty(oController._vSpath + "/Ename", svEname);
			oDetailTable.getModel().setProperty(oController._vSpath + "/ZappStatAl", "");
			
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data")
			// 대근자 근태정보 조회
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		    errData = {},
			oneData = oController._DetailJSonModel.getProperty("/Data"),
			createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "LeaveAppList", oneData));
			
			createData.Vcbeg = (createData.Vcbeg) ? "\/Date("+ common.Common.getTime(createData.Vcbeg)+")\/" : undefined;
			createData.Vcend = (createData.Vcend) ? "\/Date("+ common.Common.getTime(createData.Vcend)+")\/" : undefined;
			createData.Prcty = "O";
			createData.Zpernr = oneData.Pernr ;
			createData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
			
			// 출산휴가일 경우
			if(createData.Aptyp == "2030"){
				createData.Babduda = (createData.Babduda) ? "\/Date("+ common.Common.getTime(createData.Babduda)+")\/" : undefined;
				createData.MatleavCnt = "" + (createData.MatleavCnt + 1);
			}else{
				delete createData.MatleavCnt;
				delete createData.Babduda;
			}
			
			var oTableData = [];
			for(var i = 0; i < vTableData.length; i++){
//				oneData = vTableData[i];
				var vTemp = {};
				Object.assign(vTemp, common.Common.copyByMetadata(oModel, "LeaveAppDetail", vTableData[i]));
				vTemp.Datum = (vTemp.Datum) ? "\/Date("+ common.Common.getTime(vTemp.Datum)+")\/" : undefined;
				oTableData.push(vTemp);
			}
			createData.LeaveAppNav = oTableData;
			
			var newTableData = {Data : []};
			oModel.create("/LeaveAppListSet", createData, {
				success : function(data, res) {
					if(data) {
						if(data.LeaveAppNav.results && data.LeaveAppNav.results.length){
							for(var i =0; i <data.LeaveAppNav.results.length; i++){
								data.LeaveAppNav.results[i].ZappStatAl = createData.ZappStatAl;
								newTableData.Data.push(data.LeaveAppNav.results[i]);
							}
						}
					} 
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				
				oDetailTable.getModel().setProperty(oController._vSpath + "/Pernr", "");
				oDetailTable.getModel().setProperty(oController._vSpath + "/Sspnr", "");
				oDetailTable.getModel().setProperty(oController._vSpath + "/Sperid", "");
				oDetailTable.getModel().setProperty(oController._vSpath + "/Encid", "");
				oDetailTable.getModel().setProperty(oController._vSpath + "/Ename", "");
				oDetailTable.getModel().setProperty(oController._vSpath + "/ZappStatAl", "");
				
			}else{
				oController._DetailTableJSonModel.setData(newTableData);
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail");
		var oController = oView.getController(),
		oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		// 선택한 값 Clear
		oDetailTable.getModel().setProperty(oController._vSpath + "/Pernr", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Sspnr", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Sperid", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Encid", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Ename", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/ZappStatAl", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Sttext", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/TwrktmDat", "0.0");
		oDetailTable.getModel().setProperty(oController._vSpath + "/TwrktmWek", "0.0");
		oDetailTable.getModel().setProperty(oController._vSpath + "/RestmTre", "0.0");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Zstat", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Confchk", "");
		oDetailTable.getModel().setProperty(oController._vSpath + "/Stprog", "");
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._vOrgeh = '';
		oController._vOrgtx = '';
		oController._useCustomPernrSelection = '';
		oController._vSpath = '';
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
		if(oController._MandateDialog && oController._MandateDialog.isOpen()){
			
		}else{
			// Header 조회
			if(oController.onSearchHeader(oController, "N") == "X"){
				return false;
			}
			oController.onSearchDetail(oController, "M");
		}
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
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
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "LeaveAppList", oneData));
			
			createData.Vcbeg = (createData.Vcbeg) ? "\/Date("+ common.Common.getTime(createData.Vcbeg)+")\/" : undefined;
			createData.Vcend = (createData.Vcend) ? "\/Date("+ common.Common.getTime(createData.Vcend)+")\/" : undefined;
			createData.Prcty = vPrcty;
			createData.Zpernr = oneData.Pernr ;
			createData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
			
			// 출산휴가일 경우
			if(createData.Aptyp == "2030"){
				createData.Babduda = (createData.Babduda) ? "\/Date("+ common.Common.getTime(createData.Babduda)+")\/" : undefined;
				createData.MatleavCnt = "" + (createData.MatleavCnt + 1);
			}else{
				delete createData.MatleavCnt;
				delete createData.Babduda;
			}
			
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			var oTableData = [];
			for(var i = 0; i < vTableData.length; i++){
//				oneData = vTableData[i];
				var vTemp = {};
				Object.assign(vTemp, common.Common.copyByMetadata(oModel, "LeaveAppDetail", vTableData[i]));
				vTemp.Datum = (vTemp.Datum) ? "\/Date("+ common.Common.getTime(vTemp.Datum)+")\/" : undefined;
				oTableData.push(vTemp);
			}
			createData.LeaveAppNav = oTableData; 
			
			oModel.create("/LeaveAppListSet", createData, {
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
		
		var QuestionProcess = function(){
			sap.m.MessageBox.show(vInfoTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose : CreateProcess
			});
		}
		
		if(vPrcty == "T"){
			QuestionProcess();
		}else{
			
			if(oController._DetailJSonModel.getProperty("/Data/Balday") * 1 < 0 ){
				var vAptyp = oController._DetailJSonModel.getProperty("/Data/Aptyp");
				if(vAptyp == "1000" || vAptyp == "1010" || vAptyp == "1020" || vAptyp == "1030"){
					sap.m.MessageBox.show(oBundleText.getText("LABEL_2931"),{
						title : oBundleText.getText("LABEL_0052"),	// 52:안내
						onClose : QuestionProcess
					});
				}else{
					QuestionProcess();
				}
			}else{
				QuestionProcess();
			}
		}
		

	},
	
	onValidationData : function(oController, vPrcty){		
		if(oController.onSearchHeader(oController, "N") == "X"){
			return false;
		}
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!oneData.Pernr) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		if(!oneData.Aptyp) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2653"), {title : oBundleText.getText("LABEL_0053")});	// 2653:휴가를 선택하여 주십시오.
			return false;
		}
		if(!oneData.Vcbeg || !oneData.Vcend) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2444"), {title : oBundleText.getText("LABEL_0053")});	// 2444:기간을 입력하여 주십시오.
			return false;
		}
		if(common.Common.checkDate(oneData.Vcbeg, oneData.Vcend) == false) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1221"), {title : oBundleText.getText("LABEL_0053")});	// 1221:시작일자가 종료일자보다 큽니다.
			return false ;
		}
		
		if(oneData.Useday * 1 == 0){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2582"), {title : oBundleText.getText("LABEL_0053")});	// 2582:적용일수가 0일 경우 신청은 불가합니다.
			return false ;
		}
		
		if(oneData.Aptyp == "2030" && common.Common.checkNull(oneData.Babduda)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2617"), {title : oBundleText.getText("LABEL_0053")});	// 2617:출산일자를 입력하여 주십시오.
			return false ;
		}
		
		if(oneData.Aptyp == "1040" && oneData.Balday * 1 < -0.5){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2969"), {title : oBundleText.getText("LABEL_0053")});	// 2969:하기휴가는 잔여일수가  -0.5 미만이 될 수 없습니다.  
			return false ;
		}
		
		if(vPrcty == "C") {
			if(!oneData.Docyn) {
				// 2030     배우자출산휴가 2040     난임치료휴가(유급) 2050     난임치료휴가(무급)  가족돌봄휴가 2090
				if(oneData.Aptyp =="2030" || oneData.Aptyp =="2040" || oneData.Aptyp =="2050" || oneData.Aptyp =="2090"){
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
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
				
				oModel.remove("/LeaveAppListSet(Appno='" + oController._vAppno + "')", {
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
		    oController = oView.getController(),
		    vData = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = {Data : []};
		
			if(oController.onSearchHeader(oController, "N") == "X"){
				return false;
			}
			oController.onSearchDetail(oController, "M");
			oController.onCheckBabduda();
	},
	
	onChangeAptyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
	    oController = oView.getController();
		
		if(oEvent.getSource().getSelectedItem()){
			var vAwart = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
			oController._DetailJSonModel.setProperty("/Data/Awart", vAwart);
			oController._DetailJSonModel.setProperty("/Data/Aptxt", oEvent.getSource().getSelectedItem().getText());
			
			
			if(vAwart == "1010" || vAwart == "1020" || vAwart == "1030" || oController._DetailJSonModel.getProperty("/Data/CredayYea") * 1 > 0 ){
				
			}else{
				oController._DetailJSonModel.setProperty("/Data/Mrdchk", false); 
			}
		
			if(oController.onSearchHeader(oController, "N") == "X"){
				return false;
			}
			oController.onSearchDetail(oController, "M");
		}
		
		// 휴가유형 변경 시 배우자 출산휴가 횟수, 출산일자 초기화
		oController._DetailJSonModel.setProperty("/Data/MatleavCnt", 2);
		oController._DetailJSonModel.setProperty("/Data/Babduda", "");
		
		oController.onSetVisibleRow(oController);
	},

	
	// 출산일자 가능여부 확인/ 출산일자 조회
	onCheckBabduda : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
	    oController = oView.getController();
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var vData = {}, errData = {}; 
		var aFilters = [];
//		if(oEvent){
//			oController._DetailJSonModel.setProperty("/Data/Babduda","");
//		}
		
		if(common.Common.checkNull(vHeader.Aptyp) || vHeader.Aptyp != "2030") return;
		if(common.Common.checkNull(vHeader.Vcbeg)) return ;
		if(common.Common.checkNull(vHeader.Vcend)) return ;
		
		if(vHeader.MatleavCnt == 0){
			if(common.Common.checkNull(vHeader.Babduda)) return ;
			aFilters.push(new sap.ui.model.Filter('Babduda', sap.ui.model.FilterOperator.EQ, vHeader.Babduda ));
		}
		
		aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vHeader.Vcbeg ));
		aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vHeader.Vcend ));
		
		aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "P"));
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vHeader.Encid ));
		aFilters.push(new sap.ui.model.Filter('MatleavCnt', sap.ui.model.FilterOperator.EQ, "" + ( vHeader.MatleavCnt + 1 )));
		aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno ));			
		
		oModel.read("/LeaveAppListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data && data.results.length > 0){
					oController._DetailJSonModel.setProperty("/Data/Babduda", dateFormat.format(new Date(common.Common.setTime(data.results[0].Babduda))));
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
				oController._DetailJSonModel.setProperty("/Data/Babduda", "");
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					
				}
			});
		}else{
			if(oEvent){
				if(oController.onSearchHeader(oController, "N") == "X"){
					return false;
				}
				oController.onSearchDetail(oController, "M");
			}
		}
	},
	
	onSetVisibleRow : function(oController){
		var oChildBirthRow = sap.ui.getCore().byId(oController.PAGEID + "_ChildBirthRow"), 
		    vAptyp = oController._DetailJSonModel.getProperty("/Data/Aptyp");
		
		if(vAptyp == "2030"){
			oChildBirthRow.removeStyleClass("DisplayNone");
		}else{
			oChildBirthRow.addStyleClass("DisplayNone");
		}
	},
	
	
	onSearchDetail : function(oController, vPrcty){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = {Data : []},
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		    errData = {};
	
		if(!common.Common.checkNull(vHeader.Encid) && !common.Common.checkNull(vHeader.Vcbeg) && 
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
	
	onSearchHeader : function(oController, vPrcty){
		var vHeader = oController._DetailJSonModel.getProperty("/Data"),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = {Data : []},
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var vData = {}, errData = {}; 
		
		if(!common.Common.checkNull(vHeader.Encid) && !common.Common.checkNull(vHeader.Vcbeg) && 
				   !common.Common.checkNull(vHeader.Vcend) && !common.Common.checkNull(vHeader.Aptyp)){
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, vPrcty));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vHeader.Encid ));
			aFilters.push(new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vHeader.Aptyp ));
			aFilters.push(new sap.ui.model.Filter('Vcbeg', sap.ui.model.FilterOperator.EQ, vHeader.Vcbeg ));
			aFilters.push(new sap.ui.model.Filter('Vcend', sap.ui.model.FilterOperator.EQ, vHeader.Vcend ));
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno ));	
			aFilters.push(new sap.ui.model.Filter('MatleavCnt', sap.ui.model.FilterOperator.EQ, "" + (vHeader.MatleavCnt + 1 )));	
		
			oModel.read("/LeaveAppListSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length > 0){
						vHeader.Ttext = data.results[0].Ttext;
						vHeader.Posday = "" + (data.results[0].Posday * 1).toFixed(1);
						vHeader.Useday = "" + (data.results[0].Useday * 1).toFixed(1);
						vHeader.Balday = "" + (data.results[0].Balday * 1).toFixed(1);
						vHeader.CredayYea = data.results[0].CredayYea ;
						vHeader.CredayVac = data.results[0].CredayVac ;
						vHeader.CredayEtc = data.results[0].CredayEtc ;
						vHeader.UsedayYea = data.results[0].UsedayYea ;
						vHeader.UsedayVac = data.results[0].UsedayVac ;
						vHeader.UsedayEtc = data.results[0].UsedayEtc ;
						vHeader.BaldayYea = data.results[0].BaldayYea ;
						vHeader.BaldayVac = data.results[0].BaldayVac ;
						vHeader.BaldayEtc = data.results[0].BaldayEtc ;
						vHeader.Beguz = data.results[0].Beguz ;
						vHeader.Enduz = data.results[0].Enduz ;
						vHeader.ShiftYn = data.results[0].ShiftYn ;
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return "X";
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data", vHeader);
		return "";
	},
	
	onCheckWorkSchedule : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Vcbeg")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0063"), {title : oBundleText.getText("LABEL_0053")});	// 63:적용일을 선택하여 주십시오.
			return;
		}
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._PernrTprogDialog) {
			oController._PernrTprogDialog = sap.ui.jsfragment("ZUI5_HR_VacationRequest.fragment.PernrTprog", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TprogTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vData = {Data : []};
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
			new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Vcbeg"))
		];
		
		oModel.read("/PernrTprogListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				// 기준일, 근무형태
				var headerData = {Data : {}};
				headerData.Data.Datum = oController._DetailJSonModel.getProperty("/Data/Vcbeg");
				
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
