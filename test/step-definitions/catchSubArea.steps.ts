import { Then, When } from '@wdio/cucumber-framework';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import catchSubAreaPage from '../page-objects/catchSubAreaPage';
import type { CatchRecordWorld } from '../support/world';

Then('the sub area {string} is not in the suggested list', async (areaCode: string) => {
    expect(await catchSubAreaPage.getAvailableSubAreas()).not.toContain(areaCode);
});

Then('the sub area {string} is in the suggested list', async (areaCode: string) => {
    expect(await catchSubAreaPage.getAvailableSubAreas()).toContain(areaCode);
});

When('I select the suggested sub area {string}', async (areaCode: string) => {
    await catchSubAreaPage.selectSubArea(areaCode);
});

When('I select the "Other" sub area', async () => {
    await catchSubAreaPage.selectOther();
});

When('I enter sub area code {string}', async (text: string) => {
    await catchSubAreaPage.enterSubAreaCode(text);
});

When(
    'I select the sub area result {string}',
    async function (this: CatchRecordWorld, areaCode: string) {
        this.subAreaCoordinates = await catchSubAreaPage.getSuggestionCoordinates(areaCode);
        await catchSubAreaPage.selectSuggestion(areaCode);
    },
);

Then('the sub area type-ahead field is displayed', async () => {
    await expect(catchSubAreaPage.subAreaSearchField).toBeDisplayed();
});

Then('the sub area field shows {string}', async (text: string) => {
    await expect(catchSubAreaPage.subAreaSearchField).toHaveText(text);
});

Then(
    'each sub area result shows a code containing {string} and coordinates',
    async (search: string) => {
        const results = await catchSubAreaPage.getSuggestionTexts();
        expect(results.length).toBeGreaterThan(0);
        for (const texts of results) {
            expect(texts.some((text) => text.includes(search))).toBe(true);
            expect(texts.some((text) => text.includes('°'))).toBe(true);
        }
    },
);

Then(
    'the sub area result {string} shows ICES rectangle {string}',
    async (areaCode: string, rectangle: string) => {
        const texts = await catchSubAreaPage.getSuggestionText(areaCode);
        expect(texts.some((text) => text.includes(rectangle))).toBe(true);
    },
);

Then(
    'the coordinates for sub area {string} are displayed',
    async function (this: CatchRecordWorld, areaCode: string) {
        this.previousSubAreaCoordinates = this.subAreaCoordinates;
        this.subAreaCoordinates = await catchSubAreaPage.getSuggestionCoordinates(areaCode);
    },
);

Then('the sub area coordinates have changed', function (this: CatchRecordWorld) {
    expect(this.subAreaCoordinates).not.toEqual(this.previousSubAreaCoordinates);
});

Then('the centre of the selected sub area is displayed', async function (this: CatchRecordWorld) {
    if (!this.subAreaCoordinates) {
        throw new Error('No sub area result has been selected');
    }
    await expect(catchSubAreaPage.selectedAreaCentre).toHaveText(
        expect.stringContaining(this.subAreaCoordinates),
    );
});

Then('the summary shows sub area {string}', async (areaCode: string) => {
    await catchRecordSummaryPage.scrollToText(areaCode);
    await expect(catchRecordSummaryPage.textContaining(areaCode)).toBeDisplayed();
});
