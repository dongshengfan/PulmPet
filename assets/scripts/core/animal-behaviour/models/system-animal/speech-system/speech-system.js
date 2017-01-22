import { System } from '../system';
import { CommunicationEvents as Events } from '../../system-communication/export-system-communication';

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