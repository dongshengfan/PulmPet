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
class LionFactory {
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
        return new LionStateFactory(this._lion).create();
    }

    /**
     * Сборка коммуникатора
     * @param {MuscularSystem} muscularSystem
     * @param {CirculatorySystem} circulatorySystem
     * @returns {EventSystemBuilder}
     * @memberOf LionFactory
     */
    _createCommunicator(muscularSystem, circulatorySystem) {
        var eventSystemBuilder = new EventSystemBuilder();
        this._onInCirculatorySystem(eventSystemBuilder, circulatorySystem)
            ._onInMuscularSystem(eventSystemBuilder, muscularSystem);

        return eventSystemBuilder.build();
    }

    /**
     * Заполнение на что откликается кровиностная система
     * 
     * @param {EventSystemBuilder} event
     * @param {CirculatorySystem} system
     * @returns this
     * 
     * @memberOf LionFactory
     */
    _onInCirculatorySystem(event, system) {
        event.add(Events.weight.increase, {
            system: system,
            link: system.onWeightIncrease
        })
            .add(Events.weight.decrease, {
                system: system,
                link: system.onWeightDecrease
            });
        return this;
    }

    /**
     * Заполнение на что откликается опорнодвигательная система
     * 
     * @param {EventSystemBuilder} event 
     * @param {MuscularSystem} system
     * @returns this
     * 
     * @memberOf LionFactory
     */
    _onInMuscularSystem(event, system) {
        event.add(Events.heartbeat.increase, {
            system: system,
            link: system.onHeartbeatIncrease
        })
            .add(Events.heartbeat.decrease, {
                system: system,
                link: system.onHeartbeatDecrease
            })
            .add(Events.pressure.increase, {
                system: system,
                link: system.onPressureIncrease
            })
            .add(Events.pressure.decrease, {
                system: system,
                link: system.onPressureDecrease
            });
        return this;
    }

    /**
     * Сборка опорнодвигательной системы
     * 
     * @param {JSON} params
     * @returns {MuscularSystem}
     * 
     * @memberOf LionFactory
     */
    _createMuscularSystem(params) {
        var {state, speed, weight} = params.scales;
        var speedBuilder = new SystemScaleBuilder(speed.params);
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
     * 
     * @param {JSON} params
     * @returns {CirculatorySystem}
     * 
     * @memberOf LionFactory
     */
    _createCirculatorySystem(params) {
        var {state, pressure, heartbeat} = params.scales;
        var pressureBuilder = new SystemScaleBuilder(pressure.params);
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