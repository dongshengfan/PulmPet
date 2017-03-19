    const Movement = {
    toClose: 0,
    toOpen: 1
};

var Box = cc.Class({
    extends: cc.Component,

    properties: {
        _startPos: null,//Стартовая позиция бокса
        _endPos: null,//конечная позиция бокса
        _amountPix: 0,//количество пикселей или какой путь надо пройти
        _direction: 1,//0- закрыться 1- открыться
        _eps: 1,//Эпсилон вычислений
        _intervalIncrements: 0.001,//интервал процедуры движения бокса
        _increments: 8,//шаг приращения бокса
        _flag: false,//флаг рассылки сообщений
        _flagBlock: false,//флаг блокировки
        _callBack: null,//кол бек для движения бокса, он сбрасывает предыдущее состояние

        content: cc.Node,//контент над которым необходимо произвести работу
        opacityBox: 30,//Прозрачность бокса 
        indentLeft: 50,//Отступ слева (в px)
        indentRight: 50,//Отступ справа (в px)
    },

    /**
     * Осуществляет первоначальную настройку
     */
    onLoad() {
        this._direction = Movement.toOpen;
        this._settings();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.getPermissionMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

    /**
     * Включить блокировку
     */
    onBlock(){
        this._flagBlock = true;
    },

    /**
     * Выключить блокировку
     */
    offBlock(){
        this._flagBlock = false;
    },

    /**
     * Проверяет делает ли он это событие а не кто-то другой по ветке нодов
     * @param {Event} event
     */
    getPermissionMove(event) {
        if (event.target._name === this.node.name) {
            this.onTouchMove(event);
        }
    },

    /**
     * Выполняет проверку и завершает движение бокса по X
     */
    _endSwipeX() {
        this._direction === Movement.toClose ? this._bringX(this._startPos) : this._bringX(this._endPos);
        if (this._flag) {
            this._refocus();
        }
    },

    /**
     * Выполняет проверку и завершает движение бокса по Y
     */
    _endSwipeY() {
        this._direction === Movement.toClose ? this._bringY(this._startPos) : this._bringY(this._endPos);
        if (this._flag) {
            this._refocus();
        }
    },

    /**
     * Доводит окошко до нужного положения по X
     * @param {cc.Vec2} coord
     */
    _bringX(coord) {
        this.unschedule(this._callBack);
        this._callBack = () => {
            if (this.node.x > coord.x - this._increments - this._eps && this.node.x < coord.x + this._increments + this._eps) {
                this.node.x = coord.x;
                this.unschedule(this._callBack);
            }
            if (coord.x > this.node.x) {
                this.node.x += this._increments;
            } else {
                this.node.x -= this._increments;
            }
        }
        this.schedule(this._callBack, this._intervalIncrements);
    },

    /**
     * Доводит окошко до нужного положения по Y
     * @param {cc.Vec2} coord
     */
    _bringY(coord) {
        this.unschedule(this._callBack);
        this._callBack = () => {
            if (this.node.y > coord.y - this._increments - this._eps && this.node.y < coord.y + this._increments + this._eps) {
                this.node.y = coord.y;
                this.unschedule(this._callBack);
            }
            if (coord.y > this.node.y) {
                this.node.y += this._increments;
            } else {
                this.node.y -= this._increments;
            }
        }
        this.schedule(this._callBack, this._intervalIncrements);
    },

    /**
     * Возвращает размер бокса относительно пространства на стороне и условий отступов
     * @param {number} space
     * @returns space размер бокса
     */
    _getSizeBox(space) {
        return space - this.indentLeft - this.indentRight;
    },

    /**
     * Меняет направление которое необходимо сделать дальше боксу(закрыться или открыться)
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
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update(dt) {
        this._opacityNode();
    },
});

export { Box, Movement };