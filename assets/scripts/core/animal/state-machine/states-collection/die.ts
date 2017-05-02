/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine.StatesLib {

    /**
     * Состояние - Умер
     * @class StateDie
     */
    export class StateDie extends Animals.StateMachine.States.TypesState.PrimitiveState {

        /**
         * Creates an instance of StateDie.
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
            console.log('умер');
            setTimeout(() => {
                resolveFn();
            }, 4000);
            return promise;
        }
    }
}