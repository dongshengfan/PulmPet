/**
 * Состояние движения меню (по часовой/против часовой).
 * @type {MoveCircular}
 * @static
 * @element {number} clockwise крутится по часовой.
 * @element {number} anticlockwise крутится против часовой.
 */
const MoveCircular = {
    clockwise: 0,//по часовой
    anticlockwise: 1,//против часовой
};

/**
 * Выполняет вращениеи размещение элементов по окружности.
 * @class CircularList
 */
var CircularList = cc.Class({
    extends: cc.Component,

    properties: {
        _lengthBetweenPoints: 0,//расстояние между элементами
        _centre: cc.Vec2,//Центр круга
        _arrayAngleList: [],///массив углов листов на которых они находятся
        _poolInvisibleList: [],//массив невидимых листов
        _prevRotation: 0,//предыдущий угол воворота до текущего поворота
        _stateDirection: MoveCircular.clockwise,//направление движения

        amountVisiblList: 7,//количество видимых липестков меню
        angleTransition: 225,//угол перехода и появленияновых липестков
        widthTransition: 0.3,//ширина перехода в градусах
        radius: 130,//радиус на котором будут крутится все кнопки
        sensitivity: 1,//Чувствителность барабана к движению свайпа по координате
    },

    /**
     * Инициализация меню животного.
     * @method onLoad
     */
    onLoad(){
        this._placementListsMenu();
        this._prevRotation = this.node.rotation;

    },

    /**
     * Обновить позиции кнопок в меню. С учетом радиуса окружности.
     * @method _refreshMenu
     * @private
     */
    _refreshMenu(){
        this._placementListsMenu();
    },

    /**
     * Распределение кнопок по окружности.
     * @method _placementListsMenu
     * @private
     */
    _placementListsMenu(){
        //рассчитываем центр круга
        let window = this.node.parent;
        let currentRadians = 0, x, y;
        this._arrayAngleList = [];
        this._poolInvisibleList = [];

        this._centre = cc.v2(window.width / 2, window.height / 2);
        this._lengthBetweenPoints = 2 * Math.PI / this.amountVisiblList;

        this.node.children.forEach((item) => {

            if (currentRadians >= 2 * Math.PI) {
                item.active = false;
                this._poolInvisibleList.push(item);
            } else {
                y = this.radius * Math.sin(currentRadians);
                x = this.radius * Math.cos(currentRadians);
                item.setPosition(x, y);
                this._arrayAngleList.push({item: item, angle: currentRadians * (180 / Math.PI)});
            }

            currentRadians += this._lengthBetweenPoints;
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
    directionRotation(x, y, locX, locY){
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
    _workingVisibleElements(){
        let angle = this.getAngleMenu();
        //Узнаем для каждого элемента его угол на котором он находится
        this.node.children.forEach((item) => {
            if (item.active) {
                this._swapElement(this.getAngleList(item, angle), item);
            }
            angle = this.getAngleMenu();
        });
    },

    /**
     * Отдает угол меню.
     * @method getAngleMenu
     * @returns {number} угол поворота от 0 до 360.
     */
    getAngleMenu(){
        return this.node.rotation - 360 * Math.floor(this.node.rotation / 360);
    },

    /**
     * Работает с элементами выключая их и подставляяя за место них другие эелементы.
     * @method _swapElement
     * @param {number} angle угол на котором находится элемент.
     * @param {cc.Node} element элемент/лист который необходимо заменить на следующий элемент из очереди невидимых элементов.
     * @private
     */
    _swapElement(angle, element){
        if (angle > this.angleTransition - this.widthTransition && angle < this.angleTransition + this.widthTransition) {
            element.active = false;
            let actualList = this._poolInvisibleList.shift();
            actualList.setPosition(cc.v2(element.x, element.y));
            actualList.rotation = element.rotation;
            actualList.active = true;
            this._poolInvisibleList.push(element);
            this._arrayAngleList.forEach((item) => {
                if (item.item.name === element.name) {
                    item.item = actualList;
                }
            });

            (this._stateDirection === MoveCircular.clockwise) ? this.node.rotation += this.widthTransition : this.node.rotation -= this.widthTransition;
        }
    },

    /**
     * Возвращает угол элемента/листа под которым он находится.
     * @method getAngleList
     * @param {cc.Node} element нод элемента.
     * @param {number} angle угол поворота меню.
     * @return {number} угол листа/элемента меню.
     */
    getAngleList(element, angle){
        let obj = this._arrayAngleList.filter((item) => {
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
    _setDirection(){
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
    stabilizationElements(){
        this.node.children.forEach((item) => {
            item.rotation = -this.node.rotation;
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
    _obr1(x, y){
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
    _obr2(x, y){
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
    _obr3(x, y){
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
    _obr4(x, y){
        this.node.rotation -= x;
        this.node.rotation -= y;
        this.stabilizationElements();
    },
});

export { CircularList };