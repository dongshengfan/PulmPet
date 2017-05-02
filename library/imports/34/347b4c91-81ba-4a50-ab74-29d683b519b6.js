"use strict";

/**
 * Created by FIRCorp on 31.03.2017.
 */
cc.Class({
    extends: cc.Component,

    /**
     *
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },


    /**
     *
     * @param event
     */
    onTouchStart: function onTouchStart(event) {},


    /**
     *
     * @param event
     */
    onTouchMove: function onTouchMove(event) {},


    /**
     *
     * @param event
     */
    onTouchEnd: function onTouchEnd(event) {}
});