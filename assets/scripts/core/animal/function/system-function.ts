/**
 * Created by FIRCorp on 19.02.2017.
 */
namespace Animal {
    export namespace Function {
        export interface SystemFunction {
            /**
             * Вычисляет функцию
             * @param param дельта
             * @returns {number} результат
             */
            calculate(param: number): number;
        }
    }
}