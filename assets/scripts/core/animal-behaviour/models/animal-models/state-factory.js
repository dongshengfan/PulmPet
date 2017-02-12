/**
 * Created by shaba on 13.02.2017.
 */
import { StateTypes } from './state-animal-types';
import { StateStart,StateGo,StateRun,StateDie } from '../../state-machine/libraryState/export-lion-states';

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