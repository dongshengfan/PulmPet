import { Box, Movement } from './box';

var boxRight = cc.Class({
    extends: Box,

    /**
     * Действия на страт
     * 
     * @param {any} event
     */
    onTouchStart(event) {

    },

    /**
     * Действия на движение
     * 
     * @param {Event} event
     */
    onTouchMove(event) {
        var delta = event.touch.getDelta();
        this._setMovement(delta)._moveBox(delta)._checkBoxPosition();
    },

    /**
     * Действие на завершение 
     * 
     * @param {any} event
     */
    onTouchEnd(event) {
        this._endSwipeX();
        this._refocus();
    },

    /**
     * Проверяет не зашел ли бокс за грани доступного, еcли зашел то ровняет его
     * 
     * @returns this
     */
    _checkBoxPosition() {
        if (this.node.x < this._endPos.x - this._increments || this.node.x > this._startPos.x + this._increments)
            this._endSwipeX();
        return this;
    },

    /**
     * Движение бокса
     * 
     * @param {cc.Vec2} delta
     * @returns this
     */
    _moveBox(delta) {
        let plus = this._endPos.x - this._increments - this._eps;
        let minus = this._startPos.x + this._increments + this._eps;
        let prirost = this.node.x + delta.x;

        if (plus < prirost && minus > prirost) {
            //борится с тримером            
            if (this.node.x < (this._endPos.x + this._increments) && delta.x < 0) {

            }
            else {
                this.node.x += delta.x;
            }

        } else {
            this._endSwipeX();
        }
        return this;
    },

    /**
     * Определяет направление движения для случая горизонтального  бокса
     * 
     * @param {cc.Vec2} delta
     * @returns this
     */
    _setMovement(delta) {
        this._direction = delta.x > 0 ? Movement.toClose : Movement.toOpen;
        return this;
    },

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     */
    _settings() {
        let children = this.node.children;
        let bar = children[0].children[0];
        let canvas = this._getCanvas(this.node);
        let sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentLeft;
        bar.height = canvas.height;
        this._startPos = cc.v2(canvas.width, this.node.y);
        this._endPos = cc.v2(canvas.width - bar.width, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },

    /**
     * Работа с прозрачностью бокса
     */
    _opacityNode() {
        let opasity = this.opacityBox + (((255 - this.opacityBox) * (this._startPos.x - this.node.x)) / this._amountPix);
        if (opasity > 255) {
            opasity = 255;
        }
        this.node.opacity = opasity;
    },

});
export { boxRight };