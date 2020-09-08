sap.ui.jsfragment("fragment.CCSInformationDialog", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ApplyLayout
	*/
	
	createContent : function(oController) {
		var oCell = null, oRow = null;
		jQuery.sap.require("common.ZHR_TABLES");
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ['30%','70%']
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2250")}).addStyleClass("Font14px FontColor6"),	// 2250:카드번호
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [
					new sap.m.ComboBox({
						width : "400px",
						items : {
							path : "/CardList",
							template : new sap.ui.core.ListItem({
								key : "{key}",
								text : "{text}"
							}),
							templateShareable : true
						},
						selectedKey : "{Cardno}",
					}).addStyleClass("Font14px FontColor6")
				]
			}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1396")}).addStyleClass("Font14px FontColor6"),	// 1396:사용기간
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : new sap.m.Toolbar({
					content : [
						 new sap.m.DatePicker({
								valueFormat : "yyyy-MM-dd",
					            displayFormat : "yyyy.MM.dd",
					            value : "{Begda}",
					            width : "150px",
						   }).addStyleClass("Font14px FontColor6"),
						   new sap.m.Text({text : "~"}).addStyleClass("Font14px FontColor6 PaddingLeft10 PaddingRight10 MarginTop5"),
						   new sap.m.DatePicker({
								valueFormat : "yyyy-MM-dd",
					            displayFormat : "yyyy.MM.dd",
					            value : "{Endda}",
								width : "150px",
						   }).addStyleClass("Font14px FontColor6"),
						   new sap.m.ToolbarSpacer({width : "10px"}),
						   new sap.m.Button({
							   text : oBundleText.getText("LABEL_0064"),	// 64:조회
							   icon : "sap-icon://search",
							   type : sap.m.ButtonType.Emphasized,
							   press : common.CCSInformation.onSearch 
						   })
					]
				}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_CCSTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.MultiToggle,
			visibleRowCount : 10
		});
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		var col_info1 = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
			{id: "Useddate", label : oBundleText.getText("LABEL_0156"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "18%"},	// 156:사용일자
			{id: "Acceptno", label : oBundleText.getText("LABEL_2766"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 2766:승인번호
			{id: "Amount", label : oBundleText.getText("LABEL_2767"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "10%"},	// 2767:사용금액
			{id: "Vendor", label : oBundleText.getText("LABEL_2768"), plabel : "", span : 0, type : "string4", sort : true, filter : true, width : "18%"},	// 2768:가맹점
			{id: "Biztype", label : oBundleText.getText("LABEL_2769"), plabel : "", span : 0, type : "string4", sort : true, filter : true, width : "15%"},	// 2769:업종
			{id: "Address", label : oBundleText.getText("LABEL_0097"), plabel : "", span : 0, type : "string4", sort : true, filter : true}	// 97:소재지
		];
		
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
			
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oTable,
			colSpan : 2
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.ui.layout.HorizontalLayout({ 
				content : [new sap.ui.core.Icon({
							   src : "sap-icon://arrow-top",
							   size : "1.0rem", 
							   color : "#002060",
							   press : common.CCSInformation.onUp
						   }).addStyleClass("Pointer"),
						   new sap.m.Label({
						   }).addStyleClass("PaddingLeft10 PaddingRight10"),
						   new sap.ui.core.Icon({
							   src : "sap-icon://arrow-bottom",
							   size : "1.0rem", 
							   color : "#002060",
							   press : common.CCSInformation.onDown
						   }).addStyleClass("Pointer")]
			   }),
			colSpan : 2,
			hAlign : "Center",
			vAlign : "Middle"
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_CCSDetailTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.MultiToggle,
			visibleRowCount : 5
		});
		oTable2.setModel(new sap.ui.model.json.JSONModel());
		oTable2.bindRows("/Data");
		
		var col_info1 = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
			{id: "Cardno", label : oBundleText.getText("LABEL_2250"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 2250:카드번호
			{id: "Useddate", label : oBundleText.getText("LABEL_0156"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "11%"},	// 156:사용일자
			{id: "Acceptno", label : oBundleText.getText("LABEL_2766"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "7%"},	// 2766:승인번호
			{id: "Amount", label : oBundleText.getText("LABEL_2767"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "8%"},	// 2767:사용금액
			{id: "Vendor", label : oBundleText.getText("LABEL_2768"), plabel : "", span : 0, type : "string4", sort : true, filter : true, width : "18%"},	// 2768:가맹점
			{id: "Biztype", label : oBundleText.getText("LABEL_2769"), plabel : "", span : 0, type : "string4", sort : true, filter : true, width : "12%"},	// 2769:업종
			{id: "Address", label : oBundleText.getText("LABEL_0097"), plabel : "", span : 0, type : "string4", sort : true, filter : true}	// 97:소재지
		];
		
		common.ZHR_TABLES.makeColumn(oController, oTable2, col_info1);
		var oModel = sap.ui.getCore().getModel("ZHR_BIZ_CARD_SRV");
		var oMergetype = new sap.m.ComboBox({
			selectedKey : "{Mergetype}",
			width : "150px",
			change : common.CCSInformation.onChangeMergetype,
			customData : new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"}),
		}).addStyleClass("Font14px FontColor6");
		var _Mergetype = [];
		oModel.read("/BizCardMergetypeSet", {
			async: false,
			filters : [new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp)],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oMergetype.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Mergetype, 
								text: data.results[i].Mergetypetx,
							})
						);
						_Mergetype.push({ Mergetype : data.results[i].Mergetype, Mergetypetx : data.results[i].Mergetypetx });
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		if(oMergetype.getItems().length > 0){
			oTable2.addColumn(new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
	        	autoResizable : true,
	        	filterProperty : "",
	        	sortProperty : "",
	        	resizable : true,
				showFilterMenuEntry : true,
				width : "150px",
				multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0300")}).addStyleClass("Font14px FontColor6"),	// 300:구분
				template : [oMergetype]
			}));
		}
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oTable2,
			colSpan : 2
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var DialogModel = new sap.ui.model.json.JSONModel();
		var vData = { Data : { Mergetype : _Mergetype }};
		DialogModel.setData(vData);
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CCSDialog", {
			content :[oMatrix] ,
			contentWidth : "1500px",
			contentHeight : "800px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2770"),	// 2770:법인카드내역
			buttons : [new sap.m.Button({text : oBundleText.getText("LABEL_0395"), press : common.CCSInformation.onSave}),	// 395:확인
					   new sap.m.Button({
							text : oBundleText.getText("LABEL_2771"), press : common.CCSInformation.onInit 	// 2771:초기화
					   }),
					   new sap.m.Button({
							text : oBundleText.getText("LABEL_0017"), press : common.CCSInformation.onClose 	// 17:닫기
					   }),
			],
			draggable : true
		}); 
		
		oDialog.setModel(DialogModel);
		oDialog.bindElement("/Data");
		
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});
