const nutritionTraining = require('./nutritionTraining');
const batch1smsResponseHandler = require('./responseHandlers/batch1smsResponseHandler');

var messages = {
    'en-ke': ['(1/6)Today we will learn about balanced diets. Eating like this prevents anemia and improves the energy and health of the whole family!',
        '(2/6) Which of the following foods has the most iron?\n' + 'a. Beans\n' +
        'b. Ugali\n' +
        'c. Rice\n' +
        'Reply with either a,b, or c'],
    'sw': ['(1/6) Leo tutasoma juu ya lishe bora.Lishe bora huzuia upungufu wa damu mwilini/ damu dhaifu na inaboresha nguvu na afya ya familia nzima!',
        '(2/6)Ni ipi kati ya vyakula vifuatavyo vina madini zaidi ya kuongeza damu mwilini?\n' + 'a. Maharagwe\n' +
       'b. Ugali\n' +
       'c. Mchele\n' +
       'Jibu na  a, b, au c']
};

describe.each(['en-ke', 'sw'])('nutrition training using (%s)', (lang) => {
    it('should send initial message for nutrition training', () => {
        jest.spyOn(project, 'sendMulti');
        contact.phone_number = '0788336572';
        nutritionTraining(lang);
        expect(project.scheduleMessage).toHaveBeenNthCalledWith(1, {'content': messages[lang][0], 'start_time_offset': 0, 'to_number': '0788336572'});
        expect(waitForResponse).toHaveBeenCalledWith(batch1smsResponseHandler.handlerName);
    });

    it('should send the second message after 15 seconds', () => {
        jest.spyOn(project, 'sendMulti');
        contact.phone_number = '0788336572';
        nutritionTraining(lang);
        expect(project.scheduleMessage).toHaveBeenCalledWith({'content': messages[lang][1], 'start_time_offset': 15, 'to_number': '0788336572'});
        expect(waitForResponse).toHaveBeenCalledWith(batch1smsResponseHandler.handlerName);
    });
});