/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace StateMachines.States {

    /**
     * Класс простого состояния
     * @class PrimitiveState
     */
    export class PrimitiveState extends State {

        /**
         * Creates an instance of PrimitiveState.
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
         * TODO удалить
         */
        run() {
            throw new Error('No implementation status...');
        }
    }
}