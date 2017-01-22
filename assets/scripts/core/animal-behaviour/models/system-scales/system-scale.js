import { SystemFactoryTypes, SystemFunctionFactory, SystemFunction} from '../system-functions/export-system-functions';

/**
 * 
 * @export
 * @class SystemScale
 */
class SystemScale { 
    current;
    min;
    max;
    scale;

    
    /**
     * @type {SystemFunction}
     * @memberOf SystemScale
     */
    _systemFunction;

    constructor(params, systemFactoryType) {
        this.current = params.current || 0;
        this.min = params.min || 0;
        this.max = params.max || 0;
        this.scale = params.scale || 0;
        
        this._systemFunction = new SystemFunctionFactory()
            .create(systemFactoryType || SystemFactoryTypes.line);
    }

    /**
     * Отдает процент прогресса на основе интервала и текущего значения
     * @memberOf SystemScale
     */
    getPercentageInScale() {
        this.scale = ((this.current - this.min) * 100) / (this.max - this.min);
    }
    
    /**
     * Отдает текущее значение по прогрессу и интервалу
     * @memberOf SystemScale
     */
    getCurrentValueOnScale() {
        this.current = (((this.max - this.min) / 100) * this.scale) + this.min;
    }

    /**
     * Добавляет к шкале параметра какое-то значение и производит перерасчет текущего значения этого параметра
     * @param {number} delta дельта изменеия чего-либо
     * @memberOf System
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