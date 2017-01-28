import { System } from '../system';
import { SystemScale } from '../../system-scales/export-system-scales';
import { SystemFunctionTypes } from '../../system-functions/system-function-factory';
import { CommunicationEvents as events } from '../../system-communication/events';
/**
 * Класс сердечнососудистая системы
 * {Давление,Седцебиение}
 * @export
 * @class CirculatorySystem
 * @extends {System}
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
    constructor(state, pressure, heartbeat){
        super(state);
        this._pressure = pressure;
        this._heartbeat = heartbeat;
    }

    onWeightIncrease(delta) {
        this._systemState.addScaleValue(-delta, SystemFunctionTypes.line);
        this._pressure.addScaleValue(delta, SystemFunctionTypes.line);
        this._heartbeat.addScaleValue(-delta, SystemFunctionTypes.line);
    }
    
    onWeightDecrease(delta) {
        this._systemState.addScaleValue(delta, SystemFunctionTypes.line);
        this._pressure.addScaleValue(-delta, SystemFunctionTypes.line);
        this._heartbeat.addScaleValue(delta, SystemFunctionTypes.line);

    }

    onSpeedIncrease(delta) { 
        this._systemState.addScaleValue(-delta, SystemFunctionTypes.line);
        this._pressure.addScaleValue(delta, SystemFunctionTypes.line);
        this._heartbeat.addScaleValue(delta, SystemFunctionTypes.line);

    }
    
    onSpeedDecrease(delta) { 
        this._systemState.addScaleValue(delta, SystemFunctionTypes.line);
        this._pressure.addScaleValue(-delta, SystemFunctionTypes.line);
        this._heartbeat.addScaleValue(-delta, SystemFunctionTypes.line);

    }


    changePressure(delta){
        this._pressure.addScaleValue(delta,SystemFunctionTypes.line);
        this.verificationMark(delta)? this.trigger(events.pressure.increase,delta):this.trigger(events.pressure.decrease,delta);         
    }

    changeHeartbeat(delta){
        this._heartbeat.addScaleValue(delta,SystemFunctionTypes.line);
        this.verificationMark(delta)? this.trigger(events.heartbeat.increase,delta):this.trigger(events.heartbeat.decrease,delta); 
    }
    
}
 
 export { CirculatorySystem };