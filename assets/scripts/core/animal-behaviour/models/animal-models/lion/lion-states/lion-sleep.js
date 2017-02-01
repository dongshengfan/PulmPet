import { PrimitiveState } from '../../../../state-machine/states/export-states';
import { Animal } from '../../animal';

export class LionSleep extends PrimitiveState {
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
     * @memberOf LionSleep
     */
    run() {
        return new Promise((resolve, reject) => {
            cc.log('сплю');
            this._model._circulatory.changeHeartbeat(-0.7);
            this._model._circulatory.changePressure(-0.9);
            this._model._muscular.changeSpeed(0.9);
            this._model._muscular.changeWeight(0.8);
            setTimeout(() => { resolve(); }, 4000);
        });

    }

}