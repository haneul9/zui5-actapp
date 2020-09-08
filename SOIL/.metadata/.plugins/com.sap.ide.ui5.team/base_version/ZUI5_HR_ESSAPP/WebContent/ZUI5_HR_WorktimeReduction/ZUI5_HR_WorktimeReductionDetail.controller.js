jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail
	 */

	PAGEID : "ZUI5_HR_WorktimeReductionDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'TM44',
	_vEnamefg : "",
	_vPersa : "" ,
	_vAppno : "",
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
	_TM11AptypCodes : ["1520", "1530", "1540"],
	
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
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		// 유형별 UI
		oController.hideAllExtRowFields();
		if(oController._vAppno) oController.showExtFields(oDetailData.Data.Wktrd, oDetailData.Data.Lfcyl);
		
		// TEST(근무유형)
		oController._DetailJSonModel.setProperty("/Data/Todo1", "1");
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController();

		if(oController._vFromPage != "") {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionList",
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
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
							}).addStyleClass("Font14px FontColor3"),
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail");
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
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/WorktimeReduceApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Begda = (oDetailData.Data.Begda) ? dateFormat.format(oDetailData.Data.Begda) : undefined;
					oDetailData.Data.Endda = (oDetailData.Data.Endda) ? dateFormat.format(oDetailData.Data.Endda) : undefined;
					oDetailData.Data.Fgbdt = (oDetailData.Data.Fgbdt) ? dateFormat.format(oDetailData.Data.Fgbdt) : undefined;
					oDetailData.Data.Daystx = oDetailData.Data.Days + "일";
					oDetailData.Data.Hourstx = "근무시간(" + oDetailData.Data.Hours + "), 단축시간(" + oDetailData.Data.HoursN + ")";
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
				if(errData.Error && errData.Error == "E"){
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return ;
				}
			}
		});
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV"),
			errData = {};
		
		oModel.read("/WorktimeReduceApplSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_2989") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 2989:근로시간 단축 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_2989") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 2989:근로시간 단축 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_2989") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 2989:근로시간 단축 신청
		}
	},
	
	showExtFields : function(vWktrd, vLfcyl) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController();
		
		if(vWktrd == "1") {	// 임신기
			sap.ui.getCore().byId(oController.PAGEID + "_Type1").removeStyleClass("DisplayNone");
		} else if(vWktrd == "2") {	// 육아기
			sap.ui.getCore().byId(oController.PAGEID + "_Type2").removeStyleClass("DisplayNone");
			sap.ui.getCore().byId(oController.PAGEID + "_Type21").removeStyleClass("DisplayNone");
		} else if(vWktrd == "3") {	// 생애주기
			sap.ui.getCore().byId(oController.PAGEID + "_Type3").removeStyleClass("DisplayNone");
			if(vLfcyl == "1") {	// 가족돌봄
				sap.ui.getCore().byId(oController.PAGEID + "_Type31").removeStyleClass("DisplayNone");
			}
		}
	},
	
	hideAllExtRowFields : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().byId(oController.PAGEID + "_Type1").addStyleClass("DisplayNone");
		sap.ui.getCore().byId(oController.PAGEID + "_Type2").addStyleClass("DisplayNone");
		sap.ui.getCore().byId(oController.PAGEID + "_Type21").addStyleClass("DisplayNone");
		sap.ui.getCore().byId(oController.PAGEID + "_Type3").addStyleClass("DisplayNone");
		sap.ui.getCore().byId(oController.PAGEID + "_Type31").addStyleClass("DisplayNone");
	},
	
	resetSubInfo : function(oController) {
		oController._DetailJSonModel.setProperty("/Data/Grcyl", undefined);
		oController._DetailJSonModel.setProperty("/Data/Fname", undefined);
		oController._DetailJSonModel.setProperty("/Data/Fgbdt", undefined);
		oController._DetailJSonModel.setProperty("/Data/Aget", undefined);
		oController._DetailJSonModel.setProperty("/Data/UseVact", undefined);
		oController._DetailJSonModel.setProperty("/Data/Lfcyl", undefined);
		oController._DetailJSonModel.setProperty("/Data/F01cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/F02cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/F03cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/F04cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/F05cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/Disenm", undefined);
		oController._DetailJSonModel.setProperty("/Data/Schtx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Famgb", undefined);
		oController._DetailJSonModel.setProperty("/Data/Begda", undefined);
		oController._DetailJSonModel.setProperty("/Data/Endda", undefined);
		oController._DetailJSonModel.setProperty("/Data/Daystx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Beguz", undefined);
		oController._DetailJSonModel.setProperty("/Data/Enduz", undefined);
		oController._DetailJSonModel.setProperty("/Data/Hourstx", undefined);
	},
	
	resetSubLifecycleInfo : function(oController) {
		oController._DetailJSonModel.setProperty("/Data/F01cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/F02cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/F03cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/F04cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/F05cnt", undefined);
		oController._DetailJSonModel.setProperty("/Data/Fname", undefined);
		oController._DetailJSonModel.setProperty("/Data/Famgb", undefined);
		oController._DetailJSonModel.setProperty("/Data/Disenm", undefined);
		oController._DetailJSonModel.setProperty("/Data/Fgbdt", undefined);
		oController._DetailJSonModel.setProperty("/Data/Schtx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Begda", undefined);
		oController._DetailJSonModel.setProperty("/Data/Endda", undefined);
		oController._DetailJSonModel.setProperty("/Data/Daystx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Beguz", undefined);
		oController._DetailJSonModel.setProperty("/Data/Enduz", undefined);
		oController._DetailJSonModel.setProperty("/Data/Hourstx", undefined);
		
		sap.ui.getCore().byId(oController.PAGEID + "_Type3").setHeight('30px');
		sap.ui.getCore().byId(oController.PAGEID + "_Type3Toolbar").setHeight('30px');
	},
	
	getChildCareList : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vFname = oController._DetailJSonModel.getProperty("/Data/Fname"),
			rtnHistorys = [];
		
		if(!vEncid || !vFname) return;
		
		oModel.read("/ChildCareListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Fname', sap.ui.model.FilterOperator.EQ, vFname)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						rtnHistorys.push(moment(elem.Begda).format('YYYY-MM-DD') + " ~ " + moment(elem.Endda).format('YYYY-MM-DD') + " (" + elem.Days + "일)");
					});
				}
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController._DetailJSonModel.setProperty("/Data/UseVact", rtnHistorys.join("\n"));
	},
	
	onChangeChildrenName : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController();
		
		// 과거 육아휴직 이력 조회
		oController.getChildCareList(oController);
	},
	
	onChangeWktrd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController(),
			vKey = oEvent.getSource().getSelectedKey();
		
		oController.resetSubInfo(oController);
		oController.hideAllExtRowFields();
		
		if(vKey == "1") {
			sap.ui.getCore().byId(oController.PAGEID + "_Type1").removeStyleClass("DisplayNone");
		} else if(vKey == "2") {
			sap.ui.getCore().byId(oController.PAGEID + "_Type2").removeStyleClass("DisplayNone");
			sap.ui.getCore().byId(oController.PAGEID + "_Type21").removeStyleClass("DisplayNone");
			
			// 과거 육아휴직 이력 조회
			oController.getChildCareList(oController);
		} else if(vKey == "3") {
			sap.ui.getCore().byId(oController.PAGEID + "_Type3").removeStyleClass("DisplayNone");
		}
	},
	
	onChangeLfcyl : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController(),
			vKey = oEvent.getSource().getSelectedKey();
		
		oController.resetSubLifecycleInfo(oController);
		
		if(vKey == "1") {	// 가족돌봄
			sap.ui.getCore().byId(oController.PAGEID + "_Type3").setHeight('60px');
			sap.ui.getCore().byId(oController.PAGEID + "_Type3Toolbar").setHeight('60px');
			sap.ui.getCore().byId(oController.PAGEID + "_Type31").removeStyleClass("DisplayNone");
		} else if(vKey == "3") {	// 은퇴준비
			var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV"),
				dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
				vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
			
			oModel.read("/PerFgbdtSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
				],
				success : function(data, res) {
					if(data.results && data.results.length) {
						if(data.results[0].Fgbdt) {
							oController._DetailJSonModel.setProperty("/Data/Fgbdt", dateFormat.format(data.results[0].Fgbdt));
							
							oController.getAge(oController);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
					console.log(errData);
				}
			});
			
			sap.ui.getCore().byId(oController.PAGEID + "_Type31").addStyleClass("DisplayNone");
		} else {
			sap.ui.getCore().byId(oController.PAGEID + "_Type31").addStyleClass("DisplayNone");
		}
	},
	
	onCalcAge : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController(),
			vFgbdt = oEvent.getSource().getDateValue();
		
		oController.getAge(oController);
	},
	
	getAge : function(oController) {
		var vFgbdt = oController._DetailJSonModel.getProperty("/Data/Fgbdt"),
			vBegda = oController._DetailJSonModel.getProperty("/Data/Begda");
		
		if(!vFgbdt || !vBegda) return;
		
		vFgbdt = vFgbdt.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
		vBegda = vBegda.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
		
		oController._DetailJSonModel.setProperty("/Data/Aget", moment(vBegda).diff(moment(vFgbdt).format('YYYYMMDD'), 'years') + "세");
	},
	
	getCalcWorktime : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vBegda = oController._DetailJSonModel.getProperty("/Data/Begda"),
			vEndda = oController._DetailJSonModel.getProperty("/Data/Endda"),
			vBeguz = oController._DetailJSonModel.getProperty("/Data/Beguz"),
			vEnduz = oController._DetailJSonModel.getProperty("/Data/Enduz"),
			aFilters = [],
			errData = {},
			result = {};
		
		if(!vEncid || !vBegda || !vEndda) return null;
		
		vBegda = vBegda.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
		vEndda = vEndda.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
		
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid));
		aFilters.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(new Date(vBegda))));
		aFilters.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(new Date(vEndda))));
		if(vBeguz && vEnduz) {
			aFilters.push(new sap.ui.model.Filter('Beguz', sap.ui.model.FilterOperator.EQ, vBeguz));
			aFilters.push(new sap.ui.model.Filter('Enduz', sap.ui.model.FilterOperator.EQ, vEnduz));
		}
		
		oModel.read("/CalcWorktimeSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					result.DaysOutput = data.results[0].DaysOutput;
					if(vBeguz && vEnduz) result.TimeOutput = data.results[0].TimeOutput;
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error == "E") {
			sap.m.MessageBox.show(errData.ErrorMessage);
			
			return null;
		}
		
		return result;
	},
	
	getCheckCalcMessage : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vWktrd = oController._DetailJSonModel.getProperty("/Data/Wktrd"),
			vLfcyl = oController._DetailJSonModel.getProperty("/Data/Lfcyl"),
			vFname = oController._DetailJSonModel.getProperty("/Data/Fname"),
			vBegda = oController._DetailJSonModel.getProperty("/Data/Begda"),
			vEndda = oController._DetailJSonModel.getProperty("/Data/Endda"),
			vBeguz = oController._DetailJSonModel.getProperty("/Data/Beguz"),
			vEnduz = oController._DetailJSonModel.getProperty("/Data/Enduz"),
			aFilters = [],
			errData = {},
			result = {};
		
		if(!vEncid || !vWktrd || !vBegda || !vEndda) return null;
		
		vBegda = vBegda.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
		vEndda = vEndda.replace(/[^\d]/g, '').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
		
		aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno));
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid));
		aFilters.push(new sap.ui.model.Filter('Wktrd', sap.ui.model.FilterOperator.EQ, vWktrd));
		aFilters.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(new Date(vBegda))));
		aFilters.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(new Date(vEndda))));
		if(vLfcyl) aFilters.push(new sap.ui.model.Filter('Lfcyl', sap.ui.model.FilterOperator.EQ, vLfcyl));
		if(vFname) aFilters.push(new sap.ui.model.Filter('Fname', sap.ui.model.FilterOperator.EQ, vFname));
		if(vBeguz && vEnduz) {
			aFilters.push(new sap.ui.model.Filter('Beguz', sap.ui.model.FilterOperator.EQ, vBeguz));
			aFilters.push(new sap.ui.model.Filter('Enduz', sap.ui.model.FilterOperator.EQ, vEnduz));
		}
		
		oModel.read("/CheckWorktimeSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					if(data.results[0].Message) result.Message = data.results[0].Message;
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error == "E") {
			sap.m.MessageBox.show(errData.ErrorMessage);
			
			return null;
		}
		
		return result;
	},
	
	onChangeReduceDay : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController(),
			vBegda = oController._DetailJSonModel.getProperty("/Data/Begda"),
			vEndda = oController._DetailJSonModel.getProperty("/Data/Endda");
		
		// 나이
		oController.getAge(oController);
		
		if(!vBegda || !vEndda) return;
		
		var calcResultObj = oController.getCalcWorktime(oController);
		
		if(calcResultObj && calcResultObj.DaysOutput) oController._DetailJSonModel.setProperty("/Data/Daystx", calcResultObj.DaysOutput);
		if(calcResultObj && calcResultObj.TimeOutput) oController._DetailJSonModel.setProperty("/Data/Hourstx", calcResultObj.TimeOutput);
		
		var checkResultObj = oController.getCheckCalcMessage(oController);
		
		if(checkResultObj && checkResultObj.Message) {
			sap.m.MessageBox.alert(checkResultObj.Message, {title : oBundleText.getText("LABEL_0053")});
		}
	},
	
	onChangeWorktime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail"),
			oController = oView.getController(),
			vBeguz = oController._DetailJSonModel.getProperty("/Data/Beguz"),
			vEnduz = oController._DetailJSonModel.getProperty("/Data/Enduz");
		
		if(!vBeguz || !vEnduz) return;
		
		var calcResultObj = oController.getCalcWorktime(oController);
		
		if(calcResultObj && calcResultObj.DaysOutput) oController._DetailJSonModel.setProperty("/Data/Daystx", calcResultObj.DaysOutput);
		if(calcResultObj && calcResultObj.TimeOutput) oController._DetailJSonModel.setProperty("/Data/Hourstx", calcResultObj.TimeOutput);
		
		var checkResultObj = oController.getCheckCalcMessage(oController);
		
		if(checkResultObj && checkResultObj.Message) {
			sap.m.MessageBox.alert(checkResultObj.Message, {title : oBundleText.getText("LABEL_0053")});
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail");
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
			vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV"),
				errData = {};
				
			oModel.create("/WorktimeReduceApplSet", vOData, {
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
			
			common.AttachFileAction.uploadFile(oController);
			
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
		var vData = oController._DetailJSonModel.getProperty("/Data"),
			rData = {},
			vWktrd = vData.Wktrd,
			vLfcyl = vData.Lfcyl;
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Wktrd) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3001"));	// 3001:근로단축유형이 선택되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(vWktrd == "1") {
				if(!vData.Grcyl) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3002"));	// 3002:임신주기가 선택되지 않았습니다.
					return "";
				}
			} else if(vWktrd == "2") {
				if(!vData.Fname) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3003"));	// 3003:자녀명이 입력되지 않았습니다.
					return "";
				}
				if(!vData.Fgbdt) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3004"));	// 3004:생년월일이 입력되지 않았습니다.
					return "";
				}
			} else if(vWktrd == "3") {
				if(vLfcyl == "1") {	// 가족돌봄
					if(!vData.Fname) {
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3005"));	// 3005:돌봄대상자 성명이 입력되지 않았습니다.
						return "";
					}
					if(!vData.Famgb) {
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3006"));	// 3006:가족관계가 선택되지 않았습니다.
						return "";
					}
				} else if(vLfcyl == "2") {	// 본인질병
					if(!vData.Disenm) {
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3007"));	// 3007:진단명(질병분류코드)가 입력되지 않았습니다.
						return "";
					}
				} else if(vLfcyl == "3") {	// 은퇴준비(55세이상)
					if(!vData.Fgbdt) {
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3004"));	// 3004:생년월일이 입력되지 않았습니다.
						return "";
					}
				} else if(vLfcyl == "4") {	// 학업
					if(!vData.Schtx) {
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3008"));	// 3008:학교명이 입력되지 않았습니다.
						return "";
					}
				}
			}
			
			if(!vData.Begda) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3009"));	// 3009:단축 시작일이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Endda) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3010"));	// 3010:단축 종료일이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Beguz) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3011"));	// 3011:근무 시작시간이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Enduz) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3012"));	// 3012:근무 종료시간이 입력되지 않았습니다.
				return "";
			}
			
			var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			if(oFileList.getItems().length < 1){ // 첨부파일 필수
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1174"));	// 1174:첨부파일은 필수 입니다.
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
		}
		
		try {
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV"), "WorktimeReduceAppl", vData);
			
			rData.Begda = (rData.Begda) ? "\/Date("+ common.Common.getTime(rData.Begda)+")\/" : undefined;
			rData.Endda = (rData.Endda) ? "\/Date("+ common.Common.getTime(rData.Endda)+")\/" : undefined;
			rData.Fgbdt = (rData.Fgbdt) ? "\/Date("+ common.Common.getTime(rData.Fgbdt)+")\/" : undefined;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_WORKTIME_REDUCE_SRV");
				
				oModel.remove("/WorktimeReduceApplSet(Appno='" + vDetailData.Appno + "')", {
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
		
		delete detailData.Wktrd;	// 근로단축유형
		delete detailData.Grcyl;	// 임신주기
		delete detailData.Fname;	// 자녀명
		delete detailData.Fgbdt;	// 생년월일
		delete detailData.Aget;		// 나이
		delete detailData.UseVact;	// 육아휴직사용내역
		delete detailData.Lfcyl;	// 신청유형
		delete detailData.F01cnt;	// 부,모
		delete detailData.F02cnt;	// 배우자
		delete detailData.F03cnt;	// 자녀
		delete detailData.F04cnt;	// 형제,자매
		delete detailData.F05cnt;	// 배우자의부모
		delete detailData.Disenm;	// 진단명(질병분류코드)
		delete detailData.Schtx;	// 학교명
		delete detailData.Famgb;	// 가족관계
		delete detailData.Begda;	// 단축기간
		delete detailData.Endda;	// 단축기간
		delete detailData.Daystx;	// 단축기간
		delete detailData.Beguz;	// 근무시간
		delete detailData.Enduz;	// 근무시간
		delete detailData.Hourstx;	// 근무시간
		delete detailData.Zbigo;	// 비고
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
		
		oController.hideAllExtRowFields();
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
	}
});