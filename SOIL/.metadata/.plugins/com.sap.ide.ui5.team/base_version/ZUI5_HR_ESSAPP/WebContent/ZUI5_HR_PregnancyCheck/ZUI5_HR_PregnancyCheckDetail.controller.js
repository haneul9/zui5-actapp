jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail
	 */

	PAGEID : "ZUI5_HR_PregnancyCheckDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
//	_vPITButtonCYn : "",
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "HR33",
	_ObjList : [],
	_vOrgeh : "",
	_vOrgtx : "",
	_useCustomPernrSelection : "",
	_selectionRowIdx : null,
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
		common.MandateAction.oController = oController;
		
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_DIAG_SRV");
		var oDetailData = {Data : {}};
		var vZappStatAl = "";
		var errData = {};
		
		if(vAppno != "") { // 수정 및 조회
			oController.BusyDialog.open();
			
			oModel.read("/PregnantDiagRequestApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
				],
				success : function(data, res) {
					if(data && data.results.length) {
						oDetailData.Data = data.results[0];
						oDetailData.Data.Zdate = dateFormat.format(oDetailData.Data.Zdate);
						oDetailData.Data.Usedt = dateFormat.format(oDetailData.Data.Usedt);
						oController._DetailJSonModel.setData(oDetailData);
						
						oController._TargetJSonModel.setData({Data : {Pernr : oDetailData.Data.Pernr}});
						vZappStatAl = oDetailData.Data.ZappStatAl;
					}
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
		
		// 첨부파일 - 신청 이후에도 버튼 노출
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);
		sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN").setVisible(true);
		sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_DELETE_BTN").setVisible(true);
		sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table").setMode(sap.m.ListMode.MultiSelect);
		/****************************************************/
		/*********** 공통적용사항 End	 			 ************/
		/****************************************************/
		
		// 신규 결재번호 채번 및 ess 출산예정일 조회
		if(vAppno == "") {
			oController.BusyDialog.open();
			
			if(_gAuth == 'E') {
				// 출산예정일 조회
				oController.retrieveZdate(oController);
			}
			
			// 결재번호 채번
			oModel.read("/PregnantDiagRequestApplSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I')
				],
				success : function(data, res) {
					if(data && data.results.length) {
						oController._vAppno = data.results[0].Appno ;
						oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
						
						oController.BusyDialog.close();
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
		
		// 신청유형 콤보 조회
		oController.onSetAwart(oController);
		
		// 임신기간 조회
		oController.retrievePregnantMon(oController);
		
		// 사용실적 조회
		oController.retrieveDiag(oController);
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl) {
			oPortalTitle.setText(oBundleText.getText("LABEL_0164") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 164:태아검진 외출 신청	
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText(oBundleText.getText("LABEL_0164") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 164:태아검진 외출 신청
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_0164") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 164:태아검진 외출 신청
		}

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix");
		
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
							}).addStyleClass("Font14px FontColor6")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail");
		var oController = oView.getController();
	},
	
	onUsedtChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail"),
			oController = oView.getController();
		
		// 임신기간 조회
		oController.retrievePregnantMon(oController);
	},
	
	// 리스트 조회
	retrieveDiag : function(oController) {
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_DIAG_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"}),
			Datas = {Data : []},
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vZdate = oController._DetailJSonModel.getProperty("/Data/Zdate");
		
		oTable.setVisibleRowCount(0);
		if(!vPernr || !vZdate) return;
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		oModel.read("/PregnantDiagLogSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Zdate', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(new Date(vZdate)))
			],
			success : function(data,res){
				if(data && data.results.length) {
					for(var i=0;i<data.results.length;i++){
						var OneData = data.results[i];
						OneData.Begda = dateFormat.format(OneData.Begda);
						OneData.Endda = dateFormat.format(OneData.Endda);
						OneData.Usedt = OneData.Usedt ? dateFormat.format(OneData.Usedt) : '';
						
						Datas.Data.push(OneData);
					}
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				oController.Error = errData.Error;
				oController.ErrorMessage = errData.ErrorMessage;
			}
		});
		
		oController._DetailTableJSonModel.setData(Datas);
		oTable.setVisibleRowCount(Datas.Data.length);
		
		if(oController.Error == "E") {
			oController.BusyDialog.close();
			oController.Error = "";
			sap.m.MessageBox.show(oController.ErrorMessage);
		}
		
		oTable.bindRows("/Data");
	},
	
	onSetAwart : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_DIAG_SRV"),
			oAwart = sap.ui.getCore().byId(oController.PAGEID + "_Awart"),
			vAwart = oController._DetailJSonModel.getProperty("/Data/Awart"),
			vZdate = oController._DetailJSonModel.getProperty("/Data/Zdate"),
			veqyn = "";
		
		vZdate = vZdate ? new Date(vZdate) : new Date();
		
		oAwart.destroyItems();
		
		oModel.read("/PregnantDiagReqTypeSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Zdate', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(vZdate))
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						if(vAwart == data.results[i].Awart) veqyn = "X" ;
						
						oAwart.addItem(new sap.ui.core.Item({ key: data.results[i].Awart, text: data.results[i].Atext }));
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		// 기존입력값과 동일한 값이 존재하지 않을 시 처리
		if(veqyn == "") oController._DetailJSonModel.setProperty("/Data/Awart","");
	},
	
	retrievePregnantMon : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_DIAG_SRV"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vZdate = oController._DetailJSonModel.getProperty("/Data/Zdate"),
			vUsedt = oController._DetailJSonModel.getProperty("/Data/Usedt");
		
		if(!vPernr || !vZdate || !vUsedt) return;
		
		oModel.read("/PregnantDiagPeriodSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Zdate', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(new Date(vZdate))),
				new sap.ui.model.Filter('Usedt', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vUsedt))
			],
			success : function(data, res) {
				if(data && data.results.length) {
					oController._DetailJSonModel.setProperty("/Data/Mon", data.results[0].Mon);
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
	
	retrieveZdate : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_DIAG_SRV"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		if(!vPernr) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0162"));	// 162:임신직원 등록을 먼저 신청하세요.
			oController._DetailJSonModel.setProperty("/Data/Zdate", '');
			return;
		} 
		
		oModel.read("/PregnantDiagZdateSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr)
			],
			success: function(data,res){
				if(data && data.results.length) {
					if(data.results[0].Zdate) oController._DetailJSonModel.setProperty("/Data/Zdate", dateFormat.format(data.results[0].Zdate));
				}
			},
			error: function(res){
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
	},
	
	// 결재자 정보
	setApprovalLineModel : function(oController) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail");
		
		if(!oController._ApprovalLineDialog) {
			oController._ApprovalLineDialog = sap.ui.jsfragment("fragment.ApprovalLine", oController);
			oView.addDependent(oController._ApprovalLineDialog);
		}		

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable.getModel();	// oController._ApprovalLineModel
		var vData = {Data : []};
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var aFilters = [];

		aFilters.push(new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, 'RF03'));
		aFilters.push(new sap.ui.model.Filter('ZreqPernr1', sap.ui.model.FilterOperator.EQ, oController._vReqPernr));
		if(oController._vAppno) {
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno));
		}
		
		oModel.read("/ApprovalLineApplSet", {
			async : false,
			filters : aFilters,
			success : function(data,res) {
				if(data && data.results.length) {
					for(var i=0;i<data.results.length;i++) {							
						data.results[i].Idx = i+1;
						vData.Data.push(data.results[i]);
					}
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				vError = errData.Error;
				vErrorMessage = errData.ErrorMessage;
			}
		});
		
		oJSONModel.setData(vData);
		oController._ApprovalLineModel.setData(vData); 
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		oController._DetailJSonModel.setProperty("/Data/Zdate", ""); 		// 출산예정일
		oController._DetailJSonModel.setProperty("/Data/Usedt", ""); 		// 사용일
		oController._DetailJSonModel.setProperty("/Data/Mon", "");   		// 임신기간
		oController._DetailJSonModel.setProperty("/Data/Awart", "");   		// 유형
		oController._DetailJSonModel.setProperty("/Data/Atext", "");   		// 유형 text
		oController._DetailJSonModel.setProperty("/Data/Zbigo", "");   		// 비고
	},	
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 결재라인 초기화
		oController._ApprovalLineModel.setData({Data : []});
		
		// 출산예정일 조회
		oController.retrieveZdate(oController);
		
		// 사용실적 조회
		oController.retrieveDiag(oController);
		
		// 신청유형 콤보 조회
		oController.onSetAwart(oController);
	},
	
	// 파일 업로드
	onPressFileUpload : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail"),
			oController = oView.getController();
		
		try {
			var _handleSuccess = function(data) {
				console.log(oBundleText.getText("LABEL_0165") + ", " + data);	// 165:파일 업로드를 완료하였습니다
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0165"));	// 165:파일 업로드를 완료하였습니다
			}; 
			var _handleError = function(data){
				var errorMsg = null;
				if (data.responseText){
					errorMsg = /<message xml:lang="ko">(.*?)<\/message>/.exec(data.responseText);
				}else{
					errorMsg = oBundleText.getText("LABEL_0166");	// 166:파일 업로드에 실패하였습니다.
				}
				if(errorMsg && errorMsg.length) {
					console.log("Error: " + errorMsg[1]);
					sap.m.MessageBox.alert("Error: " + errorMsg[1]);
				} else {
					console.log("Error: " + errorMsg);
					sap.m.MessageBox.alert("Error: " + errorMsg);
				}
			};
			
			var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			if(oAttachFileList.getModel().getProperty("/Data")){
				for(var i = 0 ; i < oAttachFileList.getModel().getProperty("/Data").length ; i++){
					var vData = oAttachFileList.getModel().getProperty("/Data/" + i);
					if(!vData.Appno || vData.Appno == ""){
						sap.ui.getCore().getModel("ZHR_COMMON_SRV").refreshSecurityToken();
						var oRequest = sap.ui.getCore().getModel("ZHR_COMMON_SRV")._createRequest();
						var oHeaders = {
							"x-csrf-token": oRequest.headers['x-csrf-token'],
							"slug": oController._vAppno + "|" + oController._vZworktyp + "|" + encodeURI(vData.name)
						}; 
						console.log(oHeaders.slug);
						jQuery.ajax({
							type: 'POST',
							async : false,
							url: "/sap/opu/odata/sap/ZHR_COMMON_SRV/FileUploadSet/",
							headers: oHeaders,
							cache: false,
							contentType: vData.type,
							processData: false,
							data: vData,
							success: _handleSuccess,
							error: _handleError,
						});
					}
				}
			}
			
		} catch(oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail"),
			oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function() {
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X") {
				oController.BusyDialog.close();
				return false;
			}
			
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_DIAG_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {},
				errData = {};
			
			createData = common.Common.copyByMetadata(oModel, "PregnantDiagRequestAppl", oneData);
			createData.Zdate = "\/Date("+ common.Common.getTime(createData.Zdate)+")\/";
			createData.Usedt = "\/Date("+ common.Common.getTime(createData.Usedt)+")\/";
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			console.log(createData);
			
			oModel.create("/PregnantDiagRequestApplSet", createData, {
				success : function(data, res) {
					if(data) {
					} 
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E") {
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
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
		if(!oneData.Zdate){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0162"), {title : oBundleText.getText("LABEL_0053")});	// 162:임신직원 등록을 먼저 신청하세요.
			return false;
		} else if(!oneData.Usedt){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0155"), {title : oBundleText.getText("LABEL_0053")});	// 155:사용일을 선택하여 주십시오.
			return false;
		} else if(!oneData.Awart){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0158"), {title : oBundleText.getText("LABEL_0053")});	// 158:신청유형을 선택하여 주십시오.
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var oModel = sap.ui.getCore().getModel("ZHR_PREGNANT_DIAG_SRV"),
					errData = {};
				
				oModel.remove("/PregnantDiagRequestApplSet(Appno='" + oController._vAppno + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				
				oController.BusyDialog.close();
								
				if(errData.Error && errData.Error == "E") {
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
	}
	
});