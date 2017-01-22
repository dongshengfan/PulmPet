/**
 * Класс памяти животного
 * 
 * @export
 * @class MemorySystem
 */
class MemorySystem{
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
     * Creates an instance of Memory.
     * 
     * 
     * @memberOf Memory
     */
    constructor() {
    
    }
    
    /**
     * Ищет в чертогах разума где последний раз он видел воду и возвращает ближайшую точку если найдет
     * 
     * @param {cc.Vec2} pos позиция в которой находится животное по мнению мозгов
     * @returns {cc.Vec2} тайлд с водой
     * 
     * @memberOf Memory
     */
    findWater(pos){
        return this._inMemory(this.arrPointsWater,pos);
    }
    /**
     * Ищет в чертогах разума где последний раз он видел траву и возвращает ближайшую точку если найдет
     * 
     * @param {cc.Vec2} pos позиция в которой находится животное по мнению мозгов
     * @returns {cc.Vec2} тайлд с травой
     * 
     * @memberOf Memory
     */
    findGrass(pos){
        return this._inMemory(this.arrPointsGrass,pos);
    }
    /**
     * Ищет в чертогах разума где последний раз он видел жертву и возвращает ближайшую точку если найдет
     * 
     * @param {cc.Vec2} pos позиция в которой находится животное по мнению мозгов
     * @returns {cc.Vec2} тайлд места положения
     * 
     * @memberOf Memory
     */
    findVictim(pos){
        return this._inMemory(this.arrPointsVictim,pos);
    }
    
    /**
     * Копается в памяти вспоминая о ближайшем
     * 
     * @param {cc.Vec2[]} mas массив векторов позиций
     * @param {cc.Vec2} pos точка где находится сейчас животное
     * @returns {cc.Vec2|null} найденную точку
     * 
     * @memberOf Memory
     */
    _inMemory(mas,pos){
        let maxDistance=Number.MAX_VALUE;
        let targetPoint=null;
        let dictance=0;
        mas.forEach((point)=>{
            dictance=this._distance(point,pos);
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
     * @param {cc.Vec2} pos точка откуда
     * @returns {Number} длинна расстояния между точками
     * 
     * @memberOf Memory
     */
    _distance(point,pos){
        return cc.pDistance(pos,point);
    }
    
}

export { MemorySystem };