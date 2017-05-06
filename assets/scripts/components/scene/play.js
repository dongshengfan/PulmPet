/**
 * Состояние игры.
 * @type {StatGame}
 * @static
 * @element {number} sleep бездействие.
 * @element {number} openMenu открытие меню игры.
 * @element {number} openMenuAnimal открытие меню животного.
 * @element {number} createAnimal создание животного.
 * @element {number} moveMap движение карты пользователем.
 */
const StatGame = {
    sleep: 0,
    openMenu: 1,
    openMenuAnimal: 2,
    createAnimal: 3,
    moveMap: 4,
};

/**
 * Управляет представлнием.
 * @class Play
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

        prefabParametrCharacteristics: cc.Prefab,//префаб характеристики

        colorTextCharacteristics: cc.Color,//цвет текста у характеристик

        _targetAnimal: cc.Node,//нод животного в таргете
        _pointTargetAnimal: cc.v2,//точка назначения животного в таргете
        _targetControllerAnimal: cc.Node,//контроллер животного в таргете
        _centreWindowPoint: null,//точка середины экрана
    },

    /**
     * Инициализация конроллера представления.
     * @method onLoad
     */
    onLoad(){
        this._init();
       //cd this.p=new Promise((a,b)=>{});
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
        this.node.on('sitAnimal', this.onSitAnimal.bind(this));//сидеть
        this.node.on('frightenAnimal', this.onFrightenAnimal.bind(this));//напугать
        this.node.on('arealAnimal', this.onArealAnimal.bind(this));//показать ареал
        this.node.on('careAnimal', this.onCareAnimal.bind(this));//Забота, гладить
        this.node.on('lieAnimal', this.onLieAnimal.bind(this));//Лежать,лечь
        this.node.on('attentionAnimal', this.onAttentionAnimal.bind(this));//Внимание, готовсь

        this.node.on('basketActive', this.onBasketActive.bind(this));
        this.node.on('basketSleep', this.onBasketSleep.bind(this));
        this.node.on('basketWork', this.onBasketWork.bind(this));

        this.node.on('touchOnMap', this.onTouchOnMap.bind(this));
        this.node.on('touchMoveOnMap', this.onTouchMoveOnMap.bind(this));
        this.node.on('touchEndMoveOnMap', this.onTouchEndMoveOnMap.bind(this));
        this.node.on('finishMoveCameraToAnimal', this.onFinishMoveCameraToAnimal.bind(this));
    },

    /**
     * Инициализация данных.
     * @method _init
     * @private
     */
    _init(){


        this._stateGame = StatGame.sleep;

        this._targetSizeWith = 0;//временные размеры ширины животного в таргете. Для сохранения
        this._targetSizeHeight = 0;//временные размеры высоты животного в таргете. Для сохранения

        this._pointTargetAnimal = cc.v2(0, 0);//точка назначения животного в таргет
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
     * Бокс с животными закрылся.
     * @method onCloseBoxFromAnimal
     * @param {cc.Event} event
     */
    onCloseBoxFromAnimal(event){

        cc.log('закрылся BoxFromAnimal');
        if (this._stateGame != StatGame.createAnimal) {
            this.nodeMaskCreatedAnimal.active = false;
        }

    },

    /**
     * Бокс с животными открылся.
     * @method onOpenBoxFromAnimal
     * @param {cc.Event} event
     */
    onOpenBoxFromAnimal(event){

        cc.log('открылся BoxFromAnimal');
        this.nodeMaskCreatedAnimal.active = true;//активировали маску
        this.nodeMaskCreatedAnimal.setPosition(this._centreWindowPoint);
        if (this._controllerAnimal !== null) this._controllerAnimal.closeMenu();

    },

    /**
     * Меню открылось.
     * @method onOpenBoxMenuPlay
     * @param {cc.Event} event
     */
    onOpenBoxMenuPlay(event){

        cc.log('открылось меню');
        this.nodeMenu.active = true;
    },

    /**
     * Меню закрылось.
     * @method onCloseBoxMenuPlay
     * @param {cc.Event} event
     */
    onCloseBoxMenuPlay(event){

        cc.log('закрылось меню');
        this.nodeMenu.active = false;
    },

    /**
     * Создание животного.
     * Отвечает за размещение животного в дереве нодов.
     * @method onAnimalCreated
     * @param {cc.Event} event
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
     * Перетаскивание животного началось.
     * @method onStartDragAndDropAnimal
     * @param {cc.Event} event
     */
    onStartDragAndDropAnimal(event){

        cc.log('запуск анимации подвешенности (старт перетаскивания)');
        this._targetAnimal = event.detail.animal;//Берем нод животного в фокус
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false;//заблокировать движение карты


    },

    /**
     * Перетаскивание нового животного.
     * Отвечает за перемещение нода животного по карте после создания и производит замеры до различных объектов на карте.
     * @method onDragAndDropAnimal
     * @param {cc.Event} event
     */
    onDragAndDropAnimal(event){

        cc.log('сообщаем корзине положение зверюшки (перетаскивание)');
        let point = this._controllerMap.getPointWindow(event.detail.point);
        this._controllerBasket.setPositionAnimal(point);
        this.nodeMaskCreatedAnimal.setPosition(point);
    },

    /**
     * Перетаскивание животного завершилось.
     * @method onStopDragAndDropAnimal
     * @param {cc.Event} event
     */
    onStopDragAndDropAnimal(event){

        cc.log('определение дальнейших действий с животным (завершение перетаскивание)');
        let point = this._controllerMap.getPointWindow(event.detail.point); //Запрашиваем точку в формате координаты окна

        if (this._controllerBasket.isAnimalLife(point)) {


            let nodeModel = cc.instantiate(this._targetAnimal.children[0]);//создаем нод животного
            nodeModel.parent = this.nodeFieldAnimals;//Вешаем нод животного на нод со всеми животными
            nodeModel.setPosition(event.detail.point.x, event.detail.point.y);//Устанавливаем позицию на карте
            nodeModel.addComponent('controller-animal');//Добавляем контроллер телу животного
            nodeModel.getComponent('controller-animal').settings({
                puthToModel:this._targetPuthToModel,
                id:this.nodeFieldAnimals.children.length-1
            });//Настраивам контроллер животного
            nodeModel.getComponent('controller-animal').run();//Запускает жизнь животного
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
     * Начало движения животного.
     * @method onStartMotionAnimal
     * @param {cc.Event} event
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

        //увеличим поле отклика животного
        this._targetSizeWith = this._targetAnimal.node.width;
        this._targetSizeHeight = this._targetAnimal.node.height;
    },

    /**
     * Движение животного за ведущим.
     * @method onMotionAnimal
     * @param {cc.Event} event
     */
    onMotionAnimal(event){
        //обработка событий с животным во время движения
        cc.log('двигаюсь за пользователем');
        //увеличим поле отклика животного
        this._targetAnimal.node.width = 2000;
        this._targetAnimal.node.height = 2000;
        let point = this._controllerMap.getPointMap(event.detail.pointEnd);// конвертируем точку окна к точке карты
        this._pointTargetAnimal = cc.v2(point.x, point.y);// вычисляем точку куда пойдет животное в итоге
        this._targetAnimal.moveToPoint(this._pointTargetAnimal);
    },

    /**
     * Окончание движения животного.
     * @method onEndMotionAnimal
     * @param {cc.Event} event
     */
    onEndMotionAnimal(event){
        cc.log('заканчиваю двигаться за пользователем');

        //уменьшаем площадь покрытия животного
        this._targetAnimal.node.width = this._targetSizeWith;
        this._targetAnimal.node.height = this._targetSizeHeight;

        let point = this._controllerMap.getPointMap(event.detail.pointEnd);// конвертируем точку окна к точке карты
        this._pointTargetAnimal = cc.v2(point.x, point.y);// вычисляем точку куда пойдет животное в итоге
        //сообщаем модели точку до которой необходимо ей дойти
        this._targetAnimal.moveToPoint(this._pointTargetAnimal);
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true; // Разблокировали карту
    },

    /**
     * Меню животного открыто.
     * @method onOpenMenuAnimal
     * @param {cc.Event} event
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
     * Меню животного закрыто.
     * @method onCloseMenuAnimal
     * @param {cc.Event} event
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
     * Животное издало звук.
     * @method onVoiceAnimal
     * @param {cc.Event} event
     */
    onVoiceAnimal(event){
        cc.log('животное проявило голос');
        this._controllerAnimal.runVoice();
        this._controllerAnimal.closeMenu();
    },

    /**
     * Животное село
     * @method onSitAnimal
     * @param {cc.Event} event
     */
    onSitAnimal(event){
        cc.log('животное село');
        this._controllerAnimal.runSit();
        this._controllerAnimal.closeMenu();
    },

    /**
     * Животное испугалось
     * @method onFrightenAnimal
     * @param {cc.Event} event
     */
    onFrightenAnimal(event){
        cc.log('животное испугалось');
        this._controllerAnimal.runFrighten();
        this._controllerAnimal.closeMenu();
    },

    /**
     * ареалы чувств
     * @method onArealAnimal
     * @param {cc.Event} event
     */
    onArealAnimal(event){
        cc.log('животное показало свой ареал');
        this._controllerAnimal.runAreal();
        this._controllerAnimal.closeMenu();
    },

    /**
     * Животное погладили,пожалели
     * @method onCareAnimal
     * @param {cc.Event} event
     */
    onCareAnimal(event){
        cc.log('животное погладили');
        this._controllerAnimal.runCare();
        this._controllerAnimal.closeMenu();
    },

    /**
     * Животное легло
     * @method onLieAnimal
     * @param {cc.Event} event
     */
    onLieAnimal(event){
        cc.log('животное легло');
        this._controllerAnimal.runLie();
        this._controllerAnimal.closeMenu();
    },

    /**
     * Животное приготовилось
     * @method onAttentionAnimal
     * @param {cc.Event} event
     */
    onAttentionAnimal(event){
        cc.log('животное приготовилось');
        this._controllerAnimal.runAttention();
        this._controllerAnimal.closeMenu();
    },

    /**
     * Бокс характристик животного открылся.
     * @method onOpenBoxFromCharacteristicsAnimal
     * @param {cc.Event} event
     */
    onOpenBoxFromCharacteristicsAnimal(event){

        cc.log('открылся BoxFromCharacteristicsAnimal');
        this._boxCreateAnimal.closeBox();
        //заполняет характеристики
        let mass = this._controllerAnimal.getCharacteristics();
        let content = this._boxCharacteristicsAnimal.content;

        let nodeParam;
        //чистим предыдущие записи
        content.children.forEach((item) => {
            item.destroy();
        });

        //Начинаем заполнение
        nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
        nodeParam.removeAllChildren();
        nodeParam.addComponent(cc.Label).string = mass.name;
        nodeParam.color = this.colorTextCharacteristics;
        content.addChild(nodeParam);

        nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
        nodeParam.removeAllChildren();
        nodeParam.addComponent(cc.Label).string = mass.currentState;
        nodeParam.color = this.colorTextCharacteristics;
        content.addChild(nodeParam);

        let vr;//временная переменная узлов
        //заполняем характеристики
        if (mass.param.length != 0) {
            for (let i = 0; i < mass.param.length; i++) {
                nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
                content.addChild(nodeParam);
                nodeParam.x = 0;
                vr = nodeParam.getChildByName('name');
                vr.getComponent(cc.Label).string = mass.param[i].name;
                vr.color = this.colorTextCharacteristics;
                vr = nodeParam.getChildByName('value');
                vr.getComponent(cc.Label).string = mass.param[i].value.toString() + mass.param[i].unit;
                vr.color = this.colorTextCharacteristics;
            }
        }
    },

    /**
     * Бокс характеристик животного закрылся.
     * @method onCloseBoxFromCharacteristicsAnimal
     * @param {cc.Event} event
     */
    onCloseBoxFromCharacteristicsAnimal(event){

        cc.log('закрылся BoxFromCharacteristicsAnimal');

    },

    /**
     * Корзина перешла в событие активного предвкушения.
     * @method onBasketActive
     * @param {cc.Event} event
     */
    onBasketActive(event){

        cc.log('корзина проявляет активность');

    },

    /**
     * Корзина перешла в режим сна.
     * @method onBasketSleep
     * @param {cc.Event} event
     */
    onBasketSleep(event){

        cc.log('корзина спит');
    },

    /**
     * Корзина перешла в режим работы (Вот вот сбросят животное).
     * @method onBasketWork
     * @param {cc.Event} event
     */
    onBasketWork(event){

        cc.log('корзина надеется что вот вот в нее попадет животное');

    },

    /**
     * Событие начала работы с картой.
     * @method onTouchOnMap
     * @param {cc.Event} event
     */
    onTouchOnMap(event){

        cc.log('Начал работу с картой');

    },

    /**
     * Событие движения карты.
     * @method onTouchMoveOnMap
     * @param {cc.Event} event
     */
    onTouchMoveOnMap(event){

        cc.log('Двигает карту');
    },

    /**
     * Событие завершения работы с картой.
     * @method onTouchEndMoveOnMap
     * @param {cc.Event} event
     */
    onTouchEndMoveOnMap(event){

        if (this._stateGame === StatGame.sleep) {
            cc.log('завершил работу с картой');
        }
    },

    /**
     * Наведение центра камеры на животное завершилось.
     * @method onFinishMoveCameraToAnimal
     * @param {cc.Event} event
     */
    onFinishMoveCameraToAnimal(event){
        this.nodeMenuAnimal.active = true;
        this.nodeMenuAnimal.setPosition(this._centreWindowPoint.x, this._centreWindowPoint.y);
        this._boxCharacteristicsAnimal.openBox();
    },

});