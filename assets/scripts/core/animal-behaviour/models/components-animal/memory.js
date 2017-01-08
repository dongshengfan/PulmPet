/**
 * Класс память
 * 
 * @export
 * @class Memory
 */
export class Memory{
    /**
     * Количество тайлдов с водой которое может помнить животное
     * 
     * @type {Number} целое число
     * @memberOf Memory
     */
    amountWaterPointsRemember;
    /**
     * Количество тайлдов с травой которое может помнить животное
     * 
     * @type {Number} целое число
     * @memberOf Memory
     */
    amountGrassPointsRemember;
    /**
     * Количество тайлдов с животными которых может помнить животное
     * 
     * @type {Number} целое число
     * @memberOf Memory
     */
    amountVictimPointsRemember;
    /**
     * Количество тайлдов с хищниками которых может помнить животное
     * 
     * @type {Number} целое число
     * @memberOf Memory
     */
    amountPredatorPointsRemember;

    /**
     * Массив тайлдов с водой о которых помнит животное
     * 
     * @type {cc.Vec2[]} миссив 
     * @memberOf Memory
     */
    arrPointsWater;
    /**
     * Массив тайлдов с травой о которых помнит животное
     * 
     * @type {cc.Vec2[]} миссив тайлдов  
     * @memberOf Memory
     */
    arrPointsGrass;
    /**
     * Массив тайлдов где последний раз были жертвы о которых помнит животное
     * 
     * @type {cc.Vec2[]} миссив тайлдов
     * @memberOf Memory
     */
    arrPointsVictim;
    /**
     * Массив тайлдов где последний раз были хищники о которых помнит животное
     * 
     * @type {cc.Vec2[]} массив тайлдов
     * @memberOf Memory
     */
    arrPointsPredator;
    /**
     * Область которую витид животное
     * 
     * @type {cc.Vec2[]} массив тайлдов
     * @memberOf Memory
     */
    arrSee;

    /**
     * Позиция в которой находится животное по мнению мозгов
     * 
     * @type {cc.Vec2} 
     * @memberOf Memory
     */
    position;

    /**
     * Creates an instance of Memory.
     * 
     * 
     * @memberOf Memory
     */
    constructor() {
    
    }
    /**
     * Мозг устанавливает позицию в которой находится животное по его мнению
     * 
     * @param {cc.Vec2} pos
     * 
     * @memberOf Memory
     */
    setPosition(pos){
        this.position=pos;
    }
    /**
     * Ищет в чертогах разума где последний раз он видел воду и возвращает ближайшую точку если найдет
     * 
     * @returns {cc.Vec2} тайлд с водой
     * 
     * @memberOf Memory
     */
    findWater(){
        return this._inMemory(this.arrPointsWater);
    }
    /**
     * Ищет в чертогах разума где последний раз он видел траву и возвращает ближайшую точку если найдет
     * 
     * @returns {cc.Vec2} тайлд с травой
     * 
     * @memberOf Memory
     */
    findGrass(){
        return this._inMemory(this.arrPointsGrass);
    }
    /**
     * Ищет в чертогах разума где последний раз он жертву и возвращает ближайшую точку если найдет
     * 
     * @returns {cc.Vec2} тайлд места положения
     * 
     * @memberOf Memory
     */
    findVictim(){
        return this._inMemory(this.arrPointsVictim);
    }
    
    /**
     * Копается в памяти вспоминая о ближайшем
     * 
     * @param {cc.Vec2[]} mas массив векторов позиций
     * @returns {cc.Vec2|null} найденную точку
     * 
     * @memberOf Memory
     */
    _inMemory(mas){
        let maxDistance=Number.MAX_VALUE;
        let targetPoint=null;
        let dictance=0;
        mas.forEach((point)=>{
            dictance=this._distance(point);
            if(dictance<maxDistance){
                maxDistance=distance;
                targetPoint=point;
            }
        });
        return targetPoint;
    }
    /**
     * Оценивает расстояние от своего положения до точки
     * 
     * @param {cc.Vec2} point точка до куда
     * @returns {Number}
     * 
     * @memberOf Memory
     */
    _distance(point){
        return cc.pDistance(this.position,point);
    }
    
}