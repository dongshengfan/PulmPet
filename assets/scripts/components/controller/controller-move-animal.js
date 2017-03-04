cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

    onTouchStart(event){
        cc.log('меня заметили мне наждо показаться ему во всей красе!');
        event.stopPropagation();
    },

    onTouchMove(event){
        cc.log('Отменя что-то хотят');
        event.stopPropagation();
    },

    onTouchEnd(event){
        cc.log('отпустили(');
        event.stopPropagation();
    },

});