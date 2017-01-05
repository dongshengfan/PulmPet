import { State } from './state';

/**
 * Класс-композит для сложных состояний.
 * Родитель всех состояний-композитов, являющихся сложными паттернами поведения
 * модели животного.
 * 
 * @export
 * @class PatternState
 * @extends {State}
 */
export class PatternState extends State { 
    
    /**
     * Массив cостояний композита
     * @type {Array<State>}
     * @memberOf PatternState
     */
    _states;

    /**
     * Creates an instance of PatternState.
     * @memberOf PatternState
     */
    constructor() { 
        super();
        this._states = [];
    }

    /**
     * Добавление нового состояния в композит.
     *
     * @param {State} state новое состояние
     * @memberOf State
     */
    add(state) {
        this._states.push(state);
    }
} 