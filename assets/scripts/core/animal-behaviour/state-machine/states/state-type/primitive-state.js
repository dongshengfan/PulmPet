import { State } from '../state';
//import { Route, RouteEngine } from '../../routes/export-routes';
//import { Animal } from '../../../models/export-models';

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
    constructor(name, model, isEndPoint = false, routeEngine = null) {
        super(name, model, routeEngine, isEndPoint);
        
    }

    /**
     * Запуск состояния
     * TODO удалить
     * @memberOf PrimitiveState
     */
    run() { 
        throw new Error('No implementation status...');
        //cc.log(this._name);
    }
}