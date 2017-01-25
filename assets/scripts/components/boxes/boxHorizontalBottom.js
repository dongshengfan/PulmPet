import { Box, Movement } from './box';

var TouchDragger = cc.Class({
    extends: Box,

    properties: {
    },

    /**
     * Действия на движение
     * 
     * @param {Event} event
     */
    onTouchMove: function (event) {
        var delta = event.touch.getDelta();
        this._setMovement(delta)._moveBox(delta)._checkBoxPosition();

    },

    /**
     * Действия на страт
     * 
     * @param {any} event
     */
    onTouchStart: function (event) {

    },

    /**
     * Действие на завершение 
     * 
     * @param {any} event
     */
    onTouchEnd: function (event) {
        this._endSwipe();
    },




    /**Проверяет не зашеллибокс за грани доступного, ели зашел то ровняет его */
    _checkBoxPosition: function () {
        if (this.node.y > this._endPos.y + this.increments || this.node.y < this._startPos.y - this.increments)
            this._endSwipe();
        return this;
    },

    /**Движение бокса */
    _moveBox: function (delta) {
        let plus = this._endPos.y + this.increments + this.eps;
        let minus = this._startPos.y - this.increments - this.eps;
        let prirost = this.node.y + delta.y;

        if (plus > prirost && minus < prirost) {
            //борится с тримером            
            if (this.node.y > (this._endPos.y - this.increments) && delta.y > 0) {

            }
            else {
                this.node.y += delta.y;
            }

        } else {
            this._endSwipe();
        }
        return this;
    },

    /**Выполняет проверку и завершает движение бокса */
    _endSwipe: function () {
        this.direction === Movement.toClose ? this._bring(this._startPos) : this._bring(this._endPos);
    },

    /**доводит окошко до нужного состояния */

    _bring: function (coord) {
        let callBack = () => {
            if (this.node.y > coord.y - this.increments - this.eps && this.node.y < coord.y + this.increments + this.eps) {
                this.node.y = coord.y;
                this.unschedule(callBack);
            }
            if (coord.y > this.node.y) {
                this.node.y += this.increments;
            } else {
                this.node.y -= this.increments;
            }
        }
        this.schedule(callBack, this.intevalIncrements);
    },

    /**Определяет направление движения для случая горизонтального  бокса*/
    _setMovement: function (delta) {
        this.direction = delta.y < 0 ? Movement.toClose : Movement.toOpen;
        return this;
    },

    /**Устанавливает начальные позиции и производит вычисление длинны */
    _setPosition: function () {
        let bar = this.node.children[0].children[0];
        let canvas = this._getCanvas(this.node);
        bar.width = canvas.width;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x, this.node.y + bar.height);
        this._amountPix = Math.abs(this._endPos.y - this._startPos.y);
    },

    /**Работа с прозрачностью бокса */
    _opacityNode: function () {
        let opasity = this.opacityBox + (((255 - this.opacityBox) * (this.node.y - this._startPos.y)) / this._amountPix);
        if (opasity > 255) {
            opasity = 255;
        }
        this.node.opacity = opasity;
    },


});