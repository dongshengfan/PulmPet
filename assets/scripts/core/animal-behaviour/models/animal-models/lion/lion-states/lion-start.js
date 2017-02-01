import { PrimitiveState } from '../../../../state-machine/states/export-states';
import { Animal } from '../../animal';

export class LionStart extends PrimitiveState{
    /**
     * @type {Animal}
     * @memberOf Start
     */
    _model;
    
    constructor(name, model, isEndPoint = false, routeEngine = null) {
        super(name, model, isEndPoint, routeEngine);
        
    }
    run(){
        return new Promise((resolve, reject) => {
            cc.log('Начал жить');
            
            this._model._circulatory.changeHeartbeat(0.001);
            this._model._circulatory.changePressure(0.001);
            this._model._muscular.changeSpeed(0.001);
            this._model._muscular.changeWeight(0.001);

            setTimeout(()=>{resolve();},4000);    
        });

    }
    
}