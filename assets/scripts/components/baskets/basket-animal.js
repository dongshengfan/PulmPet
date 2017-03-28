/**
 * Enum состояний корзины.
 * @typedef {Object} StateBasket
 * @property {number} sleep корзина просто открыта.
 * @property {number} active чувствует что животное где-то рядом.
 * @property {number} work работает с попавшимся животным.
 */

/**
 * Типы состояний корзины.
 * @type {StateBasket}
 */
const StateBasket = {
    sleep: 0,
    active: 1,
    work: 2,
};

/**
 * Осуществляет работу с корзиной,
 * Анимации, частицы и прочее.
 * @type {cc.Class}
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _leftPointBottom: null,//левая нижняя точка области поглащения животных
        _rightPointTop: null,//правая верхняяточка области поглащения животных
        _centrePointBasket: null,//центральная точка области поглащения
        _stateBasket: null,//состояние корзины

        anticipation: 150,//расстояние для принятия состояний взволнованности
        opacityOn: 255,//прозрачность к которой стремится при включении
        opacityOff: 10, //прозрачность к которой стемится после выключения
        time: 1,//время за которое происходит открытие или закрытие
    },

    onLoad(){

    },

    /**
     * Инициализация непосредственно сразу после загрузки сцены.
     */
    start(){
        this._leftPointBottom = {
            x: this.node.x - this.node.width,
            y: this.node.y - this.node.height
        };
        this._rightPointTop = {
            x: this.node.x + this.node.width,
            y: this.node.y + this.node.height
        };
        this._centrePointBasket = {
            x: (this._leftPointBottom.x + this._rightPointTop.x) / 2,
            y: (this._rightPointTop.y + this._leftPointBottom.y) / 2
        }
        this._previousStatus = this._stateBasket = StateBasket.active;
    },

    /**
     * Корзина запустилась.
     */
    on(){
        this.node.active = true;
        this.jobWithOpacity(this.opacityOn, this.time);
    },

    /**
     * Выключение корзины.
     */
    off(){
        this.jobWithOpacity(this.opacityOff, this.time);
    },


    /**
     * Реакция корзины на приближающееся животное.
     */
    onStatusActiveBasket(){
        let myEvent = new cc.Event.EventCustom('basketActive', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Состояние сна включилось.
     */
    onStatusSleepBasket(){
        let myEvent = new cc.Event.EventCustom('basketSleep', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Состояние ловли включилось.
     */
    onStatusWorkBasket(){
        let myEvent = new cc.Event.EventCustom('basketWork', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Событие- животное поймано.
     */
    onGoodWorkBasket(){
        cc.log('Еа, животное поймано (basket-animal)');
        this._stateBasket = StateBasket.work;
        this._updateStatusBasket();
    },

    /**
     * Событие- животное не поймано.
     */
    onBadWorkBasket(){
        cc.log('Ну вот опять ничего непоймал (basket-animal)');
        this._stateBasket = StateBasket.sleep;
        this._updateStatusBasket();
    },

    /**
     * Работает с прозрачностью этой корзины. Постепенно приближается к прозрачности
     * корзины равной заданному значению за заданое время.
     * @param {number} opacity нужно достич этой прозрачности
     * @param {number} time за столько секунд
     */
    jobWithOpacity(opacity, time){
        let intevalIncrements = time / Math.abs(this.node.opacity - opacity);
        this.unschedule(this.callBackOpacity);
        this.callBackOpacity = () => {
            if (this.node.opacity === opacity) {
                if (this.node.opacity < 125) this.node.active = false;
                this.unschedule(this.callBackOpacity);
            }
            (opacity > this.node.opacity) ? this.node.opacity += 1 : this.node.opacity -= 2;
        }
        this.schedule(this.callBackOpacity, intevalIncrements);
    },

    /**
     * Проверяет будет ли жить животное или оно выброшено в корзину.
     * @param {cc.Vec2} point точка нахождения животного
     * @returns {boolean} true - если животное будет жить
     */
    isAnimalLife(point){
        let X = point.x > this._leftPointBottom.x && point.x < this._rightPointTop.x;
        let Y = point.y > this._leftPointBottom.y & point.y < this._rightPointTop.y;
        return !(X && Y);
    },

    /**
     * Сообщает корзине позицию животного для принятия решения по выбору действия. Корзина меняет свое состояние
     * в зависимости от расстояния.
     * @param {cc.Vec2} point точка текущего местонахождения животного
     */
    setPositionAnimal(point){
        let sqrtPoint = Math.sqrt((point.x - this._centrePointBasket.x) ** 2 + (point.y - this._centrePointBasket.y) ** 2);
        let isV = sqrtPoint < this.anticipation;
        (isV) ? this._stateBasket = StateBasket.active : this._stateBasket = StateBasket.sleep;
        this._updateStatusBasket();
    },

    /**
     * Обновляет статус корзины и вызывает соответствующее действие.
     * @private
     */
    _updateStatusBasket(){
        if (this._previousStatus != this._stateBasket) {
            this._previousStatus = this._stateBasket;
            switch (this._stateBasket) {
                case StateBasket.active: {
                    this.onStatusActiveBasket();
                    break;
                }
                case StateBasket.sleep: {
                    this.onStatusSleepBasket();
                    break;
                }
                case StateBasket.work: {
                    this.onStatusWorkBasket();
                    break;
                }
            }
        }
    },

});

