describe('Mobile Money receipts', () => {
    beforeAll(() => {
        global.project.vars.route_push = 'ts7ajag2saGA82ya8';
        global.state = {vars: {
            'date': '2020-07-07',
            
            'netRowPrice1': '373.91',
            'netRowPrice2': '1346.10',
            
            'unitPrice1': '400.00',
            'unitPrice2': '240.00',
            
            'quantity1': '1',
            'quantity2': '6',
            
            'rowPrice1': '373.91',
            'rowPrice2': '1346.10',
            
            'netUnitPrice1': '400.00',
            'netUnitPrice2': '240.00',
            
            'name1': 'Foliar fertilizer [Stock]',
            'name2': 'Crop Storage; PICS Storage Bag [Stock]',
            
            
            'receipt': '34002858',
            'phone': '0721415321',
            'amount': 1720.01,
        }
        };
        global.contact.phone_number = '0750475911';
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should send an updated receips message', () => {
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValue({id: 1});
        require('./dukaReceipts');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Thank you for shopping at the OAF Duka! Date: 2020-07-07 Invoice nro: 34002858 Product cost: KES 1720.01 VAT: KES 119.99 Total: KES 1840',
            'label_ids': [1], 
            'route_id': 'ts7ajag2saGA82ya8',
            'to_number': '0750475911'});
        expect(project.getOrCreateLabel).toHaveBeenCalledWith('Duka Receipt');
    });

    it('should email the testing partner', () => {
        state.vars.email = 'user@tester.com';
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValue({id: 1});
        require('./dukaReceipts');
        expect(global.sendEmail).toHaveBeenCalledWith('user@tester.com', 
            'Testing email', 
            '{"date":"2020-07-07","netRowPrice1":"373.91","netRowPrice2":"1346.10","unitPrice1":"400.00","unitPrice2":"240.00","quantity1":"1","quantity2":"6","rowPrice1":"373.91","rowPrice2":"1346.10","netUnitPrice1":"400.00","netUnitPrice2":"240.00","name1":"Foliar fertilizer [Stock]","name2":"Crop Storage; PICS Storage Bag [Stock]","receipt":"34002858","phone":"0721415321","amount":1720.01,"email":"user@tester.com"}');
    });
});
