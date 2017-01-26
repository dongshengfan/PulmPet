import { Route, RouteEngine } from '../routes/export-routes';
import { Animal } from '../../models/export-models';

/**
 * Базовый класс для всех состояний вероятностного автомата
 * 
 * @export
 * @class State
 */
export class State {
    /**
     * Имя состояния
     * @type {String}
     * @memberOf State
     */
    _name;

    /**
     * Модель животного
     * @type {Animal}
     * @memberOf State
     */ 
    _model;

    /**
     * Обработчик маршрутов между состояниями
     * @type {RouteEngine}
     * @memberOf State
     */
    _routeEngine;

    /**
     * Флаг заключительного состояния
     * @type {Boolean}
     * @memberOf State
     */
    _isEndPoint;
    
    /**
     * Creates an instance of State.
     * @param {String} name имя состояния
     * @param {Animal} model модель животного
     * @param {RouteEngine} routeEngine обработчик маршрутов между состояниями
     * @param {Boolean} isEndPoint флаг заключительного состояния
     * @memberOf State
     */
    constructor(name, model, routeEngine = null, isEndPoint = false) {
        this._name = name;
        this._model = model;
        this._routeEngine = routeEngine;
        this._isEndPoint = isEndPoint;
    }

    /**
     * Получение имени состояния
     *
     * @returns {String}
     * @memberOf State
     */
    getName() { 
        return this._name;
    }

    /**
     * Получение следущего состояния согласно установленным в обработчике маршрутов.
     * Возвращает текущее состояние при невозможности перехода.
     * @returns {State}
     * @memberOf State
     */
    getNextState() {
        if (!this._routeEngine) {
            return this;
        }

        var route = this._routeEngine.getRoute();
        return route ? route.getState() : this;
    }

    /**
     * Возвращает значение флага конечного состояния
     * @returns {Boolean}
     * @memberOf State
     */
    isEndPoint() { 
        return this._isEndPoint;
    }

    /**
     * Установка обработчка мартшрутов между состояниями
     * @param {RouteEngine} routeEngine обработчик маршрутов между состояниями
     * @memberOf State
     */
    setRouteEngine(routeEngine) { 
        this._routeEngine = routeEngine;
        this._routeEngine.setModel(this._model);
    }

    /**
     * Добавление нового состояния в композит.
     *
     * @param {State} state новое состояние
     * @memberOf State
     */
    add(state) {
        throw new Error('Not implemented yet...');
    }

    /**
     * Запуск состояния
     * @memberOf State
     */
    run() { 
        throw new Error('Not implemented yet...');
    }
}