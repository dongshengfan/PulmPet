/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace StateMachines.States {

    /**
     * Класс простого состояния
     * @class PatternState
     */
    export class PatternState extends State {

        /**
         * Массив cостояний композита
         */
        _states: Array<State>;

        /**
         * Текущее состояние
         */
        _state: State;

        /**
         * Creates an instance of PatternState.
         * @param name имя состояния
         * @param model модель животного
         * @param routeEngine обработчик маршрутов между состояниями
         * @param states включаемые в композит состояния
         */
        constructor(name: string, model: Animals.Animal, routeEngine: StateMachines.Routes.RouteEngine = null, states: Array<State> = []) {
            super(name, model, routeEngine);
            this._states = states;
        }

        /**
         * Добавление нового состояния в композит.
         * @param state новое состояние
         */
        add(state: State): void {
            this._states.push(state);
        }

        /**
         * Запуск цепочки состояний
         * @param model модель животного
         */
        run(model: Animals.Animal): void {
            let state = this._states[0];

            while (state) {
                this._state = state;
                state.run(model);
            }
        }

        /**
         * Получение имени состояния
         * @returns {string}
         */
        getName(): string {
            if (!this._state) {
                throw new Error('Current state not initialized...');
            }
            return this._state.getName();
        }
    }
}