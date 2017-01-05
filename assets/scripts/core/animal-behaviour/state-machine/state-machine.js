import { Animal } from '../models/models';
import { State } from './states/state'

/**
 * Управляющий элемент вероятностного автомата
 * 
 * @export
 * @class StateMachine
 */
export class StateMachine { 
    /**
     * Модель животного 
     * @type {Animal}
     * @memberOf StateMachine
     */
    _model;

    /**
     * Текущее состояние
     * @type {State}
     * @memberOf StateMachine
     */
    _state;

    /**
     * Creates an instance of StateMachine.
     *
     * @param {Animal} model модель животного
     * @memberOf StateMachine
     */
    constructor(model) {
        this._model = model;
    }


    /**
     * Запуск state machine
     *
     * @memberOf StateMachine
     */
    run() {
        //TODO заменить на условие попадания в состояние "Смерть"
        while (true) { 
            
        }
    }
}