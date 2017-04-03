import { APICore }from '../../build/build-ts';

const StatGame = {
    sleep: 0,
    openMenu: 1,
    openMenuAnimal: 2,
    createAnimal: 3,
    moveMap: 4,//движение карты пользователем
};

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
        nodeFieldAnimals: cc.Node,//поле жизнедеятельности животных
        nodeBoxMap: cc.Node,//бокс с картой
        nodeMap: cc.Node,//поле карты
        nodeMenu: cc.Node,//поле меню игры
        nodeMenuAnimal: cc.Node,//нод меню животного
        nodeMaskCreatedAnimal: cc.Node,//маска для создания животных

        _targetAnimal: cc.Node,//нод животного в таргете
        _pointTargetAnimal: cc.v2,//точка назначения животного в таргете
        _targetControllerAnimal: cc.Node,//контроллер животного в таргете
        _centreWindowPoint: null,//точка середины экрана
    },

    onLoad(){
        this._init();


        this.node.on('createAnimal', this.onAnimalCreated.bind(this));
        this.node.on('openBoxFromAnimal', this.onOpenBoxFromAnimal.bind(this));
        this.node.on('closeBoxFromAnimal', this.onCloseBoxFromAnimal.bind(this));
        this.node.on('openBoxMenuPlay', this.onOpenBoxMenuPlay.bind(this));
        this.node.on('closeBoxMenuPlay', this.onCloseBoxMenuPlay.bind(this));

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

        this.node.on('basketActive', this.onBasketActive.bind(this));
        this.node.on('basketSleep', this.onBasketSleep.bind(this));
        this.node.on('basketWork', this.onBasketWork.bind(this));

        this.node.on('touchOnMap', this.onTouchOnMap.bind(this));
        this.node.on('touchMoveOnMap', this.onTouchMoveOnMap.bind(this));
        this.node.on('touchEndMoveOnMap', this.onTouchEndMoveOnMap.bind(this));
        this.node.on('finishMoveCameraToAnimal', this.onFinishMoveCameraToAnimal.bind(this));
    },

    /**
     * Инициализация данных
     * @private
     */
    _init(){
        this._api = APICore.instance();

        this._stateGame = StatGame.sleep;

        this._pointTargetAnimal = cc.v2(0, 0);//точка назначения животного в таргете
        this._targetAnimal = null; //нод животного в таргете
        this._controllerAnimal = null;//контроллер животного (только 1 того что в таргете)
        this._centreWindowPoint = cc.v2(this.node.width / 2, this.node.height / 2);
        this._controllerCircularMenu = this.nodeMenuAnimal.getComponent('circular-list-actions-animal');
        this._boxCreateAnimal = this.nodeBoxCreateAnimal.getComponent('box-create-animal');
        this._boxCharacteristicsAnimal = this.nodeBoxCharacteristicsAnimal.getComponent('box-characteristics-animal');
        this._controllerBasket = this.nodeBasket.getComponent('basket-animal');
        this._controllerMap = this.nodeMap.getComponent('controller-map');

    },

    /**
     * Бокс с животными закрылся
     * @param event
     */
    onCloseBoxFromAnimal(event){

        cc.log('закрылся BoxFromAnimal');
        if (this._stateGame != StatGame.createAnimal) {
            this.nodeMaskCreatedAnimal.active = false;
        }

    },

    /**
     * Бокс с животными открылся
     * @param event
     */
    onOpenBoxFromAnimal(event){

        cc.log('открылся BoxFromAnimal');
        this.nodeMaskCreatedAnimal.active = true;//активировали маску
        this.nodeMaskCreatedAnimal.setPosition(this._centreWindowPoint);
    },

    /**
     * Меню открылось
     * @param event
     */
    onOpenBoxMenuPlay(event){

        cc.log('открылось меню');
        this.nodeMenu.active = true;
    },

    /**
     * Меню закрылось
     * @param event
     */
    onCloseBoxMenuPlay(event){

        cc.log('закрылось меню');
        this.nodeMenu.active = false;
    },

    /**
     * Создано животное
     * Отвечает за размещение животного в дереве нодов
     * @param event
     */
    onAnimalCreated(event){
        this._stateGame = StatGame.createAnimal;
        cc.log('создание нового животного');
        event.detail.animal.parent = this.nodeFieldAnimals.parent;// подцепить животное к карте
        let point = this._controllerMap.getPointMap(cc.v2(this.node.width / 2, this.node.height / 2));//вычислить координаты на карте
        event.detail.animal.setPosition(point.x, point.y);//Установить координаты животного
        this._targetPuthToModel = event.detail.puthToModel;//Сохранить путь до модели. используется при создании модели

        this._boxCreateAnimal.closeBox();//закрыть бокс с животными
        this._boxCreateAnimal.onBlock();//заблокировать бокс сживотными
        this._controllerBasket.on();//Включить корзину
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;//заблокировать карту

        //Необходимо закрыть все что связано с прошлым фокусом
        if (this._targetAnimal != null) {

            this._controllerAnimal.closeMenu();//закрывает меню
            this._boxCharacteristicsAnimal.closeBox();//закрыть бокс с характеристиками
            this._targetAnimal = null;//обнуляет ссылку на нод животного в фокусе

        }
    },

    /**
     * Перетаскивание животного началось
     * @param event
     */
    onStartDragAndDropAnimal(event){

        cc.log('запуск анимации подвешенности (старт перетаскивания)');
        this._targetAnimal = event.detail.animal;//Берем нод животного в фокус
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;//заблокировать движение карты


    },

    /**
     * Перетаскивание нового животного
     * Отвечает за перемещение нода животного по карте после создания и производит замеры до различных объектов на карте
     * @param event
     */
    onDragAndDropAnimal(event){

        cc.log('сообщаем корзине положение зверюшки (перетаскивание)');
        let point = this._controllerMap.getPointWindow(event.detail.point);
        this._controllerBasket.setPositionAnimal(point);
        this.nodeMaskCreatedAnimal.setPosition(point);
    },

    /**
     * Перетаскивание животного завершилось
     * @param event
     */
    onStopDragAndDropAnimal(event){

        cc.log('определение дальнейших действий с животным (завершение перетаскивание)');
        let point = this._controllerMap.getPointWindow(event.detail.point); //Запрашиваем точку в формате координаты окна

        if (this._controllerBasket.isAnimalLife(point)) {

            let model = this._api.createAnimal(this._targetPuthToModel, this.nodeFieldAnimals.children.length);//создаем модель животного
            let nodeModel = cc.instantiate(this._targetAnimal.children[0]);//создаем нод животного
            nodeModel.parent = this.nodeFieldAnimals;//Вешаем нод животного на нод со всеми животными
            nodeModel.setPosition(event.detail.point.x, event.detail.point.y);//Устанавливаем позицию на карте
            nodeModel.addComponent('controller-animal');//Добавляем контроллер телу животного
            nodeModel.getComponent('controller-animal').settings(model);//Настраивам контроллер животного
            this._controllerBasket.onBadWorkBasket();//Дать команду корзине(не сейчас)

        } else {
            this._controllerBasket.onGoodWorkBasket();//Дать команду корзине(работать)
        }

        this._targetAnimal.destroy();//Удалить временный нод животного
        this._controllerBasket.off();//вырубить корзину
        this._boxCreateAnimal.offBlock();//вырубить блокировку нижнего бокса
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true;//разблокировать движение карты

        this._targetAnimal = null;//обнулить  животное в таргете
        this._targetPuthToModel = null;//обнулить путь до модели животного
        this.nodeMaskCreatedAnimal.active = false;
        this._stateGame = StatGame.sleep;
    },

    /**
     * Начало движения животного
     * @param event
     */
    onStartMotionAnimal(event){

        //Закрываю меню иинформацию о животном если переключаюсь на другое животное
        if (this._targetAnimal != null && this._targetAnimal._model.id != event.detail.controller._model.id) {
            this._controllerAnimal.closeMenu();//закрыть меню
        }

        cc.log('начинаю двигаться за пользователем(Начинаю выюор двигаться или открыть меню)');
        let point = this._controllerMap.getPointMap(event.detail.startMotion);//конвертируем точку окна к точку карты

        this._pointTargetAnimal = cc.v2(point.x, point.y);// задаем точку куда надо доставить животне
        this._controllerAnimal = event.detail.controller;//получаем контроллер животного в таргете
        this._targetAnimal = event.detail.controller;//установили нод животного на фокус

        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;//заблокировать карту

    },

    /**
     * Движение животного за ведущим
     * @param event
     */
    onMotionAnimal(event){
        //обработка событий с животным во время движения
        cc.log('двигаюсь за пользователем');
        let x = event.detail.deltaMotion.x;
        let y = event.detail.deltaMotion.y;
        this._pointTargetAnimal.x += x;
        this._pointTargetAnimal.y += y;
    },

    /**
     * Окончание движения животного
     * @param event
     */
    onEndMotionAnimal(event){
        cc.log('заканчиваю двигаться за пользователем');

        let point = this._controllerMap.getPointMap(event.detail.pointEnd);// конвертируем точку окна к точке карты
        this._pointTargetAnimal = cc.v2(point.x, point.y);// вычисляем точку куда пойдет животное в итоге
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true; // Разблокировали карту

    },

    /**
     * Меню животного открыто
     * @param event
     */
    onOpenMenuAnimal(event){
        cc.log('Открываю меню животного');
        //Центрировать животное
        let point = cc.v2(this._targetAnimal.node.x - this._centreWindowPoint.x, this._targetAnimal.node.y - this._centreWindowPoint.y);

        this._controllerMap.moveActions(point, 0.25);//переместить центр камеры на эту точку за 0.25 секунды

        //Устанавливаем настройки для меню
        this._controllerCircularMenu.settings(this._controllerAnimal);

        //заполнить бокс характеристик,,,

        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;//заблокировать карту
        this._stateGame = StatGame.openMenu;
    },

    /**
     * Меню животного закрыто
     * @param event
     */
    onCloseMenuAnimal(event){

        cc.log('Закрываю меню животного');
        this.nodeMenuAnimal.active = false;
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true;//разблокировать карту
        this._boxCharacteristicsAnimal.closeBox();
        this._targetAnimal = null;
        this._stateGame = StatGame.sleep;
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

    /**
     * Корзина перешла в событие активного предвкушения
     * @param event
     */
    onBasketActive(event){

        cc.log('корзина проявляет активность');

    },

    /**
     * Корзина перешла в режим сна
     * @param event
     */
    onBasketSleep(event){

        cc.log('корзина спит');
    },

    /**
     * Корзина перешла в режим работы (Вот вот сбросят животное)
     * @param event
     */
    onBasketWork(event){

        cc.log('корзина надеется что вот вот в нее попадет животное');

    },

    /**
     * Событие начала работы с картой
     * @param event
     */
    onTouchOnMap(event){

        cc.log('Начал работу с картой');

    },

    /**
     * Событие движения карты
     * @param event
     */
    onTouchMoveOnMap(event){

        cc.log('Двигает карту');
    },

    /**
     * Событие завершения работы с картой
     * @param event
     */
    onTouchEndMoveOnMap(event){

        if (this._stateGame === StatGame.sleep) {
            cc.log('завершил работу с картой');
        }
    },

    /**
     * Наведение центра камеры на животное завершилось
     * @param event
     */
    onFinishMoveCameraToAnimal(event){

        this.nodeMenuAnimal.active = true;
        this.nodeMenuAnimal.setPosition(this._centreWindowPoint.x, this._centreWindowPoint.y);
        this._boxCharacteristicsAnimal.openBox();
    },

});