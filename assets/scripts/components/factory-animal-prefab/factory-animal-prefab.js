var FactoryAnimalPrefab = cc.Class({
    extends: cc.Component,

    properties: {
        _targetAnimal: cc.Node,
    },

    /**
     * Действия на старт события
     * @param {Event} event
     */
    createAnimal(event) {
        let pointTouch = event.touch._startPoint;
        this._createPrefab(this.puthToPrefab, pointTouch);
    },

    /**
     * Создает префаб в нужном контенте
     * @param {cc.String} puth путь до префаба в каталоге resource
     * @param {cc.Vec2} point точка где создать
     */
    _createPrefab(puth, point) {
        cc.loader.loadRes(puth, (err, prefab) => {
            this._targetAnimal = cc.instantiate(prefab);
            let myEvent = new cc.Event.EventCustom('createAnimal', true);
            myEvent.detail = {
                animal: this._targetAnimal,
                point: point
            };
            this.node.dispatchEvent(myEvent);
        });
    },
});

export { FactoryAnimalPrefab};