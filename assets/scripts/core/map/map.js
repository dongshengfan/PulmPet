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
     * @type {cc.Vec2} Вектор
     * @memberOf Map
     */
    _sizeMapPixel;

    /**
     * Размер карты в тайлдах
     * 
     * @type {cc.Size} Вектор
     * @memberOf Map
     */
    _sizeMapTield;

    /**
     * Размер тайлда у карты
     * 
     * @type {cc.Size} Вектор
     * @memberOf Map
     */
    _sizeTield;
    
    /**
     * Слой препятствий заблокированных для движения
     * 
     * @type {cc.TiledLayer} Слой карты
     * @memberOf Map
     */
    _obstaclesLayer;

    
    /**
     * Инициализация поступившей карты
     * 
     * @memberOf Map
     */
    _initializationWorld(){
        this._initializationLayer();

        this._sizeMapTield=this._world.getMapSize();
        this._sizeTield=this._world.getTileSize();        
        this._sizeMapPixel=this._getSizeMapPixel();
    }   

    /**
     * Инициализация всех слоев на карте
     * 
     * @memberOf Map
     */
    _initializationLayer(){
        this._obstaclesLayer=this._world.getLayer('obstacles');

        if(!this._obstaclesLayer){
             throw new Error('Layer was not found...');
        }
    }

    /**
     * Возвращает размер карты в пикселях
     * 
     * @returns {cc.Vec2} размер карты в пикселях
     * 
     * @memberOf Map
     */
    _getSizeMapPixel(){
        let sizeX=this._sizeMapTield.width * this._sizeTield.width;
        let sizeY=this._sizeMapTield.height * this._sizeTield.height;
        return cc.v2(sizeX,sizeY);
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
    
    /**
     * Конвертирует координаты пикселей в координаты тайлдов 
     * 
     * @param {cc.Vec2} posInPixel координаты пикселей
     * @returns {cc.Vec2} координаты в тайлдах
     * 
     * @memberOf Map
     */
    convertTiledPos(posInPixel){
        var x = Math.floor((posInPixel.x) /  this._sizeTield.width);
        var y = Math.floor((this._sizeMapPixel.y-(posInPixel.y)) / this._sizeTield.height);
        return cc.v2(x, y);
    }

    /**
     * Конвертирует координаты тайлдов в координаты пикселей 
     * 
     * @param {cc.Vec2} posInTiled координаты в тайлдах
     * @returns {cc.Vec2} координаты в пикселях
     * 
     * @memberOf Map
     */
    convertPixelPos(posInTiled){
        var x=posInTiled.x*this._sizeTield.width+this._sizeTield.width/2;
        var y=this._sizeMapPixel.y-(posInTiled.y*this._sizeTield.height)-this._sizeTield.height/2;
        return cc.v2(x, y);
    }

    /**
     * Проверяет являтся ли тайлд препятствием
     * 
     * @param {cc.Vec2} gid координата тайлд
     * @returns {Boolean} false если это не препятствие
     * 
     * @memberOf Map
     */
    isCheсkObstacle(gid){
        if(this._isCorrectPos(gid)){
            if(this._obstaclesLayer.getTileGIDAt(gid.x,gid.y)===0){
                return false;
            }
        }
        return true;       
    }
    
    /**
     * Проверяет являтся ли тайлд корректным для карты 
     * 
     * @param {cc.Vec2} pos координата тайлда
     * @returns {Boolean} true когда корректный тайлд
     * 
     * @memberOf Map
     */
    _isCorrectPos(pos){
        if(pos.x<0||pos.y<0||pos.x>this.worldSize.width-1||pos.y>this.worldSize.height-1){
            return false;
        }
        return true;
    }

    /**
     * Создает цель для движения на карте не являющуюся препятствием
     * 
     * @returns {cc.Vec2} координата цели для движения
     * 
     * @memberOf Map
     */
    getNewPointInMap(){
        let point;     
        do{
            point=_getRandomCoordinat(this._sizeMapPixel.x,this._sizeMapPixel.y);   
            if(!this.isCheсkObstacle(this.convertTiledPos(point))){
                break;
            }        
        }while(true);
        return point;
    }
    
}

//Может быть это вшить?
function  _getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

function  _getRandomCoordinat(maxPosx,maxPosy){
      return cc.v2(_getRandomInt(0,maxPosx),_getRandomInt(0,maxPosy));
    }
