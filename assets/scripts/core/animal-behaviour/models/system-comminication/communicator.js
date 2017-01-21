import { CommunicationEvents } from '../system-comminication/events';

/**
 * Класс централизует сообщения между системами, упрощает их общение между собой
 * @export
 * @class Communicator
 */
class Communicator {

    /**
     * Круг общения комуникатора
     * @type {Object}  
     * @memberOf Communicator
     */
    _netLinks;

    /**
     * Creates an instance of Communicator.
     * @memberOf Communicator
     */
    constructor() { 
        this._netLinks = {};
    }

    /**
     * Регистрирует событие - связь для оповещения
     * @param {CommunicationEvents} event событие, на которое необходимо создать связь
     * @param {Function} link создаваемая на событие связь
     * @memberOf Communicator
     */
    register(event, link) {
        if (this._netLinks[event]) {
            this._netLinks[event].push(link);
        } else { 
            this._netLinks[event] = [link];
        }
    }

    /**
     * Оповещение имеющихся связей по приходящему событию
     * @param {CommunicationEvents} event приходящие событие
     * @param {any} params передаваемые связям параметры 
     * @memberOf Communicator
     */
    publish(event, params) {
        this.regis
        var links = this._netLinks[event];
        if (links) {
            links.forEach((link) => link(params));
        }
    }

}

export { Communicator }