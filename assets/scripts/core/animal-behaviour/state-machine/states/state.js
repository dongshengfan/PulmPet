import { Route } from '../routes/route';
import { Animal } from '../../models/models';
import { RouteEngine } from '../routes/engines/route-engine';

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
     * Creates an instance of State.
     * @param {String} name имя состояния
     * @param {Animal} model модель животного
     * @param {RouteEngine} routeEngine обработчик маршрутов между состояниями
     * @memberOf State
     */
    constructor(name, model, routeEngine = null) {
        this._name = name;
        this._model = model;
        this._routeEngine = routeEngine;
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
     * Получение следущего состояния согласно установленным в обработчике маршрутов 
     * @returns {State|null}
     * @memberOf State
     */
    getNextState() {
        if (!this._routeEngine) {
            return null;
        }

        var route = this._routeEngine.getRoute();
        return route ? route.getState() : null;
    }

    /**
     * Установка обработчка мартшрутов между состояниями
     * @param {RouteEngine} routeEngine обработчик маршрутов между состояниями
     * @memberOf State
     */
    setRouteEngine(routeEngine) { 
        this._routeEngine = routeEngine;
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
     *
     * @param {Animal} model модель животного
     * @memberOf State
     */
    run() { 
        throw new Error('Not implemented yet...');
    }
}