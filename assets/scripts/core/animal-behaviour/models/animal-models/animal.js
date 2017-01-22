
import { MuscularSystem, CirculatorySystem} from '../system-animal/export-system-animal';

/**
 * Класс животное
 * 
 * @export
 * @class Animal
 */
class Animal { 

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
     * Опорно-двигательная система/аппарат
     * 
     * @type {MuscularSystem} Класс опорно-двигательного аппарата
     * @memberOf Animal
     */
    muscular;

    
    

    /**
     * Creates an instance of Animal.
     * 
     * 
     * @memberOf Animal
     */
    constructor(){
        //this.circulatory=new CirculatorySystem();
        //this.circulatory.percentageImpact=0.1;
        //this.muscular=new MuscularSystem();
        //this.muscular.percentageImpact=0.1;
        //this.mediator=new Mediator();
        //регистрируем системы жизнеобеспечения
        //this.mediator.register(this.muscular);
        //this.mediator.register(this.circulatory); 
    }



    //todo перенести 
    /*
    lifeM(){
        this.muscular.analysisSystem();

    }
    lifeC(){
        this.circulatory.analysisSystem();
    }
    */
//Методы для состояний

    /**
     * Возраст воздействует на другие параметры 
     * 
     * @param {Number} value значение на сколько процентов изменился возраст
     * 
     * @memberOf Animal
     */
   /* ageActs(value){
        
        this.identification.setScaleAge(1*value);
        this.muscular.setScaleSpeed(-1*value);
        this.identification.setScaleTimeToSleep(1*value);
        this.muscular.setScaleWeight(1*value);
}*/

    /**
     * Вес воздействует на другие параметры
     * 
     * @param {Number} value значение на сколько процентов изменился вес
     * 
     * @memberOf Animal
     */
   /* weightActs(value){
        this.muscular.setScaleWeight(1*value);
        this.identification.setScaleTimeToSleep(1*value);
        this.muscular.setScaleSpeed(-1*value);
}*/

    /**
     * Время сна воздействует на другие параметры
     * 
     * @param {Number} value значение на сколько процентов изменилось время сна
     * 
     * @memberOf Animal
     */
   /* timeToSleepActs(value){
        this.identification.setScaleTimeToSleep(1*value);
        this.muscular.setScaleSpeed(1*value);
        this.muscular.setScaleWeight(1*value);
}*/

    /**
     * Скорость воздействует на другие параметры
     * 
     * @param {Number} value значение на сколько процентов изменилась скорость 
     * 
     * @memberOf Animal
     */
   /* speedActs(value){
        this.muscular.setScaleSpeed(1*value);
        this.muscular.setScaleWeight(-1*value);
}*/

}

export { Animal };