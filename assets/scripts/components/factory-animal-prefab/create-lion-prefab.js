import { FactoryAnimalPrefab } from './factory-animal-prefab';
import {lionParams} from '../../core/lion-params';
var CreateLionPrefab = cc.Class({
    extends: FactoryAnimalPrefab,
    
    properties: { 
        puthToPrefab:'prefabs/animal/Lion',//путь от папки resource до необходимого префаба
        //возможно тут укажимкакие ресурсы надокуда пробрость но не сейчас

    },
    getJson(){
        return lionParams;
    }
});