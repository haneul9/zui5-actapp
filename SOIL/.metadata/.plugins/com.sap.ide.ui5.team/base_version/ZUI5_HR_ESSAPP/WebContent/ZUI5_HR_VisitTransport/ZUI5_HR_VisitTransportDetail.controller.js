jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.CCSInformation");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail
	 */

	PAGEID : "ZUI5_HR_VisitTransportDetail",
	
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
	_vZworktyp : "HR36",
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_VISITRANS_FEE_SRV");
		var oDetailData = {Data : {}};
		var oDetailTableData = {Data : []};
		var vZappStatAl = "";
		var errData = {};
		
		if(vAppno != "") { // 수정 및 조회
			oController.BusyDialog.open();
			
			oModel.read("/VisitransFeeApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
				],
				success : function(data, res) {
					oDetailData.Data = data.results[0];
					oDetailData.Data.Datb1 = common.Common.checkNull(oDetailData.Data.Datb1) ? "" : dateFormat.format(oDetailData.Data.Datb1);
					oDetailData.Data.Date1 = common.Common.checkNull(oDetailData.Data.Date1) ? "" : dateFormat.format(oDetailData.Data.Date1);
					oDetailData.Data.Datb2 = common.Common.checkNull(oDetailData.Data.Datb2) ? "" : dateFormat.format(oDetailData.Data.Datb2);
					oDetailData.Data.Date2 = common.Common.checkNull(oDetailData.Data.Date2) ? "" : dateFormat.format(oDetailData.Data.Date2);
					oDetailData.Data.Pernr = oDetailData.Data.Pernr ;
					oDetailData.Data.Encid = oDetailData.Data.Encid ;
					oDetailData.Data.Tota1  = common.Common.numberWithCommas(oDetailData.Data.Tota1);
					oDetailData.Data.Requ1  = common.Common.numberWithCommas(oDetailData.Data.Requ1);
					oDetailData.Data.Actu1  = common.Common.numberWithCommas(oDetailData.Data.Actu1);
					oDetailData.Data.Cash1  = common.Common.numberWithCommas(oDetailData.Data.Cash1);
					oDetailData.Data.Tota2  = common.Common.numberWithCommas(oDetailData.Data.Tota2);
					oDetailData.Data.Requ2  = common.Common.numberWithCommas(oDetailData.Data.Requ2);
					oDetailData.Data.Actu2  = common.Common.numberWithCommas(oDetailData.Data.Actu2);
					oDetailData.Data.Cash2  = common.Common.numberWithCommas(oDetailData.Data.Cash2);
					
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
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		
		/****************************************************/
		/*********** 공통적용사항 End	 			 ************/
		/****************************************************/
		// 법인카드 시스템 
		common.CCSInformation.oController = oController ;
		// 법인카드시스템 마킹 내역 조회
		common.CCSInformation.onSearchUsebyPage();

		if(vAppno == "") {
			
			if(_gAuth == "E"){
				oController.onAfterSelectPernr(oController);
			}
			oController._DetailJSonModel.setProperty("/Data/Objx1",oBundleText.getText("LABEL_2736"));	// 2736:Recruiting 관련 방문
			oController._DetailJSonModel.setProperty("/Data/Objx2",oBundleText.getText("LABEL_2736"));	// 2736:Recruiting 관련 방문
		}
		
		// 연고지 조회
		oController.onSearchVisitransReadd(oController ,"1");
		oController.onSearchVisitransReadd(oController ,"2");
		// 여비내역 계 계산
		oController.onCalAmount(oController)
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl) {
			oPortalTitle.setText(oBundleText.getText("LABEL_1738") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1738:방문교통비 신청
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText(oBundleText.getText("LABEL_1738") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1738:방문교통비 신청
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_1738") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1738:방문교통비 신청
		}
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportList",
			      data : { }
				}
			);	
		}
		
	},
		
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();
	},
	
	// 1차 금액 변경 
	onChangePrice1 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();
		var inputValue = oEvent.getParameter('value').trim(),
		convertValue = common.Common.numberWithCommas(inputValue.replace(/[^\d]/g, ''));
		oEvent.getSource().setValue(convertValue);
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		oneData.Tota1 = (common.Common.checkNull(oneData.Requ1) ? 0 : common.Common.removeComma(oneData.Requ1) * 1 ) + 
				        (common.Common.checkNull(oneData.Cash1) ? 0 : common.Common.removeComma(oneData.Cash1)  * 1 );
		
		oController._DetailJSonModel.setProperty("/Data/Tota1", common.Common.numberWithCommas(oneData.Tota1));
		oController.onCalAmount(oController);
	},
	
	// 2차 금액 변경 
	onChangePrice2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();
		var inputValue = oEvent.getParameter('value').trim(),
		convertValue = common.Common.numberWithCommas(inputValue.replace(/[^\d]/g, ''));
		oEvent.getSource().setValue(convertValue);
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		oneData.Tota2 = (common.Common.checkNull(oneData.Requ2) ? 0 : common.Common.removeComma(oneData.Requ2) * 1 ) + 
				        (common.Common.checkNull(oneData.Cash2) ? 0 : common.Common.removeComma(oneData.Cash2)  * 1 );
		
		oController._DetailJSonModel.setProperty("/Data/Tota2", common.Common.numberWithCommas(oneData.Tota2));
		oController.onCalAmount(oController);
	},
	
	onCalAmount : function(oController){
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		oneData.Tota3 = (common.Common.checkNull(oneData.Tota1) ? 0 : common.Common.removeComma(oneData.Tota1) * 1 ) + 
						(common.Common.checkNull(oneData.Tota2) ? 0 : common.Common.removeComma(oneData.Tota2) * 1 );
		oneData.Requ3 = (common.Common.checkNull(oneData.Requ1) ? 0 : common.Common.removeComma(oneData.Requ1) * 1 ) + 
						(common.Common.checkNull(oneData.Requ2) ? 0 : common.Common.removeComma(oneData.Requ2) * 1 );
		oneData.Actu3 = (common.Common.checkNull(oneData.Actu1) ? 0 : common.Common.removeComma(oneData.Actu1) * 1 ) + 
						(common.Common.checkNull(oneData.Actu2) ? 0 : common.Common.removeComma(oneData.Actu2) * 1 );
		oneData.Cash3 = (common.Common.checkNull(oneData.Cash1) ? 0 : common.Common.removeComma(oneData.Cash1) * 1 ) + 
						(common.Common.checkNull(oneData.Cash2) ? 0 : common.Common.removeComma(oneData.Cash2) * 1 );
		
		oController._DetailJSonModel.setProperty("/Data/Tota3", common.Common.numberWithCommas(oneData.Tota3));
		oController._DetailJSonModel.setProperty("/Data/Requ3", common.Common.numberWithCommas(oneData.Requ3));
		oController._DetailJSonModel.setProperty("/Data/Actu3", common.Common.numberWithCommas(oneData.Actu3));
		oController._DetailJSonModel.setProperty("/Data/Cash3", common.Common.numberWithCommas(oneData.Cash3));
	},

	onSearchPerData :function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_VISITRANS_FEE_SRV");
		var errData = {};
		var vKostl = "" , vLtext = "", vAufnr = "", vAufnrtx = "" ,
		    vBudge = "", vBudgetx = "" ;
		
		var vDatum = "";
		
		if(common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Datb1"))){
			if(!common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Datb2"))){
				vDatum = oController._DetailJSonModel.getProperty("/Data/Datb2");
			}
		}else{
			vDatum = oController._DetailJSonModel.getProperty("/Data/Datb1");
		}
		
		if(vDatum == ""){
			oController._DetailJSonModel.setProperty("/Data/Kostl",vKostl);
			oController._DetailJSonModel.setProperty("/Data/Ltext",vLtext);
			oController._DetailJSonModel.setProperty("/Data/Aufnr",vAufnr);
			oController._DetailJSonModel.setProperty("/Data/Aufnrtx",vAufnrtx);
			oController._DetailJSonModel.setProperty("/Data/Budge",vBudge);
			oController._DetailJSonModel.setProperty("/Data/Budgetx",vBudgetx);
		}else{
			var onProcess = function(){
				oModel.read("/VisitransPerdataSet", {
					async : false,
					filters : [
						new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")),
						new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ,  common.Common.getTime(vDatum)),
					],
					success : function(data, res) {
						vKostl = data.results[0].Kostl;
						vLtext = data.results[0].Ltext;
						vAufnr = data.results[0].Aufnr;
						vAufnrtx = data.results[0].Aufnrtx;
						vBudge = data.results[0].Budge; 
						vBudgetx = data.results[0].Budgetx;
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				
				oController.BusyDialog.close();
				if(errData.Error && errData.Error == "E"){
					sap.m.MessageBox.alert(errData.ErrorMessage);
				}		
				
				oController._DetailJSonModel.setProperty("/Data/Kostl",vKostl);
				oController._DetailJSonModel.setProperty("/Data/Ltext",vLtext);
				oController._DetailJSonModel.setProperty("/Data/Aufnr",vAufnr);
				oController._DetailJSonModel.setProperty("/Data/Aufnrtx",vAufnrtx);
				oController._DetailJSonModel.setProperty("/Data/Budge",vBudge);
				oController._DetailJSonModel.setProperty("/Data/Budgetx",vBudgetx);
			}
			
			oController.BusyDialog.open();
			setTimeout(onProcess, 100);
		}
		
	},
	
	
	// 일자 선택 >> 삭제
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
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
				
				oDetailTable.getModel().setData({Data : common.Common.reIndexODataArray(detailData)});
				oDetailTable.setVisibleRowCount(detailData.length);
				var oCheckAll = sap.ui.getCore().byId(oController.PAGEID + "_checkAll");
				oCheckAll.setSelected(false);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : procDeleteRecord
		});
		
	},
	
	onAfterSelectPernr : function(oController) {
		// 예산 및 Cost Center 정보
		oController.onSearchPerData(oController);
		// 연고지 조회
		oController.onSearchVisitransReadd(oController ,"1");
		oController.onSearchVisitransReadd(oController ,"2");
		// 법인카드 Clear
		common.CCSInformation.onInit();
		// 여비내역 및 연고지 Clear
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		oneData.Sloc1 = "", oneData.Sloc2 = "";
		oneData.Tota1 = "",	oneData.Requ1 = "", oneData.Actu1 = "", oneData.Cash1 = "",	oneData.Opin1 = "";
		oneData.Tota2 = "", oneData.Requ2 = "", oneData.Actu2 = "", oneData.Cash2 = "", oneData.Opin2 = "";
		oneData.Tota3 = "", oneData.Requ3 = "", oneData.Actu3 = "", oneData.Cash3 = "";
		oController._DetailJSonModel.setProperty("/Data", oneData);	
	},
	
	onAfterBizCard : function(oController){
		var oCCSDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable");
		var vCCSDatas =  oCCSDetailTable.getModel().getProperty("/Data");
		
		var vActu1 = 0, vActu2 = 0, vActu2 = 0;
		vCCSDatas.forEach(function(element){
				if(element.Mergetype == "01")   vActu1 += element.Amount * 1 ;
				else if(element.Mergetype == "02")   vActu2 += element.Amount * 1 ;
			}
		);
		vActu3 = vActu1 + vActu2 ;

		oController._DetailJSonModel.setProperty("/Data/Actu1", common.Common.numberWithCommas(vActu1));
		oController._DetailJSonModel.setProperty("/Data/Actu2", common.Common.numberWithCommas(vActu2));
		oController._DetailJSonModel.setProperty("/Data/Actu3", common.Common.numberWithCommas(vActu3));
		
	},
	
	onInitBizCard : function(oController){
		// 여비내역 초기화
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		oneData.Tota1 = "",	oneData.Requ1 = "", oneData.Actu1 = "", oneData.Cash1 = "",	oneData.Opin1 = "";
		oneData.Tota2 = "", oneData.Requ2 = "", oneData.Actu2 = "", oneData.Cash2 = "", oneData.Opin2 = "";
		oneData.Tota3 = "", oneData.Requ3 = "", oneData.Actu3 = "", oneData.Cash3 = "";
		oController._DetailJSonModel.setProperty("/Data", oneData);	
	},
	
	onChange1Date : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();
		// 연고지 조회
		oController.onSearchVisitransReadd(oController, "1");
	},
	
	onChange2Date : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();
		// 연고지 조회
		oController.onSearchVisitransReadd(oController, "2");
	},
	
	// 연고지 리스트 조회
	onSearchVisitransReadd :function(oController , xtype){
		var oModel = sap.ui.getCore().getModel("ZHR_VISITRANS_FEE_SRV");
		var errData = {};
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		var oSloc , aFilter = [];
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_VISITRANS_FEE_SRV");
			oModel.read("/VisitransReaddSet", {
				async : false,
				filters : [
					aFilter
				],
				success : function(data, res) {
					if(data && data.results.length){
						data.results.forEach(function(element){
							oSloc.addItem(new sap.ui.core.Item({ 
								key: element.Readd, 
								text: element.Readd,
							}));
						});
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController.BusyDialog.close();
			if(errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
		}
		
		if(xtype == "1"){
			oSloc = sap.ui.getCore().byId(oController.PAGEID + "_Sloc1");
			oSloc.destroyItems() ;
			if(!common.Common.checkNull(oneData.Datb1) && !common.Common.checkNull(oneData.Date1) && !common.Common.checkNull(oneData.Pernr)){
//				aFilter.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oneData.Pernr));
				aFilter.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oneData.Encid));
				aFilter.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(oneData.Datb1)));
				aFilter.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(oneData.Date1)));
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}else{
			oSloc = sap.ui.getCore().byId(oController.PAGEID + "_Sloc2");
			oSloc.destroyItems() ;
			if(!common.Common.checkNull(oneData.Datb2) && !common.Common.checkNull(oneData.Date2) && !common.Common.checkNull(oneData.Pernr)){
//				aFilter.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oneData.Pernr));
				aFilter.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oneData.Encid));
				aFilter.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(oneData.Datb2)));
				aFilter.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(oneData.Date2)));
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		
		var vWarning = oController.onValidationData(oController, vPrcty);
		if(vWarning == false) return;
		
		var onProcess = function(){
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_VISITRANS_FEE_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "VisitransFeeAppl", oneData);
			if(!common.Common.checkNull(createData.Datb1)) createData.Datb1 = "\/Date("+ common.Common.getTime(createData.Datb1)+")\/";
			else delete createData.Datb1 ;
			if(!common.Common.checkNull(createData.Date1)) createData.Date1 = "\/Date("+ common.Common.getTime(createData.Date1)+")\/";
			else delete createData.Date1 ;
			if(!common.Common.checkNull(createData.Datb2)) createData.Datb2 = "\/Date("+ common.Common.getTime(createData.Datb2)+")\/";
			else delete createData.Datb2 ;
			if(!common.Common.checkNull(createData.Date2)) createData.Date2 = "\/Date("+ common.Common.getTime(createData.Date2)+")\/";
			else delete createData.Date2 ;
			createData.Actu1 = "" + (createData.Actu1 == "" ? 0 : common.Common.removeComma(createData.Actu1));
			createData.Actu2 = "" + (createData.Actu2 == "" ? 0 : common.Common.removeComma(createData.Actu2));
			createData.Cash1 = "" + (createData.Cash1 == "" ? 0 : common.Common.removeComma(createData.Cash1));
			createData.Cash2 = "" + (createData.Cash2 == "" ? 0 : common.Common.removeComma(createData.Cash2));
			createData.Tota1 = "" + (createData.Tota1 == "" ? 0 : common.Common.removeComma(createData.Tota1));
			createData.Tota2 = "" + (createData.Tota2 == "" ? 0 : common.Common.removeComma(createData.Tota2));
			createData.Requ1 = "" + (createData.Requ1 == "" ? 0 : common.Common.removeComma(createData.Requ1));
			createData.Requ2 = "" + (createData.Requ2 == "" ? 0 : common.Common.removeComma(createData.Requ2));
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			createData.Waers = "KRW";
			
			var errData = {},
				errorList = [];
			oModel.create("/VisitransFeeApplSet", createData, {
				success : function(data, res) {
					oController._vAppno = data.Appno ;
					oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error == "E"){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			// 첨부파일 저장
			common.AttachFileAction.uploadFile(oController);
			// 법인카드 시스템 사용내역 마킹(정산)
			common.CCSInformation.onSavePage();

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
			if(vWarning == "X"){
				vInfoTxt = oBundleText.getText("LABEL_2941") + "\n" + oBundleText.getText("LABEL_0051");
			}
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){		
		var vData = oController._DetailJSonModel.getProperty("/Data");
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		if(!oneData.Pernr){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}else if(common.Common.checkNull(oneData.Tota3)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2532"), {title : oBundleText.getText("LABEL_0053")});	// 2532:신청금액을 입력하여 주십시오.
			return false;
		}else if(vPrcty == "C" && oneData.Pregb == "A"){
			var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			var vData = oAttachFileList.getModel().getProperty("/Data");
			if(!vData || vData.length < 1){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
				return false;
			}
		}
		
		if(!common.Common.checkNull(oneData.Datb1) || !common.Common.checkNull(oneData.Date1)){
			if(common.Common.checkNull(oneData.Datb1) ||common.Common.checkNull(oneData.Date1)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2737"), {title : oBundleText.getText("LABEL_0053")});	// 2737:1차 사용기간을 입력하여 주십시오.
				return false;
			}else if(common.Common.checkNull(oneData.Sloc1)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2738"), {title : oBundleText.getText("LABEL_0053")});	// 2738:1차 연고지를 입력하여 주십시오.
				return false;
			}else if(common.Common.checkNull(oneData.Tran1)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2739"), {title : oBundleText.getText("LABEL_0053")});	// 2739:1차 교통편을 입력하여 주십시오.
				return false;
			}else if(common.Common.checkDate(oneData.Datb1, oneData.Date1) == false){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2740"), {title : oBundleText.getText("LABEL_0053")});	// 2740:1차사용 기간 시작일자가 종료일자보다 큽니다.
				return false;
			}
		}else{
			if(!common.Common.checkNull(oneData.Sloc1) || !common.Common.checkNull(oneData.Tran1) || 
			   (!common.Common.checkNull(oneData.Actu1) && oneData.Actu1 != "0") || 
			   (!common.Common.checkNull(oneData.Requ1) && oneData.Requ1 != "0") ||
			   (!common.Common.checkNull(oneData.Tota1) && oneData.Tota1 != "0")){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2741"), {title : oBundleText.getText("LABEL_0053")});	// 2741:1차 사용내역을 입력 한 경우 반드시 1차 사용기간을 입력하여 주십시오
				return false;
			}
		}
		
		if(!common.Common.checkNull(oneData.Datb2) || !common.Common.checkNull(oneData.Date2)){
			if(common.Common.checkNull(oneData.Datb2) ||common.Common.checkNull(oneData.Date2)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2742"), {title : oBundleText.getText("LABEL_0053")});	// 2742:2차 사용기간을 입력하여 주십시오.
				return false;
			}else if(common.Common.checkNull(oneData.Sloc2)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2743"), {title : oBundleText.getText("LABEL_0053")});	// 2743:2차 연고지를 입력하여 주십시오.
				return false;
			}else if(common.Common.checkNull(oneData.Tran2)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2744"), {title : oBundleText.getText("LABEL_0053")});	// 2744:2차 교통편을 입력하여 주십시오.
				return false;
			}else if(common.Common.checkDate(oneData.Datb2, oneData.Date2) == false){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2745"), {title : oBundleText.getText("LABEL_0053")});	// 2745:2차사용 기간 시작일자가 종료일자보다 큽니다.
				return false;
			}
		}else{
			if(!common.Common.checkNull(oneData.Sloc2) || !common.Common.checkNull(oneData.Tran2) || 
			   (!common.Common.checkNull(oneData.Actu2) && oneData.Actu2 != "0") || 
			   (!common.Common.checkNull(oneData.Requ2) && oneData.Requ2 != "0") ||
			   (!common.Common.checkNull(oneData.Tota2) && oneData.Tota2 != "0")){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2746"), {title : oBundleText.getText("LABEL_0053")});	// 2746:2차 사용내역을 입력 한 경우 반드시 2차 사용기간을 입력하여 주십시오
				return false;
			}
		}
		// 지급신청 금액이 실사용액 보다 큰 경우 에러
		if((common.Common.checkNull(oneData.Actu1) ? 0 : common.Common.removeComma(oneData.Actu1) * 1) < (common.Common.checkNull(oneData.Requ1) ? 0 : common.Common.removeComma(oneData.Requ1) * 1)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2747"), {title : oBundleText.getText("LABEL_0053")});	// 2747:1차 지급신청 금액이 1차 실사용액 보다 큽니다.
			return false;
		}
		if((common.Common.checkNull(oneData.Actu2) ? 0 : common.Common.removeComma(oneData.Actu2) * 1) < (common.Common.checkNull(oneData.Requ2) ? 0 : common.Common.removeComma(oneData.Requ2) * 1)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2748"), {title : oBundleText.getText("LABEL_0053")});	// 2748:2차 지급신청 금액이 2차 실사용액 보다 큽니다.
			return false;
		}
		
		// CCS 결재금액만 존재하고 CCS 지급신청액이 없는 경우 Warinig Message 출력
		if(oneData.Actu1 != "" && oneData.Actu1 * 1 != 0 && (common.Common.checkNull(oneData.Requ1) || oneData.Requ1 * 1 == 0 )){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1262"), {title : oBundleText.getText("LABEL_0053")});	// 1262:CCS 지급신청액이 없어 저장/신청이 불가합니다.
			return false;
		}else if(oneData.Actu2 != "" && oneData.Actu2 * 1 != 0 && (common.Common.checkNull(oneData.Requ2) || oneData.Requ2 * 1 == 0 )){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1262"), {title : oBundleText.getText("LABEL_0053")});	// 1262:CCS 지급신청액이 없어 저장/신청이 불가합니다.
			return false;
		}
		
		if(vPrcty == "C"){
			var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			var vData = oAttachFileList.getModel().getProperty("/Data");
			if(!vData || vData.length < 1){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
				return false;
			}
		}
		
		return true;
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_VISITRANS_FEE_SRV");
				var errData = {};
				oModel.remove("/VisitransFeeApplSet(Appno='" + oController._vAppno + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				
				oController.BusyDialog.close();
								
				if(errData.Error == "E"){
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