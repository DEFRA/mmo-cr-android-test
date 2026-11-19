import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

export abstract class BaseDatePage extends BasePage {
    async enterDay(day: string) {
        logStep(`Selecting day ${day}`);
        await this.setPickerValue('Day', day);
    }

    async enterMonth(month: string) {
        logStep(`Selecting month ${month}`);
        await this.setPickerValue('Month', month);
    }

    async enterYear(year: string) {
        logStep(`Selecting year ${year}`);
        await this.setPickerValue('Year', year);
    }

    async enterDate(day: string, month: string, year: string) {
        logStep(`Entering date ${day}/${month}/${year}`);
        await this.enterYear(year);
        await this.enterMonth(month);
        await this.enterDay(day);
    }

    async enterDateAndContinue(day: string, month: string, year: string) {
        logStep(`Entering date ${day}/${month}/${year} and continuing`);
        await this.enterDate(day, month, year);
        await this.saveAndContinue();
    }

    // Each wheel is exposed as a SeekBar, so its value is set directly rather than swiped.
    // The app clamps values it does not allow (e.g. future dates, 31 Feb), which is caught below.
    private async setPickerValue(label: 'Day' | 'Month' | 'Year', value: string) {
        const target = Number(value);
        if (!Number.isInteger(target)) {
            throw new Error(`Invalid ${label.toLowerCase()} value: ${value}`);
        }

        const picker = $(`//android.widget.SeekBar[@content-desc="${label}"]`);
        await picker.waitForDisplayed();
        await picker.setValue(String(target));

        const readSelected = async () =>
            Number.parseFloat((await picker.getAttribute('text')) ?? '');
        try {
            await browser.waitUntil(async () => (await readSelected()) === target, {
                timeout: 3000,
            });
        } catch {
            throw new Error(
                `Could not select ${label.toLowerCase()} ${target}; picker shows ${await readSelected()}`,
            );
        }
    }
}
