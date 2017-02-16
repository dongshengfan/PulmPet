/**
 * Created by Shabanov on 12.02.2017.
 */

import { AnimalFactory,ScalesTypes } from './animal-behaviour/export-animal-behaviour';

export class APICore {
    constructor() {

    }
    /**
     * @returns {APICore}
     */
    static instance() {
        if (!this._instance) {
            this._instance = new APICore();
        }
        return this._instance;
    }
    /**
     * Создание животного в ядре
     * @param json
     * @returns {Animal}
     */
    createAnimal(json) {
        let factory = AnimalFactory.instance();
        return factory.create(json);
    }
    getTypsScale(){
        return ScalesTypes;
    }
}