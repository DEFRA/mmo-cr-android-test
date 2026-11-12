import { Given, Then, When } from '@wdio/cucumber-framework';
import type { DataTable } from '@wdio/cucumber-framework';
import signInPage from '../page-objects/signInPage';
import homePage from '../page-objects/homePage';
import { BasePage } from '../page-objects/basePage';
import { getAndroidTestCredentials } from '../helpers/testCredentials';
import NetworkHelper from '../helpers/networkHelper';

const currentPage = new BasePage();

function textContainingAnyOf(texts: string[]) {
    const conditions = texts.map((text) => `contains(@text, "${text}")`).join(' or ');
    return $(`//android.widget.TextView[${conditions}]`);
}

// UiScrollable.scrollIntoView rewinds to the top before searching, so it finds messages above or below.
async function scrollToTextContainingAnyOf(texts: string[]) {
    for (const text of texts) {
        const element = await $(
            `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("${text.replace(/"/g, '\\"')}"))`,
        );
        if (await element.isExisting()) {
            return;
        }
    }
}

Given('I am signed in', async () => {
    const { email, password } = getAndroidTestCredentials();
    await signInPage.signIn(email, password);
    await homePage.heading.waitForDisplayed({ timeout: 15000 });
});

Given('I am offline', async () => {
    await NetworkHelper.goOffline();
});

When('I go back online', async () => {
    await NetworkHelper.goOnline();
});

When('I go back {int} time(s)', async (times: number) => {
    for (let i = 0; i < times; i++) {
        await driver.back();
    }
});

When('I save and continue', async () => {
    await currentPage.saveAndContinue();
});

Then('the home screen is displayed', async () => {
    await expect(homePage.heading).toBeDisplayed();
});

Then(
    /^a message containing "([^"]*)"(?: or "([^"]*)")? is displayed$/,
    async (first: string, second?: string) => {
        const texts = second ? [first, second] : [first];
        await scrollToTextContainingAnyOf(texts);
        await expect(textContainingAnyOf(texts)).toBeDisplayed();
    },
);

Then('a message containing any of these is displayed:', async (table: DataTable) => {
    const texts = table.raw().flat();
    await scrollToTextContainingAnyOf(texts);
    await expect(textContainingAnyOf(texts)).toBeDisplayed();
});
