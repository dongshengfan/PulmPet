import { Box, Movement } from './box';

var BoxBottom = cc.Class({
    extends: Box,

    properties: {},

    /**
     * Действия на страт
     * @param {any} event
     */
    onTouchStart(event) {

    },

    /**
     * Действия на движение
     * @param {Event} event
     */
    onTouchMove(event) {
        var delta = event.touch.getDelta();
        if (!this._flagBlock) {
            this._setMovement(delta)._moveBox(delta)._checkBoxPosition();
        }
    },

    /**
     * Действие на завершение
     * @param {any} event
     */
    onTouchEnd(event) {
        if (!this._flagBlock) {
            this._flag = true;
            this._endSwipeY();
        }
    },

    /**
     * Открывает бокс
     */
    openBox(){
        this._direction = Movement.toOpen;
        this._flag = true;
        this._endSwipeY();
    },

    /**
     * Закрывает бокс
     */
    closeBox(){
        this._direction = Movement.toClose;
        this._flag = true;
        this._endSwipeY();
    },

    /**
     * Проверяет не зашел ли бокс за грани доступного, если зашел то ровняет его
     * @returns this
     */
    _checkBoxPosition() {
        if (this.node.y > this._endPos.y + this._increments || this.node.y < this._startPos.y - this._increments) {
            this._flag = false;
            this._endSwipeY();
        }
        return this;
    },

    /**
     * Движение бокса
     * @param {cc.Vec2} delta
     * @returns this
     */
    _moveBox(delta) {
        let plus = this._endPos.y + this._increments + this._eps;
        let minus = this._startPos.y - this._increments - this._eps;
        let prirost = this.node.y + delta.y;
        if (plus > prirost && minus < prirost) {
            //борится с тримером            
            if (this.node.y > (this._endPos.y - this._increments) && delta.y > 0) {
            }
            else {
                this.node.y += delta.y;
            }
        } else {
            this._flag = false;
            this._endSwipeY();
        }
        return this;
    },

    /**
     * Определяет направление движения для случая горизонтального бокса
     * @param {cc.Vec2} delta
     * @returns this
     */
    _setMovement(delta) {
        this._direction = delta.y < 0 ? Movement.toClose : Movement.toOpen;
        return this;
    },

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
     * Работа с прозрачностью бокса
     */
    _opacityNode() {
        let opasity = this.opacityBox + (((255 - this.opacityBox) * (this.node.y - this._startPos.y)) / this._amountPix);
        if (opasity > 255) {
            opasity = 255;
        } else if (opasity < this.opacityBox) {
            opasity = this.opacityBox;
        }
        this.node.opacity = opasity;
    },
});

export { BoxBottom };