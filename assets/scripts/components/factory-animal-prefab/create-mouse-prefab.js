import { FactoryAnimalPrefab } from './factory-animal-prefab';

var CreateLionPrefab = cc.Class({
    extends: FactoryAnimalPrefab,
    
    properties: { 
        puthToPrefab:'prefabs/animal/Mouse',//путь от папки resource до необходимого префаба
        
    },
 


});