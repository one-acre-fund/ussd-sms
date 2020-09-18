const nationalIdInputHandler = require('./nationalIdInputHandler');

describe.each(['en-ke', 'sw'])('national id input handler', (lang) => {
    it.each(['12345678', '1234567'])('should prompt the user for comfirmation once the national id is valid.(8 or 7 digits) using (%s)', (nid) => {
        const nationalIdHandler = nationalIdInputHandler.getHandler(lang);
        const message = {
            'sw': `Ingiza nambari ${nid} ya kitamburisho. Ingiza\n1) Kudhibitisha\n2) Kujaribu tena.`,
            'en-ke': `You entered ${nid} ID\n1) To confirm\n2) To try again.`
        };
        nationalIdHandler(nid);
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(state.vars.duka_client_nid).toEqual(nid);
        expect(promptDigits).toHaveBeenCalledWith('duka_client_registration_nationalId_handler_confirm');
    });

    it('should reprompt the user for the national id once the id is invalid', () => {
        const nationalIdHandler = nationalIdInputHandler.getHandler(lang);
        const message = {
            'en-ke': 'Enter client national ID\n',
            'sw': 'Ingiza nambari ya kitambulisho cha kitaifa cha mteja\n'
        };
        nationalIdHandler('cd3456ab');
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(nationalIdInputHandler.handlerName, {
            submitOnHash: false,
            maxDigits: 8
        });
    });
});