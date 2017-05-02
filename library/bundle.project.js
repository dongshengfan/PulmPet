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
        AnimalBuilder.prototype.create = function (model) {
            var systems = model.systems,
                scales = model.scales,
                communication = model.communication;
            this.masScales = [];
            this.masSystems = [];
            var communicator = this.createScales(scales).createSystems(systems).createCommunicator(communication);
            var animal = new Animals.Animal(this.masSystems);
            animal.communicator = communicator;
            return animal;
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
        }
        Object.defineProperty(Animal.prototype, "muscular", {
            set: function set(param) {
                if (param) {
                    this._muscular = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "circulatory", {
            set: function set(param) {
                if (param) {
                    this._circulatory = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "navigation", {
            set: function set(param) {
                if (param) {
                    this._navigation = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "communicator", {
            set: function set(param) {
                this._communicator = param;
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
        Animal.prototype.moveToPoint = function (point) {};
        Animal.prototype.getCharacteristics = function () {
            return {
                name: 'Животное',
                currentState: 'Бегу',
                param: [{
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
                }]
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
                    var event = Math.sign(params) ? Animals.Communications.BehaviorScaleTypes.increase : Animals.Communications.BehaviorScaleTypes.decrease;
                    var pack = {
                        behavior: event,
                        type: this._type
                    };
                    this.communicator.publish(pack, params);
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
var lion = {
    systems: [{
        type: Animals.Systems.SystemTypes.muscular,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.weight }]
    }, {
        type: Animals.Systems.SystemTypes.circulatory,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.pressure }, { type: Animals.Scales.ParameterScaleTypes.heartbeat }]
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
    }]
};
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
                deltaMotion: delta
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
        // cc.log(event);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvYmFza2V0cy9iYXNrZXQtYW5pbWFsLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9ib3hlcy9ib3gtY2hhcmFjdGVyaXN0aWNzLWFuaW1hbC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvYm94ZXMvYm94LWNyZWF0ZS1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2JveGVzL2JveC1tZW51LXBsYXkuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2JveGVzL2JveC1zYW1wbGVzL2JveC5qcyIsImFzc2V0cy9zY3JpcHRzL2J1aWxkL2J1aWxkLXRzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9jaXJjdWxhci1saXN0L2NpcmN1bGFyLWxpc3QtYWN0aW9ucy1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NpcmN1bGFyLWxpc3QvY2lyY3VsYXItbGlzdC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLWFuaW1hbC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLWNyZWF0ZS1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1tYXAuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1tZW51LXBsYXkuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1zY3JvbGwtYm94LWNoYXJhY3RlcmlzdGljLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9mYWN0b3J5LWFuaW1hbC1wcmVmYWIvZmFjdG9yeS1hbmltYWwtcHJlZmFiLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9jaXJjdWxhci1saXN0L2xpc3QuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL3NjZW5lL3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7OztBQVFBOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFIZ0I7O0FBTXBCOzs7OztBQUtBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFJSjs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUdEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7OztBQU9BO0FBQTZCOztBQUN6QjtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNBO0FBQ0o7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0E7QUFGb0I7QUFJeEI7QUFDSTtBQUNBO0FBRmtCO0FBSXRCO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0E7QUFGb0I7QUFJeEI7QUFDSTtBQUNBO0FBRmtCO0FBSXRCO0FBQ0k7QUFDQTtBQUZzQjs7QUFLMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0M7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQXlCO0FBQ3JCO0FBQ0E7QUFDSDtBQUNEO0FBQXdCO0FBQ3BCO0FBQ0E7QUFDSDtBQUNEO0FBQXVCO0FBQ25CO0FBQ0E7QUFDSDtBQVpMO0FBY0g7QUFDSjtBQXhMSTs7Ozs7Ozs7OztBQ3ZCVDs7QUFDQTs7OztBQUlBO0FBQ0k7O0FBRUE7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUQ7OztBQUlBOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7QUEvQ21DOzs7Ozs7Ozs7O0FDTHhDOztBQUVBOzs7O0FBSUE7QUFDSTs7QUFFQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDSDtBQTVDMEI7Ozs7Ozs7Ozs7QUNIL0I7O0FBQ0E7Ozs7QUFJQTtBQUNJOztBQUVBOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVEOzs7QUFJQTs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFHRDs7OztBQUlBO0FBQ0k7QUFDSDtBQXhEc0I7Ozs7Ozs7Ozs7Ozs7OztBQ1IzQjs7Ozs7OztBQU9BOzs7O0FBSUE7QUFDSTtBQUNBO0FBRmE7O0FBS2pCOzs7Ozs7Ozs7QUFTQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFKWTtBQU1oQjs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFRDtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTs7O0FBSUE7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7QUFDRDtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNLO0FBQ0o7QUFDSTtBQUNKO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFHSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0Q7QUFDSDtBQTlQYzs7Ozs7Ozs7Ozs7Ozs7QUN2Q25CO0FBQ0k7QUFBaUI7QUFBakI7QUFDZ0I7QUFBdUI7QUFDdkM7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBRUE7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBUGdEO0FBU3BEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFQbUQ7QUFTdkQ7QUFDSTtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVBrRDtBQVN0RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFMb0Q7QUFPeEQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjBDO0FBVTlDO0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUVRO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBbENEO0FBeUNWO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUnlEO0FBVTdEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSeUQ7QUFVN0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUmtEO0FBVXREO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVIrRDtBQVVuRTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSK0Q7QUFVbkU7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUnVEO0FBVTNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFFQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSNEM7QUFVaEQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFUMkM7QUFXL0M7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFUMkM7QUFXL0M7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFUK0M7QUFXbkQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFUK0M7QUFXbkQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjRDO0FBVWhEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSNEQ7QUFVaEU7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjJEO0FBVS9EO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFGTztBQUlYO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVnNEO0FBWTFEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWcUQ7QUFZekQ7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWK0M7QUFZbkQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZnRDtBQVlwRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZzRDtBQVkxRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVndEO0FBWTVEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWeUQ7QUFZN0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZ1RDtBQVkzRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVnVEO0FBWTNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNJO0FBRVE7QUFDQTtBQUZKO0FBU0k7QUFDQTtBQUZKO0FBUUo7QUFFUTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEk7QUFIWjtBQVlJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMSTtBQUhaO0FBWUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEk7QUFIWjtBQVlKO0FBRVE7QUFDQTtBQUVRO0FBQ0E7QUFDQTtBQUNBO0FBSko7QUFIUjtBQWVJO0FBQ0E7QUFFUTtBQUNBO0FBQ0E7QUFDQTtBQUpKO0FBSFI7QUEvRUc7QUErRlg7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFkMEM7QUFnQjlDO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVm1EO0FBWXZEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVitDO0FBWW5EO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVjhDO0FBWWxEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozs7Ozs7O0FDcmtDQTs7QUFFQTs7Ozs7QUFLQTtBQUNJOztBQUVBOzs7OztBQUtBO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIOztBQUVEO0FBQ0g7QUFuQm9DOzs7Ozs7Ozs7Ozs7Ozs7QUNQekM7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0E7O0FBR0o7Ozs7QUFJQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFFSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUFxQjs7QUFDakI7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDs7QUFFRDs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7O0FBRUQ7Ozs7O0FBS0E7QUFBeUI7O0FBQ3JCO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDSjs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVBO0FBQ0o7QUFDSjs7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUF1Qjs7QUFDbkI7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUF0UHVCOzs7Ozs7Ozs7Ozs7QUNoQjVCOzs7QUFHQTtBQUNJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUdKO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBR0Q7OztBQUdBO0FBQ0k7QUFDSDs7O0FBR0Q7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFEYTtBQUdqQjtBQUNIO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDQTtBQUNIO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQztBQUVKOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFEYTtBQUdqQjtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFEYTtBQUdqQjtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7QUFHQTs7O0FBSUE7OztBQUdBOzs7QUFJQTs7O0FBR0E7OztBQUlBOzs7QUFHQTs7O0FBSUE7OztBQUdBOzs7QUFJQTs7O0FBR0E7OztBQUlBOzs7QUFHQTs7O0FBSUE7Ozs7QUFJQTtBQUNJO0FBQ0g7QUFoTkk7Ozs7Ozs7Ozs7QUNIVDtBQUNJOztBQUVBOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7O0FBRUE7QUFDSDtBQXJESTs7Ozs7Ozs7OztBQ0FUOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBR0o7O0FBRUk7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0M7QUFDSjs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNGO0FBQ007QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0w7QUFDQzs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQXFCOztBQUNqQjtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUE0Qjs7QUFDeEI7QUFDQTtBQUNBO0FBR0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQXBKSTs7Ozs7Ozs7OztBQ0pUOzs7QUFHQTtBQUNJOztBQUVBOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBOzs7QUFJQTs7OztBQUlBOzs7QUFJQTs7OztBQUlBO0FBaENLOzs7Ozs7Ozs7O0FDSFQ7Ozs7QUFJQTs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHSjs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTs7O0FBSUE7Ozs7O0FBS0E7QUFBbUI7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKOzs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDQTtBQUNIO0FBM0U2Qzs7Ozs7Ozs7Ozs7OztBQ1JsRDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7Ozs7QUFJQTtBQUNFO0FBQ0M7QUFDQztBQUNIOzs7QUFFRDs7OztBQUlBO0FBQWdCOztBQUNaO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFGYTtBQUlqQjtBQUNIO0FBQ0o7OztBQUVEOzs7Ozs7QUFNQTtBQUNJOztBQUVBO0FBQ0g7QUEvQzhCOzs7Ozs7Ozs7Ozs7QUNBbkM7O0FBRUE7Ozs7QUFJQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQXZFSTs7Ozs7Ozs7OztBQ05UOztBQUVBOzs7Ozs7Ozs7O0FBVUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTGE7O0FBUWpCOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUdKOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBRUo7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBRUg7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFFSDtBQUNKOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0E7O0FBR0g7OztBQUVEOzs7Ozs7QUFNQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUFDRztBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUVIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNJO0FBQ0g7QUFDSjs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0g7QUE1aEJJIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEVudW0g0YHQvtGB0YLQvtGP0L3QuNC5INC60L7RgNC30LjQvdGLLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTdGF0ZUJhc2tldFxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2xlZXAg0LrQvtGA0LfQuNC90LAg0L/RgNC+0YHRgtC+INC+0YLQutGA0YvRgtCwLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gYWN0aXZlINGH0YPQstGB0YLQstGD0LXRgiDRh9GC0L4g0LbQuNCy0L7RgtC90L7QtSDQs9C00LUt0YLQviDRgNGP0LTQvtC8LlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gd29yayDRgNCw0LHQvtGC0LDQtdGCINGBINC/0L7Qv9Cw0LLRiNC40LzRgdGPINC20LjQstC+0YLQvdGL0LwuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCi0LjQv9GLINGB0L7RgdGC0L7Rj9C90LjQuSDQutC+0YDQt9C40L3Riy5cclxuICogQHR5cGUge1N0YXRlQmFza2V0fVxyXG4gKi9cclxuY29uc3QgU3RhdGVCYXNrZXQgPSB7XHJcbiAgICBzbGVlcDogMCxcclxuICAgIGFjdGl2ZTogMSxcclxuICAgIHdvcms6IDIsXHJcbn07XHJcblxyXG4vKipcclxuICog0J7RgdGD0YnQtdGB0YLQstC70Y/QtdGCINGA0LDQsdC+0YLRgyDRgSDQutC+0YDQt9C40L3QvtC5LFxyXG4gKiDQkNC90LjQvNCw0YbQuNC4LCDRh9Cw0YHRgtC40YbRiyDQuCDQv9GA0L7Rh9C10LUuXHJcbiAqIEBjbGFzcyBiYXNrZXQtYW5pbWFsXHJcbiAqL1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9sZWZ0UG9pbnRCb3R0b206IG51bGwsLy/Qu9C10LLQsNGPINC90LjQttC90Y/RjyDRgtC+0YfQutCwINC+0LHQu9Cw0YHRgtC4INC/0L7Qs9C70LDRidC10L3QuNGPINC20LjQstC+0YLQvdGL0YVcclxuICAgICAgICBfcmlnaHRQb2ludFRvcDogbnVsbCwvL9C/0YDQsNCy0LDRjyDQstC10YDRhdC90Y/Rj9GC0L7Rh9C60LAg0L7QsdC70LDRgdGC0Lgg0L/QvtCz0LvQsNGJ0LXQvdC40Y8g0LbQuNCy0L7RgtC90YvRhVxyXG4gICAgICAgIF9jZW50cmVQb2ludEJhc2tldDogbnVsbCwvL9GG0LXQvdGC0YDQsNC70YzQvdCw0Y8g0YLQvtGH0LrQsCDQvtCx0LvQsNGB0YLQuCDQv9C+0LPQu9Cw0YnQtdC90LjRj1xyXG4gICAgICAgIF9zdGF0ZUJhc2tldDogbnVsbCwvL9GB0L7RgdGC0L7Rj9C90LjQtSDQutC+0YDQt9C40L3Ri1xyXG5cclxuICAgICAgICBhbnRpY2lwYXRpb246IDE1MCwvL9GA0LDRgdGB0YLQvtGP0L3QuNC1INC00LvRjyDQv9GA0LjQvdGP0YLQuNGPINGB0L7RgdGC0L7Rj9C90LjQuSDQstC30LLQvtC70L3QvtCy0LDQvdC90L7RgdGC0LhcclxuICAgICAgICBvcGFjaXR5T246IDI1NSwvL9C/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQuiDQutC+0YLQvtGA0L7QuSDRgdGC0YDQtdC80LjRgtGB0Y8g0L/RgNC4INCy0LrQu9GO0YfQtdC90LjQuFxyXG4gICAgICAgIG9wYWNpdHlPZmY6IDEwLCAvL9C/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQuiDQutC+0YLQvtGA0L7QuSDRgdGC0LXQvNC40YLRgdGPINC/0L7RgdC70LUg0LLRi9C60LvRjtGH0LXQvdC40Y9cclxuICAgICAgICB0aW1lOiAxLC8v0LLRgNC10LzRjyDQt9CwINC60L7RgtC+0YDQvtC1INC/0YDQvtC40YHRhdC+0LTQuNGCINC+0YLQutGA0YvRgtC40LUg0LjQu9C4INC30LDQutGA0YvRgtC40LVcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0L3QtdC/0L7RgdGA0LXQtNGB0YLQstC10L3QvdC+INGB0YDQsNC30YMg0L/QvtGB0LvQtSDQt9Cw0LPRgNGD0LfQutC4INC60L7QvNC/0L7QvdC10L3RgtCwLlxyXG4gICAgICogQG1ldGhvZCBzdGFydFxyXG4gICAgICovXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzU3RhdHVzID0gdGhpcy5fc3RhdGVCYXNrZXQgPSBTdGF0ZUJhc2tldC5hY3RpdmU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0LfQsNC/0YPRgdGC0LjQu9Cw0YHRjC4g0JfQsNC/0YPRgdC60LDQtdGCINC60L7RgNC30LjQvdGDKNCy0LrQu9GO0YfQsNC10YIpXHJcbiAgICAgKiBAbWV0aG9kIG9uXHJcbiAgICAgKi9cclxuICAgIG9uKCl7XHJcbiAgICAgICAgLy90aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmpvYldpdGhPcGFjaXR5KHRoaXMub3BhY2l0eU9uLCB0aGlzLnRpbWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQutC70Y7Rh9C10L3QuNC1INC60L7RgNC30LjQvdGLLtCS0YvQutC70Y7Rh9Cw0LXRgiDQutC+0YDQt9C40L3Rgy5cclxuICAgICAqIEBtZXRob2Qgb2ZmXHJcbiAgICAgKi9cclxuICAgIG9mZigpe1xyXG4gICAgICAgIHRoaXMuam9iV2l0aE9wYWNpdHkodGhpcy5vcGFjaXR5T2ZmLCB0aGlzLnRpbWUpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10LDQutGG0LjRjyDQutC+0YDQt9C40L3RiyDQvdCwINC/0YDQuNCx0LvQuNC20LDRjtGJ0LXQtdGB0Y8g0LbQuNCy0L7RgtC90L7QtS5cclxuICAgICAqIEBtZXRob2Qgb25TdGF0dXNBY3RpdmVCYXNrZXRcclxuICAgICAqL1xyXG4gICAgb25TdGF0dXNBY3RpdmVCYXNrZXQoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnYmFza2V0QWN0aXZlJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0YHRgtC+0Y/QvdC40LUg0YHQvdCwINCy0LrQu9GO0YfQuNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvblN0YXR1c1NsZWVwQmFza2V0XHJcbiAgICAgKi9cclxuICAgIG9uU3RhdHVzU2xlZXBCYXNrZXQoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnYmFza2V0U2xlZXAnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7RgdGC0L7Rj9C90LjQtSDQu9C+0LLQu9C4INCy0LrQu9GO0YfQuNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvblN0YXR1c1dvcmtCYXNrZXRcclxuICAgICAqL1xyXG4gICAgb25TdGF0dXNXb3JrQmFza2V0KCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Jhc2tldFdvcmsnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1LSDQttC40LLQvtGC0L3QvtC1INC/0L7QudC80LDQvdC+LlxyXG4gICAgICogQG1ldGhvZCBvbkdvb2RXb3JrQmFza2V0XHJcbiAgICAgKi9cclxuICAgIG9uR29vZFdvcmtCYXNrZXQoKXtcclxuICAgICAgICBjYy5sb2coJ9CV0LAsINC20LjQstC+0YLQvdC+0LUg0L/QvtC50LzQsNC90L4gKGJhc2tldC1hbmltYWwpJyk7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVCYXNrZXQgPSBTdGF0ZUJhc2tldC53b3JrO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXR1c0Jhc2tldCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1LSDQttC40LLQvtGC0L3QvtC1INC90LUg0L/QvtC50LzQsNC90L4uXHJcbiAgICAgKiBAbWV0aG9kIG9uQmFkV29ya0Jhc2tldFxyXG4gICAgICovXHJcbiAgICBvbkJhZFdvcmtCYXNrZXQoKXtcclxuICAgICAgICBjYy5sb2coJ9Cd0YMg0LLQvtGCINC+0L/Rj9GC0Ywg0L3QuNGH0LXQs9C+INC90LXQv9C+0LnQvNCw0LsgKGJhc2tldC1hbmltYWwpJyk7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVCYXNrZXQgPSBTdGF0ZUJhc2tldC5zbGVlcDtcclxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0dXNCYXNrZXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0LHQvtGC0LDQtdGCINGBINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjNGOINGN0YLQvtC5INC60L7RgNC30LjQvdGLLiDQn9C+0YHRgtC10L/QtdC90L3QviDQv9GA0LjQsdC70LjQttCw0LXRgtGB0Y8g0Log0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtC4XHJcbiAgICAgKiDQutC+0YDQt9C40L3RiyDRgNCw0LLQvdC+0Lkg0LfQsNC00LDQvdC90L7QvNGDINC30L3QsNGH0LXQvdC40Y4g0LfQsCDQt9Cw0LTQsNC90L7QtSDQstGA0LXQvNGPLlxyXG4gICAgICogQG1ldGhvZCBqb2JXaXRoT3BhY2l0eVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG9wYWNpdHkg0L3Rg9C20L3QviDQtNC+0YHRgtC40Ycg0Y3RgtC+0Lkg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtC4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSDQt9CwINGB0YLQvtC70YzQutC+INGB0LXQutGD0L3QtFxyXG4gICAgICovXHJcbiAgICBqb2JXaXRoT3BhY2l0eShvcGFjaXR5LCB0aW1lKXtcclxuICAgICAgICBsZXQgaW50ZXZhbEluY3JlbWVudHMgPSB0aW1lIC8gTWF0aC5hYnModGhpcy5ub2RlLm9wYWNpdHkgLSBvcGFjaXR5KTtcclxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5jYWxsQmFja09wYWNpdHkpO1xyXG4gICAgICAgIHRoaXMuY2FsbEJhY2tPcGFjaXR5ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLm9wYWNpdHkgPT09IG9wYWNpdHkpIHtcclxuICAgICAgICAgICAgICAgIC8vaWYgKHRoaXMubm9kZS5vcGFjaXR5IDwgMTI1KSB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5jYWxsQmFja09wYWNpdHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIChvcGFjaXR5ID4gdGhpcy5ub2RlLm9wYWNpdHkpID8gdGhpcy5ub2RlLm9wYWNpdHkgKz0gMSA6IHRoaXMubm9kZS5vcGFjaXR5IC09IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5jYWxsQmFja09wYWNpdHksIGludGV2YWxJbmNyZW1lbnRzKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0LHRg9C00LXRgiDQu9C4INC20LjRgtGMINC20LjQstC+0YLQvdC+0LUg0LjQu9C4INC+0L3QviDQstGL0LHRgNC+0YjQtdC90L4g0LIg0LrQvtGA0LfQuNC90YMuXHJcbiAgICAgKiBAbWV0aG9kIGlzQW5pbWFsTGlmZVxyXG4gICAgICogQHBhcmFtIHtjYy5WZWMyfSBwb2ludCDRgtC+0YfQutCwINC90LDRhdC+0LbQtNC10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgLSDQtdGB0LvQuCDQttC40LLQvtGC0L3QvtC1INCx0YPQtNC10YIg0LbQuNGC0YxcclxuICAgICAqL1xyXG4gICAgaXNBbmltYWxMaWZlKHBvaW50KXtcclxuICAgICAgICB0aGlzLl9sZWZ0UG9pbnRCb3R0b20gPSB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMubm9kZS54IC0gdGhpcy5ub2RlLndpZHRoLFxyXG4gICAgICAgICAgICB5OiB0aGlzLm5vZGUueSAtIHRoaXMubm9kZS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0UG9pbnRUb3AgPSB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMubm9kZS54ICsgdGhpcy5ub2RlLndpZHRoLFxyXG4gICAgICAgICAgICB5OiB0aGlzLm5vZGUueSArIHRoaXMubm9kZS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBYID0gcG9pbnQueCA+IHRoaXMuX2xlZnRQb2ludEJvdHRvbS54ICYmIHBvaW50LnggPCB0aGlzLl9yaWdodFBvaW50VG9wLng7XHJcbiAgICAgICAgbGV0IFkgPSBwb2ludC55ID4gdGhpcy5fbGVmdFBvaW50Qm90dG9tLnkgJiBwb2ludC55IDwgdGhpcy5fcmlnaHRQb2ludFRvcC55O1xyXG4gICAgICAgIHJldHVybiAhKFggJiYgWSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC+0LHRidCw0LXRgiDQutC+0YDQt9C40L3QtSDQv9C+0LfQuNGG0LjRjiDQttC40LLQvtGC0L3QvtCz0L4g0LTQu9GPINC/0YDQuNC90Y/RgtC40Y8g0YDQtdGI0LXQvdC40Y8g0L/QviDQstGL0LHQvtGA0YMg0LTQtdC50YHRgtCy0LjRjy4g0JrQvtGA0LfQuNC90LAg0LzQtdC90Y/QtdGCINGB0LLQvtC1INGB0L7RgdGC0L7Rj9C90LjQtVxyXG4gICAgICog0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINGA0LDRgdGB0YLQvtGP0L3QuNGPLlxyXG4gICAgICogQG1ldGhvZCBzZXRQb3NpdGlvbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5WZWMyfSBwb2ludCDRgtC+0YfQutCwINGC0LXQutGD0YnQtdCz0L4g0LzQtdGB0YLQvtC90LDRhdC+0LbQtNC10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICovXHJcbiAgICBzZXRQb3NpdGlvbkFuaW1hbChwb2ludCl7XHJcbiAgICAgICAgdGhpcy5fbGVmdFBvaW50Qm90dG9tID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLm5vZGUueCAtIHRoaXMubm9kZS53aWR0aCxcclxuICAgICAgICAgICAgeTogdGhpcy5ub2RlLnkgLSB0aGlzLm5vZGUuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9yaWdodFBvaW50VG9wID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLm5vZGUueCArIHRoaXMubm9kZS53aWR0aCxcclxuICAgICAgICAgICAgeTogdGhpcy5ub2RlLnkgKyB0aGlzLm5vZGUuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9jZW50cmVQb2ludEJhc2tldCA9IHtcclxuICAgICAgICAgICAgeDogKHRoaXMuX2xlZnRQb2ludEJvdHRvbS54ICsgdGhpcy5fcmlnaHRQb2ludFRvcC54KSAvIDIsXHJcbiAgICAgICAgICAgIHk6ICh0aGlzLl9yaWdodFBvaW50VG9wLnkgKyB0aGlzLl9sZWZ0UG9pbnRCb3R0b20ueSkgLyAyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHggPSAocG9pbnQueCAtIHRoaXMuX2NlbnRyZVBvaW50QmFza2V0LngpICogKHBvaW50LnggLSB0aGlzLl9jZW50cmVQb2ludEJhc2tldC54KTtcclxuICAgICAgICBsZXQgeSA9IChwb2ludC55IC0gdGhpcy5fY2VudHJlUG9pbnRCYXNrZXQueSkgKiAocG9pbnQueSAtIHRoaXMuX2NlbnRyZVBvaW50QmFza2V0LnkpO1xyXG4gICAgICAgIGxldCBzcXJ0UG9pbnQgPSBNYXRoLnNxcnQoeCArIHkpO1xyXG5cclxuICAgICAgICBsZXQgaXNWID0gc3FydFBvaW50IDwgdGhpcy5hbnRpY2lwYXRpb247XHJcbiAgICAgICAgKGlzVikgPyB0aGlzLl9zdGF0ZUJhc2tldCA9IFN0YXRlQmFza2V0LmFjdGl2ZSA6IHRoaXMuX3N0YXRlQmFza2V0ID0gU3RhdGVCYXNrZXQuc2xlZXA7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdHVzQmFza2V0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINGB0YLQsNGC0YPRgSDQutC+0YDQt9C40L3RiyDQuCDQstGL0LfRi9Cy0LDQtdGCINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQtNC10LnRgdGC0LLQuNC1LlxyXG4gICAgICogQG1ldGhvZCBfdXBkYXRlU3RhdHVzQmFza2V0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfdXBkYXRlU3RhdHVzQmFza2V0KCl7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzU3RhdHVzICE9IHRoaXMuX3N0YXRlQmFza2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzU3RhdHVzID0gdGhpcy5fc3RhdGVCYXNrZXQ7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5fc3RhdGVCYXNrZXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVCYXNrZXQuYWN0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0YXR1c0FjdGl2ZUJhc2tldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZUJhc2tldC5zbGVlcDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25TdGF0dXNTbGVlcEJhc2tldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZUJhc2tldC53b3JrOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0YXR1c1dvcmtCYXNrZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG59KTtcclxuXHJcbiIsImltcG9ydCB7IEJveCwgVHlwZUJveCB9IGZyb20gJy4vYm94LXNhbXBsZXMvYm94JztcclxuLyoqXHJcbiAqINCR0L7QutGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6INC90LUg0L/RgNC10LTQvdCw0LfQvdCw0YfQtdC9INC00LvRjyDRg9C/0YDQsNCy0LvQtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvFxyXG4gKiBAdHlwZSB7RnVuY3Rpb259XHJcbiAqL1xyXG52YXIgQm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogQm94LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0L3QsNGH0LDQu9GM0L3Ri9C1INC/0L7Qt9C40YbQuNC4INC4INC/0YDQvtC40LfQstC+0LTQuNGCINCy0YvRh9C40YHQu9C10L3QuNC1INC00LvQuNC90L3Ri1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3NldHRpbmdzKCkge1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBUeXBlQm94LmxlZnQ7XHJcbiAgICAgICAgdGhpcy50aW1lQnJpbmc9MC4xO1xyXG4gICAgICAgIGxldCBjYW52YXMgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplSW5QaXhlbHMoKTtcclxuICAgICAgICBsZXQgc2l6ZUJveFkgPSB0aGlzLl9nZXRTaXplQm94KGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gc2l6ZUJveFkgLyAyICsgdGhpcy5pbmRlbnRSaWdodDtcclxuICAgICAgICB0aGlzLm5vZGUuaGVpZ2h0ID0gc2l6ZUJveFk7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIHRoaXMuX2VuZFBvcyA9IGNjLnYyKHRoaXMubm9kZS54ICsgdGhpcy5ub2RlLndpZHRoLCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy5fYW1vdW50UGl4ID0gTWF0aC5hYnModGhpcy5fZW5kUG9zLnggLSB0aGlzLl9zdGFydFBvcy54KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQvtGC0LrRgNGL0YLQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRPcGVuKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ29wZW5Cb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0LfQsNC60YDRi9C40LUg0LHQvtC60YHQsCDQsiDQutC+0L3RgtGA0L7Qu9C70LXRgNC1XHJcbiAgICAgKi9cclxuICAgIHB1Ymxpc2hFdmVudENsb3NlKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Nsb3NlQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdC+0LJcclxuICAgICAqIEBwYXJhbSB7YW55fSBkdFxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLl9vcGFjaXR5Tm9kZSh0aGlzLm5vZGUueCAtIHRoaXMuX3N0YXJ0UG9zLngpO1xyXG4gICAgfSxcclxufSk7IiwiaW1wb3J0IHsgQm94LCBUeXBlQm94IH0gZnJvbSAnLi9ib3gtc2FtcGxlcy9ib3gnO1xyXG5cclxuLyoqXHJcbiAqINCR0L7QutGBINGB0L/QuNGB0LrQsCDQttC40LLQvtGC0L3Ri9GFXHJcbiAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICovXHJcbnZhciBCb3hDcmVhdGVBbmltYWwgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBCb3gsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvdCw0YfQsNC70YzQvdGL0LUg0L/QvtC30LjRhtC40Lgg0Lgg0L/RgNC+0LjQt9Cy0L7QtNC40YIg0LLRi9GH0LjRgdC70LXQvdC40LUg0LTQu9C40L3QvdGLXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0dGluZ3MoKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IFR5cGVCb3guYm90dG9tO1xyXG4gICAgICAgIHRoaXMudGltZUJyaW5nPTAuMjtcclxuICAgICAgICBsZXQgYmFyID0gdGhpcy5jb250ZW50O1xyXG4gICAgICAgIGxldCBjYW52YXMgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplSW5QaXhlbHMoKTtcclxuICAgICAgICBsZXQgc2l6ZUJveFggPSB0aGlzLl9nZXRTaXplQm94KGNhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSBzaXplQm94WCAvIDIgKyB0aGlzLmluZGVudExlZnQ7XHJcbiAgICAgICAgYmFyLndpZHRoID0gc2l6ZUJveFg7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIHRoaXMuX2VuZFBvcyA9IGNjLnYyKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSArIGJhci5oZWlnaHQgLSAxMCk7XHJcbiAgICAgICAgdGhpcy5fYW1vdW50UGl4ID0gTWF0aC5hYnModGhpcy5fZW5kUG9zLnkgLSB0aGlzLl9zdGFydFBvcy55KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0L7RgtC60YDRi9GC0LjQtSDQsdC+0LrRgdCwINCyINC60L7QvdGC0YDQvtC70LvQtdGA0LVcclxuICAgICAqL1xyXG4gICAgcHVibGlzaEV2ZW50T3Blbigpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdvcGVuQm94RnJvbUFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC30LDQutGA0YvRgtC40LUg0LHQvtC60YHQsCDQsiDQutC+0L3RgtGA0L7Qu9C70LXRgNC1XHJcbiAgICAgKi9cclxuICAgIHB1Ymxpc2hFdmVudENsb3NlKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Nsb3NlQm94RnJvbUFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdC+0LJcclxuICAgICAqIEBwYXJhbSB7YW55fSBkdFxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLl9vcGFjaXR5Tm9kZSh0aGlzLm5vZGUueSAtIHRoaXMuX3N0YXJ0UG9zLnkpO1xyXG4gICAgfSxcclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRklSQ29ycCBvbiAyOS4wMy4yMDE3LlxyXG4gKi9cclxuaW1wb3J0IHsgQm94LCBUeXBlQm94IH0gZnJvbSAnLi9ib3gtc2FtcGxlcy9ib3gnO1xyXG4vKipcclxuICog0JHQvtC60YEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40Log0L3QtSDQv9GA0LXQtNC90LDQt9C90LDRh9C10L0g0LTQu9GPINGD0L/RgNCw0LLQu9C10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8XHJcbiAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICovXHJcbnZhciBCb3hNZW51UGxheSA9IGNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IEJveCxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LDRh9Cw0LvRjNC90YvQtSDQv9C+0LfQuNGG0LjQuCDQuCDQv9GA0L7QuNC30LLQvtC00LjRgiDQstGL0YfQuNGB0LvQtdC90LjQtSDQtNC70LjQvdC90YtcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXR0aW5ncygpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gVHlwZUJveC5sZWZ0O1xyXG4gICAgICAgIHRoaXMudGltZUJyaW5nPTAuNjtcclxuICAgICAgICBsZXQgY2FudmFzID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZUluUGl4ZWxzKCk7XHJcbiAgICAgICAgbGV0IHNpemVCb3hZID0gdGhpcy5fZ2V0U2l6ZUJveChjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHNpemVCb3hZIC8gMiArIHRoaXMuaW5kZW50UmlnaHQ7XHJcbiAgICAgICAgdGhpcy5ub2RlLmhlaWdodCA9IHNpemVCb3hZO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zID0gY2MudjIodGhpcy5ub2RlLngsIHRoaXMubm9kZS55KTtcclxuICAgICAgICB0aGlzLl9lbmRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCArIHRoaXMubm9kZS53aWR0aCAtIDc1LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy5fYW1vdW50UGl4ID0gTWF0aC5hYnModGhpcy5fZW5kUG9zLnggLSB0aGlzLl9zdGFydFBvcy54KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQutGA0YvQstCw0LXRgi/Qt9Cw0LrRgNGL0LLQsNC10YIg0LHQvtC60YFcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkNsaWNrKGV2ZW50KXtcclxuICAgICAgICB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQvtGC0LrRgNGL0YLQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRPcGVuKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ29wZW5Cb3hNZW51UGxheScsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC30LDQutGA0YvQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRDbG9zZSgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdjbG9zZUJveE1lbnVQbGF5JywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdC+0LJcclxuICAgICAqIEBwYXJhbSB7YW55fSBkdFxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLl9vcGFjaXR5Tm9kZSh0aGlzLm5vZGUueCAtIHRoaXMuX3N0YXJ0UG9zLngpO1xyXG4gICAgfSxcclxufSk7IiwiLyoqXHJcbiAqIEVudW0g0YHQvtGB0YLQvtGP0L3QuNC5INCx0L7QutGB0LBcclxuICogQHR5cGVkZWYge09iamVjdH0gTW92ZW1lbnRcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHRvQ2xvc2Ug0LHQvtC60YEg0LfQsNC60YDRi9GCLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gdG9PcGVuINCx0L7QutGBINC+0YLQutGA0YvRgi5cclxuICovXHJcblxyXG4vKipcclxuICog0KHQvtGB0YLQvtGP0L3QuNC1INCx0L7QutGB0LAgKNC+0YLQutGA0YvRgi/Qt9Cw0LrRgNGL0YIpXHJcbiAqIEB0eXBlIHtNb3ZlbWVudH1cclxuICovXHJcbmNvbnN0IE1vdmVtZW50ID0ge1xyXG4gICAgdG9DbG9zZTogMCxcclxuICAgIHRvT3BlbjogMSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbnVtINGB0L7RgdGC0L7Rj9C90LjQuSDRgNCw0LHQvtGC0Ysg0LHQvtC60YHQsFxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBUeXBlQm94XHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBib3R0b20g0YDQsNCx0L7RgtCwINC60LDQuiDQvdC40LbQvdC40Lkg0LHQvtC60YEuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0b3Ag0YDQsNCx0L7RgtCwINC60LDQuiDQstC10YDRhdC90LjQuSDQsdC+0LrRgS5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJpZ2h0INGA0LDQsdC+0YLQsCDQutCw0Log0L/RgNCw0LLRi9C5INCx0L7QutGBLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gbGVmdCDRgNCw0LHQvtGC0LAg0LrQsNC6INC70LXQstGLINCx0L7QutGBLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQotC40L8g0LHQvtC60YHQsFxyXG4gKiBAdHlwZSB7e2JvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgbGVmdDogbnVtYmVyfX1cclxuICovXHJcbmNvbnN0IFR5cGVCb3ggPSB7XHJcbiAgICBib3R0b206IDAsXHJcbiAgICB0b3A6IDEsXHJcbiAgICByaWdodDogMixcclxuICAgIGxlZnQ6IDMsXHJcbn07XHJcbi8qKlxyXG4gKiDQr9C00YDQviDQsdC+0LrRgdC+0LJcclxuICogQHR5cGUge2NjLkNsYXNzfVxyXG4gKi9cclxudmFyIEJveCA9IGNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgX3N0YXJ0UG9zOiBudWxsLC8v0KHRgtCw0YDRgtC+0LLQsNGPINC/0L7Qt9C40YbQuNGPINCx0L7QutGB0LBcclxuICAgICAgICBfZW5kUG9zOiBudWxsLC8v0LrQvtC90LXRh9C90LDRjyDQv9C+0LfQuNGG0LjRjyDQsdC+0LrRgdCwXHJcbiAgICAgICAgX3R5cGU6IG51bGwsLy/RgdC+0YHRgtC+0Y/QvdC40LUg0YLQuNC/0LAg0LHQvtC60YHQsCDQsiDQutC+0YLQvtGA0L7QvCDQvtC9INGA0LDQsdC+0YLQsNC10YJcclxuICAgICAgICBfZGlyZWN0aW9uOiAxLC8vMC0g0LfQsNC60YDRi9GC0YzRgdGPIDEtINC+0YLQutGA0YvRgtGM0YHRj1xyXG4gICAgICAgIF9mbGFnQmxvY2s6IGZhbHNlLC8v0YTQu9Cw0LMg0LHQu9C+0LrQuNGA0L7QstC60LhcclxuICAgICAgICBfZmxhZ1phcHJvc0Jsb2NrOiBmYWxzZSwvL9GE0LvQsNCzINC+INC90LXQvtCx0YXQvtC00LjQvtC80YHRgtC4INCx0LvQvtC60LjRgNC+0LLQutC4XHJcbiAgICAgICAgX2Ftb3VudFBpeDogbnVsbCwvL9C/0YPRgtGMINC00LvRjyDQsdC+0LrRgdCwXHJcbiAgICAgICAgX2FjdGlvbk1vdmVCb3g6IG51bGwsLy9hY3Rpb25zINC00LLQuNC20LXQvdC40Y8g0LHQvtC60YHQsFxyXG5cclxuICAgICAgICB0aW1lQnJpbmc6IDAuMDEsLy/QktGA0LXQvNGPINC00L7QstC+0LTQsCDQsiDRgdC10LrRg9C90LTQsNGFXHJcbiAgICAgICAgY29udGVudDogY2MuTm9kZSwvL9C60L7QvdGC0LXQvdGCINC90LDQtCDQutC+0YLQvtGA0YvQvCDQvdC10L7QsdGF0L7QtNC40LzQviDQv9GA0L7QuNC30LLQtdGB0YLQuCDRgNCw0LHQvtGC0YNcclxuICAgICAgICBvcGFjaXR5Qm94OiAzMCwvL9Cf0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdCwIFxyXG4gICAgICAgIGluZGVudExlZnQ6IDUwLC8v0J7RgtGB0YLRg9C/INGB0LvQtdCy0LAgKNCyIHB4KVxyXG4gICAgICAgIGluZGVudFJpZ2h0OiA1MCwvL9Ce0YLRgdGC0YPQvyDRgdC/0YDQsNCy0LAgKNCyIHB4KVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YHRg9GJ0LXRgdGC0LLQu9GP0LXRgiDQv9C10YDQstC+0L3QsNGH0LDQu9GM0L3Rg9GOINC90LDRgdGC0YDQvtC50LrRg1xyXG4gICAgICovXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fZ2V0UGVybWlzc2lvbk1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQv9C10YDQtdC80LXQvdC90YvRhVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2luaXQoKXtcclxuICAgICAgICAvL9CU0LDQu9GM0L3QtdC50YjQtdC1INC00LXQudGB0YLQstC40LUg0LHQvtC60YHQsFxyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICB0aGlzLl9zZXR0aW5ncygpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsCDRgdGC0YDQsNGCINGC0LDRh9CwXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoU3RhcnQoZXZlbnQpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjRjyDQvdCwINC00LLQuNC20LXQvdC40LUg0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50INGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hNb3ZlKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQudG91Y2guZ2V0RGVsdGEoKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZsYWdCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRNb3ZlbWVudChkZWx0YSkuX21vdmVCb3goZGVsdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNC1INC90LAg0LfQsNCy0LXRgNGI0LXQvdC40LUg0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50INGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmQoZXZlbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZsYWdCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC60LvRjtGH0LDQtdGCINCx0LvQvtC60LjRgNC+0LLQutGDINCx0L7QutGB0LBcclxuICAgICAqL1xyXG4gICAgb25CbG9jaygpe1xyXG4gICAgICAgIHRoaXMuX2ZsYWdaYXByb3NCbG9jayA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZmxhZ0Jsb2NrID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0LrQu9GO0YfQsNC10YIg0LHQu9C+0LrQuNGA0L7QstC60YMg0LHQvtC60YHQsFxyXG4gICAgICovXHJcbiAgICBvZmZCbG9jaygpe1xyXG4gICAgICAgIHRoaXMuX2ZsYWdaYXByb3NCbG9jayA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2ZsYWdCbG9jayA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQutGA0YvQstCw0LXRgiDQsdC+0LrRgVxyXG4gICAgICovXHJcbiAgICBvcGVuQm94KCl7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC60YDRi9Cy0LDQtdGCINCx0L7QutGBXHJcbiAgICAgKi9cclxuICAgIGNsb3NlQm94KCl7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9DbG9zZTtcclxuICAgICAgICB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdGCINC+0LbQuNC00LDQtdC80L7QtSDRgdC+0YHRgtC+0Y/QvdC40LUg0L/QviDQvdCw0L/RgNCw0LLQu9C10L3QuNGOINC00LLQuNC20LXQvdC40Y8g0LHQvtC60YHQsFxyXG4gICAgICogQHBhcmFtIGRlbHRhINC/0YDQuNGA0LDRidC10L3QuNC1XHJcbiAgICAgKiBAcmV0dXJucyB7Qm94fSDRjdGC0L7RgiDQutC70LDRgdGBXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0TW92ZW1lbnQoZGVsdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gVHlwZUJveC50b3ApIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gZGVsdGEueSA+IDAgPyBNb3ZlbWVudC50b0Nsb3NlIDogTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fdHlwZSA9PT0gVHlwZUJveC5ib3R0b20pIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gZGVsdGEueSA8IDAgPyBNb3ZlbWVudC50b0Nsb3NlIDogTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fdHlwZSA9PT0gVHlwZUJveC5sZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRlbHRhLnggPCAwID8gTW92ZW1lbnQudG9DbG9zZSA6IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBkZWx0YS54ID4gMCA/IE1vdmVtZW50LnRvQ2xvc2UgOiBNb3ZlbWVudC50b09wZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDQstGL0YXQvtC0INCx0L7QutGB0LAg0LfQsCDQv9GA0LXQtNC10LvRiyDQuNC90YLQtdGA0LLQsNC70LAg0LIg0YDQtdC30YPQtNGM0YLQsNGC0LUg0LLRi9C/0L7Qu9C90LXQvdC40Y8g0LTQsNC90L3QvtCz0L4g0L/RgNC40YDQsNGJ0LXQvdC40Y8uIHRydWUt0LrQvtCz0LTQsCDQvtC9INC90LUg0LLRi9GF0L7QtNC40YJcclxuICAgICAqIEBwYXJhbSBkZWx0YSDQv9GA0LjRgNCw0YnQtdC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLRi1xyXG4gICAgICogQHBhcmFtIHN0YXJ0INGB0YLQsNGA0YLQvtCy0LDRjyDQutC+0L7RgNC00LjQvdCwKNC60L7QvtGA0LTQuNC90LDRgtCwINC30LDQutGA0YvRgtC+0LPQviDQsdC+0LrRgdCwKVxyXG4gICAgICogQHBhcmFtIGVuZCDQutC+0L3QtdGH0L3QsNGPINC60L7QvtGA0LTQuNC90LDRgtCwKNC60L7QvtGA0LTQuNC90LDRgtCwINC+0YLQutGA0YvRgtC+0LPQviDQsdC+0LrRgdCwKVxyXG4gICAgICogQHBhcmFtIGN1cnJlbnQg0YLQtdC60YPRidCw0LAg0LrQvtC+0YDQtNC40L3QsNGC0LBcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUtINC10YHQu9C4INCx0L7QutGBINC90LUg0LLRi9GF0L7QtNC40YIg0LfQsCDQv9GA0LXQtNC10LvRi1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2lzQ2hlY2tPdXRPZlJhbmdlKGRlbHRhLCBzdGFydCwgZW5kLCBjdXJyZW50KXtcclxuICAgICAgICByZXR1cm4gc3RhcnQgPCBlbmQgPyB0aGlzLl9pc091dE9mUmFuZ2VMZWZ0Qm90dG9tKGRlbHRhLCBzdGFydCwgZW5kLCBjdXJyZW50KSA6IHRoaXMuX2lzT3V0T2ZSYW5nZVJpZ2h0VG9wKGRlbHRhLCBzdGFydCwgZW5kLCBjdXJyZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LLRi9GF0L7QtCDQu9C10LLQvtCz0L4g0Lgg0L3QuNC20L3QtdCz0L4g0LHQvtC60YHQsCDQt9CwINC/0YDQtdC00LXQu9GLINC40L3RgtC10YDQstCw0LvQsCDQsiDRgNC10LfRg9C00YzRgtCw0YLQtSDQstGL0L/QvtC70L3QtdC90LjRjyDQtNCw0L3QvdC+0LPQviDQv9GA0LjRgNCw0YnQtdC90LjRj1xyXG4gICAgICogQHBhcmFtIGRlbHRhINC/0YDQuNGA0LDRidC10L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtGLXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQg0YHRgtCw0YDRgtC+0LLQsNGPINC60L7QvtGA0LTQuNC90LAo0LrQvtC+0YDQtNC40L3QsNGC0LAg0LfQsNC60YDRi9GC0L7Qs9C+INCx0L7QutGB0LApXHJcbiAgICAgKiBAcGFyYW0gZW5kINC60L7QvdC10YfQvdCw0Y8g0LrQvtC+0YDQtNC40L3QsNGC0LAo0LrQvtC+0YDQtNC40L3QsNGC0LAg0L7RgtC60YDRi9GC0L7Qs9C+INCx0L7QutGB0LApXHJcbiAgICAgKiBAcGFyYW0gY3VycmVudCDRgtC10LrRg9GJ0LDQsCDQutC+0L7RgNC00LjQvdCw0YLQsFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUtINC10YHQu9C4INCx0L7QutGBINC90LUg0LLRi9GF0L7QtNC40YIg0LfQsCDQv9GA0LXQtNC10LvRi1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2lzT3V0T2ZSYW5nZUxlZnRCb3R0b20oZGVsdGEsIHN0YXJ0LCBlbmQsIGN1cnJlbnQpe1xyXG4gICAgICAgIHJldHVybiBkZWx0YSArIGN1cnJlbnQgPiBzdGFydCAmJiBkZWx0YSArIGN1cnJlbnQgPCBlbmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINCy0YvRhdC+0LQg0LLQtdGA0YXQvdC10LPQviDQuCDQv9GA0LDQstC+0LPQviDQsdC+0LrRgdCwINC30LAg0L/RgNC10LTQtdC70Ysg0LjQvdGC0LXRgNCy0LDQu9CwINCyINGA0LXQt9GD0LTRjNGC0LDRgtC1INCy0YvQv9C+0LvQvdC10L3QuNGPINC00LDQvdC90L7Qs9C+INC/0YDQuNGA0LDRidC10L3QuNGPXHJcbiAgICAgKiBAcGFyYW0gZGVsdGEg0L/RgNC40YDQsNGJ0LXQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0YtcclxuICAgICAqIEBwYXJhbSBzdGFydCDRgdGC0LDRgNGC0L7QstCw0Y8g0LrQvtC+0YDQtNC40L3QsCjQutC+0L7RgNC00LjQvdCw0YLQsCDQt9Cw0LrRgNGL0YLQvtCz0L4g0LHQvtC60YHQsClcclxuICAgICAqIEBwYXJhbSBlbmQg0LrQvtC90LXRh9C90LDRjyDQutC+0L7RgNC00LjQvdCw0YLQsCjQutC+0L7RgNC00LjQvdCw0YLQsCDQvtGC0LrRgNGL0YLQvtCz0L4g0LHQvtC60YHQsClcclxuICAgICAqIEBwYXJhbSBjdXJyZW50INGC0LXQutGD0YnQsNCwINC60L7QvtGA0LTQuNC90LDRgtCwXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZS0g0LXRgdC70Lgg0LHQvtC60YEg0L3QtSDQstGL0YXQvtC00LjRgiDQt9CwINC/0YDQtdC00LXQu9GLXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaXNPdXRPZlJhbmdlUmlnaHRUb3AoZGVsdGEsIHN0YXJ0LCBlbmQsIGN1cnJlbnQpe1xyXG4gICAgICAgIHJldHVybiBkZWx0YSArIGN1cnJlbnQgPCBzdGFydCAmJiBkZWx0YSArIGN1cnJlbnQgPiBlbmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQstC40LbQtdC90LjQtSDQsdC+0LrRgdCwXHJcbiAgICAgKiBAcGFyYW0ge2NjLlZlYzJ9IGRlbHRhINC/0YDQuNGA0LDRidC10L3QuNC1XHJcbiAgICAgKiBAcmV0dXJucyB7Qm94fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX21vdmVCb3goZGVsdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gVHlwZUJveC50b3AgfHwgdGhpcy5fdHlwZSA9PT0gVHlwZUJveC5ib3R0b20pIHtcclxuICAgICAgICAgICAgKHRoaXMuX2lzQ2hlY2tPdXRPZlJhbmdlKGRlbHRhLnksIHRoaXMuX3N0YXJ0UG9zLnksIHRoaXMuX2VuZFBvcy55LCB0aGlzLm5vZGUueSkpID8gdGhpcy5ub2RlLnkgKz0gZGVsdGEueSA6IHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKHRoaXMuX2lzQ2hlY2tPdXRPZlJhbmdlKGRlbHRhLngsIHRoaXMuX3N0YXJ0UG9zLngsIHRoaXMuX2VuZFBvcy54LCB0aGlzLm5vZGUueCkpID8gdGhpcy5ub2RlLnggKz0gZGVsdGEueCA6IHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQv9C+0LvQvdGP0LXRgiDQsNCy0YLQviDQtNC+0LLQvtC00LrRg1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2VuZFN3aXBlKCl7XHJcbiAgICAgICAgdGhpcy5fZmxhZ0Jsb2NrID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPT09IE1vdmVtZW50LnRvQ2xvc2UgPyB0aGlzLl9icmluZyh0aGlzLl9zdGFydFBvcykgOiB0aGlzLl9icmluZyh0aGlzLl9lbmRQb3MpO1xyXG4gICAgICAgIHRoaXMuX3JlZm9jdXMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0L/QvtC70L3Rj9C10YIg0LDQstGC0L4g0LTQvtCy0L7QtCAg0LHQvtC60YHQsCDQtNC+INGE0LjQvdCw0LvRjNC90L7QuSDRgtC+0YfQutC4INC90LDQt9C90LDRh9C10L3QuNGPXHJcbiAgICAgKiBAcGFyYW0gcG9zINGC0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y9cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9icmluZyhwb3Mpe1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbk1vdmVCb3ggPSBjYy5tb3ZlVG8odGhpcy50aW1lQnJpbmcsIHBvcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihcclxuICAgICAgICAgICAgY2Muc2VxdWVuY2UodGhpcy5fYWN0aW9uTW92ZUJveCwgY2MuY2FsbEZ1bmModGhpcy5fZmluaXNoQnJpbmcsIHRoaXMpKVxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTRg9C90LrRhtC40Y8g0YHQuNCz0L3QsNC70LjQt9C40YDRg9GO0YnQsNGPINC+INC30LDQstC10YDRiNC10L3QuNC4INC00L7QstC+0LTQutC4INCx0L7QutGB0LBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9maW5pc2hCcmluZygpe1xyXG4gICAgICAgIGlmICghdGhpcy5fZmxhZ1phcHJvc0Jsb2NrKSB0aGlzLl9mbGFnQmxvY2sgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0LTQtdC70LDQtdGCINC70Lgg0L7QvSDRjdGC0L4g0YHQvtCx0YvRgtC40LUg0LAg0L3QtSDQutGC0L4t0YLQviDQtNGA0YPQs9C+0Lkg0L/QviDQstC10YLQutC1INC90L7QtNC+0LIg0LTQviDQvdC10LPQvlxyXG4gICAgICogQHBhcmFtIGV2ZW50INGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZ2V0UGVybWlzc2lvbk1vdmUoZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Ll9uYW1lID09PSB0aGlzLm5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hNb3ZlKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YDQsNC30LzQtdGAINCx0L7QutGB0LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQsCDQvdCwINGB0YLQvtGA0L7QvdC1INC4INGD0YHQu9C+0LLQuNC5INC+0YLRgdGC0YPQv9C+0LJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGFjZSAg0YDQsNC30LzQtdGAINCx0L7QutGB0LDQtNC+INC/0YDQuNGA0LDRidC10L3QuNGPXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDRgNCw0LfQvNC10YAg0LHQvtC60YHQsFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2dldFNpemVCb3goc3BhY2UpIHtcclxuICAgICAgICByZXR1cm4gc3BhY2UgLSB0aGlzLmluZGVudExlZnQgLSB0aGlzLmluZGVudFJpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXQvdGP0LXRgiDQtNC10LnRgdGC0LLQuNC1INC60L7RgtC+0YDQvtC1INC90LXQvtCx0YXQvtC00LjQvNC+INGB0LTQtdC70LDRgtGMINC00LDQu9GM0YjQtSDQsdC+0LrRgdGDKNC30LDQutGA0YvRgtGM0YHRjyDQuNC70Lgg0L7RgtC60YDRi9GC0YzRgdGPKS7Qn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9yZWZvY3VzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09IE1vdmVtZW50LnRvQ2xvc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgICAgICB0aGlzLnB1Ymxpc2hFdmVudENsb3NlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9DbG9zZTtcclxuICAgICAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnRPcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LDQsdC+0YLQsCDRgSDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0YzRjiDQsdC+0LrRgdCwLiDQmNC30LzQtdC90Y/QtdGCINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdCwINC90LAg0L7RgdC90L7QstC1INC/0L7Qu9C+0LbQtdC90LjRjyDQtdCz0L4g0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC90LDRh9Cw0LvRjNC90YvRhSDQuCDQutC+0L3QtdGH0L3Ri9GFINC60L7QvtGA0LTQuNC90LDRglxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29wYWNpdHlOb2RlKGN1cnJlbnRQb3NCb3gpIHtcclxuICAgICAgICBsZXQgb3Bhc2l0eSA9IHRoaXMub3BhY2l0eUJveCArICgoKDI1NSAtIHRoaXMub3BhY2l0eUJveCkgKiBjdXJyZW50UG9zQm94KSAvIHRoaXMuX2Ftb3VudFBpeCk7XHJcbiAgICAgICAgaWYgKG9wYXNpdHkgPiAyNTUpIHtcclxuICAgICAgICAgICAgb3Bhc2l0eSA9IDI1NTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wYXNpdHkgPCB0aGlzLm9wYWNpdHlCb3gpIHtcclxuICAgICAgICAgICAgb3Bhc2l0eSA9IHRoaXMub3BhY2l0eUJveDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSBvcGFzaXR5O1xyXG4gICAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgeyBCb3gsIE1vdmVtZW50LCBUeXBlQm94IH07IiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEFuaW1hbEJ1aWxkZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIEFuaW1hbEJ1aWxkZXIoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluc3QgPSBuZXcgQW5pbWFsQnVpbGRlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3Q7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWxCdWlsZGVyLnByb3RvdHlwZS5jcmVhdGVTeXN0ZW1zID0gZnVuY3Rpb24gKHN5c3RlbXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGZhY3RvcnkgPSBBbmltYWxzLlN5c3RlbXMuRmFjdG9yaWVzLlN5c3RlbUZhY3RvcnkuaW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgdmFyIG1hcyA9IFtdO1xyXG4gICAgICAgICAgICBzeXN0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIG1hcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zY2FsZXNUeXBlLmZvckVhY2goZnVuY3Rpb24gKHNjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFzW3NjLnR5cGVdID0gX3RoaXMubWFzU2NhbGVzW3NjLnR5cGVdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5tYXNTeXN0ZW1zW2l0ZW0udHlwZV0gPSBmYWN0b3J5LmNyZWF0ZShpdGVtLnR5cGUsIG1hcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIucHJvdG90eXBlLmNyZWF0ZVNjYWxlcyA9IGZ1bmN0aW9uIChzY2FsZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGZhY3RvcnkgPSBBbmltYWxzLlNjYWxlcy5GYWN0b3JpZXMuU2NhbGVGYWN0b3J5Lmluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgIHNjYWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZVNjYWxlID0gaXRlbS50eXBlU2NhbGUsIHR5cGUgPSBpdGVtLnR5cGUsIHBhcmFtcyA9IGl0ZW0ucGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubWFzU2NhbGVzW3R5cGVdID0gZmFjdG9yeS5jcmVhdGUodHlwZVNjYWxlLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWxCdWlsZGVyLnByb3RvdHlwZS5jcmVhdGVDb21tdW5pY2F0b3IgPSBmdW5jdGlvbiAoY29tbXVub2NhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgY29tbXVuaWNhdG9yQnVpbGQgPSBuZXcgQW5pbWFscy5Db21tdW5pY2F0aW9ucy5CdWlsZGVycy5Db21tdW5pY2F0b3JCdWlsZGVyKHRoaXMubWFzU2NhbGVzKTtcclxuICAgICAgICAgICAgY29tbXVub2NhdGlvbi5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tdW5pY2F0b3JCdWlsZC5hZGQoaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbXVuaWNhdG9yQnVpbGQuYnVpbGQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgc3lzdGVtcyA9IG1vZGVsLnN5c3RlbXMsIHNjYWxlcyA9IG1vZGVsLnNjYWxlcywgY29tbXVuaWNhdGlvbiA9IG1vZGVsLmNvbW11bmljYXRpb247XHJcbiAgICAgICAgICAgIHRoaXMubWFzU2NhbGVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMubWFzU3lzdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgY29tbXVuaWNhdG9yID0gdGhpcy5jcmVhdGVTY2FsZXMoc2NhbGVzKS5jcmVhdGVTeXN0ZW1zKHN5c3RlbXMpLmNyZWF0ZUNvbW11bmljYXRvcihjb21tdW5pY2F0aW9uKTtcclxuICAgICAgICAgICAgdmFyIGFuaW1hbCA9IG5ldyBBbmltYWxzLkFuaW1hbCh0aGlzLm1hc1N5c3RlbXMpO1xyXG4gICAgICAgICAgICBhbmltYWwuY29tbXVuaWNhdG9yID0gY29tbXVuaWNhdG9yO1xyXG4gICAgICAgICAgICByZXR1cm4gYW5pbWFsO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIEFuaW1hbEJ1aWxkZXI7XHJcbiAgICB9KCkpO1xyXG4gICAgQW5pbWFscy5BbmltYWxCdWlsZGVyID0gQW5pbWFsQnVpbGRlcjtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBBbmltYWwgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIEFuaW1hbChwYXJhbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5tdXNjdWxhciA9IHBhcmFtc1tBbmltYWxzLlN5c3RlbXMuU3lzdGVtVHlwZXMubXVzY3VsYXJdO1xyXG4gICAgICAgICAgICB0aGlzLmNpcmN1bGF0b3J5ID0gcGFyYW1zW0FuaW1hbHMuU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeV07XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbiA9IHBhcmFtc1tBbmltYWxzLlN5c3RlbXMuU3lzdGVtVHlwZXMubmF2aWdhdGlvbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcIm11c2N1bGFyXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX211c2N1bGFyID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcImNpcmN1bGF0b3J5XCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NpcmN1bGF0b3J5ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcIm5hdmlnYXRpb25cIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdGlvbiA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQW5pbWFsLnByb3RvdHlwZSwgXCJjb21tdW5pY2F0b3JcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29tbXVuaWNhdG9yID0gcGFyYW07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcImlkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IHBhcmFtO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBBbmltYWwucHJvdG90eXBlLm1vdmVUb1BvaW50ID0gZnVuY3Rpb24gKHBvaW50KSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWwucHJvdG90eXBlLmdldENoYXJhY3RlcmlzdGljcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQltC40LLQvtGC0L3QvtC1JyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZTogJ9CR0LXQs9GDJyxcclxuICAgICAgICAgICAgICAgIHBhcmFtOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0KHQutC+0YDQvtGB0YLRjCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiA4OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ9C8L9GBJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9CS0L7Qt9GA0LDRgdGCJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAn0LvQtdGCJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9CS0LXRgScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJ9C60LMnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0JLRi9C90L7RgdC70LjQstC+0YHRgtGMJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAn0LXQtC4nLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0KHQuNGB0YLQtdC80LAg0LrRgNC+0LLQvtC+0LHRgNCw0YnQtdC90LjRjycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiA4OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJyUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0KHQuNGB0YLQtdC80LAg0L/QsNC80Y/RgtC4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDU5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAnJScsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICfQodC40YHRgtC10LzQsCDQtNGL0YXQsNC90LjRjycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiA4OSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogJyUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gQW5pbWFsO1xyXG4gICAgfSgpKTtcclxuICAgIEFuaW1hbHMuQW5pbWFsID0gQW5pbWFsO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIENvbW11bmljYXRpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChDb21tdW5pY2F0aW9ucykge1xyXG4gICAgICAgIHZhciBCdWlsZGVycztcclxuICAgICAgICAoZnVuY3Rpb24gKEJ1aWxkZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciBDb21tdW5pY2F0b3JCdWlsZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIENvbW11bmljYXRvckJ1aWxkZXIoc2NhbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NhbGVzID0gc2NhbGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbW11bmljYXRvciA9IG5ldyBDb21tdW5pY2F0aW9ucy5Db21tdW5pY2F0b3IoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3J5RnVuY3Rpb24gPSBBbmltYWxzLkZ1bmN0aW9ucy5GYWN0b3JpZXMuRnVuY3Rpb25GYWN0b3J5Lmluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBDb21tdW5pY2F0b3JCdWlsZGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtLmxpbmsuZm9yRWFjaChmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGNvbW11bmljYXRpb24udHlwZSwgYmVoYXZpb3IgPSBjb21tdW5pY2F0aW9uLmJlaGF2aW9yLCBmdW5jdGlvbnMgPSBjb21tdW5pY2F0aW9uLmZ1bmN0aW9ucywgcGFyYW1zID0gY29tbXVuaWNhdGlvbi5wYXJhbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IF90aGlzLl9zY2FsZXNbdHlwZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmdW4gPSBfdGhpcy5fY3JlYXRlRnVuY3Rpb24oZnVuY3Rpb25zLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY29tbXVuaWNhdG9yLmFkZExpbmsocGFyYW0udHlwZSwgeyBzY2FsZTogc2NhbGUsIGJlaGF2aW9yOiBiZWhhdmlvciwgZnVuOiBmdW4gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlLmNvbW11bmljYXRvciA9IF90aGlzLl9jb21tdW5pY2F0b3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgQ29tbXVuaWNhdG9yQnVpbGRlci5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW11bmljYXRvcjtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBDb21tdW5pY2F0b3JCdWlsZGVyLnByb3RvdHlwZS5fY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbiAodHlwZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3RvcnlGdW5jdGlvbi5jcmVhdGUodHlwZSwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29tbXVuaWNhdG9yQnVpbGRlcjtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgQnVpbGRlcnMuQ29tbXVuaWNhdG9yQnVpbGRlciA9IENvbW11bmljYXRvckJ1aWxkZXI7XHJcbiAgICAgICAgfSkoQnVpbGRlcnMgPSBDb21tdW5pY2F0aW9ucy5CdWlsZGVycyB8fCAoQ29tbXVuaWNhdGlvbnMuQnVpbGRlcnMgPSB7fSkpO1xyXG4gICAgfSkoQ29tbXVuaWNhdGlvbnMgPSBBbmltYWxzLkNvbW11bmljYXRpb25zIHx8IChBbmltYWxzLkNvbW11bmljYXRpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBDb21tdW5pY2F0aW9ucztcclxuICAgIChmdW5jdGlvbiAoQ29tbXVuaWNhdGlvbnMpIHtcclxuICAgICAgICB2YXIgQ29tbXVuaWNhdG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQ29tbXVuaWNhdG9yKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmV0TGlua3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlbnNpdGl2aXR5ID0gMC4xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21tdW5pY2F0b3IucHJvdG90eXBlLCBcInNlbnNpdGl2aXR5XCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZW5zaXRpdml0eTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbnNpdGl2aXR5ID0gcGFyYW0gPyBwYXJhbSA6IDAuMTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBDb21tdW5pY2F0b3IucHJvdG90eXBlLnNldHRpbmcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbnNpdGl2aXR5ID0gcGFyYW1zLnNlbnNpdGl2aXR5IHx8IDAuMTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ29tbXVuaWNhdG9yLnByb3RvdHlwZS5hZGRMaW5rID0gZnVuY3Rpb24gKGV2ZW50LCBsaW5rKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbmV0TGlua3NbZXZlbnRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV0TGlua3NbZXZlbnRdLnB1c2gobGluayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXRMaW5rc1tldmVudF0gPSBbbGlua107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENvbW11bmljYXRvci5wcm90b3R5cGUucHVibGlzaCA9IGZ1bmN0aW9uIChwYWNrLCBwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHZhciBsaW5rcyA9IHRoaXMuX25ldExpbmtzW3BhY2sudHlwZV07XHJcbiAgICAgICAgICAgICAgICBpZiAobGlua3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWx0YSA9IGxpbmsuZnVuLmNhbGN1bGF0ZShwYXJhbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkZWx0YSkgPiBfdGhpcy5fc2Vuc2l0aXZpdHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhID0gcGFjay5iZWhhdmlvciA9PT0gbGluay5iZWhhdmlvciA/IGRlbHRhIDogLWRlbHRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluay5zY2FsZS5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBDb21tdW5pY2F0b3I7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBDb21tdW5pY2F0aW9ucy5Db21tdW5pY2F0b3IgPSBDb21tdW5pY2F0b3I7XHJcbiAgICB9KShDb21tdW5pY2F0aW9ucyA9IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMgfHwgKEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIENvbW11bmljYXRpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChDb21tdW5pY2F0aW9ucykge1xyXG4gICAgICAgIChmdW5jdGlvbiAoQmVoYXZpb3JTY2FsZVR5cGVzKSB7XHJcbiAgICAgICAgICAgIEJlaGF2aW9yU2NhbGVUeXBlc1tCZWhhdmlvclNjYWxlVHlwZXNbXCJpbmNyZWFzZVwiXSA9IDFdID0gXCJpbmNyZWFzZVwiO1xyXG4gICAgICAgICAgICBCZWhhdmlvclNjYWxlVHlwZXNbQmVoYXZpb3JTY2FsZVR5cGVzW1wiZGVjcmVhc2VcIl0gPSAyXSA9IFwiZGVjcmVhc2VcIjtcclxuICAgICAgICB9KShDb21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMgfHwgKENvbW11bmljYXRpb25zLkJlaGF2aW9yU2NhbGVUeXBlcyA9IHt9KSk7XHJcbiAgICAgICAgdmFyIEJlaGF2aW9yU2NhbGVUeXBlcyA9IENvbW11bmljYXRpb25zLkJlaGF2aW9yU2NhbGVUeXBlcztcclxuICAgIH0pKENvbW11bmljYXRpb25zID0gQW5pbWFscy5Db21tdW5pY2F0aW9ucyB8fCAoQW5pbWFscy5Db21tdW5pY2F0aW9ucyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgRnVuY3Rpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChGdW5jdGlvbnMpIHtcclxuICAgICAgICB2YXIgRmFjdG9yaWVzO1xyXG4gICAgICAgIChmdW5jdGlvbiAoRmFjdG9yaWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBGdW5jdGlvbkZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gRnVuY3Rpb25GYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tGdW5jdGlvbnMuRnVuY3Rpb25UeXBlcy5saW5lXSA9IEZ1bmN0aW9ucy5MaW5lRnVuY3Rpb247XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW0Z1bmN0aW9ucy5GdW5jdGlvblR5cGVzLnF1YWRyYXRpY10gPSBGdW5jdGlvbnMuUXVhZHJhdGljRnVuY3Rpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBGdW5jdGlvbkZhY3RvcnkuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBGdW5jdGlvbkZhY3RvcnkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIEZ1bmN0aW9uRmFjdG9yeS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHR5cGUsIHN5c3RlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1t0eXBlXSA9IHN5c3RlbTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBGdW5jdGlvbkZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChmdW5jdGlvblR5cGUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy5fZmFjdG9yaWVzW2Z1bmN0aW9uVHlwZV0ocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb25GYWN0b3J5O1xyXG4gICAgICAgICAgICB9KCkpO1xyXG4gICAgICAgICAgICBGYWN0b3JpZXMuRnVuY3Rpb25GYWN0b3J5ID0gRnVuY3Rpb25GYWN0b3J5O1xyXG4gICAgICAgIH0pKEZhY3RvcmllcyA9IEZ1bmN0aW9ucy5GYWN0b3JpZXMgfHwgKEZ1bmN0aW9ucy5GYWN0b3JpZXMgPSB7fSkpO1xyXG4gICAgfSkoRnVuY3Rpb25zID0gQW5pbWFscy5GdW5jdGlvbnMgfHwgKEFuaW1hbHMuRnVuY3Rpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBGdW5jdGlvbnM7XHJcbiAgICAoZnVuY3Rpb24gKEZ1bmN0aW9ucykge1xyXG4gICAgICAgIChmdW5jdGlvbiAoRnVuY3Rpb25UeXBlcykge1xyXG4gICAgICAgICAgICBGdW5jdGlvblR5cGVzW0Z1bmN0aW9uVHlwZXNbXCJsaW5lXCJdID0gMV0gPSBcImxpbmVcIjtcclxuICAgICAgICAgICAgRnVuY3Rpb25UeXBlc1tGdW5jdGlvblR5cGVzW1wicXVhZHJhdGljXCJdID0gMl0gPSBcInF1YWRyYXRpY1wiO1xyXG4gICAgICAgIH0pKEZ1bmN0aW9ucy5GdW5jdGlvblR5cGVzIHx8IChGdW5jdGlvbnMuRnVuY3Rpb25UeXBlcyA9IHt9KSk7XHJcbiAgICAgICAgdmFyIEZ1bmN0aW9uVHlwZXMgPSBGdW5jdGlvbnMuRnVuY3Rpb25UeXBlcztcclxuICAgIH0pKEZ1bmN0aW9ucyA9IEFuaW1hbHMuRnVuY3Rpb25zIHx8IChBbmltYWxzLkZ1bmN0aW9ucyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgRnVuY3Rpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChGdW5jdGlvbnMpIHtcclxuICAgICAgICB2YXIgTGluZUZ1bmN0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gTGluZUZ1bmN0aW9uKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnQgPSBwYXJhbXNbMF0gfHwgMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyZWUgPSBwYXJhbXNbMV0gfHwgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTGluZUZ1bmN0aW9uLnByb3RvdHlwZSwgXCJjb2VmZmljaWVudFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2VmZmljaWVudCA9IHBhcmFtID8gcGFyYW0gOiAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMaW5lRnVuY3Rpb24ucHJvdG90eXBlLCBcImZyZWVcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZyZWU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcmVlID0gcGFyYW0gPyBwYXJhbSA6IDA7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTGluZUZ1bmN0aW9uLnByb3RvdHlwZS5jYWxjdWxhdGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2VmZmljaWVudCAqIHBhcmFtICsgdGhpcy5fZnJlZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIExpbmVGdW5jdGlvbjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIEZ1bmN0aW9ucy5MaW5lRnVuY3Rpb24gPSBMaW5lRnVuY3Rpb247XHJcbiAgICB9KShGdW5jdGlvbnMgPSBBbmltYWxzLkZ1bmN0aW9ucyB8fCAoQW5pbWFscy5GdW5jdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEZ1bmN0aW9ucztcclxuICAgIChmdW5jdGlvbiAoRnVuY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIFF1YWRyYXRpY0Z1bmN0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gUXVhZHJhdGljRnVuY3Rpb24ocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2VmZmljaWVudEEgPSBwYXJhbXNbMF0gfHwgMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvZWZmaWNpZW50QiA9IHBhcmFtc1sxXSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnJlZSA9IHBhcmFtc1syXSB8fCAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRdWFkcmF0aWNGdW5jdGlvbi5wcm90b3R5cGUsIFwiY29lZmZpY2llbnRBXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2VmZmljaWVudEE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2VmZmljaWVudEEgPSBwYXJhbSA/IHBhcmFtIDogMDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUXVhZHJhdGljRnVuY3Rpb24ucHJvdG90eXBlLCBcImNvZWZmaWNpZW50QlwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnRCO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnRCID0gcGFyYW0gPyBwYXJhbSA6IDA7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFF1YWRyYXRpY0Z1bmN0aW9uLnByb3RvdHlwZSwgXCJmcmVlXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcmVlO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJlZSA9IHBhcmFtID8gcGFyYW0gOiAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFF1YWRyYXRpY0Z1bmN0aW9uLnByb3RvdHlwZS5jYWxjdWxhdGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2VmZmljaWVudEEgKiAoTWF0aC5wb3cocGFyYW0sIDIpKSArIHRoaXMuX2NvZWZmaWNpZW50QiAqIHBhcmFtICsgdGhpcy5fZnJlZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFF1YWRyYXRpY0Z1bmN0aW9uO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgRnVuY3Rpb25zLlF1YWRyYXRpY0Z1bmN0aW9uID0gUXVhZHJhdGljRnVuY3Rpb247XHJcbiAgICB9KShGdW5jdGlvbnMgPSBBbmltYWxzLkZ1bmN0aW9ucyB8fCAoQW5pbWFscy5GdW5jdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFNjYWxlcztcclxuICAgIChmdW5jdGlvbiAoU2NhbGVzKSB7XHJcbiAgICAgICAgdmFyIEFTY2FsZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEFTY2FsZSgpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJuYW1lXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcIm1pblwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWluO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWluID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRQZXJjZW50YWdlSW5TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcIm1heFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRQZXJjZW50YWdlSW5TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcImN1cnJlbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRQZXJjZW50YWdlSW5TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcInBlcmNlbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcmNlbnQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wZXJjZW50ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VmFsdWVPblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFTY2FsZS5wcm90b3R5cGUsIFwidHlwZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3R5cGUgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBBU2NhbGUucHJvdG90eXBlLmdldFBlcmNlbnRhZ2VJblNjYWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyY2VudCA9ICgodGhpcy5fY3VycmVudCAtIHRoaXMuX21pbikgKiAxMDApIC8gKHRoaXMuX21heCAtIHRoaXMuX21pbik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIEFTY2FsZS5wcm90b3R5cGUuZ2V0Q3VycmVudFZhbHVlT25TY2FsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSAoKCh0aGlzLl9tYXggLSB0aGlzLl9taW4pIC8gMTAwKSAqIHRoaXMuX3BlcmNlbnQpICsgdGhpcy5fbWluO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQVNjYWxlO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU2NhbGVzLkFTY2FsZSA9IEFTY2FsZTtcclxuICAgIH0pKFNjYWxlcyA9IEFuaW1hbHMuU2NhbGVzIHx8IChBbmltYWxzLlNjYWxlcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU2NhbGVzO1xyXG4gICAgKGZ1bmN0aW9uIChTY2FsZXMpIHtcclxuICAgICAgICB2YXIgRmFjdG9yaWVzO1xyXG4gICAgICAgIChmdW5jdGlvbiAoRmFjdG9yaWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBTY2FsZUZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gU2NhbGVGYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tTY2FsZXMuU2NhbGVUeXBlcy5zeXN0ZW1dID0gQW5pbWFscy5TY2FsZXMuVHlwZVNjYWxlcy5TeXN0ZW1TY2FsZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnRdID0gQW5pbWFscy5TY2FsZXMuVHlwZVNjYWxlcy5Bcmd1bWVudFNjYWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgU2NhbGVGYWN0b3J5Lmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgU2NhbGVGYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBTY2FsZUZhY3RvcnkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0eXBlLCBzeXN0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbdHlwZV0gPSBzeXN0ZW07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgU2NhbGVGYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoZnVuY3Rpb25UeXBlLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMuX2ZhY3Rvcmllc1tmdW5jdGlvblR5cGVdKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNjYWxlRmFjdG9yeTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgRmFjdG9yaWVzLlNjYWxlRmFjdG9yeSA9IFNjYWxlRmFjdG9yeTtcclxuICAgICAgICB9KShGYWN0b3JpZXMgPSBTY2FsZXMuRmFjdG9yaWVzIHx8IChTY2FsZXMuRmFjdG9yaWVzID0ge30pKTtcclxuICAgIH0pKFNjYWxlcyA9IEFuaW1hbHMuU2NhbGVzIHx8IChBbmltYWxzLlNjYWxlcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU2NhbGVzO1xyXG4gICAgKGZ1bmN0aW9uIChTY2FsZXMpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKFBhcmFtZXRlclNjYWxlVHlwZXMpIHtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wic3RhdGVcIl0gPSAxXSA9IFwic3RhdGVcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wic3BlZWRcIl0gPSAyXSA9IFwic3BlZWRcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wid2VpZ2h0XCJdID0gM10gPSBcIndlaWdodFwiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJoZWFydGJlYXRcIl0gPSA0XSA9IFwiaGVhcnRiZWF0XCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInByZXNzdXJlXCJdID0gNV0gPSBcInByZXNzdXJlXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcImFtb3VudFBvaW50UmVtZW1iZXJXYXRlclwiXSA9IDZdID0gXCJhbW91bnRQb2ludFJlbWVtYmVyV2F0ZXJcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wiYW1vdW50UG9pbnRSZW1lbWJlckdyYXNzXCJdID0gN10gPSBcImFtb3VudFBvaW50UmVtZW1iZXJHcmFzc1wiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJhbW91bnRQb2ludFJlbWVtYmVyTWVhdFwiXSA9IDhdID0gXCJhbW91bnRQb2ludFJlbWVtYmVyTWVhdFwiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJzcGVlZFNhdnZ5XCJdID0gOV0gPSBcInNwZWVkU2F2dnlcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wicmFkaXVzVmlzaW9uXCJdID0gMTBdID0gXCJyYWRpdXNWaXNpb25cIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wicmFkaXVzSGVhcmluZ1wiXSA9IDExXSA9IFwicmFkaXVzSGVhcmluZ1wiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJyYWRpdXNTbWVsbFwiXSA9IDEyXSA9IFwicmFkaXVzU21lbGxcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wicmFkaXVzVG91Y2hcIl0gPSAxM10gPSBcInJhZGl1c1RvdWNoXCI7XHJcbiAgICAgICAgfSkoU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMgfHwgKFNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzID0ge30pKTtcclxuICAgICAgICB2YXIgUGFyYW1ldGVyU2NhbGVUeXBlcyA9IFNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzO1xyXG4gICAgfSkoU2NhbGVzID0gQW5pbWFscy5TY2FsZXMgfHwgKEFuaW1hbHMuU2NhbGVzID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTY2FsZXM7XHJcbiAgICAoZnVuY3Rpb24gKFNjYWxlcykge1xyXG4gICAgICAgIChmdW5jdGlvbiAoU2NhbGVUeXBlcykge1xyXG4gICAgICAgICAgICBTY2FsZVR5cGVzW1NjYWxlVHlwZXNbXCJzeXN0ZW1cIl0gPSAwXSA9IFwic3lzdGVtXCI7XHJcbiAgICAgICAgICAgIFNjYWxlVHlwZXNbU2NhbGVUeXBlc1tcImFyZ3VtZW50XCJdID0gMV0gPSBcImFyZ3VtZW50XCI7XHJcbiAgICAgICAgfSkoU2NhbGVzLlNjYWxlVHlwZXMgfHwgKFNjYWxlcy5TY2FsZVR5cGVzID0ge30pKTtcclxuICAgICAgICB2YXIgU2NhbGVUeXBlcyA9IFNjYWxlcy5TY2FsZVR5cGVzO1xyXG4gICAgfSkoU2NhbGVzID0gQW5pbWFscy5TY2FsZXMgfHwgKEFuaW1hbHMuU2NhbGVzID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTY2FsZXM7XHJcbiAgICAoZnVuY3Rpb24gKFNjYWxlcykge1xyXG4gICAgICAgIHZhciBUeXBlU2NhbGVzO1xyXG4gICAgICAgIChmdW5jdGlvbiAoVHlwZVNjYWxlcykge1xyXG4gICAgICAgICAgICB2YXIgQXJndW1lbnRTY2FsZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgICAgICBfX2V4dGVuZHMoQXJndW1lbnRTY2FsZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIEFyZ3VtZW50U2NhbGUocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHBhcmFtcy5uYW1lIHx8IFwiTm8gbmFtZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21pbiA9IHBhcmFtcy5taW4gfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXggPSBwYXJhbXMubWF4IHx8IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gcGFyYW1zLmN1cnJlbnQgfHwgdGhpcy5fbWF4O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3BvbnNlRGVsYXkgPSBwYXJhbXMucmVzcG9uc2VEZWxheSB8fCAxMDAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3R5cGUgPSBwYXJhbXMudHlwZSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGVyY2VudGFnZUluU2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcmd1bWVudFNjYWxlLnByb3RvdHlwZSwgXCJyZXNwb25zZURlbGF5XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlRGVsYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNwb25zZURlbGF5ID0gcGFyYW0gPyBwYXJhbSA6IDEwMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJndW1lbnRTY2FsZS5wcm90b3R5cGUsIFwiY29tbXVuaWNhdG9yXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW11bmljYXRvcjtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbW11bmljYXRvciA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgQXJndW1lbnRTY2FsZS5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSBNYXRoLnNpZ24ocGFyYW1zKSA/IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMuQmVoYXZpb3JTY2FsZVR5cGVzLmluY3JlYXNlIDogQW5pbWFscy5Db21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMuZGVjcmVhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhY2sgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiBldmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5fdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21tdW5pY2F0b3IucHVibGlzaChwYWNrLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIEFyZ3VtZW50U2NhbGUucHJvdG90eXBlLmNoYW5nZSA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJleiA9IHRoaXMucGVyY2VudCArIGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXogPD0gMTAwICYmIHJleiA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IHJlejtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VmFsdWVPblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy50cmlnZ2VyKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLnJlc3BvbnNlRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcmd1bWVudFNjYWxlO1xyXG4gICAgICAgICAgICB9KFNjYWxlcy5BU2NhbGUpKTtcclxuICAgICAgICAgICAgVHlwZVNjYWxlcy5Bcmd1bWVudFNjYWxlID0gQXJndW1lbnRTY2FsZTtcclxuICAgICAgICB9KShUeXBlU2NhbGVzID0gU2NhbGVzLlR5cGVTY2FsZXMgfHwgKFNjYWxlcy5UeXBlU2NhbGVzID0ge30pKTtcclxuICAgIH0pKFNjYWxlcyA9IEFuaW1hbHMuU2NhbGVzIHx8IChBbmltYWxzLlNjYWxlcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU2NhbGVzO1xyXG4gICAgKGZ1bmN0aW9uIChTY2FsZXMpIHtcclxuICAgICAgICB2YXIgVHlwZVNjYWxlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFR5cGVTY2FsZXMpIHtcclxuICAgICAgICAgICAgdmFyIFN5c3RlbVNjYWxlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgICAgIF9fZXh0ZW5kcyhTeXN0ZW1TY2FsZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFN5c3RlbVNjYWxlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSBwYXJhbXMubmFtZSB8fCBcIk5vIG5hbWVcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9taW4gPSBwYXJhbXMubWluIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4ID0gcGFyYW1zLm1heCB8fCAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHBhcmFtcy5jdXJyZW50IHx8IHRoaXMuX21heDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gcGFyYW1zLnR5cGUgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFBlcmNlbnRhZ2VJblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW1TY2FsZS5wcm90b3R5cGUuYW5hbHlzaXMgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJleiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJleiArPSBwYXJhbS5wZXJjZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCA9IHJleiAvIHBhcmFtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VmFsdWVPblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFN5c3RlbVNjYWxlO1xyXG4gICAgICAgICAgICB9KFNjYWxlcy5BU2NhbGUpKTtcclxuICAgICAgICAgICAgVHlwZVNjYWxlcy5TeXN0ZW1TY2FsZSA9IFN5c3RlbVNjYWxlO1xyXG4gICAgICAgIH0pKFR5cGVTY2FsZXMgPSBTY2FsZXMuVHlwZVNjYWxlcyB8fCAoU2NhbGVzLlR5cGVTY2FsZXMgPSB7fSkpO1xyXG4gICAgfSkoU2NhbGVzID0gQW5pbWFscy5TY2FsZXMgfHwgKEFuaW1hbHMuU2NhbGVzID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIEZhY3RvcmllcztcclxuICAgICAgICAoZnVuY3Rpb24gKEZhY3Rvcmllcykge1xyXG4gICAgICAgICAgICB2YXIgU3lzdGVtRmFjdG9yeSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBTeXN0ZW1GYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tTeXN0ZW1zLlN5c3RlbVR5cGVzLm11c2N1bGFyXSA9IEFuaW1hbHMuU3lzdGVtcy5UeXBlU3lzdGVtcy5NdXNjdWxhcjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeV0gPSBBbmltYWxzLlN5c3RlbXMuVHlwZVN5c3RlbXMuQ2lyY3VsYXRvcnk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1N5c3RlbXMuU3lzdGVtVHlwZXMubmF2aWdhdGlvbl0gPSBBbmltYWxzLlN5c3RlbXMuVHlwZVN5c3RlbXMuTmF2aWdhdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFN5c3RlbUZhY3RvcnkuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBTeXN0ZW1GYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW1GYWN0b3J5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodHlwZSwgc3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW3R5cGVdID0gc3lzdGVtO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFN5c3RlbUZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChmdW5jdGlvblR5cGUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy5fZmFjdG9yaWVzW2Z1bmN0aW9uVHlwZV0ocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU3lzdGVtRmFjdG9yeTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgRmFjdG9yaWVzLlN5c3RlbUZhY3RvcnkgPSBTeXN0ZW1GYWN0b3J5O1xyXG4gICAgICAgIH0pKEZhY3RvcmllcyA9IFN5c3RlbXMuRmFjdG9yaWVzIHx8IChTeXN0ZW1zLkZhY3RvcmllcyA9IHt9KSk7XHJcbiAgICB9KShTeXN0ZW1zID0gQW5pbWFscy5TeXN0ZW1zIHx8IChBbmltYWxzLlN5c3RlbXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN5c3RlbXM7XHJcbiAgICAoZnVuY3Rpb24gKFN5c3RlbXMpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKFN5c3RlbVR5cGVzKSB7XHJcbiAgICAgICAgICAgIFN5c3RlbVR5cGVzW1N5c3RlbVR5cGVzW1wibXVzY3VsYXJcIl0gPSAxXSA9IFwibXVzY3VsYXJcIjtcclxuICAgICAgICAgICAgU3lzdGVtVHlwZXNbU3lzdGVtVHlwZXNbXCJjaXJjdWxhdG9yeVwiXSA9IDJdID0gXCJjaXJjdWxhdG9yeVwiO1xyXG4gICAgICAgICAgICBTeXN0ZW1UeXBlc1tTeXN0ZW1UeXBlc1tcIm1lbW9yeVwiXSA9IDNdID0gXCJtZW1vcnlcIjtcclxuICAgICAgICAgICAgU3lzdGVtVHlwZXNbU3lzdGVtVHlwZXNbXCJuYXZpZ2F0aW9uXCJdID0gNF0gPSBcIm5hdmlnYXRpb25cIjtcclxuICAgICAgICB9KShTeXN0ZW1zLlN5c3RlbVR5cGVzIHx8IChTeXN0ZW1zLlN5c3RlbVR5cGVzID0ge30pKTtcclxuICAgICAgICB2YXIgU3lzdGVtVHlwZXMgPSBTeXN0ZW1zLlN5c3RlbVR5cGVzO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIFR5cGVTeXN0ZW1zO1xyXG4gICAgICAgIChmdW5jdGlvbiAoVHlwZVN5c3RlbXMpIHtcclxuICAgICAgICAgICAgdmFyIENpcmN1bGF0b3J5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIENpcmN1bGF0b3J5KHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zdGF0ZV0gfHwgbmV3IEFuaW1hbHMuU2NhbGVzLlR5cGVTY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYXJ0YmVhdCA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLmhlYXJ0YmVhdF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc3VyZSA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnByZXNzdXJlXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDaXJjdWxhdG9yeS5wcm90b3R5cGUsIFwiaGVhcnRiZWF0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlYXJ0YmVhdDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDaXJjdWxhdG9yeS5wcm90b3R5cGUsIFwicHJlc3N1cmVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJlc3N1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXNzdXJlID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIENpcmN1bGF0b3J5LnByb3RvdHlwZS5jaGFuZ2VIZWFydGJlYXQgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXQuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgQ2lyY3VsYXRvcnkucHJvdG90eXBlLmNoYW5nZVByZXNzdXJlID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJlc3N1cmUuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgQ2lyY3VsYXRvcnkucHJvdG90eXBlLmFuYWx5c2lzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuYW5hbHlzaXMoW10pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBDaXJjdWxhdG9yeTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgVHlwZVN5c3RlbXMuQ2lyY3VsYXRvcnkgPSBDaXJjdWxhdG9yeTtcclxuICAgICAgICB9KShUeXBlU3lzdGVtcyA9IFN5c3RlbXMuVHlwZVN5c3RlbXMgfHwgKFN5c3RlbXMuVHlwZVN5c3RlbXMgPSB7fSkpO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIFR5cGVTeXN0ZW1zO1xyXG4gICAgICAgIChmdW5jdGlvbiAoVHlwZVN5c3RlbXMpIHtcclxuICAgICAgICAgICAgdmFyIE11c2N1bGFyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIE11c2N1bGFyKHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zdGF0ZV0gfHwgbmV3IEFuaW1hbHMuU2NhbGVzLlR5cGVTY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWlnaHQgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy53ZWlnaHRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE11c2N1bGFyLnByb3RvdHlwZSwgXCJzcGVlZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BlZWQgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE11c2N1bGFyLnByb3RvdHlwZSwgXCJ3ZWlnaHRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl93ZWlnaHQgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgTXVzY3VsYXIucHJvdG90eXBlLmNoYW5nZVNwZWVkID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BlZWQuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgTXVzY3VsYXIucHJvdG90eXBlLmNoYW5nZVdlaWdodCA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodC5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBNdXNjdWxhci5wcm90b3R5cGUuYW5hbHlzaXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5hbmFseXNpcyhbXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE11c2N1bGFyO1xyXG4gICAgICAgICAgICB9KCkpO1xyXG4gICAgICAgICAgICBUeXBlU3lzdGVtcy5NdXNjdWxhciA9IE11c2N1bGFyO1xyXG4gICAgICAgIH0pKFR5cGVTeXN0ZW1zID0gU3lzdGVtcy5UeXBlU3lzdGVtcyB8fCAoU3lzdGVtcy5UeXBlU3lzdGVtcyA9IHt9KSk7XHJcbiAgICB9KShTeXN0ZW1zID0gQW5pbWFscy5TeXN0ZW1zIHx8IChBbmltYWxzLlN5c3RlbXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN5c3RlbXM7XHJcbiAgICAoZnVuY3Rpb24gKFN5c3RlbXMpIHtcclxuICAgICAgICB2YXIgVHlwZVN5c3RlbXM7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChUeXBlU3lzdGVtcykge1xyXG4gICAgICAgICAgICB2YXIgTmF2aWdhdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBOYXZpZ2F0aW9uKHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zdGF0ZV0gfHwgbmV3IEFuaW1hbHMuU2NhbGVzLlR5cGVTY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlZWRTYXZ2eSA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkU2F2dnldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFkaXVzSGVhcmluZyA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnJhZGl1c0hlYXJpbmddO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFkaXVzU21lbGwgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNTbWVsbF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYWRpdXNWaXNpb24gPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNWaXNpb25dO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFkaXVzVG91Y2ggPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNUb3VjaF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmF2aWdhdGlvbi5wcm90b3R5cGUsIFwic3BlZWRTYXZ2eVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGVlZFNhdnZ5O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGVlZFNhdnZ5ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXZpZ2F0aW9uLnByb3RvdHlwZSwgXCJyYWRpdXNWaXNpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzVmlzaW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNWaXNpb24gPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdmlnYXRpb24ucHJvdG90eXBlLCBcInJhZGl1c0hlYXJpbmdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzSGVhcmluZztcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzSGVhcmluZyA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmF2aWdhdGlvbi5wcm90b3R5cGUsIFwicmFkaXVzU21lbGxcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzU21lbGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c1NtZWxsID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXZpZ2F0aW9uLnByb3RvdHlwZSwgXCJyYWRpdXNUb3VjaFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYWRpdXNUb3VjaDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzVG91Y2ggPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgTmF2aWdhdGlvbi5wcm90b3R5cGUuY2hhbmdlU3BlZWRTYXZ2eSA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwZWVkU2F2dnkuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgTmF2aWdhdGlvbi5wcm90b3R5cGUuY2hhbmdlUmFkaXVzVmlzaW9uID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzVmlzaW9uLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmFseXNpcygpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmNoYW5nZVJhZGl1c0hlYXJpbmcgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNIZWFyaW5nLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmFseXNpcygpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmNoYW5nZVJhZGl1c1NtZWxsID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzU21lbGwuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgTmF2aWdhdGlvbi5wcm90b3R5cGUuY2hhbmdlUmFkaXVzVG91Y2ggPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNUb3VjaC5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBOYXZpZ2F0aW9uLnByb3RvdHlwZS5hbmFseXNpcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmFuYWx5c2lzKFtdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTmF2aWdhdGlvbjtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgVHlwZVN5c3RlbXMuTmF2aWdhdGlvbiA9IE5hdmlnYXRpb247XHJcbiAgICAgICAgfSkoVHlwZVN5c3RlbXMgPSBTeXN0ZW1zLlR5cGVTeXN0ZW1zIHx8IChTeXN0ZW1zLlR5cGVTeXN0ZW1zID0ge30pKTtcclxuICAgIH0pKFN5c3RlbXMgPSBBbmltYWxzLlN5c3RlbXMgfHwgKEFuaW1hbHMuU3lzdGVtcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgbGlvbiA9IHtcclxuICAgIHN5c3RlbXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3lzdGVtcy5TeXN0ZW1UeXBlcy5tdXNjdWxhcixcclxuICAgICAgICAgICAgc2NhbGVzVHlwZTogW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuc3BlZWQgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy53ZWlnaHQgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN5c3RlbXMuU3lzdGVtVHlwZXMuY2lyY3VsYXRvcnksXHJcbiAgICAgICAgICAgIHNjYWxlc1R5cGU6IFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5wcmVzc3VyZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLmhlYXJ0YmVhdCB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIHNjYWxlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLmhlYXJ0YmVhdCxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KHQtdGA0LTRhtC10LHQuNC10L3QuNC1JyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDksXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMTIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnByZXNzdXJlLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQlNCw0LLQu9C10L3QuNC1JyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDgsXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VEZWxheTogMC4xM1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVTY2FsZTogQW5pbWFscy5TY2FsZXMuU2NhbGVUeXBlcy5hcmd1bWVudCxcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZCxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KHQutC+0YDQvtGB0YLRjCcsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50OiA5LFxyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiAxMDAsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZURlbGF5OiAwLjEyLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVTY2FsZTogQW5pbWFscy5TY2FsZXMuU2NhbGVUeXBlcy5hcmd1bWVudCxcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy53ZWlnaHQsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9CS0LXRgScsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50OiA4LFxyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiAxMCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIGNvbW11bmljYXRpb246IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuc3BlZWQsXHJcbiAgICAgICAgICAgIGxpbms6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLndlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogQW5pbWFscy5Db21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMuaW5jcmVhc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zOiBBbmltYWxzLkZ1bmN0aW9ucy5GdW5jdGlvblR5cGVzLmxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAuNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMC4xOFxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy53ZWlnaHQsXHJcbiAgICAgICAgICAgIGxpbms6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiBBbmltYWxzLkNvbW11bmljYXRpb25zLkJlaGF2aW9yU2NhbGVUeXBlcy5kZWNyZWFzZSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IEFuaW1hbHMuRnVuY3Rpb25zLkZ1bmN0aW9uVHlwZXMubGluZSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgMC41LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAwLjFcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxufTtcclxudmFyIEFQSUNvcmUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQVBJQ29yZSgpIHtcclxuICAgIH1cclxuICAgIEFQSUNvcmUuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmluc3QpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnN0ID0gbmV3IEFQSUNvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdDtcclxuICAgIH07XHJcbiAgICBBUElDb3JlLnByb3RvdHlwZS5jcmVhdGVBbmltYWwgPSBmdW5jdGlvbiAocHV0VG9Nb2RlbCwgaWQpIHtcclxuICAgICAgICB2YXIgZmFjdG9yeSA9IEFuaW1hbHMuQW5pbWFsQnVpbGRlci5pbnN0YW5jZSgpO1xyXG4gICAgICAgIHZhciBhbmltYWwgPSBmYWN0b3J5LmNyZWF0ZShsaW9uKTtcclxuICAgICAgICBhbmltYWwuaWQgPSBpZDtcclxuICAgICAgICByZXR1cm4gYW5pbWFsO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBBUElDb3JlO1xyXG59KCkpO1xyXG52YXIgTWFwO1xyXG4oZnVuY3Rpb24gKE1hcF8xKSB7XHJcbiAgICB2YXIgTWFwID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBNYXAoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE1hcC5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pbnN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnN0ID0gbmV3IE1hcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnN0O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcC5wcm90b3R5cGUsIFwid29ybGRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd29ybGQgPSBtYXA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6YXRpb25Xb3JsZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXb3JsZCB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcIm9ic3RhY2xlc0xheWVyXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsYXllcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29ic3RhY2xlc0xheWVyID0gbGF5ZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xheWVyIG9ic3RhY2xlIHdhcyBub3QgZm91bmQuLi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcC5wcm90b3R5cGUsIFwid2F0ZXJMYXllclwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93YXRlckxheWVyID0gbGF5ZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xheWVyIHdhdGVyIHdhcyBub3QgZm91bmQuLi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcC5wcm90b3R5cGUsIFwidHJlZUxheWVyXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsYXllcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyZWVMYXllciA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXllciB0cmVlIHdhcyBub3QgZm91bmQuLi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5faW5pdGlhbGl6YXRpb25Xb3JsZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6YXRpb25MYXllcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplTWFwVGlsZWQgPSB0aGlzLl93b3JsZC5nZXRNYXBTaXplKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NpemVUaWxlZCA9IHRoaXMuX3dvcmxkLmdldFRpbGVTaXplKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NpemVNYXBQaXhlbCA9IHRoaXMuX2dldFNpemVNYXBQaXhlbCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5faW5pdGlhbGl6YXRpb25MYXllciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnN0YWNsZXNMYXllciA9IHRoaXMuX3dvcmxkLmdldExheWVyKCdvYnN0YWNsZScpO1xyXG4gICAgICAgICAgICB0aGlzLndhdGVyTGF5ZXIgPSB0aGlzLl93b3JsZC5nZXRMYXllcignd2F0ZXInKTtcclxuICAgICAgICAgICAgdGhpcy50cmVlTGF5ZXIgPSB0aGlzLl93b3JsZC5nZXRMYXllcigndHJlZScpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5fZ2V0U2l6ZU1hcFBpeGVsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2l6ZVggPSB0aGlzLl9zaXplTWFwVGlsZWQud2lkdGggKiB0aGlzLl9zaXplVGlsZWQud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBzaXplWSA9IHRoaXMuX3NpemVNYXBUaWxlZC5oZWlnaHQgKiB0aGlzLl9zaXplVGlsZWQuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gY2MudjIoc2l6ZVgsIHNpemVZKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuY29udmVydFRpbGVkUG9zID0gZnVuY3Rpb24gKHBvc0luUGl4ZWwpIHtcclxuICAgICAgICAgICAgdmFyIHggPSBNYXRoLmZsb29yKChwb3NJblBpeGVsLngpIC8gdGhpcy5fc2l6ZVRpbGVkLndpZHRoKTtcclxuICAgICAgICAgICAgdmFyIHkgPSBNYXRoLmZsb29yKCh0aGlzLl9zaXplTWFwUGl4ZWwueSAtIChwb3NJblBpeGVsLnkpKSAvIHRoaXMuX3NpemVUaWxlZC5oZWlnaHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2MudjIoeCwgeSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXAucHJvdG90eXBlLmNvbnZlcnRQaXhlbFBvcyA9IGZ1bmN0aW9uIChwb3NJblRpbGVkKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zSW5UaWxlZC54ICogdGhpcy5fc2l6ZVRpbGVkLndpZHRoICsgdGhpcy5fc2l6ZVRpbGVkLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLl9zaXplTWFwUGl4ZWwueSAtIChwb3NJblRpbGVkLnkgKiB0aGlzLl9zaXplVGlsZWQuaGVpZ2h0KSAtIHRoaXMuX3NpemVUaWxlZC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICByZXR1cm4gY2MudjIoeCwgeSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXAucHJvdG90eXBlLmlzQ2hl0YFrT2JzdGFjbGUgPSBmdW5jdGlvbiAoZ2lkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0NvcnJlY3RQb3MoZ2lkKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX29ic3RhY2xlc0xheWVyLmdldFRpbGVHSURBdChnaWQueCwgZ2lkLnkpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5faXNDb3JyZWN0UG9zID0gZnVuY3Rpb24gKHBvcykge1xyXG4gICAgICAgICAgICBpZiAocG9zLnggPCAwIHx8IHBvcy55IDwgMCB8fCBwb3MueCA+IHRoaXMuX3NpemVNYXBUaWxlZC53aWR0aCAtIDEgfHwgcG9zLnkgPiB0aGlzLl9zaXplTWFwVGlsZWQuaGVpZ2h0IC0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIE1hcDtcclxuICAgIH0oKSk7XHJcbiAgICBNYXBfMS5NYXAgPSBNYXA7XHJcbn0pKE1hcCB8fCAoTWFwID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVpbGQtdHMuanMubWFwIiwiaW1wb3J0IHsgQ2lyY3VsYXJMaXN0IH0gZnJvbSAnLi9jaXJjdWxhci1saXN0JztcclxuXHJcbi8qKlxyXG4gKiDQndCw0YHRgtGA0LDQuNCy0LDQtdGCINC60YDRg9Cz0LvQvtC1INC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvlxyXG4gKiBAY2xhc3MgQ2lyY3VsYXJMaXN0QWN0aW9uc0FuaW1hbFxyXG4gKiBAZXh0ZW5kcyBDaXJjdWxhckxpc3RcclxuICovXHJcbnZhciBDaXJjdWxhckxpc3RBY3Rpb25zQW5pbWFsID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogQ2lyY3VsYXJMaXN0LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNGB0YLRgNC+0LnQutCwINC80LXQvdGOINC00LvRjyDQutC+0L3QutGA0LXRgtC90L7Qs9C+INC20LjQstC+0YLQvdC+0LPQvi4g0J3QsNGB0YLRgNCw0LjQstCw0LXRgiDRgNCw0LTQuNGD0YEg0LrRgNGD0LPQsC5cclxuICAgICAqIEBtZXRob2Qgc2V0dGluZ3NcclxuICAgICAqIEBwYXJhbSB7Y2MuQ29tcG9uZW50fSBjb250cm9sbGVyQW5pbWFsINC60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqL1xyXG4gICAgc2V0dGluZ3MoY29udHJvbGxlckFuaW1hbCl7XHJcbiAgICAgICAgbGV0IG5vZGUgPSBjb250cm9sbGVyQW5pbWFsLm5vZGU7XHJcblxyXG4gICAgICAgIHRoaXMucmFkaXVzID0gbm9kZS53aWR0aCAqIDEuNzU7XHJcbiAgICAgICAgaWYgKHRoaXMucmFkaXVzID4gMTUwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFkaXVzID0gMTUwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yYWRpdXMgPCAxMDApIHtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgPSAxMDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZWZyZXNoTWVudSgpO1xyXG4gICAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgeyBDaXJjdWxhckxpc3RBY3Rpb25zQW5pbWFsIH07IiwiLyoqXHJcbiAqINCh0L7RgdGC0L7Rj9C90LjQtSDQtNCy0LjQttC10L3QuNGPINC80LXQvdGOICjQv9C+INGH0LDRgdC+0LLQvtC5L9C/0YDQvtGC0LjQsiDRh9Cw0YHQvtCy0L7QuSkuXHJcbiAqIEB0eXBlIHtNb3ZlQ2lyY3VsYXJ9XHJcbiAqIEBzdGF0aWNcclxuICogQGVsZW1lbnQge251bWJlcn0gY2xvY2t3aXNlINC60YDRg9GC0LjRgtGB0Y8g0L/QviDRh9Cw0YHQvtCy0L7QuS5cclxuICogQGVsZW1lbnQge251bWJlcn0gYW50aWNsb2Nrd2lzZSDQutGA0YPRgtC40YLRgdGPINC/0YDQvtGC0LjQsiDRh9Cw0YHQvtCy0L7QuS5cclxuICovXHJcbmNvbnN0IE1vdmVDaXJjdWxhciA9IHtcclxuICAgIGNsb2Nrd2lzZTogMCwvL9C/0L4g0YfQsNGB0L7QstC+0LlcclxuICAgIGFudGljbG9ja3dpc2U6IDEsLy/Qv9GA0L7RgtC40LIg0YfQsNGB0L7QstC+0LlcclxufTtcclxuXHJcbi8qKlxyXG4gKiDQktGL0L/QvtC70L3Rj9C10YIg0LLRgNCw0YnQtdC90LjQtdC4INGA0LDQt9C80LXRidC10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QsiDQv9C+INC+0LrRgNGD0LbQvdC+0YHRgtC4LlxyXG4gKiBAY2xhc3MgQ2lyY3VsYXJMaXN0XHJcbiAqL1xyXG52YXIgQ2lyY3VsYXJMaXN0ID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfbGVuZ3RoQmV0d2VlblBvaW50czogMCwvL9GA0LDRgdGB0YLQvtGP0L3QuNC1INC80LXQttC00YMg0Y3Qu9C10LzQtdC90YLQsNC80LhcclxuICAgICAgICBfY2VudHJlOiBjYy5WZWMyLC8v0KbQtdC90YLRgCDQutGA0YPQs9CwXHJcbiAgICAgICAgX2FycmF5QW5nbGVMaXN0OiBbXSwvLy/QvNCw0YHRgdC40LIg0YPQs9C70L7QsiDQu9C40YHRgtC+0LIg0L3QsCDQutC+0YLQvtGA0YvRhSDQvtC90Lgg0L3QsNGF0L7QtNGP0YLRgdGPXHJcbiAgICAgICAgX3Bvb2xJbnZpc2libGVMaXN0OiBbXSwvL9C80LDRgdGB0LjQsiDQvdC10LLQuNC00LjQvNGL0YUg0LvQuNGB0YLQvtCyXHJcbiAgICAgICAgX3ByZXZSb3RhdGlvbjogMCwvL9C/0YDQtdC00YvQtNGD0YnQuNC5INGD0LPQvtC7INCy0L7QstC+0YDQvtGC0LAg0LTQviDRgtC10LrRg9GJ0LXQs9C+INC/0L7QstC+0YDQvtGC0LBcclxuICAgICAgICBfc3RhdGVEaXJlY3Rpb246IE1vdmVDaXJjdWxhci5jbG9ja3dpc2UsLy/QvdCw0L/RgNCw0LLQu9C10L3QuNC1INC00LLQuNC20LXQvdC40Y9cclxuXHJcbiAgICAgICAgYW1vdW50VmlzaWJsTGlzdDogNywvL9C60L7Qu9C40YfQtdGB0YLQstC+INCy0LjQtNC40LzRi9GFINC70LjQv9C10YHRgtC60L7QsiDQvNC10L3RjlxyXG4gICAgICAgIGFuZ2xlVHJhbnNpdGlvbjogMjI1LC8v0YPQs9C+0Lsg0L/QtdGA0LXRhdC+0LTQsCDQuCDQv9C+0Y/QstC70LXQvdC40Y/QvdC+0LLRi9GFINC70LjQv9C10YHRgtC60L7QslxyXG4gICAgICAgIHdpZHRoVHJhbnNpdGlvbjogMC4zLC8v0YjQuNGA0LjQvdCwINC/0LXRgNC10YXQvtC00LAg0LIg0LPRgNCw0LTRg9GB0LDRhVxyXG4gICAgICAgIHJhZGl1czogMTMwLC8v0YDQsNC00LjRg9GBINC90LAg0LrQvtGC0L7RgNC+0Lwg0LHRg9C00YPRgiDQutGA0YPRgtC40YLRgdGPINCy0YHQtSDQutC90L7Qv9C60LhcclxuICAgICAgICBzZW5zaXRpdml0eTogMSwvL9Cn0YPQstGB0YLQstC40YLQtdC70L3QvtGB0YLRjCDQsdCw0YDQsNCx0LDQvdCwINC6INC00LLQuNC20LXQvdC40Y4g0YHQstCw0LnQv9CwINC/0L4g0LrQvtC+0YDQtNC40L3QsNGC0LVcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAgICAgKiBAbWV0aG9kIG9uTG9hZFxyXG4gICAgICovXHJcbiAgICBvbkxvYWQoKXtcclxuICAgICAgICB0aGlzLl9wbGFjZW1lbnRMaXN0c01lbnUoKTtcclxuICAgICAgICB0aGlzLl9wcmV2Um90YXRpb24gPSB0aGlzLm5vZGUucm90YXRpb247XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQvdC+0LLQuNGC0Ywg0L/QvtC30LjRhtC40Lgg0LrQvdC+0L/QvtC6INCyINC80LXQvdGOLiDQoSDRg9GH0LXRgtC+0Lwg0YDQsNC00LjRg9GB0LAg0L7QutGA0YPQttC90L7RgdGC0LguXHJcbiAgICAgKiBAbWV0aG9kIF9yZWZyZXNoTWVudVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3JlZnJlc2hNZW51KCl7XHJcbiAgICAgICAgdGhpcy5fcGxhY2VtZW50TGlzdHNNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNGB0L/RgNC10LTQtdC70LXQvdC40LUg0LrQvdC+0L/QvtC6INC/0L4g0L7QutGA0YPQttC90L7RgdGC0LguXHJcbiAgICAgKiBAbWV0aG9kIF9wbGFjZW1lbnRMaXN0c01lbnVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9wbGFjZW1lbnRMaXN0c01lbnUoKXtcclxuICAgICAgICAvL9GA0LDRgdGB0YfQuNGC0YvQstCw0LXQvCDRhtC10L3RgtGAINC60YDRg9Cz0LBcclxuICAgICAgICBsZXQgd2luZG93ID0gdGhpcy5ub2RlLnBhcmVudDtcclxuICAgICAgICBsZXQgY3VycmVudFJhZGlhbnMgPSAwLCB4LCB5O1xyXG4gICAgICAgIHRoaXMuX2FycmF5QW5nbGVMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5fcG9vbEludmlzaWJsZUxpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2VudHJlID0gY2MudjIod2luZG93LndpZHRoIC8gMiwgd2luZG93LmhlaWdodCAvIDIpO1xyXG4gICAgICAgIHRoaXMuX2xlbmd0aEJldHdlZW5Qb2ludHMgPSAyICogTWF0aC5QSSAvIHRoaXMuYW1vdW50VmlzaWJsTGlzdDtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50UmFkaWFucyA+PSAyICogTWF0aC5QSSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Bvb2xJbnZpc2libGVMaXN0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB5ID0gdGhpcy5yYWRpdXMgKiBNYXRoLnNpbihjdXJyZW50UmFkaWFucyk7XHJcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy5yYWRpdXMgKiBNYXRoLmNvcyhjdXJyZW50UmFkaWFucyk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNldFBvc2l0aW9uKHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXJyYXlBbmdsZUxpc3QucHVzaCh7aXRlbTogaXRlbSwgYW5nbGU6IGN1cnJlbnRSYWRpYW5zICogKDE4MCAvIE1hdGguUEkpfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRSYWRpYW5zICs9IHRoaXMuX2xlbmd0aEJldHdlZW5Qb2ludHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvQtdC90LjQtSDQvdCw0L/RgNCw0LLQu9C10L3QuNGPINCy0YDQsNGJ0LXQvdC40Y8g0Lgg0LLRi9C30YvQstCw0LXRgiDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC40Lkg0L7QsdGA0LDQsdC+0YLRh9C40LosINC/0LXRgNC10LTQsNCy0LDRjyDQt9C90LDRh9C10L3QuNGPINGBXHJcbiAgICAgKiDRg9GH0LXRgtC+0Lwg0YfRg9Cy0YHRgtCy0LjRgtC10LvRjNC90L7RgdGC0LguXHJcbiAgICAgKiBAbWV0aG9kIGRpcmVjdGlvblJvdGF0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCDQtNC10LvRjNGC0LAg0LjQt9C80LXQvdC10L3QuNGPINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0LjQt9C80LXQvdC10L3QuNGPINC/0L4g0L7RgNC00LjQvdCw0YLQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NYINC/0L7Qu9C+0LbQtdC90LjQtSDRgtCw0YfQsCDQv9C+INCw0LHRhtC40YHRgdC1LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY1kg0L/QvtC70L7QttC10L3QuNC1INGC0LDRh9CwINC/0L4g0L7RgNC00LjQvdCw0YLQtS5cclxuICAgICAqL1xyXG4gICAgZGlyZWN0aW9uUm90YXRpb24oeCwgeSwgbG9jWCwgbG9jWSl7XHJcbiAgICAgICAgLy/Qv9GA0LjQvNC10L3Rj9C10Lwg0YfRg9Cy0YHRgtCy0LjRgtC10LvRjNC90L7RgdGC0YxcclxuICAgICAgICB4ID0geCAqIHRoaXMuc2Vuc2l0aXZpdHk7XHJcbiAgICAgICAgeSA9IHkgKiB0aGlzLnNlbnNpdGl2aXR5O1xyXG5cclxuICAgICAgICBpZiAobG9jWCA+IHRoaXMuX2NlbnRyZS54ICYmIGxvY1kgPiB0aGlzLl9jZW50cmUueSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vYnIxKHgsIHkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobG9jWCA8IHRoaXMuX2NlbnRyZS54ICYmIGxvY1kgPiB0aGlzLl9jZW50cmUueSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vYnIyKHgsIHkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobG9jWCA8IHRoaXMuX2NlbnRyZS54ICYmIGxvY1kgPCB0aGlzLl9jZW50cmUueSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vYnIzKHgsIHkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobG9jWCA+IHRoaXMuX2NlbnRyZS54ICYmIGxvY1kgPCB0aGlzLl9jZW50cmUueSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vYnI0KHgsIHkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5yb3RhdGlvbiArPSAwLjAwMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NldERpcmVjdGlvbigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hbW91bnRWaXNpYmxMaXN0IDwgdGhpcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl93b3JraW5nVmlzaWJsZUVsZW1lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LDQsdC+0YLQsNC10YIg0YEg0L/QvtGP0LLQu9C10L3QuNC10Lwg0Y3Qu9C10LzQtdC90YLQvtCyLlxyXG4gICAgICogQG1ldGhvZCBfd29ya2luZ1Zpc2libGVFbGVtZW50c1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3dvcmtpbmdWaXNpYmxlRWxlbWVudHMoKXtcclxuICAgICAgICBsZXQgYW5nbGUgPSB0aGlzLmdldEFuZ2xlTWVudSgpO1xyXG4gICAgICAgIC8v0KPQt9C90LDQtdC8INC00LvRjyDQutCw0LbQtNC+0LPQviDRjdC70LXQvNC10L3RgtCwINC10LPQviDRg9Cz0L7QuyDQvdCwINC60L7RgtC+0YDQvtC8INC+0L0g0L3QsNGF0L7QtNC40YLRgdGPXHJcbiAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zd2FwRWxlbWVudCh0aGlzLmdldEFuZ2xlTGlzdChpdGVtLCBhbmdsZSksIGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFuZ2xlID0gdGhpcy5nZXRBbmdsZU1lbnUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0LTQsNC10YIg0YPQs9C+0Lsg0LzQtdC90Y4uXHJcbiAgICAgKiBAbWV0aG9kIGdldEFuZ2xlTWVudVxyXG4gICAgICogQHJldHVybnMge251bWJlcn0g0YPQs9C+0Lsg0L/QvtCy0L7RgNC+0YLQsCDQvtGCIDAg0LTQviAzNjAuXHJcbiAgICAgKi9cclxuICAgIGdldEFuZ2xlTWVudSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUucm90YXRpb24gLSAzNjAgKiBNYXRoLmZsb29yKHRoaXMubm9kZS5yb3RhdGlvbiAvIDM2MCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNCx0L7RgtCw0LXRgiDRgSDRjdC70LXQvNC10L3RgtCw0LzQuCDQstGL0LrQu9GO0YfQsNGPINC40YUg0Lgg0L/QvtC00YHRgtCw0LLQu9GP0Y/RjyDQt9CwINC80LXRgdGC0L4g0L3QuNGFINC00YDRg9Cz0LjQtSDRjdC10LvQtdC80LXQvdGC0YsuXHJcbiAgICAgKiBAbWV0aG9kIF9zd2FwRWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlINGD0LPQvtC7INC90LAg0LrQvtGC0L7RgNC+0Lwg0L3QsNGF0L7QtNC40YLRgdGPINGN0LvQtdC80LXQvdGCLlxyXG4gICAgICogQHBhcmFtIHtjYy5Ob2RlfSBlbGVtZW50INGN0LvQtdC80LXQvdGCL9C70LjRgdGCINC60L7RgtC+0YDRi9C5INC90LXQvtCx0YXQvtC00LjQvNC+INC30LDQvNC10L3QuNGC0Ywg0L3QsCDRgdC70LXQtNGD0Y7RidC40Lkg0Y3Qu9C10LzQtdC90YIg0LjQtyDQvtGH0LXRgNC10LTQuCDQvdC10LLQuNC00LjQvNGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3N3YXBFbGVtZW50KGFuZ2xlLCBlbGVtZW50KXtcclxuICAgICAgICBpZiAoYW5nbGUgPiB0aGlzLmFuZ2xlVHJhbnNpdGlvbiAtIHRoaXMud2lkdGhUcmFuc2l0aW9uICYmIGFuZ2xlIDwgdGhpcy5hbmdsZVRyYW5zaXRpb24gKyB0aGlzLndpZHRoVHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBlbGVtZW50LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgYWN0dWFsTGlzdCA9IHRoaXMuX3Bvb2xJbnZpc2libGVMaXN0LnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGFjdHVhbExpc3Quc2V0UG9zaXRpb24oY2MudjIoZWxlbWVudC54LCBlbGVtZW50LnkpKTtcclxuICAgICAgICAgICAgYWN0dWFsTGlzdC5yb3RhdGlvbiA9IGVsZW1lbnQucm90YXRpb247XHJcbiAgICAgICAgICAgIGFjdHVhbExpc3QuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fcG9vbEludmlzaWJsZUxpc3QucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5fYXJyYXlBbmdsZUxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXRlbS5uYW1lID09PSBlbGVtZW50Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLml0ZW0gPSBhY3R1YWxMaXN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICh0aGlzLl9zdGF0ZURpcmVjdGlvbiA9PT0gTW92ZUNpcmN1bGFyLmNsb2Nrd2lzZSkgPyB0aGlzLm5vZGUucm90YXRpb24gKz0gdGhpcy53aWR0aFRyYW5zaXRpb24gOiB0aGlzLm5vZGUucm90YXRpb24gLT0gdGhpcy53aWR0aFRyYW5zaXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGD0LPQvtC7INGN0LvQtdC80LXQvdGC0LAv0LvQuNGB0YLQsCDQv9C+0LQg0LrQvtGC0L7RgNGL0Lwg0L7QvSDQvdCw0YXQvtC00LjRgtGB0Y8uXHJcbiAgICAgKiBAbWV0aG9kIGdldEFuZ2xlTGlzdFxyXG4gICAgICogQHBhcmFtIHtjYy5Ob2RlfSBlbGVtZW50INC90L7QtCDRjdC70LXQvNC10L3RgtCwLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlINGD0LPQvtC7INC/0L7QstC+0YDQvtGC0LAg0LzQtdC90Y4uXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9INGD0LPQvtC7INC70LjRgdGC0LAv0Y3Qu9C10LzQtdC90YLQsCDQvNC10L3Rji5cclxuICAgICAqL1xyXG4gICAgZ2V0QW5nbGVMaXN0KGVsZW1lbnQsIGFuZ2xlKXtcclxuICAgICAgICBsZXQgb2JqID0gdGhpcy5fYXJyYXlBbmdsZUxpc3QuZmlsdGVyKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLml0ZW0ueCA9PT0gZWxlbWVudC54ICYmIGl0ZW0uaXRlbS55ID09PSBlbGVtZW50Lnk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iaiA9IG9ialswXS5hbmdsZSAtIGFuZ2xlO1xyXG4gICAgICAgIG9iaiAtPSBNYXRoLmZsb29yKG9iaiAvIDM2MCkgKiAzNjA7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDRgdC+0YHRgtC+0Y/QvdC40LUg0LTQstC40LbQtdC90LjRjyDQvNC10L3RjiDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0L3QsNC/0YDQsNCy0LvQtdC90LjRjyDQv9C+0LLQvtGA0L7RgtCwLlxyXG4gICAgICogQG1ldGhvZCBfc2V0RGlyZWN0aW9uXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0RGlyZWN0aW9uKCl7XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZS5yb3RhdGlvbiA+IHRoaXMuX3ByZXZSb3RhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZURpcmVjdGlvbiA9IE1vdmVDaXJjdWxhci5jbG9ja3dpc2U7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm5vZGUucm90YXRpb24gPCB0aGlzLl9wcmV2Um90YXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGVEaXJlY3Rpb24gPSBNb3ZlQ2lyY3VsYXIuYW50aWNsb2Nrd2lzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcHJldlJvdGF0aW9uID0gdGhpcy5ub2RlLnJvdGF0aW9uO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0YLQsNCx0LjQu9C40LfQuNGA0YPQtdGCINGN0LvQtdC80LXQvdGC0Ysg0LzQtdC90Y4g0L/QviDQv9C+0LvQvtC20LXQvdC40Y4g0Log0LPQvtGA0LjQt9C+0L3RgtGDLlxyXG4gICAgICogQG1ldGhvZCBzdGFiaWxpemF0aW9uRWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgc3RhYmlsaXphdGlvbkVsZW1lbnRzKCl7XHJcbiAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5yb3RhdGlvbiA9IC10aGlzLm5vZGUucm90YXRpb247XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0L/QtdGA0LLQvtC5INGH0LXRgtCy0LXRgNGC0Lgg0L7QutGA0YPQttC90L7RgdGC0LguINCg0LDRgdC/0L7Qt9C90LDQtdGCINC00LLQuNC20LXQvdC40LUg0YLQsNGH0LAg0Lgg0L/RgNC40LzQtdC90Y/QtdGCINGB0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC10LUg0L/QvtCy0LXQtNC10L3QuNC1LlxyXG4gICAgICog0JTQu9GPINC+0LHQtdGB0L/QtdGH0LXQvdC40Y8g0LLRgNCw0YnQtdC90LjRjyDQvtC60YDRg9C20L3QvtGB0YLQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvC5cclxuICAgICAqIEBtZXRob2QgX29icjFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4INC00LXQu9GM0YLQsCDQv9C+INCw0LHRhtC40YHRgdC1LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkg0LTQtdC70YzRgtCwINC/0L4g0L7RgNC00LjQvdCw0YLQtS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9vYnIxKHgsIHkpe1xyXG4gICAgICAgIHRoaXMubm9kZS5yb3RhdGlvbiArPSB4O1xyXG4gICAgICAgIHRoaXMubm9kZS5yb3RhdGlvbiAtPSB5O1xyXG4gICAgICAgIHRoaXMuc3RhYmlsaXphdGlvbkVsZW1lbnRzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LLRgtC+0YDQvtC5INGH0LXRgtCy0LXRgNGC0Lgg0LrRgNGD0LPQsC4g0KDQsNGB0L/QvtC30L3QsNC10YIg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsCDQuCDQv9GA0LjQvNC10L3Rj9C10YIg0YHQvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQv9C+0LLQtdC00LXQvdC40LUuXHJcbiAgICAgKiDQlNC70Y8g0L7QsdC10YHQv9C10YfQtdC90LjRjyDQstGA0LDRidC10L3QuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gICAgICogQG1ldGhvZCBfb2JyMlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgg0LTQtdC70YzRgtCwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29icjIoeCwgeSl7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IHk7XHJcbiAgICAgICAgdGhpcy5zdGFiaWxpemF0aW9uRWxlbWVudHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgtGA0LXRgtGM0LXQuSDRh9C10YLQstC10YDRgtC4INC60YDRg9Cz0LAuINCg0LDRgdC/0L7Qt9C90LDQtdGCINC00LLQuNC20LXQvdC40LUg0YLQsNGH0LAg0Lgg0L/RgNC40LzQtdC90Y/QtdGCINGB0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC10LUg0L/QvtCy0LXQtNC10L3QuNC1LlxyXG4gICAgICog0JTQu9GPINC+0LHQtdGB0L/QtdGH0LXQvdC40Y8g0LLRgNCw0YnQtdC90LjRjyDQvtC60YDRg9C20L3QvtGB0YLQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvC5cclxuICAgICAqIEBtZXRob2QgX29icjNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4INC00LXQu9GM0YLQsCDQv9C+INCw0LHRhtC40YHRgdC1LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkg0LTQtdC70YzRgtCwINC/0L4g0L7RgNC00LjQvdCw0YLQtS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9vYnIzKHgsIHkpe1xyXG4gICAgICAgIHRoaXMubm9kZS5yb3RhdGlvbiAtPSB4O1xyXG4gICAgICAgIHRoaXMubm9kZS5yb3RhdGlvbiArPSB5O1xyXG4gICAgICAgIHRoaXMuc3RhYmlsaXphdGlvbkVsZW1lbnRzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0YfQtdGC0LLQtdGA0YLQvtC5INGH0LXRgtCy0LXRgNGC0Lgg0LrRgNGD0LPQsC4g0KDQsNGB0L/QvtC30L3QsNC10YIg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsCDQuCDQv9GA0LjQvNC10L3Rj9C10YIg0YHQvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQv9C+0LLQtdC00LXQvdC40LUuXHJcbiAgICAgKiDQlNC70Y8g0L7QsdC10YHQv9C10YfQtdC90LjRjyDQstGA0LDRidC10L3QuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gICAgICogQG1ldGhvZCBfb2JyNFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgg0LTQtdC70YzRgtCwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29icjQoeCwgeSl7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uIC09IHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uIC09IHk7XHJcbiAgICAgICAgdGhpcy5zdGFiaWxpemF0aW9uRWxlbWVudHMoKTtcclxuICAgIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IHsgQ2lyY3VsYXJMaXN0IH07IiwiLyoqXHJcbiAqXHJcbiAqL1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9tb2RlbDogbnVsbCwvL9C80L7QtNC10LvRjCDQttC40LLQvtGC0L3QvtCz0L5cclxuXHJcbiAgICAgICAgX21heEJpYXNUb3VjaDogMTUsLy/QvNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0YHQvNC10YnQtdC90LjQtSDRgtCw0YfQsCDQtNC70Y8g0L7RgtC60YDRi9GC0LjRjyDQvNC10L3RjiAocHgpXHJcbiAgICAgICAgX3BvaW50VG91Y2hGb3JNZW51OiBjYy52MiwvL9GC0L7Rh9C60LAg0YHRgtCw0YDRgtCwINGC0LDRh9CwINC/0L4g0LbQuNCy0L7RgtC90L7QvNGDXHJcblxyXG4gICAgICAgIF9pc01vdmU6IGZhbHNlLC8v0YTQu9Cw0LMg0LTQu9GPINC+0L/RgNC10LTQtdC70LXQvdC40Y8g0LTQstC40LbQtdGC0YHRjyDQu9C4INC20LjQstC+0L3QvtC1INC30LAg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LxcclxuICAgICAgICBfaXNPcGVuTWVudTogZmFsc2UsLy/RhNC70LDQsyDQtNC70Y8g0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQvtGC0LrRgNGL0YLQviDQu9C4INC80LXQvdGOXHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIHRoaXMuX2lzT3Blbk1lbnUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmVBbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoU3RhcnRBbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZEFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNGB0YLRgNCw0LjQstCw0LXRgiDQtNC+0YHRgtGD0L/QvdGL0LUg0LTQtdC50YHRgtCy0LjRjyDQv9C70Y7RiNC60Lgg0LTQu9GPINC20LjQstC+0YLQvdC+0LPQviDQuCDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutC4XHJcbiAgICAgKi9cclxuICAgIHNldHRpbmdzKG1vZGVsKXtcclxuICAgICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQvdCw0YfQsNC70LAg0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hTdGFydEFuaW1hbChldmVudCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3N0YXJ0TW90aW9uQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIHN0YXJ0TW90aW9uOiBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0aGlzLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7Ly/RgNCw0LfQvtGB0LvQsNC70Lgg0LXQstC10L3RglxyXG4gICAgICAgIHRoaXMuX2lzTW92ZSA9IGZhbHNlOy8v0LbQuNCy0L7RgtC90L7QtSDQvdC1INC00LLQuNC20LXRgtGB0Y8g0LfQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvFxyXG4gICAgICAgIHRoaXMuX3BvaW50VG91Y2hGb3JNZW51ID0gZXZlbnQuZ2V0TG9jYXRpb24oKTsvL9GB0YfQuNGC0LDQu9C4INGC0L7Rh9C60YMg0L/QtdGA0LLQvtCz0L4g0L3QsNC20LDRgtC40Y9cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQtNCy0LjQttC10L3QuNGPINGC0LDRh9CwLlxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaE1vdmVBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIC8vICAgY2MubG9nKGV2ZW50KTtcclxuICAgICAgICB2YXIgZGVsdGEgPSBldmVudC50b3VjaC5nZXREZWx0YSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0NoZWNrT25PcGVuTWVudShldmVudC5nZXRMb2NhdGlvbigpKSAmJiAhdGhpcy5faXNPcGVuTWVudSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc01vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnbW90aW9uQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICAgICAgZGVsdGFNb3Rpb246IGRlbHRhLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Y8g0LfQsNCy0LXRgNGI0LXQvdC40Y8g0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hFbmRBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIC8vIGNjLmxvZyhldmVudCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzTW92ZSkge1xyXG4gICAgICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnZW5kTW90aW9uQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRFbmQ6IGV2ZW50LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9pc01vdmUgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWZvY3VzTWVudSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0L7RgtC60YDRi9Cy0LDQtdGC0YHRjyDQvNC10L3RjiDQuNC70Lgg0L3QtdGCLiDQn9GD0YLQtdC8INGB0LrQsNC90LjRgNC+0LLQsNC90LjRjyDRgtC+0YfQutC4INGC0LDRh9CwINC90LAg0LLRi9GF0L7QtNC30LAg0L/RgNC10LTQtdC70Ysg0L7RgiDQvdCw0YfQsNC/0LvRjNC90L7QuSDRgtC+0YfQutC4XHJcbiAgICAgKiBAcGFyYW0gcG9pbnRcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaXNDaGVja09uT3Blbk1lbnUocG9pbnQpe1xyXG4gICAgICAgIGxldCBYID0gTWF0aC5hYnModGhpcy5fcG9pbnRUb3VjaEZvck1lbnUueCAtIHBvaW50LngpID4gdGhpcy5fbWF4Qmlhc1RvdWNoO1xyXG4gICAgICAgIGxldCBZID0gTWF0aC5hYnModGhpcy5fcG9pbnRUb3VjaEZvck1lbnUueSAtIHBvaW50LnkpID4gdGhpcy5fbWF4Qmlhc1RvdWNoO1xyXG4gICAgICAgIHJldHVybiBYIHx8IFk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQt9C80LXQvdGP0LXRgiDRgdC+0YHRgtC+0Y/QvdC40LUg0LzQtdC90Y5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9yZWZvY3VzTWVudSgpe1xyXG4gICAgICAgIHRoaXMuX2lzT3Blbk1lbnUgPSAhdGhpcy5faXNPcGVuTWVudTtcclxuICAgICAgICAodGhpcy5faXNPcGVuTWVudSkgPyB0aGlzLl9wdWJsaXNoT3Blbk1lbnVBbmltYWwoKSA6IHRoaXMuX3B1Ymxpc2hDbG9zZU1lbnVBbmltYWwoKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC60YDRi9GC0LjQtSDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAqL1xyXG4gICAgX3B1Ymxpc2hPcGVuTWVudUFuaW1hbCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdvcGVuTWVudUFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0aGlzLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC60YDRi9GC0L4g0LzQtdC90Y4g0YEg0LbQuNCy0L7RgtC90YvQvNC4XHJcbiAgICAgKi9cclxuICAgIF9wdWJsaXNoQ2xvc2VNZW51QW5pbWFsKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Nsb3NlTWVudUFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0aGlzLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC60YDRi9GC0LjQtSDQvNC10L3RjlxyXG4gICAgICovXHJcbiAgICBvcGVuTWVudSgpe1xyXG4gICAgICAgIHRoaXMuX2lzT3Blbk1lbnUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3B1Ymxpc2hPcGVuTWVudUFuaW1hbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCX0LDQutGA0YvRgtGMINC80LXQvdGOXHJcbiAgICAgKi9cclxuICAgIGNsb3NlTWVudSgpe1xyXG4gICAgICAgIHRoaXMuX2lzT3Blbk1lbnUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9wdWJsaXNoQ2xvc2VNZW51QW5pbWFsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC+0LHRidCw0LXRgiDQvNC+0LTQtdC70Lgg0LTQviDQutCw0LrQvtC5INGC0L7Rh9C60Lgg0L3QsNC00L4g0LTQvtC50YLQuFxyXG4gICAgICogQHBhcmFtIHBvaW50XHJcbiAgICAgKi9cclxuICAgIG1vdmVUb1BvaW50KHBvaW50KXtcclxuICAgICAgICB0aGlzLl9tb2RlbC5tb3ZlVG9Qb2ludChwb2ludCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC00LDRgtGMINC30LLRg9C6XHJcbiAgICAgKi9cclxuICAgIHJ1blZvaWNlKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LXRgdGC0YxcclxuICAgICAqL1xyXG4gICAgcnVuU2l0KCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0YHQv9GD0LPQsNGC0YzRgdGPXHJcbiAgICAgKi9cclxuICAgIHJ1bkZyaWdodGVuKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7QutCw0LfQsNGC0Ywg0LDRgNC10LDQu9GLXHJcbiAgICAgKi9cclxuICAgIHJ1bkFyZWFsKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7Qu9Cw0YHQutCw0YLRjNGB0Y9cclxuICAgICAqL1xyXG4gICAgcnVuQ2FyZSgpe1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQm9C10YfRjFxyXG4gICAgICovXHJcbiAgICBydW5MaWUoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC40LPQvtGC0L7QstC40YLRjNGB0Y9cclxuICAgICAqL1xyXG4gICAgcnVuQXR0ZW50aW9uKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC80LDRgdGB0LjQsiDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQuiDRgyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAqIEByZXR1cm4geyp8YW55fVxyXG4gICAgICovXHJcbiAgICBnZXRDaGFyYWN0ZXJpc3RpY3MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0Q2hhcmFjdGVyaXN0aWNzKCk7XHJcbiAgICB9XHJcblxyXG59KTsiLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjRjyDQvdCwINC90LDQttCw0YLQuNC1INC/0L4g0LfQstC10YDRjtGI0LrQtSDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0LfQstC10YDRjtGI0LrQuFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hTdGFydChldmVudCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3N0YXJ0RHJhZ0FuZERyb3BBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgYW5pbWFsOiB0aGlzLm5vZGUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNGPINC90LDQtNCy0LjQttC10L3QuNC1INC30LDQttCw0YLQvtC5INC30LLQtdGA0Y7RiNC60Lgg0L/QvtGB0LvQtSDRgdC+0LfQtNCw0L3QuNGPINC30LLQtdGA0LHRiNC60LhcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoTW92ZShldmVudCl7XHJcbiAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQudG91Y2guZ2V0RGVsdGEoKTtcclxuICAgICAgICB0aGlzLm5vZGUueCArPSBkZWx0YS54O1xyXG4gICAgICAgIHRoaXMubm9kZS55ICs9IGRlbHRhLnk7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2RyYWdBbmREcm9wQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIHBvaW50OiB7eDogdGhpcy5ub2RlLngsIHk6IHRoaXMubm9kZS55fSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40LUg0L3QsCDQt9Cw0LLQtdGA0YjQtdC90LjQtSDQvdCw0LbQsNGC0LjRjyDQv9C+INC30LLQtdGA0Y7RiNC60LUg0L/QvtGB0LvQtSDRgdC+0LfQtNCw0L3QuNGPINC30LLQtdGA0Y7RiNC60LhcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoRW5kKGV2ZW50KXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnc3RvcERyYWdBbmREcm9wQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIHBvaW50OiB7eDogdGhpcy5ub2RlLngsIHk6IHRoaXMubm9kZS55fSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG5cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcbn0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBGSVJDb3JwIG9uIDA0LjAzLjIwMTcuXHJcbiAqL1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfZmljdGl0aW91c1BvaW50OiBudWxsLC8v0KLQvtGH0LrQsCDQtNC70Y8g0YTQuNC60YHQsNGG0LjQuCDQtNCy0LjQttC10L3QuNGPINC60LDRgNGC0YsuINCf0L7QvNC+0LPQsNC10YIg0YDQsNC30LvQuNGH0LDRgtGMINGB0L7QsdGL0YLQuNC1INC00LLQuNC20LXQvdC40LUg0L7RgiDQt9Cw0LLQtdGA0YjQtdC90LjRj1xyXG4gICAgICAgIF9pc1RvdWNoU3RhcnQ6IG51bGwsLy/QpNC70LDQsyDQt9Cw0L/Rg9GJ0LXQvSDQu9C4INGC0LDRh1xyXG4gICAgICAgIF9jb250cm9sbGVyU2Nyb2xsTWFwOiBudWxsLFxyXG4gICAgICAgIF9hY3Rpb25Nb3ZlTWFwOiBudWxsLC8v0LTQtdC50YHRgtCy0LjQtSDQtNCy0LjQttC10L3QuNGPINC60LDRgNGC0YtcclxuICAgICAgICBfbWF4U2l6ZU1hcFNjcm9sbDogbnVsbCwvL9GA0LDQt9C80LXRgCBvZmZzZXQg0YHQutGA0L7Qu9C70LAuINC/0L7QvNC+0LbQtdGCINC/0YDQuCDQv9C10YDQtdC80LXRidC10L3QuNC4INC60LDQvNC10YDRiyDQvtGCINC30LLQtdGA0Y7RiNC60Lgg0Log0LfQstC10YDRjtGI0LrQtVxyXG5cclxuICAgICAgICBtYXhCaWFzVG91Y2g6IDE1LC8v0LzQsNC60YHQuNC80LDQu9GM0L3QvtC1INGB0LzQtdGJ0LXQvdC40LUg0YLQsNGH0LAg0LTQu9GPINC+0L/RgNC10LTQtdC70LXQvdC40Y8g0YfRgtC+INC60LDRgNGC0LAg0LTQstC40LbQtdGC0YHRj1xyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25Ub3VjaE1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLl9pc1RvdWNoU3RhcnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyU2Nyb2xsTWFwID0gdGhpcy5ub2RlLnBhcmVudC5wYXJlbnQuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpO1xyXG4gICAgICAgIHRoaXMuX2ZpY3RpdGlvdXNQb2ludCA9IGNjLnYyKDAsIDApO1xyXG4gICAgICAgIHRoaXMuX21heFNpemVNYXBTY3JvbGwgPSB0aGlzLl9jb250cm9sbGVyU2Nyb2xsTWFwLmdldE1heFNjcm9sbE9mZnNldCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC/0L7RgNCw0LbQtNCw0Y7RidC40LXRgdGPINGB0LrRgNC+0LvQvtC8XHJcbiAgICAgKiBAcGFyYW0gZXZlbnQg0YHQvtCx0YvRgtC40LUg0LrQvtGC0L7RgNC+0LUg0LvQvtCy0LjRgiDRgdC60YDQvtC7XHJcbiAgICAgKi9cclxuICAgIG9uRXZlbnRTY3JvbGwoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcG9pbnQgPSBldmVudC5nZXRTY3JvbGxPZmZzZXQoKTtcclxuICAgICAgICBsZXQgbG9nUmV6ID0gcG9pbnQueCA9PT0gdGhpcy5fZmljdGl0aW91c1BvaW50LnggJiYgcG9pbnQueSA9PT0gdGhpcy5fZmljdGl0aW91c1BvaW50Lnk7XHJcbiAgICAgICAgKGxvZ1JleiAmJiB0aGlzLl9pc1RvdWNoU3RhcnQpID8gdGhpcy5vblRvdWNoRW5kKGV2ZW50KSA6IHRoaXMuX2ZpY3RpdGlvdXNQb2ludCA9IHBvaW50O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsCDQv9GA0LjQutC+0YHQvdC+0LLQtdC90LjQtSDQuiDQutCw0YDRgtC1XHJcbiAgICAgKiBAcGFyYW0gZXZlbnQg0YHQvtCx0YvRgtC40LUg0LrQvtGC0L7RgNC+0LUg0L/QvtC50LzQsNC10YIg0Y3RgtC+0YIg0YHQutGA0LjQv9GCXHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hTdGFydChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzVG91Y2hTdGFydCA9IHRydWU7XHJcbiAgICAgICAgLy/Qt9Cw0L/QvtC80L3QuNC80L/QvtC30LjRhtC40Y8g0L3QsNGH0LDQu9CwINGN0LLQtdC90YLQsFxyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCd0b3VjaE9uTWFwJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNGPINC90LAg0LTQstC40LbQtdC90LjQtSB0b3VjaCDQv9C+INC60LDRgNGC0LVcclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtSDQutC+0YLQvtGA0L7QtSDQv9C+0LnQvNCw0LXRgiDRjdGC0L7RgiDRgdC60YDQuNC/0YJcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE1vdmUoZXZlbnQpIHtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgndG91Y2hNb3ZlT25NYXAnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQuNGPINC90LAg0L7RgtC60L/Rg9GB0LrQsNC90LjQtSB0b3VjaCDQvtGCINC60LDRgNGC0YtcclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtSDQutC+0YLQvtGA0L7QtSDQv9C+0LnQvNCw0LXRgiDRgdC60YDQvtC7INC70LjQsdC+INGN0YLQvtGCINGB0LrRgNC40L/RglxyXG4gICAgICovXHJcbiAgICBvblRvdWNoRW5kKGV2ZW50KSB7XHJcbiAgLy8gICAgICBjYy5sb2coZXZlbnQpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pc1RvdWNoU3RhcnQpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNUb3VjaFN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCd0b3VjaEVuZE1vdmVPbk1hcCcsIHRydWUpO1xyXG4gICAgICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgLy8gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC90LLQtdC90YLQuNGA0YPQtdGCINGC0L7Rh9C60YMg0L7QutC90LAg0LIg0YLQvtGH0LrRgyDQutCw0YDRgtGLXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0YLQvtGH0LrQsCDQsiDQvtC60L3QtVxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9INGC0L7Rh9C60LAg0L3QsCDQutCw0YDRgtC1XHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50TWFwKHBvaW50KSB7XHJcbiAgICAgICAgbGV0IG5ld1ggPSBwb2ludC54IC0gdGhpcy5ub2RlLng7XHJcbiAgICAgICAgbGV0IG5ld1kgPSBwb2ludC55IC0gdGhpcy5ub2RlLnk7XHJcbiAgICAgICAgcmV0dXJuIGNjLnYyKG5ld1gsIG5ld1kpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0L7QvdCy0LXRgNGC0LjRgNGD0LXRgiDRgtC+0YfQutGDINCyINC60L7QvtGA0LTQuNC90LDRgtGLINC+0LrQvdCwXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0YLQvtGH0LrQsCDQvdCwINC60LDRgNGC0LVcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfSDRgtC+0YfQutCwINCyINC+0LrQvdC1XHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50V2luZG93KHBvaW50KSB7XHJcbiAgICAgICAgbGV0IG5ld1ggPSBwb2ludC54ICsgdGhpcy5ub2RlLng7XHJcbiAgICAgICAgbGV0IG5ld1kgPSBwb2ludC55ICsgdGhpcy5ub2RlLnk7XHJcbiAgICAgICAgcmV0dXJuIGNjLnYyKG5ld1gsIG5ld1kpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINGC0L7Rh9C60YMg0LrQsNGA0YLRiyDQuNC3INGB0LjRgdGC0LXQvNGLINC60L7QvtGA0LTQuNC90LDRgiDRgdC60YDQvtC70LvQsFxyXG4gICAgICogQHBhcmFtIHBvaW50INC40YHRhdC+0LTQvdCw0Y8g0YLQvtGH0LrQsFxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9XHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50TWFwT2ZPZmZzZXQocG9pbnQpe1xyXG4gICAgICAgIGxldCBuZXdZID0gdGhpcy5fbWF4U2l6ZU1hcFNjcm9sbC55IC0gcG9pbnQueTtcclxuICAgICAgICByZXR1cm4gY2MudjIocG9pbnQueCwgbmV3WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdCy0LXRgNGC0LjRgNGD0LXRgiDRgtC+0YfQutGDXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0LjRgdGF0L7QtNC90LDRjyDRgtC+0YfQutCwXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn1cclxuICAgICAqL1xyXG4gICAgZ2V0SW52ZXJ0UG9pbnQocG9pbnQpe1xyXG4gICAgICAgIGxldCBuZXdYID0gLXBvaW50Lng7XHJcbiAgICAgICAgbGV0IG5ld1kgPSAtcG9pbnQueTtcclxuICAgICAgICByZXR1cm4gY2MudjIobmV3WCwgbmV3WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQstC40LbQtdC90LjQtSDQutCw0LzQtdGA0Ysg0LLQvdC10LrQvtGC0L7RgNGD0Y4g0YLQvtGH0LrRgyDQvdCwINC+0YHQvdC+0LLQtSDQvNC10YLQvtC00LAg0LTQstC40LbQtdC90LjRjyDRgdC60YDQvtC70LvQsC4g0KEg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LXQvCDQtdCz0L4g0YHQuNGB0YLQtdC80Ysg0LrQvtC+0YDQtNC40L3QsNGCXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0YLQvtGH0LrQsCDQsiDQutC+0YLQvtGA0YPRjiDQvdC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC50YLQuFxyXG4gICAgICogQHBhcmFtIHRpbWUg0LLRgNC10LzRjyDQt9CwINC60YLQvtGA0L7QtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0L/QtdGA0LXRhdC+0LRcclxuICAgICAqL1xyXG4gICAgbW92ZShwb2ludCwgdGltZSA9IDApe1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJTY3JvbGxNYXAuc2Nyb2xsVG9PZmZzZXQodGhpcy5nZXRQb2ludE1hcE9mT2Zmc2V0KHBvaW50KSwgdGltZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQstC40LbQtdC90LjQtSDQutCw0YDRgtGLINCyINC90LXQutC+0YLQvtGA0YPRjiDRgtC+0YfQutGDINC90LAg0L7RgdC90L7QstC1IGFjdGlvbnNcclxuICAgICAqIEBwYXJhbSBwb2ludFxyXG4gICAgICogQHBhcmFtIHRpbWVcclxuICAgICAqL1xyXG4gICAgbW92ZUFjdGlvbnMocG9pbnQsIHRpbWUgPSAwKXtcclxuICAgICAgICB0aGlzLm5vZGUuc3RvcEFjdGlvbih0aGlzLl9hY3Rpb25Nb3ZlTWFwKTtcclxuICAgICAgICB0aGlzLl9hY3Rpb25Nb3ZlTWFwID0gY2MubW92ZVRvKHRpbWUsIHRoaXMuZ2V0SW52ZXJ0UG9pbnQocG9pbnQpKTtcclxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKFxyXG4gICAgICAgICAgICBjYy5zZXF1ZW5jZSh0aGlzLl9hY3Rpb25Nb3ZlTWFwLCBjYy5jYWxsRnVuYyh0aGlzLl9wdWJsaXNoRmluaXNoTW92ZUNlbnRyZVRvQW5pbWFsLCB0aGlzKSlcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQtNCy0LjQttC10L3QuNGPINC60LDQvNC10YDRiyDQtNC+INC20LjQstC+0YLQvdC+0LPQviDQuCDRhNC40LrRgdC40YDQvtCy0LDQvdC40LUg0LXQs9C+INC/0L4g0YbQtdC90YLRgNGDINGN0LrRgNCw0L3QsFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3B1Ymxpc2hGaW5pc2hNb3ZlQ2VudHJlVG9BbmltYWwoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnZmluaXNoTW92ZUNhbWVyYVRvQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG5cclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEZJUkNvcnAgb24gMzEuMDMuMjAxNy5cclxuICovXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hTdGFydChldmVudCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE1vdmUoZXZlbnQpe1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmQoZXZlbnQpe1xyXG5cclxuICAgIH0sXHJcbn0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBGSVJDb3JwIG9uIDE2LjA0LjIwMTcuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCa0L7QvdGC0YDQvtC70LvQtdGAINGB0LrRgNC+0LvQu9CwINGF0LDRgNCw0LrRgtC40YDQuNGB0YLQuNC6LiDQn9GA0L7QuNC30LLQvtC00LjRgiDRgNC10LPRg9C70LjRgNC+0LLQutGDINGN0LvQtdC80LXQvdGC0L7QsiDQsdC+0LrRgdCwINGF0LDRgNCw0YLQtdGA0LjRgdGC0LjQui4g0JLRi9C/0L7Qu9C90Y/QtdGCINC+0L/QtdGA0LDRhtC40Lgg0YHQstGP0LfQsNC90L3Ri9C1INGBINGA0LXQs9GD0LvQuNGA0L7QstC60L7QuSDQvdC+0LTQvtCyINC00LvRjyDQvtCx0LXRgdC/0LXRh9C10L3QuNGPINC40LvQu9GO0LfQuNC4INCy0YDQsNGJ0LXQvdC40Y8g0LHQsNGA0LDQsdCw0L3QsCDQutGD0LTQsCDQvdCw0LrRgNGD0YfQuNCy0LDQtdGC0YHRjy/QvtGC0LrRg9C00LAg0YHQutGA0YPRh9C40LLQsNC10YLRgdGPINGB0L/QuNGB0L7QuiDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQui5cclxuICogQGNsYXNzIENoYXJhY3RlcmlzdGljc1Njcm9sbEJveENvbnRyb2xsZXJcclxuICovXHJcbnZhciBDaGFyYWN0ZXJpc3RpY3NTY3JvbGxCb3hDb250cm9sbGVyID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBub2RlQ29pbDogY2MuTm9kZSwvL9C90L7QtCDQv9Cw0LvQutC4XHJcbiAgICAgICAgbm9kZVJvbGw6IGNjLk5vZGUsLy/QvdC+0LQg0LHQu9C10YHQutCwXHJcbiAgICAgICAgbm9kZUNvbnRlbnQ6IGNjLk5vZGUsLy8g0L3QvtC0INC60L7QvdGC0LXQvdGC0LBcclxuICAgICAgICBib3R0b21Qb2ludFN0YXJ0Um90YXRpb246IDI4MSwvL9C90LjQttC90Y/RjyDQutC+0YDQtNC40L3QsCDRgdGC0LDRgNGC0LAg0L/QvtCy0L7RgNC+0YLQsFxyXG4gICAgICAgIHRvcFBvaW50U3RhcnRSb3RhdGlvbjogMzYxLC8v0LLQtdGA0YXQvdGP0Y8g0LrQvtGA0LTQuNC90LAg0YHRgtCw0YDRgtCwINC/0L7QstC+0YDQvtGC0LBcclxuICAgICAgICBfaW50ZXJ2YWw6IDAsLy/QtNC70LjQvdC90LAg0L/RgNC+0LzQtdC20YPRgtC60LAg0LTQu9GPINGB0LbQuNGC0LjRjyDQv9Cw0YDQtdC80LXQvdC90YvRhVxyXG4gICAgICAgIF9zdGFydFBvc0NvbnRlbnQ6IG51bGwsLy/RgdGC0LDRgNGC0L7QstCw0Y8g0L/QvtC30LjRhtC40Y8g0LrQvtC90YLQtdC90YLQsCDQsdC+0LrRgdCwISFcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDQvdCwINC30LDQs9GA0YPQt9C60YMg0YHRhtC10L3Riy5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC/0L4g0LfQsNC/0YPRgdC60YMg0Y3Qu9C10LzQtdC90YLQsFxyXG4gICAgICogQG1ldGhvZCBzdGFydFxyXG4gICAgICovXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIGxldCBsYSA9IHRoaXMubm9kZUNvbnRlbnQuZ2V0Q29tcG9uZW50KGNjLkxheW91dCk7XHJcbiAgICAgICAgdGhpcy5fc3RlcCA9IGxhLnNwYWNpbmdZO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zQ29udGVudCA9IHRoaXMubm9kZUNvbnRlbnQueTtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHRoaXMudG9wUG9pbnRTdGFydFJvdGF0aW9uIC0gdGhpcy5ib3R0b21Qb2ludFN0YXJ0Um90YXRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0YHRgtCw0YDRgtCwINGC0LDRh9CwXHJcbiAgICAgKiBAbWV0aG9kIF9vblRvdWNoU3RhcnRcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hTdGFydChldmVudCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCV0LLQtdC90YIg0LTQstC40LbQtdC90LjRjyDRgdC60YDQvtC70LvQsC4g0J7QsdGA0LDQsdCw0YLRi9Cy0LDQtdGCINCy0YDQsNGJ0LXQvdC40Lgg0LHQvtC60YHQsCDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQui7Qn9GA0L7QuNC30LLQvtC00LjRgiDRgdC20LDRgtC40LUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0L3QsCDQuNC90YLQtdGA0LLQsNC70LVcclxuICAgICAqIEBtZXRob2Qgb25Nb3ZlU2Nyb2xsXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Nb3ZlU2Nyb2xsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRQb2ludENvbnRlbnQgPSBldmVudC5nZXRDb250ZW50UG9zaXRpb24oKTtcclxuICAgICAgICBsZXQgYmFpcyA9IE1hdGguYWJzKGN1cnJlbnRQb2ludENvbnRlbnQueSAtIHRoaXMuX3N0YXJ0UG9zQ29udGVudCk7XHJcbiAgICAgICAgbGV0IHZyID0gMDtcclxuICAgICAgICBpZiAoY3VycmVudFBvaW50Q29udGVudC55ID4gdGhpcy5fc3RhcnRQb3NDb250ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZUNvbnRlbnQuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRQb2ludEl0ZW0gPSB0aGlzLl9zdGFydFBvc0NvbnRlbnQgLSB2ciArIGJhaXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBvaW50SXRlbSA+IHRoaXMuYm90dG9tUG9pbnRTdGFydFJvdGF0aW9uICYmIGN1cnJlbnRQb2ludEl0ZW0gPCB0aGlzLnRvcFBvaW50U3RhcnRSb3RhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2NhbGVZID0gdGhpcy5fZ2V0U2NhbGVJdGVtKGN1cnJlbnRQb2ludEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnNjYWxlWSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2ciArPSB0aGlzLl9zdGVwICsgaXRlbS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiDQutC+0Y3RhNGE0LjRhtC10L3RgiDRgdC20LDRgtC40Y8uINCa0L7RgtC+0YDRi9C5INGA0LDRgdGH0LjRgtGL0LLQsNC10YLRgdGPINC90LAg0L7RgdC90L7QstC1INC/0YDQvtC80LXQttGD0YLQutCwINC4INGC0LXQutGD0YnQtdCz0L4g0L/QvtC70L7QttC10L3QuNGPINCyINGN0YLQvtC8INC/0YDQvtC80LXQttGD0YLQutC1LlxyXG4gICAgICogQG1ldGhvZCBfZ2V0U2NhbGVJdGVtXHJcbiAgICAgKiBAcGFyYW0gY3VycmVudFBvaW50INGC0LXQutGD0YnQtdC1INC/0L7Qu9C+0LbQtdC90LjQtSDQv9Cw0YDQsNC80LXRgtGA0LAg0L/QviDQvtGB0Lgg0L7RgNC00LjQvdCw0YJcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9INC60L7RjdGE0YTQuNGG0LXQvdGCINGB0LbQsNGC0LjRjyDQtNC70Y8g0L/QsNGA0LDQvNC10YLRgNCwXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZ2V0U2NhbGVJdGVtKGN1cnJlbnRQb2ludCl7XHJcbiAgICAgICAgbGV0IGsgPSAxIC0gKCgxMDAgKiAoY3VycmVudFBvaW50IC0gdGhpcy5ib3R0b21Qb2ludFN0YXJ0Um90YXRpb24pKSAvIHRoaXMuX2ludGVydmFsKSAvIDEwMDtcclxuICAgICAgICByZXR1cm4gKGsgPiAxIHx8IGsgPCAwKSA/IDEgOiBrO1xyXG4gICAgfSxcclxuXHJcbn0pOyIsInZhciBGYWN0b3J5QW5pbWFsUHJlZmFiID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfdGFyZ2V0QW5pbWFsOiBjYy5Ob2RlLFxyXG4gICAgICAgIHdheVRvUHJlZmFiOidwcmVmYWJzL2FuaW1hbC9MaW9uU2hlYXRoJyxcclxuICAgICAgICB3YXlUb01vZGVsOiAnLi9tb2RlbCcsLy/Qn9GD0YLRjCDQtNC+INC80L7QtNC10LvQuFxyXG4gICAgICAgIG5hbWVBbmltYWw6ICdhbmltYWwnLC8v0JjQvNGPINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdGCINC20LjQstC+0YLQvdC+0LVcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUFuaW1hbChldmVudCkge1xyXG4gICAgICAvLyAgY2MubG9nKGV2ZW50KTtcclxuICAgICAgIC8vIGxldCBwb2ludFRvdWNoID0gZXZlbnQuZ2V0U3RhcnRMb2NhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuX2NyZWF0ZVByZWZhYigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdGCINC/0YDQtdGE0LDQsSDQsiDQvdGD0LbQvdC+0Lwg0LrQvtC90YLQtdC90YLQtVxyXG4gICAgICogQHNlZSB7c3RyaW5nfSB3YXlUb1ByZWZhYiDQv9GD0YLRjCDQtNC+INC/0YDQtdGE0LDQsdCwXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVQcmVmYWIoKSB7XHJcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModGhpcy53YXlUb1ByZWZhYiwgKGVyciwgcHJlZmFiKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnY3JlYXRlQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICAgICAgYW5pbWFsOiB0aGlzLl9zZXR0aW5nc0FuaW1hbCh0aGlzLl90YXJnZXRBbmltYWwpLFxyXG4gICAgICAgICAgICAgICAgcHV0aFRvTW9kZWw6dGhpcy5wdXRoVG9Nb2RlbCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBub2RlQW5pbWFsXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXR0aW5nc0FuaW1hbChub2RlQW5pbWFsKXtcclxuICAgICAgICBub2RlQW5pbWFsLm5hbWU9dGhpcy5uYW1lQW5pbWFsO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9kZUFuaW1hbDtcclxuICAgIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IHsgRmFjdG9yeUFuaW1hbFByZWZhYn07IiwiaW1wb3J0IHsgQ2lyY3VsYXJMaXN0IH0gZnJvbSAnLi9jaXJjdWxhci1saXN0JztcclxuXHJcbi8qKlxyXG4gKiDQm9C40YHRgiDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAqIEBjbGFzcyBMaXN0XHJcbiAqL1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIG1hbmFnZXI6IENpcmN1bGFyTGlzdCwvL9GB0YHRi9C70LrQsCDQvdCwINGP0LTRgNC+INCy0YDQsNGJ0LXQvdC40Y9cclxuICAgICAgICBuYW1lRXZlbnQ6ICd2b2ljZUFuaW1hbCcsLy/QuNC80Y8g0YHQvtCx0YvRgtC40Y8g0LrQvtGC0L7RgNC+0LUg0LLRi9C30YvQstCw0LXRgiDRjdGC0LAg0LrQvdC+0L/QutCwXHJcbiAgICAgICAgbWF4Qmlhc1RvdWNoOiAxNSwvL9C80LDQutGB0LjQvNCw0LvRjNC90L7QtSDRgdC80LXRidC10L3QuNC1INGC0LDRh9CwINC00LvRjyDQvdCw0LbQsNGC0LjRjyDQv9C+INGN0LvQtdC80LXQvdGC0YMg0LzQtdC90Y4gKHB4KVxyXG4gICAgICAgIF9wb2ludFRvdWNoRm9yTWVudTogY2MudjIsLy/RgtC+0YfQutCwINGB0YLQsNGA0YLQsCDRgtCw0YfQsCDQv9C+INC/0YPQvdC60YLRgyDQvNC10L3RjlxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC70LjRgdGC0LAg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICogQG1ldGhvZCBvbkxvYWRcclxuICAgICAqL1xyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INGB0YLQsNGA0YLQsCDQvdCw0LbQsNGC0LjRjyDQvdCwINC70LjRgdGCLlxyXG4gICAgICogQG1ldGhvZCBfb25Ub3VjaFN0YXJ0XHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudCDQvtCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaFN0YXJ0KGV2ZW50KXtcclxuICAgICAgICB0aGlzLl9wb2ludFRvdWNoRm9yTWVudSA9IGV2ZW50LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0L7RgtC/0YPRgdC60LDQvdC40Y8g0YLQsNGH0LAg0L7RgiDQu9C40YHRgtCwLlxyXG4gICAgICogQG1ldGhvZCBfb25Ub3VjaEVuZFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnQg0L7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hFbmQoZXZlbnQpe1xyXG4gICAgICAgIGxldCBwb2ludCA9IGV2ZW50LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgbGV0IFggPSBNYXRoLmFicyh0aGlzLl9wb2ludFRvdWNoRm9yTWVudS54IC0gcG9pbnQueCkgPCB0aGlzLm1heEJpYXNUb3VjaDtcclxuICAgICAgICBsZXQgWSA9IE1hdGguYWJzKHRoaXMuX3BvaW50VG91Y2hGb3JNZW51LnkgLSBwb2ludC55KSA8IHRoaXMubWF4Qmlhc1RvdWNoO1xyXG4gICAgICAgIGlmIChYICYmIFkpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHVibGlzaEV2ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDRgdCy0LfQsNC90L3QvtC1INGBINGN0YLQuNC8INC70LjRgdGC0L7QvC5cclxuICAgICAqIEBtZXRob2QgX3B1Ymxpc2hFdmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3B1Ymxpc2hFdmVudCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKHRoaXMubmFtZUV2ZW50LCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgYW5pbWFsOiB0aGlzLm1hbmFnZXIucGFyZW50LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0LTQstC40LbQtdC90LjRjyDRgtCw0YfQsC5cclxuICAgICAqIEBtZXRob2QgX29uVG91Y2hNb3ZlXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudCDQvtCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y8uXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaE1vdmUoZXZlbnQpIHtcclxuICAgICAgICBsZXQgcG9pbnQgPSBldmVudC50b3VjaC5nZXRQcmV2aW91c0xvY2F0aW9uKCk7XHJcbiAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQudG91Y2guZ2V0RGVsdGEoKTtcclxuICAgICAgICB0aGlzLm1hbmFnZXIuZGlyZWN0aW9uUm90YXRpb24oZGVsdGEueCwgZGVsdGEueSwgcG9pbnQueCwgcG9pbnQueSk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG59KTsiLCJpbXBvcnQgeyBBUElDb3JlIH1mcm9tICcuLi8uLi9idWlsZC9idWlsZC10cyc7XHJcblxyXG4vKipcclxuICog0KHQvtGB0YLQvtGP0L3QuNC1INC40LPRgNGLLlxyXG4gKiBAdHlwZSB7U3RhdEdhbWV9XHJcbiAqIEBzdGF0aWNcclxuICogQGVsZW1lbnQge251bWJlcn0gc2xlZXAg0LHQtdC30LTQtdC50YHRgtCy0LjQtS5cclxuICogQGVsZW1lbnQge251bWJlcn0gb3Blbk1lbnUg0L7RgtC60YDRi9GC0LjQtSDQvNC10L3RjiDQuNCz0YDRiy5cclxuICogQGVsZW1lbnQge251bWJlcn0gb3Blbk1lbnVBbmltYWwg0L7RgtC60YDRi9GC0LjQtSDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IGNyZWF0ZUFuaW1hbCDRgdC+0LfQtNCw0L3QuNC1INC20LjQstC+0YLQvdC+0LPQvi5cclxuICogQGVsZW1lbnQge251bWJlcn0gbW92ZU1hcCDQtNCy0LjQttC10L3QuNC1INC60LDRgNGC0Ysg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwuXHJcbiAqL1xyXG5jb25zdCBTdGF0R2FtZSA9IHtcclxuICAgIHNsZWVwOiAwLFxyXG4gICAgb3Blbk1lbnU6IDEsXHJcbiAgICBvcGVuTWVudUFuaW1hbDogMixcclxuICAgIGNyZWF0ZUFuaW1hbDogMyxcclxuICAgIG1vdmVNYXA6IDQsXHJcbn07XHJcblxyXG4vKipcclxuICog0KPQv9GA0LDQstC70Y/QtdGCINC/0YDQtdC00YHRgtCw0LLQu9C90LjQtdC8LlxyXG4gKiBAY2xhc3MgUGxheVxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBub2RlV2luZG93OiBjYy5Ob2RlLC8v0L7QutC90L4g0LjQs9GA0YtcclxuICAgICAgICBub2RlQm94Q3JlYXRlQW5pbWFsOiBjYy5Ob2RlLC8v0LLRgdC/0LvRi9Cy0LDRjtGJ0LjQuSDQsdC+0LrRgSDRgSDQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAgICBub2RlQm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsOiBjYy5Ob2RlLC8v0LLRgdC/0LvRi9Cy0LDRjtGJ0LjQuSDQsdC+0LrRgSDRgSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutCw0LzQuCDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICBub2RlQmFza2V0OiBjYy5Ob2RlLC8v0LrQvtGA0LfQuNC90LAg0LTQu9GPINGD0LTQsNC70LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgbm9kZUZpZWxkQW5pbWFsczogY2MuTm9kZSwvL9C/0L7Qu9C1INC20LjQt9C90LXQtNC10Y/RgtC10LvRjNC90L7RgdGC0Lgg0LbQuNCy0L7RgtC90YvRhVxyXG4gICAgICAgIG5vZGVCb3hNYXA6IGNjLk5vZGUsLy/QsdC+0LrRgSDRgSDQutCw0YDRgtC+0LlcclxuICAgICAgICBub2RlTWFwOiBjYy5Ob2RlLC8v0L/QvtC70LUg0LrQsNGA0YLRi1xyXG4gICAgICAgIG5vZGVNZW51OiBjYy5Ob2RlLC8v0L/QvtC70LUg0LzQtdC90Y4g0LjQs9GA0YtcclxuICAgICAgICBub2RlTWVudUFuaW1hbDogY2MuTm9kZSwvL9C90L7QtCDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICBub2RlTWFza0NyZWF0ZWRBbmltYWw6IGNjLk5vZGUsLy/QvNCw0YHQutCwINC00LvRjyDRgdC+0LfQtNCw0L3QuNGPINC20LjQstC+0YLQvdGL0YVcclxuXHJcbiAgICAgICAgcHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3M6IGNjLlByZWZhYiwvL9C/0YDQtdGE0LDQsSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutC4XHJcblxyXG4gICAgICAgIGNvbG9yVGV4dENoYXJhY3RlcmlzdGljczogY2MuQ29sb3IsLy/RhtCy0LXRgiDRgtC10LrRgdGC0LAg0YMg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LpcclxuXHJcbiAgICAgICAgX3RhcmdldEFuaW1hbDogY2MuTm9kZSwvL9C90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICBfcG9pbnRUYXJnZXRBbmltYWw6IGNjLnYyLC8v0YLQvtGH0LrQsCDQvdCw0LfQvdCw0YfQtdC90LjRjyDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICBfdGFyZ2V0Q29udHJvbGxlckFuaW1hbDogY2MuTm9kZSwvL9C60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YLQtVxyXG4gICAgICAgIF9jZW50cmVXaW5kb3dQb2ludDogbnVsbCwvL9GC0L7Rh9C60LAg0YHQtdGA0LXQtNC40L3RiyDRjdC60YDQsNC90LBcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQutC+0L3RgNC+0LvQu9C10YDQsCDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjy5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjcmVhdGVBbmltYWwnLCB0aGlzLm9uQW5pbWFsQ3JlYXRlZC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ29wZW5Cb3hGcm9tQW5pbWFsJywgdGhpcy5vbk9wZW5Cb3hGcm9tQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY2xvc2VCb3hGcm9tQW5pbWFsJywgdGhpcy5vbkNsb3NlQm94RnJvbUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ29wZW5Cb3hNZW51UGxheScsIHRoaXMub25PcGVuQm94TWVudVBsYXkuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjbG9zZUJveE1lbnVQbGF5JywgdGhpcy5vbkNsb3NlQm94TWVudVBsYXkuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbignb3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnLCB0aGlzLm9uT3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjbG9zZUJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnLCB0aGlzLm9uQ2xvc2VCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignc3RhcnREcmFnQW5kRHJvcEFuaW1hbCcsIHRoaXMub25TdGFydERyYWdBbmREcm9wQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignZHJhZ0FuZERyb3BBbmltYWwnLCB0aGlzLm9uRHJhZ0FuZERyb3BBbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdzdG9wRHJhZ0FuZERyb3BBbmltYWwnLCB0aGlzLm9uU3RvcERyYWdBbmREcm9wQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignbW90aW9uQW5pbWFsJywgdGhpcy5vbk1vdGlvbkFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3N0YXJ0TW90aW9uQW5pbWFsJywgdGhpcy5vblN0YXJ0TW90aW9uQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignZW5kTW90aW9uQW5pbWFsJywgdGhpcy5vbkVuZE1vdGlvbkFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ29wZW5NZW51QW5pbWFsJywgdGhpcy5vbk9wZW5NZW51QW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY2xvc2VNZW51QW5pbWFsJywgdGhpcy5vbkNsb3NlTWVudUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd2b2ljZUFuaW1hbCcsIHRoaXMub25Wb2ljZUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3NpdEFuaW1hbCcsIHRoaXMub25TaXRBbmltYWwuYmluZCh0aGlzKSk7Ly/RgdC40LTQtdGC0YxcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2ZyaWdodGVuQW5pbWFsJywgdGhpcy5vbkZyaWdodGVuQW5pbWFsLmJpbmQodGhpcykpOy8v0L3QsNC/0YPQs9Cw0YLRjFxyXG4gICAgICAgIHRoaXMubm9kZS5vbignYXJlYWxBbmltYWwnLCB0aGlzLm9uQXJlYWxBbmltYWwuYmluZCh0aGlzKSk7Ly/Qv9C+0LrQsNC30LDRgtGMINCw0YDQtdCw0LtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2NhcmVBbmltYWwnLCB0aGlzLm9uQ2FyZUFuaW1hbC5iaW5kKHRoaXMpKTsvL9CX0LDQsdC+0YLQsCwg0LPQu9Cw0LTQuNGC0YxcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2xpZUFuaW1hbCcsIHRoaXMub25MaWVBbmltYWwuYmluZCh0aGlzKSk7Ly/Qm9C10LbQsNGC0Yws0LvQtdGH0YxcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2F0dGVudGlvbkFuaW1hbCcsIHRoaXMub25BdHRlbnRpb25BbmltYWwuYmluZCh0aGlzKSk7Ly/QktC90LjQvNCw0L3QuNC1LCDQs9C+0YLQvtCy0YHRjFxyXG5cclxuICAgICAgICB0aGlzLm5vZGUub24oJ2Jhc2tldEFjdGl2ZScsIHRoaXMub25CYXNrZXRBY3RpdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdiYXNrZXRTbGVlcCcsIHRoaXMub25CYXNrZXRTbGVlcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2Jhc2tldFdvcmsnLCB0aGlzLm9uQmFza2V0V29yay5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaE9uTWFwJywgdGhpcy5vblRvdWNoT25NYXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaE1vdmVPbk1hcCcsIHRoaXMub25Ub3VjaE1vdmVPbk1hcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoRW5kTW92ZU9uTWFwJywgdGhpcy5vblRvdWNoRW5kTW92ZU9uTWFwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignZmluaXNoTW92ZUNhbWVyYVRvQW5pbWFsJywgdGhpcy5vbkZpbmlzaE1vdmVDYW1lcmFUb0FuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQtNCw0L3QvdGL0YUuXHJcbiAgICAgKiBAbWV0aG9kIF9pbml0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaW5pdCgpe1xyXG4gICAgICAgIHRoaXMuX2FwaSA9IEFQSUNvcmUuaW5zdGFuY2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUuc2xlZXA7XHJcblxyXG4gICAgICAgIHRoaXMuX3RhcmdldFNpemVXaXRoID0gMDsvL9Cy0YDQtdC80LXQvdC90YvQtSDRgNCw0LfQvNC10YDRiyDRiNC40YDQuNC90Ysg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1LiDQlNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y9cclxuICAgICAgICB0aGlzLl90YXJnZXRTaXplSGVpZ2h0ID0gMDsvL9Cy0YDQtdC80LXQvdC90YvQtSDRgNCw0LfQvNC10YDRiyDQstGL0YHQvtGC0Ysg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1LiDQlNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y9cclxuXHJcbiAgICAgICAgdGhpcy5fcG9pbnRUYXJnZXRBbmltYWwgPSBjYy52MigwLCAwKTsvL9GC0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRglxyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IG51bGw7IC8v0L3QvtC0INC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YLQtVxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwgPSBudWxsOy8v0LrQvtC90YLRgNC+0LvQu9C10YAg0LbQuNCy0L7RgtC90L7Qs9C+ICjRgtC+0LvRjNC60L4gMSDRgtC+0LPQviDRh9GC0L4g0LIg0YLQsNGA0LPQtdGC0LUpXHJcbiAgICAgICAgdGhpcy5fY2VudHJlV2luZG93UG9pbnQgPSBjYy52Mih0aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm5vZGUuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckNpcmN1bGFyTWVudSA9IHRoaXMubm9kZU1lbnVBbmltYWwuZ2V0Q29tcG9uZW50KCdjaXJjdWxhci1saXN0LWFjdGlvbnMtYW5pbWFsJyk7XHJcbiAgICAgICAgdGhpcy5fYm94Q3JlYXRlQW5pbWFsID0gdGhpcy5ub2RlQm94Q3JlYXRlQW5pbWFsLmdldENvbXBvbmVudCgnYm94LWNyZWF0ZS1hbmltYWwnKTtcclxuICAgICAgICB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwgPSB0aGlzLm5vZGVCb3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwuZ2V0Q29tcG9uZW50KCdib3gtY2hhcmFjdGVyaXN0aWNzLWFuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQgPSB0aGlzLm5vZGVCYXNrZXQuZ2V0Q29tcG9uZW50KCdiYXNrZXQtYW5pbWFsJyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hcCA9IHRoaXMubm9kZU1hcC5nZXRDb21wb25lbnQoJ2NvbnRyb2xsZXItbWFwJyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCR0L7QutGBINGBINC20LjQstC+0YLQvdGL0LzQuCDQt9Cw0LrRgNGL0LvRgdGPLlxyXG4gICAgICogQG1ldGhvZCBvbkNsb3NlQm94RnJvbUFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25DbG9zZUJveEZyb21BbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C30LDQutGA0YvQu9GB0Y8gQm94RnJvbUFuaW1hbCcpO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZUdhbWUgIT0gU3RhdEdhbWUuY3JlYXRlQW5pbWFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JHQvtC60YEg0YEg0LbQuNCy0L7RgtC90YvQvNC4INC+0YLQutGA0YvQu9GB0Y8uXHJcbiAgICAgKiBAbWV0aG9kIG9uT3BlbkJveEZyb21BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3BlbkJveEZyb21BbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0YLQutGA0YvQu9GB0Y8gQm94RnJvbUFuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLmFjdGl2ZSA9IHRydWU7Ly/QsNC60YLQuNCy0LjRgNC+0LLQsNC70Lgg0LzQsNGB0LrRg1xyXG4gICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLnNldFBvc2l0aW9uKHRoaXMuX2NlbnRyZVdpbmRvd1BvaW50KTtcclxuICAgICAgICBpZiAodGhpcy5fY29udHJvbGxlckFuaW1hbCAhPT0gbnVsbCkgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdC90Y4g0L7RgtC60YDRi9C70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvbk9wZW5Cb3hNZW51UGxheVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25PcGVuQm94TWVudVBsYXkoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0YLQutGA0YvQu9C+0YHRjCDQvNC10L3RjicpO1xyXG4gICAgICAgIHRoaXMubm9kZU1lbnUuYWN0aXZlID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10L3RjiDQt9Cw0LrRgNGL0LvQvtGB0YwuXHJcbiAgICAgKiBAbWV0aG9kIG9uQ2xvc2VCb3hNZW51UGxheVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25DbG9zZUJveE1lbnVQbGF5KGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0LrRgNGL0LvQvtGB0Ywg0LzQtdC90Y4nKTtcclxuICAgICAgICB0aGlzLm5vZGVNZW51LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQvdC40LUg0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICog0J7RgtCy0LXRh9Cw0LXRgiDQt9CwINGA0LDQt9C80LXRidC10L3QuNC1INC20LjQstC+0YLQvdC+0LPQviDQsiDQtNC10YDQtdCy0LUg0L3QvtC00L7Qsi5cclxuICAgICAqIEBtZXRob2Qgb25BbmltYWxDcmVhdGVkXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkFuaW1hbENyZWF0ZWQoZXZlbnQpe1xyXG4gICAgICAgIHRoaXMuX3N0YXRlR2FtZSA9IFN0YXRHYW1lLmNyZWF0ZUFuaW1hbDtcclxuICAgICAgICBjYy5sb2coJ9GB0L7Qt9C00LDQvdC40LUg0L3QvtCy0L7Qs9C+INC20LjQstC+0YLQvdC+0LPQvicpO1xyXG4gICAgICAgIGV2ZW50LmRldGFpbC5hbmltYWwucGFyZW50ID0gdGhpcy5ub2RlRmllbGRBbmltYWxzLnBhcmVudDsvLyDQv9C+0LTRhtC10L/QuNGC0Ywg0LbQuNCy0L7RgtC90L7QtSDQuiDQutCw0YDRgtC1XHJcbiAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5fY29udHJvbGxlck1hcC5nZXRQb2ludE1hcChjYy52Mih0aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm5vZGUuaGVpZ2h0IC8gMikpOy8v0LLRi9GH0LjRgdC70LjRgtGMINC60L7QvtGA0LTQuNC90LDRgtGLINC90LAg0LrQsNGA0YLQtVxyXG4gICAgICAgIGV2ZW50LmRldGFpbC5hbmltYWwuc2V0UG9zaXRpb24ocG9pbnQueCwgcG9pbnQueSk7Ly/Qo9GB0YLQsNC90L7QstC40YLRjCDQutC+0L7RgNC00LjQvdCw0YLRiyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICB0aGlzLl90YXJnZXRQdXRoVG9Nb2RlbCA9IGV2ZW50LmRldGFpbC5wdXRoVG9Nb2RlbDsvL9Ch0L7RhdGA0LDQvdC40YLRjCDQv9GD0YLRjCDQtNC+INC80L7QtNC10LvQuC4g0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC/0YDQuCDRgdC+0LfQtNCw0L3QuNC4INC80L7QtNC10LvQuFxyXG5cclxuICAgICAgICB0aGlzLl9ib3hDcmVhdGVBbmltYWwuY2xvc2VCb3goKTsvL9C30LDQutGA0YvRgtGMINCx0L7QutGBINGBINC20LjQstC+0YLQvdGL0LzQuFxyXG4gICAgICAgIHRoaXMuX2JveENyZWF0ZUFuaW1hbC5vbkJsb2NrKCk7Ly/Qt9Cw0LHQu9C+0LrQuNGA0L7QstCw0YLRjCDQsdC+0LrRgSDRgdC20LjQstC+0YLQvdGL0LzQuFxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQub24oKTsvL9CS0LrQu9GO0YfQuNGC0Ywg0LrQvtGA0LfQuNC90YNcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSBmYWxzZTsvL9C30LDQsdC70L7QutC40YDQvtCy0LDRgtGMINC60LDRgNGC0YNcclxuXHJcbiAgICAgICAgLy/QndC10L7QsdGF0L7QtNC40LzQviDQt9Cw0LrRgNGL0YLRjCDQstGB0LUg0YfRgtC+INGB0LLRj9C30LDQvdC+INGBINC/0YDQvtGI0LvRi9C8INGE0L7QutGD0YHQvtC8XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldEFuaW1hbCAhPSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLmNsb3NlTWVudSgpOy8v0LfQsNC60YDRi9Cy0LDQtdGCINC80LXQvdGOXHJcbiAgICAgICAgICAgIHRoaXMuX2JveENoYXJhY3RlcmlzdGljc0FuaW1hbC5jbG9zZUJveCgpOy8v0LfQsNC60YDRi9GC0Ywg0LHQvtC60YEg0YEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LrQsNC80LhcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsID0gbnVsbDsvL9C+0LHQvdGD0LvRj9C10YIg0YHRgdGL0LvQutGDINC90LAg0L3QvtC0INC20LjQstC+0YLQvdC+0LPQviDQsiDRhNC+0LrRg9GB0LVcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0LXRgNC10YLQsNGB0LrQuNCy0LDQvdC40LUg0LbQuNCy0L7RgtC90L7Qs9C+INC90LDRh9Cw0LvQvtGB0YwuXHJcbiAgICAgKiBAbWV0aG9kIG9uU3RhcnREcmFnQW5kRHJvcEFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25TdGFydERyYWdBbmREcm9wQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0L/Rg9GB0Log0LDQvdC40LzQsNGG0LjQuCDQv9C+0LTQstC10YjQtdC90L3QvtGB0YLQuCAo0YHRgtCw0YDRgiDQv9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNGPKScpO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IGV2ZW50LmRldGFpbC5hbmltYWw7Ly/QkdC10YDQtdC8INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YTQvtC60YPRgVxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IGZhbHNlOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LTQstC40LbQtdC90LjQtSDQutCw0YDRgtGLXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1INC90L7QstC+0LPQviDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAgICAgKiDQntGC0LLQtdGH0LDQtdGCINC30LAg0L/QtdGA0LXQvNC10YnQtdC90LjQtSDQvdC+0LTQsCDQttC40LLQvtGC0L3QvtCz0L4g0L/QviDQutCw0YDRgtC1INC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDQuCDQv9GA0L7QuNC30LLQvtC00LjRgiDQt9Cw0LzQtdGA0Ysg0LTQviDRgNCw0LfQu9C40YfQvdGL0YUg0L7QsdGK0LXQutGC0L7QsiDQvdCwINC60LDRgNGC0LUuXHJcbiAgICAgKiBAbWV0aG9kIG9uRHJhZ0FuZERyb3BBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uRHJhZ0FuZERyb3BBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9GB0L7QvtCx0YnQsNC10Lwg0LrQvtGA0LfQuNC90LUg0L/QvtC70L7QttC10L3QuNC1INC30LLQtdGA0Y7RiNC60LggKNC/0LXRgNC10YLQsNGB0LrQuNCy0LDQvdC40LUpJyk7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5fY29udHJvbGxlck1hcC5nZXRQb2ludFdpbmRvdyhldmVudC5kZXRhaWwucG9pbnQpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQuc2V0UG9zaXRpb25BbmltYWwocG9pbnQpO1xyXG4gICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLnNldFBvc2l0aW9uKHBvaW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1INC20LjQstC+0YLQvdC+0LPQviDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvblN0b3BEcmFnQW5kRHJvcEFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25TdG9wRHJhZ0FuZERyb3BBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0L/RgNC10LTQtdC70LXQvdC40LUg0LTQsNC70YzQvdC10LnRiNC40YUg0LTQtdC50YHRgtCy0LjQuSDRgSDQttC40LLQvtGC0L3Ri9C8ICjQt9Cw0LLQtdGA0YjQtdC90LjQtSDQv9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1KScpO1xyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRXaW5kb3coZXZlbnQuZGV0YWlsLnBvaW50KTsgLy/Ql9Cw0L/RgNCw0YjQuNCy0LDQtdC8INGC0L7Rh9C60YMg0LIg0YTQvtGA0LzQsNGC0LUg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0L7QutC90LBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQuaXNBbmltYWxMaWZlKHBvaW50KSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5fYXBpLmNyZWF0ZUFuaW1hbCh0aGlzLl90YXJnZXRQdXRoVG9Nb2RlbCwgdGhpcy5ub2RlRmllbGRBbmltYWxzLmNoaWxkcmVuLmxlbmd0aCk7Ly/RgdC+0LfQtNCw0LXQvCDQvNC+0LTQtdC70Ywg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgICAgIGxldCBub2RlTW9kZWwgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLl90YXJnZXRBbmltYWwuY2hpbGRyZW5bMF0pOy8v0YHQvtC30LTQsNC10Lwg0L3QvtC0INC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgICAgICBub2RlTW9kZWwucGFyZW50ID0gdGhpcy5ub2RlRmllbGRBbmltYWxzOy8v0JLQtdGI0LDQtdC8INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0L3QsCDQvdC+0LQg0YHQviDQstGB0LXQvNC4INC20LjQstC+0YLQvdGL0LzQuFxyXG4gICAgICAgICAgICBub2RlTW9kZWwuc2V0UG9zaXRpb24oZXZlbnQuZGV0YWlsLnBvaW50LngsIGV2ZW50LmRldGFpbC5wb2ludC55KTsvL9Cj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INC/0L7Qt9C40YbQuNGOINC90LAg0LrQsNGA0YLQtVxyXG4gICAgICAgICAgICBub2RlTW9kZWwuYWRkQ29tcG9uZW50KCdjb250cm9sbGVyLWFuaW1hbCcpOy8v0JTQvtCx0LDQstC70Y/QtdC8INC60L7QvdGC0YDQvtC70LvQtdGAINGC0LXQu9GDINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgICAgICBub2RlTW9kZWwuZ2V0Q29tcG9uZW50KCdjb250cm9sbGVyLWFuaW1hbCcpLnNldHRpbmdzKG1vZGVsKTsvL9Cd0LDRgdGC0YDQsNC40LLQsNC8INC60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgICAgICB0aGlzLl9jb250cm9sbGVyQmFza2V0Lm9uQmFkV29ya0Jhc2tldCgpOy8v0JTQsNGC0Ywg0LrQvtC80LDQvdC00YMg0LrQvtGA0LfQuNC90LUo0L3QtSDRgdC10LnRh9Cw0YEpXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQub25Hb29kV29ya0Jhc2tldCgpOy8v0JTQsNGC0Ywg0LrQvtC80LDQvdC00YMg0LrQvtGA0LfQuNC90LUo0YDQsNCx0L7RgtCw0YLRjClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbC5kZXN0cm95KCk7Ly/Qo9C00LDQu9C40YLRjCDQstGA0LXQvNC10L3QvdGL0Lkg0L3QvtC0INC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQub2ZmKCk7Ly/QstGL0YDRg9Cx0LjRgtGMINC60L7RgNC30LjQvdGDXHJcbiAgICAgICAgdGhpcy5fYm94Q3JlYXRlQW5pbWFsLm9mZkJsb2NrKCk7Ly/QstGL0YDRg9Cx0LjRgtGMINCx0LvQvtC60LjRgNC+0LLQutGDINC90LjQttC90LXQs9C+INCx0L7QutGB0LBcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSB0cnVlOy8v0YDQsNC30LHQu9C+0LrQuNGA0L7QstCw0YLRjCDQtNCy0LjQttC10L3QuNC1INC60LDRgNGC0YtcclxuXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsID0gbnVsbDsvL9C+0LHQvdGD0LvQuNGC0YwgINC20LjQstC+0YLQvdC+0LUg0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICB0aGlzLl90YXJnZXRQdXRoVG9Nb2RlbCA9IG51bGw7Ly/QvtCx0L3Rg9C70LjRgtGMINC/0YPRgtGMINC00L4g0LzQvtC00LXQu9C4INC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgIHRoaXMubm9kZU1hc2tDcmVhdGVkQW5pbWFsLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlR2FtZSA9IFN0YXRHYW1lLnNsZWVwO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCd0LDRh9Cw0LvQviDQtNCy0LjQttC10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25TdGFydE1vdGlvbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25TdGFydE1vdGlvbkFuaW1hbChldmVudCl7XHJcbiAgICAgICAgLy/Ql9Cw0LrRgNGL0LLQsNGOINC80LXQvdGOINC40LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LbQuNCy0L7RgtC90L7QvCDQtdGB0LvQuCDQv9C10YDQtdC60LvRjtGH0LDRjtGB0Ywg0L3QsCDQtNGA0YPQs9C+0LUg0LbQuNCy0L7RgtC90L7QtVxyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRBbmltYWwgIT0gbnVsbCAmJiB0aGlzLl90YXJnZXRBbmltYWwuX21vZGVsLmlkICE9IGV2ZW50LmRldGFpbC5jb250cm9sbGVyLl9tb2RlbC5pZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLmNsb3NlTWVudSgpOy8v0LfQsNC60YDRi9GC0Ywg0LzQtdC90Y5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNjLmxvZygn0L3QsNGH0LjQvdCw0Y4g0LTQstC40LPQsNGC0YzRgdGPINC30LAg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lwo0J3QsNGH0LjQvdCw0Y4g0LLRi9GO0L7RgCDQtNCy0LjQs9Cw0YLRjNGB0Y8g0LjQu9C4INC+0YLQutGA0YvRgtGMINC80LXQvdGOKScpO1xyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRNYXAoZXZlbnQuZGV0YWlsLnN0YXJ0TW90aW9uKTsvL9C60L7QvdCy0LXRgNGC0LjRgNGD0LXQvCDRgtC+0YfQutGDINC+0LrQvdCwINC6INGC0L7Rh9C60YMg0LrQsNGA0YLRi1xyXG5cclxuICAgICAgICB0aGlzLl9wb2ludFRhcmdldEFuaW1hbCA9IGNjLnYyKHBvaW50LngsIHBvaW50LnkpOy8vINC30LDQtNCw0LXQvCDRgtC+0YfQutGDINC60YPQtNCwINC90LDQtNC+INC00L7RgdGC0LDQstC40YLRjCDQttC40LLQvtGC0L3QtVxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwgPSBldmVudC5kZXRhaWwuY29udHJvbGxlcjsvL9C/0L7Qu9GD0YfQsNC10Lwg0LrQvtC90YLRgNC+0LvQu9C10YAg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsID0gZXZlbnQuZGV0YWlsLmNvbnRyb2xsZXI7Ly/Rg9GB0YLQsNC90L7QstC40LvQuCDQvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+INC90LAg0YTQvtC60YPRgVxyXG5cclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSBmYWxzZTsvL9C30LDQsdC70L7QutC40YDQvtCy0LDRgtGMINC60LDRgNGC0YNcclxuXHJcbiAgICAgICAgLy/Rg9Cy0LXQu9C40YfQuNC8INC/0L7Qu9C1INC+0YLQutC70LjQutCwINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgIHRoaXMuX3RhcmdldFNpemVXaXRoID0gdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUud2lkdGg7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0U2l6ZUhlaWdodCA9IHRoaXMuX3RhcmdldEFuaW1hbC5ub2RlLmhlaWdodDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNCy0LjQttC10L3QuNC1INC20LjQstC+0YLQvdC+0LPQviDQt9CwINCy0LXQtNGD0YnQuNC8LlxyXG4gICAgICogQG1ldGhvZCBvbk1vdGlvbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Nb3Rpb25BbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIC8v0L7QsdGA0LDQsdC+0YLQutCwINGB0L7QsdGL0YLQuNC5INGBINC20LjQstC+0YLQvdGL0Lwg0LLQviDQstGA0LXQvNGPINC00LLQuNC20LXQvdC40Y9cclxuICAgICAgICBjYy5sb2coJ9C00LLQuNCz0LDRjtGB0Ywg0LfQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvCcpO1xyXG4gICAgICAgIC8v0YPQstC10LvQuNGH0LjQvCDQv9C+0LvQtSDQvtGC0LrQu9C40LrQsCDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubm9kZS53aWR0aCA9IDIwMDA7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUuaGVpZ2h0ID0gMjAwMDtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QutC+0L3Rh9Cw0L3QuNC1INC00LLQuNC20LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICogQG1ldGhvZCBvbkVuZE1vdGlvbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25FbmRNb3Rpb25BbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0LfQsNC60LDQvdGH0LjQstCw0Y4g0LTQstC40LPQsNGC0YzRgdGPINC30LAg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwnKTtcclxuXHJcbiAgICAgICAgLy/Rg9C80LXQvdGM0YjQsNC10Lwg0L/Qu9C+0YnQsNC00Ywg0L/QvtC60YDRi9GC0LjRjyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubm9kZS53aWR0aCA9IHRoaXMuX3RhcmdldFNpemVXaXRoO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbC5ub2RlLmhlaWdodCA9IHRoaXMuX3RhcmdldFNpemVIZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRNYXAoZXZlbnQuZGV0YWlsLnBvaW50RW5kKTsvLyDQutC+0L3QstC10YDRgtC40YDRg9C10Lwg0YLQvtGH0LrRgyDQvtC60L3QsCDQuiDRgtC+0YfQutC1INC60LDRgNGC0YtcclxuICAgICAgICB0aGlzLl9wb2ludFRhcmdldEFuaW1hbCA9IGNjLnYyKHBvaW50LngsIHBvaW50LnkpOy8vINCy0YvRh9C40YHQu9GP0LXQvCDRgtC+0YfQutGDINC60YPQtNCwINC/0L7QudC00LXRgiDQttC40LLQvtGC0L3QvtC1INCyINC40YLQvtCz0LVcclxuICAgICAgICAvL9GB0L7QvtCx0YnQsNC10Lwg0LzQvtC00LXQu9C4INGC0L7Rh9C60YMg0LTQviDQutC+0YLQvtGA0L7QuSDQvdC10L7QsdGF0L7QtNC40LzQviDQtdC5INC00L7QudGC0LhcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubW92ZVRvUG9pbnQodGhpcy5fcG9pbnRUYXJnZXRBbmltYWwpO1xyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IHRydWU7IC8vINCg0LDQt9Cx0LvQvtC60LjRgNC+0LLQsNC70Lgg0LrQsNGA0YLRg1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXQvdGOINC20LjQstC+0YLQvdC+0LPQviDQvtGC0LrRgNGL0YLQvi5cclxuICAgICAqIEBtZXRob2Qgb25PcGVuTWVudUFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25PcGVuTWVudUFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQntGC0LrRgNGL0LLQsNGOINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvicpO1xyXG4gICAgICAgIC8v0KbQtdC90YLRgNC40YDQvtCy0LDRgtGMINC20LjQstC+0YLQvdC+0LVcclxuICAgICAgICBsZXQgcG9pbnQgPSBjYy52Mih0aGlzLl90YXJnZXRBbmltYWwubm9kZS54IC0gdGhpcy5fY2VudHJlV2luZG93UG9pbnQueCwgdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUueSAtIHRoaXMuX2NlbnRyZVdpbmRvd1BvaW50LnkpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyTWFwLm1vdmVBY3Rpb25zKHBvaW50LCAwLjI1KTsvL9C/0LXRgNC10LzQtdGB0YLQuNGC0Ywg0YbQtdC90YLRgCDQutCw0LzQtdGA0Ysg0L3QsCDRjdGC0YMg0YLQvtGH0LrRgyDQt9CwIDAuMjUg0YHQtdC60YPQvdC00YtcclxuXHJcbiAgICAgICAgLy/Qo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDQvdCw0YHRgtGA0L7QudC60Lgg0LTQu9GPINC80LXQvdGOXHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckNpcmN1bGFyTWVudS5zZXR0aW5ncyh0aGlzLl9jb250cm9sbGVyQW5pbWFsKTtcclxuXHJcbiAgICAgICAgLy/Qt9Cw0L/QvtC70L3QuNGC0Ywg0LHQvtC60YEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LosLCxcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlQm94TWFwLmdldENvbXBvbmVudChjYy5TY3JvbGxWaWV3KS5lbmFibGVkID0gZmFsc2U7Ly/Qt9Cw0LHQu9C+0LrQuNGA0L7QstCw0YLRjCDQutCw0YDRgtGDXHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUub3Blbk1lbnU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+INC30LDQutGA0YvRgtC+LlxyXG4gICAgICogQG1ldGhvZCBvbkNsb3NlTWVudUFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25DbG9zZU1lbnVBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9CX0LDQutGA0YvQstCw0Y4g0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+Jyk7XHJcbiAgICAgICAgdGhpcy5ub2RlTWVudUFuaW1hbC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSB0cnVlOy8v0YDQsNC30LHQu9C+0LrQuNGA0L7QstCw0YLRjCDQutCw0YDRgtGDXHJcbiAgICAgICAgdGhpcy5fYm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsLmNsb3NlQm94KCk7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9zdGF0ZUdhbWUgPSBTdGF0R2FtZS5zbGVlcDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQltC40LLQvtGC0L3QvtC1INC40LfQtNCw0LvQviDQt9Cy0YPQui5cclxuICAgICAqIEBtZXRob2Qgb25Wb2ljZUFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Wb2ljZUFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC/0YDQvtGP0LLQuNC70L4g0LPQvtC70L7RgScpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwucnVuVm9pY2UoKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLmNsb3NlTWVudSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCW0LjQstC+0YLQvdC+0LUg0YHQtdC70L5cclxuICAgICAqIEBtZXRob2Qgb25TaXRBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uU2l0QW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C20LjQstC+0YLQvdC+0LUg0YHQtdC70L4nKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1blNpdCgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQuNGB0L/Rg9Cz0LDQu9C+0YHRjFxyXG4gICAgICogQG1ldGhvZCBvbkZyaWdodGVuQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkZyaWdodGVuQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C20LjQstC+0YLQvdC+0LUg0LjRgdC/0YPQs9Cw0LvQvtGB0YwnKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1bkZyaWdodGVuKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQsNGA0LXQsNC70Ysg0YfRg9Cy0YHRgtCyXHJcbiAgICAgKiBAbWV0aG9kIG9uQXJlYWxBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQXJlYWxBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0LbQuNCy0L7RgtC90L7QtSDQv9C+0LrQsNC30LDQu9C+INGB0LLQvtC5INCw0YDQtdCw0LsnKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1bkFyZWFsKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQltC40LLQvtGC0L3QvtC1INC/0L7Qs9C70LDQtNC40LvQuCzQv9C+0LbQsNC70LXQu9C4XHJcbiAgICAgKiBAbWV0aG9kIG9uQ2FyZUFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25DYXJlQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C20LjQstC+0YLQvdC+0LUg0L/QvtCz0LvQsNC00LjQu9C4Jyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5DYXJlKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQltC40LLQvtGC0L3QvtC1INC70LXQs9C70L5cclxuICAgICAqIEBtZXRob2Qgb25MaWVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uTGllQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C20LjQstC+0YLQvdC+0LUg0LvQtdCz0LvQvicpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwucnVuTGllKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQltC40LLQvtGC0L3QvtC1INC/0YDQuNCz0L7RgtC+0LLQuNC70L7RgdGMXHJcbiAgICAgKiBAbWV0aG9kIG9uQXR0ZW50aW9uQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkF0dGVudGlvbkFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC/0YDQuNCz0L7RgtC+0LLQuNC70L7RgdGMJyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5BdHRlbnRpb24oKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLmNsb3NlTWVudSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCR0L7QutGBINGF0LDRgNCw0LrRgtGA0LjRgdGC0LjQuiDQttC40LLQvtGC0L3QvtCz0L4g0L7RgtC60YDRi9C70YHRjy5cclxuICAgICAqIEBtZXRob2Qgb25PcGVuQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25PcGVuQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0L7RgtC60YDRi9C70YHRjyBCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsJyk7XHJcbiAgICAgICAgdGhpcy5fYm94Q3JlYXRlQW5pbWFsLmNsb3NlQm94KCk7XHJcbiAgICAgICAgLy/Qt9Cw0L/QvtC70L3Rj9C10YIg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LrQuFxyXG4gICAgICAgIGxldCBtYXNzID0gdGhpcy5fY29udHJvbGxlckFuaW1hbC5nZXRDaGFyYWN0ZXJpc3RpY3MoKTtcclxuICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuX2JveENoYXJhY3RlcmlzdGljc0FuaW1hbC5jb250ZW50O1xyXG5cclxuICAgICAgICBsZXQgbm9kZVBhcmFtO1xyXG4gICAgICAgIC8v0YfQuNGB0YLQuNC8INC/0YDQtdC00YvQtNGD0YnQuNC1INC30LDQv9C40YHQuFxyXG4gICAgICAgIGNvbnRlbnQuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmRlc3Ryb3koKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy/QndCw0YfQuNC90LDQtdC8INC30LDQv9C+0LvQvdC10L3QuNC1XHJcbiAgICAgICAgbm9kZVBhcmFtID0gY2MuaW5zdGFudGlhdGUodGhpcy5wcmVmYWJQYXJhbWV0ckNoYXJhY3RlcmlzdGljcyk7XHJcbiAgICAgICAgbm9kZVBhcmFtLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcbiAgICAgICAgbm9kZVBhcmFtLmFkZENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbWFzcy5uYW1lO1xyXG4gICAgICAgIG5vZGVQYXJhbS5jb2xvciA9IHRoaXMuY29sb3JUZXh0Q2hhcmFjdGVyaXN0aWNzO1xyXG4gICAgICAgIGNvbnRlbnQuYWRkQ2hpbGQobm9kZVBhcmFtKTtcclxuXHJcbiAgICAgICAgbm9kZVBhcmFtID0gY2MuaW5zdGFudGlhdGUodGhpcy5wcmVmYWJQYXJhbWV0ckNoYXJhY3RlcmlzdGljcyk7XHJcbiAgICAgICAgbm9kZVBhcmFtLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcbiAgICAgICAgbm9kZVBhcmFtLmFkZENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbWFzcy5jdXJyZW50U3RhdGU7XHJcbiAgICAgICAgbm9kZVBhcmFtLmNvbG9yID0gdGhpcy5jb2xvclRleHRDaGFyYWN0ZXJpc3RpY3M7XHJcbiAgICAgICAgY29udGVudC5hZGRDaGlsZChub2RlUGFyYW0pO1xyXG5cclxuICAgICAgICBsZXQgdnI7Ly/QstGA0LXQvNC10L3QvdCw0Y8g0L/QtdGA0LXQvNC10L3QvdCw0Y8g0YPQt9C70L7QslxyXG4gICAgICAgIC8v0LfQsNC/0L7Qu9C90Y/QtdC8INGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuICAgICAgICBpZiAobWFzcy5wYXJhbS5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hc3MucGFyYW0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG5vZGVQYXJhbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3MpO1xyXG4gICAgICAgICAgICAgICAgY29udGVudC5hZGRDaGlsZChub2RlUGFyYW0pO1xyXG4gICAgICAgICAgICAgICAgbm9kZVBhcmFtLnggPSAwO1xyXG4gICAgICAgICAgICAgICAgdnIgPSBub2RlUGFyYW0uZ2V0Q2hpbGRCeU5hbWUoJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgIHZyLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbWFzcy5wYXJhbVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgdnIuY29sb3IgPSB0aGlzLmNvbG9yVGV4dENoYXJhY3RlcmlzdGljcztcclxuICAgICAgICAgICAgICAgIHZyID0gbm9kZVBhcmFtLmdldENoaWxkQnlOYW1lKCd2YWx1ZScpO1xyXG4gICAgICAgICAgICAgICAgdnIuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBtYXNzLnBhcmFtW2ldLnZhbHVlLnRvU3RyaW5nKCkgKyBtYXNzLnBhcmFtW2ldLnVuaXQ7XHJcbiAgICAgICAgICAgICAgICB2ci5jb2xvciA9IHRoaXMuY29sb3JUZXh0Q2hhcmFjdGVyaXN0aWNzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCR0L7QutGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6INC20LjQstC+0YLQvdC+0LPQviDQt9Cw0LrRgNGL0LvRgdGPLlxyXG4gICAgICogQG1ldGhvZCBvbkNsb3NlQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25DbG9zZUJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C30LDQutGA0YvQu9GB0Y8gQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbCcpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0YDQt9C40L3QsCDQv9C10YDQtdGI0LvQsCDQsiDRgdC+0LHRi9GC0LjQtSDQsNC60YLQuNCy0L3QvtCz0L4g0L/RgNC10LTQstC60YPRiNC10L3QuNGPLlxyXG4gICAgICogQG1ldGhvZCBvbkJhc2tldEFjdGl2ZVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25CYXNrZXRBY3RpdmUoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C60L7RgNC30LjQvdCwINC/0YDQvtGP0LLQu9GP0LXRgiDQsNC60YLQuNCy0L3QvtGB0YLRjCcpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0YDQt9C40L3QsCDQv9C10YDQtdGI0LvQsCDQsiDRgNC10LbQuNC8INGB0L3QsC5cclxuICAgICAqIEBtZXRob2Qgb25CYXNrZXRTbGVlcFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25CYXNrZXRTbGVlcChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0LrQvtGA0LfQuNC90LAg0YHQv9C40YInKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0YDQt9C40L3QsCDQv9C10YDQtdGI0LvQsCDQsiDRgNC10LbQuNC8INGA0LDQsdC+0YLRiyAo0JLQvtGCINCy0L7RgiDRgdCx0YDQvtGB0Y/RgiDQttC40LLQvtGC0L3QvtC1KS5cclxuICAgICAqIEBtZXRob2Qgb25CYXNrZXRXb3JrXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkJhc2tldFdvcmsoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C60L7RgNC30LjQvdCwINC90LDQtNC10LXRgtGB0Y8g0YfRgtC+INCy0L7RgiDQstC+0YIg0LIg0L3QtdC1INC/0L7Qv9Cw0LTQtdGCINC20LjQstC+0YLQvdC+0LUnKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0L3QsNGH0LDQu9CwINGA0LDQsdC+0YLRiyDRgSDQutCw0YDRgtC+0LkuXHJcbiAgICAgKiBAbWV0aG9kIG9uVG91Y2hPbk1hcFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE9uTWFwKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQndCw0YfQsNC7INGA0LDQsdC+0YLRgyDRgSDQutCw0YDRgtC+0LknKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0LTQstC40LbQtdC90LjRjyDQutCw0YDRgtGLLlxyXG4gICAgICogQG1ldGhvZCBvblRvdWNoTW92ZU9uTWFwXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoTW92ZU9uTWFwKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQlNCy0LjQs9Cw0LXRgiDQutCw0YDRgtGDJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0YDQsNCx0L7RgtGLINGBINC60LDRgNGC0L7QuS5cclxuICAgICAqIEBtZXRob2Qgb25Ub3VjaEVuZE1vdmVPbk1hcFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaEVuZE1vdmVPbk1hcChldmVudCl7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZUdhbWUgPT09IFN0YXRHYW1lLnNsZWVwKSB7XHJcbiAgICAgICAgICAgIGNjLmxvZygn0LfQsNCy0LXRgNGI0LjQuyDRgNCw0LHQvtGC0YMg0YEg0LrQsNGA0YLQvtC5Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCd0LDQstC10LTQtdC90LjQtSDRhtC10L3RgtGA0LAg0LrQsNC80LXRgNGLINC90LAg0LbQuNCy0L7RgtC90L7QtSDQt9Cw0LLQtdGA0YjQuNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvbkZpbmlzaE1vdmVDYW1lcmFUb0FuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25GaW5pc2hNb3ZlQ2FtZXJhVG9BbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVNZW51QW5pbWFsLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub2RlTWVudUFuaW1hbC5zZXRQb3NpdGlvbih0aGlzLl9jZW50cmVXaW5kb3dQb2ludC54LCB0aGlzLl9jZW50cmVXaW5kb3dQb2ludC55KTtcclxuICAgICAgICB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwub3BlbkJveCgpO1xyXG4gICAgfSxcclxuXHJcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=