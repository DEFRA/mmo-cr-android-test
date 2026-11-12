import { Then, When } from '@wdio/cucumber-framework';
import type { DataTable } from '@wdio/cucumber-framework';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import catchAreaPage from '../page-objects/catchAreaPage';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import catchSubAreaPage from '../page-objects/catchSubAreaPage';
import gearMeasurementPage from '../page-objects/gearMeasurementPage';
import gearPage from '../page-objects/gearPage';
import submissionSuccessPage from '../page-objects/submissionSuccessPage';
import tripEndDatePage from '../page-objects/tripEndDatePage';
import tripStartDatePage from '../page-objects/tripStartDatePage';
import tripTodayPage from '../page-objects/tripTodayPage';
import { logInfo } from '../common/logger';
import { formatDate } from '../common/dateHelper';

function dateFromPhrase(phrase: string) {
    const date = new Date();
    if (phrase !== 'today') {
        date.setDate(date.getDate() - Number.parseInt(phrase, 10));
    }
    return formatDate(date);
}

When('I start a catch record', async () => {
    await androidFlowNavigator.startCatchRecord();
});

When('I select vessel {string}', async (vessel: string) => {
    await androidFlowNavigator.selectVessel(vessel);
});

When(/^I enter a trip start date of (today|\d+ days? ago)$/, async (when: string) => {
    const { day, month, year } = dateFromPhrase(when);
    await tripTodayPage.heading.waitForDisplayed();
    await tripTodayPage.selectNo();
    await tripStartDatePage.heading.waitForDisplayed();
    await tripStartDatePage.enterDateAndContinue(day, month, year);
});

When(/^I enter a trip end date of (today|\d+ days? ago)$/, async (when: string) => {
    const { day, month, year } = dateFromPhrase(when);
    await tripEndDatePage.heading.waitForDisplayed();
    await tripEndDatePage.enterDateAndContinue(day, month, year);
});

When('I select a trip for today', async () => {
    await androidFlowNavigator.selectTripDates(true);
});

When(
    'I select departure port {string} and return port {string}',
    async (departurePort: string, returnPort: string) => {
        await androidFlowNavigator.selectPorts(departurePort, returnPort);
    },
);

When(
    'I select gear {string} with mesh size {int} and {int} shots',
    async (gear: string, meshSize: number, shots: number) => {
        await androidFlowNavigator.selectGear(gear, meshSize, shots);
    },
);

When('I select catch area {string}', async (area: string) => {
    await androidFlowNavigator.selectAreas(area);
});

When(
    'I select catch area {string} with sub area {string}',
    async (area: string, subArea: string) => {
        await androidFlowNavigator.selectAreas(area, subArea);
    },
);

When('I search and select gear {string}', async (gear: string) => {
    await gearPage.heading.waitForDisplayed();
    await gearPage.searchSelectAndContinue(gear, gear);
});

When('I enter mesh size {string}', async (size: string) => {
    await gearMeasurementPage.heading.waitForDisplayed();
    await gearMeasurementPage.enterMeshSizeAndContinue(size);
});

When('I replace the mesh size with {string}', async (size: string) => {
    const inputField = $('//android.widget.EditText');
    await inputField.clearValue();
    await inputField.setValue(size);
    await $(
        '//android.widget.Button[contains(@text, "Continue") or contains(@text, "Save")]',
    ).click();
});

Then('the catch area map is displayed', async () => {
    await catchAreaPage.heading.waitForDisplayed();
    await expect(catchAreaPage.map).toBeDisplayed();
});

When('I choose the "Other" catch area', async () => {
    await catchAreaPage.clickOtherAndContinue();
});

Then('the catch sub area screen is displayed', async () => {
    await catchSubAreaPage.scrollToTop();
    await expect(catchSubAreaPage.heading).toBeDisplayed();
});

When('I select species with the following weights:', async (table: DataTable) => {
    const rows = table.hashes();
    if (rows.length !== 1) {
        throw new Error(`Expected one species weights row, received ${rows.length}`);
    }

    const row = rows[0];
    if (!row) {
        throw new Error('Species weights table must include one data row');
    }

    const { species, retained, 'below minimum': belowMin, discarded } = row;
    if (!species || !retained || !belowMin || !discarded) {
        throw new Error(
            'Species weights table must include species, retained, below minimum, and discarded',
        );
    }

    await androidFlowNavigator.selectSpecies(species, retained, belowMin, discarded);
});

When(/^I select (a|no) delayed landing$/, async (choice: string) => {
    await androidFlowNavigator.selectDelayedLanding(choice === 'a');
});

When('I accept and submit the catch record', async () => {
    await catchRecordSummaryPage.acceptAndSubmit();
});

When('I view my records', async () => {
    await submissionSuccessPage.clickViewRecords();
});

Then('the catch record summary is displayed', async () => {
    await expect(catchRecordSummaryPage.heading).toBeDisplayed();
});

Then('the summary shows {string} as {string}', async (field: string, value: string) => {
    expect(await catchRecordSummaryPage.getFieldValue(field)).toEqual(value);
});

Then('the submission success screen is displayed', async () => {
    await expect(submissionSuccessPage.heading).toBeDisplayed();
});

Then('the offline banner is displayed', async () => {
    expect(await submissionSuccessPage.isOfflineBannerDisplayed()).toBe(true);
});

Then('a record reference is shown', async () => {
    const referenceId = await submissionSuccessPage.getRecordReference();
    expect(referenceId).toBeTruthy();
    logInfo(`Catch record reference: ${referenceId}`);
});

Then('the record is submitted once the late submission warning is acknowledged', async () => {
    const submitButton = $('//android.widget.Button[contains(@text, "Submit")]');
    if (await submitButton.isDisplayed()) {
        await submitButton.click();
        await expect(submissionSuccessPage.heading).toBeDisplayed();
    }
});

Then('a record with status {string} is displayed', async (status: string) => {
    // Sync after reconnecting can take a few seconds.
    await expect($(`//android.widget.TextView[@text="${status}"]`)).toBeDisplayed({
        wait: 15000,
    });
});
