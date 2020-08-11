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
var Log = function (baseURL){
    if(!baseURL) throw 'Required base URL not provided';
    
    this.log= function(msg, options){
        if (!msg)
            throw 'Error: log called without message';
        var logPath = '/telerivet-logs';
        sendRequest(baseURL, logPath,msg,options);
    };
    this.warn= function(msg,options){
        if (!msg)
            throw 'Error: "logger.warn" called without message';
        var logPath = '/telerivet-warn';
        sendRequest(baseURL, logPath,msg,options);
    };
    this.error= function(msg,options){
        if (!msg)
            throw 'Error: "logger.error" called without message';
        var logPath = '/telerivet-error';
        sendRequest(baseURL, logPath,msg,options);
    };
};

module.exports = Log;

