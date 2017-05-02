'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var FactoryAnimalPrefab = cc.Class({
    extends: cc.Component,

    properties: {
        _targetAnimal: cc.Node,
        wayToPrefab: 'prefabs/animal/LionSheath',
        wayToModel: './model', //Путь до модели
        nameAnimal: 'animal' },

    /**
     * Создает животное
     * @param {cc.Event} event
     */
    createAnimal: function createAnimal(event) {
        //  cc.log(event);
        // let pointTouch = event.getStartLocation();
        this._createPrefab();
    },


    /**
     * Создает префаб в нужном контенте
     * @see {string} wayToPrefab путь до префаба
     */
    _createPrefab: function _createPrefab() {
        var _this = this;

        cc.loader.loadRes(this.wayToPrefab, function (err, prefab) {
            _this._targetAnimal = cc.instantiate(prefab);

            var myEvent = new cc.Event.EventCustom('createAnimal', true);
            myEvent.detail = {
                animal: _this._settingsAnimal(_this._targetAnimal),
                puthToModel: _this.puthToModel
            };
            _this.node.dispatchEvent(myEvent);
        });
    },


    /**
     *
     * @param nodeAnimal
     * @returns {*}
     * @private
     */
    _settingsAnimal: function _settingsAnimal(nodeAnimal) {
        nodeAnimal.name = this.nameAnimal;

        return nodeAnimal;
    }
});

exports.FactoryAnimalPrefab = FactoryAnimalPrefab;