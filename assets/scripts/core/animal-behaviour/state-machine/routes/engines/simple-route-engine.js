import { RouteEngine } from './route-engine';

/**
 * Инкапсуляция логики выбора маршрута для перехода в следующее состояние.
 * При подсчете возможности перехода по маршруту вероятность не учитывается
 * 
 * @export
 * @class SimpleRouteEngine
 * @extends {RouteEngine}
 */
export class SimpleRouteEngine extends RouteEngine {
    /**
     * Creates an instance of RouteEngine.
     * @param {Animal} model модель животного-владельца текущей группы
     * @param {RouteEngine} [nextEngine=null] следующая группа маршрутов
     * @param {Array<Route>} [routes=[]] возможные маршруты в рамках группы
     * @memberOf SimpleRouteEngine
     */
    constructor(routes = [], nextEngine = null) {
        super(routes, nextEngine);
    }

    /**
     * Получение следующего маршрута для перехода
     * @returns {Route}
     */
    getRoute() {
        var routes = this._routes.filter((route) => route.isAvailable(this._model));
        return routes.length > 0 ? this._routes[0] : this._nextRouteEngine();
    }
}