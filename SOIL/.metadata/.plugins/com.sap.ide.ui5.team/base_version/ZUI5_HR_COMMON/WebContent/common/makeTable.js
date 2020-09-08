jQuery.sap.declare("common.makeTable");

common.makeTable = {
	
	makeColumn : function(oController, oTable, vColumnInfo){
		if(!oTable) return;
		if(!vColumnInfo || !vColumnInfo.length) return;
		
		var oColumns = oTable.getColumns();
		if(oColumns && oColumns.length && oColumns.length > 0) {
			
		} else{
			oTable.destroyColumns();
		}		
		
		for(var i=0; i<vColumnInfo.length; i++) {
			var oColumn = new sap.ui.table.Column({
				hAlign : "Center",
//	        	vAlign : "Middle",
				flexible : false,
	        	autoResizable : true,
	        	resizable : true,
				showFilterMenuEntry : true
			});	
			
			if(vColumnInfo[0].resizable && vColumnInfo[0].resizable == "X"){
				oColumn.setResizable(false);
			}
			
			if(vColumnInfo[i].filter) {
				oColumn.setFilterProperty(vColumnInfo[i].id);
			}
			
			if(vColumnInfo[i].sort) {
				oColumn.setSortProperty(vColumnInfo[i].id);
			}
			
			oColumn.addMultiLabel(new sap.ui.commons.TextView({text : vColumnInfo[i].label, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
			
			if(vColumnInfo[i].plabel != "") {
				oColumn.addMultiLabel(new sap.ui.commons.TextView({text : vColumnInfo[i].plabel, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
			}
			
			if(vColumnInfo[i].span > 0) {
				oColumn.setHeaderSpan([vColumnInfo[i].span, 1]);
			}
			
			if(vColumnInfo[i].width && vColumnInfo[i].width != "") {
				oColumn.setWidth(vColumnInfo[i].width);
			}
			
			if(vColumnInfo[i].align && vColumnInfo[i].align != "") {
				oColumn.setHAlign(vColumnInfo[i].align);
			}
			
			/*************************/
			var oTemplate;
			
			switch (vColumnInfo[i].type){
				case "mtext":
					oTemplate = new sap.m.Text({
									text : "{" + vColumnInfo[i].id + "}",
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					
					if(vColumnInfo[i].align && vColumnInfo[i].align != "")
						oTemplate.setTextAlign(vColumnInfo[i].align);					
					break;
				case "date":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : vColumnInfo[i].id, 
										type : new sap.ui.model.type.Date({pattern: "yyyy.MM.dd"})
									},
									textAlign : "Center",
									width : "100%"
						        }).addStyleClass("FontFamily");
					break;
				case "date2":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										parts : [{path : vColumnInfo[i].id.split("/")[0]}, {path : vColumnInfo[i].id.split("/")[1]}],
										formatter : function(fVal1, fVal2){
											this.removeStyleClass("colorRed");
											
											if(fVal2 == "X")
												this.addStyleClass("colorRed");
											
											return fVal1; 
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "date3":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										parts : [{path : vColumnInfo[i].id.split("/")[0]},{path : vColumnInfo[i].id.split("/")[1]}],
										formatter : function(fVal1, fVal2){
											this.removeStyleClass("colorRed");
											
											if(fVal2 == "X")
												this.addStyleClass("colorRed");
											
											return fVal1;
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "date4":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : vColumnInfo[i].id,
										formatter : function(fVal){
											if(fVal && fVal.indexOf("-") != -1){
												var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"});
												return dateFormat.format(new Date(fVal));
											} else {
												return "";
											}
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "day2":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										parts : [{path : vColumnInfo[i].id},{path : "Offyn"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 || fVal2){
												this.removeStyleClass("colorRed");
												
												if(fVal2 == "X")
													this.addStyleClass("colorRed");
												
												return fVal1;
											}
										}
									},
									textAlign : "Center"
								}).addStyleClass("Font14");
					break;
				case "link":
					oTemplate = new sap.m.Link({
									text : "{" + vColumnInfo[i].id + "}", 
									press : oController.onSelectTable,
									customData : [new sap.ui.core.CustomData({key : "", value : vColumnInfo[i].id}),
												  new sap.ui.core.CustomData({key : "", value : "{Zzjikch}"})]
								}).addStyleClass("Font14");
					break;
				case "time":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : vColumnInfo[i].id,
										formatter : function(fVal){
											if(fVal && fVal != "")
												return fVal.substring(0,2) + ":" + fVal.substring(2,4);
											else 
												return "";
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "money":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : vColumnInfo[i].id,
										formatter : function(fVal){
											if(fVal)
												return fVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
											else
												return "";
										}
									},
									textAlign : "End"
								}).addStyleClass("FontFamily");
					break;
				case "file":
					oTemplate = new sap.ui.core.Icon({
									size : "15px",
									src : "sap-icon://attachment",
									press :common.makeTable.onOpenAttachList,
									customData : [new sap.ui.core.CustomData({key : "Controller", value:oController}),
										          new sap.ui.core.CustomData({key : "Appno", value:"{Appno}"})],
									visible: true
								}).addStyleClass("PaddingTop4");
					break;
				case "SelectIcon":
					oTemplate = new sap.ui.core.Icon({
									size : "1rem",
									src : "sap-icon://arrow-right",
									color : "#ff0000",
									customData : new sap.ui.core.CustomData({key : "", value : "{Idx}"}),
									visible : {
										path : vColumnInfo[i].id,
										formatter : function(fVal){
											if(fVal && fVal == "X") return true;
											else return false;
										}
									}
								}).addStyleClass("CursorPointer");
					break;
				case "profile":
					oTemplate = new sap.m.Link({
									text : "{" + vColumnInfo[i].id + "}",
									textAlign : "Center",
									customData : [new sap.ui.core.CustomData({key : "", value : vColumnInfo[i].id}),
												  new sap.ui.core.CustomData({key : "", value : "{Idx}"})],
									press : oController.onNavtoProfile
								});
					break;
				case "popover3":
					oTemplate = new sap.m.Toolbar({
									content : [new sap.m.ToolbarSpacer(),
											   new sap.ui.core.Icon({
													size : "0.875rem",
													src : "sap-icon://puzzle",
													visible: {
														path : vColumnInfo[i].id,
														formatter : function(fVal) {
															if(fVal && fVal != "") return true;
															else return false;
														}
													},
													press : oController.onPopover,
													customData : new sap.ui.core.CustomData({key : "ZappResn", value : "{ZappResn}"})
												}),
												new sap.m.ToolbarSpacer()]
								}).addStyleClass("ToolbarNoBottomLine");
					break;
				case "popoverC":
					oTemplate = new sap.m.Link({
									text : "{" + vColumnInfo[i].id + "}",
									textAlign : "Center",
									press : oController.onEmpListPopover,
									customData : new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"})
								}).addStyleClass("FontFamily");
					break;
				case "Apstatus":
					oTemplate = new sap.ui.commons.TextView({
									textAlign : "Center",
									text: "{" + vColumnInfo[i].id + "}",
									semanticColor: {
										path : "ApStatus", 
										formatter : function(fVal) {
											if(fVal == "5") return "Positive";
											else return "Default";
										}
									}
							    }).addStyleClass("Font14 FontBold");
					break;
				case "ZappStatAl":
					oTemplate = new sap.ui.commons.TextView({
									textAlign : "Center",
									text: "{" + vColumnInfo[i].id + "}",
									semanticColor: {
										path : "ZappStatAl", 
										formatter : function(fVal) {
											if(fVal == "10") return "Default";
											else if(fVal == "20") return "Critical";
											else if(fVal == "30") return "Positive";
											else if(fVal == "35") return "Negative";
											else if(fVal == "40") return "Critical";
											else if(fVal == "50") return "Positive";
											else if(fVal == "55") return "Negative";
											else if(fVal == "90") return "Negative";											
										}
									},
							    }).addStyleClass("Font14 FontBold");
					break;
				case "appename":
					oTemplate = new sap.m.Toolbar({
									style : "Clear",
									content : [new sap.m.ToolbarSpacer({width : "4px"}),
											   new sap.m.Image({src : "{" + vColumnInfo[i].id.split("/")[0] + "}", height : "35px", width : "25px"}),
											   new sap.m.ToolbarSpacer({width : "2px"}),
											   new sap.m.Text({text : "{" + vColumnInfo[i].id.split("/")[1] + "}"}).addStyleClass("FontFamily"),
											   new sap.m.ToolbarSpacer()]
								});
					break;
				case "Statx":
					oTemplate = new sap.ui.commons.TextView({
									textAlign : "Center",
									text : {
										parts : [{path : "Statx"}, {path : "Stacd"}],
										formatter : function(fVal1, fVal2){
											this.removeStyleClass("colorOrange colorGreen colorBlue colorRed");
											
											if(fVal1 && fVal2 == "0"){
												this.addStyleClass("colorOrange");
											} else if(fVal1 && fVal2 == "1"){
												this.addStyleClass("colorGreen");
											} else if(fVal1 && fVal2 == "2"){
												this.addStyleClass("colorBlue");
											} else if(fVal1 && fVal2 == "3"){
												this.addStyleClass("colorRed");
											}
											
											return fVal1;											
										}
									}
								}).addStyleClass("FontFamily FontBold");
					break;
				case "Tdtyp":
				case "Tdtaddyp":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : vColumnInfo[i].id,
										formatter : function(fVal){
											this.removeStyleClass("colorRed");
											
											if(fVal >= 0) return fVal;
											else if(fVal == "-") return fVal;
											else {
												this.addStyleClass("colorRed");
												return fVal;
											}
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "formatday":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										path : vColumnInfo[i].id,
										formatter : function(fVal){
											if(fVal == "X") return "O";
											else return "";
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "Ttext":
					oTemplate = new sap.ui.commons.layout.HorizontalLayout({
									content : [
										// 근무시간
										new sap.m.Text({
											text : {
												path : vColumnInfo[i].id,
												formatter : function(fVal){
													if(fVal){
														var tmp = fVal.indexOf("(");
														if(tmp == -1){
															return fVal;
														} else {
															this.addStyleClass("FontFamily");
															return fVal.substring(0,tmp).trim();
														}
													} else {
														return "";
													}																							
												}
											}
										}),
										// 휴게시간
										new sap.m.Text({
											text : {
												path : vColumnInfo[i].id,
												formatter : function(fVal){
													if(fVal){
														var tmp = fVal.indexOf("(");
														if(tmp == -1){
															return "";
														} else {
															this.addStyleClass("Font12");
															return fVal.substring(tmp);
														}
													} else {
														return "";
													}
												}
											}
										}).addStyleClass("PaddingLeft3")
									]
								});
					break;
				case "Process":
					oTemplate = new sap.ui.layout.HorizontalLayout({
									content : [
										new sap.m.Button({
											type : "Reject", 
											icon : "sap-icon://decline",
											customData : [new sap.ui.core.CustomData({key : "", value : oTable.sId}),
														  new sap.ui.core.CustomData({key : "", value : "{Idx}"})],
											press : oController.onDeleteTableData,
											tooltip : oBundleText.getText("DELETE_BTN"),
											visible : {
												parts : [{path : "Flag"}, {path : vColumnInfo[i].id}],
												formatter : function(fVal1, fVal2){
													if(fVal1 == "" && fVal2 != "") return true;
													else return false;
												}
											}
										}).addStyleClass("PaddingRight3"),
										new sap.m.Button({
											type : "Accept", 
											icon : "sap-icon://edit",
											customData : [new sap.ui.core.CustomData({key : "", value : oTable.sId}),
														  new sap.ui.core.CustomData({key : "", value : "{Idx}"})],
											press : oController.onChangeTableData,
											tooltip : oBundleText.getText("TITLE_MOD"),
											visible : {
												parts : [{path : "Flag"}, {path : vColumnInfo[i].id}],
												formatter : function(fVal1, fVal2){
													if(fVal1 == "" && (fVal2 == "C" || fVal2 == "M")) return true;
													else return false;
												}
											}
										})
									]
								});
					break;
				case "Day":
					oTemplate = new sap.ui.commons.TextView({
									text : {
										parts : [{path : vColumnInfo[i].id},{path : vColumnInfo[i].id2}],
										formatter : function(fVal1, fVal2){
											if(fVal1 || fVal2){
												this.removeStyleClass("colorRed");
												
												if(fVal2 == "X")
													this.addStyleClass("colorRed");
												
												return fVal1;
											}
										}
									},
									textAlign : "Center"
								}).addStyleClass("FontFamily");
					break;
				case "Dtrsn":	// 특근,휴가 상세사유
					oTemplate = new sap.m.Button({
									icon : "sap-icon://search",
									customData : [new sap.ui.core.CustomData({key : "", value : "{Tmdat}"}),
										 		  new sap.ui.core.CustomData({key : "", value : "{Dtrsn}"})],
									press : function(oEvent){
										common.makeTable.onPressDtrsn(oEvent, oController);
									},
									visible : {
										path : "Dtrsn",
										formatter : function(fVal){
											return fVal == "" ? false : true;
										}
									}
								});
					break;
				case "Checkbox":
					oTemplate = new sap.m.CheckBox({
									selected  : "{" + vColumnInfo[i].id + "}" 
								});
					break;
				case "YetCheckbox1":
					oTemplate = new sap.m.CheckBox({
									selected  : "{" + vColumnInfo[i].id + "}",
									editable : {
										path : "Pdcid",
										formatter : function(fVal){
											return fVal == true ? true : false;
										}
									}
								});
					break;
				case "YetCheckbox2":
					oTemplate = new sap.m.CheckBox({
									selected  : "{" + vColumnInfo[i].id + "}",
									editable : false
								});
					break;
				case "ProgressIndicator":
					oTemplate = new sap.m.ProgressIndicator({
									showValue : true,
									displayValue :  "{" + vColumnInfo[i].id + "}" + "%",
									percentValue  : "{" + vColumnInfo[i].id + "}",	
									state: {
										path : vColumnInfo[i].id, 
										formatter : function(fVal){
											if(fVal){
												if(fVal < 50){
													return sap.ui.core.ValueState.Error;
												}else if (fVal >= 50 && fVal < 100){
													return sap.ui.core.ValueState.Warning;
												}else {
													return sap.ui.core.ValueState.Success;
												}
											}
										}
									} 
							   });
					break;
				case "YET":
					oTemplate = new sap.ui.core.Icon({
									src : "sap-icon://accept",
									color : "red",
									visible : {
										path : vColumnInfo[i].id,
										formatter : function(fVal){
											return fVal == "X" ? true : false;
										}
									}
								});
					break;
				default:					
					oTemplate = new sap.ui.commons.TextView({
									text : "{" + vColumnInfo[i].id + "}",
									width : "100%"
							    }).addStyleClass("FontFamily");
					
					if(vColumnInfo[i].align && vColumnInfo[i].align != ""){
						oTemplate.setTextAlign(vColumnInfo[i].align);

						if(oController.PAGEID == "tmcalendarDetail" || oController.PAGEID == "tmcalendar" || oController.PAGEID == "applicationList")
							oTemplate.addStyleClass("PaddingLeft5");
					
					} else {
						oTemplate.setTextAlign("Center");
					}
					
					break;
			}			
			
			oColumn.setTemplate(oTemplate);
			oTable.addColumn(oColumn);
		}
		
	},
	
	onPressDtrsn : function(oEvent, oController){
		if(!oController._DtrsnPopover){
			var oView = oController.getView();
			
			oController._DtrsnPopover = sap.ui.jsfragment("fragment.Dtrsn", oController);
			oView.addDependent(oController._DtrsnPopover);
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"});
		
		var oJSONModel = oController._DtrsnPopover.getModel();
		var vData = {
				Data : {
					Title : dateFormat.format(oEvent.getSource().getCustomData()[0].getValue()) + " 상세사유",
					Dtrsn : oEvent.getSource().getCustomData()[1].getValue()
				}
		};
		
		oJSONModel.setData(vData);
		oController._DtrsnPopover.openBy(oEvent.getSource());
	},
	
	onOpenAttachList : function(oEvent){
		var oControl = this;
		var vAppno = "" , _ActPersonPopover = null, oController = null ;
		var oCustomData = oControl.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Appno") {
					vAppno = oCustomData[i].getValue();
				}else if(oCustomData[i].getKey() == "Controller"){
					oController = oCustomData[i].getValue();
				}
			}
		}
		
		if(!oController._AttachFilePopover) {
			oController._AttachFilePopover = sap.ui.jsfragment("fragment.AttachFilePopover", oController);
			oController.getView().addDependent(oController._AttachFilePopover);
		}
		
		oController._AttachFilePopover.removeAllCustomData();
		
		oController._AttachFilePopover.addCustomData(new sap.ui.core.CustomData({key : "Controller", value : oController}));
		oController._AttachFilePopover.addCustomData(new sap.ui.core.CustomData({key : "Appno", value : vAppno}));
	
		oController._AttachFilePopover.openBy(oControl);
	},
	
	onBeforeOpenFile : function(oEvent){
		var oControl = this;
		
		var vAppno = "" , oController = null ;
		var oCustomData = oControl.getCustomData();
		
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Appno") {
					vAppno = oCustomData[i].getValue();
				}else if(oCustomData[i].getKey() == "Controller"){
					oController = oCustomData[i].getValue();
				}
			}
		}
		 var oFilePopColumn = sap.ui.getCore().byId(oController.PAGEID + "_FilePopColumn");
		 var oFilePopList = sap.ui.getCore().byId(oController.PAGEID + "_FilePopList");
		 var oFilters = [];
		 oFilters.push(new sap.ui.model.Filter("Appno", sap.ui.model.FilterOperator.EQ, vAppno ));
		 oFilters.push(new sap.ui.model.Filter("Zworktyp", sap.ui.model.FilterOperator.EQ, oController._vZworktyp));
		
		 oFilePopList.bindItems("/FileListSet", oFilePopColumn, null, oFilters);
	},
	
	onDownloadFile : function(oEvent){
		var vAttachid = oEvent.getSource().getCustomData()[0].getValue("Fileuri");
		document.iWorker.location.href = vAttachid;		
	}
	
};