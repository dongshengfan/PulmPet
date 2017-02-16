import { StateFactory } from './state-factory';
import { SystemFactory } from './system-factory';
import { ScaleFactory } from './scale-factory';
import {
    Animal,
    EventSystemBuilder,
    AnimalTypes,
    ProbabilityRouteEngine,
    Route,
    StateMachine,
    StateTypes
} from '../animal-behaviour/export-animal-behaviour';
/**
 * Фабрика животных для расчетов
 *
 * @class AnimalFactory
 */
class AnimalFactory {

    _animal;

    /**
     * @static
     * @memberOf AnimalFactory
     */
    static _instance;

    constructor() {
    }

    /**
     * @returns {AnimalFactory}
     */
    static instance() {
        if (!this._instance) {
            this._instance = new AnimalFactory();
        }
        return this._instance;
    }

    /**
     * Создание животного по типу
     *
     * @param {AnimalTypes} animalType
     * @param {JSON} params
     * @returns {Animal}
     *
     * @memberOf AnimalFactory
     */
    create(params) {
        var {sensitivitySystem,timeLive,systems, states}=params;
        //Создание коммуникатора
        let communicator = new EventSystemBuilder();
        //Создание систем
        let systemAnimal = this._createSystemAnimal(timeLive,systems.system, communicator.build());
        //Заполение связей коммуникатора
        let communicatorAnimal = this._createCommunicator(systems.eventCommunication, communicator);
        //настройкачувствительности
        communicatorAnimal._sensitivity=sensitivitySystem;
        //Создание животного
        this._animal = new Animal(systemAnimal, communicatorAnimal);
        //Создание состояний
        let stateMachineAnimal = this._createState(states);
        //установка стейт машиы в животное
        this._animal.setStateMachine(stateMachineAnimal);
        return this._animal;
    }

    /**
     * Сборка коммуникатора
     * @param eventCommunication массив из json
     * @param communicator соданный ранее коммуникатор
     * @returns {Communicator} Ujnjdsqrjvveybrfnjh
     * @private
     */
    _createCommunicator(eventCommunication, communicator) {
        eventCommunication.forEach((scale) => {
            communicator.addAll(scale.type, scale.link);
        });
        return communicator.build();
    }

    /**
     * Создание систем с их записью в коммуникатор для ориентации коммуникатора
     * @param system системы которыебудут у животного
     * @param communicator коммуникатор
     * @returns {Array} массив систем
     * @private
     */
    _createSystemAnimal(timeLive,system, communicator) {
        let factorySystem = SystemFactory.instance();
        let factoryScale = ScaleFactory.instance();
        let paramScale = [];
        let paramSystem = [];
        system.forEach((item) => {
            paramScale = [];
            item.scales.forEach((scale) => {
                paramScale[scale.typeScale] = factoryScale.create(scale.typeScale, scale.param,timeLive);
                paramScale[scale.typeScale].setCommunicator(communicator);
                communicator.addScale(scale.typeScale, paramScale[scale.typeScale]);
            });
            paramSystem[item.type] = factorySystem.create(item.type, paramScale);
        });
        return paramSystem;
    }

    /**
     * @returns {StateMachine}
     */
    _createState(states) {
        let factory = StateFactory.instance();
        let paramState = [];
        let {state, links}=states;
        state.forEach((item) => {
            paramState[item.type] = factory.create(item.type, this._animal, item.isEnd);
        });

        links.forEach((item) => {
            let massStates = [];
            item.link.forEach((state) => {
                massStates.push(new Route(paramState[state.type], (model, probability) => {

                    if (state.probability > probability) {

                        return true;
                    } else {
                        return false;
                    }
                }));
            });
            paramState[item.type].setRouteEngine(new ProbabilityRouteEngine(massStates));
        });
        return new StateMachine(paramState[StateTypes.start]);

    }

}

export { AnimalFactory };