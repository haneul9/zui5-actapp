jQuery.sap.declare("common.EmployeeProfile");

jQuery.sap.require("control.L2PTab");
jQuery.sap.require("control.L2PDataSet");
jQuery.sap.require("control.L2PEmpBasic");
jQuery.sap.require("common.ZNK_TABLES");
jQuery.sap.require("sap.ui.ux3.NavigationItem");
jQuery.sap.require("sap.ui.ux3.NavigationBar");

/**
 * 인사프로파일의 화면을 제어하는 프로그램이다.
 * 
 * @memberOf common.EmployeeProfile
 */
common.EmployeeProfile = {
	vTableHeader : [],	
	vTableType : "",
	vTableMenuId : "",
	vController : null,
	_oJModel : null,
	
	/**
	 * 인사프로파일의 기본정보를 설정하는 기능이다.
	 * control.L2PEmpBasic 이라는 Control에 기본정보를 설정한다.
	 * 
	 * @param oController
	 * @param Pernr
	 */
	makeBasicProfile : function(oController, Pernr) {
		var oDetailInfoLayout = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoLayout");		
		oDetailInfoLayout.addStyleClass("L2PDetailInfoLayout");
		
		var oBasicInfoLayout = sap.ui.getCore().byId(oController.PAGEID + "_BasicInfoLayout");
		oBasicInfoLayout.destroyContent();
		
		var oModel = sap.ui.getCore().getModel("ZNK_PA_EMP_PROFILE");
		
		var vPersonHeaderInfo = {};
		var setBasicProfile = function() {
			var vColumns = [{label : oBundleText.getText("LABEL_2810")},	// 2810:인사구분
			                {label : oBundleText.getText("LABEL_2811")},	// 2811:호봉
			                {label : oBundleText.getText("LABEL_2073")},	// 2073:입사일자
			                {label : oBundleText.getText("LABEL_2812")}	// 2812:업장
			                ];
			
			var oEmpBasic = new control.L2PEmpBasic({
				empData : vPersonHeaderInfo,
				labels : vColumns
			});
			oBasicInfoLayout.destroyContent();
			oBasicInfoLayout.addContent(oEmpBasic);
		};
		
		oModel.read("/EmpProfileHeaderNewSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27", 
				null, 
				null, 
				true,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						vPersonHeaderInfo = oData.results[0];
						
						setBasicProfile();
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},
	
	/**
	 * 인사프로파일의 메뉴 및 서브메뉴를 설정하는 기능이다.
	 * EmpProfileMenuSet OData를 이용하여 Master 메뉴를 설정한다.
	 * 
	 * @param oController
	 * @param Pernr
	 */
	makeDetailInfo : function(oController, Pernr) {
		var oMasterTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_MasterTabMenuLayout");
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		oSubTabMenuLayout.setVisible(false);
		
		oMasterTabMenuLayout.destroyContent();
		
		var oModel = sap.ui.getCore().getModel("ZNK_PA_EMP_PROFILE");
		
		var vUsrty = "";
		if(oController._vSCreenType == "ess") {
			vUsrty = "E";
		} else if(oController._vSCreenType == "mss") {
			vUsrty = "M";
		} else if(oController._vSCreenType == "hass") {
			vUsrty = "H";
		} else if(oController._vSCreenType == "top") {
			vUsrty = "T";
		} else {
			vUsrty = "E";
		}    
		
		var vPersonMenuInfo = [];
		oModel.read("/EmpProfileMenuSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
				    "%20and%20Usrty%20eq%20%27" + vUsrty + "%27", 
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
		
		if(vPersonMenuInfo.length < 1) {
			sap.ui.getCore().getEventBus().publish("EmpolyeeProfile", "FinishWork", {});
			return;
		}
		
		oController._vMasterTabs = [];
		
		oController._vSubTabs = [];
		
		for(var i=0; i<vPersonMenuInfo.length; i++) {
			if(vPersonMenuInfo[i].Menuc2 == "") {
				var oneData = {};
				oneData.id = "M" + vPersonMenuInfo[i].Menuc1;
				oneData.label = vPersonMenuInfo[i].Menu1;
				oneData.childControl = vPersonMenuInfo[i].Child;
				oneData.merge = parseInt(vPersonMenuInfo[i].Merge);				
				oController._vMasterTabs.push(oneData);
			} else {
				var oneData = {};
				oneData.id = "S" + vPersonMenuInfo[i].Menuc2;
				oneData.label = vPersonMenuInfo[i].Menu2;
				oneData.parent = "M" + vPersonMenuInfo[i].Menuc1;
				oneData.childControl = vPersonMenuInfo[i].Child;
				oneData.merge = parseInt(vPersonMenuInfo[i].Merge);
				
				oController._vSubTabs.push(oneData);
			}
		}
		
		var vItemIds = [];
		var vItemLebels = [];
		
		for(var i=0; i<oController._vMasterTabs.length; i++) {
			vItemIds.push(oController._vMasterTabs[i].id);
			vItemLebels.push(oController._vMasterTabs[i].label);
		}
		
		var oMasterTabLayout = new control.L2PTab({
			cssPath : "/sap/bc/ui5_ui5/sap/ZUI5_HR_COMMON/css/",
			itemIds : vItemIds,
			itemLabels : vItemLebels,
			selectedKey : oController._vMasterTabs[0].id,
			select : common.EmployeeProfile.onSelectMasterTabMenu,
			bgColor : "#53abe6",
			height : 30
		});		
		oMasterTabLayout.addCustomData(new sap.ui.core.CustomData({key:"oController", value : oController}));
		
		oMasterTabMenuLayout.addContent(oMasterTabLayout);
		
		if(oController._vMasterTabs[0].childControl == "5" || oController._vMasterTabs[0].childControl == "7") {
			common.EmployeeProfile.makeListData(oController, Pernr, oController._vMasterTabs[0].id, oController._vMasterTabs[0].childControl, oController._vMasterTabs[0].merge);
		} else if(oController._vMasterTabs[0].childControl == "1") {
			common.EmployeeProfile.makeSubTabMenu(oController, Pernr, oController._vMasterTabs[0].id, "1");
		} else if(oController._vMasterTabs[0].childControl == "2") {
			common.EmployeeProfile.makeSubTabMenu(oController, oController._vSelectedPernr, oController._vMasterTabs[0].id, "2");
			common.EmployeeProfile.makeDataSet(oController, oController._vSelectedPernr, oController._vMasterTabs[0].id);
		}
		common.EmployeeProfile.getRelatedLin(oController, Pernr, oController._vMasterTabs[0].id);
	},
	
	/**
	 * 인사프로파일중 메뉴에 해당하는 리스트 유형의 데이터를 IBSheet로 구현하는 기능이다.
	 * 테이블 헤더의 정보는 TableHeaderSet 에서 테이블 데이터는 TableContentsSet 로 부터 가져온다.
	 * 
	 * @param oController
	 * @param Pernr
	 * @param Menuid
	 * @param MenuType
	 * @param MenuMerge
	 */
	makeListData : function(oController, Pernr, Menuid, MenuType, MenuMerge) {
		$("#" + oController.PAGEID + "_DataSetLayout").css("display", "none");
		$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "block");
		
		common.EmployeeProfile.vTableType = MenuType;
		common.EmployeeProfile.vTableMenuId = Menuid;
		common.EmployeeProfile.vController = oController;
		
		var oDHtmlxTableToolBar = sap.ui.getCore().byId(oController.PAGEID + "_DHtmlxTableToolBar");
		if(MenuType == "8") { //if(Menuid == "SHACT" || Menuid == "SHACS") {
			oDHtmlxTableToolBar.setVisible(true);
		} else {
			oDHtmlxTableToolBar.setVisible(false);
		}
		
		var oModel = sap.ui.getCore().getModel("ZNK_PA_EMP_PROFILE");
		
		var addZero = function(d) {
			if(d < 10) return "0" + d;
			else return "" + d;
		};
		
		var vTableHeight = window.innerHeight - 460;

//		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
//		if(oSubTabMenuLayout.getVisible()) {
//			vTableHeight = window.innerHeight - 460;
//		} else {
//			vTableHeight = window.innerHeight - 426;
//		}
		
		$("#" + oController.PAGEID + "_DHtmlxTable").css("height", vTableHeight);
		
		var oTable = new sap.ui.table.Table({
			enableColumnReordering : false,
			width : "100%",
			enableColumnFreeze : false,
			selectionMode : sap.ui.table.SelectionMode.None,
			columnHeaderHeight  : 30,
			rowHeight : 30,
		});
		
		oTable.setVisibleRowCount(parseInt(vTableHeight / 31) - 1);
		
		var oDHtmlxTable = sap.ui.getCore().byId(oController.PAGEID + "_DHtmlxTable");
		oDHtmlxTable.destroyContent();
		oDHtmlxTable.addContent(oTable);
		
		common.EmployeeProfile.vTableHeader = [];
		oModel.read("/TableHeaderSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
				"%20and%20Menuc%20eq%20%27" + Menuid.substring(1) + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							common.EmployeeProfile.vTableHeader.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		if(common.EmployeeProfile.vTableHeader.length < 1) {
			return;
		}
		
		var oHeaders = [];
		var oTypes = [];
		var oFields = [];
		var oSizes = [];
		var oAligns = [];
		
		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
			oHeaders.push(common.EmployeeProfile.vTableHeader[i].Header);
			
			var vType = "";
			switch(common.EmployeeProfile.vTableHeader[i].Fldty){
				case "40" :
					vType = "date";
					break;
				case "50" :
					vType = "image";
					break;
				default :
					vType = "string";
			}
			oTypes.push(vType);
			
//			var vField = common.EmployeeProfile.vTableHeader[i].Fieldname;
////			if(vField) {
////				vField = vField.substr(0,1).toUpperCase() + vField.substring(1).toLowerCase();
////			}
//			oFields.push(vField);
			
			var vField = "Value" + addZero(i+1);
			oFields.push(vField);
			
			var vAlign = common.EmployeeProfile.vTableHeader[i].Align;
			if(!vAlign) vAlign = "Center";
			oAligns.push(vAlign);
			
			var vSize = common.EmployeeProfile.vTableHeader[i].Width;
			oSizes.push(vSize);
			
			common.ZNK_TABLES.autoColumn(oController,oTable,oHeaders,oTypes,oFields,15,oSizes,oAligns);
			oTable.bindRows("/data");
			
//			var oneCol = {};
//			oneCol.Header = common.EmployeeProfile.vTableHeader[i].Header;
//			if(common.EmployeeProfile.vTableHeader[i].Fldty == "50") {
//				oneCol.Type = "Img";
//			} else if(common.EmployeeProfile.vTableHeader[i].Fldty == "80") {
//				oneCol.Type = "Html";
//			} else {
//				oneCol.Type = "Text";
//			}
//			
//			oneCol.Edit = 0;
//			oneCol.SaveName = "Value" + addZero(i+1);
//			oneCol.Align = "Left";
//			
//			if(MenuType == "7") {
//				if(i < MenuMerge) {
//					oneCol.ColMerge = 1;
//				} else {
//					oneCol.ColMerge = 0;
//				}
//			}
//			initdata.Cols.push(oneCol);
			
		}
		
//		IBS_InitSheet(EmpolyeeProfileTable, initdata);
//		EmpolyeeProfileTable.FitColWidth();
//		EmpolyeeProfileTable.SetSelectionMode(0);
//		
//		EmpolyeeProfileTable.SetCellFont("FontSize", 0, "Value01", EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), 12);
//		EmpolyeeProfileTable.SetCellFont("FontName", 0, "Value01", EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), "Malgun Gothic");
//		EmpolyeeProfileTable.SetCellFont("FontBold", 0, "Value01", EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), 1);
//		EmpolyeeProfileTable.SetHeaderRowHeight(32);
//		EmpolyeeProfileTable.SetDataRowHeight(32);
//		
//		EmpolyeeProfileTable.SetHeaderBackColor("rgb(255,255,255)");
//		EmpolyeeProfileTable.SetFocusAfterProcess(0);
//		
//		
//		if(MenuType == "7") {
//			EmpolyeeProfileTable.SetMergeSheet(1);
//		} else {
//			EmpolyeeProfileTable.SetMergeSheet(0);
//		}
		
		var oJModel = new sap.ui.model.json.JSONModel();
		var vPersonListData = {data : []};
		
		var vCcntr = "";
		try {
			var oConcurrentPerson = sap.ui.getCore().byId(oController.PAGEID + "_ConcurrentPerson");
			var oItem = oConcurrentPerson.getSelectedItem();
			var oCustomData = oItem.getCustomData();
			vCcntr = oCustomData[0].getValue();
		} catch(ex) {}		
		
		var oPath = "/TableContentsSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
				    "%20and%20Menuc%20eq%20%27" + Menuid.substring(1) + "%27";
		if(vCcntr != null && vCcntr != "") {
			oPath += "%20and%20Ccntr%20eq%20%27" + vCcntr + "%27";
		}
		
		oModel.read(oPath, 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var oneData = oData.results[i];
							
							for(var j=0; j<common.EmployeeProfile.vTableHeader.length; j++) {
								switch(common.EmployeeProfile.vTableHeader[j].Fldty) {
								case "40" : 
//									var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
//									var vVal = eval("oData.results[i].Value" + addZero(j+1));
//									if(vVal) vVal = dateFormat.format(new Date(vVal));
//									else vVal = null;
//									console.log("####1 " + vVal);
//									eval("oneData.Value" + addZero(j+1) + " = " + vVal + ";");
//									console.log("####2 " + eval("oneData.Value" + addZero(j+1)));
									break;
								case "50" : 
									var vVal = eval("oData.results[i].Value" + addZero(j+1));
									
									if(vVal == "X") {
										eval("oneData.Value" + addZero(j+1) + " = '/sap/bc/ui5_ui5/sap/ZUI5_HR_COMMON/images/check-icon.png';");
									}
									break;
								}
							}
							vPersonListData.data.push(oneData);
						}
						oJModel.setData(vPersonListData);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		//EmpolyeeProfileTable.LoadSearchData(vPersonListData);
		oTable.setModel(oJModel);
		
		sap.ui.getCore().getEventBus().publish("EmpolyeeProfile", "FinishWork", {});	
	},
	
	/**
	 * 각 메뉴별로 수정할 수 있는 Link 정보를 가져오는 기능이다.
	 * RelatedLinkSet 로 부터 가져온다.
	 * 
	 * @param oController
	 * @param Pernr
	 * @param Menuid
	 */
	getRelatedLin : function(oController, Pernr, Menuid) {
		var oModel = sap.ui.getCore().getModel("ZNK_PA_EMP_PROFILE");
		
		var vScreenType = "";
		var vUsrty = "";
		if(oController._vSCreenType == "ess") {
			vUsrty = "E";
		} else if(oController._vSCreenType == "mss") {
			vUsrty = "M";
		} else if(oController._vSCreenType == "hass") {
			vUsrty = "H";
		} else if(oController._vSCreenType == "top") {
			vUsrty = "T";
		} else {
			vUsrty = "E";
		}   
		
		var oSModifyBtn = sap.ui.getCore().byId(oController.PAGEID + "_ModifyBtn");
		if(oSModifyBtn) {
			oController.oActionSheet = null;
			
			var vActionSheets = [];
			var setActionSheet = function() {
				if(vActionSheets.length < 1) {
					oSModifyBtn.setVisible(false);
				} else {
					oController.oActionSheet = new sap.m.ActionSheet({
						title : "",
						placement : "Top"
					});
					oController.oActionSheet.destroyButtons();
					
					for(var i=0; i<vActionSheets.length; i++) {
						oController.oActionSheet.addButton(
							new sap.m.Button({
								text : vActionSheets[i].Utitltx,
								customData : {key : "Url", value : vActionSheets[i].Url},
								press : common.EmployeeProfile.onPressActionSheet
							})
						);
					}
					oSModifyBtn.setVisible(true);
				}
			};
			
			oModel.read("/RelatedLinkSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
					"%20and%20Usrty%20eq%20%27" + vScreenType + "%27" +
					"%20and%20Menuc%20eq%20%27" + Menuid.substring(1) + "%27", 
					null, 
					null, 
					true,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vActionSheets.push(oData.results[i]);
							}
						}
						setActionSheet();
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		}
	},
	
	/**
	 * 인사프로파일의 Master 메뉴가 선택되었을때 수행하는 기능이다.
	 * Master 메뉴에 해당하는 Sub 메뉴 정보를 가져와서 Sub 메뉴를 구성한다.
	 *  
	 * @param oEvent
	 */
	onSelectMasterTabMenu : function(oEvent) {
		var vMenuId = oEvent.getParameter("menuid");
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		var oController = oCustomData[0].getValue();
		
		var vMenuControlType = "";
		for(var i=0; i<oController._vMasterTabs.length; i++) {
			if(oController._vMasterTabs[i].id == vMenuId) {
				vMenuControlType = oController._vMasterTabs[i].childControl;
				break;
			}
		}
		
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		
		if(vMenuControlType == "5") {
			oSubTabMenuLayout.setVisible(false);
			common.EmployeeProfile.makeListData(oController, oController._vSelectedPernr, vMenuId);
		} else if(vMenuControlType == "1") {
			common.EmployeeProfile.makeSubTabMenu(oController, oController._vSelectedPernr, vMenuId, "1");
		} else if(vMenuControlType == "2") {
			common.EmployeeProfile.makeSubTabMenu(oController, oController._vSelectedPernr, vMenuId, "2");
			common.EmployeeProfile.makeDataSet(oController, oController._vSelectedPernr, vMenuId);
		}
		
		common.EmployeeProfile.getRelatedLin(oController, oController._vSelectedPernr, vMenuId);		
	},
	
	/**
	 * Master 메뉴의 타입이 DataSet 인 경우 해당 DataSet을 구성하는 기능이다.
	 * control.L2PDataSet Control를 이용하여 구성한다.
	 * 
	 * @param oController
	 * @param Pernr
	 * @param MenuId
	 */
	makeDataSet : function(oController, Pernr, MenuId) {
		var oDataSetLayout = sap.ui.getCore().byId(oController.PAGEID + "_DataSetLayout");
		oDataSetLayout.destroyContent();
		
		var oDHtmlxTableToolBar = sap.ui.getCore().byId(oController.PAGEID + "_DHtmlxTableToolBar");
		oDHtmlxTableToolBar.setVisible(false);
		
		$("#" + oController.PAGEID + "_DataSetLayout").css("display", "block");
		$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "none");
		
		var vTableHeight = window.innerHeight - 460;
//		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
//		if(oSubTabMenuLayout.getVisible()) {
//			vTableHeight = window.innerHeight - 482;
//		} else {
//			vTableHeight = window.innerHeight - 448;
//		}		
//
//		oDataSetLayout.setHeight((vTableHeight + 32) + "px");
		
		switch(MenuId) {
			case "MM001" :
			case "S1010" :
				oDataSetLayout.addContent(sap.ui.jsfragment("ZNK_PA_EmpProfile.fragment.Profile_1010", oController));
				break;
			case "S1020" :
				oDataSetLayout.addContent(sap.ui.jsfragment("ZNK_PA_EmpProfile.fragment.Profile_1020", oController));
				break;
			default :
		}
		
		sap.ui.getCore().getEventBus().publish("EmpolyeeProfile", "FinishWork", {});
	},
	
	/**
	 * Sub 메뉴를 생성하는 기능이다.
	 * 
	 * @param oController
	 * @param Pernr
	 * @param MenuId
	 * @param vMenuControlType
	 */
	makeSubTabMenu : function(oController, Pernr, MenuId, vMenuControlType) {
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		oSubTabMenuLayout.destroyContent();
		oSubTabMenuLayout.setVisible(true);
		
		var vItemIds = [];
		var vItemLebels = [];
		var idx = 0;
		var vFirstMenuId = "";
		var vFirstType = "";
		var vFirstMerge = "";
		for(var i=0; i<oController._vSubTabs.length; i++) {
			if(oController._vSubTabs[i].parent == MenuId) {
				if(idx == 0) {
					vFirstMenuId = oController._vSubTabs[i].id;
					vFirstType = oController._vSubTabs[i].childControl;
					vFirstMerge = oController._vSubTabs[i].merge;
				}
				vItemIds.push(oController._vSubTabs[i].id);
				vItemLebels.push(oController._vSubTabs[i].label);
				idx++;
			}
		}
		
		var vParentIdx = 0;
		for(var i=0; i<oController._vMasterTabs.length; i++) {
			if(oController._vMasterTabs[i].id == MenuId) {
				vParentIdx = (i+1);
				break;
			}
		}
		
		var vNavigationBarItems = [];
		for(var i=0; i<vItemIds.length; i++) {
			vNavigationBarItems.push(new sap.ui.ux3.NavigationItem({key:vItemIds[i], text:vItemLebels[i]}));
		}
		
		var oNavigationBar = new sap.ui.ux3.NavigationBar({
			items: vNavigationBarItems,
			selectedItem: vNavigationBarItems[0],
			select : common.EmployeeProfile.onSelectSubTabMenu
		});
		oNavigationBar.addCustomData(new sap.ui.core.CustomData({key:"oController", value : oController}));
		
		oSubTabMenuLayout.addContent(oNavigationBar);
		
		var vOnePaddingLeft = Math.floor(100 / (oController._vMasterTabs.length + 1));
    	var vPaddingLeft = vOnePaddingLeft * (vParentIdx - 1);
    
    	var onPadding = function() {
    		$("#" + oController.PAGEID + "_SubTabMenuLayout").css("padding-left", vPaddingLeft + "%");
    	};
		
		setTimeout(onPadding, 300);

		if(vMenuControlType == "1") common.EmployeeProfile.makeListData(oController, Pernr, vFirstMenuId, vFirstType, vFirstMerge);
	},
	
	/**
	 * Sub 메뉴를 선택하였을떄 수행하는 기능이다.
	 * 
	 * @param oEvent
	 */
	onSelectSubTabMenu : function(oEvent) {
		var vMenuId = oEvent.getParameter("item").getKey(); //oEvent.getParameter("menuid");
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		var oController = null;
		for(var i=0; i<oCustomData.length; i++) {
			if(oCustomData[i].getKey() == "oController") {
				oController = oCustomData[i].getValue();
			}
		}
		if(oController == null) {
			return;
		}
		
		var vMenuControlType = "";
		var vMenuMerge = 0;
		for(var i=0; i<oController._vSubTabs.length; i++) {
			if(oController._vSubTabs[i].id == vMenuId) {
				vMenuControlType = oController._vSubTabs[i].childControl;
				vMenuMerge = oController._vSubTabs[i].merge;
				break;
			}
		}
		
		if(vMenuControlType == "5" || vMenuControlType == "7" || vMenuControlType == "8") {
			common.EmployeeProfile.makeListData(oController, oController._vSelectedPernr, vMenuId, vMenuControlType, vMenuMerge);
			//document.location.href = "#" + oController.PAGEID + "_DHtmlxTable";
		} else if(vMenuControlType == "6") {
			common.EmployeeProfile.makeDataSet(oController, oController._vSelectedPernr, vMenuId);
//			$("#" + oController.PAGEID + "_DataSetLayout").css("display", "block");
//			$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "none");
//			try {
//				//document.location.href = "#" + oController.PAGEID + "_" + vMenuId;	
//			} catch(ex) {
//				
//			}
		}
	},
	
	/**
	 * Link 정보를 가지고 구성한 ActionSheet 를 선택하였을때 수행하는 기능이다.
	 * Link 에 해당하는 URL를 새로운 창으로 Open 한다.
	 * @param oEvent
	 */
	onPressActionSheet : function(oEvent) {
		var oButton = oEvent.getSource();
		
		var oCustomData = oButton.getCustomData();
		var vUrl = "";
		for(var i=0; i<oCustomData.length; i++) {
			if(oCustomData[i].getKey() == "Url") {
				vUrl = oCustomData[i].getValue();
			}
		}
		
		if(vUrl != "") {
			if(vUrl.indexOf("http") == -1) {
				window.open("http://" + vUrl);
			} else {
				window.open(vUrl);
			}
		}
	},
	
};

/**
 * IBSheet의 데이터 로딩이 완료된 후에 수행한다.
 * 테이불 유형에 따라 Column의 사이즈를 조정한다.
 * 또한 쿠키에 사용자가 조장된 Width가 있으면 해당 Width로 조정된다.
 * 
 * @param result
 */
function EmpolyeeProfileTable_OnSearchEnd(result) {
	if(common.EmployeeProfile.vTableType != "8") {
		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
			if(common.EmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.EmployeeProfile.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(common.EmployeeProfile.vTableHeader[i].Width));
			}
		}
		
		EmpolyeeProfileTable.FitColWidth();
	} else {
		EmpolyeeProfileTable.FitSize(1, 1);
		
		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
			if(common.EmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.EmployeeProfile.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(common.EmployeeProfile.vTableHeader[i].Width));
			}
		}
	}	
	
	try {
		var cookieData = $.cookie(common.EmployeeProfile.vController.PAGEID + "_" + common.EmployeeProfile.vTableMenuId);
		if(cookieData && cookieData != "") {
			var cWidths = cookieData.split(",");
			for(var i=0; i<cWidths.length; i++) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(cWidths[i]));
			}
		}
	}catch(ex){}
	
	
	EmpolyeeProfileTable.SetCellFont("FontSize", EmpolyeeProfileTable.HeaderRows(), "Value01", EmpolyeeProfileTable.RowCount() + EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), 12);
	EmpolyeeProfileTable.SetCellFont("FontName", EmpolyeeProfileTable.HeaderRows(), "Value01", EmpolyeeProfileTable.RowCount() + EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), "Malgun Gothic");	
}

/**
 * IBSheet의 Resize 이벤트가 발생하면 수행한다.
 * 테이불 유형에 따라 Column의 사이즈를 조정한다.
 * 
 * @param Width
 * @param Height
 */
function EmpolyeeProfileTable_OnSmartResize(Width, Height) {
	if(common.EmployeeProfile.vTableType != "8") {
		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
			if(common.EmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.EmployeeProfile.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(common.EmployeeProfile.vTableHeader[i].Width));
			}
		}
		
		EmpolyeeProfileTable.FitColWidth();
	} else {
		EmpolyeeProfileTable.FitSize(1, 1);
		
		for(var i=0; i<common.EmployeeProfile.vTableHeader.length; i++) {
			if(common.EmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.EmployeeProfile.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(common.EmployeeProfile.vTableHeader[i].Width));
			}
		}
	}
}

/**
 * IBSheet의 Column Width를 Resize 하면 수행한다.
 * 변경된 Width 정보를 Cookie에 저장한다.
 * 
 * @param Col
 * @param Width
 */
function EmpolyeeProfileTable_OnUserResize(Col, Width) {
	var vColWidth = "";
	for(var i=0; i<=EmpolyeeProfileTable.LastCol(); i++) {
		vColWidth += EmpolyeeProfileTable.GetColWidth(i) +",";
	}
	try {
		$.cookie(common.EmployeeProfile.vController.PAGEID + "_" + common.EmployeeProfile.vTableMenuId, vColWidth);
	} catch(ex){}
	
}