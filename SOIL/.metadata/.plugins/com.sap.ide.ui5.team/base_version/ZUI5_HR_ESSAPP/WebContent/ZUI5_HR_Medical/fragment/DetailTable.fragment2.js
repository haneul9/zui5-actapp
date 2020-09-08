sap.ui.jsfragment("ZUI5_HR_Medical.fragment.DetailTable", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		// 영수증 구분
		var oRecpgb  = new sap.m.Select({
			selectedKey : "{Recpgb}",
            enabled : { path : "ZappStatAl" ,
				  formatter : function(fVal){
					 if(fVal == "" || fVal == "10") return true ;
					  else return false;
				  }
	            },
	        change : oController.onChangeRecpgb  ,
	        customData : [new sap.ui.core.CustomData({key : "", value : "{Idx}"})]
		});
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		var oPath = "/MedicalReceiptListSet";
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						for(var i = 0 ; i < data.results.length; i++){
							oRecpgb.addItem(new sap.ui.core.Item({key: data.results[i].Recpgb, text: data.results[i].Recpgbtx}));	
						}
					}
				},
				function(res){console.log(res);}
		);	
		
		var oForyn  = new sap.m.Select({
			selectedKey : "{Foryn}",
            enabled : { path : "ZappStatAl" ,
				  formatter : function(fVal){
					 if(fVal == "" || fVal == "10") return true ;
					  else return false;
				  }
	            },
	        change : oController.onChangeForyn,
	        customData : [new sap.ui.core.CustomData({key : "", value : "{Idx}"})]
		});
		
		var oPath = "/MedicalMothodListSet";
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						for(var i = 0 ; i < data.results.length; i++){
							oForyn.addItem(new sap.ui.core.Item({key: data.results[i].Foryn, text: data.results[i].Foryntx}));	
						}
					}
				},
				function(res){console.log(res);}
		);	
		
		var oMedty = new sap.m.ComboBox({
			selectedKey : "{Medty}",
            editable : { path : "ZappStatAl" ,
				  formatter : function(fVal){
					 if(fVal == "" || fVal == "10") return true ;
					  else return false;
				  }
	        },
	        change : oController.onChangeMdedty,
	        customData : [new sap.ui.core.CustomData({key : "", value : "{Idx}"})]
	    }).addStyleClass("L2PFontFamily");
		
		var vFamgb = oController._DetailJSonModel.getProperty("/Data/Famgb");
		if(vFamgb && vFamgb != ""){
			// 질병 유형 Entry 조회
			var oPath = "/MedicalTypeListSet?$filter=Famgb eq '" + vFamgb +"'";
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							for(var i = 0 ; i < data.results.length; i++){
								oMedty.addItem(new sap.ui.core.Item({key: data.results[i].Medty, text: data.results[i].Medtytx}));	
							}
						}
					},
					function(res){console.log(res);}
			);
		}
		
		var oColumnList = new sap.m.ColumnListItem({
			counter : 10,
			cells : [
				new sap.m.Text({
				     text : "{Idx}" 
				}).addStyleClass("L2PFontFamily"),
			    new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Begda}",
		            change : oController.onChangeTableDate,
		            editable : { path : "ZappStatAl" ,
					  formatter : function(fVal){
						 if(fVal == "" || fVal == "10") return true ;
						  else return false;
					  }
		            }
			    }).addStyleClass("L2PFontFamily"),
			    new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            change : oController.onChangeTableDate,
		            value : "{Endda}",
		            editable : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							 if(fVal == "" || fVal == "10") return true ;
							  else return false;
						  }
			            }
			    }).addStyleClass("L2PFontFamily"),
			    oMedty,
			    new sap.m.CheckBox({
				     selected : "{Samyn}" ,
				     enabled : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							 if(fVal == "" || fVal == "10") return true ;
							  else return false;
						  }
			            },
			        select : oController.onSelectSamyn, 
			        customData : [new sap.ui.core.CustomData({key : "", value : "{Idx}"})]
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Input({
			     value : "{Disenm}" , 
			     showValueHelp: true,
        	     valueHelpOnly: true,
        	     customData : [new sap.ui.core.CustomData({key : "", value : "{Idx}"})],
			  	 valueHelpRequest: oController.displayDisecdDialog,
			     editable : { 
	            	 parts : [{path : "ZappStatAl"}, {path : "Samyn"}], 
	             	 formatter : function(fVal1, fVal2){
						 if((fVal1 == "" || fVal1 == "10") && fVal2 == false) return true ;
						 else return false;
					 }
		           }
			    }).addStyleClass("L2PFontFamily"),
				new sap.m.Input({
					value : "{Medorg}" , 
					maxLength : common.Common.getODataPropertyLength("ZHR_MEDICAL_SRV", "MedicalExpenseAppl", "Medorg"),
		            editable : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							 if(fVal == "" || fVal == "10") return true ;
							  else return false;
						  }
			            }
				}).addStyleClass("L2PFontFamily"),
				oForyn,
				oRecpgb,
				new sap.m.Input({
					 value : {  path : "Apamt",
							formatter : function(fVal){
								return common.Common.numberWithCommas(fVal);
							},
					 },
					 textAlign : "End",
				     maxLength : 14,
				     change : oController.onChangeApamt,
				     customData : [new sap.ui.core.CustomData({key : "", value : "{Idx}"})],
		             editable : { path : "ZappStatAl" ,
						  formatter : function(fVal){
							 if(fVal == "" || fVal == "10") return true ;
							  else return false;
						  }
			            }
				}).addStyleClass("L2PFontFamily Number"),
				new sap.m.Input({
				     value : {  path : "Deamt",
								formatter : function(fVal){
									return common.Common.numberWithCommas(fVal,"X");
								},
				     },
				     textAlign : "End",
					 maxLength : 14,
		             editable : false
				}).addStyleClass("L2PFontFamily Number"),
				new sap.m.Input({
				     value : {  path : "Total",
								formatter : function(fVal){
									return common.Common.numberWithCommas(fVal,"X");
								},
				     },
				     textAlign : "End",
					 maxLength : 14,
		             editable : false
				}).addStyleClass("L2PFontFamily Number"),
				new sap.m.Input({
				     value : {  path : "Pyamt",
								formatter : function(fVal){
									return common.Common.numberWithCommas(fVal, "X");
								},
				     },
				     textAlign : "End",
					 maxLength : 14,
		             editable : false
				}).addStyleClass("L2PFontFamily Number"),
				new sap.m.Input({
				     value : "{Notes}" ,
				     maxLength : 100,
				     editable : { 
		            	 parts : [{path : "ZappStatAl"}], 
		             	 formatter : function(fVal){
							 if((fVal == "" || fVal == "10")) return true ;
							 else return false;
						 }
			           }
				    }).addStyleClass("L2PFontFamily"),
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_DetailTable", {
			inset : false,
			mode : "MultiSelect",
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			fixedLayout : false,
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight cellBorderLeft",
			        	  width : "30px",
			        	  minScreenWidth: "tablet"}),
				      new sap.m.Column({
			        	  header: new sap.m.Label({text : "진료시작일"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "100px",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "진료종료일"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "100px",
			        	  minScreenWidth: "tablet"}), 
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "질병유형"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "80px",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "동일병명"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "5%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "병명"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "15%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "진료기관"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "12%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "입원/외래"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "6%",
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}), 
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "영수증구분"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "6%",
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "신청금액"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Right,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}), 	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "공제금액"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Right,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}), 	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "신청합계" ,}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Right,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
	        	      new sap.m.Column({
			        	  header: new sap.m.Label({text : "지원금액" ,}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Right,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"}),
	        	      new sap.m.Column({
			        	  header: new sap.m.Label({text : "비고" ,}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  width : "250px",
			        	  hAlign : sap.ui.core.TextAlign.Left,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"})
			          ]
		});
		
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.bindItems("/Data", oColumnList);
		oTable.setKeyboardMode("Edit");	
		
		

//		oTable.addEventDelegate({
//			onAfterRendering : function(){
//				
//			}
//		});
		
		return oTable;
		
	
	}
});