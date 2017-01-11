/**
 * Класс опорно-двигательной системы
 * 
 * @export
 * @class MuscularSystem
 */
export class MuscularSystem{
    /**
     * Текущая скорость передвижения животного
     * 
     * @type {Number} 0.0
     * @memberOf MuscularSystem
     */
    currentSpeed;
    /**
     * Максимальная скорость передвижения животного
     * 
     * @type {Number} 0.0
     * @memberOf MuscularSystem
     */
    _maxSpeed;
    /**
     * Минимальная скорость передвижения животного
     * 
     * @type {Number} 0.0
     * @memberOf MuscularSystem
     */
    _minSpeed;
    /**
     * Текущий вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf MuscularSystem
     */
    currentWeight;
    /**
     * Максимальный вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf MuscularSystem
     */
    _maxWeight;
    /**
     * Минимальный вес животного
     * 
     * @type {Number} вес 0.0
     * @memberOf MuscularSystem
     */
    _minWeight;

}