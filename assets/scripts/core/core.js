import {PrimitiveState, StateMachine, Animal, SimpleRouteEngine, Route} from './animal-behaviour/animal-behaviour';

var animal = new Animal();
var primitiveState1 = new PrimitiveState('state1', animal),
    primitiveState2 = new PrimitiveState('state2', animal),
    primitiveState3 = new PrimitiveState('state3', animal);

primitiveState1.setRouteEngine(new SimpleRouteEngine(null, [
    new Route(primitiveState2, null)
]));

primitiveState2.setRouteEngine(new SimpleRouteEngine(null, [
    new Route(primitiveState3, null)
]));

var machine = new StateMachine(primitiveState1);
//machine.run();
//var primitiveState = new PrimitiveState('state1', animal, );
//a.add(new State());
cc.log('test');