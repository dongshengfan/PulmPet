import { FactoryAnimalPrefab } from './factory-animal-prefab';

var CreateLionPrefab = cc.Class({
    extends: FactoryAnimalPrefab,

    properties: {
        wayToPrefab:'prefabs/animal/AnimalLion',
        puthToModel: '',//Путь до модели
        nameAnimal: '',//Имя животного
    },
});