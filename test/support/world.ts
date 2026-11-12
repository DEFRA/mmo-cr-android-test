import { World, setWorldConstructor } from '@wdio/cucumber-framework';

export class CatchRecordWorld extends World {
    email?: string;
    password?: string;
}

setWorldConstructor(CatchRecordWorld);
