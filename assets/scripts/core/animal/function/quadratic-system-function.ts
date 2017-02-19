/**
 * Created by FIRCorp on 19.02.2017.
 */
namespace Animal {
    export namespace Function {
        export class QuadraticSystemFunction implements SystemFunction {
            /**
             * Коэффицент А уравнения Ax^2+Bx+C=0
             * @type {Number}
             */
            _coefficientA:number;
            /**
             * Коэффицент B уравнения Ax^2+Bx+C=0
             * @type {Number}
             */
            _coefficientB:number;

            /**
             * Свободный коэффицент
             * @type {Number}
             */
            _free: number;

            /**
             * Constructor of function
             * @param params массив параметров функции
             */
            constructor(params: number[]) {
                this._coefficientA = params[0] || 0;
                this._coefficientB = params[1] || 0;
                this._free = params[2] || 0;
            }

            /**
             * Вычисляет функцию
             * @param param дельта
             * @returns {number} результат
             */
            calculate(param: number): number {
                return this._coefficientA * (param ** 2) + this._coefficientB * param + this._free;
            }
        }
    }
}