/**   
 * Объект игровой карта
 * @type {Map} игровая карта
 * @memberOf Maps
 */
let _instance=null; 


/**
 * Обертка для игровой карты ввиде одиночки 
 * 
 * @export
 * @class Maps
 */
export class Maps{ 
    /**
     * Creates an instance of Maps.
     * 
     * @memberOf Maps
     */
    constructor() {
        if(!_instance){
            _instance = new Map();
        }
        return _instance;
      }
}


/**
 * Класс игровой карты
 * 
 * @class Map
 */
class Map{ 
     
    /**
     * Текущая карта
     * 
     * @type {cc.TiledMap} Текущая карта
     * @memberOf Map
     */
    _world;

    /**
     * Размер карты в пикселях
     * 
     * @type {cc.Vec2} вектор
     * @memberOf Map
     */
    _sizeMapPixel;

    /**
     * Размер карты в тайлах
     * 
     * @type {cc.Vec2} вектор
     * @memberOf Map
     */
    _sizeMapTield;

    /**
     * Размер тайла у карты
     * 
     * @type {cc.Vec2} вектор
     * @memberOf Map
     */
    _sizeTield;

    /**
     * Инициализация поступившей карты
     * 
     * @memberOf Map
     */
    _initializationWorld(){
        
    }

    /**
     * Устанавливает текущую карту
     * 
     * @param {cc.TiledMap} tiledMap
     * 
     * @memberOf Map
     */
    setMap(tiledMap){
        this._world=tiledMap;
        this._initializationWorld();
    }

    /**
     * Возвращает текущую карту
     * 
     * @returns {cc.TiledMap} текущая карта
     *
     * @memberOf Map
     */
    getMap(){
        return this._world;
    }
    
}


