/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animals.Scales.TypeScales {
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
         * @type {Communicator}
         */
        private _communicator: Animals.Communications.Communicator;

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
            this._responseDelay = params.responseDelay || 1000
            this._type = params.type || 0;
            this.getPercentageInScale();
        }

        set responseDelay(param: number) {
            this._responseDelay = param ? param : 1000;
        }

        set communicator(param: Animals.Communications.Communicator) {
            this._communicator = param;
        }

        get responseDelay(): number {
            return this._responseDelay;
        }

        get communicator(): Animals.Communications.Communicator {
            return this._communicator;
        }

        /**
         * Публикует в сети коммуникатора свое событие с каким-то параметром
         * @param params дельта изменения этой шкалы
         */
        trigger(params: number): void {
            let event = Math.sign(params) ? Animals.Communications.Factorys.BehaviorScaleTypes.increase : Animals.Communications.Factorys.BehaviorScaleTypes.decrease;
            let pack = {
                behavior: event,
                type: this._type
            };
            this.communicator.publish(pack, params);
        }

        /**
         * Изменяет процент шкалы на дельту и рассылает свое изменение далее по подписчикам
         * @param delta дельта на которую необходимо изменить процент данной шкалы
         */
        change(delta: number): void {
            let rez = this.percent + delta;
            if (rez <= 100 && rez >= 0) {
                this.percent = rez;
                this.getCurrentValueOnScale();
            }
            setTimeout(() => {
                this.trigger(delta);
            }, this.responseDelay);
        }
    }
}