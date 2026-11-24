import { World, setWorldConstructor } from '@wdio/cucumber-framework';

export class CatchRecordWorld extends World {
    email?: string;
    password?: string;
    deletedDraftTripId?: string;
    subAreaCoordinates?: string;
    previousSubAreaCoordinates?: string;
    selectedMapAreaCode?: string | null;
    mapSnapshot?: string;
}

setWorldConstructor(CatchRecordWorld);
