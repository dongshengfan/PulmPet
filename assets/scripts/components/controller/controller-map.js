/**
 * Created by FIRCorp on 04.03.2017.
 */
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

    onEvent(event){
        cc.log(event);
    },

    onTouchStart(event){
        cc.log('Начал работу с картой');
        event.stopPropagation();
    },

    onTouchMove(event){
        cc.log('Двигает карту');
        event.stopPropagation();
    },

    onTouchEnd(event){
        cc.log('завершил работу с картой');
        event.stopPropagation();
    },

    /**
     * Движение карты
     * @param delta
     */
    moveMap(delta,point){

        this.node.x+=delta.x;
        this.node.y+=delta.y;
    }
});