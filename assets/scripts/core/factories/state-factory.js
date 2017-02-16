/**
 * Created by shaba on 13.02.2017.
 */
import { StateTypes, StateStart, StateGo, StateRun, StateDie } from '../animal-behaviour/export-animal-behaviour';

export class StateFactory {

    _factories;

    static _instance;

    constructor() {
        this._factories = [];
        this._factories[StateTypes.start] = StateStart;
        this._factories[StateTypes.go] = StateGo;
        this._factories[StateTypes.run] = StateRun;
        this._factories[StateTypes.die] = StateDie;
    }

    /**
     * @returns {StateFactory}
     */
    static instance() {
        if (!this._instance) {
            this._instance = new StateFactory();
        }
        return this._instance;
    }

    create(typeState, animal,params) {
        return new this._factories[typeState](animal,params);
    }
}