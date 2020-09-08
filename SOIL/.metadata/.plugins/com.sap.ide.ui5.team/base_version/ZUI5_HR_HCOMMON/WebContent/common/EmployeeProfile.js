jQuery.sap.declare("common.EmployeeProfile");
jQuery.sap.require("control.L2PTab");
jQuery.sap.require("control.L2PDataSet");
jQuery.sap.require("control.L2PEmpBasic");
jQuery.sap.require("sap.ui.ux3.NavigationItem");
jQuery.sap.require("sap.ui.ux3.NavigationBar");
jQuery.sap.registerModulePath("commonFragment", "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/fragment");

common.EmployeeProfile = {
	/** 
	* @memberOf common.EmployeeProfile
	*/	
		
	vTableHeader : [],	
	vTableType : "",
	
	vTableHeaderDatas : [],
	vTableContentDatas : {Data:[]},
		
	makeBasicProfile : function(oController, Pernr) {
		var OneData = {Data : {}};
		oController.HeaderModel.setData(OneData);
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		oModel.read("/EmpProfileHeaderNewSet/?$filter=Pernr eq '" + Pernr + "'"
				    + " and Accty eq '" + _gAuth + "'", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						OneData.Data = oData.results[0];
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		oController.HeaderModel.setData(OneData);
	},
	
	getTableDatas : function(oController, Pernr){
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		//if(!common.EmployeeProfile.vTableHeaderDatas.length) {
		common.EmployeeProfile.vTableHeaderDatas = [];
		oModel.read("/EmpProfileHeaderTabSet/?$filter=Pernr eq '" + Pernr + "' and Usrty eq '" + _gAuth + "'",
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					for(var i=0; i<oData.results.length; i++) {
						common.EmployeeProfile.vTableHeaderDatas.push(oData.results[i]);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		//}
		common.EmployeeProfile.vTableContentDatas = {Data:[]};
		oModel.read("/EmpProfileContentsTabSet/?$filter=Pernr eq '" + Pernr + "' and Usrty eq '" + _gAuth + "'",
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					for(var i=0; i<oData.results.length; i++) {
						common.EmployeeProfile.vTableContentDatas.Data.push(oData.results[i]);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},
	
	makeDetailInfo : function(oController, Pernr) {
		var oSectionLayout = sap.ui.getCore().byId(oController.PAGEID + "_SectionLayout");
		oSectionLayout.destroySections();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		var vPersonMenuInfo = [];
		oModel.read("/EmpProfileMenuSet/?$filter=Pernr eq '" + Pernr + "' and Usrty eq '" + _gAuth + "'", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							vPersonMenuInfo.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		if(vPersonMenuInfo.length < 1) return;
		
		common.EmployeeProfile.getTableDatas(oController, Pernr);
		
		oController._vMasterTabs = [];
		oController._vSubTabs = [];
		for(var i=0; i<vPersonMenuInfo.length; i++) {
			var oneData = {};
			if(vPersonMenuInfo[i].Menuc2 == "") {
				oneData.id = vPersonMenuInfo[i].Menuc1;
				oneData.label = vPersonMenuInfo[i].Menu1;
				oneData.childControl = vPersonMenuInfo[i].Child;
				oneData.merge = parseInt(vPersonMenuInfo[i].Merge);				
				
				oController._vMasterTabs.push(oneData);
			} else {
				oneData.id = vPersonMenuInfo[i].Menuc2;
				oneData.label = vPersonMenuInfo[i].Menu2;
				oneData.parent = vPersonMenuInfo[i].Menuc1;
				oneData.childControl = vPersonMenuInfo[i].Child;
				oneData.merge = parseInt(vPersonMenuInfo[i].Merge);
				
				oController._vSubTabs.push(oneData);
			}
		}
		
		for(var i=0; i<oController._vMasterTabs.length; i++) {
			var oSection = new sap.uxap.ObjectPageSection({ title : oController._vMasterTabs[i].label , titleLevel : "H6"});
			for(var j = 0; j < oController._vSubTabs.length ; j++){
				if(oController._vMasterTabs[i].id == oController._vSubTabs[j].parent){
					var oContent = null;
					switch(oController._vSubTabs[j].id) {
						case "BASE" :
							oContent = common.EmployeeProfile.makeBase(oController, Pernr);
							break;
						case "PLST" :
							oContent = common.EmployeeProfile.makePay(oController, Pernr);
							break;
						case "PMST" :
							oContent = common.EmployeeProfile.makePayList(oController, Pernr);
							break;
						case "0105" :
							oContent = common.EmployeeProfile.makeContact(oController, Pernr);
							break;
						default :
							oContent = common.EmployeeProfile.makeTable(oController, Pernr, oController._vSubTabs[j].id);
					}
					
					var oSubSection = new sap.uxap.ObjectPageSubSection({
						title : oController._vSubTabs[j].label 
					});	
					
					if(oController._vSubTabs[j].id == "0105"){
						oSubSection.addAction(new sap.m.Button({icon : "sap-icon://edit",
															    press : oController.onPressModifyButton,
															    text : "변경"
						}));
					}else if(oController._vSubTabs[j].id == "0021"){
						oSubSection.addAction(new sap.m.Button({icon : "sap-icon://edit",
						    press : oController.onPressFamilyModifyButton,
						    text : "등록"
						}));
						
						oSubSection.addAction(new sap.m.Button({icon : "sap-icon://edit",
						    press : oController.onPressFamilyModifyButton,
						    text : "변경"
						}));
					}
					
					oSubSection.setMode("Collapsed");
					oSubSection.addBlock(oContent);
					oSection.addSubSection(oSubSection);
				}
			}
			oSectionLayout.addSection(oSection);
		}
	},

	makeBase : function(oController, vEncid) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var oJSonModel = new sap.ui.model.json.JSONModel();
		var oDatas = { Data : [] };
		
		oModel.read("/EmpProfileBasicInfoSet?$filter=Encid eq '" + encodeURIComponent(vEncid) + "'", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						var oneData = oData.results[0];
						if(oneData.Retdueda) oneData.Retdueda = dateFormat.format(oneData.Retdueda);
						if(oneData.Retda) oneData.Retda = dateFormat.format(oneData.Retda);
						oDatas.Data.push(oneData);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		var oContent = sap.ui.jsfragment("commonFragment.EmployeeProfileBase", oController);
		oJSonModel.setData(oDatas);
		oContent.setModel(oJSonModel);
		
		return oContent;
	},
	
	makePay : function(oController, Pernr) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var oJSonModel = new sap.ui.model.json.JSONModel();
		var oDatas = { Data : [] };
		
		oModel.read("/EmpProfileBasicPaySet?$filter=Pernr eq '" + Pernr + "'", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						var oneData = oData.results[0];
						
						oneData.Srvda = dateFormat.format(oneData.Srvda);
						oneData.Holda = dateFormat.format(oneData.Holda);
						oneData.Recda = dateFormat.format(oneData.Recda);
						
						if(oneData.Nappr > 0)
							oneData.Nappr = common.Common.numberWithCommas(oneData.Nappr);
						else
							oneData.Nappr = "";

						oDatas.Data.push(oneData);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		var oContent = sap.ui.jsfragment("commonFragment.EmployeeProfilePay", oController);
		oJSonModel.setData(oDatas);
		oContent.setModel(oJSonModel);
		
		return oContent;
	},
	
	makePayList : function(oController, Pernr) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");

		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({
				     text : "{Lgart}" , 
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
				     text : "{Lgtxt}" , 
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
				     text : "{Betrg}" , 
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
				     text : "{Notes}" , 
				}).addStyleClass("L2PFontFamily")
			]
		});
		
		var oTable = new sap.m.Table({
			inset : false,
			mode : "None",
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : [
				new sap.m.Column({
		        	  header: new sap.m.Label({text : "임금유형" }).addStyleClass("L2PFontFamily"),
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : "20%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : "임금유형명" }).addStyleClass("L2PFontFamily"),
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Left,
		        	  styleClass : "cellBorderRight",
		        	  width : "30%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : "금액", width : "100%", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Right,
		        	  styleClass : "cellBorderRight",
		        	  width : "20%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : "비고" }).addStyleClass("L2PFontFamily"),
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Left,
		        	  styleClass : "cellBorderRight",
		        	  width : "30%",
		        	  minScreenWidth: "tablet"
		        })
			]
		}).addStyleClass("L2PMTableTopBorder");
		
		var oJSonModel = new sap.ui.model.json.JSONModel();
		var oDatas = { Data : [] };
		oModel.read("/EmpProfileBAsicPayListSet?$filter=Pernr eq '" + Pernr + "'", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var oneData = oData.results[i];
							if(oneData.Betrg > 0)
								oneData.Betrg = common.Common.numberWithCommas(oneData.Betrg);
							else
								oneData.Betrg = "";
							oDatas.Data.push(oneData);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		oJSonModel.setData(oDatas);
		oTable.setModel(oJSonModel);
		oTable.bindItems("/Data", oColumnList);
		
		return oTable ;		
	},
	
	makeContact : function(oController, Pernr){
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var oJSonModel = new sap.ui.model.json.JSONModel();
		var oDatas = { Data : {} };
		var vData = common.EmployeeProfile.vTableContentDatas.Data ;
		for(var i = 0 ; i < vData.length ; i++){
			if(vData[i].Menuc == "0105"){
				oDatas.Data = vData[i];
				break;
			}
		}
		var oContent = sap.ui.jsfragment("commonFragment.EmployeeProfileContact", oController);
		oJSonModel.setData(oDatas);
		oContent.setModel(oJSonModel);
		
		return oContent;
		
	},
	
	makeTable : function(oController, Pernr, _vMenuId){
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		var initdata = {};
		
		var oColumns = [];
		
		var addZero = function(d) {
			if(d < 10) return "0" + d;
			else return "" + d;
		};
		
		var oColumnList = new sap.m.ColumnListItem({});  
		
		// 가족은 변경이 가능하도록 선택 버튼 추가
		if(_vMenuId == "0021") oColumnList.setSelected(true);
		
		var idx = 0;
		for(var i=0; i<common.EmployeeProfile.vTableHeaderDatas.length; i++) {
		  if(common.EmployeeProfile.vTableHeaderDatas[i].Menuc != _vMenuId) continue;
		  idx++;
		  var vHearder = common.EmployeeProfile.vTableHeaderDatas[i];
		  
			var cellWidth = parseInt(vHearder.Width);
			if(cellWidth > 0) cellWidth += "px";
			else cellWidth = "";
			
			var cellAlign = "";
			if(vHearder.Align) cellAlign = vHearder.Align;
			else cellAlign = "Center";
			
			if(idx == 1){
				oColumns.push( new sap.m.Column({
		        	  header: new sap.m.Label({text : vHearder.Header }).addStyleClass("L2PFontFamily"),
		        	  demandPopin: true,
		        	  hAlign : cellAlign,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : cellWidth,
		        	  minScreenWidth: "tablet"}));
			}else{
				oColumns.push( new sap.m.Column({
		        	  header: new sap.m.Label({text : vHearder.Header }).addStyleClass("L2PFontFamily"),
		        	  demandPopin: true,
		        	  hAlign : cellAlign,
		        	  styleClass : "cellBorderRight",
		        	  width : cellWidth,
		        	  minScreenWidth: "tablet"}));
			}
			
			oColumnList.addCell(new sap.m.Text({
			     text : "{Value" + addZero(idx)  + "}" , 
			}).addStyleClass("L2PFontFamily")) ;	
		}
	
		var oTable = new sap.m.Table({
			inset : false,
			mode : "None",
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : oColumns
		}).addStyleClass("L2PMTableTopBorder");
		
		if(oColumns.length < 1) return oTable ;
		
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oTable.setModel(oJSonModel);
		oTable.bindItems("/Data", oColumnList);
		oJSonModel.setData(common.EmployeeProfile.vTableContentDatas);
		oTable.getBinding('items').filter([new sap.ui.model.Filter("Menuc", sap.ui.model.FilterOperator.EQ, _vMenuId)]);
	
		return oTable ;		
	},
	
	onFullScreen : function(oEvent){
		var oController = oEvent.getSource().getCustomData()[0].getValue();
		var oTable = oEvent.getSource().getCustomData()[1].getValue();

		var items = oTable.getItems();
		var cols = oTable.getColumns();
		var oModel = oTable.getModel();
		
		var oFullTableLayout = sap.ui.getCore().byId(oController.PAGEID + "_FullTableLayout");
		oFullTableLayout.destroyContent();
		oFullTableLayout.addContent(vCopyTable);
	},
};

function EmpolyeeProfileTable1_OnSearchEnd(result) {
//	if(common.EmployeeProfile.vTableType != "8") {
//		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
//			if(common.EmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.EmployeeProfile.vTableHeader[i].Width) > 0) {
//				EmpolyeeProfileTable1.SetColWidth(i, parseInt(common.EmployeeProfile.vTableHeader[i].Width));
//			}
//		}
//		
//		EmpolyeeProfileTable1.FitColWidth();
//	} else {
//		EmpolyeeProfileTable1.FitSize(1, 1);
//		
//		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
//			if(common.EmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.EmployeeProfile.vTableHeader[i].Width) > 0) {
//				EmpolyeeProfileTable1.SetColWidth(i, parseInt(common.EmployeeProfile.vTableHeader[i].Width));
//			}
//		}
//	}
//	
//	EmpolyeeProfileTable1.SetCellFont("FontSize", EmpolyeeProfileTable1.HeaderRows(), "Value01", EmpolyeeProfileTable1.RowCount() + EmpolyeeProfileTable1.HeaderRows(), EmpolyeeProfileTable1.LastCol(), 12);
//	EmpolyeeProfileTable1.SetCellFont("FontName", EmpolyeeProfileTable1.HeaderRows(), "Value01", EmpolyeeProfileTable1.RowCount() + EmpolyeeProfileTable1.HeaderRows(), EmpolyeeProfileTable1.LastCol(), "Malgun Gothic");
//	
}

function EmpolyeeProfileTable1_OnResize(Width, Height) {
//	if(common.EmployeeProfile.vTableType != "8") {
//		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
//			if(common.EmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.EmployeeProfile.vTableHeader[i].Width) > 0) {
//				EmpolyeeProfileTable1.SetColWidth(i, parseInt(common.EmployeeProfile.vTableHeader[i].Width));
//			}
//		}
//		
//		EmpolyeeProfileTable1.FitColWidth();
//	} else {
//		EmpolyeeProfileTable1.FitSize(1, 1);
//		
//		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
//			if(common.EmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.EmployeeProfile.vTableHeader[i].Width) > 0) {
//				EmpolyeeProfileTable1.SetColWidth(i, parseInt(common.EmployeeProfile.vTableHeader[i].Width));
//			}
//		}
//	}
	//new sap.ui.model.Filter("PROPERTY", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId('ID OF INPUT FIELD FROM WHICH YOU WANT TO PICK UP FILTER VALUE').getValue());
}
