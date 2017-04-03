var FactoryAnimalPrefab = cc.Class({
    extends: cc.Component,

    properties: {
        _targetAnimal: cc.Node,
        wayToPrefab:'prefabs/animal/LionSheath',
        wayToModel: './model',//Путь до модели
        nameAnimal: 'animal',//Имя животного
    },

    /**
     * Создает животное
     * @param {cc.Event} event
     */
    createAnimal(event) {
      //  cc.log(event);
       // let pointTouch = event.getStartLocation();
        this._createPrefab();
    },

    /**
     * Создает префаб в нужном контенте
     * @see {string} wayToPrefab путь до префаба
     */
    _createPrefab() {
        cc.loader.loadRes(this.wayToPrefab, (err, prefab) => {
            this._targetAnimal = cc.instantiate(prefab);

            let myEvent = new cc.Event.EventCustom('createAnimal', true);
            myEvent.detail = {
                animal: this._settingsAnimal(this._targetAnimal),
                puthToModel:this.puthToModel,
            };
            this.node.dispatchEvent(myEvent);
        });
    },

    /**
     *
     * @param nodeAnimal
     * @returns {*}
     * @private
     */
    _settingsAnimal(nodeAnimal){
        nodeAnimal.name=this.nameAnimal;

        return nodeAnimal;
    },
});

export { FactoryAnimalPrefab};