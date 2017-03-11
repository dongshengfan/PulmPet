import { BoxBottom } from './box-samples/box-horizontal-bottom';
/**
 * Бокс списка животных
 * @type {Function}
 */
var BoxCreateAnimal = cc.Class({
    extends: BoxBottom,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     */
    _settings() {
        let bar = this.content;
        let canvas = cc.director.getWinSizeInPixels();
        let sizeBoxX = this._getSizeBox(canvas.width);
        this.node.x = sizeBoxX / 2 + this.indentLeft;
        bar.width = sizeBoxX;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x, this.node.y + bar.height);
        this._amountPix = Math.abs(this._endPos.y - this._startPos.y);
    },

    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen(){
        this.node.dispatchEvent(new cc.Event('openBoxFromAnimal', true));
    },

    /**
     * Публикует событие закрытие бокса в контроллере
     */
    publishEventClose(){
        this.node.dispatchEvent(new cc.Event('closeBoxFromAnimal', true));
    },
});