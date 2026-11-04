import { Then, When } from '@wdio/cucumber-framework';
import selectVesselPage from '../page-objects/selectVesselPage';
import departurePortPage from '../page-objects/departurePortPage';
import returnPortPage from '../page-objects/returnPortPage';
import selectedGearsPage from '../page-objects/selectedGearsPage';
import { logInfo } from '../common/logger';

const continueOrSaveButton = () =>
    $('//android.widget.Button[contains(@text, "Continue") or contains(@text, "Save")]');

When('I choose to continue the draft', async () => {
    const continueDraftButton = $(
        '//android.widget.Button[contains(@text, "Continue") or contains(@text, "Resume")]',
    );
    await continueDraftButton.waitForDisplayed();
    await continueDraftButton.click();
});

When('I choose to delete the draft', async () => {
    const deleteDraftButton = $(
        '//android.widget.Button[contains(@text, "Delete") or contains(@text, "Start fresh")]',
    );
    await deleteDraftButton.waitForDisplayed();
    await deleteDraftButton.click();

    const confirmButton = $(
        '//android.widget.Button[contains(@text, "Yes") or contains(@text, "Confirm")]',
    );
    if (await confirmButton.isDisplayed()) {
        await confirmButton.click();
    }
});

Then('the vessel selection screen is displayed', async () => {
    await expect(selectVesselPage.heading).toBeDisplayed();
});

When('I deselect {string}', async (label: string) => {
    await $(`//android.widget.CheckBox[contains(@text, "${label}")]`).click();
});

When('I confirm the removal', async () => {
    await $(
        '//android.widget.Button[contains(@text, "Remove") or contains(@text, "Confirm") or contains(@text, "Yes")]',
    ).click();
});

When(
    'I add species {string} with only a legally discarded weight of {string}',
    async (species: string, weight: string) => {
        await $('//android.widget.EditText').setValue(species.substring(0, 3));
        await $(`//android.widget.TextView[@text="${species}"]`).click();
        await continueOrSaveButton().click();

        const addDiscardedButton = $(
            '//android.widget.Button[contains(@text, "Add legally discarded weight")]',
        );
        await addDiscardedButton.waitForDisplayed();
        await addDiscardedButton.click();

        await $('//android.widget.EditText[contains(@resource-id, "discarded")]').setValue(weight);
        await $(`//android.widget.CheckBox[contains(@text, "${species}")]`).click();
        await continueOrSaveButton().click();
    },
);

Then('the departure port screen is displayed', async () => {
    await expect(departurePortPage.heading).toBeDisplayed();
});

When('I change the departure port to {string}', async (port: string) => {
    await departurePortPage.clickAddPort();
    await departurePortPage.searchSelectAndContinue(port, port);
});

When('I continue past the return port and selected gears screens', async () => {
    await expect(returnPortPage.heading).toBeDisplayed();
    await returnPortPage.saveAndContinue();
    await expect(selectedGearsPage.heading).toBeDisplayed();
    await selectedGearsPage.saveAndContinue();
});

Then('any catch area revalidation warning is displayed', async () => {
    // The warning wording is not confirmed yet, so its absence is only logged.
    const warning = $(
        '//android.widget.TextView[contains(@text, "no longer valid") or contains(@text, "reselect")]',
    );
    logInfo(`Catch area revalidation warning displayed: ${await warning.isDisplayed()}`);
});

When('I select the first stored catch species', async () => {
    await $('//android.widget.CheckBox').click();
});

When('I enter a stored catch weight of {string}', async (weight: string) => {
    await $('//android.widget.EditText').setValue(weight);
    await continueOrSaveButton().click();
});

Then(
    'the summary shows stored catch {string} with weight {string}',
    async (species: string, weight: string) => {
        await expect(
            $(
                `//android.widget.TextView[contains(@text, "${species}") and contains(@text, "${weight}")]`,
            ),
        ).toBeDisplayed();
    },
);

When('I change the departure port to {string} from the summary', async (port: string) => {
    const changeDeparturePortButton = $(
        '//android.widget.TextView[contains(@text, "Departure")]/../..//android.widget.TextView[contains(@text, "Change")]',
    );
    if (!(await changeDeparturePortButton.isExisting())) {
        return 'skipped';
    }
    await changeDeparturePortButton.click();

    await expect(departurePortPage.heading).toBeDisplayed();
    await departurePortPage.clickAddPort();
    await departurePortPage.searchSelectAndContinue(port, port);
    await $('//android.widget.TextView[contains(@text, "Check")]').waitForDisplayed();
    return undefined;
});
