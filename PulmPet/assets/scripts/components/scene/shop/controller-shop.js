/**
 * Created by FIRCorp on 10.07.2017.
 */
/**
 * Тип сундуков
 * @type {{wood: number, iron: number, silver: number, gold: number, crystal: number}}
 */
const TypeChest = {
    wood: 0,
    iron: 1,
    silver: 2,
    gold: 3,
    crystal: 4,
};

/**
 * Главный управляющий сцены - магазин
 */
cc.Class({
    extends: cc.Component,

    properties: {

        _controllerAnimation: null,
        _controllerSounds: null,

        targetPageView: cc.Node,
        targetValueMoneyChestWood: cc.Label,
        targetValueMoneyChestIron: cc.Label,
        targetValueMoneyChestSilver: cc.Label,
        targetValueMoneyChestGold: cc.Label,
        targetValueMoneyChestCrystal: cc.Label,

        targetMoneyUser: cc.Label,
    },

    onLoad () {
        this._controllerAnimation = this.node.getComponent("controller-animation");
        this._controllerSounds = this.node.getComponent("controller-sounds");
    },

    start(){
        this.settingChest();
        this.onLeftSwipePage();//настройка первичного положения сундука при запуске сцены

        this._controllerAnimation.startAnimationAdditive('openScene');
        this._controllerAnimation.startAnimationAdditive('rotationCoins');
        this._controllerSounds.playMusic('testShopFon', true);
        this._controllerSounds.playEffect('testGlobalOpenScene', false);

        this.setValueChestWood(100);
        this.setValueChestCrystal(10000);
        this.setValueChestIron(500);
        this.setValueChestSilver(1000);
        this.setValueChestGold(5000);
        this.setMoneyUser(2000);
    },

    /**
     * Настраивает индексы сундуков
     */
    settingChest(){
        let matrixChest = this.targetPageView.getComponents(cc.PageView)[0].content.children;

        let index = matrixChest.indexOf(this.targetValueMoneyChestWood.node.parent.parent);
        if (TypeChest.wood != index) {
            this.swap(matrixChest, TypeChest.wood, index);
        }

        index = matrixChest.indexOf(this.targetValueMoneyChestIron.node.parent.parent);
        if (TypeChest.iron != index) {
            this.swap(matrixChest, TypeChest.iron, index);
        }

        index = matrixChest.indexOf(this.targetValueMoneyChestSilver.node.parent.parent);
        if (TypeChest.silver != index) {
            this.swap(matrixChest, TypeChest.silver, index);
        }

        index = matrixChest.indexOf(this.targetValueMoneyChestGold.node.parent.parent);
        if (TypeChest.gold != index) {
            this.swap(matrixChest, TypeChest.gold, index);
        }

        index = matrixChest.indexOf(this.targetValueMoneyChestCrystal.node.parent.parent);
        if (TypeChest.crystal != index) {
            this.swap(matrixChest, TypeChest.crystal, index);
        }
    },

    /**
     * Меняет местами элементы в массиве
     * @param matrix массив
     * @param index1 индекс первого
     * @param index2 индекс второго
     */
    swap(matrix, index1, index2){
        let vr = matrix[index1];
        matrix[index1] = matrix[index2];
        matrix[index2] = vr;
    },

    /**
     * Обработчик нажатия на кнопку вернуться назад
     */
    onBack(){

        this._controllerSounds.playEffect('testShopBtn', false);
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
     * Обработчик нажатия на кнопку прокрутить влево
     */
    onLeftSwipePage(){
        this._controllerSounds.playEffect('testShopBtn', false);
        let page = this.targetPageView.getComponents(cc.PageView)[0];
        let index = page.getCurrentPageIndex();
        index -= 1;
        index = index >= 0 ? index : 0;
        page.scrollToPage(index, true);
    },

    /**
     * Обработчик нажатия на кнопку прокрутить вправо
     */
    onRightSwipePage(){
        this._controllerSounds.playEffect('testShopBtn', false);
        let page = this.targetPageView.getComponents(cc.PageView)[0];
        let lang = page.content.children.length;
        let index = page.getCurrentPageIndex();
        index += 1;
        index = index >= lang ? lang - 1 : index;
        page.scrollToPage(index, true);
    },

    /**
     * Обработчик события на нажатие кнопки купить вещь
     */
    onPay(){
        //Проверяем средства на счете и если позволяют то пукупаем товар
        if (this.isCheckMoney()) {
            let ls = cc.sys.localStorage;
            //Устанавливаем имя сцены на которую вернуться после вручения
            ls.setItem("nameSceneLoad", 'Shop');

            //Звук покупки
            this._controllerSounds.playEffect('testShopPay', false);
            //Запускаем предпокупочную анимацию
            this._controllerAnimation.startAnimationAdditive('preparationGifts');
            //Грузим сцену подарков после проигрывания анимации
            setTimeout(() => {
                this._controllerSounds.stopAll();
                //Грузит сцену
                cc.director.loadScene("Gifts");
            }, this._controllerAnimation.getTime('preparationGifts'));
        } else {
            //Звук неудачи
            this._controllerSounds.playEffect('testShopNotPay', false);
        }
    },

    /**
     * Обработчик события на нажатие кнопки пополнить средства пользователя
     */
    onAddMoney(){
        this._controllerSounds.playEffect('testShopBtn', false);
        //Добавляет средства
    },

    /**
     * Проверяет может ли купить пользователь данный товар
     * @returns {boolean}
     */
    isCheckMoney(){
        let page = this.targetPageView.getComponents(cc.PageView)[0];
        let type = page.getCurrentPageIndex();
        let moneyUser = this.getMoneyUser();
        let moneyChest = this.getValueMoneyChest(type);
        if (moneyChest < moneyUser) {
            moneyUser -= moneyChest;
            this.setMoneyUser(moneyUser);
            return true;
        } else {
            return false;
        }
    },

    /**
     * Возвращает стоимость сундука по индексу
     * @param {number} indexPage  индекс страницы
     * @return {number} стоимость
     */
    getValueMoneyChest(indexPage){
        switch (indexPage) {
            case TypeChest.wood: {
                return this.getValueChestWood();
            }
            case TypeChest.iron: {
                return this.getValueChestIron();
            }
            case TypeChest.silver: {
                return this.getValueChestSilver();
            }
            case TypeChest.gold: {
                return this.getValueChestGold();
            }
            case TypeChest.crystal: {
                return this.getValueChestCrystal();
            }
            default : {
                throw new Error('Not found type chest...');
            }
        }
    },

    /**
     * Устанавливает стоимость для кристального сундука
     * @param {number} value стоимость
     */
    setValueChestCrystal(value){
        this.targetValueMoneyChestCrystal.string = value;
    },

    /**
     * Возвращает стоимость кристалического сундука
     * @returns {Number}
     */
    getValueChestCrystal(){
        return parseInt(this.targetValueMoneyChestCrystal.string, 10);
    },

    /**
     * Устанавливает стоимость для золотого сундука
     * @param {number} value стоимость
     */
    setValueChestGold(value){
        this.targetValueMoneyChestGold.string = value;
    },

    /**
     * Возвращает стоимость золотого сундука
     * @returns {Number}
     */
    getValueChestGold(){
        return parseInt(this.targetValueMoneyChestGold.string, 10);
    },

    /**
     * Устанавливает стоимость для серебряного сундука
     * @param {number} value стоимость
     */
    setValueChestSilver(value){
        this.targetValueMoneyChestSilver.string = value;
    },

    /**
     * Возвращает стоимость серебряного сундука
     * @returns {Number}
     */
    getValueChestSilver(){
        return parseInt(this.targetValueMoneyChestSilver.string, 10);
    },

    /**
     * Устанавливает стоимость для железного сундука
     * @param {number} value стоимость
     */
    setValueChestIron(value){
        this.targetValueMoneyChestIron.string = value;
    },

    /**
     * Возвращает стоимость железного сундука
     * @returns {Number}
     */
    getValueChestIron(){
        return parseInt(this.targetValueMoneyChestIron.string, 10);
    },

    /**
     * Устанавливает стоимость для деревянного сундука
     * @param {number} value стоимость
     */
    setValueChestWood(value){
        this.targetValueMoneyChestWood.string = value;
    },

    /**
     * Возвращает стоимость деревянного сундука
     * @returns {Number}
     */
    getValueChestWood(){
        return parseInt(this.targetValueMoneyChestWood.string, 10);
    },

    /**
     * Устанавливает монеты пользователя
     * @param {number} value количество
     */
    setMoneyUser(value){
        this.targetMoneyUser.string = value;
    },

    /**
     * Возвращает количество монет у пользователя
     * @returns {Number}
     */
    getMoneyUser(){
        return parseInt(this.targetMoneyUser.string, 10);
    },
});
