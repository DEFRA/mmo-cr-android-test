import { Page } from '#page-objects/page';

class HomePage extends Page {
    override open() {
        return super.open('/');
    }
}

export default new HomePage();
