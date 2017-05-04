/**
 * Created by FIRCorp on 04.05.2017.
 */
/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine {

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
        constructor(name: string, model: Animal, isEndPoint: boolean = false, routeEngine: Animals.StateMachine.RouteEngine = null) {
            super(name, model, routeEngine,isEndPoint);
        }

        /**
         * Запуск состояния
         * @returns any
         */
        run(next:any): any {

            console.log('бегу');
            /*this._model.circulatory.changeHeartbeat(0.5);
             this._model.circulatory.changePressure(0.2);*/
            this._model.muscular.changeSpeed(-0.4);
            this._model.muscular.changeWeight(-0.5);

                next.finishState();


        }
    }
}