	jQuery.sap.require("common.SearchUser1");
	jQuery.sap.require("common.ApprovalLineAction");
	jQuery.sap.require("common.Common");
	jQuery.sap.require("control.ZNK_SapBusy");
	jQuery.sap.require("common.CCSInformation");
	
	sap.ui.controller("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail", {
		/**
		 * Is initially called once after the Controller has been instantiated. It
		 * is the place where the UI is constructed. Since the Controller is given
		 * to this method, its event handlers can be attached right away.
		 * 
		 * @memberOf ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail
		 */
	
		PAGEID : "ZUI5_HR_DomesticBTripCalDetail",
		
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
		_vZworktyp : "HR09",
		_vLangu : "3",
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
				if(common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Begtr"))) oController.onPayCheck(oController, "1");
				else oController.onPayCheck(oController, "2");
			}
			
			// 시/분 계산
			oController.onChangeTime(oController);
			
			// 동행자 Panel expand 설정
			var vexpand = false;
			for(var i =0; i < 5 ; i++){
				var vPernr = eval("oDetailData.Data.Pernr0" + i);
				if(!common.Common.checkNull(vPernr)){
					vexpand = true;
					break;
				}
			}
			var oCompanionLayout = sap.ui.getCore().byId(oController.PAGEID +"_CompanionLayout");
			oCompanionLayout.setVisible(vexpand);
			oCompanionButton = sap.ui.getCore().byId(oController.PAGEID +"_CompanionButton");
			if(vexpand == true){
//				oCompanionButton.setIcon("sap-icon://expand");
				oCompanionButton.setText(oBundleText.getText("LABEL_1268"));	// 1268:접기
			}else{
//				oCompanionButton.setIcon("sap-icon://collapse");
				oCompanionButton.setText(oBundleText.getText("LABEL_1269"));	// 1269:펼치기
			}
			
			oController.BusyDialog.close();
		},
	
		onAfterShow : function(oEvent) {
			this.SmartSizing(oEvent);
		},
		
		onBack : function(oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
				oController = oView.getController();
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
				id : oController._vFromPage || "ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalList",
				data : {}
			});
		},
		
		onSetTargetMatrix : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
				oController = oView.getController(),
				oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
				oRow;
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("Font14px FontBold FontColor3")	// 결재선
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{ApprEnames}"
								}).addStyleClass("Font14px FontColor6")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
					.setModel(oController._DetailJSonModel).bindElement("/Data")
				]
			});
			
			oTargetMatrix.addRow(oRow);
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail");
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
			
			var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
				dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
				errData = {}, vCode = ["R", "C", "H"];
			
			oModel.read("/BusitripDomApplSet", {
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
						oDetailData.Data.Beguz = oDetailData.Data.Beguz * 1 == 0? "" : oDetailData.Data.Beguz.substring(0,4);
						oDetailData.Data.Enduz = oDetailData.Data.Enduz * 1 == 0? "" : oDetailData.Data.Enduz.substring(0,4);
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
			
			var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
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
			
			var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
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
				oDetailTitle.setText(oBundleText.getText("LABEL_1242") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1242:국내출장비 신청
			} else if(vZappStatAl == "10") {
				oDetailTitle.setText(oBundleText.getText("LABEL_1242") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1242:국내출장비 신청
			} else {
				oDetailTitle.setText(oBundleText.getText("LABEL_1242") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1242:국내출장비 신청
			}
		},
		
		setLangugae : function(oController, vApplyType){
			var vData = oController._DetailJSonModel.getProperty("/Data");
			
			if(vApplyType == "A"){
				
			}else if(vApplyType == "B"){
				
				
			}
		},
		
		setFactoryActivity : function(oController){
			var vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
//			if(vPersa == "7000"){
//				oController._DetailJSonModel.setProperty("/Data/Aufnr","1102519008");
//				oController._DetailJSonModel.setProperty("/Data/Aufnrtx","8. Provide best-in-class work environmen");
				var vAufnr = common.Common.onSearchDefaultAufnr(oController, oController._DetailJSonModel.getProperty("/Data/Begtr"));
				if(Array.isArray(vAufnr) &&  vAufnr.length == 2){
					oController._DetailJSonModel.setProperty("/Data/Aufnr",vAufnr[0]);
					oController._DetailJSonModel.setProperty("/Data/Aufnrtx",vAufnr[1]);
				}else{
					oController._DetailJSonModel.setProperty("/Data/Aufnr","");
					oController._DetailJSonModel.setProperty("/Data/Aufnrtx","");
				}
//			}
		},
		
		// 추가
		onPressAdd : function(oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
			    oController = oView.getController(),
			    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			    oJSonModel = oTable.getModel(),
			    oTableData = oJSonModel.getProperty("/Data");
			
			if(oTableData.length > 6){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2893"), 
						{title : oBundleText.getText("LABEL_0053")});	// 2893=최대 7건만 등록이 가능합니다.
				return;
			}
			
			var vData = { Idx : oTableData.length + 1, ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl"), Day : '0'};
			oTableData.push(vData);
			
			oController._DetailTableJSonModel.setData({Data : oTableData});
			oTable.setVisibleRowCount(oTableData.length);
		},
		
		onPressDeleteAll : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
		    oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    oJSonModel = oTable.getModel(),
			oControl = sap.ui.getCore().byId(oEvent.getSource().getId());
			
			oJSonModel.setData({Data:[]});
			oTable.setVisibleRowCount(1);
			oControl.setSelected(false);
		},
		
		onPressDelete : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
		    oController = oView.getController();
			var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
		    oDialogTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable2"),
		    oDialogTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable3");
			
			if(!oController._DepatureDialog) {
				oController._DepatureDialog = sap.ui.jsfragment("ZUI5_HR_DomesticBTripCal.fragment.DepatureDialog", oController);
				oView.addDependent(oController._DepatureDialog);
			}
			
			var oDialogTable1 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable1"),
		    oDialogTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable2"),
		    oDialogTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DialogTable3");
			
			var oDialogTable1Model = oDialogTable1.getModel(),
			oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
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
		onResetDetail : function(oController, isDelHstyp) {
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
				orgData = oController._DetailJSonModel.getProperty("/Data"),
				vData = { Data : { Appernr : orgData.Appernr , Appno : orgData.Appno ,
								   Pernr : orgData.Pernr , ZappStatAl : orgData.ZappStatAl
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
		
		onSetMyInfo : function(oController){
			oController._DetailJSonModel.setProperty("/Data/Perid", oController._TargetJSonModel.getProperty("/Data/Perid"));	
			oController._DetailJSonModel.setProperty("/Data/Ename", oController._TargetJSonModel.getProperty("/Data/Ename"));	
			oController._DetailJSonModel.setProperty("/Data/Pernr00", oController._TargetJSonModel.getProperty("/Data/Pernr"));
		},
		
		// 신청금액 변경
		onChangeMoney1 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
		    oController = oView.getController(),
		    vData = oController._DetailJSonModel.getProperty("/Data");
			// 일당 , 숙박비, 교통비 , 계
			var vActu = 0;
			vActu = common.Common.removeComma(vData.BscstR) * 1 + common.Common.removeComma(vData.HtcstR)  * 1 + common.Common.removeComma(vData.TrcstR) * 1 ;
			oController._DetailJSonModel.setProperty("/Data/TlcstR", common.Common.numberWithCommas(vActu));
			oController.onCalculateTotal(oController);
			common.Common.onChangeMoneyInput(oEvent);
		},
		
		// 현금사용액 변경
		onChangeMoney2 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
		    oController = oView.getController(),
		    vData = oController._DetailJSonModel.getProperty("/Data");
			// 일당 , 숙박비, 교통비 , 계
			var vActu = 0;
			vActu = common.Common.removeComma(vData.BscstH) * 1 + common.Common.removeComma(vData.HtcstH)  * 1 + common.Common.removeComma(vData.TrcstH) * 1 ;
			oController._DetailJSonModel.setProperty("/Data/TlcstH", common.Common.numberWithCommas(vActu));
			oController.onCalculateTotal(oController);
			common.Common.onChangeMoneyInput(oEvent);
		},
		
		// 동행자 변경
		onChangeMoney : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
		    oController = oView.getController(),
		    vData = oController._DetailJSonModel.getProperty("/Data");
			var vIndex = oEvent.getSource().getCustomData()[0].getValue();
			// 일당 , 숙박비, 교통비 , 계
			var vActu1 = 0, vActu2 = 0, vActu3 = 0, vActu = 0;
			eval("vActu1 = vData.Bscst0" + vIndex +";");
			eval("vActu2 = vData.Htcst0" + vIndex +";");
			eval("vActu3 = vData.Trcst0" + vIndex +";");
			
			vActu = common.Common.removeComma(vActu1) * 1 + common.Common.removeComma(vActu2)  * 1 + common.Common.removeComma(vActu3) * 1 ;
			oController._DetailJSonModel.setProperty("/Data/Smcst0" + vIndex, common.Common.numberWithCommas(vActu));
			oController.onCalculateTotal(oController);
			common.Common.onChangeMoneyInput(oEvent);
		},
		
		onCalculateTotal : function(oController){
			// 총신청액 계산 -
			// 총신청액 = 지급신청 + 현금사용액 
			var vData = oController._DetailJSonModel.getProperty("/Data"),
			vTotalBscst = 0, vTotalHtcst = 0, vTotalTrcst = 0, vTotalTlcst = 0;
	
			vTotalBscst = common.Common.removeComma(vData.BscstR) * 1 + common.Common.removeComma(vData.BscstH) * 1;
			vTotalHtcst = common.Common.removeComma(vData.HtcstR) * 1 + common.Common.removeComma(vData.HtcstH) * 1;
			vTotalTrcst = common.Common.removeComma(vData.TrcstR) * 1 + common.Common.removeComma(vData.TrcstH) * 1;
			vTotalTlcst = common.Common.removeComma(vData.TlcstR) * 1 + common.Common.removeComma(vData.TlcstH) * 1;
			
			vData.TotalBscst = common.Common.numberWithCommas(vTotalBscst);
			vData.TotalHtcst = common.Common.numberWithCommas(vTotalHtcst);
			vData.TotalTrcst = common.Common.numberWithCommas(vTotalTrcst);
			vData.TotalTlcst = common.Common.numberWithCommas(vTotalTlcst);
			
			oController._DetailJSonModel.setProperty("/Data", vData);
		},
		
		// 임시저장
		onPressSaveT : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
				oController = oView.getController();
			
			oController.onSave(oController , "T");
		},
		
		// 신청
		onPressSaveC : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
				oController = oView.getController();
			
			oController.onSave(oController , "C");
		},
		
		// 저장 Process(oController, 처리구분)
		onSave : function(oController, vPrcty) {
			var vErrorMessage = "";
			var vWarning = oController.onValidationData(oController, vPrcty);
			if(vWarning == false) return;
			
			var onProcess = function(){
				// 결재라인 저장
				var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
				
				if(vSuccessyn == "X"){
					oController.BusyDialog.close();
					return false;
				}
				
				// 저장
				var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
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
				createData.ZreqForm = oController._vZworktyp;
				createData.Waers = "KRW";
				//일당
				createData.BscstC = common.Common.removeComma(createData.BscstC);
				createData.BscstR = common.Common.removeComma(createData.BscstR);
				createData.BscstH = common.Common.removeComma(createData.BscstH);
				createData.Bscst01 = common.Common.removeComma(createData.Bscst01);
				createData.Bscst02 = common.Common.removeComma(createData.Bscst02);
				createData.Bscst03 = common.Common.removeComma(createData.Bscst03);
				createData.Bscst04 = common.Common.removeComma(createData.Bscst04);
				createData.Bscst05 = common.Common.removeComma(createData.Bscst05);
				//숙박비
				createData.HtcstC = common.Common.removeComma(createData.HtcstC);
				createData.HtcstR = common.Common.removeComma(createData.HtcstR);
				createData.HtcstH = common.Common.removeComma(createData.HtcstH);
				createData.Htcst01 = common.Common.removeComma(createData.Htcst01);
				createData.Htcst02 = common.Common.removeComma(createData.Htcst02);
				createData.Htcst03 = common.Common.removeComma(createData.Htcst03);
				createData.Htcst04 = common.Common.removeComma(createData.Htcst04);
				createData.Htcst05 = common.Common.removeComma(createData.Htcst05);
				//교통비
				createData.TrcstC = common.Common.removeComma(createData.TrcstC);
				createData.TrcstR = common.Common.removeComma(createData.TrcstR);
				createData.TrcstH = common.Common.removeComma(createData.TrcstH);
				createData.Trcst01 = common.Common.removeComma(createData.Trcst01);
				createData.Trcst02 = common.Common.removeComma(createData.Trcst02);
				createData.Trcst03 = common.Common.removeComma(createData.Trcst03);
				createData.Trcst04 = common.Common.removeComma(createData.Trcst04);
				createData.Trcst05 = common.Common.removeComma(createData.Trcst05);
				//계
				createData.TlcstC = common.Common.removeComma(createData.TlcstC);
				createData.TlcstR = common.Common.removeComma(createData.TlcstR);
				createData.TlcstH = common.Common.removeComma(createData.TlcstH);
				createData.Smcst01 = common.Common.removeComma(createData.Smcst01);
				createData.Smcst02 = common.Common.removeComma(createData.Smcst02);
				createData.Smcst03 = common.Common.removeComma(createData.Smcst03);
				createData.Smcst04 = common.Common.removeComma(createData.Smcst04);
				createData.Smcst05 = common.Common.removeComma(createData.Smcst05);
				
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
					vInfoTxt = oBundleText.getText("LABEL_2941") + "\n" + oBundleText.getText("LABEL_0051")
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
			var oneData = oController._DetailJSonModel.getProperty("/Data");
			
			if(!oneData.Pernr) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
				return false;
			}
			if(common.Common.checkNull(oneData.Begtr) || common.Common.checkNull(oneData.Endtr)) {
				sap.m.MessageBox.error("일정변경 일자를 입력하시기 바랍니다.", {title : oBundleText.getText("LABEL_0053")});	// 일정변경 일자를 입력하시기 바랍니다.
				return false ;
			}
			if(common.Common.checkDate(oneData.Begtr, oneData.Endtr) == false) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1221"), {title : oBundleText.getText("LABEL_0053")});	// 1221:시작일자가 종료일자보다 큽니다.
				return false ;
			}
			
			// 일당 비교
			if(common.Common.removeComma(oneData.BscstR) * 1 > common.Common.removeComma(oneData.BscstC) * 1 ){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2962"), {title : oBundleText.getText("LABEL_0053")});	// 2962:[일당] 본인의 CCS 지급액이 CCS 결제금액을 초과하였습니다.
				return false ;
			}
			
			// 숙박비 비교
			if(common.Common.removeComma(oneData.HtcstR) * 1 > common.Common.removeComma(oneData.HtcstC) * 1 ){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1260"), {title : oBundleText.getText("LABEL_0053")});	// 1260:[숙박비] 본인의 CCS 지급액이 CCS 결제금액을 초과하였습니다.
				return false ;
			}
			    
			// 교통비 비교
			if(common.Common.removeComma(oneData.TrcstR) * 1 > common.Common.removeComma(oneData.TrcstC) * 1 ){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1261"), {title : oBundleText.getText("LABEL_0053")});	// 1261:[교통비] 본인의 CCS 지급액이 CCS 결제금액을 초과하였습니다.
				return false ;
			}
			
			if(!common.Common.checkNull(oneData.Beguz) && !common.Common.checkNull(oneData.Enduz) &&
					oneData.Beguz > oneData.Enduz ){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1222"), {title : oBundleText.getText("LABEL_0053")});	// 1222:시작시간이 종료시간보다 큽니다.
				return false ;
			}
			
			if(common.Common.checkNull(oneData.TlcstR) && common.Common.checkNull(oneData.TlcstH)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1262"), {title : oBundleText.getText("LABEL_0053")});	// 1262:CSS 지급액이 없어 신청이 불가합니다.
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
			if(oneData.Begtr == oneData.Endtr){
				if(common.Common.checkNull(oneData.Beguz) || common.Common.checkNull(oneData.Enduz) ){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2857"), {title : oBundleText.getText("LABEL_0053")}); // 2857:출장시간을 입력하여 주십시오.
					return false ;
				}
			}
			
			
			var vKospostx = "", vPernr = ""; 
			for(var i = 1; i < 4; i++){
				vKospostx = ""; 
				eval("vKospostx = oneData.Kospostx0" + i + ";");
				eval("vPernr = oneData.Pernr0" + i + ";");
				if(!common.Common.checkNull(vPernr)  && vPernr != "00000000"&& vKospostx != oneData.Kospostx){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_1263"), {title : oBundleText.getText("LABEL_0053")});	// 1263:신청자 코스트센터와 동일하지 않은 동반자는 신청이 불가합니다.
					return false;
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
				
//				if(!oneData.Docyn || oneData.Docyn != "Y"){
//					sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91 :증빙서류를 업로드 하시기 바랍니다.
//					return false;
//				}
				
				
				// CCS 결재금액만 존재하고 CCS 지급신청액이 없는 경우 Warinig Message 출력
				if(oneData.BscstC != "" && oneData.BscstC * 1 != 0 && (common.Common.checkNull(oneData.BscstR) || oneData.BscstR * 1 == 0 )){
					return "X";
				}else if(oneData.HtcstC != "" && oneData.HtcstC * 1 != 0 && (common.Common.checkNull(oneData.HtcstR) || oneData.HtcstR * 1 == 0 )){
					return "X";
				}else if(oneData.TrcstC != "" && oneData.TrcstC * 1 != 0 && (common.Common.checkNull(oneData.TrcstR) || oneData.TrcstR * 1 == 0 )){
					return "X";
				}	
			}
			return true;
		},
		
		// 삭제 Process
		onDelete : function(oController , vPrcty){ // 처리 구분
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail");
			var oController = oView.getController();
				
			var onProcess = function() {
					var vErrorMessage = "";
					var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV");
					
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
			    oController = oView.getController(),
			    vData = oController._DetailJSonModel.getProperty("/Data");
			
			if(common.Common.checkNull(vData.Begtr) || common.Common.checkNull(vData.Endtr) || vData.Begtr != vData.Endtr ){
				oController._DetailJSonModel.setProperty("/Data/Beguz","");
				oController._DetailJSonModel.setProperty("/Data/Enduz","");
				oController._DetailJSonModel.setProperty("/Data/Hour","");
				oController._DetailJSonModel.setProperty("/Data/Minute","");
				
				if(common.Common.checkDate(vData.Begtr, vData.Endtr) == false) {
					return ;
				}
			}
			
			
			oController.onSearchWork(oController);
			// 상세내역 Table 조회
			oController.onPayCheck(oController, "2");
		},
		
		onChangeBudge : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
		    oController = oView.getController();
			oController.onSearchWork(oController);
			
		},
		
		onSearchWork : function(oController) {
			var vData = oController._DetailJSonModel.getProperty("/Data"),
			    vKospostx = "",
			    vKospostxT = "",
			    vSchkztxLong = "" ,
			    vSchkz = "",
			    vKostl = "",
			    vPosid = "",		    
			    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			    oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
			    vBegtr = vData.Begtr, vEndtr = vData.Endtr;
			
			// 변경일자가 입력되지 않을 시 기존 일자로 조회
			if(common.Common.checkNull(vBegtr) && common.Common.checkNull(vEndtr)){
				vBegtr = vData.Begtr2;
				vEndtr = vData.Endtr2;
			}
			
			if(!common.Common.checkNull(vBegtr) && !common.Common.checkNull(vEndtr) &&
				!common.Common.checkNull(vData.Budge)){
				
				aFilters = [];
				
				aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, "3"));
				aFilters.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vData.Pernr));
				aFilters.push(new sap.ui.model.Filter('Budge', sap.ui.model.FilterOperator.EQ, vData.Budge));
				aFilters.push(new sap.ui.model.Filter('Begtr', sap.ui.model.FilterOperator.EQ, vBegtr));
				aFilters.push(new sap.ui.model.Filter('Endtr', sap.ui.model.FilterOperator.EQ, vEndtr));
				
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
		
		onChangeTime : function(oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
		    oController = oView.getController();
			
			if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			if(!oController._HistoryDialog) {
				oController._HistoryDialog = sap.ui.jsfragment("ZUI5_HR_DomesticBTripCal.fragment.ApplyHistory", oController);
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
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
				new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, "3"),
				new sap.ui.model.Filter('Begtr', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(oBegtr.getDateValue())),
				new sap.ui.model.Filter('Endtr', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(oEndtr.getDateValue()))
			];
			
			var vData = { Data : []}, errData = {},
				oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
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
			}
			oController.BusyDialog.open();		
			setTimeout(onProcess, 100);
			
		},
		
		onSelectHistory : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
		    	oController = oView.getController(),
			    oTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable"),
			    oModel = oTable.getModel(),
			    vResult = oModel.getProperty("/Data"),
				vIdx = oTable.getSelectedIndices(),
				vData = oController._DetailJSonModel.getProperty("/Data"),
			    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			
			if(vIdx.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_1264"));	// 1264:출장비 신청할 신청건을 선택하여 주십시오.
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
			vData.Chrsn = ""; // 변경/취소 사유
			vData.SchkztxLong = vSelectedData.SchkztxLong; // 근무조
			vData.Schkz = vSelectedData.Schkz; // 근무조
			vData.Begtr2 = vSelectedData.Begtr; // 기간
			vData.Endtr2 = vSelectedData.Endtr; // 기간
			vData.Budge = vSelectedData.Budge; // 예산구분
			vData.Beguz = vSelectedData.Beguz; // 출장시간
			vData.Enduz = vSelectedData.Enduz; // 출장시간
			vData.Beguz2 = vSelectedData.Beguz; // 출장시간
			vData.Enduz2 = vSelectedData.Enduz; // 출장시간
			vData.Kospostx = vSelectedData.Kospostx; // Cost Center/WBS
			vData.KospostxT = vSelectedData.KospostxT; // Cost Center/WBS
			vData.Kostl = vSelectedData.Kostl; // Cost Center/WBS
			vData.Posid = vSelectedData.Posid; // Cost Center/WBS
			vData.Aufnr = vSelectedData.Aufnr; // Activity
			vData.Aufnrtx = vSelectedData.Aufnrtx; // Activity
			vData.Busin = vSelectedData.Busin; // 용무
			vData.Zbigo = vSelectedData.Zbigo; // 비고	
			vData.Docno2 = vSelectedData.Docno; // 결재번호		
			

			
			oController._DetailJSonModel.setProperty("/Data", vData);
			// Hour 과 Minutes 계산
			oController.onChangeTime();
	//		// 총신청액 칸에 본인 사번 입력
			oController.onSetMyInfo(oController);
			// 상세내역 Table 조회
			oController.onPayCheck(oController, "1");
			// 상세내역 Table 조회
			oController.onSearchDetailTable(oController, vData);
		},
		
		onSearchDetailTable : function(oController, vData) {
			if(common.Common.checkNull(vData)) return;
			
			var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
				dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
				errData = {},
				oTableData = {Data : []},
				oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
				oJSonModel = oTable.getModel();
			
			oModel.read("/BusitripDomDetailSet", {
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
		},
		
		onPernrChange : function(oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail");
			var oController = oView.getController();
			
			oController._useCustomPernrSelection = "X";
			oController._selectionSId = oEvent.getSource().getCustomData()[0].getValue();
			
			common.TargetUser.displayEmpSearchDialog();
		},
		
		customPernrSelection : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail");
			var oController = oView.getController();
			var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
			var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
			var vIDXs = oTable.getSelectedIndices();
			var vData = oController._DetailJSonModel.getProperty("/Data");
			
			if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
				if(vIDXs.length < 1) {
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
					return;
				}
				if(oController._selectionSId != "") {
					if(vIDXs.length > 1) {
						sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
						return;
					} 
				}
					
				var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath,
				svPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr"),
				svPerid = mEmpSearchResult.getProperty(_selPath + "/Perid"),
				svEname = mEmpSearchResult.getProperty(_selPath + "/Ename"),
				exPernr = "";
				
				for(var i=1 ; i<4; i++){
					if(i == oController._selectionSId) continue;
					eval("exPernr = vData.Pernr0" + i +";");
					if(exPernr == svPernr){
						sap.m.MessageBox.alert(oBundleText.getText("LABEL_1265"));	// 1265:이미 동행자로 등록되어 있는 사람입니다.
						return;
					}
				}
				
				if(svPerid == vData.Pernr){
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_1266"));	// 1266:동행자로 본인을 등록할 수는 없습니다.
					return;
				}
				
				oController._DetailJSonModel.setProperty("/Data/Pernr0" + oController._selectionSId , svPernr);
				oController._DetailJSonModel.setProperty("/Data/Perid0" + oController._selectionSId , svPerid);
				oController._DetailJSonModel.setProperty("/Data/Ename0" + oController._selectionSId , svEname);
				
				oController._DetailTableJSonModel.refresh();
				
			} else {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			// 공통 구분값 초기화
			oController._useCustomPernrSelection = "";
			oController._selectionSId = "";
			
			oController._AddPersonDialog.close();
			oController.onPayCheck(oController, "1");
		},
		
		customPernrClose : function(oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail");
			var oController = oView.getController();
			
			// 공통 구분값 초기화
			oController._useCustomPernrSelection = "";
			oController._selectionSId = "";
			
			oController._AddPersonDialog.close();
		},
		
		onPernrClear : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail"),
			 oController = oView.getController(),
			 vIndex = oEvent.getSource().getCustomData()[0].getValue(),
			 vData = oController._DetailJSonModel.getProperty("/Data");
			 oController._DetailJSonModel.setProperty("/Data/Pernr0" + vIndex , "");
			 oController._DetailJSonModel.setProperty("/Data/Ename0" + vIndex , "");
			 oController._DetailJSonModel.setProperty("/Data/Perid0" + vIndex , "");
			 oController._DetailJSonModel.setProperty("/Data/Bscstflg" + vIndex , true);
			 oController._DetailJSonModel.setProperty("/Data/Htcstflg" + vIndex , true);
			 oController._DetailJSonModel.setProperty("/Data/Trcstflg" + vIndex , true);
			 oController._DetailJSonModel.setProperty("/Data/Kostl0" + vIndex , "");
			 oController._DetailJSonModel.setProperty("/Data/Kostltx0" + vIndex , "");
			 oController._DetailJSonModel.setProperty("/Data/Posid0" + vIndex , "");
			 oController._DetailJSonModel.setProperty("/Data/Posidtx0" + vIndex , "");
			 oController._DetailJSonModel.setProperty("/Data/Kospostx0" + vIndex , "");
			 oController._DetailJSonModel.setProperty("/Data/Bscst0" + vIndex , "0");
			 oController._DetailJSonModel.setProperty("/Data/Htcst0" + vIndex , "0");
			 oController._DetailJSonModel.setProperty("/Data/Trcst0" + vIndex , "0");
			 oController._DetailJSonModel.setProperty("/Data/Smcst0" + vIndex , "0");
			 
			 oController.onCalculateTotal(oController);
		},
		/*
		 * 일비/ 숙박비/ 교통비 수정가능 여부 Flag 조회 
		 * vType : 1 - 기존일자로 조회
		 *       : 2 - 변경일자로 조회
	 	 */
		onPayCheck : function(oController, vType) {
			var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV"),
				dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
				errData = {}, aFilters = [], vData = oController._DetailJSonModel.getProperty("/Data");
				
			if(vType == "1"){
				aFilters.push(new sap.ui.model.Filter('Begtr', sap.ui.model.FilterOperator.EQ, vData.Begtr2));
				aFilters.push(new sap.ui.model.Filter('Endtr', sap.ui.model.FilterOperator.EQ, vData.Endtr2));
			}else if(vType == "2"){ // 변경일자 입력 시 시작일자와 종료일자를 모두 입력 시 조회
				if(common.Common.checkNull(vData.Begtr) || common.Common.checkNull(vData.Endtr)){
					return ;
				}else{
					aFilters.push(new sap.ui.model.Filter('Begtr', sap.ui.model.FilterOperator.EQ, vData.Begtr));
					aFilters.push(new sap.ui.model.Filter('Endtr', sap.ui.model.FilterOperator.EQ, vData.Endtr));	
				}
			}
			
			if(!common.Common.checkNull(vData.Beguz)){
				aFilters.push(new sap.ui.model.Filter('Beguz', sap.ui.model.FilterOperator.EQ, vData.Beguz));
			}
			
			if(!common.Common.checkNull(vData.Enduz)){
				aFilters.push(new sap.ui.model.Filter('Enduz', sap.ui.model.FilterOperator.EQ, vData.Enduz));
			}
			aFilters.push(new sap.ui.model.Filter('Pernr00', sap.ui.model.FilterOperator.EQ, vData.Pernr));
			
			if(!common.Common.checkNull(vData.Pernr01)){
				aFilters.push(new sap.ui.model.Filter('Pernr01', sap.ui.model.FilterOperator.EQ, vData.Pernr01));
			}
			if(!common.Common.checkNull(vData.Pernr02)){
				aFilters.push(new sap.ui.model.Filter('Pernr02', sap.ui.model.FilterOperator.EQ, vData.Pernr02));
			}
			if(!common.Common.checkNull(vData.Pernr03)){
				aFilters.push(new sap.ui.model.Filter('Pernr03', sap.ui.model.FilterOperator.EQ, vData.Pernr03));
			}
			if(!common.Common.checkNull(vData.Pernr04)){
				aFilters.push(new sap.ui.model.Filter('Pernr04', sap.ui.model.FilterOperator.EQ, vData.Pernr04));
			}
			if(!common.Common.checkNull(vData.Pernr05)){
				aFilters.push(new sap.ui.model.Filter('Pernr05', sap.ui.model.FilterOperator.EQ, vData.Pernr05));
			}
			if(!common.Common.checkNull(vData.Budge)){
				aFilters.push(new sap.ui.model.Filter('Budge', sap.ui.model.FilterOperator.EQ, vData.Budge));
			}
			var tempPernr1 = "", tempPernr2 = "", vBscstflg , vHtcstflg, vTrcstflg, vErrorcheck = "";
			
			oModel.read("/BusiTripPayCheckSet", {
				async : false,
				filters : [
					aFilters
				],
				success : function(data, res) {
					if(data && data.results){
						for(var i = 0; i < data.results.length; i++){
							tempPernr = "", vErrorcheck = "";
							eval("tempPernr1 = data.results[" + i +"].Pernr;");
							
							if(vData.Kospostx != data.results[i].Kospostx){
								vErrorcheck = "1";
							}
							
							if(vErrorcheck == "" && data.results[i].Tripok != true){
								vErrorcheck = "2";
							}
							
							for(var j = 0 ; j <=5; j++){
								tempPernr2 = "";
								eval("tempPernr2 = vData.Pernr0" + j);
								if(tempPernr1 != "" &&  tempPernr1 == tempPernr2){
									eval("vData.Bscstflg" + j + " = data.results[" + i + "].Bscstflg ;" );
									eval("vData.Htcstflg" + j + " = data.results[" + i + "].Htcstflg ;" );
									eval("vData.Trcstflg" + j + " = data.results[" + i + "].Trcstflg ;" );
									eval("vBscstflg = data.results[" + i + "].Bscstflg ;" );
									eval("vHtcstflg = data.results[" + i + "].Htcstflg ;" );
									eval("vTrcstflg = data.results[" + i + "].Trcstflg ;" );
									
									eval("vData.Kostl0" + j + " = data.results[" + i + "].Kostl ;" );
									eval("vData.Kostltx0" + j + " = data.results[" + i + "].Kostltx ;" );
									eval("vData.Posid0" + j + " = data.results[" + i + "].Posid ;" );
									eval("vData.Posidtx0" + j + " = data.results[" + i + "].Posidtx ;" );
									eval("vData.Kospostx0" + j + " = data.results[" + i + "].Kospostx ;" );
									
									// 일비, 숙박비, 교통비를 수정할 수 없는 Flag 를 받을 시 해당 금액은 초기화 
									if(vBscstflg == true) eval("vData.Bscst0" + j + " = '';" );
									if(vHtcstflg == true) eval("vData.Htcst0" + j + " = '';" );
									if(vTrcstflg == true) eval("vData.Trcst0" + j + " = '';" );
									
									// 에러 발생한 동행자 이므로 사번 등 모두 삭제
									if(vErrorcheck == "1" || vErrorcheck == "2" ){
										var vErrName = "";
										eval("vErrName = vData.Ename0" + j + ";" );
										
										if(vErrorcheck == "1"){
											sap.m.MessageBox.error(oBundleText.getText("LABEL_1263"), {
												title : oBundleText.getText("LABEL_0053")});	// 1263:신청자 코스트센터와 동일하지 않은 동반자는 신청이 불가합니다.
										}else if(vErrorcheck == "2"){
											var vPeriod = vType == "1" ? vData.Begtr2 + " ~ " +  vData.Endtr2 : vData.Begtr1 + " ~ " +  vData.Endtr1;
											sap.m.MessageBox.error(vErrName + "님은 해당 출장기간("+ vPeriod +")에 출장승인 이력이 없습니다.", {
												title : oBundleText.getText("LABEL_0053")});	// 1263:신청자 코스트센터와 동일하지 않은 동반자는 신청이 불가합니다.
										}
										
										eval("vData.Pernr0" + j + " = '' ;" );
										eval("vData.Perid0" + j + " = '' ;" );
										eval("vData.Ename0" + j + " = '' ;" );
										eval("vData.Htcstflg" + j + " = true ;" );
										eval("vData.Htcst0" + j + " = '' ;" );
										eval("vData.Trcstflg" + j + " = true ;" );
										eval("vData.Trcst0" + j + " = '' ;" );
										eval("vData.Bscstflg" + j + " = true ;" );
										eval("vData.Bscst0" + j + " = '' ;" );
										eval("vData.Smcst0" + j + " = '' ;" );
										eval("vData.Pmemo0" + j + " = '' ;" );
									}
										
									break;
								}
							}
							
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage,{title : oBundleText.getText("LABEL_0053")});
			}
			
			oController._DetailJSonModel.setProperty("/Data",vData);
		},
		
		onChangeEvent : function(oEvent){
			console.log(oEvent);
		},
		
		onPressExpandCompanion : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail");
			var oController = oView.getController();
			var oCompanionLayout = sap.ui.getCore().byId(oController.PAGEID +"_CompanionLayout");
			oCompanionButton = sap.ui.getCore().byId(oController.PAGEID +"_CompanionButton");
			if(oCompanionLayout.getVisible() == false){
//				oCompanionButton.setIcon("sap-icon://expand");
				oCompanionButton.setText(oBundleText.getText("LABEL_1268"));	// 1268:접기
			}else{
//				oCompanionButton.setIcon("sap-icon://collapse");
				oCompanionButton.setText(oBundleText.getText("LABEL_1269"));	// 1269:펼치기
			}
			oCompanionLayout.setVisible(!oCompanionLayout.getVisible());
			
			
		}
	});
