import { defineParameterType } from '@wdio/cucumber-framework';
import { pageNames, type PageName } from './pages';

// Regex literal (not built from pageNames) so the VS Code Cucumber extension can resolve {page};
// the transformer still restricts values to known pages.
defineParameterType({
    name: 'page',
    regexp: /[a-z][a-z ]*[a-z]/,
    transformer: (name: string): PageName => {
        if (!(pageNames as string[]).includes(name)) {
            throw new Error(`Unknown page "${name}". Known pages: ${pageNames.join(', ')}`);
        }
        return name as PageName;
    },
});
