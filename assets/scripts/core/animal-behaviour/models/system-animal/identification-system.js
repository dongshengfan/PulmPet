/**
 * Класс системы идентификации животного
 * 
 * @export
 * @class IdentificationSystem
 */
export class IdentificationSystem{
    /**
     * Имя особи
     * 
     * @type {String} строка
     * @memberOf IdentificationSystem
     */
    name;
    /**
     * Cообщает о том является ли эта особь хищником
     * 
     * @type {Boolean} true - если хищник 
     * @memberOf IdentificationSystem
     */
    isPredator;
    /**
     * Текущий уровень агрессии животного
     * 
     * @type {Number} текущий уровень агрессии
     * @memberOf IdentificationSystem
     */
    currentAggressionLevel;
    /**
     * Максимальный уровень агрессии
     * 
     * @type {Number} уровень агрессии
     * @memberOf IdentificationSystem
     */
    maxAggressionLevel;
    /**
     * Минимальный уровень агрессии
     * 
     * @type {Number} уровень агрессии
     * @memberOf IdentificationSystem
     */
    minAggressionLevel;
    /**
     * Текущий возраст животного
     * 
     * @type {Number} текущий возраст
     * @memberOf IdentificationSystem
     */
    currentAge;
    /**
     * Максимальный возраст животного
     * 
     * @type {Number} возраст
     * @memberOf IdentificationSystem
     */
    maxAge;
    /**
     * Минимальный возраст животного
     * 
     * @type {Number} возраст
     * @memberOf IdentificationSystem
     */
    minAge;


    constructor(){
        
    }
}