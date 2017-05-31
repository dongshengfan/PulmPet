/**
 * Created by FIRCorp on 02.05.2017.
 */

namespace StateMachines.States {

    /**
     * Состояние - Запустился
     * @class StateDie
     */
    export class StateStart extends State {

        /**
         * Creates an instance of StateStart.
         * @param name имя состояния
         * @param model модель животного
         * @param isEndPoint флаг заключительного состояния
         * @param routeEngine обработчик маршрутов между состояниями
         */
        constructor(name: string, model: Animals.Animal, isEndPoint: boolean = false, routeEngine: StateMachines.Routes.RouteEngine = null) {
            super(name, model, routeEngine, isEndPoint);
        }

        /**
         * Запуск состояния
         * @returns {Promise<void>}
         */
        async run(): Promise<void> {
            console.log('Начал жить');
            /*this._model.circulatory.changeHeartbeat(0.001);
             this._model.circulatory.changePressure(0.001);*/
            this._model.muscular.changeSpeed(0.001);
            this._model.muscular.changeWeight(0.001);
            await this.mySleep(2);//Ожидание в 2 секунды
        }
    }
}