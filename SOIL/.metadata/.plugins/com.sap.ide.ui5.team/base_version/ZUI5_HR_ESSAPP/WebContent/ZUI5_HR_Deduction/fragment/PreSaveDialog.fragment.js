sap.ui.jsfragment("ZUI5_HR_Deduction.fragment.PreSaveDialog", {
	
	createContent : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0472")	// 472:고정공제
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Dedtx}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0445")	// 445:동호회 여부
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.CheckBox({
							selected : "{Memyn}",
							editable : false
						})
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0476")	// 476:공제인원
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Percnt}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0474")	// 474:공제금액
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Reqamt}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0454")	// 454:입금계좌정보
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Bankn}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0450")	// 450:예금주
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Emftx}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		var oDialog = new sap.m.Dialog({
			content :[ 
				new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				})
			],
			contentWidth : "800px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0511"),	// 511:신청내용
			beginButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0044"), 	// 44:신청
				press : function() {
					oController.onPressSaveC();
				}
			}),
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0071"), 	// 71:취소
				press : function() {
					oDialog.close();
				}
			})
		});
		oDialog
			.setModel(oController._DetailSaveJSonModel)
			.bindElement("/Data")
			.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});