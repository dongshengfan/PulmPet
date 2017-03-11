import { FactoryAnimalPrefab } from './factory-animal-prefab';

var CreateMousePrefab = cc.Class({
    extends: FactoryAnimalPrefab,

    properties: {
        wayToPrefab:'prefabs/animal/AnimalMouse',
        puthToModel: '',//Путь до модели
        nameAnimal: '',//Имя животного
    },


});