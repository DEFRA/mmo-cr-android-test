import { BaseDatePage } from './baseDatePage';

export class TripEndDatePage extends BaseDatePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="What date did your trip finish?" and @heading="true"]',
        );
    }
}

export default new TripEndDatePage();
