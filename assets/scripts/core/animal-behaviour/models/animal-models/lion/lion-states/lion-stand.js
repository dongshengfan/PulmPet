import { PrimitiveState } from '../../../../state-machine/states/export-states';

export class Stand extends PrimitiveState{
    constructor(name, model, isEndPoint = false, routeEngine = null) {
        super(name, model, isEndPoint, routeEngine);
    }
    run(){
        let model=this._model;
        //   model._circulatory.
    }
}