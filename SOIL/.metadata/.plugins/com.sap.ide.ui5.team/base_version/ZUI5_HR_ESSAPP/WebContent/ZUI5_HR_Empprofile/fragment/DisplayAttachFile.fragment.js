sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.DisplayAttachFile",  {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_DAF_ColumnList", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({
			    	text : "{Seqnr}" ,
			    	textAlign : "Begin"
				}).addStyleClass("FontFamily"), 
				new sap.m.Link({
				    text : "{Zfilename}",
				    href : "{Fileuri}",
				    textAlign : "Begin",
				    target : "_new"
				}).addStyleClass("FontFamily")
			]
		});  
		
		var oAttachFileList = new sap.m.Table(oController.PAGEID + "_DAF_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData : true,
			noDataText : "No data found",
			mode : sap.m.ListMode.None,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "No."}).addStyleClass("FontFamily"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "50px",
			        	  styleClass : "cellBorderRight cellBorderLeft",
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_2208")}).addStyleClass("FontFamily"),	// 2208:첨부파일
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  styleClass : "cellBorderRight",
			        	  minScreenWidth: "tablet"})
			          ]
		});
		var oJSonModel = new sap.ui.model.json.JSONModel() ;
		var Datas = { Data : []};
		oJSonModel.setData(Datas);
		oAttachFileList.setModel(oJSonModel);
		oAttachFileList.bindItems("/Data", oColumnList);
		
		var oAttachFilePanel = new sap.m.Panel({
			visible : true,
			expandable : false,
			expanded : true,
			content : [   
				 new sap.m.Toolbar({
					 	height : "40px",
						design : sap.m.ToolbarDesign.Auto,
						content : [new sap.ui.core.Icon({
									src: "sap-icon://open-command-field", 
									size : "1.0rem"
								   }),
								   new sap.m.ToolbarSpacer({width: "5px"}),
								   new sap.m.Text({text : oBundleText.getText("LABEL_2157")}).addStyleClass("FontFamilyBold"),	// 2157:증빙 첨부
						           ]
			}).addStyleClass("L2PToolbarNoBottomLine"), oAttachFileList]
		});
		
		/////////////////////////////////////////////////////////////////////////////////////////////////		
		var oPopover = new sap.m.Popover(oController.PAGEID + "_Popover", {
			content :[oAttachFilePanel] ,
			contentWidth : "450px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2208"),	// 2208:첨부파일
			placement : "Top",
			beforeOpen : function(oEvent){
				var vZfilekey = oPopover.getModel().getProperty("/Data/Zfilekey");
				var vZworktyp = oPopover.getModel().getProperty("/Data/Zworktyp");
				var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_DAF_Table");
				var JSonModel = oAttachFileList.getModel();
				var Datas = { Data : []};
				var vErrorMessage = "" , vError = "";
				if(vZfilekey && vZfilekey != ""){
					var oModel = sap.ui.getCore().getModel("ZHR_FAMILY_SRV");
					var oPath = "/FamFileListSet/?$filter=Zfilekey eq '" + vZfilekey + "' and Zworktyp eq '" + vZworktyp  + "'";	
					oModel.read(oPath, 
						    null, null, false, 
							function(data,res){
								if(data && data.results.length){
									for(var i = 0; i <data.results.length; i++ ){
										var OneData = data.results[i];
										Datas.Data.push(OneData);		
									}
								}
							},
							function(Res){
								vError = "E";
								if(Res.response.body){
									ErrorMessage = Res.response.body;
									var ErrorJSON = JSON.parse(ErrorMessage);
									if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
										ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
									}
								}
							}
					);
				}
				JSonModel.setData(Datas);
				if(vErrorMessage != ""){
					sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					return;
				}
			},
			endButton : new sap.m.Button({icon :"sap-icon://decline", text : oBundleText.getText("LABEL_0017"), press : function(oEvent){oPopover.close();}}) // 17:닫기
		});
		
		oPopover.setModel(new sap.ui.model.json.JSONModel());
		oPopover.bindElement("/Data");
		
		oPopover.addStyleClass("sapUiSizeCompact");
		

		return oPopover;
	}

});
