jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList
	 */

	PAGEID : "ZUI5_HR_ManpowerList",
	_VizJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_TableJSonModel1 : new sap.ui.model.json.JSONModel(), 
	_Columns : "", 
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	
	_vAppno : "",
	_vZworktyp : "HR35",
	
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
		var oController = this;
		var oZdate = sap.ui.getCore().byId(oController.PAGEID + "_Zdate");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()-1);
		oZdate.setValue(dateFormat.format(prevDate));
		oController.onChangeIcontabbar();
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
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
	
//	onSelectNavigationList : function(oEvent, Flag){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList");
//		var oController = oView.getController();
//		
//		if(Flag && Flag == "X"){
//			var oSgnty = oController._ListCondJSonModel.getProperty("/Data/Sgnty");
//			var oAppty = oController._ListCondJSonModel.getProperty("/Data/Appty");
//		} else {
//			var oSgnty = oEvent.getSource().getKey().split("/")[0];
//			var oAppty = oEvent.getSource().getKey().split("/")[1];
//			
//			oController._ListCondJSonModel.setProperty("/Data/Sgnty", oSgnty);
//			oController._ListCondJSonModel.setProperty("/Data/Appty", oAppty);
//		}
//
//		var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Detail2");
//			oLayout.destroyContent();
//			
//		eval("oLayout.addContent(sap.ui.jsfragment('ZUI5_HR_Manpower2.fragment.Detail" + oEvent.getSource().getKey() + "', oController));");
//		
//		oController.onPressSearch(oController, oEvent.getSource().getKey());
//	},
//	
//	setTotalColorTable1 : function(){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList");
//		var oController = oView.getController();
//		$target = $('#ZUI5_HR_ManpowerList_Table1-table > tbody');
//		   
//		$target.each(function() {
//			$('tr', this).each(function(row) {
//				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
//				var Tltype = oTable.getModel().getProperty("/Data/"+ row+"/Tltype");
//				if(Tltype == "X") $(this).css("background-color","#66CCFF"); // 하늘색
//				else if(Tltype == "A") $(this).css("background-color","#78f081"); // 초록색
//				else $(this).css("background-color","#ffffff"); //흰색
//			});
//		});
//		
//	},
	 
	treeModel : function (arrayList, rootId) {
		  var rootNodes = [];
		  var traverse = function (nodes, item, index) {
		   if (nodes instanceof Array) {
		    return nodes.some(function (node) {
		     if (node.Groupid === item.Parentid) {
		      node.Val2 = node.Val2 || [];
		      return node.Val2.push(arrayList.splice(index, 1)[0]);
		     }
	
		    return traverse(node.Val2, item, index);
		    });
		   }
		  };
	
		 while (arrayList.length > 0) {
		   arrayList.some(function (item, index) {
			if (item.Parentid === rootId) {
		     return rootNodes.push(arrayList.splice(index, 1)[0]);
		    }
		   return traverse(rootNodes, item, index);
		   });
		  }

	 return rootNodes;
	 },
	 
	onPressSearch : function(oController, vsKey){
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table" + vsKey),
			Datas = { Data : []},
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"}),
			aFilters = [],
			oModel = sap.ui.getCore().getModel("ZHR_MANPOWER_SRV"),
			vZdate = sap.ui.getCore().byId(oController.PAGEID + "_Zdate").getDateValue(),
			errData = {};
		
		if(common.Common.checkNull(vZdate)) return; 
		
		aFilters.push(new sap.ui.model.Filter('Mantype', sap.ui.model.FilterOperator.EQ, vsKey));
		aFilters.push(new sap.ui.model.Filter('Zdate', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(vZdate)));
		
		function Search() {
			oModel.read("/StatisticsListSet", {
				async : false,
				filters : aFilters,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var oneData = data.results[i];
							delete oneData.__metadata;
							delete oneData.__proto__; 
							delete oneData.Zdate;
							if(oneData.Grouptx == "") oneData.Grouptx = oBundleText.getText("LABEL_2265");	// 2265:텍스트 없음
							oneData.Val2 = "";
							Datas.Data.push(oneData);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			if(vsKey == "1"){
				oController._TableJSonModel1.setData(Datas);
				var vTreeData = Datas.Data.slice();
				var vTemp = { Data : oController.treeModel(vTreeData , "00000000" )};
				console.log(vTemp);
				oTable.getModel().setData(vTemp);
				oController.colorRows();
				//oTable.getModel().refresh();
				oController.SmartSizing();
			}else{
				oTable.getModel().setData(Datas);
				oTable.setVisibleRowCount(Datas.Data.length);
			}

			if(vsKey == "6" || vsKey == "7"|| vsKey == "8" || 
			   vsKey == "11" || vsKey == "12"|| vsKey == "13"){
				oController.setGraph(oController, vsKey, Datas.Data);
			}
			
			oController.BusyDialog.close();
			
			if(errData.Error == "E") {
				sap.m.MessageBox.show(errData.ErrorMessage);
			}
		}
		oController.BusyDialog.open();
		setTimeout(Search, 100);			
	},
	
	setGraph : function(oController, vsKey, vData){
		var Datas = { Data : []},
			curDate = sap.ui.getCore().byId(oController.PAGEID + "_Zdate").getValue();
		
		var getQuarter = function(fVal){
			fVal = fVal * 1 ;
			if(fVal >= 1 && fVal <=3) return 1;
			else if(fVal >= 4 && fVal <=6) return 2;
			else if(fVal >= 7 && fVal <=9) return 3;
			else if(fVal >= 10 && fVal <=12) return 4;
		};
		   
		if(vsKey == "6" || vsKey == "11"){ //Year ( 4년기준 )
			for(var i = 0; i < 4; i++){
				var oneData = {};
				oneData.Object = ((curDate.substring(0,4) * 1)+(i-3)) + oBundleText.getText("LABEL_1623");	// 1623:년
				oneData.ObjectId = "" + ((curDate.substring(0,4) * 1)+(i-3));
				oneData.Ret01 = 0,	oneData.Ret02 = 0, oneData.Ret03 = 0;
				oneData.Ret04 = 0,	oneData.Ret05 = 0;
				Datas.Data.push(oneData);
			}
		}else if(vsKey == "7" || vsKey == "12"){
			var vQuarter = getQuarter(curDate.substring(5,7));
			for(var i = 3; i >= 0; i--){
				var oneData = {};
				if(vQuarter - i > 0){
					oneData.Object = curDate.substring(0,4) + "."  + (vQuarter - i ) + " " + oBundleText.getText("LABEL_0115");	// 115:분기
					oneData.ObjectId = "" + curDate.substring(0,4) + (vQuarter - i );
				}else{
					oneData.Object = ((curDate.substring(0,4) * 1) - 1) + "."  + (vQuarter - i + 4 ) + " " + oBundleText.getText("LABEL_0115");	// 115:분기
					oneData.ObjectId = "" +((curDate.substring(0,4) * 1) - 1) +  (vQuarter - i + 4 );
				} 
				
				oneData.Ret01 = 0,	oneData.Ret02 = 0, oneData.Ret03 = 0;
				oneData.Ret04 = 0,	oneData.Ret05 = 0;
				Datas.Data.push(oneData);
			}
		}else if(vsKey == "8" || vsKey == "13"){
			for(var i = 4; i > 0; i--){
				var oneData = {};
				var preData = new Date(curDate.substring(0,4), (curDate.substring(5,7) * 1) -i , 10);
				oneData.Object = preData.getFullYear() +"." + common.Common.addZero(preData.getMonth() + 1) + " 월";
				oneData.ObjectId = "" + preData.getFullYear() + common.Common.addZero(preData.getMonth() + 1);
				oneData.Ret01 = 0,	oneData.Ret02 = 0, oneData.Ret03 = 0;
				oneData.Ret04 = 0,	oneData.Ret05 = 0;
				Datas.Data.push(oneData);
			}
		}
		if(vData != ""){
			vData.forEach(function(element){
				Datas.Data.forEach(function(array){
					if(array.ObjectId == element.Groupid){
						switch(element.Subgrid){
							case "0": array.Ret01 = element.Mansum; break; // 임원
							case "1": array.Ret02 = element.Mansum; break; // 사무직
							case "2": array.Ret03 = element.Mansum; break; // 일반사무직
							case "3": array.Ret04 = element.Mansum; break; // 생산직
							case "9": array.Ret05 = element.Mansum; break; // 기타직
						}
					}
				})
			});
		}
		
		oController._VizJSonModel.setData(Datas);

	},
	onChangeIcontabbar : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList"),
			oController = oView.getController(), sKey;
		
		if(!oEvent) sKey = "1";
		else sKey = oEvent.getParameter("menuid");
		
		var vZdate = sap.ui.getCore().byId(oController.PAGEID + "_Zdate").getDateValue();
			oDetailTableLayout = sap.ui.getCore().byId(oController.PAGEID + "_DetailTableLayout");
			
		oTab = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
		
		if(common.Common.checkNull(sKey)) return;
		oTab.setSelectedKey(sKey);	
		oDetailTableLayout.destroyContent();
		
		oDetailTableLayout.addContent(sap.ui.jsfragment("ZUI5_HR_Manpower2.fragment.Detail" + sKey, oController));
		
		if(sKey == "6" || sKey == "7" || sKey == "8" || sKey == "11" || sKey == "12" || sKey == "13"){
			oDetailTableLayout.addContent(sap.ui.jsfragment("ZUI5_HR_Manpower2.fragment.VizForm", oController));
		}

		oController.setGraph(oController,sKey , "");
		
		if(common.Common.checkNull(vZdate)){
			return ;
		}
		oController.onPressSearch(oController, sKey);
	},
	
	
	onPressSearchBtn : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList"),
		oController = oView.getController(),
		sKey = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR").getSelectedKey(),
		vZdate = sap.ui.getCore().byId(oController.PAGEID + "_Zdate").getDateValue(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table" + sKey),
		Datas = { Data : []};
		oTable.getModel().setData(Datas);
	
		if(common.Common.checkNull(vZdate)){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2445"));	// 2445:기준일자를 입력하여 주십시오.
			return ;
		}
		
		oController.onPressSearch(oController, sKey);
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table1"),
			vCount = parseInt(( window.innerHeight-249 ) / 33) ;
		
		if(oTable) oTable.setVisibleRowCount(vCount);
	},
	
	colorRows : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
        var rowCount = oTable.getVisibleRowCount(); //number of visible rows
        var rowStart = oTable.getFirstVisibleRow(); //starting Row index
        var oModel = oTable.getModel();
        var currentRowContext;
        for (var i = 0; i < rowCount; i++) {
          currentRowContext = oTable.getContextByIndex(rowStart + i); //content
            // Remove Style class else it will overwrite
            oTable.getRows()[i].$().removeClass("PSNCSkyBackground");
            oTable.getRows()[i].$().removeClass("PSNCBlueBackground");
            
            var cellValue = oModel.getProperty("Tltype", currentRowContext); // Get Amount
            // Set Row color conditionally
            if (cellValue == "X") {
                oTable.getRows()[i].$().addClass("PSNCSkyBackground");
            }else if(cellValue == "A"){
            	oTable.getRows()[i].$().addClass("PSNCBlueBackground");
            }
        }
    },
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split(".");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Manpower2.ZUI5_HR_ManpowerList");
		var oController = oView.getController();
		var sKey = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR").getSelectedKey();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table" + sKey);
		var vData = common.Common.checkNull(oTable.getModel().getProperty("/Data")) ? [] : oTable.getModel().getProperty("/Data");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		var curDate = new Date();
		var vFilename = "Manpower Reqport";
		
		switch(sKey){
			case "1": vFilename += "-" + oBundleText.getText("LABEL_2124");	// 2124:조직별
			vData = oController._TableJSonModel1.getProperty("/Data");
			break;
			case "2": vFilename += "-" + oBundleText.getText("LABEL_2178"); break;	// 2178:직급별
			case "3": vFilename += "-" + oBundleText.getText("LABEL_2191"); break;	// 2191:직책별
			case "4": vFilename += "-" + oBundleText.getText("LABEL_1944"); break;	// 1944:연령별
			case "5": vFilename += "-" + oBundleText.getText("LABEL_1564"); break;	// 1564:근속별
			case "6": vFilename += "-" + oBundleText.getText("LABEL_1886") + "(Y)"; break;	// 1886:시점별
			case "7": vFilename += "-" + oBundleText.getText("LABEL_1886") + "(Q)"; break;	// 1886:시점별
			case "8": vFilename += "-" + oBundleText.getText("LABEL_1886") + "(M)"; break;	// 1886:시점별
			case "9": vFilename += "-" + oBundleText.getText("LABEL_2704"); break;	// 2704:등기이사_고문_파견직
			case "10": vFilename += "-" + oBundleText.getText("LABEL_2705"); break;	// 2705:파견_휴가_병가
			case "11": vFilename += "-" + oBundleText.getText("LABEL_2276") + "(Y)"; break;	// 2276:퇴직_시점별
			case "12": vFilename += "-" + oBundleText.getText("LABEL_2276") + "(Q)"; break;	// 2276:퇴직_시점별
			case "13": vFilename += "-" + oBundleText.getText("LABEL_2276") + "(M)"; break;	// 2276:퇴직_시점별
		}
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: vData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: vFilename + "-" + dateFormat.format(curDate) + ".xlsx"
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});