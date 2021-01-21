var getAudioLink = require('./getAudioLink');

/**
 * Checks the number of times an invalid input has been entered and terminates the call if it exceeds the max
 * @param {number} max maximum number of times an invalid input is allowed
 * @param {string} lang language to play error message in if the number of times exceed two
 */
function checkInvalidInputAttempts(max, lang) {
    if (!state.vars.invalidInputAttempts) {
        state.vars.invalidInputAttempts = 1;
    } else {
        state.vars.invalidInputAttempts += 1;
    }
    if (state.vars.invalidInputAttempts > max) {
        global.playAudio(getAudioLink(lang, 'error'));
        global.hangUp();
    }
}

/**
 * Resets the number of invalid inputs. Used in cases where a valid input is finally entered after an invalid one
 */
function clearInvalidInputAttempts() {
    if (state.vars.invalidInputAttempts) {
        state.vars.invalidInputAttempts = 0;
    }
}


module.exports = {
    check: checkInvalidInputAttempts,
    clear: clearInvalidInputAttempts
};