/**
 * Класс обертка для параметров систем
 * @export
 * @class SystemScale
 */
class SystemScale {
    /**
     * Текущее значение параметра
     * @type {Number}
     * @memberOf SystemScale
     */
    current;
    /**
     * Минимальное значение которое может принимать current текущее значение
     * @type {Number}
     * @memberOf SystemScale
     */
    _min;
    /**
     * Максимальное значение которое может принимать current текущее значение
     * @type {Number}
     * @memberOf SystemScale
     */
    _max;
    /**
     * Процент положения параметра на интервале допустимых значений
     * @type {Number} процент
     * @memberOf SystemScale
     */
    scale;

    /**
     * Коммуникатор для общения с другими системами
     * @type {Communicator}
     */
    _communicator;

    constructor(params) {

        if (params) {
            this.current = params.current || 0;
            this._min = params.min || 0;
            this._max = params.max || 0;
            this.getPercentageInScale();
        }
    }

    /**
     * Добавляет марикровку на событие для шкалы
     * @param event
     */
    addEvent(event) {
        this.event = event;
    }

    /**
     * Устанавливает системе коммуникатор
     * @param {Communicator} communicator
     */
    setCommunicator(communicator) {
        this._communicator = communicator;
    }

    trigger(event, params, autoComplete = false) {
        if (autoComplete) {
            event = Math.sign(params) ? event.increase : event.decrease;
        }
        this._communicator.publish(event, params);
    }

    /**
     * Считает процент прогресса на основе интервала и текущего значения
     * @memberOf SystemScale
     */
    getPercentageInScale() {
        this.scale = ((this.current - this._min) * 100) / (this._max - this._min);
    }

    /**
     * Считает текущее значение по прогрессу и интервалу
     * @memberOf SystemScale
     */
    getCurrentValueOnScale() {
        this.current = (((this._max - this._min) / 100) * this.scale) + this._min;
    }

    /**
     * Изменяет процент шкалы  на дельту
     * @memberOf SystemScale
     */
    change(delta) {
        //let systemFunction = this._systemFunctions[functionType];
        let rez = this.scale + delta;
        if (rez <= 100 && rez >= 0) {
            this.scale = rez;
            this.getCurrentValueOnScale();
        }
    }

    /**
     * Производит изменение шкалы и дальнейшее распространение по сети
     * @param delta
     */
    recursiveChange(delta) {
        this.change(delta);
        this.trigger(this.event, delta, true);
    }

    /**
     *
     *
     * @param {Array<System>} params оценки шкал системы
     *
     * @memberOf SystemScale
     */
    analyze(params) {
        let rez = 0;
        params.forEach((param) => {
            rez += param.scale;
        });
        this.scale = rez / params.length;
        this.getCurrentValueOnScale();
    }
}

export { SystemScale };