import { Communicator, EventSystemBuilder } from '../system-communication/export-system-communication';
import { SystemScale } from '../system-scales/export-system-scales';

/**
 * Абстрактный класс для систем животного отец систем
 * @export
 * @class System
 */
class System { 
    /**
     * Коммуникатор для общения с другими системами
     * @type {Communicator}
     */
    _communicator;
   
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
     * Устанавливает системе коммуникатор
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

    onSpeedIncrease(delta) { 
    }

    onWeightIncrease(delta) {
    }
}

export { System };

