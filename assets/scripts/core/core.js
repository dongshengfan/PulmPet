//import {Animal, Graph, Elephant, Lion, Zebra, Mouse, Hyena} from './animal-behaviour/animal-behaviour';

import { Communicator, CommunicationEvents as Events, EventSystemBuilder, SpeechSystem, ReproductionSystem, SystemFunctionFactory, SystemFunctionTypes } from './animal-behaviour/export-animal-behaviour';



var speech = new SpeechSystem();
var reproduction = new ReproductionSystem();
var eventSystemBuilder2 = new EventSystemBuilder();

var communicator2 = eventSystemBuilder2.add(Events.endurance.increase, {
    system: speech,
    link: speech.onEnduranceIncrease
}).add(Events.age.increase, {
    system: reproduction,
    link: reproduction.onAgeIncrease
}).build();

//communicator2.publish(Events.endurance.increase, 'test');

//cc.log(speech._getPercentageInScale(20, -20, 40));

var factory = new SystemFunctionFactory();
var lineSystemFunction = factory.create(SystemFunctionTypes.line, {
    coefficient: 4
});
cc.log(lineSystemFunction.calculate({
    value: 2
}));