/**
 * Created by shabanov on 12.02.2017.
 */
import { SystemTypes } from './system-animal-types';
import { CirculatorySystem, MemorySystem, MuscularSystem } from '../system-animal/export-system-animal';

export class SystemFactory {

    _factories;

    static _instance;

    constructor() {
        this._factories = [];
        this._factories[SystemTypes.circulatory] = CirculatorySystem;
        this._factories[SystemTypes.muscular] = MuscularSystem;
        this._factories[SystemTypes.memory] = MemorySystem;

    }

    /**
     * @returns {SystemFactory}
     */
    static instance() {
        if (!this._instance) {
            this._instance = new SystemFactory();
        }
        return this._instance;
    }

    create(typeSystem, params) {
        return new this._factories[typeSystem](params);
    }
}
