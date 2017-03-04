import { Box, Movement } from './box';

var BoxLeft = cc.Class({
    extends: Box,

    /**
     * Действия на страт события
     * @param {any} event
     */
    onTouchStart(event) {

    },
    /**
     * Действия на движение во время события
     * @param {Event} event
     */
    onTouchMove(event) {
        var delta = event.touch.getDelta();
        if (!this._flagBlock) {
            this._setMovement(delta)._moveBox(delta)._checkBoxPosition();
        }
    },

    /**
     * Действие на завершение события
     * @param {any} event
     */
    onTouchEnd(event) {
        if (!this._flagBlock) {
            this._flag = true;
            this._endSwipeX();
        }
    },

    /**
     * Открывает бокс
     */
    openBox(){
        this._direction = Movement.toOpen;
        this._flag = true;
        this._endSwipeX();
    },

    /**
     * Закрывает бокс
     */
    closeBox(){
        this._direction = Movement.toClose;
        this._flag = true;
        this._endSwipeX();
    },

    /**
     * Проверяет не зашел ли бокс за грани доступного, еcли зашел то ровняет его
     * @returns this
     */
    _checkBoxPosition() {
        if (this.node.x > this._endPos.x + this._increments || this.node.x < this._startPos.x - this._increments) {
            this._flag = false;
            this._endSwipeX();
        }
        return this;
    },

    /**
     * Движение бокса
     * @param {cc.Vec2} delta
     * @returns this
     */
    _moveBox(delta) {
        let plus = this._endPos.x + this._increments + this._eps;
        let minus = this._startPos.x - this._increments - this._eps;
        let prirost = this.node.x + delta.x;

        if (plus > prirost && minus < prirost) {
            //борится с тримером            
            if (this.node.x > (this._endPos.x - this._increments) && delta.x > 0) {

            }
            else {
                this.node.x += delta.x;
            }

        } else {
            this._flag = false;
            this._endSwipeX();
        }

        return this;
    },

    /**
     * Определяет направление движения для случая горизонтального  бокса
     * @param {cc.Vec2} delta
     * @returns this
     */
    _setMovement(delta) {
        this._direction = delta.x > 0 ? Movement.toOpen : Movement.toClose;
        return this;
    },

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     */
    _settings() {
        let bar = this.content;
        let canvas = cc.director.getWinSizeInPixels();
        let sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentRight;
        bar.height = sizeBoxY;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x + bar.width, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },

    /**
     * Работа с прозрачностью бокса
     */
    _opacityNode() {
        let opasity = this.opacityBox + (((255 - this.opacityBox) * (this.node.x - this._startPos.x)) / this._amountPix);
        if (opasity > 255) {
            opasity = 255;
        } else if (opasity < this.opacityBox) {
            opasity = this.opacityBox;
        }
        this.node.opacity = opasity;
    },
});
export { BoxLeft };