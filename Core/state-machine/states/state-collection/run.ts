/**
 * Created by FIRCorp on 04.05.2017.
 */

namespace StateMachines.States {

    /**
     * Состояние - Бежит
     * @class StateRun
     */
    export class StateRun extends State {

        /**
         * Creates an instance of StateRun.
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
            console.log('бегу');
            this._model.circulatory.changeHeartbeat(0.5);
            this._model.circulatory.changePressure(0.2);
            this._model.muscular.changeSpeed(-0.4);
            this._model.muscular.changeWeight(-0.5);

            await this.mySleep(2);//Ожидание
        }


    }
}