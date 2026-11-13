import { Given, When } from '@wdio/cucumber-framework';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import NetworkHelper from '../helpers/networkHelper';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import homePage from '../page-objects/homePage';
import submissionSuccessPage from '../page-objects/submissionSuccessPage';
import { completedCatchRecordData, offlineCatchRecordData } from '../data/catchRecordSync.data';

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
    await submitCompletedCatchRecord(completedCatchRecordData);
    await expect(submissionSuccessPage.heading).toBeDisplayed();
    await submissionSuccessPage.clickViewRecords();
    await homePage.waitForRecordWithStatus('Submitted');
});

Given('I have a catch record awaiting sync', async () => {
    await NetworkHelper.goOffline();
    await submitCompletedCatchRecord(offlineCatchRecordData);
    await expect(submissionSuccessPage.offlineBanner).toBeDisplayed();
    await submissionSuccessPage.clickViewRecords();
    await homePage.waitForRecordWithStatus('Unsent');
});

Given('I have a draft catch record', async () => {
    await androidFlowNavigator.startCatchRecord();
    await androidFlowNavigator.selectVessel(completedCatchRecordData.vessel);
    await driver.back();
    await driver.back();
    await expect(homePage.heading).toBeDisplayed();
});

When('I open my records list', async () => {
    await expect(homePage.heading).toBeDisplayed();
});
