sap.ui.jsfragment("fragment.Mandate", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf Mandate
	*/
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.MandateAction");
		
		var oCell = null, oRow = null;
		
		/////////////////// 결재자 검색 //////////////////
		var oTitle1 = new sap.m.Toolbar({
			content : [new sap.m.ToolbarSpacer(),
					   new sap.m.Text({text : oBundleText.getText("LABEL_2754")}).addStyleClass("L2P15FontBold"),	// 2754:결재자 검색
					   new sap.m.ToolbarSpacer()]
		});
		
		var oDetail1 = new sap.ui.commons.layout.MatrixLayout({
			widths : ["30%", "70%"],
			width : "100%",
			columns : 2
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Begin",
			content : [new sap.m.Text({text : oBundleText.getText("LABEL_2780")}).addStyleClass("Font14px FontBold FontColor0")]	// 2780:수임인
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.Toolbar({
					content : [
						       new sap.m.Input({ 
									width : "150px",
									value : "{Ename}",
									showValueHelp: true,
					        	    valueHelpOnly: false,
					        	    editable : {
							    		parts : [ {path : "ZappStatAl"}],
										formatter : function(fVal){
											return (fVal == "" || fVal == "10") ? true : false;
										}
									},
									change : common.MandateAction.EmpSearchByTx,
									valueHelpRequest: common.MandateAction.displayEmpSearchDialog,
									customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
							   }),
							   new sap.m.Text({ 
									text : "/",
								}).addStyleClass("Font14px FontColor6 MinWidth0"),
								new sap.m.Text({ 
									text : " {Perid}",
									visible : {
										path : "Perid",
										formatter : function(fVal){
											return !common.Common.checkNull(fVal) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor6"),
							   new sap.m.ToolbarSpacer(),
							   new sap.m.Button({icon : "sap-icon://search", 
								   press : common.MandateAction.displayEmpSearchDialog ,
								   type : sap.m.ButtonType.Emphasized,
					        	   visible : {
							    		parts : [ {path : "ZappStatAl"}],
										formatter : function(fVal){
											return (fVal == "" || fVal == "10") ? true : false;
										}
								   },
								   tooltip : oBundleText.getText("LABEL_2781")})
							   .addStyleClass("Font14px FontColor6"),	// 2781:사원검색
							   new sap.m.Button({icon : "sap-icon://decline", 
								   tooltip : oBundleText.getText("LABEL_2782"), 
								   type : "Ghost",
								   visible : {
							    		parts : [ {path : "ZappStatAl"}],
										formatter : function(fVal){
											return (fVal == "" || fVal == "10") ? true : false;
										}
								   },
								   press : common.MandateAction.clearEmployee ,
							   }).addStyleClass("Font14px FontColor6"),	// 2782:성명 초기화
							   new sap.m.ToolbarSpacer({width : "5px"})
							  ]
				})
				]
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oDetail1.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Begin",
			content : [new sap.m.Text({text : oBundleText.getText("LABEL_2783")}).addStyleClass("Font14px FontBold FontColor3")]	// 2783:위임기간
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.Toolbar({
					content : [ new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
						            value : "{RepBegda}",
									width : "150px",
									change : function(event){
										var val = event.getSource().getValue();
										if(val != ""){
											var oMandateDialog = sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog");
											oMandateDialog.getModel().setProperty("/Data/RepYn", true);
										}
									},
									editable : {
							    		parts : [ {path : "ZappStatAl"}],
										formatter : function(fVal){
											return (fVal == "" || fVal == "10") ? true : false;
										}
									},
							   }).addStyleClass("Font14px FontColor6"),
							   new sap.m.ToolbarSpacer({width : "10px"}),
							   new sap.m.DatePicker({ 
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
						            value : "{RepEndda}",
									width : "150px",
									editable : {
							    		parts : [ {path : "ZappStatAl"}],
										formatter : function(fVal){
											return (fVal == "" || fVal == "10") ? true : false;
										}
									},
							   }).addStyleClass("Font14px FontColor6")
							  ]
				})
				]
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oDetail1.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Begin",
//			content : [new sap.m.Text({text : oBundleText.getText("LABEL_0096")}).addStyleClass("Font14px FontBold FontColor3")]	// 96:비고
			content : [new sap.m.Text({text : "비고"}).addStyleClass("Font14px FontBold FontColor3")]	// 96:비고
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.Toolbar({
					content : [ new sap.m.Input({ 
						value : "{RepNote}" ,
						editable : {
				    		parts : [ {path : "ZappStatAl"}],
							formatter : function(fVal){
								return (fVal == "" || fVal == "10") ? true : false;
							}
						},
					}) ]
				})
				]
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oDetail1.addRow(oRow);

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_MandateDialog", {
			content :[oDetail1] ,
			contentWidth : "550px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2785"),	// 2785:대리(위임) 지정
			afterOpen : common.MandateAction.onAfterOpen,
			beforeClose : common.MandateAction.onBeforeClose,
			buttons : [new sap.m.Button({text : oBundleText.getText("LABEL_2786"),
							icon :"sap-icon://hr-approval", 
							visible : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal){
									return (fVal == "" || fVal == "10") ? true : false;
								}
							},
							press : common.MandateAction.onSave}),	// 2786:확정
					   new sap.m.Button({
//							text : oBundleText.getText("DELETION"), 
						    text : "삭제", 
							icon :"sap-icon://decline", 
							visible : {
					    		parts : [ {path : "ZappStatAl"}],
								formatter : function(fVal){
									return (fVal == "" || fVal == "10") ? true : false;
								}
							},
							press : common.MandateAction.onDelete 	// DELETION:삭제
					   }),
					   new sap.m.Button({
							text : oBundleText.getText("LABEL_0017"), 
							icon :"sap-icon://decline", 
							press : common.MandateAction.onClose 	// 17:닫기
					   }),
			],
			draggable : true
		}); 
		
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		
		
//		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };	

		return oDialog;
	}

});
