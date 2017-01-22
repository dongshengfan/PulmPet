import { AnimalFactory } from '../animal-factory';
import { Animal } from '../animal';

/**
 * Абстрактная фабрика львов
 * 
 * @class LionFactory
 * @extends {AnimalFactory}
 */
class LionFactory extends AnimalFactory  { 
    constructor(params){
        super();
    }
}

export { LionFactory };