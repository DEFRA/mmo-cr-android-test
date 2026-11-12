import { Then, When } from '@wdio/cucumber-framework';
import catchRecordSummaryPage from '../page-objects/catchRecordSummaryPage';
import catchSubAreaPage from '../page-objects/catchSubAreaPage';

let capturedCoordinates = '';
let previousCoordinates = '';

Then('the sub area {string} is not in the suggested list', async (areaCode: string) => {
    expect(await catchSubAreaPage.getAvailableSubAreas()).not.toContain(areaCode);
});

When('I select the "Other" sub area', async () => {
    await catchSubAreaPage.selectOther();
});

When('I enter sub area code {string}', async (text: string) => {
    await catchSubAreaPage.enterSubAreaCode(text);
});

When('I select the sub area result {string}', async (areaCode: string) => {
    capturedCoordinates = await catchSubAreaPage.getSuggestionCoordinates(areaCode);
    await catchSubAreaPage.selectSuggestion(areaCode);
});

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

Then('the coordinates for sub area {string} are displayed', async (areaCode: string) => {
    previousCoordinates = capturedCoordinates;
    capturedCoordinates = await catchSubAreaPage.getSuggestionCoordinates(areaCode);
});

Then('the sub area coordinates have changed', () => {
    expect(capturedCoordinates).not.toEqual(previousCoordinates);
});

Then('the centre of the selected sub area is displayed', async () => {
    await expect(catchSubAreaPage.selectedAreaCentre).toHaveText(
        expect.stringContaining(capturedCoordinates),
    );
});

Then('the summary shows sub area {string}', async (areaCode: string) => {
    const value = $(`//android.widget.TextView[contains(@text, "${areaCode}")]`);
    await catchRecordSummaryPage.scrollUntilDisplayed(value, { maxSwipes: 10 });
    await expect(value).toBeDisplayed();
});
