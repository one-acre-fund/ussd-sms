/**
 * Returns Object properties from payload that matches the passed match pattern
 * @param {object} payload an object with the key-value pairs
 * @param {String} match a string pattern to find in object keys
 * @returns {Array} Array of filteredKeys from payload matching passed match
 */
function getObjectKeys(payload, match) {
    var allKeys = Object.keys(payload);
    var filteredKeys = allKeys.filter(function(key){
        return key.match(match);
    });
    return filteredKeys;
}

module.exports = getObjectKeys;
