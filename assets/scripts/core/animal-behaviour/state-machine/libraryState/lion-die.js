import { PrimitiveState } from '../states/export-states';

export class LionDie extends PrimitiveState {

    constructor(name, model, isEndPoint = false, routeEngine = null) {
        super(name, model, isEndPoint, routeEngine);

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