/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animal.Communication {
    /**
     * Класс коммуникатора
     */
    export class Communicator {
        /**
         * Внутрення сеть
         * @type {ArgumentScale[]}
         */
        private _netLinks: any[];

        /**
         * Пропускной порог изменения шкалы для распространения подписчикам
         * @type {number}
         */
        private _sensitivity: number;

        constructor() {
            this._netLinks = [];
            this._sensitivity = 0.1;
        }

        set sensitivity(param: number) {
            this._sensitivity = param;
        }

        get sensitivity() {
            return this._sensitivity;
        }

        /**
         * Добавляет в сеть коммуникатора новую связь
         * @param event событие
         * @param link подписчик которого регистрируют на событие
         */
        addLink(event: any, link: any) {
            if (this._netLinks[event]) {
                this._netLinks[event].push(link);
            } else {
                this._netLinks[event] = [link];
            }
        }

        /**
         * Публикует событие в сети шкалл
         * @param pack пакет события которое происходит
         * @param param дельта изменения
         */
        publish(pack: any, param: number) {
            var links = this._netLinks[pack.type];
            if (links) {
                links.forEach((link: any) => {
                    let delta = link.fun.calculate(param);
                    if (Math.abs(delta) > this._sensitivity) {
                        delta = pack.behavior === link.behavior ? delta : -delta;
                        link.scale.change(delta);
                    }
                });
            }
        }
    }
}