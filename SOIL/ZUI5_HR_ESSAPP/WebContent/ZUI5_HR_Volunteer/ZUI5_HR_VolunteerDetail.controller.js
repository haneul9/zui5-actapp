jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.TargetUser");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail
	 */

	PAGEID : "ZUI5_HR_VolunteerDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_Index : "",
	_vEnamefg : "",
	_vPersa : "" ,
	_vAppno : "",
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	_vZworktyp : "",
	_useCustomPernrSelection : "",
	
	onInit : function() {
		this.getView().addStyleClass("sapUiSizeCompact");

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this),
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vFromPageId = "",
			vPland = "";
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
			if(oController._vZworktyp != oEvent.data.ZreqForm){
				// 신청안내 Json Model Clear
				oController._vInfoImage.setData({ Data : []});
			}
			if(oEvent.data.Pland) vPland = oEvent.data.Pland;
			oController._vZworktyp = oEvent.data.ZreqForm;
			
			_gZworktyp = oEvent.data.ZreqForm;
		}
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// ReqAuth 값 조회하기
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vLoginData = common.Common.getEmpLoginInfo(_gAuth, _gZworktyp);
		
		vEmpLoginInfo[0].ReqAuth = vLoginData.ReqAuth;
		gReqAuth = vLoginData.ReqAuth || "1";
		
		oController._vFromPage = vFromPageId;
		var vZappStatAl = "" , vAppno = "",
			oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle"),
			oModel = sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV"),
			oDetailData = {Data : {Pland : vPland }},
			oTableData1 = {Data : []},
			oTableData2 = {Data : []};

		// Table Clear
		var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_ScheduleTable"),
		oTableModel1 = oTable1.getModel(),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_EmployeeTable"),
		oTableModel2 = oTable2.getModel();
		
		oTableModel1.setData({Data : []});
		oTable1.setVisibleRowCount(1);
		oTableModel2.setData({Data : []});
		oTable2.setVisibleRowCount(1);
		
		oController.BusyDialog.open();
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			vPernr = vEmpLoginInfo[0].Pernr,
			vEncid = vEmpLoginInfo[0].Encid,
			vErrorMessage = "", vError = "",
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});				
		
		var filters = [];
		if( oController._vAppno == "") {
			filters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I'));
			filters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			if(vPland != "" && oController._vZworktyp == "GA02"){
				filters.push(new sap.ui.model.Filter('Pland', sap.ui.model.FilterOperator.EQ, vPland));
			}
		} else {
			filters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'));
			filters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			filters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno));
		}
		
		if(oController._vAppno != "" || oController._vZworktyp == "GA02") { // 수정 및 조회 
			oModel.read("/VolunteerApplSet", {
				async: false,
				filters: filters,
				success: function(data,res) {
					if(data && data.results.length) {
						var OneData = data.results[0];							
						OneData.Betrg = (OneData.Betrg * 1 == 0) ? "" : common.Common.numberWithCommas(OneData.Betrg);
						OneData.Attcn = (OneData.Attcn * 1 == 0) ? "" : OneData.Attcn;
						OneData.Zcnt1 = (OneData.Zcnt1 * 1 == 0) ? "" : OneData.Zcnt1;
						OneData.Zcnt2 = (OneData.Zcnt2 * 1 == 0) ? "" : OneData.Zcnt2;
						
						if(OneData.ZappStatAl == "" || OneData.ZappStatAl == "10"){
							OneData.Reqdt = dateFormat.format(new Date) ;
							OneData.ZreqForm = oController._vZworktyp;
						}else{
							OneData.Reqdt = common.Common.checkNull(OneData.Reqdt) ? "" : dateFormat.format(new Date(common.Common.setTime(OneData.Reqdt)));
						}
						vZappStatAl = OneData.ZappStatAl ;
						oDetailData.Data = OneData;
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					vError = errData.Error;
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vError == "E") {
				sap.m.MessageBox.alert(vErrorMessage, {
					onClose : function() {
						oController.onBack();
					}
				});
				return ;
			}
			
			vAppno = oDetailData.Data.Appno ; 
			
			var vFilterAppno = vAppno ;
			if(oController._vZworktyp == "GA02" && vZappStatAl == ""){
				vFilterAppno = vPland ;
			}
			
			filters = [];
			filters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vFilterAppno));
			
			oModel.read("/VolunteerApplDateSet", {
				async: false,
				filters: filters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i =0; i <data.results.length; i++){
							var OneData = data.results[i];
							OneData.Zdate = common.Common.checkNull(OneData.Zdate) ? "" : dateFormat.format(new Date(common.Common.setTime(OneData.Zdate)));
							OneData.ZappStatAl = vZappStatAl;
							OneData.Beguz = oController.addZero(OneData.Beguz);
							OneData.Enduz = oController.addZero(OneData.Enduz);
							OneData.Idx = i + 1;
							oTableData1.Data.push(OneData);
						}
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					vError = errData.Error;
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vError == "E") {
				sap.m.MessageBox.alert(vErrorMessage, {
					onClose : function() {
						oController.onBack();
					}
				});
				return ;
			}
			
			oTableModel1.setData(oTableData1);
			oTable1.setVisibleRowCount(oTableData1.Data.length);
			
			if(oController._vZworktyp == "GA02" && vZappStatAl != ""){
				oModel.read("/VolunteerApplPernrSet", {
					async: false,
					filters: filters,
					success: function(data,res){
						for(var i =0; i <data.results.length; i++){
							var OneData = data.results[i];
							OneData.ZappStatAl = vZappStatAl;
							OneData.Idx = i + 1;
							oTableData2.Data.push(OneData);
						}
					},
					error: function(Res) {
						var errData = common.Common.parseError(Res);
						vError = errData.Error;
						vErrorMessage = errData.ErrorMessage;
					}
				});
				
				if(vError == "E") {
					sap.m.MessageBox.alert(vErrorMessage, {
						onClose : function() {
							oController.onBack();
						}
					});
					return ;
				}
				
				oTableModel2.setData(oTableData2);
				if(oTableData2.Data.length > 10) oTable2.setVisibleRowCount(10);
				else oTable2.setVisibleRowCount(oTableData2.Data.length);
			};
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
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		/****************************************************/
		/*********** 공통적용사항 End	 			 ************/
		/****************************************************/
		
		// 신규 결재번호 채번
		if(oController._vAppno == "" && oController._vZworktyp == "GA01") {
			oModel.read("/VolunteerApplSet", {
				async: false,
				filters: filters,
				success: function(data,res) {
					if(data && data.results.length) {
						oController._vAppno = data.results[0].Appno ;
						oController._DetailJSonModel.setProperty("/Data/Reqdt", dateFormat.format(new Date));
						oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
						oController._DetailJSonModel.setProperty("/Data/ZreqForm", oController._vZworktyp);
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					vError = errData.Error;
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vError == "E") {
				sap.m.MessageBox.alert(vErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});
				return ;
			}
			
			oController.onNewScheduleLine();
		}else if(oController._vAppno == "" && oController._vZworktyp == "GA02"){
			oController._vAppno = vAppno ;
			oController._DetailJSonModel.setProperty("/Data/Appno", vAppno);
		}
		
		
		var oDelCol1 = sap.ui.getCore().byId(oController.PAGEID + "_DelCol1");
		var oDelCol2 = sap.ui.getCore().byId(oController.PAGEID + "_DelCol2");
		
		var oTypeARow1 = sap.ui.getCore().byId(oController.PAGEID + "_TypeARow1");
		var oTypeARow2 = sap.ui.getCore().byId(oController.PAGEID + "_TypeARow2");
		var oTypeBRow1 = sap.ui.getCore().byId(oController.PAGEID + "_TypeBRow1");
		var oTypeBRow2 = sap.ui.getCore().byId(oController.PAGEID + "_TypeBRow2");
		
		
		// 결재 상태에 따라 Page Header Text 수정		
		if( vZappStatAl == "" ) {
			// 통화키 Default는 한화 
			oController._DetailJSonModel.setProperty("/Data/Waers", "KRW");
			if(oController._vZworktyp == "GA01"){
				oDetailTitle.setText(oBundleText.getText("LABEL_1839"));	// 1839:사회봉사계획서 신청
			}else{
				oDetailTitle.setText(oBundleText.getText("LABEL_2662"));	// 2662:사회봉사보고서 신청
			}
			oDelCol1.setVisible(true);
			oDelCol2.setVisible(true);
		}else if(vZappStatAl == "10"){
			if(oController._vZworktyp == "GA01"){
				oDetailTitle.setText(oBundleText.getText("LABEL_1839") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1839:사회봉사계획서 신청
			}else{
				oDetailTitle.setText(oBundleText.getText("LABEL_2662") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 2662:사회봉사보고서 신청
			}
			oDelCol1.setVisible(true);
			oDelCol2.setVisible(true);
		}else{
			if(oController._vZworktyp == "GA01"){
				oDetailTitle.setText(oBundleText.getText("LABEL_1839") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1839:사회봉사계획서 신청
			}else{
				oDetailTitle.setText(oBundleText.getText("LABEL_2662") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 2662:사회봉사보고서 신청
			}
			oDelCol1.setVisible(false);
			oDelCol2.setVisible(false);
		}
		
		if(oController._vZworktyp == "GA01"){
			oTypeARow1.removeStyleClass("DisplayNone");
			oTypeARow2.removeStyleClass("DisplayNone");
			oTypeBRow1.addStyleClass("DisplayNone")
			oTypeBRow2.addStyleClass("DisplayNone")
		}else{
			oTypeARow1.addStyleClass("DisplayNone");
			oTypeARow2.addStyleClass("DisplayNone");
			oTypeBRow1.removeStyleClass("DisplayNone")
			oTypeBRow2.removeStyleClass("DisplayNone")
		}
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail"),
			oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		}else{
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_Volunteer.ZUI5_HR_VolunteerList",
			      data : {}
			});	
		}
	},

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
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
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
	
	addZero : function(d) {
		d = "" + d ;
		for(var i = d.length; i< 4; i++){
			d = "0" + d;
		}
		return d;
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
	},
	
	onChangeEvecd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		var vEvept = "", vEvepttx = "", vOffno = "", vAdmin = "", vEveot = "",
		    vWelcd = "", vWelcdt = "",
		cData = oEvent.getSource().getSelectedItem().getCustomData();
		
		if(cData && cData.length > 0){
			vEvept = cData[0].getValue();
			vEvepttx = cData[1].getValue();
			vOffno = cData[2].getValue();
			vAdmin = cData[3].getValue();
			vEveot = cData[4].getValue();
			vWelcd = cData[5].getValue();
			vWelcdt = cData[6].getValue();
		}
		
		oController._DetailJSonModel.setProperty("/Data/Evept", vEvept);
		oController._DetailJSonModel.setProperty("/Data/Evepttx", vEvepttx);
		oController._DetailJSonModel.setProperty("/Data/Offno", vOffno);
		oController._DetailJSonModel.setProperty("/Data/Admin", vAdmin);
		oController._DetailJSonModel.setProperty("/Data/Eveot", vEveot);
		oController._DetailJSonModel.setProperty("/Data/Welcd", vWelcd);
		oController._DetailJSonModel.setProperty("/Data/Welcdt", vWelcdt);
	},
	
	displayWelcdSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		if(!oController._SearchWelcdDialog) {
			oController._SearchWelcdDialog = sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.SearchWelcdDialog", oController);
			oView.addDependent(oController._SearchWelcdDialog);
		}
		oController._SearchWelcdDialog.open();
	},
	
	onCloseSearchWelcdDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		oController._SearchWelcdDialog.close();
	},
	
	onBeforeOpenSearchWelcdDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchWelcdDialog_Table");
		var _JSonModel =  oTable.getModel();
		var vDatas = { Data : []}
		_JSonModel.setData(vDatas);
		sap.ui.getCore().byId(oController.PAGEID + "_SearchWelcdDialog_Text").setValue("");
		oTable.setMode(sap.m.ListMode.Delete); // Delete mode selection
		oTable.setMode(sap.m.ListMode.SingleSelectLeft); // Put it back.
	},
	
	onConfirmSearchWelcdDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchWelcdDialog_Table");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		var vText = "";
		
		var vOffno = "", vAdmin = "", vWelcd = "", vWelcdt = "";
	
		vOffno = vContexts[0].getProperty("Offno");
		vAdmin = vContexts[0].getProperty("Admin");
		vWelcd = vContexts[0].getProperty("Welcd");
		vWelcdt = vContexts[0].getProperty("Welcdt");
	
		oController._DetailJSonModel.setProperty("/Data/Offno", vOffno);
		oController._DetailJSonModel.setProperty("/Data/Admin", vAdmin);
		oController._DetailJSonModel.setProperty("/Data/Welcd", vWelcd);
		oController._DetailJSonModel.setProperty("/Data/Welcdt", vWelcdt);
		oController._SearchWelcdDialog.close();
		
	},
	
	onKeyUp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV"),
		oSearchData = {Data : []},
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchWelcdDialog_Table"),
		oJSonModel = oTable.getModel(),
		vKeyword = sap.ui.getCore().byId(oController.PAGEID + "_SearchWelcdDialog_Text").getValue(),
		vError = "", vErrorMessage = "", oFilter = [] ;
		
		if(!common.Common.checkNull(vKeyword)) oFilter.push(new sap.ui.model.Filter('Welcdt', sap.ui.model.FilterOperator.EQ, vKeyword));
		
		var onProcess = function(){
			oModel.read("/WelfareListSet", {
				async: false,
				filters: [
					oFilter
				],
				success: function(data,res) {
					if(data && data.results.length) {
						data.results.forEach(function(element){
							oSearchData.Data.push(element);
						});
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					vError = errData.Error;
					vErrorMessage = errData.ErrorMessage;
				}
			});
			oController.BusyDialog.close();
			oJSonModel.setData(oSearchData);
			if(vError == "E") {
				sap.m.MessageBox.show(vErrorMessage, {});
			}
		}
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	
	
	displayComcdSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		if(!oController._SearchComcdDialog) {
			oController._SearchComcdDialog = sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.SearchComcdDialog", oController);
			oView.addDependent(oController._SearchComcdDialog);
		}
		oController._SearchComcdDialog.open();
	},
	
	onCloseSearchComcdDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		oController._SearchComcdDialog.close();
	},
	
	onBeforeOpenSearchComcdDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchComcdDialog_Table");
		var _JSonModel =  oTable.getModel();
		var vDatas = { Data : []}
		_JSonModel.setData(vDatas);
		sap.ui.getCore().byId(oController.PAGEID + "_SearchComcdDialog_Text").setValue("");
		oTable.setMode(sap.m.ListMode.Delete); // Delete mode selection
		oTable.setMode(sap.m.ListMode.SingleSelectLeft); // Put it back.
	},
	
	onConfirmSearchComcdDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchComcdDialog_Table");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		var vComcd = "", vComcdt = "";
	
		vComcd = vContexts[0].getProperty("Key");
		vComcdt = vContexts[0].getProperty("Value");
	
		oController._DetailJSonModel.setProperty("/Data/Comcd", vComcd);
		oController._DetailJSonModel.setProperty("/Data/Comcdt", vComcdt);
		oController._SearchComcdDialog.close();
		
	},
	
	onSearchComcdDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV"),
		oSearchData = {Data : []},
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchComcdDialog_Table"),
		oJSonModel = oTable.getModel(),
		vKeyword = sap.ui.getCore().byId(oController.PAGEID + "_SearchComcdDialog_Text").getValue(),
		vError = "", vErrorMessage = "", oFilter = [] ;
		
		if(!common.Common.checkNull(vKeyword)) oFilter.push(new sap.ui.model.Filter('Value', sap.ui.model.FilterOperator.EQ, vKeyword));
		
		var onProcess = function(){
			oModel.read("/CorpsListSet", {
				async: false,
				filters: [
					oFilter
				],
				success: function(data,res) {
					if(data && data.results.length) {
						data.results.forEach(function(element){
							oSearchData.Data.push(element);
						});
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					vError = errData.Error;
					vErrorMessage = errData.ErrorMessage;
				}
			});
			oController.BusyDialog.close();
			oJSonModel.setData(oSearchData);
			if(vError == "E") {
				sap.m.MessageBox.show(vErrorMessage, {});
			}
		}
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	convertMoneyFormat : function(oEvent) {
		var inputValue = oEvent.getParameter('value').trim(),
			convertValue = common.Common.numberWithCommas(inputValue.replace(/[^\d]/g, ''));
		
		oEvent.getSource().setValue(convertValue);
	},
	
	setOnlyDigit : function(oEvent) {
		var inputValue = oEvent.getParameter('value').trim(),
		convertValue = inputValue.replace(/[^\d]/g, '');
		
		oEvent.getSource().setValue(convertValue);
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "" , vErrorMessage = "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		
		var onProcess = function(){
			var vDetailData = oController._DetailJSonModel.getProperty("/Data");
			var oModel = sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV");
			
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			oModel.create("/VolunteerApplSet", vOData, {
				success: function(data,res) {
					if(data) {
						oController._vAppno = data.Appno;
						oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
						oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
						vZappStatAl = data.ZappStatAl;
					} 
				},
				error: function (oError) {
			    	var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
						else vErrorMessage = Err.error.message.value;
					} else {
						vErrorMessage = oError.toString();
					}
				}
			});
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
				return ;
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
		} else {
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
		var rData = {};
		var vData = {};
		Object.assign(vData, oController._DetailJSonModel.getProperty("/Data"));
		vData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
		vData.Prcty = vPrcty;
		
		if(common.Common.checkNull(vData.Reqdt)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2538"));	// 2538:신청일이 입력되지 않았습니다.
			return "";
		}
		if(!common.Common.checkNull(vData.Zcar1) && vData.Zcar1 == vData.Zcar2) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2466"));	// 2466:동일한 지원차량을 선택하였습니다.
			return "";
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
			
			if(!vData.Docyn || vData.Docyn != "Y"){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1199"), {title : oBundleText.getText("LABEL_0053")});	// 1199:전자증빙에 증빙서류를 업로드 바랍니다.
				return false;
			}
		}
		
		try {
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV"), "VolunteerAppl", vData);
			rData.Attcn = rData.Attcn * 1; // 참여인원
			rData.Zcnt1 = rData.Zcnt1 * 1;
			rData.Zcnt2 = rData.Zcnt2 * 1;
			delete rData.Zdate ; // 행사일자 삭제
			rData.Betrg = common.Common.removeComma(rData.Betrg);
			rData.Reqdt = "\/Date("+ common.Common.getTime(rData.Reqdt)+")\/";
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		// 신청 구분에 따른 Table Data 구성
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ScheduleTable"),
		oData = oTable.getModel().getData(),
		vTableData = [];
		if(!oData || oData.Data.length < 1 && vPrcty == "C"){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2640"), {title : oBundleText.getText("LABEL_0053")});	// 2640:행사일정을 입력하시기 바랍니다.
			return "";
		}
		
		var vData = {};
		for(var i=0; i < oData.Data.length; i++){
			if(common.Common.checkNull(oData.Data[i].Zdate)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2639"), {title : oBundleText.getText("LABEL_0053")});	// 2639:행사일자를 입력하시기 바랍니다.
				return "";
			}else{
				vData = {};
				Object.assign(vData, oData.Data[i]);
				vData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV"), "VolunteerApplDate", vData);
				vData.Zdate = "\/Date("+ common.Common.getTime(vData.Zdate)+")\/";
			}
			vTableData.push(vData);
		};
		rData.VolunteerApplDateNav = vTableData;
		
		if(oController._vZworktyp == "GA02"){ // 보고서 
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmployeeTable"),
			oData = oTable.getModel().getData(),
			vTableData = [];
			if(!oData || oData.Data.length < 1 && vPrcty == "C"){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2606"), {title : oBundleText.getText("LABEL_0053")});	// 2606:직원정보를 등록하시기 바랍니다.
				return "";
			}
			
			for(var i=0; i < oData.Data.length; i++){
				vData = {};
				if(common.Common.checkNull(oData.Data[i].Perid)){
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2498"), {title : oBundleText.getText("LABEL_0053")});	// 2498:사원번호를 입력하시기 바랍니다.
					return "";
				}else{
					Object.assign(vData, oData.Data[i]);
					vData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV"), "VolunteerApplPernr", vData);
				}
				vTableData.push(vData);
			}
			rData.VolunteerApplPernrNav = vTableData;
		}
		return rData;
		
	},
	
	onChangeTime : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_ScheduleTable"),
		oContext = oEvent.getSource().getBindingContext();
		oModel = oTable.getModel(),
		oData = oModel.getProperty(oContext.getPath()),
		vBeguz = oData.Beguz,
		vEnduz = oData.Enduz,
		vType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!common.Common.checkNull(vBeguz) && !common.Common.checkNull(vEnduz)){
			if(vBeguz * 1 > vEnduz * 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2635"),{	// 2635:행사 시작시간이 종료시간 보다 미래 일 수는 없습니다.
					title : oBundleText.getText("LABEL_0053"),
					onClose : function() {
						oModel.setProperty(oContext.getPath() + "/" + vType , "" );  // Data 값 Clear
						oModel.setProperty(oContext.getPath() + "/Zhour", "" );  // Data 값 Clear
					}
				});
				return "";
			}
			// 봉사시간
			var vBegSi =  vBeguz.substring(0,2) * 1,
			vBegBun =  vBeguz.substring(2,4) * 1,
			vEndSi =  vEnduz.substring(0,2) * 1,
			vEndBun =  vEnduz.substring(2,4) * 1;
			
			vEndSi = vEndSi - vBegSi;
			vEndBun = vEndBun - vBegBun;
			
			if(vEndBun < 0){
				vEndSi = vEndSi - 1;
				vEndBun = 60 + vEndBun;
			}
			// 분을 시간으로 변환
			vEndBun = vEndBun / 60;
			
			vEndSi = vEndSi + ( vEndBun.toFixed(1) * 1);
			
			oModel.setProperty(oContext.getPath() + "/Zhour", "" + vEndSi ); 
		}		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV");
				
				oModel.remove("/VolunteerApplSet(Appno='" + vDetailData.Appno + "')", {
					success: function(data,res) {
					},
					error: function(Res) {
						if(Res.response.body){
							var ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							vError = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}else{
								vErrorMessage =ErrorMessage ;
							}
						}
					}
				});
				oController.BusyDialog.close();
				
				if(vError == "E") {
					sap.m.MessageBox.show(vErrorMessage, {});
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
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
//				control.ZNKBusyAccessor.onBusy("S",oController);
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
	
	onAfterSelectPernr : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_VOLUNTEER_SRV"),
			oDetailData = {Data : {}},
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vError = "", vErrorMessage = "";
		
		if(!vPernr || vPernr == '00000000') {
			return false;
		}
		
		oModel.read("/VolunteerApplSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'N'),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
			],
			success: function(data,res) {
				if(data && data.results.length) {
					var OneData = data.results[0];
					OneData.Apamt = (OneData.Apamt == '0') ? "" : common.Common.numberWithCommas(OneData.Apamt);
					OneData.Lnhym = (OneData.Lnhym == '000000') ? "" : OneData.Lnhym;
					OneData.Lnrte = (OneData.Lnrte == '0.00') ? "0" : OneData.Lnrte;
					
					oDetailData.Data = OneData;
					oDetailData.Data.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
					oDetailData.Data.Auth = _gAuth;
					oDetailData.Data.ZappStatAl = OneData.ZappStatAl;
					
					oController._DetailJSonModel.setData(oDetailData);
				}
			},
			error: function(Res) {
				var errData = common.Common.parseError(Res);
				vError = errData.Error;
				vErrorMessage = errData.ErrorMessage;
			}
		});
	
		if(vError == "E") {
			sap.m.MessageBox.show(vErrorMessage, {});
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_Volunteer.ZUI5_HR_VolunteerList",
			      data : { Appno : "" }
			});
		}
	},
	
	openDocno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	},
	
	onNewScheduleLine : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_ScheduleTable"),
		oData = oTable.getModel().getData();

		var idx = 0 ;
		if(oData && oData.Data){
			idx = oData.Data.length ;
		}
		
		var vData =  { Zdate : "" , Beguz : "" , Enduz : "" , Zhour : "" , Zbigo : "" , Idx : idx+ 1 ,ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl")  };		
		oData.Data.push(vData);
		
		oTable.getModel().setData(oData);
		oTable.setVisibleRowCount(oData.Data.length);
	},
	
	onDeleteScheduleLine  : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_ScheduleTable"),
		oContext = oEvent.getSource().getBindingContext();
		oModel = oTable.getModel(),
		oData = oModel.getProperty("/Data");
		
		var i = parseInt(oContext.getPath().substr(oContext.getPath().lastIndexOf("/") + 1));
		oData.splice(i,1);
		oModel.setProperty("/Data" ,common.Common.reIndexODataArray(oData));
		oTable.setVisibleRowCount(oData.length);
	},
	
//	onNewEmployeeLine : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail"),
//		oController = oView.getController(),
//		oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmployeeTable"),
//		oData = oTable.getModel().getData();
//
//		var idx = 0 ;
//		if(oData && oData.Data){
//			idx = oData.Data.length ;
//		}
//		// 사원검색 팝업 Open
//		oController.displayEmpSearchDialog(oController);
//	},
	
	onNewEmployeeLine : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail"),
		oController = oView.getController();
		oController._useCustomPernrSelection = "X";
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	onDeleteEmployeeLine  : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmployeeTable"),
		oContext = oEvent.getSource().getBindingContext();
		oModel = oTable.getModel(),
		oData = oModel.getProperty("/Data");
		
		var i = parseInt(oContext.getPath().substr(oContext.getPath().lastIndexOf("/") + 1));
		oData.splice(i,1);
		oModel.setProperty("/Data" ,common.Common.reIndexODataArray(oData));
		
		if(oData.length > 10) oTable.setVisibleRowCount(10);
		else oTable.setVisibleRowCount(oData.length);
	},
	
//	displayEmpSearchDialog : function(oController){
//		common.SearchUser1.oController = oController;
//
//		if(!oController._AddPersonDialog) {
//			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchDetail", oController);
//			oView.addDependent(oController._AddPersonDialog);
//		}
//		
//		oController._AddPersonDialog.open();		
//	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		var oModel = sap.ui.getCore().byId(oController.PAGEID + "_EmployeeTable").getModel();
		var vData = oModel.getData(), vDataLength ,
		oEmployeeTable = sap.ui.getCore().byId(oController.PAGEID + "_EmployeeTable");   
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			if(common.Common.checkNull(vData.Data)){
				vData = { Data : []};
				vDataLength = 0;
			}else{
				vDataLength = vData.Data.length;
			}
			// 기존에 있는 사람 여부 확인
			var _selPath, vPernr, oneData;
			for(var i = 0; i < vIDXs.length; i++){
				for(var j =0; j<vDataLength ; j++  ){
					_selPath = oTable.getContextByIndex(vIDXs[i]).sPath;
					vPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr");
					
					if(vPernr == vData.Data[j].Pernr){
						sap.m.MessageBox.alert(mEmpSearchResult.getProperty(_selPath + "/Ename") + oBundleText.getText("LABEL_2447"), {title : oBundleText.getText("LABEL_0053")});	// 2447:님은 이미 추가된 대상자 입니다. 
						return;
					}
					
				}
			}
			
			for(var i = 0; i < vIDXs.length; i++){
				_selPath = oTable.getContextByIndex(vIDXs[i]).sPath;
				oneData =  { Perid : mEmpSearchResult.getProperty(_selPath + "/Perid") , 
						         Pernr : mEmpSearchResult.getProperty(_selPath + "/Pernr") , 
						         Ename : mEmpSearchResult.getProperty(_selPath + "/Ename") , 
						         Orgtx : mEmpSearchResult.getProperty(_selPath + "/Fulln") , 
						         Zzjiklnt : mEmpSearchResult.getProperty(_selPath + "/Zzjiklnt") , 
						         Zbigo : "", 
						         Idx : vDataLength + i + 1,
						         ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl")};
				vData.Data.push(oneData);
			}
			oModel.setData(vData);
			if(vData.Data.length > 10) oEmployeeTable.setVisibleRowCount(10);
			else  oEmployeeTable.setVisibleRowCount(vData.Data.length);
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController._useCustomPernrSelection = "";
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail");
		var oController = oView.getController();
		
		// 공통 구분값 초기화
		oController._useCustomPernrSelection = "";
		
		oController._AddPersonDialog.close();
	},

});