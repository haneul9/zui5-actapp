jQuery.sap.declare("ZUI5_HR_Portal.common.TotalRewardController");

ZUI5_HR_Portal.common.TotalRewardController = {
	/** 
	* @memberOf common.TotalRewardController
	*/	
	onOpenDashboard : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		if(!oController._TotalRewardDialog) {
			oController._TotalRewardDialog = sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.TotalRewardDialog", oController);
			oView.addDependent(oController._TotalRewardDialog);
		}
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		
		oTable.setVisible(true);
		oTable2.setVisible(false);
		oTable3.setVisible(false);
		
		oTable.setVisibleRowCount(1);
		oTable2.setVisibleRowCount(1);
		oTable3.setVisibleRowCount(1); 
		
		oTable.getModel().setData({Data : [] });
		oTable2.getModel().setData({Data : [] });
		oTable3.getModel().setData({Data : [] });
		
		var oTotalRewardFilter = sap.ui.getCore().byId(oController.PAGEID + "_TotalRewardFilter");
		var vAuth = oController.getCurrentAuth(oController);
		oTotalRewardFilter.setVisible(vAuth == "M" || vAuth == "H" ? true : false);
		
	    var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
	    var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
	    var vEncid = vEmpLoginInfo[0].Encid;
	    var curDate = new Date();
	 	var vData = { Data : { Encid : vEncid,  Zyear : curDate.getFullYear()}};
	 	var vDetailData = oController._DetailJSonModel.getProperty("/Data");
		
		oController._ListCondJSonModel.setData(vData);
		oController._DetailJSonModel.setData({Data : {Encid : vDetailData.Encid, Ename : vDetailData.Ename, Photo : vDetailData.Photo}}); 
		oController._TotalRewardDialog.open();
		ZUI5_HR_Portal.common.TotalRewardController.onPressSearch();
	},
		// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList"),
			oController = oView.getController();	
		var vData = oController._DetailJSonModel.getData();
		var oModel = sap.ui.getCore().getModel("ZHR_TOTALREWARD_SRV"),
			aFilters = [];
		
//			// 테이블 sort, filter 제거
//			for(var i=0; i<oColumns.length; i++){
//				oColumns[i].setSorted(false);
//				oColumns[i].setFiltered(false);
//			}
		
		
		var SeachCon = oController._ListCondJSonModel.getProperty("/Data");
		if(common.Common.checkNull(SeachCon.Encid)) {
			sap.m.MessageBox.show("조회할 사번을 입력하세요.", {});
			return;
		}
	
		if(common.Common.checkNull(SeachCon.Zyear)) {
			sap.m.MessageBox.alert("조회연도를 입력하세요.", {});
			return;
		}
		
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SeachCon.Encid));
		aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, SeachCon.Zyear));
		
		
		var introText = vData.Data.introText,
			vEncid = vData.Data.Encid,
			vEname = vData.Data.Ename,
			vPhoto = vData.Data.Photo,
			errData = {};
		
		function fIcon(fId, fVal){
			var oControl = sap.ui.getCore().byId(oController.PAGEID +"_" + fId);
			
			oControl.removeStyleClass("FontRed");
			oControl.removeStyleClass("FontBlue");
			oControl.removeStyleClass("FontBlack");
			
			if(fVal == "="){
				oControl.addStyleClass("FontBlack");
				return "-";
			}else if(fVal == "+"){
				oControl.addStyleClass("FontRed");
				return "▲";
			}else if(fVal == "-"){
				oControl.addStyleClass("FontBlue");
				return "▼";
			}
		}
		
		function Search() {
			var Datas = {Data : {}},
				OneData = {},
				totalSum = 0,
				vIdx = 1;
			
			oModel.read("/PerRewardSummarySet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						OneData = data.results[0];
						OneData.Total = common.Common.numberWithCommas(OneData.Total);
						OneData.Benef = "￦ " +common.Common.numberWithCommas(OneData.Benef);
						OneData.BenefDif = common.Common.numberWithCommas(OneData.BenefDif);
						OneData.Salry = "￦ " +common.Common.numberWithCommas(OneData.Salry);
						OneData.SalryDif = common.Common.numberWithCommas(OneData.SalryDif);
						OneData.Edurg = "￦ " +common.Common.numberWithCommas(OneData.Edurg);
						OneData.EdurgDif = common.Common.numberWithCommas(OneData.EdurgDif);
						OneData.Wlbrg = "￦ " +common.Common.numberWithCommas(OneData.Wlbrg);
						OneData.WlbrgDif = common.Common.numberWithCommas(OneData.WlbrgDif);
						OneData.CIcon1 = fIcon("CIcon1", OneData.SalrySign);
						OneData.CIcon2 = fIcon("CIcon2", OneData.BenefSign);
						OneData.CIcon3 = fIcon("CIcon3", OneData.EdurgSign);
						OneData.CIcon4 = fIcon("CIcon4", OneData.WlbrgSign);
						
						OneData.summary = "<div>" + 
						"<div style=\"font-size:18px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important;font-weight : bold;color : #333333;margin-top:-5px\"> '"+ OneData.Ename   +"'님의 </div>" +
				        "<div style=\"font-size:18px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important; color : #333333;font-weight : bold;\"> 노고에 감사 드립니다.</div>"+
				        "<div style=\"font-size:14px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important;color : #333333;padding-top:20px;\">'" + OneData.Ename +" 님의 " + OneData.Zyear + "년 총 보상은 </div>"+
				        "<div style=\"font-size:14px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important;color : #333333;\"> ￦ </div>"+
				        "<div style=\"font-size:36px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important;color : #333333;font-weight : bold;margin-top:-7px\"> \ " + OneData.Total + "</div>" +
						"</div>";
						OneData.introText = introText;
						OneData.Encid = vEncid;
						OneData.Ename = vEname;
						OneData.Photo = vPhoto;
						Datas.Data = OneData;
					}
				},
				
				
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
		
			oController.BusyDialog.close();
			oController._DetailJSonModel.setData(Datas);
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
				return ;
			}
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	onClick1 : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		oBottomText = sap.ui.getCore().byId(oController.PAGEID + "_BottomText");
		oTable.setVisible(true);
		oTable2.setVisible(false);
		oTable3.setVisible(false);
		oBottomText.setVisible(false);
		ZUI5_HR_Portal.common.TotalRewardController.setTable(oController, oTable, "1000");
	},
	
	onClick2 : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		oBottomText = sap.ui.getCore().byId(oController.PAGEID + "_BottomText");
		oTable.setVisible(true);
		oTable2.setVisible(false);
		oTable3.setVisible(false);
		oBottomText.setVisible(false);
		ZUI5_HR_Portal.common.TotalRewardController.setTable(oController, oTable, "2000");
	},
	
	onClick3 : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		oBottomText = sap.ui.getCore().byId(oController.PAGEID + "_BottomText");
		oTable.setVisible(false);
		oTable2.setVisible(true);
		oTable3.setVisible(false);
		oBottomText.setVisible(false);
		ZUI5_HR_Portal.common.TotalRewardController.setTable(oController, oTable2, "3000");
	},
	
	onClick4 : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		oBottomText = sap.ui.getCore().byId(oController.PAGEID + "_BottomText");
		oTable.setVisible(false);
		oTable2.setVisible(false);
		oTable3.setVisible(true);
		oBottomText.setVisible(true);
		ZUI5_HR_Portal.common.TotalRewardController.setTable(oController, oTable3, "4000");
	},
	
	setTable : function(oController, oTable, vKey){
		var oModel = sap.ui.getCore().getModel("ZHR_TOTALREWARD_SRV"),
		oTableModel = oTable.getModel(),
		aFilters = [];
		var oColumns = oTable.getColumns(), errData = {};
		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var SeachCon = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(SeachCon.Encid)) {
			return;
		}
	
		if(common.Common.checkNull(SeachCon.Zyear)) {
			return;
		}
		
		aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SeachCon.Encid));
		aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, SeachCon.Zyear));
		aFilters.push(new sap.ui.model.Filter('Pygrp', sap.ui.model.FilterOperator.EQ, vKey));
		
		function Search() {
			var Datas = {Data : []},
				OneData = {};
			
			oModel.read("/PerRewardDetailSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0; i <data.results.length; i++){
							OneData = data.results[i];
							if(vKey == "4000"){
								OneData.Anzhl = (OneData.Anzhl * 1 ).toFixed(1);
								OneData.Rezhl = (OneData.Rezhl * 1 ).toFixed(1);
								if(i!=data.results.length-1){
									OneData.Betrg = OneData.Kverb;
								}		
							}
							Datas.Data.push(OneData);
						}
					}
				},
				
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController.BusyDialog.close();
			oTableModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length);
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
				return ;
			}
		}
	//	
		oController.BusyDialog.open();
		setTimeout(Search, 100);
		
		
	//	oDetailLayout.addRow(oRow);
	},
	
	onOpenDashboard2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		var oController = oView.getController();
		if(!oController._TotalRewardDialog2) {
			oController._TotalRewardDialog2 = sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.TotalRewardDialog2", oController);
			oView.addDependent(oController._TotalRewardDialog2);
		}
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TotalTable2");
		oTable.getModel().setData({Data : [] });
		
	    var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
	    var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
	    var vEncid = vEmpLoginInfo[0].Encid;
	    var vAuth = oController.getCurrentAuth(oController);  
	    var curDate = new Date();
	    var todate = curDate.getFullYear() + ( curDate.getMonth()+1 < 10 ? "0" + (curDate.getMonth()+1) : "" + (curDate.getMonth() + 1));  
		var vData = { Data : { Prgrp : 0, Orgeh : vEmpLoginInfo[0].Orgeh, Orgtx:vEmpLoginInfo[0].Stext, Autho : vAuth,  Zyymm : todate}};
		var vDetailData = oController._DetailJSonModel.getProperty("/Data");
		
		oController._ListCondJSonModel.setData(vData);
		oController._DetailJSonModel.setData({Data : {Encid : vDetailData.Encid, Ename : vDetailData.Ename, Photo : vDetailData.Photo}}); 
		oController._TotalRewardDialog2.open();
		ZUI5_HR_Portal.common.TotalRewardController.onPressSearch2();
	},
	
	colorRows : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TotalTable2");
        var rowCount = oTable.getVisibleRowCount(); //number of visible rows
        var rowStart = oTable.getFirstVisibleRow(); //starting Row index
        var oModel = oTable.getModel();
        var currentRowContext;
        for (var i = 0; i < rowCount; i++) {
          currentRowContext = oTable.getContextByIndex(rowStart + i); //content
            // Remove Style class else it will overwrite
            oTable.getRows()[i].$().removeClass("totalreward1");
            oTable.getRows()[i].$().removeClass("totalreward2");
            
            var cellValue = oModel.getProperty("Flag", currentRowContext); // Get Amount
            // Set Row color conditionally
            if (cellValue == "T") {
                oTable.getRows()[i].$().addClass("totalreward1");
            }else if(cellValue == "A"){
            	oTable.getRows()[i].$().addClass("totalreward2");
            }
        }
    },
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
	
	// 리스트 조회
	onPressSearch2 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList"),
			oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TotalTable2"),
			oTableModel = oTable.getModel(),
			oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh"),
			vOrgeh = "";
			
		var vData = oController._DetailJSonModel.getData();
		var oModel = sap.ui.getCore().getModel("ZHR_TOTALREWARD_SRV"),
			aFilters = [];
		
		var oColumns = oTable.getColumns();
		
		var vPernr = vData.Data.Pernr;
		var vEname = vData.Data.Ename;
		var vPhoto = vData.Data.Photo;
		
		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		
		var SeachCon = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(SeachCon.Zyymm)) {
			sap.m.MessageBox.show("조회연도를 입력하세요.", {});
			return;
		}
		
		if(oOrgeh.getCustomData()[0]){
			vOrgeh = oOrgeh.getCustomData()[0].getValue();
		}
//		if(common.Common.checkNull(vOrgeh)) {
//			sap.m.MessageBox.show("부서를 입력하세요.", {});
//			return;
//		}
		
		aFilters.push(new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, vOrgeh));
		aFilters.push(new sap.ui.model.Filter('Zyymm', sap.ui.model.FilterOperator.EQ, SeachCon.Zyymm));
		aFilters.push(new sap.ui.model.Filter('Prgrp', sap.ui.model.FilterOperator.EQ, SeachCon.Prgrp == 0 ? "A" : "B"));
//		aFilters.push(new sap.ui.model.Filter('Prgrp', sap.ui.model.FilterOperator.EQ, "A"));
		
		function Search() {
			var Datas = {Data : []},
				OneData = {},
				vRootid = "",
				errData = {};
				
			oModel.read("/OrgRewardListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i =0; i < data.results.length; i++){
							var oneData = data.results[i];
							delete oneData.__metadata;
							delete oneData.__proto__; 
							oneData.Val2 = "";
							oneData.Inwon = common.Common.numberWithCommas(oneData.Inwon);
							oneData.Salry = common.Common.numberWithCommas(oneData.Salry);
							oneData.SalryAvg = common.Common.numberWithCommas(oneData.SalryAvg);
							oneData.Total = common.Common.numberWithCommas(oneData.Total);
							oneData.TotalAvg = common.Common.numberWithCommas(oneData.TotalAvg);
							oneData.Benef = common.Common.numberWithCommas(oneData.Benef);
							oneData.BenefAvg = common.Common.numberWithCommas(oneData.BenefAvg);
							oneData.Wlbrg = common.Common.numberWithCommas(oneData.Wlbrg);
							oneData.WlbrgAvg = common.Common.numberWithCommas(oneData.WlbrgAvg);
							oneData.Edurg = common.Common.numberWithCommas(oneData.Edurg);
							oneData.EdurgAvg = common.Common.numberWithCommas(oneData.EdurgAvg);
							
							oneData.Pernr = vPernr;
							oneData.Ename = vEname;
							oneData.Photo = vPhoto;
							Datas.Data.push(oneData);
							if(i==0) vRootid = oneData.Parentid;
						}
					}
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
				return ;
			}
			
			oTableModel.setData(Datas);
			var vTreeData = Datas.Data.slice();
			var vTemp = { Data : ZUI5_HR_Portal.common.TotalRewardController.treeModel(vTreeData , vRootid )};
			oTable.getModel().setData(vTemp);
			ZUI5_HR_Portal.common.TotalRewardController.colorRows();
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			oController.SmartSizing();
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	
};
