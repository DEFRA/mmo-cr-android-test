import { defineParameterType } from '@wdio/cucumber-framework';

defineParameterType({
    name: 'page',
    regexp: /catch record summary|submission success|gear measurement|selected species|delayed landing|trip start date|catch sub area|departure port|selected gears|select vessel|trip end date|return port|catch area|trip today|sign in|species|gear|home/,
});
