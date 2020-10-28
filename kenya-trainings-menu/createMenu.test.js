const createMenu = require('./createMenu');
const siteCanAccessNutrition = require('./siteCanAccessNutrition');

jest.mock('./siteCanAccessNutrition');

const screens = {
    'en-ke': {'1': '1:Soil Fertility\n',
    },
    'sw': {'1': '1:Udongo bora ulio na afya na rotuba\n'
    }
};

const screensWhenDistrictIsRestricted = {
    'en-ke': {'1': '1:Soil Fertility\n'
    },
    'sw': {'1': '1:Udongo bora ulio na afya na rotuba\n'
    }
};

describe.each(['en-ke', 'sw'])('create trainings menu', (lang) => {
    it('should return the screens and menu options values', () => {
        siteCanAccessNutrition.mockReturnValueOnce(true);
        var result = createMenu(lang);
        expect(result.screens).toEqual(screens[lang]);
        expect(result.optionValues).toEqual({'1:': 'soil_training'});
    });

    it('should skip the nutrition training if the client site is restricted', () => {
        siteCanAccessNutrition.mockReturnValueOnce(false);
        var clientMock = {
            DistrictName: 'Duka',
            SiteName: 'NgoroNgoro'
        };
        var result = createMenu(lang,  'districtsTableName', clientMock);
        expect(result.screens).toEqual(screensWhenDistrictIsRestricted[lang]);
        expect(result.optionValues).toEqual({'1:': 'soil_training'});
    });
});
