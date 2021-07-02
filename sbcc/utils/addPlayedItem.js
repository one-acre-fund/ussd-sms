module.exports = function(itemPlayed) {
    if (call.vars.all_items_played) {
        var newItem = ', ' + itemPlayed;
        call.vars.all_items_played += newItem;
    } else {
        call.vars.all_items_played = itemPlayed;
    }
};