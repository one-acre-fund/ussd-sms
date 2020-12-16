const foDetails = require('./foDetails');
const getFoInfo = require('../Roster-endpoints/Fo-info/getFoInfo');

jest.mock('../Roster-endpoints/Fo-info/getFoInfo');

const mockFODetails = {
    firstName: 'Tony',
    lastName: 'Stark',
    phoneNumber: '84111110121'
};
const mockClient = {
    DistrictId: 123,
    SiteId: 4,
};
const expectedSuccessfulMessages = {
    'en-ke': 'FO Name - Tony Stark\nFO Phone Number - 84111110121\n',
    'sw': 'Jina la Afisa wa nyanjani - Tony Stark\nNambari ya simu ya muhudumu wa nyanjani - 84111110121\n'
};

describe('foDetails', () => {

    it('should have a start function', () => {
        expect(foDetails.start).toBeInstanceOf(Function);
    });

    it.each(['en-ke', 'sw'])('should show valid message for successful getFOInfo', (lang) => {
        state.vars.client = JSON.stringify(mockClient);
        getFoInfo.mockImplementation(() => {
            return mockFODetails;
        });
        foDetails.start(lang);
        expect(sayText).toHaveBeenCalledWith(expectedSuccessfulMessages[lang]);
    });

    it.each(['en-ke', 'sw'])('should not show any message for failed getFOInfo', (lang) => {
        state.vars.client = JSON.stringify(mockClient);
        getFoInfo.mockImplementation(() => {
            return null;
        });
        foDetails.start(lang);
        expect(sayText).not.toHaveBeenCalled();
    });
});
