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

    constructor(params) {
        super(params);
        if (params) {
            this._coefficient = params.coefficient || 2;
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
        return this._coefficient * params.value;
    }
}

export { LineSystemFunction };