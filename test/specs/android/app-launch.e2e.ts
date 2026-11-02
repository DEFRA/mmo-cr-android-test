import { driver, expect } from '@wdio/globals';

describe('Record Your Catch app', () => {
    it('should launch on Android', async () => {
        const currentPackage = await driver.getCurrentPackage();

        expect(currentPackage).toBeTruthy();
    });
});
