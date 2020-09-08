sap.ui.controller("ZUI5_HR_YEARTAX.YearTaxDetail", {
	PAGEID : "YearTaxDetail",

	_vPersa : "",
	_vPernr : "",
	_SortDialog : null,
	_Actty : "E" ,  //ESS 에서 호출
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	
	_BusyDialog : new sap.m.BusyDialog(),
	BusyDialog : new sap.m.BusyDialog(),
	
	_Columns : [],
	_vFromPageId : "",
	_Flag : "",	// 사원검색 구분
	_Pernr : "",
	_Encid : "",
	_Zyear : "",
	_Pystat : "",
	_Yestat : "",
	
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
//		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

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
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

	},	
	
	onBeforeShow: function(oEvent) {
		var oController = this;
	    oController._Flag = "";
		
		if(!oController._DetailJSonModel.getProperty("/Data")){

			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
				
			var vData = {
				Data : {
					Zyear : oEvent.data.Zyear,
					Pernr : oEvent.data.Pernr,
					Encid : oEvent.data.Encid,
					Pystat : oEvent.data.Pystat,
					Yestat : oEvent.data.Yestat,
					Auth : _gAuth,
					Key : "1"
				},
				// 인적공제
				Data2 : {
					Zyear : oEvent.data.Zyear,
					Pernr : oEvent.data.Pernr,
					Encid : oEvent.data.Encid,
					Pystat : oEvent.data.Pystat,
					Yestat : oEvent.data.Yestat,
					Ename : vEmpLoginInfo[0].Ename,
					Zzorgtx : vEmpLoginInfo[0].Zzorgtx,
					Zzjikcht : vEmpLoginInfo[0].Zzjikcht,
					Auth : _gAuth
				},
				// 소득공제
				Data4 : {
					
				}
			};
			
			oController._Pernr = oEvent.data.Pernr;
			oController._Zyear = oEvent.data.Zyear;
			oController._Encid = oEvent.data.Encid;
			oController._Pystat = oEvent.data.Pystat;
			oController._Yestat = oEvent.data.Yestat;
			
			console.log("대상자: " + oController._Pernr, oController._Zyear, oController._Pystat, oController._Yestat);
			
			oController._DetailJSonModel.setData(vData);
		}
		
	},
	
	onAfterShow : function(evt){
		var oController = this;
		
	},	
	
	onChangeDate : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.error("잘못된 일자형식입니다.", {
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	handleIconTabBarSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
		
		switch(sKey){
			case "1": // 종합안내
				break;
			case "2": // 인적공제
				oController.onPressSearch2(oEvent);
				break;
			case "3": // 국세청자료
				oController.onPressSearch3(oEvent);
				break;
			case "4": // 소득공제
				oController.onPressSearch4(oEvent);
				break;
			case "5": // 양식출력
				oController.onPressSearch5(oEvent);
				break;
			case "6": // 모의실행
				oController.onPressSearch6(oEvent);
				break;
			default:
		}
		
	},
	
	// 인적공제
	onPressSearch2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var oData = oController._DetailJSonModel.getProperty("/Data2");
		var oData2 = {};
		
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		
		// 1. 본인정보
//		var oPath = "/BasicInfo(Zyear='" + oData.Zyear + "',Pernr='" + oData.Pernr + "')";		
		var oPath = "/BasicInfo(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid)  + "')";		
		oModel.read(oPath, null, null, false,
				function(data, oResponse) {
					if(data) {
						data.Pystat = oData.Pystat;
						data.Yestat = oData.Yestat;
						data.Auth = _gAuth;
						data.Encid = oData.Encid;
						data.Ename = oData.Ename;
						data.Zzorgtx = oData.Zzorgtx;
						data.Zzjikcht = oData.Zzjikcht;
						
						data.Pdcid = data.Pdcid == "X" ? true : false; // 인적공제 항목변경
						data.Hshld = data.Hshld == "X" ? true : false; // 세대주
						data.Womee = data.Womee == "X" ? true : false; // 부녀자
						data.Sigpr = data.Sigpr == "X" ? true : false; // 한부모
						data.Ageid = data.Ageid == "X" ? true : false; // 경로자
						data.Hndee = data.Hndee == "X" ? true : false; // 장애인
						
						oData2 = data;
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

		oController._DetailJSonModel.setProperty("/Data2", oData2);
		
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}
		console.log(oController._DetailJSonModel.getData());
		
		// 2. 가족정보
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		// sort, filter 제거
		var oColumn = oTable.getColumns();
		for(var i=0; i<oColumn.length; i++){
			oColumn[i].setSorted(false);
			oColumn[i].setFiltered(false);
		}
		
		
		
		var oPath = "/FamilyList?$filter=Encid eq '" + encodeURIComponent(oData.Encid) + "' and Zyear eq '" + oData.Zyear + "'";
		oModel.read(oPath, null, null, false,
				function(data, oResponse) {
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++){
							data.results[i].Pdcid = oData2.Pdcid; 
							data.results[i].Regnr = data.results[i].Regnr.substring(0,6) + "-" + data.results[i].Regnr.substring(6); // 주민등록번호
							
							data.results[i].Dptid = data.results[i].Dptid == "X" ? true : false;
							data.results[i].Ageid = data.results[i].Ageid == "X" ? true : false;
							data.results[i].Fstid = data.results[i].Fstid == "X" ? true : false;
							data.results[i].Hndid = data.results[i].Hndid == "X" ? true : false;
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
		
		oJSONModel.setData(vData);
		oTable.bindRows("/Data");
		oTable.setVisibleRowCount(vData.Data.length);
		
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}
	},
	
	// 국세청자료
	onPressSearch3 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		common.YeaAttachFileAction.setAttachFile(oController);
	},
	
	// 소득공제
	onPressSearch4 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var oData = oController._DetailJSonModel.getProperty("/Data");
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		
		var vData = {};
		
		var oPath = "/YeaSummary(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "')";
		oModel.read(oPath, null, null, false, 
				function(data, oResponse) {
					if(data) {
						data.Pystat = oController._DetailJSonModel.getProperty("/Data/Pystat");
						data.Yestat = oController._DetailJSonModel.getProperty("/Data/Yestat");
						
						vData = data;
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
			oController._DetailJSonModel.setProperty("/Data4", vData);
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}
		
		var oPath = "/P0542List(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "')";
		oModel.read(oPath, null, null, false, 
				function(data, oResponse) {
					if(data) {
						vData.Finvs	= data.Finvs;
						vData.Finvt	= data.Finvt;
						vData.Fprdo	= data.Fprdo;
						vData.Infn1	= data.Infn1;
						vData.Infn2	= data.Infn2;
						vData.Infn3	= data.Infn3;
						vData.Infn4	= data.Infn4;
						vData.Insln	= data.Insln;
						vData.Intfn	= data.Intfn;
						vData.Intot	= data.Intot;
						vData.Inttl	= data.Inttl;
						vData.Invst	= data.Invst;
						vData.Pinvs	= data.Pinvs;
						vData.Repay	= data.Repay;
						vData.Tinvs	= data.Tinvs;
						vData.Vinvs	= data.Vinvs;
						vData.ZfprdoNto	= data.ZfprdoNto;
						vData.ZfprdoNts	= data.ZfprdoNts;
						vData.ZfprdoOth	= data.ZfprdoOth;
						vData.ZinslnNto	= data.ZinslnNto;
						vData.ZinslnNts	= data.ZinslnNts;
						vData.ZinslnOth	= data.ZinslnOth;
						vData.ZintfnNto	= data.ZintfnNto;
						vData.ZintfnNts	= data.ZintfnNts;
						vData.ZintfnOth	= data.ZintfnOth;
						vData.ZintotNto	= data.ZintotNto;
						vData.ZintotNts	= data.ZintotNts;
						vData.ZintotOth	= data.ZintotOth;
						vData.ZinttlNto	= data.ZinttlNto;
						vData.ZinttlNts	= data.ZinttlNts;
						vData.ZinttlOth	= data.ZinttlOth;
						vData.ZirlwlNto	= data.ZirlwlNto;
						vData.ZirlwlNts	= data.ZirlwlNts;
						vData.ZirlwlOth	= data.ZirlwlOth;
						vData.ZrepayNto	= data.ZrepayNto;
						vData.ZrepayNts	= data.ZrepayNts;
						vData.ZrepayOth	= data.ZrepayOth;
						vData.ZsmbfiNto	= data.ZsmbfiNto;
						vData.ZsmbfiNts	= data.ZsmbfiNts;
						vData.ZsmbfiOth	= data.ZsmbfiOth;
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

		oController._DetailJSonModel.setProperty("/Data4", vData);
		
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}
	},
	
	// 양식출력
	onPressSearch5 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var sKey = oController._DetailJSonModel.getProperty("/Data/Key");
		console.log(sKey);
		
		var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Detail5_PDF");
			oLayout.destroyContent();
			
		var jsonURL = "/sap/bc/bsp/sap/ZUI5_HR_BSP/yea_json.htm";
		
		var sendData = {
				PERNR : oController._DetailJSonModel.getProperty("/Data/Pernr"),
				ZYEAR : oController._DetailJSonModel.getProperty("/Data/Zyear"),
				ZTYPE : sKey
		};
		
		$.getJSON(jsonURL, sendData, function(data){
			if(data.URL && data.URL != "") {
				var oHeight = parseInt(window.innerHeight - 210) + "px";
				
				oLayout.addContent(
					new sap.ui.core.HTML({
						content : ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + data.URL + "' width='1536px' height='" + oHeight + "' frameborder='0' border='0' scrolling='no'></>"],
						preferDOM : false
					})	
				);
			} else {
				var msgURL = "/sap/bc/bsp/sap/ZUI5_HR_BSP/yea_message.htm";
				oLayout.addContent(
					new sap.ui.core.HTML({
						content : ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + msgURL + "?pKey=" + sKey + "' width='1536px' height='" + oHeight + "' frameborder='0' border='0' scrolling='no'></>"],
						preferDOM : false
					})
				);
			}
	    }).fail(function( jqxhr, textStatus, error ){
	        oLayout.addContent(
				new sap.m.Text({text : "담당자에게 문의하여 주십시오.\n" + textStatus + " : " + error}).addStyleClass("FontFamily")	
			);
	    });
	},
	
	// 모의실행
	onPressSearch6 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Detail6_PDF");
			oLayout.destroyContent();
			
		if(oController._DetailJSonModel.getProperty("/Data/Yeatat") == "3"){
			oLayout.addContent(
				new sap.m.MessageStrip({
					showIcon : true,
					showCloseButton : false,
					type : "Information",
					text : "연말정산이 완료되어 모의실행이 불가합니다."
				})	
			);
		} else {
			var jsonURL = "/sap/bc/bsp/sap/ZUI5_HR_BSP/yea_json.htm";
			var msgURL = "/sap/bc/bsp/sap/ZUI5_HR_BSP/yea_message.htm";
			
			var sendData = {
					PERNR : oController._DetailJSonModel.getProperty("/Data/Pernr"),
					ZYEAR : oController._DetailJSonModel.getProperty("/Data/Zyear"),
					ZTYPE : "5"
			};
			
			$.getJSON(jsonURL, sendData, function(data){
				if(data.URL && data.URL != "") {
					var oHeight = parseInt(window.innerHeight - 170) + "px";
					
					oLayout.addContent(
						new sap.ui.core.HTML({
							content : ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + data.URL + "' width='1536px' height='" + oHeight + "' frameborder='0' border='0' scrolling='no'></>"],
							preferDOM : false
						})	
					);
				} else {
					oLayout.addContent(
						new sap.ui.core.HTML({
							content : ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + msgURL + "?pKey=5' width='1536px' height='" + oHeight + "' frameborder='0' border='0' scrolling='no'></>"],
							preferDOM : false
						})
					);
				}
		    }).fail(function( jqxhr, textStatus, error ){
		        oLayout.addContent(
					new sap.m.Text({text : "담당자에게 문의하여 주십시오.\n" + textStatus + " : " + error}).addStyleClass("FontFamily")	
				);
		    });
		}
	},
	
	// 첨부파일 리스트 
	onSetView : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var oData = oController._DetailJSonModel.getProperty("/Data");
		var oFileDelButton = sap.ui.getCore().byId("yeaUploader_AttachFileDelete");
		var oAttachFileList = sap.ui.getCore().byId("yeaUploader_AttachFileList");
		
		if(oData.Pystat == "1" && oData.Yestat == "1" && oEvent.getParameters().actual > 0) {
			oFileDelButton.setVisible(true);
		} else {
			oFileDelButton.setVisible(false);
		}	
	},
	
	// 첨부파일 다운로드
	onDownloadAttachFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		var jsonURL = "/sap/bc/bsp/sap/ZUI5_HR_BSP/yea_json.htm";
		
		var sendData = {
				PERNR : oController._DetailJSonModel.getProperty("/Data/Pernr"),
				ZYEAR : oController._DetailJSonModel.getProperty("/Data/Zyear"),
				ZTYPE : "P"
		};
		
		$.getJSON(jsonURL, sendData, function(data){
			if(data.URL != "" && data.URL != null) {
				if($.browser.webkit) {
					var iframe = document.getElementById('iWorker');
						iframe.onload = function() {
							setTimeout(function() {
								window.open(data.URL);
							}, 100);
						};
					iframe.src = data.URL;
				} else {
					window.open("pdfPrint.html?pdf=" + data.URL.replace(/=/g, "%3D"), "pdfPring", "width=800, height=700, toolbar=no, menubar=no, scrollbars=no, resizable=no");
				}
			}
	    }).fail(function( jqxhr, textStatus, error ){
	        sap.m.MessageBox.error("담당자에게 문의하여 주십시오.\n" + textStatus + ":" + error);
	    });
	},
	
	// 저장
	onPressSave : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		// 개인정보
		var oData = oController._DetailJSonModel.getProperty("/Data2");
//		if(oData.Pernr == undefined){
//			oController.onPressSearch2();
//			oData = oController._DetailJSonModel.getProperty("/Data2");
//		}
		
		// 소득공제
		var oData2 = oController._DetailJSonModel.getProperty("/Data4");
		if(oData2.Pernr == undefined){
			oController.onPressSearch4();
			oData2 = oController._DetailJSonModel.getProperty("/Data4");
		}
		
		// 개인정보 validation check
		if(oData.Hndee == true && oData.Hndcd == "0"){
			sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").setSelectedKey("2");
			
			sap.m.MessageBox.error("장애코드를 선택하여 주십시오.");
			return;
		}

		var onProcess = function(){
			// 1. 인적공제 저장
			var createData = {};
				createData.Zyear = oData.Zyear;
				createData.Pernr = oData.Pernr;
				createData.Pdcid = oData.Pdcid == true ? "X" : "";
				createData.Hshld = oData.Hshld == true ? "X" : "";
				createData.Hndee = oData.Hndee == true ? "X" : "";
				createData.Hndcd = oData.Hndcd ? oData.Hndcd : "";
				createData.Hndtx = oData.Hndtx ? oData.Hndtx : "";
				createData.Womee = oData.Womee == true ? "X" : "";
				createData.Sigpr = oData.Sigpr == true ? "X" : "";
				createData.Ageid = oData.Ageid == true ? "X" : "";
				
//				createData.Pdcid = oData.Pdcid;
//				createData.Hshld = oData.Hshld;
//				createData.Hndee = oData.Hndee == true ? "X" : "";
//				createData.Hndcd = oData.Hndcd ? oData.Hndcd : "";
//				createData.Hndtx = oData.Hndtx ? oData.Hndtx : "";
//				createData.Womee = oData.Womee == true ? "X" : "";
//				createData.Sigpr = oData.Sigpr == true ? "X" : "";
//				createData.Ageid = oData.Ageid == true ? "X" : "";
				
				
			var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
			
			oModel.update("/BasicInfo(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "')", createData, null,
					function(data,res){
						if(data) {
							
						} 
					},
					function (oError) {
						oController.Error = "E";
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
			);
			
			if(oController.Error == "E"){
				oController.Error = "";
				oController.BusyDialog.close();
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			// 2. 소득공제
			var createData2 = {};
				createData2.Zyear = oData2.Zyear;
				createData2.Pernr = oData2.Pernr;
				createData2.ZrepayNts = oData2.ZrepayNts;
				createData2.ZrepayNto = oData2.ZrepayNto;
				createData2.ZrepayOth = oData2.ZrepayOth;
				createData2.ZsmbfiNts = oData2.ZsmbfiNts;
				createData2.ZsmbfiNto = oData2.ZsmbfiNto;
				createData2.ZsmbfiOth = oData2.ZsmbfiOth;
				
			oModel.update("/P0542List(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "')", createData2, null,
					function(data,res){
						if(data) {
							
						} 
					},
					function (oError) {
						oController.Error = "E";
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
			);
			
			oController.BusyDialog.close();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			sap.m.MessageBox.success("저장되었습니다.", {
				onClose : function(){
					oController.handleIconTabBarSelect();
				}
			});
			
		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.confirm("저장하시겠습니까?", {
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	// 최종승인완료
	onPressComplete : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		// 개인정보
		var oData = oController._DetailJSonModel.getProperty("/Data2");
		if(oData.Pernr == undefined){
			oController.onPressSearch2();
			oData = oController._DetailJSonModel.getProperty("/Data2");
		}
		
		// 소득공제
		var oData2 = oController._DetailJSonModel.getProperty("/Data4");
		if(oData2.Pernr == undefined){
			oController.onPressSearch4();
			oData2 = oController._DetailJSonModel.getProperty("/Data4");
		}
		
		// 개인정보 validation check
		if(oData.Hndee == true && oData.Hndcd == "0"){
			sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").setSelectedKey("2");
			
			sap.m.MessageBox.error("장애코드를 선택하여 주십시오.");
			return;
		}
		
		var onProcess = function(){
			// 1. 인적공제 저장
			var createData = {};
				createData.Zyear = oData.Zyear;
				createData.Pernr = oData.Pernr;
				createData.Pdcid = oData.Pdcid == true ? "X" : "";
				createData.Hshld = oData.Hshld == true ? "X" : "";
				createData.Hndee = oData.Hndee == true ? "X" : "";
				createData.Hndcd = oData.Hndcd ? oData.Hndcd : "";
				createData.Hndtx = oData.Hndtx ? oData.Hndtx : "";
				createData.Womee = oData.Womee == true ? "X" : "";
				createData.Sigpr = oData.Sigpr == true ? "X" : "";
				createData.Ageid = oData.Ageid == true ? "X" : "";
				
			var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
			
			oModel.update("/BasicInfo(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "')", createData, null,
					function(data,res){
						if(data) {
							
						} 
					},
					function (oError) {
						oController.Error = "E";
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
			);
			
			if(oController.Error == "E"){
				oController.Error = "";
				oController.BusyDialog.close();
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			// 2. 소득공제
			var createData2 = {};
				createData2.Zyear = oData2.Zyear;
				createData2.Pernr = oData2.Pernr;
				createData2.ZrepayNts = oData2.ZrepayNts;
				createData2.ZrepayNto = oData2.ZrepayNto;
				createData2.ZrepayOth = oData2.ZrepayOth;
				createData2.ZsmbfiNts = oData2.ZsmbfiNts;
				createData2.ZsmbfiNto = oData2.ZsmbfiNto;
				createData2.ZsmbfiOth = oData2.ZsmbfiOth;
				
			oModel.update("/P0542List(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "')", createData2, null,
					function(data,res){
						if(data) {
							
						} 
					},
					function (oError) {
						oController.Error = "E";
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
			);
			
			if(oController.Error == "E"){
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			// 3. 최종제출
			var createData3 = {};
				createData3.Zyear = oData.Zyear;
				createData3.Pernr = oData.Pernr;
				createData3.Pystat = "";
				createData3.Pystatx = "";
			
			oModel.update("/DataProgress(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "')", createData3, null,
					function(data,res){
						if(data) {
							
						} 
					},
					function (oError) {
						oController.Error = "E";
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
			);
			
			oController.BusyDialog.close();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			sap.m.MessageBox.success("최종입력완료되었습니다. 조회모드로 변경됩니다.", {
				onClose : function(oEvent){
					oController.onDataProgress();
					oController.handleIconTabBarSelect();
				}
			});
			
		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES){
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.confirm( "※ 최종 제출 전에 반드시 확인하십시오." +
						  		 "\n\n(1) 부양가족이 올바르게 체크 되었는지 확인" +
						  		 "\n- 기본공제 대상자에 해당하지 않는데 부양가족으로 체크된 경우 가족등록신청 메뉴에서 수정하시기 바랍니다." +
						  		 "\n* 기본공제 대상자 나이요건" +
						  		 "\n 직계존속: 1959년 12월 31일 이전 출생자(60세이상)" +
						  		 "\n 직계비속: 1999년 1월 1일 이후 출생자(20세이하)" +
						  		 "\n 추가공제(경로우대공제): 1949.12.31 이전 출생자(70세이상)" +
						  		 "\n\n(2) 부양가족 중복공제 여부 확인" + 
						  		 "\n- 독립적인 생계능력이 없는 부모님에 대해 가족 구성원이 중복하여 공제받지 않았는지 확인하십시오." +
						  		 "\n- 맞벌이 부부인 경우 자녀에 대한 보험료, 의료비, 교육비, 기부금, 신용카드 등의 사용액을 부부가 중복으로 공제받지 않았는지 반드시 확인하십시오." + 
						  		 "\n\n 제출 후에는 수정이 불가능합니다. 최종입력완료하시겠습니까?", {
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	// 소득공제 - 주택자금 국세청 금액 삭제
	onPressDelete : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		var oData = oController._DetailJSonModel.getProperty("/Data4");
		
		var onProcess = function(){
			var createData = {};
				createData.Zyear = oData.Zyear;
				createData.Pernr = oData.Pernr;
				createData.ZrepayNts = oData.ZrepayNts;
				createData.ZrepayNto = "0";
				createData.ZrepayOth = oData.ZrepayOth;
				createData.ZsmbfiNts = oData.ZsmbfiNts;
				createData.ZsmbfiNto = oData.ZsmbfiNto;
				createData.ZsmbfiOth = oData.ZsmbfiOth;
				createData.Tinvs = oData.Tinvs;
				createData.Invst = oData.Invst;
				createData.Finvt = oData.Finvt;
				
			var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
			oModel.update("/P0542List(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "')", createData, null,
					function(data,res){
						if(data) {
							
						} 
					},
					function (oError) {
						oController.Error = "E";
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
							else oController.ErrorMessage = Err.error.message.value;
						} else {
							oController.ErrorMessage = oError.toString();
						}
					}
			);	
				
			oController.BusyDialog.close();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			sap.m.MessageBox.success("삭제되었습니다.", {
				onClose : oController.onPressSearch4
			});
		};
		
		var createProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES){
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.confirm("삭제하시겠습니까?", {
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : createProcess
		});
	},
	
	// 대상자 조회 및 선택로직
	onDataProgress : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		
		var oPath = "/DataProgress?$filter=Encid eq '" + encodeURIComponent(oController._DetailJSonModel.getProperty("/Data/Encid"))  + "'";
			oPath += " and Zyear eq '" + oController._DetailJSonModel.getProperty("/Data/Zyear") + "'";
		
		oModel.read(oPath, null, null, false, 
				function(data, oResponse) {
					if(data && data.results.length) {						
						oController._Zyear = data.results[0].Zyear;
				    	oController._Pystat = data.results[0].Pystat;
				    	oController._Yestat = data.results[0].Yestat;
				    	
				    	oController._DetailJSonModel.setProperty("/Data/Zyear",  data.results[0].Zyear);
				    	oController._DetailJSonModel.setProperty("/Data/Pystat", data.results[0].Pystat);
				    	oController._DetailJSonModel.setProperty("/Data/Yestat", data.results[0].Yestat);
				    	oController._DetailJSonModel.setProperty("/Data/Key", "1");
				    	
				    	oController._DetailJSonModel.setProperty("/Data2/Zyear",  data.results[0].Zyear);
				    	oController._DetailJSonModel.setProperty("/Data2/Pystat", data.results[0].Pystat);
				    	oController._DetailJSonModel.setProperty("/Data2/Yestat", data.results[0].Yestat);
				    	
//				    	if(oController._Pystat != "1") sap.ui.getCore().byId("yeaUploader_AttachFileDelete").setEnabled(false);
//				    	else sap.ui.getCore().byId("yeaUploader_AttachFileDelete").setEnabled(true);
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
	
	// 소득공제 - dialog
	onPressOpenSubty : function(oEvent, oSubty){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		console.log(oSubty);
		var oName = "ZUI5_HR_YEARTAX.fragment.Detail04_" + oSubty;
		
		if(!eval("oController._" + oSubty + "Dialog")){
			eval("oController._" + oSubty + "Dialog = sap.ui.jsfragment('" + oName + "', oController);");
			eval("oView.addDependent(oController._" + oSubty + "Dialog);");
		}
		
		oController.onBindTable(oController, oSubty);
		
		eval("oController._" + oSubty + "Dialog.open();");
	},
	
	onBindTable : function(oController, oSubty){
		if(!oController || !oSubty) return;
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		// sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var oData = oController._DetailJSonModel.getProperty("/Data");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		var oPath = "/" + oSubty + "?$filter=Encid eq '" + encodeURIComponent(oData.Encid) + "' and Zyear eq '" + oData.Zyear + "'";
		
		oModel.read(oPath, null, null, false,
				function(data, oResponse) {
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++){
							data.results[i].Idx = i;
														
							if(oData.Pystat == "1" && oData.Yestat == "1"){
								data.results[i].Editable = true;
							} else {
								data.results[i].Editable = false;
							}
															
							switch(oSubty){
								case "P088101": // 보험료
									data.results[i].Haned = data.results[i].Haned == "X" ? true : false;
									data.results[i].Handi = data.results[i].Handi == "X" ? true : false;
									data.results[i].Ntsam = data.results[i].Ntsam ? common.Common.numberWithCommas(data.results[i].Ntsam) : "";
									data.results[i].Otham = data.results[i].Otham ? common.Common.numberWithCommas(data.results[i].Otham) : "";
									break;
								case "P0812List": // 의료비
									data.results[i].Supnr = data.results[i].Supnr == "" ? "" : data.results[i].Supnr.substring(0,3) + "-" + data.results[i].Supnr.substring(3,5) + "-" + data.results[i].Supnr.substring(5,10);
									data.results[i].Meamt = data.results[i].Meamt ? common.Common.numberWithCommas(data.results[i].Meamt) : "";
									break;
								case "P088102": // 교육비
									data.results[i].Haned = data.results[i].Haned == "X" ? true : false;
									data.results[i].Exsty1 = data.results[i].Exsty == "X" ? true : false;
									data.results[i].Exsty2 = data.results[i].Exsty == "F" ? true : false;
									break;
								case "P088103": // 신용카드
								case "P088104": // 현금영수증
								case "P088106": // 직불,선불카드
									data.results[i].Ntsam = data.results[i].Ntsam ? common.Common.numberWithCommas(data.results[i].Ntsam) : "";
									data.results[i].Otham = data.results[i].Otham ? common.Common.numberWithCommas(data.results[i].Otham) : "";
									break;
								case "P0881E6": // 주택임대차대출
//									data.results[i].Regnr = data.results[i].Ldreg == "" ? "" : data.results[i].Ldreg.substring(0,6) + "-" + data.results[i].Ldreg.substring(6,13);
									data.results[i].Rcbeg = dateFormat.format(data.results[i].Rcbeg);
									data.results[i].Rcend = dateFormat.format(data.results[i].Rcend);
									data.results[i].Inrat = parseFloat(data.results[i].Inrat);
									data.results[i].Pricp = data.results[i].Pricp ? common.Common.numberWithCommas(data.results[i].Pricp) : "";
									data.results[i].Intrs = data.results[i].Intrs ? common.Common.numberWithCommas(data.results[i].Intrs) : "";
									break;
								case "P0881E3": // 주택마련저축
									data.results[i].Ptbeg = dateFormat.format(data.results[i].Ptbeg);
									break;
								case "P0858List": // 기부금
									data.results[i].Flnts = data.results[i].Flnts == "X" ? true : false;
									break;
								case "P0881E8": // 장기주택 저당차입금 이자상환액
									data.results[i].Rcbeg = dateFormat.format(data.results[i].Rcbeg);
									data.results[i].Rcend = dateFormat.format(data.results[i].Rcend);
									data.results[i].Fixrt = data.results[i].Fixrt == "1" ? true : false;
									data.results[i].Nodef = data.results[i].Nodef == "1" ? true : false;
									break;
								case "P0881E5": // 주택자금 - 월세
									data.results[i].Rcbeg = dateFormat.format(data.results[i].Rcbeg);
									data.results[i].Rcend = dateFormat.format(data.results[i].Rcend);
									if(data.results[i].Regnr.length == 10){
										data.results[i].Regnr = data.results[i].Regnr.substring(0,3) + "-" +data.results[i].Regnr.substring(3,5) + "-" + data.results[i].Regnr.substring(5,10);
									}
									break;
							}
							
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
		
		oJSONModel.setData(vData);
		oTable.bindRows("/Data");
		oTable.setVisibleRowCount(vData.Data.length > 10 ? 10 : vData.Data.length);
				
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}		
	},
	
	onPressSaveSubty : function(oEvent, oSubty){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
		var oJSONModel = oTable.getModel();
		var oData = oJSONModel.getProperty("/Data");
		console.log(oData);
		
		var onProcess = function(){
			var batchData = [];
			var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
			
			if(oData && oData.length){
				batchData = oController.onMakeData(oSubty, oData);
				
				if(batchData && batchData.length){
					var rError = null;
					oModel.addBatchChangeOperations(batchData); 
					oModel.submitBatch(
						    function (oData) {
								console.log("DATA Sucess Batch !!!");
								oController.onSaveOperator(oEvent, oSubty);
						    },
						    function (oError) {
						    	console.log("DATA Error Batch !!!");
						    	rError = oError;
						    }
					);
					if(rError != null) return rError;
				}				
			} else { // 저장할 데이터가 없는 경우 Operator만 호출한다.
				oController.onSaveOperator(oEvent, oSubty);
			}
			
			oController.BusyDialog.close();
		};
		
		var saveProcess = function(oEvent){
			if(oEvent && oEvent == sap.m.MessageBox.Action.YES){
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.confirm("저장하시겠습니까?", {
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : saveProcess 
		});
	},
	
	// 사업자등록번호 확인
	check_busino : function(vencod) {
//		var sum = 0;
//		var getlist = new Array(10);
//		var chkvalue = new Array("1","3","7","1","3","7","1","3","5");
//		console.log("사업 넘버 : " + vencod);
//		for(var i=0; i<10; i++) {
//			getlist[i] = vencod.substring(i, i+1); 	
//		}
//		for(var i=0; i<9; i++) { 
//			sum += getlist[i]*chkvalue[i]; 
//		}
//		sum = sum + parseInt((getlist[8]*5)/10);
//		sidliy = sum % 10;
//		sidchk = 0;
//
//		if(sidliy != 0) { 
//			sidchk = 10 - sidliy; 
//		}else { 
//			sidchk = 0; 
//		}
//		
//		if(sidchk != getlist[9]) { return false; }
		vencod = vencod.replace(/-/gi,"");
		if(vencod.length != 10) return false;
		return true;
	},

	// 주민등록번호 확인
	check_jumin : function(jumin) {
//		var fmt = /^\d{6}[1234]\d{6}$/; // 포멧 설정
//		if (!fmt.test(jumin)) {
//			return false;
//		}
		jumin = jumin.replace(/-/gi,"");
		
		if(jumin.length != 13) return false;
		
//		// 생년월일 검사
//		var birthYear = (jumin.charAt(6) <= "2") ? "19" : "20";
//		birthYear += jumin.substr(0, 2);
//		var birthMonth = jumin.substr(2, 2) - 1;
//		var birthDate = jumin.substr(4, 2);
//		var birth = new Date(birthYear, birthMonth, birthDate);
//
//		if (birth.getYear() % 100 != jumin.substr(0, 2)
//				|| birth.getMonth() != birthMonth
//				|| birth.getDate() != birthDate) {
//			return false;
//		}
//
//		// Check Sum 코드의 유효성 검사
//		var buf = new Array(13), x = 0;
//		for (var i = 0; i < 13; i++){
//			if(i==6) {
//				x = 1;
//				continue;
//			}
//			buf[i-x] = parseInt(jumin.charAt(i));
//		}
//			
//
//		multipliers = [ 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ];
//		for (var sum = 0, i = 0; i < 12; i++)
//			sum += (buf[i] *= multipliers[i]);
//
//		if ((11 - (sum % 11)) % 10 != buf[12]) {
//			return false;
//		}

		return true;
	},
	
	onMakeData : function(oSubty, oData){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		var oZyear = oController._DetailJSonModel.getProperty("/Data/Zyear");
		var oPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		var oEncid = oController._DetailJSonModel.getProperty("/Data/Encid");
		
		var batchChanges = [];
		
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		
		switch(oSubty){
			case "P088101": // 보험료
				for(var i=0; i<oData.length; i++){					
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Ntsam && !oData[i].Otham){
							sap.m.MessageBox.error("기타금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Deptx = oData[i].Deptx;
						createData.Depty = oData[i].Depty;
						createData.Emnam = oData[i].Emnam;
						createData.Objps = oData[i].Objps;
						createData.Regno = oData[i].Regno;
						createData.Regnr = oData[i].Regnr;
						createData.Haned = oData[i].Haned == "X" || oData[i].Haned == true ? "X" : ""; // 장애인여부
						createData.Handi = oData[i].Handi == "X" || oData[i].Handi == true ? "X" : ""; // 장애인보험
						createData.Ntsam = oData[i].Ntsam ? oData[i].Ntsam.replace(/[^0-9]/g, "") : ""; // 국세청금액
						createData.Otham = oData[i].Otham ? oData[i].Otham.replace(/[^0-9]/g, "") : ""; // 기타금액
						createData.Zflnts = oData[i].Zflnts ? oData[i].Zflnts : ""; // 국세청자료
						
					var oPath = "/P088101(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}				
				break;
			case "P0812List": // 의료비
				for(var i=0; i<oData.length; i++){
					// PDF 업로드 하지 않은 것
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Supnr){
							if(((oData[i].Zflnts == "" || oData[i].Zflnts == undefined) && oData[i].Mepcd == "1") || oData[i].Mesty == "I"){}
							else {
								sap.m.MessageBox.error("사업자등록번호를 입력하여 주십시오.");
								return;
							}
						} else if(oController.check_busino(oData[i].Supnr.replace(/[^0-9]/g, "")) == false && oData[i].Mepcd != "1"){
							sap.m.MessageBox.error("사업자등록번호가 올바르지 않습니다.");
							return;
						} else if(!oData[i].Supnm || oData[i].Supnm.trim() == ""){
							sap.m.MessageBox.error("상호명을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Mepcd || oData[i].Mepcd == "0"){
							sap.m.MessageBox.error("증빙코드를 선택하여 주십시오.");
							return;
						} else if(oData[i].Mesty == "X" && oData[i].Mepcd != "5"){
							sap.m.MessageBox.error("안경구입비의 경우 증빙코드 '5. 기타 의료비 영수증'을 선택하여 주십시오.");
							return;
						} else if(!oData[i].Mecnt){
							sap.m.MessageBox.error("건수를 입력하여 주십시오.");
							return;
						} else if(!oData[i].Meamt){
							sap.m.MessageBox.error("금액을 입력하여 주십시오.");
							return;
						}
					}else if(!oData[i].Supnr){
						if(oData[i].Mesty == "I"){} // 실손 의료비 제외
						else{
							sap.m.MessageBox.error("사업자등록번호를 입력하여 주십시오.");
							return;
						} 
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Subtx = oData[i].Subtx;
						createData.Subty = oData[i].Subty;
						createData.Emnam = oData[i].Emnam;
						createData.Objps = oData[i].Objps;
						createData.Supnr = oData[i].Supnr ? oData[i].Supnr.replace(/[^0-9]/g, "") : "";
						createData.Supnm = oData[i].Supnm ? oData[i].Supnm : "";
						createData.Mepcd = oData[i].Mepcd;
						createData.Mesty = oData[i].Mesty;
						createData.Mecnt = oData[i].Mecnt ? oData[i].Mecnt.replace(/[^0-9]/g, "") : "";
						createData.Meamt = oData[i].Meamt ? oData[i].Meamt.replace(/[^0-9]/g, "") : "";
						createData.Zflnts = oData[i].Zflnts;
						
					var oPath = "/P0812List(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}
				break;
			case "P088102": // 교육비
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Edulv || oData[i].Edulv == "0"){
							sap.m.MessageBox.error("교육단계를 선택하여 주십시오.");
							return;
						} else if(!oData[i].Ntsam && !oData[i].Otham){
							sap.m.MessageBox.error("기타금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Deptx = oData[i].Deptx;
						createData.Depty = oData[i].Depty;
						createData.Emnam = oData[i].Emnam;
						createData.Objps = oData[i].Objps;
						createData.Regno = oData[i].Regno;
						createData.Regnr = oData[i].Regnr;
						createData.Haned = oData[i].Haned == "X" || oData[i].Haned == true ? "X" : "";
						createData.Edulv = oData[i].Edulv;
						
						if(oData[i].Exsty1 == true)
							createData.Exsty = "X";
						else if(oData[i].Exsty2 == true)
							createData.Exsty = "F";
						
						createData.Ntsam = oData[i].Ntsam ? oData[i].Ntsam.replace(/[^0-9]/g, "") : "";
						createData.Otham = oData[i].Otham ? oData[i].Otham.replace(/[^0-9]/g, "") : "";
						createData.Zflnts = oData[i].Zflnts;
					
					var oPath = "/P088102(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}
				break;
			case "P088103": // 신용카드
			case "P088104": // 현금영수증
			case "P088106": // 직불,선불카드
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Cadme || oData[i].Cadme == "0"){
							sap.m.MessageBox.error("사용구분을 선택하여 주십시오.");
							return;
						} else if(!oData[i].Ntsam && !oData[i].Otham){
							sap.m.MessageBox.error("기타금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Deptx = oData[i].Deptx;
						createData.Depty = oData[i].Depty;
						createData.Emnam = oData[i].Emnam;
						createData.Objps = oData[i].Objps;
						createData.Regno = oData[i].Regno;
						createData.Regnr = oData[i].Regnr;
						createData.Cadme = oData[i].Cadme;
						createData.Ntsam = oData[i].Ntsam ? oData[i].Ntsam.replace(/[^0-9]/g, "") : "";
						createData.Otham = oData[i].Otham ? oData[i].Otham.replace(/[^0-9]/g, "") : "";
						createData.Zflnts = oData[i].Zflnts;
						createData.Zzupld = oData[i].Zzupld ? oData[i].Zzupld : "";
					
					var oPath = "/" + oSubty + "(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}					
				break;
			case "P088107": // 제로페이
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Cadme || oData[i].Cadme == "0"){
							sap.m.MessageBox.error("사용구분을 선택하여 주십시오.");
							return;
						} else if(!oData[i].Ntsam && !oData[i].Otham){
							sap.m.MessageBox.error("기타금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Deptx = oData[i].Deptx;
						createData.Depty = oData[i].Depty;
						createData.Emnam = oData[i].Emnam;
						createData.Objps = oData[i].Objps;
						createData.Regno = oData[i].Regno;
						createData.Regnr = oData[i].Regnr;
						createData.Cadme = oData[i].Cadme;
						createData.Ntsam = oData[i].Ntsam ? oData[i].Ntsam.replace(/[^0-9]/g, "") : "";
						createData.Otham = oData[i].Otham ? oData[i].Otham.replace(/[^0-9]/g, "") : "";
						createData.Zflnts = oData[i].Zflnts;
						createData.Zzupld = oData[i].Zzupld ? oData[i].Zzupld : "";
					
					var oPath = "/" + oSubty + "(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}					
				break;
			case "P0881E6": // 주택임대차대출
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Ldnam || oData[i].Ldnam.trim() == ""){
							sap.m.MessageBox.error("대주명을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Regnr){
							sap.m.MessageBox.error("주민등록번호를 입력하여 주십시오.");
							return;
//						} else if(oController.check_jumin(oData[i].Regnr) == false){
//							sap.m.MessageBox.error("주민등록번호가 올바르지 않습니다.");
//							return;
						} else if(!oData[i].Rcbeg){
							sap.m.MessageBox.error("시작일을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Rcend){
							sap.m.MessageBox.error("종료일을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Inrat){
							sap.m.MessageBox.error("이자율을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Pricp){
							sap.m.MessageBox.error("원리금을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Intrs){
							sap.m.MessageBox.error("이자를 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Ldnam = oData[i].Ldnam;
						createData.Ldreg = (oData[i].Regnr.indexOf("*") != -1) ? oData[i].Ldreg : oData[i].Regnr.replace(/[^0-9]/g, "");
						createData.Rcbeg = "\/Date(" + common.Common.getTime(oData[i].Rcbeg) + ")\/";
						createData.Rcend = "\/Date(" + common.Common.getTime(oData[i].Rcend) + ")\/";
						createData.Inrat = oData[i].Inrat;
						createData.Pricp = oData[i].Pricp.replace(/[^0-9]/g, "");
						createData.Intrs = oData[i].Intrs.replace(/[^0-9]/g, "");
						createData.Zflnts = oData[i].Zflnts;
					
					var oPath = "/P0881E6(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}
				break;
			case "P0881E5": // 월세임대계약
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Pnsty || oData[i].Pnsty == "0"){
							sap.m.MessageBox.error("유형을 선택하여 주십시오.");
							return;
						} else if(!oData[i].Ldnam || oData[i].Ldnam.trim() == ""){
							sap.m.MessageBox.error("임대인성명을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Regnr){
							sap.m.MessageBox.error("주민등록번호 또는 사업자등록번호를 입력하여 주십시오.");
							return;
						} else if(oController.check_jumin(oData[i].Regnr) == false && oController.check_busino(oData[i].Regnr) == false){
							sap.m.MessageBox.error("주민등록번호 또는 사업자등록번호가 올바르지 않습니다.");
							return;
						} else if(!oData[i].Houty || oData[i].Houty == "0"){
							sap.m.MessageBox.error("주택유형을 선택하여 주십시오.");
							return;
						} else if(!oData[i].Addre || oData[i].Addre.trim() == ""){
							sap.m.MessageBox.error("임대차 계약주소를 입력하여 주십시오.");
							return;
						} else if(!oData[i].Rcbeg){
							sap.m.MessageBox.error("계약 시작일을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Rcend){
							sap.m.MessageBox.error("계약 종료일을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Monrt){
							sap.m.MessageBox.error("총금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Pnsty = oData[i].Pnsty;
						createData.Ldnam = oData[i].Ldnam;
						createData.Ldreg = (oData[i].Regnr.indexOf("*") != -1) ? oData[i].Ldreg : oData[i].Regnr.replace(/[^0-9]/g, "");
						createData.Houty = oData[i].Houty;
						createData.Flrar = oData[i].Flrar;
						createData.Addre = oData[i].Addre;
						createData.Rcbeg = "\/Date(" + common.Common.getTime(oData[i].Rcbeg) + ")\/";
						createData.Rcend = "\/Date(" + common.Common.getTime(oData[i].Rcend) + ")\/";
						createData.Monrt = oData[i].Monrt.replace(/[^0-9]/g, "");
						createData.Zflnts = oData[i].Zflnts.replace(/[^0-9]/g, "");
						
					var oPath = "/P0881E5(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));	
				}
				break;
			case "P0881E3": // 주택마련저축
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Pnsty || oData[i].Pnsty == "0"){
							sap.m.MessageBox.error("유형을 선택하여 주십시오.");
							return;
						} else if(!oData[i].Finco || oData[i].Finco == "0"){
							sap.m.MessageBox.error("금융사를 선택하여 주십시오.");
							return;
						} else if(!oData[i].Accno){
							sap.m.MessageBox.error("계좌번호를 입력하여 주십시오.");
							return;
						} else if(!oData[i].Ptbeg){
							sap.m.MessageBox.error("가입일자를 입력하여 주십시오.");
							return;
						} else if(!oData[i].Ntsam){
							sap.m.MessageBox.error("금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Pnsty = oData[i].Pnsty;
						createData.Finco = oData[i].Finco;
						createData.Accno = oData[i].Accno;
						createData.Ptbeg = "\/Date(" + common.Common.getTime(oData[i].Ptbeg) + ")\/";
						createData.Ntsam = oData[i].Ntsam.replace(/[^0-9]/g, "");
						createData.Zflnts = oData[i].Zflnts;
						
					var oPath = "/P0881E3(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));	
				}
				break;
			case "P0881E1" :   // 퇴직연금
			case "P0881E202" : // 연금저축
			case "P0881E7" :   // 장기집합투자증권저축
			case "P0881E201":  // 개인연금 저축공제
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Finco || oData[i].Finco == "0"){
							sap.m.MessageBox.error("금융사를 선택하여 주십시오.");
							return;
						} else if(!oData[i].Accno || oData[i].Accno.trim() == ""){
							sap.m.MessageBox.error("계좌번호를 입력하여 주십시오.");
							return;
						} else if(!oData[i].Ntsam){
							sap.m.MessageBox.error("금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						
					if(oSubty == "P0881E201") // 개인연금저축공제
						createData.Pnsty = "01";
					else
						createData.Pnsty = "02";
					
						createData.Finco = oData[i].Finco;
						createData.Accno = oData[i].Accno;
						createData.Ntsam = oData[i].Ntsam.replace(/[^0-9]/g, "");
						createData.Zflnts = oData[i].Zflnts;
					
					var oPath = "/" + oSubty + "(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));	
				}
				break;
			case "P0858List": // 기부금
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Docod || oData[i].Docod == "0"){
							sap.m.MessageBox.error("기부금 유형을 선택하여 주십시오.");
							return;
						} else if(!oData[i].Donum || oData[i].Donum.trim() == ""){
							sap.m.MessageBox.error("사업자등록번호를 입력하여 주십시오.");
							return;
						} else if(oController.check_busino(oData[i].Donum) == false){
							sap.m.MessageBox.error("사업자등록번호가 올바르지 않습니다.");
							return;
						} else if(!oData[i].Donam || oData[i].Donam.trim() == ""){
							sap.m.MessageBox.error("기부처명을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Doamt){
							sap.m.MessageBox.error("금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Deptx = oData[i].Deptx;
						createData.Depty = oData[i].Depty;
						createData.Emnam = oData[i].Emnam;
						createData.Regno = oData[i].Regno;
						createData.Docod = oData[i].Docod;
						createData.Donum = oData[i].Donum.replace(/[^0-9]/g, "");
						createData.Donam = oData[i].Donam;
						createData.Depoi = oData[i].Depoi;
						createData.Doamt = oData[i].Doamt.replace(/[^0-9]/g, "");
						createData.Flnts = oData[i].Flnts == "X" || oData[i].Flnts == true ? "X" : "";
						createData.Zflnts = oData[i].Zflnts;
						
					var oPath = "/P0858List(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}
				break;
			case "P0881E9": // 기타
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Pnsty || oData[i].Pnsty == "0"){
							sap.m.MessageBox.error("유형을 선택하여 주십시오.");
							return;
						} else if(!oData[i].Finco || oData[i].Finco == "0"){
							sap.m.MessageBox.error("금융사를 선택하여 주십시오.");
							return;
						} else if(!oData[i].Accno || oData[i].Accno.trim() == ""){
							sap.m.MessageBox.error("계좌번호를 입력하여 주십시오.");
							return;
						} else if(!oData[i].Ntsam || oData[i].Ntsam.trim() == ""){
							sap.m.MessageBox.error("금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Pnsty = oData[i].Pnsty;
						createData.Finco = oData[i].Finco;
						createData.Accno = oData[i].Accno;
						createData.Ntsam = oData[i].Ntsam.replace(/[^0-9]/g, "");
						createData.Zflnts = oData[i].Zflnts;
						
					var oPath = "/P0881E9(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}
				break;
			case "P0881E8": // 장기주택 저당차입금 이자상환액
				for(var i=0; i<oData.length; i++){
					if(!oData[i].Zflnts || oData[i].Zflnts == ""){
						if(!oData[i].Rcbeg){
							sap.m.MessageBox.error("상환시작일을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Rcend){
							sap.m.MessageBox.error("상환종료일을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Lnprd || oData[i].Lnprd.trim() == ""){
							sap.m.MessageBox.error("대출기간(연도)을 입력하여 주십시오.");
							return;
						} else if(!oData[i].Ntsam){
							sap.m.MessageBox.error("금액을 입력하여 주십시오.");
							return;
						}
					}
					
					var createData = {};
						createData.Zyear = oZyear;
						createData.Pernr = oPernr;
						createData.Seqnr = (i+1) + "";
						createData.Rcbeg = "\/Date(" + common.Common.getTime(oData[i].Rcbeg) + ")\/";
						createData.Rcend = "\/Date(" + common.Common.getTime(oData[i].Rcend) + ")\/";
						createData.Lnprd = oData[i].Lnprd;
						createData.Fixrt = oData[i].Fixrt && (oData[i].Fixrt == "X" || oData[i].Fixrt == true) ? "1" : "";
						createData.Nodef = oData[i].Nodef && (oData[i].Nodef == "X" || oData[i].Nodef == true) ? "1" : "";
						createData.Ntsam = oData[i].Ntsam.replace(/[^0-9]/g, "");
						createData.Zflnts = oData[i].Zflnts;
					
					var oPath = "/P0881E8(Zyear='" + oZyear + "',Encid='" + encodeURIComponent(oEncid) + "',Seqnr='" + createData.Seqnr + "')";
					batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
				}
				break;
			default:
		}
		
		return batchChanges;
	},
	
	onSaveOperator : function(oEvent, oSubty){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		var createData = {};
			createData.Zyear = oController._DetailJSonModel.getProperty("/Data/Zyear");
			createData.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
			createData.Entity = oSubty;
			createData.Finish = "";
			
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		var oPath = "/YeartaxOper(Zyear='" + oController._DetailJSonModel.getProperty("/Data/Zyear");
			oPath += "',Encid='" + encodeURIComponent(oController._DetailJSonModel.getProperty("/Data/Encid")) + "')";
			
		oModel.update(oPath, createData, null,
			    function doSaveLunchData_OnSuccess(oData, response) {
					sap.m.MessageBox.success("저장되었습니다.", {
						onClose : function() {
							console.log("Yeartax Operator Sucess!!!");
							oController.onPressSearch4();
							oController.onBindTable(oController, oSubty); // 데이터 다시 조회함
						} 
					});
			    },
			    function doSaveLunchData_OnError(oError) {
			    	var Err = {};
			    	if(oError.response) {
			    		Err = common.Common.getErrMessage(oError.response);
				        sap.m.MessageBox.error(Err.Message);
			    	} else {
			    		sap.m.MessageBox.error(oError);
			    	}
			    }
		);
	},
	
	// 소득공제 - dialog 라인추가
	onAddLine : function(oEvent, oSubty){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		if(!oController._AddLineDialog){
			oController._AddLineDialog = sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04_AddLine", oController);
			oView.addDependent(oController._AddLineDialog);
		}
		
		var oData = oController._DetailJSonModel.getProperty("/Data");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddLineTable");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		var oPath = "/SearchFamily?$filter=Zyear eq '" + oData.Zyear + "'";
			oPath += " and Encid eq '" + encodeURIComponent(oData.Encid) + "'";
			oPath += " and Entity eq '" + oSubty + "'";
			
		oModel.read(oPath, null, null, false,
				function(data, oResponse) {
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++){
							data.results[i].Idx = i;
																						
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
		
		oJSONModel.setData(vData);
		oTable.bindRows("/Data");
		oTable.setVisibleRowCount(vData.Data.length > 10 ? 10 : vData.Data.length);
				
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
			return;
		}
		
		oController._AddLineDialog.getModel().setData({Data : {Subty : oSubty}});
		
		oController._AddLineDialog.open();
	},
	
	// 단순 라인추가
	onAddLine2 : function(oEvent, oSubty){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
		var oJSONModel = oTable.getModel();
		var oData = oJSONModel.getProperty("/Data");
		
		var oNewData = {Data : []};
		
		// 신규데이터 
		oNewData.Data.push({Idx : 0, Zflnts : ""});
		
		// 기존데이터 추가
		for(var i=0; i<oData.length; i++){
			oData[i].Idx = oNewData.Data.length;
			oNewData.Data.push(oData[i]);
		}
		
		oJSONModel.setData(oNewData);
		oTable.bindRows("/Data");
		oTable.setVisibleRowCount(oNewData.Data.length > 10 ? 10 : oNewData.Data.length);
	},
	
	onSaveAddLine : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		var oSubty = oController._AddLineDialog.getModel().getProperty("/Data/Subty");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddLineTable");
		var oJSONModel = oTable.getModel();
		
		var vIdx = oTable.getSelectedIndices();
		
		if(vIdx.length == 0){
			sap.m.MessageBox.error("대상자를 선택하여 주십시오.");
			return;
		}
		
		// 신규데이터
		var oNewData = {Data : []};
		
		for(var i=0; i<vIdx.length; i++){
			var sPath = oTable.getContextByIndex(vIdx[i]).sPath;
			var vData = oJSONModel.getProperty(sPath);
			
			vData.Idx = i;
			
			if(oSubty == "P0858List"){
				vData.Depoi = vData.Objps;
			} else {
				vData.Objps = vData.Objps;
			}
			
			if(oSubty == "P0812List" || oSubty == "P0812List") {
				vData.Subty = vData.Subty;
				vData.Subtx = vData.Stext;
			} else {
				vData.Depty = vData.Subty;
				vData.Deptx = vData.Stext;
				vData.Regno = vData.Regno;
				vData.Regnr = vData.Regnr;
			}
			
			oNewData.Data.push(vData);
		}
		
		// 기존 테이블에 들어있던 데이터 추가
		var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
		var oJSONModel2 = oTable2.getModel();
		var oData = oJSONModel2.getProperty("/Data");
		for(var i=0; i<oData.length; i++){
			oData[i].Idx = oNewData.Data.length;
			oNewData.Data.push(oData[i]);
		}
		
		oJSONModel2.setData(oNewData);
		oTable2.bindRows("/Data");
		oTable2.setVisibleRowCount(oNewData.Data.length > 10 ? 10 : oNewData.Data.length);
		
		oController._AddLineDialog.close();
	},
	
	// 소득공제 - dialog 라인삭제
	onDeleteLine : function(oEvent, oSubty){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
		var oJSONModel = oTable.getModel();
		var oData = oJSONModel.getProperty("/Data");
		
		var vIdx = oTable.getSelectedIndices();		
		if(vIdx.length == 0){
			sap.m.MessageBox.error("삭제할 라인을 선택하여 주십시오.");
			return;
		}
		
		var oNewData = {Data : []};
		
		for(var i=0; i<oData.length; i++){
			var check = "";
			
			for(var j=0; j<vIdx.length; j++){
				if(check == "X") continue;
				
				var sPath = oTable.getContextByIndex(vIdx[j]).sPath;
				
				if(oJSONModel.getProperty(sPath + "/Idx") == oData[i].Idx){
					check = "X";
				}
			}
			
			if(check == ""){
				oData[i].Idx = oNewData.Data.length;
				oNewData.Data.push(oData[i]);
			}
		}
		
		oJSONModel.setData(oNewData);
		oTable.bindRows("/Data");
		oTable.setVisibleRowCount(oNewData.Data.length > 10 ? 10 : oNewData.Data.length);
	},
	
	// 소득공제 dialog 내 테이블 생성
	makeTable : function(oController, oTable, col_info){
		if(!oController || !oTable || !col_info) return;
		
		for(var i=0; i<col_info.length; i++){

			var oColumn = new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
	        	autoResizable : true,
	        	resizable : true,
				showFilterMenuEntry : true
			});		
			
			if(col_info[i].filter){
				oColumn.setFilterProperty(col_info[i].id);
			}
			
			if(col_info[i].sort){
				oColumn.setSortProperty(col_info[i].id);
			}
			
			oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].label, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
			
			if(col_info[i].plabel != ""){
				oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].plabel, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
			}

			if(col_info[i].span > 0){
				oColumn.setHeaderSpan([col_info[i].span, 1]);
			}
			
			if(col_info[i].width && col_info[i].width != ""){
				oColumn.setWidth(col_info[i].width);
			}
			
			if(col_info[i].align && col_info[i].align != ""){
				oColumn.setHAlign(col_info[i].align);
			}
			
			var oTemplate;
						
			switch(col_info[i].type){
				case "string":
					oTemplate = new sap.ui.commons.TextView({
									text : "{" + col_info[i].id + "}",
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "checkbox":
					oTemplate = new sap.m.CheckBox({
									selected : "{" + col_info[i].id + "}",
									editable : "{Editable}"
								});
					break;
				case "checkbox2":
					oTemplate = new sap.m.CheckBox({
									selected : "{" + col_info[i].id + "}",
									editable : false
								});
					break;
				case "input":
					oTemplate = new sap.m.Input({
									value : "{" + col_info[i].id + "}",
									editable : "{Editable}",
									width : "100%",
									textAlign : "End",
									maxLength : 13,
									liveChange : function(oEvent){
										var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
										
										oEvent.getSource().setValue(common.Common.numberWithCommas(value));
									}
								}).addStyleClass("FontFamily");
					break;
				case "inputnumber":
					oTemplate = new sap.m.Input({
									value : "{" + col_info[i].id + "}",
									editable : "{Editable}",
									width : "100%",
									textAlign : "End",
									maxLength : 3,
									liveChange : function(oEvent){
										var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
										
										oEvent.getSource().setValue(value);
									}
								}).addStyleClass("FontFamily");
					break;
				case "inputtext":
					oTemplate = new sap.m.Input({
									value : "{" + col_info[i].id + "}",
									editable : "{Editable}",
									width : "100%",
									maxLength : 40
								}).addStyleClass("FontFamily");
					break;
				case "inputregnr":
					oTemplate = new sap.m.Input({
									value : "{" + col_info[i].id + "}",
									editable : "{Editable}",
									width : "100%",
									maxLength : 15,
									change : function(oEvent){
										var value = oEvent.getParameters().value.replace(/[^0-9]/g, "");
										
										oEvent.getSource().setValue(value.substring(0,6) + "-" + value.substring(6,13));
									}
								}).addStyleClass("FontFamily");
					break;
				case "inputregnr2":
					oTemplate = new sap.m.Input({
									value : "{" + col_info[i].id + "}",
									editable : "{Editable}",
									width : "100%",
									maxLength : 15,
									change : function(oEvent){
										var value = oEvent.getParameters().value.replace(/[^0-9]/g, "");
										// 주민등록번호
										if(value.length > 10){
											oEvent.getSource().setValue(value.substring(0,6) + "-" + value.substring(6,13));
										// 사업자번호
										}else{
											oEvent.getSource().setValue(value.substring(0,3) + "-" + value.substring(3,5) + "-" + value.substring(5,10));
										}
										
									}
								}).addStyleClass("FontFamily");
					break;
				case "datepicker":
					oTemplate = new sap.m.DatePicker({
									width : "100%",
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
						            value : "{" + col_info[i].id + "}",
									textAlign : "Begin",
									change : oController.onChangeDate,
									editable : "{Editable}"
								}).addStyleClass("FontFamily");
					break;
				case "radiobutton":
					oTemplate = new sap.m.RadioButton({
									selected : "{" + col_info[i].id + "}",
									groupName : "{Idx}",
									width : "100%",
									useEntireWidth : true,
									editable : {
										parts : [{path : "Editable"}, {path : "Edulv"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == true && fVal2 == "2") return true;
											else return false;
										}
									}
								});
					break;
				case "regnr": // 주민등록번호
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : col_info[i].id,
										formatter : function(fVal){
											return fVal ? fVal.substring(0,6) + "-" + fVal.substring(6,13) : "";
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "supnr": // 사업자등록번호
					oTemplate = new sap.m.Input({
									value : "{" + col_info[i].id + "}",
									change : function(oEvent){
										var value = oEvent.getParameters().value.replace(/[^0-9]/g, "");
										
										oEvent.getSource().setValue(value.substring(0,3) + "-" + value.substring(3,5) + "-" + value.substring(5,10));
									},
									editable : "{Editable}"
								}).addStyleClass("FontFamily");
					break;
				case "pdf":
					oTemplate = new sap.ui.core.Icon({
									src : "sap-icon://pdf-attachment",
									visible : {
										path : col_info[i].id,
										formatter : function(fVal){
											return fVal == "X" ? true : false;
										}
									}
								});
					break;
				default:
					oTemplate = new sap.ui.commons.TextView({
									text : "{" + col_info[i].id + "}"
								}).addStyleClass("FontFamily");
			}
			
			oColumn.setTemplate(oTemplate);
			oTable.addColumn(oColumn);
		}
	},
	
	// 대상자 변경
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []};
		
		common.SearchUserList.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == ""){
			if(oController._ListCondJSonModel.getProperty("/Data")){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
			}
			oController.onPressSearch();
		}else{
			oController._oControl = oControl;
			
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
				curDate = new Date(),
				oFilters = [];
			
			oFilters.push(new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)));
			oFilters.push(new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname));
			oFilters.push(new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, '3'));
			oFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			if(gReqAuth) oFilters.push(new sap.ui.model.Filter('ReqAuth', sap.ui.model.FilterOperator.EQ, gReqAuth));
			
			try {
				oCommonModel.read("/EmpSearchResultSet", {
					async: false,
					filters: oFilters,
					success: function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {	
								oData.results[i].Chck = false ;
								vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
								
							}
						}
					},
					error: function(Res) {
						var errData = common.Common.parseError(Res);
						oController.Error = errData.Error;
						oController.ErrorMessage = errData.ErrorMessage;
					}
				});
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					oEvent.getSource().setValue();
					return;
				}	
			}catch(Ex){
				
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Encid);
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}	
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		if(oEvent){
			oController._Flag = oEvent.getSource().getCustomData()[0].getValue();
		}
		
		jQuery.sap.require("common.SearchUserList");
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		common.SearchUserList.oController = oController;
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("ZUI5_HR_YET.fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert("대상자를 한명만 선택하여 주십시오.");
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert("대상자를 선택하여 주십시오.");
				return;
			}
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath; // 
			
			// 인적공제 - 대상자 정보 변경
			oController._DetailJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._DetailJSonModel.setProperty("/Data/Encid", mEmpSearchResult.getProperty(_selPath + "/Encid"));
			oController._DetailJSonModel.setProperty("/Data2/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._DetailJSonModel.setProperty("/Data2/Encid", mEmpSearchResult.getProperty(_selPath + "/Encid"));
			oController._DetailJSonModel.setProperty("/Data2/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			oController._DetailJSonModel.setProperty("/Data2/Zzorgtx", mEmpSearchResult.getProperty(_selPath + "/Zzorgtx"));
			oController._DetailJSonModel.setProperty("/Data2/Zzjikcht", mEmpSearchResult.getProperty(_selPath + "/Zzjikcht"));

			oController._Pernr = mEmpSearchResult.getProperty(_selPath + "/Pernr");			
			oController._Encid = mEmpSearchResult.getProperty(_selPath + "/Encid");			
			
			oController.onDataProgress();
			oController.handleIconTabBarSelect();

		}else {
			sap.m.MessageBox.alert("대상자를 선택하여 주십시오.");
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();

		oController._AddPersonDialog.close();
	},
	
	onSelectPdcid : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		var vData = oJSONModel.getData();
		if(vData.Data && vData.Data.length > 0){
			for(var i = 0; i <vData.Data.length; i++){
				vData.Data[i].Pdcid = oEvent.getSource().getSelected();
			}
			oJSONModel.setData(vData);
		}
	},
	
	onSaveFamily : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
		var oController = oView.getController();
		var oData = oController._DetailJSonModel.getProperty("/Data2");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		var vData = oJSONModel.getData();
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		var createData = {}, errData = {};
		if(vData.Data && vData.Data.length > 0){
			oController.BusyDialog.open();
			for(var i =0; i <vData.Data.length; i++){
				createData = {};
				createData = common.Common.copyByMetadata(oModel, "FamilyList", vData.Data[i]);
				createData.Dptid = createData.Dptid == true || createData.Dptid == "X"? "X" : ""; 
				createData.Ageid = createData.Ageid == true || createData.Ageid == "X"? "X" : "";
				createData.Fstid = createData.Fstid == true || createData.Fstid == "X"? "X" : "";
				createData.Hndid = createData.Hndid == true || createData.Hndid == "X"? "X" : "";
				createData.Regnr = "" ;
					
				oModel.update("/FamilyList(Zyear='" + oData.Zyear + "',Encid='" + encodeURIComponent(oData.Encid) + "',Regno='" + vData.Data[i].Regno + "')", createData, null,
						function(data,res){
							if(data) {
								
							} 
						},
						function (oError) {
							errData = common.Common.parseError(oError);
						}
				);
				if(errData.Error && errData.Error == "E"){
					oController.BusyDialog.close();
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
			oController.BusyDialog.close();
			sap.m.MessageBox.success("저장되었습니다.", {
				onClose : function(){
					oController.handleIconTabBarSelect();
				}
			});
		}
	},
	
//	// 사원검색 닫기
//	onSearchUserClose : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxDetail");
//		var oController = oView.getController();
//		
//		oController._Flag = "";
//		
//		oController._SearchUserDialog.close();
//	},
	
});