/**
 * Подлежит удалению
 * 
 * @export
 * @class LeftSystem
 */
export class LeftSystem{
     
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
}