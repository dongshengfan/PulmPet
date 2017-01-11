import {HearingSystem, SightSystem} from './export-senses-system';
/**
 * Класс систем органов чувств
 * 
 * @export
 * @class SensesSystem
 */
export class SensesSystem{
    /**
     * Система слуха
     * 
     * @type {HearingSystem}
     * @memberOf SensesSystem
     */
    hearing;
    /**
     * Система зрения
     * 
     * @type {SightSystem}
     * @memberOf SensesSystem
     */
    sight;
    constructor() {
        this.hearing=new HearingSystem();
        this.sight=new SightSystem();
    }
}