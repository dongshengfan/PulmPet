import { SystemFunctionTypes, SystemFunctionFactory, SystemFunction} from '../system-functions/export-system-functions';

/**
 * Класс обертка для параметров систем
 * @export
 * @class SystemScale
 */
class SystemScale { 
    /**
     * Текущее значение параметра
     * @type {number}  
     * @memberOf SystemScale
     */
    current;
    /**
     * Минимальное значение которое может принимать current текущее значение
     * @type {number}
     * @memberOf SystemScale
     */
    min;
    /**
     * Максимальное значение которое может принимать current текущее значение
     * @type {number} 
     * @memberOf SystemScale
     */
    max;
    /**
     * Процент положения параметра на интервале допустимых значений
     * @type {number} процент
     * @memberOf SystemScale
     */
    scale;

    
    /**
     * Система функций для расчета
     * @type {SystemFunction}
     * @memberOf SystemScale
     */
    _systemFunction;

    constructor(params, systemFactoryType) {
        this.current = params.current || 0;
        this.min = params.min || 0;
        this.max = params.max || 0;
        this.getPercentageInScale();

        this._systemFunction = new SystemFunctionFactory()
            .create(systemFactoryType || SystemFunctionTypes.line);
    }

    /**
     * Считает процент прогресса на основе интервала и текущего значения
     * @memberOf SystemScale
     */
    getPercentageInScale() {
        this.scale = ((this.current - this.min) * 100) / (this.max - this.min);
    }
    
    /**
     * Считает текущее значение по прогрессу и интервалу
     * @memberOf SystemScale
     */
    getCurrentValueOnScale() {
        this.current = (((this.max - this.min) / 100) * this.scale) + this.min;
    }

    /**
     * Добавляет к шкале параметра какое-то значение и производит перерасчет текущего значения этого параметра
     * @param {number} delta дельта изменеия процента какого-либо параметра
     * @memberOf SystemScale
     */
    addScaleValue(delta) {
        let rez = this.scale + this._systemFunction.calculate(delta);
        if(rez <= 100 && rez >= 0){
            this.scale = rez;
            this.getCurrentValueOnScale();
        }
    }
}

export { SystemScale };