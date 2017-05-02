/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine.Routes.Engines {

    /**
     * Инкапсуляция логики выбора маршрута для перехода в следующее состояние.
     * Базовый класс для новых route engine.
     * @class RouteEngine
     */
    export class RouteEngine {

        /**
         * Массив возможных маршрутов в рамках группы
         */
        _routes: Array<Route>;

        /**
         * Следующая группа маршрутов
         */
        _nextEngine: RouteEngine;

        /**
         * Модель животного-владельца текущей группы
         */
        _model: Animal;

        /**
         * Creates an instance of RouteEngine.
         * @param routes возможные маршруты в рамках группы
         * @param nextEngine следующая группа маршрутов
         */
        constructor(routes: Array<Route> = [], nextEngine: RouteEngine = null) {
            this._routes = routes;
            this._nextEngine = nextEngine;
        }

        /**
         * Добавление маршрутов в данную группу
         * @param routes новые маршруты
         */
        add(routes: Array<Route>) {
            this._routes.push(...routes);
        }

        /**
         * Получение следующего маршрута для перехода
         * @returns {Route}
         */
        getRoute(): Route {
            throw new Error('Not implemented yet...');
        }

        /**
         * Установка следующей группы маршрутов для обработки
         * @param engine группа маршрутов
         */
        setNextEngine(engine: RouteEngine) {
            this._nextEngine = engine;
        }

        /**
         * Установка модели животного
         * @param animal модель животного
         */
        setModel(animal: Animal) {
            this._model = animal;
        }

        /**
         * Обработка установленных в цепочку групп с маршрутами
         * @returns {Route|null}
         * @private
         */
        _nextRouteEngine(): Route|null {
            if (this._nextEngine) {
                return this._nextEngine.getRoute();
            }
            return null;
        }
    }
}