import { BasePage } from './basePage';
import { logStep, logWarn } from '../common/logger';

export class CatchAreaPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Where was the majority of your catch caught") and @heading="true"]',
        );
    }

    get map() {
        return $('//android.view.View[contains(@content-desc, "Map of fisheries statistical")]');
    }

    get otherButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Other"]]',
        );
    }

    selectedAreaText(areaCode: string) {
        return $(`//android.widget.TextView[@text="Selected area: ${areaCode}"]`);
    }

    // The selection state is announced in the map's content-desc, e.g. "... Selected area: 30F04 Drag to pan ...".
    private async getMapDescription(): Promise<string> {
        return (await this.map.getAttribute('content-desc')) ?? '';
    }

    async getSelectedAreaCode(): Promise<string | null> {
        logStep('Getting selected area code');
        const match = (await this.getMapDescription()).match(/Selected area:\s*(\S+)/);
        return match?.[1] ?? null;
    }

    async isAreaSelected(): Promise<boolean> {
        logStep('Checking if an area is selected');
        return (await this.getMapDescription()).includes('Selected area:');
    }

    private async mapBounds() {
        const { x, y } = await this.map.getLocation();
        const { width, height } = await this.map.getSize();
        return {
            x,
            y,
            width,
            height,
            centreX: Math.floor(x + width / 2),
            centreY: Math.floor(y + height / 2),
        };
    }

    // Waits until two consecutive map screenshots match, i.e. any pan/zoom animation has finished.
    private async waitForMapToSettle() {
        let previous = await this.getMapSnapshot();
        await browser.waitUntil(
            async () => {
                const current = await this.getMapSnapshot();
                const settled = current === previous;
                previous = current;
                return settled;
            },
            { timeout: 5000, interval: 300, timeoutMsg: 'Map did not stop moving.' },
        );
    }

    async selectLocation() {
        logStep('Selecting a location on the map');
        await this.map.waitForDisplayed();

        const { x: mapX, y: mapY, width, height } = await this.mapBounds();
        // The departure port sits mid-map with land above it, so tap fixed points in the lower part where the sea sub-areas are.
        const tapPoints = [
            { fx: 0.5, fy: 0.8 },
            { fx: 0.3, fy: 0.75 },
            { fx: 0.7, fy: 0.75 },
            { fx: 0.4, fy: 0.85 },
            { fx: 0.6, fy: 0.85 },
        ];

        for (const [attempt, { fx, fy }] of tapPoints.entries()) {
            const x = mapX + Math.floor(width * fx);
            const y = mapY + Math.floor(height * fy);

            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'catch-area-map-tap',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x, y },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pointerUp', button: 0 },
                    ],
                },
            ]);

            const selected = await browser
                .waitUntil(
                    async () => (await this.getMapDescription()).includes('Selected area:'),
                    {
                        timeout: 1500,
                        interval: 200,
                    },
                )
                .catch(() => false);
            if (selected) {
                logStep(`Selected area: ${await this.getSelectedAreaCode()}`);
                return;
            }
            logWarn(`CatchAreaPage: retry selectLocation (attempt ${attempt + 1})`);
        }

        throw new Error('Could not select a catch area on the map.');
    }

    // Swipes in the page margin beside the map, because swiping on the map pans it instead of scrolling the page.
    private async scrollPastMapTo(target: ChainablePromiseElement) {
        const { x: mapX } = await this.map.getLocation();
        await this.scrollUntilDisplayed(target, { swipeX: Math.max(1, Math.floor(mapX / 2)) });
    }

    async clickOther() {
        logStep('Clicking Other');
        await this.scrollPastMapTo(this.otherButton);
        await this.otherButton.waitForDisplayed();
        await this.otherButton.click();
    }

    async isSelectedAreaTextDisplayed(areaCode: string): Promise<boolean> {
        logStep(`Checking if "Selected area: ${areaCode}" is displayed`);
        const text = this.selectedAreaText(areaCode);
        await this.scrollPastMapTo(text);
        return text.isDisplayed();
    }

    override async saveAndContinue() {
        await this.scrollPastMapTo(this.saveAndContinueButton);
        await super.saveAndContinue();
    }

    async selectLocationAndContinue() {
        logStep('Selecting a location and continuing');
        await this.selectLocation();
        await this.saveAndContinue();
    }

    async getMapSnapshot(): Promise<string> {
        const map = await this.map;
        return browser.takeElementScreenshot(map.elementId);
    }

    async zoomMap(direction: 'in' | 'out') {
        logStep(`Zooming ${direction} on the map`);
        const { width, height, centreX, centreY } = await this.mapBounds();
        const near = 20;
        const far = Math.floor(Math.min(width, height) / 3);
        // Zoom in spreads the fingers out from the centre; zoom out pinches them back to it.
        const [start, end] = direction === 'in' ? [near, far] : [far, near];

        const finger = (id: string, sign: 1 | -1) => ({
            type: 'pointer' as const,
            id,
            parameters: { pointerType: 'touch' as const },
            actions: [
                { type: 'pointerMove', duration: 0, x: centreX + sign * start, y: centreY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 600, x: centreX + sign * end, y: centreY },
                { type: 'pointerUp', button: 0 },
            ],
        });

        await browser.performActions([finger('finger1', -1), finger('finger2', 1)]);
        await browser.releaseActions();
        await this.waitForMapToSettle();
    }

    async dragMap(direction: 'up' | 'down' | 'left' | 'right') {
        logStep(`Dragging the map ${direction}`);
        await driver.execute('mobile: dragGesture', await this.dragPoints(direction));
        await this.waitForMapToSettle();
    }

    private async dragPoints(direction: 'up' | 'down' | 'left' | 'right') {
        const { width, height, centreX, centreY } = await this.mapBounds();
        const dx = Math.floor(width / 4);
        const dy = Math.floor(height / 4);
        const ends = {
            up: { endX: centreX, endY: centreY - dy },
            down: { endX: centreX, endY: centreY + dy },
            left: { endX: centreX - dx, endY: centreY },
            right: { endX: centreX + dx, endY: centreY },
        };
        return { startX: centreX, startY: centreY, ...ends[direction] };
    }
}

export default new CatchAreaPage();
