function sendRequest(baseURL, path,msg,options) {
    var data = {message: msg};
    if(options){
        var isAnArray = _.isArray(options.tags);
        var containsOnlyStrings = _.every(options.tags, _.isString);
        var tagsExist = !!options.tags;
        if(tagsExist && isAnArray && containsOnlyStrings){
            data.tags = options.tags;
        }else if(tagsExist && (!isAnArray || !containsOnlyStrings ) ){
            throw 'tags should be an array of strings';
        }
        data.data = options.data;
    }
    httpClient.request(baseURL + path, {method: 'POST', data: data});
}
var Log = function (logsBaseURL){
    var baseURL = logsBaseURL || project.vars.elk_logs_base_url;
    if(!baseURL) throw 'Required base URL not provided';
    this.baseURL = baseURL;
};

/**
 * 
 * @param {string} msg a log message
 * @param {Object} options Object containing details of the log request
 * @param {string[]} options.tags Array of tags for the log entry
 * @param {Object} options.data Miscellaneous data 
 */
Log.prototype.log = function(msg, options){
    if (!msg)
        throw 'Error: log called without message';
    var logPath = '/telerivet-logs';
    sendRequest(this.baseURL, logPath,msg,options);
};

/**
 * 
 * @param {string} msg a warning message
 * @param {Object} options Object containing details of the log request
 * @param {string[]} options.tags Array of tags for the log entry
 * @param {Object} options.data Miscellaneous data 
 */
Log.prototype.warn= function(msg,options){
    if (!msg)
        throw 'Error: "logger.warn" called without message';
    var logPath = '/telerivet-warn';
    sendRequest(this.baseURL, logPath,msg,options);
};

/**
 * 
 * @param {string} msg an Error message
 * @param {Object} options Object containing details of the log request
 * @param {string[]} options.tags Array of tags for the log entry
 * @param {Object} options.data Miscellaneous data 
 */
Log.prototype.error= function(msg,options){
    if (!msg)
        throw 'Error: "logger.error" called without message';
    var logPath = '/telerivet-error';
    sendRequest(this.baseURL, logPath,msg,options);
};



module.exports = Log;

