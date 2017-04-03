import { Box, TypeBox } from './box-samples/box';
/**
 * Бокс характеристик не предназначен для управление пользователем
 * @type {Function}
 */
var BoxCharacteristicsAnimal = cc.Class({
    extends: Box,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     * @private
     */
    _settings() {
        this._type = TypeBox.left;
        this.timeBring=0.1;
        let canvas = cc.director.getWinSizeInPixels();
        let sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentRight;
        this.node.height = sizeBoxY;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x + this.node.width, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },

    onLoad(){

    },

    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen(){
        let myEvent = new cc.Event.EventCustom('openBoxFromCharacteristicsAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Публикует событие закрыие бокса в контроллере
     */
    publishEventClose(){
        let myEvent = new cc.Event.EventCustom('closeBoxFromCharacteristicsAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update(dt) {
        this._opacityNode(this.node.x - this._startPos.x);
    },
});