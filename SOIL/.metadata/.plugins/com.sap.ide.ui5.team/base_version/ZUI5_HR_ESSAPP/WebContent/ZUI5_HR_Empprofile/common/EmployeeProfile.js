jQuery.sap.declare("ZUI5_HR_Empprofile.common.EmployeeProfile");
jQuery.sap.require("control.L2PTab");
jQuery.sap.require("control.L2PDataSet");
jQuery.sap.require("control.L2PEmpBasic");
jQuery.sap.require("sap.ui.ux3.NavigationItem");
jQuery.sap.require("sap.ui.ux3.NavigationBar");
//jQuery.sap.registerModulePath("commonFragment", "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/fragment");

ZUI5_HR_Empprofile.common.EmployeeProfile = {
	/** 
	* @memberOf common.EmployeeProfile
	*/	
		
	vTableHeader : [],	
	vTableType : "",
	
	vTableHeaderDatas : [],
	vTableContentDatas : {Data:[]},
		
	makeBasicProfile : function(oController, Encid) {
		var OneData = {Data : {}};
		oController.HeaderModel.setData(OneData);
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		oModel.read("/EmpProfileHeaderNewSet/?$filter=Encid eq '" + encodeURIComponent(Encid) + "'"
				    + " and Accty eq '" + _gAuth + "' and Langu eq '" + _gLangu + "'", 
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
	
	getTableDatas : function(oController, Encid){
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		//if(!common.EmployeeProfile.vTableHeaderDatas.length) {
		ZUI5_HR_Empprofile.common.EmployeeProfile.vTableHeaderDatas = [];
		oModel.read("/EmpProfileHeaderTabSet/?$filter=Encid eq '" + encodeURIComponent(Encid) + "' and Usrty eq '" + _gAuth + "' and Langu eq '" + _gLangu + "'",
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					for(var i=0; i<oData.results.length; i++) {
						ZUI5_HR_Empprofile.common.EmployeeProfile.vTableHeaderDatas.push(oData.results[i]);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		//}
		ZUI5_HR_Empprofile.common.EmployeeProfile.vTableContentDatas = {Data:[]};
		oModel.read("/EmpProfileContentsTabSet/?$filter=Encid eq '" + encodeURIComponent(Encid) + "' and Usrty eq '" + _gAuth + "' and Langu eq '" + _gLangu + "'",
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					for(var i=0; i<oData.results.length; i++) {
						ZUI5_HR_Empprofile.common.EmployeeProfile.vTableContentDatas.Data.push(oData.results[i]);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},
	
	makeDetailInfo : function(oController, Encid) {
		var oSectionLayout = sap.ui.getCore().byId(oController.PAGEID + "_SectionLayout");
		oSectionLayout.destroySections();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		var vPersonMenuInfo = [];
		oModel.read("/EmpProfileMenuSet/?$filter=Encid eq '" + encodeURIComponent(Encid) + "' and Usrty eq '" + _gAuth + "' and Langu eq '" + _gLangu + "'", 
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
		
		ZUI5_HR_Empprofile.common.EmployeeProfile.getTableDatas(oController, Encid);
		
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
		var displayYn = false;
		if(_gAuth == "E" || _gAuth == "H") displayYn = true;
		
		for(var i=0; i<oController._vMasterTabs.length; i++) {
			var oSection = new sap.uxap.ObjectPageSection(oController.PAGEID +"_HeaderSection_"+i,{ title : oController._vMasterTabs[i].label , titleLevel : "H6"});
			for(var j = 0; j < oController._vSubTabs.length ; j++){
				if(oController._vMasterTabs[i].id == oController._vSubTabs[j].parent){
					var oContent = null;
					switch(oController._vSubTabs[j].id) {
						case "BASE" :
							oContent = ZUI5_HR_Empprofile.common.EmployeeProfile.makeBase(oController, Encid);
							break;
						case "PLST" :
							oContent = ZUI5_HR_Empprofile.common.EmployeeProfile.makePay(oController, Encid);
							break;
						case "PMST" :
							oContent = ZUI5_HR_Empprofile.common.EmployeeProfile.makePayList(oController, Encid);
							break;
						case "0105" :
							oContent = ZUI5_HR_Empprofile.common.EmployeeProfile.makeContact(oController, Encid);
							break;
						default :
							oContent = ZUI5_HR_Empprofile.common.EmployeeProfile.makeTable(oController, Encid, oController._vSubTabs[j].id);
					}
					
					var oSubSection = new sap.uxap.ObjectPageSubSection({
						title : oController._vSubTabs[j].label 
					});	
					
					if(oController._vSubTabs[j].id == "0105"){
						oSubSection.addAction(new sap.m.Button({press : oController.onPressModifyButton,
															    text : oBundleText.getText("LABEL_0751"),	// 751:변경
															    type : "Ghost",
															    visible : displayYn
						}));
					}else if(oController._vSubTabs[j].id == "0021"){
						oSubSection.addAction(new sap.m.Button({
						    press : oController.onPressFamilyCreate,
						    text : oBundleText.getText("LABEL_0023"),	// 23:등록
						    type : "Ghost",
						    visible : displayYn
						}));
						
						oSubSection.addAction(new sap.m.Button({
						    press : oController.onPressFamilyModify,
						    text : oBundleText.getText("LABEL_0751"),	// 751:변경
						    type : "Ghost",
						    visible : displayYn
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

	makeBase : function(oController, Encid) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var oJSonModel = new sap.ui.model.json.JSONModel();
		var oDatas = { Data : {} };
		
		oModel.read("/EmpProfileBasicInfoSet?$filter=Encid eq '" + encodeURIComponent(Encid) + "' and Langu eq '" + _gLangu + "'", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						var oneData = oData.results[0];
						if(oneData.Retdueda) oneData.Retdueda = dateFormat.format(oneData.Retdueda);
						if(oneData.Retda) oneData.Retda = dateFormat.format(oneData.Retda);
						oDatas.Data = oneData;
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		var oContent = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfileBase", oController);
		oJSonModel.setData(oDatas);
		oContent.setModel(oJSonModel);
		
		return oContent;
	},
	
	makePay : function(oController, Encid) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var oJSonModel = new sap.ui.model.json.JSONModel();
		var oDatas = { Data : [] };
		
		oModel.read("/EmpProfileBasicPaySet?$filter=Encid eq '" + encodeURIComponent(Encid) + "'", 
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
		
		var oContent = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfilePay", oController);
		oJSonModel.setData(oDatas);
		oContent.setModel(oJSonModel);
		
		return oContent;
	},
	
	makePayList : function(oController, Encid) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");

		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({
				     text : "{Lgart}" , 
				}).addStyleClass("FontFamily"),
				new sap.m.Text({
				     text : "{Lgtxt}" , 
				}).addStyleClass("FontFamily"),
				new sap.m.Text({
				     text : "{Betrg}" , 
				}).addStyleClass("FontFamily"),
				new sap.m.Text({
				     text : "{Notes}" , 
				}).addStyleClass("FontFamily")
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
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_2069") }).addStyleClass("FontFamilyBold"),	// 2069:임금유형
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Left,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : "20%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_2070") }).addStyleClass("FontFamilyBold"),	// 2070:임금유형명
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Left,
		        	  styleClass : "cellBorderRight",
		        	  width : "30%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0550"), width : "100%", textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 550:금액
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Right,
		        	  styleClass : "cellBorderRight",
		        	  width : "20%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0096") }).addStyleClass("FontFamilyBold"),	// 96:비고
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
		oModel.read("/EmpProfileBasicPayListSet?$filter=Encid eq '" + encodeURIComponent(Encid) + "'", 
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
	
	makeContact : function(oController, Encid){
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var oJSonModel = new sap.ui.model.json.JSONModel();
		var oDatas = { Data : {} };
		var vData = ZUI5_HR_Empprofile.common.EmployeeProfile.vTableContentDatas.Data ;
		for(var i = 0 ; i < vData.length ; i++){
			if(vData[i].Menuc == "0105"){
				oDatas.Data = vData[i];
				break;
			}
		}
		var oContent = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfileContact", oController);
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
		
		var idx = 0;
		var vMenuIdData = [];
		
		for(var i=0; i< ZUI5_HR_Empprofile.common.EmployeeProfile.vTableHeaderDatas.length; i++) {
			  if(ZUI5_HR_Empprofile.common.EmployeeProfile.vTableHeaderDatas[i].Menuc == _vMenuId){
				  vMenuIdData.push(ZUI5_HR_Empprofile.common.EmployeeProfile.vTableHeaderDatas[i]);
			  }
		}
		
		for(var i=0; i< vMenuIdData.length; i++) {
		    var vHearder = vMenuIdData[i];
		    var cellWidth = parseInt(vHearder.Width);
			if(cellWidth > 0) cellWidth += "px";
			else cellWidth = "";
			
			var cellAlign = "";
			if(vHearder.Align) cellAlign = vHearder.Align;
			else cellAlign = "Center";
			
			if(i == 0){
				oColumns.push( new sap.m.Column({
		        	  header: new sap.m.Label({text : vHearder.Header }).addStyleClass("FontFamilyBold"),
		        	  demandPopin: true,
		        	  hAlign : cellAlign,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : cellWidth,
		        	  minScreenWidth: "tablet"}));
			}else if(i == vMenuIdData.length-1){
				oColumns.push( new sap.m.Column({
		        	  header: new sap.m.Label({text : vHearder.Header }).addStyleClass("FontFamilyBold"),
		        	  demandPopin: true,
		        	  styleClass : "cellBorderRight",
		        	  hAlign : cellAlign,
		        	  width : cellWidth,
		        	  minScreenWidth: "tablet"}));
			}else{
				oColumns.push( new sap.m.Column({
		        	  header: new sap.m.Label({text : vHearder.Header }).addStyleClass("FontFamilyBold"),
		        	  demandPopin: true,
		        	  hAlign : cellAlign,
		        	  styleClass : "cellBorderRight",
		        	  width : cellWidth,
		        	  minScreenWidth: "tablet"}));
			}
			
			if(vHearder.Fldty == "55"){
				oColumnList.addCell(new sap.m.Button({
					text: oBundleText.getText("LABEL_2208"),	// 2208:첨부파일
					visible : { path:"Value" + addZero(i+1),
						        formatter:function(fVal){
						        	return fVal == "X" ? true : false; }},
		        	type : sap.m.ButtonType.Ghost,      	
					press : ZUI5_HR_Empprofile.common.EmployeeProfile.onPopover,
					customData : [ new sap.ui.core.CustomData({key : "oController", value : oController}),
						           new sap.ui.core.CustomData({key : "Zfilekey", value : "{Value18}"}),
						           new sap.ui.core.CustomData({key : "Zworktyp", value : vHearder.Menuc}) ]
				})) ;		
			}else{
				oColumnList.addCell(new sap.m.Text({
				     text : "{Value" + addZero(i+1)  + "}" , 
				}).addStyleClass("FontFamily")) ;	
			}
		}
	
		var oTable , vFixedLayout = true;
		
		if(_vMenuId == "0021"){
			var oTable = new sap.m.Table(oController.PAGEID + "_" + _vMenuId + "Table",{
				inset : false,
				mode : "None",
				backgroundDesign: sap.m.BackgroundDesign.Translucent,
				showSeparators: sap.m.ListSeparators.All,
				noDataText : "No data found",
				showNoData : true,
				mode : "SingleSelectLeft",
				columns : oColumns,
				fixedLayout : vFixedLayout
			}).addStyleClass("L2PMTableTopBorder");
		}else{
			oTable = new sap.m.Table({
				inset : false,
				mode : "None",
				backgroundDesign: sap.m.BackgroundDesign.Translucent,
				showSeparators: sap.m.ListSeparators.All,
				noDataText : "No data found",
				showNoData : true,
				columns : oColumns,
				fixedLayout : vFixedLayout
			}).addStyleClass("L2PMTableTopBorder");
		}
		
		if(oColumns.length < 1) return oTable ;
		
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oTable.setModel(oJSonModel);
		oTable.bindItems("/Data", oColumnList);
		oJSonModel.setData(ZUI5_HR_Empprofile.common.EmployeeProfile.vTableContentDatas);
		oTable.getBinding('items').filter([new sap.ui.model.Filter("Menuc", sap.ui.model.FilterOperator.EQ, _vMenuId)]);
	
		return oTable ;		
	},
	
	
	onPopover : function(oEvent){
		var oController = oEvent.getSource().getCustomData()[0].getValue();
		var Zfilekey = oEvent.getSource().getCustomData()[1].getValue();
		var Zworktyp = oEvent.getSource().getCustomData()[2].getValue();
		var oView = sap.ui.getCore().byId("ZUI5_HR_Empprofile.EmployeeProfile");
		
		if(!oController._AttachPopover) {
			oController._AttachPopover = sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.DisplayAttachFile", oController);
			oView.addDependent(oController._AttachPopover);
		}
		
		var oPopover = sap.ui.getCore().byId(oController.PAGEID + "_Popover");
		var oJSONModel = oPopover.getModel();
		var vData = {Data : []};
		
		vData.Data.Zfilekey = Zfilekey; 
		vData.Data.Zworktyp = Zworktyp; 
		oJSONModel.setData(vData);
		
		oController._AttachPopover.openBy(oEvent.getSource());
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
