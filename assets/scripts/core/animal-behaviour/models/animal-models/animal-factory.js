import { LionFactory, MouseFactory } from './animal-factory/export-animal-factory';
/**
 * enum типов фабрик животных
 */
const animalFactoryTypes = {
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
        this._factories[animalFactoryTypes.lion] = LionFactory;
        this._factories[animalFactoryTypes.mouse] = MouseFactory;
        
    }

    
    create(animalFactoryType, params) { 
        return new this._factories[animalFactoryType](params);
    }
}

export { AnimalFactory };