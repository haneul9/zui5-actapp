sap.ui.jsfragment("ZUI5_HR_ProductionEvaluation.fragment.EvaluationDialog", {

	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},
		{id: "Evelmtx", label : oBundleText.getText("LABEL_0783"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "30%", align : sap.ui.core.TextAlign.Begin},	// 783:평가요소
		{id: "Evitmtx", label : oBundleText.getText("LABEL_0789"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "30%", align : sap.ui.core.TextAlign.Begin},	// 789:평가항목
		{id: "Viewpont", label : oBundleText.getText("LABEL_0771"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "20%"},	// 771:착안점
		{id: "Evsco", label : oBundleText.getText("LABEL_0790"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"}	// 790:평점
	],
	
	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					// 사번
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0031") 	// 31:사번
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Perid}",
							width : "95%",
							editable : false
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					// 성명
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0038") 	// 38:성명
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Ename}",
							width : "95%",
							editable : false
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					// 직급
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0770") 	// 770:직급
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Zzjiktlt}",
							width : "95%",
							editable : false
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					// 평가직급
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0787") 	// 787:평가직급
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Evtgrtx}",
							width : "95%",
							editable : false
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					// 부서
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0028") 	// 28:부서
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Orgtx}",
							width : "95%",
							editable : false
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					// 평가상태
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0779") 	// 779:평가상태
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Pstattx}",
							width : "95%",
							editable : false
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "220px",
				cells : [
					// 평점기준
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0791") 	// 791:평점기준
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 5,
						content : new sap.m.TextArea({
							width : "99%",
							value : "{Evscotx}",
							rows : 10,
							editable : false
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_EvaluationTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		})
		.setModel(oController._EvalListJSonModel)
		.bindRows("/Data");
		
		if(oController._IsManager == "X") {
			this._colModel.splice(2, 1);
		}
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "40px",
					content : [
						new sap.ui.core.Icon({
							src: "sap-icon://open-command-field", 
							size : "1.0rem"
						}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0792") 	// 792:피평가자
						}).addStyleClass("FontFamilyBold")
					]
				}).addStyleClass("ToolbarNoBottomLine"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 6,
					widths : ['11%', '22%', '11%', '22%', '11%', '23%'],
					rows : aRows
				})
				.setModel(oController._EvalDetailJSonModel)
				.bindElement("/Data"),
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "40px",
					content : [
						new sap.ui.core.Icon({
							src: "sap-icon://open-command-field", 
							size : "1.0rem"
						}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0785") 	// 785:평가자작성
						}).addStyleClass("FontFamilyBold"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0786") 	// 786:평가점수
						}).addStyleClass("FontFamily"),
						new sap.m.Input(oController.PAGEID + "_EvalTotPoint", {
							value : "{Apoint}",
							width : "70px",
							editable : false
						}).addStyleClass("FontFamily PaddingLeft3"),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0058"),	// 58:임시저장
							type : sap.m.ButtonType.Default,
							press : oController.onPressSaveT,
							icon : "sap-icon://save",
							visible : {
								path : "Readonly",
								formatter : function(fVal) {
									return !fVal;
								}
							}
						}).addStyleClass("FontFamily"),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0481"),	// 481:엑셀
							type : sap.m.ButtonType.Default,
							press : oController.onEvalExport,
							icon : "sap-icon://excel-attachment"
						}).addStyleClass("FontFamily")
					]
				}).addStyleClass("ToolbarNoBottomLine"),
				oTable 
			]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_EvaluationDialog", {
			contentWidth : "900px",
			contentHeight : "720px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0769"),	// 769:생산직 본평가
			beforeOpen : oController.retrieveEvaluationDetail, 
			afterOpen : oController.onAfterOpenEvaluationDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0782"),	// 782:평가완료
				press : oController.onPressSaveC,
				visible : {
					path : "Readonly",
					formatter : function(fVal) {
						return !fVal;
					}
				}
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0017"), // 17:닫기
				press : function() {
					oDialog.close();
				}
			}),
			content : [
				oLayout
			]
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindElement("/Data");
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});