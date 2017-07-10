/**
 * Created by FIRCorp on 25.06.2017.
 */

const i18n = require('i18n');

/**
 * Главный управляющий сцены - загрузки
 */
cc.Class({
    extends: cc.Component,

    properties: {
        //Прогресс бар
        progressBar: cc.ProgressBar,
        //Состояние загрузки
        progressTips: cc.Label,
        //Массив возможных заставок
        arrSprite: {
            default: [],
            type: cc.SpriteFrame
        },
        //Количество фактов в базе
        amountFacts: 0,
        //Поле для отображения фактов
        textFact: cc.Label,
        //Поле для отображени сообщения о действих
        msgComplete: cc.Label,
        //Флаг показывающий завершенность
        _isComplete: false,
        //Узел заставки
        imgLoad: cc.Node,

        _controllerAnimation: null,
        _controllerSounds: null,
    },

    onLoad() {
        this._controllerAnimation = this.node.getComponent("controller-animation");
        this._controllerSounds = this.node.getComponent("controller-sounds");
        this._textFactFind();
        this._randImg();
        this._setting();

        this.node.on(cc.Node.EventType.TOUCH_START, this.onNext, this);
    },

    start(){
        this._controllerAnimation.startAnimationAdditive('startLoad');
        this._controllerSounds.playMusic('testLoadFon', true);
        this._controllerSounds.playEffect('testGlobalOpenScene', false);
        setTimeout(() => {
            cc.loader.load(this._urls, this._progressCallback.bind(this), this._completeCallback.bind(this));
        }, this._controllerAnimation.getTime('startLoad'));
    },

    /**
     * Событие на нажатие на экран
     */
    onNext(){
        //Проверка на завершение загрузки
        if (this._isComplete) {
            this._controllerAnimation.startAnimationAdditive('endLoad');
            this._controllerSounds.playEffect('testLoadBtn', false);
            this._controllerSounds.stopAudio('testLoadFon');
            setTimeout(() => {
                let ls = cc.sys.localStorage;
                cc.director.loadScene(ls.getItem("nameSceneLoad"));
            }, this._controllerAnimation.getTime('endLoad'));
        }
    },

    /**
     * Первичная настройка
     * @private
     */
    _setting(){
        this._urls = [];
        let arr = this.getRes();
        arr.forEach((item) => {
            this._urls.push(cc.url.raw(item));
        });
        this._isComplete = false;
        this.resource = null;
        this.progressBar.progress = 0;
        this._clearAll();
        this.progressTips.textKey = i18n.t("Load/LoadBar/TextLoad");
    },

    /**
     * Выполняете поиск и выбородного из фактов в базе
     * @private
     */
    _textFactFind(){
        let number = Math.floor(Math.random() * (this.amountFacts));
        let name = "Load/LoadBar/TextFactAnimal" + (number + 1).toString();
        this.textFact.textKey = i18n.t(name);
    },

    /**
     * Выполняет выбор одной из заставок
     * @private
     */
    _randImg(){
        let number = Math.floor(Math.random() * (this.arrSprite.length));
        this.imgLoad.getComponent(cc.Sprite).spriteFrame = this.arrSprite[number];
    },

    /**
     * Формирует список ресурсов из строки в памяти.  Возвращает массив ресурсов
     * @returns {Array} массив ресурсов (музыка, картинки, анимации)
     */
    getRes(){
        let ls = cc.sys.localStorage;
        return JSON.parse(ls.getItem('loadRes'));
    },

    /**
     * Чистит урл передавая ссылки в лоадер
     * @private
     */
    _clearAll() {
        for (let i = 0; i < this._urls.length; ++i) {
            let url = this._urls[i];
            cc.loader.release(url);
        }
    },

    _progressCallback(completedCount, totalCount, res) {
        this.progress = completedCount / totalCount;
        this.resource = res;
        this.completedCount = completedCount;
        this.totalCount = totalCount;
    },

    _completeCallback(error, res) {

    },

    update(dt) {
        if (!this.resource) {
            return;
        }
        let progress = this.progressBar.progress;
        if (progress >= 1 && !this._isComplete) {
            this.msgComplete.textKey = i18n.t("Load/LoadBar/TextLoadComplete");
            this._isComplete = true;
            this._controllerAnimation.startAnimationAdditive('msgComplete');
            this._controllerSounds.playEffect('testLoadEnd', false);
            this.progressBar.node.opacity = 255;
            return;
        }
        if (progress < this.progress) {
            progress += dt;
        }
        this.progressBar.progress = progress;
        this.progressTips.textKey = "(" + this.completedCount + "/" + this.totalCount + ")";
    }
});
