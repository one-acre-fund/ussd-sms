var batch1ResponseHandler = require('./batch1ResponseHandler');
var batch2ResponseHandler = require('./batch2ResponseHandler');
var batch3ResponseHandler = require('./batch3ResponseHandler');
var batch4ResponseHandler = require('./batch4ResponseHandler');
var batch5ResponseHandler = require('./batch5ResponseHandler');
var batch6ResponseHandler = require('./batch6ResponseHandler');
var batch7ResponseHandler = require('./batch7ResponseHandler');

module.exports = function(lang) {
    addResponseHandler(batch1ResponseHandler.handlerName, batch1ResponseHandler.getHandler(lang));
    addResponseHandler(batch2ResponseHandler.handlerName, batch2ResponseHandler.getHandler(lang));
    addResponseHandler(batch3ResponseHandler.handlerName, batch3ResponseHandler.getHandler(lang));
    addResponseHandler(batch4ResponseHandler.handlerName, batch4ResponseHandler.getHandler(lang));
    addResponseHandler(batch5ResponseHandler.handlerName, batch5ResponseHandler.getHandler(lang));
    addResponseHandler(batch6ResponseHandler.handlerName, batch6ResponseHandler.getHandler(lang));
    addResponseHandler(batch7ResponseHandler.handlerName, batch7ResponseHandler.getHandler(lang));
};
