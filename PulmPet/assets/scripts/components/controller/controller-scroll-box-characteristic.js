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
        nodeCoil: cc.Node,//нод палки
        nodeRoll: cc.Node,//нод блеска
        nodeContent: cc.Node,// нод контента
        bottomPointStartRotation: 281,//нижняя кордина старта поворота
        topPointStartRotation: 361,//верхняя кордина старта поворота
        _interval: 0,//длинна промежутка для сжития паременных
        _startPosContent: null,//стартовая позиция контента бокса!!
    },

    /**
     * Событие на загрузку сцены.
     * @method onLoad
     */
    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
    },

    /**
     * Инициализация по запуску элемента
     * @method start
     */
    start(){
        let la = this.nodeContent.getComponent(cc.Layout);
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
    _onTouchStart(event){

    },

    /**
     * Евент движения скролла. Обрабатывает вращении бокса характеристик.Производит сжатие параметров на интервале
     * @method onMoveScroll
     * @param event
     */
    onMoveScroll(event){

        let currentPointContent = event.getContentPosition();
        let bais = Math.abs(currentPointContent.y - this._startPosContent);
        let vr = 0;
        if (currentPointContent.y > this._startPosContent) {
            this.nodeContent.children.forEach((item) => {
                let currentPointItem = this._startPosContent - vr + bais;
                if (currentPointItem > this.bottomPointStartRotation && currentPointItem < this.topPointStartRotation) {
                    item.scaleY = this._getScaleItem(currentPointItem);
                } else {
                    item.scaleY = 1;
                }
                vr += this._step + item.height;
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
    _getScaleItem(currentPoint){
        let k = 1 - ((100 * (currentPoint - this.bottomPointStartRotation)) / this._interval) / 100;
        return (k > 1 || k < 0) ? 1 : k;
    },

});