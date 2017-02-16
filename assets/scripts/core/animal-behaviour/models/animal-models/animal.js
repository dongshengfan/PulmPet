import { MuscularSystem, CirculatorySystem } from '../system-animal/export-system-animal';
import { Communicator } from '../../communication/export-system-communication';
import { SystemTypes } from '../../enum-lists/system-animal-types';
/**
 * Класс животное
 *
 * @export
 * @class Animal
 */
class Animal {

    /**
     * Система памяти животного
     *
     * @type {MemorySystem} Класс системы памяти
     * @memberOf Animal
     */
    _memory;
    /**
     * Сердечнососудистая система
     *
     * @type {CirculatorySystem} Класс сердечнососудистой системы
     * @memberOf Animal
     */
    _circulatory;
    /**
     * Опорно-двигательная система/аппарат
     *
     * @type {MuscularSystem} Класс опорно-двигательного аппарата
     * @memberOf Animal
     */
    _muscular;

    /**
     * @param {Communicator}
     * @memberOf Animal
     */
    _communicator;


    /**
     *
     * @param {StateMachine}
     * @memberOf Animal
     */
    _stateMachine;

    /**
     * Creates an instance of Animal.
     * @memberOf Animal
     */
    constructor(systems, communicator) {
        this._muscular = systems[SystemTypes.muscular];
        this._circulatory = systems[SystemTypes.circulatory];
        this._communicator = communicator;
    }

    setStateMachine(stateMachine) {
        this._stateMachine = stateMachine;
    }

    run() {
        this._stateMachine.run();
    }


}

export { Animal };