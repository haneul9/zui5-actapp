sap.ui.jsfragment("ZUI5_HR_CompanyHouse.fragment.DetailTable", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.m.Table(oController.PAGEID + "_DetailTable", {
			inset : false,
			mode : "MultiSelect",
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			//mode : "MultiSelect",
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("FontFamilyBold"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight cellBorderLeft",
			        	  width : "6%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0038")}).addStyleClass("FontFamilyBold"),	// 38:성명
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "14%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0121")}).addStyleClass("FontFamilyBold"),	// 121:생년월일
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "14%",
			        	  minScreenWidth: "tablet"}), 
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1085")}).addStyleClass("FontFamilyBold"),	// 1085:관계
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "18%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_2181")}).addStyleClass("FontFamilyBold"),	// 2181:직업
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "22%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_2376")}).addStyleClass("FontFamilyBold"),	// 2376:휴대폰
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
//			        	  width : "22%",
			        	  minScreenWidth: "tablet"}),
			          ],
			items: {
				path: "/Data",
				templateShareable:true,
				template: new sap.m.ColumnListItem({
					counter : 10,
					cells : [
						new sap.m.Text({
						     text : "{Idx}" 
						}).addStyleClass("FontFamily"),
						new sap.m.Input({
					     value : "{Ename}" , 
					     maxLength : common.Common.getODataPropertyLength("ZHR_MEDICAL_SRV", "MedicalExpenseAppl", "Disenm"),
			             editable : { path : "ZappStatAl" ,
							  formatter : function(fVal){
								 if(fVal == "" || fVal == "1") return true ;
								  else return false;
							  }
				            }
					    }).addStyleClass("FontFamily"),
					    new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            //change : oController.onChangeTableDate,
				            value : "{Gbdat}",
				            editable : { path : "ZappStatAl" ,
								  formatter : function(fVal){
									 if(fVal == "" || fVal == "1") return true ;
									  else return false;
								  }
					            }
					    }).addStyleClass("FontFamily"),	
						new sap.m.ComboBox({
							width : "95%" ,
							items:{
								path: "ZHR_COMPANYHOUSE_SRV>/FamilyRelationCodeListSet",
								templateShareable:true,
								template: new sap.ui.core.ListItem({
									key: "{ZHR_COMPANYHOUSE_SRV>Key}",
									text: "{ZHR_COMPANYHOUSE_SRV>Value}"
								})
							},
				            editable : { path : "ZappStatAl" ,
								  formatter : function(fVal){
									 if(fVal == "" || fVal == "1") return true ;
									  else return false;
								  }
					         },
							 selectedKey : "{Kdsvh}"
						}),			    
						new sap.m.Input({
							value : "{Job}" , 
				            editable : { path : "ZappStatAl" ,
								  formatter : function(fVal){
									 if(fVal == "" || fVal == "1") return true ;
									  else return false;
								  }
					            }
						}).addStyleClass("FontFamily"),
						new sap.m.Input({
						     value : "{Mobile}" ,
				             editable : { path : "ZappStatAl" ,
								  formatter : function(fVal){
									 if(fVal == "" || fVal == "1") return true ;
									  else return false;
								  }
					            }
						}).addStyleClass("FontFamily Number")
					]
				})
			}
		});
		
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.setKeyboardMode("Edit");	
		
		return oTable;
		
	
	}
});