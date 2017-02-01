import { Animal } from './animal'
import { LionFactory } from './lion/factories/lion-factory';
import { MouseFactory } from './mouse/factories/mouse-factory';
import { AnimalTypes } from './animal-types';
/**
 * Фабрика животных для расчетов
 * 
 * @class AnimalFactory
 */
class AnimalFactory {

    /**
     * @param {Array<AnimalTypes>}
     * @memberOf AnimalFactory
     */
    _factories;

    /**
     * @static 
     * @memberOf AnimalFactory
     */
    static _instance;

    constructor() {
        this._factories = {};
        this._factories[AnimalTypes.lion] = LionFactory;
        this._factories[AnimalTypes.mouse] = MouseFactory;
    }

    /**
     * @returns {AnimalFactory}
     */
    static instance() {
        if (!this._instance) {
            this._instance = new AnimalFactory();
        }
        return this._instance;
    }

    /**
     * Создание животного по типу
     * 
     * @param {AnimalTypes} animalType
     * @param {JSON} params
     * @returns {Animal}
     * 
     * @memberOf AnimalFactory
     */
    create(animalType, params) {
        return new this._factories[animalType](params).create();
    }
}

export { AnimalFactory };