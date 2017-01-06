import {PrimitiveState, StateMachine, Animal, SimpleRouteEngine, Route} from './animal-behaviour/animal-behaviour';

var animal = new Animal();
var primitiveState1 = new PrimitiveState('state1', animal),
    primitiveState2 = new PrimitiveState('state2', animal),
    primitiveState3 = new PrimitiveState('state3', animal, null, true);

primitiveState1.setRouteEngine(new SimpleRouteEngine(animal, [
    new Route(primitiveState2, (model) => { 
        cc.log(2);
        return true;
    })
]));

primitiveState2.setRouteEngine(new SimpleRouteEngine(animal, [
    new Route(primitiveState3, (model) => { 
        cc.log(3);
        return true;
    })
]));

var machine = new StateMachine(primitiveState1);
machine.run();
cc.log('end');