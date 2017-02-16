/**
 * Created by shabanov on 12.02.2017.
 */
import {
    SystemTypes,
    CirculatorySystem,
    MemorySystem,
    MuscularSystem
} from '../animal-behaviour/export-animal-behaviour';

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
