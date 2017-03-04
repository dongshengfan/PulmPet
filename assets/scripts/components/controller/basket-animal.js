const StateBasket = {
    sleep: 0,
    job: 1,
    waiting: 2,
    anticipation: 3
};

/**
 * Осуществляет работу с корзиной,
 * Анимации, частицы и прочее
 */
cc.Class({
    extends: cc.Component,

    properties: {
        anticipation: 150,//расстояние для принятия состояний взволнованности
        opacity:10,
        time:1,
    },

    onLoad(){
        this._stateBasket = StateBasket.sleep;
    },

    /**
     * Корзина запустилась
     */
    on(){
        this.node.active = true;
        this._stateBasket = StateBasket.waiting;
        this.jobWithOpacity(240, 1);
    },

    /**
     * Выключение корзины
     */
    off(){
        this._stateBasket = StateBasket.sleep;
        this.jobWithOpacity(this.opacity,this.time);
    },

    /**
     * Реакция корзины на выброшеное в неё животное
     */
    _onReactionToAnimal(){
    },

    /**
     * Реакция корзины на приближающееся животное
     */
    _onReactionToMoveAnimal(){
    },

    /**
     * Работает с прозрачностью этой корзины
     * @param {any} opacity нужно достич этой прозрачности
     * @param {any} time за столько секунд
     */
    jobWithOpacity(opacity, time){
        let intevalIncrements = time / Math.abs(this.node.opacity - opacity);
        this.unschedule(this.callBackOpacity);
        this.callBackOpacity = () => {
            if (this.node.opacity === opacity) {
                if (this.node.opacity < 125) this.node.active = false;
                this.unschedule(this.callBackOpacity);
            }
            if (opacity > this.node.opacity) {
                this.node.opacity += 1;
            } else {
                this.node.opacity -= 2;
            }
        }
        this.schedule(this.callBackOpacity, intevalIncrements);
    },

    /**
     * Меняет свое состояние в зависимости от положения животного
     * @param point
     */
    positionAnimal(point) {
        let distanceX = Math.abs(point.x - this.node.x);
        let distanceY = Math.abs(point.y - this.node.y);
        let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        if (distance > this.anticipation) {
            this._stateBasket = StateBasket.waiting;
        } else {
            this._stateBasket = StateBasket.anticipation;
        }
    },

    /**
     * Проверяет будет ли жить животное или оно выбрашено в корзину
     * @param point
     * @returns {boolean}
     */
    isAnimalLife(point){
        this._leftPointBottom = {
            x: this.node.x - this.node.width,
            y: this.node.y - this.node.height
        };
        this._rightPointTop = {
            x: this.node.x + this.node.width,
            y: this.node.y + this.node.height
        };

        let X = point.x > this._leftPointBottom.x && point.x < this._rightPointTop.x;
        let Y = point.y > this._leftPointBottom.y & point.y < this._rightPointTop.y;
        if (X && Y) {
            this._stateBasket = StateBasket.job;
            return false;
        }
        this._stateBasket = StateBasket.sleep;
        return true;
    }
});

