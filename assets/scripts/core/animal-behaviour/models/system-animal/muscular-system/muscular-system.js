import { System } from '../system';
import { CommunicationEvents as events } from '../../system-communication/events';
import { ScalesTypes } from '../../animal-models/sceles-animal-types';

/**
 * Класс опорно-двигательной системы
 * {Скорость передвижения, вес}
 * @export
 * @class MuscularSystem
 */
class MuscularSystem extends System {
    /**
     * Скорость передвижения
     */
    _speed;

    /**
     * Вес животного
     */
    _weight;

    constructor(scales) {
        super(scales[ScalesTypes.stateSystem]);
        this._speed = scales[ScalesTypes.speed];
        this._weight = scales[ScalesTypes.weight];
        this._speed.addEvent(events.speed);
        this._weight.addEvent(events.weight);
    }

    changeSpeed(delta) {
        this._speed.recursiveChange(delta);
        this.analyzeSystem();

    }

    changeWeight(delta) {
        this._weight.recursiveChange(delta);
        this.analyzeSystem();
    }

    /**
     * Анализирует систему
     */
    analyzeSystem() {
        this._systemState.analyze([
            {
                scale: 100 - this._weight.scale
            },
            {
                scale: this._speed.scale
            }
        ]);
    }
}

export { MuscularSystem };