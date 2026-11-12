import { defineParameterType } from '@wdio/cucumber-framework';

// Inline literal regex so the Cucumber VS Code extension can statically resolve {page} steps.
// Keep in sync with the keys in pages.ts.
defineParameterType({
    name: 'page',
    regexp: /catch record summary|submission success|gear measurement|selected species|delayed landing|trip start date|catch sub area|departure port|selected gears|select vessel|trip end date|return port|catch area|trip today|sign in|species|gear|home/,
});
