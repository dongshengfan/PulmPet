import { APICore } from '../../core/api-core';
cc.Class({
    extends: cc.Component,

    properties: {
        textState: cc.Label,
        _massNodeAnimal: [],
        _massAnimal: [],
        _currentId: 0,//Индекс животного которое сейчс в таргете
        _currentLenght: 0,//текущее количество систем у животного
        characteristicContent: cc.Node,
        prefabChContent: cc.Prefab,
    },

    onLoad() {
        this.API = APICore.instance();
    },

    setText(str){
        this.textState.string = str;
    },

    onAnimalClickStart(id){
        this._currentId = id;
        // cc.log(this._massAnimal[id]);
        //Заполняем бокс характеристиками
        this._currentLenght = this._massAnimal[id]._communicator._mapScale.length;
        this.characteristicContent.children.forEach((item) => {
            item.destroy();
        });
        for (let i = 0; i < this._currentLenght; i++) {
            this._target = cc.instantiate(this.prefabChContent);
            this._target.children[0].getComponent(cc.Label).string = this._massAnimal[id]._communicator._mapScale[i]._name;
            this._target.children[1].getComponent(cc.Label).string = 'wd';
            this._target.children[2].getComponent(cc.Label).string = 'wd';
            this._target.setPosition(0, 0);
            this.characteristicContent.addChild(this._target);
        }


    },
    update(dt){

        for(let i=0;i< this._currentLenght;i++){
            this.characteristicContent.children[i].children[1].getComponent(cc.Label).string=this._massAnimal[this._currentId]._communicator._mapScale[i].current.toFixed(2);
            this.characteristicContent.children[i].children[2].getComponent(cc.Label).string=this._massAnimal[this._currentId]._communicator._mapScale[i].scale.toFixed(3);

        }
    },


});