import { Animal } from '../animal';
import { CommunicationEvents as Events, EventSystemBuilder } from               '../../system-communication/export-system-communication';
import { MuscularSystem, CirculatorySystem } from '../../system-animal/export-system-animal';
import { SystemScale, SystemScaleBuilder } from '../../system-scales/export-system-scales';
import { LineSystemFunction, SystemFunctionTypes } from '../../system-functions/export-system-functions';

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
        var muscularSystem = this._createMuscularSystem(params.systems.muscular),
            circulatorySystem = this._createCirculatorySystem(params.systems.circulatory);
        
        var communicator = this._createCommunicator(muscularSystem, circulatorySystem); 

        this._lion = new Animal(params.animal, {
            muscular: muscularSystem,
            circulatory: circulatorySystem
        }, communicator);
    }

    create() { 
        return this._lion;
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

        return eventSystemBuilder.add(Events.speed.increase, {
            system: circulatorySystem,
            link: circulatorySystem.onSpeedIncrease
        }).add(Events.weight.increase, {
            system: circulatorySystem,
            link: circulatorySystem.onWeightIncrease
        }).build();
    }

    /**
     * Сборка опорно-двигательной системы
     * @memberOf LionFactory
     */
    _createMuscularSystem(params) {
        var speedBuilder  = new SystemScaleBuilder(params);
        var weightBuilder = new SystemScaleBuilder(params);
        
        speedBuilder.addFunction({
            type: SystemFunctionTypes.line,
            params: params
        });

        weightBuilder.addFunction({
            type: SystemFunctionTypes.line,
            params: params
        });
       
        return new MuscularSystem(speedBuilder.build(), weightBuilder.build());
    }

    /**
     * Сборка кровеносной системы
     * @memberOf LionFactory
     */
    _createCirculatorySystem(params) {
        var pressureBuilder  = new SystemScaleBuilder(params.scale.pressure);
        var heartbeatBuilder = new SystemScaleBuilder(params.scale.heartbeat);

        pressureBuilder.addFunction({
            type: SystemFunctionTypes.line,
            params: params
        });

        heartbeatBuilder.addFunction({
            type: SystemFunctionTypes.line,
            params: params
        });
       
        return new CirculatorySystem(pressureBuilder.build(), heartbeatBuilder.build());
    }
}

export { LionFactory };