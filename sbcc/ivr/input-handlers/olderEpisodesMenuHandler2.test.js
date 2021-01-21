const olderEpisodesMenuHandler2 = require('./olderEpisodesMenuHandler2');
const notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Older episodes second menu handler', () => {
    beforeAll(() => {
        global.state = { vars: { lang: 'en' } };
    });

    beforeEach(() => {
        state.vars.invalidInputAttempts = null;
    });

    it('plays episode 6 when 1 is pressed', () => {
        olderEpisodesMenuHandler2('1');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611041281/3d7e4c3c2953/ep6.mp3'
        );
        expect(state.vars.played).toEqual('episode-6');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 5 when 2 is pressed', () => {
        olderEpisodesMenuHandler2('2');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611041101/60401d859dad/ep5.mp3'
        );
        expect(state.vars.played).toEqual('episode-5');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 4 when 3 is pressed', () => {
        olderEpisodesMenuHandler2('3');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611040960/e5c65b041920/ep4.mp3'
        );
        expect(state.vars.played).toEqual('episode-4');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 3 when 4 is pressed', () => {
        olderEpisodesMenuHandler2('4');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611040739/11a8f2094977/ep3.mp3'
        );
        expect(state.vars.played).toEqual('episode-3');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 2 when 5 pressed', () => {
        olderEpisodesMenuHandler2('5');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611040432/38899f5a59d0/ep2.mp3'
        );
        expect(state.vars.played).toEqual('episode-2');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('plays episode 1 when 6 pressed', () => {
        olderEpisodesMenuHandler2('6');
        expect(playAudio).toHaveBeenNthCalledWith(
            1,
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610460128/48164c80b758/EP1-ENG1.mp3'
        );
        expect(state.vars.played).toEqual('episode-1');
        expect(playAudio).toHaveBeenLastCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610993063/fe8e7c6c9274/selected-episode-menu.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('selectedTipOrEpisode2');
    });

    it('repeats the main menu when 0 is pressed', () => {
        olderEpisodesMenuHandler2('0');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610991593/b80c836b9ad6/older_episodes_menu_2.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('olderEpisodesMenu2');
    });

    it('goes back to main menu when * is pressed', () => {
        olderEpisodesMenuHandler2('*');
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610986192/7bc845fb7f25/2nd_flow_main_menu_full.mp3'
        );
        expect(promptKey).toHaveBeenCalledWith('2ndFlowMenuChoice');
    });

    it('plays invalid option message if an invalid key is pressed', () => {
        olderEpisodesMenuHandler2('9');
        expect(state.vars.invalidInputAttempts).toEqual(1);
        expect(playAudio).toHaveBeenCalledWith(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1610454402/41492056b35e/14.wav'
        );
        expect(promptKey).toHaveBeenCalledWith('olderEpisodesMenu2');
    });

    it('hangs up if an invalid key is pressed 3 times in a row', () => {
        olderEpisodesMenuHandler2('9');
        olderEpisodesMenuHandler2('8');
        olderEpisodesMenuHandler2('7');
        expect(hangUp).toHaveBeenCalled();
    });

    it('does not hang up if a valid key is pressed after an invalid option was selected', () => {
        olderEpisodesMenuHandler2('9');
        olderEpisodesMenuHandler2('7');
        olderEpisodesMenuHandler2('0');
        expect(state.vars.invalidInputAttempts).toEqual(0);
        expect(hangUp).not.toHaveBeenCalled();
    });

    it('should call notifyELK', () => {
        olderEpisodesMenuHandler2('1');
        expect(notifyELK).toHaveBeenCalled();
    });
});
