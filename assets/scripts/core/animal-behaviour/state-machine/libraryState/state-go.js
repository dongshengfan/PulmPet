/**
 * Created by shaba on 13.02.2017.
 */
import { PrimitiveState } from '../states/export-states';

export class StateGo extends PrimitiveState {


    constructor(model, isEndPoint = false, routeEngine = null) {
        super("Go", model, isEndPoint, routeEngine);

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
        setTimeout(() => { resolveFn(); }, 3000);
        return promise;

    }

}