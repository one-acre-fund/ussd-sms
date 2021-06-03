const mainMenuTwoHandler = require('./mainMenuTwoHandler');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Main menu two handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });

    beforeEach(() => {
        state.vars.invalidInputAttempts = null;
        call.vars = {};
    });

    it('plays the latest episode when 1 is pressed', () => {
        state.vars.latestEpisode = 'episode-4';
        mainMenuTwoHandler('1');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611040984/8d68177a060f/ep4_intro_recap.mp3'
        );
        expect(state.vars.played).toEqual('episode-4');
        expect(call.vars.mainMenuTwoPlayed_1).toEqual('episode-4');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610463660/eaab86509562/episode_menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode1');
    });

    it('plays the menu with previous episodes 7-11 when 2 is pressed', () => {
        mainMenuTwoHandler('2');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610989505/669df287a383/older_episodes_menu_1.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('olderEpisodesMenu1');
    });

    it('plays the menu with top tips 5-8 when 3 is pressed', () => {
        mainMenuTwoHandler('3');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610994665/3ae228b3c831/top_tips_menu_1.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('topTipsMenu1');
    });

    it('repeats the main menu when 0 is pressed', () => {
        mainMenuTwoHandler('0');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610986192/7bc845fb7f25/2nd_flow_main_menu_full.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('2ndFlowMenuChoice');
    });

    it('plays invalid option message if an invalid key is pressed', () => {
        mainMenuTwoHandler('9');
        expect(state.vars.invalidInputAttempts).toEqual(1);
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610454402/41492056b35e/14.wav'
        );
        expect(promptKey).toHaveBeenCalledWith('2ndFlowMenuChoice');
    });

    it('hangs up if an invalid key is pressed 3 times in a row', () => {
        mainMenuTwoHandler('5');
        mainMenuTwoHandler('7');
        mainMenuTwoHandler('6');
        expect(call.vars.mainMenuTwoHandlerCount).toEqual(3);
        expect(hangUp).toHaveBeenCalled();
    });

    it('does not hang up if a valid key is pressed after an invalid option was selected', () => {
        mainMenuTwoHandler('6');
        mainMenuTwoHandler('7');
        mainMenuTwoHandler('0');
        expect(state.vars.invalidInputAttempts).toEqual(0);
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('should call notifyELK', () => {
        mainMenuTwoHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
});
