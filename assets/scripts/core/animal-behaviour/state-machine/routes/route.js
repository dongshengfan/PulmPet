import { State } from '../states/state';

/**
 * Вычисление возможности перехода к заданному состоянию с заданным условием
 *
 * @export
 * @class Route
 */
export class Route { 
    _state;
    _availability
    
    /**
     * Creates an instance of Route.
     * @param {State} targetState
     * @param {Route~availability} availability
     * @memberOf Route
     */
    constructor(state, availability) {
        this._state = state;
        this._availability = availability;
    }

    /**
     * 
     * @returns
     * @memberOf Route
     */
    isAvailable() { 
        return (this._availability && this._availability())? state : null;
    }

    /**
     * @returns {State}
     */
    getState() { 
        return this._state;
    }
}