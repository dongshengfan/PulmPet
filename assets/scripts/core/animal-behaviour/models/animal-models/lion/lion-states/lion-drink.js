import { PrimitiveState } from '../../../../state-machine/states/export-states';
import { Animal } from '../../animal';

export class LionDrink extends PrimitiveState {
    /**
     * @type {Animal}
     * @memberOf Drink
     */
    _model;

    constructor(name, model, isEndPoint = false, routeEngine = null) {
        super(name, model, isEndPoint, routeEngine);

    }
    /**
     * @returns {Promise}
     * 
     * @memberOf LionDrink
     */
    run() {
        return new Promise((resolve, reject) => {
            cc.log('Пью воду');
            this._model._circulatory.changeHeartbeat(0.001);
            this._model._circulatory.changePressure(0.001);
            this._model._muscular.changeSpeed(0.001);
            this._model._muscular.changeWeight(0.001);
            setTimeout(() => { resolve(); }, 4000);
        });

    }

}