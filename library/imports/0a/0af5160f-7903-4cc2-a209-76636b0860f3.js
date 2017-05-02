'use strict';

var _box = require('./box-samples/box');

/**
 * Бокс списка животных
 * @type {Function}
 */
var BoxCreateAnimal = cc.Class({
    extends: _box.Box,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     * @private
     */
    _settings: function _settings() {
        this._type = _box.TypeBox.bottom;
        this.timeBring = 0.2;
        var bar = this.content;
        var canvas = cc.director.getWinSizeInPixels();
        var sizeBoxX = this._getSizeBox(canvas.width);
        this.node.x = sizeBoxX / 2 + this.indentLeft;
        bar.width = sizeBoxX;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x, this.node.y + bar.height - 10);
        this._amountPix = Math.abs(this._endPos.y - this._startPos.y);
    },


    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen: function publishEventOpen() {
        var myEvent = new cc.Event.EventCustom('openBoxFromAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Публикует событие закрытие бокса в контроллере
     */
    publishEventClose: function publishEventClose() {
        var myEvent = new cc.Event.EventCustom('closeBoxFromAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update: function update(dt) {
        this._opacityNode(this.node.y - this._startPos.y);
    }
});