import { BasePage } from './basePage';
import { logStep } from '../common/logger';

export abstract class BaseDatePage extends BasePage {
    get dayLabel() {
        return $('//android.widget.TextView[@text="Day"]');
    }

    get dayField() {
        return $('(//android.widget.EditText)[1]');
    }

    get monthLabel() {
        return $('//android.widget.TextView[@text="Month"]');
    }

    get monthField() {
        return $('(//android.widget.EditText)[2]');
    }

    get yearLabel() {
        return $('//android.widget.TextView[@text="Year"]');
    }

    get yearField() {
        return $('(//android.widget.EditText)[3]');
    }

    async enterDay(day: string) {
        logStep(`Entering day ${day}`);
        await this.dayField.waitForDisplayed({ timeout: 10000 });
        await this.dayField.setValue(day);
    }

    async enterMonth(month: string) {
        logStep(`Entering month ${month}`);
        await this.monthField.setValue(month);
    }

    async enterYear(year: string) {
        logStep(`Entering year ${year}`);
        await this.yearField.setValue(year);
    }

    async enterDate(day: string, month: string, year: string) {
        logStep(`Entering date ${day}/${month}/${year}`);
        await this.enterDay(day);
        await this.enterMonth(month);
        await this.enterYear(year);
    }

    async enterDateAndContinue(day: string, month: string, year: string) {
        logStep(`Entering date ${day}/${month}/${year} and continuing`);
        await this.enterDate(day, month, year);
        await this.saveAndContinue();
    }
}
