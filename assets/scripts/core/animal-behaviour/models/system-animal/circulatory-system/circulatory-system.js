import { System } from '../system';
import { SystemScale } from '../../system-scales/export-system-scales';
/**
 * Класс сердечнососудистая системы
 * {Давление,Седцебиение}
 * @export
 * @class CirculatorySystem
 */
class CirculatorySystem extends System{
 
    /**
     * Давление кровиностной системы
     * @type {SystemScale} объект давления
     */
    _pressure;
     
    /**
     * Сердцебиение
     * @type {SystemScale} объект cердцебиения
     * 
     */
    _heartbeat;

    /**
     * Creates an instance of CirculatorySystem.
     * 
     * 
     * @memberOf CirculatorySystem
     */
    constructor(pressure, heartbeat){
        super();
        this._pressure = pressure;
        this._heartbeat = heartbeat;
    }
    
}
 
 export { CirculatorySystem };