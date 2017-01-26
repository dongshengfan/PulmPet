import { Animal } from '../../animal';
import { CommunicationEvents as Events, EventSystemBuilder } from '../../../system-communication/export-system-communication';
import { MuscularSystem, CirculatorySystem } from '../../../system-animal/export-system-animal';
import { SystemScale, SystemScaleBuilder } from '../../../system-scales/export-system-scales';
import { LineSystemFunction, SystemFunctionTypes } from '../../../system-functions/export-system-functions';
import { LionStateFactory } from './lion-states-factory';

/**
 * Абстрактная фабрика львов
 * @export
 * @class LionFactory
 */
class LionFactory  {
    /**
     * @type {Animal}
     */
    _lion;
    
    constructor(params) {
        var muscularSystem    = this._createMuscularSystem(params.systems.muscular),
            circulatorySystem = this._createCirculatorySystem(params.systems.circulatory);
        
        var communicator = this._createCommunicator(muscularSystem, circulatorySystem); 

        this._lion = new Animal(params.animal, {
            muscular: muscularSystem,
            circulatory: circulatorySystem
        }, communicator);
    }

    create() {
        return new LionStateFactory(this._lion).create();
    }

    /**
     * Сборка коммуникатора
     * @param {MuscularSystem} muscularSystem
     * @param {CirculatorySystem} circulatorySystem
     * @returns
     * @memberOf LionFactory
     */
    _createCommunicator(muscularSystem, circulatorySystem) { 
        var eventSystemBuilder = new EventSystemBuilder();

        return eventSystemBuilder

        .add(Events.weight.increase, {
            system: circulatorySystem,
            link: circulatorySystem.onWeightIncrease
        })
        .add(Events.weight.decrease, {
            system: circulatorySystem,
            link: circulatorySystem.onWeightDecrease
        })

        .add(Events.heartbeat.increase, {
            system: muscularSystem,
            link: muscularSystem.onHeartbeatIncrease
        })
        .add(Events.heartbeat.decrease, {
            system: muscularSystem,
            link: muscularSystem.onHeartbeatDecrease
        })
        .add(Events.pressure.increase, {
            system: muscularSystem,
            link: muscularSystem.onPressureIncrease
        })
        .add(Events.pressure.decrease, {
            system: muscularSystem,
            link: muscularSystem.onPressureDecrease
        })

        .build();
    }

    /**
     * Сборка опорно-двигательной системы
     * @memberOf LionFactory
     */
    _createMuscularSystem(params) {
        var {state, speed, weight} = params.scales;
        var speedBuilder  = new SystemScaleBuilder(speed.params);
        var weightBuilder = new SystemScaleBuilder(weight.params);
        var systemState = new SystemScaleBuilder(state.params);  

        systemState.addAllFunctions(state.functions); 
        speedBuilder.addAllFunctions(speed.functions);
        weightBuilder.addAllFunctions(weight.functions);       
       
        return new MuscularSystem(
            systemState.build(),
            speedBuilder.build(),
            weightBuilder.build()
        );
    }

    /**
     * Сборка кровеносной системы
     * @memberOf LionFactory
     */
    _createCirculatorySystem(params) {
        var {state, pressure, heartbeat} = params.scales;
        var pressureBuilder  = new SystemScaleBuilder(pressure.params);
        var heartbeatBuilder = new SystemScaleBuilder(heartbeat.params);
        var systemState = new SystemScaleBuilder(state.params);  

        systemState.addAllFunctions(state.functions); 
        pressureBuilder.addAllFunctions(pressure.functions);
        heartbeatBuilder.addAllFunctions(heartbeat.functions);
       
        return new CirculatorySystem(
            systemState.build(),
            pressureBuilder.build(),
            heartbeatBuilder.build()
        );
    }
}

export { LionFactory };