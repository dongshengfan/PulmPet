import { System } from '../system';
import { SystemScale } from '../../system-scales/export-system-scales';

/**
 * Класс опорно-двигательной системы
 * {Скорость передвижения, вес}
 * @export
 * @class MuscularSystem
 */
class MuscularSystem extends System{
    
    
    /**
     * Скорость передвижения
     * @type {SystemScale} объект скорости
     */
    _speed;
      
    /**
     * Вес животного
     * @type {SystemScale} объект веса
     * 
     */
    _weight;

    
    constructor() {
        super();
        this._speed  = new SystemScale();
        this._weight = new SystemScale();
    }
   
    onAgeIncrease(delta) {
        this._speed.addScaleValue(-delta);
        this._weight.addScaleValue(delta);
    }

  
}

export { MuscularSystem };