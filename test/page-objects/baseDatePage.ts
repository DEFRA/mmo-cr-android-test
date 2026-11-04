import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export abstract class BaseDatePage extends BasePage {
    async enterDay(day: string) {
        logStep(`Selecting day ${day}`);
        await this.scrollPickerToValue('Day', day);
    }

    async enterMonth(month: string) {
        logStep(`Selecting month ${month}`);
        await this.scrollPickerToValue('Month', month);
    }

    async enterYear(year: string) {
        logStep(`Selecting year ${year}`);
        await this.scrollPickerToValue('Year', year);
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

    private async scrollPickerToValue(label: 'Day' | 'Month' | 'Year', value: string) {
        const target = Number(value);
        if (!Number.isInteger(target)) {
            throw new Error(`Invalid ${label.toLowerCase()} value: ${value}`);
        }

        const picker = $(`//android.widget.SeekBar[@content-desc="${label}"]`);
        await picker.waitForDisplayed();

        const size = await picker.getSize();
        const location = await picker.getLocation();
        const centerX = location.x + Math.floor(size.width / 2);
        const centerY = location.y + Math.floor(size.height / 2);
        const minimumSwipe = Math.max(4, Math.floor(size.height * 0.02));
        const maximumSwipe = Math.floor(size.height * 0.45);
        let swipeDistance = Math.max(minimumSwipe, Math.floor(size.height * 0.1));

        for (let attempt = 0; attempt < 100; attempt++) {
            const currentText = await picker.getAttribute('text');
            const current = currentText === null ? Number.NaN : Number.parseFloat(currentText);
            if (!Number.isFinite(current)) {
                throw new Error(`Could not read the selected ${label.toLowerCase()} value`);
            }
            if (current === target) {
                return;
            }

            const remaining = target - current;
            const direction = Math.sign(remaining);
            await browser.performActions([
                {
                    type: 'pointer',
                    id: `date-picker-${label.toLowerCase()}`,
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: centerX, y: centerY },
                        { type: 'pointerDown', button: 0 },
                        {
                            type: 'pointerMove',
                            duration: 250,
                            x: centerX,
                            y: centerY - direction * swipeDistance,
                        },
                        { type: 'pointerUp', button: 0 },
                    ],
                },
            ]);
            await browser.pause(100);

            const updatedText = await picker.getAttribute('text');
            const updated = updatedText === null ? Number.NaN : Number.parseFloat(updatedText);
            if (!Number.isFinite(updated)) {
                throw new Error(`Could not read the selected ${label.toLowerCase()} value`);
            }

            const changedBy = updated - current;
            if (changedBy === 0) {
                if (swipeDistance >= maximumSwipe) {
                    throw new Error(
                        `Could not scroll the ${label.toLowerCase()} picker from ${current} to ${target}`,
                    );
                }
                swipeDistance = Math.min(maximumSwipe, swipeDistance * 2);
                continue;
            }

            const remainingAfterSwipe = target - updated;
            swipeDistance = Math.max(
                minimumSwipe,
                Math.min(
                    maximumSwipe,
                    Math.round(
                        (swipeDistance * Math.abs(remainingAfterSwipe)) / Math.abs(changedBy),
                    ),
                ),
            );
        }

        throw new Error(`Could not select ${label.toLowerCase()} value ${target}`);
    }
}
