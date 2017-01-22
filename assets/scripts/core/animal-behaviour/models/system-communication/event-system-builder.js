import { Communicator } from './communicator';
import { CommunicationEvents as events } from './events';

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

    /**
     * 
     * 
     * @param {any} event
     * @param {any} param
     * @returns
     * 
     * @memberOf EventSystemBuilder
     */
    add(event, param) {
        this._addLink(event, param);
        return this;
    }

    /**
     * 
     * 
     * @param {any} event
     * @param {any} params
     * @returns
     * 
     * @memberOf EventSystemBuilder
     */
    addAll(event, params) { 
        params.forEach((param) => this._addLink(event, param));
        return this;
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf EventSystemBuilder
     */
    build() { 
        return this._communicator;
    }

    /**
     * 
     * 
     * @param {any} event
     * @param {any} param
     * 
     * @memberOf EventSystemBuilder
     */
    _addLink(event, param) {
        var {system, link} = param;
        system.setCommunicator(this._communicator);
        this._communicator.register(event, link.bind(system));
    }
}

export { EventSystemBuilder }