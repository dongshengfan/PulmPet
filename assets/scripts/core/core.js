//import {Animal, Graph, Elephant, Lion, Zebra, Mouse, Hyena} from './animal-behaviour/animal-behaviour';

import { Communicator, CommunicationEvents as Events, EventSystemBuilder, SpeechSystem, ReproductionSystem }
    from './animal-behaviour/animal-behaviour';

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

communicator2.publish(Events.endurance.increase, 'test');
/*class Test { 
    increase(params) { 
        cc.log(params);
    }
}

class Test1 { 
    increase1(params) { 
        cc.log(params);
    }
}

var test = new Test();
var test1 = new Test1();
var communicator = new Communicator();
communicator.register(Events.endurance.increase, test.increase);
communicator.register(Events.endurance.increase, test1.increase1);

communicator.publish(Events.endurance.increase, 'parameters');
communicator.publish(Events.endurance.decrease, 'none');*/
