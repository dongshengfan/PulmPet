/**
 * Created by shaba on 12.02.2017.
 */
import { ScalesTypes, SystemScale } from '../animal-behaviour/export-animal-behaviour';

export class ScaleFactory {

    _factories;

    static _instance;

    constructor() {
        this._factories = [];
        this._factories[ScalesTypes.stateSystemCirculatory] = SystemScale;
        this._factories[ScalesTypes.heartbeat] = SystemScale;
        this._factories[ScalesTypes.pressure] = SystemScale;
        this._factories[ScalesTypes.stateSystemMuscular] = SystemScale;
        this._factories[ScalesTypes.speed] = SystemScale;
        this._factories[ScalesTypes.weight] = SystemScale;
    }

    /**
     * @returns {ScaleFactory}
     */
    static instance() {
        if (!this._instance) {
            this._instance = new ScaleFactory();
        }
        return this._instance;
    }

    create(typeScale, params,time) {
        return new this._factories[typeScale](params,time);
    }
}
