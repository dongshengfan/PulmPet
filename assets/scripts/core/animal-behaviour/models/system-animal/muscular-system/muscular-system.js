/**
 * Класс опорно-двигательной системы
 * {Скорость передвижения, вес}
 * @export
 * @class MuscularSystem
 */
export class MuscularSystem{
    /**
     * Текущая скорость передвижения животного
     * 
     * @type {Number} 0.0
     * @memberOf MuscularSystem
     */
    currentSpeed;
    /**
     * Максимальная скорость передвижения животного
     * 
     * @type {Number} 0.0
     * @memberOf MuscularSystem
     */
    _maxSpeed;
    /**
     * Минимальная скорость передвижения животного
     * 
     * @type {Number} 0.0
     * @memberOf MuscularSystem
     */
    _minSpeed;
    /**
     * Текущий вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf MuscularSystem
     */
    currentWeight;
    /**
     * Максимальный вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf MuscularSystem
     */
    _maxWeight;
    /**
     * Минимальный вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf MuscularSystem
     */
    _minWeight;
    /**
     * Шкала скорости. Чем выше значение тем выше истощение организма
     * 
     * @type {Number}
     * @memberOf MuscularSystem
     */
    scaleSpeed;
    /**
     * Шкала веса. Чем выше значение тем ниже скорость, выше давление, 
     * 
     * 
     * @memberOf MuscularSystem
     */
    scaleWeight;
    /**
     * Анализирует систему . Производит расчет шкал по имеющимся параметрам
     * 
     * 
     * @memberOf MuscularSystem
     */
    analysisSystem(){
        this.analysisSpeed();
        this.analysisWeight();
    }    
    analysisSpeed(){
        return this.scaleSpeed=this._getScale(this.currentSpeed,this._maxSpeed,this._minSpeed);
    }
    analysisWeight(){
        return this.scaleWeight=this._getScale(this.currentWeight,this._maxWeight,this._minWeight);
    }

    /**
     * Устанавливает знащение шкалы скорости. Чев вышзначение тем быстрея движется животноеи вышенекоторые другие показатели
     * 
     * @param {Number} value
     * 
     * @memberOf MuscularSystem
     */
    setScaleSpeed(value){
        let rez=this.scaleSpeed+value;
        if(rez<=100&&rez>=0){
            this.scaleSpeed+=value;
        }
        this.updatePropertyScaleSpeed();
    }

    /**
     * Устанавливает значениешкалы весаю Чем выше тем меньше скорость животного
     * 
     * @param {any} value
     * 
     * @memberOf MuscularSystem
     */
    setScaleWeight(value){
        let rez=this.scaleWeight+value;
        if(rez>=0){
        this.scaleWeight+=value;
        }
        this.updatePropertyScaleWeight();
    }

    updatePropertyScaleSpeed(){
        this.currentSpeed=(((this._maxSpeed-this._minSpeed)/100)*this.scaleSpeed)+this._minSpeed;
    }
    updatePropertyScaleWeight(){
        this.currentWeight=(((this._maxWeight-this._minWeight)/100)*this.scaleWeight)+this._minWeight;

    }

    /**
     * Считате процент шкал
     * 
     * @param {Number} current текущее значение
     * @param {Number} max максимальное значение
     * @param {Number} min минимальное значение
     * @returns {Number}
     * 
     * @memberOf MuscularSystem
     */
    _getScale(current,max,min){
        return ((current-min)*100)/(max-min);
    }

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
        this._maxSpeed=maxSpeed;
        this._minSpeed=minSpeed;
        this._maxWeight=maxWeight;
        this._minWeight=minWeight;

        this.currentSpeed=(maxSpeed-minSpeed)/2;
        this.currentWeight=minWeight;
        this.analysisSystem();
    }
}