import { FactoryAnimalPrefab } from './factory-animal-prefab';
import {mouseParams} from '../../core/mouse-params';
var CreateMousePrefab = cc.Class({
    extends: FactoryAnimalPrefab,
    
    properties: { 
        puthToPrefab:'prefabs/animal/Mouse',//путь от папки resource до необходимого префаба
        //возможно тут укажимкакие ресурсы надокуда пробрость но не сейчас
    },

    getJson(){
        return mouseParams;
    }

});