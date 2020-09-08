sap.ui.jsview("zui5_hrxx_actapp2.ActAppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActAppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	createContent : function(oController) {	
		
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		 
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
		var nextDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout FilterLayoutBackground");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : "회사명"}),
				           new sap.m.MultiComboBox(oController.PAGEID + "_Persa", {
								width: "500px",
								selectionFinish : oController.onChnageComboBox,
							}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : "게시번호"}),
				           new sap.m.Input(oController.PAGEID + "_Reqno", {
								width: "200px"
						   }).addStyleClass("L2PFontFamily L2PImeActive")]
			}).addStyleClass("L2PFilterItem")
		);

		var filterString = "/?$filter=PersaNc%20eq%20%27" + "X" + "%27";
		filterString += "%20and%20Field%20eq%20%27" + "Massn" + "%27";
		filterString += "%20and%20Excod%20eq%20%27" + "W2" + "%27";
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : "발령유형"}),
					           new sap.m.MultiComboBox(oController.PAGEID + "_Massn", {
									width: "200px",
									selectionFinish : oController.onChnageComboBox,
									items : {
										path : "/EmpCodeListSet" + filterString,
										template : new sap.ui.core.Item({key : "{Ecode}",text : "{Etext}" }) 
									}
							   }).addStyleClass("L2PFontFamily").setModel(sap.ui.getCore().getModel("ZL2P01GW9000_SRV"))]
				}).addStyleClass("L2PFilterItem")
			);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : "발령일 검색 시작일"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Actda_From", {
								value: dateFormat.format(prevDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "200px",
								change : oController.onChangeDate,
						   }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : "발령일 검색 종료일"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Actda_To", {
								value: dateFormat.format(nextDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "200px",
								change : oController.onChangeDate,
						   }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Button({
								text: "검색",
								icon : "sap-icon://search",
								type : sap.m.ButtonType.Emphasized,
								press : oController.onPressSearch
						   }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PFilterItem")
		);
		
		var oFilterInfoBar = new sap.m.Toolbar({
			height : "2.5rem",
			content : [ new sap.m.Label({
			            	text : "검색조건 : "
			            }),

		            	new sap.m.Text(oController.PAGEID + "_Pbtxt", {
		            	
		            	}),
						
			        ]
		}).addStyleClass("L2PPaddingLeft1Rem FilterLayoutBackground");		
		
		var oFilterVLayout = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content : [oFilterLayout, oFilterInfoBar]
		}).addStyleClass("");
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			type : sap.m.ListType.Navigation,
			press : oController.onSelectRow ,
			counter : 10,
			cells : [ 
			    new sap.m.Text({
			    	text : "{Numbr}"
				}).addStyleClass("L2PFontFamily"), 
				new sap.ui.core.Icon({
					src: "sap-icon://color-fill", 
					color: {path  : 'Statu', formatter : common.Formatter.StatusColor} 
				}),
				new sap.m.Text({
				     text : "{Reqno}" 
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
				     text : "{Title}" ,
			    	 textAlign : sap.ui.core.TextAlign.Begin,	 
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
				     text : "{Pbtxt}" ,	 
				     wrapping : true,
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
				     text : "{Reqdp}" 
				}).addStyleClass("L2PFontFamily"), 
//				new sap.m.Link("Reqnm",{
//				     text : "{Reqnm}",
//				     customData : [{key : "Pernr", value : "{Pernr}"}]
//				}).addStyleClass("L2PFontFamily L2PFontColorBlue"),
////				.attachBrowserEvent("click", oController.displayPopoverEmpProfile), 
				new sap.m.Text({
				     text : "{Reqnm}" 
				}).addStyleClass("L2PFontFamily"), 
				new sap.m.Link({
					text : "{Eecnt}",
					customData : [{key : "Reqno", value : "{Reqno}"},
					              {key : "Docno", value : "{Docno}"}]
		        }).addStyleClass("L2PFontFamily L2PFontColorBlue")
		        .attachBrowserEvent("click", oController.displayPopoverActPerson),
				new sap.m.Text({
					 text : {path : "Actda",
						 formatter : function(fVal){
							 console.log(fVal);
							 if(fVal){
								 console.log(dateFormat2.format(new Date(fVal)));
								 return dateFormat2.format(new Date(fVal));
							 }
						 }
					 }
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Link({
					 text : {path : "Datlo",
						 formatter : function(fVal){
							 if(fVal){
								 return dateFormat2.format(new Date(fVal));
							 }
						 }
					 },
					customData : [{key : "Reqno", value : "{Reqno}"},
					              {key : "Docno", value : "{Docno}"}]
				}).addStyleClass("L2PFontFamily L2PFontColorBlue")
				.attachBrowserEvent("click", oController.displayPopoverActTimeline) //mouseenter
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
			inset : false,
			fixedLayout : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "해당하는 데이터가 없습니다.",
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "No."}).addStyleClass("L2PFontFamily"), 			        	  
			        	  demandPopin: true,
			        	  width: "30px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "상태"}).addStyleClass("L2PFontFamily"), 			        	  
			        	  demandPopin: true,
			        	  width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "신청번호" }).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : "품의서 제목"}).addStyleClass("L2PFontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "인사영역"}).addStyleClass("L2PFontFamily"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "품의부서" }).addStyleClass("L2PFontFamily"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "품의자" }).addStyleClass("L2PFontFamily"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "인원수"}).addStyleClass("L2PFontFamily"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "80px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "발령일"}).addStyleClass("L2PFontFamily"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "100px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "변경일"}).addStyleClass("L2PFontFamily"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "100px",
			        	  demandPopin: true})
			          ]			          
		});

		var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_ALL",{
			showAll : true,
			key : "All",
			icon : "",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : "문서"
		});
		
		var iConSeperator = new sap.m.IconTabSeparator();
		
		var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_CRETAE",{
			icon : "sap-icon://create",
			iconColor : "Critical",
			text : "작성중",
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "creation" 
		});
	
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_APPROVAL", {
			icon : "sap-icon://approvals",
			iconColor : "Positive",
            text :  "결재상신",
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "approval",
			visible : gEeapp == "X" ? true :false
		});
		
		var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_CONFIRM",{
			icon : "sap-icon://sys-enter",
			iconColor : "Default",
            text :  "승인",
            design : sap.m.IconTabFilterDesign.Horizontal,
            width : "100px",
			key : "confirmation",
			visible : gEeapp == "X" ? true :false
		});
		
		var oIConFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_REJECT",{
			icon : "sap-icon://decline",
			iconColor : "Negative",
            text :  "반려",
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "reject",
			visible : gEeapp == "X" ? true :false
		});
		
		var oIConFilter6 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_COMPLETE",{
			icon : "sap-icon://accept",
			iconColor : "Positive",
            text :  "확정",
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "complete"
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : [ oTable ],
			items : [ oIConFilter1, iConSeperator, oIConFilter2, 
			          oIConFilter3, oIConFilter4, oIConFilter5, 
			          oIConFilter6,],
			select : oController.handleIconTabBarSelect ,
			selectedKey : "All"
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [oFilterVLayout, oIConBar]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
					 new sap.m.Button({
						 text : "정렬",
						 press : oController.onPressSort
					 	 }) ,
				 	 new sap.m.Button({
				 		 text: "엑셀다운로드",
				 		 press : oController.downloadExcel
				 		})
					 	],
			 	contentRight : [         
 	                new sap.m.Button({text : "신규품의", type : "Default" , 
 	                	icon :"sap-icon://write-new" ,
 	                	press : oController.createAction
 	                })
	                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : "발령품의서"
								}).addStyleClass("TitleFont"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeader L2pHeaderPadding") ,
			footer : oFooterBar 
		}).addStyleClass("WhiteBackground") ;
		
		
		return oPage ;
	}
	
});
