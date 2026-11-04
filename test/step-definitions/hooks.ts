import { After, Before } from '@wdio/cucumber-framework';
import SignInPage from '../page-objects/signInPage';
import NetworkHelper from '../helpers/networkHelper';

Before(async () => {
    await SignInPage.openApp();
});

After(async () => {
    await SignInPage.close();
});

// After hooks run in reverse order, so this restores the network before the app is closed.
After({ tags: '@offline' }, async () => {
    await NetworkHelper.goOnline();
});
