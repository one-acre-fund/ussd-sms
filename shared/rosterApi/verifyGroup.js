var Log = require("../../logger/elk/elk-logger");

/**
 *
 * @param {number} districtId the client's district ID
 * @param {number} siteId the client's site ID
 * @param {number} groupId the client's group ID
 * @returns {object} an object containing the group name and active status
 */
module.exports = function verifyGroup(districtId, siteId, groupId) {
	var logger = new Log();
	var fullUrl =
		service.vars.server_name +
		"/Api/GroupSummary/VerifyGroup?districtId=" +
		districtId +
		"&siteId=" +
		siteId +
		"&groupId=" +
		groupId;

	var opts = { headers: {} };
	opts.headers["Authorization"] = "ApiKey " + service.vars.roster_read_key;
	opts.headers["Content-Type"] = "application/json";
	opts.method = "GET";
	try {
		var response = httpClient.request(fullUrl, opts);
		if (response.status === 200) {
			var data = JSON.parse(response.content);
			return data;
		} else {
			console.log("Error while verifying group");
			console.log(JSON.stringify(response));
			logger.error("Error while verifying group", {
				data: JSON.stringify(response),
			});
		}
	} catch (error) {
		logger.error("API Error while verifying group", {
			data: JSON.stringify(error),
		});
	}
};
