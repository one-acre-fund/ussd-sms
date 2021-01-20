var getAudioLink = require('./getAudioLink');

/**
 * Checks the number of times an invalid input has been entered and terminates the call if it exceeds the max
 * @param {number} attempts number of times an invalid input has been entered
 * @param {number} max maximum number of times an invalid input is allowed
 * @param {string} lang language to play error message in if the number of times exceed two
 */
function checkInvalidInputAttempts(attempts, max, lang) {
    if (!attempts) {
        attempts = 1;
    } else {
        attempts += 1;
    }
    if (attempts > max) {
        global.playAudio(getAudioLink(lang, 'error'));
        global.hangUp();
    }
}

/**
 * Resets the number of invalid inputs. Used in cases where a valid input is finally entered after an invalid one
 * @param {number} attempts number of times an invalid input has been entered
 */
function clearInvalidInputAttempts(attempts) {
    if (attempts) {
        attempts = 0;
    }
}


module.exports = {
    check: checkInvalidInputAttempts,
    clear: clearInvalidInputAttempts
};