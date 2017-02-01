import { State } from '../states/export-states';

/**
 * Инкапсуляция следующего состояния для перехода и его условия
 *
 * @export
 * @class Route
 */
export class Route {
    /**
     * Следующее состояние для перехода
     * @type {State} 
     * @memberOf Route
     */
    _state;

    /**
     * Функция, проверяющая возможность перехода в следующее состояние
     * @type {Route~availability} 
     * @memberOf Route
     */
    _availability

    /**
     * Creates an instance of Route.
     * @param {State} state следующее состояние для перехода
     * @param {Route~availability} availability функция, проверяющая возможность перехода в следующее состояние
     * @memberOf Route
     */
    constructor(state, availability) {
        this._state = state;
        this._availability = availability;
    }

    /**
     * Проверка на возможность перехода в заданное состояние
     * @param {Animal} model модель животного для проверки показателей
     * @param {Number} probability вероятность перехода для вероятностных маршрутов
     * @returns {State|null}
     * @memberOf Route
     */
    isAvailable(model, probability = 1.0) {
        return (this._availability && this._availability(model, probability)) ? this._state : null;
    }

    /**
     * Получение заданного для перехода состояния
     * @returns {State}
     */
    getState() {
        return this._state;
    }
}