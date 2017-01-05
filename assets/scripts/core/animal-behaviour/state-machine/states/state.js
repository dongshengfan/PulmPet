/**
 * Базовый класс для всех состояний вероятностного автомата
 * 
 * @export
 * @class State
 */
export class State {
    /**
     * Creates an instance of State.
     * @memberOf State
     */
    constructor() {
    }

    /**
     * Добавление нового состояния в композит.
     *
     * @param {State} state новое состояние
     * @memberOf State
     */
    add(state) {
        throw new Error('Not implemented yet...');
    }
}