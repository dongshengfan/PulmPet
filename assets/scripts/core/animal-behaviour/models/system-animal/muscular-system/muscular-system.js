import {Systems} from '../systems';
/**
 * Класс опорно-двигательной системы
 * {Скорость передвижения, вес}
 * @export
 * @class MuscularSystem
 */
export class MuscularSystem extends Systems{
    
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
     * @type {Speed} объект скорости
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
     * Скорость передвижения
     * @type {Weight} объект веса
     * 
     */
    _weight;

    /**
     * Приватная есть в которой состоит данная система . Для вляния надругих подписчиков
     * 
     * 
     * @memberOf MuscularSystem
     */
    _miniNet;
    constructor() {
        super();
        this._speed={
            current:0,
            min:0,
            max:0,
            scale:0
        };
        this._weight={
            current:0,
            min:0,
            max:0,
            scale:0
        }
    }
   
    /**
     * Обновление системы на какую то часть от обновления другой системы  
     * 
     * @param {number} value
     * 
     * @memberOf MuscularSystem
     */
    update(value){

    }
    /**
     * Публикует в своем сектанском круге свои изменения
     * 
     * @param {number} message
     * 
     * @memberOf MuscularSystem
     */
    publisher(message) {
        this._miniNet.publisher(message);
    }


    /**
     * Анализирует систему . Производит расчет шкал по имеющимся параметрам
     * 
     * 
     * @memberOf MuscularSystem
     */
    analysisSystem(){
        this._speed.scale=this._getPercentageInScale(this._speed.current,this._speed.max,this._speed.min);
        this._weight.scale=this._getPercentageInScale(this._weight.current,this._weight.max,this._weight.min);      
    }    
    
//Ждут предназначения
    /**
     * Устанавливает знащение шкалы скорости. Чев вышзначение тем быстрея движется животноеи вышенекоторые другие показатели
     * 
     * @param {Number} value
     * 
     * @memberOf MuscularSystem
     */
    setScaleSpeed(value){
        let rez=this._speed.scale+value;
        if(rez<=100&&rez>=0){
            this._speed.scale+=value;
        }
        this._speed.current=this._getCurrentValueOnScale(this._speed.scale,this._speed.max,this._speed.min);
   
    }
    /**
     * Устанавливает значениешкалы весаю Чем выше тем меньше скорость животного
     * 
     * @param {any} value
     * 
     * @memberOf MuscularSystem
     */
    setScaleWeight(value){
        let rez=this._weight.scale+value;
        if(rez>=0){
        this._weight.scale+=value;
        }
        this._weight.current=this._getCurrentValueOnScale(this._weight.scale,this._weight.max,this._weight.min);
        this.updatePropertyScaleWeight();
    }

    ///Надо что-то с этим сделать)

    /**
     * Инициализация
     * 
     * @param {_maxSpeed} maxSpeed максимальная скорость
     * @param {Number} minSpeed минимальная скорость
     * @param {Number} maxWeight максимальный вес
     * @param {Number} minWeight минимальный вес
     * 
     * @memberOf MuscularSystem
     */
    init(maxSpeed,minSpeed,maxWeight,minWeight){
        this._speed.max=maxSpeed;
        this._speed.min=minSpeed;
        this._weight.max=maxWeight;
        this._weight.min=minWeight;

        this._speed.current=(maxSpeed-minSpeed)/2;
        this._weight.current=minWeight;
        this.analysisSystem();
        
    }
}