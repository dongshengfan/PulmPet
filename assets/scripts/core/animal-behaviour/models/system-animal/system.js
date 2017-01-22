import { Communicator, EventSystemBuilder } from '../system-communication/export-system-communication';
import { SystemScale } from '../system-scales/export-system-scales';

/**
 * Абстрактный класс для систем животного отец систем
 * @export
 * @class System
 */
class System { 
    /**
     * @type {Communicator}
     */
    _communicator;


    /**
     * @typedef sysState
     * @type {Object} 
     * @property {number} current текущие еденицы состояния
     * @property {number} min минимальное количество единиц состояния
     * @property {number} max максимальное количество единиц состояния
     * @property {number} scale шкала состояния
     */   
    /**
     * Состояние системы в целом
     * @type {SystemScale} объект состояния
     * @memberOf System
     */
    _systemState;

    constructor() { 
 //       this._systemState = new SystemScale();
    }

    /**
     *
     * @param {Communicator} communicator 
     * @memberOf System
     */
    setCommunicator(communicator) { 
        this._communicator = communicator;
    }

    /**
     * 
     * @param {EventSystemBuilder} event
     * @param {any} param
     * @memberOf System
     */
    trigger(event, params) { 
        this._communicator.publish(event, params);
    }
}

export { System };

