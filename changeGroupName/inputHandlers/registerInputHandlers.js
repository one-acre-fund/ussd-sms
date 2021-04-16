var groupNameHandler = require('./groupNameHandler');

module.exports = function(lang) {
    global.addInputHandler(groupNameHandler.handlerName, groupNameHandler.getHandler(lang));
};