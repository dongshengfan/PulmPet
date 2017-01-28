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
        this.analyzeSystem();
    }

    onPressureDecrease(delta) {  
        this._weight.addScaleValue(-delta, SystemFunctionTypes.line);
        this._speed.addScaleValue(delta, SystemFunctionTypes.line);
        this.analyzeSystem();
    }

    onHeartbeatIncrease(delta) {
        this._weight.addScaleValue(-delta, SystemFunctionTypes.line);
        this._speed.addScaleValue(delta, SystemFunctionTypes.line);
        this.analyzeSystem();
    }
    
    onHeartbeatDecrease(delta) {
        this._weight.addScaleValue(delta, SystemFunctionTypes.line);
        this._speed.addScaleValue(delta, SystemFunctionTypes.line);
        this.analyzeSystem();
    }

    
    changeSpeed(delta){
        this._speed.addScaleValue(delta,SystemFunctionTypes.line);
        this.analyzeSystem();   
        this.verificationMark(delta)? this.trigger(events.speed.increase,delta):this.trigger(events.speed.decrease,delta);
    }
    changeWeight(delta){
        this._weight.addScaleValue(delta,SystemFunctionTypes.line); 
        this.analyzeSystem();
        this.verificationMark(delta)? this.trigger(events.weight.increase,delta):this.trigger(events.weight.decrease,delta);
    }
    
     
    /**
     * Анализирует показатели системы выводя вердикт о состоянии
     * 
     * @memberOf MuscularSystem
     */
    analyzeSystem(){
        this._systemState.analyze([
            {
                scale: 100-this._weight.scale
            },
            { 
                scale: this._speed.scale
            }
        ]);
    }


}

export { MuscularSystem };