import { CircularList } from './circular-list';

/**
 * Лист меню животного.
 * @class List
 */
cc.Class({
    extends: cc.Component,

    properties: {
        manager: CircularList,//ссылка на ядро вращения
        nameEvent: 'voiceAnimal',//имя события которое вызывает эта кнопка
        maxBiasTouch: 15,//максимальное смещение тача для нажатия по элементу меню (px)
        _pointTouchForMenu: cc.v2,//точка старта тача по пункту меню
    },

    /**
     * Инициализация листа меню животного.
     * @method onLoad
     */
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd.bind(this));
    },

    /**
     * Обработчик старта нажатия на лист.
     * @method _onTouchStart
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchStart(event){
        this._pointTouchForMenu = event.getLocation();
        event.stopPropagation();
    },

    /**
     * Обработчик отпускания тача от листа.
     * @method _onTouchEnd
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchEnd(event){
        let point = event.getLocation();
        let X = Math.abs(this._pointTouchForMenu.x - point.x) < this.maxBiasTouch;
        let Y = Math.abs(this._pointTouchForMenu.y - point.y) < this.maxBiasTouch;
        if (X && Y) {
            this._publishEvent();
        }
        event.stopPropagation();
    },

    /**
     * Публикует событие свзанное с этим листом.
     * @method _publishEvent
     * @private
     */
    _publishEvent(){
        let myEvent = new cc.Event.EventCustom(this.nameEvent, true);
        myEvent.detail = {
            animal: this.manager.parent,
        };
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Обработчик движения тача.
     * @method _onTouchMove
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchMove(event) {
        let point = event.touch.getPreviousLocation();
        var delta = event.touch.getDelta();
        this.manager.directionRotation(delta.x, delta.y, point.x, point.y);
        event.stopPropagation();
    },
});