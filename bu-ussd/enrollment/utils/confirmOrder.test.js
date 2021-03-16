const confirmOrder = require('./confirmOrder');

const CheckGroupLeader = require('../../../shared/rosterApi/checkForGroupLeader');
const enrollOrder = require('../../../Roster-endpoints/enrollOrder');
const getPhoneNumber = require('../../../shared/rosterApi/getPhoneNumber');

jest.mock('../../../shared/rosterApi/checkForGroupLeader');
jest.mock('../../../Roster-endpoints/enrollOrder');
jest.mock('../../../shared/rosterApi/getPhoneNumber');

describe('confirm order', () => {
    beforeAll(() => {
        state.vars.enrolling_client = JSON.stringify({
            AccountNumber: '23123456',
            DistrictId: 33453,
            SiteId: 4654,
            GroupId: 12,
            ClientId: 23
        });
        state.vars.selected_bundles = JSON.stringify([
            {
                bundleId: 123,
                bundleName: 'Biolite',
                inputBundles: [
                    {
                        quantity: 10,
                        bundleInputId: 345
                    }
                ]
            },
            {
                bundleId: 980,
                bundleName: 'Avocadoes',
                inputBundles: [
                    {
                        quantity: 87,
                        bundleInputId: 456
                    }
                ]
            }
        ]);
    });
    beforeEach(() => {
        CheckGroupLeader.mockReturnValueOnce(true);
        getPhoneNumber.mockReturnValueOnce([
            {
                IsInactive: false,
                PhoneNumber: '0780412345'
            },
            {
                IsInactive: true,
                PhoneNumber: '0789876543'
            }
        ]);
    });
    it('should display an error and terminate the session of there is an error enrolling', () => {
        enrollOrder.mockReturnValueOnce(false);
        confirmOrder('en-bu');
        expect(sayText).toHaveBeenCalledWith('There was an error please try again/later');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should enroll the order and send a message of products ordered', () => {
        enrollOrder.mockReturnValueOnce(true);
        confirmOrder('en-bu');
        expect(sayText).toHaveBeenCalledWith('Order\n' +
        '1) Biolite\n' +
        '2) Avocadoes\n');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Order\n' +
        '1) Biolite\n' +
        '2) Avocadoes\n', 'to_number': '0780412345'});
        expect(stopRules).toHaveBeenCalled();
    });
});
