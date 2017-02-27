/**
 * Created by FIRCorp on 19.02.2017.
 */
namespace Animals.Functions {
    /**
     * Квадратичная функция
     */
    export class QuadraticFunction implements IFunction {
        /**
         * Коэффицент А уравнения y = Ax^2+Bx+C
         * @type {Number}
         */
        private _coefficientA: number;

        /**
         * Коэффицент B уравнения y = Ax^2+Bx+C
         * @type {Number}
         */
        private _coefficientB: number;

        /**
         * Свободный коэффицент
         * @type {Number}
         */
        private _free: number;

        /**
         * Constructor of QuadraticFunction
         * @param params массив параметров функции
         */
        constructor(params: number[]) {
            this._coefficientA = params[0] || 0;
            this._coefficientB = params[1] || 0;
            this._free = params[2] || 0;
        }

        set coefficientA(param: number) {
            this._coefficientA = param ? param : 0;
        }

        set coefficientB(param: number) {
            this._coefficientB = param ? param : 0;
        }

        set free(param: number) {
            this._free = param ? param : 0;
        }

        get coefficientA(): number {
            return this._coefficientA;
        }

        get coefficientB(): number {
            return this._coefficientB;
        }

        get free(): number {
            return this._free;
        }

        /**
         * Вычисляет функцию
         * @param param переменная
         * @returns {number} результат
         */
        calculate(param: number): number {
            return this._coefficientA * (param ** 2) + this._coefficientB * param + this._free;
        }
    }
}