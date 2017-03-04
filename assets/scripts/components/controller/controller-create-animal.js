cc.Class({
    extends: cc.Component,


    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

    onTouchStart(event){
        let myEvent = new cc.Event.EventCustom('startDragAndDropAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },

    onTouchMove(event){
        var delta = event.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
        let myEvent = new cc.Event.EventCustom('dragAndDropAnimal', true);
        myEvent.detail = {
            animal: this.node
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },

    onTouchEnd(event){
        let myEvent = new cc.Event.EventCustom('stopDragAndDropAnimal', true);
        myEvent.detail = {
            animal: this.node
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },
});
