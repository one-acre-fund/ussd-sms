var addResponseHandlers = require('./addResponseHandlers');

var districtResponseHandler = require('./districtResponseHandler');
var acresResponseHandler = require('./acresResponseHandler');
var maizeResponseHandler = require('./maizeResponseHandler');
var seasonResponseHandler = require('./seasonHandler');

describe('registering response handlers', () => {
    var lang = 'en-ke';
    var maize_recommendation_table = 'maize_recommendation_table';

    
    it('should match all response handlers to their response handler names', () => {
        var districtHandler = jest.fn();
        var acresHandler = jest.fn();
        var maizeHandler = jest.fn();
        var seasonHandler = jest.fn();

        jest.spyOn(districtResponseHandler, 'getHandler').mockReturnValueOnce(districtHandler);
        jest.spyOn(acresResponseHandler, 'getHandler').mockReturnValueOnce(acresHandler);
        jest.spyOn(maizeResponseHandler, 'getHandler').mockReturnValueOnce(maizeHandler);
        jest.spyOn(seasonResponseHandler, 'getHandler').mockReturnValueOnce(seasonHandler);
        addResponseHandlers(lang, maize_recommendation_table);

        expect(addResponseHandler).toHaveBeenCalledWith(districtResponseHandler.handlerName, districtHandler);
        expect(addResponseHandler).toHaveBeenCalledWith(acresResponseHandler.handlerName, acresHandler);
        expect(addResponseHandler).toHaveBeenCalledWith(maizeResponseHandler.handlerName, maizeHandler);
        expect(addResponseHandler).toHaveBeenCalledWith(seasonResponseHandler.handlerName, seasonHandler);
    });
});