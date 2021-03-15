var bundleInputHandler = require('./bundleInputsHandler');
var bundlesHandler = require('./bundlesHandler');
var finalizeHandler = require('./finalizeHandler');
var onChangeOrderHandler = require('./onChangeOrderHandler');
var orderOrFinalizeHandler = require('./orderOrFinalizeHandler');
var quantityHandler = require('./quantityHandler');

// import utils
var onBundleSelected = require('../utils/onBundleSelected');
var onRemoveProductSelected = require('../utils/onRemoveProductSelected');
var onOrderOrFinaliseSelected = require('../utils/onOrderOrFinaliseSelected');
var onQuantitySelected = require('../utils/onQuantitySelected');

module.exports = function registerBUEnrollmentInputHandlers(lang) {
    global.addInputHandler(bundleInputHandler.handlerName, bundleInputHandler.getHandler(lang, onBundleSelected));
    global.addInputHandler(bundlesHandler.handlerName, bundlesHandler.getHandler(lang, onBundleSelected));
    global.addInputHandler(finalizeHandler.handlerName, finalizeHandler.getHandler(lang));
    global.addInputHandler(onChangeOrderHandler.handlerName, onChangeOrderHandler.getHandler(lang, onRemoveProductSelected));
    global.addInputHandler(orderOrFinalizeHandler.handlerName, orderOrFinalizeHandler.getHandler(lang, onOrderOrFinaliseSelected));
    global.addInputHandler(quantityHandler.handlerName, quantityHandler.getHandler(lang, onQuantitySelected));
};
