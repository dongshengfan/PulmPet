
import { ActTypes } from '../enum-lists/export-enum-lists';
/**
 * Класс централизует сообщения между системами, упрощает их общение между собой
 * @export
 * @class Communicator
 */
class Communicator {

    /**
     * Круг общения комуникатора
     * @type {Array<CommunicationEvents>}
     * @memberOf Communicator
     */
    _netLinks;

    _mapScale;
    _sensitivity;
    /**
     * Creates an instance of Communicator.
     * @memberOf Communicator
     */
    constructor() {
        this._netLinks = {};
        this._mapScale = [];
        this._sensitivity=0;
    }

    /**
     * Добавляет ккартешакал новую шкалу
     * @param type
     * @param scale
     */
    addScale(type, scale) {
        this._mapScale[type] = scale;
    }

    getScale(type) {
        return this._mapScale[type];
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
     * @param {Number} params передаваемые связям параметры
     * @memberOf Communicator
     */
    publish(event, params) {
        var links = this._netLinks[event];
        if (links) {
            links.forEach((link) => {
                let scale = this.getScale(link.scale);
                let delta=link.function.calculate(params);
               
                if(Math.abs(delta)>this._sensitivity) {
                    link.act === ActTypes.also ? scale.recursiveChange(delta) : scale.recursiveChange(-delta);
                }
            });
        }
    }

}

export { Communicator }