const trainingsTriggeredText = require('./TrainingTriggeredText');

describe('displaying a wecome text before trainings start', () => {
    it('should display the message', () => {
        trainingsTriggeredText('Robben', 'en');
        expect(sayText).toHaveBeenCalledWith('Congratulations Robben on your first step towards becoming a smart farmer! A training SMS has been sent to your phone. Start your learning journey now!');
    });
});
