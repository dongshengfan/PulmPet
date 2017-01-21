//import {Systems} from './systems';
/**
 * Класс системы идентификации животного. 
 * {ИД,Время сна, возвраст, разделение на хищьник/жертва}
 * @export
 * @class IdentificationSystem
 */
export class IdentificationSystem {
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
  


}