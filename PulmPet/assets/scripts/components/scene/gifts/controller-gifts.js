/**
 * Created by FIRCorp on 11.07.2017.
 */

/**
 * Главный управляющий сцены - подарки
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _controllerAnimation: null,
        _controllerSounds: null,

    },

    onLoad () {
        this._controllerAnimation = this.node.getComponent("controller-animation");
        this._controllerSounds = this.node.getComponent("controller-sounds");
    },

    start(){

    },

    /**
     * Обработчик нажатия на сундук
     */
    onOpenChest(){
        this._controllerAnimation.startAnimationAdditive('openChest');
        this._controllerSounds.playMusic('testGiftsOpenChest', false);
    },

    /**
     * Обработчик открытия подарков
     */
    onOpenGifts(){
        this._controllerAnimation.startAnimationAdditive('openGifts');
        this._controllerSounds.playMusic('testGiftsOpenGifts', false);
    },

    /**
     * Обрабтчик сохранения подарков
     */
    onSave(){

        let ls = cc.sys.localStorage;
        this._controllerAnimation.startAnimationAdditive('saveGifts');
        this._controllerSounds.playMusic('testGiftsSaveGifts', false);
        setTimeout(() => {
            this._controllerAnimation.startAnimationAdditive('closeScene');
            setTimeout(() => {
                this._controllerSounds.stopAll();
                //Грузит сцену
                cc.director.loadScene(ls.getItem("nameSceneLoad"));
            }, this._controllerAnimation.getTime('closeScene'));
        }, this._controllerAnimation.getTime('saveGifts'));

    },

});
