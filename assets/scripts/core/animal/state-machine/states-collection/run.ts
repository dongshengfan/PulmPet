/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine.StatesLib {

    /**
     * Состояние - Бежит
     * @class StateRun
     */
    export class StateRun extends Animals.StateMachine.States.TypesState.PrimitiveState {

        /**
         * Creates an instance of StateRun.
         * @param name имя состояния
         * @param model модель животного
         * @param isEndPoint флаг заключительного состояния
         * @param routeEngine обработчик маршрутов между состояниями
         */
        constructor(name: string, model: Animal, isEndPoint: boolean = false, routeEngine: Animals.StateMachine.Routes.Engines.RouteEngine = null) {
            super(name, model, isEndPoint, routeEngine);
        }

        /**
         * Запуск состояния
         * @returns {Promise<boolean>}
         */
        run(): Promise<Boolean> {
            let resolveFn: any, rejectFn: any;
            let promise = new Promise((resolve, reject) => {
                resolveFn = resolve;
                rejectFn = reject;
            });
            console.log('бегу');
            /*this._model.circulatory.changeHeartbeat(0.5);
            this._model.circulatory.changePressure(0.2);*/
            this._model.muscular.changeSpeed(-0.4);
            this._model.muscular.changeWeight(-0.5);
            setTimeout(() => {
                resolveFn();
            }, 4000);
            return promise;
        }
    }
}