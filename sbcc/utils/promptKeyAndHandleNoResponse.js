var getAudioLink = require('./getAudioLink');

module.exports = function(handler) {
    console.log('inside promptKeyAndHandleNoResponse function');
    global.promptKey(handler, {
        maxRepeats: 0
    });
    console.log(state.vars.responded);
    if(!state.vars.responded) {
        global.playAudio(getAudioLink(state.vars.lang, 'no-response'));
    }
};