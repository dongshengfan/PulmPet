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
                    }
                }
            ]
        },
        circulatory: {
            scale: {
                //здесь настройки шкал
            },
            functions: [
                //здесь настройки функций
                {
                    type: SystemFunctionTypes.line,
                    params: {
                        //параметры функций
                    }
                },
                {
                    type: SystemFunctionTypes.parabolic,
                    params: {
                        //параметры функций
                    }
                }
            ]
        }
    }
};
var lion = animalFactory.create(AnimalTypes.lion, params);
cc.log(lion);