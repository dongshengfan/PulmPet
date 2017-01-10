/**
 * Класс системы идентификации животного
 * 
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
     * Шкала возраста. Отражает уровень агрессии по 100 бальной шкале. Чем больше тем старее животное.
     * 
     * @type {Number} значение возраста в процентах 
     * @memberOf IdentificationSystem
     */
    scaleAge;

  

    /**
     * Анализирует систему идентификации
     * 
     * 
     * @memberOf IdentificationSystem
     */
    analysisSystem(){
        this.analysisAge();   
    }
    /**
     * Анализирует свой возраст 
     * 
     * @returns {scaleAge}
     * 
     * @memberOf IdentificationSystem
     */
    analysisAge(){
        return this.scaleAge=(this.currentAge*100)/(this.maxAge-this.minAge);  
    }

    /**
     * Инициализация параметров системы инициализации животного
     * 
     * @param {Number} id айди животного
     * @param {Boolean} predator хищник ли это
     * @param {Number} maxAgeAnimal максимальныйвозраст
     * @param {Number} minAgeAnimal минимальный возраст
     * 
     * @memberOf IdentificationSystem
     */
    init(id,predator,maxAgeAnimal,minAgeAnimal){
        this.id=id;
        this.isPredator=predator;
        this.maxAge=maxAgeAnimal;
        this.minAge=minAgeAnimal;
  

        this.currentAge=minAgeAnimal;
        this.analysisSystem();

    }


}