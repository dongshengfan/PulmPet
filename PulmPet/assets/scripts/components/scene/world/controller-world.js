/**
 * Created by FIRCorp on 28.06.2017.
 */

const i18n = require('i18n');

/**
 * Главный управляющий сцены - мира
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _controllerAnimation: null,
        _controllerSounds: null,

        targetStart: cc.Node,
        targetWorld: cc.Node,
        targetTimeLabel: cc.Node,
        targetMoneyLabel: cc.Node,
        targetWrrAttainment: cc.Node,

        scrollWorld: cc.ScrollView,
    },

    onLoad() {
        this._controllerAnimation = this.node.getComponent("controller-animation");
        this._controllerSounds = this.node.getComponent("controller-sounds");

        this.node.on('touchOnWater', this.onClickWater.bind(this));
        this.node.on('Africa', this.onClickAfrica.bind(this));
        this.node.on('Evrazia', this.onClickEvrazia.bind(this));
        this.node.on('NAmerica', this.onClickNAmerica.bind(this));
        this.node.on('SAmerica', this.onClickSAmerica.bind(this));
        this.node.on('Australia', this.onClickAustralia.bind(this));

        this._isOpenBoxMenu = false;
        this._isOpenAttainment = false;
        this._isLoadContinent = false;

    },

    start(){
        this._controllerAnimation.startAnimationAdditive('openScene');
        this._controllerAnimation.startAnimationAdditive('miniClock');
        this._controllerAnimation.startAnimationAdditive('miniMoney');

        this._controllerSounds.playMusic('testWorldFon', true);
        this._controllerSounds.playEffect('testGlobalOpenScene', false);

        this.setMoney(100);
        this.setTime(3600000);
        this.setOnAttainment();
    },

//--------------------OnEvent--------------------

    /**
     * Обработчик нажатия на воду
     */
    onClickWater(){
        if (!this._isLoadContinent) {
            this._controllerSounds.stopAudio('testWorldFonAfrica');

            if (!this._controllerSounds.isCheckAudio('testWorldFon')) {
                this._controllerSounds.playMusic('testWorldFon', true);
            }

        }
    },

    /**
     * Обработчик нажатия на континент африка
     * @param event
     */
    onClickAfrica(event){
        if (!this._isLoadContinent) {
            this._controllerSounds.stopAudio('testWorldFon');

            if (!this._controllerSounds.isCheckAudio('testWorldFonAfrica')) {
                this._controllerSounds.playMusic('testWorldFonAfrica', true);
            }
            this.targetStart.x = event.detail.point.x;
            this.targetStart.y = event.detail.point.y;
            this._controllerAnimation.startAnimationAdditive('openStartBtn');
            this.targetStart.getComponent(cc.Button).clickEvents[0].customEventData = 'Africa';
        }
    },

    /**
     * Заглушка для другого материка
     * @param event
     */
    onClickEvrazia(event){
    },

    /**
     * Заглушкадля северной америки
     * @param event
     */
    onClickNAmerica(event){
    },

    /**
     * Заглушка для южной америки
     * @param event
     */
    onClickSAmerica(event){
    },

    /**
     * Заглушка для австралии
     * @param event
     */
    onClickAustralia(event){
    },

    /**
     * Обработчик закрытия и открытия боксов
     * @param event
     */
    onClickBox(event){

        this._isOpenBoxMenu = !this._isOpenBoxMenu;
        if (this._isOpenBoxMenu) {
            //Анимация открытия
            this._controllerAnimation.startAnimationAdditive('openBoxMenu');
            this._controllerSounds.playEffect('testWorldBox', false);
        } else {
            //Анимация закрытия
            this._controllerAnimation.startAnimationAdditive('closeBoxMenu');
            this._controllerSounds.playEffect('testWorldBox', false);
        }
    },

    /**
     * Запуск ареала любой части континентов
     */
    onStartAreal(event){
        //this.scrollWorld.active = false;
        this.scrollWorld.enabled = false;
        //Устанавливаем состояние контроллера в состояние загрузки континента
        this._isLoadContinent = true;
        //Подгружает локальный сторедж
        let ls = cc.sys.localStorage;
        //Исчезание кнопки
        this._controllerAnimation.startAnimationAdditive('closeStartBtn');
        //Определение типа континента или острова
        switch (this.targetStart.getComponent(cc.Button).clickEvents[0].customEventData) {
            case 'Africa' : {
                ls.setItem("nameSceneLoad", 'StartPlay');
                //Указываем список ресурсов для загрузки
                let resLoad = [
                    "resources/audio/world/testWorldFon.mp3",
                    "resources/audio/world/testWorldBtn.mp3",
                    "resources/audio/global/testGlobalOpenScene.mp3",
                ];
                let sObj = JSON.stringify(resLoad);
                ls.setItem('loadRes', sObj);
                this.zoom(event.getLocation(), 0.005);
                break;
            }
            case 'Evrazia': {
                //заглушка для примера
                break;
            }
        }
    },

    /**
     * Обработчик события нажатия на ачивку
     * @param event
     */
    onClickAttainment(event){
        this._isOpenAttainment = !this._isOpenAttainment;
        if (this._isOpenAttainment) {
            //Анимация открытия
            this._controllerAnimation.startAnimationAdditive('openAttainment');
            this.setOffAttainment();
            this._controllerSounds.stopAll();
            this._controllerSounds.playEffect('testWorldOpenAttainment', false);
            this._controllerSounds.playMusic('testWorldFonAttainment', true);
        } else {
            this._controllerSounds.stopAll();
            this._controllerSounds.playMusic('testWorldFon', true);
            //Анимация закрытия
            this._controllerAnimation.startAnimationAdditive('closeAttainment');
        }
    },

    /**
     * Обработчик нажатия на настройки
     * @param event
     */
    onClickSetting(event){

        //Запускает звук нажатия на кнопку
        this._controllerSounds.playEffect('testWorldBtn', false);
        //Подгружает локальный сторедж
        let ls = cc.sys.localStorage;
        //Устанавливаем имя следубющей сцены
        ls.setItem("nameSceneLoad", 'Setting');
        //Указываем список ресурсов для загрузки
        let resLoad = [
            "resources/audio/setting/testSettingFon.mp3",
            "resources/audio/setting/testSettingBtn.mp3",
            "resources/audio/global/testGlobalOpenScene.mp3",
            "resources/audio/setting/testSettingCheckEffect.mp3",
            "resources/audio/setting/testSettingCheckMusic.mp3",
        ];
        let sObj = JSON.stringify(resLoad);
        ls.setItem('loadRes', sObj);

        //Запускаем предзагрузочную анимацию
        this._controllerAnimation.startAnimationAdditive('closeScene');
        //Грузим сцену загрузки после проигрывания анимации
        setTimeout(() => {
            this._controllerSounds.stopAll();
            //Грузит сцену
            cc.director.loadScene("Load");
        }, this._controllerAnimation.getTime('closeScene'));
    },

    /**
     * Обработчик нажатия на коллекцию
     * @param event
     */
    onClickCollection(event){
        this._controllerSounds.playEffect('testWorldBtn', false);
    },

    /**
     * Обработчик нажатия на свободную карту
     * @param event
     */
    onClickFreePlay(event){
        this._controllerSounds.playEffect('testWorldBtn', false);
    },

    /**
     * Обработчик нажатия на билдер
     * @param event
     */
    onClickBuilder(event){
        this._controllerSounds.playEffect('testWorldBtn', false);
    },

    /**
     * Обработчик нажатия на магазин
     * @param event
     */
    onClickShop(event){
        //Запускает звук нажатия на кнопку
        this._controllerSounds.playEffect('testWorldBtn', false);
        //Подгружает локальный сторедж
        let ls = cc.sys.localStorage;
        //Устанавливаем имя следубющей сцены
        ls.setItem("nameSceneLoad", 'Shop');
        //Указываем список ресурсов для загрузки
        let resLoad = [
            "resources/audio/shop/testShopBtn.mp3",
            "resources/audio/global/testGlobalOpenScene.mp3",
        ];
        let sObj = JSON.stringify(resLoad);
        ls.setItem('loadRes', sObj);

        //Запускаем предзагрузочную анимацию
        this._controllerAnimation.startAnimationAdditive('closeScene');
        //Грузим сцену загрузки после проигрывания анимации
        setTimeout(() => {
            this._controllerSounds.stopAll();
            //Грузит сцену
            cc.director.loadScene("Load");
        }, this._controllerAnimation.getTime('closeScene'));
    },

    /**
     * Обработчик нажатия на добавление средств
     * @param event
     */
    onClickPlusMoney(event){
        this._controllerSounds.playEffect('testWorldBtn', false);
    },


    //--------------------Logic--------------------

    /**
     * Приближение к указаной точке и загружает сцену
     * @param pos {cc.Vec2} позиция назначения
     * @param speed {number} скорость процедуры
     */
    zoom(pos, speed){
        let sizeScreenX = this.node.width;
        let sizeScreenY = this.node.height;
        let centerX = sizeScreenX / 2;
        let centerY = sizeScreenY / 2;
        let smeX = Math.abs(centerX - pos.x);
        let smeY = Math.abs(centerY - pos.y);
        this._controllerAnimation.startAnimationAdditive('loadContinent');
        let callBack = function () {
            if (smeX <= 3 && smeY <= 3) {
                setTimeout(() => {
                    this._controllerSounds.stopAll();
                    //Запускаем предзагрузочную анимацию
                    this._controllerAnimation.startAnimationAdditive('closeScene');
                    //Грузим сцену загрузки после проигрывания анимации
                    setTimeout(() => {
                        //Грузит сцену
                        cc.director.loadScene("Load");
                    }, this._controllerAnimation.getTime('closeScene'));
                }, this._controllerAnimation.getTime('loadContinent'));
                this.unschedule(callBack);
            }

            if (smeX > 0) {
                if (pos.x > centerX) {
                    this.targetWorld.parent.x -= 2;
                } else if (pos.x < centerX) {
                    this.targetWorld.parent.x += 2;
                }
                smeX -= 2;
            }

            if (smeY > 0) {
                if (pos.y > centerY) {
                    this.targetWorld.y -= 2;
                } else if (pos.y < centerY) {
                    this.targetWorld.y += 2;
                }
                smeY -= 2;

            }
        };
        this.schedule(callBack, speed);

    },

    /**
     * Устанавливает количество средств
     * @param amount количество монет
     */
    setMoney(amount){
        this.targetMoneyLabel.getComponent(cc.Label).string = amount;
    },

    /**
     * Устанавливает количество времени
     * @param amount количество секунд в игре
     */
    setTime(amount){
        this.targetTimeLabel.getComponent(cc.Label).string = "";
        let m = Math.floor(amount / 60);//сколько минут
        let h = Math.floor(m / 60);//сколько часов
        let d = Math.floor(h / 24);//сколько дней
        this.targetTimeLabel.getComponent(cc.Label).string += d + ". " + (h - d * 24);
        this.targetTimeLabel.getComponent(cc.Label).string += ":" + (m - h * 60) + ":" + (amount - m * 60);
    },

    /**
     * Включает уведомление о завершенных акциях
     */
    setOnAttainment(){
        this._controllerSounds.playEffect('testWorldBtn', false);
        this._controllerAnimation.startAnimationAdditive('completeAttainment');
    },

    /**
     * Выключает уведомление о завершенных акциях
     */
    setOffAttainment(){
        this._controllerAnimation.stopAnimation('completeAttainment');
        this.targetWrrAttainment.active = false;
    },

});
