//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ZNK_ApprovalLine");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail
	 */

	PAGEID : "ZUI5_HR_JoinClubDetail",
	
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_DialogJsonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ZclubData : [],
	
	_vAppno : "",
	
	_vFromPage : "",
	
	_vEnamefg : "",
	
	_Enabled : null,
	
	_Mang : "",		// 총무
	_Chair : "",	// 회장
	_Stf : "",		// 담당자

	_vAppty : "MANAGE",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function() {

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

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
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		
		var vAppno ="" , vZappStatAl = "", vRegno = "";
		oController._vAppno = "";

		oController._Mang = "";
		oController._Chair = "";
		oController._Stf = "";
		
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = vAppno = oEvent.data.Appno;
			
			oController._Mang = oEvent.data.Mang;
			oController._Chair = oEvent.data.Chair;
			oController._Stf = oEvent.data.Stf;
			
			console.log("총무 " + oController._Mang + " / 회장 " + oController._Chair + " / 담당자 " + oController._Stf);
			
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		// 신청안내
//		if(!oController._vInfoImage.getProperty("/Data") || oController._vInfoImage.getProperty("/Data").length < 1){
//			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
//			var Datas = { Data : {}} ;
//			try{
//				var oPath = "/AppNoticeSet?$filter=ZreqForm eq 'HR03'";
//				oModel.read(
//						oPath,
//						null,
//						null,
//						false,
//						function(data,res){
//							if(data && data.results.length){
////								oController._vInfoImage = data.results[0].Image ;
//								Datas.Data.Image = data.results[0].Image ;
//							}
//						},
//						function(res){console.log(res);}
//				);	
//			}catch(Ex){
//				
//			}
//			oController._vInfoImage.setData(Datas);		
//		}		
		
		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		// 초기화
		oController._DetailJSonModel.setData(null);
		
		oController.BusyDialog.open();
		var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");
		var oDetailTableDatas = {Data : []};
		var oDetailData = {Data : {}};
		var vErrorMessage = "", vError = "";
		
		var oSave = sap.ui.getCore().byId(oController.PAGEID + "_SaveP");
			oSave.setEnabled(true);
			oController._Enabled = true;
		var oRej = sap.ui.getCore().byId(oController.PAGEID + "_SaveR");
			oRej.setEnabled(true);
		
		var oPath = "/ClubExpensesApplSet?$filter=Appno eq '" + vAppno + "' and Prcty eq 'D'";
		oModel.read(oPath, null, null, false,
				function(data, res){
					
					// 상태
					vZappStatAl = data.results[0].ZappStatAl;
					
					oDetailData.Data = data.results[0];	
					
					// 사용자 권한이랑 결재상태에 따라 승인버튼 enabled 설정
					// 1. 총무 - 회장결재 안된경우 false
					if(oController._Mang == "X" && data.results[0].Magdt != "" && data.results[0].Chadt == ""){
//						oSave.setEnabled(false);
						oController._Enabled = false;
						oDetailData.Data.Enabled = false;
					}
					// 2. 회장 - 총무결재 안된경우 false
					if(oController._Chair == "X" && data.results[0].Magdt == ""){
//						oSave.setEnabled(false);
						oController._Enabled = false;
						oDetailData.Data.Enabled = false;
					}
					// 3. 담당자 - 총무,회장 결재가 안된경우 false
					if(oController._Stf == "X" && (data.results[0].Chadt == "" || data.results[0].Magdt == "")){
//						oSave.setEnabled(false);
						oController._Enabled = false;
						oDetailData.Data.Enabled = false;
					}
					
					// 4. 총무/회장 - 결재가 완료된 경우 false
					if((oController._Mang == "X" || oController._Chair == "X") && data.results[0].Magdt != "" && data.results[0].Chadt != ""){
//						oSave.setEnabled(false);
						oRej.setEnabled(false);
						oDetailData.Data.Enabled = false;
					}				
					
					// 5. 아무것도아닌사람이면 false
					if(oController._Mang == "" && oController._Chair == "" && oController._Stf == ""){
						oRej.setEnabled(false);
						oDetailData.Data.Enabled = false;
					}
					
				}, function(Res){
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
					
		if(vError == "E"){
			sap.m.MessageBox.alert(vErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}
		
		// 사용자 권한도 추가
		oDetailData.Data.Mang = oController._Mang;
		oDetailData.Data.Chair = oController._Chair;
		oDetailData.Data.Stf = oController._Stf;
		
		oController._DetailJSonModel.setData(oDetailData);
			
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl){
			oPortalTitle.setText("인포멀그룹 가입/탈퇴 신청 결재");	
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText("인포멀그룹 가입/탈퇴 신청 결재");
		} else {
			oPortalTitle.setText("인포멀그룹 가입/탈퇴 신청 조회");
		}		
		
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
//		var oContent = sap.ui.getCore().byId("ZNK_PORTAL" + "_notUnifiedSpllit");
//		oContent.toDetail("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList",
			      data : { }
				}
			);	
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail");
		var oController = oView.getController();
	},
	
	// 인포멀그룹
	setZclub : function(oController, vPernr){
		oController._ZclubData = [];
		
		var oZclub = sap.ui.getCore().byId(oController.PAGEID + "_Zclub");
		if(oZclub.getItems()) oZclub.destroyItems();
		
		var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");
		var oPath = "/ClubExpensesApplSet?$filter=Pernr eq '" + vPernr + "' and Prcty eq 'Z'";
		
		oModel.read(oPath, null, null, false, 
			function(data,res){
				if(data && data.results.length){
					for(var i=0;i<data.results.length;i++){							
						oController._ZclubData.push(data.results[i]);
						oZclub.addItem(new sap.ui.core.Item({key : data.results[i].Zclub, text : data.results[i].Zclubtx}));
					}
				}
			}, function(Res){
				if(Res.response.body){
					var ErrorMessage = Res.response.body;
					var ErrorJSON = JSON.parse(ErrorMessage);
					oController.Error = "E"; 
					if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
						oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
					}else{
						oController.ErrorMessage = ErrorMessage ;
					}
				}
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : "오류"});
					return;
				}
			}
		);
		
	},
	
	onChangeZclub : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail");
		var oController = oView.getController();
		
		var vZclub = oController._DetailJSonModel.getProperty("/Data/Zclub");
		
		for(var i=0; i<oController._ZclubData.length; i++){
			if(oController._ZclubData[i].Zclub == vZclub){
				oController._DetailJSonModel.setProperty("/Data/Member", oController._ZclubData[i].Member);	  // 회원수
				oController._DetailJSonModel.setProperty("/Data/Orgdt", oController._ZclubData[i].Orgdt);	  // 결성일자
				oController._DetailJSonModel.setProperty("/Data/Chairid", oController._ZclubData[i].Chairid); // 회장 사번,성명
				oController._DetailJSonModel.setProperty("/Data/Chairnm", oController._ZclubData[i].Chairnm);
				oController._DetailJSonModel.setProperty("/Data/Mangid", oController._ZclubData[i].Mangid);	  // 총무 사번,성명
				oController._DetailJSonModel.setProperty("/Data/Mangnm", oController._ZclubData[i].Mangnm);
				oController._DetailJSonModel.setProperty("/Data/Joinyn", oController._ZclubData[i].Joinyn);   // 가입현황
				oController._DetailJSonModel.setProperty("/Data/Joinynt", oController._ZclubData[i].Joinynt);
				
				// 가입여부 확인해서 신청종류(1:탈퇴, 2:가입)를 설정한다.
				if(oController._ZclubData[i].Joinyn == "Y") oController._DetailJSonModel.setProperty("/Data/Reqtyp", "2");
				else oController._DetailJSonModel.setProperty("/Data/Reqtyp", "1");
				
			}
		}
		
	},
	
	// 결재대행 눌렀을 때 승인버튼 활성화한다.
	onActck : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail");
		var oController = oView.getController();
		
		var oSave = sap.ui.getCore().byId(oController.PAGEID + "_SaveP");
		
		if(oEvent.getParameters().selected == true){
			if(oSave.getEnabled() == false) oSave.setEnabled(true);
		} else {
			oSave.setEnabled(oController._Enabled);
		}
	},

	// 승인
	onPressSaveP : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "P");
	},
	
	// 반려
	onPressSaveR : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "R");
	},

	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty){
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			if(oController._vAppno) createData.Appno = oController._vAppno;
			createData.Pernr = oneData.Pernr;
			createData.Ename = oneData.Ename;
			createData.Zclub = oneData.Zclub;		// 인포멀그룹
			createData.Member = oneData.Member;		// 회원수
			createData.Orgdt = oneData.Orgdt;		// 결성일자
			createData.Joinyn = oneData.Joinyn;		// 가입현황
			createData.Chairnr = oneData.Chairnr;	// 회장
			createData.Mangnr = oneData.Mangnr;		// 총무	
			createData.Reqtyp = oneData.Reqtyp;		// 신청종류, 신청종류 텍스트
			createData.Reqtypt = oneData.Reqtypt;
			createData.Prcty = vPrcty;
			
			// 결재권한대행
			if(oneData.Actck == true) createData.Actck = "X";
			else createData.Actck = "";
			
			if(vPrcty == "R") createData.ZappResn = oneData.ZappResn;
			
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			createData.Appernr = vEmpLoginInfo[0].Pernr;	// 신청할때 로그인사번 보낸다.	
			
			
			oModel.create("/ClubExpensesApplSet", createData, null,
					function(data,res){
						if(data) {
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
			
			oController.BusyDialog.close();

			if(vErrorMessage != ""){
				sap.m.MessageBox.alert(vErrorMessage, {title : "오류"});
				return;
			}

			sap.m.MessageBox.show(vCompTxt, {
				title : "안내",
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
		
		if(vPrcty == "P"){
			vInfoTxt = "승인하시겠습니까?";
			vCompTxt = "승인이 완료되었습니다." ;
		} else if(vPrcty == "R"){
			vInfoTxt = "반려 하시겠습니까?";
			vCompTxt = "반려가 완료되었습니다.";
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : "안내",
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){		
		var vData = oController._DetailJSonModel.getProperty("/Data");

		var oneData = oController._DetailJSonModel.getProperty("/Data");		

		if(vPrcty == "R" && (!oneData.ZappResn || oneData.ZappResn.trim() == "")){
			sap.m.MessageBox.alert("반려시 반려사유는 필수입니다.", {title : "오류"});
			return false;
		}
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail");
		var oController = oView.getController();
			
		var onProcess = function(){
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");
				var oPath = "/ClubExpensesApplSet(Appno='" + oController._vAppno + "')";
				oModel.remove(oPath, null,
						function(data,res){
						},
						function(Res){
							if(Res.response.body){
								var ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}else{
									vErrorMessage = ErrorMessage ;
								}
							}
						}
				);
				oController.BusyDialog.close();
								
				if(vErrorMessage != ""){
					sap.m.MessageBox.alert(vErrorMessage, {title : "오류"});
					return;
				} 				
				
				sap.m.MessageBox.show("삭제가 완료되었습니다.", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title : "안내",
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
		
		sap.m.MessageBox.show("삭제하시겠습니까?", {
			title : "안내",
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : DeleteProcess
		});
	},
	
});