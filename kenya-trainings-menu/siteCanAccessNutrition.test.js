const siteCanAccessNutrition = require('./siteCanAccessNutrition');
const mockClient = {
    DistrictName: 'Duka',
    SiteName: 'Nyegezi'
};
describe('Check whether a given client\'s site is not on the list of prohibited sites', () => {
    it('it should return true if the client site is not prohibited', () => {
        const cursorMock = {hasNext: jest.fn(() => false)};
        const tableMock = {queryRows: jest.fn(() => cursorMock)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(tableMock);

        const result = siteCanAccessNutrition('districtsTableName', mockClient);
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith('districtsTableName');
        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {'1af_district': 'Duka', 'site': 'Nyegezi'}});
        expect(result).toBeTruthy();
    });

    it('it should return false if the client site is on prohibited sites', () => {
        const cursorMock = {hasNext: jest.fn(() => true)};
        const tableMock = {queryRows: jest.fn(() => cursorMock)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(tableMock);

        const result = siteCanAccessNutrition('districtsTableName', mockClient);
        expect(result).toBeFalsy();
    });

    it('it should return false if no client is passed', () => {
        const result = siteCanAccessNutrition('districtsTableName', null);
        expect(result).toBeFalsy();
    });
});