sap.ui.jsfragment("ZUI5_HR_PreparedAmount.fragment.OrgFromToDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oRow, oCell;
		
		var oCloseButton = new sap.m.Button({
			text : oBundleText.getText("LABEL_0017"), // 17:닫기
			icon: "sap-icon://decline",
			press : function(oEvent){
				oDialog.close();
			}
		});
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ['20%','70%']
		});
		//발령후 조직명		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1371")}).addStyleClass("Font14px FontBold FontColor3"),	// 1371:발령후 조직명
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);		
		
		var Zzwork2T = new sap.m.Input(oController.PAGEID +"_DialogZzwork2T",{
			maxLength : common.Common.getODataPropertyLength("ZHR_BEF_MOVING_SRV", "BefMovingOvrseaynList", "Ovrseayntx"),
			change : oController.onSearchOrgFromTo
		}).addStyleClass("Font14px FontColor3");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : Zzwork2T
		}).addStyleClass("MatrixData3");
		oRow.addCell(oCell);		
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Button({
				text: oBundleText.getText("LABEL_0002"),
				icon : "sap-icon://search",
				type : sap.m.ButtonType.Emphasized,
				press : oController.onSearchOrgFromTo ,
		   })
		}).addStyleClass("MatrixData2");
		oRow.addCell(oCell);	
		
		oContent.addRow(oRow);
		
		var oColumnList = new sap.m.ColumnListItem({
			counter : 10,
			cells : [
				new sap.m.Text({
				     text : "{Idx}" 
				}).addStyleClass("FontFamily"),
				new sap.m.Text({
					text : "{Zzwork1T}" , 
				}).addStyleClass("FontFamily"),
			    new sap.m.Text({
					text : "{Area1}" , 
				}).addStyleClass("FontFamily"),
				 new sap.m.Text({
					text : "{Zzwork2T}" , 
				}).addStyleClass("FontFamily"),
			    new sap.m.Text({
			    	text : "{Area2}" , 
				}).addStyleClass("FontFamily"),
			    new sap.m.Text({
			    	text : "{Distatx}" , 
				}).addStyleClass("FontFamily"),
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_DialogTable", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			mode : "SingleSelectLeft",
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("FontFamilyBold"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight cellBorderLeft",
			        	  width : "5%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1368")}).addStyleClass("FontFamilyBold"),	// 1368:발령전 조직
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1369")}).addStyleClass("FontFamilyBold"),	// 1369:발령전 지역
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}), 
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1370")}).addStyleClass("FontFamilyBold"),	// 1370:발령후 조직
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1381")}).addStyleClass("FontFamilyBold"),	// 1381:발령후 지역
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0286")}).addStyleClass("FontFamilyBold"),	// 286:거리
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          ]
		});
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindItems("/Data", oColumnList); 
		
		
		
		var oDialog = new sap.m.Dialog({
			content :[oContent,
				new sap.ui.core.HTML({
					content : "<div style='height : 10px;'/>"
				}),
				oTable
				] ,
			//contentWidth : "700px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1367"),	// 1367:발령 전/후 조직
			buttons: [
				new sap.m.Button({
					text : oBundleText.getText("LABEL_0037"), 	// 37:선택
					press : oController.onConfirmOrgFromTo, 
					icon: "sap-icon://save"
				}),
				oCloseButton
			],
			beforeOpen :  function(){
				var oModel = oTable.getModel();
				var oDatas = {Data : []} ;
				oModel.setData(oDatas);
				Zzwork2T.setValue("");
				oDialog.close();
			},
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
			
		return oDialog;
	}

});
