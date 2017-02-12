/**
 * Абстрактный класс функций
 * @export
 * @class SystemFunction
 */
class SystemFunction {
    /**
     * Дефолтная функция
     * @param {Number} params
     * @returns {Number}
     *
     * @memberOf SystemFunction
     */
    calculate(params) {
        return params.value;
    }
}

export { SystemFunction };