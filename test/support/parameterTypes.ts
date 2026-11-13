import { defineParameterType } from '@wdio/cucumber-framework';
import { pageNames } from './pages';

// Longest names first so "selected species" is matched before "species".
const pagePattern = [...pageNames].sort((a, b) => b.length - a.length).join('|');

defineParameterType({
    name: 'page',
    regexp: new RegExp(pagePattern),
});
