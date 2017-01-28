import { Box, Movement } from './box';

var TouchDragger2 = cc.Class({
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
        if (this.node.x > this._endPos.x + this.increments || this.node.x < this._startPos.x - this.increments)
            this._endSwipe();
        return this;
    },

    /**Движение бокса */
    _moveBox: function (delta) {
        let plus = this._endPos.x + this.increments + this.eps;
        let minus = this._startPos.x - this.increments - this.eps;
        let prirost = this.node.x + delta.x;

        if (plus > prirost && minus < prirost) {
            //борится с тримером            
            if (this.node.x > (this._endPos.x - this.increments) && delta.x > 0) {

            }
            else {
                this.node.x += delta.x;
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
            if (this.node.x > coord.x - this.increments - this.eps && this.node.x < coord.x + this.increments + this.eps) {
                this.node.x = coord.x;
                this.unschedule(callBack);
            }
            if (coord.x > this.node.x) {
                this.node.x += this.increments;
            } else {
                this.node.x -= this.increments;
            }
        }
        this.schedule(callBack, this.intevalIncrements);
    },

    /**Определяет направление движения для случая горизонтального  бокса*/
    _setMovement: function (delta) {
        this.direction = delta.x > 0 ? Movement.toOpen : Movement.toClose;
        return this;
    },

    /**Устанавливает начальные позиции и производит вычисление длинны */
    _setPosition: function () {
        let children = this.node.children;
        let bar = children[0].children[0];
        let canvas = this._getCanvas(this.node);
        bar.height = canvas.height;
        this._startPos = cc.v2(0, this.node.y);
        this._endPos = cc.v2(0 + bar.width,this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },

    /**Работа с прозрачностью бокса */
    _opacityNode: function () {
        let opasity = this.opacityBox + (((255 - this.opacityBox) * (this.node.x-this._startPos.x)) / this._amountPix);
        if (opasity > 255) {
            opasity = 255;
        }
        this.node.opacity = opasity;
    },


});