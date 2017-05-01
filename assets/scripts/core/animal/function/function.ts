/**
 * Created by FIRCorp on 19.02.2017.
 */
namespace Animals.Functions {
    /**
     * Интерфейс функций
     */
    export interface IFunction {
        /**
         * Вычисляет функцию
         * @param param переменная
         * @returns {number} результат
         */
        calculate(param: number): number;
    }

    /**
     * Интерфейс конструктора функций
     */
    export interface IFunctionConstructor {
        /**
         * Constructor of functions
         * @param params массив параметров функции
         */
        new(params: number[]): IFunction;
    }
}