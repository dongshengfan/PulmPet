import { CommunicationEvents as Events } from '../system-comminication/events';
/**
 * Класс централизует сообщения между системами, упрощает их общение между собой
 * 
 * @export
 * @class Communicator
 */
class Communicator {

    /**
     * Круг общения комуникатора
     * @type {Array}  
     * @memberOf Communicator
     */
    _netLinks;

    constructor() { 
        this._netLinks = {};
    }

    /**
     * Регистрирует системы в отдельную конфу/сеть (можно сделать по названию) 
     * 
     * @memberOf Communicator
     */
    register(event, system) {
        if (this._netLinks[event]) {
            this._netLinks[event].push(system);
        } else { 
            this._netLinks[event] = [system];
        }
    }

    publish(event, params) {
        var links = this._netLinks[event];
        if (links) {
            links.forEach((link) => link(params));
        }    
    }

}

export { Communicator }