/**
 * Created by shaba on 13.02.2017.
 */
import { PrimitiveState } from '../states/export-states';

export class StateStart extends PrimitiveState {

    constructor(model, isEndPoint = false, routeEngine = null) {
        super("Start", model, isEndPoint, routeEngine);

    }
    /**
     * @returns {Promise}
     *
     * @memberOf LionStart
     */
    run() {
        let resolveFn, rejectFn;
        let promise = new Promise((resolve, reject) => {
            resolveFn = resolve;
            rejectFn = reject;
        });
        cc.log('Начал жить');

        this._model._circulatory.changeHeartbeat(0.001);
        this._model._circulatory.changePressure(0.001);
        this._model._muscular.changeSpeed(0.001);
        this._model._muscular.changeWeight(0.001);

        setTimeout(() => { resolveFn(); }, 4000);
        return promise;

    }

}