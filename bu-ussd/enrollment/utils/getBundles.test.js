const getBundles = require('./getBundles');

describe('get bundles', () => {
    beforeAll(() => {
        service.vars.bundles_table_id = '14sjdhf8247h7wh29aj';
    });
    const mockTable = {queryRows: jest.fn()};
    const mockCursor = {hasNext: jest.fn(), next: jest.fn()};
    jest.spyOn(project, 'initDataTableById').mockReturnValue(mockTable);
    jest.spyOn(mockTable, 'queryRows').mockReturnValue(mockCursor);
    it('should return the bundles from table', () => {
        mockCursor.hasNext.mockReturnValueOnce(true)
            .mockReturnValueOnce(true)
            .mockRejectedValueOnce(true)
            .mockReturnValueOnce(false);

        mockCursor.next.mockReturnValueOnce({vars: {
            'bundle_name_en-bu': 'Biolite',
            'input_name_en-bu': 'Bio-light',
            bundle_id: 123,
            bundle_input_id: '432',
            max: 92,
            price: 1200.00,
            unit: 'unit'
        }})
            .mockReturnValueOnce({vars: {
                'bundle_name_en-bu': 'Maize',
                'input_name_en-bu': 'Maiz-trio',
                bundle_id: 124,
                bundle_input_id: '232',
                max: 99,
                price: 200.00,
                unit: 'kg'
            }})
            .mockReturnValueOnce({vars: {
                'bundle_name_en-bu': 'Biolite',
                'input_name_en-bu': 'Bio-short',
                bundle_id: 123,
                bundle_input_id: '373',
                max: 92,
                price: 1203.00,
                unit: 'unit'
            }});
        var bundles = getBundles('112435', 'en-bu');
        expect(mockTable.queryRows).toHaveBeenCalledWith({'vars': {'d112435': '1', 'offered': '1'}});
        expect(bundles).toEqual([
            {'bundleId': 123,
                'bundleInputs': [
                    {
                        'bundleInputId': 432, 
                        'inputName': 'Bio-light',
                        'max': 92, 
                        'price': 1200,
                        'unit': 'unit'
                    }, 
                    {'bundleInputId': 373,
                        'inputName': 'Bio-short',
                        'max': 92, 'price': 1203, 
                        'unit': 'unit'
                    }], 
                'bundleName': 'Biolite'
            }, 
            {
                'bundleId': 124,
                'bundleInputs': [
                    {
                        'bundleInputId': 232,
                        'inputName': 'Maiz-trio',
                        'max': 99,
                        'price': 200, 
                        'unit': 'kg'
                    }], 
                'bundleName': 'Maize'
            }]);
    });
});
