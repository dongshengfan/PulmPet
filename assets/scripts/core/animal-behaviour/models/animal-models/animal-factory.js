import { LionFactory, MouseFactory } from './animal-factories/export-animal-factory';
/**
 * enum типов фабрик животных
 */
const AnimalTypes = {
    lion: 0,
    mouse: 1
}

/**
 * Фабрика животных для расчетов
 * 
 * @class AnimalFactory
 */
class AnimalFactory {
    
    _factories;

    constructor() { 
        this._factories = {};
        this._factories[AnimalTypes.lion] = LionFactory;
        this._factories[AnimalTypes.mouse] = MouseFactory;
    }

    create(animalType, params) { 
        return new this._factories[animalType](params).create();
    }
}

export { AnimalFactory, AnimalTypes };