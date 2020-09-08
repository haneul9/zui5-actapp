jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail", {
	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail
	 */

	PAGEID : "ZUI5_HR_OverseaBTripDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "HR08",
	BusyDialog : new sap.m.BusyDialog(),
	_vLangu : "E",
	_vIndex : "",
	
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
		// 신청안내 추가 구성
//		this.onSetApplyInformation();
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
		common.MandateAction.oController = oController;
		
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
		
		if(oDetailData.Data.ZappStatAl == ''){
			if(_gAuth =="E"){
				oController.setDefaultBudge(oController);
				oController._DetailJSonModel.setProperty("/Mlind",1);
				oController._DetailJSonModel.setProperty("/Fixsc",1);
			}
		}
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "Approval Line"}).addStyleClass("L2PFontFamilyBold")
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
	
//	onSetApplyInformation : function(oController){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
//			oController = oView.getController(),
//			oNoticePanel = sap.ui.getCore().byId(oController.PAGEID + "_NoticePanel");
//		
//		oNoticePanel.addContent( new sap.m.Button({
//			text: oBundleText.getText("LABEL_1235"),	// 1235:해외출장 매뉴얼
//			icon : "sap-icon://search",
//			type : sap.m.ButtonType.Default,
//			press : function(){
//				var vUrl = "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/ZUI5_HR_OverseaBTrip/files/bsi_bizt_070.pdf"
//					window.open(vUrl);
//			}
//		}).addStyleClass("L2PFontFamily"));
//	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail");
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/BusitripIntApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "D"),
				new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu)
			],
			success : function(data, res) {
				if(data && data.results.length > 0){
					oDetailData.Data = data.results[0];
					oDetailData.Data.Begtr = dateFormat.format(new Date(common.Common.setTime(data.results[0].Begtr)));
					oDetailData.Data.Endtr = dateFormat.format(new Date(common.Common.setTime(data.results[0].Endtr)));
					oDetailData.Data.Mlind = oDetailData.Data.Mlind == "Y" ? 0 : 1 ;
					oDetailData.Data.Fixsc = oDetailData.Data.Fixsc == "Y" ? 0 : 1 ;
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel();
		
		oModel.read("/BusitripIntDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu)
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV"),
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
			oDetailTitle.setText(oBundleText.getText("LABEL_1234") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1234:해외출장명령 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_1234") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1234:해외출장명령 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_1234") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1234:해외출장명령 신청
		}
	},
	
	// 공장 인 경우 Activity 를 지정 (Read only)
	setFactoryActivity : function(oController){
		var vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
//		if(vPersa == "7000"){
//			oController._DetailJSonModel.setProperty("/Data/Aufnr","1102519008");
//			oController._DetailJSonModel.setProperty("/Data/Aufnrtx","8. Provide best-in-class work environmen");
			var vAufnr = common.Common.onSearchDefaultAufnr(oController, oController._DetailJSonModel.getProperty("/Data/Begtr"));
			if(Array.isArray(vAufnr) &&  vAufnr.length == 2){
				oController._DetailJSonModel.setProperty("/Data/Aufnr",vAufnr[0]);
				oController._DetailJSonModel.setProperty("/Data/Aufnrtx",vAufnr[1]);
			}else{
				oController._DetailJSonModel.setProperty("/Data/Aufnr","");
				oController._DetailJSonModel.setProperty("/Data/Aufnrtx","");
			}
//		}
	},
	
	// Default 예산구분을 조회
	setDefaultBudge : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV"),
		errData = {};
//		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		if(!common.Common.checkNull(vEncid)){
			oModel.read("/PerBudgeDefSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				],
				success : function(data, res) {
					if(data.results && data.results.length){
						oController._DetailJSonModel.setProperty("/Data/Budge", data.results[0].Budge );
						oController._DetailJSonModel.setProperty("/Data/Kospos", data.results[0].Kospos );
						oController._DetailJSonModel.setProperty("/Data/Kospostx", data.results[0].Kospostx );
						oController._DetailJSonModel.setProperty("/Data/KospostxT", data.results[0].KospostxT );
					}					
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
					oController._DetailJSonModel.setProperty("/Data/Budge", "" );
					oController._DetailJSonModel.setProperty("/Data/Kospos", "" );
					oController._DetailJSonModel.setProperty("/Data/Kospostx", "" );
					oController._DetailJSonModel.setProperty("/Data/KospostxT", "" );
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
	},
	
	// 추가
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
	    oController = oView.getController(),
	    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
	    oJSonModel = oTable.getModel(),
		oControl = sap.ui.getCore().byId(oEvent.getSource().getId());
		
		oJSonModel.setData({Data:[]});
		oTable.setVisibleRowCount(1);
		oControl.setSelected(false);
	},
	
	onPressDelete : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
	    oController = oView.getController();
		var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
	    oDialogTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable2"),
	    oDialogTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable3");
		
		if(!oController._DepatureDialog) {
			oController._DepatureDialog = sap.ui.jsfragment("ZUI5_HR_OverseaBTrip.fragment.DepatureDialog", oController);
			oView.addDependent(oController._DepatureDialog);
		}
		
		var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
		oDialogTable1Model = oDialogTable1.getModel(),
		oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV"),
		vData1 = { Data : []},
		vData2 = { Data : []},
		aFilters = [],
		oneData = {};
		aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu));
		aFilters.push(new sap.ui.model.Filter('Ovryn', sap.ui.model.FilterOperator.EQ, 2));
		
		
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
		aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu));
		
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
	    
		oDialogTable1.clearSelection();
		oDialogTable2.clearSelection();
		oDialogTable3.clearSelection();
	    
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
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
		var detailData = oController._DetailJSonModel.getProperty("/Data"),
		     oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		
		delete detailData.KospostxT;		// CostCenter / WBS 명
		delete detailData.Kospostx;		// CostCenter / WBS 명
		delete detailData.Kostl;		// CostCenter
		delete detailData.Posid;		// WBS
		delete detailData.SchkztxLong;		// 근무조
		delete detailData.Schkz;		// 근무조 코드
		delete detailData.Budge ; //예산구분
		delete detailData.Busin ; //용무
		delete detailData.Begtr ; //시작일
		delete detailData.Endtr ; //시작일
		delete detailData.Hour ; // 시간
		delete detailData.Minute; // 분
		delete detailData.Aufnr ;  // Activity
		delete detailData.Aufnrtx; // Activity
		delete detailData.Zbigo; // 비고
		detailData.Mlind = 1;
		detailData.Fixsc = 1;
		oController._DetailJSonModel.setProperty("/Data", detailData);
		oController._DetailTableJSonModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
	},	
	
	onAfterSelectPernr : function(oController) {
		if(oController._MandateDialog && oController._MandateDialog.isOpen()){
			
		}else{
			// Data Clear
			oController.onResetDetail(oController);
//			oController.setFactoryActivity(oController);
			oController.setDefaultBudge(oController);
		}
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
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
			var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "BusitripIntAppl", oneData));
			
			createData.Begtr = (createData.Begtr) ? "\/Date("+ common.Common.getTime(createData.Begtr)+")\/" : undefined;
			createData.Endtr = (createData.Endtr) ? "\/Date("+ common.Common.getTime(createData.Endtr)+")\/" : undefined;
			createData.Prcty = vPrcty;
			createData.Langu = oController._vLangu;
			createData.Subty = "1";
			createData.ZreqForm = oController._vZworktyp;
			createData.Mlind = createData.Mlind == 0 ? "Y" : "N";
			createData.Fixsc = createData.Fixsc == 0 ? "Y" : "N";
			createData.Edday = common.Common.checkNull(createData.Edday) == true ? "0" : createData.Edday;
			createData.Wkday = common.Common.checkNull(createData.Wkday) == true ? "0" : createData.Wkday;
			
			
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
		if(common.Common.checkNull(oneData.Begtr)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1219"), {title : oBundleText.getText("LABEL_0053")});	// 1219:시작일자를 입력하여 주십시오.
			return false ;
		}
		if(common.Common.checkNull(oneData.Endtr)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1220"), {title : oBundleText.getText("LABEL_0053")});	// 1220:종료일자를 입력하여 주십시오.
			return false ;
		}
		if(common.Common.checkDate(oneData.Begtr, oneData.Endtr) == false) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1221"), {title : oBundleText.getText("LABEL_0053")});	// 1221:시작일자가 종료일자보다 큽니다.
			return false ;
		}
		if((common.Common.checkNull(oneData.Edday) || oneData.Edday * 1 == 0) && (common.Common.checkNull(oneData.Wkday) || oneData.Wkday * 1 == 0)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1237"), {title : oBundleText.getText("LABEL_0053")});	// 1237:출장 목적(교육 or 업무) 과 일수를 입력하세요.
			//"Please enter the days for Training or Business."
			return false;
		}
		if(common.Common.checkNull(oneData.Aufnr)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2670"), {title : oBundleText.getText("LABEL_0053")});	// 2670:Activity를 입력하여 주십시오.
			return false ;
		}
		
		if(oneData.Mlind == undefined || oneData.Mlind == null){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2671"), {title : oBundleText.getText("LABEL_0053")});	// 2671:Meals to be Provided를 입력하여 주십시오.
			return false ;
		}
		if(oneData.Fixsc == undefined || oneData.Fixsc == null){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_3018"), {title : oBundleText.getText("LABEL_0053")});	// 3018:Fixed Schedule 를 입력하여 주십시오.
			return false ;
		}
		if(common.Common.checkNull(oneData.Busin)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2672"), {title : oBundleText.getText("LABEL_0053")});	// 2670:Purpose를 입력하여 주십시오.
			return false ;
		}
		if(common.Common.checkNull(oneData.Budge)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2673"), {title : oBundleText.getText("LABEL_0053")});	// 2673:Budget을 입력하여 주십시오.
			return false ;
		}
		if(common.Common.checkNull(oneData.Aufnr)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2670")  , {title : oBundleText.getText("LABEL_0053")});	// 2670:Activity 를 입력하여 주십시오
			return false ;
		}
		
		var vDate1 = common.Common.calDate(oneData.Endtr, oneData.Begtr );
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data"),
		vDate2 = 0; 
		
		if(common.Common.checkNull(vTableData)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2862"), {title : oBundleText.getText("LABEL_0053")});	// 2862:Schedule을 입력하여 주십시오.
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV");
				
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
	
	onChangeDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
		    oController = oView.getController(),
		    vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(vData.Begtr) || common.Common.checkNull(vData.Endtr) || vData.Begtr != vData.Endtr ){
			oController._DetailJSonModel.setProperty("/Data/Hour","");
			oController._DetailJSonModel.setProperty("/Data/Minute","");
		}
		oController.onSearchWork(oController);
	},
	
	
	
	onChangeBudge : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail"),
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
		    oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV");
		
		if(!common.Common.checkNull(vData.Begtr) && !common.Common.checkNull(vData.Endtr) &&
			!common.Common.checkNull(vData.Budge)){
			
			aFilters = [];
			
			aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vData.Encid));
			aFilters.push(new sap.ui.model.Filter('Budge', sap.ui.model.FilterOperator.EQ, vData.Budge));
			aFilters.push(new sap.ui.model.Filter('Begtr', sap.ui.model.FilterOperator.EQ, vData.Begtr));
			aFilters.push(new sap.ui.model.Filter('Endtr', sap.ui.model.FilterOperator.EQ, vData.Endtr));
			
			oModel.read("/CostWbsSchkzSet", {
				async : false,
				filters : aFilters,
				success : function(data, res) {
					if(data.results && data.results.length) {
						vKospostx = data.results[0].Kospostx ;
						vKospostxT = data.results[0].KospostxT ;
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
});
