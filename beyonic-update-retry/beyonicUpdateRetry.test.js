
var collectionRequest = {
    phonenumber: '0786162098',
    metadata: { 
        accountNo: '1234'
    },
    amount: '1234',
    status: 'active',
    error_message: 'no-error',
    id: '123',
    English: true
};
const mockCursor = { next: jest.fn(), 
    hasNext: jest.fn(),
    count: jest.fn()
};

const mockTable = { queryRows: jest.fn() };
mockTable.queryRows.mockReturnValue(mockCursor);
var mockRow = {from_number: '0786182098',vars: { PaymentAmount: 4, UpdateReceived: 1},save: jest.fn()};
const mockPhoneNumber = { formatInternationalRaw: jest.fn() };
var mockedLabel = {id: '123'};


describe('beyonicUpdateRetry', () => {
    beforeAll(() => {
        contact.phone_number = '0786182098';
        project.getOrCreateDataTable.mockReturnValue(mockTable);
        project.getOrCreateLabel.mockReturnValue(mockedLabel);
        PhoneNumber.formatInternationalRaw.mockReturnValue(collectionRequest.phonenumber);
        contact.vars.English = true;
    });
    beforeEach(() => {
        jest.resetModules();
        contact.vars.collectionRequest = JSON.stringify(collectionRequest);
        mockCursor.next.mockReturnValue(mockRow);  
    });
    it('should call the production table if the environment is prod',()=>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        service.vars.env = 'prod';
        require('./beyonicUpdateRetry');
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith('Client portal 2.0');
    });
    it('should call the dev table if the environment is dev',()=>{
        service.vars.env = 'dev';
        require('./beyonicUpdateRetry');
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith('dev_Client portal 2.0');

    });
    it('should set the updateReceived row in telerivet to done if no error is found and a row with UpdateReceived as no is found',()=>{
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
        require('./beyonicUpdateRetry');
        expect(mockRow.vars.UpdateReceived).toEqual('DONE');
    });
    it('should send a message in english if an error is found and English is set to true',()=>{
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
        mockPhoneNumber.formatInternationalRaw.mockReturnValue('1234');
        collectionRequest.error_message = '[STK_CB - ]DS timeout.';
        contact.vars.collectionRequest = JSON.stringify(collectionRequest);
        require('./beyonicUpdateRetry');
        expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
            content: 'An unexpected error occurred, please try again by dialing *689#\n',
            to_number: collectionRequest.phonenumber,
            label_ids: [mockedLabel.id,mockedLabel.id,mockedLabel.id,mockedLabel.id],
        }));
    });
    it('should send a message in swahili if an error is found and English is set to false ',()=>{
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
        contact.vars.English = false;
        require('./beyonicUpdateRetry');
        expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
            content: 'Kuna hitilafu ya mitambo. Tafadhali jaribu tena kwa kubonyeza *689#\n',
            to_number: collectionRequest.phonenumber,
            label_ids: [mockedLabel.id,mockedLabel.id,mockedLabel.id,mockedLabel.id],
        }));
    });
    it('should save a row if the saved column on the contact is RETRYING on UpdateReceived', ()=>{
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
        require('./beyonicUpdateRetry');
        expect(mockRow.vars.PaymentStatus).toEqual(collectionRequest.status);
        expect(mockRow.vars.ErrorMessageAfterRetry).toEqual(collectionRequest.error_message);
        expect(mockRow.vars.BeyonicID).toEqual(collectionRequest.id);
        expect(mockRow.vars.UpdateReceived).toEqual('DONE');
        expect(mockRow.save).toHaveBeenCalled();
    });
    it('should send a message if the update is retrying and the sim is in the old sim card table with a the content saying they should upgrade(if swahili is set)',()=>{
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
        mockCursor.count.mockReturnValueOnce(1);
        require('./beyonicUpdateRetry');
        expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
            content: 'Jambo. Kadi yako ya simu ni ya zamani. Ibadilishe kwa ajenti wa Mpesa ili uzidi kufanya malipo kwa One Acre Fund.Usipoweza, tumia Paybill 840700\n',
            to_number: collectionRequest.phonenumber,
            label_ids: [mockedLabel.id,mockedLabel.id,mockedLabel.id,mockedLabel.id],
        }));
    });
    it('should send a message if the update is retrying and the sim is in the old sim card table with a message saying they should upgrade(if English is set)',()=>{
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
        mockCursor.count.mockReturnValueOnce(1);
        contact.vars.English = true;
        require('./beyonicUpdateRetry');
        expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
            content: 'Hello. Your SIM card is old and must be swapped by an Mpesa agent to make payments to One Acre Fund. If unsuccessful,use Paybill 840700\n',
            to_number: collectionRequest.phonenumber,
            label_ids: [mockedLabel.id,mockedLabel.id,mockedLabel.id,mockedLabel.id],
        }));
    });
    it('should send a message if the update is retrying and the sim is not in the old sim card table with a message sying they can\'t make a payment(in swahili)' ,()=>{
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
        mockCursor.count.mockReturnValueOnce(0);
        contact.vars.English = false;
        require('./beyonicUpdateRetry');
        expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
            content: 'Jambo. Kadi yako ya simu ni ya kitambo haiwezi fanya malipo kwa One Acre Fund. Bonyeza *234*1*6# kuiboresha. Usipofaulu, tumia Paybill 840700\n',
            to_number: collectionRequest.phonenumber,
            label_ids: [mockedLabel.id,mockedLabel.id,mockedLabel.id,mockedLabel.id],
        }));
    });
    it('should send a message if the update is retrying and the sim is not in the old sim card table with a message sying they can\'t make a payment(in english)' ,()=>{
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
        mockCursor.count.mockReturnValueOnce(0);
        contact.vars.English = true;
        require('./beyonicUpdateRetry');
        expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
            content: 'Hello.Your SIM card can\'t make a payment to One Acre Fund. Dial *234*1*6# to upgrade. If unsuccessful, use paybill 840700.\n',
            to_number: collectionRequest.phonenumber,
            label_ids: [mockedLabel.id,mockedLabel.id,mockedLabel.id,mockedLabel.id],
        }));
    });
    it('should send a message saying they try again if the update is retrying and other errors are found expect error1 and error2(in english)',()=>{
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
        collectionRequest.error_message = 'Collection request failed.Please contact an administrator';
        contact.vars.collectionRequest = JSON.stringify(collectionRequest);
        require('./beyonicUpdateRetry');
        expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
            content: 'An unexpected error occurred, please try again by dialing *689#\n',
            to_number: collectionRequest.phonenumber,
            label_ids: [mockedLabel.id,mockedLabel.id,mockedLabel.id,mockedLabel.id],
        }));
    });
    it('should send a message saying they try again if the update is retrying and other errors are found expect error1 and error2(in swahili)',()=>{
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
        collectionRequest.error_message = 'Collection request failed.Please contact an administrator';
        contact.vars.collectionRequest = JSON.stringify(collectionRequest);
        contact.vars.English = false;
        require('./beyonicUpdateRetry');
        expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
            content: 'Kuna hitilafu ya mitambo. Tafadhali jaribu tena kwa kubonyeza *689#\n',
            to_number: collectionRequest.phonenumber,
            label_ids: [mockedLabel.id,mockedLabel.id,mockedLabel.id,mockedLabel.id],
        }));
    });

    it('should console log if the status sent is instructions_sent',()=>{
        console.log = jest.fn();
        collectionRequest.status = 'instructions_sent';
        contact.vars.collectionRequest = JSON.stringify(collectionRequest);
        require('./beyonicUpdateRetry');
        expect(console.log).toHaveBeenCalled();
    });

    it('should send am email if the phone numbers are different',()=>{
        PhoneNumber.formatInternationalRaw.mockReset();
        PhoneNumber.formatInternationalRaw.mockReturnValueOnce('56789').mockReturnValueOnce('0786172098');
        require('./beyonicUpdateRetry');
        expect(sendEmail).toHaveBeenCalledWith('tom.vranken@oneacrefund.org', 
            'BEYONIC NOTIFICATION ERROR', 
            'Phone numbers do not match between Beyonic payload and contact');
    });

});