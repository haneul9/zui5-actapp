jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.ui.core.util.ExportType");

sap.ui.controller("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail
	 */

	PAGEID : "ZUI5_HR_WorktimeRecordExceptionDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'TM71',
	_vEnamefg : "",
	_Columns : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",
	_vZappStatAl : "",
	_useCustomPernrSelection : "",
	_selectionRowIdx : null,
	
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
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			vFromPageId = "",
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
		oDetailData.Data.Tsmon = (!oDetailData.Data.Tsmon) ? dateFormat.format(new Date()) : oDetailData.Data.Tsmon;
		oController._vZappStatAl = oDetailData.Data.ZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		
		// 상세테이블 조회
		oController.retrieveDetailTable(oController, oDetailTableData);
		
		oController._DetailTableJSonModel.setData(oDetailTableData);
		oController._DetailTableJSonModel.refresh();
		sap.ui.getCore().byId(oController.PAGEID + "_Table").setVisibleRowCount(oDetailTableData.Data.length || 1);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
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
		
		oTargetMatrix.addRow(oRow);
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
			errData = {};
		
		oModel.read("/ExtMonthlyTimeHeaderSet", {
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
	
	onLimitDigit : function(oEvent) {
		var _pattern = /^(\d{1,2}([.]\d{0,1})?)?$/,
			_value = oEvent.getSource().getValue();
		
		if(!_pattern.test(_value)) {
			oEvent.getSource().setValue(_value.substring(0, _value.length - 1));
		}
	},
	
	onChangeTsmon : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			vTsmon = oEvent.getSource().getValue(),
			vTsdat = "",
			vDetailTableData = oController._DetailTableJSonModel.getData();
		
		vTsmon = vTsmon.replace(/[^\d]/g, '');
		vTsmon = vTsmon.substring(0, 6);
		
		vDetailTableData.Data.forEach(function(elem) {
			vTsdat = elem.Tsdat;
			if(vTsdat) {
				vTsdat = vTsdat.replace(/[^\d]/g, '');
				vTsdat = vTsdat.substring(0, 6);
				
				if(vTsmon != vTsdat) elem.Tsdat = undefined;
			}
		});
		
		oController._DetailTableJSonModel.setData(vDetailTableData);
		oController._DetailTableJSonModel.refresh();
	},
	
	onChangeTsdat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			vTsmon = oController._DetailJSonModel.getProperty("/Data/Tsmon"),
			vTsdat = oEvent.getSource().getValue();
		
		if(!vTsmon) return;
		
		vTsmon = vTsmon.replace(/[^\d]/g, '');
		vTsmon = vTsmon.substring(0, 6);
		vTsdat = vTsdat.replace(/[^\d]/g, '');
		vTsdat = vTsdat.substring(0, 6);
		
		if(vTsmon != vTsdat) {
			oEvent.getSource().setValue(undefined);
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0803"), {title : oBundleText.getText("LABEL_0053")});	// 803:해당일은 선택할 수 없습니다.
			return false;
		}
	},
	
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			Datas = oController._DetailTableJSonModel.getData(),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vPerid = oController._TargetJSonModel.getProperty("/Data/Perid"),
			vEncid = oController._TargetJSonModel.getProperty("/Data/Encid"),
			vEname = oController._TargetJSonModel.getProperty("/Data/Ename"),
			vOrgeh = oController._TargetJSonModel.getProperty("/Data/Orgeh"),
			vOrgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx");
		
		Datas.Data.push({
			ZappStatAl : oController._vZappStatAl,
			Idx : Datas.Data.length + 1,
			Pernr : vPernr,
			Encid : vEncid,
			Perid : vPerid,
			Ename : vEname,
			Orgeh : vOrgeh,
			Orgtx : vOrgtx,
			Tovrt : "0",
			Totex : "0",
			Tnght : "0"
		});
		
		oController._DetailTableJSonModel.setData(Datas);
		oController._DetailTableJSonModel.refresh();
		oTable.setVisibleRowCount(Datas.Data.length);
	},
	
	onPressDelRecord : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vIDXs = oDetailTable.getSelectedIndices();
		
		if(vIDXs.length < 1) {
			new sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		var procDeleteRecord = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var detailData = oController._DetailTableJSonModel.getData().Data;
				
				for(var i = vIDXs.length - 1; i >= 0; i--) {
					var rowIndex = vIDXs[i],
						_selPath = oDetailTable.getContextByIndex(rowIndex).sPath,
						realIndex = Number(_selPath.split('/')[2]);
					
					detailData.splice(realIndex, 1);
					oDetailTable.removeSelectionInterval(rowIndex, rowIndex);
				}
				
				oDetailTable.getModel().setData({
					Data : common.Common.reIndexODataArray(detailData)
				});
				oDetailTable.setVisibleRowCount(detailData.length || 1);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : procDeleteRecord
		});
	},
	
	onPressExcelDown : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date()
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModelData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0804") + "-" + dateFormat.format(curDate) + ".xlsx"	// 804:근태기록부(예외) 내역
		};
	
		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},
	
	onPressFormExcelDown : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			aDataCopy = [];
		
		aDataCopy = oJSONModelData.filter(function(item) {
			return item.Perid != "계";
		});
		
		var oSettings = {
				workbook: { columns: [
					oController._Columns[1],
					oController._Columns[5],
					oController._Columns[6],
					oController._Columns[7],
					oController._Columns[8]
				] },
				dataSource: aDataCopy,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_2911") + ".xlsx"	// 2911:근태기록부(예외자) 양식
		};
	
		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},
	
	changeFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			reader = new FileReader(),
			f = jQuery.sap.domById(oController.PAGEID + "_EXCEL_UPLOAD_BTN" + "-fu").files[0];
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN"), 
			vTsmon = oController._DetailJSonModel.getProperty("/Data/Tsmon"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vPerid = oController._TargetJSonModel.getProperty("/Data/Perid"),
			vEncid = oController._TargetJSonModel.getProperty("/Data/Encid"),
			vEname = oController._TargetJSonModel.getProperty("/Data/Ename"),
			vOrgeh = oController._TargetJSonModel.getProperty("/Data/Orgeh"),
			vOrgtx = oController._TargetJSonModel.getProperty("/Data/Orgtx"),
			Datas = {Data : []},
			rowDatas = [],
			vIdx = 0,
			vChkCountTsmon = 0;
		
		if(vTsmon) {
			vTsmon = vTsmon.replace(/[^\d]/g, '');
			vTsmon = vTsmon.substring(0, 6);
		}
		
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = oController.X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]),
				cRowData = {};
			
			if(roa && roa.length) {
				roa.forEach(function(rowElem) {
					var vTsdat = rowElem.Coulmn_0,
						compareTsdat = "";
					if(vTsdat && vTsdat.length > 7) {
						vTsdat = vTsdat.replace(/[^\d]/g, '');
						vTsdat = (vTsdat.length == 8) ? vTsdat.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3') : undefined;
						
						compareTsdat = vTsdat.replace(/[^\d]/g, '');
						compareTsdat = compareTsdat.substring(0, 6);
						
						// 귀속년월 체크
						if(vTsmon != compareTsdat) {
							vTsdat = undefined;
							vChkCountTsmon++;
						}
					} else {
						vTsdat = undefined;
					}
					
					cRowData = {};
					cRowData.ZappStatAl = oController._vZappStatAl,
					cRowData.Idx = ++vIdx;
					cRowData.Pernr = vPernr;
					cRowData.Perid = vPerid;
					cRowData.Encid = vEncid;
					cRowData.Ename = vEname;
					cRowData.Orgeh = vOrgeh;
					cRowData.Orgtx = vOrgtx;
					cRowData.Tsdat = vTsdat;
					cRowData.Tovrt = rowElem.Coulmn_1 || "0";
					cRowData.Totex = rowElem.Coulmn_2 || "0";
					cRowData.Tnght = rowElem.Coulmn_3 || "0";
					cRowData.Zbigo = rowElem.Coulmn_4;
					
					rowDatas.push(cRowData);
				});
			}
		});
		
		if(rowDatas.length) {
			Datas.Data = rowDatas;
			
			oController._DetailTableJSonModel.setData(Datas);
			oController._DetailTableJSonModel.refresh();
			
			oTable.setVisibleRowCount(Datas.Data.length);
			
			if(vChkCountTsmon > 0) sap.m.MessageBox.warning(oBundleText.getText("LABEL_2912"), {});	// 2912:귀속년월과 다른 일자는 입력할 수 없습니다.
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0486"), {});	// 486:Excel정보를 읽을 수 없습니다.
			return;
		}
		
		oFileUploader.setValue("");
		oFileUploader.setVisible(false);
		oFileUploader.setVisible(true);
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
//			oController = oView.getController();
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/ExtMonthlyTimeHeaderSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.Pernr = oDetailData.Data.Zpernr;
				if(oController._vZappStatAl == "" || oController._vZappStatAl == "10") {
					oDetailData.Data.Tsmon = (oDetailData.Data.Tsmon + "01").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
				} else {
					oDetailData.Data.Tsmon = oDetailData.Data.Tsmon.replace(/(\d{4})(\d{2})/g, '$1.$2')
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
	
	retrieveDetailTable : function(oController, oDetailTableData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {},
			vIdx = 1;
		
		oModel.read("/ExtMonthlyTimeDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						elem.Idx = vIdx++;
						elem.Tsdat = dateFormat.format(elem.Tsdat);
//						elem.ZappStatAl = oController._vZappStatAl;
						
						oDetailTableData.Data.push(elem);
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
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0802") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 805:근태기록부(예외자)
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0802") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 805:근태기록부(예외자)
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0802") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 805:근태기록부(예외자)
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {};
		
		if(!oController.onValidationData(oController, vPrcty)) return;
		
		var onProcess = function() {
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			var oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			oneData.Zpernr = oneData.Pernr;
			
			createData = common.Common.copyByMetadata(oModel, "ExtMonthlyTimeHeader", oneData);
			createData.Tsmon = createData.Tsmon.replace(/[^\d]/g, '').substring(0, 6);
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			vTableData.forEach(function(element) {
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "ExtMonthlyTimeDetail", element);
				vDetailData.Tsdat = "\/Date("+ common.Common.getTime(vDetailData.Tsdat)+")\/";
				
				vDetailDataList.push(vDetailData);
			});
			
			createData.ExtMonthlyTimeNav = vDetailDataList;
			
			oModel.create("/ExtMonthlyTimeHeaderSet", createData, {
				success: function(data,res) {
					if(data) {
					}
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E'){
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
		
		var CreateProcess = function(fVal) {
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
			actions : [
				sap.m.MessageBox.Action.YES, 
				sap.m.MessageBox.Action.NO
			],
			onClose : CreateProcess
		});
	},	
	
	onValidationData : function(oController, vPrcty) {
		var vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Excty) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0806"));	// 806:예외대상구분이 선택되지 않았습니다.
			return "";
		}
		if(!vData.Tsmon) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0807"));	// 807:귀속년월이 입력되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(!vData.Tmrsn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0808"));	// 808:예외근무신청사유가 입력되지 않았습니다.
				return "";
			}
			
			var targetDatas = oController._DetailTableJSonModel.getProperty("/Data");
			if(targetDatas.constructor !== Array || targetDatas.length < 1) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0809"), {title : oBundleText.getText("LABEL_0053")});	// 809:근태내역을 입력하여 주십시오.
				return false;
			}
			
			var isDup = false, 
				isDateValid = true,
				isInputValid = true,
				aTsdat = [];
			targetDatas.some(function(elem, index) {
				if(!elem.Tsdat) {
					isDateValid = false;
					return true;
				}
				
				if((!elem.Tovrt || elem.Tovrt == "0") && (!elem.Totex || elem.Totex == "0") && (!elem.Tnght || elem.Tnght == "0")) {
					isInputValid = false;
					return true;
				}
				
				if(aTsdat.indexOf(elem.Tsdat) > -1) {
					isDup = true;
					return true;
				} else {
					aTsdat.push(elem.Tsdat);
				}
			});
			
			if(isDup) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0810"), {title : oBundleText.getText("LABEL_0053")});	// 810:일자가 중복되었습니다.
				return false;
			}
			if(!isDateValid) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0811"), {title : oBundleText.getText("LABEL_0053")});	// 811:일자를 입력하세요.
				return false;
			}
			if(!isInputValid) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0812"), {title : oBundleText.getText("LABEL_0053")});	// 812:근태시간을 입력하세요.
				return false;
			}
			
			// 결재자 지정여부 확인
			var oData = oController._ApprovalLineModel.getProperty("/Data");
			var vApprovalCheck = "";
			if(oData && oData.length > 0) {
				for(var i=0; i <oData.length ; i++ ) {
					if(oData[i].Aprtype == "A03001") {
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
		
		return true;
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV");
			
			oModel.remove("/ExtMonthlyTimeHeaderSet(Appno='" + vDetailData.Appno + "')", {
				success: function(data,res) {
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.show(errData.ErrorMessage, {});
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
		
		var DeleteProcess = function(fVal) {
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
	
	// 신청내역 초기화
	onResetDetail : function(oController) {
		var detailData = oController._DetailJSonModel.getProperty("/Data"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		
		delete detailData.Excty;
		delete detailData.Tmrsn;
		detailData.Tsmon = dateFormat.format(new Date());
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
		
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailTableJSonModel.refresh();
		oTable.setVisibleRowCount(1);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});
