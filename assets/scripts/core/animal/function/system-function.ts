/**
 * Created by FIRCorp on 19.02.2017.
 */
namespace Animal.Function {
    export interface SystemFunction {
        /**
         * Вычисляет функцию
         * @param param дельта
         * @returns {number} результат
         */
        calculate(param: number): number;
    }
}