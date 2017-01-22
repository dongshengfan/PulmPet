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
     * @typedef Pressure
     * @type {Object} 
     * @property {number} current текущее давление
     * @property {number} min минимальное давление
     * @property {number} max максимальное давление
     * @property {number} scale шкала давления в процентах
     */   
    /**
     * Давление кровиностной системы
     * @type {Pressure} объект скорости
     */
    _pressure;
    /**
     * @typedef Heartbeat
     * @type {Object} 
     * @property {number} current текущее сердцебиение
     * @property {number} min минимальное сердцебиение
     * @property {number} max максимальное сердцебиение
     * @property {number} scale шкала сердцебиения в процентах
     */   
    /**
     * Сердцебиение
     * @type {Heartbeat} объект веса
     * 
     */
    _heartbeat;

    /**
     * Creates an instance of CirculatorySystem.
     * 
     * 
     * @memberOf CirculatorySystem
     */
    constructor(){
        super();
        this._pressure={
            current:0,
            min:0,
            max:0,
            scale:0
        };
        this._heartbeat={
            current:0,
            min:0,
            max:0,
            scale:0
        };
    }

   /* _update(value){
        let procSpeed=this.percentageImpact*value;
        let pred=this._pressure.scale;
        this._setScalePressure(procSpeed);
        this._publisher(this._pressure.scale-pred);
        let procWeight=this.percentageImpact*value;
        pred=this._heartbeat.scale;
        this._setScaleHeartbeat(procWeight);
        this._publisher(this._heartbeat.scale-pred);
    }*/
    /**
     * Анализирует систему . Производит расчет шкал по имеющимся параметрам
     * 
     * 
     * @memberOf CirculatorySystem
     */
  /*  _analysisSystem(){
        let pred=this._pressure.scale;
        this._pressure.scale=this._getPercentageInScale(this._pressure.current,this._pressure.max,this._pressure.min);
        this._publisher(this._pressure.scale-pred);

        pred=this._heartbeat.scale;
        this._heartbeat.scale=this._getPercentageInScale(this._heartbeat.current,this._heartbeat.max,this._heartbeat.min);     
         this._publisher(this._heartbeat.scale-pred);
    }   */ 
    

    /**
     * Устанавливает знащение шкалы давления. Чев выше значение тем быстрея стареет животное и ...
     * 
     * @param {number} value дельта какого-либо изменения
     * 
     * @memberOf CirculatorySystem
     */
    _setScalePressure(value){
        this._addScaleValue(this._pressure,value);     
    }

    /**
     * Устанавливает знащение шкалы сердцебиения. Чев выше значение тем быстрея происходит обмен веществ и снижается показатель сытости и ...
     * 
     * @param {number} value
     * 
     * @memberOf CirculatorySystem
     */
    _setScaleHeartbeat(value){
        this._addScaleValue(this._heartbeat,value);        
    }
}
 
 export { CirculatorySystem };