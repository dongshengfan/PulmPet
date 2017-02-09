import { CircularList } from './circular-list';
cc.Class({
    extends: cc.Component,

    properties: {
        manager: CircularList,
    },

    onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
    },


    /**
     * Вращение панели
     * 
     * @param {any} event
     */
    onTouchMove(event) {
        var delta = event.touch.getDelta();
    
        this.manager.directionfinding(delta.x, delta.y,this.node.x,this.node.y);
        
    },






});