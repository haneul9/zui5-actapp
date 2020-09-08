jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail
	 */

	PAGEID : "ZUI5_HR_HousingFundRepaymentDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_LonidListJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR26',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",
	_viewGubun : "",

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
			oDetailTableData = {Data : []},
			viewGubun;
		
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
		oDetailData.Data.Lnrte = oDetailData.Data.Lnrte || '0.00';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		oController.buildCombo(oController);
		
		// 일시상환(A),일부상환(P) 구분
		if(!oController._viewGubun || oController._viewGubun == "") {
			var vLmtyp = oController._DetailJSonModel.getProperty("/Data/Lmtyp");
			
			if(vLmtyp == "B" || vLmtyp == "C") {
				oController._viewGubun = "A";
			} else if(vLmtyp == "D") {
				oController._viewGubun = "P";
			}
		}
		oController._DetailJSonModel.setProperty("/Data/viewGubun", oController._viewGubun);
		
		/*if(!oController._vAppno && oController._viewGubun == "P") {
			oController._DetailJSonModel.setProperty("/Data/Lmtyp", "D");
			oController._DetailJSonModel.setProperty("/Data/Lmtxt", "일부상환");
		}*/
		
		if(oController._viewGubun == "A" && (oDetailData.Data.ZappStatAl == "" || oDetailData.Data.ZappStatAl == "10")) {
			// 선택 가능한 상환일자
			oController.setLmdatRange(oController);
		}
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : oController._vFromPage || "ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentList",
		      data : {}
		});
	},
	
	/*getViewGubun : function(oController) {
		var vLmtyp,
			currDate,
			currMonth,
			currDay,
			strCheckDate,
			endCheckDate;
		
		if(oController._vAppno) {
			vLmtyp = oController._DetailJSonModel.getProperty("/Data/Lmtyp");
			
			if(vLmtyp == "B" || vLmtyp == "C") {
				return "A";
			} else if(vLmtyp == "D") {
				return "P";
			}
		} else {
			currDate = new Date();
			currMonth = currDate.getMonth()+1;
			currDay = currDate.getDate();
			strCheckDate = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
			endCheckDate = new Date(currDate.getFullYear(), currDate.getMonth(), 16);
			
			// 일시상환 가능일 - 매월 1일~15일 사이
			if(currDate >= strCheckDate && currDate < endCheckDate) {
				return "A";
			// 일부상환 가능일 - 4월,10월 20일~24일 사이
			} else if((currMonth == 4 || currMonth == 10) && (currDay > 19 && currDay < 25)) {
				return "P";
			}
		}
		
		return null;
	},*/

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
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail");
		var oController = oView.getController();
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			dateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			errData = {};
		
		oModel.read("/HousingLoanRepaySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.Paymm = dateFormat2.format(oDetailData.Data.Paymm);
				oDetailData.Data.Lmdat = dateFormat.format(oDetailData.Data.Lmdat);
				oDetailData.Data.LnamtCpn = common.Common.numberWithCommas(oDetailData.Data.LnamtCpn);
				oDetailData.Data.LnamtFun = common.Common.numberWithCommas(oDetailData.Data.LnamtFun);
				oDetailData.Data.LnamtBnk = common.Common.numberWithCommas(oDetailData.Data.LnamtBnk);
				oDetailData.Data.RpamtSum1 = common.Common.numberWithCommas(oDetailData.Data.RpamtSum1);
				oDetailData.Data.RpamtSum2 = common.Common.numberWithCommas(oDetailData.Data.RpamtSum2);
				oDetailData.Data.RpamtSum3 = common.Common.numberWithCommas(oDetailData.Data.RpamtSum3);
				oDetailData.Data.MrpprCpn = (oDetailData.Data.Lmtyp == "D") ? oDetailData.Data.MrpprCpn : common.Common.numberWithCommas(oDetailData.Data.MrpprCpn);
				oDetailData.Data.MrpprFun = (oDetailData.Data.Lmtyp == "D") ? oDetailData.Data.MrpprFun : common.Common.numberWithCommas(oDetailData.Data.MrpprFun);
				oDetailData.Data.MrpprBnk = (oDetailData.Data.Lmtyp == "D") ? oDetailData.Data.MrpprBnk : common.Common.numberWithCommas(oDetailData.Data.MrpprBnk);
				oDetailData.Data.MrpinCpn = common.Common.numberWithCommas(oDetailData.Data.MrpinCpn);
				oDetailData.Data.MrpinFun = common.Common.numberWithCommas(oDetailData.Data.MrpinFun);
				oDetailData.Data.MrpinBnk = common.Common.numberWithCommas(oDetailData.Data.MrpinBnk);
				oDetailData.Data.MramtTot1 = common.Common.numberWithCommas(oDetailData.Data.MramtTot1);
				oDetailData.Data.MramtTot2 = common.Common.numberWithCommas(oDetailData.Data.MramtTot2);
				oDetailData.Data.MramtTot3 = common.Common.numberWithCommas(oDetailData.Data.MramtTot3);
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0420") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 420:주택자금 중도상환 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0420") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 420:주택자금 중도상환 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0420") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 420:주택자금 중도상환 신청
		}
	},
	
	buildCombo : function(oController) {
		// 대출번호
		oController.onSetLonid(oController);
		
		// 중도상환 유형
		oController.onSetLmtyp(oController);
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
	
	onSetLonid : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oLonid = sap.ui.getCore().byId(oController.PAGEID + "_Lonid"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");

		if(!vEncid) return;
		
		if(oLonid.getItems()) oLonid.destroyItems();
		
		oModel.read("/LonidListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oLonid.addItem(new sap.ui.core.Item({
							key : elem.Lonid,
							text : elem.Lonid
						}));
					});
					
					oController._LonidListJSonModel.setProperty("/Data", data.results);
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
	},
	
	onSetLmtyp : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oLmtyp = sap.ui.getCore().byId(oController.PAGEID + "_Lmtyp"),
			vDatum = oController._DetailJSonModel.getProperty("/Data/ZreqDate"),
			aFilters = [];
	
		if(oLmtyp.getItems()) oLmtyp.destroyItems();
		
		if(vDatum) aFilters.push(new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum)));
		
		oModel.read("/LmtypCodeSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oLmtyp.addItem(new sap.ui.core.Item({
							key : elem.Lmtyp,
							text : elem.Lmtxt
						}));
						
						if(elem.Lmtyp == "D") {
							oController._viewGubun = "P";
						} else {
							oController._viewGubun = "A";
						}
					});
				}
			},
			error : function(Res) {
				console.log(Res);
			}
		});
	},
	
	onSetMrpprCpn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oMrpprCpn = sap.ui.getCore().byId(oController.PAGEID + "_MrpprCpn"),
			vLonid = oController._DetailJSonModel.getProperty("/Data/Lonid"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		
		if(!vEncid || !vLonid) return;
		
		if(oMrpprCpn.getItems()) oMrpprCpn.destroyItems();
		
		oModel.read("/MrpprCpnListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Lonid', sap.ui.model.FilterOperator.EQ, vLonid)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oMrpprCpn.addItem(new sap.ui.core.Item({
							key : elem.Betrg,
							text : common.Common.numberWithCommas(elem.Betrg)
						}));
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
	},
	
	onSetMrpprBnk : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oMrpprBnk = sap.ui.getCore().byId(oController.PAGEID + "_MrpprBnk"),
			vLonid = oController._DetailJSonModel.getProperty("/Data/Lonid"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		
		if(!vEncid || !vLonid) return;
		
		if(oMrpprBnk.getItems()) oMrpprBnk.destroyItems();
		
		oModel.read("/MrpprBnkListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Lonid', sap.ui.model.FilterOperator.EQ, vLonid)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oMrpprBnk.addItem(new sap.ui.core.Item({
							key : elem.Betrg,
							text : common.Common.numberWithCommas(elem.Betrg)
						}));
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
	},

	onSetMrpprFun : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			oMrpprFun = sap.ui.getCore().byId(oController.PAGEID + "_MrpprFun"),
			vLonid = oController._DetailJSonModel.getProperty("/Data/Lonid"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		
		if(!vEncid || !vLonid) return;
		
		if(oMrpprFun.getItems()) oMrpprFun.destroyItems();
		
		oModel.read("/MrpprFunListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Lonid', sap.ui.model.FilterOperator.EQ, vLonid)
				],
				success : function(data, res) {
					if(data && data.results.length) {
						data.results.forEach(function(elem) {
							oMrpprFun.addItem(new sap.ui.core.Item({
								key : elem.Betrg,
								text : common.Common.numberWithCommas(elem.Betrg)
							}));
						});
					}
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					
					if(errData.Error && errData.Error == 'E') {
						sap.m.MessageBox.alert(errData.ErrorMessage);
						return ;
					}
				}
		});
	},
	
	onChangeLonid : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			dateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			vLonid = oEvent.getSource().getSelectedKey();
		
		oController._LonidListJSonModel.getProperty("/Data").forEach(function(elem) {
			if(elem.Lonid == vLonid) {
				oController._DetailJSonModel.setProperty("/Data/Paymm", dateFormat2.format(elem.Paymm));
				oController._DetailJSonModel.setProperty("/Data/Louse", elem.Louse);
				oController._DetailJSonModel.setProperty("/Data/Louset", elem.Louset);
				oController._DetailJSonModel.setProperty("/Data/Lnrte", elem.Lnrte);
				oController._DetailJSonModel.setProperty("/Data/Lmdat", (elem.Lmdat) ? dateFormat.format(elem.Lmdat) : undefined);
			}
		});
		
		// 대출정보 조회
		oController.retrieveRepayInfo(oController, true);
	},
	
	onChangeLmtyp : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"}),
			oLmdat = sap.ui.getCore().byId(oController.PAGEID + "_Lmdat"),
			vLmtyp = oEvent.getSource().getSelectedKey(),
			fixedDate = null;
		
		if(vLmtyp == "D") {	// 일부상환 선택시 해당월 24일로 상환일자 고정
			oController._viewGubun = "P";
			
			fixedDate = new Date();
			fixedDate = new Date(fixedDate.getFullYear(), fixedDate.getMonth(), "24");
			
			oLmdat.setMinDate(null);
			oLmdat.setMaxDate(null);
			oLmdat.setValue(dateFormat.format(fixedDate));
		} else {
			oController._viewGubun = "A";
			
			if(oLmdat.getValue()) oLmdat.setValue(undefined);
			
			// 선택 가능한 상환일자
			oController.setLmdatRange(oController);
		}
		
		oController._DetailJSonModel.setProperty("/Data/viewGubun", oController._viewGubun);
		
		// 대출정보 조회
		oController.retrieveRepayInfo(oController, true);
	},

	onChangeLmdat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController();
		
		// 대출정보 조회
		oController.retrieveRepayInfo(oController, true);
	},

	onChangeMrpprCpn : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController();
		
		// 대출정보 조회
		oController.retrieveRepayInfo(oController, false);
	},
	
	onChangeMrpprBnk : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController();
		
		// 대출정보 조회
		oController.retrieveRepayInfo(oController, false);
	},
	
	onChangeMrpprFun : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController();
		
		// 대출정보 조회
		oController.retrieveRepayInfo(oController, false);
	},
	
	resetRepayInfo : function(oController, isReadPrincipalCombo) {
		oController._DetailJSonModel.setProperty("/Data/InamtAcp", undefined);
		oController._DetailJSonModel.setProperty("/Data/InmasAcp", undefined);
		oController._DetailJSonModel.setProperty("/Data/InaccAcp", undefined);
		oController._DetailJSonModel.setProperty("/Data/LnrteAcp", undefined);
		oController._DetailJSonModel.setProperty("/Data/LnamtCpn", undefined);
		oController._DetailJSonModel.setProperty("/Data/LnamtFun", undefined);
		oController._DetailJSonModel.setProperty("/Data/LnamtBnk", undefined);
		oController._DetailJSonModel.setProperty("/Data/RpamtSum1", undefined);
		oController._DetailJSonModel.setProperty("/Data/RpamtSum2", undefined);
		oController._DetailJSonModel.setProperty("/Data/RpamtSum3", undefined);
		oController._DetailJSonModel.setProperty("/Data/MrpinCpn", undefined);
		oController._DetailJSonModel.setProperty("/Data/MrpinFun", undefined);
		oController._DetailJSonModel.setProperty("/Data/MrpinBnk", undefined);
		oController._DetailJSonModel.setProperty("/Data/MramtTot1", undefined);
		oController._DetailJSonModel.setProperty("/Data/MramtTot2", undefined);
		oController._DetailJSonModel.setProperty("/Data/MramtTot3", undefined);
		oController._DetailJSonModel.setProperty("/Data/Entinfo1", undefined);
		oController._DetailJSonModel.setProperty("/Data/Entinfo2", undefined);
		oController._DetailJSonModel.setProperty("/Data/Entinfo3", undefined);

		if(isReadPrincipalCombo) {
			oController._DetailJSonModel.setProperty("/Data/MrpprCpn", undefined);
			oController._DetailJSonModel.setProperty("/Data/MrpprFun", undefined);
			oController._DetailJSonModel.setProperty("/Data/MrpprBnk", undefined);
		}
	},
	
	retrieveRepayInfo : function(oController, isReadPrincipalCombo) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vLonid = oController._DetailJSonModel.getProperty("/Data/Lonid"),
			vLmtyp = oController._DetailJSonModel.getProperty("/Data/Lmtyp"),
			vLmdat = oController._DetailJSonModel.getProperty("/Data/Lmdat"),
			vMrpprCpn = oController._DetailJSonModel.getProperty("/Data/MrpprCpn"),
			vMrpprFun = oController._DetailJSonModel.getProperty("/Data/MrpprFun"),
			aFilters = [];
		
		if(!vLonid || !vLmtyp || !vLmdat) return;
		
		oController.resetRepayInfo(oController, isReadPrincipalCombo);
		
		aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "I"));
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid));
		aFilters.push(new sap.ui.model.Filter('Lonid', sap.ui.model.FilterOperator.EQ, vLonid));
		aFilters.push(new sap.ui.model.Filter('Lmtyp', sap.ui.model.FilterOperator.EQ, vLmtyp));
		aFilters.push(new sap.ui.model.Filter('Lmdat', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vLmdat)));
		aFilters.push(new sap.ui.model.Filter('Waers', sap.ui.model.FilterOperator.EQ, "KRW"));
		
		if(!isReadPrincipalCombo) {
			if(vMrpprCpn) aFilters.push(new sap.ui.model.Filter('MrpprCpn', sap.ui.model.FilterOperator.EQ, vMrpprCpn));
			if(vMrpprFun) aFilters.push(new sap.ui.model.Filter('MrpprFun', sap.ui.model.FilterOperator.EQ, vMrpprFun));
		}
		
		oModel.read("/HousingLoanRepaySet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data && data.results.length) {
					var vData = data.results[0];
					
					vData.Entinfo1 = (vData.Entinfo1) ? vData.Entinfo1.replace(/<BR>/g, '\n') : undefined;
					vData.Entinfo2 = (vData.Entinfo2) ? vData.Entinfo2.replace(/<BR>/g, '\n') : undefined;
					vData.Entinfo3 = (vData.Entinfo3) ? vData.Entinfo3.replace(/<BR>/g, '\n') : undefined;
					
					oController._DetailJSonModel.setProperty("/Data/InamtAcp", vData.InamtAcp);
					oController._DetailJSonModel.setProperty("/Data/InmasAcp", vData.InmasAcp);
					oController._DetailJSonModel.setProperty("/Data/InaccAcp", vData.InaccAcp);
					oController._DetailJSonModel.setProperty("/Data/LnrteAcp", vData.LnrteAcp);
					oController._DetailJSonModel.setProperty("/Data/LnamtCpn", common.Common.numberWithCommas(vData.LnamtCpn));
					oController._DetailJSonModel.setProperty("/Data/LnamtFun", common.Common.numberWithCommas(vData.LnamtFun));
					oController._DetailJSonModel.setProperty("/Data/LnamtBnk", common.Common.numberWithCommas(vData.LnamtBnk));
					oController._DetailJSonModel.setProperty("/Data/RpamtSum1", common.Common.numberWithCommas(vData.RpamtSum1));
					oController._DetailJSonModel.setProperty("/Data/RpamtSum2", common.Common.numberWithCommas(vData.RpamtSum2));
					oController._DetailJSonModel.setProperty("/Data/RpamtSum3", common.Common.numberWithCommas(vData.RpamtSum3));
					oController._DetailJSonModel.setProperty("/Data/MrpinCpn", common.Common.numberWithCommas(vData.MrpinCpn));
					oController._DetailJSonModel.setProperty("/Data/MrpinFun", common.Common.numberWithCommas(vData.MrpinFun));
					oController._DetailJSonModel.setProperty("/Data/MrpinBnk", common.Common.numberWithCommas(vData.MrpinBnk));
					oController._DetailJSonModel.setProperty("/Data/MramtTot1", common.Common.numberWithCommas(vData.MramtTot1));
					oController._DetailJSonModel.setProperty("/Data/MramtTot2", common.Common.numberWithCommas(vData.MramtTot2));
					oController._DetailJSonModel.setProperty("/Data/MramtTot3", common.Common.numberWithCommas(vData.MramtTot3));
					oController._DetailJSonModel.setProperty("/Data/Entinfo1", vData.Entinfo1);
					oController._DetailJSonModel.setProperty("/Data/Entinfo2", vData.Entinfo2);
					oController._DetailJSonModel.setProperty("/Data/Entinfo3", vData.Entinfo3);
					oController._DetailJSonModel.setProperty("/Data/Inbeg", dateFormat.format(vData.Inbeg));
					oController._DetailJSonModel.setProperty("/Data/Inend", dateFormat.format(vData.Inend));

					if(isReadPrincipalCombo) {
						oController._DetailJSonModel.setProperty("/Data/MrpprCpn", (vLmtyp == "D") ? vData.MrpprCpn : common.Common.numberWithCommas(vData.MrpprCpn));
						oController._DetailJSonModel.setProperty("/Data/MrpprFun", (vLmtyp == "D") ? vData.MrpprFun : common.Common.numberWithCommas(vData.MrpprFun));
						oController._DetailJSonModel.setProperty("/Data/MrpprBnk", (vLmtyp == "D") ? vData.MrpprBnk : common.Common.numberWithCommas(vData.MrpprBnk));
					}
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
		
		if(isReadPrincipalCombo && vLmtyp == "D") {
			// 회사-원금 combo
			oController.onSetMrpprCpn(oController);

			// 기금-원금 combo
			oController.onSetMrpprFun(oController);

			// 회사-은행 combo
			oController.onSetMrpprBnk(oController);
		}
	},

	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
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
			
			oModel.create("/HousingLoanRepaySet", vOData, {
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
		if(!vData.Lonid) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0424"));	// 424:대출번호가 선택되지 않았습니다.
			return "";
		}
		if(!vData.Lmtyp) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0428"));	// 428:중도상환 유형이 선택되지 않았습니다.
			return "";
		}
		if(!vData.Lmdat) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0426"));	// 426:상환일자가 선택되지 않았습니다.
			return "";
		}
		if(!vData.MrpprCpn) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0429"));	// 429:회사-원금이 입력되지 않았습니다.
			return "";
		}
		if(!vData.MrpprFun) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0425"));	// 425:사내근로복지기금-원금이 입력되지 않았습니다.
			return "";
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "HousingLoanRepay", vData);
			
			rData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
			rData.Paymm = "\/Date("+ common.Common.getTime(rData.Paymm)+")\/";
			rData.Lmdat = "\/Date("+ common.Common.getTime(rData.Lmdat)+")\/";
			rData.Inbeg = "\/Date("+ common.Common.getTime(rData.Inbeg)+")\/";
			rData.Inend = "\/Date("+ common.Common.getTime(rData.Inend)+")\/";
			rData.LnamtCpn = common.Common.removeComma(rData.LnamtCpn);
			rData.LnamtFun = common.Common.removeComma(rData.LnamtFun);
			rData.LnamtBnk = common.Common.removeComma(rData.LnamtBnk);
			rData.RpamtSum1 = common.Common.removeComma(rData.RpamtSum1);
			rData.RpamtSum2 = common.Common.removeComma(rData.RpamtSum2);
			rData.RpamtSum3 = common.Common.removeComma(rData.RpamtSum3);
			rData.MrpprCpn = common.Common.removeComma(rData.MrpprCpn);
			rData.MrpprFun = common.Common.removeComma(rData.MrpprFun);
			rData.MrpprBnk = common.Common.removeComma(rData.MrpprBnk);
			rData.MrpinCpn = common.Common.removeComma(rData.MrpinCpn);
			rData.MrpinFun = common.Common.removeComma(rData.MrpinFun);
			rData.MrpinBnk = common.Common.removeComma(rData.MrpinBnk);
			rData.MramtTot1 = common.Common.removeComma(rData.MramtTot1);
			rData.MramtTot2 = common.Common.removeComma(rData.MramtTot2);
			rData.MramtTot3 = common.Common.removeComma(rData.MramtTot3);
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
			
			oModel.remove("/HousingLoanRepaySet(Appno='" + vDetailData.Appno + "')", {
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
		
		detailData.Lnrte = '0.00';	// 이자율
		delete detailData.Lonid;	// 대출번호
		delete detailData.Paymm;	// 대출지급일
		delete detailData.Louset;	// 대출용도
		delete detailData.Lmdat;	// 상환일자
		delete detailData.LnamtCpn;	// 대출금액 - 회사
		delete detailData.LnamtFun;	// 대출금액 - 사내근로복지기금
		delete detailData.LnamtBnk;	// 대출금액 - 은행
		delete detailData.RpamtSum1;// 상환 누계액 - 회사
		delete detailData.RpamtSum2;// 상환 누계액 - 사내근로복지기금
		delete detailData.RpamtSum3;// 상환 누계액 - 은행
		delete detailData.MrpprCpn;	// 원금 - 회사
		delete detailData.MrpprFun;	// 원금 - 사내근로복지기금
		delete detailData.MrpprBnk;	// 원금 - 은행
		delete detailData.MrpinCpn;	// 이자 - 회사
		delete detailData.MrpinFun;	// 이자 - 사내근로복지기금
		delete detailData.MrpinBnk;	// 이자 - 은행
		delete detailData.MramtTot1;// 계 - 회사
		delete detailData.MramtTot2;// 계 - 사내근로복지기금
		delete detailData.MramtTot3;// 계 - 은행
		delete detailData.Entinfo1;	// 입금처 - 회사
		delete detailData.Entinfo2;	// 입금처 - 사내근로복지기금
		delete detailData.Entinfo3;	// 입금처 - 은행
		delete detailData.Inbeg;
		delete detailData.Inend;

		if(oController._viewGubun == "A") {
			delete detailData.Lmtyp;	// 중도상환 유형
			delete detailData.Lmtxt;	// 중도상환 유형 텍스트
		}
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 대출번호
		oController.onSetLonid(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});
