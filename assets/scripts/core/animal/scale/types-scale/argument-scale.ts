/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animal.Scale {
    /**
     * Шкала аргументов систем (отражает состояние конкретной системы)
     */
    export class ArgumentScale implements IScale {
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
         * Задержка ответа шкалы в миллисекундах
         * @type {number}
         */
        responseDelay: number;

        /**
         * Упрощает общение между шкалами
         */
        _communicator: any;

        /**
         * Constructor of SystemScale
         * @param params
         */
        constructor(params:any) {
            this._name = params.name || "No name";
            this._min = params.min || 0;
            this._max = params.max || 100;
            this.current = params.current || this._max;
            this.responseDelay = params.responseDelay || 1000;
            this.getPercentageInScale();
        }

        /**
         * Устанавливает коммуникатор в шкалу
         * @param communicator
         */
        setCommunicator(communicator: any): void {
            this._communicator = communicator;
        }

        /**
         * Публикует в сети коммуникатора свое событие с какимто параметром
         * @param event тип события
         * @param params дельта изменения этой шкалы
         */
        trigger(event: any, params: number): void {
            //Дописать
        }

        /**
         * Изменяет процент шкалы на дельту и рассылает свое изменение далее по подписчикам
         * @param delta дельта на которую необходимо изменить процент данной шкалы
         */
        change(delta: number): void {
            //Править
            let rez = this.percent + delta;
            if (rez <= 100 && rez >= 0) {
                this.percent = rez;
                this.getCurrentValueOnScale();
            }
            setTimeout(() => {
                this.trigger(0, delta);
            }, this.responseDelay);
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
    }
}