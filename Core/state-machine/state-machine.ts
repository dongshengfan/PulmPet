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

        factory: StateFactory;
        /**
         * Флаг отражающий запущена ли машина или нет
         */
        _isRun: boolean;

        _needState:any[];

        /**
         * Creates an instance of StateMachine.
         * @param state текущее состояние
         */
        constructor(state: StateMachines.States.State) {
            this._state = state;
            this.factory = StateFactory.instance();
            this._needState=[];
        }

        /**
         * Запуск state machine
         */
        async run() {
            this._isRun = true;
            await this._state.run();
            if (this._isRun) {
                this.next();
            } else {
                let pack: any = this._needState.unshift();
                await this.factory.create(pack.type, pack.name, pack.animal, pack.isEnd).run();
                if (this._needState.length < 1) {
                    this.next();
                }
            }
        }

        /**
         * Переход в следующее состояние
         */
        next(){
            if (!this._state.isEndPoint()) {
                this._state = this._state.getNextState();
                this.run();
            }
        }


    }
}