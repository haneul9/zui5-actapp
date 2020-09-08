jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Resort.ZUI5_HR_ResortDetail", {
	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Resort.ZUI5_HR_ResortDetail
	 */

	PAGEID : "ZUI5_HR_ResortDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "BE05",
	BusyDialog : new sap.m.BusyDialog(),
	_useCustomPernrSelection : "",
	_Idx : "",
	
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
		
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vPernr = "",
			vFromPageId = "",
			oDetailData = {Data : {}},
			vParaStruc = "";
		
		oController._DetailJSonModel.setData(oDetailData);
		// parameter, 리턴페이지 처리
		if(oEvent) {
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
			if(oEvent.data.ParaStruc && oEvent.data.ParaStruc != "") vParaStruc = oEvent.data.ParaStruc ;
			vClass = oEvent.data.Class ; 
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		oController.BusyDialog.open();
		
		var oOnlyReadRow1 = sap.ui.getCore().byId(oController.PAGEID +"_OnlyReadRow1"),
			oOnlyReadRow2 = sap.ui.getCore().byId(oController.PAGEID +"_OnlyReadRow2");
		
		if(vParaStruc == "") {
			oController._vAppno = "";
			oController._DetailJSonModel.setProperty("/Data/ZappStatAl", "");
			oOnlyReadRow1.addStyleClass("L2PDisplayNone");
			oOnlyReadRow2.addStyleClass("L2PDisplayNone");
		}else{
			oController._vAppno = "tempData";
			oController._DetailJSonModel.setProperty("/Data/ZappStatAl", "50");
			oController._DetailJSonModel.setProperty("/Data/Pernr", vParaStruc.Pernr);
			oController._DetailJSonModel.setProperty("/Data/Encid", vParaStruc.Encid);
			oOnlyReadRow1.removeStyleClass("L2PDisplayNone");
			oOnlyReadRow2.removeStyleClass("L2PDisplayNone");
		}
		
		// 공통적용사항
		oController.commonAction(oController);
		if(vParaStruc == "") {
			oController.onSearchLayout(oController, vClass);
		}
		else{
			// 상세 조회
			oController.retrieveDetail(oController, vParaStruc);
			oController._TargetJSonModel.setProperty("/Data/ZappStatAl", "50");
		}
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController);
	
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resort.ZUI5_HR_ResortDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_Resort.ZUI5_HR_ResortList",
			data : {}
		});
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resort.ZUI5_HR_ResortDetail");
		var oController = oView.getController();
	},
	
	commonAction : function(oController) {
		// 대상자 조회
		common.TargetUser.oController = oController;
		if(oController._vAppno == "")
			common.TargetUser.onSetTarget(oController);
		
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", oController._DetailJSonModel.getProperty("/Data/ZappStatAl"));
		oController._TargetJSonModel.setProperty("/Data/Auth", _gAuth);
		
		if(oController._DetailJSonModel.getProperty("/Data/ZappStatAl") == "50"){
			var oModel = sap.ui.getCore().getModel("ZHR_RNRCENTER_SRV"),
			errData = {}, vData = { Data : {}}, vDetailData = oController._DetailJSonModel.getProperty("/Data");
		
			oModel.read("/ReqPernrInfoSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vDetailData.Encid)
				],
				success : function(data, res) {
					if(data && data.results.length > 0){
						data.results[0].ZappStatAl = "50";
						data.results[0].Btrtx = data.results[0].Btext;
						vData.Data = data.results[0];
					
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
			oController._TargetJSonModel.setData(vData);
		}
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		
	},
	
	onSearchLayout :function(oController, vClass){
		var oModel = sap.ui.getCore().getModel("ZHR_RNRCENTER_SRV"),
		errData = {}, vData = { Data : []}, vDetailData = oController._DetailJSonModel.getProperty("/Data");
	
		oModel.read("/RnrCenterCheckSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth),
				new sap.ui.model.Filter('Class', sap.ui.model.FilterOperator.EQ, vClass)
			],
			success : function(data, res) {
				if(data && data.results.length > 0){
					for(var i = 0; i < data.results.length; i++){
						data.results[i].ZappStatAl = "";
						data.results[i].Pernr = common.Common.checkNull(vDetailData.Pernr) ? "" : vDetailData.Pernr ;
						data.results[i].Encid = common.Common.checkNull(vDetailData.Encid) ? "" : vDetailData.Encid ;
						vData.Data.push(data.results[i]);
					}
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
		oController._DetailTableJSonModel.setData(vData);
		oController._DetailJSonModel.setData({Data : { ZappStatAl : "", Class : vClass, Pernr : vDetailData.Pernr , Auth : _gAuth, Encid : vDetailData.Encid} });
	},
	
	retrieveDetail : function(oController, vParaStruc) {
		var oModel = sap.ui.getCore().getModel("ZHR_RNRCENTER_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {}, vData = { Data : {}}, vTableData = { Data : []};
		
		oModel.read("/RnrCenterApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vParaStruc.Encid),
				new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ,  _gAuth),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ,  "D"),
				new sap.ui.model.Filter('Class', sap.ui.model.FilterOperator.EQ, vParaStruc.Class),
				new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, vParaStruc.Begda),
				new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, vParaStruc.Endda),
				new sap.ui.model.Filter('Zcode', sap.ui.model.FilterOperator.EQ, vParaStruc.Zcode),
				new sap.ui.model.Filter('Zzseq', sap.ui.model.FilterOperator.EQ, vParaStruc.Zzseq),
				new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, vParaStruc.Zyear),
				new sap.ui.model.Filter('Zznum', sap.ui.model.FilterOperator.EQ, vParaStruc.Zznum),
				new sap.ui.model.Filter('Zsean', sap.ui.model.FilterOperator.EQ, vParaStruc.Zsean),
				new sap.ui.model.Filter('Place', sap.ui.model.FilterOperator.EQ, vParaStruc.Place),
				new sap.ui.model.Filter('Zrest', sap.ui.model.FilterOperator.EQ, vParaStruc.Zrest),
			],
			success : function(data, res) {
				if(data && data.results.length > 0){
					var vTmp = {};
					data.results[0].Begda = dateFormat.format(new Date(common.Common.setTime(data.results[0].Begda)));
					data.results[0].Endda = dateFormat.format(new Date(common.Common.setTime(data.results[0].Endda)));
					data.results[0].ZappStatAl = "50";
					data.results[0].Appno = "tempData";
					oController._vAppno = "tempData";
					Object.assign(vData.Data, data.results[0]);
					vTableData.Data.push(data.results[0]);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		oController._DetailJSonModel.setData(vData);
		oController._DetailTableJSonModel.setData(vTableData);
		
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
			oDetailTitle.setText(oBundleText.getText("LABEL_2379") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 2379:휴양소 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_2379") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 2379:휴양소 신청
		}
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController, isDelHstyp) {
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			orgData = oController._DetailJSonModel.getProperty("/Data"),
			vData = { Data : { Appernr : orgData.Appernr , Appno : orgData.Appno ,
							   Encid : orgData.Encid ,
							   Pernr : orgData.Pernr , ZappStatAl : orgData.ZappStatAl
			}};
		
		oController._DetailJSonModel.setData(vData);
		oController._DetailTableJSonModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
	},	
	
	onAfterSelectPernr : function(oController) {
		var vData = oController._DetailTableJSonModel.getData();
		for(var i =0; i < vData.Data.length; i++){
			vData.Data[i].Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
			vData.Data[i].Encid = oController._DetailJSonModel.getProperty("/Data/Encid");
			oController._DetailTableJSonModel.setData(vData);
		}
	},
			
	onPressArea : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resort.ZUI5_HR_ResortDetail"),
	    oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._AreaDialog) {
			oController._AreaDialog = sap.ui.jsfragment("ZUI5_HR_Resort.fragment.AreaDialog", oController);
			oView.addDependent(oController._AreaDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AreaTable"),
		oAreaTableModel = oTable.getModel();
		oTable.clearSelection();
		oController._Idx = oEvent.getSource().getCustomData()[0].getValue();
		
		var vData = { Data : []}, errData = {},
			oModel = sap.ui.getCore().getModel("ZHR_RNRCENTER_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		var onProcess = function(){
			oModel.read("/AreaListSet", {
				async : false,
				filters : [ new sap.ui.model.Filter('Class', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Class")), 
							new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")) 
				],
				success : function(data, res) {
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i + 1;
						vData.Data.push(data.results[i]);
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oAreaTableModel.setData(vData);
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage)
				return ;
			}
			oController._AreaDialog.open();
		}
		oController.BusyDialog.open();		
		setTimeout(onProcess, 100);
	},
	
	onSelectArea : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resort.ZUI5_HR_ResortDetail"),
	    	oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_AreaTable"),
		    oModel = oTable.getModel(),
		    vResult = oModel.getProperty("/Data"),
		    vData = oController._DetailJSonModel.getProperty("/Data"),
		    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		var vIDXs = oTable.getSelectedIndices();
		
		if(vIDXs.length < 1){
//			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zarea", oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath +"/Zarea")); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zareatxt", oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath +"/Zareatxt")); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zrest", ""); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zrttt","");
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zznum", ""); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Begda", ""); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Endda","");
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Night","");
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zdays", ""); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Total","");
		oController._Idx =  "";
		
		oController._AreaDialog.close();
	},
	
	onPressZrest : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resort.ZUI5_HR_ResortDetail"),
	    oController = oView.getController(),
	    vDetailData = oController._DetailJSonModel.getProperty("/Data");
		oController._Idx = oEvent.getSource().getCustomData()[0].getValue();
		
		
		if(!vDetailData.Pernr) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._ZrestDialog) {
			oController._ZrestDialog = sap.ui.jsfragment("ZUI5_HR_Resort.fragment.ZrestDialog", oController);
			oView.addDependent(oController._ZrestDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ZrestTable"),
		oZrestTable = oTable.getModel();
		oTable.clearSelection();
		
		
		var vData = { Data : []}, errData = {},
			oModel = sap.ui.getCore().getModel("ZHR_RNRCENTER_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			aFilters = [];
			
			aFilters.push(new sap.ui.model.Filter('Class', sap.ui.model.FilterOperator.EQ, vDetailData.Class));
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vDetailData.Encid));
			aFilters.push(new sap.ui.model.Filter('Zarea', sap.ui.model.FilterOperator.EQ, oController._DetailTableJSonModel.getProperty(oEvent.getSource().getBindingContext().sPath + "/Zarea")));
		 
		var onProcess = function(){
			oModel.read("/RestListSet", {
				async : false,
				filters : [aFilters],
				success : function(data, res) {
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i + 1;
						vData.Data.push(data.results[i]);
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oZrestTable.setData(vData);
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage)
				return ;
			}
			oController._ZrestDialog.open();
		}
		oController.BusyDialog.open();		
		setTimeout(onProcess, 100);
	},
	
	onSelectZrest : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resort.ZUI5_HR_ResortDetail"),
	    	oController = oView.getController(),
		    oTable = sap.ui.getCore().byId(oController.PAGEID + "_ZrestTable"),
		    oModel = oTable.getModel(),
		    vResult = oModel.getProperty("/Data"),
		    vData = oController._DetailJSonModel.getProperty("/Data"),
		    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		var vIDXs = oTable.getSelectedIndices();
		
		if(vIDXs.length < 1){
//			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zrest", oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath +"/Zrest")); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zrttt",  oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath +"/Zrttt"));
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zznum", ""); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Begda", ""); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Endda","");
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Night","");
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Zdays", ""); 
		oController._DetailTableJSonModel.setProperty("/Data/"+ oController._Idx + "/Total","");
		oController.onSearchDataList(oController, oController._Idx);
		oController._Idx =  "";
		
		oController._ZrestDialog.close();
	},
	
	onSearchDataList : function(oController, vIndex){
		if(common.Common.checkNull(vIndex)) return ;
		var oZznum = sap.ui.getCore().byId(oController.PAGEID + "_Zznum" + vIndex),
		oModel = sap.ui.getCore().getModel("ZHR_RNRCENTER_SRV"),
		dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
		vData = oController._DetailTableJSonModel.getProperty("/Data/" + vIndex );
		oZznum.destroyItems();
		
		aFilters = [];
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")));
		aFilters.push(new sap.ui.model.Filter('Zarea', sap.ui.model.FilterOperator.EQ, vData.Zarea));
		aFilters.push(new sap.ui.model.Filter('Class', sap.ui.model.FilterOperator.EQ, vData.Class));
		aFilters.push(new sap.ui.model.Filter('Zrest', sap.ui.model.FilterOperator.EQ, vData.Zrest));
		
		oModel.read("/DateListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i =0; i < data.results.length; i++ ){
						oZznum.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Zznum, 
								text: data.results[i].Ztext,
								customData : [new sap.ui.core.CustomData({key : "Index", value : vIndex}),
											  new sap.ui.core.CustomData({key : "Begda", value : dateFormat.format(new Date(common.Common.setTime(data.results[i].Begda)))}),
											  new sap.ui.core.CustomData({key : "Endda", value : dateFormat.format(new Date(common.Common.setTime(data.results[i].Endda)))}),
											  new sap.ui.core.CustomData({key : "Night", value : data.results[i].Night}),
											  new sap.ui.core.CustomData({key : "Zdays", value : data.results[i].Zdays}),
											  new sap.ui.core.CustomData({key : "Applc", value : data.results[i].Applc})
									]
							})
						);
					}
					
				}
			},
			error : function(Res) {
				
			}
		});
	},
	
	onChangeZznum : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resort.ZUI5_HR_ResortDetail"),
    	oController = oView.getController(),
    	oZznum = oEvent.getSource().sId
    	vCustomData = oEvent.getSource().getSelectedItem().getCustomData(),
    	dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
    	vData = oController._DetailTableJSonModel.getProperty("/Data");
		
		if(vCustomData.length != 6) return;
		
		var vIndex = vCustomData[0].getValue();
		vData[vIndex].Begda = vCustomData[1].getValue();
		vData[vIndex].Endda = vCustomData[2].getValue();
		vData[vIndex].Night = vCustomData[3].getValue();
		vData[vIndex].Zdays = vCustomData[4].getValue();
		vData[vIndex].Applc = vCustomData[5].getValue();
		
		oController._DetailTableJSonModel.setProperty("/Data",vData);
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resort.ZUI5_HR_ResortDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController) {
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController) == false) return;
		
		var onProcess = function(){
			// 저장
			var oModel = sap.ui.getCore().getModel("ZHR_RNRCENTER_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			Object.assign(createData, common.Common.copyByMetadata(oModel, "RnrCenterAppl", oneData));
			
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			var oTableData = [];
			for(var i = 0; i < vTableData.length; i++){
				var vTemp = {};
				Object.assign(vTemp, common.Common.copyByMetadata(oModel, "RnrCenterAppl", vTableData[i]));
				vTemp.Night = common.Common.checkNull(vTemp.Night) == true ? 0 : vTemp.Night * 1;
				vTemp.Zdays = common.Common.checkNull(vTemp.Zdays) == true ? 0 : vTemp.Zdays * 1;
				vTemp.Total = common.Common.checkNull(vTemp.Total) == true ? 0 : vTemp.Total * 1;
				vTemp.Begda = (vTemp.Begda) ? "\/Date("+ common.Common.getTime(vTemp.Begda)+")\/" : undefined;
				vTemp.Endda = (vTemp.Endda) ? "\/Date("+ common.Common.getTime(vTemp.Endda)+")\/" : undefined;
				vTemp.Actty = _gAuth ;
				oTableData.push(vTemp);
			}
			createData.RnrCenterApplSet = oTableData; 
			
			oModel.create("/RnrCenterApplSet", createData, {
				success : function(data, res) {
					if(data) {
					} 
				},
				error : function (Res) {
					var errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0048"), {	// 48:신청이 완료되었습니다.
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
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(oneData.Class == "20"){
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data/1");
			if(common.Common.checkNull(vTableData.Zarea))
				vInfoTxt = oBundleText.getText("LABEL_2399");	// 2399:2지망 선택없이 휴양소 신청을 완료하시겠습니까?
			else
				vInfoTxt = oBundleText.getText("LABEL_2394");	// 2394:1지망/2지망 모두 선택하신 내용으로 신청을 완료하시겠습니까?
		}else{
			vInfoTxt = oBundleText.getText("LABEL_2512");	// 2512:선택하신 내용으로 신청을 완료하시겠습니까?
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		if(!oneData.Pernr) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		
		var Data1st = oController._DetailTableJSonModel.getProperty("/Data/0");
		
		if(common.Common.checkNull(Data1st)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2398"), {title : oBundleText.getText("LABEL_0053")});	// 2398:1지망의 휴양지정보를 성택하여 주십시오.
			return false;
		}
		
		if(common.Common.checkNull(Data1st.Zarea)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2395"), {title : oBundleText.getText("LABEL_0053")});	// 2395:1지망의 이용희망장소를 선택하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(Data1st.Zrest)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2397"), {title : oBundleText.getText("LABEL_0053")});	// 2397:1지망의 휴양지를 선택하여 주십시오.
			return false;
		}
		if(common.Common.checkNull(Data1st.Zznum)){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2396"), {title : oBundleText.getText("LABEL_0053")});	// 2396:1지망의 일자를 선택하여 주십시오.
			return false;
		}
		
		if(oneData.Class == "20"){
			var Data2st = oController._DetailTableJSonModel.getProperty("/Data/1");
			var noData = "" , vError = "";
			if(common.Common.checkNull(Data2st)){
				return true;
			}
			
			if(common.Common.checkNull(Data2st.Zarea) && common.Common.checkNull(Data2st.Zrest)  && common.Common.checkNull(Data2st.Zznum)){
	
			}else if(!common.Common.checkNull(Data2st.Zarea) && !common.Common.checkNull(Data2st.Zrest)  && !common.Common.checkNull(Data2st.Zznum)){
	
			}else{
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2400"), {title : oBundleText.getText("LABEL_0053")});	// 2400:2지망을 신청을 원하신다면, 2지망 이용희망장소, 휴양소, 일자를 모두 선택하여 주십시오.
				return false;
			}
		}
		
		return true;
	},
	

});
