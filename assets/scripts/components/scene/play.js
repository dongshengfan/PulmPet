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
        nodeBasketAnimal: cc.Node,//корзина для удаления животного
        nodeFieldAnimals: cc.Node,//поле жизнедеятельности животного
        nodeBoxMap: cc.Node,//бокс с картой
        nodeMap: cc.Node,//поле карты
        _nodeTargetAnimal: cc.Node,//животное в таргете
        _pointTargetAnimal: cc.v2,//точка назначения животного в таргете
    },

    onLoad(){
        this.api = APICore.instance();


        cc.log(this.api);
        this._pointTargetAnimal = cc.v2(0, 0);//точка назначения животного в таргете

        this.boxCreateAnimal = this.nodeBoxCreateAnimal.getComponent('box-create-animal-play');
        this.boxCharacteristicsAnimal = this.nodeBoxCharacteristicsAnimal.getComponent('box-characteristics-animal-play');
        this.basketAnimal = this.nodeBasketAnimal.getComponent('basket-animal');
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
     */
    onCloseBoxFromAnimal(event){
        cc.log('закрылся BoxFromAnimal');
    },

    /**
     * Бокс с животными открылся
     */
    onOpenBoxFromAnimal(event){
        cc.log('открылся BoxFromAnimal');
    },

    /**
     * Создано животное
     * Отвечает за размещение животного в дереве нодов
     */
    onAnimalCreated(event){
        //Включить корзину и закрыть бокс с животными
        cc.log('создание нового животного');
        this._targetPuthToModel = event.detail.puthToModel;
        event.detail.animal.parent = this.nodeFieldAnimals.parent;
        event.detail.animal.setPosition(event.detail.point);
        this.boxCreateAnimal.closeBox();
        this.boxCreateAnimal.onBlock();
        this.basketAnimal.on();

    },

    /**
     * Перетаскивание животного началось
     */
    onStartDragAndDropAnimal(event){
        cc.log('запуск анимации подвешенности (старт перетаскивания)');
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;
    },

    /**
     * Перетаскивание нового животного
     * Отвечает за перемещение нода животного по карте после создания и производит замеры до различных объектов на карте
     * @param x
     * @param y
     */
    onDragAndDropAnimal(event){
        cc.log('сообщаем корзине положение зверюшки (перетаскивание)');
        let point = cc.v2(event.detail.animal.x, event.detail.animal.y);
        this.basketAnimal.isAnimalLife(point);
    },

    /**
     * Перетаскивание животного завершилось
     */
    onStopDragAndDropAnimal(event){
        cc.log('определение дальнейших действий с животным (завершение перетаскивание)');
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true;
        event.detail.animal.parent = this.nodeFieldAnimals;
        let point = cc.v2(event.detail.animal.x, event.detail.animal.y);
        if (this.basketAnimal.isAnimalLife(point)) {
            cc.log('создаем модель животного');
            let model = this.api.createAnimal(event.detail.puthToModel);
            cc.log('надо вязать с картой и запустить жизнь в зверюшке(завершение перетаскивание)');
            this._nodeTargetAnimal = event.detail.animal.children[0];
            this._nodeTargetAnimal.parent = this.nodeFieldAnimals;
            this._nodeTargetAnimal.setPosition(event.detail.animal.x, event.detail.animal.y);
            this._nodeTargetAnimal.addComponent('controller-animal');
            this._nodeTargetAnimal.getComponent('controller-animal').settings(model);
            //Необходимо куда-то добавить животное и как-то запустить  пробросить в контроллер модель животного
            event.detail.animal.destroy();
        } else {
            cc.log('надо удалить зверюшку(завершение перетаскивание)');
            event.detail.animal.destroy();
            cc.log('успешно удалена(завершение перетаскивание)');
        }
        cc.log('закрыть корзину(завершение перетаскивание)');
        this.basketAnimal.off();
        cc.log('снять блокировку с бокса с животными(завершение перетаскивание)');
        this.boxCreateAnimal.offBlock();
    },

    /**
     * Начало движения животного
     * @param event
     */
    onStartMotionAnimal(event){
        cc.log('начинаю двигаться за пользователем');
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;
        this._pointTargetAnimal = cc.v2(event.detail.startMotionX, event.detail.startMotionY);
    },

    /**
     * Движение животного за ведущим
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
        this.boxCharacteristicsAnimal.openBox();
    },

    /**
     *
     * @param event
     */
    onCloseMenuAnimal(event){
        cc.log('Закрываю меню животного');
        //Отчищаем список характеристик
        this.boxCharacteristicsAnimal.closeBox();
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
     */
    onOpenBoxFromCharacteristicsAnimal(event){

        cc.log('открылся BoxFromCharacteristicsAnimal');
    },

    /**
     * Бокс характеристик животного закрылся
     */
    onCloseBoxFromCharacteristicsAnimal(event){
        cc.log('закрылся BoxFromCharacteristicsAnimal');
    },
});