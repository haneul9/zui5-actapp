jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail
	 */

	PAGEID : "ZUI5_HR_OvertimeOrderDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'TM41',
	_vEnamefg : "",
	_vPersa : "" ,
	_vAppno : "",
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	_selectionRowIdx : "",
	
	// 대근 코드(5190-기타대근 제외)
	chkSubCodes : [
		"5030", "5040", "5050", "5060", 
		"5070", "5080", "5090", "5130", 
		"5150", "5160", "5210", "5220", 
		"5230", "5240"
	],
	
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
			oDetailTableData = {Data : []},
			oDatum = sap.ui.getCore().byId(oController.PAGEID + "_Datum");
		
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
		
		// 특근일 mindate 설정 -7일
		var curDate = new Date();
		curDate.setDate(curDate.getDate() - 14);
//		oDatum.setMinDate(curDate);
		
		// 상세조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 상세테이블 조회
		oController.retrieveDetailTable(oController, oDetailTableData);
		
		// 상세테이블 Binding
		oController._DetailTableJSonModel.setData(oDetailTableData);
		oTable.setVisibleRowCount(oDetailTableData.Data.length || 1);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 사번
		if(oController._vAppno) oController._DetailJSonModel.setProperty("/Data/Pernr", oDetailData.Data.Appernr);

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
			selector : '#ZUI5_HR_OvertimeOrderDetail_Table-header-fixed-fixrow > tbody',
			colIndexes : [0, 1, 2, 3, 4, 5]
		});
		
		common.Common.generateRowspan({
			selector : '#ZUI5_HR_OvertimeOrderDetail_Table-header > tbody',
			colIndexes : [0, 1, 2, 3, 4, 5, 12, 13]
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
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : (oController._vFromPage) ? oController._vFromPage : "ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderList",
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
	
	onChangeDatum : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			curDate = moment(),
			minPrevDate = moment().subtract(7, 'days'),
			vDatum = moment(oEvent.getSource().getValue());
		
		if(!oEvent.getSource().getValue()) return false; 
		
		if(curDate.format("YYYY-MM-DD") > vDatum.format("YYYY-MM-DD")) {
			if(vDatum.format("YYYY-MM-DD") < minPrevDate.format("YYYY-MM-DD")) {
//				oEvent.getSource().setValue(undefined);

				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2664"), {title : oBundleText.getText("LABEL_0052")});	// 2664:특근명령서 작성기한은 7일입니다., 52:안내
			} else {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2663"), {title : oBundleText.getText("LABEL_0052")});	// 2663:특근명령서 사전 작성 준수 요망, 52:안내
			}
		}
		
		oController._DetailTableJSonModel.setProperty("/Data", []);
		oController._DetailTableJSonModel.refresh();
		oTable.setVisibleRowCount(1);
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
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
		
		oTargetMatrix.getParent().getContent()[0].getContent()[2].setText(oBundleText.getText("LABEL_0003"));	// 결재선
//		oTargetMatrix.removeAllRows();
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail");
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/SpecialWorkContentSet", {
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
	
	retrieveDetailTable : function(oController, oDetailTableData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			errData = {};
		
		oModel.read("/SpecialWorkEmpListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "D")
			],
			success : function(data, res) {
				if(data && data.results.length) {
					var vIdx = 1;
					data.results.forEach(function(element) {
						element.Idx = vIdx++;
						
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
	
	onPressAddRecord : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._DetailJSonModel.getProperty("/Data/Datum")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0656"), {title : oBundleText.getText("LABEL_0053")});	// 656:특근일을 선택하여 주십시오.
			return;
		}
		
		oController._vOrgeh = oController._TargetJSonModel.getProperty("/Data/Orgeh");
		oController._vOrgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx");
		
		oController._useCustomPernrSelection = "X";
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var vTableData = oController._DetailTableJSonModel.getData(),
				vData = vTableData.Data;
			
			// 중복체크
			if(vData.length) {
				try {
					vData.forEach(function(prop, index, array) {
						vIDXs.forEach(function(element) {
							var sPath = oTable.getContextByIndex(element).sPath;
							if(prop.Pernr == mEmpSearchResult.getProperty(sPath + "/Pernr")) {
								throw new Error(oBundleText.getText("LABEL_0056"));	// 56:이미 추가된 대상입니다.
							}
						});
					});
				} catch(ex) {
					sap.m.MessageBox.alert(ex.message);
					return;
				}
			} else {
				vTableData.Data = [];
			}
			
			var addData = {},
				seqNo = vTableData.Data.length;
			
			vIDXs.forEach(function(element) {
				var sPath = oTable.getContextByIndex(element).sPath;
				
				addData = {};
				addData.Idx = ++seqNo;
				addData.ZappStatAl = "";
				addData.Ename = mEmpSearchResult.getProperty(sPath + "/Ename");
				addData.Perid = mEmpSearchResult.getProperty(sPath + "/Perid");
				addData.Encid = mEmpSearchResult.getProperty(sPath + "/Encid");
				addData.Pernr = mEmpSearchResult.getProperty(sPath + "/Pernr");
				addData.Orgtx = mEmpSearchResult.getProperty(sPath + "/Orgtx");
				addData.Beguzt = "0000";
				addData.Enduzt = "0000";
				addData.Faprs = "A0";
				
				vTableData.Data.push(addData);
			});
			
			oController._DetailTableJSonModel.setProperty("/Data", vTableData.Data);
			oController._DetailTableJSonModel.refresh();
			
			oDetailTable.setVisibleRowCount(oController._DetailTableJSonModel.getProperty("/Data").length > 10 ? 10 : oController._DetailTableJSonModel.getProperty("/Data").length);
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail");
		var oController = oView.getController();
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._vOrgeh = '';
		oController._vOrgtx = '';
		oController._useCustomPernrSelection = '';
	},
	
	onPressDelRecord : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
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
						vInfoData[i].Idx = vIdx;
						vData.Data.push(vInfoData[i]);
					}
				}
				
				oController._DetailTableJSonModel.setProperty("/Data", vData.Data);
				oDetailTable.setVisibleRowCount(vData.Data.length > 10 ? 10 : vData.Data.length);
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			errData = {};
		
		oModel.read("/SpecialWorkContentSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0642") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 642:특근명령서
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0642") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 642:특근명령서
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0642") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 642:특근명령서
		}
	},
	
	// 개인별근로시간조회 후 추가
	onPressSelectByWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._DetailJSonModel.getProperty("/Data/Datum")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0656"), {title : oBundleText.getText("LABEL_0053")});	// 656:특근일을 선택하여 주십시오.
			return;
		}
		
		if(oController._WorktimeDialog) oController._WorktimeDialog.destroy();
		
		oController._WorktimeDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeOrder.fragment.WorktimeDialog", oController);
		oView.addDependent(oController._WorktimeDialog);
		
		var oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog");
		
		oWorktimeDialog.getModel().setProperty("/Data/Orgeh", oController._TargetJSonModel.getProperty("/Data/Orgeh"));
		oWorktimeDialog.getModel().setProperty("/Data/Orgtx", oController._TargetJSonModel.getProperty("/Data/Orgtx"));
		
		oController.searchWorktime();
		
		oController._WorktimeDialog.open();
	},
	
	onPressCheckWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			vDatum = oController._DetailJSonModel.getProperty("/Data/Datum"),
			vTableData = oController._DetailTableJSonModel.getData(),
			vOData = {};
		
		if(!vTableData.Data || !vTableData.Data.length) return;
		
		var isValid = true;
		vTableData.Data.forEach(function(elem) {
			if(!elem.Beguzt || !elem.Enduzt) isValid = false;
		});
		
		if(!isValid) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0651"), {title : oBundleText.getText("LABEL_0053")});	// 651:시각을 입력하십시오.
			return;
		}
		
		oController.BusyDialog.open();
		
		vOData.Prcty = "W";
		vOData.Actty = _gAuth;
		vOData.Datum = "\/Date("+ common.Common.getTime(vDatum)+")\/";
		vOData.SpecialWorkNav = [];
		
		vTableData.Data.forEach(function(elem) {
			var rData = common.Common.copyByMetadata(oModel, "SpecialWorkEmpList", elem);
			rData.Beguzt = rData.Beguzt.replace(/[^\d]/g, '');
			rData.Enduzt = rData.Enduzt.replace(/[^\d]/g, '');
			
			delete rData.Beguz;
			delete rData.Enduz;
			
			vOData.SpecialWorkNav.push(rData);
		});
		
		oModel.create("/SpecialWorkContentSet", vOData, {
			success: function(data,res) {
				if(data.SpecialWorkNav.results && data.SpecialWorkNav.results.length) {
					for(var i = 0; i < data.SpecialWorkNav.results.length; i++) {
						var element = data.SpecialWorkNav.results[i];
						
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Rtext", element.Rtext);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim11", element.Tim11);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim12", element.Tim12);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim13", element.Tim13);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim14", element.Tim14);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim21", element.Tim21);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim22", element.Tim22);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtm01", element.Wtm01);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtm02", element.Wtm02);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtm03", element.Wtm03);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtm04", element.Wtm04);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtm05", element.Wtm05);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtm06", element.Wtm06);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtm07", element.Wtm07);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtme1", element.Wtme1);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wtme2", element.Wtme2);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Stat1", element.Stat1);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Stat2", element.Stat2);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Wrkjobt", element.Wrkjobt);
						oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Twrkjobt", element.Wrkjobt);
					}
				} 
			},
			error: function (Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					oController.BusyDialog.close();
					new control.ZNK_SapBusy.oErrorMessage(errData.ErrorMessage);
					return;
				}
			}
		});
		
		oController.BusyDialog.close();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController();
		
		oController.vCallControlId = oEvent.getSource().getId();
		oController.vCallControlType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!oController._SerachOrgDialogInView) {
			oController._SerachOrgDialogInView = sap.ui.jsfragment("ZUI5_HR_OvertimeOrder.fragment.OrgSearch", oController);
			oView.addDependent(oController._SerachOrgDialogInView);
		}
		oController._SerachOrgDialogInView.open();
	},
	
	searchWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table"),
			vDatum = oController._DetailJSonModel.getProperty("/Data/Datum"),
			vOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog").getModel().getProperty("/Data/Orgeh"),
			vIdx = 1;
		
		if(!vOrgeh) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0650"), {title : oBundleText.getText("LABEL_0053")});	// 650:부서를 선택하여 주십시오.
			return;
		}
		
		oController.BusyDialog.open();
		
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
		
		oWorktimeTable.setVisibleRowCount(10);
		
		oController.BusyDialog.close();
	},

	searchPernr : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oPernrTable = sap.ui.getCore().byId(oController.PAGEID + "_Pernr_Table"),
			vDatum = oController._DetailJSonModel.getProperty("/Data/Datum"),
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
		
//		oPernrTable.setVisibleRowCount(10);
		
		oController.BusyDialog.close();
	},
	
	onCloseWorktimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table");
		
		oWorktimeDialog.getModel().setProperty("/Data/Orgeh", undefined);
		oWorktimeDialog.getModel().setProperty("/Data/Orgtx", undefined);
		
		oWorktimeTable.getModel().setData({Data : []});
		
		oWorktimeDialog.close();
	},

	onClosePernrDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oPernrDialog = sap.ui.getCore().byId(oController.PAGEID + "_PernrDialog"),
			oPernrTable = sap.ui.getCore().byId(oController.PAGEID + "_Pernr_Table");
		
		oPernrDialog.getModel().setProperty("/Data/Orgeh", undefined);
		oPernrDialog.getModel().setProperty("/Data/Orgtx", undefined);
		
		oPernrTable.getModel().setData({Data : []});
		
		oPernrDialog.close();
	},
	
	onConfirmWorktimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
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
				svEncid = mWorktimeTableModel.getProperty(_selPath + "/Encid"),
				svEname = mWorktimeTableModel.getProperty(_selPath + "/Ename"),
				svOrgtx = mWorktimeTableModel.getProperty(_selPath + "/Orgtx"),
				svWrkjobt = mWorktimeTableModel.getProperty(_selPath + "/Wrkjobt"),
				svTprogt = mWorktimeTableModel.getProperty(_selPath + "/Tprogt"),
				svWtm01 = mWorktimeTableModel.getProperty(_selPath + "/Wtm01"),
				svWtm02 = mWorktimeTableModel.getProperty(_selPath + "/Wtm02"),
				svWtm03 = mWorktimeTableModel.getProperty(_selPath + "/Wtm03"),
				svStat1 = mWorktimeTableModel.getProperty(_selPath + "/Stat1"),
				svWtm04 = mWorktimeTableModel.getProperty(_selPath + "/Wtm04"),
				svWtm05 = mWorktimeTableModel.getProperty(_selPath + "/Wtm05"),
				svWtm06 = mWorktimeTableModel.getProperty(_selPath + "/Wtm06"),
				svStat2 = mWorktimeTableModel.getProperty(_selPath + "/Stat2"),
				svWtm07 = mWorktimeTableModel.getProperty(_selPath + "/Wtm07"),
				svWtme1 = mWorktimeTableModel.getProperty(_selPath + "/Wtme1"),
				svWtme2 = mWorktimeTableModel.getProperty(_selPath + "/Wtme2"),
				svRtext = mWorktimeTableModel.getProperty(_selPath + "/Rtext");
			
			addItem = {};
			addItem.Idx = ++vLastIndexNumber;
			addItem.ZappStatAl = "";
			addItem.Pernr = svPernr;
			addItem.Perid = svPerid;
			addItem.Encid = svEncid;
			addItem.Ename = svEname;
			addItem.Orgtx = svOrgtx;
			addItem.Twrkjobt = svWrkjobt;
			addItem.Tprogt = svTprogt;
			addItem.Rtext = svRtext;
			addItem.Wtm01 = svWtm01;
			addItem.Wtm02 = svWtm02;
			addItem.Wtm03 = svWtm03;
			addItem.Stat1 = svStat1;
			addItem.Wtm04 = svWtm04;
			addItem.Wtm05 = svWtm05;
			addItem.Wtm06 = svWtm06;
			addItem.Stat2 = svStat2;
			addItem.Wtm07 = svWtm07;
			addItem.Wtme1 = svWtme1;
			addItem.Wtme2 = svWtme2;
			addItem.Beguzt = "0000";
			addItem.Enduzt = "0000";
			addItem.Faprs = "A0";
			
			vTableData.Data.push(addItem);
		});
		
		oController._DetailTableJSonModel.setProperty("/Data", vTableData.Data);
		oController._DetailTableJSonModel.refresh();
		oDetailTable.setVisibleRowCount(vTableData.Data.length > 10 ? 10 : vTableData.Data.length);
		
		oWorktimeTable.removeSelectionInterval(0, vIDXs[vIDXs.length - 1]);
		
		oController.onCloseWorktimeDialog();
	},

	onConfirmPernrDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
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
			svAtext = mPernrTableModel.getProperty(_selPath + "/Atext"),
			svAppno = mPernrTableModel.getProperty(_selPath + "/Appno"),
			svZreqForm = mPernrTableModel.getProperty(_selPath + "/ZreqForm");
		
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
	
	onRowPernrChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			vSeqno = oEvent.getSource().getCustomData()[0].getValue(),
			vIdx = vSeqno * 1 - 1 ;
		
		if(!oController._DetailJSonModel.getProperty("/Data/Datum")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0656"), {title : oBundleText.getText("LABEL_0053")});	// 656:특근일을 선택하여 주십시오.
			return;
		}
		
		oController._selectionRowIdx = vIdx;
		
		if(!oController._PernrDialog) {
			oController._PernrDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeOrder.fragment.PernrDialog", oController);
			oView.addDependent(oController._PernrDialog);
		}
		
		var oPernrDialog = sap.ui.getCore().byId(oController.PAGEID + "_PernrDialog"),
			oSorgeh = sap.ui.getCore().byId(oController.PAGEID + "_Sorgeh");
		
		oPernrDialog.getModel().setProperty("/Data/Orgeh", oController._TargetJSonModel.getProperty("/Data/Orgeh"));
		oPernrDialog.getModel().setProperty("/Data/Orgtx", oController._TargetJSonModel.getProperty("/Data/Orgtx"));
		oSorgeh.setEditable(false);
		
		oController.searchPernr();
		
		oController._PernrDialog.open();
	},
	
	onChangeAwart : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			rowObject = oController._DetailTableJSonModel.getProperty(_selPath),
			vAwart = rowObject.Awart,
			vPernr = rowObject.Encid,
			vDatum = oController._DetailJSonModel.getProperty("/Data/Datum");
		
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
	
	onResetTime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			rowObject = oController._DetailTableJSonModel.getProperty(_selPath),
			vAwart = rowObject.Awart,
			vFaprs = rowObject.Faprs;
		
		oController._DetailTableJSonModel.setProperty(_selPath + "/Tim11", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Tim12", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Tim13", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Tim14", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Tim21", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Tim22", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Wtm01", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Wtm02", undefined);
		oController._DetailTableJSonModel.setProperty(_selPath + "/Wtm03", undefined);
		
		if(oController.chkSubCodes.indexOf(vAwart) < 0) {
			oController._DetailTableJSonModel.setProperty(_selPath + "/Spernr", undefined);
			oController._DetailTableJSonModel.setProperty(_selPath + "/Sperid", undefined);
			oController._DetailTableJSonModel.setProperty(_selPath + "/Sename", undefined);
			oController._DetailTableJSonModel.setProperty(_selPath + "/Sawart", undefined);
			oController._DetailTableJSonModel.setProperty(_selPath + "/Satext", undefined);
			oController._DetailTableJSonModel.setProperty(_selPath + "/Refno", undefined);
			oController._DetailTableJSonModel.setProperty(_selPath + "/RefForm", undefined);
		}
		
		// 순수특근(5010), 교육특근(5140) 휴게시간 0분(A0) 체크
		// 시작시간 12:00 ~ 13:00 
		// 종료시간 17:30 ~ 18:00
		if((vAwart == "5010" || vAwart == "5140") && vFaprs == "A0") {
			var vBeguzt = rowObject.Beguzt;
			var vEnduzt = rowObject.Enduzt;
			var isAlert = false;
			
			if(vBeguzt && vBeguzt.indexOf(":") > -1 && vEnduzt && vEnduzt.indexOf(":") > -1) {
				vBeguzt = Number(vBeguzt.replace(/[^\d]/g, ''));
				vEnduzt = Number(vEnduzt.replace(/[^\d]/g, ''));
				if(vEnduzt == 0) vEnduzt = 2400;
				
				if(vBeguzt <= 1200) {
					if(vEnduzt >= 1300) isAlert = true;
				} else if(vBeguzt > 1200 && vBeguzt <= 1730) {
					if(vEnduzt >= 1800) isAlert = true; 
				}
				
				if(isAlert) {
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_2666"), {title : oBundleText.getText("LABEL_0052")});	// 2666:휴게시간 부여 확인 요망, 52:안내
					return;
				}
			}
		}
	},
	
	setTimeFormat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oInput = oEvent.getSource(),
			_selPath = oInput.getBindingContext().sPath,
			vAwart = oController._DetailTableJSonModel.getProperty(_selPath + "/Awart"),
			vFaprs = oController._DetailTableJSonModel.getProperty(_selPath + "/Faprs"),
			timeValue = oInput.getValue(),
			timeLast = timeValue.substring(timeValue.length-1, timeValue.length);
		
		if(Number(timeLast) >= 5) {
			timeLast = "5";
		} else {
			timeLast = "0";
		}
		
		oInput.setValue(timeValue.slice(0, -1) + timeLast);
		
		oController.onResetTime(oEvent);
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail");
		var oController = oView.getController();
		
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
				
			oModel.create("/SpecialWorkContentSet", vOData, {
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
	
	onConfirmApprovalDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
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
			
		oModel.create("/SpecialWorkContentSet", vOData, {
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

	onCloseApprovalDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail"),
			oController = oView.getController(),
			oPreApprovalDialog = sap.ui.getCore().byId(oController.PAGEID + "_PreApprovalDialog");
		
		oPreApprovalDialog.close();
	},
	
	// 신청시 팝업
	onPreApprovalDialog : function(oController) {
		if(oController._PreApprovalDialog) oController._PreApprovalDialog.destroy();
		
		oController._PreApprovalDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeOrder.fragment.PreApprovalDialog", oController);
		oView.addDependent(oController._PreApprovalDialog);
		
		var oPreApprovalDialog = sap.ui.getCore().byId(oController.PAGEID + "_PreApprovalDialog");
		var oApprovalTable = sap.ui.getCore().byId(oController.PAGEID + "_PreApproval_Table");
		var detailData = oController._DetailTableJSonModel.getProperty("/Data");
		
		oApprovalTable.getModel().setData({Data : detailData});
		oApprovalTable.setVisibleRowCount(10);
		
		oController._PreApprovalDialog.open();
	},
	
	onValidationData : function(oController, vPrcty){
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV");
			vData = oController._DetailJSonModel.getProperty("/Data"),
			tableDatas = oController._DetailTableJSonModel.getProperty("/Data"),
			rData = {};
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Datum) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0657"));	// 657:특근일이 입력되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C"){
			if(tableDatas.constructor !== Array || tableDatas.length < 1) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0654"), {title : oBundleText.getText("LABEL_0053")});	// 654:특근내역을 입력하여 주십시오.
				return false;
			}
			
			var isFillAwart = true,
				isFillBeguz = true,
				isFillEnduz = true,
				isFillTmrsn = true,
				isFillSpernr = true;
			tableDatas.some(function(elem, index) {
				if(!elem.Awart) {
					isFillAwart = false;
					return true;
				}
				if(!elem.Beguzt) {
					isFillBeguz = false;
					return true;
				}
				if(!elem.Enduzt) {
					isFillEnduz = false;
					return true;
				}
				if(!elem.Tmrsn) {
					isFillTmrsn = false;
					return true;
				}
				if(oController.chkSubCodes.indexOf(elem.Awart) > -1 && !elem.Spernr) {
					isFillSpernr = false;
					return true;
				}
			});
			
			if(!isFillAwart) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0655"), {title : oBundleText.getText("LABEL_0053")});	// 655:특근유형을 모두 선택하세요.
				return false;
			}
			if(!isFillBeguz) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0652"), {title : oBundleText.getText("LABEL_0053")});	// 652:시작시간을 입력 하세요.
				return false;
			}
			if(!isFillEnduz) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0653"), {title : oBundleText.getText("LABEL_0053")});	// 653:종료시간을 입력 하세요.
				return false;
			}
			if(!isFillTmrsn) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2665"), {title : oBundleText.getText("LABEL_0053")});	// 2665:특근내역을 입력 하세요.
				return false;
			}
			if(!isFillSpernr) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0647"), {title : oBundleText.getText("LABEL_0053")});	// 647:대근자를 입력 하세요.
				return false;
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
			
			// 시간확인 실행
			oController.onPressCheckWorktime();
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "SpecialWorkContent", vData);
			rData.Datum = "\/Date("+ common.Common.getTime(rData.Datum)+")\/";
			
			var vDetailDataList = [], vDetailData = {};
			
			tableDatas.forEach(function(elem) {
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "SpecialWorkEmpList", elem);
				vDetailData.Beguzt = (vDetailData.Beguzt) ? vDetailData.Beguzt.replace(/[^\d]/g, '') : undefined;
				vDetailData.Enduzt = (vDetailData.Enduzt) ? vDetailData.Enduzt.replace(/[^\d]/g, '') : undefined;
				
				delete vDetailData.Beguz;
				delete vDetailData.Enduz;
				
				vDetailDataList.push(vDetailData);
			});
			
			rData.SpecialWorkNav = vDetailDataList;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV");
				
				oModel.remove("/SpecialWorkContentSet(Appno='" + vDetailData.Appno + "')", {
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
		oController._DetailTableJSonModel.setProperty("/Data", []);
		oController._DetailTableJSonModel.refresh();
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
	}
});