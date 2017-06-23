import { Core } from '../../core/build-ts';

/**
 *
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _model: null,//модель животного

        _maxBiasTouch: 15,//максимальное смещение тача для открытия меню (px)
        _pointTouchForMenu: cc.v2,//точка старта тача по животному

        _timeUpdate: 0.5,
        _isMove: false,//флаг для определения движется ли живоное за пользователем
        _isOpenMenu: false,//флаг для определения открыто ли меню
    },

    onLoad(){
        this._api = Core.instance();
        this._isOpenMenu = false;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoveAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStartAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEndAnimal.bind(this));
    },

    /**
     * Настраивает доступные действия плюшки для животного и характеристики
     */
    settings(pack){
        this._model = this._api.createAnimal(pack.puthToModel, pack.id);//создаем модель животного
        this._model.setPointStart(pack.point.x, pack.point.y);
        cc.log(this.node.children);
        cc.log(this._model);
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
    settingCollider(system, component){
        system === null ? component.radius = 0 : component.radius = system.current;
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
    _onTouchEndAnimal(event){
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
     * Запускает жизнь животного
     * @method run
     */
    run(){
        this._model.runLife();
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
        //реализовать
        this._model.goStateSit();
    },

    /**
     * Испугаться
     */
    runFrighten(){
        //реализовать
        this._model.goFrighten();
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
        //реализовать
        this._model.goCare();
    },

    /**
     * Лечь
     */
    runLie(){
        //реализовать
        this._model.goStateLies();
    },

    /**
     * Приготовиться
     */
    runAttention(){

    },

    /**
     * Обновляет представление модели
     * @param pack
     */
    goUpdate(pack){
        let mass = this._model.getCharacteristics();
        let nodeParam;
        let content = pack.content;

        //чистим предыдущие записи
        content.children.forEach((item) => {
            item.destroy();
        });

        //Начинаем заполнение
        nodeParam = cc.instantiate(pack.prefabParam);
        nodeParam.removeAllChildren();
        nodeParam.addComponent(cc.Label).string = mass.name;
        nodeParam.color = pack.color;
        content.addChild(nodeParam);
        nodeParam = cc.instantiate(pack.prefabParam);
        nodeParam.removeAllChildren();
        nodeParam.addComponent(cc.Label).string = mass.currentState;
        nodeParam.color = pack.color;
        content.addChild(nodeParam);

        let vr;//временная переменная узлов
        //заполняем характеристики
        if (mass.param.length != 0) {
            for (let i = 0; i < mass.param.length; i++) {
                nodeParam = cc.instantiate(pack.prefabParam);
                content.addChild(nodeParam);
                nodeParam.x = 0;
                vr = nodeParam.getChildByName('name');
                vr.getComponent(cc.Label).string = mass.param[i].name;
                vr.color = pack.color;
                vr = nodeParam.getChildByName('value');
                vr.getComponent(cc.Label).string = (mass.param[i].value.toFixed(2)).toString() + mass.param[i].unit;
                vr.color = pack.color;
            }
        }
        this._updateCharacteristics(pack);
    },

    /**
     * Обновляет характеристики
     * @param pack
     */
    _updateCharacteristics(pack){
        this.unschedule(this.callBackOpacity);
        this.callBackOpacity = () => {

            if (!this._isOpenMenu) {
                this.unschedule(this.callBackOpacity);
            }
            let mass = this._model.getCharacteristics();
            let content = pack.content;
            content.children[0].getComponent(cc.Label).string = mass.name;
            content.children[1].getComponent(cc.Label).string = mass.currentState;

            //заполняем характеристики
            if (mass.param.length != 0) {
                for (let i = 0; i < mass.param.length; i++) {
                    content.children[2 + i].children[1].getComponent(cc.Label).string = (mass.param[i].value.toFixed(2)).toString() + mass.param[i].unit;
                }
            }
        };

        this.schedule(this.callBackOpacity, this._timeUpdate);
    },


});