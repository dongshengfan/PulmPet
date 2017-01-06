import { State } from './state';
import { Route } from '../routes/route';
import { Animal } from '../../models/models';
import { RouteEngine } from '../routes/engines/route-engine';

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
     * Текущее состояние
     * @type {State}
     * @memberOf PatternState
     */
    _state;

     /**
     * Creates an instance of PatternState.
     * @param {String} name имя состояния
     * @param {Animal} model модель животного
     * @param {RouteEngine} routeEngine обработчик маршрутов между состояниями
     * @param {Array<State>} states включаемые в композит состояния
     * @memberOf PatternState
     */
    constructor(name, model, routeEngine = null, states = []) {
        super(name, model, routeEngine);
        this._states = states;
    }   

    /**
     * Добавление нового состояния в композит.
     * @param {State} state новое состояние
     * @memberOf State
     */
    add(state) {
        this._states.push(state);
    }

    /**
     * Запуск цепочки состояний
     * @param {Animal} model модель животного
     * @memberOf State
     */
    run(model) { 
        var state = this._states[0];
        
        while (state) {
            this._state = state;
            state.run(model);
        }
    }

    /**
     * Получение имени состояния
     * @returns {String}
     * @memberOf PatternState
     */
    getName() {
        if (!this._state) { 
            throw new Error('Current state not initialized...');
        }
        return this._state.getName();
    }
} 