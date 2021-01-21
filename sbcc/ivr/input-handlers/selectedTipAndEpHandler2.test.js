const selectedTipAndEpHandler2 = require('./selectedTipAndEpHandler2');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Selected tip and episode handler for IVR second flow', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });

    beforeEach(() => {
        state.vars.invalidInputAttempts = undefined;
    });

    it('repeats the played episode when O is pressed', () => {
        state.vars.played = 'episode-1';
        selectedTipAndEpHandler2('0');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610460128/48164c80b758/EP1-ENG1.mp3');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('repeats the played top tip when 0 is pressed', () => {
        state.vars.played = 'top-tip-1';
        selectedTipAndEpHandler2('0');
        expect(playAudio).toHaveBeenNthCalledWith(1, 'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611044220/767f32f67a6f/tip_1.mp3');
        expect(playAudio).toHaveBeenLastCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610997646/decba8881698/selected_tip_menu.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the menu for more top tips if a top tip has been played and 1 is pressed', () => {
        state.vars.played = 'top-tip-1';
        selectedTipAndEpHandler2('1');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610994665/3ae228b3c831/top_tips_menu_1.mp3');
        expect(promptKey).toHaveBeenCalledWith('topTipsMenu1');
    });

    it('plays the menu for more episodes if an episode has been played and 1 is pressed', () => {
        state.vars.played = 'episode-1';
        selectedTipAndEpHandler2('1');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610989505/669df287a383/older_episodes_menu_1.mp3');
        expect(promptKey).toHaveBeenCalledWith('olderEpisodesMenu1');
    });

    it('returns to the main menu when * is pressed', () => {
        selectedTipAndEpHandler2('*');
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610986192/7bc845fb7f25/2nd_flow_main_menu_full.mp3');
        expect(promptKey).toHaveBeenCalledWith('2ndFlowMenuChoice');
    });

    it('plays invalid option message if an invalid key is pressed', () => {
        selectedTipAndEpHandler2('9');
        expect(state.vars.invalidInputAttempts).toEqual(1);
        expect(playAudio).toHaveBeenCalledWith('https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611058272/657148b4fe41/invalid_option_2.mp3');
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('hangs up if an invalid key is pressed 3 times in a row', () => {
        selectedTipAndEpHandler2('9');
        selectedTipAndEpHandler2('8');
        selectedTipAndEpHandler2('7');
        expect(state.vars.invalidInputAttempts).toEqual(3);
        expect(hangUp).toHaveBeenCalled();
    });

    it('does not hang up if a valid key is pressed after an invalid option was selected', () => {
        selectedTipAndEpHandler2('9');
        selectedTipAndEpHandler2('7');
        selectedTipAndEpHandler2('0');
        expect(state.vars.invalidInputAttempts).toEqual(0);
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('should call notifyELK',() => {
        selectedTipAndEpHandler2('0');
        expect(notifyELK).toHaveBeenCalled();
    });
});