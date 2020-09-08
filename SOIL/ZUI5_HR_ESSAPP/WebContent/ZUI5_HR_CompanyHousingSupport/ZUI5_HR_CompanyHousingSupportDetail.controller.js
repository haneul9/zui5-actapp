jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail
	 */

	PAGEID : "ZUI5_HR_CompanyHousingSupportDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailBeforeJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "HR39",
	_ObjList : [],
	_vOrgeh : "",
	_vOrgtx : "",
	_vPrvHstyp : "",
	_useCustomPernrSelection : "",
	BusyDialog : new sap.m.BusyDialog(),
	
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
			oDetailData = {Data : {}},
			oDetailBeforeData = {Data : {}};
		
		oController.BusyDialog.open();
		
		// 이전 신청구분 변수 초기화
		oController._vPrvHstyp = "";
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
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
		
		// 종전사택정보 조회
		vPernr = oController._DetailJSonModel.getProperty("/Data/Encid");
		oDetailBeforeData.Data = oController.retrieveDetailBefore(oController, vPernr);
		
		// 종전사택정보 Binding
		oController._DetailBeforeJSonModel.setData(oDetailBeforeData);
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail");
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/CompanyHouseApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'),
				new sap.ui.model.Filter('Begbn', sap.ui.model.FilterOperator.EQ, "B")
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.Nhsyn = oDetailData.Data.Nhsyn || false;
				oDetailData.Data.Hslyn = oDetailData.Data.Hslyn || false;
				oDetailData.Data.Conbg = (oDetailData.Data.Conbg) ? dateFormat.format(oDetailData.Data.Conbg) : undefined;
				oDetailData.Data.Coned = (oDetailData.Data.Coned) ? dateFormat.format(oDetailData.Data.Coned) : undefined;
				oDetailData.Data.Tperncongb = (oDetailData.Data.Tperncongb) ? dateFormat.format(oDetailData.Data.Tperncongb) : undefined;
				oDetailData.Data.Tpernconed = (oDetailData.Data.Tpernconed) ? dateFormat.format(oDetailData.Data.Tpernconed) : undefined;
				oDetailData.Data.Warfe = common.Common.numberWithCommas(oDetailData.Data.Warfe);
				oDetailData.Data.Monfe = common.Common.numberWithCommas(oDetailData.Data.Monfe);
				oDetailData.Data.Mosel = common.Common.numberWithCommas(oDetailData.Data.Mosel);
				oDetailData.Data.Mopri = common.Common.numberWithCommas(oDetailData.Data.Mopri);
				oDetailData.Data.Moasr = common.Common.numberWithCommas(oDetailData.Data.Moasr);
				oDetailData.Data.Mbfee = common.Common.numberWithCommas(oDetailData.Data.Mbfee);
				oDetailData.Data.Mlfee = common.Common.numberWithCommas(oDetailData.Data.Mlfee);
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
	
	retrieveDetailBefore : function(oController, vPernr) {
		var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			vCongb = oController._DetailJSonModel.getProperty("/Data/Conbg"),
			beforeData = {},
			errData = {},
			aFilters = [];
		
		if(!vPernr) return {};
		
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr));
		if(vCongb) aFilters.push(new sap.ui.model.Filter('Conbg', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vCongb)));
		
		oModel.read("/CompanyHouseBfSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					beforeData = data.results[0];
					
					beforeData.Conbg = dateFormat.format(beforeData.Conbg);
					beforeData.Coned = dateFormat.format(beforeData.Coned);
					beforeData.Warfe = common.Common.numberWithCommas(beforeData.Warfe);
					beforeData.Monfe = common.Common.numberWithCommas(beforeData.Monfe);
					beforeData.Mosel = common.Common.numberWithCommas(beforeData.Mosel);
					beforeData.Mopri = common.Common.numberWithCommas(beforeData.Mopri);
					beforeData.Moasr = common.Common.numberWithCommas(beforeData.Moasr);
					beforeData.Mbfee = common.Common.numberWithCommas(beforeData.Mbfee);
					beforeData.Mlfee = common.Common.numberWithCommas(beforeData.Mlfee);
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
			return {};
		}
		
		return beforeData;
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
			errData = {};
		
		oModel.read("/CompanyHouseApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I'),
				new sap.ui.model.Filter('Begbn', sap.ui.model.FilterOperator.EQ, "B")
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0320") + "/" + oBundleText.getText("LABEL_1132"));	// 320:사택지원 신청, 1132:승인서
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0320") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 320:사택지원 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0320") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 320:사택지원 신청
		}
	},
	
	onChangeHstyp : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController(),
			vHstyp = oEvent.getSource().getSelectedItem().getKey(),
			vBeforeData = oController._DetailBeforeJSonModel.getProperty("/Data");
		
		if(!vHstyp) return;
		
		if(vHstyp == "20" && !Object.keys(vBeforeData).length) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0357"), {});	// 357:종전 사택정보가 없습니다.
			oController._DetailJSonModel.setProperty("/Data/Hstyp", oController._vPrvHstyp);
			
			return;
		} else {
			// 신청정보 초기화
			oController.onResetDetail(oController, false);
		}
		
		if(vHstyp == "20") {	// 연장
			oController._DetailJSonModel.setProperty("/Data/Nhsyn", vBeforeData.Nhsyn);
			oController._DetailJSonModel.setProperty("/Data/Hslyn", vBeforeData.Hslyn);
			oController._DetailJSonModel.setProperty("/Data/Aprsn", "");
			oController._DetailJSonModel.setProperty("/Data/Mvtyp", vBeforeData.Mvtyp);
			oController._DetailJSonModel.setProperty("/Data/Hoshp", vBeforeData.Hoshp);
			oController._DetailJSonModel.setProperty("/Data/Fsize", vBeforeData.Fsize);
			oController._DetailJSonModel.setProperty("/Data/FsizeP", vBeforeData.FsizeP);
			oController._DetailJSonModel.setProperty("/Data/Psize", vBeforeData.Psize);
			oController._DetailJSonModel.setProperty("/Data/PsizeP", vBeforeData.PsizeP);
			oController._DetailJSonModel.setProperty("/Data/Pstlz", vBeforeData.Pstlz);
			oController._DetailJSonModel.setProperty("/Data/Addr1", vBeforeData.Addr1);
			oController._DetailJSonModel.setProperty("/Data/Addr2", vBeforeData.Addr2);
			oController._DetailJSonModel.setProperty("/Data/Owner", vBeforeData.Owner);
			oController._DetailJSonModel.setProperty("/Data/Lotyp", vBeforeData.Lotyp);
			oController._DetailJSonModel.setProperty("/Data/Warfe", vBeforeData.Warfe);
			oController._DetailJSonModel.setProperty("/Data/Monfe", vBeforeData.Monfe);
			oController._DetailJSonModel.setProperty("/Data/Warst", vBeforeData.Warst);
			oController._DetailJSonModel.setProperty("/Data/Conbg", undefined);
			oController._DetailJSonModel.setProperty("/Data/Coned", undefined);
			oController._DetailJSonModel.setProperty("/Data/Motyp", vBeforeData.Motyp);
			oController._DetailJSonModel.setProperty("/Data/Moseq", vBeforeData.Moseq);
			oController._DetailJSonModel.setProperty("/Data/Mosel", vBeforeData.Mosel);
			oController._DetailJSonModel.setProperty("/Data/Mopri", vBeforeData.Mopri);
			oController._DetailJSonModel.setProperty("/Data/Moasr", vBeforeData.Moasr);
			oController._DetailJSonModel.setProperty("/Data/Morat", vBeforeData.Morat);
			oController._DetailJSonModel.setProperty("/Data/Mbfee", "0");
			oController._DetailJSonModel.setProperty("/Data/Mlfee", "0");
			oController._DetailJSonModel.setProperty("/Data/Zbigo", "");
		}
		
		oController._vPrvHstyp = vHstyp;
	},
	
	onChangeFsize : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController(),
			vFsize = oEvent.getSource().getValue(),
			convertPVal = 0;
		
		if(!vFsize) return;
		
		convertPVal = oController.convertPyung(vFsize);
		
		oController._DetailJSonModel.setProperty("/Data/FsizeP", convertPVal);
	},

	onChangePsize : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController(),
			vPsize = oEvent.getSource().getValue(),
			convertPVal = 0;
		
		if(!vPsize) return;
		
		convertPVal = oController.convertPyung(vPsize);
		
		oController._DetailJSonModel.setProperty("/Data/PsizeP", convertPVal);
	},
	
	convertPyung : function(vSize) {
		var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
			returnConvertVal = 0;
		
		oModel.read("/CalcPyeongSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Size', sap.ui.model.FilterOperator.EQ, vSize)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					returnConvertVal = data.results[0].SizeP;
				}
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		return returnConvertVal;
	},
	
	onChangeWarfe : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController();
		
		oController._DetailJSonModel.setProperty("/Data/Moasr", oEvent.getSource().getValue());
		
		oController.calcMorat();
	},
	
	calcMorat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController(),
			vMosel = oController._DetailJSonModel.getProperty("/Data/Mosel"),
			vMopri = oController._DetailJSonModel.getProperty("/Data/Mopri") || "0",
			vMoasr = oController._DetailJSonModel.getProperty("/Data/Moasr"),
			calcMoasr = 0;
		
		if(!vMosel || !vMoasr) return;
		
		vMosel = Number(vMosel.replace(/[^\d]/g, ''));
		vMopri = Number(vMopri.replace(/[^\d]/g, ''));
		vMoasr = Number(vMoasr.replace(/[^\d]/g, ''));
		
		calcMoasr = (vMosel == 0) ? 0 : (vMopri + vMoasr) / vMosel * 100;
		
		oController._DetailJSonModel.setProperty("/Data/Morat", calcMoasr.toFixed(2));
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
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Encid"),
			oDetailBeforeData = {Data : []};
		
		// 신청내역 초기화
		oController.onResetDetail(oController, true);
		
		// 종전사택정보 조회
		oDetailBeforeData.Data = oController.retrieveDetailBefore(oController, vPernr);
		
		// 종전사택정보 Binding
		oController._DetailBeforeJSonModel.setData(oDetailBeforeData);
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController();
		
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
			
			// 사택지원 신청 저장
			var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "CompanyHouseAppl", oneData);
			createData.Conbg = (createData.Conbg) ? "\/Date("+ common.Common.getTime(createData.Conbg)+")\/" : undefined;
			createData.Coned = (createData.Coned) ? "\/Date("+ common.Common.getTime(createData.Coned)+")\/" : undefined;
			createData.Tperncongb = (createData.Tperncongb) ? "\/Date("+ common.Common.getTime(createData.Tperncongb)+")\/" : undefined;
			createData.Tpernconed = (createData.Tpernconed) ? "\/Date("+ common.Common.getTime(createData.Tpernconed)+")\/" : undefined;
			createData.Warfe = common.Common.removeComma(createData.Warfe);
			createData.Monfe = common.Common.removeComma(createData.Monfe);
			createData.Mosel = common.Common.removeComma(createData.Mosel);
			createData.Mopri = common.Common.removeComma(createData.Mopri);
			createData.Moasr = common.Common.removeComma(createData.Moasr);
			createData.Mbfee = common.Common.removeComma(createData.Mbfee);
			createData.Mlfee = common.Common.removeComma(createData.Mlfee);
			createData.Waers = createData.Waers || "KRW";
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			createData.Begbn = "B";
			
			oModel.create("/CompanyHouseApplSet", createData, {
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
		
		if(!oneData.Pernr) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		if(!oneData.Hstyp) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0349"), {title : oBundleText.getText("LABEL_0053")});	// 349:신청구분을 선택하여 주십시오.
			return false;
		}
		
		if(vPrcty == "C") {
			if(oneData.Hstyp == "25" && !oneData.Tpern) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0351"), {title : oBundleText.getText("LABEL_0053")});	// 351:인계자를 선택하여 주십시오.
				return false;
			}
			if(!oneData.Aprsn) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0350"), {title : oBundleText.getText("LABEL_0053")});	// 350:신청사유를 입력하여 주십시오.
				return false;
			}
			if(!oneData.Mvtyp) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0347"), {title : oBundleText.getText("LABEL_0053")});	// 347:부임형태를 선택하여 주십시오.
				return false;
			}
			if(!oneData.Hoshp) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0359"), {title : oBundleText.getText("LABEL_0053")});	// 359:주택형태를 선택하여 주십시오.
				return false;
			}
			if(!oneData.Fsize) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0356"), {title : oBundleText.getText("LABEL_0053")});	// 356:전용면적을 입력하여 주십시오.
				return false;
			}
//			if(!oneData.Pstlz || !oneData.Addr1 || !oneData.Addr2) {
//				sap.m.MessageBox.error(oBundleText.getText("LABEL_0358"), {title : oBundleText.getText("LABEL_0053")});	// 358:주소를 입력하여 주십시오.
//				return false;
//			}
			if(!oneData.Owner) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0348"), {title : oBundleText.getText("LABEL_0053")});	// 348:소유자를 입력하여 주십시오.
				return false;
			}
			if(!oneData.Lotyp) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0355"), {title : oBundleText.getText("LABEL_0053")});	// 355:임차형태를 선택하여 주십시오.
				return false;
			}
			if(!oneData.Warfe || !oneData.Monfe) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0354"), {title : oBundleText.getText("LABEL_0053")});	// 354:임차조건을 입력하여 주십시오.
				return false;
			}
			if(Number(oneData.Warfe.split(",").join("")) > 0) {
				if(!oneData.Moseq) {
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2924"), {title : oBundleText.getText("LABEL_0053")});	// 2924:담보순위를 선택하여 주십시오.
					return false;
				}
				if(!oneData.Mosel || Number(oneData.Mosel.split(",").join("")) < 1) {
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2922"), {title : oBundleText.getText("LABEL_0053")});	// 2922:매매가를 입력하여 주십시오.
					return false;
				}
//				if(!oneData.Mopri || Number(oneData.Mopri.split(",").join("")) < 1) {
//					sap.m.MessageBox.error(oBundleText.getText("LABEL_2923"), {title : oBundleText.getText("LABEL_0053")});	// 2923:선순위 담보설정금액을 입력하여 주십시오.
//					return false;
//				}
			}
			if(!oneData.Warst) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0353"), {title : oBundleText.getText("LABEL_0053")});	// 353:임차시세현황을 입력하여 주십시오.
				return false;
			}
			if(!oneData.Conbg || !oneData.Coned) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0343"), {title : oBundleText.getText("LABEL_0053")});	// 343:계약기간을 입력하여 주십시오.
				return false;
			}
			if(!oneData.Motyp) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0345"), {title : oBundleText.getText("LABEL_0053")});	// 345:담보형태를 선택하여 주십시오.
				return false;
			}
//			if(!oneData.Mosel || !oneData.Mopri || !oneData.Moasr) {
//				sap.m.MessageBox.error(oBundleText.getText("LABEL_0344"), {title : oBundleText.getText("LABEL_0053")});	// 344:담보설정을 입력하여 주십시오.
//				return false;
//			}
//			if(!oneData.Mbfee || !oneData.Mlfee) {
//				sap.m.MessageBox.error(oBundleText.getText("LABEL_0346"), {title : oBundleText.getText("LABEL_0053")});	// 346:부대비용을 입력하여 주십시오.
//				return false;
//			}
			
			if(!oneData.Docyn) {
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV");
				
				oModel.remove("/CompanyHouseApplSet(Appno='" + oController._vAppno + "',Begbn='B')", {
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
	
	onSelectTpern : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController();
		
		oController._useCustomPernrSelection = "X";
		oController._vEnamefg = undefined;
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	onChangeTpern : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController(),
			oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			vEname = oEvent.getSource().getValue(),
			curDate = new Date(),
			searchList = [],
			searchData = null;
		
		if(!vEname || vEname.length < 1) return false;
		
		try {
			
			oCommonModel.read("/EmpSearchResultSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)),
					new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname),
					new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, "3"),
					new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth)
				],
				success : function(data, res) {
					if(data.results && data.results.length) {
						searchList = data.results;
						searchData = data.results[0];
					}
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					if(errData.Error && errData.Error == "E") {
						sap.m.MessageBox.alert(errData.ErrorMessage, {});
						return;
					}
				}
			});
			
		} catch(ex) {
			console.log(ex);
		}
		
		if(searchList.length == 1) {
			
			// 인계자 종전사택정보 조회
			var vTbeforeData = oController.retrieveDetailBefore(oController, searchData.Encid);
			
			if(!Object.keys(vTbeforeData).length) {
				oController._DetailJSonModel.setProperty("/Data/Tpern", undefined);
				oController._DetailJSonModel.setProperty("/Data/Tpernnm", undefined);
				oController._DetailJSonModel.setProperty("/Data/Nhsyn", undefined);
				oController._DetailJSonModel.setProperty("/Data/Hslyn", undefined);
				oController._DetailJSonModel.setProperty("/Data/Aprsn", "");
				oController._DetailJSonModel.setProperty("/Data/Mvtyp", undefined);
				oController._DetailJSonModel.setProperty("/Data/Hoshp", undefined);
				oController._DetailJSonModel.setProperty("/Data/Fsize", undefined);
				oController._DetailJSonModel.setProperty("/Data/FsizeP", undefined);
				oController._DetailJSonModel.setProperty("/Data/Psize", undefined);
				oController._DetailJSonModel.setProperty("/Data/PsizeP", undefined);
				oController._DetailJSonModel.setProperty("/Data/Pstlz", undefined);
				oController._DetailJSonModel.setProperty("/Data/Addr1", undefined);
				oController._DetailJSonModel.setProperty("/Data/Addr2", undefined);
				oController._DetailJSonModel.setProperty("/Data/Owner", undefined);
				oController._DetailJSonModel.setProperty("/Data/Lotyp", undefined);
				oController._DetailJSonModel.setProperty("/Data/Warfe", undefined);
				oController._DetailJSonModel.setProperty("/Data/Monfe", undefined);
				oController._DetailJSonModel.setProperty("/Data/Warst", undefined);
				oController._DetailJSonModel.setProperty("/Data/Conbg", undefined);
				oController._DetailJSonModel.setProperty("/Data/Coned", undefined);
				oController._DetailJSonModel.setProperty("/Data/Tperncongb", undefined);
				oController._DetailJSonModel.setProperty("/Data/Tpernconed", undefined);
				oController._DetailJSonModel.setProperty("/Data/Motyp", undefined);
				oController._DetailJSonModel.setProperty("/Data/Moseq", undefined);
				oController._DetailJSonModel.setProperty("/Data/Mosel", undefined);
				oController._DetailJSonModel.setProperty("/Data/Mopri", undefined);
				oController._DetailJSonModel.setProperty("/Data/Moasr", undefined);
				oController._DetailJSonModel.setProperty("/Data/Morat", undefined);
				oController._DetailJSonModel.setProperty("/Data/Mbfee", undefined);
				oController._DetailJSonModel.setProperty("/Data/Mlfee", undefined);
				oController._DetailJSonModel.setProperty("/Data/Zbigo", "");
				
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0352"), {});	// 352:인계자의 종전 사택정보가 없습니다.
				
				return;
			} else {
				oController._DetailJSonModel.setProperty("/Data/Tpern", searchData.Pernr);
				oController._DetailJSonModel.setProperty("/Data/Tpernnm", searchData.Ename);
				oController._DetailJSonModel.setProperty("/Data/Nhsyn", vTbeforeData.Nhsyn);
				oController._DetailJSonModel.setProperty("/Data/Hslyn", vTbeforeData.Hslyn);
				oController._DetailJSonModel.setProperty("/Data/Aprsn", "");
				oController._DetailJSonModel.setProperty("/Data/Mvtyp", vTbeforeData.Mvtyp);
				oController._DetailJSonModel.setProperty("/Data/Hoshp", vTbeforeData.Hoshp);
				oController._DetailJSonModel.setProperty("/Data/Fsize", vTbeforeData.Fsize);
				oController._DetailJSonModel.setProperty("/Data/FsizeP", vTbeforeData.FsizeP);
				oController._DetailJSonModel.setProperty("/Data/Psize", vTbeforeData.Psize);
				oController._DetailJSonModel.setProperty("/Data/PsizeP", vTbeforeData.PsizeP);
				oController._DetailJSonModel.setProperty("/Data/Pstlz", vTbeforeData.Pstlz);
				oController._DetailJSonModel.setProperty("/Data/Addr1", vTbeforeData.Addr1);
				oController._DetailJSonModel.setProperty("/Data/Addr2", vTbeforeData.Addr2);
				oController._DetailJSonModel.setProperty("/Data/Owner", vTbeforeData.Owner);
				oController._DetailJSonModel.setProperty("/Data/Lotyp", vTbeforeData.Lotyp);
				oController._DetailJSonModel.setProperty("/Data/Warfe", vTbeforeData.Warfe);
				oController._DetailJSonModel.setProperty("/Data/Monfe", vTbeforeData.Monfe);
				oController._DetailJSonModel.setProperty("/Data/Warst", vTbeforeData.Warst);
				oController._DetailJSonModel.setProperty("/Data/Conbg", undefined);
				oController._DetailJSonModel.setProperty("/Data/Coned", vTbeforeData.Coned);
				oController._DetailJSonModel.setProperty("/Data/Tperncongb", vTbeforeData.Conbg);
				oController._DetailJSonModel.setProperty("/Data/Tpernconed", vTbeforeData.Coned);
				oController._DetailJSonModel.setProperty("/Data/Motyp", vTbeforeData.Motyp);
				oController._DetailJSonModel.setProperty("/Data/Moseq", vTbeforeData.Moseq);
				oController._DetailJSonModel.setProperty("/Data/Mosel", vTbeforeData.Mosel);
				oController._DetailJSonModel.setProperty("/Data/Mopri", vTbeforeData.Mopri);
				oController._DetailJSonModel.setProperty("/Data/Moasr", vTbeforeData.Moasr);
				oController._DetailJSonModel.setProperty("/Data/Morat", vTbeforeData.Morat);
				oController._DetailJSonModel.setProperty("/Data/Mbfee", vTbeforeData.Mbfee);
				oController._DetailJSonModel.setProperty("/Data/Mlfee", vTbeforeData.Mlfee);
				oController._DetailJSonModel.setProperty("/Data/Zbigo", "");
			}
			
		} else {
			oController._oControl = oEvent.getSource();
			oController._useCustomPernrSelection = "X";
			oController._vEnamefg = "X";
			
			common.TargetUser.displayEmpSearchDialog();
		}
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._useCustomPernrSelection = '';
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices(),
			vTbeforeData = {};
		
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
				svEncid = mEmpSearchResult.getProperty(_selPath + "/Encid"),
				svEname = mEmpSearchResult.getProperty(_selPath + "/Ename");
			
			// 인계자 종전사택정보 조회
			vTbeforeData = oController.retrieveDetailBefore(oController, svEncid);
			
			if(!Object.keys(vTbeforeData).length) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0352"), {});	// 352:인계자의 종전 사택정보가 없습니다.
				
				return;
			} else {
				oController._DetailJSonModel.setProperty("/Data/Tpern", svPernr);
				oController._DetailJSonModel.setProperty("/Data/Tpernnm", svEname);
				oController._DetailJSonModel.setProperty("/Data/Nhsyn", vTbeforeData.Nhsyn);
				oController._DetailJSonModel.setProperty("/Data/Hslyn", vTbeforeData.Hslyn);
				oController._DetailJSonModel.setProperty("/Data/Aprsn", "");
				oController._DetailJSonModel.setProperty("/Data/Mvtyp", vTbeforeData.Mvtyp);
				oController._DetailJSonModel.setProperty("/Data/Hoshp", vTbeforeData.Hoshp);
				oController._DetailJSonModel.setProperty("/Data/Fsize", vTbeforeData.Fsize);
				oController._DetailJSonModel.setProperty("/Data/FsizeP", vTbeforeData.FsizeP);
				oController._DetailJSonModel.setProperty("/Data/Psize", vTbeforeData.Psize);
				oController._DetailJSonModel.setProperty("/Data/PsizeP", vTbeforeData.PsizeP);
				oController._DetailJSonModel.setProperty("/Data/Pstlz", vTbeforeData.Pstlz);
				oController._DetailJSonModel.setProperty("/Data/Addr1", vTbeforeData.Addr1);
				oController._DetailJSonModel.setProperty("/Data/Addr2", vTbeforeData.Addr2);
				oController._DetailJSonModel.setProperty("/Data/Owner", vTbeforeData.Owner);
				oController._DetailJSonModel.setProperty("/Data/Lotyp", vTbeforeData.Lotyp);
				oController._DetailJSonModel.setProperty("/Data/Warfe", vTbeforeData.Warfe);
				oController._DetailJSonModel.setProperty("/Data/Monfe", vTbeforeData.Monfe);
				oController._DetailJSonModel.setProperty("/Data/Warst", vTbeforeData.Warst);
				oController._DetailJSonModel.setProperty("/Data/Conbg", undefined);
				oController._DetailJSonModel.setProperty("/Data/Coned", vTbeforeData.Coned);
				oController._DetailJSonModel.setProperty("/Data/Tperncongb", vTbeforeData.Conbg);
				oController._DetailJSonModel.setProperty("/Data/Tpernconed", vTbeforeData.Coned);
				oController._DetailJSonModel.setProperty("/Data/Motyp", vTbeforeData.Motyp);
				oController._DetailJSonModel.setProperty("/Data/Moseq", vTbeforeData.Moseq);
				oController._DetailJSonModel.setProperty("/Data/Mosel", vTbeforeData.Mosel);
				oController._DetailJSonModel.setProperty("/Data/Mopri", vTbeforeData.Mopri);
				oController._DetailJSonModel.setProperty("/Data/Moasr", vTbeforeData.Moasr);
				oController._DetailJSonModel.setProperty("/Data/Morat", vTbeforeData.Morat);
				oController._DetailJSonModel.setProperty("/Data/Mbfee", vTbeforeData.Mbfee);
				oController._DetailJSonModel.setProperty("/Data/Mlfee", vTbeforeData.Mlfee);
				oController._DetailJSonModel.setProperty("/Data/Zbigo", "");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController();
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	onDisplaySearchZipcodeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController();
		
		common.ZipSearch.oController = oController;
		
		if(oController._vSelectedPernr == "") return;
		
		if(!oController._ZipSearchDialog) {
			oController._ZipSearchDialog = sap.ui.jsfragment("fragment.ZipSearchDialog", oController);
			oView.addDependent(oController._ZipSearchDialog);
		}
		
		oController._ZipMode = "1"; // 현 거주지
		oController._ZipSearchDialog.open();
	},
	
	onSelectAddress : function(zipNo, roadAddr, siNm, engAddr) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
			oController = oView.getController();	
		
		oController._DetailJSonModel.setProperty("/Data/Pstlz", zipNo);
		oController._DetailJSonModel.setProperty("/Data/Addr1", roadAddr);
	}
});

function jusoCallBack(Zip, Addr1, Addr2, EnAddr) {
	var oView = sap.ui.getCore().byId("ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail"),
		oController = oView.getController();

	oController._DetailJSonModel.setProperty("/Data/Pstlz", Zip);
	oController._DetailJSonModel.setProperty("/Data/Addr1", Addr1);
	oController._DetailJSonModel.setProperty("/Data/Addr2", Addr2);
};