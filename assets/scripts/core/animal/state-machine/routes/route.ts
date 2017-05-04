/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine {

    /**
     * Класс маршрута
     * @class Route
     */
    export class Route {

        /**
         * Следующее состояние для перехода
         */
        _state: Animals.StateMachine.State;

        /**
         * Функция, проверяющая возможность перехода в следующее состояние
         */
        _availability: any;

        /**
         * Creates an instance of Route.
         * @param state следующее состояние для перехода
         * @param availability функция, проверяющая возможность перехода в следующее состояние
         */
        constructor(state: Animals.StateMachine.State, availability: any) {
            this._state = state;
            this._availability = availability;
        }

        /**
         * Проверка на возможность перехода в заданное состояние
         * @param model модель животного для проверки показателей
         * @param probability вероятность перехода для вероятностных маршрутов
         * @returns {Animals.StateMachine.States.State |null}
         */
        isAvailable(model: Animal, probability: number = 1.0): Animals.StateMachine.State|null {
            return (this._availability && this._availability(model, probability)) ? this._state : null;
        }

        /**
         * Получение заданного для перехода состояния
         * @returns {Animals.StateMachine.States.State}
         */
        getState(): Animals.StateMachine.State {
            return this._state;
        }
    }
}