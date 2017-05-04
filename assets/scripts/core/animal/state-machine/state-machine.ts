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
        run() {
            this._state.run(this);
            /*  this._state.run().then(() => {
             if (!this._state.isEndPoint()) {
             this._state = this._state.getNextState();
             this.run();
             }
             }, () => {
             throw new Error('Error in state... (StateMachine)');
             });*/
        }

        finishState(){
            if (!this._state.isEndPoint()) {
                this._state = this._state.getNextState();
                this.run();
            }
        }
    }
}