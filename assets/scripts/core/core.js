//import {Animal, Graph, Elephant, Lion, Zebra, Mouse, Hyena} from './animal-behaviour/animal-behaviour';

import { Communicator, CommunicationEvents as Events, EventSystemBuilder } from './animal-behaviour/animal-behaviour';

class System1 { 
    onEnduranceIncrease(param) { 
        console.log(param);
    }
    onAgeIncrease(param) { 
        console.log(param);
    }
}

class System2 { 
    onEnduranceIncrease(param) { 
        console.log(param);
    }
    onAgeIncrease(param) { 
        console.log(param);
    }
}
var system1 = new System1();
var system2 = new System2(); 
var eventSystemBuilder1= new EventSystemBuilder();
var eventSystemBuilder2 = new EventSystemBuilder();

var communicator1 = eventSystemBuilder1.add(Events.endurance.decrease, {
    system: system1,
    link: system1.onEnduranceIncrease
}).build();

var communicator2 = eventSystemBuilder2.addAll(Events.endurance.increase, [{
    system: system1,
    link: system1.onEnduranceIncrease
}, {
    system: system2,
    link: system2.onEnduranceIncrease
}]).addAll(Events.age.increase, [{
    system: system1,
    link: system1.onAgeIncrease
}, {
    system: system2,
    link: system2.onAgeIncrease    
}]).build();

cc.log(communicator1);
cc.log(communicator2);

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
