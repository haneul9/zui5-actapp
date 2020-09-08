jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail
	 */

	PAGEID : "ZUI5_HR_AnnualLeaveDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM03",
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var oDetailData = {Data : {}};
		var oDetailTableData = {Data : []};
		var vZappStatAl = "";
		var errData = {};
		var vConchk = false; // 집중휴가 존재여부 Flag 
		
		if(vAppno != "") { // 수정 및 조회
			oController.BusyDialog.open();
			
			oModel.read("/YearLeaveListSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'),
				],
				success : function(data, res) {
					oDetailData.Data = data.results[0];
					oDetailData.Data.Vcbeg = common.Common.checkNull(oDetailData.Data.Vcbeg) ? null : dateFormat.format(oDetailData.Data.Vcbeg);
					oDetailData.Data.Vcend = common.Common.checkNull(oDetailData.Data.Vcend) ? null : dateFormat.format(oDetailData.Data.Vcend);
					oDetailData.Data.Pernr = oDetailData.Data.Zpernr ;
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
			
			oModel.read("/YearLeaveDetailSet", { 
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "H")
				],
				success : function(data, res) {
					if(data && data.results.length) {
						var vIdx = 1, vIvCheck = false;
						data.results.forEach(function(element) {
							element.Idx = vIdx++;
							element.ZappStatAl = vZappStatAl;
							element.Datum = dateFormat.format(element.Datum);
							element.Useday = element.Useday.substring(0,3);
							element.CredayYea = oDetailData.Data.CredayYea; // 연차 발생일 
							// 집중휴가 존재여부 확인
							if(element.Conchk == true){
								vConchk = true;
							}
							
							oDetailTableData.Data.push(element);
						});
						
						oController._DetailTableJSonModel.setData(oDetailTableData);
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			// 집중휴가 여부 업데이트 
			oController._DetailJSonModel.setProperty("/Data/IvCheck", vConchk);
			
			var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			if(oDetailTable){
				oDetailTable.setVisibleRowCount(oDetailTableData.Data.length > 15 ? 15 : oDetailTableData.Data.length);
			}
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});
				return ;
			}

			oController.onSetAptyp(oController, oDetailData.Data.Useyr);
			oController.onSearchOffDuty(oController, oController._DetailJSonModel.getProperty("/Data/Useyr"), oController._DetailJSonModel.getProperty("/Data/Zpernr") );
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
		
		// 신규 결재번호 채번
		if(vAppno == "") {
			var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			oDetailTable.setVisibleRowCount(1);
			
			oModel.read("/YearLeaveListSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I'),
					new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth)
				],
				success : function(data, res) {
					if(data.results && data.results.length){
						oController._vAppno = data.results[0].Appno ;
						oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
						oController._DetailJSonModel.setProperty("/Data/Useyr", data.results[0].Useyr);
						
						oController.onSetAptyp(oController, data.results[0].Useyr);
					}
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
				// 사용자 휴가일수 확인
				oController.onChangeUseyr();
			}
		}
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl) {
			oPortalTitle.setText(oBundleText.getText("LABEL_1051") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1051:연간휴가 신청
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText(oBundleText.getText("LABEL_1051") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1051:연간휴가 신청
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_1051") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1051:연간휴가 신청
		}

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveList",
			      data : { }
				}
			);	
		}
		
	},
	
	onSetAptyp : function(oController, vUseyr){
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		oController._Aptyp = [];
//		var oAptyp = sap.ui.getCore().byId(oController.PAGEID + "_Aptyp");
//		oAptyp.removeAllItems();
		if(vUseyr){
			oModel.read("/AptypCodeListSet", {
				async: false,
				filters : [
					new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
					new sap.ui.model.Filter('Useyr', sap.ui.model.FilterOperator.EQ, vUseyr),
				],
				success: function(data,res){
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							oController._Aptyp.push(data.results[i]);
						}
					}
				},
				error: function(res){console.log(res);}
			});	
		}
		
		var vTableData = oController._DetailTableJSonModel.getData();
		vTableData.Awart = oController._Aptyp;
		oController._DetailTableJSonModel.setData(vTableData);
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
	},
	
	onChangeUseyr : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		
		var vUseyr = oController._DetailJSonModel.getProperty("/Data/Useyr"),
		    vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
		    vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		
		var vCredayYea = "" , vCredayVac = "", vUsedayYea = "", vUsedayVac = "", 
		    vBaldayYea = "", vBaldayVac = "", vHolcnt1 = "", vHolcnt2 = "",
		    vCntdayYea = "", vCntdayVac = "";
		    
		
		if(vUseyr > 2000 ){
			// 휴가 일수 조회
			oModel.read("/YearLeaveListSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'N'),
					new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth),
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
					new sap.ui.model.Filter('Useyr', sap.ui.model.FilterOperator.EQ, vUseyr), 
				],
				success : function(data, res) {
					vCredayYea = data.results[0].CredayYea;
					vCredayVac = data.results[0].CredayVac;
					vCntdayYea = data.results[0].CntdayYea;
					vCntdayVac = data.results[0].CntdayVac;
					vUsedayYea = data.results[0].UsedayYea;
					vUsedayVac = data.results[0].UsedayVac;
					vBaldayYea = data.results[0].BaldayYea;
					vBaldayVac = data.results[0].BaldayVac;
					vHolcnt1  = data.results[0].Holcnt1;
					vHolcnt2  = data.results[0].Holcnt2;
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
					var errorTitle = oBundleText.getText("LABEL_0053");
					
					// Error Text 중 [안내] 라고 되어 있을 경우 title 을 경고 -> 안내 로 수정
					if(errData.ErrorMessage.indexOf("[안내]") > -1){
						errData.ErrorMessage.replace("[안내]","");
						errorTitle = oBundleText.getText("LABEL_0052");
					}
					
					sap.m.MessageBox.alert(errData.ErrorMessage, {
						title : errorTitle,
						onClose : function() {
							if(_gAuth=="E"){
								oController.onBack();
							}else{
								// 대상자 Clear
								oController.onReset(oController);
								oController.onResetDetail(oController);
							}
						}
					});
				}
			});

		}
		
		oController._DetailJSonModel.setProperty("/Data/CredayYea", vCredayYea);
		oController._DetailJSonModel.setProperty("/Data/CredayVac", vCredayVac);
		oController._DetailJSonModel.setProperty("/Data/UsedayYea", vUsedayYea);
		oController._DetailJSonModel.setProperty("/Data/UsedayVac", vUsedayVac);
		oController._DetailJSonModel.setProperty("/Data/BaldayYea", vBaldayYea);
		oController._DetailJSonModel.setProperty("/Data/BaldayVac", vBaldayVac);
		oController._DetailJSonModel.setProperty("/Data/CntdayYea", vCntdayYea);
		oController._DetailJSonModel.setProperty("/Data/CntdayVac", vCntdayVac);
		oController._DetailJSonModel.setProperty("/Data/Holcnt1", vHolcnt1);
		oController._DetailJSonModel.setProperty("/Data/Holcnt2", vHolcnt2);	
		
		oController.onSearchOffDuty(oController, vUseyr, vPernr);
		
		// 상세내역 조회
		if(!common.Common.checkNull(vUseyr) &&  vUseyr > 2000){
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"});
			oModel.read("/YearLeaveDetailSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Useyr', sap.ui.model.FilterOperator.EQ, vUseyr),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "K"),
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				],
				success : function(data, res) {
					var oDetailTableData = { Data : []};
					if(data && data.results.length) {
						var vIdx = 0;
						data.results.forEach(function(element) {
							element.Idx = ++vIdx;
							element.ZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
							element.Datum = dateFormat.format(element.Datum);
							element.Useday = element.Useday.substring(0,3);
							oDetailTableData.Data.push(element);
						});
						
						oController._DetailTableJSonModel.setProperty("/Data",oDetailTableData.Data);

						var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
						if(oDetailTable){
							oDetailTable.setVisibleRowCount(oDetailTableData.Data.length > 15 ? 15 : oDetailTableData.Data.length);
						}
					}else{
						oController._DetailTableJSonModel.setProperty("/Data",oDetailTableData.Data);

						var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
						if(oDetailTable){
							oDetailTable.setVisibleRowCount(oDetailTableData.Data.length > 15 ? 15 : oDetailTableData.Data.length);
						}
					}
				},
				error : function(Res) {
					oController._DetailTableJSonModel.setProperty("/Data", []);
					oDetailTable.setVisibleRowCount(1);
					
					errData = common.Common.parseError(Res);
					sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				}
			});
		}
	},
	
	// OffDuty 조회
	onSearchOffDuty : function(oController, vUseyr, vPernr){
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
		vZdate = "" ;
		if(!common.Common.checkNull(vUseyr)){
			// Off-Duty Day 정보 조회
			oModel.read("/OffDutyDaySet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Useyr', sap.ui.model.FilterOperator.EQ, vUseyr),
					new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr),
				],
				success : function(data, res) {
					vZdate = data.results[0].Zdate;
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
					sap.m.MessageBox.error(errData.ErrorMessage, {
						title : oBundleText.getText("LABEL_0053"),
						onClose : function() {
							if(_gAuth=="E" || oController._DetailJSonModel.getProperty("/Data/ZappStatAl") == "10"){
								oController.onBack();
							}else{
								// 대상자 Clear
								oController.onReset(oController);
								oController.onResetDetail(oController);
							}
						}
					});
				}
			});
		}
		oController._DetailJSonModel.setProperty("/Data/Zdate", vZdate);
	},
	
	// 기간적용 
	onSetIntensiveVacation : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
		    vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vUseyr = oController._DetailJSonModel.getProperty("/Data/Useyr"),
		    vVcbeg = oController._DetailJSonModel.getProperty("/Data/Vcbeg"),
		    vVcend = oController._DetailJSonModel.getProperty("/Data/Vcend");
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyyMMdd"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		if(vVcbeg && vVcbeg != "" && vVcend && vVcend != "" ){
			var oDetailTableData = oController._DetailTableJSonModel.getData();
			if(!oDetailTableData || oDetailTableData == "" ) oDetailTableData = { Data : []};
			var vData = oDetailTableData.Data ;
			oModel.read("/YearLeaveDetailSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vVcbeg)),
					new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vVcend)),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "F"),
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				],
				success : function(data, res) {
					if(data && data.results.length) {
						// 중복체크
						try {
							if(vData.length > 0){
								vData.forEach(function(prop, index, array) {
									data.results.forEach(function(element) {
										// 기존 Table 날짜
										var vBDatum = common.Common.replaceAll(prop.Datum,"-","");
										// 추가되는 Data 의 날자
										var vADatum = dateFormat.format(element.Datum);
										
										if(vBDatum == vADatum) {
											throw new Error(oBundleText.getText("LABEL_1058") + dateFormat2.format(element.Datum));	// 1058:이미 등록된 사용일이(가) 존재합니다. \n등록 날짜 : 
										}
									});
								});
							}
						} catch(ex) {
							sap.m.MessageBox.alert(ex.message);
							return;
						}
						
						var vIdx = oDetailTableData.Data.length;
						data.results.forEach(function(element) {
							element.Idx = ++vIdx;
							element.ZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
							element.Datum = dateFormat2.format(element.Datum);
							element.Useday = element.Useday.substring(0,3);
							oDetailTableData.Data.push(element);
						});
						
						oController._DetailTableJSonModel.setProperty("/Data",oDetailTableData.Data);
						oController._DetailJSonModel.setProperty("/Data/IvCheck", true); // 기간적용 여부

						if(oDetailTable){
							oDetailTable.setVisibleRowCount(oDetailTableData.Data.length > 15 ? 15 : oDetailTableData.Data.length);
						}
						oController.setBalHoldays(oController);
						oController.onSetAptyp(oController, oController._DetailJSonModel.getProperty("/Data/Useyr"));
						
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
					sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				}
			});
		}
	},
	
	onDelIntensiveVacation : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		var vSelected = oEvent.getParameters().selected;
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var delRecords = [];
		for(var i = 0; i <vTableData.length; i++){
			if(oController._DetailTableJSonModel.getProperty("/Data/" + i + "/Conchk") == true){
				delRecords.push(i);
			}
		}
		
		var procDeleteRecord = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var detailData = oController._DetailTableJSonModel.getData().Data;
				var tableItemLength = oController._DetailTableJSonModel.getData().Data.length;
	
				for(var i = delRecords.length -1 ; i >= 0 ; i--){
					detailData.splice(delRecords[i], 1);
				}
				
				oDetailTable.getModel().setProperty("/Data", common.Common.reIndexODataArray(detailData));
				oDetailTable.setVisibleRowCount(detailData.length);
				oController.setBalHoldays(oController);
				
				//집중 휴가 기간 초기화
				oController._DetailJSonModel.setProperty("/Data/Vcbeg","");
				oController._DetailJSonModel.setProperty("/Data/Vcend","");
				oController._DetailJSonModel.setProperty("/Data/IvCheck", false); // 기간적용 여부
				
			}
		};
		
		if(delRecords.length > 0){
			sap.m.MessageBox.show(oBundleText.getText("LABEL_1059"), {	// 1059:기간 취소하시겠습니까?
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose : procDeleteRecord
			});
		}
		
	},
	
	
	// 일자 선택 >> 삭제
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var delRecords = [];
		var vTableData = oController._DetailTableJSonModel.getData().Data ;
		for(var i = 0; i < vTableData.length; i++){
			if(vTableData[i].Check == true){
				delRecords.push(i);
			}
		}
		
		if(delRecords.length < 1) {
			new sap.m.MessageBox.alert(oBundleText.getText("LABEL_1060"));	// 1060:삭제할 휴가를 선택하여 주십시오.
			return;
		}
		
		var procDeleteRecord = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var detailData = oController._DetailTableJSonModel.getData().Data;
				var tableItemLength = oController._DetailTableJSonModel.getData().Data.length;
	
				for(var i = delRecords.length -1 ; i >= 0 ; i--){
					detailData.splice(delRecords[i], 1);
				}
				
//				oDetailTable.getModel().setData({Data : common.Common.reIndexODataArray(detailData)});
				oDetailTable.getModel().setProperty("/Data",common.Common.reIndexODataArray(detailData));
				oDetailTable.setVisibleRowCount(detailData.length);
				var oCheckAll = sap.ui.getCore().byId(oController.PAGEID + "_checkAll");
				oCheckAll.setSelected(false);
				oController.setBalHoldays(oController);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : procDeleteRecord
		});
		
	},

	
	// 등록
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}else if(!oController._DetailJSonModel.getProperty("/Data/Useyr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1061"), {title : oBundleText.getText("LABEL_0053")});	// 1061:사용연도를 선택하여 주십시오.
			return;
		}
		if(!oController._CalendarDialog) {
			oController._CalendarDialog = sap.ui.jsfragment("ZUI5_HR_AnnualLeave.fragment.Calendar", oController);
			oView.addDependent(oController._CalendarDialog);
		}
		
		var vUseyr = oController._DetailJSonModel.getProperty("/Data/Useyr");
		var oCalendar = sap.ui.getCore().byId(oController.PAGEID + "_Calendar");
		
		oCalendar.setMinDate(new Date(vUseyr, 0, 1));
		oCalendar.setMaxDate(new Date(vUseyr, 11, 31));
		
		oController._CalendarDialog.open();
	},
	
	
	// 달력에서 날짜 선택
	onSelectDate : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
		    vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vUseyr = oController._DetailJSonModel.getProperty("/Data/Useyr"),
			vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl"),
			vDatum = oEvent.getSource().getSelectedDates()[0].getStartDate();

		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		var oDetailTableData = oController._DetailTableJSonModel.getData();
		if(!oDetailTableData || oDetailTableData == "" ) oDetailTableData = { Data : []};
	
		var vData = oDetailTableData.Data ;
		
		oModel.read("/YearLeaveDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(vDatum)),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "S"),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					if(vData.length > 0){
						// 중복체크
						try {
							vData.forEach(function(prop, index, array) {
								data.results.forEach(function(element) {
									var vDatum = dateFormat.format(element.Datum);
									if(prop.Datum == vDatum){
										throw new Error(oBundleText.getText("LABEL_1058") + vDatum);	// 1058:이미 등록된 사용일이(가) 존재합니다. \n등록 날짜 : 
									}
								});
							});
						} catch(ex) {
							sap.m.MessageBox.alert(ex.message);
							return;
						}
					}
					
					var vIdx = vData.length;
					data.results.forEach(function(element) {
						element.Idx = ++vIdx;
						element.ZappStatAl = vZappStatAl;
						element.Datum = dateFormat.format(element.Datum);
						element.Useday = element.Useday.substring(0,3);
						element.CredayYea = oController._DetailJSonModel.getProperty("/Data/CredayYea"); 
						oDetailTableData.Data.push(element);
					});
					oController._DetailTableJSonModel.setProperty("/Data",oDetailTableData.Data);
					if(oDetailTable){
						oDetailTable.setVisibleRowCount(oDetailTableData.Data.length);
					}
					oController.setBalHoldays(oController);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
				sap.m.MessageBox.alert(errData.ErrorMessage, oBundleText.getText("LABEL_0053"));
			}
		});
	},
	
	// 휴가 발생/사용/미사용일수 설정
	setBalHoldays : function(oController){
		var vDetailData = oController._DetailTableJSonModel.getProperty("/Data"),
		 vData = oController._DetailJSonModel.getProperty("/Data"),
		 // 발생, 사용, 미사용                  
		vCredayYea = vData.CredayYea, vUsedayYea = 0, vBaldayYea = 0, vCntdayYea = common.Common.checkNull(vData.CntdayYea) ? 0 : vData.CntdayYea,
		vCredayVac = vData.CredayVac, vUsedayVac = 0, vBaldayVac = 0, vCntdayVac = common.Common.checkNull(vData.CntdayVac) ? 0 : vData.CntdayVac,
		vDetailUsedayYea = 0, vDetailUsedayVac = 0 ,
		vHolcnt1 = "", vHolcnt2 = "";
		 
		for(var i =0; i< vDetailData.length; i++){
			// 하기휴가
			if(vDetailData[i].Aptyp == "1040") vDetailUsedayVac += ( vDetailData[i].Useday * 1);
			// 연차
			else if(vDetailData[i].Aptyp != "") vDetailUsedayYea += ( vDetailData[i].Useday * 1);
		}
//		vDetailUsedayYea = vDetailUsedayYea + (vCntdayYea * 1);
		
		// 미사용 = 발생 - 사용
		vBaldayYea = vCredayYea * 1 - vDetailUsedayYea ;
		vHolcnt1  = oBundleText.getText("LABEL_1048")+" " + (vCredayYea * 1 )+ " / ";	// 1048:발생
		vHolcnt1 += oBundleText.getText("LABEL_1049")+" " + vDetailUsedayYea + " / ";	// 1049:사용
		vHolcnt1 += oBundleText.getText("LABEL_1046")+" " + vBaldayYea ;	// 1046:미사용
		
//		vDetailUsedayVac = vDetailUsedayVac + (vCntdayVac * 1);
		
		// 미사용 = 발생 - 사용
		vBaldayVac = vCredayVac * 1 - vDetailUsedayVac ;
		vHolcnt2  = oBundleText.getText("LABEL_1048")+" " + (vCredayVac * 1) + " / ";	// 1048:발생
		vHolcnt2 += oBundleText.getText("LABEL_1049")+" " + vDetailUsedayVac + " / ";	// 1049:사용
		vHolcnt2 += oBundleText.getText("LABEL_1046")+" " + vBaldayVac ;	// 1046:미사용
		
		vData.Holcnt1 = vHolcnt1;
		vData.CredayYea = "" + vCredayYea;
		vData.UsedayYea = "" + vDetailUsedayYea;
		vData.BaldayYea = "" + vBaldayYea;
		
		vData.Holcnt2 = vHolcnt2;
		vData.CredayVac = "" + vCredayVac;
		vData.UsedayVac = "" + vDetailUsedayVac;
		vData.BaldayVac = "" + vBaldayVac;
		
		oController._DetailJSonModel.setProperty("/Data", vData);
	},
	
	// 휴가 유형 변경
	onChangeAptyp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");	
		var vIdx = oEvent.getSource().getCustomData()[0].getValue();
		var xIndex = vIdx - 1;
		oController._DetailTableJSonModel.setProperty("/Data/" +xIndex + "/Aptyp", vAptyp);
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
		    vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vUseyr = oController._DetailJSonModel.getProperty("/Data/Useyr"),
			vDatum = oController._DetailTableJSonModel.getProperty("/Data/" + xIndex +"/Datum"),
			vAwart = oController._DetailTableJSonModel.getProperty("/Data/" + xIndex +"/Awart"),
			vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
			
		// 신청유형
		var vAptyp = "" ;
		for(var i = 0; i < oController._Aptyp.length ; i++){
			if(vAwart == oController._Aptyp[i].Awart){
				vAptyp = vAwart;
				break;
			}
		}
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var oDetailTableData = oController._DetailTableJSonModel.getData();
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		oModel.read("/YearLeaveDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum)),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "A"),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Aptyp', sap.ui.model.FilterOperator.EQ, vAptyp),
				
			],
			success : function(data, res) {
				if(data && data.results.length) {
					var vData = data.results[0];
					vData.Idx = vIdx;
					vData.Datum = dateFormat.format(vData.Datum);
					vData.ZappStatAl = vZappStatAl;
					vData.Useday = vData.Useday.substring(0,3);
					vData.Mrdchk = false ; // 휴가 유형이 바뀌면 Mrd 는 Clear
					vData.CredayYea = oController._DetailJSonModel.getProperty("/Data/CredayYea"); 
					
					oController._DetailTableJSonModel.setProperty("/Data/" + xIndex, vData );
					
				}
			},
			error : function(Res) {
				oController._DetailTableJSonModel.setProperty("/Data/" + xIndex +"/Aptyp", "" );
				oController._DetailTableJSonModel.setProperty("/Data/" + xIndex +"/Awart", "" );
				
				errData = common.Common.parseError(Res);
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
					}
				});
			}
		});
		
		oController.setBalHoldays(oController);
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		oController._DetailTableJSonModel.setProperty("/Data",[]);
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID +"_DetailTable");
		oDetailTable.setVisibleRowCount(1);
		
		//집중 휴가 기간 초기화
		oController._DetailJSonModel.setProperty("/Data/Vcbeg","");
		oController._DetailJSonModel.setProperty("/Data/Vcend","");
		
		//기간 적용 여부 초기화
		oController._DetailJSonModel.setProperty("/Data/IvCheck", false); // 기간적용 여부	
	},	
	
	// 신청내역 초기화
	onReset : function(oController){
		var vDetailData = { Data : { ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl"),
						             Appno : oController._DetailJSonModel.getProperty("/Data/Appno")
						   }},
		vTargetData = { Data : { ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl") }};				   
		
		oController._DetailJSonModel.setData(vDetailData);
		oController._TargetJSonModel.setData(vTargetData);
	},	
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		// 근무일정규칙 조회
		oController.onChangeUseyr();
	},
	
	CheckAll : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
		var vSelected = oEvent.getParameters().selected;
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		for(var i = 0; i <vTableData.length; i++){
			// 집중휴가가 아니고, 조회용이 아닐경우만 체크
			if(oController._DetailTableJSonModel.getProperty("/Data/" + i + "/Conchk") == false &&
					oController._DetailTableJSonModel.getProperty("/Data/" + i + "/Disp") == false ){
				oController._DetailTableJSonModel.setProperty("/Data/" + i + "/Check", vSelected);
			}
		}
	},
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
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
			var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "YearLeaveList", oneData);
			createData.Zpernr = oneData.Pernr ;
			createData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
			if(common.Common.checkNull(createData.Vcbeg)) delete createData.Vcbeg;
			else createData.Vcbeg = "\/Date("+ common.Common.getTime(createData.Vcbeg)+")\/";
			
			if(common.Common.checkNull(createData.Vcend)) delete createData.Vcend;
			else createData.Vcend = "\/Date("+ common.Common.getTime(createData.Vcend)+")\/";
			
			createData.Useyr = "" + createData.Useyr;
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			vTableData.forEach(function(element) {
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "YearLeaveDetail", element);
				vDetailData.Appno = oController._vAppno ;
				vDetailData.Seqnr = String(1); 
				vDetailData.Datum = "\/Date("+ common.Common.getTime(element.Datum)+")\/";
				vDetailDataList.push(vDetailData);
			});
			
			createData.YearLeaveNav = vDetailDataList;
			
			var saveError = "",
				errorList = [];
			oModel.create("/YearLeaveListSet", createData, {
				success : function(data, res) {
			
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
	
	callSaveErrorDialog : function(oController, errorList) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		
		if(!oController._ErrorDialog) {
			oController._ErrorDialog = sap.ui.jsfragment("ZUI5_HR_AnnualLeave.fragment.SaveError", oController);
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
		} else if(!oneData.Useyr){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1062"), {title : oBundleText.getText("LABEL_0053")});	// 1062:사용연도를 입력하여 주십시오.
			return false;
		}
		
		var targetDatas = oController._DetailTableJSonModel.getProperty("/Data");
		if(targetDatas.constructor !== Array || targetDatas.length < 1) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2863"), {title : oBundleText.getText("LABEL_0053")});	// 25:변경 대상자를 선택하여 주십시오.
			return false;
		}
		
		var isDup = false, isInputValid = true, aDates = [], isDiffentUseyr = true, isConchk = false;
		targetDatas.some(function(elem, index) {
			if(aDates.indexOf(elem.Datum) > -1) {
				isDup = true;
				return true;
			} else {
				aDates.push(elem.Datum);
			}
			
			if(!elem.Aptyp) {
				isInputValid = false;
				return true;
			}
			
			if(oneData.Useyr != elem.Datum.substring(0,4)){
				isDiffentUseyr = false;
				return true
			}
			if(elem.Conchk == true){
				isConchk = true;
			}
		});
		
		if(isDup) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1063"), {title : oBundleText.getText("LABEL_0053")});	// 1063:중복된 날짜가 존재하여 신청이 불가능합니다.
			return false;
		}
		if(!isInputValid) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1064"), {title : oBundleText.getText("LABEL_0053")});	// 1064:휴가유형을 선택하여 주십시오.
			return false;
		}
		if(!isDiffentUseyr) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1065"), {title : oBundleText.getText("LABEL_0053")});	// 1065:사용연도의 일자만 가능합니다.
			return false;
		}
//		if(!isConchk) {
//			sap.m.MessageBox.error(oBundleText.getText("LABEL_1066"), {title : oBundleText.getText("LABEL_0053")});	// 1066:집중휴가는 반드시 입력하여 주십시오.
//			return false;
//		}
		
		if(oneData.BaldayYea * 1 < 0 || oneData.BaldayVac * 1 < 0){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1068"), {title : oBundleText.getText("LABEL_0053")});	// 1068:미사용일수 이내만 가능합니다.
			return false;
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
			if(oneData.BaldayYea * 1 > 0 ){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1067"), {title : oBundleText.getText("LABEL_0053")});	// 1067:미사용 일수 전체를 등록해야 합니다.
				return false;
			}
		}
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
				
				oModel.remove("/YearLeaveListSet(Appno='" + oController._vAppno + "')", {
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
});