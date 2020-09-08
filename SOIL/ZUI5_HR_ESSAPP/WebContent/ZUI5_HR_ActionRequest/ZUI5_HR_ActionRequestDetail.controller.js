jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail
	 */

	PAGEID : "ZUI5_HR_ActionRequestDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	vCallControlId : "",
	vCallControlType : "",
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "PA03",
	_Index : "",
	_Zflag : "X",
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
		var oDetailData = {Data : {}};
		var oDetailTableData = {Data : []};
		var vZappStatAl = "";
		var errData = {};
		
		if(vAppno != "") { // 수정 및 조회
			oController.BusyDialog.open();
			
			oModel.read("/MoveApplySet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
				],
				success : function(data, res) {
					oDetailData.Data = data.results[0];
					oDetailData.Data.ZreqDate = dateFormat.format(new Date(common.Common.setTime(data.results[0].ZreqDate)));
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
			
			
			var Datas = { Data : []}, oneData= {};
			oModel.read("/MoveApplyDetailSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				],
				success : function(data, res) {
					if(data.results && data.results.length > 0){
						for(var i =0; i < data.results.length; i++){
							oneData = {};
							data.results[i].Reqdt = dateFormat.format(new Date(common.Common.setTime(data.results[i].Reqdt)));
							data.results[i].ZappStatAl = vZappStatAl ;
							data.results[i].Ztypetx = oBundleText.getText("LABEL_1025");	// 1025:변경후
							data.results[i].Ztype = "X";
							data.results[i].Idx = i + 1;
							Object.assign(oneData, data.results[i]);
							oneData.Orgtx       = oneData.Borgtx     ;
							oneData.Zzjobrlt       = oneData.Bzzjobrlt     ;
							oneData.Zzjikgbt    = oneData.Bzzjikgbt  ;
							oneData.Zzjiklnt    = oneData.Bzzjiklnt  ;
							oneData.Zzjikcht    = oneData.Bzzjikcht  ;
							oneData.Zzconorg1t  = oneData.Bzzconorg1t;
							oneData.Zzconjik1t  = oneData.Bzzconjik1t;
							oneData.Zzidsorgt   = oneData.Bzzidsorgt ;
							oneData.Zzodsorgt   = oneData.Bzzodsorgt ;
							oneData.Zzstellt    = oneData.Bzzstellt  ;
							oneData.Ztypetx    = oBundleText.getText("LABEL_1024")  ;	// 1024:변경전
							oneData.Ztype = "";
							Datas.Data.push(oneData);
							Datas.Data.push(data.results[i]);
						}

					}
					oController._DetailTableJSonModel.setData(Datas);
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			oTable.setVisibleRowCount(Datas.Data.length);
			oController._DetailTableJSonModel.refresh();
			
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
		if(vZappStatAl == "" || vZappStatAl == "10"){
			oDetailData.Data.ZreqDate = dateFormat.format(new Date());
		}
		
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = vZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		// 진행상태 신청자, 대상자 Model 업데이트
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
			oModel.read("/MoveApplySet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I')
				],
				success : function(data, res) {
					oController._vAppno = data.results[0].Appno ;
					oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
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
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			oTable.setVisibleRowCount(1);
		}
		
		var oCheckAll = sap.ui.getCore().byId(oController.PAGEID + "_checkAll");
		oCheckAll.setSelected(false);
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl) {
			oPortalTitle.setText(oBundleText.getText("LABEL_1036") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1036:내신서 신청
			oCheckAll.setEditable(true);
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText(oBundleText.getText("LABEL_1036") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1036:내신서 신청
			oCheckAll.setEditable(true);
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_1036") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1036:내신서 신청
			oCheckAll.setEditable(false);
		}

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		this.onSetRowSpan(oEvent);
		this.initialRow();
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList",
			      data : { }
				}
			);	
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
	},
	
	onSetRowSpan : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oTds = $("td[colspan]");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		for(i=0; i<oTds.length; i++) {
			if(oTds[i].colSpan > 1){
				$("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
			}
		}

		common.Common.generateForceRowspan({
			selector : '#ZUI5_HR_ActionRequestDetail_Table-header-fixed-fixrow > tbody',
			colIndexes : [0, 1, 2, 3, 4, 5]
		});
		
		common.Common.generateRowspan({
			selector : '#ZUI5_HR_ActionRequestDetail_Table-header > tbody',
			colIndexes : [0, 1, 2, 3, 4, 5, 10, 11, 12]
		});
		
		// Header Right Border 삭제
		var oHeaderTds = $("#ZUI5_HR_ActionRequestDetail_Table-header > tbody ").find("td[data-sap-ui-colindex = '17']");
		oHeaderTds.css("border-right","0px solid");
		
		var tableDataLen = oTable.getRows().length;
		
		for(var i = 0; i < tableDataLen ; ){
			i = i+2;
			common.Common.generateForceRowspanData({
				selector : '#ZUI5_HR_ActionRequestDetail_Table-table-fixed > tbody',
				tableDataLen : i,
				colIndexes : [0, 1, 2, 3, 4]
			});
			
			common.Common.generateForceRowspanData({
				selector : '#ZUI5_HR_ActionRequestDetail_Table-table > tbody',
				tableDataLen : i,
				colIndexes : [11, 12]
			});
		}	
		
		// Table Header 높이 설정 
		var $target = $('#ZUI5_HR_ActionRequestDetail_Table-header > tbody> tr');
		
		$target.each(function() {
			$(this).css('height', '33px');
		});
		
		// Table Fixed Header 높이 설정 
		var $target = $('#ZUI5_HR_ActionRequestDetail_Table-header-fixed-fixrow > tbody> tr');
		
		$target.each(function() {
			$(this).css('height', '33px');
		});
		
		// Table Body 높이 설정 
		var $target = $('#ZUI5_HR_ActionRequestDetail_Table-table > tbody> tr');
		
		$target.each(function() {
			$(this).css('height', '33px');
		});
		
		// Table Fixed Body 높이 설정 
		var $target = $('#ZUI5_HR_ActionRequestDetail_Table-table-fixed > tbody> tr');
		
		$target.each(function() {
			$(this).css('height', '33px');
		});
		
		
		
//		$("#ZUI5_HR_ActionRequestDetail_Table-table").find("tr").last();
		var id = $('#ZUI5_HR_ActionRequestDetail_Table-table tr:last').attr('id');
		console.log(id);
		
		// Table Last Row 의 border bottom 설정
		var opt = { colIndexes : [ 0, 1, 2, 3, 4] },
			$target = $('#ZUI5_HR_ActionRequestDetail_Table-rows-row' + (tableDataLen - 2 +'-fixed'));
		
		opt.colIndexes.forEach(function(colidx) {
			$target.each(function() {
				$('td:eq('+colidx+')', this).each(function(col) {
					$(this).css("cssText", "border-bottom: 0px solid !important;");
				});
			});
		});
		
		var opt = { colIndexes : [ 11, 12] },
		$target = $('#ZUI5_HR_ActionRequestDetail_Table-rows-row' + (tableDataLen - 2));
	
		opt.colIndexes.forEach(function(colidx) {
			$target.each(function() {
				$('td:eq('+colidx+')', this).each(function(col) {
					$(this).css("cssText", "border-bottom: 0px solid !important;");
				});
			});
		});
		
	},
	
	onSetDefault : function(oController){
		// 사용년도 현재년도 Default
//		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
//		var curDate = new Date();
//		
//		var vStDate = new Date(curDate.getFullYear(), curDate.getMonth() , curDate.getDate()-1);
//		
//		
//		oController._DetailJSonModel.setProperty("/Data/Datbd", dateFormat.format(vStDate));
//		oController._DetailJSonModel.setProperty("/Data/Dated", dateFormat.format(vStDate));
//		// 도착지 설정
//		oController._DetailJSonModel.setProperty("/Data/Moved", oBundleText.getText("LABEL_1389"));	// 1389:(공장) 울산광역시 울주군 온산읍
//		// 출발지역 설정
//		oController._DetailJSonModel.setProperty("/Data/Locst", "10");
//		oController.onChangeLocst();
//		var oLocst = sap.ui.getCore().byId(oController.PAGEID + "_Locst");
//		oLocst.fireChange();
	},
	
	initialRow : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var vTableData = oController._DetailTableJSonModel.getData();
		if(!vTableData.Data || vTableData.Data.length < 2){
			oController.onPressNewRecord();
		}
	},
	// 신청내역 초기화
	onResetDetail : function(oController){
		
		oController.onSetDefault(oController);
		
	},	
	
	onAfterSelectPernr : function(oController) {
		
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
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
			var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {}, detailData = [], tempData = {};
			
			var vData = oController._DetailTableJSonModel.getProperty("/Data");
			for(var i =1; i < vData.length;){
				tempData = common.Common.copyByMetadata(oModel, "MoveApplyDetail", vData[i]);
				tempData.Znote = vData[i-1].Znote;
				tempData.Reqdt = "\/Date("+ common.Common.getTime(vData[i-1].Reqdt)+")\/";
				tempData.Borgtx      = vData[i-1].Orgtx      ;
				tempData.Bzzjobrlt      = vData[i-1].Zzjobrlt      ;
				tempData.Bzzjikgbt   = vData[i-1].Zzjikgbt   ;
				tempData.Bzzjiklnt   = vData[i-1].Zzjiklnt   ;
				tempData.Bzzjikcht   = vData[i-1].Zzjikcht   ;
				tempData.Bzzconorg1t = vData[i-1].Zzconorg1t ;
				tempData.Bzzconjik1t = vData[i-1].Zzconjik1t ;
				tempData.Bzzidsorgt  = vData[i-1].Zzidsorgt  ;
				tempData.Bzzodsorgt  = vData[i-1].Zzodsorgt  ;
				tempData.Bzzstellt   = vData[i-1].Zzstellt   ;  
				detailData.push(tempData);
				i+=2;
			}
			
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			createData.Appno = oController._vAppno;
			createData.Title = oneData.Title;
			createData.Reason = oneData.Reason;
			createData.ZreqDate = "\/Date("+ common.Common.getTime(oneData.ZreqDate)+")\/";
			createData.MoveApplyDetailSet = detailData;
			
			var errData = {};
			oModel.create("/MoveApplySet", createData, {
				success : function(data, res) {
			
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
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
		var vData = oController._DetailJSonModel.getProperty("/Data");
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		if(!oneData.Title){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1038"), {title : oBundleText.getText("LABEL_0053")});	// 1038:제목을 입력하여 주십시오.
			return false;
		}else if(!oneData.ZreqDate){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1039"), {title : oBundleText.getText("LABEL_0053")});	// 1039:신청일자를 입력하여 주십시오.
			return false;
		}else if(!oneData.Reason){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0350"), {title : oBundleText.getText("LABEL_0053")});	// 350:신청사유를 입력하여 주십시오.
			return false;
		}
		
		
		var vData = oController._DetailTableJSonModel.getProperty("/Data");
		for(var i = 0; i < vData.length ;){
			if(!vData[i].Pernr){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1040"), {title : oBundleText.getText("LABEL_0053")});	// 1040:사번을 입력하여 주시기 바랍니다.
				return false;	
			}else if(!vData[i].Reqdt){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1041"), {title : oBundleText.getText("LABEL_0053")});	// 1041:요청일자를 입력하여 주시기 바랍니다.
				return false;
			}
			i = i + 2;
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
		}
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var errData = {};	
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
				
				oModel.remove("/MoveApplySet(Appno='" + oController._vAppno + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				
				oController.BusyDialog.close();
								
				if(errData.Error == "E"){
					sap.m.MessageBox.error(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
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
	
	CheckAll : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var vSelected = oEvent.getParameters().selected;
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");

		for(var i = 0; i <vTableData.length; i++){
			oController._DetailTableJSonModel.setProperty("/Data/" + i + "/Check", vSelected);
		}
		
	},
	
	onPressNewRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var vTableData = oController._DetailTableJSonModel.getData();
		var vIdx =  vTableData.Data.length / 2 + 1 ;
		var vData= {"Idx" :  vIdx,  "Pernr" : "", "Ename" : "", "Ztype" : "", "ZappStatAl" : "" , "Ztypetx" : oBundleText.getText("LABEL_1024")  };	// 1024:변경전
		vTableData.Data.push(vData);
		vData = { "Idx" :  vIdx, "Pernr" : "", "Ename" : "", "Ztype" : "X", "ZappStatAl" : ""  , "Ztypetx" : oBundleText.getText("LABEL_1025")   };	// 1025:변경후
		vTableData.Data.push(vData);
		
		oController._DetailTableJSonModel.setData(vTableData);
		
		var tableDataLen = vTableData.Data.length;
		oTable.setVisibleRowCount(tableDataLen);
		oController._DetailTableJSonModel.refresh();
	},
	
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		if(oController._DetailTableJSonModel.getData()){
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			for(var i = vTableData.length -1 ; i >= 0 ; i--){
				if(vTableData[i].Check && vTableData[i].Check == true){
					vTableData.splice(i+1,1);
					vTableData.splice(i,1);
				}
			}
			
			var vIdx = 1;
			for(var i = 0 ; i < vTableData.length ; i++){
				vTableData[i].Idx = vIdx ;
				if(i % 2 != 0) vIdx++;  
			}
			
			oController._DetailTableJSonModel.setProperty("/Data", vTableData);
			oTable.setVisibleRowCount(vTableData.length);
			oController._DetailTableJSonModel.refresh();
		}
		
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._Index = oEvent.getSource().getParent().getIndex() ;
			oController._vEnamefg = "";
		}
		common.SearchUser1.oController = oController;

		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchDetail", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SearchOrgDialog2) {
			oController._SearchOrgDialog2 = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SearchOrgDialog2);
		}
		
		oController._SearchOrgDialog2.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		
		oController.vCallControlId = oEvent.getSource().getId();
		oController.vCallControlType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("ZUI5_HR_ActionRequest.fragment.OrgSearch", oController);
			oView.addDependent(oController._SearchOrgDialog);
		}
		oController._SearchOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}

			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			var vIndex = oController._Index + 1;
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Perid", mEmpSearchResult.getProperty(_selPath + "/Perid"));
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjiktlt", mEmpSearchResult.getProperty(_selPath + "/Zzjiktlt")); // 직급 텍스트
			
			oController._DetailTableJSonModel.setProperty("/Data/" + vIndex +"/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._DetailTableJSonModel.setProperty("/Data/" + vIndex +"/Perid", mEmpSearchResult.getProperty(_selPath + "/Perid"));
			oController._DetailTableJSonModel.setProperty("/Data/" + vIndex +"/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Orgeh", mEmpSearchResult.getProperty(_selPath + "/Orgeh")); // 조직
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Orgtx", mEmpSearchResult.getProperty(_selPath + "/Fulln")); // 조직 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjobrl", mEmpSearchResult.getProperty(_selPath + "/Zzjobrl")); // 직무
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjobrlt", mEmpSearchResult.getProperty(_selPath + "/Zzjobrlt")); // 직무 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjikch", mEmpSearchResult.getProperty(_selPath + "/Zzjikch")); // 직책
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjikcht", mEmpSearchResult.getProperty(_selPath + "/Zzjikcht"));// 직책 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjikgb", mEmpSearchResult.getProperty(_selPath + "/Zzjikgb")); // 직군
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjikgbt", mEmpSearchResult.getProperty(_selPath + "/Zzjikgbt")); // 직군 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjikln", mEmpSearchResult.getProperty(_selPath + "/Zzjikln")); // 직위
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzjiklnt", mEmpSearchResult.getProperty(_selPath + "/Zzjiklnt")); // 직위 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzconjik1t", mEmpSearchResult.getProperty(_selPath + "/Zzconjik1t")); //겸직 직책 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzconorg1t", mEmpSearchResult.getProperty(_selPath + "/Zzconorg1t")); //겸직 조직 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzidsorgt", mEmpSearchResult.getProperty(_selPath + "/Zzidsorgt")); // 파견 사내 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzodsorgt", mEmpSearchResult.getProperty(_selPath + "/Zzodsorgt")); // 파견 사외 텍스트
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._Index +"/Zzstellt", mEmpSearchResult.getProperty(_selPath + "/Zzstellt")); // 기타직무 텍스트
			
			
			oController._Index = "";
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		
		oController._AddPersonDialog.close();
	},
	
	openSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		
		oController.vCallControlId = oEvent.getSource().getId();
		oController.vCallControlType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!oController._SearchDialog) {
			oController._SearchDialog = sap.ui.jsfragment("ZUI5_HR_ActionRequest.fragment.SearchDialog", oController);
			oView.addDependent(oController._SearchDialog);
		}
		oController._SearchDialog.open();
	},
	
	openZzjobrlSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		
		
		var vOrgeh = oController._DetailTableJSonModel.getProperty(
				sap.ui.getCore().byId(oEvent.getSource().getId()).getBindingContext().sPath+ "/Orgeh"); 
		
		if(common.Common.checkNull(vOrgeh) || vOrgeh * 1 == 0){ 
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1042"), {title : oBundleText.getText("LABEL_0053")});	// 1042:조직을 선택하여 주십시오.
			return;
		}
		
		oController.vCallControlId = oEvent.getSource().getId();
		
		if(!oController._ZzjobrlSearchDialog) {
			oController._ZzjobrlSearchDialog = sap.ui.jsfragment("ZUI5_HR_ActionRequest.fragment.ZzjobrlDialog", oController);
			oView.addDependent(oController._ZzjobrlSearchDialog);
		}
		oController._ZzjobrlSearchDialog.open();
		
 	},
	
	
	
	onGetType : function(oController){
//		oController.vCallControlType
		
	},
});