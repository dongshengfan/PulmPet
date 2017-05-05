require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"basket-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e6894t629BPYaeEppyfbgj4', 'basket-animal');
// scripts\components\baskets\basket-animal.js

'use strict';

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
var StateBasket = {
    sleep: 0,
    active: 1,
    work: 2
};

/**
 * Осуществляет работу с корзиной,
 * Анимации, частицы и прочее.
 * @class basket-animal
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _leftPointBottom: null, //левая нижняя точка области поглащения животных
        _rightPointTop: null, //правая верхняяточка области поглащения животных
        _centrePointBasket: null, //центральная точка области поглащения
        _stateBasket: null, //состояние корзины

        anticipation: 150, //расстояние для принятия состояний взволнованности
        opacityOn: 255, //прозрачность к которой стремится при включении
        opacityOff: 10, //прозрачность к которой стемится после выключения
        time: 1 },

    /**
     * Инициализация непосредственно сразу после загрузки компонента.
     * @method start
     */
    start: function start() {
        this._previousStatus = this._stateBasket = StateBasket.active;
    },


    /**
     * Корзина запустилась. Запускает корзину(включает)
     * @method on
     */
    on: function on() {
        //this.node.active = true;
        this.jobWithOpacity(this.opacityOn, this.time);
    },


    /**
     * Выключение корзины.Выключает корзину.
     * @method off
     */
    off: function off() {
        this.jobWithOpacity(this.opacityOff, this.time);
    },


    /**
     * Реакция корзины на приближающееся животное.
     * @method onStatusActiveBasket
     */
    onStatusActiveBasket: function onStatusActiveBasket() {
        var myEvent = new cc.Event.EventCustom('basketActive', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Состояние сна включилось.
     * @method onStatusSleepBasket
     */
    onStatusSleepBasket: function onStatusSleepBasket() {
        var myEvent = new cc.Event.EventCustom('basketSleep', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Состояние ловли включилось.
     * @method onStatusWorkBasket
     */
    onStatusWorkBasket: function onStatusWorkBasket() {
        var myEvent = new cc.Event.EventCustom('basketWork', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Событие- животное поймано.
     * @method onGoodWorkBasket
     */
    onGoodWorkBasket: function onGoodWorkBasket() {
        cc.log('Еа, животное поймано (basket-animal)');
        this._stateBasket = StateBasket.work;
        this._updateStatusBasket();
    },


    /**
     * Событие- животное не поймано.
     * @method onBadWorkBasket
     */
    onBadWorkBasket: function onBadWorkBasket() {
        cc.log('Ну вот опять ничего непоймал (basket-animal)');
        this._stateBasket = StateBasket.sleep;
        this._updateStatusBasket();
    },


    /**
     * Работает с прозрачностью этой корзины. Постепенно приближается к прозрачности
     * корзины равной заданному значению за заданое время.
     * @method jobWithOpacity
     * @param {number} opacity нужно достич этой прозрачности
     * @param {number} time за столько секунд
     */
    jobWithOpacity: function jobWithOpacity(opacity, time) {
        var _this = this;

        var intevalIncrements = time / Math.abs(this.node.opacity - opacity);
        this.unschedule(this.callBackOpacity);
        this.callBackOpacity = function () {
            if (_this.node.opacity === opacity) {
                //if (this.node.opacity < 125) this.node.active = false;
                _this.unschedule(_this.callBackOpacity);
            }
            opacity > _this.node.opacity ? _this.node.opacity += 1 : _this.node.opacity -= 2;
        };
        this.schedule(this.callBackOpacity, intevalIncrements);
    },


    /**
     * Проверяет будет ли жить животное или оно выброшено в корзину.
     * @method isAnimalLife
     * @param {cc.Vec2} point точка нахождения животного
     * @returns {boolean} true - если животное будет жить
     */
    isAnimalLife: function isAnimalLife(point) {
        this._leftPointBottom = {
            x: this.node.x - this.node.width,
            y: this.node.y - this.node.height
        };
        this._rightPointTop = {
            x: this.node.x + this.node.width,
            y: this.node.y + this.node.height
        };
        var X = point.x > this._leftPointBottom.x && point.x < this._rightPointTop.x;
        var Y = point.y > this._leftPointBottom.y & point.y < this._rightPointTop.y;
        return !(X && Y);
    },


    /**
     * Сообщает корзине позицию животного для принятия решения по выбору действия. Корзина меняет свое состояние
     * в зависимости от расстояния.
     * @method setPositionAnimal
     * @param {cc.Vec2} point точка текущего местонахождения животного
     */
    setPositionAnimal: function setPositionAnimal(point) {
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
        };

        var x = (point.x - this._centrePointBasket.x) * (point.x - this._centrePointBasket.x);
        var y = (point.y - this._centrePointBasket.y) * (point.y - this._centrePointBasket.y);
        var sqrtPoint = Math.sqrt(x + y);

        var isV = sqrtPoint < this.anticipation;
        isV ? this._stateBasket = StateBasket.active : this._stateBasket = StateBasket.sleep;
        this._updateStatusBasket();
    },


    /**
     * Обновляет статус корзины и вызывает соответствующее действие.
     * @method _updateStatusBasket
     * @private
     */
    _updateStatusBasket: function _updateStatusBasket() {
        if (this._previousStatus != this._stateBasket) {
            this._previousStatus = this._stateBasket;
            switch (this._stateBasket) {
                case StateBasket.active:
                    {
                        this.onStatusActiveBasket();
                        break;
                    }
                case StateBasket.sleep:
                    {
                        this.onStatusSleepBasket();
                        break;
                    }
                case StateBasket.work:
                    {
                        this.onStatusWorkBasket();
                        break;
                    }
            }
        }
    }
});

cc._RFpop();
},{}],"box-characteristics-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, '15897F2u1dN+o4g/2HlJ44R', 'box-characteristics-animal');
// scripts\components\boxes\box-characteristics-animal.js

'use strict';

var _box = require('./box-samples/box');

/**
 * Бокс характеристик не предназначен для управление пользователем
 * @type {Function}
 */
var BoxCharacteristicsAnimal = cc.Class({
    extends: _box.Box,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     * @private
     */
    _settings: function _settings() {
        this._type = _box.TypeBox.left;
        this.timeBring = 0.1;
        var canvas = cc.director.getWinSizeInPixels();
        var sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentRight;
        this.node.height = sizeBoxY;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x + this.node.width, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },
    onLoad: function onLoad() {},


    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen: function publishEventOpen() {
        var myEvent = new cc.Event.EventCustom('openBoxFromCharacteristicsAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Публикует событие закрыие бокса в контроллере
     */
    publishEventClose: function publishEventClose() {
        var myEvent = new cc.Event.EventCustom('closeBoxFromCharacteristicsAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update: function update(dt) {
        this._opacityNode(this.node.x - this._startPos.x);
    }
});

cc._RFpop();
},{"./box-samples/box":"box"}],"box-create-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0af51YPeQNMwqIJdmNrCGDz', 'box-create-animal');
// scripts\components\boxes\box-create-animal.js

'use strict';

var _box = require('./box-samples/box');

/**
 * Бокс списка животных
 * @type {Function}
 */
var BoxCreateAnimal = cc.Class({
    extends: _box.Box,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     * @private
     */
    _settings: function _settings() {
        this._type = _box.TypeBox.bottom;
        this.timeBring = 0.2;
        var bar = this.content;
        var canvas = cc.director.getWinSizeInPixels();
        var sizeBoxX = this._getSizeBox(canvas.width);
        this.node.x = sizeBoxX / 2 + this.indentLeft;
        bar.width = sizeBoxX;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x, this.node.y + bar.height - 10);
        this._amountPix = Math.abs(this._endPos.y - this._startPos.y);
    },


    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen: function publishEventOpen() {
        var myEvent = new cc.Event.EventCustom('openBoxFromAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Публикует событие закрытие бокса в контроллере
     */
    publishEventClose: function publishEventClose() {
        var myEvent = new cc.Event.EventCustom('closeBoxFromAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update: function update(dt) {
        this._opacityNode(this.node.y - this._startPos.y);
    }
});

cc._RFpop();
},{"./box-samples/box":"box"}],"box-menu-play":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c02746/iXtP2akY3x0U58pq', 'box-menu-play');
// scripts\components\boxes\box-menu-play.js

'use strict';

var _box = require('./box-samples/box');

/**
 * Бокс характеристик не предназначен для управление пользователем
 * @type {Function}
 */
var BoxMenuPlay = cc.Class({
    extends: _box.Box,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     * @private
     */
    _settings: function _settings() {
        this._type = _box.TypeBox.left;
        this.timeBring = 0.6;
        var canvas = cc.director.getWinSizeInPixels();
        var sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentRight;
        this.node.height = sizeBoxY;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x + this.node.width - 75, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },
    onLoad: function onLoad() {},


    /**
     * Открывает/закрывает бокс
     * @param event
     */
    onClick: function onClick(event) {
        this._endSwipe();
    },


    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen: function publishEventOpen() {
        var myEvent = new cc.Event.EventCustom('openBoxMenuPlay', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Публикует событие закрыие бокса в контроллере
     */
    publishEventClose: function publishEventClose() {
        var myEvent = new cc.Event.EventCustom('closeBoxMenuPlay', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update: function update(dt) {
        this._opacityNode(this.node.x - this._startPos.x);
    }
}); /**
     * Created by FIRCorp on 29.03.2017.
     */

cc._RFpop();
},{"./box-samples/box":"box"}],"box":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e5e5bFR+1NAfb/Dp9tTtI5H', 'box');
// scripts\components\boxes\box-samples\box.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Enum состояний бокса
 * @typedef {Object} Movement
 * @property {number} toClose бокс закрыт.
 * @property {number} toOpen бокс открыт.
 */

/**
 * Состояние бокса (открыт/закрыт)
 * @type {Movement}
 */
var Movement = {
    toClose: 0,
    toOpen: 1
};

/**
 * Enum состояний работы бокса
 * @typedef {Object} TypeBox
 * @property {number} bottom работа как нижний бокс.
 * @property {number} top работа как верхний бокс.
 * @property {number} right работа как правый бокс.
 * @property {number} left работа как левы бокс.
 */

/**
 * Тип бокса
 * @type {{bottom: number, top: number, right: number, left: number}}
 */
var TypeBox = {
    bottom: 0,
    top: 1,
    right: 2,
    left: 3
};
/**
 * Ядро боксов
 * @type {cc.Class}
 */
var Box = cc.Class({
    extends: cc.Component,

    properties: {
        _startPos: null, //Стартовая позиция бокса
        _endPos: null, //конечная позиция бокса
        _type: null, //состояние типа бокса в котором он работает
        _direction: 1, //0- закрыться 1- открыться
        _flagBlock: false, //флаг блокировки
        _flagZaprosBlock: false, //флаг о необходиомсти блокировки
        _amountPix: null, //путь для бокса
        _actionMoveBox: null, //actions движения бокса

        timeBring: 0.01, //Время довода в секундах
        content: cc.Node, //контент над которым необходимо произвести работу
        opacityBox: 30, //Прозрачность бокса 
        indentLeft: 50, //Отступ слева (в px)
        indentRight: 50 },

    /**
     * Осуществляет первоначальную настройку
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._getPermissionMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },
    start: function start() {
        this._init();
    },


    /**
     * Инициализация переменных
     * @private
     */
    _init: function _init() {
        //Дальнейшее действие бокса
        this._direction = Movement.toOpen;
        this._settings();
    },


    /**
     * Действия на страт тача
     * @param {cc.Event} event
     */
    onTouchStart: function onTouchStart(event) {},


    /**
     * Действия на движение тача
     * @param {cc.Event} event событие
     */
    onTouchMove: function onTouchMove(event) {
        var delta = event.touch.getDelta();
        if (!this._flagBlock) {
            this._setMovement(delta)._moveBox(delta);
        }
    },


    /**
     * Действие на завершение тача
     * @param {cc.Event} event событие
     */
    onTouchEnd: function onTouchEnd(event) {
        if (!this._flagBlock) {
            this._endSwipe();
        }
    },


    /**
     * Включает блокировку бокса
     */
    onBlock: function onBlock() {
        this._flagZaprosBlock = true;
        this._flagBlock = true;
    },


    /**
     * Выключает блокировку бокса
     */
    offBlock: function offBlock() {
        this._flagZaprosBlock = false;
        this._flagBlock = false;
    },


    /**
     * Открывает бокс
     */
    openBox: function openBox() {
        this._direction = Movement.toOpen;
        this._endSwipe();
    },


    /**
     * Закрывает бокс
     */
    closeBox: function closeBox() {
        this._direction = Movement.toClose;
        this._endSwipe();
    },


    /**
     * Определяет ожидаемое состояние по направлению движения бокса
     * @param delta приращение
     * @returns {Box} этот класс
     * @private
     */
    _setMovement: function _setMovement(delta) {
        if (this._type === TypeBox.top) {
            this._direction = delta.y > 0 ? Movement.toClose : Movement.toOpen;
        } else if (this._type === TypeBox.bottom) {
            this._direction = delta.y < 0 ? Movement.toClose : Movement.toOpen;
        } else if (this._type === TypeBox.left) {
            this._direction = delta.x < 0 ? Movement.toClose : Movement.toOpen;
        } else {
            this._direction = delta.x > 0 ? Movement.toClose : Movement.toOpen;
        }
        return this;
    },


    /**
     * Проверка на выход бокса за пределы интервала в резудьтате выполнения данного приращения. true-когда он не выходит
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @return {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isCheckOutOfRange: function _isCheckOutOfRange(delta, start, end, current) {
        return start < end ? this._isOutOfRangeLeftBottom(delta, start, end, current) : this._isOutOfRangeRightTop(delta, start, end, current);
    },


    /**
     * Проверка на выход левого и нижнего бокса за пределы интервала в резудьтате выполнения данного приращения
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @returns {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isOutOfRangeLeftBottom: function _isOutOfRangeLeftBottom(delta, start, end, current) {
        return delta + current > start && delta + current < end;
    },


    /**
     * Проверка на выход верхнего и правого бокса за пределы интервала в резудьтате выполнения данного приращения
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @returns {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isOutOfRangeRightTop: function _isOutOfRangeRightTop(delta, start, end, current) {
        return delta + current < start && delta + current > end;
    },


    /**
     * Движение бокса
     * @param {cc.Vec2} delta приращение
     * @returns {Box}
     * @private
     */
    _moveBox: function _moveBox(delta) {
        if (this._type === TypeBox.top || this._type === TypeBox.bottom) {
            this._isCheckOutOfRange(delta.y, this._startPos.y, this._endPos.y, this.node.y) ? this.node.y += delta.y : this._endSwipe();
        } else {
            this._isCheckOutOfRange(delta.x, this._startPos.x, this._endPos.x, this.node.x) ? this.node.x += delta.x : this._endSwipe();
        }
        return this;
    },


    /**
     * Выполняет авто доводку
     * @private
     */
    _endSwipe: function _endSwipe() {
        this._flagBlock = true;
        this._direction === Movement.toClose ? this._bring(this._startPos) : this._bring(this._endPos);
        this._refocus();
    },


    /**
     * Выполняет авто довод  бокса до финальной точки назначения
     * @param pos точка назначения
     * @private
     */
    _bring: function _bring(pos) {
        this._actionMoveBox = cc.moveTo(this.timeBring, pos);
        this.node.runAction(cc.sequence(this._actionMoveBox, cc.callFunc(this._finishBring, this)));
    },


    /**
     * Функция сигнализирующая о завершении доводки бокса
     * @private
     */
    _finishBring: function _finishBring() {
        if (!this._flagZaprosBlock) this._flagBlock = false;
    },


    /**
     * Проверяет делает ли он это событие а не кто-то другой по ветке нодов до него
     * @param event событие
     * @private
     */
    _getPermissionMove: function _getPermissionMove(event) {
        if (event.target._name === this.node.name) {
            this.onTouchMove(event);
        }
    },


    /**
     * Возвращает размер бокса относительно пространства на стороне и условий отступов
     * @param {number} space  размер боксадо приращения
     * @returns {number} размер бокса
     * @private
     */
    _getSizeBox: function _getSizeBox(space) {
        return space - this.indentLeft - this.indentRight;
    },


    /**
     * Меняет действие которое необходимо сделать дальше боксу(закрыться или открыться).Публикует событие
     * @private
     */
    _refocus: function _refocus() {
        if (this._direction === Movement.toClose) {
            this._direction = Movement.toOpen;
            this.publishEventClose();
        } else {
            this._direction = Movement.toClose;
            this.publishEventOpen();
        }
    },


    /**
     * Работа с прозрачностью бокса. Изменяет прозрачность бокса на основе положения его относительно начальных и конечных координат
     * @private
     */
    _opacityNode: function _opacityNode(currentPosBox) {
        var opasity = this.opacityBox + (255 - this.opacityBox) * currentPosBox / this._amountPix;
        if (opasity > 255) {
            opasity = 255;
        } else if (opasity < this.opacityBox) {
            opasity = this.opacityBox;
        }
        this.node.opacity = opasity;
    }
});

exports.Box = Box;
exports.Movement = Movement;
exports.TypeBox = TypeBox;

cc._RFpop();
},{}],"build-ts":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7d032b6Q3JBIIr0FKeItlat', 'build-ts');
// scripts\build\build-ts.js

"use strict";

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var APICore = function () {
    function APICore() {}
    APICore.instance = function () {
        if (!this.inst) {
            this.inst = new APICore();
        }
        return this.inst;
    };
    APICore.prototype.createAnimal = function (putToModel, id) {
        console.log('API');
        console.log(putToModel);
        var factory = Animals.AnimalBuilder.instance();
        var animal;
        animal = factory.create(lion);
        console.log(lion);
        animal.id = id;
        return animal;
    };
    return APICore;
}();
var Animals;
(function (Animals) {
    var AnimalBuilder = function () {
        function AnimalBuilder() {}
        AnimalBuilder.instance = function () {
            if (!this.inst) {
                this.inst = new AnimalBuilder();
            }
            return this.inst;
        };
        AnimalBuilder.prototype.createSystems = function (systems) {
            var _this = this;
            var factory = Animals.Systems.SystemFactory.instance();
            var mas = [];
            systems.forEach(function (item) {
                mas = [];
                item.scalesType.forEach(function (sc) {
                    mas[sc.type] = _this.masScales[sc.type];
                });
                _this.masSystems[item.type] = factory.create(item.type, mas);
            });
            return this;
        };
        AnimalBuilder.prototype.createScales = function (scales) {
            var _this = this;
            var factory = Animals.Scales.ScaleFactory.instance();
            scales.forEach(function (item) {
                var typeScale = item.typeScale,
                    type = item.type,
                    params = item.params;
                params.type = type;
                _this.masScales[type] = factory.create(typeScale, params);
            });
            return this;
        };
        AnimalBuilder.prototype.createCommunicator = function (communocation) {
            var communicatorBuild = new Animals.Communications.CommunicatorBuilder(this.masScales);
            communocation.forEach(function (item) {
                communicatorBuild.add(item);
            });
            return communicatorBuild.build();
        };
        AnimalBuilder.prototype.createStates = function (states) {
            var _this = this;
            var factory = Animals.StateMachine.StateFactory.instance();
            var paramState = [];
            var state = states.state,
                links = states.links;
            state.forEach(function (item) {
                paramState[item.type] = factory.create(item.type, item.name, _this._animal, item.isEnd);
            });
            links.forEach(function (item) {
                var massStates = [];
                item.link.forEach(function (state) {
                    massStates.push(new Animals.StateMachine.Route(paramState[state.type], function (model, probability) {
                        if (state.probability > probability) {
                            return true;
                        }
                        return false;
                    }));
                });
                paramState[item.type].setRouteEngine(new Animals.StateMachine.ProbabilityRouteEngine(massStates));
            });
            return new Animals.StateMachine.StateMachine(paramState[Animals.StateMachine.TypesState.startLife]);
        };
        AnimalBuilder.prototype.create = function (model) {
            var name = model.name,
                systems = model.systems,
                scales = model.scales,
                communication = model.communication,
                states = model.states;
            this.masScales = [];
            this.masSystems = [];
            var communicator = this.createScales(scales).createSystems(systems).createCommunicator(communication);
            this._animal = new Animals.Animal(this.masSystems);
            this._animal.name = name;
            this._animal.stateMachine = this.createStates(states);
            this._animal.communicator = communicator;
            return this._animal;
        };
        return AnimalBuilder;
    }();
    Animals.AnimalBuilder = AnimalBuilder;
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Animal = function () {
        function Animal(params) {
            this.muscular = params[Animals.Systems.SystemTypes.muscular];
            this.circulatory = params[Animals.Systems.SystemTypes.circulatory];
            this.navigation = params[Animals.Systems.SystemTypes.navigation];
            this.muscular._linkToAnimal = this;
            this.circulatory._linkToAnimal = this;
            this.navigation._linkToAnimal = this;
        }
        Object.defineProperty(Animal.prototype, "muscular", {
            get: function get() {
                return this._muscular;
            },
            set: function set(param) {
                if (param) {
                    this._muscular = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "circulatory", {
            get: function get() {
                return this._circulatory;
            },
            set: function set(param) {
                if (param) {
                    this._circulatory = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "navigation", {
            get: function get() {
                return this._navigation;
            },
            set: function set(param) {
                if (param) {
                    this._navigation = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "communicator", {
            get: function get() {
                return this._communicator;
            },
            set: function set(param) {
                this._communicator = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "stateMachine", {
            get: function get() {
                return this._stateMachine;
            },
            set: function set(param) {
                this._stateMachine = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "id", {
            get: function get() {
                return this._id;
            },
            set: function set(param) {
                this._id = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "name", {
            get: function get() {
                return this._name;
            },
            set: function set(param) {
                this._name = param;
            },
            enumerable: true,
            configurable: true
        });
        Animal.prototype.moveToPoint = function (point) {};
        Animal.prototype.runLife = function () {
            console.log(this);
            this._stateMachine.run();
        };
        Animal.prototype.getCharacteristics = function () {
            var params = [{
                name: 'Скорость',
                value: 89,
                unit: 'м/с'
            }, {
                name: 'Возраст',
                value: 12,
                unit: 'лет'
            }, {
                name: 'Вес',
                value: 12,
                unit: 'кг'
            }, {
                name: 'Выносливость',
                value: 12,
                unit: 'ед.'
            }, {
                name: 'Система кровообращения',
                value: 89,
                unit: '%'
            }, {
                name: 'Система памяти',
                value: 59,
                unit: '%'
            }, {
                name: 'Система дыхания',
                value: 89,
                unit: '%'
            }];
            return {
                name: this._name,
                currentState: 'Бегу',
                param: params
            };
        };
        return Animal;
    }();
    Animals.Animal = Animal;
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var Communicator = function () {
            function Communicator() {
                this._netLinks = [];
                this._sensitivity = 0.1;
            }
            Object.defineProperty(Communicator.prototype, "sensitivity", {
                get: function get() {
                    return this._sensitivity;
                },
                set: function set(param) {
                    this._sensitivity = param ? param : 0.1;
                },
                enumerable: true,
                configurable: true
            });
            Communicator.prototype.setting = function (params) {
                this.sensitivity = params.sensitivity || 0.1;
            };
            Communicator.prototype.addLink = function (event, link) {
                if (this._netLinks[event]) {
                    this._netLinks[event].push(link);
                } else {
                    this._netLinks[event] = [link];
                }
            };
            Communicator.prototype.publish = function (pack, param) {
                var _this = this;
                var links = this._netLinks[pack.type];
                if (links) {
                    links.forEach(function (link) {
                        var delta = link.fun.calculate(param);
                        if (Math.abs(delta) > _this._sensitivity) {
                            delta = pack.behavior === link.behavior ? delta : -delta;
                            link.scale.change(delta);
                        }
                    });
                }
            };
            return Communicator;
        }();
        Communications.Communicator = Communicator;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var BehaviorScaleTypes;
        (function (BehaviorScaleTypes) {
            BehaviorScaleTypes[BehaviorScaleTypes["increase"] = 1] = "increase";
            BehaviorScaleTypes[BehaviorScaleTypes["decrease"] = 2] = "decrease";
        })(BehaviorScaleTypes = Communications.BehaviorScaleTypes || (Communications.BehaviorScaleTypes = {}));
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var CommunicatorBuilder = function () {
            function CommunicatorBuilder(scales) {
                this._scales = scales;
                this._communicator = new Communications.Communicator();
                this._factoryFunction = Animals.Functions.FunctionFactory.instance();
            }
            CommunicatorBuilder.prototype.add = function (param) {
                var _this = this;
                param.link.forEach(function (communication) {
                    var type = communication.type,
                        behavior = communication.behavior,
                        functions = communication.functions,
                        params = communication.params;
                    var scale = _this._scales[type];
                    var fun = _this._createFunction(functions, params);
                    _this._communicator.addLink(param.type, { scale: scale, behavior: behavior, fun: fun });
                    scale.communicator = _this._communicator;
                });
                return this;
            };
            CommunicatorBuilder.prototype.build = function () {
                return this._communicator;
            };
            CommunicatorBuilder.prototype._createFunction = function (type, params) {
                return this._factoryFunction.create(type, params);
            };
            return CommunicatorBuilder;
        }();
        Communications.CommunicatorBuilder = CommunicatorBuilder;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var FunctionFactory = function () {
            function FunctionFactory() {
                this._factories = [];
                this._factories[Functions.FunctionTypes.line] = Functions.LineFunction;
                this._factories[Functions.FunctionTypes.quadratic] = Functions.QuadraticFunction;
            }
            FunctionFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new FunctionFactory();
                }
                return this._instance;
            };
            FunctionFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            FunctionFactory.prototype.create = function (functionType, params) {
                return new this._factories[functionType](params);
            };
            return FunctionFactory;
        }();
        Functions.FunctionFactory = FunctionFactory;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var FunctionTypes;
        (function (FunctionTypes) {
            FunctionTypes[FunctionTypes["line"] = 1] = "line";
            FunctionTypes[FunctionTypes["quadratic"] = 2] = "quadratic";
        })(FunctionTypes = Functions.FunctionTypes || (Functions.FunctionTypes = {}));
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var LineFunction = function () {
            function LineFunction(params) {
                this._coefficient = params[0] || 0;
                this._free = params[1] || 0;
            }
            Object.defineProperty(LineFunction.prototype, "coefficient", {
                get: function get() {
                    return this._coefficient;
                },
                set: function set(param) {
                    this._coefficient = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineFunction.prototype, "free", {
                get: function get() {
                    return this._free;
                },
                set: function set(param) {
                    this._free = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            LineFunction.prototype.calculate = function (param) {
                return this._coefficient * param + this._free;
            };
            return LineFunction;
        }();
        Functions.LineFunction = LineFunction;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var QuadraticFunction = function () {
            function QuadraticFunction(params) {
                this._coefficientA = params[0] || 0;
                this._coefficientB = params[1] || 0;
                this._free = params[2] || 0;
            }
            Object.defineProperty(QuadraticFunction.prototype, "coefficientA", {
                get: function get() {
                    return this._coefficientA;
                },
                set: function set(param) {
                    this._coefficientA = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadraticFunction.prototype, "coefficientB", {
                get: function get() {
                    return this._coefficientB;
                },
                set: function set(param) {
                    this._coefficientB = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadraticFunction.prototype, "free", {
                get: function get() {
                    return this._free;
                },
                set: function set(param) {
                    this._free = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            QuadraticFunction.prototype.calculate = function (param) {
                return this._coefficientA * Math.pow(param, 2) + this._coefficientB * param + this._free;
            };
            return QuadraticFunction;
        }();
        Functions.QuadraticFunction = QuadraticFunction;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ScaleTypes;
        (function (ScaleTypes) {
            ScaleTypes[ScaleTypes["system"] = 0] = "system";
            ScaleTypes[ScaleTypes["argument"] = 1] = "argument";
        })(ScaleTypes = Scales.ScaleTypes || (Scales.ScaleTypes = {}));
        var ParameterScaleTypes;
        (function (ParameterScaleTypes) {
            ParameterScaleTypes[ParameterScaleTypes["state"] = 1] = "state";
            ParameterScaleTypes[ParameterScaleTypes["speed"] = 2] = "speed";
            ParameterScaleTypes[ParameterScaleTypes["weight"] = 3] = "weight";
            ParameterScaleTypes[ParameterScaleTypes["heartbeat"] = 4] = "heartbeat";
            ParameterScaleTypes[ParameterScaleTypes["pressure"] = 5] = "pressure";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberWater"] = 6] = "amountPointRememberWater";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberGrass"] = 7] = "amountPointRememberGrass";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberMeat"] = 8] = "amountPointRememberMeat";
            ParameterScaleTypes[ParameterScaleTypes["speedSavvy"] = 9] = "speedSavvy";
            ParameterScaleTypes[ParameterScaleTypes["radiusVision"] = 10] = "radiusVision";
            ParameterScaleTypes[ParameterScaleTypes["radiusHearing"] = 11] = "radiusHearing";
            ParameterScaleTypes[ParameterScaleTypes["radiusSmell"] = 12] = "radiusSmell";
            ParameterScaleTypes[ParameterScaleTypes["radiusTouch"] = 13] = "radiusTouch";
        })(ParameterScaleTypes = Scales.ParameterScaleTypes || (Scales.ParameterScaleTypes = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var AScale = function () {
            function AScale() {}
            Object.defineProperty(AScale.prototype, "name", {
                get: function get() {
                    return this._name;
                },
                set: function set(param) {
                    this._name = param;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "min", {
                get: function get() {
                    return this._min;
                },
                set: function set(param) {
                    this._min = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "max", {
                get: function get() {
                    return this._max;
                },
                set: function set(param) {
                    this._max = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "current", {
                get: function get() {
                    return this._current;
                },
                set: function set(param) {
                    this._current = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "percent", {
                get: function get() {
                    return this._percent;
                },
                set: function set(param) {
                    this._percent = param;
                    this.getCurrentValueOnScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "type", {
                get: function get() {
                    return this._type;
                },
                set: function set(param) {
                    this._type = param;
                },
                enumerable: true,
                configurable: true
            });
            AScale.prototype.getPercentageInScale = function () {
                this._percent = (this._current - this._min) * 100 / (this._max - this._min);
            };
            AScale.prototype.getCurrentValueOnScale = function () {
                this._current = (this._max - this._min) / 100 * this._percent + this._min;
            };
            return AScale;
        }();
        Scales.AScale = AScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ScaleFactory = function () {
            function ScaleFactory() {
                this._factories = [];
                this._factories[Scales.ScaleTypes.system] = Animals.Scales.SystemScale;
                this._factories[Scales.ScaleTypes.argument] = Animals.Scales.ArgumentScale;
            }
            ScaleFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new ScaleFactory();
                }
                return this._instance;
            };
            ScaleFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            ScaleFactory.prototype.create = function (functionType, params) {
                return new this._factories[functionType](params);
            };
            return ScaleFactory;
        }();
        Scales.ScaleFactory = ScaleFactory;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ArgumentScale = function (_super) {
            __extends(ArgumentScale, _super);
            function ArgumentScale(params) {
                var _this = _super.call(this) || this;
                _this._name = params.name || "No name";
                _this._min = params.min || 0;
                _this._max = params.max || 100;
                _this._current = params.current || _this._max;
                _this._responseDelay = params.responseDelay || 1000;
                _this._type = params.type || 0;
                _this.getPercentageInScale();
                return _this;
            }
            Object.defineProperty(ArgumentScale.prototype, "responseDelay", {
                get: function get() {
                    return this._responseDelay;
                },
                set: function set(param) {
                    this._responseDelay = param ? param : 1000;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArgumentScale.prototype, "communicator", {
                get: function get() {
                    return this._communicator;
                },
                set: function set(param) {
                    this._communicator = param;
                },
                enumerable: true,
                configurable: true
            });
            ArgumentScale.prototype.trigger = function (params) {
                var event = params > 0 ? Animals.Communications.BehaviorScaleTypes.increase : Animals.Communications.BehaviorScaleTypes.decrease;
                var pack = {
                    behavior: event,
                    type: this._type
                };
                this._communicator.publish(pack, params);
            };
            ArgumentScale.prototype.change = function (delta) {
                var _this = this;
                var rez = this.percent + delta;
                if (rez <= 100 && rez >= 0) {
                    this.percent = rez;
                    this.getCurrentValueOnScale();
                }
                setTimeout(function () {
                    _this.trigger(delta);
                }, this.responseDelay);
            };
            return ArgumentScale;
        }(Scales.AScale);
        Scales.ArgumentScale = ArgumentScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var SystemScale = function (_super) {
            __extends(SystemScale, _super);
            function SystemScale(params) {
                var _this = _super.call(this) || this;
                _this._name = params.name || "No name";
                _this._min = params.min || 0;
                _this._max = params.max || 100;
                _this._current = params.current || _this._max;
                _this._type = params.type || 0;
                _this.getPercentageInScale();
                return _this;
            }
            SystemScale.prototype.analysis = function (params) {
                var rez = 0;
                params.forEach(function (param) {
                    rez += param.percent;
                });
                this.percent = rez / params.length;
                this.getCurrentValueOnScale();
            };
            return SystemScale;
        }(Scales.AScale);
        Scales.SystemScale = SystemScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine_1) {
        var StateMachine = function () {
            function StateMachine(state) {
                this._state = state;
            }
            StateMachine.prototype.run = function () {
                this._state.run(this);
            };
            StateMachine.prototype.finishState = function () {
                if (!this._state.isEndPoint()) {
                    this._state = this._state.getNextState();
                    this.run();
                }
            };
            return StateMachine;
        }();
        StateMachine_1.StateMachine = StateMachine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateFactory = function () {
            function StateFactory() {
                this._factories = [];
                this._factories[StateMachine.TypesState.startLife] = Animals.StateMachine.StateStart;
                this._factories[StateMachine.TypesState.stand] = Animals.StateMachine.StateStand;
                this._factories[StateMachine.TypesState.run] = Animals.StateMachine.StateRun;
                this._factories[StateMachine.TypesState.die] = Animals.StateMachine.StateDie;
            }
            StateFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new StateFactory();
                }
                return this._instance;
            };
            StateFactory.prototype.add = function (type, state) {
                this._factories[type] = state;
            };
            StateFactory.prototype.create = function (typeState, name, animal, isEnd) {
                return new this._factories[typeState](name, animal, isEnd, null);
            };
            return StateFactory;
        }();
        StateMachine.StateFactory = StateFactory;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var TypesState;
        (function (TypesState) {
            TypesState[TypesState["startLife"] = 1] = "startLife";
            TypesState[TypesState["stand"] = 2] = "stand";
            TypesState[TypesState["run"] = 3] = "run";
            TypesState[TypesState["die"] = 4] = "die";
        })(TypesState = StateMachine.TypesState || (StateMachine.TypesState = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Route = function () {
            function Route(state, availability) {
                this._state = state;
                this._availability = availability;
            }
            Route.prototype.isAvailable = function (model, probability) {
                if (probability === void 0) {
                    probability = 1.0;
                }
                return this._availability && this._availability(model, probability) ? this._state : null;
            };
            Route.prototype.getState = function () {
                return this._state;
            };
            return Route;
        }();
        StateMachine.Route = Route;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var RouteEngine = function () {
            function RouteEngine(routes, nextEngine) {
                if (routes === void 0) {
                    routes = [];
                }
                if (nextEngine === void 0) {
                    nextEngine = null;
                }
                this._routes = routes;
                this._nextEngine = nextEngine;
            }
            RouteEngine.prototype.add = function (routes) {
                (_a = this._routes).push.apply(_a, routes);
                var _a;
            };
            RouteEngine.prototype.getRoute = function () {
                throw new Error('Not implemented yet...');
            };
            RouteEngine.prototype.setNextEngine = function (engine) {
                this._nextEngine = engine;
            };
            RouteEngine.prototype.setModel = function (animal) {
                this._model = animal;
            };
            RouteEngine.prototype._nextRouteEngine = function () {
                if (this._nextEngine) {
                    return this._nextEngine.getRoute();
                }
                return null;
            };
            return RouteEngine;
        }();
        StateMachine.RouteEngine = RouteEngine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var ProbabilityRouteEngine = function (_super) {
            __extends(ProbabilityRouteEngine, _super);
            function ProbabilityRouteEngine(routes, nextEngine) {
                if (routes === void 0) {
                    routes = [];
                }
                if (nextEngine === void 0) {
                    nextEngine = null;
                }
                return _super.call(this, routes, nextEngine) || this;
            }
            ProbabilityRouteEngine.prototype.getRoute = function () {
                var _this = this;
                var probability = Math.random();
                var routes = this._routes.filter(function (route) {
                    return route.isAvailable(_this._model, probability);
                });
                return routes.length > 0 ? routes[0] : this._nextRouteEngine();
            };
            return ProbabilityRouteEngine;
        }(StateMachine.RouteEngine);
        StateMachine.ProbabilityRouteEngine = ProbabilityRouteEngine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var SimpleRouteEngine = function (_super) {
            __extends(SimpleRouteEngine, _super);
            function SimpleRouteEngine(routes, nextEngine) {
                if (routes === void 0) {
                    routes = [];
                }
                if (nextEngine === void 0) {
                    nextEngine = null;
                }
                return _super.call(this, routes, nextEngine) || this;
            }
            SimpleRouteEngine.prototype.getRoute = function () {
                var _this = this;
                var routes = this._routes.filter(function (route) {
                    return route.isAvailable(_this._model);
                });
                return routes.length > 0 ? routes[0] : this._nextRouteEngine();
            };
            return SimpleRouteEngine;
        }(StateMachine.RouteEngine);
        StateMachine.SimpleRouteEngine = SimpleRouteEngine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var State = function () {
            function State(name, model, routeEngine, isEndPoint) {
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                this._name = name;
                this._model = model;
                this._routeEngine = routeEngine;
                this._isEndPoint = isEndPoint;
            }
            State.prototype.getName = function () {
                return this._name;
            };
            State.prototype.getNextState = function () {
                if (!this._routeEngine) {
                    return this;
                }
                var route = this._routeEngine.getRoute();
                return route ? route.getState() : this;
            };
            State.prototype.isEndPoint = function () {
                return this._isEndPoint;
            };
            State.prototype.setRouteEngine = function (routeEngine) {
                this._routeEngine = routeEngine;
                this._routeEngine.setModel(this._model);
            };
            State.prototype.add = function (state) {
                throw new Error('Not implemented yet...');
            };
            State.prototype.run = function (model) {
                throw new Error('Not implemented yet...');
            };
            return State;
        }();
        StateMachine.State = State;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateDie = function (_super) {
            __extends(StateDie, _super);
            function StateDie(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateDie.prototype.run = function (next) {
                console.log('умер');
                next.finishState();
            };
            return StateDie;
        }(StateMachine.State);
        StateMachine.StateDie = StateDie;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateRun = function (_super) {
            __extends(StateRun, _super);
            function StateRun(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateRun.prototype.run = function (next) {
                console.log('бегу');
                this._model.muscular.changeSpeed(-0.4);
                this._model.muscular.changeWeight(-0.5);
                next.finishState();
            };
            return StateRun;
        }(StateMachine.State);
        StateMachine.StateRun = StateRun;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateStand = function (_super) {
            __extends(StateStand, _super);
            function StateStand(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateStand.prototype.run = function (next) {
                console.log('стою');
                this._model.muscular.changeSpeed(0.5);
                this._model.muscular.changeWeight(0.7);
                next.finishState();
            };
            return StateStand;
        }(StateMachine.State);
        StateMachine.StateStand = StateStand;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateStart = function (_super) {
            __extends(StateStart, _super);
            function StateStart(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateStart.prototype.run = function (next) {
                console.log('Начал жить');
                this._model.muscular.changeSpeed(0.001);
                this._model.muscular.changeWeight(0.001);
                var k = 0;
                for (var i = 0; i < 10000000; i++) {
                    k += 1;
                }
                next.finishState();
            };
            return StateStart;
        }(StateMachine.State);
        StateMachine.StateStart = StateStart;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var PatternState = function (_super) {
            __extends(PatternState, _super);
            function PatternState(name, model, routeEngine, states) {
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                if (states === void 0) {
                    states = [];
                }
                var _this = _super.call(this, name, model, routeEngine) || this;
                _this._states = states;
                return _this;
            }
            PatternState.prototype.add = function (state) {
                this._states.push(state);
            };
            PatternState.prototype.run = function (model) {
                var state = this._states[0];
                while (state) {
                    this._state = state;
                    state.run(model);
                }
            };
            PatternState.prototype.getName = function () {
                if (!this._state) {
                    throw new Error('Current state not initialized...');
                }
                return this._state.getName();
            };
            return PatternState;
        }(StateMachine.State);
        StateMachine.PatternState = PatternState;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var PrimitiveState = function (_super) {
            __extends(PrimitiveState, _super);
            function PrimitiveState(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            PrimitiveState.prototype.run = function () {
                throw new Error('No implementation status...');
            };
            return PrimitiveState;
        }(StateMachine.State);
        StateMachine.PrimitiveState = PrimitiveState;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var SystemTypes;
        (function (SystemTypes) {
            SystemTypes[SystemTypes["muscular"] = 1] = "muscular";
            SystemTypes[SystemTypes["circulatory"] = 2] = "circulatory";
            SystemTypes[SystemTypes["memory"] = 3] = "memory";
            SystemTypes[SystemTypes["navigation"] = 4] = "navigation";
        })(SystemTypes = Systems.SystemTypes || (Systems.SystemTypes = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var SystemFactory = function () {
            function SystemFactory() {
                this._factories = [];
                this._factories[Systems.SystemTypes.muscular] = Animals.Systems.Muscular;
                this._factories[Systems.SystemTypes.circulatory] = Animals.Systems.Circulatory;
                this._factories[Systems.SystemTypes.navigation] = Animals.Systems.Navigation;
            }
            SystemFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new SystemFactory();
                }
                return this._instance;
            };
            SystemFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            SystemFactory.prototype.create = function (functionType, params) {
                return new this._factories[functionType](params);
            };
            return SystemFactory;
        }();
        Systems.SystemFactory = SystemFactory;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Circulatory = function () {
            function Circulatory(scales) {
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                ;
                this.heartbeat = scales[Animals.Scales.ParameterScaleTypes.heartbeat];
                this.pressure = scales[Animals.Scales.ParameterScaleTypes.pressure];
            }
            Object.defineProperty(Circulatory.prototype, "heartbeat", {
                get: function get() {
                    return this._heartbeat;
                },
                set: function set(param) {
                    if (param) {
                        this._heartbeat = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Circulatory.prototype, "pressure", {
                get: function get() {
                    return this._pressure;
                },
                set: function set(param) {
                    if (param) {
                        this._pressure = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Circulatory.prototype.changeHeartbeat = function (delta) {
                this._heartbeat.change(delta);
                this.analysis();
            };
            Circulatory.prototype.changePressure = function (delta) {
                this._pressure.change(delta);
                this.analysis();
            };
            Circulatory.prototype.analysis = function () {
                this.state.analysis([]);
            };
            return Circulatory;
        }();
        Systems.Circulatory = Circulatory;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Muscular = function () {
            function Muscular(scales) {
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                this.speed = scales[Animals.Scales.ParameterScaleTypes.speed];
                this.weight = scales[Animals.Scales.ParameterScaleTypes.weight];
            }
            Object.defineProperty(Muscular.prototype, "speed", {
                get: function get() {
                    return this._speed;
                },
                set: function set(param) {
                    if (param) {
                        this._speed = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Muscular.prototype, "weight", {
                get: function get() {
                    return this._weight;
                },
                set: function set(param) {
                    if (param) {
                        this._weight = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Muscular.prototype, "currentPoint", {
                get: function get() {
                    return this._currentPoint;
                },
                set: function set(param) {
                    this._currentPoint.x = param.x;
                    this._currentPoint.y = param.y;
                },
                enumerable: true,
                configurable: true
            });
            Muscular.prototype.changeSpeed = function (delta) {
                this._speed.change(delta);
                this.analysis();
            };
            Muscular.prototype.changeWeight = function (delta) {
                this._weight.change(delta);
                this.analysis();
            };
            Muscular.prototype.analysis = function () {
                this.state.analysis([]);
            };
            return Muscular;
        }();
        Systems.Muscular = Muscular;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Navigation = function () {
            function Navigation(scales) {
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                this.speedSavvy = scales[Animals.Scales.ParameterScaleTypes.speedSavvy];
                this.radiusHearing = scales[Animals.Scales.ParameterScaleTypes.radiusHearing];
                this.radiusSmell = scales[Animals.Scales.ParameterScaleTypes.radiusSmell];
                this.radiusVision = scales[Animals.Scales.ParameterScaleTypes.radiusVision];
                this.radiusTouch = scales[Animals.Scales.ParameterScaleTypes.radiusTouch];
            }
            Object.defineProperty(Navigation.prototype, "speedSavvy", {
                get: function get() {
                    return this._speedSavvy;
                },
                set: function set(param) {
                    if (param) {
                        this._speedSavvy = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusVision", {
                get: function get() {
                    return this._radiusVision;
                },
                set: function set(param) {
                    if (param) {
                        this._radiusVision = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusHearing", {
                get: function get() {
                    return this._radiusHearing;
                },
                set: function set(param) {
                    if (param) {
                        this._radiusHearing = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusSmell", {
                get: function get() {
                    return this._radiusSmell;
                },
                set: function set(param) {
                    if (param) {
                        this._radiusSmell = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusTouch", {
                get: function get() {
                    return this._radiusTouch;
                },
                set: function set(param) {
                    if (param) {
                        this._radiusTouch = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Navigation.prototype.changeSpeedSavvy = function (delta) {
                this._speedSavvy.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusVision = function (delta) {
                this._radiusVision.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusHearing = function (delta) {
                this._radiusHearing.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusSmell = function (delta) {
                this._radiusSmell.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusTouch = function (delta) {
                this._radiusTouch.change(delta);
                this.analysis();
            };
            Navigation.prototype.analysis = function () {
                this.state.analysis([]);
            };
            return Navigation;
        }();
        Systems.Navigation = Navigation;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var MapGame;
(function (MapGame) {
    var Map = function () {
        function Map() {}
        Map.instance = function () {
            if (!this._inst) {
                this._inst = new Map();
            }
            return this._inst;
        };
        Object.defineProperty(Map.prototype, "world", {
            get: function get() {
                return this._world;
            },
            set: function set(map) {
                if (map) {
                    this._world = map;
                    this._initializationWorld();
                } else {
                    throw new Error('World was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "obstaclesLayer", {
            set: function set(layer) {
                if (layer) {
                    this._obstaclesLayer = layer;
                } else {
                    throw new Error('Layer obstacle was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "waterLayer", {
            set: function set(layer) {
                if (layer) {
                    this._waterLayer = layer;
                } else {
                    throw new Error('Layer water was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "treeLayer", {
            set: function set(layer) {
                if (layer) {
                    this._treeLayer = layer;
                } else {
                    throw new Error('Layer tree was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Map.prototype._initializationWorld = function () {
            this._initializationLayer();
            this._sizeMapTiled = this._world.getMapSize();
            this._sizeTiled = this._world.getTileSize();
            this._sizeMapPixel = this._getSizeMapPixel();
        };
        Map.prototype._initializationLayer = function () {
            this.obstaclesLayer = this._world.getLayer('obstacle');
            this.waterLayer = this._world.getLayer('water');
            this.treeLayer = this._world.getLayer('tree');
        };
        Map.prototype._getSizeMapPixel = function () {
            var sizeX = this._sizeMapTiled.width * this._sizeTiled.width;
            var sizeY = this._sizeMapTiled.height * this._sizeTiled.height;
            return cc.v2(sizeX, sizeY);
        };
        Map.prototype.convertTiledPos = function (posInPixel) {
            var x = Math.floor(posInPixel.x / this._sizeTiled.width);
            var y = Math.floor((this._sizeMapPixel.y - posInPixel.y) / this._sizeTiled.height);
            return cc.v2(x, y);
        };
        Map.prototype.convertPixelPos = function (posInTiled) {
            var x = posInTiled.x * this._sizeTiled.width + this._sizeTiled.width / 2;
            var y = this._sizeMapPixel.y - posInTiled.y * this._sizeTiled.height - this._sizeTiled.height / 2;
            return cc.v2(x, y);
        };
        Map.prototype.isCheсkObstacle = function (gid) {
            if (this._isCorrectPos(gid)) {
                if (this._obstaclesLayer.getTileGIDAt(gid.x, gid.y) === 0) {
                    return false;
                }
            }
            return true;
        };
        Map.prototype._isCorrectPos = function (pos) {
            if (pos.x < 0 || pos.y < 0 || pos.x > this._sizeMapTiled.width - 1 || pos.y > this._sizeMapTiled.height - 1) {
                return false;
            }
            return true;
        };
        return Map;
    }();
    MapGame.Map = Map;
})(MapGame || (MapGame = {}));
var lion = {
    name: 'Лев',
    systems: [{
        type: Animals.Systems.SystemTypes.muscular,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.weight }]
    }, {
        type: Animals.Systems.SystemTypes.circulatory,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.pressure }, { type: Animals.Scales.ParameterScaleTypes.heartbeat }]
    }, {
        type: Animals.Systems.SystemTypes.navigation,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.speedSavvy }, { type: Animals.Scales.ParameterScaleTypes.radiusVision }, { type: Animals.Scales.ParameterScaleTypes.radiusSmell }, { type: Animals.Scales.ParameterScaleTypes.radiusHearing }, { type: Animals.Scales.ParameterScaleTypes.radiusTouch }]
    }],
    scales: [{
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.heartbeat,
        params: {
            name: 'Сердцебиение',
            current: 9,
            min: 0,
            max: 100,
            responseDelay: 0.12
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.pressure,
        params: {
            name: 'Давление',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.13
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.speed,
        params: {
            name: 'Скорость',
            current: 9,
            min: 0,
            max: 100,
            responseDelay: 0.12
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.weight,
        params: {
            name: 'Вес',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.speedSavvy,
        params: {
            name: 'Время смекалки',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.radiusTouch,
        params: {
            name: 'Радиус осязания',
            current: 9,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.radiusVision,
        params: {
            name: 'Радиус зрения',
            current: 40,
            min: 0,
            max: 80,
            responseDelay: 0.1
        }
    }],
    communication: [{
        type: Animals.Scales.ParameterScaleTypes.speed,
        link: [{
            type: Animals.Scales.ParameterScaleTypes.weight,
            behavior: Animals.Communications.BehaviorScaleTypes.increase,
            functions: Animals.Functions.FunctionTypes.line,
            params: [0.5, 0.18]
        }]
    }, {
        type: Animals.Scales.ParameterScaleTypes.weight,
        link: [{
            type: Animals.Scales.ParameterScaleTypes.speed,
            behavior: Animals.Communications.BehaviorScaleTypes.decrease,
            functions: Animals.Functions.FunctionTypes.line,
            params: [0.5, 0.1]
        }]
    }],
    states: {
        state: [{
            name: 'Старт',
            type: Animals.StateMachine.TypesState.startLife,
            isEnd: false
        }, {
            name: 'Бегу',
            type: Animals.StateMachine.TypesState.run,
            isEnd: false
        }, {
            name: 'Стою',
            type: Animals.StateMachine.TypesState.stand,
            isEnd: false
        }, {
            name: 'Умер',
            type: Animals.StateMachine.TypesState.die,
            isEnd: true
        }],
        links: [{
            type: Animals.StateMachine.TypesState.startLife,
            link: [{
                type: Animals.StateMachine.TypesState.run,
                probability: 0.7
            }, {
                type: Animals.StateMachine.TypesState.stand,
                probability: 0.7
            }, {
                type: Animals.StateMachine.TypesState.die,
                probability: 0.01
            }]
        }, {
            type: Animals.StateMachine.TypesState.stand,
            link: [{
                type: Animals.StateMachine.TypesState.run,
                probability: 0.7
            }, {
                type: Animals.StateMachine.TypesState.die,
                probability: 0.01
            }]
        }, {
            type: Animals.StateMachine.TypesState.run,
            link: [{
                type: Animals.StateMachine.TypesState.die,
                probability: 0.6
            }, {
                type: Animals.StateMachine.TypesState.stand,
                probability: 0.9
            }, {
                type: Animals.StateMachine.TypesState.run,
                probability: 0.1
            }]
        }]
    }
};


cc._RFpop();
},{}],"circular-list-actions-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a6899DVEs9GDZoz23Sq6Cgc', 'circular-list-actions-animal');
// scripts\components\circular-list\circular-list-actions-animal.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CircularListActionsAnimal = undefined;

var _circularList = require('./circular-list');

/**
 * Настраивает круглое меню животного
 * @class CircularListActionsAnimal
 * @extends CircularList
 */
var CircularListActionsAnimal = cc.Class({
    extends: _circularList.CircularList,

    /**
     * Настройка меню для конкретного животного. Настраивает радиус круга.
     * @method settings
     * @param {cc.Component} controllerAnimal контроллер животного.
     */
    settings: function settings(controllerAnimal) {
        var node = controllerAnimal.node;

        this.radius = node.width * 1.75;
        if (this.radius > 150) {
            this.radius = 150;
        } else if (this.radius < 100) {
            this.radius = 100;
        }

        this._refreshMenu();
    }
});

exports.CircularListActionsAnimal = CircularListActionsAnimal;

cc._RFpop();
},{"./circular-list":"circular-list"}],"circular-list":[function(require,module,exports){
"use strict";
cc._RFpush(module, '784b8AGpLpDe6a27LcTvsKZ', 'circular-list');
// scripts\components\circular-list\circular-list.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Состояние движения меню (по часовой/против часовой).
 * @type {MoveCircular}
 * @static
 * @element {number} clockwise крутится по часовой.
 * @element {number} anticlockwise крутится против часовой.
 */
var MoveCircular = {
    clockwise: 0, //по часовой
    anticlockwise: 1 };

/**
 * Выполняет вращениеи размещение элементов по окружности.
 * @class CircularList
 */
var CircularList = cc.Class({
    extends: cc.Component,

    properties: {
        _lengthBetweenPoints: 0, //расстояние между элементами
        _centre: cc.Vec2, //Центр круга
        _arrayAngleList: [], ///массив углов листов на которых они находятся
        _poolInvisibleList: [], //массив невидимых листов
        _prevRotation: 0, //предыдущий угол воворота до текущего поворота
        _stateDirection: MoveCircular.clockwise, //направление движения

        amountVisiblList: 7, //количество видимых липестков меню
        angleTransition: 225, //угол перехода и появленияновых липестков
        widthTransition: 0.3, //ширина перехода в градусах
        radius: 130, //радиус на котором будут крутится все кнопки
        sensitivity: 1 },

    /**
     * Инициализация меню животного.
     * @method onLoad
     */
    onLoad: function onLoad() {
        this._placementListsMenu();
        this._prevRotation = this.node.rotation;
    },


    /**
     * Обновить позиции кнопок в меню. С учетом радиуса окружности.
     * @method _refreshMenu
     * @private
     */
    _refreshMenu: function _refreshMenu() {
        this._placementListsMenu();
    },


    /**
     * Распределение кнопок по окружности.
     * @method _placementListsMenu
     * @private
     */
    _placementListsMenu: function _placementListsMenu() {
        var _this = this;

        //рассчитываем центр круга
        var window = this.node.parent;
        var currentRadians = 0,
            x = void 0,
            y = void 0;
        this._arrayAngleList = [];
        this._poolInvisibleList = [];

        this._centre = cc.v2(window.width / 2, window.height / 2);
        this._lengthBetweenPoints = 2 * Math.PI / this.amountVisiblList;

        this.node.children.forEach(function (item) {

            if (currentRadians >= 2 * Math.PI) {
                item.active = false;
                _this._poolInvisibleList.push(item);
            } else {
                y = _this.radius * Math.sin(currentRadians);
                x = _this.radius * Math.cos(currentRadians);
                item.setPosition(x, y);
                _this._arrayAngleList.push({ item: item, angle: currentRadians * (180 / Math.PI) });
            }

            currentRadians += _this._lengthBetweenPoints;
        });
    },


    /**
     * Определение направления вращения и вызывает соответствующий обработчик, передавая значения с
     * учетом чувствительности.
     * @method directionRotation
     * @param {number} x дельта изменения по абциссе.
     * @param {number} y дельта изменения по ординате.
     * @param {number} locX положение тача по абциссе.
     * @param {number} locY положение тача по ординате.
     */
    directionRotation: function directionRotation(x, y, locX, locY) {
        //применяем чувствительность
        x = x * this.sensitivity;
        y = y * this.sensitivity;

        if (locX > this._centre.x && locY > this._centre.y) {
            this._obr1(x, y);
        } else if (locX < this._centre.x && locY > this._centre.y) {
            this._obr2(x, y);
        } else if (locX < this._centre.x && locY < this._centre.y) {
            this._obr3(x, y);
        } else if (locX > this._centre.x && locY < this._centre.y) {
            this._obr4(x, y);
        } else {
            this.node.rotation += 0.001;
        }

        this._setDirection();

        if (this.amountVisiblList < this.node.children.length) {
            this._workingVisibleElements();
        }
    },


    /**
     * Работает с появлением элементов.
     * @method _workingVisibleElements
     * @private
     */
    _workingVisibleElements: function _workingVisibleElements() {
        var _this2 = this;

        var angle = this.getAngleMenu();
        //Узнаем для каждого элемента его угол на котором он находится
        this.node.children.forEach(function (item) {
            if (item.active) {
                _this2._swapElement(_this2.getAngleList(item, angle), item);
            }
            angle = _this2.getAngleMenu();
        });
    },


    /**
     * Отдает угол меню.
     * @method getAngleMenu
     * @returns {number} угол поворота от 0 до 360.
     */
    getAngleMenu: function getAngleMenu() {
        return this.node.rotation - 360 * Math.floor(this.node.rotation / 360);
    },


    /**
     * Работает с элементами выключая их и подставляяя за место них другие эелементы.
     * @method _swapElement
     * @param {number} angle угол на котором находится элемент.
     * @param {cc.Node} element элемент/лист который необходимо заменить на следующий элемент из очереди невидимых элементов.
     * @private
     */
    _swapElement: function _swapElement(angle, element) {
        if (angle > this.angleTransition - this.widthTransition && angle < this.angleTransition + this.widthTransition) {
            element.active = false;
            var actualList = this._poolInvisibleList.shift();
            actualList.setPosition(cc.v2(element.x, element.y));
            actualList.rotation = element.rotation;
            actualList.active = true;
            this._poolInvisibleList.push(element);
            this._arrayAngleList.forEach(function (item) {
                if (item.item.name === element.name) {
                    item.item = actualList;
                }
            });

            this._stateDirection === MoveCircular.clockwise ? this.node.rotation += this.widthTransition : this.node.rotation -= this.widthTransition;
        }
    },


    /**
     * Возвращает угол элемента/листа под которым он находится.
     * @method getAngleList
     * @param {cc.Node} element нод элемента.
     * @param {number} angle угол поворота меню.
     * @return {number} угол листа/элемента меню.
     */
    getAngleList: function getAngleList(element, angle) {
        var obj = this._arrayAngleList.filter(function (item) {
            return item.item.x === element.x && item.item.y === element.y;
        });

        obj = obj[0].angle - angle;
        obj -= Math.floor(obj / 360) * 360;
        return obj;
    },


    /**
     * Устанавливает состояние движения меню в зависимости от направления поворота.
     * @method _setDirection
     * @private
     */
    _setDirection: function _setDirection() {
        if (this.node.rotation > this._prevRotation) {
            this._stateDirection = MoveCircular.clockwise;
        } else if (this.node.rotation < this._prevRotation) {
            this._stateDirection = MoveCircular.anticlockwise;
        }
        this._prevRotation = this.node.rotation;
    },


    /**
     * Стабилизирует элементы меню по положению к горизонту.
     * @method stabilizationElements
     */
    stabilizationElements: function stabilizationElements() {
        var _this3 = this;

        this.node.children.forEach(function (item) {
            item.rotation = -_this3.node.rotation;
        });
    },


    /**
     * Обработчик первой четверти окружности. Распознает движение тача и применяет сответствующее поведение.
     * Для обеспечения вращения окружности пользователем.
     * @method _obr1
     * @param {number} x дельта по абциссе.
     * @param {number} y дельта по ординате.
     * @private
     */
    _obr1: function _obr1(x, y) {
        this.node.rotation += x;
        this.node.rotation -= y;
        this.stabilizationElements();
    },


    /**
     * Обработчик второй четверти круга. Распознает движение тача и применяет сответствующее поведение.
     * Для обеспечения вращения окружности пользователем.
     * @method _obr2
     * @param {number} x дельта по абциссе.
     * @param {number} y дельта по ординате.
     * @private
     */
    _obr2: function _obr2(x, y) {
        this.node.rotation += x;
        this.node.rotation += y;
        this.stabilizationElements();
    },


    /**
     * Обработчик третьей четверти круга. Распознает движение тача и применяет сответствующее поведение.
     * Для обеспечения вращения окружности пользователем.
     * @method _obr3
     * @param {number} x дельта по абциссе.
     * @param {number} y дельта по ординате.
     * @private
     */
    _obr3: function _obr3(x, y) {
        this.node.rotation -= x;
        this.node.rotation += y;
        this.stabilizationElements();
    },


    /**
     * Обработчик четвертой четверти круга. Распознает движение тача и применяет сответствующее поведение.
     * Для обеспечения вращения окружности пользователем.
     * @method _obr4
     * @param {number} x дельта по абциссе.
     * @param {number} y дельта по ординате.
     * @private
     */
    _obr4: function _obr4(x, y) {
        this.node.rotation -= x;
        this.node.rotation -= y;
        this.stabilizationElements();
    }
});

exports.CircularList = CircularList;

cc._RFpop();
},{}],"controller-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, '66c9dWcVjFAg46rYxreOb0Q', 'controller-animal');
// scripts\components\controller\controller-animal.js

'use strict';

var _buildTs = require('../../build/build-ts');

/**
 *
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _model: null, //модель животного

        _maxBiasTouch: 15, //максимальное смещение тача для открытия меню (px)
        _pointTouchForMenu: cc.v2, //точка старта тача по животному

        _isMove: false, //флаг для определения движется ли живоное за пользователем
        _isOpenMenu: false },

    onLoad: function onLoad() {
        this._api = _buildTs.APICore.instance();
        this._isOpenMenu = false;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoveAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStartAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEndAnimal.bind(this));
    },


    /**
     * Настраивает доступные действия плюшки для животного и характеристики
     */
    settings: function settings(pack) {
        this._model = this._api.createAnimal(pack.puthToModel, pack.id); //создаем модель животного

        cc.log(this.node.children);
        this.settingCollider(this._model.navigation.radiusVision, this.node.children[0].getComponent(cc.CircleCollider));
        this.settingCollider(this._model.navigation.radiusHearing, this.node.children[1].getComponent(cc.CircleCollider));
        this.settingCollider(this._model.navigation.radiusSmell, this.node.children[2].getComponent(cc.CircleCollider));
        this.settingCollider(this._model.navigation.radiusTouch, this.node.children[3].getComponent(cc.CircleCollider));
    },


    /**
     * Настраивает коллайдеры у животного согласно его модели
     * @method settingCollider
     * @param {Animals.Systems.ISystem} system
     * @param {cc.CircleCollider} component
     */
    settingCollider: function settingCollider(system, component) {
        system === undefined ? component.radius = 0 : component.radius = system.current;
    },


    /**
     * Обработчик события начала тача
     * @param event
     * @private
     */
    _onTouchStartAnimal: function _onTouchStartAnimal(event) {
        var myEvent = new cc.Event.EventCustom('startMotionAnimal', true);
        myEvent.detail = {
            startMotion: cc.v2(this.node.x, this.node.y),
            controller: this
        };
        this.node.dispatchEvent(myEvent); //разослали евент
        this._isMove = false; //животное не движется за пользователем
        this._pointTouchForMenu = event.getLocation(); //считали точку первого нажатия
        event.stopPropagation();
    },


    /**
     * Обработчик события движения тача.
     * @param event
     * @private
     */
    _onTouchMoveAnimal: function _onTouchMoveAnimal(event) {
        //   cc.log(event);
        var delta = event.touch.getDelta();
        if (this._isCheckOnOpenMenu(event.getLocation()) && !this._isOpenMenu) {
            this._isMove = true;
            var myEvent = new cc.Event.EventCustom('motionAnimal', true);
            myEvent.detail = {
                deltaMotion: delta,
                pointEnd: event.getLocation()
            };
            this.node.dispatchEvent(myEvent);
        }
        event.stopPropagation();
    },


    /**
     * Обработчик события завершения тача
     * @param event
     * @private
     */
    _onTouchEndAnimal: function _onTouchEndAnimal(event) {
        if (this._isMove) {
            var myEvent = new cc.Event.EventCustom('endMotionAnimal', true);
            myEvent.detail = {
                pointEnd: event.getLocation()
            };
            this.node.dispatchEvent(myEvent);
            this._isMove = false;
        } else {
            this._refocusMenu();
        }
        event.stopPropagation();
    },


    /**
     * Проверяет открывается меню или нет. Путем сканирования точки тача на выходза пределы от начапльной точки
     * @param point
     * @return {boolean}
     * @private
     */
    _isCheckOnOpenMenu: function _isCheckOnOpenMenu(point) {
        var X = Math.abs(this._pointTouchForMenu.x - point.x) > this._maxBiasTouch;
        var Y = Math.abs(this._pointTouchForMenu.y - point.y) > this._maxBiasTouch;
        return X || Y;
    },


    /**
     * Изменяет состояние меню
     * @private
     */
    _refocusMenu: function _refocusMenu() {
        this._isOpenMenu = !this._isOpenMenu;
        this._isOpenMenu ? this._publishOpenMenuAnimal() : this._publishCloseMenuAnimal();
    },


    /**
     * Открытие меню животного
     */
    _publishOpenMenuAnimal: function _publishOpenMenuAnimal() {
        var myEvent = new cc.Event.EventCustom('openMenuAnimal', true);
        myEvent.detail = {
            controller: this
        };
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Закрыто меню с животными
     */
    _publishCloseMenuAnimal: function _publishCloseMenuAnimal() {
        var myEvent = new cc.Event.EventCustom('closeMenuAnimal', true);
        myEvent.detail = {
            controller: this
        };
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Открытие меню
     */
    openMenu: function openMenu() {
        this._isOpenMenu = true;
        this._publishOpenMenuAnimal();
    },


    /**
     * Закрыть меню
     */
    closeMenu: function closeMenu() {
        this._isOpenMenu = false;
        this._publishCloseMenuAnimal();
    },


    /**
     * Сообщает модели до какой точки надо дойти
     * @param point
     */
    moveToPoint: function moveToPoint(point) {
        this._model.moveToPoint(point);
    },


    /**
     * Запускает жизнь животного
     * @method run
     */
    run: function run() {
        this._model.runLife();
    },


    /**
     * Подать звук
     */
    runVoice: function runVoice() {},


    /**
     * Сесть
     */
    runSit: function runSit() {},


    /**
     * Испугаться
     */
    runFrighten: function runFrighten() {},


    /**
     * Показать ареалы
     */
    runAreal: function runAreal() {},


    /**
     * Поласкаться
     */
    runCare: function runCare() {},


    /**
     * Лечь
     */
    runLie: function runLie() {},


    /**
     * Приготовиться
     */
    runAttention: function runAttention() {},


    /**
     * Возвращает массив характеристик у животного
     * @return {*|any}
     */
    getCharacteristics: function getCharacteristics() {
        return this._model.getCharacteristics();
    }
});

cc._RFpop();
},{"../../build/build-ts":"build-ts"}],"controller-create-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, '68d96M14BpDWYNEyzwJbTpY', 'controller-create-animal');
// scripts\components\controller\controller-create-animal.js

'use strict';

cc.Class({
    extends: cc.Component,

    /**
     *
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },


    /**
     * Действия на нажатие по зверюшке после создания зверюшки
     * @param event
     */
    onTouchStart: function onTouchStart(event) {
        var myEvent = new cc.Event.EventCustom('startDragAndDropAnimal', true);
        myEvent.detail = {
            animal: this.node
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Действия надвижение зажатой зверюшки после создания звербшки
     * @param event
     */
    onTouchMove: function onTouchMove(event) {
        var delta = event.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
        var myEvent = new cc.Event.EventCustom('dragAndDropAnimal', true);
        myEvent.detail = {
            point: { x: this.node.x, y: this.node.y }
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Действие на завершение нажатия по зверюшке после создания зверюшки
     * @param event
     */
    onTouchEnd: function onTouchEnd(event) {
        var myEvent = new cc.Event.EventCustom('stopDragAndDropAnimal', true);
        myEvent.detail = {
            point: { x: this.node.x, y: this.node.y }
        };
        this.node.dispatchEvent(myEvent);

        event.stopPropagation();
    }
});

cc._RFpop();
},{}],"controller-map":[function(require,module,exports){
"use strict";
cc._RFpush(module, '92c540oZntIDYNnPFU1Dt7g', 'controller-map');
// scripts\components\controller\controller-map.js

'use strict';

/**
 * Created by FIRCorp on 04.03.2017.
 */

cc.Class({
    extends: cc.Component,

    properties: {
        _fictitiousPoint: null, //Точка для фиксации движения карты. Помогает различать событие движение от завершения
        _isTouchStart: null, //Флаг запущен ли тач
        _controllerScrollMap: null,
        _actionMoveMap: null, //действие движения карты
        _maxSizeMapScroll: null, //размер offset скролла. поможет при перемещении камеры от зверюшки к зверюшке

        maxBiasTouch: 15 },

    onLoad: function onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));

        this._isTouchStart = false;
        this._controllerScrollMap = this.node.parent.parent.getComponent(cc.ScrollView);
        this._fictitiousPoint = cc.v2(0, 0);
        this._maxSizeMapScroll = this._controllerScrollMap.getMaxScrollOffset();
    },


    /**
     * Событие пораждающиеся скролом
     * @param event событие которое ловит скрол
     */
    onEventScroll: function onEventScroll(event) {
        var point = event.getScrollOffset();
        var logRez = point.x === this._fictitiousPoint.x && point.y === this._fictitiousPoint.y;
        logRez && this._isTouchStart ? this.onTouchEnd(event) : this._fictitiousPoint = point;
    },


    /**
     * Действия на прикосновение к карте
     * @param event событие которое поймает этот скрипт
     */
    onTouchStart: function onTouchStart(event) {
        this._isTouchStart = true;
        //запомнимпозиция начала эвента
        var myEvent = new cc.Event.EventCustom('touchOnMap', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Действия на движение touch по карте
     * @param event событие которое поймает этот скрипт
     */
    onTouchMove: function onTouchMove(event) {
        var myEvent = new cc.Event.EventCustom('touchMoveOnMap', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Дейстия на откпускание touch от карты
     * @param event событие которое поймает скрол либо этот скрипт
     */
    onTouchEnd: function onTouchEnd(event) {
        //      cc.log(event);
        if (this._isTouchStart) {
            this._isTouchStart = false;
            var myEvent = new cc.Event.EventCustom('touchEndMoveOnMap', true);
            myEvent.detail = {};
            this.node.dispatchEvent(myEvent);
        }
        //    event.stopPropagation();
    },


    /**
     * Конвентирует точку окна в точку карты
     * @param point точка в окне
     * @returns {Vec2} точка на карте
     */
    getPointMap: function getPointMap(point) {
        var newX = point.x - this.node.x;
        var newY = point.y - this.node.y;
        return cc.v2(newX, newY);
    },


    /**
     * Конвертирует точку в координаты окна
     * @param point точка на карте
     * @returns {Vec2} точка в окне
     */
    getPointWindow: function getPointWindow(point) {
        var newX = point.x + this.node.x;
        var newY = point.y + this.node.y;
        return cc.v2(newX, newY);
    },


    /**
     * Возвращает точку карты из системы координат скролла
     * @param point исходная точка
     * @returns {Vec2}
     */
    getPointMapOfOffset: function getPointMapOfOffset(point) {
        var newY = this._maxSizeMapScroll.y - point.y;
        return cc.v2(point.x, newY);
    },


    /**
     * Инвертирует точку
     * @param point исходная точка
     * @returns {Vec2}
     */
    getInvertPoint: function getInvertPoint(point) {
        var newX = -point.x;
        var newY = -point.y;
        return cc.v2(newX, newY);
    },


    /**
     * Движение камеры внекоторую точку на основе метода движения скролла. С использованием его системы координат
     * @param point точка в которую необходимо перейти
     * @param time время за кторое производится переход
     */
    move: function move(point) {
        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        this._controllerScrollMap.scrollToOffset(this.getPointMapOfOffset(point), time);
    },


    /**
     * Движение карты в некоторую точку на основе actions
     * @param point
     * @param time
     */
    moveActions: function moveActions(point) {
        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        this.node.stopAction(this._actionMoveMap);
        this._actionMoveMap = cc.moveTo(time, this.getInvertPoint(point));
        this.node.runAction(cc.sequence(this._actionMoveMap, cc.callFunc(this._publishFinishMoveCentreToAnimal, this)));
    },


    /**
     * Публикует событие завершения движения камеры до животного и фиксирование его по центру экрана
     * @private
     */
    _publishFinishMoveCentreToAnimal: function _publishFinishMoveCentreToAnimal() {
        var myEvent = new cc.Event.EventCustom('finishMoveCameraToAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    }
});

cc._RFpop();
},{}],"controller-menu-play":[function(require,module,exports){
"use strict";
cc._RFpush(module, '347b4yRgbpKUKt0KdaDtRm2', 'controller-menu-play');
// scripts\components\controller\controller-menu-play.js

"use strict";

/**
 * Created by FIRCorp on 31.03.2017.
 */
cc.Class({
    extends: cc.Component,

    /**
     *
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },


    /**
     *
     * @param event
     */
    onTouchStart: function onTouchStart(event) {},


    /**
     *
     * @param event
     */
    onTouchMove: function onTouchMove(event) {},


    /**
     *
     * @param event
     */
    onTouchEnd: function onTouchEnd(event) {}
});

cc._RFpop();
},{}],"controller-scroll-box-characteristic":[function(require,module,exports){
"use strict";
cc._RFpush(module, '04c7cO85KFEDYEx3y2vauzA', 'controller-scroll-box-characteristic');
// scripts\components\controller\controller-scroll-box-characteristic.js

"use strict";

/**
 * Created by FIRCorp on 16.04.2017.
 */

/**
 * Контроллер скролла характиристик. Производит регулировку элементов бокса харатеристик. Выполняет операции связанные с регулировкой нодов для обеспечения иллюзии вращения барабана куда накручивается/откуда скручивается список характеристик.
 * @class CharacteristicsScrollBoxController
 */
var CharacteristicsScrollBoxController = cc.Class({
    extends: cc.Component,

    properties: {
        nodeCoil: cc.Node, //нод палки
        nodeRoll: cc.Node, //нод блеска
        nodeContent: cc.Node, // нод контента
        bottomPointStartRotation: 281, //нижняя кордина старта поворота
        topPointStartRotation: 361, //верхняя кордина старта поворота
        _interval: 0, //длинна промежутка для сжития паременных
        _startPosContent: null },

    /**
     * Событие на загрузку сцены.
     * @method onLoad
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
    },


    /**
     * Инициализация по запуску элемента
     * @method start
     */
    start: function start() {
        var la = this.nodeContent.getComponent(cc.Layout);
        this._step = la.spacingY;
        this._startPosContent = this.nodeContent.y;
        this._interval = this.topPointStartRotation - this.bottomPointStartRotation;
    },


    /**
     * Обработчик старта тача
     * @method _onTouchStart
     * @param event
     * @private
     */
    _onTouchStart: function _onTouchStart(event) {},


    /**
     * Евент движения скролла. Обрабатывает вращении бокса характеристик.Производит сжатие параметров на интервале
     * @method onMoveScroll
     * @param event
     */
    onMoveScroll: function onMoveScroll(event) {
        var _this = this;

        var currentPointContent = event.getContentPosition();
        var bais = Math.abs(currentPointContent.y - this._startPosContent);
        var vr = 0;
        if (currentPointContent.y > this._startPosContent) {
            this.nodeContent.children.forEach(function (item) {
                var currentPointItem = _this._startPosContent - vr + bais;
                if (currentPointItem > _this.bottomPointStartRotation && currentPointItem < _this.topPointStartRotation) {
                    item.scaleY = _this._getScaleItem(currentPointItem);
                } else {
                    item.scaleY = 1;
                }
                vr += _this._step + item.height;
            });
        }
    },


    /**
     * Возвращает коэффицент сжатия. Который расчитывается на основе промежутка и текущего положения в этом промежутке.
     * @method _getScaleItem
     * @param currentPoint текущее положение параметра по оси ординат
     * @returns {number} коэффицент сжатия для параметра
     * @private
     */
    _getScaleItem: function _getScaleItem(currentPoint) {
        var k = 1 - 100 * (currentPoint - this.bottomPointStartRotation) / this._interval / 100;
        return k > 1 || k < 0 ? 1 : k;
    }
});

cc._RFpop();
},{}],"factory-animal-prefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'da12cCPbmFOSaLOZet/rlBG', 'factory-animal-prefab');
// scripts\components\factory-animal-prefab\factory-animal-prefab.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var FactoryAnimalPrefab = cc.Class({
    extends: cc.Component,

    properties: {
        _targetAnimal: cc.Node,
        wayToPrefab: 'prefabs/animal/LionSheath',
        wayToModel: './model', //Путь до модели
        nameAnimal: 'animal' },

    /**
     * Создает животное
     * @param {cc.Event} event
     */
    createAnimal: function createAnimal(event) {
        //  cc.log(event);
        // let pointTouch = event.getStartLocation();
        this._createPrefab();
    },


    /**
     * Создает префаб в нужном контенте
     * @see {string} wayToPrefab путь до префаба
     */
    _createPrefab: function _createPrefab() {
        var _this = this;

        cc.loader.loadRes(this.wayToPrefab, function (err, prefab) {
            _this._targetAnimal = cc.instantiate(prefab);

            var myEvent = new cc.Event.EventCustom('createAnimal', true);
            myEvent.detail = {
                animal: _this._settingsAnimal(_this._targetAnimal),
                puthToModel: _this.wayToModel
            };
            _this.node.dispatchEvent(myEvent);
        });
    },


    /**
     *
     * @param nodeAnimal
     * @returns {*}
     * @private
     */
    _settingsAnimal: function _settingsAnimal(nodeAnimal) {
        nodeAnimal.name = this.nameAnimal;

        return nodeAnimal;
    }
});

exports.FactoryAnimalPrefab = FactoryAnimalPrefab;

cc._RFpop();
},{}],"list":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0d138D7piRNwKyrESSWEncS', 'list');
// scripts\components\circular-list\list.js

'use strict';

var _circularList = require('./circular-list');

/**
 * Лист меню животного.
 * @class List
 */
cc.Class({
    extends: cc.Component,

    properties: {
        manager: _circularList.CircularList, //ссылка на ядро вращения
        nameEvent: 'voiceAnimal', //имя события которое вызывает эта кнопка
        maxBiasTouch: 15, //максимальное смещение тача для нажатия по элементу меню (px)
        _pointTouchForMenu: cc.v2 },

    /**
     * Инициализация листа меню животного.
     * @method onLoad
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd.bind(this));
    },


    /**
     * Обработчик старта нажатия на лист.
     * @method _onTouchStart
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchStart: function _onTouchStart(event) {
        this._pointTouchForMenu = event.getLocation();
        event.stopPropagation();
    },


    /**
     * Обработчик отпускания тача от листа.
     * @method _onTouchEnd
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchEnd: function _onTouchEnd(event) {
        var point = event.getLocation();
        var X = Math.abs(this._pointTouchForMenu.x - point.x) < this.maxBiasTouch;
        var Y = Math.abs(this._pointTouchForMenu.y - point.y) < this.maxBiasTouch;
        if (X && Y) {
            this._publishEvent();
        }
        event.stopPropagation();
    },


    /**
     * Публикует событие свзанное с этим листом.
     * @method _publishEvent
     * @private
     */
    _publishEvent: function _publishEvent() {
        var myEvent = new cc.Event.EventCustom(this.nameEvent, true);
        myEvent.detail = {
            animal: this.manager.parent
        };
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обработчик движения тача.
     * @method _onTouchMove
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchMove: function _onTouchMove(event) {
        var point = event.touch.getPreviousLocation();
        var delta = event.touch.getDelta();
        this.manager.directionRotation(delta.x, delta.y, point.x, point.y);
        event.stopPropagation();
    }
});

cc._RFpop();
},{"./circular-list":"circular-list"}],"play":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5472eW0A6xObaFu8KPQmp4d', 'play');
// scripts\components\scene\play.js

'use strict';

/**
 * Состояние игры.
 * @type {StatGame}
 * @static
 * @element {number} sleep бездействие.
 * @element {number} openMenu открытие меню игры.
 * @element {number} openMenuAnimal открытие меню животного.
 * @element {number} createAnimal создание животного.
 * @element {number} moveMap движение карты пользователем.
 */
var StatGame = {
    sleep: 0,
    openMenu: 1,
    openMenuAnimal: 2,
    createAnimal: 3,
    moveMap: 4
};

/**
 * Управляет представлнием.
 * @class Play
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nodeWindow: cc.Node, //окно игры
        nodeBoxCreateAnimal: cc.Node, //всплывающий бокс с животными
        nodeBoxCharacteristicsAnimal: cc.Node, //всплывающий бокс с характеристиками животного
        nodeBasket: cc.Node, //корзина для удаления животного
        nodeFieldAnimals: cc.Node, //поле жизнедеятельности животных
        nodeBoxMap: cc.Node, //бокс с картой
        nodeMap: cc.Node, //поле карты
        nodeMenu: cc.Node, //поле меню игры
        nodeMenuAnimal: cc.Node, //нод меню животного
        nodeMaskCreatedAnimal: cc.Node, //маска для создания животных

        prefabParametrCharacteristics: cc.Prefab, //префаб характеристики

        colorTextCharacteristics: cc.Color, //цвет текста у характеристик

        _targetAnimal: cc.Node, //нод животного в таргете
        _pointTargetAnimal: cc.v2, //точка назначения животного в таргете
        _targetControllerAnimal: cc.Node, //контроллер животного в таргете
        _centreWindowPoint: null },

    /**
     * Инициализация конроллера представления.
     * @method onLoad
     */
    onLoad: function onLoad() {
        this._init();
        //cd this.p=new Promise((a,b)=>{});
        this.node.on('createAnimal', this.onAnimalCreated.bind(this));
        this.node.on('openBoxFromAnimal', this.onOpenBoxFromAnimal.bind(this));
        this.node.on('closeBoxFromAnimal', this.onCloseBoxFromAnimal.bind(this));
        this.node.on('openBoxMenuPlay', this.onOpenBoxMenuPlay.bind(this));
        this.node.on('closeBoxMenuPlay', this.onCloseBoxMenuPlay.bind(this));

        this.node.on('openBoxFromCharacteristicsAnimal', this.onOpenBoxFromCharacteristicsAnimal.bind(this));
        this.node.on('closeBoxFromCharacteristicsAnimal', this.onCloseBoxFromCharacteristicsAnimal.bind(this));
        this.node.on('startDragAndDropAnimal', this.onStartDragAndDropAnimal.bind(this));
        this.node.on('dragAndDropAnimal', this.onDragAndDropAnimal.bind(this));
        this.node.on('stopDragAndDropAnimal', this.onStopDragAndDropAnimal.bind(this));
        this.node.on('motionAnimal', this.onMotionAnimal.bind(this));
        this.node.on('startMotionAnimal', this.onStartMotionAnimal.bind(this));
        this.node.on('endMotionAnimal', this.onEndMotionAnimal.bind(this));
        this.node.on('openMenuAnimal', this.onOpenMenuAnimal.bind(this));
        this.node.on('closeMenuAnimal', this.onCloseMenuAnimal.bind(this));

        this.node.on('voiceAnimal', this.onVoiceAnimal.bind(this));
        this.node.on('sitAnimal', this.onSitAnimal.bind(this)); //сидеть
        this.node.on('frightenAnimal', this.onFrightenAnimal.bind(this)); //напугать
        this.node.on('arealAnimal', this.onArealAnimal.bind(this)); //показать ареал
        this.node.on('careAnimal', this.onCareAnimal.bind(this)); //Забота, гладить
        this.node.on('lieAnimal', this.onLieAnimal.bind(this)); //Лежать,лечь
        this.node.on('attentionAnimal', this.onAttentionAnimal.bind(this)); //Внимание, готовсь

        this.node.on('basketActive', this.onBasketActive.bind(this));
        this.node.on('basketSleep', this.onBasketSleep.bind(this));
        this.node.on('basketWork', this.onBasketWork.bind(this));

        this.node.on('touchOnMap', this.onTouchOnMap.bind(this));
        this.node.on('touchMoveOnMap', this.onTouchMoveOnMap.bind(this));
        this.node.on('touchEndMoveOnMap', this.onTouchEndMoveOnMap.bind(this));
        this.node.on('finishMoveCameraToAnimal', this.onFinishMoveCameraToAnimal.bind(this));
    },


    /**
     * Инициализация данных.
     * @method _init
     * @private
     */
    _init: function _init() {

        this._stateGame = StatGame.sleep;

        this._targetSizeWith = 0; //временные размеры ширины животного в таргете. Для сохранения
        this._targetSizeHeight = 0; //временные размеры высоты животного в таргете. Для сохранения

        this._pointTargetAnimal = cc.v2(0, 0); //точка назначения животного в таргет
        this._targetAnimal = null; //нод животного в таргете
        this._controllerAnimal = null; //контроллер животного (только 1 того что в таргете)
        this._centreWindowPoint = cc.v2(this.node.width / 2, this.node.height / 2);
        this._controllerCircularMenu = this.nodeMenuAnimal.getComponent('circular-list-actions-animal');
        this._boxCreateAnimal = this.nodeBoxCreateAnimal.getComponent('box-create-animal');
        this._boxCharacteristicsAnimal = this.nodeBoxCharacteristicsAnimal.getComponent('box-characteristics-animal');
        this._controllerBasket = this.nodeBasket.getComponent('basket-animal');
        this._controllerMap = this.nodeMap.getComponent('controller-map');
    },


    /**
     * Бокс с животными закрылся.
     * @method onCloseBoxFromAnimal
     * @param {cc.Event} event
     */
    onCloseBoxFromAnimal: function onCloseBoxFromAnimal(event) {

        cc.log('закрылся BoxFromAnimal');
        if (this._stateGame != StatGame.createAnimal) {
            this.nodeMaskCreatedAnimal.active = false;
        }
    },


    /**
     * Бокс с животными открылся.
     * @method onOpenBoxFromAnimal
     * @param {cc.Event} event
     */
    onOpenBoxFromAnimal: function onOpenBoxFromAnimal(event) {

        cc.log('открылся BoxFromAnimal');
        this.nodeMaskCreatedAnimal.active = true; //активировали маску
        this.nodeMaskCreatedAnimal.setPosition(this._centreWindowPoint);
        if (this._controllerAnimal !== null) this._controllerAnimal.closeMenu();
    },


    /**
     * Меню открылось.
     * @method onOpenBoxMenuPlay
     * @param {cc.Event} event
     */
    onOpenBoxMenuPlay: function onOpenBoxMenuPlay(event) {

        cc.log('открылось меню');
        this.nodeMenu.active = true;
    },


    /**
     * Меню закрылось.
     * @method onCloseBoxMenuPlay
     * @param {cc.Event} event
     */
    onCloseBoxMenuPlay: function onCloseBoxMenuPlay(event) {

        cc.log('закрылось меню');
        this.nodeMenu.active = false;
    },


    /**
     * Создание животного.
     * Отвечает за размещение животного в дереве нодов.
     * @method onAnimalCreated
     * @param {cc.Event} event
     */
    onAnimalCreated: function onAnimalCreated(event) {
        this._stateGame = StatGame.createAnimal;
        cc.log('создание нового животного');
        event.detail.animal.parent = this.nodeFieldAnimals.parent; // подцепить животное к карте
        var point = this._controllerMap.getPointMap(cc.v2(this.node.width / 2, this.node.height / 2)); //вычислить координаты на карте
        event.detail.animal.setPosition(point.x, point.y); //Установить координаты животного
        this._targetPuthToModel = event.detail.puthToModel; //Сохранить путь до модели. используется при создании модели

        this._boxCreateAnimal.closeBox(); //закрыть бокс с животными
        this._boxCreateAnimal.onBlock(); //заблокировать бокс сживотными
        this._controllerBasket.on(); //Включить корзину
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false; //заблокировать карту

        //Необходимо закрыть все что связано с прошлым фокусом
        if (this._targetAnimal != null) {

            this._controllerAnimal.closeMenu(); //закрывает меню
            this._boxCharacteristicsAnimal.closeBox(); //закрыть бокс с характеристиками
            this._targetAnimal = null; //обнуляет ссылку на нод животного в фокусе
        }
    },


    /**
     * Перетаскивание животного началось.
     * @method onStartDragAndDropAnimal
     * @param {cc.Event} event
     */
    onStartDragAndDropAnimal: function onStartDragAndDropAnimal(event) {

        cc.log('запуск анимации подвешенности (старт перетаскивания)');
        this._targetAnimal = event.detail.animal; //Берем нод животного в фокус
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false; //заблокировать движение карты

    },


    /**
     * Перетаскивание нового животного.
     * Отвечает за перемещение нода животного по карте после создания и производит замеры до различных объектов на карте.
     * @method onDragAndDropAnimal
     * @param {cc.Event} event
     */
    onDragAndDropAnimal: function onDragAndDropAnimal(event) {

        cc.log('сообщаем корзине положение зверюшки (перетаскивание)');
        var point = this._controllerMap.getPointWindow(event.detail.point);
        this._controllerBasket.setPositionAnimal(point);
        this.nodeMaskCreatedAnimal.setPosition(point);
    },


    /**
     * Перетаскивание животного завершилось.
     * @method onStopDragAndDropAnimal
     * @param {cc.Event} event
     */
    onStopDragAndDropAnimal: function onStopDragAndDropAnimal(event) {

        cc.log('определение дальнейших действий с животным (завершение перетаскивание)');
        var point = this._controllerMap.getPointWindow(event.detail.point); //Запрашиваем точку в формате координаты окна

        if (this._controllerBasket.isAnimalLife(point)) {

            var nodeModel = cc.instantiate(this._targetAnimal.children[0]); //создаем нод животного
            nodeModel.parent = this.nodeFieldAnimals; //Вешаем нод животного на нод со всеми животными
            nodeModel.setPosition(event.detail.point.x, event.detail.point.y); //Устанавливаем позицию на карте
            nodeModel.addComponent('controller-animal'); //Добавляем контроллер телу животного
            nodeModel.getComponent('controller-animal').settings({
                puthToModel: this._targetPuthToModel,
                id: this.nodeFieldAnimals.children.length - 1
            }); //Настраивам контроллер животного
            nodeModel.getComponent('controller-animal').run(); //Запускает жизнь животного
            this._controllerBasket.onBadWorkBasket(); //Дать команду корзине(не сейчас)
        } else {
            this._controllerBasket.onGoodWorkBasket(); //Дать команду корзине(работать)
        }

        this._targetAnimal.destroy(); //Удалить временный нод животного
        this._controllerBasket.off(); //вырубить корзину
        this._boxCreateAnimal.offBlock(); //вырубить блокировку нижнего бокса
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true; //разблокировать движение карты

        this._targetAnimal = null; //обнулить  животное в таргете
        this._targetPuthToModel = null; //обнулить путь до модели животного
        this.nodeMaskCreatedAnimal.active = false;
        this._stateGame = StatGame.sleep;
    },


    /**
     * Начало движения животного.
     * @method onStartMotionAnimal
     * @param {cc.Event} event
     */
    onStartMotionAnimal: function onStartMotionAnimal(event) {
        //Закрываю меню иинформацию о животном если переключаюсь на другое животное
        if (this._targetAnimal != null && this._targetAnimal._model.id != event.detail.controller._model.id) {
            this._controllerAnimal.closeMenu(); //закрыть меню
        }

        cc.log('начинаю двигаться за пользователем(Начинаю выюор двигаться или открыть меню)');
        var point = this._controllerMap.getPointMap(event.detail.startMotion); //конвертируем точку окна к точку карты

        this._pointTargetAnimal = cc.v2(point.x, point.y); // задаем точку куда надо доставить животне
        this._controllerAnimal = event.detail.controller; //получаем контроллер животного в таргете
        this._targetAnimal = event.detail.controller; //установили нод животного на фокус

        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false; //заблокировать карту

        //увеличим поле отклика животного
        this._targetSizeWith = this._targetAnimal.node.width;
        this._targetSizeHeight = this._targetAnimal.node.height;
    },


    /**
     * Движение животного за ведущим.
     * @method onMotionAnimal
     * @param {cc.Event} event
     */
    onMotionAnimal: function onMotionAnimal(event) {
        //обработка событий с животным во время движения
        cc.log('двигаюсь за пользователем');
        //увеличим поле отклика животного
        this._targetAnimal.node.width = 2000;
        this._targetAnimal.node.height = 2000;
        var point = this._controllerMap.getPointMap(event.detail.pointEnd); // конвертируем точку окна к точке карты
        this._pointTargetAnimal = cc.v2(point.x, point.y); // вычисляем точку куда пойдет животное в итоге
        this._targetAnimal.moveToPoint(this._pointTargetAnimal);
    },


    /**
     * Окончание движения животного.
     * @method onEndMotionAnimal
     * @param {cc.Event} event
     */
    onEndMotionAnimal: function onEndMotionAnimal(event) {
        cc.log('заканчиваю двигаться за пользователем');

        //уменьшаем площадь покрытия животного
        this._targetAnimal.node.width = this._targetSizeWith;
        this._targetAnimal.node.height = this._targetSizeHeight;

        var point = this._controllerMap.getPointMap(event.detail.pointEnd); // конвертируем точку окна к точке карты
        this._pointTargetAnimal = cc.v2(point.x, point.y); // вычисляем точку куда пойдет животное в итоге
        //сообщаем модели точку до которой необходимо ей дойти
        this._targetAnimal.moveToPoint(this._pointTargetAnimal);
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true; // Разблокировали карту
    },


    /**
     * Меню животного открыто.
     * @method onOpenMenuAnimal
     * @param {cc.Event} event
     */
    onOpenMenuAnimal: function onOpenMenuAnimal(event) {
        cc.log('Открываю меню животного');
        //Центрировать животное
        var point = cc.v2(this._targetAnimal.node.x - this._centreWindowPoint.x, this._targetAnimal.node.y - this._centreWindowPoint.y);

        this._controllerMap.moveActions(point, 0.25); //переместить центр камеры на эту точку за 0.25 секунды

        //Устанавливаем настройки для меню
        this._controllerCircularMenu.settings(this._controllerAnimal);

        //заполнить бокс характеристик,,,

        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false; //заблокировать карту
        this._stateGame = StatGame.openMenu;
    },


    /**
     * Меню животного закрыто.
     * @method onCloseMenuAnimal
     * @param {cc.Event} event
     */
    onCloseMenuAnimal: function onCloseMenuAnimal(event) {

        cc.log('Закрываю меню животного');
        this.nodeMenuAnimal.active = false;
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true; //разблокировать карту
        this._boxCharacteristicsAnimal.closeBox();
        this._targetAnimal = null;
        this._stateGame = StatGame.sleep;
    },


    /**
     * Животное издало звук.
     * @method onVoiceAnimal
     * @param {cc.Event} event
     */
    onVoiceAnimal: function onVoiceAnimal(event) {
        cc.log('животное проявило голос');
        this._controllerAnimal.runVoice();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное село
     * @method onSitAnimal
     * @param {cc.Event} event
     */
    onSitAnimal: function onSitAnimal(event) {
        cc.log('животное село');
        this._controllerAnimal.runSit();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное испугалось
     * @method onFrightenAnimal
     * @param {cc.Event} event
     */
    onFrightenAnimal: function onFrightenAnimal(event) {
        cc.log('животное испугалось');
        this._controllerAnimal.runFrighten();
        this._controllerAnimal.closeMenu();
    },


    /**
     * ареалы чувств
     * @method onArealAnimal
     * @param {cc.Event} event
     */
    onArealAnimal: function onArealAnimal(event) {
        cc.log('животное показало свой ареал');
        this._controllerAnimal.runAreal();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное погладили,пожалели
     * @method onCareAnimal
     * @param {cc.Event} event
     */
    onCareAnimal: function onCareAnimal(event) {
        cc.log('животное погладили');
        this._controllerAnimal.runCare();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное легло
     * @method onLieAnimal
     * @param {cc.Event} event
     */
    onLieAnimal: function onLieAnimal(event) {
        cc.log('животное легло');
        this._controllerAnimal.runLie();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное приготовилось
     * @method onAttentionAnimal
     * @param {cc.Event} event
     */
    onAttentionAnimal: function onAttentionAnimal(event) {
        cc.log('животное приготовилось');
        this._controllerAnimal.runAttention();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Бокс характристик животного открылся.
     * @method onOpenBoxFromCharacteristicsAnimal
     * @param {cc.Event} event
     */
    onOpenBoxFromCharacteristicsAnimal: function onOpenBoxFromCharacteristicsAnimal(event) {

        cc.log('открылся BoxFromCharacteristicsAnimal');
        this._boxCreateAnimal.closeBox();
        //заполняет характеристики
        var mass = this._controllerAnimal.getCharacteristics();
        var content = this._boxCharacteristicsAnimal.content;

        var nodeParam = void 0;
        //чистим предыдущие записи
        content.children.forEach(function (item) {
            item.destroy();
        });

        //Начинаем заполнение
        nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
        nodeParam.removeAllChildren();
        nodeParam.addComponent(cc.Label).string = mass.name;
        nodeParam.color = this.colorTextCharacteristics;
        content.addChild(nodeParam);

        nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
        nodeParam.removeAllChildren();
        nodeParam.addComponent(cc.Label).string = mass.currentState;
        nodeParam.color = this.colorTextCharacteristics;
        content.addChild(nodeParam);

        var vr = void 0; //временная переменная узлов
        //заполняем характеристики
        if (mass.param.length != 0) {
            for (var i = 0; i < mass.param.length; i++) {
                nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
                content.addChild(nodeParam);
                nodeParam.x = 0;
                vr = nodeParam.getChildByName('name');
                vr.getComponent(cc.Label).string = mass.param[i].name;
                vr.color = this.colorTextCharacteristics;
                vr = nodeParam.getChildByName('value');
                vr.getComponent(cc.Label).string = mass.param[i].value.toString() + mass.param[i].unit;
                vr.color = this.colorTextCharacteristics;
            }
        }
    },


    /**
     * Бокс характеристик животного закрылся.
     * @method onCloseBoxFromCharacteristicsAnimal
     * @param {cc.Event} event
     */
    onCloseBoxFromCharacteristicsAnimal: function onCloseBoxFromCharacteristicsAnimal(event) {

        cc.log('закрылся BoxFromCharacteristicsAnimal');
    },


    /**
     * Корзина перешла в событие активного предвкушения.
     * @method onBasketActive
     * @param {cc.Event} event
     */
    onBasketActive: function onBasketActive(event) {

        cc.log('корзина проявляет активность');
    },


    /**
     * Корзина перешла в режим сна.
     * @method onBasketSleep
     * @param {cc.Event} event
     */
    onBasketSleep: function onBasketSleep(event) {

        cc.log('корзина спит');
    },


    /**
     * Корзина перешла в режим работы (Вот вот сбросят животное).
     * @method onBasketWork
     * @param {cc.Event} event
     */
    onBasketWork: function onBasketWork(event) {

        cc.log('корзина надеется что вот вот в нее попадет животное');
    },


    /**
     * Событие начала работы с картой.
     * @method onTouchOnMap
     * @param {cc.Event} event
     */
    onTouchOnMap: function onTouchOnMap(event) {

        cc.log('Начал работу с картой');
    },


    /**
     * Событие движения карты.
     * @method onTouchMoveOnMap
     * @param {cc.Event} event
     */
    onTouchMoveOnMap: function onTouchMoveOnMap(event) {

        cc.log('Двигает карту');
    },


    /**
     * Событие завершения работы с картой.
     * @method onTouchEndMoveOnMap
     * @param {cc.Event} event
     */
    onTouchEndMoveOnMap: function onTouchEndMoveOnMap(event) {

        if (this._stateGame === StatGame.sleep) {
            cc.log('завершил работу с картой');
        }
    },


    /**
     * Наведение центра камеры на животное завершилось.
     * @method onFinishMoveCameraToAnimal
     * @param {cc.Event} event
     */
    onFinishMoveCameraToAnimal: function onFinishMoveCameraToAnimal(event) {
        this.nodeMenuAnimal.active = true;
        this.nodeMenuAnimal.setPosition(this._centreWindowPoint.x, this._centreWindowPoint.y);
        this._boxCharacteristicsAnimal.openBox();
    }
});

cc._RFpop();
},{}]},{},["build-ts","basket-animal","box-characteristics-animal","box-create-animal","box-menu-play","box","circular-list-actions-animal","circular-list","list","controller-animal","controller-create-animal","controller-map","controller-menu-play","controller-scroll-box-characteristic","factory-animal-prefab","play"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvYmFza2V0cy9iYXNrZXQtYW5pbWFsLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9ib3hlcy9ib3gtY2hhcmFjdGVyaXN0aWNzLWFuaW1hbC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvYm94ZXMvYm94LWNyZWF0ZS1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2JveGVzL2JveC1tZW51LXBsYXkuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2JveGVzL2JveC1zYW1wbGVzL2JveC5qcyIsImFzc2V0cy9zY3JpcHRzL2J1aWxkL2J1aWxkLXRzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9jaXJjdWxhci1saXN0L2NpcmN1bGFyLWxpc3QtYWN0aW9ucy1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NpcmN1bGFyLWxpc3QvY2lyY3VsYXItbGlzdC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLWFuaW1hbC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLWNyZWF0ZS1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1tYXAuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1tZW51LXBsYXkuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1zY3JvbGwtYm94LWNoYXJhY3RlcmlzdGljLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9mYWN0b3J5LWFuaW1hbC1wcmVmYWIvZmFjdG9yeS1hbmltYWwtcHJlZmFiLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9jaXJjdWxhci1saXN0L2xpc3QuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL3NjZW5lL3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7OztBQVFBOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFIZ0I7O0FBTXBCOzs7OztBQUtBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFJSjs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUdEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7OztBQU9BO0FBQTZCOztBQUN6QjtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNBO0FBQ0o7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0E7QUFGb0I7QUFJeEI7QUFDSTtBQUNBO0FBRmtCO0FBSXRCO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0E7QUFGb0I7QUFJeEI7QUFDSTtBQUNBO0FBRmtCO0FBSXRCO0FBQ0k7QUFDQTtBQUZzQjs7QUFLMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0M7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQXlCO0FBQ3JCO0FBQ0E7QUFDSDtBQUNEO0FBQXdCO0FBQ3BCO0FBQ0E7QUFDSDtBQUNEO0FBQXVCO0FBQ25CO0FBQ0E7QUFDSDtBQVpMO0FBY0g7QUFDSjtBQXhMSTs7Ozs7Ozs7OztBQ3ZCVDs7QUFDQTs7OztBQUlBO0FBQ0k7O0FBRUE7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUQ7OztBQUlBOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7QUEvQ21DOzs7Ozs7Ozs7O0FDTHhDOztBQUVBOzs7O0FBSUE7QUFDSTs7QUFFQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDSDtBQTVDMEI7Ozs7Ozs7Ozs7QUNIL0I7O0FBQ0E7Ozs7QUFJQTtBQUNJOztBQUVBOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVEOzs7QUFJQTs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFHRDs7OztBQUlBO0FBQ0k7QUFDSDtBQXhEc0I7Ozs7Ozs7Ozs7Ozs7OztBQ1IzQjs7Ozs7OztBQU9BOzs7O0FBSUE7QUFDSTtBQUNBO0FBRmE7O0FBS2pCOzs7Ozs7Ozs7QUFTQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFKWTtBQU1oQjs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFRDtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTs7O0FBSUE7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNLO0FBQ0o7QUFDSTtBQUNKO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFHSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0Q7QUFDSDtBQTlQYzs7Ozs7Ozs7Ozs7Ozs7QUN2Q25CO0FBQ0k7QUFDNkQ7QUFBa0I7QUFDekQ7QUFBaUI7QUFBakI7QUFBd0Q7QUFDOUU7QUFDSTtBQUNBO0FBQWdCO0FBQXVCO0FBQ3ZDO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFFQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZnRDtBQVlwRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVm1EO0FBWXZEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWa0Q7QUFZdEQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUm9EO0FBVXhEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJvRDtBQVV4RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSMEM7QUFVOUM7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjRDO0FBVWhEO0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBRVE7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSjtBQUNJO0FBQ0E7QUFDQTtBQUhHO0FBS1Y7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJ5RDtBQVU3RDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJ5RDtBQVU3RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSa0Q7QUFVdEQ7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUitEO0FBVW5FO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVIrRDtBQVVuRTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSdUQ7QUFVM0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVI0QztBQVVoRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQVQyQztBQVcvQztBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQVQyQztBQVcvQztBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQVQrQztBQVduRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQVQrQztBQVduRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSNEM7QUFVaEQ7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSNEQ7QUFVaEU7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjJEO0FBVS9EO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFGTztBQUlYO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFBOEI7QUFBb0I7QUFDbEQ7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUF5QjtBQUFjO0FBQ3ZDO0FBQTZCO0FBQW9CO0FBQ2pEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBeUI7QUFBYztBQUN2QztBQUE2QjtBQUFvQjtBQUNqRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFBb0Q7QUFBc0Q7QUFDMUc7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQXlCO0FBQWM7QUFDdkM7QUFBNkI7QUFBb0I7QUFDakQ7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUFvRDtBQUF5QztBQUM3RjtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQThCO0FBQXFCO0FBQ25EO0FBQTZCO0FBQXFCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBNkI7QUFBcUI7QUFDbEQ7QUFBOEI7QUFBcUI7QUFDbkQ7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBNkI7QUFBcUI7QUFDbEQ7QUFBOEI7QUFBcUI7QUFDbkQ7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQTZCO0FBQXFCO0FBQ2xEO0FBQThCO0FBQXFCO0FBQ25EO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUE2QjtBQUFxQjtBQUNsRDtBQUE4QjtBQUFxQjtBQUNuRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUE4QjtBQUFxQjtBQUNuRDtBQUF5QjtBQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUE2QjtBQUFxQjtBQUNsRDtBQUE4QjtBQUFxQjtBQUNuRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZzRDtBQVkxRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVnFEO0FBWXpEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVitDO0FBWW5EO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWZ0Q7QUFZcEQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFUc0Q7QUFXMUQ7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWc0Q7QUFZMUQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZ3RDtBQVk1RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVnlEO0FBWTdEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWdUQ7QUFZM0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZ1RDtBQVkzRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBRUE7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQWQwQztBQWdCOUM7QUFDSTtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWbUQ7QUFZdkQ7QUFDSTtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWK0M7QUFZbkQ7QUFDSTtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWOEM7QUFZbEQ7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUVRO0FBQ0E7QUFGSjtBQVNJO0FBQ0E7QUFGSjtBQVFJO0FBQ0E7QUFGSjtBQVdKO0FBRVE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEk7QUFIWjtBQVlJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMSTtBQUhaO0FBWUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEk7QUFIWjtBQVlJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMSTtBQUhaO0FBWUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSjtBQUVRO0FBQ0E7QUFFUTtBQUNBO0FBQ0E7QUFDQTtBQUpKO0FBSFI7QUFlSTtBQUNBO0FBRVE7QUFDQTtBQUNBO0FBQ0E7QUFKSjtBQUhSO0FBZUo7QUFDSTtBQUVRO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUo7QUFFUTtBQUNBO0FBRVE7QUFDQTtBQUZKO0FBS0k7QUFDQTtBQUZKO0FBS0k7QUFDQTtBQUZKO0FBWFI7QUFrQkk7QUFDQTtBQUVRO0FBQ0E7QUFGSjtBQUtJO0FBQ0E7QUFGSjtBQVBSO0FBY0k7QUFDQTtBQUVRO0FBQ0E7QUFGSjtBQUtJO0FBQ0E7QUFGSjtBQUtJO0FBQ0E7QUFGSjtBQVhSO0FBdERBO0FBMUlEO0FBb05YOzs7Ozs7Ozs7Ozs7Ozs7QUMxa0RBOztBQUVBOzs7OztBQUtBO0FBQ0k7O0FBRUE7Ozs7O0FBS0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7O0FBRUQ7QUFDSDtBQW5Cb0M7Ozs7Ozs7Ozs7Ozs7OztBQ1B6Qzs7Ozs7OztBQU9BO0FBQ0k7QUFDQTs7QUFHSjs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHSjs7OztBQUlBO0FBQ0k7QUFDQTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQXFCOztBQUNqQjtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNIO0FBQ0o7OztBQUVEOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7QUFDRztBQUNIOztBQUVEOztBQUVBO0FBQ0k7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7QUFLQTtBQUF5Qjs7QUFDckI7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7OztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUE7QUFDSjtBQUNKOzs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQXVCOztBQUNuQjtBQUNJO0FBQ0g7QUFDSjs7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQXRQdUI7Ozs7Ozs7Ozs7OztBQ2hCNUI7O0FBQ0E7OztBQUdBO0FBQ0k7O0FBRUE7QUFDSTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBR0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUdEOzs7QUFHQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDQTtBQUNIO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQztBQUVKOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFEYTtBQUdqQjtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFEYTtBQUdqQjtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNIOzs7QUFFRDs7O0FBR0E7OztBQUlBOzs7QUFHQTs7O0FBSUE7OztBQUdBOzs7QUFJQTs7O0FBR0E7OztBQUlBOzs7QUFHQTs7O0FBSUE7OztBQUdBOzs7QUFJQTs7O0FBR0E7OztBQUlBOzs7O0FBSUE7QUFDSTtBQUNIO0FBek9JOzs7Ozs7Ozs7O0FDSlQ7QUFDSTs7QUFFQTs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSTtBQURhO0FBR2pCO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQURhO0FBR2pCO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSTtBQURhO0FBR2pCOztBQUVBO0FBQ0g7QUFyREk7Ozs7Ozs7Ozs7QUNBVDs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUdKOztBQUVJO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNDO0FBQ0o7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDRjtBQUNNO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNMO0FBQ0M7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUFxQjs7QUFDakI7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFBNEI7O0FBQ3hCO0FBQ0E7QUFDQTtBQUdIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFwSkk7Ozs7Ozs7Ozs7QUNKVDs7O0FBR0E7QUFDSTs7QUFFQTs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTs7O0FBSUE7Ozs7QUFJQTs7O0FBSUE7Ozs7QUFJQTtBQWhDSzs7Ozs7Ozs7OztBQ0hUOzs7O0FBSUE7Ozs7QUFJQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7OztBQUlBOzs7OztBQUtBO0FBQW1COztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjs7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0E7QUFDSDtBQTNFNkM7Ozs7Ozs7Ozs7Ozs7QUNSbEQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUdKOzs7O0FBSUE7QUFDRTtBQUNDO0FBQ0M7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUFnQjs7QUFDWjtBQUNJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFJakI7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTs7QUFFQTtBQUNIO0FBL0M4Qjs7Ozs7Ozs7Ozs7O0FDQW5DOztBQUVBOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUdKOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDSTtBQURhO0FBR2pCO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUF2RUk7Ozs7Ozs7Ozs7QUNIVDs7Ozs7Ozs7OztBQVVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxhOztBQVFqQjs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFHSjs7OztBQUlBO0FBQ0k7QUFDRDtBQUNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBOztBQUdJOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBRUo7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBRUg7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFFSDtBQUNKOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0E7O0FBR0g7OztBQUVEOzs7Ozs7QUFNQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBOztBQUVBOztBQUdJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmlEO0FBSXJEO0FBQ0E7QUFFSDtBQUNHO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBRUg7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBRUg7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0g7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBRUg7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBRUg7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0g7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0k7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBamlCSSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBFbnVtINGB0L7RgdGC0L7Rj9C90LjQuSDQutC+0YDQt9C40L3Riy5cclxuICogQHR5cGVkZWYge09iamVjdH0gU3RhdGVCYXNrZXRcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNsZWVwINC60L7RgNC30LjQvdCwINC/0YDQvtGB0YLQviDQvtGC0LrRgNGL0YLQsC5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGFjdGl2ZSDRh9GD0LLRgdGC0LLRg9C10YIg0YfRgtC+INC20LjQstC+0YLQvdC+0LUg0LPQtNC1LdGC0L4g0YDRj9C00L7QvC5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHdvcmsg0YDQsNCx0L7RgtCw0LXRgiDRgSDQv9C+0L/QsNCy0YjQuNC80YHRjyDQttC40LLQvtGC0L3Ri9C8LlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQotC40L/RiyDRgdC+0YHRgtC+0Y/QvdC40Lkg0LrQvtGA0LfQuNC90YsuXHJcbiAqIEB0eXBlIHtTdGF0ZUJhc2tldH1cclxuICovXHJcbmNvbnN0IFN0YXRlQmFza2V0ID0ge1xyXG4gICAgc2xlZXA6IDAsXHJcbiAgICBhY3RpdmU6IDEsXHJcbiAgICB3b3JrOiAyLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqINCe0YHRg9GJ0LXRgdGC0LLQu9GP0LXRgiDRgNCw0LHQvtGC0YMg0YEg0LrQvtGA0LfQuNC90L7QuSxcclxuICog0JDQvdC40LzQsNGG0LjQuCwg0YfQsNGB0YLQuNGG0Ysg0Lgg0L/RgNC+0YfQtdC1LlxyXG4gKiBAY2xhc3MgYmFza2V0LWFuaW1hbFxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfbGVmdFBvaW50Qm90dG9tOiBudWxsLC8v0LvQtdCy0LDRjyDQvdC40LbQvdGP0Y8g0YLQvtGH0LrQsCDQvtCx0LvQsNGB0YLQuCDQv9C+0LPQu9Cw0YnQtdC90LjRjyDQttC40LLQvtGC0L3Ri9GFXHJcbiAgICAgICAgX3JpZ2h0UG9pbnRUb3A6IG51bGwsLy/Qv9GA0LDQstCw0Y8g0LLQtdGA0YXQvdGP0Y/RgtC+0YfQutCwINC+0LHQu9Cw0YHRgtC4INC/0L7Qs9C70LDRidC10L3QuNGPINC20LjQstC+0YLQvdGL0YVcclxuICAgICAgICBfY2VudHJlUG9pbnRCYXNrZXQ6IG51bGwsLy/RhtC10L3RgtGA0LDQu9GM0L3QsNGPINGC0L7Rh9C60LAg0L7QsdC70LDRgdGC0Lgg0L/QvtCz0LvQsNGJ0LXQvdC40Y9cclxuICAgICAgICBfc3RhdGVCYXNrZXQ6IG51bGwsLy/RgdC+0YHRgtC+0Y/QvdC40LUg0LrQvtGA0LfQuNC90YtcclxuXHJcbiAgICAgICAgYW50aWNpcGF0aW9uOiAxNTAsLy/RgNCw0YHRgdGC0L7Rj9C90LjQtSDQtNC70Y8g0L/RgNC40L3Rj9GC0LjRjyDRgdC+0YHRgtC+0Y/QvdC40Lkg0LLQt9Cy0L7Qu9C90L7QstCw0L3QvdC+0YHRgtC4XHJcbiAgICAgICAgb3BhY2l0eU9uOiAyNTUsLy/Qv9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0Log0LrQvtGC0L7RgNC+0Lkg0YHRgtGA0LXQvNC40YLRgdGPINC/0YDQuCDQstC60LvRjtGH0LXQvdC40LhcclxuICAgICAgICBvcGFjaXR5T2ZmOiAxMCwgLy/Qv9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0Log0LrQvtGC0L7RgNC+0Lkg0YHRgtC10LzQuNGC0YHRjyDQv9C+0YHQu9C1INCy0YvQutC70Y7Rh9C10L3QuNGPXHJcbiAgICAgICAgdGltZTogMSwvL9Cy0YDQtdC80Y8g0LfQsCDQutC+0YLQvtGA0L7QtSDQv9GA0L7QuNGB0YXQvtC00LjRgiDQvtGC0LrRgNGL0YLQuNC1INC40LvQuCDQt9Cw0LrRgNGL0YLQuNC1XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC90LXQv9C+0YHRgNC10LTRgdGC0LLQtdC90L3QviDRgdGA0LDQt9GDINC/0L7RgdC70LUg0LfQsNCz0YDRg9C30LrQuCDQutC+0LzQv9C+0L3QtdC90YLQsC5cclxuICAgICAqIEBtZXRob2Qgc3RhcnRcclxuICAgICAqL1xyXG4gICAgc3RhcnQoKXtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c1N0YXR1cyA9IHRoaXMuX3N0YXRlQmFza2V0ID0gU3RhdGVCYXNrZXQuYWN0aXZlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0L7RgNC30LjQvdCwINC30LDQv9GD0YHRgtC40LvQsNGB0YwuINCX0LDQv9GD0YHQutCw0LXRgiDQutC+0YDQt9C40L3RgyjQstC60LvRjtGH0LDQtdGCKVxyXG4gICAgICogQG1ldGhvZCBvblxyXG4gICAgICovXHJcbiAgICBvbigpe1xyXG4gICAgICAgIC8vdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5qb2JXaXRoT3BhY2l0eSh0aGlzLm9wYWNpdHlPbiwgdGhpcy50aW1lKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0LrQu9GO0YfQtdC90LjQtSDQutC+0YDQt9C40L3Riy7QktGL0LrQu9GO0YfQsNC10YIg0LrQvtGA0LfQuNC90YMuXHJcbiAgICAgKiBAbWV0aG9kIG9mZlxyXG4gICAgICovXHJcbiAgICBvZmYoKXtcclxuICAgICAgICB0aGlzLmpvYldpdGhPcGFjaXR5KHRoaXMub3BhY2l0eU9mZiwgdGhpcy50aW1lKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdCw0LrRhtC40Y8g0LrQvtGA0LfQuNC90Ysg0L3QsCDQv9GA0LjQsdC70LjQttCw0Y7RidC10LXRgdGPINC20LjQstC+0YLQvdC+0LUuXHJcbiAgICAgKiBAbWV0aG9kIG9uU3RhdHVzQWN0aXZlQmFza2V0XHJcbiAgICAgKi9cclxuICAgIG9uU3RhdHVzQWN0aXZlQmFza2V0KCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Jhc2tldEFjdGl2ZScsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtGB0YLQvtGP0L3QuNC1INGB0L3QsCDQstC60LvRjtGH0LjQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25TdGF0dXNTbGVlcEJhc2tldFxyXG4gICAgICovXHJcbiAgICBvblN0YXR1c1NsZWVwQmFza2V0KCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Jhc2tldFNsZWVwJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0YHRgtC+0Y/QvdC40LUg0LvQvtCy0LvQuCDQstC60LvRjtGH0LjQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25TdGF0dXNXb3JrQmFza2V0XHJcbiAgICAgKi9cclxuICAgIG9uU3RhdHVzV29ya0Jhc2tldCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdiYXNrZXRXb3JrJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtS0g0LbQuNCy0L7RgtC90L7QtSDQv9C+0LnQvNCw0L3Qvi5cclxuICAgICAqIEBtZXRob2Qgb25Hb29kV29ya0Jhc2tldFxyXG4gICAgICovXHJcbiAgICBvbkdvb2RXb3JrQmFza2V0KCl7XHJcbiAgICAgICAgY2MubG9nKCfQldCwLCDQttC40LLQvtGC0L3QvtC1INC/0L7QudC80LDQvdC+IChiYXNrZXQtYW5pbWFsKScpO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlQmFza2V0ID0gU3RhdGVCYXNrZXQud29yaztcclxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0dXNCYXNrZXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtS0g0LbQuNCy0L7RgtC90L7QtSDQvdC1INC/0L7QudC80LDQvdC+LlxyXG4gICAgICogQG1ldGhvZCBvbkJhZFdvcmtCYXNrZXRcclxuICAgICAqL1xyXG4gICAgb25CYWRXb3JrQmFza2V0KCl7XHJcbiAgICAgICAgY2MubG9nKCfQndGDINCy0L7RgiDQvtC/0Y/RgtGMINC90LjRh9C10LPQviDQvdC10L/QvtC50LzQsNC7IChiYXNrZXQtYW5pbWFsKScpO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlQmFza2V0ID0gU3RhdGVCYXNrZXQuc2xlZXA7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdHVzQmFza2V0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNCx0L7RgtCw0LXRgiDRgSDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0YzRjiDRjdGC0L7QuSDQutC+0YDQt9C40L3Riy4g0J/QvtGB0YLQtdC/0LXQvdC90L4g0L/RgNC40LHQu9C40LbQsNC10YLRgdGPINC6INC/0YDQvtC30YDQsNGH0L3QvtGB0YLQuFxyXG4gICAgICog0LrQvtGA0LfQuNC90Ysg0YDQsNCy0L3QvtC5INC30LDQtNCw0L3QvdC+0LzRgyDQt9C90LDRh9C10L3QuNGOINC30LAg0LfQsNC00LDQvdC+0LUg0LLRgNC10LzRjy5cclxuICAgICAqIEBtZXRob2Qgam9iV2l0aE9wYWNpdHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcGFjaXR5INC90YPQttC90L4g0LTQvtGB0YLQuNGHINGN0YLQvtC5INC/0YDQvtC30YDQsNGH0L3QvtGB0YLQuFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWUg0LfQsCDRgdGC0L7Qu9GM0LrQviDRgdC10LrRg9C90LRcclxuICAgICAqL1xyXG4gICAgam9iV2l0aE9wYWNpdHkob3BhY2l0eSwgdGltZSl7XHJcbiAgICAgICAgbGV0IGludGV2YWxJbmNyZW1lbnRzID0gdGltZSAvIE1hdGguYWJzKHRoaXMubm9kZS5vcGFjaXR5IC0gb3BhY2l0eSk7XHJcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuY2FsbEJhY2tPcGFjaXR5KTtcclxuICAgICAgICB0aGlzLmNhbGxCYWNrT3BhY2l0eSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5vcGFjaXR5ID09PSBvcGFjaXR5KSB7XHJcbiAgICAgICAgICAgICAgICAvL2lmICh0aGlzLm5vZGUub3BhY2l0eSA8IDEyNSkgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuY2FsbEJhY2tPcGFjaXR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAob3BhY2l0eSA+IHRoaXMubm9kZS5vcGFjaXR5KSA/IHRoaXMubm9kZS5vcGFjaXR5ICs9IDEgOiB0aGlzLm5vZGUub3BhY2l0eSAtPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjaGVkdWxlKHRoaXMuY2FsbEJhY2tPcGFjaXR5LCBpbnRldmFsSW5jcmVtZW50cyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCINCx0YPQtNC10YIg0LvQuCDQttC40YLRjCDQttC40LLQvtGC0L3QvtC1INC40LvQuCDQvtC90L4g0LLRi9Cx0YDQvtGI0LXQvdC+INCyINC60L7RgNC30LjQvdGDLlxyXG4gICAgICogQG1ldGhvZCBpc0FuaW1hbExpZmVcclxuICAgICAqIEBwYXJhbSB7Y2MuVmVjMn0gcG9pbnQg0YLQvtGH0LrQsCDQvdCw0YXQvtC20LTQtdC90LjRjyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIC0g0LXRgdC70Lgg0LbQuNCy0L7RgtC90L7QtSDQsdGD0LTQtdGCINC20LjRgtGMXHJcbiAgICAgKi9cclxuICAgIGlzQW5pbWFsTGlmZShwb2ludCl7XHJcbiAgICAgICAgdGhpcy5fbGVmdFBvaW50Qm90dG9tID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLm5vZGUueCAtIHRoaXMubm9kZS53aWR0aCxcclxuICAgICAgICAgICAgeTogdGhpcy5ub2RlLnkgLSB0aGlzLm5vZGUuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9yaWdodFBvaW50VG9wID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLm5vZGUueCArIHRoaXMubm9kZS53aWR0aCxcclxuICAgICAgICAgICAgeTogdGhpcy5ub2RlLnkgKyB0aGlzLm5vZGUuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgWCA9IHBvaW50LnggPiB0aGlzLl9sZWZ0UG9pbnRCb3R0b20ueCAmJiBwb2ludC54IDwgdGhpcy5fcmlnaHRQb2ludFRvcC54O1xyXG4gICAgICAgIGxldCBZID0gcG9pbnQueSA+IHRoaXMuX2xlZnRQb2ludEJvdHRvbS55ICYgcG9pbnQueSA8IHRoaXMuX3JpZ2h0UG9pbnRUb3AueTtcclxuICAgICAgICByZXR1cm4gIShYICYmIFkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QvtCx0YnQsNC10YIg0LrQvtGA0LfQuNC90LUg0L/QvtC30LjRhtC40Y4g0LbQuNCy0L7RgtC90L7Qs9C+INC00LvRjyDQv9GA0LjQvdGP0YLQuNGPINGA0LXRiNC10L3QuNGPINC/0L4g0LLRi9Cx0L7RgNGDINC00LXQudGB0YLQstC40Y8uINCa0L7RgNC30LjQvdCwINC80LXQvdGP0LXRgiDRgdCy0L7QtSDRgdC+0YHRgtC+0Y/QvdC40LVcclxuICAgICAqINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDRgNCw0YHRgdGC0L7Rj9C90LjRjy5cclxuICAgICAqIEBtZXRob2Qgc2V0UG9zaXRpb25BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuVmVjMn0gcG9pbnQg0YLQvtGH0LrQsCDRgtC10LrRg9GJ0LXQs9C+INC80LXRgdGC0L7QvdCw0YXQvtC20LTQtdC90LjRjyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAqL1xyXG4gICAgc2V0UG9zaXRpb25BbmltYWwocG9pbnQpe1xyXG4gICAgICAgIHRoaXMuX2xlZnRQb2ludEJvdHRvbSA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy5ub2RlLnggLSB0aGlzLm5vZGUud2lkdGgsXHJcbiAgICAgICAgICAgIHk6IHRoaXMubm9kZS55IC0gdGhpcy5ub2RlLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fcmlnaHRQb2ludFRvcCA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy5ub2RlLnggKyB0aGlzLm5vZGUud2lkdGgsXHJcbiAgICAgICAgICAgIHk6IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fY2VudHJlUG9pbnRCYXNrZXQgPSB7XHJcbiAgICAgICAgICAgIHg6ICh0aGlzLl9sZWZ0UG9pbnRCb3R0b20ueCArIHRoaXMuX3JpZ2h0UG9pbnRUb3AueCkgLyAyLFxyXG4gICAgICAgICAgICB5OiAodGhpcy5fcmlnaHRQb2ludFRvcC55ICsgdGhpcy5fbGVmdFBvaW50Qm90dG9tLnkpIC8gMlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCB4ID0gKHBvaW50LnggLSB0aGlzLl9jZW50cmVQb2ludEJhc2tldC54KSAqIChwb2ludC54IC0gdGhpcy5fY2VudHJlUG9pbnRCYXNrZXQueCk7XHJcbiAgICAgICAgbGV0IHkgPSAocG9pbnQueSAtIHRoaXMuX2NlbnRyZVBvaW50QmFza2V0LnkpICogKHBvaW50LnkgLSB0aGlzLl9jZW50cmVQb2ludEJhc2tldC55KTtcclxuICAgICAgICBsZXQgc3FydFBvaW50ID0gTWF0aC5zcXJ0KHggKyB5KTtcclxuXHJcbiAgICAgICAgbGV0IGlzViA9IHNxcnRQb2ludCA8IHRoaXMuYW50aWNpcGF0aW9uO1xyXG4gICAgICAgIChpc1YpID8gdGhpcy5fc3RhdGVCYXNrZXQgPSBTdGF0ZUJhc2tldC5hY3RpdmUgOiB0aGlzLl9zdGF0ZUJhc2tldCA9IFN0YXRlQmFza2V0LnNsZWVwO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXR1c0Jhc2tldCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDRgdGC0LDRgtGD0YEg0LrQvtGA0LfQuNC90Ysg0Lgg0LLRi9C30YvQstCw0LXRgiDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC10LUg0LTQtdC50YHRgtCy0LjQtS5cclxuICAgICAqIEBtZXRob2QgX3VwZGF0ZVN0YXR1c0Jhc2tldFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3VwZGF0ZVN0YXR1c0Jhc2tldCgpe1xyXG4gICAgICAgIGlmICh0aGlzLl9wcmV2aW91c1N0YXR1cyAhPSB0aGlzLl9zdGF0ZUJhc2tldCkge1xyXG4gICAgICAgICAgICB0aGlzLl9wcmV2aW91c1N0YXR1cyA9IHRoaXMuX3N0YXRlQmFza2V0O1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuX3N0YXRlQmFza2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlQmFza2V0LmFjdGl2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25TdGF0dXNBY3RpdmVCYXNrZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVCYXNrZXQuc2xlZXA6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU3RhdHVzU2xlZXBCYXNrZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVCYXNrZXQud29yazoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25TdGF0dXNXb3JrQmFza2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxufSk7XHJcblxyXG4iLCJpbXBvcnQgeyBCb3gsIFR5cGVCb3ggfSBmcm9tICcuL2JveC1zYW1wbGVzL2JveCc7XHJcbi8qKlxyXG4gKiDQkdC+0LrRgSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQuiDQvdC1INC/0YDQtdC00L3QsNC30L3QsNGH0LXQvSDQtNC70Y8g0YPQv9GA0LDQstC70LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LxcclxuICogQHR5cGUge0Z1bmN0aW9ufVxyXG4gKi9cclxudmFyIEJveENoYXJhY3RlcmlzdGljc0FuaW1hbCA9IGNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IEJveCxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LDRh9Cw0LvRjNC90YvQtSDQv9C+0LfQuNGG0LjQuCDQuCDQv9GA0L7QuNC30LLQvtC00LjRgiDQstGL0YfQuNGB0LvQtdC90LjQtSDQtNC70LjQvdC90YtcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXR0aW5ncygpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gVHlwZUJveC5sZWZ0O1xyXG4gICAgICAgIHRoaXMudGltZUJyaW5nPTAuMTtcclxuICAgICAgICBsZXQgY2FudmFzID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZUluUGl4ZWxzKCk7XHJcbiAgICAgICAgbGV0IHNpemVCb3hZID0gdGhpcy5fZ2V0U2l6ZUJveChjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHNpemVCb3hZIC8gMiArIHRoaXMuaW5kZW50UmlnaHQ7XHJcbiAgICAgICAgdGhpcy5ub2RlLmhlaWdodCA9IHNpemVCb3hZO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zID0gY2MudjIodGhpcy5ub2RlLngsIHRoaXMubm9kZS55KTtcclxuICAgICAgICB0aGlzLl9lbmRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCArIHRoaXMubm9kZS53aWR0aCwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIHRoaXMuX2Ftb3VudFBpeCA9IE1hdGguYWJzKHRoaXMuX2VuZFBvcy54IC0gdGhpcy5fc3RhcnRQb3MueCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZCgpe1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0L7RgtC60YDRi9GC0LjQtSDQsdC+0LrRgdCwINCyINC60L7QvdGC0YDQvtC70LvQtdGA0LVcclxuICAgICAqL1xyXG4gICAgcHVibGlzaEV2ZW50T3Blbigpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdvcGVuQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC30LDQutGA0YvQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRDbG9zZSgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdjbG9zZUJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0LHQvtC60YHQvtCyXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gZHRcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgdGhpcy5fb3BhY2l0eU5vZGUodGhpcy5ub2RlLnggLSB0aGlzLl9zdGFydFBvcy54KTtcclxuICAgIH0sXHJcbn0pOyIsImltcG9ydCB7IEJveCwgVHlwZUJveCB9IGZyb20gJy4vYm94LXNhbXBsZXMvYm94JztcclxuXHJcbi8qKlxyXG4gKiDQkdC+0LrRgSDRgdC/0LjRgdC60LAg0LbQuNCy0L7RgtC90YvRhVxyXG4gKiBAdHlwZSB7RnVuY3Rpb259XHJcbiAqL1xyXG52YXIgQm94Q3JlYXRlQW5pbWFsID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogQm94LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0L3QsNGH0LDQu9GM0L3Ri9C1INC/0L7Qt9C40YbQuNC4INC4INC/0YDQvtC40LfQstC+0LTQuNGCINCy0YvRh9C40YHQu9C10L3QuNC1INC00LvQuNC90L3Ri1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3NldHRpbmdzKCkge1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBUeXBlQm94LmJvdHRvbTtcclxuICAgICAgICB0aGlzLnRpbWVCcmluZz0wLjI7XHJcbiAgICAgICAgbGV0IGJhciA9IHRoaXMuY29udGVudDtcclxuICAgICAgICBsZXQgY2FudmFzID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZUluUGl4ZWxzKCk7XHJcbiAgICAgICAgbGV0IHNpemVCb3hYID0gdGhpcy5fZ2V0U2l6ZUJveChjYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMubm9kZS54ID0gc2l6ZUJveFggLyAyICsgdGhpcy5pbmRlbnRMZWZ0O1xyXG4gICAgICAgIGJhci53aWR0aCA9IHNpemVCb3hYO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zID0gY2MudjIodGhpcy5ub2RlLngsIHRoaXMubm9kZS55KTtcclxuICAgICAgICB0aGlzLl9lbmRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkgKyBiYXIuaGVpZ2h0IC0gMTApO1xyXG4gICAgICAgIHRoaXMuX2Ftb3VudFBpeCA9IE1hdGguYWJzKHRoaXMuX2VuZFBvcy55IC0gdGhpcy5fc3RhcnRQb3MueSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC+0YLQutGA0YvRgtC40LUg0LHQvtC60YHQsCDQsiDQutC+0L3RgtGA0L7Qu9C70LXRgNC1XHJcbiAgICAgKi9cclxuICAgIHB1Ymxpc2hFdmVudE9wZW4oKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnb3BlbkJveEZyb21BbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQt9Cw0LrRgNGL0YLQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRDbG9zZSgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdjbG9zZUJveEZyb21BbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0LHQvtC60YHQvtCyXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gZHRcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgdGhpcy5fb3BhY2l0eU5vZGUodGhpcy5ub2RlLnkgLSB0aGlzLl9zdGFydFBvcy55KTtcclxuICAgIH0sXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEZJUkNvcnAgb24gMjkuMDMuMjAxNy5cclxuICovXHJcbmltcG9ydCB7IEJveCwgVHlwZUJveCB9IGZyb20gJy4vYm94LXNhbXBsZXMvYm94JztcclxuLyoqXHJcbiAqINCR0L7QutGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6INC90LUg0L/RgNC10LTQvdCw0LfQvdCw0YfQtdC9INC00LvRjyDRg9C/0YDQsNCy0LvQtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvFxyXG4gKiBAdHlwZSB7RnVuY3Rpb259XHJcbiAqL1xyXG52YXIgQm94TWVudVBsYXkgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBCb3gsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvdCw0YfQsNC70YzQvdGL0LUg0L/QvtC30LjRhtC40Lgg0Lgg0L/RgNC+0LjQt9Cy0L7QtNC40YIg0LLRi9GH0LjRgdC70LXQvdC40LUg0LTQu9C40L3QvdGLXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0dGluZ3MoKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IFR5cGVCb3gubGVmdDtcclxuICAgICAgICB0aGlzLnRpbWVCcmluZz0wLjY7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGNjLmRpcmVjdG9yLmdldFdpblNpemVJblBpeGVscygpO1xyXG4gICAgICAgIGxldCBzaXplQm94WSA9IHRoaXMuX2dldFNpemVCb3goY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSBzaXplQm94WSAvIDIgKyB0aGlzLmluZGVudFJpZ2h0O1xyXG4gICAgICAgIHRoaXMubm9kZS5oZWlnaHQgPSBzaXplQm94WTtcclxuICAgICAgICB0aGlzLl9zdGFydFBvcyA9IGNjLnYyKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy5fZW5kUG9zID0gY2MudjIodGhpcy5ub2RlLnggKyB0aGlzLm5vZGUud2lkdGggLSA3NSwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIHRoaXMuX2Ftb3VudFBpeCA9IE1hdGguYWJzKHRoaXMuX2VuZFBvcy54IC0gdGhpcy5fc3RhcnRQb3MueCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZCgpe1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0LrRgNGL0LLQsNC10YIv0LfQsNC60YDRi9Cy0LDQtdGCINCx0L7QutGBXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25DbGljayhldmVudCl7XHJcbiAgICAgICAgdGhpcy5fZW5kU3dpcGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0L7RgtC60YDRi9GC0LjQtSDQsdC+0LrRgdCwINCyINC60L7QvdGC0YDQvtC70LvQtdGA0LVcclxuICAgICAqL1xyXG4gICAgcHVibGlzaEV2ZW50T3Blbigpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdvcGVuQm94TWVudVBsYXknLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQt9Cw0LrRgNGL0LjQtSDQsdC+0LrRgdCwINCyINC60L7QvdGC0YDQvtC70LvQtdGA0LVcclxuICAgICAqL1xyXG4gICAgcHVibGlzaEV2ZW50Q2xvc2UoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnY2xvc2VCb3hNZW51UGxheScsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQvdC+0LLQu9GP0LXRgiDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0LHQvtC60YHQvtCyXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gZHRcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgdGhpcy5fb3BhY2l0eU5vZGUodGhpcy5ub2RlLnggLSB0aGlzLl9zdGFydFBvcy54KTtcclxuICAgIH0sXHJcbn0pOyIsIi8qKlxyXG4gKiBFbnVtINGB0L7RgdGC0L7Rj9C90LjQuSDQsdC+0LrRgdCwXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE1vdmVtZW50XHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0b0Nsb3NlINCx0L7QutGBINC30LDQutGA0YvRgi5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHRvT3BlbiDQsdC+0LrRgSDQvtGC0LrRgNGL0YIuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCh0L7RgdGC0L7Rj9C90LjQtSDQsdC+0LrRgdCwICjQvtGC0LrRgNGL0YIv0LfQsNC60YDRi9GCKVxyXG4gKiBAdHlwZSB7TW92ZW1lbnR9XHJcbiAqL1xyXG5jb25zdCBNb3ZlbWVudCA9IHtcclxuICAgIHRvQ2xvc2U6IDAsXHJcbiAgICB0b09wZW46IDEsXHJcbn07XHJcblxyXG4vKipcclxuICogRW51bSDRgdC+0YHRgtC+0Y/QvdC40Lkg0YDQsNCx0L7RgtGLINCx0L7QutGB0LBcclxuICogQHR5cGVkZWYge09iamVjdH0gVHlwZUJveFxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gYm90dG9tINGA0LDQsdC+0YLQsCDQutCw0Log0L3QuNC20L3QuNC5INCx0L7QutGBLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gdG9wINGA0LDQsdC+0YLQsCDQutCw0Log0LLQtdGA0YXQvdC40Lkg0LHQvtC60YEuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByaWdodCDRgNCw0LHQvtGC0LAg0LrQsNC6INC/0YDQsNCy0YvQuSDQsdC+0LrRgS5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGxlZnQg0YDQsNCx0L7RgtCwINC60LDQuiDQu9C10LLRiyDQsdC+0LrRgS5cclxuICovXHJcblxyXG4vKipcclxuICog0KLQuNC/INCx0L7QutGB0LBcclxuICogQHR5cGUge3tib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGxlZnQ6IG51bWJlcn19XHJcbiAqL1xyXG5jb25zdCBUeXBlQm94ID0ge1xyXG4gICAgYm90dG9tOiAwLFxyXG4gICAgdG9wOiAxLFxyXG4gICAgcmlnaHQ6IDIsXHJcbiAgICBsZWZ0OiAzLFxyXG59O1xyXG4vKipcclxuICog0K/QtNGA0L4g0LHQvtC60YHQvtCyXHJcbiAqIEB0eXBlIHtjYy5DbGFzc31cclxuICovXHJcbnZhciBCb3ggPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9zdGFydFBvczogbnVsbCwvL9Ch0YLQsNGA0YLQvtCy0LDRjyDQv9C+0LfQuNGG0LjRjyDQsdC+0LrRgdCwXHJcbiAgICAgICAgX2VuZFBvczogbnVsbCwvL9C60L7QvdC10YfQvdCw0Y8g0L/QvtC30LjRhtC40Y8g0LHQvtC60YHQsFxyXG4gICAgICAgIF90eXBlOiBudWxsLC8v0YHQvtGB0YLQvtGP0L3QuNC1INGC0LjQv9CwINCx0L7QutGB0LAg0LIg0LrQvtGC0L7RgNC+0Lwg0L7QvSDRgNCw0LHQvtGC0LDQtdGCXHJcbiAgICAgICAgX2RpcmVjdGlvbjogMSwvLzAtINC30LDQutGA0YvRgtGM0YHRjyAxLSDQvtGC0LrRgNGL0YLRjNGB0Y9cclxuICAgICAgICBfZmxhZ0Jsb2NrOiBmYWxzZSwvL9GE0LvQsNCzINCx0LvQvtC60LjRgNC+0LLQutC4XHJcbiAgICAgICAgX2ZsYWdaYXByb3NCbG9jazogZmFsc2UsLy/RhNC70LDQsyDQviDQvdC10L7QsdGF0L7QtNC40L7QvNGB0YLQuCDQsdC70L7QutC40YDQvtCy0LrQuFxyXG4gICAgICAgIF9hbW91bnRQaXg6IG51bGwsLy/Qv9GD0YLRjCDQtNC70Y8g0LHQvtC60YHQsFxyXG4gICAgICAgIF9hY3Rpb25Nb3ZlQm94OiBudWxsLC8vYWN0aW9ucyDQtNCy0LjQttC10L3QuNGPINCx0L7QutGB0LBcclxuXHJcbiAgICAgICAgdGltZUJyaW5nOiAwLjAxLC8v0JLRgNC10LzRjyDQtNC+0LLQvtC00LAg0LIg0YHQtdC60YPQvdC00LDRhVxyXG4gICAgICAgIGNvbnRlbnQ6IGNjLk5vZGUsLy/QutC+0L3RgtC10L3RgiDQvdCw0LQg0LrQvtGC0L7RgNGL0Lwg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L/RgNC+0LjQt9Cy0LXRgdGC0Lgg0YDQsNCx0L7RgtGDXHJcbiAgICAgICAgb3BhY2l0eUJveDogMzAsLy/Qn9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0LHQvtC60YHQsCBcclxuICAgICAgICBpbmRlbnRMZWZ0OiA1MCwvL9Ce0YLRgdGC0YPQvyDRgdC70LXQstCwICjQsiBweClcclxuICAgICAgICBpbmRlbnRSaWdodDogNTAsLy/QntGC0YHRgtGD0L8g0YHQv9GA0LDQstCwICjQsiBweClcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGB0YPRidC10YHRgtCy0LvRj9C10YIg0L/QtdGA0LLQvtC90LDRh9Cw0LvRjNC90YPRjiDQvdCw0YHRgtGA0L7QudC60YNcclxuICAgICAqL1xyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX2dldFBlcm1pc3Npb25Nb3ZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQoKXtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0L/QtdGA0LXQvNC10L3QvdGL0YVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9pbml0KCl7XHJcbiAgICAgICAgLy/QlNCw0LvRjNC90LXQudGI0LXQtSDQtNC10LnRgdGC0LLQuNC1INCx0L7QutGB0LBcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBNb3ZlbWVudC50b09wZW47XHJcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNGPINC90LAg0YHRgtGA0LDRgiDRgtCw0YfQsFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsCDQtNCy0LjQttC10L3QuNC1INGC0LDRh9CwXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudCDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICBvblRvdWNoTW92ZShldmVudCkge1xyXG4gICAgICAgIHZhciBkZWx0YSA9IGV2ZW50LnRvdWNoLmdldERlbHRhKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9mbGFnQmxvY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0TW92ZW1lbnQoZGVsdGEpLl9tb3ZlQm94KGRlbHRhKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjQtSDQvdCwINC30LDQstC10YDRiNC10L3QuNC1INGC0LDRh9CwXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudCDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICBvblRvdWNoRW5kKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9mbGFnQmxvY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fZW5kU3dpcGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQutC70Y7Rh9Cw0LXRgiDQsdC70L7QutC40YDQvtCy0LrRgyDQsdC+0LrRgdCwXHJcbiAgICAgKi9cclxuICAgIG9uQmxvY2soKXtcclxuICAgICAgICB0aGlzLl9mbGFnWmFwcm9zQmxvY2sgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2ZsYWdCbG9jayA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLRi9C60LvRjtGH0LDQtdGCINCx0LvQvtC60LjRgNC+0LLQutGDINCx0L7QutGB0LBcclxuICAgICAqL1xyXG4gICAgb2ZmQmxvY2soKXtcclxuICAgICAgICB0aGlzLl9mbGFnWmFwcm9zQmxvY2sgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9mbGFnQmxvY2sgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0LrRgNGL0LLQsNC10YIg0LHQvtC60YFcclxuICAgICAqL1xyXG4gICAgb3BlbkJveCgpe1xyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCX0LDQutGA0YvQstCw0LXRgiDQsdC+0LrRgVxyXG4gICAgICovXHJcbiAgICBjbG9zZUJveCgpe1xyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IE1vdmVtZW50LnRvQ2xvc2U7XHJcbiAgICAgICAgdGhpcy5fZW5kU3dpcGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXRgiDQvtC20LjQtNCw0LXQvNC+0LUg0YHQvtGB0YLQvtGP0L3QuNC1INC/0L4g0L3QsNC/0YDQsNCy0LvQtdC90LjRjiDQtNCy0LjQttC10L3QuNGPINCx0L7QutGB0LBcclxuICAgICAqIEBwYXJhbSBkZWx0YSDQv9GA0LjRgNCw0YnQtdC90LjQtVxyXG4gICAgICogQHJldHVybnMge0JveH0g0Y3RgtC+0YIg0LrQu9Cw0YHRgVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3NldE1vdmVtZW50KGRlbHRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IFR5cGVCb3gudG9wKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRlbHRhLnkgPiAwID8gTW92ZW1lbnQudG9DbG9zZSA6IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3R5cGUgPT09IFR5cGVCb3guYm90dG9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRlbHRhLnkgPCAwID8gTW92ZW1lbnQudG9DbG9zZSA6IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3R5cGUgPT09IFR5cGVCb3gubGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBkZWx0YS54IDwgMCA/IE1vdmVtZW50LnRvQ2xvc2UgOiBNb3ZlbWVudC50b09wZW47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gZGVsdGEueCA+IDAgPyBNb3ZlbWVudC50b0Nsb3NlIDogTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LLRi9GF0L7QtCDQsdC+0LrRgdCwINC30LAg0L/RgNC10LTQtdC70Ysg0LjQvdGC0LXRgNCy0LDQu9CwINCyINGA0LXQt9GD0LTRjNGC0LDRgtC1INCy0YvQv9C+0LvQvdC10L3QuNGPINC00LDQvdC90L7Qs9C+INC/0YDQuNGA0LDRidC10L3QuNGPLiB0cnVlLdC60L7Qs9C00LAg0L7QvSDQvdC1INCy0YvRhdC+0LTQuNGCXHJcbiAgICAgKiBAcGFyYW0gZGVsdGEg0L/RgNC40YDQsNGJ0LXQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0YtcclxuICAgICAqIEBwYXJhbSBzdGFydCDRgdGC0LDRgNGC0L7QstCw0Y8g0LrQvtC+0YDQtNC40L3QsCjQutC+0L7RgNC00LjQvdCw0YLQsCDQt9Cw0LrRgNGL0YLQvtCz0L4g0LHQvtC60YHQsClcclxuICAgICAqIEBwYXJhbSBlbmQg0LrQvtC90LXRh9C90LDRjyDQutC+0L7RgNC00LjQvdCw0YLQsCjQutC+0L7RgNC00LjQvdCw0YLQsCDQvtGC0LrRgNGL0YLQvtCz0L4g0LHQvtC60YHQsClcclxuICAgICAqIEBwYXJhbSBjdXJyZW50INGC0LXQutGD0YnQsNCwINC60L7QvtGA0LTQuNC90LDRgtCwXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLSDQtdGB0LvQuCDQsdC+0LrRgSDQvdC1INCy0YvRhdC+0LTQuNGCINC30LAg0L/RgNC10LTQtdC70YtcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9pc0NoZWNrT3V0T2ZSYW5nZShkZWx0YSwgc3RhcnQsIGVuZCwgY3VycmVudCl7XHJcbiAgICAgICAgcmV0dXJuIHN0YXJ0IDwgZW5kID8gdGhpcy5faXNPdXRPZlJhbmdlTGVmdEJvdHRvbShkZWx0YSwgc3RhcnQsIGVuZCwgY3VycmVudCkgOiB0aGlzLl9pc091dE9mUmFuZ2VSaWdodFRvcChkZWx0YSwgc3RhcnQsIGVuZCwgY3VycmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINCy0YvRhdC+0LQg0LvQtdCy0L7Qs9C+INC4INC90LjQttC90LXQs9C+INCx0L7QutGB0LAg0LfQsCDQv9GA0LXQtNC10LvRiyDQuNC90YLQtdGA0LLQsNC70LAg0LIg0YDQtdC30YPQtNGM0YLQsNGC0LUg0LLRi9C/0L7Qu9C90LXQvdC40Y8g0LTQsNC90L3QvtCz0L4g0L/RgNC40YDQsNGJ0LXQvdC40Y9cclxuICAgICAqIEBwYXJhbSBkZWx0YSDQv9GA0LjRgNCw0YnQtdC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLRi1xyXG4gICAgICogQHBhcmFtIHN0YXJ0INGB0YLQsNGA0YLQvtCy0LDRjyDQutC+0L7RgNC00LjQvdCwKNC60L7QvtGA0LTQuNC90LDRgtCwINC30LDQutGA0YvRgtC+0LPQviDQsdC+0LrRgdCwKVxyXG4gICAgICogQHBhcmFtIGVuZCDQutC+0L3QtdGH0L3QsNGPINC60L7QvtGA0LTQuNC90LDRgtCwKNC60L7QvtGA0LTQuNC90LDRgtCwINC+0YLQutGA0YvRgtC+0LPQviDQsdC+0LrRgdCwKVxyXG4gICAgICogQHBhcmFtIGN1cnJlbnQg0YLQtdC60YPRidCw0LAg0LrQvtC+0YDQtNC40L3QsNGC0LBcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlLSDQtdGB0LvQuCDQsdC+0LrRgSDQvdC1INCy0YvRhdC+0LTQuNGCINC30LAg0L/RgNC10LTQtdC70YtcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9pc091dE9mUmFuZ2VMZWZ0Qm90dG9tKGRlbHRhLCBzdGFydCwgZW5kLCBjdXJyZW50KXtcclxuICAgICAgICByZXR1cm4gZGVsdGEgKyBjdXJyZW50ID4gc3RhcnQgJiYgZGVsdGEgKyBjdXJyZW50IDwgZW5kO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDQstGL0YXQvtC0INCy0LXRgNGF0L3QtdCz0L4g0Lgg0L/RgNCw0LLQvtCz0L4g0LHQvtC60YHQsCDQt9CwINC/0YDQtdC00LXQu9GLINC40L3RgtC10YDQstCw0LvQsCDQsiDRgNC10LfRg9C00YzRgtCw0YLQtSDQstGL0L/QvtC70L3QtdC90LjRjyDQtNCw0L3QvdC+0LPQviDQv9GA0LjRgNCw0YnQtdC90LjRj1xyXG4gICAgICogQHBhcmFtIGRlbHRhINC/0YDQuNGA0LDRidC10L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtGLXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQg0YHRgtCw0YDRgtC+0LLQsNGPINC60L7QvtGA0LTQuNC90LAo0LrQvtC+0YDQtNC40L3QsNGC0LAg0LfQsNC60YDRi9GC0L7Qs9C+INCx0L7QutGB0LApXHJcbiAgICAgKiBAcGFyYW0gZW5kINC60L7QvdC10YfQvdCw0Y8g0LrQvtC+0YDQtNC40L3QsNGC0LAo0LrQvtC+0YDQtNC40L3QsNGC0LAg0L7RgtC60YDRi9GC0L7Qs9C+INCx0L7QutGB0LApXHJcbiAgICAgKiBAcGFyYW0gY3VycmVudCDRgtC10LrRg9GJ0LDQsCDQutC+0L7RgNC00LjQvdCw0YLQsFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUtINC10YHQu9C4INCx0L7QutGBINC90LUg0LLRi9GF0L7QtNC40YIg0LfQsCDQv9GA0LXQtNC10LvRi1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2lzT3V0T2ZSYW5nZVJpZ2h0VG9wKGRlbHRhLCBzdGFydCwgZW5kLCBjdXJyZW50KXtcclxuICAgICAgICByZXR1cm4gZGVsdGEgKyBjdXJyZW50IDwgc3RhcnQgJiYgZGVsdGEgKyBjdXJyZW50ID4gZW5kO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LLQuNC20LXQvdC40LUg0LHQvtC60YHQsFxyXG4gICAgICogQHBhcmFtIHtjYy5WZWMyfSBkZWx0YSDQv9GA0LjRgNCw0YnQtdC90LjQtVxyXG4gICAgICogQHJldHVybnMge0JveH1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9tb3ZlQm94KGRlbHRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IFR5cGVCb3gudG9wIHx8IHRoaXMuX3R5cGUgPT09IFR5cGVCb3guYm90dG9tKSB7XHJcbiAgICAgICAgICAgICh0aGlzLl9pc0NoZWNrT3V0T2ZSYW5nZShkZWx0YS55LCB0aGlzLl9zdGFydFBvcy55LCB0aGlzLl9lbmRQb3MueSwgdGhpcy5ub2RlLnkpKSA/IHRoaXMubm9kZS55ICs9IGRlbHRhLnkgOiB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICh0aGlzLl9pc0NoZWNrT3V0T2ZSYW5nZShkZWx0YS54LCB0aGlzLl9zdGFydFBvcy54LCB0aGlzLl9lbmRQb3MueCwgdGhpcy5ub2RlLngpKSA/IHRoaXMubm9kZS54ICs9IGRlbHRhLnggOiB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0L/QvtC70L3Rj9C10YIg0LDQstGC0L4g0LTQvtCy0L7QtNC60YNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9lbmRTd2lwZSgpe1xyXG4gICAgICAgIHRoaXMuX2ZsYWdCbG9jayA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID09PSBNb3ZlbWVudC50b0Nsb3NlID8gdGhpcy5fYnJpbmcodGhpcy5fc3RhcnRQb3MpIDogdGhpcy5fYnJpbmcodGhpcy5fZW5kUG9zKTtcclxuICAgICAgICB0aGlzLl9yZWZvY3VzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLRi9C/0L7Qu9C90Y/QtdGCINCw0LLRgtC+INC00L7QstC+0LQgINCx0L7QutGB0LAg0LTQviDRhNC40L3QsNC70YzQvdC+0Lkg0YLQvtGH0LrQuCDQvdCw0LfQvdCw0YfQtdC90LjRj1xyXG4gICAgICogQHBhcmFtIHBvcyDRgtC+0YfQutCwINC90LDQt9C90LDRh9C10L3QuNGPXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfYnJpbmcocG9zKXtcclxuICAgICAgICB0aGlzLl9hY3Rpb25Nb3ZlQm94ID0gY2MubW92ZVRvKHRoaXMudGltZUJyaW5nLCBwb3MpO1xyXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oXHJcbiAgICAgICAgICAgIGNjLnNlcXVlbmNlKHRoaXMuX2FjdGlvbk1vdmVCb3gsIGNjLmNhbGxGdW5jKHRoaXMuX2ZpbmlzaEJyaW5nLCB0aGlzKSlcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0YPQvdC60YbQuNGPINGB0LjQs9C90LDQu9C40LfQuNGA0YPRjtGJ0LDRjyDQviDQt9Cw0LLQtdGA0YjQtdC90LjQuCDQtNC+0LLQvtC00LrQuCDQsdC+0LrRgdCwXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZmluaXNoQnJpbmcoKXtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZsYWdaYXByb3NCbG9jaykgdGhpcy5fZmxhZ0Jsb2NrID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0Y/QtdGCINC00LXQu9Cw0LXRgiDQu9C4INC+0L0g0Y3RgtC+INGB0L7QsdGL0YLQuNC1INCwINC90LUg0LrRgtC+LdGC0L4g0LTRgNGD0LPQvtC5INC/0L4g0LLQtdGC0LrQtSDQvdC+0LTQvtCyINC00L4g0L3QtdCz0L5cclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2dldFBlcm1pc3Npb25Nb3ZlKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5fbmFtZSA9PT0gdGhpcy5ub2RlLm5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vblRvdWNoTW92ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGA0LDQt9C80LXRgCDQsdC+0LrRgdCwINC+0YLQvdC+0YHQuNGC0LXQu9GM0L3QviDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LAg0L3QsCDRgdGC0L7RgNC+0L3QtSDQuCDRg9GB0LvQvtCy0LjQuSDQvtGC0YHRgtGD0L/QvtCyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BhY2UgINGA0LDQt9C80LXRgCDQsdC+0LrRgdCw0LTQviDQv9GA0LjRgNCw0YnQtdC90LjRj1xyXG4gICAgICogQHJldHVybnMge251bWJlcn0g0YDQsNC30LzQtdGAINCx0L7QutGB0LBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9nZXRTaXplQm94KHNwYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHNwYWNlIC0gdGhpcy5pbmRlbnRMZWZ0IC0gdGhpcy5pbmRlbnRSaWdodDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10L3Rj9C10YIg0LTQtdC50YHRgtCy0LjQtSDQutC+0YLQvtGA0L7QtSDQvdC10L7QsdGF0L7QtNC40LzQviDRgdC00LXQu9Cw0YLRjCDQtNCw0LvRjNGI0LUg0LHQvtC60YHRgyjQt9Cw0LrRgNGL0YLRjNGB0Y8g0LjQu9C4INC+0YLQutGA0YvRgtGM0YHRjyku0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcmVmb2N1cygpIHtcclxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uID09PSBNb3ZlbWVudC50b0Nsb3NlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnRDbG9zZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IE1vdmVtZW50LnRvQ2xvc2U7XHJcbiAgICAgICAgICAgIHRoaXMucHVibGlzaEV2ZW50T3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0LHQvtGC0LAg0YEg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGM0Y4g0LHQvtC60YHQsC4g0JjQt9C80LXQvdGP0LXRgiDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0LHQvtC60YHQsCDQvdCwINC+0YHQvdC+0LLQtSDQv9C+0LvQvtC20LXQvdC40Y8g0LXQs9C+INC+0YLQvdC+0YHQuNGC0LXQu9GM0L3QviDQvdCw0YfQsNC70YzQvdGL0YUg0Lgg0LrQvtC90LXRh9C90YvRhSDQutC+0L7RgNC00LjQvdCw0YJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9vcGFjaXR5Tm9kZShjdXJyZW50UG9zQm94KSB7XHJcbiAgICAgICAgbGV0IG9wYXNpdHkgPSB0aGlzLm9wYWNpdHlCb3ggKyAoKCgyNTUgLSB0aGlzLm9wYWNpdHlCb3gpICogY3VycmVudFBvc0JveCkgLyB0aGlzLl9hbW91bnRQaXgpO1xyXG4gICAgICAgIGlmIChvcGFzaXR5ID4gMjU1KSB7XHJcbiAgICAgICAgICAgIG9wYXNpdHkgPSAyNTU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcGFzaXR5IDwgdGhpcy5vcGFjaXR5Qm94KSB7XHJcbiAgICAgICAgICAgIG9wYXNpdHkgPSB0aGlzLm9wYWNpdHlCb3g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gb3Bhc2l0eTtcclxuICAgIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IHsgQm94LCBNb3ZlbWVudCwgVHlwZUJveCB9OyIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG52YXIgQVBJQ29yZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBBUElDb3JlKCkge1xyXG4gICAgfVxyXG4gICAgQVBJQ29yZS5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW5zdCkge1xyXG4gICAgICAgICAgICB0aGlzLmluc3QgPSBuZXcgQVBJQ29yZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0O1xyXG4gICAgfTtcclxuICAgIEFQSUNvcmUucHJvdG90eXBlLmNyZWF0ZUFuaW1hbCA9IGZ1bmN0aW9uIChwdXRUb01vZGVsLCBpZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBUEknKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwdXRUb01vZGVsKTtcclxuICAgICAgICB2YXIgZmFjdG9yeSA9IEFuaW1hbHMuQW5pbWFsQnVpbGRlci5pbnN0YW5jZSgpO1xyXG4gICAgICAgIHZhciBhbmltYWw7XHJcbiAgICAgICAgYW5pbWFsID0gZmFjdG9yeS5jcmVhdGUobGlvbik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobGlvbik7XHJcbiAgICAgICAgYW5pbWFsLmlkID0gaWQ7XHJcbiAgICAgICAgcmV0dXJuIGFuaW1hbDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQVBJQ29yZTtcclxufSgpKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEFuaW1hbEJ1aWxkZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIEFuaW1hbEJ1aWxkZXIoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluc3QgPSBuZXcgQW5pbWFsQnVpbGRlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3Q7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWxCdWlsZGVyLnByb3RvdHlwZS5jcmVhdGVTeXN0ZW1zID0gZnVuY3Rpb24gKHN5c3RlbXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGZhY3RvcnkgPSBBbmltYWxzLlN5c3RlbXMuU3lzdGVtRmFjdG9yeS5pbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICB2YXIgbWFzID0gW107XHJcbiAgICAgICAgICAgIHN5c3RlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgbWFzID0gW107XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNjYWxlc1R5cGUuZm9yRWFjaChmdW5jdGlvbiAoc2MpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXNbc2MudHlwZV0gPSBfdGhpcy5tYXNTY2FsZXNbc2MudHlwZV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLm1hc1N5c3RlbXNbaXRlbS50eXBlXSA9IGZhY3RvcnkuY3JlYXRlKGl0ZW0udHlwZSwgbWFzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQW5pbWFsQnVpbGRlci5wcm90b3R5cGUuY3JlYXRlU2NhbGVzID0gZnVuY3Rpb24gKHNjYWxlcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IEFuaW1hbHMuU2NhbGVzLlNjYWxlRmFjdG9yeS5pbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICBzY2FsZXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5cGVTY2FsZSA9IGl0ZW0udHlwZVNjYWxlLCB0eXBlID0gaXRlbS50eXBlLCBwYXJhbXMgPSBpdGVtLnBhcmFtcztcclxuICAgICAgICAgICAgICAgIHBhcmFtcy50eXBlID0gdHlwZTtcclxuICAgICAgICAgICAgICAgIF90aGlzLm1hc1NjYWxlc1t0eXBlXSA9IGZhY3RvcnkuY3JlYXRlKHR5cGVTY2FsZSwgcGFyYW1zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQW5pbWFsQnVpbGRlci5wcm90b3R5cGUuY3JlYXRlQ29tbXVuaWNhdG9yID0gZnVuY3Rpb24gKGNvbW11bm9jYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIGNvbW11bmljYXRvckJ1aWxkID0gbmV3IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMuQ29tbXVuaWNhdG9yQnVpbGRlcih0aGlzLm1hc1NjYWxlcyk7XHJcbiAgICAgICAgICAgIGNvbW11bm9jYXRpb24uZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29tbXVuaWNhdG9yQnVpbGQuYWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW11bmljYXRvckJ1aWxkLmJ1aWxkKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWxCdWlsZGVyLnByb3RvdHlwZS5jcmVhdGVTdGF0ZXMgPSBmdW5jdGlvbiAoc3RhdGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBmYWN0b3J5ID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUuU3RhdGVGYWN0b3J5Lmluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbVN0YXRlID0gW107XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHN0YXRlcy5zdGF0ZSwgbGlua3MgPSBzdGF0ZXMubGlua3M7XHJcbiAgICAgICAgICAgIHN0YXRlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtU3RhdGVbaXRlbS50eXBlXSA9IGZhY3RvcnkuY3JlYXRlKGl0ZW0udHlwZSwgaXRlbS5uYW1lLCBfdGhpcy5fYW5pbWFsLCBpdGVtLmlzRW5kKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBtYXNzU3RhdGVzID0gW107XHJcbiAgICAgICAgICAgICAgICBpdGVtLmxpbmsuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXNzU3RhdGVzLnB1c2gobmV3IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlJvdXRlKHBhcmFtU3RhdGVbc3RhdGUudHlwZV0sIGZ1bmN0aW9uIChtb2RlbCwgcHJvYmFiaWxpdHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLnByb2JhYmlsaXR5ID4gcHJvYmFiaWxpdHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHBhcmFtU3RhdGVbaXRlbS50eXBlXS5zZXRSb3V0ZUVuZ2luZShuZXcgQW5pbWFscy5TdGF0ZU1hY2hpbmUuUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZShtYXNzU3RhdGVzKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlN0YXRlTWFjaGluZShwYXJhbVN0YXRlW0FuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuc3RhcnRMaWZlXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWxCdWlsZGVyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBtb2RlbC5uYW1lLCBzeXN0ZW1zID0gbW9kZWwuc3lzdGVtcywgc2NhbGVzID0gbW9kZWwuc2NhbGVzLCBjb21tdW5pY2F0aW9uID0gbW9kZWwuY29tbXVuaWNhdGlvbiwgc3RhdGVzID0gbW9kZWwuc3RhdGVzO1xyXG4gICAgICAgICAgICB0aGlzLm1hc1NjYWxlcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm1hc1N5c3RlbXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGNvbW11bmljYXRvciA9IHRoaXMuY3JlYXRlU2NhbGVzKHNjYWxlcykuY3JlYXRlU3lzdGVtcyhzeXN0ZW1zKS5jcmVhdGVDb21tdW5pY2F0b3IoY29tbXVuaWNhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hbCA9IG5ldyBBbmltYWxzLkFuaW1hbCh0aGlzLm1hc1N5c3RlbXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9hbmltYWwubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hbC5zdGF0ZU1hY2hpbmUgPSB0aGlzLmNyZWF0ZVN0YXRlcyhzdGF0ZXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9hbmltYWwuY29tbXVuaWNhdG9yID0gY29tbXVuaWNhdG9yO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWFsO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIEFuaW1hbEJ1aWxkZXI7XHJcbiAgICB9KCkpO1xyXG4gICAgQW5pbWFscy5BbmltYWxCdWlsZGVyID0gQW5pbWFsQnVpbGRlcjtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBBbmltYWwgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIEFuaW1hbChwYXJhbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5tdXNjdWxhciA9IHBhcmFtc1tBbmltYWxzLlN5c3RlbXMuU3lzdGVtVHlwZXMubXVzY3VsYXJdO1xyXG4gICAgICAgICAgICB0aGlzLmNpcmN1bGF0b3J5ID0gcGFyYW1zW0FuaW1hbHMuU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeV07XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbiA9IHBhcmFtc1tBbmltYWxzLlN5c3RlbXMuU3lzdGVtVHlwZXMubmF2aWdhdGlvbl07XHJcbiAgICAgICAgICAgIHRoaXMubXVzY3VsYXIuX2xpbmtUb0FuaW1hbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuY2lyY3VsYXRvcnkuX2xpbmtUb0FuaW1hbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbi5fbGlua1RvQW5pbWFsID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFuaW1hbC5wcm90b3R5cGUsIFwibXVzY3VsYXJcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXNjdWxhcjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX211c2N1bGFyID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcImNpcmN1bGF0b3J5XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2lyY3VsYXRvcnk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaXJjdWxhdG9yeSA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQW5pbWFsLnByb3RvdHlwZSwgXCJuYXZpZ2F0aW9uXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmF2aWdhdGlvbjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFuaW1hbC5wcm90b3R5cGUsIFwiY29tbXVuaWNhdG9yXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29tbXVuaWNhdG9yO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29tbXVuaWNhdG9yID0gcGFyYW07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcInN0YXRlTWFjaGluZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlTWFjaGluZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlTWFjaGluZSA9IHBhcmFtO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQW5pbWFsLnByb3RvdHlwZSwgXCJpZFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faWQgPSBwYXJhbTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFuaW1hbC5wcm90b3R5cGUsIFwibmFtZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gcGFyYW07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIEFuaW1hbC5wcm90b3R5cGUubW92ZVRvUG9pbnQgPSBmdW5jdGlvbiAocG9pbnQpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbC5wcm90b3R5cGUucnVuTGlmZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlTWFjaGluZS5ydW4oKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbC5wcm90b3R5cGUuZ2V0Q2hhcmFjdGVyaXN0aWNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfQodC60L7RgNC+0YHRgtGMJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogODksXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdDogJ9C8L9GBJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9CS0L7Qt9GA0LDRgdGCJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdDogJ9C70LXRgicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfQktC10YEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxMixcclxuICAgICAgICAgICAgICAgICAgICB1bml0OiAn0LrQsycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfQktGL0L3QvtGB0LvQuNCy0L7RgdGC0YwnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxMixcclxuICAgICAgICAgICAgICAgICAgICB1bml0OiAn0LXQtC4nLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0KHQuNGB0YLQtdC80LAg0LrRgNC+0LLQvtC+0LHRgNCw0YnQtdC90LjRjycsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDg5LFxyXG4gICAgICAgICAgICAgICAgICAgIHVuaXQ6ICclJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9Ch0LjRgdGC0LXQvNCwINC/0LDQvNGP0YLQuCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDU5LFxyXG4gICAgICAgICAgICAgICAgICAgIHVuaXQ6ICclJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9Ch0LjRgdGC0LXQvNCwINC00YvRhdCw0L3QuNGPJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogODksXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdDogJyUnLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogdGhpcy5fbmFtZSxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZTogJ9CR0LXQs9GDJyxcclxuICAgICAgICAgICAgICAgIHBhcmFtOiBwYXJhbXMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gQW5pbWFsO1xyXG4gICAgfSgpKTtcclxuICAgIEFuaW1hbHMuQW5pbWFsID0gQW5pbWFsO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIENvbW11bmljYXRpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChDb21tdW5pY2F0aW9ucykge1xyXG4gICAgICAgIHZhciBDb21tdW5pY2F0b3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBDb21tdW5pY2F0b3IoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXRMaW5rcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Vuc2l0aXZpdHkgPSAwLjE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbW11bmljYXRvci5wcm90b3R5cGUsIFwic2Vuc2l0aXZpdHlcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbnNpdGl2aXR5O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Vuc2l0aXZpdHkgPSBwYXJhbSA/IHBhcmFtIDogMC4xO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIENvbW11bmljYXRvci5wcm90b3R5cGUuc2V0dGluZyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Vuc2l0aXZpdHkgPSBwYXJhbXMuc2Vuc2l0aXZpdHkgfHwgMC4xO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDb21tdW5pY2F0b3IucHJvdG90eXBlLmFkZExpbmsgPSBmdW5jdGlvbiAoZXZlbnQsIGxpbmspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9uZXRMaW5rc1tldmVudF0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXRMaW5rc1tldmVudF0ucHVzaChsaW5rKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25ldExpbmtzW2V2ZW50XSA9IFtsaW5rXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ29tbXVuaWNhdG9yLnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24gKHBhY2ssIHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpbmtzID0gdGhpcy5fbmV0TGlua3NbcGFjay50eXBlXTtcclxuICAgICAgICAgICAgICAgIGlmIChsaW5rcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbHRhID0gbGluay5mdW4uY2FsY3VsYXRlKHBhcmFtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRlbHRhKSA+IF90aGlzLl9zZW5zaXRpdml0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGEgPSBwYWNrLmJlaGF2aW9yID09PSBsaW5rLmJlaGF2aW9yID8gZGVsdGEgOiAtZGVsdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNjYWxlLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIENvbW11bmljYXRvcjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIENvbW11bmljYXRpb25zLkNvbW11bmljYXRvciA9IENvbW11bmljYXRvcjtcclxuICAgIH0pKENvbW11bmljYXRpb25zID0gQW5pbWFscy5Db21tdW5pY2F0aW9ucyB8fCAoQW5pbWFscy5Db21tdW5pY2F0aW9ucyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgQ29tbXVuaWNhdGlvbnM7XHJcbiAgICAoZnVuY3Rpb24gKENvbW11bmljYXRpb25zKSB7XHJcbiAgICAgICAgdmFyIEJlaGF2aW9yU2NhbGVUeXBlcztcclxuICAgICAgICAoZnVuY3Rpb24gKEJlaGF2aW9yU2NhbGVUeXBlcykge1xyXG4gICAgICAgICAgICBCZWhhdmlvclNjYWxlVHlwZXNbQmVoYXZpb3JTY2FsZVR5cGVzW1wiaW5jcmVhc2VcIl0gPSAxXSA9IFwiaW5jcmVhc2VcIjtcclxuICAgICAgICAgICAgQmVoYXZpb3JTY2FsZVR5cGVzW0JlaGF2aW9yU2NhbGVUeXBlc1tcImRlY3JlYXNlXCJdID0gMl0gPSBcImRlY3JlYXNlXCI7XHJcbiAgICAgICAgfSkoQmVoYXZpb3JTY2FsZVR5cGVzID0gQ29tbXVuaWNhdGlvbnMuQmVoYXZpb3JTY2FsZVR5cGVzIHx8IChDb21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMgPSB7fSkpO1xyXG4gICAgfSkoQ29tbXVuaWNhdGlvbnMgPSBBbmltYWxzLkNvbW11bmljYXRpb25zIHx8IChBbmltYWxzLkNvbW11bmljYXRpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBDb21tdW5pY2F0aW9ucztcclxuICAgIChmdW5jdGlvbiAoQ29tbXVuaWNhdGlvbnMpIHtcclxuICAgICAgICB2YXIgQ29tbXVuaWNhdG9yQnVpbGRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIENvbW11bmljYXRvckJ1aWxkZXIoc2NhbGVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2FsZXMgPSBzY2FsZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21tdW5pY2F0b3IgPSBuZXcgQ29tbXVuaWNhdGlvbnMuQ29tbXVuaWNhdG9yKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3J5RnVuY3Rpb24gPSBBbmltYWxzLkZ1bmN0aW9ucy5GdW5jdGlvbkZhY3RvcnkuaW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBDb21tdW5pY2F0b3JCdWlsZGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBwYXJhbS5saW5rLmZvckVhY2goZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGNvbW11bmljYXRpb24udHlwZSwgYmVoYXZpb3IgPSBjb21tdW5pY2F0aW9uLmJlaGF2aW9yLCBmdW5jdGlvbnMgPSBjb21tdW5pY2F0aW9uLmZ1bmN0aW9ucywgcGFyYW1zID0gY29tbXVuaWNhdGlvbi5wYXJhbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gX3RoaXMuX3NjYWxlc1t0eXBlXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuID0gX3RoaXMuX2NyZWF0ZUZ1bmN0aW9uKGZ1bmN0aW9ucywgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY29tbXVuaWNhdG9yLmFkZExpbmsocGFyYW0udHlwZSwgeyBzY2FsZTogc2NhbGUsIGJlaGF2aW9yOiBiZWhhdmlvciwgZnVuOiBmdW4gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUuY29tbXVuaWNhdG9yID0gX3RoaXMuX2NvbW11bmljYXRvcjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENvbW11bmljYXRvckJ1aWxkZXIucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW11bmljYXRvcjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ29tbXVuaWNhdG9yQnVpbGRlci5wcm90b3R5cGUuX2NyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24gKHR5cGUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3RvcnlGdW5jdGlvbi5jcmVhdGUodHlwZSwgcGFyYW1zKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIENvbW11bmljYXRvckJ1aWxkZXI7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBDb21tdW5pY2F0aW9ucy5Db21tdW5pY2F0b3JCdWlsZGVyID0gQ29tbXVuaWNhdG9yQnVpbGRlcjtcclxuICAgIH0pKENvbW11bmljYXRpb25zID0gQW5pbWFscy5Db21tdW5pY2F0aW9ucyB8fCAoQW5pbWFscy5Db21tdW5pY2F0aW9ucyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgRnVuY3Rpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChGdW5jdGlvbnMpIHtcclxuICAgICAgICB2YXIgRnVuY3Rpb25GYWN0b3J5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gRnVuY3Rpb25GYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbRnVuY3Rpb25zLkZ1bmN0aW9uVHlwZXMubGluZV0gPSBGdW5jdGlvbnMuTGluZUZ1bmN0aW9uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW0Z1bmN0aW9ucy5GdW5jdGlvblR5cGVzLnF1YWRyYXRpY10gPSBGdW5jdGlvbnMuUXVhZHJhdGljRnVuY3Rpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRnVuY3Rpb25GYWN0b3J5Lmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IEZ1bmN0aW9uRmFjdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBGdW5jdGlvbkZhY3RvcnkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0eXBlLCBzeXN0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1t0eXBlXSA9IHN5c3RlbTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRnVuY3Rpb25GYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoZnVuY3Rpb25UeXBlLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy5fZmFjdG9yaWVzW2Z1bmN0aW9uVHlwZV0ocGFyYW1zKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uRmFjdG9yeTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIEZ1bmN0aW9ucy5GdW5jdGlvbkZhY3RvcnkgPSBGdW5jdGlvbkZhY3Rvcnk7XHJcbiAgICB9KShGdW5jdGlvbnMgPSBBbmltYWxzLkZ1bmN0aW9ucyB8fCAoQW5pbWFscy5GdW5jdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEZ1bmN0aW9ucztcclxuICAgIChmdW5jdGlvbiAoRnVuY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIEZ1bmN0aW9uVHlwZXM7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChGdW5jdGlvblR5cGVzKSB7XHJcbiAgICAgICAgICAgIEZ1bmN0aW9uVHlwZXNbRnVuY3Rpb25UeXBlc1tcImxpbmVcIl0gPSAxXSA9IFwibGluZVwiO1xyXG4gICAgICAgICAgICBGdW5jdGlvblR5cGVzW0Z1bmN0aW9uVHlwZXNbXCJxdWFkcmF0aWNcIl0gPSAyXSA9IFwicXVhZHJhdGljXCI7XHJcbiAgICAgICAgfSkoRnVuY3Rpb25UeXBlcyA9IEZ1bmN0aW9ucy5GdW5jdGlvblR5cGVzIHx8IChGdW5jdGlvbnMuRnVuY3Rpb25UeXBlcyA9IHt9KSk7XHJcbiAgICB9KShGdW5jdGlvbnMgPSBBbmltYWxzLkZ1bmN0aW9ucyB8fCAoQW5pbWFscy5GdW5jdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEZ1bmN0aW9ucztcclxuICAgIChmdW5jdGlvbiAoRnVuY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIExpbmVGdW5jdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIExpbmVGdW5jdGlvbihwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvZWZmaWNpZW50ID0gcGFyYW1zWzBdIHx8IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmVlID0gcGFyYW1zWzFdIHx8IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExpbmVGdW5jdGlvbi5wcm90b3R5cGUsIFwiY29lZmZpY2llbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvZWZmaWNpZW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnQgPSBwYXJhbSA/IHBhcmFtIDogMDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTGluZUZ1bmN0aW9uLnByb3RvdHlwZSwgXCJmcmVlXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcmVlO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJlZSA9IHBhcmFtID8gcGFyYW0gOiAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIExpbmVGdW5jdGlvbi5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnQgKiBwYXJhbSArIHRoaXMuX2ZyZWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBMaW5lRnVuY3Rpb247XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBGdW5jdGlvbnMuTGluZUZ1bmN0aW9uID0gTGluZUZ1bmN0aW9uO1xyXG4gICAgfSkoRnVuY3Rpb25zID0gQW5pbWFscy5GdW5jdGlvbnMgfHwgKEFuaW1hbHMuRnVuY3Rpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBGdW5jdGlvbnM7XHJcbiAgICAoZnVuY3Rpb24gKEZ1bmN0aW9ucykge1xyXG4gICAgICAgIHZhciBRdWFkcmF0aWNGdW5jdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFF1YWRyYXRpY0Z1bmN0aW9uKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnRBID0gcGFyYW1zWzBdIHx8IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2VmZmljaWVudEIgPSBwYXJhbXNbMV0gfHwgMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyZWUgPSBwYXJhbXNbMl0gfHwgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUXVhZHJhdGljRnVuY3Rpb24ucHJvdG90eXBlLCBcImNvZWZmaWNpZW50QVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnRBO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnRBID0gcGFyYW0gPyBwYXJhbSA6IDA7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFF1YWRyYXRpY0Z1bmN0aW9uLnByb3RvdHlwZSwgXCJjb2VmZmljaWVudEJcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvZWZmaWNpZW50QjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvZWZmaWNpZW50QiA9IHBhcmFtID8gcGFyYW0gOiAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRdWFkcmF0aWNGdW5jdGlvbi5wcm90b3R5cGUsIFwiZnJlZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJlZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZyZWUgPSBwYXJhbSA/IHBhcmFtIDogMDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBRdWFkcmF0aWNGdW5jdGlvbi5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnRBICogKE1hdGgucG93KHBhcmFtLCAyKSkgKyB0aGlzLl9jb2VmZmljaWVudEIgKiBwYXJhbSArIHRoaXMuX2ZyZWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBRdWFkcmF0aWNGdW5jdGlvbjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIEZ1bmN0aW9ucy5RdWFkcmF0aWNGdW5jdGlvbiA9IFF1YWRyYXRpY0Z1bmN0aW9uO1xyXG4gICAgfSkoRnVuY3Rpb25zID0gQW5pbWFscy5GdW5jdGlvbnMgfHwgKEFuaW1hbHMuRnVuY3Rpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTY2FsZXM7XHJcbiAgICAoZnVuY3Rpb24gKFNjYWxlcykge1xyXG4gICAgICAgIHZhciBTY2FsZVR5cGVzO1xyXG4gICAgICAgIChmdW5jdGlvbiAoU2NhbGVUeXBlcykge1xyXG4gICAgICAgICAgICBTY2FsZVR5cGVzW1NjYWxlVHlwZXNbXCJzeXN0ZW1cIl0gPSAwXSA9IFwic3lzdGVtXCI7XHJcbiAgICAgICAgICAgIFNjYWxlVHlwZXNbU2NhbGVUeXBlc1tcImFyZ3VtZW50XCJdID0gMV0gPSBcImFyZ3VtZW50XCI7XHJcbiAgICAgICAgfSkoU2NhbGVUeXBlcyA9IFNjYWxlcy5TY2FsZVR5cGVzIHx8IChTY2FsZXMuU2NhbGVUeXBlcyA9IHt9KSk7XHJcbiAgICAgICAgdmFyIFBhcmFtZXRlclNjYWxlVHlwZXM7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChQYXJhbWV0ZXJTY2FsZVR5cGVzKSB7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInN0YXRlXCJdID0gMV0gPSBcInN0YXRlXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInNwZWVkXCJdID0gMl0gPSBcInNwZWVkXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcIndlaWdodFwiXSA9IDNdID0gXCJ3ZWlnaHRcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wiaGVhcnRiZWF0XCJdID0gNF0gPSBcImhlYXJ0YmVhdFwiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJwcmVzc3VyZVwiXSA9IDVdID0gXCJwcmVzc3VyZVwiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJhbW91bnRQb2ludFJlbWVtYmVyV2F0ZXJcIl0gPSA2XSA9IFwiYW1vdW50UG9pbnRSZW1lbWJlcldhdGVyXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcImFtb3VudFBvaW50UmVtZW1iZXJHcmFzc1wiXSA9IDddID0gXCJhbW91bnRQb2ludFJlbWVtYmVyR3Jhc3NcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wiYW1vdW50UG9pbnRSZW1lbWJlck1lYXRcIl0gPSA4XSA9IFwiYW1vdW50UG9pbnRSZW1lbWJlck1lYXRcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wic3BlZWRTYXZ2eVwiXSA9IDldID0gXCJzcGVlZFNhdnZ5XCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInJhZGl1c1Zpc2lvblwiXSA9IDEwXSA9IFwicmFkaXVzVmlzaW9uXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInJhZGl1c0hlYXJpbmdcIl0gPSAxMV0gPSBcInJhZGl1c0hlYXJpbmdcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wicmFkaXVzU21lbGxcIl0gPSAxMl0gPSBcInJhZGl1c1NtZWxsXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInJhZGl1c1RvdWNoXCJdID0gMTNdID0gXCJyYWRpdXNUb3VjaFwiO1xyXG4gICAgICAgIH0pKFBhcmFtZXRlclNjYWxlVHlwZXMgPSBTY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcyB8fCAoU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMgPSB7fSkpO1xyXG4gICAgfSkoU2NhbGVzID0gQW5pbWFscy5TY2FsZXMgfHwgKEFuaW1hbHMuU2NhbGVzID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTY2FsZXM7XHJcbiAgICAoZnVuY3Rpb24gKFNjYWxlcykge1xyXG4gICAgICAgIHZhciBBU2NhbGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBBU2NhbGUoKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFTY2FsZS5wcm90b3R5cGUsIFwibmFtZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJtaW5cIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pbjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21pbiA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGVyY2VudGFnZUluU2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJtYXhcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21heCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGVyY2VudGFnZUluU2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJjdXJyZW50XCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGVyY2VudGFnZUluU2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJwZXJjZW50XCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJjZW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGVyY2VudCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFZhbHVlT25TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcInR5cGVcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgQVNjYWxlLnByb3RvdHlwZS5nZXRQZXJjZW50YWdlSW5TY2FsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmNlbnQgPSAoKHRoaXMuX2N1cnJlbnQgLSB0aGlzLl9taW4pICogMTAwKSAvICh0aGlzLl9tYXggLSB0aGlzLl9taW4pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBBU2NhbGUucHJvdG90eXBlLmdldEN1cnJlbnRWYWx1ZU9uU2NhbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gKCgodGhpcy5fbWF4IC0gdGhpcy5fbWluKSAvIDEwMCkgKiB0aGlzLl9wZXJjZW50KSArIHRoaXMuX21pbjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIEFTY2FsZTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFNjYWxlcy5BU2NhbGUgPSBBU2NhbGU7XHJcbiAgICB9KShTY2FsZXMgPSBBbmltYWxzLlNjYWxlcyB8fCAoQW5pbWFscy5TY2FsZXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFNjYWxlcztcclxuICAgIChmdW5jdGlvbiAoU2NhbGVzKSB7XHJcbiAgICAgICAgdmFyIFNjYWxlRmFjdG9yeSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFNjYWxlRmFjdG9yeSgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1NjYWxlcy5TY2FsZVR5cGVzLnN5c3RlbV0gPSBBbmltYWxzLlNjYWxlcy5TeXN0ZW1TY2FsZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tTY2FsZXMuU2NhbGVUeXBlcy5hcmd1bWVudF0gPSBBbmltYWxzLlNjYWxlcy5Bcmd1bWVudFNjYWxlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFNjYWxlRmFjdG9yeS5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBTY2FsZUZhY3RvcnkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2NhbGVGYWN0b3J5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodHlwZSwgc3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbdHlwZV0gPSBzeXN0ZW07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFNjYWxlRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGZ1bmN0aW9uVHlwZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMuX2ZhY3Rvcmllc1tmdW5jdGlvblR5cGVdKHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBTY2FsZUZhY3Rvcnk7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBTY2FsZXMuU2NhbGVGYWN0b3J5ID0gU2NhbGVGYWN0b3J5O1xyXG4gICAgfSkoU2NhbGVzID0gQW5pbWFscy5TY2FsZXMgfHwgKEFuaW1hbHMuU2NhbGVzID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTY2FsZXM7XHJcbiAgICAoZnVuY3Rpb24gKFNjYWxlcykge1xyXG4gICAgICAgIHZhciBBcmd1bWVudFNjYWxlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKEFyZ3VtZW50U2NhbGUsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEFyZ3VtZW50U2NhbGUocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX25hbWUgPSBwYXJhbXMubmFtZSB8fCBcIk5vIG5hbWVcIjtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9taW4gPSBwYXJhbXMubWluIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fbWF4ID0gcGFyYW1zLm1heCB8fCAxMDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fY3VycmVudCA9IHBhcmFtcy5jdXJyZW50IHx8IF90aGlzLl9tYXg7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcmVzcG9uc2VEZWxheSA9IHBhcmFtcy5yZXNwb25zZURlbGF5IHx8IDEwMDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fdHlwZSA9IHBhcmFtcy50eXBlIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5nZXRQZXJjZW50YWdlSW5TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcmd1bWVudFNjYWxlLnByb3RvdHlwZSwgXCJyZXNwb25zZURlbGF5XCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZURlbGF5O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzcG9uc2VEZWxheSA9IHBhcmFtID8gcGFyYW0gOiAxMDAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcmd1bWVudFNjYWxlLnByb3RvdHlwZSwgXCJjb21tdW5pY2F0b3JcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW11bmljYXRvcjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbW11bmljYXRvciA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIEFyZ3VtZW50U2NhbGUucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSAocGFyYW1zID4gMCkgPyBBbmltYWxzLkNvbW11bmljYXRpb25zLkJlaGF2aW9yU2NhbGVUeXBlcy5pbmNyZWFzZSA6IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMuQmVoYXZpb3JTY2FsZVR5cGVzLmRlY3JlYXNlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhY2sgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6IGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuX3R5cGVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21tdW5pY2F0b3IucHVibGlzaChwYWNrLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBBcmd1bWVudFNjYWxlLnByb3RvdHlwZS5jaGFuZ2UgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV6ID0gdGhpcy5wZXJjZW50ICsgZGVsdGE7XHJcbiAgICAgICAgICAgICAgICBpZiAocmV6IDw9IDEwMCAmJiByZXogPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IHJlejtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRWYWx1ZU9uU2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnRyaWdnZXIoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5yZXNwb25zZURlbGF5KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIEFyZ3VtZW50U2NhbGU7XHJcbiAgICAgICAgfShTY2FsZXMuQVNjYWxlKSk7XHJcbiAgICAgICAgU2NhbGVzLkFyZ3VtZW50U2NhbGUgPSBBcmd1bWVudFNjYWxlO1xyXG4gICAgfSkoU2NhbGVzID0gQW5pbWFscy5TY2FsZXMgfHwgKEFuaW1hbHMuU2NhbGVzID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTY2FsZXM7XHJcbiAgICAoZnVuY3Rpb24gKFNjYWxlcykge1xyXG4gICAgICAgIHZhciBTeXN0ZW1TY2FsZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhTeXN0ZW1TY2FsZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gU3lzdGVtU2NhbGUocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX25hbWUgPSBwYXJhbXMubmFtZSB8fCBcIk5vIG5hbWVcIjtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9taW4gPSBwYXJhbXMubWluIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fbWF4ID0gcGFyYW1zLm1heCB8fCAxMDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fY3VycmVudCA9IHBhcmFtcy5jdXJyZW50IHx8IF90aGlzLl9tYXg7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fdHlwZSA9IHBhcmFtcy50eXBlIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5nZXRQZXJjZW50YWdlSW5TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFN5c3RlbVNjYWxlLnByb3RvdHlwZS5hbmFseXNpcyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXogPSAwO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV6ICs9IHBhcmFtLnBlcmNlbnQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IHJleiAvIHBhcmFtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRWYWx1ZU9uU2NhbGUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbVNjYWxlO1xyXG4gICAgICAgIH0oU2NhbGVzLkFTY2FsZSkpO1xyXG4gICAgICAgIFNjYWxlcy5TeXN0ZW1TY2FsZSA9IFN5c3RlbVNjYWxlO1xyXG4gICAgfSkoU2NhbGVzID0gQW5pbWFscy5TY2FsZXMgfHwgKEFuaW1hbHMuU2NhbGVzID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZV8xKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlTWFjaGluZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFN0YXRlTWFjaGluZShzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTdGF0ZU1hY2hpbmUucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlLnJ1bih0aGlzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5maW5pc2hTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fc3RhdGUuaXNFbmRQb2ludCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLl9zdGF0ZS5nZXROZXh0U3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1bigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU3RhdGVNYWNoaW5lO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lXzEuU3RhdGVNYWNoaW5lID0gU3RhdGVNYWNoaW5lO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBTdGF0ZUZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZUZhY3RvcnkoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tTdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5zdGFydExpZmVdID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUuU3RhdGVTdGFydDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tTdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5zdGFuZF0gPSBBbmltYWxzLlN0YXRlTWFjaGluZS5TdGF0ZVN0YW5kO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1N0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnJ1bl0gPSBBbmltYWxzLlN0YXRlTWFjaGluZS5TdGF0ZVJ1bjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tTdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5kaWVdID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUuU3RhdGVEaWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU3RhdGVGYWN0b3J5Lmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IFN0YXRlRmFjdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdGF0ZUZhY3RvcnkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0eXBlLCBzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW3R5cGVdID0gc3RhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN0YXRlRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKHR5cGVTdGF0ZSwgbmFtZSwgYW5pbWFsLCBpc0VuZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLl9mYWN0b3JpZXNbdHlwZVN0YXRlXShuYW1lLCBhbmltYWwsIGlzRW5kLCBudWxsKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0YXRlRmFjdG9yeTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFN0YXRlTWFjaGluZS5TdGF0ZUZhY3RvcnkgPSBTdGF0ZUZhY3Rvcnk7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFR5cGVzU3RhdGU7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChUeXBlc1N0YXRlKSB7XHJcbiAgICAgICAgICAgIFR5cGVzU3RhdGVbVHlwZXNTdGF0ZVtcInN0YXJ0TGlmZVwiXSA9IDFdID0gXCJzdGFydExpZmVcIjtcclxuICAgICAgICAgICAgVHlwZXNTdGF0ZVtUeXBlc1N0YXRlW1wic3RhbmRcIl0gPSAyXSA9IFwic3RhbmRcIjtcclxuICAgICAgICAgICAgVHlwZXNTdGF0ZVtUeXBlc1N0YXRlW1wicnVuXCJdID0gM10gPSBcInJ1blwiO1xyXG4gICAgICAgICAgICBUeXBlc1N0YXRlW1R5cGVzU3RhdGVbXCJkaWVcIl0gPSA0XSA9IFwiZGllXCI7XHJcbiAgICAgICAgfSkoVHlwZXNTdGF0ZSA9IFN0YXRlTWFjaGluZS5UeXBlc1N0YXRlIHx8IChTdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZSA9IHt9KSk7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFJvdXRlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gUm91dGUoc3RhdGUsIGF2YWlsYWJpbGl0eSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F2YWlsYWJpbGl0eSA9IGF2YWlsYWJpbGl0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBSb3V0ZS5wcm90b3R5cGUuaXNBdmFpbGFibGUgPSBmdW5jdGlvbiAobW9kZWwsIHByb2JhYmlsaXR5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvYmFiaWxpdHkgPT09IHZvaWQgMCkgeyBwcm9iYWJpbGl0eSA9IDEuMDsgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hdmFpbGFiaWxpdHkgJiYgdGhpcy5fYXZhaWxhYmlsaXR5KG1vZGVsLCBwcm9iYWJpbGl0eSkpID8gdGhpcy5fc3RhdGUgOiBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBSb3V0ZS5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBSb3V0ZTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFN0YXRlTWFjaGluZS5Sb3V0ZSA9IFJvdXRlO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBSb3V0ZUVuZ2luZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFJvdXRlRW5naW5lKHJvdXRlcywgbmV4dEVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlcyA9PT0gdm9pZCAwKSB7IHJvdXRlcyA9IFtdOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dEVuZ2luZSA9PT0gdm9pZCAwKSB7IG5leHRFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3V0ZXMgPSByb3V0ZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RW5naW5lID0gbmV4dEVuZ2luZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBSb3V0ZUVuZ2luZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHJvdXRlcykge1xyXG4gICAgICAgICAgICAgICAgKF9hID0gdGhpcy5fcm91dGVzKS5wdXNoLmFwcGx5KF9hLCByb3V0ZXMpO1xyXG4gICAgICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBSb3V0ZUVuZ2luZS5wcm90b3R5cGUuZ2V0Um91dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCB5ZXQuLi4nKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUm91dGVFbmdpbmUucHJvdG90eXBlLnNldE5leHRFbmdpbmUgPSBmdW5jdGlvbiAoZW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RW5naW5lID0gZW5naW5lO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBSb3V0ZUVuZ2luZS5wcm90b3R5cGUuc2V0TW9kZWwgPSBmdW5jdGlvbiAoYW5pbWFsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbCA9IGFuaW1hbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUm91dGVFbmdpbmUucHJvdG90eXBlLl9uZXh0Um91dGVFbmdpbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbmV4dEVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZXh0RW5naW5lLmdldFJvdXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFJvdXRlRW5naW5lO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lLlJvdXRlRW5naW5lID0gUm91dGVFbmdpbmU7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFByb2JhYmlsaXR5Um91dGVFbmdpbmUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZShyb3V0ZXMsIG5leHRFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZXMgPT09IHZvaWQgMCkgeyByb3V0ZXMgPSBbXTsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRFbmdpbmUgPT09IHZvaWQgMCkgeyBuZXh0RW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIHJvdXRlcywgbmV4dEVuZ2luZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBQcm9iYWJpbGl0eVJvdXRlRW5naW5lLnByb3RvdHlwZS5nZXRSb3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvYmFiaWxpdHkgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvdXRlcyA9IHRoaXMuX3JvdXRlcy5maWx0ZXIoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZS5pc0F2YWlsYWJsZShfdGhpcy5fbW9kZWwsIHByb2JhYmlsaXR5KTsgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVzLmxlbmd0aCA+IDAgPyByb3V0ZXNbMF0gOiB0aGlzLl9uZXh0Um91dGVFbmdpbmUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb2JhYmlsaXR5Um91dGVFbmdpbmU7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuUm91dGVFbmdpbmUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZSA9IFByb2JhYmlsaXR5Um91dGVFbmdpbmU7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFNpbXBsZVJvdXRlRW5naW5lID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKFNpbXBsZVJvdXRlRW5naW5lLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTaW1wbGVSb3V0ZUVuZ2luZShyb3V0ZXMsIG5leHRFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZXMgPT09IHZvaWQgMCkgeyByb3V0ZXMgPSBbXTsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRFbmdpbmUgPT09IHZvaWQgMCkgeyBuZXh0RW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIHJvdXRlcywgbmV4dEVuZ2luZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTaW1wbGVSb3V0ZUVuZ2luZS5wcm90b3R5cGUuZ2V0Um91dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvdXRlcyA9IHRoaXMuX3JvdXRlcy5maWx0ZXIoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZS5pc0F2YWlsYWJsZShfdGhpcy5fbW9kZWwpOyB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZXMubGVuZ3RoID4gMCA/IHJvdXRlc1swXSA6IHRoaXMuX25leHRSb3V0ZUVuZ2luZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU2ltcGxlUm91dGVFbmdpbmU7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuUm91dGVFbmdpbmUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuU2ltcGxlUm91dGVFbmdpbmUgPSBTaW1wbGVSb3V0ZUVuZ2luZTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgU3RhdGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZShuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIGlzRW5kUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZUVuZ2luZSA9PT0gdm9pZCAwKSB7IHJvdXRlRW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzRW5kUG9pbnQgPT09IHZvaWQgMCkgeyBpc0VuZFBvaW50ID0gZmFsc2U7IH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwgPSBtb2RlbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JvdXRlRW5naW5lID0gcm91dGVFbmdpbmU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0VuZFBvaW50ID0gaXNFbmRQb2ludDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTdGF0ZS5wcm90b3R5cGUuZ2V0TmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdGF0ZS5wcm90b3R5cGUuZ2V0TmV4dFN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9yb3V0ZUVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHJvdXRlID0gdGhpcy5fcm91dGVFbmdpbmUuZ2V0Um91dGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZSA/IHJvdXRlLmdldFN0YXRlKCkgOiB0aGlzO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdGF0ZS5wcm90b3R5cGUuaXNFbmRQb2ludCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0VuZFBvaW50O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdGF0ZS5wcm90b3R5cGUuc2V0Um91dGVFbmdpbmUgPSBmdW5jdGlvbiAocm91dGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JvdXRlRW5naW5lID0gcm91dGVFbmdpbmU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3V0ZUVuZ2luZS5zZXRNb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN0YXRlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkIHlldC4uLicpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdGF0ZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCB5ZXQuLi4nKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0YXRlO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lLlN0YXRlID0gU3RhdGU7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlRGllID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKFN0YXRlRGllLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZURpZShuYW1lLCBtb2RlbCwgaXNFbmRQb2ludCwgcm91dGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAocm91dGVFbmdpbmUgPT09IHZvaWQgMCkgeyByb3V0ZUVuZ2luZSA9IG51bGw7IH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIGlzRW5kUG9pbnQpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU3RhdGVEaWUucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0YPQvNC10YAnKTtcclxuICAgICAgICAgICAgICAgIG5leHQuZmluaXNoU3RhdGUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0YXRlRGllO1xyXG4gICAgICAgIH0oU3RhdGVNYWNoaW5lLlN0YXRlKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lLlN0YXRlRGllID0gU3RhdGVEaWU7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlUnVuID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKFN0YXRlUnVuLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZVJ1bihuYW1lLCBtb2RlbCwgaXNFbmRQb2ludCwgcm91dGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAocm91dGVFbmdpbmUgPT09IHZvaWQgMCkgeyByb3V0ZUVuZ2luZSA9IG51bGw7IH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIGlzRW5kUG9pbnQpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU3RhdGVSdW4ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0LHQtdCz0YMnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLm11c2N1bGFyLmNoYW5nZVNwZWVkKC0wLjQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwubXVzY3VsYXIuY2hhbmdlV2VpZ2h0KC0wLjUpO1xyXG4gICAgICAgICAgICAgICAgbmV4dC5maW5pc2hTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU3RhdGVSdW47XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuU3RhdGUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuU3RhdGVSdW4gPSBTdGF0ZVJ1bjtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgU3RhdGVTdGFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhTdGF0ZVN0YW5kLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZVN0YW5kKG5hbWUsIG1vZGVsLCBpc0VuZFBvaW50LCByb3V0ZUVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzRW5kUG9pbnQgPT09IHZvaWQgMCkgeyBpc0VuZFBvaW50ID0gZmFsc2U7IH1cclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZUVuZ2luZSA9PT0gdm9pZCAwKSB7IHJvdXRlRW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIG1vZGVsLCByb3V0ZUVuZ2luZSwgaXNFbmRQb2ludCkgfHwgdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTdGF0ZVN0YW5kLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9GB0YLQvtGOJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5tdXNjdWxhci5jaGFuZ2VTcGVlZCgwLjUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwubXVzY3VsYXIuY2hhbmdlV2VpZ2h0KDAuNyk7XHJcbiAgICAgICAgICAgICAgICBuZXh0LmZpbmlzaFN0YXRlKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBTdGF0ZVN0YW5kO1xyXG4gICAgICAgIH0oU3RhdGVNYWNoaW5lLlN0YXRlKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lLlN0YXRlU3RhbmQgPSBTdGF0ZVN0YW5kO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBTdGF0ZVN0YXJ0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKFN0YXRlU3RhcnQsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFN0YXRlU3RhcnQobmFtZSwgbW9kZWwsIGlzRW5kUG9pbnQsIHJvdXRlRW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNFbmRQb2ludCA9PT0gdm9pZCAwKSB7IGlzRW5kUG9pbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgbW9kZWwsIHJvdXRlRW5naW5lLCBpc0VuZFBvaW50KSB8fCB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFN0YXRlU3RhcnQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QsNGH0LDQuyDQttC40YLRjCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwubXVzY3VsYXIuY2hhbmdlU3BlZWQoMC4wMDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwubXVzY3VsYXIuY2hhbmdlV2VpZ2h0KDAuMDAxKTtcclxuICAgICAgICAgICAgICAgIHZhciBrID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTAwMDAwMDA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgKz0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5leHQuZmluaXNoU3RhdGUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0YXRlU3RhcnQ7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuU3RhdGUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuU3RhdGVTdGFydCA9IFN0YXRlU3RhcnQ7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFBhdHRlcm5TdGF0ZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhQYXR0ZXJuU3RhdGUsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFBhdHRlcm5TdGF0ZShuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIHN0YXRlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGVzID09PSB2b2lkIDApIHsgc3RhdGVzID0gW107IH1cclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIG1vZGVsLCByb3V0ZUVuZ2luZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgICAgIF90aGlzLl9zdGF0ZXMgPSBzdGF0ZXM7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgUGF0dGVyblN0YXRlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUGF0dGVyblN0YXRlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX3N0YXRlc1swXTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUucnVuKG1vZGVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUGF0dGVyblN0YXRlLnByb3RvdHlwZS5nZXROYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9zdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ3VycmVudCBzdGF0ZSBub3QgaW5pdGlhbGl6ZWQuLi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5nZXROYW1lKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBQYXR0ZXJuU3RhdGU7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuU3RhdGUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuUGF0dGVyblN0YXRlID0gUGF0dGVyblN0YXRlO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBQcmltaXRpdmVTdGF0ZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhQcmltaXRpdmVTdGF0ZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gUHJpbWl0aXZlU3RhdGUobmFtZSwgbW9kZWwsIGlzRW5kUG9pbnQsIHJvdXRlRW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNFbmRQb2ludCA9PT0gdm9pZCAwKSB7IGlzRW5kUG9pbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgbW9kZWwsIHJvdXRlRW5naW5lLCBpc0VuZFBvaW50KSB8fCB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFByaW1pdGl2ZVN0YXRlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGltcGxlbWVudGF0aW9uIHN0YXR1cy4uLicpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gUHJpbWl0aXZlU3RhdGU7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuU3RhdGUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuUHJpbWl0aXZlU3RhdGUgPSBQcmltaXRpdmVTdGF0ZTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3lzdGVtcztcclxuICAgIChmdW5jdGlvbiAoU3lzdGVtcykge1xyXG4gICAgICAgIHZhciBTeXN0ZW1UeXBlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFN5c3RlbVR5cGVzKSB7XHJcbiAgICAgICAgICAgIFN5c3RlbVR5cGVzW1N5c3RlbVR5cGVzW1wibXVzY3VsYXJcIl0gPSAxXSA9IFwibXVzY3VsYXJcIjtcclxuICAgICAgICAgICAgU3lzdGVtVHlwZXNbU3lzdGVtVHlwZXNbXCJjaXJjdWxhdG9yeVwiXSA9IDJdID0gXCJjaXJjdWxhdG9yeVwiO1xyXG4gICAgICAgICAgICBTeXN0ZW1UeXBlc1tTeXN0ZW1UeXBlc1tcIm1lbW9yeVwiXSA9IDNdID0gXCJtZW1vcnlcIjtcclxuICAgICAgICAgICAgU3lzdGVtVHlwZXNbU3lzdGVtVHlwZXNbXCJuYXZpZ2F0aW9uXCJdID0gNF0gPSBcIm5hdmlnYXRpb25cIjtcclxuICAgICAgICB9KShTeXN0ZW1UeXBlcyA9IFN5c3RlbXMuU3lzdGVtVHlwZXMgfHwgKFN5c3RlbXMuU3lzdGVtVHlwZXMgPSB7fSkpO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIFN5c3RlbUZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTeXN0ZW1GYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3lzdGVtcy5TeXN0ZW1UeXBlcy5tdXNjdWxhcl0gPSBBbmltYWxzLlN5c3RlbXMuTXVzY3VsYXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeV0gPSBBbmltYWxzLlN5c3RlbXMuQ2lyY3VsYXRvcnk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3lzdGVtcy5TeXN0ZW1UeXBlcy5uYXZpZ2F0aW9uXSA9IEFuaW1hbHMuU3lzdGVtcy5OYXZpZ2F0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFN5c3RlbUZhY3RvcnkuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgU3lzdGVtRmFjdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTeXN0ZW1GYWN0b3J5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodHlwZSwgc3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbdHlwZV0gPSBzeXN0ZW07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN5c3RlbUZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChmdW5jdGlvblR5cGUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLl9mYWN0b3JpZXNbZnVuY3Rpb25UeXBlXShwYXJhbXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtRmFjdG9yeTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFN5c3RlbXMuU3lzdGVtRmFjdG9yeSA9IFN5c3RlbUZhY3Rvcnk7XHJcbiAgICB9KShTeXN0ZW1zID0gQW5pbWFscy5TeXN0ZW1zIHx8IChBbmltYWxzLlN5c3RlbXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN5c3RlbXM7XHJcbiAgICAoZnVuY3Rpb24gKFN5c3RlbXMpIHtcclxuICAgICAgICB2YXIgQ2lyY3VsYXRvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBDaXJjdWxhdG9yeShzY2FsZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zdGF0ZV0gfHwgbmV3IEFuaW1hbHMuU2NhbGVzLlN5c3RlbVNjYWxlKFtdKTtcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhcnRiZWF0ID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuaGVhcnRiZWF0XTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlc3N1cmUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5wcmVzc3VyZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENpcmN1bGF0b3J5LnByb3RvdHlwZSwgXCJoZWFydGJlYXRcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlYXJ0YmVhdDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXQgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENpcmN1bGF0b3J5LnByb3RvdHlwZSwgXCJwcmVzc3VyZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJlc3N1cmU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJlc3N1cmUgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgQ2lyY3VsYXRvcnkucHJvdG90eXBlLmNoYW5nZUhlYXJ0YmVhdCA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0LmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENpcmN1bGF0b3J5LnByb3RvdHlwZS5jaGFuZ2VQcmVzc3VyZSA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3N1cmUuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2lyY3VsYXRvcnkucHJvdG90eXBlLmFuYWx5c2lzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5hbmFseXNpcyhbXSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBDaXJjdWxhdG9yeTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFN5c3RlbXMuQ2lyY3VsYXRvcnkgPSBDaXJjdWxhdG9yeTtcclxuICAgIH0pKFN5c3RlbXMgPSBBbmltYWxzLlN5c3RlbXMgfHwgKEFuaW1hbHMuU3lzdGVtcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3lzdGVtcztcclxuICAgIChmdW5jdGlvbiAoU3lzdGVtcykge1xyXG4gICAgICAgIHZhciBNdXNjdWxhciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE11c2N1bGFyKHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnN0YXRlXSB8fCBuZXcgQW5pbWFscy5TY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZCA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkXTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0ID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMud2VpZ2h0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTXVzY3VsYXIucHJvdG90eXBlLCBcInNwZWVkXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGVlZDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGVlZCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTXVzY3VsYXIucHJvdG90eXBlLCBcIndlaWdodFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTXVzY3VsYXIucHJvdG90eXBlLCBcImN1cnJlbnRQb2ludFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFBvaW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFBvaW50LnggPSBwYXJhbS54O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQb2ludC55ID0gcGFyYW0ueTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBNdXNjdWxhci5wcm90b3R5cGUuY2hhbmdlU3BlZWQgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NwZWVkLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11c2N1bGFyLnByb3RvdHlwZS5jaGFuZ2VXZWlnaHQgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodC5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmFseXNpcygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdXNjdWxhci5wcm90b3R5cGUuYW5hbHlzaXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmFuYWx5c2lzKFtdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIE11c2N1bGFyO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU3lzdGVtcy5NdXNjdWxhciA9IE11c2N1bGFyO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIE5hdmlnYXRpb24gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBOYXZpZ2F0aW9uKHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnN0YXRlXSB8fCBuZXcgQW5pbWFscy5TY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZFNhdnZ5ID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuc3BlZWRTYXZ2eV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c0hlYXJpbmcgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNIZWFyaW5nXTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFkaXVzU21lbGwgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNTbWVsbF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c1Zpc2lvbiA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnJhZGl1c1Zpc2lvbl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c1RvdWNoID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVG91Y2hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXZpZ2F0aW9uLnByb3RvdHlwZSwgXCJzcGVlZFNhdnZ5XCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGVlZFNhdnZ5O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwZWVkU2F2dnkgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdmlnYXRpb24ucHJvdG90eXBlLCBcInJhZGl1c1Zpc2lvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzVmlzaW9uO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c1Zpc2lvbiA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmF2aWdhdGlvbi5wcm90b3R5cGUsIFwicmFkaXVzSGVhcmluZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzSGVhcmluZztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNIZWFyaW5nID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXZpZ2F0aW9uLnByb3RvdHlwZSwgXCJyYWRpdXNTbWVsbFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzU21lbGw7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzU21lbGwgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdmlnYXRpb24ucHJvdG90eXBlLCBcInJhZGl1c1RvdWNoXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYWRpdXNUb3VjaDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNUb3VjaCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBOYXZpZ2F0aW9uLnByb3RvdHlwZS5jaGFuZ2VTcGVlZFNhdnZ5ID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGVlZFNhdnZ5LmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmNoYW5nZVJhZGl1c1Zpc2lvbiA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzVmlzaW9uLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmNoYW5nZVJhZGl1c0hlYXJpbmcgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c0hlYXJpbmcuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTmF2aWdhdGlvbi5wcm90b3R5cGUuY2hhbmdlUmFkaXVzU21lbGwgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c1NtZWxsLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmNoYW5nZVJhZGl1c1RvdWNoID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNUb3VjaC5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmFseXNpcygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBOYXZpZ2F0aW9uLnByb3RvdHlwZS5hbmFseXNpcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuYW5hbHlzaXMoW10pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gTmF2aWdhdGlvbjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFN5c3RlbXMuTmF2aWdhdGlvbiA9IE5hdmlnYXRpb247XHJcbiAgICB9KShTeXN0ZW1zID0gQW5pbWFscy5TeXN0ZW1zIHx8IChBbmltYWxzLlN5c3RlbXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIE1hcEdhbWU7XHJcbihmdW5jdGlvbiAoTWFwR2FtZSkge1xyXG4gICAgdmFyIE1hcCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gTWFwKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBNYXAuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5faW5zdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zdCA9IG5ldyBNYXAoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5zdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcIndvcmxkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dvcmxkID0gbWFwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemF0aW9uV29ybGQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV29ybGQgd2FzIG5vdCBmb3VuZC4uLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWFwLnByb3RvdHlwZSwgXCJvYnN0YWNsZXNMYXllclwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vYnN0YWNsZXNMYXllciA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXllciBvYnN0YWNsZSB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcIndhdGVyTGF5ZXJcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChsYXllcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2F0ZXJMYXllciA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXllciB3YXRlciB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcInRyZWVMYXllclwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmVlTGF5ZXIgPSBsYXllcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTGF5ZXIgdHJlZSB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2luaXRpYWxpemF0aW9uV29ybGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemF0aW9uTGF5ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fc2l6ZU1hcFRpbGVkID0gdGhpcy5fd29ybGQuZ2V0TWFwU2l6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplVGlsZWQgPSB0aGlzLl93b3JsZC5nZXRUaWxlU2l6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplTWFwUGl4ZWwgPSB0aGlzLl9nZXRTaXplTWFwUGl4ZWwoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2luaXRpYWxpemF0aW9uTGF5ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzdGFjbGVzTGF5ZXIgPSB0aGlzLl93b3JsZC5nZXRMYXllcignb2JzdGFjbGUnKTtcclxuICAgICAgICAgICAgdGhpcy53YXRlckxheWVyID0gdGhpcy5fd29ybGQuZ2V0TGF5ZXIoJ3dhdGVyJyk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZUxheWVyID0gdGhpcy5fd29ybGQuZ2V0TGF5ZXIoJ3RyZWUnKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2dldFNpemVNYXBQaXhlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNpemVYID0gdGhpcy5fc2l6ZU1hcFRpbGVkLndpZHRoICogdGhpcy5fc2l6ZVRpbGVkLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgc2l6ZVkgPSB0aGlzLl9zaXplTWFwVGlsZWQuaGVpZ2h0ICogdGhpcy5fc2l6ZVRpbGVkLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHNpemVYLCBzaXplWSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXAucHJvdG90eXBlLmNvbnZlcnRUaWxlZFBvcyA9IGZ1bmN0aW9uIChwb3NJblBpeGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gTWF0aC5mbG9vcigocG9zSW5QaXhlbC54KSAvIHRoaXMuX3NpemVUaWxlZC53aWR0aCk7XHJcbiAgICAgICAgICAgIHZhciB5ID0gTWF0aC5mbG9vcigodGhpcy5fc2l6ZU1hcFBpeGVsLnkgLSAocG9zSW5QaXhlbC55KSkgLyB0aGlzLl9zaXplVGlsZWQuaGVpZ2h0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5jb252ZXJ0UGl4ZWxQb3MgPSBmdW5jdGlvbiAocG9zSW5UaWxlZCkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvc0luVGlsZWQueCAqIHRoaXMuX3NpemVUaWxlZC53aWR0aCArIHRoaXMuX3NpemVUaWxlZC53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5fc2l6ZU1hcFBpeGVsLnkgLSAocG9zSW5UaWxlZC55ICogdGhpcy5fc2l6ZVRpbGVkLmhlaWdodCkgLSB0aGlzLl9zaXplVGlsZWQuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5pc0NoZdGBa09ic3RhY2xlID0gZnVuY3Rpb24gKGdpZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb3JyZWN0UG9zKGdpZCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vYnN0YWNsZXNMYXllci5nZXRUaWxlR0lEQXQoZ2lkLngsIGdpZC55KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2lzQ29ycmVjdFBvcyA9IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgICAgICAgaWYgKHBvcy54IDwgMCB8fCBwb3MueSA8IDAgfHwgcG9zLnggPiB0aGlzLl9zaXplTWFwVGlsZWQud2lkdGggLSAxIHx8IHBvcy55ID4gdGhpcy5fc2l6ZU1hcFRpbGVkLmhlaWdodCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBNYXA7XHJcbiAgICB9KCkpO1xyXG4gICAgTWFwR2FtZS5NYXAgPSBNYXA7XHJcbn0pKE1hcEdhbWUgfHwgKE1hcEdhbWUgPSB7fSkpO1xyXG52YXIgbGlvbiA9IHtcclxuICAgIG5hbWU6ICfQm9C10LInLFxyXG4gICAgc3lzdGVtczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLm11c2N1bGFyLFxyXG4gICAgICAgICAgICBzY2FsZXNUeXBlOiBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuc3BlZWQgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZCB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLndlaWdodCB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeSxcclxuICAgICAgICAgICAgc2NhbGVzVHlwZTogW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnByZXNzdXJlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuaGVhcnRiZWF0IH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLm5hdmlnYXRpb24sXHJcbiAgICAgICAgICAgIHNjYWxlc1R5cGU6IFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZFNhdnZ5IH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVmlzaW9uIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzU21lbGwgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNIZWFyaW5nIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVG91Y2ggfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgc2NhbGVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuaGVhcnRiZWF0LFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQodC10YDQtNGG0LXQsdC40LXQvdC40LUnLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOSxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAwLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VEZWxheTogMC4xMixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucHJlc3N1cmUsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9CU0LDQstC70LXQvdC40LUnLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOCxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZURlbGF5OiAwLjEzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQodC60L7RgNC+0YHRgtGMJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDksXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMTIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLndlaWdodCxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0JLQtdGBJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDgsXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VEZWxheTogMC4xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkU2F2dnksXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9CS0YDQtdC80Y8g0YHQvNC10LrQsNC70LrQuCcsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50OiA4LFxyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiAxMCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVTY2FsZTogQW5pbWFscy5TY2FsZXMuU2NhbGVUeXBlcy5hcmd1bWVudCxcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNUb3VjaCxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KDQsNC00LjRg9GBINC+0YHRj9C30LDQvdC40Y8nLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOSxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZURlbGF5OiAwLjFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVmlzaW9uLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQoNCw0LTQuNGD0YEg0LfRgNC10L3QuNGPJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDQwLFxyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiA4MCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBjb21tdW5pY2F0aW9uOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkLFxyXG4gICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy53ZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMuQmVoYXZpb3JTY2FsZVR5cGVzLmluY3JlYXNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogQW5pbWFscy5GdW5jdGlvbnMuRnVuY3Rpb25UeXBlcy5saW5lLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAwLjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAuMThcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMud2VpZ2h0LFxyXG4gICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZCxcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogQW5pbWFscy5Db21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMuZGVjcmVhc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zOiBBbmltYWxzLkZ1bmN0aW9ucy5GdW5jdGlvblR5cGVzLmxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAuNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMC4xXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBzdGF0ZXM6IHtcclxuICAgICAgICBzdGF0ZTogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KHRgtCw0YDRgicsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnN0YXJ0TGlmZSxcclxuICAgICAgICAgICAgICAgIGlzRW5kOiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0JHQtdCz0YMnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5ydW4sXHJcbiAgICAgICAgICAgICAgICBpc0VuZDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9Ch0YLQvtGOJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuc3RhbmQsXHJcbiAgICAgICAgICAgICAgICBpc0VuZDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9Cj0LzQtdGAJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuZGllLFxyXG4gICAgICAgICAgICAgICAgaXNFbmQ6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgbGlua3M6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5zdGFydExpZmUsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnJ1bixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDAuN1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnN0YW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC43XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuZGllLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC4wMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5zdGFuZCxcclxuICAgICAgICAgICAgICAgIGxpbms6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUucnVuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC43XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuZGllLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC4wMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5ydW4sXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLmRpZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDAuNlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnN0YW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC45XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUucnVuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC4xXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWlsZC10cy5qcy5tYXAiLCJpbXBvcnQgeyBDaXJjdWxhckxpc3QgfSBmcm9tICcuL2NpcmN1bGFyLWxpc3QnO1xyXG5cclxuLyoqXHJcbiAqINCd0LDRgdGC0YDQsNC40LLQsNC10YIg0LrRgNGD0LPQu9C+0LUg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAqIEBjbGFzcyBDaXJjdWxhckxpc3RBY3Rpb25zQW5pbWFsXHJcbiAqIEBleHRlbmRzIENpcmN1bGFyTGlzdFxyXG4gKi9cclxudmFyIENpcmN1bGFyTGlzdEFjdGlvbnNBbmltYWwgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBDaXJjdWxhckxpc3QsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0YHRgtGA0L7QudC60LAg0LzQtdC90Y4g0LTQu9GPINC60L7QvdC60YDQtdGC0L3QvtCz0L4g0LbQuNCy0L7RgtC90L7Qs9C+LiDQndCw0YHRgtGA0LDQuNCy0LDQtdGCINGA0LDQtNC40YPRgSDQutGA0YPQs9CwLlxyXG4gICAgICogQG1ldGhvZCBzZXR0aW5nc1xyXG4gICAgICogQHBhcmFtIHtjYy5Db21wb25lbnR9IGNvbnRyb2xsZXJBbmltYWwg0LrQvtC90YLRgNC+0LvQu9C10YAg0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICovXHJcbiAgICBzZXR0aW5ncyhjb250cm9sbGVyQW5pbWFsKXtcclxuICAgICAgICBsZXQgbm9kZSA9IGNvbnRyb2xsZXJBbmltYWwubm9kZTtcclxuXHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSBub2RlLndpZHRoICogMS43NTtcclxuICAgICAgICBpZiAodGhpcy5yYWRpdXMgPiAxNTApIHtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgPSAxNTA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJhZGl1cyA8IDEwMCkge1xyXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyA9IDEwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JlZnJlc2hNZW51KCk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7IENpcmN1bGFyTGlzdEFjdGlvbnNBbmltYWwgfTsiLCIvKipcclxuICog0KHQvtGB0YLQvtGP0L3QuNC1INC00LLQuNC20LXQvdC40Y8g0LzQtdC90Y4gKNC/0L4g0YfQsNGB0L7QstC+0Lkv0L/RgNC+0YLQuNCyINGH0LDRgdC+0LLQvtC5KS5cclxuICogQHR5cGUge01vdmVDaXJjdWxhcn1cclxuICogQHN0YXRpY1xyXG4gKiBAZWxlbWVudCB7bnVtYmVyfSBjbG9ja3dpc2Ug0LrRgNGD0YLQuNGC0YHRjyDQv9C+INGH0LDRgdC+0LLQvtC5LlxyXG4gKiBAZWxlbWVudCB7bnVtYmVyfSBhbnRpY2xvY2t3aXNlINC60YDRg9GC0LjRgtGB0Y8g0L/RgNC+0YLQuNCyINGH0LDRgdC+0LLQvtC5LlxyXG4gKi9cclxuY29uc3QgTW92ZUNpcmN1bGFyID0ge1xyXG4gICAgY2xvY2t3aXNlOiAwLC8v0L/QviDRh9Cw0YHQvtCy0L7QuVxyXG4gICAgYW50aWNsb2Nrd2lzZTogMSwvL9C/0YDQvtGC0LjQsiDRh9Cw0YHQvtCy0L7QuVxyXG59O1xyXG5cclxuLyoqXHJcbiAqINCS0YvQv9C+0LvQvdGP0LXRgiDQstGA0LDRidC10L3QuNC10Lgg0YDQsNC30LzQtdGJ0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyINC/0L4g0L7QutGA0YPQttC90L7RgdGC0LguXHJcbiAqIEBjbGFzcyBDaXJjdWxhckxpc3RcclxuICovXHJcbnZhciBDaXJjdWxhckxpc3QgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9sZW5ndGhCZXR3ZWVuUG9pbnRzOiAwLC8v0YDQsNGB0YHRgtC+0Y/QvdC40LUg0LzQtdC20LTRgyDRjdC70LXQvNC10L3RgtCw0LzQuFxyXG4gICAgICAgIF9jZW50cmU6IGNjLlZlYzIsLy/QptC10L3RgtGAINC60YDRg9Cz0LBcclxuICAgICAgICBfYXJyYXlBbmdsZUxpc3Q6IFtdLC8vL9C80LDRgdGB0LjQsiDRg9Cz0LvQvtCyINC70LjRgdGC0L7QsiDQvdCwINC60L7RgtC+0YDRi9GFINC+0L3QuCDQvdCw0YXQvtC00Y/RgtGB0Y9cclxuICAgICAgICBfcG9vbEludmlzaWJsZUxpc3Q6IFtdLC8v0LzQsNGB0YHQuNCyINC90LXQstC40LTQuNC80YvRhSDQu9C40YHRgtC+0LJcclxuICAgICAgICBfcHJldlJvdGF0aW9uOiAwLC8v0L/RgNC10LTRi9C00YPRidC40Lkg0YPQs9C+0Lsg0LLQvtCy0L7RgNC+0YLQsCDQtNC+INGC0LXQutGD0YnQtdCz0L4g0L/QvtCy0L7RgNC+0YLQsFxyXG4gICAgICAgIF9zdGF0ZURpcmVjdGlvbjogTW92ZUNpcmN1bGFyLmNsb2Nrd2lzZSwvL9C90LDQv9GA0LDQstC70LXQvdC40LUg0LTQstC40LbQtdC90LjRj1xyXG5cclxuICAgICAgICBhbW91bnRWaXNpYmxMaXN0OiA3LC8v0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQuNC00LjQvNGL0YUg0LvQuNC/0LXRgdGC0LrQvtCyINC80LXQvdGOXHJcbiAgICAgICAgYW5nbGVUcmFuc2l0aW9uOiAyMjUsLy/Rg9Cz0L7QuyDQv9C10YDQtdGF0L7QtNCwINC4INC/0L7Rj9Cy0LvQtdC90LjRj9C90L7QstGL0YUg0LvQuNC/0LXRgdGC0LrQvtCyXHJcbiAgICAgICAgd2lkdGhUcmFuc2l0aW9uOiAwLjMsLy/RiNC40YDQuNC90LAg0L/QtdGA0LXRhdC+0LTQsCDQsiDQs9GA0LDQtNGD0YHQsNGFXHJcbiAgICAgICAgcmFkaXVzOiAxMzAsLy/RgNCw0LTQuNGD0YEg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTRg9GCINC60YDRg9GC0LjRgtGB0Y8g0LLRgdC1INC60L3QvtC/0LrQuFxyXG4gICAgICAgIHNlbnNpdGl2aXR5OiAxLC8v0KfRg9Cy0YHRgtCy0LjRgtC10LvQvdC+0YHRgtGMINCx0LDRgNCw0LHQsNC90LAg0Log0LTQstC40LbQtdC90LjRjiDRgdCy0LDQudC/0LAg0L/QviDQutC+0L7RgNC00LjQvdCw0YLQtVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIHRoaXMuX3BsYWNlbWVudExpc3RzTWVudSgpO1xyXG4gICAgICAgIHRoaXMuX3ByZXZSb3RhdGlvbiA9IHRoaXMubm9kZS5yb3RhdGlvbjtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC40YLRjCDQv9C+0LfQuNGG0LjQuCDQutC90L7Qv9C+0Log0LIg0LzQtdC90Y4uINChINGD0YfQtdGC0L7QvCDRgNCw0LTQuNGD0YHQsCDQvtC60YDRg9C20L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgX3JlZnJlc2hNZW51XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcmVmcmVzaE1lbnUoKXtcclxuICAgICAgICB0aGlzLl9wbGFjZW1lbnRMaXN0c01lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0YHQv9GA0LXQtNC10LvQtdC90LjQtSDQutC90L7Qv9C+0Log0L/QviDQvtC60YDRg9C20L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgX3BsYWNlbWVudExpc3RzTWVudVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3BsYWNlbWVudExpc3RzTWVudSgpe1xyXG4gICAgICAgIC8v0YDQsNGB0YHRh9C40YLRi9Cy0LDQtdC8INGG0LXQvdGC0YAg0LrRgNGD0LPQsFxyXG4gICAgICAgIGxldCB3aW5kb3cgPSB0aGlzLm5vZGUucGFyZW50O1xyXG4gICAgICAgIGxldCBjdXJyZW50UmFkaWFucyA9IDAsIHgsIHk7XHJcbiAgICAgICAgdGhpcy5fYXJyYXlBbmdsZUxpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLl9wb29sSW52aXNpYmxlTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLl9jZW50cmUgPSBjYy52Mih3aW5kb3cud2lkdGggLyAyLCB3aW5kb3cuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgdGhpcy5fbGVuZ3RoQmV0d2VlblBvaW50cyA9IDIgKiBNYXRoLlBJIC8gdGhpcy5hbW91bnRWaXNpYmxMaXN0O1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRSYWRpYW5zID49IDIgKiBNYXRoLlBJKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9vbEludmlzaWJsZUxpc3QucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHkgPSB0aGlzLnJhZGl1cyAqIE1hdGguc2luKGN1cnJlbnRSYWRpYW5zKTtcclxuICAgICAgICAgICAgICAgIHggPSB0aGlzLnJhZGl1cyAqIE1hdGguY29zKGN1cnJlbnRSYWRpYW5zKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2V0UG9zaXRpb24oeCwgeSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hcnJheUFuZ2xlTGlzdC5wdXNoKHtpdGVtOiBpdGVtLCBhbmdsZTogY3VycmVudFJhZGlhbnMgKiAoMTgwIC8gTWF0aC5QSSl9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudFJhZGlhbnMgKz0gdGhpcy5fbGVuZ3RoQmV0d2VlblBvaW50cztcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC90LDQv9GA0LDQstC70LXQvdC40Y8g0LLRgNCw0YnQtdC90LjRjyDQuCDQstGL0LfRi9Cy0LDQtdGCINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQuSDQvtCx0YDQsNCx0L7RgtGH0LjQuiwg0L/QtdGA0LXQtNCw0LLQsNGPINC30L3QsNGH0LXQvdC40Y8g0YFcclxuICAgICAqINGD0YfQtdGC0L7QvCDRh9GD0LLRgdGC0LLQuNGC0LXQu9GM0L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgZGlyZWN0aW9uUm90YXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4INC00LXQu9GM0YLQsCDQuNC30LzQtdC90LXQvdC40Y8g0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQuNC30LzQtdC90LXQvdC40Y8g0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY1gg0L/QvtC70L7QttC10L3QuNC1INGC0LDRh9CwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jWSDQv9C+0LvQvtC20LXQvdC40LUg0YLQsNGH0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICovXHJcbiAgICBkaXJlY3Rpb25Sb3RhdGlvbih4LCB5LCBsb2NYLCBsb2NZKXtcclxuICAgICAgICAvL9C/0YDQuNC80LXQvdGP0LXQvCDRh9GD0LLRgdGC0LLQuNGC0LXQu9GM0L3QvtGB0YLRjFxyXG4gICAgICAgIHggPSB4ICogdGhpcy5zZW5zaXRpdml0eTtcclxuICAgICAgICB5ID0geSAqIHRoaXMuc2Vuc2l0aXZpdHk7XHJcblxyXG4gICAgICAgIGlmIChsb2NYID4gdGhpcy5fY2VudHJlLnggJiYgbG9jWSA+IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjEoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYIDwgdGhpcy5fY2VudHJlLnggJiYgbG9jWSA+IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjIoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYIDwgdGhpcy5fY2VudHJlLnggJiYgbG9jWSA8IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjMoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYID4gdGhpcy5fY2VudHJlLnggJiYgbG9jWSA8IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjQoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IDAuMDAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2V0RGlyZWN0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFtb3VudFZpc2libExpc3QgPCB0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmtpbmdWaXNpYmxlRWxlbWVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNCx0L7RgtCw0LXRgiDRgSDQv9C+0Y/QstC70LXQvdC40LXQvCDRjdC70LXQvNC10L3RgtC+0LIuXHJcbiAgICAgKiBAbWV0aG9kIF93b3JraW5nVmlzaWJsZUVsZW1lbnRzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfd29ya2luZ1Zpc2libGVFbGVtZW50cygpe1xyXG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMuZ2V0QW5nbGVNZW51KCk7XHJcbiAgICAgICAgLy/Qo9C30L3QsNC10Lwg0LTQu9GPINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0LXQs9C+INGD0LPQvtC7INC90LAg0LrQvtGC0L7RgNC+0Lwg0L7QvSDQvdCw0YXQvtC00LjRgtGB0Y9cclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N3YXBFbGVtZW50KHRoaXMuZ2V0QW5nbGVMaXN0KGl0ZW0sIGFuZ2xlKSwgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYW5nbGUgPSB0aGlzLmdldEFuZ2xlTWVudSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQtNCw0LXRgiDRg9Cz0L7QuyDQvNC10L3Rji5cclxuICAgICAqIEBtZXRob2QgZ2V0QW5nbGVNZW51XHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDRg9Cz0L7QuyDQv9C+0LLQvtGA0L7RgtCwINC+0YIgMCDQtNC+IDM2MC5cclxuICAgICAqL1xyXG4gICAgZ2V0QW5nbGVNZW51KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5yb3RhdGlvbiAtIDM2MCAqIE1hdGguZmxvb3IodGhpcy5ub2RlLnJvdGF0aW9uIC8gMzYwKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0LHQvtGC0LDQtdGCINGBINGN0LvQtdC80LXQvdGC0LDQvNC4INCy0YvQutC70Y7Rh9Cw0Y8g0LjRhSDQuCDQv9C+0LTRgdGC0LDQstC70Y/Rj9GPINC30LAg0LzQtdGB0YLQviDQvdC40YUg0LTRgNGD0LPQuNC1INGN0LXQu9C10LzQtdC90YLRiy5cclxuICAgICAqIEBtZXRob2QgX3N3YXBFbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUg0YPQs9C+0Lsg0L3QsCDQutC+0YLQvtGA0L7QvCDQvdCw0YXQvtC00LjRgtGB0Y8g0Y3Qu9C10LzQtdC90YIuXHJcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IGVsZW1lbnQg0Y3Qu9C10LzQtdC90YIv0LvQuNGB0YIg0LrQvtGC0L7RgNGL0Lkg0L3QtdC+0LHRhdC+0LTQuNC80L4g0LfQsNC80LXQvdC40YLRjCDQvdCwINGB0LvQtdC00YPRjtGJ0LjQuSDRjdC70LXQvNC10L3RgiDQuNC3INC+0YfQtdGA0LXQtNC4INC90LXQstC40LTQuNC80YvRhSDRjdC70LXQvNC10L3RgtC+0LIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc3dhcEVsZW1lbnQoYW5nbGUsIGVsZW1lbnQpe1xyXG4gICAgICAgIGlmIChhbmdsZSA+IHRoaXMuYW5nbGVUcmFuc2l0aW9uIC0gdGhpcy53aWR0aFRyYW5zaXRpb24gJiYgYW5nbGUgPCB0aGlzLmFuZ2xlVHJhbnNpdGlvbiArIHRoaXMud2lkdGhUcmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBhY3R1YWxMaXN0ID0gdGhpcy5fcG9vbEludmlzaWJsZUxpc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgYWN0dWFsTGlzdC5zZXRQb3NpdGlvbihjYy52MihlbGVtZW50LngsIGVsZW1lbnQueSkpO1xyXG4gICAgICAgICAgICBhY3R1YWxMaXN0LnJvdGF0aW9uID0gZWxlbWVudC5yb3RhdGlvbjtcclxuICAgICAgICAgICAgYWN0dWFsTGlzdC5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9wb29sSW52aXNpYmxlTGlzdC5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9hcnJheUFuZ2xlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pdGVtLm5hbWUgPT09IGVsZW1lbnQubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXRlbSA9IGFjdHVhbExpc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgKHRoaXMuX3N0YXRlRGlyZWN0aW9uID09PSBNb3ZlQ2lyY3VsYXIuY2xvY2t3aXNlKSA/IHRoaXMubm9kZS5yb3RhdGlvbiArPSB0aGlzLndpZHRoVHJhbnNpdGlvbiA6IHRoaXMubm9kZS5yb3RhdGlvbiAtPSB0aGlzLndpZHRoVHJhbnNpdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YPQs9C+0Lsg0Y3Qu9C10LzQtdC90YLQsC/Qu9C40YHRgtCwINC/0L7QtCDQutC+0YLQvtGA0YvQvCDQvtC9INC90LDRhdC+0LTQuNGC0YHRjy5cclxuICAgICAqIEBtZXRob2QgZ2V0QW5nbGVMaXN0XHJcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IGVsZW1lbnQg0L3QvtC0INGN0LvQtdC80LXQvdGC0LAuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUg0YPQs9C+0Lsg0L/QvtCy0L7RgNC+0YLQsCDQvNC10L3Rji5cclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g0YPQs9C+0Lsg0LvQuNGB0YLQsC/RjdC70LXQvNC10L3RgtCwINC80LXQvdGOLlxyXG4gICAgICovXHJcbiAgICBnZXRBbmdsZUxpc3QoZWxlbWVudCwgYW5nbGUpe1xyXG4gICAgICAgIGxldCBvYmogPSB0aGlzLl9hcnJheUFuZ2xlTGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXRlbS54ID09PSBlbGVtZW50LnggJiYgaXRlbS5pdGVtLnkgPT09IGVsZW1lbnQueTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb2JqID0gb2JqWzBdLmFuZ2xlIC0gYW5nbGU7XHJcbiAgICAgICAgb2JqIC09IE1hdGguZmxvb3Iob2JqIC8gMzYwKSAqIDM2MDtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGB0L7RgdGC0L7Rj9C90LjQtSDQtNCy0LjQttC10L3QuNGPINC80LXQvdGOINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQvdCw0L/RgNCw0LLQu9C10L3QuNGPINC/0L7QstC+0YDQvtGC0LAuXHJcbiAgICAgKiBAbWV0aG9kIF9zZXREaXJlY3Rpb25cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXREaXJlY3Rpb24oKXtcclxuICAgICAgICBpZiAodGhpcy5ub2RlLnJvdGF0aW9uID4gdGhpcy5fcHJldlJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlRGlyZWN0aW9uID0gTW92ZUNpcmN1bGFyLmNsb2Nrd2lzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubm9kZS5yb3RhdGlvbiA8IHRoaXMuX3ByZXZSb3RhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZURpcmVjdGlvbiA9IE1vdmVDaXJjdWxhci5hbnRpY2xvY2t3aXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wcmV2Um90YXRpb24gPSB0aGlzLm5vZGUucm90YXRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHRgtCw0LHQuNC70LjQt9C40YDRg9C10YIg0Y3Qu9C10LzQtdC90YLRiyDQvNC10L3RjiDQv9C+INC/0L7Qu9C+0LbQtdC90LjRjiDQuiDQs9C+0YDQuNC30L7QvdGC0YMuXHJcbiAgICAgKiBAbWV0aG9kIHN0YWJpbGl6YXRpb25FbGVtZW50c1xyXG4gICAgICovXHJcbiAgICBzdGFiaWxpemF0aW9uRWxlbWVudHMoKXtcclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLnJvdGF0aW9uID0gLXRoaXMubm9kZS5yb3RhdGlvbjtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQv9C10YDQstC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQvtC60YDRg9C20L3QvtGB0YLQuC4g0KDQsNGB0L/QvtC30L3QsNC10YIg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsCDQuCDQv9GA0LjQvNC10L3Rj9C10YIg0YHQvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQv9C+0LLQtdC00LXQvdC40LUuXHJcbiAgICAgKiDQlNC70Y8g0L7QsdC10YHQv9C10YfQtdC90LjRjyDQstGA0LDRidC10L3QuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gICAgICogQG1ldGhvZCBfb2JyMVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgg0LTQtdC70YzRgtCwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29icjEoeCwgeSl7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uIC09IHk7XHJcbiAgICAgICAgdGhpcy5zdGFiaWxpemF0aW9uRWxlbWVudHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQstGC0L7RgNC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQutGA0YPQs9CwLiDQoNCw0YHQv9C+0LfQvdCw0LXRgiDQtNCy0LjQttC10L3QuNC1INGC0LDRh9CwINC4INC/0YDQuNC80LXQvdGP0LXRgiDRgdC+0YLQstC10YLRgdGC0LLRg9GO0YnQtdC1INC/0L7QstC10LTQtdC90LjQtS5cclxuICAgICAqINCU0LvRjyDQvtCx0LXRgdC/0LXRh9C10L3QuNGPINCy0YDQsNGJ0LXQvdC40Y8g0L7QutGA0YPQttC90L7RgdGC0Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwuXHJcbiAgICAgKiBAbWV0aG9kIF9vYnIyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCDQtNC10LvRjNGC0LAg0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQv9C+INC+0YDQtNC40L3QsNGC0LUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb2JyMih4LCB5KXtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gKz0geDtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gKz0geTtcclxuICAgICAgICB0aGlzLnN0YWJpbGl6YXRpb25FbGVtZW50cygpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INGC0YDQtdGC0YzQtdC5INGH0LXRgtCy0LXRgNGC0Lgg0LrRgNGD0LPQsC4g0KDQsNGB0L/QvtC30L3QsNC10YIg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsCDQuCDQv9GA0LjQvNC10L3Rj9C10YIg0YHQvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQv9C+0LLQtdC00LXQvdC40LUuXHJcbiAgICAgKiDQlNC70Y8g0L7QsdC10YHQv9C10YfQtdC90LjRjyDQstGA0LDRidC10L3QuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gICAgICogQG1ldGhvZCBfb2JyM1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgg0LTQtdC70YzRgtCwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29icjMoeCwgeSl7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uIC09IHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IHk7XHJcbiAgICAgICAgdGhpcy5zdGFiaWxpemF0aW9uRWxlbWVudHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRh9C10YLQstC10YDRgtC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQutGA0YPQs9CwLiDQoNCw0YHQv9C+0LfQvdCw0LXRgiDQtNCy0LjQttC10L3QuNC1INGC0LDRh9CwINC4INC/0YDQuNC80LXQvdGP0LXRgiDRgdC+0YLQstC10YLRgdGC0LLRg9GO0YnQtdC1INC/0L7QstC10LTQtdC90LjQtS5cclxuICAgICAqINCU0LvRjyDQvtCx0LXRgdC/0LXRh9C10L3QuNGPINCy0YDQsNGJ0LXQvdC40Y8g0L7QutGA0YPQttC90L7RgdGC0Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwuXHJcbiAgICAgKiBAbWV0aG9kIF9vYnI0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCDQtNC10LvRjNGC0LAg0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQv9C+INC+0YDQtNC40L3QsNGC0LUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb2JyNCh4LCB5KXtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gLT0geDtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gLT0geTtcclxuICAgICAgICB0aGlzLnN0YWJpbGl6YXRpb25FbGVtZW50cygpO1xyXG4gICAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgeyBDaXJjdWxhckxpc3QgfTsiLCJpbXBvcnQgeyBBUElDb3JlIH1mcm9tICcuLi8uLi9idWlsZC9idWlsZC10cyc7XHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfbW9kZWw6IG51bGwsLy/QvNC+0LTQtdC70Ywg0LbQuNCy0L7RgtC90L7Qs9C+XHJcblxyXG4gICAgICAgIF9tYXhCaWFzVG91Y2g6IDE1LC8v0LzQsNC60YHQuNC80LDQu9GM0L3QvtC1INGB0LzQtdGJ0LXQvdC40LUg0YLQsNGH0LAg0LTQu9GPINC+0YLQutGA0YvRgtC40Y8g0LzQtdC90Y4gKHB4KVxyXG4gICAgICAgIF9wb2ludFRvdWNoRm9yTWVudTogY2MudjIsLy/RgtC+0YfQutCwINGB0YLQsNGA0YLQsCDRgtCw0YfQsCDQv9C+INC20LjQstC+0YLQvdC+0LzRg1xyXG5cclxuICAgICAgICBfaXNNb3ZlOiBmYWxzZSwvL9GE0LvQsNCzINC00LvRjyDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC00LLQuNC20LXRgtGB0Y8g0LvQuCDQttC40LLQvtC90L7QtSDQt9CwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8XHJcbiAgICAgICAgX2lzT3Blbk1lbnU6IGZhbHNlLC8v0YTQu9Cw0LMg0LTQu9GPINC+0L/RgNC10LTQtdC70LXQvdC40Y8g0L7RgtC60YDRi9GC0L4g0LvQuCDQvNC10L3RjlxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQoKXtcclxuICAgICAgICB0aGlzLl9hcGkgPSBBUElDb3JlLmluc3RhbmNlKCk7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hTdGFydEFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0YHRgtGA0LDQuNCy0LDQtdGCINC00L7RgdGC0YPQv9C90YvQtSDQtNC10LnRgdGC0LLQuNGPINC/0LvRjtGI0LrQuCDQtNC70Y8g0LbQuNCy0L7RgtC90L7Qs9C+INC4INGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuICAgICAqL1xyXG4gICAgc2V0dGluZ3MocGFjayl7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwgPSB0aGlzLl9hcGkuY3JlYXRlQW5pbWFsKHBhY2sucHV0aFRvTW9kZWwsIHBhY2suaWQpOy8v0YHQvtC30LTQsNC10Lwg0LzQvtC00LXQu9GMINC20LjQstC+0YLQvdC+0LPQvlxyXG5cclxuICAgICAgICBjYy5sb2codGhpcy5ub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdDb2xsaWRlcih0aGlzLl9tb2RlbC5uYXZpZ2F0aW9uLnJhZGl1c1Zpc2lvbix0aGlzLm5vZGUuY2hpbGRyZW5bMF0uZ2V0Q29tcG9uZW50KGNjLkNpcmNsZUNvbGxpZGVyKSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5nQ29sbGlkZXIodGhpcy5fbW9kZWwubmF2aWdhdGlvbi5yYWRpdXNIZWFyaW5nLHRoaXMubm9kZS5jaGlsZHJlblsxXS5nZXRDb21wb25lbnQoY2MuQ2lyY2xlQ29sbGlkZXIpKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdDb2xsaWRlcih0aGlzLl9tb2RlbC5uYXZpZ2F0aW9uLnJhZGl1c1NtZWxsLHRoaXMubm9kZS5jaGlsZHJlblsyXS5nZXRDb21wb25lbnQoY2MuQ2lyY2xlQ29sbGlkZXIpKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdDb2xsaWRlcih0aGlzLl9tb2RlbC5uYXZpZ2F0aW9uLnJhZGl1c1RvdWNoLHRoaXMubm9kZS5jaGlsZHJlblszXS5nZXRDb21wb25lbnQoY2MuQ2lyY2xlQ29sbGlkZXIpKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNGB0YLRgNCw0LjQstCw0LXRgiDQutC+0LvQu9Cw0LnQtNC10YDRiyDRgyDQttC40LLQvtGC0L3QvtCz0L4g0YHQvtCz0LvQsNGB0L3QviDQtdCz0L4g0LzQvtC00LXQu9C4XHJcbiAgICAgKiBAbWV0aG9kIHNldHRpbmdDb2xsaWRlclxyXG4gICAgICogQHBhcmFtIHtBbmltYWxzLlN5c3RlbXMuSVN5c3RlbX0gc3lzdGVtXHJcbiAgICAgKiBAcGFyYW0ge2NjLkNpcmNsZUNvbGxpZGVyfSBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgc2V0dGluZ0NvbGxpZGVyKHN5c3RlbSxjb21wb25lbnQpe1xyXG4gICAgICAgIHN5c3RlbT09PXVuZGVmaW5lZD9jb21wb25lbnQucmFkaXVzPTA6Y29tcG9uZW50LnJhZGl1cz1zeXN0ZW0uY3VycmVudDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQvdCw0YfQsNC70LAg0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hTdGFydEFuaW1hbChldmVudCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3N0YXJ0TW90aW9uQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIHN0YXJ0TW90aW9uOiBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0aGlzLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7Ly/RgNCw0LfQvtGB0LvQsNC70Lgg0LXQstC10L3RglxyXG4gICAgICAgIHRoaXMuX2lzTW92ZSA9IGZhbHNlOy8v0LbQuNCy0L7RgtC90L7QtSDQvdC1INC00LLQuNC20LXRgtGB0Y8g0LfQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvFxyXG4gICAgICAgIHRoaXMuX3BvaW50VG91Y2hGb3JNZW51ID0gZXZlbnQuZ2V0TG9jYXRpb24oKTsvL9GB0YfQuNGC0LDQu9C4INGC0L7Rh9C60YMg0L/QtdGA0LLQvtCz0L4g0L3QsNC20LDRgtC40Y9cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQtNCy0LjQttC10L3QuNGPINGC0LDRh9CwLlxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaE1vdmVBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIC8vICAgY2MubG9nKGV2ZW50KTtcclxuICAgICAgICB2YXIgZGVsdGEgPSBldmVudC50b3VjaC5nZXREZWx0YSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0NoZWNrT25PcGVuTWVudShldmVudC5nZXRMb2NhdGlvbigpKSAmJiAhdGhpcy5faXNPcGVuTWVudSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc01vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnbW90aW9uQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICAgICAgZGVsdGFNb3Rpb246IGRlbHRhLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRFbmQ6IGV2ZW50LmdldExvY2F0aW9uKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNGPINC30LDQstC10YDRiNC10L3QuNGPINGC0LDRh9CwXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9vblRvdWNoRW5kQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBpZiAodGhpcy5faXNNb3ZlKSB7XHJcbiAgICAgICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdlbmRNb3Rpb25BbmltYWwnLCB0cnVlKTtcclxuICAgICAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludEVuZDogZXZlbnQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzTW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZm9jdXNNZW51KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQvtGC0LrRgNGL0LLQsNC10YLRgdGPINC80LXQvdGOINC40LvQuCDQvdC10YIuINCf0YPRgtC10Lwg0YHQutCw0L3QuNGA0L7QstCw0L3QuNGPINGC0L7Rh9C60Lgg0YLQsNGH0LAg0L3QsCDQstGL0YXQvtC00LfQsCDQv9GA0LXQtNC10LvRiyDQvtGCINC90LDRh9Cw0L/Qu9GM0L3QvtC5INGC0L7Rh9C60LhcclxuICAgICAqIEBwYXJhbSBwb2ludFxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9pc0NoZWNrT25PcGVuTWVudShwb2ludCl7XHJcbiAgICAgICAgbGV0IFggPSBNYXRoLmFicyh0aGlzLl9wb2ludFRvdWNoRm9yTWVudS54IC0gcG9pbnQueCkgPiB0aGlzLl9tYXhCaWFzVG91Y2g7XHJcbiAgICAgICAgbGV0IFkgPSBNYXRoLmFicyh0aGlzLl9wb2ludFRvdWNoRm9yTWVudS55IC0gcG9pbnQueSkgPiB0aGlzLl9tYXhCaWFzVG91Y2g7XHJcbiAgICAgICAgcmV0dXJuIFggfHwgWTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC30LzQtdC90Y/QtdGCINGB0L7RgdGC0L7Rj9C90LjQtSDQvNC10L3RjlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3JlZm9jdXNNZW51KCl7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9ICF0aGlzLl9pc09wZW5NZW51O1xyXG4gICAgICAgICh0aGlzLl9pc09wZW5NZW51KSA/IHRoaXMuX3B1Ymxpc2hPcGVuTWVudUFuaW1hbCgpIDogdGhpcy5fcHVibGlzaENsb3NlTWVudUFuaW1hbCgpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0LrRgNGL0YLQuNC1INC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICovXHJcbiAgICBfcHVibGlzaE9wZW5NZW51QW5pbWFsKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ29wZW5NZW51QW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHRoaXMsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQl9Cw0LrRgNGL0YLQviDQvNC10L3RjiDRgSDQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAqL1xyXG4gICAgX3B1Ymxpc2hDbG9zZU1lbnVBbmltYWwoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnY2xvc2VNZW51QW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHRoaXMsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0LrRgNGL0YLQuNC1INC80LXQvdGOXHJcbiAgICAgKi9cclxuICAgIG9wZW5NZW51KCl7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fcHVibGlzaE9wZW5NZW51QW5pbWFsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC60YDRi9GC0Ywg0LzQtdC90Y5cclxuICAgICAqL1xyXG4gICAgY2xvc2VNZW51KCl7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3B1Ymxpc2hDbG9zZU1lbnVBbmltYWwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0L7QsdGJ0LDQtdGCINC80L7QtNC10LvQuCDQtNC+INC60LDQutC+0Lkg0YLQvtGH0LrQuCDQvdCw0LTQviDQtNC+0LnRgtC4XHJcbiAgICAgKiBAcGFyYW0gcG9pbnRcclxuICAgICAqL1xyXG4gICAgbW92ZVRvUG9pbnQocG9pbnQpe1xyXG4gICAgICAgIHRoaXMuX21vZGVsLm1vdmVUb1BvaW50KHBvaW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0LbQuNC30L3RjCDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAqIEBtZXRob2QgcnVuXHJcbiAgICAgKi9cclxuICAgIHJ1bigpe1xyXG4gICAgICAgIHRoaXMuX21vZGVsLnJ1bkxpZmUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LTQsNGC0Ywg0LfQstGD0LpcclxuICAgICAqL1xyXG4gICAgcnVuVm9pY2UoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQtdGB0YLRjFxyXG4gICAgICovXHJcbiAgICBydW5TaXQoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjRgdC/0YPQs9Cw0YLRjNGB0Y9cclxuICAgICAqL1xyXG4gICAgcnVuRnJpZ2h0ZW4oKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC60LDQt9Cw0YLRjCDQsNGA0LXQsNC70YtcclxuICAgICAqL1xyXG4gICAgcnVuQXJlYWwoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70LDRgdC60LDRgtGM0YHRj1xyXG4gICAgICovXHJcbiAgICBydW5DYXJlKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCb0LXRh9GMXHJcbiAgICAgKi9cclxuICAgIHJ1bkxpZSgpe1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0LjQs9C+0YLQvtCy0LjRgtGM0YHRj1xyXG4gICAgICovXHJcbiAgICBydW5BdHRlbnRpb24oKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0LzQsNGB0YHQuNCyINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6INGDINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICogQHJldHVybiB7Knxhbnl9XHJcbiAgICAgKi9cclxuICAgIGdldENoYXJhY3RlcmlzdGljcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXRDaGFyYWN0ZXJpc3RpY3MoKTtcclxuICAgIH1cclxuXHJcbn0pOyIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNGPINC90LAg0L3QsNC20LDRgtC40LUg0L/QviDQt9Cy0LXRgNGO0YjQutC1INC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDQt9Cy0LXRgNGO0YjQutC4XHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50KXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnc3RhcnREcmFnQW5kRHJvcEFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICBhbmltYWw6IHRoaXMubm9kZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsNC00LLQuNC20LXQvdC40LUg0LfQsNC20LDRgtC+0Lkg0LfQstC10YDRjtGI0LrQuCDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0LfQstC10YDQsdGI0LrQuFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hNb3ZlKGV2ZW50KXtcclxuICAgICAgICB2YXIgZGVsdGEgPSBldmVudC50b3VjaC5nZXREZWx0YSgpO1xyXG4gICAgICAgIHRoaXMubm9kZS54ICs9IGRlbHRhLng7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgKz0gZGVsdGEueTtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnZHJhZ0FuZERyb3BBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgcG9pbnQ6IHt4OiB0aGlzLm5vZGUueCwgeTogdGhpcy5ub2RlLnl9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjQtSDQvdCwINC30LDQstC10YDRiNC10L3QuNC1INC90LDQttCw0YLQuNGPINC/0L4g0LfQstC10YDRjtGI0LrQtSDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0LfQstC10YDRjtGI0LrQuFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmQoZXZlbnQpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdzdG9wRHJhZ0FuZERyb3BBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgcG9pbnQ6IHt4OiB0aGlzLm5vZGUueCwgeTogdGhpcy5ub2RlLnl9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcblxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEZJUkNvcnAgb24gMDQuMDMuMjAxNy5cclxuICovXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9maWN0aXRpb3VzUG9pbnQ6IG51bGwsLy/QotC+0YfQutCwINC00LvRjyDRhNC40LrRgdCw0YbQuNC4INC00LLQuNC20LXQvdC40Y8g0LrQsNGA0YLRiy4g0J/QvtC80L7Qs9Cw0LXRgiDRgNCw0LfQu9C40YfQsNGC0Ywg0YHQvtCx0YvRgtC40LUg0LTQstC40LbQtdC90LjQtSDQvtGCINC30LDQstC10YDRiNC10L3QuNGPXHJcbiAgICAgICAgX2lzVG91Y2hTdGFydDogbnVsbCwvL9Ck0LvQsNCzINC30LDQv9GD0YnQtdC9INC70Lgg0YLQsNGHXHJcbiAgICAgICAgX2NvbnRyb2xsZXJTY3JvbGxNYXA6IG51bGwsXHJcbiAgICAgICAgX2FjdGlvbk1vdmVNYXA6IG51bGwsLy/QtNC10LnRgdGC0LLQuNC1INC00LLQuNC20LXQvdC40Y8g0LrQsNGA0YLRi1xyXG4gICAgICAgIF9tYXhTaXplTWFwU2Nyb2xsOiBudWxsLC8v0YDQsNC30LzQtdGAIG9mZnNldCDRgdC60YDQvtC70LvQsC4g0L/QvtC80L7QttC10YIg0L/RgNC4INC/0LXRgNC10LzQtdGJ0LXQvdC40Lgg0LrQsNC80LXRgNGLINC+0YIg0LfQstC10YDRjtGI0LrQuCDQuiDQt9Cy0LXRgNGO0YjQutC1XHJcblxyXG4gICAgICAgIG1heEJpYXNUb3VjaDogMTUsLy/QvNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0YHQvNC10YnQtdC90LjQtSDRgtCw0YfQsCDQtNC70Y8g0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDRh9GC0L4g0LrQsNGA0YLQsCDQtNCy0LjQttC10YLRgdGPXHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lzVG91Y2hTdGFydCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJTY3JvbGxNYXAgPSB0aGlzLm5vZGUucGFyZW50LnBhcmVudC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldyk7XHJcbiAgICAgICAgdGhpcy5fZmljdGl0aW91c1BvaW50ID0gY2MudjIoMCwgMCk7XHJcbiAgICAgICAgdGhpcy5fbWF4U2l6ZU1hcFNjcm9sbCA9IHRoaXMuX2NvbnRyb2xsZXJTY3JvbGxNYXAuZ2V0TWF4U2Nyb2xsT2Zmc2V0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0L/QvtGA0LDQttC00LDRjtGJ0LjQtdGB0Y8g0YHQutGA0L7Qu9C+0LxcclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtSDQutC+0YLQvtGA0L7QtSDQu9C+0LLQuNGCINGB0LrRgNC+0LtcclxuICAgICAqL1xyXG4gICAgb25FdmVudFNjcm9sbChldmVudCkge1xyXG4gICAgICAgIGxldCBwb2ludCA9IGV2ZW50LmdldFNjcm9sbE9mZnNldCgpO1xyXG4gICAgICAgIGxldCBsb2dSZXogPSBwb2ludC54ID09PSB0aGlzLl9maWN0aXRpb3VzUG9pbnQueCAmJiBwb2ludC55ID09PSB0aGlzLl9maWN0aXRpb3VzUG9pbnQueTtcclxuICAgICAgICAobG9nUmV6ICYmIHRoaXMuX2lzVG91Y2hTdGFydCkgPyB0aGlzLm9uVG91Y2hFbmQoZXZlbnQpIDogdGhpcy5fZmljdGl0aW91c1BvaW50ID0gcG9pbnQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjRjyDQvdCwINC/0YDQuNC60L7RgdC90L7QstC10L3QuNC1INC6INC60LDRgNGC0LVcclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtSDQutC+0YLQvtGA0L7QtSDQv9C+0LnQvNCw0LXRgiDRjdGC0L7RgiDRgdC60YDQuNC/0YJcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNUb3VjaFN0YXJ0ID0gdHJ1ZTtcclxuICAgICAgICAvL9C30LDQv9C+0LzQvdC40LzQv9C+0LfQuNGG0LjRjyDQvdCw0YfQsNC70LAg0Y3QstC10L3RgtCwXHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3RvdWNoT25NYXAnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsCDQtNCy0LjQttC10L3QuNC1IHRvdWNoINC/0L4g0LrQsNGA0YLQtVxyXG4gICAgICogQHBhcmFtIGV2ZW50INGB0L7QsdGL0YLQuNC1INC60L7RgtC+0YDQvtC1INC/0L7QudC80LDQtdGCINGN0YLQvtGCINGB0LrRgNC40L/RglxyXG4gICAgICovXHJcbiAgICBvblRvdWNoTW92ZShldmVudCkge1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCd0b3VjaE1vdmVPbk1hcCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtC40Y8g0L3QsCDQvtGC0LrQv9GD0YHQutCw0L3QuNC1IHRvdWNoINC+0YIg0LrQsNGA0YLRi1xyXG4gICAgICogQHBhcmFtIGV2ZW50INGB0L7QsdGL0YLQuNC1INC60L7RgtC+0YDQvtC1INC/0L7QudC80LDQtdGCINGB0LrRgNC+0Lsg0LvQuNCx0L4g0Y3RgtC+0YIg0YHQutGA0LjQv9GCXHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmQoZXZlbnQpIHtcclxuICAvLyAgICAgIGNjLmxvZyhldmVudCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVG91Y2hTdGFydCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1RvdWNoU3RhcnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3RvdWNoRW5kTW92ZU9uTWFwJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAvLyAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0L3QstC10L3RgtC40YDRg9C10YIg0YLQvtGH0LrRgyDQvtC60L3QsCDQsiDRgtC+0YfQutGDINC60LDRgNGC0YtcclxuICAgICAqIEBwYXJhbSBwb2ludCDRgtC+0YfQutCwINCyINC+0LrQvdC1XHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0g0YLQvtGH0LrQsCDQvdCwINC60LDRgNGC0LVcclxuICAgICAqL1xyXG4gICAgZ2V0UG9pbnRNYXAocG9pbnQpIHtcclxuICAgICAgICBsZXQgbmV3WCA9IHBvaW50LnggLSB0aGlzLm5vZGUueDtcclxuICAgICAgICBsZXQgbmV3WSA9IHBvaW50LnkgLSB0aGlzLm5vZGUueTtcclxuICAgICAgICByZXR1cm4gY2MudjIobmV3WCwgbmV3WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC90LLQtdGA0YLQuNGA0YPQtdGCINGC0L7Rh9C60YMg0LIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0L7QutC90LBcclxuICAgICAqIEBwYXJhbSBwb2ludCDRgtC+0YfQutCwINC90LAg0LrQsNGA0YLQtVxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9INGC0L7Rh9C60LAg0LIg0L7QutC90LVcclxuICAgICAqL1xyXG4gICAgZ2V0UG9pbnRXaW5kb3cocG9pbnQpIHtcclxuICAgICAgICBsZXQgbmV3WCA9IHBvaW50LnggKyB0aGlzLm5vZGUueDtcclxuICAgICAgICBsZXQgbmV3WSA9IHBvaW50LnkgKyB0aGlzLm5vZGUueTtcclxuICAgICAgICByZXR1cm4gY2MudjIobmV3WCwgbmV3WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YLQvtGH0LrRgyDQutCw0YDRgtGLINC40Lcg0YHQuNGB0YLQtdC80Ysg0LrQvtC+0YDQtNC40L3QsNGCINGB0LrRgNC+0LvQu9CwXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0LjRgdGF0L7QtNC90LDRjyDRgtC+0YfQutCwXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn1cclxuICAgICAqL1xyXG4gICAgZ2V0UG9pbnRNYXBPZk9mZnNldChwb2ludCl7XHJcbiAgICAgICAgbGV0IG5ld1kgPSB0aGlzLl9tYXhTaXplTWFwU2Nyb2xsLnkgLSBwb2ludC55O1xyXG4gICAgICAgIHJldHVybiBjYy52Mihwb2ludC54LCBuZXdZKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LLQtdGA0YLQuNGA0YPQtdGCINGC0L7Rh9C60YNcclxuICAgICAqIEBwYXJhbSBwb2ludCDQuNGB0YXQvtC00L3QsNGPINGC0L7Rh9C60LBcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfVxyXG4gICAgICovXHJcbiAgICBnZXRJbnZlcnRQb2ludChwb2ludCl7XHJcbiAgICAgICAgbGV0IG5ld1ggPSAtcG9pbnQueDtcclxuICAgICAgICBsZXQgbmV3WSA9IC1wb2ludC55O1xyXG4gICAgICAgIHJldHVybiBjYy52MihuZXdYLCBuZXdZKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNCy0LjQttC10L3QuNC1INC60LDQvNC10YDRiyDQstC90LXQutC+0YLQvtGA0YPRjiDRgtC+0YfQutGDINC90LAg0L7RgdC90L7QstC1INC80LXRgtC+0LTQsCDQtNCy0LjQttC10L3QuNGPINGB0LrRgNC+0LvQu9CwLiDQoSDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtdC8INC10LPQviDRgdC40YHRgtC10LzRiyDQutC+0L7RgNC00LjQvdCw0YJcclxuICAgICAqIEBwYXJhbSBwb2ludCDRgtC+0YfQutCwINCyINC60L7RgtC+0YDRg9GOINC90LXQvtCx0YXQvtC00LjQvNC+INC/0LXRgNC10LnRgtC4XHJcbiAgICAgKiBAcGFyYW0gdGltZSDQstGA0LXQvNGPINC30LAg0LrRgtC+0YDQvtC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDQv9C10YDQtdGF0L7QtFxyXG4gICAgICovXHJcbiAgICBtb3ZlKHBvaW50LCB0aW1lID0gMCl7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlclNjcm9sbE1hcC5zY3JvbGxUb09mZnNldCh0aGlzLmdldFBvaW50TWFwT2ZPZmZzZXQocG9pbnQpLCB0aW1lKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNCy0LjQttC10L3QuNC1INC60LDRgNGC0Ysg0LIg0L3QtdC60L7RgtC+0YDRg9GOINGC0L7Rh9C60YMg0L3QsCDQvtGB0L3QvtCy0LUgYWN0aW9uc1xyXG4gICAgICogQHBhcmFtIHBvaW50XHJcbiAgICAgKiBAcGFyYW0gdGltZVxyXG4gICAgICovXHJcbiAgICBtb3ZlQWN0aW9ucyhwb2ludCwgdGltZSA9IDApe1xyXG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWN0aW9uKHRoaXMuX2FjdGlvbk1vdmVNYXApO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbk1vdmVNYXAgPSBjYy5tb3ZlVG8odGltZSwgdGhpcy5nZXRJbnZlcnRQb2ludChwb2ludCkpO1xyXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oXHJcbiAgICAgICAgICAgIGNjLnNlcXVlbmNlKHRoaXMuX2FjdGlvbk1vdmVNYXAsIGNjLmNhbGxGdW5jKHRoaXMuX3B1Ymxpc2hGaW5pc2hNb3ZlQ2VudHJlVG9BbmltYWwsIHRoaXMpKVxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC30LDQstC10YDRiNC10L3QuNGPINC00LLQuNC20LXQvdC40Y8g0LrQsNC80LXRgNGLINC00L4g0LbQuNCy0L7RgtC90L7Qs9C+INC4INGE0LjQutGB0LjRgNC+0LLQsNC90LjQtSDQtdCz0L4g0L/QviDRhtC10L3RgtGA0YMg0Y3QutGA0LDQvdCwXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcHVibGlzaEZpbmlzaE1vdmVDZW50cmVUb0FuaW1hbCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdmaW5pc2hNb3ZlQ2FtZXJhVG9BbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRklSQ29ycCBvbiAzMS4wMy4yMDE3LlxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25Ub3VjaE1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50KXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoTW92ZShldmVudCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaEVuZChldmVudCl7XHJcblxyXG4gICAgfSxcclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEZJUkNvcnAgb24gMTYuMDQuMjAxNy5cclxuICovXHJcblxyXG4vKipcclxuICog0JrQvtC90YLRgNC+0LvQu9C10YAg0YHQutGA0L7Qu9C70LAg0YXQsNGA0LDQutGC0LjRgNC40YHRgtC40LouINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQs9GD0LvQuNGA0L7QstC60YMg0Y3Qu9C10LzQtdC90YLQvtCyINCx0L7QutGB0LAg0YXQsNGA0LDRgtC10YDQuNGB0YLQuNC6LiDQktGL0L/QvtC70L3Rj9C10YIg0L7Qv9C10YDQsNGG0LjQuCDRgdCy0Y/Qt9Cw0L3QvdGL0LUg0YEg0YDQtdCz0YPQu9C40YDQvtCy0LrQvtC5INC90L7QtNC+0LIg0LTQu9GPINC+0LHQtdGB0L/QtdGH0LXQvdC40Y8g0LjQu9C70Y7Qt9C40Lgg0LLRgNCw0YnQtdC90LjRjyDQsdCw0YDQsNCx0LDQvdCwINC60YPQtNCwINC90LDQutGA0YPRh9C40LLQsNC10YLRgdGPL9C+0YLQutGD0LTQsCDRgdC60YDRg9GH0LjQstCw0LXRgtGB0Y8g0YHQv9C40YHQvtC6INGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6LlxyXG4gKiBAY2xhc3MgQ2hhcmFjdGVyaXN0aWNzU2Nyb2xsQm94Q29udHJvbGxlclxyXG4gKi9cclxudmFyIENoYXJhY3RlcmlzdGljc1Njcm9sbEJveENvbnRyb2xsZXIgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIG5vZGVDb2lsOiBjYy5Ob2RlLC8v0L3QvtC0INC/0LDQu9C60LhcclxuICAgICAgICBub2RlUm9sbDogY2MuTm9kZSwvL9C90L7QtCDQsdC70LXRgdC60LBcclxuICAgICAgICBub2RlQ29udGVudDogY2MuTm9kZSwvLyDQvdC+0LQg0LrQvtC90YLQtdC90YLQsFxyXG4gICAgICAgIGJvdHRvbVBvaW50U3RhcnRSb3RhdGlvbjogMjgxLC8v0L3QuNC20L3Rj9GPINC60L7RgNC00LjQvdCwINGB0YLQsNGA0YLQsCDQv9C+0LLQvtGA0L7RgtCwXHJcbiAgICAgICAgdG9wUG9pbnRTdGFydFJvdGF0aW9uOiAzNjEsLy/QstC10YDRhdC90Y/RjyDQutC+0YDQtNC40L3QsCDRgdGC0LDRgNGC0LAg0L/QvtCy0L7RgNC+0YLQsFxyXG4gICAgICAgIF9pbnRlcnZhbDogMCwvL9C00LvQuNC90L3QsCDQv9GA0L7QvNC10LbRg9GC0LrQsCDQtNC70Y8g0YHQttC40YLQuNGPINC/0LDRgNC10LzQtdC90L3Ri9GFXHJcbiAgICAgICAgX3N0YXJ0UG9zQ29udGVudDogbnVsbCwvL9GB0YLQsNGA0YLQvtCy0LDRjyDQv9C+0LfQuNGG0LjRjyDQutC+0L3RgtC10L3RgtCwINCx0L7QutGB0LAhIVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC90LAg0LfQsNCz0YDRg9C30LrRgyDRgdGG0LXQvdGLLlxyXG4gICAgICogQG1ldGhvZCBvbkxvYWRcclxuICAgICAqL1xyXG4gICAgb25Mb2FkKCl7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoU3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0L/QviDQt9Cw0L/Rg9GB0LrRgyDRjdC70LXQvNC10L3RgtCwXHJcbiAgICAgKiBAbWV0aG9kIHN0YXJ0XHJcbiAgICAgKi9cclxuICAgIHN0YXJ0KCl7XHJcbiAgICAgICAgbGV0IGxhID0gdGhpcy5ub2RlQ29udGVudC5nZXRDb21wb25lbnQoY2MuTGF5b3V0KTtcclxuICAgICAgICB0aGlzLl9zdGVwID0gbGEuc3BhY2luZ1k7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRQb3NDb250ZW50ID0gdGhpcy5ub2RlQ29udGVudC55O1xyXG4gICAgICAgIHRoaXMuX2ludGVydmFsID0gdGhpcy50b3BQb2ludFN0YXJ0Um90YXRpb24gLSB0aGlzLmJvdHRvbVBvaW50U3RhcnRSb3RhdGlvbjtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdGC0LDRgNGC0LAg0YLQsNGH0LBcclxuICAgICAqIEBtZXRob2QgX29uVG91Y2hTdGFydFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaFN0YXJ0KGV2ZW50KXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JXQstC10L3RgiDQtNCy0LjQttC10L3QuNGPINGB0LrRgNC+0LvQu9CwLiDQntCx0YDQsNCx0LDRgtGL0LLQsNC10YIg0LLRgNCw0YnQtdC90LjQuCDQsdC+0LrRgdCwINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6LtCf0YDQvtC40LfQstC+0LTQuNGCINGB0LbQsNGC0LjQtSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQvdCwINC40L3RgtC10YDQstCw0LvQtVxyXG4gICAgICogQG1ldGhvZCBvbk1vdmVTY3JvbGxcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbk1vdmVTY3JvbGwoZXZlbnQpe1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFBvaW50Q29udGVudCA9IGV2ZW50LmdldENvbnRlbnRQb3NpdGlvbigpO1xyXG4gICAgICAgIGxldCBiYWlzID0gTWF0aC5hYnMoY3VycmVudFBvaW50Q29udGVudC55IC0gdGhpcy5fc3RhcnRQb3NDb250ZW50KTtcclxuICAgICAgICBsZXQgdnIgPSAwO1xyXG4gICAgICAgIGlmIChjdXJyZW50UG9pbnRDb250ZW50LnkgPiB0aGlzLl9zdGFydFBvc0NvbnRlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlQ29udGVudC5jaGlsZHJlbi5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFBvaW50SXRlbSA9IHRoaXMuX3N0YXJ0UG9zQ29udGVudCAtIHZyICsgYmFpcztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UG9pbnRJdGVtID4gdGhpcy5ib3R0b21Qb2ludFN0YXJ0Um90YXRpb24gJiYgY3VycmVudFBvaW50SXRlbSA8IHRoaXMudG9wUG9pbnRTdGFydFJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zY2FsZVkgPSB0aGlzLl9nZXRTY2FsZUl0ZW0oY3VycmVudFBvaW50SXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2NhbGVZID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZyICs9IHRoaXMuX3N0ZXAgKyBpdGVtLmhlaWdodDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC60L7RjdGE0YTQuNGG0LXQvdGCINGB0LbQsNGC0LjRjy4g0JrQvtGC0L7RgNGL0Lkg0YDQsNGB0YfQuNGC0YvQstCw0LXRgtGB0Y8g0L3QsCDQvtGB0L3QvtCy0LUg0L/RgNC+0LzQtdC20YPRgtC60LAg0Lgg0YLQtdC60YPRidC10LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0LIg0Y3RgtC+0Lwg0L/RgNC+0LzQtdC20YPRgtC60LUuXHJcbiAgICAgKiBAbWV0aG9kIF9nZXRTY2FsZUl0ZW1cclxuICAgICAqIEBwYXJhbSBjdXJyZW50UG9pbnQg0YLQtdC60YPRidC10LUg0L/QvtC70L7QttC10L3QuNC1INC/0LDRgNCw0LzQtdGC0YDQsCDQv9C+INC+0YHQuCDQvtGA0LTQuNC90LDRglxyXG4gICAgICogQHJldHVybnMge251bWJlcn0g0LrQvtGN0YTRhNC40YbQtdC90YIg0YHQttCw0YLQuNGPINC00LvRjyDQv9Cw0YDQsNC80LXRgtGA0LBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9nZXRTY2FsZUl0ZW0oY3VycmVudFBvaW50KXtcclxuICAgICAgICBsZXQgayA9IDEgLSAoKDEwMCAqIChjdXJyZW50UG9pbnQgLSB0aGlzLmJvdHRvbVBvaW50U3RhcnRSb3RhdGlvbikpIC8gdGhpcy5faW50ZXJ2YWwpIC8gMTAwO1xyXG4gICAgICAgIHJldHVybiAoayA+IDEgfHwgayA8IDApID8gMSA6IGs7XHJcbiAgICB9LFxyXG5cclxufSk7IiwidmFyIEZhY3RvcnlBbmltYWxQcmVmYWIgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF90YXJnZXRBbmltYWw6IGNjLk5vZGUsXHJcbiAgICAgICAgd2F5VG9QcmVmYWI6J3ByZWZhYnMvYW5pbWFsL0xpb25TaGVhdGgnLFxyXG4gICAgICAgIHdheVRvTW9kZWw6ICcuL21vZGVsJywvL9Cf0YPRgtGMINC00L4g0LzQvtC00LXQu9C4XHJcbiAgICAgICAgbmFtZUFuaW1hbDogJ2FuaW1hbCcsLy/QmNC80Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC10YIg0LbQuNCy0L7RgtC90L7QtVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgY3JlYXRlQW5pbWFsKGV2ZW50KSB7XHJcbiAgICAgIC8vICBjYy5sb2coZXZlbnQpO1xyXG4gICAgICAgLy8gbGV0IHBvaW50VG91Y2ggPSBldmVudC5nZXRTdGFydExvY2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fY3JlYXRlUHJlZmFiKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC10YIg0L/RgNC10YTQsNCxINCyINC90YPQttC90L7QvCDQutC+0L3RgtC10L3RgtC1XHJcbiAgICAgKiBAc2VlIHtzdHJpbmd9IHdheVRvUHJlZmFiINC/0YPRgtGMINC00L4g0L/RgNC10YTQsNCx0LBcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZVByZWZhYigpIHtcclxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh0aGlzLndheVRvUHJlZmFiLCAoZXJyLCBwcmVmYWIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdjcmVhdGVBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgICAgICBhbmltYWw6IHRoaXMuX3NldHRpbmdzQW5pbWFsKHRoaXMuX3RhcmdldEFuaW1hbCksXHJcbiAgICAgICAgICAgICAgICBwdXRoVG9Nb2RlbDp0aGlzLndheVRvTW9kZWwsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbm9kZUFuaW1hbFxyXG4gICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0dGluZ3NBbmltYWwobm9kZUFuaW1hbCl7XHJcbiAgICAgICAgbm9kZUFuaW1hbC5uYW1lPXRoaXMubmFtZUFuaW1hbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVBbmltYWw7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7IEZhY3RvcnlBbmltYWxQcmVmYWJ9OyIsImltcG9ydCB7IENpcmN1bGFyTGlzdCB9IGZyb20gJy4vY2lyY3VsYXItbGlzdCc7XHJcblxyXG4vKipcclxuICog0JvQuNGB0YIg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gKiBAY2xhc3MgTGlzdFxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBtYW5hZ2VyOiBDaXJjdWxhckxpc3QsLy/RgdGB0YvQu9C60LAg0L3QsCDRj9C00YDQviDQstGA0LDRidC10L3QuNGPXHJcbiAgICAgICAgbmFtZUV2ZW50OiAndm9pY2VBbmltYWwnLC8v0LjQvNGPINGB0L7QsdGL0YLQuNGPINC60L7RgtC+0YDQvtC1INCy0YvQt9GL0LLQsNC10YIg0Y3RgtCwINC60L3QvtC/0LrQsFxyXG4gICAgICAgIG1heEJpYXNUb3VjaDogMTUsLy/QvNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0YHQvNC10YnQtdC90LjQtSDRgtCw0YfQsCDQtNC70Y8g0L3QsNC20LDRgtC40Y8g0L/QviDRjdC70LXQvNC10L3RgtGDINC80LXQvdGOIChweClcclxuICAgICAgICBfcG9pbnRUb3VjaEZvck1lbnU6IGNjLnYyLC8v0YLQvtGH0LrQsCDRgdGC0LDRgNGC0LAg0YLQsNGH0LAg0L/QviDQv9GD0L3QutGC0YMg0LzQtdC90Y5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQu9C40YHRgtCwINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdGC0LDRgNGC0LAg0L3QsNC20LDRgtC40Y8g0L3QsCDQu9C40YHRgi5cclxuICAgICAqIEBtZXRob2QgX29uVG91Y2hTdGFydFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnQg0L7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hTdGFydChldmVudCl7XHJcbiAgICAgICAgdGhpcy5fcG9pbnRUb3VjaEZvck1lbnUgPSBldmVudC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC+0YLQv9GD0YHQutCw0L3QuNGPINGC0LDRh9CwINC+0YIg0LvQuNGB0YLQsC5cclxuICAgICAqIEBtZXRob2QgX29uVG91Y2hFbmRcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50INC+0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9vblRvdWNoRW5kKGV2ZW50KXtcclxuICAgICAgICBsZXQgcG9pbnQgPSBldmVudC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxldCBYID0gTWF0aC5hYnModGhpcy5fcG9pbnRUb3VjaEZvck1lbnUueCAtIHBvaW50LngpIDwgdGhpcy5tYXhCaWFzVG91Y2g7XHJcbiAgICAgICAgbGV0IFkgPSBNYXRoLmFicyh0aGlzLl9wb2ludFRvdWNoRm9yTWVudS55IC0gcG9pbnQueSkgPCB0aGlzLm1heEJpYXNUb3VjaDtcclxuICAgICAgICBpZiAoWCAmJiBZKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hFdmVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0YHQstC30LDQvdC90L7QtSDRgSDRjdGC0LjQvCDQu9C40YHRgtC+0LwuXHJcbiAgICAgKiBAbWV0aG9kIF9wdWJsaXNoRXZlbnRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9wdWJsaXNoRXZlbnQoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSh0aGlzLm5hbWVFdmVudCwgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIGFuaW1hbDogdGhpcy5tYW5hZ2VyLnBhcmVudCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC00LLQuNC20LXQvdC40Y8g0YLQsNGH0LAuXHJcbiAgICAgKiBAbWV0aG9kIF9vblRvdWNoTW92ZVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnQg0L7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hNb3ZlKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gZXZlbnQudG91Y2guZ2V0UHJldmlvdXNMb2NhdGlvbigpO1xyXG4gICAgICAgIHZhciBkZWx0YSA9IGV2ZW50LnRvdWNoLmdldERlbHRhKCk7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyLmRpcmVjdGlvblJvdGF0aW9uKGRlbHRhLngsIGRlbHRhLnksIHBvaW50LngsIHBvaW50LnkpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxufSk7IiwiXHJcblxyXG5cclxuLyoqXHJcbiAqINCh0L7RgdGC0L7Rj9C90LjQtSDQuNCz0YDRiy5cclxuICogQHR5cGUge1N0YXRHYW1lfVxyXG4gKiBAc3RhdGljXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IHNsZWVwINCx0LXQt9C00LXQudGB0YLQstC40LUuXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IG9wZW5NZW51INC+0YLQutGA0YvRgtC40LUg0LzQtdC90Y4g0LjQs9GA0YsuXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IG9wZW5NZW51QW5pbWFsINC+0YLQutGA0YvRgtC40LUg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gKiBAZWxlbWVudCB7bnVtYmVyfSBjcmVhdGVBbmltYWwg0YHQvtC30LTQsNC90LjQtSDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IG1vdmVNYXAg0LTQstC40LbQtdC90LjQtSDQutCw0YDRgtGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gKi9cclxuY29uc3QgU3RhdEdhbWUgPSB7XHJcbiAgICBzbGVlcDogMCxcclxuICAgIG9wZW5NZW51OiAxLFxyXG4gICAgb3Blbk1lbnVBbmltYWw6IDIsXHJcbiAgICBjcmVhdGVBbmltYWw6IDMsXHJcbiAgICBtb3ZlTWFwOiA0LFxyXG59O1xyXG5cclxuLyoqXHJcbiAqINCj0L/RgNCw0LLQu9GP0LXRgiDQv9GA0LXQtNGB0YLQsNCy0LvQvdC40LXQvC5cclxuICogQGNsYXNzIFBsYXlcclxuICovXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgbm9kZVdpbmRvdzogY2MuTm9kZSwvL9C+0LrQvdC+INC40LPRgNGLXHJcbiAgICAgICAgbm9kZUJveENyZWF0ZUFuaW1hbDogY2MuTm9kZSwvL9Cy0YHQv9C70YvQstCw0Y7RidC40Lkg0LHQvtC60YEg0YEg0LbQuNCy0L7RgtC90YvQvNC4XHJcbiAgICAgICAgbm9kZUJveENoYXJhY3RlcmlzdGljc0FuaW1hbDogY2MuTm9kZSwvL9Cy0YHQv9C70YvQstCw0Y7RidC40Lkg0LHQvtC60YEg0YEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LrQsNC80Lgg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgbm9kZUJhc2tldDogY2MuTm9kZSwvL9C60L7RgNC30LjQvdCwINC00LvRjyDRg9C00LDQu9C10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgIG5vZGVGaWVsZEFuaW1hbHM6IGNjLk5vZGUsLy/Qv9C+0LvQtSDQttC40LfQvdC10LTQtdGP0YLQtdC70YzQvdC+0YHRgtC4INC20LjQstC+0YLQvdGL0YVcclxuICAgICAgICBub2RlQm94TWFwOiBjYy5Ob2RlLC8v0LHQvtC60YEg0YEg0LrQsNGA0YLQvtC5XHJcbiAgICAgICAgbm9kZU1hcDogY2MuTm9kZSwvL9C/0L7Qu9C1INC60LDRgNGC0YtcclxuICAgICAgICBub2RlTWVudTogY2MuTm9kZSwvL9C/0L7Qu9C1INC80LXQvdGOINC40LPRgNGLXHJcbiAgICAgICAgbm9kZU1lbnVBbmltYWw6IGNjLk5vZGUsLy/QvdC+0LQg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgbm9kZU1hc2tDcmVhdGVkQW5pbWFsOiBjYy5Ob2RlLC8v0LzQsNGB0LrQsCDQtNC70Y8g0YHQvtC30LTQsNC90LjRjyDQttC40LLQvtGC0L3Ri9GFXHJcblxyXG4gICAgICAgIHByZWZhYlBhcmFtZXRyQ2hhcmFjdGVyaXN0aWNzOiBjYy5QcmVmYWIsLy/Qv9GA0LXRhNCw0LEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LrQuFxyXG5cclxuICAgICAgICBjb2xvclRleHRDaGFyYWN0ZXJpc3RpY3M6IGNjLkNvbG9yLC8v0YbQstC10YIg0YLQtdC60YHRgtCwINGDINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6XHJcblxyXG4gICAgICAgIF90YXJnZXRBbmltYWw6IGNjLk5vZGUsLy/QvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1XHJcbiAgICAgICAgX3BvaW50VGFyZ2V0QW5pbWFsOiBjYy52MiwvL9GC0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1XHJcbiAgICAgICAgX3RhcmdldENvbnRyb2xsZXJBbmltYWw6IGNjLk5vZGUsLy/QutC+0L3RgtGA0L7Qu9C70LXRgCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICBfY2VudHJlV2luZG93UG9pbnQ6IG51bGwsLy/RgtC+0YfQutCwINGB0LXRgNC10LTQuNC90Ysg0Y3QutGA0LDQvdCwXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrQvtC90YDQvtC70LvQtdGA0LAg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8uXHJcbiAgICAgKiBAbWV0aG9kIG9uTG9hZFxyXG4gICAgICovXHJcbiAgICBvbkxvYWQoKXtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICAgICAvL2NkIHRoaXMucD1uZXcgUHJvbWlzZSgoYSxiKT0+e30pO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY3JlYXRlQW5pbWFsJywgdGhpcy5vbkFuaW1hbENyZWF0ZWQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdvcGVuQm94RnJvbUFuaW1hbCcsIHRoaXMub25PcGVuQm94RnJvbUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2Nsb3NlQm94RnJvbUFuaW1hbCcsIHRoaXMub25DbG9zZUJveEZyb21BbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdvcGVuQm94TWVudVBsYXknLCB0aGlzLm9uT3BlbkJveE1lbnVQbGF5LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY2xvc2VCb3hNZW51UGxheScsIHRoaXMub25DbG9zZUJveE1lbnVQbGF5LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUub24oJ29wZW5Cb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsJywgdGhpcy5vbk9wZW5Cb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY2xvc2VCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsJywgdGhpcy5vbkNsb3NlQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3N0YXJ0RHJhZ0FuZERyb3BBbmltYWwnLCB0aGlzLm9uU3RhcnREcmFnQW5kRHJvcEFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2RyYWdBbmREcm9wQW5pbWFsJywgdGhpcy5vbkRyYWdBbmREcm9wQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignc3RvcERyYWdBbmREcm9wQW5pbWFsJywgdGhpcy5vblN0b3BEcmFnQW5kRHJvcEFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ21vdGlvbkFuaW1hbCcsIHRoaXMub25Nb3Rpb25BbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdzdGFydE1vdGlvbkFuaW1hbCcsIHRoaXMub25TdGFydE1vdGlvbkFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2VuZE1vdGlvbkFuaW1hbCcsIHRoaXMub25FbmRNb3Rpb25BbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdvcGVuTWVudUFuaW1hbCcsIHRoaXMub25PcGVuTWVudUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2Nsb3NlTWVudUFuaW1hbCcsIHRoaXMub25DbG9zZU1lbnVBbmltYWwuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbigndm9pY2VBbmltYWwnLCB0aGlzLm9uVm9pY2VBbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdzaXRBbmltYWwnLCB0aGlzLm9uU2l0QW5pbWFsLmJpbmQodGhpcykpOy8v0YHQuNC00LXRgtGMXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdmcmlnaHRlbkFuaW1hbCcsIHRoaXMub25GcmlnaHRlbkFuaW1hbC5iaW5kKHRoaXMpKTsvL9C90LDQv9GD0LPQsNGC0YxcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2FyZWFsQW5pbWFsJywgdGhpcy5vbkFyZWFsQW5pbWFsLmJpbmQodGhpcykpOy8v0L/QvtC60LDQt9Cw0YLRjCDQsNGA0LXQsNC7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjYXJlQW5pbWFsJywgdGhpcy5vbkNhcmVBbmltYWwuYmluZCh0aGlzKSk7Ly/Ql9Cw0LHQvtGC0LAsINCz0LvQsNC00LjRgtGMXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdsaWVBbmltYWwnLCB0aGlzLm9uTGllQW5pbWFsLmJpbmQodGhpcykpOy8v0JvQtdC20LDRgtGMLNC70LXRh9GMXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdhdHRlbnRpb25BbmltYWwnLCB0aGlzLm9uQXR0ZW50aW9uQW5pbWFsLmJpbmQodGhpcykpOy8v0JLQvdC40LzQsNC90LjQtSwg0LPQvtGC0L7QstGB0YxcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdiYXNrZXRBY3RpdmUnLCB0aGlzLm9uQmFza2V0QWN0aXZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignYmFza2V0U2xlZXAnLCB0aGlzLm9uQmFza2V0U2xlZXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdiYXNrZXRXb3JrJywgdGhpcy5vbkJhc2tldFdvcmsuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hPbk1hcCcsIHRoaXMub25Ub3VjaE9uTWFwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hNb3ZlT25NYXAnLCB0aGlzLm9uVG91Y2hNb3ZlT25NYXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaEVuZE1vdmVPbk1hcCcsIHRoaXMub25Ub3VjaEVuZE1vdmVPbk1hcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2ZpbmlzaE1vdmVDYW1lcmFUb0FuaW1hbCcsIHRoaXMub25GaW5pc2hNb3ZlQ2FtZXJhVG9BbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LTQsNC90L3Ri9GFLlxyXG4gICAgICogQG1ldGhvZCBfaW5pdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2luaXQoKXtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX3N0YXRlR2FtZSA9IFN0YXRHYW1lLnNsZWVwO1xyXG5cclxuICAgICAgICB0aGlzLl90YXJnZXRTaXplV2l0aCA9IDA7Ly/QstGA0LXQvNC10L3QvdGL0LUg0YDQsNC30LzQtdGA0Ysg0YjQuNGA0LjQvdGLINC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YLQtS4g0JTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0U2l6ZUhlaWdodCA9IDA7Ly/QstGA0LXQvNC10L3QvdGL0LUg0YDQsNC30LzQtdGA0Ysg0LLRi9GB0L7RgtGLINC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YLQtS4g0JTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPXHJcblxyXG4gICAgICAgIHRoaXMuX3BvaW50VGFyZ2V0QW5pbWFsID0gY2MudjIoMCwgMCk7Ly/RgtC+0YfQutCwINC90LDQt9C90LDRh9C10L3QuNGPINC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YJcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBudWxsOyAvL9C90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsID0gbnVsbDsvL9C60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQviAo0YLQvtC70YzQutC+IDEg0YLQvtCz0L4g0YfRgtC+INCyINGC0LDRgNCz0LXRgtC1KVxyXG4gICAgICAgIHRoaXMuX2NlbnRyZVdpbmRvd1BvaW50ID0gY2MudjIodGhpcy5ub2RlLndpZHRoIC8gMiwgdGhpcy5ub2RlLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJDaXJjdWxhck1lbnUgPSB0aGlzLm5vZGVNZW51QW5pbWFsLmdldENvbXBvbmVudCgnY2lyY3VsYXItbGlzdC1hY3Rpb25zLWFuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2JveENyZWF0ZUFuaW1hbCA9IHRoaXMubm9kZUJveENyZWF0ZUFuaW1hbC5nZXRDb21wb25lbnQoJ2JveC1jcmVhdGUtYW5pbWFsJyk7XHJcbiAgICAgICAgdGhpcy5fYm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsID0gdGhpcy5ub2RlQm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsLmdldENvbXBvbmVudCgnYm94LWNoYXJhY3RlcmlzdGljcy1hbmltYWwnKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQmFza2V0ID0gdGhpcy5ub2RlQmFza2V0LmdldENvbXBvbmVudCgnYmFza2V0LWFuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJNYXAgPSB0aGlzLm5vZGVNYXAuZ2V0Q29tcG9uZW50KCdjb250cm9sbGVyLW1hcCcpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQkdC+0LrRgSDRgSDQttC40LLQvtGC0L3Ri9C80Lgg0LfQsNC60YDRi9C70YHRjy5cclxuICAgICAqIEBtZXRob2Qgb25DbG9zZUJveEZyb21BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VCb3hGcm9tQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0LrRgNGL0LvRgdGPIEJveEZyb21BbmltYWwnKTtcclxuICAgICAgICBpZiAodGhpcy5fc3RhdGVHYW1lICE9IFN0YXRHYW1lLmNyZWF0ZUFuaW1hbCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVNYXNrQ3JlYXRlZEFuaW1hbC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCR0L7QutGBINGBINC20LjQstC+0YLQvdGL0LzQuCDQvtGC0LrRgNGL0LvRgdGPLlxyXG4gICAgICogQG1ldGhvZCBvbk9wZW5Cb3hGcm9tQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbk9wZW5Cb3hGcm9tQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQvtGC0LrRgNGL0LvRgdGPIEJveEZyb21BbmltYWwnKTtcclxuICAgICAgICB0aGlzLm5vZGVNYXNrQ3JlYXRlZEFuaW1hbC5hY3RpdmUgPSB0cnVlOy8v0LDQutGC0LjQstC40YDQvtCy0LDQu9C4INC80LDRgdC60YNcclxuICAgICAgICB0aGlzLm5vZGVNYXNrQ3JlYXRlZEFuaW1hbC5zZXRQb3NpdGlvbih0aGlzLl9jZW50cmVXaW5kb3dQb2ludCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRyb2xsZXJBbmltYWwgIT09IG51bGwpIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXQvdGOINC+0YLQutGA0YvQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25PcGVuQm94TWVudVBsYXlcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3BlbkJveE1lbnVQbGF5KGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQvtGC0LrRgNGL0LvQvtGB0Ywg0LzQtdC90Y4nKTtcclxuICAgICAgICB0aGlzLm5vZGVNZW51LmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdC90Y4g0LfQsNC60YDRi9C70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvbkNsb3NlQm94TWVudVBsYXlcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VCb3hNZW51UGxheShldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0LfQsNC60YDRi9C70L7RgdGMINC80LXQvdGOJyk7XHJcbiAgICAgICAgdGhpcy5ub2RlTWVudS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0L3QuNC1INC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqINCe0YLQstC10YfQsNC10YIg0LfQsCDRgNCw0LfQvNC10YnQtdC90LjQtSDQttC40LLQvtGC0L3QvtCz0L4g0LIg0LTQtdGA0LXQstC1INC90L7QtNC+0LIuXHJcbiAgICAgKiBAbWV0aG9kIG9uQW5pbWFsQ3JlYXRlZFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25BbmltYWxDcmVhdGVkKGV2ZW50KXtcclxuICAgICAgICB0aGlzLl9zdGF0ZUdhbWUgPSBTdGF0R2FtZS5jcmVhdGVBbmltYWw7XHJcbiAgICAgICAgY2MubG9nKCfRgdC+0LfQtNCw0L3QuNC1INC90L7QstC+0LPQviDQttC40LLQvtGC0L3QvtCz0L4nKTtcclxuICAgICAgICBldmVudC5kZXRhaWwuYW5pbWFsLnBhcmVudCA9IHRoaXMubm9kZUZpZWxkQW5pbWFscy5wYXJlbnQ7Ly8g0L/QvtC00YbQtdC/0LjRgtGMINC20LjQstC+0YLQvdC+0LUg0Log0LrQsNGA0YLQtVxyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRNYXAoY2MudjIodGhpcy5ub2RlLndpZHRoIC8gMiwgdGhpcy5ub2RlLmhlaWdodCAvIDIpKTsvL9Cy0YvRh9C40YHQu9C40YLRjCDQutC+0L7RgNC00LjQvdCw0YLRiyDQvdCwINC60LDRgNGC0LVcclxuICAgICAgICBldmVudC5kZXRhaWwuYW5pbWFsLnNldFBvc2l0aW9uKHBvaW50LngsIHBvaW50LnkpOy8v0KPRgdGC0LDQvdC+0LLQuNGC0Ywg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0UHV0aFRvTW9kZWwgPSBldmVudC5kZXRhaWwucHV0aFRvTW9kZWw7Ly/QodC+0YXRgNCw0L3QuNGC0Ywg0L/Rg9GC0Ywg0LTQviDQvNC+0LTQtdC70LguINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9GA0Lgg0YHQvtC30LTQsNC90LjQuCDQvNC+0LTQtdC70LhcclxuXHJcbiAgICAgICAgdGhpcy5fYm94Q3JlYXRlQW5pbWFsLmNsb3NlQm94KCk7Ly/Qt9Cw0LrRgNGL0YLRjCDQsdC+0LrRgSDRgSDQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAgICB0aGlzLl9ib3hDcmVhdGVBbmltYWwub25CbG9jaygpOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LHQvtC60YEg0YHQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQmFza2V0Lm9uKCk7Ly/QktC60LvRjtGH0LjRgtGMINC60L7RgNC30LjQvdGDXHJcbiAgICAgICAgdGhpcy5ub2RlQm94TWFwLmdldENvbXBvbmVudChjYy5TY3JvbGxWaWV3KS5lbmFibGVkID0gZmFsc2U7Ly/Qt9Cw0LHQu9C+0LrQuNGA0L7QstCw0YLRjCDQutCw0YDRgtGDXHJcblxyXG4gICAgICAgIC8v0J3QtdC+0LHRhdC+0LTQuNC80L4g0LfQsNC60YDRi9GC0Ywg0LLRgdC1INGH0YLQviDRgdCy0Y/Qt9Cw0L3QviDRgSDQv9GA0L7RiNC70YvQvCDRhNC+0LrRg9GB0L7QvFxyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRBbmltYWwgIT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTsvL9C30LDQutGA0YvQstCw0LXRgiDQvNC10L3RjlxyXG4gICAgICAgICAgICB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwuY2xvc2VCb3goKTsvL9C30LDQutGA0YvRgtGMINCx0L7QutGBINGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LDQvNC4XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IG51bGw7Ly/QvtCx0L3Rg9C70Y/QtdGCINGB0YHRi9C70LrRgyDQvdCwINC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YTQvtC60YPRgdC1XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1INC20LjQstC+0YLQvdC+0LPQviDQvdCw0YfQsNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvblN0YXJ0RHJhZ0FuZERyb3BBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uU3RhcnREcmFnQW5kRHJvcEFuaW1hbChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0LfQsNC/0YPRgdC6INCw0L3QuNC80LDRhtC40Lgg0L/QvtC00LLQtdGI0LXQvdC90L7RgdGC0LggKNGB0YLQsNGA0YIg0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjRjyknKTtcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBldmVudC5kZXRhaWwuYW5pbWFsOy8v0JHQtdGA0LXQvCDQvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGE0L7QutGD0YFcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSBmYWxzZTsvL9C30LDQsdC70L7QutC40YDQvtCy0LDRgtGMINC00LLQuNC20LXQvdC40LUg0LrQsNGA0YLRi1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjQtSDQvdC+0LLQvtCz0L4g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICog0J7RgtCy0LXRh9Cw0LXRgiDQt9CwINC/0LXRgNC10LzQtdGJ0LXQvdC40LUg0L3QvtC00LAg0LbQuNCy0L7RgtC90L7Qs9C+INC/0L4g0LrQsNGA0YLQtSDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0Lgg0L/RgNC+0LjQt9Cy0L7QtNC40YIg0LfQsNC80LXRgNGLINC00L4g0YDQsNC30LvQuNGH0L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0L3QsCDQutCw0YDRgtC1LlxyXG4gICAgICogQG1ldGhvZCBvbkRyYWdBbmREcm9wQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkRyYWdBbmREcm9wQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfRgdC+0L7QsdGJ0LDQtdC8INC60L7RgNC30LjQvdC1INC/0L7Qu9C+0LbQtdC90LjQtSDQt9Cy0LXRgNGO0YjQutC4ICjQv9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1KScpO1xyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRXaW5kb3coZXZlbnQuZGV0YWlsLnBvaW50KTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQmFza2V0LnNldFBvc2l0aW9uQW5pbWFsKHBvaW50KTtcclxuICAgICAgICB0aGlzLm5vZGVNYXNrQ3JlYXRlZEFuaW1hbC5zZXRQb3NpdGlvbihwb2ludCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjQtSDQttC40LLQvtGC0L3QvtCz0L4g0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25TdG9wRHJhZ0FuZERyb3BBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uU3RvcERyYWdBbmREcm9wQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQvtC/0YDQtdC00LXQu9C10L3QuNC1INC00LDQu9GM0L3QtdC50YjQuNGFINC00LXQudGB0YLQstC40Lkg0YEg0LbQuNCy0L7RgtC90YvQvCAo0LfQsNCy0LXRgNGI0LXQvdC40LUg0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjQtSknKTtcclxuICAgICAgICBsZXQgcG9pbnQgPSB0aGlzLl9jb250cm9sbGVyTWFwLmdldFBvaW50V2luZG93KGV2ZW50LmRldGFpbC5wb2ludCk7IC8v0JfQsNC/0YDQsNGI0LjQstCw0LXQvCDRgtC+0YfQutGDINCyINGE0L7RgNC80LDRgtC1INC60L7QvtGA0LTQuNC90LDRgtGLINC+0LrQvdCwXHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jb250cm9sbGVyQmFza2V0LmlzQW5pbWFsTGlmZShwb2ludCkpIHtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZU1vZGVsID0gY2MuaW5zdGFudGlhdGUodGhpcy5fdGFyZ2V0QW5pbWFsLmNoaWxkcmVuWzBdKTsvL9GB0L7Qt9C00LDQtdC8INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICAgICAgbm9kZU1vZGVsLnBhcmVudCA9IHRoaXMubm9kZUZpZWxkQW5pbWFsczsvL9CS0LXRiNCw0LXQvCDQvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+INC90LAg0L3QvtC0INGB0L4g0LLRgdC10LzQuCDQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAgICAgICAgbm9kZU1vZGVsLnNldFBvc2l0aW9uKGV2ZW50LmRldGFpbC5wb2ludC54LCBldmVudC5kZXRhaWwucG9pbnQueSk7Ly/Qo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDQv9C+0LfQuNGG0LjRjiDQvdCwINC60LDRgNGC0LVcclxuICAgICAgICAgICAgbm9kZU1vZGVsLmFkZENvbXBvbmVudCgnY29udHJvbGxlci1hbmltYWwnKTsvL9CU0L7QsdCw0LLQu9GP0LXQvCDQutC+0L3RgtGA0L7Qu9C70LXRgCDRgtC10LvRgyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICAgICAgbm9kZU1vZGVsLmdldENvbXBvbmVudCgnY29udHJvbGxlci1hbmltYWwnKS5zZXR0aW5ncyh7XHJcbiAgICAgICAgICAgICAgICBwdXRoVG9Nb2RlbDp0aGlzLl90YXJnZXRQdXRoVG9Nb2RlbCxcclxuICAgICAgICAgICAgICAgIGlkOnRoaXMubm9kZUZpZWxkQW5pbWFscy5jaGlsZHJlbi5sZW5ndGgtMVxyXG4gICAgICAgICAgICB9KTsvL9Cd0LDRgdGC0YDQsNC40LLQsNC8INC60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgICAgICBub2RlTW9kZWwuZ2V0Q29tcG9uZW50KCdjb250cm9sbGVyLWFuaW1hbCcpLnJ1bigpOy8v0JfQsNC/0YPRgdC60LDQtdGCINC20LjQt9C90Ywg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQub25CYWRXb3JrQmFza2V0KCk7Ly/QlNCw0YLRjCDQutC+0LzQsNC90LTRgyDQutC+0YDQt9C40L3QtSjQvdC1INGB0LXQudGH0LDRgSlcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udHJvbGxlckJhc2tldC5vbkdvb2RXb3JrQmFza2V0KCk7Ly/QlNCw0YLRjCDQutC+0LzQsNC90LTRgyDQutC+0YDQt9C40L3QtSjRgNCw0LHQvtGC0LDRgtGMKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLmRlc3Ryb3koKTsvL9Cj0LTQsNC70LjRgtGMINCy0YDQtdC80LXQvdC90YvQuSDQvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckJhc2tldC5vZmYoKTsvL9Cy0YvRgNGD0LHQuNGC0Ywg0LrQvtGA0LfQuNC90YNcclxuICAgICAgICB0aGlzLl9ib3hDcmVhdGVBbmltYWwub2ZmQmxvY2soKTsvL9Cy0YvRgNGD0LHQuNGC0Ywg0LHQu9C+0LrQuNGA0L7QstC60YMg0L3QuNC20L3QtdCz0L4g0LHQvtC60YHQsFxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IHRydWU7Ly/RgNCw0LfQsdC70L7QutC40YDQvtCy0LDRgtGMINC00LLQuNC20LXQvdC40LUg0LrQsNGA0YLRi1xyXG5cclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBudWxsOy8v0L7QsdC90YPQu9C40YLRjCAg0LbQuNCy0L7RgtC90L7QtSDQsiDRgtCw0YDQs9C10YLQtVxyXG4gICAgICAgIHRoaXMuX3RhcmdldFB1dGhUb01vZGVsID0gbnVsbDsvL9C+0LHQvdGD0LvQuNGC0Ywg0L/Rg9GC0Ywg0LTQviDQvNC+0LTQtdC70Lgg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5ub2RlTWFza0NyZWF0ZWRBbmltYWwuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUuc2xlZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNGH0LDQu9C+INC00LLQuNC20LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICogQG1ldGhvZCBvblN0YXJ0TW90aW9uQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblN0YXJ0TW90aW9uQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICAvL9CX0LDQutGA0YvQstCw0Y4g0LzQtdC90Y4g0LjQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQttC40LLQvtGC0L3QvtC8INC10YHQu9C4INC/0LXRgNC10LrQu9GO0YfQsNGO0YHRjCDQvdCwINC00YDRg9Cz0L7QtSDQttC40LLQvtGC0L3QvtC1XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldEFuaW1hbCAhPSBudWxsICYmIHRoaXMuX3RhcmdldEFuaW1hbC5fbW9kZWwuaWQgIT0gZXZlbnQuZGV0YWlsLmNvbnRyb2xsZXIuX21vZGVsLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7Ly/Qt9Cw0LrRgNGL0YLRjCDQvNC10L3RjlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2MubG9nKCfQvdCw0YfQuNC90LDRjiDQtNCy0LjQs9Cw0YLRjNGB0Y8g0LfQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvCjQndCw0YfQuNC90LDRjiDQstGL0Y7QvtGAINC00LLQuNCz0LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC60YDRi9GC0Ywg0LzQtdC90Y4pJyk7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5fY29udHJvbGxlck1hcC5nZXRQb2ludE1hcChldmVudC5kZXRhaWwuc3RhcnRNb3Rpb24pOy8v0LrQvtC90LLQtdGA0YLQuNGA0YPQtdC8INGC0L7Rh9C60YMg0L7QutC90LAg0Log0YLQvtGH0LrRgyDQutCw0YDRgtGLXHJcblxyXG4gICAgICAgIHRoaXMuX3BvaW50VGFyZ2V0QW5pbWFsID0gY2MudjIocG9pbnQueCwgcG9pbnQueSk7Ly8g0LfQsNC00LDQtdC8INGC0L7Rh9C60YMg0LrRg9C00LAg0L3QsNC00L4g0LTQvtGB0YLQsNCy0LjRgtGMINC20LjQstC+0YLQvdC1XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbCA9IGV2ZW50LmRldGFpbC5jb250cm9sbGVyOy8v0L/QvtC70YPRh9Cw0LXQvCDQutC+0L3RgtGA0L7Qu9C70LXRgCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBldmVudC5kZXRhaWwuY29udHJvbGxlcjsvL9GD0YHRgtCw0L3QvtCy0LjQu9C4INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0L3QsCDRhNC+0LrRg9GBXHJcblxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IGZhbHNlOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG5cclxuICAgICAgICAvL9GD0LLQtdC70LjRh9C40Lwg0L/QvtC70LUg0L7RgtC60LvQuNC60LAg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0U2l6ZVdpdGggPSB0aGlzLl90YXJnZXRBbmltYWwubm9kZS53aWR0aDtcclxuICAgICAgICB0aGlzLl90YXJnZXRTaXplSGVpZ2h0ID0gdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LLQuNC20LXQvdC40LUg0LbQuNCy0L7RgtC90L7Qs9C+INC30LAg0LLQtdC00YPRidC40LwuXHJcbiAgICAgKiBAbWV0aG9kIG9uTW90aW9uQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbk1vdGlvbkFuaW1hbChldmVudCl7XHJcbiAgICAgICAgLy/QvtCx0YDQsNCx0L7RgtC60LAg0YHQvtCx0YvRgtC40Lkg0YEg0LbQuNCy0L7RgtC90YvQvCDQstC+INCy0YDQtdC80Y8g0LTQstC40LbQtdC90LjRj1xyXG4gICAgICAgIGNjLmxvZygn0LTQstC40LPQsNGO0YHRjCDQt9CwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8Jyk7XHJcbiAgICAgICAgLy/Rg9Cy0LXQu9C40YfQuNC8INC/0L7Qu9C1INC+0YLQutC70LjQutCwINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbC5ub2RlLndpZHRoID0gMjAwMDtcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubm9kZS5oZWlnaHQgPSAyMDAwO1xyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRNYXAoZXZlbnQuZGV0YWlsLnBvaW50RW5kKTsvLyDQutC+0L3QstC10YDRgtC40YDRg9C10Lwg0YLQvtGH0LrRgyDQvtC60L3QsCDQuiDRgtC+0YfQutC1INC60LDRgNGC0YtcclxuICAgICAgICB0aGlzLl9wb2ludFRhcmdldEFuaW1hbCA9IGNjLnYyKHBvaW50LngsIHBvaW50LnkpOy8vINCy0YvRh9C40YHQu9GP0LXQvCDRgtC+0YfQutGDINC60YPQtNCwINC/0L7QudC00LXRgiDQttC40LLQvtGC0L3QvtC1INCyINC40YLQvtCz0LVcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubW92ZVRvUG9pbnQodGhpcy5fcG9pbnRUYXJnZXRBbmltYWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LrQvtC90YfQsNC90LjQtSDQtNCy0LjQttC10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25FbmRNb3Rpb25BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uRW5kTW90aW9uQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C30LDQutCw0L3Rh9C40LLQsNGOINC00LLQuNCz0LDRgtGM0YHRjyDQt9CwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8Jyk7XHJcblxyXG4gICAgICAgIC8v0YPQvNC10L3RjNGI0LDQtdC8INC/0LvQvtGJ0LDQtNGMINC/0L7QutGA0YvRgtC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUud2lkdGggPSB0aGlzLl90YXJnZXRTaXplV2l0aDtcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubm9kZS5oZWlnaHQgPSB0aGlzLl90YXJnZXRTaXplSGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcG9pbnQgPSB0aGlzLl9jb250cm9sbGVyTWFwLmdldFBvaW50TWFwKGV2ZW50LmRldGFpbC5wb2ludEVuZCk7Ly8g0LrQvtC90LLQtdGA0YLQuNGA0YPQtdC8INGC0L7Rh9C60YMg0L7QutC90LAg0Log0YLQvtGH0LrQtSDQutCw0YDRgtGLXHJcbiAgICAgICAgdGhpcy5fcG9pbnRUYXJnZXRBbmltYWwgPSBjYy52Mihwb2ludC54LCBwb2ludC55KTsvLyDQstGL0YfQuNGB0LvRj9C10Lwg0YLQvtGH0LrRgyDQutGD0LTQsCDQv9C+0LnQtNC10YIg0LbQuNCy0L7RgtC90L7QtSDQsiDQuNGC0L7Qs9C1XHJcbiAgICAgICAgLy/RgdC+0L7QsdGJ0LDQtdC8INC80L7QtNC10LvQuCDRgtC+0YfQutGDINC00L4g0LrQvtGC0L7RgNC+0Lkg0L3QtdC+0LHRhdC+0LTQuNC80L4g0LXQuSDQtNC+0LnRgtC4XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLm1vdmVUb1BvaW50KHRoaXMuX3BvaW50VGFyZ2V0QW5pbWFsKTtcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSB0cnVlOyAvLyDQoNCw0LfQsdC70L7QutC40YDQvtCy0LDQu9C4INC60LDRgNGC0YNcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4g0L7RgtC60YDRi9GC0L4uXHJcbiAgICAgKiBAbWV0aG9kIG9uT3Blbk1lbnVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3Blbk1lbnVBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0J7RgtC60YDRi9Cy0LDRjiDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4nKTtcclxuICAgICAgICAvL9Cm0LXQvdGC0YDQuNGA0L7QstCw0YLRjCDQttC40LLQvtGC0L3QvtC1XHJcbiAgICAgICAgbGV0IHBvaW50ID0gY2MudjIodGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUueCAtIHRoaXMuX2NlbnRyZVdpbmRvd1BvaW50LngsIHRoaXMuX3RhcmdldEFuaW1hbC5ub2RlLnkgLSB0aGlzLl9jZW50cmVXaW5kb3dQb2ludC55KTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hcC5tb3ZlQWN0aW9ucyhwb2ludCwgMC4yNSk7Ly/Qv9C10YDQtdC80LXRgdGC0LjRgtGMINGG0LXQvdGC0YAg0LrQsNC80LXRgNGLINC90LAg0Y3RgtGDINGC0L7Rh9C60YMg0LfQsCAwLjI1INGB0LXQutGD0L3QtNGLXHJcblxyXG4gICAgICAgIC8v0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0L3QsNGB0YLRgNC+0LnQutC4INC00LvRjyDQvNC10L3RjlxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJDaXJjdWxhck1lbnUuc2V0dGluZ3ModGhpcy5fY29udHJvbGxlckFuaW1hbCk7XHJcblxyXG4gICAgICAgIC8v0LfQsNC/0L7Qu9C90LjRgtGMINCx0L7QutGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6LCwsXHJcblxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IGZhbHNlOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG4gICAgICAgIHRoaXMuX3N0YXRlR2FtZSA9IFN0YXRHYW1lLm9wZW5NZW51O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXQvdGOINC20LjQstC+0YLQvdC+0LPQviDQt9Cw0LrRgNGL0YLQvi5cclxuICAgICAqIEBtZXRob2Qgb25DbG9zZU1lbnVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VNZW51QW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQl9Cw0LrRgNGL0LLQsNGOINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvicpO1xyXG4gICAgICAgIHRoaXMubm9kZU1lbnVBbmltYWwuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ub2RlQm94TWFwLmdldENvbXBvbmVudChjYy5TY3JvbGxWaWV3KS5lbmFibGVkID0gdHJ1ZTsvL9GA0LDQt9Cx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG4gICAgICAgIHRoaXMuX2JveENoYXJhY3RlcmlzdGljc0FuaW1hbC5jbG9zZUJveCgpO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUuc2xlZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQuNC30LTQsNC70L4g0LfQstGD0LouXHJcbiAgICAgKiBAbWV0aG9kIG9uVm9pY2VBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVm9pY2VBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0LbQuNCy0L7RgtC90L7QtSDQv9GA0L7Rj9Cy0LjQu9C+INCz0L7Qu9C+0YEnKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1blZvaWNlKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQltC40LLQvtGC0L3QvtC1INGB0LXQu9C+XHJcbiAgICAgKiBAbWV0aG9kIG9uU2l0QW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblNpdEFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INGB0LXQu9C+Jyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5TaXQoKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLmNsb3NlTWVudSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCW0LjQstC+0YLQvdC+0LUg0LjRgdC/0YPQs9Cw0LvQvtGB0YxcclxuICAgICAqIEBtZXRob2Qgb25GcmlnaHRlbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25GcmlnaHRlbkFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC40YHQv9GD0LPQsNC70L7RgdGMJyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5GcmlnaHRlbigpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0LDRgNC10LDQu9GLINGH0YPQstGB0YLQslxyXG4gICAgICogQG1ldGhvZCBvbkFyZWFsQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkFyZWFsQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C20LjQstC+0YLQvdC+0LUg0L/QvtC60LDQt9Cw0LvQviDRgdCy0L7QuSDQsNGA0LXQsNC7Jyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5BcmVhbCgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQv9C+0LPQu9Cw0LTQuNC70Lgs0L/QvtC20LDQu9C10LvQuFxyXG4gICAgICogQG1ldGhvZCBvbkNhcmVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2FyZUFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC/0L7Qs9C70LDQtNC40LvQuCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwucnVuQ2FyZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQu9C10LPQu9C+XHJcbiAgICAgKiBAbWV0aG9kIG9uTGllQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkxpZUFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC70LXQs9C70L4nKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1bkxpZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQv9GA0LjQs9C+0YLQvtCy0LjQu9C+0YHRjFxyXG4gICAgICogQG1ldGhvZCBvbkF0dGVudGlvbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25BdHRlbnRpb25BbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0LbQuNCy0L7RgtC90L7QtSDQv9GA0LjQs9C+0YLQvtCy0LjQu9C+0YHRjCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwucnVuQXR0ZW50aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQkdC+0LrRgSDRhdCw0YDQsNC60YLRgNC40YHRgtC40Log0LbQuNCy0L7RgtC90L7Qs9C+INC+0YLQutGA0YvQu9GB0Y8uXHJcbiAgICAgKiBAbWV0aG9kIG9uT3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0YLQutGA0YvQu9GB0Y8gQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2JveENyZWF0ZUFuaW1hbC5jbG9zZUJveCgpO1xyXG4gICAgICAgIC8v0LfQsNC/0L7Qu9C90Y/QtdGCINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuICAgICAgICBsZXQgbWFzcyA9IHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuZ2V0Q2hhcmFjdGVyaXN0aWNzKCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwuY29udGVudDtcclxuXHJcbiAgICAgICAgbGV0IG5vZGVQYXJhbTtcclxuICAgICAgICAvL9GH0LjRgdGC0LjQvCDQv9GA0LXQtNGL0LTRg9GJ0LjQtSDQt9Cw0L/QuNGB0LhcclxuICAgICAgICBjb250ZW50LmNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5kZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v0J3QsNGH0LjQvdCw0LXQvCDQt9Cw0L/QvtC70L3QtdC90LjQtVxyXG4gICAgICAgIG5vZGVQYXJhbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3MpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5hZGRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MubmFtZTtcclxuICAgICAgICBub2RlUGFyYW0uY29sb3IgPSB0aGlzLmNvbG9yVGV4dENoYXJhY3RlcmlzdGljcztcclxuICAgICAgICBjb250ZW50LmFkZENoaWxkKG5vZGVQYXJhbSk7XHJcblxyXG4gICAgICAgIG5vZGVQYXJhbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3MpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5hZGRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MuY3VycmVudFN0YXRlO1xyXG4gICAgICAgIG5vZGVQYXJhbS5jb2xvciA9IHRoaXMuY29sb3JUZXh0Q2hhcmFjdGVyaXN0aWNzO1xyXG4gICAgICAgIGNvbnRlbnQuYWRkQ2hpbGQobm9kZVBhcmFtKTtcclxuXHJcbiAgICAgICAgbGV0IHZyOy8v0LLRgNC10LzQtdC90L3QsNGPINC/0LXRgNC10LzQtdC90L3QsNGPINGD0LfQu9C+0LJcclxuICAgICAgICAvL9C30LDQv9C+0LvQvdGP0LXQvCDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutC4XHJcbiAgICAgICAgaWYgKG1hc3MucGFyYW0ubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXNzLnBhcmFtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlUGFyYW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnByZWZhYlBhcmFtZXRyQ2hhcmFjdGVyaXN0aWNzKTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQuYWRkQ2hpbGQobm9kZVBhcmFtKTtcclxuICAgICAgICAgICAgICAgIG5vZGVQYXJhbS54ID0gMDtcclxuICAgICAgICAgICAgICAgIHZyID0gbm9kZVBhcmFtLmdldENoaWxkQnlOYW1lKCduYW1lJyk7XHJcbiAgICAgICAgICAgICAgICB2ci5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MucGFyYW1baV0ubmFtZTtcclxuICAgICAgICAgICAgICAgIHZyLmNvbG9yID0gdGhpcy5jb2xvclRleHRDaGFyYWN0ZXJpc3RpY3M7XHJcbiAgICAgICAgICAgICAgICB2ciA9IG5vZGVQYXJhbS5nZXRDaGlsZEJ5TmFtZSgndmFsdWUnKTtcclxuICAgICAgICAgICAgICAgIHZyLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbWFzcy5wYXJhbVtpXS52YWx1ZS50b1N0cmluZygpICsgbWFzcy5wYXJhbVtpXS51bml0O1xyXG4gICAgICAgICAgICAgICAgdnIuY29sb3IgPSB0aGlzLmNvbG9yVGV4dENoYXJhY3RlcmlzdGljcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQkdC+0LrRgSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQuiDQttC40LLQvtGC0L3QvtCz0L4g0LfQsNC60YDRi9C70YHRjy5cclxuICAgICAqIEBtZXRob2Qgb25DbG9zZUJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0LrRgNGL0LvRgdGPIEJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YHQvtCx0YvRgtC40LUg0LDQutGC0LjQstC90L7Qs9C+INC/0YDQtdC00LLQutGD0YjQtdC90LjRjy5cclxuICAgICAqIEBtZXRob2Qgb25CYXNrZXRBY3RpdmVcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQmFza2V0QWN0aXZlKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQutC+0YDQt9C40L3QsCDQv9GA0L7Rj9Cy0LvRj9C10YIg0LDQutGC0LjQstC90L7RgdGC0YwnKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YDQtdC20LjQvCDRgdC90LAuXHJcbiAgICAgKiBAbWV0aG9kIG9uQmFza2V0U2xlZXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQmFza2V0U2xlZXAoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C60L7RgNC30LjQvdCwINGB0L/QuNGCJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YDQtdC20LjQvCDRgNCw0LHQvtGC0YsgKNCS0L7RgiDQstC+0YIg0YHQsdGA0L7RgdGP0YIg0LbQuNCy0L7RgtC90L7QtSkuXHJcbiAgICAgKiBAbWV0aG9kIG9uQmFza2V0V29ya1xyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25CYXNrZXRXb3JrKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQutC+0YDQt9C40L3QsCDQvdCw0LTQtdC10YLRgdGPINGH0YLQviDQstC+0YIg0LLQvtGCINCyINC90LXQtSDQv9C+0L/QsNC00LXRgiDQttC40LLQvtGC0L3QvtC1Jyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC90LDRh9Cw0LvQsCDRgNCw0LHQvtGC0Ysg0YEg0LrQsNGA0YLQvtC5LlxyXG4gICAgICogQG1ldGhvZCBvblRvdWNoT25NYXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hPbk1hcChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0J3QsNGH0LDQuyDRgNCw0LHQvtGC0YMg0YEg0LrQsNGA0YLQvtC5Jyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC00LLQuNC20LXQvdC40Y8g0LrQsNGA0YLRiy5cclxuICAgICAqIEBtZXRob2Qgb25Ub3VjaE1vdmVPbk1hcFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE1vdmVPbk1hcChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0JTQstC40LPQsNC10YIg0LrQsNGA0YLRgycpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC30LDQstC10YDRiNC10L3QuNGPINGA0LDQsdC+0YLRiyDRgSDQutCw0YDRgtC+0LkuXHJcbiAgICAgKiBAbWV0aG9kIG9uVG91Y2hFbmRNb3ZlT25NYXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmRNb3ZlT25NYXAoZXZlbnQpe1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc3RhdGVHYW1lID09PSBTdGF0R2FtZS5zbGVlcCkge1xyXG4gICAgICAgICAgICBjYy5sb2coJ9C30LDQstC10YDRiNC40Lsg0YDQsNCx0L7RgtGDINGBINC60LDRgNGC0L7QuScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0LLQtdC00LXQvdC40LUg0YbQtdC90YLRgNCwINC60LDQvNC10YDRiyDQvdCwINC20LjQstC+0YLQvdC+0LUg0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25GaW5pc2hNb3ZlQ2FtZXJhVG9BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uRmluaXNoTW92ZUNhbWVyYVRvQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICB0aGlzLm5vZGVNZW51QW5pbWFsLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub2RlTWVudUFuaW1hbC5zZXRQb3NpdGlvbih0aGlzLl9jZW50cmVXaW5kb3dQb2ludC54LCB0aGlzLl9jZW50cmVXaW5kb3dQb2ludC55KTtcclxuICAgICAgICB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwub3BlbkJveCgpO1xyXG4gICAgfSxcclxuXHJcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=