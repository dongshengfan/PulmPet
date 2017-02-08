import { BoxLeft } from './box-samples/boxVertycalLeft';

var BoxCharacteristicsAnimal = cc.Class({
    extends: BoxLeft,
    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     */
    _settings() {
        let canvas = this._getCanvas(this.node);
        let sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentRight;
        this.node.height = sizeBoxY;
        this._startPos = cc.v2(0, this.node.y);
        this._endPos = cc.v2(this.node.width, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },
});