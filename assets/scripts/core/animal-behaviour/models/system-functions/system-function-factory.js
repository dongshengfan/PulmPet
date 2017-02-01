import { LineSystemFunction, QuadraticSystemFunction } from './types-system-function/export-types-system-function';
import { SystemFunctionTypes } from './system-function-types';
/**
 * Фабрика функций для расчетов
 * 
 * @class SystemFunctionFactory
 */
class SystemFunctionFactory {
    /**
     *  
     * @type {Array<SystemFunction>}
     * @memberOf SystemFunctionFactory
     */
    _factories;

    static _instance;

    constructor() {
        this._factories = {};
        this._factories[SystemFunctionTypes.line] = LineSystemFunction;
        this._factories[SystemFunctionTypes.quadratic] = QuadraticSystemFunction;
    }

    /**
     * @returns {SystemFunctionFactory}
     */
    static instance() {
        if (!this._instance) {
            this._instance = new SystemFunctionFactory();
        }
        return this._instance;
    }

    /**
     * 
     * 
     * @param {SystemFunctionTypes} systemFactoryType
     * @param {JSON} params
     * @returns {SystemFunction}
     * 
     * @memberOf SystemFunctionFactory
     */
    create(systemFunctionType, params) {
        return new this._factories[systemFunctionType](params);
    }
}

export { SystemFunctionFactory }