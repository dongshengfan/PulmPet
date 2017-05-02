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