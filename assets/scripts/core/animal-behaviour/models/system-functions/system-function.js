/**
 * Абстрактный класс функций
 * @export
 * @class SystemFunction
 */
class SystemFunction { 
    /**
     * Дефолтная функция 
     * @param {any} params
     * @returns
     * 
     * @memberOf SystemFunction
     */
    calculate(params) { 
        return params.value;
    }
}

export { SystemFunction };