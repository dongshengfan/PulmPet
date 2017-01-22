import { LineSystemFunction } from './line-system-function';
/**
 * enum типов фабрик функций
 */
const SystemFunctionTypes = {
    line: 0
}

/**
 * Фабрика функций для расчетов
 * 
 * @class SystemFunctionFactory
 */
class SystemFunctionFactory {
    /**
     *  
     * @type {Array}
     * @memberOf SystemFunctionFactory
     */
    _factories;

    constructor() { 
        this._factories = {};
        this._factories[SystemFunctionTypes.line] = LineSystemFunction;
    }

    /**
     * 
     * 
     * @param {any} systemFactoryType
     * @param {any} params
     * @returns
     * 
     * @memberOf SystemFunctionFactory
     */
    create(systemFunctionType, params) { 
        return new this._factories[systemFunctionType](params);
    }
}

export { SystemFunctionTypes, SystemFunctionFactory }