
/**
 * Опрееляет будет ли жить животное
 */
const Life = {
    yes: 1,
    no: 0
};

var FactoryAnimalPrefab = cc.Class({
    extends: cc.Component,

    properties: {
        _target: cc.Node,//цель являющаяся новым животным
        _leftPointBasketTop: cc.Vec2,//левая верхняя точка корзины животных
        _rightPointBasketBottom: cc.Vec2,//правая нижняя точка корзины животных
        _life: Life.yes,//будет ли жить

        box: cc.Node,//бокс в котором осуществляется работа   
        basket: cc.Node,//Мусокра
        content: 'window',//имя нода куда повесить новоиспеченое животное
        nameBoxComponent: 'boxHorizontalBottom',// имя бокса откуда выполняются запросы на создание
        nameBox: 'animalBox',
    },

    /**
     * Действия на страт события
     * 
     * @param {Event} event
     */
    onTouchStart(event) {
        //включаем корзину     
        this._basketOn();
        //Создаем животное       
        let pointTouch = event.touch._startPoint;
        this._createPrefab(this.puthToPrefab, pointTouch);
        //Закрываем бокс животных  
        this._closeBox(event);
    },

    /**
     * Действия на движение 
     * 
     * @param {Event} event
     */
    onTouchMove(event) {
        var delta = event.touch.getDelta();
        //движение самого нода
        this.node.x += delta.x;
        this.node.y += delta.y;
        //проверка где находимся(надкорзиной)
        this._checkPosition(event);
    },

    /**
     * Действие на завершение события 
     * 
     * @param {Event} event
     */
    onTouchEnd(event) {
        //Вырубаем корзину
        this._basketOff();
        if (this._life) {
            //оживляет животное         
            this._runLifeAnimal();
        } else {
            //Удаляет животное
            this._runDestroyAnimal();
        }
    },

    /**
     * Закрывает бокс с животными
     * 
     * @param {any} event
     */
    _closeBox(event) {
        this._box = this._getComponent(this.node, this.nameBoxComponent);
        this._box.onTouchEnd(event);
    },

    /**
     * Проверяет находится ли сейчас жовотное над корзиной или оно над картой 
     * 
     * @param {any} event
     */
    _checkPosition(event) {
        let location = event.getLocation();
        let X = location.x > this._leftPointBasketTop.x && location.x < this._rightPointBasketBottom.x;
        let Y = location.y > this._rightPointBasketBottom.y && location.y < this._leftPointBasketTop.y;
        //находимся над корзиной
        if (X && Y) {
            this._life = Life.no;
        } else {
            this._life = Life.yes;
        }
    },

    /**
     * Возвращает найденный комопнент выше в дереве с нужным названием
     * 
     * @param {cc.Node} node где искать
     * @param {cc.String} name название компонента
     * @returns component
     */
    _getComponent(node, name) {
        let component = node.getComponent(name);
        if (component != undefined) {
            return component;
        }
        return this._getComponent(node.parent, name);
    },

    /**
     * Возвращает найденный нод выше в дереве с нужным названием
     * 
     * @param {cc.Node} node где искать
     * @param {cc.String} name название компонента
     * @returns node
     */
    _getNode(node, name) {
        if (node.name === name) {
            return node;
        }
        return this._getNode(node.parent, name);
    },

    /**
     * Создает префаб в нужном контенте
     * 
     * @param {cc.String} puth путь до префаба в каталоге resource
     * @param {cc.Vec2} point точка где создать
     */
    _createPrefab(puth, point) {
        cc.loader.loadRes(puth, (err, prefab) => {
            this._target = cc.instantiate(prefab);
            let clone = cc.instantiate(this.node);
            clone.parent = this.node.parent;
            this.node.addChild(this._target);
            let content = this._getNode(this.node, this.content);
            this.node.parent = content;
            this.node.position = cc.v2(point.x, point.y);
            this._target.position = cc.v2(0, 0);
        });
    },

    /**
     * Открытие корзины
     */
    _basketOn() {
        this.basket.getComponent('controllerBasket').on();
        //расчитываем размер корзины и положение в мировых координатах        
        this._leftPointBasketTop = cc.v2(this.basket.x - this.basket.width, this.basket.y + this.basket.height);
        this._rightPointBasketBottom = cc.v2(this.basket.x + this.basket.width, this.basket.y - this.basket.height);
    },

    /**
     * Закрытие корзины
     */
    _basketOff() {
        this.basket.getComponent('controllerBasket').off();
    },

    /**
     * Запуск процесса удаления животного
     */
    _runDestroyAnimal() {
        this.basket.getComponent('controllerBasket').onReactionToAnimal();
        this._target.destroy();
        this.node.destroy();
    },

    /**
     * Запуск процесса оживления животного
     */
    _runLifeAnimal() {
        let pos = cc.v2(this.node.x, this.node.y);
        let content = this._getNode(this.node, this.content);
        this._target.parent = content;
        this._target.position = cc.v2(pos.x, pos.y);
        this._target.getComponent('controllerAnimal').create(this.getJson());
        this.node.destroy();
    },

    /**
     * Первоначальная настройка фабрики
     */
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },

});

export { FactoryAnimalPrefab, Life };