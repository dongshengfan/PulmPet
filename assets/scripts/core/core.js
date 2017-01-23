//import {Animal, Graph, Elephant, Lion, Zebra, Mouse, Hyena} from './animal-behaviour/animal-behaviour';

import { Communicator, CommunicationEvents as Events, EventSystemBuilder, SpeechSystem, ReproductionSystem, SystemFunctionFactory, SystemFunctionTypes, AnimalFactory, AnimalTypes } from './animal-behaviour/export-animal-behaviour';


var animalFactory = AnimalFactory.instance();

var params = {
    animal: {
        //здесь будут парметры для конструктора животного
    },
    systems: {
        //здесь настройки систем животного
        muscular: {
            scale: {
                //здесь настройки шкал
            },
            functions: [
                //здесь настройки функций
                {
                    type: SystemFunctionTypes.line,
                    params: {
                        //параметры функций
                        coefficient: 40,
                        free: 99
                    }
                }
            ]
        },
        circulatory: {
            scale: {
                //здесь настройки шкал
                heartbeat: {
                    current: 20,
                    max: 90,
                    min: 10,
                },
                pressure: {
                    current: 120,
                    max: 290,
                    min: 70,
                }
            },
            functions: [
                //здесь настройки функций
                {
                    type: SystemFunctionTypes.line,
                    params: {
                        //параметры функций
                        coefficient: 4,
                        free: 9
                    }
                },
                {
                    type: SystemFunctionTypes.quadratic,
                    params: {
                        //параметры функций
                        coefficientA: 8,
                        coefficientB: 2,
                        free: 0
                    }
                }
            ]
        }
    }
};
var lion = animalFactory.create(AnimalTypes.lion, params);
cc.log(lion);