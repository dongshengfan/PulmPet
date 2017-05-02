/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine.FactoryState {

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
            this._factories[TypesState.startLife] = Animals.StateMachine.StatesLib.StateStart;
            this._factories[TypesState.stand] = Animals.StateMachine.StatesLib.StateStand;
            this._factories[TypesState.run] = Animals.StateMachine.StatesLib.StateRun;
            this._factories[TypesState.die] = Animals.StateMachine.StatesLib.StateDie;
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
        add(type: TypesState, state: Animals.StateMachine.States.State): void {
            this._factories[type] = state;
        }

        /**
         * Создание состояния
         * @param typeState тип состояния
         * @param name имя состояния
         * @param animal модель состояния
         * @param isEnd флаг заключительного состояния
         */
        create(typeState: TypesState, name: string, animal: Animal, isEnd: boolean) {
            return new this._factories[typeState](name, animal, isEnd, null);
        }
    }
}