import { MemorySystem, CirculatorySystem, IdentificationSystem, FoodSystem, SensesSystem, MuscularSystem, RespiratorySystem } from './models';
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
     * Creates an instance of Animal.
     * 
     * 
     * @memberOf Animal
     */
    constructor(){
        this.memory=new MemorySystem();      
        this.circulatory=new CirculatorySystem();        
        this.food=new FoodSystem();
        this.identification=new IdentificationSystem();
        this.muscular=new MuscularSystem();
        this.senses=new SensesSystem();
        this.respiratory=new RespiratorySystem();   //   
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

}

