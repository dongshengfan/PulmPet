import { SystemFunctionTypes, SystemFunctionFactory, SystemFunction } from '../system-functions/export-system-functions';

/**
 * Класс обертка для параметров систем
 * @export
 * @class SystemScale
 */
class SystemScale {
    /**
     * Текущее значение параметра
     * @type {Number}  
     * @memberOf SystemScale
     */
    current;
    /**
     * Минимальное значение которое может принимать current текущее значение
     * @type {Number}
     * @memberOf SystemScale
     */
    _min;
    /**
     * Максимальное значение которое может принимать current текущее значение
     * @type {Number} 
     * @memberOf SystemScale
     */
    _max;
    /**
     * Процент положения параметра на интервале допустимых значений
     * @type {Number} процент
     * @memberOf SystemScale
     */
    scale;


    /**
     * Система функций для расчета
     * @type {SystemFunction}
     * @memberOf SystemScale
     */
    _systemFunctions;

    constructor(params, functions) {
        if (params) {
            this.current = params.current || 0;
            this._min = params.min || 0;
            this._max = params.max || 0;
            this.getPercentageInScale();
        }

        this._systemFunctions = functions || {};
    }

    /**
     * Считает процент прогресса на основе интервала и текущего значения
     * @memberOf SystemScale
     */
    getPercentageInScale() {
        this.scale = ((this.current - this._min) * 100) / (this._max - this._min);
    }

    /**
     * Считает текущее значение по прогрессу и интервалу
     * @memberOf SystemScale
     */
    getCurrentValueOnScale() {
        this.current = (((this._max - this._min) / 100) * this.scale) + this._min;
    }

    /**
     * Добавляет к шкале параметра какое-то значение и производит перерасчет текущего значения этого параметра
     * @param {Number} delta дельта изменеия процента какого-либо параметра
     * @param {SystemFunctionTypes} functionType
     * @memberOf SystemScale
     */
    addScaleValue(delta, functionType) {
        let systemFunction = this._systemFunctions[functionType];
        let rez = this.scale + systemFunction.calculate(delta);
        if (rez <= 100 && rez >= 0) {
            this.scale = rez;
            this.getCurrentValueOnScale();
        }
    }

    /**
     * 
     * 
     * @param {SystemFunctionTypes} functionType
     * @param {Function} functionInstance
     * 
     * @memberOf SystemScale
     */
    addFunction(functionType, functionInstance) {
        this._systemFunctions[functionType] = functionInstance;
    }

    /**
     * 
     * 
     * @param {Array<System>} params оценки шкал системы
     * 
     * @memberOf SystemScale
     */
    analyze(params) {
        let rez = 0;
        params.forEach((param) => {
            rez += param.scale;
        });
        this.scale = rez / params.length;
        this.getCurrentValueOnScale();
    }
}

export { SystemScale };