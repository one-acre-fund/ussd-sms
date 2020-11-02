const createMenu = require('./createMenu');
const siteCanAccessNutrition = require('./siteCanAccessNutrition');
const getOptions = require('./options');

jest.mock('./siteCanAccessNutrition');
jest.mock('./options');

const expectedScreens = {
    'en-ke': {
        '1': '1:Soil Fertility\n2:Tree Transplanting\n3:Tree Bag Planting\n4:Tree Socketing\n5:Sorghum Weeding\n6:Maize Topdress\n7:Maize Intercrop\n0:MORE',
        '2': '8:Maize Harvest\n'
    },
    'sw': {
        '1': '1:Udongo bora ulio na afya na rotuba\n2:Kupanda Miti\n3:Kupanda miti mifukoni\n4:Socketing Miti\n5:Kupalilia Wimbi\n6:TopDress\n0:Endelea',
        '2': '7:Kupanda Mahindi/Maharagwe\n8:Kuvuna Mahindi\n'
    }
};

const expectdOptionValues = {
    '1': 'soil_training',
    '2': 'tree_transplanting',
    '3': 'tree_bag_planting',
    '4': 'tree_socketing',
    '5': 'sorghum_weeding',
    '6': 'maize_topdress',
    '7': 'maize_intercorp',
    '8': 'maize_harvest',
};

describe.each(['en-ke', 'sw'])('create trainings menu', (lang) => {
    beforeEach(() => {
        getOptions.mockReturnValue({
            'soil_training': {
                'en-ke': 'Soil Fertility\n',
                'sw': 'Udongo bora ulio na afya na rotuba\n',
                enabled: true
            },
            'tree_transplanting': {
                'en-ke': 'Tree Transplanting\n',
                'sw': 'Kupanda Miti\n',
                enabled: true
            },
            'tree_bag_planting': {
                'en-ke': 'Tree Bag Planting\n',
                'sw': 'Kupanda miti mifukoni\n',
                enabled: true
            },
            'tree_socketing': {
                'en-ke': 'Tree Socketing\n',
                'sw': 'Socketing Miti\n',
                enabled: true
            },
            'sorghum_weeding': {
                'en-ke': 'Sorghum Weeding\n',
                'sw': 'Kupalilia Wimbi\n',
                enabled: true
            },
            'maize_topdress': {
                'en-ke': 'Maize Topdress\n',
                'sw': 'TopDress\n',
                enabled: true
            },
            'maize_intercorp': {
                'en-ke': 'Maize Intercrop\n',
                'sw': 'Kupanda Mahindi/Maharagwe\n',
                enabled: true
            },
            'maize_harvest': {
                'en-ke': 'Maize Harvest\n',
                'sw': 'Kuvuna Mahindi\n',
                enabled: true
            },
            'pest_mitigation': {
                'en-ke': 'Pest Mitigation\n',
                'sw': 'Wadudu/Magonjwa\n',
                enabled: false
            },
            'vegetables': {
                'en-ke': 'Vegetables\n',
                'sw': 'Kupanda Mboga\n',
                enabled: false
            },
        });
    });

    it('should return the screens and menu options values', () => {
        siteCanAccessNutrition.mockReturnValueOnce(true);
        var result = createMenu(lang);

        expect(result.screens).toEqual(expectedScreens[lang]);
        expect(result.optionValues).toEqual(expectdOptionValues);
    });

    it('should skip the nutrition training if the client site is restricted', () => {
        siteCanAccessNutrition.mockReturnValueOnce(false);
        var clientMock = {
            DistrictName: 'Duka',
            SiteName: 'NgoroNgoro'
        };

        var result = createMenu(lang, 'districtsTableName', clientMock);
        expect(result.screens).toEqual(expectedScreens[lang]);
        expect(result.optionValues).toEqual(expectdOptionValues);
    });
});
