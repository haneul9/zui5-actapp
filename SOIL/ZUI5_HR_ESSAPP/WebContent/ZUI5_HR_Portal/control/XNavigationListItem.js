// Provides control ZUI5_HR_Portal.control.XNavigationListItem.
sap.ui.define(["jquery.sap.global", "sap/ui/core/Item",
		'sap/ui/core/Icon', 'sap/tnt/NavigationList', 'sap/ui/core/Renderer', 'sap/ui/core/IconPool', 'sap/tnt/NavigationListItem',
		"sap/m/MessageToast", 'sap/m/RatingIndicator'
	],
	function(jQuery, Item, Icon, NavigationList, Renderer, IconPool, NavigationListItem, MessageToast, RatingIndicator) {
		"use strict";

		var XNavigationListItem = NavigationListItem.extend("ZUI5_HR_Portal.control.XNavigationListItem", /** @lends sap.tnt.NavigationListItem.prototype */ {
			metadata: {
				library: "sap.tnt",
				properties: {
					/**
					 * Specifies the icon for the item.
					 */
					icon: {type: "sap.ui.core.URI", group: "Misc", defaultValue: ''},
					/**
					 * Specifies if the item is expanded.
					 */
					expanded: {type: "boolean", group: "Misc", defaultValue: true},

					/**
					 * Specifies if the item has an expander.
					 */
					hasExpander : {type : "boolean", group : "Misc", defaultValue : true},

					/**
					 * Specifies if the item should be shown.
					 *
					 * @since 1.52
					 */
					visible : {type : "boolean", group : "Appearance", defaultValue : true},
					
					favoriteyn :  {type : "float", group : "Misc", defaultValue : 0},
				},
				defaultAggregation: "xitems",
				aggregations: {
					xitems: {
						type: "ZUI5_HR_Portal.control.XNavigationListItem",
						multiple: true,
						singularName: "item"
					}
				}
			},
			
			/**
			 * Gets the tree level of this item.
			 * @private
			 */
			getLevel: function() {
				var level = 0;
				var parent = this.getParent();
				/* Added while loop instead of if - Musa Arda */
				while (parent && parent.getMetadata().getName() == 'ZUI5_HR_Portal.control.XNavigationListItem') {
					level = level + 1;
					parent = parent.getParent();
				}
				return level;
			},
			
			/**
			 * Renders the item.
			 * @private
			 */
			render: function(rm, control, index, length) {
				rm.write('<li');
				rm.writeElementData(this);
				
				
				/* Call only renderFirstLevelNavItem for all levels - Musa Arda */
				this.renderFirstLevelNavItem(rm, control, index, length);
				
				/*
				if (this.getLevel() == 0) {
					this.renderFirstLevelNavItem(rm, control, index, length);
				} else {
					this.renderSecondLevelNavItem(rm, control, index, length);
				}
				*/
			},
			
			renderFirstLevelNavItem: function(rm, control, index, length) {
				var item,
					items = this.getItems(),
					childrenLength = items.length,
					expanded = this.getExpanded(),
					isListExpanded = control.getExpanded(),
					text = this.getText();
				
//				rm.renderControl(RatingIndicator);
				rm.write('<li');
				rm.writeElementData(this);
				if (this.getEnabled() && !isListExpanded) {
					rm.write(' tabindex="-1"');
				}
				// ARIA
				var ariaProps = {
					level: '1',
					expanded: this.getExpanded(),
					posinset: index + 1,
					setsize: length
				};
				if (!isListExpanded) {
					var sTooltip = this.getTooltip_AsString() || text;
					if (sTooltip) {
						rm.writeAttributeEscaped("title", sTooltip);
					}
					ariaProps.label = text;
					ariaProps.role = 'button';
					ariaProps.haspopup = true;
				} else {
					ariaProps.role = 'treeitem';
				}
				rm.writeAccessibilityState(ariaProps);
				rm.writeAttribute("tabindex", "0");
				rm.write(">");
				this.renderGroupItem(rm, control);
				
				// If has sub items - Musa Arda -> items.length
				if (isListExpanded && items.length > 0) {
					rm.write("<ul");
					rm.writeAttribute("role", "group");
					rm.addClass("sapTntNavLIGroupItems");
					if (!expanded) {
						rm.addClass("sapTntNavLIHiddenGroupItems");
					}
					rm.writeClasses();
					rm.write(">");
					for (var i = 0; i < items.length; i++) {
						item = items[i];
						item.render(rm, control, i, childrenLength);
					}
					rm.write("</ul>");
				}
				rm.write("</li>");
			},
			/**
			 * Renders the first-level navigation item. - Standard
			 * Renders all levels - Musa Arda
			 * @private
			 */
			/*renderFirstLevelNavItem: function(rm, control, index, length) {
				var item,
					items = this.getItems(),
					childrenLength = items.length,
					expanded = this.getExpanded(),
					isListExpanded = control.getExpanded(),
					text = this.getText();
				rm.write('<li');
				rm.writeElementData(this);
				if (this.getEnabled() && !isListExpanded) {
					rm.write(' tabindex="-1"');
				}
				// ARIA
				var ariaProps = {
					level: '1',
					expanded: this.getExpanded(),
					posinset: index + 1,
					setsize: length
				};
				if (!isListExpanded) {
					var sTooltip = this.getTooltip_AsString() || text;
					if (sTooltip) {
						rm.writeAttributeEscaped("title", sTooltip);
					}
					ariaProps.label = text;
					ariaProps.role = 'button';
					ariaProps.haspopup = true;
				} else {
					ariaProps.role = 'treeitem';
				}
				rm.writeAccessibilityState(ariaProps);
				rm.writeAttribute("tabindex", "0");
				rm.write(">");
				this.renderGroupItem(rm, control);
				
				// If has sub items - Musa Arda -> items.length
				if (isListExpanded && items.length > 0) {
					rm.write("<ul");
					rm.writeAttribute("role", "group");
					rm.addClass("sapTntNavLIGroupItems");
					if (!expanded) {
						rm.addClass("sapTntNavLIHiddenGroupItems");
					}
					rm.writeClasses();
					rm.write(">");
					for (var i = 0; i < items.length; i++) {
						item = items[i];
						item.render(rm, control, i, childrenLength);
					}
					rm.write("</ul>");
				}
				rm.write("</li>");
			},
			*/
			/**
			 * Selects this item.
			 * @private
			 */
			_select: function() {
				var $this = this.$(),
					navList = this.getNavigationList();
				if (!navList) {
					return;
				}
				
				// Removed - Musa Arda
				//$this.addClass('sapTntNavLIItemSelected');
				
				// Check subItems to add 'sapTntNavLIItemSelected' - Musa Arda
				var subItems = this.getItems();
				if (!(subItems.length > 0)) {
					$this.addClass('sapTntNavLIItemSelected');
				}
				if (navList.getExpanded()) {
					if (this.getLevel() == 0) {
						$this = $this.find('.sapTntNavLIGroup');
					}
					$this.attr('aria-selected', true);
				} else {
					$this.attr('aria-pressed', true);
					navList._closePopover();
				}
			},
			
			/**
			 * Expands the child items (works only on first-level items).
			 */
			expand: function(duration) {
				if (this.getExpanded() || !this.getHasExpander() ||
					this.getItems().length == 0) {
					return;
				}
				this.setProperty('expanded', true, true);
				this.$().attr('aria-expanded', true);
				var expandIconControl = this._getExpandIconControl();
				expandIconControl.setSrc(NavigationListItem.collapseIcon);
				expandIconControl.setTooltip(this._getExpandIconTooltip(false));
			
				/* Replaced this with below code - Musa Arda
				var $container = this.$().find('.sapTntNavLIGroupItems');
				$container.stop(true, true).slideDown(duration || 'fast', function() {
					$container.toggleClass('sapTntNavLIHiddenGroupItems');
				});
				*/
				/* Check Sub Items - Musa Arda */
				var $firstULContainer = this.$().children('ul').first();
				$firstULContainer.toggleClass("sapTntNavLIHiddenGroupItems");
			
				this.getNavigationList()._updateNavItems();
				return true;
			},
			
			/**
			 * Collapses the child items (works only on first-level items).
			 */
			collapse: function(duration) {
				if (!this.getExpanded() || !this.getHasExpander() ||
					this.getItems().length == 0) {
					return;
				}
				this.setProperty('expanded', false, true);
				this.$().attr('aria-expanded', false);
				var expandIconControl = this._getExpandIconControl();
				expandIconControl.setSrc(NavigationListItem.expandIcon);
				expandIconControl.setTooltip(this._getExpandIconTooltip(true));
			
				/* Replaced this with below code - Musa Arda
				var $container = this.$().find('.sapTntNavLIGroupItems');
				$container.stop(true, true).slideUp(duration || 'fast', function() {
					$container.toggleClass('sapTntNavLIHiddenGroupItems');
				});
				*/
				/* Check Sub Items - Musa Arda */
				var $firstULContainer = this.$().children('ul').first();
				$firstULContainer.toggleClass("sapTntNavLIHiddenGroupItems");
			
				this.getNavigationList()._updateNavItems();
				return true;
			},
			
			/**
			 * Handles tap event.
			 * @private
			 */
			ontap: function(event) {
				
				if (event.isMarked('subItem') || !this.getEnabled()) {
					return;
				}
			
				event.setMarked('subItem');
				event.preventDefault();
			
				var navList = this.getNavigationList();
				var source = sap.ui.getCore().byId(event.target.id);
				var level = this.getLevel();
			
				/* Removed - Musa Arda
				// second navigation level
				if (level == 1) {
					var parent = this.getParent();
					if (this.getEnabled() && parent.getEnabled()) {
						this._selectItem(event);
					}
					return;
				}
				*/
			
				// All navigation levels - Musa Arda
				if (navList.getExpanded() || this.getItems().length == 0) {
					if (!source || source.getMetadata().getName() != 'sap.ui.core.Icon' || !source.$().hasClass('sapTntNavLIExpandIcon')) {
						this._selectItem(event);
						if (this.getItems().length == 0) {
							MessageToast.show(this.getText());
						}
						return;
					}
					if (this.getExpanded()) {
						this.collapse();
					} else {
						this.expand();
					}
				} else {
					var list = this.createPopupList();
					navList._openPopover(this, list);
				}
			},
			
			/**
			 * Renders the group item.
			 * @private
			 */
		renderGroupItem: function(rm, control, index, length) {
		
			rm.write('<div');
			rm.addClass("sapTntNavLIItem");
			rm.addClass("sapTntNavLIGroup");
		
			if (!this.getEnabled()) {
				rm.addClass("sapTntNavLIItemDisabled");
			} else if (control.getExpanded()) {
				rm.write(' tabindex="-1"');
			}
		
			if (control.getExpanded()) {
				var text = this.getText();
				var sTooltip = this.getTooltip_AsString() || text;
				if (sTooltip) {
					rm.writeAttributeEscaped("title", sTooltip);
				}
				rm.writeAttributeEscaped("aria-label", text);
			}
		
			rm.writeClasses();
		
			// Indent - Musa Arda
			var indentValue = this.getLevel() * 0.75;
			rm.write("style='padding-left:" + indentValue + "rem'");
			
			rm.write(">");
		
//			this._renderIcon(rm);
			this.renderRatingIndicator(rm, control);
		
			if (control.getExpanded()) {
		
				var expandIconControl = this._getExpandIconControl();
				expandIconControl.setVisible(this.getItems().length > 0 && this.getHasExpander());
				expandIconControl.setSrc(this.getExpanded() ? NavigationListItem.collapseIcon : NavigationListItem.expandIcon);
				expandIconControl.setTooltip(this._getExpandIconTooltip(!this.getExpanded()));
		
				this._renderText(rm);
				rm.renderControl(expandIconControl);
			}
		
			rm.write("</div>");
		},
		
		renderRatingIndicator: function(rm, control) {
//			if (icon) {
				// Manually rendering the icon instead of using RenderManager's writeIcon. In this way title
				// attribute is not rendered and the tooltip of the icon does not override item's tooltip
				rm.write('<span');
//				rm.renderControl(control.setAggregation(new RatingIndicator({
////					value: this.getValue(),
//					iconSize: "2rem",
//					visualMode: "Half",
//					maxValue : 1
////					liveChange: this._onRate.bind(this)
//				})));
				
				rm.renderControl(new RatingIndicator({
//					value: this.getValue(),
					iconSize: "1rem",
					maxValue : 1,
	
//					liveChange: this._onRate.bind(this)
				}).addStyleClass("sapUiSizeCompact"));
				
				
				
//				rm.addClass("sapUiIcon");
//				rm.addClass("sapTntNavLIGroupIcon");
//
//				rm.writeAttribute("aria-hidden", true);
//
//				if (iconInfo && !iconInfo.suppressMirroring) {
//					rm.addClass("sapUiIconMirrorInRTL");
//				}
//
//				if (iconInfo) {
//					rm.writeAttribute("data-sap-ui-icon-content", iconInfo.content);
//					rm.addStyle("font-family", "'" + iconInfo.fontFamily + "'");
//				}

				rm.writeClasses();
				rm.writeStyles();

				rm.write("></span>");
		},
		
		

		
		});

		return XNavigationListItem;

	});