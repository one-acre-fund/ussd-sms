const getHealthyPathPercentage = require('./getHealthyPathPercentage');
const getHealthyPathData = require('../../shared/rosterApi/getHealthyPathData');
const slack = require('../../slack-logger/index');
const moment = require('moment');

jest.mock('../../shared/rosterApi/getHealthyPathData');
jest.mock('../../slack-logger/index');

describe('get healthy path percentage', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    it('should log the error once the data is not found or is empty', () => {
        jest.spyOn(slack, 'log');
        getHealthyPathData.mockReturnValueOnce([]);
        getHealthyPathPercentage(1,2,3);
        expect(slack.log).toHaveBeenCalledWith('API returned empty healthy path or an error during week number calculation{"content":[]}');
    });
    it('should log an error if there is an issue with api call', () => {
        jest.spyOn(slack, 'log');
        const error = new Error('SERVER ERROR');
        getHealthyPathData.mockImplementationOnce(() => {
            throw(error);
        });
        getHealthyPathPercentage(1,2,3);
        expect(slack.log).toHaveBeenCalledWith(error);
    });

    it('should return the healthy path data for the current week', () => {
        const Date1 = moment() - 90000000;
        const Date2 = moment() + 90000000;
        console.log(Date1, Date2);

        const mockData = [
            {
                'EndDate': moment(Date2).format('YYYY-MM-DD') + 'T00:00:00',
                'StartDate': moment(Date1).format('YYYY-MM-DD') + 'T00:00:00',
                'HealthyPathTarget': 0.5500
            },
            {
                'EndDate': '2020-06-11T00:00:00',
                'StartDate': '2020-06-05T00:00:00',
                'HealthyPathTarget': 0.0400
            },
        ];
        getHealthyPathData.mockReturnValueOnce(mockData);
        const result = getHealthyPathPercentage(1,2,3);
        expect(result).toEqual(0.55);
    }); 
});