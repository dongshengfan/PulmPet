import { PrimitiveState } from '../../../../state-machine/states/export-states';
import { Animal } from '../../animal';

export class LionGo extends PrimitiveState {
    /**
     * @type {Animal}
     * @memberOf Stand
     */
    _model;

    constructor(name, model, isEndPoint = false, routeEngine = null) {
        super(name, model, isEndPoint, routeEngine);

    }
    /**
     * @returns {Promise}
     * 
     * @memberOf LionGo
     */
    run() {
        let resolveFn, rejectFn;
        let promise = new Promise((resolve, reject) => {
            resolveFn = resolve;
            rejectFn = reject;
        });
        cc.log('иду');
        this._model._circulatory.changeHeartbeat(0.1);
        this._model._circulatory.changePressure(0.01);
        this._model._muscular.changeSpeed(-0.1);
        this._model._muscular.changeWeight(-0.1);
        setTimeout(() => { resolveFn(); }, 4000);
        return promise;

    }

}