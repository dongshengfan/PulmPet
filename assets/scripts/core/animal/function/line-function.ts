/**
 * Created by FIRCorp on 19.02.2017.
 */
namespace Animal {
    export namespace Function {
        export class LineSystemFunction implements SystemFunction {
            /**
             * Коэффицент
             * @type {Number}
             */
            _coefficient: number;

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
                this._coefficient = params[0] || 0;
                this._free = params[1] || 0;
            }

            /**
             * Вычисляет функцию
             * @param param дельта
             * @returns {number} результат
             */
            calculate(param: number): number {
                return this._coefficient * param + this._free;
            }
        }
    }
}