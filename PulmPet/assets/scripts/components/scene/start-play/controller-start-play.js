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
        //Запуск анимации фона

        this._controllerSounds.playMusic('testStartPlayFon', true);
        this._controllerAnimation.startAnimationAdditive('openScene');
        this._controllerAnimation.startAnimationAdditive('playedBackGround');
        this._controllerSounds.playEffect('testGlobalOpenScene', false);
        this._controllerAnimation.startAnimationAdditive('rotationStar');
        this._controllerAnimation.startAnimationAdditive('rotationMoney');
        //После анимации старт сцены
        setTimeout(() => {
                this._controllerAnimation.startAnimationAdditive('emergeneceAсhievements');
                this._controllerSounds.playEffect('testStartPlayOpenAchivements', false);
            },
            this._controllerAnimation.getTime('openScene')
        )
        ;
    },

    /**
     * Устанавливает значение громкости музыки по умолчанию
     */
    setDefaultVolumeSounds(){
        let ls = cc.sys.localStorage;
        let check = ls.getItem('volumeEffect');
        if (!check) ls.setItem('volumeEffect', this.defaultVolumeEffect);
        check = ls.getItem('volumeMusic');
        if (!check) ls.setItem('volumeMusic', this.defaultVolumeMusic);
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
     * Событие на нажатие по левым кустам
     */
    onClickLeftLeavesSwaying(){
        this._controllerAnimation.startAnimationAdditive('leavesSwayingLeft');
        this._controllerSounds.playEffect('testStartPlayLeft', false);
    },

    /**
     * События на нажатия по правым кустам
     */
    onClickRightLeavesSwaying(){
        this._controllerAnimation.startAnimationAdditive('leavesSwayingRight');
        this._controllerSounds.playEffect('testStartPlayRight', false);
    },

    /**
     * Загрузка мировой карты по нажатию на кнопку старт
     */
    loadWorld(){
        //Запускает звук нажатия на плэй
        this._controllerSounds.playEffect('testStartPlayBtn', false);
        //Подгружает локальный сторедж
        let ls = cc.sys.localStorage;
        //Устанавливаем имя следубющей сцены
        ls.setItem("nameSceneLoad", 'World');
        //Указываем список ресурсов для загрузки
        let resLoad = [
            "resources/audio/world/testWorldFon.mp3",
            "resources/audio/world/testWorldBtn.mp3",
            "resources/audio/global/testGlobalOpenScene.mp3",
            "resources/audio/world/testWorldFonAfrica.mp3",
            "resources/audio/world/testWorldFonAttainment.mp3",
            "resources/audio/world/testWorldOpenAttainment.mp3",
            "resources/audio/world/testWorldBox.mp3",
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
            },
            this._controllerAnimation.getTime('closeScene')
        )
        ;
    },
});
