describe('Mobile Money receipts', () => {
    beforeAll(() => {
        global.project.vars.route_push = 'ts7ajag2saGA82ya8';
        global.state = {vars: {
            'date': '2020-07-26',
            'netRowPrice1': '140.36',
            'netRowPrice2': '122.81',
            'netRowPrice3': '175.44',
            'netRowPrice4': '100.00',
            'unitPrice3': '200.00',
            'unitPrice4': '100.00',
            'unitPrice1': '80.01',
            'unitPrice2': '140.00',
            'rowPrice3': '200.00',
            'rowPrice4': '100.00',
            'rowPrice1': '160.01',
            'rowPrice2': '140.00',
            'netUnitPrice4': '100.00',
            'netUnitPrice3': '175.44',
            'netUnitPrice2': '122.81',
            'netUnitPrice1': '70.18',
            'amount': 600,
            'quantity1': '2',
            'quantity2': '1',
            'quantity3': '1',
            'quantity4': '1',
            'name4': 'Mavuno; Garden Leafy; NPK 20:10:18 +TE; 1 KG Bag [Stock]',
            'name3': 'Vegetable; Red Creole Onions, 25 GM Unit [Stock]',
            'name2': 'Vegetable; Sukuma; 50 GM Unit [Stock]',
            'name1': 'Vegetable; Spinach (Swiss Chard); 25g Packet [STOCK]',
            'phone': '254715831743 ',
            'receipt': '54003657',
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
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Thank you for shopping at the OAF Duka! Date: 2020-07-26 Invoice nro: 54003657 Product cost: KES 538.61 VAT: KES 61.39 Total: KES 600.00',
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
            '{"date":"2020-07-26","netRowPrice1":"140.36","netRowPrice2":"122.81","netRowPrice3":"175.44","netRowPrice4":"100.00","unitPrice3":"200.00",' + 
            '"unitPrice4":"100.00","unitPrice1":"80.01","unitPrice2":"140.00","rowPrice3":"200.00","rowPrice4":"100.00","rowPrice1":"160.01","rowPrice2":"140.00",' + 
            '"netUnitPrice4":"100.00","netUnitPrice3":"175.44","netUnitPrice2":"122.81","netUnitPrice1":"70.18","amount":600,"quantity1":"2","quantity2":"1",' + 
            '"quantity3":"1","quantity4":"1","name4":"Mavuno; Garden Leafy; NPK 20:10:18 +TE; 1 KG Bag [Stock]","name3":"Vegetable; Red Creole Onions, 25 GM Unit [Stock]",' + 
            '"name2":"Vegetable; Sukuma; 50 GM Unit [Stock]","name1":"Vegetable; Spinach (Swiss Chard); 25g Packet [STOCK]","phone":"254715831743 ","receipt":"54003657","email":"user@tester.com"}');
    });
});
