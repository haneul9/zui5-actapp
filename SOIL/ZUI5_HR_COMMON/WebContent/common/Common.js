jQuery.sap.declare("common.Common");

jQuery.sap.require("sap.ui.commons.layout.HorizontalLayout");
jQuery.sap.require("sap.ui.commons.layout.VerticalLayout");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.suite.ui.commons.BusinessCard");
jQuery.sap.require("sap.m.MessageBox");

(1.005).toFixed(2) == "1.01" || (function(prototype) {
	var toFixed = prototype.toFixed

	prototype.toFixed = function(fractionDigits) {
		var split = this.toString().split('.')
		var number = +(!split[1] ? split[0] : split.join('.') + '1')

		return toFixed.call(number, fractionDigits)
	}
}(Number.prototype));

common.Common = {
	/** 
	* @memberOf common.Common
	*/
	onCollapse : function(oEvent) {
		var oSrc = oEvent.getSource();
		var PAGEID = "";
		var customDataList = oEvent.getSource().getCustomData();
		if (customDataList != null && customDataList.length == 1) {
			PAGEID = customDataList[0].getValue("PAGEID");
		}

		var oLayout = sap.ui.getCore().byId(PAGEID + "_LEFT_LAYOUT");
		var oBeginArea = sap.ui.getCore().byId(PAGEID + "_BEGIN_AREA");
		var oBodyArea = sap.ui.getCore().byId(PAGEID + "_BODY_LAYOUT");
		
		var icon_src = oSrc.getSrc();
		if(icon_src == "sap-icon://navigation-left-arrow") {
			$("#" + PAGEID + "_LEFT_LAYOUT").fadeOut("300", function() {
				if(oLayout) oLayout.setWidth("0px");
				if(oBodyArea) oBodyArea.setWidths(["0px", "10px"]);
				//if(oBeginArea) oBeginArea.setSize("20px"); //(["0px", "20px"]);
				oSrc.setSrc("sap-icon://navigation-right-arrow");
			});
		} else {
			oLayout.setWidth("100%");
			$("#" + PAGEID + "_LEFT_LAYOUT").fadeIn("500", function() {
				if(oLayout) oLayout.setWidth("100%");
				//if(oBeginArea) oBeginArea.setSize("320px");
				if(oBodyArea) oBodyArea.setWidths(["200px", "10px"]);
				oSrc.setSrc("sap-icon://navigation-left-arrow");
			});
		}
	},
	
	getController : function(oEvent) {
		var oView = oEvent.getSource();
		var oController = null;
		for(;;) {
			oView = oView.getParent();
			var _id = oView.getId();
			var _n = _id.search("ZUI5_HR_YEARTAX");
			if(_n == 0) {
				oController = oView.getController();
				break;
			}
		}
		return oController;
	},
	
	onExit : function(oEvent) {
		document.location.href = "javascript:window.close()";
	},
	
	handleNavHome : function(oEvent) {
		document.location.href = "index.html";
	},
	
	getErrMessage : function(oErrorResponse){
		var Err = window.JSON.parse(oErrorResponse.body);
		var returnVal = {"Type":"","Title":"","Message":""};
		
		if(Err.error.innererror.errordetails[0].severity == "info") {
			returnVal.Type = "I";
			returnVal.Title = "{i18n>MSG_TITLE_1001}";
		} else {
			returnVal.Type = "E";
			returnVal.Title = "{i18n>MSG_TITLE_1002}";
		}
		returnVal.Message = Err.error.innererror.errordetails[0].message;
		
		return returnVal;
	},
	
	padZero : function(d) {
		if(d < 10) return "00" + d;
		else if(d < 100) return "0" + d;
		else return "" + d;
	},
	
	lpad : function(d, width) {
		d = d + '';
		return d.length >= width ? d : new Array(width - d.length + 1).join('0') + d;
	},
	
	showErrorMessage : function(msg) {
		sap.m.MessageBox.show(
		          msg, {
		          icon: sap.m.MessageBox.Icon.ERROR,
		          title: "Error",
		          actions: [sap.m.MessageBox.Action.OK],
		          styleClass: "sapUiSizeCompact"
		        }
		 );
	},
	
	showWarningMessage : function(msg) {
		sap.m.MessageBox.show(
		          msg, {
		          icon: sap.m.MessageBox.Icon.WARNING,
		          title: "Warning",
		          actions: [sap.m.MessageBox.Action.OK],
		          styleClass: "sapUiSizeCompact"
		        }
		 );
	}, 
	
	log : function(msg) {
		if(typeof console === "undefined") {
		} else {
			console.log(msg);
		}
	},
	
	getODataPropertyLength : function(model_name, entity_name, property_name) {
		var oModel = sap.ui.getCore().getModel(model_name);		
		if(!oModel) return 0;
		
		var oMetaModel = oModel.getMetaModel();
		
		var vSRVName = model_name;
		if(model_name.indexOf("_SRV") < 0) vSRVName = vSRVName + "_SRV";
		var oEntityType = oMetaModel.getODataEntityType(vSRVName + "." + entity_name);

		if(!oEntityType) return 0;
		
		var oProperty = oMetaModel.getODataProperty(oEntityType, property_name);
		var maxLength = 0;
		if(oProperty) {
			if(oProperty.type == "Edm.Decimal") {
				maxLength = parseInt(oProperty.precision);
				if(parseInt(oProperty.scale) > 0) maxLength += parseInt(oProperty.scale) + 1;
			} else if(oProperty.type == "Edm.String") {
				maxLength = parseInt(oProperty.maxLength);
			}
		}
		return maxLength;
	},
	
	getTime : function(d) {
		if(d == null || d == "") return 0;
		
		if(d.length > 8 && d.indexOf('-') < 0) {
			d = d.replace(/[^\d]/g, '-');
		} else if(d.length == 8) {
			d = d.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
		} else if(d.length < 8) {
			return 0;
		}
		var vTmp1 = new Date(d);
		
		if(vTmp1.getTimezoneOffset() < 0) {
			vTmp1.setTime(vTmp1.getTime() - (vTmp1.getTimezoneOffset() * 60000));
		} else {
			vTmp1.setTime(vTmp1.getTime() + (vTmp1.getTimezoneOffset() * 60000));
		}
		
		return vTmp1.getTime();
	},
	
	setTime : function(d) {
		if(d == null || d == "") {
			console.log("Date Null !!!");
			return "";
		}
		var vTmp1 = new Date(d.getTime());
		
		if(vTmp1.getTimezoneOffset() < 0) {
			vTmp1.setTime(vTmp1.getTime() - (vTmp1.getTimezoneOffset() * 60000));
		} else {
			vTmp1.setTime(vTmp1.getTime() + (vTmp1.getTimezoneOffset() * 60000));
		}
		
		return vTmp1.getTime();
	},
	
	getTime2 : function(t) {
		if(t == null || t == "") return 0;
		var vTmp1 = new Time(t);
		
		if(vTmp1.getTimezoneOffset() < 0) {
			vTmp1.setTime(vTmp1.getTime() - (vTmp1.getTimezoneOffset() * 60000));
		} else {
			vTmp1.setTime(vTmp1.getTime() + (vTmp1.getTimezoneOffset() * 60000));
		}
		
		return vTmp1.getTime();
	},
	
	setTime2 : function(t) {
		if(t == null || t == "") {
			console.log("Date Null !!!");
			return "";
		}
		var vTmp1 = t;
		
		if(vTmp1.getTimezoneOffset() < 0) {
			vTmp1.setTime(vTmp1.getTime() - (vTmp1.getTimezoneOffset() * 60000));
		} else {
			vTmp1.setTime(vTmp1.getTime() + (vTmp1.getTimezoneOffset() * 60000));
		}
		
		return vTmp1.getTime();
	},
//	numberWithCommas : function(x) {
//		if(x == undefined){
//			
//		}else if(x * 1 == 0){
//			return "" ;
//		}else{
//			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//		}
//	},
	
	numberWithCommas : function(x , zero) {
		if(x == undefined){
			return "";
		}else{
			x=x.toString().replace(/,/gi,"");
			x=x.toString().replace(/\,/g,'') ;
			x=x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			if(x == 0 && zero == "X") x = "";
			return x;
		}
	},
	
	removeComma : function(x){
		if(x == undefined ) return "0";
		else if(x == 0) return "0";
		x=""+ x;
		x=x.trim().replace(/\,/g,'') ;
		return x;
	},
	
	checkDate : function(vStartDate , vEndDate){
		if(vStartDate && vEndDate) {
			var getDate1 = new Date(vStartDate);
			var getDate2 = new Date(vEndDate);	
	     
			if(getDate1.getTime() > getDate2.getTime()) {
				return false;
			}
		}
		return true;
	},
	
	checkTimeCompare : function(vStartTime, vEndTime){
		if(vStartTime * 1 > vEndTime * 1) return false;
		return true;
	},
	
	getControlId : function(oController , vStr){
		var vRetda = {} ;
		var vControlId = vStr.replace(oController.PAGEID ,"");
		if(vControlId.charAt(0) == "_"){
			vControlId = vControlId.replace("_" ,"");
		}
		vRetda.Id = vControlId ;
		
		var oControl = sap.ui.getCore().byId(vStr);
		
		if(oControl.getCustomData() && oControl.getCustomData().length > 0){
			var vCustomData = oControl.getCustomData()[0];
			vRetda.Key = vCustomData.getKey() ;
			vRetda.Val = vCustomData.getValue() ;
		}
		
		return vRetda ;
	},
	
	checkTime : function(oEvent){
		if(oEvent && oEvent.getParameters().value){
			var vTmp = oEvent.getParameters().value.substring(2,4);
			
			if(!(vTmp == "00" || vTmp == "10" || vTmp == "20" || vTmp == "30" || vTmp == "40" || vTmp == "50")){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2806"), {title : oBundleText.getText("LABEL_0053")});	// 53:오류, 2806:시간을 10분 단위로 입력하여 주십시오.
				return false;
			}
			
		}

		return true;
	},
	/**
	 * 서비스 모델의 메타데이터를 이용해 오브젝트를 복사한다.
	 * 
	 * @param {oModel} service model
	 * @param {entityName} entity name
	 * @param {originalObj} original object
	 * @returns {copyData} new object
	 */
	copyByMetadata : function(oModel, entityName, originalObj) {
		if(oModel == null) throw new Error(oBundleText.getText("LABEL_2807"));	// 2807:모델이 정의되지 않았습니다.
		
		var copyData = {};
		oModel.getServiceMetadata().dataServices.schema[0].entityType.forEach(function(entity, i, a) {
			if(entity.name == entityName) {
				entity.property.forEach(function(prop, index, array) {
					copyData[prop.name] = originalObj[prop.name];
				});
			}
		});
		/*
		var copyData = {};
		oModel.getServiceMetadata().dataServices.schema[0].entityType.forEach(function(entity, i, a) {
			if(entity.name == entityName) {
				entity.property.forEach(function(prop, index, array) {
					if(prop.maxLength && originalObj[prop.name]) {
						if(originalObj[prop.name].length > Number(prop.maxLength)) {
							throw new Error(prop.extensions[1].value + " 항목은 " + prop.maxLength + "자 까지만 입력 가능합니다.");
						}
					}
					copyData[prop.name] = originalObj[prop.name];
				});
			}
		});
		*/
		return copyData;
	},
	/**
	 * 통신시 발생하는 error response를 파싱한다.
	 * 
	 * @param {Res} response object
	 * @returns {errData} object{Error:"", ErrorMessage:""}
	 */
	parseError : function(Res) {
		if(!Res || !Res.response || !Res.response.body) return null;
		
		var errData = {}, 
			errorJSON = null;
		
		errData.Error = "E";
		
		try {
			errorJSON = JSON.parse(Res.response.body);
			
			if(errorJSON.error.innererror.errordetails && errorJSON.error.innererror.errordetails.length) {
				errData.ErrorMessage = errorJSON.error.innererror.errordetails[0].message;
			} else if(errorJSON.error.message) {
					errData.ErrorMessage = errorJSON.error.message.value;
			} else {
				errData.ErrorMessage = oBundleText.getText("LABEL_2808") ;	// 2808:Error 발생.
			}
		} catch(ex) {
			errData.ErrorMessage = Res.message;
		}
		
		return errData;
	},
	
	isNull : function(v) {
		return (v === undefined || v === null) ? true : false;
	},
	
	checkNull : function(v) {
		return (v === undefined || v === null || v== "") ? true : false;
	},
	
	adjustGMT : function(dDate) {
		if(!dDate) return null;
		
		var copiedDate = new Date(dDate.getTime()),
			sw = copiedDate.getTimezoneOffset() < 0 ? -1 : 1;
		
		return copiedDate.setHours(copiedDate.getHours() + (copiedDate.getTimezoneOffset() / 60 * sw));
	},
	
	reIndexODataArray : function(arrayData) {
		if(!arrayData) return;
		
		var vIdx = 0;
		arrayData.forEach(function(prop, index, array) {
			prop.Idx = ++vIdx;
		});
		
		return arrayData;
	} ,
	
	replaceAll : function(str, searchStr, replaceStr) {
		  str = "" + str; 
		  return str.split(searchStr).join(replaceStr);
	},
	
	/**
	 * Excel에서 사용 할 컬럼정보로 변환
	 * 
	 * @param {Array} colModels
	 * @returns {Array<{label: string, property: string, type: string, template: {content: {parts: string, formatter: function()}}}>}
	 */
	convertColumnArrayForExcel : function(colModels) {
		var _this = this,
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"}),
			preText = '';
		
		return $.map(colModels, function(rowData, k) {
			if(rowData.label && rowData.plabel) {
				if(rowData.label != rowData.plabel) {
					preText = rowData.label + "-";
				} else {
					preText = '';
				}
			} else if(rowData.label && !rowData.plabel) {
				preText = '';
			}
			
			return {
				label : (rowData.label && rowData.plabel) ? preText + rowData.plabel : (!rowData.label) ? preText + rowData.plabel : rowData.label,
				property : rowData.id,
				type : (rowData.type == 'listdate') ? sap.ui.export.EdmType.Date 
							: (rowData.type == 'listText') ? sap.ui.export.EdmType.String 
									: (rowData.type.indexOf("Checkbox") > -1) ? sap.ui.export.EdmType.Boolean 
											: (rowData.type.indexOf("money") > -1 || rowData.type.toLowerCase().indexOf("number") > -1) ? sap.ui.export.EdmType.Number 
													: rowData.type,
				template : (rowData.type == 'listdate' || rowData.type == 'date')
					? {
						content : {
							parts : [rowData.id], 
							formatter : function(fVal) {
								return (!fVal || typeof fVal === "string") ? fVal : dateFormat.format(new Date(common.Common.setTime(fVal)));
							}
						}
					}
					: undefined
			}
		});
	},
	
	/**
	 * Table에서 지정한 컬럼의 rowspan효과를 준다.
	 * 해당 인덱스에 동일한 값이 있으면 실행
	 * 
	 * @param {selector : {string}, colIndexes : {Array}}
	 */
	generateRowspan : function(opt) {
		opt = opt || {
			selector : '',
			colIndexes : []
		};
		
		var $target = $(opt.selector),
			that,
			thisvalue,
			thatvalue,
			rowspan,
			regxp = /(\<[span]+[^>]+[\>])([^<]*)(\<\/[span]+\>)/;
		
		if(!$target || !opt.colIndexes.length) return;
		
		opt.colIndexes.forEach(function(colidx) {
			that = null;
			
			$target.each(function() {
				$('tr', this).each(function(row) {
					$('td:eq('+colidx+')', this).filter(':visible').each(function(col) {
						thisval = $(this).html().match(regxp)[2];
						thatval = $(that).html() ? $(that).html().match(regxp)[2] : '';
						
						if(thisval == thatval) {
							rowspan = $(that).attr("rowspan") || 1;
							rowspan = Number(rowspan)+1;
							
							$(that).attr("rowspan",rowspan);
							$(this).hide();
						} else {
							that = this;
						}
						
						that = (that == null) ? this : that;
					});
				});
			});
		});
	},
	
	/**
	 * Table에서 지정한 컬럼의 rowspan효과를 준다.
	 * 해당 인덱스에 동일한 값이 있으면 실행
	 * 
	 * @param {selector : {string}, colIndexes : {Array}}
	 */
	generateForceRowspan : function(opt) {
		opt = opt || {
			selector : '',
			colIndexes : []
		};
		
		var $target = $(opt.selector),
			that,
			thisvalue,
			thatvalue,
			rowspan,
			regxp = /(\<[span]+[^>]+[\>])([^<]*)(\<\/[span]+\>)/;
		
		if(!$target || !opt.colIndexes.length) return;
		
		opt.colIndexes.forEach(function(colidx) {
			that = null;
			
			$target.each(function() {
				$('tr', this).each(function(row) {
					$('td:eq('+colidx+')', this).filter(':visible').each(function(col) {
						if(that != null && this != null){
							rowspan = $(that).attr("rowspan") || 1;
							rowspan = Number(rowspan)+1;
							
							$(that).attr("rowspan",rowspan);
							$(this).hide();
						}						
						that = (that == null) ? this : that;
					});
				});
			});
		});
	},
	
	generateForceRowspanData : function(opt) {
		opt = opt || {
			selector : '',
			tableDataLen : 0,
			colIndexes : []
		};
		
		var $target = $(opt.selector);
		
		if(!$target || !opt.colIndexes.length) return;
		
		opt.colIndexes.forEach(function(colidx) {
			$target.each(function() {
				$('tr', this).eq(opt.tableDataLen-2).find('td:eq('+colidx+')').attr("rowspan", 2);
				$('tr', this).eq(opt.tableDataLen-1).find('td:eq('+colidx+')').hide();
			});
		});
	},
	rowSelectSingle : function(oEvent){
		console.log(oEvent);
		
	},
	
	timeToString : function(val, format) {
		format = format || "KK:mm:ss a";
		format = format == "KK:mm" ? "HH:mm" : format;
		
		if (val && val.ms) {
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: format
			});
			
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			return timeFormat.format(new Date(val.ms + TZOffsetMs));
		} else if(val && val.ms == 0) {
			return "24:00";
		}
		
		return null;  
	},
	
	convertTimeToEdmTime : function(d){
		if(common.Common.checkNull(d)) return "";
		
		var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
		var oType = new sap.ui.model.odata.type.DateTime({pattern : "PTHH'H'mm'M'ss'S'"});
		
		return oType.formatValue(new Date(d + TZOffsetMs), 'string');
	},
	
	onChangeMoneyInput : function(oEvent){
		inputValue = oEvent.getSource().getValue();
		oEvent.getSource().setValue(common.Common.numberWithCommas(inputValue.replace(/[^\d]/g, '')));
	},
	
	convertSAPPropertyErrorMessage : function(oModel, entityName, ErrorMessage) {
		if(!oModel) return ErrorMessage;
		
		var errorPropertyName = ErrorMessage.split('\'')[1],
			convertMessage = oBundleText.getText("LABEL_2809"),	// 2809:# 필드의 값이 유효하지 않습니다.
			fieldLabel = '';
		
		oModel.getServiceMetadata().dataServices.schema[0].entityType.forEach(function(entity, i, a) {
			if(entity.name == entityName) {
				entity.property.forEach(function(prop, index, array) {
					if(errorPropertyName == prop.name) {
						prop.extensions.forEach(function(extension) { if(extension.name == 'label') fieldLabel = extension.value;});
						
						convertMessage = convertMessage.replace('#', fieldLabel);
					}
				});
			}
		});
		
		return convertMessage;
	},
	
	addZero : function(d) {
		if(d < 10) return "0" + d;
		else return "" + d;
	},
	
	/**
	 * valuehelper가 정의된 input객체에 clear버튼을 활성화한다.
	 * oInput 필수
	 * clear 선택
	 * helper 선택
	 * clearP 선택 - clear 이벤트 처리시 Parameter
	 * helper 선택 - helper 이벤트 처리시 Parameter
	 * (주의 - 해당 객체의 change 이벤트는 직접 handling 필요)
	 * 
	 * @param {oInput : {object}, clear : {function}, helper : {function}}
	 */
	swapClearButton : function(opt) {
		if(!opt.oInput) {
			console.log("[Common.swapClearButton] Object not found.");
			return;
		}
		
		opt.oInput._getValueHelpIcon().setSrc("sap-icon://sys-cancel");
		opt.oInput.fireValueHelpRequest = function(evt) {
			if(opt.clear) {
				if(opt.clearP) opt.clear(opt.clearP);
				else opt.clear();
			} else {
				this.setValue("");
			}
			
			this._getValueHelpIcon().setSrc("sap-icon://value-help");
			this.fireValueHelpRequest = function() {
				if(opt.helper){
					if(opt.helperP) opt.helper(opt.helperP);
					else opt.helper();
				}
			};
		};
	},
	
	
	/**
	 * 두 날짜의 차이 return
	 * @param date1 : {object}, date2 : {object}
	 */
	calDate : function(date1, date2) {
		var dateArray1 = date1.split("-"),
		dateArray2 = date2.split("-");
		var dateObj1 = new Date(dateArray1[0], Number(dateArray1[1])-1, dateArray1[2]),  
		 dateObj2 = new Date(dateArray2[0], Number(dateArray2[1])-1, dateArray2[2]);
		return (dateObj1.getTime() - dateObj2.getTime())/1000/60/60/24;  
	},
	
	setOnlyDigit : function(oEvent) {
		var inputValue = oEvent.getParameter('value').trim(),
		convertValue = inputValue.replace(/[^\d]/g, '');
		
		oEvent.getSource().setValue(convertValue);
	},
	
	setInformationButton : function(oController, flag){
		var oCommonModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var aFilters = [];
		var oManualToolbar = sap.ui.getCore().byId(oController.PAGEID + "_ManualToolbar");
		oManualToolbar.destroyContent();
		
		if(common.Common.checkNull(oController._vZworktyp) || common.Common.checkNull(flag)) return;
		
		aFilters.push(new sap.ui.model.Filter('Gubun', sap.ui.model.FilterOperator.EQ, flag));
		aFilters.push(new sap.ui.model.Filter('ReqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp));
		
		oCommonModel.read("/InfomationButtonSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i = 0; i < data.results.length; i++){
						 var oButton = new sap.m.Button({
								text: data.results[i].Button,
								type : sap.m.ButtonType.Ghost,
								press : function(oEvent){
									var vUrl = oEvent.getSource().getCustomData()[0].getValue();
									if(vUrl && vUrl != ""){
										window.open(vUrl);
									}
								},
								customData : new sap.ui.core.CustomData({key : "Url", value : data.results[i].Fileuri})
						    });
						    
						
						oManualToolbar.addContent(oButton);
						
					}
					
					
					
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
	},
	
	getEmpLoginInfo : function(Auth, Zworktyp, vLangu) {
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
			vMenuId = "",
			aFilters = [],
			rData = {};
		aFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, Auth));
		if(Zworktyp) aFilters.push(new sap.ui.model.Filter('ReqForm', sap.ui.model.FilterOperator.EQ, Zworktyp));
		if(_gMncod ) aFilters.push(new sap.ui.model.Filter('Lpmid', sap.ui.model.FilterOperator.EQ, _gMncod));
		if(vLangu ) aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, vLangu));
		
		oModel.read("/EmpLoginInfoSet", {
			async : false,
			filters : aFilters,
			success : function(Data,Res) {
				if(Data && Data.results.length){
					rData = Data.results[0] ;
					if(rData.Scryn != true){
						window.open("/sap/bc/ui5_ui5/sap/zui5_hr_common/noauth.html","_self");
						return;
					}
				}else{
					window.open("/sap/bc/ui5_ui5/sap/zui5_hr_common/noauth.html","_self");
					return;
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				if(errData) {
					new control.ZNK_SapBusy.oErrorMessage(errData.ErrorMessage);
				}
					window.open("/sap/bc/ui5_ui5/sap/zui5_hr_common/Error.html","_self");
				return;
			}
		});
		
		return rData;
	},
	
	convertDateField : function(oTableDatas) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"}),
			keySet = [];
		
		if(Array.isArray(oTableDatas.Data)) {
			oTableDatas.Data.forEach(function(elem, index, array) {
				if(index == 0) keySet = Object.keys(elem);
				
				keySet.forEach(function(keyid) {
					if(elem[keyid] instanceof Date) {
						elem[keyid + "Txt"] = dateFormat.format(new Date(common.Common.setTime(elem[keyid])));
					}
				});
			});
		}
	},
	
	maskingAccountNumber : function(vAccNumber, n) {
		if(!vAccNumber) return "";
		if(vAccNumber.length <= n) return vAccNumber; 
		
		var txtLength = vAccNumber.length,
			visibleText = vAccNumber.substring(txtLength - n, txtLength);
			
		return new Array(txtLength - n + 1).join("*") + visibleText;
	},
	
	exportToExcel : function(oTable, oController, vFileName) {
		var that = this;
		var aColumns = oTable.getColumns();
		var aTemplate = [];
		var oColumnInfos = oController._Columns;
		
		oController.BusyDialog.open();
		
		for(var i = 0; i < oColumnInfos.length; i++) {
			var pathId = oColumnInfos[i].type.indexOf('date') > -1 ? oColumnInfos[i].property + "Txt" : oColumnInfos[i].property;
			
			var oColumn = {
				name: oColumnInfos[i].label,
				template: {
					content : "{" + pathId + "}"
				}
			};
			
			aTemplate.push(oColumn);
		}

		
		
		var oExport = new sap.ui.core.util.Export({
			busy : true,
			// Type that will be used to generate the content. Own ExportType’s can be created to support other formats
			exportType: new sap.ui.core.util.ExportTypeCSV({
				separatorChar : ",",
				charset : "utf-8"
			}),
			// Pass in the model created above
			models: oTable.getModel(),
			// binding information for the rows aggregation
			rows: {
				path: "/Data"
			},
			// column definitions with column name and binding info for the content
			columns: aTemplate
		});
		
		oExport.saveFile(vFileName).always(function() {
			oController.BusyDialog.close();
			this.destroy();
		});
	},
	
	onSearchDefaultAufnr : function(oController, vDatum) {
		if(common.Common.checkNull(vDatum)) return "";
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
		aFilters = [], errData = {}, 
		vAufnr = [];
		var vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		vPersa = '7000';
		aFilters.push(new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, vDatum));
		aFilters.push(new sap.ui.model.Filter('Werks', sap.ui.model.FilterOperator.EQ, vPersa));
		
		oModel.read("/AufnrDefaultSet", {
			async : false,
			filters : aFilters,
			success : function(Data,Res) {
				if(Data && Data.results.length){
					vAufnr[0] = Data.results[0].Aufnr ;
					vAufnr[1] = Data.results[0].Aufnrtx ;
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error == "E") {
			sap.m.MessageBox.show(errData.ErrorMessage, {});
			return [];
		}
		
		return vAufnr ;
	},
	
	isValidDate : function(d) {
		return d instanceof Date && !isNaN(d);
	},
	
	onPressApprovalCancel : function(oController) {
		if(!oController._vAppno || oController._vAppno == "") return;
		
		var onProcess = function() {
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
				params = {},
				vErrorMessage = "";
				
			params.Appno = oController._vAppno;
				
			oModel.create("/ApprovalReqCancelSet", params, {
				success : function(data,res){
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			oController.BusyDialog.close();
							
			if(vErrorMessage != ""){
				sap.m.MessageBox.error(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			} 				
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2938"), {	// 2938:신청이 취소되었습니다.
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions: [sap.m.MessageBox.Action.CLOSE],
				onClose: oController.onBack
			});
		};
		
		var CancelProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}; 
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_2939"), {	// 2939:신청 취소 하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CancelProcess
		});
	}
	
};