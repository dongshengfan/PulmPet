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

    constructor(systemState) { 
          this._systemState = systemState;
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
     * Публикация изменения в системе
     * @param {EventSystemBuilder} event
     * @param {any} param
     * @memberOf System
     */
    trigger(event, params) { 
        this._communicator.publish(event, params);
    }

    
    /**
     * Проверяет знак пришедшей дельты изменения
     * 
     * @param {number} delta
     * @returns {boolean} 
     * 
     * @memberOf System
     */
    verificationMark(delta){
        if(delta>0){ 
            return true;
        }else if(delta<0){
            return false;
        }
        throw new Error('Change delta on zero...');
    }
    
    onSpeedIncrease(delta) { 
    }
   
    onSpeedDecrease(delta) { 
    }
   
    onWeightIncrease(delta) {
    }
   
    onWeightDecrease(delta) {
    }

    onPressureIncrease(delta) {
    }
  
    onPressureDecrease(delta) {   
    }
    
    onHeartbeatIncrease(delta) {
    }
   
    onHeartbeatDecrease(delta) {
    }

}

export { System };

