import { BasePortPage } from './base/basePortPage';

export class DeparturePortPage extends BasePortPage {
    get heading() {
        return $(
            '//android.widget.TextView[@heading="true" and (@text="Enter the port or closest port you set off from" or @text="Select the port you set off from")]',
        );
    }
}

export default new DeparturePortPage();
