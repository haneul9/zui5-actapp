jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail
	 */

	PAGEID : "ZUI5_HR_OvertimeConfirmDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'TM43',
	_vEnamefg : "",
	_vPersa : "" ,
	_vAppno : "",
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	_selectionRowIdx : "",
	
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
			oDetailData = {Data : {}};
		
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
		
		if(oController._vAppno) {
			oController._DetailTableJSonModel.setData({Data : [oDetailData.Data]});
		} else {
			oController._DetailTableJSonModel.setData({Data : []});
		}
		oTable.setVisibleRowCount(1);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		// 특근유형 combo
		oController.onSetAwart(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		
		common.Common.generateRowspan({
			selector : '#ZUI5_HR_OvertimeConfirmDetail_Table-header-fixed-fixrow > tbody',
			colIndexes : [0, 1]
		});
		
		common.Common.generateRowspan({
			selector : '#ZUI5_HR_OvertimeConfirmDetail_Table-header > tbody',
			colIndexes : [7, 8, 16, 17, 24, 25]
		});
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : (oController._vFromPage) ? oController._vFromPage : "ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmList",
			data : { }
		});
	},
	
	onSetAwart : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl"),
			items = [];
		
		oModel.read("/AptypCodeListSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, "TM41")
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						if(vZappStatAl == "" || vZappStatAl == "10") {
							if(data.results[i].Awart != "5020" && data.results[i].Awart != "5170") {
								items.push(data.results[i]);
							}
						} else {
							items.push(data.results[i]);
						}
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		var vTableData = oController._DetailTableJSonModel.getData();
		vTableData.Awarts = items;
		
		oController._DetailTableJSonModel.setData(vTableData);
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
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
		
		oTargetMatrix.getParent().getContent()[0].getContent()[2].setText(oBundleText.getText("LABEL_0003"));	// 3:결재선
//		oTargetMatrix.removeAllRows();
		oTargetMatrix.addRow(oRow);
	},
	
	setEndTimeFormat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController();
			
		oController._DetailTableJSonModel.setProperty("/Data/0/Outimt", undefined);
		
		oController.setTimeFormat(oEvent);
	},
	
	setTimeFormat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
		oController = oView.getController(),
		oInput = oEvent.getSource(),
		timeValue = oInput.getValue(),
		timeLast = timeValue.substring(timeValue.length-1, timeValue.length);
		
		if(Number(timeLast) >= 5) {
			timeLast = "5";
		} else {
			timeLast = "0";
		}
		
		oInput.setValue(timeValue.slice(0, -1) + timeLast);
		
		oController.onResetTime();
	},
	
	onChangeAwart : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			rowObject = oController._DetailTableJSonModel.getProperty(_selPath),
			vAwart = rowObject.Awart,
			vPernr = rowObject.Encid,
			vDatum = rowObject.Datum;
		
		// 교육특근(5140) odata 호출
		oController._DetailTableJSonModel.setProperty(_selPath + "/Tmrsn", undefined);	// 특근내역
		oController._DetailTableJSonModel.setProperty(_selPath + "/Educd", undefined);	// 교육과정코드
		
		if(!vPernr || !vDatum) return;
		
		if(vAwart == "5140") {
			oModel.read("/GetEducdSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter("Appno", sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter("Encid", sap.ui.model.FilterOperator.EQ, vPernr),
					new sap.ui.model.Filter("Awart", sap.ui.model.FilterOperator.EQ, vAwart),
					new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
				],
				success : function(data, res) {
					if(data.results && data.results.length) {
						oController._DetailTableJSonModel.setProperty(_selPath + "/Tmrsn", data.results[0].Tmrsn);	// 특근내역
						oController._DetailTableJSonModel.setProperty(_selPath + "/Educd", data.results[0].Educd);	// 교육과정코드
					}
				},
				error : function(Res) {
					console.log(Res);
				}
			});
		}
		
		oController.onResetTime(oEvent);
	},
	
	onResetTime : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController();
		
		oController._DetailTableJSonModel.setProperty("/Data/0/Tim11", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Tim12", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Tim13", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Tim14", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Tim21", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Tim22", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Wtm01", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Wtm02", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Wtm03", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Wtme1", undefined);
		oController._DetailTableJSonModel.setProperty("/Data/0/Wtme2", undefined);
	},
	
	onPressCheckWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			rowObject = oController._DetailTableJSonModel.getProperty("/Data/0");
		
		if(!rowObject) return;
		
		if(!rowObject.Beguzt || !rowObject.Enduzt) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0651"), {title : oBundleText.getText("LABEL_0053")});	// 651:시각을 입력하십시오.
			return;
		}
		
		oModel.read("/RptSpecialWorkDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "W"),
				new sap.ui.model.Filter('Oappno', sap.ui.model.FilterOperator.EQ, rowObject.Oappno),
				new sap.ui.model.Filter('Awart', sap.ui.model.FilterOperator.EQ, rowObject.Awart),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, rowObject.Encid),
				new sap.ui.model.Filter('Faprs', sap.ui.model.FilterOperator.EQ, rowObject.Faprs),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(rowObject.Datum)),
				new sap.ui.model.Filter('Beguzt', sap.ui.model.FilterOperator.EQ, rowObject.Beguzt.replace(/[^\d]/g, '')),
				new sap.ui.model.Filter('Enduzt', sap.ui.model.FilterOperator.EQ, rowObject.Enduzt.replace(/[^\d]/g, ''))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim11", data.results[0].Tim11);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim12", data.results[0].Tim12);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim13", data.results[0].Tim13);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim14", data.results[0].Tim14);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim21", data.results[0].Tim21);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim22", data.results[0].Tim22);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm01", data.results[0].Wtm01);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm02", data.results[0].Wtm02);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm03", data.results[0].Wtm03);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm04", data.results[0].Wtm04);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm05", data.results[0].Wtm05);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm06", data.results[0].Wtm06);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm07", data.results[0].Wtm07);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtme1", data.results[0].Wtme1);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtme2", data.results[0].Wtme2);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wrkjobt", data.results[0].Wrkjobt);
					oController._DetailTableJSonModel.setProperty("/Data/0/Twrkjobt", data.results[0].Wrkjobt);
					oController._DetailTableJSonModel.setProperty("/Data/0/Gigan1", data.results[0].Gigan1);
					oController._DetailTableJSonModel.setProperty("/Data/0/Gigan2", data.results[0].Gigan2);
					oController._DetailTableJSonModel.setProperty("/Data/0/Stat1", data.results[0].Stat1);
					oController._DetailTableJSonModel.setProperty("/Data/0/Stat2", data.results[0].Stat2);
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					oController.BusyDialog.close();
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
	},
	
	// 특근내역조회
	onPressSelectByWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			curDate = new Date(),
			prevDate = new Date();
		
		prevDate.setDate(prevDate.getDate() - 14);
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._OvertimeDialog) {
			oController._OvertimeDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.OvertimeDialog", oController);
			oView.addDependent(oController._OvertimeDialog);
		}
		
		var oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog");
		
		oOvertimeDialog.getModel().setProperty("/Data/Pernr", oController._TargetJSonModel.getProperty("/Data/Pernr"));
		oOvertimeDialog.getModel().setProperty("/Data/Encid", oController._TargetJSonModel.getProperty("/Data/Encid"));
		oOvertimeDialog.getModel().setProperty("/Data/Ename", oController._TargetJSonModel.getProperty("/Data/Ename"));
		oOvertimeDialog.getModel().setProperty("/Data/Orgeh", oController._TargetJSonModel.getProperty("/Data/Orgeh"));
		oOvertimeDialog.getModel().setProperty("/Data/Orgtx", oController._TargetJSonModel.getProperty("/Data/Orgtx"));
		oOvertimeDialog.getModel().setProperty("/Data/Apbeg", dateFormat.format(prevDate));
		oOvertimeDialog.getModel().setProperty("/Data/Apend", dateFormat.format(curDate));
		
		oController.searchOvertime();
		
		oController._OvertimeDialog.open();
	},
	
	searchOvertime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog"),
			oOvertimeTable = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeTable"),
			vPernr = oOvertimeDialog.getModel().getProperty("/Data/Encid"),
			vTableDatas = {Data : []},
			vIdx = 1;
		
		if(!vPernr) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0679"), {title : oBundleText.getText("LABEL_0053")});	// 679:대상자를 입력하여 주십시오.
			return;
		}
		
		oController.BusyDialog.open();
		
		oModel.read("/SpecialWorkEmpListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'H'),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Apbegda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apbegda").getDateValue())),
				new sap.ui.model.Filter('Apendda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apendda").getDateValue()))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						elem.Idx = vIdx++;
						
						elem.Tim11 = (!elem.Tim11 || elem.Tim11 == "0.00") ? "0" : elem.Tim11;
						elem.Tim12 = (!elem.Tim12 || elem.Tim12 == "0.00") ? "0" : elem.Tim12;
						elem.Tim13 = (!elem.Tim13 || elem.Tim13 == "0.00") ? "0" : elem.Tim13;
						elem.Tim14 = (!elem.Tim14 || elem.Tim14 == "0.00") ? "0" : elem.Tim14;
						elem.Tim21 = (!elem.Tim21 || elem.Tim21 == "0.00") ? "0" : elem.Tim21;
						elem.Tim22 = (!elem.Tim22 || elem.Tim22 == "0.00") ? "0" : elem.Tim22;
						elem.Wtm01 = (!elem.Wtm01 || elem.Wtm01 == "0.00") ? "0" : elem.Wtm01;
						elem.Wtm02 = (!elem.Wtm02 || elem.Wtm02 == "0.00") ? "0" : elem.Wtm02;
						elem.Wtm03 = (!elem.Wtm03 || elem.Wtm03 == "0.00") ? "0" : elem.Wtm03;
						
						vTableDatas.Data.push(elem);
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					oController.BusyDialog.close();
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
		
		oOvertimeTable.getModel().setData(vTableDatas);
		oOvertimeTable.setVisibleRowCount(10);
		
		oController.BusyDialog.close();
	},

	onConfirmOvertimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog"),
			oOvertimeTable = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeTable"),
			mOvertimeTableModel = oOvertimeTable.getModel(),
			vPersa = oController._DetailJSonModel.getProperty("/Data/Persa"),
			vIdxs = oOvertimeTable.getSelectedIndices();
		
		if(vIdxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0726"));	// 726:특근명령내역을 선택하여 주세요.
			return;
		} else if(vIdxs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0727"));	// 727:특근명령내역을 한개만 선택하여 주세요.
			return;
		}
		
		var _selPath = oOvertimeTable.getContextByIndex(vIdxs[0]).sPath,
			sData = mOvertimeTableModel.getProperty(_selPath),
			copyData = {};
		
		copyData.Idx = 1;
		copyData.Oappno = sData.Appno;
		copyData.Pernr = sData.Pernr;
		copyData.Encid = sData.Encid;
		copyData.Perid = sData.Perid;
		copyData.Ename = sData.Ename;
		copyData.Orgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx");
		copyData.Datum = dateFormat.format(sData.Datum);
		copyData.Obeguzt = sData.Beguzt;
		copyData.Oenduzt = sData.Enduzt;
		copyData.Otim11 = sData.Tim11;
		copyData.Otim12 = sData.Tim12;
		copyData.Otim13 = sData.Tim13;
		copyData.Otim14 = sData.Tim14;
//		copyData.Otim21 = sData.Tim21;
//		copyData.Otim22 = sData.Tim22;
		copyData.Beguzt = sData.Beguzt;
		copyData.Enduzt = sData.Enduzt;
		copyData.Ofaprs = sData.Faprs;
		copyData.Ofaprstx = sData.Faprstx;
		copyData.Faprs = sData.Faprs;
		copyData.Tim11 = sData.Tim11;
		copyData.Tim12 = sData.Tim12;
		copyData.Tim13 = sData.Tim13;
		copyData.Tim14 = sData.Tim14;
		copyData.Tim21 = sData.Tim21;
		copyData.Tim22 = sData.Tim22;
		copyData.Wtm01 = sData.Wtm01;
		copyData.Wtm02 = sData.Wtm02;
		copyData.Wtm03 = sData.Wtm03;
		copyData.Wtme1 = sData.Wtme1;
		copyData.Wtme2 = sData.Wtme2;
		copyData.Awart = sData.Awart;
		copyData.Atext = sData.Atext;
		copyData.Tmrsn = sData.Tmrsn;
		copyData.Educd = sData.Educd;
		copyData.Schkz = sData.Schkz;
		copyData.Rtext = sData.Rtext;
		copyData.Tprogt = sData.Tprogt;
		copyData.Wrkjob = sData.Wrkjob;
		copyData.Wrkjobt = sData.Wrkjobt;
		copyData.Twrkjobt = sData.Wrkjobt;
		copyData.Spernr = sData.Spernr;
		copyData.Sperid = sData.Sperid;
		copyData.Sename = sData.Sename;
		copyData.Sawart = sData.Sawart;
		copyData.Satext = sData.Satext;
		copyData.Refno = sData.Refno;
		copyData.RefForm = sData.RefForm;
		copyData.Oseqnr = sData.Seqnr;
		copyData.Outimt = (sData.Outimt) ? sData.Outimt.replace(/(\d{2})(\d{2})/g, '$1:$2') : undefined;
		copyData.Intimt = (sData.Intimt) ? sData.Intimt.replace(/(\d{2})(\d{2})/g, '$1:$2') : undefined;
		
		copyData.Appno = oController._DetailJSonModel.getProperty("/Data/Appno");
		copyData.ZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
		copyData.Persa = vPersa;
		
		oController._DetailTableJSonModel.setProperty("/Data", [copyData]);
		
		oController.onCloseOvertimeDialog();
	},

	onCloseOvertimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog"),
			oOvertimeTable = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeTable");
		
		oOvertimeDialog.getModel().setProperty("/Data/Orgeh", undefined);
		oOvertimeDialog.getModel().setProperty("/Data/Orgtx", undefined);
		
		oOvertimeTable.getModel().setData({Data : []});
		oOvertimeTable.clearSelection();
		
		oOvertimeDialog.close();
	},
	
	onPressIntimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oTableData = oController._DetailTableJSonModel.getData().Data[0],
			vDatum = oTableData.Datum,
			vBeguzt = oTableData.Beguzt,
			vEnduzt = oTableData.Enduzt,
			vPernr = oTableData.Pernr;
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._IntimeDialog) {
			oController._IntimeDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.IntimeDialog", oController);
			oView.addDependent(oController._IntimeDialog);
		}
		
		var oIntimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_IntimeDialog");
		
		oController.searchOuttime("I", vPernr, vDatum, vBeguzt, vEnduzt);
		
		oController._IntimeDialog.open();
	},
	
	onPressOuttimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oTableData = oController._DetailTableJSonModel.getData().Data[0],
			vDatum = oTableData.Datum,
			vBeguzt = oTableData.Beguzt,
			vEnduzt = oTableData.Enduzt,
			vPernr = oTableData.Pernr;
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._OuttimeDialog) {
			oController._OuttimeDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.OuttimeDialog", oController);
			oView.addDependent(oController._OuttimeDialog);
		}
		
		var oOuttimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OuttimeDialog");
		
		oController.searchOuttime("O", vPernr, vDatum, vBeguzt, vEnduzt);
		
		oController._OuttimeDialog.open();
	},
	
	searchOuttime : function(vPrcty, vPernr, vDatum, vBeguzt, vEnduzt) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oTable = vPrcty == "O" ? sap.ui.getCore().byId(oController.PAGEID + "_OuttimeTable") : sap.ui.getCore().byId(oController.PAGEID + "_IntimeTable"),
			vTableDatas = {Data : []},
			vIdx = 1;
		
		oController.BusyDialog.open();
		
		oModel.read("/OffWorkTimeSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, vPrcty),
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum)),
				new sap.ui.model.Filter('Beguzt', sap.ui.model.FilterOperator.EQ, vBeguzt),
				new sap.ui.model.Filter('Enduzt', sap.ui.model.FilterOperator.EQ, vEnduzt)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						elem.Idx = vIdx++;
						
						vTableDatas.Data.push(elem);
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					oController.BusyDialog.close();
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
		
		oTable.getModel().setData(vTableDatas);
		
		oController.BusyDialog.close();
	},
	
	onConfirmIntimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oIntimeTable = sap.ui.getCore().byId(oController.PAGEID + "_IntimeTable"),
			mIntimeTableModel = oIntimeTable.getModel(),
			vIdxs = oIntimeTable.getSelectedIndices();
		
		if(vIdxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2949"));	// 2949:출근시간을 선택하여 주세요.
			return;
		} else if(vIdxs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2950"));	// 2950:출근시간을 한개만 선택하여 주세요.
			return;
		}
		
		var _selPath = oIntimeTable.getContextByIndex(vIdxs[0]).sPath,
			sData = mIntimeTableModel.getProperty(_selPath);
		
		oController._DetailTableJSonModel.setProperty("/Data/0/Intimt", sData.Intimt.replace(/(\d{2})(\d{2})/g, '$1:$2'));
		
		oController.onCloseIntimeDialog();
	},

	onCloseIntimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oIntimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_IntimeDialog"),
			oIntimeTable = sap.ui.getCore().byId(oController.PAGEID + "_IntimeTable");
		
		oIntimeTable.getModel().setData({Data : []});
		oIntimeTable.clearSelection();
		
		oIntimeDialog.close();
	},

	onConfirmOuttimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
		oController = oView.getController(),
		oOuttimeTable = sap.ui.getCore().byId(oController.PAGEID + "_OuttimeTable"),
		mOuttimeTableModel = oOuttimeTable.getModel(),
		vIdxs = oOuttimeTable.getSelectedIndices();
		
		if(vIdxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0721"));	// 721:퇴근시간을 선택하여 주세요.
			return;
		} else if(vIdxs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0722"));	// 722:퇴근시간을 한개만 선택하여 주세요.
			return;
		}
		
		var _selPath = oOuttimeTable.getContextByIndex(vIdxs[0]).sPath,
		sData = mOuttimeTableModel.getProperty(_selPath);
		
		oController._DetailTableJSonModel.setProperty("/Data/0/Outimt", sData.Outimt.replace(/(\d{2})(\d{2})/g, '$1:$2'));
		
		oController.onCloseOuttimeDialog();
	},
	
	onCloseOuttimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
		oController = oView.getController(),
		oOuttimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OuttimeDialog"),
		oOuttimeTable = sap.ui.getCore().byId(oController.PAGEID + "_OuttimeTable");
		
		oOuttimeTable.getModel().setData({Data : []});
		oOuttimeTable.clearSelection();
		
		oOuttimeDialog.close();
	},
	
	onConfirmPernrDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oPernrDialog = sap.ui.getCore().byId(oController.PAGEID + "_PernrDialog"),
			oPernrTable = sap.ui.getCore().byId(oController.PAGEID + "_Pernr_Table"),
			mPernrTableModel = oPernrTable.getModel(),
			vContexts = oPernrTable.getSelectedContexts();
		
		if(!vContexts.length) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0646"));	// 646:대근자를 선택하여 주세요.
			return;
		} else if(vContexts.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0648"));	// 648:대근자를 한명만 선택하여 주세요.
			return;
		}
		
		var _selPath = vContexts[0].sPath,
			svPernr = mPernrTableModel.getProperty(_selPath + "/Pernr"),
			svPerid = mPernrTableModel.getProperty(_selPath + "/Perid"),
			svEname = mPernrTableModel.getProperty(_selPath + "/Ename"),
			svAwart = mPernrTableModel.getProperty(_selPath + "/Awart"),
			svAppno = mPernrTableModel.getProperty(_selPath + "/Appno"),
			svZreqForm = mPernrTableModel.getProperty(_selPath + "/ZreqForm"),
			svAtext = mPernrTableModel.getProperty(_selPath + "/Atext");
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Spernr", svPernr);
		oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Sperid", svPerid);
		oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Sename", svEname);
		oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Sawart", svAwart);
		oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Satext", svAtext);
		oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Refno", svAppno);
		oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/RefForm", svZreqForm);
		
		oController.onClosePernrDialog();
	},
	
	onClosePernrDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oPernrDialog = sap.ui.getCore().byId(oController.PAGEID + "_PernrDialog"),
			oPernrTable = sap.ui.getCore().byId(oController.PAGEID + "_Pernr_Table");
		
		oPernrDialog.getModel().setProperty("/Data/Orgeh", undefined);
		oPernrDialog.getModel().setProperty("/Data/Orgtx", undefined);
		
		oPernrTable.getModel().setData({Data : []});
		
		oPernrDialog.close();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController();
		
		oController.vCallControlId = oEvent.getSource().getId();
		oController.vCallControlType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!oController._SerachOrgDialogInView) {
			oController._SerachOrgDialogInView = sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.OrgSearch", oController);
			oView.addDependent(oController._SerachOrgDialogInView);
		}
		oController._SerachOrgDialogInView.open();
	},
	
	searchPernr : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oPernrTable = sap.ui.getCore().byId(oController.PAGEID + "_Pernr_Table"),
			vDatum = oController._DetailTableJSonModel.getProperty("/Data/0/Datum"),
			vOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_PernrDialog").getModel().getProperty("/Data/Orgeh");
		
		if(!vOrgeh) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0650"), {title : oBundleText.getText("LABEL_0053")});	// 650:부서를 선택하여 주십시오.
			return;
		}
		
		oController.BusyDialog.open();
		
		oModel.read("/SpecialWorkSspnrSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, _gAuth),
				new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, vOrgeh),
				new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
				],
				success : function(data, res) {
					if(data.results && data.results.length) {
						oPernrTable.getModel().setData({Data : data.results});
					}
				},
				error : function(Res) {
					console.log(Res);
				}
		});
		
		oController.BusyDialog.close();
	},
	
	onRowPernrChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			vSeqno = oEvent.getSource().getCustomData()[0].getValue(),
			vIdx = vSeqno * 1 - 1 ;
		
		oController._selectionRowIdx = vIdx;
		
		if(!oController._PernrDialog) {
			oController._PernrDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.PernrDialog", oController);
			oView.addDependent(oController._PernrDialog);
		}
		
		var oPernrDialog = sap.ui.getCore().byId(oController.PAGEID + "_PernrDialog");
		
		oPernrDialog.getModel().setProperty("/Data/Orgeh", oController._TargetJSonModel.getProperty("/Data/Orgeh"));
		oPernrDialog.getModel().setProperty("/Data/Orgtx", oController._TargetJSonModel.getProperty("/Data/Orgtx"));
		
		oController.searchPernr();
		
		oController._PernrDialog.open();
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail");
		var oController = oView.getController();
	},
	
	commonAction : function(oController, oDetailData) {
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		
		// Persa update
		var vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		if(oController._DetailTableJSonModel.getData().Data.length) {
			oController._DetailTableJSonModel.setProperty("/Data/0/Persa", vPersa);
		}
		
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/RptSpecialWorkDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Idx = 1;
					oDetailData.Data.Datum = dateFormat.format(oDetailData.Data.Datum);
					oDetailData.Data.Outimt = (oDetailData.Data.Outimt) ? oDetailData.Data.Outimt.replace(/(\d{2})(\d{2})/g, '$1:$2') : "";
					oDetailData.Data.Intimt = (oDetailData.Data.Intimt) ? oDetailData.Data.Intimt.replace(/(\d{2})(\d{2})/g, '$1:$2') : "";
					oDetailData.Data.Otim11 = (!oDetailData.Data.Otim11 || oDetailData.Data.Otim11 == "0.00") ? "0" : oDetailData.Data.Otim11;
					oDetailData.Data.Otim12 = (!oDetailData.Data.Otim12 || oDetailData.Data.Otim12 == "0.00") ? "0" : oDetailData.Data.Otim12;
					oDetailData.Data.Otim13 = (!oDetailData.Data.Otim13 || oDetailData.Data.Otim13 == "0.00") ? "0" : oDetailData.Data.Otim13;
					oDetailData.Data.Otim14 = (!oDetailData.Data.Otim14 || oDetailData.Data.Otim14 == "0.00") ? "0" : oDetailData.Data.Otim14;
//					oDetailData.Data.Otim21 = (!oDetailData.Data.Otim21 || oDetailData.Data.Otim21 == "0.00") ? "0" : oDetailData.Data.Otim21;
//					oDetailData.Data.Otim22 = (!oDetailData.Data.Otim22 || oDetailData.Data.Otim22 == "0.00") ? "0" : oDetailData.Data.Otim22;
					oDetailData.Data.Tim11 = (!oDetailData.Data.Tim11 || oDetailData.Data.Tim11 == "0.00") ? "0" : oDetailData.Data.Tim11;
					oDetailData.Data.Tim12 = (!oDetailData.Data.Tim12 || oDetailData.Data.Tim12 == "0.00") ? "0" : oDetailData.Data.Tim12;
					oDetailData.Data.Tim13 = (!oDetailData.Data.Tim13 || oDetailData.Data.Tim13 == "0.00") ? "0" : oDetailData.Data.Tim13;
					oDetailData.Data.Tim14 = (!oDetailData.Data.Tim14 || oDetailData.Data.Tim14 == "0.00") ? "0" : oDetailData.Data.Tim14;
					oDetailData.Data.Tim21 = (!oDetailData.Data.Tim21 || oDetailData.Data.Tim21 == "0.00") ? "0" : oDetailData.Data.Tim21;
					oDetailData.Data.Tim22 = (!oDetailData.Data.Tim22 || oDetailData.Data.Tim22 == "0.00") ? "0" : oDetailData.Data.Tim22;
					oDetailData.Data.Wtm01 = (!oDetailData.Data.Wtm01 || oDetailData.Data.Wtm01 == "0.00") ? "0" : oDetailData.Data.Wtm01;
					oDetailData.Data.Wtm02 = (!oDetailData.Data.Wtm02 || oDetailData.Data.Wtm02 == "0.00") ? "0" : oDetailData.Data.Wtm02;
					oDetailData.Data.Wtm03 = (!oDetailData.Data.Wtm03 || oDetailData.Data.Wtm03 == "0.00") ? "0" : oDetailData.Data.Wtm03;
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			errData = {};
		
		oModel.read("/RptSpecialWorkDetailSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0719"));	// 719:특근확인서
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0719") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 719:특근확인서
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0719") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 719:특근확인서
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController();
		
		oController.onApproval(oController , "C");
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
			
			var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
				errData = {};
				
			oModel.create("/RptSpecialWorkDetailSet", vOData, {
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
	
	onApproval : function(oController , vPrcty) {
		var vOData = oController.onValidationData(oController, vPrcty);
		
		if( vOData == "") return ;
		
		oController.onPreApprovalDialog(oController);
	},
	
	// 신청시 팝업
	onPreApprovalDialog : function(oController) {
		if(oController._PreApprovalDialog) oController._PreApprovalDialog.destroy(); 
		
		oController._PreApprovalDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.PreApprovalDialog", oController);
		oView.addDependent(oController._PreApprovalDialog);
		
		var oPreApprovalDialog = sap.ui.getCore().byId(oController.PAGEID + "_PreApprovalDialog");
		var oApprovalTable = sap.ui.getCore().byId(oController.PAGEID + "_PreApproval_Table");
		var detailData = oController._DetailTableJSonModel.getProperty("/Data");
		
		oApprovalTable.getModel().setData({Data : detailData});
		oApprovalTable.setVisibleRowCount(10);
		
		if(detailData[0].Persa == "3000" && !detailData[0].Intimt) {
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2961"), {	// 2961:출근시간을 확인해주세요.
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions : [sap.m.MessageBox.Action.YES],
				onClose : function(fVal) {
					oController._PreApprovalDialog.open();
				}
			});
		} else {
			oController._PreApprovalDialog.open();
		}
	},
	
	onCloseApprovalDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oPreApprovalDialog = sap.ui.getCore().byId(oController.PAGEID + "_PreApprovalDialog");
		
		oPreApprovalDialog.close();
	},
	
	onConfirmApprovalDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail"),
			oController = oView.getController(),
			oPreApprovalDialog = sap.ui.getCore().byId(oController.PAGEID + "_PreApprovalDialog"), 
			vPrcty = "C",
			vOData = oController.onValidationData(oController, vPrcty);
		
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		vOData.Actty = _gAuth;
		
		oPreApprovalDialog.close();
		
		// 결재라인 저장
		var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
		
		if(vSuccessyn == "X"){
			oController.BusyDialog.close();
			return false;
		}
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			errData = {};
			
		oModel.create("/RptSpecialWorkDetailSet", vOData, {
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
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0048"), {	// 48:신청이 완료되었습니다.
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			onClose : oController.onBack
		});
	},
	
	onValidationData : function(oController, vPrcty){
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV");
			vData = oController._DetailJSonModel.getProperty("/Data"),
			vDetailData = oController._DetailTableJSonModel.getProperty("/Data"),
			rData = {};
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(vDetailData.length < 1) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0724"));	// 724:특근내역을 선택하세요.
			return "";
		}
		
		vData.Oappno = vDetailData[0].Oappno;
		vData.Datum = vDetailData[0].Datum;
		vData.Awart = vDetailData[0].Awart;
		vData.Atext = vDetailData[0].Atext;
		vData.Outimt = vDetailData[0].Outimt;
		vData.Intimt = vDetailData[0].Intimt;
		vData.Beguzt = vDetailData[0].Beguzt;
		vData.Enduzt = vDetailData[0].Enduzt;
		vData.Tim11 = vDetailData[0].Tim11;
		vData.Tim12 = vDetailData[0].Tim12;
		vData.Tim13 = vDetailData[0].Tim13;
		vData.Tim14 = vDetailData[0].Tim14;
		vData.Tim21 = vDetailData[0].Tim21;
		vData.Tim22 = vDetailData[0].Tim22;
		vData.Wtm01 = vDetailData[0].Wtm01;
		vData.Wtm02 = vDetailData[0].Wtm02;
		vData.Wtm03 = vDetailData[0].Wtm03;
		vData.Wtm04 = vDetailData[0].Wtm04;
		vData.Wtm05 = vDetailData[0].Wtm05;
		vData.Wtm06 = vDetailData[0].Wtm06;
		vData.Wtm07 = vDetailData[0].Wtm07;
		vData.Wtme1 = vDetailData[0].Wtme1;
		vData.Wtme2 = vDetailData[0].Wtme2;
		vData.Stat1 = vDetailData[0].Stat1;
		vData.Stat2 = vDetailData[0].Stat2;
		vData.Tmrsn = vDetailData[0].Tmrsn;
		vData.Educd = vDetailData[0].Educd;
		vData.Spernr = vDetailData[0].Spernr;
		vData.Sawart = vDetailData[0].Sawart;
		vData.Sperid = vDetailData[0].Sperid;
		vData.Sename = vDetailData[0].Sename;
		vData.Satext = vDetailData[0].Satext;
		vData.Oseqnr = vDetailData[0].Oseqnr;
		vData.Wrkjobt = vDetailData[0].Wrkjobt;
		vData.Refno = vDetailData[0].Refno;
		vData.ZreqForm = vDetailData[0].ZreqForm;
		
		if(vPrcty == "C") {
			if(!vData.Oappno) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0725"));	// 725:특근내역이 선택되지 않았습니다.
				return "";
			}
			/*if(!vData.Outimt) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0723"));	// 723:퇴근시간이 선택되지 않았습니다.
				return "";
			}*/
			if(!vData.Beguzt) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0728"));	// 728:특근시작시간이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Enduzt) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0729"));	// 729:특근종료시간이 입력되지 않았습니다.
				return "";
			}
			
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
			
			// 시간확인 호출
			oController.onPressCheckWorktime();
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "RptSpecialWorkDetail", vData);
			rData.Datum = "\/Date("+ common.Common.getTime(rData.Datum)+")\/";
			rData.Beguzt = (rData.Beguzt) ? rData.Beguzt.replace(/[^\d]/g, '') : undefined;
			rData.Enduzt = (rData.Enduzt) ? rData.Enduzt.replace(/[^\d]/g, '') : undefined;
			rData.Outimt = (rData.Outimt) ? rData.Outimt.replace(/[^\d]/g, '') : undefined;
			rData.Intimt = (rData.Intimt) ? rData.Intimt.replace(/[^\d]/g, '') : undefined;
			
			delete rData.Beguz;
			delete rData.Enduz;
			delete rData.Outim;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV");
				
				oModel.remove("/RptSpecialWorkDetailSet(Appno='" + vDetailData.Appno + "')", {
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
	
	onAfterSelectPernr : function(oController) {
		oController._DetailTableJSonModel.setProperty("/Data", []);
	}
});