/**
 * Created by FIRCorp on 04.05.2017.
 */
/**
 * Created by FIRCorp on 02.05.2017.
 */

namespace Animals.StateMachine {

    /**
     * Состояние - Умер
     * @class StateDie
     */
    export class StateDie extends State {

        /**
         * Creates an instance of StateDie.
         * @param name имя состояния
         * @param model модель животного
         * @param isEndPoint флаг заключительного состояния
         * @param routeEngine обработчик маршрутов между состояниями
         */
        constructor(name: string, model: Animal, isEndPoint: boolean = false, routeEngine: Animals.StateMachine.RouteEngine = null) {
            super(name, model, routeEngine, isEndPoint);

        }

        /**
         * Запуск состояния
         * @returns {Promise<void>}
         */
        async run(): Promise<void> {
            console.log('умер');
        }
    }
}