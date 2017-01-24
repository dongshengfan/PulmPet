const Movement = {
    toClose: 0,
    toOpen: 1
};

var Box = cc.Class({
    extends: cc.Component,
    
    properties: {
        propagate: {
            default: false
        },
        //maska:cc.Node,//маска насцене
        _startPos:null,
        _endPos:null,
        _amountPix:0,//количество пикселей
        sizeBox: 0,
        naprav: Movement.toClose,//0- закрыться 1- открыться
        eps:0,//Эпсилон вычислений
        intevalDovoda:0.1,//интервал процедуры движения бокса
        stepDovoda:1,//шаг приращения бокса
        alfaBox:0,//Прозрачность бокса
        //      vertical: 0,//по вертикалиили по горизонтали 0-горизонтальный бокс
        // ...    
    },

    onLoad: function () {
        this._setPosition();
        this.node.opacity = 160;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },
});

export { Box, Movement };