import { BoxLeft } from './box-samples/boxVertycalLeft';

var BoxCharacteristicsAnimal = cc.Class({
    extends: BoxLeft,
    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     */
    _settings() {
        let bar = this.node.children[0].children[0];
        let canvas = this._getCanvas(this.node);
        let sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentRight;
        bar.height = sizeBoxY;
        this._startPos = cc.v2(0, this.node.y);
        this._endPos = cc.v2(bar.width, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },
});