jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail", {
	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail
	 */

	PAGEID : "ZUI5_HR_DomesticBTripChangeDetail",
	
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
	_vZworktyp : "HR06",
	BusyDialog : new sap.m.BusyDialog(),
	_vLangu : "",
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
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vPernr = "",
			vFromPageId = "",
			oDetailData = {Data : {}},
			vApplyType = "";
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno || '';
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
			oController._vLangu = oEvent.data.Langu;
			oController._vZworktyp = oEvent.data.ZreqForm;
			if(oController._vAppno == ""){
				if(oController._vLangu == "3") oController._vZworktyp = "HR06";
				else if(oController._vLangu == "E") oController._vZworktyp = "HR07";
			}else{
				if(oController._vZworktyp == "HR06") oController._vLangu = "3";
				else if(oController._vZworktyp == "HR07") oController._vLangu = "E";
			}
			
			_gZworktyp = oController._vZworktyp;
		}
		oController._vFromPage = vFromPageId;
		
		// ReqAuth 값 조회하기
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vLoginData = common.Common.getEmpLoginInfo(_gAuth, _gZworktyp);
		
		vEmpLoginInfo[0].ReqAuth = vLoginData.ReqAuth;
		gReqAuth = vLoginData.ReqAuth || "1";
		
		var	oPage = sap.ui.getCore().byId(oController.PAGEID + "_PAGE");
		oPage.destroyContent();
		oPage.addContent(sap.ui.jsfragment("ZUI5_HR_DomesticBTripChange.fragment.DomesticBTripChangePage02",oController));
		
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
		oController.retrieveDetailTable(oController, oDetailData.Data.ZappStatAl, oDetailData.Data.Newyn);
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
		// 시/분 계산
		oController.onChangeTime(oController);
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("L2PFontFamily")	// 결재선
				}).addStyleClass("L2PMatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Text({
								text : "{ApprEnames}"
							}).addStyleClass("L2PFontFamily")
						]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail");
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/BusitripDomApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "D"),
			],
			success : function(data, res) {
				if(data && data.results.length > 0){
					oDetailData.Data = data.results[0];
					oDetailData.Data.Begtr = dateFormat.format(new Date(common.Common.setTime(data.results[0].Begtr)));
					oDetailData.Data.Endtr = dateFormat.format(new Date(common.Common.setTime(data.results[0].Endtr)));
					oDetailData.Data.Begtr2 = dateFormat.format(new Date(common.Common.setTime(data.results[0].Begtr2)));
					oDetailData.Data.Endtr2 = dateFormat.format(new Date(common.Common.setTime(data.results[0].Endtr2)));
					oDetailData.Data.Beguz = oDetailData.Data.Beguz * 1 == 0? "" : oDetailData.Data.Beguz.substring(0,4);
					oDetailData.Data.Enduz = oDetailData.Data.Enduz * 1 == 0? "" : oDetailData.Data.Enduz.substring(0,4);
					oDetailData.Data.Beguz2 = oDetailData.Data.Beguz2 * 1 == 0? "" : oDetailData.Data.Beguz2.substring(0,4);
					oDetailData.Data.Enduz2 = oDetailData.Data.Enduz2 * 1 == 0? "" : oDetailData.Data.Enduz2.substring(0,4);
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
	
	retrieveDetailTable : function(oController, vZappStatAl, vNewyn) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel();
		
		oModel.read("/BusitripDomDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno)
			],
			success : function(data, res) {
				if(data && data.results){
					for(var i = 0; i < data.results.length; i++){
						data.results[i].ZappStatAl = vZappStatAl;
						data.results[i].Newyn = vNewyn;
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV"),
			errData = {};
		
		oModel.read("/BusitripDomApplSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_1225") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1225:국내출장명령 변경/취소 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_1225") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1225:국내출장명령 변경/취소 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_1225") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1225:국내출장명령 변경/취소 신청
		}
	},
	
	// 추가
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
		    oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
		    oTableData = oJSonModel.getProperty("/Data");
		
		if(oTableData.length > 6){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2893"), 
					{title : oBundleText.getText("LABEL_0053")});	// 2893=최대 7건만 등록이 가능합니다.
			return;
		}
		
		var vData = { Idx : oTableData.length + 1, ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl"),
				      Newyn : oController._DetailJSonModel.getProperty("/Data/Newyn"),Day : '0'};
		oTableData.push(vData);
		
		oController._DetailTableJSonModel.setData({Data : oTableData});
		oTable.setVisibleRowCount(oTableData.length);
	},
	
	onPressDeleteAll : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
	    oController = oView.getController(),
	    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
	    oJSonModel = oTable.getModel(),
		oControl = sap.ui.getCore().byId(oEvent.getSource().getId());
		
		oJSonModel.setData({Data:[]});
		oTable.setVisibleRowCount(1);
		oControl.setSelected(false);
	},
	
	onPressDelete : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
	    oController = oView.getController();
		var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
	    oDialogTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable2"),
	    oDialogTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable3");
		
		if(!oController._DepatureDialog) {
			oController._DepatureDialog = sap.ui.jsfragment("ZUI5_HR_DomesticBTripChange.fragment.DepatureDialog", oController);
			oView.addDependent(oController._DepatureDialog);
		}
		
		var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
	    oDialogTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable2"),
	    oDialogTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable3");
		
		var oDialogTable1Model = oDialogTable1.getModel(),
		oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV"),
		vData1 = { Data : []},
		vData2 = { Data : []},
		aFilters = [],
		oneData = {};
		aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu));
		
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
		
		var oDialogTable2Model = oDialogTable2.getModel();
		oDialogTable2Model.setData(vData2);
		
		var oDialogTable3Model = oDialogTable3.getModel(),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
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
		
		if(vSelectedData1.Btgrp != "" && vSelectedData1.Btgrp == vSelectedData2.Btgrp){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1218"), {title : oBundleText.getText("LABEL_0053")});	// 1218:동일한 구역내 이동은 출장으로 인정되지 않습니다.
			return;
		}
		
		if(vSelectedData1.Blocd == vSelectedData2.Blocd){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1218"), {title : oBundleText.getText("LABEL_0053")});	// 1218:동일한 구역내 이동은 출장으로 인정되지 않습니다.
			return;
		}

		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Slo", vSelectedData1.Blocd );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Slotx", vSelectedData1.Blotx );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Elo", vSelectedData2.Blocd );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Elotx", vSelectedData2.Blotx );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Trf", vSelectedData3.Trf );
		oController._DetailTableJSonModel.setProperty(oController._vIndex + "/Trftx", vSelectedData3.Trftx );
		
		oController._DepatureDialog.close();
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController) {
		var orgData = oController._DetailJSonModel.getProperty("/Data");
		var vData = { Data : { Appernr : orgData.Appernr , Appno : orgData.Appno ,
							   Pernr : orgData.Pernr , ZappStatAl : orgData.ZappStatAl
		}};
		
		oController._DetailJSonModel.setData(vData);
		
		oController._DetailTableJSonModel.setData({Data : []});
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		oDetailTable.setVisibleRowCount(1);
	},	
	
	onAfterSelectPernr : function(oController) {
		if(oController._MandateDialog && oController._MandateDialog.isOpen()){
			
		}else{
			// Data Clear
			oController.onResetDetail(oController);
		}
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
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
			var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "BusitripDomAppl", oneData));
			
			createData.Begtr = (createData.Begtr) ? "\/Date("+ common.Common.getTime(createData.Begtr)+")\/" : undefined;
			createData.Endtr = (createData.Endtr) ? "\/Date("+ common.Common.getTime(createData.Endtr)+")\/" : undefined;
			createData.Begtr2 = (createData.Begtr2) ? "\/Date("+ common.Common.getTime(createData.Begtr2)+")\/" : undefined;
			createData.Endtr2 = (createData.Endtr2) ? "\/Date("+ common.Common.getTime(createData.Endtr2)+")\/" : undefined;
			createData.Prcty = vPrcty;
			createData.Hour = "" + createData.Hour; 
			createData.Minute = "" + createData.Minute; 
			createData.Hour2 = "" + createData.Hour2; 
			createData.Minute2 = "" + createData.Minute2; 
			createData.Langu = oController._vLangu;
			createData.Subty = "2";
			createData.ZreqForm = oController._vZworktyp;
			
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			var oTableData = [];
			for(var i = 0; i < vTableData.length; i++){
				var vTemp = {};
				Object.assign(vTemp, common.Common.copyByMetadata(oModel, "BusitripDomDetail", vTableData[i]));
				vTemp.Day = vTemp.Day == "" ? "0" : vTemp.Day ;
				oTableData.push(vTemp);
			}
			createData.DetailNav = oTableData; 
			
			oModel.create("/BusitripDomApplSet", createData, {
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
		
		if(common.Common.checkNull(oneData.Newyn)) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1231"), {title : oBundleText.getText("LABEL_0053")});	// 1231:변경/취소 구분을 선택하여 주십시오.
			return false ;
		}
		
		if(common.Common.checkNull(oneData.Chrsn)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2858"), {title : oBundleText.getText("LABEL_0053")});	// 2858:변경/취소 사유를 입력하여 주십시오.
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
		
		//변경 시 체크사항
		if(oneData.Newyn == "2"){
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
			if(!common.Common.checkNull(oneData.Beguz) && !common.Common.checkNull(oneData.Enduz) &&
					oneData.Beguz > oneData.Enduz ){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_1222"), {title : oBundleText.getText("LABEL_0053")});	// 1222:시작시간이 종료시간보다 큽니다.
					return false ;
			}

			if(oneData.Begtr == oneData.Endtr){
				if(common.Common.checkNull(oneData.Beguz) || common.Common.checkNull(oneData.Enduz) ){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2857"), {title : oBundleText.getText("LABEL_0053")}); // 2857:출장시간을 입력하여 주십시오.
					return false ;
				}
			}
		}
		
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		if(common.Common.checkNull(vTableData)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0119"), {title : oBundleText.getText("LABEL_0053")});	// 0119:상세내역을 입력하여 주십시오.
			return false;
		}
		
		for(var i = 0; i < vTableData.length; i++){
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV");
				
				oModel.remove("/BusitripDomApplSet(Appno='" + oController._vAppno + "')", {
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
		    oController = oView.getController(),
		    vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(vData.Begtr) || common.Common.checkNull(vData.Endtr) || vData.Begtr != vData.Endtr ){
			oController._DetailJSonModel.setProperty("/Data/Beguz","");
			oController._DetailJSonModel.setProperty("/Data/Enduz","");
			oController._DetailJSonModel.setProperty("/Data/Hour","");
			oController._DetailJSonModel.setProperty("/Data/Minute","");
		}
		oController.onSearchWork(oController);
	},
	
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
	
	onChangeBudge : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
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
		    oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV");
		
		if(!common.Common.checkNull(vData.Begtr) && !common.Common.checkNull(vData.Endtr) &&
			!common.Common.checkNull(vData.Budge)){
			
			aFilters = [];
			
			aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu));
			aFilters.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vData.Pernr));
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
		oController._DetailJSonModel.setProperty("/Data/Kospostx", vKospostx);
		oController._DetailJSonModel.setProperty("/Data/KospostxT", KospostxT);
		oController._DetailJSonModel.setProperty("/Data/SchkztxLong", vSchkztxLong);
		oController._DetailJSonModel.setProperty("/Data/Schkz", vSchkz);
		oController._DetailJSonModel.setProperty("/Data/Kostl", vKostl);
		oController._DetailJSonModel.setProperty("/Data/Posid", vPosid);
	},
	
	onChangeTime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
	    oController = oView.getController(),
	    vHour = "",
	    vMinute = "";
		
		if(!common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Beguz")) &&
				!common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Enduz"))){
			var vBeguz = oController._DetailJSonModel.getProperty("/Data/Beguz"),
				vEnduz = oController._DetailJSonModel.getProperty("/Data/Enduz");
			var vBeginDate = new Date("2000","0","1",vBeguz.substring(0,2),vBeguz.substring(2,4)).getTime(),
				vEnddate = new Date("2000","0","1",vEnduz.substring(0,2),vEnduz.substring(2,4)).getTime();
			
			if(vBeginDate > vEnddate ){
				oController._DetailJSonModel.setProperty("/Data/Hour",vHour);
				oController._DetailJSonModel.setProperty("/Data/Time",vMinute);
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_1224"), {title : oBundleText.getText("LABEL_0053")});	// 1224:시작시간이 종료시간 보다 큽시다.
				return ;
			}
			
			vHour = parseInt((vEnddate - vBeginDate)/1000/60/60);
			vMinute = ((vEnddate - vBeginDate)/1000/60)%60;
		}
		oController._DetailJSonModel.setProperty("/Data/Hour",vHour);
		oController._DetailJSonModel.setProperty("/Data/Minute",vMinute);
	},
	
	openHistoryDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._HistoryDialog) {
			oController._HistoryDialog = sap.ui.jsfragment("ZUI5_HR_DomesticBTripChange.fragment.ApplyHistory", oController);
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
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
			new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Pernr")),
			new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu),
			new sap.ui.model.Filter('Begtr', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(oBegtr.getDateValue())),
			new sap.ui.model.Filter('Endtr', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(oEndtr.getDateValue()))
		];
		
		var vData = { Data : []}, errData = {},
			oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV"),
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
						data.results[i].Beguz = data.results[i].Beguz * 1 == 0 ? "" : data.results[i].Beguz;
						data.results[i].Enduz = data.results[i].Enduz * 1 == 0 ? "" : data.results[i].Enduz;
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
	    	oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
		    oModel = oTable.getModel(),
		    vResult = oModel.getProperty("/Data"),
			vIdx = oTable.getSelectedIndices(),
			vData = oController._DetailJSonModel.getProperty("/Data"),
		    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		if(vIdx.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1232"));	// 1232:변경/취소할 신청건을  선택하여 주십시오.
			return;
		}
		
		if(vIdx.length > 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1233"));	// 1233:한건만 선택하여 주십시오.
			return;
		}

		var vSelectedData = oModel.getProperty("/Data/" + vIdx[0]);
		
		vSelectedData.Beguz = vSelectedData.Beguz * 1 == 0? "" : vSelectedData.Beguz.substring(0,4);
		vSelectedData.Enduz = vSelectedData.Enduz * 1 == 0? "" : vSelectedData.Enduz.substring(0,4);
		
		vData.Begtr = vSelectedData.Begtr; // 변경기간
		vData.Endtr = vSelectedData.Endtr; // 변경기간
		vData.Newyn = ""; // 변경/취소
		vData.Chrsn = ""; // 변경/취소 사유
		vData.SchkztxLong = vSelectedData.SchkztxLong; // 근무조
		vData.Schkz = vSelectedData.Schkz; // 근무조
		vData.Begtr2 = vSelectedData.Begtr; // 기간
		vData.Endtr2 = vSelectedData.Endtr; // 기간
		vData.Budge = vSelectedData.Budge; // 예산구분
		vData.Beguz = vSelectedData.Beguz; // 출장시간
		vData.Enduz = vSelectedData.Enduz; // 출장시간
		vData.Kospostx = vSelectedData.Kospostx; // Cost Center/WBS
		vData.KospostxT = vSelectedData.KospostxT; // Cost Center/WBS
		vData.Kostl = vSelectedData.Kostl; // Cost Center/WBS
		vData.Posid = vSelectedData.Posid; // Cost Center/WBS
		vData.Aufnr = vSelectedData.Aufnr; // Activity
		vData.Aufnrtx = vSelectedData.Aufnrtx; // Activity
		vData.Busin = vSelectedData.Busin; // 용무
		vData.Zbigo = vSelectedData.Zbigo; // 비고	
		
		// Original Data
		vData.SchkztxLong2 = vSelectedData.SchkztxLong; // 근무조
		vData.Schkz2 = vSelectedData.Schkz; // 근무조
		vData.Budge2 = vSelectedData.Budge; // 예산구분
		vData.Beguz2 = vSelectedData.Beguz; // 출장시간
		vData.Enduz2 = vSelectedData.Enduz; // 출장시간
		vData.Kospostx2 = vSelectedData.Kospostx; // Cost Center/WBS
		vData.KospostxT2 = vSelectedData.KospostxT; // Cost Center/WBS
		vData.Kostl2 = vSelectedData.Kostl; // Cost Center/WBS
		vData.Posid2 = vSelectedData.Posid; // Cost Center/WBS
		vData.Aufnr2 = vSelectedData.Aufnr; // Activity
		vData.Aufnrtx2 = vSelectedData.Aufnrtx; // Activity
		vData.Busin2 = vSelectedData.Busin; // 용무
		vData.Zbigo2 = vSelectedData.Zbigo; // 비고		
		
		vData.Docno2 = vSelectedData.Docno; // 결재번호		
		oController._DetailJSonModel.setProperty("/Data", vData);
		// Hour 과 Minutes 계산
		oController.onChangeTime();
		// Old Field 대입
		oController._DetailJSonModel.setProperty("/Data/Hour2", oController._DetailJSonModel.getProperty("/Data/Hour"));
		oController._DetailJSonModel.setProperty("/Data/Minutes", oController._DetailJSonModel.getProperty("/Data/Minute"));
		// 상세내역 Table 조회
		oController.onSearchDetailTable(oController, vData);
	},
	
	onSearchDetailTable : function(oController, vData) {
		if(common.Common.checkNull(vData)) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			oTableData = {Data : []},
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSonModel = oTable.getModel();
		
		oModel.read("/BusitripDomDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Docno', sap.ui.model.FilterOperator.EQ, vData.Docno2),
				new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu)
			],
			success : function(data, res) {
				if(data && data.results){
					for(var i = 0; i < data.results.length; i++){
						data.results[i].ZappStatAl = vData.ZappStatAl;
						data.results[i].Newyn = vData.Newyn;
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
		if(oController._HistoryDialog)
			oController._HistoryDialog.close();
	},
	
	onChangeNewyn : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail"),
    	oController = oView.getController(),
	    vData = oController._DetailJSonModel.getProperty("/Data");
		
		// 취소시 원 신청Data로 변경
		if(vData.Newyn == "3"){
			vData.Begtr = ""; // 변경기간
			vData.Endtr = ""; // 변경기간
			vData.Chrsn = ""; // 변경/취소 사유
			vData.SchkztxLong = vData.SchkztxLong2; // 근무조
			vData.Schkz = vData.Schkz2; // 근무조
			vData.Budge = vData.Budge2; // 예산구분
			vData.Beguz = vData.Beguz2; // 출장시간
			vData.Enduz = vData.Enduz2; // 출장시간
			vData.Hour = vData.Hour2; // 출장시간
			vData.Minute = vData.Minute2; // 출장시간
			vData.Kospostx = vData.Kospostx2; // Cost Center/WBS
			vData.KospostxT = vData.KospostxT2; // Cost Center/WBS
			vData.Kostl = vData.Kostl2; // Cost Center/WBS
			vData.Posid = vData.Posid2; // Cost Center/WBS
			vData.Aufnr = vData.Aufnr2; // Activity
			vData.Aufnrtx = vData.Aufnrtx2; // Activity
			vData.Busin = vData.Busin2; // 용무
			vData.Zbigo = vData.Zbigo2; // 비고	
			oController._DetailJSonModel.setProperty("/Data", vData);
		}else if(vData.Newyn == "2"){
			vData.Begtr = vData.Begtr2; // 기간
			vData.Endtr = vData.Endtr2; // 기간
			oController._DetailJSonModel.setProperty("/Data", vData);
		}
		// 시간계산
		oController.onChangeTime();
		
		oController.onSearchDetailTable(oController, vData);
	}
	
});
