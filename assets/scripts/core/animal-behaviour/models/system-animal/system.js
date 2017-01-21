import { Communicator, EventSystemBuilder } from '../system-communication/system-communication';

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
     * @type {sysState} объект состояния
     * @memberOf System
     */
    _systemState;

    constructor() { 
        this._systemState={
            current:0,
            min:0,
            max:0,
            scale:0
        };
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

    /**
     * Отдает процент прогресса на основе интервала и текущего значения
     * 
     * @param {number} current текущее значение
     * @param {number} max максимальное значение
     * @param {number} min минимальное значение
     * @returns {number} процент
     * 
     * @memberOf System
     */
    _getPercentageInScale(current,max,min){
        return ((current-min)*100)/(max-min);
    }
    /**
     * Отдает текущее значение по прогрессу и интервалу
     * 
     * @param {number} scale прогресс
     * @param {number} max максимальное значение
     * @param {number} min минимальное значение
     * @returns {number} текущее значение
     * 
     * @memberOf System
     */
    _getCurrentValueOnScale(scale,max,min){
        return (((max-min)/100)*scale)+min;
    }
    /**
     * Добавляет к шкале параметра какое-то значение и производит перерасчет текущего значения этого параметра
     * 
     * @param {Object} param объект-параметр системы
     * @param {number} value дельта изменеия чего-либо
     * 
     * @memberOf System
     */
    _addScaleValue(param,value){
        let rez=param.scale+value;
        if(rez<=100&&rez>=0){
            param.scale+=value;
        }
        param.current=this._getCurrentValueOnScale(param.scale,param.max,param.min);
    }
}



export { System };

