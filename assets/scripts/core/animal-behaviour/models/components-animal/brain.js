
import { Memory } from './components-animal';
/**
 * Класс мозг
 * 
 * @export
 * @class Brain
 */
export class Brain{
    /**
     * Память мозга
     * 
     * 
     * @memberOf Brain
     */
    myMemory;
    /**
     * Creates an instance of Brain.
     * 
     * 
     * @memberOf Brain
     */
    constructor () {
        this.myMemory=new Memory();
    }
    /**
     * Осознает что надо искать воду и предпринимает некоторые действия
     * 
     * @returns {cc.Vec2|null} тайлд с водой или false
     * 
     * @memberOf Brain
     */
    needWater(){
        this.myMemory.findWater();
    }
    needGrass(){
    
    }
    needVictim(){

    }

}