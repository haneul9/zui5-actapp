sap.ui.jsfragment("ZUI5_HR_Portal.fragment.EmployeeE", {
	
	createContent : function(oController) {
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ["" ,'20px'],
			columns : 2,
			width : "100%",
		}).setModel(oController._JSonModel1).bindElement("/results");
		oMatrixLayout.bindElement("/results");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Text({text : "사원 프로파일"}).addStyleClass("Font22px FontColor6")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.Icon({
				size : "1.4rem",
				src : "sap-icon://employee",
				press: function() {
//					oController.openFavorite()
				},
				color : "#666666",
				layoutData: new sap.m.OverflowToolbarLayoutData({
					priority: sap.m.OverflowToolbarPriority.Low
				})
			}),
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oImage = new sap.m.Image({
			src : "{pic}",
			height : "90px",
		}).addStyleClass("NoMarginLeft");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height : "70px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : new sap.m.Toolbar({ 
				height : "70px",
				width : "70px",
				content : [
					oImage
				]
			}).addStyleClass("ToolbarNoBottomLine Overflow imageCircle"),
		}); //.addStyleClass("Overflow");
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2	,
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [ new sap.m.Text({
				text : "{Ename}",
				textAlign : sap.ui.core.TextAlign.Center
			}).addStyleClass("Font24px FontColor6 FontBold")],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content :  new sap.m.Text({
				text : "{totalOrgeh}",
				textAlign : "Center",
				width : "250px"
			}).addStyleClass("Font16px FontColor6"),
			vAlign : "Top"
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content :  new sap.m.Text({
				text : "{Zzjikgbt}" + " (" + "{Zzjiklnt}" + ")",
				textAlign : "Center",
				width : "250px"
			}).addStyleClass("Font16px FontColor6"),
			vAlign : "Top"
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height : "30px" });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : [ 
			            new sap.ui.core.HTML({ content : "<div style='height : 5px;'/>" }),
						new sap.m.Toolbar({ 
							content : [
								new sap.m.ToolbarSpacer(),
								new sap.m.Button(oController.PAGEID +"_DownorgchartK1",{
									text : "조직도 국문",
									width : "96px",
									type : sap.m.ButtonType.Emphasized,
								}).addDelegate({
									onAfterRendering: function(evt) {
										$("#ZUI5_HR_PortalList_DownorgchartK1-inner")
										.removeClass("sapMBtnEmphasized")
										.addClass("TileButton");
									}
								}).attachBrowserEvent("click", function(e){
									e.stopPropagation();
									oController.openOrgChart(oController, "A");
								}),
								
								new sap.m.ToolbarSpacer({width: "5px"}),
								new sap.m.Button(oController.PAGEID +"_DownorgchartE1",{
									text : "조직도 영문",
									width : "96px",
									type : sap.m.ButtonType.Emphasized,
									press : function(){
										console.log("afd");
									},
								}).addDelegate({
									onAfterRendering: function(evt) {
										$("#ZUI5_HR_PortalList_DownorgchartE1-inner")
										.removeClass("sapMBtnEmphasized")
										.addClass("TileButton");
									}
								}).attachBrowserEvent("click", function(e){
									e.stopPropagation();
									oController.openOrgChart(oController, "B");
								}),
								new sap.m.ToolbarSpacer()]
							}).addStyleClass("ToolbarNoBottomLine")
					   ],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);

		
		var oMainMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "295px",
			height : "295px"
		}).attachBrowserEvent("click", function(){
			oController.goToPage(oController,"Emp_E","");
		}).addStyleClass("ProfileTileLayout CursorPointer");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"220px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oMatrixLayout,
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Center,
		});
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "15px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		return oMainMatrixLayout;
	
	}
});