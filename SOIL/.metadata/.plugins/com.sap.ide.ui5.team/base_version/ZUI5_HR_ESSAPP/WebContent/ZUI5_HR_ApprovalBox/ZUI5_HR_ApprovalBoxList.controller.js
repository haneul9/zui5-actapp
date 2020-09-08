jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");

sap.ui.controller("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList", {
	PAGEID : "ZUI5_HR_ApprovalBoxList",

	_vPersa : "",
	_vPernr : "",
	_SortDialog : null,
	_Actty : "E" ,  //ESS 에서 호출
	_oClickedSPath : "",
	_oClickedTable : "",
	_Columns : "",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	BusyDialog : new sap.m.BusyDialog(),
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
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

//		var bus = sap.ui.getCore().getEventBus();
//		bus.subscribe("app", "OpenWindow", this.SmartSizing,
//				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf epmproductapp.EPMProductApp
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf epmproductapp.EPMProductApp
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf epmproductapp.EPMProductApp
*/
//	onExit: function() {
//
//	}
	
	SmartSizing : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		var oDetail1 = sap.ui.getCore().byId(oController.PAGEID + "_Detail1");
			oDetail1.setHeight( (window.innerHeight - 117) + "px" );		

	},	

	onBeforeShow: function(evt) {
		var oController = this ;
		
		var curDate = new Date();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		if(!oController._ListCondJSonModel.getProperty("/Data")){			
		
			var vData = {
					Data : {
					
					}
			};
			
			vData.Data.Apbeg = dateFormat.format(new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate()));
			vData.Data.Apend = dateFormat.format(curDate);
			
			oController._ListCondJSonModel.setData(vData);
		}
	},
	
	onAfterShow : function(evt){

	},	
	
	setWorkplace : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		var oFilter = oController._ListCondJSonModel.getProperty("/Data");
		
		if(!oFilter.Apbeg || !oFilter.Apend) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_APPROVAL_SRV");
		var oPath = "/ReqFormListSet?$filter=Apbeg eq datetime'" + oFilter.Apbeg + "T00:00:00'";
			oPath += " and Apend eq datetime'" + oFilter.Apend + "T00:00:00'";
			if(_gAuth == "H" && oFilter.Encid && oFilter.Encid != "")
				oPath += " and Encid eq '" + encodeURIComponent(oFilter.Encid) + "'";
			
			
		var oItem1 = sap.ui.getCore().byId(oController.PAGEID + "_ZreqForm1");
		var oItem2 = sap.ui.getCore().byId(oController.PAGEID + "_ZreqForm2");		
			oItem1.destroyItems();
			oItem2.destroyItems();
	
		oModel.read(oPath, null, null, false,
					function(data, oResponse) {
						if(data && data.results.length) {
							for(var i=0; i<data.results.length; i++) {
								if(i == 0){
									if(!oFilter.ZreqForm && !oFilter.Gubun){
										oController._ListCondJSonModel.setProperty("/Data/ZreqForm", data.results[0].Key);
										oController._ListCondJSonModel.setProperty("/Data/ZreqForx", data.results[0].Value.split("(")[0]);
										oController._ListCondJSonModel.setProperty("/Data/Gubun", data.results[0].Gubun);
									}
								}
								
								var oneData = data.results[i];
							
								var oNavigationListItem = new sap.tnt.NavigationListItem(oController.PAGEID + "_" + oneData.Key + "_" + oneData.Gubun, {
																text : oneData.Value,
																key : oneData.Key + "/" +oneData.Gubun,
																select : oController.onSelectNavigationList
														  });
								if(oneData.Gubun == "T")
									oItem1.addItem(oNavigationListItem);
								else if(oneData.Gubun == "C")
									oItem2.addItem(oNavigationListItem);
							}							
						}
					},
					function(Res) {
						oController.Error = "E";
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
								oController.ErrorMessage = ErrorMessage;
							}
						}
					}
		);
		
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}
	},
	
	onSelectNavigationList : function(oEvent, Flag){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		if(Flag && Flag == "X"){
			
		}else{
			var oZreqForm = oEvent.getSource().getKey().split("/")[0];
			var oGubun = oEvent.getSource().getKey().split("/")[1];
			var oZreqForx =  oEvent.getSource().getText();
			oController._ListCondJSonModel.setProperty("/Data/ZreqForm", oZreqForm);
			oController._ListCondJSonModel.setProperty("/Data/Gubun", oGubun);
			 // 한글남기기
			oZreqForx = oZreqForx.split("(")[0];
		    oController._ListCondJSonModel.setProperty("/Data/ZreqForx", oZreqForx);
		}
		
		oController.onPressSearch(oEvent);
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHR_APPROVAL_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		
		var oFilter = oController._ListCondJSonModel.getProperty("/Data");
		
		var oPath = "?$filter=Apbeg eq datetime'" + oFilter.Apbeg + "T00:00:00'";
			oPath += " and Apend eq datetime'" + oFilter.Apend + "T00:00:00'";
			oPath += " and Gubun eq '" + oFilter.Gubun + "'";
			oPath += " and ZreqForm eq '" + oFilter.ZreqForm + "'";
			
		if(_gAuth == "H" && oFilter.Encid && oFilter.Encid != "")
			oPath += " and Encid eq '" + encodeURIComponent(oFilter.Encid) + "'";
			
		var onProcess = function(){
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			oModel.read("ApprovalListSet/" + oPath, null, null, false,
						function(data, oResponse) {
							if(data && data.results.length) {
								for(var i=0; i<data.results.length; i++) {
									data.results[i].Idx = i+1;
									data.results[i].Checkbox = false;
									data.results[i].Apbeg = data.results[i].Apbeg ? dateFormat.format(new Date(common.Common.setTime(data.results[i].Apbeg))) : "";
									data.results[i].Apend = data.results[i].Apend ? dateFormat.format(new Date(common.Common.setTime(data.results[i].Apend))) : "";
									vData.Data.push(data.results[i]);
								}							
							}
						},
						function(Res) {
							oController.Error = "E";
							if(Res.response.body){
								ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								} else {
									oController.ErrorMessage = ErrorMessage;
								}
							}
						}
			);
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(vData);
			
			oJSONModel.setData(vData);
			oTable.bindRows("/Data");
			oTable.setVisibleRowCount(vData.Data.length);
			oController.SmartSizing();
			
			oController.BusyDialog.close();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
		}

		oController.BusyDialog.open();
		setTimeout(onProcess, 500);	
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1077"),{	// 1077:유효하지 않은 날짜입니다
				onClose : function() {
					oControl.setValue("");
				}
			});
			
			return;
		}
	},
	
	onClickTable : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();

		var oZreqForm = oController._ListCondJSonModel.getProperty("/Data/ZreqForm");
		var oGubun = oController._ListCondJSonModel.getProperty("/Data/Gubun");
		
		if(oZreqForm == "1" && oEvent.getParameters().columnIndex == 0) return; 
					
		var sPath = oEvent.getParameters().rowBindingContext.sPath;
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var oJSONModel = oTable.getModel();
		var vData = oJSONModel.getProperty(sPath);
		
		if(vData && vData.Zurl != ""){
			window.open(vData.Zurl);
		}
	},
	
	onPressRowAction : function(oEvent){
		var oModel = oEvent.getParameters().row.oBindingContexts.undefined.oModel,
		sPath =	oEvent.getParameters().row.oBindingContexts.undefined.sPath,
		vData = oModel.getProperty(sPath);
		
		if( vData.Zurl === undefined || vData.Zurl === null || vData.Zurl == ""  ){
			
		}else{
			window.open(vData.Zurl);
		}
	},
	
	onPressRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		var oControl = this;
		if(!oController._SgnstepPopover) {
			oController._SgnstepPopover = sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.SgnstepPopover", oController);
			oView.addDependent(oController._SgnstepPopover);
		}
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		vSelectedData = oTable.getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
		
		if(common.Common.checkNull(vSelectedData)) return ;
		
		var aFilters = [
			new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vSelectedData.Appno)
		];
		var vData = { Data : []};
		var oModel = sap.ui.getCore().getModel("ZHR_APPROVAL_SRV");
		oModel.read("/ApprLineInfoSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length > 0) {
					for(var i =0; i <data.results.length; i++){
						data.results[i].Idx = i+1;
						if(i == 0){
							data.results[i].icon = "sap-icon://employee";
							data.results[i].ZappEname = oBundleText.getText("LABEL_1076")+" : " + data.results[i].ZappEname ;	// 1076:신청자
						}else{
							data.results[i].icon = "sap-icon://approvals";
							data.results[i].ZappEname = oBundleText.getText("LABEL_1072")+" : " + data.results[i].ZappEname ;	// 1072:결재자
						}
						if(data.results[i].dateTime = data.results[i].ZappPdate == null){
							data.results[i].dateTime = "";
						}else{
							h = dateFormat.format(new Date(common.Common.setTime(data.results[i].ZappPdate)));
							m = common.Common.timeToString(data.results[i].ZappPtime, "HH:mm:ss");
							t = h + "T" + m;
							data.results[i].dateTime = new Date(t);
						}
						vData.Data.push(data.results[i]);	
					}
				}					
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		var oTimeLine = sap.ui.getCore().byId(oController.PAGEID + "_TimeLine");
		oTimeLine.getModel().setData(vData);
		oController._SgnstepPopover.openBy(oControl);
		
	},
	
	onSave : function(oController, vType){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			oTableModel = oTable.getModel(),
			oData = oTableModel.getProperty("/Data"),
			createData = {AppStat : vType }, createItem = [], vQuestionMessage = "" ;
		
		vQuestionMessage = oBundleText.getText("LABEL_1078");	// 1078:선택한 결재문서를 승인하시겠습니까?
		if(vType == "R"){
			createData.Resn = oController._ListCondJSonModel.getProperty("/Data/Resn");
			vQuestionMessage = oBundleText.getText("LABEL_1079");	// 1079:선택한 결재문서를 반려하시겠습니까?
		}
			
		var vIDXs = oTable.getSelectedIndices();
		
		for(var i = 0; i < vIDXs.length; i++ ){
			var oneData = oTableModel.getProperty(oTable.getContextByIndex(vIDXs[i]).sPath);
			createItem.push({Appno : oneData.Appno, AppSeq :oneData.ZappSeq});
		}

		createData.SaveApprLineSet = createItem;
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_APPROVAL_SRV");
			var errData = {}, vReturnMessage ="" ;
			 oModel.create("/SaveApprLineSet", createData, null,
				function(data,res){
					if(data) {
						vReturnMessage = data.Message;
					} 
				},
				function (oError) {
					errData = common.Common.parseError(oError);
				}
			);
		
			if(errData.Error == "E"){
				oController.BusyDialog.close();
				sap.m.MessageBox.error(errData.ErrorMessage);
				return;
			}
		
			sap.m.MessageBox.success(vReturnMessage, {
				onClose : function(){
					if(oController._RejectDialog && oController._RejectDialog.isOpen()) oController._RejectDialog.close();
					oController.setWorkplace("","X");
					oController.onPressSearch();
				}
			});
		};		
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.confirm(vQuestionMessage, {
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onPressApprove : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vIDXs = oTable.getSelectedIndices();
		
		if(vIDXs.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1080"));	// 1080:승인할 건을 선택하여 주세요.
			return;
		}
		
		oController.onSave(oController, "C");
	},
	
	// 반려
	onPressReject : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vIDXs = oTable.getSelectedIndices();
		
		if(vIDXs.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1081"));	// 1081:반려할 건을 선택하여 주세요.
			return;
		}
		
		if(!oController._RejectDialog){
			oController._RejectDialog = sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.InputRjrsn", oController);
			oView.addDependent(oController._RejectDialog);
		}
		
		oController._ListCondJSonModel.setProperty("/Data/Resn","");
		oController._RejectDialog.open();
		
	},
	
	_SgnstepPopover : null,
	displayPopover : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		var oControl = this;
		if(!oController._SgnstepPopover) {
			oController._SgnstepPopover = sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.SgnstepPopover", oController);
			oView.addDependent(oController._SgnstepPopover);
		}
		
		
		
		
		
		
		
		oController._oClickedSPath = oControl.getCustomData()[0].getValue();
		oController._oClickedTable = oControl.getCustomData()[1].getValue();
		oController._SgnstepPopover.openBy(oControl);
	}, 
	
	onBeforeOpenPopoverSgnstep : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		var oPopMatrix = sap.ui.getCore().byId(oController.PAGEID +"_PopMatrix");
			oPopMatrix.destroyRows();
//		var oTable = sap.ui.getCore().byId(oController.PAGEID +"_Table");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + oController._oClickedTable);
		
		var oJSonModel = oTable.getModel();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		var vActda = oJSonModel.getProperty("/Data/"+oController._oClickedSPath+"/Actda2");
			vActda = dateFormat.format(new Date(common.Common.setTime(vActda)));
			
		var oModel = sap.ui.getCore().getModel("ZHRXX_PAAPPROVALSYSTEM_SRV");
		var oPath = "/ApplyApprovalListSet?$filter=Prcty eq '" + 'D' + "'";
			oPath += " and Werks eq '" + oJSonModel.getProperty("/Data/"+oController._oClickedSPath+"/Werks")+ "'";
			oPath += " and Gubun eq '" + oController._Gubun + "'";
			oPath += " and Austy eq '" + _gAuth + "'";
			oPath += " and Appno eq '" +  oJSonModel.getProperty("/Data/"+oController._oClickedSPath+"/Appno") + "'";
			oPath += " and Encid eq '" +  encodeURIComponent(oJSonModel.getProperty("/Data/"+oController._oClickedSPath+"/Encid")) + "'";
			oPath += " and Datum eq datetime'" + vActda + "T00:00:00'";
			
		oModel.read(oPath, null, null, false,
				function(data,res){
					if(data && data.results.length){
						for(var i = 0 ; i <data.results.length; i++){
							var oRow , oCell;
							oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
							oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : data.results[i].Lintytx , maxLines : 1}).addStyleClass("L2P14Font L2PPaddingLeft10")],	
								hAlign : "Begin",
								vAlign : "Middle"
							}).addStyleClass("PopoverLine");
							oRow.addCell(oCell);
							
							oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : data.results[i].Routx , maxLines : 1 }).addStyleClass("L2P14Font L2PPaddingLeft10")],	// Status
								hAlign : "Begin",
								vAlign : "Middle"
							}).addStyleClass("PopoverLine");
							oRow.addCell(oCell);

							oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : data.results[i].Perorgtx + " ( " + data.results[i].Stext + " )" , maxLines : 1 })
											.addStyleClass("L2P14Font L2PPaddingLeft10 L2PFontColorBlue")],	// Effective Date
								hAlign : "Begin",
								vAlign : "Middle"
							}).addStyleClass("PopoverLine");
							oRow.addCell(oCell);
							
							oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : data.results[i].Appsttx })
											.addStyleClass("L2P14Font L2PPaddingLeft10")],	// Effective Date
								hAlign : "Begin",
								vAlign : "Middle"
							}).addStyleClass("PopoverLine");
							oRow.addCell(oCell);
							
							var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
							var vSgnda = data.results[i].Sgnda == null ? "" : dateFormat.format(new Date(common.Common.setTime(data.results[i].Sgnda)));
							 
							oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : vSgnda }).addStyleClass("L2P14Font L2PPaddingLeft10")],	// Effective Date
								hAlign : "Begin",
								vAlign : "Middle"
							}).addStyleClass("PopoverLine");
							oRow.addCell(oCell);
							
							var vSgntm = "";
							if(data.results[i].Sgntm != "000000" && data.results[i].Sgntm.length > 0) 
								vSgntm = data.results[i].Sgntm.substring(0,2) + ":" + data.results[i].Sgntm.substring(2,4) + ":" + data.results[i].Sgntm.substring(4,6);
							
							oCell = new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : vSgntm}).addStyleClass("L2P14Font L2PPaddingLeft10")],	// Effective Date
								hAlign : "Begin",
								vAlign : "Middle"
							}).addStyleClass("PopoverLine");
							oRow.addCell(oCell);
							oPopMatrix.addRow(oRow);

						}	
					}
				},
				function(Res) {
					
				}
		);	
		
	},
	
	
	// 결재자 검색
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		
		oController._vEnamefg = "";
		common.SearchUserList.oController = oController;
		
		if(!vEname || vEname == ""){
			if(oController._ListCondJSonModel.getProperty("/Data")){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
			}
		}else{
			oController._oControl = oControl;
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
			
			var filterString = "/?$filter=Persa eq '1000' and Actda eq datetime'" + vActda + "T00:00:00' and Ename eq '" + encodeURI(vEname) + "' and Stat1 eq '3'";
				filterString += " and Actty eq '" + _gAuth + "'";
			try{
				oCommonModel.read("/EmpSearchResultSet" + filterString, 
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {	
									oData.results[i].Chck = false ;
									vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
									
								}
							}
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
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					oEvent.getSource().setValue();
					return;
				};	
			}catch(Ex){
				
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Encid);
				
//				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}		
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		if(oEvent){
			oController._oControl = "";
			oController._vEnamefg = "";
		}
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUserList.oController = oController;
		common.SearchUserList.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		
		oController._SerachOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}

			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			oController._ListCondJSonModel.setProperty("/Data/Encid", mEmpSearchResult.getProperty(_selPath + "/Encid"));
			oController._ListCondJSonModel.setProperty("/Data/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			
			oController.onPressSearch();			
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList");
		var oController = oView.getController();
		
		oController._ListCondJSonModel.setProperty("/Data/Encid", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	
});