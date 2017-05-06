/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine {

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
        constructor(state: Animals.StateMachine.State) {
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