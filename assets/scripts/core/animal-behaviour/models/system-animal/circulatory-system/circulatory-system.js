import { System } from '../system';
import { SystemScale } from '../../system-scales/export-system-scales';
import { SystemFunctionTypes } from '../../system-functions/system-function-types';
import { CommunicationEvents as events } from '../../system-communication/events';
/**
 * Класс сердечнососудистая системы
 * {Давление,Седцебиение}
 * @export
 * @class CirculatorySystem
 * @extends {System}
 */
class CirculatorySystem extends System {

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
    constructor(state, pressure, heartbeat) {
        super(state);
        this._pressure = pressure;
        this._heartbeat = heartbeat;
    }

    onWeightIncrease(delta) {
        this._pressure.addScaleValue(delta, SystemFunctionTypes.line);
        this._heartbeat.addScaleValue(-delta, SystemFunctionTypes.line);
        this.analyzeSystem();
    }

    onWeightDecrease(delta) {
        this._pressure.addScaleValue(-delta, SystemFunctionTypes.line);
        this._heartbeat.addScaleValue(delta, SystemFunctionTypes.line);
        this.analyzeSystem();

    }

    onSpeedIncrease(delta) {
        this._pressure.addScaleValue(delta, SystemFunctionTypes.line);
        this._heartbeat.addScaleValue(delta, SystemFunctionTypes.line);
        this.analyzeSystem();

    }

    onSpeedDecrease(delta) {
        this._pressure.addScaleValue(-delta, SystemFunctionTypes.line);
        this._heartbeat.addScaleValue(-delta, SystemFunctionTypes.line);
        this.analyzeSystem();

    }




    changePressure(delta) {
        this._pressure.addScaleValue(delta, SystemFunctionTypes.line);
        this.analyzeSystem();
        this.trigger(events.pressure, delta, true);

    }

    changeHeartbeat(delta) {
        this._heartbeat.addScaleValue(delta, SystemFunctionTypes.line);
        this.analyzeSystem();
        this.trigger(events.heartbeat, delta, true);
    }

    /**
     * Анализирует показатели системы выводя вердикт о состоянии
     * 
     * 
     * @memberOf CirculatorySystem
     */
    analyzeSystem() {
        this._systemState.analyze([
            {
                scale: 100 - this._heartbeat.scale
            },
            {
                scale: 100 - this._pressure.scale
            }
        ]);
    }

}

export { CirculatorySystem };