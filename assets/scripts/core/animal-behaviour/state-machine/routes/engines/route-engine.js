import { Route } from '../route';

/**
 * Инкапсуляция логики выбора маршрута для перехода в следующее состояние.
 * Базовый класс для новых route engine.
 *
 * @export
 * @class RouteEngine
 */
export class RouteEngine {
    /**
     * Массив возможных маршрутов в рамках группы
     * @type {Array<Route>}
     * @memberOf RouteEngine
     */
    _routes;

    /**
     * Следующая группа маршрутов
     * @type {RouteEngine}
     * @memberOf RouteEngine
     */
    _nextEngine;
    
    /**
     * Модель животного-владельца текущей группы
     * @type {Animal}
     * @memberOf RouteEngine
     */
    _model;
    
    /**
     * Creates an instance of RouteEngine.
     * @param {Animal} model модель животного-владельца текущей группы
     * @param {RouteEngine} [nextEngine=null] следующая группа маршрутов
     * @param {Array<Route>} [routes=[]] возможные маршруты в рамках группы
     * @memberOf RouteEngine
     */
    constructor(model, routes = [], nextEngine = null) { 
        this._model = model;
        this._routes = routes;
        this._nextEngine = nextEngine;
    }

    /**
     * Добавление маршрутов в данную группу
     * @param {Array<Route>} routes
     * @memberOf RouteEngine
     */
    add(routes) {
        this._routes.push(...routes);
    }

    /**
     * Получение следующего маршрута для перехода
     * @returns {Route}
     */
    getRoute() {
        throw new Error('Not implemented yet...');
    }

    /**
     * Установка следующей группы маршрутов для обработки
     * @param {RouteEngine} engine
     * @memberOf RouteEngine
     */
    setNextEngine(engine) {
        this._nextEngine = engine;
    }
    
    /**
     * Обработка установленных в цепочку групп с маршрутами
     * @returns {Route|null}
     * @memberOf RouteEngine
     */
    _nextRouteEngine() {
        if (this._nextEngine) { 
            return this._nextEngine.getRoute();
        }
        return null;
    }
}