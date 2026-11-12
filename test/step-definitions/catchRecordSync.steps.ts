import { Given, When } from '@wdio/cucumber-framework';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import NetworkHelper from '../helpers/networkHelper';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import homePage from '../page-objects/homePage';
import submissionSuccessPage from '../page-objects/submissionSuccessPage';

async function submitCompletedCatchRecord() {
    await androidFlowNavigator.startCatchRecord();
    await androidFlowNavigator.selectVessel('ACHILLES');
    await androidFlowNavigator.selectTripDates(true);
    await androidFlowNavigator.selectPorts('Hastings', 'Dover');
    await androidFlowNavigator.selectGear('Seine nets', 10, 10);
    await androidFlowNavigator.selectAreas();
    await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);
    await androidFlowNavigator.selectDelayedLanding(false);
    await expect(catchRecordSummaryPage.heading).toBeDisplayed();
    await catchRecordSummaryPage.acceptAndSubmit();
}

When('I continue the draft catch record', async () => {
    await homePage.continueDraftRecord();
});

When('I leave and reopen the application', async () => {
    await homePage.close();
    await homePage.openApp();
});

When('I minimise the app for {int} seconds', async (seconds: number) => {
    await driver.execute('mobile: backgroundApp', { seconds });
});

Given('I have a submitted catch record', async () => {
    await submitCompletedCatchRecord();
    await expect(submissionSuccessPage.heading).toBeDisplayed();
    await submissionSuccessPage.clickViewRecords();
    await expect(homePage.recordWithStatus('Submitted')).toBeDisplayed({ wait: 15000 });
});

Given('I have a catch record awaiting sync', async () => {
    await NetworkHelper.goOffline();
    await submitCompletedCatchRecord();
    await expect(submissionSuccessPage.offlineBanner).toBeDisplayed();
    await submissionSuccessPage.clickViewRecords();
    await expect(homePage.recordWithStatus('Awaiting Sync')).toBeDisplayed();
});

Given('I have a draft catch record', async () => {
    await androidFlowNavigator.startCatchRecord();
    await androidFlowNavigator.selectVessel('ACHILLES');
    await driver.back();
    await driver.back();
    await expect(homePage.heading).toBeDisplayed();
});

When('I open my records list', async () => {
    await expect(homePage.heading).toBeDisplayed();
});
