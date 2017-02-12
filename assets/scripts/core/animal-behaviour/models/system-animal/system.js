import { SystemScale } from '../system-scales/export-system-scales';

/**
 * Абстрактный класс для систем животного отец систем
 * @export
 * @class System
 */
class System {

    /**
     * Состояние системы в целом
     * @type {SystemScale} объект состояния
     * @memberOf System
     */
    _systemState;

    constructor(systemState) {
        this._systemState = systemState;

    }

    /**
     * Анализирует показатели системы выводя вердикт о состоянии
     *
     * @memberOf System
     */
    analyzeSystem() {
    }
}

export { System };

