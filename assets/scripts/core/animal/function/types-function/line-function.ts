/**
 * Created by FIRCorp on 19.02.2017.
 */
namespace Animal.Function {
    /**
     * Линейная функция
     */
    export class LineFunction implements IFunction {
        /**
         * Коэффицент
         * @type {Number}
         */
        private _coefficient: number;

        /**
         * Свободный коэффицент
         * @type {Number}
         */
        private _free: number;

        /**
         * Constructor of LineFunction
         * @param params массив параметров функции
         */
        constructor(params: number[]) {
            this._coefficient = params[0] || 0;
            this._free = params[1] || 0;
        }

        set coefficient(param:number){
            this._coefficient=param;
        }

        set free(param:number){
            this._free=param;
        }

        get coefficient(){
            return this._coefficient;
        }

        get free(){
            return this._free;
        }

        /**
         * Вычисляет функцию
         * @param param переменная
         * @returns {number} результат
         */
        calculate(param: number): number {
            return this._coefficient * param + this._free;
        }
    }
}