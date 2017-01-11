/**
 * Класс системы идентификации животного. 
 * {ИД,Время сна, возвраст, разделение на хищьник/жертва}
 * @export
 * @class IdentificationSystem
 */
export class IdentificationSystem{
    /**
     * Айди животного
     * 
     * @type {Number} айди животного
     * @memberOf IdentificationSystem
     */
    id;
    /**
     * Cообщает о том является ли эта особь хищником
     * 
     * @type {Boolean} true - если хищник 
     * @memberOf IdentificationSystem
     */
    isPredator;

    /**
     * Продолжительность сна животного
     * 
     * @type {Number} число в секундах
     * @memberOf Animal
     */
    currentTimeToSleep;
    /**
     * Максимальная продолжительность сна у животного
     * 
     * @type {Number} число в секундах
     * @memberOf IdentificationSystem
     */
    maxTimeToSleep;
    /**
     * Минимальная продолжительность сна у животного
     * 
     * @type {Number} число в секундах
     * @memberOf IdentificationSystem
     */
    minTimeToSleep;


    /**
     * Текущий возраст животного
     * 
     * @type {Number} текущий возраст в месяцах
     * @memberOf IdentificationSystem
     */
    currentAge;
    /**
     * Максимальный возраст животного
     * 
     * @type {Number} возраст в месяцах
     * @memberOf IdentificationSystem
     */
    maxAge;
    /**
     * Минимальный возраст животного
     * 
     * @type {Number} возраст в месяцах
     * @memberOf IdentificationSystem
     */
    minAge;
    

    /**
     * Шкала возраста. Отражает уровень возвраста по 100 бальной шкале. Чем больше тем старее животное.
     * 
     * @type {Number} значение возраста в процентах 
     * @memberOf IdentificationSystem
     */
    scaleAge;
    /**
     * Шкала продолжительности сна у животного. по 100 бальной шкале. Чем вышетем лучше чувствует себя животное.
     * 
     * @type {Number} значение продолжительности сна в процентах
     * @memberOf IdentificationSystem
     */
    scaleTimeToSleep;
  

    /**
     * Анализирует систему идентификации
     * 
     * 
     * @memberOf IdentificationSystem
     */
    analysisSystem(){
        this.analysisAge();   
        this.analysisTimeToSleep();
    }
    /**
     * Анализирует свой возраст 
     * 
     * @returns {scaleAge}
     * 
     * @memberOf IdentificationSystem
     */
    analysisAge(){
        return this.scaleAge=this._getScale(this.currentAge,this.maxAge,this.minAge);  
    }
    /**
     * Анализирует состояние своего сна
     * 
     * @returns {scaleTimeToSleep}
     * 
     * @memberOf IdentificationSystem
     */
    analysisTimeToSleep(){
        return this.scaleTimeToSleep=this._getScale(this.currentTimeToSleep,this.maxTimeToSleep,this.minTimeToSleep);
    }
    /**
     * Считате процент шкал
     * 
     * @param {Number} current текущее значение
     * @param {Number} max максимальное значение
     * @param {Number} min минимальное значение
     * @returns {Number}
     * 
     * @memberOf IdentificationSystem
     */
    _getScale(current,max,min){
        return ((current-min)*100)/(max-min);
    }

    /**
     * Производит установку пргресса шкалы сна и согласно этой шкале устанавливает значение сна. Чем выше тем дольше животное спит.
     * 
     * @param {Number} value
     * 
     * @memberOf IdentificationSystem
     */
    setScaleTimeToSleep(value){
        let rez=this.scaleTimeToSleep+value;
        if(rez<=100&&rez>=0){
            this.scaleTimeToSleep+=value;
        }
        this.updatePropertyScaleTimeToSleep();
    }
    /**
     * Производит установку прогресса шкалы возраста и согласно этой шкале устанавливает значение возраста.  Чем больше тем старее животное.
     * 
     * @param {Number} value
     * 
     * @memberOf IdentificationSystem
     */
    setScaleAge(value){
        let rez=this.scaleAge+value;
        if(rez<=100&&rez>=0){
            this.scaleAge=rez;
        }
        this.updatePropertyScaleAge();
    }
    /**
     * Выполняет обновление текущего показателся сна на основе показателя шкалы
     * 
     * 
     * @memberOf IdentificationSystem
     */
    updatePropertyScaleTimeToSleep(){
        this.currentTimeToSleep=(((this.maxTimeToSleep-this.minTimeToSleep)/100)*this.scaleTimeToSleep)+this.minTimeToSleep;
    }
    /**
     * Выполняет обновление текущего возраста на основе показателя шкалы
     * 
     * 
     * @memberOf IdentificationSystem
     */
    updatePropertyScaleAge(){
        this.currentAge=(((this.maxAge-this.minAge)/100)*this.scaleAge)+this.minAge;
    }




    /**
     * Инициализация параметров системы инициализации животного
     * 
     * @param {Number} id айди животного
     * @param {Boolean} predator хищник ли это
     * @param {Number} maxAgeAnimal максимальныйвозраст
     * @param {Number} minAgeAnimal минимальный возраст
     * @param {Number} maxTimeToSleep максимальная продолжительность сна
     * @param {Number} minTimeToSleep минимальный продолжительности сна
     * 
     * @memberOf IdentificationSystem
     */
    init(id,predator,maxAgeAnimal,minAgeAnimal,maxTimeToSleep,minTimeToSleep){
        this.id=id;
        this.isPredator=predator;
        this.maxAge=maxAgeAnimal;
        this.minAge=minAgeAnimal;
        this.maxTimeToSleep=maxTimeToSleep;
        this.minTimeToSleep=minTimeToSleep;

        this.currentTimeToSleep=maxTimeToSleep;
        this.currentAge=minAgeAnimal;
        this.analysisSystem();

    }


}