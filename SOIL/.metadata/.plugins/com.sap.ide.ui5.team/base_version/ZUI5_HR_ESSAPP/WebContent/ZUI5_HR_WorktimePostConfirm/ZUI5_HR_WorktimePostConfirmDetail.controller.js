jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail
	 */

	PAGEID : "ZUI5_HR_WorktimePostConfirmDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'TM61',
	_Columns : "",
	_vEnamefg : "",
	_vPersa : "" ,
	_vAppno : "",
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
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
			vFromPageId = "",
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []};
		
		oController.BusyDialog.open();
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 상세테이블 조회
		var pZappStatAl = (oController._vAppno && oDetailData.Data.Reqty == "2") ? "20" : oDetailData.Data.ZappStatAl;
		oController.retrieveDetailTable(oController, oDetailTableData, oController._vAppno, pZappStatAl);
		
		// 상세테이블 Binding
		oController._DetailTableJSonModel.setData(oDetailTableData);
		oTable.setVisibleRowCount(oDetailTableData.Data.length || 1);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		// 사번
		if(oController._vAppno) oController._DetailJSonModel.setProperty("/Data/Pernr", oDetailData.Data.Appernr);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		
		common.Common.generateRowspan({
			selector : '#ZUI5_HR_WorktimePostConfirmDetail_Table-header-fixed-fixrow > tbody',
			colIndexes : [0, 1, 2, 3, 4, 5]
		});
		
		common.Common.generateRowspan({
			selector : '#ZUI5_HR_WorktimePostConfirmDetail_Table-header > tbody',
			colIndexes : [0, 1, 2, 3, 4, 8, 9, 10]
		});
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : (oController._vFromPage) ? oController._vFromPage : "ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmList",
			data : { }
		});
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0003")	// 3:결재선
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Text({
								text : "{ApprEnames}"
							}).addStyleClass("Font14px FontColor3")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
		
//		oTargetMatrix.getParent().getContent()[0].getContent()[2].setText(oBundleText.getText("LABEL_0003"));
//		oTargetMatrix.removeAllRows();
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail");
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
	
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/WorkTimeApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Datum = dateFormat.format(oDetailData.Data.Datum);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
	},
	
	retrieveDetailTable : function(oController, oDetailTableData, vAppno, vZappStatAl) {
		if(!vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/WorkTimeApplOffSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vAppno)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(element) {
						element.ZappStatAl = vZappStatAl;
						element.Datum = dateFormat.format(element.Datum);
						
						oDetailTableData.Data.push(element);
					});
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
	
	onChangeReqty : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		oController._DetailJSonModel.setProperty("/Data/Datum", undefined);
		oController._DetailJSonModel.setProperty("/Data/Beguztx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Enduztx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Duran", undefined);
		
		oController._DetailTableJSonModel.setData({Data : []});
		oDetailTable.setVisibleRowCount(1);
		oDetailTable.clearSelection();
	},
	
	calcDuran : function(vBeguztx, vEnduztx, isExceptLunch) {
		if(!vBeguztx || !vEnduztx) return 0;
		
		var vNumBeg = Number(vBeguztx.replace(/[^\d]/g, '')),
			vNumEnd = Number(vEnduztx.replace(/[^\d]/g, ''));
		
		vBeguztx = (vBeguztx.indexOf(":") > -1) ? vBeguztx.split(":") : vBeguztx.match(/.{1,2}/g);
		vEnduztx = (vEnduztx.indexOf(":") > -1) ? vEnduztx.split(":") : vEnduztx.match(/.{1,2}/g);
		
		var	curDate = new Date(),
			endDay = (vNumBeg > vNumEnd) ? curDate.getDate() + 1 : curDate.getDate();
			begDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), Number(vBeguztx[0]), Number(vBeguztx[1]), 00),
			endDate = new Date(curDate.getFullYear(), curDate.getMonth(), endDay, Number(vEnduztx[0]), Number(vEnduztx[1]), 00);
			
		var vDuran = (endDate.getTime() - begDate.getTime()) / 60000;
		
		// 12:00 ~ 13:00 시간 제외
		var exceptTime = 0;
		if(isExceptLunch) {
			if(vNumBeg <= 1200) {
				if(vNumEnd > 1200 && vNumEnd < 1300) {
					exceptTime = vNumEnd - 1200;
				} else if (vNumEnd >= 1300) {
					exceptTime = 60;
				}
			} else if(vNumBeg > 1200 && vNumBeg < 1300) {
				if(vNumEnd >= 1300) {
					exceptTime = 1260 - vNumBeg;
				} else {
					exceptTime = vNumEnd - vNumBeg;
				}
			}
//			console.log("totalTime : ", vDuran, "exceptTime : ", exceptTime);
		}
			
		return vDuran - exceptTime || 0;
	},
	
	setTimeFormat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oInput = oEvent.getSource(),
			timeValue = oInput.getValue(),
			vBeguztx = "",
			vEnduztx = "";
		
		oInput.setValue(timeValue.slice(0, -1) + "0");
		
		vBeguztx = oController._DetailJSonModel.getProperty("/Data/Beguztx");
		vEnduztx = oController._DetailJSonModel.getProperty("/Data/Enduztx");
		
		oController._DetailJSonModel.setProperty("/Data/Duran", oController.calcDuran(vBeguztx, vEnduztx, false));
	},
	
	onChangeTime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oInput = oEvent.getSource(),
			timeValue = oInput.getValue(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			vBeguztx = "",
			vEnduztx = "",
			vDuran = 0;
		
		oInput.setValue(timeValue.slice(0, -1) + "0");
		
		vBeguztx = oController._DetailTableJSonModel.getProperty(_selPath + "/Beguztx");
		vEnduztx = oController._DetailTableJSonModel.getProperty(_selPath + "/Enduztx");
		
		oController._DetailTableJSonModel.setProperty(_selPath + "/Duran", oController.calcDuran(vBeguztx, vEnduztx, true));
	},
	
	onChageAlldf : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_SRV"),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			vPernr = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vDatum = oController._DetailTableJSonModel.getProperty(_selPath + "/Datum");
		
		oController._DetailTableJSonModel.setProperty(_selPath + "/Beguztx", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Enduztx", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Duran", 0);
		
		if(!oEvent.getSource().getSelected()) return;
		
		oModel.read("/WorkPlanTimeSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					var rData = data.results[0];
					
					oController._DetailTableJSonModel.setProperty(_selPath + "/Beguztx", rData.Beguztx);
					oController._DetailTableJSonModel.setProperty(_selPath + "/Enduztx", rData.Enduztx);
					
					var vBeguztx = rData.Beguztx.replace(/(\d{2})(\d{2})/g, '$1:$2');
					var vEnduztx = rData.Enduztx.replace(/(\d{2})(\d{2})/g, '$1:$2');
					
					oController._DetailTableJSonModel.setProperty(_selPath + "/Duran", oController.calcDuran(vBeguztx, vEnduztx, true));
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				sap.m.MessageBox.alert(errData.ErrorMessage, {});
				return ;
			}
		});
	},
	
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			Datas = oController._DetailTableJSonModel.getData(),
			vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
		
		Datas.Data.push({
			Appno : oController._vAppno,
			ZappStatAl : vZappStatAl,
			Seqno : Datas.Data.length + 1,
			Datum : undefined,
			Beguztx : undefined,
			Enduztx : undefined,
			Alldf : false
		});
		
		oController._DetailTableJSonModel.setData(Datas);
		oController._DetailTableJSonModel.refresh();
		
		oTable.setVisibleRowCount(Datas.Data.length);
	},
	
	onPressDelRecord : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vIndexs = oDetailTable.getSelectedIndices();
		
		if(vIndexs.length < 1) {
			new sap.m.MessageBox.alert(oBundleText.getText("LABEL_0110"));	// 110:대상을 선택하여 주십시오.
			return;
		}
		
		var deleteRecord = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var vIdx = 0;
				var check = function(seq){
					for(var a=0; a<vIndexs.length; a++){
						if(vIndexs[a] == seq) return false;
					}
					
					return true;
				}

				var vData = oController._DetailTableJSonModel.getData();
				var vInfoData = vData.Data;
				
				vData.Data = [];
				oController._DetailTableJSonModel.setData(vData);
				
				for(var i=0; i<vInfoData.length; i++) {
					if(check(i)) {
						vIdx = vIdx + 1;
						vInfoData[i].Seqno = vIdx;
						vData.Data.push(vInfoData[i]);
					}
				}
				
				oController._DetailTableJSonModel.setData(vData);
				oDetailTable.setVisibleRowCount(vData.Data.length);
				oDetailTable.clearSelection();
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : deleteRecord
		});
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_SRV"),
			errData = {};
		
		oModel.read("/WorkTimeApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I')
			],
			success : function(data, res) {
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
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0877") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 877:근무시간 사후확인서
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0877") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 877:근무시간 사후확인서
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0877") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 877:근무시간 사후확인서
		}
	},
	
	onPressSelectByApply : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController();
		
		if(!oController._WorktimeDialog) {
			oController._WorktimeDialog = sap.ui.jsfragment("ZUI5_HR_WorktimePostConfirm.fragment.WorktimeDialog", oController);
			oView.addDependent(oController._WorktimeDialog);
		}
		
		var oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog"),
			oModel = oWorktimeDialog.getModel(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			curDate = new Date(),
			preDate = new Date(curDate.getFullYear(), 0, 1),
			endDate = new Date(curDate.getFullYear(), 11, 31);
		
		oModel.setProperty("/Data/Begda", dateFormat.format(preDate));
		oModel.setProperty("/Data/Endda", dateFormat.format(endDate));
		
		oController.searchWorktime();
		
		oController._WorktimeDialog.open();
	},
	
	searchWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_SRV"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vBegda = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog").getModel().getProperty("/Data/Begda"),
			vEndda = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog").getModel().getProperty("/Data/Endda"),
			vIdx = 1;
		
		if(!vBegda || !vEndda) {
			return;
		}
		
		oController.BusyDialog.open();
		
		oModel.read("/ApplHistorySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter("Encid", sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter("Begda", sap.ui.model.FilterOperator.EQ, common.Common.getTime(vBegda)),
				new sap.ui.model.Filter("Endda", sap.ui.model.FilterOperator.EQ, common.Common.getTime(vEndda))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oWorktimeTable.getModel().setData({Data : data.results});
				}
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController.BusyDialog.close();
	},

	onCloseWorktimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table");
		
		oWorktimeDialog.getModel().setProperty("/Data/Begda", undefined);
		oWorktimeDialog.getModel().setProperty("/Data/Endda", undefined);
		
		oWorktimeTable.getModel().setData({Data : []});
		
		oWorktimeDialog.close();
	},

	onConfirmWorktimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"}),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vTableData = oController._DetailTableJSonModel.getData(),
			oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table"),
			mWorktimeTableModel = oWorktimeTable.getModel(),
			vIDXs = oWorktimeTable.getSelectedIndices(),
			vLastIndexNumber = vTableData.Data.length;
			addItem = {};
		
		if(!vIDXs.length || vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0885"));	// 885:대상을 하나만 선택하여 주세요.
			return;
		}
		
		var _selPath = oWorktimeTable.getContextByIndex(vIDXs[0]).sPath,
			svAppno = mWorktimeTableModel.getProperty(_selPath + "/Appno"),
			svDatum = mWorktimeTableModel.getProperty(_selPath + "/Datum"),
			svBeguztx = mWorktimeTableModel.getProperty(_selPath + "/Beguztx"),
			svEnduztx = mWorktimeTableModel.getProperty(_selPath + "/Enduztx"),
			svDuran = mWorktimeTableModel.getProperty(_selPath + "/Duran");
		
		oController._DetailJSonModel.setProperty("/Data/Oappno", svAppno);
		oController._DetailJSonModel.setProperty("/Data/Datum", dateFormat.format(svDatum));
		oController._DetailJSonModel.setProperty("/Data/Beguztx", svBeguztx);
		oController._DetailJSonModel.setProperty("/Data/Enduztx", svEnduztx);
		oController._DetailJSonModel.setProperty("/Data/Duran", svDuran);
		
		// 상세테이블 조회
		var oDetailTableData = {Data : []};
		
		oController.retrieveDetailTable(oController, oDetailTableData, svAppno, "20");
		
		oController._DetailTableJSonModel.setData(oDetailTableData);
		oDetailTable.setVisibleRowCount(oDetailTableData.Data.length || 1);
		
		oWorktimeTable.removeSelectionInterval(0, vIDXs[vIDXs.length - 1]);
		
		oController.onCloseWorktimeDialog();
	},

	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vOData = oController.onValidationData(oController, vPrcty);
		
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		vOData.Actty = _gAuth;
		
		var onProcess = function() {
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_SRV"),
				errData = {};
				
			oModel.create("/WorkTimeApplSet", vOData, {
				success: function(data,res) {
					if(data) {
					} 
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E') {
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(errData.ErrorMessage);
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
//				control.ZNKBusyAccessor.onBusy("S",oController);
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
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_SRV");
			vData = oController._DetailJSonModel.getProperty("/Data"),
			tableDatas = oController._DetailTableJSonModel.getProperty("/Data"),
			rData = {};
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Reqty) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0886"));	// 886:구분이 선택되지 않았습니다.
			return "";
		}
		
		if(vData.Reqty == "1") {
			if(!vData.Datum) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0887"));	// 887:근무일이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Beguztx || !vData.Enduztx) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0888"));	// 888:근무시간이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Tmrsn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2888"));	// 2888:사유가 입력되지 않았습니다.
				return "";
			}
			if(tableDatas.constructor !== Array || tableDatas.length < 1) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0889"));	// 889:OFF Time이 입력되지 않았습니다.
				return "";
			}
			
			var isFillDatum = true,
				isFillBeguztx = true,
				isFillEnduztx = true;
			
			tableDatas.some(function(elem, index) {
				if(!elem.Datum) {
					isFillDatum = false;
					return true;
				}
				if(!elem.Beguztx) {
					isFillBeguztx = false;
					return true;
				}
				if(!elem.Enduztx) {
					isFillEnduztx = false;
					return true;
				}
			});
			
			if(!isFillDatum) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0890"), {title : oBundleText.getText("LABEL_0053")});	// 890:일자를 모두 입력하세요.
				return false;
			}
			if(!isFillBeguztx) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0891"), {title : oBundleText.getText("LABEL_0053")});	// 891:시작 시간을 모두 입력하세요.
				return false;
			}
			if(!isFillEnduztx) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0892"), {title : oBundleText.getText("LABEL_0053")});	// 892:종료 시간을 모두 입력하세요.
				return false;
			}
		} else if (vData.Reqty == "2") {
			if(!vData.Oappno) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2895"));	// 2895:취소할 기신청내역를 선택하세요.
				return "";
			}
			if(!vData.Tmrsn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2888"));	// 2888:사유가 입력되지 않았습니다.
				return "";
			}
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
		
		try {
			rData = common.Common.copyByMetadata(oModel, "WorkTimeAppl", vData);
			rData.Datum = "\/Date("+ common.Common.getTime(rData.Datum)+")\/";
			rData.Duran = String(rData.Duran);
			rData.Beguztx = (rData.Beguztx) ? rData.Beguztx.replace(/[^\d]/g, '') : undefined;
			rData.Enduztx = (rData.Enduztx) ? rData.Enduztx.replace(/[^\d]/g, '') : undefined;
			
			var vDetailDataList = [], vDetailData = {};
			
			tableDatas.forEach(function(elem) {
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "WorkTimeApplOff", elem);
				vDetailData.Datum = "\/Date("+ common.Common.getTime(vDetailData.Datum)+")\/";
				vDetailData.Duran = String(vDetailData.Duran);
				vDetailData.Beguztx = (vDetailData.Beguztx) ? vDetailData.Beguztx.replace(/[^\d]/g, '') : undefined;
				vDetailData.Enduztx = (vDetailData.Enduztx) ? vDetailData.Enduztx.replace(/[^\d]/g, '') : undefined;
				
				vDetailDataList.push(vDetailData);
			});
			
			rData.WorkTimeApplOffSet = vDetailDataList;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_SRV");
				
				oModel.remove("/WorkTimeApplSet(Appno='" + vDetailData.Appno + "')", {
					success: function(data,res) {
					},
					error: function(Res) {
						if(Res.response.body){
							var ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							vError = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
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
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Datum;	// 특근일자
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailTableJSonModel.refresh();
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
	},
	
	onPressExcelDown : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModelData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0878") + "-" + dateFormat.format(curDate) + ".xlsx"	// 878:근무시간 사후확인 휴무내역
		};
	
		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});