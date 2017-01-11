/**
 * Класс сердечнососудистая системы
 * {Давление,Седцебиение}
 * @export
 * @class CirculatorySystem
 */
export class CirculatorySystem{
    /**
     * Давление животного
     * 
     * @type {Number}
     * @memberOf CirculatorySystem
     */
    currentPressure;
    /**
     * Максимально-допустимое значение давления для этого живоного
     * 
     * @type {Number} 
     * @memberOf CirculatorySystem
     */
    maxPressure;
    /**
     * Минимально-допустимое значение давления
     * 
     * @type {Number}
     * @memberOf CirculatorySystem
     */
    minPressure;
    /**
     * Нормальное давление для этого животного.
     * 
     * @type {Number}
     * @memberOf CirculatorySystem
     */
    normPressure;
    /**
     * Сердцебиение
     * 
     * @type {Number}
     * @memberOf CirculatorySystem
     */
    currentHeartbeat;
    /**
     * Максимально допустимое сердцебиение
     * 
     * @type {Number}
     * @memberOf CirculatorySystem
     */
    maxHeartbeat;
    /**
     * Минимально-допустимое сердцебиение
     * 
     * @type {Number}
     * @memberOf CirculatorySystem
     */
    minHeartbeat;
    /**
     * Нормальное сердцебиение
     * 
     * @type {Number}
     * @memberOf CirculatorySystem
     */
    normHeartbeat;
    /**
     * Шкала состояния давления. Чем выше тем хуже чувствует себя животное.
     * 
     * @type {Number}
     * @memberOf CirculatorySystem
     */
    scalePressure;
    /**
     * Шкала состояния сердцебиения. Чем выше по процентам тем хуже чувствует себя животное.
     * 
     * 
     * @memberOf CirculatorySystem
     */
    scaleHeartbeat;

    /**
     * Анализирует систему в целом
     * 
     * 
     * @memberOf CirculatorySystem
     */
    analysisSystem(){
        this.analysisHeartbeat();
        this.analysisPressure();
    }
    /**
     * Анализирует давление
     * 
     * @returns {Number} Значение шкалы давления чем выше те выше отклонение от нормы
     * 
     * @memberOf CirculatorySystem
     */
    analysisPressure(){
        let raz=this.normPressure-this.currentPressure;
        if(raz<0){
            this.scalePressure=this._getScale(-1*raz,this.maxPressure,this.normPressure);
        }else if(raz>0){
            this.scalePressure=this._getScale(raz,this.normPressure,this.minPressure);
        }else{
            this.scalePressure=0;
        }
        return this.scalePressure;
    }
    /**
     * Анализирует сердцебиение
     * 
     * @returns {Number} значение сердцебиения по 100 бальной шкале
     * 
     * @memberOf CirculatorySystem
     */
    analysisHeartbeat(){
        let raz=this.normHeartbeat-this.currentHeartbeat;
        if(raz<0){
            this.scaleHeartbeat=this._getScale(-1*raz,this.maxHeartbeat,this.normHeartbeat);
        }else if(raz>0){
            this.scaleHeartbeat=this._getScale(raz,this.normHeartbeat,this.minHeartbeat);
        }else{
            this.scaleHeartbeat=0;
        }
        return this.scaleHeartbeat;

    }
    /**
     * Считате процент шкал
     * 
     * @param {Number} current текущее значение
     * @param {Number} max максимальное значение
     * @param {Number} min минимальное значение
     * @returns {Number}
     * 
     * @memberOf CirculatorySystem
     */
    _getScale(current,max,min){
        return (current*100)/(max-min);
    }


    init(){

    }

}