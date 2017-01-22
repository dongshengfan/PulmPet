import { AnimalFactory } from './animal-factory';

/**
 * Абстрактная фабрика мышей
 * 
 * @class MouseFactory
 * @extends {AnimalFactory}
 */
class MouseFactory extends AnimalFactory{
    constructor(){
        super();
        
    }
}

export { MouseFactory };