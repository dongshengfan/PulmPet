/**
 * Класс системы питания
 * 
 * @export
 * @class FoodSystem
 */
export class FoodSystem{
 
    /**
     * Минимальнодопустимое количество воды в организме
     * 
     * @type {Number} количество единиц  воды
     * @memberOf FoodSystem
     */
    minAmountWater;
    /**
     * Необходимое количество воды в организме
     * 
     * @type {Number} количество единиц воды
     * @memberOf FoodSystem
     */
    normalAmountWater;
    /**
     * Текущее количество единиц воды в организме
     * 
     * @type {Number} текущее количество единиц воды
     * @memberOf FoodSystem
     */
    currentAmountWater;
    /**
     * Минимальнодопустимое количество еды в организме
     * 
     * @type {Number} количество единиц еды
     * @memberOf FoodSystem
     */
    minAmountEater;
    /**
     * Необходимое количество еды в организме
     * 
     * @type {Number} количество единиц еды
     * @memberOf FoodSystem
     */
    normalAmountEater;
    /**
     * Текущее количество единиц еды в организме
     * 
     * @type {Number} текущее количество единиц еды
     * @memberOf FoodSystem
     */
    currentAmountEater;

    /**
     * Массив жертв
     * 
     * @type {Number[]} массив id животных
     * @memberOf FoodSystem
     */
    arrVictims;

    /**
     * Процент сытости животного
     * 
     * @type {Number} процент сытости
     * @memberOf FoodSystem
     */
    scaleSatiety;
    /**
     * Процент обезвоживания животного
     * 
     * @type {Number} процент обезвоживания
     * @memberOf FoodSystem
     */
    scaleDehydration;

    /**
     * Анализирует состояние обезвоживания. Чем выше значение тем меньше хочется пить.
     * 
     * @returns {Number}
     * 
     * @memberOf FoodSystem
     */
    analysisWater(){
        return this.scaleDehydration=(this.currentAmountWater*100)/(this.normalAmountWater-this.minAmountWater);
    }
    /**
     * Анализирует состояние сытости. Чем вышезначение тем меньше хочется кушать
     * 
     * @returns {Number}
     * 
     * @memberOf FoodSystem
     */
    analysisEater(){
        return this.scaleSatiety=(this.currentAmountEater*100)/(this.normalAmountEater-this.minAmountEater);
    }
    /**
     * Анализирует систему питания
     * 
     * 
     * @memberOf FoodSystem
     */
    analysisSystem(){
        this.analysisEater();
        this.analysisWater();
    }
   
    /**
     * Инициализация параметров системы питания
     * 
     * @param {Number} maxEater необходимое число единиц еды 
     * @param {Number} minEater минимальнодопустимое число единиц еды
     * @param {Number} maxWater необходимое число единиц воды
     * @param {Number} minWater минимальнодопустимое число единиц воды
     * 
     * @memberOf FoodSystem
     */
    init(maxEater,minEater,maxWater,minWater){
        this.normalAmountEater=maxEater;
        this.minAmountEater=minEater;
        this.normalAmountWater=maxWater;
        this.minAmountWater=minWater;
        this.currentAmountEater=maxEater;
        this.currentAmountWater=maxWater;
        this.arrVictims=[];
        this.analysisSystem();
    }


}