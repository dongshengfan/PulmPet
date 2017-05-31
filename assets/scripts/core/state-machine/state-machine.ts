/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace StateMachines {

    /**
     * Управляющий элемент автомата
     * @class StateMachine
     */
    export class StateMachine {
        /**
         * Текущее состояние
         */
        _state: any;

        /**
         * Creates an instance of StateMachine.
         * @param state текущее состояние
         */
        constructor(state: StateMachines.States.State) {
            this._state = state;
        }

        /**
         * Запуск state machine
         */
        async run() {
            await this._state.run();
            if (!this._state.isEndPoint()) {
                this._state = this._state.getNextState();
                this.run();
            }
        }
    }
}