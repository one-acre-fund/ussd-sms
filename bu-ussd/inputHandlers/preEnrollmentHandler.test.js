const getClient = require('../../shared/rosterApi/getClient');
const Enrollment = require('../enrollment/enrollment');
const preEnrollmentHandler = require('./preEnrollmentHandler');
const reduceClientSize = require('../../shared/reduceClientSize');

jest.mock('../../shared/rosterApi/getClient');
jest.mock('../enrollment/enrollment');
jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../../shared/reduceClientSize');

describe('pre enrollment', () => {
    beforeAll(() => {
        state.vars.client_json = JSON.stringify({ DistrictId: 1234, SiteId: 2345, GroupId: 1234});
        project.vars.country = 'BI';
        state.vars.group_info = JSON.stringify({ districtId: 1234, siteId: 2345, groupId: 1234});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should reprompt if client is not authenticated on roster', () => {
        getClient.mockReturnValueOnce(null);
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(getClient).toHaveBeenCalledWith('123434', 'BI');
        expect(sayText).toHaveBeenCalledWith('Enter the account number of the farmer you want to order for');
        expect(promptDigits).toHaveBeenCalledWith(preEnrollmentHandler.handlerName);
    });
    it('should start the enrollment if the farmer to be enrolled is new (has no group id) and assign ', () => {
        reduceClientSize.mockReturnValueOnce({AccountNumber: '34534',  DistrictId: 1234, SiteId: 2345,GroupId: null});
        getClient.mockReturnValueOnce({AccountNumber: '34534',  DistrictId: 1234, SiteId: 2345, GroupId: null});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(Enrollment.start).toHaveBeenCalledWith('en_bu', {AccountNumber: '34534', DistrictId: 1234, SiteId: 2345, GroupId: null});
    });

    it('should start the enrollment if the farmer to be enrolled is not new (has a group id) that matched the group leader\'s', () => {
        getClient.mockReturnValueOnce({ DistrictId: 1234, SiteId: 2345,GroupId: 1234});
        reduceClientSize.mockReturnValueOnce({ DistrictId: 1234, SiteId: 2345,GroupId: 1234});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(Enrollment.start).toHaveBeenCalledWith('en_bu', { DistrictId: 1234, SiteId: 2345,'GroupId': 1234});
    });

    it('should start the enrollment if the group code provided match the returning clients district, site and group and the GL choose to enroll them in others group', () => {
        state.vars.sameGroup = 'false';
        reduceClientSize.mockReturnValueOnce({DistrictId: 1234, SiteId: 2345,GroupId: 1234});
        getClient.mockReturnValueOnce({DistrictId: 1234, SiteId: 2345, GroupId: 1234});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(Enrollment.start).toHaveBeenCalledWith('en_bu', { 'DistrictId': 1234, 'SiteId': 2345,'GroupId': 1234});
    });
    it('should start enrollment and give a new client the group leader group ID if the client is in their site and GL choose to enroll in their group', () => {
        state.vars.sameGroup = 'true';
        reduceClientSize.mockReturnValueOnce({DistrictId: 1234, SiteId: 2345,GroupId: 4321});
        getClient.mockReturnValueOnce({DistrictId: 1234, SiteId: 2345, GroupId: null});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(Enrollment.start).toHaveBeenCalledWith('en_bu', { 'DistrictId': 1234, 'SiteId': 2345,'GroupId': 4321});
    });
    it('should display an error message if the new client is not in the GL and the GL choose to enroll in their group', () => {
        state.vars.sameGroup = 'true';
        reduceClientSize.mockReturnValueOnce({DistrictId: 123445, SiteId: 234455,GroupId: null});
        getClient.mockReturnValueOnce({DistrictId: 123445, SiteId: 234455, GroupId: null});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(sayText).toHaveBeenCalledWith('The farmer  you are trying to enroll is registered in a different site or district');
    });
    it('should display an error message if the returning client is not in the same group, site and district as the group code provided', () => {
        state.vars.sameGroup = 'false';
        state.vars.group_info = JSON.stringify({districtId: 1234, siteId: 2345, groupId: 1234});
        reduceClientSize.mockReturnValueOnce({DistrictId: 123445, SiteId: 234455,GroupId: 1234});
        getClient.mockReturnValueOnce({DistrictId: 123445, SiteId: 234455, GroupId: 1234});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(sayText).toHaveBeenCalledWith('The farmer  you are trying to enroll is registered in a different site or district than the code provided');
    });

    it('should display an error message if the returning client is in the same group, but not in the same group as the GL', () => {
        state.vars.sameGroup = 'true';
        state.vars.group_info = JSON.stringify({districtId: 1234, siteId: 2345, groupId: 97346});
        reduceClientSize.mockReturnValueOnce({DistrictId: 1234, SiteId: 2345,GroupId: 4584});
        getClient.mockReturnValueOnce({DistrictId: 1234, SiteId: 2345, GroupId: 3743});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(sayText).toHaveBeenCalledWith('The farmer  you are trying to enroll is registered in a different site or district');
    });

    it('should display an error message if the returning client is not in the same group', () => {
        state.vars.sameGroup = 'false';
        state.vars.group_info = JSON.stringify({districtId: 1234, siteId: 2345, groupId: 97346});
        reduceClientSize.mockReturnValueOnce({DistrictId: 1234, SiteId: 2345,GroupId: 4584});
        getClient.mockReturnValueOnce({DistrictId: 1234, SiteId: 2345, GroupId: 3743});
        const handler = preEnrollmentHandler.getHandler('en_bu');
        handler('123434');
        expect(sayText).toHaveBeenCalledWith('The farmer  you are trying to enroll is registered in a different site or district than the code provided');
    });
});
