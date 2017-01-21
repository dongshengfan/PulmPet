import { Communicator } from './communicator';
import { CommunicationEvents as Events } from './events';

/**
 * Класс-строитель коммуникации систем определенного животного 
 * @export
 * @class EventSystemBuilder
 */
class EventSystemBuilder {
    
    /**
     * Коммуникатор общения между системами
     * @type {Communicator}
     * @memberOf EventSystemBuilder
     */
    _communicator;

    constructor() { 
        this._communicator = new Communicator();
    }

    add(event, link) { 
        
    }

    build() { 
        return this._communicator;
    }
}

export { EventSystemBuilder }