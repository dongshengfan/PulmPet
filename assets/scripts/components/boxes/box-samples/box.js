/**
 * Enum состояний бокса
 * @typedef {Object} Movement
 * @property {number} toClose бокс закрыт.
 * @property {number} toOpen бокс открыт.
 */

/**
 * Состояние бокса (открыт/закрыт)
 * @type {Movement}
 */
const Movement = {
    toClose: 0,
    toOpen: 1,
};

/**
 * Enum состояний работы бокса
 * @typedef {Object} TypeBox
 * @property {number} bottom работа как нижний бокс.
 * @property {number} top работа как верхний бокс.
 * @property {number} right работа как правый бокс.
 * @property {number} left работа как левы бокс.
 */

/**
 * Тип бокса
 * @type {{bottom: number, top: number, right: number, left: number}}
 */
const TypeBox = {
    bottom: 0,
    top: 1,
    right: 2,
    left: 3,
};
/**
 * Zlhj
 * @type {Function}
 */
var Box = cc.Class({
    extends: cc.Component,

    properties: {
        _startPos: null,//Стартовая позиция бокса
        _endPos: null,//конечная позиция бокса
        _type: null,//состояние типа бокса в котором он работает
        _direction: 1,//0- закрыться 1- открыться
        _flagBlock: false,//флаг блокировки
        _flagZaprosBlock: false,//флаг о необходиомсти блокировки
        _amountPix: null,//путь для бокса

        timeBring: 0.2,//Время довода в секундах
        content: cc.Node,//контент над которым необходимо произвести работу
        opacityBox: 30,//Прозрачность бокса 
        indentLeft: 50,//Отступ слева (в px)
        indentRight: 50,//Отступ справа (в px)
    },

    /**
     * Осуществляет первоначальную настройку
     */
    onLoad() {
        this._init();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._getPermissionMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

    /**
     * Инициализация переменных
     * @private
     */
    _init(){
        //Дальнейшее действие бокса
        this._direction = Movement.toOpen;
        this._settings();
    },

    /**
     * Действия на страт тача
     * @param {cc.Event} event
     */
    onTouchStart(event) {

    },

    /**
     * Действия на движение тача
     * @param {cc.Event} event событие
     */
    onTouchMove(event) {
        var delta = event.touch.getDelta();
        if (!this._flagBlock) {
            this._setMovement(delta)._moveBox(delta);
        }
    },

    /**
     * Действие на завершение тача
     * @param {cc.Event} event событие
     */
    onTouchEnd(event) {
        if (!this._flagBlock) {
            this._endSwipe();
        }
    },

    /**
     * Включает блокировку бокса
     */
    onBlock(){
        this._flagZaprosBlock = true;
        this._flagBlock = true;
    },

    /**
     * Выключает блокировку бокса
     */
    offBlock(){
        this._flagZaprosBlock = false;
        this._flagBlock = false;
    },

    /**
     * Открывает бокс
     */
    openBox(){
        this._direction = Movement.toOpen;
        this._endSwipe();
    },

    /**
     * Закрывает бокс
     */
    closeBox(){
        this._direction = Movement.toClose;
        this._endSwipe();
    },

    /**
     * Определяет ожидаемое состояние по направлению движения бокса
     * @param delta приращение
     * @returns {Box} этот класс
     * @private
     */
    _setMovement(delta) {
        if (this._type === TypeBox.top) {
            this._direction = delta.y > 0 ? Movement.toClose : Movement.toOpen;
        } else if (this._type === TypeBox.bottom) {
            this._direction = delta.y < 0 ? Movement.toClose : Movement.toOpen;
        } else if (this._type === TypeBox.left) {
            this._direction = delta.x < 0 ? Movement.toClose : Movement.toOpen;
        } else {
            this._direction = delta.x > 0 ? Movement.toClose : Movement.toOpen;
        }
        return this;
    },

    /**
     * Проверка на выход бокса за пределы интервала в резудьтате выполнения данного приращения. true-когда он не выходит
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @return {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isCheckOutOfRange(delta, start, end, current){
        return start < end ? this._isOutOfRangeLeftBottom(delta, start, end, current) : this._isOutOfRangeRightTop(delta, start, end, current);
    },

    /**
     * Проверка на выход левого и нижнего бокса за пределы интервала в резудьтате выполнения данного приращения
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @returns {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isOutOfRangeLeftBottom(delta, start, end, current){
        return delta + current > start && delta + current < end;
    },

    /**
     * Проверка на выход верхнего и правого бокса за пределы интервала в резудьтате выполнения данного приращения
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @returns {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isOutOfRangeRightTop(delta, start, end, current){
        return delta + current < start && delta + current > end;
    },

    /**
     * Движение бокса
     * @param {cc.Vec2} delta приращение
     * @returns {Box}
     * @private
     */
    _moveBox(delta) {
        if (this._type === TypeBox.top || this._type === TypeBox.bottom) {
            (this._isCheckOutOfRange(delta.y, this._startPos.y, this._endPos.y, this.node.y)) ? this.node.y += delta.y : this._endSwipe();
        } else {
            (this._isCheckOutOfRange(delta.x, this._startPos.x, this._endPos.x, this.node.x)) ? this.node.x += delta.x : this._endSwipe();
        }
        return this;
    },

    /**
     * Выполняет авто доводку
     * @private
     */
    _endSwipe(){
        this._flagBlock = true;
        this._direction === Movement.toClose ? this._bring(this._startPos) : this._bring(this._endPos);
        this._refocus();
    },

    /**
     * Выполняет авто довод  бокса до финальной точки назначения
     * @param pos точка назначения
     * @private
     */
    _bring(pos){
        var action = cc.moveTo(this.timeBring, pos);
        this.node.runAction(
            cc.sequence(action, cc.callFunc(this._finishBring, this))
        );
    },

    /**
     * Функция сигнализирующая о завершении доводки бокса
     * @private
     */
    _finishBring(){
        if (!this._flagZaprosBlock) this._flagBlock = false;
    },

    /**
     * Проверяет делает ли он это событие а не кто-то другой по ветке нодов до него
     * @param event событие
     * @private
     */
    _getPermissionMove(event) {
        if (event.target._name === this.node.name) {
            this.onTouchMove(event);
        }
    },

    /**
     * Возвращает размер бокса относительно пространства на стороне и условий отступов
     * @param {number} space  размер боксадо приращения
     * @returns {number} размер бокса
     * @private
     */
    _getSizeBox(space) {
        return space - this.indentLeft - this.indentRight;
    },

    /**
     * Меняет действие которое необходимо сделать дальше боксу(закрыться или открыться).Публикует событие
     * @private
     */
    _refocus() {
        if (this._direction === Movement.toClose) {
            this._direction = Movement.toOpen;
            this.publishEventClose();
        } else {
            this._direction = Movement.toClose;
            this.publishEventOpen();
        }
    },

    /**
     * Работа с прозрачностью бокса. Изменяет прозрачность бокса на основе положения его относительно начальных и конечных координат
     * @private
     */
    _opacityNode(currentPosBox) {
        let opasity = this.opacityBox + (((255 - this.opacityBox) * currentPosBox) / this._amountPix);
        if (opasity > 255) {
            opasity = 255;
        } else if (opasity < this.opacityBox) {
            opasity = this.opacityBox;
        }
        this.node.opacity = opasity;
    },
});

export { Box, Movement, TypeBox };