sap.ui.jsview("zui5_hrxx_photoup.PhotoUpload", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_photoup.PhotoUpload
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_photoup.PhotoUpload";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_photoup.PhotoUpload
	*/ 
	createContent : function(oController) {
//		//필요한 CSS 파일을 Include 한다.
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2P2SAP1.css");
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2PBasic.css");
		
		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });  
		jQuery.sap.require("common.AttachPicFileAction");
		jQuery.sap.require("control.ODataPicFileUploader");
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		// uploader 생성		
		var oFileUploader = new control.ODataPicFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name : oController.PAGEID + "UploadFile",
			modelName : "ZHRXX_EMP_PHOTO_SRV",
			slug : "",
			maximumFileSize: 0.05,
			multiple : true,
			width : "100px",
			uploadOnChange: true,
			mimeType: ["image"], //["image","text","application"],
			fileType: [],
			buttonText : " ",//oBundleText.getText("UPLOAD_BTN"),
			icon :"",
			buttonOnly : true,
			uploadUrl : "/sap/opu/odata/sap/ZHRXX_EMP_PHOTO_SRV/PhotoUploadSet/",
			uploadComplete: common.AttachPicFileAction.uploadComplete,
			uploadAborted : common.AttachPicFileAction.uploadAborted,
			fileSizeExceed: common.AttachPicFileAction.fileSizeExceed,
			typeMissmatch: common.AttachPicFileAction.typeMissmatch,
			change : common.AttachPicFileAction.onFileChange,
			width : "1px"
		});
		
		oFileUploader.addEventDelegate({
			onAfterRendering:function(){	
				$("#" + oController.PAGEID + "_ATTACHFILE_BTN").hide();
			}
		});

		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CAF_ColumnList", {
			counter : 10,
			cells : [ 
				new sap.ui.core.Icon({
					src: "sap-icon://status-completed", 
					color: {path  : 'Mtype', formatter : oController.StatusColor} 
				}),
			    new sap.m.Text({
			    	text : "{Numbr}",
			   }).addStyleClass("L2P13Font"), 
			    new sap.m.Image({
			    	src : "{Piurl}",
			    	width : "2.5rem", 
			    	height: "2.5rem" 
				}),
			   new sap.m.Text({
			    	text : "{Pernr}",
			   }).addStyleClass("L2P13Font"), 
			    new sap.m.Text({
			    	text : "{Ename}",
			   }).addStyleClass("L2P13Font"), 
			    new sap.m.Text({
			    	text : "{Pbtxt}",
			   }).addStyleClass("L2P13Font"), 
			    new sap.m.Text({
			    	text : "{Orgtx}",
			   }).addStyleClass("L2P13Font"), 
			    new sap.m.Text({
			    	text : "{Filename}",
			   }).addStyleClass("L2P13Font"), 
			    new sap.m.Text({
			    	text : "{Msg}",
			   }).addStyleClass("L2P13Font"), 

			]
		}).addStyleClass("L2P13Font L2PFontColorBlue");
		
		var oTable = new sap.m.Table(oController.PAGEID + "_CAF_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "MTYPE")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width: "30px",
			              minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "NUMBER_2")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.End,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PIURL")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PERNR")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}), 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENAME_2")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PBTXT")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  			        	  
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ORGTX_2")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true ,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "FILENAME")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "MSG")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true})
			          ],
		});	
		
		
		
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [	new sap.m.Label(	{text : oBundleText.getText("UPLOAD_RESULT")})
								.addStyleClass("L2P13Font")
								.addStyleClass("L2P13FontBold") ,
				            new sap.m.ToolbarSpacer(),
				            new sap.m.Button(oController.PAGEID + "_ExcelDownload_Btn",{text: oBundleText.getText("EXCEL_BTN"), icon : "sap-icon://excel-attachment", press : oController.downloadExcel})]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		
		var vHtml = "";
		if(gMolga == "41"){ // 한국 일 경우
			vHtml = "<div style='padding-left:20px'><ui class='L2P13Font'>※  사진을 등록시 아래와 같이 맞춰주시기 바랍니다.<br>"
				  + "- 사진타입 : JPG <br>" 
				  + "- 저장할 사진 이미지의 파일명은 사번(성명).사진타입 으로 반드시 정의. 예) 00000093(정우성).jpg <br>" 
				  + "- 사진 사이즈 : 160(가로) X 210 픽셀 (세로) <br>" 
				  + "- 제한용량 : 1Mbyte 이하 <br>" ;
		}else{
			vHtml = "<div style='padding-left:20px'><ui class='L2P13Font'>※   When uploading employee photo, please follow the instructions below.<br>"
				  + "- Photo type : JPG <br>" 
				  + "- File name must be defined with per. no(description). Description can be optional. eg) 00000093(David Beckham).jpg or 00000093.jpg <br>" 
				  + "- Photo size : 160(width) X 210 (height) pixels  <br>" 
				  + "- Allowed file size : less than 1Mbyte <br>" ;
		}
		
		var oNoticePanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://notification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("REFERENCE"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [new sap.ui.core.HTML({content : vHtml,	preferDOM : false}).addStyleClass("L2PPaddingLeft10")]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oResultPanel,
		                new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}), 
			            oTable ,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),		
			            oNoticePanel
			           ]
		});		
		
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
							 new sap.m.Button({
								 text : oBundleText.getText( "FILTER_BTN"),
								 press : oController.onPressFilter
							 })],
			 	contentRight : [ 
								 new sap.m.Button({
									 text : oBundleText.getText( "NEW_UPLOAD"),
									 press : oController.UploadExecute
									 }),
								 oFileUploader
								 ]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText( "TITLE_PIC_UPLOAD")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});