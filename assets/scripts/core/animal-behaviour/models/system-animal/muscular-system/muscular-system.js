import { System } from '../system';
import { SystemScale } from '../../system-scales/system-scale';

/**
 * Класс опорно-двигательной системы
 * {Скорость передвижения, вес}
 * @export
 * @class MuscularSystem
 */
export class MuscularSystem extends System{
    
    /**
     * @typedef Speed
     * @type {Object} 
     * @property {number} current текущая скорость
     * @property {number} min минимальная скорость
     * @property {number} max максимальная скорость
     * @property {number} scale шкала скорости в процентах
     */   
    /**
     * Скорость передвижения
     * @type {SystemScale} объект скорости
     */
    _speed;
    /**
     * @typedef Weight
     * @type {Object} 
     * @property {number} current текущий вес
     * @property {number} min минимальный вес
     * @property {number} max максимальный вес
     * @property {number} scale шкала веса в процентах
     */   
    /**
     * Вес животного
     * @type {SystemScale} объект веса
     * 
     */
    _weight;

    
    constructor() {
        super();
        this._speed  = new SystemScale();
        this._weight = new SystemScale();
    }
   
    onAgeIncrease(delta) {
        this._speed.addScaleValue(-delta);
        this._weight.addScaleValue(delta);
    }

   /* _update(value){
        let procSpeed=this.percentageImpact*value;
        let pred=this._speed.scale;
        this._setScaleSpeed(procSpeed);
        this._publisher(this._speed.scale-pred);

        let procWeight=this.percentageImpact*value;
        pred=this._weight.scale;
        this._setScaleWeight(procWeight);
        this._publisher(this._weight.scale-pred);
    }*/

    

    /**
     * Анализирует систему . Производит расчет шкал по имеющимся параметрам. Применяется только после изменения какихто конкретных параметров
     * 
     * 
     * @memberOf MuscularSystem
     */
   /* _analysisSystem(){
        let pred=this._speed.scale;
        this._speed.scale=this._getPercentageInScale(this._speed.current,this._speed.max,this._speed.min);
        this._publisher(this._speed.scale-pred);

        pred=this._weight.scale;
        this._weight.scale=this._getPercentageInScale(this._weight.current,this._weight.max,this._weight.min);     
        this._publisher(this._weight.scale-pred);

    }    */
    

    /**
     * Устанавливает значение шкалы скорости. Чев выше значение тем быстрее движется животное и
     * выше некоторые другие показатели
     * 
     * @param {number} value
     * 
     * @memberOf MuscularSystem
     */
    /*_setScaleSpeed(value){
        this._addScaleValue(this._speed,value);
    }*/
    /**
     * Устанавливает значениешкалы весаю Чем выше тем меньше скорость животного
     * 
     * @param {number} value
     * 
     * @memberOf MuscularSystem
     */
    /*_setScaleWeight(value){
        this._addScaleValue(this._weight,value);
    }*/
}