/**
 * Created by shaba on 12.02.2017.
 */
import { ScalesTypes } from './sceles-animal-types';
import { SystemScale } from '../system-scales/export-system-scales';

export class ScaleFactory {

    _factories;

    static _instance;

    constructor() {
        this._factories = [];
        this._factories[ScalesTypes.stateSystem] = SystemScale;
        this._factories[ScalesTypes.heartbeat] = SystemScale;
        this._factories[ScalesTypes.pressure] = SystemScale;
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

    create(typeScale, params) {
        return new this._factories[typeScale](params);
    }
}
