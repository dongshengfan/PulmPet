import { System } from '../systems';
import { CommunicationEvents as Events } from '../../system-communication/events';

class SpeechSystem extends System {
    constructor() { 
        super();
    }

    onEnduranceIncrease(param) {
        console.log(param);
        //this.trigger(Events.age.increase, param + 'new');
    }
}

export { SpeechSystem };