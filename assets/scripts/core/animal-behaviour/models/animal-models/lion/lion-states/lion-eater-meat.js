import { PrimitiveState } from '../../../../state-machine/states/export-states';
import { Animal } from '../../animal';

export class LionEaterMeat extends PrimitiveState {
    /**
     * @type {Animal}
     * @memberOf EaterMeat
     */
    _model;

    constructor(name, model, isEndPoint = false, routeEngine = null) {
        super(name, model, isEndPoint, routeEngine);

    }
    /**
     * @returns {Promise}
     * 
     * @memberOf LionEaterMeat
     */
    run() {
        let resolveFn, rejectFn;
        let promise = new Promise((resolve, reject) => {
            resolveFn = resolve;
            rejectFn = reject;
        });
        cc.log('ем мясо');
        this._model._circulatory.changeHeartbeat(0.5);
        this._model._circulatory.changePressure(0.2);
        this._model._muscular.changeSpeed(-0.4);
        this._model._muscular.changeWeight(-0.5);
        setTimeout(() => { resolveFn(); }, 4000);
        return promise;
    }

}