var batch1ResponseHandler = require('./batch1ResponseHandler');
var batch2ResponseHandler = require('./batch2ResponseHandler');
var batch3ResponseHandler = require('./batch3ResponseHandler');
var batch4ResponseHandler = require('./batch4ResponseHandler');
var batch5ResponseHandler = require('./batch5ResponseHandler');
var batch6ResponseHandler = require('./batch6ResponseHandler');
var batch7ResponseHandler = require('./batch7ResponseHandler');
var addResponseHandlers = require('./addResponseHandlers');

describe('registering response handlers', () => {
    var lang = 'en-ke';
    it('should match all response handlers to their response handler names', () => {
        var batch1Handler = jest.fn();
        var batch2Handler = jest.fn();
        var batch3Handler = jest.fn();
        var batch4Handler = jest.fn();
        var batch5Handler = jest.fn();
        var batch6Handler = jest.fn();
        var batch7Handler = jest.fn();

        jest.spyOn(batch1ResponseHandler, 'getHandler').mockReturnValueOnce(batch1Handler);
        jest.spyOn(batch2ResponseHandler, 'getHandler').mockReturnValueOnce(batch2Handler);
        jest.spyOn(batch3ResponseHandler, 'getHandler').mockReturnValueOnce(batch3Handler);
        jest.spyOn(batch4ResponseHandler, 'getHandler').mockReturnValueOnce(batch4Handler);
        jest.spyOn(batch5ResponseHandler, 'getHandler').mockReturnValueOnce(batch5Handler);
        jest.spyOn(batch6ResponseHandler, 'getHandler').mockReturnValueOnce(batch6Handler);
        jest.spyOn(batch7ResponseHandler, 'getHandler').mockReturnValueOnce(batch7Handler);
        addResponseHandlers(lang);

        expect(addResponseHandler).toHaveBeenCalledWith(batch1ResponseHandler.handlerName, batch1Handler);
        expect(addResponseHandler).toHaveBeenCalledWith(batch2ResponseHandler.handlerName, batch2Handler);
        expect(addResponseHandler).toHaveBeenCalledWith(batch3ResponseHandler.handlerName, batch3Handler);
        expect(addResponseHandler).toHaveBeenCalledWith(batch4ResponseHandler.handlerName, batch4Handler);
        expect(addResponseHandler).toHaveBeenCalledWith(batch5ResponseHandler.handlerName, batch5Handler);
        expect(addResponseHandler).toHaveBeenCalledWith(batch6ResponseHandler.handlerName, batch6Handler);
        expect(addResponseHandler).toHaveBeenCalledWith(batch7ResponseHandler.handlerName, batch7Handler);
    });
}); 