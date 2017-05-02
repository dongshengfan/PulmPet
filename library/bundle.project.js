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
cc._RFpush(module, '34b669/bKJHB4r3GceUxmmZ', 'build-ts');
// scripts\build\build-ts.js

"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            var factory = Animals.Systems.Factories.SystemFactory.instance();
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
            var factory = Animals.Scales.Factories.ScaleFactory.instance();
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
            var communicatorBuild = new Animals.Communications.Builders.CommunicatorBuilder(this.masScales);
            communocation.forEach(function (item) {
                communicatorBuild.add(item);
            });
            return communicatorBuild.build();
        };
        AnimalBuilder.prototype.createStates = function (states) {
            var _this = this;
            var factory = Animals.StateMachine.FactoryState.StateFactory.instance();
            var paramState = [];
            var state = states.state,
                links = states.links;
            state.forEach(function (item) {
                paramState[item.type] = factory.create(item.type, item.name, _this._animal, item.isEnd);
            });
            links.forEach(function (item) {
                var massStates = [];
                item.link.forEach(function (state) {
                    massStates.push(new Animals.StateMachine.Routes.Route(paramState[state.type], function (model, probability) {
                        if (state.probability > probability) {
                            return true;
                        }
                        return false;
                    }));
                });
                paramState[item.type].setRouteEngine(new Animals.StateMachine.Routes.Engines.ProbabilityRouteEngine(massStates));
            });
            return new Animals.StateMachine.StateMachine(paramState[Animals.StateMachine.FactoryState.TypesState.startLife]);
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
        var Builders;
        (function (Builders) {
            var CommunicatorBuilder = function () {
                function CommunicatorBuilder(scales) {
                    this._scales = scales;
                    this._communicator = new Communications.Communicator();
                    this._factoryFunction = Animals.Functions.Factories.FunctionFactory.instance();
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
            Builders.CommunicatorBuilder = CommunicatorBuilder;
        })(Builders = Communications.Builders || (Communications.Builders = {}));
    })(Communications = Animals.Communications || (Animals.Communications = {}));
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
        (function (BehaviorScaleTypes) {
            BehaviorScaleTypes[BehaviorScaleTypes["increase"] = 1] = "increase";
            BehaviorScaleTypes[BehaviorScaleTypes["decrease"] = 2] = "decrease";
        })(Communications.BehaviorScaleTypes || (Communications.BehaviorScaleTypes = {}));
        var BehaviorScaleTypes = Communications.BehaviorScaleTypes;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var Factories;
        (function (Factories) {
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
            Factories.FunctionFactory = FunctionFactory;
        })(Factories = Functions.Factories || (Functions.Factories = {}));
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        (function (FunctionTypes) {
            FunctionTypes[FunctionTypes["line"] = 1] = "line";
            FunctionTypes[FunctionTypes["quadratic"] = 2] = "quadratic";
        })(Functions.FunctionTypes || (Functions.FunctionTypes = {}));
        var FunctionTypes = Functions.FunctionTypes;
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
        var Factories;
        (function (Factories) {
            var ScaleFactory = function () {
                function ScaleFactory() {
                    this._factories = [];
                    this._factories[Scales.ScaleTypes.system] = Animals.Scales.TypeScales.SystemScale;
                    this._factories[Scales.ScaleTypes.argument] = Animals.Scales.TypeScales.ArgumentScale;
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
            Factories.ScaleFactory = ScaleFactory;
        })(Factories = Scales.Factories || (Scales.Factories = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
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
        })(Scales.ParameterScaleTypes || (Scales.ParameterScaleTypes = {}));
        var ParameterScaleTypes = Scales.ParameterScaleTypes;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        (function (ScaleTypes) {
            ScaleTypes[ScaleTypes["system"] = 0] = "system";
            ScaleTypes[ScaleTypes["argument"] = 1] = "argument";
        })(Scales.ScaleTypes || (Scales.ScaleTypes = {}));
        var ScaleTypes = Scales.ScaleTypes;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var TypeScales;
        (function (TypeScales) {
            var ArgumentScale = function (_super) {
                __extends(ArgumentScale, _super);
                function ArgumentScale(params) {
                    _super.call(this);
                    this._name = params.name || "No name";
                    this._min = params.min || 0;
                    this._max = params.max || 100;
                    this._current = params.current || this._max;
                    this._responseDelay = params.responseDelay || 1000;
                    this._type = params.type || 0;
                    this.getPercentageInScale();
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
            TypeScales.ArgumentScale = ArgumentScale;
        })(TypeScales = Scales.TypeScales || (Scales.TypeScales = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var TypeScales;
        (function (TypeScales) {
            var SystemScale = function (_super) {
                __extends(SystemScale, _super);
                function SystemScale(params) {
                    _super.call(this);
                    this._name = params.name || "No name";
                    this._min = params.min || 0;
                    this._max = params.max || 100;
                    this._current = params.current || this._max;
                    this._type = params.type || 0;
                    this.getPercentageInScale();
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
            TypeScales.SystemScale = SystemScale;
        })(TypeScales = Scales.TypeScales || (Scales.TypeScales = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Factories;
        (function (Factories) {
            var SystemFactory = function () {
                function SystemFactory() {
                    this._factories = [];
                    this._factories[Systems.SystemTypes.muscular] = Animals.Systems.TypeSystems.Muscular;
                    this._factories[Systems.SystemTypes.circulatory] = Animals.Systems.TypeSystems.Circulatory;
                    this._factories[Systems.SystemTypes.navigation] = Animals.Systems.TypeSystems.Navigation;
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
            Factories.SystemFactory = SystemFactory;
        })(Factories = Systems.Factories || (Systems.Factories = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        (function (SystemTypes) {
            SystemTypes[SystemTypes["muscular"] = 1] = "muscular";
            SystemTypes[SystemTypes["circulatory"] = 2] = "circulatory";
            SystemTypes[SystemTypes["memory"] = 3] = "memory";
            SystemTypes[SystemTypes["navigation"] = 4] = "navigation";
        })(Systems.SystemTypes || (Systems.SystemTypes = {}));
        var SystemTypes = Systems.SystemTypes;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var TypeSystems;
        (function (TypeSystems) {
            var Circulatory = function () {
                function Circulatory(scales) {
                    this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
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
            TypeSystems.Circulatory = Circulatory;
        })(TypeSystems = Systems.TypeSystems || (Systems.TypeSystems = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var TypeSystems;
        (function (TypeSystems) {
            var Muscular = function () {
                function Muscular(scales) {
                    this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
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
            TypeSystems.Muscular = Muscular;
        })(TypeSystems = Systems.TypeSystems || (Systems.TypeSystems = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var TypeSystems;
        (function (TypeSystems) {
            var Navigation = function () {
                function Navigation(scales) {
                    this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
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
            TypeSystems.Navigation = Navigation;
        })(TypeSystems = Systems.TypeSystems || (Systems.TypeSystems = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var APICore = function () {
    function APICore() {}
    APICore.instance = function () {
        if (!this.inst) {
            this.inst = new APICore();
        }
        return this.inst;
    };
    APICore.prototype.createAnimal = function (putToModel, id) {
        var factory = Animals.AnimalBuilder.instance();
        var animal = factory.create(lion);
        animal.id = id;
        return animal;
    };
    return APICore;
}();
var Map;
(function (Map_1) {
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
    Map_1.Map = Map;
})(Map || (Map = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine_1) {
        var StateMachine = function () {
            function StateMachine(state) {
                this._state = state;
            }
            StateMachine.prototype.run = function () {
                var _this = this;
                this._state.run().then(function () {
                    if (!_this._state.isEndPoint()) {
                        _this._state = _this._state.getNextState();
                        _this.run();
                    }
                }, function () {
                    throw new Error('Error in state... (StateMachine)');
                });
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
        var States;
        (function (States) {
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
            States.State = State;
        })(States = StateMachine.States || (StateMachine.States = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var States;
        (function (States) {
            var TypesState;
            (function (TypesState) {
                var PatternState = function (_super) {
                    __extends(PatternState, _super);
                    function PatternState(name, model, routeEngine, states) {
                        if (routeEngine === void 0) {
                            routeEngine = null;
                        }
                        if (states === void 0) {
                            states = [];
                        }
                        _super.call(this, name, model, routeEngine);
                        this._states = states;
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
                }(States.State);
                TypesState.PatternState = PatternState;
            })(TypesState = States.TypesState || (States.TypesState = {}));
        })(States = StateMachine.States || (StateMachine.States = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var States;
        (function (States) {
            var TypesState;
            (function (TypesState) {
                var PrimitiveState = function (_super) {
                    __extends(PrimitiveState, _super);
                    function PrimitiveState(name, model, isEndPoint, routeEngine) {
                        if (isEndPoint === void 0) {
                            isEndPoint = false;
                        }
                        if (routeEngine === void 0) {
                            routeEngine = null;
                        }
                        _super.call(this, name, model, routeEngine, isEndPoint);
                    }
                    PrimitiveState.prototype.run = function () {
                        throw new Error('No implementation status...');
                    };
                    return PrimitiveState;
                }(States.State);
                TypesState.PrimitiveState = PrimitiveState;
            })(TypesState = States.TypesState || (States.TypesState = {}));
        })(States = StateMachine.States || (StateMachine.States = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Routes;
        (function (Routes) {
            var Engines;
            (function (Engines) {
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
                Engines.RouteEngine = RouteEngine;
            })(Engines = Routes.Engines || (Routes.Engines = {}));
        })(Routes = StateMachine.Routes || (StateMachine.Routes = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Routes;
        (function (Routes) {
            var Engines;
            (function (Engines) {
                var SimpleRouteEngine = function (_super) {
                    __extends(SimpleRouteEngine, _super);
                    function SimpleRouteEngine(routes, nextEngine) {
                        if (routes === void 0) {
                            routes = [];
                        }
                        if (nextEngine === void 0) {
                            nextEngine = null;
                        }
                        _super.call(this, routes, nextEngine);
                    }
                    SimpleRouteEngine.prototype.getRoute = function () {
                        var _this = this;
                        var routes = this._routes.filter(function (route) {
                            return route.isAvailable(_this._model);
                        });
                        return routes.length > 0 ? routes[0] : this._nextRouteEngine();
                    };
                    return SimpleRouteEngine;
                }(Engines.RouteEngine);
                Engines.SimpleRouteEngine = SimpleRouteEngine;
            })(Engines = Routes.Engines || (Routes.Engines = {}));
        })(Routes = StateMachine.Routes || (StateMachine.Routes = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Routes;
        (function (Routes) {
            var Engines;
            (function (Engines) {
                var ProbabilityRouteEngine = function (_super) {
                    __extends(ProbabilityRouteEngine, _super);
                    function ProbabilityRouteEngine(routes, nextEngine) {
                        if (routes === void 0) {
                            routes = [];
                        }
                        if (nextEngine === void 0) {
                            nextEngine = null;
                        }
                        _super.call(this, routes, nextEngine);
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
                }(Engines.RouteEngine);
                Engines.ProbabilityRouteEngine = ProbabilityRouteEngine;
            })(Engines = Routes.Engines || (Routes.Engines = {}));
        })(Routes = StateMachine.Routes || (StateMachine.Routes = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Routes;
        (function (Routes) {
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
            Routes.Route = Route;
        })(Routes = StateMachine.Routes || (StateMachine.Routes = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StatesLib;
        (function (StatesLib) {
            var StateDie = function (_super) {
                __extends(StateDie, _super);
                function StateDie(name, model, isEndPoint, routeEngine) {
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    _super.call(this, name, model, isEndPoint, routeEngine);
                }
                StateDie.prototype.run = function () {
                    var resolveFn, rejectFn;
                    var promise = new Promise(function (resolve, reject) {
                        resolveFn = resolve;
                        rejectFn = reject;
                    });
                    console.log('умер');
                    setTimeout(function () {
                        resolveFn();
                    }, 4000);
                    return promise;
                };
                return StateDie;
            }(Animals.StateMachine.States.TypesState.PrimitiveState);
            StatesLib.StateDie = StateDie;
        })(StatesLib = StateMachine.StatesLib || (StateMachine.StatesLib = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StatesLib;
        (function (StatesLib) {
            var StateRun = function (_super) {
                __extends(StateRun, _super);
                function StateRun(name, model, isEndPoint, routeEngine) {
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    _super.call(this, name, model, isEndPoint, routeEngine);
                }
                StateRun.prototype.run = function () {
                    var resolveFn, rejectFn;
                    var promise = new Promise(function (resolve, reject) {
                        resolveFn = resolve;
                        rejectFn = reject;
                    });
                    console.log('бегу');
                    this._model.muscular.changeSpeed(-0.4);
                    this._model.muscular.changeWeight(-0.5);
                    setTimeout(function () {
                        resolveFn();
                    }, 4000);
                    return promise;
                };
                return StateRun;
            }(Animals.StateMachine.States.TypesState.PrimitiveState);
            StatesLib.StateRun = StateRun;
        })(StatesLib = StateMachine.StatesLib || (StateMachine.StatesLib = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StatesLib;
        (function (StatesLib) {
            var StateStand = function (_super) {
                __extends(StateStand, _super);
                function StateStand(name, model, isEndPoint, routeEngine) {
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    _super.call(this, name, model, isEndPoint, routeEngine);
                }
                StateStand.prototype.run = function () {
                    var resolveFn, rejectFn;
                    var promise = new Promise(function (resolve, reject) {
                        resolveFn = resolve;
                        rejectFn = reject;
                    });
                    console.log('стою');
                    this._model.muscular.changeSpeed(0.5);
                    this._model.muscular.changeWeight(0.7);
                    setTimeout(function () {
                        resolveFn();
                    }, 4000);
                    return promise;
                };
                return StateStand;
            }(Animals.StateMachine.States.TypesState.PrimitiveState);
            StatesLib.StateStand = StateStand;
        })(StatesLib = StateMachine.StatesLib || (StateMachine.StatesLib = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StatesLib;
        (function (StatesLib) {
            var StateStart = function (_super) {
                __extends(StateStart, _super);
                function StateStart(name, model, isEndPoint, routeEngine) {
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    _super.call(this, name, model, isEndPoint, routeEngine);
                }
                StateStart.prototype.run = function () {
                    var resolveFn, rejectFn;
                    var promise = new Promise(function (resolve, reject) {
                        resolveFn = resolve;
                        rejectFn = reject;
                    });
                    console.log('Начал жить');
                    this._model.muscular.changeSpeed(0.001);
                    this._model.muscular.changeWeight(0.001);
                    setTimeout(function () {
                        resolveFn();
                    }, 4000);
                    return promise;
                };
                return StateStart;
            }(Animals.StateMachine.States.TypesState.PrimitiveState);
            StatesLib.StateStart = StateStart;
        })(StatesLib = StateMachine.StatesLib || (StateMachine.StatesLib = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var FactoryState;
        (function (FactoryState) {
            var StateFactory = function () {
                function StateFactory() {
                    this._factories = [];
                    this._factories[FactoryState.TypesState.startLife] = Animals.StateMachine.StatesLib.StateStart;
                    this._factories[FactoryState.TypesState.stand] = Animals.StateMachine.StatesLib.StateStand;
                    this._factories[FactoryState.TypesState.run] = Animals.StateMachine.StatesLib.StateRun;
                    this._factories[FactoryState.TypesState.die] = Animals.StateMachine.StatesLib.StateDie;
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
            FactoryState.StateFactory = StateFactory;
        })(FactoryState = StateMachine.FactoryState || (StateMachine.FactoryState = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var FactoryState;
        (function (FactoryState) {
            (function (TypesState) {
                TypesState[TypesState["startLife"] = 1] = "startLife";
                TypesState[TypesState["stand"] = 2] = "stand";
                TypesState[TypesState["run"] = 3] = "run";
                TypesState[TypesState["die"] = 4] = "die";
            })(FactoryState.TypesState || (FactoryState.TypesState = {}));
            var TypesState = FactoryState.TypesState;
        })(FactoryState = StateMachine.FactoryState || (StateMachine.FactoryState = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
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
            type: Animals.StateMachine.FactoryState.TypesState.startLife,
            isEnd: false
        }, {
            name: 'Бегу',
            type: Animals.StateMachine.FactoryState.TypesState.run,
            isEnd: false
        }, {
            name: 'Стою',
            type: Animals.StateMachine.FactoryState.TypesState.stand,
            isEnd: false
        }, {
            name: 'Умер',
            type: Animals.StateMachine.FactoryState.TypesState.die,
            isEnd: true
        }],
        links: [{
            type: Animals.StateMachine.FactoryState.TypesState.startLife,
            link: [{
                type: Animals.StateMachine.FactoryState.TypesState.run,
                probability: 0.7
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.stand,
                probability: 0.7
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.die,
                probability: 0.01
            }]
        }, {
            type: Animals.StateMachine.FactoryState.TypesState.stand,
            link: [{
                type: Animals.StateMachine.FactoryState.TypesState.run,
                probability: 0.7
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.die,
                probability: 0.01
            }]
        }, {
            type: Animals.StateMachine.FactoryState.TypesState.run,
            link: [{
                type: Animals.StateMachine.FactoryState.TypesState.die,
                probability: 0.6
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.stand,
                probability: 0.9
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.run,
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
        this._isOpenMenu = false;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoveAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStartAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEndAnimal.bind(this));
    },


    /**
     * Настраивает доступные действия плюшки для животного и характеристики
     */
    settings: function settings(model) {
        this._model = model;
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
},{}],"controller-create-animal":[function(require,module,exports){
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
                puthToModel: _this.puthToModel
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

var _buildTs = require('../../build/build-ts');

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
        this._api = _buildTs.APICore.instance();

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

            var model = this._api.createAnimal(this._targetPuthToModel, this.nodeFieldAnimals.children.length); //создаем модель животного
            var nodeModel = cc.instantiate(this._targetAnimal.children[0]); //создаем нод животного
            nodeModel.parent = this.nodeFieldAnimals; //Вешаем нод животного на нод со всеми животными
            nodeModel.setPosition(event.detail.point.x, event.detail.point.y); //Устанавливаем позицию на карте
            nodeModel.addComponent('controller-animal'); //Добавляем контроллер телу животного
            nodeModel.getComponent('controller-animal').settings(model); //Настраивам контроллер животного
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
},{"../../build/build-ts":"build-ts"}]},{},["build-ts","basket-animal","box-characteristics-animal","box-create-animal","box-menu-play","box","circular-list-actions-animal","circular-list","list","controller-animal","controller-create-animal","controller-map","controller-menu-play","controller-scroll-box-characteristic","factory-animal-prefab","play"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvYmFza2V0cy9iYXNrZXQtYW5pbWFsLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9ib3hlcy9ib3gtY2hhcmFjdGVyaXN0aWNzLWFuaW1hbC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvYm94ZXMvYm94LWNyZWF0ZS1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2JveGVzL2JveC1tZW51LXBsYXkuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2JveGVzL2JveC1zYW1wbGVzL2JveC5qcyIsImFzc2V0cy9zY3JpcHRzL2J1aWxkL2J1aWxkLXRzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9jaXJjdWxhci1saXN0L2NpcmN1bGFyLWxpc3QtYWN0aW9ucy1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NpcmN1bGFyLWxpc3QvY2lyY3VsYXItbGlzdC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLWFuaW1hbC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLWNyZWF0ZS1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1tYXAuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1tZW51LXBsYXkuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1zY3JvbGwtYm94LWNoYXJhY3RlcmlzdGljLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9mYWN0b3J5LWFuaW1hbC1wcmVmYWIvZmFjdG9yeS1hbmltYWwtcHJlZmFiLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9jaXJjdWxhci1saXN0L2xpc3QuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL3NjZW5lL3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7OztBQVFBOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFIZ0I7O0FBTXBCOzs7OztBQUtBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFJSjs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUdEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7OztBQU9BO0FBQTZCOztBQUN6QjtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNBO0FBQ0o7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0E7QUFGb0I7QUFJeEI7QUFDSTtBQUNBO0FBRmtCO0FBSXRCO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0E7QUFGb0I7QUFJeEI7QUFDSTtBQUNBO0FBRmtCO0FBSXRCO0FBQ0k7QUFDQTtBQUZzQjs7QUFLMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0M7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQXlCO0FBQ3JCO0FBQ0E7QUFDSDtBQUNEO0FBQXdCO0FBQ3BCO0FBQ0E7QUFDSDtBQUNEO0FBQXVCO0FBQ25CO0FBQ0E7QUFDSDtBQVpMO0FBY0g7QUFDSjtBQXhMSTs7Ozs7Ozs7OztBQ3ZCVDs7QUFDQTs7OztBQUlBO0FBQ0k7O0FBRUE7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUQ7OztBQUlBOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7QUEvQ21DOzs7Ozs7Ozs7O0FDTHhDOztBQUVBOzs7O0FBSUE7QUFDSTs7QUFFQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDSDtBQTVDMEI7Ozs7Ozs7Ozs7QUNIL0I7O0FBQ0E7Ozs7QUFJQTtBQUNJOztBQUVBOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVEOzs7QUFJQTs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFHRDs7OztBQUlBO0FBQ0k7QUFDSDtBQXhEc0I7Ozs7Ozs7Ozs7Ozs7OztBQ1IzQjs7Ozs7OztBQU9BOzs7O0FBSUE7QUFDSTtBQUNBO0FBRmE7O0FBS2pCOzs7Ozs7Ozs7QUFTQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFKWTtBQU1oQjs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFRDtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTs7O0FBSUE7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNLO0FBQ0o7QUFDSTtBQUNKO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFHSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0Q7QUFDSDtBQTlQYzs7Ozs7Ozs7Ozs7Ozs7QUN2Q25CO0FBQ0k7QUFBaUI7QUFBakI7QUFDZ0I7QUFBdUI7QUFDdkM7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBRUE7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVmdEO0FBWXBEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWbUQ7QUFZdkQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZrRDtBQVl0RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSb0Q7QUFVeEQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUm9EO0FBVXhEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVIwQztBQVU5QztBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSNEM7QUFVaEQ7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFFUTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1KO0FBQ0k7QUFDQTtBQUNBO0FBSEc7QUFLVjtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJ5RDtBQVU3RDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUnlEO0FBVTdEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJrRDtBQVV0RDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSK0Q7QUFVbkU7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUitEO0FBVW5FO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJ1RDtBQVUzRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBRUE7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjRDO0FBVWhEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBVDJDO0FBVy9DO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBVDJDO0FBVy9DO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBVCtDO0FBV25EO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBVCtDO0FBV25EO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVI0QztBQVVoRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjREO0FBVWhFO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVIyRDtBQVUvRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBRk87QUFJWDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZzRDtBQVkxRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVnFEO0FBWXpEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVitDO0FBWW5EO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWZ0Q7QUFZcEQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFUc0Q7QUFXMUQ7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWc0Q7QUFZMUQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZ3RDtBQVk1RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVnlEO0FBWTdEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWdUQ7QUFZM0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZ1RDtBQVkzRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFkMEM7QUFnQjlDO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVm1EO0FBWXZEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVitDO0FBWW5EO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVjhDO0FBWWxEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFBOEI7QUFBcUI7QUFDbkQ7QUFBNkI7QUFBcUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBOEI7QUFBcUI7QUFDbkQ7QUFBeUI7QUFBYztBQUN2QztBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQTZCO0FBQXFCO0FBQ2xEO0FBQThCO0FBQXFCO0FBQ25EO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFBeUI7QUFBYztBQUN2QztBQUE2QjtBQUFvQjtBQUNqRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQXlCO0FBQWM7QUFDdkM7QUFBNkI7QUFBb0I7QUFDakQ7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUFvRDtBQUF5QztBQUM3RjtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBeUI7QUFBYztBQUN2QztBQUE2QjtBQUFvQjtBQUNqRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFBb0Q7QUFBc0Q7QUFDMUc7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFBOEI7QUFBb0I7QUFDbEQ7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQTZCO0FBQXFCO0FBQ2xEO0FBQThCO0FBQXFCO0FBQ25EO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUE2QjtBQUFxQjtBQUNsRDtBQUE4QjtBQUFxQjtBQUNuRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQTZCO0FBQXFCO0FBQ2xEO0FBQThCO0FBQXFCO0FBQ25EO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBNkI7QUFBcUI7QUFDbEQ7QUFBOEI7QUFBcUI7QUFDbkQ7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQXlCO0FBQWM7QUFDdkM7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUVRO0FBQ0E7QUFGSjtBQVNJO0FBQ0E7QUFGSjtBQVFJO0FBQ0E7QUFGSjtBQVdKO0FBRVE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEk7QUFIWjtBQVlJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMSTtBQUhaO0FBWUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEk7QUFIWjtBQVlJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMSTtBQUhaO0FBWUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSjtBQUVRO0FBQ0E7QUFFUTtBQUNBO0FBQ0E7QUFDQTtBQUpKO0FBSFI7QUFlSTtBQUNBO0FBRVE7QUFDQTtBQUNBO0FBQ0E7QUFKSjtBQUhSO0FBZUo7QUFDSTtBQUVRO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUo7QUFFUTtBQUNBO0FBRVE7QUFDQTtBQUZKO0FBS0k7QUFDQTtBQUZKO0FBS0k7QUFDQTtBQUZKO0FBWFI7QUFrQkk7QUFDQTtBQUVRO0FBQ0E7QUFGSjtBQUtJO0FBQ0E7QUFGSjtBQVBSO0FBY0k7QUFDQTtBQUVRO0FBQ0E7QUFGSjtBQUtJO0FBQ0E7QUFGSjtBQUtJO0FBQ0E7QUFGSjtBQVhSO0FBdERBO0FBMUlEO0FBb05YOzs7Ozs7Ozs7Ozs7Ozs7QUNqckRBOztBQUVBOzs7OztBQUtBO0FBQ0k7O0FBRUE7Ozs7O0FBS0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7O0FBRUQ7QUFDSDtBQW5Cb0M7Ozs7Ozs7Ozs7Ozs7OztBQ1B6Qzs7Ozs7OztBQU9BO0FBQ0k7QUFDQTs7QUFHSjs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHSjs7OztBQUlBO0FBQ0k7QUFDQTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQXFCOztBQUNqQjtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNIO0FBQ0o7OztBQUVEOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7QUFDRztBQUNIOztBQUVEOztBQUVBO0FBQ0k7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7QUFLQTtBQUF5Qjs7QUFDckI7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7OztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUE7QUFDSjtBQUNKOzs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQXVCOztBQUNuQjtBQUNJO0FBQ0g7QUFDSjs7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQXRQdUI7Ozs7Ozs7Ozs7OztBQ2hCNUI7OztBQUdBO0FBQ0k7O0FBRUE7QUFDSTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBR0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFHRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDQTtBQUNIO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQztBQUVKOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFEYTtBQUdqQjtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFEYTtBQUdqQjtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNIOzs7QUFFRDs7O0FBR0E7OztBQUlBOzs7QUFHQTs7O0FBSUE7OztBQUdBOzs7QUFJQTs7O0FBR0E7OztBQUlBOzs7QUFHQTs7O0FBSUE7OztBQUdBOzs7QUFJQTs7O0FBR0E7OztBQUlBOzs7O0FBSUE7QUFDSTtBQUNIO0FBdk9JOzs7Ozs7Ozs7O0FDSFQ7QUFDSTs7QUFFQTs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSTtBQURhO0FBR2pCO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQURhO0FBR2pCO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSTtBQURhO0FBR2pCOztBQUVBO0FBQ0g7QUFyREk7Ozs7Ozs7Ozs7QUNBVDs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUdKOztBQUVJO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNDO0FBQ0o7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDRjtBQUNNO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNMO0FBQ0M7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUFxQjs7QUFDakI7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFBNEI7O0FBQ3hCO0FBQ0E7QUFDQTtBQUdIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFwSkk7Ozs7Ozs7Ozs7QUNKVDs7O0FBR0E7QUFDSTs7QUFFQTs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTs7O0FBSUE7Ozs7QUFJQTs7O0FBSUE7Ozs7QUFJQTtBQWhDSzs7Ozs7Ozs7OztBQ0hUOzs7O0FBSUE7Ozs7QUFJQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7OztBQUlBOzs7OztBQUtBO0FBQW1COztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjs7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0E7QUFDSDtBQTNFNkM7Ozs7Ozs7Ozs7Ozs7QUNSbEQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUdKOzs7O0FBSUE7QUFDRTtBQUNDO0FBQ0M7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUFnQjs7QUFDWjtBQUNJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFJakI7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTs7QUFFQTtBQUNIO0FBL0M4Qjs7Ozs7Ozs7Ozs7O0FDQW5DOztBQUVBOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUdKOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDSTtBQURhO0FBR2pCO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUF2RUk7Ozs7Ozs7Ozs7QUNOVDs7QUFFQTs7Ozs7Ozs7OztBQVVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxhOztBQVFqQjs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFHSjs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0k7QUFDSDtBQUVKOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBRUg7QUFDSjs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNBOztBQUdIOzs7QUFFRDs7Ozs7O0FBTUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUFDRztBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNJO0FBQ0g7QUFDSjs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQTloQkkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogRW51bSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LrQvtGA0LfQuNC90YsuXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN0YXRlQmFza2V0XHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzbGVlcCDQutC+0YDQt9C40L3QsCDQv9GA0L7RgdGC0L4g0L7RgtC60YDRi9GC0LAuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhY3RpdmUg0YfRg9Cy0YHRgtCy0YPQtdGCINGH0YLQviDQttC40LLQvtGC0L3QvtC1INCz0LTQtS3RgtC+INGA0Y/QtNC+0LwuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB3b3JrINGA0LDQsdC+0YLQsNC10YIg0YEg0L/QvtC/0LDQstGI0LjQvNGB0Y8g0LbQuNCy0L7RgtC90YvQvC5cclxuICovXHJcblxyXG4vKipcclxuICog0KLQuNC/0Ysg0YHQvtGB0YLQvtGP0L3QuNC5INC60L7RgNC30LjQvdGLLlxyXG4gKiBAdHlwZSB7U3RhdGVCYXNrZXR9XHJcbiAqL1xyXG5jb25zdCBTdGF0ZUJhc2tldCA9IHtcclxuICAgIHNsZWVwOiAwLFxyXG4gICAgYWN0aXZlOiAxLFxyXG4gICAgd29yazogMixcclxufTtcclxuXHJcbi8qKlxyXG4gKiDQntGB0YPRidC10YHRgtCy0LvRj9C10YIg0YDQsNCx0L7RgtGDINGBINC60L7RgNC30LjQvdC+0LksXHJcbiAqINCQ0L3QuNC80LDRhtC40LgsINGH0LDRgdGC0LjRhtGLINC4INC/0YDQvtGH0LXQtS5cclxuICogQGNsYXNzIGJhc2tldC1hbmltYWxcclxuICovXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgX2xlZnRQb2ludEJvdHRvbTogbnVsbCwvL9C70LXQstCw0Y8g0L3QuNC20L3Rj9GPINGC0L7Rh9C60LAg0L7QsdC70LDRgdGC0Lgg0L/QvtCz0LvQsNGJ0LXQvdC40Y8g0LbQuNCy0L7RgtC90YvRhVxyXG4gICAgICAgIF9yaWdodFBvaW50VG9wOiBudWxsLC8v0L/RgNCw0LLQsNGPINCy0LXRgNGF0L3Rj9GP0YLQvtGH0LrQsCDQvtCx0LvQsNGB0YLQuCDQv9C+0LPQu9Cw0YnQtdC90LjRjyDQttC40LLQvtGC0L3Ri9GFXHJcbiAgICAgICAgX2NlbnRyZVBvaW50QmFza2V0OiBudWxsLC8v0YbQtdC90YLRgNCw0LvRjNC90LDRjyDRgtC+0YfQutCwINC+0LHQu9Cw0YHRgtC4INC/0L7Qs9C70LDRidC10L3QuNGPXHJcbiAgICAgICAgX3N0YXRlQmFza2V0OiBudWxsLC8v0YHQvtGB0YLQvtGP0L3QuNC1INC60L7RgNC30LjQvdGLXHJcblxyXG4gICAgICAgIGFudGljaXBhdGlvbjogMTUwLC8v0YDQsNGB0YHRgtC+0Y/QvdC40LUg0LTQu9GPINC/0YDQuNC90Y/RgtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5INCy0LfQstC+0LvQvdC+0LLQsNC90L3QvtGB0YLQuFxyXG4gICAgICAgIG9wYWNpdHlPbjogMjU1LC8v0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINC6INC60L7RgtC+0YDQvtC5INGB0YLRgNC10LzQuNGC0YHRjyDQv9GA0Lgg0LLQutC70Y7Rh9C10L3QuNC4XHJcbiAgICAgICAgb3BhY2l0eU9mZjogMTAsIC8v0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINC6INC60L7RgtC+0YDQvtC5INGB0YLQtdC80LjRgtGB0Y8g0L/QvtGB0LvQtSDQstGL0LrQu9GO0YfQtdC90LjRj1xyXG4gICAgICAgIHRpbWU6IDEsLy/QstGA0LXQvNGPINC30LAg0LrQvtGC0L7RgNC+0LUg0L/RgNC+0LjRgdGF0L7QtNC40YIg0L7RgtC60YDRi9GC0LjQtSDQuNC70Lgg0LfQsNC60YDRi9GC0LjQtVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQvdC10L/QvtGB0YDQtdC00YHRgtCy0LXQvdC90L4g0YHRgNCw0LfRgyDQv9C+0YHQu9C1INC30LDQs9GA0YPQt9C60Lgg0LrQvtC80L/QvtC90LXQvdGC0LAuXHJcbiAgICAgKiBAbWV0aG9kIHN0YXJ0XHJcbiAgICAgKi9cclxuICAgIHN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5fcHJldmlvdXNTdGF0dXMgPSB0aGlzLl9zdGF0ZUJhc2tldCA9IFN0YXRlQmFza2V0LmFjdGl2ZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0YDQt9C40L3QsCDQt9Cw0L/Rg9GB0YLQuNC70LDRgdGMLiDQl9Cw0L/Rg9GB0LrQsNC10YIg0LrQvtGA0LfQuNC90YMo0LLQutC70Y7Rh9Cw0LXRgilcclxuICAgICAqIEBtZXRob2Qgb25cclxuICAgICAqL1xyXG4gICAgb24oKXtcclxuICAgICAgICAvL3RoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuam9iV2l0aE9wYWNpdHkodGhpcy5vcGFjaXR5T24sIHRoaXMudGltZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLRi9C60LvRjtGH0LXQvdC40LUg0LrQvtGA0LfQuNC90Ysu0JLRi9C60LvRjtGH0LDQtdGCINC60L7RgNC30LjQvdGDLlxyXG4gICAgICogQG1ldGhvZCBvZmZcclxuICAgICAqL1xyXG4gICAgb2ZmKCl7XHJcbiAgICAgICAgdGhpcy5qb2JXaXRoT3BhY2l0eSh0aGlzLm9wYWNpdHlPZmYsIHRoaXMudGltZSk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQsNC60YbQuNGPINC60L7RgNC30LjQvdGLINC90LAg0L/RgNC40LHQu9C40LbQsNGO0YnQtdC10YHRjyDQttC40LLQvtGC0L3QvtC1LlxyXG4gICAgICogQG1ldGhvZCBvblN0YXR1c0FjdGl2ZUJhc2tldFxyXG4gICAgICovXHJcbiAgICBvblN0YXR1c0FjdGl2ZUJhc2tldCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdiYXNrZXRBY3RpdmUnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7RgdGC0L7Rj9C90LjQtSDRgdC90LAg0LLQutC70Y7Rh9C40LvQvtGB0YwuXHJcbiAgICAgKiBAbWV0aG9kIG9uU3RhdHVzU2xlZXBCYXNrZXRcclxuICAgICAqL1xyXG4gICAgb25TdGF0dXNTbGVlcEJhc2tldCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdiYXNrZXRTbGVlcCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtGB0YLQvtGP0L3QuNC1INC70L7QstC70Lgg0LLQutC70Y7Rh9C40LvQvtGB0YwuXHJcbiAgICAgKiBAbWV0aG9kIG9uU3RhdHVzV29ya0Jhc2tldFxyXG4gICAgICovXHJcbiAgICBvblN0YXR1c1dvcmtCYXNrZXQoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnYmFza2V0V29yaycsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUtINC20LjQstC+0YLQvdC+0LUg0L/QvtC50LzQsNC90L4uXHJcbiAgICAgKiBAbWV0aG9kIG9uR29vZFdvcmtCYXNrZXRcclxuICAgICAqL1xyXG4gICAgb25Hb29kV29ya0Jhc2tldCgpe1xyXG4gICAgICAgIGNjLmxvZygn0JXQsCwg0LbQuNCy0L7RgtC90L7QtSDQv9C+0LnQvNCw0L3QviAoYmFza2V0LWFuaW1hbCknKTtcclxuICAgICAgICB0aGlzLl9zdGF0ZUJhc2tldCA9IFN0YXRlQmFza2V0Lndvcms7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdHVzQmFza2V0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUtINC20LjQstC+0YLQvdC+0LUg0L3QtSDQv9C+0LnQvNCw0L3Qvi5cclxuICAgICAqIEBtZXRob2Qgb25CYWRXb3JrQmFza2V0XHJcbiAgICAgKi9cclxuICAgIG9uQmFkV29ya0Jhc2tldCgpe1xyXG4gICAgICAgIGNjLmxvZygn0J3RgyDQstC+0YIg0L7Qv9GP0YLRjCDQvdC40YfQtdCz0L4g0L3QtdC/0L7QudC80LDQuyAoYmFza2V0LWFuaW1hbCknKTtcclxuICAgICAgICB0aGlzLl9zdGF0ZUJhc2tldCA9IFN0YXRlQmFza2V0LnNsZWVwO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXR1c0Jhc2tldCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LDQsdC+0YLQsNC10YIg0YEg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGM0Y4g0Y3RgtC+0Lkg0LrQvtGA0LfQuNC90YsuINCf0L7RgdGC0LXQv9C10L3QvdC+INC/0YDQuNCx0LvQuNC20LDQtdGC0YHRjyDQuiDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0LhcclxuICAgICAqINC60L7RgNC30LjQvdGLINGA0LDQstC90L7QuSDQt9Cw0LTQsNC90L3QvtC80YMg0LfQvdCw0YfQtdC90LjRjiDQt9CwINC30LDQtNCw0L3QvtC1INCy0YDQtdC80Y8uXHJcbiAgICAgKiBAbWV0aG9kIGpvYldpdGhPcGFjaXR5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3BhY2l0eSDQvdGD0LbQvdC+INC00L7RgdGC0LjRhyDRjdGC0L7QuSDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0LhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lINC30LAg0YHRgtC+0LvRjNC60L4g0YHQtdC60YPQvdC0XHJcbiAgICAgKi9cclxuICAgIGpvYldpdGhPcGFjaXR5KG9wYWNpdHksIHRpbWUpe1xyXG4gICAgICAgIGxldCBpbnRldmFsSW5jcmVtZW50cyA9IHRpbWUgLyBNYXRoLmFicyh0aGlzLm5vZGUub3BhY2l0eSAtIG9wYWNpdHkpO1xyXG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLmNhbGxCYWNrT3BhY2l0eSk7XHJcbiAgICAgICAgdGhpcy5jYWxsQmFja09wYWNpdHkgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUub3BhY2l0eSA9PT0gb3BhY2l0eSkge1xyXG4gICAgICAgICAgICAgICAgLy9pZiAodGhpcy5ub2RlLm9wYWNpdHkgPCAxMjUpIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLmNhbGxCYWNrT3BhY2l0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKG9wYWNpdHkgPiB0aGlzLm5vZGUub3BhY2l0eSkgPyB0aGlzLm5vZGUub3BhY2l0eSArPSAxIDogdGhpcy5ub2RlLm9wYWNpdHkgLT0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLmNhbGxCYWNrT3BhY2l0eSwgaW50ZXZhbEluY3JlbWVudHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQsdGD0LTQtdGCINC70Lgg0LbQuNGC0Ywg0LbQuNCy0L7RgtC90L7QtSDQuNC70Lgg0L7QvdC+INCy0YvQsdGA0L7RiNC10L3QviDQsiDQutC+0YDQt9C40L3Rgy5cclxuICAgICAqIEBtZXRob2QgaXNBbmltYWxMaWZlXHJcbiAgICAgKiBAcGFyYW0ge2NjLlZlYzJ9IHBvaW50INGC0L7Rh9C60LAg0L3QsNGF0L7QttC00LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSAtINC10YHQu9C4INC20LjQstC+0YLQvdC+0LUg0LHRg9C00LXRgiDQttC40YLRjFxyXG4gICAgICovXHJcbiAgICBpc0FuaW1hbExpZmUocG9pbnQpe1xyXG4gICAgICAgIHRoaXMuX2xlZnRQb2ludEJvdHRvbSA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy5ub2RlLnggLSB0aGlzLm5vZGUud2lkdGgsXHJcbiAgICAgICAgICAgIHk6IHRoaXMubm9kZS55IC0gdGhpcy5ub2RlLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fcmlnaHRQb2ludFRvcCA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy5ub2RlLnggKyB0aGlzLm5vZGUud2lkdGgsXHJcbiAgICAgICAgICAgIHk6IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IFggPSBwb2ludC54ID4gdGhpcy5fbGVmdFBvaW50Qm90dG9tLnggJiYgcG9pbnQueCA8IHRoaXMuX3JpZ2h0UG9pbnRUb3AueDtcclxuICAgICAgICBsZXQgWSA9IHBvaW50LnkgPiB0aGlzLl9sZWZ0UG9pbnRCb3R0b20ueSAmIHBvaW50LnkgPCB0aGlzLl9yaWdodFBvaW50VG9wLnk7XHJcbiAgICAgICAgcmV0dXJuICEoWCAmJiBZKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0L7QsdGJ0LDQtdGCINC60L7RgNC30LjQvdC1INC/0L7Qt9C40YbQuNGOINC20LjQstC+0YLQvdC+0LPQviDQtNC70Y8g0L/RgNC40L3Rj9GC0LjRjyDRgNC10YjQtdC90LjRjyDQv9C+INCy0YvQsdC+0YDRgyDQtNC10LnRgdGC0LLQuNGPLiDQmtC+0YDQt9C40L3QsCDQvNC10L3Rj9C10YIg0YHQstC+0LUg0YHQvtGB0YLQvtGP0L3QuNC1XHJcbiAgICAgKiDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0YDQsNGB0YHRgtC+0Y/QvdC40Y8uXHJcbiAgICAgKiBAbWV0aG9kIHNldFBvc2l0aW9uQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLlZlYzJ9IHBvaW50INGC0L7Rh9C60LAg0YLQtdC60YPRidC10LPQviDQvNC10YHRgtC+0L3QsNGF0L7QttC00LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgKi9cclxuICAgIHNldFBvc2l0aW9uQW5pbWFsKHBvaW50KXtcclxuICAgICAgICB0aGlzLl9sZWZ0UG9pbnRCb3R0b20gPSB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMubm9kZS54IC0gdGhpcy5ub2RlLndpZHRoLFxyXG4gICAgICAgICAgICB5OiB0aGlzLm5vZGUueSAtIHRoaXMubm9kZS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0UG9pbnRUb3AgPSB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMubm9kZS54ICsgdGhpcy5ub2RlLndpZHRoLFxyXG4gICAgICAgICAgICB5OiB0aGlzLm5vZGUueSArIHRoaXMubm9kZS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2NlbnRyZVBvaW50QmFza2V0ID0ge1xyXG4gICAgICAgICAgICB4OiAodGhpcy5fbGVmdFBvaW50Qm90dG9tLnggKyB0aGlzLl9yaWdodFBvaW50VG9wLngpIC8gMixcclxuICAgICAgICAgICAgeTogKHRoaXMuX3JpZ2h0UG9pbnRUb3AueSArIHRoaXMuX2xlZnRQb2ludEJvdHRvbS55KSAvIDJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgeCA9IChwb2ludC54IC0gdGhpcy5fY2VudHJlUG9pbnRCYXNrZXQueCkgKiAocG9pbnQueCAtIHRoaXMuX2NlbnRyZVBvaW50QmFza2V0LngpO1xyXG4gICAgICAgIGxldCB5ID0gKHBvaW50LnkgLSB0aGlzLl9jZW50cmVQb2ludEJhc2tldC55KSAqIChwb2ludC55IC0gdGhpcy5fY2VudHJlUG9pbnRCYXNrZXQueSk7XHJcbiAgICAgICAgbGV0IHNxcnRQb2ludCA9IE1hdGguc3FydCh4ICsgeSk7XHJcblxyXG4gICAgICAgIGxldCBpc1YgPSBzcXJ0UG9pbnQgPCB0aGlzLmFudGljaXBhdGlvbjtcclxuICAgICAgICAoaXNWKSA/IHRoaXMuX3N0YXRlQmFza2V0ID0gU3RhdGVCYXNrZXQuYWN0aXZlIDogdGhpcy5fc3RhdGVCYXNrZXQgPSBTdGF0ZUJhc2tldC5zbGVlcDtcclxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0dXNCYXNrZXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0YHRgtCw0YLRg9GBINC60L7RgNC30LjQvdGLINC4INCy0YvQt9GL0LLQsNC10YIg0YHQvtC+0YLQstC10YLRgdGC0LLRg9GO0YnQtdC1INC00LXQudGB0YLQstC40LUuXHJcbiAgICAgKiBAbWV0aG9kIF91cGRhdGVTdGF0dXNCYXNrZXRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF91cGRhdGVTdGF0dXNCYXNrZXQoKXtcclxuICAgICAgICBpZiAodGhpcy5fcHJldmlvdXNTdGF0dXMgIT0gdGhpcy5fc3RhdGVCYXNrZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNTdGF0dXMgPSB0aGlzLl9zdGF0ZUJhc2tldDtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLl9zdGF0ZUJhc2tldCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZUJhc2tldC5hY3RpdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU3RhdHVzQWN0aXZlQmFza2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlQmFza2V0LnNsZWVwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0YXR1c1NsZWVwQmFza2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlQmFza2V0Lndvcms6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU3RhdHVzV29ya0Jhc2tldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbn0pO1xyXG5cclxuIiwiaW1wb3J0IHsgQm94LCBUeXBlQm94IH0gZnJvbSAnLi9ib3gtc2FtcGxlcy9ib3gnO1xyXG4vKipcclxuICog0JHQvtC60YEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40Log0L3QtSDQv9GA0LXQtNC90LDQt9C90LDRh9C10L0g0LTQu9GPINGD0L/RgNCw0LLQu9C10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8XHJcbiAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICovXHJcbnZhciBCb3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBCb3gsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvdCw0YfQsNC70YzQvdGL0LUg0L/QvtC30LjRhtC40Lgg0Lgg0L/RgNC+0LjQt9Cy0L7QtNC40YIg0LLRi9GH0LjRgdC70LXQvdC40LUg0LTQu9C40L3QvdGLXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0dGluZ3MoKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IFR5cGVCb3gubGVmdDtcclxuICAgICAgICB0aGlzLnRpbWVCcmluZz0wLjE7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGNjLmRpcmVjdG9yLmdldFdpblNpemVJblBpeGVscygpO1xyXG4gICAgICAgIGxldCBzaXplQm94WSA9IHRoaXMuX2dldFNpemVCb3goY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSBzaXplQm94WSAvIDIgKyB0aGlzLmluZGVudFJpZ2h0O1xyXG4gICAgICAgIHRoaXMubm9kZS5oZWlnaHQgPSBzaXplQm94WTtcclxuICAgICAgICB0aGlzLl9zdGFydFBvcyA9IGNjLnYyKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy5fZW5kUG9zID0gY2MudjIodGhpcy5ub2RlLnggKyB0aGlzLm5vZGUud2lkdGgsIHRoaXMubm9kZS55KTtcclxuICAgICAgICB0aGlzLl9hbW91bnRQaXggPSBNYXRoLmFicyh0aGlzLl9lbmRQb3MueCAtIHRoaXMuX3N0YXJ0UG9zLngpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC+0YLQutGA0YvRgtC40LUg0LHQvtC60YHQsCDQsiDQutC+0L3RgtGA0L7Qu9C70LXRgNC1XHJcbiAgICAgKi9cclxuICAgIHB1Ymxpc2hFdmVudE9wZW4oKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnb3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQt9Cw0LrRgNGL0LjQtSDQsdC+0LrRgdCwINCyINC60L7QvdGC0YDQvtC70LvQtdGA0LVcclxuICAgICAqL1xyXG4gICAgcHVibGlzaEV2ZW50Q2xvc2UoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnY2xvc2VCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINCx0L7QutGB0L7QslxyXG4gICAgICogQHBhcmFtIHthbnl9IGR0XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIHRoaXMuX29wYWNpdHlOb2RlKHRoaXMubm9kZS54IC0gdGhpcy5fc3RhcnRQb3MueCk7XHJcbiAgICB9LFxyXG59KTsiLCJpbXBvcnQgeyBCb3gsIFR5cGVCb3ggfSBmcm9tICcuL2JveC1zYW1wbGVzL2JveCc7XHJcblxyXG4vKipcclxuICog0JHQvtC60YEg0YHQv9C40YHQutCwINC20LjQstC+0YLQvdGL0YVcclxuICogQHR5cGUge0Z1bmN0aW9ufVxyXG4gKi9cclxudmFyIEJveENyZWF0ZUFuaW1hbCA9IGNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IEJveCxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LDRh9Cw0LvRjNC90YvQtSDQv9C+0LfQuNGG0LjQuCDQuCDQv9GA0L7QuNC30LLQvtC00LjRgiDQstGL0YfQuNGB0LvQtdC90LjQtSDQtNC70LjQvdC90YtcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXR0aW5ncygpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gVHlwZUJveC5ib3R0b207XHJcbiAgICAgICAgdGhpcy50aW1lQnJpbmc9MC4yO1xyXG4gICAgICAgIGxldCBiYXIgPSB0aGlzLmNvbnRlbnQ7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGNjLmRpcmVjdG9yLmdldFdpblNpemVJblBpeGVscygpO1xyXG4gICAgICAgIGxldCBzaXplQm94WCA9IHRoaXMuX2dldFNpemVCb3goY2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLm5vZGUueCA9IHNpemVCb3hYIC8gMiArIHRoaXMuaW5kZW50TGVmdDtcclxuICAgICAgICBiYXIud2lkdGggPSBzaXplQm94WDtcclxuICAgICAgICB0aGlzLl9zdGFydFBvcyA9IGNjLnYyKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy5fZW5kUG9zID0gY2MudjIodGhpcy5ub2RlLngsIHRoaXMubm9kZS55ICsgYmFyLmhlaWdodCAtIDEwKTtcclxuICAgICAgICB0aGlzLl9hbW91bnRQaXggPSBNYXRoLmFicyh0aGlzLl9lbmRQb3MueSAtIHRoaXMuX3N0YXJ0UG9zLnkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQvtGC0LrRgNGL0YLQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRPcGVuKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ29wZW5Cb3hGcm9tQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0LfQsNC60YDRi9GC0LjQtSDQsdC+0LrRgdCwINCyINC60L7QvdGC0YDQvtC70LvQtdGA0LVcclxuICAgICAqL1xyXG4gICAgcHVibGlzaEV2ZW50Q2xvc2UoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnY2xvc2VCb3hGcm9tQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINCx0L7QutGB0L7QslxyXG4gICAgICogQHBhcmFtIHthbnl9IGR0XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIHRoaXMuX29wYWNpdHlOb2RlKHRoaXMubm9kZS55IC0gdGhpcy5fc3RhcnRQb3MueSk7XHJcbiAgICB9LFxyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBGSVJDb3JwIG9uIDI5LjAzLjIwMTcuXHJcbiAqL1xyXG5pbXBvcnQgeyBCb3gsIFR5cGVCb3ggfSBmcm9tICcuL2JveC1zYW1wbGVzL2JveCc7XHJcbi8qKlxyXG4gKiDQkdC+0LrRgSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQuiDQvdC1INC/0YDQtdC00L3QsNC30L3QsNGH0LXQvSDQtNC70Y8g0YPQv9GA0LDQstC70LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LxcclxuICogQHR5cGUge0Z1bmN0aW9ufVxyXG4gKi9cclxudmFyIEJveE1lbnVQbGF5ID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogQm94LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0L3QsNGH0LDQu9GM0L3Ri9C1INC/0L7Qt9C40YbQuNC4INC4INC/0YDQvtC40LfQstC+0LTQuNGCINCy0YvRh9C40YHQu9C10L3QuNC1INC00LvQuNC90L3Ri1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3NldHRpbmdzKCkge1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBUeXBlQm94LmxlZnQ7XHJcbiAgICAgICAgdGhpcy50aW1lQnJpbmc9MC42O1xyXG4gICAgICAgIGxldCBjYW52YXMgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplSW5QaXhlbHMoKTtcclxuICAgICAgICBsZXQgc2l6ZUJveFkgPSB0aGlzLl9nZXRTaXplQm94KGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gc2l6ZUJveFkgLyAyICsgdGhpcy5pbmRlbnRSaWdodDtcclxuICAgICAgICB0aGlzLm5vZGUuaGVpZ2h0ID0gc2l6ZUJveFk7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIHRoaXMuX2VuZFBvcyA9IGNjLnYyKHRoaXMubm9kZS54ICsgdGhpcy5ub2RlLndpZHRoIC0gNzUsIHRoaXMubm9kZS55KTtcclxuICAgICAgICB0aGlzLl9hbW91bnRQaXggPSBNYXRoLmFicyh0aGlzLl9lbmRQb3MueCAtIHRoaXMuX3N0YXJ0UG9zLngpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC60YDRi9Cy0LDQtdGCL9C30LDQutGA0YvQstCw0LXRgiDQsdC+0LrRgVxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xpY2soZXZlbnQpe1xyXG4gICAgICAgIHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC+0YLQutGA0YvRgtC40LUg0LHQvtC60YHQsCDQsiDQutC+0L3RgtGA0L7Qu9C70LXRgNC1XHJcbiAgICAgKi9cclxuICAgIHB1Ymxpc2hFdmVudE9wZW4oKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnb3BlbkJveE1lbnVQbGF5JywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0LfQsNC60YDRi9C40LUg0LHQvtC60YHQsCDQsiDQutC+0L3RgtGA0L7Qu9C70LXRgNC1XHJcbiAgICAgKi9cclxuICAgIHB1Ymxpc2hFdmVudENsb3NlKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Nsb3NlQm94TWVudVBsYXknLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0L3QvtCy0LvRj9C10YIg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINCx0L7QutGB0L7QslxyXG4gICAgICogQHBhcmFtIHthbnl9IGR0XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIHRoaXMuX29wYWNpdHlOb2RlKHRoaXMubm9kZS54IC0gdGhpcy5fc3RhcnRQb3MueCk7XHJcbiAgICB9LFxyXG59KTsiLCIvKipcclxuICogRW51bSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LHQvtC60YHQsFxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBNb3ZlbWVudFxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gdG9DbG9zZSDQsdC+0LrRgSDQt9Cw0LrRgNGL0YIuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0b09wZW4g0LHQvtC60YEg0L7RgtC60YDRi9GCLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQodC+0YHRgtC+0Y/QvdC40LUg0LHQvtC60YHQsCAo0L7RgtC60YDRi9GCL9C30LDQutGA0YvRgilcclxuICogQHR5cGUge01vdmVtZW50fVxyXG4gKi9cclxuY29uc3QgTW92ZW1lbnQgPSB7XHJcbiAgICB0b0Nsb3NlOiAwLFxyXG4gICAgdG9PcGVuOiAxLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVudW0g0YHQvtGB0YLQvtGP0L3QuNC5INGA0LDQsdC+0YLRiyDQsdC+0LrRgdCwXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFR5cGVCb3hcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJvdHRvbSDRgNCw0LHQvtGC0LAg0LrQsNC6INC90LjQttC90LjQuSDQsdC+0LrRgS5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHRvcCDRgNCw0LHQvtGC0LAg0LrQsNC6INCy0LXRgNGF0L3QuNC5INCx0L7QutGBLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmlnaHQg0YDQsNCx0L7RgtCwINC60LDQuiDQv9GA0LDQstGL0Lkg0LHQvtC60YEuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsZWZ0INGA0LDQsdC+0YLQsCDQutCw0Log0LvQtdCy0Ysg0LHQvtC60YEuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCi0LjQvyDQsdC+0LrRgdCwXHJcbiAqIEB0eXBlIHt7Ym90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBsZWZ0OiBudW1iZXJ9fVxyXG4gKi9cclxuY29uc3QgVHlwZUJveCA9IHtcclxuICAgIGJvdHRvbTogMCxcclxuICAgIHRvcDogMSxcclxuICAgIHJpZ2h0OiAyLFxyXG4gICAgbGVmdDogMyxcclxufTtcclxuLyoqXHJcbiAqINCv0LTRgNC+INCx0L7QutGB0L7QslxyXG4gKiBAdHlwZSB7Y2MuQ2xhc3N9XHJcbiAqL1xyXG52YXIgQm94ID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfc3RhcnRQb3M6IG51bGwsLy/QodGC0LDRgNGC0L7QstCw0Y8g0L/QvtC30LjRhtC40Y8g0LHQvtC60YHQsFxyXG4gICAgICAgIF9lbmRQb3M6IG51bGwsLy/QutC+0L3QtdGH0L3QsNGPINC/0L7Qt9C40YbQuNGPINCx0L7QutGB0LBcclxuICAgICAgICBfdHlwZTogbnVsbCwvL9GB0L7RgdGC0L7Rj9C90LjQtSDRgtC40L/QsCDQsdC+0LrRgdCwINCyINC60L7RgtC+0YDQvtC8INC+0L0g0YDQsNCx0L7RgtCw0LXRglxyXG4gICAgICAgIF9kaXJlY3Rpb246IDEsLy8wLSDQt9Cw0LrRgNGL0YLRjNGB0Y8gMS0g0L7RgtC60YDRi9GC0YzRgdGPXHJcbiAgICAgICAgX2ZsYWdCbG9jazogZmFsc2UsLy/RhNC70LDQsyDQsdC70L7QutC40YDQvtCy0LrQuFxyXG4gICAgICAgIF9mbGFnWmFwcm9zQmxvY2s6IGZhbHNlLC8v0YTQu9Cw0LMg0L4g0L3QtdC+0LHRhdC+0LTQuNC+0LzRgdGC0Lgg0LHQu9C+0LrQuNGA0L7QstC60LhcclxuICAgICAgICBfYW1vdW50UGl4OiBudWxsLC8v0L/Rg9GC0Ywg0LTQu9GPINCx0L7QutGB0LBcclxuICAgICAgICBfYWN0aW9uTW92ZUJveDogbnVsbCwvL2FjdGlvbnMg0LTQstC40LbQtdC90LjRjyDQsdC+0LrRgdCwXHJcblxyXG4gICAgICAgIHRpbWVCcmluZzogMC4wMSwvL9CS0YDQtdC80Y8g0LTQvtCy0L7QtNCwINCyINGB0LXQutGD0L3QtNCw0YVcclxuICAgICAgICBjb250ZW50OiBjYy5Ob2RlLC8v0LrQvtC90YLQtdC90YIg0L3QsNC0INC60L7RgtC+0YDRi9C8INC90LXQvtCx0YXQvtC00LjQvNC+INC/0YDQvtC40LfQstC10YHRgtC4INGA0LDQsdC+0YLRg1xyXG4gICAgICAgIG9wYWNpdHlCb3g6IDMwLC8v0J/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINCx0L7QutGB0LAgXHJcbiAgICAgICAgaW5kZW50TGVmdDogNTAsLy/QntGC0YHRgtGD0L8g0YHQu9C10LLQsCAo0LIgcHgpXHJcbiAgICAgICAgaW5kZW50UmlnaHQ6IDUwLC8v0J7RgtGB0YLRg9C/INGB0L/RgNCw0LLQsCAo0LIgcHgpXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgdGD0YnQtdGB0YLQstC70Y/QtdGCINC/0LXRgNCy0L7QvdCw0YfQsNC70YzQvdGD0Y4g0L3QsNGB0YLRgNC+0LnQutGDXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9nZXRQZXJtaXNzaW9uTW92ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC/0LXRgNC10LzQtdC90L3Ri9GFXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaW5pdCgpe1xyXG4gICAgICAgIC8v0JTQsNC70YzQvdC10LnRiNC10LUg0LTQtdC50YHRgtCy0LjQtSDQsdC+0LrRgdCwXHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIHRoaXMuX3NldHRpbmdzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjRjyDQvdCwINGB0YLRgNCw0YIg0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hTdGFydChldmVudCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNGPINC90LAg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnQg0YHQvtCx0YvRgtC40LVcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE1vdmUoZXZlbnQpIHtcclxuICAgICAgICB2YXIgZGVsdGEgPSBldmVudC50b3VjaC5nZXREZWx0YSgpO1xyXG4gICAgICAgIGlmICghdGhpcy5fZmxhZ0Jsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldE1vdmVtZW50KGRlbHRhKS5fbW92ZUJveChkZWx0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40LUg0L3QsCDQt9Cw0LLQtdGA0YjQtdC90LjQtSDRgtCw0YfQsFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnQg0YHQvtCx0YvRgtC40LVcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaEVuZChldmVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZmxhZ0Jsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LrQu9GO0YfQsNC10YIg0LHQu9C+0LrQuNGA0L7QstC60YMg0LHQvtC60YHQsFxyXG4gICAgICovXHJcbiAgICBvbkJsb2NrKCl7XHJcbiAgICAgICAgdGhpcy5fZmxhZ1phcHJvc0Jsb2NrID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9mbGFnQmxvY2sgPSB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQutC70Y7Rh9Cw0LXRgiDQsdC70L7QutC40YDQvtCy0LrRgyDQsdC+0LrRgdCwXHJcbiAgICAgKi9cclxuICAgIG9mZkJsb2NrKCl7XHJcbiAgICAgICAgdGhpcy5fZmxhZ1phcHJvc0Jsb2NrID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZmxhZ0Jsb2NrID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC60YDRi9Cy0LDQtdGCINCx0L7QutGBXHJcbiAgICAgKi9cclxuICAgIG9wZW5Cb3goKXtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBNb3ZlbWVudC50b09wZW47XHJcbiAgICAgICAgdGhpcy5fZW5kU3dpcGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQl9Cw0LrRgNGL0LLQsNC10YIg0LHQvtC60YFcclxuICAgICAqL1xyXG4gICAgY2xvc2VCb3goKXtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBNb3ZlbWVudC50b0Nsb3NlO1xyXG4gICAgICAgIHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10YIg0L7QttC40LTQsNC10LzQvtC1INGB0L7RgdGC0L7Rj9C90LjQtSDQv9C+INC90LDQv9GA0LDQstC70LXQvdC40Y4g0LTQstC40LbQtdC90LjRjyDQsdC+0LrRgdCwXHJcbiAgICAgKiBAcGFyYW0gZGVsdGEg0L/RgNC40YDQsNGJ0LXQvdC40LVcclxuICAgICAqIEByZXR1cm5zIHtCb3h9INGN0YLQvtGCINC60LvQsNGB0YFcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXRNb3ZlbWVudChkZWx0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLl90eXBlID09PSBUeXBlQm94LnRvcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBkZWx0YS55ID4gMCA/IE1vdmVtZW50LnRvQ2xvc2UgOiBNb3ZlbWVudC50b09wZW47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl90eXBlID09PSBUeXBlQm94LmJvdHRvbSkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBkZWx0YS55IDwgMCA/IE1vdmVtZW50LnRvQ2xvc2UgOiBNb3ZlbWVudC50b09wZW47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl90eXBlID09PSBUeXBlQm94LmxlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gZGVsdGEueCA8IDAgPyBNb3ZlbWVudC50b0Nsb3NlIDogTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRlbHRhLnggPiAwID8gTW92ZW1lbnQudG9DbG9zZSA6IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINCy0YvRhdC+0LQg0LHQvtC60YHQsCDQt9CwINC/0YDQtdC00LXQu9GLINC40L3RgtC10YDQstCw0LvQsCDQsiDRgNC10LfRg9C00YzRgtCw0YLQtSDQstGL0L/QvtC70L3QtdC90LjRjyDQtNCw0L3QvdC+0LPQviDQv9GA0LjRgNCw0YnQtdC90LjRjy4gdHJ1ZS3QutC+0LPQtNCwINC+0L0g0L3QtSDQstGL0YXQvtC00LjRglxyXG4gICAgICogQHBhcmFtIGRlbHRhINC/0YDQuNGA0LDRidC10L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtGLXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQg0YHRgtCw0YDRgtC+0LLQsNGPINC60L7QvtGA0LTQuNC90LAo0LrQvtC+0YDQtNC40L3QsNGC0LAg0LfQsNC60YDRi9GC0L7Qs9C+INCx0L7QutGB0LApXHJcbiAgICAgKiBAcGFyYW0gZW5kINC60L7QvdC10YfQvdCw0Y8g0LrQvtC+0YDQtNC40L3QsNGC0LAo0LrQvtC+0YDQtNC40L3QsNGC0LAg0L7RgtC60YDRi9GC0L7Qs9C+INCx0L7QutGB0LApXHJcbiAgICAgKiBAcGFyYW0gY3VycmVudCDRgtC10LrRg9GJ0LDQsCDQutC+0L7RgNC00LjQvdCw0YLQsFxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZS0g0LXRgdC70Lgg0LHQvtC60YEg0L3QtSDQstGL0YXQvtC00LjRgiDQt9CwINC/0YDQtdC00LXQu9GLXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaXNDaGVja091dE9mUmFuZ2UoZGVsdGEsIHN0YXJ0LCBlbmQsIGN1cnJlbnQpe1xyXG4gICAgICAgIHJldHVybiBzdGFydCA8IGVuZCA/IHRoaXMuX2lzT3V0T2ZSYW5nZUxlZnRCb3R0b20oZGVsdGEsIHN0YXJ0LCBlbmQsIGN1cnJlbnQpIDogdGhpcy5faXNPdXRPZlJhbmdlUmlnaHRUb3AoZGVsdGEsIHN0YXJ0LCBlbmQsIGN1cnJlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDQstGL0YXQvtC0INC70LXQstC+0LPQviDQuCDQvdC40LbQvdC10LPQviDQsdC+0LrRgdCwINC30LAg0L/RgNC10LTQtdC70Ysg0LjQvdGC0LXRgNCy0LDQu9CwINCyINGA0LXQt9GD0LTRjNGC0LDRgtC1INCy0YvQv9C+0LvQvdC10L3QuNGPINC00LDQvdC90L7Qs9C+INC/0YDQuNGA0LDRidC10L3QuNGPXHJcbiAgICAgKiBAcGFyYW0gZGVsdGEg0L/RgNC40YDQsNGJ0LXQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0YtcclxuICAgICAqIEBwYXJhbSBzdGFydCDRgdGC0LDRgNGC0L7QstCw0Y8g0LrQvtC+0YDQtNC40L3QsCjQutC+0L7RgNC00LjQvdCw0YLQsCDQt9Cw0LrRgNGL0YLQvtCz0L4g0LHQvtC60YHQsClcclxuICAgICAqIEBwYXJhbSBlbmQg0LrQvtC90LXRh9C90LDRjyDQutC+0L7RgNC00LjQvdCw0YLQsCjQutC+0L7RgNC00LjQvdCw0YLQsCDQvtGC0LrRgNGL0YLQvtCz0L4g0LHQvtC60YHQsClcclxuICAgICAqIEBwYXJhbSBjdXJyZW50INGC0LXQutGD0YnQsNCwINC60L7QvtGA0LTQuNC90LDRgtCwXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZS0g0LXRgdC70Lgg0LHQvtC60YEg0L3QtSDQstGL0YXQvtC00LjRgiDQt9CwINC/0YDQtdC00LXQu9GLXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaXNPdXRPZlJhbmdlTGVmdEJvdHRvbShkZWx0YSwgc3RhcnQsIGVuZCwgY3VycmVudCl7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhICsgY3VycmVudCA+IHN0YXJ0ICYmIGRlbHRhICsgY3VycmVudCA8IGVuZDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LLRi9GF0L7QtCDQstC10YDRhdC90LXQs9C+INC4INC/0YDQsNCy0L7Qs9C+INCx0L7QutGB0LAg0LfQsCDQv9GA0LXQtNC10LvRiyDQuNC90YLQtdGA0LLQsNC70LAg0LIg0YDQtdC30YPQtNGM0YLQsNGC0LUg0LLRi9C/0L7Qu9C90LXQvdC40Y8g0LTQsNC90L3QvtCz0L4g0L/RgNC40YDQsNGJ0LXQvdC40Y9cclxuICAgICAqIEBwYXJhbSBkZWx0YSDQv9GA0LjRgNCw0YnQtdC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLRi1xyXG4gICAgICogQHBhcmFtIHN0YXJ0INGB0YLQsNGA0YLQvtCy0LDRjyDQutC+0L7RgNC00LjQvdCwKNC60L7QvtGA0LTQuNC90LDRgtCwINC30LDQutGA0YvRgtC+0LPQviDQsdC+0LrRgdCwKVxyXG4gICAgICogQHBhcmFtIGVuZCDQutC+0L3QtdGH0L3QsNGPINC60L7QvtGA0LTQuNC90LDRgtCwKNC60L7QvtGA0LTQuNC90LDRgtCwINC+0YLQutGA0YvRgtC+0LPQviDQsdC+0LrRgdCwKVxyXG4gICAgICogQHBhcmFtIGN1cnJlbnQg0YLQtdC60YPRidCw0LAg0LrQvtC+0YDQtNC40L3QsNGC0LBcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlLSDQtdGB0LvQuCDQsdC+0LrRgSDQvdC1INCy0YvRhdC+0LTQuNGCINC30LAg0L/RgNC10LTQtdC70YtcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9pc091dE9mUmFuZ2VSaWdodFRvcChkZWx0YSwgc3RhcnQsIGVuZCwgY3VycmVudCl7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhICsgY3VycmVudCA8IHN0YXJ0ICYmIGRlbHRhICsgY3VycmVudCA+IGVuZDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNCy0LjQttC10L3QuNC1INCx0L7QutGB0LBcclxuICAgICAqIEBwYXJhbSB7Y2MuVmVjMn0gZGVsdGEg0L/RgNC40YDQsNGJ0LXQvdC40LVcclxuICAgICAqIEByZXR1cm5zIHtCb3h9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfbW92ZUJveChkZWx0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLl90eXBlID09PSBUeXBlQm94LnRvcCB8fCB0aGlzLl90eXBlID09PSBUeXBlQm94LmJvdHRvbSkge1xyXG4gICAgICAgICAgICAodGhpcy5faXNDaGVja091dE9mUmFuZ2UoZGVsdGEueSwgdGhpcy5fc3RhcnRQb3MueSwgdGhpcy5fZW5kUG9zLnksIHRoaXMubm9kZS55KSkgPyB0aGlzLm5vZGUueSArPSBkZWx0YS55IDogdGhpcy5fZW5kU3dpcGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAodGhpcy5faXNDaGVja091dE9mUmFuZ2UoZGVsdGEueCwgdGhpcy5fc3RhcnRQb3MueCwgdGhpcy5fZW5kUG9zLngsIHRoaXMubm9kZS54KSkgPyB0aGlzLm5vZGUueCArPSBkZWx0YS54IDogdGhpcy5fZW5kU3dpcGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLRi9C/0L7Qu9C90Y/QtdGCINCw0LLRgtC+INC00L7QstC+0LTQutGDXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZW5kU3dpcGUoKXtcclxuICAgICAgICB0aGlzLl9mbGFnQmxvY2sgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9PT0gTW92ZW1lbnQudG9DbG9zZSA/IHRoaXMuX2JyaW5nKHRoaXMuX3N0YXJ0UG9zKSA6IHRoaXMuX2JyaW5nKHRoaXMuX2VuZFBvcyk7XHJcbiAgICAgICAgdGhpcy5fcmVmb2N1cygpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQv9C+0LvQvdGP0LXRgiDQsNCy0YLQviDQtNC+0LLQvtC0ICDQsdC+0LrRgdCwINC00L4g0YTQuNC90LDQu9GM0L3QvtC5INGC0L7Rh9C60Lgg0L3QsNC30L3QsNGH0LXQvdC40Y9cclxuICAgICAqIEBwYXJhbSBwb3Mg0YLQvtGH0LrQsCDQvdCw0LfQvdCw0YfQtdC90LjRj1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2JyaW5nKHBvcyl7XHJcbiAgICAgICAgdGhpcy5fYWN0aW9uTW92ZUJveCA9IGNjLm1vdmVUbyh0aGlzLnRpbWVCcmluZywgcG9zKTtcclxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKFxyXG4gICAgICAgICAgICBjYy5zZXF1ZW5jZSh0aGlzLl9hY3Rpb25Nb3ZlQm94LCBjYy5jYWxsRnVuYyh0aGlzLl9maW5pc2hCcmluZywgdGhpcykpXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNGD0L3QutGG0LjRjyDRgdC40LPQvdCw0LvQuNC30LjRgNGD0Y7RidCw0Y8g0L4g0LfQsNCy0LXRgNGI0LXQvdC40Lgg0LTQvtCy0L7QtNC60Lgg0LHQvtC60YHQsFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2ZpbmlzaEJyaW5nKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9mbGFnWmFwcm9zQmxvY2spIHRoaXMuX2ZsYWdCbG9jayA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQtNC10LvQsNC10YIg0LvQuCDQvtC9INGN0YLQviDRgdC+0LHRi9GC0LjQtSDQsCDQvdC1INC60YLQvi3RgtC+INC00YDRg9Cz0L7QuSDQv9C+INCy0LXRgtC60LUg0L3QvtC00L7QsiDQtNC+INC90LXQs9C+XHJcbiAgICAgKiBAcGFyYW0gZXZlbnQg0YHQvtCx0YvRgtC40LVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9nZXRQZXJtaXNzaW9uTW92ZShldmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuX25hbWUgPT09IHRoaXMubm9kZS5uYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaE1vdmUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiDRgNCw0LfQvNC10YAg0LHQvtC60YHQsCDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstCwINC90LAg0YHRgtC+0YDQvtC90LUg0Lgg0YPRgdC70L7QstC40Lkg0L7RgtGB0YLRg9C/0L7QslxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwYWNlICDRgNCw0LfQvNC10YAg0LHQvtC60YHQsNC00L4g0L/RgNC40YDQsNGJ0LXQvdC40Y9cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9INGA0LDQt9C80LXRgCDQsdC+0LrRgdCwXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZ2V0U2l6ZUJveChzcGFjZSkge1xyXG4gICAgICAgIHJldHVybiBzcGFjZSAtIHRoaXMuaW5kZW50TGVmdCAtIHRoaXMuaW5kZW50UmlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdC90Y/QtdGCINC00LXQudGB0YLQstC40LUg0LrQvtGC0L7RgNC+0LUg0L3QtdC+0LHRhdC+0LTQuNC80L4g0YHQtNC10LvQsNGC0Ywg0LTQsNC70YzRiNC1INCx0L7QutGB0YMo0LfQsNC60YDRi9GC0YzRgdGPINC40LvQuCDQvtGC0LrRgNGL0YLRjNGB0Y8pLtCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3JlZm9jdXMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PT0gTW92ZW1lbnQudG9DbG9zZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBNb3ZlbWVudC50b09wZW47XHJcbiAgICAgICAgICAgIHRoaXMucHVibGlzaEV2ZW50Q2xvc2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBNb3ZlbWVudC50b0Nsb3NlO1xyXG4gICAgICAgICAgICB0aGlzLnB1Ymxpc2hFdmVudE9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNCx0L7RgtCwINGBINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjNGOINCx0L7QutGB0LAuINCY0LfQvNC10L3Rj9C10YIg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINCx0L7QutGB0LAg0L3QsCDQvtGB0L3QvtCy0LUg0L/QvtC70L7QttC10L3QuNGPINC10LPQviDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0L3QsNGH0LDQu9GM0L3Ri9GFINC4INC60L7QvdC10YfQvdGL0YUg0LrQvtC+0YDQtNC40L3QsNGCXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb3BhY2l0eU5vZGUoY3VycmVudFBvc0JveCkge1xyXG4gICAgICAgIGxldCBvcGFzaXR5ID0gdGhpcy5vcGFjaXR5Qm94ICsgKCgoMjU1IC0gdGhpcy5vcGFjaXR5Qm94KSAqIGN1cnJlbnRQb3NCb3gpIC8gdGhpcy5fYW1vdW50UGl4KTtcclxuICAgICAgICBpZiAob3Bhc2l0eSA+IDI1NSkge1xyXG4gICAgICAgICAgICBvcGFzaXR5ID0gMjU1O1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3Bhc2l0eSA8IHRoaXMub3BhY2l0eUJveCkge1xyXG4gICAgICAgICAgICBvcGFzaXR5ID0gdGhpcy5vcGFjaXR5Qm94O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IG9wYXNpdHk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7IEJveCwgTW92ZW1lbnQsIFR5cGVCb3ggfTsiLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgQW5pbWFsQnVpbGRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gQW5pbWFsQnVpbGRlcigpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgQW5pbWFsQnVpbGRlci5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmluc3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zdCA9IG5ldyBBbmltYWxCdWlsZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIucHJvdG90eXBlLmNyZWF0ZVN5c3RlbXMgPSBmdW5jdGlvbiAoc3lzdGVtcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IEFuaW1hbHMuU3lzdGVtcy5GYWN0b3JpZXMuU3lzdGVtRmFjdG9yeS5pbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICB2YXIgbWFzID0gW107XHJcbiAgICAgICAgICAgIHN5c3RlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgbWFzID0gW107XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNjYWxlc1R5cGUuZm9yRWFjaChmdW5jdGlvbiAoc2MpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXNbc2MudHlwZV0gPSBfdGhpcy5tYXNTY2FsZXNbc2MudHlwZV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLm1hc1N5c3RlbXNbaXRlbS50eXBlXSA9IGZhY3RvcnkuY3JlYXRlKGl0ZW0udHlwZSwgbWFzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQW5pbWFsQnVpbGRlci5wcm90b3R5cGUuY3JlYXRlU2NhbGVzID0gZnVuY3Rpb24gKHNjYWxlcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IEFuaW1hbHMuU2NhbGVzLkZhY3Rvcmllcy5TY2FsZUZhY3RvcnkuaW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgc2NhbGVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlU2NhbGUgPSBpdGVtLnR5cGVTY2FsZSwgdHlwZSA9IGl0ZW0udHlwZSwgcGFyYW1zID0gaXRlbS5wYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5tYXNTY2FsZXNbdHlwZV0gPSBmYWN0b3J5LmNyZWF0ZSh0eXBlU2NhbGUsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIucHJvdG90eXBlLmNyZWF0ZUNvbW11bmljYXRvciA9IGZ1bmN0aW9uIChjb21tdW5vY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21tdW5pY2F0b3JCdWlsZCA9IG5ldyBBbmltYWxzLkNvbW11bmljYXRpb25zLkJ1aWxkZXJzLkNvbW11bmljYXRvckJ1aWxkZXIodGhpcy5tYXNTY2FsZXMpO1xyXG4gICAgICAgICAgICBjb21tdW5vY2F0aW9uLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbW11bmljYXRvckJ1aWxkLmFkZChpdGVtKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tdW5pY2F0b3JCdWlsZC5idWlsZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQW5pbWFsQnVpbGRlci5wcm90b3R5cGUuY3JlYXRlU3RhdGVzID0gZnVuY3Rpb24gKHN0YXRlcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lLkZhY3RvcnlTdGF0ZS5TdGF0ZUZhY3RvcnkuaW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgdmFyIHBhcmFtU3RhdGUgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzLnN0YXRlLCBsaW5rcyA9IHN0YXRlcy5saW5rcztcclxuICAgICAgICAgICAgc3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1TdGF0ZVtpdGVtLnR5cGVdID0gZmFjdG9yeS5jcmVhdGUoaXRlbS50eXBlLCBpdGVtLm5hbWUsIF90aGlzLl9hbmltYWwsIGl0ZW0uaXNFbmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hc3NTdGF0ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubGluay5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hc3NTdGF0ZXMucHVzaChuZXcgQW5pbWFscy5TdGF0ZU1hY2hpbmUuUm91dGVzLlJvdXRlKHBhcmFtU3RhdGVbc3RhdGUudHlwZV0sIGZ1bmN0aW9uIChtb2RlbCwgcHJvYmFiaWxpdHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLnByb2JhYmlsaXR5ID4gcHJvYmFiaWxpdHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHBhcmFtU3RhdGVbaXRlbS50eXBlXS5zZXRSb3V0ZUVuZ2luZShuZXcgQW5pbWFscy5TdGF0ZU1hY2hpbmUuUm91dGVzLkVuZ2luZXMuUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZShtYXNzU3RhdGVzKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlN0YXRlTWFjaGluZShwYXJhbVN0YXRlW0FuaW1hbHMuU3RhdGVNYWNoaW5lLkZhY3RvcnlTdGF0ZS5UeXBlc1N0YXRlLnN0YXJ0TGlmZV0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQW5pbWFsQnVpbGRlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gbW9kZWwubmFtZSwgc3lzdGVtcyA9IG1vZGVsLnN5c3RlbXMsIHNjYWxlcyA9IG1vZGVsLnNjYWxlcywgY29tbXVuaWNhdGlvbiA9IG1vZGVsLmNvbW11bmljYXRpb24sIHN0YXRlcyA9IG1vZGVsLnN0YXRlcztcclxuICAgICAgICAgICAgdGhpcy5tYXNTY2FsZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5tYXNTeXN0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHZhciBjb21tdW5pY2F0b3IgPSB0aGlzLmNyZWF0ZVNjYWxlcyhzY2FsZXMpLmNyZWF0ZVN5c3RlbXMoc3lzdGVtcykuY3JlYXRlQ29tbXVuaWNhdG9yKGNvbW11bmljYXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLl9hbmltYWwgPSBuZXcgQW5pbWFscy5BbmltYWwodGhpcy5tYXNTeXN0ZW1zKTtcclxuICAgICAgICAgICAgdGhpcy5fYW5pbWFsLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICB0aGlzLl9hbmltYWwuc3RhdGVNYWNoaW5lID0gdGhpcy5jcmVhdGVTdGF0ZXMoc3RhdGVzKTtcclxuICAgICAgICAgICAgdGhpcy5fYW5pbWFsLmNvbW11bmljYXRvciA9IGNvbW11bmljYXRvcjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hbDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBBbmltYWxCdWlsZGVyO1xyXG4gICAgfSgpKTtcclxuICAgIEFuaW1hbHMuQW5pbWFsQnVpbGRlciA9IEFuaW1hbEJ1aWxkZXI7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgQW5pbWFsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBBbmltYWwocGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXVzY3VsYXIgPSBwYXJhbXNbQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLm11c2N1bGFyXTtcclxuICAgICAgICAgICAgdGhpcy5jaXJjdWxhdG9yeSA9IHBhcmFtc1tBbmltYWxzLlN5c3RlbXMuU3lzdGVtVHlwZXMuY2lyY3VsYXRvcnldO1xyXG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRpb24gPSBwYXJhbXNbQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLm5hdmlnYXRpb25dO1xyXG4gICAgICAgICAgICB0aGlzLm11c2N1bGFyLl9saW5rVG9BbmltYWwgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmNpcmN1bGF0b3J5Ll9saW5rVG9BbmltYWwgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRpb24uX2xpbmtUb0FuaW1hbCA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcIm11c2N1bGFyXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbXVzY3VsYXI7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tdXNjdWxhciA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQW5pbWFsLnByb3RvdHlwZSwgXCJjaXJjdWxhdG9yeVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NpcmN1bGF0b3J5O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2lyY3VsYXRvcnkgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFuaW1hbC5wcm90b3R5cGUsIFwibmF2aWdhdGlvblwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hdmlnYXRpb247XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYXZpZ2F0aW9uID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcImNvbW11bmljYXRvclwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW11bmljYXRvcjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW11bmljYXRvciA9IHBhcmFtO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQW5pbWFsLnByb3RvdHlwZSwgXCJzdGF0ZU1hY2hpbmVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZU1hY2hpbmU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZU1hY2hpbmUgPSBwYXJhbTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFuaW1hbC5wcm90b3R5cGUsIFwiaWRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gcGFyYW07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcIm5hbWVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHBhcmFtO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBBbmltYWwucHJvdG90eXBlLm1vdmVUb1BvaW50ID0gZnVuY3Rpb24gKHBvaW50KSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWwucHJvdG90eXBlLnJ1bkxpZmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZU1hY2hpbmUucnVuKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWwucHJvdG90eXBlLmdldENoYXJhY3RlcmlzdGljcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0KHQutC+0YDQvtGB0YLRjCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDg5LFxyXG4gICAgICAgICAgICAgICAgICAgIHVuaXQ6ICfQvC/RgScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfQktC+0LfRgNCw0YHRgicsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuaXQ6ICfQu9C10YInLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0JLQtdGBJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdDogJ9C60LMnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0JLRi9C90L7RgdC70LjQstC+0YHRgtGMJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdDogJ9C10LQuJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9Ch0LjRgdGC0LXQvNCwINC60YDQvtCy0L7QvtCx0YDQsNGJ0LXQvdC40Y8nLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA4OSxcclxuICAgICAgICAgICAgICAgICAgICB1bml0OiAnJScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfQodC40YHRgtC10LzQsCDQv9Cw0LzRj9GC0LgnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA1OSxcclxuICAgICAgICAgICAgICAgICAgICB1bml0OiAnJScsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfQodC40YHRgtC10LzQsCDQtNGL0YXQsNC90LjRjycsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDg5LFxyXG4gICAgICAgICAgICAgICAgICAgIHVuaXQ6ICclJyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWUsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGU6ICfQkdC10LPRgycsXHJcbiAgICAgICAgICAgICAgICBwYXJhbTogcGFyYW1zLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIEFuaW1hbDtcclxuICAgIH0oKSk7XHJcbiAgICBBbmltYWxzLkFuaW1hbCA9IEFuaW1hbDtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBDb21tdW5pY2F0aW9ucztcclxuICAgIChmdW5jdGlvbiAoQ29tbXVuaWNhdGlvbnMpIHtcclxuICAgICAgICB2YXIgQnVpbGRlcnM7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChCdWlsZGVycykge1xyXG4gICAgICAgICAgICB2YXIgQ29tbXVuaWNhdG9yQnVpbGRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBDb21tdW5pY2F0b3JCdWlsZGVyKHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjYWxlcyA9IHNjYWxlcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb21tdW5pY2F0b3IgPSBuZXcgQ29tbXVuaWNhdGlvbnMuQ29tbXVuaWNhdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yeUZ1bmN0aW9uID0gQW5pbWFscy5GdW5jdGlvbnMuRmFjdG9yaWVzLkZ1bmN0aW9uRmFjdG9yeS5pbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQ29tbXVuaWNhdG9yQnVpbGRlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbS5saW5rLmZvckVhY2goZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBjb21tdW5pY2F0aW9uLnR5cGUsIGJlaGF2aW9yID0gY29tbXVuaWNhdGlvbi5iZWhhdmlvciwgZnVuY3Rpb25zID0gY29tbXVuaWNhdGlvbi5mdW5jdGlvbnMsIHBhcmFtcyA9IGNvbW11bmljYXRpb24ucGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSBfdGhpcy5fc2NhbGVzW3R5cGVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnVuID0gX3RoaXMuX2NyZWF0ZUZ1bmN0aW9uKGZ1bmN0aW9ucywgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2NvbW11bmljYXRvci5hZGRMaW5rKHBhcmFtLnR5cGUsIHsgc2NhbGU6IHNjYWxlLCBiZWhhdmlvcjogYmVoYXZpb3IsIGZ1bjogZnVuIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZS5jb21tdW5pY2F0b3IgPSBfdGhpcy5fY29tbXVuaWNhdG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIENvbW11bmljYXRvckJ1aWxkZXIucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb21tdW5pY2F0b3I7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgQ29tbXVuaWNhdG9yQnVpbGRlci5wcm90b3R5cGUuX2NyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24gKHR5cGUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mYWN0b3J5RnVuY3Rpb24uY3JlYXRlKHR5cGUsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbW11bmljYXRvckJ1aWxkZXI7XHJcbiAgICAgICAgICAgIH0oKSk7XHJcbiAgICAgICAgICAgIEJ1aWxkZXJzLkNvbW11bmljYXRvckJ1aWxkZXIgPSBDb21tdW5pY2F0b3JCdWlsZGVyO1xyXG4gICAgICAgIH0pKEJ1aWxkZXJzID0gQ29tbXVuaWNhdGlvbnMuQnVpbGRlcnMgfHwgKENvbW11bmljYXRpb25zLkJ1aWxkZXJzID0ge30pKTtcclxuICAgIH0pKENvbW11bmljYXRpb25zID0gQW5pbWFscy5Db21tdW5pY2F0aW9ucyB8fCAoQW5pbWFscy5Db21tdW5pY2F0aW9ucyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgQ29tbXVuaWNhdGlvbnM7XHJcbiAgICAoZnVuY3Rpb24gKENvbW11bmljYXRpb25zKSB7XHJcbiAgICAgICAgdmFyIENvbW11bmljYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIENvbW11bmljYXRvcigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25ldExpbmtzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZW5zaXRpdml0eSA9IDAuMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29tbXVuaWNhdG9yLnByb3RvdHlwZSwgXCJzZW5zaXRpdml0eVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Vuc2l0aXZpdHk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZW5zaXRpdml0eSA9IHBhcmFtID8gcGFyYW0gOiAwLjE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgQ29tbXVuaWNhdG9yLnByb3RvdHlwZS5zZXR0aW5nID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5zaXRpdml0eSA9IHBhcmFtcy5zZW5zaXRpdml0eSB8fCAwLjE7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENvbW11bmljYXRvci5wcm90b3R5cGUuYWRkTGluayA9IGZ1bmN0aW9uIChldmVudCwgbGluaykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX25ldExpbmtzW2V2ZW50XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25ldExpbmtzW2V2ZW50XS5wdXNoKGxpbmspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV0TGlua3NbZXZlbnRdID0gW2xpbmtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDb21tdW5pY2F0b3IucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbiAocGFjaywgcGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlua3MgPSB0aGlzLl9uZXRMaW5rc1twYWNrLnR5cGVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpbmtzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVsdGEgPSBsaW5rLmZ1bi5jYWxjdWxhdGUocGFyYW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGVsdGEpID4gX3RoaXMuX3NlbnNpdGl2aXR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YSA9IHBhY2suYmVoYXZpb3IgPT09IGxpbmsuYmVoYXZpb3IgPyBkZWx0YSA6IC1kZWx0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2NhbGUuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tbXVuaWNhdG9yO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgQ29tbXVuaWNhdGlvbnMuQ29tbXVuaWNhdG9yID0gQ29tbXVuaWNhdG9yO1xyXG4gICAgfSkoQ29tbXVuaWNhdGlvbnMgPSBBbmltYWxzLkNvbW11bmljYXRpb25zIHx8IChBbmltYWxzLkNvbW11bmljYXRpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBDb21tdW5pY2F0aW9ucztcclxuICAgIChmdW5jdGlvbiAoQ29tbXVuaWNhdGlvbnMpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKEJlaGF2aW9yU2NhbGVUeXBlcykge1xyXG4gICAgICAgICAgICBCZWhhdmlvclNjYWxlVHlwZXNbQmVoYXZpb3JTY2FsZVR5cGVzW1wiaW5jcmVhc2VcIl0gPSAxXSA9IFwiaW5jcmVhc2VcIjtcclxuICAgICAgICAgICAgQmVoYXZpb3JTY2FsZVR5cGVzW0JlaGF2aW9yU2NhbGVUeXBlc1tcImRlY3JlYXNlXCJdID0gMl0gPSBcImRlY3JlYXNlXCI7XHJcbiAgICAgICAgfSkoQ29tbXVuaWNhdGlvbnMuQmVoYXZpb3JTY2FsZVR5cGVzIHx8IChDb21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMgPSB7fSkpO1xyXG4gICAgICAgIHZhciBCZWhhdmlvclNjYWxlVHlwZXMgPSBDb21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXM7XHJcbiAgICB9KShDb21tdW5pY2F0aW9ucyA9IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMgfHwgKEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEZ1bmN0aW9ucztcclxuICAgIChmdW5jdGlvbiAoRnVuY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIEZhY3RvcmllcztcclxuICAgICAgICAoZnVuY3Rpb24gKEZhY3Rvcmllcykge1xyXG4gICAgICAgICAgICB2YXIgRnVuY3Rpb25GYWN0b3J5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIEZ1bmN0aW9uRmFjdG9yeSgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbRnVuY3Rpb25zLkZ1bmN0aW9uVHlwZXMubGluZV0gPSBGdW5jdGlvbnMuTGluZUZ1bmN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tGdW5jdGlvbnMuRnVuY3Rpb25UeXBlcy5xdWFkcmF0aWNdID0gRnVuY3Rpb25zLlF1YWRyYXRpY0Z1bmN0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgRnVuY3Rpb25GYWN0b3J5Lmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgRnVuY3Rpb25GYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBGdW5jdGlvbkZhY3RvcnkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0eXBlLCBzeXN0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbdHlwZV0gPSBzeXN0ZW07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgRnVuY3Rpb25GYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoZnVuY3Rpb25UeXBlLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMuX2ZhY3Rvcmllc1tmdW5jdGlvblR5cGVdKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uRmFjdG9yeTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgRmFjdG9yaWVzLkZ1bmN0aW9uRmFjdG9yeSA9IEZ1bmN0aW9uRmFjdG9yeTtcclxuICAgICAgICB9KShGYWN0b3JpZXMgPSBGdW5jdGlvbnMuRmFjdG9yaWVzIHx8IChGdW5jdGlvbnMuRmFjdG9yaWVzID0ge30pKTtcclxuICAgIH0pKEZ1bmN0aW9ucyA9IEFuaW1hbHMuRnVuY3Rpb25zIHx8IChBbmltYWxzLkZ1bmN0aW9ucyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgRnVuY3Rpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChGdW5jdGlvbnMpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKEZ1bmN0aW9uVHlwZXMpIHtcclxuICAgICAgICAgICAgRnVuY3Rpb25UeXBlc1tGdW5jdGlvblR5cGVzW1wibGluZVwiXSA9IDFdID0gXCJsaW5lXCI7XHJcbiAgICAgICAgICAgIEZ1bmN0aW9uVHlwZXNbRnVuY3Rpb25UeXBlc1tcInF1YWRyYXRpY1wiXSA9IDJdID0gXCJxdWFkcmF0aWNcIjtcclxuICAgICAgICB9KShGdW5jdGlvbnMuRnVuY3Rpb25UeXBlcyB8fCAoRnVuY3Rpb25zLkZ1bmN0aW9uVHlwZXMgPSB7fSkpO1xyXG4gICAgICAgIHZhciBGdW5jdGlvblR5cGVzID0gRnVuY3Rpb25zLkZ1bmN0aW9uVHlwZXM7XHJcbiAgICB9KShGdW5jdGlvbnMgPSBBbmltYWxzLkZ1bmN0aW9ucyB8fCAoQW5pbWFscy5GdW5jdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEZ1bmN0aW9ucztcclxuICAgIChmdW5jdGlvbiAoRnVuY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIExpbmVGdW5jdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIExpbmVGdW5jdGlvbihwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvZWZmaWNpZW50ID0gcGFyYW1zWzBdIHx8IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmVlID0gcGFyYW1zWzFdIHx8IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExpbmVGdW5jdGlvbi5wcm90b3R5cGUsIFwiY29lZmZpY2llbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvZWZmaWNpZW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnQgPSBwYXJhbSA/IHBhcmFtIDogMDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTGluZUZ1bmN0aW9uLnByb3RvdHlwZSwgXCJmcmVlXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcmVlO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJlZSA9IHBhcmFtID8gcGFyYW0gOiAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIExpbmVGdW5jdGlvbi5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnQgKiBwYXJhbSArIHRoaXMuX2ZyZWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBMaW5lRnVuY3Rpb247XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBGdW5jdGlvbnMuTGluZUZ1bmN0aW9uID0gTGluZUZ1bmN0aW9uO1xyXG4gICAgfSkoRnVuY3Rpb25zID0gQW5pbWFscy5GdW5jdGlvbnMgfHwgKEFuaW1hbHMuRnVuY3Rpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBGdW5jdGlvbnM7XHJcbiAgICAoZnVuY3Rpb24gKEZ1bmN0aW9ucykge1xyXG4gICAgICAgIHZhciBRdWFkcmF0aWNGdW5jdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFF1YWRyYXRpY0Z1bmN0aW9uKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnRBID0gcGFyYW1zWzBdIHx8IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2VmZmljaWVudEIgPSBwYXJhbXNbMV0gfHwgMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyZWUgPSBwYXJhbXNbMl0gfHwgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUXVhZHJhdGljRnVuY3Rpb24ucHJvdG90eXBlLCBcImNvZWZmaWNpZW50QVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnRBO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnRBID0gcGFyYW0gPyBwYXJhbSA6IDA7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFF1YWRyYXRpY0Z1bmN0aW9uLnByb3RvdHlwZSwgXCJjb2VmZmljaWVudEJcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvZWZmaWNpZW50QjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvZWZmaWNpZW50QiA9IHBhcmFtID8gcGFyYW0gOiAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRdWFkcmF0aWNGdW5jdGlvbi5wcm90b3R5cGUsIFwiZnJlZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJlZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZyZWUgPSBwYXJhbSA/IHBhcmFtIDogMDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBRdWFkcmF0aWNGdW5jdGlvbi5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnRBICogKE1hdGgucG93KHBhcmFtLCAyKSkgKyB0aGlzLl9jb2VmZmljaWVudEIgKiBwYXJhbSArIHRoaXMuX2ZyZWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBRdWFkcmF0aWNGdW5jdGlvbjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIEZ1bmN0aW9ucy5RdWFkcmF0aWNGdW5jdGlvbiA9IFF1YWRyYXRpY0Z1bmN0aW9uO1xyXG4gICAgfSkoRnVuY3Rpb25zID0gQW5pbWFscy5GdW5jdGlvbnMgfHwgKEFuaW1hbHMuRnVuY3Rpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTY2FsZXM7XHJcbiAgICAoZnVuY3Rpb24gKFNjYWxlcykge1xyXG4gICAgICAgIHZhciBBU2NhbGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBBU2NhbGUoKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFTY2FsZS5wcm90b3R5cGUsIFwibmFtZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJtaW5cIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pbjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21pbiA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGVyY2VudGFnZUluU2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJtYXhcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21heCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGVyY2VudGFnZUluU2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJjdXJyZW50XCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGVyY2VudGFnZUluU2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJwZXJjZW50XCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJjZW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGVyY2VudCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFZhbHVlT25TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcInR5cGVcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgQVNjYWxlLnByb3RvdHlwZS5nZXRQZXJjZW50YWdlSW5TY2FsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmNlbnQgPSAoKHRoaXMuX2N1cnJlbnQgLSB0aGlzLl9taW4pICogMTAwKSAvICh0aGlzLl9tYXggLSB0aGlzLl9taW4pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBBU2NhbGUucHJvdG90eXBlLmdldEN1cnJlbnRWYWx1ZU9uU2NhbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gKCgodGhpcy5fbWF4IC0gdGhpcy5fbWluKSAvIDEwMCkgKiB0aGlzLl9wZXJjZW50KSArIHRoaXMuX21pbjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIEFTY2FsZTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFNjYWxlcy5BU2NhbGUgPSBBU2NhbGU7XHJcbiAgICB9KShTY2FsZXMgPSBBbmltYWxzLlNjYWxlcyB8fCAoQW5pbWFscy5TY2FsZXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFNjYWxlcztcclxuICAgIChmdW5jdGlvbiAoU2NhbGVzKSB7XHJcbiAgICAgICAgdmFyIEZhY3RvcmllcztcclxuICAgICAgICAoZnVuY3Rpb24gKEZhY3Rvcmllcykge1xyXG4gICAgICAgICAgICB2YXIgU2NhbGVGYWN0b3J5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFNjYWxlRmFjdG9yeSgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU2NhbGVzLlNjYWxlVHlwZXMuc3lzdGVtXSA9IEFuaW1hbHMuU2NhbGVzLlR5cGVTY2FsZXMuU3lzdGVtU2NhbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1NjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50XSA9IEFuaW1hbHMuU2NhbGVzLlR5cGVTY2FsZXMuQXJndW1lbnRTY2FsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFNjYWxlRmFjdG9yeS5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IFNjYWxlRmFjdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgU2NhbGVGYWN0b3J5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodHlwZSwgc3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW3R5cGVdID0gc3lzdGVtO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFNjYWxlRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGZ1bmN0aW9uVHlwZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLl9mYWN0b3JpZXNbZnVuY3Rpb25UeXBlXShwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTY2FsZUZhY3Rvcnk7XHJcbiAgICAgICAgICAgIH0oKSk7XHJcbiAgICAgICAgICAgIEZhY3Rvcmllcy5TY2FsZUZhY3RvcnkgPSBTY2FsZUZhY3Rvcnk7XHJcbiAgICAgICAgfSkoRmFjdG9yaWVzID0gU2NhbGVzLkZhY3RvcmllcyB8fCAoU2NhbGVzLkZhY3RvcmllcyA9IHt9KSk7XHJcbiAgICB9KShTY2FsZXMgPSBBbmltYWxzLlNjYWxlcyB8fCAoQW5pbWFscy5TY2FsZXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFNjYWxlcztcclxuICAgIChmdW5jdGlvbiAoU2NhbGVzKSB7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChQYXJhbWV0ZXJTY2FsZVR5cGVzKSB7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInN0YXRlXCJdID0gMV0gPSBcInN0YXRlXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInNwZWVkXCJdID0gMl0gPSBcInNwZWVkXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcIndlaWdodFwiXSA9IDNdID0gXCJ3ZWlnaHRcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wiaGVhcnRiZWF0XCJdID0gNF0gPSBcImhlYXJ0YmVhdFwiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJwcmVzc3VyZVwiXSA9IDVdID0gXCJwcmVzc3VyZVwiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJhbW91bnRQb2ludFJlbWVtYmVyV2F0ZXJcIl0gPSA2XSA9IFwiYW1vdW50UG9pbnRSZW1lbWJlcldhdGVyXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcImFtb3VudFBvaW50UmVtZW1iZXJHcmFzc1wiXSA9IDddID0gXCJhbW91bnRQb2ludFJlbWVtYmVyR3Jhc3NcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wiYW1vdW50UG9pbnRSZW1lbWJlck1lYXRcIl0gPSA4XSA9IFwiYW1vdW50UG9pbnRSZW1lbWJlck1lYXRcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wic3BlZWRTYXZ2eVwiXSA9IDldID0gXCJzcGVlZFNhdnZ5XCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInJhZGl1c1Zpc2lvblwiXSA9IDEwXSA9IFwicmFkaXVzVmlzaW9uXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInJhZGl1c0hlYXJpbmdcIl0gPSAxMV0gPSBcInJhZGl1c0hlYXJpbmdcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wicmFkaXVzU21lbGxcIl0gPSAxMl0gPSBcInJhZGl1c1NtZWxsXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInJhZGl1c1RvdWNoXCJdID0gMTNdID0gXCJyYWRpdXNUb3VjaFwiO1xyXG4gICAgICAgIH0pKFNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzIHx8IChTY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcyA9IHt9KSk7XHJcbiAgICAgICAgdmFyIFBhcmFtZXRlclNjYWxlVHlwZXMgPSBTY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcztcclxuICAgIH0pKFNjYWxlcyA9IEFuaW1hbHMuU2NhbGVzIHx8IChBbmltYWxzLlNjYWxlcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU2NhbGVzO1xyXG4gICAgKGZ1bmN0aW9uIChTY2FsZXMpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKFNjYWxlVHlwZXMpIHtcclxuICAgICAgICAgICAgU2NhbGVUeXBlc1tTY2FsZVR5cGVzW1wic3lzdGVtXCJdID0gMF0gPSBcInN5c3RlbVwiO1xyXG4gICAgICAgICAgICBTY2FsZVR5cGVzW1NjYWxlVHlwZXNbXCJhcmd1bWVudFwiXSA9IDFdID0gXCJhcmd1bWVudFwiO1xyXG4gICAgICAgIH0pKFNjYWxlcy5TY2FsZVR5cGVzIHx8IChTY2FsZXMuU2NhbGVUeXBlcyA9IHt9KSk7XHJcbiAgICAgICAgdmFyIFNjYWxlVHlwZXMgPSBTY2FsZXMuU2NhbGVUeXBlcztcclxuICAgIH0pKFNjYWxlcyA9IEFuaW1hbHMuU2NhbGVzIHx8IChBbmltYWxzLlNjYWxlcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU2NhbGVzO1xyXG4gICAgKGZ1bmN0aW9uIChTY2FsZXMpIHtcclxuICAgICAgICB2YXIgVHlwZVNjYWxlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFR5cGVTY2FsZXMpIHtcclxuICAgICAgICAgICAgdmFyIEFyZ3VtZW50U2NhbGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICAgICAgX19leHRlbmRzKEFyZ3VtZW50U2NhbGUsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBBcmd1bWVudFNjYWxlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSBwYXJhbXMubmFtZSB8fCBcIk5vIG5hbWVcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9taW4gPSBwYXJhbXMubWluIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4ID0gcGFyYW1zLm1heCB8fCAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHBhcmFtcy5jdXJyZW50IHx8IHRoaXMuX21heDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNwb25zZURlbGF5ID0gcGFyYW1zLnJlc3BvbnNlRGVsYXkgfHwgMTAwMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gcGFyYW1zLnR5cGUgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFBlcmNlbnRhZ2VJblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJndW1lbnRTY2FsZS5wcm90b3R5cGUsIFwicmVzcG9uc2VEZWxheVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZURlbGF5O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzcG9uc2VEZWxheSA9IHBhcmFtID8gcGFyYW0gOiAxMDAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFyZ3VtZW50U2NhbGUucHJvdG90eXBlLCBcImNvbW11bmljYXRvclwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb21tdW5pY2F0b3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb21tdW5pY2F0b3IgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIEFyZ3VtZW50U2NhbGUucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gKHBhcmFtcyA+IDApID8gQW5pbWFscy5Db21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMuaW5jcmVhc2UgOiBBbmltYWxzLkNvbW11bmljYXRpb25zLkJlaGF2aW9yU2NhbGVUeXBlcy5kZWNyZWFzZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFjayA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6IGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLl90eXBlXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb21tdW5pY2F0b3IucHVibGlzaChwYWNrLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIEFyZ3VtZW50U2NhbGUucHJvdG90eXBlLmNoYW5nZSA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJleiA9IHRoaXMucGVyY2VudCArIGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXogPD0gMTAwICYmIHJleiA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IHJlejtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VmFsdWVPblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy50cmlnZ2VyKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLnJlc3BvbnNlRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcmd1bWVudFNjYWxlO1xyXG4gICAgICAgICAgICB9KFNjYWxlcy5BU2NhbGUpKTtcclxuICAgICAgICAgICAgVHlwZVNjYWxlcy5Bcmd1bWVudFNjYWxlID0gQXJndW1lbnRTY2FsZTtcclxuICAgICAgICB9KShUeXBlU2NhbGVzID0gU2NhbGVzLlR5cGVTY2FsZXMgfHwgKFNjYWxlcy5UeXBlU2NhbGVzID0ge30pKTtcclxuICAgIH0pKFNjYWxlcyA9IEFuaW1hbHMuU2NhbGVzIHx8IChBbmltYWxzLlNjYWxlcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU2NhbGVzO1xyXG4gICAgKGZ1bmN0aW9uIChTY2FsZXMpIHtcclxuICAgICAgICB2YXIgVHlwZVNjYWxlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFR5cGVTY2FsZXMpIHtcclxuICAgICAgICAgICAgdmFyIFN5c3RlbVNjYWxlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgICAgIF9fZXh0ZW5kcyhTeXN0ZW1TY2FsZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFN5c3RlbVNjYWxlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSBwYXJhbXMubmFtZSB8fCBcIk5vIG5hbWVcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9taW4gPSBwYXJhbXMubWluIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4ID0gcGFyYW1zLm1heCB8fCAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHBhcmFtcy5jdXJyZW50IHx8IHRoaXMuX21heDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gcGFyYW1zLnR5cGUgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFBlcmNlbnRhZ2VJblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW1TY2FsZS5wcm90b3R5cGUuYW5hbHlzaXMgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJleiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJleiArPSBwYXJhbS5wZXJjZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IHJleiAvIHBhcmFtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VmFsdWVPblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFN5c3RlbVNjYWxlO1xyXG4gICAgICAgICAgICB9KFNjYWxlcy5BU2NhbGUpKTtcclxuICAgICAgICAgICAgVHlwZVNjYWxlcy5TeXN0ZW1TY2FsZSA9IFN5c3RlbVNjYWxlO1xyXG4gICAgICAgIH0pKFR5cGVTY2FsZXMgPSBTY2FsZXMuVHlwZVNjYWxlcyB8fCAoU2NhbGVzLlR5cGVTY2FsZXMgPSB7fSkpO1xyXG4gICAgfSkoU2NhbGVzID0gQW5pbWFscy5TY2FsZXMgfHwgKEFuaW1hbHMuU2NhbGVzID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIEZhY3RvcmllcztcclxuICAgICAgICAoZnVuY3Rpb24gKEZhY3Rvcmllcykge1xyXG4gICAgICAgICAgICB2YXIgU3lzdGVtRmFjdG9yeSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBTeXN0ZW1GYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tTeXN0ZW1zLlN5c3RlbVR5cGVzLm11c2N1bGFyXSA9IEFuaW1hbHMuU3lzdGVtcy5UeXBlU3lzdGVtcy5NdXNjdWxhcjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeV0gPSBBbmltYWxzLlN5c3RlbXMuVHlwZVN5c3RlbXMuQ2lyY3VsYXRvcnk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1N5c3RlbXMuU3lzdGVtVHlwZXMubmF2aWdhdGlvbl0gPSBBbmltYWxzLlN5c3RlbXMuVHlwZVN5c3RlbXMuTmF2aWdhdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFN5c3RlbUZhY3RvcnkuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBTeXN0ZW1GYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW1GYWN0b3J5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodHlwZSwgc3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW3R5cGVdID0gc3lzdGVtO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFN5c3RlbUZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChmdW5jdGlvblR5cGUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy5fZmFjdG9yaWVzW2Z1bmN0aW9uVHlwZV0ocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU3lzdGVtRmFjdG9yeTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgRmFjdG9yaWVzLlN5c3RlbUZhY3RvcnkgPSBTeXN0ZW1GYWN0b3J5O1xyXG4gICAgICAgIH0pKEZhY3RvcmllcyA9IFN5c3RlbXMuRmFjdG9yaWVzIHx8IChTeXN0ZW1zLkZhY3RvcmllcyA9IHt9KSk7XHJcbiAgICB9KShTeXN0ZW1zID0gQW5pbWFscy5TeXN0ZW1zIHx8IChBbmltYWxzLlN5c3RlbXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN5c3RlbXM7XHJcbiAgICAoZnVuY3Rpb24gKFN5c3RlbXMpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKFN5c3RlbVR5cGVzKSB7XHJcbiAgICAgICAgICAgIFN5c3RlbVR5cGVzW1N5c3RlbVR5cGVzW1wibXVzY3VsYXJcIl0gPSAxXSA9IFwibXVzY3VsYXJcIjtcclxuICAgICAgICAgICAgU3lzdGVtVHlwZXNbU3lzdGVtVHlwZXNbXCJjaXJjdWxhdG9yeVwiXSA9IDJdID0gXCJjaXJjdWxhdG9yeVwiO1xyXG4gICAgICAgICAgICBTeXN0ZW1UeXBlc1tTeXN0ZW1UeXBlc1tcIm1lbW9yeVwiXSA9IDNdID0gXCJtZW1vcnlcIjtcclxuICAgICAgICAgICAgU3lzdGVtVHlwZXNbU3lzdGVtVHlwZXNbXCJuYXZpZ2F0aW9uXCJdID0gNF0gPSBcIm5hdmlnYXRpb25cIjtcclxuICAgICAgICB9KShTeXN0ZW1zLlN5c3RlbVR5cGVzIHx8IChTeXN0ZW1zLlN5c3RlbVR5cGVzID0ge30pKTtcclxuICAgICAgICB2YXIgU3lzdGVtVHlwZXMgPSBTeXN0ZW1zLlN5c3RlbVR5cGVzO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIFR5cGVTeXN0ZW1zO1xyXG4gICAgICAgIChmdW5jdGlvbiAoVHlwZVN5c3RlbXMpIHtcclxuICAgICAgICAgICAgdmFyIENpcmN1bGF0b3J5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIENpcmN1bGF0b3J5KHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zdGF0ZV0gfHwgbmV3IEFuaW1hbHMuU2NhbGVzLlR5cGVTY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYXJ0YmVhdCA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLmhlYXJ0YmVhdF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc3VyZSA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnByZXNzdXJlXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDaXJjdWxhdG9yeS5wcm90b3R5cGUsIFwiaGVhcnRiZWF0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlYXJ0YmVhdDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDaXJjdWxhdG9yeS5wcm90b3R5cGUsIFwicHJlc3N1cmVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJlc3N1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXNzdXJlID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIENpcmN1bGF0b3J5LnByb3RvdHlwZS5jaGFuZ2VIZWFydGJlYXQgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXQuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgQ2lyY3VsYXRvcnkucHJvdG90eXBlLmNoYW5nZVByZXNzdXJlID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJlc3N1cmUuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgQ2lyY3VsYXRvcnkucHJvdG90eXBlLmFuYWx5c2lzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuYW5hbHlzaXMoW10pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBDaXJjdWxhdG9yeTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgVHlwZVN5c3RlbXMuQ2lyY3VsYXRvcnkgPSBDaXJjdWxhdG9yeTtcclxuICAgICAgICB9KShUeXBlU3lzdGVtcyA9IFN5c3RlbXMuVHlwZVN5c3RlbXMgfHwgKFN5c3RlbXMuVHlwZVN5c3RlbXMgPSB7fSkpO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIFR5cGVTeXN0ZW1zO1xyXG4gICAgICAgIChmdW5jdGlvbiAoVHlwZVN5c3RlbXMpIHtcclxuICAgICAgICAgICAgdmFyIE11c2N1bGFyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIE11c2N1bGFyKHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zdGF0ZV0gfHwgbmV3IEFuaW1hbHMuU2NhbGVzLlR5cGVTY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWlnaHQgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy53ZWlnaHRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE11c2N1bGFyLnByb3RvdHlwZSwgXCJzcGVlZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BlZWQgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE11c2N1bGFyLnByb3RvdHlwZSwgXCJ3ZWlnaHRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl93ZWlnaHQgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE11c2N1bGFyLnByb3RvdHlwZSwgXCJjdXJyZW50UG9pbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFBvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFBvaW50LnggPSBwYXJhbS54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50UG9pbnQueSA9IHBhcmFtLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBNdXNjdWxhci5wcm90b3R5cGUuY2hhbmdlU3BlZWQgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGVlZC5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBNdXNjdWxhci5wcm90b3R5cGUuY2hhbmdlV2VpZ2h0ID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2VpZ2h0LmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmFseXNpcygpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIE11c2N1bGFyLnByb3RvdHlwZS5hbmFseXNpcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmFuYWx5c2lzKFtdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTXVzY3VsYXI7XHJcbiAgICAgICAgICAgIH0oKSk7XHJcbiAgICAgICAgICAgIFR5cGVTeXN0ZW1zLk11c2N1bGFyID0gTXVzY3VsYXI7XHJcbiAgICAgICAgfSkoVHlwZVN5c3RlbXMgPSBTeXN0ZW1zLlR5cGVTeXN0ZW1zIHx8IChTeXN0ZW1zLlR5cGVTeXN0ZW1zID0ge30pKTtcclxuICAgIH0pKFN5c3RlbXMgPSBBbmltYWxzLlN5c3RlbXMgfHwgKEFuaW1hbHMuU3lzdGVtcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3lzdGVtcztcclxuICAgIChmdW5jdGlvbiAoU3lzdGVtcykge1xyXG4gICAgICAgIHZhciBUeXBlU3lzdGVtcztcclxuICAgICAgICAoZnVuY3Rpb24gKFR5cGVTeXN0ZW1zKSB7XHJcbiAgICAgICAgICAgIHZhciBOYXZpZ2F0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIE5hdmlnYXRpb24oc2NhbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnN0YXRlXSB8fCBuZXcgQW5pbWFscy5TY2FsZXMuVHlwZVNjYWxlcy5TeXN0ZW1TY2FsZShbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVlZFNhdnZ5ID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuc3BlZWRTYXZ2eV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYWRpdXNIZWFyaW5nID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzSGVhcmluZ107XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYWRpdXNTbWVsbCA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnJhZGl1c1NtZWxsXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c1Zpc2lvbiA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnJhZGl1c1Zpc2lvbl07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYWRpdXNUb3VjaCA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnJhZGl1c1RvdWNoXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXZpZ2F0aW9uLnByb3RvdHlwZSwgXCJzcGVlZFNhdnZ5XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwZWVkU2F2dnk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwZWVkU2F2dnkgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdmlnYXRpb24ucHJvdG90eXBlLCBcInJhZGl1c1Zpc2lvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYWRpdXNWaXNpb247XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c1Zpc2lvbiA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmF2aWdhdGlvbi5wcm90b3R5cGUsIFwicmFkaXVzSGVhcmluZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYWRpdXNIZWFyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNIZWFyaW5nID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXZpZ2F0aW9uLnByb3RvdHlwZSwgXCJyYWRpdXNTbWVsbFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYWRpdXNTbWVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzU21lbGwgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdmlnYXRpb24ucHJvdG90eXBlLCBcInJhZGl1c1RvdWNoXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhZGl1c1RvdWNoO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNUb3VjaCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBOYXZpZ2F0aW9uLnByb3RvdHlwZS5jaGFuZ2VTcGVlZFNhdnZ5ID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BlZWRTYXZ2eS5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBOYXZpZ2F0aW9uLnByb3RvdHlwZS5jaGFuZ2VSYWRpdXNWaXNpb24gPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNWaXNpb24uY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgTmF2aWdhdGlvbi5wcm90b3R5cGUuY2hhbmdlUmFkaXVzSGVhcmluZyA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c0hlYXJpbmcuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgTmF2aWdhdGlvbi5wcm90b3R5cGUuY2hhbmdlUmFkaXVzU21lbGwgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNTbWVsbC5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBOYXZpZ2F0aW9uLnByb3RvdHlwZS5jaGFuZ2VSYWRpdXNUb3VjaCA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c1RvdWNoLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmFseXNpcygpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmFuYWx5c2lzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuYW5hbHlzaXMoW10pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBOYXZpZ2F0aW9uO1xyXG4gICAgICAgICAgICB9KCkpO1xyXG4gICAgICAgICAgICBUeXBlU3lzdGVtcy5OYXZpZ2F0aW9uID0gTmF2aWdhdGlvbjtcclxuICAgICAgICB9KShUeXBlU3lzdGVtcyA9IFN5c3RlbXMuVHlwZVN5c3RlbXMgfHwgKFN5c3RlbXMuVHlwZVN5c3RlbXMgPSB7fSkpO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBUElDb3JlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEFQSUNvcmUoKSB7XHJcbiAgICB9XHJcbiAgICBBUElDb3JlLmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbnN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdCA9IG5ldyBBUElDb3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3Q7XHJcbiAgICB9O1xyXG4gICAgQVBJQ29yZS5wcm90b3R5cGUuY3JlYXRlQW5pbWFsID0gZnVuY3Rpb24gKHB1dFRvTW9kZWwsIGlkKSB7XHJcbiAgICAgICAgdmFyIGZhY3RvcnkgPSBBbmltYWxzLkFuaW1hbEJ1aWxkZXIuaW5zdGFuY2UoKTtcclxuICAgICAgICB2YXIgYW5pbWFsID0gZmFjdG9yeS5jcmVhdGUobGlvbik7XHJcbiAgICAgICAgYW5pbWFsLmlkID0gaWQ7XHJcbiAgICAgICAgcmV0dXJuIGFuaW1hbDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQVBJQ29yZTtcclxufSgpKTtcclxudmFyIE1hcDtcclxuKGZ1bmN0aW9uIChNYXBfMSkge1xyXG4gICAgdmFyIE1hcCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gTWFwKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBNYXAuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5faW5zdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zdCA9IG5ldyBNYXAoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5zdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcIndvcmxkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dvcmxkID0gbWFwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemF0aW9uV29ybGQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV29ybGQgd2FzIG5vdCBmb3VuZC4uLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWFwLnByb3RvdHlwZSwgXCJvYnN0YWNsZXNMYXllclwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vYnN0YWNsZXNMYXllciA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXllciBvYnN0YWNsZSB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcIndhdGVyTGF5ZXJcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChsYXllcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2F0ZXJMYXllciA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXllciB3YXRlciB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcInRyZWVMYXllclwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmVlTGF5ZXIgPSBsYXllcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTGF5ZXIgdHJlZSB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2luaXRpYWxpemF0aW9uV29ybGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemF0aW9uTGF5ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fc2l6ZU1hcFRpbGVkID0gdGhpcy5fd29ybGQuZ2V0TWFwU2l6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplVGlsZWQgPSB0aGlzLl93b3JsZC5nZXRUaWxlU2l6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplTWFwUGl4ZWwgPSB0aGlzLl9nZXRTaXplTWFwUGl4ZWwoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2luaXRpYWxpemF0aW9uTGF5ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzdGFjbGVzTGF5ZXIgPSB0aGlzLl93b3JsZC5nZXRMYXllcignb2JzdGFjbGUnKTtcclxuICAgICAgICAgICAgdGhpcy53YXRlckxheWVyID0gdGhpcy5fd29ybGQuZ2V0TGF5ZXIoJ3dhdGVyJyk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZUxheWVyID0gdGhpcy5fd29ybGQuZ2V0TGF5ZXIoJ3RyZWUnKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2dldFNpemVNYXBQaXhlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNpemVYID0gdGhpcy5fc2l6ZU1hcFRpbGVkLndpZHRoICogdGhpcy5fc2l6ZVRpbGVkLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgc2l6ZVkgPSB0aGlzLl9zaXplTWFwVGlsZWQuaGVpZ2h0ICogdGhpcy5fc2l6ZVRpbGVkLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHNpemVYLCBzaXplWSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXAucHJvdG90eXBlLmNvbnZlcnRUaWxlZFBvcyA9IGZ1bmN0aW9uIChwb3NJblBpeGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gTWF0aC5mbG9vcigocG9zSW5QaXhlbC54KSAvIHRoaXMuX3NpemVUaWxlZC53aWR0aCk7XHJcbiAgICAgICAgICAgIHZhciB5ID0gTWF0aC5mbG9vcigodGhpcy5fc2l6ZU1hcFBpeGVsLnkgLSAocG9zSW5QaXhlbC55KSkgLyB0aGlzLl9zaXplVGlsZWQuaGVpZ2h0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5jb252ZXJ0UGl4ZWxQb3MgPSBmdW5jdGlvbiAocG9zSW5UaWxlZCkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvc0luVGlsZWQueCAqIHRoaXMuX3NpemVUaWxlZC53aWR0aCArIHRoaXMuX3NpemVUaWxlZC53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5fc2l6ZU1hcFBpeGVsLnkgLSAocG9zSW5UaWxlZC55ICogdGhpcy5fc2l6ZVRpbGVkLmhlaWdodCkgLSB0aGlzLl9zaXplVGlsZWQuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5pc0NoZdGBa09ic3RhY2xlID0gZnVuY3Rpb24gKGdpZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb3JyZWN0UG9zKGdpZCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vYnN0YWNsZXNMYXllci5nZXRUaWxlR0lEQXQoZ2lkLngsIGdpZC55KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2lzQ29ycmVjdFBvcyA9IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgICAgICAgaWYgKHBvcy54IDwgMCB8fCBwb3MueSA8IDAgfHwgcG9zLnggPiB0aGlzLl9zaXplTWFwVGlsZWQud2lkdGggLSAxIHx8IHBvcy55ID4gdGhpcy5fc2l6ZU1hcFRpbGVkLmhlaWdodCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBNYXA7XHJcbiAgICB9KCkpO1xyXG4gICAgTWFwXzEuTWFwID0gTWFwO1xyXG59KShNYXAgfHwgKE1hcCA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZV8xKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlTWFjaGluZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFN0YXRlTWFjaGluZShzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTdGF0ZU1hY2hpbmUucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5ydW4oKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIV90aGlzLl9zdGF0ZS5pc0VuZFBvaW50KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3N0YXRlID0gX3RoaXMuX3N0YXRlLmdldE5leHRTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5ydW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBpbiBzdGF0ZS4uLiAoU3RhdGVNYWNoaW5lKScpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBTdGF0ZU1hY2hpbmU7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmVfMS5TdGF0ZU1hY2hpbmUgPSBTdGF0ZU1hY2hpbmU7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFN0YXRlcykge1xyXG4gICAgICAgICAgICB2YXIgU3RhdGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gU3RhdGUobmFtZSwgbW9kZWwsIHJvdXRlRW5naW5lLCBpc0VuZFBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRW5kUG9pbnQgPT09IHZvaWQgMCkgeyBpc0VuZFBvaW50ID0gZmFsc2U7IH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JvdXRlRW5naW5lID0gcm91dGVFbmdpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNFbmRQb2ludCA9IGlzRW5kUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBTdGF0ZS5wcm90b3R5cGUuZ2V0TmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBTdGF0ZS5wcm90b3R5cGUuZ2V0TmV4dFN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fcm91dGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3V0ZSA9IHRoaXMuX3JvdXRlRW5naW5lLmdldFJvdXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlID8gcm91dGUuZ2V0U3RhdGUoKSA6IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgU3RhdGUucHJvdG90eXBlLmlzRW5kUG9pbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRW5kUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgU3RhdGUucHJvdG90eXBlLnNldFJvdXRlRW5naW5lID0gZnVuY3Rpb24gKHJvdXRlRW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm91dGVFbmdpbmUgPSByb3V0ZUVuZ2luZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yb3V0ZUVuZ2luZS5zZXRNb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgU3RhdGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkIHlldC4uLicpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFN0YXRlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCB5ZXQuLi4nKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RhdGU7XHJcbiAgICAgICAgICAgIH0oKSk7XHJcbiAgICAgICAgICAgIFN0YXRlcy5TdGF0ZSA9IFN0YXRlO1xyXG4gICAgICAgIH0pKFN0YXRlcyA9IFN0YXRlTWFjaGluZS5TdGF0ZXMgfHwgKFN0YXRlTWFjaGluZS5TdGF0ZXMgPSB7fSkpO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBTdGF0ZXM7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChTdGF0ZXMpIHtcclxuICAgICAgICAgICAgdmFyIFR5cGVzU3RhdGU7XHJcbiAgICAgICAgICAgIChmdW5jdGlvbiAoVHlwZXNTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIFBhdHRlcm5TdGF0ZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX19leHRlbmRzKFBhdHRlcm5TdGF0ZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBQYXR0ZXJuU3RhdGUobmFtZSwgbW9kZWwsIHJvdXRlRW5naW5lLCBzdGF0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZXMgPT09IHZvaWQgMCkgeyBzdGF0ZXMgPSBbXTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZXMgPSBzdGF0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFBhdHRlcm5TdGF0ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFBhdHRlcm5TdGF0ZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX3N0YXRlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUucnVuKG1vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgUGF0dGVyblN0YXRlLnByb3RvdHlwZS5nZXROYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3N0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0N1cnJlbnQgc3RhdGUgbm90IGluaXRpYWxpemVkLi4uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLmdldE5hbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQYXR0ZXJuU3RhdGU7XHJcbiAgICAgICAgICAgICAgICB9KFN0YXRlcy5TdGF0ZSkpO1xyXG4gICAgICAgICAgICAgICAgVHlwZXNTdGF0ZS5QYXR0ZXJuU3RhdGUgPSBQYXR0ZXJuU3RhdGU7XHJcbiAgICAgICAgICAgIH0pKFR5cGVzU3RhdGUgPSBTdGF0ZXMuVHlwZXNTdGF0ZSB8fCAoU3RhdGVzLlR5cGVzU3RhdGUgPSB7fSkpO1xyXG4gICAgICAgIH0pKFN0YXRlcyA9IFN0YXRlTWFjaGluZS5TdGF0ZXMgfHwgKFN0YXRlTWFjaGluZS5TdGF0ZXMgPSB7fSkpO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBTdGF0ZXM7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChTdGF0ZXMpIHtcclxuICAgICAgICAgICAgdmFyIFR5cGVzU3RhdGU7XHJcbiAgICAgICAgICAgIChmdW5jdGlvbiAoVHlwZXNTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIFByaW1pdGl2ZVN0YXRlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBfX2V4dGVuZHMoUHJpbWl0aXZlU3RhdGUsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gUHJpbWl0aXZlU3RhdGUobmFtZSwgbW9kZWwsIGlzRW5kUG9pbnQsIHJvdXRlRW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZUVuZ2luZSA9PT0gdm9pZCAwKSB7IHJvdXRlRW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIGlzRW5kUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBQcmltaXRpdmVTdGF0ZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGltcGxlbWVudGF0aW9uIHN0YXR1cy4uLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByaW1pdGl2ZVN0YXRlO1xyXG4gICAgICAgICAgICAgICAgfShTdGF0ZXMuU3RhdGUpKTtcclxuICAgICAgICAgICAgICAgIFR5cGVzU3RhdGUuUHJpbWl0aXZlU3RhdGUgPSBQcmltaXRpdmVTdGF0ZTtcclxuICAgICAgICAgICAgfSkoVHlwZXNTdGF0ZSA9IFN0YXRlcy5UeXBlc1N0YXRlIHx8IChTdGF0ZXMuVHlwZXNTdGF0ZSA9IHt9KSk7XHJcbiAgICAgICAgfSkoU3RhdGVzID0gU3RhdGVNYWNoaW5lLlN0YXRlcyB8fCAoU3RhdGVNYWNoaW5lLlN0YXRlcyA9IHt9KSk7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFJvdXRlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFJvdXRlcykge1xyXG4gICAgICAgICAgICB2YXIgRW5naW5lcztcclxuICAgICAgICAgICAgKGZ1bmN0aW9uIChFbmdpbmVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgUm91dGVFbmdpbmUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFJvdXRlRW5naW5lKHJvdXRlcywgbmV4dEVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm91dGVzID09PSB2b2lkIDApIHsgcm91dGVzID0gW107IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRFbmdpbmUgPT09IHZvaWQgMCkgeyBuZXh0RW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yb3V0ZXMgPSByb3V0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25leHRFbmdpbmUgPSBuZXh0RW5naW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBSb3V0ZUVuZ2luZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHJvdXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAoX2EgPSB0aGlzLl9yb3V0ZXMpLnB1c2guYXBwbHkoX2EsIHJvdXRlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFJvdXRlRW5naW5lLnByb3RvdHlwZS5nZXRSb3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQgeWV0Li4uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBSb3V0ZUVuZ2luZS5wcm90b3R5cGUuc2V0TmV4dEVuZ2luZSA9IGZ1bmN0aW9uIChlbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dEVuZ2luZSA9IGVuZ2luZTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFJvdXRlRW5naW5lLnByb3RvdHlwZS5zZXRNb2RlbCA9IGZ1bmN0aW9uIChhbmltYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwgPSBhbmltYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBSb3V0ZUVuZ2luZS5wcm90b3R5cGUuX25leHRSb3V0ZUVuZ2luZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX25leHRFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZXh0RW5naW5lLmdldFJvdXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUm91dGVFbmdpbmU7XHJcbiAgICAgICAgICAgICAgICB9KCkpO1xyXG4gICAgICAgICAgICAgICAgRW5naW5lcy5Sb3V0ZUVuZ2luZSA9IFJvdXRlRW5naW5lO1xyXG4gICAgICAgICAgICB9KShFbmdpbmVzID0gUm91dGVzLkVuZ2luZXMgfHwgKFJvdXRlcy5FbmdpbmVzID0ge30pKTtcclxuICAgICAgICB9KShSb3V0ZXMgPSBTdGF0ZU1hY2hpbmUuUm91dGVzIHx8IChTdGF0ZU1hY2hpbmUuUm91dGVzID0ge30pKTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgUm91dGVzO1xyXG4gICAgICAgIChmdW5jdGlvbiAoUm91dGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBFbmdpbmVzO1xyXG4gICAgICAgICAgICAoZnVuY3Rpb24gKEVuZ2luZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBTaW1wbGVSb3V0ZUVuZ2luZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX19leHRlbmRzKFNpbXBsZVJvdXRlRW5naW5lLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFNpbXBsZVJvdXRlRW5naW5lKHJvdXRlcywgbmV4dEVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm91dGVzID09PSB2b2lkIDApIHsgcm91dGVzID0gW107IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRFbmdpbmUgPT09IHZvaWQgMCkgeyBuZXh0RW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCByb3V0ZXMsIG5leHRFbmdpbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBTaW1wbGVSb3V0ZUVuZ2luZS5wcm90b3R5cGUuZ2V0Um91dGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3V0ZXMgPSB0aGlzLl9yb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkgeyByZXR1cm4gcm91dGUuaXNBdmFpbGFibGUoX3RoaXMuX21vZGVsKTsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZXMubGVuZ3RoID4gMCA/IHJvdXRlc1swXSA6IHRoaXMuX25leHRSb3V0ZUVuZ2luZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNpbXBsZVJvdXRlRW5naW5lO1xyXG4gICAgICAgICAgICAgICAgfShFbmdpbmVzLlJvdXRlRW5naW5lKSk7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmVzLlNpbXBsZVJvdXRlRW5naW5lID0gU2ltcGxlUm91dGVFbmdpbmU7XHJcbiAgICAgICAgICAgIH0pKEVuZ2luZXMgPSBSb3V0ZXMuRW5naW5lcyB8fCAoUm91dGVzLkVuZ2luZXMgPSB7fSkpO1xyXG4gICAgICAgIH0pKFJvdXRlcyA9IFN0YXRlTWFjaGluZS5Sb3V0ZXMgfHwgKFN0YXRlTWFjaGluZS5Sb3V0ZXMgPSB7fSkpO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBSb3V0ZXM7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChSb3V0ZXMpIHtcclxuICAgICAgICAgICAgdmFyIEVuZ2luZXM7XHJcbiAgICAgICAgICAgIChmdW5jdGlvbiAoRW5naW5lcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIFByb2JhYmlsaXR5Um91dGVFbmdpbmUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIF9fZXh0ZW5kcyhQcm9iYWJpbGl0eVJvdXRlRW5naW5lLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFByb2JhYmlsaXR5Um91dGVFbmdpbmUocm91dGVzLCBuZXh0RW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZXMgPT09IHZvaWQgMCkgeyByb3V0ZXMgPSBbXTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEVuZ2luZSA9PT0gdm9pZCAwKSB7IG5leHRFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHJvdXRlcywgbmV4dEVuZ2luZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFByb2JhYmlsaXR5Um91dGVFbmdpbmUucHJvdG90eXBlLmdldFJvdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvYmFiaWxpdHkgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm91dGVzID0gdGhpcy5fcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuIHJvdXRlLmlzQXZhaWxhYmxlKF90aGlzLl9tb2RlbCwgcHJvYmFiaWxpdHkpOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlcy5sZW5ndGggPiAwID8gcm91dGVzWzBdIDogdGhpcy5fbmV4dFJvdXRlRW5naW5lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZTtcclxuICAgICAgICAgICAgICAgIH0oRW5naW5lcy5Sb3V0ZUVuZ2luZSkpO1xyXG4gICAgICAgICAgICAgICAgRW5naW5lcy5Qcm9iYWJpbGl0eVJvdXRlRW5naW5lID0gUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZTtcclxuICAgICAgICAgICAgfSkoRW5naW5lcyA9IFJvdXRlcy5FbmdpbmVzIHx8IChSb3V0ZXMuRW5naW5lcyA9IHt9KSk7XHJcbiAgICAgICAgfSkoUm91dGVzID0gU3RhdGVNYWNoaW5lLlJvdXRlcyB8fCAoU3RhdGVNYWNoaW5lLlJvdXRlcyA9IHt9KSk7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFJvdXRlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFJvdXRlcykge1xyXG4gICAgICAgICAgICB2YXIgUm91dGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gUm91dGUoc3RhdGUsIGF2YWlsYWJpbGl0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXZhaWxhYmlsaXR5ID0gYXZhaWxhYmlsaXR5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgUm91dGUucHJvdG90eXBlLmlzQXZhaWxhYmxlID0gZnVuY3Rpb24gKG1vZGVsLCBwcm9iYWJpbGl0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9iYWJpbGl0eSA9PT0gdm9pZCAwKSB7IHByb2JhYmlsaXR5ID0gMS4wOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hdmFpbGFiaWxpdHkgJiYgdGhpcy5fYXZhaWxhYmlsaXR5KG1vZGVsLCBwcm9iYWJpbGl0eSkpID8gdGhpcy5fc3RhdGUgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFJvdXRlLnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJvdXRlO1xyXG4gICAgICAgICAgICB9KCkpO1xyXG4gICAgICAgICAgICBSb3V0ZXMuUm91dGUgPSBSb3V0ZTtcclxuICAgICAgICB9KShSb3V0ZXMgPSBTdGF0ZU1hY2hpbmUuUm91dGVzIHx8IChTdGF0ZU1hY2hpbmUuUm91dGVzID0ge30pKTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgU3RhdGVzTGliO1xyXG4gICAgICAgIChmdW5jdGlvbiAoU3RhdGVzTGliKSB7XHJcbiAgICAgICAgICAgIHZhciBTdGF0ZURpZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgICAgICBfX2V4dGVuZHMoU3RhdGVEaWUsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZURpZShuYW1lLCBtb2RlbCwgaXNFbmRQb2ludCwgcm91dGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbmRQb2ludCA9PT0gdm9pZCAwKSB7IGlzRW5kUG9pbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZUVuZ2luZSA9PT0gdm9pZCAwKSB7IHJvdXRlRW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIG1vZGVsLCBpc0VuZFBvaW50LCByb3V0ZUVuZ2luZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBTdGF0ZURpZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNvbHZlRm4sIHJlamVjdEZuO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlRm4gPSByZXNvbHZlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3RGbiA9IHJlamVjdDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0YPQvNC10YAnKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUZuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0YXRlRGllO1xyXG4gICAgICAgICAgICB9KEFuaW1hbHMuU3RhdGVNYWNoaW5lLlN0YXRlcy5UeXBlc1N0YXRlLlByaW1pdGl2ZVN0YXRlKSk7XHJcbiAgICAgICAgICAgIFN0YXRlc0xpYi5TdGF0ZURpZSA9IFN0YXRlRGllO1xyXG4gICAgICAgIH0pKFN0YXRlc0xpYiA9IFN0YXRlTWFjaGluZS5TdGF0ZXNMaWIgfHwgKFN0YXRlTWFjaGluZS5TdGF0ZXNMaWIgPSB7fSkpO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBTdGF0ZXNMaWI7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChTdGF0ZXNMaWIpIHtcclxuICAgICAgICAgICAgdmFyIFN0YXRlUnVuID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgICAgIF9fZXh0ZW5kcyhTdGF0ZVJ1biwgX3N1cGVyKTtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFN0YXRlUnVuKG5hbWUsIG1vZGVsLCBpc0VuZFBvaW50LCByb3V0ZUVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgbW9kZWwsIGlzRW5kUG9pbnQsIHJvdXRlRW5naW5lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFN0YXRlUnVuLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc29sdmVGbiwgcmVqZWN0Rm47XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVGbiA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdEZuID0gcmVqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQsdC10LPRgycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLm11c2N1bGFyLmNoYW5nZVNwZWVkKC0wLjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLm11c2N1bGFyLmNoYW5nZVdlaWdodCgtMC41KTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUZuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0YXRlUnVuO1xyXG4gICAgICAgICAgICB9KEFuaW1hbHMuU3RhdGVNYWNoaW5lLlN0YXRlcy5UeXBlc1N0YXRlLlByaW1pdGl2ZVN0YXRlKSk7XHJcbiAgICAgICAgICAgIFN0YXRlc0xpYi5TdGF0ZVJ1biA9IFN0YXRlUnVuO1xyXG4gICAgICAgIH0pKFN0YXRlc0xpYiA9IFN0YXRlTWFjaGluZS5TdGF0ZXNMaWIgfHwgKFN0YXRlTWFjaGluZS5TdGF0ZXNMaWIgPSB7fSkpO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBTdGF0ZXNMaWI7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChTdGF0ZXNMaWIpIHtcclxuICAgICAgICAgICAgdmFyIFN0YXRlU3RhbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICAgICAgX19leHRlbmRzKFN0YXRlU3RhbmQsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZVN0YW5kKG5hbWUsIG1vZGVsLCBpc0VuZFBvaW50LCByb3V0ZUVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgbW9kZWwsIGlzRW5kUG9pbnQsIHJvdXRlRW5naW5lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFN0YXRlU3RhbmQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZUZuLCByZWplY3RGbjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUZuID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0Rm4gPSByZWplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9GB0YLQvtGOJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwubXVzY3VsYXIuY2hhbmdlU3BlZWQoMC41KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5tdXNjdWxhci5jaGFuZ2VXZWlnaHQoMC43KTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUZuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0YXRlU3RhbmQ7XHJcbiAgICAgICAgICAgIH0oQW5pbWFscy5TdGF0ZU1hY2hpbmUuU3RhdGVzLlR5cGVzU3RhdGUuUHJpbWl0aXZlU3RhdGUpKTtcclxuICAgICAgICAgICAgU3RhdGVzTGliLlN0YXRlU3RhbmQgPSBTdGF0ZVN0YW5kO1xyXG4gICAgICAgIH0pKFN0YXRlc0xpYiA9IFN0YXRlTWFjaGluZS5TdGF0ZXNMaWIgfHwgKFN0YXRlTWFjaGluZS5TdGF0ZXNMaWIgPSB7fSkpO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBTdGF0ZXNMaWI7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChTdGF0ZXNMaWIpIHtcclxuICAgICAgICAgICAgdmFyIFN0YXRlU3RhcnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICAgICAgX19leHRlbmRzKFN0YXRlU3RhcnQsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZVN0YXJ0KG5hbWUsIG1vZGVsLCBpc0VuZFBvaW50LCByb3V0ZUVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgbW9kZWwsIGlzRW5kUG9pbnQsIHJvdXRlRW5naW5lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFN0YXRlU3RhcnQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZUZuLCByZWplY3RGbjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUZuID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0Rm4gPSByZWplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LDRh9Cw0Lsg0LbQuNGC0YwnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5tdXNjdWxhci5jaGFuZ2VTcGVlZCgwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwubXVzY3VsYXIuY2hhbmdlV2VpZ2h0KDAuMDAxKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmVzb2x2ZUZuKCk7IH0sIDQwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTdGF0ZVN0YXJ0O1xyXG4gICAgICAgICAgICB9KEFuaW1hbHMuU3RhdGVNYWNoaW5lLlN0YXRlcy5UeXBlc1N0YXRlLlByaW1pdGl2ZVN0YXRlKSk7XHJcbiAgICAgICAgICAgIFN0YXRlc0xpYi5TdGF0ZVN0YXJ0ID0gU3RhdGVTdGFydDtcclxuICAgICAgICB9KShTdGF0ZXNMaWIgPSBTdGF0ZU1hY2hpbmUuU3RhdGVzTGliIHx8IChTdGF0ZU1hY2hpbmUuU3RhdGVzTGliID0ge30pKTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgRmFjdG9yeVN0YXRlO1xyXG4gICAgICAgIChmdW5jdGlvbiAoRmFjdG9yeVN0YXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBTdGF0ZUZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gU3RhdGVGYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tGYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5zdGFydExpZmVdID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUuU3RhdGVzTGliLlN0YXRlU3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW0ZhY3RvcnlTdGF0ZS5UeXBlc1N0YXRlLnN0YW5kXSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlN0YXRlc0xpYi5TdGF0ZVN0YW5kO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tGYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5ydW5dID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUuU3RhdGVzTGliLlN0YXRlUnVuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tGYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5kaWVdID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUuU3RhdGVzTGliLlN0YXRlRGllO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgU3RhdGVGYWN0b3J5Lmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgU3RhdGVGYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBTdGF0ZUZhY3RvcnkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0eXBlLCBzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1t0eXBlXSA9IHN0YXRlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFN0YXRlRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKHR5cGVTdGF0ZSwgbmFtZSwgYW5pbWFsLCBpc0VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy5fZmFjdG9yaWVzW3R5cGVTdGF0ZV0obmFtZSwgYW5pbWFsLCBpc0VuZCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0YXRlRmFjdG9yeTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgRmFjdG9yeVN0YXRlLlN0YXRlRmFjdG9yeSA9IFN0YXRlRmFjdG9yeTtcclxuICAgICAgICB9KShGYWN0b3J5U3RhdGUgPSBTdGF0ZU1hY2hpbmUuRmFjdG9yeVN0YXRlIHx8IChTdGF0ZU1hY2hpbmUuRmFjdG9yeVN0YXRlID0ge30pKTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgRmFjdG9yeVN0YXRlO1xyXG4gICAgICAgIChmdW5jdGlvbiAoRmFjdG9yeVN0YXRlKSB7XHJcbiAgICAgICAgICAgIChmdW5jdGlvbiAoVHlwZXNTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgVHlwZXNTdGF0ZVtUeXBlc1N0YXRlW1wic3RhcnRMaWZlXCJdID0gMV0gPSBcInN0YXJ0TGlmZVwiO1xyXG4gICAgICAgICAgICAgICAgVHlwZXNTdGF0ZVtUeXBlc1N0YXRlW1wic3RhbmRcIl0gPSAyXSA9IFwic3RhbmRcIjtcclxuICAgICAgICAgICAgICAgIFR5cGVzU3RhdGVbVHlwZXNTdGF0ZVtcInJ1blwiXSA9IDNdID0gXCJydW5cIjtcclxuICAgICAgICAgICAgICAgIFR5cGVzU3RhdGVbVHlwZXNTdGF0ZVtcImRpZVwiXSA9IDRdID0gXCJkaWVcIjtcclxuICAgICAgICAgICAgfSkoRmFjdG9yeVN0YXRlLlR5cGVzU3RhdGUgfHwgKEZhY3RvcnlTdGF0ZS5UeXBlc1N0YXRlID0ge30pKTtcclxuICAgICAgICAgICAgdmFyIFR5cGVzU3RhdGUgPSBGYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZTtcclxuICAgICAgICB9KShGYWN0b3J5U3RhdGUgPSBTdGF0ZU1hY2hpbmUuRmFjdG9yeVN0YXRlIHx8IChTdGF0ZU1hY2hpbmUuRmFjdG9yeVN0YXRlID0ge30pKTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgbGlvbiA9IHtcclxuICAgIG5hbWU6ICfQm9C10LInLFxyXG4gICAgc3lzdGVtczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLm11c2N1bGFyLFxyXG4gICAgICAgICAgICBzY2FsZXNUeXBlOiBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuc3BlZWQgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZCB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLndlaWdodCB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeSxcclxuICAgICAgICAgICAgc2NhbGVzVHlwZTogW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnByZXNzdXJlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuaGVhcnRiZWF0IH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLm5hdmlnYXRpb24sXHJcbiAgICAgICAgICAgIHNjYWxlc1R5cGU6IFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZFNhdnZ5IH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVmlzaW9uIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzU21lbGwgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNIZWFyaW5nIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVG91Y2ggfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgc2NhbGVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuaGVhcnRiZWF0LFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQodC10YDQtNGG0LXQsdC40LXQvdC40LUnLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOSxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAwLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VEZWxheTogMC4xMixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucHJlc3N1cmUsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9CU0LDQstC70LXQvdC40LUnLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOCxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZURlbGF5OiAwLjEzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQodC60L7RgNC+0YHRgtGMJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDksXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMTIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLndlaWdodCxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0JLQtdGBJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDgsXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VEZWxheTogMC4xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkU2F2dnksXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9CS0YDQtdC80Y8g0YHQvNC10LrQsNC70LrQuCcsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50OiA4LFxyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiAxMCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVTY2FsZTogQW5pbWFscy5TY2FsZXMuU2NhbGVUeXBlcy5hcmd1bWVudCxcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNUb3VjaCxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KDQsNC00LjRg9GBINC+0YHRj9C30LDQvdC40Y8nLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOSxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZURlbGF5OiAwLjFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVmlzaW9uLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQoNCw0LTQuNGD0YEg0LfRgNC10L3QuNGPJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDQwLFxyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiA4MCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBjb21tdW5pY2F0aW9uOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkLFxyXG4gICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy53ZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMuQmVoYXZpb3JTY2FsZVR5cGVzLmluY3JlYXNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogQW5pbWFscy5GdW5jdGlvbnMuRnVuY3Rpb25UeXBlcy5saW5lLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAwLjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAuMThcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMud2VpZ2h0LFxyXG4gICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZCxcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogQW5pbWFscy5Db21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMuZGVjcmVhc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zOiBBbmltYWxzLkZ1bmN0aW9ucy5GdW5jdGlvblR5cGVzLmxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAuNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMC4xXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBzdGF0ZXM6IHtcclxuICAgICAgICBzdGF0ZTogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KHRgtCw0YDRgicsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5GYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5zdGFydExpZmUsXHJcbiAgICAgICAgICAgICAgICBpc0VuZDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9CR0LXQs9GDJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLkZhY3RvcnlTdGF0ZS5UeXBlc1N0YXRlLnJ1bixcclxuICAgICAgICAgICAgICAgIGlzRW5kOiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KHRgtC+0Y4nLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuRmFjdG9yeVN0YXRlLlR5cGVzU3RhdGUuc3RhbmQsXHJcbiAgICAgICAgICAgICAgICBpc0VuZDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9Cj0LzQtdGAJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLkZhY3RvcnlTdGF0ZS5UeXBlc1N0YXRlLmRpZSxcclxuICAgICAgICAgICAgICAgIGlzRW5kOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIGxpbmtzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLkZhY3RvcnlTdGF0ZS5UeXBlc1N0YXRlLnN0YXJ0TGlmZSxcclxuICAgICAgICAgICAgICAgIGxpbms6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLkZhY3RvcnlTdGF0ZS5UeXBlc1N0YXRlLnJ1bixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDAuN1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5GYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5zdGFuZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDAuN1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5GYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5kaWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2JhYmlsaXR5OiAwLjAxXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5GYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5zdGFuZCxcclxuICAgICAgICAgICAgICAgIGxpbms6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLkZhY3RvcnlTdGF0ZS5UeXBlc1N0YXRlLnJ1bixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDAuN1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5GYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5kaWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2JhYmlsaXR5OiAwLjAxXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5GYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5ydW4sXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5GYWN0b3J5U3RhdGUuVHlwZXNTdGF0ZS5kaWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2JhYmlsaXR5OiAwLjZcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuRmFjdG9yeVN0YXRlLlR5cGVzU3RhdGUuc3RhbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2JhYmlsaXR5OiAwLjlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuRmFjdG9yeVN0YXRlLlR5cGVzU3RhdGUucnVuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC4xXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWlsZC10cy5qcy5tYXAiLCJpbXBvcnQgeyBDaXJjdWxhckxpc3QgfSBmcm9tICcuL2NpcmN1bGFyLWxpc3QnO1xyXG5cclxuLyoqXHJcbiAqINCd0LDRgdGC0YDQsNC40LLQsNC10YIg0LrRgNGD0LPQu9C+0LUg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAqIEBjbGFzcyBDaXJjdWxhckxpc3RBY3Rpb25zQW5pbWFsXHJcbiAqIEBleHRlbmRzIENpcmN1bGFyTGlzdFxyXG4gKi9cclxudmFyIENpcmN1bGFyTGlzdEFjdGlvbnNBbmltYWwgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBDaXJjdWxhckxpc3QsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0YHRgtGA0L7QudC60LAg0LzQtdC90Y4g0LTQu9GPINC60L7QvdC60YDQtdGC0L3QvtCz0L4g0LbQuNCy0L7RgtC90L7Qs9C+LiDQndCw0YHRgtGA0LDQuNCy0LDQtdGCINGA0LDQtNC40YPRgSDQutGA0YPQs9CwLlxyXG4gICAgICogQG1ldGhvZCBzZXR0aW5nc1xyXG4gICAgICogQHBhcmFtIHtjYy5Db21wb25lbnR9IGNvbnRyb2xsZXJBbmltYWwg0LrQvtC90YLRgNC+0LvQu9C10YAg0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICovXHJcbiAgICBzZXR0aW5ncyhjb250cm9sbGVyQW5pbWFsKXtcclxuICAgICAgICBsZXQgbm9kZSA9IGNvbnRyb2xsZXJBbmltYWwubm9kZTtcclxuXHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSBub2RlLndpZHRoICogMS43NTtcclxuICAgICAgICBpZiAodGhpcy5yYWRpdXMgPiAxNTApIHtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgPSAxNTA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJhZGl1cyA8IDEwMCkge1xyXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyA9IDEwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JlZnJlc2hNZW51KCk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7IENpcmN1bGFyTGlzdEFjdGlvbnNBbmltYWwgfTsiLCIvKipcclxuICog0KHQvtGB0YLQvtGP0L3QuNC1INC00LLQuNC20LXQvdC40Y8g0LzQtdC90Y4gKNC/0L4g0YfQsNGB0L7QstC+0Lkv0L/RgNC+0YLQuNCyINGH0LDRgdC+0LLQvtC5KS5cclxuICogQHR5cGUge01vdmVDaXJjdWxhcn1cclxuICogQHN0YXRpY1xyXG4gKiBAZWxlbWVudCB7bnVtYmVyfSBjbG9ja3dpc2Ug0LrRgNGD0YLQuNGC0YHRjyDQv9C+INGH0LDRgdC+0LLQvtC5LlxyXG4gKiBAZWxlbWVudCB7bnVtYmVyfSBhbnRpY2xvY2t3aXNlINC60YDRg9GC0LjRgtGB0Y8g0L/RgNC+0YLQuNCyINGH0LDRgdC+0LLQvtC5LlxyXG4gKi9cclxuY29uc3QgTW92ZUNpcmN1bGFyID0ge1xyXG4gICAgY2xvY2t3aXNlOiAwLC8v0L/QviDRh9Cw0YHQvtCy0L7QuVxyXG4gICAgYW50aWNsb2Nrd2lzZTogMSwvL9C/0YDQvtGC0LjQsiDRh9Cw0YHQvtCy0L7QuVxyXG59O1xyXG5cclxuLyoqXHJcbiAqINCS0YvQv9C+0LvQvdGP0LXRgiDQstGA0LDRidC10L3QuNC10Lgg0YDQsNC30LzQtdGJ0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyINC/0L4g0L7QutGA0YPQttC90L7RgdGC0LguXHJcbiAqIEBjbGFzcyBDaXJjdWxhckxpc3RcclxuICovXHJcbnZhciBDaXJjdWxhckxpc3QgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9sZW5ndGhCZXR3ZWVuUG9pbnRzOiAwLC8v0YDQsNGB0YHRgtC+0Y/QvdC40LUg0LzQtdC20LTRgyDRjdC70LXQvNC10L3RgtCw0LzQuFxyXG4gICAgICAgIF9jZW50cmU6IGNjLlZlYzIsLy/QptC10L3RgtGAINC60YDRg9Cz0LBcclxuICAgICAgICBfYXJyYXlBbmdsZUxpc3Q6IFtdLC8vL9C80LDRgdGB0LjQsiDRg9Cz0LvQvtCyINC70LjRgdGC0L7QsiDQvdCwINC60L7RgtC+0YDRi9GFINC+0L3QuCDQvdCw0YXQvtC00Y/RgtGB0Y9cclxuICAgICAgICBfcG9vbEludmlzaWJsZUxpc3Q6IFtdLC8v0LzQsNGB0YHQuNCyINC90LXQstC40LTQuNC80YvRhSDQu9C40YHRgtC+0LJcclxuICAgICAgICBfcHJldlJvdGF0aW9uOiAwLC8v0L/RgNC10LTRi9C00YPRidC40Lkg0YPQs9C+0Lsg0LLQvtCy0L7RgNC+0YLQsCDQtNC+INGC0LXQutGD0YnQtdCz0L4g0L/QvtCy0L7RgNC+0YLQsFxyXG4gICAgICAgIF9zdGF0ZURpcmVjdGlvbjogTW92ZUNpcmN1bGFyLmNsb2Nrd2lzZSwvL9C90LDQv9GA0LDQstC70LXQvdC40LUg0LTQstC40LbQtdC90LjRj1xyXG5cclxuICAgICAgICBhbW91bnRWaXNpYmxMaXN0OiA3LC8v0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQuNC00LjQvNGL0YUg0LvQuNC/0LXRgdGC0LrQvtCyINC80LXQvdGOXHJcbiAgICAgICAgYW5nbGVUcmFuc2l0aW9uOiAyMjUsLy/Rg9Cz0L7QuyDQv9C10YDQtdGF0L7QtNCwINC4INC/0L7Rj9Cy0LvQtdC90LjRj9C90L7QstGL0YUg0LvQuNC/0LXRgdGC0LrQvtCyXHJcbiAgICAgICAgd2lkdGhUcmFuc2l0aW9uOiAwLjMsLy/RiNC40YDQuNC90LAg0L/QtdGA0LXRhdC+0LTQsCDQsiDQs9GA0LDQtNGD0YHQsNGFXHJcbiAgICAgICAgcmFkaXVzOiAxMzAsLy/RgNCw0LTQuNGD0YEg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTRg9GCINC60YDRg9GC0LjRgtGB0Y8g0LLRgdC1INC60L3QvtC/0LrQuFxyXG4gICAgICAgIHNlbnNpdGl2aXR5OiAxLC8v0KfRg9Cy0YHRgtCy0LjRgtC10LvQvdC+0YHRgtGMINCx0LDRgNCw0LHQsNC90LAg0Log0LTQstC40LbQtdC90LjRjiDRgdCy0LDQudC/0LAg0L/QviDQutC+0L7RgNC00LjQvdCw0YLQtVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIHRoaXMuX3BsYWNlbWVudExpc3RzTWVudSgpO1xyXG4gICAgICAgIHRoaXMuX3ByZXZSb3RhdGlvbiA9IHRoaXMubm9kZS5yb3RhdGlvbjtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC40YLRjCDQv9C+0LfQuNGG0LjQuCDQutC90L7Qv9C+0Log0LIg0LzQtdC90Y4uINChINGD0YfQtdGC0L7QvCDRgNCw0LTQuNGD0YHQsCDQvtC60YDRg9C20L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgX3JlZnJlc2hNZW51XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcmVmcmVzaE1lbnUoKXtcclxuICAgICAgICB0aGlzLl9wbGFjZW1lbnRMaXN0c01lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0YHQv9GA0LXQtNC10LvQtdC90LjQtSDQutC90L7Qv9C+0Log0L/QviDQvtC60YDRg9C20L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgX3BsYWNlbWVudExpc3RzTWVudVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3BsYWNlbWVudExpc3RzTWVudSgpe1xyXG4gICAgICAgIC8v0YDQsNGB0YHRh9C40YLRi9Cy0LDQtdC8INGG0LXQvdGC0YAg0LrRgNGD0LPQsFxyXG4gICAgICAgIGxldCB3aW5kb3cgPSB0aGlzLm5vZGUucGFyZW50O1xyXG4gICAgICAgIGxldCBjdXJyZW50UmFkaWFucyA9IDAsIHgsIHk7XHJcbiAgICAgICAgdGhpcy5fYXJyYXlBbmdsZUxpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLl9wb29sSW52aXNpYmxlTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLl9jZW50cmUgPSBjYy52Mih3aW5kb3cud2lkdGggLyAyLCB3aW5kb3cuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgdGhpcy5fbGVuZ3RoQmV0d2VlblBvaW50cyA9IDIgKiBNYXRoLlBJIC8gdGhpcy5hbW91bnRWaXNpYmxMaXN0O1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRSYWRpYW5zID49IDIgKiBNYXRoLlBJKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9vbEludmlzaWJsZUxpc3QucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHkgPSB0aGlzLnJhZGl1cyAqIE1hdGguc2luKGN1cnJlbnRSYWRpYW5zKTtcclxuICAgICAgICAgICAgICAgIHggPSB0aGlzLnJhZGl1cyAqIE1hdGguY29zKGN1cnJlbnRSYWRpYW5zKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2V0UG9zaXRpb24oeCwgeSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hcnJheUFuZ2xlTGlzdC5wdXNoKHtpdGVtOiBpdGVtLCBhbmdsZTogY3VycmVudFJhZGlhbnMgKiAoMTgwIC8gTWF0aC5QSSl9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudFJhZGlhbnMgKz0gdGhpcy5fbGVuZ3RoQmV0d2VlblBvaW50cztcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC90LDQv9GA0LDQstC70LXQvdC40Y8g0LLRgNCw0YnQtdC90LjRjyDQuCDQstGL0LfRi9Cy0LDQtdGCINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQuSDQvtCx0YDQsNCx0L7RgtGH0LjQuiwg0L/QtdGA0LXQtNCw0LLQsNGPINC30L3QsNGH0LXQvdC40Y8g0YFcclxuICAgICAqINGD0YfQtdGC0L7QvCDRh9GD0LLRgdGC0LLQuNGC0LXQu9GM0L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgZGlyZWN0aW9uUm90YXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4INC00LXQu9GM0YLQsCDQuNC30LzQtdC90LXQvdC40Y8g0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQuNC30LzQtdC90LXQvdC40Y8g0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY1gg0L/QvtC70L7QttC10L3QuNC1INGC0LDRh9CwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jWSDQv9C+0LvQvtC20LXQvdC40LUg0YLQsNGH0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICovXHJcbiAgICBkaXJlY3Rpb25Sb3RhdGlvbih4LCB5LCBsb2NYLCBsb2NZKXtcclxuICAgICAgICAvL9C/0YDQuNC80LXQvdGP0LXQvCDRh9GD0LLRgdGC0LLQuNGC0LXQu9GM0L3QvtGB0YLRjFxyXG4gICAgICAgIHggPSB4ICogdGhpcy5zZW5zaXRpdml0eTtcclxuICAgICAgICB5ID0geSAqIHRoaXMuc2Vuc2l0aXZpdHk7XHJcblxyXG4gICAgICAgIGlmIChsb2NYID4gdGhpcy5fY2VudHJlLnggJiYgbG9jWSA+IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjEoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYIDwgdGhpcy5fY2VudHJlLnggJiYgbG9jWSA+IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjIoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYIDwgdGhpcy5fY2VudHJlLnggJiYgbG9jWSA8IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjMoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYID4gdGhpcy5fY2VudHJlLnggJiYgbG9jWSA8IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjQoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IDAuMDAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2V0RGlyZWN0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFtb3VudFZpc2libExpc3QgPCB0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmtpbmdWaXNpYmxlRWxlbWVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNCx0L7RgtCw0LXRgiDRgSDQv9C+0Y/QstC70LXQvdC40LXQvCDRjdC70LXQvNC10L3RgtC+0LIuXHJcbiAgICAgKiBAbWV0aG9kIF93b3JraW5nVmlzaWJsZUVsZW1lbnRzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfd29ya2luZ1Zpc2libGVFbGVtZW50cygpe1xyXG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMuZ2V0QW5nbGVNZW51KCk7XHJcbiAgICAgICAgLy/Qo9C30L3QsNC10Lwg0LTQu9GPINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0LXQs9C+INGD0LPQvtC7INC90LAg0LrQvtGC0L7RgNC+0Lwg0L7QvSDQvdCw0YXQvtC00LjRgtGB0Y9cclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N3YXBFbGVtZW50KHRoaXMuZ2V0QW5nbGVMaXN0KGl0ZW0sIGFuZ2xlKSwgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYW5nbGUgPSB0aGlzLmdldEFuZ2xlTWVudSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQtNCw0LXRgiDRg9Cz0L7QuyDQvNC10L3Rji5cclxuICAgICAqIEBtZXRob2QgZ2V0QW5nbGVNZW51XHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDRg9Cz0L7QuyDQv9C+0LLQvtGA0L7RgtCwINC+0YIgMCDQtNC+IDM2MC5cclxuICAgICAqL1xyXG4gICAgZ2V0QW5nbGVNZW51KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5yb3RhdGlvbiAtIDM2MCAqIE1hdGguZmxvb3IodGhpcy5ub2RlLnJvdGF0aW9uIC8gMzYwKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0LHQvtGC0LDQtdGCINGBINGN0LvQtdC80LXQvdGC0LDQvNC4INCy0YvQutC70Y7Rh9Cw0Y8g0LjRhSDQuCDQv9C+0LTRgdGC0LDQstC70Y/Rj9GPINC30LAg0LzQtdGB0YLQviDQvdC40YUg0LTRgNGD0LPQuNC1INGN0LXQu9C10LzQtdC90YLRiy5cclxuICAgICAqIEBtZXRob2QgX3N3YXBFbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUg0YPQs9C+0Lsg0L3QsCDQutC+0YLQvtGA0L7QvCDQvdCw0YXQvtC00LjRgtGB0Y8g0Y3Qu9C10LzQtdC90YIuXHJcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IGVsZW1lbnQg0Y3Qu9C10LzQtdC90YIv0LvQuNGB0YIg0LrQvtGC0L7RgNGL0Lkg0L3QtdC+0LHRhdC+0LTQuNC80L4g0LfQsNC80LXQvdC40YLRjCDQvdCwINGB0LvQtdC00YPRjtGJ0LjQuSDRjdC70LXQvNC10L3RgiDQuNC3INC+0YfQtdGA0LXQtNC4INC90LXQstC40LTQuNC80YvRhSDRjdC70LXQvNC10L3RgtC+0LIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc3dhcEVsZW1lbnQoYW5nbGUsIGVsZW1lbnQpe1xyXG4gICAgICAgIGlmIChhbmdsZSA+IHRoaXMuYW5nbGVUcmFuc2l0aW9uIC0gdGhpcy53aWR0aFRyYW5zaXRpb24gJiYgYW5nbGUgPCB0aGlzLmFuZ2xlVHJhbnNpdGlvbiArIHRoaXMud2lkdGhUcmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBhY3R1YWxMaXN0ID0gdGhpcy5fcG9vbEludmlzaWJsZUxpc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgYWN0dWFsTGlzdC5zZXRQb3NpdGlvbihjYy52MihlbGVtZW50LngsIGVsZW1lbnQueSkpO1xyXG4gICAgICAgICAgICBhY3R1YWxMaXN0LnJvdGF0aW9uID0gZWxlbWVudC5yb3RhdGlvbjtcclxuICAgICAgICAgICAgYWN0dWFsTGlzdC5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9wb29sSW52aXNpYmxlTGlzdC5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9hcnJheUFuZ2xlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pdGVtLm5hbWUgPT09IGVsZW1lbnQubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXRlbSA9IGFjdHVhbExpc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgKHRoaXMuX3N0YXRlRGlyZWN0aW9uID09PSBNb3ZlQ2lyY3VsYXIuY2xvY2t3aXNlKSA/IHRoaXMubm9kZS5yb3RhdGlvbiArPSB0aGlzLndpZHRoVHJhbnNpdGlvbiA6IHRoaXMubm9kZS5yb3RhdGlvbiAtPSB0aGlzLndpZHRoVHJhbnNpdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YPQs9C+0Lsg0Y3Qu9C10LzQtdC90YLQsC/Qu9C40YHRgtCwINC/0L7QtCDQutC+0YLQvtGA0YvQvCDQvtC9INC90LDRhdC+0LTQuNGC0YHRjy5cclxuICAgICAqIEBtZXRob2QgZ2V0QW5nbGVMaXN0XHJcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IGVsZW1lbnQg0L3QvtC0INGN0LvQtdC80LXQvdGC0LAuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUg0YPQs9C+0Lsg0L/QvtCy0L7RgNC+0YLQsCDQvNC10L3Rji5cclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g0YPQs9C+0Lsg0LvQuNGB0YLQsC/RjdC70LXQvNC10L3RgtCwINC80LXQvdGOLlxyXG4gICAgICovXHJcbiAgICBnZXRBbmdsZUxpc3QoZWxlbWVudCwgYW5nbGUpe1xyXG4gICAgICAgIGxldCBvYmogPSB0aGlzLl9hcnJheUFuZ2xlTGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXRlbS54ID09PSBlbGVtZW50LnggJiYgaXRlbS5pdGVtLnkgPT09IGVsZW1lbnQueTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb2JqID0gb2JqWzBdLmFuZ2xlIC0gYW5nbGU7XHJcbiAgICAgICAgb2JqIC09IE1hdGguZmxvb3Iob2JqIC8gMzYwKSAqIDM2MDtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGB0L7RgdGC0L7Rj9C90LjQtSDQtNCy0LjQttC10L3QuNGPINC80LXQvdGOINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQvdCw0L/RgNCw0LLQu9C10L3QuNGPINC/0L7QstC+0YDQvtGC0LAuXHJcbiAgICAgKiBAbWV0aG9kIF9zZXREaXJlY3Rpb25cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXREaXJlY3Rpb24oKXtcclxuICAgICAgICBpZiAodGhpcy5ub2RlLnJvdGF0aW9uID4gdGhpcy5fcHJldlJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlRGlyZWN0aW9uID0gTW92ZUNpcmN1bGFyLmNsb2Nrd2lzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubm9kZS5yb3RhdGlvbiA8IHRoaXMuX3ByZXZSb3RhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZURpcmVjdGlvbiA9IE1vdmVDaXJjdWxhci5hbnRpY2xvY2t3aXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wcmV2Um90YXRpb24gPSB0aGlzLm5vZGUucm90YXRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHRgtCw0LHQuNC70LjQt9C40YDRg9C10YIg0Y3Qu9C10LzQtdC90YLRiyDQvNC10L3RjiDQv9C+INC/0L7Qu9C+0LbQtdC90LjRjiDQuiDQs9C+0YDQuNC30L7QvdGC0YMuXHJcbiAgICAgKiBAbWV0aG9kIHN0YWJpbGl6YXRpb25FbGVtZW50c1xyXG4gICAgICovXHJcbiAgICBzdGFiaWxpemF0aW9uRWxlbWVudHMoKXtcclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLnJvdGF0aW9uID0gLXRoaXMubm9kZS5yb3RhdGlvbjtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQv9C10YDQstC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQvtC60YDRg9C20L3QvtGB0YLQuC4g0KDQsNGB0L/QvtC30L3QsNC10YIg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsCDQuCDQv9GA0LjQvNC10L3Rj9C10YIg0YHQvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQv9C+0LLQtdC00LXQvdC40LUuXHJcbiAgICAgKiDQlNC70Y8g0L7QsdC10YHQv9C10YfQtdC90LjRjyDQstGA0LDRidC10L3QuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gICAgICogQG1ldGhvZCBfb2JyMVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgg0LTQtdC70YzRgtCwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29icjEoeCwgeSl7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uIC09IHk7XHJcbiAgICAgICAgdGhpcy5zdGFiaWxpemF0aW9uRWxlbWVudHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQstGC0L7RgNC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQutGA0YPQs9CwLiDQoNCw0YHQv9C+0LfQvdCw0LXRgiDQtNCy0LjQttC10L3QuNC1INGC0LDRh9CwINC4INC/0YDQuNC80LXQvdGP0LXRgiDRgdC+0YLQstC10YLRgdGC0LLRg9GO0YnQtdC1INC/0L7QstC10LTQtdC90LjQtS5cclxuICAgICAqINCU0LvRjyDQvtCx0LXRgdC/0LXRh9C10L3QuNGPINCy0YDQsNGJ0LXQvdC40Y8g0L7QutGA0YPQttC90L7RgdGC0Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwuXHJcbiAgICAgKiBAbWV0aG9kIF9vYnIyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCDQtNC10LvRjNGC0LAg0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQv9C+INC+0YDQtNC40L3QsNGC0LUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb2JyMih4LCB5KXtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gKz0geDtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gKz0geTtcclxuICAgICAgICB0aGlzLnN0YWJpbGl6YXRpb25FbGVtZW50cygpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INGC0YDQtdGC0YzQtdC5INGH0LXRgtCy0LXRgNGC0Lgg0LrRgNGD0LPQsC4g0KDQsNGB0L/QvtC30L3QsNC10YIg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsCDQuCDQv9GA0LjQvNC10L3Rj9C10YIg0YHQvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQv9C+0LLQtdC00LXQvdC40LUuXHJcbiAgICAgKiDQlNC70Y8g0L7QsdC10YHQv9C10YfQtdC90LjRjyDQstGA0LDRidC10L3QuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gICAgICogQG1ldGhvZCBfb2JyM1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgg0LTQtdC70YzRgtCwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29icjMoeCwgeSl7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uIC09IHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IHk7XHJcbiAgICAgICAgdGhpcy5zdGFiaWxpemF0aW9uRWxlbWVudHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRh9C10YLQstC10YDRgtC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQutGA0YPQs9CwLiDQoNCw0YHQv9C+0LfQvdCw0LXRgiDQtNCy0LjQttC10L3QuNC1INGC0LDRh9CwINC4INC/0YDQuNC80LXQvdGP0LXRgiDRgdC+0YLQstC10YLRgdGC0LLRg9GO0YnQtdC1INC/0L7QstC10LTQtdC90LjQtS5cclxuICAgICAqINCU0LvRjyDQvtCx0LXRgdC/0LXRh9C10L3QuNGPINCy0YDQsNGJ0LXQvdC40Y8g0L7QutGA0YPQttC90L7RgdGC0Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwuXHJcbiAgICAgKiBAbWV0aG9kIF9vYnI0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCDQtNC10LvRjNGC0LAg0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQv9C+INC+0YDQtNC40L3QsNGC0LUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb2JyNCh4LCB5KXtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gLT0geDtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gLT0geTtcclxuICAgICAgICB0aGlzLnN0YWJpbGl6YXRpb25FbGVtZW50cygpO1xyXG4gICAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgeyBDaXJjdWxhckxpc3QgfTsiLCIvKipcclxuICpcclxuICovXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgX21vZGVsOiBudWxsLC8v0LzQvtC00LXQu9GMINC20LjQstC+0YLQvdC+0LPQvlxyXG5cclxuICAgICAgICBfbWF4Qmlhc1RvdWNoOiAxNSwvL9C80LDQutGB0LjQvNCw0LvRjNC90L7QtSDRgdC80LXRidC10L3QuNC1INGC0LDRh9CwINC00LvRjyDQvtGC0LrRgNGL0YLQuNGPINC80LXQvdGOIChweClcclxuICAgICAgICBfcG9pbnRUb3VjaEZvck1lbnU6IGNjLnYyLC8v0YLQvtGH0LrQsCDRgdGC0LDRgNGC0LAg0YLQsNGH0LAg0L/QviDQttC40LLQvtGC0L3QvtC80YNcclxuXHJcbiAgICAgICAgX2lzTW92ZTogZmFsc2UsLy/RhNC70LDQsyDQtNC70Y8g0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQtNCy0LjQttC10YLRgdGPINC70Lgg0LbQuNCy0L7QvdC+0LUg0LfQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvFxyXG4gICAgICAgIF9pc09wZW5NZW51OiBmYWxzZSwvL9GE0LvQsNCzINC00LvRjyDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC+0YLQutGA0YvRgtC+INC70Lgg0LzQtdC90Y5cclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkKCl7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hTdGFydEFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0YHRgtGA0LDQuNCy0LDQtdGCINC00L7RgdGC0YPQv9C90YvQtSDQtNC10LnRgdGC0LLQuNGPINC/0LvRjtGI0LrQuCDQtNC70Y8g0LbQuNCy0L7RgtC90L7Qs9C+INC4INGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuICAgICAqL1xyXG4gICAgc2V0dGluZ3MobW9kZWwpe1xyXG4gICAgICAgIHRoaXMuX21vZGVsID0gbW9kZWw7XHJcbiAgICAgICAgY2MubG9nKHRoaXMubm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5nQ29sbGlkZXIodGhpcy5fbW9kZWwubmF2aWdhdGlvbi5yYWRpdXNWaXNpb24sdGhpcy5ub2RlLmNoaWxkcmVuWzBdLmdldENvbXBvbmVudChjYy5DaXJjbGVDb2xsaWRlcikpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ0NvbGxpZGVyKHRoaXMuX21vZGVsLm5hdmlnYXRpb24ucmFkaXVzSGVhcmluZyx0aGlzLm5vZGUuY2hpbGRyZW5bMV0uZ2V0Q29tcG9uZW50KGNjLkNpcmNsZUNvbGxpZGVyKSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5nQ29sbGlkZXIodGhpcy5fbW9kZWwubmF2aWdhdGlvbi5yYWRpdXNTbWVsbCx0aGlzLm5vZGUuY2hpbGRyZW5bMl0uZ2V0Q29tcG9uZW50KGNjLkNpcmNsZUNvbGxpZGVyKSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5nQ29sbGlkZXIodGhpcy5fbW9kZWwubmF2aWdhdGlvbi5yYWRpdXNUb3VjaCx0aGlzLm5vZGUuY2hpbGRyZW5bM10uZ2V0Q29tcG9uZW50KGNjLkNpcmNsZUNvbGxpZGVyKSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCd0LDRgdGC0YDQsNC40LLQsNC10YIg0LrQvtC70LvQsNC50LTQtdGA0Ysg0YMg0LbQuNCy0L7RgtC90L7Qs9C+INGB0L7Qs9C70LDRgdC90L4g0LXQs9C+INC80L7QtNC10LvQuFxyXG4gICAgICogQG1ldGhvZCBzZXR0aW5nQ29sbGlkZXJcclxuICAgICAqIEBwYXJhbSB7QW5pbWFscy5TeXN0ZW1zLklTeXN0ZW19IHN5c3RlbVxyXG4gICAgICogQHBhcmFtIHtjYy5DaXJjbGVDb2xsaWRlcn0gY29tcG9uZW50XHJcbiAgICAgKi9cclxuICAgIHNldHRpbmdDb2xsaWRlcihzeXN0ZW0sY29tcG9uZW50KXtcclxuICAgICAgICBzeXN0ZW09PT11bmRlZmluZWQ/Y29tcG9uZW50LnJhZGl1cz0wOmNvbXBvbmVudC5yYWRpdXM9c3lzdGVtLmN1cnJlbnQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Y8g0L3QsNGH0LDQu9CwINGC0LDRh9CwXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9vblRvdWNoU3RhcnRBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdzdGFydE1vdGlvbkFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICBzdGFydE1vdGlvbjogY2MudjIodGhpcy5ub2RlLngsIHRoaXMubm9kZS55KSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogdGhpcyxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpOy8v0YDQsNC30L7RgdC70LDQu9C4INC10LLQtdC90YJcclxuICAgICAgICB0aGlzLl9pc01vdmUgPSBmYWxzZTsvL9C20LjQstC+0YLQvdC+0LUg0L3QtSDQtNCy0LjQttC10YLRgdGPINC30LAg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LxcclxuICAgICAgICB0aGlzLl9wb2ludFRvdWNoRm9yTWVudSA9IGV2ZW50LmdldExvY2F0aW9uKCk7Ly/RgdGH0LjRgtCw0LvQuCDRgtC+0YfQutGDINC/0LXRgNCy0L7Qs9C+INC90LDQttCw0YLQuNGPXHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Y8g0LTQstC40LbQtdC90LjRjyDRgtCw0YfQsC5cclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hNb3ZlQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICAvLyAgIGNjLmxvZyhldmVudCk7XHJcbiAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQudG91Y2guZ2V0RGVsdGEoKTtcclxuICAgICAgICBpZiAodGhpcy5faXNDaGVja09uT3Blbk1lbnUoZXZlbnQuZ2V0TG9jYXRpb24oKSkgJiYgIXRoaXMuX2lzT3Blbk1lbnUpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNNb3ZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ21vdGlvbkFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgICAgIGRlbHRhTW90aW9uOiBkZWx0YSxcclxuICAgICAgICAgICAgICAgIHBvaW50RW5kOiBldmVudC5nZXRMb2NhdGlvbigpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQt9Cw0LLQtdGA0YjQtdC90LjRjyDRgtCw0YfQsFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaEVuZEFuaW1hbChldmVudCl7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzTW92ZSkge1xyXG4gICAgICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnZW5kTW90aW9uQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRFbmQ6IGV2ZW50LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9pc01vdmUgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWZvY3VzTWVudSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0L7RgtC60YDRi9Cy0LDQtdGC0YHRjyDQvNC10L3RjiDQuNC70Lgg0L3QtdGCLiDQn9GD0YLQtdC8INGB0LrQsNC90LjRgNC+0LLQsNC90LjRjyDRgtC+0YfQutC4INGC0LDRh9CwINC90LAg0LLRi9GF0L7QtNC30LAg0L/RgNC10LTQtdC70Ysg0L7RgiDQvdCw0YfQsNC/0LvRjNC90L7QuSDRgtC+0YfQutC4XHJcbiAgICAgKiBAcGFyYW0gcG9pbnRcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaXNDaGVja09uT3Blbk1lbnUocG9pbnQpe1xyXG4gICAgICAgIGxldCBYID0gTWF0aC5hYnModGhpcy5fcG9pbnRUb3VjaEZvck1lbnUueCAtIHBvaW50LngpID4gdGhpcy5fbWF4Qmlhc1RvdWNoO1xyXG4gICAgICAgIGxldCBZID0gTWF0aC5hYnModGhpcy5fcG9pbnRUb3VjaEZvck1lbnUueSAtIHBvaW50LnkpID4gdGhpcy5fbWF4Qmlhc1RvdWNoO1xyXG4gICAgICAgIHJldHVybiBYIHx8IFk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQt9C80LXQvdGP0LXRgiDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQtdC90Y5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9yZWZvY3VzTWVudSgpe1xyXG4gICAgICAgIHRoaXMuX2lzT3Blbk1lbnUgPSAhdGhpcy5faXNPcGVuTWVudTtcclxuICAgICAgICAodGhpcy5faXNPcGVuTWVudSkgPyB0aGlzLl9wdWJsaXNoT3Blbk1lbnVBbmltYWwoKSA6IHRoaXMuX3B1Ymxpc2hDbG9zZU1lbnVBbmltYWwoKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC60YDRi9GC0LjQtSDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAqL1xyXG4gICAgX3B1Ymxpc2hPcGVuTWVudUFuaW1hbCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdvcGVuTWVudUFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0aGlzLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC60YDRi9GC0L4g0LzQtdC90Y4g0YEg0LbQuNCy0L7RgtC90YvQvNC4XHJcbiAgICAgKi9cclxuICAgIF9wdWJsaXNoQ2xvc2VNZW51QW5pbWFsKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Nsb3NlTWVudUFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0aGlzLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC60YDRi9GC0LjQtSDQvNC10L3RjlxyXG4gICAgICovXHJcbiAgICBvcGVuTWVudSgpe1xyXG4gICAgICAgIHRoaXMuX2lzT3Blbk1lbnUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3B1Ymxpc2hPcGVuTWVudUFuaW1hbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCX0LDQutGA0YvRgtGMINC80LXQvdGOXHJcbiAgICAgKi9cclxuICAgIGNsb3NlTWVudSgpe1xyXG4gICAgICAgIHRoaXMuX2lzT3Blbk1lbnUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9wdWJsaXNoQ2xvc2VNZW51QW5pbWFsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC+0LHRidCw0LXRgiDQvNC+0LTQtdC70Lgg0LTQviDQutCw0LrQvtC5INGC0L7Rh9C60Lgg0L3QsNC00L4g0LTQvtC50YLQuFxyXG4gICAgICogQHBhcmFtIHBvaW50XHJcbiAgICAgKi9cclxuICAgIG1vdmVUb1BvaW50KHBvaW50KXtcclxuICAgICAgICB0aGlzLl9tb2RlbC5tb3ZlVG9Qb2ludChwb2ludCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC/0YPRgdC60LDQtdGCINC20LjQt9C90Ywg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgKiBAbWV0aG9kIHJ1blxyXG4gICAgICovXHJcbiAgICBydW4oKXtcclxuICAgICAgICB0aGlzLl9tb2RlbC5ydW5MaWZlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC00LDRgtGMINC30LLRg9C6XHJcbiAgICAgKi9cclxuICAgIHJ1blZvaWNlKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LXRgdGC0YxcclxuICAgICAqL1xyXG4gICAgcnVuU2l0KCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0YHQv9GD0LPQsNGC0YzRgdGPXHJcbiAgICAgKi9cclxuICAgIHJ1bkZyaWdodGVuKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7QutCw0LfQsNGC0Ywg0LDRgNC10LDQu9GLXHJcbiAgICAgKi9cclxuICAgIHJ1bkFyZWFsKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7Qu9Cw0YHQutCw0YLRjNGB0Y9cclxuICAgICAqL1xyXG4gICAgcnVuQ2FyZSgpe1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQm9C10YfRjFxyXG4gICAgICovXHJcbiAgICBydW5MaWUoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC40LPQvtGC0L7QstC40YLRjNGB0Y9cclxuICAgICAqL1xyXG4gICAgcnVuQXR0ZW50aW9uKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC80LDRgdGB0LjQsiDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQuiDRgyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAqIEByZXR1cm4geyp8YW55fVxyXG4gICAgICovXHJcbiAgICBnZXRDaGFyYWN0ZXJpc3RpY3MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0Q2hhcmFjdGVyaXN0aWNzKCk7XHJcbiAgICB9XHJcblxyXG59KTsiLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjRjyDQvdCwINC90LDQttCw0YLQuNC1INC/0L4g0LfQstC10YDRjtGI0LrQtSDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0LfQstC10YDRjtGI0LrQuFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hTdGFydChldmVudCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3N0YXJ0RHJhZ0FuZERyb3BBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgYW5pbWFsOiB0aGlzLm5vZGUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNGPINC90LDQtNCy0LjQttC10L3QuNC1INC30LDQttCw0YLQvtC5INC30LLQtdGA0Y7RiNC60Lgg0L/QvtGB0LvQtSDRgdC+0LfQtNCw0L3QuNGPINC30LLQtdGA0LHRiNC60LhcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoTW92ZShldmVudCl7XHJcbiAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQudG91Y2guZ2V0RGVsdGEoKTtcclxuICAgICAgICB0aGlzLm5vZGUueCArPSBkZWx0YS54O1xyXG4gICAgICAgIHRoaXMubm9kZS55ICs9IGRlbHRhLnk7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2RyYWdBbmREcm9wQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIHBvaW50OiB7eDogdGhpcy5ub2RlLngsIHk6IHRoaXMubm9kZS55fSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40LUg0L3QsCDQt9Cw0LLQtdGA0YjQtdC90LjQtSDQvdCw0LbQsNGC0LjRjyDQv9C+INC30LLQtdGA0Y7RiNC60LUg0L/QvtGB0LvQtSDRgdC+0LfQtNCw0L3QuNGPINC30LLQtdGA0Y7RiNC60LhcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoRW5kKGV2ZW50KXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnc3RvcERyYWdBbmREcm9wQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIHBvaW50OiB7eDogdGhpcy5ub2RlLngsIHk6IHRoaXMubm9kZS55fSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG5cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcbn0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBGSVJDb3JwIG9uIDA0LjAzLjIwMTcuXHJcbiAqL1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfZmljdGl0aW91c1BvaW50OiBudWxsLC8v0KLQvtGH0LrQsCDQtNC70Y8g0YTQuNC60YHQsNGG0LjQuCDQtNCy0LjQttC10L3QuNGPINC60LDRgNGC0YsuINCf0L7QvNC+0LPQsNC10YIg0YDQsNC30LvQuNGH0LDRgtGMINGB0L7QsdGL0YLQuNC1INC00LLQuNC20LXQvdC40LUg0L7RgiDQt9Cw0LLQtdGA0YjQtdC90LjRj1xyXG4gICAgICAgIF9pc1RvdWNoU3RhcnQ6IG51bGwsLy/QpNC70LDQsyDQt9Cw0L/Rg9GJ0LXQvSDQu9C4INGC0LDRh1xyXG4gICAgICAgIF9jb250cm9sbGVyU2Nyb2xsTWFwOiBudWxsLFxyXG4gICAgICAgIF9hY3Rpb25Nb3ZlTWFwOiBudWxsLC8v0LTQtdC50YHRgtCy0LjQtSDQtNCy0LjQttC10L3QuNGPINC60LDRgNGC0YtcclxuICAgICAgICBfbWF4U2l6ZU1hcFNjcm9sbDogbnVsbCwvL9GA0LDQt9C80LXRgCBvZmZzZXQg0YHQutGA0L7Qu9C70LAuINC/0L7QvNC+0LbQtdGCINC/0YDQuCDQv9C10YDQtdC80LXRidC10L3QuNC4INC60LDQvNC10YDRiyDQvtGCINC30LLQtdGA0Y7RiNC60Lgg0Log0LfQstC10YDRjtGI0LrQtVxyXG5cclxuICAgICAgICBtYXhCaWFzVG91Y2g6IDE1LC8v0LzQsNC60YHQuNC80LDQu9GM0L3QvtC1INGB0LzQtdGJ0LXQvdC40LUg0YLQsNGH0LAg0LTQu9GPINC+0L/RgNC10LTQtdC70LXQvdC40Y8g0YfRgtC+INC60LDRgNGC0LAg0LTQstC40LbQtdGC0YHRj1xyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25Ub3VjaE1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLl9pc1RvdWNoU3RhcnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyU2Nyb2xsTWFwID0gdGhpcy5ub2RlLnBhcmVudC5wYXJlbnQuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpO1xyXG4gICAgICAgIHRoaXMuX2ZpY3RpdGlvdXNQb2ludCA9IGNjLnYyKDAsIDApO1xyXG4gICAgICAgIHRoaXMuX21heFNpemVNYXBTY3JvbGwgPSB0aGlzLl9jb250cm9sbGVyU2Nyb2xsTWFwLmdldE1heFNjcm9sbE9mZnNldCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC/0L7RgNCw0LbQtNCw0Y7RidC40LXRgdGPINGB0LrRgNC+0LvQvtC8XHJcbiAgICAgKiBAcGFyYW0gZXZlbnQg0YHQvtCx0YvRgtC40LUg0LrQvtGC0L7RgNC+0LUg0LvQvtCy0LjRgiDRgdC60YDQvtC7XHJcbiAgICAgKi9cclxuICAgIG9uRXZlbnRTY3JvbGwoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcG9pbnQgPSBldmVudC5nZXRTY3JvbGxPZmZzZXQoKTtcclxuICAgICAgICBsZXQgbG9nUmV6ID0gcG9pbnQueCA9PT0gdGhpcy5fZmljdGl0aW91c1BvaW50LnggJiYgcG9pbnQueSA9PT0gdGhpcy5fZmljdGl0aW91c1BvaW50Lnk7XHJcbiAgICAgICAgKGxvZ1JleiAmJiB0aGlzLl9pc1RvdWNoU3RhcnQpID8gdGhpcy5vblRvdWNoRW5kKGV2ZW50KSA6IHRoaXMuX2ZpY3RpdGlvdXNQb2ludCA9IHBvaW50O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsCDQv9GA0LjQutC+0YHQvdC+0LLQtdC90LjQtSDQuiDQutCw0YDRgtC1XHJcbiAgICAgKiBAcGFyYW0gZXZlbnQg0YHQvtCx0YvRgtC40LUg0LrQvtGC0L7RgNC+0LUg0L/QvtC50LzQsNC10YIg0Y3RgtC+0YIg0YHQutGA0LjQv9GCXHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hTdGFydChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzVG91Y2hTdGFydCA9IHRydWU7XHJcbiAgICAgICAgLy/Qt9Cw0L/QvtC80L3QuNC80L/QvtC30LjRhtC40Y8g0L3QsNGH0LDQu9CwINGN0LLQtdC90YLQsFxyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCd0b3VjaE9uTWFwJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNGPINC90LAg0LTQstC40LbQtdC90LjQtSB0b3VjaCDQv9C+INC60LDRgNGC0LVcclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtSDQutC+0YLQvtGA0L7QtSDQv9C+0LnQvNCw0LXRgiDRjdGC0L7RgiDRgdC60YDQuNC/0YJcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE1vdmUoZXZlbnQpIHtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgndG91Y2hNb3ZlT25NYXAnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQuNGPINC90LAg0L7RgtC60L/Rg9GB0LrQsNC90LjQtSB0b3VjaCDQvtGCINC60LDRgNGC0YtcclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtSDQutC+0YLQvtGA0L7QtSDQv9C+0LnQvNCw0LXRgiDRgdC60YDQvtC7INC70LjQsdC+INGN0YLQvtGCINGB0LrRgNC40L/RglxyXG4gICAgICovXHJcbiAgICBvblRvdWNoRW5kKGV2ZW50KSB7XHJcbiAgLy8gICAgICBjYy5sb2coZXZlbnQpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pc1RvdWNoU3RhcnQpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNUb3VjaFN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCd0b3VjaEVuZE1vdmVPbk1hcCcsIHRydWUpO1xyXG4gICAgICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgLy8gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC90LLQtdC90YLQuNGA0YPQtdGCINGC0L7Rh9C60YMg0L7QutC90LAg0LIg0YLQvtGH0LrRgyDQutCw0YDRgtGLXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0YLQvtGH0LrQsCDQsiDQvtC60L3QtVxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9INGC0L7Rh9C60LAg0L3QsCDQutCw0YDRgtC1XHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50TWFwKHBvaW50KSB7XHJcbiAgICAgICAgbGV0IG5ld1ggPSBwb2ludC54IC0gdGhpcy5ub2RlLng7XHJcbiAgICAgICAgbGV0IG5ld1kgPSBwb2ludC55IC0gdGhpcy5ub2RlLnk7XHJcbiAgICAgICAgcmV0dXJuIGNjLnYyKG5ld1gsIG5ld1kpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRgtC+0YfQutGDINCyINC60L7QvtGA0LTQuNC90LDRgtGLINC+0LrQvdCwXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0YLQvtGH0LrQsCDQvdCwINC60LDRgNGC0LVcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfSDRgtC+0YfQutCwINCyINC+0LrQvdC1XHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50V2luZG93KHBvaW50KSB7XHJcbiAgICAgICAgbGV0IG5ld1ggPSBwb2ludC54ICsgdGhpcy5ub2RlLng7XHJcbiAgICAgICAgbGV0IG5ld1kgPSBwb2ludC55ICsgdGhpcy5ub2RlLnk7XHJcbiAgICAgICAgcmV0dXJuIGNjLnYyKG5ld1gsIG5ld1kpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGC0L7Rh9C60YMg0LrQsNGA0YLRiyDQuNC3INGB0LjRgdGC0LXQvNGLINC60L7QvtGA0LTQuNC90LDRgiDRgdC60YDQvtC70LvQsFxyXG4gICAgICogQHBhcmFtIHBvaW50INC40YHRhdC+0LTQvdCw0Y8g0YLQvtGH0LrQsFxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9XHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50TWFwT2ZPZmZzZXQocG9pbnQpe1xyXG4gICAgICAgIGxldCBuZXdZID0gdGhpcy5fbWF4U2l6ZU1hcFNjcm9sbC55IC0gcG9pbnQueTtcclxuICAgICAgICByZXR1cm4gY2MudjIocG9pbnQueCwgbmV3WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdCy0LXRgNGC0LjRgNGD0LXRgiDRgtC+0YfQutGDXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0LjRgdGF0L7QtNC90LDRjyDRgtC+0YfQutCwXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn1cclxuICAgICAqL1xyXG4gICAgZ2V0SW52ZXJ0UG9pbnQocG9pbnQpe1xyXG4gICAgICAgIGxldCBuZXdYID0gLXBvaW50Lng7XHJcbiAgICAgICAgbGV0IG5ld1kgPSAtcG9pbnQueTtcclxuICAgICAgICByZXR1cm4gY2MudjIobmV3WCwgbmV3WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQstC40LbQtdC90LjQtSDQutCw0LzQtdGA0Ysg0LLQvdC10LrQvtGC0L7RgNGD0Y4g0YLQvtGH0LrRgyDQvdCwINC+0YHQvdC+0LLQtSDQvNC10YLQvtC00LAg0LTQstC40LbQtdC90LjRjyDRgdC60YDQvtC70LvQsC4g0KEg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LXQvCDQtdCz0L4g0YHQuNGB0YLQtdC80Ysg0LrQvtC+0YDQtNC40L3QsNGCXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0YLQvtGH0LrQsCDQsiDQutC+0YLQvtGA0YPRjiDQvdC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC50YLQuFxyXG4gICAgICogQHBhcmFtIHRpbWUg0LLRgNC10LzRjyDQt9CwINC60YLQvtGA0L7QtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0L/QtdGA0LXRhdC+0LRcclxuICAgICAqL1xyXG4gICAgbW92ZShwb2ludCwgdGltZSA9IDApe1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJTY3JvbGxNYXAuc2Nyb2xsVG9PZmZzZXQodGhpcy5nZXRQb2ludE1hcE9mT2Zmc2V0KHBvaW50KSwgdGltZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQstC40LbQtdC90LjQtSDQutCw0YDRgtGLINCyINC90LXQutC+0YLQvtGA0YPRjiDRgtC+0YfQutGDINC90LAg0L7RgdC90L7QstC1IGFjdGlvbnNcclxuICAgICAqIEBwYXJhbSBwb2ludFxyXG4gICAgICogQHBhcmFtIHRpbWVcclxuICAgICAqL1xyXG4gICAgbW92ZUFjdGlvbnMocG9pbnQsIHRpbWUgPSAwKXtcclxuICAgICAgICB0aGlzLm5vZGUuc3RvcEFjdGlvbih0aGlzLl9hY3Rpb25Nb3ZlTWFwKTtcclxuICAgICAgICB0aGlzLl9hY3Rpb25Nb3ZlTWFwID0gY2MubW92ZVRvKHRpbWUsIHRoaXMuZ2V0SW52ZXJ0UG9pbnQocG9pbnQpKTtcclxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKFxyXG4gICAgICAgICAgICBjYy5zZXF1ZW5jZSh0aGlzLl9hY3Rpb25Nb3ZlTWFwLCBjYy5jYWxsRnVuYyh0aGlzLl9wdWJsaXNoRmluaXNoTW92ZUNlbnRyZVRvQW5pbWFsLCB0aGlzKSlcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQtNCy0LjQttC10L3QuNGPINC60LDQvNC10YDRiyDQtNC+INC20LjQstC+0YLQvdC+0LPQviDQuCDRhNC40LrRgdC40YDQvtCy0LDQvdC40LUg0LXQs9C+INC/0L4g0YbQtdC90YLRgNGDINGN0LrRgNCw0L3QsFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3B1Ymxpc2hGaW5pc2hNb3ZlQ2VudHJlVG9BbmltYWwoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnZmluaXNoTW92ZUNhbWVyYVRvQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG5cclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEZJUkNvcnAgb24gMzEuMDMuMjAxNy5cclxuICovXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hTdGFydChldmVudCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE1vdmUoZXZlbnQpe1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmQoZXZlbnQpe1xyXG5cclxuICAgIH0sXHJcbn0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBGSVJDb3JwIG9uIDE2LjA0LjIwMTcuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGC0YDQvtC70LvQtdGAINGB0LrRgNC+0LvQu9CwINGF0LDRgNCw0LrRgtC40YDQuNGB0YLQuNC6LiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10LPRg9C70LjRgNC+0LLQutGDINGN0LvQtdC80LXQvdGC0L7QsiDQsdC+0LrRgdCwINGF0LDRgNCw0YLQtdGA0LjRgdGC0LjQui4g0JLRi9C/0L7Qu9C90Y/QtdGCINC+0L/QtdGA0LDRhtC40Lgg0YHQstGP0LfQsNC90L3Ri9C1INGBINGA0LXQs9GD0LvQuNGA0L7QstC60L7QuSDQvdC+0LTQvtCyINC00LvRjyDQvtCx0LXRgdC/0LXRh9C10L3QuNGPINC40LvQu9GO0LfQuNC4INCy0YDQsNGJ0LXQvdC40Y8g0LHQsNGA0LDQsdCw0L3QsCDQutGD0LTQsCDQvdCw0LrRgNGD0YfQuNCy0LDQtdGC0YHRjy/QvtGC0LrRg9C00LAg0YHQutGA0YPRh9C40LLQsNC10YLRgdGPINGB0L/QuNGB0L7QuiDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQui5cclxuICogQGNsYXNzIENoYXJhY3RlcmlzdGljc1Njcm9sbEJveENvbnRyb2xsZXJcclxuICovXHJcbnZhciBDaGFyYWN0ZXJpc3RpY3NTY3JvbGxCb3hDb250cm9sbGVyID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBub2RlQ29pbDogY2MuTm9kZSwvL9C90L7QtCDQv9Cw0LvQutC4XHJcbiAgICAgICAgbm9kZVJvbGw6IGNjLk5vZGUsLy/QvdC+0LQg0LHQu9C10YHQutCwXHJcbiAgICAgICAgbm9kZUNvbnRlbnQ6IGNjLk5vZGUsLy8g0L3QvtC0INC60L7QvdGC0LXQvdGC0LBcclxuICAgICAgICBib3R0b21Qb2ludFN0YXJ0Um90YXRpb246IDI4MSwvL9C90LjQttC90Y/RjyDQutC+0YDQtNC40L3QsCDRgdGC0LDRgNGC0LAg0L/QvtCy0L7RgNC+0YLQsFxyXG4gICAgICAgIHRvcFBvaW50U3RhcnRSb3RhdGlvbjogMzYxLC8v0LLQtdGA0YXQvdGP0Y8g0LrQvtGA0LTQuNC90LAg0YHRgtCw0YDRgtCwINC/0L7QstC+0YDQvtGC0LBcclxuICAgICAgICBfaW50ZXJ2YWw6IDAsLy/QtNC70LjQvdC90LAg0L/RgNC+0LzQtdC20YPRgtC60LAg0LTQu9GPINGB0LbQuNGC0LjRjyDQv9Cw0YDQtdC80LXQvdC90YvRhVxyXG4gICAgICAgIF9zdGFydFBvc0NvbnRlbnQ6IG51bGwsLy/RgdGC0LDRgNGC0L7QstCw0Y8g0L/QvtC30LjRhtC40Y8g0LrQvtC90YLQtdC90YLQsCDQsdC+0LrRgdCwISFcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDQvdCwINC30LDQs9GA0YPQt9C60YMg0YHRhtC10L3Riy5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC/0L4g0LfQsNC/0YPRgdC60YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gICAgICogQG1ldGhvZCBzdGFydFxyXG4gICAgICovXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIGxldCBsYSA9IHRoaXMubm9kZUNvbnRlbnQuZ2V0Q29tcG9uZW50KGNjLkxheW91dCk7XHJcbiAgICAgICAgdGhpcy5fc3RlcCA9IGxhLnNwYWNpbmdZO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zQ29udGVudCA9IHRoaXMubm9kZUNvbnRlbnQueTtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHRoaXMudG9wUG9pbnRTdGFydFJvdGF0aW9uIC0gdGhpcy5ib3R0b21Qb2ludFN0YXJ0Um90YXRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0YHRgtCw0YDRgtCwINGC0LDRh9CwXHJcbiAgICAgKiBAbWV0aG9kIF9vblRvdWNoU3RhcnRcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hTdGFydChldmVudCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCV0LLQtdC90YIg0LTQstC40LbQtdC90LjRjyDRgdC60YDQvtC70LvQsC4g0J7QsdGA0LDQsdCw0YLRi9Cy0LDQtdGCINCy0YDQsNGJ0LXQvdC40Lgg0LHQvtC60YHQsCDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQui7Qn9GA0L7QuNC30LLQvtC00LjRgiDRgdC20LDRgtC40LUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0L3QsCDQuNC90YLQtdGA0LLQsNC70LVcclxuICAgICAqIEBtZXRob2Qgb25Nb3ZlU2Nyb2xsXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Nb3ZlU2Nyb2xsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRQb2ludENvbnRlbnQgPSBldmVudC5nZXRDb250ZW50UG9zaXRpb24oKTtcclxuICAgICAgICBsZXQgYmFpcyA9IE1hdGguYWJzKGN1cnJlbnRQb2ludENvbnRlbnQueSAtIHRoaXMuX3N0YXJ0UG9zQ29udGVudCk7XHJcbiAgICAgICAgbGV0IHZyID0gMDtcclxuICAgICAgICBpZiAoY3VycmVudFBvaW50Q29udGVudC55ID4gdGhpcy5fc3RhcnRQb3NDb250ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZUNvbnRlbnQuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRQb2ludEl0ZW0gPSB0aGlzLl9zdGFydFBvc0NvbnRlbnQgLSB2ciArIGJhaXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBvaW50SXRlbSA+IHRoaXMuYm90dG9tUG9pbnRTdGFydFJvdGF0aW9uICYmIGN1cnJlbnRQb2ludEl0ZW0gPCB0aGlzLnRvcFBvaW50U3RhcnRSb3RhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2NhbGVZID0gdGhpcy5fZ2V0U2NhbGVJdGVtKGN1cnJlbnRQb2ludEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnNjYWxlWSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2ciArPSB0aGlzLl9zdGVwICsgaXRlbS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiDQutC+0Y3RhNGE0LjRhtC10L3RgiDRgdC20LDRgtC40Y8uINCa0L7RgtC+0YDRi9C5INGA0LDRgdGH0LjRgtGL0LLQsNC10YLRgdGPINC90LAg0L7RgdC90L7QstC1INC/0YDQvtC80LXQttGD0YLQutCwINC4INGC0LXQutGD0YnQtdCz0L4g0L/QvtC70L7QttC10L3QuNGPINCyINGN0YLQvtC8INC/0YDQvtC80LXQttGD0YLQutC1LlxyXG4gICAgICogQG1ldGhvZCBfZ2V0U2NhbGVJdGVtXHJcbiAgICAgKiBAcGFyYW0gY3VycmVudFBvaW50INGC0LXQutGD0YnQtdC1INC/0L7Qu9C+0LbQtdC90LjQtSDQv9Cw0YDQsNC80LXRgtGA0LAg0L/QviDQvtGB0Lgg0L7RgNC00LjQvdCw0YJcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9INC60L7RjdGE0YTQuNGG0LXQvdGCINGB0LbQsNGC0LjRjyDQtNC70Y8g0L/QsNGA0LDQvNC10YLRgNCwXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZ2V0U2NhbGVJdGVtKGN1cnJlbnRQb2ludCl7XHJcbiAgICAgICAgbGV0IGsgPSAxIC0gKCgxMDAgKiAoY3VycmVudFBvaW50IC0gdGhpcy5ib3R0b21Qb2ludFN0YXJ0Um90YXRpb24pKSAvIHRoaXMuX2ludGVydmFsKSAvIDEwMDtcclxuICAgICAgICByZXR1cm4gKGsgPiAxIHx8IGsgPCAwKSA/IDEgOiBrO1xyXG4gICAgfSxcclxuXHJcbn0pOyIsInZhciBGYWN0b3J5QW5pbWFsUHJlZmFiID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfdGFyZ2V0QW5pbWFsOiBjYy5Ob2RlLFxyXG4gICAgICAgIHdheVRvUHJlZmFiOidwcmVmYWJzL2FuaW1hbC9MaW9uU2hlYXRoJyxcclxuICAgICAgICB3YXlUb01vZGVsOiAnLi9tb2RlbCcsLy/Qn9GD0YLRjCDQtNC+INC80L7QtNC10LvQuFxyXG4gICAgICAgIG5hbWVBbmltYWw6ICdhbmltYWwnLC8v0JjQvNGPINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdGCINC20LjQstC+0YLQvdC+0LVcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUFuaW1hbChldmVudCkge1xyXG4gICAgICAvLyAgY2MubG9nKGV2ZW50KTtcclxuICAgICAgIC8vIGxldCBwb2ludFRvdWNoID0gZXZlbnQuZ2V0U3RhcnRMb2NhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuX2NyZWF0ZVByZWZhYigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdGCINC/0YDQtdGE0LDQsSDQsiDQvdGD0LbQvdC+0Lwg0LrQvtC90YLQtdC90YLQtVxyXG4gICAgICogQHNlZSB7c3RyaW5nfSB3YXlUb1ByZWZhYiDQv9GD0YLRjCDQtNC+INC/0YDQtdGE0LDQsdCwXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVQcmVmYWIoKSB7XHJcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModGhpcy53YXlUb1ByZWZhYiwgKGVyciwgcHJlZmFiKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnY3JlYXRlQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICAgICAgYW5pbWFsOiB0aGlzLl9zZXR0aW5nc0FuaW1hbCh0aGlzLl90YXJnZXRBbmltYWwpLFxyXG4gICAgICAgICAgICAgICAgcHV0aFRvTW9kZWw6dGhpcy5wdXRoVG9Nb2RlbCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBub2RlQW5pbWFsXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXR0aW5nc0FuaW1hbChub2RlQW5pbWFsKXtcclxuICAgICAgICBub2RlQW5pbWFsLm5hbWU9dGhpcy5uYW1lQW5pbWFsO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUFuaW1hbDtcclxuICAgIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IHsgRmFjdG9yeUFuaW1hbFByZWZhYn07IiwiaW1wb3J0IHsgQ2lyY3VsYXJMaXN0IH0gZnJvbSAnLi9jaXJjdWxhci1saXN0JztcclxuXHJcbi8qKlxyXG4gKiDQm9C40YHRgiDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAqIEBjbGFzcyBMaXN0XHJcbiAqL1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIG1hbmFnZXI6IENpcmN1bGFyTGlzdCwvL9GB0YHRi9C70LrQsCDQvdCwINGP0LTRgNC+INCy0YDQsNGJ0LXQvdC40Y9cclxuICAgICAgICBuYW1lRXZlbnQ6ICd2b2ljZUFuaW1hbCcsLy/QuNC80Y8g0YHQvtCx0YvRgtC40Y8g0LrQvtGC0L7RgNC+0LUg0LLRi9C30YvQstCw0LXRgiDRjdGC0LAg0LrQvdC+0L/QutCwXHJcbiAgICAgICAgbWF4Qmlhc1RvdWNoOiAxNSwvL9C80LDQutGB0LjQvNCw0LvRjNC90L7QtSDRgdC80LXRidC10L3QuNC1INGC0LDRh9CwINC00LvRjyDQvdCw0LbQsNGC0LjRjyDQv9C+INGN0LvQtdC80LXQvdGC0YMg0LzQtdC90Y4gKHB4KVxyXG4gICAgICAgIF9wb2ludFRvdWNoRm9yTWVudTogY2MudjIsLy/RgtC+0YfQutCwINGB0YLQsNGA0YLQsCDRgtCw0YfQsCDQv9C+INC/0YPQvdC60YLRgyDQvNC10L3RjlxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC70LjRgdGC0LAg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICogQG1ldGhvZCBvbkxvYWRcclxuICAgICAqL1xyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INGB0YLQsNGA0YLQsCDQvdCw0LbQsNGC0LjRjyDQvdCwINC70LjRgdGCLlxyXG4gICAgICogQG1ldGhvZCBfb25Ub3VjaFN0YXJ0XHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudCDQvtCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaFN0YXJ0KGV2ZW50KXtcclxuICAgICAgICB0aGlzLl9wb2ludFRvdWNoRm9yTWVudSA9IGV2ZW50LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0L7RgtC/0YPRgdC60LDQvdC40Y8g0YLQsNGH0LAg0L7RgiDQu9C40YHRgtCwLlxyXG4gICAgICogQG1ldGhvZCBfb25Ub3VjaEVuZFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnQg0L7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hFbmQoZXZlbnQpe1xyXG4gICAgICAgIGxldCBwb2ludCA9IGV2ZW50LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgbGV0IFggPSBNYXRoLmFicyh0aGlzLl9wb2ludFRvdWNoRm9yTWVudS54IC0gcG9pbnQueCkgPCB0aGlzLm1heEJpYXNUb3VjaDtcclxuICAgICAgICBsZXQgWSA9IE1hdGguYWJzKHRoaXMuX3BvaW50VG91Y2hGb3JNZW51LnkgLSBwb2ludC55KSA8IHRoaXMubWF4Qmlhc1RvdWNoO1xyXG4gICAgICAgIGlmIChYICYmIFkpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHVibGlzaEV2ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDRgdCy0LfQsNC90L3QvtC1INGBINGN0YLQuNC8INC70LjRgdGC0L7QvC5cclxuICAgICAqIEBtZXRob2QgX3B1Ymxpc2hFdmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3B1Ymxpc2hFdmVudCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKHRoaXMubmFtZUV2ZW50LCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgYW5pbWFsOiB0aGlzLm1hbmFnZXIucGFyZW50LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LTQstC40LbQtdC90LjRjyDRgtCw0YfQsC5cclxuICAgICAqIEBtZXRob2QgX29uVG91Y2hNb3ZlXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudCDQvtCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaE1vdmUoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcG9pbnQgPSBldmVudC50b3VjaC5nZXRQcmV2aW91c0xvY2F0aW9uKCk7XHJcbiAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQudG91Y2guZ2V0RGVsdGEoKTtcclxuICAgICAgICB0aGlzLm1hbmFnZXIuZGlyZWN0aW9uUm90YXRpb24oZGVsdGEueCwgZGVsdGEueSwgcG9pbnQueCwgcG9pbnQueSk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG59KTsiLCJpbXBvcnQgeyBBUElDb3JlIH1mcm9tICcuLi8uLi9idWlsZC9idWlsZC10cyc7XHJcblxyXG4vKipcclxuICog0KHQvtGB0YLQvtGP0L3QuNC1INC40LPRgNGLLlxyXG4gKiBAdHlwZSB7U3RhdEdhbWV9XHJcbiAqIEBzdGF0aWNcclxuICogQGVsZW1lbnQge251bWJlcn0gc2xlZXAg0LHQtdC30LTQtdC50YHRgtCy0LjQtS5cclxuICogQGVsZW1lbnQge251bWJlcn0gb3Blbk1lbnUg0L7RgtC60YDRi9GC0LjQtSDQvNC10L3RjiDQuNCz0YDRiy5cclxuICogQGVsZW1lbnQge251bWJlcn0gb3Blbk1lbnVBbmltYWwg0L7RgtC60YDRi9GC0LjQtSDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IGNyZWF0ZUFuaW1hbCDRgdC+0LfQtNCw0L3QuNC1INC20LjQstC+0YLQvdC+0LPQvi5cclxuICogQGVsZW1lbnQge251bWJlcn0gbW92ZU1hcCDQtNCy0LjQttC10L3QuNC1INC60LDRgNGC0Ysg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwuXHJcbiAqL1xyXG5jb25zdCBTdGF0R2FtZSA9IHtcclxuICAgIHNsZWVwOiAwLFxyXG4gICAgb3Blbk1lbnU6IDEsXHJcbiAgICBvcGVuTWVudUFuaW1hbDogMixcclxuICAgIGNyZWF0ZUFuaW1hbDogMyxcclxuICAgIG1vdmVNYXA6IDQsXHJcbn07XHJcblxyXG4vKipcclxuICog0KPQv9GA0LDQstC70Y/QtdGCINC/0YDQtdC00YHRgtCw0LLQu9C90LjQtdC8LlxyXG4gKiBAY2xhc3MgUGxheVxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBub2RlV2luZG93OiBjYy5Ob2RlLC8v0L7QutC90L4g0LjQs9GA0YtcclxuICAgICAgICBub2RlQm94Q3JlYXRlQW5pbWFsOiBjYy5Ob2RlLC8v0LLRgdC/0LvRi9Cy0LDRjtGJ0LjQuSDQsdC+0LrRgSDRgSDQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAgICBub2RlQm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsOiBjYy5Ob2RlLC8v0LLRgdC/0LvRi9Cy0LDRjtGJ0LjQuSDQsdC+0LrRgSDRgSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutCw0LzQuCDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICBub2RlQmFza2V0OiBjYy5Ob2RlLC8v0LrQvtGA0LfQuNC90LAg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgbm9kZUZpZWxkQW5pbWFsczogY2MuTm9kZSwvL9C/0L7Qu9C1INC20LjQt9C90LXQtNC10Y/RgtC10LvRjNC90L7RgdGC0Lgg0LbQuNCy0L7RgtC90YvRhVxyXG4gICAgICAgIG5vZGVCb3hNYXA6IGNjLk5vZGUsLy/QsdC+0LrRgSDRgSDQutCw0YDRgtC+0LlcclxuICAgICAgICBub2RlTWFwOiBjYy5Ob2RlLC8v0L/QvtC70LUg0LrQsNGA0YLRi1xyXG4gICAgICAgIG5vZGVNZW51OiBjYy5Ob2RlLC8v0L/QvtC70LUg0LzQtdC90Y4g0LjQs9GA0YtcclxuICAgICAgICBub2RlTWVudUFuaW1hbDogY2MuTm9kZSwvL9C90L7QtCDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICBub2RlTWFza0NyZWF0ZWRBbmltYWw6IGNjLk5vZGUsLy/QvNCw0YHQutCwINC00LvRjyDRgdC+0LfQtNCw0L3QuNGPINC20LjQstC+0YLQvdGL0YVcclxuXHJcbiAgICAgICAgcHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3M6IGNjLlByZWZhYiwvL9C/0YDQtdGE0LDQsSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutC4XHJcblxyXG4gICAgICAgIGNvbG9yVGV4dENoYXJhY3RlcmlzdGljczogY2MuQ29sb3IsLy/RhtCy0LXRgiDRgtC10LrRgdGC0LAg0YMg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LpcclxuXHJcbiAgICAgICAgX3RhcmdldEFuaW1hbDogY2MuTm9kZSwvL9C90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICBfcG9pbnRUYXJnZXRBbmltYWw6IGNjLnYyLC8v0YLQvtGH0LrQsCDQvdCw0LfQvdCw0YfQtdC90LjRjyDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICBfdGFyZ2V0Q29udHJvbGxlckFuaW1hbDogY2MuTm9kZSwvL9C60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YLQtVxyXG4gICAgICAgIF9jZW50cmVXaW5kb3dQb2ludDogbnVsbCwvL9GC0L7Rh9C60LAg0YHQtdGA0LXQtNC40L3RiyDRjdC60YDQsNC90LBcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQutC+0L3RgNC+0LvQu9C10YDQsCDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjy5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjcmVhdGVBbmltYWwnLCB0aGlzLm9uQW5pbWFsQ3JlYXRlZC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ29wZW5Cb3hGcm9tQW5pbWFsJywgdGhpcy5vbk9wZW5Cb3hGcm9tQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY2xvc2VCb3hGcm9tQW5pbWFsJywgdGhpcy5vbkNsb3NlQm94RnJvbUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ29wZW5Cb3hNZW51UGxheScsIHRoaXMub25PcGVuQm94TWVudVBsYXkuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjbG9zZUJveE1lbnVQbGF5JywgdGhpcy5vbkNsb3NlQm94TWVudVBsYXkuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbignb3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnLCB0aGlzLm9uT3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjbG9zZUJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnLCB0aGlzLm9uQ2xvc2VCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignc3RhcnREcmFnQW5kRHJvcEFuaW1hbCcsIHRoaXMub25TdGFydERyYWdBbmREcm9wQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignZHJhZ0FuZERyb3BBbmltYWwnLCB0aGlzLm9uRHJhZ0FuZERyb3BBbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdzdG9wRHJhZ0FuZERyb3BBbmltYWwnLCB0aGlzLm9uU3RvcERyYWdBbmREcm9wQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignbW90aW9uQW5pbWFsJywgdGhpcy5vbk1vdGlvbkFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3N0YXJ0TW90aW9uQW5pbWFsJywgdGhpcy5vblN0YXJ0TW90aW9uQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignZW5kTW90aW9uQW5pbWFsJywgdGhpcy5vbkVuZE1vdGlvbkFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ29wZW5NZW51QW5pbWFsJywgdGhpcy5vbk9wZW5NZW51QW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY2xvc2VNZW51QW5pbWFsJywgdGhpcy5vbkNsb3NlTWVudUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd2b2ljZUFuaW1hbCcsIHRoaXMub25Wb2ljZUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3NpdEFuaW1hbCcsIHRoaXMub25TaXRBbmltYWwuYmluZCh0aGlzKSk7Ly/RgdC40LTQtdGC0YxcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2ZyaWdodGVuQW5pbWFsJywgdGhpcy5vbkZyaWdodGVuQW5pbWFsLmJpbmQodGhpcykpOy8v0L3QsNC/0YPQs9Cw0YLRjFxyXG4gICAgICAgIHRoaXMubm9kZS5vbignYXJlYWxBbmltYWwnLCB0aGlzLm9uQXJlYWxBbmltYWwuYmluZCh0aGlzKSk7Ly/Qv9C+0LrQsNC30LDRgtGMINCw0YDQtdCw0LtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2NhcmVBbmltYWwnLCB0aGlzLm9uQ2FyZUFuaW1hbC5iaW5kKHRoaXMpKTsvL9CX0LDQsdC+0YLQsCwg0LPQu9Cw0LTQuNGC0YxcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2xpZUFuaW1hbCcsIHRoaXMub25MaWVBbmltYWwuYmluZCh0aGlzKSk7Ly/Qm9C10LbQsNGC0Yws0LvQtdGH0YxcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2F0dGVudGlvbkFuaW1hbCcsIHRoaXMub25BdHRlbnRpb25BbmltYWwuYmluZCh0aGlzKSk7Ly/QktC90LjQvNCw0L3QuNC1LCDQs9C+0YLQvtCy0YHRjFxyXG5cclxuICAgICAgICB0aGlzLm5vZGUub24oJ2Jhc2tldEFjdGl2ZScsIHRoaXMub25CYXNrZXRBY3RpdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdiYXNrZXRTbGVlcCcsIHRoaXMub25CYXNrZXRTbGVlcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2Jhc2tldFdvcmsnLCB0aGlzLm9uQmFza2V0V29yay5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaE9uTWFwJywgdGhpcy5vblRvdWNoT25NYXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaE1vdmVPbk1hcCcsIHRoaXMub25Ub3VjaE1vdmVPbk1hcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoRW5kTW92ZU9uTWFwJywgdGhpcy5vblRvdWNoRW5kTW92ZU9uTWFwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignZmluaXNoTW92ZUNhbWVyYVRvQW5pbWFsJywgdGhpcy5vbkZpbmlzaE1vdmVDYW1lcmFUb0FuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQtNCw0L3QvdGL0YUuXHJcbiAgICAgKiBAbWV0aG9kIF9pbml0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaW5pdCgpe1xyXG4gICAgICAgIHRoaXMuX2FwaSA9IEFQSUNvcmUuaW5zdGFuY2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUuc2xlZXA7XHJcblxyXG4gICAgICAgIHRoaXMuX3RhcmdldFNpemVXaXRoID0gMDsvL9Cy0YDQtdC80LXQvdC90YvQtSDRgNCw0LfQvNC10YDRiyDRiNC40YDQuNC90Ysg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1LiDQlNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y9cclxuICAgICAgICB0aGlzLl90YXJnZXRTaXplSGVpZ2h0ID0gMDsvL9Cy0YDQtdC80LXQvdC90YvQtSDRgNCw0LfQvNC10YDRiyDQstGL0YHQvtGC0Ysg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1LiDQlNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y9cclxuXHJcbiAgICAgICAgdGhpcy5fcG9pbnRUYXJnZXRBbmltYWwgPSBjYy52MigwLCAwKTsvL9GC0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRglxyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IG51bGw7IC8v0L3QvtC0INC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YLQtVxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwgPSBudWxsOy8v0LrQvtC90YLRgNC+0LvQu9C10YAg0LbQuNCy0L7RgtC90L7Qs9C+ICjRgtC+0LvRjNC60L4gMSDRgtC+0LPQviDRh9GC0L4g0LIg0YLQsNGA0LPQtdGC0LUpXHJcbiAgICAgICAgdGhpcy5fY2VudHJlV2luZG93UG9pbnQgPSBjYy52Mih0aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm5vZGUuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckNpcmN1bGFyTWVudSA9IHRoaXMubm9kZU1lbnVBbmltYWwuZ2V0Q29tcG9uZW50KCdjaXJjdWxhci1saXN0LWFjdGlvbnMtYW5pbWFsJyk7XHJcbiAgICAgICAgdGhpcy5fYm94Q3JlYXRlQW5pbWFsID0gdGhpcy5ub2RlQm94Q3JlYXRlQW5pbWFsLmdldENvbXBvbmVudCgnYm94LWNyZWF0ZS1hbmltYWwnKTtcclxuICAgICAgICB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwgPSB0aGlzLm5vZGVCb3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwuZ2V0Q29tcG9uZW50KCdib3gtY2hhcmFjdGVyaXN0aWNzLWFuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQgPSB0aGlzLm5vZGVCYXNrZXQuZ2V0Q29tcG9uZW50KCdiYXNrZXQtYW5pbWFsJyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hcCA9IHRoaXMubm9kZU1hcC5nZXRDb21wb25lbnQoJ2NvbnRyb2xsZXItbWFwJyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCR0L7QutGBINGBINC20LjQstC+0YLQvdGL0LzQuCDQt9Cw0LrRgNGL0LvRgdGPLlxyXG4gICAgICogQG1ldGhvZCBvbkNsb3NlQm94RnJvbUFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25DbG9zZUJveEZyb21BbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C30LDQutGA0YvQu9GB0Y8gQm94RnJvbUFuaW1hbCcpO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZUdhbWUgIT0gU3RhdEdhbWUuY3JlYXRlQW5pbWFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JHQvtC60YEg0YEg0LbQuNCy0L7RgtC90YvQvNC4INC+0YLQutGA0YvQu9GB0Y8uXHJcbiAgICAgKiBAbWV0aG9kIG9uT3BlbkJveEZyb21BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3BlbkJveEZyb21BbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0YLQutGA0YvQu9GB0Y8gQm94RnJvbUFuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLmFjdGl2ZSA9IHRydWU7Ly/QsNC60YLQuNCy0LjRgNC+0LLQsNC70Lgg0LzQsNGB0LrRg1xyXG4gICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLnNldFBvc2l0aW9uKHRoaXMuX2NlbnRyZVdpbmRvd1BvaW50KTtcclxuICAgICAgICBpZiAodGhpcy5fY29udHJvbGxlckFuaW1hbCAhPT0gbnVsbCkgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdC90Y4g0L7RgtC60YDRi9C70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvbk9wZW5Cb3hNZW51UGxheVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25PcGVuQm94TWVudVBsYXkoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0YLQutGA0YvQu9C+0YHRjCDQvNC10L3RjicpO1xyXG4gICAgICAgIHRoaXMubm9kZU1lbnUuYWN0aXZlID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10L3RjiDQt9Cw0LrRgNGL0LvQvtGB0YwuXHJcbiAgICAgKiBAbWV0aG9kIG9uQ2xvc2VCb3hNZW51UGxheVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25DbG9zZUJveE1lbnVQbGF5KGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0LrRgNGL0LvQvtGB0Ywg0LzQtdC90Y4nKTtcclxuICAgICAgICB0aGlzLm5vZGVNZW51LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQvdC40LUg0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICog0J7RgtCy0LXRh9Cw0LXRgiDQt9CwINGA0LDQt9C80LXRidC10L3QuNC1INC20LjQstC+0YLQvdC+0LPQviDQsiDQtNC10YDQtdCy0LUg0L3QvtC00L7Qsi5cclxuICAgICAqIEBtZXRob2Qgb25BbmltYWxDcmVhdGVkXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkFuaW1hbENyZWF0ZWQoZXZlbnQpe1xyXG4gICAgICAgIHRoaXMuX3N0YXRlR2FtZSA9IFN0YXRHYW1lLmNyZWF0ZUFuaW1hbDtcclxuICAgICAgICBjYy5sb2coJ9GB0L7Qt9C00LDQvdC40LUg0L3QvtCy0L7Qs9C+INC20LjQstC+0YLQvdC+0LPQvicpO1xyXG4gICAgICAgIGV2ZW50LmRldGFpbC5hbmltYWwucGFyZW50ID0gdGhpcy5ub2RlRmllbGRBbmltYWxzLnBhcmVudDsvLyDQv9C+0LTRhtC10L/QuNGC0Ywg0LbQuNCy0L7RgtC90L7QtSDQuiDQutCw0YDRgtC1XHJcbiAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5fY29udHJvbGxlck1hcC5nZXRQb2ludE1hcChjYy52Mih0aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm5vZGUuaGVpZ2h0IC8gMikpOy8v0LLRi9GH0LjRgdC70LjRgtGMINC60L7QvtGA0LTQuNC90LDRgtGLINC90LAg0LrQsNGA0YLQtVxyXG4gICAgICAgIGV2ZW50LmRldGFpbC5hbmltYWwuc2V0UG9zaXRpb24ocG9pbnQueCwgcG9pbnQueSk7Ly/Qo9GB0YLQsNC90L7QstC40YLRjCDQutC+0L7RgNC00LjQvdCw0YLRiyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICB0aGlzLl90YXJnZXRQdXRoVG9Nb2RlbCA9IGV2ZW50LmRldGFpbC5wdXRoVG9Nb2RlbDsvL9Ch0L7RhdGA0LDQvdC40YLRjCDQv9GD0YLRjCDQtNC+INC80L7QtNC10LvQuC4g0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0YDQuCDRgdC+0LfQtNCw0L3QuNC4INC80L7QtNC10LvQuFxyXG5cclxuICAgICAgICB0aGlzLl9ib3hDcmVhdGVBbmltYWwuY2xvc2VCb3goKTsvL9C30LDQutGA0YvRgtGMINCx0L7QutGBINGBINC20LjQstC+0YLQvdGL0LzQuFxyXG4gICAgICAgIHRoaXMuX2JveENyZWF0ZUFuaW1hbC5vbkJsb2NrKCk7Ly/Qt9Cw0LHQu9C+0LrQuNGA0L7QstCw0YLRjCDQsdC+0LrRgSDRgdC20LjQstC+0YLQvdGL0LzQuFxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQub24oKTsvL9CS0LrQu9GO0YfQuNGC0Ywg0LrQvtGA0LfQuNC90YNcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSBmYWxzZTsvL9C30LDQsdC70L7QutC40YDQvtCy0LDRgtGMINC60LDRgNGC0YNcclxuXHJcbiAgICAgICAgLy/QndC10L7QsdGF0L7QtNC40LzQviDQt9Cw0LrRgNGL0YLRjCDQstGB0LUg0YfRgtC+INGB0LLRj9C30LDQvdC+INGBINC/0YDQvtGI0LvRi9C8INGE0L7QutGD0YHQvtC8XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldEFuaW1hbCAhPSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLmNsb3NlTWVudSgpOy8v0LfQsNC60YDRi9Cy0LDQtdGCINC80LXQvdGOXHJcbiAgICAgICAgICAgIHRoaXMuX2JveENoYXJhY3RlcmlzdGljc0FuaW1hbC5jbG9zZUJveCgpOy8v0LfQsNC60YDRi9GC0Ywg0LHQvtC60YEg0YEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LrQsNC80LhcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsID0gbnVsbDsvL9C+0LHQvdGD0LvRj9C10YIg0YHRgdGL0LvQutGDINC90LAg0L3QvtC0INC20LjQstC+0YLQvdC+0LPQviDQsiDRhNC+0LrRg9GB0LVcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0LXRgNC10YLQsNGB0LrQuNCy0LDQvdC40LUg0LbQuNCy0L7RgtC90L7Qs9C+INC90LDRh9Cw0LvQvtGB0YwuXHJcbiAgICAgKiBAbWV0aG9kIG9uU3RhcnREcmFnQW5kRHJvcEFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25TdGFydERyYWdBbmREcm9wQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0L/Rg9GB0Log0LDQvdC40LzQsNGG0LjQuCDQv9C+0LTQstC10YjQtdC90L3QvtGB0YLQuCAo0YHRgtCw0YDRgiDQv9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNGPKScpO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IGV2ZW50LmRldGFpbC5hbmltYWw7Ly/QkdC10YDQtdC8INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YTQvtC60YPRgVxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IGZhbHNlOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LTQstC40LbQtdC90LjQtSDQutCw0YDRgtGLXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1INC90L7QstC+0LPQviDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAgICAgKiDQntGC0LLQtdGH0LDQtdGCINC30LAg0L/QtdGA0LXQvNC10YnQtdC90LjQtSDQvdC+0LTQsCDQttC40LLQvtGC0L3QvtCz0L4g0L/QviDQutCw0YDRgtC1INC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDQuCDQv9GA0L7QuNC30LLQvtC00LjRgiDQt9Cw0LzQtdGA0Ysg0LTQviDRgNCw0LfQu9C40YfQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQvdCwINC60LDRgNGC0LUuXHJcbiAgICAgKiBAbWV0aG9kIG9uRHJhZ0FuZERyb3BBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uRHJhZ0FuZERyb3BBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9GB0L7QvtCx0YnQsNC10Lwg0LrQvtGA0LfQuNC90LUg0L/QvtC70L7QttC10L3QuNC1INC30LLQtdGA0Y7RiNC60LggKNC/0LXRgNC10YLQsNGB0LrQuNCy0LDQvdC40LUpJyk7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5fY29udHJvbGxlck1hcC5nZXRQb2ludFdpbmRvdyhldmVudC5kZXRhaWwucG9pbnQpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQuc2V0UG9zaXRpb25BbmltYWwocG9pbnQpO1xyXG4gICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLnNldFBvc2l0aW9uKHBvaW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1INC20LjQstC+0YLQvdC+0LPQviDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvblN0b3BEcmFnQW5kRHJvcEFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25TdG9wRHJhZ0FuZERyb3BBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0L/RgNC10LTQtdC70LXQvdC40LUg0LTQsNC70YzQvdC10LnRiNC40YUg0LTQtdC50YHRgtCy0LjQuSDRgSDQttC40LLQvtGC0L3Ri9C8ICjQt9Cw0LLQtdGA0YjQtdC90LjQtSDQv9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1KScpO1xyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRXaW5kb3coZXZlbnQuZGV0YWlsLnBvaW50KTsgLy/Ql9Cw0L/RgNCw0YjQuNCy0LDQtdC8INGC0L7Rh9C60YMg0LIg0YTQvtGA0LzQsNGC0LUg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0L7QutC90LBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQuaXNBbmltYWxMaWZlKHBvaW50KSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5fYXBpLmNyZWF0ZUFuaW1hbCh0aGlzLl90YXJnZXRQdXRoVG9Nb2RlbCwgdGhpcy5ub2RlRmllbGRBbmltYWxzLmNoaWxkcmVuLmxlbmd0aCk7Ly/RgdC+0LfQtNCw0LXQvCDQvNC+0LTQtdC70Ywg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgICAgIGxldCBub2RlTW9kZWwgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLl90YXJnZXRBbmltYWwuY2hpbGRyZW5bMF0pOy8v0YHQvtC30LTQsNC10Lwg0L3QvtC0INC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgICAgICBub2RlTW9kZWwucGFyZW50ID0gdGhpcy5ub2RlRmllbGRBbmltYWxzOy8v0JLQtdGI0LDQtdC8INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0L3QsCDQvdC+0LQg0YHQviDQstGB0LXQvNC4INC20LjQstC+0YLQvdGL0LzQuFxyXG4gICAgICAgICAgICBub2RlTW9kZWwuc2V0UG9zaXRpb24oZXZlbnQuZGV0YWlsLnBvaW50LngsIGV2ZW50LmRldGFpbC5wb2ludC55KTsvL9Cj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INC/0L7Qt9C40YbQuNGOINC90LAg0LrQsNGA0YLQtVxyXG4gICAgICAgICAgICBub2RlTW9kZWwuYWRkQ29tcG9uZW50KCdjb250cm9sbGVyLWFuaW1hbCcpOy8v0JTQvtCx0LDQstC70Y/QtdC8INC60L7QvdGC0YDQvtC70LvQtdGAINGC0LXQu9GDINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgICAgICBub2RlTW9kZWwuZ2V0Q29tcG9uZW50KCdjb250cm9sbGVyLWFuaW1hbCcpLnNldHRpbmdzKG1vZGVsKTsvL9Cd0LDRgdGC0YDQsNC40LLQsNC8INC60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgICAgICBub2RlTW9kZWwuZ2V0Q29tcG9uZW50KCdjb250cm9sbGVyLWFuaW1hbCcpLnJ1bigpOy8v0JfQsNC/0YPRgdC60LDQtdGCINC20LjQt9C90Ywg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQub25CYWRXb3JrQmFza2V0KCk7Ly/QlNCw0YLRjCDQutC+0LzQsNC90LTRgyDQutC+0YDQt9C40L3QtSjQvdC1INGB0LXQudGH0LDRgSlcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udHJvbGxlckJhc2tldC5vbkdvb2RXb3JrQmFza2V0KCk7Ly/QlNCw0YLRjCDQutC+0LzQsNC90LTRgyDQutC+0YDQt9C40L3QtSjRgNCw0LHQvtGC0LDRgtGMKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLmRlc3Ryb3koKTsvL9Cj0LTQsNC70LjRgtGMINCy0YDQtdC80LXQvdC90YvQuSDQvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckJhc2tldC5vZmYoKTsvL9Cy0YvRgNGD0LHQuNGC0Ywg0LrQvtGA0LfQuNC90YNcclxuICAgICAgICB0aGlzLl9ib3hDcmVhdGVBbmltYWwub2ZmQmxvY2soKTsvL9Cy0YvRgNGD0LHQuNGC0Ywg0LHQu9C+0LrQuNGA0L7QstC60YMg0L3QuNC20L3QtdCz0L4g0LHQvtC60YHQsFxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IHRydWU7Ly/RgNCw0LfQsdC70L7QutC40YDQvtCy0LDRgtGMINC00LLQuNC20LXQvdC40LUg0LrQsNGA0YLRi1xyXG5cclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBudWxsOy8v0L7QsdC90YPQu9C40YLRjCAg0LbQuNCy0L7RgtC90L7QtSDQsiDRgtCw0YDQs9C10YLQtVxyXG4gICAgICAgIHRoaXMuX3RhcmdldFB1dGhUb01vZGVsID0gbnVsbDsvL9C+0LHQvdGD0LvQuNGC0Ywg0L/Rg9GC0Ywg0LTQviDQvNC+0LTQtdC70Lgg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5ub2RlTWFza0NyZWF0ZWRBbmltYWwuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUuc2xlZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNGH0LDQu9C+INC00LLQuNC20LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICogQG1ldGhvZCBvblN0YXJ0TW90aW9uQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblN0YXJ0TW90aW9uQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICAvL9CX0LDQutGA0YvQstCw0Y4g0LzQtdC90Y4g0LjQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQttC40LLQvtGC0L3QvtC8INC10YHQu9C4INC/0LXRgNC10LrQu9GO0YfQsNGO0YHRjCDQvdCwINC00YDRg9Cz0L7QtSDQttC40LLQvtGC0L3QvtC1XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldEFuaW1hbCAhPSBudWxsICYmIHRoaXMuX3RhcmdldEFuaW1hbC5fbW9kZWwuaWQgIT0gZXZlbnQuZGV0YWlsLmNvbnRyb2xsZXIuX21vZGVsLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7Ly/Qt9Cw0LrRgNGL0YLRjCDQvNC10L3RjlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2MubG9nKCfQvdCw0YfQuNC90LDRjiDQtNCy0LjQs9Cw0YLRjNGB0Y8g0LfQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvCjQndCw0YfQuNC90LDRjiDQstGL0Y7QvtGAINC00LLQuNCz0LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC60YDRi9GC0Ywg0LzQtdC90Y4pJyk7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5fY29udHJvbGxlck1hcC5nZXRQb2ludE1hcChldmVudC5kZXRhaWwuc3RhcnRNb3Rpb24pOy8v0LrQvtC90LLQtdGA0YLQuNGA0YPQtdC8INGC0L7Rh9C60YMg0L7QutC90LAg0Log0YLQvtGH0LrRgyDQutCw0YDRgtGLXHJcblxyXG4gICAgICAgIHRoaXMuX3BvaW50VGFyZ2V0QW5pbWFsID0gY2MudjIocG9pbnQueCwgcG9pbnQueSk7Ly8g0LfQsNC00LDQtdC8INGC0L7Rh9C60YMg0LrRg9C00LAg0L3QsNC00L4g0LTQvtGB0YLQsNCy0LjRgtGMINC20LjQstC+0YLQvdC1XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbCA9IGV2ZW50LmRldGFpbC5jb250cm9sbGVyOy8v0L/QvtC70YPRh9Cw0LXQvCDQutC+0L3RgtGA0L7Qu9C70LXRgCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBldmVudC5kZXRhaWwuY29udHJvbGxlcjsvL9GD0YHRgtCw0L3QvtCy0LjQu9C4INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0L3QsCDRhNC+0LrRg9GBXHJcblxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IGZhbHNlOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG5cclxuICAgICAgICAvL9GD0LLQtdC70LjRh9C40Lwg0L/QvtC70LUg0L7RgtC60LvQuNC60LAg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0U2l6ZVdpdGggPSB0aGlzLl90YXJnZXRBbmltYWwubm9kZS53aWR0aDtcclxuICAgICAgICB0aGlzLl90YXJnZXRTaXplSGVpZ2h0ID0gdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LLQuNC20LXQvdC40LUg0LbQuNCy0L7RgtC90L7Qs9C+INC30LAg0LLQtdC00YPRidC40LwuXHJcbiAgICAgKiBAbWV0aG9kIG9uTW90aW9uQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbk1vdGlvbkFuaW1hbChldmVudCl7XHJcbiAgICAgICAgLy/QvtCx0YDQsNCx0L7RgtC60LAg0YHQvtCx0YvRgtC40Lkg0YEg0LbQuNCy0L7RgtC90YvQvCDQstC+INCy0YDQtdC80Y8g0LTQstC40LbQtdC90LjRj1xyXG4gICAgICAgIGNjLmxvZygn0LTQstC40LPQsNGO0YHRjCDQt9CwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8Jyk7XHJcbiAgICAgICAgLy/Rg9Cy0LXQu9C40YfQuNC8INC/0L7Qu9C1INC+0YLQutC70LjQutCwINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbC5ub2RlLndpZHRoID0gMjAwMDtcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubm9kZS5oZWlnaHQgPSAyMDAwO1xyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRNYXAoZXZlbnQuZGV0YWlsLnBvaW50RW5kKTsvLyDQutC+0L3QstC10YDRgtC40YDRg9C10Lwg0YLQvtGH0LrRgyDQvtC60L3QsCDQuiDRgtC+0YfQutC1INC60LDRgNGC0YtcclxuICAgICAgICB0aGlzLl9wb2ludFRhcmdldEFuaW1hbCA9IGNjLnYyKHBvaW50LngsIHBvaW50LnkpOy8vINCy0YvRh9C40YHQu9GP0LXQvCDRgtC+0YfQutGDINC60YPQtNCwINC/0L7QudC00LXRgiDQttC40LLQvtGC0L3QvtC1INCyINC40YLQvtCz0LVcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubW92ZVRvUG9pbnQodGhpcy5fcG9pbnRUYXJnZXRBbmltYWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LrQvtC90YfQsNC90LjQtSDQtNCy0LjQttC10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25FbmRNb3Rpb25BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uRW5kTW90aW9uQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C30LDQutCw0L3Rh9C40LLQsNGOINC00LLQuNCz0LDRgtGM0YHRjyDQt9CwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8Jyk7XHJcblxyXG4gICAgICAgIC8v0YPQvNC10L3RjNGI0LDQtdC8INC/0LvQvtGJ0LDQtNGMINC/0L7QutGA0YvRgtC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUud2lkdGggPSB0aGlzLl90YXJnZXRTaXplV2l0aDtcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubm9kZS5oZWlnaHQgPSB0aGlzLl90YXJnZXRTaXplSGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcG9pbnQgPSB0aGlzLl9jb250cm9sbGVyTWFwLmdldFBvaW50TWFwKGV2ZW50LmRldGFpbC5wb2ludEVuZCk7Ly8g0LrQvtC90LLQtdGA0YLQuNGA0YPQtdC8INGC0L7Rh9C60YMg0L7QutC90LAg0Log0YLQvtGH0LrQtSDQutCw0YDRgtGLXHJcbiAgICAgICAgdGhpcy5fcG9pbnRUYXJnZXRBbmltYWwgPSBjYy52Mihwb2ludC54LCBwb2ludC55KTsvLyDQstGL0YfQuNGB0LvRj9C10Lwg0YLQvtGH0LrRgyDQutGD0LTQsCDQv9C+0LnQtNC10YIg0LbQuNCy0L7RgtC90L7QtSDQsiDQuNGC0L7Qs9C1XHJcbiAgICAgICAgLy/RgdC+0L7QsdGJ0LDQtdC8INC80L7QtNC10LvQuCDRgtC+0YfQutGDINC00L4g0LrQvtGC0L7RgNC+0Lkg0L3QtdC+0LHRhdC+0LTQuNC80L4g0LXQuSDQtNC+0LnRgtC4XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLm1vdmVUb1BvaW50KHRoaXMuX3BvaW50VGFyZ2V0QW5pbWFsKTtcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSB0cnVlOyAvLyDQoNCw0LfQsdC70L7QutC40YDQvtCy0LDQu9C4INC60LDRgNGC0YNcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4g0L7RgtC60YDRi9GC0L4uXHJcbiAgICAgKiBAbWV0aG9kIG9uT3Blbk1lbnVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3Blbk1lbnVBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0J7RgtC60YDRi9Cy0LDRjiDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4nKTtcclxuICAgICAgICAvL9Cm0LXQvdGC0YDQuNGA0L7QstCw0YLRjCDQttC40LLQvtGC0L3QvtC1XHJcbiAgICAgICAgbGV0IHBvaW50ID0gY2MudjIodGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUueCAtIHRoaXMuX2NlbnRyZVdpbmRvd1BvaW50LngsIHRoaXMuX3RhcmdldEFuaW1hbC5ub2RlLnkgLSB0aGlzLl9jZW50cmVXaW5kb3dQb2ludC55KTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hcC5tb3ZlQWN0aW9ucyhwb2ludCwgMC4yNSk7Ly/Qv9C10YDQtdC80LXRgdGC0LjRgtGMINGG0LXQvdGC0YAg0LrQsNC80LXRgNGLINC90LAg0Y3RgtGDINGC0L7Rh9C60YMg0LfQsCAwLjI1INGB0LXQutGD0L3QtNGLXHJcblxyXG4gICAgICAgIC8v0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0L3QsNGB0YLRgNC+0LnQutC4INC00LvRjyDQvNC10L3RjlxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJDaXJjdWxhck1lbnUuc2V0dGluZ3ModGhpcy5fY29udHJvbGxlckFuaW1hbCk7XHJcblxyXG4gICAgICAgIC8v0LfQsNC/0L7Qu9C90LjRgtGMINCx0L7QutGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6LCwsXHJcblxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IGZhbHNlOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG4gICAgICAgIHRoaXMuX3N0YXRlR2FtZSA9IFN0YXRHYW1lLm9wZW5NZW51O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXQvdGOINC20LjQstC+0YLQvdC+0LPQviDQt9Cw0LrRgNGL0YLQvi5cclxuICAgICAqIEBtZXRob2Qgb25DbG9zZU1lbnVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VNZW51QW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQl9Cw0LrRgNGL0LLQsNGOINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvicpO1xyXG4gICAgICAgIHRoaXMubm9kZU1lbnVBbmltYWwuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ub2RlQm94TWFwLmdldENvbXBvbmVudChjYy5TY3JvbGxWaWV3KS5lbmFibGVkID0gdHJ1ZTsvL9GA0LDQt9Cx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG4gICAgICAgIHRoaXMuX2JveENoYXJhY3RlcmlzdGljc0FuaW1hbC5jbG9zZUJveCgpO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUuc2xlZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQuNC30LTQsNC70L4g0LfQstGD0LouXHJcbiAgICAgKiBAbWV0aG9kIG9uVm9pY2VBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVm9pY2VBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0LbQuNCy0L7RgtC90L7QtSDQv9GA0L7Rj9Cy0LjQu9C+INCz0L7Qu9C+0YEnKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1blZvaWNlKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQltC40LLQvtGC0L3QvtC1INGB0LXQu9C+XHJcbiAgICAgKiBAbWV0aG9kIG9uU2l0QW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblNpdEFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INGB0LXQu9C+Jyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5TaXQoKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLmNsb3NlTWVudSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCW0LjQstC+0YLQvdC+0LUg0LjRgdC/0YPQs9Cw0LvQvtGB0YxcclxuICAgICAqIEBtZXRob2Qgb25GcmlnaHRlbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25GcmlnaHRlbkFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC40YHQv9GD0LPQsNC70L7RgdGMJyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5GcmlnaHRlbigpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0LDRgNC10LDQu9GLINGH0YPQstGB0YLQslxyXG4gICAgICogQG1ldGhvZCBvbkFyZWFsQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkFyZWFsQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C20LjQstC+0YLQvdC+0LUg0L/QvtC60LDQt9Cw0LvQviDRgdCy0L7QuSDQsNGA0LXQsNC7Jyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5BcmVhbCgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQv9C+0LPQu9Cw0LTQuNC70Lgs0L/QvtC20LDQu9C10LvQuFxyXG4gICAgICogQG1ldGhvZCBvbkNhcmVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2FyZUFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC/0L7Qs9C70LDQtNC40LvQuCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwucnVuQ2FyZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQu9C10LPQu9C+XHJcbiAgICAgKiBAbWV0aG9kIG9uTGllQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkxpZUFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC70LXQs9C70L4nKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1bkxpZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQv9GA0LjQs9C+0YLQvtCy0LjQu9C+0YHRjFxyXG4gICAgICogQG1ldGhvZCBvbkF0dGVudGlvbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25BdHRlbnRpb25BbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0LbQuNCy0L7RgtC90L7QtSDQv9GA0LjQs9C+0YLQvtCy0LjQu9C+0YHRjCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwucnVuQXR0ZW50aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQkdC+0LrRgSDRhdCw0YDQsNC60YLRgNC40YHRgtC40Log0LbQuNCy0L7RgtC90L7Qs9C+INC+0YLQutGA0YvQu9GB0Y8uXHJcbiAgICAgKiBAbWV0aG9kIG9uT3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0YLQutGA0YvQu9GB0Y8gQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2JveENyZWF0ZUFuaW1hbC5jbG9zZUJveCgpO1xyXG4gICAgICAgIC8v0LfQsNC/0L7Qu9C90Y/QtdGCINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuICAgICAgICBsZXQgbWFzcyA9IHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuZ2V0Q2hhcmFjdGVyaXN0aWNzKCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwuY29udGVudDtcclxuXHJcbiAgICAgICAgbGV0IG5vZGVQYXJhbTtcclxuICAgICAgICAvL9GH0LjRgdGC0LjQvCDQv9GA0LXQtNGL0LTRg9GJ0LjQtSDQt9Cw0L/QuNGB0LhcclxuICAgICAgICBjb250ZW50LmNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5kZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v0J3QsNGH0LjQvdCw0LXQvCDQt9Cw0L/QvtC70L3QtdC90LjQtVxyXG4gICAgICAgIG5vZGVQYXJhbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3MpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5hZGRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MubmFtZTtcclxuICAgICAgICBub2RlUGFyYW0uY29sb3IgPSB0aGlzLmNvbG9yVGV4dENoYXJhY3RlcmlzdGljcztcclxuICAgICAgICBjb250ZW50LmFkZENoaWxkKG5vZGVQYXJhbSk7XHJcblxyXG4gICAgICAgIG5vZGVQYXJhbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3MpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5hZGRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MuY3VycmVudFN0YXRlO1xyXG4gICAgICAgIG5vZGVQYXJhbS5jb2xvciA9IHRoaXMuY29sb3JUZXh0Q2hhcmFjdGVyaXN0aWNzO1xyXG4gICAgICAgIGNvbnRlbnQuYWRkQ2hpbGQobm9kZVBhcmFtKTtcclxuXHJcbiAgICAgICAgbGV0IHZyOy8v0LLRgNC10LzQtdC90L3QsNGPINC/0LXRgNC10LzQtdC90L3QsNGPINGD0LfQu9C+0LJcclxuICAgICAgICAvL9C30LDQv9C+0LvQvdGP0LXQvCDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutC4XHJcbiAgICAgICAgaWYgKG1hc3MucGFyYW0ubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXNzLnBhcmFtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlUGFyYW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnByZWZhYlBhcmFtZXRyQ2hhcmFjdGVyaXN0aWNzKTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQuYWRkQ2hpbGQobm9kZVBhcmFtKTtcclxuICAgICAgICAgICAgICAgIG5vZGVQYXJhbS54ID0gMDtcclxuICAgICAgICAgICAgICAgIHZyID0gbm9kZVBhcmFtLmdldENoaWxkQnlOYW1lKCduYW1lJyk7XHJcbiAgICAgICAgICAgICAgICB2ci5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MucGFyYW1baV0ubmFtZTtcclxuICAgICAgICAgICAgICAgIHZyLmNvbG9yID0gdGhpcy5jb2xvclRleHRDaGFyYWN0ZXJpc3RpY3M7XHJcbiAgICAgICAgICAgICAgICB2ciA9IG5vZGVQYXJhbS5nZXRDaGlsZEJ5TmFtZSgndmFsdWUnKTtcclxuICAgICAgICAgICAgICAgIHZyLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbWFzcy5wYXJhbVtpXS52YWx1ZS50b1N0cmluZygpICsgbWFzcy5wYXJhbVtpXS51bml0O1xyXG4gICAgICAgICAgICAgICAgdnIuY29sb3IgPSB0aGlzLmNvbG9yVGV4dENoYXJhY3RlcmlzdGljcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQkdC+0LrRgSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQuiDQttC40LLQvtGC0L3QvtCz0L4g0LfQsNC60YDRi9C70YHRjy5cclxuICAgICAqIEBtZXRob2Qgb25DbG9zZUJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0LrRgNGL0LvRgdGPIEJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YHQvtCx0YvRgtC40LUg0LDQutGC0LjQstC90L7Qs9C+INC/0YDQtdC00LLQutGD0YjQtdC90LjRjy5cclxuICAgICAqIEBtZXRob2Qgb25CYXNrZXRBY3RpdmVcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQmFza2V0QWN0aXZlKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQutC+0YDQt9C40L3QsCDQv9GA0L7Rj9Cy0LvRj9C10YIg0LDQutGC0LjQstC90L7RgdGC0YwnKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YDQtdC20LjQvCDRgdC90LAuXHJcbiAgICAgKiBAbWV0aG9kIG9uQmFza2V0U2xlZXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQmFza2V0U2xlZXAoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C60L7RgNC30LjQvdCwINGB0L/QuNGCJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YDQtdC20LjQvCDRgNCw0LHQvtGC0YsgKNCS0L7RgiDQstC+0YIg0YHQsdGA0L7RgdGP0YIg0LbQuNCy0L7RgtC90L7QtSkuXHJcbiAgICAgKiBAbWV0aG9kIG9uQmFza2V0V29ya1xyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25CYXNrZXRXb3JrKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQutC+0YDQt9C40L3QsCDQvdCw0LTQtdC10YLRgdGPINGH0YLQviDQstC+0YIg0LLQvtGCINCyINC90LXQtSDQv9C+0L/QsNC00LXRgiDQttC40LLQvtGC0L3QvtC1Jyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC90LDRh9Cw0LvQsCDRgNCw0LHQvtGC0Ysg0YEg0LrQsNGA0YLQvtC5LlxyXG4gICAgICogQG1ldGhvZCBvblRvdWNoT25NYXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hPbk1hcChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0J3QsNGH0LDQuyDRgNCw0LHQvtGC0YMg0YEg0LrQsNGA0YLQvtC5Jyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC00LLQuNC20LXQvdC40Y8g0LrQsNGA0YLRiy5cclxuICAgICAqIEBtZXRob2Qgb25Ub3VjaE1vdmVPbk1hcFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE1vdmVPbk1hcChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0JTQstC40LPQsNC10YIg0LrQsNGA0YLRgycpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC30LDQstC10YDRiNC10L3QuNGPINGA0LDQsdC+0YLRiyDRgSDQutCw0YDRgtC+0LkuXHJcbiAgICAgKiBAbWV0aG9kIG9uVG91Y2hFbmRNb3ZlT25NYXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmRNb3ZlT25NYXAoZXZlbnQpe1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc3RhdGVHYW1lID09PSBTdGF0R2FtZS5zbGVlcCkge1xyXG4gICAgICAgICAgICBjYy5sb2coJ9C30LDQstC10YDRiNC40Lsg0YDQsNCx0L7RgtGDINGBINC60LDRgNGC0L7QuScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0LLQtdC00LXQvdC40LUg0YbQtdC90YLRgNCwINC60LDQvNC10YDRiyDQvdCwINC20LjQstC+0YLQvdC+0LUg0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25GaW5pc2hNb3ZlQ2FtZXJhVG9BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uRmluaXNoTW92ZUNhbWVyYVRvQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICB0aGlzLm5vZGVNZW51QW5pbWFsLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub2RlTWVudUFuaW1hbC5zZXRQb3NpdGlvbih0aGlzLl9jZW50cmVXaW5kb3dQb2ludC54LCB0aGlzLl9jZW50cmVXaW5kb3dQb2ludC55KTtcclxuICAgICAgICB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwub3BlbkJveCgpO1xyXG4gICAgfSxcclxuXHJcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=