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
     * @param {CommunicationEvents} event
     * @param {Number} param
     * @returns {this}
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
     * @param {CommunicationEvents} event
     * @param {Number} params
     * @returns {this}
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
     * @returns {Communicator}
     * 
     * @memberOf EventSystemBuilder
     */
    build() {
        return this._communicator;
    }

    /**
     * 
     * 
     * @param {CommunicationEvents} event
     * @param {JSON} param
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