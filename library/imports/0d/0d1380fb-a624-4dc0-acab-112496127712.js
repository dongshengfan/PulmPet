'use strict';

var _circularList = require('./circular-list');

/**
 * Лист меню животного.
 * @class List
 */
cc.Class({
    extends: cc.Component,

    properties: {
        manager: _circularList.CircularList, //ссылка на ядро вращения
        nameEvent: 'voiceAnimal', //имя события которое вызывает эта кнопка
        maxBiasTouch: 15, //максимальное смещение тача для нажатия по элементу меню (px)
        _pointTouchForMenu: cc.v2 },

    /**
     * Инициализация листа меню животного.
     * @method onLoad
     */
    onLoad: function onLoad() {
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
    _onTouchStart: function _onTouchStart(event) {
        this._pointTouchForMenu = event.getLocation();
        event.stopPropagation();
    },


    /**
     * Обработчик отпускания тача от листа.
     * @method _onTouchEnd
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchEnd: function _onTouchEnd(event) {
        var point = event.getLocation();
        var X = Math.abs(this._pointTouchForMenu.x - point.x) < this.maxBiasTouch;
        var Y = Math.abs(this._pointTouchForMenu.y - point.y) < this.maxBiasTouch;
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
    _publishEvent: function _publishEvent() {
        var myEvent = new cc.Event.EventCustom(this.nameEvent, true);
        myEvent.detail = {
            animal: this.manager.parent
        };
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обработчик движения тача.
     * @method _onTouchMove
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchMove: function _onTouchMove(event) {
        var point = event.touch.getPreviousLocation();
        var delta = event.touch.getDelta();
        this.manager.directionRotation(delta.x, delta.y, point.x, point.y);
        event.stopPropagation();
    }
});