/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animal.Scale {
    /**
     * Абстрактный класс шкалы
     */
    export abstract class AScale {
        /**
         * Наименование шкалы
         * @type {string}
         */
        protected _name: string;

        /**
         * Минимальное значение шкалы
         * @type {number}
         */
        protected _min: number;

        /**
         * Максимальное значение шкалы
         * @type {number}
         */
        protected _max: number;

        /**
         * Текущее значение шкалы
         * @type {number}
         */
        protected _current: number;

        /**
         * Процент (прогресс) основанный на значении текущего поля в интервале (min,max)
         * @type {number}
         */
        protected _percent: number;

        /**
         * Тип параметра за который ответственна шкала
         * @type {ParameterScaleTypes}
         */
        protected _type: Animal.Scale.Factory.ParameterScaleTypes;

        set name(param: string) {
            this._name = param;
        }

        set min(param: number) {
            this._min = param;
            this.getPercentageInScale();
        }

        set max(param: number) {
            this._max = param;
            this.getPercentageInScale();
        }

        set current(param: number) {
            this._current = param;
            this.getPercentageInScale();
        }

        set percent(param: number) {
            this._percent = param;
            this.getCurrentValueOnScale()
        }

        set type(param: Animal.Scale.Factory.ParameterScaleTypes) {
            this._type = param;
        }

        get name(): string {
            return this._name;
        }

        get min(): number {
            return this._min;
        }

        get max(): number {
            return this._max;
        }

        get current(): number {
            return this._current;
        }

        get percent(): number {
            return this._percent;
        }

        get type(): Animal.Scale.Factory.ParameterScaleTypes {
            return this._type;
        }

        /**
         * Считает процент прогресса на основе интервала и текущего значения
         */
        getPercentageInScale(): void {
            this._percent = ((this._current - this._min) * 100) / (this._max - this._min);
        }

        /**
         * Считает текущее значение по прогрессу и интервалу
         */
        getCurrentValueOnScale(): void {
            this._current = (((this._max - this._min) / 100) * this._percent) + this._min;
        }
    }
}