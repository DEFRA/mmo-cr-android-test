import { Given, Then, When } from '@wdio/cucumber-framework';
import type { DataTable } from '@wdio/cucumber-framework';
import homePage from '../page-objects/homePage';
import signInPage from '../page-objects/signInPage';
import { BasePage } from '../page-objects/basePage';
import { getAndroidTestCredentials } from '../helpers/testCredentials';
import NetworkHelper from '../helpers/networkHelper';
import { getPage, type PageName } from '../support/pages';

const currentPage = new BasePage();

function textContainingAnyOf(texts: string[]) {
    const conditions = texts.map((text) => `contains(@text, "${text}")`).join(' or ');
    return $(`//android.widget.TextView[${conditions}]`);
}

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
    await browser.waitUntil(
        async () =>
            (await homePage.heading.isDisplayed()) || (await signInPage.heading.isDisplayed()),
        {
            timeout: 15000,
            timeoutMsg: 'Neither the home screen nor the sign-in screen was displayed.',
        },
    );

    if (!(await homePage.heading.isDisplayed())) {
        const { email, password } = getAndroidTestCredentials();
        await signInPage.signIn(email, password);
    }

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

async function assertOnPage(name: PageName) {
    const { page, heading, scrollToHeading } = getPage(name);
    if (scrollToHeading) {
        await page.scrollUntilDisplayed(heading());
    }
    await expect(heading()).toBeDisplayed();
}

Given('I am on the {page} page', assertOnPage);

Then('I should be on the {page} page', assertOnPage);

Then('I should see a validation error on the {page} page', async (name: PageName) => {
    const { validationError } = getPage(name);
    if (!validationError) {
        throw new Error(`No validation error is defined for the ${name} page`);
    }
    await expect(validationError()).toBeDisplayed();
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
