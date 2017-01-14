
import {IdentificationSystem, MuscularSystem, MemorySystem, FoodSystem, Mediator} from './system-animal/export-system';

/**
 * Класс животное
 * 
 * @export
 * @class Animal
 */
export class Animal { 

    /**
     * Позиция в которой находится животное фактически
     * 
     * @type {cc.Vec2} 
     * @memberOf Animal
     */
    currentPosition;
    /**
     * Цель для движения
     * 
     * @type {cc.Vec2}
     * @memberOf Animal
     */
    targetPosition;

    /**
     * Система памяти животного
     * 
     * @type {MemorySystem} Класс системы памяти
     * @memberOf Animal
     */
    memory;
    /**
     * Сердечнососудистая система 
     * 
     * @type {CirculatorySystem} Класс сердечнососудистой системы
     * @memberOf Animal
     */
    circulatory;
    /**
     * Система идентификации животного
     * 
     * @type {IdentificationSystem} Класс системы идентификации
     * @memberOf Animal
     */
    identification;
    /**
     * Система пищеварения
     * 
     * @type {FoodSystem} Класс системы пищеварения 
     * @memberOf Animal
     */
    food;
    /**
     * Система органов чувств
     * 
     * @type {SensesSystem} Класс органов чувств
     * @memberOf Animal
     */
    senses;
    /**
     * Опорно-двигательная система/аппарат
     * 
     * @type {MuscularSystem} Класс опорно-двигательного аппарата
     * @memberOf Animal
     */
    muscular;
    /**
     * Дыхательная система
     * 
     * @type {RespiratorySystem} Класс дыхательной системы
     * @memberOf Animal
     */
    respiratory;
    
    /**
     * Посредник в общении систем 
     * 
     * @type {Mediator}
     * @memberOf Animal
     */
    mediator;

    /**
     * Creates an instance of Animal.
     * 
     * 
     * @memberOf Animal
     */
    constructor(){
        //this.memory=new MemorySystem();      
       // this.circulatory=new CirculatorySystem();        
       // this.food=new FoodSystem();
        this.identification=new IdentificationSystem();
        this.muscular=new MuscularSystem();
        this.mediator=new Mediator();
        this.mediator.register(this.muscular);
      //  this.senses=new SensesSystem();
       
    }


    /**
     * Возраст воздействует на другие параметры 
     * 
     * @param {Number} value значение на сколько процентов изменился возраст
     * 
     * @memberOf Animal
     */
    ageActs(value){
        
        this.identification.setScaleAge(1*value);
        this.muscular.setScaleSpeed(-1*value);
        this.identification.setScaleTimeToSleep(1*value);
        this.muscular.setScaleWeight(1*value);
    }

    /**
     * Вес воздействует на другие параметры
     * 
     * @param {Number} value значение на сколько процентов изменился вес
     * 
     * @memberOf Animal
     */
    weightActs(value){
        this.muscular.setScaleWeight(1*value);
        this.identification.setScaleTimeToSleep(1*value);
        this.muscular.setScaleSpeed(-1*value);
    }

    /**
     * Время сна воздействует на другие параметры
     * 
     * @param {Number} value значение на сколько процентов изменилось время сна
     * 
     * @memberOf Animal
     */
    timeToSleepActs(value){
        this.identification.setScaleTimeToSleep(1*value);
        this.muscular.setScaleSpeed(1*value);
        this.muscular.setScaleWeight(1*value);
    }

    /**
     * Скорость воздействует на другие параметры
     * 
     * @param {Number} value значение на сколько процентов изменилась скорость 
     * 
     * @memberOf Animal
     */
    speedActs(value){
        this.muscular.setScaleSpeed(1*value);
        this.muscular.setScaleWeight(-1*value);
    }



    /**
     * Возвращает значение шкалы возраста у животного
     * 
     * @returns {Number} процент прожитой жизни
     * 
     * @memberOf Animal
     */
    getValueScaleAge(){
        return this.identification.analysisAge();
    }       
    /**
     * Возвращает значение шкалы обезвоживания
     * 
     * @returns {Number}
     * 
     * @memberOf Animal
     */
    getValueScaleWater(){
        return this.food.analysisWater();
    }
    /**
     * Возвращает значение шкалы сытости. 
     * 
     * @returns {Number}
     * 
     * @memberOf Animal
     */
    getValueScaleEater(){
        return this.food.analysisEater();
    }
    /**
     * Возвращает значение шкалы продолжительности сна
     * 
     * @returns {Number}
     * 
     * @memberOf Animal
     */
    getValueScaleTimeToSleep(){
        return this.identification.analysisTimeToSleep();
    }
    /**
     * Возвращает значение шкалы скорости
     * 
     * 
     * @memberOf Animal
     */
    getValueScaleSpeed(){
      //  return this.muscular.analysisSpeed();
    }
    /**
     * Возвращает значение шкалы веса.
     * 
     * 
     * @memberOf Animal
     */
    getValueScaleWeight(){
      //  return this.muscular.analysisWeight();
    }

}

