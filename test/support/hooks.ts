import { After, Before } from '@wdio/cucumber-framework';
import signInPage from '../page-objects/signInPage';
import NetworkHelper from '../helpers/networkHelper';

Before(async () => {
    await signInPage.openApp();
});

After(async () => {
    await signInPage.close();
});

// Always restore connectivity so an offline scenario cannot leave airplane mode on for the next one.
After(async () => {
    await NetworkHelper.goOnline();
});
