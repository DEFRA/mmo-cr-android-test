import { After, Before } from '@wdio/cucumber-framework';
import { BasePage } from '../page-objects/base/basePage';
import NetworkHelper from '../helpers/networkHelper';

const app = new BasePage();

Before(async () => {
    await app.openApp();
});

After(async () => {
    await app.close();
});

After({ tags: '@offline' }, async () => {
    await NetworkHelper.goOnline();
});
