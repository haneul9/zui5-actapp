jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ZNK_ApprovalLine");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementDetail
	 */

	PAGEID : "ZUI5_HR_SalaryStatementDetail",
	BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function() {

		this.getView().addStyleClass("sapUiSizeCompact");

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this),
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		var vSeqnr = "", vPaydt, vEncid ="", vPernr ="";
		
		var vFromPageId = "";
		if(oEvent) {
			vSeqnr = oEvent.data.Seqnr;
			vPaydt = oEvent.data.Paydt;
			vEncid = oEvent.data.Encid;
			vPernr = oEvent.data.Pernr;
			
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		oController.onSearchPDF(oController, vEncid, vSeqnr, vPaydt);
	},
	
	onSearchPDF : function(oController, vEncid, vSeqnr, vPaydt){
		if(!vEncid || !vSeqnr) return;
		
		var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_PDFLayout");
		if(oLayout.getContent()) oLayout.destroyContent();
		
		var oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var oPath = "/PaySlipListSet(Encid='" + encodeURIComponent(vEncid) + "',Seqnr='" + vSeqnr + "',Paydt=datetime'" + dateFormat.format(new Date(common.Common.setTime(vPaydt))) + "T00%3a00%3a00')";
		var vUrl = "", errData = {};
		
		oModel.read(oPath, {
			async : false,
			success : function(data, res) {
				vUrl = data.Url;
				var agent = navigator.userAgent.toLowerCase();
				if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
					vUrl = vUrl +  "#zoom=80";
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					oController.onBack();
				}
			});
			return ;
		}
		
		if(vUrl != ""){
			var oHTML = new sap.ui.core.HTML({
				content : ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + vUrl + "' width='100%' height='" + (window.innerHeight - 130) + "px' frameborder='0' border='0' scrolling='no'></>"],
				preferDOM : false
			});
			
			oLayout.addContent(oHTML);
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2684"), {title : oBundleText.getText("LABEL_0053")});	// 2684:PDF Url이 없습니다.
		}
		
	},

	onAfterShow : function(oEvent) {
		var oController = this;
		oController.SmartSizing(oEvent);		
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementList",
			      data : {Back : "X"}
				}
			);	
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementDetail");
		var oController = oView.getController();
	},
	
});