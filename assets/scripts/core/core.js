import { Communicator, CommunicationEvents as Events, EventSystemBuilder, SpeechSystem, ReproductionSystem, SystemFunctionFactory, SystemFunctionTypes, AnimalFactory, AnimalTypes, lionParams } from './animal-behaviour/export-animal-behaviour';

import { PrimitiveState, StateMachine, Animal, SimpleRouteEngine, Route } from './animal-behaviour/export-animal-behaviour'


var animalFactory = AnimalFactory.instance();
var lion = animalFactory.create(AnimalTypes.lion, lionParams);
lion.run();
cc.log('end');