/**
 * Created by shaba on 13.02.2017.
 */
import { PrimitiveState } from '../states/export-states';

export class StateDie extends PrimitiveState {

    constructor(model, isEndPoint = false, routeEngine = null) {
        super("Die", model, isEndPoint, routeEngine);

    }

    run() {
        let resolveFn, rejectFn;
        let promise = new Promise((resolve, reject) => {
            resolveFn = resolve;
            rejectFn = reject;
        });

        cc.log('умер');



        setTimeout(() => { resolveFn(); }, 4000);
        return promise;

    }

}