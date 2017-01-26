import { PrimitiveState } from '../../../../state-machine/states/state-type/primitive-state';

export default class Stand extends PrimitiveState{
    constructor(name, model, isEndPoint = false) {
        super(name,model,isEndPoint,null);
    }
    run(){
        let model=this._model;
        //   model._circulatory.
    }
}