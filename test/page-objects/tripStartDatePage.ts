import { BaseDatePage } from './baseDatePage';

export class TripStartDatePage extends BaseDatePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="What date did your trip start?" and @heading="true"]',
        );
    }
}

export default new TripStartDatePage();
