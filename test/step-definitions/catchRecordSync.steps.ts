import { Given, Then, When } from '@wdio/cucumber-framework';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import NetworkHelper from '../helpers/networkHelper';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import homePage from '../page-objects/homePage';
import submissionSuccessPage from '../page-objects/submissionSuccessPage';
import { completedCatchRecordData, offlineCatchRecordData } from '../data/catchRecordSync.data';
import type { CatchRecordWorld } from '../support/world';

async function submitCompletedCatchRecord(data: typeof completedCatchRecordData) {
    await androidFlowNavigator.startCatchRecord();
    await androidFlowNavigator.selectVessel(data.vessel);
    await androidFlowNavigator.selectTripDates(data.tripToday);
    await androidFlowNavigator.selectPorts(data.ports.departure, data.ports.return);
    await androidFlowNavigator.selectGear(data.gear.name, data.gear.meshSize, data.gear.shots);
    await androidFlowNavigator.selectAreas();
    await androidFlowNavigator.selectSpecies(
        data.species.name,
        data.species.retainedWeight,
        data.species.belowMinimumWeight,
        data.species.discardedWeight,
    );
    await androidFlowNavigator.selectDelayedLanding(data.delayedLanding);
    await expect(catchRecordSummaryPage.heading).toBeDisplayed();
    await catchRecordSummaryPage.acceptAndSubmit();
}

async function createSubmittedCatchRecord() {
    await submitCompletedCatchRecord(completedCatchRecordData);
    await expect(submissionSuccessPage.heading).toBeDisplayed();
    await submissionSuccessPage.clickViewRecords();
    await homePage.waitForRecordWithStatus('Submitted');
}

async function createUnsentCatchRecord() {
    await NetworkHelper.goOffline();
    await submitCompletedCatchRecord(offlineCatchRecordData);
    await expect(submissionSuccessPage.offlineBanner).toBeDisplayed();
    await submissionSuccessPage.clickViewRecords();
    await homePage.waitForRecordWithStatus('Unsent');
}

export async function createDraftCatchRecord() {
    await androidFlowNavigator.startCatchRecord();
    await androidFlowNavigator.selectVessel(completedCatchRecordData.vessel);
    await driver.back();
    await driver.back();
    await expect(homePage.heading).toBeDisplayed();
}

When('I continue the draft catch record', async () => {
    await homePage.continueDraftRecord();
});

When('I delete the draft catch record', async function (this: CatchRecordWorld) {
    await homePage.goToHome();
    this.deletedDraftTripId = await homePage.deleteDraftRecord();
});

Then('the deleted draft catch record is not displayed', async function (this: CatchRecordWorld) {
    if (!this.deletedDraftTripId) {
        throw new Error('No draft catch record has been deleted in this scenario');
    }
    await expect(homePage.recordWithTripId(this.deletedDraftTripId)).not.toBeExisting();
});

When('I leave and reopen the application', async () => {
    await homePage.close();
    await homePage.openApp();
});

When('I minimise the app for {int} seconds', async (seconds: number) => {
    await driver.execute('mobile: backgroundApp', { seconds });
});

Given('I have a submitted catch record', async () => {
    await createSubmittedCatchRecord();
});

Given('I have a catch record awaiting sync', async () => {
    await createUnsentCatchRecord();
});

Given('I have a draft catch record', async () => {
    await createDraftCatchRecord();
});

Given('I have a catch record with status {string}', async (status: string) => {
    switch (status) {
        case 'Draft':
            await createDraftCatchRecord();
            break;
        case 'Unsent':
            await createUnsentCatchRecord();
            break;
        case 'Submitted':
            await createSubmittedCatchRecord();
            break;
        default:
            throw new Error(`Unsupported catch record status: ${status}`);
    }
});

When('I open my records list', async () => {
    await expect(homePage.heading).toBeDisplayed();
});
