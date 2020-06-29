This is a translator utility that we can reuse in many different place here's how it works. If You have the following translations
``` javascript
const exampleTranslations = {
    'simple': {
        en: 'Hi, Tester',
        sw: 'Niaje, Tester'
    },
    'another': {
        fr: 'bonjour',
        de: 'Guten tag'
    },
    'preferred-name-prompt': {
        en: 'Should I call you $firstName or $lastName',
        sw: 'Ninapaswa Kukuita $firstName au $lastName',
    }
};
```

you can create a translator out of it as follows
``` javascript
const createTranslator = require('./translator');
const translate = createTranslator(exampleTranslations)
```

and then get translations like this
```javascript
const englishText = translate('preferred-name-prompt','en',{ '$firstname': 'Peter', '$lastName': 'Parker'});
```