import { SystemFunction } from '../system-function';
/**
 * Класс линейных функций
 * @export
 * @class ParabolicSystemFunction
 */
class ParabolicSystemFunction extends SystemFunction { 
    /**
     * Коэффицент 
     * 
     * @type {number}
     * @memberOf ParabolicSystemFunction
     */
    _coefficient;

    constructor(params) {
        super(params);
        if (params) {
            this._coefficient = params.coefficient || 4;
        }    
    }

    /**
     * 
     * 
     * @param {any} params
     * @returns
     * 
     * @memberOf ParabolicSystemFunction
     */
    calculate(params) { 
        return this._coefficient ** 2+ this._coefficient * params.value;
    }
}

export { ParabolicSystemFunction };