'use strict';

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
     * Действия на нажатие по зверюшке после создания зверюшки
     * @param event
     */
    onTouchStart: function onTouchStart(event) {
        var myEvent = new cc.Event.EventCustom('startDragAndDropAnimal', true);
        myEvent.detail = {
            animal: this.node
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Действия надвижение зажатой зверюшки после создания звербшки
     * @param event
     */
    onTouchMove: function onTouchMove(event) {
        var delta = event.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
        var myEvent = new cc.Event.EventCustom('dragAndDropAnimal', true);
        myEvent.detail = {
            point: { x: this.node.x, y: this.node.y }
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Действие на завершение нажатия по зверюшке после создания зверюшки
     * @param event
     */
    onTouchEnd: function onTouchEnd(event) {
        var myEvent = new cc.Event.EventCustom('stopDragAndDropAnimal', true);
        myEvent.detail = {
            point: { x: this.node.x, y: this.node.y }
        };
        this.node.dispatchEvent(myEvent);

        event.stopPropagation();
    }
});