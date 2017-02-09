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
        this._state.run().then(() => {
            if (!this._state.isEndPoint()) {
                this._state = this._state.getNextState();
                this.run();
            }
        }, () => {
            throw new Error('Error in state... (StateMachine)');
        });
    }
}