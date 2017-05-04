/**
 * Created by FIRCorp on 12.03.2017.
 */
///<reference path="../../../../creator.d.ts"/>

/**
 * Пространство карты
 */
namespace MapGame {
    /**
     * Класс карты
     */
    export class Map {
        /**
         * Экземпляр этой карты
         */
        private static _inst: Map;

        /**
         * Текущая карта
         */
        _world: cc.TiledMap;

        /**
         * Размер карты в пикселях
         */
        _sizeMapPixel: any;

        /**
         * Размер карты в тайлдах
         */
        _sizeMapTiled: any;

        /**
         * Размер тайлда у карты
         */
        _sizeTiled: any;

        /**
         * Слой препятствий заблокированных для движения
         */
        _obstaclesLayer: cc.TiledLayer;

        /**
         * Слой воды
         */
        _waterLayer: cc.TiledLayer;

        /**
         * Слой деревьев
         */
        _treeLayer: cc.TiledLayer;

        /**
         * Инциализация синглтона карты
         * @returns {Map}
         */
        static instance() {
            if (!this._inst) {
                this._inst = new Map();
            }
            return this._inst;
        }

        set world(map: cc.TiledMap) {
            if (map) {
                this._world = map;
                this._initializationWorld();
            } else {
                throw new Error('World was not found...');
            }
        }

        get world(): cc.TiledMap {
            return this._world;
        }

        set obstaclesLayer(layer: cc.TiledLayer) {
            if (layer) {
                this._obstaclesLayer = layer;
            } else {
                throw new Error('Layer obstacle was not found...');
            }
        }

        set waterLayer(layer: cc.TiledLayer) {
            if (layer) {
                this._waterLayer = layer;
            } else {
                throw new Error('Layer water was not found...');
            }
        }

        set treeLayer(layer: cc.TiledLayer) {
            if (layer) {
                this._treeLayer = layer;
            } else {
                throw new Error('Layer tree was not found...');
            }
        }

        /**
         * Инициализация поступившей карты
         */
        _initializationWorld(): void {
            this._initializationLayer();
            this._sizeMapTiled = this._world.getMapSize();
            this._sizeTiled = this._world.getTileSize();
            this._sizeMapPixel = this._getSizeMapPixel();
        }

        /**
         * Инициализация всех слоев на карте
         */
        _initializationLayer(): void {
            this.obstaclesLayer = this._world.getLayer('obstacle');
            this.waterLayer = this._world.getLayer('water');
            this.treeLayer = this._world.getLayer('tree');
        }

        /**
         * Возвращает размер карты в пикселях
         * @returns {Vec2} размер карты в пикселях
         */
        _getSizeMapPixel(): cc.Vec2 {
            let sizeX = this._sizeMapTiled.width * this._sizeTiled.width;
            let sizeY = this._sizeMapTiled.height * this._sizeTiled.height;
            return cc.v2(sizeX, sizeY);
        }

        /**
         * Конвертирует координаты пикселей в координаты тайлдов
         * @param {cc.Vec2} posInPixel координаты пикселей
         * @returns {Vec2} координаты в тайлдах
         */
        convertTiledPos(posInPixel: any): cc.Vec2 {
            let x = Math.floor((posInPixel.x) / this._sizeTiled.width);
            let y = Math.floor((this._sizeMapPixel.y - (posInPixel.y)) / this._sizeTiled.height);
            return cc.v2(x, y);
        }

        /**
         * Конвертирует координаты тайлдов в координаты пикселей
         * @param {cc.Vec2} posInTiled координаты в тайлдах
         * @returns {Vec2} координаты в пикселях
         */
        convertPixelPos(posInTiled: any): cc.Vec2 {
            let x = posInTiled.x * this._sizeTiled.width + this._sizeTiled.width / 2;
            let y = this._sizeMapPixel.y - (posInTiled.y * this._sizeTiled.height) - this._sizeTiled.height / 2;
            return cc.v2(x, y);
        }

        /**
         * Проверяет являтся ли тайлд препятствием
         * @param {cc.Vec2} gid координата тайлд
         * @returns {boolean} false если это не препятствие
         */
        isCheсkObstacle(gid: any): boolean {
            if (this._isCorrectPos(gid)) {
                if (this._obstaclesLayer.getTileGIDAt(gid.x, gid.y) === 0) {
                    return false;
                }
            }
            return true;
        }

        /**
         * Проверяет являтся ли тайлд корректным для карты
         * @param {cc.Vec2} pos координата тайлда
         * @returns {Boolean} true когда корректный тайлд
         */
        _isCorrectPos(pos: any): boolean {
            if (pos.x < 0 || pos.y < 0 || pos.x > this._sizeMapTiled.width - 1 || pos.y > this._sizeMapTiled.height - 1) {
                return false;
            }
            return true;
        }

    }
}

