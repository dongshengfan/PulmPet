import { Animal } from '../../animal';
import { SimpleRouteEngine } from '../../../../state-machine/routes/engines/simple-route-engine';
import { Route }  from '../../../../state-machine/routes/route';
import { State, PatternState,PrimitiveState } from '../../../../state-machine/states/export-states';
import { StateMachine } from '../../../../state-machine/state-machine';
import { Stand } from '../lion-states/export-lion-states';

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
            state1: new Stand('state1', this._animal),
            state2: new Stand('state2', this._animal),
            state3: new Stand('state3', this._animal, true)
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