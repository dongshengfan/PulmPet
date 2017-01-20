import {Animal, Graph, Elephant, Lion, Zebra, Mouse, Hyena} from './animal-behaviour/animal-behaviour';

import { Communicator } from './animal-behaviour/models/system-comminication/communicator';
import { CommunicationEvents as Events } from './animal-behaviour/models/system-comminication/events';

class Test { 
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
communicator.publish(Events.endurance.decrease, 'none');
