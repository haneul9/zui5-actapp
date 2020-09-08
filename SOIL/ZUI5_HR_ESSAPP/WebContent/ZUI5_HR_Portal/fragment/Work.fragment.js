sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Work", {
	
	createContent : function(oController) {
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%"
		}).setModel(oController._JSonModel5).bindElement("/results");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "근태현황"}).addStyleClass("L2PTitle1")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : [new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:20px'> </div>"
			})]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
				
		// 근태현황
		var oPlanningCalendar = new sap.m.PlanningCalendar(oController.PAGEID + "_PlanningCalendar", {
			showIntervalHeaders : false,
			showEmptyIntervalHeaders : false,
			showRowHeaders : false,
			startDate : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0),
//			startDate : "{startDate}",
			viewKey : "View1",
			groupAppointmentsMode: "Collapsed",
			appointmentsReducedHeight: false,
			appointmentsVisualization: "Filled",
			singleSelection : true,
//		    appointmentSelect : oController.onPressAppointment,
			rows : [new sap.m.PlanningCalendarRow(oController.PAGEID + "_PlanningCalendarRow", {
						appointments : [	// addAppointment	
//							new sap.ui.unified.CalendarAppointment({
//								startDate : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 8, 0),
//								endDate : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 0),
//								title : "기본근무",
//								text : "08:00 ~ 14:00",
//								color : "#3399ff"
//							}),
						]
					})
			],
			views : [new sap.m.PlanningCalendarView({
						intervalsL : 24,
						intervalsM : 24,
						intervalsS : 24,
//						intervalsL : "{Maxtm}",
//						intervalsM : "{Maxtm}",
//						intervalsS : "{Maxtm}",
						key : "View1",
						showSubIntervals : false,
						description : ""
					})]
		}).setModel(oController._JSonModel5).bindElement("/results");
		
		oPlanningCalendar.addEventDelegate({
			onAfterRendering:function(){
				$("#" + oController.PAGEID + "_PlanningCalendar-HeaderToolbar").css("display", "none");
				$("#" + oController.PAGEID + "_PlanningCalendar-TimeInt--Head").css("display", "none");
				$("#" + oController.PAGEID + "_PlanningCalendar-TimeInt--TimesRow-Head").css("display", "none");
			}
		});
		
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oPlanningCalendar]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		return oMatrixLayout;

	
	}
});