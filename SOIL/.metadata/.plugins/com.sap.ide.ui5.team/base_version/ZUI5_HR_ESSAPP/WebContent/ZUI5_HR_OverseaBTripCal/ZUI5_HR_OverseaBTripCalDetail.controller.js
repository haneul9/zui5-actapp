jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.CCSInformation");

sap.ui.controller("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail", {
	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail
	 */

	PAGEID : "ZUI5_HR_OverseaBTripCalDetail",
	
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
	_vZworktyp : "HR10",
	BusyDialog : new sap.m.BusyDialog(),
	_useCustomPernrSelection : "",
	_selectionSId : "",
	
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
			oDetailData = {Data : {}},
			vApplyType = "";
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno || '';
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		oController.BusyDialog.open();
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
		
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
		
		// 법인카드 시스템 
		common.CCSInformation.oController = oController ;
		// 법인카드시스템 마킹 내역 조회
		common.CCSInformation.onSearchUsebyPage();
		
		// 정산 합계
		if(oDetailData.Data.ZappStatAl != "" ){
			oController.onCalculateTotal(oController);
			oController._DetailJSonModel.setProperty("/Data/Persa", oController._TargetJSonModel.getProperty("/Data/Persa"));
		}
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamily")	// 결재선
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail");
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {}, vCode = ["R", "C", "H"];
		
		oModel.read("/BusitripIntApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "D")
			],
			success : function(data, res) {
				if(data && data.results.length > 0){
					oDetailData.Data = data.results[0];
					oDetailData.Data.Pernr00 = oDetailData.Data.Pernr;
					oDetailData.Data.Begtr = common.Common.checkNull(oDetailData.Data.Begtr) ? "" : dateFormat.format(new Date(common.Common.setTime(data.results[0].Begtr)));
					oDetailData.Data.Endtr = common.Common.checkNull(oDetailData.Data.Endtr) ? "" : dateFormat.format(new Date(common.Common.setTime(data.results[0].Endtr)));
					oDetailData.Data.Begtr2 = common.Common.checkNull(oDetailData.Data.Begtr2) ? "" : dateFormat.format(new Date(common.Common.setTime(data.results[0].Begtr2)));
					oDetailData.Data.Endtr2 = common.Common.checkNull(oDetailData.Data.Endtr2) ? "" : dateFormat.format(new Date(common.Common.setTime(data.results[0].Endtr2)));
					for(var i = 0; i < vCode.length; i++){
						eval("oDetailData.Data.Bscst" + vCode[i] + " = common.Common.numberWithCommas(oDetailData.Data.Bscst"  + vCode[i] + ");");
						eval("oDetailData.Data.Htcst" + vCode[i] + " = common.Common.numberWithCommas(oDetailData.Data.Htcst"  + vCode[i] + ");");
						eval("oDetailData.Data.Trcst" + vCode[i] + " = common.Common.numberWithCommas(oDetailData.Data.Trcst"  + vCode[i] + ");");
						eval("oDetailData.Data.Tlcst" + vCode[i] + " = common.Common.numberWithCommas(oDetailData.Data.Tlcst"  + vCode[i] + ");");
					}
					for(var i = 1; i < 4; i++){
						eval("oDetailData.Data.Bscst0" + i + " = common.Common.numberWithCommas(oDetailData.Data.Bscst0"  + i + ");");
						eval("oDetailData.Data.Htcst0" + i + " = common.Common.numberWithCommas(oDetailData.Data.Htcst0"  + i + ");");
						eval("oDetailData.Data.Trcst0" + i + " = common.Common.numberWithCommas(oDetailData.Data.Trcst0"  + i + ");");
						eval("oDetailData.Data.Smcst0" + i + " = common.Common.numberWithCommas(oDetailData.Data.Smcst0"  + i + ");");
					}
					
					oDetailData.Data.TrcstG = common.Common.numberWithCommas(oDetailData.Data.TrcstG);
					oDetailData.Data.BscstG = common.Common.numberWithCommas(oDetailData.Data.BscstG);
					oDetailData.Data.HtcstG = common.Common.numberWithCommas(oDetailData.Data.HtcstG);
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
	},
	
	retrieveDetailTable : function(oController, vZappStatAl) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel();
		
		oModel.read("/BusitripIntDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno)
			],
			success : function(data, res) {
				if(data && data.results){
					for(var i = 0; i < data.results.length; i++){
						data.results[i].ZappStatAl = vZappStatAl;
						data.results[i].Idx = i + 1;
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV"),
			errData = {};
		
		oModel.read("/BusitripIntApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I'),
			],
			success : function(data, res) {
				if(data.results && data.results.length)
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
		oController._DetailTableJSonModel.setData({Data : []});
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		oDetailTable.setVisibleRowCount(1);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_1279") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1279:해외출장비 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_1279") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1279:해외출장비 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_1279") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1279:해외출장비 신청
		}
	},
	
	setFactoryActivity : function(oController){
		var vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		var vAufnr = common.Common.onSearchDefaultAufnr(oController, oController._DetailJSonModel.getProperty("/Data/Begtr"));
		if(Array.isArray(vAufnr) &&  vAufnr.length == 2){
			oController._DetailJSonModel.setProperty("/Data/Aufnr",vAufnr[0]);
			oController._DetailJSonModel.setProperty("/Data/Aufnrtx",vAufnr[1]);
		}else{
			oController._DetailJSonModel.setProperty("/Data/Aufnr","");
			oController._DetailJSonModel.setProperty("/Data/Aufnrtx","");
		}
	},
	
	// 추가
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
		    oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = oJSonModel.getProperty("/Data");
		
		if(oTableData.length > 6){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2893"), 
					{title : oBundleText.getText("LABEL_0053")});	// 2893=최대 7건만 등록이 가능합니다.
			return;
		}
		
		var vData = { Idx : oTableData.length + 1, ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl")};
		oTableData.push(vData);
		
		oController._DetailTableJSonModel.setData({Data : oTableData});
		oTable.setVisibleRowCount(oTableData.length);
	},
	
	onPressDeleteAll : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    oController = oView.getController(),
	    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
	    oJSonModel = oTable.getModel(),
		oControl = sap.ui.getCore().byId(oEvent.getSource().getId());
		
		oJSonModel.setData({Data:[]});
		oTable.setVisibleRowCount(1);
		oControl.setSelected(false);
	},
	
	onPressDelete : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    oController = oView.getController(),
	    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
	    oJSonModel = oTable.getModel(),
	    oTableData = oJSonModel.getData();
		var Idx = oEvent.getSource().getBindingContext().sPath.split("/"); 
		oTableData.Data.splice(Idx[2], 1);
		
		common.Common.reIndexODataArray(oTableData.Data);
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
	},
	
	onPressDeparture : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    oController = oView.getController();
		
		if(!oController._DepatureDialog) {
			oController._DepatureDialog = sap.ui.jsfragment("ZUI5_HR_OverseaBTripCal.fragment.DepatureDialog", oController);
			oView.addDependent(oController._DepatureDialog);
		}
		
		var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
		oDialogTable1Model = oDialogTable1.getModel(),
		oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV"),
		vData1 = { Data : []},
		vData2 = { Data : []},
		aFilters = [],
		oneData = {};
		aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, "3"));
		aFilters.push(new sap.ui.model.Filter('Ovryn', sap.ui.model.FilterOperator.EQ, "2"));
		
		oModel.read("/BusitripBlocdSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i = 0; i < data.results.length; i++){
						oneData = {};
						data.results[i].Idx = i + 1;
						Object.assign(oneData, data.results[i]);
						vData1.Data.push(data.results[i]);
						vData2.Data.push(data.results[i]);
					}
				}
			},
			error : function(Res) {
				
			}
		});
		oDialogTable1Model.setData(vData1);
		
		var oDialogTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable2"),
		oDialogTable2Model = oDialogTable2.getModel();
		oDialogTable2Model.setData(vData2);
		
		var oDialogTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable3"),
		oDialogTable3Model = oDialogTable3.getModel(),
		vData3 = { Data : []},
		aFilters = [];
		aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, "3"));
		
		oModel.read("/BusitripTrfSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i = 0; i < data.results.length; i++){
						data.results[i].Idx = i + 1;
						vData3.Data.push(data.results[i]);
					}
				}
			},
			error : function(Res) {
				
			}
		});
		oDialogTable3Model.setData(vData3);
		
		oController._vIndex = oEvent.getSource().getBindingContext().sPath;
		var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
	    oDialogTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable2"),
	    oDialogTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable3");
	    
		removeSortFilter = function(oTable){
			var oColumns = oTable.getColumns();
			for(var i=0; i<oColumns.length; i++) {
				oColumns[i].setSorted(false);
				oColumns[i].setFiltered(false);
			}
			
			oTable.bindRows("/Data");
		};
		
		oDialogTable1.clearSelection();
		oDialogTable2.clearSelection();
		oDialogTable3.clearSelection();
		removeSortFilter(oDialogTable1);
		removeSortFilter(oDialogTable2);
		removeSortFilter(oDialogTable3);
		
	    oController._DepatureDialog.open();
	},
	
	onSelectDeparture : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    oController = oView.getController();
		
	    var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
	    oDialogTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable2"),
	    oDialogTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable3"),
	    vIdx1= oDialogTable1.getSelectedIndices(),
	    vIdx2= oDialogTable2.getSelectedIndices(),
	    vIdx3= oDialogTable3.getSelectedIndices();
	    
	    if(vIdx1.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1215"), {title : oBundleText.getText("LABEL_0053")});	// 1215:출발지를 선택하여 주십시오.
			return;
	    }else if(vIdx2.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1216"), {title : oBundleText.getText("LABEL_0053")});	// 1216:도착지를 선택하여 주십시오.
			return;
	    }else if(vIdx3.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1217"), {title : oBundleText.getText("LABEL_0053")});	// 1217:교통수단을 선택하여 주십시오.
			return;
	    }
		
	    var vSelectedData1 = oDialogTable1.getModel().getProperty(oDialogTable1.getContextByIndex(vIdx1[0]).sPath),
		vSelectedData2 = oDialogTable2.getModel().getProperty(oDialogTable2.getContextByIndex(vIdx2[0]).sPath),
		vSelectedData3 = oDialogTable3.getModel().getProperty(oDialogTable3.getContextByIndex(vIdx3[0]).sPath);
		
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Slo", vSelectedData1.Blocd );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Slotx", vSelectedData1.Blotx );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Elo", vSelectedData2.Blocd );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Elotx", vSelectedData2.Blotx );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Trf", vSelectedData3.Trf );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Trftx", vSelectedData3.Trftx );
		
		oController._DepatureDialog.close();
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController, isDelHstyp) {
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			orgData = oController._DetailJSonModel.getProperty("/Data"),
			vData = { Data : { Appernr : orgData.Appernr , Appno : orgData.Appno ,
							   Pernr : orgData.Pernr , ZappStatAl : orgData.ZappStatAl,
							   Persa : orgData.Persa , Encid : orgData.Encid
			}};
		
		oController._DetailJSonModel.setData(vData);
		oController._DetailTableJSonModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
	},	
	
	onAfterSelectPernr : function(oController) {
		// 법인카드 Clear
		common.CCSInformation.onInit();
		// Data Clear
		oController.onResetDetail(oController);
	},
	
	onAfterBizCard : function(oController){
		var oCCSDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_CCSDetailTable");
		var vCCSDatas =  oCCSDetailTable.getModel().getProperty("/Data");
		
		var vActu1 = 0, vActu2 = 0, vActu3 = 0, vActu4 = 0;
		vCCSDatas.forEach(function(element){
				if(element.Mergetype == "01")   vActu1 += element.Amount * 1 ;  // 교통비
				else if(element.Mergetype == "02")   vActu2 += element.Amount * 1 ; // 일당
				else if(element.Mergetype == "03")   vActu3 += element.Amount * 1 ; // 숙박비
			}
		);
		vActu4 = vActu1 + vActu2 + vActu3 ;
//
		oController._DetailJSonModel.setProperty("/Data/BscstC", common.Common.numberWithCommas(vActu2));
		oController._DetailJSonModel.setProperty("/Data/HtcstC", common.Common.numberWithCommas(vActu3));
		oController._DetailJSonModel.setProperty("/Data/TrcstC", common.Common.numberWithCommas(vActu1));
		oController._DetailJSonModel.setProperty("/Data/TlcstC", common.Common.numberWithCommas(vActu4));
		
		oController.onCalculateTotal(oController);
	},
	
	onInitBizCard : function(oController){

	},
	
	// 금액 직접 변경
	onChangeMoney : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    oController = oView.getController();
		oController.onCalculateTotal(oController);
		common.Common.onChangeMoneyInput(oEvent);
	},
	
	onCalculateTotal : function(oController){
		var vData = oController._DetailJSonModel.getProperty("/Data"),
		vTotalBscst = 0, vTotalHtcst = 0, vTotalTrcst = 0, vTotalTlcst = 0;
		// 총신청 금액 (지급 신청+ 현금 )
		vData.TrcstT = common.Common.numberWithCommas(common.Common.removeComma(vData.TrcstR) * 1  + common.Common.removeComma(vData.TrcstH) * 1); // 교통비 
		vData.BscstT = common.Common.numberWithCommas(common.Common.removeComma(vData.BscstR) * 1  + common.Common.removeComma(vData.BscstH) * 1); // 일당
		vData.HtcstT = common.Common.numberWithCommas(common.Common.removeComma(vData.HtcstR) * 1  + common.Common.removeComma(vData.HtcstH) * 1); // 숙박비 
		
		//정산액 (총신청 금액 - 가불액 )
		vData.TrcstA = common.Common.numberWithCommas(common.Common.removeComma(vData.TrcstT) * 1  - common.Common.removeComma(vData.TrcstG) * 1); // 교통비 
		vData.BscstA = common.Common.numberWithCommas(common.Common.removeComma(vData.BscstT) * 1  - common.Common.removeComma(vData.BscstG) * 1); // 일당
		vData.HtcstA = common.Common.numberWithCommas(common.Common.removeComma(vData.HtcstT) * 1  - common.Common.removeComma(vData.HtcstG) * 1); // 숙박비 
		
		// 정산액계
		vData.TlcstG = common.Common.removeComma(vData.TrcstG) * 1  + common.Common.removeComma(vData.BscstG) * 1 + common.Common.removeComma(vData.HtcstG) * 1 ; // 가불액 
		vData.TlcstT = common.Common.removeComma(vData.TrcstT) * 1  + common.Common.removeComma(vData.BscstT) * 1 + common.Common.removeComma(vData.HtcstT) * 1 ; // 총신청금액 
		vData.TlcstR = common.Common.removeComma(vData.TrcstR) * 1  + common.Common.removeComma(vData.BscstR) * 1 + common.Common.removeComma(vData.HtcstR) * 1 ; // 총신청금액 
		vData.TlcstC = common.Common.removeComma(vData.TrcstC) * 1  + common.Common.removeComma(vData.BscstC) * 1 + common.Common.removeComma(vData.HtcstC) * 1 ; // 총신청금액 
		vData.TlcstH = common.Common.removeComma(vData.TrcstH) * 1  + common.Common.removeComma(vData.BscstH) * 1 + common.Common.removeComma(vData.HtcstH) * 1 ; // 총신청금액 
		vData.TlcstA = common.Common.removeComma(vData.TrcstA) * 1  + common.Common.removeComma(vData.BscstA) * 1 + common.Common.removeComma(vData.HtcstA) * 1 ; // 총신청금액 
		
		vData.TlcstG = common.Common.numberWithCommas(vData.TlcstG);
		vData.TlcstT = common.Common.numberWithCommas(vData.TlcstT);
		vData.TlcstR = common.Common.numberWithCommas(vData.TlcstR);
		vData.TlcstC = common.Common.numberWithCommas(vData.TlcstC);
		vData.TlcstH = common.Common.numberWithCommas(vData.TlcstH);
		vData.TlcstA = common.Common.numberWithCommas(vData.TlcstA);
		
		oController._DetailJSonModel.setProperty("/Data", vData);
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
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
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "BusitripIntAppl", oneData));
			
			createData.Begtr = (createData.Begtr) ? "\/Date("+ common.Common.getTime(createData.Begtr)+")\/" : undefined;
			createData.Endtr = (createData.Endtr) ? "\/Date("+ common.Common.getTime(createData.Endtr)+")\/" : undefined;
			createData.Begtr2 = (createData.Begtr2) ? "\/Date("+ common.Common.getTime(createData.Begtr2)+")\/" : undefined;
			createData.Endtr2 = (createData.Endtr2) ? "\/Date("+ common.Common.getTime(createData.Endtr2)+")\/" : undefined;
			createData.Prcty = vPrcty;
			createData.ZreqForm = oController._vZworktyp;
			createData.Waers = "KRW";
			createData.Edday = common.Common.checkNull(createData.Edday) == true ? "0" : createData.Edday;
			createData.Wkday = common.Common.checkNull(createData.Wkday) == true ? "0" : createData.Wkday;
			
			delete createData.Hour;
			delete createData.Minute;
			//교통비
			createData.TrcstG = common.Common.removeComma(createData.TrcstG);
			createData.TrcstR = common.Common.removeComma(createData.TrcstR);
			createData.TrcstC = common.Common.removeComma(createData.TrcstC);
			createData.TrcstH = common.Common.removeComma(createData.TrcstH);
			//일당
			createData.BscstG = common.Common.removeComma(createData.BscstG);
			createData.BscstR = common.Common.removeComma(createData.BscstR);
			createData.BscstC = common.Common.removeComma(createData.BscstC);
			createData.BscstH = common.Common.removeComma(createData.BscstH);
			//숙박비
			createData.HtcstG = common.Common.removeComma(createData.HtcstG);
			createData.HtcstR = common.Common.removeComma(createData.HtcstR);
			createData.HtcstC = common.Common.removeComma(createData.HtcstC);
			createData.HtcstH = common.Common.removeComma(createData.HtcstH);
			//정산액계
			createData.TlcstG = common.Common.removeComma(createData.TlcstG);
			createData.TlcstR = common.Common.removeComma(createData.TlcstR);
			createData.TlcstC = common.Common.removeComma(createData.TlcstC);
			createData.TlcstH = common.Common.removeComma(createData.TlcstH);
			
			
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			var oTableData = [];
			for(var i = 0; i < vTableData.length; i++){
				var vTemp = {};
				Object.assign(vTemp, common.Common.copyByMetadata(oModel, "BusitripIntDetail", vTableData[i]));
				oTableData.push(vTemp);
			}
			createData.DetailNav = oTableData; 
			
			oModel.create("/BusitripIntApplSet", createData, {
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
		if(common.Common.checkDate(oneData.Begtr, oneData.Endtr) == false) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1221"), {title : oBundleText.getText("LABEL_0053")});	// 1221:시작일자가 종료일자보다 큽니다.
			return false ;
		}
		// 숙박비 비교
		if(common.Common.removeComma(oneData.HtcstR) * 1 > common.Common.removeComma(oneData.HtcstC) * 1 ){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1281"), {title : oBundleText.getText("LABEL_0053")});	// 1281:[숙박비] 지급신청 총액이 실사용액을 초과하였습니다.
			return false ;
		}
		    
		// 교통비 비교
		if(common.Common.removeComma(oneData.TrcstR) * 1 > common.Common.removeComma(oneData.TrcstC) * 1 ){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1282"), {title : oBundleText.getText("LABEL_0053")});	// 1282:[교통비] 지급신청 총액이 실사용액을 초과하였습니다.
			return false ;
		}
		
		if(common.Common.checkNull(oneData.Busin)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1223"), {title : oBundleText.getText("LABEL_0053")});	// 1223:용무를 입력하여 주십시오.
			return false ;
		}
		if(common.Common.checkNull(oneData.Aufnr)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2670")  , {title : oBundleText.getText("LABEL_0053")});	// 2670:Activity 를 입력하여 주십시오
			return false ;
		}
		if(common.Common.checkNull(oneData.Budge)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2859")  , {title : oBundleText.getText("LABEL_0053")});	// 2859:예산구분 입력하여 주십시오
			return false ;
		}
		if(common.Common.checkNull(oneData.Pyrsn)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2860")  , {title : oBundleText.getText("LABEL_0053")});	// 2860:정산내역을 입력하여 주십시오
			return false ;
		}
		
		
		
		var vDate1 ;
		if(common.Common.checkNull(oneData.Endtr)){
			vDate1 = common.Common.calDate(oneData.Endtr2, oneData.Begtr2 );
		}else{
			vDate1 = common.Common.calDate(oneData.Endtr, oneData.Begtr );
		}
		
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data"),
		vDate2 = 0; 
		
		if(common.Common.checkNull(vTableData)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0119"), {title : oBundleText.getText("LABEL_0053")});	// 0119:상세내역을 입력하여 주십시오.
			return false;
		}
		
		for(var i = 0; i < vTableData.length; i++){
			vDate2 += common.Common.checkNull(vTableData[i].Day) ? 0 : vTableData[i].Day * 1 ;
			
			if(common.Common.checkNull(vTableData[i].Pah)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2855"), {title : oBundleText.getText("LABEL_0053")});	// 2855:경로를 입력하여 주십시오.
				return false;
			}
			if(common.Common.checkNull(vTableData[i].Slo)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1215"), {title : oBundleText.getText("LABEL_0053")});	// 1215:출발지를 선택하여 주십시오.
				return false;
			}
			if(common.Common.checkNull(vTableData[i].Elo)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1216"), {title : oBundleText.getText("LABEL_0053")});	// 1216:도착지를 선택하여 주십시오.
				return false;
			}
			if(common.Common.checkNull(vTableData[i].Trf)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1217"), {title : oBundleText.getText("LABEL_0053")});	// 1217:교통수단을 선택하여 주십시오.
				return false;
			}
			if(common.Common.checkNull(vTableData[i].Acc)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2856"), {title : oBundleText.getText("LABEL_0053")});	// 2856:숙박시설을 선택하여 주십시오.
				return false;
			}
			if(vTableData[i].Day == undefined || vTableData[i].Day == null || vTableData[i].Day == ""){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2861"), {title : oBundleText.getText("LABEL_0053")});	// 2861:숙박일을 입력하여 주십시오.
				return false;
			}
		}
		
		//출장 기간 보다 숙박일은 동일하거나 커야 한다.
		if(vDate1 < vDate2 ) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1238"), {title : oBundleText.getText("LABEL_0053")});	// 1238:출장기간과 숙박일수가 다릅니다.
			return false ;
		}
		
		if(vPrcty == "C") {
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV");
				
				oModel.remove("/BusitripIntApplSet(Appno='" + oController._vAppno + "')", {
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

	onChangeBudge : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    oController = oView.getController();
		oController.onSearchWork(oController);
		
	},
	
	onSearchWork : function(oController) {
		var vData = oController._DetailJSonModel.getProperty("/Data"),
		 	vKospostxT = "",
		    vKospostx = "",
		    vSchkztxLong = "" ,
		    vSchkz = "",
		    vKostl = "",
		    vPosid = "",		    
		    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV");
		
		if(!common.Common.checkNull(vData.Begtr) && !common.Common.checkNull(vData.Endtr) &&
			!common.Common.checkNull(vData.Budge)){
			
			aFilters = [];
			
			aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, "3"));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vData.Encid));
			aFilters.push(new sap.ui.model.Filter('Budge', sap.ui.model.FilterOperator.EQ, vData.Budge));
			aFilters.push(new sap.ui.model.Filter('Begtr', sap.ui.model.FilterOperator.EQ, vData.Begtr));
			aFilters.push(new sap.ui.model.Filter('Endtr', sap.ui.model.FilterOperator.EQ, vData.Endtr));
			
			oModel.read("/CostWbsSchkzSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						vKospostxT = data.results[0].KospostxT ;
						vKospostx = data.results[0].Kospostx ;
					    vSchkztxLong = data.results[0].SchkztxLong ;
					    vSchkz = data.results[0].Schkz ;
					    vKostl = data.results[0].Kostl ;
					    vPosid = data.results[0].Posid ;
					}
				},
				error : function(Res) {
					
				}
			});
		}
		oController._DetailJSonModel.setProperty("/Data/KospostxT", vKospostxT);
		oController._DetailJSonModel.setProperty("/Data/Kospostx", vKospostx);
		oController._DetailJSonModel.setProperty("/Data/SchkztxLong", vSchkztxLong);
		oController._DetailJSonModel.setProperty("/Data/Schkz", vSchkz);
		oController._DetailJSonModel.setProperty("/Data/Kostl", vKostl);
		oController._DetailJSonModel.setProperty("/Data/Posid", vPosid);
	},
	
	openHistoryDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._HistoryDialog) {
			oController._HistoryDialog = sap.ui.jsfragment("ZUI5_HR_OverseaBTripCal.fragment.ApplyHistory", oController);
			oView.addDependent(oController._HistoryDialog);
		}
		
		var oBegtr = sap.ui.getCore().byId(oController.PAGEID + "_HistoryBegtr"),
		oEndtr = sap.ui.getCore().byId(oController.PAGEID + "_HistoryEndtr");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var fromDate = new Date(curDate.getFullYear(), 0 , 1);
		var toDate = new Date(curDate.getFullYear(), 11 , 31);
		
		oBegtr.setValue(dateFormat.format(fromDate));
		oEndtr.setValue(dateFormat.format(toDate));
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		oTable.clearSelection();
		oController.onPressSearchHistory();
		oController._HistoryDialog.open();
	},
	
	onPressSearchHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		oHistoryTableModel = oTable.getModel();
		var oBegtr = sap.ui.getCore().byId(oController.PAGEID + "_HistoryBegtr"),
		oEndtr = sap.ui.getCore().byId(oController.PAGEID + "_HistoryEndtr");
		
		if(common.Common.checkNull(oBegtr.getDateValue()) || common.Common.checkNull(oEndtr.getDateValue())){
			sap.m.MessageBox.alert("검색일자를 입력하여 주십시오", 
					{title : oBundleText.getText("LABEL_0053")});
			return;
		}
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")),
			new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, "3"),
			new sap.ui.model.Filter('Begtr', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(oBegtr.getDateValue())),
			new sap.ui.model.Filter('Endtr', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(oEndtr.getDateValue()))
		];
		
		
		var vData = { Data : []}, errData = {},
			oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		var onProcess = function(){
			oModel.read("/BusiTripReqListSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						data.results[i].Begtr = dateFormat.format(new Date(common.Common.setTime(data.results[i].Begtr)));
						data.results[i].Endtr = dateFormat.format(new Date(common.Common.setTime(data.results[i].Endtr)));
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
			oController._HistoryDialog.open();
		}
		oController.BusyDialog.open();		
		setTimeout(onProcess, 100);
	},
	
	onSelectHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail"),
	    	oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
		    oModel = oTable.getModel(),
		    vResult = oModel.getProperty("/Data"),
			vIdx = oTable.getSelectedIndices(),
			vData = oController._DetailJSonModel.getProperty("/Data"),
		    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		if(vIdx.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1283"));	// 1283:출장비 신청할 신청건을  선택하여 주십시오.
			return;
		}
		
		if(vIdx.length > 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0370"));	// 370:한건만 선택하여 주세요.
			return;
		}

		var vSelectedData = oModel.getProperty("/Data/" + vIdx[0]);
		
		vData.Begtr = vSelectedData.Begtr; // 변경기간
		vData.Endtr = vSelectedData.Endtr; // 변경기간
		vData.Begtr2 = vSelectedData.Begtr; // 기간
		vData.Endtr2 = vSelectedData.Endtr; // 기간
		vData.Budge = vSelectedData.Budge; // 예산구분
		vData.Kospostx = vSelectedData.Kospostx; // Cost Center/WBS
		vData.KospostxT = vSelectedData.KospostxT; // Cost Center/WBS
		vData.Kostl = vSelectedData.Kostl; // Cost Center/WBS
		vData.Posid = vSelectedData.Posid; // Cost Center/WBS
		vData.Aufnr = vSelectedData.Aufnr; // Activity
		vData.Aufnrtx = vSelectedData.Aufnrtx; // Activity
		vData.Busin = vSelectedData.Busin; // 용무
		vData.Zbigo = vSelectedData.Zbigo; // 비고	
		vData.Docno2 = vSelectedData.Docno; // 결재번호	
		vData.Edflg = vSelectedData.Edflg; // Education Flag
		vData.Edday = vSelectedData.Edday; // Education Days
		vData.Wkflg = vSelectedData.Wkflg; // Business Flag
		vData.Wkday = vSelectedData.Wkday; // Business Days
		
		vData.BscstG = common.Common.numberWithCommas(vSelectedData.BscstG); // 일비_가불액	
		vData.HtcstG = common.Common.numberWithCommas(vSelectedData.HtcstG); // 현금_가불액	
		vData.TrcstG = common.Common.numberWithCommas(vSelectedData.TrcstG); // 교통비_가불액	
		vData.TlcstG = common.Common.numberWithCommas(vSelectedData.TlcstG); // 합계_가불액	
		
		oController._DetailJSonModel.setProperty("/Data", vData);
		
		oController.onCalculateTotal(oController);
		
		// 상세내역 Table 조회
		oController.onSearchDetailTable(oController, vData);
	},
	
	onSearchDetailTable : function(oController, vData) {
		if(common.Common.checkNull(vData)) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel();
		
		oModel.read("/BusitripIntDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Docno', sap.ui.model.FilterOperator.EQ, vData.Docno2),
				new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, "3")
			],
			success : function(data, res) {
				if(data && data.results){
					for(var i = 0; i < data.results.length; i++){
						data.results[i].ZappStatAl = vData.ZappStatAl;
						data.results[i].Idx = i + 1;
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
					oController._HistoryDialog.close();
				}
			});
			return ;
		}
		
		oJSonModel.setData(oTableData);
		oTable.setVisibleRowCount(oTableData.Data.length);
		oController._HistoryDialog.close();
	}
});
