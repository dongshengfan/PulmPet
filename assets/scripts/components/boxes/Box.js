const Movement = {
    toClose: 0,
    toOpen: 1
};

var Box = cc.Class({
    extends: cc.Component,
    
    properties: {
        _startPos:null,
        _endPos:null,
        _amountPix:0,//количество пикселей
        direction: Movement.toClose,//0- закрыться 1- открыться
        eps:1,//Эпсилон вычислений
        intevalIncrements:0.001,//интервал процедуры движения бокса
        increments:8,//шаг приращения бокса
        opacityBox:30,//Прозрачность бокса 
    },

    onLoad: function () {
  
        this._setPosition();
  
        //this.node.opacity = 160;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.getPermissionMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

    /**
     * Проверяет делает ли он это событие а не кто-то другой по ветке нодов
     * 
     * @param {Event} event
     * @returns 
     */
    getPermissionMove: function(event){   
        if( event.target._name===this.node.name){
            this.onTouchMove(event);
        }
    },
    _getCanvas: function (node){
 
        if(node.parent.name ===""){     
            return node; 
        }
       return this._getCanvas(node.parent);
       
    },
    update:function(dt){
        this._opacityNode();
    },
});

export { Box, Movement };