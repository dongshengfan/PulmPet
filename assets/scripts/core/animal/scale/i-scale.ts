/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animal.Scale {
    /**
     * Интерфейс шкалы
     */
    export interface IScale {
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
         * Считает процент прогресса на основе интервала и текущего значения
         */
        getPercentageInScale(): void;

        /**
         * Считает текущее значение по прогрессу и интервалу
         */
        getCurrentValueOnScale(): void;
    }
}