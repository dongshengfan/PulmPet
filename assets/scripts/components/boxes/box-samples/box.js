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
        _direction: Movement.toClose,//0- закрыться 1- открыться
        _eps: 1,//Эпсилон вычислений
        _intevalIncrements: 0.001,//интервал процедуры движения бокса
        _increments: 8,//шаг приращения бокса
        
        opacityBox: 30,//Прозрачность бокса 
        indentLeft: 50,//Отступ слева (в px)
        indentRight: 50,//Отступ справа (в px)
    },

    /**
     * Осуществляет первоначальную настройку
     */
    onLoad() {
        this._settings();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.getPermissionMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

    /**
     * Проверяет делает ли он это событие а не кто-то другой по ветке нодов
     * 
     * @param {Event} event
     */
    getPermissionMove(event) {
        if (event.target._name === this.node.name) {
            this.onTouchMove(event);
        }
    },

    /**
     * Выполняет проверку и завершает движение бокса 
     */
    _endSwipeX() {
        this._direction === Movement.toClose ? this._bringX(this._startPos) : this._bringX(this._endPos);
    },
    
    /**
     * Выполняет проверку и завершает движение бокса 
     */
    _endSwipeY() {
        this._direction === Movement.toClose ? this._bringY(this._startPos) : this._bringY(this._endPos);
    },

    /**
     * Доводит окошко до нужного положения по X
     * 
     * @param {cc.Vec2} coord
     */
    _bringX(coord) {
        let callBack = () => {
            if (this.node.x > coord.x - this._increments - this._eps && this.node.x < coord.x + this._increments + this._eps) {
                this.node.x = coord.x;
                this.unschedule(callBack);
            }
            if (coord.x > this.node.x) {
                this.node.x += this._increments;
            } else {
                this.node.x -= this._increments;
            }
        }
        this.schedule(callBack, this._intevalIncrements);
    },

    /**
     * Доводит окошко до нужного положения по Y
     * 
     * @param {cc.Vec2} coord
     */
    _bringY(coord) {
        let callBack = () => {
            if (this.node.y > coord.y - this._increments - this._eps && this.node.y < coord.y + this._increments + this._eps) {
                this.node.y = coord.y;
                this.unschedule(callBack);
            }
            if (coord.y > this.node.y) {
                this.node.y += this._increments;
            } else {
                this.node.y -= this._increments;
            }
        }
        this.schedule(callBack, this._intevalIncrements);
    },

    /**
     * Возвращает размер бокса относительно пространства на стороне и условий отступов 
     * 
     * @param {number} space
     * @returns space размер бокса
     */
    _getSizeBox(space) {
        return space - this.indentLeft - this.indentRight;
    },

    /**
     * Получает корень сцены (канвас)
     * 
     * @param {сс.Node} node
     * @returns node корень сцены
     */
    _getCanvas(node) {
        if (node.name === "Canvas") {
            return node;
        }
        return this._getCanvas(node.parent);
    },

    /**
     * Меняет направление которое необходимо сделать дальше боксу(закрыться или открыться)
     */
    _refocus() {
        this._direction === Movement.toClose ? this._direction = Movement.toOpen : this._direction = Movement.toClose;
    },

    /**
     * Обновляет прозрачность боксов
     * 
     * @param {any} dt
     */
    update(dt) {
        this._opacityNode();
    },

});

export { Box, Movement };