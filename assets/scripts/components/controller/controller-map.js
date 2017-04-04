/**
 * Created by FIRCorp on 04.03.2017.
 */

cc.Class({
    extends: cc.Component,

    properties: {
        _fictitiousPoint: null,//Точка для фиксации движения карты. Помогает различать событие движение от завершения
        _isTouchStart: null,//Флаг запущен ли тач
        _controllerScrollMap: null,
        _actionMoveMap: null,//действие движения карты
        _maxSizeMapScroll: null,//размер offset скролла. поможет при перемещении камеры от зверюшки к зверюшке

        maxBiasTouch: 15,//максимальное смещение тача для определения что карта движется
    },

    onLoad() {

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
    onEventScroll(event) {
        let point = event.getScrollOffset();
        let logRez = point.x === this._fictitiousPoint.x && point.y === this._fictitiousPoint.y;
        (logRez && this._isTouchStart) ? this.onTouchEnd(event) : this._fictitiousPoint = point;
    },

    /**
     * Действия на прикосновение к карте
     * @param event событие которое поймает этот скрипт
     */
    onTouchStart(event) {
        this._isTouchStart = true;
        //запомнимпозиция начала эвента
        let myEvent = new cc.Event.EventCustom('touchOnMap', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },

    /**
     * Действия на движение touch по карте
     * @param event событие которое поймает этот скрипт
     */
    onTouchMove(event) {
        let myEvent = new cc.Event.EventCustom('touchMoveOnMap', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },

    /**
     * Дейстия на откпускание touch от карты
     * @param event событие которое поймает скрол либо этот скрипт
     */
    onTouchEnd(event) {
  //      cc.log(event);
        if (this._isTouchStart) {
            this._isTouchStart = false;
            let myEvent = new cc.Event.EventCustom('touchEndMoveOnMap', true);
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
    getPointMap(point) {
        let newX = point.x - this.node.x;
        let newY = point.y - this.node.y;
        return cc.v2(newX, newY);
    },

    /**
     * Конвертирует точку в координаты окна
     * @param point точка на карте
     * @returns {Vec2} точка в окне
     */
    getPointWindow(point) {
        let newX = point.x + this.node.x;
        let newY = point.y + this.node.y;
        return cc.v2(newX, newY);
    },

    /**
     * Возвращает точку карты из системы координат скролла
     * @param point исходная точка
     * @returns {Vec2}
     */
    getPointMapOfOffset(point){
        let newY = this._maxSizeMapScroll.y - point.y;
        return cc.v2(point.x, newY);
    },

    /**
     * Инвертирует точку
     * @param point исходная точка
     * @returns {Vec2}
     */
    getInvertPoint(point){
        let newX = -point.x;
        let newY = -point.y;
        return cc.v2(newX, newY);
    },

    /**
     * Движение камеры внекоторую точку на основе метода движения скролла. С использованием его системы координат
     * @param point точка в которую необходимо перейти
     * @param time время за кторое производится переход
     */
    move(point, time = 0){
        this._controllerScrollMap.scrollToOffset(this.getPointMapOfOffset(point), time);
    },

    /**
     * Движение карты в некоторую точку на основе actions
     * @param point
     * @param time
     */
    moveActions(point, time = 0){
        this.node.stopAction(this._actionMoveMap);
        this._actionMoveMap = cc.moveTo(time, this.getInvertPoint(point));
        this.node.runAction(
            cc.sequence(this._actionMoveMap, cc.callFunc(this._publishFinishMoveCentreToAnimal, this))
        );
    },

    /**
     * Публикует событие завершения движения камеры до животного и фиксирование его по центру экрана
     * @private
     */
    _publishFinishMoveCentreToAnimal(){
        let myEvent = new cc.Event.EventCustom('finishMoveCameraToAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


});
