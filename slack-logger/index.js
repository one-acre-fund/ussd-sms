var slack = {
    log: function (message) {
        var url = 'https://hooks.slack.com/services' + project.vars.slack_log_key;
        httpClient.request(
            url,
            {
                method: 'POST',
                data: { text: message }
            }
        );

    }
};
module.exports = slack;