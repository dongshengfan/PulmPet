import { Animal } from '../../animal';
import { PrimitiveState, StateMachine, SimpleRouteEngine, Route, State } from '../../../../state-machine/export';

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
            state1: new PrimitiveState('state1', this._animal),
            state2: new PrimitiveState('state2', this._animal),
            state3: new PrimitiveState('state3', this._animal, true),
        }
    }

    /**
     * @param {any} states
     * @returns {State}
     * @memberOf LionStateFactory
     */
    _createRoutes(states) { 
        states.state1.setRouteEngine(new SimpleRouteEngine([
            new Route(states.state2, (model) => {
                cc.log(2);
                return true;
            })
        ]));

        states.state2.setRouteEngine(new SimpleRouteEngine([
            new Route(states.state3, (model) => { 
                cc.log(3);
                return true;
            })
        ]));
        
        return states.state1;
    }
}

export { LionStateFactory }