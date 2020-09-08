jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList
	 */

	PAGEID : "ZUI5_HR_HousingExpensesList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	
	_vAppno : "",
	_vZworktyp : "BE16",
	
	_vEnamefg : "",
	_oControl : null,
	
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
	},

	onBeforeShow : function(oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate()+1);
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vEname = "";
		var vPernr = "";
		var vEncid = "";
		var oController = this ;
		
		var addZero = function(d) {
			if(d < 10) return "0" + d;
			else return "" + d;
		};
		
		if(!oController._ListCondJSonModel.getProperty("/Data")){
			if(vEmpLoginInfo.length > 0){
				var OneData = {};
				
				if(_gAuth == "E"){
					// 대상자
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
					vEncid = vEmpLoginInfo[0].Encid ;
				}
			}
			var JSonData = {Data : {Apbeg : curDate.getFullYear() + "."+ addZero(curDate.getMonth()+1), 
									Apend : curDate.getFullYear() + "."+ addZero(curDate.getMonth()+1), 
									Pernr : vPernr, Ename : vEname, 
									Encid: vEncid, Auth : _gAuth, State : 0 }};
			oController._ListCondJSonModel.setData(JSonData);
		}
		
		// 테이블 sort, filter 제거
		var oColumns = sap.ui.getCore().byId(oController.PAGEID + "_Table").getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		common.ApplyInformation.onSetApplyInformation(oController);
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onUploadExcel : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
		var oController = oView.getController();		
		common.AttachFileAction = oController;
		
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		if(common.Common.checkNull(SerchCond.Apbeg)){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2441"),oBundleText.getText("LABEL_0053"));	// 2441:급여반영일을 입력하시기 바랍니다.
			return ;
		}
		
		var fCheckBrowser = function() {
        	try {
            	var ua= navigator.userAgent, tem, 
                M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                if(/trident/i.test(M[1])){
                    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE '+(tem[1] || '');
                }
                if(M[1]=== 'Chrome'){
                    tem= ua.match(/\bOPR\/(\d+)/);
                    if(tem!= null) return 'Opera '+tem[1];
                }
                M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
                return M.join(' ');
            } catch (ex) {
            	return "";
            }
        };
        
        var vBrowserInfo = fCheckBrowser();
        if(vBrowserInfo != "") {
        	var vTemp = vBrowserInfo.split(" ");
        	
        	if(vTemp[0].toLowerCase() == "msie") {
            	if(parseInt(vTemp[1]) < 10) {
            		sap.m.MessageBox.alert(oBundleText.getText("LABEL_2697"), oBundleText.getText("LABEL_0053"));	// 2697:Error: 파일 업로드 기능은 IE10 이상 또는 Chrome 등을 사용 바랍니다.
            		oController.onFileUploadClear(oController);
            		return;
            	}
            }
        }
 
		var files = jQuery.sap.domById(this.getId() + "-fu").files;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		var uploadProcess = function(){
			try {
				if(files && files.length) {
					var file = files[0];
					if(file && window.FileReader){
						var reader = new FileReader();
						
						if (!FileReader.prototype.readAsBinaryString) {
							FileReader.prototype.readAsBinaryString = function (fileData) {
						       var binary = "";
						       var pt = this;
						       var reader = new FileReader();      
						       reader.onload = function (e) {
						           var bytes = new Uint8Array(reader.result);
						           var length = bytes.byteLength;
						           for (var i = 0; i < length; i++) {
						               binary += String.fromCharCode(bytes[i]);
						           }
						        //pt.result  - readonly so assign binary
						        pt.content = binary;
						        console.log(binary);
						        $(pt).trigger('onload');
						       }
						       reader.readAsArrayBuffer(fileData);
						    }
						}
						
						
						var result = { Data : []}, data, vdata = {};
						reader.onload = function(e) {
							console.log(e);
							data = e ? e.target.result : reader.content;
							data = btoa(data);
						        
							var wb = XLSX.read(data, {type: 'base64'});
							wb.SheetNames.forEach(function(sheetName){
								var roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
					
								if(roa.length > 0){
									var i = 1;
									roa.forEach(function(element){
										vdata = {};
										vdata.Perid = element.Coulmn_0;                                // 사번
										vdata.Ename = element.Coulmn_1; // 이름
										vdata.Betrg = common.Common.removeComma(element.Coulmn_2); // 금액
										vdata.Zbigo = element.Coulmn_3;                                 // 비고
										vdata.Waers = "KRW";
										result.Data.push(vdata);
									});
								}
							});
							
							var oneData = {};
							oneData.DetailNav = result.Data;
							oneData.Prcty = "U";
//							oneData.Reqym = SerchCond.Apbeg.replace(".","");                      // 급여월
							
							var Apbeg = sap.ui.getCore().byId(oController.PAGEID + "_Apbeg").getValue();
							if(Apbeg == ""){
								sap.m.MessageBox.error(oBundleText.getText("LABEL_2922"), oBundleText.getText("LABEL_0053"));
								return;
							}		
							
							if(Apbeg.indexOf("-") > -1) Apbeg = Apbeg.split("-");
							else if(Apbeg.indexOf(".") > -1) Apbeg = Apbeg.split(".");
							oneData.Reqym = Apbeg[0] + Apbeg[1];
							
							var onProcess = function(){
									var errData = {},  
									    vData = { Data : []},
									    oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_EXP_SRV");
									oModel.create("/CompanyHouseExpApplSet", oneData, {
										success: function(data,res) {
											if(data) {
												vData.Data = data.DetailNav.results;
												i = 1;
												vData.Data.forEach(function(element){
													element.Idx = i++;
													element.Reqym = element.Reqym == "" ? "" : element.Reqym.substring(0,4) + "." + element.Reqym.substring(4,6);
												})
											} 
										},
										error: function (Res) {
											errData = common.Common.parseError(Res);
										}
									});	
									
									oController.BusyDialog.close();
									
									if(errData.Error && errData.Error == "E"){
										sap.m.MessageBox.error(errData.ErrorMessage, oBundleText.getText("LABEL_0053"));
										oController.onFileUploadClear(oController);
										return ;
									}
									
									oController._ListJSonModel.setData(vData);
									oTable.setVisibleRowCount(vData.Data.length);
									oController._ListJSonModel.refresh();
									
									oController.onFileUploadClear(oController);
									sap.m.MessageBox.information(oBundleText.getText("LABEL_2629"),oBundleText.getText("LABEL_0052"));	// 52:안내, 2629:파일업로드를 완료하였습니다.
								};
							
							oController.BusyDialog.open();
							setTimeout(onProcess, 100);
						
						}
						reader.readAsBinaryString(file);
					}else{
						oController._ListJSonModel.setData(result);
					}
				} else {
					sap.m.MessageBox.error(oBundleText.getText("LABEL_2540"), oBundleText.getText("LABEL_0053"));	// 2540:업로드 파일을 가져오지 못했습니다.
					oController.onFileUploadClear(oController);
					return;
				}
			} catch(oException) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_2628") + " :\n" + oException.message, oBundleText.getText("LABEL_0053"));	// 2628:파일 업로드에 실패하였습니다.
				oController.onFileUploadClear(oController);
				return;
			}
		};
		
		var onProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oTable.getModel().setProperty("/Data",[]);
				oTable.setVisibleRowCount(1);
				oTable.getModel().refresh();
				uploadProcess();
			}
		}; 
		
		if(oTable.getModel().getProperty("/Data") && oTable.getModel().getProperty("/Data").length > 0){
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2644"), {	// 2644:화면 정보가 삭제됩니다. 덮어쓰겠습니까?
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose : onProcess
			});
		}else{
			uploadProcess();
		}
		
	},
	
	onFileUploadClear : function(oController){
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.clear();
		oFileUploader.setValue("");
	},
	
	onChangeState : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		oTable.getModel().setData([]);
		oTable.setVisibleRowCount(1);
		oTable.getModel().refresh();
	},
	
	onPressTransport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
		var oController = oView.getController();	
		var vData = oController._ListJSonModel.getProperty("/Data"),
		    oneData = {}, tableData = [],
	  	    oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_EXP_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		if(!vData || vData.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2586"), oBundleText.getText("LABEL_0053"));	// 2586:전송할 데이터가 존재하지 않습니다.\n업로드 후 진행 바랍니다.
			return ;
		}
		
		vData.forEach(function(element){
			if((element.Appst == "" )  && element.Message == ""){		
				element.Reqym = element.Reqym.replace(".","");
				element.Betrg = common.Common.removeComma(element.Betrg); // 금액
				tableData.push(common.Common.copyByMetadata(oModel, "ExpDetail", element));
			}
		});
		
		oneData.DetailNav = tableData;
		oneData.Prcty = "C";
		
		var onProcess = function(){
			var errData = {},  
			    result = [];
			   
			oModel.create("/CompanyHouseExpApplSet", oneData, {
				success: function(data,res) {
					if(data) {
						result = data.DetailNav.results;
					} 
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});	
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.error(errData.ErrorMessage, oBundleText.getText("LABEL_0053"));
				return ;
			}
			for(var i=0; i<result.length;i++){
				for(var j=0; j<vData.length;j++){
					if(result[i].Pernr == vData[j].Pernr && result[i].Reqym.replace(".") == vData[j].Reqym.replace(".")){
						vData[j].Appst = result[i].Appst;
						vData[j].Appsttx = result[i].Appsttx;
						break;
					}
				}
			}
			oController._ListJSonModel.setProperty("/Data",vData);
			oController._ListJSonModel.refresh();
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2585"),oBundleText.getText("LABEL_0052"));	// 52:안내, 2585:전송을 완료하였습니다.
		}
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_2698"), {	// 2698:“메시지”란에 오류내역이 없는 항목만 전송됩니다.
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			onClose : function(){
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		});
	},
	
	onDeleteRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
		var oController = oView.getController();
		var vIdx = oEvent.getSource().getParent().getIndex() ;
		
		var onProcess = function() {
			var vData = oController._ListJSonModel.getProperty("/Data/" + vIdx);
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			if(vData.Appst != ""){
				var errData = {};	
				var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_EXP_SRV");
				
				oModel.remove("/CompanyHouseExpApplSet(Pernr='" + vData.Pernr + "',Reqym='" + vData.Reqym.replace(".","")  + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						errData = common.Common.parseError(Res);
					}
				});
				oController.BusyDialog.close();
								
				if(errData.Error == "E"){
					sap.m.MessageBox.error(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					return;
				} 		
			}
			
			var vData = oController._ListJSonModel.getProperty("/Data");
			vData.splice(vIdx, 1);
			common.Common.reIndexODataArray(vData);
			oController._ListJSonModel.setProperty("/Data",vData);
			oController._ListJSonModel.refresh();
			oTable.setVisibleRowCount(vData.length);
			oController.BusyDialog.close();
		};
		
		var deleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_2513"), {	// 2513:선택한 데이터를 삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : deleteProcess
		});
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
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var vOrgeh = oOrgeh.getCustomData() && oOrgeh.getCustomData().length > 0 ? oOrgeh.getCustomData()[0].getValue() : "";
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var Datas = {Data : []};
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		var aFilters = [];
		var begDate = null, endDate = null;
		var oModel = sap.ui.getCore().getModel("ZHR_COMPANYHOUSE_EXP_SRV");
		
		aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "L"));
		
		if(SerchCond.Apbeg != "") {
			begDate = sap.ui.getCore().byId(oController.PAGEID + "_Apbeg").getValue();
			begDate = begDate.split("-");
			aFilters.push(new sap.ui.model.Filter('Pybeg', sap.ui.model.FilterOperator.EQ, begDate[0] + begDate[1]));
		}
		if(SerchCond.Apend != "") {
			endDate = sap.ui.getCore().byId(oController.PAGEID + "_Apend").getValue();
			endDate = endDate.split("-");
			aFilters.push(new sap.ui.model.Filter('Pyend', sap.ui.model.FilterOperator.EQ, endDate[0] + endDate[1]));
		}
		if(SerchCond.Apbeg != "" && SerchCond.Apend != "") {
			if(begDate[0] * 1 > endDate[0] * 1 || begDate[1] * 1 > endDate[1] * 1 ){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_1221"), {title : oBundleText.getText("LABEL_0053")});	// 1221:시작일자가 종료일자보다 큽니다.
				return ;
			}
		}
		if(SerchCond.Encid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		if(!common.Common.checkNull(vOrgeh)){
			aFilters.push(new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, vOrgeh));
		}
		function Search() {
			oModel.read("/CompanyHouseExpApplSet", {
				async : false,
				filters : aFilters,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							OneData.Betrg = common.Common.numberWithCommas(OneData.Betrg);
							OneData.Reqym = OneData.Reqym == "" ? "" : OneData.Reqym.substring(0,4) + "." + OneData.Reqym.substring(4,6);
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
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas);
			
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			
			if(oController.Error == "E") {
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage);
			}
			
			oTable.bindRows("/Data");
			
			oController.BusyDialog.close();		
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList"),
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
			
//			if(_gAuth != "H"){
//				oFilters.push(new sap.ui.model.Filter('Persa', sap.ui.model.FilterOperator.EQ, oController._vPersa));
//			}
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
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
			oController._ListCondJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._ListCondJSonModel.setProperty("/Data/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			
			oController.onPressSearch();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Encid", "");
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
		var oController = oView.getController();
	},
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split(".");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingExpenses.ZUI5_HR_HousingExpensesList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		var vData = common.Common.checkNull(oJSONModel.getProperty("/Data")) ? [] :  oJSONModel.getProperty("/Data") ;
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: vData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_2162") + "-" + dateFormat.format(curDate) + ".xlsx"	// 2162:지방사택 변동성 경비 관리
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	},
	
	onDownloadFormat : function(oEvent){
		var vColumns = [{ type : "string" , label : oBundleText.getText("LABEL_0031"), property : "Temp1"},	// 31:사번
						{ type : "string" , label : oBundleText.getText("LABEL_0038"), property : "Temp2"},	// 38:성명
						{ type : "string" , label : oBundleText.getText("LABEL_1580"), property : "Temp3"},	// 1580:금액 (회사지원분만 입력)
						{ type : "string" , label : oBundleText.getText("LABEL_0096"), property : "Temp4"}];	// 96:비고
		var vData = [];
		var oSettings = {
				workbook: { columns: vColumns },
				dataSource: vData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_2163") + ".xlsx"	// 2163:지방사택 변동성 경비 관리 업로드 양식
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});