const addPlayedItem = require('./addPlayedItem');

describe('Add Played Item', () => {
    beforeEach(() => {
        call.vars = {};
    });

    it('intializes the call var if no value exists', () => {
        addPlayedItem('episode-1');
        expect(call.vars.all_items_played).toEqual('episode-1');
    });

    it('appends the new item if value exists', () => {
        call.vars.all_items_played = 'top-tip-1';
        addPlayedItem('episode-12');
        expect(call.vars.all_items_played).toEqual('top-tip-1, episode-12');
    });
});