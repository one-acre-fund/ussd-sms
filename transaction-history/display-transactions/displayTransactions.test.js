const {list,show} = require('./displayTransactions');

describe('show', () => {
    it('shouldbe a function', () => {
        expect(show).toBeInstanceOf(Function);
    });
    describe('in Rwanda English', () => {
        beforeEach(() => {
            project.vars.lang ='en';
        });
        it('should show a given transaction with sayText in English', () => {
            show(singleRepayment);
            expect(sayText).toHaveBeenCalledWith(
                `Payment ID: ${singleRepayment.RepaymentId}`
                +'\nDate Received: 20-05-2020'
                +`\nSeason: ${singleRepayment.Season}`
                +`\nAmount: ${singleRepayment.Amount} RwF`
                +`\nPaid from: ${singleRepayment.PaidFrom}`
            );
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
                +'\nItariki yishyuriweho: 20-05-2020'
                +`\nIgihembwe: ${singleRepayment.Season}`
                +`\nAmafaranga: ${singleRepayment.Amount} RwF`
                +`\nYishyuwe avuye: ${singleRepayment.PaidFrom}`
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
                +'\nTarehe ya malipo: 20-05-2020'
                +`\nMsimu: ${singleRepayment.Season}`
                +`\nIdadi ya malipo: ${singleRepayment.Amount} KES`
                +`\nMalipo kutoka simu nambari: ${singleRepayment.PaidFrom}`
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
                +`\n1. 20-05-2020 - ${repaymentsList[0].Amount} RwF`
                +`\n2. 05-05-2020 - ${repaymentsList[1].Amount} RwF`
                +`\n3. 04-03-2020 - ${repaymentsList[2].Amount} RwF`
                +`\n4. 11-02-2020 - ${repaymentsList[3].Amount} RwF`
                +'\n99. Continue'
            );
        });
        it('should list the second four if given a page number of 2 ', () => {
            list(repaymentsList,2);
            expect(sayText).toHaveBeenLastCalledWith(
                'Select a payment for details:'
                +`\n5. 05-02-2020 - ${repaymentsList[4].Amount} RwF`
                +`\n6. 16-08-2019 - ${repaymentsList[5].Amount} RwF`
                +`\n7. 05-06-2019 - ${repaymentsList[6].Amount} RwF`
                +`\n8. 06-05-2019 - ${repaymentsList[7].Amount} RwF`
                +'\n99. Continue'
            );        
        });
        it('should show the error message if provided', () => {
            const erorMessage = 'Something is wrong\n';
            list(repaymentsList,1, erorMessage);
            expect(sayText).toHaveBeenLastCalledWith(
                erorMessage +'Select a payment for details:'
                +`\n1. 20-05-2020 - ${repaymentsList[0].Amount} RwF`
                +`\n2. 05-05-2020 - ${repaymentsList[1].Amount} RwF`
                +`\n3. 04-03-2020 - ${repaymentsList[2].Amount} RwF`
                +`\n4. 11-02-2020 - ${repaymentsList[3].Amount} RwF`
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
                +`\n1. 20-05-2020 - F${repaymentsList[0].Amount}`
                +`\n2. 05-05-2020 - F${repaymentsList[1].Amount}`
                +`\n3. 04-03-2020 - F${repaymentsList[2].Amount}`
                +`\n4. 11-02-2020 - F${repaymentsList[3].Amount}`
                +'\n99. Komeza'
            );
        });
        it('should list the second four if given a page number of 2 ', () => {
            list(repaymentsList,2);
            expect(sayText).toHaveBeenLastCalledWith(
                'Hitamo ubwishyu uhabwe ubusobanuro burambuye:'
                +`\n5. 05-02-2020 - F${repaymentsList[4].Amount}`
                +`\n6. 16-08-2019 - F${repaymentsList[5].Amount}`
                +`\n7. 05-06-2019 - F${repaymentsList[6].Amount}`
                +`\n8. 06-05-2019 - F${repaymentsList[7].Amount}`
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
                +`\n1. 20-05-2020 - KES ${repaymentsList[0].Amount}`
                +`\n2. 05-05-2020 - KES ${repaymentsList[1].Amount}`
                +`\n3. 04-03-2020 - KES ${repaymentsList[2].Amount}`
                +`\n4. 11-02-2020 - KES ${repaymentsList[3].Amount}`
                +'\n99. Endelea'
            );
        });
        it('should list the second four if given a page number of 2 ', () => {
            list(repaymentsList,2);
            expect(sayText).toHaveBeenLastCalledWith(
                'Chagua rekodi ya malipo kwa maelezo zaidi:'
                +`\n5. 05-02-2020 - KES ${repaymentsList[4].Amount}`
                +`\n6. 16-08-2019 - KES ${repaymentsList[5].Amount}`
                +`\n7. 05-06-2019 - KES ${repaymentsList[6].Amount}`
                +`\n8. 06-05-2019 - KES ${repaymentsList[7].Amount}`
                +'\n99. Endelea'
            );        
        });
        
    });
});

const singleRepayment = {
    'RepaymentId': '2534504906',
    'RepaymentDate': '20/05/2020 20:27:03',
    'Season': '2020',
    'Amount': 2001.0000,
    'PaidFrom': '0787117739'
};
const repaymentsList = [
    singleRepayment,
    {
        'RepaymentId': '2474515444',
        'RepaymentDate': '05/05/2020 16:16:56',
        'Season': '2020',
        'Amount': 2002.0000,
        'PaidFrom': '0787428878'
    },
    {
        'RepaymentId': '2285699969',
        'RepaymentDate': '04/03/2020 20:29:54',
        'Season': '2020',
        'Amount': 2003.0000,
        'PaidFrom': '663565'
    },
    {
        'RepaymentId': '2233627731',
        'RepaymentDate': '11/02/2020 21:11:39',
        'Season': '2020',
        'Amount': 2004.0000,
        'PaidFrom': '788926'
    },
    {
        'RepaymentId': '2219628297',
        'RepaymentDate': '05/02/2020 19:36:25',
        'Season': '2020',
        'Amount': 2005.0000,
        'PaidFrom': '594206'
    },
    {
        'RepaymentId': '1877459374',
        'RepaymentDate': '16/08/2019 20:56:53',
        'Season': '2020',
        'Amount': 2006.0000,
        'PaidFrom': '0787784673'
    },
    {
        'RepaymentId': '1736415567',
        'RepaymentDate': '05/06/2019 08:54:32',
        'Season': '2019',
        'Amount': 2007.0000,
        'PaidFrom': '0786394610'
    },
    {
        'RepaymentId': '1672889041',
        'RepaymentDate': '06/05/2019 22:26:21',
        'Season': '2019',
        'Amount': 2008.0000,
        'PaidFrom': '0787746931'
    },
    {
        'RepaymentId': '1567436959',
        'RepaymentDate': '17/03/2019 22:50:29',
        'Season': '2019',
        'Amount': 2009.0000,
        'PaidFrom': '0787418369'
    },
    {
        'RepaymentId': '1496045072',
        'RepaymentDate': '10/02/2019 18:05:58',
        'Season': '2019',
        'Amount': 2010.0000,
        'PaidFrom': '0782321660'
    },
    {
        'RepaymentId': '8483197187',
        'RepaymentDate': '10/01/2019 18:27:50',
        'Season': '2019',
        'Amount': 2011.0000,
        'PaidFrom': '0722238622'
    },
    {
        'RepaymentId': '1262988984',
        'RepaymentDate': '07/10/2018 21:01:53',
        'Season': '2019',
        'Amount': 2012.0000,
        'PaidFrom': '225966'
    },
    {
        'RepaymentId': '1144554663',
        'RepaymentDate': '30/07/2018 21:55:18',
        'Season': '2019',
        'Amount': 2013.0000,
        'PaidFrom': '112658'
    }
];