jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail
	 */

	PAGEID : "ZUI5_HR_InfantCareDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR31',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",

	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
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
			vFromPageId = "";
		
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		var vZappStatAl = "" , vRegno = "",
			oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle"),
			oModel = sap.ui.getCore().getModel("ZHR_CHILD_CARE_SRV"),
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []};
		
		oController.BusyDialog.open();
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			vPernr = vEmpLoginInfo[0].Pernr,
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			errData = {};
		
		// 초기화
		var Datas = { Data : []} ;
		oController._DetailTableJSonModel.setData(Datas);
		
		if(oController._vAppno != "") { // 수정 및 조회
			oController.BusyDialog.open();
			
			oModel.read("/ChildCareExpensesApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
				],
				success : function(data, res) {
					oDetailData.Data = data.results[0];
					oDetailData.Data.Fgbdt = dateFormat.format(oDetailData.Data.Fgbdt);
					oController._DetailJSonModel.setData(oDetailData);
					
					oController._TargetJSonModel.setData({Data : {Pernr : oDetailData.Data.Pernr}});
					vZappStatAl = oDetailData.Data.ZappStatAl;
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});
				return ;
			}
			
			oModel.read("/ChildCareExpensesApplDetailSet", {
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
						
						oController._DetailTableJSonModel.setData(oDetailTableData);
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
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		/****************************************************/
		/*********** 공통적용사항 End	 			 ************/
		/****************************************************/
		
		// 신청대상 리스트
		var vRegno = oController._DetailJSonModel.getProperty("/Data/Regno") || '';
		oController.setRegno(oController, oController._DetailJSonModel.getProperty("/Data/Pernr"), vRegno);
		
		// 수혜년도
		oController.onSetZyear(oController);
		
		// 현재 분기 셋팅
		var currMonth = (new Date().getMonth()) + 1;
		oDetailData.Data.Divcd = oDetailData.Data.Divcd || String(Math.ceil(currMonth / 3) * 10);
		
		// 월 combo
		oController.onSetMonth(oController);
		
		// 생일, 나이, 지원한도 조회
		oController.retrieveLimitAmt(oController);
		
		// 결재 상태에 따라 Page Header Text 수정		
		if( vZappStatAl == "" ) {
			// 통화키 Default는 한화 
			oController._DetailJSonModel.setProperty("/Data/Waers", "KRW");
			oDetailTitle.setText(oBundleText.getText("LABEL_0133") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 133:영유아 보육지원 신청	
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0133") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 133:영유아 보육지원 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0133") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 133:영유아 보육지원 신청
		}
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : oController._vFromPage || "ZUI5_HR_InfantCare.ZUI5_HR_InfantCareList",
		      data : {}
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
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail");
		var oController = oView.getController();
	},
	
	beforeOpenHistoryDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail");
		var oController = oView.getController();
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var oJSonModel = oHistoryTable.getModel();
		var oDatas = { Data : []};
		var vError = "" , vErrorMessage = ""; 
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_CHILD_CARE_SRV");
			
			oModel.read("/ChildCarePayHistorySet", {
				async: false,
				filters: [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")),
				],
				success: function(data,res){
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							var rData = data.results[i];
							
							rData.Payym = (rData.Payym.length == 6) ? rData.Payym.replace(/(\d{4})(\d{2})/g, '$1.$2') : rData.Payym;
							
							oDatas.Data.push(rData);
						}
					}
				},
				error: function(Res){
					vError = "E";
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						} else {
							vErrorMessage = ErrorMessage;
						}
					}}
			});
			oHistoryTable.setVisibleRowCount(oDatas.Data.length > 15 ? 15 : oDatas.Data.length);
			oJSonModel.setData(oDatas);
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
				return ;
			}
			
			oController.BusyDialog.close();
		};
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	onPressHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail");
		var oController = oView.getController();
		
		if(!oController._SearchHistoryDialog) {
			oController._SearchHistoryDialog = sap.ui.jsfragment("ZUI5_HR_InfantCare.fragment.HistoryDialog", oController);
			oView.addDependent(oController._SearchHistoryDialog);
		}
		
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var oJSonModel = oHistoryTable.getModel();
		oJSonModel.setData({Data : []});
		oHistoryTable.setVisibleRowCount(1);
		oController._SearchHistoryDialog.open();
	},
	
	// 신청대상 리스트
	setRegno : function(oController, vPernr, vRegno) {
		if(!vPernr) return;
		
		vRegno = vRegno || "";
		
		var oModel = sap.ui.getCore().getModel("ZHR_CHILD_CARE_SRV"),
			oRegno = sap.ui.getCore().byId(oController.PAGEID + "_Regno"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});
		
		if(oRegno.getItems()) oRegno.destroyItems();
		
		oModel.read("/ChildCareExpensesObjListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oRegno.addItem(new sap.ui.core.Item({
								key : elem.Regno, 
								text : elem.Famtx
							})
							.addCustomData(new sap.ui.core.CustomData({
								key : "Fgbdt", 
								value : elem.Fgbdt
							}))
						);
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
	},
	
	// 신청대상 변경 시 
	onChangeRegno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController(),
			oRegno = sap.ui.getCore().byId(oController.PAGEID + "_Regno"),
			vFgbdt = oRegno.getSelectedItem().getCustomData()[0].getValue(),
			currMonth = (new Date()).getMonth() + 1,
			currDivcd = String(Math.ceil(currMonth / 3) * 10),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});
		
		oController._DetailJSonModel.setProperty("/Data/Fgbdt", dateFormat.format(vFgbdt));
		oController._DetailJSonModel.setProperty("/Data/Chage", '0');
		oController._DetailJSonModel.setProperty("/Data/Ltamt", '0');
		oController._DetailJSonModel.setProperty("/Data/Zyear", new Date().getFullYear());  // 수혜년도
		oController._DetailJSonModel.setProperty("/Data/Singl", false);						// 싱글맘
		oController._DetailJSonModel.setProperty("/Data/Divcd", currDivcd);   				// 분기
		oController._DetailJSonModel.setProperty("/Data/Chsnm", "");						// 어린이집명
		oController._DetailJSonModel.setProperty("/Data/Chpla", "");						// 시설명
		
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailTableJSonModel.refresh();
		
		// 월 combo
		oController.onSetMonth(oController);
		
		oController.retrieveLimitAmt(oController);
	},
	
	onSetZyear : function(oController) {
		var oZyear = sap.ui.getCore().byId(oController.PAGEID + "_Zyear"),
			vZyear = oController._DetailJSonModel.getProperty("/Data/Zyear"),
			currYear = new Date().getFullYear();
		
		if(oZyear.getItems()) oZyear.destroyItems();
		
		for(var i = 0; i < 4; i++) {
			oZyear.addItem(new sap.ui.core.Item({text : currYear - i, key : currYear - i}));
		}
		
		if(!vZyear) oZyear.setSelectedKey(currYear);
	},
	
	// 분기 변경 event
	onChangeDivcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController();
		
		oController.onSetMonth(oController);
	},
	
	// 월 combo
	onSetMonth : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_CHILD_CARE_SRV"),
			oMonth = sap.ui.getCore().byId(oController.PAGEID + "_Mon"),
			vDivcd = oController._DetailJSonModel.getProperty("/Data/Divcd"),
			vDetailTableData = oController._DetailTableJSonModel.getData(),
			currMonth = (new Date()).getMonth() + 1,
			currDivcd = String(Math.ceil(currMonth / 3) * 10),
			monthsItems = [];
		
		oModel.read("/ChildCareMonthListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Divcd', sap.ui.model.FilterOperator.EQ, vDivcd)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						monthsItems.push({key : elem.Mon, text : elem.Montx});
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
		
		vDetailTableData.Data.forEach(function(elem) {
			elem.Mon = (elem.Mon) ? elem.Mon : (currDivcd == vDivcd) ? common.Common.lpad(currMonth, 2) : monthsItems[0].key;
		});
		
		vDetailTableData.Months = monthsItems;
		oController._DetailTableJSonModel.setData(vDetailTableData);
	},
	
	// 수혜년도 변경시
	onChangeZyear : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController();
		
		oController.retrieveLimitAmt(oController);
	},
	
	// 싱글맘 여부 체크시
	onSelectSingl : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController();
		
		oController.retrieveLimitAmt(oController);
	},
	
	retrieveLimitAmt : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_CHILD_CARE_SRV"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vSingl = oController._DetailJSonModel.getProperty("/Data/Singl") || false,
			vRegno = oController._DetailJSonModel.getProperty("/Data/Regno"),
			vZyear = oController._DetailJSonModel.getProperty("/Data/Zyear"),
			errData = {};
		
		if(!vPernr || !vRegno || !vZyear) {
			return;
		}
		
		oModel.read("/ChildCareLimitSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Singl', sap.ui.model.FilterOperator.EQ, vSingl),
				new sap.ui.model.Filter('Regno', sap.ui.model.FilterOperator.EQ, vRegno.replace(/[^\d]/g, '')),
				new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, vZyear)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					oController._DetailJSonModel.setProperty("/Data/Chage", data.results[0].Chage);
					oController._DetailJSonModel.setProperty("/Data/Ltamt", data.results[0].Ltamt);
					
					oController.calSumAllRow(oController);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E") {
			oController._DetailJSonModel.setProperty("/Data/Chage", "0");
			oController._DetailJSonModel.setProperty("/Data/Ltamt", "0");
			
			sap.m.MessageBox.alert(errData.ErrorMessage);
			return ;
		}
	},
	
	onChangCalcSum : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId("ZUI5_HR_InfantCareDetail_DetailTable"),
			rowPath = oEvent.getSource().getBindingContext().getPath(),
			rowObject = oDetailTable.getModel().getProperty(rowPath),
			vIdx = rowObject.Idx,
			vLtamt = parseInt(oController._DetailJSonModel.getProperty("/Data/Ltamt") || 0),
			vCaref = (rowObject.Caref) ? parseInt(common.Common.removeComma(rowObject.Caref)) : 0,
			vSpeci = (rowObject.Speci) ? parseInt(common.Common.removeComma(rowObject.Speci)) : 0,
			vSitef = (rowObject.Sitef) ? parseInt(common.Common.removeComma(rowObject.Sitef)) : 0,
			vEtcfe = (rowObject.Etcfe) ? parseInt(common.Common.removeComma(rowObject.Etcfe)) : 0,
			vSum, vSumHalf, vApplySum;

		vSum = vCaref + vSpeci + vSitef + vEtcfe,
		vSumHalf = Math.round((vSum / 2)),
		vApplySum = (vSumHalf >= vLtamt) ? vLtamt : vSumHalf;
		
		oDetailTable.getModel().setProperty("/Data/" + (vIdx - 1) + "/Total", common.Common.numberWithCommas(vSum));
		oDetailTable.getModel().setProperty("/Data/" + (vIdx - 1) + "/Apply", common.Common.numberWithCommas(vApplySum));
	},
	
	calSumAllRow : function(oController) {
		var oDetailTable = sap.ui.getCore().byId("ZUI5_HR_InfantCareDetail_DetailTable"),
			tableData = oDetailTable.getModel().getData(),
			vLtamt = parseInt(oController._DetailJSonModel.getProperty("/Data/Ltamt") || 0),
			vSum, vSumHalf, vApplySum, vCaref, vSpeci, vSitef, vEtcfe;
		
		tableData.Data.forEach(function(elem) {
			vCaref = elem.Caref || 0;
			vSpeci = elem.Speci || 0;
			vSitef = elem.Sitef || 0;
			vEtcfe = elem.Etcfe || 0;
			
			vSum = parseInt(common.Common.removeComma(vCaref)) 
				+ parseInt(common.Common.removeComma(vSpeci)) 
				+ parseInt(common.Common.removeComma(vSitef)) 
				+ parseInt(common.Common.removeComma(vEtcfe));
			vSumHalf = Math.round((vSum / 2)),
			vApplySum = (vSumHalf >= vLtamt) ? vLtamt : vSumHalf;
			
			elem.Caref = common.Common.numberWithCommas(vCaref);
			elem.Speci = common.Common.numberWithCommas(vSpeci);
			elem.Sitef = common.Common.numberWithCommas(vSitef);
			elem.Etcfe = common.Common.numberWithCommas(vEtcfe);
			elem.Total = common.Common.numberWithCommas(vSum);
			elem.Apply = common.Common.numberWithCommas(vApplySum);
		});
		
		oDetailTable.getModel().setData(tableData);
	},
	
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId("ZUI5_HR_InfantCareDetail_DetailTable"),
			tableData = oDetailTable.getModel().getData(),
			vDivcd = oController._DetailJSonModel.getProperty("/Data/Divcd"),
			currMonth = common.Common.lpad((new Date()).getMonth() + 1, 2),
			currDivcd = String(Math.ceil(currMonth / 3) * 10),
			newCol = {};
		
		if(tableData.Data.length == 3) {
			new sap.m.MessageBox.alert(oBundleText.getText("LABEL_0112"));	// 112:더이상 추가 할 수 없습니다.
			return;
		}
		
		newCol.Idx = tableData.Data.length + 1;
		newCol.ZappStatAl = '';
		newCol.Total = '0';
		newCol.Apply = '0';
		newCol.Mon = (vDivcd == currDivcd) ? currMonth : tableData.Months[0].key;
		
		tableData.Data.push(newCol);
		oDetailTable.getModel().setData(tableData);
	},
	
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			delRecords = oDetailTable.getSelectedItems();
		
		if(delRecords.length < 1) {
			new sap.m.MessageBox.alert(oBundleText.getText("LABEL_0110"));	// 110:대상을 선택하여 주십시오.
			return;
		}
		
		var procDeleteRecord = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var tableItems = oDetailTable.getItems(),
					detailData = oController._DetailTableJSonModel.getData();
				
				for(var i = tableItems.length-1; i >= 0; i--) {
					if(delRecords.indexOf(tableItems[i]) > -1) {
						detailData.Data.splice(i, 1);
					}
				}
				
				detailData.Data = common.Common.reIndexODataArray(detailData.Data);
				
				oDetailTable._aSelectedPaths = [];
				oDetailTable.getModel().setData(detailData);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : procDeleteRecord
		});
		
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController.onValidationData(oController, vPrcty);
		
		if(vOData == "") return;
		
		vOData.Actty = _gAuth;
		vOData.Prcty = vPrcty;
		vOData.Waers = "KRW";
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_CHILD_CARE_SRV");
			
			oModel.create("/ChildCareExpensesApplSet", vOData, {
				success: function(data,res) {
					if(data) {
						oController._vAppno = data.Appno;
						oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
						oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
						vZappStatAl = data.ZappStatAl;
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
			
			common.AttachFileAction.uploadFile(oController);
			
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
	
	onValidationData : function(oController, vPrtcy) {
		if (!Array.prototype.includes) {
			Object.defineProperty(Array.prototype, "includes", {
				enumerable: false,
				value: function(obj) {
					var newArr = this.filter(function(el) {
						return el == obj;
					});
					return newArr.length > 0;
				}
			});
		}
		
		var oModel = sap.ui.getCore().getModel("ZHR_CHILD_CARE_SRV"),
			rData = {},
			vData = oController._DetailJSonModel.getProperty("/Data"),
			vDetailData = {},
			vDetailDataList = [], 
			vDetailTableData = oController._DetailTableJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Regno) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0126"));	// 126:신청대상이 선택되지 않았습니다.
			return "";
		}
		if(!vData.Zyear) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0124"));	// 124:수혜년도가 선택되지 않았습니다.
			return "";
		}
		if(!vData.Divcd) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0116"));	// 116:분기가 선택되지 않았습니다.
			return "";
		}
		if(!vData.Chsnm) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0130"));	// 130:시설명이 입력되지 않았습니다.
			return "";
		}
		if(!vDetailTableData.length) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0119"));	// 119:상세내역을 입력해주세요.
			return "";
		} else if(vDetailTableData.length > 3) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0118"));	// 118:상세내역은 최대 3개만 입력 가능합니다.
			return "";
		} else {
			var isDup = false, 
				tmpMonthArray = [];
			
			vDetailTableData.forEach(function(elem) {
				if(tmpMonthArray.includes(elem.Mon)) isDup = true;
				tmpMonthArray.push(elem.Mon);
			});
			
			if(isDup) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0120"));	// 120:상세내역의 선택월은 중복 될 수 없습니다.
				return "";
			}
		}
		
//		if(vPrtcy == "C" && vData.Singl) {
		if(vPrtcy == "C" ) {
			var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			var vFileData = oAttachFileList.getModel().getProperty("/Data");
			if(!vFileData || vFileData.length < 1){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
				return false;
			}
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "ChildCareExpensesAppl", vData);
			rData.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
			rData.Singl = rData.Singl || false;
			rData.Regno = rData.Regno.replace(/[^\d]/g, '');
			rData.Zyear = String(rData.Zyear);
			rData.Fgbdt = "\/Date("+ common.Common.getTime(rData.Fgbdt.split('.').join('/'))+")\/";
			
			var vApplyTotal = 0;
			vDetailTableData.forEach(function(elem) {
				vDetailData = common.Common.copyByMetadata(oModel, "ChildCareExpensesApplDetail", elem);
				vDetailData.Seqnr = String(elem.Idx);
				vDetailData.Caref = common.Common.removeComma(elem.Caref);
				vDetailData.Speci = common.Common.removeComma(elem.Speci);
				vDetailData.Sitef = common.Common.removeComma(elem.Sitef);
				vDetailData.Etcfe = common.Common.removeComma(elem.Etcfe);
				vDetailData.Total = common.Common.removeComma(elem.Total);
				vDetailData.Apply = common.Common.removeComma(elem.Apply);
				vDetailData.Waers = "KRW";
				vDetailDataList.push(vDetailData);
				
				vApplyTotal += parseInt(vDetailData.Apply);
			});
			
			rData.Apply = String(vApplyTotal);
			rData.ChilCareDetailNav = vDetailDataList;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_CHILD_CARE_SRV");
			
			oModel.remove("/ChildCareExpensesApplSet(Appno='" + vDetailData.Appno + "')", {
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
		var currMonth = (new Date()).getMonth() + 1,
			currDivcd = String(Math.ceil(currMonth / 3) * 10);
		
		oController._DetailJSonModel.setProperty("/Data/Regno", "");  						// 신청대상 주민번호
		oController._DetailJSonModel.setProperty("/Data/Famtx", "");  						// 신청대상 텍스트
		oController._DetailJSonModel.setProperty("/Data/Fgbdt", "");   						// 생년월일
		oController._DetailJSonModel.setProperty("/Data/Chage", 0);  						// 만 나이
		oController._DetailJSonModel.setProperty("/Data/Zyear", new Date().getFullYear());  // 수혜년도
		oController._DetailJSonModel.setProperty("/Data/Singl", false);						// 싱글맘
		oController._DetailJSonModel.setProperty("/Data/Divcd", currDivcd);   				// 분기
		oController._DetailJSonModel.setProperty("/Data/Chsnm", "");						// 어린이집명
		oController._DetailJSonModel.setProperty("/Data/Chpla", "");						// 시설명
		oController._DetailJSonModel.setProperty("/Data/Apply", "");   						// 지원금액
		
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailTableJSonModel.refresh();
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 신청대상
		oController.setRegno(oController, oController._DetailJSonModel.getProperty("/Data/Pernr"));
		
		// 월 combo
		oController.onSetMonth(oController);
		
		// 생일, 나이, 지원한도 조회
		oController.retrieveLimitAmt(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	},
	
	onDisplaySearchZipcodeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController();
		
		common.ZipSearch.oController = oController;
		
		if(oController._vSelectedPernr == "") return;
		
		if(!oController._ZipSearchDialog) {
			oController._ZipSearchDialog = sap.ui.jsfragment("fragment.ZipSearchDialog", oController);
			oView.addDependent(oController._ZipSearchDialog);
		}
		
		oController._ZipMode = "1"; // 현 거주지
		oController._ZipSearchDialog.open();
	},
	
	onSelectAddress : function(zipNo, roadAddr, siNm, engAddr) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail"),
			oController = oView.getController();	
		
		oController._DetailJSonModel.setProperty("/Data/Chpla" , roadAddr);
	}
	
});

function jusoCallBack(Zip, Addr1, Addr2, EnAddr) {
	var oView = sap.ui.getCore().byId("ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail");
	var oController = oView.getController();

	oController._DetailJSonModel.setProperty("/Data/Chpla", Addr1 );
};