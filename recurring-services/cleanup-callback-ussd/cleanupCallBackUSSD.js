global.main = function () {
    console.log('starting cleanup of CallBackUSSD table');
    var maxDate = moment().subtract(2, 'days').format('X');

    var cursorFunc = function () {
        return project.initDataTableById(service.vars.tableId).queryRows({
            time_created: {
                max: maxDate
            }
        });
    };
    var count = 0;
    while (cursorFunc().hasNext()) {
        var cursor = cursorFunc();
        cursor.limit(service.vars.limit);
        while (cursor.hasNext()) {
            cursor.next().delete();
            count++;
        }
    }
    console.log('finished cleanup of ' + count + ' records from CallBackUSSD table');
};
