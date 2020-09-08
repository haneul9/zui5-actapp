
sap.ui.jsfragment("zui5_hrxx_actapp.fragment.Notice1Dialog", {
	/** 
	* @memberOf zui5_hrxx_actapp.fragment.Notice1Dialog
	*/
	
	createContent : function(oController) {
		var oCell = null;
		
		var oNoticeLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "기술직사원의 소속 변경 또는 신규채용으로 인한 발령시"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oNoticeLayout.createRow(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "EHS 검토내용(배치전 검진, 특별안전교육) 확인후 이동처리해 주시기 바랍니다."}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oNoticeLayout.createRow(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: ""}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oNoticeLayout.createRow(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "※ EHS 담당자"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oNoticeLayout.createRow(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "- 검진 : 안전보건팀 하주현 대리(032-211-1345)"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft2rem");
		oNoticeLayout.createRow(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "- 교육 : 안전보건팀 신광식 차장(032-211-1332)"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft2rem");
		oNoticeLayout.createRow(oCell);
		
		var oDialog = new sap.m.Dialog({
			content : oNoticeLayout,
			contentWidth : "500px",
			contentHeight : "200px",
			showHeader : true,
			title : "안내",
			beginButton : new sap.m.Button({
							text : "확인", 
							icon: "sap-icon://accept", 
							press : oController.onConfirmNotice}),
			endButton : new sap.m.Button({
				            text : "취소", 
				            icon: "sap-icon://sys-cancel-2", 
				            press : oController.onNDClose}),				
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog; 
	}

});
