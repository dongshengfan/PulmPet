/**
 * Created by FIRCorp on 08.07.2017.
 */
/**
 * Главный управляющий сцены - настройки
 */
cc.Class({
    extends: cc.Component,

    properties: {

        _controllerAnimation: null,
        _controllerSounds: null,

        targetSliderEffect: cc.Node,
        targetSliderMusic: cc.Node,
        targetValueEffect: cc.Label,
        targerValueMusic: cc.Label,
    },

    onLoad () {
        this._controllerAnimation = this.node.getComponent("controller-animation");
        this._controllerSounds = this.node.getComponent("controller-sounds");
    },

    start(){
        this._controllerAnimation.startAnimationAdditive('openScene');
        this._controllerSounds.playMusic('testSettingFon', true);

        this.settingSlider();
    },

    /**
     * Настройка слайдеров. Вытаскивают и памяти текущие настройки и устанавливаются в них.
     */
    settingSlider(){
        let ls = cc.sys.localStorage;
        let current = ls.getItem('volumeEffect');
        this.targetSliderEffect.getComponent(cc.Slider).progress = current;
        this.targetValueEffect.string = this.getValue(current, 2) + '%';
        current = ls.getItem('volumeMusic');
        this.targetSliderMusic.getComponent(cc.Slider).progress = current;
        this.targerValueMusic.string = this.getValue(current, 2) + '%';
    },

    /**
     * Возвращет округленное значение
     * @param number {number} необходимо округлить
     * @param amount {number} количество нулей до запятой
     * @returns {number} результат
     */
    getValue(number, amount){
        return Math.floor(number * Math.pow(10, amount));
    },

    /**
     * Обрабатывает событие нажатия накнопку назад
     */
    onBack(){
        this._controllerSounds.playEffect('testSettingBtn', false);
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
        }, this._controllerAnimation.getTime('closeScene'));
    },

    /**
     * Обрабатывает событие на изменение слайдера эффектов
     * @param event
     */
    onSliderEffect(event){
        let ls = cc.sys.localStorage;
        ls.setItem('volumeEffect', event.progress);
        this._controllerSounds.playEffect('testSettingCheckEffect', false);
        this.targetValueEffect.string = this.getValue(event.progress, 2) + '%';
    },

    /**
     * Обрабатывает событие на изменение слайдера музыки
     * @param event
     */
    onSliderMusic(event){
        this._controllerSounds.pauseAudio('testSettingFon');
        let ls = cc.sys.localStorage;
        ls.setItem('volumeMusic', event.progress);
        setTimeout(() => {
            this._controllerSounds.resumeMusic('testSettingFon');
        }, 100);
        this.targerValueMusic.string = this.getValue(event.progress, 2) + '%';
    },

    /**
     * Обрабатывает событие на нажатие кнопки авторов
     */
    onAuthors(){
        this._controllerSounds.playEffect('testSettingBtn', false);
    },

    /**
     * Обрабатывает событие на нажатие кнопки ссылки
     */
    onLinks(){
        this._controllerSounds.playEffect('testSettingBtn', false);
    },
});
