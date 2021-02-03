const olderEpisodesMenuHandler1 = require('./olderEpisodesMenuHandler1');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Older episodes first menu handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });

    beforeEach(() => {
        state.vars.invalidInputAttempts = null;
    });

    it('plays episode 11 when 1 is pressed', () => {
        olderEpisodesMenuHandler1('1');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611041863/da34a453d92d/ep11_intro_recap.mp3'
        );
        expect(state.vars.played).toEqual('episode-11');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 10 when 2 is pressed', () => {
        olderEpisodesMenuHandler1('2');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611041802/1d416e2c9c2d/ep10_intro_recap.mp3'
        );
        expect(state.vars.played).toEqual('episode-10');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 9 when 3 is pressed', () => {
        olderEpisodesMenuHandler1('3');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611041739/39131e2f8572/ep9_intro_recap.mp3'
        );
        expect(state.vars.played).toEqual('episode-9');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 8 when 4 is pressed', () => {
        olderEpisodesMenuHandler1('4');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611041677/93482ff05342/ep8_intro_recap.mp3'
        );
        expect(state.vars.played).toEqual('episode-8');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 7 when 5 pressed', () => {
        olderEpisodesMenuHandler1('5');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611041555/6fe39fd371e3/ep7_intro_recap.mp3'
        );
        expect(state.vars.played).toEqual('episode-7');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays the menu with previous episodes 6-1 when 6 is pressed', () => {
        olderEpisodesMenuHandler1('6');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610991593/b80c836b9ad6/older_episodes_menu_2.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('olderEpisodesMenu2');
    });

    it('repeats the main menu when 0 is pressed', () => {
        olderEpisodesMenuHandler1('0');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610989505/669df287a383/older_episodes_menu_1.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('olderEpisodesMenu1');
    });

    it('goes back to main menu when * is pressed', () => {
        olderEpisodesMenuHandler1('*');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610986192/7bc845fb7f25/2nd_flow_main_menu_full.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('2ndFlowMenuChoice');
    });

    it('plays invalid option message if an invalid key is pressed', () => {
        olderEpisodesMenuHandler1('9');
        expect(state.vars.invalidInputAttempts).toEqual(1);
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610454402/41492056b35e/14.wav'
        );
        expect(promptKey).toHaveBeenCalledWith('olderEpisodesMenu1');
    });

    it('hangs up if an invalid key is pressed 3 times in a row', () => {
        olderEpisodesMenuHandler1('9');
        olderEpisodesMenuHandler1('8');
        olderEpisodesMenuHandler1('7');
        expect(hangUp).toHaveBeenCalled();
    });

    it('does not hang up if a valid key is pressed after an invalid option was selected', () => {
        olderEpisodesMenuHandler1('9');
        olderEpisodesMenuHandler1('7');
        olderEpisodesMenuHandler1('0');
        expect(state.vars.invalidInputAttempts).toEqual(0);
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('should call notifyELK', () => {
        olderEpisodesMenuHandler1('1');
        expect(notifyELK).toHaveBeenCalled();
    });
});
