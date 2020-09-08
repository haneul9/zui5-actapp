jQuery.sap.declare("common.Formatter");

jQuery.sap.require("sap.ui.core.format.DateFormat");

common.Formatter = {
		

	Ename : new String(),

	_statusStateMap : {
		"Neu" : "Warning",
		"Initial" : "Success"
	},

	/** 
	* @memberOf common.Formatter
	*/
	priceType : new sap.ui.model.type.Float({
		minFractionDigits : 0
	}),

	dateType : new sap.ui.model.type.Date({
		pattern : "yyyy-MM-dd"
	}),

	StatusIcon : function(fValue) {
		try {
			fValue = parseInt(fValue);
			if (fValue == 1) {
				return "sap-icon://document-text";
			} else if (fValue == 2) {
				return "sap-icon://pending";
			} else if (fValue == 4) {
				return "sap-icon://employee-approvals";
			} else if (fValue == 5) {
				return "sap-icon://employee-rejections";
			}
		} catch (err) {
			return "";
		}
	},

	StatusVisible : function(fValue) {
		try {
			fValue = parseInt(fValue);
			if(isNaN(fValue)) return false;
			
			if (fValue == 0) {
				return false;
			} else {
				return true;
			}
		} catch (err) {
			return false;
		}
	},

	StatusEnable : function(fValue) {
		try {
			fValue = parseInt(fValue);
			if (fValue == 1) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	},

	setEdiable : function(fValue) {
		try {
			fValue = parseInt(fValue);
			if (fValue == 1 || fValue == 3) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	},

	StatusIconColor : function(fValue) {
		try {
			fValue = parseInt(fValue);
			if (fValue == 1) {
				return "None";
			} else if (fValue == 2) {
				return "Warning";
			} else if (fValue == 4) {
				return "Success";
			} else if (fValue == 5) {
				return "Error";
			}
		} catch (err) {
			return "";
		}
	},

	EventState : function(fValue) {
		try {
			fValue = parseInt(fValue);
			if (fValue == 1) {
				return "None";
			} else if (fValue == 2) {
				return "Waring";
			} else if (fValue == 4) {
				return "Success";
			} else if (fValue == 5) {
				return "Error";
			} else {
				return "Error";
			}
		} catch (err) {
			return "Error";
		}
	},

	StatusColor : function(fVal) {
		if (fVal == "X") {
			return "red";
		} else {
			return "green";
		}
	},

	//sap.ui.core.BarColor.CRITICAL Color: yellow (#faf2b0) 75 ~ 84
	//sap.ui.core.BarColor.NEGATIVE Color: red (#ff9a90)   75
	//sap.ui.core.BarColor.NEUTRAL Color: blue (#b8d0e8)   95
	//sap.ui.core.BarColor.POSITIVE Color: green (#b5e7a8) 85 ~ 94
	SetPointColor : function(fVal) {
		if (fVal >= 95)
			return sap.ui.core.BarColor.NEUTRAL;
		else if (fVal >= 85 && fVal < 95)
			return sap.ui.core.BarColor.POSITIVE;
		else if (fVal >= 75 && fVal < 85)
			return sap.ui.core.BarColor.CRITICAL;
		else if (fVal < 75)
			return sap.ui.core.BarColor.NEGATIVE;
	},
	
	SettlementStatusColor : function(fVal) {
		if (fVal == "100") {
			return "gray";
		} else if(fVal == "200"){
			return "yellow";
		} else if(fVal == "300"){
			return "red";
		} else if(fVal == "400"){
			return "blue";
		} else return "gray";
	},
	
	SettlementStatusColor2 : function(fVal) {
		if (fVal == "100") {
			return "gray";
		} else if(fVal == "200"){
			return "yellow";
		} else if(fVal == "300"){
			return "red";
		} else if(fVal == "400"){
			return "blue";
		} else if(fVal == "500"){
			return "green";
		}
	},

	HR154CheckBoxColor : function(fVal) { 
		if (fVal == "X") {
			return "red";
		} else {
			return "white";
		}
	},
	
	HR155CheckBoxColor : function(fVal) { 
		if (fVal == "X") {
			return "red";
		} else {
			return "white";
		}
	},
	
	HR156CheckBoxColor : function(fVal) { 
		if (fVal == "X") {
			return "red";
		} else {
			return "white";
		}
	},
	
	HR071StatusColor : function(fVal) {
		if (fVal == "0") {
			return "gray";
		} else if(fVal == "1"){
			return "green";
		} else if(fVal == "2"){
			return "yellow";
		} else if(fVal == "3"){
			return "blue";
		} else if(fVal == "4"){
			return "red";
		}
	},
	
	HR071StatusText : function(fVal) {
		if (fVal == "0") {
			return oBundleText.getText("LABEL_2813");	// 2813:작성
		} else if(fVal == "1"){
			return oBundleText.getText("LABEL_2814");	// 2814:제출
		} else if(fVal == "2"){
			return oBundleText.getText("LABEL_1471");	// 1471:결재
		} else if(fVal == "3"){
			return oBundleText.getText("LABEL_0041");	// 41:승인
		} else if(fVal == "4"){
			return oBundleText.getText("LABEL_0024");	// 24:반려
		}
	},
	
	HR071StatusTooltip : function(fVal) {
		if (fVal == "0") {
			return oBundleText.getText("LABEL_2815");	// 2815:작성 중
		} else if(fVal == "1"){
			return oBundleText.getText("LABEL_2816");	// 2816:제출 완료
		} else if(fVal == "2"){
			return oBundleText.getText("LABEL_2817");	// 2817:결재 중
		} else if(fVal == "3"){
			return oBundleText.getText("LABEL_2818");	// 2818:승인 완료
		} else if(fVal == "4"){
			return oBundleText.getText("LABEL_0024"); 	// 24:반려
		}
	},
	
	DocStatusColor : function(fVal) {
		if (fVal == "100") {
			return "gray";
		} else if(fVal == "500"){
			return "green";
		} else if(fVal == "200"){
			return "yellow";
		} else if(fVal == "400"){
			return "blue";
		} else if(fVal == "300"){
			return "red";
		}
	},
	
	DocStatusText : function(fVal) {
		if (fVal == "100") {
			return oBundleText.getText("LABEL_2813");	// 2813:작성
		} else if(fVal == "200"){
			return oBundleText.getText("LABEL_2814");	// 2814:제출
		} else if(fVal == "500"){
			return oBundleText.getText("LABEL_1471");	// 1471:결재
		} else if(fVal == "400"){
			return oBundleText.getText("LABEL_0041");	// 41:승인
		} else if(fVal == "300"){
			return oBundleText.getText("LABEL_0024");	// 24:반려
		}
	},
	
	DocStatusTooltip : function(fVal) {
		if (fVal == "100") {
			return oBundleText.getText("LABEL_0059");	// 59:작성중
		} else if(fVal == "200"){
			return oBundleText.getText("LABEL_0621");	// 621:결재요청
		} else if(fVal == "500"){
			return oBundleText.getText("LABEL_2819");	// 2819:결재중
		} else if(fVal == "400"){
			return oBundleText.getText("LABEL_2820");	// 2820:승인완료
		} else if(fVal == "300"){
			return oBundleText.getText("LABEL_2821");	// 2821:반려처리
		}
	},
	
	StatusColorMss_Capa : function(fVal) {
		if (fVal == "X") {
			return "red";
		} else {
			return "green";
		}
	},

	StatusState : function(value) {
		return (value && util.Formatter._statusStateMap[value]) ? util.Formatter._statusStateMap[value]
				: "None";
	},

	Quantity : function(value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	},

	Date : function(value) {
//		alert("Date :" + value);
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat
					.getDateTimeInstance({
						pattern : "yyyy-MM-dd"
					});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},

	AttachmentMap : {
		"ppt" : "ppt-attachment",
		"pdf" : "pdf-attachment",
		"zip" : "attachment-zip-file"
	},

	AttachmentIcon : function(value) {
		var map = util.Formatter.AttachmentMap;
		var code = (value && map[value]) ? map[value] : "question-mark";
		return "sap-icon://" + code;
	},
	
	setTooltip : function(val1) {
		return common.Common.TooltipEmpolyeeCard(val1);
	},
	
	onSetInfoTableData : function(Pyear, HalfC, Status, ScoreF, ScoreS, ScoreA, ADate) {
//		alert(Pyear + ", " + ScoreF + ", " + Status);
		return null;
		//return [Pyear, HalfC, Status, ScoreF, ScoreS, ScoreA, ADate];
	},
	
	setAgoGradeImage : function (fVal) {
		if(fVal) return "images/icon_grade" + fVal.toLowerCase() + ".png";
		else return "images/icon_gradea.png";
	},
	
	visibleAgoGradeImage : function (fVal) {
		if(fVal && fVal != "") return true;
		else return false;
	},
	
	setChecked : function(fVal) {
		if(fVal == "1") return true;
		else return false;
	},
	
	convertInt : function(fVal) {
		return fVal == "" ? 0 : parseInt(fVal);
	},
	
	setGoalVisible : function(fVal) {
		if(fVal) {
			if(fVal.trim() == "0") return false;
			else return true;
		} else return false;
	},
	
	ColorCirclePoint : function(fValue) {
		if(!isNaN(parseInt(fValue))) {
			return parseInt(fValue);
		} else {
			return 0;
		}
	},
	
	ColorCircleFloat : function(fValue) {
		if(!isNaN(parseFloat(fValue))) {
			return parseFloat(parseFloat(fValue).toFixed(1));
		} else {
			return 0.0;
		}
	},
	
	setTextBold : function(fValue) {
		if(fValue==""||fValue=="0"){
			return sap.ui.commons.TextViewDesign.Standard ;
		}else{
			return sap.ui.commons.TextViewDesign.Bold ;
		}
		
	},
	
	formatNumber : function(fVal) {
		if(!fVal) return 0;
		
		var numberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({  
	         maxIntegerDigits: 10,  
	         minIntegerDigits: 1,  
	         maxFractionDigits: 0,  
	         minFractionDigits: 0,  
	         groupingEnabled: true  
		});
		
		return numberFormat.format(parseInt(fVal));
	},
	
	formatNumberKRW : function(fVal) {
		if(!fVal) return "";
		 
//		var numberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({  
//	         maxIntegerDigits: 10,  
//	         minIntegerDigits: 1,  
//	         maxFractionDigits: 0,  
//	         minFractionDigits: 0,  
//	         groupingEnabled: true  
//		});
		if(fVal.trim() == "0.00"){
			return fVal.replace(/0.00/g , "-");
		}
		
		return fVal + " " + oBundleText.getText("LABEL_0324");	// 324:원
		
		
		
	},
	
	formatNumberCount : function(fVal) {
		if(!fVal) return 0;
		
		var numberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({  
	         maxIntegerDigits: 10,  
	         minIntegerDigits: 1,  
	         maxFractionDigits: 0,  
	         minFractionDigits: 0,  
	         groupingEnabled: true  
		});
		
		return numberFormat.format(parseInt(fVal)) + " " + oBundleText.getText("LABEL_0001");	// 0001:건
	}
	
};