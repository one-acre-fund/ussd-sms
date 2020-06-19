// jest.mock('./translations');
const getTranslation = require('./translations');
const { client } = require("./test-client-data");

const exampleContact = {
    phone_number: "0794320345",
    vars: {
        lastTransactionAmount: 8000,
        client: JSON.stringify(client)
    }
}

const shortRainsBalance = client.BalanceHistory[0].Balance;
const longRainsbalance = client.BalanceHistory[1].Balance;

describe('Mobile Money receipts', () => {
    beforeAll(() => {
        global.contact = exampleContact;
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should send a message to the contact number', () => {
        require('./main');
        expect(sendMessage).toHaveBeenCalledWith(exampleContact.phone_number,expect.any(String));
    });
    describe('Uganda', () => {
        beforeEach(() => {
            global.state.vars.country = 'ug';
        });
        it('should send the Uganda confirmation message if the country is Uganda', () => {
            require('./main');
            const expectedMessage = getTranslation('payment_receipt_ug', {
                firstName: client.FirstName,
                lastTransaction: exampleContact.vars.lastTransactionAmount,
                balance: longRainsbalance
            }, 'en')
            expect(sendMessage).toHaveBeenCalledWith(exampleContact.phone_number, expectedMessage);

        });
    });
});