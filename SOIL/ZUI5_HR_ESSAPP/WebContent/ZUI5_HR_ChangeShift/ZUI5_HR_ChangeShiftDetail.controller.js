//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail
	 */

	PAGEID : "ZUI5_HR_ChangeShiftDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_OrgehJSonModel : new sap.ui.model.json.JSONModel(),
	_OrgehTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	_ErrorTableJSonModel : new sap.ui.model.json.JSONModel(),
	_Check1TableJSonModel : new sap.ui.model.json.JSONModel(),
	_Check2TableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "TM01",
	_ObjList : [],
	_vOrgeh : "",
	_vOrgtx : "",
	_useCustomPernrSelection : "",
	_selectionRowIdx : null,
	BusyDialog : new sap.m.BusyDialog(),
	
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
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []};
		
		oController.BusyDialog.open();
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno || '';
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세 조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 상세테이블 조회
		oController.retrieveDetailTable(oController, oDetailTableData, oDetailData.Data.ZappStatAl);
		
		// 상세테이블 Binding
		oController._DetailTableJSonModel.setData(oDetailTableData);
		oTable.setVisibleRowCount(oDetailTableData.Data.length || 1);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 근무일정규칙 콤보 조회
		if(oController._vAppno || _gAuth == 'E') oController.onSetRtext(oController);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftList",
			      data : { }
				}
			);	
		}
		
	},
	
	onChangeDatum : function(oEvent) {
		var minPrevDate = moment().subtract(6, 'days'),
			vDatum = moment(oEvent.getSource().getValue());
		
		if(minPrevDate.format("YYYY-MM-DD") > vDatum.format("YYYY-MM-DD")) {
			oEvent.getSource().setValue(undefined);
			
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1270"), {title : oBundleText.getText("LABEL_0053")});	// 1270:근무편제변경신청 시 적용일 최소 7일 이전에 작성하여 주시기 바랍니다.
			return;
		}
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ApprLineRow", {
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
							}).addStyleClass("Font14px FontColor6")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
		
		oTargetMatrix.addEventDelegate({
			onAfterRendering: function() {
				$('#ZUI5_HR_ChangeShiftDetail_TargetToolbar > span').text(oBundleText.getText("LABEL_2896"));	// 2896:작성자
			}
		});
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
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
		oController._TargetJSonModel.setProperty("/Data/Enametag", "작성자");
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		
		// 결재내역 
		common.ApprovalInformation.onSetApprovalInformation(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/ChangeSchkzListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				oDetailData.Data.Datum = dateFormat.format(oDetailData.Data.Datum);
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
	
	retrieveDetailTable : function(oController, oDetailTableData, vZappStatAl) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			errData = {};
		
		oModel.read("/ChangeSchkzDetailSet", {
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
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			errData = {};
		
		oModel.read("/ChangeSchkzListSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0011") + " " + oBundleText.getText("LABEL_0023"));	// 11:근무편제변경 신청, 23:등록
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0011") + " " + oBundleText.getText("LABEL_0040"));	// 11:근무편제변경 신청, 40:수정
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0011") + " " + oBundleText.getText("LABEL_0064"));	// 11:근무편제변경 신청, 64:조회
		}
	},
	
	// 부서별근무조현황에서 추가
	onPressSelectByOrg : function(oEvent) {
		
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		var oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._DetailJSonModel.getProperty("/Data/Datum")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0063"), {title : oBundleText.getText("LABEL_0053")});	// 63:적용일을 선택하여 주십시오.
			return;
		}
		
		if(!oController._OrgehSchkzDialog) {
			oController._OrgehSchkzDialog = sap.ui.jsfragment("ZUI5_HR_ChangeShift.fragment.OrgehSchkz", oController);
			oView.addDependent(oController._OrgehSchkzDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_OrgehTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var vOrgeh = oController._TargetJSonModel.getProperty("/Data/Orgeh");
		var vOrgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx");
		var vDatum = oController._DetailJSonModel.getProperty("/Data/Datum");
		var vData = {Data : []};
		
		var aFilters = [
			new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, vOrgeh),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Datum").getDateValue()))
		];
		
		oModel.read("/OrgehSchkzListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length > 0) {
					// 기준일,부서
					var headerData = {Data : {}};
					headerData.Data.Datum = vDatum;
					headerData.Data.Orgtx = vOrgtx;
					oController._OrgehJSonModel.setData(headerData);
					
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						vData.Data.push(data.results[i]);
					}
					
					oController._OrgehTableJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length > 15 ? 15 : vData.Data.length);
				}					
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController._OrgehSchkzDialog.open();
	},
	
	// 부서별 근무현황에서 선택 event
	onAddDetailTable : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_OrgehTable");
		var vIDXs = oTable.getSelectedIndices();
		
		if(vIDXs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vTableData = oController._DetailTableJSonModel.getData();
		var vData = vTableData.Data;
		
		var svTableModel = oTable.getModel();
		
		
		// 중복체크
		if(vData.length) {
			try {
				vData.forEach(function(prop, index, array) {
					vIDXs.forEach(function(element) {
						var sPath = oTable.getContextByIndex(element).sPath;
						if(prop.Pernr == svTableModel.getProperty(sPath).Pernr) {
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
			var sPath = oTable.getContextByIndex(element).sPath,
				rowData = svTableModel.getProperty(sPath);
			
			addData = {};
			addData.Idx = ++seqNo;
			addData.ZappStatAl = "";
			addData.Ename = rowData.Ename;
			addData.Perid = rowData.Perid;
			addData.Pernr = rowData.Pernr;
			addData.Encid = rowData.Encid;
			
			vTableData.Data.push(addData);
		});
		
		var rowCount = oController._DetailTableJSonModel.getProperty("/Data").length;
		oController._DetailTableJSonModel.setData(vTableData);
		oController._DetailTableJSonModel.refresh();
		oDetailTable.setVisibleRowCount(rowCount);
		
		oTable.clearSelection();
		oDetailTable.clearSelection();
		
		oController._OrgehSchkzDialog.close();
	},
	
	// 등록
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail"),
			oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._vOrgeh = oController._TargetJSonModel.getProperty("/Data/Orgeh");
		oController._vOrgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx");
		oController._useCustomPernrSelection = "X";
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	onRowPernrChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
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
	onPressCopy : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			vIndexs = oTable.getSelectedIndices();
		
		if(vIndexs.length == 0 || vIndexs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0027"), {title : oBundleText.getText("LABEL_0053")});	// 27:복사할 데이터를 한 건만 선택하여 주십시오.
			return;
		}
		
		var vTableData = oController._DetailTableJSonModel.getData(),
			_selPath = oTable.getContextByIndex(vIndexs[0]).sPath,
			orgData = oController._DetailTableJSonModel.getProperty(_selPath),
			copyData = {},
			vIdx = 0;
		
		Object.keys(orgData).map(function(key, index) {
			copyData[key] = orgData[key];
		});
		copyData.Idx = vTableData.Data.length + 1;
		
		vTableData.Data.push(copyData);
		oController._DetailTableJSonModel.setData(vTableData);
		oController._DetailTableJSonModel.refresh();
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			vIndexs = oDetailTable.getSelectedIndices();
		
		if(vIndexs.length < 1) {
			new sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		var procDeleteRecord = function(fVal) {
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
				
				oController._DetailTableJSonModel.setData(vData);
				oDetailTable.setVisibleRowCount(vData.Data.length);
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
		oController._DetailJSonModel.setProperty("/Data/Datum", "");   // 적용일
		
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
	
	onCheckPreApproval : function(oController) {
		if(oController.onValidationData(oController, "C") == false) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			oneData = oController._DetailJSonModel.getProperty("/Data"),
			vTableData = oController._DetailTableJSonModel.getProperty("/Data"),
			createData = {},
			vDetailData = {},
			vDetailDataList = []; 
		
		createData = common.Common.copyByMetadata(oModel, "ChangeSchkzList", oneData);
		createData.Datum = "\/Date("+ common.Common.getTime(createData.Datum)+")\/";
		createData.Prcty = "V";
		createData.Actty = _gAuth;
		
		vTableData.forEach(function(element) {
			vDetailData = {};
			vDetailData = common.Common.copyByMetadata(oModel, "ChangeSchkzDetail", element);
			vDetailData.Appno = createData.Appno;
			vDetailData.Seqnr = String(element.Idx);
			
			vDetailDataList.push(vDetailData);
		});
		
		createData.ChangeSchkzNav = vDetailDataList;
		
		oModel.create("/ChangeSchkzListSet", createData, {
			success : function(data, res) {
				if(data) {
					if(data.Error == "X" && data.ChangeSchkzNav.results.length > 0) {
						oController.openFirstInfoDialog(oController, data.ChangeSchkzNav.results);
					} else {
						oController.onSecondCheckPreApproval(oController);
					}
				} 
			},
			error : function (Res) {
				var errData = common.Common.parseError(Res);
				vErrorMessage = errData.ErrorMessage;
			}
		});
	},
	
	openFirstInfoDialog : function(oController, infoList) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		
		if(!oController._Check1Dialog) {
			oController._Check1Dialog = sap.ui.jsfragment("ZUI5_HR_ChangeShift.fragment.SaveCheck1", oController);
			oView.addDependent(oController._Check1Dialog);
		}
		
		var vIdx = 1;
		infoList.forEach(function(elem) {
			elem.Idx = vIdx++;
		});
		
		oController._Check1TableJSonModel.setData({Data : infoList});
		oController._Check1TableJSonModel.refresh();
		
		oController._Check1Dialog.open();
	},

	openSecondInfoDialog : function(oController, infoList) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		
		if(!oController._Check2Dialog) {
			oController._Check2Dialog = sap.ui.jsfragment("ZUI5_HR_ChangeShift.fragment.SaveCheck2", oController);
			oView.addDependent(oController._Check2Dialog);
		}
		
		var vIdx = 1;
		infoList.forEach(function(elem) {
			elem.Idx = vIdx++;
		});
		
		oController._Check2TableJSonModel.setData({Data : infoList});
		oController._Check2TableJSonModel.refresh();
		
		oController._Check2Dialog.open();
	},
	
	onSecondCheckPreApproval : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			oneData = oController._DetailJSonModel.getProperty("/Data"),
			vTableData = oController._DetailTableJSonModel.getProperty("/Data"),
			createData = {},
			vDetailData = {},
			vDetailDataList = []; 
		
		createData = common.Common.copyByMetadata(oModel, "ChangeSchkzList", oneData);
		createData.Datum = "\/Date("+ common.Common.getTime(createData.Datum)+")\/";
		createData.Prcty = "W";
		createData.Actty = _gAuth;
		
		vTableData.forEach(function(element) {
			vDetailData = {};
			vDetailData = common.Common.copyByMetadata(oModel, "ChangeSchkzDetail", element);
			vDetailData.Appno = createData.Appno;
			vDetailData.Seqnr = String(element.Idx);
			
			vDetailDataList.push(vDetailData);
		});
		
		createData.ChangeSchkzNav = vDetailDataList;
		
		oModel.create("/ChangeSchkzListSet", createData, {
			success : function(data, res) {
				if(data) {
					if(data.Error == "X" && data.ChangeSchkzNav.results.length > 0) {
						oController.openSecondInfoDialog(oController, data.ChangeSchkzNav.results);
					} else {
						oController.onSave(oController, "C");
					}
				} 
			},
			error : function (Res) {
				var errData = common.Common.parseError(Res);
				vErrorMessage = errData.ErrorMessage;
			}
		});
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		var oController = oView.getController();
		
		oController.onCheckPreApproval(oController);
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
			
			// 근무편제변경 저장
			var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "ChangeSchkzList", oneData);
			createData.Datum = "\/Date("+ common.Common.getTime(createData.Datum)+")\/";
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			vTableData.forEach(function(element) {
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "ChangeSchkzDetail", element);
				vDetailData.Appno = createData.Appno;
				vDetailData.Seqnr = String(element.Idx);
				
				vDetailDataList.push(vDetailData);
			});
			
			createData.ChangeSchkzNav = vDetailDataList;
			
			var saveError = "",
				errorList = [];
			oModel.create("/ChangeSchkzListSet", createData, {
				success : function(data, res) {
					if(data) {
						saveError = data.Error;
						errorList = data.ChangeSchkzNav.results;
					} 
				},
				error : function (Res) {
					var errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(saveError == 'X') {
				oController.callSaveErrorDialog(oController, errorList);
				return;
			}

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
	
	callSaveErrorDialog : function(oController, errorList) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		
		if(!oController._ErrorDialog) {
			oController._ErrorDialog = sap.ui.jsfragment("ZUI5_HR_ChangeShift.fragment.SaveError", oController);
			oView.addDependent(oController._ErrorDialog);
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
		} else if(!oneData.Datum){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0063"), {title : oBundleText.getText("LABEL_0053")});	// 63:적용일을 선택하여 주십시오.
			return false;
		}
		
		var targetDatas = oController._DetailTableJSonModel.getProperty("/Data");
		if(targetDatas.constructor !== Array || targetDatas.length < 1) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0025"), {title : oBundleText.getText("LABEL_0053")});	// 25:변경 대상자를 선택하여 주십시오.
			return false;
		}
		
		var isDup = false, isInputValid = true, aPernr = [];
		targetDatas.some(function(elem, index) {
			if(aPernr.indexOf(elem.Pernr) > -1) {
				isDup = true;
				return true;
			} else {
				aPernr.push(elem.Pernr);
			}
			
			if(!elem.Schkz || !elem.Wrkjob) {
				isInputValid = false;
				return true;
			}
		});
		
		if(isDup) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0066"), {title : oBundleText.getText("LABEL_0053")});	// 66:중복입력한 대상자가 있어서 신청이 불가능합니다.
			return false;
		}
		if(!isInputValid) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0009"), {title : oBundleText.getText("LABEL_0053")});	// 근무일정규칙과 근무직을 모두 선택하세요.
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
				
				oModel.remove("/ChangeSchkzListSet(Appno='" + oController._vAppno + "')", {
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(oController._selectionRowIdx != null && vIDXs.length > 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			} else if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var vTableData = oController._DetailTableJSonModel.getData(),
				vData = vTableData.Data;
			
			// 테이블에서 수정
			if(oController._selectionRowIdx != null) {
				var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath,
					svPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr"),
					svEncid = mEmpSearchResult.getProperty(_selPath + "/Encid"),
					svPerid = mEmpSearchResult.getProperty(_selPath + "/Perid"),
					svEname = mEmpSearchResult.getProperty(_selPath + "/Ename");
				
				// 중복체크
				if(vData.length) {
					try {
						vData.forEach(function(prop, index, array) {
							if(prop.Pernr == svPernr) {
								throw new Error(oBundleText.getText("LABEL_0056"));	// 56:이미 추가된 대상입니다.
							}
						});
					} catch(ex) {
						sap.m.MessageBox.alert(ex.message);
						return;
					}
				}
				
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Pernr", svPernr);
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Encid", svEncid);
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Perid", svPerid);
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Ename", svEname);
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/ZappStatAl", "");
			// 등록버튼 이벤트
			} else {
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
					addData.Pernr = mEmpSearchResult.getProperty(sPath + "/Pernr");
					addData.Encid = mEmpSearchResult.getProperty(sPath + "/Encid");
					
					vTableData.Data.push(addData);
				});
				
				oController._DetailTableJSonModel.setData(vTableData);
				oController._DetailTableJSonModel.refresh();
				
				oDetailTable.setVisibleRowCount(oController._DetailTableJSonModel.getProperty("/Data").length);
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
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
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Pernr"))
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail");
		var oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Datum")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0063"), {title : oBundleText.getText("LABEL_0053")});	// 63:적용일을 선택하여 주십시오.
			return;
		}
		
		if(!oController._PernrTprogDialog) {
			oController._PernrTprogDialog = sap.ui.jsfragment("ZUI5_HR_ChangeShift.fragment.PernrTprog", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TprogTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var vEncid = oEvent.getSource().getCustomData()[0].getValue();
		var vData = {Data : []};
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
			new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Datum").getDateValue()))
		];
		
		oModel.read("/PernrTprogListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				// 기준일, 근무형태
				var headerData = {Data : {}};
				headerData.Data.Datum = oController._DetailJSonModel.getProperty("/Data/Datum");
				
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
	}
	
});