const splitLongMenu = require('./splitLongMenu');
describe('account_number_handler', () => {

    var longMenu = 'S----e N-----------a commandes pour'+
            'Mais PAN53 : 1 kg\n'+
            'UREE : 1 kg\n'+
            'FOMI Imbura : 1 kg\n'+
            'SKP 300 : 1 unit\n'+
            'Chaux : 1 kg\n'+
            'FOMI Bagara: 2 unit\n'+
            'KCL : 1 kg\n'+
            'Telephone Itel 5615: 1unit\n'+
            'Cuisinieres: 2unit\n'+
            'FOMI Totahaza: 2 units\n';
            
    var next = '77) continue'; 
    var optionMenu = '1) Add another product\n2) Change Order\n3) Confirm';
    beforeAll(()=>{});
    it('should return the first screen with continue',()=>{
        const menus = splitLongMenu(longMenu,next,optionMenu);
        expect(menus[1]).toEqual('S----e N-----------a commandes pour'+
        'Mais PAN53 : 1 kg\nUREE : 1 kg\n'+
        'FOMI Imbura : 1 kg\n'+
        'SKP 300 : 1 unit\n'+
        'Chaux : 1 kg\n'+
        'FOMI Bagara: 2 '+
        '\n77) continue');
    });
    it('should return the last screen with options',()=>{
        const menus = splitLongMenu(longMenu,next,optionMenu);
        expect(menus[2]).toEqual(' unit\n'+
        'KCL : 1 kg\n'+
        'Telephone Itel 5615: 1unit\n'+
        'Cuisinieres: 2unit\n'+
        'FOMI Totahaza: 2 units\n'+
        '1) Add another product\n'+
        '2) Change Order\n'+
        '3) Confirm');
    });
});