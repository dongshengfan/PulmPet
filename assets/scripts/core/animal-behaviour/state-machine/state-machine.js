import { State } from './states/state'

/**
 * Управляющий элемент вероятностного автомата
 * 
 * @export
 * @class StateMachine
 */
export class StateMachine { 
    /**
     * Текущее состояние
     * @type {State}
     * @memberOf StateMachine
     */
    _state;

    /**
     * Creates an instance of StateMachine.
     * @param {State} state стартовое состояние
     * @memberOf StateMachine
     */
    constructor(state) {
        this._state = state;
    }

    /**
     * Запуск state machine
     * @memberOf StateMachine
     */
    run() {
        //TODO заменить на условие попадания в состояние "Смерть"
        while (true) { 
            this._state.run();
            this._state = this._state.getNextState();
        }
    }
}