import { Animal } from '../../animal';
import { SimpleRouteEngine } from '../../../../state-machine/routes/engines/simple-route-engine';
import { ProbabilityRouteEngine } from '../../../../state-machine/routes/engines/probability-route-engine';
import { Route } from '../../../../state-machine/routes/route';
import { State, PatternState, PrimitiveState } from '../../../../state-machine/states/export-states';
import { StateMachine } from '../../../../state-machine/state-machine';
import { LionGo, LionRun, LionSleep, LionStand, LionDie, LionDrink, LionEaterGrass, LionEaterMeat, LionStart } from '../lion-states/export-lion-states';

class LionStateFactory {
    _animal;

    constructor(animal) {
        this._animal = animal;
    }

    /**
     * @returns {StateMachine}
     */
    create() {
        var states = this._createStates(),
            initialState = this._createRoutes(states);

        this._animal.setStateMachine(new StateMachine(initialState));
        return this._animal;
    }

    /**
     * 
     * @returns
     * @memberOf LionStateFactory
     */
    _createStates() {
        return {
            state1: new LionStart('start',this._animal),
            stand: new LionStand('stand', this._animal),
            sleep: new LionSleep('sleep', this._animal),
            run: new LionRun('run', this._animal),
            go: new LionGo('go', this._animal),
            eaterMeat: new LionEaterMeat('eaterMeat',this._animal),
            eaterGrass: new LionEaterGrass('eaterGrass',this.animal),
            drink: new LionDrink('drink',this.animal),
            die: new LionDie('die',this.animal,true)
        }
    }

    /**
     * @param {any} states
     * @returns {State}
     * @memberOf LionStateFactory
     */
    _createRoutes(states) {
        states.state1.setRouteEngine(new ProbabilityRouteEngine([
            new Route(states.stand, (model, probability) => {
                cc.log(probability);
                return true;                
            }),
            new Route(states.sleep, (model, probability) => {
                cc.log(probability);
                return true;
            })
        ],new SimpleRouteEngine([
            new Route(states.state1, (model) => {
                return true;                
            })
        ])));

        states.stand.setRouteEngine(new ProbabilityRouteEngine([
            new Route(states.sleep, (model, probability) => {
                cc.log(probability);
                return true;
            })
        ]));

        states.sleep.setRouteEngine(new ProbabilityRouteEngine([
            new Route(states.die, (model, probability) => {
                cc.log(probability);
                return true;
            })
        ]));

        return states.state1;
    }
}

export { LionStateFactory }