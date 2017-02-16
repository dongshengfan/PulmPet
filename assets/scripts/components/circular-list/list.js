import { CircularList } from './circular-list';
cc.Class({
    extends: cc.Component,

    properties: {
        manager: CircularList,
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },


    /**
     * Вращение панели
     * 
     * @param {any} event
     */
    onTouchMove(event) {
        var delta = event.touch.getDelta();
    
        this.manager.directionfinding(delta.x, delta.y,this.node.x,this.node.y);
        event.stopPropagation();
    },

    onTouchStart(event) {
        event.stopPropagation();
      /*  var delta = event.touch.getDelta();

        this.manager.directionfinding(delta.x, delta.y,this.node.x,this.node.y);*/

    },

    onTouchEnd(event) {
        event.stopPropagation();
       /* var delta = event.touch.getDelta();

        this.manager.directionfinding(delta.x, delta.y,this.node.x,this.node.y);*/

    },





});