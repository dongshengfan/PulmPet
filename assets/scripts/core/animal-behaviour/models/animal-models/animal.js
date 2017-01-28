
import { MuscularSystem, CirculatorySystem} from '../system-animal/export-system-animal';
import { Communicator } from '../system-communication/export-system-communication';

/**
 * Класс животное
 * 
 * @export
 * @class Animal
 */
class Animal { 

    /**
     * Позиция в которой находится животное фактически
     * 
     * @type {cc.Vec2} 
     * @memberOf Animal
     */
    currentPosition;
    /**
     * Цель для движения
     * 
     * @type {cc.Vec2}
     * @memberOf Animal
     */
    targetPosition;

    /**
     * Система памяти животного
     * 
     * @type {MemorySystem} Класс системы памяти
     * @memberOf Animal
     */
    memory;
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
     * @param {Communicator} params
     * @memberOf Animal
     */
    _communicator;
    
    _stateMachine;

    /**
     * Creates an instance of Animal.
     * @memberOf Animal
     */
    constructor(params, systems, communicator) {
        this._muscular = systems.muscular;
        this._circulatory = systems.circulatory;
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