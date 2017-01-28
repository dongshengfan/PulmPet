import { SystemFunction } from '../system-function';
/**
 * Класс линейных функций
 * @export
 * @class QuadraticSystemFunction
 */
class QuadraticSystemFunction extends SystemFunction { 
    /**
     * Коэффицент при главном члене 
     * 
     * @type {number}
     * @memberOf QuadraticSystemFunction
     */
    _coefficientA;
    /**
     * Коэффицент B урванения Ax^2+Bx+C=0
     * 
     * @type {number}
     * @memberOf QuadraticSystemFunction
     */
    _coefficientB;
    /**
     * Свободный коэффицент
     * 
     * @type {number}
     * @memberOf QuadraticSystemFunction
     */
    _free;
    constructor(params) {
        super(params);
        if (params) {
            this._coefficientA = params.coefficientA || 1;
            this._coefficientB = params.coefficientB || 0;
            this._free = params.free || 0;
        }    
    }

    /**
     * 
     * 
     * @param {any} params
     * @returns
     * 
     * @memberOf QuadraticSystemFunction
     */
    calculate(params) { 
        return this._coefficientA * (params** 2) + this._coefficientB * params + this._free;
    }
}

export { QuadraticSystemFunction };