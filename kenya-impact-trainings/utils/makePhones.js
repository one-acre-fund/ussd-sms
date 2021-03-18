/**
 * creates a list of possible phone numbers combinations
 * @param {String} phoneNumber phone number passed by the user
 * @returns a list of possible phone numbers
 */
module.exports = function makePhones(phoneNumber) {
    var possibleCombinations = [];
    var basePhone = '';
    if(phoneNumber.length == 10) {
        // phones
        basePhone = phoneNumber.slice(1, 10);
        possibleCombinations = (['0' + basePhone, basePhone, '254' + basePhone, '+254' + basePhone, '2540' + basePhone, '+2540' + basePhone]);
    } else if(phoneNumber.length == 9) {
        basePhone = phoneNumber;
        possibleCombinations = (['0' + basePhone, basePhone, '254' + basePhone, '+254' + basePhone, '2540' + basePhone, '+2540' + basePhone]);
    } else if(phoneNumber.length == 12) {
        basePhone = phoneNumber.slice(3, 12);
        possibleCombinations = (['0' + basePhone, basePhone, '254' + basePhone, '+254' + basePhone, '2540' + basePhone, '+2540' + basePhone]);
    } else if(phoneNumber.length == 13) {
        basePhone = phoneNumber.slice(4, 13);
        possibleCombinations = (['0' + basePhone, basePhone, '254' + basePhone, '+254' + basePhone, '2540' + basePhone, '+2540' + basePhone]);
    } else if(phoneNumber.length == 14) {
        basePhone = phoneNumber.slice(5, 14);
        possibleCombinations = (['0' + basePhone, basePhone, '254' + basePhone, '+254' + basePhone, '2540' + basePhone, '+2540' + basePhone]);
    } else {
        possibleCombinations = [];
    }
    return possibleCombinations;
};