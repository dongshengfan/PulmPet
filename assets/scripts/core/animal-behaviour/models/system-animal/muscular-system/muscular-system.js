import { System } from '../system';
import { SystemScale } from '../../system-scales/export-system-scales';
import { SystemFunctionTypes } from '../../system-functions/system-function-factory';
import { CommunicationEvents as events } from '../../system-communication/events';
/**
 * Класс опорно-двигательной системы
 * {Скорость передвижения, вес}
 * @export
 * @class MuscularSystem
 */
class MuscularSystem extends System{
    
    
    /**
     * Скорость передвижения
     * @type {SystemScale} объект скорости
     */
    _speed;
      
    /**
     * Вес животного
     * @type {SystemScale} объект веса
     * 
     */
    _weight;

    
    constructor(state, speed, weight) {
        super(state);
        this._speed  = speed;
        this._weight = weight;
    }

    onPressureIncrease(delta) {
        this._weight.addScaleValue(-delta, SystemFunctionTypes.line);
        this._speed.addScaleValue(-delta, SystemFunctionTypes.line);
        this._systemState.addScaleValue(-delta, SystemFunctionTypes.line);
    }

    onPressureDecrease(delta) {  
        this._weight.addScaleValue(-delta, SystemFunctionTypes.line);
        this._speed.addScaleValue(delta, SystemFunctionTypes.line);
        this._systemState.addScaleValue(delta, SystemFunctionTypes.line);
    }

    onHeartbeatIncrease(delta) {
        this._weight.addScaleValue(-delta, SystemFunctionTypes.line);
        this._speed.addScaleValue(delta, SystemFunctionTypes.line);
        this._systemState.addScaleValue(-delta, SystemFunctionTypes.line);
    }
    
    onHeartbeatDecrease(delta) {
        this._weight.addScaleValue(delta, SystemFunctionTypes.line);
        this._speed.addScaleValue(delta, SystemFunctionTypes.line);
        this._systemState.addScaleValue(delta, SystemFunctionTypes.line);
    }

    
    changeSpeed(delta){
        this._speed.addScaleValue(delta,SystemFunctionTypes.line);
        this.verificationMark(delta)? this.trigger(events.speed.increase,delta):this.trigger(events.speed.decrease,delta);
    }
    changeWeight(delta){
        this._weight.addScaleValue(delta,SystemFunctionTypes.line);
        this.verificationMark(delta)? this.trigger(events.weight.increase,delta):this.trigger(events.weight.decrease,delta);
    }
    


}

export { MuscularSystem };