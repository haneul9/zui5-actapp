
// ---- sap.ui.rta.util.ServiceEventBus --------------------------------------------------------------------------

/**
 * Creates an instance of ServiceEventBus.
 * 
 * 
 * @class Provides eventing capabilities based on sap.ui.core.EventBus with some redefined signature to listeners signature.
 * 
 * @extends sap.ui.core.EventBus
 * @version 1.56.0
 * @public
 * @since 1.56.0
 * 
 */
sap.ui.rta.util.ServiceEventBus = function() {};
/**
 * Creates a new subclass of class sap.ui.rta.util.ServiceEventBus with name <code>sClassName</code>
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of information as described in {@link sap.ui.core.EventBus.extend}.
 * 
 * @param {string} sClassName Name of the class being created
 * @param {object} [oClassInfo] Object literal with information about the class
 * @param {function} [FNMetaImpl] Constructor function for the metadata object; if not given, it defaults to <code>sap.ui.core.ElementMetadata</code>
 * @returns {function} Created class / constructor function
 * @public
 * @static
 * 
 */
sap.ui.rta.util.ServiceEventBus.extend = function(sClassName,oClassInfo,FNMetaImpl) { return function() {}; };

/**
 * Returns a metadata object for class sap.ui.rta.util.ServiceEventBus.
 * 
 * @returns {sap.ui.base.Metadata} Metadata object describing this class
 * @public
 * @static
 * 
 */
sap.ui.rta.util.ServiceEventBus.getMetadata = function() { return new sap.ui.base.Metadata(); };

// ---- static fields of namespaces ---------------------------------------------------------------------
