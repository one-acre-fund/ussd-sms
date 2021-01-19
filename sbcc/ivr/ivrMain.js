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

var lang = contact.vars.lang ? contact.vars.lang : 'sw';

var ivrFirstFlowStartDate = new Date('01/01/2021');
var ivrFirstFlowEndDate = new Date('06/13/2021');


// Start logic flow
global.main = function () {
    state.vars.lang = lang;
    // state.vars.currentDate will enable us set different dates on telerivet platform to carry out various tests
    var currentDate = state.vars.currentDate ? new Date(state.vars.currentDate) : new Date();
    console.log('logging episodes and tips');
    console.log(episodes);
    console.log(topTips);
    var latestAndPrevEpisodes = getLatestAndPreviousItems(episodes, currentDate);
    state.vars.latestEpisode = latestAndPrevEpisodes.latest;
    state.vars.previousEpisode = latestAndPrevEpisodes.previous;

    var latestAndPrevTips = getLatestAndPreviousItems(topTips, currentDate);
    state.vars.latestTip = latestAndPrevTips.latest;
    state.vars.previousTip = latestAndPrevTips.previous;

    var mainMenuAndHandler = getMainMenuAndHandler(currentDate, ivrFirstFlowStartDate, ivrFirstFlowEndDate, latestAndPrevEpisodes, latestAndPrevTips);
    state.vars.mainMenu = mainMenuAndHandler.menu;
    state.vars.mainMenuHandler = mainMenuAndHandler.handler;

    console.log('inside global.main');
    playAudio(getAudioLink(lang, 'welcome-message'));
    if (!mainMenuAndHandler.menu) throw Error('No episode or top tip has been released for the current date - ' + currentDate.toDateString());
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

function getMainMenuAndHandler(currentDate, startDate, endDate, latestAndPrevEpisodes, latestAndPrevTips) {
    console.log('inside getMainMenuAndHandler');
    currentDate.setHours(0,0,0,0);
    var currentDateTime = currentDate.getTime();
    var output = {};

    console.log(JSON.stringify(latestAndPrevTips));
    console.log(JSON.stringify(latestAndPrevEpisodes));

    if (currentDateTime >= startDate.getTime() && currentDateTime <= endDate.getTime()) {
        console.log('currentDateTime >= startDate.getTime() && currentDateTime <= endDate');
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
        console.log(JSON.stringify(output));

    } else if (currentDateTime > endDate.getTime()) {
        console.log('current date > end date');
        output.menu = '2nd-flow-full-menu';
        output.handler = '2ndFlowMenuChoice';
        console.log(JSON.stringify(output));

    } else {
        throw new Error('IVR nutrition program not yet started');
    }

    return output;

}