import { Animal } from '../animal';
import { CommunicationEvents as Events, EventSystemBuilder } from               '../../system-communication/export-system-communication';
import { MuscularSystem, CirculatorySystem } from '../../system-animal/export-system-animal';
import { SystemScale } from '../../system-scales/export-system-scales';
import { LineSystemFunction, SystemFunctionFactory, SystemFunctionTypes } from '../../system-functions/export-system-functions';

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
    
    /**
     * @type {SystemFunctionFactory}
     * @memberOf LionFactory
     */
    _functionsFactory;

    constructor(params) {
        this._functionsFactory = SystemFunctionFactory.instance();

        var muscularSystem = this._createMuscularSystem(params),
            circulatorySystem = this._createCirculatorySystem(params);
        
        var communicator = this._createCommunicator(muscularSystem, circulatorySystem); 

        this._lion = new Animal(params, {
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
        //создание функций зависимостей параметров
        var speedLineFunction = this._functionsFactory.create(SystemFunctionTypes.line, params),
            weightLineFunction = this._functionsFactory.create(SystemFunctionTypes.line, params);
        
        var speedFunctions = {};
        speedFunctions[SystemFunctionTypes.line] = speedLineFunction;

        var weightFunctions = {};
        weightFunctions[SystemFunctionTypes.line] = weightLineFunction;

        //создание шкал
        var speed = new SystemScale(params, speedFunctions),
            weight = new SystemScale(params, weightFunctions);
        
        return new MuscularSystem(speed, weight);
    }

    /**
     * Сборка кровеносной системы
     * @memberOf LionFactory
     */
    _createCirculatorySystem(params) {
        //создание функций зависимостей параметров
        var pressureLineFunction = this._functionsFactory.create(SystemFunctionTypes.line, params),
            heartbeatLineFunction = this._functionsFactory.create(SystemFunctionTypes.line, params);

        var pressureFunctions = {};
        pressureFunctions[SystemFunctionTypes.line] = pressureLineFunction;

        var heartbeatFunctions = {};
        heartbeatFunctions[SystemFunctionTypes.line] = heartbeatLineFunction;

        //создание шкал
        var pressure = new SystemScale(params, pressureFunctions),
            heartbeat = new SystemScale(params, heartbeatFunctions);
        
        return new CirculatorySystem(pressure, heartbeat);
    }
}

export { LionFactory };