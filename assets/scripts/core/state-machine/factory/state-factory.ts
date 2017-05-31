/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace StateMachines {

    /**
     * Фабрика состояний
     * @class StateFactory
     */
    export class StateFactory {

        /**
         * Массив различных конструкторов состояний
         */
        _factories: any[];

        /**
         * Экземпляр этой фабрики
         */
        static _instance: StateFactory;

        /**
         * Constructor of StateFactory
         */
        constructor() {
            this._factories = [];
            this._factories[TypesState.startLife] = StateMachines.States.StateStart;
            this._factories[TypesState.stand] = StateMachines.States.StateStand;
            this._factories[TypesState.run] = StateMachines.States.StateRun;
            this._factories[TypesState.die] = StateMachines.States.StateDie;
            this._factories[TypesState.sleep] = StateMachines.States.StateSleep;
            this._factories[TypesState.go] = StateMachines.States.StateGo;
            this._factories[TypesState.lies] = StateMachines.States.StateLies;
            this._factories[TypesState.sit] = StateMachines.States.StateSit;
        }

        /**
         * Создание фабрики
         * @returns {StateFactory}
         */
        static instance(): StateFactory {
            if (!this._instance) {
                this._instance = new StateFactory();
            }
            return this._instance;
        }

        /**
         * Добавление нового конструктора состояния
         * @param type тип состояния
         * @param state конструктор состояния
         */
        add(type: TypesState, state: StateMachines.States.State): void {
            this._factories[type] = state;
        }

        /**
         * Создание состояния
         * @param typeState тип состояния
         * @param name имя состояния
         * @param animal модель состояния
         * @param isEnd флаг заключительного состояния
         */
        create(typeState: TypesState, name: string, animal: Animals.Animal, isEnd: boolean) {
            return new this._factories[typeState](name, animal, isEnd, null);
        }
    }
}