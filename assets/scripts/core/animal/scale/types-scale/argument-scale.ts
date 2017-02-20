/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animal.Scale {
    /**
     * Шкала аргументов систем (отражает состояние конкретной системы)
     */
    export class ArgumentScale extends AScale {
        /**
         * Задержка ответа шкалы в миллисекундах
         * @type {number}
         */
        private _responseDelay: number;

        /**
         * Упрощает общение между шкалами
         */
        private _communicator: any;

        /**
         * Constructor of SystemScale
         * @param params
         */
        constructor(params: any) {
            super();
            this._name = params.name || "No name";
            this._min = params.min || 0;
            this._max = params.max || 100;
            this._current = params.current || this._max;
            this._responseDelay = params.responseDelay || 1000;
            this.getPercentageInScale();
        }

        set responseDelay(param: number) {
            this._responseDelay = param;
        }

        set communicator(param: any) {
            this._communicator = param;
        }

        get responseDelay() {
            return this._responseDelay;
        }

        get communicator() {
            return this._communicator;
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
    }
}