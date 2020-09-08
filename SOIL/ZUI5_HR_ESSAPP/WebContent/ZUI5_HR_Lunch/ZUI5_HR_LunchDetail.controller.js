jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Lunch.ZUI5_HR_LunchDetail
	 */

	PAGEID : "ZUI5_HR_LunchDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vZworktyp : "HR34",
	_vEnamefg : "",
	_oControl  : null,
	_vFromPage : "",
	_vAppno : "",
	_Payamt : 0,
	BusyDialog : new sap.m.BusyDialog(),
	
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
		bus.subscribe("app", "OpenWindow", this.SmartSizing,
				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
				this);
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();
		var oRow, oCell;
		var oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamilyBold")	// 결재선
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 3,
			content : new sap.m.Toolbar({
						content : [new sap.m.Text({text : "{ApprEnames}"}).addStyleClass("FontFamily")]
					 }).addStyleClass("ToolbarNoBottomLine")
			}).addStyleClass("MatrixData");
		oCell.setModel(oController._DetailJSonModel).bindElement("/Data");
		oRow.addCell(oCell);
		
		oTargetMatrix.addRow(oRow);
		
	},
	
	onBeforeShow : function(oEvent) {
		var oController = this;
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		oController._ApprovalLineModel.setData(null);
		
		common.ApprovalLineAction.oController = oController;
		
		var vZappStatAl = "";
		var oDetailTitle = "" ;
		oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var oModel = sap.ui.getCore().getModel("ZHR_LUNCH_FEE_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oDetailTableData = {Data : []};
		var oDetailData = {Data : {}};
		var errData = {};
		
		if(oController._vAppno != ""){  // 수정 및 조회
			oController.BusyDialog.open();
			oModel.read("/LunchFeeExpensesApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
				],
				success : function(data, res) {
					var OneData = data.results[0];
					OneData.Reqym = OneData.Reqym == "000000" ? "" :  OneData.Reqym.substring(0,4) + "-" + OneData.Reqym.substring(4,6) + "-01" ; 
					oController._vAppno = OneData.Appno;
					OneData.Reqamt = common.Common.numberWithCommas(OneData.Reqamt);
					oDetailData.Data = OneData;
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
			
			var vReqym = oDetailData.Data.Reqym.split('-');
			oModel.read("/LunchFeeExpensesApplDetailSet", { 
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Reqym', sap.ui.model.FilterOperator.EQ, vReqym[0] + vReqym[1]),
				],
				success : function(data, res) {
					if(data && data.results.length) {
						data.results.forEach(function(element) {
							element.ZappStatAl = vZappStatAl;
//							element.Reqdt = dateFormat.format(element.Reqdt);
							oDetailTableData.Data.push(element);
						});
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController._DetailTableJSonModel.setData(oDetailTableData);
			var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			oDetailTable.setVisibleRowCount(oDetailTableData.Data.length);
			
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
						oController.onBack();
					}
				});
				return ;
			}
		}
		
		// 공통적용사항 Start
		// 상세화면 Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = vZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		oController._DetailTableJSonModel.setData(oDetailTableData);
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
		
		// 공통적용사항 End
		
		// 신규 결재번호 채번
		if(oController._vAppno == "") {
			oController.BusyDialog.open();
			var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			oDetailTable.setVisibleRowCount(1);
			
			var errData = {}; 
			oModel.read("/LunchFeeExpensesApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I')
				],
				success : function(data, res) {
					oController._vAppno = data.results[0].Appno ;
					oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
					
					oController.BusyDialog.close();
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
			
			var addZero = function(d) {
				if(d < 10) return "0" + d;
				else return "" + d;
			};
			
			// Default 신청년월 - 지난 월
			var  curDate = new Date();
			oController._DetailJSonModel.setProperty("/Data/Reqym", curDate.getFullYear() + "-" + addZero(curDate.getMonth() + 1) + "-01");
			
			if(_gAuth == "E") oController.onChangeZreqym();
		}
		
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		
		// 결재 상태에 따라 Page Header Text 수정
		if( vZappStatAl == "" ){
			oDetailTitle.setText(oBundleText.getText("LABEL_1383") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1383:중식비 예외자 신청
		}else if(vZappStatAl == "10"){
			oDetailTitle.setText(oBundleText.getText("LABEL_1383") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1383:중식비 예외자 신청
		}else{
			oDetailTitle.setText(oBundleText.getText("LABEL_1383") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1383:중식비 예외자 신청
		}

	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_Lunch.ZUI5_HR_LunchList",
			      data : { }
				}
			);	
		}
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"),{	// 55:유효하지 않은 날짜형식입니다.
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	onAfterSelectPernr : function(oController){
		if(oController._MandateDialog && oController._MandateDialog.isOpen()){
			
		}else{
			oController.onResetDetail(oController);
			oController.onChangeZreqym(oController);
		}		
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		oController._DetailTableJSonModel.setData({Data : []});	// 목록
		
		// 중식비 유형/ 지급일수/ 지급금액 Clear
		oController._DetailJSonModel.setProperty("/Data/Lnfty", "");
		oController._DetailJSonModel.setProperty("/Data/Reqdays", "");
		oController._DetailJSonModel.setProperty("/Data/Reqamt", "");
	},	
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();
	},
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split("-");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
	
	// 급여반영월 변경 Event - 선택한 급여반영월의 휴일,근태 정보 조회
	onChangeZreqym : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();
		var DetailData = oController._DetailJSonModel.getProperty("/Data");
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var onProcess = function(){
			var oDatas = { Data : []};
			var errData = {}, aFilters = [];
		
			if(DetailData.Reqym && DetailData.Reqym != ""){
				
				var vReqym = DetailData.Reqym.split('-');
				aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, DetailData.Encid));
				aFilters.push(new sap.ui.model.Filter('Reqym', sap.ui.model.FilterOperator.EQ, vReqym[0] + vReqym[1]));
				
				
				var oModel = sap.ui.getCore().getModel("ZHR_LUNCH_FEE_SRV");
				oModel.read("/LunchFeeExpensesApplDetailSet", {
					async : false,
					filters : [
						aFilters
					],
					success : function(data, res) {
						data.results.forEach(function(element) {
							element.ZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
							oDatas.Data.push(element);
						});
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				oController.BusyDialog.close();
			}
			oController._DetailTableJSonModel.setData(oDatas);
			oDetailTable.setVisibleRowCount(oDatas.Data.length);
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return ;
			}
		};
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	onCheckPayok : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var oJSonModel = oDetailTable.getModel();
		var oData = oJSonModel.getProperty("/Data");
		var vZReqamt = 0, vDays = 0;
		for(var i = 0; i < oData.length ; i++){
			if(oData[i].Payok == true){
				vZReqamt += ( oData[i].Betrg * 1 ) ;
				vDays += 1;
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data/Reqdays", vDays);
		oController._DetailJSonModel.setProperty("/Data/Reqamt",common.Common.numberWithCommas(vZReqamt));
	},
	
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
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
			var oModel = sap.ui.getCore().getModel("ZHR_LUNCH_FEE_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			var vReqym = oneData.Reqym.split('-');
			
			createData = common.Common.copyByMetadata(oModel, "LunchFeeExpensesAppl", oneData);
			createData.Pernr = oneData.Pernr ;
			createData.Reqym = vReqym[0] + vReqym[1];
			createData.Reqamt = common.Common.removeComma(createData.Reqamt);
			createData.Reqdays = common.Common.checkNull(createData.Reqdays) ? "0" : "" + createData.Reqdays;
			createData.Prcty = vPrcty;
			createData.Waers = "KRW";
			createData.Actty = _gAuth;
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			vTableData.forEach(function(element) {
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "LunchFeeExpensesApplDetail", element);
				vDetailData.Appno = oController._vAppno ;
				vDetailData.Reqdt = "\/Date("+ common.Common.getTime(element.Reqdt)+")\/";
				vDetailDataList.push(vDetailData);
			});
			
			createData.LunchFeeDetailNav = vDetailDataList;
			
			var saveError = "",
				errorList = [];
			oModel.create("/LunchFeeExpensesApplSet", createData, {
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
	
	onValidationData : function(oController, vPrcty){
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		
		if(!vData.Pernr || vData.Pernr == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return false;
		}
		
		if(common.Common.checkNull(vData.Reqdays) || vData.Reqdays * 1 == 0 ){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1387"));	// 1387:지급일이 선택되지 않았습니다. 지급일자를 선택한 후 신청하세요.
			return false;
		}
		
		if(common.Common.checkNull(vData.Lnfty)){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2900"));	// 2900:중식비 유형이 선택되지 않았습니다.
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
			
			var oData = oController._DetailTableJSonModel.getProperty("/Data");
			if(!oData || oData.length < 1 ){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1388"), {title : oBundleText.getText("LABEL_0053")});	// 1388:신청내역이 없습니다.
				return false;
			}
			
		}
		
		return true;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Lunch.ZUI5_HR_LunchDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_LUNCH_FEE_SRV");
				
				oModel.remove("/LunchFeeExpensesApplSet(Appno='" + oController._vAppno + "')", {
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