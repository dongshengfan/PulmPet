import { PrimitiveState } from '../../../../state-machine/states/export-states';
import { Animal } from '../../animal';

export class LionDie extends PrimitiveState{
    /**
     * @type {Animal}
     * @memberOf Start
     */
    _model;
    
    constructor(name, model, isEndPoint = false, routeEngine = null) {
        super(name, model, isEndPoint, routeEngine);
        
    }
    run(){
        cc.log('умер');
       //this._model._circulatory.changeHeartbeat(-90);   

    }
    
}