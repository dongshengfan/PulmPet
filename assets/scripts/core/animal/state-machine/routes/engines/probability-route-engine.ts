/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine.Routes.Engines {

    /**
     * Инкапсуляция логики выбора маршрута для перехода в следующее состояние.
     * При подсчете возможности перехода по маршруту вероятность учитывается
     * @class ProbabilityRouteEngine
     */
    export class ProbabilityRouteEngine extends RouteEngine {

        /**
         * Creates an instance of ProbabilityRouteEngine.
         * @param routes возможные маршруты в рамках группы
         * @param nextEngine следующая группа маршрутов
         */
        constructor(routes: Array<Route> = [], nextEngine: RouteEngine = null) {
            super(routes, nextEngine);
        }

        /**
         * Получение следующего маршрута для перехода
         * @returns {Route}
         */
        getRoute(): Route {
            let probability = Math.random();
            let routes = this._routes.filter((route) => route.isAvailable(this._model, probability));
            return routes.length > 0 ? routes[0] : this._nextRouteEngine();
        }
    }
}