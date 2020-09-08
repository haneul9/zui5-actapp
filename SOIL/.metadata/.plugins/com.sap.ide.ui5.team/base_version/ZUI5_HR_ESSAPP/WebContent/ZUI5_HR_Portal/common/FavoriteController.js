jQuery.sap.declare("ZUI5_HR_Portal.common.FavoriteController");

ZUI5_HR_Portal.common.FavoriteController = {
	/** 
	* @memberOf common.FavoriteController
	*/	
	searchFavorite : function(oController){
		  var oModel = sap.ui.getCore().getModel("ZHR_MENU_SRV");
		  var vData = [], vDataE = [], vDataM = [], vDataH = [];
		  
		  oModel.read("/FavoriteListSet",
				null, 
				null, 
				false, 
				function(oData, oResponse) {
					if(oData && oData.results.length) {
						for(var i =0; i <oData.results.length; i++){
							var oneData = oData.results[i] ;
							if(oneData.Gubun == "YHR01") continue;
							var tempData = {}
							Object.assign(tempData, oneData);
							tempData.Mncod = tempData.Autho + "_" + tempData.Mncod ;
							tempData.Mncodt = "- " + tempData.Mncodt;
							tempData.Idx = i + 1;
							if(oneData.Autho == "E") vDataE.push(tempData);
							else if(oneData.Autho == "M") vDataM.push(tempData);
							else if(oneData.Autho == "H") vDataH.push(tempData);
						}
					}
				},
				function(oResponse) {
					console.log(oResponse);
				}
		  );
		  common.Common.reIndexODataArray(vDataE);
		  common.Common.reIndexODataArray(vDataM);
		  common.Common.reIndexODataArray(vDataH);
		  oController._FavoriteListE = vDataE;
		  oController._FavoriteListM = vDataM;
		  oController._FavoriteListH = vDataH;
		  
		  ZUI5_HR_Portal.common.FavoriteController.displayFavorite(oController);
	},
	
	displayFavorite : function(oController){
		
		// 현재 선택된 Lev1
		var oLev2menu = sap.ui.getCore().byId(oController.PAGEID + "_Lev2menu_1");
		var oContents = oLev2menu.getCustomData();
		var vAuth = "";
		if(oContents && oContents.length){
			vAuth = oContents[0].getValue();
		}
		
		var vData = { Data : []};
		
		// 즐겨찾기 Tile List Binding
//		var oFavoriteTile = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteTile");
		var favoriteData = [];
		if(vAuth == "E") Object.assign(favoriteData,oController._FavoriteListE);
		else if(vAuth == "M") Object.assign(favoriteData,oController._FavoriteListM);
		else if(vAuth == "H") Object.assign(favoriteData,oController._FavoriteListH);
		vData.Data = favoriteData;
		common.Common.reIndexODataArray(vData.Data);
//		oFavoriteTile.getModel().setData(vData);
		oController._FavoriteTileJSonModel.setData(vData);
	},
		
	openFavorite : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		if(!oController._FavoriteDialog) {
			oController._FavoriteDialog = sap.ui.jsfragment("ZUI5_HR_Portal.fragment.FavoriteDialog", oController);
			oView.addDependent(oController._FavoriteDialog);
		}

		// 현재 선택된 Lev1
		var oLev2menu = sap.ui.getCore().byId(oController.PAGEID + "_Lev2menu_1");
		var oContents = oLev2menu.getCustomData();
		var vAuth = "";
		if(oContents && oContents.length){
			vAuth = oContents[0].getValue();
		}
		
		var vData = { Data : []};
		
		// 즐겨찾기 순서 Table Binding
		var oFavoriteTable = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteTable");
		var favoriteData = [];
		if(vAuth == "E") Object.assign(favoriteData,oController._FavoriteListE);
		else if(vAuth == "M") Object.assign(favoriteData,oController._FavoriteListM);
		else if(vAuth == "H") Object.assign(favoriteData,oController._FavoriteListH);
		vData.Data = favoriteData;
		common.Common.reIndexODataArray(vData.Data);
		oFavoriteTable.getModel().setData(vData);

		// 즐겨찾기 Matrix 생성
		var oFavoriteMatrix = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteMatrix"); 
		oFavoriteMatrix.destroyRows();
		
		var vCategory = [], vMenuList = [];
		
		if(vAuth == "E"){
			vCategory = oController._Lev2EssCategoryList;
			vMenuList = oController._EssMenuList;
		}else if(vAuth == "M"){
			vCategory = oController._Lev2MssCategoryList;
			vMenuList = oController._MssMenuList;
		}else if(vAuth == "H"){
			vCategory = oController._Lev2HassCategoryList;
			vMenuList = oController._HassMenuList;
		}
		
		// 선택 List 설정 -> Favorite 여부 check
		var fData = { Data : []}, oneData = {};
		for(var i = 0; i <vMenuList.length; i++){
			oneData = vMenuList[i];
			if(oneData.Gubun == "YHR01") continue;
			oneData.FavoriteYn = 0;
			for(var j = 0; j < favoriteData.length ; j++ ){
				if(vMenuList[i].Mncod == favoriteData[j].Mncod){
					oneData.FavoriteYn = 1;
					continue;
				}
			}
			fData.Data.push(oneData);
		}
		oController._FavoriteList.setData(fData)
		
		var aRows = [], vCount = 0, vRow = {} ;
		for(var i = 0 ; i < vCategory.length ; i++){
			if(vCategory[i].Gubun == "YHR01") continue;
			
			aRows.push(
				new sap.ui.commons.layout.MatrixLayoutRow({
					height : "30px",
					cells : 
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.m.Text({
								text : vCategory[i].Gubunt,
							}).addStyleClass("FontFamilyBold"),
							hAlign : "Begin",
							colSpan : 3
						}).addStyleClass("FavoriteGubun"),
					
				})
			);
			vCellCount = 0, vRow = {};
			for(var j=0; j< fData.Data.length; j++){
				if(vCategory[i].Gubun == fData.Data[j].Gubun){
					if(vCellCount == 0){
						vRow = new sap.ui.commons.layout.MatrixLayoutRow({
							height : "35px",
						});
					}
					vRow.addCell(
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.m.Toolbar({
								content : [
									new sap.m.ToolbarSpacer({width : "5px"}),
									new sap.m.RatingIndicator({
										maxValue : 1,
										value : "{FavoriteYn}",
										change : ZUI5_HR_Portal.common.FavoriteController.changeFavoite
									}),
									new sap.m.ToolbarSpacer({width : "5px"}),
									new sap.m.Text({
										text : "{Mncodt}",
									}).addStyleClass("FontFamily"),
								]
							})
						}).setModel(oController._FavoriteList)
						.bindElement("/Data/" +j)
					);
					vCellCount ++;
					if(vCellCount == 3){
						vCellCount = 0;
						aRows.push(vRow);
						vRow = new sap.ui.commons.layout.MatrixLayoutRow({
							height : "35px",
						});
					}
				}
				if(vCellCount > 0){
					aRows.push(vRow);
				}
			}
		}
		for(var i =0; i <aRows.length; i++){
			oFavoriteMatrix.addRow(aRows[i]);
		}
		
		oController._FavoriteDialog.open();
	},
	
	changeFavoite : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		var oController = oView.getController();
		
		var sPath = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath;
		var val = oEvent.mParameters.value;
		
		var oFavoriteTable = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteTable");
		var favoriteData = oFavoriteTable.getModel().getData();
		var vSelectedData = oController._FavoriteList.getProperty(sPath);
		var vData = {}
		Object.assign( vData ,vSelectedData);
		if(!favoriteData.Data || favoriteData.Data.length == 0){
			favoriteData.Data = [];
		}
		// 즐겨찾기 순서에 적용
		if(val == 1){ // 즐겨찾기 추가
			if(favoriteData.Data.length > 14){
				sap.m.MessageBox.alert("즐겨찾기는 최대 15개만 설정이 가능합니다.");
				oController._FavoriteList.setProperty(sPath +"/FavoriteYn",0);
				return ;
			}
			vData.Mncodt = "- " + vData.Mncodt;
			vData.Idx = favoriteData.Data.length + 1;
			favoriteData.Data.push(vData);
		}else{ // 즐겨찾기 삭제
			for(var i=0; i<favoriteData.Data.length; i++){
				if(favoriteData.Data[i].Mncod == vData.Mncod){
					favoriteData.Data.splice(i, 1);
					break;
				}
			}
		}
		common.Common.reIndexODataArray(favoriteData.Data);
		oFavoriteTable.getModel().setData(favoriteData);
	
	},
	
	onMoveTop : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		var oController = oView.getController();
		var vIdx = oEvent.getSource().getCustomData()[0].getValue() * 1 - 1;
		var oFavoriteTable = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteTable");
		var favoriteData = oFavoriteTable.getModel().getData();
		
		if(vIdx == 0) return ; //  최상 Index 의 Data를 위로 이동 시 

		var vSelectedData = favoriteData.Data[vIdx],
		vSelectedTopData = favoriteData.Data[vIdx-1];
	
		favoriteData.Data[vIdx-1] = vSelectedData;
		favoriteData.Data[vIdx] = vSelectedTopData;
		
		common.Common.reIndexODataArray(favoriteData.Data);
		oFavoriteTable.getModel().setData(favoriteData);
	},
	
	onMoveBottom : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		var oController = oView.getController();
		var vIdx = oEvent.getSource().getCustomData()[0].getValue() * 1 - 1;
		var oFavoriteTable = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteTable");
		var favoriteData = oFavoriteTable.getModel().getData();
		
		if(favoriteData.Data.length == vIdx + 1) return ; // 최하 Index 의 Data를 아래로 이동 시 
		
		var vSelectedData = favoriteData.Data[vIdx],
			vSelectedBottomData = favoriteData.Data[vIdx+1];
		
		favoriteData.Data[vIdx+1] = vSelectedData;
		favoriteData.Data[vIdx] = vSelectedBottomData;
		
		common.Common.reIndexODataArray(favoriteData.Data);
		oFavoriteTable.getModel().setData(favoriteData);
	},
	
	onConfirmFavoriteDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHR_MENU_SRV");
		 
		// 현재 선택된 Lev1
		var oLev2menu = sap.ui.getCore().byId(oController.PAGEID + "_Lev2menu_1");
		var oContents = oLev2menu.getCustomData();
		var vAuth = "";
		if(oContents && oContents.length){
			vAuth = oContents[0].getValue();
		}
		
		var onProcess = function(){
			var createData = {Autho : vAuth };
			var vData = [];
			
			var oFavoriteTable = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteTable");
			var favoriteData = oFavoriteTable.getModel().getData();
			var applyData = [], vErrorMessage = "";
			favoriteData
			
			favoriteData.Data.forEach(function(element) {
				var vTemp = {};
				element.Fsort = "" +element.Idx;
				Object.assign(vTemp, common.Common.copyByMetadata(oModel, "FavoriteList", element));
				// Menu Code 는 Auth + "_" + Menu Code 로 되어있어서 Menu Code 만 분리. 
				vTemp.Mncod = vTemp.Mncod.split("_")[1];
				applyData.push(vTemp);
			});
			
			createData.FavoriteListSet = applyData;
			
			oModel.create("/FavoriteListSet", createData, {
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
			oController._FavoriteDialog.close();
			
			// 메인 페이지 즐겨 찾기 화면 설정
			ZUI5_HR_Portal.common.FavoriteController.searchFavorite(oController);
		};
	
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},
	
	onCloseFavoriteDialog : function(oEvent){
		
		
	},
	
	goToMenu : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Portal.ZUI5_HR_PortalList");
		var oController = oView.getController();
//		var oFavoriteTile = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteTile");
//		var vMncod = oFavoriteTile.getModel().getProperty(oEvent.getSource().mBindingInfos.text.binding.oContext.sPath +"/Mncod");
		var vMncod = oController._FavoriteTileJSonModel.getProperty(oEvent.getSource().mBindingInfos.text.binding.oContext.sPath +"/Mncod");
		
		var navContainer = sap.ui.getCore().byId("navContainer");
		navContainer.to(vMncod);
		
	}
};