/**
 * Uses binary search to retrieve the latest and previous items based on their dates. The latest item is the item whose releaseDate property is same as the current date or in the past, and the release dates of other items in the array are in the future.
 * @param {Array} items Contains the items sorted based on the releaseDate property in ascending order. Example of an item = { name: 'item1', releaseDate: '01-25-2020' }
 * @param {Date} currentDate the current date
 * @returns {Object} an object containing latest and previous items
 */
module.exports = function (items, currentDate) {
    if (!Array.isArray(items)) throw new TypeError('items must be an array');
    if (!(currentDate instanceof Date) || isNaN(currentDate.getTime()))
        throw new TypeError('currentDate is not a valid date');

    currentDate.setHours(0, 0, 0, 0);
    var currentDateTime = currentDate.getTime();
    var result = {};
    var index;
    var start = 0;
    var end = items.length - 1;

    while (start <= end) {
        var mid = Math.floor((start + end) / 2);
        var currentItemDate = new Date(items[mid].releaseDate);
        currentItemDate.setHours(0, 0, 0, 0);
        var currentItemDateTime = currentItemDate.getTime();

        // Since the items are sorted in ascending order based on their release dates, break out of the loop if current date is in the past of the first item in the array
        if (mid === 0 && currentDateTime < currentItemDateTime) break;

        if (currentDateTime >= currentItemDateTime && mid < items.length - 1) {
            var nextItemDate = new Date(items[mid + 1].releaseDate);
            nextItemDate.setHours(0, 0, 0, 0);
            if (currentDateTime < nextItemDate.getTime()) {
                result.latest = items[mid].name;
                index = mid;
                break;
            }
        }

        // If we get to the last item in the array, set it as the latest
        if (
            mid === items.length - 1 &&
            currentDateTime >= currentItemDateTime
        ) {
            result.latest = items[mid].name;
            index = mid;
            break;
        }

        if (currentDateTime > currentItemDateTime) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    if (index && index > 0) {
        result.previous = items[index - 1].name;
    }
    return result;
};
