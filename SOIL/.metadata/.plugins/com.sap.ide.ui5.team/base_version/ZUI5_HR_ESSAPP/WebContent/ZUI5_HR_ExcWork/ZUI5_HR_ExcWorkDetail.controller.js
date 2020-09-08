jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail
	 */

	PAGEID : "ZUI5_HR_ExcWorkDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_OrgehJSonModel : new sap.ui.model.json.JSONModel(),
	_OrgehTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	_ErrorTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_UploadTableJSonModel : new sap.ui.model.json.JSONModel(),
	
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM02",
	_ObjList : [],
	_vOrgeh : "",
	_vOrgtx : "",
	_useCustomPernrSelection : "",
	_selectionRowIdx : null,
	_thisWeekTxt : "",
	_nextWeekTxt : "",
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var oDetailData = {Data : {}};
		var oDetailTableData = {Data : []};
		var vZappStatAl = "";
		var errData = {};
		
		if(vAppno != "") { // 수정 및 조회
			oController.BusyDialog.open();
			
			oModel.read("/ExceptionWorkListSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
				],
				success : function(data, res) {
					oDetailData.Data = data.results[0];
					oDetailData.Data.Wkbeg = dateFormat.format(oDetailData.Data.Wkbeg);
					oDetailData.Data.Wkend = dateFormat.format(oDetailData.Data.Wkend);
					oDetailData.Data.Pernr = oDetailData.Data.Zpernr ;
					oController._DetailJSonModel.setData(oDetailData);
					
					oController._TargetJSonModel.setData({Data : {Pernr : oDetailData.Data.Zpernr}});
					oController._TargetJSonModel.setData({Data : {Encid : oDetailData.Data.Encid}});
					
					vZappStatAl = oDetailData.Data.ZappStatAl;
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.onSetRtext(oController);
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});
				return ;
			}
			
			oModel.read("/ExceptionWorkDetailSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno)
				],
				success : function(data, res) {
					if(data && data.results.length) {
						var vIdx = 1;
						data.results.forEach(function(element) {
							element.Idx = vIdx++;
							element.ZappStatAl = vZappStatAl;
							element.Datum = dateFormat.format(element.Datum);
							oDetailTableData.Data.push(element);
						});
						
						oController._DetailTableJSonModel.setData(oDetailTableData);
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			oDetailTable.setVisibleRowCount(oDetailTableData.Data.length);
			
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
		/****************************************************/
		/*********** 공통적용사항 End	 			 ************/
		/****************************************************/
		
		// 신규 결재번호 채번
		if(vAppno == "") {
			oController.BusyDialog.open();
			
			oModel.read("/ExceptionWorkListSet", {
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
		}
		
		// 근무일정규칙 콤보 조회
		if(_gAuth == 'E') {
			oController.onSetRtext(oController);
		}
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl) {
			oPortalTitle.setText(oBundleText.getText("LABEL_1978") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1978:예외근무 신청
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText(oBundleText.getText("LABEL_1978") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1978:예외근무 신청
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_1978") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1978:예외근무 신청
		}

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		this.onSetRowSpan();
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkList",
			      data : { }
				}
			);	
		}
		
	},
	
	onSetRowSpan : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		common.Common.generateForceRowspan({
			selector : '#ZUI5_HR_ExcWorkDetail_DetailTable-header > tbody',
			colIndexes : [0, 1, 2, 3, 6, 7, 8, 9, 10]
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
	},
	
	// 개인별근로시간조회 후 추가
	onPressSelectByWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail"),
			oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._DetailJSonModel.getProperty("/Data/Wkbeg")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2547"), {title : oBundleText.getText("LABEL_0053")});	// 2547:예외근무 신청기간을 선택하여 주십시오.
			return;
		}
		
		if(!oController._WorktimeDialog) {
			oController._WorktimeDialog = sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.WorktimeDialog", oController);
			oView.addDependent(oController._WorktimeDialog);
		}
		
		var oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog");
		
		oWorktimeDialog.getModel().setProperty("/Data/Orgeh", oController._TargetJSonModel.getProperty("/Data/Orgeh"));
		oWorktimeDialog.getModel().setProperty("/Data/Orgtx", oController._TargetJSonModel.getProperty("/Data/Orgtx"));
		
		oController.searchWorktime();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail"),
			oController = oView.getController();
		
		oController.vCallControlId = oEvent.getSource().getId();
		oController.vCallControlType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!oController._SerachOrgDialogInView) {
			oController._SerachOrgDialogInView = sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.OrgSearch", oController);
			oView.addDependent(oController._SerachOrgDialogInView);
		}
		oController._SerachOrgDialogInView.open();
	},
	
	searchWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table"),
			vDatum = oController._DetailJSonModel.getProperty("/Data/Wkbeg"),
			vOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog").getModel().getProperty("/Data/Orgeh"),
			vIdx = 1;
		
		if(!vOrgeh) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0650"), {title : oBundleText.getText("LABEL_0053")});	// 650:부서를 선택하여 주십시오.
			return;
		}
		
		oController.BusyDialog.open();
		var onProcess = function(){
			oModel.read("/OrgehWorkTimeSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, _gAuth),
					new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, vOrgeh),
					new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
				],
				success : function(data, res) {
					if(data.results && data.results.length) {
						data.results.forEach(function(elem) {
							if(vIdx == 1) {
								oController._thisWeekTxt = elem.Gigan1;
								oController._nextWeekTxt = elem.Gigan2;
							}
							
							elem.Idx = vIdx++;
							elem.Wtm01 = (!elem.Wtm01 || elem.Wtm01 == "0.00") ? "0" : elem.Wtm01;
							elem.Wtm02 = (!elem.Wtm02 || elem.Wtm02 == "0.00") ? "0" : elem.Wtm02;
							elem.Wtm03 = (!elem.Wtm03 || elem.Wtm03 == "0.00") ? "0" : elem.Wtm03;
							elem.Wtm04 = (!elem.Wtm04 || elem.Wtm04 == "0.00") ? "0" : elem.Wtm04;
							elem.Wtm05 = (!elem.Wtm05 || elem.Wtm05 == "0.00") ? "0" : elem.Wtm05;
							elem.Wtm06 = (!elem.Wtm06 || elem.Wtm06 == "0.00") ? "0" : elem.Wtm06;
							elem.Wtm07 = (!elem.Wtm07 || elem.Wtm07 == "0.00") ? "0" : elem.Wtm07;
							elem.Wtme1 = (!elem.Wtme1 || elem.Wtme1 == "0.00") ? "0" : elem.Wtme1;
							elem.Wtme2 = (!elem.Wtme2 || elem.Wtme2 == "0.00") ? "0" : elem.Wtme2;
						});
						
						oWorktimeTable.getModel().setData({Data : data.results});
					}
				},
				error : function(Res) {
					console.log(Res);
				}
				
			});
			oController._WorktimeDialog.open();
			oController.BusyDialog.close();
		}
		setTimeout(onProcess, 100);
		
	},
	
	onConfirmWorktimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			vTableData = oController._DetailTableJSonModel.getData(),
			oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table"),
			mWorktimeTableModel = oWorktimeTable.getModel(),
			vIDXs = oWorktimeTable.getSelectedIndices(),
			vLastIndexNumber = vTableData.Data.length;
			addItem = {};
		
		if(!vIDXs.length) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0649"));	// 649:대상을 선택하여 주세요.
			return;
		}

		vIDXs.forEach(function(idx) {
			var _selPath = oWorktimeTable.getContextByIndex(idx).sPath,
			svPernr = mWorktimeTableModel.getProperty(_selPath + "/Pernr"),
			svPerid = mWorktimeTableModel.getProperty(_selPath + "/Perid"),
			svEname = mWorktimeTableModel.getProperty(_selPath + "/Ename"),
			svEncid = mWorktimeTableModel.getProperty(_selPath + "/Encid"),
			
			
			addItem = {};
			addItem = mWorktimeTableModel.getProperty(_selPath);
			addItem.Idx = ++vLastIndexNumber;
			addItem.ZappStatAl = "";
			addItem.Reqpnr = svPernr;
			addItem.Perid = svPerid;
			addItem.Encid = svEncid;
			addItem.Ename = svEname;
			addItem.Datum = oController._DetailJSonModel.getProperty("/Data/Wkbeg");
			addItem.Excwrk2 = oController._DetailJSonModel.getProperty("/Data/Excwrk");
			addItem.Linrs = oController._DetailJSonModel.getProperty("/Data/Excren");
			
			vTableData.Data.push(addItem);
			
			oController.onSearchWorkSchedule(oController, addItem.Idx - 1, 
					addItem.Reqpnr, 
					addItem.Datum,
					addItem.Encid);
		});
		
		oController._DetailTableJSonModel.setData(vTableData);
		oController._DetailTableJSonModel.refresh();
		oDetailTable.setVisibleRowCount(vTableData.Data.length);
		
		oWorktimeTable.removeSelectionInterval(0, vIDXs[vIDXs.length - 1]);
		
		oController.onCloseWorktimeDialog();
	},
	
	onCloseWorktimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail"),
			oController = oView.getController(),
			oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table");
		
		oWorktimeDialog.getModel().setProperty("/Data/Orgeh", undefined);
		oWorktimeDialog.getModel().setProperty("/Data/Orgtx", undefined);
		
		oWorktimeTable.getModel().setData({Data : []});
		
		oWorktimeDialog.close();
	},
	
	
	onRowPernrChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		var vSeqno = oEvent.getSource().getCustomData()[0].getValue();
		var vIdx = vSeqno * 1 - 1 ;	
		
		oController._vOrgeh = oController._TargetJSonModel.getProperty("/Data/Orgeh");
		oController._vOrgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx");
		oController._useCustomPernrSelection = "X";
		oController._selectionRowIdx = vIdx;
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	// 복사
	onPressCopy : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vIndex = oTable.getSelectedIndices();
		
		if(vIndex.length == 0 || vIndex.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0027"), {title : oBundleText.getText("LABEL_0053")});	// 27:복사할 데이터를 한 건만 선택하여 주십시오.
			return;
		}
		
		var vTableData = oController._DetailTableJSonModel.getData();
		var orgData = oController._DetailTableJSonModel.getProperty(oTable.getContextByIndex(vIndex[0]).sPath);
		var copyData = {};
		var vIdx = 0;
		
		Object.keys(orgData).map(function(key, index) {
			copyData[key] = orgData[key];
		});
		copyData.Idx = vTableData.Data.length + 1;
		
		vTableData.Data.push(copyData);
		oController._DetailTableJSonModel.setData(vTableData);
		oController._DetailTableJSonModel.refresh();
		
		oTable.clearSelection();
		oTable.setVisibleRowCount(vTableData.Data.length);
	},
	
	// 대상자 선택
	onTargetEmpList : function(oEvent, vCheck){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.ZUI5_HR_VacationDetail");
		var oController = oView.getController();
		
		if(!oController._DetailInfoDialog) {
			oController._DetailInfoDialog = sap.ui.jsfragment("ZUI5_HR_Vacation.fragment.DetailInfoDialog", oController);
			oView.addDependent(oController._DetailInfoDialog);
		}
		
		if(vCheck && vCheck == "X"){
			oController._vSearch = "X";
		} else {
			oController._vSearch = "";
		}
		
		oController._DetailInfoDialog.open();
	},
	
	// 대상자 선택 >> 삭제
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var delRecords = oDetailTable.getSelectedIndices();
		
		if(delRecords.length < 1) {
			new sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		var procDeleteRecord = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var detailData = oController._DetailTableJSonModel.getData().Data;
				var tableItemLength = oController._DetailTableJSonModel.getData().Data.length;
				for(var i = delRecords.length -1 ; i >= 0 ; i--){
					detailData.splice(delRecords[i], 1);
				}
				
				oDetailTable._aSelectedPaths = [];
				oDetailTable.getModel().setData({Data : common.Common.reIndexODataArray(detailData)});
				oDetailTable.setVisibleRowCount(detailData.length);
				oDetailTable.clearSelection();
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : procDeleteRecord
		});
		
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		oController._DetailTableJSonModel.setData({Data : []});	// 목록
		
		// 부서별 근무조 현황 초기화
		oController._OrgehJSonModel.setData({Data : {}});
		oController._OrgehTableJSonModel.setData({Data : []});
	},	
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 근무일정규칙 조회
		oController.onSetRtext(oController);
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		
		var vOData = oController.onValidationData(oController, "T");
		
		if( vOData == false) return;
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		
		var vOData = oController.onValidationData(oController, "C");
		
		if( vOData == false) return;
		oController.onPreApprovalDialog(oController);
	},
	
	onConfirmApprovalDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C")
	},

	onCloseApprovalDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail"),
			oController = oView.getController(),
			oPreApprovalDialog = sap.ui.getCore().byId(oController.PAGEID + "_PreApprovalDialog");
		
		oPreApprovalDialog.close();
	},
	
	// 신청시 팝업
	onPreApprovalDialog : function(oController) {
		if(!oController._PreApprovalDialog) {
			oController._PreApprovalDialog = sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.PreApprovalDialog", oController);
			oView.addDependent(oController._PreApprovalDialog);
		}

		var onProcess = function(){
			
			var oPreApprovalDialog = sap.ui.getCore().byId(oController.PAGEID + "_PreApprovalDialog");
			var oApprovalTable = sap.ui.getCore().byId(oController.PAGEID + "_PreApproval_Table");
			var detailData = oController._DetailTableJSonModel.getProperty("/Data");
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {}, errData = {}, vIdx = 1;
			createData = common.Common.copyByMetadata(oModel, "WorkTimeSummary", oneData);
			createData.Apbegda = "\/Date("+ common.Common.getTime(oneData.Wkbeg)+")\/";	
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._DetailTableJSonModel.getProperty("/Data");

			for(var i = 0; i< vTableData.length; i++){
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "WorkTimeSummary", vTableData[i]);
				vDetailData.Pernr = vTableData[i].Reqpnr ;
				vDetailData.Appno = oController._vAppno ;
				vDetailData.Seqnr = String(vTableData[i].Idx);
				vDetailData.Tim15 = vTableData[i].Ttext; 
				vDetailData.Datum = "\/Date("+ common.Common.getTime(vTableData[i].Datum)+")\/";
				vDetailData.Offsup = vTableData[i].Offsup;
				vDetailData.Otprog = vTableData[i].Otprog;				
				vDetailDataList.push(vDetailData);
			}
			createData.WorkSummaryNav = vDetailDataList;
			
			var saveError = "",
				errorList = [];
			oModel.create("/WorkTimeSummarySet", createData, {
				success : function(data, res) {
					if(data.WorkSummaryNav.results && data.WorkSummaryNav.results.length) {
						data.WorkSummaryNav.results.forEach(function(elem) {
							if(vIdx == 1) {
								oController._thisWeekTxt = elem.Gigan1;
								oController._nextWeekTxt = elem.Gigan2;
							}
							
							elem.Idx = vIdx++;
							elem.Wtm01 = (!elem.Wtm01 || elem.Wtm01 == "0.00") ? "0" : elem.Wtm01;
							elem.Wtm02 = (!elem.Wtm02 || elem.Wtm02 == "0.00") ? "0" : elem.Wtm02;
							elem.Wtm03 = (!elem.Wtm03 || elem.Wtm03 == "0.00") ? "0" : elem.Wtm03;
							elem.Wtm04 = (!elem.Wtm04 || elem.Wtm04 == "0.00") ? "0" : elem.Wtm04;
							elem.Wtm05 = (!elem.Wtm05 || elem.Wtm05 == "0.00") ? "0" : elem.Wtm05;
							elem.Wtm06 = (!elem.Wtm06 || elem.Wtm06 == "0.00") ? "0" : elem.Wtm06;
							elem.Wtm07 = (!elem.Wtm07 || elem.Wtm07 == "0.00") ? "0" : elem.Wtm07;
							elem.Wtme1 = (!elem.Wtme1 || elem.Wtme1 == "0.00") ? "0" : elem.Wtme1;
							elem.Wtme2 = (!elem.Wtme2 || elem.Wtme2 == "0.00") ? "0" : elem.Wtme2;
						});
						
						oApprovalTable.getModel().setData({Data : data.WorkSummaryNav.results});
					} 
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
			}else{
				oController._PreApprovalDialog.open();
			} 	
		};
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		
		var onProcess = function(){
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
			var oPreApprovalDialog = sap.ui.getCore().byId(oController.PAGEID + "_PreApprovalDialog");
			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "ExceptionWorkList", oneData);
			createData.Zpernr = oneData.Pernr ;
			createData.Wkbeg = "\/Date("+ common.Common.getTime(createData.Wkbeg)+")\/";
			createData.Wkend = "\/Date("+ common.Common.getTime(createData.Wkend)+")\/";
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			for(var i = 0; i< vTableData.length; i++){
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "ExceptionWorkDetail", vTableData[i]);
				vDetailData.Appno = oController._vAppno ;
				vDetailData.Zseqnr = String(vTableData[i].Idx);
				vDetailData.Datum = "\/Date("+ common.Common.getTime(vTableData[i].Datum)+")\/";
				vDetailDataList.push(vDetailData);
				for(var j=0; j<vTableData.length; j++){
					if(i == j) continue;
					
					if(vTableData[i].Perid == vTableData[j].Perid && vTableData[i].Datum == vTableData[j].Datum ){
						sap.m.MessageBox.alert(oBundleText.getText("LABEL_2601"), {title : oBundleText.getText("LABEL_0053")});	// 2601:중복된 내용의 대상자가 존재합니다.
						oController.BusyDialog.close();
						if(oPreApprovalDialog) oPreApprovalDialog.close();
						return ;
					}
				}
			}
			
			// 신청일 경우 대근자의 근로시간에 표기되었던 Tim21 , Tim22 정보를 같이 전송한다. 
			if(vPrcty =="C"){
				var oPreApprovalTable = sap.ui.getCore().byId(oController.PAGEID + "_PreApproval_Table");
				var oPreApprovalData = oPreApprovalTable.getModel().getProperty("/Data");
				if(oPreApprovalData && oPreApprovalData.length > 0){
					for(var i = 0; i < oPreApprovalData.length; i++){
						for(var j = 0; j< vDetailDataList.length; j++){
							if(oPreApprovalData[i].Pernr == vDetailDataList[j].Reqpnr){
								vDetailDataList[j].Tim21 = oPreApprovalData[i].Tim21;
								vDetailDataList[j].Tim22 = oPreApprovalData[i].Tim22;
								continue;
							}
						}
					}
				}
			}
			
			createData.ExceptionWorkNav = vDetailDataList;
			
			var saveError = "",
				errorList = [];
			oModel.create("/ExceptionWorkListSet", createData, {
				success : function(data, res) {
					if(data) {
						saveError = data.Error;
						errorList = data.ExceptionWorkNav.results;
					} 
				},
				error : function (Res) {
					var errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(saveError == 'X') {
				oController.callSaveErrorDialog(oController, errorList);
				if(oPreApprovalDialog) oPreApprovalDialog.close();
				return;
			}

			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				if(oPreApprovalDialog) oPreApprovalDialog.close();
				return;
			}
			if(oPreApprovalDialog) oPreApprovalDialog.close();
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		
		if(!oController._ErrorDialog) {
			oController._ErrorDialog = sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.SaveError", oController);
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
		} else if(!oneData.Wkbeg){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2546"), {title : oBundleText.getText("LABEL_0053")});	// 2546:예외근무 신청기간 선택하여 주십시오.
			return false;
		}
		
		var targetDatas = oController._DetailTableJSonModel.getProperty("/Data");
		if(targetDatas.constructor !== Array || targetDatas.length < 1) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0025"), {title : oBundleText.getText("LABEL_0053")});	// 25:변경 대상자를 선택하여 주십시오.
			return false;
		}
		
		var isDup = false, isInputValid = true, aPernr = [];
		targetDatas.some(function(elem, index) {
			if(!elem.Datum || !elem.Tprog || !elem.Excwrk2) {
				isInputValid = false;
				return true;
			}
		});
		
		if(!isInputValid) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2549"), {title : oBundleText.getText("LABEL_0053")});	// 2549:예외적용일, 예외적용근무시간, 예외특근유형을 모두 선택하세요.
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
		}
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
				
				oModel.remove("/ExceptionWorkListSet(Appno='" + oController._vAppno + "')", {
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
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		var vTableData = oController._DetailTableJSonModel.getData();
		var vData = vTableData.Data;
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			if(oController._selectionRowIdx != null) {
				if(vIDXs.length > 1) {
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
					return;
				} 
			}
				
			for(var i = 0; i < vIDXs.length ; i ++){
				var _selPath = oTable.getContextByIndex(vIDXs[i]).sPath;
				
				if(oController._selectionRowIdx != null) {
					
					oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Reqpnr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
					oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Encid", mEmpSearchResult.getProperty(_selPath + "/Encid"));
					oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Perid", mEmpSearchResult.getProperty(_selPath + "/Perid"));
					oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
					oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/ZappStatAl", "");
					
					oController.onSearchWorkSchedule(oController, oController._selectionRowIdx, 
																  mEmpSearchResult.getProperty(_selPath + "/Pernr"), 
																  oDetailTable.getModel().getProperty("/Data/" + oController._selectionRowIdx + "/Datum"),
																  mEmpSearchResult.getProperty(_selPath + "/Encid") 
																	);
				} else {
					if(!vTableData.Data.length) {
						vTableData.Data = [];
					}
					var addData = {};
					addData.Idx = vTableData.Data.length + 1;
					addData.Reqpnr = mEmpSearchResult.getProperty(_selPath + "/Pernr");
					addData.Encid = mEmpSearchResult.getProperty(_selPath + "/Encid");
					addData.Perid = mEmpSearchResult.getProperty(_selPath + "/Perid");
					addData.Ename = mEmpSearchResult.getProperty(_selPath + "/Ename");
					addData.Datum = oController._DetailJSonModel.getProperty("/Data/Wkbeg");
					addData.Excwrk2 = oController._DetailJSonModel.getProperty("/Data/Excwrk");
					addData.ZappStatAl = "";
					
					vTableData.Data.push(addData);
					oController._DetailTableJSonModel.setData(vTableData);
					
					oController.onSearchWorkSchedule(oController, addData.Idx - 1, 
							  addData.Reqpnr, 
							  addData.Datum,
							  addData.Encid);

				}
			}
			oDetailTable.setVisibleRowCount(vTableData.Data.length);
			oController._DetailTableJSonModel.refresh();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._vOrgeh = '';
		oController._vOrgtx = '';
		oController._useCustomPernrSelection = '';
		oController._selectionRowIdx = null;
	},
	
	onSetRtext : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var items = [];
		
		oModel.read("/SchkzCodeListSet", {
			async: false,
			filters: [
//				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oController._TargetJSonModel.getProperty("/Data/Pernr"))
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._TargetJSonModel.getProperty("/Data/Encid"))
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						items.push({
							key : data.results[i].Schkz,
							text : data.results[i].Rtext
						});
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		var vTableData = oController._DetailTableJSonModel.getData();
		vTableData.Schkzs = items;
		
		oController._DetailTableJSonModel.setData(vTableData);
	},
	
	onCheckWorkSchedule : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		var vPernr = oEvent.getSource().getCustomData()[0].getValue();
		var vDatum = oEvent.getSource().getCustomData()[1].getValue();
		var vEncid = oEvent.getSource().getCustomData()[2].getValue();
		
		if(!vDatum) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2544"), {title : oBundleText.getText("LABEL_0053")});	// 2544:예외 적용일을 선택하여 주십시오.
			return;
		}
		
		if(!oController._PernrTprogDialog) {
			oController._PernrTprogDialog = sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.PernrTprog", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TprogTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");

		var vData = {Data : []};
		
		var aFilters = [
//			new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr),
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
			new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
		];
		
		oModel.read("/PernrTprogListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				// 기준일, 근무형태
				var headerData = {Data : {}};
				headerData.Data.Datum = vDatum
				
				if(data.results && data.results.length > 0) {
					headerData.Data.Rtext = data.results[0].Rtext;
					
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						vData.Data.push(data.results[i]);
					}
					
					oController._TprogTableJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length);
				}
				
				oController._TprogJSonModel.setData(headerData);
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController._PernrTprogDialog.open();
	},
	
	onChangeBegda : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		var oControl = oEvent.getSource();
		var vBegda = "", vEndda = "";
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});

		var dateDiff = function(_date1, _date2) {
		    var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
		    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);
		 
		    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
		    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
		 
		    var diff = diffDate_2.getTime() - diffDate_1.getTime();
		    diff = Math.ceil(diff / (1000 * 3600 * 24));
		 
		    return diff-1;
		}
		
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"));	// 55:유효하지 않은 날짜형식입니다.
		}else if(oEvent.getSource().getValue() != ""){
			var curDate = new Date();
			var from = oEvent.getSource().getValue().split("-")
			var selectedDate = new Date(from[0], from[1] - 1, from[2]);
			
			var vDiffDays = dateDiff(curDate, selectedDate);
			if(vDiffDays >= -14){ // 과거 2주전 까지 신청 이 가능
				var vDay = 6 - selectedDate.getDay();
				var vEndday = from[2] * 1 + vDay ;
				var vEndMonth = from[1] * 1 - 1 ;
				vEndda = dateFormat.format(new Date(from[0], vEndMonth , vEndday));
				vBegda =  oEvent.getSource().getValue() ;
			}else{
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2419"));	// 2419:과거 2주전까지만 신청이 가능합니다.
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data/Wkbeg", vBegda);
		oController._DetailJSonModel.setProperty("/Data/Wkend", vEndda);
		
		
		if(vBegda != "" && vEndda != ""){
			var oDetailData = oController._DetailTableJSonModel.getProperty("/Data") ; 
			for(var i = 0; i < oDetailData.length ; i ++){
				var vDatum = oDetailData[i].Datum ; 
				if(!oController.onCompareDate(vDatum,vBegda,vEndda)){
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_2570"), {title : oBundleText.getText("LABEL_0053")});	// 2570:입력한 예외근무 신청기간 이외의 일자가 예외적용일에 입력되어 있습니다.\n 확인 부탁드립니다.
					oController._DetailJSonModel.setProperty("/Data/Wkbeg", "");
					oController._DetailJSonModel.setProperty("/Data/Wkend", "");
					return ; 
				}
			}
		}
	},
	
	
	onChangeDatum : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		var vSeqno = oEvent.getSource().getCustomData()[0].getValue();
		var vIdx = vSeqno * 1 - 1 ;	
		var vPernr = oEvent.getSource().getCustomData()[1].getValue();
		var vEncid = oEvent.getSource().getCustomData()[2].getValue();
		var vDatum = oEvent.getSource().getValue();
		var vWkbeg = oController._DetailJSonModel.getProperty("/Data/Wkbeg");
		var vWkend = oController._DetailJSonModel.getProperty("/Data/Wkend");	
			
		// 예외근무 신청기간과 비교
		if(!oController.onCompareDate(vDatum,vWkbeg,vWkend)){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2571"), {title : oBundleText.getText("LABEL_0053")});	// 2571:입력한 예외적용일은 예외근무 신청기간에 포함되지 않는 날짜 입니다.
			oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Datum", "");
			return ;
		}
		
		oController.onSearchWorkSchedule(oController, vIdx, vPernr, vDatum, vEncid);
	},
	
	
	onCompareDate : function(vDatum, vWkbeg, vWkend){
		if(!vDatum || vDatum == "" || !vWkbeg || vWkbeg == "" || !vWkend || vWkend == "" ) return true;
		
		var d1 = vWkbeg.split("-");
		var d2 = vWkend.split("-");
		var c = vDatum.split("-");

		var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
		var to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
		var check = new Date(c[0], parseInt(c[1])-1, c[2]);
		
		return check >= from && check <= to ;
	},
	
	onSearchWorkSchedule : function(oController, vIdx, vPernr, vDatum, vEncid){
		if(!vPernr || vPernr == "" || !vDatum || vDatum == "" || !vEncid || vEncid =="" ) return ;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var v1 = "", v2= "", v3 ="", v4 ="" , errData = {};
		
		oModel.read("/ExceptionWorkDetailSet", {
			async: false,
			filters : [
//				new sap.ui.model.Filter('Reqpnr', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
			],
			success: function(data,res){
				if (data && data.results.length) {
					v1 = data.results[0].Ottext ;
					v2 = data.results[0].Otprog ; 
					v3 = data.results[0].Schkz ;
					v4 = data.results[0].Rtext ;
				}
			},
			error: function(res){
				errData = common.Common.parseError(res);
			}
			
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage);
			oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Datum", "");
		} 		
		
		oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Ottext", v1);
		oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Otprog", v2);
		oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Schkz", v3);
		oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Rtext", v4);
		
		// 원근무일정 근무시간이 OFF가 아닐 경우 OFF대체는 비활성화 & 체크 해제
		if(v2 != "OFF"){
			oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Offsup", false);
		}
	},
	
	changeFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
			oController = oView.getController(),
			reader = new FileReader(),
			f = jQuery.sap.domById(oController.PAGEID + "_EXCEL_UPLOAD_BTN" + "-fu").files[0];
		
		// Excel Table 초기화
			oController._UploadTableJSonModel.setData({Data:[]});	
			
		reader.onload = function(e) {
			oController.BusyDialog.open();
			
			oController.X = XLSX;
			
			var data = e.target.result,
				arr = oController.fixdata(data),
				wb = oController.X.read(btoa(arr), {type: 'base64'});
			
			oController.to_json(wb);
			
			oController.BusyDialog.close();
		};
		
		reader.readAsArrayBuffer(f);
	},
	
	fixdata : function(data) {
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
		return o;
	},
	
	to_json : function(workbook) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
			oController = oView.getController(),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN"), 
			oListTable = sap.ui.getCore().byId(oController.PAGEID + "_UploadTable"),
			oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			curDate = new Date(),
			Datas = {Data : []},
			excelData = {},
			rowDatas = [],
			vIdx = 0;
		
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = oController.X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]),
				cRowData = {};
			
			if(roa && roa.length) {
				roa.forEach(function(rowElem) {
					cRowData = {};
					cRowData.Perid = rowElem.Coulmn_0;
					cRowData.Datum = "\/Date("+ common.Common.getTime(rowElem.Coulmn_1)+")\/";
					cRowData.Tprog = rowElem.Coulmn_2;
					cRowData.Excwrk2 = rowElem.Coulmn_3;
					cRowData.Offsup  = rowElem.Coulmn_4 == "Y" ? true : false;
					
		            rowDatas.push(cRowData);
				});
			}
		});
		
		if(rowDatas.length) {
			excelData.Prcty = "U";
			excelData.Actty = _gAuth;
			excelData.Zpernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
			excelData.Excwrk = oController._DetailJSonModel.getProperty("/Data/Excwrk");
			excelData.Wkbeg = "\/Date("+ common.Common.getTime(oController._DetailJSonModel.getProperty("/Data/Wkbeg"))+")\/";
			excelData.Wkend = "\/Date("+ common.Common.getTime(oController._DetailJSonModel.getProperty("/Data/Wkend"))+")\/";
			excelData.ExceptionWorkNav = rowDatas;
			var errData ={}, errYn = true ;
			oModel.create("/ExceptionWorkListSet", excelData, {
				success: function(data,res) {
					if(data.ExceptionWorkNav.results && data.ExceptionWorkNav.results.length) {
						data.ExceptionWorkNav.results.forEach(function(elem) {
							cRowData = {};
							cRowData = elem ;
							cRowData.Idx = ++vIdx;
							if(cRowData.Message != "") errYn = false;
							Datas.Data.push(cRowData);
						});
					}
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
					
				}
			});
			
			oController._UploadTableJSonModel.setData(Datas);
			oController._UploadTableJSonModel.refresh();
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.alert(errData.ErrorMessage, {});
			}else{
				if(!oController._UploadDialog) {
					oController._UploadDialog = sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.UploadDialog", oController);
					oView.addDependent(oController._UploadDialog);
				}
				
				var oUploadButton = sap.ui.getCore().byId(oController.PAGEID + "_UploadButton");
				oUploadButton.setVisible(errYn);
				
				oController._UploadDialog.open();
			}	
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2695"), {});	// 2695:Excel정보를 읽을 수 없습니다.\nExcel 파일 입력 값 또는 파일이 열려있는지 확인하시기 바랍니다.
		}
		
		oFileUploader.setValue("");
		oFileUploader.setVisible(false);
		oFileUploader.setVisible(true);
	},
	
	onPressExcelDown : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		window.open("/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_ExcWork/file/Excel_Template.xlsx");
	},
	
	
	ExcelApply : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail");
		var oController = oView.getController();
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var vUploadData = oController._UploadTableJSonModel.getData(),
			oTable =  sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
		    vDetailTableData = oController._DetailTableJSonModel.getData(),
		    vIdx = vDetailTableData.Data.length;
		
		if(vUploadData.Data && vUploadData.Data.length > 0) {
			vUploadData.Data.forEach(function(rowElem) {
				cRowData = {};
				cRowData = rowElem;
				cRowData.Idx = ++vIdx;
				cRowData.Datum = dateFormat.format(new Date(common.Common.setTime(rowElem.Datum)));
				cRowData.ZappStatAl = "";
				
				vDetailTableData.Data.push(cRowData);
			});
			oController._DetailTableJSonModel.setData(vDetailTableData);
			oController._DetailTableJSonModel.refresh();
			oTable.setVisibleRowCount(vDetailTableData.Data.length); 
		}
		
		oController._UploadDialog.close();
	}
});