const confirmOrder = require('./confirmOrder');

const CheckGroupLeader = require('../../../shared/rosterApi/checkForGroupLeader');
const enrollOrder = require('../../../Roster-endpoints/enrollOrder');
const getPhoneNumber = require('../../../shared/rosterApi/getPhoneNumber');

jest.mock('../../../shared/rosterApi/checkForGroupLeader');
jest.mock('../../../Roster-endpoints/enrollOrder');
jest.mock('../../../shared/rosterApi/getPhoneNumber');

describe('confirm order', () => {
    beforeAll(() => {
        contact.phone_number = '0780475674';
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
                bundleInputs: [
                    {
                        quantity: 10,
                        bundleInputId: 345,
                        price: 500,
                        unit: 'unit'
                    }
                ]
            },
            {
                bundleId: 980,
                bundleName: 'Avocadoes',
                bundleInputs: [
                    {
                        quantity: 87,
                        bundleInputId: 456,
                        price: 150,
                        unit: 'kg'
                    }
                ]
            }
        ]);
    });
    const tableMock = {createRow: jest.fn(), queryRows: jest.fn()};
    const cursorMock = {hasNext: jest.fn(), next: jest.fn()};
    jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
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
    it('should display an error and terminate the session if there is an error enrolling', () => {
        enrollOrder.mockReturnValueOnce(false);
        confirmOrder('en_bu');
        expect(sayText).toHaveBeenCalledWith('There was an error please try again/later');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should enroll the order and send a message of products ordered', () => {

        const clientRowMock = {save: jest.fn(), vars: {finalized: 1}};
        jest.spyOn(tableMock, 'createRow').mockReturnValueOnce(clientRowMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValueOnce(cursorMock).mockReturnValueOnce(cursorMock);
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(false).mockReturnValueOnce(true);
        jest.spyOn(cursorMock, 'next').mockReturnValueOnce(clientRowMock);
        enrollOrder.mockReturnValueOnce(true);
        confirmOrder('en_bu');
        expect(sayText).toHaveBeenCalledWith('Order\n' +
        'Biolite: 10 unit/500\n' +
        'Avocadoes: 87 kg/150\n' +
        'Total Credit = 18050\n');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Order\n' +
        'Biolite: 10 unit/500\n' +
        'Avocadoes: 87 kg/150\n' +
        'Total Credit = 18050\n', 'to_number': '0780412345'});
        expect(clientRowMock.save).toHaveBeenCalled();
        expect(tableMock.createRow).toHaveBeenCalledWith({
            'vars': {
                'account_number': '23123456',
                'order': '[{"bundleId":123,"bundleName":"Biolite","bundleInputs":[{"quantity":10,"bundleInputId":345,"price":500,"unit":"unit"}]},{"bundleId":980,"bundleName":"Avocadoes","bundleInputs":[{"quantity":87,"bundleInputId":456,"price":150,"unit":"kg"}]}]',
                'phone_number': '0780475674'}});
        expect(stopRules).toHaveBeenCalled();
    });

    it('should enroll the order and replace the currently existing order if it does', () => {

        const clientRowMock = {save: jest.fn(), vars: {finalized: 1}};
        const orderRowMock = {save: jest.fn(), vars: {account_number: '23123456'}};
        jest.spyOn(tableMock, 'createRow').mockReturnValueOnce(clientRowMock);
        jest.spyOn(tableMock, 'queryRows').mockReturnValueOnce(cursorMock).mockReturnValueOnce(cursorMock);
        jest.spyOn(cursorMock, 'hasNext').mockReturnValueOnce(true).mockReturnValueOnce(false);
        jest.spyOn(cursorMock, 'next').mockReturnValueOnce(orderRowMock);
        enrollOrder.mockReturnValueOnce(true);
        confirmOrder('en_bu');
        expect(sayText).toHaveBeenCalledWith('Order\n' +
        'Biolite: 10 unit/500\n' +
        'Avocadoes: 87 kg/150\n' +
        'Total Credit = 18050\n');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Order\n' +
        'Biolite: 10 unit/500\n' +
        'Avocadoes: 87 kg/150\n' +
        'Total Credit = 18050\n', 'to_number': '0780412345'});
        expect(clientRowMock.save).toHaveBeenCalled();
        expect(tableMock.createRow).toHaveBeenCalledWith({'vars': {'account_number': '23123456', 'finalized': 1}});
        expect(stopRules).toHaveBeenCalled();
    });
});
