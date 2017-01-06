import { State } from './states/state'

/**
 * Управляющий элемент автомата
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
        while (true) { 
            this._state.run();
            if (this._state.isEndPoint()) { 
                break;
            }
            this._state = this._state.getNextState();    
        }
    }
}