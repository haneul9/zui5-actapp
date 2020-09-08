sap.ui.jsfragment("ZUI5_HR_Portal.fragment.HomeM", {
	
	createContent : function(oController) {
		var oRow , oCell ;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
		});
		var oBlockLayout = "", vAdid = "";
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		if(vEmpLoginInfo.length> 0){
			vAdid = vEmpLoginInfo[0].Adid;
		}
		
		if(vAdid == "X"){
			oBlockLayout = new sap.ui.layout.HorizontalLayout({
				allowWrapping :true,
				content :  [ 
								new sap.ui.layout.VerticalLayout({
									content : [sap.ui.jsfragment("ZUI5_HR_Portal.fragment.EmployeeM",oController)
								              ]
								}).addStyleClass("PaddingLeft20"),
								new sap.ui.layout.VerticalLayout({
									content : [sap.ui.jsfragment("ZUI5_HR_Portal.fragment.TotalRewardDashbordM",oController)
								              ]
								}).addStyleClass("PaddingLeft20"),
								new sap.ui.layout.VerticalLayout({
									content : [sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Favorite",oController)
								              ],
						        }).addStyleClass("PaddingLeft20"),
			               ],
			}).addStyleClass("LeftAlign");
		}else{
			oBlockLayout = new sap.ui.layout.HorizontalLayout({
				allowWrapping :true,
				content :  [ 
								new sap.ui.layout.VerticalLayout({
									content : [sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Favorite",oController)
								              ],
						        }).addStyleClass("PaddingLeft20"),
						   ],
			}).addStyleClass("LeftAlign");
		}
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ oBlockLayout],
			hAlign : "Center",
			vAlign : "Middle",
		}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		return oMatrix.addStyleClass("TileCenter");
	}
});