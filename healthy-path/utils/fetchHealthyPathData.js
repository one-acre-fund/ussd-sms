var slack = require('../../slack-logger/index');

module.exports = function() {
    try {
        //TODO call roster and return the healthy path data
        // return '0.25' while we wait for the implementation on the backend;
        // httpClient.get();
        console.log('reaching healthy path draft function');
        return 0.2;
    } catch(error) {
        slack.log(error);
    }
};