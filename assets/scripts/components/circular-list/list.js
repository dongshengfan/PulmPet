import { CircularList } from './circular-list';
cc.Class({
    extends: cc.Component,

    properties: {
        manager: CircularList,
        nameEvent: 'voteAnimal',//Имя событикоторое вызывает эта кнопка
        maxBiasTouch: 5,//максимальное смещение тача для нажатия по элементу меню (px)
        _pointTouchForMenu: cc.v2,//точка старта тача по пункту меню
    },

    onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd.bind(this));
    },

    _onTouchStart(event){
        this._pointTouchForMenu = event.getLocation();
        event.stopPropagation();
    },

    _onTouchEnd(event){
        let point = event.getLocation();
        let X = Math.abs(this._pointTouchForMenu.x - point.x) < this.maxBiasTouch;
        let Y = Math.abs(this._pointTouchForMenu.y - point.y) < this.maxBiasTouch;
        if (X && Y) {
            this._publishEvent();
        }
        event.stopPropagation();
    },

    _publishEvent(){
        let myEvent = new cc.Event.EventCustom(this.nameEvent, true);
        myEvent.detail = {
            animal: this.manager.parent,
        };
        this.node.dispatchEvent(myEvent);
    },

    _onTouchMove(event) {
        var delta = event.touch.getDelta();
        this.manager.directionfinding(delta.x, delta.y, this.node.x, this.node.y);
        event.stopPropagation();
    },
});