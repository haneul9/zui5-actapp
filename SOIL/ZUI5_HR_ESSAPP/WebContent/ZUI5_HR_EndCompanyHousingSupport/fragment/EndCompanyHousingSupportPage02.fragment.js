sap.ui.jsfragment("ZUI5_HR_EndCompanyHousingSupport.fragment.EndCompanyHousingSupportPage02", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
			.setModel(oController._DetailJSonModel)
			.bindElement("/Data")
		];
	},
	
	/**
	 * 페이지 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getPageAllContentRender : function(oController) {
		
		var oContents = [
			new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
			this.getTitleRender(oController),										// 타이틀
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyInfoRender(oController),									// 신청내역
			sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController),			// 첨부
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController), 	// 결재내역
			sap.ui.jsfragment("fragment.Comments", oController)						// 승인/반려 
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "100%",
			rows : $.map(oContents, function(rowData, k) {
				return new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : rowData
						}),
						new sap.ui.commons.layout.MatrixLayoutCell()
					]
				})
			})
		});
	},
	
	/**
	 * 제목 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png",}),
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {
									text : oBundleText.getText("LABEL_0361")	// 361:사택지원 종료 신청
								}).addStyleClass("Font18px FontColor0"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "45px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						vAlign : "Bottom",
						content : 
							new sap.m.Toolbar({
								content : [
									new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar",{}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
									new sap.m.ToolbarSpacer(),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0022"), // 22:뒤로
										press : oController.onBack,
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0005"),	// 5:결재지정
										press : common.ApprovalLineAction.onApprovalLine,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0058"), // 58:임시저장
										press : oController.onPressSaveT,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0033"), // 33:삭제
										press : oController.onDelete,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0044"),	// 44:신청
										press : oController.onPressSaveC,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									})
								]
						}).addStyleClass("ToolbarNoBottomLine NoMarginLeft")
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : aRows
		});
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 통근지역내 무주택
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0340")	// 340:통근지역내 무주택
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.CheckBox({
									selected : "{Nhsyn}",
									editable : false
								})
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 주택자금대출 有
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0337")	// 337:주택자금대출 有
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.CheckBox({
									selected : "{Hslyn}",
									editable : false
								})
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0300"), 	// 300:구분
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Hstyp", {
									width : "200px",
									selectedKey : "{Hstyp}",
									editable : false,
									items : {
										path: "ZHR_COMPANYHOUSE_HEAD_SRV>/CompanyHstypSet",
										filters : [
											{sPath : 'Begbn', sOperator : 'EQ', oValue1 : 'E'}
										],
										template: new sap.ui.core.ListItem({
											key: "{ZHR_COMPANYHOUSE_HEAD_SRV>Hstyp}",
											text: "{ZHR_COMPANYHOUSE_HEAD_SRV>Hstyptx}"
										})
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({ width: "50px" }),
								new sap.m.Button({
									text : oBundleText.getText("LABEL_1133"),	// 362:과거 사택내역 조회
									press : oController.onPressSelectByHistory,
									visible : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								})
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 신청사유
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0323"), 	// 323:신청사유
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Aprsn}",
									width : "100%",
									maxLength : common.Common.getODataPropertyLength("ZHR_COMPANYHOUSE_HEAD_SRV", "CompanyHouseAppl", "Aprsn"),
									placeholder : oBundleText.getText("LABEL_0363"),	// 363:인사이동, 계약종료 등 사유입력
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 부임형태
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0319"), 	// 319:부임형태
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Mvtyp", {
									width : "200px",
									selectedKey : "{Mvtyp}",
									editable : false,
									items : {
										path: "ZHR_COMPANYHOUSE_HEAD_SRV>/CompanyMvtypSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_COMPANYHOUSE_HEAD_SRV>Mvtyp}",
											text: "{ZHR_COMPANYHOUSE_HEAD_SRV>Mvtyptx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 주택형태
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0338"), 	// 338:주택형태
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Hoshp", {
									width : "200px",
									selectedKey : "{Hoshp}",
									editable : false,
									items : {
										path: "ZHR_COMPANYHOUSE_HEAD_SRV>/CompanyHoshpSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_COMPANYHOUSE_HEAD_SRV>Hoshp}",
											text: "{ZHR_COMPANYHOUSE_HEAD_SRV>Hoshptx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 전용면적
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0102"), 	// 102:전용면적
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Fsize}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.ui.core.HTML({content : "<span>m<sup>2</sup></span>"}),
								new sap.m.Input({
									value : "{FsizeP}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0341")	// 341:평
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 공급면적
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0311")	// 311:공급면적
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Psize}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.ui.core.HTML({content : "<span>m<sup>2</sup></span>"}),
								new sap.m.Input({
									value : "{PsizeP}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0341")	// 341:평
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 주소
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0336"), 	// 336:주소
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Pstlz}",
									width : "7%",
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Addr1}",
									width : "43.9%",
									editable : false
								}).addStyleClass("Font14px FontColor3 PaddingLeft3"),
								new sap.m.Input({
									value : "{Addr2}",
									width : "49%",
									editable : false
								}).addStyleClass("Font14px FontColor3 PaddingLeft3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 소유자
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0322"), 	// 322:소유자
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Owner}",
									width : "150px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 임차형태
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0332"), 	// 332:임차형태
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Lotyp", {
									width : "200px",
									selectedKey : "{Lotyp}",
									editable : false,
									items : {
										path: "ZHR_COMPANYHOUSE_HEAD_SRV>/CompanyLotypSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_COMPANYHOUSE_HEAD_SRV>Lotyp}",
											text: "{ZHR_COMPANYHOUSE_HEAD_SRV>Lotyptx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 임차조건
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0331"), 	// 331:임차조건
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0317")	// 317:보증금
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Warfe}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3 PaddingLeft3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0324")	// 324:원
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({width: "10px"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0325")	// 325:월세
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Monfe}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0324")	// 324:원
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 계약기간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [
							new sap.m.Label({
								text : oBundleText.getText("LABEL_0308"), 	// 308:계약기간
								required : true
							}).addStyleClass("Font14px FontBold FontColor3")
						]
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : [
							new sap.m.Toolbar({
								content : [
									new sap.m.DatePicker(oController.PAGEID + "_Conbg", {
										valueFormat : "yyyy-MM-dd",
										displayFormat : "yyyy.MM.dd",
										value : "{Conbg}",
										width : "150px",
										editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
											formatter : function(fVal1, fVal2){
												return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
											}
										}
									}).addStyleClass("Font14px FontColor3"),
									new sap.ui.core.HTML({content : "<div style='width:10px;text-align:center;'>~</div>"}),
									new sap.m.DatePicker(oController.PAGEID + "_Coned", {
										valueFormat : "yyyy-MM-dd",
										displayFormat : "yyyy.MM.dd",
										value : "{Coned}",
										width : "150px",
										editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
											formatter : function(fVal1, fVal2){
												return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
											}
										}
									}).addStyleClass("Font14px FontColor3")
								]
							}).addStyleClass("ToolbarNoBottomLine")
						]
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 담보형태
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0315"), 	// 315:담보형태
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Motyp", {
									width : "200px",
									selectedKey : "{Motyp}",
									editable : false,
									items : {
										path: "ZHR_COMPANYHOUSE_HEAD_SRV>/CompanyMotypSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_COMPANYHOUSE_HEAD_SRV>Motyp}",
											text: "{ZHR_COMPANYHOUSE_HEAD_SRV>Motyptx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 담보순위
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0314")	// 314:담보순위
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Moseq", {
									width : "200px",
									selectedKey : "{Moseq}",
									editable : false,
									items : {
										path: "ZHR_COMPANYHOUSE_HEAD_SRV>/CompanyMoseqSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_COMPANYHOUSE_HEAD_SRV>Moseq}",
											text: "{ZHR_COMPANYHOUSE_HEAD_SRV>Moseqtx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 담보설정
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0313"), 	// 313:담보설정
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ToolbarSpacer({width: "28px"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0316")	// 316:매매가
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Mosel}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3 PaddingLeft3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0324")	// 324:원
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0321")	// 321:선순위 담보설정금액
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Mopri}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3 PaddingLeft3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0324")	// 324:원
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0317")	// 317:보증금
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Moasr}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3 PaddingLeft3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0324")	// 324:원
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0312")	// 312:담보비율
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Morat}",
									width : "100px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : false
								}).addStyleClass("Font14px FontColor3 PaddingLeft3"),
								new sap.m.Text({
									text : "%"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 보증금입금일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [
							new sap.m.Label({
								text : oBundleText.getText("LABEL_0360"),	// 360:보증금입금일 
								required : true
							}).addStyleClass("Font14px FontBold FontColor3")
						]
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : [
							new sap.m.Toolbar({
								content : [
									new sap.m.DatePicker(oController.PAGEID + "_Wardt", {
										valueFormat : "yyyy-MM-dd",
										displayFormat : "yyyy.MM.dd",
										value : "{Wardt}",
										width : "150px",
										editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
											formatter : function(fVal1, fVal2){
												return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
											}
										}
									}).addStyleClass("Font14px FontColor3"),
									new sap.m.ToolbarSpacer({width: "690px"}),
									new sap.m.Text({
										text : oBundleText.getText("LABEL_0304")	// 304:(담보비율은 70% 이하여야 합니다.)
									}).addStyleClass("Font14px FontColor3")
								]
							}).addStyleClass("ToolbarNoBottomLine")
						]
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 부대비용
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0318")	// 318:부대비용
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0339")	// 339:중개수수료
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Mbfee}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3 PaddingLeft3 Number"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0324")	// 324:원
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({width: "14px"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0333")	// 333:전세권관련 수수료
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Mlfee}",
									width : "150px",
									textAlign : sap.ui.core.TextAlign.Right,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3 PaddingLeft3 Number"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0324")	// 324:원
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 비고
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Zbigo}",
									width : "100%",
									maxLength : common.Common.getODataPropertyLength("ZHR_COMPANYHOUSE_HEAD_SRV", "CompanyHouseAppl", "Zbigo"),
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0047") 	// 47:신청내역
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				})
			]
		});
	}
});