jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Medical.ZUI5_HR_MedicalDetail
	 */

	PAGEID : "ZUI5_HR_MedicalDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_MedicalFamilyList : new sap.ui.model.json.JSONModel(), 
	_DialogActionIndex : "" ,
	_vPersa : "" ,
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vZworktyp : "HR01",
	_vEnamefg : "",
	_oControl  : null,
	_vFromPage : "",
	_vAppno : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
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
		bus.subscribe("app", "OpenWindow", this.SmartSizing,
				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
				this);
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		var vZappStatAl = "";
		var oDetailTitle = "" ;
		oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var oDetailTableDatas = {Data : []};
		var oDetailData = {Data : {}};
		
		
		if(oController._vAppno != ""){  // 수정 및 조회
			oController.BusyDialog.open();
			var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
			var vErrorMessage = "", vError = "";
			
			var oPath = "/MedicalExpenseApplSet/?$filter=Appno eq '" +  oController._vAppno + "'"; // and Famgb eq '" + vFamgb + "'";	
			oModel.read(oPath, 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							var OneData = data.results[0];
							OneData.Payym = OneData.Payym == "000000" ? "" :  OneData.Payym.substring(0,4) + "." + OneData.Payym.substring(4,6) ; 
							oController._vAppno = OneData.Appno;
							OneData.PoamtT = common.Common.numberWithCommas(OneData.Poamt) + " ( " + common.Common.numberWithCommas(OneData.Inamt) + " / "  + common.Common.numberWithCommas(OneData.Blamt) + " / " +  common.Common.numberWithCommas(OneData.Ltamt) +" )" ;
							OneData.Poamt1T = common.Common.numberWithCommas( OneData.Poamt1) + " ( " + common.Common.numberWithCommas( OneData.Inamt1) + " / "  + common.Common.numberWithCommas( OneData.Blamt1) + " / " +  common.Common.numberWithCommas( OneData.Ltamt1) +" )" ;
							OneData.Poamt2T = common.Common.numberWithCommas( OneData.Poamt2) + " ( " + common.Common.numberWithCommas( OneData.Inamt2) + " / "  + common.Common.numberWithCommas( OneData.Blamt2) + " / " +  common.Common.numberWithCommas( OneData.Ltamt2) +" )" ;
							OneData.Poamt3T = common.Common.numberWithCommas( OneData.Poamt3) + " ( " + common.Common.numberWithCommas( OneData.Inamt3) + " / "  + common.Common.numberWithCommas( OneData.Blamt3) + " / " +  common.Common.numberWithCommas( OneData.Ltamt3) +" )" ;
							vZappStatAl = OneData.ZappStatAl ;
							oDetailData.Data = OneData;
						}
					},
					function(Res){
						vError = "E";
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
					}
				);
			
			if(vError == "E"){
				sap.m.MessageBox.alert(oController.ErrorMessage,{
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});

				return ;
			}else{
				var vPyamtT = 0; //지원금액 총액
				var vApamtT = 0; //신청금액 총액
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				
				oModel.read("/MedicalExpenseApplDetailSet/?$filter=Appno eq '" + oController._vAppno + "'",	
					    null, null, false, 
						function(data,res){
							if(data && data.results.length){
								for(var i = 0 ; i < data.results.length; i++){
									var OneData = data.results[i];
									OneData.Idx = i + 1;
									OneData.Begda = dateFormat.format(new Date(common.Common.setTime(OneData.Begda))); 
									OneData.Endda = dateFormat.format(new Date(common.Common.setTime(OneData.Endda))); 
									vApamtT += parseInt(OneData.Total) ;
									vPyamtT += parseInt(OneData.Pyamt) ;
									OneData.Apamt = common.Common.numberWithCommas(OneData.Apamt); // 신청 금액 
									OneData.ZappStatAl = vZappStatAl ;
									oDetailTableDatas.Data.push(OneData);
								}
								oDetailData.Data.Apamt = vApamtT;
								oDetailData.Data.Pyamt = vPyamtT;
							}
						},
						function(Res){
							vError = "E"
							if(Res.response.body){
								oController.ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}
							}
						}
					);
					
					oController.BusyDialog.close();
					
					if(vError == "E"){
						sap.m.MessageBox.alert(oController.ErrorMessage,{
							onClose : function() {
								oController.onBack();
							}
						});
						return ;
					}
					
					// 신청내역의 진료건수 / 납부금합계
					if(oDetailTableDatas.Data.length > 0){
						oDetailData.Data.ApamtT =  oDetailTableDatas.Data.length  + " 건"; 
					}else{
						oDetailData.Data.ApamtT = "";
					}
			}
		}
		
		
		// 공통적용사항 Start
		// 상세화면 Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = vZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		oController._DetailTableJSonModel.setData(oDetailTableDatas);
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
		// 공통적용사항 End
		
		// 신청 대상 List 조회 및 binding
		oController.onSetFamgb(oController, oController._DetailJSonModel.getProperty("/Data/Regno"));
		// 대상자 나이 조회
		oController.onSearchAge(oController)
		 
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		
		// 결재 상태값에 따라 Control Property 설정
		if( vZappStatAl == "" || vZappStatAl == "10"){
			oController._DetailJSonModel.setProperty("/Data/EnableYn", true); 
			oController._DetailJSonModel.setProperty("/Data/DisplayYn", false); 
			oDetailTable.setMode("MultiSelect");

		}else{
			oController._DetailJSonModel.setProperty("/Data/EnableYn", false);
			oController._DetailJSonModel.setProperty("/Data/DisplayYn", true);
			oController._DetailJSonModel.setProperty("/Data/WedynV", false); 
			oController._DetailJSonModel.setProperty("/Data/DepynV", false);
			oDetailTable.setMode("None");
		}
		
		// 진료기간 설정
		oController.onSetMdprd(oController);
		
		// 결재 상태에 따라 Page Header Text 수정
		if( vZappStatAl == "" ){
			oDetailTitle.setText(oBundleText.getText("LABEL_1098") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1098:의료비 신청
		}else if(vZappStatAl == "10"){
			oDetailTitle.setText(oBundleText.getText("LABEL_1098") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1098:의료비 신청
		}else{
			oDetailTitle.setText(oBundleText.getText("LABEL_1098") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1098:의료비 신청
		}

	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		var oDetailTable = sap.ui.getCore().byId(this.PAGEID + "_DetailTable");
		oDetailTable.removeSelections(true);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_Medical.ZUI5_HR_MedicalList",
			      data : { }
				}
			);	
		}
	},

	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix");
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1084")}).addStyleClass("FontFamilyBold")	// 1084:결혼일자
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({text : "{Famdt}"}).addStyleClass("FontFamily")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0379")}).addStyleClass("FontFamilyBold")	// 379:입사일자
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({text : "{Entda}"}).addStyleClass("FontFamily")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"),{	// 55:유효하지 않은 날짜형식입니다.
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	onAfterSelectPernr : function(oController){
		// 신청대상 Data 초기화
		oController._DetailJSonModel.setProperty("/Data/Regno","");
		// 신청내역 Clear
		oController.onResetDetail(oController);
		// 신청대상 List 조회
		oController.onSetFamgb(oController);
		// 상세내역 Clear
		oController._DetailTableJSonModel.setData({ Data : []});
	},

	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
	},
	
	convertDate : function(vStartDate){
		if(vStartDate == undefined || vStartDate == "") return 0;
		else if(vStartDate) {
	        var arrDate1 = vStartDate.split("-");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Mdprd;
		delete detailData.ApamtT;
		delete detailData.Payym;
		delete detailData.Apamt;
		delete detailData.Pyamt;
		delete detailData.Poamt1T;
		delete detailData.Wedyn;
		delete detailData.WedynV;
		delete detailData.Poamt2T;
		delete detailData.Depyn;
		delete detailData.DepynV;
		delete detailData.AgeC;
		delete detailData.Endyears;
		delete detailData.Poamt3T;
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	// 가족 구분 조회 및 binding
	onSetFamgb : function(oController, vRegno){
		var DetailData = oController._DetailJSonModel.getProperty("/Data");
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb");
		oFamgb.destroyItems();
	
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		
		var vMedicalFamilyList = { Data : []} ;
		
		if(DetailData && DetailData.Encid != undefined && DetailData.Encid != ""){
			var oPath = "/MedicalFamilyListSet?$filter=Encid eq '"+ encodeURIComponent(DetailData.Encid)   + "'";
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){
								oFamgb.addItem(new sap.ui.core.Item({key: data.results[i].Regno, text: data.results[i].Famtx}));
								vMedicalFamilyList.Data.push(data.results[i]);
							}
						}
					},
					function(res){console.log(res);}
			);	
		}
		
		var vFamgbT = "";
		
		if(oFamgb.getSelectedItem()){
			vFamgbT = oFamgb.getSelectedItem().getText();
		}
		oController._DetailJSonModel.setProperty("/Data/FamgbT",vFamgbT);
		
		oController._MedicalFamilyList.setData(vMedicalFamilyList);
		
		// 신청대상 변경 Event
		oController.onChangeFamgb();
	},
	
	// 신청대상 변경 Event
	onChangeFamgb : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		// 부모 건강보험 피부양자 여부 , 자녀 미혼여부 활성화 설정
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb");
		var vData = oController._MedicalFamilyList.getProperty("/Data"); 
		var vZappStatAl =  oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		// 질병유형 리스트를 새롭게 조회하기 때문에 기존 질병유형 값을 삭제.
		if(oEvent){
			// 신청가능액 조회
			oController.onGetMedicalLimit(oController);
			// 신청내역 Clear
			oController.onResetDetail(oController);
			// 상세내역 Clear
			oController._DetailTableJSonModel.setData({ Data : []});
		}
		
		for(var i = 0; i < vData.length ; i ++){
			if(oFamgb.getSelectedKey() == vData[i].Regno ){
				if(vData[i].Famgb == "7"){ // 본인
					oController._DetailJSonModel.setProperty("/Data/Depyn", false);
					oController._DetailJSonModel.setProperty("/Data/DepynV", false);
					oController._DetailJSonModel.setProperty("/Data/Wedyn", false);
					oController._DetailJSonModel.setProperty("/Data/WedynV", false);
					oController._DetailJSonModel.setProperty("/Data/AgeC","");
					oController._DetailJSonModel.setProperty("/Data/Endyears","");
				}else{
					if(vZappStatAl == "" || vZappStatAl =="10"){
						// 건강보험 피부양자 여부 Editable 
						oController._DetailJSonModel.setProperty("/Data/DepynV", true);
					}else{
						// 건강보험 피부양자 여부 Editable 
						oController._DetailJSonModel.setProperty("/Data/DepynV", false);
					}
					if(vData[i].Famgb == "9" ){ // 자녀
						if(vZappStatAl == "" || vZappStatAl =="10"){
							// 자녀 미혼 여부 Editable 
							oController._DetailJSonModel.setProperty("/Data/WedynV", true);
						}else{
							// 자녀 미혼 여부 Editable 
							oController._DetailJSonModel.setProperty("/Data/WedynV", false);
						}
						oController.onSearchAge(oController);
					}else{
						oController._DetailJSonModel.setProperty("/Data/AgeC","");
						oController._DetailJSonModel.setProperty("/Data/Endyears","");
					}
				}
				// 질병유형 리스트를 직접 변경했을 시 및 Default 결혼여부, 피부양자 여부 선택
				if(oEvent){
					if(vData[i].WedynChk == "X") oController._DetailJSonModel.setProperty("/Data/Wedyn", true);
					else oController._DetailJSonModel.setProperty("/Data/Wedyn", false);
					if(vData[i].DepynChk == "X") oController._DetailJSonModel.setProperty("/Data/Depyn", true);
					else oController._DetailJSonModel.setProperty("/Data/Depyn", false);
					oController._DetailJSonModel.setProperty("/Data/Famgb", vData[i].Famgb);
					oController._DetailJSonModel.setProperty("/Data/Regno", vData[i].Regno);
				}
				
//				 상세 내역 Table Rebuild (Rebulid로 질병유형리스트를 다시 조회 한다 )
				var oDetailPanel = sap.ui.getCore().byId(oController.PAGEID + "_DetailPanel");
				oDetailPanel.destroyContent();
				var oDetailTable = sap.ui.jsfragment("ZUI5_HR_Medical.fragment.DetailTable",oController) ;
				oDetailPanel.addContent(oDetailTable);
				break;
			}
		}
	},
	
	onSearchAge : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		function Search() {
			var vRegno = oController._DetailJSonModel.getProperty("/Data/Regno"),
			    vBegda = oController._DetailJSonModel.getProperty("/Data/Begda"),
			    vEndda = oController._DetailJSonModel.getProperty("/Data/Endda");
			var errData = {};
			var vAgeC = "";
			var vEndyears = "";
			if(vRegno && vRegno != "" && 
					vBegda && vBegda != "" && common.Common.isValidDate(vBegda) && 
					vEndda && vEndda != "" && common.Common.isValidDate(vEndda)){
				oModel.read("/MedicalFamilyAgeSet", {
					async : false,
					filters :[ new sap.ui.model.Filter('Regno', sap.ui.model.FilterOperator.EQ, vRegno.replace("-","")),
							   new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, vBegda),
							   new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, vEndda)],
					success : function(data,res){
						if(data && data.results.length){
							vAgeC = data.results[0].AgeC;
							vEndyears = data.results[0].Endyears;
						}
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				oController.BusyDialog.close();		
				if(errData.Error && errData.Error == "E"){
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}else{
				oController.BusyDialog.close();	
			}
			oController._DetailJSonModel.setProperty("/Data/AgeC",vAgeC);
			oController._DetailJSonModel.setProperty("/Data/Endyears",vEndyears);
		}
		oController.BusyDialog.open();
		setTimeout(Search, 100);	
	},
	
	// 신청가능 액 조회
	onGetMedicalLimit : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		var DetailData = {};
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb");
		
		DetailData.Poamt1T = "";   //신청가능액
		DetailData.Poamt2T = "";   //신청가능액
		DetailData.Poamt3T = "";   //신청가능액
		DetailData.Pyamtc1 = "";  // 지원금 누계
		DetailData.Pyamtc2 = "";  // 지원금 누계
		DetailData.Pyamtc3 = "";  // 지원금 누계
		var oEndda = oController.onCalEndda();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var vEndda = dateFormat.format(new Date(oEndda));
		if(oFamgb.getSelectedKey() == "" || oFamgb.getSelectedKey().Regno ==  ""){
			return ;
		}else if( oEndda == "" || vEndda == ""){
			
		}else{
			var vRegno = oFamgb.getSelectedKey().replace("-", "");
			// Prcty : 상세화면
			var oPath = "/MedicalLimitSet?$filter=Prcty eq 'D' and Encid eq '" + oController._DetailJSonModel.getProperty("/Data/Encid") + "' and Regno eq '" + vRegno + "'";
			// 대상자 변경 시 신청 상세내역이 있는 경우 진료종료일 계산해서 필터에 종료일 추가
			oPath += " and Endda eq datetime'" + vEndda + "T00:00:00'";
			
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							DetailData.Poamt1T = common.Common.numberWithCommas( data.results[0].Poamt1) + " ( " + common.Common.numberWithCommas( data.results[0].Inamt1) + " / "  + common.Common.numberWithCommas( data.results[0].Blamt1) + " / " +  common.Common.numberWithCommas( data.results[0].Ltamt1) +" )" ;
							DetailData.Poamt2T = common.Common.numberWithCommas( data.results[0].Poamt2) + " ( " + common.Common.numberWithCommas( data.results[0].Inamt2) + " / "  + common.Common.numberWithCommas( data.results[0].Blamt2) + " / " +  common.Common.numberWithCommas( data.results[0].Ltamt2) +" )" ;
							DetailData.Poamt3T = common.Common.numberWithCommas( data.results[0].Poamt3) + " ( " + common.Common.numberWithCommas( data.results[0].Inamt3) + " / "  + common.Common.numberWithCommas( data.results[0].Blamt3) + " / " +  common.Common.numberWithCommas( data.results[0].Ltamt3) +" )" ;
							DetailData.Pyamtc1 = data.results[0].Pyamtc1 ;
							DetailData.Pyamtc2 = data.results[0].Pyamtc2 ;
							DetailData.Pyamtc3 = data.results[0].Pyamtc3 ;
						}
					},
					function(Res) {
						var errData = common.Common.parseError(Res);
						
						if(errData.Error && errData.Error == 'E') {
							sap.m.MessageBox.alert(errData.ErrorMessage);
							return ;
						}
					}
			);	
		}

		oController._DetailJSonModel.setProperty("/Data/Poamt1T", DetailData.Poamt1T); 
		oController._DetailJSonModel.setProperty("/Data/Poamt2T", DetailData.Poamt2T); 
		oController._DetailJSonModel.setProperty("/Data/Poamt3T", DetailData.Poamt3T); 
		oController._DetailJSonModel.setProperty("/Data/Pyamtc1", DetailData.Pyamtc1);
		oController._DetailJSonModel.setProperty("/Data/Pyamtc2", DetailData.Pyamtc2);
		oController._DetailJSonModel.setProperty("/Data/Pyamtc3", DetailData.Pyamtc3);
	},
	
	onCalEndda : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();	
		
		// 신청내역의 진료시작일 ~ 진료종료일
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		if(!vTableData || vTableData.length == 0) return "";
		
		var vEndda = vTableData[0].Endda ;
		for(var i = 1 ; i < vTableData.length ; i++){
			if(oController.convertDate(vEndda) < oController.convertDate(vTableData[i].Endda)){
				vEndda = vTableData[i].Endda ;
			}
		}
		return vEndda; 
	},
	
	// 상세 내역 Dialog
	_DetailInfoDialog : null,
	onChangeTableDate : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();	
		
		
		// 신청가능액 조회
		oController.onGetMedicalLimit(oController);
		// 진료시작 일자 Setting
		oController.onSetMdprd(oController);
		// 나이 조회
		oController.onSearchAge(oController);
		// 최종금액 과 신청금합계 계산
		oController.onChangeApamt();
	},
	
	onSetMdprd : function(oController){
		// 신청내역의 진료시작일 ~ 진료종료일
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		if(vTableData && vTableData.length > 0){
			var vBegda = vTableData[0].Begda ;
			var vEndda = vTableData[0].Endda ;
			for(var i = 1 ; i < vTableData.length ; i++){
				if(oController.convertDate(vTableData[i].Begda) != 0){
					if(oController.convertDate(vBegda) > oController.convertDate(vTableData[i].Begda)){
						vBegda = vTableData[i].Begda ;
					}
				}
				if(oController.convertDate(vEndda) < oController.convertDate(vTableData[i].Endda)){
					vEndda = vTableData[i].Endda ;
				}
			}
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
			
			if(vBegda != "") dateFormat.format(new Date(vBegda));
			if(vEndda != "") dateFormat.format(new Date(vEndda));
			oController._DetailJSonModel.setProperty("/Data/Mdprd", vBegda + " ~ " + vEndda); 	
			oController._DetailJSonModel.setProperty("/Data/Begda", vBegda);
			oController._DetailJSonModel.setProperty("/Data/Endda", vEndda);
		}else{
			oController._DetailJSonModel.setProperty("/Data/Mdprd", ""); 	
			oController._DetailJSonModel.setProperty("/Data/Begda", "");
			oController._DetailJSonModel.setProperty("/Data/Endda", "");
		}

	},
	
	onSearchMedicalFamilyInfo : function(oController){
		var vRegno = oController._DetailJSonModel.getProperty("/Data/Regno");
		var vFamilyInfo = {};
		if(!vRegno || vRegno == "") return vFamilyInfo ;
		
		var vData = oController._MedicalFamilyList.getProperty("/Data");
		if(vData && vData.length > 0){
			for(var i = 0; i < vData.length ; i++){
				if(vRegno == vData[i].Regno){
					vFamilyInfo = vData[i];
					break;
				}
			}
		}
		return vFamilyInfo ;
	},
	
	
	onPressNewRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		
		var vFamilyInfo = oController.onSearchMedicalFamilyInfo(oController);
		var indx = 0 ;
		if(oController._DetailTableJSonModel.getProperty("/Data")){
			idx = oController._DetailTableJSonModel.getProperty("/Data").length ;
		}
		var vData =  { Begda : "" , Endda : "" , Medty : "1" , Medtytx : oBundleText.getText("LABEL_1100") , 
					   Samyn : false , Foryn : "02", Foryntx : oBundleText.getText("LABEL_1097") , Recpgb : "01" , Recpgbtx : oBundleText.getText("LABEL_1094") ,	// 1094:병원, 1097:외래, 1100:일반 
				       Idx : idx+ 1 , ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl"), 
				       Apamt : "" , 
				       Deamt : vFamilyInfo.Deamt, Pyamt : "" };		
		oController._DetailTableJSonModel.setProperty("/Data/"+idx +"/", vData); 
		
		// 신청내역의 진료건수
		oController._DetailJSonModel.setProperty("/Data/ApamtT", idx+ 1 + " 건"); 
		
		// 최종금액 과 신청금합계 계산
		oController.onChangeApamt();
	},	
	
	// 신청 금액 변경 시 신청금 합계 및 최종액 계산
	onChangeApamt : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var vApamt = 0;
		if(oEvent){
			var vSeqno = oEvent.getSource().getCustomData()[0].getValue();
			if(vSeqno){
				var vIdx = vSeqno * 1 - 1 ;
				oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Apamt", 
						common.Common.numberWithCommas(oEvent.getParameters().value));
			}
		}
		
		var vData = oController._DetailTableJSonModel.getProperty("/Data");
		var vHeaderData = oController._DetailJSonModel.getProperty("/Data");
		var oneData = {};
		// 신청합계 계산
		for(var i =0 ; i < vData.length ; i++){
			oneData = {};
			Object.assign(oneData, vData[i]);
			oneData.Apamt = common.Common.removeComma(oneData.Apamt) * 1 > 0 ? common.Common.removeComma(oneData.Apamt) : 0 ;
			var vTotal = common.Common.removeComma(oneData.Apamt) * 1  - oneData.Deamt * 1 ;
			// 자녀일 경우 2017.02.13일 이하 일자는 50%만 지원
			if(vHeaderData.Famgb == "9"){ 
				if(common.Common.checkDate("2017-02-14",oneData.Begda) == false){
					vTotal = Number((vTotal / 2).toFixed(0)); 
				}
			}
			vApamt += vTotal ;
			oController._DetailTableJSonModel.setProperty("/Data/" + i + "/Total", vTotal);
		}
		oController._DetailJSonModel.setProperty("/Data/Apamt", vApamt);
	},
	
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vIDXs = oDetailTable.getSelectedContexts(true);
		var vTotal = 0;
		if(vIDXs.length < 1){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1115"));	// 1115:삭제할 데이터를 선택하여 주십시오.
			return;
		}
		
		var deleteRecord = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
				var vTData = { Data : []};
				var vCheck = "", vIdx = 1;
	            for(var i = 0 ; i < vTableData.length ; i ++){
	            	vCheck = "";
	            	for(var j = 0; j < vIDXs.length ; j++ ){
	            		if( i == vIDXs[j].sPath.split("/")[2]){
	            			vCheck = "X";
	            			break;
	            		}
	            	}
	            	if(vCheck == ""){
	            		vTableData[i].Idx = vIdx ;
	            		vTData.Data.push(vTableData[i]);
	            		vIdx++;
	            		vTotal += (common.Common.removeComma(vTableData[i].Total) * 1);
	            	}	
	            }
	            oController._DetailTableJSonModel.setData(vTData);
	            // 신청금액 합계
	    		oController._DetailJSonModel.setProperty("/Data/Apamt", common.Common.numberWithCommas(vTotal)); 
	    		// 신청내역의 진료건수 
	    		oController._DetailJSonModel.setProperty("/Data/ApamtT", vTData.Data.length + oBundleText.getText("LABEL_0001")); 	// 건
	    		
	    		oController.onSetMdprd(oController);
	    		oDetailTable.removeSelections(true);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : deleteRecord
		});
		
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		vOData.Prcty = vPrcty ; 
		
		var vDetailDatas = [];
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		for(var i=0; i< vTableData.length; i++) {
			OneData = {};
			OneData.Appno = vOData.Appno ;
			OneData.Begda = "\/Date("+ common.Common.getTime(vTableData[i].Begda)+")\/"; // 진료시작일자
			OneData.Endda = "\/Date("+ common.Common.getTime(vTableData[i].Endda)+")\/"; // 진료종료일자	
			OneData.Medty  = vTableData[i].Medty; //질병유형
			OneData.Samyn  = vTableData[i].Samyn; //동일병명
			OneData.Notes  = vTableData[i].Notes; //비고
			OneData.Disenm = vTableData[i].Disenm; //병명
			OneData.Medorg = vTableData[i].Medorg; //의료기관
			OneData.Foryn = vTableData[i].Foryn; // 입원/외래
			OneData.Recpgb = vTableData[i].Recpgb; // 영수증 구분
			OneData.Apamt = common.Common.removeComma(vTableData[i].Apamt); // 신청 금액 
			OneData.Deamt = OneData.Deamt == undefined ? 0 : OneData.Deamt;
			OneData.Deamt = "" + vTableData[i].Deamt; // 공제 금액
			OneData.Pyamt = OneData.Pyamt == undefined ? 0 : OneData.Pyamt;
			OneData.Pyamt = "" + vTableData[i].Pyamt; // 지원 금액
			OneData.Total = "" + vTableData[i].Total; // 최종 금액
			OneData.Disecd = vTableData[i].Disecd; // 병명코드
			
			if(OneData.Deamt == "") delete(OneData.Deamt);
			
			delete(OneData.Pyamt);
			
			OneData.Waers = "KRW";
			OneData.Seqnr =  (i + 1).toString();
			vDetailDatas.push(OneData);
		}
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
				vOData.MedicalDetailNav = vDetailDatas;
				var oPath = "/MedicalExpenseApplSet";
				oModel.create(
						oPath,
						vOData,
						null,
						function(data,res){
							if(data) {
								oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
								oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
								vZappStatAl = data.ZappStatAl;
								oController._vAppno = data.Appno;
							} 
						},
						function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
								else vErrorMessage = Err.error.message.value;
							} else {
								vErrorMessage = oError.toString();
							}
					}
				);				
				
				if(vErrorMessage != ""){
					oController.BusyDialog.close();
					new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
					return ;
				}
				
				// 첨부파일 업로드
				common.AttachFileAction.uploadFile(oController);
				oController.BusyDialog.close();

				if(vErrorMessage != ""){
					sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					return;
				}
				
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
		}else{
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
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb"); 
		var oDisenm = sap.ui.getCore().byId(oController.PAGEID + "_Disenm"); 
		
		if(!vData.Pernr || vData.Pernr == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Regno || vData.Regno == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1116"));	// 1116:신청 대상이 선택되지 않았습니다.
			return "";
		}
		if(vData.Apamt * 1 == 0){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1126"));	// 1126:신청합계 금액이 0을 초과하여야 합니다.
			return "";
		}
		if(!vTableData || vTableData.length < 1){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1117"));	// 1117:상세내역을 입력하시기 바랍니다.
			return "";
		}
		
		if( vPrcty == "R" && ( !vData.ZappResn || vData.ZappResn == "")){ // 반려일 경우 반려사유 필수
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1118"));	// 1118:반려시 반려사유는 필수 입니다.
			return "";
		}
		if(vData.DepynV == true){
			if(vData.Famgb != "8"){ // 배우자는 피부양자 선택 체크 제외
				if(!vData.Depyn || vData.Depyn == false){
					var vAgeC =  vData.AgeC.replace(/[^0-9]/g, ''); 
					if(!common.Common.checkNull(vAgeC)){
						var vEndyears = vData.Endyears;
						// 만 24세 이상의 경우, 반드시 체크해야 신청 가능
						if(vEndyears && Number(vEndyears) * 1 >= 24 ){
							new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1119"));	// 1119:만 24세 이상은 건강보험 피부양자 여부를 선택해야 합니다.
							return "";
						}
					}
				}
			}
		}
		if(vPrcty == "C"){
			var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			var vFileData = oAttachFileList.getModel().getProperty("/Data");
			if(!vFileData || vFileData.length < 1){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
				return false;
			}
		}
		
		// 진료 최초 시작일 , 최후 종료일 조회
		var vBegda = vTableData[0].Begda ;
		var vEndda = vTableData[0].Endda ;
		var vBegYear = "", vEndYear = "", vBegYear1 = "", vEndYear2 = "";
		for(var i = 0 ; i < vTableData.length ; i++){
			if(i == 0){
				vBegda = vTableData[0].Begda ;
				vEndda = vTableData[0].Endda ;
				vBegYear = vTableData[0].Begda.substring(0,4) ;
				vEndYear = vTableData[0].Endda.substring(0,4) ;
				
				if(vBegYear != vEndYear){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1134"));	// 1134:진료기간의 시작년도와 종료년도는 동일해야 합니다. [한도액 기준 : 매년 1/1~12/31]
					return ""; 
				}
			}else{
				vBegYear1 = vTableData[i].Begda.substring(0,4) ;
				vEndYear2 = vTableData[i].Endda.substring(0,4) ;
				
				if(vBegYear != vBegYear1 || vBegYear != vEndYear2){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1134"));	// 1134:진료기간의 시작년도와 종료년도는 동일해야 합니다. [한도액 기준 : 매년 1/1~12/31]
					return ""; 
				}
				
				if(oController.convertDate(vBegda) > oController.convertDate(vTableData[i].Begda)){
					vBegda = vTableData[i].Begda ;
				}
				if(oController.convertDate(vEndda) < oController.convertDate(vTableData[i].Endda)){
					vEndda = vTableData[i].Endda ;
				}	
			}
			
			if(vTableData[i].Begda == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1120"));	// 1120:진료시작일자를 입력바랍니다.
				return ""; 
			}
			if(vTableData[i].Endda == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1121"));	// 1121:진료종료일자를 입력바랍니다.
				return "";
			}
			if(vTableData[i].Disenm == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1122"));	// 1122:병명을 입력바랍니다.
				return "";
			}
			if(vTableData[i].Medorg == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1123"));	// 1123:의료기관을 입력바랍니다.
				return "";
			}
			if(vTableData[i].Foryn == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1124"));	// 1124:의료/외래를 선택하여 주십시오.
				return "";
			}
			if(vTableData[i].Recpgb == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1125"));	// 1125:영수증 구분을 선택하여 주십시오.
				return "";
			}
			if(vTableData[i].Total * 1 <= 0){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1127"));	// 1127:상세항목별 신청합계가 0 원 미만은 신청할 수 없습니다.
				return "";
			}
			
			if(common.Common.checkDate(vTableData[i].Begda, vTableData[i].Endda) == false){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1128")); 	// 1128:시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요.
				return "";
			}
			// "자녀의 시작일 20170213 이하 & 종료일 20170214 이상이면 오류메세지
			if(vData.Famgb == "9"){
				if(common.Common.checkDate(vTableData[i].Begda, "2017-02-13") == true &&
				   common.Common.checkDate(vTableData[i].Endda, "2017-02-14") == false ){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2906")); 	//2906: 자녀의 2017-02-13 이전 신청건은 50% 지급이므로 분리하여 입력해 주세요. 
					return ""
				}
				
			}
			
		}
		
		rData.Begda =   "\/Date("+ common.Common.getTime(vBegda)+")\/"; // 진료시작일자
		rData.Endda =	"\/Date("+ common.Common.getTime(vEndda)+")\/"; // 진료 종료일자
		rData.Ename =  vData.Ename; // 대상자 성명
		rData.Pernr =  vData.Pernr; // 대상자
		rData.Regno =  vData.Regno; // 신청대상
		rData.Appno =  vData.Appno; // 신청번호
		rData.Famgb =  vData.Famgb ; // 가족구분
		rData.Payym =  typeof(vData.Payym) == "undefined" ? "" : vData.Payym.replace(".", ""); // 지급년월
		rData.Apamt =  "" + common.Common.removeComma(vData.Apamt);// 신청금 합계
		rData.Pyamt = rData.Pyamt == undefined ? 0 : rData.Pyamt;
		rData.Pyamt =  "" + common.Common.removeComma(rData.Pyamt);// 지원금액
		rData.Depyn =  vData.Depyn ; // 부모 건강보험 피부양자 여부
		rData.Wedyn =  vData.Wedyn ; // 자녀 미혼여부 
		rData.Waers = "KRW";
		rData.Actty = _gAuth;
		
		rData.Appernr = vData.Appernr;
		
		// 대상자와의 관계
		var vMedicalFamilyList = oController._MedicalFamilyList.getProperty("/Data");
		for(var i = 0 ; i < vMedicalFamilyList.length ; i ++){
			if(vData.Regno == vMedicalFamilyList[i].Regno){
				rData.Famgb = vMedicalFamilyList[i].Famgb ;
				break;
			}	
		}
		return rData;
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
				var oPath = "/MedicalExpenseApplSet(Appno='" + vDetailData.Appno + "')";
				oModel.remove(
						oPath,
						null,
						function(data,res){
						},
						function(Res){
							if(Res.response.body){
								var ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								oController.Error = "E"; 
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}else{
									oController.ErrorMessage =ErrorMessage ;
								}
							}
							
						}
				);
				oController.BusyDialog.close();
				
				if(oController.Error =="E"){
					sap.m.MessageBox.show(oController.ErrorMessage,{
					});
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
	
	onSelectSamyn : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var vSeqno = oEvent.getSource().getCustomData()[0].getValue();
		var vIdx = vSeqno * 1 - 1 ;	
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");	
		var oTableData = oTable.getModel().getProperty("/Data/"+vIdx);
		var vSelected = oEvent.getSource().getSelected();
		var vDeamt = "" ; 
		// 신청 History Dialog Index 초기화
		oController._DialogActionIndex = "";
		if(vSelected == false){
			var vMedicalFamilyInfo = oController.onSearchMedicalFamilyInfo(oController);
			if(vMedicalFamilyInfo && vMedicalFamilyInfo.Deamt) vDeamt = vMedicalFamilyInfo.Deamt;
			oTable.getModel().setProperty("/Data/"+ vIdx + "/Deamt", vDeamt);
		}else{
			oTable.getModel().setProperty("/Data/"+ vIdx + "/Deamt", vDeamt);
			if(!oController._HistoryDialog) {
				oController._HistoryDialog = sap.ui.jsfragment("ZUI5_HR_Medical.fragment.HistoryDialog", oController);
				oView.addDependent(oController._HistoryDialog);
			}
			oController._HistoryDialog.open();
			// 신청 History Dialog Index 초기화
			oController._DialogActionIndex = vIdx;
		}
		
		// 최종금액 과 신청금합계 계산
		oController.onChangeApamt();
	},
	
	afterOpenHistoryDial : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		oHistoryTable.removeSelections(true);
		var oJSonModel = oHistoryTable.getModel();
		var vData = {Data : []};
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vRegno = oController._DetailJSonModel.getProperty("/Data/Regno").replace("-", "");
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		var vErrorMessage = "", vError = "";
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vDetailData = oDetailTable.getModel().getProperty("/Data");
		var vLength = 0 ; 
		for(var i = 0 ; i < vDetailData.length; i++){
			if(i != oController._DialogActionIndex && vDetailData[i].Samyn != true && 
			           common.Common.checkNull(vDetailData[i].Disecd) == false && common.Common.checkNull(vDetailData[i].Disenm) == false ){
				var oneData = {};
				Object.assign(oneData,vDetailData[i]);
				oneData.Idx = vLength + 1;
				oneData.Begda = dateFormat.format(new Date(oneData.Begda)); 
				oneData.Endda = dateFormat.format(new Date(oneData.Endda)); 
				vData.Data.push(oneData);
				vLength += 1; 
			}
		}
		
		var oPath = "/MedicalHistoryListSet/?$filter=Encid eq '" + encodeURIComponent(vEncid)  + "' and Regno eq '" + vRegno + "'";	
		oModel.read(oPath, 
		    null, null, false, 
			function(data,res){
				if(data && data.results.length){
					for(var i = 0; i < data.results.length ; i++ ){
						var OneData = data.results[i];
						OneData.Idx = i + 1 + vLength;
						OneData.Begda = dateFormat.format(new Date(OneData.Begda)); 
						OneData.Endda = dateFormat.format(new Date(OneData.Endda));
						OneData.Apamt = common.Common.numberWithCommas(OneData.Apamt);					
						vData.Data.push(OneData);					
					}
				}
			},
			function(Res){
				vError = "E";
				if(Res.response.body){
					vErrorMessage = Res.response.body;
					var ErrorJSON = JSON.parse(vErrorMessage);
					if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
						vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
					}
				}
			}
		);
		
		oJSonModel.setData(vData);
		
		if(vError == "E"){
			sap.m.MessageBox.error(vErrorMessage);
			oController._HistoryDialog.close();
			return ;
		}
	},
	
	// 질병 유형을 변경 시 처리 Event
	onChangeMdedty : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var vSeqno = oEvent.getSource().getCustomData()[0].getValue();
		var vIdx = vSeqno * 1 - 1 ;	
		oController._DetailTableJSonModel.setProperty("/Data/" + vIdx+ "/Medtytx", oEvent.getSource().getValue());
	},
	
	onChangeForyn : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var vSeqno = oEvent.getSource().getCustomData()[0].getValue();
		var vIdx = vSeqno * 1 - 1 ;	
		oController._DetailTableJSonModel.setProperty("/Data/" + vIdx+ "/Foryntx", oEvent.getParameters().selectedItem.getText());
	},
	
	onChangeRecpgb : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var vSeqno = oEvent.getSource().getCustomData()[0].getValue();
		var vIdx = vSeqno * 1 - 1 ;	
		oController._DetailTableJSonModel.setProperty("/Data/" + vIdx+ "/Recpgbtx", oEvent.getParameters().selectedItem.getText());
	},
	
	onSelectHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var vContexts = oHistoryTable.getSelectedContexts(true);
		if(!vContexts || vContexts.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1129"));	// 1129:의료비 신청내역을 선택하여 주세요.
			return;
		}
		var vDisenm = oHistoryTable.getModel().getProperty(vContexts[0].sPath +"/Disenm");
		var vDisecd = oHistoryTable.getModel().getProperty(vContexts[0].sPath +"/Disecd");
		
		oController._DetailTableJSonModel.setProperty("/Data/" + oController._DialogActionIndex + "/Disenm", vDisenm);
		oController._DetailTableJSonModel.setProperty("/Data/" + oController._DialogActionIndex + "/Disecd", vDisecd);
		
		oController.onCloseHistory();
	},
	
	onCloseHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vDeamt = 0;
		if(oEvent){
			// 신청 History 를 선택하지 않았으므로 동일병명 Flag 삭제
			oController._DetailTableJSonModel.setProperty("/Data/" + oController._DialogActionIndex + "/Samyn", false);
			// 다시 공제금을 입력 
			var vMedicalFamilyInfo = oController.onSearchMedicalFamilyInfo(oController);
			if(vMedicalFamilyInfo && vMedicalFamilyInfo.Deamt){
				vDeamt = vMedicalFamilyInfo.Deamt;
			}
			oTable.getModel().setProperty("/Data/"+ oController._DialogActionIndex + "/Deamt", vDeamt);
			// 최종금액 과 신청금합계 계산
			oController.onChangeApamt();
		}
		oController._HistoryDialog.close();
	},	
	
	displayDisecdDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var vSeqno = oEvent.getSource().getCustomData()[0].getValue();
		var vIdx = vSeqno * 1 - 1 ;	
		
		oController._DialogActionIndex = vIdx;
		if(!oController._DisecdDialog) {
			oController._DisecdDialog = sap.ui.jsfragment("ZUI5_HR_Medical.fragment.DisecdDialog", oController);
			oView.addDependent(oController._DisecdDialog);
		}
		oController._DisecdDialog.open();
		
		
	},
	
	onSelectDisecd : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var oDisecdTable = sap.ui.getCore().byId(oController.PAGEID + "_DisecdTable");
		var oModel = oDisecdTable.getModel();
		var oDisecdDialog = sap.ui.getCore().byId(oController.PAGEID + "_DisecdDialog");
		var oDisenmInput = sap.ui.getCore().byId(oController.PAGEID + "_DisenmDialog");
		var vContexts = oDisecdTable.getSelectedContexts(true);
		if(!vContexts || vContexts.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1130"));	// 1130:병명을 선택하여 주세요.
			return;
		}
		var vDisenm = oDisecdTable.getModel().getProperty(vContexts[0].sPath +"/Disenm");
		var vDisecd = oDisecdTable.getModel().getProperty(vContexts[0].sPath +"/Disecd");
		
		oController._DetailTableJSonModel.setProperty("/Data/" + oController._DialogActionIndex + "/Disenm", vDisenm);
		oController._DetailTableJSonModel.setProperty("/Data/" + oController._DialogActionIndex + "/Disecd", vDisecd);
		
		var vTableData = { Data : []};
		oModel.setData(vTableData);
		oDisenmInput.setValue(""); 
		
		oDisecdTable.setMode(sap.m.ListMode.None);
		oDisecdTable.setMode(sap.m.ListMode.SingleSelectLeft);
		
		oDisecdDialog.close();
	},
	
	onSearchDisecd : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var oDisecdTable = sap.ui.getCore().byId(oController.PAGEID + "_DisecdTable");
		var oDisecdModel = oDisecdTable.getModel();
		
		function Search() {
			var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
			var oDisecdDialog = sap.ui.getCore().byId(oController.PAGEID + "_DisecdDialog");
			var vDisenm = sap.ui.getCore().byId(oController.PAGEID + "_DisenmDialog").getValue();
			var errData = {};
			var vData = { Data : [] };
			var aFilters = [];
			if(vDisenm && vDisenm != "") aFilters.push(new sap.ui.model.Filter('Disenm', sap.ui.model.FilterOperator.EQ, vDisenm));
			
			oModel.read("/MedicalDisecdListSet", {
				async : false,
				filters : aFilters,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							vData.Data.push(OneData);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oDisecdModel.setData(vData);
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return ;
			}
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);		
	},
	
	onPressHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		
		if(!oController._SearchHistoryDialog) {
			oController._SearchHistoryDialog = sap.ui.jsfragment("ZUI5_HR_Medical.fragment.HistoryPayDialog", oController);
			oView.addDependent(oController._SearchHistoryDialog);
		}
		
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryPayTable");
		var oJSonModel = oHistoryTable.getModel();
		var oDatas = {Data : []};
//		oHistoryTable.setVisibleRowCount(1);
		
		var vError = "" , vErrorMessage = "", vBegda = "";
		// 상세내역에서 진료시작일자
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		if(vTableData && vTableData.length > 0){
			var vBegda = vTableData[0].Begda ;
			for(var i = 1 ; i < vTableData.length ; i++){
				if(oController.convertDate(vTableData[i].Begda) != 0){
					if(oController.convertDate(vBegda) > oController.convertDate(vTableData[i].Begda)){
						vBegda = vTableData[i].Begda ;
					}
				}
			}
		}
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
			
			oModel.read("/MedicalPayHistorySet", {
				async: false,
				filters: [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid"))
				],
				success: function(data,res){
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							oDatas.Data.push(data.results[i]);
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
			oHistoryTable.setVisibleRowCount(oDatas.Data.length);
			oJSonModel.setData(oDatas);
			oController.BusyDialog.close();
			
			if(vErrorMessage != ""){
				new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
				return ;
			}
			
			oController._SearchHistoryDialog.open();
		};
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
});