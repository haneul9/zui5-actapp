jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail
	 */

	PAGEID : "ZUI5_HR_EndCompanyHousingSupportDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_HistoryJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "HR40",
	_ObjList : [],
	_vOrgeh : "",
	_vOrgtx : "",
	_useCustomPernrSelection : "",
	_selectionRowIdx : null,
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
			vFromPageId = "",
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []};
		
		oController.BusyDialog.open();
		
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
		oDetailData.Data.Hstyp = oDetailData.Data.Hstyp || "30";
		oController._DetailJSonModel.setData(oDetailData);
		
		// 종전사택정보
		if(!oController._vAppno) oController.retrieveDetailBefore(oController);
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportList",
			      data : { }
				}
			);	
		}
		
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail");
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
				new sap.ui.model.Filter('Begbn', sap.ui.model.FilterOperator.EQ, "E")
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.IsHistory = true;
				oDetailData.Data.Nhsyn = oDetailData.Data.Nhsyn || false;
				oDetailData.Data.Hslyn = oDetailData.Data.Hslyn || false;
				oDetailData.Data.Conbg = (oDetailData.Data.Conbg) ? dateFormat.format(oDetailData.Data.Conbg) : undefined;
				oDetailData.Data.Coned = (oDetailData.Data.Coned) ? dateFormat.format(oDetailData.Data.Coned) : undefined;
				oDetailData.Data.Wardt = (oDetailData.Data.Wardt) ? dateFormat.format(oDetailData.Data.Wardt) : undefined;
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
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
			errData = {};
		
		oModel.read("/CompanyHouseApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I'),
				new sap.ui.model.Filter('Begbn', sap.ui.model.FilterOperator.EQ, "E")
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0361") + "/" + oBundleText.getText("LABEL_1132"));	// 361:사택지원 종료 신청, 1132:승인서
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0361") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 361:사택지원 종료 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0361") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 361:사택지원 종료 신청
		}
	},
	
	// 신청내역조회
	onPressSelectByHistory : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail"),
			oController = oView.getController(),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Encid"),
			oTable,
			oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
			vData = {Data : []};
		
		if(!vPernr) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._HistoryDialog) {
			oController._HistoryDialog = sap.ui.jsfragment("ZUI5_HR_EndCompanyHousingSupport.fragment.History", oController);
			oView.addDependent(oController._HistoryDialog);
		}
		
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		
		oModel.read("/CompanyHouseHistorySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						data.results[i].Nhsyn = (data.results[i].Nhsyn) ? "Y" : "N";
						data.results[i].Hslyn = (data.results[i].Hslyn) ? "Y" : "N";
						
						vData.Data.push(data.results[i]);
					}
				}					
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController._HistoryJSonModel.setData(vData);
		oTable.setVisibleRowCount(vData.Data.length);
		
		oController._HistoryDialog.open();
	},
	
	onSelectHistory : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
			vIDXs = oTable.getSelectedIndices(),
			svData = {},
			detailData = oController._DetailJSonModel.getProperty("/Data");
		
		if(vIDXs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0369"));	// 369:신청내역을 선택하여 주세요.
			return;
		} else if(vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0370"));	// 370:한건만 선택하여 주세요.
			return;
		}
		
		// 기존내역 초기화
		oController.onResetDetail(oController);
		
		svData = oController._HistoryJSonModel.getData().Data[vIDXs[0]];
		
		detailData.IsHistory = true;
		detailData.Nhsyn = (svData.Nhsyn == "Y") ? true : false;
		detailData.Hslyn = (svData.Hslyn == "Y") ? true : false;
		detailData.Mvtyp = svData.Mvtyp;
		detailData.Hoshp = svData.Hoshp;
		detailData.Fsize = svData.Fsize;
		detailData.FsizeP = svData.FsizeP;
		detailData.Psize = svData.Psize;
		detailData.PsizeP = svData.PsizeP;
		detailData.Pstlz = svData.Pstlz;
		detailData.Addr1 = svData.Addr1;
		detailData.Addr2 = svData.Addr2;
		detailData.Owner = svData.Owner;
		detailData.Lotyp = svData.Lotyp;
		detailData.Conbg = dateFormat.format(svData.Conbg);
		detailData.Coned = dateFormat.format(svData.Coned);
		detailData.Motyp = svData.Motyp;
		detailData.Moseq = svData.Moseq;
		detailData.Warfe = common.Common.numberWithCommas(svData.Warfe);
		detailData.Monfe = common.Common.numberWithCommas(svData.Monfe);
		detailData.Mosel = common.Common.numberWithCommas(svData.Mosel);
		detailData.Mopri = common.Common.numberWithCommas(svData.Mopri);
		detailData.Moasr = common.Common.numberWithCommas(svData.Moasr);
		detailData.Morat = svData.Morat;
		detailData.Mbfee = 0;
		detailData.Mlfee = 0;
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
		
		oTable.clearSelection();
		
		oController._HistoryDialog.close();
	},
	
	// 종전사택정보
	retrieveDetailBefore : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Encid"),
			beforeData = {},
			errData = {},
			aFilters = [];
		
		if(!vPernr) return false;
		
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr));
		
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
					
					oController._DetailJSonModel.setProperty("/Data/Nhsyn", beforeData.Nhsyn);
					oController._DetailJSonModel.setProperty("/Data/Hslyn", beforeData.Hslyn);
					oController._DetailJSonModel.setProperty("/Data/Aprsn", "");
					oController._DetailJSonModel.setProperty("/Data/Mvtyp", beforeData.Mvtyp);
					oController._DetailJSonModel.setProperty("/Data/Hoshp", beforeData.Hoshp);
					oController._DetailJSonModel.setProperty("/Data/Fsize", beforeData.Fsize);
					oController._DetailJSonModel.setProperty("/Data/FsizeP", beforeData.FsizeP);
					oController._DetailJSonModel.setProperty("/Data/Psize", beforeData.Psize);
					oController._DetailJSonModel.setProperty("/Data/PsizeP", beforeData.PsizeP);
					oController._DetailJSonModel.setProperty("/Data/Pstlz", beforeData.Pstlz);
					oController._DetailJSonModel.setProperty("/Data/Addr1", beforeData.Addr1);
					oController._DetailJSonModel.setProperty("/Data/Addr2", beforeData.Addr2);
					oController._DetailJSonModel.setProperty("/Data/Owner", beforeData.Owner);
					oController._DetailJSonModel.setProperty("/Data/Lotyp", beforeData.Lotyp);
					oController._DetailJSonModel.setProperty("/Data/Warfe", beforeData.Warfe);
					oController._DetailJSonModel.setProperty("/Data/Monfe", beforeData.Monfe);
					oController._DetailJSonModel.setProperty("/Data/Warst", beforeData.Warst);
					oController._DetailJSonModel.setProperty("/Data/Conbg", undefined);
					oController._DetailJSonModel.setProperty("/Data/Coned", undefined);
					oController._DetailJSonModel.setProperty("/Data/Motyp", beforeData.Motyp);
					oController._DetailJSonModel.setProperty("/Data/Moseq", beforeData.Moseq);
					oController._DetailJSonModel.setProperty("/Data/Mosel", beforeData.Mosel);
					oController._DetailJSonModel.setProperty("/Data/Mopri", beforeData.Mopri);
					oController._DetailJSonModel.setProperty("/Data/Moasr", beforeData.Moasr);
					oController._DetailJSonModel.setProperty("/Data/Morat", beforeData.Morat);
					oController._DetailJSonModel.setProperty("/Data/Mbfee", "0");
					oController._DetailJSonModel.setProperty("/Data/Mlfee", "0");
					oController._DetailJSonModel.setProperty("/Data/Zbigo", "");
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
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		detailData.IsHistory = false;
		delete detailData.Nhsyn;		// 통근지역내 무주택
		delete detailData.Hslyn;		// 주택자금대출 여부
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
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 종전사택정보
		oController.retrieveDetailBefore(oController);
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail");
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
			
			// 사택지원 종료 신청 저장
			var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "CompanyHouseAppl", oneData);
			createData.Conbg = (createData.Conbg) ? "\/Date("+ common.Common.getTime(createData.Conbg)+")\/" : undefined;
			createData.Coned = (createData.Coned) ? "\/Date("+ common.Common.getTime(createData.Coned)+")\/" : undefined;
			createData.Wardt = (createData.Wardt) ? "\/Date("+ common.Common.getTime(createData.Wardt)+")\/" : undefined;
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
			createData.Begbn = "E";
			
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
	
	onValidationData : function(oController, vPrcty) {		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!oneData.Pernr) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		if(!oneData.IsHistory) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0369"), {title : oBundleText.getText("LABEL_0053")});	// 369:신청내역을 선택하여 주세요.
			return false;
		}
		
		if(vPrcty == "C"){
			if(!oneData.Aprsn) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0350"), {title : oBundleText.getText("LABEL_0053")});	// 350:신청사유를 입력하여 주십시오.
				return false;
			}
			if(!oneData.Owner) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0348"), {title : oBundleText.getText("LABEL_0053")});	// 348:소유자를 입력하여 주십시오.
				return false;
			}
			if(!oneData.Conbg || !oneData.Coned) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0343"), {title : oBundleText.getText("LABEL_0053")});	// 343:계약기간을 입력하여 주십시오.
				return false;
			}
			
			// 보증금이 존재 할 때 증빙자료, 보증금입금일 체크
			if(Number(oneData.Warfe.replace(/[^\d]/g, '')) > 0) {
				if(!oneData.Wardt) {
					sap.m.MessageBox.error(oBundleText.getText("LABEL_0368"), {title : oBundleText.getText("LABEL_0053")});	// 368:보증금입금일을 입력하여 주십시오.
					return false;
				}
				
				if(!oneData.Docyn) {
					sap.m.MessageBox.error(oBundleText.getText("LABEL_0284"), {title : oBundleText.getText("LABEL_0053")});	// 284:증빙자료를 첨부하세요.
					return "";
				}
			}
			
			// 결재자 지정여부 확인
			var oData = oController._ApprovalLineModel.getProperty("/Data");
			var vApprovalCheck = "";
			if(oData && oData.length > 0) {
				for(var i=0; i <oData.length ; i++ ) {
					if(oData[i].Aprtype == "A03001") {
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_HEAD_SRV");
				
				oModel.remove("/CompanyHouseApplSet(Appno='" + oController._vAppno + "',Begbn='E')", {
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
	}
});