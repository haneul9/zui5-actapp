sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Privacy", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var oCell, oRow;
		
		var oText1 = "에쓰-오일주식회사 (이하 '회사')는 임직원의 개인정보를 소중히 생각하며, ‘개인정보보호법’," +
		 "‘정보통신망 이용촉진 및 정보보호에 관한 법률’ 등 관련 법령을 준수하여 정보주체의 권익 " +
		 "보호에 최선을 다하고 있습니다.\n" +
		 "회사는 보다 전문적이고 효율적인 인사정보의 처리를 위해 SAP사 (독일 발도로프 소재)의 " +
		 "HR 솔루션 (인사제도 운영시스템)을 도입하였으며, 해당 솔루션의 운영상 임직원이 " +
		 "거주하는 국가 이외의 지역에 있는 서버에서 임직원의 개인정보가 이전, 보관, 처리될 수 있습니다. \n" +
		 "회사가 임직원의 정보를 해외로 이전, 보관, 처리하고자 할 경우에는 위 법령에 따라  " +
		 "당사자의 동의를 얻어야 함에 따라 해외로 이전되는 개인정보가 어떠한 용도로 이용되고 " +
		 "개인정보 보호를 위해 어떠한 조치가 취해지는지 안내드리오니, 아래 내용을 읽고 모든 " +
		 "내용을 이해하신 후 개인정보의 해외 이전에 대한 동의 여부를 선택해 주시기 바랍니다." ;
		
//		var oText2 = '<span class="FontPrivacyHeader"> 이전항목 </span><br>' +
		
		var oText2 = '<span class="FontFamily">' + '에쓰-오일주식회사 (이하 ‘회사’)는 임직원의 개인정보를 소중히 생각하며, ‘개인정보보호법’,'+
		 '‘정보통신망 이용촉진 및 정보보호에 관한 법률’ 등 관련 법령을 준수하여 정보주체의 권익 ' +
		 '보호에 최선을 다하고 있습니다.<br><br>' +
		 '회사는 보다 전문적이고 효율적인 인사정보의 처리를 위해 SAP사 (독일 발도로프 소재)의 ' +
		 'HR 솔루션 (인사제도 운영시스템)을 도입하였으며, 해당 솔루션의 운영상 임직원이 ' +
		 '거주하는 국가 이외의 지역에 있는 서버에서 임직원의 개인정보가 이전, 보관, 처리될 수 있습니다. <br><br>' +
		 '회사가 임직원의 정보를 해외로 이전, 보관, 처리하고자 할 경우에는 위 법령에 따라  ' +
		 '당사자의 동의를 얻어야 함에 따라 해외로 이전되는 개인정보가 어떠한 용도로 이용되고 ' +
		 '개인정보 보호를 위해 어떠한 조치가 취해지는지 안내드리오니, 아래 내용을 읽고 모든 ' +
		 '내용을 이해하신 후 개인정보의 해외 이전에 대한 동의 여부를 선택해 주시기 바랍니다.</span><br><br>' +
		'<span class="FontPrivacyHeader"> 이전항목 </span><br>' +
		'<span class="FontFamily">' +
		' ◇	회사가 관리하는 근로자명부상 임직원의 고유정보 (성명, 성별, 생년월일, 학력사항, 자격보유사항, 회사 이메일/전화번호 등), 고용에 관한 정보 (입사일자, 직군/직급, 소속부서/직책/업무내용, 근무장소, 근무일수, 휴가 부여 및 사용기록 등), 경력에 관란 정보 (승진/보직변경/이동/파견 등 인사발령기록, 교육이수, 역량개발 등), 평가 및 보상에 관한 정보 </span><br><br>' +
		'<span class="FontPrivacyHeader"> 이전 국가·일시·방법 </span><br>' +
		'<span class="FontFamily">' +
		' ◇	국가 : 호주 시드니 <br>' +
		' ◇ 일시 : 2020. 2. 21. 이후 각 임직원의 최초 로그인 시점 <br>' +
		' ◇	방법 : Global Cloud 지역 소재 server로 보안 강화된 네트워크를 통해 데이터 이전 <br><br>' +
		'<span class="FontPrivacyHeader">이전목적 </span><br>' +
		' ◇	회사 임직원을 대상으로 하는 인사 기획 및 운영 업무 수행을 지원하는 Cloud 기반의 IT 시스템 운영 <br><br>' +
		'<span class="FontPrivacyHeader">보유∙이용 기간 </span><br>' +
		' ◇	임직원의 고용이 유지되는 기간 중에는 해당 정보를 계속 보유하며, 임직원의 고용이 종료된 이후에는 개인정보 수집 및 이용에 관한 동의 후 1년간 개인정보를 보유하고 이후 해당 정보를 지체 없이 파기합니다. 단, 법률에 의해 보존의무가 있는 경우에는 법령이 지정한 일정기간 동안 보존합니다. <br><br>' +
		'<span class="FontPrivacyHeader">관련 시스템 운영에 관한 사항 </span><br>' +
		' ◇	“회사”는 전문적이고 효율적인 인사정보 처리를 위해 SAP사(호주 시드니 소재)의 HR Solution(인사제도 운영시스템)을 채택하고 있습니다. 아울러, 재난위험 등에 대비해 임직원 정보를 물리적 훼손을 방지하고자 SAP사는 재해복구(Disaster Recovery, 호주 시드니 소재)시스템을 두고 있습니다. <br>' +
		' ◇	귀하의 개인정보는 전용회선을 통해 암호화된 파일 형식으로 전송되어 데이터베이스 백업 방식으로 안전하게 보관되며, 극히 예외적인 경우에 있어서의 비상시 이용을 제외하고는 백업 보관 중 외부로부터의 접근이 전면적으로 차단됩니다. 그리고 HR Solution 가동을 위한 내부적 사용도 엄격히 제한되어 접근권한 있는 소수의 담당자에 의해서 업무상 목적으로만 접속 이용이 가능하며, 그 밖에 개인정보보호 법력에서 요구하는 모든 기술적·물리적·관리적 안전조치가 적용됩니다. <br><br>' +
		'<span class="FontPrivacyHeader">동의 거부 안내 </span><br>' +
		' ◇	귀하는 본 안내에 따른 개인정보 해외이전에 대하여 동의를 거부하실 권리가 있습니다. 다만, 귀하가 위 개인정보 해외이전에 대한 동의를 거부하시는 경우에는 해외이전의 목적이 달성될 수 없으므로 이에 따른 불이익이 발생할 수 있음을 함께 안내드립니다.' +
		'<br><br>'+
		'위에서 안내드리는 「개인정보 해외이전 동의」 에 대하여 동의 여부를 선택해 주십시오.'
		' </span>' ;
		var oText3 = "귀하는 본 합의를 체결한 년도에 귀하의 개인사정 및 여하한 사유로 중도 퇴직할 경우 퇴직일 전에 발생(이월)된 연차유급휴가를 모두 사용하는 것에 동의합니다.";
		
		var aRows = [
//			new sap.ui.commons.layout.MatrixLayoutRow({
//				cells : [
//					new sap.ui.commons.layout.MatrixLayoutCell({
//						content : new sap.ui.core.Icon({ 
//							src: "sap-icon://message-information",
//							size : "1.0rem",
//						}).addStyleClass("PaddingTop2"),
//						vAlign : "Top",
//					}).addStyleClass("MatrixData3"),
//					new sap.ui.commons.layout.MatrixLayoutCell({
//						content : new sap.m.Text({
//							text : oText1, 
//						}).addStyleClass("FontFamily"),
//						colSpan : 2
//					}).addStyleClass("MatrixData2")
//				]
//			}),
//			
//			new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.core.Icon({ 
							src: "sap-icon://message-information",
							size : "1.0rem",
						}).addStyleClass("PaddingTop2"),
						vAlign : "Top",
					}).addStyleClass("MatrixData3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :new sap.ui.commons.FormattedTextView({htmlText : oText2 }),
						colSpan : 2
					}).addStyleClass("MatrixData2")
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ToolbarSpacer(),
								new sap.m.RadioButtonGroup({
									columns : 2,
									buttons : [new sap.m.RadioButton({text: "동의함"}).addStyleClass("FontFamily"), 
									           new sap.m.RadioButton({text: "동의하지 않음" }).addStyleClass("FontFamily")], 
						            selectedIndex : "{PrivacyVal}",
						            select : function(oEvent){
						            	var oModel = oEvent.oSource.mBindingInfos.selectedIndex.binding.oContext.oModel;
						            	oModel.setProperty("/Data/PrivacyVal",oEvent.mParameters.selectedIndex );
						            }
								}),
								new sap.m.ToolbarSpacer(),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
		];
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_PrivacyMatrix", {
			widths : ["40px" , "" ,"20px"],
			columns : 3,
			rows : aRows,
			width : "100%"
		});
		oMatrix.setModel(oJSonModel);
		oMatrix.bindElement("/Data");
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_Privacy", {
			content : [oMatrix],
			contentWidth : "1000px",
			showHeader : true,
			title : "개인정보 해외이전에 관한 동의",
			buttons : [ new sap.m.Button({text : "확인",
							type : "Default", 
							icon :"sap-icon://accept",
							press : function(){
								ZUI5_HR_Portal.common.HoldoverController.onSavePrivacy(oController);
							}
						}).addStyleClass("FontFamily"),
						new sap.m.Button({text : "닫기",
							type : "Default", 
							icon :"sap-icon://decline",
							press : function(){
								oDialog.close();
							}
						}).addStyleClass("FontFamily")]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});
