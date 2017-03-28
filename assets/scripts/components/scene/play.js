import { APICore }from '../../build/build-ts';
/**
 * Управляет представлнием
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nodeWindow: cc.Node,//окно игры
        nodeBoxCreateAnimal: cc.Node,//всплывающий бокс с животными
        nodeBoxCharacteristicsAnimal: cc.Node,//всплывающий бокс с характеристиками животного
        nodeBasket: cc.Node,//корзина для удаления животного
        nodeFieldAnimals: cc.Node,//поле жизнедеятельности животного
        nodeBoxMap: cc.Node,//бокс с картой
        nodeMap: cc.Node,//поле карты
        _nodeTargetMenuAnimal: cc.Node,//нод меню и выбранного животного


        _nodeTargetAnimal: cc.Node,//нод животного в таргете

        _pointTargetAnimal: cc.v2,//точка назначения животного в таргете
        _targetControllerAnimal: cc.Node,//контроллер животным в таргете
    },

    onLoad(){
        this.api = APICore.instance();

        this._pointTargetAnimal = cc.v2(0, 0);//точка назначения животного в таргете

        this.boxCreateAnimal = this.nodeBoxCreateAnimal.getComponent('box-bottom');
        this.boxCharacteristicsAnimal = this.nodeBoxCharacteristicsAnimal.getComponent('box-left-characteristics-animal');
        this.controllerBasket = this.nodeBasket.getComponent('basket-animal');
        this.controllerMap = this.nodeMap.getComponent('controller-map');


        this.node.on('createAnimal', this.onAnimalCreated.bind(this));
        this.node.on('openBoxFromAnimal', this.onOpenBoxFromAnimal.bind(this));
        this.node.on('closeBoxFromAnimal', this.onCloseBoxFromAnimal.bind(this));
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
    },


    /**
     * Бокс с животными закрылся
     * @param event
     */
    onCloseBoxFromAnimal(event){
        cc.log('закрылся BoxFromAnimal');
    },

    /**
     * Бокс с животными открылся
     * @param event
     */
    onOpenBoxFromAnimal(event){
        cc.log('открылся BoxFromAnimal');
    },

    /**
     * Создано животное
     * Отвечает за размещение животного в дереве нодов
     * @param event
     */
    onAnimalCreated(event){
        cc.log('создание нового животного');
        this._targetPuthToModel = event.detail.puthToModel;// путь до модели используется при создании модели
        event.detail.animal.parent = this.nodeFieldAnimals.parent;

        let point = this.controllerMap.getPointMap(event.detail.point);
        event.detail.animal.setPosition(point.x, point.y);

        this.boxCreateAnimal.closeBox();
        this.boxCreateAnimal.onBlock();
        this.controllerBasket.on();
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;
    },

    /**
     * Перетаскивание животного началось
     * @param event
     */
    onStartDragAndDropAnimal(event){
        cc.log('запуск анимации подвешенности (старт перетаскивания)');
        this._nodeTargetAnimal = event.detail.animal;
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;//заблокировать движение карты

    },

    /**
     * Перетаскивание нового животного
     * Отвечает за перемещение нода животного по карте после создания и производит замеры до различных объектов на карте
     * @param event
     */
    onDragAndDropAnimal(event){
        cc.log('сообщаем корзине положение зверюшки (перетаскивание)');

        let point = this.controllerMap.getPointMap(event.detail.point);
        this.controllerBasket.setPositionAnimal(point);
    },

    /**
     * Перетаскивание животного завершилось
     * @param event
     */
    onStopDragAndDropAnimal(event){
        cc.log('определение дальнейших действий с животным (завершение перетаскивание)');
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true;//разблокировать движение по карте

        let point = this.controllerMap.getPointMap(event.detail.point);

        this._nodeTargetAnimal.parent = this.nodeFieldAnimals;


        if (this.controllerBasket.isAnimalLife(point)) {
            cc.log('создаем модель животного');
            let model = this.api.createAnimal(this._targetPuthToModel);
            cc.log('надо вязать с картой и запустить жизнь в зверюшке(завершение перетаскивание)');

            this._nodeTargetAnimal.parent = this.nodeFieldAnimals;
            this._nodeTargetAnimal.setPosition(event.detail.point.x, event.detail.point.y);

            cc.log(this._nodeTargetAnimal);
            this._nodeTargetAnimal.getComponent('controller-create-animal').destroy();
            cc.log(this._nodeTargetAnimal);

            this._nodeTargetAnimal.addComponent('controller-animal');
            this._nodeTargetAnimal.getComponent('controller-animal').settings(model);
        } else {
            cc.log('надо удалить зверюшку(завершение перетаскивание)');
            this.controllerBasket.onReactionToAnimalDestroy();
            this._nodeTargetAnimal.destroy();

            cc.log('успешно удалена(завершение перетаскивание)');
        }

        cc.log('закрыть корзину(завершение перетаскивание)');
        this.controllerBasket.off();
        cc.log('снять блокировку с бокса с животными(завершение перетаскивание)');
        this.boxCreateAnimal.offBlock();

        this._nodeTargetAnimal = null;
    },

    /**
     * Начало движения животного
     * @param event
     */
    onStartMotionAnimal(event){
        cc.log('начинаю двигаться за пользователем');
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;
        this._pointTargetAnimal = cc.v2(event.detail.startMotionX, event.detail.startMotionY);

        this._nodeTargetMenuAnimal = event.detail.nodeMenu;
        this._targetControllerAnimal = event.detail.controller;
        this._targetControllerAnimal.closeMenu();
    },

    /**
     * Движение животного за ведущим
     * @param event
     */
    onMotionAnimal(event){
        //обработка событий с животным во время движения
        cc.log('двигаюсь за пользователем');
        let x = event.detail.deltaMotionX;
        let y = event.detail.deltaMotionY;
        this._pointTargetAnimal.x += x;
        this._pointTargetAnimal.y += y;

    },

    /**
     * Окончание движения животного
     * @param event
     */
    onEndMotionAnimal(event){
        cc.log('заканчиваю двигаться за пользователем');
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true;

    },

    /**
     *
     * @param event
     */
    onOpenMenuAnimal(event){
        cc.log('Открываю меню животного');
        //заполняем список характеристик считывая все из коммуникатора
        let characteristics = event.detail.model;
        this.boxCharacteristicsAnimal.openBox();//открыть бокс характеристик
        this._nodeTargetMenuAnimal = event.detail.nodeMenu;
        this._nodeTargetMenuAnimal.parent = this.nodeFieldAnimals.parent;
        let newX = event.detail.pointX - this.nodeMap.x;
        let newY = event.detail.pointY - this.nodeMap.y;
        this._nodeTargetMenuAnimal.setPosition(newX, newY);
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;

    },

    /**
     *
     * @param event
     */
    onCloseMenuAnimal(event){
        cc.log('Закрываю меню животного');
        //Отчищаем список характеристик
        this.boxCharacteristicsAnimal.closeBox();//зактрыть бокс характеристик
        this._nodeTargetMenuAnimal.parent = event.detail.nodeAnimal;
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true;
    },

    /**
     * Животное издало звук
     * @param event
     */
    onVoiceAnimal(event){
        cc.log('животное проявило голос');
    },

    /**
     * Бокс характристик животного открылся
     * @param event
     */
    onOpenBoxFromCharacteristicsAnimal(event){

        cc.log('открылся BoxFromCharacteristicsAnimal');
    },

    /**
     * Бокс характеристик животного закрылся
     * @param event
     */
    onCloseBoxFromCharacteristicsAnimal(event){
        cc.log('закрылся BoxFromCharacteristicsAnimal');
    },
});