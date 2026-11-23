import { Given, Then, When } from '@wdio/cucumber-framework';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import NetworkHelper from '../helpers/networkHelper';
import homePage from '../page-objects/homePage';
import submissionSuccessPage from '../page-objects/submissionSuccessPage';
import { completedCatchRecordData, offlineCatchRecordData } from '../data/catchRecordSync.data';
import type { CatchRecordWorld } from '../support/world';

async function createSubmittedCatchRecord() {
    await androidFlowNavigator.submitCatchRecord(completedCatchRecordData);
    await expect(submissionSuccessPage.heading).toBeDisplayed();
    await submissionSuccessPage.clickViewRecords();
    await homePage.waitForRecordWithStatus('Submitted');
}

async function createUnsentCatchRecord(status = 'Unsent') {
    await NetworkHelper.goOffline();
    await androidFlowNavigator.submitCatchRecord(offlineCatchRecordData);
    await expect(submissionSuccessPage.offlineBanner).toBeDisplayed();
    await submissionSuccessPage.clickViewRecords();
    await homePage.waitForRecordWithStatus(status);
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
    await homePage.moveToBackground(seconds);
});

Given('I have a catch record awaiting sync', async () => {
    await createUnsentCatchRecord();
});

Given('I have a catch record with status {string}', async (status: string) => {
    switch (status) {
        case 'Draft':
            await androidFlowNavigator.createDraftCatchRecord(completedCatchRecordData.vessel);
            break;
        case 'Unsent':
        case 'Complete/Pending':
            await createUnsentCatchRecord(status);
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
