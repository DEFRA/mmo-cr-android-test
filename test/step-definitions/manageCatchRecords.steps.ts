import { Given, When } from '@wdio/cucumber-framework';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import type { BasePage } from '../page-objects/base/basePage';
import catchAreaPage from '../page-objects/catchAreaPage';
import homePage from '../page-objects/homePage';
import lateSubmissionWarningPage from '../page-objects/lateSubmissionWarningPage';
import { completedCatchRecordData } from '../data/catchRecordSync.data';
import { createDraftCatchRecord } from './catchRecordSync.steps';

interface MandatoryQuestion {
    page: BasePage;
    reach: () => Promise<void>;
}

async function reachCatchArea() {
    const { vessel, ports, gear } = completedCatchRecordData;
    await androidFlowNavigator.startCatchRecord();
    await androidFlowNavigator.selectVessel(vessel);
    await androidFlowNavigator.selectTripDates(true);
    await androidFlowNavigator.selectPorts(ports.departure, ports.return);
    await androidFlowNavigator.selectGear(gear.name, gear.meshSize, gear.shots);
    await catchAreaPage.heading.waitForDisplayed();
}

const mandatoryQuestions: Record<string, MandatoryQuestion> = {
    // The draft action options ("Complete catch record", ...) are shown from the home page.
    // Vessel and same-day trip are not listed: choosing an option moves on, so there is no Save and continue.
    'Draft action': {
        page: homePage,
        reach: async () => {
            await createDraftCatchRecord();
            await homePage.openDraftRecord();
        },
    },
    'Statistical area': {
        page: catchAreaPage,
        reach: reachCatchArea,
    },
};

function mandatoryQuestion(name: string): MandatoryQuestion {
    const question = mandatoryQuestions[name];
    if (!question) {
        throw new Error(`Unsupported mandatory question: ${name}`);
    }
    return question;
}

Given('I have reached the {string} question', async (name: string) => {
    await mandatoryQuestion(name).reach();
});

When('I continue without answering the {string} question', async (name: string) => {
    await mandatoryQuestion(name).page.saveAndContinue();
});

When('I acknowledge the late submission warning', async () => {
    await lateSubmissionWarningPage.acknowledge();
});
