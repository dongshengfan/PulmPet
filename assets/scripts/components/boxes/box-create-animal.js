import { BoxBottom } from './box-samples/boxHorizontalBottom';

var BoxCreateAnimal = cc.Class({
    extends: BoxBottom,
    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     */
    _settings() {
       let bar = this.node.children[0].children[0];
        let canvas = this._getCanvas(this.node);
        let sizeBoxX = this._getSizeBox(canvas.width);
        this.node.x = sizeBoxX / 2 + this.indentLeft;
        bar.width = sizeBoxX;
        this._startPos = cc.v2(this.node.x, 0);
        this._endPos = cc.v2(this.node.x, bar.height);
        this._amountPix = Math.abs(this._endPos.y - this._startPos.y);
    },
});