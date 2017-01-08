
import { Brain } from './models';

/**
 * Класс животное
 * 
 * @export
 * @class Animal
 */
export class Animal { 
    /**
     * Имя животного
     * 
     * @type {String} строка
     * @memberOf Animal
     */
    name;
    /**
     * Текущая скорость животного
     * 
     * @type {Number} 0.0
     * @memberOf Animal
     */
    currentSpeed;
    /**
     * Максимальная скорость животного
     * 
     * @type {Number} 0.0
     * @memberOf Animal
     */
    _maxSpeed;
    /**
     * Минимальная скорость животного
     * 
     * @type {Number} 0.0
     * @memberOf Animal
     */
    _minSpeed;
    /**
     * Процент выносливости животного
     * 
     * @type {Number} процент
     * @memberOf Animal
     */
    percentageStamina;
    /**
     * Процент сытости животного
     * 
     * @type {Number} процент
     * @memberOf Animal
     */
    percentageSatiety;
    /**
     * Процент обезвоживания животного
     * 
     * @type {Number} процент 
     * @memberOf Animal
     */
    percentageDehydration;
    /**
     * Текущий вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf Animal
     */
    currentWeight;
    /**
     * Максимальный вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf Animal
     */
    _maxWeight;
    /**
     * Минимальный вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf Animal
     */
    _minWeight;
    /**
     * Продолжительность сна животного
     * 
     * @type {Number} число в секундах
     * @memberOf Animal
     */
    timeToSleep;
    /**
     * Цель позиции для движения
     * 
     * @type {cc.Vec2}
     * @memberOf Animal
     */
    targetPosition;
    /**
     * Позиция в которой находится животное фактически
     * 
     * @type {cc.Vec2} 
     * @memberOf Animal
     */
    currentPosition;
    /**
     * Мозги животного, которые знают где что было или где что найти
     * 
     * @type {Memory} класс памяти
     * @memberOf Animal
     */
    myBrain;
    
    /**
     * Creates an instance of Animal.
     * 
     * 
     * @memberOf Animal
     */
    constructor(){        
        this.arrPointsWater=[];
        this.arrPointsGrass=[];
        this.arrPointsVictim=[];        
        this.myBrain=new Brain();
    }
    
    /**
     * Возвращает ближаюшую точку с водой из памяти
     * 
     * @returns {cc.Vec2|null} null если точка не найдена иначе точку
     * 
     * @memberOf Animal
     */
    getPointWater(){
       return this.myBrain.needWater();
    }
    /**
     * Возвращает ближаюшую точку с травой из памяти
     * 
     * @returns {cc.Vec2|null} null если точка не найдена иначе точку
     * 
     * @memberOf Animal
     */
    getPointGrass(){
       return this.myBrain.needGrass();
    }
    /**
     * Возвращает ближаюшую точку из памяти где последний раз видел жертву
     * 
     * @returns {cc.Vec2|null} null если точка не найдена иначе точку
     * 
     * @memberOf Animal
     */
    getPointVictim(){
        return this.myBrain.needVictim();
    }
    
    /**
     * Заносит в память животного тайлд с водой
     * 
     * @param {cc.Vec2} point тайлд с водой
     * 
     * @memberOf Animal
     */
   /* setPointWater(point){
       // this.arrPointsWater.push(point);
    }
    setPointGrass(point){
       // this.arrPointsGrass.push(point);
    }
    setPointVictim(point){
       // this.arrPointsVictim.push(point);
    }*/

   //--------------Еще не определено
    /**
     * Обновление процента выносливости и других параметров животного по какому-либо алгоритму 
     * 
     * 
     * @memberOf Animal
     */
    updatePercentageStamina(){};
    /**
     * Обновление процента сытости и других параметров животного по какому-либо алгоритму 
     * 
     * 
     * @memberOf Animal
     */
    updatePercentageSatiety(){};

}

