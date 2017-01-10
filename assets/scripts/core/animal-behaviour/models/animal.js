import { MemorySystem, SightSystem, CirculatorySystem, HearingSystem, IdentificationSystem } from './models';
/**
 * Класс животное
 * 
 * @export
 * @class Animal
 */
export class Animal {      

    /**
     * Позиция в которой находится животное фактически
     * 
     * @type {cc.Vec2} 
     * @memberOf Animal
     */
    currentPosition;

    /**
     * Система памяти животного
     * 
     * @type {MemorySystem} Класс системы памяти
     * @memberOf Animal
     */
    memory;
    /**
     * Система зрения животного
     * 
     * @type {SightSystem} Класс системы зрения
     * @memberOf Animal
     */
    sight;
    /**
     * Система кровообращения
     * 
     * @type {CirculatorySystem} Класс системы кровообращения
     * @memberOf Animal
     */
    circulatory;
    /**
     * Система слуха
     * 
     * @type {HearingSystem} Класс системы слуха
     * @memberOf Animal
     */
    hearing;
    /**
     * Система идентификации животного
     * 
     * @type {IdentificationSystem} Класс системы идентификации
     * @memberOf Animal
     */
    identification;

    
    /**
     * Creates an instance of Animal.
     * 
     * 
     * @memberOf Animal
     */
    constructor(){             
        this.memory=new MemorySystem();
        this.sight=new SightSystem();
        this.circulatory=new CirculatorySystem();
        this.hearing=new HearingSystem();
        this.identification=new IdentificationSystem();
    }
}

