/**
 * Created by FIRCorp on 31.03.2017.
 */
cc.Class({
    extends: cc.Component,

    /**
     *
     */
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

    /**
     *
     * @param event
     */
    onTouchStart(event){

    },

    /**
     *
     * @param event
     */
    onTouchMove(event){

    },

    /**
     *
     * @param event
     */
    onTouchEnd(event){

    },
});
