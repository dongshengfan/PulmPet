import { SystemFunction } from '../system-function';
/**
 * Класс линейных функций
 * @export
 * @class LineSystemFunction
 */
class LineSystemFunction extends SystemFunction { 
    /**
     * Коэффицент 
     * 
     * @type {number}
     * @memberOf LineSystemFunction
     */
    _coefficient;
    /**
     * Свободный коэффицент
     * 
     * @type {number}
     * @memberOf LineSystemFunction
     */
    _free;
    constructor(params) {
        super(params);
        if (params) {
            this._coefficient = params.coefficient || 0.5;
            this._free = params.free || 0;
        }    
    }

    /**
     * 
     * 
     * @param {any} params
     * @returns
     * 
     * @memberOf LineSystemFunction
     */
    calculate(params) { 
        return this._coefficient * params.value + this._free;
    }
}

export { LineSystemFunction };