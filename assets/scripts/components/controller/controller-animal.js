/**
 *
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _model: null,//модель животного

        _maxBiasTouch: 15,//максимальное смещение тача для открытия меню (px)
        _pointTouchForMenu: cc.v2,//точка старта тача по животному

        _isMove: false,//флаг для определения движется ли живоное за пользователем
        _isOpenMenu: false,//флаг для определения открыто ли меню
    },

    onLoad(){
        this._isOpenMenu = false;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoveAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStartAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEndAnimal.bind(this));
    },


    /**
     * Настраивает доступные действия плюшки для животного и характеристики
     */
    settings(model){
        this._model = model;
    },


    /**
     * Обработчик события начала тача
     * @param event
     * @private
     */
    _onTouchStartAnimal(event){
        let myEvent = new cc.Event.EventCustom('startMotionAnimal', true);
        myEvent.detail = {
            startMotion: cc.v2(this.node.x, this.node.y),
            controller: this,
        };
        this.node.dispatchEvent(myEvent);//разослали евент
        this._isMove = false;//животное не движется за пользователем
        this._pointTouchForMenu = event.getLocation();//считали точку первого нажатия
        event.stopPropagation();
    },

    /**
     * Обработчик события движения тача.
     * @param event
     * @private
     */
    _onTouchMoveAnimal(event){
        //   cc.log(event);
        var delta = event.touch.getDelta();
        if (this._isCheckOnOpenMenu(event.getLocation()) && !this._isOpenMenu) {
            this._isMove = true;
            let myEvent = new cc.Event.EventCustom('motionAnimal', true);
            myEvent.detail = {
                deltaMotion: delta,
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
    _onTouchEndAnimal(event){
        // cc.log(event);
        if (this._isMove) {
            let myEvent = new cc.Event.EventCustom('endMotionAnimal', true);
            myEvent.detail = {
                pointEnd: event.getLocation(),
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
    _isCheckOnOpenMenu(point){
        let X = Math.abs(this._pointTouchForMenu.x - point.x) > this._maxBiasTouch;
        let Y = Math.abs(this._pointTouchForMenu.y - point.y) > this._maxBiasTouch;
        return X || Y;
    },

    /**
     * Изменяет состояние меню
     * @private
     */
    _refocusMenu(){
        this._isOpenMenu = !this._isOpenMenu;
        (this._isOpenMenu) ? this._publishOpenMenuAnimal() : this._publishCloseMenuAnimal();

    },

    /**
     * Открытие меню животного
     */
    _publishOpenMenuAnimal(){
        let myEvent = new cc.Event.EventCustom('openMenuAnimal', true);
        myEvent.detail = {
            controller: this,
        };
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Закрыто меню с животными
     */
    _publishCloseMenuAnimal(){
        let myEvent = new cc.Event.EventCustom('closeMenuAnimal', true);
        myEvent.detail = {
            controller: this,
        };
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Открытие меню
     */
    openMenu(){
        this._isOpenMenu = true;
        this._publishOpenMenuAnimal();
    },

    /**
     * Закрыть меню
     */
    closeMenu(){
        this._isOpenMenu = false;
        this._publishCloseMenuAnimal();
    },

    /**
     * Сообщает модели до какой точки надо дойти
     * @param point
     */
    moveToPoint(point){
        this._model.moveToPoint(point);
    },

    /**
     * Подать звук
     */
    runVoice(){

    },

    /**
     * Сесть
     */
    runSit(){

    },

    /**
     * Испугаться
     */
    runFrighten(){

    },

    /**
     * Показать ареалы
     */
    runAreal(){

    },

    /**
     * Поласкаться
     */
    runCare(){

    },

    /**
     * Лечь
     */
    runLie(){

    },

    /**
     * Приготовиться
     */
    runAttention(){

    },

    /**
     * Возвращает массив характеристик у животного
     * @return {*|any}
     */
    getCharacteristics(){
        return this._model.getCharacteristics();
    }

});