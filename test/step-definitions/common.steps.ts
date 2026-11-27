import { Given, Then, When } from '@wdio/cucumber-framework';
import homePage from '../page-objects/homePage';
import signInPage from '../page-objects/signInPage';
import { BasePage } from '../page-objects/base/basePage';
import { getAndroidTestCredentials } from '../helpers/testCredentials';
import NetworkHelper from '../helpers/networkHelper';
import { pageHeading, type PageName } from '../support/pages';
import { logStep } from '../common/logger';

const currentPage = new BasePage();

Given('I am signed in', async () => {
    const screen = await browser.waitUntil(
        async () => {
            if (await homePage.heading.isDisplayed()) {
                return 'home' as const;
            }
            if (await signInPage.heading.isDisplayed()) {
                return 'signIn' as const;
            }
            return false as const;
        },
        {
            timeout: 15000,
            timeoutMsg: 'Neither the home screen nor the sign-in screen was displayed.',
        },
    );

    if (screen === 'signIn') {
        const { email, password } = getAndroidTestCredentials();
        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });
    }
});

Given('I am offline', async () => {
    await NetworkHelper.goOffline();
    await expect(currentPage.offlineBannerLabel).toBeDisplayed({ wait: 10000 });
    await expect(currentPage.offlineBanner).toBeDisplayed();
});

When('I go back online', async () => {
    await NetworkHelper.goOnline();
    await currentPage.offlineBannerLabel.waitForDisplayed({
        timeout: 30000,
        reverse: true,
        timeoutMsg: 'Offline banner was still displayed 30s after going back online',
    });
    await expect(currentPage.offlineBanner).not.toBeDisplayed();
});

When('I save and continue', async () => {
    await currentPage.saveAndContinue();
});

When('I wait {int} seconds', async (seconds: number) => {
    logStep(`Waiting ${seconds} seconds`);
    await browser.pause(seconds * 1000);
});

Then('I should be on the {page} page', async (name: PageName) => {
    await expect(pageHeading(name)).toBeDisplayed();
});

Then(
    /^a message containing "([^"]*)"(?: or "([^"]*)")? is displayed$/,
    async (first: string, second?: string) => {
        const texts = second ? [first, second] : [first];
        await currentPage.scrollToTextContainingAnyOf(texts);
        await expect(currentPage.textContainingAnyOf(texts)).toBeDisplayed();
    },
);
