const {list,show} = require('./displayTransactions');

const inputHandlerName = 'name_of_handler_of_input';

describe('show', () => {
    it('shouldbe a function', () => {
        expect(show).toBeInstanceOf(Function);
    });
    describe('in Rwanda English', () => {
        beforeEach(() => {
            project.vars.lang ='en';
            //Date.toISOString = jest.fn();
            //singleRepayment.RepaymentDate = '11/30/2020 12:00:00 AM';
        });
        it('should show a given transaction with sayText in English', () => {
            show(singleRepayment);
            expect(sayText).toHaveBeenCalledWith(
                `Payment ID: ${singleRepayment.RepaymentId}`
                +'\nDate Received: 2020-02-04'
                +`\nSeason: ${singleRepayment.Season}`
                +`\nAmount: ${singleRepayment.Amount} RwF`
                +`\nPaid from: ${singleRepayment.PaidFrom}`
                +'\n0) Back'
            );
        });     
        it('should call promptDigits with the given inputhadnler', () => {
            show(singleRepayment, inputHandlerName);
            expect(global.promptDigits).toHaveBeenCalledWith(inputHandlerName);
        });   
    });
    describe('in Rwanda Kinyarwada', () => {
        beforeEach(() => {
            project.vars.lang ='ki';
        });
        it('should show a given transaction with sayText in Kinyarwanda', () => {
            show(singleRepayment);
            expect(sayText).toHaveBeenCalledWith(
                `Nomero ndangagikorwa: ${singleRepayment.RepaymentId}`
                +'\nItariki yishyuriweho: 2020-02-04'
                +`\nIgihembwe: ${singleRepayment.Season}`
                +`\nAmafaranga: ${singleRepayment.Amount} RwF`
                +`\nYishyuwe avuye: ${singleRepayment.PaidFrom}`
                +'\n0) Ahabanza'
            );
        });        
    });
    describe('in Kenya Swahili', () => {
        beforeEach(() => {
            project.vars.lang ='sw';
        });
        it('should show a given transaction with sayText in Swahili', () => {
            show(singleRepayment);
            expect(sayText).toHaveBeenCalledWith(
                `Rekodi ya malipo: ${singleRepayment.RepaymentId}`
                +'\nTarehe ya malipo: 2020-02-04'
                +`\nMsimu: ${singleRepayment.Season}`
                +`\nIdadi ya malipo: ${singleRepayment.Amount} KES`
                +`\nMalipo kutoka simu nambari: ${singleRepayment.PaidFrom}`
                +'\n0) Rudi nyuma'
            );
        });        
    });
});


describe('list', () => {
    it('should be a function', () => {
        expect(list).toBeInstanceOf(Function);
    });
    describe('in Rwanda English', () => {
        beforeEach(() => {
            project.vars.lang ='en';
        });
        it('should list the first four if not given a page', () => {
            list(repaymentsList);
            expect(sayText).toHaveBeenLastCalledWith(
                'Select a payment for details:'
                +`\n1. 2020-02-04 - ${repaymentsList[0].Amount} RwF`
                +`\n2. 2020-05-05 - ${repaymentsList[1].Amount} RwF`
                +`\n3. 2020-04-03 - ${repaymentsList[2].Amount} RwF`
                +`\n4. 2020-01-01 - ${repaymentsList[3].Amount} RwF`
                +'\n99. Continue'
            );
        });
        it('should list the second four if given a page number of 2 ', () => {
            list(repaymentsList,2);
            expect(sayText).toHaveBeenLastCalledWith(
                'Select a payment for details:\n44. Back'
                +`\n5. 2020-05-01 - ${repaymentsList[4].Amount} RwF`
                +`\n6. 2019-01-17 - ${repaymentsList[5].Amount} RwF`
                +`\n7. 2019-05-06 - ${repaymentsList[6].Amount} RwF`
                +`\n8. 2019-06-05 - ${repaymentsList[7].Amount} RwF`
                +'\n99. Continue'
            );        
        });
        it('should show the error message if provided', () => {
            const erorMessage = 'Something is wrong\n';
            list(repaymentsList,1, erorMessage);
            expect(sayText).toHaveBeenLastCalledWith(
                erorMessage +'Select a payment for details:'
                +`\n1. 2020-02-04 - ${repaymentsList[0].Amount} RwF`
                +`\n2. 2020-05-05 - ${repaymentsList[1].Amount} RwF`
                +`\n3. 2020-04-03 - ${repaymentsList[2].Amount} RwF`
                +`\n4. 2020-01-01 - ${repaymentsList[3].Amount} RwF`
                +'\n99. Continue'
            );
        });
    });
    
    describe('in Kinyarwanda', () => {
        beforeEach(() => {
            project.vars.lang ='ki';
        });
        it('should list the first four if not given a page', () => {
            list(repaymentsList);
            expect(sayText).toHaveBeenLastCalledWith(
                'Hitamo ubwishyu uhabwe ubusobanuro burambuye:'
                +`\n1. 2020-02-04 - F${repaymentsList[0].Amount}`
                +`\n2. 2020-05-05 - F${repaymentsList[1].Amount}`
                +`\n3. 2020-04-03 - F${repaymentsList[2].Amount}`
                +`\n4. 2020-01-01 - F${repaymentsList[3].Amount}`
                +'\n99. Komeza'
            );
        });
        it('should list the second four if given a page number of 2 ', () => {
            list(repaymentsList,2);
            expect(sayText).toHaveBeenLastCalledWith(
                'Hitamo ubwishyu uhabwe ubusobanuro burambuye:\n44. Subira Inyuma'
                +`\n5. 2020-05-01 - F${repaymentsList[4].Amount}`
                +`\n6. 2019-01-17 - F${repaymentsList[5].Amount}`
                +`\n7. 2019-05-06 - F${repaymentsList[6].Amount}`
                +`\n8. 2019-06-05 - F${repaymentsList[7].Amount}`
                +'\n99. Komeza'
            );        
        });
        
    });
    
    describe('in Swahilli', () => {
        beforeEach(() => {
            project.vars.lang ='sw';
        });
        it('should list the first four if not given a page', () => {
            list(repaymentsList);
            expect(sayText).toHaveBeenLastCalledWith(
                'Chagua rekodi ya malipo kwa maelezo zaidi:'
                +`\n1. 2020-02-04 - KES ${repaymentsList[0].Amount}`
                +`\n2. 2020-05-05 - KES ${repaymentsList[1].Amount}`
                +`\n3. 2020-04-03 - KES ${repaymentsList[2].Amount}`
                +`\n4. 2020-01-01 - KES ${repaymentsList[3].Amount}`
                +'\n99. Endelea'
            );
        });
        it('should list the second four if given a page number of 2 ', () => {
            list(repaymentsList,2);
            expect(sayText).toHaveBeenLastCalledWith(
                'Chagua rekodi ya malipo kwa maelezo zaidi:\n44. Rudi nyuma'
                +`\n5. 2020-05-01 - KES ${repaymentsList[4].Amount}`
                +`\n6. 2019-01-17 - KES ${repaymentsList[5].Amount}`
                +`\n7. 2019-05-06 - KES ${repaymentsList[6].Amount}`
                +`\n8. 2019-06-05 - KES ${repaymentsList[7].Amount}`
                +'\n99. Endelea'
            );        
        });
        
    });
});

const singleRepayment = {
    'RepaymentId': '2534504906',
    'RepaymentDate': '2/5/2020 00:27:03 AM',
    'Season': '2020',
    'Amount': 2001.0000,
    'PaidFrom': '0787117739'
};
const repaymentsList = [
    singleRepayment,
    {
        'RepaymentId': '2474515444',
        'RepaymentDate': '5/5/2020 6:16:56 AM',
        'Season': '2020',
        'Amount': 2002.0000,
        'PaidFrom': '0787428878'
    },
    {
        'RepaymentId': '2285699969',
        'RepaymentDate': '4/3/2020 2:29:54 AM',
        'Season': '2020',
        'Amount': 2003.0000,
        'PaidFrom': '663565'
    },
    {
        'RepaymentId': '2233627731',
        'RepaymentDate': '1/2/2020 1:11:39 AM',
        'Season': '2020',
        'Amount': 2004.0000,
        'PaidFrom': '788926'
    },
    {
        'RepaymentId': '2219628297',
        'RepaymentDate': '5/2/2020 1:36:25 AM',
        'Season': '2020',
        'Amount': 2005.0000,
        'PaidFrom': '594206'
    },
    {
        'RepaymentId': '1877459374',
        'RepaymentDate': '1/18/2019 0:56:53',
        'Season': '2020',
        'Amount': 2006.0000,
        'PaidFrom': '0787784673'
    },
    {
        'RepaymentId': '1736415567',
        'RepaymentDate': '5/6/2019 8:54:32',
        'Season': '2019',
        'Amount': 2007.0000,
        'PaidFrom': '0786394610'
    },
    {
        'RepaymentId': '1672889041',
        'RepaymentDate': '6/5/2019 2:26:21 AM',
        'Season': '2019',
        'Amount': 2008.0000,
        'PaidFrom': '0787746931'
    },
    {
        'RepaymentId': '1567436959',
        'RepaymentDate': '1/3/2019 2:50:29 AM',
        'Season': '2019',
        'Amount': 2009.0000,
        'PaidFrom': '0787418369'
    },
    {
        'RepaymentId': '1496045072',
        'RepaymentDate': '1/2/2019 8:05:58 AM',
        'Season': '2019',
        'Amount': 2010.0000,
        'PaidFrom': '0782321660'
    },
    {
        'RepaymentId': '8483197187',
        'RepaymentDate': '1/1/2019 8:27:50 AM',
        'Season': '2019',
        'Amount': 2011.0000,
        'PaidFrom': '0722238622'
    },
    {
        'RepaymentId': '1262988984',
        'RepaymentDate': '7/1/2018 1:01:53 AM',
        'Season': '2019',
        'Amount': 2012.0000,
        'PaidFrom': '225966'
    },
    {
        'RepaymentId': '1144554663',
        'RepaymentDate': '3/7/2018 1:55:18 AM',
        'Season': '2019',
        'Amount': 2013.0000,
        'PaidFrom': '112658'
    }
];