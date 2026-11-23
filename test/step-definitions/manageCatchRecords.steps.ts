import { Given, When } from '@wdio/cucumber-framework';
import androidFlowNavigator from '../helpers/androidFlowNavigator';
import type { BasePage } from '../page-objects/base/basePage';
import catchAreaPage from '../page-objects/catchAreaPage';
import homePage from '../page-objects/homePage';
import lateSubmissionWarningPage from '../page-objects/lateSubmissionWarningPage';
import { completedCatchRecordData } from '../data/catchRecordSync.data';

interface MandatoryQuestion {
    page: BasePage;
    reach: () => Promise<void>;
}

const mandatoryQuestions: Record<string, MandatoryQuestion> = {
    'Draft action': {
        page: homePage,
        reach: async () => {
            await androidFlowNavigator.createDraftCatchRecord(completedCatchRecordData.vessel);
            await homePage.openDraftRecord();
        },
    },
    'Statistical area': {
        page: catchAreaPage,
        reach: () => androidFlowNavigator.reachCatchArea(completedCatchRecordData),
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
