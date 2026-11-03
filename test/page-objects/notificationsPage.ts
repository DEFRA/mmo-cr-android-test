import { BasePage } from './basePage';

export class NotificationsPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Notifications"]');
    }
}

export default new NotificationsPage();
