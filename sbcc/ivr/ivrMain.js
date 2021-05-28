var getAudioLink = require('../utils/getAudioLink');
var getLatestAndPreviousItems = require('../utils/getLatestAndPreviousItems');
var episodes = require('../data/episodes');
var topTips = require('../data/tips');
var mainMenuOneHandler = require('./input-handlers/mainMenuOneHandler');
var mainMenuTwoHandler = require('./input-handlers/mainMenuTwoHandler');
var selectedTipAndEpHandler1 = require('./input-handlers/selectedTipAndEpHandler1');
var selectedTipAndEpHandler2 = require('./input-handlers/selectedTipAndEpHandler2');
var olderEpisodesMenuHandler1 = require('./input-handlers/olderEpisodesMenuHandler1');
var olderEpisodesMenuHandler2 = require('./input-handlers/olderEpisodesMenuHandler2');
var topTipsMenuHandler1 = require('./input-handlers/topTipsMenuHandler1');
var topTipsMenuHandler2 = require('./input-handlers/topTipsMenuHandler2');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

var lang = contact.vars.sbccLang ? contact.vars.sbccLang : 'sw';
var ivrFirstFlowStartDate = new Date('01/01/2021');
var ivrFirstFlowEndDate = new Date('06/13/2021');


// Start logic flow
global.main = function () {
    setTimeElapsedBetweenUssdAndIvr();
    state.vars.lang = lang;
    // state.vars.currentDate will enable us set different dates on telerivet platform to carry out various tests
    var currentDate = state.vars.currentDate ? new Date(state.vars.currentDate) : new Date();
    var latestAndPrevEpisodes = getLatestAndPreviousItems(episodes, currentDate);
    state.vars.latestEpisode = latestAndPrevEpisodes.latest;
    state.vars.previousEpisode = latestAndPrevEpisodes.previous;

    var latestAndPrevTips = getLatestAndPreviousItems(topTips, currentDate);
    state.vars.latestTip = latestAndPrevTips.latest;
    state.vars.previousTip = latestAndPrevTips.previous;

    var mainMenuAndHandler = getMainMenuAndHandler(currentDate, ivrFirstFlowStartDate, ivrFirstFlowEndDate, latestAndPrevEpisodes, latestAndPrevTips);
    state.vars.mainMenu = mainMenuAndHandler.menu;
    state.vars.mainMenuHandler = mainMenuAndHandler.handler;

    playAudio(getAudioLink(lang, 'welcome-message'));
    if (!mainMenuAndHandler.menu) {
        playAudio(getAudioLink(lang, 'error'));
        throw Error('No episode or top tip has been released for the current date - ' + currentDate.toDateString());
    }
    playAudio(getAudioLink(lang, mainMenuAndHandler.menu));
    promptKey(mainMenuAndHandler.handler);
};

addInputHandler('1stFlowMenuChoice', mainMenuOneHandler);
addInputHandler('2ndFlowMenuChoice', mainMenuTwoHandler);
addInputHandler('selectedTipOrEpisode1', selectedTipAndEpHandler1);
addInputHandler('selectedTipOrEpisode2', selectedTipAndEpHandler2);
addInputHandler('olderEpisodesMenu1', olderEpisodesMenuHandler1);
addInputHandler('olderEpisodesMenu2', olderEpisodesMenuHandler2);
addInputHandler('topTipsMenu1', topTipsMenuHandler1);
addInputHandler('topTipsMenu2', topTipsMenuHandler2);

addEventListener('call_complete', function() {
    notifyELK();
});

/**
 * Sets the elapsed time between when the USSD flow ended and when the IVR flow started
 */
function setTimeElapsedBetweenUssdAndIvr() {
    var timeAnswered = Date.now();
    call.vars.time_answered = new Date(timeAnswered).toString();
    // call.vars.time_from_ussd_to_ivr = Math.floor(
    //     (timeAnswered - new Date(contact.vars.sbcc_ussd_end_time).getTime()) / 1000);
}

/**
 * Gets the particular menu to play for the caller based on the dates and episode/tip currently available
 * @param {Date} currentDate the current date
 * @param {Date} startDate the date which the first flow of the IVR program starts
 * @param {Date} endDate the date which the first flow of the IVR program ends
 * @param {object} latestAndPrevEpisodes contains the latest and previous episodes at the moment
 * @param {object} latestAndPrevTips contains the latest and previous top tips at the moment
 * @returns {object} object containing the menu and its handler
 */
function getMainMenuAndHandler(currentDate, startDate, endDate, latestAndPrevEpisodes, latestAndPrevTips) {
    currentDate.setHours(0,0,0,0);
    var currentDateTime = currentDate.getTime();
    var output = {};

    if (currentDateTime >= startDate.getTime() && currentDateTime <= endDate.getTime()) {
        if (latestAndPrevEpisodes.latest && !latestAndPrevEpisodes.previous && !latestAndPrevTips.latest) {
            output.menu = 'menu-with-only-latest-ep';
        } else if (latestAndPrevEpisodes.previous && !latestAndPrevTips.latest) {
            output.menu = 'menu-with-only-latest-and-prev-ep';
        } else if (latestAndPrevEpisodes.previous && latestAndPrevTips.latest && !latestAndPrevTips.previous) {
            output.menu = 'menu-with-prev-latest-ep-and-tip';
        } else if (latestAndPrevEpisodes.previous && latestAndPrevTips.previous) {
            output.menu = '1st-flow-full-menu';   
        }
        output.handler = '1stFlowMenuChoice';

    } else if (currentDateTime > endDate.getTime()) {
        output.menu = '2nd-flow-full-menu';
        output.handler = '2ndFlowMenuChoice';

    }

    return output;
}
