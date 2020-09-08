sap.ui.jsview("zui5_hrxx_actapp2.ActAppPersonInfo", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp2.ActAppPersonInfo
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActAppPersonInfo";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp2.ActAppPersonInfo
	*/ 
	createContent : function(oController) {
		
		var oCell, oRow;
		var vMASSN = ["1st 발령유형","2nd 발령유형","3rd 발령유형","4th 발령유형","5th 발령유형"];
		var vMASSG = ["1st 발령사유","2nd 발령사유","3rd 발령사유","4th 발령사유","5th 발령사유"];
		
		var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2
		});
		 
		var oCustomListItem = new sap.m.CustomListItem({
			content : new sap.suite.ui.commons.BusinessCard({
				firstTitle: new sap.ui.commons.Label({text:"{Ename}"}).addStyleClass("L2PFontFamily L2PFontFamilyBold"),
			    iconPath: "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/person.png",
			    secondTitle: {
	   		    	parts : [{path : "Docty"} , {path : "Zzjobgrtx"}, {path : "Zzcaltltx"}, {path : "Zzpsgrptx"}, {path : "VoldId"}],
			    	formatter : function(v1, v2, v3 ,v4 , v5) {
			    		if(v1 == "20"){ // 채용발령
			    			if(v2 == undefined || v3 == undefined || v5 == undefined) return "";
			    			else return v2 + " / " + v3 + " / " + v5;
			    		}else{
			    			if(v2 == undefined || v3 == undefined || v4 == undefined) return "";
			    			else return v2 + " / " + v3 + " / " + v4;
			    		}
			    		
			    		
			    	}},
			    content : new sap.ui.commons.Label({text:"{Fulln}"}).addStyleClass("L2PFontFamily")
			}).addStyleClass("L2PFontFamily")
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
			content : [new sap.ui.core.HTML({content : "<div style='height : 8px;'/>"}), oList],
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
		}).addStyleClass("WhiteBackground");
		
		oRow.addCell(oCell);
		
		var oInputLayout = new sap.ui.commons.layout.VerticalLayout();
		

		
		var oIssuedDateLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["15%","85%"],
		});
		var oCell3, oRow3;		
		oRow3 = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		
		oCell3 = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text :"발령일" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow3.addCell(oCell3);
		
		oCell3 = new sap.ui.commons.layout.MatrixLayoutCell({
			content : 		new sap.m.Toolbar({
				content : [
					   new sap.m.DatePicker(oController.PAGEID + "_Actda", {
			        	   width : "200px",
			   			   valueFormat : "yyyy-MM-dd",
			           	   displayFormat : gDtfmt,
			           	   change : oController.onChangeActda
			   		   }),
			   		   new sap.m.Button(oController.PAGEID + "_ChangeDate",{
			   			   text : "수정",
			   			   visible : false,
			   			   press : oController.onPressChangeDate
			   		   })]
			}).addStyleClass("L2PToolbarNoBottomLine") 
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
		oRow3.addCell(oCell3);
		oIssuedDateLayout.addRow(oRow3);
		
		var oActdaPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://open-command-field",  size : "1.0rem"}),
					       new sap.m.ToolbarSpacer({width : "5px"}),
				           new sap.m.Label({text : "발령일"}).addStyleClass("L2PFontFamilyBold"),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedDateLayout]
		});
		oInputLayout.addContent(new sap.ui.core.HTML({content : "<div style='height:10px;'> </div>",	preferDOM : false}));
		oInputLayout.addContent(oActdaPanel);
		
		var oCell1, oRow1;
		
		var oIssuedTypeMatrix1 = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_IssuedTypeMatrix1",{
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		var oIssuedTypeMatrix2 = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_IssuedTypeMatrix2",{
			width : "100%",
			layoutFixed : true,
			columns : 4,
			visible : false,
			widths: ["15%","35%","15%","35%"],
		});
		
		for(var i=0; i<1; i++) {
			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSN[i]}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.ComboBox(oController.PAGEID + "_Massn" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassn
				           })
				           ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSG[i]}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.ComboBox(oController.PAGEID + "_Massg" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassg
				           })
				           ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oIssuedTypeMatrix1.addRow(oRow1);
		}
		
		for(var i=1; i<5; i++) {
			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSN[i]}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.ComboBox(oController.PAGEID + "_Massn" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassn
				           })
				           ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : vMASSG[i]}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.ComboBox(oController.PAGEID + "_Massg" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassg
				           })
				           ]
			}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oIssuedTypeMatrix2.addRow(oRow1);
		}
		
		var oActTypeReasonPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://open-command-field",  size : "1.0rem"}),
					       new sap.m.ToolbarSpacer({width : "5px"}),
				           new sap.m.Label({text : "발령유형/사유", design : "Bold"}).addStyleClass("L2PFontFamilyBold"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Label({text : "추가발령", visible : true}).addStyleClass("L2PFontFamily"),
				           new sap.m.Switch(oController.PAGEID + "_Reason_Switch", {visible : true, enabled : true, state : false, change : oController.onChangeReasonSwitch}),
				           new sap.m.ToolbarSpacer({width: "10px"})
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedTypeMatrix1, oIssuedTypeMatrix2]
		});
		oInputLayout.addContent(new sap.ui.core.HTML({content : "<div style='height:5px;'> </div>",	preferDOM : false}));
		oInputLayout.addContent(oActTypeReasonPanel);
		
		var oCell2, oRow2 = null;
		
//		var oIssuedHistoryMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_MatrixLayout", {
//			width : "100%",
//			layoutFixed : true,
//			columns : 4,
//			widths: ["15%","35%","15%","35%"],
//		});
//		
//		var oGroupingInputLayout = new sap.uxap.ObjectPageLayout(oController.PAGEID + "_GroupingInputLayout", {
//			sections : []
//		});
		
		var oControlsLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_ActionControlsLayout", {
			width : "100%",
			content: [],
		});
		
		var oActdHistoryPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://open-command-field",  size : "1.0rem"}),
				           new sap.m.ToolbarSpacer({width : "5px"}),
				           new sap.m.Label({text : "발령내역"}).addStyleClass("L2PFontFamilyBold"),
				           new sap.m.ToolbarSpacer({width: "10px"}),
				           new sap.m.Label({text : "발령유형 및 이유를 선택하신 후 발령내역입력 스위치를 ON 해 주시기 바랍니다.", visible : true}).addStyleClass("L2P12Font L2P12Notice"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Label({text : "발령내역입력", visible : true}).addStyleClass("L2PFontFamily"),
				           new sap.m.Switch(oController.PAGEID + "_Input_Switch", {visible : true, enabled : false, change : oController.onChangeSwitch}),
				           new sap.m.ToolbarSpacer({width: "10px"}),				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oControlsLayout]
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
			content : [ oMainLayout ]
		});
		
		var oFooterBar = new sap.m.Bar({
			contentLeft : [
			               
			               new sap.m.Button(oController.PAGEID + "_ADDPERSON_BTN", {
			            	   text : "대상등록",
			            	   press : oController.addPerson
			               }),
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
		 	                	icon : "sap-icon://save" ,
		 	                	press : oController.onPressSave
		 	                }),
		 	                new sap.m.Button({
		 	                	text : "취소",
		 	                 	icon : "sap-icon://decline" ,
		 	                	press : oController.navToBack
		 	                })
		 	                ]
		});		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
//								contentLeft : new sap.m.Button({
//												icon : "sap-icon://nav-back" ,
//												press: oController.navToBack
//											}),
								contentLeft : new sap.m.Button({type : "Back", press : oController.navToBack}),
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
									   			text : "발령대상자"
								}).addStyleClass("TitleFont"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeader L2pHeaderPadding") ,
			footer : oFooterBar 
		}).addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});