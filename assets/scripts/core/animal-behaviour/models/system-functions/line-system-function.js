import { SystemFunction } from './system-function';
/**
 * Абстрактный класс функций
 * @export
 * @class SystemFunction
 */
class LineSystemFunction extends SystemFunction { 
    _coefficient;

    constructor(params) {
        super(params);
        if (params) {
            this._coefficient = params.coefficient || 2;
        }    
    }

    calculate(params) { 
        return this._coefficient * params.value;
    }
}

export { LineSystemFunction };