sap.ui.jsfragment("ZUI5_HR_Overview.fragment.OverviewPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		
		
		var oComboBox = new sap.m.ComboBox({
			width : "300px",
            selectedKey : "{cities}",
		  })
		
		var vCities = 
		[
			{
				text: "Berlin",
				key: "BR"
			},
			{
				text: "London",
				key: "LN"
			},
			{
				text: "Madrid",
				key: "MD"
			},
			{
				text: "Prague",
				key: "PR"
			},
			{
				text: "Paris",
				key: "PS"
			},
			{
				text: "Sofia",
				key: "SF"
			},
			{
				text: "Vienna",
				key: "VN"
			}
		];
		
		for(var i=0; i<vCities.length; i++) {
			oComboBox.addItem(
					 new sap.ui.core.Item({
							key : vCities[i].key, 
							text : vCities[i].text, 
						})
				);
		}
		
		
		
		var vCard1 = new sap.f.Card({
			width : "300px",
			class : "sapUiMediumMargin",
			header : new sap.f.cards.header({
				title : "Buy bus ticket on-line",
				subtitle : "Buy a single drive ticket for a date",
				iconSrc : "sap-icon://bus-public-transport"
			}) ,
			content : sap.m.VBox({
				height : "115px",
				class : "sapUiSmallMargin",
				justifyContent : "SpaceBetween",
				items : new sap.m.HBox({
					justifyContent : "SpaceBetween",
					items : oComboBox
				})
			})
		});
		

//		<f:content>
//			<VBox
//				height="115px"
//				class="sapUiSmallMargin"
//				justifyContent="SpaceBetween">
//				<HBox justifyContent="SpaceBetween">
//					<ComboBox
//						width="120px"
//						placeholder="From City"
//						items="{
//							path: '/cities',
//							sorter: { path: 'text' }
//						}">
//						<core:Item key="{key}" text="{text}" />
//					</ComboBox>
//					<ComboBox
//						width="120px"
//						placeholder="To City"
//						items="{
//							path: '/cities',
//							sorter: { path: 'text' }
//						}">
//						<core:Item key="{key}" text="{text}" />
//					</ComboBox>
//				</HBox>
//				<HBox justifyContent="SpaceBetween">
//					<DatePicker width="186px" placeholder="Choose Date ..."/>
//					<Button text="Book" press="onBookPress" type="Emphasized" />
//				</HBox>
//			</VBox>
//		</f:content>
//	</f:Card>
	
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height : 11px;'/>"}),
				vCard1 ]
		});
		
//		if (!jQuery.support.touch) {
			oLayout.addStyleClass("sapUiSizeCompact");
//		};

		return oLayout;

	
	}
});