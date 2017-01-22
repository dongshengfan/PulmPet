import { HearingSystem } from './hearing-system/export-hearing-system';
import { SightSystem } from './sight-system/export-sight-system';
import { System } from '../system';
/**
 * Класс систем органов чувств
 * 
 * @export
 * @class SensesSystem
 */
class SensesSystem extends System{
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
        super();
        this.hearing=new HearingSystem();
        this.sight=new SightSystem();
    }
}

export { SensesSystem };