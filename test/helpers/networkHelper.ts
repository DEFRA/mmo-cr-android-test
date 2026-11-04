import { logStep } from '../common/logger';

export class NetworkHelper {
    private static async setServiceEnabled(service: 'wifi' | 'data', enabled: boolean) {
        await driver.execute('mobile: shell', {
            command: 'svc',
            args: [service, enabled ? 'enable' : 'disable'],
        });
    }

    static async goOffline() {
        logStep('Going OFFLINE (Disabling Wi-Fi and mobile data)');
        await this.setServiceEnabled('wifi', false);
        await this.setServiceEnabled('data', false);
    }

    static async goOnline() {
        logStep('Going ONLINE (Enabling Wi-Fi and mobile data)');
        await this.setServiceEnabled('wifi', true);
        await this.setServiceEnabled('data', true);
    }

    static async enableAirplaneMode() {
        logStep('Enabling Airplane Mode');
        if (typeof driver.setNetworkConnection === 'function') {
            await driver.setNetworkConnection(1 as any);
        }
    }
}

export default NetworkHelper;
