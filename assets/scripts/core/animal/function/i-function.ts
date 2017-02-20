/**
 * Created by FIRCorp on 19.02.2017.
 */
namespace Animal.Function {
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
}