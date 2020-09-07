var Logger = require('./elk-logger');
const baseURL = 'http://elkendpoint.example.com';
const requestLogger = require('../data-table/request-logger');

jest.mock('../data-table/request-logger');

httpClient.request.mockReturnValue({status: 200});

describe('Logger', () => {
    let  logger;
    beforeEach(() => {
        logger = new Logger(baseURL);
    });
    afterAll(() => {
        jest.resetAllMocks();
    });
    it('should be a function', () => {
        expect(Logger).toBeInstanceOf(Function);
    });
    it('should throw an error if called without a URL and without a project.vars.elk_logs_base_url', () => {
        project.vars.elk_logs_base_url =undefined;
        expect(() => {
            logger = new Logger();
        }).toThrow('Required base URL not provided');
    });
    it('should not throw an error if project.vars.elk_logs_base_url is set and it is initialised without a URl', () => {
        project.vars.elk_logs_base_url = 'https://example.com';
        logger = new Logger();
        expect(logger.baseURL).toEqual(project.vars.elk_logs_base_url);
    });
    it('should provide a log.log function', () => {
        expect(logger.log).toBeInstanceOf(Function);
    });
    it('should provide a log.warn function', () => {
        expect(logger.warn).toBeInstanceOf(Function);
    });
    it('should provide a log.error function', () => {
        expect(logger.error).toBeInstanceOf(Function);
    });
    describe('logger.log', () => {
        const message = 'example log message';
        const tags = ['tag-1','tag-2'];
        const otherData = {any: 'thing', json: 'serializable'};
        it('should throw an error if there is no message provided', () => {
            expect(() => {
                logger.log();                
            }).toThrow('Error: log called without message');
        });
        it('should send a POST request with the baseURl and provided message', () => {
            logger.log(message);
            const expectedData = JSON.stringify({message, tags: [project.name, service.name]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+'/telerivet-logs',{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should send a POST request with any provided tags', () => {
            logger.log(message,{tags});
            const expectedData = JSON.stringify({message,tags: [project.name, service.name, ...tags]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+'/telerivet-logs',{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should throw an error if the tags are not an array', () => {
            expect(() => {
                const notAnArray = 123456;
                logger.log(message,{tags: notAnArray});                
            }).toThrow('tags should be an array of strings');
        });
        it('should throw an error if the tags are not an array of strings', () => {
            expect(() => {
                const notAnArrayOfStrings =['string',false, 123456];
                logger.log(message,{tags: notAnArrayOfStrings});                
            }).toThrow('tags should be an array of strings');
        });
        it('should not crash if an empty array is provided as the tags', () => {
            logger.log(message,{tags: []});
            const expectedData = JSON.stringify({ message, tags: [project.name, service.name] });
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+'/telerivet-logs',{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should not crash if tags are undefined', () => {
            logger.log(message,{tags: undefined});
            const expectedData = JSON.stringify({message, tags: [project.name, service.name]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+'/telerivet-logs',{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should send a POST request with any provided tags and miscellaneous data', () => {
            const expectedData = JSON.stringify({ message, data: otherData, tags: [project.name, service.name, ...tags]});
            logger.log(message,{tags,data: otherData});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+'/telerivet-logs',{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should log to request logger if the returned status code is not 200', () => {
            const mockResponse = { status: 404, content: 'mockContent' };
            httpClient.request.mockReturnValueOnce(mockResponse);
            logger.log(message,{tags,data: otherData});
            expect(requestLogger).toHaveBeenCalledWith(baseURL+'/telerivet-logs', mockResponse);
        });
    });
    describe('logger.warn', () => {
        const message = 'example warning message';
        const tags = ['tag-1','tag-2'];
        const otherData = {any: 'thing', json: 'serializable'};
        const warningLogPath = '/telerivet-warn';
        it('should throw an error if there is no message provided', () => {
            expect(() => {
                logger.warn();                
            }).toThrow('Error: "logger.warn" called without message');
        });
        it('should send a POST request with the baseURl and provided message', () => {
            logger.warn(message);
            const expectedData = JSON.stringify({message, tags: [project.name, service.name]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+warningLogPath,{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should send a POST request with any provided tags', () => {
            logger.warn(message,{tags});
            const expectedData = JSON.stringify({message,tags: [project.name, service.name, ...tags]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+warningLogPath,{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should throw an error if the tags are not an array', () => {
            expect(() => {
                logger.warn(message,{tags: 'not an array of strings'});                
            }).toThrow('tags should be an array of strings');
        });
        it('should send a POST request with any provided tags and miscellaneous data', () => {
            logger.warn(message,{tags,data: otherData});
            const expectedData = JSON.stringify({message,data: otherData,tags: [project.name, service.name, ...tags]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+warningLogPath,{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
    });
    describe('logger.error', () => {
        const message = 'example error message';
        const tags = ['tag-1','tag-2'];
        const otherData = {any: 'thing', json: 'serializable'};
        const errorLogPath = '/telerivet-error';
        it('should throw an error if there is no message provided', () => {
            expect(() => {
                logger.error();                
            }).toThrow('Error: "logger.error" called without message');
        });
        it('should send a POST request with the baseURl and provided message', () => {
            logger.error(message);
            const expectedData = JSON.stringify({message, tags: [project.name, service.name]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+errorLogPath,{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should send a POST request with any provided tags', () => {
            logger.error(message,{tags});
            const expectedData = JSON.stringify({message,tags: [project.name, service.name, ...tags]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+errorLogPath,{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
        it('should throw an error if the tags are not an array', () => {
            expect(() => {
                logger.error(message,{tags: 'not an array of strings'});                
            }).toThrow('tags should be an array of strings');
        });
        it('should send a POST request with any provided tags and miscellaneous data', () => {
            logger.error(message,{tags,data: otherData});
            const expectedData = JSON.stringify({message,data: otherData,tags: [project.name, service.name, ...tags]});
            expect(httpClient.request).toHaveBeenCalledWith(baseURL+errorLogPath,{
                method: 'POST',
                data: expectedData,
                headers: {'Content-Type': 'application/json'}
            });
        });
    });
});