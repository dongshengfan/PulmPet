/**
 * Главный управляющий сцены - старт
 */
cc.Class({
    extends: cc.Component,

    properties: {

        _controllerAnimation: null,
        _controllerSounds: null,
        moneyAmount: cc.Label,
        starAmount: cc.Label,

        defaultVolumeEffect: 1,
        defaultVolumeMusic: 1,
    },

    onLoad () {
        this._controllerAnimation = this.node.getComponent("controller-animation");
        this._controllerSounds = this.node.getComponent("controller-sounds");
    },

    start(){
        this.setDefaultVolumeSounds();
        this.setAmountStarAndMoney(25, 2000);
        this._controllerAnimation.startAnimationAdditive('PlayedBackGround');
        this._controllerSounds.playMusic('testFon', true);
    },

    /**
     * Устанавливает значение громкости музыки по умолчанию
     */
    setDefaultVolumeSounds(){
        let ls = cc.sys.localStorage;
        let check = ls.getItem('volumeEffect');
        if (check === 'null') ls.setItem('volumeEffect', this.defaultVolumeEffect);
        check = ls.getItem('volumeMusic');
        if (check === 'null') ls.setItem('volumeMusic', this.defaultVolumeMusic);
    },

    /**
     * Устанавливает значение количества звезд и монет у игрока
     * @param star {number} количество звезд
     * @param money {number} количество монет
     */
    setAmountStarAndMoney(star, money){
        this.starAmount.string = star;
        this.moneyAmount.string = money;
    },

    /**
     * Загрузка мировой карты по нажатию на кнопку старт
     */
    loadWorld(){
        //Запускает звук нажатия на плэй
        this._controllerSounds.playEffect('testBtn', false);
        //Подгружает локальный сторедж
        let ls = cc.sys.localStorage;
        //Устанавливаем имя следубющей сцены
        ls.setItem("nameSceneLoad", 'World');
        //Указываем список ресурсов для загрузки
        let resLoad = [
            "resources/audio/AddBall.mp3",
            "resources/audio/AddBall.mp3",
            "resources/audio/AddBall.mp3",
            "resources/audio/AddBall.mp3",
            "resources/audio/AddBall.mp3",
            "resources/audio/AddBall.mp3",
            "resources/audio/AddBall.mp3",
        ];
        ls.setItem("loadRes", resLoad);
        //Запускаем предзагрузочную анимацию
        this._controllerAnimation.startAnimationAdditive('PreparationLoadStartPlay');
        //Грузим сцену загрузки после проигрывания анимации
        setTimeout(() => {
            //Останавливает проигрывание фона
            this._controllerSounds.stop('testFon');
            //Грузит сцену
            cc.director.loadScene("Load");
        }, this._controllerAnimation.getTime('PreparationLoadStartPlay'));
    },
});
