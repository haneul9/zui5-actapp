//function clickImage(vObjid , vObjnm){
//	console.log("asdfasdf");
////	console.log($().attr("id"));
//	var vText = encodeURIComponent(vObjnm) ;
//	console.log(vText);
//	var vUri = "/sap/bc/ui5_ui5/sap/zui5_hr_eis/topteam.html?_gAuth=M&_gInType=Org&_gOrgid=" + vObjid + "&_gOrgnm=" + vText  ;
//	window.open(vUri);
//}

function makeTree(vObjid){
	var oView = sap.ui.getCore().byId("ZUI5_HR_Atworg.Ac1");
	var oController = oView.getController();
	oController.makeTree(vObjid);
	
}

jQuery.sap.require("ZUI5_HR_Atworg.MyControl.OrgChart");
sap.ui
		.jsview( 
				"ZUI5_HR_Atworg.Ac1",
				{

					/**
					 * Specifies the Controller belonging to this View. In the
					 * case that it is not implemented, or that "null" is
					 * returned, this View does not have a Controller.
					 * 
					 * @memberOf ZUI5_HR_Atworg.Ac1
					 */
					getControllerName : function() {
						return "ZUI5_HR_Atworg.Ac1";
					},

					/**
					 * Is initially called once after the Controller has been
					 * instantiated. It is the place where the UI is
					 * constructed. Since the Controller is given to this
					 * method, its event handlers can be attached right away.
					 * 
					 * @memberOf ZUI5_HR_Atworg.Ac1
					 */
					createContent : function(oController) {
						
						var OrgChart = new ZUI5_HR_Atworg.MyControl.OrgChart(
								oController.PAGEID + "_myOrg", {
									width : 1920,
									height : 950
								});

						var oLegendLayout = new sap.ui.commons.layout.MatrixLayout({
							width : "150px",
							layoutFixed : false,
							columns : 2,
							widths: ["50px","100px"],
						}).addStyleClass("PSNCPositionFix");
						
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Center,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.ui.core.Icon({
								src: "sap-icon://border",
								backgroundColor : "#0093D0", 
								color: "#0093D0",
								width : "15px"
							}),
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.m.Text({
								text : oBundleText.getText("LABEL_0423")	// 423:회사
							}).addStyleClass("L2PFontFamily")
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oLegendLayout.addRow(oRow);
						
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Center,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.ui.core.Icon({
								src: "sap-icon://border",
								backgroundColor : "rgb(50, 205, 50)" ,
								color: "rgb(50, 205, 50)" ,
								width : "15px"
							}),
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.m.Text({
								text : "CEO"
							}).addStyleClass("L2PFontFamily")
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oLegendLayout.addRow(oRow);
						
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Center,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.ui.core.Icon({
								src: "sap-icon://border",
								backgroundColor : "rgb(0, 139, 139)" ,
								color: "rgb(0, 139, 139)" ,
								width : "15px"
							}),
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.m.Text({
								text : oBundleText.getText("LABEL_2219")	// 2219:총괄
							}).addStyleClass("L2PFontFamily")
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oLegendLayout.addRow(oRow);
						
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Center,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.ui.core.Icon({
								src: "sap-icon://border",
								backgroundColor : "rgb(197, 127, 127)" ,
								color: "rgb(197, 127, 127)" ,
								width : "15px"
							}),
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.m.Text({
								text : oBundleText.getText("LABEL_0931")	// 931:본부
							}).addStyleClass("L2PFontFamily")
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oLegendLayout.addRow(oRow);
						
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Center,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.ui.core.Icon({
								src: "sap-icon://border",
								backgroundColor : "rgb(184, 0, 204)" ,
								color: "rgb(184, 0, 204)" ,
								width : "15px"
							}),
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.m.Text({
								text : oBundleText.getText("LABEL_1778")	// 1778:부문/실
							}).addStyleClass("L2PFontFamily")
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oLegendLayout.addRow(oRow);
						
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Center,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.ui.core.Icon({
								src: "sap-icon://border",
								backgroundColor : "#083B82", //rgb(230, 72, 72)" ,
								color: "#083B82", //rgb(230, 72, 72)" ,
								width : "15px"
							}),
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.m.Text({
								text : oBundleText.getText("LABEL_0966")	// 966:팀/부
							}).addStyleClass("L2PFontFamily")
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oLegendLayout.addRow(oRow);
						
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Center,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.ui.core.Icon({
								src: "sap-icon://border",
								backgroundColor : "#000000" ,
								color: "#000000" ,
								width : "15px"
							}),
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : new sap.m.Text({
								text : oBundleText.getText("LABEL_0924")	// 924:과
							}).addStyleClass("L2PFontFamily")
						}).addStyleClass("L2PNoPadding");
						oRow.addCell(oCell);
						
						oLegendLayout.addRow(oRow);
						
						var oNoticeLayout = new sap.m.Toolbar({
							height : "35px",
							content : [ 
								new sap.m.ToolbarSpacer({width : "5px"}),
								new sap.ui.core.Icon({
									src : "sap-icon://message-information"
								}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_2674")	// 2674:Card의 상단을 클릭하시면 상세조직도가 조회되고, 사진을 클릭하시면 소속인원 현황이 조회됩니다.
								}).addStyleClass("L2PFontFamily")
							]
						});
						
						var listPage = new sap.m.Page({
							customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("LABEL_2122")	// 2122:조직도
								}).addStyleClass("TitleFont"),
							}).addStyleClass("PSNCHeader L2pHeaderPadding"),
							content : [ oNoticeLayout, OrgChart, oLegendLayout ],

							footer : new sap.m.Bar({
								contentRight : new sap.m.Button({
									text : oBundleText.getText("LABEL_2109") ,	// 2109:전체조회
									press : oController.onSearch
								})
							}).addStyleClass("L2PPageFooter") 
						}).addStyleClass("WhiteBackground") ;

						return listPage;
					}
				});