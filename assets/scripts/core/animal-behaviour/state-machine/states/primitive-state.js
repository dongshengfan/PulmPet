import { State } from './state';
import { Route } from '../routes/route';
import { Animal } from '../../models/models';
import { RouteEngine } from '../routes/engines/route-engine';

/**
 * Класс-примитив для одиночных простых состояний.
 * Базовый класс всех простых состояний
 *
 * @export
 * @class PrimitiveState
 * @extends {State}
 */
export class PrimitiveState extends State { 
    
    /**
     * Creates an instance of PrimitiveState.
     * @param {String} name имя состояния
     * @param {Animal} model модель животного
     * @param {RouteEngine} routeEngine обработчик маршрутов между состояниями
     * @param {Boolean} isEndPoint флаг заключительного состояния
     * @memberOf PrimitiveState
     */
    constructor(name, model, routeEngine = null, isEndPoint = false) {
        super(name, model, routeEngine, isEndPoint);
    }

    /**
     * Запуск состояния
     * TODO удалить
     * @memberOf PrimitiveState
     */
    run() { 
        cc.log(this._name);
    }
}