sap.ui.jsview("zui5_hrxx_actapp.ActAppPersonInfo", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp.ActAppPersonInfo
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp.ActAppPersonInfo";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp.ActAppPersonInfo
	*/ 
	createContent : function(oController) {
		
		var oCell, oRow;
		var vMASSN = ["1st 발령유형","2nd 발령유형","3rd 발령유형","4th 발령유형","5th 발령유형"];
		var vMASSG = ["1st 발령사유","2nd 발령사유","3rd 발령사유","4th 발령사유","5th 발령사유"];
		
		var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			//widths: ["300px"],
		});
		
		var oObjectListItem = new sap.m.ObjectListItem({
			title: "{Ename}",
			//icon : "sap-icon://person-placeholder",
			attributes  : [
			               new sap.m.ObjectAttribute({text : {
			   		    	parts : [{path : "Zzjobgrtx"}, {path : "Zzcaltltx"}, {path : "Zzpsgrptx"}],
					    	formatter : function(v1, v2, v3) {
					    		console.log("D : " + v1 + "," + v2 + ", " + v3);
					    		if(v1 == undefined || v2 == undefined || v3 == undefined) return "";
					    		return v1 + " / " + v2 + " / " + v3;
					    	}}}),
					    	new sap.m.ObjectAttribute({text : "{Fulln}"}),
					]
		});
		
		var oCustomListItem = new sap.m.CustomListItem({
			content : new sap.suite.ui.commons.BusinessCard({
				firstTitle: new sap.ui.commons.Label({text:"{Ename}"}).addStyleClass("L2P13Font L2P13FontBold"),
			    iconPath: "/sap/bc/ui5_ui5/sap/zhrxx_common/images/person.png",
			    secondTitle: {
	   		    	parts : [{path : "Zzjobgrtx"}, {path : "Zzcaltltx"}, {path : "Zzpsgrptx"}],
			    	formatter : function(v1, v2, v3) {
			    		if(v1 == undefined || v2 == undefined || v3 == undefined) return "";
			    		return v1 + " / " + v2 + " / " + v3;
			    	}},
			    content : new sap.ui.commons.Label({text:"{Fulln}"}).addStyleClass("L2P13Font")
			}).addStyleClass("L2P13Font")
		});
		
		var oList = new sap.m.List(oController.PAGEID + "_List", {
			showNoData : true,
			noDataText : "발령대상자가 없습니다.",
			mode : sap.m.ListMode.MultiSelect,
			selectionChange : oController.onSelectPersonList,
			rememberSelections : false,
			items : {
				path : "/ActionSubjectListSet",
				template : oCustomListItem
			}
		}).addStyleClass("L2PListMinWidth");
		oList.setModel(sap.ui.getCore().getModel("ActionSubjectList_Temp"));
		
		var oLeftScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_LeftScrollContainer", {
			content : oList,
			width: "100%",
			height : "500px",
			horizontal : false,
			vertical : true
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oLeftScrollContainer]
		}).addStyleClass("L2PBackgroundWhite");
		
		oRow.addCell(oCell);
		
		var oInputLayout = new sap.ui.commons.layout.VerticalLayout();
		
		var oIssuedDatePanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://calendar", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "발령일", design : "Bold", width: "95px"}).addStyleClass("L2P13Font"),
				           new sap.m.DatePicker(oController.PAGEID + "_Actda", {
				        	   width : "200px",
				   			   valueFormat : "yyyy-MM-dd",
				           	   displayFormat : gDtfmt,
				           	   change : oController.onChangeActda
				   		   }),
				   		   new sap.m.Button(oController.PAGEID + "_ChangeDate",{
				   			   text : "수정",
				   			   type : "Emphasized",
				   			   visible : false,
				   			   press : oController.onPressChangeDate
				   		   })
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : []
		});
		
		oInputLayout.addContent(oIssuedDatePanel);
		
		var oCell1, oRow1;
		
		var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		for(var i=0; i<5; i++) {
			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSN[i]})]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massn" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassn
				           })
				           ]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSG[i]})]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massg" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassg
				           })
				           ]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oIssuedTypeMatrix.addRow(oRow1);
		}
		
		var oActTypeReasonPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "발령유형/사유", design : "Bold"}).addStyleClass("L2P13Font"),
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedTypeMatrix]
		});
		
		oInputLayout.addContent(oActTypeReasonPanel);
		
		var oCell2, oRow2 = null;
		
		var oIssuedHistoryMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_MatrixLayout", {
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		var oActdHistoryPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://expense-report", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : "발령내역", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width: "10px"}),
				           new sap.m.Label({text : "발령유형 및 이유를 선택하신 후 발령내역입력 스위치를 ON 해 주시기 바랍니다.", visible : true}).addStyleClass("L2P12Font L2P12Notice"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Label({text : "발령내역입력", visible : true}).addStyleClass("L2P13Font"),
				           new sap.m.Switch(oController.PAGEID + "_Input_Switch", {visible : true, enabled : false, change : oController.onChangeSwitch}),
				           new sap.m.ToolbarSpacer({width: "10px"}),				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedHistoryMatrix]
		});
		
		oInputLayout.addContent(oActdHistoryPanel);
		
		var oRightScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_RightScrollContainer", {
			content : oInputLayout,
			width: "100%",
			height : "500px",
			horizontal : false,
			vertical : true
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oRightScrollContainer]
		});
		
		oRow.addCell(oCell);
		
		oMainLayout.addRow(oRow);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ //new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oMainLayout
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
			contentLeft : [
			               
			               new sap.m.Button(oController.PAGEID + "_ADDPERSON_BTN", {
			            	   text : "대상등록",
			            	   press : oController.addPerson
			               }),
			               //new sap.m.ToolbarSpacer(), 
			               new sap.m.Button(oController.PAGEID + "_ALLSELECT_BTN", {
			            	   text : "전체선택",
			            	   press : oController.onPressAllSelect
			               }),
			               new sap.m.Button(oController.PAGEID + "_ALLUNSELECT_BTN", {
			            	   text : "전체해제",
			            	   press : oController.onPressAllUnSelect
			               }),
			               ],
		 	contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVEPERSON_BTN", {
		 	                	text : "저장",
		 	                	enabled : false,
		 	                	press : oController.onPressSave
		 	                }),
		 	                new sap.m.Button({
		 	                	text : "취소",
		 	                	press : oController.navToBack
		 	                })
		 	                ]
		}); 
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
									   			text : "발령대상자"
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});