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
     * @type {Number}
     * @memberOf LineSystemFunction
     */
    _coefficient;
    /**
     * Свободный коэффицент
     * 
     * @type {Number}
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
     * @param {Number} params
     * @returns {Number}
     * 
     * @memberOf LineSystemFunction
     */
    calculate(params) {
        return this._coefficient * params + this._free;
    }
}

export { LineSystemFunction };