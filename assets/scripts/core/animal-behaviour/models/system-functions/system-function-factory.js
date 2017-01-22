import { LineSystemFunction } from './line-system-function';
/**
 * enum типов фабрик функций
 */
const SystemFactoryTypes = {
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
        this._factories[SystemFactoryTypes.line] = LineSystemFunction;
        
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
    create(systemFactoryType, params) { 
        return new this._factories[systemFactoryType](params);
    }
}

export { SystemFactoryTypes, SystemFunctionFactory }