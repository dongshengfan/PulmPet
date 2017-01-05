import { State } from './state';

/**
 * Класс-примитив для одиночных простых состояний.
 * Базовый класс всех простых состояний
 *
 * @export
 * @class PrimitiveState
 * @extends {State}
 */
export class PrimitiveState extends State { 
    
    /**
     * Creates an instance of PrimitiveState.
     * @memberOf PrimitiveState
     */
    constructor() { 
        super();
    }
}