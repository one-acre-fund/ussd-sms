const createMenu = require('./createMenu');
const siteCanAccessNutrition = require('./siteCanAccessNutrition');

jest.mock('./siteCanAccessNutrition');

const screens = {
    'en-ke': {'1': '1:Tree Transplanting\n' +
    '2:Tree Bag Planting\n' +
    '3:Tree Socketing\n' +
    '4:Sorghum Weeding\n' +
    '5:Maize Topdress\n' +
    '6:Maize Intercrop\n' +
    '7:Maize Harvest\n' +
    '0:MORE',
    '2': '8:Pest Mitigation\n' +
    '9:Vegetables\n' + 
    '10:Tatu Hadi Tatu\n' +
    '11:Soil Fertility\n' +
    '12:Dietary Diversity (Nutrition)\n',
    },
    'sw': {'1': '1:Kupanda Miti\n' +
    '2:Kupanda miti mifukoni\n' +
    '3:Socketing Miti\n' +
    '4:Kupalilia Wimbi\n' +
    '5:TopDress\n' +
    '6:Kupanda Mahindi/Maharagwe\n' +
    '0:Endelea',
    '2': '7:Kuvuna Mahindi\n' +
    '8:Wadudu/Magonjwa\n' +
    '9:Kupanda Mboga\n' + 
    '10:Tatu Hadi Tatu\n' +
    '11:Udongo bora ulio na afya na rotuba\n0:Endelea', 
    '3': '12:Lishe Bora\n'
    }
};

const screensWhenDistrictIsRestricted = {
    'en-ke': {'1': '1:Tree Transplanting\n' +
    '2:Tree Bag Planting\n' +
    '3:Tree Socketing\n' +
    '4:Sorghum Weeding\n' +
    '5:Maize Topdress\n' +
    '6:Maize Intercrop\n' +
    '7:Maize Harvest\n' +
    '0:MORE',
    '2': '8:Pest Mitigation\n' +
    '9:Vegetables\n' + 
    '10:Tatu Hadi Tatu\n' +
    '11:Soil Fertility\n'
    },
    'sw': {'1': '1:Kupanda Miti\n' +
    '2:Kupanda miti mifukoni\n' +
    '3:Socketing Miti\n' +
    '4:Kupalilia Wimbi\n' +
    '5:TopDress\n' +
    '6:Kupanda Mahindi/Maharagwe\n' +
    '0:Endelea',
    '2': '7:Kuvuna Mahindi\n' +
    '8:Wadudu/Magonjwa\n' +
    '9:Kupanda Mboga\n' + 
    '10:Tatu Hadi Tatu\n' +
    '11:Udongo bora ulio na afya na rotuba\n'
    }
};

describe.each(['en-ke', 'sw'])('create trainings menu', (lang) => {
    it('should return the screens and menu options values', () => {
        siteCanAccessNutrition.mockReturnValueOnce(true);
        var result = createMenu(lang);
        expect(result.screens).toEqual(screens[lang]);
        expect(result.optionValues).toEqual({'10:': 'tatu_hadi_tatu', '11:': 'soil_training', '12:': 'nutrition_training', '1:': 'tree_transplanting', '2:': 'tree_bag_planting', '3:': 'tree_socketing', '4:': 'sorghum_weeding', '5:': 'maize_topdress', '6:': 'maize_intercorp', '7:': 'maize_harvest', '8:': 'pest_mitigation', '9:': 'vegetables'});
    });

    it('should skip the nutrition training if the client site is restricted', () => {
        siteCanAccessNutrition.mockReturnValueOnce(false);
        var clientMock = {
            DistrictName: 'Duka',
            SiteName: 'NgoroNgoro'
        };
        var result = createMenu(lang,  'districtsTableName', clientMock);
        expect(result.screens).toEqual(screensWhenDistrictIsRestricted[lang]);
        expect(result.optionValues).toEqual({'10:': 'tatu_hadi_tatu', '11:': 'soil_training', '1:': 'tree_transplanting', '2:': 'tree_bag_planting', '3:': 'tree_socketing', '4:': 'sorghum_weeding', '5:': 'maize_topdress', 
            '6:': 'maize_intercorp', '7:': 'maize_harvest', '8:': 'pest_mitigation', '9:': 'vegetables'});
    });
});