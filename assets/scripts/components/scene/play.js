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

        _nodeTargetAnimal: cc.Node,//животное в таргете
    },

    onLoad() {
        this.boxCreateAnimal = this.nodeBoxCreateAnimal.getComponent('box-create-animal-play');
        this.boxCharacteristicsAnimal = this.nodeBoxCharacteristicsAnimal.getComponent('box-characteristics-animal-play');
        this.basketAnimal = this.nodeBasketAnimal.getComponent('basket-animal');


        this.node.on('createAnimal', this.onAnimalCreated.bind(this));
        this.node.on('openBoxFromAnimal', this.onOpenBoxFromAnimal.bind(this));
        this.node.on('closeBoxFromAnimal', this.onCloseBoxFromAnimal.bind(this));
        this.node.on('openBoxFromCharacteristicsAnimal', this.onOpenBoxFromCharacteristicsAnimal.bind(this));
        this.node.on('closeBoxFromCharacteristicsAnimal', this.onCloseBoxFromCharacteristicsAnimal.bind(this));
        this.node.on('startDragAndDropAnimal', this.onStartDragAndDropAnimal.bind(this));
        this.node.on('dragAndDropAnimal', this.onDragAndDropAnimal.bind(this));
        this.node.on('stopDragAndDropAnimal', this.onStopDragAndDropAnimal.bind(this));

        this.node.on('removeAnimal', this.onRemoveAnimal.bind(this));
        this.node.on('startLifeAnimal', this.onStartLifeAnimal.bind(this));
        this.node.on('motionAnimal', this.onMotionAnimal.bind(this));
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
        event.detail.animal.parent = this.nodeFieldAnimals;
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
        this.basketAnimal.positionAnimal(point);
    },

    /**
     * Перетаскивание животного завершилось
     */
    onStopDragAndDropAnimal(event){
        cc.log('определение дальнейших действий с животным (завершение перетаскивание)');
        let point = cc.v2(event.detail.animal.x, event.detail.animal.y);
        if (this.basketAnimal.isAnimalLife(point)) {
            cc.log('надо вязать с картой и запустить жизнь в зверюшке(завершение перетаскивание)');

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
     * Удалено животное
     */
    onRemoveAnimal(event){
        //Закрыть корзину
        cc.log('животное удалено');
    },

    /**
     * Животное начинает жить
     */
    onStartLifeAnimal(event){
        //закрыть корзину произвести запускстейт машины
        cc.log('животное начинает жить');
    },

    /**
     * Движение животного за ведущим
     */
    onMotionAnimal(event){
        //обработка событийсживотным вовремядвижения
        cc.log('двигаюсь за пользователем');
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