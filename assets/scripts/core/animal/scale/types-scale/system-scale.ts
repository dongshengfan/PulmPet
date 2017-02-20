/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animal.Scale {
    /**
     * Системная шкала (Отражает состояние системы в целом)
     */
    export class SystemScale implements IScale {
        /**
         * Наименование шкалы
         * @type {string}
         */
        _name: string;

        /**
         * Минимальное значение шкалы
         * @type {number}
         */
        _min: number;

        /**
         * Максимальное значение шкалы
         * @type {number}
         */
        _max: number;

        /**
         * Текущее значение шкалы
         * @type {number}
         */
        current: number;

        /**
         * Процент (прогресс) основанный на значении текущего поля в интервале (min,max)
         * @type {number}
         */
        percent: number;

        /**
         * Constructor of SystemScale
         * @param params
         */
        constructor(params:any) {
            this._name = params.name || "No name";
            this._min = params.min || 0;
            this._max = params.max || 100;
            this.current = params.current || this._max;
            this.getPercentageInScale();
        }

        /**
         * Считает процент прогресса на основе интервала и текущего значения
         */
        getPercentageInScale(): void {
            this.percent = ((this.current - this._min) * 100) / (this._max - this._min);
        }

        /**
         * Считает текущее значение по прогрессу и интервалу
         */
        getCurrentValueOnScale(): void {
            this.current = (((this._max - this._min) / 100) * this.percent) + this._min;
        }

        /**
         * Оценивает состояние по состоянию шкал системы
         * @param params оценки шкал систем
         */
        analysis(params: any[]): void {
            //Переписать
            let rez = 0;
            params.forEach((param) => {
                rez += param.percent;
            });
            //Среднее
            this.percent = rez / params.length;
            this.getCurrentValueOnScale();
        }
    }
}