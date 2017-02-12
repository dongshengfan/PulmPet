import { System } from '../system';
import { CommunicationEvents as events } from '../../system-communication/events';
import { ScalesTypes } from '../../animal-models/sceles-animal-types';
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
     */
    _pressure;

    /**
     * Сердцебиение
     */
    _heartbeat;

    /**
     * Creates an instance of CirculatorySystem.
     */
    constructor(scales) {
        super(scales[ScalesTypes.stateSystem]);
        this._pressure = scales[ScalesTypes.pressure];
        this._heartbeat = scales[ScalesTypes.heartbeat];
        this._pressure.addEvent(events.pressure);
        this._heartbeat.addEvent(events.heartbeat);
    }

    changePressure(delta) {
        this._pressure.recursiveChange(delta);
        this.analyzeSystem();
    }

    changeHeartbeat(delta) {
        this._heartbeat.recursiveChange(delta);
        this.analyzeSystem();
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