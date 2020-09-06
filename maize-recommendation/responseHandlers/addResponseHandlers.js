var districtHandler = require('./districtResponseHandler');
var acresHandler = require('./acresResponseHandler');
var maizeHandler = require('./maizeResponseHandler');
var seasonHandler = require('./seasonHandler');

module.exports = function(lang, maize_recommendation_table) {
    addResponseHandler(districtHandler.handlerName, districtHandler.getHandler(lang, maize_recommendation_table));
    addResponseHandler(acresHandler.handlerName, acresHandler.getHandler(lang));
    addResponseHandler(maizeHandler.handlerName, maizeHandler.getHandler(lang, maize_recommendation_table));
    addResponseHandler(seasonHandler.handlerName, seasonHandler.getHandler(lang, maize_recommendation_table));
};
