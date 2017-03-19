const StateMenu = {
    close: 0,
    open: 1
};

cc.Class({
    extends: cc.Component,

    properties: {
        _model: null,//модель животного

        maxBiasTouch: 5,//максимальное смещение тача для открытия меню (px)
        nodeManadgerMenu: cc.Node,//нод меню животного
        _stateMenuAnimal: StateMenu.close,//состояние меню
        _pointTouchForMenu: cc.v2,//точка старта тача по животному
    },

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd.bind(this));
    },

    /**
     * Настраивает доступные действия плюшки для животного и характеристики
     */
    settings(model){
        this._stateMenuAnimal = StateMenu.close;
        this.nodeManadgerMenu = this.node.children[4];
        this.nodeManadgerMenu.getComponent('circular-list-actions-animal').radius = this.node.width * 1.5;
        this._model = model;
        cc.log(this._model);
    },

    _onTouchMove(event){
        var delta = event.touch.getDelta();
        //Необходимо отправлять модели данные для получения смещения животного в зависимости от его скорости
        this.node.x += delta.x;
        this.node.y += delta.y;
        let myEvent = new cc.Event.EventCustom('motionAnimal', true);
        myEvent.detail = {
            animal: this,
            deltaMotionX: delta.x,
            deltaMotionY: delta.y,
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },

    _onTouchStart(event){
        let myEvent = new cc.Event.EventCustom('startMotionAnimal', true);
        myEvent.detail = {
            startMotionX: this.node.x,
            startMotionY: this.node.y,
            controller: this,
            nodeMenu: this.nodeManadgerMenu,
        };
        this.node.dispatchEvent(myEvent);
        this._pointTouchForMenu = event.getLocation();
        event.stopPropagation();
    },

    _onTouchEnd(event){
        let myEvent = new cc.Event.EventCustom('endMotionAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
        let point = event.getLocation();
        let X = Math.abs(this._pointTouchForMenu.x - point.x) < this.maxBiasTouch;
        let Y = Math.abs(this._pointTouchForMenu.y - point.y) < this.maxBiasTouch;
        if (X && Y) {
            this._refocusMenu();
        }
        event.stopPropagation();
    },

    /**
     * Изменяет состояние меню
     * @private
     */
    _refocusMenu(){
        if (this._stateMenuAnimal === StateMenu.close) {
            this._stateMenuAnimal = StateMenu.open;
            this.nodeManadgerMenu.active = true;
            this._publishOpenMenuAnimal();
        } else {
            this._stateMenuAnimal = StateMenu.close;
            this.nodeManadgerMenu.active = false;
            this._publishCloseMenuAnimal();
        }
    },

    /**
     * Открытие меню животного
     */
    _publishOpenMenuAnimal(){
        let myEvent = new cc.Event.EventCustom('openMenuAnimal', true);
        myEvent.detail = {
            model: this._model,
            nodeMenu: this.nodeManadgerMenu,
            pointX: this.node.x,
            pointY: this.node.y,
        };
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Закрыто меню с животными
     */
    _publishCloseMenuAnimal(){
        let myEvent = new cc.Event.EventCustom('closeMenuAnimal', true);
        myEvent.detail = {
            nodeAnimal: this.node,
        };
        this.node.dispatchEvent(myEvent);
    },

    /**
     * Открыть меню
     */
    openMenu(){
        this.nodeManadgerMenu.active = true;
        this._refocusMenu();
    },

    /**
     * Закрыть меню
     */
    closeMenu(){
        this.nodeManadgerMenu.active = false;
        this._refocusMenu();
    },
});