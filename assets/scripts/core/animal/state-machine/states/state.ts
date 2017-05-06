/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine {

    /**
     * Класс состояния
     * @class State
     */
    export class State {

        /**
         * Имя состояния
         */
        _name: string;

        /**
         *  Модель животного
         */
        _model: Animal;

        /**
         * Обработчик маршрутов между состояниями
         */
        _routeEngine: Animals.StateMachine.RouteEngine;

        /**
         * Флаг заключительного состояния
         */
        _isEndPoint: boolean;

        /**
         * Creates an instance of State.
         * @param name имя состояния
         * @param model модель животного
         * @param routeEngine обработчик маршрутов между состояниями
         * @param isEndPoint флаг заключительного состояния
         */
        constructor(name: string, model: Animal, routeEngine: Animals.StateMachine.RouteEngine = null, isEndPoint: boolean = false) {
            this._name = name;
            this._model = model;
            this._routeEngine = routeEngine;
            this._isEndPoint = isEndPoint;
        }

        /**
         * Получение имени состояния
         * @returns {string}
         */
        getName(): string {
            return this._name;
        }

        /**
         * Получение следущего состояния согласно установленным в обработчике маршрутов.
         * Возвращает текущее состояние при невозможности перехода.
         * @returns {State}
         */
        getNextState(): State {
            if (!this._routeEngine) {
                return this;
            }

            let route = this._routeEngine.getRoute();
            return route ? route.getState() : this;
        }

        /**
         * Возвращает значение флага конечного состояния
         * @returns {boolean}
         */
        isEndPoint(): boolean {
            return this._isEndPoint;
        }

        /**
         * Установка обработчка мартшрутов между состояниями
         * @param routeEngine обработчик маршрутов между состояниями
         */
        setRouteEngine(routeEngine: Animals.StateMachine.RouteEngine) {
            this._routeEngine = routeEngine;
            this._routeEngine.setModel(this._model);
        }

        /**
         * Добавление нового состояния в композит.
         * @param state новое состояние
         */
        add(state: State) {
            throw new Error('Not implemented yet...');
        }

        /**
         * Запуск состояния
         * @param model
         */
        run(model: Animal) {
            throw new Error('Not implemented yet...');
        }

        /**
         * Выполняет бездействие по продолжительности равное s
         * @param s продолжительность бездействия в секундах
         * @returns {Promise<T>}
         */
        mySleep(s: any) {
            s *= 1000;
            return new Promise(resolve => setTimeout(resolve, s));
        }
    }
}