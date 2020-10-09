const batch3ResponseHandler = require('./batch3ResponseHandler');
const batch4ResponseHandler = require('./batch4ResponseHandler');

describe('batch 3 messages response handler', () => {
    it('should send all 10 batch 4 messages once the user responds to the batch 3 messages', () => {
        var lang = 'en-ke';
        contact.phone_number = '0780475911';
        var batch2Handler = batch3ResponseHandler.getHandler(lang);
        batch2Handler();
        expect(project.sendMulti).toHaveBeenCalledWith({'messages': 
        [{'content': 'The best way to create organic matter is composting. Compost is a mixture of soil, leaves, stalks, other plant material and animal manure',
            'priority': 2,
            'to_number': '0780475911'}, 
        {'content': 'Compost mixture is full of great food for your plants that will enable you to have great harvests. Use as much compost as possible!', 
            'priority': 2, 
            'to_number': '0780475911'},
        {'content': 'To create compost piles you will need maize stalks, green materials like green leaves and grass, cow or chicken manure and urine and water.',
            'priority': 2,
            'to_number': '0780475911'}, 
        {'content': '1. Cut up maize stalks as much as possible.\n2. Use the chopped stalks to create the first layer of your row of compost (your waist height).',
            'priority': 2, 'to_number': '0780475911'}, 
        {'content': '3. Add as much green plant material (fresh grass, green leaves, weeds, etc.) to the rows as possible. This speeds up decomposition.',
            'priority': 2,
            'to_number': '0780475911'}, 
        {'content': '4. Add as much cow or chicken manure and urine as possible to your rows of compost.',
            'priority': 2,
            'to_number': '0780475911'}, 
        {'content': '5. Finally, cover the pile with a thin layer (half a thumb length) of good soil to stop the rain from washing the compost away',
            'priority': 2, 
            'to_number': '0780475911'},
        {'content': '6. Water until there is good moisture in the middle of the pile (it should always be moist but not wet).',
            'priority': 2, 'to_number': '0780475911'}, 
        {'content': 'Turn your compost pile at least once a month. It is ready to use when it is dark brown, there is a smell of fresh soil and no green leaves.',
            'priority': 2, 'to_number': '0780475911'},
        {'content': 'Once ready, you can mix your compost into the field at second ploughing. Always use both compost and fertiliser for the biggest harvest!!', 
            'priority': 2, 'to_number': '0780475911'}]});
        expect(waitForResponse).toHaveBeenCalledWith(batch4ResponseHandler.handlerName);
    });
});
