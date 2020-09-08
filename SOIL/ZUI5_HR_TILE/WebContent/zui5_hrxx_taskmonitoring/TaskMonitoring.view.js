// Copyright (c) 2009-2014 SAP SE, All Rights Reserved



(function(){
	"use strict";
	sap.ui.jsview("zui5_hrxx_taskmonitoring.TaskMonitoring",{
	getControllerName:function(){
		return"zui5_hrxx_taskmonitoring.TaskMonitoring";
	},
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl:function(){
		jQuery.sap.require("sap.ui.suite.library");
		jQuery.sap.require('sap.m.GenericTile');
		jQuery.sap.require('sap.m.CustomTile');
		jQuery.sap.require('sap.m.Tile');
		jQuery.sap.require('sap.m.Text');
		jQuery.sap.require("sap.m.Toolbar", "sap.m.ToolbarSpacer", "sap.ui.commons.Label", "sap.ui.commons.Image" , "sap.ui.core.Icon");
		jQuery.sap.require("sap.ui.commons.layout.MatrixLayout", "sap.ui.commons.layout.VerticalLayout", "sap.ui.core.HTML", "sap.ui.core.CustomData");
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");
		
		var oController =this.getController();
        var k = oController.createId("oTaskCircleHigh");
        var l = oController.createId("oTaskCircleMed");
        var m = oController.createId("oTaskCircleLow");
        var iMaxBubbleCount = "10";
        var iMinBubbleCount = "0" ;
        
        var oGreenTaskCircle = new sap.ui.suite.TaskCircle(m, {
            maxValue: parseInt(iMaxBubbleCount),
            minValue: parseInt(iMinBubbleCount),
            value:"{Cnt01}",
            color: "Green"
        }).setModel(oController._JSonModel).bindElement("/results");
        oGreenTaskCircle.addStyleClass("hcmPATaskCircle");
        
        var oTCCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Center,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
            content: oGreenTaskCircle,
//            padding: sap.ui.commons.layout.Padding.Neither
        });
        oTCCell1.addStyleClass("hcmPATasksCellBubble L2PTilePaddingBottom4px");

        var oYellowTaskCircle = new sap.ui.suite.TaskCircle(l, {
            maxValue: parseInt(iMaxBubbleCount),
            minValue: parseInt(iMinBubbleCount),
            value:"{Cnt02}",
            color: "Yellow"
        }).setModel(oController._JSonModel).bindElement("/results");
        oYellowTaskCircle.addStyleClass("hcmPATaskCircle");
		
        var oTCCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Center,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
            content: oYellowTaskCircle,
//            padding: sap.ui.commons.layout.Padding.Neither
        });
        oTCCell2.addStyleClass("hcmPATasksCellBubble L2PTilePaddingBottom4px");

        var oRedTaskCircle = new sap.ui.suite.TaskCircle(k, {
            maxValue: parseInt(iMaxBubbleCount),
            minValue: parseInt(iMinBubbleCount),
            value:"{Cnt03}",
            color: "Red"
        }).setModel(oController._JSonModel).bindElement("/results");
        oRedTaskCircle.addStyleClass("hcmPATaskCircle");

        var oTCCell3 = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Center,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
            content: oRedTaskCircle,
//            padding: sap.ui.commons.layout.Padding.Neither
        });
        oTCCell3.addStyleClass("hcmPATasksCellBubble L2PTilePaddingBottom4px");


        var oRedBubbleText = new sap.m.Text({width:"100%", textAlign:"Center"}).addStyleClass("L2PFontASSSubText");
        var oYellowBubbleText = new sap.m.Text({width:"100%", textAlign:"Center"}).addStyleClass("L2PFontASSSubText");
        var oGreenBubbleText = new sap.m.Text({width:"100%", textAlign:"Center"}).addStyleClass("L2PFontASSSubText");
 
        var oTCCell4 = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Center,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
        });
        oTCCell4.addContent(oGreenBubbleText);

        var oTCCell5 = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Center,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
        });
        oTCCell5.addContent(oYellowBubbleText);

        var oTCCell6 = new sap.ui.commons.layout.MatrixLayoutCell({
            hAlign: sap.ui.commons.layout.HAlign.Center,
            vAlign: sap.ui.commons.layout.VAlign.Middle,
        });
        oTCCell6.addContent(oRedBubbleText);

        oRedBubbleText.setText("미처리");
        oYellowBubbleText.setText("진행중"); 
        oGreenBubbleText.setText("신규");
        
        
//        var oToolbar = new sap.m.Bar({
//			content : [ oGreenTaskCircle, 
//						oYellowTaskCircle ,
//						oRedTaskCircle 
//			],
//			height : "75px"
//		});
//        var oTCCell = new sap.ui.commons.layout.MatrixLayoutCell({
//        	colSpan : 3 ,
//            hAlign: sap.ui.commons.layout.HAlign.Center,
//            vAlign: sap.ui.commons.layout.VAlign.Middle,
//        });
//        oTCCell.addContent(oToolbar);
        
        

        
        var oMatrixLayoutRow1 = new sap.ui.commons.layout.MatrixLayoutRow({height:"70px"}).addCell(oTCCell1).addCell(oTCCell2).addCell(oTCCell3); //.addStyleClass("tasksRow");
//        var oMatrixLayoutRow1 = new sap.ui.commons.layout.MatrixLayoutRow({ }).addCell(oTCCell);
        var oMatrixLayoutRow2 = new sap.ui.commons.layout.MatrixLayoutRow({height:"20px"}).addCell(oTCCell4).addCell(oTCCell5).addCell(oTCCell6); //.addStyleClass("tasksRow");

        var oMatrixLayout1 = new sap.ui.commons.layout.MatrixLayout({
        	layoutFixed: false,
        	widths : ["33.3%","33.3%","33.3%"] ,
        	width : "100%",
        	columns : 3
        		
        });
        oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : '{/data/display_title_text}'
			}).addStyleClass("L2PTitle1")
		});
		oRow.addCell(oCell);
		oMatrixLayout1.addRow(oRow);
		
        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "{Period}"}).addStyleClass("L2PFontSubTitle"),
			colSpan : 3
		});
		oRow.addCell(oCell);
		oRow.setModel(oController._JSonModel).bindElement("/results");
		oMatrixLayout1.addRow(oRow);
		
		
//		oMatrixLayout1.addRow(oMatrixLayoutRow0)
		oMatrixLayout1.addRow(oMatrixLayoutRow1);
        oMatrixLayout1.addRow(oMatrixLayoutRow2);

        var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "330px",
			layoutFixed : true,
			columns : 1
		}).addStyleClass("sapMGTHdrContent");
        
//        var oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"180px"});
        var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
        var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oMatrixLayout1
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
//		oMatrix.setModel(oController._JSonModel).bindElement("/results");
		
		return new sap.m.CustomTile({ content : [oMatrix],
									  press:[oController.onPress,oController]
									}).addStyleClass("L2PPartnershipTile sapUiSizeCompact TileLayout");
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
  });
}());
